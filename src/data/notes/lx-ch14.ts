import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-14',
  track: 'linux',
  chapter: 14,
  title: 'Debugging & Tracing',
  summary: `Kernel code runs with no debugger attached, no standard library, and no second chance: a single bad pointer can take the whole machine down, and the bug may live in code you cannot pause. This chapter is the toolbox that makes the kernel observable anyway - from the humble printk and dynamic debug, through the crash reports (oops, panic, BUG_ON) you must learn to read, to the production-grade tracing machinery: ftrace, tracepoints, kprobes, and perf. It closes with the runtime correctness checkers - kgdb for live source debugging, KASAN for memory bugs, and lockdep for deadlocks - that catch entire classes of defects before they reach users. For an open-source contributor these are not optional extras: a clean, decoded backtrace and a reproducer under KASAN are the difference between a patch that gets merged and a bug report that gets ignored.`,
  sections: [
    {
      heading: 'printk and dynamic debug: the first and last resort',
      body: `The oldest debugging tool in the kernel is also still the most used: **printk**, the kernel's printf. It writes into a fixed-size ring buffer (the *kernel log*) that you read with dmesg or via /dev/kmsg, and it works from almost anywhere - early boot, interrupt context, the middle of a crash - which is exactly why it survives when fancier tools cannot attach.

Every printk message carries a **log level** from KERN_EMERG (0) to KERN_DEBUG (7). The level does two things: it decides whether the message is printed to the console (controlled by the console_loglevel, which you can read and set via /proc/sys/kernel/printk) and it lets you grep by severity. Modern code rarely writes printk(KERN_INFO ...) directly; it uses the wrapper macros pr_emerg, pr_warn, pr_info, pr_debug, and inside a driver the device-aware dev_err, dev_warn, dev_info that prefix the message with the device name automatically. Prefer the device-aware forms in drivers - they make logs traceable to a specific piece of hardware.

### Why pr_debug is special: dynamic debug

A naive debug print is either compiled in (and spams the log forever) or compiled out (and useless when you finally need it). **Dynamic debug** solves this. When the kernel is built with CONFIG_DYNAMIC_DEBUG, every pr_debug and dev_dbg call site becomes individually controllable *at runtime* through the control file at /sys/kernel/debug/dynamic_debug/control. You can switch on debug output for one file, one line, one function, or one module without rebuilding or rebooting. This is the single most useful trick most newcomers do not know.

The catch worth remembering: until you enable a site, its message costs essentially nothing (a disabled branch), so leaving dev_dbg calls in production code is good practice, not clutter.

### Pitfalls

- printk inside a tight loop or a hot path floods the ring buffer and can itself wedge the system; use printk_ratelimited or pr_warn_ratelimited.
- Reading the log in dmesg shows a circular buffer - old messages are silently overwritten. If a boot crash scrolls away, increase the buffer with the log_buf_len boot parameter or use a serial console.
- Never log a raw kernel pointer with the plain pointer format; the kernel hashes %p by default to avoid leaking addresses. Use %pK awareness and the special printk pointer extensions (like %pS to symbolize an address) covered in the next section.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/printk.h>
#include <linux/device.h>
#include <linux/ratelimit.h>

// Plain leveled messages (preferred wrappers, not raw printk):
pr_info("mymod: initialized, %d channels\\n", nchan);
pr_warn("mymod: queue %u nearly full\\n", id);

// Device-aware: prefixes "driver dev: ..." automatically.
dev_err(&pdev->dev, "failed to map registers: %d\\n", ret);
dev_dbg(&pdev->dev, "irq %d fired, status=0x%x\\n", irq, status);

// Dynamic debug: pr_debug/dev_dbg are OFF until enabled at runtime.
pr_debug("entered %s with arg=%lu\\n", __func__, arg);

// Don't flood the log from a hot path:
pr_warn_ratelimited("mymod: dropping packet, ring full\\n");`
        },
        {
          lang: 'c',
          src: `// Enabling dynamic debug at RUNTIME (shell, not C) -- no rebuild needed.
// Turn on every pr_debug in one source file:
//   echo 'file mydriver.c +p' > /sys/kernel/debug/dynamic_debug/control
// One function only:
//   echo 'func my_probe +p' > /sys/kernel/debug/dynamic_debug/control
// A whole module, with line numbers and function names added:
//   echo 'module mymod +pfl' > /sys/kernel/debug/dynamic_debug/control
// Turn it back off:
//   echo 'module mymod -p' > /sys/kernel/debug/dynamic_debug/control
//
// Or enable at boot via the kernel command line:
//   dyndbg="module mymod +p"`
        }
      ]
    },
    {
      heading: 'oops, panic, and BUG_ON: how the kernel reports death',
      body: `When the kernel detects that something has gone irrecoverably wrong, it produces one of a small family of reports. Knowing which one you are looking at tells you how serious the situation is and how the kernel reacted.

### Oops

An **oops** is the kernel's reaction to a recoverable-ish fault - most commonly dereferencing a bad pointer (a NULL pointer dereference, or "unable to handle kernel paging request"). The kernel kills the offending process or thread, prints a detailed report (registers, a stack trace, the faulting instruction), sets a *tainted* flag, and tries to keep running. Crucially, an oops does not always mean the system is healthy afterward: the offending thread may have held a lock or left a data structure half-updated, so the machine is now in an undefined state. Treat the first oops in a log as the real bug and ignore the cascade of secondary failures that often follows.

### Panic

A **panic** is unrecoverable: the kernel calls panic(), prints the message, and halts (or reboots, if panic_on_* or the panic= timeout is set). You get a panic when continuing is impossible or unsafe - corrupted core data structures, a fault in an interrupt handler that cannot be unwound, or an oops that the kernel was configured to escalate (panic_on_oops=1). In production, panic-and-reboot is often *preferable* to limping along corrupted; that is why servers set it.

### BUG_ON and WARN_ON

These are assertions you place in code.
- **BUG_ON(condition)** triggers an oops (effectively a panic on many configs) if the condition is true. It means "this must never happen, and if it does the kernel cannot safely continue." Use it sparingly - taking the machine down is a heavy hammer, and maintainers increasingly discourage BUG_ON in new code where a graceful error is possible.
- **WARN_ON(condition)** and WARN_ON_ONCE are far friendlier: they print a full backtrace and taint the kernel, but execution continues. This is the right tool for "this shouldn't happen, but we can recover" - it surfaces the bug loudly in logs (and CI, and syzkaller) without killing the box. WARN_ON_ONCE fires only the first time, avoiding log floods for a repeating condition.

> Guidance for contributors: reviewers strongly prefer WARN_ON_ONCE plus error return over BUG_ON. Reserve BUG_ON for invariants whose violation means memory is already corrupt and continuing would be more dangerous than stopping.`,
      code: [
        {
          lang: 'c',
          src: `// Assertions in kernel code.

// "Cannot possibly continue" - heavy, takes the machine down. Use rarely.
BUG_ON(list_empty(&must_have_entries));

// Preferred: warn loudly + recover. Taints kernel, prints backtrace,
// but execution continues so users keep running.
if (WARN_ON_ONCE(ptr == NULL))
    return -EINVAL;          // recover gracefully after warning

// WARN with a message and condition in one call:
WARN(refcount_read(&obj->ref) == 0,
     "use-after-free: refcount already zero for obj %p\\n", obj);

// You can deliberately trigger a panic for unrecoverable corruption:
if (magic != EXPECTED_MAGIC)
    panic("myfs: superblock corrupted, magic=0x%x\\n", magic);`
        }
      ]
    },
    {
      heading: 'Decoding a stack trace',
      body: `An oops or WARN dumps a **call trace**: a list of return addresses peeled off the kernel stack, each ideally resolved to a function name plus an offset. Reading it fluently is a core skill - most of debugging is figuring out *who called the code that crashed*.

### Anatomy of a report

A typical oops shows, in order: the reason line (for example "BUG: kernel NULL pointer dereference at..."), the faulting address and the instruction pointer as symbol plus offset (RIP: 0010:my_func+0x2a/0x80 meaning "42 bytes into my_func, whose body is 0x80 bytes"), the CPU registers, the Code line (raw bytes around the faulting instruction), and then the Call Trace. The offset notation func+0x2a/0x80 is the key to locating the exact line later.

### Symbolizing: turning addresses into source lines

Two things make a trace readable. First, the kernel must resolve raw addresses to symbols - it does this automatically if built with symbol tables, and the printk format %pS / %pF prints an address as a symbol. Second, to go from func+offset to a *file and line number* you use **addr2line** or, more conveniently, the kernel's scripts/decode_stacktrace.sh, which pipes a pasted trace through addr2line using your vmlinux. This is how you convert my_func+0x2a into drivers/foo/bar.c:137.

For modules you need the per-module object; for a stripped production kernel you need the matching vmlinux with debug info. Mismatched vmlinux gives confidently wrong line numbers, a classic time-waster.

### Reading direction and the "?" marks

The Call Trace lists the most recent call first (top) going back toward the entry point. Some lines are prefixed with a question mark: those are addresses found on the stack that the unwinder is *not confident* are real return addresses (stale leftovers from previous calls). Mentally skip the "?" entries and follow the unmarked frames - those are the reliable backbone of the call chain.

### Taint flags

Near the top you will see a Tainted: line with letters like G, O, or W. These tell you the kernel's history - O means an out-of-tree module was loaded, W means a warning fired earlier, P a proprietary module. Maintainers often ignore bug reports from a tainted kernel because the out-of-tree code, not the kernel, may be at fault.`,
      code: [
        {
          lang: 'c',
          src: `// A trimmed oops as it appears in dmesg (this is log output, not C):
//
//  BUG: kernel NULL pointer dereference, address: 0000000000000000
//  RIP: 0010:my_read+0x2a/0x80 [mymod]
//  Code: 48 8b 47 08 ...
//  Call Trace:
//   <TASK>
//   vfs_read+0x9d/0x190
//   ksys_read+0x6f/0xf0
//   ? syscall_exit_to_user_mode+0x1b/0x40   <- "?" = unreliable, skip
//   do_syscall_64+0x5c/0x90
//   entry_SYSCALL_64_after_hwframe+0x6e/0xd8
//   </TASK>
//  Tainted: G           O       <- out-of-tree module loaded
//
// my_read+0x2a is the faulting instruction; vfs_read called it.`
        },
        {
          lang: 'c',
          src: `// Turning func+offset into file:line (shell tooling, not C):
//
// Easiest - paste the whole Call Trace into the decoder:
//   ./scripts/decode_stacktrace.sh vmlinux < oops.txt
//
// Manual - one address at a time against the kernel image:
//   addr2line -e vmlinux -f -i ffffffff81234a2a
// For a module, point at its .ko (with debug info):
//   addr2line -e mymod.ko -f -i 0x2a
//
// Build with debug info so this works:
//   CONFIG_DEBUG_INFO=y   (and keep the matching vmlinux!)`
        }
      ]
    },
    {
      heading: 'ftrace and the function tracer',
      body: `**ftrace** is the kernel's built-in tracing framework, controlled entirely through a virtual filesystem (tracefs, usually mounted at /sys/kernel/tracing or under .../debug/tracing). It needs no special tools - you can drive it with echo and cat - which makes it invaluable on a minimal or embedded system. Its headline feature is the **function tracer**: with near-zero overhead when off, it can record every kernel function entry as it happens.

### How it works and why it is cheap

When the kernel is built with CONFIG_FUNCTION_TRACER, the compiler inserts a tiny callable stub at the start of (almost) every function. When tracing is off, these stubs are patched to no-ops, so the cost is negligible. When you enable a tracer, ftrace live-patches the stubs to call into its machinery. This dynamic patching is why ftrace can be left compiled in on production kernels.

### The tracers you will use

Set the active tracer by writing to current_tracer:
- **function** records every function call - a firehose, so always narrow it.
- **function_graph** draws an indented call graph *with the duration* of each function, which is gold for understanding control flow and spotting where time goes.
- **nop** is the off switch.

### Narrowing the firehose

Tracing everything is useless noise. The essential filters:
- set_ftrace_filter limits tracing to functions matching a pattern (it accepts globs like ext4_*).
- set_ftrace_notrace excludes functions.
- set_ftrace_pid restricts to one process.

You start and stop recording with tracing_on, read the human-readable result from the trace file, and reset everything by writing nop to current_tracer and emptying the filters. Because the trace buffer is per-CPU and fixed-size, a busy trace wraps quickly; capture, then turn it off.

> Pitfall: the trace file is a snapshot you can re-read; trace_pipe is a *consuming* stream (reading drains it). Use trace_pipe for live following, trace for a stable capture.`,
      code: [
        {
          lang: 'c',
          src: `// Driving ftrace by hand (shell on the target, not C).
// All paths under /sys/kernel/tracing  (a.k.a. tracefs).
//
//   cd /sys/kernel/tracing
//
// 1. See available tracers:
//   cat available_tracers      # function function_graph nop ...
//
// 2. Trace only ext4 functions, as an indented call graph w/ timings:
//   echo function_graph > current_tracer
//   echo 'ext4_*'       > set_ftrace_filter
//   echo 1 > tracing_on
//   # ... run the workload ...
//   echo 0 > tracing_on
//   cat trace                  # read the captured graph
//
// 3. Reset everything:
//   echo nop > current_tracer
//   echo    > set_ftrace_filter   # clearing it traces all again`
        }
      ]
    },
    {
      heading: 'Tracepoints and kprobes: two ways to instrument',
      body: `Beyond whole-function tracing, the kernel offers two complementary ways to observe specific events: tracepoints (static, designed in advance) and kprobes (dynamic, attach anywhere).

### Tracepoints: the stable, designed-in hooks

A **tracepoint** is a named instrumentation point that a kernel developer deliberately placed in the source - sched_switch, kmalloc, block_rq_issue, and thousands more. When no one is listening, a tracepoint is a single unconditional-branch no-op, so it is essentially free; when you enable it, registered probes receive the event along with a structured set of fields. Because they are part of the source and have a documented format, tracepoints are the *preferred* observation surface: they are reviewed, relatively stable across releases, and self-describing.

You enable them through ftrace's events directory or, far more ergonomically, with the perf and trace-cmd tools. Each tracepoint exposes a format file describing its fields, and you can attach a *filter* expression so only matching events are recorded (for example, only the sched_switch events for one PID). Tracepoints are the foundation that higher tools (perf, BPF programs, trace-cmd) build on.

### kprobes: instrument any instruction, dynamically

A **kprobe** lets you trap *almost any* kernel instruction address at runtime, even functions with no tracepoint. The mechanism is clever: kprobes replaces the target instruction with a breakpoint, runs your handler when it is hit, single-steps the original instruction, and continues. A **kretprobe** specializes this to fire on function *return*, giving you the return value - perfect for "did this function fail, and with what?" A **pre-handler** runs before the instruction (you can inspect the arguments via the saved register state).

The power is also the danger: because a kprobe can land on truly arbitrary code, a buggy handler runs in a very constrained context (often with interrupts disabled) and can destabilize the kernel. Some functions are blacklisted from probing for safety. In modern practice you rarely write raw kprobe modules; you use kprobe *events* (echoed into kprobe_events in tracefs) or, better, attach BPF programs to kprobes via perf or bpftrace, which sandbox the handler.

> Rule of thumb: reach for a tracepoint if one exists (stable, cheap, documented). Use a kprobe only when you must observe a spot the developers did not expose - and remember kprobe targets are tied to internal symbol names that can change between versions.`,
      code: [
        {
          lang: 'c',
          src: `// (A) Enabling a STATIC tracepoint via ftrace (shell):
//   cd /sys/kernel/tracing
//   echo 1 > events/sched/sched_switch/enable
//   cat events/sched/sched_switch/format     # see the fields
//   echo 'prev_pid == 1234' > events/sched/sched_switch/filter
//   cat trace_pipe                            # live stream of events
//
// (B) Creating a dynamic KPROBE event - no module needed (shell):
//   # probe entry of do_sys_openat2, capture the filename arg:
//   echo 'p:myopen do_sys_openat2 file=+0(%si):string' \\
//        > /sys/kernel/tracing/kprobe_events
//   echo 1 > /sys/kernel/tracing/events/kprobes/myopen/enable
//   cat /sys/kernel/tracing/trace_pipe`
        },
        {
          lang: 'c',
          src: `// A classic in-kernel kretprobe module: log the return value of a func.
#include <linux/kprobes.h>
#include <linux/module.h>

static int ret_handler(struct kretprobe_instance *ri, struct pt_regs *regs)
{
    // regs_return_value() extracts the function's return value portably.
    long retval = regs_return_value(regs);
    pr_info("do_sys_openat2 returned %ld\\n", retval);
    return 0;
}

static struct kretprobe my_kretprobe = {
    .handler      = ret_handler,
    .kp.symbol_name = "do_sys_openat2",   // attach by symbol name
    .maxactive    = 20,                   // concurrent in-flight calls
};

static int __init m_init(void)  { return register_kretprobe(&my_kretprobe); }
static void __exit m_exit(void) { unregister_kretprobe(&my_kretprobe); }
module_init(m_init);
module_exit(m_exit);
MODULE_LICENSE("GPL");`
        }
      ]
    },
    {
      heading: 'perf: sampling, counting, and tying it together',
      body: `**perf** is the kernel's all-purpose performance and tracing tool, backed by the perf_events subsystem. Where ftrace records *every* occurrence, perf's signature mode is **statistical sampling**: it periodically interrupts the CPU (driven by hardware performance counters such as cycles, or by a timer) and records *where* the code was executing. Aggregate enough samples and you get a profile showing which functions burn the most time - without the overhead of tracing every call.

### The three things perf does

1. **Count** events with perf stat: run a command and report totals - cycles, instructions, cache misses, context switches, page faults. This answers "is this workload CPU-bound, memory-bound, or stalling?"
2. **Sample and profile** with perf record then perf report: capture stacks at intervals, then browse a ranked, foldable call tree of where time (or cache misses, or any counter) was spent. perf report --stdio or an interactive TUI both work; folding the stacks produces flame graphs.
3. **Trace events** with perf trace and perf record -e: perf can record tracepoints, kprobes, and uprobes too, so it unifies sampling and event tracing under one tool.

### Why sampling, and its limits

Sampling scales: a 1000 Hz profile of a busy server costs little yet reveals hot paths. The tradeoffs are that rare events between samples are invisible (sampling is probabilistic), and that meaningful stacks require frame pointers or DWARF unwinding - so you often pass --call-graph dwarf or build with frame pointers, or stacks show up truncated. Symbol resolution again needs debug info or a matching vmlinux; without it you get raw addresses.

### For contributors

perf is how you justify a performance patch: show a before/after perf stat (fewer instructions, fewer cache misses) or a flame graph that moves the hot function out of the profile. A benchmark claim without perf numbers is much weaker in review.`,
      code: [
        {
          lang: 'c',
          src: `// perf workflow (shell on the target, not C):
//
// Count hardware/software events for one command:
//   perf stat -e cycles,instructions,cache-misses ./mybench
//   perf stat -d ./mybench           # -d adds a "detailed" set
//
// Sample a running system for 10s with call graphs, then report:
//   perf record -F 999 -a -g -- sleep 10     # -a all CPUs, -F 999 Hz
//   perf report                              # interactive TUI
//   perf report --stdio | head               # or plain text
//
// Better stacks when frame pointers are missing:
//   perf record -F 999 -a --call-graph dwarf -- sleep 10
//
// Record a specific tracepoint instead of sampling:
//   perf record -e sched:sched_switch -a -- sleep 5
//
// Build a flame graph from the folded stacks (FlameGraph scripts):
//   perf script | stackcollapse-perf.pl | flamegraph.pl > out.svg`
        }
      ]
    },
    {
      heading: 'kgdb, KASAN, and lockdep: live debugging and correctness checkers',
      body: `The final group catches bugs that logging cannot. Two are *always-on checkers* that detect whole classes of defects automatically; one is a true source-level debugger.

### kgdb: source debugging of a live kernel

**kgdb** turns the kernel into a gdb remote target. You connect a host gdb over a serial line or network (using kgdboc, "kgdb over console") to a target machine, and from there you get the full gdb experience: breakpoints in kernel code, single-stepping, inspecting variables and structures, backtraces. The trade is that when the target hits a breakpoint, the *entire machine freezes* (it is stopped in the debugger), so kgdb is for development boxes and VMs, not production. A common modern setup is a kernel running under QEMU with gdb attached to QEMU's gdbstub, which avoids needing two physical machines. The companion **kdb** is a simpler built-in shell-style debugger for quick inspection without a host gdb.

### KASAN: catching memory corruption

**KASAN** (Kernel Address SANitizer) is a compiler-assisted detector for the deadliest kernel bugs: out-of-bounds accesses and use-after-free. Built with CONFIG_KASAN, the compiler instruments every memory access to consult a *shadow memory* that records which bytes are valid; an access to a poisoned byte triggers an immediate, detailed report pinpointing the bad access *and* where the memory was allocated and freed. This is transformative - it turns a vague "random corruption hours later" into an exact stack trace at the moment of the bug. The cost is real (roughly 2-3x slowdown and significant memory for the shadow), so KASAN is a *testing* tool: you run it in CI, under syzkaller, and when chasing corruption, not in production. For contributors, "reproduces under KASAN with this trace" is one of the most actionable bug reports you can file.

### lockdep: proving you cannot deadlock

**lockdep** (the lock dependency validator, CONFIG_PROVE_LOCKING) watches every lock acquisition at runtime and builds a graph of the *order* in which locks are taken. If it ever observes that lock A is taken before B in one place and B before A in another - a classic recipe for deadlock - it reports the dangerous cycle *even if the deadlock did not actually happen this time*. It also catches taking a sleeping lock in atomic context, IRQ-unsafe ordering, and double-locks. Like KASAN it adds overhead and is for testing kernels, and like KASAN its reports are gold: a "possible circular locking dependency" splat tells you exactly which two lock orders conflict before a real user ever hangs.

> The unifying idea: kgdb gives you interactive control, while KASAN and lockdep give you *automatic, exhaustive* detection of memory and locking bugs. Run your changes under a KASAN + lockdep kernel before sending a patch - maintainers expect it, and CI will do it anyway.`,
      code: [
        {
          lang: 'c',
          src: `// Kernel config to enable these checkers (.config / menuconfig):
//   CONFIG_KGDB=y
//   CONFIG_KGDB_SERIAL_CONSOLE=y
//   CONFIG_KASAN=y                 // memory bug detector (testing kernels)
//   CONFIG_KASAN_INLINE=y          // faster instrumentation
//   CONFIG_PROVE_LOCKING=y         // lockdep: lock-order validation
//   CONFIG_DEBUG_INFO=y            // needed for usable symbols
//
// Attach gdb to a kernel running under QEMU (host shell):
//   qemu-system-x86_64 ... -s        # -s opens gdbstub on :1234
//   gdb vmlinux
//     (gdb) target remote :1234
//     (gdb) break sys_mkdir
//     (gdb) continue`
        },
        {
          lang: 'c',
          src: `// A use-after-free that KASAN catches instantly, with a precise report
// naming the free site and the access site:
struct foo *p = kmalloc(sizeof(*p), GFP_KERNEL);
kfree(p);
p->field = 1;          // KASAN: use-after-free in ... ; freed by ...

// A lock-ordering inversion that lockdep flags as a potential deadlock,
// even if it never actually deadlocks at runtime:
// Thread 1:                    Thread 2:
//   mutex_lock(&a);              mutex_lock(&b);
//   mutex_lock(&b);  // A->B      mutex_lock(&a);  // B->A  <-- lockdep:
//   ...                          ...              "circular locking
//   mutex_unlock(&b);            mutex_unlock(&a);  dependency detected"
//   mutex_unlock(&a);            mutex_unlock(&b);`
        }
      ]
    }
  ],
  takeaways: [
    'printk writes to a fixed circular log read with dmesg; prefer the pr_* and dev_* wrappers, and rate-limit on hot paths so logging itself does not wedge the machine.',
    'Dynamic debug makes every pr_debug/dev_dbg site individually switchable at runtime via /sys/kernel/debug/dynamic_debug/control - no rebuild, no reboot - so leaving debug prints in is good practice.',
    'An oops kills the faulting thread but leaves the kernel in an undefined state; a panic halts the box; BUG_ON is a heavy assertion - prefer WARN_ON_ONCE plus graceful error return in new code.',
    'Read a Call Trace top-to-bottom (most recent call first), skip the "?" frames as unreliable, and use scripts/decode_stacktrace.sh or addr2line against the MATCHING vmlinux to get file:line.',
    'ftrace is driven through tracefs with echo/cat; function_graph shows an indented call graph with timings, and you must narrow it with set_ftrace_filter or it is an unreadable firehose.',
    'Prefer static tracepoints (cheap, stable, self-describing) when one exists; use a kprobe/kretprobe only to observe a spot developers did not expose - and beware version-fragile symbol names.',
    'perf samples statistically using hardware counters: perf stat counts events, perf record + perf report profiles where time goes; meaningful stacks need frame pointers or --call-graph dwarf.',
    'kgdb gives full gdb source debugging of a live kernel but freezes the whole machine - use it on VMs/QEMU, not production.',
    'Run changes under a KASAN + lockdep kernel before submitting: KASAN pinpoints use-after-free and out-of-bounds with alloc/free traces, lockdep proves lock-order inversions before any real deadlock occurs.'
  ],
  cheatsheet: [
    { label: 'pr_info / pr_warn / pr_err', value: 'Leveled kernel log wrappers around printk; dev_* variants add the device name' },
    { label: 'pr_debug / dev_dbg', value: 'Dynamic-debug sites: off by default, toggled at runtime, near-zero cost when off' },
    { label: 'dynamic_debug/control', value: 'tracefs file to enable debug by file/func/module/line: echo file x.c +p > control' },
    { label: 'dmesg', value: 'Read the kernel log ring buffer; old messages silently wrap and are lost' },
    { label: 'oops vs panic', value: 'oops kills thread, keeps running (state suspect); panic halts/reboots the machine' },
    { label: 'BUG_ON vs WARN_ON_ONCE', value: 'BUG_ON takes the box down; WARN_ON_ONCE prints backtrace + taints, keeps going' },
    { label: 'func+0x2a/0x80', value: 'Symbol+offset/size in a trace; feed to addr2line/decode_stacktrace.sh for file:line' },
    { label: 'decode_stacktrace.sh', value: 'scripts/ helper: pipes a pasted oops through addr2line using vmlinux' },
    { label: 'Tainted: G O W', value: 'Kernel history flags (O=out-of-tree mod, W=warned, P=proprietary); affects triage' },
    { label: 'current_tracer', value: 'tracefs: select function / function_graph / nop; function_graph shows timings' },
    { label: 'set_ftrace_filter', value: 'Restrict ftrace to matching functions (globs like ext4_*); essential to cut noise' },
    { label: 'kprobe_events', value: 'tracefs file to create dynamic probes on arbitrary kernel addresses at runtime' },
    { label: 'perf stat / record / report', value: 'Count events / sample with stacks / browse a ranked profile of where time goes' },
    { label: 'CONFIG_KASAN / PROVE_LOCKING', value: 'KASAN = use-after-free/OOB detector; lockdep = deadlock/lock-order validator (testing)' }
  ]
}

export default note
