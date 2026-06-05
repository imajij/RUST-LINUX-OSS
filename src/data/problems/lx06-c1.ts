import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch06-c-001',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Hello Module With Init And Exit',
    prompt: `Write a complete loadable kernel module. Define an init function that returns 0 and an exit function that returns nothing. Register them with module_init and module_exit, and set MODULE_LICENSE("GPL"). In init print "hello: loaded\\n" and in exit print "hello: unloaded\\n" using pr_info.`,
    hints: [
      'Include linux/module.h, linux/kernel.h, and linux/init.h.',
      'An init returns int (0 on success); an exit returns void.',
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
    // TODO: print "hello: unloaded"
}

// TODO: register init and exit, set the license`,
    tags: ['module', 'init', 'basics'],
  },
  {
    id: 'lx-ch06-c-002',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Set The Required MODULE Macros',
    prompt: `Add the standard descriptive metadata to a module. After the module_init/module_exit lines, set MODULE_LICENSE to "GPL", MODULE_AUTHOR to "Jane Doe", MODULE_DESCRIPTION to "A demo module", and MODULE_VERSION to "1.0". Only write those four macro lines.`,
    hints: [
      'Each macro takes a single string literal argument.',
      'MODULE_LICENSE controls whether the kernel is marked tainted.',
    ],
    solution: `MODULE_LICENSE("GPL");
MODULE_AUTHOR("Jane Doe");
MODULE_DESCRIPTION("A demo module");
MODULE_VERSION("1.0");`,
    starter: `// TODO: license must be a recognized string such as "GPL"
// TODO: author, description, version`,
    tags: ['module', 'metadata', 'macros'],
  },
  {
    id: 'lx-ch06-c-003',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Annotate Init And Exit Sections',
    prompt: `Take a hello module and add the proper section annotations. The init function must be marked __init and the exit function must be marked __exit. Write both full function definitions (they can be empty bodies that return 0 / nothing) with the annotations in the correct position.`,
    hints: [
      '__init goes between the storage class/return type and the function name.',
      'Code in an __init section is freed by the kernel after init runs.',
    ],
    solution: `static int __init demo_init(void)
{
    return 0;
}

static void __exit demo_exit(void)
{
}`,
    starter: `static int demo_init(void)   // TODO: add __init
{
    return 0;
}

static void demo_exit(void)  // TODO: add __exit
{
}`,
    tags: ['module', 'init', 'exit'],
  },
  {
    id: 'lx-ch06-c-004',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print With An Explicit Log Level',
    prompt: `Inside an init function, emit three messages at three different log levels using printk with explicit KERN_ level macros: an informational line "drv: starting\\n" at KERN_INFO, a warning "drv: degraded mode\\n" at KERN_WARNING, and an error "drv: bad state\\n" at KERN_ERR. Write only the three printk statements.`,
    hints: [
      'The level macro is concatenated to the format string: printk(KERN_INFO "...").',
      'There is no comma between the level macro and the format string.',
    ],
    solution: `printk(KERN_INFO "drv: starting\\n");
printk(KERN_WARNING "drv: degraded mode\\n");
printk(KERN_ERR "drv: bad state\\n");`,
    starter: `// TODO: KERN_INFO message
// TODO: KERN_WARNING message
// TODO: KERN_ERR message`,
    tags: ['printk', 'logging', 'loglevel'],
  },
  {
    id: 'lx-ch06-c-005',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Use The pr_ Convenience Macros',
    prompt: `Rewrite logging to use the pr_* helpers instead of raw printk. Write four statements: pr_info for "ok\\n", pr_warn for "low memory\\n", pr_err for "device missing\\n", and pr_debug for "entering probe\\n". Write only the four statements.`,
    hints: [
      'pr_info, pr_warn, pr_err, and pr_debug wrap printk with a fixed level.',
      'pr_debug output only appears when DEBUG is defined or via dynamic debug.',
    ],
    solution: `pr_info("ok\\n");
pr_warn("low memory\\n");
pr_err("device missing\\n");
pr_debug("entering probe\\n");`,
    starter: `// TODO: pr_info "ok"
// TODO: pr_warn "low memory"
// TODO: pr_err "device missing"
// TODO: pr_debug "entering probe"`,
    tags: ['printk', 'logging', 'macros'],
  },
  {
    id: 'lx-ch06-c-006',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Integer And String Values',
    prompt: `Write a single pr_info call that formats both an int and a C string. Given variables "int count = 5;" and "const char *name = \\"eth0\\";", print the line: name=eth0 count=5 followed by a newline. Write the variable declarations and the pr_info call.`,
    hints: [
      'printk uses printf-style conversions: %d for int, %s for a string.',
      'Always end kernel log lines with \\n.',
    ],
    solution: `int count = 5;
const char *name = "eth0";

pr_info("name=%s count=%d\\n", name, count);`,
    starter: `int count = 5;
const char *name = "eth0";

// TODO: pr_info printing "name=eth0 count=5"`,
    tags: ['printk', 'logging', 'format'],
  },
  {
    id: 'lx-ch06-c-007',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Single-Object Kbuild Makefile',
    prompt: `Write a Kbuild Makefile for an out-of-tree module built from hello.c into hello.ko. Add hello.o to obj-m. Provide a "default" target that runs the kernel build system with -C pointing at the running kernel's build tree and M set to the current directory building the "modules" target, and a "clean" target that runs the same with the "clean" target.`,
    hints: [
      'obj-m += hello.o tells Kbuild to produce hello.ko from hello.c.',
      'The kernel build tree is at /lib/modules/$(shell uname -r)/build.',
    ],
    solution: `obj-m += hello.o

KDIR ?= /lib/modules/$(shell uname -r)/build

default:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    starter: `# TODO: add hello.o to obj-m

KDIR ?= /lib/modules/$(shell uname -r)/build

default:
	# TODO: build modules via the kernel build system

clean:
	# TODO: clean via the kernel build system`,
    tags: ['kbuild', 'makefile', 'module'],
  },
  {
    id: 'lx-ch06-c-008',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Init That Reports A Build Constant',
    prompt: `Write an __init function named info_init that prints the kernel page size at load time. Use pr_info to print "info: PAGE_SIZE=%lu\\n" with PAGE_SIZE cast to unsigned long, then return 0. Include the function only.`,
    hints: [
      'PAGE_SIZE is provided by the kernel headers (asm/page.h, pulled in widely).',
      'Cast to unsigned long and format with %lu to be safe across arches.',
    ],
    solution: `static int __init info_init(void)
{
    pr_info("info: PAGE_SIZE=%lu\\n", (unsigned long)PAGE_SIZE);
    return 0;
}`,
    starter: `static int __init info_init(void)
{
    // TODO: print PAGE_SIZE with %lu and return 0
}`,
    tags: ['module', 'init', 'printk'],
  },
  {
    id: 'lx-ch06-c-009',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Single Integer Module Parameter',
    prompt: `Declare a module parameter named "count" of type int with a default value of 1, and expose it as read-only to nobody (permission 0). Use module_param. Write only the variable definition and the module_param line.`,
    hints: [
      'module_param(name, type, perm) ties a static variable to a load-time parameter.',
      'A perm of 0 means the parameter is not visible under /sys/module.',
    ],
    solution: `static int count = 1;
module_param(count, int, 0);`,
    starter: `static int count = 1;
// TODO: declare module_param for count with permission 0`,
    tags: ['module', 'param', 'module_param'],
  },
  {
    id: 'lx-ch06-c-010',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Describe A Module Parameter',
    prompt: `Given a parameter "static int debug_level = 0;" declared with module_param(debug_level, int, 0644), add a human-readable description with MODULE_PARM_DESC that reads "Verbosity level (0-3)". Write the module_param line and the MODULE_PARM_DESC line.`,
    hints: [
      'MODULE_PARM_DESC takes the parameter name (not a string) and a description string.',
      'The description shows up in modinfo output.',
    ],
    solution: `module_param(debug_level, int, 0644);
MODULE_PARM_DESC(debug_level, "Verbosity level (0-3)");`,
    starter: `static int debug_level = 0;
module_param(debug_level, int, 0644);
// TODO: add MODULE_PARM_DESC for debug_level`,
    tags: ['module', 'param', 'modinfo'],
  },
  {
    id: 'lx-ch06-c-011',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Init Returning A Negative Errno',
    prompt: `Write an __init function named maybe_init that returns -ENODEV when a variable "int present = 0;" is zero, and returns 0 otherwise. Print "maybe: no device\\n" with pr_err before failing. Include the variable and the function.`,
    hints: [
      'A nonzero return from an init function aborts insmod; use a negative errno.',
      'ENODEV is the conventional code for "no such device".',
    ],
    solution: `static int present = 0;

static int __init maybe_init(void)
{
    if (!present) {
        pr_err("maybe: no device\\n");
        return -ENODEV;
    }
    return 0;
}`,
    starter: `static int present = 0;

static int __init maybe_init(void)
{
    // TODO: if !present, log an error and return -ENODEV
    // TODO: otherwise return 0
}`,
    tags: ['module', 'init', 'errno'],
  },
  {
    id: 'lx-ch06-c-012',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Tag A Helper As __init',
    prompt: `Write a helper function "static int __init setup_table(void)" that returns 0, and an __init function "drv_init" that calls it and returns its result. Functions called only from init may themselves live in the __init section. Write both functions.`,
    hints: [
      'A function called only during init can be marked __init to be freed afterwards.',
      'Do not call an __init function from code that runs after init.',
    ],
    solution: `static int __init setup_table(void)
{
    return 0;
}

static int __init drv_init(void)
{
    return setup_table();
}`,
    starter: `static int __init setup_table(void)
{
    return 0;
}

static int __init drv_init(void)
{
    // TODO: call setup_table and return its result
}`,
    tags: ['module', 'init', '__init'],
  },
  {
    id: 'lx-ch06-c-013',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A charp String Parameter',
    prompt: `Declare a module parameter named "devname" of type charp (char pointer) with a default of "default0", visible read-only in sysfs (0444), and described as "Device name". Print the value in an __init function "drv_init" using pr_info "drv: devname=%s\\n", then return 0. Write the variable, module_param, MODULE_PARM_DESC, and the init function.`,
    hints: [
      'The charp parameter type stores a pointer into the kernel command line / insmod args.',
      'Do not modify or free a charp default at runtime; treat it as borrowed.',
    ],
    solution: `static char *devname = "default0";
module_param(devname, charp, 0444);
MODULE_PARM_DESC(devname, "Device name");

static int __init drv_init(void)
{
    pr_info("drv: devname=%s\\n", devname);
    return 0;
}`,
    starter: `static char *devname = "default0";
// TODO: module_param of type charp, perm 0444
// TODO: MODULE_PARM_DESC

static int __init drv_init(void)
{
    // TODO: print devname and return 0
}`,
    tags: ['module', 'param', 'charp'],
  },
  {
    id: 'lx-ch06-c-014',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Boolean Module Parameter',
    prompt: `Declare a bool module parameter named "verbose" defaulting to false with permission 0644 and description "Enable verbose logging". In an __init function "drv_init", if verbose is true print "drv: verbose on\\n" with pr_info, then always return 0. Write the variable, parameter macros, and the init function.`,
    hints: [
      'Use the bool type for on/off flags; the variable should be declared bool.',
      'bool params accept Y/N/1/0/true/false on the insmod command line.',
    ],
    solution: `static bool verbose = false;
module_param(verbose, bool, 0644);
MODULE_PARM_DESC(verbose, "Enable verbose logging");

static int __init drv_init(void)
{
    if (verbose)
        pr_info("drv: verbose on\\n");
    return 0;
}`,
    starter: `static bool verbose = false;
// TODO: module_param of type bool, perm 0644
// TODO: MODULE_PARM_DESC

static int __init drv_init(void)
{
    // TODO: if verbose, log; always return 0
}`,
    tags: ['module', 'param', 'bool'],
  },
  {
    id: 'lx-ch06-c-015',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'An Array Module Parameter',
    prompt: `Declare an int array module parameter named "ids" with capacity 4 and a variable "static int ids_count;" that receives how many values the user supplied. Use module_param_array with permission 0644. In "drv_init", loop ids_count times and pr_info each value as "drv: id[%d]=%d\\n", then return 0. Write the declarations and the init function.`,
    hints: [
      'module_param_array(name, type, &count_var, perm) fills count_var with the number parsed.',
      'Only iterate up to the supplied count, not the full array capacity.',
    ],
    solution: `static int ids[4];
static int ids_count;
module_param_array(ids, int, &ids_count, 0644);

static int __init drv_init(void)
{
    int i;

    for (i = 0; i < ids_count; i++)
        pr_info("drv: id[%d]=%d\\n", i, ids[i]);
    return 0;
}`,
    starter: `static int ids[4];
static int ids_count;
// TODO: module_param_array for ids, int, &ids_count, 0644

static int __init drv_init(void)
{
    // TODO: loop ids_count times and print each id; return 0
}`,
    tags: ['module', 'param', 'array'],
  },
  {
    id: 'lx-ch06-c-016',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Export A Symbol For Other Modules',
    prompt: `Write a function "int adder_add(int a, int b)" that returns a + b, and export it so other modules can link against it using EXPORT_SYMBOL. The function must NOT be static. Write the function and the export line.`,
    hints: [
      'EXPORT_SYMBOL(name) adds the symbol to the kernel symbol table.',
      'An exported symbol must have external linkage (not static).',
    ],
    solution: `int adder_add(int a, int b)
{
    return a + b;
}
EXPORT_SYMBOL(adder_add);`,
    starter: `int adder_add(int a, int b)
{
    // TODO: return a + b
}
// TODO: export adder_add`,
    tags: ['module', 'export_symbol', 'symbols'],
  },
  {
    id: 'lx-ch06-c-017',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Export A Symbol GPL-Only',
    prompt: `Write a non-static function "void adder_reset(int *acc)" that sets *acc to 0, and export it so that only GPL-licensed modules may use it. Use the GPL-restricted export variant. Write the function and the export line.`,
    hints: [
      'EXPORT_SYMBOL_GPL restricts the symbol to modules declaring a GPL-compatible license.',
      'A non-GPL module that uses a GPL-only symbol will fail to load.',
    ],
    solution: `void adder_reset(int *acc)
{
    *acc = 0;
}
EXPORT_SYMBOL_GPL(adder_reset);`,
    starter: `void adder_reset(int *acc)
{
    // TODO: set *acc to 0
}
// TODO: export adder_reset for GPL modules only`,
    tags: ['module', 'export_symbol', 'gpl'],
  },
  {
    id: 'lx-ch06-c-018',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Declare An Imported Symbol',
    prompt: `In a consumer module, you want to call adder_add exported by another module. Add the extern prototype "int adder_add(int a, int b);" and write an __init function "use_init" that prints "use: 2+3=%d\\n" with the result of adder_add(2, 3), then returns 0. Write the prototype and the init function.`,
    hints: [
      'The consumer needs a matching prototype; usually it lives in a shared header.',
      'The provider module must be loaded first so the symbol resolves.',
    ],
    solution: `extern int adder_add(int a, int b);

static int __init use_init(void)
{
    pr_info("use: 2+3=%d\\n", adder_add(2, 3));
    return 0;
}`,
    starter: `// TODO: extern prototype for adder_add

static int __init use_init(void)
{
    // TODO: print result of adder_add(2, 3); return 0
}`,
    tags: ['module', 'export_symbol', 'extern'],
  },
  {
    id: 'lx-ch06-c-019',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Two-Object Module Makefile',
    prompt: `Write a Kbuild Makefile that builds one module mydrv.ko from two source files main.c and helper.c. Set obj-m to mydrv.o and tell Kbuild that mydrv.o is composed of main.o and helper.o. Keep the standard default/clean targets invoking the kernel build system.`,
    hints: [
      'Use mydrv-objs (or mydrv-y) to list the component object files of a multi-file module.',
      'The component names must differ from the final module name.',
    ],
    solution: `obj-m += mydrv.o
mydrv-objs := main.o helper.o

KDIR ?= /lib/modules/$(shell uname -r)/build

default:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    starter: `obj-m += mydrv.o
# TODO: declare mydrv as built from main.o and helper.o

KDIR ?= /lib/modules/$(shell uname -r)/build

default:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    tags: ['kbuild', 'makefile', 'multi-file'],
  },
  {
    id: 'lx-ch06-c-020',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate A Parameter In Init',
    prompt: `A module has "static int slots = 8;" registered with module_param. Write an __init function "drv_init" that rejects an out-of-range value: if slots is less than 1 or greater than 64, print "drv: bad slots=%d\\n" with pr_err and return -EINVAL; otherwise print "drv: slots=%d\\n" and return 0. Write the init function.`,
    hints: [
      'Validate user-supplied parameters in init before relying on them.',
      'EINVAL is the conventional code for an invalid argument.',
    ],
    solution: `static int __init drv_init(void)
{
    if (slots < 1 || slots > 64) {
        pr_err("drv: bad slots=%d\\n", slots);
        return -EINVAL;
    }
    pr_info("drv: slots=%d\\n", slots);
    return 0;
}`,
    starter: `static int __init drv_init(void)
{
    // TODO: reject slots outside [1, 64] with -EINVAL
    // TODO: otherwise log and return 0
}`,
    tags: ['module', 'param', 'validation'],
  },
  {
    id: 'lx-ch06-c-021',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate And Free Across Init/Exit',
    prompt: `Write a module that allocates a 256-byte buffer in init and frees it in exit. Declare "static char *buf;". In __init "drv_init", kmalloc 256 bytes with GFP_KERNEL; if it fails return -ENOMEM, else return 0. In __exit "drv_exit", kfree(buf). Write both functions and the global.`,
    hints: [
      'GFP_KERNEL is the normal allocation flag and may sleep; fine in init context.',
      'kfree(NULL) is safe, but here buf is only freed when allocation succeeded.',
    ],
    solution: `static char *buf;

static int __init drv_init(void)
{
    buf = kmalloc(256, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;
    return 0;
}

static void __exit drv_exit(void)
{
    kfree(buf);
}`,
    starter: `static char *buf;

static int __init drv_init(void)
{
    // TODO: kmalloc 256 bytes GFP_KERNEL; return -ENOMEM on failure; else 0
}

static void __exit drv_exit(void)
{
    // TODO: free buf
}`,
    tags: ['module', 'kmalloc', 'cleanup'],
  },
  {
    id: 'lx-ch06-c-022',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two-Step Init With Goto Unwind',
    prompt: `Write an __init function "drv_init" that does two allocations and unwinds correctly on failure using goto labels. Globals: "static char *a; static char *b;". kmalloc 64 bytes into a (GFP_KERNEL); on failure return -ENOMEM. Then kmalloc 64 into b; on failure free a and return -ENOMEM. On success return 0. Use exactly one error label named err_a. Write the globals and the function.`,
    hints: [
      'Reverse-order cleanup: the second failure must undo the first allocation.',
      'goto-based unwinding keeps a single, readable cleanup path.',
    ],
    solution: `static char *a;
static char *b;

static int __init drv_init(void)
{
    a = kmalloc(64, GFP_KERNEL);
    if (!a)
        return -ENOMEM;

    b = kmalloc(64, GFP_KERNEL);
    if (!b)
        goto err_a;

    return 0;

err_a:
    kfree(a);
    return -ENOMEM;
}`,
    starter: `static char *a;
static char *b;

static int __init drv_init(void)
{
    // TODO: alloc a; on failure return -ENOMEM
    // TODO: alloc b; on failure goto err_a
    // TODO: success returns 0
err_a:
    // TODO: free a and return -ENOMEM
}`,
    tags: ['module', 'init', 'goto'],
  },
  {
    id: 'lx-ch06-c-023',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Three-Stage Init Unwind',
    prompt: `Write an __init "drv_init" with three steps that each can fail, using cascading goto labels for cleanup. Step 1: a = kmalloc(32, GFP_KERNEL), on fail return -ENOMEM. Step 2: b = kmalloc(32, GFP_KERNEL), on fail goto err_a. Step 3: call "int reg(void)" which returns an errno (0 on success); store it in ret, and on nonzero goto err_b. Return 0 on success. Labels err_b frees b then falls into err_a which frees a and returns ret. Provide globals a, b and an int ret. Assume reg() is declared elsewhere.`,
    hints: [
      'Labels are ordered so each one undoes exactly the resource acquired before it.',
      'Let err_b fall through into err_a to avoid duplicating kfree(a).',
    ],
    solution: `static char *a;
static char *b;

static int __init drv_init(void)
{
    int ret;

    a = kmalloc(32, GFP_KERNEL);
    if (!a)
        return -ENOMEM;

    b = kmalloc(32, GFP_KERNEL);
    if (!b) {
        ret = -ENOMEM;
        goto err_a;
    }

    ret = reg();
    if (ret)
        goto err_b;

    return 0;

err_b:
    kfree(b);
err_a:
    kfree(a);
    return ret;
}`,
    starter: `static char *a;
static char *b;

static int __init drv_init(void)
{
    int ret;

    // TODO: alloc a (fail -> return -ENOMEM)
    // TODO: alloc b (fail -> ret=-ENOMEM, goto err_a)
    // TODO: ret = reg(); if nonzero goto err_b
    // TODO: return 0
err_b:
    // TODO: free b
err_a:
    // TODO: free a; return ret
}`,
    tags: ['module', 'init', 'goto'],
  },
  {
    id: 'lx-ch06-c-024',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Symmetric Init And Exit Cleanup',
    prompt: `A module acquires two resources in init (via "int acquire_a(void)" and "int acquire_b(void)", each returning 0 or an errno) and must release them in exit (via "void release_a(void)" and "void release_b(void)"). Write __init "drv_init" that calls acquire_a then acquire_b, unwinding acquire_a if acquire_b fails (using goto), and __exit "drv_exit" that releases in reverse order: b then a. Assume all four helpers are declared elsewhere.`,
    hints: [
      'The exit path should mirror init in reverse: last acquired is first released.',
      'Only the init failure path needs goto; exit always releases everything.',
    ],
    solution: `static int __init drv_init(void)
{
    int ret;

    ret = acquire_a();
    if (ret)
        return ret;

    ret = acquire_b();
    if (ret)
        goto err_a;

    return 0;

err_a:
    release_a();
    return ret;
}

static void __exit drv_exit(void)
{
    release_b();
    release_a();
}`,
    starter: `static int __init drv_init(void)
{
    int ret;

    // TODO: acquire_a; on fail return ret
    // TODO: acquire_b; on fail goto err_a
    // TODO: return 0
err_a:
    // TODO: release_a; return ret
}

static void __exit drv_exit(void)
{
    // TODO: release b then a
}`,
    tags: ['module', 'cleanup', 'goto'],
  },
  {
    id: 'lx-ch06-c-025',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use The pr_fmt Prefix Convention',
    prompt: `Configure a module so every pr_* line is automatically prefixed with "mydrv: ". Define the pr_fmt macro before including linux/kernel.h so it expands to "mydrv: " concatenated with the original format, then write an __init "drv_init" that calls pr_info("loaded\\n") and returns 0. Write the #define, the include, and the function.`,
    hints: [
      'Define pr_fmt(fmt) as "mydrv: " fmt before the kernel headers are pulled in.',
      'pr_fmt only affects the pr_* helpers, not raw printk calls.',
    ],
    solution: `#define pr_fmt(fmt) "mydrv: " fmt

#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>

static int __init drv_init(void)
{
    pr_info("loaded\\n");
    return 0;
}`,
    starter: `// TODO: define pr_fmt to prefix "mydrv: "

#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>

static int __init drv_init(void)
{
    // TODO: pr_info("loaded"); return 0
}`,
    tags: ['printk', 'pr_fmt', 'logging'],
  },
  {
    id: 'lx-ch06-c-026',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Rate-Limited Logging In A Hot Path',
    prompt: `A function "void on_event(void)" may be called very frequently and you want to log without flooding the kernel log. Write on_event so it logs "drv: event\\n" using the rate-limited printk helper that throttles repeated messages. Write only the function.`,
    hints: [
      'pr_info_ratelimited applies the default rate limiter to the message.',
      'Rate limiting prevents log floods from high-frequency events.',
    ],
    solution: `void on_event(void)
{
    pr_info_ratelimited("drv: event\\n");
}`,
    starter: `void on_event(void)
{
    // TODO: log "drv: event" with a rate-limited pr_info
}`,
    tags: ['printk', 'ratelimit', 'logging'],
  },
  {
    id: 'lx-ch06-c-027',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print Once During The Module Lifetime',
    prompt: `Write a function "void warn_legacy(void)" that emits the warning "drv: legacy path used\\n" only the first time it is called, no matter how many times the function runs. Use the kernel helper that logs a message a single time. Write only the function.`,
    hints: [
      'pr_warn_once logs the message exactly once and is cheap on later calls.',
      'The _once helpers keep a static boolean guard internally.',
    ],
    solution: `void warn_legacy(void)
{
    pr_warn_once("drv: legacy path used\\n");
}`,
    starter: `void warn_legacy(void)
{
    // TODO: log the warning only once
}`,
    tags: ['printk', 'logging', 'once'],
  },
  {
    id: 'lx-ch06-c-028',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use __exit_p For An Exit Pointer',
    prompt: `A module references its exit function by pointer in module_exit. Given "static void __exit drv_exit(void) { }", register init "drv_init" with module_init and register the exit function with module_exit using the __exit_p wrapper so the reference is dropped when modules are built-in. Write the exit function stub and the two registration lines.`,
    hints: [
      'module_exit already handles this for you, but __exit_p makes the pattern explicit.',
      'When a module is built into the kernel, __exit code is discarded entirely.',
    ],
    solution: `static void __exit drv_exit(void)
{
}

module_init(drv_init);
module_exit(drv_exit);`,
    starter: `static void __exit drv_exit(void)
{
}

// TODO: register drv_init with module_init
// TODO: register drv_exit with module_exit`,
    tags: ['module', 'exit', '__exit'],
  },
  {
    id: 'lx-ch06-c-029',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read-Only Vs Writable Param Permissions',
    prompt: `Declare two int module parameters: "ro_val" with default 1 that is world-readable but not writable via sysfs (0444), and "rw_val" with default 2 that is readable by all and writable only by root (0644). Write both variable definitions and both module_param lines.`,
    hints: [
      'The permission argument is the mode of the file under /sys/module/<m>/parameters.',
      'Owner write but no group/other write is octal 0644; read-only is 0444.',
    ],
    solution: `static int ro_val = 1;
module_param(ro_val, int, 0444);

static int rw_val = 2;
module_param(rw_val, int, 0644);`,
    starter: `static int ro_val = 1;
// TODO: module_param ro_val, int, read-only (0444)

static int rw_val = 2;
// TODO: module_param rw_val, int, root-writable (0644)`,
    tags: ['module', 'param', 'permissions'],
  },
  {
    id: 'lx-ch06-c-030',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Named Param With A Different Variable',
    prompt: `Expose a parameter to userspace under the name "buffer_size" while the C variable is named "bufsz" (default 4096). Use module_param_named so the sysfs/insmod name differs from the variable name, with permission 0644. Write the variable and the module_param_named line.`,
    hints: [
      'module_param_named(extname, var, type, perm) decouples the visible name from the variable.',
      'Users would write insmod m.ko buffer_size=8192 to set bufsz.',
    ],
    solution: `static int bufsz = 4096;
module_param_named(buffer_size, bufsz, int, 0644);`,
    starter: `static int bufsz = 4096;
// TODO: expose as "buffer_size" with module_param_named, perm 0644`,
    tags: ['module', 'param', 'named'],
  },
  {
    id: 'lx-ch06-c-031',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Complete Module With Param And Cleanup',
    prompt: `Write a complete module file. It has an int param "n" (default 3, perm 0644) described as "iterations". In __init "loop_init", validate that n is positive: if n <= 0, pr_err "loop: n must be > 0\\n" and return -EINVAL; else loop n times printing "loop: i=%d\\n", then return 0. __exit "loop_exit" prints "loop: bye\\n". Include all headers, registrations, and MODULE_LICENSE("GPL").`,
    hints: [
      'Pull together: includes, param + desc, validated init, exit, and metadata.',
      'A failed init means exit will NOT be called, so init must clean up after itself.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

static int n = 3;
module_param(n, int, 0644);
MODULE_PARM_DESC(n, "iterations");

static int __init loop_init(void)
{
    int i;

    if (n <= 0) {
        pr_err("loop: n must be > 0\\n");
        return -EINVAL;
    }
    for (i = 0; i < n; i++)
        pr_info("loop: i=%d\\n", i);
    return 0;
}

static void __exit loop_exit(void)
{
    pr_info("loop: bye\\n");
}

module_init(loop_init);
module_exit(loop_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/moduleparam.h>

// TODO: int param n default 3, perm 0644, described "iterations"

static int __init loop_init(void)
{
    // TODO: reject n <= 0 with -EINVAL; else loop and print; return 0
}

static void __exit loop_exit(void)
{
    // TODO: print "loop: bye"
}

// TODO: registrations and MODULE_LICENSE("GPL")`,
    tags: ['module', 'param', 'init'],
  },
  {
    id: 'lx-ch06-c-032',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Provider Module Exporting Two Symbols',
    prompt: `Write a complete provider module. Define non-static "int counter_inc(int *c) { return ++(*c); }" and "void counter_zero(int *c) { *c = 0; }". Export counter_inc with EXPORT_SYMBOL and counter_zero with EXPORT_SYMBOL_GPL. Provide an empty __init "prov_init" returning 0, an empty __exit "prov_exit", registrations, and MODULE_LICENSE("GPL"). Include the needed headers.`,
    hints: [
      'Exported functions must not be static and need external prototypes for consumers.',
      'EXPORT_SYMBOL_GPL restricts a symbol to GPL-compatible modules.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

int counter_inc(int *c)
{
    return ++(*c);
}
EXPORT_SYMBOL(counter_inc);

void counter_zero(int *c)
{
    *c = 0;
}
EXPORT_SYMBOL_GPL(counter_zero);

static int __init prov_init(void)
{
    return 0;
}

static void __exit prov_exit(void)
{
}

module_init(prov_init);
module_exit(prov_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

// TODO: counter_inc returning ++(*c), exported with EXPORT_SYMBOL
// TODO: counter_zero setting *c=0, exported with EXPORT_SYMBOL_GPL

static int __init prov_init(void)
{
    return 0;
}

static void __exit prov_exit(void)
{
}

module_init(prov_init);
module_exit(prov_exit);
MODULE_LICENSE("GPL");`,
    tags: ['module', 'export_symbol', 'provider'],
  },
  {
    id: 'lx-ch06-c-033',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Makefile Building Two Separate Modules',
    prompt: `Write a Kbuild Makefile that builds two independent modules from foo.c and bar.c, producing foo.ko and bar.ko. Add both object files to obj-m. Keep the standard default and clean targets that drive the kernel build system with M set to the current directory.`,
    hints: [
      'Each separate .o added to obj-m becomes its own .ko module.',
      'Use += twice (or list both) to add foo.o and bar.o to obj-m.',
    ],
    solution: `obj-m += foo.o
obj-m += bar.o

KDIR ?= /lib/modules/$(shell uname -r)/build

default:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    starter: `# TODO: add foo.o and bar.o to obj-m as two separate modules

KDIR ?= /lib/modules/$(shell uname -r)/build

default:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean`,
    tags: ['kbuild', 'makefile', 'modules'],
  },
  {
    id: 'lx-ch06-c-034',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Init Allocating Per-Parameter Storage',
    prompt: `A module has an int param "items" (default 8, perm 0444). In __init "drv_init", validate items is in [1, 1024] (else pr_err "drv: bad items\\n" and return -EINVAL), then kmalloc_array(items, sizeof(int), GFP_KERNEL) into "static int *table;". On allocation failure return -ENOMEM. On success return 0. In __exit "drv_exit", kfree(table). Write the param, the global, and both functions.`,
    hints: [
      'kmalloc_array guards against multiplication overflow versus kmalloc(n * size, ...).',
      'Validate the count before allocating so the size cannot be absurd.',
    ],
    solution: `static int items = 8;
module_param(items, int, 0444);

static int *table;

static int __init drv_init(void)
{
    if (items < 1 || items > 1024) {
        pr_err("drv: bad items\\n");
        return -EINVAL;
    }

    table = kmalloc_array(items, sizeof(int), GFP_KERNEL);
    if (!table)
        return -ENOMEM;

    return 0;
}

static void __exit drv_exit(void)
{
    kfree(table);
}`,
    starter: `static int items = 8;
module_param(items, int, 0444);

static int *table;

static int __init drv_init(void)
{
    // TODO: validate items in [1,1024] (-EINVAL on fail)
    // TODO: kmalloc_array(items, sizeof(int), GFP_KERNEL); -ENOMEM on fail
    // TODO: return 0
}

static void __exit drv_exit(void)
{
    // TODO: free table
}`,
    tags: ['module', 'param', 'kmalloc'],
  },
  {
    id: 'lx-ch06-c-035',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Full Module With Unwind And Metadata',
    prompt: `Write a complete module file that ties everything together. It declares a charp param "name" (default "anon", perm 0444, described "instance name"). In __init "mod_init": allocate a 128-byte buffer with kmalloc(GFP_KERNEL) into "static char *buf;" (on failure return -ENOMEM); then if strlen(name) is 0, free buf and return -EINVAL via a goto label "err_free"; on success pr_info "mod: name=%s\\n" and return 0. In __exit "mod_exit": kfree(buf) and pr_info "mod: unloaded\\n". Include all headers and set MODULE_LICENSE("GPL"), MODULE_AUTHOR("Dev"), MODULE_DESCRIPTION("Full demo").`,
    hints: [
      'Use a goto err_free label so the strlen check unwinds the kmalloc.',
      'strlen is available via linux/string.h in kernel code.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>
#include <linux/string.h>
#include <linux/moduleparam.h>

static char *name = "anon";
module_param(name, charp, 0444);
MODULE_PARM_DESC(name, "instance name");

static char *buf;

static int __init mod_init(void)
{
    buf = kmalloc(128, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;

    if (strlen(name) == 0)
        goto err_free;

    pr_info("mod: name=%s\\n", name);
    return 0;

err_free:
    kfree(buf);
    return -EINVAL;
}

static void __exit mod_exit(void)
{
    kfree(buf);
    pr_info("mod: unloaded\\n");
}

module_init(mod_init);
module_exit(mod_exit);
MODULE_LICENSE("GPL");
MODULE_AUTHOR("Dev");
MODULE_DESCRIPTION("Full demo");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/slab.h>
#include <linux/string.h>
#include <linux/moduleparam.h>

static char *name = "anon";
// TODO: module_param charp 0444 + MODULE_PARM_DESC "instance name"

static char *buf;

static int __init mod_init(void)
{
    // TODO: kmalloc 128 GFP_KERNEL into buf; -ENOMEM on fail
    // TODO: if strlen(name)==0 goto err_free
    // TODO: log name; return 0
err_free:
    // TODO: free buf; return -EINVAL
}

static void __exit mod_exit(void)
{
    // TODO: free buf; print "mod: unloaded"
}

// TODO: registrations + MODULE_LICENSE/AUTHOR/DESCRIPTION`,
    tags: ['module', 'init', 'goto'],
  },
]

export default problems
