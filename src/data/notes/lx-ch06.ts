import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-06',
  track: 'linux',
  chapter: 6,
  title: 'Loadable Kernel Modules',
  summary: `A loadable kernel module (LKM) is a piece of kernel code you can insert into and remove from a running kernel without rebooting, which is how nearly all drivers, filesystems, and network protocols ship. This chapter builds the smallest real module, then explains the machinery that makes it work: the init and exit entry points, kernel logging with printk, the licensing and metadata macros the kernel demands, tunable parameters, the out-of-tree Kbuild that compiles against your running kernel, and the user-space tools that load and unload modules. Mastering this is the gateway to kernel contribution: it is where your code first runs in ring 0, where a single mistake can panic the machine, and where disciplined error handling is not optional but survival.`,
  sections: [
    {
      heading: 'What a module is and why the kernel uses them',
      body: `A *loadable kernel module* is object code that the kernel links into itself at runtime. Unlike a user-space program, a module has no main function, runs in kernel address space with full privileges, shares one global namespace with the rest of the kernel, and can crash the entire system if it misbehaves. There is no operating system underneath it to catch a fault - the module *is* part of the operating system.

Why bother with modules instead of compiling everything into one monolithic kernel image?

- **Size and boot speed.** A distribution kernel supports thousands of devices. Building every driver into the core image (vmlinuz) would make it enormous and slow to load. Modules let the base kernel stay small and pull in drivers only when the matching hardware appears.
- **Development speed.** Rebuilding and rebooting the whole kernel to test a one-line driver change is painful. With a module you compile, insert, test, and remove in seconds, leaving the running kernel untouched.
- **Flexibility.** Users and the kernel itself can load support for new hardware, filesystems, or protocols on demand, and unload it to free memory or to swap in a fixed version.

The trade-off is that a module is intimate with kernel internals. It calls kernel functions directly, must match the exact kernel version and configuration it was built against, and is bound by the kernel's coding rules. A module is *not* a sandbox - treat every line as if the machine's stability depends on it, because it does.

> Pitfall: a module built for one kernel version generally will not load into another. The kernel checks a version magic string and refuses mismatches, because internal data structures and function signatures change between releases.`,
      code: [
        {
          lang: 'c',
          src: `/* hello.c - the smallest complete loadable kernel module.
 * Note: no main(). The kernel calls init on load, exit on unload. */

#include <linux/module.h>   /* core macros: module_init/exit, MODULE_* */
#include <linux/kernel.h>   /* printk, KERN_* log levels */
#include <linux/init.h>     /* __init and __exit section markers */

static int __init hello_init(void)
{
    pr_info("hello: module loaded\\n");
    return 0;               /* 0 means success; nonzero aborts the load */
}

static void __exit hello_exit(void)
{
    pr_info("hello: module unloaded\\n");
}

module_init(hello_init);    /* register the load entry point  */
module_exit(hello_exit);    /* register the unload entry point */

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Your Name <you@example.com>");
MODULE_DESCRIPTION("A minimal hello-world kernel module");
MODULE_VERSION("1.0");`
        }
      ]
    },
    {
      heading: 'module_init and module_exit: the entry points',
      body: `A kernel module has two well-defined lifecycle hooks instead of a main function. You register them with two macros.

**module_init** registers the function that runs when the module is loaded (by insmod or modprobe). Think of it as the constructor. Its job is to allocate resources, register the module with whatever kernel subsystem it serves (a character device, a network protocol, a filesystem type), and report whether it succeeded. The init function must return an int: **return 0 for success**, and a **negative errno value** (such as the negated constants for out-of-memory or invalid-argument) for failure. If init returns nonzero, the kernel immediately considers the load failed and the module is not inserted - so anything you allocated before the failure must be cleaned up before you return.

**module_exit** registers the function that runs when the module is unloaded (by rmmod or modprobe -r). Think of it as the destructor. It takes no arguments, returns nothing (void), and must undo *everything* the module did: unregister devices, free memory, stop timers, release IRQs. There is no automatic cleanup - the kernel will not reclaim what you forgot to free, and a module that leaks an IRQ or a device-major number can wedge the kernel until reboot.

Why macros rather than fixed function names? The macros place the function pointers into special ELF sections that the module loader reads, and they also let the build system *omit* the exit hook entirely when a module is compiled directly into the kernel (a built-in module can never be unloaded, so its exit code would be dead weight). Using the macros, not hand-named functions, is what makes one source file work both as a loadable module and as a built-in.

> Pitfall: returning 0 from init while a registration actually failed leaves a half-initialized module in the kernel - a classic source of later crashes. Always propagate the real error code.`,
      code: [
        {
          lang: 'c',
          src: `static int __init my_init(void)
{
    int ret;

    ret = register_something();   /* a typical subsystem registration */
    if (ret) {                    /* nonzero == failure */
        pr_err("my: register_something failed: %d\\n", ret);
        return ret;               /* propagate the negative errno up */
    }

    pr_info("my: initialized\\n");
    return 0;                     /* success */
}

static void __exit my_exit(void)
{
    unregister_something();       /* mirror image of init, reverse order */
    pr_info("my: removed\\n");
}

module_init(my_init);
module_exit(my_exit);

/* Returning, e.g., -ENOMEM or -EINVAL from init is the convention:
 *   -ENOMEM  -> allocation failed
 *   -EINVAL  -> a parameter was out of range
 * The user sees these as insmod errors via errno. */`
        }
      ]
    },
    {
      heading: 'printk, pr_* helpers, and log levels',
      body: `A module cannot call printf - there is no C library and no stdout in the kernel. The kernel's own logging function is **printk**. It writes messages into a ring buffer that you read from user space with the dmesg command, or that the kernel daemon forwards to the system log. printk is the primary debugging tool in kernel work, especially early on before you can attach a debugger.

Every kernel message carries a **log level** that says how urgent it is. The level is encoded as a small prefix on the format string. From most to least severe the levels are: emergency, alert, critical, error, warning, notice, info, and debug. The level matters because the kernel compares it against a *console log level* threshold: messages at or above the threshold are printed to the physical console immediately (which is why a flood of high-level messages can make a machine crawl), while quieter messages only land in the buffer and dmesg. Choosing the right level keeps the console readable and tells other developers how seriously to take each line.

In modern kernel code you almost never write printk with a raw level prefix. Instead use the **pr_ family** of wrapper macros, which are shorter and clearer: helpers for error, warning, notice, info, and debug. There is also a convention of defining a per-file message prefix so every line your module emits is grouped and searchable in dmesg - you define a token before including the headers and the pr_ macros prepend it automatically.

Two important refinements:

- **pr_debug** is special: it compiles to nothing unless the module is built with debugging enabled, or it can be switched on at runtime through the kernel's dynamic-debug facility. This lets you scatter verbose tracing through your code at zero cost in production builds.
- For messages about a specific device, the kernel prefers the **dev_ family** (device-aware versions of the same levels) because they automatically include the driver and device name, which is far more useful than a bare string when many devices are present.

> Pitfall: printk does not implicitly add a newline, and it buffers partial lines. Always end your messages with a newline character or you may see fragments merge together in dmesg. Also note that printk format specifiers differ slightly from user space - kernel pointers, for instance, use a dedicated specifier so they can be hashed for security rather than leaking real addresses.`,
      code: [
        {
          lang: 'c',
          src: `/* Define a prefix BEFORE including headers; pr_* will prepend it. */
#define pr_fmt(fmt) KBUILD_MODNAME ": " fmt

#include <linux/kernel.h>

void log_examples(int err, void *ptr)
{
    /* The pr_ helpers - preferred over raw printk: */
    pr_emerg("system is unusable\\n");      /* highest urgency */
    pr_alert("action needed immediately\\n");
    pr_crit("critical condition\\n");
    pr_err("operation failed: %d\\n", err);
    pr_warn("something looks wrong\\n");
    pr_notice("normal but significant\\n");
    pr_info("informational message\\n");    /* the everyday default */
    pr_debug("verbose trace, off by default\\n");

    /* Kernel-specific format specifiers: */
    pr_info("a number: %d, a string: %s\\n", err, "text");
    pr_info("a hashed pointer: %p\\n", ptr);  /* %p is sanitized */

    /* Equivalent raw printk forms (older style): */
    printk(KERN_ERR "raw error line\\n");
    printk(KERN_INFO "raw info line\\n");
}

/* Read these with:  dmesg | tail   (or: dmesg -w  to follow live) */`
        }
      ]
    },
    {
      heading: 'MODULE_LICENSE and the metadata macros',
      body: `Every module embeds metadata that the kernel and the user-space tools read. These macros expand to specially tagged variables in the module's ELF file; they do not run code, they just stamp information into the binary.

**MODULE_LICENSE is not optional and is not cosmetic.** It declares the license under which the module is distributed, and the kernel actually enforces it. The crucial consequence: if you do not declare a GPL-compatible license, the kernel marks your module as **tainted** and **denies it access to symbols that are exported GPL-only**. A very large fraction of the kernel's internal API is exported GPL-only precisely so that proprietary modules cannot use it. The accepted strings include the plain GPL marker, GPL with a separate user-space-tools exception, dual BSD/GPL, dual MIT/GPL, and a couple of proprietary markers - but anything that is not GPL-compatible will taint the kernel. A tainted kernel is flagged in every later oops and bug report, and many maintainers will not even look at a bug from a tainted kernel, because proprietary code may be the real culprit. **Omitting MODULE_LICENSE entirely** also taints the kernel and produces a loud warning, so always set it.

The other metadata macros are informational but expected by convention and surfaced by the modinfo tool:

- **MODULE_AUTHOR** records who wrote it (name and email).
- **MODULE_DESCRIPTION** gives a one-line human summary of what the module does.
- **MODULE_VERSION** records a version string for the module itself.
- **MODULE_ALIAS** adds an alternative name so modprobe can find the module by an alias, and is how hardware drivers advertise the device IDs they bind to so the kernel can autoload them.

You inspect all of this without loading the module using modinfo, which simply reads these tags out of the .ko file. Filling them in properly is part of writing a contributable module: maintainers expect a real description and a license line, and CI checks will complain about their absence.

> Pitfall: writing the license string wrong (a typo, or a non-recognized identifier) is treated the same as proprietary - it taints the kernel and locks you out of GPL-only symbols. Use one of the exact recognized strings.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/module.h>

/* These macros stamp metadata into the .ko; they run no code. */

MODULE_LICENSE("GPL");          /* GPL-compatible; required to avoid taint */
/* Other valid strings include:
 *   "GPL v2", "GPL and additional rights",
 *   "Dual BSD/GPL", "Dual MIT/GPL", "Dual MPL/GPL"
 * Non-compatible (these TAINT the kernel):
 *   "Proprietary"
 */

MODULE_AUTHOR("Ada Lovelace <ada@example.com>");
MODULE_DESCRIPTION("Example driver demonstrating module metadata");
MODULE_VERSION("1.2.0");

/* Aliases: let modprobe find this module by another name, or advertise
 * the device IDs it handles so the kernel can autoload it on hotplug. */
MODULE_ALIAS("my_legacy_name");

/* Inspect all of the above WITHOUT loading the module:
 *   modinfo ./mymod.ko          */`
        }
      ]
    },
    {
      heading: 'Module parameters',
      body: `Modules often need to be configurable at load time - which IRQ to use, how big a buffer to allocate, whether to enable a debug mode. The kernel provides **module parameters** for exactly this: named values the user supplies on the insmod or modprobe command line, or sets in a configuration file under the modprobe configuration directory.

You declare a parameter with the **module_param** macro, giving it the variable, its type, and a permission mode. Supported types include the integer kinds, booleans, and C strings (char pointer), among others. The variable should normally be a static global with a sensible default, because the parameter mechanism overwrites it at load time only if the user passes a value. You should also document each parameter with **MODULE_PARM_DESC**, which attaches a help string that modinfo displays - reviewers expect this.

The **permission mode** (the same octal bits as file permissions) controls whether and how the parameter is exposed in sysfs under the per-module directory, so it can be read or even changed *after* the module is loaded. A mode of zero means the parameter does not appear in sysfs at all (load-time only). Read permission means it shows up as a readable file; adding write permission for root lets an administrator change the value live by writing to that file - but only do this if your code is actually prepared to react to a mid-flight change, otherwise you have created a footgun.

Two related macros cover more cases:

- **module_param_named** lets the user-visible parameter name differ from the internal variable name.
- **module_param_array** exposes a fixed-size array, with an optional out-parameter that receives how many elements the user actually supplied.

> Pitfall: never expose a writable parameter for something that is only consulted once during init - writing it later changes the variable but not the behavior, which silently confuses users. And string parameters are not copied defensively for you; treat the kernel-managed storage with the usual care.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/module.h>
#include <linux/moduleparam.h>

/* Static globals with sensible defaults. */
static int   buffer_size = 1024;
static bool  debug_on    = false;
static char *device_name = "default";
static int   irqs[4];
static int   irq_count;

/* Declare them: variable, type, sysfs permission mode. */
module_param(buffer_size, int, 0644);   /* readable + root-writable in sysfs */
MODULE_PARM_DESC(buffer_size, "size of the work buffer in bytes");

module_param(debug_on, bool, 0644);
MODULE_PARM_DESC(debug_on, "enable verbose debug logging");

module_param(device_name, charp, 0444); /* read-only in sysfs */
MODULE_PARM_DESC(device_name, "name to register the device under");

/* Array parameter; irq_count receives how many were supplied. */
module_param_array(irqs, int, &irq_count, 0444);
MODULE_PARM_DESC(irqs, "comma-separated list of IRQ lines to claim");

/* Loading with values:
 *   insmod mymod.ko buffer_size=4096 debug_on=1 device_name=eth_test irqs=5,6,7
 * After load, with mode 0644, you can read/change in sysfs:
 *   cat  /sys/module/mymod/parameters/buffer_size
 *   echo 1 > /sys/module/mymod/parameters/debug_on   (as root) */`
        }
      ]
    },
    {
      heading: 'Out-of-tree Kbuild: compiling against the running kernel',
      body: `A module built outside the kernel source tree (an *out-of-tree* module - the normal case while learning) is not compiled like an ordinary C program. It must be built with the kernel's own build system, **Kbuild**, against the headers of the *exact* kernel it will run on, so that struct layouts, config options, and compiler flags all match. You cannot just run the C compiler by hand; you invoke kernel make.

The pattern is a tiny **Makefile** that does two things. First it tells Kbuild which object file to build as a module by assigning your object name to the obj-m list. Second, it bounces the build into the kernel build directory using make with the M variable pointing back at your own directory. That kernel build directory is found through the running kernel version - the build tree for your current kernel lives under the modules directory for that release, which is why the Makefile typically references the kernel release name reported by the system.

When the build runs, Kbuild compiles your source and then performs a **modpost** step that resolves the kernel symbols you use, generates the module versioning and metadata, and produces the final **.ko** (kernel object) file - a normal ELF object plus the special module sections. That .ko, not the .o, is what you load.

For a module to be accepted *into* the kernel tree the rules differ slightly - you add a config symbol in a Kconfig file and an obj line in the in-tree Makefile, and tristate config lets the user choose built-in, module, or off. But the out-of-tree flow above is what you will use constantly while developing and is also how most third-party drivers (and DKMS-managed modules) are shipped.

> Pitfall: you must have the **matching kernel headers or full source installed** for your running kernel; a missing build directory is the most common first-time failure. And always clean between kernel upgrades - object files built against old headers will mismatch the new kernel's version magic and refuse to load.`,
      code: [
        {
          lang: 'c',
          src: `# Makefile  (out-of-tree module build)
# Lines here are make syntax, not C.

# When invoked by Kbuild (KERNELRELEASE is set), just name the object:
ifneq ($(KERNELRELEASE),)
    obj-m := hello.o
    # For a module built from several sources, instead use:
    #   obj-m := mymod.o
    #   mymod-objs := file1.o file2.o

# When invoked directly from the shell, bounce into the kernel build dir:
else
    KDIR ?= /lib/modules/$(shell uname -r)/build
    PWD  := $(shell pwd)

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean
endif

# Build:   make            -> produces hello.ko
# Inspect: modinfo hello.ko
# Clean:   make clean
#
# Prerequisite: the kernel headers for your running kernel must be
# installed (the .../build directory must exist).`
        }
      ]
    },
    {
      heading: 'Loading and unloading: insmod, rmmod, modprobe, lsmod',
      body: `Four user-space tools manage modules in a running kernel. They wrap kernel system calls that do the real work.

**insmod** inserts one specific .ko file by path. It is the most direct tool and the one you use while developing your own module, because you point it straight at the file you just built. Its weakness is that it is dumb about dependencies: if your module needs symbols from another module that is not yet loaded, insmod simply fails. It also will not search the system module directories - you give it an exact path.

**rmmod** removes a loaded module by name. It refuses to unload a module that is still in use (its reference count is above zero) or that another loaded module depends on, which protects you from yanking code out from under active users. This is where your exit function runs.

**modprobe** is the smart tool used in production. Given a module *name* (not a path), it looks the module up in the system module directory, reads a precomputed dependency database, and automatically loads every module your target depends on, in the correct order - and modprobe -r unloads a module together with the now-unused modules it pulled in. modprobe is what the kernel itself invokes to autoload drivers when new hardware appears, and it honors configuration files that can set default parameters or blacklist modules. The dependency database it relies on is generated by the depmod tool, which you run after installing a module into the system directories.

**lsmod** lists the modules currently loaded, showing each module's name, its memory size, its use count, and which other modules depend on it. It is simply a human-readable view of the kernel's module list (the same data exposed through the proc filesystem).

The everyday development loop is: build with make, load with insmod, watch dmesg for your messages, then rmmod to remove - repeating without ever rebooting. Reach for modprobe when dependencies or real installation are involved.

> Pitfall: rmmod failing with a busy/in-use error almost always means your module still holds a resource or has open users; it is usually a bug in your own reference counting, not a tooling problem. And insmod giving an "invalid module format" or version-magic error means the .ko was built against a different kernel than the one running.`,
      code: [
        {
          lang: 'c',
          src: `/* These are shell commands, shown here as comments. */

/* Build, then load YOUR freshly built file by exact path: */
//   make
//   sudo insmod hello.ko parameter=value
//   dmesg | tail            -> see the messages from your init function

/* List what is loaded; find your module: */
//   lsmod
//   lsmod | grep hello      -> name, size, usecount, dependents

/* Remove it by NAME (no .ko, no path) - runs your exit function: */
//   sudo rmmod hello
//   dmesg | tail            -> see the unload message

/* Production / dependency-aware path (by module NAME, searches the
 * system module dirs and loads dependencies automatically): */
//   sudo modprobe e1000e            -> load it and its deps
//   sudo modprobe -r e1000e         -> unload it and now-unused deps

/* After copying a .ko into /lib/modules/<ver>/ you must rebuild the
 * dependency map so modprobe can find it: */
//   sudo depmod -a`
        }
      ]
    },
    {
      heading: '__init, __exit, EXPORT_SYMBOL, and cleanup on failure',
      body: `Three more pieces complete a professional-quality module: the section markers that save memory, the symbol exports that let modules cooperate, and the unwind discipline that keeps failures from corrupting the kernel.

### __init and __exit

Marking a function **__init** tells the kernel that the function is only needed during initialization. The linker places such functions in a dedicated section, and once the module finishes loading the kernel **frees that memory** - the code is gone, reclaimed for general use. This matters at scale: across hundreds of built-in drivers, discarding init-only code recovers a meaningful amount of RAM. The matching marker for data used only during init is the init-data marker. Correspondingly, **__exit** marks cleanup-only code; for a module compiled *into* the kernel (which can never be unloaded) that code is discarded entirely, since it would never run. The rule is simple: tag your init function __init and your exit function __exit, and never call an __init function after initialization or reference __exit code from normal paths - the memory may be gone.

### EXPORT_SYMBOL

By default a module's functions and variables are private; the rest of the kernel cannot see them. To let *other* modules call your function or use your variable, you **export** it. **EXPORT_SYMBOL** makes a symbol available to any module; **EXPORT_SYMBOL_GPL** makes it available only to modules that declared a GPL-compatible license. This is the mechanism behind the GPL-only API mentioned earlier - the kernel exports most internal interfaces with the GPL-restricted variant on purpose. Exporting is how layered subsystems work: a core module exports an interface and many small modules build on top of it. An exported symbol becomes part of an API contract, so export deliberately and document it.

### Cleanup on failure - the most important discipline

If your init function does several steps and step three fails, steps one and two have already grabbed resources. Returning the error without releasing them **leaks kernel resources** - memory, device numbers, IRQs, sysfs entries - that nothing will ever reclaim until reboot. Kernel code therefore follows a strict **unwind-in-reverse** pattern, conventionally written with goto labels arranged so each failure jumps to the label that undoes exactly the steps already completed, in the opposite order they were done. Beginners are told to avoid goto in user space; in the kernel this goto-based error ladder is the *idiomatic and expected* style precisely because it makes the cleanup ordering obvious and avoids deeply nested conditionals. Your exit function should mirror the success path's teardown - and the goto ladder in init should reuse those same teardown steps.

> Pitfall: the classic kernel bug is asymmetric cleanup - acquiring three resources but only releasing two on the error path, or releasing them in the wrong order so something is freed while still in use. Build the unwind ladder as you write each acquisition, not afterward, and review init and exit side by side to confirm they are mirror images.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/module.h>
#include <linux/init.h>
#include <linux/slab.h>

/* Export a symbol so OTHER modules may use it. */
int my_public_api(int x) { return x + 1; }
EXPORT_SYMBOL_GPL(my_public_api);   /* GPL-only consumers; use
                                       EXPORT_SYMBOL for any module */

static void *buf;

static int __init demo_init(void)   /* __init: freed after load */
{
    int ret;

    buf = kmalloc(4096, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;             /* step 1 failed: nothing to undo yet */

    ret = step_two_register();
    if (ret)
        goto err_free_buf;          /* undo step 1 */

    ret = step_three_register();
    if (ret)
        goto err_undo_two;          /* undo steps 2 then 1 */

    pr_info("demo: ready\\n");
    return 0;

/* Unwind in REVERSE order of acquisition: */
err_undo_two:
    step_two_unregister();
err_free_buf:
    kfree(buf);
    buf = NULL;
    return ret;                     /* propagate the real error code */
}

static void __exit demo_exit(void) /* mirror image of the success path */
{
    step_three_unregister();
    step_two_unregister();
    kfree(buf);
}

module_init(demo_init);
module_exit(demo_exit);
MODULE_LICENSE("GPL");`
        }
      ]
    }
  ],
  takeaways: [
    'A module is kernel code linked in at runtime; it has no main(), runs fully privileged, and a single mistake can panic the whole machine.',
    'module_init registers the load entry (return 0 on success, a negative errno on failure); module_exit registers the unload entry and must undo everything.',
    'Use printk via the pr_ helpers and pick the right log level; always end messages with a newline, and prefer dev_ helpers for device-specific logs.',
    'MODULE_LICENSE is mandatory: a non-GPL or missing license taints the kernel and blocks access to GPL-only exported symbols; fill in author, description, version too.',
    'Declare tunables with module_param plus MODULE_PARM_DESC; the permission mode controls sysfs visibility, and only expose writable params your code can actually react to.',
    'Out-of-tree modules build with Kbuild against the running kernel headers via a tiny Makefile that bounces into /lib/modules/$(uname -r)/build and emit a .ko, not a .o.',
    'insmod loads a .ko by path, rmmod unloads by name, modprobe resolves dependencies and loads by name, lsmod lists loaded modules; develop with insmod/rmmod and dmesg.',
    'Tag init code __init (its memory is freed after load) and cleanup code __exit; EXPORT_SYMBOL(_GPL) shares functions with other modules as a deliberate API contract.',
    'Always clean up on failure with the idiomatic reverse-order goto ladder, and make exit a mirror image of init so no resource leaks until reboot.'
  ],
  cheatsheet: [
    { label: 'module_init(fn)', value: 'Register load entry point; fn returns 0 or -errno' },
    { label: 'module_exit(fn)', value: 'Register unload entry point; fn is void and undoes init' },
    { label: '__init / __exit', value: 'Mark init-only / exit-only code so memory is reclaimed' },
    { label: 'pr_info / pr_err / pr_debug', value: 'printk helpers at info / error / debug levels' },
    { label: 'dmesg | tail', value: 'Read kernel log ring buffer (use dmesg -w to follow)' },
    { label: 'MODULE_LICENSE("GPL")', value: 'Required; non-GPL or missing taints the kernel' },
    { label: 'MODULE_AUTHOR / _DESCRIPTION / _VERSION', value: 'Metadata shown by modinfo' },
    { label: 'module_param(var, type, mode)', value: 'Declare a load-time tunable; mode = sysfs perms' },
    { label: 'MODULE_PARM_DESC(var, "help")', value: 'Document a parameter for modinfo' },
    { label: 'EXPORT_SYMBOL / _GPL', value: 'Expose a symbol to all / to GPL modules only' },
    { label: 'make -C /lib/modules/$(uname -r)/build M=$(pwd)', value: 'Out-of-tree Kbuild invocation' },
    { label: 'insmod file.ko / rmmod name', value: 'Load a .ko by path / unload by name' },
    { label: 'modprobe name / modprobe -r name', value: 'Load (with deps) / unload by module name' },
    { label: 'lsmod / modinfo file.ko', value: 'List loaded modules / show a module metadata' }
  ]
}

export default note
