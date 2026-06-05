import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch07-c-001',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Embed a list_head in a Struct',
    prompt: `Define a struct \`task_item\` that can be linked into a kernel doubly linked list. It must hold an \`int id\` and an embedded \`struct list_head\` member named \`list\`. Include the right header.`,
    hints: [
      'The list node is embedded *inside* your struct, not the other way around.',
      'The type and helpers live in <linux/list.h>.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    // TODO: embed a struct list_head named list
};`,
    tags: ['kernel', 'list', 'list_head'],
  },
  {
    id: 'lx-ch07-c-002',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare and Initialize a List Head',
    prompt: `Statically declare and initialize a list head named \`my_list\` at file scope using the kernel's one-line macro for a list anchor.`,
    hints: [
      'LIST_HEAD(name) both declares and initializes the anchor.',
      'An empty list head points its next and prev back to itself.',
    ],
    solution: `#include <linux/list.h>

LIST_HEAD(my_list);`,
    starter: `#include <linux/list.h>

// TODO: declare and initialize a list head named my_list
`,
    tags: ['kernel', 'list', 'init'],
  },
  {
    id: 'lx-ch07-c-003',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Initialize a List Head at Runtime',
    prompt: `Given \`struct list_head head;\` declared inside a struct, write a function \`void setup(struct list_head *head)\` that initializes it at runtime so it is a valid empty list.`,
    hints: [
      'Use INIT_LIST_HEAD for runtime initialization.',
      'LIST_HEAD is for static declarations; INIT_LIST_HEAD is for dynamic ones.',
    ],
    solution: `#include <linux/list.h>

void setup(struct list_head *head)
{
    INIT_LIST_HEAD(head);
}`,
    starter: `#include <linux/list.h>

void setup(struct list_head *head)
{
    // TODO: initialize head as an empty list
}`,
    tags: ['kernel', 'list', 'init'],
  },
  {
    id: 'lx-ch07-c-004',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Add a Node to the Front of a List',
    prompt: `Given \`struct task_item { int id; struct list_head list; };\` and a head \`struct list_head *head\`, write \`void push_front(struct list_head *head, struct task_item *item)\` that inserts \`item\` at the head (front) of the list.`,
    hints: [
      'list_add(new, head) inserts right after head, i.e. at the front.',
      'Pass the address of the embedded list member, not the struct itself.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void push_front(struct list_head *head, struct task_item *item)
{
    list_add(&item->list, head);
}`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void push_front(struct list_head *head, struct task_item *item)
{
    // TODO: add item->list at the front of the list
}`,
    tags: ['kernel', 'list', 'list_add'],
  },
  {
    id: 'lx-ch07-c-005',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Add a Node to the Tail of a List',
    prompt: `Using the same \`struct task_item\`, write \`void push_back(struct list_head *head, struct task_item *item)\` that appends \`item\` to the end (tail) of the list.`,
    hints: [
      'list_add_tail(new, head) inserts just before head, i.e. at the tail.',
      'Because the list is circular, "before head" is the end of the list.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void push_back(struct list_head *head, struct task_item *item)
{
    list_add_tail(&item->list, head);
}`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void push_back(struct list_head *head, struct task_item *item)
{
    // TODO: append item->list to the tail of the list
}`,
    tags: ['kernel', 'list', 'list_add_tail'],
  },
  {
    id: 'lx-ch07-c-006',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Recover the Enclosing Struct with container_of',
    prompt: `Given \`struct task_item { int id; struct list_head list; };\` and a pointer \`struct list_head *node\` that points to the embedded \`list\` member, write \`struct task_item *to_item(struct list_head *node)\` that returns a pointer to the enclosing \`task_item\`.`,
    hints: [
      'container_of(ptr, type, member) does the pointer arithmetic for you.',
      'The member name here is list.',
    ],
    solution: `#include <linux/list.h>
#include <linux/container_of.h>

struct task_item {
    int id;
    struct list_head list;
};

struct task_item *to_item(struct list_head *node)
{
    return container_of(node, struct task_item, list);
}`,
    starter: `#include <linux/list.h>
#include <linux/container_of.h>

struct task_item {
    int id;
    struct list_head list;
};

struct task_item *to_item(struct list_head *node)
{
    // TODO: use container_of to recover the task_item
}`,
    tags: ['kernel', 'container_of', 'list'],
  },
  {
    id: 'lx-ch07-c-007',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Check Whether a List Is Empty',
    prompt: `Write \`bool is_empty(struct list_head *head)\` that returns \`true\` if the list anchored at \`head\` contains no entries.`,
    hints: [
      'list_empty(head) returns nonzero when the list has no entries.',
      'Include <linux/types.h> for bool, or it comes in via <linux/list.h>.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

bool is_empty(struct list_head *head)
{
    return list_empty(head);
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

bool is_empty(struct list_head *head)
{
    // TODO: return whether the list is empty
}`,
    tags: ['kernel', 'list', 'list_empty'],
  },
  {
    id: 'lx-ch07-c-008',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Remove a Node from a List',
    prompt: `Given a \`struct task_item *item\` currently linked into a list, write \`void unlink(struct task_item *item)\` that removes it from the list. You are NOT freeing it; just unlink it.`,
    hints: [
      'list_del(entry) unlinks a node and poisons its pointers.',
      'Pass &item->list, the embedded node.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void unlink(struct task_item *item)
{
    list_del(&item->list);
}`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void unlink(struct task_item *item)
{
    // TODO: remove item->list from its list
}`,
    tags: ['kernel', 'list', 'list_del'],
  },
  {
    id: 'lx-ch07-c-009',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Get the First Entry of a List',
    prompt: `Given a non-empty list of \`struct task_item\` anchored at \`head\`, write \`struct task_item *first(struct list_head *head)\` that returns the first \`task_item\` in the list. Assume the list is non-empty.`,
    hints: [
      'list_first_entry(head, type, member) returns the enclosing struct of the first node.',
      'It does NOT check for emptiness; the caller guarantees the list is non-empty.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

struct task_item *first(struct list_head *head)
{
    return list_first_entry(head, struct task_item, list);
}`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

struct task_item *first(struct list_head *head)
{
    // TODO: return the first task_item in the list
}`,
    tags: ['kernel', 'list', 'list_first_entry'],
  },
  {
    id: 'lx-ch07-c-010',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define a Bitmap',
    prompt: `Declare a bitmap named \`flags\` capable of holding exactly 128 bits using the kernel's bitmap declaration macro. Include the right header.`,
    hints: [
      'DECLARE_BITMAP(name, nbits) declares an array of unsigned long sized for nbits.',
      'The bitmap helpers and macro live in <linux/bitmap.h> / <linux/types.h>.',
    ],
    solution: `#include <linux/bitmap.h>

DECLARE_BITMAP(flags, 128);`,
    starter: `#include <linux/bitmap.h>

// TODO: declare a 128-bit bitmap named flags
`,
    tags: ['kernel', 'bitmap', 'declare'],
  },
  {
    id: 'lx-ch07-c-011',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Set and Test a Single Bit',
    prompt: `Given \`DECLARE_BITMAP(flags, 64);\`, write \`void set_flag(unsigned long *flags, unsigned int n)\` that sets bit \`n\`, and \`bool flag_is_set(unsigned long *flags, unsigned int n)\` that returns whether bit \`n\` is set.`,
    hints: [
      'set_bit(nr, addr) is atomic; __set_bit is non-atomic. Either sets a single bit.',
      'test_bit(nr, addr) returns the bit value.',
    ],
    solution: `#include <linux/bitmap.h>
#include <linux/bitops.h>
#include <linux/types.h>

void set_flag(unsigned long *flags, unsigned int n)
{
    set_bit(n, flags);
}

bool flag_is_set(unsigned long *flags, unsigned int n)
{
    return test_bit(n, flags);
}`,
    starter: `#include <linux/bitmap.h>
#include <linux/bitops.h>
#include <linux/types.h>

void set_flag(unsigned long *flags, unsigned int n)
{
    // TODO: set bit n
}

bool flag_is_set(unsigned long *flags, unsigned int n)
{
    // TODO: return whether bit n is set
}`,
    tags: ['kernel', 'bitmap', 'bitops'],
  },
  {
    id: 'lx-ch07-c-012',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Embed an hlist_node for Hashing',
    prompt: `Define a struct \`user_entry\` to be stored in a kernel hash table: it must hold a \`u32 uid\`, a \`char name[32]\`, and an embedded \`struct hlist_node\` named \`hnode\`. Include the right header.`,
    hints: [
      'Hash buckets use hlist (single-pointer head, double-pointer node) to save memory.',
      'struct hlist_node is the per-entry node embedded in your struct.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

struct user_entry {
    u32 uid;
    char name[32];
    struct hlist_node hnode;
};`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

struct user_entry {
    u32 uid;
    char name[32];
    // TODO: embed a struct hlist_node named hnode
};`,
    tags: ['kernel', 'hlist', 'hash'],
  },
  {
    id: 'lx-ch07-c-013',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Iterate a List and Sum Ids',
    prompt: `Given a list of \`struct task_item { int id; struct list_head list; };\` anchored at \`head\`, write \`int sum_ids(struct list_head *head)\` that walks the whole list and returns the sum of all \`id\` fields.`,
    hints: [
      'list_for_each_entry(pos, head, member) gives you the enclosing struct each iteration.',
      'pos must be a pointer of your entry type; no container_of needed.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

int sum_ids(struct list_head *head)
{
    struct task_item *pos;
    int total = 0;

    list_for_each_entry(pos, head, list)
        total += pos->id;

    return total;
}`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

int sum_ids(struct list_head *head)
{
    struct task_item *pos;
    int total = 0;

    // TODO: iterate the list and sum pos->id
    return total;
}`,
    tags: ['kernel', 'list', 'iterate'],
  },
  {
    id: 'lx-ch07-c-014',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find an Entry by Id',
    prompt: `Walk a list of \`struct task_item\` anchored at \`head\` and write \`struct task_item *find_by_id(struct list_head *head, int id)\` that returns the first entry whose \`id\` matches, or \`NULL\` if none matches.`,
    hints: [
      'Use list_for_each_entry and return as soon as you find a match.',
      'Return NULL after the loop if nothing matched.',
    ],
    solution: `#include <linux/list.h>
#include <linux/stddef.h>

struct task_item {
    int id;
    struct list_head list;
};

struct task_item *find_by_id(struct list_head *head, int id)
{
    struct task_item *pos;

    list_for_each_entry(pos, head, list)
        if (pos->id == id)
            return pos;

    return NULL;
}`,
    starter: `#include <linux/list.h>
#include <linux/stddef.h>

struct task_item {
    int id;
    struct list_head list;
};

struct task_item *find_by_id(struct list_head *head, int id)
{
    // TODO: search the list for a matching id, else NULL
    return NULL;
}`,
    tags: ['kernel', 'list', 'search'],
  },
  {
    id: 'lx-ch07-c-015',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count the Entries in a List',
    prompt: `Write \`unsigned int count(struct list_head *head)\` that returns the number of entries in the list anchored at \`head\`. Iterate over the raw nodes (you do not need the enclosing struct here).`,
    hints: [
      'list_for_each(pos, head) iterates over struct list_head * nodes.',
      'You can also use list_for_each_entry, but counting only needs the nodes.',
    ],
    solution: `#include <linux/list.h>

unsigned int count(struct list_head *head)
{
    struct list_head *pos;
    unsigned int n = 0;

    list_for_each(pos, head)
        n++;

    return n;
}`,
    starter: `#include <linux/list.h>

unsigned int count(struct list_head *head)
{
    struct list_head *pos;
    unsigned int n = 0;

    // TODO: iterate and count the nodes
    return n;
}`,
    tags: ['kernel', 'list', 'iterate'],
  },
  {
    id: 'lx-ch07-c-016',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Free Every Entry Safely',
    prompt: `Given a list of \`struct task_item\` (each allocated with \`kmalloc\`) anchored at \`head\`, write \`void destroy(struct list_head *head)\` that unlinks and \`kfree\`s every entry. Iteration must be safe against deletion during the walk.`,
    hints: [
      'list_for_each_entry_safe keeps a temporary next pointer so you can delete the current node.',
      'Call list_del before kfree on each entry.',
    ],
    solution: `#include <linux/list.h>
#include <linux/slab.h>

struct task_item {
    int id;
    struct list_head list;
};

void destroy(struct list_head *head)
{
    struct task_item *pos, *tmp;

    list_for_each_entry_safe(pos, tmp, head, list) {
        list_del(&pos->list);
        kfree(pos);
    }
}`,
    starter: `#include <linux/list.h>
#include <linux/slab.h>

struct task_item {
    int id;
    struct list_head list;
};

void destroy(struct list_head *head)
{
    struct task_item *pos, *tmp;

    // TODO: safely unlink and free every entry
}`,
    tags: ['kernel', 'list', 'cleanup'],
  },
  {
    id: 'lx-ch07-c-017',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate and Append a New Item',
    prompt: `Write \`int add_item(struct list_head *head, int id)\` that allocates a \`struct task_item\` with \`kmalloc(..., GFP_KERNEL)\`, sets its \`id\`, appends it to the tail of the list, and returns 0. Return \`-ENOMEM\` if allocation fails.`,
    hints: [
      'GFP_KERNEL is fine here only if not in atomic context.',
      'Check the kmalloc return for NULL before using it.',
    ],
    solution: `#include <linux/list.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct task_item {
    int id;
    struct list_head list;
};

int add_item(struct list_head *head, int id)
{
    struct task_item *item;

    item = kmalloc(sizeof(*item), GFP_KERNEL);
    if (!item)
        return -ENOMEM;

    item->id = id;
    list_add_tail(&item->list, head);
    return 0;
}`,
    starter: `#include <linux/list.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct task_item {
    int id;
    struct list_head list;
};

int add_item(struct list_head *head, int id)
{
    // TODO: kmalloc an item, set id, append, handle -ENOMEM
    return 0;
}`,
    tags: ['kernel', 'list', 'kmalloc'],
  },
  {
    id: 'lx-ch07-c-018',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Move an Entry to Another List',
    prompt: `Write \`void move_to_front(struct list_head *dst, struct task_item *item)\` that detaches \`item\` from whatever list it is in and inserts it at the front of \`dst\` in a single operation.`,
    hints: [
      'list_move(list, head) does del + add in one call.',
      'It both unlinks from the old list and adds to the front of the new one.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void move_to_front(struct list_head *dst, struct task_item *item)
{
    list_move(&item->list, dst);
}`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void move_to_front(struct list_head *dst, struct task_item *item)
{
    // TODO: move item->list to the front of dst
}`,
    tags: ['kernel', 'list', 'list_move'],
  },
  {
    id: 'lx-ch07-c-019',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Move an Entry to the Tail',
    prompt: `Write \`void requeue(struct list_head *dst, struct task_item *item)\` that unlinks \`item\` from its current list and appends it to the tail of \`dst\` in one operation.`,
    hints: [
      'list_move_tail(list, head) moves an entry to the end of another list.',
      'No need for a separate list_del.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void requeue(struct list_head *dst, struct task_item *item)
{
    list_move_tail(&item->list, dst);
}`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

void requeue(struct list_head *dst, struct task_item *item)
{
    // TODO: move item->list to the tail of dst
}`,
    tags: ['kernel', 'list', 'list_move_tail'],
  },
  {
    id: 'lx-ch07-c-020',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pop the First Entry off a List',
    prompt: `Write \`struct task_item *pop_front(struct list_head *head)\` that removes and returns the first entry of the list, or \`NULL\` if the list is empty. Do not free anything; just detach and return it.`,
    hints: [
      'Check list_empty first to handle the empty case.',
      'Use list_first_entry to get the entry, then list_del to detach it.',
    ],
    solution: `#include <linux/list.h>
#include <linux/stddef.h>

struct task_item {
    int id;
    struct list_head list;
};

struct task_item *pop_front(struct list_head *head)
{
    struct task_item *item;

    if (list_empty(head))
        return NULL;

    item = list_first_entry(head, struct task_item, list);
    list_del(&item->list);
    return item;
}`,
    starter: `#include <linux/list.h>
#include <linux/stddef.h>

struct task_item {
    int id;
    struct list_head list;
};

struct task_item *pop_front(struct list_head *head)
{
    // TODO: if empty return NULL, else detach and return first entry
    return NULL;
}`,
    tags: ['kernel', 'list', 'pop'],
  },
  {
    id: 'lx-ch07-c-021',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Iterate a List in Reverse',
    prompt: `Given a list of \`struct task_item\`, write \`int last_id(struct list_head *head)\` that walks the list from the tail toward the head and returns the \`id\` of the last entry (the tail), or \`-1\` if the list is empty. Use a reverse iterator.`,
    hints: [
      'list_for_each_entry_reverse walks from the last entry back to the first.',
      'Return inside the loop on the first iteration, or -1 if it never runs.',
    ],
    solution: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

int last_id(struct list_head *head)
{
    struct task_item *pos;

    list_for_each_entry_reverse(pos, head, list)
        return pos->id;

    return -1;
}`,
    starter: `#include <linux/list.h>

struct task_item {
    int id;
    struct list_head list;
};

int last_id(struct list_head *head)
{
    struct task_item *pos;

    // TODO: reverse-iterate; return first (tail) id, else -1
    return -1;
}`,
    tags: ['kernel', 'list', 'reverse'],
  },
  {
    id: 'lx-ch07-c-022',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Add an Entry to a Hash Bucket',
    prompt: `Given \`struct user_entry { u32 uid; char name[32]; struct hlist_node hnode; };\` and a bucket head \`struct hlist_head *bucket\`, write \`void bucket_add(struct hlist_head *bucket, struct user_entry *e)\` that inserts \`e\` at the head of the bucket.`,
    hints: [
      'hlist_add_head(node, head) inserts at the front of an hlist bucket.',
      'Pass &e->hnode as the node.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

struct user_entry {
    u32 uid;
    char name[32];
    struct hlist_node hnode;
};

void bucket_add(struct hlist_head *bucket, struct user_entry *e)
{
    hlist_add_head(&e->hnode, bucket);
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

struct user_entry {
    u32 uid;
    char name[32];
    struct hlist_node hnode;
};

void bucket_add(struct hlist_head *bucket, struct user_entry *e)
{
    // TODO: add e->hnode at the head of bucket
}`,
    tags: ['kernel', 'hlist', 'hash'],
  },
  {
    id: 'lx-ch07-c-023',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Look Up an Entry in a Hash Bucket',
    prompt: `Write \`struct user_entry *bucket_find(struct hlist_head *bucket, u32 uid)\` that scans an hlist bucket for the entry whose \`uid\` matches, returning it or \`NULL\`. Use the hlist entry iterator.`,
    hints: [
      'hlist_for_each_entry(pos, head, member) iterates and gives the enclosing struct.',
      'Return as soon as uid matches; NULL otherwise.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>
#include <linux/stddef.h>

struct user_entry {
    u32 uid;
    char name[32];
    struct hlist_node hnode;
};

struct user_entry *bucket_find(struct hlist_head *bucket, u32 uid)
{
    struct user_entry *pos;

    hlist_for_each_entry(pos, bucket, hnode)
        if (pos->uid == uid)
            return pos;

    return NULL;
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>
#include <linux/stddef.h>

struct user_entry {
    u32 uid;
    char name[32];
    struct hlist_node hnode;
};

struct user_entry *bucket_find(struct hlist_head *bucket, u32 uid)
{
    // TODO: iterate the bucket; return matching entry or NULL
    return NULL;
}`,
    tags: ['kernel', 'hlist', 'search'],
  },
  {
    id: 'lx-ch07-c-024',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Remove an Entry from a Hash Bucket',
    prompt: `Write \`void bucket_del(struct user_entry *e)\` that removes \`e\` from its hash bucket. Then write \`bool is_hashed(struct user_entry *e)\` that reports whether \`e\` is currently linked into a bucket.`,
    hints: [
      'hlist_del unlinks an hlist node; hlist_del_init also re-inits it so it can be safely tested.',
      'hlist_unhashed(node) reports whether a node is currently in a bucket.',
    ],
    solution: `#include <linux/list.h>
#include <linux/types.h>

struct user_entry {
    u32 uid;
    char name[32];
    struct hlist_node hnode;
};

void bucket_del(struct user_entry *e)
{
    hlist_del_init(&e->hnode);
}

bool is_hashed(struct user_entry *e)
{
    return !hlist_unhashed(&e->hnode);
}`,
    starter: `#include <linux/list.h>
#include <linux/types.h>

struct user_entry {
    u32 uid;
    char name[32];
    struct hlist_node hnode;
};

void bucket_del(struct user_entry *e)
{
    // TODO: unlink e->hnode (and re-init it)
}

bool is_hashed(struct user_entry *e)
{
    // TODO: report whether e->hnode is in a bucket
}`,
    tags: ['kernel', 'hlist', 'hash'],
  },
  {
    id: 'lx-ch07-c-025',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Declare and Init a kfifo',
    prompt: `Write \`int fifo_setup(struct kfifo *fifo)\` that dynamically allocates a kfifo of 1024 \`u8\` elements using \`kfifo_alloc\` with \`GFP_KERNEL\`, returning the result code (0 on success, negative errno on failure).`,
    hints: [
      'kfifo_alloc(fifo, size, gfp) allocates the buffer; size is rounded up to a power of two.',
      'It returns 0 on success or a negative error code.',
    ],
    solution: `#include <linux/kfifo.h>
#include <linux/slab.h>

int fifo_setup(struct kfifo *fifo)
{
    return kfifo_alloc(fifo, 1024, GFP_KERNEL);
}`,
    starter: `#include <linux/kfifo.h>
#include <linux/slab.h>

int fifo_setup(struct kfifo *fifo)
{
    // TODO: kfifo_alloc 1024 bytes with GFP_KERNEL and return the result
}`,
    tags: ['kernel', 'kfifo', 'alloc'],
  },
  {
    id: 'lx-ch07-c-026',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Produce Into a kfifo',
    prompt: `Write \`unsigned int produce(struct kfifo *fifo, u8 *buf, unsigned int len)\` that pushes up to \`len\` bytes from \`buf\` into the fifo and returns the number of bytes actually queued (which may be less if the fifo is nearly full).`,
    hints: [
      'kfifo_in(fifo, from, len) copies in and returns how many elements it stored.',
      'A single producer / single consumer kfifo needs no extra lock.',
    ],
    solution: `#include <linux/kfifo.h>
#include <linux/types.h>

unsigned int produce(struct kfifo *fifo, u8 *buf, unsigned int len)
{
    return kfifo_in(fifo, buf, len);
}`,
    starter: `#include <linux/kfifo.h>
#include <linux/types.h>

unsigned int produce(struct kfifo *fifo, u8 *buf, unsigned int len)
{
    // TODO: push up to len bytes and return how many were queued
}`,
    tags: ['kernel', 'kfifo', 'producer'],
  },
  {
    id: 'lx-ch07-c-027',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Consume From a kfifo',
    prompt: `Write \`unsigned int consume(struct kfifo *fifo, u8 *buf, unsigned int len)\` that pulls up to \`len\` bytes out of the fifo into \`buf\` and returns how many bytes were actually copied out. Also write \`bool fifo_empty(struct kfifo *fifo)\`.`,
    hints: [
      'kfifo_out(fifo, to, len) removes elements and returns how many it copied.',
      'kfifo_is_empty(fifo) reports emptiness.',
    ],
    solution: `#include <linux/kfifo.h>
#include <linux/types.h>

unsigned int consume(struct kfifo *fifo, u8 *buf, unsigned int len)
{
    return kfifo_out(fifo, buf, len);
}

bool fifo_empty(struct kfifo *fifo)
{
    return kfifo_is_empty(fifo);
}`,
    starter: `#include <linux/kfifo.h>
#include <linux/types.h>

unsigned int consume(struct kfifo *fifo, u8 *buf, unsigned int len)
{
    // TODO: pull up to len bytes out and return how many
}

bool fifo_empty(struct kfifo *fifo)
{
    // TODO: report whether the fifo is empty
}`,
    tags: ['kernel', 'kfifo', 'consumer'],
  },
  {
    id: 'lx-ch07-c-028',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Free a kfifo',
    prompt: `Write \`void fifo_teardown(struct kfifo *fifo)\` that releases a kfifo previously created with \`kfifo_alloc\`. Explain in a comment why you must not use it after this.`,
    hints: [
      'kfifo_free frees the buffer that kfifo_alloc allocated.',
      'After freeing, the fifo must be re-allocated before reuse.',
    ],
    solution: `#include <linux/kfifo.h>

void fifo_teardown(struct kfifo *fifo)
{
    /* Frees the backing buffer; the fifo is unusable until re-allocated. */
    kfifo_free(fifo);
}`,
    starter: `#include <linux/kfifo.h>

void fifo_teardown(struct kfifo *fifo)
{
    // TODO: free the kfifo allocated with kfifo_alloc
}`,
    tags: ['kernel', 'kfifo', 'cleanup'],
  },
  {
    id: 'lx-ch07-c-029',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Define an rbtree Node Struct',
    prompt: `Define a struct \`kv_node\` for storage in a red-black tree: it must hold a \`u32 key\`, an \`int value\`, and an embedded \`struct rb_node\` named \`node\`. Also declare an empty tree root \`struct rb_root tree = RB_ROOT;\`. Include the right header.`,
    hints: [
      'struct rb_node is the embedded node; struct rb_root is the tree anchor.',
      'RB_ROOT initializes an empty tree.',
    ],
    solution: `#include <linux/rbtree.h>
#include <linux/types.h>

struct kv_node {
    u32 key;
    int value;
    struct rb_node node;
};

struct rb_root tree = RB_ROOT;`,
    starter: `#include <linux/rbtree.h>
#include <linux/types.h>

struct kv_node {
    u32 key;
    int value;
    // TODO: embed a struct rb_node named node
};

// TODO: declare an empty rb_root named tree
`,
    tags: ['kernel', 'rbtree', 'struct'],
  },
  {
    id: 'lx-ch07-c-030',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Search a Red-Black Tree',
    prompt: `Given the rbtree of \`struct kv_node\` keyed by \`key\`, write \`struct kv_node *rb_search(struct rb_root *root, u32 key)\` that descends the tree (left if key is smaller, right if larger) and returns the matching node or \`NULL\`.`,
    hints: [
      'Start at root->rb_node and walk using rb_entry/container_of.',
      'rb_entry(ptr, type, member) is just container_of for rb_node.',
    ],
    solution: `#include <linux/rbtree.h>
#include <linux/types.h>
#include <linux/stddef.h>

struct kv_node {
    u32 key;
    int value;
    struct rb_node node;
};

struct kv_node *rb_search(struct rb_root *root, u32 key)
{
    struct rb_node *n = root->rb_node;

    while (n) {
        struct kv_node *cur = rb_entry(n, struct kv_node, node);

        if (key < cur->key)
            n = n->rb_left;
        else if (key > cur->key)
            n = n->rb_right;
        else
            return cur;
    }
    return NULL;
}`,
    starter: `#include <linux/rbtree.h>
#include <linux/types.h>
#include <linux/stddef.h>

struct kv_node {
    u32 key;
    int value;
    struct rb_node node;
};

struct kv_node *rb_search(struct rb_root *root, u32 key)
{
    struct rb_node *n = root->rb_node;

    // TODO: descend the tree comparing key; return match or NULL
    return NULL;
}`,
    tags: ['kernel', 'rbtree', 'search'],
  },
  {
    id: 'lx-ch07-c-031',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Insert Into a Red-Black Tree',
    prompt: `Write \`bool rb_insert(struct rb_root *root, struct kv_node *new)\` that inserts \`new\` into the keyed rbtree. Find the link and parent, link the node with \`rb_link_node\`, then rebalance with \`rb_insert_color\`. Return \`false\` (and do not insert) if a node with the same key already exists.`,
    hints: [
      'Track the address of the child pointer (struct rb_node **link) and the parent.',
      'After rb_link_node(&new->node, parent, link), call rb_insert_color to rebalance.',
    ],
    solution: `#include <linux/rbtree.h>
#include <linux/types.h>

struct kv_node {
    u32 key;
    int value;
    struct rb_node node;
};

bool rb_insert(struct rb_root *root, struct kv_node *new)
{
    struct rb_node **link = &root->rb_node;
    struct rb_node *parent = NULL;

    while (*link) {
        struct kv_node *cur = rb_entry(*link, struct kv_node, node);

        parent = *link;
        if (new->key < cur->key)
            link = &(*link)->rb_left;
        else if (new->key > cur->key)
            link = &(*link)->rb_right;
        else
            return false;
    }

    rb_link_node(&new->node, parent, link);
    rb_insert_color(&new->node, root);
    return true;
}`,
    starter: `#include <linux/rbtree.h>
#include <linux/types.h>

struct kv_node {
    u32 key;
    int value;
    struct rb_node node;
};

bool rb_insert(struct rb_root *root, struct kv_node *new)
{
    struct rb_node **link = &root->rb_node;
    struct rb_node *parent = NULL;

    // TODO: find the slot, reject duplicates, link and recolor
    return true;
}`,
    tags: ['kernel', 'rbtree', 'insert'],
  },
  {
    id: 'lx-ch07-c-032',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate an Id with IDR',
    prompt: `Given a \`struct idr *idr\` (already initialized) and a \`void *ptr\`, write \`int store(struct idr *idr, void *ptr)\` that allocates a new id mapping to \`ptr\` in the range [0, INT_MAX] using \`GFP_KERNEL\`, returning the new id or a negative error code.`,
    hints: [
      'idr_alloc(idr, ptr, start, end, gfp) returns the new id (end is exclusive; 0 means INT_MAX+1).',
      'A negative return is an error such as -ENOMEM or -ENOSPC.',
    ],
    solution: `#include <linux/idr.h>
#include <linux/slab.h>

int store(struct idr *idr, void *ptr)
{
    return idr_alloc(idr, ptr, 0, 0, GFP_KERNEL);
}`,
    starter: `#include <linux/idr.h>
#include <linux/slab.h>

int store(struct idr *idr, void *ptr)
{
    // TODO: idr_alloc ptr over [0, INT_MAX] with GFP_KERNEL
}`,
    tags: ['kernel', 'idr', 'alloc'],
  },
  {
    id: 'lx-ch07-c-033',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Look Up and Remove an IDR Mapping',
    prompt: `Write \`void *fetch(struct idr *idr, int id)\` that returns the pointer mapped to \`id\` (or \`NULL\`), and \`void drop(struct idr *idr, int id)\` that removes the mapping for \`id\`.`,
    hints: [
      'idr_find(idr, id) returns the stored pointer or NULL.',
      'idr_remove(idr, id) removes the mapping (and returns the old pointer).',
    ],
    solution: `#include <linux/idr.h>

void *fetch(struct idr *idr, int id)
{
    return idr_find(idr, id);
}

void drop(struct idr *idr, int id)
{
    idr_remove(idr, id);
}`,
    starter: `#include <linux/idr.h>

void *fetch(struct idr *idr, int id)
{
    // TODO: return the pointer mapped to id, or NULL
}

void drop(struct idr *idr, int id)
{
    // TODO: remove the mapping for id
}`,
    tags: ['kernel', 'idr', 'lookup'],
  },
  {
    id: 'lx-ch07-c-034',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find and Reserve a Free Bitmap Bit',
    prompt: `Given \`DECLARE_BITMAP(slots, 256);\`, write \`int reserve(unsigned long *slots)\` that finds the first zero bit, sets it (claims it), and returns its index. Return \`-ENOSPC\` if all 256 bits are already set.`,
    hints: [
      'find_first_zero_bit(addr, size) returns the index of the first 0 bit, or size if none.',
      'If the index equals the size, the bitmap is full.',
    ],
    solution: `#include <linux/bitmap.h>
#include <linux/bitops.h>
#include <linux/find.h>
#include <linux/errno.h>

int reserve(unsigned long *slots)
{
    unsigned int bit = find_first_zero_bit(slots, 256);

    if (bit >= 256)
        return -ENOSPC;

    set_bit(bit, slots);
    return bit;
}`,
    starter: `#include <linux/bitmap.h>
#include <linux/bitops.h>
#include <linux/find.h>
#include <linux/errno.h>

int reserve(unsigned long *slots)
{
    // TODO: find first zero bit; if none return -ENOSPC; else set and return it
    return -ENOSPC;
}`,
    tags: ['kernel', 'bitmap', 'allocator'],
  },
  {
    id: 'lx-ch07-c-035',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Splice One List Onto Another',
    prompt: `Write \`void merge(struct list_head *dst, struct list_head *src)\` that moves all entries from the \`src\` list onto the front of the \`dst\` list and leaves \`src\` reinitialized as an empty list (so it is safe to reuse).`,
    hints: [
      'list_splice_init(src, dst) moves src into dst and reinitializes src.',
      'Plain list_splice would leave src in an invalid state.',
    ],
    solution: `#include <linux/list.h>

void merge(struct list_head *dst, struct list_head *src)
{
    list_splice_init(src, dst);
}`,
    starter: `#include <linux/list.h>

void merge(struct list_head *dst, struct list_head *src)
{
    // TODO: splice src onto the front of dst and re-init src
}`,
    tags: ['kernel', 'list', 'splice'],
  },
]

export default problems
