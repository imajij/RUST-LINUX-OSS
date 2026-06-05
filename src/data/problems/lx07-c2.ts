import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch07-c-036',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Embed A List Head And Initialize It',
    prompt: `Define a node struct that can live on a kernel doubly linked list, plus the list anchor.

Requirements:
- Define \`struct task_node { int id; struct list_head link; };\`.
- Define a static list head named \`task_list\` and initialize it at compile time with \`LIST_HEAD\`.
- Write \`void node_init(struct task_node *n, int id)\` that stores \`id\` and initializes the embedded \`link\` with \`INIT_LIST_HEAD\` so the node forms an empty (self-pointing) list of one.

Use only <linux/list.h> APIs.`,
    hints: [
      'LIST_HEAD(name) both declares and initializes the head.',
      'INIT_LIST_HEAD(&n->link) makes prev and next point at link itself.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

struct task_node {
    int id;
    struct list_head link;
};

static LIST_HEAD(task_list);

void node_init(struct task_node *n, int id)
{
    n->id = id;
    INIT_LIST_HEAD(&n->link);
}`,
    starter: `#include <linux/list.h>

struct task_node {
    int id;
    // TODO: embed a list_head
};

// TODO: declare and init task_list with LIST_HEAD

void node_init(struct task_node *n, int id)
{
    // TODO
}`,
    tags: ['list', 'list_head', 'intrusive'],
  },
  {
    id: 'lx-ch07-c-037',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'container_of From An Embedded list_head',
    prompt: `Given a pointer to the embedded \`link\` field, recover the enclosing struct.

The node is \`struct packet { u32 seq; struct list_head link; char payload[64]; };\`.

Write \`struct packet *packet_of(struct list_head *lh)\` that returns the \`struct packet\` whose \`link\` member equals \`*lh\`. Use \`container_of\` (do NOT use \`list_entry\` here; show the underlying macro).`,
    hints: [
      'container_of(ptr, type, member) takes the field pointer, the struct type, and the member name.',
      'list_entry is literally container_of under the hood.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>
#include <linux/kernel.h>

struct packet {
    u32 seq;
    struct list_head link;
    char payload[64];
};

struct packet *packet_of(struct list_head *lh)
{
    return container_of(lh, struct packet, link);
}`,
    starter: `#include <linux/list.h>
#include <linux/kernel.h>

struct packet {
    u32 seq;
    struct list_head link;
    char payload[64];
};

struct packet *packet_of(struct list_head *lh)
{
    // TODO: use container_of
}`,
    tags: ['list', 'container_of', 'intrusive'],
  },
  {
    id: 'lx-ch07-c-038',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add Nodes To Head And Tail',
    prompt: `Implement two helpers that insert a node into a list.

Node: \`struct item { int v; struct list_head link; };\`. The list head is passed in.

- \`void push_front(struct list_head *head, struct item *it)\` adds \`it\` right after \`head\` (newest at front).
- \`void push_back(struct list_head *head, struct item *it)\` adds \`it\` right before \`head\` (newest at tail).

Use the correct \`list_add\` / \`list_add_tail\` primitives.`,
    hints: [
      'list_add(new, head) inserts after head (front).',
      'list_add_tail(new, head) inserts before head (back).',
    ],
    solution: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void push_front(struct list_head *head, struct item *it)
{
    list_add(&it->link, head);
}

void push_back(struct list_head *head, struct item *it)
{
    list_add_tail(&it->link, head);
}`,
    starter: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void push_front(struct list_head *head, struct item *it)
{
    // TODO
}

void push_back(struct list_head *head, struct item *it)
{
    // TODO
}`,
    tags: ['list', 'list_add', 'list_add_tail'],
  },
  {
    id: 'lx-ch07-c-039',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Iterate And Sum With list_for_each_entry',
    prompt: `Walk a list of \`struct item { int v; struct list_head link; };\` and return the sum of all \`v\`.

Write \`int sum_items(struct list_head *head)\` using \`list_for_each_entry\`. The loop cursor should be a \`struct item *\`. Return 0 for an empty list.`,
    hints: [
      'list_for_each_entry(pos, head, member) gives you the enclosing struct directly.',
      'No need for container_of or list_entry inside the loop body.',
    ],
    solution: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

int sum_items(struct list_head *head)
{
    struct item *it;
    int total = 0;

    list_for_each_entry(it, head, link)
        total += it->v;

    return total;
}`,
    starter: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

int sum_items(struct list_head *head)
{
    struct item *it;
    int total = 0;

    // TODO: iterate with list_for_each_entry and accumulate
    return total;
}`,
    tags: ['list', 'iteration', 'list_for_each_entry'],
  },
  {
    id: 'lx-ch07-c-040',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'list_del And Detached State',
    prompt: `Remove a node from its list safely.

Node: \`struct item { int v; struct list_head link; };\`.

- Write \`void item_remove(struct item *it)\` that unlinks \`it\` from whatever list it is on, then poisons its pointers so a later \`list_empty\`-style reuse is safe. Use the variant that re-initializes the node so it is in a known detached state.
- Explain in a one-line comment why plain \`list_del\` alone leaves dangling poison values.`,
    hints: [
      'list_del leaves LIST_POISON1/LIST_POISON2 in the node pointers.',
      'list_del_init unlinks and re-inits the node to point at itself.',
    ],
    solution: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void item_remove(struct item *it)
{
    /* list_del would leave LIST_POISON1/2 in link; list_del_init re-inits it. */
    list_del_init(&it->link);
}`,
    starter: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void item_remove(struct item *it)
{
    // TODO: unlink and re-initialize the node
}`,
    tags: ['list', 'list_del', 'list_del_init'],
  },
  {
    id: 'lx-ch07-c-041',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Safe Removal During Iteration',
    prompt: `Free every node whose value is negative while iterating a list.

Node: \`struct item { int v; struct list_head link; };\` (each node was \`kmalloc\`'d).

Write \`void drop_negative(struct list_head *head)\` that walks the list and, for each item with \`v < 0\`, unlinks it with \`list_del\` and frees it with \`kfree\`. You MUST use the iteration form that tolerates deleting the current node.`,
    hints: [
      'list_for_each_entry_safe takes an extra temp cursor n.',
      'The safe form caches the next pointer before the body runs, so deleting pos is fine.',
    ],
    solution: `#include <linux/list.h>
#include <linux/slab.h>

struct item {
    int v;
    struct list_head link;
};

void drop_negative(struct list_head *head)
{
    struct item *it, *tmp;

    list_for_each_entry_safe(it, tmp, head, link) {
        if (it->v < 0) {
            list_del(&it->link);
            kfree(it);
        }
    }
}`,
    starter: `#include <linux/list.h>
#include <linux/slab.h>

struct item {
    int v;
    struct list_head link;
};

void drop_negative(struct list_head *head)
{
    struct item *it, *tmp;

    // TODO: iterate safely and free negative items
}`,
    tags: ['list', 'iteration', 'kfree'],
  },
  {
    id: 'lx-ch07-c-042',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Move A Node Between Two Lists',
    prompt: `Implement an LRU-style "touch" that moves a node to the front of a list it is already on, and a function that migrates a node from one list to the head of another.

Node: \`struct item { int v; struct list_head link; };\`.

- \`void touch(struct list_head *head, struct item *it)\`: move \`it\` to the front of \`head\`.
- \`void migrate(struct list_head *dst, struct item *it)\`: move \`it\` from its current list to the front of \`dst\`.

Use \`list_move\` (it unlinks then re-adds in one call).`,
    hints: [
      'list_move(entry, head) = list_del(entry) followed by list_add(entry, head).',
      'list_move_tail puts it at the back instead.',
    ],
    solution: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void touch(struct list_head *head, struct item *it)
{
    list_move(&it->link, head);
}

void migrate(struct list_head *dst, struct item *it)
{
    list_move(&it->link, dst);
}`,
    starter: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void touch(struct list_head *head, struct item *it)
{
    // TODO
}

void migrate(struct list_head *dst, struct item *it)
{
    // TODO
}`,
    tags: ['list', 'list_move', 'lru'],
  },
  {
    id: 'lx-ch07-c-043',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count And Emptiness Checks',
    prompt: `Implement two predicate/counter helpers on a list of \`struct item { int v; struct list_head link; };\`.

- \`bool list_is_empty(struct list_head *head)\`: return true if the list has no entries (use the kernel helper, do not hand-roll pointer checks).
- \`size_t list_count(struct list_head *head)\`: return the number of entries by iterating the bare \`list_head\` cursor (use \`list_for_each\`, not \`list_for_each_entry\`).`,
    hints: [
      'list_empty(head) checks whether next == head.',
      'list_for_each(pos, head) iterates struct list_head* without recovering the entry.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

struct item {
    int v;
    struct list_head link;
};

bool list_is_empty(struct list_head *head)
{
    return list_empty(head);
}

size_t list_count(struct list_head *head)
{
    struct list_head *pos;
    size_t n = 0;

    list_for_each(pos, head)
        n++;

    return n;
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

struct item {
    int v;
    struct list_head link;
};

bool list_is_empty(struct list_head *head)
{
    // TODO
}

size_t list_count(struct list_head *head)
{
    // TODO: iterate with list_for_each
}`,
    tags: ['list', 'list_empty', 'list_for_each'],
  },
  {
    id: 'lx-ch07-c-044',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sorted Insert Into A Linked List',
    prompt: `Keep a list ordered by ascending key.

Node: \`struct item { int v; struct list_head link; };\`. The list is already sorted by \`v\`.

Write \`void insert_sorted(struct list_head *head, struct item *new_it)\` that places \`new_it\` so the list stays sorted ascending. If all existing entries are smaller, it goes at the tail.`,
    hints: [
      'Iterate with list_for_each_entry; stop at the first entry whose v is greater.',
      'list_add(&new->link, pos->link.prev) inserts before pos; falling off the loop means append at tail.',
    ],
    solution: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void insert_sorted(struct list_head *head, struct item *new_it)
{
    struct item *it;

    list_for_each_entry(it, head, link) {
        if (it->v > new_it->v) {
            /* insert new_it right before it */
            list_add_tail(&new_it->link, &it->link);
            return;
        }
    }
    /* all smaller (or empty): append at tail */
    list_add_tail(&new_it->link, head);
}`,
    starter: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void insert_sorted(struct list_head *head, struct item *new_it)
{
    struct item *it;

    // TODO: find insertion point, insert keeping ascending order
}`,
    tags: ['list', 'sorted', 'list_add_tail'],
  },
  {
    id: 'lx-ch07-c-045',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reverse Iteration And Last Entry',
    prompt: `Two helpers for a list of \`struct item { int v; struct list_head link; };\`.

- \`struct item *last_item(struct list_head *head)\`: return the last entry, or NULL if empty. Use \`list_last_entry\` only after confirming the list is non-empty.
- \`int sum_reverse(struct list_head *head)\`: sum all values walking from tail to head using the reverse iterator.`,
    hints: [
      'Guard with list_empty before list_last_entry (it does not check emptiness).',
      'list_for_each_entry_reverse walks back to front.',
    ],
    solution: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

struct item *last_item(struct list_head *head)
{
    if (list_empty(head))
        return NULL;
    return list_last_entry(head, struct item, link);
}

int sum_reverse(struct list_head *head)
{
    struct item *it;
    int total = 0;

    list_for_each_entry_reverse(it, head, link)
        total += it->v;

    return total;
}`,
    starter: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

struct item *last_item(struct list_head *head)
{
    // TODO: guard empty, then list_last_entry
}

int sum_reverse(struct list_head *head)
{
    // TODO: list_for_each_entry_reverse
}`,
    tags: ['list', 'reverse', 'list_last_entry'],
  },
  {
    id: 'lx-ch07-c-046',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Splice One List Onto Another',
    prompt: `Move every element of one list onto the end of another in O(1).

Both lists hold \`struct item { int v; struct list_head link; };\`.

Write \`void drain_into(struct list_head *dst, struct list_head *src)\` that appends all of \`src\`'s entries to the tail of \`dst\` and leaves \`src\` empty and reusable. Use the splice primitive that also re-initializes the source head.`,
    hints: [
      'list_splice_tail(src, dst) appends src before dst but leaves src head stale.',
      'list_splice_tail_init also re-inits src so it becomes a valid empty list.',
    ],
    solution: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void drain_into(struct list_head *dst, struct list_head *src)
{
    list_splice_tail_init(src, dst);
}`,
    starter: `#include <linux/list.h>

struct item {
    int v;
    struct list_head link;
};

void drain_into(struct list_head *dst, struct list_head *src)
{
    // TODO: splice src to tail of dst and re-init src
}`,
    tags: ['list', 'list_splice', 'merge'],
  },
  {
    id: 'lx-ch07-c-047',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'hlist Bucket Insert',
    prompt: `Build the insert side of a chained hash table using \`hlist\`.

Entry: \`struct ent { u32 key; int val; struct hlist_node node; };\`. You have an array of \`HSIZE\` buckets: \`struct hlist_head table[HSIZE];\` (already \`HLIST_HEAD_INIT\`'d).

Write \`void ht_insert(struct hlist_head *table, struct ent *e)\` that hashes \`e->key\` into a bucket index \`key % HSIZE\` and adds \`e\` at the head of that bucket. Assume \`#define HSIZE 256\`.`,
    hints: [
      'hlist heads have a single pointer (good for sparse arrays); use hlist_add_head.',
      'hlist_add_head(&e->node, &table[idx]) prepends to the bucket chain.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

#define HSIZE 256

struct ent {
    u32 key;
    int val;
    struct hlist_node node;
};

void ht_insert(struct hlist_head *table, struct ent *e)
{
    u32 idx = e->key % HSIZE;

    hlist_add_head(&e->node, &table[idx]);
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

#define HSIZE 256

struct ent {
    u32 key;
    int val;
    struct hlist_node node;
};

void ht_insert(struct hlist_head *table, struct ent *e)
{
    // TODO: compute bucket, add at head
}`,
    tags: ['hlist', 'hashtable', 'hlist_add_head'],
  },
  {
    id: 'lx-ch07-c-048',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'hlist Bucket Lookup',
    prompt: `Implement lookup over the hash table from the previous problem.

Entry: \`struct ent { u32 key; int val; struct hlist_node node; };\`, \`#define HSIZE 256\`.

Write \`struct ent *ht_lookup(struct hlist_head *table, u32 key)\` that walks the correct bucket chain and returns the entry whose \`key\` matches, or NULL. Use the hlist entry iterator.`,
    hints: [
      'hlist_for_each_entry(pos, head, member) recovers each struct in the bucket.',
      'Compare pos->key to the requested key; return on match.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

#define HSIZE 256

struct ent {
    u32 key;
    int val;
    struct hlist_node node;
};

struct ent *ht_lookup(struct hlist_head *table, u32 key)
{
    u32 idx = key % HSIZE;
    struct ent *e;

    hlist_for_each_entry(e, &table[idx], node) {
        if (e->key == key)
            return e;
    }
    return NULL;
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

#define HSIZE 256

struct ent {
    u32 key;
    int val;
    struct hlist_node node;
};

struct ent *ht_lookup(struct hlist_head *table, u32 key)
{
    // TODO: scan bucket chain for matching key
}`,
    tags: ['hlist', 'hashtable', 'lookup'],
  },
  {
    id: 'lx-ch07-c-049',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'hlist Delete And Detach Check',
    prompt: `Remove an entry from a chained hash table and let callers detect already-removed entries.

Entry: \`struct ent { u32 key; int val; struct hlist_node node; };\`.

- \`void ht_remove(struct ent *e)\`: unlink \`e\` from its bucket and leave the node in a hashed/unhashed-detectable state. Use the variant that re-initializes the node.
- \`bool ht_is_linked(struct ent *e)\`: return true if \`e\` is currently on a chain. Use \`hlist_unhashed\`.`,
    hints: [
      'hlist_del_init unlinks and re-inits, so hlist_unhashed reports false afterward.',
      'hlist_unhashed returns true when pprev is NULL (detached).',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

struct ent {
    u32 key;
    int val;
    struct hlist_node node;
};

void ht_remove(struct ent *e)
{
    hlist_del_init(&e->node);
}

bool ht_is_linked(struct ent *e)
{
    return !hlist_unhashed(&e->node);
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

struct ent {
    u32 key;
    int val;
    struct hlist_node node;
};

void ht_remove(struct ent *e)
{
    // TODO: del_init
}

bool ht_is_linked(struct ent *e)
{
    // TODO: use hlist_unhashed
}`,
    tags: ['hlist', 'hlist_del_init', 'hlist_unhashed'],
  },
  {
    id: 'lx-ch07-c-050',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Declare And Init A kfifo',
    prompt: `Set up a byte-oriented kfifo and report its capacity.

Write \`int fifo_setup(struct kfifo *fifo)\` that allocates a kfifo holding 1024 bytes using \`kfifo_alloc\` with \`GFP_KERNEL\`. Return the return value of \`kfifo_alloc\` (0 on success, negative errno on failure).

Also write \`void fifo_teardown(struct kfifo *fifo)\` that frees it with \`kfifo_free\`.

Note in a comment why \`GFP_KERNEL\` is acceptable here.`,
    hints: [
      'kfifo_alloc(fifo, size, gfp) rounds size up to a power of two.',
      'GFP_KERNEL may sleep; only valid in process context, not in an interrupt or under a spinlock.',
    ],
    solution: `#include <linux/kfifo.h>
#include <linux/slab.h>

int fifo_setup(struct kfifo *fifo)
{
    /* GFP_KERNEL may sleep; fine here because setup runs in process context. */
    return kfifo_alloc(fifo, 1024, GFP_KERNEL);
}

void fifo_teardown(struct kfifo *fifo)
{
    kfifo_free(fifo);
}`,
    starter: `#include <linux/kfifo.h>
#include <linux/slab.h>

int fifo_setup(struct kfifo *fifo)
{
    // TODO: kfifo_alloc 1024 bytes, return its result
}

void fifo_teardown(struct kfifo *fifo)
{
    // TODO: kfifo_free
}`,
    tags: ['kfifo', 'gfp', 'alloc'],
  },
  {
    id: 'lx-ch07-c-051',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'kfifo Producer And Consumer',
    prompt: `Move whole \`int\` records through a kfifo.

The fifo was created with \`kfifo_alloc\` and stores raw bytes.

- \`unsigned int fifo_put(struct kfifo *fifo, int val)\`: push one int with \`kfifo_in\` and return how many bytes were actually written (0 if full).
- \`bool fifo_get(struct kfifo *fifo, int *out)\`: pop one int with \`kfifo_out\`; return true if an int was retrieved, false if the fifo was empty.`,
    hints: [
      'kfifo_in(fifo, &buf, len) returns the number of bytes copied in.',
      'kfifo_out(fifo, &buf, len) returns bytes copied out; compare against sizeof(int).',
    ],
    solution: `#include <linux/kfifo.h>
#include <linux/types.h>

unsigned int fifo_put(struct kfifo *fifo, int val)
{
    return kfifo_in(fifo, &val, sizeof(val));
}

bool fifo_get(struct kfifo *fifo, int *out)
{
    return kfifo_out(fifo, out, sizeof(*out)) == sizeof(*out);
}`,
    starter: `#include <linux/kfifo.h>
#include <linux/types.h>

unsigned int fifo_put(struct kfifo *fifo, int val)
{
    // TODO: kfifo_in
}

bool fifo_get(struct kfifo *fifo, int *out)
{
    // TODO: kfifo_out, check full record copied
}`,
    tags: ['kfifo', 'kfifo_in', 'kfifo_out'],
  },
  {
    id: 'lx-ch07-c-052',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'kfifo Occupancy Helpers',
    prompt: `Expose state queries on a kfifo of bytes.

Implement:
- \`unsigned int fifo_used(struct kfifo *fifo)\`: number of bytes currently queued (\`kfifo_len\`).
- \`unsigned int fifo_free(struct kfifo *fifo)\`: free space in bytes (\`kfifo_avail\`).
- \`bool fifo_is_empty(struct kfifo *fifo)\` and \`bool fifo_is_full(struct kfifo *fifo)\` using the dedicated macros.`,
    hints: [
      'kfifo_len, kfifo_avail return byte counts.',
      'kfifo_is_empty / kfifo_is_full are boolean macros, not len comparisons you write by hand.',
    ],
    solution: `#include <linux/kfifo.h>
#include <linux/types.h>

unsigned int fifo_used(struct kfifo *fifo)
{
    return kfifo_len(fifo);
}

unsigned int fifo_free(struct kfifo *fifo)
{
    return kfifo_avail(fifo);
}

bool fifo_is_empty(struct kfifo *fifo)
{
    return kfifo_is_empty(fifo);
}

bool fifo_is_full(struct kfifo *fifo)
{
    return kfifo_is_full(fifo);
}`,
    starter: `#include <linux/kfifo.h>
#include <linux/types.h>

unsigned int fifo_used(struct kfifo *fifo)
{
    // TODO
}

unsigned int fifo_free(struct kfifo *fifo)
{
    // TODO
}

bool fifo_is_empty(struct kfifo *fifo)
{
    // TODO
}

bool fifo_is_full(struct kfifo *fifo)
{
    // TODO
}`,
    tags: ['kfifo', 'kfifo_len', 'state'],
  },
  {
    id: 'lx-ch07-c-053',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bitmap Allocation And Init',
    prompt: `Allocate a kernel bitmap and clear all bits.

Write \`unsigned long *bm_alloc(unsigned int nbits)\` that allocates a bitmap large enough for \`nbits\` bits with \`bitmap_zalloc(nbits, GFP_KERNEL)\` (all bits zero). Return NULL on failure.

Write \`void bm_free(unsigned long *bm)\` that releases it with \`bitmap_free\`.

A one-line comment should explain why \`bitmap_zalloc\` is preferable to \`kmalloc\` of \`nbits/8\` bytes.`,
    hints: [
      'bitmap_zalloc allocates and zeroes; it sizes in unsigned long words, not raw bytes.',
      'Using kmalloc with nbits/8 ignores word rounding and alignment that bitmap ops assume.',
    ],
    solution: `#include <linux/bitmap.h>
#include <linux/slab.h>

unsigned long *bm_alloc(unsigned int nbits)
{
    /* bitmap_zalloc rounds up to whole unsigned longs and zeroes them. */
    return bitmap_zalloc(nbits, GFP_KERNEL);
}

void bm_free(unsigned long *bm)
{
    bitmap_free(bm);
}`,
    starter: `#include <linux/bitmap.h>
#include <linux/slab.h>

unsigned long *bm_alloc(unsigned int nbits)
{
    // TODO: bitmap_zalloc
}

void bm_free(unsigned long *bm)
{
    // TODO: bitmap_free
}`,
    tags: ['bitmap', 'alloc', 'gfp'],
  },
  {
    id: 'lx-ch07-c-054',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Atomic Bit Set, Clear, And Test',
    prompt: `Manipulate individual bits in a shared bitmap that may be touched concurrently.

Given \`unsigned long *bm\`, implement:
- \`void bm_mark(unsigned long *bm, unsigned int bit)\`: set the bit atomically.
- \`void bm_unmark(unsigned long *bm, unsigned int bit)\`: clear the bit atomically.
- \`bool bm_query(unsigned long *bm, unsigned int bit)\`: return whether the bit is set.

Use the atomic \`set_bit\`/\`clear_bit\`/\`test_bit\` family (not the non-atomic \`__set_bit\`), because other CPUs may update the same word.`,
    hints: [
      'set_bit/clear_bit/test_bit take (nr, addr) and use locked RMW instructions.',
      'The __-prefixed variants are non-atomic; only use them when you hold a lock.',
    ],
    solution: `#include <linux/bitops.h>
#include <linux/types.h>

void bm_mark(unsigned long *bm, unsigned int bit)
{
    set_bit(bit, bm);
}

void bm_unmark(unsigned long *bm, unsigned int bit)
{
    clear_bit(bit, bm);
}

bool bm_query(unsigned long *bm, unsigned int bit)
{
    return test_bit(bit, bm);
}`,
    starter: `#include <linux/bitops.h>
#include <linux/types.h>

void bm_mark(unsigned long *bm, unsigned int bit)
{
    // TODO: atomic set_bit
}

void bm_unmark(unsigned long *bm, unsigned int bit)
{
    // TODO: atomic clear_bit
}

bool bm_query(unsigned long *bm, unsigned int bit)
{
    // TODO: test_bit
}`,
    tags: ['bitmap', 'bitops', 'atomic'],
  },
  {
    id: 'lx-ch07-c-055',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Find First Free Slot With A Bitmap',
    prompt: `Use a bitmap as a small allocator.

\`unsigned long *bm\` tracks \`nbits\` slots (1 = used, 0 = free).

Write \`int slot_alloc(unsigned long *bm, unsigned int nbits)\` that finds the first zero bit, sets it, and returns its index; return \`-ENOSPC\` if all bits are set. Use \`find_first_zero_bit\` and a non-atomic \`__set_bit\` (assume the caller holds the allocator lock).`,
    hints: [
      'find_first_zero_bit(bm, nbits) returns nbits when nothing is free.',
      'Under a held lock you may use __set_bit, which avoids the locked instruction.',
    ],
    solution: `#include <linux/bitmap.h>
#include <linux/bitops.h>
#include <linux/errno.h>

int slot_alloc(unsigned long *bm, unsigned int nbits)
{
    unsigned int idx = find_first_zero_bit(bm, nbits);

    if (idx >= nbits)
        return -ENOSPC;

    __set_bit(idx, bm);
    return idx;
}`,
    starter: `#include <linux/bitmap.h>
#include <linux/bitops.h>
#include <linux/errno.h>

int slot_alloc(unsigned long *bm, unsigned int nbits)
{
    // TODO: find first zero bit, claim it, return index or -ENOSPC
}`,
    tags: ['bitmap', 'find_first_zero_bit', 'allocator'],
  },
  {
    id: 'lx-ch07-c-056',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count And Range Operations On Bitmaps',
    prompt: `Bulk bitmap operations.

Given \`unsigned long *bm\` of \`nbits\` bits:
- \`unsigned int bm_popcount(const unsigned long *bm, unsigned int nbits)\`: count set bits with \`bitmap_weight\`.
- \`void bm_fill_range(unsigned long *bm, unsigned int start, unsigned int len)\`: set \`len\` contiguous bits starting at \`start\` with \`bitmap_set\`.
- \`void bm_clear_all(unsigned long *bm, unsigned int nbits)\`: zero the whole bitmap with \`bitmap_zero\`.`,
    hints: [
      'bitmap_weight returns the number of set bits across nbits.',
      'bitmap_set(bm, start, len) sets a run; bitmap_zero(bm, nbits) clears all.',
    ],
    solution: `#include <linux/bitmap.h>

unsigned int bm_popcount(const unsigned long *bm, unsigned int nbits)
{
    return bitmap_weight(bm, nbits);
}

void bm_fill_range(unsigned long *bm, unsigned int start, unsigned int len)
{
    bitmap_set(bm, start, len);
}

void bm_clear_all(unsigned long *bm, unsigned int nbits)
{
    bitmap_zero(bm, nbits);
}`,
    starter: `#include <linux/bitmap.h>

unsigned int bm_popcount(const unsigned long *bm, unsigned int nbits)
{
    // TODO
}

void bm_fill_range(unsigned long *bm, unsigned int start, unsigned int len)
{
    // TODO
}

void bm_clear_all(unsigned long *bm, unsigned int nbits)
{
    // TODO
}`,
    tags: ['bitmap', 'bitmap_weight', 'bitmap_set'],
  },
  {
    id: 'lx-ch07-c-057',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'IDR Allocate And Lookup',
    prompt: `Use an \`idr\` to map small integer IDs to object pointers.

You have a global \`static DEFINE_IDR(obj_idr);\` and objects \`struct obj { ... };\`.

- \`int obj_register(struct obj *o)\`: allocate an ID for \`o\` in range [1, INT_MAX) with \`idr_alloc(&obj_idr, o, 1, 0, GFP_KERNEL)\`; return the ID (>=1) or a negative errno.
- \`struct obj *obj_find(int id)\`: return the object for \`id\` with \`idr_find\`, or NULL.

State in a comment why this allocation must run in process context.`,
    hints: [
      'idr_alloc(idr, ptr, start, end, gfp): end of 0 means no upper bound (INT_MAX+1).',
      'GFP_KERNEL can sleep, so obj_register must not be called while holding a spinlock.',
    ],
    solution: `#include <linux/idr.h>
#include <linux/slab.h>

struct obj { int dummy; };

static DEFINE_IDR(obj_idr);

int obj_register(struct obj *o)
{
    /* GFP_KERNEL may sleep -> must be in process context, no spinlock held. */
    return idr_alloc(&obj_idr, o, 1, 0, GFP_KERNEL);
}

struct obj *obj_find(int id)
{
    return idr_find(&obj_idr, id);
}`,
    starter: `#include <linux/idr.h>
#include <linux/slab.h>

struct obj { int dummy; };

static DEFINE_IDR(obj_idr);

int obj_register(struct obj *o)
{
    // TODO: idr_alloc in [1, INT_MAX)
}

struct obj *obj_find(int id)
{
    // TODO: idr_find
}`,
    tags: ['idr', 'idr_alloc', 'idr_find'],
  },
  {
    id: 'lx-ch07-c-058',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'IDR Remove And Teardown',
    prompt: `Release IDs and tear down an IDR cleanly.

Using \`static DEFINE_IDR(obj_idr);\` and \`struct obj\`:
- \`void obj_unregister(int id)\`: remove the mapping for \`id\` with \`idr_remove\`.
- \`void obj_idr_destroy(void)\`: free all internal IDR memory with \`idr_destroy\` (does not free the objects themselves).

Add a comment noting that you must free or otherwise account for the pointed-to objects separately before destroying the IDR.`,
    hints: [
      'idr_remove(idr, id) drops one mapping but does not kfree the object.',
      'idr_destroy frees the radix-tree bookkeeping; you still own the stored pointers.',
    ],
    solution: `#include <linux/idr.h>

struct obj { int dummy; };

static DEFINE_IDR(obj_idr);

void obj_unregister(int id)
{
    idr_remove(&obj_idr, id);
}

void obj_idr_destroy(void)
{
    /* Free/iterate the stored objects yourself first; this only frees IDR internals. */
    idr_destroy(&obj_idr);
}`,
    starter: `#include <linux/idr.h>

struct obj { int dummy; };

static DEFINE_IDR(obj_idr);

void obj_unregister(int id)
{
    // TODO: idr_remove
}

void obj_idr_destroy(void)
{
    // TODO: idr_destroy
}`,
    tags: ['idr', 'idr_remove', 'idr_destroy'],
  },
  {
    id: 'lx-ch07-c-059',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'IDA For Unique Integer IDs',
    prompt: `When you only need unique integers (no pointer storage), use an \`ida\`.

Using \`static DEFINE_IDA(port_ida);\`:
- \`int port_get(void)\`: allocate the smallest free ID in range [0, 1024) with \`ida_alloc_range(&port_ida, 0, 1023, GFP_KERNEL)\`; return the ID or a negative errno.
- \`void port_put(int id)\`: free the ID with \`ida_free\`.`,
    hints: [
      'ida_alloc_range(ida, min, max, gfp) returns the lowest free id in [min, max].',
      'ida_free(ida, id) releases it; the IDA stores only the integer, not a pointer.',
    ],
    solution: `#include <linux/idr.h>
#include <linux/slab.h>

static DEFINE_IDA(port_ida);

int port_get(void)
{
    return ida_alloc_range(&port_ida, 0, 1023, GFP_KERNEL);
}

void port_put(int id)
{
    ida_free(&port_ida, id);
}`,
    starter: `#include <linux/idr.h>
#include <linux/slab.h>

static DEFINE_IDA(port_ida);

int port_get(void)
{
    // TODO: ida_alloc_range [0, 1023]
}

void port_put(int id)
{
    // TODO: ida_free
}`,
    tags: ['ida', 'ida_alloc_range', 'ids'],
  },
  {
    id: 'lx-ch07-c-060',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Define An rbtree Node And Root',
    prompt: `Set up the scaffolding for a red-black tree keyed by an integer.

- Define \`struct knode { int key; void *data; struct rb_node node; };\`.
- Define a static tree root \`my_tree\` initialized empty with \`RB_ROOT\`.
- Write \`struct knode *knode_of(struct rb_node *n)\` that recovers the enclosing \`struct knode\` from a \`struct rb_node *\` using \`rb_entry\` (which is container_of for rb nodes).`,
    hints: [
      'struct rb_root tree = RB_ROOT; gives an empty tree.',
      'rb_entry(ptr, type, member) is the rbtree spelling of container_of.',
    ],
    solution: `#include <linux/rbtree.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

static struct rb_root my_tree = RB_ROOT;

struct knode *knode_of(struct rb_node *n)
{
    return rb_entry(n, struct knode, node);
}`,
    starter: `#include <linux/rbtree.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

// TODO: declare my_tree as an empty rb_root

struct knode *knode_of(struct rb_node *n)
{
    // TODO: rb_entry
}`,
    tags: ['rbtree', 'rb_root', 'rb_entry'],
  },
  {
    id: 'lx-ch07-c-061',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'rbtree Search By Key',
    prompt: `Search a red-black tree keyed by \`int key\`.

Node: \`struct knode { int key; void *data; struct rb_node node; };\`.

Write \`struct knode *rb_search(struct rb_root *root, int key)\` that descends from the root: go left when \`key\` is smaller, right when larger, and return the node on an exact match, NULL if not found. Use \`rb_entry\` to read each node's key.`,
    hints: [
      'Start at root->rb_node and follow rb_left / rb_right based on comparison.',
      'rb_entry(node, struct knode, node) gives the key to compare.',
    ],
    solution: `#include <linux/rbtree.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

struct knode *rb_search(struct rb_root *root, int key)
{
    struct rb_node *n = root->rb_node;

    while (n) {
        struct knode *k = rb_entry(n, struct knode, node);

        if (key < k->key)
            n = n->rb_left;
        else if (key > k->key)
            n = n->rb_right;
        else
            return k;
    }
    return NULL;
}`,
    starter: `#include <linux/rbtree.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

struct knode *rb_search(struct rb_root *root, int key)
{
    struct rb_node *n = root->rb_node;

    // TODO: descend comparing keys, return match or NULL
}`,
    tags: ['rbtree', 'search', 'rb_entry'],
  },
  {
    id: 'lx-ch07-c-062',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'rbtree Insert With Rebalance',
    prompt: `Insert a new node into a red-black tree keyed by \`int key\`, rejecting duplicates.

Node: \`struct knode { int key; void *data; struct rb_node node; };\`.

Write \`int rb_insert(struct rb_root *root, struct knode *new_k)\` that:
1. Walks down tracking the parent and the child-link slot.
2. Returns \`-EEXIST\` if a node with the same key already exists.
3. Otherwise links \`new_k\` with \`rb_link_node\` and rebalances with \`rb_insert_color\`, returning 0.`,
    hints: [
      'Keep a struct rb_node **link = &root->rb_node and a struct rb_node *parent.',
      'rb_link_node(&new->node, parent, link) then rb_insert_color(&new->node, root).',
    ],
    solution: `#include <linux/rbtree.h>
#include <linux/errno.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

int rb_insert(struct rb_root *root, struct knode *new_k)
{
    struct rb_node **link = &root->rb_node;
    struct rb_node *parent = NULL;

    while (*link) {
        struct knode *k = rb_entry(*link, struct knode, node);

        parent = *link;
        if (new_k->key < k->key)
            link = &(*link)->rb_left;
        else if (new_k->key > k->key)
            link = &(*link)->rb_right;
        else
            return -EEXIST;
    }

    rb_link_node(&new_k->node, parent, link);
    rb_insert_color(&new_k->node, root);
    return 0;
}`,
    starter: `#include <linux/rbtree.h>
#include <linux/errno.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

int rb_insert(struct rb_root *root, struct knode *new_k)
{
    struct rb_node **link = &root->rb_node;
    struct rb_node *parent = NULL;

    // TODO: descend, reject duplicates, link + insert_color
}`,
    tags: ['rbtree', 'insert', 'rb_link_node'],
  },
  {
    id: 'lx-ch07-c-063',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'In-Order rbtree Traversal',
    prompt: `Sum all keys of a red-black tree in sorted order without recursion.

Node: \`struct knode { int key; void *data; struct rb_node node; };\`.

Write \`long rb_sum_inorder(struct rb_root *root)\` that visits nodes in ascending key order using \`rb_first\` and \`rb_next\`, summing each \`key\` into a \`long\`. Return 0 for an empty tree.`,
    hints: [
      'rb_first(root) returns the leftmost (smallest) node or NULL.',
      'rb_next(node) advances to the in-order successor; loop until NULL.',
    ],
    solution: `#include <linux/rbtree.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

long rb_sum_inorder(struct rb_root *root)
{
    struct rb_node *n;
    long total = 0;

    for (n = rb_first(root); n; n = rb_next(n)) {
        struct knode *k = rb_entry(n, struct knode, node);

        total += k->key;
    }
    return total;
}`,
    starter: `#include <linux/rbtree.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

long rb_sum_inorder(struct rb_root *root)
{
    struct rb_node *n;
    long total = 0;

    // TODO: walk rb_first .. rb_next, accumulate keys
    return total;
}`,
    tags: ['rbtree', 'traversal', 'rb_next'],
  },
  {
    id: 'lx-ch07-c-064',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'rbtree Erase And Free All',
    prompt: `Remove one node and also tear down a whole tree of \`kmalloc\`'d nodes.

Node: \`struct knode { int key; void *data; struct rb_node node; };\`.

- \`void rb_remove(struct rb_root *root, struct knode *k)\`: unlink \`k\` from the tree with \`rb_erase\` (do not free here).
- \`void rb_free_all(struct rb_root *root)\`: free every node and leave the tree empty. Use the post-order helper \`rbtree_postorder_for_each_entry_safe\` so children are freed before parents, then reset the root.`,
    hints: [
      'rb_erase rebalances after removing; it does not kfree the node.',
      'rbtree_postorder_for_each_entry_safe(pos, n, root, member) is delete-safe; set *root = RB_ROOT afterward.',
    ],
    solution: `#include <linux/rbtree.h>
#include <linux/slab.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

void rb_remove(struct rb_root *root, struct knode *k)
{
    rb_erase(&k->node, root);
}

void rb_free_all(struct rb_root *root)
{
    struct knode *pos, *n;

    rbtree_postorder_for_each_entry_safe(pos, n, root, node)
        kfree(pos);

    *root = RB_ROOT;
}`,
    starter: `#include <linux/rbtree.h>
#include <linux/slab.h>

struct knode {
    int key;
    void *data;
    struct rb_node node;
};

void rb_remove(struct rb_root *root, struct knode *k)
{
    // TODO: rb_erase
}

void rb_free_all(struct rb_root *root)
{
    struct knode *pos, *n;

    // TODO: postorder-safe free, then reset root
}`,
    tags: ['rbtree', 'rb_erase', 'teardown'],
  },
  {
    id: 'lx-ch07-c-065',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'List + Hash Dual-Indexed Cache Insert',
    prompt: `Build an object that lives on BOTH a global LRU list and a hash bucket at once (a common cache pattern).

Object: \`struct cobj { u32 key; struct list_head lru; struct hlist_node hnode; };\`.

You have \`struct list_head lru_list;\` and \`struct hlist_head htab[HSIZE];\` (HSIZE 256).

Write \`void cache_insert(struct cobj *o)\` that:
- adds \`o\` to the FRONT of \`lru_list\` (most-recently-used),
- and adds \`o\` to the head of bucket \`o->key % HSIZE\`.

Both insertions must use the object's two distinct embedded link members.`,
    hints: [
      'Each data structure needs its own embedded node; do not reuse one for both.',
      'list_add for the LRU, hlist_add_head for the hash bucket.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

#define HSIZE 256

struct cobj {
    u32 key;
    struct list_head lru;
    struct hlist_node hnode;
};

void cache_insert(struct list_head *lru_list,
                  struct hlist_head *htab,
                  struct cobj *o)
{
    list_add(&o->lru, lru_list);
    hlist_add_head(&o->hnode, &htab[o->key % HSIZE]);
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

#define HSIZE 256

struct cobj {
    u32 key;
    struct list_head lru;
    struct hlist_node hnode;
};

void cache_insert(struct list_head *lru_list,
                  struct hlist_head *htab,
                  struct cobj *o)
{
    // TODO: front of LRU + head of hash bucket
}`,
    tags: ['list', 'hlist', 'cache'],
  },
  {
    id: 'lx-ch07-c-066',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Evict LRU Tail From Both Indexes',
    prompt: `Continue the dual-indexed cache: evict the least-recently-used object and unlink it from both structures.

Object: \`struct cobj { u32 key; struct list_head lru; struct hlist_node hnode; };\`, allocated with \`kmalloc\`.

Write \`void cache_evict_one(struct list_head *lru_list)\` that:
- if \`lru_list\` is empty, returns;
- otherwise takes the LAST entry (LRU tail), removes it from the LRU list AND from its hash bucket, then frees it.

Remember the node is on two structures; both links must be detached before \`kfree\`.`,
    hints: [
      'list_last_entry gives the LRU victim after a list_empty guard.',
      'list_del on the lru member and hlist_del on the hnode member, then kfree.',
    ],
    solution: `#include <linux/list.h>
#include <linux/slab.h>
#include <linux/types.h>

struct cobj {
    u32 key;
    struct list_head lru;
    struct hlist_node hnode;
};

void cache_evict_one(struct list_head *lru_list)
{
    struct cobj *victim;

    if (list_empty(lru_list))
        return;

    victim = list_last_entry(lru_list, struct cobj, lru);
    list_del(&victim->lru);
    hlist_del(&victim->hnode);
    kfree(victim);
}`,
    starter: `#include <linux/list.h>
#include <linux/slab.h>
#include <linux/types.h>

struct cobj {
    u32 key;
    struct list_head lru;
    struct hlist_node hnode;
};

void cache_evict_one(struct list_head *lru_list)
{
    // TODO: pick LRU tail, unlink from list + hash, free
}`,
    tags: ['list', 'hlist', 'eviction'],
  },
  {
    id: 'lx-ch07-c-067',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Spinlock-Protected List Push From Any Context',
    prompt: `A list may be modified from both process and interrupt context, so it needs IRQ-safe locking.

State: \`struct list_head q; spinlock_t lock;\` and node \`struct ev { int code; struct list_head link; };\`.

Write \`void enqueue_irqsafe(struct list_head *q, spinlock_t *lock, struct ev *e)\` that adds \`e\` to the tail of \`q\` while holding \`lock\` with the IRQ-saving variant. Explain in a comment why \`spin_lock_irqsave\` (not plain \`spin_lock\`) is required here, and why you must NOT call any sleeping allocator inside the critical section.`,
    hints: [
      'If an IRQ handler also takes this lock, you must disable local IRQs while holding it.',
      'spin_lock_irqsave/spin_unlock_irqrestore save and restore the IRQ flags around the section.',
    ],
    solution: `#include <linux/list.h>
#include <linux/spinlock.h>

struct ev {
    int code;
    struct list_head link;
};

void enqueue_irqsafe(struct list_head *q, spinlock_t *lock, struct ev *e)
{
    unsigned long flags;

    /*
     * An IRQ handler may also grab this lock; plain spin_lock would deadlock
     * if interrupted mid-section on the same CPU. irqsave disables local IRQs.
     * No GFP_KERNEL/kmalloc here: we hold a spinlock and IRQs are off -> atomic
     * context, sleeping is forbidden.
     */
    spin_lock_irqsave(lock, flags);
    list_add_tail(&e->link, q);
    spin_unlock_irqrestore(lock, flags);
}`,
    starter: `#include <linux/list.h>
#include <linux/spinlock.h>

struct ev {
    int code;
    struct list_head link;
};

void enqueue_irqsafe(struct list_head *q, spinlock_t *lock, struct ev *e)
{
    unsigned long flags;

    // TODO: irqsave lock, list_add_tail, irqrestore
}`,
    tags: ['list', 'spinlock', 'atomic'],
  },
  {
    id: 'lx-ch07-c-068',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Drain A List Under Lock Then Process Outside',
    prompt: `Process queued work without holding a lock during the slow part.

State: \`struct list_head q; spinlock_t lock;\` and node \`struct ev { int code; struct list_head link; };\` (kmalloc'd).

Write \`void process_all(struct list_head *q, spinlock_t *lock)\` that:
1. Under \`lock\` (irqsave), splices the entire \`q\` onto a local empty list and re-inits \`q\`, then unlocks.
2. Outside the lock, iterates the local list, calls \`do_work(struct ev *)\` (assume declared) on each, and \`kfree\`s it.

This minimizes lock hold time and lets \`do_work\` sleep safely.`,
    hints: [
      'Declare a local LIST_HEAD(local) and use list_splice_init under the lock.',
      'After unlocking, walk local with list_for_each_entry_safe; do_work may sleep now.',
    ],
    solution: `#include <linux/list.h>
#include <linux/spinlock.h>
#include <linux/slab.h>

struct ev {
    int code;
    struct list_head link;
};

void do_work(struct ev *e);

void process_all(struct list_head *q, spinlock_t *lock)
{
    LIST_HEAD(local);
    struct ev *e, *tmp;
    unsigned long flags;

    spin_lock_irqsave(lock, flags);
    list_splice_init(q, &local);
    spin_unlock_irqrestore(lock, flags);

    /* Lock dropped: safe to do slow / sleeping work. */
    list_for_each_entry_safe(e, tmp, &local, link) {
        list_del(&e->link);
        do_work(e);
        kfree(e);
    }
}`,
    starter: `#include <linux/list.h>
#include <linux/spinlock.h>
#include <linux/slab.h>

struct ev {
    int code;
    struct list_head link;
};

void do_work(struct ev *e);

void process_all(struct list_head *q, spinlock_t *lock)
{
    LIST_HEAD(local);
    struct ev *e, *tmp;
    unsigned long flags;

    // TODO: splice under lock, then process local list unlocked
}`,
    tags: ['list', 'spinlock', 'list_splice'],
  },
  {
    id: 'lx-ch07-c-069',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'IDR Iterate To Copy IDs To User Space',
    prompt: `Walk every (id, ptr) pair in an IDR and copy the ids to a user buffer.

Using \`static DEFINE_IDR(obj_idr);\` storing \`struct obj *\`, implement
\`int dump_ids(int __user *ubuf, int max)\` that:
- iterates the IDR with \`idr_for_each_entry\`,
- writes up to \`max\` ids into \`ubuf\` using \`put_user\` (or \`copy_to_user\`),
- returns the count written, or \`-EFAULT\` if a user copy faults.

Note in a comment that the user copy can fault and must be done in a context where sleeping/faulting is allowed.`,
    hints: [
      'idr_for_each_entry(idr, entry, id) binds both the stored pointer and the integer id.',
      'put_user/copy_to_user can fault and may sleep; never call them holding a spinlock.',
    ],
    solution: `#include <linux/idr.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct obj { int dummy; };

static DEFINE_IDR(obj_idr);

int dump_ids(int __user *ubuf, int max)
{
    struct obj *entry;
    int id;
    int count = 0;

    /* put_user can fault (and thus sleep); valid only in faultable context. */
    idr_for_each_entry(&obj_idr, entry, id) {
        if (count >= max)
            break;
        if (put_user(id, &ubuf[count]))
            return -EFAULT;
        count++;
    }
    return count;
}`,
    starter: `#include <linux/idr.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct obj { int dummy; };

static DEFINE_IDR(obj_idr);

int dump_ids(int __user *ubuf, int max)
{
    struct obj *entry;
    int id;
    int count = 0;

    // TODO: idr_for_each_entry, put_user each id, return count or -EFAULT
}`,
    tags: ['idr', 'copy_to_user', 'iteration'],
  },
  {
    id: 'lx-ch07-c-070',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'kfifo Bridge To User Space',
    prompt: `Drain bytes from a kfifo straight into a user buffer.

The kfifo \`fifo\` holds raw bytes. Implement
\`ssize_t fifo_read_user(struct kfifo *fifo, char __user *ubuf, size_t len)\` that copies up to \`len\` bytes from the fifo to \`ubuf\` using \`kfifo_to_user\`, which handles the user copy internally.

\`kfifo_to_user(fifo, to, len, &copied)\` returns 0 on success and sets \`copied\` to the number of bytes transferred, or a negative errno (\`-EFAULT\`) on fault. Return \`copied\` on success or the negative errno on failure.`,
    hints: [
      'kfifo_to_user does the copy_to_user for you and reports bytes copied via an out param.',
      'Because it touches user memory it can fault/sleep; call it only in process context.',
    ],
    solution: `#include <linux/kfifo.h>
#include <linux/uaccess.h>
#include <linux/types.h>

ssize_t fifo_read_user(struct kfifo *fifo, char __user *ubuf, size_t len)
{
    unsigned int copied;
    int ret;

    /* kfifo_to_user internally does copy_to_user, which may fault/sleep. */
    ret = kfifo_to_user(fifo, ubuf, len, &copied);
    if (ret)
        return ret;

    return copied;
}`,
    starter: `#include <linux/kfifo.h>
#include <linux/uaccess.h>
#include <linux/types.h>

ssize_t fifo_read_user(struct kfifo *fifo, char __user *ubuf, size_t len)
{
    unsigned int copied;
    int ret;

    // TODO: kfifo_to_user, return copied or the negative errno
}`,
    tags: ['kfifo', 'copy_to_user', 'kfifo_to_user'],
  },
]

export default problems
