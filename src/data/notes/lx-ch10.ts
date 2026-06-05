import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-10',
  track: 'linux',
  chapter: 10,
  title: 'Concurrency & Locking',
  summary: `The Linux kernel is massively concurrent: many CPUs run kernel code at once, interrupts preempt threads at arbitrary points, and a preemptible kernel can switch tasks mid-function. Whenever two execution contexts touch the same data and at least one writes, you have a potential race, and an unsynchronized race in the kernel can corrupt memory for the whole machine. This chapter builds up the kernel's locking toolbox from atomics and spinlocks through mutexes, semaphores, reader-writer locks, seqlocks, RCU, and per-CPU data, and teaches the single most important skill: choosing the right primitive for the context you are running in. Get this wrong and you get either silent data corruption or a hung CPU.`,
  sections: [
    {
      heading: 'Race conditions and critical sections',
      body: `A **race condition** is a bug where the correctness of the result depends on the unpredictable timing of two or more execution contexts that access shared data. The kernel runs concurrent contexts in several ways at once: real parallelism across multiple CPUs (SMP), interrupt handlers that preempt whatever was running on a CPU, softirqs and tasklets, and kernel preemption that can deschedule a thread in the middle of an operation. Any of these can interleave with another and trample shared state.

The classic example is a read-modify-write that looks atomic in C source but is not atomic in machine code. The single statement counter plus plus compiles to roughly three instructions: load the value into a register, increment the register, store it back. If two CPUs execute that sequence on the same counter at overlapping times, both can load the same old value, both increment to the same new value, and one increment is silently lost. The variable went up by one when it should have gone up by two.

### The critical section
The region of code that accesses the shared resource and must not be interrupted by a conflicting access is called the **critical section**. The job of every locking primitive in this chapter is the same: guarantee **mutual exclusion** so that at most one context is inside the critical section for a given piece of data at a time, or more precisely, that the interleavings which would corrupt the data cannot happen.

### Why you cannot just be careful
You cannot reason your way out of races by writing clever lock-free code in most cases. Modern CPUs and compilers reorder memory operations for speed, caches mean two CPUs can briefly disagree about a value, and the exact interleavings are not reproducible, so a race might fire once a week in production and never in your test. The disciplined answer is to identify every piece of shared, mutable data, decide which lock protects it, and document that mapping. **Locks protect data, not code.** A reviewer should be able to point at a field and name the lock that guards it.`,
      code: [
        {
          lang: 'c',
          src: `/* The race: counter++ is NOT one atomic operation. */

/* What you wrote: */
shared_counter++;

/* What the CPU actually does (pseudo-asm): */
reg = load(shared_counter);   /* CPU A and CPU B both read, say, 7 */
reg = reg + 1;                /* both compute 8                    */
store(shared_counter, reg);   /* both write 8 -> one update lost   */

/* Two CPUs, two increments, but the counter only went 7 -> 8.
 * The fix is to make the whole load-modify-store mutually exclusive
 * (a lock) or genuinely atomic (atomic_inc, below). */`
        }
      ]
    },
    {
      heading: 'atomic_t: the lightest tool',
      body: `When the shared data is a single integer or a single bit, you usually do not need a lock at all. The kernel provides **atomic_t**, an opaque integer type whose operations the hardware guarantees to be indivisible. Because they compile to special atomic CPU instructions (or a locked bus cycle), an atomic_inc cannot be split into the load-modify-store sequence that loses updates. The opaque type is deliberate: it stops you from accidentally manipulating the value with ordinary arithmetic, which would bypass the atomicity.

You initialize with ATOMIC_INIT, read with atomic_read, set with atomic_set, and modify with operations like atomic_inc, atomic_dec, and atomic_add. Crucially there are operations that combine a modification with a test in one atomic step, such as atomic_dec_and_test, which decrements and returns true if the result is zero. This is exactly what reference counting needs: you cannot safely do an atomic_dec followed by a separate atomic_read, because another CPU could change the value in between.

### A subtlety: atomic does not mean ordered by default
A common trap is assuming atomics provide full memory ordering. The plain value-returning operations on most architectures do imply ordering, but operations that do not return a value, like atomic_inc, give you atomicity without necessarily ordering surrounding memory accesses. When you use an atomic flag to publish data that other CPUs will read, you may need explicit memory barriers (smp_mb and friends) or the acquire/release variants such as atomic_fetch_add_release. For ordinary counters this does not matter; for hand-rolled synchronization it absolutely does, which is one reason hand-rolled lock-free code is discouraged.

### refcount_t
For reference counts specifically, prefer **refcount_t** over a bare atomic_t. It behaves like an atomic counter but adds saturation and underflow detection: it refuses to wrap a count past zero or overflow it, turning a class of use-after-free and refcount-overflow security bugs into a loud warning instead of silent corruption. Modern kernel code uses refcount_t for object lifetimes and reserves atomic_t for statistics and flags.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/atomic.h>
#include <linux/refcount.h>

static atomic_t packets = ATOMIC_INIT(0);

void on_packet(void)
{
        atomic_inc(&packets);          /* indivisible; no lost updates */
}

int read_packets(void)
{
        return atomic_read(&packets);  /* single-word atomic read      */
}

/* Reference counting: decrement-and-test in ONE atomic step. */
struct widget {
        refcount_t ref;                /* prefer refcount_t for lifetimes */
        /* ... */
};

void widget_put(struct widget *w)
{
        /* refcount_dec_and_test returns true exactly once, when the
         * count hits zero, so only one caller frees the object. */
        if (refcount_dec_and_test(&w->ref))
                kfree(w);
}`
        }
      ]
    },
    {
      heading: 'Spinlocks and spin_lock_irqsave',
      body: `A **spinlock** is the kernel's basic mutual-exclusion lock for short critical sections. When a CPU tries to take a spinlock that is already held, it does not sleep; it **busy-waits**, spinning in a tight loop until the lock becomes free. Because waiting wastes CPU cycles, spinlocks are only appropriate for critical sections that are very short and that never sleep.

The reason spinlocks exist alongside mutexes is **context**. Some kernel code runs in **atomic context**, meaning it cannot sleep: interrupt handlers, softirqs, and any code that holds a spinlock. In those contexts there is no task to put to sleep and no scheduler call you are allowed to make, so a sleeping lock is illegal. A spinlock is the only kind of lock you can take there.

### Disabling interrupts: the deadlock you must prevent
Consider a spinlock that protects data touched by both ordinary kernel code and an interrupt handler on the same CPU. Suppose the kernel code takes the lock, and then, before releasing it, an interrupt fires on that same CPU. The interrupt handler tries to take the same lock. But the lock is held by the very thread the interrupt preempted, which cannot run again to release it until the handler returns. The handler spins forever waiting for a lock that can never be released. The CPU is deadlocked against itself.

The fix is to disable interrupts on the local CPU while holding the lock, using **spin_lock_irqsave**. The irqsave variant saves the current interrupt state into a flags variable, disables local interrupts, and takes the lock, all together; spin_unlock_irqrestore takes the lock back, then restores interrupts to exactly the saved state. Saving and restoring (rather than blindly re-enabling) matters because the caller may already have had interrupts disabled, and you must not re-enable them out from under that caller.

### Choosing the right spinlock variant
- Use plain **spin_lock / spin_unlock** when the data is never touched from any interrupt or softirq, only from process context, and you are sure of it.
- Use **spin_lock_irqsave / spin_unlock_irqrestore** when the lock can be taken from hardirq context, which is the safe default when in doubt.
- Use **spin_lock_bh / spin_unlock_bh** when the lock is shared with softirqs or tasklets but not hardirqs; bh disables bottom halves instead of all interrupts.

Note that on a uniprocessor non-preemptible kernel, spinlocks compile away almost entirely, leaving only the interrupt and preemption disabling. Their job there is not SMP exclusion but preventing the interrupt-against-self and preemption races above.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/spinlock.h>

static DEFINE_SPINLOCK(my_lock);
static struct list_head my_list;

/* Process-context-only data: plain spin_lock is enough. */
void add_item_process(struct item *it)
{
        spin_lock(&my_lock);
        list_add(&it->node, &my_list);   /* short, non-sleeping */
        spin_unlock(&my_lock);
}

/* Data ALSO touched from an interrupt handler: must mask IRQs
 * on this CPU to avoid deadlocking against ourselves. */
void add_item_irqsafe(struct item *it)
{
        unsigned long flags;

        spin_lock_irqsave(&my_lock, flags);   /* save+disable IRQs, lock */
        list_add(&it->node, &my_list);
        spin_unlock_irqrestore(&my_lock, flags); /* unlock, restore state */
}`
        }
      ]
    },
    {
      heading: 'Why you cannot sleep holding a spinlock',
      body: `This is the single most important rule of kernel locking, and it deserves its own section because violating it is one of the most common and most catastrophic mistakes new kernel contributors make. **You must never sleep while holding a spinlock.**

### What sleeping means and why it is fatal here
To "sleep" or "block" means to call schedule and let the CPU run a different task while you wait for something: memory, I/O, a mutex, anything. Taking a spinlock disables kernel preemption (and, with the irq variants, interrupts) on that CPU. Now imagine you sleep while holding the lock. Three things go wrong, any one of which is a disaster.

First, **the lock is still held the entire time you are asleep.** A spinlock is meant for microseconds, but sleeping can last milliseconds or longer. Every other CPU that wants that lock is spinning, burning 100 percent CPU doing nothing, for the whole duration.

Second, **deadlock.** Suppose another task is scheduled onto your CPU while you sleep, and it tries to take the same spinlock. It spins, but with preemption disabled it can never be preempted to let your task resume and release the lock. The CPU wedges.

Third, **you may have disabled interrupts**, and sleeping with interrupts disabled can hang the machine entirely, because the scheduler and timer rely on interrupts.

### What counts as "might sleep"
The danger is that many ordinary-looking calls can sleep internally, so you cannot tell by reading the call site. The big ones to memorize:
- **kmalloc(..., GFP_KERNEL)** can sleep to reclaim memory. Inside a spinlock you must use **GFP_ATOMIC**, which never sleeps but can fail.
- **copy_to_user / copy_from_user** can sleep on a page fault.
- **mutex_lock**, **down** (semaphore), and any other sleeping lock.
- **vmalloc**, most allocations, and many I/O and wait calls.

### How the kernel catches you
The kernel can detect this for you. If you build with CONFIG_DEBUG_ATOMIC_SLEEP enabled, the kernel checks at runtime whether you call a known-sleeping function in atomic context and prints a loud "BUG: sleeping function called from invalid context" with a stack trace. Functions that may sleep are conventionally annotated with might_sleep at their top, which trips that check. Enabling this option while developing is strongly recommended; it turns a rare, hard-to-reproduce hang into an immediate, obvious report.`,
      code: [
        {
          lang: 'c',
          src: `/* WRONG: kmalloc with GFP_KERNEL can sleep, but we hold a spinlock. */
spin_lock(&my_lock);
p = kmalloc(size, GFP_KERNEL);   /* BUG: sleeping in atomic context */
spin_unlock(&my_lock);

/* OPTION A: use a non-sleeping allocation inside the lock. */
spin_lock(&my_lock);
p = kmalloc(size, GFP_ATOMIC);   /* never sleeps; may return NULL  */
spin_unlock(&my_lock);

/* OPTION B (usually better): allocate BEFORE taking the lock,
 * so the critical section stays tiny and never sleeps. */
p = kmalloc(size, GFP_KERNEL);   /* fine: no lock held yet */
if (!p)
        return -ENOMEM;
spin_lock(&my_lock);
attach(p);                       /* short, non-sleeping work */
spin_unlock(&my_lock);

/* Mark a function that may sleep so DEBUG_ATOMIC_SLEEP can catch
 * callers who invoke it from atomic context. */
void slow_path(void)
{
        might_sleep();
        /* ... may call schedule() ... */
}`
        }
      ]
    },
    {
      heading: 'Mutexes and semaphores: the sleeping locks',
      body: `When a critical section can be long, or must call functions that sleep (allocate memory with GFP_KERNEL, do I/O, copy to user space), a spinlock is wrong. You want a **sleeping lock**: if the lock is contended, the waiting task is put to sleep and the CPU goes off to run other work, then the task is woken when the lock is free. The modern, preferred sleeping lock in Linux is the **mutex**.

### Mutex semantics and rules
A struct mutex enforces strict mutual exclusion: exactly one task holds it at a time. You take it with mutex_lock and release it with mutex_unlock. It can only be used from **process context**, because only a task can be put to sleep; you can never take a mutex in an interrupt handler. The kernel mutex carries several invariants that the lock debugging code (CONFIG_DEBUG_MUTEXES, lockdep) actively enforces:
- The task that locked a mutex must be the one that unlocks it. Ownership is tracked; you cannot lock in one thread and unlock in another. This is a key difference from a semaphore.
- A task must not exit while holding a mutex, and must not recursively lock the same mutex.
- You cannot take a mutex in any context that cannot sleep.

Because the owner is known, the mutex implementation can do **optimistic spinning**: if the lock holder is currently running on another CPU and likely to release soon, a waiter spins briefly instead of immediately sleeping, which is faster than a sleep/wake cycle for short waits. This makes the modern mutex often as fast as a spinlock for the uncontended and lightly contended cases, while still sleeping under real contention. mutex_lock_interruptible lets a waiter be woken by a signal and return an error, which is the right choice on user-facing paths so a process can be killed while waiting.

### Semaphores
A **semaphore** (struct semaphore) is the older, more general sleeping primitive: a counter with down (decrement, sleep if the count would go negative) and up (increment, wake a waiter). A counting semaphore initialized to N lets up to N holders in at once, which is useful for limiting concurrent access to a pool of resources rather than enforcing strict one-at-a-time exclusion. A semaphore initialized to 1 is a **binary semaphore** and acts like a lock.

So why prefer mutexes? A semaphore used as a lock has no concept of an owner, so it permits patterns the mutex forbids: locking in one context and unlocking in another, which is occasionally needed but usually a sign of a bug. Because the mutex tracks ownership it enables the optimistic spinning above, better debugging, and priority-inheritance support. The kernel community moved most lock-like uses from semaphores to mutexes years ago. **Rule of thumb: use a mutex for mutual exclusion; reach for a counting semaphore only when you genuinely need to allow N concurrent holders.**`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/mutex.h>
#include <linux/semaphore.h>

static DEFINE_MUTEX(config_lock);

int update_config(struct cfg *c, const void __user *src, size_t n)
{
        /* Allowed to sleep here: process context, can do GFP_KERNEL,
         * can fault on copy_from_user, can block on I/O. */
        if (mutex_lock_interruptible(&config_lock))
                return -EINTR;            /* woken by a signal */

        if (copy_from_user(&c->data, src, n)) {  /* may sleep on fault */
                mutex_unlock(&config_lock);
                return -EFAULT;
        }
        c->dirty = true;

        mutex_unlock(&config_lock);       /* same task must unlock */
        return 0;
}

/* Counting semaphore: allow at most 4 concurrent users of a pool. */
static struct semaphore pool_slots;
/* sema_init(&pool_slots, 4); somewhere in init */

void use_pool(void)
{
        down(&pool_slots);     /* sleeps if all 4 slots are taken */
        /* ... use one resource ... */
        up(&pool_slots);       /* release the slot, wake a waiter  */
}`
        }
      ]
    },
    {
      heading: 'Reader-writer locks and seqlocks',
      body: `Strict mutual exclusion is wasteful when most accesses only read the data. If readers never modify shared state, many of them can safely run at the same time; only writers need exclusivity. Several kernel primitives exploit this asymmetry.

### rwlock and rw_semaphore
A **reader-writer lock** allows either many concurrent readers or a single exclusive writer, but never both. The spinning version is rwlock_t with read_lock and write_lock; the sleeping version is **rw_semaphore** with down_read and down_write. Use the rw_semaphore when readers can hold the lock across operations that sleep, and the spinning rwlock for short atomic-context reads.

There is a real catch: ordinary reader-writer locks can **starve writers**. If readers keep arriving, the lock may never be free of readers, and a waiting writer can wait indefinitely. For this reason plain rwlock_t is somewhat discouraged in modern code; if the read side dominates so heavily that you reached for an rwlock, RCU (next section) is usually the better answer.

### seqlock: cheap reads, writer priority
A **seqlock** (seqlock_t) inverts the trade-off to favor writers and make readers extremely cheap. It pairs a spinlock for writers with a sequence counter. A writer increments the counter to an odd value before modifying the data and to an even value after. A reader does not take any lock at all: it reads the sequence number, reads the data optimistically, then reads the sequence number again. If the two sequence numbers differ, or the first was odd (a write was in progress), the reader simply **retries** the whole read.

The consequences are sharp and worth internalizing:
- Readers are lock-free and never block writers, so writers always get through quickly. This is ideal for data written rarely but read on hot paths, the canonical example being the kernel timekeeping code (jiffies, wall-clock time).
- A reader can run the read loop more than once, so the data it reads must be safe to read in a torn or transient state, and the reader must not have side effects on each pass. You cannot, for instance, follow a pointer that the writer might be freeing.
- seqlocks are best for small, self-contained data (a few scalars), not for traversing structures that a writer might be tearing down.

The reader side uses read_seqbegin and read_seqretry in a do-while loop; the writer side uses write_seqlock and write_sequnlock, which internally take the embedded spinlock (and you typically use the irqsave forms if writers run in interrupt context).`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/seqlock.h>

static seqlock_t time_lock = __SEQLOCK_UNLOCKED(time_lock);
static u64 seconds;
static u32 nanoseconds;

/* Writer: bump the sequence (odd), update, bump again (even). */
void set_time(u64 s, u32 ns)
{
        write_seqlock(&time_lock);
        seconds = s;
        nanoseconds = ns;
        write_sequnlock(&time_lock);
}

/* Reader: optimistic, lock-free, retry if a writer interfered. */
void get_time(u64 *s, u32 *ns)
{
        unsigned int seq;

        do {
                seq = read_seqbegin(&time_lock);
                *s  = seconds;        /* read both fields consistently */
                *ns = nanoseconds;
        } while (read_seqretry(&time_lock, seq));  /* retry on conflict */
}`
        }
      ]
    },
    {
      heading: 'RCU basics',
      body: `**Read-Copy-Update (RCU)** is the kernel's premier technique for data that is read constantly and modified rarely, such as routing tables, lists of devices, or security policy. Its defining property is that **readers pay essentially nothing**: no locks, no atomic operations, no cache-line bouncing between CPUs. That is what makes RCU scale to hundreds of cores where a shared lock would collapse.

### The core idea
Readers and writers coordinate without excluding each other. A reader marks its access with rcu_read_lock and rcu_read_unlock; on a non-preemptible kernel these are almost free (they mostly disable preemption). Inside that region the reader dereferences a shared pointer with rcu_dereference, which guarantees it sees a fully constructed object.

A writer never modifies an object in place where readers can see a half-updated state. Instead it follows **read, copy, update**: it makes a new copy with the changes, then atomically swaps the shared pointer to point at the new version using rcu_assign_pointer. New readers immediately see the new version; readers that started before the swap keep using the old version, which is still valid memory.

### The grace period: the clever part
The old version cannot be freed immediately, because pre-existing readers might still be looking at it. RCU solves this with a **grace period**. After publishing the new pointer, the writer waits until every CPU has passed through a **quiescent state**, a point where it definitely holds no RCU read-side references (for example, a context switch on a non-preempt kernel, since you cannot sleep inside an RCU read section). Once every CPU has been quiescent at least once, no reader can possibly still hold the old pointer, and it is safe to free. The writer waits with synchronize_rcu (which blocks, so it must run in process context) or schedules the free asynchronously with call_rcu, which invokes a callback after the grace period passes.

### What RCU is and is not
- RCU gives readers a consistent view without locking, and lets memory reclamation happen safely after readers drain. Updates are not free; RCU shines specifically when reads vastly outnumber writes.
- RCU does **not** synchronize writers against each other. If you have multiple writers you still need a normal lock (usually a spinlock or mutex) on the write side; RCU only handles the reader-versus-reclaim problem.
- You must never sleep inside a classic rcu_read_lock section (there is a separate SRCU variant if you must). Holding an RCU read lock is an atomic-context-like constraint.
- For lists, use the RCU-aware list helpers (list_add_rcu, list_del_rcu, list_for_each_entry_rcu), which insert the necessary memory barriers so readers never see a corrupt link.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/rcupdate.h>
#include <linux/slab.h>

struct config { int timeout; /* ... */ };
static struct config __rcu *cur_config;
static DEFINE_SPINLOCK(cfg_writer_lock);  /* serializes WRITERS only */

/* Reader: no lock, just a marked critical section. */
int read_timeout(void)
{
        struct config *c;
        int t;

        rcu_read_lock();
        c = rcu_dereference(cur_config);   /* safe published pointer */
        t = c->timeout;
        rcu_read_unlock();
        return t;                          /* old object stays valid */
}

/* Writer: copy, modify, publish, then reclaim after a grace period. */
void set_timeout(int t)
{
        struct config *old, *new;

        new = kmalloc(sizeof(*new), GFP_KERNEL);
        spin_lock(&cfg_writer_lock);
        old = rcu_dereference_protected(cur_config,
                                        lockdep_is_held(&cfg_writer_lock));
        *new = *old;                       /* copy */
        new->timeout = t;                  /* update the copy */
        rcu_assign_pointer(cur_config, new);  /* publish atomically */
        spin_unlock(&cfg_writer_lock);

        synchronize_rcu();                 /* wait out pre-existing readers */
        kfree(old);                        /* now safe to free */
}`
        }
      ]
    },
    {
      heading: 'Per-CPU variables: avoiding the lock entirely',
      body: `The fastest lock is the one you never take. If each CPU can keep its **own private copy** of a variable, then ordinary accesses need no synchronization at all, because no other CPU touches that copy. This is the idea behind **per-CPU variables**, used pervasively for statistics, counters, and caches throughout the kernel.

### How and why it works
You declare a per-CPU variable with DEFINE_PER_CPU. The kernel allocates one instance per CPU in a special area. When code accesses its per-CPU instance, it gets the copy belonging to the CPU it is currently running on. Because that copy is local, increments and reads of it are race-free against other CPUs by construction, with no lock and no atomic instruction. Beyond avoiding lock contention, this is great for cache behavior: each CPU writes only its own cache line, so there is no cache-line bouncing, which is often the real performance killer in SMP code.

### The one race you still have: preemption
There is a subtle trap. Even with no other CPU involved, your own task could be **preempted and rescheduled onto a different CPU** in the middle of a read-modify-write of "the current CPU's" copy. Then you would read CPU 3's copy, get preempted, resume on CPU 5, and write back to CPU 5's copy, corrupting both. So you must keep preemption disabled while you hold a pointer to the local instance. The accessor macros handle this for you:
- **this_cpu_inc**, **this_cpu_add**, and similar do the whole operation atomically with respect to preemption and interrupts on the local CPU. Prefer these.
- **get_cpu_var** disables preemption and gives you the local copy; you must pair it with **put_cpu_var** to re-enable preemption. The newer per_cpu_ptr plus get_cpu / put_cpu pattern is similar.

### Reading across CPUs
A single CPU never reads another CPU's copy on the fast path, but aggregation code (for example, summing a statistic for a report) does. To total a per-CPU counter you iterate every CPU with for_each_possible_cpu and read per_cpu(var, cpu) for each. That sum is inherently approximate on a live system, since other CPUs keep updating their copies while you read, which is fine for statistics but means per-CPU data is the wrong choice when you need an exact, instantaneously consistent global value.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/percpu.h>
#include <linux/cpumask.h>

/* One independent copy of this counter per CPU. */
static DEFINE_PER_CPU(unsigned long, irq_count);

/* Fast path: bump THIS cpu's copy, preempt/irq-safe, no lock. */
void note_irq(void)
{
        this_cpu_inc(irq_count);
}

/* Manual form: disable preemption while holding the local pointer. */
void note_irq_manual(void)
{
        unsigned long *p = get_cpu_var(irq_count);  /* preempt off */
        (*p)++;
        put_cpu_var(irq_count);                     /* preempt on  */
}

/* Aggregate across all CPUs (approximate on a live system). */
unsigned long total_irqs(void)
{
        unsigned long total = 0;
        int cpu;

        for_each_possible_cpu(cpu)
                total += per_cpu(irq_count, cpu);
        return total;
}`
        }
      ]
    },
    {
      heading: 'Choosing a lock by context',
      body: `Picking the wrong primitive is the central skill, so here is a decision procedure. Ask the questions in order; the first one that applies usually decides.

### 1. What context will take this lock?
This is the gate that overrides everything else. If the lock is ever taken in **interrupt or softirq context, or while already holding a spinlock**, you are in atomic context and cannot sleep. That rules out every sleeping lock (mutex, semaphore, rw_semaphore) and forces a spinlock or atomic. If the lock can be taken from a hardirq, you need the irqsave variant so you do not deadlock against an interrupt on your own CPU.

### 2. Does the critical section need to sleep?
If the code under the lock must allocate with GFP_KERNEL, copy to or from user space, wait on I/O, or call any might_sleep function, then a spinlock is impossible (you cannot sleep holding it) and you need a **mutex**. If it is short and does no sleeping work, a spinlock is fine and avoids a context switch.

### 3. Is the data just a counter or flag?
Then skip locks entirely: use **atomic_t** (or refcount_t for lifetimes). One word, one atomic instruction.

### 4. What is the read-to-write ratio?
- Roughly balanced, or writes common: a plain mutex or spinlock.
- Reads dominate, readers may sleep: rw_semaphore, but consider RCU first.
- Reads dominate overwhelmingly, data rarely changes: **RCU**, the gold standard for scalability. Writers still need their own lock.
- Tiny scalar data, written rarely, read on a hot path, readers have no side effects: a **seqlock**.

### 5. Can the data be per-CPU instead of shared?
If each CPU can own its slice (statistics, caches), use **per-CPU variables** and avoid synchronization altogether. This usually beats any lock for scalability.

### Habits that prevent bugs
- **Document which lock protects which data.** Locks protect data, not code. Write it in a comment next to the field.
- **Acquire multiple locks in a single global order** everywhere, to avoid the classic ABBA deadlock where two threads take two locks in opposite orders.
- **Keep critical sections short**, especially for spinlocks, both for performance and to reduce the window for deadlock.
- **Build with lockdep (CONFIG_PROVE_LOCKING) and CONFIG_DEBUG_ATOMIC_SLEEP during development.** Lockdep tracks lock acquisition orders across the whole kernel and reports a potential deadlock the first time an inconsistent order is observed, even if the deadlock did not actually happen. It catches in seconds what would otherwise be a once-a-month production hang. This is non-negotiable for anyone submitting locking code.`,
      code: [
        {
          lang: 'c',
          src: `/* A compact decision guide, in code-comment form:
 *
 *  Only a counter/flag?               -> atomic_t / refcount_t
 *  Taken from hardirq context?        -> spin_lock_irqsave
 *  Taken from softirq/tasklet only?   -> spin_lock_bh
 *  Atomic context, must not sleep?    -> spin_lock
 *  Long section, or it may sleep?     -> mutex_lock
 *  Need N concurrent holders?         -> counting semaphore
 *  Reads >> writes, sleeping readers? -> rw_semaphore (or RCU)
 *  Reads >>> writes, many CPUs?       -> RCU (+ writer lock)
 *  Tiny scalar, rare writes, hot?     -> seqlock
 *  Per-CPU stats / caches?            -> DEFINE_PER_CPU
 */

/* Whatever you choose, document the contract on the data: */
struct device_state {
        spinlock_t lock;   /* protects: status, queue, retries below */
        int status;
        struct list_head queue;
        int retries;
};`
        }
      ]
    }
  ],
  takeaways: [
    'A race condition is timing-dependent corruption of shared data; even counter++ is a non-atomic load-modify-store, so any unprotected shared write can lose updates across CPUs.',
    'Locks protect data, not code: for every piece of shared mutable state, decide and document which single lock guards it.',
    'Use atomic_t for lone counters and flags, and refcount_t for object lifetimes (it traps overflow and underflow); they avoid the cost of a full lock.',
    'Spinlocks busy-wait and are for very short, non-sleeping critical sections; use spin_lock_irqsave when the lock can also be taken from an interrupt handler to avoid deadlocking against yourself.',
    'Never sleep while holding a spinlock: not kmalloc(GFP_KERNEL), not copy_to_user, not a mutex; use GFP_ATOMIC or allocate before locking, and enable CONFIG_DEBUG_ATOMIC_SLEEP to catch violations.',
    'Mutexes are the preferred sleeping lock for long or sleep-capable critical sections, are process-context only, and require the same task to unlock; counting semaphores are only for allowing N concurrent holders.',
    'rwlocks let many readers or one writer (but can starve writers), and seqlocks make readers lock-free and retry-on-conflict, ideal for tiny data written rarely and read on hot paths like timekeeping.',
    'RCU gives readers near-zero-cost, lock-free access by publishing new copies and reclaiming old ones only after a grace period; it does not serialize writers, so writers still need their own lock.',
    'Per-CPU variables eliminate synchronization by giving each CPU a private copy; keep preemption disabled (use this_cpu_* or get/put_cpu_var) so a task does not migrate mid-update.',
    'Choose a lock by context first (can it sleep?), then by read/write ratio; build with lockdep (CONFIG_PROVE_LOCKING) to catch deadlock-prone lock ordering before it bites in production.'
  ],
  cheatsheet: [
    { label: 'atomic_inc(&v) / atomic_read(&v)', value: 'Indivisible single-word counter ops; no lock needed' },
    { label: 'refcount_dec_and_test(&r)', value: 'Atomic dec; true once at zero, with under/overflow checks' },
    { label: 'DEFINE_SPINLOCK(l) / spin_lock(&l)', value: 'Busy-wait lock for short, non-sleeping critical sections' },
    { label: 'spin_lock_irqsave(&l, flags)', value: 'Spinlock + save/disable local IRQs; for hardirq-shared data' },
    { label: 'spin_lock_bh(&l)', value: 'Spinlock that disables softirqs/tasklets, not hardirqs' },
    { label: 'GFP_ATOMIC vs GFP_KERNEL', value: 'ATOMIC never sleeps (use in atomic ctx); KERNEL may sleep' },
    { label: 'might_sleep()', value: 'Marks a function that may block; trips DEBUG_ATOMIC_SLEEP' },
    { label: 'DEFINE_MUTEX(m) / mutex_lock(&m)', value: 'Sleeping lock, process context only; same task must unlock' },
    { label: 'mutex_lock_interruptible(&m)', value: 'Sleeping lock that can be aborted by a signal (-EINTR)' },
    { label: 'down(&s) / up(&s)', value: 'Counting semaphore: allow up to N concurrent holders' },
    { label: 'down_read / down_write (rwsem)', value: 'Many readers or one writer; sleeping reader-writer lock' },
    { label: 'read_seqbegin / read_seqretry', value: 'Lock-free seqlock read loop; retry if a writer interfered' },
    { label: 'rcu_read_lock + rcu_dereference', value: 'Near-free reader access; pair with rcu_assign_pointer write' },
    { label: 'synchronize_rcu / call_rcu', value: 'Reclaim old RCU data after a grace period drains readers' },
    { label: 'DEFINE_PER_CPU(t, v) / this_cpu_inc(v)', value: 'Per-CPU private copy; no lock, keep preemption disabled' }
  ]
}

export default note
