import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch12-c-036',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read The Current Jiffies Value',
    prompt: `Write a function \`unsigned long read_now(void)\` that returns the current value of the global jiffies counter.

Requirements:
- Read the kernel's tick counter (the variable that counts timer ticks since boot).
- Print it with \`pr_info()\` using the \`%lu\` format, then return it.
- Use the API that is safe on both 32-bit and 64-bit kernels for a plain \`unsigned long\` read.`,
    hints: [
      'The global is named jiffies; <linux/jiffies.h> declares it.',
      'jiffies is an unsigned long; print with %lu.',
    ],
    solution: `#include <linux/jiffies.h>
#include <linux/kernel.h>

unsigned long read_now(void)
{
    unsigned long now = jiffies;
    pr_info("now = %lu jiffies\\n", now);
    return now;
}`,
    starter: `#include <linux/jiffies.h>
#include <linux/kernel.h>

unsigned long read_now(void)
{
    // TODO: read the jiffies counter, print it with %lu, and return it
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'time'],
  },
  {
    id: 'lx-ch12-c-037',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Convert Milliseconds To Jiffies',
    prompt: `Write \`unsigned long ms_to_ticks(unsigned int ms)\` that converts a duration in milliseconds to a number of jiffies, rounding up so a short delay never collapses to 0 ticks.

Requirements:
- Use the standard kernel helper that converts ms to jiffies.
- Return the resulting tick count.
- Do not hard-code HZ or do the arithmetic by hand.`,
    hints: [
      'msecs_to_jiffies(ms) is the helper and it rounds correctly for HZ.',
      'It lives in <linux/jiffies.h>.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned long ms_to_ticks(unsigned int ms)
{
    return msecs_to_jiffies(ms);
}`,
    starter: `#include <linux/jiffies.h>

unsigned long ms_to_ticks(unsigned int ms)
{
    // TODO: convert ms to jiffies using the kernel helper
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'hz'],
  },
  {
    id: 'lx-ch12-c-038',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Convert Jiffies Back To Milliseconds',
    prompt: `Write \`unsigned int ticks_to_ms(unsigned long ticks)\` that converts a number of jiffies into the equivalent number of milliseconds.

Requirements:
- Use the standard kernel helper for jiffies-to-ms conversion (so it is correct for any configured HZ).
- Return the result as an \`unsigned int\`.`,
    hints: [
      'jiffies_to_msecs(unsigned long) is the inverse of msecs_to_jiffies.',
      'It returns an unsigned int.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned int ticks_to_ms(unsigned long ticks)
{
    return jiffies_to_msecs(ticks);
}`,
    starter: `#include <linux/jiffies.h>

unsigned int ticks_to_ms(unsigned long ticks)
{
    // TODO: convert ticks to ms using the kernel helper
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'time'],
  },
  {
    id: 'lx-ch12-c-039',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Compute A Future Deadline In Jiffies',
    prompt: `Write \`unsigned long deadline_in(unsigned int ms)\` that returns the absolute jiffies value that will be reached \`ms\` milliseconds from now.

Requirements:
- Base it on the current jiffies plus the converted delay.
- Use \`msecs_to_jiffies()\` for the conversion.
- Return the absolute deadline (a jiffies value you could later compare against the live counter).`,
    hints: [
      'deadline = jiffies + msecs_to_jiffies(ms).',
      'Keep the type unsigned long so wraparound math stays correct.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned long deadline_in(unsigned int ms)
{
    return jiffies + msecs_to_jiffies(ms);
}`,
    starter: `#include <linux/jiffies.h>

unsigned long deadline_in(unsigned int ms)
{
    // TODO: return jiffies plus the converted delay
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'deadline'],
  },
  {
    id: 'lx-ch12-c-040',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Safe Deadline Check With time_after',
    prompt: `Write \`bool deadline_passed(unsigned long deadline)\` that returns true once the current jiffies has reached or passed \`deadline\`.

Requirements:
- Use a wraparound-safe time comparison macro, NOT a raw \`jiffies >= deadline\` comparison.
- Return true if now is at or after the deadline, false otherwise.`,
    hints: [
      'time_after_eq(a, b) is true when a is at or after b, handling counter wraparound.',
      'Call it as time_after_eq(jiffies, deadline).',
    ],
    solution: `#include <linux/jiffies.h>
#include <linux/types.h>

bool deadline_passed(unsigned long deadline)
{
    return time_after_eq(jiffies, deadline);
}`,
    starter: `#include <linux/jiffies.h>
#include <linux/types.h>

bool deadline_passed(unsigned long deadline)
{
    // TODO: use a wraparound-safe macro to test jiffies against deadline
    return false;
}`,
    tags: ['kernel', 'jiffies', 'time_after'],
  },
  {
    id: 'lx-ch12-c-041',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Why time_before Beats Plain Comparison',
    prompt: `Write \`bool not_yet(unsigned long deadline)\` that returns true while the current time is still strictly before \`deadline\`.

Requirements:
- Use \`time_before()\` so the answer stays correct even if the jiffies counter wraps around between when the deadline was computed and now.
- Return true when now is before the deadline.`,
    hints: [
      'time_before(a, b) is true when a is before b.',
      'These macros cast to signed long internally so wraparound differences stay correct.',
    ],
    solution: `#include <linux/jiffies.h>
#include <linux/types.h>

bool not_yet(unsigned long deadline)
{
    return time_before(jiffies, deadline);
}`,
    starter: `#include <linux/jiffies.h>
#include <linux/types.h>

bool not_yet(unsigned long deadline)
{
    // TODO: return true while jiffies is still before deadline
    return false;
}`,
    tags: ['kernel', 'jiffies', 'time_before'],
  },
  {
    id: 'lx-ch12-c-042',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sleep With msleep',
    prompt: `Write \`void wait_quarter_second(void)\` that puts the calling thread to sleep for 250 milliseconds in a way that is friendly to the scheduler.

Requirements:
- Use a sleeping delay, not a busy-wait.
- The call must only run in process context (it may sleep) — assume the caller guarantees that.`,
    hints: [
      'msleep(unsigned int msecs) sleeps for at least that many milliseconds.',
      'It is declared in <linux/delay.h>.',
    ],
    solution: `#include <linux/delay.h>

void wait_quarter_second(void)
{
    msleep(250);
}`,
    starter: `#include <linux/delay.h>

void wait_quarter_second(void)
{
    // TODO: sleep for 250 ms without busy-waiting
}`,
    tags: ['kernel', 'msleep', 'sleep'],
  },
  {
    id: 'lx-ch12-c-043',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bounded Short Sleep With usleep_range',
    prompt: `Write \`void short_wait(void)\` that sleeps for roughly 100 to 200 microseconds, giving the kernel a coalescing window so the wakeup can be batched with other timers.

Requirements:
- Use the API designed for short sleeps in the microsecond-to-low-millisecond range that takes a min and a max bound.
- Use a min of 100 us and a max of 200 us.`,
    hints: [
      'usleep_range(min_us, max_us) is preferred over udelay/msleep for short sleeps.',
      'The range lets the timer subsystem coalesce wakeups; pass 100 and 200.',
    ],
    solution: `#include <linux/delay.h>

void short_wait(void)
{
    usleep_range(100, 200);
}`,
    starter: `#include <linux/delay.h>

void short_wait(void)
{
    // TODO: sleep ~100-200 us using a range-bounded sleep
}`,
    tags: ['kernel', 'usleep_range', 'sleep'],
  },
  {
    id: 'lx-ch12-c-044',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Busy-Delay Inside A Spinlock',
    prompt: `A driver holds a spinlock and must wait a fixed 5 microseconds for hardware to settle. Write \`void hw_settle(void)\` that performs this short wait.

Requirements:
- The wait happens in atomic context (spinlock held), so sleeping is forbidden — you must busy-wait.
- Use the microsecond busy-delay primitive for a 5 us wait.`,
    hints: [
      'udelay(usecs) busy-loops without sleeping, so it is legal in atomic context.',
      'Never call msleep/usleep_range while holding a spinlock.',
    ],
    solution: `#include <linux/delay.h>

void hw_settle(void)
{
    /* atomic context: must not sleep, so busy-delay */
    udelay(5);
}`,
    starter: `#include <linux/delay.h>

void hw_settle(void)
{
    // TODO: busy-wait 5 us (sleeping is illegal here)
}`,
    tags: ['kernel', 'udelay', 'atomic'],
  },
  {
    id: 'lx-ch12-c-045',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Choose The Right Delay Primitive',
    prompt: `Write two functions:
- \`void big_sleep(void)\` waits 20 ms in process context where sleeping is allowed.
- \`void atomic_spin(void)\` waits 3 ms in atomic context where sleeping is forbidden.

Requirements:
- Pick the correct API for each context: a sleeping delay for the first, a busy-delay for the second.
- Use the millisecond-scale primitives appropriate to each.`,
    hints: [
      'In process context use msleep(20).',
      'In atomic context you cannot sleep, so use mdelay(3) (millisecond busy-delay).',
    ],
    solution: `#include <linux/delay.h>

void big_sleep(void)
{
    /* process context: sleeping is fine */
    msleep(20);
}

void atomic_spin(void)
{
    /* atomic context: must busy-wait */
    mdelay(3);
}`,
    starter: `#include <linux/delay.h>

void big_sleep(void)
{
    // TODO: 20 ms sleeping wait
}

void atomic_spin(void)
{
    // TODO: 3 ms busy wait (cannot sleep here)
}`,
    tags: ['kernel', 'mdelay', 'msleep'],
  },
  {
    id: 'lx-ch12-c-046',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Declare And Define A timer_list',
    prompt: `Set up a kernel timer. Provide:
- a global \`struct timer_list my_timer;\`
- a callback \`void my_timer_fn(struct timer_list *t)\` matching the modern timer callback signature, which simply prints "my_timer fired".

Requirements:
- Use the current callback prototype that takes a \`struct timer_list *\` argument.
- Do not start the timer yet; just declare the struct and write the callback.`,
    hints: [
      'Modern timer callbacks have the signature void fn(struct timer_list *t).',
      'timer_list and the timer API are in <linux/timer.h>.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/kernel.h>

static struct timer_list my_timer;

void my_timer_fn(struct timer_list *t)
{
    pr_info("my_timer fired\\n");
}`,
    starter: `#include <linux/timer.h>
#include <linux/kernel.h>

static struct timer_list my_timer;

void my_timer_fn(struct timer_list *t)
{
    // TODO: print "my_timer fired"
}`,
    tags: ['kernel', 'timer_list', 'callback'],
  },
  {
    id: 'lx-ch12-c-047',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Initialize A Timer With timer_setup',
    prompt: `Given the global \`struct timer_list my_timer;\` and callback \`my_timer_fn\` from before, write \`void timer_init(void)\` that binds the callback to the timer.

Requirements:
- Use \`timer_setup()\` to associate the timer with its callback function.
- Pass 0 for the flags argument.
- Do not arm the timer here.`,
    hints: [
      'timer_setup(timer, callback, flags) replaces the old setup_timer/init_timer.',
      'Pass flags = 0 unless you need TIMER_DEFERRABLE or similar.',
    ],
    solution: `#include <linux/timer.h>

void timer_init(void)
{
    timer_setup(&my_timer, my_timer_fn, 0);
}`,
    starter: `#include <linux/timer.h>

void timer_init(void)
{
    // TODO: bind my_timer_fn to my_timer with flags 0
}`,
    tags: ['kernel', 'timer_setup', 'timer_list'],
  },
  {
    id: 'lx-ch12-c-048',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Arm A Timer To Fire In 500 ms',
    prompt: `Write \`void timer_arm(void)\` that schedules the already-initialized \`my_timer\` to fire 500 milliseconds from now.

Requirements:
- Compute the absolute expiry as the current jiffies plus the converted 500 ms.
- Use \`mod_timer()\` to set the expiry (it both arms and re-arms a timer).`,
    hints: [
      'mod_timer(&my_timer, jiffies + msecs_to_jiffies(500)).',
      'mod_timer takes an absolute expiry in jiffies, not a relative delay.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>

void timer_arm(void)
{
    mod_timer(&my_timer, jiffies + msecs_to_jiffies(500));
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>

void timer_arm(void)
{
    // TODO: arm my_timer for 500 ms in the future with mod_timer
}`,
    tags: ['kernel', 'mod_timer', 'jiffies'],
  },
  {
    id: 'lx-ch12-c-049',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Self-Rearming Periodic Timer',
    prompt: `Make \`my_timer\` periodic. Write the callback \`void tick_fn(struct timer_list *t)\` that prints "tick" and then re-arms itself to fire again 1000 ms later.

Requirements:
- Inside the callback, call \`mod_timer()\` on the same timer to schedule the next firing.
- Use \`jiffies + msecs_to_jiffies(1000)\` for the next expiry.
- The timer struct is the one passed to the callback (use \`t\`).`,
    hints: [
      'A timer fires once; to make it periodic, re-arm it from inside the callback.',
      'mod_timer(t, jiffies + msecs_to_jiffies(1000)) reschedules the same timer.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

void tick_fn(struct timer_list *t)
{
    pr_info("tick\\n");
    mod_timer(t, jiffies + msecs_to_jiffies(1000));
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

void tick_fn(struct timer_list *t)
{
    // TODO: print "tick" then re-arm for 1000 ms later
}`,
    tags: ['kernel', 'timer_list', 'periodic'],
  },
  {
    id: 'lx-ch12-c-050',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Recover The Container From timer_list',
    prompt: `A driver embeds a timer inside its state struct:

\`\`\`
struct mydev {
    int id;
    struct timer_list t;
};
\`\`\`

Write the callback \`void mydev_timer(struct timer_list *t)\` that recovers the enclosing \`struct mydev\` and prints its \`id\`.

Requirements:
- Use \`from_timer()\` (or \`container_of\`) to get the \`struct mydev *\` from the \`struct timer_list *\`.
- Print the \`id\` field.`,
    hints: [
      'from_timer(var, t, member) wraps container_of for embedded timers.',
      'Here: from_timer(dev, t, t) where the member is named t.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/kernel.h>

struct mydev {
    int id;
    struct timer_list t;
};

void mydev_timer(struct timer_list *t)
{
    struct mydev *dev = from_timer(dev, t, t);
    pr_info("mydev id=%d timer fired\\n", dev->id);
}`,
    starter: `#include <linux/timer.h>
#include <linux/kernel.h>

struct mydev {
    int id;
    struct timer_list t;
};

void mydev_timer(struct timer_list *t)
{
    // TODO: recover struct mydev from t and print dev->id
}`,
    tags: ['kernel', 'from_timer', 'container_of'],
  },
  {
    id: 'lx-ch12-c-051',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Delete A Timer On Module Exit',
    prompt: `Write \`void timer_cleanup(void)\` to be called from a module's exit path that stops \`my_timer\` before the module unloads.

Requirements:
- Use the synchronous delete API so the function does not return until any running callback on another CPU has finished — otherwise the callback could run after the module's code is freed.
- Use \`timer_delete_sync()\` (the modern name; \`del_timer_sync()\` is the classic equivalent).`,
    hints: [
      'timer_delete_sync(&my_timer) waits for any in-flight callback to finish.',
      'Using the non-sync delete on exit risks a use-after-free.',
    ],
    solution: `#include <linux/timer.h>

void timer_cleanup(void)
{
    timer_delete_sync(&my_timer);
}`,
    starter: `#include <linux/timer.h>

void timer_cleanup(void)
{
    // TODO: synchronously delete my_timer so no callback runs after unload
}`,
    tags: ['kernel', 'timer', 'cleanup'],
  },
  {
    id: 'lx-ch12-c-052',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Declare And Schedule Delayed Work',
    prompt: `Use the workqueue's delayed-work mechanism so the work runs in process context (where sleeping is allowed). Provide:
- a global \`struct delayed_work my_dwork;\`
- a worker \`void my_work_fn(struct work_struct *w)\` that prints "delayed work ran"
- a function \`void dwork_init(void)\` that initializes the delayed work and schedules it to run 2 seconds later on the system workqueue.

Requirements:
- Initialize with \`INIT_DELAYED_WORK()\`.
- Schedule with \`schedule_delayed_work()\` using \`msecs_to_jiffies(2000)\` for the delay.`,
    hints: [
      'INIT_DELAYED_WORK(&my_dwork, my_work_fn) sets up the worker.',
      'schedule_delayed_work(&my_dwork, msecs_to_jiffies(2000)) queues it.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

static struct delayed_work my_dwork;

void my_work_fn(struct work_struct *w)
{
    pr_info("delayed work ran\\n");
}

void dwork_init(void)
{
    INIT_DELAYED_WORK(&my_dwork, my_work_fn);
    schedule_delayed_work(&my_dwork, msecs_to_jiffies(2000));
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

static struct delayed_work my_dwork;

void my_work_fn(struct work_struct *w)
{
    // TODO: print "delayed work ran"
}

void dwork_init(void)
{
    // TODO: INIT_DELAYED_WORK then schedule_delayed_work after 2 s
}`,
    tags: ['kernel', 'delayed_work', 'workqueue'],
  },
  {
    id: 'lx-ch12-c-053',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Cancel Delayed Work Safely',
    prompt: `Write \`void dwork_cleanup(void)\` that cancels the previously scheduled \`my_dwork\` and waits for it to finish if it is currently running.

Requirements:
- Use the synchronous cancel API that both dequeues a pending item and waits for an executing one to complete.
- Use \`cancel_delayed_work_sync()\`.`,
    hints: [
      'cancel_delayed_work_sync(&my_dwork) is the safe teardown call.',
      'The non-sync variant does not wait for a running worker.',
    ],
    solution: `#include <linux/workqueue.h>

void dwork_cleanup(void)
{
    cancel_delayed_work_sync(&my_dwork);
}`,
    starter: `#include <linux/workqueue.h>

void dwork_cleanup(void)
{
    // TODO: synchronously cancel my_dwork
}`,
    tags: ['kernel', 'delayed_work', 'cleanup'],
  },
  {
    id: 'lx-ch12-c-054',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Re-Schedule Delayed Work With mod_delayed_work',
    prompt: `A delayed worker should re-run every 5 seconds. Write \`void dwork_resched_fn(struct work_struct *w)\` (the worker for \`my_dwork\`) that prints "poll" and then re-queues itself 5 seconds later.

Requirements:
- From inside the worker, re-arm \`my_dwork\` using \`schedule_delayed_work()\` with a 5000 ms delay.
- Recover the \`delayed_work\` from the \`work_struct\` if you need it, or reference the global \`my_dwork\` directly.`,
    hints: [
      'schedule_delayed_work(&my_dwork, msecs_to_jiffies(5000)) re-queues it.',
      'to_delayed_work(w) converts a work_struct* back to a delayed_work* if needed.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

extern struct delayed_work my_dwork;

void dwork_resched_fn(struct work_struct *w)
{
    pr_info("poll\\n");
    schedule_delayed_work(&my_dwork, msecs_to_jiffies(5000));
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

extern struct delayed_work my_dwork;

void dwork_resched_fn(struct work_struct *w)
{
    // TODO: print "poll" then re-queue my_dwork 5 s later
}`,
    tags: ['kernel', 'delayed_work', 'periodic'],
  },
  {
    id: 'lx-ch12-c-055',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read Monotonic Time With ktime_get',
    prompt: `Write \`s64 elapsed_ns(ktime_t start)\` that returns the number of nanoseconds elapsed since the monotonic timestamp \`start\`.

Requirements:
- Read the current monotonic time with \`ktime_get()\`.
- Subtract \`start\` and convert the resulting \`ktime_t\` interval to nanoseconds.
- Return the nanosecond count.`,
    hints: [
      'ktime_get() returns a ktime_t monotonic timestamp.',
      'ktime_sub(now, start) then ktime_to_ns(...) gives nanoseconds.',
    ],
    solution: `#include <linux/ktime.h>

s64 elapsed_ns(ktime_t start)
{
    ktime_t now = ktime_get();
    return ktime_to_ns(ktime_sub(now, start));
}`,
    starter: `#include <linux/ktime.h>

s64 elapsed_ns(ktime_t start)
{
    // TODO: read ktime_get(), subtract start, return nanoseconds
    return 0;
}`,
    tags: ['kernel', 'ktime', 'time'],
  },
  {
    id: 'lx-ch12-c-056',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Declare And Initialize An hrtimer',
    prompt: `Set up a high-resolution timer. Provide:
- a global \`struct hrtimer my_hr;\`
- a callback \`enum hrtimer_restart hr_fn(struct hrtimer *h)\` that prints "hr fired" and returns \`HRTIMER_NORESTART\`
- a function \`void hr_init(void)\` that initializes \`my_hr\` to use the monotonic clock in relative mode and assigns the callback.

Requirements:
- Use \`hrtimer_init()\` with \`CLOCK_MONOTONIC\` and \`HRTIMER_MODE_REL\`.
- Set the \`function\` field to your callback.`,
    hints: [
      'hrtimer_init(&my_hr, CLOCK_MONOTONIC, HRTIMER_MODE_REL).',
      'my_hr.function = hr_fn; the callback returns an enum hrtimer_restart.',
    ],
    solution: `#include <linux/hrtimer.h>
#include <linux/ktime.h>
#include <linux/kernel.h>

static struct hrtimer my_hr;

enum hrtimer_restart hr_fn(struct hrtimer *h)
{
    pr_info("hr fired\\n");
    return HRTIMER_NORESTART;
}

void hr_init(void)
{
    hrtimer_init(&my_hr, CLOCK_MONOTONIC, HRTIMER_MODE_REL);
    my_hr.function = hr_fn;
}`,
    starter: `#include <linux/hrtimer.h>
#include <linux/ktime.h>
#include <linux/kernel.h>

static struct hrtimer my_hr;

enum hrtimer_restart hr_fn(struct hrtimer *h)
{
    // TODO: print "hr fired" and return HRTIMER_NORESTART
    return HRTIMER_NORESTART;
}

void hr_init(void)
{
    // TODO: hrtimer_init with CLOCK_MONOTONIC / HRTIMER_MODE_REL, set .function
}`,
    tags: ['kernel', 'hrtimer', 'callback'],
  },
  {
    id: 'lx-ch12-c-057',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Start An hrtimer For 2 Milliseconds',
    prompt: `Write \`void hr_start(void)\` that starts the initialized \`my_hr\` to fire 2 milliseconds from now.

Requirements:
- Build a relative \`ktime_t\` interval of 2 ms.
- Start the timer with \`hrtimer_start()\` in relative mode.`,
    hints: [
      'ms_to_ktime(2) or ktime_set(0, 2 * NSEC_PER_MSEC) builds the interval.',
      'hrtimer_start(&my_hr, interval, HRTIMER_MODE_REL).',
    ],
    solution: `#include <linux/hrtimer.h>
#include <linux/ktime.h>

void hr_start(void)
{
    ktime_t interval = ms_to_ktime(2);
    hrtimer_start(&my_hr, interval, HRTIMER_MODE_REL);
}`,
    starter: `#include <linux/hrtimer.h>
#include <linux/ktime.h>

void hr_start(void)
{
    // TODO: build a 2 ms ktime and hrtimer_start in relative mode
}`,
    tags: ['kernel', 'hrtimer', 'ktime'],
  },
  {
    id: 'lx-ch12-c-058',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Periodic hrtimer With hrtimer_forward_now',
    prompt: `Make \`my_hr\` fire every 1 millisecond. Write \`enum hrtimer_restart hr_periodic(struct hrtimer *h)\` that, on each firing, advances the timer by 1 ms and asks to be restarted.

Requirements:
- Use \`hrtimer_forward_now()\` to advance the next expiry by a 1 ms \`ktime_t\`, which correctly skips missed periods.
- Return \`HRTIMER_RESTART\` so the timer rearms automatically.`,
    hints: [
      'hrtimer_forward_now(h, ms_to_ktime(1)) advances the expiry from now.',
      'Returning HRTIMER_RESTART rearms the hrtimer with the new expiry.',
    ],
    solution: `#include <linux/hrtimer.h>
#include <linux/ktime.h>
#include <linux/kernel.h>

enum hrtimer_restart hr_periodic(struct hrtimer *h)
{
    pr_info("hr period\\n");
    hrtimer_forward_now(h, ms_to_ktime(1));
    return HRTIMER_RESTART;
}`,
    starter: `#include <linux/hrtimer.h>
#include <linux/ktime.h>
#include <linux/kernel.h>

enum hrtimer_restart hr_periodic(struct hrtimer *h)
{
    // TODO: forward by 1 ms and return HRTIMER_RESTART
    return HRTIMER_NORESTART;
}`,
    tags: ['kernel', 'hrtimer', 'periodic'],
  },
  {
    id: 'lx-ch12-c-059',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sleep Until A Deadline With schedule_timeout',
    prompt: `Write \`void sleep_one_second(void)\` that sleeps for about one second using the scheduler's timeout mechanism (not msleep).

Requirements:
- Set the task state to \`TASK_INTERRUPTIBLE\` before sleeping so the sleep can be woken by a signal.
- Call \`schedule_timeout()\` with the jiffies for 1 second (use \`msecs_to_jiffies(1000)\` or \`HZ\`).`,
    hints: [
      'Set current state with set_current_state(TASK_INTERRUPTIBLE) first.',
      'schedule_timeout(HZ) sleeps for about one second.',
    ],
    solution: `#include <linux/sched.h>
#include <linux/jiffies.h>

void sleep_one_second(void)
{
    set_current_state(TASK_INTERRUPTIBLE);
    schedule_timeout(msecs_to_jiffies(1000));
}`,
    starter: `#include <linux/sched.h>
#include <linux/jiffies.h>

void sleep_one_second(void)
{
    // TODO: set TASK_INTERRUPTIBLE then schedule_timeout for 1 s
}`,
    tags: ['kernel', 'schedule_timeout', 'sleep'],
  },
  {
    id: 'lx-ch12-c-060',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Uninterruptible Timed Sleep',
    prompt: `Write \`void sleep_50ms_uninterruptible(void)\` that sleeps for 50 milliseconds and cannot be woken early by a signal, using \`schedule_timeout\`.

Requirements:
- Use the helper variant of \`schedule_timeout\` that sets the uninterruptible state for you, OR set \`TASK_UNINTERRUPTIBLE\` yourself and then call \`schedule_timeout()\`.
- Sleep for \`msecs_to_jiffies(50)\` jiffies.`,
    hints: [
      'schedule_timeout_uninterruptible(timeout) sets TASK_UNINTERRUPTIBLE for you.',
      'Pass msecs_to_jiffies(50).',
    ],
    solution: `#include <linux/sched.h>
#include <linux/jiffies.h>

void sleep_50ms_uninterruptible(void)
{
    schedule_timeout_uninterruptible(msecs_to_jiffies(50));
}`,
    starter: `#include <linux/sched.h>
#include <linux/jiffies.h>

void sleep_50ms_uninterruptible(void)
{
    // TODO: sleep 50 ms uninterruptibly via schedule_timeout
}`,
    tags: ['kernel', 'schedule_timeout', 'sleep'],
  },
  {
    id: 'lx-ch12-c-061',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Measure Elapsed Time In Milliseconds',
    prompt: `Write \`unsigned int op_duration_ms(void)\` that times a (placeholder) operation and returns how many milliseconds it took, using jiffies.

Requirements:
- Capture the start jiffies, perform the operation (here call \`do_work()\`, assume it exists), then capture end jiffies.
- Compute the elapsed jiffies and convert it to milliseconds with \`jiffies_to_msecs()\`.
- Return the millisecond count.`,
    hints: [
      'start = jiffies; ... end = jiffies;',
      'jiffies_to_msecs(end - start) gives the duration; unsigned subtraction is wraparound-safe.',
    ],
    solution: `#include <linux/jiffies.h>

extern void do_work(void);

unsigned int op_duration_ms(void)
{
    unsigned long start = jiffies;
    do_work();
    return jiffies_to_msecs(jiffies - start);
}`,
    starter: `#include <linux/jiffies.h>

extern void do_work(void);

unsigned int op_duration_ms(void)
{
    // TODO: time do_work() using jiffies and return elapsed ms
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'timing'],
  },
  {
    id: 'lx-ch12-c-062',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Spin-Wait With A Timeout',
    prompt: `Hardware sets a ready bit. Write \`int wait_ready(volatile int *flag, unsigned int timeout_ms)\` that polls \`*flag\` until it is nonzero or the timeout expires.

Requirements:
- Compute an absolute deadline = \`jiffies + msecs_to_jiffies(timeout_ms)\`.
- Loop while the flag is 0 and the deadline has not passed (use \`time_before()\`); inside the loop do a tiny \`cpu_relax()\`.
- Return 0 if the flag became set, or \`-ETIMEDOUT\` if the deadline passed first.`,
    hints: [
      'Loop: while (!*flag && time_before(jiffies, deadline)) cpu_relax();',
      'After the loop, return *flag ? 0 : -ETIMEDOUT.',
    ],
    solution: `#include <linux/jiffies.h>
#include <linux/processor.h>
#include <linux/errno.h>

int wait_ready(volatile int *flag, unsigned int timeout_ms)
{
    unsigned long deadline = jiffies + msecs_to_jiffies(timeout_ms);

    while (!*flag && time_before(jiffies, deadline))
        cpu_relax();

    return *flag ? 0 : -ETIMEDOUT;
}`,
    starter: `#include <linux/jiffies.h>
#include <linux/processor.h>
#include <linux/errno.h>

int wait_ready(volatile int *flag, unsigned int timeout_ms)
{
    // TODO: poll *flag until set or deadline passes; return 0 or -ETIMEDOUT
    return 0;
}`,
    tags: ['kernel', 'timeout', 'time_before'],
  },
  {
    id: 'lx-ch12-c-063',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Deferrable Timer For Power Saving',
    prompt: `Write \`void deferrable_init(void)\` that initializes \`my_timer\` as a deferrable timer so that, when the CPU is idle, the kernel may delay this non-critical timer to avoid waking the CPU.

Requirements:
- Use \`timer_setup()\` with the \`TIMER_DEFERRABLE\` flag.
- Bind it to the existing \`my_timer_fn\` callback.`,
    hints: [
      'timer_setup(&my_timer, my_timer_fn, TIMER_DEFERRABLE).',
      'Deferrable timers help idle CPUs stay asleep longer.',
    ],
    solution: `#include <linux/timer.h>

extern void my_timer_fn(struct timer_list *t);
static struct timer_list my_timer;

void deferrable_init(void)
{
    timer_setup(&my_timer, my_timer_fn, TIMER_DEFERRABLE);
}`,
    starter: `#include <linux/timer.h>

extern void my_timer_fn(struct timer_list *t);
static struct timer_list my_timer;

void deferrable_init(void)
{
    // TODO: timer_setup with TIMER_DEFERRABLE
}`,
    tags: ['kernel', 'timer_setup', 'deferrable'],
  },
  {
    id: 'lx-ch12-c-064',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Check If A Timer Is Pending',
    prompt: `Write \`bool arm_if_idle(void)\` that arms \`my_timer\` for 100 ms ONLY if it is not already scheduled, and reports whether it armed it.

Requirements:
- Use \`timer_pending()\` to test whether the timer is already queued.
- If it is not pending, arm it with \`mod_timer()\` for 100 ms and return true.
- If it is already pending, leave it alone and return false.`,
    hints: [
      'timer_pending(&my_timer) returns true if the timer is queued.',
      'Only mod_timer when !timer_pending(...).',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/types.h>

static struct timer_list my_timer;

bool arm_if_idle(void)
{
    if (timer_pending(&my_timer))
        return false;
    mod_timer(&my_timer, jiffies + msecs_to_jiffies(100));
    return true;
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/types.h>

static struct timer_list my_timer;

bool arm_if_idle(void)
{
    // TODO: arm for 100 ms only if not already pending; report whether armed
    return false;
}`,
    tags: ['kernel', 'timer_pending', 'mod_timer'],
  },
  {
    id: 'lx-ch12-c-065',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pass Per-Timer Data Via The Container',
    prompt: `Build a small one-shot timer that carries a payload. Define:

\`\`\`
struct blink {
    int gpio;
    struct timer_list timer;
};
\`\`\`

Provide:
- \`void blink_setup(struct blink *b, int gpio)\` that stores \`gpio\`, sets up the embedded timer with callback \`blink_fire\`, and arms it for 200 ms.
- \`void blink_fire(struct timer_list *t)\` that recovers the \`struct blink\` and prints its \`gpio\`.

Requirements:
- Modern callback signature; recover the container with \`from_timer()\`.
- Arm with \`mod_timer()\` using \`jiffies + msecs_to_jiffies(200)\`.`,
    hints: [
      'timer_setup(&b->timer, blink_fire, 0) binds the callback.',
      'In the callback, from_timer(b, t, timer) recovers struct blink.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

struct blink {
    int gpio;
    struct timer_list timer;
};

void blink_fire(struct timer_list *t)
{
    struct blink *b = from_timer(b, t, timer);
    pr_info("blink gpio=%d\\n", b->gpio);
}

void blink_setup(struct blink *b, int gpio)
{
    b->gpio = gpio;
    timer_setup(&b->timer, blink_fire, 0);
    mod_timer(&b->timer, jiffies + msecs_to_jiffies(200));
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

struct blink {
    int gpio;
    struct timer_list timer;
};

void blink_fire(struct timer_list *t)
{
    // TODO: recover struct blink with from_timer and print gpio
}

void blink_setup(struct blink *b, int gpio)
{
    // TODO: store gpio, timer_setup with blink_fire, arm for 200 ms
}`,
    tags: ['kernel', 'timer_list', 'from_timer'],
  },
  {
    id: 'lx-ch12-c-066',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Watchdog Timer With Activity Tracking',
    prompt: `Build a software watchdog. Define a global \`unsigned long last_activity;\` and \`struct timer_list wdt;\`.

Provide:
- \`void wdt_kick(void)\` that records \`jiffies\` into \`last_activity\` (called whenever the device is used).
- \`void wdt_check(struct timer_list *t)\` that fires every second: if more than 3 seconds have elapsed since the last kick, it prints "watchdog: stalled"; either way it re-arms itself for 1 second later.

Requirements:
- Use \`time_after()\` to compare \`jiffies\` against \`last_activity + 3*HZ\` (wraparound-safe).
- Re-arm with \`mod_timer()\` for \`jiffies + HZ\`.`,
    hints: [
      'Stall condition: time_after(jiffies, last_activity + 3 * HZ).',
      'Always re-arm at the end so the watchdog keeps running.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

static unsigned long last_activity;
static struct timer_list wdt;

void wdt_kick(void)
{
    last_activity = jiffies;
}

void wdt_check(struct timer_list *t)
{
    if (time_after(jiffies, last_activity + 3 * HZ))
        pr_warn("watchdog: stalled\\n");

    mod_timer(t, jiffies + HZ);
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

static unsigned long last_activity;
static struct timer_list wdt;

void wdt_kick(void)
{
    // TODO: record current jiffies
}

void wdt_check(struct timer_list *t)
{
    // TODO: warn if stalled > 3s since last kick, then re-arm for 1s
}`,
    tags: ['kernel', 'timer', 'time_after'],
  },
  {
    id: 'lx-ch12-c-067',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Debounce Bursty Events With mod_delayed_work',
    prompt: `A driver receives bursty interrupts and should run \`commit_work()\` only 50 ms after the LAST event in a burst (debounce). Define \`struct delayed_work commit_dw;\`.

Provide:
- \`void on_event(void)\` (called from each event, in process context) that (re)schedules \`commit_dw\` for 50 ms from now, cancelling any earlier pending run so only the final one survives.
- \`void commit_fn(struct work_struct *w)\` that prints "committed".

Requirements:
- Use \`mod_delayed_work()\` on \`system_wq\` so repeated calls reset the 50 ms timer instead of queueing many runs.
- Convert 50 ms with \`msecs_to_jiffies()\`.`,
    hints: [
      'mod_delayed_work(system_wq, &commit_dw, msecs_to_jiffies(50)) resets the delay each call.',
      'Unlike schedule_delayed_work, mod_delayed_work re-arms a pending item instead of leaving it.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

static struct delayed_work commit_dw;

void commit_fn(struct work_struct *w)
{
    pr_info("committed\\n");
}

void on_event(void)
{
    mod_delayed_work(system_wq, &commit_dw, msecs_to_jiffies(50));
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

static struct delayed_work commit_dw;

void commit_fn(struct work_struct *w)
{
    // TODO: print "committed"
}

void on_event(void)
{
    // TODO: (re)arm commit_dw for 50 ms via mod_delayed_work, resetting the delay
}`,
    tags: ['kernel', 'delayed_work', 'debounce'],
  },
  {
    id: 'lx-ch12-c-068',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Poll A Status Bit With Sleeping Backoff',
    prompt: `In process context, write \`int poll_until_ready(volatile u32 *reg, u32 mask, unsigned int timeout_ms)\` that waits for \`(*reg & mask)\` to become nonzero, sleeping between polls so it does not burn the CPU.

Requirements:
- Compute an absolute deadline from \`jiffies + msecs_to_jiffies(timeout_ms)\`.
- Loop: if the bit is set, return 0; if the deadline passed (use \`time_after()\`), return \`-ETIMEDOUT\`; otherwise sleep a short bounded interval with \`usleep_range(50, 100)\` and poll again.
- This runs in process context, so sleeping is allowed.`,
    hints: [
      'Use usleep_range(50, 100) between polls rather than a busy udelay loop.',
      'Check the bit once more after a possible final sleep before declaring timeout.',
    ],
    solution: `#include <linux/jiffies.h>
#include <linux/delay.h>
#include <linux/errno.h>
#include <linux/types.h>

int poll_until_ready(volatile u32 *reg, u32 mask, unsigned int timeout_ms)
{
    unsigned long deadline = jiffies + msecs_to_jiffies(timeout_ms);

    for (;;) {
        if (*reg & mask)
            return 0;
        if (time_after(jiffies, deadline))
            return -ETIMEDOUT;
        usleep_range(50, 100);
    }
}`,
    starter: `#include <linux/jiffies.h>
#include <linux/delay.h>
#include <linux/errno.h>
#include <linux/types.h>

int poll_until_ready(volatile u32 *reg, u32 mask, unsigned int timeout_ms)
{
    // TODO: poll *reg & mask, sleeping with usleep_range until set or timeout
    return 0;
}`,
    tags: ['kernel', 'usleep_range', 'timeout'],
  },
  {
    id: 'lx-ch12-c-069',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'High-Resolution Periodic hrtimer Module',
    prompt: `Write a complete pattern for a 500-microsecond periodic hrtimer. Provide:
- global \`struct hrtimer hrt;\`
- \`enum hrtimer_restart hrt_fn(struct hrtimer *h)\` that counts firings into a global \`u64 ticks\`, advances the timer by 500 us with \`hrtimer_forward_now()\`, and returns \`HRTIMER_RESTART\`.
- \`void hrt_start(void)\` that initializes the timer (monotonic, relative), assigns the callback, and starts it for the first firing 500 us out.
- \`void hrt_stop(void)\` that cancels the timer synchronously.

Requirements:
- Use \`hrtimer_init\`, \`hrtimer_start\` with \`HRTIMER_MODE_REL\`, and \`hrtimer_cancel\` for clean teardown.
- Build the 500 us interval with \`ktime_set(0, 500 * NSEC_PER_USEC)\` or \`us_to_ktime(500)\`.`,
    hints: [
      'hrtimer_cancel(&hrt) in stop waits for any running callback.',
      'In the callback, hrtimer_forward_now(h, us_to_ktime(500)) then return HRTIMER_RESTART.',
    ],
    solution: `#include <linux/hrtimer.h>
#include <linux/ktime.h>
#include <linux/types.h>

static struct hrtimer hrt;
static u64 ticks;

enum hrtimer_restart hrt_fn(struct hrtimer *h)
{
    ticks++;
    hrtimer_forward_now(h, us_to_ktime(500));
    return HRTIMER_RESTART;
}

void hrt_start(void)
{
    hrtimer_init(&hrt, CLOCK_MONOTONIC, HRTIMER_MODE_REL);
    hrt.function = hrt_fn;
    hrtimer_start(&hrt, us_to_ktime(500), HRTIMER_MODE_REL);
}

void hrt_stop(void)
{
    hrtimer_cancel(&hrt);
}`,
    starter: `#include <linux/hrtimer.h>
#include <linux/ktime.h>
#include <linux/types.h>

static struct hrtimer hrt;
static u64 ticks;

enum hrtimer_restart hrt_fn(struct hrtimer *h)
{
    // TODO: count tick, forward by 500 us, return HRTIMER_RESTART
    return HRTIMER_NORESTART;
}

void hrt_start(void)
{
    // TODO: init (monotonic/rel), set .function, start at 500 us
}

void hrt_stop(void)
{
    // TODO: cancel synchronously
}`,
    tags: ['kernel', 'hrtimer', 'periodic'],
  },
  {
    id: 'lx-ch12-c-070',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Rate Limiter With Jiffies Windows',
    prompt: `Build a simple token-free rate limiter that allows at most one action per \`window_ms\`. Define a global \`unsigned long next_allowed;\` (a jiffies deadline).

Write \`bool rate_limit_ok(unsigned int window_ms)\` that:
- returns true and updates \`next_allowed\` to \`jiffies + msecs_to_jiffies(window_ms)\` when the current time has reached or passed \`next_allowed\` (action permitted);
- returns false without changing anything when we are still inside the window (action suppressed).

Requirements:
- Use \`time_after_eq()\` for the wraparound-safe comparison.
- The first call (when \`next_allowed\` is 0 / in the past) should be permitted.`,
    hints: [
      'Permit when time_after_eq(jiffies, next_allowed).',
      'On permit, set next_allowed = jiffies + msecs_to_jiffies(window_ms) before returning true.',
    ],
    solution: `#include <linux/jiffies.h>
#include <linux/types.h>

static unsigned long next_allowed;

bool rate_limit_ok(unsigned int window_ms)
{
    if (time_after_eq(jiffies, next_allowed)) {
        next_allowed = jiffies + msecs_to_jiffies(window_ms);
        return true;
    }
    return false;
}`,
    starter: `#include <linux/jiffies.h>
#include <linux/types.h>

static unsigned long next_allowed;

bool rate_limit_ok(unsigned int window_ms)
{
    // TODO: permit at most one action per window using time_after_eq
    return false;
}`,
    tags: ['kernel', 'jiffies', 'rate-limit'],
  },
]

export default problems
