import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch05-c-036',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimal Loadable Module Skeleton',
    prompt: `Write a minimal loadable kernel module \`hello.c\` that prints \`"hello: loaded"\` at module init and \`"hello: unloaded"\` at module exit.

Requirements:
- Use \`module_init()\` and \`module_exit()\` to register the init/exit functions.
- The init function returns \`int\` (0 on success); the exit function returns \`void\`.
- Mark init as \`__init\` and exit as \`__exit\`.
- Use \`pr_info()\` for the messages.
- Set \`MODULE_LICENSE("GPL")\`.

This is the kind of out-of-tree module you build against your freshly compiled kernel tree before testing it in QEMU.`,
    hints: [
      'Include <linux/module.h> and <linux/kernel.h>.',
      'module_init takes the init function name; module_exit takes the exit function name.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init hello_init(void)
{
    pr_info("hello: loaded\\n");
    return 0;
}

static void __exit hello_exit(void)
{
    pr_info("hello: unloaded\\n");
}

module_init(hello_init);
module_exit(hello_exit);
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Minimal hello module");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: write __init and __exit functions

// TODO: register with module_init / module_exit
MODULE_LICENSE("GPL");`,
    tags: ['module', 'init', 'kbuild'],
  },
  {
    id: 'lx-ch05-c-037',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Out-Of-Tree Kbuild Makefile',
    prompt: `Write the \`Makefile\` used to build an out-of-tree module \`mymod.c\` into \`mymod.ko\` against the running kernel's build tree.

Requirements:
- Add \`mymod.o\` to \`obj-m\` so Kbuild builds it as a module.
- Provide a default target that invokes the kernel's top-level Makefile with \`-C\` pointing at \`/lib/modules/$(shell uname -r)/build\` and \`M=$(PWD)\` so it builds in your directory.
- Provide a \`clean\` target that does the same with the \`clean\` goal.

This is the standard recursive-make pattern the Kbuild system expects.`,
    hints: [
      'obj-m += mymod.o tells Kbuild to compile mymod.c as a module.',
      'The kernel build dir is passed with -C; M= tells Kbuild your module source directory.',
    ],
    solution: `obj-m += mymod.o

KDIR := /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    starter: `obj-m += mymod.o

KDIR := /lib/modules/$(shell uname -r)/build

all:
	# TODO: invoke kernel Makefile to build modules

clean:
	# TODO: invoke kernel Makefile clean`,
    tags: ['kbuild', 'makefile', 'module'],
  },
  {
    id: 'lx-ch05-c-038',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read the Kernel Command Line At Init',
    prompt: `Write a module init function that reads the full kernel command line (the string the bootloader / QEMU passed) and prints it.

Requirements:
- The kernel exports the boot command line as the global \`char saved_command_line[]\` via the symbol \`saved_command_line\` (an \`extern char *saved_command_line;\`).
- In \`init\`, print it with \`pr_info("cmdline: %s\\n", saved_command_line)\`.
- Return 0.

This lets a module observe parameters such as \`console=ttyS0\` or custom args you passed on the QEMU \`-append\` line.`,
    hints: [
      'saved_command_line is declared in include/linux/init.h as extern char *saved_command_line.',
      'Just %s it; it is a NUL-terminated string set up early in boot.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern char *saved_command_line;

static int __init cl_init(void)
{
    pr_info("cmdline: %s\\n", saved_command_line);
    return 0;
}

static void __exit cl_exit(void) { }

module_init(cl_init);
module_exit(cl_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: declare the extern for the saved command line

static int __init cl_init(void)
{
    // TODO: print the command line
    return 0;
}

static void __exit cl_exit(void) { }

module_init(cl_init);
module_exit(cl_exit);
MODULE_LICENSE("GPL");`,
    tags: ['cmdline', 'boot', 'module'],
  },
  {
    id: 'lx-ch05-c-039',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Module Parameter From the Command Line',
    prompt: `Write a module that declares an integer module parameter \`count\` (default 3) that can be set at load time, and at init prints \`"count=N"\`.

Requirements:
- Declare \`static int count = 3;\`.
- Register it with \`module_param(count, int, 0444)\` so it is readable in sysfs and settable via \`insmod mymod.ko count=10\` or via the kernel command line as \`mymod.count=10\`.
- Add \`MODULE_PARM_DESC(count, "number of items")\`.
- Print the value at init.`,
    hints: [
      'module_param(name, type, perm) lives in <linux/moduleparam.h> (pulled in by module.h).',
      'On the kernel command line a builtin uses modname.param=value.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int count = 3;
module_param(count, int, 0444);
MODULE_PARM_DESC(count, "number of items");

static int __init p_init(void)
{
    pr_info("count=%d\\n", count);
    return 0;
}

static void __exit p_exit(void) { }

module_init(p_init);
module_exit(p_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int count = 3;
// TODO: register count as a module parameter (perm 0444)
// TODO: add a parameter description

static int __init p_init(void)
{
    // TODO: print count
    return 0;
}

static void __exit p_exit(void) { }

module_init(p_init);
module_exit(p_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'cmdline', 'params'],
  },
  {
    id: 'lx-ch05-c-040',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Charp Module Parameter',
    prompt: `Write a module that accepts a string parameter \`name\` (a \`char *\`, default "world") and at init prints \`"hello, NAME"\`.

Requirements:
- Declare \`static char *name = "world";\`.
- Register with \`module_param(name, charp, 0444)\`.
- Add \`MODULE_PARM_DESC\`.
- Print using \`pr_info("hello, %s\\n", name)\`.

The \`charp\` type stores a pointer to the string the bootloader/insmod supplied; you must not free or modify it.`,
    hints: [
      'The parameter type token for a char * string is charp.',
      'Never kfree a charp parameter; the string is owned by the module loader.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static char *name = "world";
module_param(name, charp, 0444);
MODULE_PARM_DESC(name, "who to greet");

static int __init n_init(void)
{
    pr_info("hello, %s\\n", name);
    return 0;
}

static void __exit n_exit(void) { }

module_init(n_init);
module_exit(n_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static char *name = "world";
// TODO: register name as a charp module parameter

static int __init n_init(void)
{
    // TODO: greet
    return 0;
}

static void __exit n_exit(void) { }

module_init(n_init);
module_exit(n_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'params', 'charp'],
  },
  {
    id: 'lx-ch05-c-041',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Distinguish Builtin Versus Module Build',
    prompt: `Write \`feat.c\` plus the Kbuild snippet so the SAME source can be built either as a loadable module OR compiled into vmlinux, controlled by a Kconfig symbol \`CONFIG_FEAT\`.

Requirements:
- In the C file, at init use \`pr_info\` to print "feat: builtin" when \`IS_BUILTIN(CONFIG_FEAT)\` is true, else "feat: module".
- Provide the Kbuild line that maps the config symbol to the object: \`obj-$(CONFIG_FEAT) += feat.o\`.

Recall: \`CONFIG_FEAT\` is \`y\` (builtin), \`m\` (module), or undefined. \`IS_BUILTIN()\` / \`IS_MODULE()\` evaluate that tristate at compile time.`,
    hints: [
      'obj-$(CONFIG_FEAT) expands to obj-y or obj-m depending on the .config value.',
      'IS_BUILTIN(CONFIG_FEAT) is 1 only when the symbol is set to y.',
    ],
    solution: `// ---- Kbuild ----
// obj-$(CONFIG_FEAT) += feat.o

// ---- feat.c ----
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init feat_init(void)
{
    if (IS_BUILTIN(CONFIG_FEAT))
        pr_info("feat: builtin\\n");
    else
        pr_info("feat: module\\n");
    return 0;
}

static void __exit feat_exit(void) { }

module_init(feat_init);
module_exit(feat_exit);
MODULE_LICENSE("GPL");`,
    starter: `// Kbuild line:
// TODO: obj-$(CONFIG_FEAT) += feat.o

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init feat_init(void)
{
    // TODO: branch on IS_BUILTIN(CONFIG_FEAT)
    return 0;
}

static void __exit feat_exit(void) { }

module_init(feat_init);
module_exit(feat_exit);
MODULE_LICENSE("GPL");`,
    tags: ['kbuild', 'kconfig', 'builtin'],
  },
  {
    id: 'lx-ch05-c-042',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Guard Code Behind a Kconfig Symbol',
    prompt: `Write an init function that prints an extra debug line ONLY when \`CONFIG_MYFEAT_DEBUG\` is enabled in the build configuration, and always prints a normal line.

Requirements:
- Always print \`pr_info("myfeat: up\\n")\`.
- Compile in \`pr_info("myfeat: debug build\\n")\` only if \`CONFIG_MYFEAT_DEBUG\` is defined, using the preprocessor.
- Use \`#ifdef CONFIG_MYFEAT_DEBUG\` (or \`IS_ENABLED\`) so the debug code is removed entirely when the option is off.

This mirrors how rebuilding with a config option toggled actually changes which code lands in vmlinux.`,
    hints: [
      'CONFIG_* booleans are #defined to 1 (or undefined) in the generated autoconf header.',
      'IS_ENABLED(CONFIG_MYFEAT_DEBUG) works for y and m; #ifdef works too for plain bools.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init mf_init(void)
{
    pr_info("myfeat: up\\n");
#ifdef CONFIG_MYFEAT_DEBUG
    pr_info("myfeat: debug build\\n");
#endif
    return 0;
}

static void __exit mf_exit(void) { }

module_init(mf_init);
module_exit(mf_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init mf_init(void)
{
    pr_info("myfeat: up\\n");
    // TODO: print debug line only if CONFIG_MYFEAT_DEBUG is enabled
    return 0;
}

static void __exit mf_exit(void) { }

module_init(mf_init);
module_exit(mf_exit);
MODULE_LICENSE("GPL");`,
    tags: ['kconfig', 'preprocessor', 'config'],
  },
  {
    id: 'lx-ch05-c-043',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Kernel Version And Banner',
    prompt: `Write an init function that prints the running kernel's version string and the compiled-in version code.

Requirements:
- Print \`UTS_RELEASE\` (the version string, e.g. "6.6.0") and the macro \`LINUX_VERSION_CODE\`.
- Use the form: \`pr_info("running %s code=%d\\n", UTS_RELEASE, LINUX_VERSION_CODE)\`.
- Include \`<generated/utsrelease.h>\` for \`UTS_RELEASE\` and \`<linux/version.h>\` for the version code.

These come from the build; reading them is a quick sanity check that your freshly built kernel booted.`,
    hints: [
      'UTS_RELEASE lives in <generated/utsrelease.h>, produced by the build.',
      'LINUX_VERSION_CODE is in <linux/version.h>, computed from the Makefile VERSION/PATCHLEVEL/SUBLEVEL.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/version.h>
#include <generated/utsrelease.h>

static int __init v_init(void)
{
    pr_info("running %s code=%d\\n", UTS_RELEASE, LINUX_VERSION_CODE);
    return 0;
}

static void __exit v_exit(void) { }

module_init(v_init);
module_exit(v_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
// TODO: include version headers

static int __init v_init(void)
{
    // TODO: print UTS_RELEASE and LINUX_VERSION_CODE
    return 0;
}

static void __exit v_exit(void) { }

module_init(v_init);
module_exit(v_exit);
MODULE_LICENSE("GPL");`,
    tags: ['version', 'boot', 'module'],
  },
  {
    id: 'lx-ch05-c-044',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Use pr_fmt For Consistent Log Prefixes',
    prompt: `Write a module that prefixes every one of its \`pr_*\` messages with \`"acme: "\` automatically, without typing the prefix in each call.

Requirements:
- Define \`#define pr_fmt(fmt) "acme: " fmt\` BEFORE including any kernel header that uses it (i.e. before <linux/kernel.h> / <linux/printk.h>).
- In init, call \`pr_info("starting\\n")\` and \`pr_warn("low memory mode\\n")\`. They must appear in dmesg as \`acme: starting\` and \`acme: low memory mode\`.

Reading these prefixed lines in the boot log makes your subsystem easy to grep.`,
    hints: [
      'pr_fmt must be defined before <linux/printk.h> is pulled in to take effect.',
      'pr_info(x) expands to printk(KERN_INFO pr_fmt(x)).',
    ],
    solution: `#define pr_fmt(fmt) "acme: " fmt

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init a_init(void)
{
    pr_info("starting\\n");
    pr_warn("low memory mode\\n");
    return 0;
}

static void __exit a_exit(void) { }

module_init(a_init);
module_exit(a_exit);
MODULE_LICENSE("GPL");`,
    starter: `// TODO: define pr_fmt before the includes

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init a_init(void)
{
    pr_info("starting\\n");
    pr_warn("low memory mode\\n");
    return 0;
}

static void __exit a_exit(void) { }

module_init(a_init);
module_exit(a_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'logging', 'module'],
  },
  {
    id: 'lx-ch05-c-045',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Module Metadata Macros',
    prompt: `Write the metadata block for a module so that \`modinfo\` reports author, description, license, version, and an alias.

Requirements:
- \`MODULE_AUTHOR("Your Name")\`
- \`MODULE_DESCRIPTION("demo driver")\`
- \`MODULE_LICENSE("GPL")\`
- \`MODULE_VERSION("1.0")\`
- \`MODULE_ALIAS("demo-alt")\`

Provide a trivial init/exit so it is a complete compilable module. These strings are embedded in the \`.ko\` and shown by \`modinfo\`.`,
    hints: [
      'These macros all live in <linux/module.h>.',
      'A non-GPL or missing MODULE_LICENSE taints the kernel and hides GPL-only symbols.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init d_init(void) { return 0; }
static void __exit d_exit(void) { }

module_init(d_init);
module_exit(d_exit);

MODULE_AUTHOR("Your Name");
MODULE_DESCRIPTION("demo driver");
MODULE_LICENSE("GPL");
MODULE_VERSION("1.0");
MODULE_ALIAS("demo-alt");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init d_init(void) { return 0; }
static void __exit d_exit(void) { }

module_init(d_init);
module_exit(d_exit);

// TODO: add author, description, license, version, alias macros`,
    tags: ['module', 'metadata', 'modinfo'],
  },
  {
    id: 'lx-ch05-c-046',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Init Function That Reports Failure',
    prompt: `Write an init function for a module that depends on a feature being enabled. If \`CONFIG_NET\` is NOT enabled in this build, it must fail to load.

Requirements:
- If \`!IS_ENABLED(CONFIG_NET)\`, print \`pr_err("need CONFIG_NET\\n")\` and return \`-ENODEV\`.
- Otherwise print \`pr_info("ok\\n")\` and return 0.

Returning a negative errno from init causes \`insmod\` to fail and the module not to load — this is the correct way to refuse to initialize.`,
    hints: [
      'A negative errno returned from the init function aborts module loading.',
      '-ENODEV is the conventional code for "required device/feature absent".',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/errno.h>

static int __init r_init(void)
{
    if (!IS_ENABLED(CONFIG_NET)) {
        pr_err("need CONFIG_NET\\n");
        return -ENODEV;
    }
    pr_info("ok\\n");
    return 0;
}

static void __exit r_exit(void) { }

module_init(r_init);
module_exit(r_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/errno.h>

static int __init r_init(void)
{
    // TODO: refuse to load with -ENODEV if CONFIG_NET is disabled
    return 0;
}

static void __exit r_exit(void) { }

module_init(r_init);
module_exit(r_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'init', 'errno'],
  },
  {
    id: 'lx-ch05-c-047',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Allocate And Free In Init/Exit',
    prompt: `Write a module that allocates a 1 KB buffer at init and frees it at exit.

Requirements:
- Declare \`static char *buf;\`.
- In init, \`buf = kmalloc(1024, GFP_KERNEL)\`; if it returns NULL, return \`-ENOMEM\`.
- On success, print \`"allocated"\` and return 0.
- In exit, \`kfree(buf)\` (kfree(NULL) is safe).

Module init runs in process context where \`GFP_KERNEL\` (which may sleep) is allowed.`,
    hints: [
      'Always check kmalloc for NULL and return -ENOMEM on failure.',
      'GFP_KERNEL may sleep; that is fine in init (process context).',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *buf;

static int __init b_init(void)
{
    buf = kmalloc(1024, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;
    pr_info("allocated\\n");
    return 0;
}

static void __exit b_exit(void)
{
    kfree(buf);
}

module_init(b_init);
module_exit(b_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *buf;

static int __init b_init(void)
{
    // TODO: kmalloc 1024 bytes, handle failure
    return 0;
}

static void __exit b_exit(void)
{
    // TODO: free
}

module_init(b_init);
module_exit(b_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'memory', 'kmalloc'],
  },
  {
    id: 'lx-ch05-c-048',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'core_param For A Builtin-Only Tunable',
    prompt: `Write a builtin (non-loadable) feature that exposes an integer tunable \`level\` on the kernel command line WITHOUT a module-name prefix.

Requirements:
- Declare \`static int level = 1;\`.
- Use \`core_param(level, level, int, 0644)\` so it is settable as plain \`level=2\` on the kernel command line (the boot \`-append\`), not \`modname.level=2\`.
- In an \`__init\` function (registered with \`early_initcall\` or \`module_init\` is fine here, use \`late_initcall\`) print the value.

\`core_param\` is how core kernel code (not a named module) registers a boot parameter.`,
    hints: [
      'core_param(name, var, type, perm) drops the module-name prefix for the boot param.',
      'For builtin core code, register the function with an initcall such as late_initcall.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int level = 1;
core_param(level, level, int, 0644);

static int __init lv_init(void)
{
    pr_info("level=%d\\n", level);
    return 0;
}

late_initcall(lv_init);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int level = 1;
// TODO: register a prefix-less boot parameter with core_param

static int __init lv_init(void)
{
    // TODO: print level
    return 0;
}

late_initcall(lv_init);
MODULE_LICENSE("GPL");`,
    tags: ['cmdline', 'params', 'boot'],
  },
  {
    id: 'lx-ch05-c-049',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register An early_param Boot Handler',
    prompt: `Register a custom kernel boot parameter \`myquota=\` parsed very early in boot, before normal initcalls run.

Requirements:
- Define \`static int __init parse_quota(char *str)\` that does \`kstrtoint(str, 10, &quota)\` into a static int \`quota\`, then \`return 0\` (0 = handled).
- Register it with \`early_param("myquota", parse_quota)\`.
- The handler receives the value after \`=\` as \`str\`.

\`early_param\` handlers run during early boot setup; you can pass \`myquota=42\` on the QEMU \`-append\` line.`,
    hints: [
      'early_param("name", fn) wires fn to the boot token "name=".',
      'kstrtoint returns 0 on success; return 0 from the handler to mark the param consumed.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int quota;

static int __init parse_quota(char *str)
{
    if (kstrtoint(str, 10, &quota))
        return 0;
    pr_info("myquota=%d\\n", quota);
    return 0;
}
early_param("myquota", parse_quota);

MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int quota;

static int __init parse_quota(char *str)
{
    // TODO: parse str into quota with kstrtoint, return 0
    return 0;
}
// TODO: register parse_quota for the "myquota" boot token

MODULE_LICENSE("GPL");`,
    tags: ['cmdline', 'boot', 'early-param'],
  },
  {
    id: 'lx-ch05-c-050',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Boot Parameter With __setup',
    prompt: `Register a flag-style boot parameter \`fastpath\` using the classic \`__setup()\` mechanism (no value, just presence enables it).

Requirements:
- Define \`static int fastpath;\`.
- Write \`static int __init set_fastpath(char *str)\` that sets \`fastpath = 1;\` and returns 1 (1 = consumed).
- Register with \`__setup("fastpath", set_fastpath)\`.

Passing \`fastpath\` on the boot command line (QEMU \`-append "... fastpath"\`) triggers the handler.`,
    hints: [
      '__setup("token", fn) matches the boot token; the handler returns 1 if it consumed it.',
      'For a presence flag, ignore str and just set your variable.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int fastpath;

static int __init set_fastpath(char *str)
{
    fastpath = 1;
    return 1;
}
__setup("fastpath", set_fastpath);

MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int fastpath;

static int __init set_fastpath(char *str)
{
    // TODO: enable fastpath, return 1
    return 1;
}
// TODO: register with __setup

MODULE_LICENSE("GPL");`,
    tags: ['cmdline', 'boot', 'setup'],
  },
  {
    id: 'lx-ch05-c-051',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Order Init With Initcall Levels',
    prompt: `Write three init functions registered at different initcall levels and predict that they run in level order (early before late). Print a tag from each.

Requirements:
- \`a_init\` registered with \`early_initcall\`, prints "A".
- \`b_init\` registered with \`arch_initcall\`, prints "B".
- \`c_init\` registered with \`late_initcall\`, prints "C".
- Each is \`static int __init ...(void)\` returning 0.

In the boot log they appear A, B, C because initcall levels run in a fixed order during boot.`,
    hints: [
      'Initcall levels run early -> core -> arch -> ... -> late, then module_init (device) level.',
      'Each registration macro takes just the function name.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init a_init(void) { pr_info("A\\n"); return 0; }
static int __init b_init(void) { pr_info("B\\n"); return 0; }
static int __init c_init(void) { pr_info("C\\n"); return 0; }

early_initcall(a_init);
arch_initcall(b_init);
late_initcall(c_init);

MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init a_init(void) { pr_info("A\\n"); return 0; }
static int __init b_init(void) { pr_info("B\\n"); return 0; }
static int __init c_init(void) { pr_info("C\\n"); return 0; }

// TODO: register a_init early, b_init at arch level, c_init late

MODULE_LICENSE("GPL");`,
    tags: ['boot', 'initcall', 'ordering'],
  },
  {
    id: 'lx-ch05-c-052',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Free __initdata After Boot',
    prompt: `Write a module that uses a large lookup table needed only during initialization, and ensures its memory is reclaimed after boot.

Requirements:
- Declare \`static const int table[] __initconst = { 1, 2, 3, 4, 5 };\`.
- In an \`__init\` function, sum the table and print the total.
- Because the data is \`__initconst\` and the function is \`__init\`, both live in the \`.init\` section the kernel frees after initialization completes.

Do NOT reference \`table\` from any non-\`__init\` code, or you would access freed memory.`,
    hints: [
      '__init code and __initdata/__initconst data are placed in a section freed after boot.',
      'Never let live (post-init) code dereference __init data.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static const int table[] __initconst = { 1, 2, 3, 4, 5 };

static int __init t_init(void)
{
    int i, sum = 0;
    for (i = 0; i < ARRAY_SIZE(table); i++)
        sum += table[i];
    pr_info("sum=%d\\n", sum);
    return 0;
}

static void __exit t_exit(void) { }

module_init(t_init);
module_exit(t_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: declare an __initconst table { 1,2,3,4,5 }

static int __init t_init(void)
{
    // TODO: sum the table and print
    return 0;
}

static void __exit t_exit(void) { }

module_init(t_init);
module_exit(t_exit);
MODULE_LICENSE("GPL");`,
    tags: ['init', 'memory', 'boot'],
  },
  {
    id: 'lx-ch05-c-053',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Choose The Right printk Level For dmesg',
    prompt: `Write an init function that logs at four different severity levels so they can be filtered in \`dmesg\` by loglevel.

Requirements:
- Emit one message each: \`pr_err\`, \`pr_warn\`, \`pr_info\`, \`pr_debug\`.
- Use distinct text: "fatal-ish", "careful", "fyi", "trace".
- Note in a comment that \`pr_debug\` only prints if \`DEBUG\` is defined or dynamic debug is enabled, and that the \`console=\` loglevel on the boot line controls what reaches the serial console.`,
    hints: [
      'pr_err/pr_warn/pr_info/pr_debug map to KERN_ERR/WARNING/INFO/DEBUG.',
      'The boot loglevel (e.g. loglevel=7 or quiet) decides which levels reach the console.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init lg_init(void)
{
    pr_err("fatal-ish\\n");
    pr_warn("careful\\n");
    pr_info("fyi\\n");
    pr_debug("trace\\n"); /* needs DEBUG or dynamic debug enabled */
    return 0;
}

static void __exit lg_exit(void) { }

module_init(lg_init);
module_exit(lg_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init lg_init(void)
{
    // TODO: emit pr_err, pr_warn, pr_info, pr_debug messages
    return 0;
}

static void __exit lg_exit(void) { }

module_init(lg_init);
module_exit(lg_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'dmesg', 'logging'],
  },
  {
    id: 'lx-ch05-c-054',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Detect Running Under a Hypervisor',
    prompt: `Write an init function that prints whether the kernel believes it is running inside a virtual machine (such as QEMU/KVM).

Requirements:
- On x86, use \`boot_cpu_has(X86_FEATURE_HYPERVISOR)\` to test the hypervisor-present CPU flag.
- Print "virtual" if set, else "bare metal".
- Guard the x86-specific code with \`#ifdef CONFIG_X86\` and on other arches just print "unknown".

This is handy because you typically boot your freshly built kernel under QEMU first.`,
    hints: [
      'X86_FEATURE_HYPERVISOR is set by QEMU/KVM and most hypervisors.',
      'boot_cpu_has() is declared in <asm/cpufeature.h> (pulled by <asm/processor.h>).',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#ifdef CONFIG_X86
#include <asm/cpufeature.h>
#endif

static int __init hv_init(void)
{
#ifdef CONFIG_X86
    if (boot_cpu_has(X86_FEATURE_HYPERVISOR))
        pr_info("virtual\\n");
    else
        pr_info("bare metal\\n");
#else
    pr_info("unknown\\n");
#endif
    return 0;
}

static void __exit hv_exit(void) { }

module_init(hv_init);
module_exit(hv_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#ifdef CONFIG_X86
#include <asm/cpufeature.h>
#endif

static int __init hv_init(void)
{
    // TODO: detect hypervisor on x86, print result
    return 0;
}

static void __exit hv_exit(void) { }

module_init(hv_init);
module_exit(hv_exit);
MODULE_LICENSE("GPL");`,
    tags: ['qemu', 'boot', 'x86'],
  },
  {
    id: 'lx-ch05-c-055',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Total RAM Seen At Boot',
    prompt: `Write an init function that prints the total amount of RAM the kernel detected (the same figure QEMU's \`-m\` flag influences).

Requirements:
- Use \`totalram_pages()\` to get the number of usable RAM pages.
- Convert to MiB: \`(totalram_pages() << PAGE_SHIFT) >> 20\`.
- Print \`pr_info("ram: %lu MiB\\n", mib)\`.

Booting the same kernel in QEMU with different \`-m\` values changes what this reports.`,
    hints: [
      'totalram_pages() returns an unsigned long count of pages.',
      'Bytes = pages << PAGE_SHIFT; divide by 1<<20 for MiB.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/mm.h>

static int __init ram_init(void)
{
    unsigned long mib = (totalram_pages() << PAGE_SHIFT) >> 20;
    pr_info("ram: %lu MiB\\n", mib);
    return 0;
}

static void __exit ram_exit(void) { }

module_init(ram_init);
module_exit(ram_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/mm.h>

static int __init ram_init(void)
{
    // TODO: compute MiB from totalram_pages() and print
    return 0;
}

static void __exit ram_exit(void) { }

module_init(ram_init);
module_exit(ram_exit);
MODULE_LICENSE("GPL");`,
    tags: ['boot', 'memory', 'qemu'],
  },
  {
    id: 'lx-ch05-c-056',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Conditional Object Selection In Kbuild',
    prompt: `Write the Kbuild fragment for a driver \`widget\` whose core file \`widget-core.c\` is always built, but an optional debugfs helper \`widget-dbg.c\` is built only when \`CONFIG_WIDGET_DEBUG\` is set.

Requirements:
- Compose the module from multiple objects: \`obj-$(CONFIG_WIDGET) += widget.o\`.
- \`widget-y := widget-core.o\` for the always-present object.
- \`widget-$(CONFIG_WIDGET_DEBUG) += widget-dbg.o\` to conditionally append the debug object.

This is the standard Kbuild multi-file / conditional-object pattern.`,
    hints: [
      'widget-y lists objects always linked into widget.o.',
      'widget-$(CONFIG_X) += foo.o conditionally appends foo.o based on CONFIG_X.',
    ],
    solution: `obj-$(CONFIG_WIDGET) += widget.o

widget-y := widget-core.o
widget-$(CONFIG_WIDGET_DEBUG) += widget-dbg.o`,
    starter: `obj-$(CONFIG_WIDGET) += widget.o

# TODO: always include widget-core.o
# TODO: include widget-dbg.o only when CONFIG_WIDGET_DEBUG is set`,
    tags: ['kbuild', 'kconfig', 'makefile'],
  },
  {
    id: 'lx-ch05-c-057',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Write A Kconfig Entry',
    prompt: `Write the \`Kconfig\` stanza that adds a tristate option for your widget driver so it shows up in \`menuconfig\`.

Requirements:
- Symbol \`WIDGET\`, \`tristate\` (so it can be y/m/n), prompt text "ACME Widget support".
- It \`depends on\` \`PCI\`.
- Add a one-line \`help\` block describing it.
- Add a second boolean symbol \`WIDGET_DEBUG\` that \`depends on WIDGET\` with its own prompt and help.

This is exactly what \`make menuconfig\` reads to render the option you toggle before rebuilding.`,
    hints: [
      'tristate gives y/m/n; bool gives only y/n.',
      'depends on hides the option until the dependency is met; help text is indented under a help line.',
    ],
    solution: `config WIDGET
	tristate "ACME Widget support"
	depends on PCI
	help
	  Support for the ACME Widget device. Say M to build as a module.

config WIDGET_DEBUG
	bool "ACME Widget debugging"
	depends on WIDGET
	help
	  Enable extra debug logging and a debugfs interface for the widget.`,
    starter: `config WIDGET
	# TODO: tristate prompt, depends on PCI, help

config WIDGET_DEBUG
	# TODO: bool prompt, depends on WIDGET, help`,
    tags: ['kconfig', 'menuconfig', 'config'],
  },
  {
    id: 'lx-ch05-c-058',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Conditional Code With IS_REACHABLE',
    prompt: `Write code in a builtin file that optionally calls into another subsystem (\`other_ping()\`) only if that subsystem is actually reachable from this build (it may be a module while you are builtin).

Requirements:
- Guard the call with \`if (IS_REACHABLE(CONFIG_OTHER))\`.
- If reachable, call \`other_ping()\`; else print "other unreachable".
- Explain in a comment why \`IS_ENABLED\` is NOT sufficient: a builtin (y) file cannot link against a symbol from a module (m).

\`IS_REACHABLE\` is true only when the dependency can actually be linked given this file's own y/m status.`,
    hints: [
      'IS_REACHABLE(CONFIG_X) is false when X=m but the caller is builtin (y).',
      'IS_ENABLED is true for both y and m, which would mislink a builtin against a module.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern void other_ping(void);

static int __init r_init(void)
{
    /* IS_ENABLED would be true for OTHER=m, but a builtin can't link a
     * module symbol; IS_REACHABLE accounts for our own y/m status. */
    if (IS_REACHABLE(CONFIG_OTHER))
        other_ping();
    else
        pr_info("other unreachable\\n");
    return 0;
}

static void __exit r_exit(void) { }

module_init(r_init);
module_exit(r_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern void other_ping(void);

static int __init r_init(void)
{
    // TODO: only call other_ping() if IS_REACHABLE(CONFIG_OTHER)
    return 0;
}

static void __exit r_exit(void) { }

module_init(r_init);
module_exit(r_exit);
MODULE_LICENSE("GPL");`,
    tags: ['kconfig', 'kbuild', 'config'],
  },
  {
    id: 'lx-ch05-c-059',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two-Value Array Module Parameter',
    prompt: `Write a module that accepts up to 4 integers on load via \`module_param_array\`, e.g. \`insmod m.ko vals=1,2,3\`.

Requirements:
- Declare \`static int vals[4];\` and \`static int nvals;\`.
- Register with \`module_param_array(vals, int, &nvals, 0444)\` so \`nvals\` receives how many were supplied.
- In init, loop \`nvals\` times and print each value.`,
    hints: [
      'module_param_array(name, type, &count_var, perm) stores the supplied count in count_var.',
      'Iterate from 0 to nvals, not to the array capacity.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int vals[4];
static int nvals;
module_param_array(vals, int, &nvals, 0444);

static int __init av_init(void)
{
    int i;
    for (i = 0; i < nvals; i++)
        pr_info("vals[%d]=%d\\n", i, vals[i]);
    return 0;
}

static void __exit av_exit(void) { }

module_init(av_init);
module_exit(av_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int vals[4];
static int nvals;
// TODO: register vals as an int array param storing count in nvals

static int __init av_init(void)
{
    // TODO: print the supplied values
    return 0;
}

static void __exit av_exit(void) { }

module_init(av_init);
module_exit(av_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'params', 'array'],
  },
  {
    id: 'lx-ch05-c-060',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Init/Exit With Full Unwind On Failure',
    prompt: `Write a module init that performs three setup steps that can each fail, freeing only what was already acquired if a later step fails. The exit path tears everything down.

Requirements:
- Step 1: \`buf = kmalloc(256, GFP_KERNEL)\`; on NULL return -ENOMEM.
- Step 2: \`buf2 = kmalloc(256, GFP_KERNEL)\`; on NULL, free \`buf\` and return -ENOMEM.
- Step 3: if \`IS_ENABLED(CONFIG_DEMO_STRICT)\` is false, treat as failure: free \`buf2\` then \`buf\` and return -EINVAL.
- Use \`goto\` unwind labels (the canonical kernel error-handling style), not duplicated cleanup.
- \`exit\` frees both buffers.`,
    hints: [
      'Use goto err_two / err_one labels that fall through, freeing in reverse acquisition order.',
      'Each failure jumps to the label that undoes everything acquired so far.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *buf, *buf2;

static int __init u_init(void)
{
    buf = kmalloc(256, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;

    buf2 = kmalloc(256, GFP_KERNEL);
    if (!buf2)
        goto err_one;

    if (!IS_ENABLED(CONFIG_DEMO_STRICT))
        goto err_two;

    pr_info("ready\\n");
    return 0;

err_two:
    kfree(buf2);
    buf2 = NULL;
err_one:
    kfree(buf);
    buf = NULL;
    return buf2 ? -EINVAL : -ENOMEM;
}

static void __exit u_exit(void)
{
    kfree(buf2);
    kfree(buf);
}

module_init(u_init);
module_exit(u_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *buf, *buf2;

static int __init u_init(void)
{
    // TODO: three steps with goto-based unwind on failure
    return 0;
}

static void __exit u_exit(void)
{
    // TODO: free both buffers
}

module_init(u_init);
module_exit(u_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'error-handling', 'init'],
  },
  {
    id: 'lx-ch05-c-061',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Validate A String Boot Parameter',
    prompt: `Register a boot parameter \`mode=\` that accepts only "fast" or "safe"; reject anything else by leaving a default and warning.

Requirements:
- Use \`early_param("mode", parse_mode)\`.
- \`parse_mode\` compares \`str\` with \`strcmp\` to "fast"/"safe", setting a static \`int fast\` (1 for fast, 0 for safe).
- For an unknown value, \`pr_warn("mode: unknown '%s', using safe\\n", str)\` and leave \`fast = 0\`.
- Return 0 in all cases.

This is robust parsing of an untrusted command-line value passed on the QEMU \`-append\` line.`,
    hints: [
      'strcmp(str, "fast") == 0 tests for an exact match.',
      'early_param handlers must tolerate any string the user typed; never trust it blindly.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/string.h>

static int fast;

static int __init parse_mode(char *str)
{
    if (!str)
        return 0;
    if (!strcmp(str, "fast"))
        fast = 1;
    else if (!strcmp(str, "safe"))
        fast = 0;
    else
        pr_warn("mode: unknown '%s', using safe\\n", str);
    return 0;
}
early_param("mode", parse_mode);

MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/string.h>

static int fast;

static int __init parse_mode(char *str)
{
    // TODO: accept "fast"/"safe", warn on anything else
    return 0;
}
// TODO: register with early_param

MODULE_LICENSE("GPL");`,
    tags: ['cmdline', 'boot', 'validation'],
  },
  {
    id: 'lx-ch05-c-062',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parse The Command Line For A Substring',
    prompt: `Write an init function that scans the boot command line for the token \`nosplash\` and reports whether it was present, using only the raw command-line string.

Requirements:
- Use \`extern char *saved_command_line;\`.
- Use \`strstr(saved_command_line, "nosplash")\` to detect the token.
- Print "splash disabled" or "splash enabled" accordingly.
- Note in a comment that a real parser would also check word boundaries; \`strstr\` is a simplified check.`,
    hints: [
      'strstr returns non-NULL if the substring is found.',
      'saved_command_line is the full, unparsed boot line.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/string.h>

extern char *saved_command_line;

static int __init s_init(void)
{
    /* simplified: a real parser would check word boundaries */
    if (strstr(saved_command_line, "nosplash"))
        pr_info("splash disabled\\n");
    else
        pr_info("splash enabled\\n");
    return 0;
}

static void __exit s_exit(void) { }

module_init(s_init);
module_exit(s_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/string.h>

extern char *saved_command_line;

static int __init s_init(void)
{
    // TODO: detect "nosplash" in saved_command_line
    return 0;
}

static void __exit s_exit(void) { }

module_init(s_init);
module_exit(s_exit);
MODULE_LICENSE("GPL");`,
    tags: ['cmdline', 'boot', 'parsing'],
  },
  {
    id: 'lx-ch05-c-063',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Writable Module Param With Notification',
    prompt: `Expose a module parameter \`gain\` that can be changed at runtime via sysfs, running custom code each time it is written, using \`module_param_cb\`.

Requirements:
- Declare \`static int gain = 1;\`.
- Define a \`struct kernel_param_ops\` with \`.set\` and \`.get\`.
- \`.set\` calls \`param_set_int(val, kp)\`, then \`pr_info("gain set to %d\\n", gain)\`, returning the result.
- \`.get\` is \`param_get_int\`.
- Register with \`module_param_cb(gain, &gain_ops, &gain, 0644)\` (0644 so it is writable in sysfs).`,
    hints: [
      'param_set_int / param_get_int are the standard int handlers you can wrap.',
      'module_param_cb(name, &ops, arg, perm) attaches custom set/get callbacks.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int gain = 1;

static int gain_set(const char *val, const struct kernel_param *kp)
{
    int ret = param_set_int(val, kp);
    if (!ret)
        pr_info("gain set to %d\\n", gain);
    return ret;
}

static const struct kernel_param_ops gain_ops = {
    .set = gain_set,
    .get = param_get_int,
};
module_param_cb(gain, &gain_ops, &gain, 0644);

static int __init g_init(void) { return 0; }
static void __exit g_exit(void) { }

module_init(g_init);
module_exit(g_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int gain = 1;

// TODO: define gain_set that wraps param_set_int and logs
// TODO: define struct kernel_param_ops gain_ops { .set, .get }
// TODO: module_param_cb(gain, &gain_ops, &gain, 0644)

static int __init g_init(void) { return 0; }
static void __exit g_exit(void) { }

module_init(g_init);
module_exit(g_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'params', 'sysfs'],
  },
  {
    id: 'lx-ch05-c-064',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Module Dependency Via Exported Symbol',
    prompt: `Write a "provider" module that exports a function for other modules to call, so the kernel records the dependency (\`modprobe\` will load the provider first).

Requirements:
- Define \`int prov_add(int a, int b) { return a + b; }\`.
- Export it with \`EXPORT_SYMBOL(prov_add)\` so other modules can link against it.
- Provide trivial init/exit.
- In a comment, name where a consumer would declare it (its own \`extern int prov_add(int, int);\` or a shared header) and note that the dependency lands in \`modules.dep\`.`,
    hints: [
      'EXPORT_SYMBOL makes a symbol visible to other modules; EXPORT_SYMBOL_GPL restricts to GPL modules.',
      'depmod records the inter-module dependency in modules.dep.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

int prov_add(int a, int b)
{
    return a + b;
}
EXPORT_SYMBOL(prov_add);
/* A consumer module declares: extern int prov_add(int, int);
 * depmod then records the dependency in modules.dep. */

static int __init p_init(void) { return 0; }
static void __exit p_exit(void) { }

module_init(p_init);
module_exit(p_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

int prov_add(int a, int b)
{
    return a + b;
}
// TODO: export prov_add so other modules can call it

static int __init p_init(void) { return 0; }
static void __exit p_exit(void) { }

module_init(p_init);
module_exit(p_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'symbols', 'depmod'],
  },
  {
    id: 'lx-ch05-c-065',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Time The Boot/Init Phase',
    prompt: `Write an init function that measures how long a piece of its own setup takes, in nanoseconds, the way you might instrument a slow boot.

Requirements:
- Capture \`u64 t0 = ktime_get_ns();\`.
- Do some work (a loop computing a sum, or call your real setup).
- Capture \`u64 t1 = ktime_get_ns();\`.
- Print the delta: \`pr_info("setup took %llu ns\\n", t1 - t0)\`.
- Use the correct \`%llu\` format for \`u64\`.

Reading such timings against the boot log helps you see what is slow during initialization.`,
    hints: [
      'ktime_get_ns() returns a u64 monotonic nanosecond timestamp.',
      'Print u64 with %llu to avoid format-warning bugs.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/ktime.h>

static int __init tm_init(void)
{
    u64 t0, t1;
    volatile unsigned long sum = 0;
    int i;

    t0 = ktime_get_ns();
    for (i = 0; i < 100000; i++)
        sum += i;
    t1 = ktime_get_ns();

    pr_info("setup took %llu ns\\n", t1 - t0);
    return 0;
}

static void __exit tm_exit(void) { }

module_init(tm_init);
module_exit(tm_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/ktime.h>

static int __init tm_init(void)
{
    // TODO: bracket some work with ktime_get_ns() and print the delta
    return 0;
}

static void __exit tm_exit(void) { }

module_init(tm_init);
module_exit(tm_exit);
MODULE_LICENSE("GPL");`,
    tags: ['boot', 'timing', 'module'],
  },
  {
    id: 'lx-ch05-c-066',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Detect The Boot Console Device',
    prompt: `Write an init function that reports which console the kernel is using, distinguishing a serial console (typical under QEMU with \`console=ttyS0\`) by scanning the registered console list.

Requirements:
- Iterate the console list with \`for_each_console(con)\` (requires \`console_lock()\`/\`console_unlock()\` around the iteration).
- For each console print \`con->name\` and \`con->index\` (e.g. "ttyS" 0).
- Use \`console_lock()\` before and \`console_unlock()\` after.

This explains why your QEMU output appears on \`ttyS0\` when you pass \`console=ttyS0\` on the boot line.`,
    hints: [
      'for_each_console(con) walks struct console entries; con->name and con->index identify it.',
      'Hold console_lock()/console_unlock() while iterating the console list.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/console.h>

static int __init c_init(void)
{
    struct console *con;

    console_lock();
    for_each_console(con)
        pr_info("console %s%d\\n", con->name, con->index);
    console_unlock();
    return 0;
}

static void __exit c_exit(void) { }

module_init(c_init);
module_exit(c_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/console.h>

static int __init c_init(void)
{
    struct console *con;
    // TODO: lock, iterate consoles printing name+index, unlock
    return 0;
}

static void __exit c_exit(void) { }

module_init(c_init);
module_exit(c_exit);
MODULE_LICENSE("GPL");`,
    tags: ['console', 'boot', 'qemu'],
  },
  {
    id: 'lx-ch05-c-067',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'BogoMIPS And HZ Boot Constants',
    prompt: `Write an init function that prints the configured timer tick rate \`HZ\` and the system's loops-per-jiffy calibration, both established during early boot.

Requirements:
- Print \`HZ\` (the compile-time tick frequency macro).
- Print \`loops_per_jiffy\` (the \`extern unsigned long loops_per_jiffy;\` calibrated at boot).
- Compute approximate BogoMIPS: \`(loops_per_jiffy * HZ / 500000)\` for the integer part and \`(loops_per_jiffy * HZ / 5000) % 100\` for the fraction, then print "BogoMIPS approx N.NN".

These values are printed in the early boot log; reproducing them ties config (HZ) to runtime calibration.`,
    hints: [
      'HZ is a compile-time constant set by CONFIG_HZ.',
      'loops_per_jiffy is calibrated during boot (the BogoMIPS line in dmesg).',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/jiffies.h>

extern unsigned long loops_per_jiffy;

static int __init bm_init(void)
{
    unsigned long ip = loops_per_jiffy * HZ / 500000;
    unsigned long fp = (loops_per_jiffy * HZ / 5000) % 100;

    pr_info("HZ=%d loops_per_jiffy=%lu\\n", HZ, loops_per_jiffy);
    pr_info("BogoMIPS approx %lu.%02lu\\n", ip, fp);
    return 0;
}

static void __exit bm_exit(void) { }

module_init(bm_init);
module_exit(bm_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/jiffies.h>

extern unsigned long loops_per_jiffy;

static int __init bm_init(void)
{
    // TODO: print HZ and loops_per_jiffy, then approximate BogoMIPS
    return 0;
}

static void __exit bm_exit(void) { }

module_init(bm_init);
module_exit(bm_exit);
MODULE_LICENSE("GPL");`,
    tags: ['boot', 'timing', 'dmesg'],
  },
  {
    id: 'lx-ch05-c-068',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Builtin Initramfs Hook In Init',
    prompt: `Write an init function that checks whether the kernel mounted a usable root and reports if it is still on the initramfs (rootfs) versus a real root filesystem.

Requirements:
- Use \`init_task\`-independent check: read the current root by comparing against the rootfs magic via \`current->fs\` is too deep; instead, simply test \`if (initrd_start)\` (the \`extern unsigned long initrd_start;\`) to report whether an external initrd image was supplied.
- Print "external initrd present" when \`initrd_start\` is non-zero, else "no external initrd (builtin initramfs or none)".
- Return 0.

This distinguishes an external \`-initrd file.cpio\` (QEMU) from a built-in \`CONFIG_INITRAMFS_SOURCE\`.`,
    hints: [
      'initrd_start/initrd_end (extern unsigned long) are set when an external initrd is loaded.',
      'A built-in initramfs (CONFIG_INITRAMFS_SOURCE) leaves initrd_start zero.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/initrd.h>

static int __init ir_init(void)
{
    if (initrd_start)
        pr_info("external initrd present\\n");
    else
        pr_info("no external initrd (builtin initramfs or none)\\n");
    return 0;
}

static void __exit ir_exit(void) { }

module_init(ir_init);
module_exit(ir_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/initrd.h>

static int __init ir_init(void)
{
    // TODO: report whether an external initrd was supplied (initrd_start)
    return 0;
}

static void __exit ir_exit(void) { }

module_init(ir_init);
module_exit(ir_exit);
MODULE_LICENSE("GPL");`,
    tags: ['initramfs', 'boot', 'initrd'],
  },
  {
    id: 'lx-ch05-c-069',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Subsystem Init With initcall Return Semantics',
    prompt: `Write a builtin subsystem registered as a \`subsys_initcall\` that can request the kernel retry it later by returning \`-EPROBE_DEFER\` when a dependency is not yet ready.

Requirements:
- \`static int __init sub_init(void)\`: check a static flag \`dep_ready\` (assume \`extern bool dep_ready;\`).
- If \`!dep_ready\`, \`pr_info("deferring\\n")\` and return \`-EPROBE_DEFER\`.
- Else \`pr_info("subsys up\\n")\` and return 0.
- Register with \`subsys_initcall(sub_init)\`.
- In a comment, note that \`-EPROBE_DEFER\` is the standard "try again later" signal used by the driver core.`,
    hints: [
      'subsys_initcall runs at the subsystem initcall level, before device initcalls.',
      '-EPROBE_DEFER tells the driver core to retry initialization later.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/errno.h>

extern bool dep_ready;

static int __init sub_init(void)
{
    if (!dep_ready) {
        pr_info("deferring\\n");
        return -EPROBE_DEFER; /* driver core retries later */
    }
    pr_info("subsys up\\n");
    return 0;
}
subsys_initcall(sub_init);

MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/errno.h>

extern bool dep_ready;

static int __init sub_init(void)
{
    // TODO: defer with -EPROBE_DEFER if dep not ready, else come up
    return 0;
}
// TODO: register at subsys_initcall level

MODULE_LICENSE("GPL");`,
    tags: ['boot', 'initcall', 'defer'],
  },
  {
    id: 'lx-ch05-c-070',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Rate-Limited Boot Diagnostics',
    prompt: `Write an init helper that may be called many times during boot but must not flood the kernel log; emit at most a few messages per interval using the standard rate limiter.

Requirements:
- Define a static rate-limit state with \`DEFINE_RATELIMIT_STATE(rs, 5 * HZ, 3)\` (3 bursts per 5 seconds).
- Provide \`void boot_note(int code)\` that calls \`__ratelimit(&rs)\`; only when it returns nonzero does it \`pr_warn("boot_note: code=%d\\n", code)\`.
- Call \`boot_note\` a few times from the init function to demonstrate.

This is the correct way to log a repeated boot-time condition without spamming dmesg.`,
    hints: [
      'DEFINE_RATELIMIT_STATE(name, interval, burst) sets up the limiter state.',
      '__ratelimit(&rs) returns nonzero when you are allowed to emit; suppress otherwise.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/ratelimit.h>

static DEFINE_RATELIMIT_STATE(rs, 5 * HZ, 3);

static void boot_note(int code)
{
    if (__ratelimit(&rs))
        pr_warn("boot_note: code=%d\\n", code);
}

static int __init rl_init(void)
{
    int i;
    for (i = 0; i < 10; i++)
        boot_note(i);
    return 0;
}

static void __exit rl_exit(void) { }

module_init(rl_init);
module_exit(rl_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/ratelimit.h>

// TODO: DEFINE_RATELIMIT_STATE(rs, 5 * HZ, 3)

static void boot_note(int code)
{
    // TODO: only pr_warn when __ratelimit(&rs) allows it
}

static int __init rl_init(void)
{
    // TODO: call boot_note several times
    return 0;
}

static void __exit rl_exit(void) { }

module_init(rl_init);
module_exit(rl_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'dmesg', 'ratelimit'],
  },
]

export default problems
