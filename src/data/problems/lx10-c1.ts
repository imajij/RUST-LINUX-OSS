import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch10-c-001',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare and Initialize an atomic_t',
    prompt: `Declare a static atomic_t counter named open_count initialized to 0 using the ATOMIC_INIT macro. Then write a function void reset_open_count(void) that resets it back to 0 using atomic_set. Use the proper header.`,
    hints: [
      'ATOMIC_INIT(0) initializes an atomic_t at declaration time.',
      'atomic_set(&v, 0) stores a new value.',
    ],
    solution: `#include <linux/atomic.h>

static atomic_t open_count = ATOMIC_INIT(0);

void reset_open_count(void)
{
    atomic_set(&open_count, 0);
}`,
    starter: `#include <linux/atomic.h>

static atomic_t open_count = /* TODO: ATOMIC_INIT(...) */;

void reset_open_count(void)
{
    // TODO: set open_count back to 0
}`,
    tags: ['kernel', 'atomic', 'locking'],
  },
  {
    id: 'lx-ch10-c-002',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Atomic Increment and Read',
    prompt: `Using the static atomic_t counter named events (initialized to 0), write a function int bump_events(void) that atomically increments the counter by one with atomic_inc, then returns its current value read with atomic_read.`,
    hints: [
      'atomic_inc(&v) adds 1 atomically and returns nothing.',
      'atomic_read(&v) returns the current int value.',
    ],
    solution: `#include <linux/atomic.h>

static atomic_t events = ATOMIC_INIT(0);

int bump_events(void)
{
    atomic_inc(&events);
    return atomic_read(&events);
}`,
    starter: `#include <linux/atomic.h>

static atomic_t events = ATOMIC_INIT(0);

int bump_events(void)
{
    // TODO: increment atomically, then return the value
    return 0;
}`,
    tags: ['kernel', 'atomic', 'counter'],
  },
  {
    id: 'lx-ch10-c-003',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare and Initialize a Spinlock',
    prompt: `Declare a static spinlock_t named my_lock and initialize it at definition time using DEFINE_SPINLOCK. Also write a function void init_lock_runtime(spinlock_t *lock) that initializes a spinlock at runtime using spin_lock_init.`,
    hints: [
      'DEFINE_SPINLOCK(name) both declares and initializes the lock.',
      'spin_lock_init(&lock) initializes a spinlock at runtime.',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(my_lock);

void init_lock_runtime(spinlock_t *lock)
{
    spin_lock_init(lock);
}`,
    starter: `#include <linux/spinlock.h>

/* TODO: define my_lock with DEFINE_SPINLOCK */

void init_lock_runtime(spinlock_t *lock)
{
    // TODO: initialize *lock at runtime
}`,
    tags: ['kernel', 'spinlock', 'locking'],
  },
  {
    id: 'lx-ch10-c-004',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Protect a Counter With a Spinlock',
    prompt: `Given a static DEFINE_SPINLOCK(count_lock) and a static int shared_count, write a function void inc_shared(void) that increments shared_count inside a critical section guarded by spin_lock and spin_unlock.`,
    hints: [
      'Take the lock, do the minimal work, then release it.',
      'Use spin_lock(&count_lock) / spin_unlock(&count_lock).',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(count_lock);
static int shared_count;

void inc_shared(void)
{
    spin_lock(&count_lock);
    shared_count++;
    spin_unlock(&count_lock);
}`,
    starter: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(count_lock);
static int shared_count;

void inc_shared(void)
{
    // TODO: lock, increment shared_count, unlock
}`,
    tags: ['kernel', 'spinlock', 'critical-section'],
  },
  {
    id: 'lx-ch10-c-005',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare and Initialize a Mutex',
    prompt: `Declare a static struct mutex named cfg_lock and initialize it at definition time with DEFINE_MUTEX. Also write a function void init_mutex_runtime(struct mutex *m) that initializes a mutex at runtime with mutex_init.`,
    hints: [
      'DEFINE_MUTEX(name) declares and initializes the mutex.',
      'mutex_init(&m) initializes a mutex at runtime.',
    ],
    solution: `#include <linux/mutex.h>

static DEFINE_MUTEX(cfg_lock);

void init_mutex_runtime(struct mutex *m)
{
    mutex_init(m);
}`,
    starter: `#include <linux/mutex.h>

/* TODO: define cfg_lock with DEFINE_MUTEX */

void init_mutex_runtime(struct mutex *m)
{
    // TODO: initialize *m at runtime
}`,
    tags: ['kernel', 'mutex', 'locking'],
  },
  {
    id: 'lx-ch10-c-006',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Critical Section With a Mutex',
    prompt: `Given a static DEFINE_MUTEX(list_lock) and a static int item_total, write a function void add_items(int n) that acquires the mutex with mutex_lock, adds n to item_total, then releases it with mutex_unlock.`,
    hints: [
      'mutex_lock can sleep, so it must only be called from process context.',
      'Always pair mutex_lock with mutex_unlock.',
    ],
    solution: `#include <linux/mutex.h>

static DEFINE_MUTEX(list_lock);
static int item_total;

void add_items(int n)
{
    mutex_lock(&list_lock);
    item_total += n;
    mutex_unlock(&list_lock);
}`,
    starter: `#include <linux/mutex.h>

static DEFINE_MUTEX(list_lock);
static int item_total;

void add_items(int n)
{
    // TODO: lock the mutex, add n, unlock
}`,
    tags: ['kernel', 'mutex', 'critical-section'],
  },
  {
    id: 'lx-ch10-c-007',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Atomic Decrement and Test for Zero',
    prompt: `Given a static atomic_t refcount, write a function void put_ref(void) that atomically decrements refcount and, when it reaches zero, calls a provided function void free_object(void). Use atomic_dec_and_test which returns true if the new value is 0.`,
    hints: [
      'atomic_dec_and_test(&v) decrements and returns true when the result is 0.',
      'This is the classic reference-count release pattern.',
    ],
    solution: `#include <linux/atomic.h>

static atomic_t refcount = ATOMIC_INIT(1);

void free_object(void);

void put_ref(void)
{
    if (atomic_dec_and_test(&refcount))
        free_object();
}`,
    starter: `#include <linux/atomic.h>

static atomic_t refcount = ATOMIC_INIT(1);

void free_object(void);

void put_ref(void)
{
    // TODO: atomic decrement; if it hit zero, call free_object()
}`,
    tags: ['kernel', 'atomic', 'refcount'],
  },
  {
    id: 'lx-ch10-c-008',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Try to Acquire a Mutex',
    prompt: `Write a function int try_update(int *target, int val) that attempts to acquire static DEFINE_MUTEX(upd_lock) without blocking using mutex_trylock. If it gets the lock, store val into *target, unlock, and return 0. If it cannot get the lock, return -EBUSY.`,
    hints: [
      'mutex_trylock returns 1 if the lock was acquired, 0 otherwise.',
      'Only unlock if you actually got the lock.',
    ],
    solution: `#include <linux/mutex.h>
#include <linux/errno.h>

static DEFINE_MUTEX(upd_lock);

int try_update(int *target, int val)
{
    if (!mutex_trylock(&upd_lock))
        return -EBUSY;

    *target = val;
    mutex_unlock(&upd_lock);
    return 0;
}`,
    starter: `#include <linux/mutex.h>
#include <linux/errno.h>

static DEFINE_MUTEX(upd_lock);

int try_update(int *target, int val)
{
    // TODO: trylock; on success store val and unlock; else -EBUSY
    return 0;
}`,
    tags: ['kernel', 'mutex', 'trylock'],
  },
  {
    id: 'lx-ch10-c-009',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Atomic Compare and Swap',
    prompt: `Given a static atomic_t state initialized to 0, write a function int claim_state(void) that uses atomic_cmpxchg to transition state from 0 (free) to 1 (claimed). Return 0 if this thread won the race (old value was 0), or -EBUSY otherwise.`,
    hints: [
      'atomic_cmpxchg(&v, old, new) returns the value that was in v before the call.',
      'If the returned old value equals what you expected, the swap succeeded.',
    ],
    solution: `#include <linux/atomic.h>
#include <linux/errno.h>

static atomic_t state = ATOMIC_INIT(0);

int claim_state(void)
{
    if (atomic_cmpxchg(&state, 0, 1) == 0)
        return 0;
    return -EBUSY;
}`,
    starter: `#include <linux/atomic.h>
#include <linux/errno.h>

static atomic_t state = ATOMIC_INIT(0);

int claim_state(void)
{
    // TODO: cmpxchg 0 -> 1; return 0 if we won, else -EBUSY
    return 0;
}`,
    tags: ['kernel', 'atomic', 'cmpxchg'],
  },
  {
    id: 'lx-ch10-c-010',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read-Side With an rwlock',
    prompt: `Given a static DEFINE_RWLOCK(data_lock) and a static int sensor_value, write a function int read_sensor(void) that takes the read side with read_lock, copies sensor_value into a local, releases with read_unlock, and returns the local copy.`,
    hints: [
      'read_lock / read_unlock allow concurrent readers.',
      'Copy the value out while holding the lock, then return the copy.',
    ],
    solution: `#include <linux/rwlock.h>

static DEFINE_RWLOCK(data_lock);
static int sensor_value;

int read_sensor(void)
{
    int v;

    read_lock(&data_lock);
    v = sensor_value;
    read_unlock(&data_lock);
    return v;
}`,
    starter: `#include <linux/rwlock.h>

static DEFINE_RWLOCK(data_lock);
static int sensor_value;

int read_sensor(void)
{
    int v;

    // TODO: read_lock, copy sensor_value, read_unlock
    return v;
}`,
    tags: ['kernel', 'rwlock', 'reader'],
  },
  {
    id: 'lx-ch10-c-011',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define a Per-CPU Variable',
    prompt: `Define a static per-CPU unsigned long named irq_hits using DEFINE_PER_CPU. Then write a function void bump_this_cpu(void) that increments the current CPU's counter. Use this_cpu_inc to do it without disabling preemption manually.`,
    hints: [
      'DEFINE_PER_CPU(type, name) creates one instance per CPU.',
      'this_cpu_inc(var) safely increments the current CPU copy.',
    ],
    solution: `#include <linux/percpu.h>

static DEFINE_PER_CPU(unsigned long, irq_hits);

void bump_this_cpu(void)
{
    this_cpu_inc(irq_hits);
}`,
    starter: `#include <linux/percpu.h>

/* TODO: define per-CPU unsigned long irq_hits */

void bump_this_cpu(void)
{
    // TODO: increment this CPU's irq_hits
}`,
    tags: ['kernel', 'percpu', 'counter'],
  },
  {
    id: 'lx-ch10-c-012',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Atomic Add and Return',
    prompt: `Given a static atomic_t bytes_seen, write a function int account_bytes(int n) that atomically adds n to the counter and returns the new total. Use atomic_add_return.`,
    hints: [
      'atomic_add_return(n, &v) adds n and returns the updated value.',
      'No separate atomic_read is needed; the return value is the new total.',
    ],
    solution: `#include <linux/atomic.h>

static atomic_t bytes_seen = ATOMIC_INIT(0);

int account_bytes(int n)
{
    return atomic_add_return(n, &bytes_seen);
}`,
    starter: `#include <linux/atomic.h>

static atomic_t bytes_seen = ATOMIC_INIT(0);

int account_bytes(int n)
{
    // TODO: add n atomically and return the new total
    return 0;
}`,
    tags: ['kernel', 'atomic', 'counter'],
  },
  {
    id: 'lx-ch10-c-013',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Spinlock That Saves Interrupt State',
    prompt: `A shared list is touched from both process context and a timer/IRQ. Given static DEFINE_SPINLOCK(q_lock) and a static int q_len, write void push_item(void) that protects q_len++ with spin_lock_irqsave / spin_unlock_irqrestore. Declare and use a local unsigned long flags.`,
    hints: [
      'spin_lock_irqsave(&lock, flags) disables local IRQs and saves their prior state.',
      'spin_unlock_irqrestore(&lock, flags) restores exactly that state.',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(q_lock);
static int q_len;

void push_item(void)
{
    unsigned long flags;

    spin_lock_irqsave(&q_lock, flags);
    q_len++;
    spin_unlock_irqrestore(&q_lock, flags);
}`,
    starter: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(q_lock);
static int q_len;

void push_item(void)
{
    unsigned long flags;

    // TODO: lock with IRQ save, increment q_len, unlock with IRQ restore
}`,
    tags: ['kernel', 'spinlock', 'irqsave'],
  },
  {
    id: 'lx-ch10-c-014',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fix the Lost-Update Race',
    prompt: `This counter loses updates when two CPUs run it concurrently. Rewrite increment_total so the read-modify-write on a non-atomic shared long total is made safe using a spinlock. Add a static DEFINE_SPINLOCK(total_lock) and protect the update.`,
    hints: [
      'total++ is really load, add, store: not atomic.',
      'Guard the whole read-modify-write inside one locked region.',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(total_lock);
static long total;

void increment_total(void)
{
    spin_lock(&total_lock);
    total++;
    spin_unlock(&total_lock);
}`,
    starter: `#include <linux/spinlock.h>

static long total;

/* BUG: total++ from two CPUs races and loses updates. */
void increment_total(void)
{
    total++;
}`,
    tags: ['kernel', 'spinlock', 'race'],
  },
  {
    id: 'lx-ch10-c-015',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Replace Locked Counter With atomic_t',
    prompt: `A simple integer counter is currently guarded by a spinlock for every increment. Rewrite it to use an atomic_t instead, removing the lock entirely. Define static atomic_t hits = ATOMIC_INIT(0) and write void record_hit(void) and int total_hits(void).`,
    hints: [
      'A lone counter that only needs increment/read is a perfect fit for atomic_t.',
      'atomic_inc for the write, atomic_read for the read.',
    ],
    solution: `#include <linux/atomic.h>

static atomic_t hits = ATOMIC_INIT(0);

void record_hit(void)
{
    atomic_inc(&hits);
}

int total_hits(void)
{
    return atomic_read(&hits);
}`,
    starter: `#include <linux/atomic.h>

static atomic_t hits = ATOMIC_INIT(0);

void record_hit(void)
{
    // TODO: atomic increment
}

int total_hits(void)
{
    // TODO: atomic read
    return 0;
}`,
    tags: ['kernel', 'atomic', 'counter'],
  },
  {
    id: 'lx-ch10-c-016',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sleepable Critical Section Needs a Mutex',
    prompt: `update_config copies bytes from user space (which can sleep/fault) while holding shared config_buf. A spinlock would be wrong here. Implement int update_config(const char __user *src, size_t len) using static DEFINE_MUTEX(cfg_lock): lock the mutex, call copy_from_user into a static char config_buf[256], unlock, and return 0 on success or -EFAULT on a faulting copy.`,
    hints: [
      'copy_from_user may sleep, so you must hold a sleepable lock (mutex), not a spinlock.',
      'copy_from_user returns the number of bytes NOT copied; nonzero means fault.',
      'Unlock before returning on every path.',
    ],
    solution: `#include <linux/mutex.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static DEFINE_MUTEX(cfg_lock);
static char config_buf[256];

int update_config(const char __user *src, size_t len)
{
    int ret = 0;

    if (len > sizeof(config_buf))
        len = sizeof(config_buf);

    mutex_lock(&cfg_lock);
    if (copy_from_user(config_buf, src, len))
        ret = -EFAULT;
    mutex_unlock(&cfg_lock);
    return ret;
}`,
    starter: `#include <linux/mutex.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static DEFINE_MUTEX(cfg_lock);
static char config_buf[256];

int update_config(const char __user *src, size_t len)
{
    // TODO: hold cfg_lock across copy_from_user; return -EFAULT on fault
    return 0;
}`,
    tags: ['kernel', 'mutex', 'copy_from_user'],
  },
  {
    id: 'lx-ch10-c-017',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Why You Cannot Sleep Holding a Spinlock',
    prompt: `This buggy function calls kmalloc with GFP_KERNEL (which may sleep) while holding a spinlock, which can deadlock. Fix it: move the allocation OUTSIDE the spinlock, allocating before taking static DEFINE_SPINLOCK(slot_lock), then only do the pointer assignment to static void *slot inside the lock. Implement int set_slot(size_t n).`,
    hints: [
      'You must never sleep while holding a spinlock; GFP_KERNEL can sleep.',
      'Allocate first, then take the lock only for the short pointer update.',
      'Return -ENOMEM if the allocation fails.',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/slab.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(slot_lock);
static void *slot;

int set_slot(size_t n)
{
    void *p = kmalloc(n, GFP_KERNEL);

    if (!p)
        return -ENOMEM;

    spin_lock(&slot_lock);
    slot = p;
    spin_unlock(&slot_lock);
    return 0;
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/slab.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(slot_lock);
static void *slot;

/* BUG: kmalloc(GFP_KERNEL) can sleep while the spinlock is held. */
int set_slot(size_t n)
{
    spin_lock(&slot_lock);
    slot = kmalloc(n, GFP_KERNEL);
    spin_unlock(&slot_lock);
    return slot ? 0 : -ENOMEM;
}`,
    tags: ['kernel', 'spinlock', 'gfp'],
  },
  {
    id: 'lx-ch10-c-018',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate Atomically Inside a Spinlock',
    prompt: `Sometimes you truly must allocate while holding a spinlock. Implement int log_event(int code) that holds static DEFINE_SPINLOCK(log_lock) and allocates a small struct with kmalloc using the correct GFP flag for atomic context. Return -ENOMEM on failure (releasing the lock first). On success free it immediately and return 0. Struct: struct ev { int code; };`,
    hints: [
      'In atomic context you must use GFP_ATOMIC, which never sleeps.',
      'Release the lock on the error path too.',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct ev { int code; };
static DEFINE_SPINLOCK(log_lock);

int log_event(int code)
{
    struct ev *e;

    spin_lock(&log_lock);
    e = kmalloc(sizeof(*e), GFP_ATOMIC);
    if (!e) {
        spin_unlock(&log_lock);
        return -ENOMEM;
    }
    e->code = code;
    kfree(e);
    spin_unlock(&log_lock);
    return 0;
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct ev { int code; };
static DEFINE_SPINLOCK(log_lock);

int log_event(int code)
{
    // TODO: allocate with the correct GFP flag for atomic context
    return 0;
}`,
    tags: ['kernel', 'spinlock', 'gfp-atomic'],
  },
  {
    id: 'lx-ch10-c-019',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Writer Side of an rwlock',
    prompt: `Pair with the reader from before. Given static DEFINE_RWLOCK(data_lock) and a static int sensor_value, write void write_sensor(int v) that takes the write side with write_lock, stores v, and releases with write_unlock. Only one writer may hold the lock and it excludes all readers.`,
    hints: [
      'write_lock excludes both other writers and all readers.',
      'Keep the write critical section short.',
    ],
    solution: `#include <linux/rwlock.h>

static DEFINE_RWLOCK(data_lock);
static int sensor_value;

void write_sensor(int v)
{
    write_lock(&data_lock);
    sensor_value = v;
    write_unlock(&data_lock);
}`,
    starter: `#include <linux/rwlock.h>

static DEFINE_RWLOCK(data_lock);
static int sensor_value;

void write_sensor(int v)
{
    // TODO: write_lock, store v, write_unlock
}`,
    tags: ['kernel', 'rwlock', 'writer'],
  },
  {
    id: 'lx-ch10-c-020',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Seqlock Writer',
    prompt: `Implement the writer for a seqlock. Given static DEFINE_SEQLOCK(ts_lock) and two static u64 fields hi and lo, write void set_pair(u64 a, u64 b) that uses write_seqlock / write_sequnlock to update both fields atomically with respect to seqlock readers.`,
    hints: [
      'write_seqlock bumps the sequence count and takes the embedded lock.',
      'write_sequnlock bumps it again so readers can detect the update window.',
    ],
    solution: `#include <linux/seqlock.h>
#include <linux/types.h>

static DEFINE_SEQLOCK(ts_lock);
static u64 hi, lo;

void set_pair(u64 a, u64 b)
{
    write_seqlock(&ts_lock);
    hi = a;
    lo = b;
    write_sequnlock(&ts_lock);
}`,
    starter: `#include <linux/seqlock.h>
#include <linux/types.h>

static DEFINE_SEQLOCK(ts_lock);
static u64 hi, lo;

void set_pair(u64 a, u64 b)
{
    // TODO: write_seqlock, update both fields, write_sequnlock
}`,
    tags: ['kernel', 'seqlock', 'writer'],
  },
  {
    id: 'lx-ch10-c-021',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Seqlock Reader Retry Loop',
    prompt: `Implement the matching seqlock reader. Given static DEFINE_SEQLOCK(ts_lock) and static u64 hi, lo, write void get_pair(u64 *a, u64 *b) that reads both fields consistently using read_seqbegin and read_seqretry in a do/while loop, retrying if a writer was active.`,
    hints: [
      'seq = read_seqbegin(&lock); ... ; while (read_seqretry(&lock, seq));',
      'read_seqretry returns true if you must retry because a write occurred.',
    ],
    solution: `#include <linux/seqlock.h>
#include <linux/types.h>

static DEFINE_SEQLOCK(ts_lock);
static u64 hi, lo;

void get_pair(u64 *a, u64 *b)
{
    unsigned int seq;

    do {
        seq = read_seqbegin(&ts_lock);
        *a = hi;
        *b = lo;
    } while (read_seqretry(&ts_lock, seq));
}`,
    starter: `#include <linux/seqlock.h>
#include <linux/types.h>

static DEFINE_SEQLOCK(ts_lock);
static u64 hi, lo;

void get_pair(u64 *a, u64 *b)
{
    unsigned int seq;

    // TODO: read both fields inside a read_seqbegin/read_seqretry loop
}`,
    tags: ['kernel', 'seqlock', 'reader'],
  },
  {
    id: 'lx-ch10-c-022',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'RCU Read-Side Critical Section',
    prompt: `A pointer static struct cfg __rcu *gcfg points to a config object. Implement int read_threshold(void) that safely dereferences it on the read side: enter with rcu_read_lock, fetch the pointer with rcu_dereference, read its int field threshold into a local, exit with rcu_read_unlock, and return the local. struct cfg has an int threshold.`,
    hints: [
      'rcu_read_lock / rcu_read_unlock bracket the read-side critical section.',
      'Use rcu_dereference to load the RCU-protected pointer.',
      'You must not sleep between rcu_read_lock and rcu_read_unlock.',
    ],
    solution: `#include <linux/rcupdate.h>

struct cfg { int threshold; };
static struct cfg __rcu *gcfg;

int read_threshold(void)
{
    struct cfg *c;
    int val;

    rcu_read_lock();
    c = rcu_dereference(gcfg);
    val = c ? c->threshold : 0;
    rcu_read_unlock();
    return val;
}`,
    starter: `#include <linux/rcupdate.h>

struct cfg { int threshold; };
static struct cfg __rcu *gcfg;

int read_threshold(void)
{
    struct cfg *c;
    int val;

    // TODO: rcu_read_lock, rcu_dereference gcfg, read threshold, rcu_read_unlock
    return val;
}`,
    tags: ['kernel', 'rcu', 'reader'],
  },
  {
    id: 'lx-ch10-c-023',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'RCU Publish a New Pointer',
    prompt: `Implement the writer that publishes a new config under RCU. static struct cfg __rcu *gcfg points to the current object. Write void publish_cfg(struct cfg *newc) that installs newc with rcu_assign_pointer and frees the old object after a grace period with synchronize_rcu followed by kfree. (Capture the old pointer before assigning.)`,
    hints: [
      'rcu_assign_pointer publishes the new pointer with the needed barrier.',
      'synchronize_rcu waits until all pre-existing readers have finished before you free.',
      'rcu_dereference_protected or simple read of the old pointer is fine on the writer side under its lock.',
    ],
    solution: `#include <linux/rcupdate.h>
#include <linux/slab.h>

struct cfg { int threshold; };
static struct cfg __rcu *gcfg;

void publish_cfg(struct cfg *newc)
{
    struct cfg *old = rcu_dereference_protected(gcfg, 1);

    rcu_assign_pointer(gcfg, newc);
    synchronize_rcu();
    kfree(old);
}`,
    starter: `#include <linux/rcupdate.h>
#include <linux/slab.h>

struct cfg { int threshold; };
static struct cfg __rcu *gcfg;

void publish_cfg(struct cfg *newc)
{
    // TODO: capture old, rcu_assign_pointer newc, synchronize_rcu, kfree old
}`,
    tags: ['kernel', 'rcu', 'writer'],
  },
  {
    id: 'lx-ch10-c-024',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Spinlock With Bottom-Half Disable',
    prompt: `A data structure is shared between process context and a softirq/tasklet (bottom half), but NOT with hardware IRQ handlers. Implement void add_stat(int n) that protects static long stat_sum (+= n) using the spinlock variant that also disables bottom halves: spin_lock_bh / spin_unlock_bh with static DEFINE_SPINLOCK(stat_lock).`,
    hints: [
      'spin_lock_bh disables softirqs/bottom halves on the local CPU.',
      'Use it when the only other contender is a bottom half, not a hard IRQ.',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(stat_lock);
static long stat_sum;

void add_stat(int n)
{
    spin_lock_bh(&stat_lock);
    stat_sum += n;
    spin_unlock_bh(&stat_lock);
}`,
    starter: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(stat_lock);
static long stat_sum;

void add_stat(int n)
{
    // TODO: protect stat_sum using the bottom-half-disabling spinlock
}`,
    tags: ['kernel', 'spinlock', 'bottom-half'],
  },
  {
    id: 'lx-ch10-c-025',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Interruptible Mutex Acquire',
    prompt: `A driver read() may block for a long time, so a fatal signal should be able to abort the wait. Implement int begin_io(void) that acquires static DEFINE_MUTEX(io_lock) using mutex_lock_interruptible. If it returns nonzero (interrupted by a signal), propagate that as -ERESTARTSYS. On success return 0 with the lock held.`,
    hints: [
      'mutex_lock_interruptible returns 0 on success or -EINTR if interrupted.',
      'Drivers typically convert that interruption into -ERESTARTSYS for the syscall layer.',
    ],
    solution: `#include <linux/mutex.h>
#include <linux/errno.h>

static DEFINE_MUTEX(io_lock);

int begin_io(void)
{
    if (mutex_lock_interruptible(&io_lock))
        return -ERESTARTSYS;
    return 0;
}`,
    starter: `#include <linux/mutex.h>
#include <linux/errno.h>

static DEFINE_MUTEX(io_lock);

int begin_io(void)
{
    // TODO: interruptible lock; -ERESTARTSYS if interrupted, else 0
    return 0;
}`,
    tags: ['kernel', 'mutex', 'interruptible'],
  },
  {
    id: 'lx-ch10-c-026',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Counting Semaphore as a Resource Pool',
    prompt: `You have a pool of 4 identical hardware channels. Declare static DEFINE_SEMAPHORE_or_init a counting semaphore named chan_sem with count 4 using sema_init in an init function, then write int get_channel(void) that takes one slot with down_interruptible (return -ERESTARTSYS if interrupted) and void put_channel(void) that releases with up.`,
    hints: [
      'sema_init(&sem, 4) makes a counting semaphore allowing 4 concurrent holders.',
      'down_interruptible returns nonzero if a signal interrupts the wait.',
      'up releases one count back to the pool.',
    ],
    solution: `#include <linux/semaphore.h>
#include <linux/errno.h>

static struct semaphore chan_sem;

void channel_pool_init(void)
{
    sema_init(&chan_sem, 4);
}

int get_channel(void)
{
    if (down_interruptible(&chan_sem))
        return -ERESTARTSYS;
    return 0;
}

void put_channel(void)
{
    up(&chan_sem);
}`,
    starter: `#include <linux/semaphore.h>
#include <linux/errno.h>

static struct semaphore chan_sem;

void channel_pool_init(void)
{
    // TODO: sema_init with a count of 4
}

int get_channel(void)
{
    // TODO: down_interruptible; -ERESTARTSYS if interrupted
    return 0;
}

void put_channel(void)
{
    // TODO: release one count
}`,
    tags: ['kernel', 'semaphore', 'pool'],
  },
  {
    id: 'lx-ch10-c-027',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum a Per-CPU Counter Across All CPUs',
    prompt: `Given static DEFINE_PER_CPU(unsigned long, pkt_count), each CPU bumps its own copy lock-free. Write unsigned long total_packets(void) that sums every CPU's value using for_each_possible_cpu and per_cpu(pkt_count, cpu), returning the grand total.`,
    hints: [
      'for_each_possible_cpu(cpu) iterates all CPU ids.',
      'per_cpu(var, cpu) accesses a specific CPU instance of the variable.',
    ],
    solution: `#include <linux/percpu.h>
#include <linux/cpumask.h>

static DEFINE_PER_CPU(unsigned long, pkt_count);

unsigned long total_packets(void)
{
    unsigned long sum = 0;
    int cpu;

    for_each_possible_cpu(cpu)
        sum += per_cpu(pkt_count, cpu);

    return sum;
}`,
    starter: `#include <linux/percpu.h>
#include <linux/cpumask.h>

static DEFINE_PER_CPU(unsigned long, pkt_count);

unsigned long total_packets(void)
{
    unsigned long sum = 0;
    int cpu;

    // TODO: add up each CPU's pkt_count
    return sum;
}`,
    tags: ['kernel', 'percpu', 'sum'],
  },
  {
    id: 'lx-ch10-c-028',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Safe Get/Put of a Per-CPU Pointer',
    prompt: `Define static DEFINE_PER_CPU(int, scratch). Write int read_my_scratch(void) that disables preemption around the access so the value isn't migrated to another CPU mid-use: use get_cpu_var to fetch a reference, read it into a local, then put_cpu_var to re-enable preemption, and return the local.`,
    hints: [
      'get_cpu_var(var) returns an lvalue and disables preemption.',
      'put_cpu_var(var) re-enables preemption; they must be balanced.',
    ],
    solution: `#include <linux/percpu.h>

static DEFINE_PER_CPU(int, scratch);

int read_my_scratch(void)
{
    int v;

    v = get_cpu_var(scratch);
    put_cpu_var(scratch);
    return v;
}`,
    starter: `#include <linux/percpu.h>

static DEFINE_PER_CPU(int, scratch);

int read_my_scratch(void)
{
    int v;

    // TODO: get_cpu_var to read with preemption disabled, then put_cpu_var
    return v;
}`,
    tags: ['kernel', 'percpu', 'preemption'],
  },
  {
    id: 'lx-ch10-c-029',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Locks Without Deadlock',
    prompt: `Two functions each need both static DEFINE_SPINLOCK(a_lock) and static DEFINE_SPINLOCK(b_lock). Implement void move_value(void) and void move_back(void) such that BOTH always acquire a_lock before b_lock, avoiding the classic ABBA deadlock. Each just does an int swap_field++ inside the doubly-locked region; declare static int swap_field.`,
    hints: [
      'A consistent global lock ordering prevents deadlock.',
      'If everyone takes a_lock then b_lock, no cycle can form.',
      'Release in reverse order: unlock b then a.',
    ],
    solution: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(a_lock);
static DEFINE_SPINLOCK(b_lock);
static int swap_field;

void move_value(void)
{
    spin_lock(&a_lock);
    spin_lock(&b_lock);
    swap_field++;
    spin_unlock(&b_lock);
    spin_unlock(&a_lock);
}

void move_back(void)
{
    spin_lock(&a_lock);
    spin_lock(&b_lock);
    swap_field++;
    spin_unlock(&b_lock);
    spin_unlock(&a_lock);
}`,
    starter: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(a_lock);
static DEFINE_SPINLOCK(b_lock);
static int swap_field;

void move_value(void)
{
    // TODO: take a_lock then b_lock, update, unlock in reverse
}

void move_back(void)
{
    // TODO: same lock order to avoid ABBA deadlock
}`,
    tags: ['kernel', 'spinlock', 'deadlock'],
  },
  {
    id: 'lx-ch10-c-030',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'atomic_inc_return for a Unique ID',
    prompt: `Implement unsigned int next_id(void) that hands out monotonically increasing IDs starting at 1, safe under concurrency, using a static atomic_t id_counter = ATOMIC_INIT(0) and atomic_inc_return (which returns the post-increment value).`,
    hints: [
      'atomic_inc_return increments first, then returns the new value.',
      'Starting the counter at 0 means the first returned ID is 1.',
    ],
    solution: `#include <linux/atomic.h>

static atomic_t id_counter = ATOMIC_INIT(0);

unsigned int next_id(void)
{
    return (unsigned int)atomic_inc_return(&id_counter);
}`,
    starter: `#include <linux/atomic.h>

static atomic_t id_counter = ATOMIC_INIT(0);

unsigned int next_id(void)
{
    // TODO: return a fresh increasing id using atomic_inc_return
    return 0;
}`,
    tags: ['kernel', 'atomic', 'id'],
  },
  {
    id: 'lx-ch10-c-031',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Set a Bit Atomically',
    prompt: `Use the atomic bitops to manage flags in an unsigned long. Given static unsigned long dev_flags, write void mark_busy(void) that atomically sets bit 0 with set_bit, and int is_busy(void) that tests bit 0 with test_bit (returning nonzero if set). Define BUSY_BIT as 0.`,
    hints: [
      'set_bit(nr, addr) atomically sets a bit in a bitmap word.',
      'test_bit(nr, addr) reads a bit; it does not need to be atomic for a plain read.',
    ],
    solution: `#include <linux/bitops.h>

#define BUSY_BIT 0
static unsigned long dev_flags;

void mark_busy(void)
{
    set_bit(BUSY_BIT, &dev_flags);
}

int is_busy(void)
{
    return test_bit(BUSY_BIT, &dev_flags);
}`,
    starter: `#include <linux/bitops.h>

#define BUSY_BIT 0
static unsigned long dev_flags;

void mark_busy(void)
{
    // TODO: atomically set BUSY_BIT
}

int is_busy(void)
{
    // TODO: return whether BUSY_BIT is set
    return 0;
}`,
    tags: ['kernel', 'atomic', 'bitops'],
  },
  {
    id: 'lx-ch10-c-032',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Test-and-Set a Lock Flag',
    prompt: `Implement a simple one-shot guard with bitops. Given static unsigned long guard, write int try_enter(void) using test_and_set_bit on bit 0: it returns 0 if THIS caller set the bit (was previously clear, i.e. entry granted), or -EBUSY if it was already set. Also write void leave(void) that clears the bit with clear_bit.`,
    hints: [
      'test_and_set_bit returns the OLD value of the bit, atomically.',
      'Old value 0 means you won the race and now own the bit.',
    ],
    solution: `#include <linux/bitops.h>
#include <linux/errno.h>

static unsigned long guard;

int try_enter(void)
{
    if (test_and_set_bit(0, &guard))
        return -EBUSY;
    return 0;
}

void leave(void)
{
    clear_bit(0, &guard);
}`,
    starter: `#include <linux/bitops.h>
#include <linux/errno.h>

static unsigned long guard;

int try_enter(void)
{
    // TODO: test_and_set_bit(0); 0 if we won, -EBUSY if already set
    return 0;
}

void leave(void)
{
    // TODO: clear bit 0
}`,
    tags: ['kernel', 'atomic', 'bitops'],
  },
  {
    id: 'lx-ch10-c-033',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Per-CPU Spinlock-Protected Struct',
    prompt: `Combine per-CPU storage with a spinlock per instance. Define struct cpu_stats { spinlock_t lock; u64 bytes; }; and a static DEFINE_PER_CPU(struct cpu_stats, stats). Write void stats_init_cpu(int cpu) that initializes that CPU's lock with spin_lock_init, and void add_bytes(u64 n) that locks the CURRENT cpu's stats, adds n to bytes, and unlocks. Use this_cpu_ptr to get the current instance and disable preemption appropriately.`,
    hints: [
      'this_cpu_ptr(&stats) returns a pointer to the current CPU instance.',
      'Disable preemption while using a this_cpu_ptr that you then lock; get_cpu_ptr/put_cpu_ptr do this for you.',
      'per_cpu_ptr(&stats, cpu) reaches a specific CPU instance for init.',
    ],
    solution: `#include <linux/percpu.h>
#include <linux/spinlock.h>
#include <linux/types.h>

struct cpu_stats {
    spinlock_t lock;
    u64 bytes;
};

static DEFINE_PER_CPU(struct cpu_stats, stats);

void stats_init_cpu(int cpu)
{
    spin_lock_init(&per_cpu_ptr(&stats, cpu)->lock);
}

void add_bytes(u64 n)
{
    struct cpu_stats *s = get_cpu_ptr(&stats);

    spin_lock(&s->lock);
    s->bytes += n;
    spin_unlock(&s->lock);
    put_cpu_ptr(&stats);
}`,
    starter: `#include <linux/percpu.h>
#include <linux/spinlock.h>
#include <linux/types.h>

struct cpu_stats {
    spinlock_t lock;
    u64 bytes;
};

static DEFINE_PER_CPU(struct cpu_stats, stats);

void stats_init_cpu(int cpu)
{
    // TODO: init the lock of the given CPU's stats
}

void add_bytes(u64 n)
{
    // TODO: lock the current CPU's stats, add n, unlock (mind preemption)
}`,
    tags: ['kernel', 'percpu', 'spinlock'],
  },
  {
    id: 'lx-ch10-c-034',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Choosing IRQ-Safe Locking for a Shared Counter',
    prompt: `A counter static u64 irq_total is incremented both from a hardware interrupt handler and from a process-context function. Implement the IRQ handler body irq_inc(void) and the process-context proc_inc(void). The handler runs with IRQs already off on its CPU, so it should use plain spin_lock/spin_unlock; the process-context path must use spin_lock_irqsave/spin_unlock_irqrestore. Both use static DEFINE_SPINLOCK(irq_lock).`,
    hints: [
      'Inside a hard IRQ handler, local interrupts are already disabled, so spin_lock is sufficient.',
      'Process context sharing data with an IRQ handler must disable IRQs while holding the lock, hence irqsave.',
      'If process context used plain spin_lock, an IRQ could fire and deadlock trying to take the same lock.',
    ],
    solution: `#include <linux/spinlock.h>
#include <linux/types.h>

static DEFINE_SPINLOCK(irq_lock);
static u64 irq_total;

void irq_inc(void)
{
    spin_lock(&irq_lock);
    irq_total++;
    spin_unlock(&irq_lock);
}

void proc_inc(void)
{
    unsigned long flags;

    spin_lock_irqsave(&irq_lock, flags);
    irq_total++;
    spin_unlock_irqrestore(&irq_lock, flags);
}`,
    starter: `#include <linux/spinlock.h>
#include <linux/types.h>

static DEFINE_SPINLOCK(irq_lock);
static u64 irq_total;

void irq_inc(void)
{
    // TODO: plain spin_lock is fine inside a hard IRQ handler
}

void proc_inc(void)
{
    // TODO: process context must use irqsave/irqrestore
}`,
    tags: ['kernel', 'spinlock', 'irqsave'],
  },
  {
    id: 'lx-ch10-c-035',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Picking the Right Lock by Context',
    prompt: `Implement three small operations on the SAME shared list, each choosing the correct primitive. (1) cfg_write() runs only in process context and may call a sleeping helper while updating: use static DEFINE_MUTEX(cfg_mtx). (2) fast_count() runs in both process and softirq context, never sleeps, very short: use static DEFINE_SPINLOCK(cnt_lock) with bottom-half protection. (3) hit() is a pure counter bumped from anywhere including hard IRQ: use a static atomic_t hits. Provide all three function bodies; sleeping_helper() is declared elsewhere.`,
    hints: [
      'Sleeping inside the critical section forces a mutex (process context only).',
      'Sharing with a softirq but never sleeping points to spin_lock_bh.',
      'A lone counter bumped from any context, including IRQ, is best served by atomic_t with no lock at all.',
    ],
    solution: `#include <linux/mutex.h>
#include <linux/spinlock.h>
#include <linux/atomic.h>

static DEFINE_MUTEX(cfg_mtx);
static DEFINE_SPINLOCK(cnt_lock);
static atomic_t hits = ATOMIC_INIT(0);
static int the_count;

void sleeping_helper(void);

void cfg_write(void)
{
    mutex_lock(&cfg_mtx);
    sleeping_helper();
    mutex_unlock(&cfg_mtx);
}

void fast_count(void)
{
    spin_lock_bh(&cnt_lock);
    the_count++;
    spin_unlock_bh(&cnt_lock);
}

void hit(void)
{
    atomic_inc(&hits);
}`,
    starter: `#include <linux/mutex.h>
#include <linux/spinlock.h>
#include <linux/atomic.h>

static DEFINE_MUTEX(cfg_mtx);
static DEFINE_SPINLOCK(cnt_lock);
static atomic_t hits = ATOMIC_INIT(0);
static int the_count;

void sleeping_helper(void);

void cfg_write(void)
{
    // TODO: mutex because we sleep in the critical section
}

void fast_count(void)
{
    // TODO: spin_lock_bh because shared with softirq, no sleeping
}

void hit(void)
{
    // TODO: atomic counter, usable from any context
}`,
    tags: ['kernel', 'locking', 'context'],
  },
]

export default problems
