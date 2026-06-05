import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-11',
  track: 'linux',
  chapter: 11,
  title: 'Interrupts & Deferred Work',
  summary: `Hardware interrupts are how devices tell the CPU that something happened without the kernel having to constantly poll them, but handling an interrupt steals the CPU away from whatever was running, so the code that runs in response must be fast, non-blocking, and extremely careful. This chapter explains how a driver registers an interrupt handler with request_irq, what the special rules of interrupt context are and why they exist, and the central design pattern of splitting work into a tiny urgent top half and a deferrable bottom half. It then surveys the kernel's deferral mechanisms in order of increasing flexibility and cost: softirqs, tasklets, workqueues, and threaded IRQs. For an aspiring kernel contributor this is foundational, because almost every device driver lives or dies by how correctly it handles interrupts and where it chooses to do the heavy lifting.`,
  sections: [
    {
      heading: 'What an interrupt is and why we want them',
      body: `An **interrupt** is an electrical signal a hardware device asserts on an interrupt request line to get the processor's attention. When the signal arrives, the CPU stops executing the current instruction stream, saves just enough state, and jumps to a predetermined location to run an **interrupt handler** (also called an interrupt service routine). When the handler returns, the CPU restores the saved state and resumes whatever it interrupted, which usually has no idea anything happened.

### Interrupts versus polling

The alternative to interrupts is **polling**: the kernel repeatedly asks each device whether it needs servicing. Polling wastes CPU cycles checking devices that have nothing to report, and it adds latency because a device might wait until the next poll before it is noticed. Interrupts invert this: the device speaks only when it has news, so the CPU can do useful work or sleep until then. This is why interrupts are the dominant model for almost all devices, from network cards to keyboards to disk controllers.

### Asynchrony is the whole point and the whole problem

The defining property of an interrupt is that it is **asynchronous**: it can fire at almost any moment, between any two instructions, regardless of what the kernel was doing. That asynchrony is exactly what makes interrupts efficient, and it is also the source of nearly every hard rule in this chapter. Because a handler can preempt arbitrary code, including code that holds locks or sits in a delicate state, the handler must be disciplined about what it touches and how long it runs.

### IRQ numbers

Each interrupt is associated with an **interrupt request number**, usually shortened to **IRQ**. On modern systems these are abstract numbers managed by the kernel's IRQ subsystem rather than raw hardware pin numbers; the firmware, device tree, or a bus such as PCI tells the kernel which IRQ a device uses. The driver does not invent the IRQ number; it discovers it from the platform and then asks the kernel to route that IRQ to its handler.`,
    },
    {
      heading: 'Registering a handler with request_irq',
      body: `A driver tells the kernel I want to handle IRQ N by calling **request_irq**. This connects an IRQ number to a handler function and gives the kernel everything it needs to dispatch the interrupt to your code. The mirror call **free_irq** unregisters the handler and must be called before the driver goes away, or the kernel will keep calling a handler that no longer exists.

### The parameters and what they mean

- The **irq** is the interrupt number you obtained from the platform, PCI, device tree, or similar.
- The **handler** is your function, run in interrupt context when the IRQ fires.
- The **flags** tune behavior. The most important one is **IRQF_SHARED**, which says you are willing to share this line with other devices. There is also IRQF_ONESHOT, important for threaded IRQs, discussed later.
- The **name** is a string shown in /proc/interrupts so humans can see who owns the line.
- The **dev** cookie is an opaque pointer the kernel hands back to your handler on every call. For a shared interrupt it must be unique and non-null, because free_irq uses it to identify which handler to remove, and the core uses it to pass your per-device state.

### Return value of the handler

Your handler must return an **irqreturn_t**. Return **IRQ_HANDLED** if your device actually was the source and you serviced it, or **IRQ_NONE** if it was not your device, which is essential on shared lines so the kernel can ask the next handler. Returning IRQ_HANDLED when it was not really yours can mask a spurious-interrupt problem; returning IRQ_NONE when it was yours can make the kernel think the line is stuck and disable it.

### Shared interrupts

When several devices sit on one physical IRQ line, every registered handler runs on each interrupt, and each must inspect its own device's status registers to decide whether it has work. This is why a shared handler reads a hardware status register first and bails out with IRQ_NONE if nothing is pending. All handlers on a shared line must agree to share by passing IRQF_SHARED, or the request fails.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/interrupt.h>

/* Per-device state; the address is used as the unique cookie. */
struct mydev {
    int irq;
    void __iomem *regs;
    /* ... */
};

/* Runs in interrupt context when the IRQ fires. */
static irqreturn_t mydev_isr(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;     /* the cookie comes back to us */
    u32 status = ioread32(dev->regs + STATUS_REG);

    if (!(status & STATUS_IRQ_PENDING))
        return IRQ_NONE;            /* not our device (shared line) */

    /* Acknowledge the device so it stops asserting the line. */
    iowrite32(status, dev->regs + STATUS_REG);

    /* ...do the minimal urgent work here... */

    return IRQ_HANDLED;             /* yes, it was ours and we handled it */
}

static int mydev_probe(struct mydev *dev)
{
    int ret;

    ret = request_irq(dev->irq, mydev_isr,
                      IRQF_SHARED,        /* willing to share the line */
                      "mydev",            /* shown in /proc/interrupts */
                      dev);               /* unique cookie, must be non-NULL */
    if (ret)
        return ret;                 /* registration failed */

    return 0;
}

static void mydev_remove(struct mydev *dev)
{
    free_irq(dev->irq, dev);        /* MUST match the cookie passed above */
}`,
        },
      ],
    },
    {
      heading: 'Interrupt context and its iron rules',
      body: `Code running inside a hardware interrupt handler executes in **interrupt context**, which is fundamentally different from the **process context** that ordinary kernel code (such as a system call) runs in. The distinction drives a short list of rules that you must never break.

### Rule one: you must not sleep

Interrupt context is **not associated with any process**, so there is no task to put to sleep and later wake. There is no current process whose execution can be meaningfully suspended. Therefore you **cannot call anything that might block or sleep**: no waiting on a mutex or a semaphore that could block, no kmalloc with GFP_KERNEL (which may sleep to reclaim memory; use GFP_ATOMIC instead), no copy_to_user or copy_from_user (they can page-fault and sleep), and no schedule. Violating this can deadlock the machine or corrupt state, and the kernel will often loudly warn about sleeping in atomic context.

### Rule two: be fast

While your handler runs, it has preempted whatever was on that CPU, and on the same line further interrupts may be masked. A slow handler increases interrupt latency for everything else, can cause dropped data on time-sensitive devices, and degrades the responsiveness of the whole system. The handler should do the bare minimum and get out.

### Rule three: mind your locks

If you share data between a handler and process-context code, the process-context side must disable the relevant interrupt while holding the lock, using primitives such as **spin_lock_irqsave**, otherwise the handler could fire on the same CPU while the lock is held and spin forever waiting for a lock that the very same CPU already owns. You also cannot use sleeping locks in a handler at all, because of rule one. Spinlocks are the tool here, never mutexes.

### Why a small dedicated stack matters

Interrupt handlers historically ran on a small, limited interrupt stack, so deep recursion or large stack-allocated buffers are dangerous. The practical takeaway reinforces the others: keep handlers shallow and small.`,
      code: [
        {
          lang: 'c',
          src: `/* Sharing data between an ISR and process context safely. */
static DEFINE_SPINLOCK(dev_lock);
static u32 shared_event_count;

/* Interrupt context: plain spin_lock is fine here because we are
 * already in hardirq context with this line masked. */
static irqreturn_t mydev_isr(int irq, void *dev_id)
{
    spin_lock(&dev_lock);
    shared_event_count++;
    spin_unlock(&dev_lock);
    return IRQ_HANDLED;
}

/* Process context: must disable IRQs while holding the lock, or the
 * handler could fire on this CPU and deadlock on the held lock. */
static u32 read_count(void)
{
    unsigned long flags;
    u32 v;

    spin_lock_irqsave(&dev_lock, flags);   /* save + disable local IRQs */
    v = shared_event_count;
    spin_unlock_irqrestore(&dev_lock, flags);
    return v;
}

/* DO NOT do any of these inside an interrupt handler:
 *   p = kmalloc(n, GFP_KERNEL);   // may sleep -> use GFP_ATOMIC
 *   mutex_lock(&m);               // sleeping lock -> forbidden
 *   copy_to_user(...);            // may page-fault and sleep
 *   msleep(10); schedule();       // explicitly sleeps
 */`,
        },
      ],
    },
    {
      heading: 'Top half and bottom half: the core pattern',
      body: `The rules above create tension: a device may need substantial processing on each event (parse a packet, refill a buffer, wake waiters), yet the handler must be fast and may not sleep. The kernel resolves this with a two-part design.

### Top half

The **top half** is the actual interrupt handler that request_irq registers. It runs immediately in interrupt context with timing constraints, so it does only what is **time-critical**: acknowledge the device so it stops asserting the line, read out any data that would be lost if not collected now (for example draining a hardware FIFO), record what needs doing, and then **schedule the bottom half**. That is it.

### Bottom half

The **bottom half** is the deferred portion. It performs the bulk of the work later, when conditions are more favorable, with interrupts enabled and (depending on the mechanism) possibly in a context where sleeping is allowed. The name reflects the historical division of labor; the modern kernel offers several concrete bottom-half mechanisms rather than one.

### Why defer at all

Deferring serves three goals at once:
1. It keeps the top half short, minimizing interrupt latency and the window during which interrupts may be masked.
2. It moves work into a context with fewer restrictions, where you may be able to sleep, allocate freely, or take mutexes.
3. It lets the kernel schedule that work sensibly relative to everything else, rather than forcing it to run at the instant the hardware happened to interrupt.

### How to decide what goes where

Ask of each piece of work: does it have to happen right now, before the handler returns, or will data be lost otherwise? If yes, top half. Everything else, especially anything that might block, anything lengthy, and anything that merely needs to happen eventually, belongs in the bottom half. When in doubt, push it down.`,
      code: [
        {
          lang: 'c',
          src: `/* The classic split using a workqueue as the bottom half. */
struct mydev {
    int irq;
    void __iomem *regs;
    struct work_struct bh_work;    /* the bottom half */
    u32 latched_status;
};

/* Bottom half: runs later in process context, may sleep. */
static void mydev_bottom_half(struct work_struct *w)
{
    struct mydev *dev = container_of(w, struct mydev, bh_work);

    /* Heavy lifting: parse data, take mutexes, allocate, wake waiters. */
    mydev_process(dev, dev->latched_status);
}

/* Top half: minimal, fast, no sleeping. */
static irqreturn_t mydev_isr(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    u32 status = ioread32(dev->regs + STATUS_REG);

    if (!(status & STATUS_IRQ_PENDING))
        return IRQ_NONE;

    iowrite32(status, dev->regs + STATUS_REG);  /* ack now */
    dev->latched_status = status;               /* hand off the data */
    schedule_work(&dev->bh_work);               /* defer the rest */

    return IRQ_HANDLED;
}`,
        },
      ],
    },
    {
      heading: 'Softirqs and tasklets: the atomic bottom halves',
      body: `The first family of bottom-half mechanisms still runs in **atomic (interrupt-ish) context**, meaning they cannot sleep, but they run with hardware interrupts enabled and outside the strict timing window of the top half.

### Softirqs

**Softirqs** are a small, fixed set of statically defined deferred routines, registered at compile time, such as those that drive networking transmit and receive, block I/O completion, and timers. There is a hard, enumerated list, and you do not normally add new ones: softirqs are a core-kernel facility reserved for performance-critical subsystems. The defining feature is that **the same softirq can run concurrently on multiple CPUs at once**, so softirq code must be fully reentrant and use per-CPU data or locking to protect shared state. This concurrency is what makes them fast and scalable, and also what makes them hard to write correctly, which is why ordinary drivers should not reach for them.

### Tasklets

**Tasklets** are built on top of softirqs but are far easier to use, and they are the right level for most drivers that need an atomic bottom half. A tasklet is a deferred function you can create dynamically. Its key guarantee is serialization: **a given tasklet never runs on more than one CPU at the same time**, and it never runs concurrently with itself, which removes the reentrancy headache that raw softirqs impose. Two different tasklets can still run on different CPUs simultaneously, so shared data between distinct tasklets still needs protection.

You schedule a tasklet from the top half; it runs soon afterward in softirq context. Because that context is still atomic, a tasklet **must not sleep**: same restrictions as the top half regarding allocation, sleeping locks, and copying to user space.

A practical note for contributors: tasklets are considered a legacy, somewhat deprecated API in current kernel development, and new code is generally steered toward threaded IRQs or workqueues. You will still encounter tasklets widely in existing drivers, so you must understand them, but think twice before adding new ones.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/interrupt.h>

struct mydev {
    int irq;
    void __iomem *regs;
    struct tasklet_struct tlet;    /* atomic bottom half */
    u32 latched_status;
};

/* Tasklet body: runs in softirq context, serialized against itself.
 * Still ATOMIC: no sleeping, no mutexes, GFP_ATOMIC only. */
static void mydev_tasklet(struct tasklet_struct *t)
{
    struct mydev *dev = from_tasklet(dev, t, tlet);
    mydev_process_atomic(dev, dev->latched_status);
}

static int mydev_setup(struct mydev *dev)
{
    /* Bind the tasklet to its function (modern API). */
    tasklet_setup(&dev->tlet, mydev_tasklet);
    return 0;
}

static irqreturn_t mydev_isr(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    u32 status = ioread32(dev->regs + STATUS_REG);

    if (!(status & STATUS_IRQ_PENDING))
        return IRQ_NONE;

    iowrite32(status, dev->regs + STATUS_REG);
    dev->latched_status = status;
    tasklet_schedule(&dev->tlet);   /* run the tasklet soon, in softirq ctx */
    return IRQ_HANDLED;
}

static void mydev_teardown(struct mydev *dev)
{
    tasklet_kill(&dev->tlet);       /* wait for any pending run, then disable */
}`,
        },
      ],
    },
    {
      heading: 'Workqueues: the bottom half that can sleep',
      body: `When the deferred work needs to **sleep**, block on a mutex, allocate memory that may wait, copy to user space, or otherwise do things forbidden in atomic context, the bottom half must run in **process context**. That is exactly what a **workqueue** provides.

### How they work

A workqueue runs your deferred function on a **kernel thread** (a worker). Because it is a real thread in process context, the function is allowed to sleep and to use the full range of kernel facilities. You wrap your function in a **work_struct**, initialize it with INIT_WORK, and submit it with schedule_work (which uses the shared system workqueue) or queue_work (onto a workqueue you created). When a worker thread picks it up, your function runs.

### The trade-off

The flexibility costs latency: a workqueue item runs whenever the scheduler gets around to running a worker thread, which is later and less predictable than a tasklet. So workqueues are the right choice precisely when you need to sleep or do heavy work and can tolerate that scheduling latency, and the wrong choice for the lowest-latency paths.

### Choosing a workqueue

Most drivers can simply use the shared system workqueue via schedule_work. If your work can run for a long time, can sleep at length, or must not be starved by unrelated work, create your own workqueue with alloc_workqueue, which also lets you control concurrency and CPU affinity. There are variants such as delayed work, which fires after a timer delay, useful for retries and timeouts.

### Lifetime and cancellation

Before you free anything a work item touches, or unload the module, you must ensure no work is still pending or running. Use cancel_work_sync or flush the workqueue so that in-flight work has completed. Forgetting this is a classic use-after-free: the worker thread runs your function after its data structure has been freed.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/workqueue.h>

struct mydev {
    int irq;
    void __iomem *regs;
    struct work_struct work;       /* runs in process context, may sleep */
    u32 latched_status;
};

/* Process context: sleeping, mutexes, GFP_KERNEL all allowed here. */
static void mydev_work_fn(struct work_struct *w)
{
    struct mydev *dev = container_of(w, struct mydev, work);
    void *buf;

    buf = kmalloc(4096, GFP_KERNEL);     /* may sleep: fine in this context */
    if (!buf)
        return;

    mutex_lock(&dev->big_lock);           /* sleeping lock: allowed here */
    mydev_heavy_processing(dev, buf, dev->latched_status);
    mutex_unlock(&dev->big_lock);

    kfree(buf);
}

static int mydev_setup(struct mydev *dev)
{
    INIT_WORK(&dev->work, mydev_work_fn);
    return 0;
}

static irqreturn_t mydev_isr(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    dev->latched_status = ioread32(dev->regs + STATUS_REG);
    iowrite32(dev->latched_status, dev->regs + STATUS_REG);
    schedule_work(&dev->work);            /* defer to a worker thread */
    return IRQ_HANDLED;
}

static void mydev_teardown(struct mydev *dev)
{
    cancel_work_sync(&dev->work);         /* avoid use-after-free on unload */
}`,
        },
      ],
    },
    {
      heading: 'Threaded IRQs: the modern default',
      body: `**Threaded interrupts** fold the top-half and bottom-half split into a single, clean abstraction provided by the IRQ core, and they are the recommended approach for most new drivers. Instead of manually scheduling a tasklet or work item, you register two functions with **request_threaded_irq**, and the kernel runs them for you in the right contexts.

### The two functions

- The **hard handler** (the first function) runs in interrupt context, exactly like a classic top half. Its job is to check whether the interrupt is for this device, do anything genuinely time-critical, and then tell the core whether to run the threaded part. It returns **IRQ_WAKE_THREAD** to request that the threaded handler run, or IRQ_HANDLED / IRQ_NONE to finish without it.
- The **threaded handler** (the second function) runs in **process context** on a dedicated kernel thread that the IRQ core creates and manages for this interrupt. Because it is a real thread, it **may sleep**, take mutexes, and do heavy work, just like a workqueue, but it is tied to and named after the interrupt, and the line is handled cleanly with respect to masking.

### Why this is the modern default

Threaded IRQs give you the sleep-capable, process-context bottom half of a workqueue while keeping the dispatch logic owned by the IRQ subsystem, which improves real-time behavior and makes the code simpler and less error-prone than hand-rolling a tasklet or work item. If you pass NULL as the hard handler, the core supplies a default that simply wakes the thread, which is perfect for many devices where almost all the work can sleep.

### IRQF_ONESHOT and level-triggered lines

A crucial flag is **IRQF_ONESHOT**, which keeps the interrupt **masked from the moment the hard handler returns until the threaded handler finishes**. This is required for level-triggered interrupts where the device keeps the line asserted until serviced; without ONESHOT the line would immediately re-fire in a storm because the device is still asserting it while the thread has not yet cleared the condition. When you register a threaded IRQ with a NULL hard handler, IRQF_ONESHOT is required.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/interrupt.h>

struct mydev {
    int irq;
    void __iomem *regs;
    u32 latched_status;
    struct mutex big_lock;
};

/* Hard handler: interrupt context. Fast, no sleeping. */
static irqreturn_t mydev_hardirq(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;
    u32 status = ioread32(dev->regs + STATUS_REG);

    if (!(status & STATUS_IRQ_PENDING))
        return IRQ_NONE;            /* not ours (shared) */

    dev->latched_status = status;   /* capture; defer the work */
    return IRQ_WAKE_THREAD;         /* ask the core to run the thread */
}

/* Threaded handler: process context, MAY sleep. */
static irqreturn_t mydev_threadfn(int irq, void *dev_id)
{
    struct mydev *dev = dev_id;

    mutex_lock(&dev->big_lock);     /* sleeping lock: allowed here */
    mydev_heavy_processing(dev, dev->latched_status);
    mutex_unlock(&dev->big_lock);

    return IRQ_HANDLED;
}

static int mydev_probe(struct mydev *dev)
{
    /* IRQF_ONESHOT keeps the line masked until the thread finishes,
     * which is required for level-triggered devices. */
    return request_threaded_irq(dev->irq,
                                mydev_hardirq,    /* may be NULL */
                                mydev_threadfn,
                                IRQF_ONESHOT | IRQF_SHARED,
                                "mydev", dev);
}`,
        },
      ],
    },
    {
      heading: 'Choosing a mechanism and avoiding pitfalls',
      body: `With several deferral tools available, the contributor's skill is picking the right one and respecting the rules of each. Here is a decision guide and the mistakes that bite people.

### A short decision guide

1. Does the work need to sleep, block, allocate freely, or touch user space? If yes, you need process context: prefer a **threaded IRQ**, or a **workqueue** if the work is logically separate from the interrupt or shared across sources.
2. Is the work short, must stay atomic, and lowest-latency matters? Use a **tasklet** (in existing code) but be aware new code trends toward threaded IRQs.
3. Are you a core subsystem with extreme performance needs and CPU-scalable reentrancy? Only then a **softirq**, and almost never as an out-of-tree or new driver.
4. Can almost everything be deferred to a sleepable context? Use a threaded IRQ with a NULL hard handler and IRQF_ONESHOT.

### Common pitfalls

- **Sleeping in atomic context.** Calling a blocking function from a top half, tasklet, or softirq is the most common and most dangerous error. The kernel may print a scheduling while atomic warning, or simply lock up.
- **Wrong locking discipline.** Forgetting spin_lock_irqsave on the process-context side when sharing data with a handler causes a self-deadlock if the handler fires on the same CPU. Never use a mutex in a handler or atomic bottom half.
- **Returning the wrong irqreturn_t on shared lines.** Returning IRQ_HANDLED when the interrupt was not yours breaks shared-IRQ accounting; returning IRQ_NONE when it was yours can get the line disabled as spurious.
- **Missing IRQF_ONESHOT on level-triggered threaded IRQs.** This produces an interrupt storm because the device keeps the line asserted until the thread services it.
- **Use-after-free on teardown.** Failing to cancel_work_sync or tasklet_kill, or to free_irq, before freeing data or unloading lets a deferred function or handler run against freed memory.
- **Doing too much in the top half.** Even without sleeping, a long top half raises interrupt latency for the whole system. When in doubt, defer.`,
      code: [
        {
          lang: 'c',
          src: `/* Quick mental model of where each mechanism runs and what it can do:
 *
 *   Mechanism        Context           Can sleep?   Typical use
 *   --------------   ---------------   ----------   --------------------------
 *   top half (ISR)   hardirq            NO          ack device, latch data
 *   softirq          softirq (atomic)   NO          core net/block/timer only
 *   tasklet          softirq (atomic)   NO          short atomic BH (legacy)
 *   workqueue        process (thread)   YES         heavy/sleeping deferred work
 *   threaded IRQ     process (thread)   YES         modern default BH
 *
 * Golden rules:
 *   - In ANY atomic context: no sleep, no mutex, GFP_ATOMIC, spinlocks only.
 *   - Sharing data with an ISR from process context => spin_lock_irqsave.
 *   - Always tear down: free_irq + cancel_work_sync / tasklet_kill.
 *   - Level-triggered threaded IRQ => IRQF_ONESHOT.
 */`,
        },
      ],
    },
  ],
  takeaways: [
    'Interrupts let devices signal the CPU asynchronously instead of being polled, but a handler can preempt arbitrary code, which is the source of every rule in this chapter.',
    'request_irq binds an IRQ number to a handler; pass a unique non-NULL cookie, use IRQF_SHARED on shared lines, and always free_irq on teardown.',
    'A handler returns IRQ_HANDLED if it serviced its device or IRQ_NONE if the interrupt was not its; getting this wrong breaks shared-line handling.',
    'Interrupt context cannot sleep: no blocking, no mutexes, no GFP_KERNEL, no copy_to_user; use spinlocks and GFP_ATOMIC, and keep the handler fast.',
    'Split work into a tiny top half (urgent, in interrupt context) and a deferrable bottom half (the bulk of the work, run later under fewer constraints).',
    'Softirqs are core-kernel, can run concurrently on many CPUs, and demand full reentrancy; ordinary drivers should not add new ones.',
    'Tasklets are serialized against themselves and easy to use but still atomic (no sleeping) and are a legacy API steered away from in new code.',
    'Workqueues and threaded IRQs run in process context on kernel threads, so they may sleep, allocate, and take mutexes, at the cost of scheduling latency.',
    'Threaded IRQs are the modern default: a fast hard handler returns IRQ_WAKE_THREAD, and the sleep-capable threaded handler does the rest; use IRQF_ONESHOT for level-triggered lines.',
  ],
  cheatsheet: [
    { label: 'request_irq(irq, fn, flags, name, dev)', value: 'Register a top-half handler for an IRQ line' },
    { label: 'request_threaded_irq(...)', value: 'Register a hard handler plus a sleep-capable threaded handler' },
    { label: 'free_irq(irq, dev)', value: 'Unregister a handler; dev must match the registration cookie' },
    { label: 'IRQ_HANDLED / IRQ_NONE', value: 'Handler return: serviced our device / not our device' },
    { label: 'IRQ_WAKE_THREAD', value: 'Hard handler asks the core to run the threaded handler' },
    { label: 'IRQF_SHARED', value: 'Allow this IRQ line to be shared by multiple devices' },
    { label: 'IRQF_ONESHOT', value: 'Keep line masked until the threaded handler finishes' },
    { label: 'spin_lock_irqsave / irqrestore', value: 'Lock + disable local IRQs to share data with a handler' },
    { label: 'GFP_ATOMIC', value: 'Non-sleeping allocation flag for atomic/interrupt context' },
    { label: 'tasklet_setup / tasklet_schedule', value: 'Init and schedule an atomic bottom half (softirq context)' },
    { label: 'tasklet_kill', value: 'Wait for and disable a tasklet before teardown' },
    { label: 'INIT_WORK / schedule_work', value: 'Init and queue a sleep-capable bottom half (process context)' },
    { label: 'cancel_work_sync', value: 'Cancel/await a work item to avoid use-after-free on unload' },
    { label: '/proc/interrupts', value: 'Shows IRQ numbers, per-CPU counts, and registered handler names' },
  ],
}

export default note
