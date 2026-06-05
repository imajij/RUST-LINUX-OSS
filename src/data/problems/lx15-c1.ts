import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch15-c-001',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Indent With Tabs, Not Spaces',
    prompt: `Kernel coding style requires a single tab (8 columns) for each indentation level, never spaces. The body of this function was indented with spaces. Rewrite it so the statement is indented with one literal tab character.`,
    hints: [
      'One level of indentation is exactly one tab character.',
      'Spaces for indentation are a checkpatch error in kernel code.',
    ],
    solution: `int square(int x)
{
	return x * x;
}`,
    starter: `int square(int x)
{
    return x * x;
}`,
    tags: ['kernel', 'coding-style', 'indentation'],
  },
  {
    id: 'lx-ch15-c-002',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Function Opening Brace On Its Own Line',
    prompt: `In kernel style, the opening brace of a function definition goes on its own line, while the opening brace of every other block (if, while, for) stays on the same line. Fix this function so its opening brace is on a line by itself.`,
    hints: [
      'Functions are the exception: their opening brace is on the next line.',
      'Only move the function brace; do not touch anything else.',
    ],
    solution: `void init_driver(void)
{
	setup();
}`,
    starter: `void init_driver(void) {
	setup();
}`,
    tags: ['kernel', 'coding-style', 'braces'],
  },
  {
    id: 'lx-ch15-c-003',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Space After Keywords',
    prompt: `Kernel style puts a space after control-flow keywords (if, for, while, switch) but no space between a function name and its opening parenthesis. Fix the spacing in this if statement.`,
    hints: [
      'Write if (cond), not if(cond).',
      'Keywords get a space; function calls do not.',
    ],
    solution: `if (count > 0)
	count--;`,
    starter: `if(count > 0)
	count--;`,
    tags: ['kernel', 'coding-style', 'spacing'],
  },
  {
    id: 'lx-ch15-c-004',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Run Checkpatch On A Patch File',
    prompt: `You generated a patch file named 0001-add-feature.patch. Write the exact command that runs the kernel's checkpatch script against that patch from the top of the kernel tree.`,
    hints: [
      'The script lives in the scripts/ directory.',
      'Pass the .patch file as the argument.',
    ],
    solution: `scripts/checkpatch.pl 0001-add-feature.patch`,
    starter: `# Run checkpatch against 0001-add-feature.patch
`,
    tags: ['kernel', 'checkpatch', 'command'],
  },
  {
    id: 'lx-ch15-c-005',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Add Your Signed-off-by Line',
    prompt: `The Developer's Certificate of Origin requires a Signed-off-by trailer. Write the exact Signed-off-by line for a contributor named Nadia Khan whose email is nadia@example.com.`,
    hints: [
      'The format is Signed-off-by: Full Name <email>.',
      'Capitalization and angle brackets matter.',
    ],
    solution: `Signed-off-by: Nadia Khan <nadia@example.com>`,
    starter: `Signed-off-by: <TODO: name and email>`,
    tags: ['kernel', 'dco', 'signed-off-by'],
  },
  {
    id: 'lx-ch15-c-006',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Commit With Automatic Sign-off',
    prompt: `Write the git command that creates a commit and automatically appends your Signed-off-by line based on your configured user.name and user.email.`,
    hints: [
      'There is a short flag that adds the sign-off trailer.',
      'It is -s (or --signoff).',
    ],
    solution: `git commit -s`,
    starter: `# Commit and auto-add Signed-off-by
git commit ...`,
    tags: ['kernel', 'git', 'signed-off-by'],
  },
  {
    id: 'lx-ch15-c-007',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Generate A Patch For The Last Commit',
    prompt: `Write the git command that uses format-patch to produce a patch file for just the single most recent commit on your branch.`,
    hints: [
      'format-patch takes a -N count of commits from HEAD.',
      'You want the last 1 commit.',
    ],
    solution: `git format-patch -1`,
    starter: `# Make a patch from the most recent commit
git format-patch ...`,
    tags: ['kernel', 'git', 'format-patch'],
  },
  {
    id: 'lx-ch15-c-008',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Find Maintainers For A File',
    prompt: `Write the exact command that runs the kernel's maintainer-lookup script to print the maintainers and lists you should send a patch touching drivers/char/random.c to.`,
    hints: [
      'The script lives in scripts/ and ends in .pl.',
      'Pass the source file path as the argument.',
    ],
    solution: `scripts/get_maintainer.pl drivers/char/random.c`,
    starter: `# Who maintains drivers/char/random.c?
`,
    tags: ['kernel', 'get_maintainer', 'command'],
  },
  {
    id: 'lx-ch15-c-009',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Set Your Identity For Patches',
    prompt: `Before sending patches you must configure git with your real name and email so Signed-off-by and From lines are correct. Write the two git config commands that set the global user.name to "Nadia Khan" and user.email to nadia@example.com.`,
    hints: [
      'Use git config --global for each setting.',
      'Quote the name because it contains a space.',
    ],
    solution: `git config --global user.name "Nadia Khan"
git config --global user.email nadia@example.com`,
    starter: `# Set name and email globally
git config ...
git config ...`,
    tags: ['kernel', 'git', 'config'],
  },
  {
    id: 'lx-ch15-c-010',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Keep Lines Within The Width Limit',
    prompt: `Modern kernel style allows up to 100 columns, but checkpatch warns past 80 for ordinary lines. This single line is too long because the operands are crammed. Split the assignment across two lines so the continuation is indented past the start, keeping each line under 80 columns.`,
    hints: [
      'Break after a binary operator like +.',
      'Indent the continuation line one or two tabs past the statement.',
    ],
    solution: `	total = first_value + second_value + third_value +
		fourth_value + fifth_value;`,
    starter: `	total = first_value + second_value + third_value + fourth_value + fifth_value;`,
    tags: ['kernel', 'coding-style', 'line-length'],
  },
  {
    id: 'lx-ch15-c-011',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Use C-Style Comments',
    prompt: `The kernel C style uses /* ... */ comments, not C++ // line comments, in C source. Convert this comment to the kernel style on its own line above the statement.`,
    hints: [
      'Replace // with a /* ... */ block.',
      'Keep the comment on the line before the code.',
    ],
    solution: `	/* reset the counter before use */
	count = 0;`,
    starter: `	// reset the counter before use
	count = 0;`,
    tags: ['kernel', 'coding-style', 'comments'],
  },
  {
    id: 'lx-ch15-c-012',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Write A One-Line Patch Subject',
    prompt: `A kernel commit subject starts with the affected subsystem prefix, a colon, then a short imperative summary, all on one line. Write a good subject line for a patch that fixes a memory leak in the e1000e network driver's probe function.`,
    hints: [
      'Format: subsystem: short imperative summary.',
      'Use the present-tense imperative ("fix"), not past tense.',
    ],
    solution: `e1000e: fix memory leak in probe path`,
    starter: `# Write the commit subject line:
`,
    tags: ['kernel', 'commit-message', 'subject'],
  },
  {
    id: 'lx-ch15-c-013',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'No Space Inside Parentheses',
    prompt: `Kernel style does not put spaces immediately inside parentheses or brackets. Fix the spacing in this function call so it matches kernel style.`,
    hints: [
      'Remove the space after ( and before ).',
      'Arguments are separated by a comma and one space.',
    ],
    solution: `	ret = register_driver(&drv, count);`,
    starter: `	ret = register_driver( &drv, count );`,
    tags: ['kernel', 'coding-style', 'spacing'],
  },
  {
    id: 'lx-ch15-c-014',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pointer Asterisk Hugs The Name',
    prompt: `In kernel style the pointer asterisk binds to the variable or function name, not to the type. Fix the spacing of these two declarations.`,
    hints: [
      'Write char *name, not char* name.',
      'For functions, struct foo *get(void), the star hugs the name.',
    ],
    solution: `	char *name;
	struct device *dev;`,
    starter: `	char* name;
	struct device* dev;`,
    tags: ['kernel', 'coding-style', 'pointers'],
  },
  {
    id: 'lx-ch15-c-015',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Spaces Around Binary Operators',
    prompt: `Kernel style puts one space on each side of binary operators but none around unary operators. Fix the spacing in this expression.`,
    hints: [
      'Add a space around =, +, and *.',
      'Unary operators like ++ or & stay attached.',
    ],
    solution: `	result = a + b * c;`,
    starter: `	result=a+b*c;`,
    tags: ['kernel', 'coding-style', 'operators'],
  },
  {
    id: 'lx-ch15-c-016',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Drop Braces On A Single-Statement If',
    prompt: `Kernel style omits the braces when an if controls a single statement. Rewrite this block without the unnecessary braces.`,
    hints: [
      'A single controlled statement needs no braces.',
      'Keep the statement indented one tab under the if.',
    ],
    solution: `	if (err)
		return err;`,
    starter: `	if (err) {
		return err;
	}`,
    tags: ['kernel', 'coding-style', 'braces'],
  },
  {
    id: 'lx-ch15-c-017',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Keep Braces On Both If And Else',
    prompt: `When any branch of an if/else needs braces (because it has multiple statements), all branches use braces for consistency. Fix this snippet so both branches are braced.`,
    hints: [
      'The if branch has two statements, so it needs braces.',
      'Because the if is braced, the else must be braced too.',
    ],
    solution: `	if (ok) {
		setup();
		count++;
	} else {
		cleanup();
	}`,
    starter: `	if (ok) {
		setup();
		count++;
	} else
		cleanup();`,
    tags: ['kernel', 'coding-style', 'braces'],
  },
  {
    id: 'lx-ch15-c-018',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Place Else On The Brace Line',
    prompt: `Kernel style puts else (and the closing brace before it) on the same line: } else {. Fix the placement of else in this snippet.`,
    hints: [
      'The closing brace, else, and opening brace share one line.',
      'Write } else {.',
    ],
    solution: `	if (ready) {
		go();
	} else {
		wait();
	}`,
    starter: `	if (ready) {
		go();
	}
	else {
		wait();
	}`,
    tags: ['kernel', 'coding-style', 'braces'],
  },
  {
    id: 'lx-ch15-c-019',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Run Checkpatch In Strict Mode',
    prompt: `You want checkpatch to apply its stricter style checks to your patch file 0001-fix.patch. Write the exact command that runs checkpatch in strict mode on that patch.`,
    hints: [
      'There is a --strict flag.',
      'Still pass the patch file path.',
    ],
    solution: `scripts/checkpatch.pl --strict 0001-fix.patch`,
    starter: `# Run checkpatch with stricter checks on 0001-fix.patch
`,
    tags: ['kernel', 'checkpatch', 'command'],
  },
  {
    id: 'lx-ch15-c-020',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Check Staged Changes Without A Patch File',
    prompt: `You have staged your changes but have not made a patch file yet. Write the command that pipes git's diff of staged changes into checkpatch using the special - file argument.`,
    hints: [
      'git diff --cached prints the staged diff.',
      'Pass - to checkpatch so it reads from stdin.',
    ],
    solution: `git diff --cached | scripts/checkpatch.pl -`,
    starter: `# Pipe the staged diff into checkpatch
... | scripts/checkpatch.pl -`,
    tags: ['kernel', 'checkpatch', 'git'],
  },
  {
    id: 'lx-ch15-c-021',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Get Only The Maintainer Email Addresses',
    prompt: `You want get_maintainer to print just the bare email addresses (no roles or list descriptions) for the file mm/slab.c, suitable for piping into a script. Write the command using the option that limits output to email addresses.`,
    hints: [
      'The flag is --email (it is on by default) combined with --no-rolestats.',
      'Use --no-rolestats so only the addresses print.',
    ],
    solution: `scripts/get_maintainer.pl --no-rolestats mm/slab.c`,
    starter: `# Print only email addresses for mm/slab.c
scripts/get_maintainer.pl ... mm/slab.c`,
    tags: ['kernel', 'get_maintainer', 'command'],
  },
  {
    id: 'lx-ch15-c-022',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Generate Patches For A Branch Against Master',
    prompt: `Your topic branch has three commits on top of the master branch. Write the git format-patch command that produces one patch file per commit for everything your branch adds beyond master.`,
    hints: [
      'You can give format-patch a base revision like master.',
      'Everything reachable from HEAD but not master becomes a patch.',
    ],
    solution: `git format-patch master`,
    starter: `# Make one patch per commit not in master
git format-patch ...`,
    tags: ['kernel', 'git', 'format-patch'],
  },
  {
    id: 'lx-ch15-c-023',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Add A Cover Letter To A Series',
    prompt: `You are sending a 3-patch series and want format-patch to also create a 0000 cover letter you can fill in. Write the command that generates the last 3 commits as patches plus a cover letter.`,
    hints: [
      'The flag is --cover-letter.',
      'Combine it with -3 for the last three commits.',
    ],
    solution: `git format-patch --cover-letter -3`,
    starter: `# Last 3 commits, with a cover letter
git format-patch ...`,
    tags: ['kernel', 'git', 'format-patch'],
  },
  {
    id: 'lx-ch15-c-024',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Version A Resent Patch Series',
    prompt: `After review you are resending an improved series. Reviewers expect the subject prefix to read [PATCH v2]. Write the format-patch command that generates the last 2 commits with the version-2 subject prefix.`,
    hints: [
      'The option is -v2 (a shorthand for --reroll-count=2).',
      'It changes the prefix to [PATCH v2].',
    ],
    solution: `git format-patch -v2 -2`,
    starter: `# Generate v2 of a 2-patch series
git format-patch ...`,
    tags: ['kernel', 'git', 'format-patch'],
  },
  {
    id: 'lx-ch15-c-025',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Send A Patch With git send-email',
    prompt: `Write the git send-email command that mails the patch file 0001-fix-leak.patch to the maintainer torvalds@example.com with a copy (CC) to the list linux-kernel@vger.kernel.org.`,
    hints: [
      'Use --to for the primary recipient and --cc for the list.',
      'The patch file is the final argument.',
    ],
    solution: `git send-email --to=torvalds@example.com --cc=linux-kernel@vger.kernel.org 0001-fix-leak.patch`,
    starter: `# Mail the patch to maintainer, CC the list
git send-email ... 0001-fix-leak.patch`,
    tags: ['kernel', 'git', 'send-email'],
  },
  {
    id: 'lx-ch15-c-026',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reference A Fixed Commit With Fixes',
    prompt: `Your patch fixes a bug introduced by commit abc1234def56 titled "net: add foo offload". Write the Fixes: trailer line that records this, using the 12-character short hash and the original subject in parentheses.`,
    hints: [
      'Format: Fixes: <12-char hash> ("original subject").',
      'The subject goes in double quotes inside parentheses.',
    ],
    solution: `Fixes: abc1234def56 ("net: add foo offload")`,
    starter: `# Write the Fixes: trailer
Fixes: ...`,
    tags: ['kernel', 'commit-message', 'fixes'],
  },
  {
    id: 'lx-ch15-c-027',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Order The Trailer Block',
    prompt: `A commit message body is followed by trailers. Given a Reviewed-by from Sam Lee and your own Signed-off-by, write the trailer block. The Signed-off-by of the author who is sending the patch comes last; reviewer tags collected during review go above it.`,
    hints: [
      'Reviewed-by lines precede the submitter Signed-off-by.',
      'Each trailer is on its own line with no blank line between them.',
    ],
    solution: `Reviewed-by: Sam Lee <sam@example.com>
Signed-off-by: Nadia Khan <nadia@example.com>`,
    starter: `# Reviewer: Sam Lee <sam@example.com>
# You: Nadia Khan <nadia@example.com>
# Write the ordered trailer block:
`,
    tags: ['kernel', 'commit-message', 'trailers'],
  },
  {
    id: 'lx-ch15-c-028',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Rewrite A Past-Tense Commit Subject',
    prompt: `Kernel commit subjects use the imperative mood ("fix", "add", "remove"), describe the change, and start with a subsystem prefix. Rewrite this poorly worded subject "fixed the bug" for a change in the usb hub code that stops a null pointer dereference on disconnect.`,
    hints: [
      'Start with the subsystem prefix, e.g. usb: hub:.',
      'Use imperative present tense and say what is fixed.',
    ],
    solution: `usb: hub: fix NULL pointer dereference on disconnect`,
    starter: `# Original subject: "fixed the bug"
# Rewrite it properly:
`,
    tags: ['kernel', 'commit-message', 'subject'],
  },
  {
    id: 'lx-ch15-c-029',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Format A Switch Statement',
    prompt: `In kernel style, case labels align with the switch keyword (not indented an extra level), and each case body is indented one tab from the case. Fix the indentation of this switch.`,
    hints: [
      'case labels are at the same indentation as switch.',
      'Statements under a case get one more tab.',
    ],
    solution: `	switch (state) {
	case READY:
		start();
		break;
	default:
		idle();
		break;
	}`,
    starter: `	switch (state) {
		case READY:
			start();
			break;
		default:
			idle();
			break;
	}`,
    tags: ['kernel', 'coding-style', 'switch'],
  },
  {
    id: 'lx-ch15-c-030',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use A Goto Cleanup Label',
    prompt: `Kernel error handling uses goto to a cleanup label rather than nesting or repeating cleanup. Rewrite this function so that, on allocation failure, it goto's an err_free label that frees buf and returns the error.`,
    hints: [
      'Declare ret and jump to a label on failure.',
      'Label names should describe what they do, e.g. err_free.',
    ],
    solution: `int load(void)
{
	char *buf = kmalloc(64, GFP_KERNEL);
	int ret;

	if (!buf)
		return -ENOMEM;

	ret = parse(buf);
	if (ret)
		goto err_free;

	return 0;

err_free:
	kfree(buf);
	return ret;
}`,
    starter: `int load(void)
{
	char *buf = kmalloc(64, GFP_KERNEL);
	int ret;

	if (!buf)
		return -ENOMEM;

	ret = parse(buf);
	if (ret) {
		kfree(buf);
		return ret;
	}

	return 0;
}`,
    tags: ['kernel', 'coding-style', 'goto'],
  },
  {
    id: 'lx-ch15-c-031',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reply Below Quoted Review Text',
    prompt: `On kernel mailing lists you reply inline, below the quoted text you are answering, and trim everything irrelevant. Given a reviewer quote, write a properly formatted inline reply that keeps the quoted line (prefixed with >) and adds your answer underneath it.`,
    hints: [
      'Quoted lines keep their > prefix.',
      'Put your reply on the line(s) directly below the quote, not at the top.',
    ],
    solution: `> Why not use kzalloc here instead of kmalloc plus memset?

Good catch, kzalloc is cleaner. I will switch to it in v2.`,
    starter: `# Reviewer wrote:
#   Why not use kzalloc here instead of kmalloc plus memset?
# Write an inline (bottom-posted) reply:
`,
    tags: ['kernel', 'review', 'etiquette'],
  },
  {
    id: 'lx-ch15-c-032',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Write A Changelog Note In A Resend',
    prompt: `When you resend a series as v2, you list what changed since v1 below the --- line of the cover letter (or under the patch's tearline), so it does not become part of the commit message. Write a short v2 changelog noting that you switched to kzalloc and fixed a typo.`,
    hints: [
      'Notes under the --- line are stripped by git am and stay out of history.',
      'A simple "v2:" header followed by bullet lines is conventional.',
    ],
    solution: `---
v2:
 - use kzalloc instead of kmalloc + memset (Sam Lee)
 - fix typo in commit message`,
    starter: `# Put the changelog after the --- tearline so it is not committed
---
`,
    tags: ['kernel', 'review', 'changelog'],
  },
  {
    id: 'lx-ch15-c-033',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Base Work On The Right Subsystem Tree',
    prompt: `You are fixing a networking driver, so your patch should be based on the netdev maintainer's tree rather than mainline. Write the two git commands that add a remote named netdev for git://example.org/net-next.git and fetch it.`,
    hints: [
      'git remote add <name> <url> registers the tree.',
      'git fetch <name> downloads its branches.',
    ],
    solution: `git remote add netdev git://example.org/net-next.git
git fetch netdev`,
    starter: `# Add and fetch the net-next subsystem tree
git remote add ...
git fetch ...`,
    tags: ['kernel', 'git', 'subsystem-trees'],
  },
  {
    id: 'lx-ch15-c-034',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pick The Right Target For The Merge Window',
    prompt: `It is the two-week merge window and you have a brand-new feature (not a regression fix). Write a one-line decision recording which tree your feature should target during the merge window and why, in the form "target: <tree> -- <reason>".`,
    hints: [
      'New features queue for the NEXT release via the subsystem -next tree (linux-next).',
      'Only fixes go to the current -rc; features wait for the next merge window.',
    ],
    solution: `target: subsystem -next (linux-next) -- new features are not merged into mainline during -rc; they queue in -next for the next merge window`,
    starter: `# Merge window open, change = new feature
target: <tree> -- <reason>`,
    tags: ['kernel', 'merge-window', 'process'],
  },
  {
    id: 'lx-ch15-c-035',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Justify A Patch For The rc Cycle',
    prompt: `It is -rc4, several weeks after the merge window closed. You have a one-line fix for a crash that a recent commit introduced this cycle. Write a one-line decision in the form "target: <tree> -- <reason>" stating that this is appropriate to send now.`,
    hints: [
      'After the merge window, only bug fixes and regressions go into the current -rc.',
      'A crash regression introduced this cycle is exactly what -rc accepts.',
    ],
    solution: `target: current -rc (mainline fixes) -- it is a small regression fix for a crash introduced this cycle, which is exactly what the -rc stabilization period accepts`,
    starter: `# -rc4, change = one-line regression crash fix
target: <tree> -- <reason>`,
    tags: ['kernel', 'rc-cycle', 'process'],
  },
]

export default problems
