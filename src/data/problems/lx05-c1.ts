import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch05-c-001',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Minimal Loadable Module',
    prompt: `Write the smallest complete loadable kernel module. It must define an init function that returns 0 and an empty exit function, register them with module_init and module_exit, and set MODULE_LICENSE("GPL"). Use pr_info in init to print "hello: loaded\\n".`,
    hints: [
      'Include linux/module.h and linux/kernel.h.',
      'An init function returns int (0 on success); exit returns void.',
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
}

module_init(hello_init);
module_exit(hello_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init hello_init(void)
{
    // TODO: print "hello: loaded" and return 0
}

static void __exit hello_exit(void)
{
}

// TODO: register init and exit, set the license`,
    tags: ['module', 'init', 'basics'],
  },
  {
    id: 'lx-ch05-c-002',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A One-Line Module Makefile',
    prompt: `Write a Kbuild Makefile that builds a single module from hello.c into hello.ko. The module must be added to obj-m. Use the standard out-of-tree pattern that invokes the kernel build system via -C \\$(KERNEL_SRC) M=\\$(PWD) modules. Define a "default" target that builds and a "clean" target that cleans.`,
    hints: [
      'obj-m += hello.o tells Kbuild to build hello.ko.',
      'KERNEL_SRC usually points at /lib/modules/$(shell uname -r)/build.',
    ],
    solution: `obj-m += hello.o

KERNEL_SRC ?= /lib/modules/$(shell uname -r)/build

default:
	$(MAKE) -C $(KERNEL_SRC) M=$(PWD) modules

clean:
	$(MAKE) -C $(KERNEL_SRC) M=$(PWD) clean`,
    starter: `# TODO: add hello.o to obj-m

KERNEL_SRC ?= /lib/modules/$(shell uname -r)/build

default:
	# TODO: invoke the kernel build system to build modules

clean:
	# TODO: invoke the kernel build system to clean`,
    tags: ['kbuild', 'makefile', 'module'],
  },
  {
    id: 'lx-ch05-c-003',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print the Kernel Command Line',
    prompt: `Write a module init function that prints the kernel command line at load time. The kernel exposes it in the global string saved_command_line. Print it with pr_info using the format "cmdline: %s\\n". Return 0.`,
    hints: [
      'saved_command_line is an extern char * declared in linux/init.h.',
      'It holds the full boot command line passed by the bootloader/QEMU.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init cl_init(void)
{
    pr_info("cmdline: %s\\n", saved_command_line);
    return 0;
}

static void __exit cl_exit(void) {}

module_init(cl_init);
module_exit(cl_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init cl_init(void)
{
    // TODO: print saved_command_line
    return 0;
}

static void __exit cl_exit(void) {}

module_init(cl_init);
module_exit(cl_exit);
MODULE_LICENSE("GPL");`,
    tags: ['cmdline', 'boot', 'module'],
  },
  {
    id: 'lx-ch05-c-004',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Use pr_info, pr_warn, pr_err',
    prompt: `Write an init function that emits three messages at three different log levels: an informational "stage: probing\\n" with pr_info, a warning "stage: degraded mode\\n" with pr_warn, and an error "stage: probe failed\\n" with pr_err. These map to the KERN_INFO, KERN_WARNING, and KERN_ERR levels you would see in dmesg. Return 0.`,
    hints: [
      'pr_info, pr_warn, and pr_err are convenience wrappers over printk.',
      'Each adds its KERN_<level> prefix automatically.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init lvl_init(void)
{
    pr_info("stage: probing\\n");
    pr_warn("stage: degraded mode\\n");
    pr_err("stage: probe failed\\n");
    return 0;
}

static void __exit lvl_exit(void) {}

module_init(lvl_init);
module_exit(lvl_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init lvl_init(void)
{
    // TODO: emit one pr_info, one pr_warn, one pr_err
    return 0;
}

static void __exit lvl_exit(void) {}

module_init(lvl_init);
module_exit(lvl_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'dmesg', 'loglevel'],
  },
  {
    id: 'lx-ch05-c-005',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Module Metadata Macros',
    prompt: `Add the standard metadata macros to a module: license "GPL", author "Jane Dev", description "demo build module", and version "1.0". Use MODULE_LICENSE, MODULE_AUTHOR, MODULE_DESCRIPTION, and MODULE_VERSION. Keep the existing empty init/exit.`,
    hints: [
      'These macros take string literals.',
      'MODULE_LICENSE("GPL") avoids tainting the kernel.',
    ],
    solution: `#include <linux/module.h>
#include <linux/init.h>

static int __init meta_init(void) { return 0; }
static void __exit meta_exit(void) {}

module_init(meta_init);
module_exit(meta_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Jane Dev");
MODULE_DESCRIPTION("demo build module");
MODULE_VERSION("1.0");`,
    starter: `#include <linux/module.h>
#include <linux/init.h>

static int __init meta_init(void) { return 0; }
static void __exit meta_exit(void) {}

module_init(meta_init);
module_exit(meta_exit);

// TODO: add license, author, description, version macros`,
    tags: ['module', 'metadata', 'license'],
  },
  {
    id: 'lx-ch05-c-006',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print the Kernel Version String',
    prompt: `Write an init function that prints the running kernel's version banner. The kernel exposes the full banner as the global string linux_banner (declared in linux/utsname.h via linux/version.h usage is also common, but linux_banner is in linux/init.h-adjacent headers; use the extern). Print it with pr_info using "%s" (linux_banner already ends with a newline). Return 0.`,
    hints: [
      'extern const char linux_banner[]; holds the "Linux version ..." string.',
      'linux_banner already contains a trailing newline, so do not add another.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern const char linux_banner[];

static int __init ver_init(void)
{
    pr_info("%s", linux_banner);
    return 0;
}

static void __exit ver_exit(void) {}

module_init(ver_init);
module_exit(ver_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern const char linux_banner[];

static int __init ver_init(void)
{
    // TODO: print linux_banner with %s (no extra newline)
    return 0;
}

static void __exit ver_exit(void) {}

module_init(ver_init);
module_exit(ver_exit);
MODULE_LICENSE("GPL");`,
    tags: ['version', 'banner', 'boot'],
  },
  {
    id: 'lx-ch05-c-007',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Two-Object Module',
    prompt: `You are building one module mymod.ko from two source files: main.c and helper.c. Write the Kbuild line(s) that tell the build system to link both objects into a single module named mymod. Use the obj-m and mymod-objs (a.k.a. mymod-y) convention.`,
    hints: [
      'obj-m += mymod.o names the final module.',
      'mymod-objs lists the object files that compose it.',
    ],
    solution: `obj-m += mymod.o
mymod-objs := main.o helper.o`,
    starter: `# TODO: build mymod.ko from main.o and helper.o
obj-m += mymod.o
# TODO: list the component objects`,
    tags: ['kbuild', 'makefile', 'module'],
  },
  {
    id: 'lx-ch05-c-008',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Init Returns -ENODEV on Failure',
    prompt: `Write an init function that simulates a missing device. If a (given) global int device_present is zero, print pr_err "no device\\n" and return -ENODEV so the module load fails cleanly. Otherwise print "device ready\\n" and return 0.`,
    hints: [
      'Returning a negative errno from init aborts module loading.',
      'ENODEV comes from linux/errno.h; return its negation.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/errno.h>

static int device_present;

static int __init dev_init(void)
{
    if (!device_present) {
        pr_err("no device\\n");
        return -ENODEV;
    }
    pr_info("device ready\\n");
    return 0;
}

static void __exit dev_exit(void) {}

module_init(dev_init);
module_exit(dev_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/errno.h>

static int device_present;

static int __init dev_init(void)
{
    // TODO: on no device, pr_err and return -ENODEV; else pr_info and return 0
}

static void __exit dev_exit(void) {}

module_init(dev_init);
module_exit(dev_exit);
MODULE_LICENSE("GPL");`,
    tags: ['init', 'errno', 'module'],
  },
  {
    id: 'lx-ch05-c-009',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Kconfig Entry',
    prompt: `Write a Kconfig stanza for a new feature. Add a config symbol MYDRIVER_FOO that is a "tristate" (so it can be y, m, or n), with the prompt "Foo accelerator support", that depends on MYDRIVER, defaults to m, and has a one-line help text "Enable the Foo accelerator. If unsure, say N.".`,
    hints: [
      'tristate symbols allow built-in (y), module (m), or off (n).',
      'help text is indented under a help keyword.',
    ],
    solution: `config MYDRIVER_FOO
	tristate "Foo accelerator support"
	depends on MYDRIVER
	default m
	help
	  Enable the Foo accelerator. If unsure, say N.`,
    starter: `config MYDRIVER_FOO
	# TODO: tristate prompt, depends on MYDRIVER, default m, and help text
`,
    tags: ['kconfig', 'config', 'tristate'],
  },
  {
    id: 'lx-ch05-c-010',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Conditional Build With a Config Symbol',
    prompt: `In a Kbuild Makefile, build feature.o into the kernel/module ONLY when the config option CONFIG_MYDRIVER_FOO is enabled (as y or m). Write the obj-\\$(CONFIG_MYDRIVER_FOO) line that does this.`,
    hints: [
      'obj-$(CONFIG_X) expands to obj-y, obj-m, or obj- depending on the symbol.',
      'This is how Kconfig choices drive what gets compiled.',
    ],
    solution: `obj-$(CONFIG_MYDRIVER_FOO) += feature.o`,
    starter: `# TODO: compile feature.o only when CONFIG_MYDRIVER_FOO is set
`,
    tags: ['kbuild', 'kconfig', 'makefile'],
  },
  {
    id: 'lx-ch05-c-011',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Guard Code With #ifdef CONFIG',
    prompt: `Write a function probe(void) that returns 0 normally, but when the kernel was built with CONFIG_MYDRIVER_DEBUG enabled, it should first pr_info "probe: debug build\\n". Use the IS_ENABLED(CONFIG_MYDRIVER_DEBUG) macro inside a plain if (preferred over #ifdef for type-checking the body).`,
    hints: [
      'IS_ENABLED(CONFIG_X) is true when X is y or m, false otherwise.',
      'Using IS_ENABLED in a normal if keeps the guarded code compiled and checked.',
    ],
    solution: `#include <linux/kernel.h>
#include <linux/kconfig.h>

static int probe(void)
{
    if (IS_ENABLED(CONFIG_MYDRIVER_DEBUG))
        pr_info("probe: debug build\\n");
    return 0;
}`,
    starter: `#include <linux/kernel.h>
#include <linux/kconfig.h>

static int probe(void)
{
    // TODO: if CONFIG_MYDRIVER_DEBUG is enabled, pr_info the debug line
    return 0;
}`,
    tags: ['kconfig', 'is_enabled', 'config'],
  },
  {
    id: 'lx-ch05-c-012',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Init Order Message',
    prompt: `Write a module with init and exit that prints "mod: init\\n" when loaded and "mod: exit\\n" when unloaded, so you can watch the lifecycle in dmesg. Both functions use pr_info. Init returns 0.`,
    hints: [
      'module_init runs at insmod time; module_exit at rmmod time.',
      'Both messages show up in the kernel log buffer (dmesg).',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init lc_init(void)
{
    pr_info("mod: init\\n");
    return 0;
}

static void __exit lc_exit(void)
{
    pr_info("mod: exit\\n");
}

module_init(lc_init);
module_exit(lc_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init lc_init(void)
{
    // TODO: print "mod: init" and return 0
}

static void __exit lc_exit(void)
{
    // TODO: print "mod: exit"
}

module_init(lc_init);
module_exit(lc_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'lifecycle', 'dmesg'],
  },
  {
    id: 'lx-ch05-c-013',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Module Parameter for the Command Line',
    prompt: `Add an integer module parameter named "count" to a module, with a default value of 1, readable mode 0444 in sysfs. Use module_param and MODULE_PARM_DESC with the description "number of widgets". Print its value in init as "count=%d\\n". Loading with insmod mymod.ko count=5 (or boot param mymod.count=5) must override the default.`,
    hints: [
      'module_param(name, type, perm) declares a parameter.',
      'The variable must exist before module_param references it.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int count = 1;
module_param(count, int, 0444);
MODULE_PARM_DESC(count, "number of widgets");

static int __init p_init(void)
{
    pr_info("count=%d\\n", count);
    return 0;
}

static void __exit p_exit(void) {}

module_init(p_init);
module_exit(p_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int count = 1;
// TODO: declare module_param(count, ...) with mode 0444 and a description

static int __init p_init(void)
{
    // TODO: print count
    return 0;
}

static void __exit p_exit(void) {}

module_init(p_init);
module_exit(p_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'param', 'cmdline'],
  },
  {
    id: 'lx-ch05-c-014',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'String Module Parameter',
    prompt: `Add a charp (string) module parameter named "mode" defaulting to "fast", with sysfs permission 0644 so it can be changed at runtime. Add a description "operating mode". In init, print "mode=%s\\n". This is the kind of parameter you would pass as mymod.mode=slow on the kernel command line.`,
    hints: [
      'Use type charp for a char * string parameter.',
      'The default string literal can be assigned directly to the variable.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static char *mode = "fast";
module_param(mode, charp, 0644);
MODULE_PARM_DESC(mode, "operating mode");

static int __init m_init(void)
{
    pr_info("mode=%s\\n", mode);
    return 0;
}

static void __exit m_exit(void) {}

module_init(m_init);
module_exit(m_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static char *mode = "fast";
// TODO: module_param mode as charp, mode 0644, with a description

static int __init m_init(void)
{
    // TODO: print mode
    return 0;
}

static void __exit m_exit(void) {}

module_init(m_init);
module_exit(m_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'param', 'string'],
  },
  {
    id: 'lx-ch05-c-015',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Boolean Parameter Toggles Verbosity',
    prompt: `Add a bool module parameter "verbose" defaulting to false (perm 0644, desc "extra logging"). In init, always pr_info "init done\\n", but only when verbose is true also pr_info "verbose: details enabled\\n". Return 0.`,
    hints: [
      'Use type bool; the C variable is declared bool.',
      'A bool param accepts 1/0, Y/N, or on/off on the command line.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>
#include <linux/types.h>

static bool verbose;
module_param(verbose, bool, 0644);
MODULE_PARM_DESC(verbose, "extra logging");

static int __init v_init(void)
{
    pr_info("init done\\n");
    if (verbose)
        pr_info("verbose: details enabled\\n");
    return 0;
}

static void __exit v_exit(void) {}

module_init(v_init);
module_exit(v_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>
#include <linux/types.h>

static bool verbose;
// TODO: module_param verbose as bool, 0644, with a description

static int __init v_init(void)
{
    // TODO: always print init done; if verbose, print the extra line
    return 0;
}

static void __exit v_exit(void) {}

module_init(v_init);
module_exit(v_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'param', 'bool'],
  },
  {
    id: 'lx-ch05-c-016',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Module-Scope Param Prefix',
    prompt: `On the kernel command line, a built-in module's parameters are namespaced by a prefix. Set the parameter prefix for this file to "widget." by defining MODULE_PARAM_PREFIX before including the param machinery, then declare an int param "size" (perm 0444). Explain via the code that the boot parameter would then be widget.size=N. Print size in init.`,
    hints: [
      'Define MODULE_PARAM_PREFIX "widget." before module_param is used.',
      'For modules the prefix normally defaults to the module name plus a dot.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

#define MODULE_PARAM_PREFIX "widget."
#include <linux/moduleparam.h>

static int size;
module_param(size, int, 0444);
MODULE_PARM_DESC(size, "widget size; boot param is widget.size=N");

static int __init s_init(void)
{
    pr_info("size=%d\\n", size);
    return 0;
}

static void __exit s_exit(void) {}

module_init(s_init);
module_exit(s_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: define MODULE_PARAM_PREFIX as "widget." here
#include <linux/moduleparam.h>

static int size;
// TODO: declare module_param size as int, perm 0444

static int __init s_init(void)
{
    // TODO: print size
    return 0;
}

static void __exit s_exit(void) {}

module_init(s_init);
module_exit(s_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'param', 'cmdline'],
  },
  {
    id: 'lx-ch05-c-017',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Parse a Custom Boot Option With __setup',
    prompt: `Register an early boot command-line handler for the token "myfeature=" using the __setup() mechanism (this only works for code built into the kernel). Write a parser int myfeature_setup(char *str) that does kstrtoint(str, 0, &myfeature_level), prints "myfeature level=%d\\n", and returns 1 to mark the option handled. Wire it up with __setup("myfeature=", myfeature_setup).`,
    hints: [
      '__setup("token=", fn) makes fn handle that early boot parameter.',
      'A __setup handler returns 1 if it consumed the option, 0 otherwise.',
    ],
    solution: `#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/kstrtox.h>

static int myfeature_level;

static int __init myfeature_setup(char *str)
{
    if (kstrtoint(str, 0, &myfeature_level))
        return 0;
    pr_info("myfeature level=%d\\n", myfeature_level);
    return 1;
}
__setup("myfeature=", myfeature_setup);`,
    starter: `#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/kstrtox.h>

static int myfeature_level;

static int __init myfeature_setup(char *str)
{
    // TODO: parse str into myfeature_level, print it, return 1
}
// TODO: register with __setup for token "myfeature="`,
    tags: ['cmdline', 'setup', 'boot'],
  },
  {
    id: 'lx-ch05-c-018',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'core_param for a Built-In Tunable',
    prompt: `Expose a built-in (non-modular) kernel tunable on the command line without a module-name prefix using core_param(). Declare a static int "verbose_boot" defaulting to 0 and expose it as core_param(verbose_boot, verbose_boot, int, 0644). Then the boot option is simply verbose_boot=1 (no prefix). Add an init-time pr_info "verbose_boot=%d\\n".`,
    hints: [
      'core_param(name, var, type, perm) creates an unprefixed kernel parameter.',
      'It is meant for core kernel code compiled in, not loadable modules.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int verbose_boot;
core_param(verbose_boot, verbose_boot, int, 0644);

static int __init vb_init(void)
{
    pr_info("verbose_boot=%d\\n", verbose_boot);
    return 0;
}

module_init(vb_init);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int verbose_boot;
// TODO: expose verbose_boot via core_param, type int, perm 0644

static int __init vb_init(void)
{
    // TODO: print verbose_boot
    return 0;
}

module_init(vb_init);
MODULE_LICENSE("GPL");`,
    tags: ['cmdline', 'param', 'boot'],
  },
  {
    id: 'lx-ch05-c-019',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Search the Command Line for a Flag',
    prompt: `Write int has_nosmp(void) that returns 1 if the boot command line contains the token "nosmp" and 0 otherwise. Read the command line from saved_command_line and use strstr to find it. (For this exercise a simple substring match is acceptable.)`,
    hints: [
      'saved_command_line is the full extern command-line string.',
      'strstr returns NULL when the substring is not present.',
    ],
    solution: `#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/string.h>

int has_nosmp(void)
{
    return strstr(saved_command_line, "nosmp") != NULL;
}`,
    starter: `#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/string.h>

int has_nosmp(void)
{
    // TODO: return 1 if "nosmp" is in saved_command_line, else 0
}`,
    tags: ['cmdline', 'string', 'boot'],
  },
  {
    id: 'lx-ch05-c-020',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print a Boot Timestamp Banner',
    prompt: `Write an init function that records the boot-relative time of load. Print "loaded at %llu ns\\n" using ktime_get_boottime_ns() (returns u64 nanoseconds since boot, suitable for correlating with dmesg timestamps). Return 0.`,
    hints: [
      'ktime_get_boottime_ns() returns a u64 of nanoseconds since boot.',
      'Use the %llu format specifier for u64.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/timekeeping.h>

static int __init ts_init(void)
{
    u64 t = ktime_get_boottime_ns();

    pr_info("loaded at %llu ns\\n", t);
    return 0;
}

static void __exit ts_exit(void) {}

module_init(ts_init);
module_exit(ts_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/timekeeping.h>

static int __init ts_init(void)
{
    // TODO: read boottime ns and print it with %llu
    return 0;
}

static void __exit ts_exit(void) {}

module_init(ts_init);
module_exit(ts_exit);
MODULE_LICENSE("GPL");`,
    tags: ['boot', 'dmesg', 'time'],
  },
  {
    id: 'lx-ch05-c-021',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Rate-Limited Boot Log Message',
    prompt: `In a function that may be called many times during early boot, log "device busy, retrying\\n" but avoid flooding dmesg. Use pr_info_ratelimited so repeated messages within the rate window are suppressed. Write void note_busy(void) that calls it.`,
    hints: [
      'pr_info_ratelimited limits how often the same message prints.',
      'It is a drop-in replacement for pr_info that takes the same format args.',
    ],
    solution: `#include <linux/kernel.h>
#include <linux/printk.h>

void note_busy(void)
{
    pr_info_ratelimited("device busy, retrying\\n");
}`,
    starter: `#include <linux/kernel.h>
#include <linux/printk.h>

void note_busy(void)
{
    // TODO: log a rate-limited info message
}`,
    tags: ['printk', 'dmesg', 'ratelimit'],
  },
  {
    id: 'lx-ch05-c-022',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print With the Module Name Prefix',
    prompt: `Make every pr_info from this module automatically prefixed with "mydrv: " in dmesg. Do this the idiomatic way by defining pr_fmt before including the kernel headers, then use plain pr_info("started\\n") in init and observe it appear as "mydrv: started".`,
    hints: [
      'Define pr_fmt(fmt) to prepend a prefix to fmt before including linux/printk.h.',
      'The common idiom is #define pr_fmt(fmt) KBUILD_MODNAME ": " fmt or a literal prefix.',
    ],
    solution: `#define pr_fmt(fmt) "mydrv: " fmt

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init d_init(void)
{
    pr_info("started\\n");
    return 0;
}

static void __exit d_exit(void) {}

module_init(d_init);
module_exit(d_exit);
MODULE_LICENSE("GPL");`,
    starter: `// TODO: define pr_fmt to prepend "mydrv: " before any kernel header

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init d_init(void)
{
    pr_info("started\\n");
    return 0;
}

static void __exit d_exit(void) {}

module_init(d_init);
module_exit(d_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'pr_fmt', 'dmesg'],
  },
  {
    id: 'lx-ch05-c-023',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Kconfig Choice Block',
    prompt: `Write a Kconfig "choice" that forces selecting exactly one of two console options. The choice prompt is "Default console", it defaults to CONSOLE_SERIAL, and offers two bool symbols: CONSOLE_SERIAL ("Serial console") and CONSOLE_VGA ("VGA console"). End with endchoice.`,
    hints: [
      'A choice block lets the user pick exactly one of its member configs.',
      'Member configs inside a choice are usually bool.',
    ],
    solution: `choice
	prompt "Default console"
	default CONSOLE_SERIAL

config CONSOLE_SERIAL
	bool "Serial console"

config CONSOLE_VGA
	bool "VGA console"

endchoice`,
    starter: `choice
	prompt "Default console"
	# TODO: default to CONSOLE_SERIAL

# TODO: two bool member configs: CONSOLE_SERIAL and CONSOLE_VGA

endchoice`,
    tags: ['kconfig', 'choice', 'config'],
  },
  {
    id: 'lx-ch05-c-024',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Kconfig Symbol With select',
    prompt: `Write a Kconfig stanza for config MYDRIVER (tristate, prompt "My driver") that, when enabled, automatically turns on the helper library config LIBCRC32 via select, and depends on the bus config CONFIG-style symbol PCI. Include a short help line "Driver for the My hardware.".`,
    hints: [
      'select FOO force-enables FOO when this symbol is enabled.',
      'depends on PCI hides this symbol unless PCI is available.',
    ],
    solution: `config MYDRIVER
	tristate "My driver"
	depends on PCI
	select LIBCRC32
	help
	  Driver for the My hardware.`,
    starter: `config MYDRIVER
	tristate "My driver"
	# TODO: depends on PCI, select LIBCRC32, add help text
`,
    tags: ['kconfig', 'select', 'depends'],
  },
  {
    id: 'lx-ch05-c-025',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Add Extra Compiler Flags in Kbuild',
    prompt: `In a Kbuild Makefile, build mymod.ko from mymod.c but add a preprocessor define -DDEBUG_LEVEL=2 and the include path -I\\$(src)/include only for the objects in this directory. Use the ccflags-y variable, then add the obj-m line.`,
    hints: [
      'ccflags-y adds flags to the C compiler for this Kbuild file.',
      '$(src) is the source directory of the current Kbuild file.',
    ],
    solution: `ccflags-y := -DDEBUG_LEVEL=2 -I$(src)/include

obj-m += mymod.o`,
    starter: `# TODO: set ccflags-y with -DDEBUG_LEVEL=2 and -I$(src)/include

obj-m += mymod.o`,
    tags: ['kbuild', 'makefile', 'ccflags'],
  },
  {
    id: 'lx-ch05-c-026',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate a Param With a kernel_param_ops set Callback',
    prompt: `Reject out-of-range values for an int parameter "level" (range 0..3). Implement a custom set callback level_set(const char *val, const struct kernel_param *kp) that uses kstrtoint, returns -EINVAL if out of range, otherwise stores the value via *(int *)kp->arg. Provide a kernel_param_ops with .set = level_set and .get = param_get_int, and register with module_param_cb("level", &level_ops, &level, 0644).`,
    hints: [
      'A set callback returns 0 on success or a negative errno.',
      'param_get_int is the standard getter you can reuse for .get.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/moduleparam.h>
#include <linux/kstrtox.h>
#include <linux/errno.h>

static int level;

static int level_set(const char *val, const struct kernel_param *kp)
{
    int n, ret;

    ret = kstrtoint(val, 0, &n);
    if (ret)
        return ret;
    if (n < 0 || n > 3)
        return -EINVAL;
    *(int *)kp->arg = n;
    return 0;
}

static const struct kernel_param_ops level_ops = {
    .set = level_set,
    .get = param_get_int,
};

module_param_cb(level, &level_ops, &level, 0644);
MODULE_PARM_DESC(level, "verbosity level 0..3");
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/moduleparam.h>
#include <linux/kstrtox.h>
#include <linux/errno.h>

static int level;

static int level_set(const char *val, const struct kernel_param *kp)
{
    // TODO: parse val, reject out of 0..3 with -EINVAL, else store via kp->arg
}

// TODO: define level_ops with .set and .get = param_get_int
// TODO: register with module_param_cb("level", ...)

MODULE_PARM_DESC(level, "verbosity level 0..3");
MODULE_LICENSE("GPL");`,
    tags: ['module', 'param', 'callback'],
  },
  {
    id: 'lx-ch05-c-027',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Detect an initramfs at Boot',
    prompt: `The kernel records whether an external initramfs/initrd image was supplied by the bootloader in the globals initrd_start and initrd_end (when CONFIG_BLK_DEV_INITRD is set). Write int have_initrd(void) that returns 1 if initrd_start is non-zero and initrd_end is greater than initrd_start, else 0. Guard the body with IS_ENABLED(CONFIG_BLK_DEV_INITRD); when not enabled, return 0.`,
    hints: [
      'initrd_start and initrd_end are unsigned long globals from linux/initrd.h.',
      'A valid image has initrd_end > initrd_start and initrd_start != 0.',
    ],
    solution: `#include <linux/kernel.h>
#include <linux/initrd.h>
#include <linux/kconfig.h>

int have_initrd(void)
{
    if (!IS_ENABLED(CONFIG_BLK_DEV_INITRD))
        return 0;
    return initrd_start && initrd_end > initrd_start;
}`,
    starter: `#include <linux/kernel.h>
#include <linux/initrd.h>
#include <linux/kconfig.h>

int have_initrd(void)
{
    // TODO: if CONFIG_BLK_DEV_INITRD is off, return 0
    // TODO: return 1 when initrd_start set and initrd_end > initrd_start
}`,
    tags: ['initramfs', 'boot', 'kconfig'],
  },
  {
    id: 'lx-ch05-c-028',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'late_initcall Ordering',
    prompt: `You want a built-in routine to run late in the boot init sequence (after most subsystems are up) rather than at module load. Write a function check_late(void) returning int that pr_info("late: all subsystems up\\n") and returns 0, and register it to run as a late_initcall.`,
    hints: [
      'late_initcall(fn) schedules fn in the late init level during boot.',
      'The function signature matches a normal initcall: int fn(void).',
    ],
    solution: `#include <linux/kernel.h>
#include <linux/init.h>

static int __init check_late(void)
{
    pr_info("late: all subsystems up\\n");
    return 0;
}
late_initcall(check_late);`,
    starter: `#include <linux/kernel.h>
#include <linux/init.h>

static int __init check_late(void)
{
    // TODO: pr_info the message and return 0
}
// TODO: register check_late as a late_initcall`,
    tags: ['boot', 'initcall', 'init'],
  },
  {
    id: 'lx-ch05-c-029',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mark Init Code With __init and Data With __initdata',
    prompt: `Memory used only during boot/initialization can be freed afterward. Write a setup table: a static const int array primes[] = {2,3,5,7} marked __initdata, and an init function sum_primes(void) marked __init that pr_info("prime sum=%d\\n", sum) of the array and returns 0. Wire it with module_init.`,
    hints: [
      '__init places a function in a section freed after boot.',
      '__initdata does the same for data used only during init.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static const int primes[] __initdata = { 2, 3, 5, 7 };

static int __init sum_primes(void)
{
    int i, sum = 0;

    for (i = 0; i < ARRAY_SIZE(primes); i++)
        sum += primes[i];
    pr_info("prime sum=%d\\n", sum);
    return 0;
}

module_init(sum_primes);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: const int primes[] marked __initdata = {2,3,5,7}

static int __init sum_primes(void)
{
    // TODO: sum the array and pr_info "prime sum=%d"
    return 0;
}

module_init(sum_primes);
MODULE_LICENSE("GPL");`,
    tags: ['init', 'initdata', 'boot'],
  },
  {
    id: 'lx-ch05-c-030',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Hex-Dump the Start of the Command Line',
    prompt: `For debugging early boot, dump the first 16 bytes of saved_command_line in dmesg. Use print_hex_dump_bytes with a prefix "cmd: ", the DUMP_PREFIX_OFFSET style, and a length of 16. Write void dump_cmdline(void) doing this.`,
    hints: [
      'print_hex_dump_bytes(prefix, prefix_type, buf, len) is the simple hex dumper.',
      'Pass DUMP_PREFIX_OFFSET so each line shows a byte offset.',
    ],
    solution: `#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/printk.h>
#include <linux/string.h>

void dump_cmdline(void)
{
    print_hex_dump_bytes("cmd: ", DUMP_PREFIX_OFFSET,
                         saved_command_line, 16);
}`,
    starter: `#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/printk.h>
#include <linux/string.h>

void dump_cmdline(void)
{
    // TODO: hex dump first 16 bytes of saved_command_line with prefix "cmd: "
}`,
    tags: ['cmdline', 'dmesg', 'debug'],
  },
  {
    id: 'lx-ch05-c-031',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build a Subdirectory From Kbuild',
    prompt: `Your driver's Kbuild file must descend into a subdirectory named "fw/" to build code there, in addition to building core.o for the module mydrv.ko. Write the obj-m / mydrv-objs lines plus the obj-y line that makes Kbuild recurse into the fw/ subdirectory.`,
    hints: [
      'obj-y += subdir/ (with a trailing slash) tells Kbuild to descend into it.',
      'mydrv-objs lists the objects that form mydrv.ko.',
    ],
    solution: `obj-m += mydrv.o
mydrv-objs := core.o

obj-y += fw/`,
    starter: `obj-m += mydrv.o
mydrv-objs := core.o

# TODO: recurse into the fw/ subdirectory`,
    tags: ['kbuild', 'makefile', 'subdir'],
  },
  {
    id: 'lx-ch05-c-032',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Warn Once on a Bad Config Combination',
    prompt: `In init, if a feature was misconfigured (given bool bad_config is true), emit a one-time warning so it does not spam dmesg on every retry: use pr_warn_once("config: feature disabled due to conflict\\n"). Always return 0. Write the init function.`,
    hints: [
      'pr_warn_once prints only the first time the call site is hit.',
      'It is ideal for boot-time configuration warnings.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/types.h>

static bool bad_config;

static int __init w_init(void)
{
    if (bad_config)
        pr_warn_once("config: feature disabled due to conflict\\n");
    return 0;
}

static void __exit w_exit(void) {}

module_init(w_init);
module_exit(w_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/types.h>

static bool bad_config;

static int __init w_init(void)
{
    // TODO: if bad_config, pr_warn_once the conflict message
    return 0;
}

static void __exit w_exit(void) {}

module_init(w_init);
module_exit(w_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'dmesg', 'config'],
  },
  {
    id: 'lx-ch05-c-033',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read a Tunable From a Module Param Array',
    prompt: `Declare an int array module parameter "ports" of up to 4 elements, where the number actually given on the command line is stored in a separate count variable nr_ports. Use module_param_array(ports, int, &nr_ports, 0444). In init, loop and pr_info "port[%d]=%d\\n" for each of the nr_ports supplied. Return 0.`,
    hints: [
      'module_param_array(name, type, &count, perm) handles comma-separated lists.',
      'After parsing, the count variable holds how many were provided.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int ports[4];
static int nr_ports;
module_param_array(ports, int, &nr_ports, 0444);
MODULE_PARM_DESC(ports, "up to 4 port numbers");

static int __init a_init(void)
{
    int i;

    for (i = 0; i < nr_ports; i++)
        pr_info("port[%d]=%d\\n", i, ports[i]);
    return 0;
}

static void __exit a_exit(void) {}

module_init(a_init);
module_exit(a_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int ports[4];
static int nr_ports;
// TODO: module_param_array(ports, int, &nr_ports, 0444)

static int __init a_init(void)
{
    // TODO: loop nr_ports times and print each port
    return 0;
}

static void __exit a_exit(void) {}

module_init(a_init);
module_exit(a_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'param', 'array'],
  },
  {
    id: 'lx-ch05-c-034',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fail Init Cleanly With Rollback',
    prompt: `Write an init that allocates a buffer with kmalloc(64, GFP_KERNEL), then calls a helper register_thing() that returns an int errno (0 on success). If register_thing fails, kfree the buffer and return the error code so the module load aborts without leaking memory. On success store the pointer in a global and return 0.`,
    hints: [
      'kmalloc returns NULL on failure; check it and return -ENOMEM.',
      'On a later failure, undo earlier work (kfree) before returning the errno.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>
#include <linux/errno.h>

extern int register_thing(void);

static char *buf;

static int __init r_init(void)
{
    int ret;

    buf = kmalloc(64, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;

    ret = register_thing();
    if (ret) {
        kfree(buf);
        buf = NULL;
        return ret;
    }
    return 0;
}

static void __exit r_exit(void)
{
    kfree(buf);
}

module_init(r_init);
module_exit(r_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>
#include <linux/errno.h>

extern int register_thing(void);

static char *buf;

static int __init r_init(void)
{
    // TODO: kmalloc 64 bytes GFP_KERNEL, check NULL
    // TODO: call register_thing; on error kfree and return the errno
    return 0;
}

static void __exit r_exit(void)
{
    kfree(buf);
}

module_init(r_init);
module_exit(r_exit);
MODULE_LICENSE("GPL");`,
    tags: ['init', 'errno', 'cleanup'],
  },
  {
    id: 'lx-ch05-c-035',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pick Behavior From a Built-In Config at Compile Time',
    prompt: `Write a function buffer_size(void) returning an int that yields 4096 when the kernel is built with CONFIG_MYDRIVER_BIGBUF enabled and 512 otherwise. Use a preprocessor #if IS_ENABLED(CONFIG_MYDRIVER_BIGBUF) ... #else ... #endif so the unused branch is not compiled. Also add a build-time guarantee with BUILD_BUG_ON that the chosen size is a power of two is not required; just return the value.`,
    hints: [
      'IS_ENABLED works in #if because it expands to a literal 0 or 1.',
      'Only the taken branch of the #if is compiled into the kernel.',
    ],
    solution: `#include <linux/kconfig.h>

int buffer_size(void)
{
#if IS_ENABLED(CONFIG_MYDRIVER_BIGBUF)
    return 4096;
#else
    return 512;
#endif
}`,
    starter: `#include <linux/kconfig.h>

int buffer_size(void)
{
    // TODO: #if IS_ENABLED(CONFIG_MYDRIVER_BIGBUF) return 4096 else 512
}`,
    tags: ['kconfig', 'is_enabled', 'config'],
  },
]

export default problems
