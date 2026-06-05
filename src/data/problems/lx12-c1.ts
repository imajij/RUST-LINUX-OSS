import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch12-c-001',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read the Current Jiffies',
    prompt: `Write a function unsigned long now_ticks(void) that returns the current value of the kernel tick counter. Use the global jiffies value directly.`,
    hints: [
      'jiffies is a global variable updated on every timer tick.',
      'Include <linux/jiffies.h>.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned long now_ticks(void)
{
    return jiffies;
}`,
    starter: `#include <linux/jiffies.h>

unsigned long now_ticks(void)
{
    // TODO: return the current jiffies value
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'time'],
  },
  {
    id: 'lx-ch12-c-002',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print the HZ Value',
    prompt: `Write a function void show_hz(void) that prints the configured tick rate using pr_info, like "HZ = 250". HZ is a compile-time constant giving ticks per second.`,
    hints: [
      'HZ is a macro defined by the kernel configuration.',
      'pr_info("HZ = %d\\n", HZ) prints it.',
    ],
    solution: `#include <linux/printk.h>
#include <linux/jiffies.h>

void show_hz(void)
{
    pr_info("HZ = %d\\n", HZ);
}`,
    starter: `#include <linux/printk.h>
#include <linux/jiffies.h>

void show_hz(void)
{
    // TODO: print HZ with pr_info
}`,
    tags: ['kernel', 'hz', 'time'],
  },
  {
    id: 'lx-ch12-c-003',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Jiffies for One Second',
    prompt: `Write a function unsigned long ticks_in_one_second(void) that returns how many jiffies elapse in exactly one second. This is the HZ constant.`,
    hints: [
      'One second of ticks is exactly HZ.',
      'No arithmetic needed beyond returning HZ.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned long ticks_in_one_second(void)
{
    return HZ;
}`,
    starter: `#include <linux/jiffies.h>

unsigned long ticks_in_one_second(void)
{
    // TODO: return the number of jiffies in one second
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'hz'],
  },
  {
    id: 'lx-ch12-c-004',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Deadline Five Seconds Ahead',
    prompt: `Write a function unsigned long deadline_5s(void) that returns the jiffies value that will be reached five seconds from now. Compute it from the current jiffies and HZ.`,
    hints: [
      'jiffies + N * HZ is N seconds in the future.',
      'Five seconds is 5 * HZ ticks.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned long deadline_5s(void)
{
    return jiffies + 5 * HZ;
}`,
    starter: `#include <linux/jiffies.h>

unsigned long deadline_5s(void)
{
    // TODO: return jiffies five seconds in the future
    return jiffies;
}`,
    tags: ['kernel', 'jiffies', 'hz'],
  },
  {
    id: 'lx-ch12-c-005',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Convert Milliseconds to Jiffies',
    prompt: `Write a function unsigned long ms_to_ticks(unsigned int ms) that converts a duration in milliseconds to jiffies. Use the kernel helper that does this conversion safely.`,
    hints: [
      'msecs_to_jiffies(ms) handles the HZ math and rounding for you.',
      'Do not hand-roll ms * HZ / 1000.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned long ms_to_ticks(unsigned int ms)
{
    return msecs_to_jiffies(ms);
}`,
    starter: `#include <linux/jiffies.h>

unsigned long ms_to_ticks(unsigned int ms)
{
    // TODO: convert ms to jiffies with the proper helper
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'conversion'],
  },
  {
    id: 'lx-ch12-c-006',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Convert Jiffies to Milliseconds',
    prompt: `Write a function unsigned int ticks_to_ms(unsigned long j) that converts a duration expressed in jiffies into milliseconds, using the kernel helper.`,
    hints: [
      'jiffies_to_msecs(j) returns the duration in milliseconds.',
      'It accounts for HZ automatically.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned int ticks_to_ms(unsigned long j)
{
    return jiffies_to_msecs(j);
}`,
    starter: `#include <linux/jiffies.h>

unsigned int ticks_to_ms(unsigned long j)
{
    // TODO: convert j jiffies to milliseconds
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'conversion'],
  },
  {
    id: 'lx-ch12-c-007',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Sleep for 100 Milliseconds',
    prompt: `Write a function void nap_100ms(void) that sleeps for at least 100 milliseconds. This runs in process context where sleeping is allowed. Use the simple millisecond sleep helper.`,
    hints: [
      'msleep(ms) sleeps for at least the given milliseconds.',
      'msleep may only be called where sleeping is legal.',
    ],
    solution: `#include <linux/delay.h>

void nap_100ms(void)
{
    msleep(100);
}`,
    starter: `#include <linux/delay.h>

void nap_100ms(void)
{
    // TODO: sleep for 100 ms
}`,
    tags: ['kernel', 'msleep', 'delay'],
  },
  {
    id: 'lx-ch12-c-008',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Busy-Wait 50 Microseconds',
    prompt: `Write a function void spin_50us(void) that busy-waits for 50 microseconds without sleeping. This is the correct choice for a very short delay inside atomic context. Use the microsecond busy-delay.`,
    hints: [
      'udelay(usecs) busy-loops and never sleeps.',
      'Use udelay for short delays where you cannot sleep.',
    ],
    solution: `#include <linux/delay.h>

void spin_50us(void)
{
    udelay(50);
}`,
    starter: `#include <linux/delay.h>

void spin_50us(void)
{
    // TODO: busy-wait 50 microseconds
}`,
    tags: ['kernel', 'udelay', 'delay'],
  },
  {
    id: 'lx-ch12-c-009',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare a Timer List',
    prompt: `Declare a static struct timer_list named my_timer at file scope. Just the declaration is needed; no initialization yet.`,
    hints: [
      'struct timer_list lives in <linux/timer.h>.',
      'A static file-scope variable persists for the module lifetime.',
    ],
    solution: `#include <linux/timer.h>

static struct timer_list my_timer;`,
    starter: `#include <linux/timer.h>

// TODO: declare a static struct timer_list named my_timer`,
    tags: ['kernel', 'timer', 'timer_list'],
  },
  {
    id: 'lx-ch12-c-010',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Timer Callback Signature',
    prompt: `Write a timer callback function named my_callback with the correct modern signature for struct timer_list. The body should just print "tick" with pr_info.`,
    hints: [
      'A timer callback takes one parameter: struct timer_list *t.',
      'It returns void.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/printk.h>

static void my_callback(struct timer_list *t)
{
    pr_info("tick\\n");
}`,
    starter: `#include <linux/timer.h>
#include <linux/printk.h>

// TODO: define my_callback with the correct timer_list callback signature
`,
    tags: ['kernel', 'timer', 'callback'],
  },
  {
    id: 'lx-ch12-c-011',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read Jiffies as 64-Bit',
    prompt: `Write a function u64 now_ticks64(void) that returns the current tick count using the 64-bit jiffies counter, which never wraps in practice. Use get_jiffies_64().`,
    hints: [
      'jiffies is unsigned long and can wrap; get_jiffies_64() is 64-bit.',
      'get_jiffies_64() returns a u64.',
    ],
    solution: `#include <linux/jiffies.h>

u64 now_ticks64(void)
{
    return get_jiffies_64();
}`,
    starter: `#include <linux/jiffies.h>

u64 now_ticks64(void)
{
    // TODO: return the 64-bit jiffies value
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'time'],
  },
  {
    id: 'lx-ch12-c-012',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Sleep for Two Seconds',
    prompt: `Write a function void nap_2s(void) that sleeps for at least two seconds in process context. Use msleep with the right millisecond count.`,
    hints: [
      'Two seconds is 2000 milliseconds.',
      'msleep takes milliseconds.',
    ],
    solution: `#include <linux/delay.h>

void nap_2s(void)
{
    msleep(2000);
}`,
    starter: `#include <linux/delay.h>

void nap_2s(void)
{
    // TODO: sleep for two seconds
}`,
    tags: ['kernel', 'msleep', 'delay'],
  },
  {
    id: 'lx-ch12-c-013',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Initialize a Timer With timer_setup',
    prompt: `Given a static struct timer_list my_timer and a callback my_callback(struct timer_list *t), write a function void init_my_timer(void) that initializes the timer to use that callback with no special flags. Use timer_setup.`,
    hints: [
      'timer_setup(timer, callback, flags) is the modern initializer.',
      'Pass 0 for flags when none are needed.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/printk.h>

static struct timer_list my_timer;

static void my_callback(struct timer_list *t)
{
    pr_info("tick\\n");
}

void init_my_timer(void)
{
    timer_setup(&my_timer, my_callback, 0);
}`,
    starter: `#include <linux/timer.h>
#include <linux/printk.h>

static struct timer_list my_timer;

static void my_callback(struct timer_list *t)
{
    pr_info("tick\\n");
}

void init_my_timer(void)
{
    // TODO: initialize my_timer with my_callback and flags 0
}`,
    tags: ['kernel', 'timer', 'timer_setup'],
  },
  {
    id: 'lx-ch12-c-014',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Arm a Timer One Second Out',
    prompt: `Assume my_timer is already initialized with timer_setup. Write a function void arm_my_timer(void) that schedules it to fire one second from now. Use mod_timer with an absolute expiry computed from jiffies and HZ.`,
    hints: [
      'mod_timer(timer, expires) sets the absolute expiry in jiffies.',
      'One second from now is jiffies + HZ.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>

static struct timer_list my_timer;

void arm_my_timer(void)
{
    mod_timer(&my_timer, jiffies + HZ);
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>

static struct timer_list my_timer;

void arm_my_timer(void)
{
    // TODO: arm my_timer to fire one second from now
}`,
    tags: ['kernel', 'timer', 'mod_timer'],
  },
  {
    id: 'lx-ch12-c-015',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Periodic Self-Rearming Timer',
    prompt: `Write a callback void heartbeat(struct timer_list *t) that prints "beat" and then rearms itself to fire again 500 ms later. The timer pointer t points at the timer to rearm. Use mod_timer and msecs_to_jiffies.`,
    hints: [
      'A periodic timer rearms itself at the end of its own callback.',
      'mod_timer(t, jiffies + msecs_to_jiffies(500)) schedules the next fire.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/printk.h>

void heartbeat(struct timer_list *t)
{
    pr_info("beat\\n");
    mod_timer(t, jiffies + msecs_to_jiffies(500));
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>
#include <linux/printk.h>

void heartbeat(struct timer_list *t)
{
    // TODO: print "beat" and rearm t to fire 500 ms later
}`,
    tags: ['kernel', 'timer', 'mod_timer'],
  },
  {
    id: 'lx-ch12-c-016',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Cancel a Timer at Cleanup',
    prompt: `Write a function void stop_my_timer(void) that cancels the static timer my_timer during module exit, waiting for any running callback to finish before returning. Use timer_delete_sync (formerly del_timer_sync).`,
    hints: [
      'timer_delete_sync waits for the handler to finish, safe at cleanup.',
      'The non-sync variant can race with a running callback.',
    ],
    solution: `#include <linux/timer.h>

static struct timer_list my_timer;

void stop_my_timer(void)
{
    timer_delete_sync(&my_timer);
}`,
    starter: `#include <linux/timer.h>

static struct timer_list my_timer;

void stop_my_timer(void)
{
    // TODO: cancel my_timer and wait for any running callback
}`,
    tags: ['kernel', 'timer', 'cleanup'],
  },
  {
    id: 'lx-ch12-c-017',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Safe Timeout Check With time_after',
    prompt: `Write a function bool deadline_passed(unsigned long deadline) that returns true if the current jiffies value is at or past deadline. Use time_after_eq so the comparison is safe across jiffies wraparound.`,
    hints: [
      'Never compare jiffies with plain <, >; use the time_after family.',
      'time_after_eq(a, b) is true when a is at or after b.',
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
    // TODO: return true if jiffies has reached deadline (wrap-safe)
    return false;
}`,
    tags: ['kernel', 'jiffies', 'time_after'],
  },
  {
    id: 'lx-ch12-c-018',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Still Before the Deadline',
    prompt: `Write a function bool still_waiting(unsigned long deadline) that returns true while the current time is strictly before deadline. Use time_before for a wrap-safe comparison.`,
    hints: [
      'time_before(a, b) is true when a is before b.',
      'Pass jiffies as the first argument and deadline as the second.',
    ],
    solution: `#include <linux/jiffies.h>
#include <linux/types.h>

bool still_waiting(unsigned long deadline)
{
    return time_before(jiffies, deadline);
}`,
    starter: `#include <linux/jiffies.h>
#include <linux/types.h>

bool still_waiting(unsigned long deadline)
{
    // TODO: return true if jiffies is still before deadline (wrap-safe)
    return false;
}`,
    tags: ['kernel', 'jiffies', 'time_before'],
  },
  {
    id: 'lx-ch12-c-019',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sleep With a Tolerance Window',
    prompt: `Write a function void nap_flexible(void) that sleeps for roughly 1 to 2 milliseconds, letting the kernel coalesce the wakeup. Use usleep_range with a 1000 to 2000 microsecond window.`,
    hints: [
      'usleep_range(min_us, max_us) sleeps for a range, allowing wakeup coalescing.',
      'Prefer usleep_range over msleep for short sub-20ms sleeps.',
    ],
    solution: `#include <linux/delay.h>

void nap_flexible(void)
{
    usleep_range(1000, 2000);
}`,
    starter: `#include <linux/delay.h>

void nap_flexible(void)
{
    // TODO: sleep for roughly 1-2 ms using usleep_range
}`,
    tags: ['kernel', 'usleep_range', 'delay'],
  },
  {
    id: 'lx-ch12-c-020',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Busy-Wait Two Milliseconds',
    prompt: `Write a function void spin_2ms(void) that busy-waits for two milliseconds without sleeping, for use in atomic context. Use mdelay, the millisecond busy-delay.`,
    hints: [
      'mdelay(ms) busy-loops for whole milliseconds (it just calls udelay in a loop).',
      'Busy-delays waste CPU; only use for short waits where sleeping is illegal.',
    ],
    solution: `#include <linux/delay.h>

void spin_2ms(void)
{
    mdelay(2);
}`,
    starter: `#include <linux/delay.h>

void spin_2ms(void)
{
    // TODO: busy-wait two milliseconds
}`,
    tags: ['kernel', 'mdelay', 'delay'],
  },
  {
    id: 'lx-ch12-c-021',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Declare and Init Delayed Work',
    prompt: `Write a function void my_dwork_handler(struct work_struct *w) that prints "deferred", and use INIT_DELAYED_WORK to bind a file-scope struct delayed_work named my_dwork to it inside void setup_dwork(void).`,
    hints: [
      'A delayed_work handler takes struct work_struct *.',
      'INIT_DELAYED_WORK(&dwork, handler) connects them at runtime.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/printk.h>

static struct delayed_work my_dwork;

static void my_dwork_handler(struct work_struct *w)
{
    pr_info("deferred\\n");
}

void setup_dwork(void)
{
    INIT_DELAYED_WORK(&my_dwork, my_dwork_handler);
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/printk.h>

static struct delayed_work my_dwork;

static void my_dwork_handler(struct work_struct *w)
{
    // TODO: print "deferred"
}

void setup_dwork(void)
{
    // TODO: initialize my_dwork with my_dwork_handler
}`,
    tags: ['kernel', 'delayed_work', 'workqueue'],
  },
  {
    id: 'lx-ch12-c-022',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Schedule Delayed Work',
    prompt: `Assume my_dwork is already initialized. Write void queue_dwork(void) that schedules it to run on the system workqueue after a 250 ms delay. Use schedule_delayed_work with msecs_to_jiffies.`,
    hints: [
      'schedule_delayed_work(&dwork, delay_in_jiffies) queues on the system wq.',
      'Convert 250 ms with msecs_to_jiffies(250).',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/jiffies.h>

static struct delayed_work my_dwork;

void queue_dwork(void)
{
    schedule_delayed_work(&my_dwork, msecs_to_jiffies(250));
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/jiffies.h>

static struct delayed_work my_dwork;

void queue_dwork(void)
{
    // TODO: schedule my_dwork to run after 250 ms
}`,
    tags: ['kernel', 'delayed_work', 'workqueue'],
  },
  {
    id: 'lx-ch12-c-023',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Cancel Delayed Work Synchronously',
    prompt: `Write void stop_dwork(void) that cancels the pending delayed work my_dwork and waits for the handler to finish if it is already running. This is what you do at module exit. Use cancel_delayed_work_sync.`,
    hints: [
      'cancel_delayed_work_sync blocks until any running handler completes.',
      'Always cancel queued work before freeing what it touches.',
    ],
    solution: `#include <linux/workqueue.h>

static struct delayed_work my_dwork;

void stop_dwork(void)
{
    cancel_delayed_work_sync(&my_dwork);
}`,
    starter: `#include <linux/workqueue.h>

static struct delayed_work my_dwork;

void stop_dwork(void)
{
    // TODO: cancel my_dwork and wait for any running handler
}`,
    tags: ['kernel', 'delayed_work', 'cleanup'],
  },
  {
    id: 'lx-ch12-c-024',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sleep With schedule_timeout',
    prompt: `Write a function void sleep_one_sec(void) that puts the current task to sleep for about one second using schedule_timeout. Set the task state to TASK_INTERRUPTIBLE before calling so the scheduler actually sleeps the task.`,
    hints: [
      'set_current_state(TASK_INTERRUPTIBLE) must run before schedule_timeout, or it returns immediately.',
      'schedule_timeout takes a timeout in jiffies; one second is HZ.',
    ],
    solution: `#include <linux/sched.h>
#include <linux/jiffies.h>

void sleep_one_sec(void)
{
    set_current_state(TASK_INTERRUPTIBLE);
    schedule_timeout(HZ);
}`,
    starter: `#include <linux/sched.h>
#include <linux/jiffies.h>

void sleep_one_sec(void)
{
    // TODO: set task state, then schedule_timeout for one second
}`,
    tags: ['kernel', 'schedule_timeout', 'sleep'],
  },
  {
    id: 'lx-ch12-c-025',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Uninterruptible schedule_timeout Helper',
    prompt: `Write a function void sleep_ms(unsigned int ms) that sleeps for the given milliseconds using schedule_timeout_uninterruptible, which sets the state and calls schedule_timeout for you. Convert ms to jiffies.`,
    hints: [
      'schedule_timeout_uninterruptible(timeout) sets TASK_UNINTERRUPTIBLE internally.',
      'Pass msecs_to_jiffies(ms) as the timeout.',
    ],
    solution: `#include <linux/sched.h>
#include <linux/jiffies.h>

void sleep_ms(unsigned int ms)
{
    schedule_timeout_uninterruptible(msecs_to_jiffies(ms));
}`,
    starter: `#include <linux/sched.h>
#include <linux/jiffies.h>

void sleep_ms(unsigned int ms)
{
    // TODO: sleep ms milliseconds using schedule_timeout_uninterruptible
}`,
    tags: ['kernel', 'schedule_timeout', 'sleep'],
  },
  {
    id: 'lx-ch12-c-026',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Measure Elapsed Jiffies',
    prompt: `Write a function unsigned long elapsed_since(unsigned long start) that returns how many jiffies have passed since the recorded start tick. Account for wraparound by using plain unsigned subtraction (which wraps correctly).`,
    hints: [
      'jiffies - start gives the elapsed ticks; unsigned wraparound makes it correct.',
      'Return the difference directly.',
    ],
    solution: `#include <linux/jiffies.h>

unsigned long elapsed_since(unsigned long start)
{
    return jiffies - start;
}`,
    starter: `#include <linux/jiffies.h>

unsigned long elapsed_since(unsigned long start)
{
    // TODO: return jiffies elapsed since start
    return 0;
}`,
    tags: ['kernel', 'jiffies', 'time'],
  },
  {
    id: 'lx-ch12-c-027',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Initialize an Hrtimer',
    prompt: `Write a function void init_hr(struct hrtimer *hr) that initializes the given hrtimer to use the monotonic clock and relative-mode expiry, with a callback named hr_fn. Assume hr_fn is already defined. Use hrtimer_init.`,
    hints: [
      'hrtimer_init(timer, CLOCK_MONOTONIC, HRTIMER_MODE_REL) sets clock and mode.',
      'Assign the callback to the timer-function field after init.',
    ],
    solution: `#include <linux/hrtimer.h>

extern enum hrtimer_restart hr_fn(struct hrtimer *t);

void init_hr(struct hrtimer *hr)
{
    hrtimer_init(hr, CLOCK_MONOTONIC, HRTIMER_MODE_REL);
    hr->function = hr_fn;
}`,
    starter: `#include <linux/hrtimer.h>

extern enum hrtimer_restart hr_fn(struct hrtimer *t);

void init_hr(struct hrtimer *hr)
{
    // TODO: init the hrtimer (CLOCK_MONOTONIC, relative mode) and set ->function
}`,
    tags: ['kernel', 'hrtimer', 'time'],
  },
  {
    id: 'lx-ch12-c-028',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Start a One-Shot Hrtimer',
    prompt: `Write a function void start_hr(struct hrtimer *hr) that starts an already-initialized hrtimer to fire 200 microseconds from now, in relative mode. Use hrtimer_start with ms_to_ktime helpers; build the interval with ktime_set or us_to_ktime.`,
    hints: [
      'hrtimer_start(timer, ktime, HRTIMER_MODE_REL) arms a relative timer.',
      'us_to_ktime(200) builds a 200 microsecond ktime_t.',
    ],
    solution: `#include <linux/hrtimer.h>
#include <linux/ktime.h>

void start_hr(struct hrtimer *hr)
{
    hrtimer_start(hr, us_to_ktime(200), HRTIMER_MODE_REL);
}`,
    starter: `#include <linux/hrtimer.h>
#include <linux/ktime.h>

void start_hr(struct hrtimer *hr)
{
    // TODO: start hr to fire 200 us from now in relative mode
}`,
    tags: ['kernel', 'hrtimer', 'time'],
  },
  {
    id: 'lx-ch12-c-029',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'One-Shot Hrtimer Callback',
    prompt: `Write an hrtimer callback enum hrtimer_restart hr_fn(struct hrtimer *t) that prints "hr fired" and does NOT rearm, so it runs only once. Return the value that stops the timer.`,
    hints: [
      'An hrtimer callback returns enum hrtimer_restart.',
      'HRTIMER_NORESTART means one-shot; HRTIMER_RESTART would rearm it.',
    ],
    solution: `#include <linux/hrtimer.h>
#include <linux/printk.h>

enum hrtimer_restart hr_fn(struct hrtimer *t)
{
    pr_info("hr fired\\n");
    return HRTIMER_NORESTART;
}`,
    starter: `#include <linux/hrtimer.h>
#include <linux/printk.h>

enum hrtimer_restart hr_fn(struct hrtimer *t)
{
    // TODO: print "hr fired" and return the one-shot value
    return HRTIMER_NORESTART;
}`,
    tags: ['kernel', 'hrtimer', 'callback'],
  },
  {
    id: 'lx-ch12-c-030',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Cancel an Hrtimer',
    prompt: `Write a function void stop_hr(struct hrtimer *hr) that cancels the hrtimer and waits for its callback to finish if it is currently running, suitable for module cleanup. Use hrtimer_cancel.`,
    hints: [
      'hrtimer_cancel waits for the handler to complete, unlike hrtimer_try_to_cancel.',
      'Call it before freeing anything the callback touches.',
    ],
    solution: `#include <linux/hrtimer.h>

void stop_hr(struct hrtimer *hr)
{
    hrtimer_cancel(hr);
}`,
    starter: `#include <linux/hrtimer.h>

void stop_hr(struct hrtimer *hr)
{
    // TODO: cancel hr, waiting for a running callback
}`,
    tags: ['kernel', 'hrtimer', 'cleanup'],
  },
  {
    id: 'lx-ch12-c-031',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Periodic Hrtimer With hrtimer_forward_now',
    prompt: `Write an hrtimer callback enum hrtimer_restart tick_fn(struct hrtimer *t) that prints "hrtick", advances its own next expiry by 1 millisecond using hrtimer_forward_now, and asks to be restarted so it runs periodically.`,
    hints: [
      'hrtimer_forward_now(timer, interval) advances the expiry from the current time.',
      'Return HRTIMER_RESTART so the timer fires again.',
    ],
    solution: `#include <linux/hrtimer.h>
#include <linux/ktime.h>
#include <linux/printk.h>

enum hrtimer_restart tick_fn(struct hrtimer *t)
{
    pr_info("hrtick\\n");
    hrtimer_forward_now(t, ms_to_ktime(1));
    return HRTIMER_RESTART;
}`,
    starter: `#include <linux/hrtimer.h>
#include <linux/ktime.h>
#include <linux/printk.h>

enum hrtimer_restart tick_fn(struct hrtimer *t)
{
    // TODO: print "hrtick", forward expiry by 1 ms, request restart
    return HRTIMER_NORESTART;
}`,
    tags: ['kernel', 'hrtimer', 'periodic'],
  },
  {
    id: 'lx-ch12-c-032',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pick the Right Wait Primitive',
    prompt: `Write two functions. void wait_in_irq(void) runs in interrupt/atomic context and must busy-wait 10 microseconds. void wait_in_thread(void) runs in process context and should sleep 10 milliseconds yielding the CPU. Choose the legal primitive for each.`,
    hints: [
      'You cannot sleep in atomic/IRQ context, so use a busy-delay there.',
      'In process context prefer a sleeping call that yields the CPU.',
    ],
    solution: `#include <linux/delay.h>

void wait_in_irq(void)
{
    udelay(10);   /* atomic: must not sleep */
}

void wait_in_thread(void)
{
    msleep(10);   /* process context: yield the CPU */
}`,
    starter: `#include <linux/delay.h>

void wait_in_irq(void)
{
    // TODO: busy-wait 10 us (atomic context)
}

void wait_in_thread(void)
{
    // TODO: sleep 10 ms (process context)
}`,
    tags: ['kernel', 'delay', 'atomic'],
  },
  {
    id: 'lx-ch12-c-033',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Poll a Flag With a Timeout',
    prompt: `Write int wait_for_ready(volatile int *ready) that polls *ready until it becomes nonzero or 500 ms elapse. Compute a deadline from jiffies, loop using time_before for the wrap-safe check, and sleep 1 ms between polls with usleep_range(1000, 2000). Return 0 if ready, or -ETIMEDOUT on timeout.`,
    hints: [
      'unsigned long deadline = jiffies + msecs_to_jiffies(500).',
      'Loop while time_before(jiffies, deadline); sleep a bit each iteration so you do not spin.',
    ],
    solution: `#include <linux/jiffies.h>
#include <linux/delay.h>
#include <linux/errno.h>

int wait_for_ready(volatile int *ready)
{
    unsigned long deadline = jiffies + msecs_to_jiffies(500);

    while (time_before(jiffies, deadline)) {
        if (*ready)
            return 0;
        usleep_range(1000, 2000);
    }
    return *ready ? 0 : -ETIMEDOUT;
}`,
    starter: `#include <linux/jiffies.h>
#include <linux/delay.h>
#include <linux/errno.h>

int wait_for_ready(volatile int *ready)
{
    // TODO: build a 500 ms deadline, poll *ready with usleep_range,
    //       use time_before, return 0 or -ETIMEDOUT
    return -ETIMEDOUT;
}`,
    tags: ['kernel', 'time_before', 'timeout'],
  },
  {
    id: 'lx-ch12-c-034',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Restart a Pending Timer With mod_timer',
    prompt: `Write a function void bump_timer(struct timer_list *t, unsigned int ms) that (re)schedules an existing timer to fire ms milliseconds from now, whether or not it was already pending. Explain in a comment why a separate add_timer call is unnecessary here. Use mod_timer.`,
    hints: [
      'mod_timer both adds an inactive timer and reschedules an active one.',
      'Its expiry argument is absolute jiffies: jiffies + msecs_to_jiffies(ms).',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>

void bump_timer(struct timer_list *t, unsigned int ms)
{
    /* mod_timer activates an inactive timer and reschedules a pending one,
       so no separate add_timer is needed. */
    mod_timer(t, jiffies + msecs_to_jiffies(ms));
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>

void bump_timer(struct timer_list *t, unsigned int ms)
{
    // TODO: reschedule t to fire ms from now with mod_timer
}`,
    tags: ['kernel', 'timer', 'mod_timer'],
  },
  {
    id: 'lx-ch12-c-035',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Get the Container From a Timer Callback',
    prompt: `Given struct blinker { struct timer_list t; int count; };, write the callback void blink_fn(struct timer_list *t) that recovers the enclosing struct blinker from t using from_timer (a.k.a. container_of wrapper), increments its count, and rearms the timer 1 second later.`,
    hints: [
      'from_timer(var, callback_arg, member) maps the timer pointer back to its container.',
      'The member name here is t, matching struct blinker.',
    ],
    solution: `#include <linux/timer.h>
#include <linux/jiffies.h>

struct blinker {
    struct timer_list t;
    int count;
};

void blink_fn(struct timer_list *t)
{
    struct blinker *b = from_timer(b, t, t);

    b->count++;
    mod_timer(&b->t, jiffies + HZ);
}`,
    starter: `#include <linux/timer.h>
#include <linux/jiffies.h>

struct blinker {
    struct timer_list t;
    int count;
};

void blink_fn(struct timer_list *t)
{
    // TODO: recover the struct blinker with from_timer, bump count, rearm 1s
}`,
    tags: ['kernel', 'timer', 'from_timer'],
  },
]

export default problems
