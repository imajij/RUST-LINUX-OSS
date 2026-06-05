import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-15',
  track: 'linux',
  chapter: 15,
  title: 'Kernel Contribution Workflow',
  summary: `Writing kernel code is only half the job; getting it accepted is the other half, and it runs on a process that looks alien if you have only ever used GitHub pull requests. The Linux kernel is developed almost entirely over email: you format each change as a patch, attach a legal sign-off, find the right maintainers, mail the patch to a list, and iterate through public review until a maintainer applies it to their subsystem tree. This chapter walks the whole pipeline end to end - coding style and the checkpatch linter that enforces it, building clean commits and turning them into mailable patches with git format-patch and git send-email, the Developer Certificate of Origin behind Signed-off-by, routing with get_maintainer.pl, how subsystem trees flow up into Linus's tree, review etiquette, and the merge-window and rc release cadence that decides when your work actually ships. The same habits - small reviewable commits, clear changelogs, patient public review - carry directly into Rust-for-Linux and most serious open-source projects.`,
  sections: [
    {
      heading: 'The mental model: email, not pull requests',
      body: `If you come from GitHub, the first thing to internalize is that the kernel does **not** develop on a web platform. There is no central "Linux repo" you open a PR against. Development happens on dozens of public **mailing lists**, one or more per subsystem, and the unit of work is a **patch** - a plain-text diff with a commit message - sent as an email.

The reason is historical and practical. Git itself was written by Linus Torvalds in 2005 specifically to support this distributed, email-driven model after the BitKeeper licensing fell through. Email is decentralized, scriptable, searchable, archived forever (on lore.kernel.org), and works for thousands of contributors with no single gatekeeping server. A maintainer can review a patch in any mail client, reply inline quoting the exact lines, and apply it with one command.

### The shape of the loop

The contribution loop has a small number of steps that you repeat:

1. Make a focused change as one or more clean git commits, each with a good message and a Signed-off-by line.
2. Run checkpatch.pl and build/test the result.
3. Use get_maintainer.pl to find who to send it to.
4. Generate patches with git format-patch and mail them with git send-email.
5. Respond to review on the list, revise, and send a new version (v2, v3, ...) until a maintainer applies it.
6. The maintainer carries it in their subsystem tree, which flows up to Linus during the next merge window.

> The single biggest beginner mistake is treating a kernel patch like a GitHub PR: a huge branch, a one-line description, and an expectation that someone else will clean it up. The kernel inverts all three - small patches, rich changelogs, and the burden of polish on you.`,
      code: [
        {
          lang: 'c',
          src: `// A "patch" is just a unified diff plus a commit message, e.g.:
//
//   Subject: [PATCH] drivers: foo: fix off-by-one in ring buffer index
//
//   The wrap check used >= capacity but the index was already
//   incremented, dropping one slot on every wrap. Compare before
//   the increment instead.
//
//   Signed-off-by: Ada Lovelace <ada@example.com>
//   ---
//    drivers/foo/ring.c | 2 +-
//    1 file changed, 1 insertion(+), 1 deletion(-)
//
// There is no web UI here: this text travels as an email body,
// and a maintainer applies it with 'git am'.`
        }
      ]
    },
    {
      heading: 'Kernel coding style: consistency as a feature',
      body: `The kernel has one canonical style, documented in Documentation/process/coding-style.rst, and it is not optional. The point is not that the rules are objectively best - it is that **one** consistent style across 30+ million lines lets any maintainer read any file without re-learning local conventions. Deviating to your personal taste is treated as noise that wastes reviewer time.

### The rules you will hit constantly

- **Tabs, 8 wide, for indentation.** Not spaces. Eight columns is deliberately wide so that deeply nested code becomes visually painful, nudging you to refactor rather than indent to the right margin.
- **Lines historically 80 columns**; the hard limit was relaxed to roughly 100, but 80 is still the norm and you should not chase the limit. Readability wins over packing.
- **Braces on the same line** as the statement for if/for/while/switch, but a function's opening brace goes on its **own** line. Omit braces for a single simple statement, but keep them if any branch of the same if/else needs them.
- **Naming:** lower_case_with_underscores for functions and variables, ALL_CAPS for macros and constants. No CamelCase, no Hungarian notation. Short local names (i, tmp, ret) are fine and encouraged in tight scopes; long descriptive names belong to globals.
- **One declaration per concept, no typedef hiding pointers**, and avoid typedef for plain structs - the reader should see struct foo.
- **Comments** use the /* ... */ form; do not add comments that merely restate the code. Functions that are part of an API get kernel-doc comments.

### Why style errors get patches rejected outright

A maintainer skimming a list will often reject a stylistically sloppy patch without reading the logic, because sloppiness signals the author did not run the standard checks and probably did not test either. Conforming to style is the cheapest possible way to signal competence and respect for the reviewer.

> Use the kernel's own tooling: clang-format with the in-tree .clang-format file, and the scripts/Lindent helper, can mechanically fix most spacing - but understand the rules, because tools cannot judge naming or structure.`,
      code: [
        {
          lang: 'c',
          src: `/* Function opening brace on its OWN line; 8-wide tabs to indent. */
static int foo_probe(struct platform_device *pdev)
{
	struct foo_dev *foo;
	int ret;

	foo = devm_kzalloc(&pdev->dev, sizeof(*foo), GFP_KERNEL);
	if (!foo)
		return -ENOMEM;        /* single statement: no braces */

	ret = foo_init(foo);
	if (ret) {                     /* braces because the body is multi-line */
		dev_err(&pdev->dev, "init failed: %d\\n", ret);
		return ret;
	}

	/* if/for/while/switch: brace stays on the SAME line as the keyword */
	for (int i = 0; i < foo->nch; i++)
		foo->ch[i].state = CH_IDLE;

	return 0;
}

/* sizeof(*ptr) not sizeof(struct foo_dev): survives type changes. */`
        }
      ]
    },
    {
      heading: 'checkpatch.pl: lint before a human ever sees it',
      body: `scripts/checkpatch.pl is the kernel's built-in style and sanity linter. It reads either a patch file or, with --file, a whole source file, and reports **errors** (things that will almost certainly get your patch bounced), **warnings** (things you should fix or be ready to justify), and **checks** (softer suggestions). Running it is effectively mandatory: many subsystems will not even look at a patch that fails checkpatch.

### What it catches

- Hard style violations: spaces instead of tabs, trailing whitespace, lines over the limit, missing or misplaced braces, C99 // comments in files that forbid them.
- Patch-format problems: a missing Signed-off-by, a malformed commit subject, an empty changelog body.
- Common bug patterns and idiom nits: use of printk instead of pr_/dev_ helpers, deprecated APIs, suspicious memory-barrier usage, assignment inside an if condition.

### How to run it well

Run it on the generated patch, not just the source, because some checks (sign-off, subject line, the diff context) only make sense on a patch. The --strict flag enables the extra "checks" tier and is what many maintainers expect for new code. The -g / --git form lets you point it at commits directly.

> Pitfall: checkpatch is a heuristic, not an oracle. It produces false positives - for example flagging a long line that genuinely cannot be wrapped, or a "WARNING" on intentional code. Do not blindly reshape correct code to silence it; if a warning is wrong, leave the code and be prepared to explain why in review. But never ignore an ERROR without a very good reason.`,
      code: [
        {
          lang: 'c',
          src: `// Lint a generated patch file (the usual case):
//   scripts/checkpatch.pl 0001-drivers-foo-fix-ring-index.patch
//
// Strict mode - extra CHECK-level advice, expected for new code:
//   scripts/checkpatch.pl --strict 0001-*.patch
//
// Lint the last commit straight from git history:
//   scripts/checkpatch.pl --git HEAD
//
// Lint a whole source file (no patch context) while developing:
//   scripts/checkpatch.pl --file drivers/foo/ring.c
//
// Typical output lines:
//   ERROR: code indent should use tabs where possible
//   WARNING: line length of 104 exceeds 100 columns
//   CHECK: Alignment should match open parenthesis
//
// Fix ERRORs always; fix WARNINGs unless you can justify them.`
        }
      ]
    },
    {
      heading: 'git for the kernel: small, atomic, well-described commits',
      body: `The kernel's review culture is built on the assumption that each commit is **one logical change** that compiles and works on its own. This is stricter than the GitHub norm of "the branch as a whole is correct." Every individual commit in your series must build, because the kernel relies on git bisect to hunt regressions - a commit that breaks the build poisons bisection for everyone who lands between it and the fix.

### Crafting the series

- **One change per commit.** A refactor and a bug fix are two commits, even if you discovered the bug during the refactor. Reviewers can accept the safe refactor and scrutinize the fix separately.
- **Reorder and squash before sending** using interactive rebase so the history tells a clean story: preparatory cleanups first, then the substantive change. Nobody wants to read your "fix typo" and "address review" micro-commits; rewrite them away.
- **Never merge; always rebase.** Kernel history is linear. A merge commit in a patch series is almost always wrong. Rebase your work onto the latest maintainer tree instead.

### Anatomy of a good commit message

The subject is a single imperative-mood line under ~50-75 characters, prefixed with the subsystem (e.g. "drivers: foo:"). Then a blank line, then a body that explains the **why**: what was wrong, what user-visible effect it had, and why this is the right fix - not a restatement of the diff. The body wraps at ~72 columns. Tags (Fixes:, Signed-off-by:, Reviewed-by:, etc.) go at the bottom.

> The Fixes: tag is special - it names the commit that introduced the bug (12-char hash plus subject) so stable-tree maintainers can automatically pick your fix back into older kernels. Get it right and your fix propagates to LTS releases for free.`,
      code: [
        {
          lang: 'c',
          src: `// Build a clean series, then inspect it before mailing:
//
//   git rebase -i v6.9          # squash/reorder onto a clean base
//   git log --oneline v6.9..    # each line = one logical change
//
// A model commit message:
//
//   drivers: foo: fix off-by-one dropping last ring slot
//
//   foo_ring_push() compared the index against capacity AFTER
//   incrementing it, so the highest slot was never used and a
//   full ring reported space for one fewer entry than it held.
//   Lost packets showed up as -ENOSPC under sustained load.
//
//   Compare the pre-increment index instead.
//
//   Fixes: 1a2b3c4d5e6f ("drivers: foo: add lockless ring buffer")
//   Signed-off-by: Ada Lovelace <ada@example.com>
//
// Verify EVERY commit builds (bisectability):
//   git rebase v6.9 --exec "make -j$(nproc) drivers/foo/"`
        }
      ]
    },
    {
      heading: 'Signed-off-by and the Developer Certificate of Origin',
      body: `Every patch that goes into the kernel must carry a **Signed-off-by:** line with your real name and email. This is not a formality and not a "reviewed it" stamp - it is a legal attestation to the **Developer Certificate of Origin (DCO)**, a short statement kept in Documentation/process/submitting-patches.rst.

### What you are certifying

By adding Signed-off-by, you assert one of the DCO clauses: that you wrote the change and have the right to submit it under the kernel's license, **or** that it is based on prior work you are passing along under a compatible license, **or** that someone who met those conditions handed it to you and you have not modified it improperly. You also consent that the patch and your sign-off (including your name and email) are a public, permanent record.

The DCO exists because of the kernel's history of intellectual-property disputes; it gives a clean, auditable chain of provenance for every line, without requiring contributors to sign a heavyweight corporate CLA. It is deliberately lightweight - one line per person who touches the patch.

### The chain and related tags

Sign-offs accumulate down a path. If you write a patch and a maintainer takes it through their tree, the maintainer adds **their** Signed-off-by below yours, certifying they passed it along. Distinct tags carry distinct meanings and you must not forge them:

- **Signed-off-by:** the DCO chain (you + anyone who relayed it).
- **Reviewed-by:** a reviewer who carefully read it and vouches for it - only they add this, after reviewing.
- **Acked-by:** a relevant person (often a maintainer of an affected area) approves, without full review.
- **Tested-by:** someone who actually ran it and confirmed the effect.
- **Reported-by:** credit to whoever reported the bug; often paired with a Closes: link.

> Pitfall: the name in Signed-off-by must be your real legal name and match your git author identity; pseudonyms are rejected. And the email there is what gets your patch attributed - configure git user.name and user.email before you ever run format-patch.`,
      code: [
        {
          lang: 'c',
          src: `// git adds the sign-off for you when you commit with -s:
//   git commit -s
//   git commit --amend -s        # add it to the last commit
//
// It appends, using your configured identity:
//   Signed-off-by: Ada Lovelace <ada@example.com>
//
// Configure that identity ONCE so it is correct:
//   git config --global user.name  "Ada Lovelace"
//   git config --global user.email "ada@example.com"
//
// A patch that travelled through a maintainer ends up with a chain:
//   Signed-off-by: Ada Lovelace <ada@example.com>      (author)
//   Reviewed-by:   Grace Hopper <grace@example.com>     (reviewer)
//   Signed-off-by: Linus Foo <maint@kernel.org>         (maintainer)
//
// Do NOT hand-add Reviewed-by/Acked-by for other people;
// only the person giving the tag may add it.`
        }
      ]
    },
    {
      heading: 'get_maintainer.pl and subsystem trees: who and where',
      body: `Sending a perfect patch to the wrong place gets it silently ignored. The kernel is partitioned into hundreds of **subsystems**, each listed in the top-level MAINTAINERS file with its maintainers, mailing lists, git tree, and the file patterns it owns. scripts/get_maintainer.pl reads MAINTAINERS plus the patch's diff (and optionally git history) and tells you exactly whom to email and which lists to copy.

### Reading its output

Run it on your patch file. It prints people with role annotations - (maintainer), (reviewer), (supporter) - and mailing lists, often weighted by how strongly they match. The convention is: put **maintainers in To:** (they are the ones who can apply it), put **lists and reviewers in Cc:**, and always Cc the catch-all linux-kernel@vger.kernel.org (LKML) unless the subsystem says otherwise. send-email can consume this output directly.

### The tree-of-trees structure

There is no single repository everyone pushes to. Instead:

- **Linus's tree** is the mainline - the canonical Linux. Only Linus commits to it, and almost always by pulling from maintainers, not by applying individual patches.
- Each subsystem maintainer keeps a **subsystem tree** (net, mm, tty, drm, ...). Your patch lands here first when the maintainer applies it with git am.
- **linux-next** is an integration tree that aggregates all the subsystem trees daily, so conflicts and build breaks surface before they reach mainline. If your change is in a -next tree, it is queued for the next merge window.

So your patch's journey is: list to subsystem maintainer to subsystem tree to linux-next to (next merge window) mainline to (eventually) a stable/LTS release.

> Pitfall: base your work on the **right** tree. A net/ patch should be developed against the netdev maintainer's tree (or net-next), not random mainline, or it may not apply. The MAINTAINERS entry names the tree (the "T:" line).`,
      code: [
        {
          lang: "c",
          src: `// Find recipients for a patch (the standard invocation):
//   scripts/get_maintainer.pl 0001-drivers-foo-fix-ring-index.patch
//
// Example output:
//   Ada Maintainer <ada@kernel.org> (maintainer:FOO DRIVER)
//   Rev Iewer <rev@example.com> (reviewer:FOO DRIVER)
//   linux-foo@vger.kernel.org (open list:FOO DRIVER)
//   linux-kernel@vger.kernel.org (open list)
//
// Look up everything the MAINTAINERS file knows about a path:
//   scripts/get_maintainer.pl -f drivers/foo/ring.c
//
// In MAINTAINERS, an entry looks like:
//   FOO DRIVER
//   M: Ada Maintainer <ada@kernel.org>     # M = Maintainer (To:)
//   R: Rev Iewer <rev@example.com>         # R = Reviewer  (Cc:)
//   L: linux-foo@vger.kernel.org           # L = mailing List (Cc:)
//   T: git git://.../linux-foo.git         # T = the Tree to base on
//   F: drivers/foo/                        # F = Files owned`
        }
      ]
    },
    {
      heading: 'format-patch and send-email: turning commits into mail',
      body: `Once your series is clean, two git commands turn it into reviewable email. **git format-patch** writes one .patch file per commit, numbered and named, each a self-contained email with subject, body, diff, and your sign-off. **git send-email** mails those files to the recipients, threaded correctly so a multi-patch series reads as one conversation.

### format-patch essentials

- Point it at a range: format-patch v6.9.. or -N for the last N commits. For a series of more than one patch, add **--cover-letter**, which generates a 0000 cover that introduces the whole series and is where your changelog between versions lives.
- For revisions, use **-v2**, **-v3**, etc., so subjects become [PATCH v2 1/3]. Maintainers track versions by this.
- The subject prefix is [PATCH] by default; subsystems sometimes want [PATCH net-next] or [RFC PATCH]. Set it with --subject-prefix.

### send-email essentials

- Configure SMTP once (sendmail section in git config). Gmail and others need an app password, not your login password.
- **Always --dry-run first** to see exactly who gets it and what the headers look like before anything leaves your machine.
- Use --to / --cc per get_maintainer output, or pipe get_maintainer in. Use --in-reply-to to attach a new version under the original thread when appropriate (though a fresh thread per version is also common and often preferred).

### The version-history convention

Below the diff's "---" line (which git puts there automatically and which is stripped on apply), you add a per-version changelog: "v2: addressed X, fixed Y per Reviewer." This text never enters the permanent commit message but tells reviewers what changed since last time, saving them a re-read.

> Pitfall: never send patches as attachments, never let your mail client wrap lines or convert tabs to spaces, and never send HTML mail - any of these corrupts the diff so it will not apply. This is the entire reason send-email exists: it bypasses meddling mail clients and sends pristine text. If you must use a GUI client, send to yourself first and verify git am applies the result.`,
      code: [
        {
          lang: "c",
          src: `// Generate a 3-patch series with a cover letter, version 2:
//   git format-patch -v2 --cover-letter -3 -o outgoing/
//   -> outgoing/v2-0000-cover-letter.patch
//      outgoing/v2-0001-...patch  ... v2-0003-...patch
// Edit the cover letter: fill in the blank SUBJECT and BODY,
// and add the "Changes since v1:" list there.
//
// One-time SMTP setup (Gmail app password example):
//   git config --global sendemail.smtpserver smtp.gmail.com
//   git config --global sendemail.smtpserverport 587
//   git config --global sendemail.smtpencryption tls
//   git config --global sendemail.smtpuser you@gmail.com
//
// ALWAYS dry-run first to inspect recipients and headers:
//   git send-email --dry-run --to=ada@kernel.org \\
//       --cc=linux-foo@vger.kernel.org outgoing/*.patch
//
// Then send for real (omit --dry-run):
//   git send-email --to=ada@kernel.org \\
//       --cc=linux-foo@vger.kernel.org outgoing/*.patch
//
// Below the "---" you may add per-version notes; they are
// dropped when a maintainer runs 'git am' and never hit history.`
        }
      ]
    },
    {
      heading: 'Review etiquette and the merge-window / rc cycle',
      body: `Submitting is the start, not the end. Patches live or die in **public review**, and how you behave there matters as much as the code. Reviewers are volunteers spending scarce attention; the etiquette is designed to respect that.

### How to behave in review

- **Reply inline, plain text, trimming quotes.** Quote the specific lines you are responding to and answer beneath them. Do not top-post. Do not send HTML.
- **Assume good faith and never take it personally.** Direct, terse criticism is the norm and is about the code, not you. "This is wrong because..." is feedback, not an insult.
- **Address every comment, even ones you disagree with.** If you decline a suggestion, say so and explain - silently ignoring feedback in your next version is the fastest way to lose a reviewer.
- **Send a new version as a fresh series (v2, v3...)**, not a single follow-up patch fixing the previous one, and include a changelog of what you changed. Add any Reviewed-by/Tested-by tags you earned, but only carry them forward if the code they reviewed did not change materially.
- **Be patient.** Days or weeks of silence is normal; a polite ping after a week or two is acceptable, nagging is not. Maintainers process enormous volumes of mail.

### The release cadence: merge window then rc cycle

Mainline runs on a fixed rhythm, roughly a release every 9-10 weeks:

1. **Merge window (~2 weeks):** right after a release, Linus pulls in all the *new features* that maintainers have been queuing in their trees (and validating in linux-next) since the last cycle. This is the only time new feature work is accepted into mainline.
2. **rc cycle (~6-8 weeks):** the window closes and Linus tags **-rc1**. From here only **bug fixes and regressions** are accepted, in weekly -rc2, -rc3 ... releases, as the kernel stabilizes.
3. **Release:** when it is stable enough, the final version ships, and the next merge window opens immediately.

The practical consequence: **timing your patch matters.** A new feature sent during the merge window is too late for that window - maintainers already froze their trees - so feature work should be sent and reviewed during the rc cycle so it is queued in -next, ready for the next window. A genuine bug fix, by contrast, is welcome any time, including mid-rc. After mainline release, the **stable** maintainers backport fixes (those marked Cc: stable@vger.kernel.org or pulled via Fixes:) into the longer-lived **LTS** kernels.

> Pitfall: do not send big new features to a subsystem maintainer in the middle of the merge window and expect them to land - they will ask you to resend after -rc1. And do not be surprised that your merged patch is not in any released kernel for weeks: it waits for the next merge window and then the full rc cycle before shipping.`,
      code: [
        {
          lang: "c",
          src: `// The mainline timeline (one ~9-10 week cycle):
//
//   v6.10 released
//      |
//      |  merge window (~2 wks): NEW FEATURES pulled from
//      |                         subsystem trees into mainline
//      v
//   v6.11-rc1 tagged  ---- merge window CLOSED ----
//      |
//      |  rc cycle (~6-8 wks): BUG FIXES ONLY
//      |  v6.11-rc2, -rc3, ... weekly, stabilizing
//      v
//   v6.11 released  -> next merge window opens immediately
//
// What this means for you:
//   * Feature patch  -> send during rc, gets queued in linux-next,
//                       merged in the NEXT window. Not mid-window.
//   * Bug fix        -> welcome any time, even mid-rc.
//   * Regression fix -> highest priority, add a Fixes: tag.
//
// To reach the stable/LTS kernels, mark a fix:
//   Cc: stable@vger.kernel.org      (or rely on Fixes: + auto-pick)`
        }
      ]
    }
  ],
  takeaways: [
    'Kernel development is email-driven: the unit of work is a plain-text patch (diff + changelog) sent to a subsystem mailing list, not a GitHub pull request.',
    'There is one mandatory coding style (tabs 8-wide, ~80-100 col lines, specific brace and naming rules); conforming signals competence and is the cheapest way to earn reviewer trust.',
    'Run scripts/checkpatch.pl (with --strict) on the generated patch before sending; fix all ERRORs, fix WARNINGs unless you can justify them, but do not blindly reshape correct code to silence false positives.',
    'Every commit must build and do exactly one logical change so git bisect stays usable; rebase (never merge) into a clean linear series with rich why-focused commit messages, and add a Fixes: tag when correcting a known commit.',
    'Signed-off-by is a legal attestation to the Developer Certificate of Origin, added with git commit -s using your real name and matching git identity; Reviewed-by/Acked-by/Tested-by are distinct tags only the granting person may add.',
    'Use scripts/get_maintainer.pl on your patch to route it: maintainers in To:, lists and reviewers in Cc:, and base your work on the subsystem tree named in the MAINTAINERS T: line, not random mainline.',
    'git format-patch turns commits into numbered email files (add --cover-letter for a series and -v2/-v3 for revisions); git send-email mails pristine text - never use attachments, HTML, or a line-wrapping GUI client.',
    'Review is public and terse: reply inline in plain text, address every comment even when declining, resend as a fresh versioned series with a changelog, and be patient - silence for days or weeks is normal.',
    'Mainline runs merge window (≈2 wks, new features only) then an rc cycle (≈6-8 wks, fixes only); send features during the rc so they queue in linux-next for the next window, send bug fixes any time.'
  ],
  cheatsheet: [
    { label: 'coding-style.rst', value: 'The canonical style: tabs 8 wide, ~80-100 col lines, snake_case, K&R braces' },
    { label: 'scripts/checkpatch.pl', value: 'Style/sanity linter; run with --strict on the patch before sending' },
    { label: 'git commit -s', value: 'Commit and append Signed-off-by (the DCO attestation) using your git identity' },
    { label: 'git rebase -i', value: 'Reorder/squash into a clean linear series; never use merge commits in a patch' },
    { label: 'Fixes: <hash> ("subj")', value: 'Names the commit that introduced a bug; enables stable-tree auto backport' },
    { label: 'Signed-off-by', value: 'DCO legal sign-off chain; real name required, must match author identity' },
    { label: 'Reviewed-by / Acked-by', value: 'Reviewer vouch / approval; only the granting person may add the tag' },
    { label: 'scripts/get_maintainer.pl', value: 'Reads MAINTAINERS + diff to list who to To: (maintainers) and Cc: (lists)' },
    { label: 'MAINTAINERS M/L/T/F', value: 'Maintainer / List / Tree to base on / Files owned, per subsystem' },
    { label: 'git format-patch', value: 'Turn commits into mailable .patch files; --cover-letter for a series, -v2 for revisions' },
    { label: 'git send-email', value: 'Mail patches as pristine threaded text; always --dry-run first' },
    { label: 'git am', value: 'How a maintainer applies a mailed patch; strips text below the --- line' },
    { label: 'linux-next', value: 'Daily integration tree aggregating subsystem trees; queue for next merge window' },
    { label: 'merge window vs -rc', value: '~2-wk window pulls new features; ~6-8 wk rc cycle takes fixes only, then release' }
  ]
}

export default note
