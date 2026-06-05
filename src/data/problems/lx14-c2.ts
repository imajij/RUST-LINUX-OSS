import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch14-c-036',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pick The Right pr_ Helper',
    prompt: `Write void report(struct device_state *st) that logs three messages: a fatal hardware fault with pr_err, a recoverable condition with pr_warn, and a routine status line with pr_info. The format string for each should include the device id st->id (an int) and a short text. Add the standard pr_fmt define so every message is prefixed with the module name.`,
    hints: [
      'Define pr_fmt before including printk so all pr_* calls inherit the prefix.',
      'pr_err / pr_warn / pr_info map to KERN_ERR / KERN_WARNING / KERN_INFO levels.',
    ],
    solution: `#define pr_fmt(fmt) KBUILD_MODNAME ": " fmt
#include <linux/printk.h>

void report(struct device_state *st)
{
    pr_err("device %d: fatal hardware fault\\n", st->id);
    pr_warn("device %d: recoverable timeout, retrying\\n", st->id);
    pr_info("device %d: link up, ready\\n", st->id);
}`,
    starter: `/* TODO: define pr_fmt to prepend the module name */
#include <linux/printk.h>

void report(struct device_state *st)
{
    /* TODO: pr_err, pr_warn, pr_info with st->id */
}`,
    tags: ['printk', 'pr_fmt', 'logging'],
  },
  {
    id: 'lx-ch14-c-037',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Rate Limit A Noisy Error',
    prompt: `An interrupt handler can log the same error thousands of times per second. Write void irq_oops(int code) that prints "irq error code N" but is rate limited so a flood cannot drown the log. Use the dedicated printk variant rather than rolling your own counter.`,
    hints: [
      'pr_err_ratelimited applies the default printk rate limit.',
      'It suppresses bursts and reports how many callbacks were dropped.',
    ],
    solution: `#include <linux/printk.h>

void irq_oops(int code)
{
    pr_err_ratelimited("irq error code %d\\n", code);
}`,
    starter: `#include <linux/printk.h>

void irq_oops(int code)
{
    /* TODO: log "irq error code N" with rate limiting */
}`,
    tags: ['printk', 'ratelimit', 'logging'],
  },
  {
    id: 'lx-ch14-c-038',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Once During Probe',
    prompt: `Some quirk warning should appear only the first time a code path runs, no matter how many devices probe. Write void note_quirk(void) that emits "hardware quirk active, applying workaround" exactly once for the lifetime of the module, using the printk helper designed for this.`,
    hints: [
      'pr_info_once stores a static boolean guard for you.',
      'No manual static flag is needed.',
    ],
    solution: `#include <linux/printk.h>

void note_quirk(void)
{
    pr_info_once("hardware quirk active, applying workaround\\n");
}`,
    starter: `#include <linux/printk.h>

void note_quirk(void)
{
    /* TODO: print exactly once */
}`,
    tags: ['printk', 'pr_once', 'logging'],
  },
  {
    id: 'lx-ch14-c-039',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Compiled In Debug Print',
    prompt: `Add a debug trace to void do_step(struct job *j) that prints the job pointer and its j->phase value. The message must vanish at compile time unless CONFIG_DYNAMIC_DEBUG is set or DEBUG is defined for this file, and it must be controllable at runtime through dynamic debug. Use the canonical helper, not pr_info.`,
    hints: [
      'pr_debug is the dynamic-debug aware print helper.',
      'With CONFIG_DYNAMIC_DEBUG it becomes a controllable callsite; otherwise it needs #define DEBUG.',
    ],
    solution: `#define pr_fmt(fmt) KBUILD_MODNAME ": " fmt
#include <linux/printk.h>

void do_step(struct job *j)
{
    pr_debug("job %p entering phase %d\\n", j, j->phase);
}`,
    starter: `#define pr_fmt(fmt) KBUILD_MODNAME ": " fmt
#include <linux/printk.h>

void do_step(struct job *j)
{
    /* TODO: emit a dynamic-debug controllable trace */
}`,
    tags: ['pr_debug', 'dynamic-debug', 'logging'],
  },
  {
    id: 'lx-ch14-c-040',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Device Scoped Debug Print',
    prompt: `Inside a driver you have a struct device *dev. Write void xfer_debug(struct device *dev, int len) that emits a debug message "queued transfer of N bytes" tagged with the device. The message must integrate with dynamic debug and automatically prefix the dev_name. Use the dev_* family.`,
    hints: [
      'dev_dbg is the device-oriented sibling of pr_debug.',
      'It prefixes driver and device name automatically.',
    ],
    solution: `#include <linux/device.h>

void xfer_debug(struct device *dev, int len)
{
    dev_dbg(dev, "queued transfer of %d bytes\\n", len);
}`,
    starter: `#include <linux/device.h>

void xfer_debug(struct device *dev, int len)
{
    /* TODO: device-scoped dynamic debug message */
}`,
    tags: ['dev_dbg', 'dynamic-debug', 'device'],
  },
  {
    id: 'lx-ch14-c-041',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Hex Dump A Buffer',
    prompt: `Write void dump_packet(const void *buf, size_t len) that prints buf as a debug-level hex+ASCII dump, 16 bytes per row, with the buffer offset shown on each line and a "pkt: " prefix. Use the kernel helper meant for this instead of looping by hand.`,
    hints: [
      'print_hex_dump_debug or print_hex_dump does grouped hex output.',
      'DUMP_PREFIX_OFFSET shows the running offset; rowsize 16, groupsize 1, ascii true.',
    ],
    solution: `#include <linux/printk.h>

void dump_packet(const void *buf, size_t len)
{
    print_hex_dump_debug("pkt: ", DUMP_PREFIX_OFFSET, 16, 1,
                         buf, len, true);
}`,
    starter: `#include <linux/printk.h>

void dump_packet(const void *buf, size_t len)
{
    /* TODO: 16-byte rows, offset prefix, ascii on */
}`,
    tags: ['printk', 'hexdump', 'debug'],
  },
  {
    id: 'lx-ch14-c-042',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Warn On A Bad Argument Once',
    prompt: `Write int set_speed(int mbps) that should never be called with a value above 1000. If it is, emit a one-time stack trace and warning but keep running, returning -EINVAL. On a valid value store it in a global g_speed and return 0. Use the macro that warns at most once.`,
    hints: [
      'WARN_ON_ONCE(cond) emits a backtrace and taints the kernel, but does not stop it.',
      'It evaluates and returns the condition, so you can branch on it.',
    ],
    solution: `#include <linux/bug.h>
#include <linux/errno.h>

static int g_speed;

int set_speed(int mbps)
{
    if (WARN_ON_ONCE(mbps > 1000))
        return -EINVAL;
    g_speed = mbps;
    return 0;
}`,
    starter: `#include <linux/bug.h>
#include <linux/errno.h>

static int g_speed;

int set_speed(int mbps)
{
    /* TODO: WARN_ON_ONCE for mbps > 1000, return -EINVAL */
}`,
    tags: ['warn_on', 'bug', 'validation'],
  },
  {
    id: 'lx-ch14-c-043',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Warn With A Message',
    prompt: `Write void check_state(struct ctx *c) that, if c->refs is negative, prints a warning with a custom message including the bogus count and a backtrace, but does not halt the kernel. Use the variant that lets you pass a printf-style message, not the bare condition form.`,
    hints: [
      'WARN(cond, fmt, ...) prints your message plus a backtrace.',
      'Unlike BUG, it continues execution after tainting the kernel.',
    ],
    solution: `#include <linux/bug.h>

void check_state(struct ctx *c)
{
    WARN(c->refs < 0, "ctx %p has negative refcount %d\\n",
         c, c->refs);
}`,
    starter: `#include <linux/bug.h>

void check_state(struct ctx *c)
{
    /* TODO: WARN with a message if c->refs < 0 */
}`,
    tags: ['warn', 'bug', 'invariant'],
  },
  {
    id: 'lx-ch14-c-044',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'BUG_ON For An Unrecoverable Invariant',
    prompt: `A list manipulation assumes the node is never NULL because callers guarantee it. Write void unlink(struct node *n) that asserts n is non-NULL with BUG_ON before touching it, then sets n->next = NULL. In a comment, state the key difference from WARN_ON: what happens to the kernel if the assertion fails.`,
    hints: [
      'BUG_ON(cond) panics the offending context when cond is true.',
      'Reserve it for corruption that makes continuing unsafe; WARN_ON keeps running.',
    ],
    solution: `#include <linux/bug.h>

struct node { struct node *next; };

void unlink(struct node *n)
{
    /* If this fires the kernel oopses/panics here and the
     * thread is killed; WARN_ON would only log and continue. */
    BUG_ON(n == NULL);
    n->next = NULL;
}`,
    starter: `#include <linux/bug.h>

struct node { struct node *next; };

void unlink(struct node *n)
{
    /* TODO: BUG_ON if n is NULL, then clear n->next */
}`,
    tags: ['bug_on', 'invariant', 'panic'],
  },
  {
    id: 'lx-ch14-c-045',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register A Static Tracepoint',
    prompt: `Define a tracepoint named myqueue_enqueue that records an int id and an unsigned int depth. Write the TRACE_EVENT macro: the proto, the args, the field structure, the fast assign, and a printk format. Assume the standard tracepoint header boilerplate (TRACE_SYSTEM, includes) is in place.`,
    hints: [
      'TRACE_EVENT(name, TP_PROTO(...), TP_ARGS(...), TP_STRUCT__entry(...), TP_fast_assign(...), TP_printk(...)).',
      'Declare fields with __field(type, name) and copy them in TP_fast_assign.',
    ],
    solution: `TRACE_EVENT(myqueue_enqueue,

    TP_PROTO(int id, unsigned int depth),

    TP_ARGS(id, depth),

    TP_STRUCT__entry(
        __field(int, id)
        __field(unsigned int, depth)
    ),

    TP_fast_assign(
        __entry->id = id;
        __entry->depth = depth;
    ),

    TP_printk("id=%d depth=%u", __entry->id, __entry->depth)
);`,
    starter: `TRACE_EVENT(myqueue_enqueue,

    TP_PROTO(/* TODO */),

    TP_ARGS(/* TODO */),

    TP_STRUCT__entry(
        /* TODO: __field entries */
    ),

    TP_fast_assign(
        /* TODO: copy args into __entry */
    ),

    TP_printk(/* TODO */)
);`,
    tags: ['tracepoint', 'trace_event', 'ftrace'],
  },
  {
    id: 'lx-ch14-c-046',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fire A Tracepoint From Code',
    prompt: `Given the tracepoint trace_myqueue_enqueue(int id, unsigned int depth) generated by TRACE_EVENT, write void enqueue(struct myq *q, int id) that increments q->depth and then calls the tracepoint. Note in a comment why the call is essentially free when the tracepoint is disabled.`,
    hints: [
      'Just call trace_<name>(args) where you want the probe point.',
      'A disabled tracepoint is guarded by a static key, so it is a no-op until enabled.',
    ],
    solution: `void enqueue(struct myq *q, int id)
{
    q->depth++;
    /* trace_*() expands to a static-key guarded branch: when the
     * tracepoint is off the body is skipped with near-zero cost. */
    trace_myqueue_enqueue(id, q->depth);
}`,
    starter: `void enqueue(struct myq *q, int id)
{
    q->depth++;
    /* TODO: fire the tracepoint */
}`,
    tags: ['tracepoint', 'static-key', 'ftrace'],
  },
  {
    id: 'lx-ch14-c-047',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Emit A trace_printk Marker',
    prompt: `While bisecting a latency bug you want a low-overhead marker that lands in the ftrace ring buffer, not the kernel log. Write void mark_latency(unsigned long us) that writes "latency spike %lu us" into the trace buffer. Note in a comment why this must be removed before merging.`,
    hints: [
      'trace_printk writes directly to the ftrace ring buffer.',
      'It is a debugging-only tool: it allocates extra buffers and prints a banner, so never ship it.',
    ],
    solution: `#include <linux/kernel.h>

void mark_latency(unsigned long us)
{
    /* Debug aid only: trace_printk must not be left in committed
     * code; it triggers a warning banner and wastes memory. */
    trace_printk("latency spike %lu us\\n", us);
}`,
    starter: `#include <linux/kernel.h>

void mark_latency(unsigned long us)
{
    /* TODO: write a marker into the ftrace buffer */
}`,
    tags: ['trace_printk', 'ftrace', 'debug'],
  },
  {
    id: 'lx-ch14-c-048',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Minimal kprobe Pre Handler',
    prompt: `Write a pre-handler int handler_pre(struct kprobe *p, struct pt_regs *regs) that prints the probed symbol name p->symbol_name and the faulting instruction pointer from regs using instruction_pointer(regs), then returns 0 to let the probed instruction run. Use the right header.`,
    hints: [
      'A kprobe pre_handler returns 0 to continue normally.',
      'p->symbol_name holds the symbol; instruction_pointer(regs) reads the IP portably.',
    ],
    solution: `#include <linux/kprobes.h>
#include <linux/ptrace.h>
#include <linux/printk.h>

int handler_pre(struct kprobe *p, struct pt_regs *regs)
{
    pr_info("kprobe hit %s at ip=%lx\\n",
            p->symbol_name, instruction_pointer(regs));
    return 0;
}`,
    starter: `#include <linux/kprobes.h>
#include <linux/ptrace.h>
#include <linux/printk.h>

int handler_pre(struct kprobe *p, struct pt_regs *regs)
{
    /* TODO: print symbol name and instruction pointer, return 0 */
}`,
    tags: ['kprobes', 'pt_regs', 'tracing'],
  },
  {
    id: 'lx-ch14-c-049',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register And Unregister A kprobe',
    prompt: `Given a static struct kprobe kp with .symbol_name = "do_fork" and .pre_handler = handler_pre already set, write int my_init(void) that registers it with register_kprobe and returns any error, and void my_exit(void) that tears it down. Log a message on success.`,
    hints: [
      'register_kprobe returns 0 on success or a negative errno.',
      'unregister_kprobe frees the probe in the exit path.',
    ],
    solution: `#include <linux/kprobes.h>
#include <linux/printk.h>

extern struct kprobe kp;

int my_init(void)
{
    int ret = register_kprobe(&kp);

    if (ret < 0) {
        pr_err("register_kprobe failed: %d\\n", ret);
        return ret;
    }
    pr_info("kprobe planted at %s\\n", kp.symbol_name);
    return 0;
}

void my_exit(void)
{
    unregister_kprobe(&kp);
}`,
    starter: `#include <linux/kprobes.h>
#include <linux/printk.h>

extern struct kprobe kp;

int my_init(void)
{
    /* TODO: register_kprobe, handle error, log success */
}

void my_exit(void)
{
    /* TODO: unregister_kprobe */
}`,
    tags: ['kprobes', 'module', 'tracing'],
  },
  {
    id: 'lx-ch14-c-050',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Toggle Dynamic Debug From Code',
    prompt: `Write void enable_my_debug(void) that turns on every pr_debug/dev_dbg callsite in the current module at runtime, equivalent to writing "module MODNAME +p" to control/dynamic_debug. Use the in-kernel helper that takes a query string.`,
    hints: [
      'dynamic_debug_exec_queries(query, modname) runs a control query programmatically.',
      'The flag +p enables the printk for matching callsites.',
    ],
    solution: `#include <linux/dynamic_debug.h>

void enable_my_debug(void)
{
    dynamic_debug_exec_queries("+p", KBUILD_MODNAME);
}`,
    starter: `#include <linux/dynamic_debug.h>

void enable_my_debug(void)
{
    /* TODO: enable all callsites in this module */
}`,
    tags: ['dynamic-debug', 'pr_debug', 'runtime'],
  },
  {
    id: 'lx-ch14-c-051',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Dump The Current Stack',
    prompt: `Write void trace_me(const char *why) that logs the message why and then prints the current task's call stack to the kernel log, the same backtrace you would see in a WARN, without crashing. Use the dedicated function.`,
    hints: [
      'dump_stack() prints the current call trace.',
      'It does not taint or stop the kernel, unlike WARN.',
    ],
    solution: `#include <linux/printk.h>

void trace_me(const char *why)
{
    pr_info("trace_me: %s\\n", why);
    dump_stack();
}`,
    starter: `#include <linux/printk.h>

void trace_me(const char *why)
{
    /* TODO: log why, then print the current call stack */
}`,
    tags: ['dump_stack', 'backtrace', 'debug'],
  },
  {
    id: 'lx-ch14-c-052',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Symbolize An Address In A Log',
    prompt: `You have a function pointer void (*fn)(void) and want the log to show the symbol name plus module and offset rather than a raw hex address. Write void show_handler(void (*fn)(void)) that prints it. Use the printk pointer extension that resolves kernel symbols.`,
    hints: [
      'The %pS / %ps printf extension symbolizes a pointer.',
      'Pass the pointer directly; printk core resolves it via kallsyms.',
    ],
    solution: `#include <linux/printk.h>

void show_handler(void (*fn)(void))
{
    pr_info("handler is %pS\\n", fn);
}`,
    starter: `#include <linux/printk.h>

void show_handler(void (*fn)(void))
{
    /* TODO: print fn as a resolved symbol */
}`,
    tags: ['printk', 'kallsyms', 'symbol'],
  },
  {
    id: 'lx-ch14-c-053',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Conditional WARN Returning A Value',
    prompt: `Write int submit(struct req *r) that warns once if r->len exceeds MAX_LEN and returns -EINVAL in that case, otherwise returns 0. Use the macro that combines a once-only WARN with returning the condition so the whole check is a single if. Define MAX_LEN as 4096.`,
    hints: [
      'WARN_ON_ONCE returns the truth value of its condition.',
      'You can write: if (WARN_ON_ONCE(cond)) return -EINVAL;',
    ],
    solution: `#include <linux/bug.h>
#include <linux/errno.h>

#define MAX_LEN 4096

int submit(struct req *r)
{
    if (WARN_ON_ONCE(r->len > MAX_LEN))
        return -EINVAL;
    return 0;
}`,
    starter: `#include <linux/bug.h>
#include <linux/errno.h>

#define MAX_LEN 4096

int submit(struct req *r)
{
    /* TODO: warn-once on oversize, return -EINVAL */
}`,
    tags: ['warn_on', 'validation', 'errno'],
  },
  {
    id: 'lx-ch14-c-054',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Time A Section With ftrace Friendly Markers',
    prompt: `Wrap a critical section in trace markers. Write void critical(struct work *w) that writes "enter id=N" to the ftrace buffer, calls do_work(w), then writes "exit id=N", using w->id. The markers must land in the ring buffer for offline analysis. Use trace_printk.`,
    hints: [
      'trace_printk before and after the call brackets the section in the trace.',
      'Read both markers back from the trace file to compute the duration.',
    ],
    solution: `#include <linux/kernel.h>

void critical(struct work *w)
{
    trace_printk("enter id=%d\\n", w->id);
    do_work(w);
    trace_printk("exit id=%d\\n", w->id);
}`,
    starter: `#include <linux/kernel.h>

void critical(struct work *w)
{
    /* TODO: bracket do_work(w) with trace_printk markers */
}`,
    tags: ['trace_printk', 'ftrace', 'timing'],
  },
  {
    id: 'lx-ch14-c-055',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Taint Aware Sanity Check',
    prompt: `Write void verify_magic(struct hdr *h) that checks h->magic equals 0xC0FFEE. If not, it should print a backtrace and a descriptive message but keep going (the caller handles the bad header). Choose the assertion macro whose semantics match "log and continue", not "halt".`,
    hints: [
      'WARN_ON / WARN log and continue; BUG_ON halts.',
      'A corrupted but non-fatal header is a classic WARN case.',
    ],
    solution: `#include <linux/bug.h>

void verify_magic(struct hdr *h)
{
    WARN(h->magic != 0xC0FFEE,
         "bad header magic 0x%x (expected 0xC0FFEE)\\n", h->magic);
}`,
    starter: `#include <linux/bug.h>

void verify_magic(struct hdr *h)
{
    /* TODO: warn (do not halt) on bad magic */
}`,
    tags: ['warn', 'invariant', 'debug'],
  },
  {
    id: 'lx-ch14-c-056',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print A Struct Field With dev_err',
    prompt: `Inside a probe failure path you have struct device *dev and an int err. Write void probe_fail(struct device *dev, int err) that logs an error scoped to the device: "probe failed, error N". Use the device print family so the message carries the driver and device names, and is always compiled in.`,
    hints: [
      'dev_err is the unconditional device error helper.',
      'It does not depend on dynamic debug, unlike dev_dbg.',
    ],
    solution: `#include <linux/device.h>

void probe_fail(struct device *dev, int err)
{
    dev_err(dev, "probe failed, error %d\\n", err);
}`,
    starter: `#include <linux/device.h>

void probe_fail(struct device *dev, int err)
{
    /* TODO: device-scoped error log */
}`,
    tags: ['dev_err', 'device', 'logging'],
  },
  {
    id: 'lx-ch14-c-057',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Guard Debug Output With a Build Flag',
    prompt: `Provide a custom debug macro mydbg(fmt, ...) that expands to pr_debug when the file-local macro MYDRV_DEBUG is defined, and to nothing (a do/while(0) no-op) otherwise. Then use it in void step(int n) to log "step n". Write both the macro and the function.`,
    hints: [
      'Use #ifdef MYDRV_DEBUG to switch between pr_debug and a no-op.',
      'A do { } while (0) no-op keeps the macro statement-safe.',
    ],
    solution: `#include <linux/printk.h>

#ifdef MYDRV_DEBUG
#define mydbg(fmt, ...) pr_debug(fmt, ##__VA_ARGS__)
#else
#define mydbg(fmt, ...) do { } while (0)
#endif

void step(int n)
{
    mydbg("step %d\\n", n);
}`,
    starter: `#include <linux/printk.h>

/* TODO: define mydbg conditionally on MYDRV_DEBUG */

void step(int n)
{
    mydbg("step %d\\n", n);
}`,
    tags: ['pr_debug', 'macro', 'debug'],
  },
  {
    id: 'lx-ch14-c-058',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read The Return Value With A kretprobe',
    prompt: `Write a kretprobe return handler int ret_handler(struct kretprobe_instance *ri, struct pt_regs *regs) that reads the probed function's return value with regs_return_value(regs) and logs it, then returns 0. Include the right headers.`,
    hints: [
      'kretprobes run a handler when the probed function returns.',
      'regs_return_value(regs) portably extracts the return register.',
    ],
    solution: `#include <linux/kprobes.h>
#include <linux/ptrace.h>
#include <linux/printk.h>

int ret_handler(struct kretprobe_instance *ri, struct pt_regs *regs)
{
    pr_info("probed function returned %ld\\n",
            regs_return_value(regs));
    return 0;
}`,
    starter: `#include <linux/kprobes.h>
#include <linux/ptrace.h>
#include <linux/printk.h>

int ret_handler(struct kretprobe_instance *ri, struct pt_regs *regs)
{
    /* TODO: log the return value, return 0 */
}`,
    tags: ['kprobes', 'kretprobe', 'tracing'],
  },
  {
    id: 'lx-ch14-c-059',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Backtrace A Specific Task',
    prompt: `Write void dump_task(struct task_struct *t) that prints the call stack of an arbitrary task t (which may be sleeping), not the current one. Use the function that takes a task pointer, and guard against a NULL task with a WARN_ON_ONCE.`,
    hints: [
      'sched_show_task or show_stack can dump another task.',
      'sched_show_task(t) prints the task state plus its backtrace.',
    ],
    solution: `#include <linux/sched.h>
#include <linux/sched/debug.h>
#include <linux/bug.h>

void dump_task(struct task_struct *t)
{
    if (WARN_ON_ONCE(!t))
        return;
    sched_show_task(t);
}`,
    starter: `#include <linux/sched.h>
#include <linux/sched/debug.h>
#include <linux/bug.h>

void dump_task(struct task_struct *t)
{
    /* TODO: guard NULL, then dump t's stack */
}`,
    tags: ['backtrace', 'task_struct', 'debug'],
  },
  {
    id: 'lx-ch14-c-060',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Complete kprobe Module',
    prompt: `Write a self-contained kprobe module that probes the symbol "__kmalloc". Provide a pre-handler that logs the requested size, taken from the first argument register via the arch-neutral accessor, plus the standard register_kprobe/unregister_kprobe in init and exit, MODULE_LICENSE, and module_init/module_exit. Assume x86_64 so the first integer arg is regs->di; use a comment to acknowledge the arch dependency.`,
    hints: [
      'Set kp.symbol_name and kp.pre_handler before register_kprobe.',
      'The first integer argument on x86_64 SysV ABI is in regs->di.',
      'Return the registration error so module load fails cleanly.',
    ],
    solution: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/kprobes.h>
#include <linux/ptrace.h>

static int pre_kmalloc(struct kprobe *p, struct pt_regs *regs)
{
    /* arch dependent: x86_64 SysV passes arg0 in RDI */
    pr_info("__kmalloc size=%lu\\n", regs->di);
    return 0;
}

static struct kprobe kp = {
    .symbol_name = "__kmalloc",
    .pre_handler = pre_kmalloc,
};

static int __init kp_init(void)
{
    int ret = register_kprobe(&kp);

    if (ret < 0) {
        pr_err("register_kprobe failed: %d\\n", ret);
        return ret;
    }
    pr_info("planted kprobe at %s\\n", kp.symbol_name);
    return 0;
}

static void __exit kp_exit(void)
{
    unregister_kprobe(&kp);
    pr_info("kprobe removed\\n");
}

module_init(kp_init);
module_exit(kp_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/kprobes.h>
#include <linux/ptrace.h>

static int pre_kmalloc(struct kprobe *p, struct pt_regs *regs)
{
    /* TODO: log the size argument */
}

static struct kprobe kp = {
    /* TODO: symbol_name and pre_handler */
};

static int __init kp_init(void)
{
    /* TODO: register, handle error */
}

static void __exit kp_exit(void)
{
    /* TODO: unregister */
}

/* TODO: module_init / module_exit / MODULE_LICENSE */`,
    tags: ['kprobes', 'module', 'tracing'],
  },
  {
    id: 'lx-ch14-c-061',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Full Tracepoint Header',
    prompt: `Write a complete tracepoint header (the part between the TRACE_SYSTEM define and the trace/define_trace include) for an event mydrv_io that records a const char *name (copied), an int bytes, and an int err. Use __string/__assign_str for the name, declare TRACE_SYSTEM mydrv, and end with the include that emits the code. You may abbreviate the outer #if !defined guard.`,
    hints: [
      'Define TRACE_SYSTEM before TRACE_EVENT; __string(field, src) declares a dynamic string.',
      'In TP_fast_assign use __assign_str(field, src); read it back with __get_str(field) in TP_printk.',
      'Finish with #include <trace/define_trace.h> to generate the implementation.',
    ],
    solution: `#undef TRACE_SYSTEM
#define TRACE_SYSTEM mydrv

#if !defined(_TRACE_MYDRV_H) || defined(TRACE_HEADER_MULTI_READ)
#define _TRACE_MYDRV_H

#include <linux/tracepoint.h>

TRACE_EVENT(mydrv_io,

    TP_PROTO(const char *name, int bytes, int err),

    TP_ARGS(name, bytes, err),

    TP_STRUCT__entry(
        __string(name, name)
        __field(int, bytes)
        __field(int, err)
    ),

    TP_fast_assign(
        __assign_str(name, name);
        __entry->bytes = bytes;
        __entry->err = err;
    ),

    TP_printk("name=%s bytes=%d err=%d",
              __get_str(name), __entry->bytes, __entry->err)
);

#endif /* _TRACE_MYDRV_H */

#include <trace/define_trace.h>`,
    starter: `#undef TRACE_SYSTEM
#define TRACE_SYSTEM mydrv

#if !defined(_TRACE_MYDRV_H) || defined(TRACE_HEADER_MULTI_READ)
#define _TRACE_MYDRV_H

#include <linux/tracepoint.h>

TRACE_EVENT(mydrv_io,
    /* TODO: proto, args, __string name, fields, assign, printk */
);

#endif /* _TRACE_MYDRV_H */

/* TODO: include trace/define_trace.h */`,
    tags: ['tracepoint', 'trace_event', 'ftrace'],
  },
  {
    id: 'lx-ch14-c-062',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'An ftrace Function Hook With ftrace_ops',
    prompt: `Register a function tracer callback. Write the callback void my_trace(unsigned long ip, unsigned long parent_ip, struct ftrace_ops *op, struct ftrace_regs *fregs) that logs ip and parent_ip as symbols, plus a static struct ftrace_ops my_ops pointing at it with FTRACE_OPS_FL_SAVE_REGS, and an init that calls register_ftrace_function. Include headers.`,
    hints: [
      'The modern callback signature takes ip, parent_ip, ftrace_ops, and ftrace_regs.',
      'Set ops.func and ops.flags, then register_ftrace_function(&ops).',
      'Use %pS to symbolize the instruction pointers.',
    ],
    solution: `#include <linux/ftrace.h>
#include <linux/printk.h>

static void my_trace(unsigned long ip, unsigned long parent_ip,
                     struct ftrace_ops *op, struct ftrace_regs *fregs)
{
    pr_info("enter %pS from %pS\\n", (void *)ip, (void *)parent_ip);
}

static struct ftrace_ops my_ops = {
    .func  = my_trace,
    .flags = FTRACE_OPS_FL_SAVE_REGS,
};

static int __init ft_init(void)
{
    return register_ftrace_function(&my_ops);
}`,
    starter: `#include <linux/ftrace.h>
#include <linux/printk.h>

static void my_trace(unsigned long ip, unsigned long parent_ip,
                     struct ftrace_ops *op, struct ftrace_regs *fregs)
{
    /* TODO: log ip and parent_ip as symbols */
}

static struct ftrace_ops my_ops = {
    /* TODO: func and flags */
};

static int __init ft_init(void)
{
    /* TODO: register the ftrace function */
}`,
    tags: ['ftrace', 'function-tracer', 'tracing'],
  },
  {
    id: 'lx-ch14-c-063',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Trigger And Diagnose A KASAN Bug',
    prompt: `Write int kasan_demo(void) that deliberately triggers a use-after-free that KASAN will catch: allocate a 16-byte buffer with kmalloc, free it, then read one byte from it into a volatile sink. Return the byte. Add a comment naming the exact KASAN report category this produces and which allocation/free stacks the report will show.`,
    hints: [
      'KASAN instruments every load/store; touching freed memory is a use-after-free.',
      'The report header reads "BUG: KASAN: use-after-free" with allocated and freed-by stacks.',
      'Use a volatile read so the compiler cannot optimize the access away.',
    ],
    solution: `#include <linux/slab.h>

int kasan_demo(void)
{
    char *p = kmalloc(16, GFP_KERNEL);
    volatile char sink;

    if (!p)
        return -ENOMEM;
    kfree(p);
    /* Reading p now is a use-after-free: KASAN prints
     * "BUG: KASAN: use-after-free in kasan_demo" with the
     * "Allocated by task" and "Freed by task" stack traces. */
    sink = p[0];
    return sink;
}`,
    starter: `#include <linux/slab.h>

int kasan_demo(void)
{
    /* TODO: kmalloc 16, kfree, then read p[0] (use-after-free) */
}`,
    tags: ['kasan', 'use-after-free', 'debug'],
  },
  {
    id: 'lx-ch14-c-064',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Lockdep Detectable Deadlock Pattern',
    prompt: `Demonstrate the AB-BA ordering bug lockdep catches. Given two spinlocks lock_a and lock_b, write thread_one() that takes a then b, and thread_two() that takes b then a, each releasing in reverse order. Add a comment explaining what lockdep reports and why the order inversion is the bug even if no real deadlock occurs at runtime.`,
    hints: [
      'Lockdep builds a lock-ordering graph and flags any cycle.',
      'It reports "possible circular locking dependency detected" the first time both orders are seen.',
      'Always release in reverse acquisition order.',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(lock_a);
static DEFINE_SPINLOCK(lock_b);

void thread_one(void)
{
    spin_lock(&lock_a);
    spin_lock(&lock_b);   /* order A -> B */
    /* ... */
    spin_unlock(&lock_b);
    spin_unlock(&lock_a);
}

void thread_two(void)
{
    /* order B -> A: the inversion. Lockdep records both edges and
     * reports "possible circular locking dependency detected"; the
     * inconsistent order is unsafe even if it never deadlocks live. */
    spin_lock(&lock_b);
    spin_lock(&lock_a);
    /* ... */
    spin_unlock(&lock_a);
    spin_unlock(&lock_b);
}`,
    starter: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(lock_a);
static DEFINE_SPINLOCK(lock_b);

void thread_one(void)
{
    /* TODO: lock a then b, unlock in reverse */
}

void thread_two(void)
{
    /* TODO: lock b then a (the inversion) */
}`,
    tags: ['lockdep', 'spinlock', 'deadlock'],
  },
  {
    id: 'lx-ch14-c-065',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Decode An Oops Faulting Instruction',
    prompt: `Write the C function whose typical compilation produces a NULL-pointer-dereference oops: int read_count(struct counter *c) that returns c->count without checking c. Then, in a block comment, explain how to map the oops line "RIP: ... read_count+0x4/0x20" back to source: what the offset means, and which tools (objdump / addr2line / gdb list) you would use on the vmlinux or .ko to find the exact line.`,
    hints: [
      'The oops RIP shows symbol+offset/size; the offset is the byte distance into the function.',
      'addr2line -e vmlinux <addr>, or objdump -dr on the .ko, maps it to source.',
      'A NULL c makes the load from c->count fault with "BUG: kernel NULL pointer dereference".',
    ],
    solution: `struct counter { int count; };

int read_count(struct counter *c)
{
    /* If c == NULL this load oopses:
     *   "BUG: kernel NULL pointer dereference"
     *   RIP: read_count+0x4/0x20
     * The +0x4 is the byte offset into read_count, /0x20 its size.
     * To find the source line:
     *   addr2line -e vmlinux <RIP address>, or
     *   objdump -dr mymod.ko then locate read_count+0x4, or
     *   gdb vmlinux -ex 'list *(read_count+0x4)'.
     */
    return c->count;
}`,
    starter: `struct counter { int count; };

int read_count(struct counter *c)
{
    /* TODO: return c->count (unchecked) and document
     * how to decode the resulting oops RIP back to source */
}`,
    tags: ['oops', 'backtrace', 'debug'],
  },
  {
    id: 'lx-ch14-c-066',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Tracepoint With A Registered Probe',
    prompt: `Attach your own probe to an existing tracepoint. Write a probe function void probe_sched_switch(void *data, bool preempt, struct task_struct *prev, struct task_struct *next, unsigned int prev_state) that logs prev->pid and next->pid, then an init that connects it with register_trace_sched_switch and an exit that disconnects with unregister_trace_sched_switch. Include the tracepoint header.`,
    hints: [
      'register_trace_<event>(probe, data) hooks a callback onto a kernel tracepoint.',
      'The probe signature must match the tracepoint proto, with a leading void *data.',
      'Pair with unregister_trace_<event> on teardown.',
    ],
    solution: `#include <linux/sched.h>
#include <linux/tracepoint.h>
#include <trace/events/sched.h>

static void probe_sched_switch(void *data, bool preempt,
                               struct task_struct *prev,
                               struct task_struct *next,
                               unsigned int prev_state)
{
    pr_info("switch %d -> %d\\n", prev->pid, next->pid);
}

static int __init tp_init(void)
{
    return register_trace_sched_switch(probe_sched_switch, NULL);
}

static void __exit tp_exit(void)
{
    unregister_trace_sched_switch(probe_sched_switch, NULL);
}`,
    starter: `#include <linux/sched.h>
#include <linux/tracepoint.h>
#include <trace/events/sched.h>

static void probe_sched_switch(void *data, bool preempt,
                               struct task_struct *prev,
                               struct task_struct *next,
                               unsigned int prev_state)
{
    /* TODO: log prev->pid and next->pid */
}

static int __init tp_init(void)
{
    /* TODO: register the probe */
}

static void __exit tp_exit(void)
{
    /* TODO: unregister the probe */
}`,
    tags: ['tracepoint', 'sched', 'tracing'],
  },
  {
    id: 'lx-ch14-c-067',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Out Of Bounds Access For KASAN',
    prompt: `Write int oob_demo(int i) that allocates an array of 8 ints, writes index i, frees the array, and returns 0; calling it with i == 8 must trigger a KASAN slab-out-of-bounds report. In a comment, contrast this report's category with a use-after-free and name the redzone concept KASAN uses to detect the overflow.`,
    hints: [
      'KASAN places poisoned redzones around each allocation; writing past the end hits them.',
      'The report header is "BUG: KASAN: slab-out-of-bounds", distinct from "use-after-free".',
      'Index 8 in an 8-element array is one past the end.',
    ],
    solution: `#include <linux/slab.h>

int oob_demo(int i)
{
    int *arr = kmalloc_array(8, sizeof(int), GFP_KERNEL);

    if (!arr)
        return -ENOMEM;
    /* i == 8 writes into the poisoned redzone past arr[7]:
     * KASAN reports "slab-out-of-bounds" (a spatial bug), whereas
     * touching freed memory is "use-after-free" (a temporal bug). */
    arr[i] = 0;
    kfree(arr);
    return 0;
}`,
    starter: `#include <linux/slab.h>

int oob_demo(int i)
{
    /* TODO: alloc 8 ints, write arr[i], free; i==8 is OOB */
}`,
    tags: ['kasan', 'out-of-bounds', 'debug'],
  },
  {
    id: 'lx-ch14-c-068',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Annotate A Nested Lock For Lockdep',
    prompt: `You legitimately take two instances of the same lock class (parent and child inodes). A naive spin_lock on both makes lockdep flag a self-deadlock. Write void lock_pair(struct my_inode *p, struct my_inode *c) that locks both p->lock and c->lock using the nesting annotation so lockdep accepts it, with the child at a deeper subclass. Use the correct nested variant.`,
    hints: [
      'spin_lock_nested(lock, subclass) tells lockdep this is a deliberate same-class nesting.',
      'Give the inner/child lock a higher subclass like SINGLE_DEPTH_NESTING.',
      'Without the annotation lockdep warns about recursive locking of one class.',
    ],
    solution: `#include <linux/spinlock.h>

struct my_inode { spinlock_t lock; };

void lock_pair(struct my_inode *p, struct my_inode *c)
{
    spin_lock(&p->lock);
    /* Same lock class as parent; annotate the nesting so lockdep
     * does not flag it as recursive self-deadlock. */
    spin_lock_nested(&c->lock, SINGLE_DEPTH_NESTING);
}`,
    starter: `#include <linux/spinlock.h>

struct my_inode { spinlock_t lock; };

void lock_pair(struct my_inode *p, struct my_inode *c)
{
    /* TODO: lock parent normally, child with nesting annotation */
}`,
    tags: ['lockdep', 'spinlock', 'nesting'],
  },
  {
    id: 'lx-ch14-c-069',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Conditional Tracepoint With DECLARE_EVENT_CLASS',
    prompt: `To avoid duplicating field definitions across two similar events, write a DECLARE_EVENT_CLASS named mydrv_xfer carrying an int id and a u32 len, then derive two events mydrv_xfer_start and mydrv_xfer_end from it with DEFINE_EVENT. Provide the class body (struct/assign/printk) and both DEFINE_EVENT lines. Assume header boilerplate exists.`,
    hints: [
      'DECLARE_EVENT_CLASS(name, proto, args, struct, assign, printk) factors shared layout.',
      'DEFINE_EVENT(class, event_name, proto, args) creates a concrete event reusing the class.',
      'The class itself emits no tracepoint; only the DEFINE_EVENTs do.',
    ],
    solution: `DECLARE_EVENT_CLASS(mydrv_xfer,

    TP_PROTO(int id, u32 len),

    TP_ARGS(id, len),

    TP_STRUCT__entry(
        __field(int, id)
        __field(u32, len)
    ),

    TP_fast_assign(
        __entry->id = id;
        __entry->len = len;
    ),

    TP_printk("id=%d len=%u", __entry->id, __entry->len)
);

DEFINE_EVENT(mydrv_xfer, mydrv_xfer_start,
    TP_PROTO(int id, u32 len),
    TP_ARGS(id, len)
);

DEFINE_EVENT(mydrv_xfer, mydrv_xfer_end,
    TP_PROTO(int id, u32 len),
    TP_ARGS(id, len)
);`,
    starter: `DECLARE_EVENT_CLASS(mydrv_xfer,
    /* TODO: proto, args, struct, assign, printk */
);

/* TODO: DEFINE_EVENT mydrv_xfer_start and mydrv_xfer_end */`,
    tags: ['tracepoint', 'event-class', 'ftrace'],
  },
  {
    id: 'lx-ch14-c-070',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Programmatic ftrace Function Filter',
    prompt: `Write int trace_only_kmalloc(void) that, before registering, restricts a struct ftrace_ops my_ops (with .func and .flags = FTRACE_OPS_FL_SAVE_REGS already set) so the callback fires only for functions matching the glob "kmalloc*". Use ftrace_set_filter on the ops, then register it. Return any error. Explain in a comment why filtering before registration avoids tracing every kernel function.`,
    hints: [
      'ftrace_set_filter(ops, buf, len, reset) sets a per-ops function filter with glob support.',
      'Pass reset=1 to start from an empty set, then register_ftrace_function.',
      'Without a filter the function tracer fires on every traceable function, which is expensive.',
    ],
    solution: `#include <linux/ftrace.h>
#include <linux/string.h>

extern struct ftrace_ops my_ops;

int trace_only_kmalloc(void)
{
    char filter[] = "kmalloc*";
    int ret;

    /* Restrict the callback to kmalloc* before enabling it; an
     * unfiltered function tracer would fire on every traceable
     * kernel function and add huge overhead. */
    ret = ftrace_set_filter(&my_ops, filter, strlen(filter), 1);
    if (ret)
        return ret;

    return register_ftrace_function(&my_ops);
}`,
    starter: `#include <linux/ftrace.h>
#include <linux/string.h>

extern struct ftrace_ops my_ops;

int trace_only_kmalloc(void)
{
    /* TODO: ftrace_set_filter to "kmalloc*", then register */
}`,
    tags: ['ftrace', 'filter', 'tracing'],
  },
]

export default problems
