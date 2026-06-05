import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-07',
  track: 'linux',
  chapter: 7,
  title: 'Kernel Data Structures',
  summary: `The Linux kernel ships its own carefully tuned, reusable data structures and you are expected to use them rather than rolling your own. This chapter walks through the everyday toolbox: intrusive doubly linked lists, the container_of trick that makes them possible, hash tables built from hlist, the lock-light kfifo ring buffer, augmented red-black trees, the idr/ida integer allocators, and bitmaps. Understanding these is not optional trivia: almost every subsystem you will read or patch is built out of them, and using them correctly is the difference between a clean contribution and a memory-corruption bug. Crucially, these patterns are also what the kernel's Rust abstractions wrap, so knowing the C version teaches you what the Rust types are actually guaranteeing.`,
  sections: [
    {
      heading: 'Intrusive vs. non-intrusive: the core design idea',
      body: `Before any specific structure, you need the one idea that explains all of them: the kernel's containers are **intrusive**. In a normal library list (think C++ std::list or Rust Vec), the container owns separate node objects that *point at* your data; the bookkeeping lives outside your struct. An intrusive container inverts this: the linking fields live *inside* your own struct, and the container is just a thread running through those embedded fields.

Why does the kernel do it this way? Three concrete reasons.

- **No allocation to link.** Adding an object to an intrusive list never allocates. The next and prev pointers already exist as fields of the object you are inserting, so insertion cannot fail and cannot block on the allocator. In a kernel, an insert that might fail or sleep is a serious liability; an intrusive insert is just a few pointer writes.
- **One object, many lists.** Because the link fields are just members, a single object can embed several of them and therefore belong to several independent lists or trees at once. A page, an inode, or a task routinely sits on multiple lists simultaneously, each via a different embedded member.
- **Cache friendliness and no double indirection.** The links sit next to the payload, so walking the list touches the data you actually care about, with no separate node allocation to chase.

The price you pay is a loss of type genericity: the list code works in terms of a bare embedded link, not in terms of your type, so there must be a way to get from a pointer to the embedded link back to a pointer to the whole object. That recovery trick is container_of, and it is the keystone of the entire chapter.

A second consequence worth internalizing now: **the container does not own the memory.** An intrusive list never frees your object. Lifetime and allocation are entirely your problem; the list only weaves pointers through objects you allocated and will free. This is exactly the manual-lifetime hazard that Rust's ownership model is designed to eliminate, which is why the Rust-for-Linux list abstractions are built around ownership wrappers rather than raw links.`,
      code: [
        {
          lang: 'c',
          src: `// Intrusive: the link lives INSIDE your struct.
struct task {
    int            pid;
    char           name[16];
    struct list_head run_list;   // embedded link; no separate node object
    struct list_head pid_list;   // a second link -> this task can be on TWO lists
};

// Non-intrusive (the "normal" library style) for contrast:
//   struct node { struct task *data; struct node *next; };  // node OWNS a pointer
// The kernel almost never does this in hot paths: it costs an allocation per link.`
        }
      ]
    },
    {
      heading: 'container_of: from a member back to the whole struct',
      body: `container_of is the macro that makes intrusive structures possible. Given a pointer to a member, the type of the containing struct, and the name of that member, it returns a pointer to the containing struct. It is defined in linux/container_of.h (historically linux/kernel.h).

The mechanics are pure pointer arithmetic done at compile time. The offsetof macro tells you how many bytes the member sits from the start of the struct. So container_of just subtracts that fixed offset from the member pointer and casts the result to the struct type. No runtime lookup, no metadata, no cost: it compiles down to an add or subtract of a constant.

There is one subtle but important detail in the real definition. It first assigns the incoming pointer to a temporary of the member's own type. That temporary exists purely so the compiler will emit a warning if you pass a pointer of the wrong type, the macro's tiny bit of type checking. Read the kernel definition and notice the typeof and the deliberate use of the member type for that temporary.

The reason container_of matters so much: every list_for_each_entry, every rbtree walk, every hlist traversal ultimately hands you a pointer to an embedded member and uses container_of (under the hood, via helper macros) to give you back a pointer to your real object. If you understand this one macro, the rest of the chapter is mostly naming conventions.

### Common pitfalls

- Passing the wrong member name. The macro cannot detect this if the wrong member happens to have a compatible type; you will silently compute a bad pointer. Double-check the third argument names the member you actually embedded.
- Forgetting that the member need not be at offset zero. People sometimes cast a list_head pointer directly to the struct type because "it is the first field." That breaks the moment someone reorders the struct. Always use container_of, never a bare cast.
- Using it on a NULL member pointer. container_of(NULL, ...) yields a bogus non-NULL pointer (NULL minus the offset), so always check for the end of a list before dereferencing.`,
      code: [
        {
          lang: 'c',
          src: `// The essence of the kernel definition (linux/container_of.h):
#define container_of(ptr, type, member) ({                       \\
    void *__mptr = (void *)(ptr);                                \\
    ((type *)(__mptr - offsetof(type, member))); })
// (The real macro adds a static_assert that ptr's type matches the member.)

// Using it: recover the task from a pointer to its embedded run_list.
struct task *task_from_link(struct list_head *link)
{
    return container_of(link, struct task, run_list);
    //                  ^link  ^struct      ^member name
}

// offsetof, which container_of relies on, is just:
//   ((size_t) &((type *)0)->member)   // byte distance of member from struct start`
        }
      ]
    },
    {
      heading: 'Doubly linked lists: list_head and the list API',
      body: `The kernel's canonical list is the circular **doubly linked list** declared in linux/list.h. The whole thing is built on one tiny struct, list_head, containing just a next and a prev pointer. You embed a list_head in your object to make it listable, and you use a *separate, standalone* list_head as the list's anchor or "head". Because the list is circular, the head's next points at the first element and its prev points at the last; an empty list is a head whose next and prev both point back at itself.

This circular, head-is-just-a-node design is what makes the operations branch-free and uniform. Insertion at the front, insertion at the back, and deletion are all the same handful of pointer swaps with no special-casing of the ends, because there are no real ends.

You initialize a list with LIST_HEAD for a static/global head, or INIT_LIST_HEAD at runtime for an embedded one. To add elements use list_add (push to the front, just after the head) or list_add_tail (push to the back, just before the head, giving FIFO order). Remove with list_del, which unlinks the node and, importantly, poisons its pointers so that any accidental reuse faults loudly rather than corrupting memory silently. Use list_del_init if you intend to re-add the node later, since it leaves the link in a valid empty state.

The payoff macros are the iterators. **list_for_each_entry** walks the list and on each iteration hands you a pointer to your *containing* struct directly (it calls container_of for you), so the loop body works with real typed objects, not bare links. There is a critical safety variant: if you might delete the current node during the walk, you must use **list_for_each_entry_safe**, which stashes the next pointer before running the body so that deleting the current node does not corrupt the iteration.

### Common pitfalls

- Deleting during a plain list_for_each_entry. After list_del the node's next is poisoned, so the loop dereferences poison and crashes. Use the _safe variant whenever the body can remove the current entry.
- Confusing the head with an entry. The head is a bare list_head that is not embedded in any of your objects; never run container_of on the head pointer.
- Forgetting locking. The list macros do zero synchronization. Concurrent add/del needs a spinlock, a mutex, or RCU (use the _rcu variants and rcu_read_lock for lockless readers).
- Reusing a node still on a list. Always list_del before freeing or re-adding, or you leave dangling links into freed memory.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/list.h>

struct task {
    int pid;
    struct list_head run_list;   // embedded link
};

static LIST_HEAD(run_queue);     // declares + initializes a standalone head

void enqueue(struct task *t)
{
    list_add_tail(&t->run_list, &run_queue);  // FIFO: insert before the head
}

void drain(void)
{
    struct task *t, *tmp;

    // _safe: needed because we delete the current node inside the loop.
    list_for_each_entry_safe(t, tmp, &run_queue, run_list) {
        pr_info("running pid %d\\n", t->pid);
        list_del(&t->run_list);   // unlink + poison this node's pointers
        kfree(t);                 // the LIST never owns memory; we free it
    }
}

// Read-only walk: list_for_each_entry calls container_of for you.
struct task *find_pid(int pid)
{
    struct task *t;
    list_for_each_entry(t, &run_queue, run_list)
        if (t->pid == pid)
            return t;
    return NULL;
}`
        }
      ]
    },
    {
      heading: 'hlist: the slimmer list for hash tables',
      body: `Hash tables are the kernel's go-to associative structure, and they are built from a list variant called **hlist**, also in linux/list.h. The motivation is memory. A hash table is an array of buckets, and most buckets are empty most of the time, so the per-bucket head needs to be as small as possible. A regular list_head head is two pointers; an hlist head, hlist_node, is one. With potentially millions of buckets, halving the head size is a real saving.

To achieve a single-pointer head while keeping O(1) deletion from the middle, hlist uses an asymmetric trick. Each node has a next pointer and a **pprev** pointer, but pprev is a pointer-to-a-pointer: it points at the previous node's next field (or at the bucket head's first field), not at the previous node itself. This is what lets a node remove itself in O(1) without a back-pointer to a full node and without special-casing the first element: you just write *pprev to skip yourself. The head, meanwhile, only needs the single first pointer.

The API mirrors the regular list: hlist_add_head to insert at the front of a bucket, hlist_del to remove, and hlist_for_each_entry to iterate a bucket, again recovering your containing struct via container_of. Modern kernels also give you a ready-made fixed-size hash table in linux/hashtable.h: DECLARE_HASHTABLE declares an array of hlist heads, hash_add inserts using a key you hash, and hash_for_each_possible walks just the one bucket a key maps to. For dynamically sized hashing under heavy concurrency, look at rhashtable, the resizable, RCU-friendly hash table, but the hlist-based fixed table is what you will meet first.

### Common pitfalls

- Assuming hlist nodes look like list nodes. The pprev pointer-to-pointer confuses people debugging in gdb; remember it points at the previous next slot, not at a node.
- Iterating the whole table when you only need one bucket. After hashing your key, use hash_for_each_possible to scan a single bucket; you still must compare keys because hashing has collisions.
- Skipping locking or RCU. Like list_head, hlist does no synchronization; readers and writers must coordinate (the _rcu variants exist for lockless lookup).`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/hashtable.h>

struct user {
    int   id;
    char  name[16];
    struct hlist_node node;   // embedded hlist link (one-pointer head per bucket)
};

// A fixed table with 2^4 = 16 buckets, declared + zeroed.
static DEFINE_HASHTABLE(users, 4);

void user_add(struct user *u)
{
    hash_add(users, &u->node, u->id);   // key u->id is hashed to a bucket
}

struct user *user_find(int id)
{
    struct user *u;
    // Walk ONLY the bucket id hashes to; still compare keys (collisions!).
    hash_for_each_possible(users, u, node, id)
        if (u->id == id)
            return u;
    return NULL;
}

void user_remove(struct user *u)
{
    hash_del(&u->node);   // O(1): rewrites *pprev to splice out this node
}`
        }
      ]
    },
    {
      heading: 'kfifo: a lock-free single-producer/single-consumer ring buffer',
      body: `kfifo, in linux/kfifo.h, is the kernel's **ring buffer** (circular FIFO queue). It is the right tool whenever one part of the code produces data and another consumes it: bytes from an interrupt handler to a thread, events into a queue, audio or sensor samples streaming through. You enqueue at the tail with kfifo_in and dequeue from the head with kfifo_out; internally it is a fixed-size array with an in index and an out index that wrap around.

Two design choices make kfifo special. First, the capacity is **rounded up to a power of two**, so the wrap-around is a cheap bitwise AND with a mask instead of a modulo. Second, and the reason it is famous, **a single-producer, single-consumer kfifo needs no lock**. The producer only ever advances the in index and the consumer only ever advances the out index; with appropriate memory barriers (which kfifo provides internally) the two never write the same field, so they can run concurrently on different CPUs with zero locking. That is a genuine lock-free fast path, which matters enormously in interrupt context where you cannot sleep and want to minimize contention.

The lock-free guarantee holds *only* for one producer and one consumer. The moment you have multiple producers or multiple consumers, you must wrap access in your own spinlock; the kernel provides spinlocked variants (the _spinlocked helpers) precisely for that case. kfifo records counts, never blocks, and kfifo_in returns how much it actually copied: if the buffer is full it copies less than requested or nothing, so you must check the return value rather than assume the data went in.

### Common pitfalls

- Assuming lock-free means thread-safe for any number of threads. It is safe ONLY for exactly one producer and one consumer. More than one of either requires external locking.
- Ignoring the return value of kfifo_in. On a full buffer it copies a partial amount or zero; treating it as always-succeeds silently drops data.
- Expecting it to block. kfifo never sleeps or waits; if you need blocking behavior, pair it with a wait queue and check kfifo_is_empty / kfifo_is_full yourself.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/kfifo.h>

// Declare + embed a typed fifo of 1024 ints (rounded up to a power of two).
static DECLARE_KFIFO(events, int, 1024);

void producer(int value)
{
    // Returns number of elements actually queued; 0 means the fifo was full.
    if (!kfifo_put(&events, value))
        pr_warn("event fifo full, dropping %d\\n", value);
}

void consumer(void)
{
    int value;
    // kfifo_get pulls one element; returns 0 when empty.
    while (kfifo_get(&events, &value))
        pr_info("got event %d\\n", value);
}

// Bulk copy form; check the count it returns, it may be partial when full.
void producer_bulk(int *buf, unsigned int n)
{
    unsigned int copied = kfifo_in(&events, buf, n);
    if (copied < n)
        pr_warn("dropped %u events\\n", n - copied);
}`
        }
      ]
    },
    {
      heading: 'Red-black trees: ordered data with guaranteed log-n operations',
      body: `When you need elements kept in sorted order with fast lookup, insert, and delete, the kernel reaches for a **red-black tree** (rbtree) from linux/rbtree.h. A red-black tree is a self-balancing binary search tree: by coloring nodes red or black and enforcing a few invariants on every insert and delete, it keeps the tree height within a constant factor of log n, so all operations are O(log n) in the worst case, never degenerating to a linked list the way a naive BST can.

rbtree is intrusive like everything else here: you embed a struct rb_node in your object and the tree is anchored by a struct rb_root. But there is a deliberate twist compared to lists, the **search and insert are not done for you**. The kernel cannot know how to compare two of your objects, so you write the comparison logic yourself by walking down from the root, going left or right based on your key, until you find the node or reach an empty slot. Then you call rb_link_node to attach the new node and rb_insert_color to rebalance. This split (you do the search, the kernel does the rebalancing) is the single most important thing to understand about using rbtrees.

Once a node is in the tree, rb_erase removes and rebalances. To iterate in sorted order, rb_first gives the smallest node and rb_next steps to the successor; there are also rb_last and rb_prev. The kernel additionally offers *augmented* rbtrees, where each node caches extra summary data about its subtree (the classic example is an interval tree that tracks the maximum endpoint in each subtree to answer overlap queries quickly); the augmentation callbacks keep that cached data correct through rotations.

Choose an rbtree when you need ordering or range queries and the set changes over time. If you only need exact-match lookup and do not care about order, a hash table is usually faster (O(1) average vs O(log n)). If the data is mostly static, a sorted array with binary search may beat a tree on cache behavior.

### Common pitfalls

- Forgetting rb_insert_color after rb_link_node. Linking attaches the node but does not rebalance or recolor; skip the color step and the tree's invariants break and lookups go wrong.
- An inconsistent or non-total comparison. If your compare function is not a strict, consistent ordering you will get duplicate or lost entries; the BST property must hold for every node.
- Modifying a key in place. Changing the field you sort on while the node is in the tree corrupts ordering. Erase the node, change the key, then re-insert.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/rbtree.h>

struct item {
    unsigned long  key;
    struct rb_node node;     // embedded tree link
};

static struct rb_root tree = RB_ROOT;

// YOU write the search + link; the kernel only rebalances.
int item_insert(struct item *new)
{
    struct rb_node **link = &tree.rb_node, *parent = NULL;

    while (*link) {
        struct item *cur = container_of(*link, struct item, node);
        parent = *link;
        if (new->key < cur->key)
            link = &(*link)->rb_left;
        else if (new->key > cur->key)
            link = &(*link)->rb_right;
        else
            return -EEXIST;          // duplicate key
    }
    rb_link_node(&new->node, parent, link);  // attach into the empty slot
    rb_insert_color(&new->node, &tree);      // REQUIRED: rebalance + recolor
    return 0;
}

struct item *item_find(unsigned long key)
{
    struct rb_node *n = tree.rb_node;
    while (n) {
        struct item *cur = container_of(n, struct item, node);
        if (key < cur->key)       n = n->rb_left;
        else if (key > cur->key)  n = n->rb_right;
        else                      return cur;   // exact match
    }
    return NULL;
}

void item_remove(struct item *it)
{
    rb_erase(&it->node, &tree);   // unlink + rebalance
}`
        }
      ]
    },
    {
      heading: 'idr and ida: allocating small integer IDs',
      body: `A recurring kernel need is to hand out small, unique integer IDs and later map them back to objects: process IDs, file descriptors, device minor numbers, IPC identifiers. The naive approaches are bad. A plain counter that only increments will eventually overflow and cannot reuse freed IDs; a bitmap of every possible ID wastes memory when IDs are sparse. The kernel's answer is **idr** and its sibling **ida**, in linux/idr.h.

**idr** (ID-to-pointer) maps an integer ID to a pointer. You ask it to allocate the next free ID within a range, and it associates that ID with a pointer you supply; later you look the pointer up by ID, or remove the mapping. Internally it is built on a radix tree (the xarray in modern kernels), so allocation, lookup, and removal are all efficient even when IDs are large and sparse, and it reuses freed IDs so the space stays compact. Use idr when you need to store and retrieve an object by its ID.

**ida** (ID allocator) is the lighter cousin: it allocates and frees IDs but does *not* store a pointer. It is essentially a clever, memory-efficient resizable bitmap of which IDs are in use. Reach for ida when you only need to reserve unique numbers, for example minor device numbers, and you keep the object-to-ID mapping yourself or do not need one at all. Using ida instead of idr when you do not need the pointer saves memory.

Both require their own locking: the API does not serialize concurrent allocations for you, so wrap allocation and removal in a lock (or use the preallocation pattern). Always check the return value: allocation can fail with -ENOMEM or -ENOSPC, and an ID is only valid after a successful allocation.

### Common pitfalls

- Using idr when ida would do. If you never look an object up by ID, you are paying to store pointers you never read; ida is smaller and simpler.
- Forgetting to free the ID. idr_remove / ida_free must be called when the object dies, or you leak IDs until the space exhausts. Pair allocation and removal like alloc and free.
- Missing locking. Concurrent idr_alloc calls without a lock corrupt the structure; protect the allocation path.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/idr.h>

static DEFINE_IDR(conn_idr);          // ID -> connection pointer
static DEFINE_SPINLOCK(conn_lock);    // idr needs external locking

int conn_register(struct connection *c)
{
    int id;

    idr_preload(GFP_KERNEL);          // preallocate outside the lock
    spin_lock(&conn_lock);
    // Allocate an ID in [1, INT_MAX) and bind it to c.
    id = idr_alloc(&conn_idr, c, 1, 0, GFP_NOWAIT);
    spin_unlock(&conn_lock);
    idr_preload_end();
    return id;                         // negative => -ENOMEM / -ENOSPC
}

struct connection *conn_lookup(int id)
{
    return idr_find(&conn_idr, id);    // ID -> pointer, fast
}

void conn_unregister(int id)
{
    spin_lock(&conn_lock);
    idr_remove(&conn_idr, id);         // free the ID (or you leak it)
    spin_unlock(&conn_lock);
}

// ida: just reserve a unique number, no pointer stored.
static DEFINE_IDA(minor_ida);
int minor_get(void) { return ida_alloc(&minor_ida, GFP_KERNEL); }
void minor_put(int m) { ida_free(&minor_ida, m); }`
        }
      ]
    },
    {
      heading: 'Bitmaps: dense sets of flags and the bit-op rules',
      body: `When you need a set of boolean states, free/used slots, a CPU mask, an allowed-feature set, the kernel uses **bitmaps**, declared with DECLARE_BITMAP in linux/types.h and manipulated via linux/bitmap.h and the atomic single-bit operations in linux/bitops.h. A bitmap is just an array of unsigned long, treated as a contiguous run of bits, so it is extremely dense: a thousand flags fit in 128 bytes, and set operations are a handful of word-wide AND/OR/XOR instructions.

There are two distinct families of operations and confusing them is a classic bug. The single-bit operations set_bit, clear_bit, change_bit, and test_and_set_bit are **atomic**: they use locked instructions and are safe to call concurrently from different CPUs without additional locking, which is exactly what you want for, say, a shared flags word touched from an interrupt and a thread. Their non-atomic counterparts __set_bit, __clear_bit (note the double underscore) are faster but provide **no** concurrency guarantee; use them only when you already hold a lock or the bitmap is local. The whole-bitmap operations, bitmap_set, bitmap_clear, bitmap_and, bitmap_or, bitmap_zero, bitmap_fill, bitmap_weight (population count), and the find helpers find_first_zero_bit / find_next_bit, operate over the entire array and are *not* atomic; they assume you have arranged exclusion yourself.

The find helpers are the workhorse for allocation: find_first_zero_bit locates the first free slot in O(words), which is how the kernel implements simple free-list allocators over a fixed resource. CPU masks (cpumask) are a specialized, heavily used bitmap wrapper on top of this machinery.

### Common pitfalls

- Mixing atomic and non-atomic ops on the same shared bitmap. test_and_set_bit being atomic does not protect a neighboring __set_bit; pick the atomic family for shared data, the underscore family only under a lock.
- Assuming whole-bitmap ops are atomic. bitmap_set and friends are not; protect them with a lock if more than one CPU can touch the bitmap.
- Off-by-one on size. DECLARE_BITMAP takes a bit count, not a byte or word count; passing the wrong unit gives a too-small array and out-of-bounds bit writes.
- Reading a bit you never initialized. DECLARE_BITMAP does not zero on the stack; call bitmap_zero (or use the static initializer) before testing bits.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/bitmap.h>
#include <linux/bitops.h>

#define NR_SLOTS 256
static DECLARE_BITMAP(slots, NR_SLOTS);   // 256 bits = 4 unsigned longs

void slots_init(void)
{
    bitmap_zero(slots, NR_SLOTS);         // not auto-zeroed; clear it first
}

// Allocate the first free slot. Atomic test_and_set guards against a race.
int slot_alloc(void)
{
    int bit;
    do {
        bit = find_first_zero_bit(slots, NR_SLOTS);
        if (bit >= NR_SLOTS)
            return -ENOSPC;               // all slots taken
    } while (test_and_set_bit(bit, slots));  // retry if another CPU grabbed it
    return bit;
}

void slot_free(int bit)
{
    clear_bit(bit, slots);                // atomic single-bit clear
}

unsigned int slots_used(void)
{
    return bitmap_weight(slots, NR_SLOTS);   // population count of set bits
}`
        }
      ]
    }
  ],
  takeaways: [
    'Kernel containers are intrusive: the link/node fields live inside your struct, so linking never allocates and one object can be on many lists or trees at once.',
    'container_of recovers the whole struct from a pointer to an embedded member via a constant offset subtraction; it is the keystone that makes every intrusive structure usable.',
    'list_head is a circular doubly linked list; use list_for_each_entry to get typed objects, and the _safe variant whenever you delete during iteration.',
    'hlist trades a symmetric back-pointer for a single-pointer head (using pprev, a pointer-to-pointer) so hash tables with many buckets stay small; it is the basis of DECLARE_HASHTABLE.',
    'kfifo is a power-of-two ring buffer that is lock-free for exactly one producer and one consumer; any extra producer or consumer requires your own spinlock.',
    'Red-black trees give worst-case O(log n) ordered operations, but YOU write the search and call rb_link_node then rb_insert_color; forgetting the color step breaks the tree.',
    'idr maps integer IDs to pointers; ida only reserves unique IDs without a pointer, use ida when you do not need the lookup. Both need external locking and reuse freed IDs.',
    'Bitmaps are dense unsigned-long arrays; the single-bit ops set_bit/clear_bit are atomic, the __underscore and whole-bitmap ops are not, so match the op family to your locking.',
    'None of these containers own memory or do locking for you: lifetime, freeing, and synchronization are always the callers responsibility, which is precisely what the Rust abstractions exist to make safe.'
  ],
  cheatsheet: [
    { label: 'container_of(ptr, type, member)', value: 'Pointer to embedded member back to the containing struct' },
    { label: 'LIST_HEAD(name) / INIT_LIST_HEAD', value: 'Declare/init a list anchor head (static / runtime)' },
    { label: 'list_add / list_add_tail', value: 'Push at front (LIFO) / push at back (FIFO)' },
    { label: 'list_del / list_del_init', value: 'Unlink + poison / unlink leaving a reusable empty node' },
    { label: 'list_for_each_entry[_safe]', value: 'Iterate typed entries; _safe needed if deleting in the loop' },
    { label: 'hlist_node + DEFINE_HASHTABLE', value: 'One-pointer-head list for memory-cheap hash buckets' },
    { label: 'hash_add / hash_for_each_possible', value: 'Insert by hashed key / walk only that key bucket' },
    { label: 'kfifo_in / kfifo_out', value: 'Enqueue/dequeue ring buffer; check returned count' },
    { label: 'kfifo lock-free', value: 'Only for ONE producer + ONE consumer; else spinlock' },
    { label: 'rb_link_node + rb_insert_color', value: 'Attach node then rebalance; both required on insert' },
    { label: 'rb_erase / rb_first / rb_next', value: 'Remove + rebalance / smallest / in-order successor' },
    { label: 'idr_alloc / idr_find / idr_remove', value: 'ID to pointer: allocate, look up, free (needs locking)' },
    { label: 'ida_alloc / ida_free', value: 'Reserve/release a unique ID, no pointer stored' },
    { label: 'set_bit vs __set_bit / find_first_zero_bit', value: 'Atomic vs non-atomic single bit / first free slot' }
  ]
}

export default note
