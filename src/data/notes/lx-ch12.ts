import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-12',
  track: 'linux',
  chapter: 12,
  title: 'Time, Timers & Delays',
  summary: `The Linux kernel has to answer two distinct questions about time constantly: "what time is it now?" and "run this code later." This chapter covers both - the cheap, coarse tick counter (jiffies) that drives scheduling and timeouts, the higher-resolution clocks behind hrtimers, and the whole toolbox for deferring work or pausing: classic kernel timers, hrtimers, delayed workqueues, busy-loops like udelay, and real sleeps like msleep and schedule_timeout. Getting this right is core to almost every driver, because the wrong choice burns a CPU spinning, sleeps in an atomic context and deadlocks the box, or - subtly - breaks the moment jiffies wraps around. We will be precise about what runs in interrupt context versus process context, and why time comparisons must always go through the time_after family of macros.`,
  sections: [
    {
      heading: 'jiffies and HZ: the kernel heartbeat',
      body: `The oldest and cheapest notion of time in the kernel is the **tick**. A periodic timer interrupt fires at a fixed frequency and, on each fire, increments a global counter called **jiffies**. The frequency of that interrupt is the compile-time constant **HZ**. So jiffies is simply "how many ticks have elapsed since boot," and HZ tells you how many ticks make one second.

HZ is configurable per build - common values are 100, 250 (a frequent default), 300, and 1000. A higher HZ means finer timer resolution and snappier preemption but more interrupt overhead; a lower HZ means coarser timing but less overhead. Because HZ varies, you must **never hard-code a number of ticks**. Convert from real time using the helpers: msecs_to_jiffies, usecs_to_jiffies, and the reverse jiffies_to_msecs. If you want "half a second from now" you write jiffies + msecs_to_jiffies(500), not jiffies + 250.

### What jiffies is good for, and what it is not

jiffies is perfect for **coarse-grained timeouts** - "give up waiting after 5 seconds," "poll this register again in 10 milliseconds." Reading it is essentially free: it is just a memory load. But its resolution is only one tick (1 to 10 ms depending on HZ), so it is useless for anything needing sub-millisecond precision, and it is not a wall-clock time of day. For that you use ktime or the timekeeping API, not jiffies.

### Width, wraparound, and the truth about jiffies_64

On a 32-bit counter at HZ=1000, jiffies wraps around to zero in just under 50 days. That wrap is not an edge case you can ignore - long-uptime servers cross it routinely, and naive comparisons break exactly there. The kernel actually maintains a full 64-bit **jiffies_64** that effectively never wraps, but the plain jiffies variable is the native machine word (32-bit on 32-bit arches). On 64-bit machines jiffies is already 64 bits wide. The portable rule is: assume jiffies can wrap, and only ever compare two jiffies values with the time_after / time_before macros (covered in the last section), never with a raw < or >.

> Note on tickless kernels: modern kernels with CONFIG_NO_HZ may suppress the periodic tick when a CPU is idle or running a single task, and update jiffies in a batch when needed. You do not have to care - jiffies still reads correctly - but it is why you should not assume the tick is literally firing every period.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/jiffies.h>

// HZ ticks make one second. Convert real time to ticks; never hard-code.
unsigned long half_sec   = msecs_to_jiffies(500);   // ticks in 0.5s
unsigned long deadline   = jiffies + msecs_to_jiffies(5000);  // 5s from now

// Reading "now" is just a memory load - extremely cheap.
unsigned long start = jiffies;
// ... do some work ...
unsigned long elapsed_ms = jiffies_to_msecs(jiffies - start);

// WRONG: hard-coded tick count breaks when HZ changes at build time.
//   unsigned long deadline = jiffies + 250;   // 0.25s? 2.5s? depends on HZ!

// For a never-wrapping 64-bit value (e.g. long-running statistics):
u64 t64 = get_jiffies_64();`
        }
      ]
    },
    {
      heading: 'Classic kernel timers: run a callback once, later',
      body: `The classic **kernel timer** (struct timer_list) is the workhorse for "call this function once, roughly N jiffies from now." You initialize a timer with a callback, arm it with an expiry expressed in jiffies, and the kernel runs your callback after that time has passed.

The single most important fact about a classic timer callback is **the context it runs in**: it executes in **softirq (interrupt) context**, not process context. That has hard consequences. Your callback **must not sleep** - no mutexes, no kmalloc with GFP_KERNEL, no copy_to_user, no msleep, nothing that can block. You may only use spinlocks (the irq-safe variety if you also touch the data from hardirq context) and atomic, non-blocking operations. If you need to do blocking work, the timer callback should kick a workqueue and return immediately.

### Setting up and arming

Modern kernels use timer_setup(timer, callback, flags) to wire the callback; the callback receives a pointer to the timer_list itself, and you recover your own structure with from_timer (a container_of wrapper). You arm or re-arm the timer with **mod_timer(timer, expires)**, passing an absolute expiry in jiffies. mod_timer is the canonical call: it both starts a fresh timer and reschedules an already-pending one, and it returns whether the timer was already pending - so you do not need a separate add_timer for the common case.

### Resolution, slack, and lifetime

Classic timers are tick-based, so their resolution is one jiffy and they are deliberately allowed timer "slack" - the kernel may fire several nearby timers together to save power. They are not for precise timing; they are for timeouts and periodic-ish housekeeping. For a periodic timer you re-arm inside the callback with mod_timer(timer, jiffies + interval).

Lifetime is where bugs live. Before you free the structure that contains a timer - or unload your module - you must stop the timer. **del_timer(timer)** cancels a pending timer but may return while the callback is still running on another CPU. **del_timer_sync(timer)** waits for any running callback to finish, and is what you almost always want on teardown. Freeing memory a live timer still points at is a textbook use-after-free.

> Pitfall: a self-rearming timer plus del_timer_sync can deadlock if the callback re-arms itself unconditionally - set a "shutting down" flag the callback checks before re-arming, then call del_timer_sync.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/timer.h>

struct my_dev {
    struct timer_list timer;
    bool   stopping;       // tells a periodic callback to stop re-arming
    /* ... */
};

// Runs in SOFTIRQ context: must NOT sleep, no GFP_KERNEL, no mutex.
static void my_timer_fn(struct timer_list *t)
{
    struct my_dev *dev = from_timer(dev, t, timer);  // container_of

    // ... do quick, non-blocking work, or schedule a workqueue ...

    if (!dev->stopping)                              // periodic re-arm
        mod_timer(&dev->timer, jiffies + msecs_to_jiffies(100));
}

void my_start(struct my_dev *dev)
{
    timer_setup(&dev->timer, my_timer_fn, 0);
    dev->stopping = false;
    // Arm (or re-arm) with an ABSOLUTE expiry in jiffies:
    mod_timer(&dev->timer, jiffies + msecs_to_jiffies(100));
}

void my_stop(struct my_dev *dev)
{
    dev->stopping = true;          // prevent the callback re-arming
    del_timer_sync(&dev->timer);   // wait out any in-flight callback
    // only now is it safe to free anything the timer touched
}`
        }
      ]
    },
    {
      heading: 'hrtimers: high-resolution, nanosecond timing',
      body: `Classic timers are tied to the jiffy tick, so their granularity is at best one millisecond and usually coarser. When you genuinely need precise, sub-millisecond timing - audio, precise sampling intervals, network pacing - you reach for the **high-resolution timer**, struct hrtimer.

hrtimers are not driven by the periodic tick. They sit on top of the system's high-resolution clock event devices and are programmed to fire at an exact nanosecond deadline expressed as a **ktime_t**. ktime_t is the kernel's 64-bit nanosecond time type; you build durations with helpers like ktime_set, ms_to_ktime, or ns_to_ktime, and read the current time of a clock with ktime_get.

### How an hrtimer works

You initialize an hrtimer with hrtimer_init, choosing a clock base (commonly CLOCK_MONOTONIC, which never jumps backward) and a mode (relative or absolute), then set its .function callback and start it with hrtimer_start. Like classic timers, the callback **runs in atomic/softirq context and must not sleep** - same restrictions apply.

The distinctive feature is the **return value of the callback**: it returns an enum hrtimer_restart. Return HRTIMER_NORESTART for a one-shot, or return HRTIMER_RESTART after calling hrtimer_forward_now(timer, interval) to make a clean, drift-free periodic timer. Forwarding from the *programmed* expiry rather than from "now plus interval" is what keeps a periodic hrtimer from accumulating drift.

### When to use which

Reach for an hrtimer only when classic-timer resolution is genuinely insufficient. hrtimers cost more - programming the hardware clock event device, more bookkeeping - so do not use them for plain second-scale timeouts where a classic timer or delayed work is cheaper and kinder to power management. As with classic timers, cancel before freeing: hrtimer_cancel waits for a running callback to finish (the sync-style teardown), while hrtimer_try_to_cancel does not block.

> Pitfall: if you want to *sleep* a process for a precise duration rather than fire a callback, you do not build an hrtimer yourself - use hrtimer_sleeper via usleep_range or the high-resolution variant of schedule. Building a raw hrtimer is for callback-style deferral, not for putting the current task to sleep.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/hrtimer.h>
#include <linux/ktime.h>

struct my_dev {
    struct hrtimer  hrt;
    ktime_t         period;     // e.g. 250 microseconds
};

// Atomic context: still no sleeping here.
static enum hrtimer_restart my_hrt_fn(struct hrtimer *t)
{
    struct my_dev *dev = container_of(t, struct my_dev, hrt);

    // ... precise, quick work ...

    // Drift-free periodic re-arm relative to the PROGRAMMED expiry:
    hrtimer_forward_now(t, dev->period);
    return HRTIMER_RESTART;          // or HRTIMER_NORESTART for one-shot
}

void my_start(struct my_dev *dev)
{
    dev->period = ms_to_ktime(0) + ns_to_ktime(250000);   // 250 us
    hrtimer_init(&dev->hrt, CLOCK_MONOTONIC, HRTIMER_MODE_REL);
    dev->hrt.function = my_hrt_fn;
    hrtimer_start(&dev->hrt, dev->period, HRTIMER_MODE_REL);
}

void my_stop(struct my_dev *dev)
{
    hrtimer_cancel(&dev->hrt);     // blocks until callback finishes
}`
        }
      ]
    },
    {
      heading: 'Busy-delays vs sleeps: the most consequential choice',
      body: `Sometimes you must simply wait a fixed amount of time - hardware needs 5 microseconds to settle after you toggle a line, or a datasheet says wait 20 milliseconds after power-on. There are two fundamentally different ways to wait, and choosing the wrong one is one of the most common and damaging kernel mistakes.

### Busy-delays: udelay, ndelay, mdelay

A **busy-delay** spins the CPU in a tight loop for the requested duration. **udelay(n)** burns the CPU for n microseconds, **ndelay(n)** for n nanoseconds, and **mdelay(n)** for n milliseconds. They are calibrated against the BogoMIPS loop measured at boot. Crucially they do **not** sleep and do **not** schedule - the CPU is pinned, doing nothing useful, for the whole duration.

That makes busy-delays the *only* legal way to wait in **atomic context** - inside an interrupt handler, while holding a spinlock, or in a timer callback - because in those contexts you are forbidden from sleeping. But the price is that the CPU does no other work. So busy-delays are acceptable only for **very short** waits, on the order of a few microseconds. Notice that mdelay literally spins for whole milliseconds; mdelay(100) wastes 100 ms of CPU and is almost always a sign that the code should have been able to sleep instead. Treat mdelay as a red flag.

### Sleeps: msleep, usleep_range, fsleep

A **sleep** puts the current task to sleep and yields the CPU to other work; the scheduler wakes it when the time elapses. **msleep(n)** sleeps at least n milliseconds. **usleep_range(min, max)** sleeps somewhere between min and max microseconds and is the preferred call for waits in the tens-to-hundreds of microseconds, because giving the kernel a range lets it batch your wakeup with nearby ones and save power. **fsleep** is a convenience wrapper that picks a sensible mechanism based on the magnitude.

Because sleeps schedule, they may **only** be called from **process context** with no spinlock held - never from an interrupt handler or a timer callback. The flip side of the freedom is imprecision: msleep can overshoot, especially at low HZ, since it is tick-based and rounds up; if you ask for msleep(1) at HZ=100 you may sleep up to ~20 ms. For short, more accurate sleeps use usleep_range, which is hrtimer-backed.

### The decision rule

Ask one question: am I allowed to sleep here? In atomic context (irq handler, spinlock held, timer/hrtimer callback) you must busy-delay, and only for a few microseconds. In process context, sleep - it frees the CPU. Reaching for mdelay or a long udelay in process context to "keep it simple" is almost always wrong.

> Pitfall: udelay for large values can lose accuracy and overflow the calibration math; for waits longer than roughly a millisecond in atomic context, reconsider the design rather than spinning. And never replace a sleep with a busy-delay just to dodge "might sleep" warnings - those warnings are telling you the real context.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/delay.h>

// --- ATOMIC context (irq handler / spinlock held / timer callback) ---
// You may NOT sleep here. Busy-delay only, and keep it tiny.
udelay(5);          // spin ~5 microseconds (CPU pinned, wasteful but legal)
ndelay(100);        // spin ~100 nanoseconds
// mdelay(100);     // RED FLAG: spins 100ms of CPU - almost never correct

// --- PROCESS context (e.g. a probe/open/ioctl handler) ---
// You CAN sleep, so yield the CPU instead of burning it.
msleep(20);                  // sleep >= 20 ms (coarse, may overshoot)
usleep_range(100, 200);      // sleep 100-200 us (preferred for short waits)

// Decision rule in one line:
//   can_sleep ? usleep_range/msleep  :  udelay/ndelay (and keep it short)`
        }
      ]
    },
    {
      heading: 'schedule_timeout and waiting with a deadline',
      body: `Sometimes you do not want to sleep for a fixed time - you want to wait *until something happens, but no longer than* a timeout. That bounded-wait pattern is built on **schedule_timeout**.

schedule_timeout(ticks) puts the current task to sleep for up to the given number of jiffies and then returns. But - and this trips up everyone the first time - it only sleeps if you have **first set the task state** to TASK_INTERRUPTIBLE or TASK_UNINTERRUPTIBLE with set_current_state. If the task state is still TASK_RUNNING when you call schedule_timeout, it returns essentially immediately. The two helper wrappers schedule_timeout_interruptible and schedule_timeout_uninterruptible set the state for you and are safer to use directly.

The return value is the number of jiffies **remaining** - it is zero if the full timeout elapsed, and nonzero if you were woken early (for the interruptible variant, by a signal). That return value is how you distinguish "timed out" from "something woke me."

### You rarely call it directly

In practice you almost never hand-roll a schedule_timeout loop. The kernel gives you condition-and-timeout primitives built on top of it that handle the state-setting, the wakeup, and the race-free condition check for you - above all **wait_event_timeout(wq, condition, timeout)**. It sleeps on a wait queue until either the condition becomes true or the timeout (in jiffies) expires, and returns the remaining jiffies (0 = timed out). Its interruptible sibling wait_event_interruptible_timeout additionally returns a negative error if a signal arrives. This is the idiomatic way to wait for an interrupt, a completion, or a hardware-ready bit with a safety timeout. Reach for these before writing a raw schedule_timeout.

### Completions

When the thing you are waiting for is a one-shot event ("DMA done," "firmware loaded"), the cleanest tool is a **struct completion**: the waiter calls wait_for_completion_timeout, and whoever finishes the work calls complete. Same timeout semantics, but purpose-built for the handoff and free of subtle wait-queue races.

> Pitfall: forgetting set_current_state before a bare schedule_timeout turns your intended sleep into a busy spin that returns instantly. Use the named wrappers or wait_event_timeout and avoid the trap entirely.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/sched.h>
#include <linux/wait.h>

// --- The low-level pattern (rarely written by hand) ---
set_current_state(TASK_INTERRUPTIBLE);     // REQUIRED, or it won't sleep
long remaining = schedule_timeout(msecs_to_jiffies(500));
// remaining == 0  -> full timeout elapsed
// remaining > 0   -> woken early (e.g. by a signal)

// --- The idiomatic way: wait for a condition WITH a deadline ---
// Returns remaining jiffies; 0 means it timed out before condition was true.
long ret = wait_event_timeout(dev->wq,
                              dev->data_ready,           // the condition
                              msecs_to_jiffies(1000));   // 1s deadline
if (ret == 0)
    return -ETIMEDOUT;                                   // hardware stuck

// --- One-shot handoff: completion with a timeout ---
// waiter:
if (!wait_for_completion_timeout(&dev->done, msecs_to_jiffies(2000)))
    return -ETIMEDOUT;
// other side, when the work finishes:
//   complete(&dev->done);`
        }
      ]
    },
    {
      heading: 'Delayed work: deferring sleepable work to a thread',
      body: `Timers and hrtimers run callbacks in atomic context, so they cannot sleep. But a huge amount of "do this later" work *needs* to sleep - it allocates memory, takes mutexes, talks to slow hardware. The bridge is the **workqueue**, and specifically **delayed work** (struct delayed_work) when you want that sleepable work to run after a delay.

Delayed work combines a timer with a workqueue. You schedule it to run after N jiffies; under the hood a timer fires when the delay expires and then queues your work item onto a kernel worker thread, where your handler runs in **process context and may sleep freely**. This is exactly the tool for "poll this device every second," "retry after a backoff," or "after the timer fires, do something that blocks."

### The API

Declare a delayed_work and its handler, then arm it with **schedule_delayed_work(&dwork, delay_in_jiffies)** to put it on the shared system workqueue, or queue_delayed_work(wq, &dwork, delay) for your own dedicated workqueue. For periodic work, re-arm at the end of the handler by calling schedule_delayed_work again - and because the handler runs in process context, it is perfectly fine for it to sleep before re-arming.

### Cancellation and teardown

The lifetime discipline mirrors timers. **cancel_delayed_work(&dwork)** cancels a not-yet-started item but does not wait for a running handler. **cancel_delayed_work_sync(&dwork)** cancels and waits for any in-flight handler to finish - this is what you call before freeing the containing structure or unloading the module. As with self-rearming timers, a periodic delayed work that unconditionally re-queues itself must be told to stop (a flag) before cancel_delayed_work_sync, or the cancel races with the re-arm.

### Choosing the right deferral tool

- Need a quick, non-sleeping action after a delay, fired from anywhere: **timer_list**.
- Need precise sub-millisecond callback timing: **hrtimer**.
- Need to run *sleepable* work after a delay, or periodically: **delayed_work**.
- Need to wait until a condition with a timeout, blocking the current task: **wait_event_timeout** / completion.
- Need to pause the current task a fixed time: **msleep / usleep_range** (process context) or **udelay** (atomic).

> Pitfall: do not abuse the shared system workqueue for work that blocks for a long time - it shares worker threads with everyone. For long or latency-sensitive work, create your own workqueue with alloc_workqueue.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/workqueue.h>

struct my_dev {
    struct delayed_work poll_work;
    bool   stopping;
    /* ... */
};

// Runs in PROCESS context on a worker thread: sleeping is allowed here.
static void poll_handler(struct work_struct *w)
{
    struct my_dev *dev =
        container_of(to_delayed_work(w), struct my_dev, poll_work);

    // ... may take mutexes, kmalloc(GFP_KERNEL), talk to slow hardware ...
    msleep(2);    // totally fine in this context

    if (!dev->stopping)                       // periodic re-arm
        schedule_delayed_work(&dev->poll_work, msecs_to_jiffies(1000));
}

void my_start(struct my_dev *dev)
{
    INIT_DELAYED_WORK(&dev->poll_work, poll_handler);
    dev->stopping = false;
    schedule_delayed_work(&dev->poll_work, msecs_to_jiffies(1000));
}

void my_stop(struct my_dev *dev)
{
    dev->stopping = true;                      // stop the re-arm
    cancel_delayed_work_sync(&dev->poll_work); // wait out the handler
}`
        }
      ]
    },
    {
      heading: 'Safe time comparison: the time_after family',
      body: `Everything above leans on comparing jiffies values - "have we reached the deadline yet?" Doing that comparison with a plain < or > is a real, shipping-in-the-wild bug, and understanding why is the single most important takeaway of this chapter.

### Why naive comparison breaks

jiffies is an unsigned counter of fixed width that **wraps around** to zero when it overflows (under 50 days at HZ=1000 on a 32-bit counter). Suppose you record a deadline = jiffies + something. Most of the time deadline is a larger number than the current jiffies, so if (jiffies >= deadline) works. But if the counter is near its maximum when you compute the deadline, the addition wraps and deadline becomes a *small* number. Now the current jiffies is a huge number, jiffies >= deadline is immediately true, and your timeout fires instantly - or, in the mirror case, never. The bug only manifests near the wrap boundary, so it sails through testing and then strikes a long-uptime machine in production.

### The macros that get it right

The kernel provides four macros in linux/jiffies.h that compare with wraparound-correct signed arithmetic:

- **time_after(a, b)** - true if a is after b in time (a happened later).
- **time_before(a, b)** - true if a is before b (equivalent to time_after(b, a)).
- **time_after_eq(a, b)** and **time_before_eq(a, b)** - the inclusive versions.

A handy mnemonic for the argument order: time_after(a, b) reads as "a is after b," answering "is a > b" in time-aware fashion. To test "has my deadline passed?" write time_after_eq(jiffies, deadline). These macros compute the signed difference (a - b) and check its sign, which is correct across a single wrap because the difference stays small even when the absolute values straddle the boundary.

For 64-bit jiffies values there are the matching time_after64 / time_before64 macros. And once more: for genuine wall-clock or duration math beyond coarse timeouts, do not use jiffies at all - use ktime_get and ktime arithmetic, which are nanosecond-resolution and monotonic.

> Pitfall: this applies to *any* comparison of two values that can wrap, not just jiffies - and it is just as wrong to write jiffies + timeout < some_other_jiffies. Always feed both operands to time_after/time_before. Make it a reflex: never compare jiffies with a bare relational operator.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/jiffies.h>

unsigned long deadline = jiffies + msecs_to_jiffies(500);

// WRONG: breaks across the jiffies wraparound (every ~50 days at HZ=1000).
//   if (jiffies >= deadline) { ... timed out ... }

// RIGHT: wraparound-safe. "is jiffies now at or after the deadline?"
if (time_after_eq(jiffies, deadline)) {
    // timeout has elapsed
}

// A correct bounded busy-poll loop (atomic context):
unsigned long timeout = jiffies + msecs_to_jiffies(10);
while (!hardware_ready()) {
    if (time_after(jiffies, timeout))
        return -ETIMEDOUT;
    cpu_relax();           // hint to the CPU during a busy spin
}

// 64-bit variants for get_jiffies_64() values:
//   if (time_after64(get_jiffies_64(), deadline64)) { ... }`
        }
      ]
    }
  ],
  takeaways: [
    'jiffies counts timer ticks since boot and HZ is ticks per second; HZ varies per build, so always convert with msecs_to_jiffies / jiffies_to_msecs and never hard-code a tick count.',
    'jiffies is for coarse timeouts only; it wraps (under 50 days at HZ=1000 on 32-bit), so compare it solely with the time_after / time_before macros, never with raw < or >.',
    'Classic timers (timer_list, armed with mod_timer) run their callback in softirq/atomic context: the callback must not sleep - no mutexes, no GFP_KERNEL, no msleep.',
    'hrtimers give nanosecond-precision callbacks via ktime_t; use them only when tick resolution is genuinely too coarse, and re-arm periodics with hrtimer_forward_now to avoid drift.',
    'Busy-delays (udelay/ndelay/mdelay) spin the CPU and are the only legal wait in atomic context, but only for a few microseconds; mdelay and long udelay are red flags.',
    'Sleeps (msleep, usleep_range) yield the CPU and may run ONLY in process context with no spinlock held; prefer usleep_range for short, accurate waits.',
    'schedule_timeout only sleeps if you first set_current_state; in practice use wait_event_timeout or wait_for_completion_timeout, whose return value distinguishes timeout (0) from early wakeup.',
    'delayed_work runs sleepable work in process context after a delay; schedule it with schedule_delayed_work and always tear it down with cancel_delayed_work_sync.',
    'Always cancel timers/hrtimers/delayed work with the _sync variant (del_timer_sync, hrtimer_cancel, cancel_delayed_work_sync) before freeing memory or unloading, and stop self-rearming work with a flag first.'
  ],
  cheatsheet: [
    { label: 'jiffies / HZ', value: 'Tick counter since boot / ticks per second (build-time constant)' },
    { label: 'msecs_to_jiffies(ms)', value: 'Convert real time to ticks; reverse is jiffies_to_msecs - never hard-code ticks' },
    { label: 'time_after(a,b) / time_before', value: 'Wraparound-safe jiffies comparison; the ONLY correct way to compare ticks' },
    { label: 'timer_setup + mod_timer', value: 'Init a classic timer and arm/re-arm it; callback runs in softirq (no sleeping)' },
    { label: 'del_timer_sync', value: 'Cancel a timer and wait out a running callback; use before freeing' },
    { label: 'hrtimer_start / hrtimer_cancel', value: 'High-resolution ktime_t timer; callback is atomic; cancel waits for it' },
    { label: 'hrtimer_forward_now', value: 'Drift-free periodic re-arm; return HRTIMER_RESTART from the callback' },
    { label: 'udelay(us) / ndelay(ns)', value: 'Busy-spin the CPU; only legal wait in atomic context; keep it tiny' },
    { label: 'mdelay(ms)', value: 'Busy-spin whole milliseconds - red flag, almost always should be a sleep' },
    { label: 'msleep(ms)', value: 'Sleep at least ms; process context only; coarse, may overshoot' },
    { label: 'usleep_range(min,max)', value: 'Preferred short sleep in us; hrtimer-backed; process context only' },
    { label: 'wait_event_timeout(wq,cond,t)', value: 'Sleep until condition or timeout (jiffies); returns remaining, 0 = timed out' },
    { label: 'schedule_delayed_work', value: 'Run sleepable work after a delay in process context; cancel_delayed_work_sync to stop' },
    { label: 'ktime_get', value: 'Read monotonic nanosecond time for real duration math (not jiffies)' }
  ]
}

export default note
