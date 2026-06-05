import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch14-c-001',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print an Info Message',
    prompt: `Write a function void say_hello(void) that prints the line "demo: module loaded" at the KERN_INFO log level using the pr_* helper that already encodes that level. Do not hard-code the KERN_INFO prefix string yourself.`,
    hints: [
      'pr_info() already carries the KERN_INFO level.',
      'pr_* helpers take a printf-style format string.',
    ],
    solution: `#include <linux/kernel.h>
#include <linux/printk.h>

void say_hello(void)
{
    pr_info("demo: module loaded\\n");
}`,
    starter: `#include <linux/kernel.h>
#include <linux/printk.h>

void say_hello(void)
{
    // TODO: print "demo: module loaded" at info level
}`,
    tags: ['kernel', 'printk', 'pr_info'],
  },
  {
    id: 'lx-ch14-c-002',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print an Error Message',
    prompt: `Write a function void report_error(int err) that prints "demo: operation failed, err=<err>" at the error log level. Use the pr_* helper for errors and format err as a signed decimal integer.`,
    hints: [
      'pr_err() emits at KERN_ERR.',
      'Use %d for a signed int.',
    ],
    solution: `#include <linux/printk.h>

void report_error(int err)
{
    pr_err("demo: operation failed, err=%d\\n", err);
}`,
    starter: `#include <linux/printk.h>

void report_error(int err)
{
    // TODO: print the error with pr_err and %d
}`,
    tags: ['kernel', 'printk', 'pr_err'],
  },
  {
    id: 'lx-ch14-c-003',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Warning-Level Message',
    prompt: `Write a function void low_memory(unsigned long free_kb) that prints "demo: low memory: <free_kb> KB free" at the warning log level. Format free_kb with %lu.`,
    hints: [
      'pr_warn() emits at KERN_WARNING.',
      'unsigned long uses %lu.',
    ],
    solution: `#include <linux/printk.h>

void low_memory(unsigned long free_kb)
{
    pr_warn("demo: low memory: %lu KB free\\n", free_kb);
}`,
    starter: `#include <linux/printk.h>

void low_memory(unsigned long free_kb)
{
    // TODO: print a warning with pr_warn and %lu
}`,
    tags: ['kernel', 'printk', 'pr_warn'],
  },
  {
    id: 'lx-ch14-c-004',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Debug Message With pr_debug',
    prompt: `Write a function void trace_entry(int n) that emits "demo: trace_entry n=<n>" using the dynamic-debug helper pr_debug. This message must only appear when the call site is enabled via dynamic debug or when DEBUG is defined. Format n with %d.`,
    hints: [
      'pr_debug() is the dynamic-debug capable helper.',
      'It compiles to a no-op unless DEBUG is set or CONFIG_DYNAMIC_DEBUG enables the site.',
    ],
    solution: `#include <linux/printk.h>

void trace_entry(int n)
{
    pr_debug("demo: trace_entry n=%d\\n", n);
}`,
    starter: `#include <linux/printk.h>

void trace_entry(int n)
{
    // TODO: emit a dynamic-debug message
}`,
    tags: ['kernel', 'pr_debug', 'dynamic-debug'],
  },
  {
    id: 'lx-ch14-c-005',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define pr_fmt for a Module',
    prompt: `At the very top of a source file (before any includes that use printk), define the pr_fmt macro so that every pr_* message is automatically prefixed with "mydrv: ". Then write void boot(void) that calls pr_info("ready\\n") and relies on the prefix. Show the pr_fmt definition and the function.`,
    hints: [
      'Define pr_fmt(fmt) to expand to "mydrv: " fmt before including printk.h.',
      'pr_fmt is applied by all pr_* helpers automatically.',
    ],
    solution: `#define pr_fmt(fmt) "mydrv: " fmt

#include <linux/printk.h>

void boot(void)
{
    pr_info("ready\\n");
}`,
    starter: `// TODO: define pr_fmt to prefix "mydrv: "

#include <linux/printk.h>

void boot(void)
{
    pr_info("ready\\n");
}`,
    tags: ['kernel', 'pr_fmt', 'printk'],
  },
  {
    id: 'lx-ch14-c-006',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print a Hex Pointer Safely',
    prompt: `Write a function void show_ptr(void *p) that prints "demo: ptr=<p>" where the pointer is formatted with the kernel's pointer specifier %p (which by default prints a hashed value). Use pr_info.`,
    hints: [
      'The kernel printf supports %p for pointers.',
      'By default %p prints a hashed pointer for security.',
    ],
    solution: `#include <linux/printk.h>

void show_ptr(void *p)
{
    pr_info("demo: ptr=%p\\n", p);
}`,
    starter: `#include <linux/printk.h>

void show_ptr(void *p)
{
    // TODO: print the pointer with %p
}`,
    tags: ['kernel', 'printk', 'pointer'],
  },
  {
    id: 'lx-ch14-c-007',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Warn Once',
    prompt: `Write a function void check_flag(bool bad) that, if bad is true, emits a kernel warning with a backtrace but only the first time it is hit. Use the WARN macro variant that fires at most once. The warning text should be "demo: bad flag set".`,
    hints: [
      'WARN_ONCE(condition, fmt, ...) fires only the first time the condition is true.',
      'It prints a message plus a stack trace and continues execution.',
    ],
    solution: `#include <linux/bug.h>
#include <linux/printk.h>

void check_flag(bool bad)
{
    WARN_ONCE(bad, "demo: bad flag set\\n");
}`,
    starter: `#include <linux/bug.h>
#include <linux/printk.h>

void check_flag(bool bad)
{
    // TODO: warn at most once when bad is true
}`,
    tags: ['kernel', 'warn_once', 'debugging'],
  },
  {
    id: 'lx-ch14-c-008',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'WARN_ON a Condition',
    prompt: `Write a function void enqueue(int len) that, when len is negative, triggers WARN_ON(len < 0) so the kernel logs a backtrace but keeps running. Do not use BUG_ON. Return nothing.`,
    hints: [
      'WARN_ON(cond) warns and continues; BUG_ON would crash.',
      'WARN_ON returns the truth value of the condition.',
    ],
    solution: `#include <linux/bug.h>

void enqueue(int len)
{
    WARN_ON(len < 0);
}`,
    starter: `#include <linux/bug.h>

void enqueue(int len)
{
    // TODO: warn (do not crash) when len < 0
}`,
    tags: ['kernel', 'warn_on', 'debugging'],
  },
  {
    id: 'lx-ch14-c-009',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Rate-Limited Logging',
    prompt: `Write a function void log_irq(int n) that prints "demo: irq <n>" at info level but rate-limited so a flood of calls does not spam the log. Use the rate-limited pr_* variant.`,
    hints: [
      'pr_info_ratelimited() suppresses repeated messages.',
      'It shares the default ratelimit state.',
    ],
    solution: `#include <linux/printk.h>

void log_irq(int n)
{
    pr_info_ratelimited("demo: irq %d\\n", n);
}`,
    starter: `#include <linux/printk.h>

void log_irq(int n)
{
    // TODO: rate-limited info print
}`,
    tags: ['kernel', 'printk', 'ratelimit'],
  },
  {
    id: 'lx-ch14-c-010',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Dump a Buffer in Hex',
    prompt: `Write a function void dump(const void *buf, size_t len) that hex-dumps len bytes of buf to the log at KERN_DEBUG with the prefix "demo: ". Use the kernel's print_hex_dump_bytes helper, which already chooses a sensible layout.`,
    hints: [
      'print_hex_dump_bytes(prefix, prefix_type, buf, len) is the simple wrapper.',
      'Use DUMP_PREFIX_OFFSET for the prefix_type.',
    ],
    solution: `#include <linux/printk.h>

void dump(const void *buf, size_t len)
{
    print_hex_dump_bytes("demo: ", DUMP_PREFIX_OFFSET, buf, len);
}`,
    starter: `#include <linux/printk.h>

void dump(const void *buf, size_t len)
{
    // TODO: hex-dump the buffer
}`,
    tags: ['kernel', 'hexdump', 'printk'],
  },
  {
    id: 'lx-ch14-c-011',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Conditional Debug With DEBUG',
    prompt: `Write a small file that defines DEBUG before including printk.h so that pr_debug becomes active, then provides void dbg(void) that calls pr_debug("demo: active\\n"). Show the #define and the function.`,
    hints: [
      'Defining DEBUG turns pr_debug into a real print at KERN_DEBUG.',
      'The #define must come before the include.',
    ],
    solution: `#define DEBUG

#include <linux/printk.h>

void dbg(void)
{
    pr_debug("demo: active\\n");
}`,
    starter: `// TODO: define DEBUG so pr_debug is compiled in

#include <linux/printk.h>

void dbg(void)
{
    pr_debug("demo: active\\n");
}`,
    tags: ['kernel', 'pr_debug', 'debug'],
  },
  {
    id: 'lx-ch14-c-012',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print a Continuation Line',
    prompt: `Write a function void show_pair(int a, int b) that emits a single log line "demo: a=<a> b=<b>" using two printk calls: the first with pr_info ending without a newline, the second using the continuation helper pr_cont to append " b=<b>\\n".`,
    hints: [
      'pr_cont() continues the previous line without a new level prefix.',
      'Only the first call should carry the level and the "demo:" text.',
    ],
    solution: `#include <linux/printk.h>

void show_pair(int a, int b)
{
    pr_info("demo: a=%d", a);
    pr_cont(" b=%d\\n", b);
}`,
    starter: `#include <linux/printk.h>

void show_pair(int a, int b)
{
    // TODO: pr_info the first half, pr_cont the rest
}`,
    tags: ['kernel', 'pr_cont', 'printk'],
  },
  {
    id: 'lx-ch14-c-013',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'WARN_ON_ONCE With a Message',
    prompt: `Write a function void put_item(struct list_head *item) that warns once (with a backtrace) if item is NULL, printing "demo: NULL item ignored", and returns early in that case without dereferencing item. If item is non-NULL, fall through to a call list_del(item).`,
    hints: [
      'WARN_ON_ONCE returns the condition value, so you can branch on it.',
      'Guard against the NULL deref by returning when the condition is true.',
    ],
    solution: `#include <linux/bug.h>
#include <linux/list.h>

void put_item(struct list_head *item)
{
    if (WARN_ON_ONCE(!item))
        return;
    list_del(item);
}`,
    starter: `#include <linux/bug.h>
#include <linux/list.h>

void put_item(struct list_head *item)
{
    // TODO: warn once and bail if item is NULL, else list_del
    list_del(item);
}`,
    tags: ['kernel', 'warn_on_once', 'list'],
  },
  {
    id: 'lx-ch14-c-014',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Guard a Pointer With BUG_ON',
    prompt: `Write a function void must_have(void *p) that uses BUG_ON to abort the kernel if p is NULL (an unrecoverable invariant violation). Explain in a one-line comment why BUG_ON, not WARN_ON, is appropriate here. No other logic.`,
    hints: [
      'BUG_ON(cond) panics/oopses when cond is true; use only for truly fatal invariants.',
      'WARN_ON would let execution continue past a broken invariant.',
    ],
    solution: `#include <linux/bug.h>

void must_have(void *p)
{
    /* p must never be NULL here; continuing would corrupt state */
    BUG_ON(!p);
}`,
    starter: `#include <linux/bug.h>

void must_have(void *p)
{
    // TODO: BUG_ON when p is NULL
}`,
    tags: ['kernel', 'bug_on', 'invariant'],
  },
  {
    id: 'lx-ch14-c-015',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Per-Site Ratelimit State',
    prompt: `Write a function void noisy(int code) that prints "demo: code <code>" at error level, but rate-limited using a dedicated static struct ratelimit_state (5 second interval, burst of 10). Use DEFINE_RATELIMIT_STATE and __ratelimit to gate the pr_err.`,
    hints: [
      'DEFINE_RATELIMIT_STATE(name, interval, burst) declares the state.',
      '__ratelimit(&state) returns nonzero when the message is allowed.',
    ],
    solution: `#include <linux/ratelimit.h>
#include <linux/printk.h>

static DEFINE_RATELIMIT_STATE(noisy_rs, 5 * HZ, 10);

void noisy(int code)
{
    if (__ratelimit(&noisy_rs))
        pr_err("demo: code %d\\n", code);
}`,
    starter: `#include <linux/ratelimit.h>
#include <linux/printk.h>

// TODO: define a ratelimit state

void noisy(int code)
{
    // TODO: gate pr_err with __ratelimit
}`,
    tags: ['kernel', 'ratelimit', 'printk'],
  },
  {
    id: 'lx-ch14-c-016',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print With dev_* Helpers',
    prompt: `Write a function void probe_log(struct device *dev) that uses the device-aware logging helper to print "probe complete" at info level, so the output is automatically tagged with the driver and device name. Use dev_info.`,
    hints: [
      'dev_info(dev, fmt, ...) prefixes the message with the device identity.',
      'The dev_* family mirrors pr_* but takes a struct device *.',
    ],
    solution: `#include <linux/device.h>

void probe_log(struct device *dev)
{
    dev_info(dev, "probe complete\\n");
}`,
    starter: `#include <linux/device.h>

void probe_log(struct device *dev)
{
    // TODO: dev_info "probe complete"
}`,
    tags: ['kernel', 'dev_info', 'logging'],
  },
  {
    id: 'lx-ch14-c-017',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Minimal Static Tracepoint Header',
    prompt: `Define a tracepoint named demo_event that carries a single int argument "val" and a print format of "val=%d". Write the TRACE_EVENT block as it would appear in an include/trace/events header. Use the standard TP_PROTO, TP_ARGS, TP_STRUCT__entry, TP_fast_assign, and TP_printk sections.`,
    hints: [
      'TRACE_EVENT(name, TP_PROTO(...), TP_ARGS(...), TP_STRUCT__entry(...), TP_fast_assign(...), TP_printk(...)).',
      '__entry->val is filled in TP_fast_assign and read in TP_printk.',
    ],
    solution: `TRACE_EVENT(demo_event,

    TP_PROTO(int val),

    TP_ARGS(val),

    TP_STRUCT__entry(
        __field(int, val)
    ),

    TP_fast_assign(
        __entry->val = val;
    ),

    TP_printk("val=%d", __entry->val)
);`,
    starter: `TRACE_EVENT(demo_event,

    TP_PROTO(int val),

    TP_ARGS(val),

    TP_STRUCT__entry(
        // TODO: declare an int field "val"
    ),

    TP_fast_assign(
        // TODO: copy val into __entry
    ),

    TP_printk("val=%d", __entry->val)
);`,
    tags: ['kernel', 'tracepoint', 'trace_event'],
  },
  {
    id: 'lx-ch14-c-018',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fire a Tracepoint',
    prompt: `Assume the tracepoint trace_demo_event(int) is declared in <trace/events/demo.h>. Write a function void do_work(int val) that performs work (call helper compute(val)) and fires the tracepoint with val. Include the trace header and call the generated trace_demo_event function.`,
    hints: [
      'Each TRACE_EVENT generates a trace_<name>() function.',
      'Calling trace_demo_event(val) is a no-op until the tracepoint is enabled.',
    ],
    solution: `#include <trace/events/demo.h>

extern void compute(int val);

void do_work(int val)
{
    compute(val);
    trace_demo_event(val);
}`,
    starter: `#include <trace/events/demo.h>

extern void compute(int val);

void do_work(int val)
{
    compute(val);
    // TODO: fire the tracepoint with val
}`,
    tags: ['kernel', 'tracepoint', 'tracing'],
  },
  {
    id: 'lx-ch14-c-019',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'CREATE_TRACE_POINTS in a C File',
    prompt: `Show the two lines that must appear in exactly one .c file so the storage for the demo tracepoints is instantiated. Define CREATE_TRACE_POINTS and then include the trace header <trace/events/demo.h>. This goes in a single translation unit.`,
    hints: [
      'Defining CREATE_TRACE_POINTS before including the trace header generates the definitions.',
      'Only one .c file in the module may define CREATE_TRACE_POINTS.',
    ],
    solution: `#define CREATE_TRACE_POINTS
#include <trace/events/demo.h>`,
    starter: `// TODO: define CREATE_TRACE_POINTS, then include the trace header
`,
    tags: ['kernel', 'tracepoint', 'create_trace_points'],
  },
  {
    id: 'lx-ch14-c-020',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Register a Kprobe Pre-Handler',
    prompt: `Write the setup for a kprobe on the function "do_fork_like" (symbol named that). Fill in a static struct kprobe with .symbol_name set, a pre_handler named demo_pre that prints "demo: hit\\n" with pr_info and returns 0, and a function int arm(void) that calls register_kprobe(&kp) and returns its result.`,
    hints: [
      'struct kprobe has .symbol_name and .pre_handler fields.',
      'A pre_handler has the signature int (*)(struct kprobe *, struct pt_regs *) and usually returns 0.',
    ],
    solution: `#include <linux/kprobes.h>
#include <linux/printk.h>

static int demo_pre(struct kprobe *p, struct pt_regs *regs)
{
    pr_info("demo: hit\\n");
    return 0;
}

static struct kprobe kp = {
    .symbol_name = "do_fork_like",
    .pre_handler = demo_pre,
};

int arm(void)
{
    return register_kprobe(&kp);
}`,
    starter: `#include <linux/kprobes.h>
#include <linux/printk.h>

static int demo_pre(struct kprobe *p, struct pt_regs *regs)
{
    // TODO: pr_info "demo: hit" and return 0
    return 0;
}

static struct kprobe kp = {
    // TODO: set .symbol_name and .pre_handler
};

int arm(void)
{
    // TODO: register the kprobe
    return 0;
}`,
    tags: ['kernel', 'kprobes', 'register_kprobe'],
  },
  {
    id: 'lx-ch14-c-021',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Unregister a Kprobe',
    prompt: `Given the static struct kprobe kp from the previous setup, write a function void disarm(void) that removes the probe so the patched instruction is restored. Call the matching unregister API.`,
    hints: [
      'unregister_kprobe(&kp) undoes register_kprobe.',
      'Always unregister in your module exit path.',
    ],
    solution: `#include <linux/kprobes.h>

extern struct kprobe kp;

void disarm(void)
{
    unregister_kprobe(&kp);
}`,
    starter: `#include <linux/kprobes.h>

extern struct kprobe kp;

void disarm(void)
{
    // TODO: unregister the kprobe
}`,
    tags: ['kernel', 'kprobes', 'unregister_kprobe'],
  },
  {
    id: 'lx-ch14-c-022',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read an Argument in a Kprobe Handler (x86_64)',
    prompt: `Write a kprobe pre-handler int pre(struct kprobe *p, struct pt_regs *regs) for an x86_64 target that reads the first integer argument of the probed function (passed in the di register per the SysV ABI) and prints "demo: arg0=<v>" with pr_info, then returns 0. Read it from regs->di.`,
    hints: [
      'On x86_64 the first argument is in regs->di.',
      'pt_regs members are architecture specific.',
    ],
    solution: `#include <linux/kprobes.h>
#include <linux/printk.h>
#include <linux/ptrace.h>

int pre(struct kprobe *p, struct pt_regs *regs)
{
    unsigned long v = regs->di;

    pr_info("demo: arg0=%lu\\n", v);
    return 0;
}`,
    starter: `#include <linux/kprobes.h>
#include <linux/printk.h>
#include <linux/ptrace.h>

int pre(struct kprobe *p, struct pt_regs *regs)
{
    // TODO: read the first arg from regs->di and print it
    return 0;
}`,
    tags: ['kernel', 'kprobes', 'pt_regs'],
  },
  {
    id: 'lx-ch14-c-023',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Register a Kretprobe',
    prompt: `Set up a kretprobe on "demo_target" whose return handler ret_handler prints "demo: returned <val>" using regs_return_value(regs), returns 0, and has maxactive set to 8. Provide the static struct kretprobe with .kp.symbol_name, .handler, and .maxactive, plus int arm(void) calling register_kretprobe.`,
    hints: [
      'struct kretprobe embeds a struct kprobe named kp; set kp.symbol_name.',
      'regs_return_value(regs) reads the return value portably.',
    ],
    solution: `#include <linux/kprobes.h>
#include <linux/printk.h>
#include <linux/ptrace.h>

static int ret_handler(struct kretprobe_instance *ri, struct pt_regs *regs)
{
    unsigned long val = regs_return_value(regs);

    pr_info("demo: returned %lu\\n", val);
    return 0;
}

static struct kretprobe krp = {
    .kp.symbol_name = "demo_target",
    .handler = ret_handler,
    .maxactive = 8,
};

int arm(void)
{
    return register_kretprobe(&krp);
}`,
    starter: `#include <linux/kprobes.h>
#include <linux/printk.h>
#include <linux/ptrace.h>

static int ret_handler(struct kretprobe_instance *ri, struct pt_regs *regs)
{
    // TODO: print regs_return_value(regs) and return 0
    return 0;
}

static struct kretprobe krp = {
    // TODO: set .kp.symbol_name, .handler, .maxactive
};

int arm(void)
{
    // TODO: register the kretprobe
    return 0;
}`,
    tags: ['kernel', 'kretprobe', 'return-value'],
  },
  {
    id: 'lx-ch14-c-024',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Handle register_kprobe Failure',
    prompt: `Write int load(void) that registers the kprobe &kp (declared extern). If register_kprobe returns a negative error, print "demo: register failed: <ret>" with pr_err and propagate the error by returning it. On success print "demo: armed\\n" with pr_info and return 0.`,
    hints: [
      'register_kprobe returns 0 on success or a negative errno.',
      'Propagate the exact error code returned.',
    ],
    solution: `#include <linux/kprobes.h>
#include <linux/printk.h>

extern struct kprobe kp;

int load(void)
{
    int ret = register_kprobe(&kp);

    if (ret < 0) {
        pr_err("demo: register failed: %d\\n", ret);
        return ret;
    }
    pr_info("demo: armed\\n");
    return 0;
}`,
    starter: `#include <linux/kprobes.h>
#include <linux/printk.h>

extern struct kprobe kp;

int load(void)
{
    // TODO: register, handle error, log success
    return 0;
}`,
    tags: ['kernel', 'kprobes', 'error-handling'],
  },
  {
    id: 'lx-ch14-c-025',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Decode an Oops Offset',
    prompt: `An oops shows: "RIP: 0010:demo_handler+0x2a/0x80". Write a function unsigned long fault_offset(void) that returns the byte offset into demo_handler where the fault occurred (the +0xNN part). Return it as a plain unsigned long. Add a comment naming what 0x80 means.`,
    hints: [
      'In sym+0xOFF/0xLEN, OFF is the offset into the function and LEN is the function size.',
      'The faulting instruction is at function start + offset.',
    ],
    solution: `/* In "demo_handler+0x2a/0x80": 0x2a is the offset, 0x80 is the function length */
unsigned long fault_offset(void)
{
    return 0x2a;
}`,
    starter: `unsigned long fault_offset(void)
{
    // TODO: return the offset from "demo_handler+0x2a/0x80"
    return 0;
}`,
    tags: ['kernel', 'oops', 'stack-trace'],
  },
  {
    id: 'lx-ch14-c-026',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Dump the Current Stack',
    prompt: `Write a function void where_am_i(void) that prints the current task's kernel stack backtrace to the log (without crashing) by calling the helper that dumps the running stack. Use dump_stack().`,
    hints: [
      'dump_stack() prints a backtrace and returns normally.',
      'It is handy for debugging without triggering a WARN.',
    ],
    solution: `#include <linux/printk.h>

void where_am_i(void)
{
    dump_stack();
}`,
    starter: `#include <linux/printk.h>

void where_am_i(void)
{
    // TODO: print the current backtrace
}`,
    tags: ['kernel', 'dump_stack', 'backtrace'],
  },
  {
    id: 'lx-ch14-c-027',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Enable the Function Tracer From Sysfs Notes',
    prompt: `Write a function const char *ftrace_steps(void) that returns a single string containing the two shell commands, separated by a newline, that select the ftrace function tracer and start it via tracefs. Use the canonical paths under /sys/kernel/tracing: echo function into current_tracer, then echo 1 into tracing_on.`,
    hints: [
      'current_tracer selects which tracer is active.',
      'tracing_on toggles capture on (1) or off (0).',
    ],
    solution: `const char *ftrace_steps(void)
{
    return "echo function > /sys/kernel/tracing/current_tracer\\n"
           "echo 1 > /sys/kernel/tracing/tracing_on\\n";
}`,
    starter: `const char *ftrace_steps(void)
{
    // TODO: return the two tracefs commands
    return "";
}`,
    tags: ['kernel', 'ftrace', 'tracefs'],
  },
  {
    id: 'lx-ch14-c-028',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Write a trace_printk Marker',
    prompt: `Write a function void mark(int phase) that writes "demo phase=<phase>" into the ftrace ring buffer (visible in the trace file) using trace_printk. Note in a comment that trace_printk is a debugging aid, not for production.`,
    hints: [
      'trace_printk(fmt, ...) writes into the ftrace buffer, not the kernel log.',
      'It is intentionally cheap and only for temporary debugging.',
    ],
    solution: `#include <linux/kernel.h>

void mark(int phase)
{
    /* trace_printk: debugging only, leaves a warning if left in code */
    trace_printk("demo phase=%d\\n", phase);
}`,
    starter: `#include <linux/kernel.h>

void mark(int phase)
{
    // TODO: write a marker into the ftrace buffer
}`,
    tags: ['kernel', 'ftrace', 'trace_printk'],
  },
  {
    id: 'lx-ch14-c-029',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Conditional WARN With Format',
    prompt: `Write a function void check_len(unsigned int got, unsigned int want) that, when got != want, fires WARN with a backtrace and the message "demo: length mismatch got=<got> want=<want>". Use the WARN(condition, fmt, ...) form so it prints a custom message.`,
    hints: [
      'WARN(cond, fmt, ...) is like WARN_ON but with a message.',
      'It fires every time the condition is true.',
    ],
    solution: `#include <linux/bug.h>

void check_len(unsigned int got, unsigned int want)
{
    WARN(got != want, "demo: length mismatch got=%u want=%u\\n", got, want);
}`,
    starter: `#include <linux/bug.h>

void check_len(unsigned int got, unsigned int want)
{
    // TODO: WARN with a formatted message on mismatch
}`,
    tags: ['kernel', 'warn', 'debugging'],
  },
  {
    id: 'lx-ch14-c-030',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print a Symbol Name From an Address',
    prompt: `Write a function void name_of(void *addr) that prints "demo: addr is <symbol+offset>" by using the kernel printf extension that resolves a kernel address to its symbol. Use the %pS pointer format specifier with addr.`,
    hints: [
      '%pS prints the symbol name and offset for a kernel address.',
      'Pass the raw pointer; the kernel does the lookup.',
    ],
    solution: `#include <linux/printk.h>

void name_of(void *addr)
{
    pr_info("demo: addr is %pS\\n", addr);
}`,
    starter: `#include <linux/printk.h>

void name_of(void *addr)
{
    // TODO: print the symbol for addr with %pS
}`,
    tags: ['kernel', 'printk', 'symbols'],
  },
  {
    id: 'lx-ch14-c-031',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Use-After-Free KASAN Would Catch',
    prompt: `Write a function int oops_uaf(void) that allocates an int with kmalloc, frees it with kfree, then (the bug) reads through the freed pointer and returns that value. Add a comment marking the exact line KASAN flags as a use-after-free. This is intentionally buggy to illustrate what KASAN detects.`,
    hints: [
      'KASAN reports a use-after-free when memory is read after kfree.',
      'The deref of the freed pointer is the flagged access.',
    ],
    solution: `#include <linux/slab.h>

int oops_uaf(void)
{
    int *p = kmalloc(sizeof(*p), GFP_KERNEL);

    if (!p)
        return -1;
    *p = 7;
    kfree(p);
    return *p; /* KASAN: use-after-free read here */
}`,
    starter: `#include <linux/slab.h>

int oops_uaf(void)
{
    int *p = kmalloc(sizeof(*p), GFP_KERNEL);

    if (!p)
        return -1;
    *p = 7;
    kfree(p);
    // TODO: the buggy read KASAN flags
    return 0;
}`,
    tags: ['kernel', 'kasan', 'use-after-free'],
  },
  {
    id: 'lx-ch14-c-032',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Deadlock Lockdep Would Catch',
    prompt: `Write a function void bad_order(spinlock_t *a, spinlock_t *b) that takes lock a then lock b. Then write void worse_order(spinlock_t *a, spinlock_t *b) that takes them in the opposite order (b then a). Use spin_lock/spin_unlock. Add a comment noting lockdep flags this AB-BA ordering. Each function must release both locks before returning.`,
    hints: [
      'Lockdep detects inconsistent lock acquisition order (AB then BA).',
      'Release in reverse order of acquisition.',
    ],
    solution: `#include <linux/spinlock.h>

/* lockdep flags the A->B then B->A ordering as a possible deadlock */
void bad_order(spinlock_t *a, spinlock_t *b)
{
    spin_lock(a);
    spin_lock(b);
    spin_unlock(b);
    spin_unlock(a);
}

void worse_order(spinlock_t *a, spinlock_t *b)
{
    spin_lock(b);
    spin_lock(a);
    spin_unlock(a);
    spin_unlock(b);
}`,
    starter: `#include <linux/spinlock.h>

void bad_order(spinlock_t *a, spinlock_t *b)
{
    // TODO: lock a then b, unlock in reverse
}

void worse_order(spinlock_t *a, spinlock_t *b)
{
    // TODO: lock b then a, unlock in reverse
}`,
    tags: ['kernel', 'lockdep', 'deadlock'],
  },
  {
    id: 'lx-ch14-c-033',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Define a Dynamic Debug Module Param Note',
    prompt: `Write a function const char *ddebug_cmd(void) that returns the single string you would write to /sys/kernel/debug/dynamic_debug/control to enable all pr_debug call sites in the module named "mydrv". The format is: module mydrv +p. Return exactly that control string.`,
    hints: [
      'The control file syntax is: <match-spec> <flags>.',
      'module <name> selects all sites in a module; +p enables printing.',
    ],
    solution: `const char *ddebug_cmd(void)
{
    return "module mydrv +p";
}`,
    starter: `const char *ddebug_cmd(void)
{
    // TODO: return the dynamic_debug control string
    return "";
}`,
    tags: ['kernel', 'dynamic-debug', 'pr_debug'],
  },
  {
    id: 'lx-ch14-c-034',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Conditional Compile of Debug Path',
    prompt: `Write a function void maybe_check(int x) that, only when the kernel is built with CONFIG_DEBUG_KERNEL, calls WARN_ON(x < 0). Use an #ifdef so production builds skip the check entirely. Provide the full function with preprocessor guards.`,
    hints: [
      'IS_ENABLED(CONFIG_X) or #ifdef CONFIG_X both work; here use #ifdef.',
      'Code inside #ifdef CONFIG_DEBUG_KERNEL only compiles in debug builds.',
    ],
    solution: `#include <linux/bug.h>

void maybe_check(int x)
{
#ifdef CONFIG_DEBUG_KERNEL
    WARN_ON(x < 0);
#endif
}`,
    starter: `#include <linux/bug.h>

void maybe_check(int x)
{
    // TODO: WARN_ON(x < 0) only under CONFIG_DEBUG_KERNEL
}`,
    tags: ['kernel', 'kconfig', 'warn_on'],
  },
  {
    id: 'lx-ch14-c-035',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Tie It Together: Probe That Traces and Warns',
    prompt: `Write a kprobe pre-handler int trace_pre(struct kprobe *p, struct pt_regs *regs) that: emits a dynamic-debug message "demo: probe %s\\n" with p->symbol_name via pr_debug; warns once with WARN_ON_ONCE if p->symbol_name is NULL; and returns 0. Keep it self-contained.`,
    hints: [
      'p->symbol_name is the probed symbol string.',
      'Use pr_debug for the trace and WARN_ON_ONCE for the sanity check.',
    ],
    solution: `#include <linux/kprobes.h>
#include <linux/printk.h>
#include <linux/bug.h>

int trace_pre(struct kprobe *p, struct pt_regs *regs)
{
    pr_debug("demo: probe %s\\n", p->symbol_name);
    WARN_ON_ONCE(!p->symbol_name);
    return 0;
}`,
    starter: `#include <linux/kprobes.h>
#include <linux/printk.h>
#include <linux/bug.h>

int trace_pre(struct kprobe *p, struct pt_regs *regs)
{
    // TODO: pr_debug the symbol, WARN_ON_ONCE if NULL, return 0
    return 0;
}`,
    tags: ['kernel', 'kprobes', 'pr_debug', 'warn_on_once'],
  },
]

export default problems
