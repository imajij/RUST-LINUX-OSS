import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch10-c-036',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Atomic Counter Increment and Read',
    prompt: `Define a global atomic_t named hit_count initialized to 0. Write two functions:
- void bump_hits(void): atomically increment the counter.
- int read_hits(void): return the current value.
Use atomic_t operations only; do not use a plain int with a lock.`,
    hints: [
      'ATOMIC_INIT(0) initialises an atomic_t at definition time.',
      'atomic_inc() and atomic_read() are lock-free for a single counter.',
    ],
    solution: `#include <linux/atomic.h>

static atomic_t hit_count = ATOMIC_INIT(0);

void bump_hits(void)
{
    atomic_inc(&hit_count);
}

int read_hits(void)
{
    return atomic_read(&hit_count);
}`,
    starter: `#include <linux/atomic.h>

static atomic_t hit_count = /* TODO: init to 0 */;

void bump_hits(void)
{
    // TODO: atomic increment
}

int read_hits(void)
{
    // TODO: return current value
    return 0;
}`,
    tags: ['kernel', 'locking', 'atomic'],
  },
  {
    id: 'lx-ch10-c-037',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Atomic Decrement-and-Test for Refcount',
    prompt: `You have a static atomic_t refcount initialized to 1. Write int put_ref(void) that atomically decrements refcount and, if the new value reached zero, prints "last reference dropped\\n" with pr_info and returns 1. Otherwise return 0. Use the single atomic primitive designed for exactly this check.`,
    hints: [
      'atomic_dec_and_test() decrements and returns true only if the result is 0.',
      'Doing atomic_dec() then atomic_read() separately is racy; use the combined op.',
    ],
    solution: `#include <linux/atomic.h>
#include <linux/printk.h>

static atomic_t refcount = ATOMIC_INIT(1);

int put_ref(void)
{
    if (atomic_dec_and_test(&refcount)) {
        pr_info("last reference dropped\\n");
        return 1;
    }
    return 0;
}`,
    starter: `#include <linux/atomic.h>
#include <linux/printk.h>

static atomic_t refcount = ATOMIC_INIT(1);

int put_ref(void)
{
    // TODO: atomically decrement and test for zero
    return 0;
}`,
    tags: ['kernel', 'atomic', 'refcount'],
  },
  {
    id: 'lx-ch10-c-038',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Spinlock Around a Short Critical Section',
    prompt: `A driver keeps a shared list length in a plain int named n_items, updated from process context only. Define a spinlock_t named lock (initialized statically) and write void add_item(void) and void remove_item(void) that increment / decrement n_items while holding the spinlock. Keep the critical section minimal.`,
    hints: [
      'DEFINE_SPINLOCK(name) declares and initialises a spinlock at file scope.',
      'spin_lock()/spin_unlock() are fine when no interrupt touches the data.',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(lock);
static int n_items;

void add_item(void)
{
    spin_lock(&lock);
    n_items++;
    spin_unlock(&lock);
}

void remove_item(void)
{
    spin_lock(&lock);
    n_items--;
    spin_unlock(&lock);
}`,
    starter: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(lock);
static int n_items;

void add_item(void)
{
    // TODO: lock, increment, unlock
}

void remove_item(void)
{
    // TODO: lock, decrement, unlock
}`,
    tags: ['kernel', 'locking', 'spinlock'],
  },
  {
    id: 'lx-ch10-c-039',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mutex Protecting a Sleepable Section',
    prompt: `Write a function int update_config(const char __user *buf, size_t len) that copies up to 64 bytes from user space into a static char config[64] under a mutex. Define a static struct mutex cfg_lock (statically initialized). Because copy_from_user may sleep, you must use a mutex, not a spinlock. Return 0 on success, -EFAULT if the copy faults, -EINVAL if len > 64.`,
    hints: [
      'DEFINE_MUTEX(name) declares and initialises a mutex.',
      'copy_from_user() can fault and sleep, so it must run under a sleeping lock.',
      'mutex_lock() then mutex_unlock(); unlock on every return path.',
    ],
    solution: `#include <linux/mutex.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static DEFINE_MUTEX(cfg_lock);
static char config[64];

int update_config(const char __user *buf, size_t len)
{
    int ret = 0;

    if (len > sizeof(config))
        return -EINVAL;

    mutex_lock(&cfg_lock);
    if (copy_from_user(config, buf, len))
        ret = -EFAULT;
    mutex_unlock(&cfg_lock);

    return ret;
}`,
    starter: `#include <linux/mutex.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static DEFINE_MUTEX(cfg_lock);
static char config[64];

int update_config(const char __user *buf, size_t len)
{
    // TODO: validate len, lock mutex, copy_from_user, unlock
    return 0;
}`,
    tags: ['kernel', 'locking', 'mutex'],
  },
  {
    id: 'lx-ch10-c-040',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'spin_lock_irqsave in Shared Data Touched by an ISR',
    prompt: `A counter events is updated both from an interrupt handler and from process context. Define a spinlock_t lock. Write void process_path(void) that increments events from process context using spin_lock_irqsave / spin_unlock_irqrestore (saving flags in an unsigned long), and irqreturn_t my_isr(int irq, void *dev) that increments events from the handler using plain spin_lock / spin_unlock and returns IRQ_HANDLED.`,
    hints: [
      'Process context must disable local IRQs while holding the lock the ISR also takes.',
      'Inside the ISR, interrupts are already off, so plain spin_lock is correct.',
      'spin_lock_irqsave(&lock, flags) ... spin_unlock_irqrestore(&lock, flags).',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/interrupt.h>

static DEFINE_SPINLOCK(lock);
static unsigned long events;

void process_path(void)
{
    unsigned long flags;

    spin_lock_irqsave(&lock, flags);
    events++;
    spin_unlock_irqrestore(&lock, flags);
}

irqreturn_t my_isr(int irq, void *dev)
{
    spin_lock(&lock);
    events++;
    spin_unlock(&lock);
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/interrupt.h>

static DEFINE_SPINLOCK(lock);
static unsigned long events;

void process_path(void)
{
    unsigned long flags;
    // TODO: irqsave lock, increment, irqrestore
}

irqreturn_t my_isr(int irq, void *dev)
{
    // TODO: plain spin_lock, increment, unlock
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'spinlock', 'interrupt'],
  },
  {
    id: 'lx-ch10-c-041',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fix a Sleep Inside a Spinlock',
    prompt: `The function below is buggy: it calls kmalloc(GFP_KERNEL) while holding a spinlock, which can sleep in atomic context. Rewrite save_record() so it does not sleep while holding the lock. The shared list head records and the spinlock list_lock are given. Allocate the node before taking the lock; only the list_add must be inside the critical section.`,
    hints: [
      'GFP_KERNEL may sleep; you may not sleep holding a spinlock.',
      'Do the allocation first, then take the lock only for the list manipulation.',
      'If allocation fails, return -ENOMEM before locking.',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/slab.h>
#include <linux/list.h>
#include <linux/errno.h>

struct record { struct list_head node; int val; };

static LIST_HEAD(records);
static DEFINE_SPINLOCK(list_lock);

int save_record(int val)
{
    struct record *r = kmalloc(sizeof(*r), GFP_KERNEL);

    if (!r)
        return -ENOMEM;

    r->val = val;

    spin_lock(&list_lock);
    list_add(&r->node, &records);
    spin_unlock(&list_lock);

    return 0;
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/slab.h>
#include <linux/list.h>
#include <linux/errno.h>

struct record { struct list_head node; int val; };

static LIST_HEAD(records);
static DEFINE_SPINLOCK(list_lock);

/* BUGGY ORIGINAL:
int save_record(int val)
{
    struct record *r;
    spin_lock(&list_lock);
    r = kmalloc(sizeof(*r), GFP_KERNEL);   // sleeps while holding spinlock!
    r->val = val;
    list_add(&r->node, &records);
    spin_unlock(&list_lock);
    return 0;
}
*/

int save_record(int val)
{
    // TODO: allocate before locking; lock only around list_add
    return 0;
}`,
    tags: ['kernel', 'spinlock', 'atomic-context'],
  },
  {
    id: 'lx-ch10-c-042',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'GFP_ATOMIC Allocation in Interrupt Context',
    prompt: `Write irqreturn_t buffer_isr(int irq, void *dev) that allocates a 256-byte buffer to stash data captured in the interrupt handler. Because you are in interrupt (atomic) context, you must not use GFP_KERNEL. Use the correct GFP flag, handle allocation failure by returning IRQ_HANDLED, store the pointer in a passed-in struct cap *c (field buf), and return IRQ_HANDLED.`,
    hints: [
      'GFP_KERNEL may sleep and is forbidden in interrupt context.',
      'GFP_ATOMIC does not sleep but may fail under memory pressure.',
      'Always check the return value of kmalloc.',
    ],
    solution: `#include <linux/interrupt.h>
#include <linux/slab.h>

struct cap { char *buf; };

irqreturn_t buffer_isr(int irq, void *dev)
{
    struct cap *c = dev;

    c->buf = kmalloc(256, GFP_ATOMIC);
    if (!c->buf)
        return IRQ_HANDLED;

    /* ... fill c->buf from device ... */
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/interrupt.h>
#include <linux/slab.h>

struct cap { char *buf; };

irqreturn_t buffer_isr(int irq, void *dev)
{
    struct cap *c = dev;
    // TODO: allocate 256 bytes with the GFP flag legal in IRQ context
    return IRQ_HANDLED;
}`,
    tags: ['kernel', 'interrupt', 'gfp'],
  },
  {
    id: 'lx-ch10-c-043',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Embed a Spinlock in a Device Struct',
    prompt: `Define a struct my_dev that contains an int counter and its own spinlock_t lock. Write void dev_init(struct my_dev *d) that initializes the lock at runtime with spin_lock_init and sets counter to 0, and void dev_tick(struct my_dev *d) that increments counter under the device's own lock. Per-object locks like this avoid a single global bottleneck.`,
    hints: [
      'spin_lock_init() initialises a lock embedded in a dynamically allocated struct.',
      'Each device instance gets its own lock, so two devices never contend.',
    ],
    solution: `#include <linux/spinlock.h>

struct my_dev {
    int counter;
    spinlock_t lock;
};

void dev_init(struct my_dev *d)
{
    spin_lock_init(&d->lock);
    d->counter = 0;
}

void dev_tick(struct my_dev *d)
{
    spin_lock(&d->lock);
    d->counter++;
    spin_unlock(&d->lock);
}`,
    starter: `#include <linux/spinlock.h>

struct my_dev {
    int counter;
    // TODO: add a spinlock field
};

void dev_init(struct my_dev *d)
{
    // TODO: init the lock at runtime, zero the counter
}

void dev_tick(struct my_dev *d)
{
    // TODO: increment counter under the device lock
}`,
    tags: ['kernel', 'spinlock', 'driver'],
  },
  {
    id: 'lx-ch10-c-044',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'rwlock for Read-Mostly Data',
    prompt: `A configuration value cfg_val is read frequently and written rarely. Define a rwlock_t cfg_rwlock. Write int read_cfg(void) that returns cfg_val under a read lock, and void write_cfg(int v) that updates cfg_val under a write lock. Many readers may run concurrently; writers are exclusive.`,
    hints: [
      'DEFINE_RWLOCK(name) declares an rwlock.',
      'read_lock()/read_unlock() allow concurrent readers; write_lock()/write_unlock() are exclusive.',
    ],
    solution: `#include <linux/rwlock.h>

static DEFINE_RWLOCK(cfg_rwlock);
static int cfg_val;

int read_cfg(void)
{
    int v;

    read_lock(&cfg_rwlock);
    v = cfg_val;
    read_unlock(&cfg_rwlock);
    return v;
}

void write_cfg(int v)
{
    write_lock(&cfg_rwlock);
    cfg_val = v;
    write_unlock(&cfg_rwlock);
}`,
    starter: `#include <linux/rwlock.h>

static DEFINE_RWLOCK(cfg_rwlock);
static int cfg_val;

int read_cfg(void)
{
    // TODO: read under read lock
    return 0;
}

void write_cfg(int v)
{
    // TODO: write under write lock
}`,
    tags: ['kernel', 'locking', 'rwlock'],
  },
  {
    id: 'lx-ch10-c-045',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'mutex_lock_interruptible in a Syscall Path',
    prompt: `In a file operation you must take a mutex but want the wait to be killable by a signal. Write ssize_t my_read(struct file *f, char __user *u, size_t n, loff_t *off) that acquires a static struct mutex io_lock with mutex_lock_interruptible, returns -ERESTARTSYS if interrupted, does nothing in the critical section (just a placeholder comment) and returns 0, always unlocking on the success path.`,
    hints: [
      'mutex_lock_interruptible() returns 0 on success or -EINTR/-ERESTARTSYS if a signal arrived.',
      'On a nonzero return you must NOT call mutex_unlock.',
      'Return -ERESTARTSYS so the syscall is restarted or reports EINTR.',
    ],
    solution: `#include <linux/mutex.h>
#include <linux/fs.h>
#include <linux/errno.h>

static DEFINE_MUTEX(io_lock);

ssize_t my_read(struct file *f, char __user *u, size_t n, loff_t *off)
{
    if (mutex_lock_interruptible(&io_lock))
        return -ERESTARTSYS;

    /* critical section */

    mutex_unlock(&io_lock);
    return 0;
}`,
    starter: `#include <linux/mutex.h>
#include <linux/fs.h>
#include <linux/errno.h>

static DEFINE_MUTEX(io_lock);

ssize_t my_read(struct file *f, char __user *u, size_t n, loff_t *off)
{
    // TODO: interruptible lock; bail with -ERESTARTSYS if interrupted
    // TODO: unlock on success
    return 0;
}`,
    tags: ['kernel', 'mutex', 'interruptible'],
  },
  {
    id: 'lx-ch10-c-046',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Counting Semaphore to Bound Concurrency',
    prompt: `You want at most 3 concurrent users in a region. Declare a struct semaphore slots initialized with DEFINE_SEMAPHORE-style count of 3 (use sema_init in an init function). Write int enter_region(void) that acquires the semaphore with down_interruptible (returning -ERESTARTSYS on interruption, 0 on success) and void leave_region(void) that releases it with up.`,
    hints: [
      'sema_init(&sem, count) sets the initial count for a counting semaphore.',
      'down_interruptible() returns nonzero if interrupted by a signal.',
      'Each up() returns one slot.',
    ],
    solution: `#include <linux/semaphore.h>
#include <linux/errno.h>

static struct semaphore slots;

void region_init(void)
{
    sema_init(&slots, 3);
}

int enter_region(void)
{
    if (down_interruptible(&slots))
        return -ERESTARTSYS;
    return 0;
}

void leave_region(void)
{
    up(&slots);
}`,
    starter: `#include <linux/semaphore.h>
#include <linux/errno.h>

static struct semaphore slots;

void region_init(void)
{
    // TODO: init semaphore with count 3
}

int enter_region(void)
{
    // TODO: down_interruptible; -ERESTARTSYS on interrupt
    return 0;
}

void leave_region(void)
{
    // TODO: up()
}`,
    tags: ['kernel', 'semaphore', 'concurrency'],
  },
  {
    id: 'lx-ch10-c-047',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'seqlock for a Rarely-Written Timestamp',
    prompt: `A 64-bit timestamp last_ts is written occasionally and read often; readers want a consistent snapshot without blocking writers. Define a seqlock_t ts_lock. Write void set_ts(u64 v) that updates last_ts under write_seqlock/write_sequnlock, and u64 get_ts(void) that reads it using a read_seqbegin / read_seqretry retry loop.`,
    hints: [
      'DEFINE_SEQLOCK(name) declares a seqlock.',
      'Readers loop: seq = read_seqbegin(); read; while (read_seqretry(lock, seq)).',
      'Writers use write_seqlock/write_sequnlock and are mutually exclusive.',
    ],
    solution: `#include <linux/seqlock.h>
#include <linux/types.h>

static DEFINE_SEQLOCK(ts_lock);
static u64 last_ts;

void set_ts(u64 v)
{
    write_seqlock(&ts_lock);
    last_ts = v;
    write_sequnlock(&ts_lock);
}

u64 get_ts(void)
{
    unsigned int seq;
    u64 v;

    do {
        seq = read_seqbegin(&ts_lock);
        v = last_ts;
    } while (read_seqretry(&ts_lock, seq));

    return v;
}`,
    starter: `#include <linux/seqlock.h>
#include <linux/types.h>

static DEFINE_SEQLOCK(ts_lock);
static u64 last_ts;

void set_ts(u64 v)
{
    // TODO: write_seqlock ... write_sequnlock
}

u64 get_ts(void)
{
    // TODO: read_seqbegin / read_seqretry loop
    return 0;
}`,
    tags: ['kernel', 'locking', 'seqlock'],
  },
  {
    id: 'lx-ch10-c-048',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Static Per-CPU Counter',
    prompt: `Declare a static per-CPU unsigned long counter named pkt_count using DEFINE_PER_CPU. Write void count_packet(void) that increments the current CPU's counter while preemption is disabled, and unsigned long total_packets(void) that sums the value across all online CPUs. Use get_cpu_var/put_cpu_var (or this_cpu_inc) for the increment and per_cpu() for the sum.`,
    hints: [
      'DEFINE_PER_CPU(type, name) creates one instance per CPU.',
      'this_cpu_inc(var) increments the local CPU copy safely.',
      'for_each_online_cpu(cpu) and per_cpu(var, cpu) read each CPU copy.',
    ],
    solution: `#include <linux/percpu.h>
#include <linux/cpumask.h>

static DEFINE_PER_CPU(unsigned long, pkt_count);

void count_packet(void)
{
    this_cpu_inc(pkt_count);
}

unsigned long total_packets(void)
{
    unsigned long sum = 0;
    int cpu;

    for_each_online_cpu(cpu)
        sum += per_cpu(pkt_count, cpu);

    return sum;
}`,
    starter: `#include <linux/percpu.h>
#include <linux/cpumask.h>

static DEFINE_PER_CPU(unsigned long, pkt_count);

void count_packet(void)
{
    // TODO: increment this CPU's copy
}

unsigned long total_packets(void)
{
    // TODO: sum across all online CPUs
    return 0;
}`,
    tags: ['kernel', 'per-cpu', 'counters'],
  },
  {
    id: 'lx-ch10-c-049',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'RCU Read-Side Critical Section',
    prompt: `A pointer to a config object is published via RCU. Given struct config { int level; } and a static struct config __rcu *cur_cfg, write int get_level(void) that reads cur_cfg->level inside an RCU read-side critical section. Use rcu_read_lock/rcu_read_unlock and rcu_dereference to load the pointer; if it is NULL return -1.`,
    hints: [
      'rcu_read_lock()/rcu_read_unlock() mark the read-side section.',
      'rcu_dereference() must be used to load an RCU-protected pointer.',
      'You may read the dereferenced data only inside the read-side section.',
    ],
    solution: `#include <linux/rcupdate.h>

struct config { int level; };

static struct config __rcu *cur_cfg;

int get_level(void)
{
    struct config *c;
    int level;

    rcu_read_lock();
    c = rcu_dereference(cur_cfg);
    level = c ? c->level : -1;
    rcu_read_unlock();

    return level;
}`,
    starter: `#include <linux/rcupdate.h>

struct config { int level; };

static struct config __rcu *cur_cfg;

int get_level(void)
{
    // TODO: rcu_read_lock, rcu_dereference, read level, rcu_read_unlock
    return -1;
}`,
    tags: ['kernel', 'rcu', 'read-side'],
  },
  {
    id: 'lx-ch10-c-050',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'try_lock Without Blocking',
    prompt: `Write int try_update(int v) that attempts to acquire a static spinlock_t lock without spinning. If spin_trylock succeeds, set a static int shared = v, unlock, and return 0. If the lock is already held, return -EBUSY without blocking.`,
    hints: [
      'spin_trylock() returns nonzero (true) if it grabbed the lock, 0 otherwise.',
      'Only unlock if you actually acquired the lock.',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(lock);
static int shared;

int try_update(int v)
{
    if (!spin_trylock(&lock))
        return -EBUSY;

    shared = v;
    spin_unlock(&lock);
    return 0;
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(lock);
static int shared;

int try_update(int v)
{
    // TODO: spin_trylock; -EBUSY if held, else update and unlock
    return 0;
}`,
    tags: ['kernel', 'spinlock', 'trylock'],
  },
  {
    id: 'lx-ch10-c-051',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'atomic_t Bounded Add Returning New Value',
    prompt: `Write int try_reserve(int amount, int cap) that atomically adds amount to a static atomic_t used (starting at 0), but only if the result would not exceed cap. Use atomic_add_return; if the new value exceeds cap, undo with atomic_sub and return -ENOSPC, otherwise return 0.`,
    hints: [
      'atomic_add_return() adds and returns the new value in one atomic step.',
      'If you overshoot, atomic_sub() the same amount to roll back.',
      'A pure read-then-add would race; the return-value form avoids one race but you still roll back on overshoot.',
    ],
    solution: `#include <linux/atomic.h>
#include <linux/errno.h>

static atomic_t used = ATOMIC_INIT(0);

int try_reserve(int amount, int cap)
{
    int now = atomic_add_return(amount, &used);

    if (now > cap) {
        atomic_sub(amount, &used);
        return -ENOSPC;
    }
    return 0;
}`,
    starter: `#include <linux/atomic.h>
#include <linux/errno.h>

static atomic_t used = ATOMIC_INIT(0);

int try_reserve(int amount, int cap)
{
    // TODO: atomic_add_return; roll back and return -ENOSPC if over cap
    return 0;
}`,
    tags: ['kernel', 'atomic', 'accounting'],
  },
  {
    id: 'lx-ch10-c-052',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Atomic Bit Operations',
    prompt: `Use atomic bit operations on a static unsigned long flags (initialized to 0). Write void set_ready(void) to set bit 0 atomically, void clear_ready(void) to clear bit 0 atomically, and int is_ready(void) to test bit 0. Use set_bit, clear_bit, and test_bit.`,
    hints: [
      'set_bit(nr, addr) / clear_bit(nr, addr) are atomic.',
      'test_bit(nr, addr) reads a single bit.',
      'These operate on an unsigned long bitmap word.',
    ],
    solution: `#include <linux/bitops.h>

static unsigned long flags;

#define READY_BIT 0

void set_ready(void)
{
    set_bit(READY_BIT, &flags);
}

void clear_ready(void)
{
    clear_bit(READY_BIT, &flags);
}

int is_ready(void)
{
    return test_bit(READY_BIT, &flags);
}`,
    starter: `#include <linux/bitops.h>

static unsigned long flags;

#define READY_BIT 0

void set_ready(void)
{
    // TODO: atomic set_bit
}

void clear_ready(void)
{
    // TODO: atomic clear_bit
}

int is_ready(void)
{
    // TODO: test_bit
    return 0;
}`,
    tags: ['kernel', 'atomic', 'bitops'],
  },
  {
    id: 'lx-ch10-c-053',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'test_and_set_bit as a Lightweight Lock',
    prompt: `Implement a one-shot guard so that an init routine runs only once. Using a static unsigned long state, write int run_once(void) that uses test_and_set_bit on bit 0: if the bit was already set, return -EALREADY; otherwise print "running init\\n" with pr_info and return 0. test_and_set_bit must be atomic so two callers never both run.`,
    hints: [
      'test_and_set_bit() atomically sets a bit and returns its previous value.',
      'If the old value was 1, someone else already claimed it.',
    ],
    solution: `#include <linux/bitops.h>
#include <linux/printk.h>
#include <linux/errno.h>

static unsigned long state;

int run_once(void)
{
    if (test_and_set_bit(0, &state))
        return -EALREADY;

    pr_info("running init\\n");
    return 0;
}`,
    starter: `#include <linux/bitops.h>
#include <linux/printk.h>
#include <linux/errno.h>

static unsigned long state;

int run_once(void)
{
    // TODO: test_and_set_bit(0, &state); -EALREADY if already set
    return 0;
}`,
    tags: ['kernel', 'atomic', 'bitops'],
  },
  {
    id: 'lx-ch10-c-054',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'spin_lock_bh Against Softirq Context',
    prompt: `Shared data tx_bytes is updated from process context and from a softirq/tasklet. To protect it without disabling all hardware interrupts, use bottom-half-safe locking. Define a spinlock_t lock and write void add_tx(unsigned long n) for process context using spin_lock_bh / spin_unlock_bh, and void tasklet_tx(unsigned long n) for the tasklet using plain spin_lock / spin_unlock.`,
    hints: [
      'spin_lock_bh() disables softirqs (bottom halves) while held.',
      'Inside a tasklet (already in BH context) plain spin_lock is enough.',
      'Use _bh when the contending context is a softirq, not a hardirq.',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(lock);
static unsigned long tx_bytes;

void add_tx(unsigned long n)
{
    spin_lock_bh(&lock);
    tx_bytes += n;
    spin_unlock_bh(&lock);
}

void tasklet_tx(unsigned long n)
{
    spin_lock(&lock);
    tx_bytes += n;
    spin_unlock(&lock);
}`,
    starter: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(lock);
static unsigned long tx_bytes;

void add_tx(unsigned long n)
{
    // TODO: bottom-half-safe lock around the update
}

void tasklet_tx(unsigned long n)
{
    // TODO: plain spin_lock (already in BH context)
}`,
    tags: ['kernel', 'spinlock', 'softirq'],
  },
  {
    id: 'lx-ch10-c-055',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Initialize a Mutex at Runtime',
    prompt: `You allocate a control block dynamically and must initialize its embedded mutex at runtime (DEFINE_MUTEX only works for static instances). Given struct ctl { struct mutex lock; int state; }, write struct ctl *ctl_alloc(void) that kzallocs a struct ctl (GFP_KERNEL), initializes the mutex with mutex_init, and returns the pointer (or NULL on failure).`,
    hints: [
      'mutex_init() initialises a mutex embedded in a runtime-allocated struct.',
      'kzalloc zeroes memory; still call mutex_init explicitly.',
      'Return NULL if the allocation fails.',
    ],
    solution: `#include <linux/mutex.h>
#include <linux/slab.h>

struct ctl {
    struct mutex lock;
    int state;
};

struct ctl *ctl_alloc(void)
{
    struct ctl *c = kzalloc(sizeof(*c), GFP_KERNEL);

    if (!c)
        return NULL;

    mutex_init(&c->lock);
    return c;
}`,
    starter: `#include <linux/mutex.h>
#include <linux/slab.h>

struct ctl {
    struct mutex lock;
    int state;
};

struct ctl *ctl_alloc(void)
{
    // TODO: kzalloc, mutex_init, return pointer or NULL
    return NULL;
}`,
    tags: ['kernel', 'mutex', 'init'],
  },
  {
    id: 'lx-ch10-c-056',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'spin_lock_irqsave Combined With copy_to_user (Done Right)',
    prompt: `You must read a shared int snapshot under a spinlock that an ISR also takes, then copy it to user space. copy_to_user can fault and must NOT run under the spinlock. Write ssize_t read_snap(char __user *u, size_t n). Take the lock with spin_lock_irqsave, copy snapshot into a local int, release the lock, then copy_to_user the local. Return sizeof(int) on success, -EFAULT on fault, -EINVAL if n < sizeof(int).`,
    hints: [
      'copy_to_user may sleep/fault; never hold a spinlock across it.',
      'Snapshot the value into a local while holding the lock, then unlock and copy.',
      'Validate the user buffer length first.',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(lock);
static int snapshot;

ssize_t read_snap(char __user *u, size_t n)
{
    unsigned long flags;
    int local;

    if (n < sizeof(int))
        return -EINVAL;

    spin_lock_irqsave(&lock, flags);
    local = snapshot;
    spin_unlock_irqrestore(&lock, flags);

    if (copy_to_user(u, &local, sizeof(local)))
        return -EFAULT;

    return sizeof(int);
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(lock);
static int snapshot;

ssize_t read_snap(char __user *u, size_t n)
{
    // TODO: validate n; snapshot under irqsave lock; unlock; copy_to_user
    return 0;
}`,
    tags: ['kernel', 'spinlock', 'uaccess'],
  },
  {
    id: 'lx-ch10-c-057',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'in_atomic Guard for a Sleeping Path',
    prompt: `Write a helper int maybe_sleep_alloc(void) that allocates 128 bytes. If it is safe to sleep (not in atomic/interrupt context), use GFP_KERNEL; otherwise use GFP_ATOMIC. Decide using in_atomic() / irqs_disabled(). Store the result in a static char *buf and return 0 on success, -ENOMEM on failure.`,
    hints: [
      'in_atomic() is true in interrupt/softirq context or when preemption is disabled.',
      'Choose GFP_ATOMIC when you cannot sleep, GFP_KERNEL when you can.',
      'irqs_disabled() also signals you must not sleep.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/preempt.h>
#include <linux/irqflags.h>
#include <linux/errno.h>

static char *buf;

int maybe_sleep_alloc(void)
{
    gfp_t gfp = GFP_KERNEL;

    if (in_atomic() || irqs_disabled())
        gfp = GFP_ATOMIC;

    buf = kmalloc(128, gfp);
    if (!buf)
        return -ENOMEM;

    return 0;
}`,
    starter: `#include <linux/slab.h>
#include <linux/preempt.h>
#include <linux/irqflags.h>
#include <linux/errno.h>

static char *buf;

int maybe_sleep_alloc(void)
{
    // TODO: pick GFP_ATOMIC if in atomic context else GFP_KERNEL; alloc 128 bytes
    return 0;
}`,
    tags: ['kernel', 'atomic-context', 'gfp'],
  },
  {
    id: 'lx-ch10-c-058',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'spin_is_locked Assertion Helper',
    prompt: `Write a function void update_locked(int v) that updates a static int shared = v but first asserts (with lockdep_assert_held) that a static spinlock_t lock is held by the caller, documenting the locking contract. The caller is responsible for holding the lock; this function must not take it itself.`,
    hints: [
      'lockdep_assert_held(&lock) flags a bug if the lock is not held by the current path.',
      'A "caller must hold the lock" contract is common for internal helpers.',
      'Do not acquire the lock inside the helper.',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/lockdep.h>

static DEFINE_SPINLOCK(lock);
static int shared;

/* Caller must hold &lock. */
void update_locked(int v)
{
    lockdep_assert_held(&lock);
    shared = v;
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/lockdep.h>

static DEFINE_SPINLOCK(lock);
static int shared;

/* Caller must hold &lock. */
void update_locked(int v)
{
    // TODO: assert the lock is held, then update shared
}`,
    tags: ['kernel', 'lockdep', 'spinlock'],
  },
  {
    id: 'lx-ch10-c-059',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Per-CPU Variable With get_cpu_var',
    prompt: `Declare DEFINE_PER_CPU(struct stats, dev_stats) where struct stats { unsigned long n; }. Write void record(void) that increments the current CPU's n field. Use get_cpu_var / put_cpu_var so preemption is disabled while you hold the pointer, preventing migration mid-update.`,
    hints: [
      'get_cpu_var(var) disables preemption and returns an lvalue for this CPU.',
      'put_cpu_var(var) re-enables preemption; always pair them.',
      'Without disabling preemption you could be migrated and update the wrong CPU copy.',
    ],
    solution: `#include <linux/percpu.h>

struct stats { unsigned long n; };

static DEFINE_PER_CPU(struct stats, dev_stats);

void record(void)
{
    struct stats *s = &get_cpu_var(dev_stats);

    s->n++;
    put_cpu_var(dev_stats);
}`,
    starter: `#include <linux/percpu.h>

struct stats { unsigned long n; };

static DEFINE_PER_CPU(struct stats, dev_stats);

void record(void)
{
    // TODO: get_cpu_var, increment n, put_cpu_var
}`,
    tags: ['kernel', 'per-cpu', 'preemption'],
  },
  {
    id: 'lx-ch10-c-060',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Detect and Document a Lock Ordering Rule',
    prompt: `Two locks lock_a and lock_b protect related data and code paths sometimes need both. To avoid deadlock you must always acquire them in a fixed order (a before b). Write void move_value(void) that takes lock_a then lock_b, moves x into y (static ints), then releases in reverse order (b then a). Add a comment stating the ordering rule.`,
    hints: [
      'AB-BA deadlock happens if two paths take the locks in opposite orders.',
      'Pick a global order and always acquire in that order; release in reverse.',
    ],
    solution: `#include <linux/spinlock.h>

/* Lock ordering: always take lock_a before lock_b. */
static DEFINE_SPINLOCK(lock_a);
static DEFINE_SPINLOCK(lock_b);
static int x, y;

void move_value(void)
{
    spin_lock(&lock_a);
    spin_lock(&lock_b);

    y = x;
    x = 0;

    spin_unlock(&lock_b);
    spin_unlock(&lock_a);
}`,
    starter: `#include <linux/spinlock.h>

/* Lock ordering: always take lock_a before lock_b. */
static DEFINE_SPINLOCK(lock_a);
static DEFINE_SPINLOCK(lock_b);
static int x, y;

void move_value(void)
{
    // TODO: lock a, lock b, move x->y, unlock b, unlock a
}`,
    tags: ['kernel', 'deadlock', 'lock-order'],
  },
  {
    id: 'lx-ch10-c-061',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'RCU Publish-Update-Reclaim',
    prompt: `Complete the writer side of an RCU-protected pointer. Given struct config { int level; }, static struct config __rcu *cur, and a static DEFINE_MUTEX(update_lock), write int set_config(int level). Allocate a new config (GFP_KERNEL, -ENOMEM on failure), take update_lock, capture the old pointer (rcu_dereference_protected), publish the new one with rcu_assign_pointer, drop the mutex, then synchronize_rcu and kfree the old. Return 0.`,
    hints: [
      'rcu_assign_pointer() publishes the new pointer with the right barrier.',
      'rcu_dereference_protected() reads the pointer when you hold the update lock.',
      'synchronize_rcu() waits for pre-existing readers before you free the old object.',
    ],
    solution: `#include <linux/rcupdate.h>
#include <linux/mutex.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct config { int level; };

static struct config __rcu *cur;
static DEFINE_MUTEX(update_lock);

int set_config(int level)
{
    struct config *new_cfg, *old;

    new_cfg = kmalloc(sizeof(*new_cfg), GFP_KERNEL);
    if (!new_cfg)
        return -ENOMEM;
    new_cfg->level = level;

    mutex_lock(&update_lock);
    old = rcu_dereference_protected(cur, lockdep_is_held(&update_lock));
    rcu_assign_pointer(cur, new_cfg);
    mutex_unlock(&update_lock);

    synchronize_rcu();
    kfree(old);
    return 0;
}`,
    starter: `#include <linux/rcupdate.h>
#include <linux/mutex.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct config { int level; };

static struct config __rcu *cur;
static DEFINE_MUTEX(update_lock);

int set_config(int level)
{
    // TODO: alloc new; lock; grab old; rcu_assign_pointer; unlock;
    //       synchronize_rcu; kfree old
    return 0;
}`,
    tags: ['kernel', 'rcu', 'update'],
  },
  {
    id: 'lx-ch10-c-062',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'RCU-Protected List Traversal and Deletion',
    prompt: `An RCU-protected linked list (struct list_head head, nodes struct item { struct list_head l; int key, val; }) is read under rcu_read_lock and modified under a spinlock list_lock. Write int item_find(int key, int *out) that traverses with list_for_each_entry_rcu inside an RCU read section (return 0 and set *out on hit, -ENOENT on miss), and void item_del(struct item *it) that removes it with list_del_rcu under list_lock, then kfree_rcu(it, l).`,
    hints: [
      'list_for_each_entry_rcu() is the RCU-safe traversal macro.',
      'list_del_rcu() unlinks without breaking concurrent readers.',
      'kfree_rcu(ptr, rcu_field) frees after a grace period without an explicit synchronize_rcu.',
    ],
    solution: `#include <linux/rculist.h>
#include <linux/spinlock.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct item {
    struct list_head l;
    int key, val;
};

static LIST_HEAD(head);
static DEFINE_SPINLOCK(list_lock);

int item_find(int key, int *out)
{
    struct item *it;

    rcu_read_lock();
    list_for_each_entry_rcu(it, &head, l) {
        if (it->key == key) {
            *out = it->val;
            rcu_read_unlock();
            return 0;
        }
    }
    rcu_read_unlock();
    return -ENOENT;
}

void item_del(struct item *it)
{
    spin_lock(&list_lock);
    list_del_rcu(&it->l);
    spin_unlock(&list_lock);

    kfree_rcu(it, l);
}`,
    starter: `#include <linux/rculist.h>
#include <linux/spinlock.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct item {
    struct list_head l;
    int key, val;
};

static LIST_HEAD(head);
static DEFINE_SPINLOCK(list_lock);

int item_find(int key, int *out)
{
    // TODO: rcu_read_lock; list_for_each_entry_rcu; -ENOENT on miss
    return -ENOENT;
}

void item_del(struct item *it)
{
    // TODO: list_del_rcu under list_lock; kfree_rcu
}`,
    tags: ['kernel', 'rcu', 'list'],
  },
  {
    id: 'lx-ch10-c-063',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Fix a Read-Modify-Write Race',
    prompt: `The buggy function below does balance = balance + amount with no locking, losing updates under concurrency. Two fixes are acceptable; implement BOTH as separate functions: (1) deposit_atomic(int amount) using an atomic_t balance and atomic_add, and (2) deposit_locked(int amount) using a plain int lbalance guarded by a spinlock. Show that each makes the RMW indivisible.`,
    hints: [
      'A non-atomic read-modify-write can interleave and drop increments.',
      'atomic_add() performs the whole RMW indivisibly.',
      'A spinlock makes the read+modify+write a single critical section.',
    ],
    solution: `#include <linux/atomic.h>
#include <linux/spinlock.h>

/* Fix 1: atomic_t */
static atomic_t balance = ATOMIC_INIT(0);

void deposit_atomic(int amount)
{
    atomic_add(amount, &balance);
}

/* Fix 2: spinlock around a plain int */
static DEFINE_SPINLOCK(bal_lock);
static int lbalance;

void deposit_locked(int amount)
{
    spin_lock(&bal_lock);
    lbalance = lbalance + amount;
    spin_unlock(&bal_lock);
}`,
    starter: `#include <linux/atomic.h>
#include <linux/spinlock.h>

/* BUGGY:
static int balance;
void deposit(int amount) { balance = balance + amount; }  // racy RMW
*/

static atomic_t balance = ATOMIC_INIT(0);

void deposit_atomic(int amount)
{
    // TODO: atomic_add
}

static DEFINE_SPINLOCK(bal_lock);
static int lbalance;

void deposit_locked(int amount)
{
    // TODO: spinlock around the RMW
}`,
    tags: ['kernel', 'race', 'atomic'],
  },
  {
    id: 'lx-ch10-c-064',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Memory Barrier for Producer-Consumer Flag',
    prompt: `A producer fills a static int data then sets a static int ready = 1; a consumer waits for ready then reads data. Without barriers the compiler/CPU may reorder the stores or loads. Write void produce(int v): set data = v, then smp_wmb(), then WRITE_ONCE(ready, 1). Write int consume(int *out): spin reading ready with READ_ONCE, smp_rmb() after seeing it set, then read data into *out, return 0.`,
    hints: [
      'smp_wmb() orders the data store before the ready store on the writer.',
      'smp_rmb() pairs on the reader so data is read after ready is observed.',
      'READ_ONCE/WRITE_ONCE prevent the compiler from tearing or hoisting the flag access.',
    ],
    solution: `#include <linux/compiler.h>
#include <asm/barrier.h>

static int data;
static int ready;

void produce(int v)
{
    data = v;
    smp_wmb();              /* ensure data is visible before ready */
    WRITE_ONCE(ready, 1);
}

int consume(int *out)
{
    while (!READ_ONCE(ready))
        cpu_relax();

    smp_rmb();              /* ensure data read happens after ready seen */
    *out = data;
    return 0;
}`,
    starter: `#include <linux/compiler.h>
#include <asm/barrier.h>

static int data;
static int ready;

void produce(int v)
{
    // TODO: store data, smp_wmb(), WRITE_ONCE(ready, 1)
}

int consume(int *out)
{
    // TODO: spin on READ_ONCE(ready), smp_rmb(), read data
    return 0;
}`,
    tags: ['kernel', 'barriers', 'ordering'],
  },
  {
    id: 'lx-ch10-c-065',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Choose the Right Lock per Context',
    prompt: `Implement a small driver state with three accessors that each pick the correct synchronization for their context. (1) cfg_set_user(int v): called from a syscall, may sleep; protect a static int cfg with a mutex cfg_mtx. (2) stat_bump(void): called from both process and hardirq; protect a static u64 stat with a spinlock using irqsave in process and plain lock in the ISR helper isr_bump(void). Write all four functions choosing mutex vs spinlock vs irqsave correctly.`,
    hints: [
      'Sleepable, process-only data -> mutex.',
      'Data shared with a hardirq -> spinlock with irqsave in process context.',
      'Inside the ISR, interrupts are already disabled, so plain spin_lock.',
    ],
    solution: `#include <linux/mutex.h>
#include <linux/spinlock.h>
#include <linux/types.h>

static DEFINE_MUTEX(cfg_mtx);
static int cfg;

void cfg_set_user(int v)
{
    mutex_lock(&cfg_mtx);
    cfg = v;
    mutex_unlock(&cfg_mtx);
}

static DEFINE_SPINLOCK(stat_lock);
static u64 stat;

void stat_bump(void)
{
    unsigned long flags;

    spin_lock_irqsave(&stat_lock, flags);
    stat++;
    spin_unlock_irqrestore(&stat_lock, flags);
}

void isr_bump(void)
{
    spin_lock(&stat_lock);
    stat++;
    spin_unlock(&stat_lock);
}`,
    starter: `#include <linux/mutex.h>
#include <linux/spinlock.h>
#include <linux/types.h>

static DEFINE_MUTEX(cfg_mtx);
static int cfg;

void cfg_set_user(int v)
{
    // TODO: mutex (sleepable, process-only)
}

static DEFINE_SPINLOCK(stat_lock);
static u64 stat;

void stat_bump(void)
{
    // TODO: spinlock irqsave (shared with hardirq)
}

void isr_bump(void)
{
    // TODO: plain spin_lock (already in IRQ context)
}`,
    tags: ['kernel', 'locking', 'context'],
  },
  {
    id: 'lx-ch10-c-066',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'atomic_cmpxchg-Based Lock-Free State Machine',
    prompt: `Implement a state transition that only succeeds if the state is exactly the expected value, with no locks. Using a static atomic_t state, write int transition(int from, int to) that uses atomic_cmpxchg: if the current value equals from, set it to to and return 0; otherwise return -EAGAIN. This is a compare-and-swap; it must be a single atomic operation.`,
    hints: [
      'atomic_cmpxchg(v, old, new) returns the value that was there before.',
      'If the returned (previous) value equals "old", the swap succeeded.',
      'No retry loop is needed for a single conditional transition.',
    ],
    solution: `#include <linux/atomic.h>
#include <linux/errno.h>

static atomic_t state = ATOMIC_INIT(0);

int transition(int from, int to)
{
    if (atomic_cmpxchg(&state, from, to) != from)
        return -EAGAIN;
    return 0;
}`,
    starter: `#include <linux/atomic.h>
#include <linux/errno.h>

static atomic_t state = ATOMIC_INIT(0);

int transition(int from, int to)
{
    // TODO: atomic_cmpxchg; -EAGAIN if previous value != from
    return 0;
}`,
    tags: ['kernel', 'atomic', 'cmpxchg'],
  },
  {
    id: 'lx-ch10-c-067',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Per-CPU Spinlock Hash Bucket',
    prompt: `Reduce contention by giving each of NR_BUCKETS=8 buckets its own spinlock. Define struct bucket { struct list_head head; spinlock_t lock; } and a static array buckets[8]. Write void buckets_init(void) initializing each bucket's list and lock, and void bucket_add(int key, struct list_head *node) that selects bucket key % 8 and adds node to its list under that bucket's lock. Independent keys on different buckets never contend.`,
    hints: [
      'INIT_LIST_HEAD and spin_lock_init per bucket in the init loop.',
      'Hash the key to a bucket index, then lock only that bucket.',
      'Fine-grained locking trades one big lock for many small ones.',
    ],
    solution: `#include <linux/list.h>
#include <linux/spinlock.h>

#define NR_BUCKETS 8

struct bucket {
    struct list_head head;
    spinlock_t lock;
};

static struct bucket buckets[NR_BUCKETS];

void buckets_init(void)
{
    int i;

    for (i = 0; i < NR_BUCKETS; i++) {
        INIT_LIST_HEAD(&buckets[i].head);
        spin_lock_init(&buckets[i].lock);
    }
}

void bucket_add(int key, struct list_head *node)
{
    struct bucket *b = &buckets[key % NR_BUCKETS];

    spin_lock(&b->lock);
    list_add(node, &b->head);
    spin_unlock(&b->lock);
}`,
    starter: `#include <linux/list.h>
#include <linux/spinlock.h>

#define NR_BUCKETS 8

struct bucket {
    struct list_head head;
    spinlock_t lock;
};

static struct bucket buckets[NR_BUCKETS];

void buckets_init(void)
{
    // TODO: init each bucket's list head and lock
}

void bucket_add(int key, struct list_head *node)
{
    // TODO: select bucket key % 8, add under its lock
}`,
    tags: ['kernel', 'spinlock', 'fine-grained'],
  },
  {
    id: 'lx-ch10-c-068',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Safe Two-Phase Free Under a Spinlock',
    prompt: `A list of struct node { struct list_head l; }; is guarded by spinlock_t lock. You must drain and free every node, but kfree must run outside the lock (and you must not sleep holding the lock). Write void drain_all(void) that, under the lock, splices the whole list onto a local list_head tmp with list_splice_init, releases the lock, then frees each node from tmp with list_for_each_entry_safe + kfree.`,
    hints: [
      'list_splice_init() moves all entries to another head and re-inits the source.',
      'Detach the list under the lock, free outside it.',
      'list_for_each_entry_safe lets you kfree while iterating.',
    ],
    solution: `#include <linux/list.h>
#include <linux/spinlock.h>
#include <linux/slab.h>

struct node { struct list_head l; };

static LIST_HEAD(nodes);
static DEFINE_SPINLOCK(lock);

void drain_all(void)
{
    LIST_HEAD(tmp);
    struct node *n, *next;

    spin_lock(&lock);
    list_splice_init(&nodes, &tmp);
    spin_unlock(&lock);

    list_for_each_entry_safe(n, next, &tmp, l) {
        list_del(&n->l);
        kfree(n);
    }
}`,
    starter: `#include <linux/list.h>
#include <linux/spinlock.h>
#include <linux/slab.h>

struct node { struct list_head l; };

static LIST_HEAD(nodes);
static DEFINE_SPINLOCK(lock);

void drain_all(void)
{
    LIST_HEAD(tmp);
    // TODO: splice under lock, then free outside the lock with the _safe iterator
}`,
    tags: ['kernel', 'spinlock', 'list'],
  },
  {
    id: 'lx-ch10-c-069',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Wait Queue With Mutex-Protected Condition',
    prompt: `Implement a blocking read that sleeps until data is available. Given a static int have_data, a static DECLARE_WAIT_QUEUE_HEAD(wq), and a static DEFINE_MUTEX(m), write int wait_for_data(void) that uses wait_event_interruptible(wq, have_data) to sleep, returns -ERESTARTSYS if interrupted, then under the mutex clears have_data and returns 0. Also write void supply_data(void) that sets have_data under the mutex and calls wake_up_interruptible(&wq).`,
    hints: [
      'wait_event_interruptible() sleeps until the condition is true; nonzero return means a signal.',
      'Do not hold the mutex across wait_event; check the condition the macro evaluates without your lock here.',
      'wake_up_interruptible() wakes sleepers after you make the condition true.',
    ],
    solution: `#include <linux/wait.h>
#include <linux/mutex.h>
#include <linux/sched.h>
#include <linux/errno.h>

static int have_data;
static DECLARE_WAIT_QUEUE_HEAD(wq);
static DEFINE_MUTEX(m);

int wait_for_data(void)
{
    if (wait_event_interruptible(wq, have_data))
        return -ERESTARTSYS;

    mutex_lock(&m);
    have_data = 0;
    mutex_unlock(&m);
    return 0;
}

void supply_data(void)
{
    mutex_lock(&m);
    have_data = 1;
    mutex_unlock(&m);

    wake_up_interruptible(&wq);
}`,
    starter: `#include <linux/wait.h>
#include <linux/mutex.h>
#include <linux/sched.h>
#include <linux/errno.h>

static int have_data;
static DECLARE_WAIT_QUEUE_HEAD(wq);
static DEFINE_MUTEX(m);

int wait_for_data(void)
{
    // TODO: wait_event_interruptible; -ERESTARTSYS on signal; clear under mutex
    return 0;
}

void supply_data(void)
{
    // TODO: set have_data under mutex; wake_up_interruptible
}`,
    tags: ['kernel', 'waitqueue', 'mutex'],
  },
  {
    id: 'lx-ch10-c-070',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'spin_lock_irqsave With Conditional copy_to_user Drain',
    prompt: `A ring of pending bytes is filled by an ISR under spinlock_t lock (irqsave on the process side). Write ssize_t drain_to_user(char __user *u, size_t n) that, under spin_lock_irqsave, copies up to min(n, count) bytes from a static char ring[256] (count valid bytes at offset 0) into a local kernel bounce buffer, updates count to 0, releases the lock, THEN copy_to_user from the bounce buffer (never under the lock). Return bytes copied, or -EFAULT on fault. count and ring are static.`,
    hints: [
      'Snapshot/drain shared data into a kernel-local buffer under the lock.',
      'copy_to_user can fault and must run with the lock released.',
      'Use a stack bounce buffer sized to the ring; compute how many bytes to take with min().',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/string.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(lock);
static char ring[256];
static size_t count;

ssize_t drain_to_user(char __user *u, size_t n)
{
    unsigned long flags;
    char bounce[256];
    size_t take;

    spin_lock_irqsave(&lock, flags);
    take = min(n, count);
    memcpy(bounce, ring, take);
    count = 0;
    spin_unlock_irqrestore(&lock, flags);

    if (copy_to_user(u, bounce, take))
        return -EFAULT;

    return take;
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/string.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(lock);
static char ring[256];
static size_t count;

ssize_t drain_to_user(char __user *u, size_t n)
{
    char bounce[256];
    // TODO: under irqsave lock, memcpy ring->bounce, reset count, unlock
    // TODO: copy_to_user from bounce (outside lock); -EFAULT on fault
    return 0;
}`,
    tags: ['kernel', 'spinlock', 'uaccess'],
  },
]

export default problems
