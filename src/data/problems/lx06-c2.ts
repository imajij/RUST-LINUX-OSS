import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch06-c-036',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Hello Module With Full Metadata',
    prompt: `Write a complete loadable module "hello.c" that prints "hello: init\\n" with KERN_INFO at load and "hello: exit\\n" at unload. Register init/exit with module_init/module_exit, annotate them __init and __exit, and supply all four standard metadata macros: MODULE_LICENSE("GPL"), MODULE_AUTHOR, MODULE_DESCRIPTION, and MODULE_VERSION.`,
    hints: [
      'printk(KERN_INFO ...) and pr_info(...) are equivalent.',
      'Init returns int (0 on success); exit returns void.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init hello_init(void)
{
    printk(KERN_INFO "hello: init\\n");
    return 0;
}

static void __exit hello_exit(void)
{
    printk(KERN_INFO "hello: exit\\n");
}

module_init(hello_init);
module_exit(hello_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("A Learner");
MODULE_DESCRIPTION("Hello world kernel module");
MODULE_VERSION("1.0");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init hello_init(void)
{
    // TODO: print "hello: init" at KERN_INFO, return 0
}

static void __exit hello_exit(void)
{
    // TODO: print "hello: exit"
}

// TODO: register init/exit and add LICENSE, AUTHOR, DESCRIPTION, VERSION`,
    tags: ['module', 'metadata', 'init'],
  },
  {
    id: 'lx-ch06-c-037',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Out-Of-Tree Kbuild Makefile',
    prompt: `Write a Makefile for an out-of-tree module built from greet.c into greet.ko. Add greet.o to obj-m. Provide an "all" target that runs the kernel build system with -C \\$(KDIR) M=\\$(PWD) modules and a "clean" target that runs the same with the clean target. Let KDIR default to /lib/modules/\\$(shell uname -r)/build but allow overriding it from the environment.`,
    hints: [
      'obj-m += greet.o produces greet.ko.',
      'Use ?= so KDIR can be overridden; recipe lines are tab-indented.',
    ],
    solution: `obj-m += greet.o

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    starter: `# TODO: add greet.o to obj-m

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	# TODO: build modules via the kernel build system

clean:
	# TODO: clean via the kernel build system`,
    tags: ['kbuild', 'makefile', 'module'],
  },
  {
    id: 'lx-ch06-c-038',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Module Parameter: Integer Count',
    prompt: `Add a module parameter "count" of type int defaulting to 1. Make it visible and writable to root in sysfs (mode 0644) via module_param. In init, loop count times printing "tick %d\\n" (0-based) at KERN_INFO, then return 0. Also give the parameter a description with MODULE_PARM_DESC.`,
    hints: [
      'module_param(name, type, perm); int uses type "int".',
      '0644 = owner read/write, group/other read.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int count = 1;
module_param(count, int, 0644);
MODULE_PARM_DESC(count, "number of ticks to print at load");

static int __init p_init(void)
{
    int i;

    for (i = 0; i < count; i++)
        printk(KERN_INFO "tick %d\\n", i);
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
// TODO: expose count as a module_param with mode 0644 and describe it

static int __init p_init(void)
{
    // TODO: print "tick i" for i in [0, count)
    return 0;
}

static void __exit p_exit(void) {}

module_init(p_init);
module_exit(p_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module_param', 'sysfs', 'module'],
  },
  {
    id: 'lx-ch06-c-039',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'String Parameter With charp',
    prompt: `Declare a module parameter "name" of type charp (char *) defaulting to "world", readable only (mode 0444). In init print "hello, %s\\n" at KERN_INFO using that parameter. Explain in a comment why you must NOT kfree the default string value.`,
    hints: [
      'charp parameters point at static storage or the strdup\'d module-arg.',
      'You did not allocate it, so you must not free it.',
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
    /* 'name' is managed by the module loader; we never allocated it,
     * so we must never kfree() it. */
    printk(KERN_INFO "hello, %s\\n", name);
    return 0;
}

static void __exit n_exit(void) {}

module_init(n_init);
module_exit(n_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static char *name = "world";
// TODO: module_param as charp, mode 0444, describe it

static int __init n_init(void)
{
    // TODO: print "hello, <name>"
    return 0;
}

static void __exit n_exit(void) {}

module_init(n_init);
module_exit(n_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module_param', 'charp', 'module'],
  },
  {
    id: 'lx-ch06-c-040',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Log Levels Across The Spectrum',
    prompt: `Write an init that emits one message at each of these levels using the pr_* helpers: pr_emerg, pr_alert, pr_crit, pr_err, pr_warn, pr_notice, pr_info, pr_debug. Each message text should be the level name, e.g. "level: info\\n". Return 0. In a comment, note what controls whether pr_debug actually prints.`,
    hints: [
      'The pr_* macros map onto KERN_EMERG .. KERN_DEBUG.',
      'pr_debug compiles to nothing unless DEBUG or dynamic debug is enabled.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init lv_init(void)
{
    pr_emerg("level: emerg\\n");
    pr_alert("level: alert\\n");
    pr_crit("level: crit\\n");
    pr_err("level: err\\n");
    pr_warn("level: warn\\n");
    pr_notice("level: notice\\n");
    pr_info("level: info\\n");
    /* pr_debug only prints if DEBUG is defined or dynamic debug enables it */
    pr_debug("level: debug\\n");
    return 0;
}

static void __exit lv_exit(void) {}

module_init(lv_init);
module_exit(lv_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init lv_init(void)
{
    // TODO: emit one message at each log level using pr_* helpers
    return 0;
}

static void __exit lv_exit(void) {}

module_init(lv_init);
module_exit(lv_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'loglevel', 'module'],
  },
  {
    id: 'lx-ch06-c-041',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Per-Module Log Prefix With pr_fmt',
    prompt: `Define pr_fmt so that every pr_* message from this module is automatically prefixed with the module name and the function name, like "mymod: my_init: started\\n". Define pr_fmt BEFORE including linux/kernel.h, using KBUILD_MODNAME and __func__. Then pr_info("started\\n") in init.`,
    hints: [
      '#define pr_fmt(fmt) must come before <linux/kernel.h>.',
      'KBUILD_MODNAME is the module name; __func__ is the caller.',
    ],
    solution: `#define pr_fmt(fmt) KBUILD_MODNAME ": %s: " fmt, __func__

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init my_init(void)
{
    pr_info("started\\n");
    return 0;
}

static void __exit my_exit(void)
{
    pr_info("stopped\\n");
}

module_init(my_init);
module_exit(my_exit);
MODULE_LICENSE("GPL");`,
    starter: `// TODO: define pr_fmt to prefix with KBUILD_MODNAME and __func__, BEFORE the includes

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init my_init(void)
{
    pr_info("started\\n");
    return 0;
}

static void __exit my_exit(void)
{
    pr_info("stopped\\n");
}

module_init(my_init);
module_exit(my_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'pr_fmt', 'module'],
  },
  {
    id: 'lx-ch06-c-042',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bool Parameter Toggles Verbosity',
    prompt: `Add a bool module parameter "verbose" defaulting to false (mode 0644). In init always print "loaded\\n" at KERN_INFO, and only when verbose is true additionally print "verbose mode on\\n". Use the bool type properly (the variable must be bool, not int).`,
    hints: [
      'module_param(verbose, bool, 0644); the variable is bool.',
      'A bool parameter accepts 1/0/Y/N/yes/no on the insmod line.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static bool verbose = false;
module_param(verbose, bool, 0644);
MODULE_PARM_DESC(verbose, "enable extra logging");

static int __init v_init(void)
{
    printk(KERN_INFO "loaded\\n");
    if (verbose)
        printk(KERN_INFO "verbose mode on\\n");
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

static bool verbose = false;
// TODO: module_param bool 0644, describe it

static int __init v_init(void)
{
    // TODO: always print "loaded"; if verbose, also print "verbose mode on"
    return 0;
}

static void __exit v_exit(void) {}

module_init(v_init);
module_exit(v_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module_param', 'bool', 'module'],
  },
  {
    id: 'lx-ch06-c-043',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Init Allocates, Exit Frees',
    prompt: `In init, allocate a 256-byte buffer with kmalloc(GFP_KERNEL) and store it in a static pointer "buf". If allocation fails, return -ENOMEM. Otherwise zero the buffer and return 0. In exit, kfree(buf). Explain in a comment why GFP_KERNEL is acceptable in a module init function.`,
    hints: [
      'kmalloc returns NULL on failure; check it.',
      'Module init runs in process context and may sleep, so GFP_KERNEL is fine.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *buf;

static int __init b_init(void)
{
    /* init runs in process context and may sleep, so GFP_KERNEL is fine */
    buf = kmalloc(256, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;
    memset(buf, 0, 256);
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
    // TODO: kmalloc 256 bytes with GFP_KERNEL; -ENOMEM on failure; zero it
    return 0;
}

static void __exit b_exit(void)
{
    // TODO: free buf
}

module_init(b_init);
module_exit(b_exit);
MODULE_LICENSE("GPL");`,
    tags: ['kmalloc', 'cleanup', 'module'],
  },
  {
    id: 'lx-ch06-c-044',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Export A Symbol For Other Modules',
    prompt: `Write a "provider" module that defines an exported function "int my_add(int a, int b)" returning a+b, and exports it with EXPORT_SYMBOL so other modules can link against it. The init function may just print "provider loaded\\n". Keep my_add non-static so it has external linkage.`,
    hints: [
      'EXPORT_SYMBOL(my_add) goes after the function definition.',
      'Exported functions must NOT be static.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

int my_add(int a, int b)
{
    return a + b;
}
EXPORT_SYMBOL(my_add);

static int __init prov_init(void)
{
    printk(KERN_INFO "provider loaded\\n");
    return 0;
}

static void __exit prov_exit(void) {}

module_init(prov_init);
module_exit(prov_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: define non-static int my_add(int, int) and EXPORT_SYMBOL it

static int __init prov_init(void)
{
    printk(KERN_INFO "provider loaded\\n");
    return 0;
}

static void __exit prov_exit(void) {}

module_init(prov_init);
module_exit(prov_exit);
MODULE_LICENSE("GPL");`,
    tags: ['export_symbol', 'module', 'linkage'],
  },
  {
    id: 'lx-ch06-c-045',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Consume An Exported Symbol',
    prompt: `Write a "consumer" module that uses int my_add(int, int) exported by another module. Declare it with extern, call my_add(2, 3) in init, print the result with "sum=%d\\n" at KERN_INFO, and return 0. In a comment, note what must be true at insmod time for the symbol to resolve.`,
    hints: [
      'extern int my_add(int, int); declares the external symbol.',
      'The provider module must already be loaded so the symbol exists.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern int my_add(int a, int b);

static int __init cons_init(void)
{
    /* The provider module exporting my_add must be loaded first,
     * otherwise insmod fails with "Unknown symbol". */
    int r = my_add(2, 3);

    printk(KERN_INFO "sum=%d\\n", r);
    return 0;
}

static void __exit cons_exit(void) {}

module_init(cons_init);
module_exit(cons_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: declare extern my_add

static int __init cons_init(void)
{
    // TODO: call my_add(2, 3), print "sum=<r>"
    return 0;
}

static void __exit cons_exit(void) {}

module_init(cons_init);
module_exit(cons_exit);
MODULE_LICENSE("GPL");`,
    tags: ['export_symbol', 'extern', 'module'],
  },
  {
    id: 'lx-ch06-c-046',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Array Parameter With module_param_array',
    prompt: `Declare a module parameter "vals" that is an int array of up to 4 elements with a count variable "nvals", using module_param_array. In init, print each provided value as "vals[%d]=%d\\n" looping nvals times, then return 0.`,
    hints: [
      'module_param_array(name, type, &count, perm).',
      'The count variable receives how many elements were actually supplied.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int vals[4];
static int nvals;
module_param_array(vals, int, &nvals, 0444);
MODULE_PARM_DESC(vals, "up to 4 integers");

static int __init a_init(void)
{
    int i;

    for (i = 0; i < nvals; i++)
        printk(KERN_INFO "vals[%d]=%d\\n", i, vals[i]);
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

static int vals[4];
static int nvals;
// TODO: module_param_array(vals, int, &nvals, 0444)

static int __init a_init(void)
{
    // TODO: print each of the nvals supplied values
    return 0;
}

static void __exit a_exit(void) {}

module_init(a_init);
module_exit(a_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module_param_array', 'array', 'module'],
  },
  {
    id: 'lx-ch06-c-047',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Validate A Parameter, Refuse To Load',
    prompt: `Add an int parameter "bufsz" (default 64, mode 0444). In init, reject invalid configuration: if bufsz <= 0 or bufsz > 4096, print an error at KERN_ERR and return -EINVAL so insmod fails. Otherwise print "bufsz=%d\\n" and return 0.`,
    hints: [
      'Returning a negative errno from init makes insmod fail.',
      '-EINVAL is the conventional error for bad parameters.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int bufsz = 64;
module_param(bufsz, int, 0444);
MODULE_PARM_DESC(bufsz, "buffer size in bytes (1..4096)");

static int __init c_init(void)
{
    if (bufsz <= 0 || bufsz > 4096) {
        printk(KERN_ERR "bufsz %d out of range\\n", bufsz);
        return -EINVAL;
    }
    printk(KERN_INFO "bufsz=%d\\n", bufsz);
    return 0;
}

static void __exit c_exit(void) {}

module_init(c_init);
module_exit(c_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int bufsz = 64;
// TODO: module_param 0444, describe

static int __init c_init(void)
{
    // TODO: reject bufsz <=0 or >4096 with KERN_ERR and -EINVAL; else print and return 0
    return 0;
}

static void __exit c_exit(void) {}

module_init(c_init);
module_exit(c_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module_param', 'validation', 'errno'],
  },
  {
    id: 'lx-ch06-c-048',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Dual-Licensed Module Strings',
    prompt: `Some symbols (like certain memory APIs) are only available to GPL-compatible modules. Write a module whose MODULE_LICENSE declares it dual BSD/GPL so it counts as GPL-compatible, add MODULE_AUTHOR and MODULE_DESCRIPTION, and print "tainted? no\\n" at KERN_INFO in init. State in a comment which exact license string keeps the kernel untainted while allowing redistribution under BSD.`,
    hints: [
      'Valid GPL-compatible strings include "GPL", "GPL v2", "Dual BSD/GPL".',
      'A non-free MODULE_LICENSE taints the kernel and blocks EXPORT_SYMBOL_GPL.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init d_init(void)
{
    /* "Dual BSD/GPL" is GPL-compatible: it does NOT taint the kernel
     * and may access EXPORT_SYMBOL_GPL symbols. */
    printk(KERN_INFO "tainted? no\\n");
    return 0;
}

static void __exit d_exit(void) {}

module_init(d_init);
module_exit(d_exit);

MODULE_LICENSE("Dual BSD/GPL");
MODULE_AUTHOR("A Learner");
MODULE_DESCRIPTION("Dual-licensed demo");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init d_init(void)
{
    // TODO: print "tainted? no"
    return 0;
}

static void __exit d_exit(void) {}

module_init(d_init);
module_exit(d_exit);

// TODO: MODULE_LICENSE (dual BSD/GPL), AUTHOR, DESCRIPTION`,
    tags: ['module', 'license', 'metadata'],
  },
  {
    id: 'lx-ch06-c-049',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Why __initdata Is Used',
    prompt: `Write a module init that reads a constant lookup table only at load time and discards it afterward. Define "static const int squares[5] __initconst = {0,1,4,9,16};" and in init print each element as "sq %d\\n". Mark init __init. In a comment, explain what __initconst lets the kernel do after init completes.`,
    hints: [
      '__init code and __initconst data are placed in a discardable section.',
      'After init runs, that memory is freed back to the system.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static const int squares[5] __initconst = { 0, 1, 4, 9, 16 };

static int __init s_init(void)
{
    int i;

    /* squares lives in an __init section; after init returns, the kernel
     * frees that memory so the table no longer occupies RAM. */
    for (i = 0; i < 5; i++)
        printk(KERN_INFO "sq %d\\n", squares[i]);
    return 0;
}

static void __exit s_exit(void) {}

module_init(s_init);
module_exit(s_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: define static const int squares[5] __initconst = {0,1,4,9,16};

static int __init s_init(void)
{
    // TODO: print each element as "sq <v>"
    return 0;
}

static void __exit s_exit(void) {}

module_init(s_init);
module_exit(s_exit);
MODULE_LICENSE("GPL");`,
    tags: ['__init', '__initconst', 'module'],
  },
  {
    id: 'lx-ch06-c-050',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Track Load Time With jiffies',
    prompt: `In init, save the current jiffies into a static unsigned long "loaded_at" and print "loaded at %lu\\n". In exit, compute how many jiffies elapsed and print "alive for %u ms\\n" using jiffies_to_msecs on the difference. Return 0 from init.`,
    hints: [
      'jiffies is a global unsigned long tick counter.',
      'jiffies_to_msecs(delta) converts ticks to milliseconds.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/jiffies.h>

static unsigned long loaded_at;

static int __init j_init(void)
{
    loaded_at = jiffies;
    printk(KERN_INFO "loaded at %lu\\n", loaded_at);
    return 0;
}

static void __exit j_exit(void)
{
    unsigned long delta = jiffies - loaded_at;

    printk(KERN_INFO "alive for %u ms\\n", jiffies_to_msecs(delta));
}

module_init(j_init);
module_exit(j_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/jiffies.h>

static unsigned long loaded_at;

static int __init j_init(void)
{
    // TODO: record jiffies, print "loaded at <j>"
    return 0;
}

static void __exit j_exit(void)
{
    // TODO: print elapsed time in ms with jiffies_to_msecs
}

module_init(j_init);
module_exit(j_exit);
MODULE_LICENSE("GPL");`,
    tags: ['jiffies', 'time', 'module'],
  },
  {
    id: 'lx-ch06-c-051',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read-Only Callback Parameter (param_ops)',
    prompt: `Expose a parameter "mode" whose default is 0. Instead of plain module_param, write it with module_param_named(mode, mode, int, 0644) and also register a MODULE_PARM_DESC. In init, print "mode=%d\\n". Demonstrate using module_param_named so the sysfs name could differ from the variable name (here keep both "mode").`,
    hints: [
      'module_param_named(sysfs_name, var, type, perm).',
      'It is the same as module_param when the two names match.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int mode;
module_param_named(mode, mode, int, 0644);
MODULE_PARM_DESC(mode, "operating mode");

static int __init m_init(void)
{
    printk(KERN_INFO "mode=%d\\n", mode);
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

static int mode;
// TODO: module_param_named(mode, mode, int, 0644) and describe

static int __init m_init(void)
{
    // TODO: print "mode=<mode>"
    return 0;
}

static void __exit m_exit(void) {}

module_init(m_init);
module_exit(m_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module_param_named', 'sysfs', 'module'],
  },
  {
    id: 'lx-ch06-c-052',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'EXPORT_SYMBOL_GPL Restriction',
    prompt: `Write a provider that exports "void secret_op(void)" (prints "secret\\n") using EXPORT_SYMBOL_GPL instead of EXPORT_SYMBOL. The module's init prints "gpl provider loaded\\n". In a comment, state which kinds of consuming modules are allowed to use a GPL-only exported symbol.`,
    hints: [
      'EXPORT_SYMBOL_GPL restricts the symbol to GPL-compatible modules.',
      'A proprietary MODULE_LICENSE cannot resolve a _GPL symbol.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

void secret_op(void)
{
    printk(KERN_INFO "secret\\n");
}
/* Only modules with a GPL-compatible MODULE_LICENSE may link to this. */
EXPORT_SYMBOL_GPL(secret_op);

static int __init g_init(void)
{
    printk(KERN_INFO "gpl provider loaded\\n");
    return 0;
}

static void __exit g_exit(void) {}

module_init(g_init);
module_exit(g_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: define void secret_op(void) printing "secret" and EXPORT_SYMBOL_GPL it

static int __init g_init(void)
{
    printk(KERN_INFO "gpl provider loaded\\n");
    return 0;
}

static void __exit g_exit(void) {}

module_init(g_init);
module_exit(g_exit);
MODULE_LICENSE("GPL");`,
    tags: ['export_symbol_gpl', 'license', 'module'],
  },
  {
    id: 'lx-ch06-c-053',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build Two Modules From One Makefile',
    prompt: `Write a Kbuild Makefile that builds two separate modules in the same directory: foo.ko from foo.c and bar.ko from bar.c. Add both object files to obj-m. Keep the standard out-of-tree all/clean targets driving -C \\$(KDIR) M=\\$(PWD).`,
    hints: [
      'List multiple .o files on obj-m to build multiple .ko modules.',
      'Each .o not part of a composite becomes its own .ko.',
    ],
    solution: `obj-m += foo.o
obj-m += bar.o

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    starter: `# TODO: add foo.o and bar.o to obj-m

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    tags: ['kbuild', 'makefile', 'module'],
  },
  {
    id: 'lx-ch06-c-054',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Composite Module From Multiple Objects',
    prompt: `Write a Kbuild Makefile that builds ONE module "net.ko" composed of two source files main.c and helper.c. Use obj-m += net.o and net-objs (or net-y) listing main.o and helper.o. Keep the standard all/clean targets.`,
    hints: [
      'net-objs := main.o helper.o links both into net.ko.',
      'The composite target name (net) must differ from every component name.',
    ],
    solution: `obj-m += net.o
net-objs := main.o helper.o

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    starter: `obj-m += net.o
# TODO: declare net-objs (or net-y) listing main.o helper.o

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    tags: ['kbuild', 'makefile', 'composite'],
  },
  {
    id: 'lx-ch06-c-055',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Module Name At Runtime',
    prompt: `Write an init that prints the running module's own name. Use THIS_MODULE->name and print "module %s loaded\\n" at KERN_INFO. Return 0. In a comment, note what THIS_MODULE points to.`,
    hints: [
      'THIS_MODULE is a pointer to this module\'s struct module.',
      'Its ->name field is the module name string.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init tm_init(void)
{
    /* THIS_MODULE points to this module's struct module instance */
    printk(KERN_INFO "module %s loaded\\n", THIS_MODULE->name);
    return 0;
}

static void __exit tm_exit(void) {}

module_init(tm_init);
module_exit(tm_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init tm_init(void)
{
    // TODO: print "module <name> loaded" using THIS_MODULE->name
    return 0;
}

static void __exit tm_exit(void) {}

module_init(tm_init);
module_exit(tm_exit);
MODULE_LICENSE("GPL");`,
    tags: ['this_module', 'module', 'runtime'],
  },
  {
    id: 'lx-ch06-c-056',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Hex And Pointer Format Specifiers',
    prompt: `Write an init that demonstrates correct printk format specifiers. Print an unsigned int flags=0xDEAD as "flags=0x%x\\n", a size_t n=4096 as "n=%zu\\n", and the address of a static int x using the safe pointer specifier as "addr=%p\\n". Return 0.`,
    hints: [
      'Use %zu for size_t and %x for unsigned int.',
      'Use %p for kernel pointers; it is hashed for security.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int x;

static int __init f_init(void)
{
    unsigned int flags = 0xDEAD;
    size_t n = 4096;

    printk(KERN_INFO "flags=0x%x\\n", flags);
    printk(KERN_INFO "n=%zu\\n", n);
    printk(KERN_INFO "addr=%p\\n", &x);
    return 0;
}

static void __exit f_exit(void) {}

module_init(f_init);
module_exit(f_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int x;

static int __init f_init(void)
{
    unsigned int flags = 0xDEAD;
    size_t n = 4096;

    // TODO: print flags with %x, n with %zu, &x with %p
    return 0;
}

static void __exit f_exit(void) {}

module_init(f_init);
module_exit(f_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'format', 'module'],
  },
  {
    id: 'lx-ch06-c-057',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Rate-Limited Logging',
    prompt: `Write an init that would otherwise flood the log: loop 100000 times and on each iteration call printk_ratelimited(KERN_INFO "tick\\n"). Return 0. In a comment, explain what printk_ratelimited does compared to plain printk in a tight loop.`,
    hints: [
      'printk_ratelimited suppresses repeated messages within a time window.',
      'It protects the log/console from being flooded.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/ratelimit.h>

static int __init r_init(void)
{
    int i;

    /* printk_ratelimited drops most messages in a burst, printing only a
     * few per interval so a tight loop cannot flood the log. */
    for (i = 0; i < 100000; i++)
        printk_ratelimited(KERN_INFO "tick\\n");
    return 0;
}

static void __exit r_exit(void) {}

module_init(r_init);
module_exit(r_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/ratelimit.h>

static int __init r_init(void)
{
    int i;

    // TODO: loop 100000 times calling printk_ratelimited
    return 0;
}

static void __exit r_exit(void) {}

module_init(r_init);
module_exit(r_exit);
MODULE_LICENSE("GPL");`,
    tags: ['printk', 'ratelimit', 'module'],
  },
  {
    id: 'lx-ch06-c-058',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Conditional Build Flag In Makefile',
    prompt: `Write a Makefile that defines a DEBUG build switch. When the user runs "make DEBUG=1", pass -DDEBUG to the compiler for the module objects via ccflags-y; otherwise build without it. Build mod.o into mod.ko. Keep the standard all/clean targets.`,
    hints: [
      'ccflags-y adds per-directory compiler flags in Kbuild.',
      'Use a conditional: ifeq ($(DEBUG),1) ... endif.',
    ],
    solution: `obj-m += mod.o

ifeq ($(DEBUG),1)
ccflags-y += -DDEBUG
endif

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    starter: `obj-m += mod.o

# TODO: when DEBUG=1, add -DDEBUG to ccflags-y

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    tags: ['kbuild', 'makefile', 'ccflags'],
  },
  {
    id: 'lx-ch06-c-059',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Exit Function That Reports A Counter',
    prompt: `Maintain a static int "events" initialized to 0. Provide an exported function "void bump(void)" (EXPORT_SYMBOL) that increments events. In init seed events to 0 and print "ready\\n". In exit print "events=%d\\n". Return 0 from init.`,
    hints: [
      'A module-global static int persists between init and exit.',
      'EXPORT_SYMBOL makes bump callable from other modules.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int events;

void bump(void)
{
    events++;
}
EXPORT_SYMBOL(bump);

static int __init e_init(void)
{
    events = 0;
    printk(KERN_INFO "ready\\n");
    return 0;
}

static void __exit e_exit(void)
{
    printk(KERN_INFO "events=%d\\n", events);
}

module_init(e_init);
module_exit(e_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int events;

// TODO: void bump(void) increments events; EXPORT_SYMBOL it

static int __init e_init(void)
{
    // TODO: events = 0; print "ready"
    return 0;
}

static void __exit e_exit(void)
{
    // TODO: print "events=<events>"
}

module_init(e_init);
module_exit(e_exit);
MODULE_LICENSE("GPL");`,
    tags: ['export_symbol', 'state', 'module'],
  },
  {
    id: 'lx-ch06-c-060',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two-Stage Init With Goto Cleanup',
    prompt: `Write init that does two allocations that can each fail. Allocate static char *a = kmalloc(128, GFP_KERNEL); if it fails return -ENOMEM. Then static char *b = kmalloc(256, GFP_KERNEL); if it fails, free a and return -ENOMEM. Use goto error labels (err_b unwinds nothing more, err_a frees a) so cleanup is centralized and there is no double free. On success print "ok\\n" and return 0. exit frees both.`,
    hints: [
      'Order goto labels in reverse of acquisition (most-recent first).',
      'Each label only undoes what succeeded before that point.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *a;
static char *b;

static int __init g_init(void)
{
    int ret;

    a = kmalloc(128, GFP_KERNEL);
    if (!a) {
        ret = -ENOMEM;
        goto err_a;
    }

    b = kmalloc(256, GFP_KERNEL);
    if (!b) {
        ret = -ENOMEM;
        goto err_b;
    }

    printk(KERN_INFO "ok\\n");
    return 0;

err_b:
    kfree(a);
    a = NULL;
err_a:
    return ret;
}

static void __exit g_exit(void)
{
    kfree(b);
    kfree(a);
}

module_init(g_init);
module_exit(g_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *a;
static char *b;

static int __init g_init(void)
{
    int ret;

    // TODO: allocate a (128). On failure goto err_a.
    // TODO: allocate b (256). On failure goto err_b.
    // TODO: print "ok"; return 0
    // err_b: free a; err_a: return ret;
    return 0;
}

static void __exit g_exit(void)
{
    // TODO: free b then a
}

module_init(g_init);
module_exit(g_exit);
MODULE_LICENSE("GPL");`,
    tags: ['cleanup', 'goto', 'errno'],
  },
  {
    id: 'lx-ch06-c-061',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Unwind Registration On Failure',
    prompt: `Simulate registering two subsystems in init via helper calls register_x() and register_y(), each returning 0 or a negative errno. If register_x fails, return its error. If register_y fails, you MUST call unregister_x() before returning register_y's error. On success return 0. exit must unregister both in reverse order. Use a goto error path; do NOT leak the X registration when Y fails.`,
    hints: [
      'Propagate the exact errno returned by the failing register call.',
      'Reverse order in cleanup: undo Y before X.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern int register_x(void);
extern void unregister_x(void);
extern int register_y(void);
extern void unregister_y(void);

static int __init u_init(void)
{
    int ret;

    ret = register_x();
    if (ret)
        return ret;

    ret = register_y();
    if (ret)
        goto err_y;

    return 0;

err_y:
    unregister_x();
    return ret;
}

static void __exit u_exit(void)
{
    unregister_y();
    unregister_x();
}

module_init(u_init);
module_exit(u_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern int register_x(void);
extern void unregister_x(void);
extern int register_y(void);
extern void unregister_y(void);

static int __init u_init(void)
{
    int ret;

    // TODO: register_x; if it fails return its error
    // TODO: register_y; if it fails unregister_x and return its error
    return 0;
}

static void __exit u_exit(void)
{
    // TODO: unregister_y then unregister_x
}

module_init(u_init);
module_exit(u_exit);
MODULE_LICENSE("GPL");`,
    tags: ['cleanup', 'goto', 'registration'],
  },
  {
    id: 'lx-ch06-c-062',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Three-Resource Cascading Cleanup',
    prompt: `Write init that acquires three resources in order: p1 = kmalloc(64), p2 = kmalloc(64), p3 = kmalloc(64), all GFP_KERNEL. Any allocation may fail with -ENOMEM. Use a cascading goto-error ladder (err_p3 frees p2,p1 — wait: design labels so each frees exactly the resources acquired before the failure point). On success print "all ok\\n" and return 0. exit frees p3,p2,p1.`,
    hints: [
      'Each label undoes the resources that succeeded BEFORE the failing step.',
      'Set freed pointers to NULL if exit may also free them.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *p1, *p2, *p3;

static int __init t_init(void)
{
    p1 = kmalloc(64, GFP_KERNEL);
    if (!p1)
        goto err1;

    p2 = kmalloc(64, GFP_KERNEL);
    if (!p2)
        goto err2;

    p3 = kmalloc(64, GFP_KERNEL);
    if (!p3)
        goto err3;

    printk(KERN_INFO "all ok\\n");
    return 0;

err3:
    kfree(p2);
    p2 = NULL;
err2:
    kfree(p1);
    p1 = NULL;
err1:
    return -ENOMEM;
}

static void __exit t_exit(void)
{
    kfree(p3);
    kfree(p2);
    kfree(p1);
}

module_init(t_init);
module_exit(t_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

static char *p1, *p2, *p3;

static int __init t_init(void)
{
    // TODO: allocate p1, p2, p3 (64 bytes each, GFP_KERNEL)
    // TODO: cascading goto cleanup; -ENOMEM on any failure
    // TODO: print "all ok"; return 0
    return 0;
}

static void __exit t_exit(void)
{
    // TODO: free p3, p2, p1
}

module_init(t_init);
module_exit(t_exit);
MODULE_LICENSE("GPL");`,
    tags: ['cleanup', 'goto', 'kmalloc'],
  },
  {
    id: 'lx-ch06-c-063',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parameter-Driven Allocation Size',
    prompt: `Add an unsigned int parameter "n" (default 16, mode 0444) controlling how many int entries to allocate. In init, validate 1 <= n <= 1024 (else -EINVAL with a KERN_ERR message). Then allocate an int array of n elements with kmalloc_array(n, sizeof(int), GFP_KERNEL); on failure return -ENOMEM. Fill entry i with i*i. Print "filled %u entries\\n". exit frees the array.`,
    hints: [
      'kmalloc_array guards against multiplication overflow.',
      'Validate the parameter before allocating.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>
#include <linux/moduleparam.h>

static unsigned int n = 16;
module_param(n, uint, 0444);
MODULE_PARM_DESC(n, "number of int entries (1..1024)");

static int *arr;

static int __init pa_init(void)
{
    unsigned int i;

    if (n < 1 || n > 1024) {
        printk(KERN_ERR "n=%u out of range\\n", n);
        return -EINVAL;
    }

    arr = kmalloc_array(n, sizeof(int), GFP_KERNEL);
    if (!arr)
        return -ENOMEM;

    for (i = 0; i < n; i++)
        arr[i] = i * i;

    printk(KERN_INFO "filled %u entries\\n", n);
    return 0;
}

static void __exit pa_exit(void)
{
    kfree(arr);
}

module_init(pa_init);
module_exit(pa_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>
#include <linux/moduleparam.h>

static unsigned int n = 16;
// TODO: module_param uint 0444, describe

static int *arr;

static int __init pa_init(void)
{
    // TODO: validate 1..1024 (-EINVAL); kmalloc_array; -ENOMEM on fail
    // TODO: arr[i] = i*i; print "filled <n> entries"
    return 0;
}

static void __exit pa_exit(void)
{
    // TODO: free arr
}

module_init(pa_init);
module_exit(pa_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module_param', 'kmalloc_array', 'cleanup'],
  },
  {
    id: 'lx-ch06-c-064',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Module Init Honoring -ERESTARTSYS Pattern',
    prompt: `Write init that calls a helper "int do_setup(void)" which may return 0, -ENOMEM, or -EIO. Map the result: on 0 print "setup ok\\n" and return 0; on any negative error, print "setup failed: %d\\n" at KERN_ERR with the errno and return that SAME negative value so insmod reports it. Do not translate the errno; propagate it verbatim.`,
    hints: [
      'Capture the helper return value and propagate it unchanged.',
      'insmod surfaces the negative errno returned by init.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern int do_setup(void);

static int __init es_init(void)
{
    int ret = do_setup();

    if (ret) {
        printk(KERN_ERR "setup failed: %d\\n", ret);
        return ret;
    }

    printk(KERN_INFO "setup ok\\n");
    return 0;
}

static void __exit es_exit(void) {}

module_init(es_init);
module_exit(es_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

extern int do_setup(void);

static int __init es_init(void)
{
    // TODO: call do_setup(); on error print "setup failed: <ret>" and return ret
    // TODO: on success print "setup ok"; return 0
    return 0;
}

static void __exit es_exit(void) {}

module_init(es_init);
module_exit(es_exit);
MODULE_LICENSE("GPL");`,
    tags: ['errno', 'init', 'module'],
  },
  {
    id: 'lx-ch06-c-065',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Export A Struct Of Function Pointers',
    prompt: `Define a struct "struct ops { int (*add)(int, int); int (*sub)(int, int); };". Implement two static functions op_add and op_sub. Define a non-static "struct ops my_ops = { .add = op_add, .sub = op_sub };" and EXPORT_SYMBOL(my_ops) so other modules can call through it. init prints "ops ready\\n".`,
    hints: [
      'You can EXPORT_SYMBOL a variable, not just a function.',
      'Use designated initializers to fill the function-pointer struct.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

struct ops {
    int (*add)(int, int);
    int (*sub)(int, int);
};

static int op_add(int a, int b) { return a + b; }
static int op_sub(int a, int b) { return a - b; }

struct ops my_ops = {
    .add = op_add,
    .sub = op_sub,
};
EXPORT_SYMBOL(my_ops);

static int __init o_init(void)
{
    printk(KERN_INFO "ops ready\\n");
    return 0;
}

static void __exit o_exit(void) {}

module_init(o_init);
module_exit(o_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

struct ops {
    int (*add)(int, int);
    int (*sub)(int, int);
};

// TODO: static op_add, op_sub
// TODO: non-static struct ops my_ops = { ... }; EXPORT_SYMBOL(my_ops)

static int __init o_init(void)
{
    printk(KERN_INFO "ops ready\\n");
    return 0;
}

static void __exit o_exit(void) {}

module_init(o_init);
module_exit(o_exit);
MODULE_LICENSE("GPL");`,
    tags: ['export_symbol', 'function-pointer', 'struct'],
  },
  {
    id: 'lx-ch06-c-066',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Permanent Module: No Exit Handler',
    prompt: `Write a module that intentionally cannot be unloaded. Provide only module_init (it prints "permanent module\\n" and returns 0) and NO module_exit at all. In a comment, explain what rmmod will report for a module with no exit function and why that is the intended behavior.`,
    hints: [
      'A module without module_exit is treated as non-removable.',
      'rmmod refuses with "Device or resource busy"/EBUSY-style error.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init perm_init(void)
{
    printk(KERN_INFO "permanent module\\n");
    return 0;
}

/* No module_exit() is registered. The kernel marks this module as
 * non-removable, so rmmod fails (the module cannot be unloaded). */
module_init(perm_init);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

static int __init perm_init(void)
{
    // TODO: print "permanent module"; return 0
    return 0;
}

// TODO: register only module_init (no exit); set license`,
    tags: ['module_init', 'unloadable', 'module'],
  },
  {
    id: 'lx-ch06-c-067',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'modprobe Dependency Via softdep',
    prompt: `A module "client" requires another module "provider" to be loaded first. Add a MODULE_SOFTDEP declaration so modprobe pulls in provider before client. The init should print "client up\\n". Use MODULE_SOFTDEP("pre: provider"). In a comment, explain the difference between a soft dependency and a hard symbol dependency.`,
    hints: [
      'MODULE_SOFTDEP("pre: name") asks modprobe to load name first.',
      'A symbol dependency is enforced by the linker; softdep is advisory ordering.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

/* Soft dep is advisory: modprobe loads 'provider' first, but unlike a
 * symbol (hard) dependency it is not enforced by the module linker. */
MODULE_SOFTDEP("pre: provider");

static int __init cl_init(void)
{
    printk(KERN_INFO "client up\\n");
    return 0;
}

static void __exit cl_exit(void) {}

module_init(cl_init);
module_exit(cl_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: MODULE_SOFTDEP to load 'provider' before this module

static int __init cl_init(void)
{
    // TODO: print "client up"
    return 0;
}

static void __exit cl_exit(void) {}

module_init(cl_init);
module_exit(cl_exit);
MODULE_LICENSE("GPL");`,
    tags: ['modprobe', 'softdep', 'module'],
  },
  {
    id: 'lx-ch06-c-068',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parameter Callback With param_ops',
    prompt: `Expose a parameter "level" using module_param_cb with a custom set callback that validates the value. Implement "static int set_level(const char *val, const struct kernel_param *kp)" that parses with kstrtoint, rejects values outside 0..9 with -EINVAL, and on success stores via *(int *)kp->arg. Use param_get_int for the get side. Register with module_param_cb(level, &level_ops, &level, 0644).`,
    hints: [
      'Build a struct kernel_param_ops with .set and .get.',
      'kp->arg points at the backing variable; kstrtoint parses the string.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int level;

static int set_level(const char *val, const struct kernel_param *kp)
{
    int v, ret;

    ret = kstrtoint(val, 0, &v);
    if (ret)
        return ret;
    if (v < 0 || v > 9)
        return -EINVAL;

    *(int *)kp->arg = v;
    return 0;
}

static const struct kernel_param_ops level_ops = {
    .set = set_level,
    .get = param_get_int,
};

module_param_cb(level, &level_ops, &level, 0644);
MODULE_PARM_DESC(level, "verbosity 0..9");

static int __init cb_init(void)
{
    printk(KERN_INFO "level=%d\\n", level);
    return 0;
}

static void __exit cb_exit(void) {}

module_init(cb_init);
module_exit(cb_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int level;

static int set_level(const char *val, const struct kernel_param *kp)
{
    // TODO: kstrtoint, reject <0 or >9 with -EINVAL, store via kp->arg
    return 0;
}

static const struct kernel_param_ops level_ops = {
    .set = set_level,
    .get = param_get_int,
};

// TODO: module_param_cb(level, &level_ops, &level, 0644) + MODULE_PARM_DESC

static int __init cb_init(void)
{
    printk(KERN_INFO "level=%d\\n", level);
    return 0;
}

static void __exit cb_exit(void) {}

module_init(cb_init);
module_exit(cb_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module_param_cb', 'kernel_param_ops', 'validation'],
  },
  {
    id: 'lx-ch06-c-069',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Init Order Of Two Subsystems With Rollback',
    prompt: `Write init that allocates a buffer (kmalloc 512, GFP_KERNEL) and then calls register_thing() (returns 0 or negative errno). If kmalloc fails, return -ENOMEM. If register_thing fails, free the buffer and return register_thing's error. Use goto labels. On success print "up\\n" and return 0. exit unregisters then frees. Ensure no path frees the buffer twice or unregisters something that never registered.`,
    hints: [
      'Allocate first, register second; unwind in reverse.',
      'NULL the freed pointer so exit (if reached) cannot double-free.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

extern int register_thing(void);
extern void unregister_thing(void);

static char *buf;

static int __init io_init(void)
{
    int ret;

    buf = kmalloc(512, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;

    ret = register_thing();
    if (ret)
        goto err_reg;

    printk(KERN_INFO "up\\n");
    return 0;

err_reg:
    kfree(buf);
    buf = NULL;
    return ret;
}

static void __exit io_exit(void)
{
    unregister_thing();
    kfree(buf);
}

module_init(io_init);
module_exit(io_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>

extern int register_thing(void);
extern void unregister_thing(void);

static char *buf;

static int __init io_init(void)
{
    // TODO: kmalloc 512 (-ENOMEM on fail)
    // TODO: register_thing(); on fail free buf, NULL it, return error
    // TODO: print "up"; return 0
    return 0;
}

static void __exit io_exit(void)
{
    // TODO: unregister_thing then free buf
}

module_init(io_init);
module_exit(io_exit);
MODULE_LICENSE("GPL");`,
    tags: ['cleanup', 'goto', 'registration'],
  },
  {
    id: 'lx-ch06-c-070',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Versioned API With Exported Getter',
    prompt: `Build a provider module that keeps a private static struct holding a version number and a hit counter. Export TWO functions: "unsigned int api_version(void)" returning a fixed version (e.g. 0x010200) and "void api_hit(void)" incrementing the counter. Both use EXPORT_SYMBOL_GPL. Keep the struct static (not exported). init prints "api %u.%u.%u\\n" decoding the version bytes; exit prints "hits=%u\\n".`,
    hints: [
      'Keep internal state static; export only the accessor functions.',
      'Decode 0x010200 as major=byte2, minor=byte1, patch=byte0.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

#define API_VER 0x010200u

static struct {
    unsigned int version;
    unsigned int hits;
} api_state = { .version = API_VER, .hits = 0 };

unsigned int api_version(void)
{
    return api_state.version;
}
EXPORT_SYMBOL_GPL(api_version);

void api_hit(void)
{
    api_state.hits++;
}
EXPORT_SYMBOL_GPL(api_hit);

static int __init api_init(void)
{
    unsigned int v = api_state.version;

    printk(KERN_INFO "api %u.%u.%u\\n",
           (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff);
    return 0;
}

static void __exit api_exit(void)
{
    printk(KERN_INFO "hits=%u\\n", api_state.hits);
}

module_init(api_init);
module_exit(api_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

#define API_VER 0x010200u

static struct {
    unsigned int version;
    unsigned int hits;
} api_state = { .version = API_VER, .hits = 0 };

// TODO: unsigned int api_version(void) -> version; EXPORT_SYMBOL_GPL
// TODO: void api_hit(void) -> hits++;    EXPORT_SYMBOL_GPL

static int __init api_init(void)
{
    // TODO: print "api M.m.p" decoding the version bytes
    return 0;
}

static void __exit api_exit(void)
{
    // TODO: print "hits=<hits>"
}

module_init(api_init);
module_exit(api_exit);
MODULE_LICENSE("GPL");`,
    tags: ['export_symbol_gpl', 'state', 'module'],
  },
]

export default problems
