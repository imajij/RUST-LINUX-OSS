import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch11-c-036',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register A Shared IRQ Handler',
    prompt: `Write \`int myirq_request(int irq, void *dev)\` that registers a handler for an interrupt line.

Requirements:
- Call \`request_irq()\` with the named handler \`my_handler\` (declared above as \`irqreturn_t my_handler(int irq, void *dev_id);\`).
- Use the flag \`IRQF_SHARED\` because the line is shared with other devices.
- Pass the name \`"mydev"\` (shown in /proc/interrupts) and \`dev\` as the cookie/dev_id.
- Return the result of \`request_irq()\` (0 on success, negative errno on failure), logging an error on failure.`,
    hints: [
      'request_irq(irq, handler, flags, name, dev_id).',
      'A shared line REQUIRES a non-NULL dev_id so free_irq() can find the right handler.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/kernel.h>

irqreturn_t my_handler(int irq, void *dev_id);

int myirq_request(int irq, void *dev)
{
    int ret = request_irq(irq, my_handler, IRQF_SHARED, "mydev", dev);
    if (ret)
        pr_err("mydev: request_irq(%d) failed: %d\\n", irq, ret);
    return ret;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/kernel.h>

irqreturn_t my_handler(int irq, void *dev_id);

int myirq_request(int irq, void *dev)
{
    // TODO: request_irq with IRQF_SHARED, name "mydev", cookie dev
    return 0;
}`,
    tags: ['kernel', 'interrupts', 'request_irq'],
  },
  {
    id: 'lx-ch11-c-037',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Minimal Interrupt Handler',
    prompt: `Write the top-half handler \`irqreturn_t my_handler(int irq, void *dev_id)\` for a device that always owns the interrupt when called.

Requirements:
- Increment a global \`static unsigned long irq_count;\` to record the interrupt.
- Return \`IRQ_HANDLED\` to tell the kernel the interrupt was serviced.
- Do nothing that could sleep — this runs in interrupt context.`,
    hints: [
      'Top halves run in interrupt (atomic) context: no sleeping, no blocking allocations.',
      'IRQ_HANDLED means "this was mine and I handled it".',
    ],
    solution: `#include <linux/interrupt.h>

static unsigned long irq_count;

irqreturn_t my_handler(int irq, void *dev_id)
{
    irq_count++;
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

static unsigned long irq_count;

irqreturn_t my_handler(int irq, void *dev_id)
{
    // TODO: bump irq_count, return IRQ_HANDLED
    return IRQ_NONE;
}`,
    tags: ['kernel', 'interrupts', 'top-half'],
  },
  {
    id: 'lx-ch11-c-038',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Free An IRQ On A Shared Line',
    prompt: `Write \`void myirq_release(int irq, void *dev)\` that releases an interrupt registered with \`IRQF_SHARED\`.

Requirements:
- Call \`free_irq(irq, dev)\`; the \`dev\` cookie must match the one passed to \`request_irq()\` so the kernel removes the correct handler from the shared chain.
- After this returns, no more interrupts will reach your handler, and any in-flight handler has completed.`,
    hints: [
      'free_irq(irq, dev_id) must use the SAME dev_id that request_irq() got.',
      'free_irq() blocks until any currently executing instance of the handler finishes.',
    ],
    solution: `#include <linux/interrupt.h>

void myirq_release(int irq, void *dev)
{
    free_irq(irq, dev);
}`,
    starter: `#include <linux/interrupt.h>

void myirq_release(int irq, void *dev)
{
    // TODO: free_irq with the matching dev cookie
}`,
    tags: ['kernel', 'interrupts', 'free_irq'],
  },
  {
    id: 'lx-ch11-c-039',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Shared Handler That Checks Ownership',
    prompt: `On a shared line, your handler is called even when another device raised the interrupt. Write \`irqreturn_t my_handler(int irq, void *dev_id)\` that only claims the interrupt if its device actually fired.

Context: \`dev_id\` points at \`struct mydev { void __iomem *regs; };\` and reading the status register \`mydev_read_status(dev)\` returns nonzero only when this device has a pending interrupt.

Requirements:
- Recover \`struct mydev *dev = dev_id;\`.
- If \`mydev_read_status(dev)\` is 0, return \`IRQ_NONE\` (not ours).
- Otherwise acknowledge the device (\`mydev_ack(dev)\`) and return \`IRQ_HANDLED\`.`,
    hints: [
      'On a shared line you MUST return IRQ_NONE when the interrupt was not yours.',
      'Returning IRQ_HANDLED for a spurious call hides the real source from the kernel.',
    ],
    solution: `#include <linux/interrupt.h>

struct mydev { void __iomem *regs; };
unsigned int mydev_read_status(struct mydev *dev);
void mydev_ack(struct mydev *dev);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    if (!mydev_read_status(dev))
        return IRQ_NONE;

    mydev_ack(dev);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

struct mydev { void __iomem *regs; };
unsigned int mydev_read_status(struct mydev *dev);
void mydev_ack(struct mydev *dev);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: IRQ_NONE if no pending status, else ack and IRQ_HANDLED
    return IRQ_NONE;
}`,
    tags: ['kernel', 'interrupts', 'shared-irq'],
  },
  {
    id: 'lx-ch11-c-040',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Declare And Schedule A Tasklet',
    prompt: `Split work into a bottom half using a tasklet. Statically declare a tasklet and schedule it from an interrupt handler.

Requirements:
- Write the bottom-half function \`void my_tasklet_fn(unsigned long data)\` that increments \`static unsigned long bh_runs;\`.
- Declare it statically with \`DECLARE_TASKLET(my_tasklet, my_tasklet_fn, 0)\`.
- Write \`irqreturn_t my_handler(int irq, void *dev_id)\` that schedules the tasklet with \`tasklet_schedule(&my_tasklet)\` and returns \`IRQ_HANDLED\`.`,
    hints: [
      'DECLARE_TASKLET(name, func, data) builds a ready-to-use tasklet.',
      'tasklet_schedule() is cheap and safe to call from interrupt context.',
    ],
    solution: `#include <linux/interrupt.h>

static unsigned long bh_runs;

void my_tasklet_fn(unsigned long data)
{
    bh_runs++;
}

DECLARE_TASKLET(my_tasklet, my_tasklet_fn, 0);

irqreturn_t my_handler(int irq, void *dev_id)
{
    tasklet_schedule(&my_tasklet);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

static unsigned long bh_runs;

void my_tasklet_fn(unsigned long data)
{
    // TODO: bump bh_runs
}

// TODO: DECLARE_TASKLET(my_tasklet, my_tasklet_fn, 0)

irqreturn_t my_handler(int irq, void *dev_id)
{
    // TODO: tasklet_schedule(&my_tasklet), return IRQ_HANDLED
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'tasklet', 'bottom-half'],
  },
  {
    id: 'lx-ch11-c-041',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Top Half / Bottom Half Split With A Tasklet',
    prompt: `A device delivers a status word at interrupt time but the response processing is heavier. Write the top half and the tasklet so the quick acknowledge happens in the handler and the heavy work runs later.

Context: globals \`static u32 latched_status;\` and \`DECLARE_TASKLET(work_tasklet, do_work, 0)\`. Helpers: \`u32 hw_read_status(void)\`, \`void hw_ack(void)\`, \`void process_status(u32 s)\`.

Requirements:
- In \`irqreturn_t my_handler(int irq, void *dev_id)\`: read the status, store it in \`latched_status\`, \`hw_ack()\` immediately, schedule \`work_tasklet\`, and return \`IRQ_HANDLED\`.
- In \`void do_work(unsigned long data)\`: call \`process_status(latched_status)\`.`,
    hints: [
      'Do the minimum (read + ack) in the top half, defer process_status to the bottom half.',
      'Latch any hardware state you need before re-enabling/acknowledging the device.',
    ],
    solution: `#include <linux/interrupt.h>

static u32 latched_status;
u32 hw_read_status(void);
void hw_ack(void);
void process_status(u32 s);

void do_work(unsigned long data)
{
    process_status(latched_status);
}

DECLARE_TASKLET(work_tasklet, do_work, 0);

irqreturn_t my_handler(int irq, void *dev_id)
{
    latched_status = hw_read_status();
    hw_ack();
    tasklet_schedule(&work_tasklet);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

static u32 latched_status;
u32 hw_read_status(void);
void hw_ack(void);
void process_status(u32 s);

void do_work(unsigned long data)
{
    // TODO: process_status(latched_status)
}

DECLARE_TASKLET(work_tasklet, do_work, 0);

irqreturn_t my_handler(int irq, void *dev_id)
{
    // TODO: latch status, ack hw, schedule tasklet, return IRQ_HANDLED
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'tasklet', 'bottom-half'],
  },
  {
    id: 'lx-ch11-c-042',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pass A Device Pointer To A Tasklet',
    prompt: `Tasklets carry one \`unsigned long data\` argument; drivers stash a pointer there. Write code that initializes a per-device tasklet to receive the device pointer and uses it in the callback.

Context: \`struct mydev { struct tasklet_struct tl; int id; };\`.

Requirements:
- Write \`void my_tasklet_fn(unsigned long data)\` that casts \`data\` back to \`struct mydev *\` and reads \`dev->id\`.
- Write \`void mydev_setup_tasklet(struct mydev *dev)\` that calls \`tasklet_init(&dev->tl, my_tasklet_fn, (unsigned long)dev)\`.`,
    hints: [
      'tasklet_init(t, func, data) is the runtime equivalent of DECLARE_TASKLET.',
      'Cast the pointer to unsigned long going in, and back to the pointer type coming out.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/kernel.h>

struct mydev { struct tasklet_struct tl; int id; };

void my_tasklet_fn(unsigned long data)
{
    struct mydev *dev = (struct mydev *)data;
    pr_info("mydev: bottom half for dev %d\\n", dev->id);
}

void mydev_setup_tasklet(struct mydev *dev)
{
    tasklet_init(&dev->tl, my_tasklet_fn, (unsigned long)dev);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/kernel.h>

struct mydev { struct tasklet_struct tl; int id; };

void my_tasklet_fn(unsigned long data)
{
    // TODO: cast data to struct mydev *, use dev->id
}

void mydev_setup_tasklet(struct mydev *dev)
{
    // TODO: tasklet_init with (unsigned long)dev
}`,
    tags: ['kernel', 'tasklet', 'tasklet_init'],
  },
  {
    id: 'lx-ch11-c-043',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Kill A Tasklet At Module Unload',
    prompt: `Before freeing a device that owns a tasklet you must make sure no instance is running or pending. Write \`void mydev_teardown(struct mydev *dev)\`.

Context: \`struct mydev { struct tasklet_struct tl; };\`.

Requirements:
- Call \`tasklet_kill(&dev->tl)\` which waits for any running instance to finish and ensures the tasklet will not run again.
- This must run in process context (it can sleep), e.g. from your module-exit / remove path — not from interrupt context.`,
    hints: [
      'tasklet_kill() may sleep waiting for an in-flight run, so call it from process context.',
      'After tasklet_kill() it is safe to free the struct the tasklet pointed at.',
    ],
    solution: `#include <linux/interrupt.h>

struct mydev { struct tasklet_struct tl; };

void mydev_teardown(struct mydev *dev)
{
    tasklet_kill(&dev->tl);
}`,
    starter: `#include <linux/interrupt.h>

struct mydev { struct tasklet_struct tl; };

void mydev_teardown(struct mydev *dev)
{
    // TODO: tasklet_kill(&dev->tl)
}`,
    tags: ['kernel', 'tasklet', 'cleanup'],
  },
  {
    id: 'lx-ch11-c-044',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Declare And Schedule A Workqueue Item',
    prompt: `When the bottom half needs to sleep (allocate with GFP_KERNEL, take a mutex, do I/O), use a workqueue instead of a tasklet. Declare a work item and schedule it onto the shared system workqueue.

Requirements:
- Write the work function \`void my_work_fn(struct work_struct *work)\` that increments \`static unsigned long work_runs;\`.
- Declare it statically with \`DECLARE_WORK(my_work, my_work_fn)\`.
- Write \`irqreturn_t my_handler(int irq, void *dev_id)\` that calls \`schedule_work(&my_work)\` and returns \`IRQ_HANDLED\`.`,
    hints: [
      'DECLARE_WORK(name, func) builds a work_struct bound to func.',
      'schedule_work() queues onto the shared system_wq; the work runs in process context where sleeping is allowed.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

static unsigned long work_runs;

void my_work_fn(struct work_struct *work)
{
    work_runs++;
}

DECLARE_WORK(my_work, my_work_fn);

irqreturn_t my_handler(int irq, void *dev_id)
{
    schedule_work(&my_work);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

static unsigned long work_runs;

void my_work_fn(struct work_struct *work)
{
    // TODO: bump work_runs
}

// TODO: DECLARE_WORK(my_work, my_work_fn)

irqreturn_t my_handler(int irq, void *dev_id)
{
    // TODO: schedule_work(&my_work), return IRQ_HANDLED
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'workqueue', 'bottom-half'],
  },
  {
    id: 'lx-ch11-c-045',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sleepable Bottom Half In A Work Function',
    prompt: `A work item may do things forbidden in interrupt context. Write \`void my_work_fn(struct work_struct *work)\` that allocates a buffer with \`GFP_KERNEL\` and copies device data into it.

Context: helpers \`size_t hw_pending_len(void)\` and \`void hw_drain(void *buf, size_t n)\`.

Requirements:
- Read the length, \`kmalloc(len, GFP_KERNEL)\` (allowed here — work runs in process context and may sleep).
- If allocation fails, log and return.
- Otherwise \`hw_drain(buf, len)\`, then \`kfree(buf)\`.`,
    hints: [
      'Work functions run in process context, so GFP_KERNEL (which may sleep) is fine.',
      'The same kmalloc in a tasklet or hard IRQ handler would require GFP_ATOMIC.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/slab.h>
#include <linux/kernel.h>

size_t hw_pending_len(void);
void hw_drain(void *buf, size_t n);

void my_work_fn(struct work_struct *work)
{
    size_t len = hw_pending_len();
    void *buf = kmalloc(len, GFP_KERNEL);

    if (!buf) {
        pr_err("mydev: work alloc failed\\n");
        return;
    }

    hw_drain(buf, len);
    kfree(buf);
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/slab.h>
#include <linux/kernel.h>

size_t hw_pending_len(void);
void hw_drain(void *buf, size_t n);

void my_work_fn(struct work_struct *work)
{
    // TODO: kmalloc(len, GFP_KERNEL), drain, kfree; handle ENOMEM
}`,
    tags: ['kernel', 'workqueue', 'gfp_kernel'],
  },
  {
    id: 'lx-ch11-c-046',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Embed A Work Struct And Recover The Device',
    prompt: `Embed the work item in the device struct and recover the device from the work pointer inside the callback.

Context: \`struct mydev { struct work_struct work; int id; };\`.

Requirements:
- Write \`void my_work_fn(struct work_struct *work)\` that uses \`container_of(work, struct mydev, work)\` to get the device and reads \`dev->id\`.
- Write \`void mydev_init_work(struct mydev *dev)\` that calls \`INIT_WORK(&dev->work, my_work_fn)\`.`,
    hints: [
      'INIT_WORK initializes an embedded work_struct at runtime.',
      'container_of(work, struct mydev, work) walks from the embedded member back to the device.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/kernel.h>

struct mydev { struct work_struct work; int id; };

void my_work_fn(struct work_struct *work)
{
    struct mydev *dev = container_of(work, struct mydev, work);
    pr_info("mydev: work for dev %d\\n", dev->id);
}

void mydev_init_work(struct mydev *dev)
{
    INIT_WORK(&dev->work, my_work_fn);
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/kernel.h>

struct mydev { struct work_struct work; int id; };

void my_work_fn(struct work_struct *work)
{
    // TODO: container_of(work, struct mydev, work), use dev->id
}

void mydev_init_work(struct mydev *dev)
{
    // TODO: INIT_WORK(&dev->work, my_work_fn)
}`,
    tags: ['kernel', 'workqueue', 'container_of'],
  },
  {
    id: 'lx-ch11-c-047',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Create A Dedicated Workqueue',
    prompt: `For predictable ordering you can run work on your own single-threaded workqueue. Write init and exit helpers.

Globals: \`static struct workqueue_struct *my_wq;\`.

Requirements:
- In \`int mydev_wq_init(void)\`: create the queue with \`alloc_ordered_workqueue("mydev_wq", 0)\`; return \`-ENOMEM\` on failure, else 0.
- In \`void mydev_wq_exit(void)\`: \`flush_workqueue(my_wq)\` then \`destroy_workqueue(my_wq)\`.`,
    hints: [
      'alloc_ordered_workqueue() returns NULL on failure (it is not an ERR_PTR).',
      'destroy_workqueue() already drains pending work, but flushing first is the explicit, safe pattern.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/errno.h>

static struct workqueue_struct *my_wq;

int mydev_wq_init(void)
{
    my_wq = alloc_ordered_workqueue("mydev_wq", 0);
    if (!my_wq)
        return -ENOMEM;
    return 0;
}

void mydev_wq_exit(void)
{
    flush_workqueue(my_wq);
    destroy_workqueue(my_wq);
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/errno.h>

static struct workqueue_struct *my_wq;

int mydev_wq_init(void)
{
    // TODO: alloc_ordered_workqueue, return -ENOMEM on NULL
    return 0;
}

void mydev_wq_exit(void)
{
    // TODO: flush_workqueue then destroy_workqueue
}`,
    tags: ['kernel', 'workqueue', 'alloc_workqueue'],
  },
  {
    id: 'lx-ch11-c-048',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Queue Work Onto A Private Workqueue',
    prompt: `Schedule a per-device work item onto your own workqueue from the interrupt handler.

Context: \`struct mydev { struct work_struct work; };\` and a global \`static struct workqueue_struct *my_wq;\` (already created).

Requirements:
- Write \`irqreturn_t my_handler(int irq, void *dev_id)\` that recovers \`struct mydev *dev = dev_id;\`, calls \`queue_work(my_wq, &dev->work)\`, and returns \`IRQ_HANDLED\`.
- Do not call \`schedule_work()\` — that would use the shared system queue instead of yours.`,
    hints: [
      'queue_work(wq, work) targets a specific workqueue; schedule_work targets system_wq.',
      'queue_work returns false if the work was already queued; that is fine to ignore here.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

struct mydev { struct work_struct work; };
static struct workqueue_struct *my_wq;

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    queue_work(my_wq, &dev->work);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

struct mydev { struct work_struct work; };
static struct workqueue_struct *my_wq;

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: queue_work(my_wq, &dev->work), return IRQ_HANDLED
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'workqueue', 'queue_work'],
  },
  {
    id: 'lx-ch11-c-049',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register A Threaded IRQ',
    prompt: `A threaded IRQ runs the heavy half in a dedicated kernel thread where sleeping is allowed. Register one with no separate hard-IRQ handler.

Requirements:
- Write \`int myirq_request_threaded(int irq, void *dev)\` that calls \`request_threaded_irq(irq, NULL, my_thread_fn, IRQF_ONESHOT, "mydev", dev)\`.
- \`my_thread_fn\` is declared as \`irqreturn_t my_thread_fn(int irq, void *dev_id);\`.
- Passing \`NULL\` for the hard handler means the default primary handler just wakes the thread; \`IRQF_ONESHOT\` is required in that case.
- Return the call's result (0 on success, negative errno otherwise).`,
    hints: [
      'request_threaded_irq(irq, handler, thread_fn, flags, name, dev).',
      'With a NULL primary handler you MUST set IRQF_ONESHOT so the line stays masked until the thread completes.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/kernel.h>

irqreturn_t my_thread_fn(int irq, void *dev_id);

int myirq_request_threaded(int irq, void *dev)
{
    int ret = request_threaded_irq(irq, NULL, my_thread_fn,
                                   IRQF_ONESHOT, "mydev", dev);
    if (ret)
        pr_err("mydev: request_threaded_irq failed: %d\\n", ret);
    return ret;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/kernel.h>

irqreturn_t my_thread_fn(int irq, void *dev_id);

int myirq_request_threaded(int irq, void *dev)
{
    // TODO: request_threaded_irq(irq, NULL, my_thread_fn, IRQF_ONESHOT, "mydev", dev)
    return 0;
}`,
    tags: ['kernel', 'interrupts', 'threaded-irq'],
  },
  {
    id: 'lx-ch11-c-050',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Threaded IRQ Handler That Sleeps',
    prompt: `Write the thread function \`irqreturn_t my_thread_fn(int irq, void *dev_id)\` that performs sleepable work for a device.

Context: \`dev_id\` is \`struct mydev { struct mutex lock; };\` and \`void mydev_slow_io(struct mydev *dev)\` may block.

Requirements:
- Recover \`struct mydev *dev = dev_id;\`.
- Take \`mutex_lock(&dev->lock)\` (allowed here: the thread runs in process context).
- Call \`mydev_slow_io(dev)\`, then \`mutex_unlock(&dev->lock)\`.
- Return \`IRQ_HANDLED\`.`,
    hints: [
      'The thread_fn of a threaded IRQ runs in process context — it may sleep, block on mutexes, and do slow I/O.',
      'This is exactly the work you could NOT do in a hard IRQ handler.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/mutex.h>

struct mydev { struct mutex lock; };
void mydev_slow_io(struct mydev *dev);

irqreturn_t my_thread_fn(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    mutex_lock(&dev->lock);
    mydev_slow_io(dev);
    mutex_unlock(&dev->lock);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/mutex.h>

struct mydev { struct mutex lock; };
void mydev_slow_io(struct mydev *dev);

irqreturn_t my_thread_fn(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: lock, slow io, unlock, return IRQ_HANDLED
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'threaded-irq', 'mutex'],
  },
  {
    id: 'lx-ch11-c-051',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'GFP_ATOMIC Allocation In A Tasklet',
    prompt: `A tasklet runs in atomic (softirq) context, so it must never sleep. Write \`void my_tasklet_fn(unsigned long data)\` that allocates a small buffer correctly.

Context: helper \`void stash(void *p);\` takes ownership of the buffer.

Requirements:
- Allocate 64 bytes with the flag that does not sleep: \`kmalloc(64, GFP_ATOMIC)\`.
- If allocation fails, just return (drop the work) — do not retry or sleep.
- On success, pass the buffer to \`stash(buf)\`.`,
    hints: [
      'Tasklets run in atomic context: use GFP_ATOMIC, never GFP_KERNEL.',
      'GFP_ATOMIC will not sleep but can fail more easily; always check the result.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/slab.h>

void stash(void *p);

void my_tasklet_fn(unsigned long data)
{
    void *buf = kmalloc(64, GFP_ATOMIC);

    if (!buf)
        return;

    stash(buf);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/slab.h>

void stash(void *p);

void my_tasklet_fn(unsigned long data)
{
    // TODO: kmalloc(64, GFP_ATOMIC), handle failure, stash(buf)
}`,
    tags: ['kernel', 'tasklet', 'gfp_atomic'],
  },
  {
    id: 'lx-ch11-c-052',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Save And Restore Flags Around A Critical Section',
    prompt: `A process-context function shares data with an interrupt handler and must disable local interrupts while touching it. Write \`void update_shared(struct mydev *dev, int v)\`.

Context: \`struct mydev { spinlock_t lock; int shared; };\` (lock already initialized).

Requirements:
- Use \`spin_lock_irqsave(&dev->lock, flags)\` to take the lock AND disable local IRQs, saving prior state into \`unsigned long flags\`.
- Set \`dev->shared = v\`.
- Use \`spin_unlock_irqrestore(&dev->lock, flags)\` to release and restore the previous interrupt state.`,
    hints: [
      'spin_lock_irqsave saves the IRQ enable state so nesting is safe; pair it with spin_unlock_irqrestore.',
      'Use the *_irqsave variant (not plain spin_lock) when the same lock is taken in interrupt context.',
    ],
    solution: `#include <linux/spinlock.h>

struct mydev { spinlock_t lock; int shared; };

void update_shared(struct mydev *dev, int v)
{
    unsigned long flags;

    spin_lock_irqsave(&dev->lock, flags);
    dev->shared = v;
    spin_unlock_irqrestore(&dev->lock, flags);
}`,
    starter: `#include <linux/spinlock.h>

struct mydev { spinlock_t lock; int shared; };

void update_shared(struct mydev *dev, int v)
{
    unsigned long flags;
    // TODO: spin_lock_irqsave / set shared / spin_unlock_irqrestore
}`,
    tags: ['kernel', 'spinlock', 'irqsave'],
  },
  {
    id: 'lx-ch11-c-053',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Spinlock Inside An Interrupt Handler',
    prompt: `Inside a hard IRQ handler, local interrupts are already disabled on this CPU, so a plain spin_lock is enough for the data shared with process context (which uses spin_lock_irqsave). Write the handler.

Context: \`struct mydev { spinlock_t lock; u32 events; };\`, \`dev_id\` points at the \`struct mydev\`.

Requirements:
- Recover \`struct mydev *dev = dev_id;\`.
- Take \`spin_lock(&dev->lock)\`, increment \`dev->events\`, then \`spin_unlock(&dev->lock)\`.
- Return \`IRQ_HANDLED\`.`,
    hints: [
      'A hard IRQ handler already runs with interrupts disabled, so spin_lock (not irqsave) is correct inside it.',
      'The process-context side must still use spin_lock_irqsave to keep the pairing safe.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/spinlock.h>

struct mydev { spinlock_t lock; u32 events; };

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    spin_lock(&dev->lock);
    dev->events++;
    spin_unlock(&dev->lock);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/spinlock.h>

struct mydev { spinlock_t lock; u32 events; };

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: spin_lock, bump events, spin_unlock, IRQ_HANDLED
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'spinlock', 'interrupts'],
  },
  {
    id: 'lx-ch11-c-054',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Lock Out Bottom Halves From Process Context',
    prompt: `Data is shared between process context and a tasklet (softirq) bottom half — but not a hard IRQ. Write \`int read_count(struct mydev *dev)\` that reads it safely.

Context: \`struct mydev { spinlock_t lock; int count; };\`.

Requirements:
- Use \`spin_lock_bh(&dev->lock)\` which disables softirqs (and thus tasklets) on this CPU while holding the lock.
- Read \`int v = dev->count;\`.
- Release with \`spin_unlock_bh(&dev->lock)\` and return \`v\`.`,
    hints: [
      'spin_lock_bh disables bottom halves (softirqs/tasklets) — lighter than disabling hard IRQs.',
      'Use the _bh variant when the only other user is a tasklet or softirq, not a hard IRQ handler.',
    ],
    solution: `#include <linux/spinlock.h>

struct mydev { spinlock_t lock; int count; };

int read_count(struct mydev *dev)
{
    int v;

    spin_lock_bh(&dev->lock);
    v = dev->count;
    spin_unlock_bh(&dev->lock);
    return v;
}`,
    starter: `#include <linux/spinlock.h>

struct mydev { spinlock_t lock; int count; };

int read_count(struct mydev *dev)
{
    int v;
    // TODO: spin_lock_bh / read count / spin_unlock_bh, return v
    return 0;
}`,
    tags: ['kernel', 'spinlock', 'bottom-half'],
  },
  {
    id: 'lx-ch11-c-055',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Schedule Delayed Work',
    prompt: `A device needs a follow-up action 200 ms after an interrupt. Use a delayed work item.

Globals: \`static void poll_fn(struct work_struct *work);\` and \`static DECLARE_DELAYED_WORK(poll_work, poll_fn);\`.

Requirements:
- Write \`irqreturn_t my_handler(int irq, void *dev_id)\` that schedules \`poll_work\` to run after 200 ms using \`schedule_delayed_work(&poll_work, msecs_to_jiffies(200))\`, then returns \`IRQ_HANDLED\`.
- Write a stub \`void poll_fn(struct work_struct *work)\` that increments \`static unsigned long polls;\`.`,
    hints: [
      'DECLARE_DELAYED_WORK wraps a work_struct with a timer.',
      'msecs_to_jiffies(ms) converts milliseconds to the jiffies the delay API expects.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/jiffies.h>

static unsigned long polls;

void poll_fn(struct work_struct *work)
{
    polls++;
}

static DECLARE_DELAYED_WORK(poll_work, poll_fn);

irqreturn_t my_handler(int irq, void *dev_id)
{
    schedule_delayed_work(&poll_work, msecs_to_jiffies(200));
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/jiffies.h>

static unsigned long polls;

void poll_fn(struct work_struct *work)
{
    // TODO: bump polls
}

static DECLARE_DELAYED_WORK(poll_work, poll_fn);

irqreturn_t my_handler(int irq, void *dev_id)
{
    // TODO: schedule_delayed_work(&poll_work, msecs_to_jiffies(200))
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'workqueue', 'delayed-work'],
  },
  {
    id: 'lx-ch11-c-056',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Disable And Enable A Specific IRQ Line',
    prompt: `Sometimes you must quiesce a device's interrupt around a reconfiguration. Write \`void mydev_reconfigure(int irq, struct mydev *dev)\`.

Context: \`void mydev_apply_config(struct mydev *dev)\` reprograms hardware and must not race the handler.

Requirements:
- Call \`disable_irq(irq)\` which masks the line AND waits for any running handler on this IRQ to finish.
- Call \`mydev_apply_config(dev)\`.
- Re-enable with \`enable_irq(irq)\`.
- Note: \`disable_irq()\` can sleep, so this must run in process context.`,
    hints: [
      'disable_irq() is synchronous: it returns only after any in-flight handler completes.',
      'Use disable_irq_nosync() if you must not wait, but here the synchronous form is correct.',
    ],
    solution: `#include <linux/interrupt.h>

struct mydev { int dummy; };
void mydev_apply_config(struct mydev *dev);

void mydev_reconfigure(int irq, struct mydev *dev)
{
    disable_irq(irq);
    mydev_apply_config(dev);
    enable_irq(irq);
}`,
    starter: `#include <linux/interrupt.h>

struct mydev { int dummy; };
void mydev_apply_config(struct mydev *dev);

void mydev_reconfigure(int irq, struct mydev *dev)
{
    // TODO: disable_irq, apply config, enable_irq
}`,
    tags: ['kernel', 'interrupts', 'disable_irq'],
  },
  {
    id: 'lx-ch11-c-057',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Wake A Waiter From A Bottom Half',
    prompt: `An interrupt signals that data is ready; a reader is blocked in a wait queue. Write the tasklet that publishes the data and wakes the reader.

Context: globals \`static DECLARE_WAIT_QUEUE_HEAD(rq);\`, \`static int data_ready;\`, \`static spinlock_t lock;\` (initialized). Helper: \`u32 hw_read(void)\`, and \`static u32 latest;\`.

Requirements:
- In \`void my_tasklet_fn(unsigned long data)\`: take \`spin_lock(&lock)\`, set \`latest = hw_read()\` and \`data_ready = 1\`, then \`spin_unlock(&lock)\`.
- After unlocking, call \`wake_up_interruptible(&rq)\` to wake any sleeping reader.`,
    hints: [
      'Set the condition (data_ready) under the lock BEFORE waking, so the waiter sees it.',
      'wake_up_interruptible is safe to call from a tasklet; the woken reader checks data_ready.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/wait.h>
#include <linux/spinlock.h>

static DECLARE_WAIT_QUEUE_HEAD(rq);
static int data_ready;
static spinlock_t lock;
static u32 latest;
u32 hw_read(void);

void my_tasklet_fn(unsigned long data)
{
    spin_lock(&lock);
    latest = hw_read();
    data_ready = 1;
    spin_unlock(&lock);

    wake_up_interruptible(&rq);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/wait.h>
#include <linux/spinlock.h>

static DECLARE_WAIT_QUEUE_HEAD(rq);
static int data_ready;
static spinlock_t lock;
static u32 latest;
u32 hw_read(void);

void my_tasklet_fn(unsigned long data)
{
    // TODO: under lock set latest + data_ready; then wake_up_interruptible(&rq)
}`,
    tags: ['kernel', 'tasklet', 'waitqueue'],
  },
  {
    id: 'lx-ch11-c-058',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Raise A Tasklet Hi For Higher Priority',
    prompt: `Two bottom halves exist: a latency-sensitive one and a normal one. Schedule the urgent one with high priority.

Context: \`DECLARE_TASKLET(urgent_tl, urgent_fn, 0)\` and \`DECLARE_TASKLET(normal_tl, normal_fn, 0)\`.

Requirements:
- Write \`irqreturn_t my_handler(int irq, void *dev_id)\` that schedules \`urgent_tl\` with \`tasklet_hi_schedule(&urgent_tl)\` (runs in the high-priority HI_SOFTIRQ) and \`normal_tl\` with the ordinary \`tasklet_schedule(&normal_tl)\`.
- Return \`IRQ_HANDLED\`.`,
    hints: [
      'tasklet_hi_schedule runs the tasklet on HI_SOFTIRQ, ahead of normal tasklets.',
      'Both are still atomic-context bottom halves — neither may sleep.',
    ],
    solution: `#include <linux/interrupt.h>

void urgent_fn(unsigned long data);
void normal_fn(unsigned long data);
DECLARE_TASKLET(urgent_tl, urgent_fn, 0);
DECLARE_TASKLET(normal_tl, normal_fn, 0);

irqreturn_t my_handler(int irq, void *dev_id)
{
    tasklet_hi_schedule(&urgent_tl);
    tasklet_schedule(&normal_tl);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>

void urgent_fn(unsigned long data);
void normal_fn(unsigned long data);
DECLARE_TASKLET(urgent_tl, urgent_fn, 0);
DECLARE_TASKLET(normal_tl, normal_fn, 0);

irqreturn_t my_handler(int irq, void *dev_id)
{
    // TODO: tasklet_hi_schedule(&urgent_tl), tasklet_schedule(&normal_tl)
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'tasklet', 'softirq'],
  },
  {
    id: 'lx-ch11-c-059',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Full Probe: Request IRQ With Cleanup',
    prompt: `Write \`int mydev_probe(struct mydev *dev)\` that initializes a per-device work item and requests a shared IRQ, unwinding on failure.

Context: \`struct mydev { struct work_struct work; int irq; };\`. Helpers: \`void my_work_fn(struct work_struct *);\`, \`irqreturn_t my_handler(int, void *);\`.

Requirements:
- \`INIT_WORK(&dev->work, my_work_fn)\`.
- \`request_irq(dev->irq, my_handler, IRQF_SHARED, "mydev", dev)\`; on failure return the errno (nothing acquired needs undoing for INIT_WORK).
- Return 0 on success.`,
    hints: [
      'INIT_WORK has no matching teardown that must run on this error path, so a plain return is fine.',
      'request_irq returns 0 on success or a negative errno you should propagate.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

struct mydev { struct work_struct work; int irq; };
void my_work_fn(struct work_struct *work);
irqreturn_t my_handler(int irq, void *dev_id);

int mydev_probe(struct mydev *dev)
{
    int ret;

    INIT_WORK(&dev->work, my_work_fn);

    ret = request_irq(dev->irq, my_handler, IRQF_SHARED, "mydev", dev);
    if (ret)
        return ret;

    return 0;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>

struct mydev { struct work_struct work; int irq; };
void my_work_fn(struct work_struct *work);
irqreturn_t my_handler(int irq, void *dev_id);

int mydev_probe(struct mydev *dev)
{
    int ret;
    // TODO: INIT_WORK, request_irq(IRQF_SHARED), propagate errno
    return 0;
}`,
    tags: ['kernel', 'interrupts', 'probe'],
  },
  {
    id: 'lx-ch11-c-060',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Top Half Plus Sleepable Bottom Half Via Workqueue',
    prompt: `Combine a hard IRQ top half with a workqueue bottom half. The top half latches a register and must not lose interrupts between firings.

Context: \`struct mydev { struct work_struct work; spinlock_t lock; u32 status; int irq; };\`. Helpers: \`u32 hw_read_status(struct mydev *)\`, \`void hw_ack(struct mydev *)\`, \`void hw_process(u32)\` (may sleep).

Requirements:
- \`irqreturn_t my_handler(int irq, void *dev_id)\`: recover dev; under \`spin_lock(&dev->lock)\` OR-in the new status (\`dev->status |= hw_read_status(dev)\`), then \`hw_ack(dev)\`, then unlock; \`schedule_work(&dev->work)\`; return \`IRQ_HANDLED\`.
- \`void my_work_fn(struct work_struct *work)\`: \`container_of\` to dev; under \`spin_lock_irq(&dev->lock)\` read-and-clear \`u32 s = dev->status; dev->status = 0;\` then unlock; call \`hw_process(s)\` OUTSIDE the lock (it may sleep).`,
    hints: [
      'OR new bits into status so a second interrupt before the work runs is not lost.',
      'The work function must drop the spinlock before calling the sleepable hw_process; use spin_lock_irq there since work runs with IRQs enabled.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/spinlock.h>
#include <linux/kernel.h>

struct mydev { struct work_struct work; spinlock_t lock; u32 status; int irq; };
u32 hw_read_status(struct mydev *dev);
void hw_ack(struct mydev *dev);
void hw_process(u32 s);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    spin_lock(&dev->lock);
    dev->status |= hw_read_status(dev);
    hw_ack(dev);
    spin_unlock(&dev->lock);

    schedule_work(&dev->work);
    return IRQ_HANDLED;
}

void my_work_fn(struct work_struct *work)
{
    struct mydev *dev = container_of(work, struct mydev, work);
    u32 s;

    spin_lock_irq(&dev->lock);
    s = dev->status;
    dev->status = 0;
    spin_unlock_irq(&dev->lock);

    hw_process(s);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/spinlock.h>
#include <linux/kernel.h>

struct mydev { struct work_struct work; spinlock_t lock; u32 status; int irq; };
u32 hw_read_status(struct mydev *dev);
void hw_ack(struct mydev *dev);
void hw_process(u32 s);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: under lock OR-in status + ack; schedule_work; IRQ_HANDLED
    return IRQ_HANDLED;
}

void my_work_fn(struct work_struct *work)
{
    // TODO: container_of; read-and-clear status under lock; hw_process outside lock
}`,
    tags: ['kernel', 'workqueue', 'top-half'],
  },
  {
    id: 'lx-ch11-c-061',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Threaded IRQ With A Quick Primary Handler',
    prompt: `Use a primary (hard) handler to check ownership and ack, and a thread for the heavy work. Write both halves and the registration.

Context: \`struct mydev { int irq; };\`. Helpers: \`bool hw_is_ours(struct mydev *)\`, \`void hw_ack(struct mydev *)\`, \`void hw_heavy(struct mydev *)\` (may sleep).

Requirements:
- \`irqreturn_t my_primary(int irq, void *dev_id)\`: if \`!hw_is_ours(dev)\` return \`IRQ_NONE\`; else \`hw_ack(dev)\` and return \`IRQ_WAKE_THREAD\` to run the thread function.
- \`irqreturn_t my_thread(int irq, void *dev_id)\`: call \`hw_heavy(dev)\`, return \`IRQ_HANDLED\`.
- \`int mydev_request(struct mydev *dev)\`: \`request_threaded_irq(dev->irq, my_primary, my_thread, IRQF_SHARED, "mydev", dev)\`; return its result.`,
    hints: [
      'The primary handler returns IRQ_WAKE_THREAD to schedule the thread_fn; return IRQ_HANDLED if no thread is needed.',
      'With a real primary handler you do not need IRQF_ONESHOT (that is only for a NULL primary).',
    ],
    solution: `#include <linux/interrupt.h>

struct mydev { int irq; };
bool hw_is_ours(struct mydev *dev);
void hw_ack(struct mydev *dev);
void hw_heavy(struct mydev *dev);

irqreturn_t my_primary(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    if (!hw_is_ours(dev))
        return IRQ_NONE;

    hw_ack(dev);
    return IRQ_WAKE_THREAD;
}

irqreturn_t my_thread(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    hw_heavy(dev);
    return IRQ_HANDLED;
}

int mydev_request(struct mydev *dev)
{
    return request_threaded_irq(dev->irq, my_primary, my_thread,
                                IRQF_SHARED, "mydev", dev);
}`,
    starter: `#include <linux/interrupt.h>

struct mydev { int irq; };
bool hw_is_ours(struct mydev *dev);
void hw_ack(struct mydev *dev);
void hw_heavy(struct mydev *dev);

irqreturn_t my_primary(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: IRQ_NONE if not ours; ack; IRQ_WAKE_THREAD
    return IRQ_NONE;
}

irqreturn_t my_thread(int irq, void *dev_id)
{
    // TODO: hw_heavy, IRQ_HANDLED
    return IRQ_HANDLED;
}

int mydev_request(struct mydev *dev)
{
    // TODO: request_threaded_irq(primary, thread, IRQF_SHARED)
    return 0;
}`,
    tags: ['kernel', 'threaded-irq', 'wake-thread'],
  },
  {
    id: 'lx-ch11-c-062',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Lock-Coordinated Producer/Consumer Across IRQ And Tasklet',
    prompt: `A hard IRQ pushes events into a ring; a tasklet drains them. They share the ring under one spinlock. Write both functions correctly.

Context: \`struct mydev { spinlock_t lock; u32 ring[16]; unsigned head, tail; struct tasklet_struct tl; };\`. Helper: \`u32 hw_event(void)\`, \`void consume(u32 e)\` (does not sleep).

Requirements:
- \`irqreturn_t my_handler(int irq, void *dev_id)\`: under \`spin_lock(&dev->lock)\` write \`dev->ring[dev->head & 15] = hw_event(); dev->head++;\` then unlock; \`tasklet_schedule(&dev->tl)\`; return \`IRQ_HANDLED\`.
- \`void my_tasklet_fn(unsigned long data)\`: cast \`data\` to \`struct mydev *\`; loop while \`tail != head\`, pulling each entry under \`spin_lock_irqsave\` (the IRQ may run on another CPU), then call \`consume(e)\` after unlocking.`,
    hints: [
      'The hard handler uses spin_lock (IRQs already off locally); the tasklet must use spin_lock_irqsave because the handler can fire on another CPU.',
      'Read head/tail and copy the entry under the lock, then release before calling consume.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/spinlock.h>

struct mydev {
    spinlock_t lock;
    u32 ring[16];
    unsigned head, tail;
    struct tasklet_struct tl;
};
u32 hw_event(void);
void consume(u32 e);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    spin_lock(&dev->lock);
    dev->ring[dev->head & 15] = hw_event();
    dev->head++;
    spin_unlock(&dev->lock);

    tasklet_schedule(&dev->tl);
    return IRQ_HANDLED;
}

void my_tasklet_fn(unsigned long data)
{
    struct mydev *dev = (struct mydev *)data;
    unsigned long flags;
    u32 e;

    for (;;) {
        spin_lock_irqsave(&dev->lock, flags);
        if (dev->tail == dev->head) {
            spin_unlock_irqrestore(&dev->lock, flags);
            break;
        }
        e = dev->ring[dev->tail & 15];
        dev->tail++;
        spin_unlock_irqrestore(&dev->lock, flags);

        consume(e);
    }
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/spinlock.h>

struct mydev {
    spinlock_t lock;
    u32 ring[16];
    unsigned head, tail;
    struct tasklet_struct tl;
};
u32 hw_event(void);
void consume(u32 e);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: under spin_lock push event, head++; schedule tasklet; IRQ_HANDLED
    return IRQ_HANDLED;
}

void my_tasklet_fn(unsigned long data)
{
    struct mydev *dev = (struct mydev *)data;
    // TODO: drain ring under spin_lock_irqsave, consume() outside the lock
}`,
    tags: ['kernel', 'spinlock', 'tasklet'],
  },
  {
    id: 'lx-ch11-c-063',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full Init/Exit With Threaded IRQ And Workqueue',
    prompt: `Write \`mydev_init\` and \`mydev_exit\` that create a private workqueue and register a threaded IRQ, with proper goto-based unwinding.

Context globals: \`static struct mydev { int irq; struct work_struct work; } dev;\`, \`static struct workqueue_struct *wq;\`. Helpers: \`void my_work_fn(struct work_struct *)\`, \`irqreturn_t my_thread(int, void *)\`.

Requirements:
- init: \`INIT_WORK(&dev.work, my_work_fn)\`; create \`wq = alloc_ordered_workqueue("mydev_wq", 0)\` (NULL means -ENOMEM); then \`request_threaded_irq(dev.irq, NULL, my_thread, IRQF_ONESHOT, "mydev", &dev)\`. If the IRQ request fails, \`goto err_wq\` to destroy the workqueue and return the errno.
- exit: \`free_irq(dev.irq, &dev)\` first (stops new work being queued), then \`flush_workqueue(wq)\` and \`destroy_workqueue(wq)\`.`,
    hints: [
      'Tear down in reverse order: free_irq before destroying the workqueue so no handler can queue new work afterwards.',
      'alloc_ordered_workqueue returns NULL (not ERR_PTR) on failure.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/errno.h>

static struct mydev { int irq; struct work_struct work; } dev;
static struct workqueue_struct *wq;
void my_work_fn(struct work_struct *work);
irqreturn_t my_thread(int irq, void *dev_id);

int mydev_init(void)
{
    int ret;

    INIT_WORK(&dev.work, my_work_fn);

    wq = alloc_ordered_workqueue("mydev_wq", 0);
    if (!wq)
        return -ENOMEM;

    ret = request_threaded_irq(dev.irq, NULL, my_thread,
                               IRQF_ONESHOT, "mydev", &dev);
    if (ret)
        goto err_wq;

    return 0;

err_wq:
    destroy_workqueue(wq);
    return ret;
}

void mydev_exit(void)
{
    free_irq(dev.irq, &dev);
    flush_workqueue(wq);
    destroy_workqueue(wq);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/errno.h>

static struct mydev { int irq; struct work_struct work; } dev;
static struct workqueue_struct *wq;
void my_work_fn(struct work_struct *work);
irqreturn_t my_thread(int irq, void *dev_id);

int mydev_init(void)
{
    int ret;
    // TODO: INIT_WORK; alloc_ordered_workqueue (-ENOMEM); request_threaded_irq; goto err_wq
    return 0;
}

void mydev_exit(void)
{
    // TODO: free_irq, flush_workqueue, destroy_workqueue
}`,
    tags: ['kernel', 'threaded-irq', 'workqueue'],
  },
  {
    id: 'lx-ch11-c-064',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Re-Arm A Tasklet From Within Itself',
    prompt: `A tasklet processes one unit of work per run and re-schedules itself while more remains, so it never hogs the CPU. Write \`void drain_fn(unsigned long data)\`.

Context: \`struct mydev { struct tasklet_struct tl; };\`. Helpers: \`bool hw_has_more(struct mydev *)\` and \`void hw_step(struct mydev *)\` (neither sleeps).

Requirements:
- Cast \`data\` to \`struct mydev *\`.
- Do exactly one \`hw_step(dev)\`.
- If \`hw_has_more(dev)\` is still true, re-schedule with \`tasklet_schedule(&dev->tl)\` so the rest runs in a later softirq pass.
- Return without looping over all the work in one shot.`,
    hints: [
      'Re-scheduling the same tasklet from inside its own function is allowed and yields the CPU between units.',
      'Doing all the work in one tight loop would block other softirqs for too long.',
    ],
    solution: `#include <linux/interrupt.h>

struct mydev { struct tasklet_struct tl; };
bool hw_has_more(struct mydev *dev);
void hw_step(struct mydev *dev);

void drain_fn(unsigned long data)
{
    struct mydev *dev = (struct mydev *)data;

    hw_step(dev);

    if (hw_has_more(dev))
        tasklet_schedule(&dev->tl);
}`,
    starter: `#include <linux/interrupt.h>

struct mydev { struct tasklet_struct tl; };
bool hw_has_more(struct mydev *dev);
void hw_step(struct mydev *dev);

void drain_fn(unsigned long data)
{
    struct mydev *dev = (struct mydev *)data;
    // TODO: one hw_step; if more remains, tasklet_schedule(&dev->tl)
}`,
    tags: ['kernel', 'tasklet', 'reschedule'],
  },
  {
    id: 'lx-ch11-c-065',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'IRQ Top Half Feeding A Kfifo To A Workqueue',
    prompt: `The top half pushes raw samples into a kfifo; a work item pops them and does sleepable processing. Write both, sharing the fifo under a spinlock.

Context: \`struct mydev { struct kfifo fifo; spinlock_t lock; struct work_struct work; };\` (fifo holds u32, already \`kfifo_alloc\`'d). Helpers: \`u32 hw_sample(void)\`, \`void slow_process(u32)\` (may sleep).

Requirements:
- \`irqreturn_t my_handler(int irq, void *dev_id)\`: under \`spin_lock(&dev->lock)\` push one sample with \`kfifo_put(&dev->fifo, hw_sample())\` (ignore overflow return), unlock; \`schedule_work(&dev->work)\`; return \`IRQ_HANDLED\`.
- \`void my_work_fn(struct work_struct *work)\`: \`container_of\` to dev; loop: under \`spin_lock_irq\` try \`kfifo_get(&dev->fifo, &v)\`; if empty unlock and break; else unlock and \`slow_process(v)\` outside the lock.`,
    hints: [
      'kfifo_put/kfifo_get are not internally serialized for this single-lock pattern, so guard them with the spinlock.',
      'Pop under the lock, then release it before the sleepable slow_process call.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/spinlock.h>
#include <linux/kfifo.h>

struct mydev {
    struct kfifo fifo;
    spinlock_t lock;
    struct work_struct work;
};
u32 hw_sample(void);
void slow_process(u32 v);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    spin_lock(&dev->lock);
    kfifo_put(&dev->fifo, hw_sample());
    spin_unlock(&dev->lock);

    schedule_work(&dev->work);
    return IRQ_HANDLED;
}

void my_work_fn(struct work_struct *work)
{
    struct mydev *dev = container_of(work, struct mydev, work);
    u32 v;

    for (;;) {
        spin_lock_irq(&dev->lock);
        if (!kfifo_get(&dev->fifo, &v)) {
            spin_unlock_irq(&dev->lock);
            break;
        }
        spin_unlock_irq(&dev->lock);

        slow_process(v);
    }
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/spinlock.h>
#include <linux/kfifo.h>

struct mydev {
    struct kfifo fifo;
    spinlock_t lock;
    struct work_struct work;
};
u32 hw_sample(void);
void slow_process(u32 v);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: under lock kfifo_put(hw_sample()); schedule_work; IRQ_HANDLED
    return IRQ_HANDLED;
}

void my_work_fn(struct work_struct *work)
{
    // TODO: container_of; pop under spin_lock_irq; slow_process outside lock
}`,
    tags: ['kernel', 'kfifo', 'workqueue'],
  },
  {
    id: 'lx-ch11-c-066',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Cancel Delayed Work Safely On Teardown',
    prompt: `A device re-arms a delayed work item and must cancel it cleanly during removal so nothing runs after the device is freed. Write the re-arm and the teardown.

Context: \`struct mydev { struct delayed_work dwork; bool stopping; spinlock_t lock; };\`.

Requirements:
- \`void poll_fn(struct work_struct *work)\`: \`container_of(work, struct mydev, dwork.work)\` to get dev; if \`!dev->stopping\`, re-arm with \`schedule_delayed_work(&dev->dwork, msecs_to_jiffies(100))\`.
- \`void mydev_stop(struct mydev *dev)\`: set \`dev->stopping = true\` under \`spin_lock\`/\`spin_unlock\`, then call \`cancel_delayed_work_sync(&dev->dwork)\` (runs in process context; waits for any running instance and prevents re-queue).`,
    hints: [
      'container_of from a delayed_work uses the embedded work_struct member: dwork.work.',
      'Set the stopping flag BEFORE cancel_delayed_work_sync so a concurrent poll_fn does not re-arm after you cancel.',
    ],
    solution: `#include <linux/workqueue.h>
#include <linux/spinlock.h>
#include <linux/jiffies.h>

struct mydev {
    struct delayed_work dwork;
    bool stopping;
    spinlock_t lock;
};

void poll_fn(struct work_struct *work)
{
    struct mydev *dev = container_of(work, struct mydev, dwork.work);

    if (!dev->stopping)
        schedule_delayed_work(&dev->dwork, msecs_to_jiffies(100));
}

void mydev_stop(struct mydev *dev)
{
    spin_lock(&dev->lock);
    dev->stopping = true;
    spin_unlock(&dev->lock);

    cancel_delayed_work_sync(&dev->dwork);
}`,
    starter: `#include <linux/workqueue.h>
#include <linux/spinlock.h>
#include <linux/jiffies.h>

struct mydev {
    struct delayed_work dwork;
    bool stopping;
    spinlock_t lock;
};

void poll_fn(struct work_struct *work)
{
    struct mydev *dev = container_of(work, struct mydev, dwork.work);
    // TODO: if not stopping, re-arm schedule_delayed_work(100ms)
}

void mydev_stop(struct mydev *dev)
{
    // TODO: set stopping under lock, then cancel_delayed_work_sync
}`,
    tags: ['kernel', 'delayed-work', 'cleanup'],
  },
  {
    id: 'lx-ch11-c-067',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'devm-Managed Threaded IRQ In probe',
    prompt: `Use the device-managed API so the IRQ is freed automatically when the device goes away. Write \`int mydev_probe(struct platform_device *pdev)\`.

Context: \`struct mydev\` is allocated and stored; \`int irq\` is already known. Helpers: \`irqreturn_t my_thread(int, void *)\`, and \`struct mydev *dev\` is available with \`dev->base_dev\` being the underlying \`struct device *\` (use \`&pdev->dev\`).

Requirements:
- Call \`devm_request_threaded_irq(&pdev->dev, dev->irq, NULL, my_thread, IRQF_ONESHOT, "mydev", dev)\`.
- Return its result directly: on failure the negative errno propagates and devm unwinds; on success there is NOTHING to free manually because the framework owns it.
- Assume \`struct mydev { int irq; };\` and that \`dev\` was obtained earlier in probe.`,
    hints: [
      'devm_request_threaded_irq ties the IRQ lifetime to the device; no explicit free_irq in remove.',
      'IRQF_ONESHOT is required because the primary handler is NULL.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/platform_device.h>

struct mydev { int irq; };
irqreturn_t my_thread(int irq, void *dev_id);

int mydev_probe(struct platform_device *pdev, struct mydev *dev)
{
    return devm_request_threaded_irq(&pdev->dev, dev->irq, NULL,
                                     my_thread, IRQF_ONESHOT,
                                     "mydev", dev);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/platform_device.h>

struct mydev { int irq; };
irqreturn_t my_thread(int irq, void *dev_id);

int mydev_probe(struct platform_device *pdev, struct mydev *dev)
{
    // TODO: return devm_request_threaded_irq(&pdev->dev, ... IRQF_ONESHOT ...)
    return 0;
}`,
    tags: ['kernel', 'threaded-irq', 'devm'],
  },
  {
    id: 'lx-ch11-c-068',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Coalesce Interrupts With An Atomic Pending Flag',
    prompt: `Many interrupts can fire before the bottom half runs; you only need to run the work once per burst. Use an atomic flag so the handler queues work just once until the work clears it.

Context: \`struct mydev { atomic_t pending; struct work_struct work; };\`. Helper: \`void hw_ack(struct mydev *)\`, \`void process_all(struct mydev *)\` (may sleep).

Requirements:
- \`irqreturn_t my_handler(int irq, void *dev_id)\`: \`hw_ack(dev)\`; if \`atomic_xchg(&dev->pending, 1) == 0\` (it was previously clear), call \`schedule_work(&dev->work)\`; return \`IRQ_HANDLED\`.
- \`void my_work_fn(struct work_struct *work)\`: \`container_of\` to dev; \`atomic_set(&dev->pending, 0)\` BEFORE processing so an interrupt arriving during processing re-queues the work; then \`process_all(dev)\`.`,
    hints: [
      'atomic_xchg returning 0 means we are the one who flipped it, so we own the queueing.',
      'Clear the flag before processing so a late interrupt is not lost — it will re-queue the work.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/atomic.h>

struct mydev { atomic_t pending; struct work_struct work; };
void hw_ack(struct mydev *dev);
void process_all(struct mydev *dev);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    hw_ack(dev);
    if (atomic_xchg(&dev->pending, 1) == 0)
        schedule_work(&dev->work);

    return IRQ_HANDLED;
}

void my_work_fn(struct work_struct *work)
{
    struct mydev *dev = container_of(work, struct mydev, work);

    atomic_set(&dev->pending, 0);
    process_all(dev);
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/workqueue.h>
#include <linux/atomic.h>

struct mydev { atomic_t pending; struct work_struct work; };
void hw_ack(struct mydev *dev);
void process_all(struct mydev *dev);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: ack; if atomic_xchg(&pending,1)==0 schedule_work; IRQ_HANDLED
    return IRQ_HANDLED;
}

void my_work_fn(struct work_struct *work)
{
    // TODO: container_of; clear pending BEFORE process_all
}`,
    tags: ['kernel', 'workqueue', 'atomic'],
  },
  {
    id: 'lx-ch11-c-069',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Blocking Read Backed By An IRQ-Driven Tasklet',
    prompt: `Tie the interrupt path to a character device read. The tasklet publishes a sample and wakes a reader blocked in the file's read handler. Write the tasklet and the read.

Context globals: \`static DECLARE_WAIT_QUEUE_HEAD(rq);\`, \`static spinlock_t lock;\` (init'd), \`static u32 sample; static bool ready;\`. Helper: \`u32 hw_read(void)\`.

Requirements:
- \`void my_tasklet_fn(unsigned long data)\`: under \`spin_lock(&lock)\` set \`sample = hw_read(); ready = true;\`, unlock; then \`wake_up_interruptible(&rq)\`.
- \`ssize_t my_read(struct file *f, char __user *ubuf, size_t n, loff_t *ppos)\`: \`wait_event_interruptible(rq, ready)\` (returns -ERESTARTSYS if a signal arrives — propagate it); then under \`spin_lock\` copy \`sample\` into a local and clear \`ready\`, unlock; \`copy_to_user\` the 4 bytes (return -EFAULT on fault); return 4.`,
    hints: [
      'wait_event_interruptible sleeps until the condition (ready) holds or a signal arrives.',
      'copy_to_user can fault and must NOT be called while holding the spinlock — copy the value out first, unlock, then copy_to_user.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/interrupt.h>
#include <linux/wait.h>
#include <linux/spinlock.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static DECLARE_WAIT_QUEUE_HEAD(rq);
static spinlock_t lock;
static u32 sample;
static bool ready;
u32 hw_read(void);

void my_tasklet_fn(unsigned long data)
{
    spin_lock(&lock);
    sample = hw_read();
    ready = true;
    spin_unlock(&lock);

    wake_up_interruptible(&rq);
}

ssize_t my_read(struct file *f, char __user *ubuf,
                size_t n, loff_t *ppos)
{
    u32 v;

    if (wait_event_interruptible(rq, ready))
        return -ERESTARTSYS;

    spin_lock(&lock);
    v = sample;
    ready = false;
    spin_unlock(&lock);

    if (copy_to_user(ubuf, &v, sizeof(v)))
        return -EFAULT;

    return sizeof(v);
}`,
    starter: `#include <linux/fs.h>
#include <linux/interrupt.h>
#include <linux/wait.h>
#include <linux/spinlock.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static DECLARE_WAIT_QUEUE_HEAD(rq);
static spinlock_t lock;
static u32 sample;
static bool ready;
u32 hw_read(void);

void my_tasklet_fn(unsigned long data)
{
    // TODO: under lock set sample + ready; wake_up_interruptible(&rq)
}

ssize_t my_read(struct file *f, char __user *ubuf,
                size_t n, loff_t *ppos)
{
    u32 v;
    // TODO: wait_event_interruptible(rq, ready); copy out under lock; copy_to_user
    return 0;
}`,
    tags: ['kernel', 'tasklet', 'waitqueue'],
  },
  {
    id: 'lx-ch11-c-070',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Interrupt-Safe Reference Counting Around Free',
    prompt: `An interrupt may fire while the driver is tearing the device down. Use a flag and lock to guarantee the handler never touches freed state, and that teardown drains in-flight handlers.

Context: \`struct mydev { spinlock_t lock; bool alive; int irq; void *buf; };\`. Helper: \`void touch(void *buf)\`.

Requirements:
- \`irqreturn_t my_handler(int irq, void *dev_id)\`: take \`spin_lock(&dev->lock)\`; if \`!dev->alive\` unlock and return \`IRQ_HANDLED\` (nothing to do); else \`touch(dev->buf)\`, unlock, return \`IRQ_HANDLED\`.
- \`void mydev_remove(struct mydev *dev)\`: under \`spin_lock_irqsave\` set \`dev->alive = false\`, unlock; then \`free_irq(dev->irq, dev)\` (which waits for any running handler); then \`kfree(dev->buf); dev->buf = NULL;\`.`,
    hints: [
      'Clear alive under the lock so a handler running concurrently sees it before it dereferences buf.',
      'free_irq() blocks until the in-flight handler returns, so it is safe to free buf only afterward.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/spinlock.h>
#include <linux/slab.h>

struct mydev { spinlock_t lock; bool alive; int irq; void *buf; };
void touch(void *buf);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    spin_lock(&dev->lock);
    if (!dev->alive) {
        spin_unlock(&dev->lock);
        return IRQ_HANDLED;
    }
    touch(dev->buf);
    spin_unlock(&dev->lock);
    return IRQ_HANDLED;
}

void mydev_remove(struct mydev *dev)
{
    unsigned long flags;

    spin_lock_irqsave(&dev->lock, flags);
    dev->alive = false;
    spin_unlock_irqrestore(&dev->lock, flags);

    free_irq(dev->irq, dev);

    kfree(dev->buf);
    dev->buf = NULL;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/spinlock.h>
#include <linux/slab.h>

struct mydev { spinlock_t lock; bool alive; int irq; void *buf; };
void touch(void *buf);

irqreturn_t my_handler(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    // TODO: under lock, bail if !alive; else touch(buf); IRQ_HANDLED
    return IRQ_HANDLED;
}

void mydev_remove(struct mydev *dev)
{
    unsigned long flags;
    // TODO: clear alive under lock; free_irq; kfree(buf)
}`,
    tags: ['kernel', 'interrupts', 'teardown'],
  },
]

export default problems
