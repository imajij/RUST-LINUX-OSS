import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch15-c-036',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fix Hard Tabs And Brace Style',
    prompt: `The kernel coding style requires 8-character hard tabs for indentation and the K&R brace style (opening brace on the same line for control statements, but on its own line for function definitions). The snippet below was written with 4 spaces and same-line function braces.

Rewrite it so checkpatch.pl would not complain about indentation or brace placement.

    int my_init(void) {
        if (x > 0) {
            return -EINVAL;
        }
        return 0;
    }`,
    hints: [
      'Functions put the opening brace on its own line; control statements keep it on the same line.',
      'Use one hard tab per indentation level, not spaces.',
    ],
    solution: `int my_init(void)
{
	if (x > 0) {
		return -EINVAL;
	}

	return 0;
}`,
    starter: `int my_init(void) {
    if (x > 0) {
        return -EINVAL;
    }
    return 0;
}`,
    tags: ['coding-style', 'checkpatch', 'braces'],
  },
  {
    id: 'lx-ch15-c-037',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Remove The Redundant Single-Statement Braces',
    prompt: `Kernel style omits braces around a single statement in an if/else branch (each branch is judged independently). Rewrite the function below to drop the unnecessary braces that checkpatch flags as "braces {} are not necessary for single statement blocks".

Keep behaviour identical.`,
    hints: [
      'A one-line body needs no braces.',
      'If one branch of an if/else needs braces, the kernel keeps braces on all branches; here neither does.',
    ],
    solution: `static int clamp_val(int v)
{
	if (v < 0)
		return 0;
	else
		return v;
}`,
    starter: `static int clamp_val(int v)
{
	if (v < 0) {
		return 0;
	} else {
		return v;
	}
}`,
    tags: ['coding-style', 'checkpatch', 'braces'],
  },
  {
    id: 'lx-ch15-c-038',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fix Spacing Around Keywords And Operators',
    prompt: `checkpatch.pl reports several spacing problems in this line of code:

    if(ret<0 && len>=0){

Rewrite the line so it follows kernel style: a space after the keyword "if", spaces around binary operators, and a space before the opening brace.`,
    hints: [
      'Keywords like if/for/while/switch take a space before the parenthesis.',
      'Binary operators (<, >=, &&) are surrounded by single spaces.',
    ],
    solution: `if (ret < 0 && len >= 0) {`,
    starter: `if(ret<0 && len>=0){`,
    tags: ['coding-style', 'checkpatch', 'spacing'],
  },
  {
    id: 'lx-ch15-c-039',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Convert printk To The pr_ Helpers',
    prompt: `Modern kernel style prefers the pr_*() helpers over raw printk with explicit log levels, and the format string should end in a newline. Convert these two lines, keeping the same log levels (KERN_ERR and KERN_INFO).

    printk(KERN_ERR "mydrv: probe failed %d", ret);
    printk(KERN_INFO "mydrv: ready");`,
    hints: [
      'KERN_ERR maps to pr_err, KERN_INFO maps to pr_info.',
      'Every kernel message string should end with a newline.',
    ],
    solution: `pr_err("mydrv: probe failed %d\\n", ret);
pr_info("mydrv: ready\\n");`,
    starter: `printk(KERN_ERR "mydrv: probe failed %d", ret);
printk(KERN_INFO "mydrv: ready");`,
    tags: ['coding-style', 'printk', 'logging'],
  },
  {
    id: 'lx-ch15-c-040',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Run checkpatch On A Single Patch',
    prompt: `You produced a patch file 0001-net-fix-leak.patch with git format-patch. Give the exact command to run checkpatch.pl against it with strict checking enabled, and the command to run it against your staged working-tree changes (not a patch file).

Write both commands.`,
    hints: [
      'checkpatch lives at scripts/checkpatch.pl from the kernel source root.',
      'The --strict flag turns CHECK-level advice into reported issues; -g/--git can target a commit, and - reads a diff from stdin.',
    ],
    solution: `# Against a generated patch file (strict mode):
./scripts/checkpatch.pl --strict 0001-net-fix-leak.patch

# Against the most recent commit:
./scripts/checkpatch.pl --strict -g HEAD

# Against staged changes via stdin:
git diff --cached | ./scripts/checkpatch.pl --strict -`,
    starter: `# Command 1: lint the patch file in strict mode
# Command 2: lint your staged diff`,
    tags: ['checkpatch', 'tooling', 'patch'],
  },
  {
    id: 'lx-ch15-c-041',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add A Correct Signed-off-by Trailer',
    prompt: `The Developer Certificate of Origin requires every patch to carry a Signed-off-by line with your real name and email, placed at the bottom of the commit message. Your name is Nadia Comaneci and your email is nadia@example.org.

Show the git commit flag that adds this trailer automatically, and write the exact Signed-off-by line it produces.`,
    hints: [
      'git commit -s (or --signoff) appends the trailer from your user.name/user.email.',
      'The format is exactly: Signed-off-by: Name <email>.',
    ],
    solution: `# Configure identity once so -s uses it:
git config user.name "Nadia Comaneci"
git config user.email "nadia@example.org"

# Sign off when committing (or amend an existing commit):
git commit -s
git commit --amend -s   # to add it to the previous commit

# Resulting trailer line:
Signed-off-by: Nadia Comaneci <nadia@example.org>`,
    starter: `# Show the commit flag and the exact trailer line.`,
    tags: ['dco', 'signed-off-by', 'git'],
  },
  {
    id: 'lx-ch15-c-042',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find The Right Maintainers For A Patch',
    prompt: `Before sending a patch that touches drivers/net/ethernet/foo/foo_main.c, you must find who to email. Write the get_maintainer.pl invocation that lists the maintainers and lists for that file from a generated patch 0001-foo.patch, and the variant that queries a file path directly.`,
    hints: [
      'get_maintainer.pl lives in scripts/ and reads either a patch or, with -f, a file path.',
      'It prints To: recipients (maintainers) and Cc: recipients (lists, reviewers).',
    ],
    solution: `# From the generated patch (reads the diff to find changed files):
./scripts/get_maintainer.pl 0001-foo.patch

# Directly against a source file:
./scripts/get_maintainer.pl -f drivers/net/ethernet/foo/foo_main.c`,
    starter: `# Command 1: maintainers from the patch file
# Command 2: maintainers from the file path directly`,
    tags: ['get_maintainer', 'tooling', 'review'],
  },
  {
    id: 'lx-ch15-c-043',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generate A Patch From The Last Commit',
    prompt: `You made one commit fixing a typo. Write the git format-patch command that emits a single patch file for just the most recent commit, numbered and ready to send.

Then give the command that would emit patches for the last 3 commits instead.`,
    hints: [
      'format-patch -1 emits the top commit; -3 emits the last three.',
      'HEAD~1..HEAD and -1 are equivalent for the latest commit.',
    ],
    solution: `# Just the latest commit:
git format-patch -1

# The last three commits as a numbered series:
git format-patch -3

# Equivalent range form for the latest:
git format-patch HEAD~1..HEAD`,
    starter: `# Command 1: one patch for the latest commit
# Command 2: patches for the last 3 commits`,
    tags: ['format-patch', 'git', 'patch'],
  },
  {
    id: 'lx-ch15-c-044',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Write A Proper Subject Line',
    prompt: `Kernel commit subjects use the format "subsystem: short imperative summary", lower-case after the prefix, no trailing period, kept under ~75 characters. A contributor wrote:

    Fixed a Bug in the GPIO driver that crashes the kernel.

Rewrite it as a proper subject for a fix in drivers/gpio/gpio-foo.c, and state the prefix you would use.`,
    hints: [
      'Use the subsystem/driver as the prefix, e.g. "gpio: gpio-foo:".',
      'Use the imperative mood ("fix", not "fixed") and drop the trailing period.',
    ],
    solution: `gpio: gpio-foo: fix NULL deref on probe failure

# Prefix derived from the driver/subsystem; imperative verb; no capital
# after the prefix and no full stop at the end. Keep it under ~75 chars.`,
    starter: `Fixed a Bug in the GPIO driver that crashes the kernel.`,
    tags: ['commit-message', 'subject', 'coding-style'],
  },
  {
    id: 'lx-ch15-c-045',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add A Fixes Trailer',
    prompt: `Your patch corrects a bug introduced by commit a1b2c3d4e5f6 ("net: foo: enable rx coalescing"). The Fixes: trailer must use a 12-character abbreviated hash and the exact one-line summary in parentheses.

Write the Fixes: trailer, and give the git config command that makes "git log" print abbreviated hashes in this exact form.`,
    hints: [
      'Format: Fixes: <12-char-sha> ("exact subject line").',
      'core.abbrev=12 and the pretty format Fixes:%h ("%s") help generate it.',
    ],
    solution: `Fixes: a1b2c3d4e5f6 ("net: foo: enable rx coalescing")

# Generate the trailer automatically from the offending commit:
git config core.abbrev 12
git show -s --pretty='format:Fixes: %h ("%s")' a1b2c3d4e5f6`,
    starter: `# Write the Fixes: trailer for commit a1b2c3d4e5f6
# and the command that prints it in that form.`,
    tags: ['fixes', 'trailer', 'git'],
  },
  {
    id: 'lx-ch15-c-046',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Request Stable Backport Correctly',
    prompt: `Your fix should be backported to all stable kernels from 5.15 onward. The stable rules say you do NOT Cc the stable list as an email recipient; instead you add a special trailer to the commit message. Write the trailer that targets 5.15 and later, and the trailer form that targets only one specific version.`,
    hints: [
      'The trailer is Cc: stable@vger.kernel.org placed in the commit message.',
      'Add "# 5.15.x" after the address to scope which versions get the backport.',
    ],
    solution: `# In the commit message (NOT an actual email Cc), all 5.15+ stable trees:
Cc: stable@vger.kernel.org # 5.15.x

# Restrict to a single version line:
Cc: stable@vger.kernel.org # 5.15.x: a1b2c3d: net: foo: prep refactor

# Best paired with a Fixes: trailer so maintainers know the offending commit.`,
    starter: `# Write the stable Cc trailer for 5.15+ and a single-version variant.`,
    tags: ['cc-stable', 'trailer', 'backport'],
  },
  {
    id: 'lx-ch15-c-047',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Credit A Bug Reporter With Reported-by',
    prompt: `A user named Li Wei (li.wei@example.com) reported the bug your patch fixes, via the syzbot/list. Add the Reported-by trailer in the correct order relative to your Signed-off-by, and include the Closes: link to the report at https://lore.kernel.org/all/000@li/.

Show the full trailer block as it should appear at the bottom of the commit.`,
    hints: [
      'Reported-by comes before your Signed-off-by; Closes: points at the report.',
      'Order: Reported-by, Closes, Fixes (if any), then Signed-off-by last.',
    ],
    solution: `Reported-by: Li Wei <li.wei@example.com>
Closes: https://lore.kernel.org/all/000@li/
Signed-off-by: Nadia Comaneci <nadia@example.org>`,
    starter: `# Write the trailer block: credit the reporter, link the report,
# then your own sign-off last.`,
    tags: ['reported-by', 'trailer', 'dco'],
  },
  {
    id: 'lx-ch15-c-048',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Configure git send-email For The Kernel',
    prompt: `Write the git send-email command that mails a single patch 0001-foo.patch to the maintainer torvalds@example.org with the netdev list (netdev@vger.kernel.org) on Cc, sending from your address nadia@example.org.

Assume SMTP is already configured in your gitconfig.`,
    hints: [
      'git send-email --to <maintainer> --cc <list> <patchfile>.',
      'You can repeat --cc; --from sets the sender.',
    ],
    solution: `git send-email \\
	--from "Nadia Comaneci <nadia@example.org>" \\
	--to "torvalds@example.org" \\
	--cc "netdev@vger.kernel.org" \\
	0001-foo.patch`,
    starter: `# Mail 0001-foo.patch to the maintainer, Cc netdev.`,
    tags: ['send-email', 'git', 'submission'],
  },
  {
    id: 'lx-ch15-c-049',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Wrap A Commit Body At 75 Columns',
    prompt: `Kernel commit message bodies are wrapped at about 72-75 columns (the subject excepted). Rewrap the unwrapped paragraph below so no line exceeds 75 characters, preserving the wording.

    This patch fixes a use-after-free in the foo driver that happens when the device is removed while an interrupt is still in flight because the ISR dereferences a pointer that has already been freed by the remove path.`,
    hints: [
      'Hard-wrap manually; the body is plain text, not reflowed by tools.',
      'Aim for lines of roughly 70 columns to stay safely under the limit.',
    ],
    solution: `This patch fixes a use-after-free in the foo driver that happens when
the device is removed while an interrupt is still in flight because the
ISR dereferences a pointer that has already been freed by the remove
path.`,
    starter: `This patch fixes a use-after-free in the foo driver that happens when the device is removed while an interrupt is still in flight because the ISR dereferences a pointer that has already been freed by the remove path.`,
    tags: ['commit-message', 'coding-style', 'wrapping'],
  },
  {
    id: 'lx-ch15-c-050',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fix A Multi-Line Comment Block',
    prompt: `Kernel style for multi-line comments (outside of net/ and drivers/net/) opens with a bare /* on its own line, prefixes each line with a space-aligned *, and closes with */ on its own line. The C++ // style and trailing-text-on-open-line style are wrong here. Rewrite this comment.

    // This function resets the controller and waits
    // for the ready bit before returning.`,
    hints: [
      'Use /* ... */, not //, for multi-line kernel comments.',
      'Put /* and */ on their own lines with aligned * prefixes.',
    ],
    solution: `/*
 * This function resets the controller and waits
 * for the ready bit before returning.
 */`,
    starter: `// This function resets the controller and waits
// for the ready bit before returning.`,
    tags: ['coding-style', 'comments', 'checkpatch'],
  },
  {
    id: 'lx-ch15-c-051',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Replace A Magic Number With A Define',
    prompt: `checkpatch and reviewers dislike bare magic numbers. The loop below polls a status register up to 1000 times. Introduce a named macro for the retry count and a named macro for the status-ready bit (0x1), then rewrite the loop to use them.`,
    hints: [
      'Use #define NAME value in UPPER_SNAKE_CASE.',
      'Name the constants for intent, e.g. FOO_MAX_RETRIES and FOO_STATUS_READY.',
    ],
    solution: `#define FOO_MAX_RETRIES	1000
#define FOO_STATUS_READY	0x1

for (i = 0; i < FOO_MAX_RETRIES; i++) {
	if (readl(base + STATUS) & FOO_STATUS_READY)
		break;
	udelay(1);
}`,
    starter: `for (i = 0; i < 1000; i++) {
	if (readl(base + STATUS) & 0x1)
		break;
	udelay(1);
}`,
    tags: ['coding-style', 'magic-numbers', 'macros'],
  },
  {
    id: 'lx-ch15-c-052',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Plan A Two-Patch Split: Prep Then Fix',
    prompt: `You have one big diff that (a) refactors foo_setup() to take a flags argument and (b) uses the new argument to fix a bug. Reviewers want this split so the no-behaviour-change refactor is separate from the fix.

Write the two commit subjects and a one-line body summary for each, in the order they must be applied.`,
    hints: [
      'Mechanical/no-functional-change prep comes first.',
      'The bug fix builds on the prep and carries the Fixes:/Cc-stable trailers.',
    ],
    solution: `Patch 1/2:
  Subject: foo: pass flags to foo_setup()
  Body:    Refactor foo_setup() to take a flags argument. No functional
           change; this prepares for the fix in the next patch.

Patch 2/2:
  Subject: foo: fix rx stall by setting FOO_FLAG_SYNC in foo_setup()
  Body:    Use the new flags argument to enable synchronous setup, which
           prevents the rx stall. Carries Fixes: and Cc: stable trailers.`,
    starter: `# Patch 1/2 (prep, no functional change):
# Patch 2/2 (the actual fix):`,
    tags: ['patch-series', 'splitting', 'review'],
  },
  {
    id: 'lx-ch15-c-053',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generate A Series With A Cover Letter',
    prompt: `Write the git format-patch command that produces a 3-patch series with a cover letter (0000-*) into an out/ directory, versioned as v2, with the subject prefix "PATCH net-next".`,
    hints: [
      '--cover-letter creates 0000; -o sets the output dir.',
      '-v2 bumps the version; --subject-prefix overrides "PATCH".',
    ],
    solution: `git format-patch -3 \\
	--cover-letter \\
	-v2 \\
	--subject-prefix="PATCH net-next" \\
	-o out/

# Produces out/v2-0000-cover-letter.patch plus v2-0001..0003,
# each subject reading: [PATCH net-next v2 N/3] ...`,
    starter: `# 3 patches + cover letter, v2, prefix "PATCH net-next", into out/`,
    tags: ['format-patch', 'cover-letter', 'patch-series'],
  },
  {
    id: 'lx-ch15-c-054',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Write The Cover Letter Body',
    prompt: `git format-patch --cover-letter leaves placeholders "*** SUBJECT HERE ***" and "*** BLURB HERE ***". For a 3-patch series that fixes a memory leak in the foo driver, fill in a one-line subject and a short blurb explaining what the series does and how it is structured.`,
    hints: [
      'The cover subject is a summary of the whole series, not patch 1.',
      'Briefly say what each patch does and mention testing.',
    ],
    solution: `Subject: [PATCH 0/3] foo: fix memory leak on probe error paths

This series fixes a leak where buffers allocated in foo_probe() are not
freed when later setup steps fail.

Patch 1 adds a shared cleanup helper (no functional change).
Patch 2 uses the helper in the probe error paths to fix the leak.
Patch 3 adds the matching teardown in foo_remove().

Tested on hardware with the error paths exercised via fault injection;
no leaks reported by kmemleak.`,
    starter: `Subject: *** SUBJECT HERE ***

*** BLURB HERE ***`,
    tags: ['cover-letter', 'patch-series', 'submission'],
  },
  {
    id: 'lx-ch15-c-055',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pick The Right Tree And Base',
    prompt: `You are fixing a regression that already exists in Linus's released kernel, and separately you are adding a brand-new feature to the networking stack. State which tree/branch each should be based on and why, using the net vs net-next and -rc vs merge-window rules.`,
    hints: [
      'Bug fixes for current code go to the "fixes" tree (e.g. net); features go to "-next" (e.g. net-next).',
      'net-next is closed during the merge window and reopens after -rc1.',
    ],
    solution: `Regression fix:
  Base on the maintainer's fixes branch (for networking: the "net" tree),
  which feeds Linus during the current -rc cycle. Tag it [PATCH net] and
  add Fixes:/Cc-stable as appropriate.

New feature:
  Base on the development tree "net-next" and tag it [PATCH net-next].
  net-next is closed during the merge window and reopens after -rc1, so
  features wait there until the next merge window pulls them into mainline.`,
    starter: `# Where does the regression fix go? Where does the new feature go? Why?`,
    tags: ['subsystem-trees', 'net-next', 'merge-window'],
  },
  {
    id: 'lx-ch15-c-056',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reorder Trailers Into Canonical Order',
    prompt: `A commit footer has its trailers in a jumbled order. Reorder them into the conventional kernel order. The trailers are:

    Signed-off-by: Nadia Comaneci <nadia@example.org>
    Fixes: a1b2c3d4e5f6 ("foo: add rx path")
    Reported-by: Li Wei <li.wei@example.com>
    Reviewed-by: Sam Roe <sam@example.net>
    Cc: stable@vger.kernel.org`,
    hints: [
      'Reported-by/Closes and Fixes describe origin; Cc stable requests backport.',
      'Your own Signed-off-by goes last; tags collected from review (Reviewed-by) come before it.',
    ],
    solution: `Reported-by: Li Wei <li.wei@example.com>
Fixes: a1b2c3d4e5f6 ("foo: add rx path")
Cc: stable@vger.kernel.org
Reviewed-by: Sam Roe <sam@example.net>
Signed-off-by: Nadia Comaneci <nadia@example.org>`,
    starter: `# Reorder these into canonical kernel trailer order:
# Signed-off-by, Fixes, Reported-by, Reviewed-by, Cc stable`,
    tags: ['trailer', 'commit-message', 'dco'],
  },
  {
    id: 'lx-ch15-c-057',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Send v2 In-Reply-To The v1 Thread',
    prompt: `You are resending a revised series. Reviewers want v2 to thread under the original v1 cover letter, whose Message-ID is <20240101-foo-v1-0-abc@host>. Write the git send-email options that mail your v2 patches as a reply to that message and keep the patches threaded among themselves.`,
    hints: [
      '--in-reply-to=<message-id> attaches the series under an existing thread.',
      '--thread (default) chains patches; you usually do NOT also set --no-chain-reply-to here.',
    ],
    solution: `git send-email \\
	--to maintainer@example.org \\
	--cc netdev@vger.kernel.org \\
	--in-reply-to="<20240101-foo-v1-0-abc@host>" \\
	out/v2-*.patch

# --in-reply-to threads v2 under the v1 cover; --thread (the default)
# keeps the v2 patches linked as replies to the v2 cover.`,
    starter: `# Mail the v2 patches threaded under the v1 cover letter's Message-ID.`,
    tags: ['send-email', 'versioning', 'review'],
  },
  {
    id: 'lx-ch15-c-058',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add A Changelog Below The Cut Line',
    prompt: `When you post v2, reviewers expect a per-version changelog that does NOT end up in the committed message. The convention is to place it after the Signed-off-by block and a "---" line in each patch (or in the cover letter). Write the changelog section for a v2 that addressed two review comments.`,
    hints: [
      'Everything after the "---" line in a patch is dropped when applied with git am.',
      'List changes per version, newest first.',
    ],
    solution: `Signed-off-by: Nadia Comaneci <nadia@example.org>
---
Changes in v2:
- Split the refactor into its own patch (per Sam's review).
- Use devm_kzalloc() instead of kzalloc() to drop manual cleanup.

v1: https://lore.kernel.org/all/20240101-foo-v1-0-abc@host/`,
    starter: `Signed-off-by: Nadia Comaneci <nadia@example.org>
---
# Add the "Changes in v2:" changelog here (dropped by git am).`,
    tags: ['versioning', 'changelog', 'cover-letter'],
  },
  {
    id: 'lx-ch15-c-059',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Apply A Maintainer Patch With git am',
    prompt: `A maintainer sent you a patch file fix.mbox to test. Write the command to apply it to your current branch preserving authorship and sign-off, and the command to abort and clean up if it fails to apply.`,
    hints: [
      'git am applies mailbox-format patches and keeps the original author.',
      'git am --abort restores the branch if the apply stops mid-way.',
    ],
    solution: `# Apply, optionally adding your own sign-off as the applier:
git am -s fix.mbox

# If it conflicts and you want to bail out:
git am --abort

# To resolve conflicts and continue instead:
#   (edit files, git add ...) then:
git am --continue`,
    starter: `# Command to apply fix.mbox; command to abort on failure.`,
    tags: ['git-am', 'patch', 'tooling'],
  },
  {
    id: 'lx-ch15-c-060',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Interactive Rebase To Reword And Reorder',
    prompt: `Your branch has three commits on top of origin/master:
  C (top): "fix: use new flag"
  B:       "wip typo"  (should be squashed into A)
  A:       "foo: add flags arg"  (subject needs rewording)
You want the final history to be: A (reworded, with B folded in) then C. Write the git rebase command to start the interactive edit and the exact todo-list lines (in top-to-bottom order) that achieve this.`,
    hints: [
      'git rebase -i origin/master opens the todo list oldest-first.',
      'Use reword on A, fixup/squash on B, pick on C.',
    ],
    solution: `git rebase -i origin/master

# Todo list (oldest at top):
reword <sha-A>   foo: add flags arg
fixup  <sha-B>   wip typo
pick   <sha-C>   fix: use new flag

# 'reword' lets you fix A's subject; 'fixup' folds B into A and discards
# B's message; C is replayed unchanged on top.`,
    starter: `# Write the rebase command and the 3 todo lines (oldest first).`,
    tags: ['rebase', 'git', 'patch-series'],
  },
  {
    id: 'lx-ch15-c-061',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Split One Commit Into Two With Rebase Edit',
    prompt: `Commit B mixes a whitespace cleanup and a real fix in one file. You want to split it into two commits during an interactive rebase. Give the rebase todo action for B and the exact sequence of commands to run when the rebase stops at B to produce two separate commits.`,
    hints: [
      'Mark the commit with "edit", then reset it and re-stage in pieces.',
      'git reset HEAD^ unstages the commit; git add -p stages selectively.',
    ],
    solution: `# In the todo list:
edit <sha-B>   foo: cleanup and fix

# When the rebase stops at B:
git reset HEAD^                 # keep changes, undo the commit
git add -p                      # stage only the whitespace hunks
git commit -m "foo: fix whitespace"
git add -p                      # (or git add .) stage the real fix
git commit -m "foo: fix off-by-one in length check"
git rebase --continue`,
    starter: `# Todo action for B, then the command sequence to split it in two.`,
    tags: ['rebase', 'splitting', 'git'],
  },
  {
    id: 'lx-ch15-c-062',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Respond To Review And Produce v2',
    prompt: `A maintainer replied to your patch:
  "Please don't open-code the error cleanup; use a goto ladder. Also this leaks 'buf' on the second error path."
Write (a) a brief, polite inline email reply agreeing and stating what you changed, and (b) the corrected probe function using a single goto-based unwind so buf is always freed.

Assume buf = kzalloc(...) then a call that may fail.`,
    hints: [
      'Kernel error handling commonly uses goto labels that unwind in reverse order.',
      'Reply concisely, top-quote the relevant point, and say "Fixed in v2".',
    ],
    solution: `Reply (inline, under the quoted comment):

  > Please don't open-code the error cleanup; use a goto ladder.
  > Also this leaks 'buf' on the second error path.

  Good catch, thanks. Switched to a goto ladder and freed buf on all
  error paths. Fixed in v2.

Corrected code:

static int foo_probe(struct device *dev)
{
	void *buf;
	int ret;

	buf = kzalloc(SZ, GFP_KERNEL);
	if (!buf)
		return -ENOMEM;

	ret = foo_setup(dev);
	if (ret)
		goto err_free;

	ret = foo_enable(dev);
	if (ret)
		goto err_teardown;

	return 0;

err_teardown:
	foo_teardown(dev);
err_free:
	kfree(buf);
	return ret;
}`,
    starter: `# (a) A short, polite review reply.
# (b) Rewrite foo_probe() with a goto error ladder that frees buf.`,
    tags: ['review', 'versioning', 'error-handling'],
  },
  {
    id: 'lx-ch15-c-063',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Collect And Apply Review Tags Across A Resend',
    prompt: `On v2, Sam Roe (sam@example.net) gave "Reviewed-by" on patches 1 and 3 only, and Li Wei (li.wei@example.com) gave "Tested-by" on the whole series. Explain exactly which trailers you add to which patch for v3, and show the trailer block you would add to patch 2.

State the rule about when you must drop a collected tag.`,
    hints: [
      'Tested-by on "the series" applies to every patch; Reviewed-by applies only where given.',
      'You must drop a Reviewed-by/Tested-by if the patch changed materially since they gave it.',
    ],
    solution: `Patches 1 and 3: add both
  Reviewed-by: Sam Roe <sam@example.net>
  Tested-by: Li Wei <li.wei@example.com>

Patch 2: Sam did NOT review it, so add only the series-wide Tested-by:
  Tested-by: Li Wei <li.wei@example.com>
  Signed-off-by: Nadia Comaneci <nadia@example.org>

Rule: drop a collected Reviewed-by/Tested-by from any patch you changed
non-trivially in v3 (more than a typo/rebase), since the reviewer did not
see the new version. Tags survive trivial, mechanical-only changes.`,
    starter: `# Which tags go on which patch for v3? Show patch 2's trailer block.
# State when a collected tag must be dropped.`,
    tags: ['review', 'trailer', 'versioning'],
  },
  {
    id: 'lx-ch15-c-064',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Make A Bisectable Series',
    prompt: `A reviewer says your 3-patch series "breaks the build at patch 2" because patch 2 calls a helper that patch 3 introduces. The series must build and run at every step (bisectable). Explain the violated rule and give the corrected patch ordering, plus the rebase action to move the helper-introducing commit earlier.`,
    hints: [
      'Every commit must compile and behave correctly on its own, in order.',
      'A definition must land in the same or an earlier patch than its first use.',
    ],
    solution: `Violated rule: each commit must build and work in isolation so that
git bisect never lands on a broken commit. Patch 2 used foo_helper()
before patch 3 defined it, so building at patch 2 fails.

Fix: reorder so the helper is introduced no later than its first use.
New order:
  1/3  foo: add foo_helper() (unused yet, or used here)
  2/3  foo: use foo_helper() in the rx path
  3/3  foo: ... (whatever remains)

Move the helper commit earlier in an interactive rebase:
  git rebase -i origin/master
  # then cut/paste the 'pick <helper-sha>' line above the user, e.g.:
  pick <helper-sha>   foo: add foo_helper()
  pick <user-sha>     foo: use foo_helper() in the rx path
  pick <rest-sha>     foo: ...`,
    starter: `# Name the rule, give the corrected order, and the rebase reordering.`,
    tags: ['patch-series', 'bisect', 'rebase'],
  },
  {
    id: 'lx-ch15-c-065',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Rebase A Stale Series Onto net-next',
    prompt: `Your feature branch foo-feature was based on net-next from three weeks ago and no longer applies. Write the commands to fetch the latest net-next, rebase your branch onto it, resolve a conflict in one file, continue, and then regenerate the v3 patches against the new base.

Assume a remote named "netnext" with branch "main".`,
    hints: [
      'Fetch, then git rebase onto the updated upstream branch.',
      'On conflict: edit, git add, git rebase --continue.',
    ],
    solution: `git fetch netnext
git rebase netnext/main foo-feature

# Rebase stops on a conflict in foo_main.c:
#   (edit foo_main.c to resolve conflict markers)
git add drivers/net/ethernet/foo/foo_main.c
git rebase --continue

# Regenerate v3 against the new base:
git format-patch netnext/main -v3 --cover-letter \\
	--subject-prefix="PATCH net-next" -o out/`,
    starter: `# Fetch netnext/main, rebase foo-feature onto it, resolve the conflict,
# then regenerate v3 patches against the new base.`,
    tags: ['rebase', 'net-next', 'format-patch'],
  },
  {
    id: 'lx-ch15-c-066',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Diagnose A Whitespace-Damaged Patch',
    prompt: `A contributor's mailed patch fails to apply with "patch does not apply" and checkpatch shows nothing wrong with the source. The real cause is the mail client mangled whitespace (tabs to spaces). Write the git command that checks a patch for whitespace errors before applying, the apply flag that tolerates/fixes them, and the one-line advice on how to avoid the corruption when sending.`,
    hints: [
      'git apply --check tests without applying; --whitespace=fix repairs.',
      'The root cure is to use git send-email rather than copy-paste in a GUI client.',
    ],
    solution: `# Test before applying:
git apply --check 0001-foo.patch

# Apply while fixing recoverable whitespace damage:
git apply --whitespace=fix 0001-foo.patch
#   (git am --whitespace=fix 0001-foo.patch for a mailbox)

# Real fix: send with git send-email, which transmits the patch
# verbatim, instead of pasting it into a GUI mail client that
# converts tabs to spaces and wraps long lines.`,
    starter: `# Command to check for whitespace errors; flag to fix on apply;
# one line on how to avoid the corruption when sending.`,
    tags: ['git-apply', 'send-email', 'whitespace'],
  },
  {
    id: 'lx-ch15-c-067',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Split A Cross-Subsystem Patch By Maintainer',
    prompt: `One commit edits both fs/foo/super.c and drivers/block/bar.c. get_maintainer.pl shows these belong to different maintainers/trees. Explain why this must be split, how to decide ordering when one side depends on the other, and outline the two resulting patches with their subject prefixes.`,
    hints: [
      'Different subsystems are merged through different trees; a single commit cannot go through both.',
      'If there is a build/runtime dependency, get the depended-on side merged first or coordinate via an immutable branch/Acked-by.',
    ],
    solution: `Why split: the two files are owned by different maintainers and travel
through different trees, so one commit cannot be applied by both. Each
subsystem maintainer needs a patch they can take independently.

Ordering / dependency: if drivers/block/bar.c depends on a new fs/foo
interface, the fs patch must land first. Options: send the fs patch,
get it merged (or an immutable branch / Acked-by from the fs maintainer),
then send the block patch on top. Note the dependency in the cover letter.

Resulting patches:
  [PATCH 1/2] foo: add the new super-block helper (fs maintainer/tree)
  [PATCH 2/2] block: bar: use foo's new helper (block maintainer/tree)`,
    starter: `# Why split? How to order if one side depends on the other?
# Outline the two patches with subject prefixes.`,
    tags: ['get_maintainer', 'splitting', 'subsystem-trees'],
  },
  {
    id: 'lx-ch15-c-068',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Fix A Subtle checkpatch False-Negative Leak',
    prompt: `checkpatch passes this code clean, but it has a real bug: an error path returns without releasing a reference taken by of_node_get(). Rewrite it to release the reference on every exit path (success and error) using a goto unwind. The reference is taken with of_node_get(np) and released with of_node_put(np).`,
    hints: [
      'checkpatch is a style linter, not a leak detector; you must reason about resources yourself.',
      'Take the ref, then use a single put on a goto label reached by all exits.',
    ],
    solution: `static int foo_parse(struct device_node *parent)
{
	struct device_node *np;
	int ret;

	np = of_get_child_by_name(parent, "foo");
	if (!np)
		return -ENODEV;

	of_node_get(np);

	ret = foo_read_reg(np);
	if (ret)
		goto out_put;

	ret = foo_read_irq(np);
	if (ret)
		goto out_put;

	ret = 0;
out_put:
	of_node_put(np);
	return ret;
}`,
    starter: `static int foo_parse(struct device_node *parent)
{
	struct device_node *np;
	int ret;

	np = of_get_child_by_name(parent, "foo");
	if (!np)
		return -ENODEV;
	of_node_get(np);

	ret = foo_read_reg(np);
	if (ret)
		return ret;       /* BUG: leaks the np reference */

	ret = foo_read_irq(np);
	if (ret)
		return ret;       /* BUG: leaks the np reference */

	of_node_put(np);
	return 0;
}`,
    tags: ['error-handling', 'checkpatch', 'review'],
  },
  {
    id: 'lx-ch15-c-069',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Time A Feature Submission Around The Cycle',
    prompt: `It is currently -rc6 of the 6.10 cycle. You have a non-urgent new feature for the networking stack ready. Describe the precise sequence and timing: which tree to target now, what happens at the merge window, and when your feature could reach a released kernel. Then state how the answer differs if instead this were an -rc6 regression fix.`,
    hints: [
      'Features queue in net-next; net-next is closed during the merge window.',
      'The merge window is ~2 weeks after a final release; -rc cycle is ~7 weeks of fixes only.',
    ],
    solution: `New feature, now at 6.10-rc6:
  - Target net-next (NOT net). Post it now; it can be reviewed and applied
    to net-next while 6.10 finishes its -rc cycle.
  - net-next closes at the start of the 6.11 merge window; whatever is in
    net-next is sent to Linus during that ~2-week window and becomes part
    of 6.11-rc1.
  - So the earliest release that ships your feature is 6.11 (final), about
    one full cycle (~9-10 weeks) away. Submitting late in -rc may mean it
    waits for the cycle after if net-next has already been frozen.

If it were an -rc6 regression fix instead:
  - Target net (the fixes tree), tag [PATCH net], add Fixes:/Cc-stable.
  - It can be merged during the current -rc cycle and ship in a later 6.10
    -rc or the 6.10 release, and get backported to stable - no need to
    wait for the merge window.`,
    starter: `# Feature at 6.10-rc6: which tree, what happens at the merge window,
# when does it ship? Then: how does it differ for a regression fix?`,
    tags: ['merge-window', 'net-next', 'subsystem-trees'],
  },
  {
    id: 'lx-ch15-c-070',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full Submission Dry Run From Branch To Mail',
    prompt: `Assemble the end-to-end workflow for sending a clean 2-patch fix series for a regression. Starting from a branch with two commits on top of the maintainer's fixes tree (remote "fixes", branch "main"), write the ordered commands to: verify both commits sign-off, lint with checkpatch, find recipients, generate a versioned cover-lettered series, and mail it. Use placeholders where an address is needed.`,
    hints: [
      'checkpatch can take -g <range>; get_maintainer reads the generated patches.',
      'format-patch the range, then send-email the whole out/ dir with --to/--cc from get_maintainer output.',
    ],
    solution: `# 1. Sanity-check the two commits (sign-off, subject, content):
git log --oneline -2
git log -2 --format='%B' | grep -c 'Signed-off-by:'   # expect 2

# 2. Lint both commits in strict mode:
./scripts/checkpatch.pl --strict -g HEAD~2..HEAD

# 3. Generate a v2 series with cover letter against the fixes base:
git format-patch fixes/main -v2 --cover-letter \\
	--subject-prefix="PATCH net" -o out/

# 4. Edit out/v2-0000-cover-letter.patch: real subject + blurb + changelog.

# 5. Find recipients from the generated patches:
./scripts/get_maintainer.pl out/*.patch

# 6. Mail the whole series (fill in addresses from step 5):
git send-email \\
	--to "maintainer@example.org" \\
	--cc "netdev@vger.kernel.org" \\
	out/v2-*.patch`,
    starter: `# Ordered commands: verify sign-off -> checkpatch -> get_maintainer ->
# format-patch (v2, cover letter) -> send-email the series.`,
    tags: ['submission', 'send-email', 'workflow'],
  },
]

export default problems
