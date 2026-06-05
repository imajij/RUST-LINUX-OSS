import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch11-c-001',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Minimal Interrupt Handler',
    prompt: `Write a top-half interrupt handler with the correct prototype. Name it my_irq_handler, take the two standard arguments (an int irq and a void *dev_id), print "irq %d fired\\n" with pr_info, and return IRQ_HANDLED. Include the right header.`,
    hints: [
      'The handler type is irqreturn_t name(int irq, void *dev_id).',
      'IRQ_HANDLED and irqreturn_t come from <linux/interrupt.h>.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/kernel.h>

static irqreturn_t my_irq_handler(int irq, void *dev_id)
{
    pr_info("irq %d fired\\n", irq);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/kernel.h>

/* TODO: write the handler with the correct prototype */
static irqreturn_t my_irq_handler(int irq, void *dev_id)
{
    return /* TODO */;
}`,
    tags: ['kernel', 'interrupts', 'handler'],
  },
  {
    id: 'lx-ch11-c-002',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return IRQ_NONE For A Spurious Interrupt',
    prompt: `Write a handler check_irq(int irq, void *dev_id). It reads a device flag with a helper int device_raised_irq(void) (assume it exists). If the device did NOT raise the interrupt (the helper returns 0), the handler must return IRQ_NONE so the kernel knows this wasn't ours. Otherwise return IRQ_HANDLED.`,
    hints: [
      'IRQ_NONE tells the core "not my interrupt".',
      'This matters for shared IRQ lines.',
    ],
    solution: `#include <linux/interrupt.h>

int device_raised_irq(void);

static irqreturn_t check_irq(int irq, void *dev_id)
{
    if (!device_raised_irq())
        return IRQ_NONE;

    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

int device_raised_irq(void);

static irqreturn_t check_irq(int irq, void *dev_id)
{
    /* TODO: return IRQ_NONE if not ours, else IRQ_HANDLED */
}`,
    tags: ['kernel', 'interrupts', 'shared'],
  },
  {
    id: 'lx-ch11-c-003',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Register An IRQ Handler',
    prompt: `Write int register_my_irq(void) that requests IRQ line 11 with request_irq. Use handler my_irq_handler, flags 0, device name "mydev", and dev_id NULL. Return whatever request_irq returns (0 on success, negative errno on failure).`,
    hints: [
      'request_irq(irq, handler, flags, name, dev_id).',
      'It returns 0 on success or a negative errno.',
    ],
    solution: `#include <linux/interrupt.h>

extern irqreturn_t my_irq_handler(int irq, void *dev_id);

int register_my_irq(void)
{
    return request_irq(11, my_irq_handler, 0, "mydev", NULL);
}`,
    starter: `#include <linux/interrupt.h>

extern irqreturn_t my_irq_handler(int irq, void *dev_id);

int register_my_irq(void)
{
    /* TODO: call request_irq for IRQ 11 */
}`,
    tags: ['kernel', 'interrupts', 'request_irq'],
  },
  {
    id: 'lx-ch11-c-004',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Free An IRQ Handler',
    prompt: `Write void unregister_my_irq(void). It must release IRQ line 11 that was registered with dev_id NULL. Use free_irq with the matching irq number and the same dev_id you passed to request_irq.`,
    hints: [
      'free_irq(irq, dev_id) — the dev_id must match what request_irq received.',
      'For a non-shared line dev_id can be NULL.',
    ],
    solution: `#include <linux/interrupt.h>

void unregister_my_irq(void)
{
    free_irq(11, NULL);
}`,
    starter: `#include <linux/interrupt.h>

void unregister_my_irq(void)
{
    /* TODO: free IRQ 11 with the matching dev_id */
}`,
    tags: ['kernel', 'interrupts', 'free_irq'],
  },
  {
    id: 'lx-ch11-c-005',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Pass Device Context Through dev_id',
    prompt: `You have a struct my_dev *dev. Write int request_with_ctx(struct my_dev *dev) that requests IRQ line 16 and passes dev as the dev_id cookie so the handler can recover it. Use handler my_handler, flags 0, name "mydev". Return request_irq's value.`,
    hints: [
      'The last argument to request_irq is the void *dev_id cookie.',
      'The same pointer is handed back to your handler as its dev_id argument.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
extern irqreturn_t my_handler(int irq, void *dev_id);

int request_with_ctx(struct my_dev *dev)
{
    return request_irq(16, my_handler, 0, "mydev", dev);
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
extern irqreturn_t my_handler(int irq, void *dev_id);

int request_with_ctx(struct my_dev *dev)
{
    /* TODO: pass dev as the dev_id cookie */
}`,
    tags: ['kernel', 'interrupts', 'dev_id'],
  },
  {
    id: 'lx-ch11-c-006',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Recover The Device From dev_id',
    prompt: `Inside a handler, recover your device pointer from the dev_id cookie. Write irqreturn_t my_handler(int irq, void *dev_id) that casts dev_id to struct my_dev * (a local named dev), then returns IRQ_HANDLED. Assume struct my_dev is defined elsewhere.`,
    hints: [
      'dev_id is the same pointer you passed to request_irq.',
      'Just cast it: struct my_dev *dev = dev_id;',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    (void)dev;
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;

irqreturn_t my_handler(int irq, void *dev_id)
{
    /* TODO: recover struct my_dev * from dev_id */
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'interrupts', 'dev_id'],
  },
  {
    id: 'lx-ch11-c-007',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare A Tasklet',
    prompt: `Statically declare a tasklet named my_tasklet that runs the function my_tasklet_fn with argument value 0. Use the DECLARE_TASKLET macro. Also provide the function body for my_tasklet_fn (signature taking an unsigned long data) that just prints "tasklet ran\\n".`,
    hints: [
      'DECLARE_TASKLET(name, func, data) defines a struct tasklet_struct.',
      'The callback takes an unsigned long.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/kernel.h>

static void my_tasklet_fn(unsigned long data)
{
    pr_info("tasklet ran\\n");
}

DECLARE_TASKLET(my_tasklet, my_tasklet_fn, 0);`,
    starter: `#include <linux/interrupt.h>
#include <linux/kernel.h>

static void my_tasklet_fn(unsigned long data)
{
    /* TODO: print "tasklet ran" */
}

/* TODO: DECLARE_TASKLET(...) */`,
    tags: ['kernel', 'tasklet', 'bottom-half'],
  },
  {
    id: 'lx-ch11-c-008',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Schedule A Tasklet From The Top Half',
    prompt: `Write a top-half handler bh_irq(int irq, void *dev_id) that does nothing time-consuming itself: it just schedules an already-declared tasklet named my_tasklet (via tasklet_schedule) and returns IRQ_HANDLED.`,
    hints: [
      'tasklet_schedule(&my_tasklet) queues the bottom half to run soon.',
      'The top half should stay short and return quickly.',
    ],
    solution: `#include <linux/interrupt.h>

extern struct tasklet_struct my_tasklet;

static irqreturn_t bh_irq(int irq, void *dev_id)
{
    tasklet_schedule(&my_tasklet);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

extern struct tasklet_struct my_tasklet;

static irqreturn_t bh_irq(int irq, void *dev_id)
{
    /* TODO: schedule the tasklet, then return IRQ_HANDLED */
}`,
    tags: ['kernel', 'tasklet', 'top-half'],
  },
  {
    id: 'lx-ch11-c-009',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare A Work Item',
    prompt: `Statically declare a workqueue work item named my_work that runs my_work_fn. Use the DECLARE_WORK macro. Also write the function body for my_work_fn with the correct signature (taking a struct work_struct *) that prints "work ran\\n".`,
    hints: [
      'DECLARE_WORK(name, func) builds a struct work_struct.',
      'The callback signature is void func(struct work_struct *work).',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/kernel.h>

static void my_work_fn(struct work_struct *work)
{
    pr_info("work ran\\n");
}

DECLARE_WORK(my_work, my_work_fn);`,
    starter: `#include <linux/workqueue.h>
#include <linux/kernel.h>

static void my_work_fn(struct work_struct *work)
{
    /* TODO: print "work ran" */
}

/* TODO: DECLARE_WORK(...) */`,
    tags: ['kernel', 'workqueue', 'bottom-half'],
  },
  {
    id: 'lx-ch11-c-010',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Queue Work On The System Workqueue',
    prompt: `Write void queue_my_work(void) that submits an already-declared work item named my_work to the shared kernel workqueue using schedule_work. (schedule_work places it on the system_wq.)`,
    hints: [
      'schedule_work(&my_work) queues onto the global system workqueue.',
      'You do not need to create your own workqueue for this.',
    ],
    solution: `#include <linux/workqueue.h>

extern struct work_struct my_work;

void queue_my_work(void)
{
    schedule_work(&my_work);
}`,
    starter: `#include <linux/workqueue.h>

extern struct work_struct my_work;

void queue_my_work(void)
{
    /* TODO: schedule my_work */
}`,
    tags: ['kernel', 'workqueue', 'schedule_work'],
  },
  {
    id: 'lx-ch11-c-011',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Pick The Right GFP Flag In A Handler',
    prompt: `Inside an interrupt handler you must allocate 64 bytes with kmalloc. You CANNOT use GFP_KERNEL there because it may sleep. Write irqreturn_t alloc_irq(int irq, void *dev_id) that allocates a 64-byte buffer with the atomic-safe flag, checks for NULL (return IRQ_NONE on failure), frees it, and returns IRQ_HANDLED.`,
    hints: [
      'GFP_ATOMIC never sleeps and is the correct flag in interrupt context.',
      'Always check kmalloc for NULL.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/slab.h>

static irqreturn_t alloc_irq(int irq, void *dev_id)
{
    void *buf = kmalloc(64, GFP_ATOMIC);

    if (!buf)
        return IRQ_NONE;

    kfree(buf);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/slab.h>

static irqreturn_t alloc_irq(int irq, void *dev_id)
{
    /* TODO: kmalloc 64 bytes with an atomic-safe flag, check NULL, free, return */
}`,
    tags: ['kernel', 'interrupts', 'gfp'],
  },
  {
    id: 'lx-ch11-c-012',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Disable And Restore Local Interrupts',
    prompt: `Write void critical_update(int *counter) that increments *counter inside a section where local CPU interrupts are disabled, then restored. Use local_irq_save(flags) and local_irq_restore(flags) with an unsigned long flags variable.`,
    hints: [
      'local_irq_save(flags) saves the IRQ state and disables interrupts.',
      'local_irq_restore(flags) puts the previous state back — do not use local_irq_enable here.',
    ],
    solution: `#include <linux/irqflags.h>

void critical_update(int *counter)
{
    unsigned long flags;

    local_irq_save(flags);
    (*counter)++;
    local_irq_restore(flags);
}`,
    starter: `#include <linux/irqflags.h>

void critical_update(int *counter)
{
    unsigned long flags;

    /* TODO: save/disable IRQs, bump counter, restore */
}`,
    tags: ['kernel', 'interrupts', 'irqflags'],
  },
  {
    id: 'lx-ch11-c-013',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Request A Shared IRQ Line',
    prompt: `Write int request_shared(struct my_dev *dev) that registers a handler on shared IRQ line 19. For a shared line you MUST pass the IRQF_SHARED flag AND a non-NULL dev_id. Use handler my_handler, name "mydev", and pass dev as the cookie. Return request_irq's value.`,
    hints: [
      'Pass IRQF_SHARED as the flags argument.',
      'Shared lines require a unique non-NULL dev_id so free_irq can tell handlers apart.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
extern irqreturn_t my_handler(int irq, void *dev_id);

int request_shared(struct my_dev *dev)
{
    return request_irq(19, my_handler, IRQF_SHARED, "mydev", dev);
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
extern irqreturn_t my_handler(int irq, void *dev_id);

int request_shared(struct my_dev *dev)
{
    /* TODO: request IRQ 19 with IRQF_SHARED and dev as dev_id */
}`,
    tags: ['kernel', 'interrupts', 'shared'],
  },
  {
    id: 'lx-ch11-c-014',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Shared Handler Must Detect Its Own Device',
    prompt: `Write a handler shared_handler(int irq, void *dev_id) for a shared line. Recover struct my_dev *dev from dev_id, then read its status register with u32 st = read_status(dev) (helper given). If the device's interrupt bit (0x1) is not set, return IRQ_NONE; otherwise acknowledge with ack_irq(dev) (helper given) and return IRQ_HANDLED.`,
    hints: [
      'On a shared line your handler is called even when another device raised the IRQ.',
      'Check your own status bit before doing any work, and return IRQ_NONE if it is clear.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
u32 read_status(struct my_dev *dev);
void ack_irq(struct my_dev *dev);

static irqreturn_t shared_handler(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;
    u32 st = read_status(dev);

    if (!(st & 0x1))
        return IRQ_NONE;

    ack_irq(dev);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
u32 read_status(struct my_dev *dev);
void ack_irq(struct my_dev *dev);

static irqreturn_t shared_handler(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    /* TODO: read status; IRQ_NONE if bit clear; else ack + IRQ_HANDLED */
}`,
    tags: ['kernel', 'interrupts', 'shared'],
  },
  {
    id: 'lx-ch11-c-015',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Top Half Reads, Bottom Half Processes',
    prompt: `Split work. In the top half handler split_irq, read one byte from the device with u8 b = read_byte(dev) (helper given, dev recovered from dev_id), stash it into a global u8 g_byte, then schedule the tasklet proc_tasklet and return IRQ_HANDLED. The quick register read is the only work done in interrupt context.`,
    hints: [
      'The top half should only do the minimum: read/ack and stash data.',
      'tasklet_schedule defers the heavier processing.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
u8 read_byte(struct my_dev *dev);
extern struct tasklet_struct proc_tasklet;

static u8 g_byte;

static irqreturn_t split_irq(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    g_byte = read_byte(dev);
    tasklet_schedule(&proc_tasklet);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
u8 read_byte(struct my_dev *dev);
extern struct tasklet_struct proc_tasklet;

static u8 g_byte;

static irqreturn_t split_irq(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    /* TODO: read byte into g_byte, schedule tasklet, return IRQ_HANDLED */
}`,
    tags: ['kernel', 'interrupts', 'top-half'],
  },
  {
    id: 'lx-ch11-c-016',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Initialize A Tasklet At Runtime',
    prompt: `Instead of DECLARE_TASKLET, initialize a tasklet at runtime. Write void setup_tasklet(void) that initializes a global struct tasklet_struct my_tasklet to call my_tasklet_fn with data 5 using tasklet_init. Assume my_tasklet_fn(unsigned long) is declared elsewhere.`,
    hints: [
      'tasklet_init(&t, func, data) sets up an existing tasklet_struct.',
      'Use it in your module init when the tasklet is embedded in a struct or allocated.',
    ],
    solution: `#include <linux/interrupt.h>

extern void my_tasklet_fn(unsigned long data);

static struct tasklet_struct my_tasklet;

void setup_tasklet(void)
{
    tasklet_init(&my_tasklet, my_tasklet_fn, 5);
}`,
    starter: `#include <linux/interrupt.h>

extern void my_tasklet_fn(unsigned long data);

static struct tasklet_struct my_tasklet;

void setup_tasklet(void)
{
    /* TODO: tasklet_init with func my_tasklet_fn and data 5 */
}`,
    tags: ['kernel', 'tasklet', 'init'],
  },
  {
    id: 'lx-ch11-c-017',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Kill A Tasklet On Cleanup',
    prompt: `Write void teardown_tasklet(void) that, during module exit, makes sure the global tasklet my_tasklet is not pending and will not run again. Use tasklet_kill so it blocks until any in-flight run finishes.`,
    hints: [
      'tasklet_kill(&t) waits for a running tasklet and stops further scheduling.',
      'tasklet_kill may sleep, so call it from process context (module exit), not from an IRQ.',
    ],
    solution: `#include <linux/interrupt.h>

extern struct tasklet_struct my_tasklet;

void teardown_tasklet(void)
{
    tasklet_kill(&my_tasklet);
}`,
    starter: `#include <linux/interrupt.h>

extern struct tasklet_struct my_tasklet;

void teardown_tasklet(void)
{
    /* TODO: stop the tasklet safely */
}`,
    tags: ['kernel', 'tasklet', 'cleanup'],
  },
  {
    id: 'lx-ch11-c-018',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Defer Sleepable Work To A Workqueue',
    prompt: `An interrupt needs to do work that may sleep (it calls a helper that blocks). You cannot do that in the handler. Write irqreturn_t sleep_irq(int irq, void *dev_id) that does NOT call the sleeping helper itself — instead it schedules the work item slow_work (declared elsewhere) and returns IRQ_HANDLED. The sleeping helper will run later inside the work callback.`,
    hints: [
      'Interrupt context cannot sleep — tasklets/softirqs can not either.',
      'Workqueues run in process context, so they may sleep; defer to schedule_work.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

extern struct work_struct slow_work;

static irqreturn_t sleep_irq(int irq, void *dev_id)
{
    schedule_work(&slow_work);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

extern struct work_struct slow_work;

static irqreturn_t sleep_irq(int irq, void *dev_id)
{
    /* TODO: defer sleepable work to the workqueue, then return */
}`,
    tags: ['kernel', 'workqueue', 'interrupts'],
  },
  {
    id: 'lx-ch11-c-019',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Work Callback May Sleep',
    prompt: `Write the work callback void slow_work_fn(struct work_struct *work) that runs in process context. It may sleep here, so allocate 128 bytes with kmalloc using GFP_KERNEL (the sleepable flag), check for NULL and return if allocation failed, then free the buffer.`,
    hints: [
      'Work callbacks run in process context where sleeping is allowed.',
      'GFP_KERNEL is the normal flag for sleepable allocations.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/slab.h>

void slow_work_fn(struct work_struct *work)
{
    void *buf = kmalloc(128, GFP_KERNEL);

    if (!buf)
        return;

    kfree(buf);
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/slab.h>

void slow_work_fn(struct work_struct *work)
{
    /* TODO: kmalloc 128 bytes with GFP_KERNEL, check NULL, free */
}`,
    tags: ['kernel', 'workqueue', 'gfp'],
  },
  {
    id: 'lx-ch11-c-020',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Register A Threaded IRQ',
    prompt: `Register a threaded interrupt on line 22. Write int request_threaded(struct my_dev *dev) using request_threaded_irq with a quick top-half handler primary_handler, a threaded bottom-half thread_fn, flags 0, name "mydev", and dev as dev_id. Return its value. Both handler functions are declared elsewhere.`,
    hints: [
      'request_threaded_irq(irq, handler, thread_fn, flags, name, dev).',
      'The thread_fn runs in a dedicated kernel thread, so it may sleep.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
extern irqreturn_t primary_handler(int irq, void *dev_id);
extern irqreturn_t thread_fn(int irq, void *dev_id);

int request_threaded(struct my_dev *dev)
{
    return request_threaded_irq(22, primary_handler, thread_fn,
                                0, "mydev", dev);
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
extern irqreturn_t primary_handler(int irq, void *dev_id);
extern irqreturn_t thread_fn(int irq, void *dev_id);

int request_threaded(struct my_dev *dev)
{
    /* TODO: call request_threaded_irq for line 22 */
}`,
    tags: ['kernel', 'interrupts', 'threaded'],
  },
  {
    id: 'lx-ch11-c-021',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Top Half That Wakes The IRQ Thread',
    prompt: `Write the quick primary handler primary_handler(int irq, void *dev_id) for a threaded IRQ. Recover dev from dev_id and check int is_mine(struct my_dev *dev) (helper). If not ours, return IRQ_NONE. If ours, return IRQ_WAKE_THREAD so the kernel runs the registered thread_fn bottom half.`,
    hints: [
      'IRQ_WAKE_THREAD tells the core to schedule the threaded handler.',
      'Still return IRQ_NONE when the interrupt is not from your device.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
int is_mine(struct my_dev *dev);

static irqreturn_t primary_handler(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    if (!is_mine(dev))
        return IRQ_NONE;

    return IRQ_WAKE_THREAD;
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
int is_mine(struct my_dev *dev);

static irqreturn_t primary_handler(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    /* TODO: IRQ_NONE if not ours, else IRQ_WAKE_THREAD */
}`,
    tags: ['kernel', 'interrupts', 'threaded'],
  },
  {
    id: 'lx-ch11-c-022',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Threaded Bottom Half May Sleep',
    prompt: `Write the threaded handler thread_fn(int irq, void *dev_id) that runs in process context. Recover dev from dev_id and call void process_data(struct my_dev *dev) (a helper that may block/sleep). Return IRQ_HANDLED. This is exactly why threaded IRQs exist: the bottom half can sleep.`,
    hints: [
      'thread_fn runs in its own kernel thread, so blocking calls are allowed.',
      'Return IRQ_HANDLED to signal the interrupt was handled.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
void process_data(struct my_dev *dev);

static irqreturn_t thread_fn(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    process_data(dev);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
void process_data(struct my_dev *dev);

static irqreturn_t thread_fn(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    /* TODO: run the (possibly sleeping) processing, return IRQ_HANDLED */
}`,
    tags: ['kernel', 'interrupts', 'threaded'],
  },
  {
    id: 'lx-ch11-c-023',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Threaded IRQ With No Top Half',
    prompt: `If you do not need a quick top half, you can pass NULL as the primary handler so the core uses a default one. Write int request_thread_only(struct my_dev *dev) that registers IRQ 23 with primary handler NULL, thread function thread_fn, flag IRQF_ONESHOT (required when handler is NULL), name "mydev", and dev as dev_id. Return its value.`,
    hints: [
      'When the primary handler is NULL, IRQF_ONESHOT is required.',
      'IRQF_ONESHOT keeps the IRQ masked until the threaded handler completes.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
extern irqreturn_t thread_fn(int irq, void *dev_id);

int request_thread_only(struct my_dev *dev)
{
    return request_threaded_irq(23, NULL, thread_fn,
                                IRQF_ONESHOT, "mydev", dev);
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
extern irqreturn_t thread_fn(int irq, void *dev_id);

int request_thread_only(struct my_dev *dev)
{
    /* TODO: NULL primary, thread_fn, IRQF_ONESHOT */
}`,
    tags: ['kernel', 'interrupts', 'threaded'],
  },
  {
    id: 'lx-ch11-c-024',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Handle request_irq Failure In init',
    prompt: `Write int my_init(void) that requests IRQ 11 (handler my_handler, flags 0, name "mydev", dev_id NULL). If request_irq returns a negative error, print "request_irq failed: %d\\n" and return that error code unchanged. On success print "irq registered\\n" and return 0.`,
    hints: [
      'Capture the return value; negative means failure.',
      'Propagate the exact errno so the module load fails cleanly.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/kernel.h>

extern irqreturn_t my_handler(int irq, void *dev_id);

int my_init(void)
{
    int ret = request_irq(11, my_handler, 0, "mydev", NULL);

    if (ret < 0) {
        pr_err("request_irq failed: %d\\n", ret);
        return ret;
    }

    pr_info("irq registered\\n");
    return 0;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/kernel.h>

extern irqreturn_t my_handler(int irq, void *dev_id);

int my_init(void)
{
    int ret = request_irq(11, my_handler, 0, "mydev", NULL);

    /* TODO: handle failure (print + return ret), else success */
}`,
    tags: ['kernel', 'interrupts', 'error-handling'],
  },
  {
    id: 'lx-ch11-c-025',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pass Data To A Tasklet Via Its data Field',
    prompt: `A tasklet's data argument can carry a pointer. Write void schedule_with_ptr(struct my_dev *dev) that sets the global tasklet my_tasklet.data to (unsigned long)dev, then schedules it. The callback can cast data back to struct my_dev *.`,
    hints: [
      'tasklet_struct has a data field of type unsigned long.',
      'Cast the pointer to unsigned long when storing it.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
extern struct tasklet_struct my_tasklet;

void schedule_with_ptr(struct my_dev *dev)
{
    my_tasklet.data = (unsigned long)dev;
    tasklet_schedule(&my_tasklet);
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
extern struct tasklet_struct my_tasklet;

void schedule_with_ptr(struct my_dev *dev)
{
    /* TODO: store dev in my_tasklet.data, then schedule */
}`,
    tags: ['kernel', 'tasklet', 'data'],
  },
  {
    id: 'lx-ch11-c-026',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Recover A Pointer In The Tasklet Callback',
    prompt: `Write the tasklet callback void proc_tasklet_fn(unsigned long data) that recovers struct my_dev *dev from the data argument (it was stored as a pointer) and calls void process(struct my_dev *dev) (helper). Remember: tasklets run in softirq/atomic context, so process() here must NOT sleep — but that is the helper's concern; just call it.`,
    hints: [
      'Cast data back: struct my_dev *dev = (struct my_dev *)data;',
      'Tasklets run in atomic context — no sleeping inside the callback.',
    ],
    solution: `#include <linux/interrupt.h>

struct my_dev;
void process(struct my_dev *dev);

void proc_tasklet_fn(unsigned long data)
{
    struct my_dev *dev = (struct my_dev *)data;

    process(dev);
}`,
    starter: `#include <linux/interrupt.h>

struct my_dev;
void process(struct my_dev *dev);

void proc_tasklet_fn(unsigned long data)
{
    /* TODO: recover dev from data and call process(dev) */
}`,
    tags: ['kernel', 'tasklet', 'data'],
  },
  {
    id: 'lx-ch11-c-027',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Embed A work_struct In A Device Struct',
    prompt: `Define struct my_dev that embeds a struct work_struct named work alongside an int id. Then write void dev_setup(struct my_dev *dev) that initializes that embedded work item to run dev_work_fn using INIT_WORK. dev_work_fn(struct work_struct *) is declared elsewhere.`,
    hints: [
      'INIT_WORK(&dev->work, func) initializes an embedded work_struct at runtime.',
      'Embedding work_struct lets the callback find its device via container_of later.',
    ],
    solution: `#include <linux/workqueue.h>

extern void dev_work_fn(struct work_struct *work);

struct my_dev {
    int id;
    struct work_struct work;
};

void dev_setup(struct my_dev *dev)
{
    INIT_WORK(&dev->work, dev_work_fn);
}`,
    starter: `#include <linux/workqueue.h>

extern void dev_work_fn(struct work_struct *work);

struct my_dev {
    int id;
    /* TODO: embed a work_struct named work */
};

void dev_setup(struct my_dev *dev)
{
    /* TODO: INIT_WORK on the embedded work item */
}`,
    tags: ['kernel', 'workqueue', 'init-work'],
  },
  {
    id: 'lx-ch11-c-028',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find The Device From A Work Callback',
    prompt: `The work_struct named work is embedded inside struct my_dev (with an int id member). Write void dev_work_fn(struct work_struct *work) that uses container_of to recover the enclosing struct my_dev *dev, then prints "work for dev %d\\n" with dev->id.`,
    hints: [
      'container_of(ptr, type, member) walks back from a member to its container.',
      'Here: container_of(work, struct my_dev, work).',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/kernel.h>
#include <linux/container_of.h>

struct my_dev {
    int id;
    struct work_struct work;
};

void dev_work_fn(struct work_struct *work)
{
    struct my_dev *dev = container_of(work, struct my_dev, work);

    pr_info("work for dev %d\\n", dev->id);
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/kernel.h>
#include <linux/container_of.h>

struct my_dev {
    int id;
    struct work_struct work;
};

void dev_work_fn(struct work_struct *work)
{
    /* TODO: container_of to get struct my_dev *, then print id */
}`,
    tags: ['kernel', 'workqueue', 'container_of'],
  },
  {
    id: 'lx-ch11-c-029',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Spin Lock With IRQ Save In Process Context',
    prompt: `A spinlock is shared between an interrupt handler and process-context code. From process context, write void update_locked(struct my_dev *dev) that takes dev->lock (a spinlock_t) with spin_lock_irqsave so the IRQ cannot fire and deadlock on the same lock, increments dev->count, then releases with spin_unlock_irqrestore.`,
    hints: [
      'spin_lock_irqsave(&lock, flags) disables local IRQs while holding the lock.',
      'Use it whenever the same lock is also taken from an interrupt handler.',
    ],
    solution: `#include <linux/spinlock.h>

struct my_dev {
    spinlock_t lock;
    int count;
};

void update_locked(struct my_dev *dev)
{
    unsigned long flags;

    spin_lock_irqsave(&dev->lock, flags);
    dev->count++;
    spin_unlock_irqrestore(&dev->lock, flags);
}`,
    starter: `#include <linux/spinlock.h>

struct my_dev {
    spinlock_t lock;
    int count;
};

void update_locked(struct my_dev *dev)
{
    unsigned long flags;

    /* TODO: take lock with irqsave, bump count, release with irqrestore */
}`,
    tags: ['kernel', 'spinlock', 'interrupts'],
  },
  {
    id: 'lx-ch11-c-030',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Plain spin_lock Inside The Handler',
    prompt: `Inside an interrupt handler, interrupts on this CPU are already off, so you use the plain spinlock variant. Write irqreturn_t lock_irq(int irq, void *dev_id) that recovers dev from dev_id, takes dev->lock with spin_lock, increments dev->count, releases with spin_unlock, and returns IRQ_HANDLED.`,
    hints: [
      'You do not need _irqsave inside the handler — the line is already masked here.',
      'Plain spin_lock / spin_unlock is correct and cheaper in this context.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/spinlock.h>

struct my_dev {
    spinlock_t lock;
    int count;
};

static irqreturn_t lock_irq(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    spin_lock(&dev->lock);
    dev->count++;
    spin_unlock(&dev->lock);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/spinlock.h>

struct my_dev {
    spinlock_t lock;
    int count;
};

static irqreturn_t lock_irq(int irq, void *dev_id)
{
    struct my_dev *dev = dev_id;

    /* TODO: plain spin_lock around count++, return IRQ_HANDLED */
}`,
    tags: ['kernel', 'spinlock', 'interrupts'],
  },
  {
    id: 'lx-ch11-c-031',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Create A Dedicated Workqueue',
    prompt: `Write int wq_init(void) that creates a single-threaded workqueue named "mydev_wq" stored in the global struct workqueue_struct *my_wq using create_singlethread_workqueue. If it returns NULL, return -ENOMEM; otherwise return 0.`,
    hints: [
      'create_singlethread_workqueue("name") returns a workqueue_struct * or NULL.',
      'A NULL return means allocation failed — report -ENOMEM.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/errno.h>

static struct workqueue_struct *my_wq;

int wq_init(void)
{
    my_wq = create_singlethread_workqueue("mydev_wq");
    if (!my_wq)
        return -ENOMEM;

    return 0;
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/errno.h>

static struct workqueue_struct *my_wq;

int wq_init(void)
{
    /* TODO: create the workqueue, return -ENOMEM on failure */
}`,
    tags: ['kernel', 'workqueue', 'create'],
  },
  {
    id: 'lx-ch11-c-032',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Queue Onto A Custom Workqueue And Destroy It',
    prompt: `Write two functions. void wq_submit(void) queues the work item my_work onto the custom workqueue my_wq using queue_work. void wq_exit(void) flushes pending work then destroys the queue using flush_workqueue followed by destroy_workqueue. Assume my_wq and my_work are declared elsewhere.`,
    hints: [
      'queue_work(wq, work) targets your own workqueue instead of the system one.',
      'On teardown, flush_workqueue then destroy_workqueue to avoid use-after-free.',
    ],
    solution: `#include <linux/workqueue.h>

extern struct workqueue_struct *my_wq;
extern struct work_struct my_work;

void wq_submit(void)
{
    queue_work(my_wq, &my_work);
}

void wq_exit(void)
{
    flush_workqueue(my_wq);
    destroy_workqueue(my_wq);
}`,
    starter: `#include <linux/workqueue.h>

extern struct workqueue_struct *my_wq;
extern struct work_struct my_work;

void wq_submit(void)
{
    /* TODO: queue my_work onto my_wq */
}

void wq_exit(void)
{
    /* TODO: flush, then destroy my_wq */
}`,
    tags: ['kernel', 'workqueue', 'cleanup'],
  },
  {
    id: 'lx-ch11-c-033',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Defer A Copy To User Out Of The Handler',
    prompt: `copy_to_user may fault and sleep, so it is forbidden in interrupt context. You must NOT call it from the handler. Write irqreturn_t notify_irq(int irq, void *dev_id) that only schedules the work item copy_work (declared elsewhere) and returns IRQ_HANDLED. The actual copy_to_user will happen later in the work callback (process context), where faulting is allowed.`,
    hints: [
      'copy_to_user can page-fault and block — never call it in IRQ/atomic context.',
      'Defer it to a workqueue, which runs in process context.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

extern struct work_struct copy_work;

static irqreturn_t notify_irq(int irq, void *dev_id)
{
    schedule_work(&copy_work);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

extern struct work_struct copy_work;

static irqreturn_t notify_irq(int irq, void *dev_id)
{
    /* TODO: defer the copy to a workqueue, return IRQ_HANDLED */
}`,
    tags: ['kernel', 'interrupts', 'copy_to_user'],
  },
  {
    id: 'lx-ch11-c-034',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Raise A Custom Softirq',
    prompt: `Demonstrate softirqs. Write void my_softirq_action(struct softirq_action *a) that prints "softirq ran\\n", and write void raise_my_softirq(void) that marks it pending with raise_softirq using the index MY_SOFTIRQ (assume the slot was registered with open_softirq elsewhere and MY_SOFTIRQ is defined).`,
    hints: [
      'open_softirq(NR, action) registers the action; raise_softirq(NR) marks it pending.',
      'The softirq action runs soon after, in softirq context (atomic — no sleeping).',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/kernel.h>

void my_softirq_action(struct softirq_action *a)
{
    pr_info("softirq ran\\n");
}

void raise_my_softirq(void)
{
    raise_softirq(MY_SOFTIRQ);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/kernel.h>

void my_softirq_action(struct softirq_action *a)
{
    /* TODO: print "softirq ran" */
}

void raise_my_softirq(void)
{
    /* TODO: raise the MY_SOFTIRQ softirq */
}`,
    tags: ['kernel', 'softirq', 'bottom-half'],
  },
  {
    id: 'lx-ch11-c-035',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Full Module: Top Half Schedules A Tasklet',
    prompt: `Tie it together. Write a tiny module: a tasklet bh_tasklet that runs bh_fn (prints "bottom half\\n"); a handler top_irq that schedules bh_tasklet and returns IRQ_HANDLED; an init mod_init that calls request_irq on line 11 (handler top_irq, flags IRQF_SHARED, name "demo", dev_id &bh_tasklet) and returns its result; an exit mod_exit that calls free_irq(11, &bh_tasklet) then tasklet_kill(&bh_tasklet). Use DECLARE_TASKLET for the tasklet.`,
    hints: [
      'A shared line needs IRQF_SHARED and a unique non-NULL dev_id — &bh_tasklet works as the cookie.',
      'free_irq must use the same irq and dev_id that request_irq got; tasklet_kill on the way out.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/kernel.h>

static void bh_fn(unsigned long data)
{
    pr_info("bottom half\\n");
}

static DECLARE_TASKLET(bh_tasklet, bh_fn, 0);

static irqreturn_t top_irq(int irq, void *dev_id)
{
    tasklet_schedule(&bh_tasklet);
    return IRQ_HANDLED;
}

int mod_init(void)
{
    return request_irq(11, top_irq, IRQF_SHARED, "demo", &bh_tasklet);
}

void mod_exit(void)
{
    free_irq(11, &bh_tasklet);
    tasklet_kill(&bh_tasklet);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/kernel.h>

static void bh_fn(unsigned long data)
{
    /* TODO: print "bottom half" */
}

/* TODO: DECLARE_TASKLET(bh_tasklet, bh_fn, 0); */

static irqreturn_t top_irq(int irq, void *dev_id)
{
    /* TODO: schedule the tasklet, return IRQ_HANDLED */
}

int mod_init(void)
{
    /* TODO: request_irq on line 11, IRQF_SHARED, dev_id &bh_tasklet */
}

void mod_exit(void)
{
    /* TODO: free_irq then tasklet_kill */
}`,
    tags: ['kernel', 'interrupts', 'tasklet'],
  },
]

export default problems
