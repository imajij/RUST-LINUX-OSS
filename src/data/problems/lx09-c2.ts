import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch09-c-036',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Allocate and Free a Struct With kmalloc',
    prompt: `Write struct foo *alloc_foo(void) that allocates one struct foo with kmalloc using GFP_KERNEL and returns the pointer (or NULL on failure). Also write void free_foo(struct foo *f) that frees it. struct foo has an int id and a char name[16]. Do not zero the memory.`,
    hints: [
      'sizeof(*f) gives the right size and survives struct changes.',
      'kfree(NULL) is safe, so free_foo can be unconditional.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/gfp.h>

struct foo {
    int id;
    char name[16];
};

struct foo *alloc_foo(void)
{
    struct foo *f = kmalloc(sizeof(*f), GFP_KERNEL);

    if (!f)
        return NULL;
    return f;
}

void free_foo(struct foo *f)
{
    kfree(f);
}`,
    starter: `#include <linux/slab.h>
#include <linux/gfp.h>

struct foo {
    int id;
    char name[16];
};

struct foo *alloc_foo(void)
{
    // TODO: kmalloc one struct foo with GFP_KERNEL
    return NULL;
}

void free_foo(struct foo *f)
{
    // TODO: free it
}`,
    tags: ['kmalloc', 'kfree', 'gfp_kernel'],
  },
  {
    id: 'lx-ch09-c-037',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Zeroed Allocation With kzalloc',
    prompt: `Write struct counters *alloc_counters(void) that allocates one struct counters and guarantees every field starts at zero, using a single allocation call (not kmalloc followed by memset). Return NULL on failure. struct counters has unsigned long hits and unsigned long misses.`,
    hints: [
      'kzalloc(size, flags) allocates and zeroes in one step.',
      'It is equivalent to kmalloc + memset but clearer and atomic.',
    ],
    solution: `#include <linux/slab.h>

struct counters {
    unsigned long hits;
    unsigned long misses;
};

struct counters *alloc_counters(void)
{
    return kzalloc(sizeof(struct counters), GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

struct counters {
    unsigned long hits;
    unsigned long misses;
};

struct counters *alloc_counters(void)
{
    // TODO: allocate zeroed memory in one call
    return NULL;
}`,
    tags: ['kzalloc', 'gfp_kernel', 'init'],
  },
  {
    id: 'lx-ch09-c-038',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Allocate an Array With kmalloc_array',
    prompt: `Write u32 *alloc_table(size_t n) that allocates an array of n u32 values with GFP_KERNEL using an API that checks for multiplication overflow. Return NULL on failure. Then write void free_table(u32 *t) to release it.`,
    hints: [
      'kmalloc_array(n, size, flags) guards against n * size overflowing.',
      'Prefer it over kmalloc(n * sizeof(u32), ...) for untrusted n.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/types.h>

u32 *alloc_table(size_t n)
{
    return kmalloc_array(n, sizeof(u32), GFP_KERNEL);
}

void free_table(u32 *t)
{
    kfree(t);
}`,
    starter: `#include <linux/slab.h>
#include <linux/types.h>

u32 *alloc_table(size_t n)
{
    // TODO: overflow-checked array allocation
    return NULL;
}

void free_table(u32 *t)
{
    // TODO
}`,
    tags: ['kmalloc_array', 'overflow', 'arrays'],
  },
  {
    id: 'lx-ch09-c-039',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Zeroed Array With kcalloc',
    prompt: `Write int *make_histogram(size_t buckets) that allocates an array of "buckets" ints, all initialized to zero, using the overflow-checked zeroing array allocator. Return NULL on failure.`,
    hints: [
      'kcalloc(n, size, flags) is the zeroing, overflow-checked array allocator.',
      'It is to kmalloc_array what kzalloc is to kmalloc.',
    ],
    solution: `#include <linux/slab.h>

int *make_histogram(size_t buckets)
{
    return kcalloc(buckets, sizeof(int), GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

int *make_histogram(size_t buckets)
{
    // TODO: zeroed, overflow-checked array allocation
    return NULL;
}`,
    tags: ['kcalloc', 'arrays', 'zeroing'],
  },
  {
    id: 'lx-ch09-c-040',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Duplicate a Byte Buffer With kmemdup',
    prompt: `Write void *copy_blob(const void *src, size_t len) that returns a freshly kmalloc'd copy of len bytes from src, using GFP_KERNEL. Return NULL on failure. Use the kernel helper that allocates and copies in one call.`,
    hints: [
      'kmemdup(src, len, flags) allocates len bytes and memcpys src into them.',
      'It returns NULL if the underlying allocation fails.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/string.h>

void *copy_blob(const void *src, size_t len)
{
    return kmemdup(src, len, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>
#include <linux/string.h>

void *copy_blob(const void *src, size_t len)
{
    // TODO: allocate and copy in one call
    return NULL;
}`,
    tags: ['kmemdup', 'copy', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-041',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Duplicate a String With kstrdup',
    prompt: `Write char *dup_name(const char *s) that returns a kernel-heap copy of the NUL-terminated string s (including the terminator), allocated with GFP_KERNEL. Return NULL on failure. Use the dedicated string-duplication helper.`,
    hints: [
      'kstrdup(s, flags) sizes the allocation as strlen(s) + 1 and copies.',
      'kstrdup(NULL, flags) returns NULL, which is safe to handle.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/string.h>

char *dup_name(const char *s)
{
    return kstrdup(s, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>
#include <linux/string.h>

char *dup_name(const char *s)
{
    // TODO: duplicate the string onto the kernel heap
    return NULL;
}`,
    tags: ['kstrdup', 'strings', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-042',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Choose GFP_ATOMIC in an Interrupt Handler',
    prompt: `An IRQ handler must allocate a small struct event without sleeping. Write irqreturn_t my_irq(int irq, void *dev) that allocates struct event with the correct GFP flag for atomic (non-sleeping) context, fills ev->seq = 1, and returns IRQ_HANDLED. If allocation fails, return IRQ_NONE without dereferencing the pointer. struct event has an int seq.`,
    hints: [
      'Interrupt context cannot sleep, so GFP_KERNEL (which may sleep) is illegal.',
      'GFP_ATOMIC tells the allocator never to block or reclaim by sleeping.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/interrupt.h>

struct event {
    int seq;
};

irqreturn_t my_irq(int irq, void *dev)
{
    struct event *ev = kmalloc(sizeof(*ev), GFP_ATOMIC);

    if (!ev)
        return IRQ_NONE;

    ev->seq = 1;
    return IRQ_HANDLED;
}`,
    starter: `#include <linux/slab.h>
#include <linux/interrupt.h>

struct event {
    int seq;
};

irqreturn_t my_irq(int irq, void *dev)
{
    // TODO: allocate without sleeping; handle failure
    return IRQ_NONE;
}`,
    tags: ['gfp_atomic', 'interrupt', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-043',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Allocate While Holding a Spinlock',
    prompt: `A spinlock 'lock' is already held when entering add_locked(). Write int add_locked(void) that allocates struct node with kmalloc while the spinlock is held, returning -ENOMEM on failure and 0 on success. Pick the GFP flag that is legal under a held spinlock. struct node has a long val.`,
    hints: [
      'Holding a spinlock disables preemption and forbids sleeping.',
      'A sleeping allocation under a spinlock is a bug; use the non-sleeping flag.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/errno.h>

struct node {
    long val;
};

int add_locked(void)
{
    struct node *n = kmalloc(sizeof(*n), GFP_ATOMIC);

    if (!n)
        return -ENOMEM;

    n->val = 0;
    return 0;
}`,
    starter: `#include <linux/slab.h>
#include <linux/errno.h>

struct node {
    long val;
};

/* called with spinlock 'lock' already held */
int add_locked(void)
{
    // TODO: allocate with a spinlock-safe GFP flag
    return -ENOMEM;
}`,
    tags: ['gfp_atomic', 'spinlock', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-044',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Large Virtually Contiguous Buffer With vmalloc',
    prompt: `Write void *alloc_big(size_t bytes) that allocates a multi-megabyte buffer that only needs to be virtually contiguous (not physically contiguous). Use the allocator suited for large allocations. Write void free_big(void *p) to release it.`,
    hints: [
      'kmalloc returns physically contiguous memory and struggles with large sizes.',
      'vmalloc maps scattered pages into a contiguous virtual range; free with vfree.',
    ],
    solution: `#include <linux/vmalloc.h>

void *alloc_big(size_t bytes)
{
    return vmalloc(bytes);
}

void free_big(void *p)
{
    vfree(p);
}`,
    starter: `#include <linux/vmalloc.h>

void *alloc_big(size_t bytes)
{
    // TODO: large virtually-contiguous allocation
    return NULL;
}

void free_big(void *p)
{
    // TODO: matching free
}`,
    tags: ['vmalloc', 'vfree', 'large-buffer'],
  },
  {
    id: 'lx-ch09-c-045',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Zeroed Large Buffer With vzalloc',
    prompt: `Write u8 *alloc_zeroed_region(size_t bytes) that returns a large, zero-initialized, virtually-contiguous buffer in a single call (no separate memset). Return NULL on failure.`,
    hints: [
      'vzalloc allocates large virtually-contiguous memory and zeroes it.',
      'It is the vmalloc analogue of kzalloc; free it with vfree.',
    ],
    solution: `#include <linux/vmalloc.h>
#include <linux/types.h>

u8 *alloc_zeroed_region(size_t bytes)
{
    return vzalloc(bytes);
}`,
    starter: `#include <linux/vmalloc.h>
#include <linux/types.h>

u8 *alloc_zeroed_region(size_t bytes)
{
    // TODO: large zeroed virtually-contiguous buffer
    return NULL;
}`,
    tags: ['vzalloc', 'large-buffer', 'zeroing'],
  },
  {
    id: 'lx-ch09-c-046',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Allocate Raw Pages With __get_free_pages',
    prompt: `Write unsigned long get_four_pages(void) that allocates 4 contiguous pages with __get_free_pages(GFP_KERNEL, order) and returns the address (0 on failure). Compute the correct order for 4 pages. Write void put_four_pages(unsigned long addr) that frees them with the matching order.`,
    hints: [
      'order is a power of two: 4 pages == 2^2, so order = 2.',
      'free_pages(addr, order) must use the same order as the allocation.',
    ],
    solution: `#include <linux/gfp.h>

unsigned long get_four_pages(void)
{
    /* 4 pages == 2^2, so order 2 */
    return __get_free_pages(GFP_KERNEL, 2);
}

void put_four_pages(unsigned long addr)
{
    free_pages(addr, 2);
}`,
    starter: `#include <linux/gfp.h>

unsigned long get_four_pages(void)
{
    // TODO: allocate 4 contiguous pages, return 0 on failure
    return 0;
}

void put_four_pages(unsigned long addr)
{
    // TODO: free with the matching order
}`,
    tags: ['get_free_pages', 'order', 'pages'],
  },
  {
    id: 'lx-ch09-c-047',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Single Page With __get_free_page',
    prompt: `Write unsigned long get_one_page(void) that allocates exactly one zeroed page and returns its kernel address (0 on failure), using the single-page convenience helper with the zeroing flag. Write void put_one_page(unsigned long addr) to free it.`,
    hints: [
      '__get_free_page(flags) is shorthand for order 0 (one page).',
      'Add __GFP_ZERO (e.g. GFP_KERNEL | __GFP_ZERO) to get a zeroed page; free_page frees one page.',
    ],
    solution: `#include <linux/gfp.h>

unsigned long get_one_page(void)
{
    return __get_free_page(GFP_KERNEL | __GFP_ZERO);
}

void put_one_page(unsigned long addr)
{
    free_page(addr);
}`,
    starter: `#include <linux/gfp.h>

unsigned long get_one_page(void)
{
    // TODO: one zeroed page
    return 0;
}

void put_one_page(unsigned long addr)
{
    // TODO: free one page
}`,
    tags: ['get_free_page', 'pages', 'gfp_zero'],
  },
  {
    id: 'lx-ch09-c-048',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Allocate From the DMA Zone',
    prompt: `Some legacy hardware can only address low memory. Write void *alloc_dma_buf(size_t bytes) that uses kmalloc but adds the flag that forces the allocation to come from the low DMA zone. Return NULL on failure.`,
    hints: [
      'GFP_DMA steers the allocation into ZONE_DMA (low physical addresses).',
      'Combine it with a base flag: GFP_KERNEL | GFP_DMA.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/gfp.h>

void *alloc_dma_buf(size_t bytes)
{
    return kmalloc(bytes, GFP_KERNEL | GFP_DMA);
}`,
    starter: `#include <linux/slab.h>
#include <linux/gfp.h>

void *alloc_dma_buf(size_t bytes)
{
    // TODO: force allocation from the DMA zone
    return NULL;
}`,
    tags: ['gfp_dma', 'zones', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-049',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Allocate Then Copy In From User Space',
    prompt: `Write a write helper ssize_t store_user(const char __user *ubuf, size_t len) that kmalloc's len bytes with GFP_KERNEL, copies the data in from user space, and returns len on success. On allocation failure return -ENOMEM; if the copy faults return -EFAULT (freeing the buffer first). Free the buffer on success too (no caller holds it).`,
    hints: [
      'copy_from_user can fault and returns the number of bytes NOT copied.',
      'A non-zero return means -EFAULT; always free before returning on error.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

ssize_t store_user(const char __user *ubuf, size_t len)
{
    char *kbuf = kmalloc(len, GFP_KERNEL);

    if (!kbuf)
        return -ENOMEM;

    if (copy_from_user(kbuf, ubuf, len)) {
        kfree(kbuf);
        return -EFAULT;
    }

    /* ... use kbuf ... */
    kfree(kbuf);
    return len;
}`,
    starter: `#include <linux/slab.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

ssize_t store_user(const char __user *ubuf, size_t len)
{
    // TODO: allocate, copy_from_user, handle -ENOMEM / -EFAULT, free
    return 0;
}`,
    tags: ['kmalloc', 'copy_from_user', 'error-handling'],
  },
  {
    id: 'lx-ch09-c-050',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Create a Simple kmem_cache',
    prompt: `Write struct kmem_cache *create_obj_cache(void) that creates a slab cache named "myobj" for objects of size sizeof(struct obj), with default alignment (0), no special flags (0), and no constructor (NULL). Return the cache pointer (or NULL on failure). struct obj has an int x and a void *next.`,
    hints: [
      'kmem_cache_create(name, size, align, flags, ctor) builds the cache.',
      'Pass align=0 for the default and ctor=NULL for no constructor.',
    ],
    solution: `#include <linux/slab.h>

struct obj {
    int x;
    void *next;
};

struct kmem_cache *create_obj_cache(void)
{
    return kmem_cache_create("myobj", sizeof(struct obj),
                             0, 0, NULL);
}`,
    starter: `#include <linux/slab.h>

struct obj {
    int x;
    void *next;
};

struct kmem_cache *create_obj_cache(void)
{
    // TODO: create a slab cache for struct obj
    return NULL;
}`,
    tags: ['kmem_cache', 'slab', 'create'],
  },
  {
    id: 'lx-ch09-c-051',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Allocate and Free Objects From a kmem_cache',
    prompt: `Given a global struct kmem_cache *obj_cache, write struct obj *obj_get(void) that allocates one object from the cache with GFP_KERNEL (NULL on failure), and void obj_put(struct obj *o) that returns it to the same cache. struct obj has an int x.`,
    hints: [
      'kmem_cache_alloc(cache, flags) pulls one object from the cache.',
      'kmem_cache_free(cache, obj) must use the SAME cache the object came from.',
    ],
    solution: `#include <linux/slab.h>

struct obj {
    int x;
};

extern struct kmem_cache *obj_cache;

struct obj *obj_get(void)
{
    return kmem_cache_alloc(obj_cache, GFP_KERNEL);
}

void obj_put(struct obj *o)
{
    kmem_cache_free(obj_cache, o);
}`,
    starter: `#include <linux/slab.h>

struct obj {
    int x;
};

extern struct kmem_cache *obj_cache;

struct obj *obj_get(void)
{
    // TODO: allocate from obj_cache
    return NULL;
}

void obj_put(struct obj *o)
{
    // TODO: free back to obj_cache
}`,
    tags: ['kmem_cache', 'slab', 'alloc-free'],
  },
  {
    id: 'lx-ch09-c-052',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Zeroed Object From a Slab Cache',
    prompt: `Given struct kmem_cache *obj_cache, write struct obj *obj_get_zeroed(void) that returns a cache object whose memory is zero-initialized, using a single allocation call (not a separate memset). Return NULL on failure.`,
    hints: [
      'kmem_cache_zalloc(cache, flags) is the zeroing variant of kmem_cache_alloc.',
      'Equivalent to kmem_cache_alloc with __GFP_ZERO.',
    ],
    solution: `#include <linux/slab.h>

struct obj {
    int x;
    long y;
};

extern struct kmem_cache *obj_cache;

struct obj *obj_get_zeroed(void)
{
    return kmem_cache_zalloc(obj_cache, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

struct obj {
    int x;
    long y;
};

extern struct kmem_cache *obj_cache;

struct obj *obj_get_zeroed(void)
{
    // TODO: zeroed object from the cache
    return NULL;
}`,
    tags: ['kmem_cache', 'zalloc', 'slab'],
  },
  {
    id: 'lx-ch09-c-053',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Module Init/Exit Owning a kmem_cache',
    prompt: `Write a module that on init creates a slab cache "myobj" for struct obj into the global struct kmem_cache *obj_cache, returning -ENOMEM if creation fails and 0 otherwise. On exit, destroy the cache. Provide myobj_init(void) and myobj_exit(void). struct obj has a u64 id.`,
    hints: [
      'kmem_cache_create returns NULL on failure: translate to -ENOMEM.',
      'kmem_cache_destroy(cache) in exit; all objects must already be freed.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/module.h>
#include <linux/errno.h>
#include <linux/types.h>

struct obj {
    u64 id;
};

struct kmem_cache *obj_cache;

int myobj_init(void)
{
    obj_cache = kmem_cache_create("myobj", sizeof(struct obj),
                                  0, 0, NULL);
    if (!obj_cache)
        return -ENOMEM;
    return 0;
}

void myobj_exit(void)
{
    kmem_cache_destroy(obj_cache);
}`,
    starter: `#include <linux/slab.h>
#include <linux/module.h>
#include <linux/errno.h>
#include <linux/types.h>

struct obj {
    u64 id;
};

struct kmem_cache *obj_cache;

int myobj_init(void)
{
    // TODO: create cache, return -ENOMEM on failure
    return 0;
}

void myobj_exit(void)
{
    // TODO: destroy the cache
}`,
    tags: ['kmem_cache', 'module', 'lifecycle'],
  },
  {
    id: 'lx-ch09-c-054',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Cacheline-Aligned Hardware Slab',
    prompt: `Write struct kmem_cache *create_hw_cache(void) creating a slab cache "hwobj" for struct hwobj whose objects are aligned to a hardware cache line (to avoid false sharing between objects). Use the appropriate SLAB flag and align argument 0. Return NULL on failure.`,
    hints: [
      'SLAB_HWCACHE_ALIGN pads/aligns objects to the CPU cache line.',
      'Pass it as the flags argument; keep the explicit align argument 0.',
    ],
    solution: `#include <linux/slab.h>

struct hwobj {
    unsigned long a;
    unsigned long b;
};

struct kmem_cache *create_hw_cache(void)
{
    return kmem_cache_create("hwobj", sizeof(struct hwobj),
                             0, SLAB_HWCACHE_ALIGN, NULL);
}`,
    starter: `#include <linux/slab.h>

struct hwobj {
    unsigned long a;
    unsigned long b;
};

struct kmem_cache *create_hw_cache(void)
{
    // TODO: cacheline-aligned slab cache
    return NULL;
}`,
    tags: ['kmem_cache', 'alignment', 'cacheline'],
  },
  {
    id: 'lx-ch09-c-055',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Report Allocated Slab Object Size With ksize',
    prompt: `Write size_t actual_size(size_t want) that kmalloc's "want" bytes with GFP_KERNEL, queries the real usable size of the returned object, frees it, and returns that real size. Return 0 if the allocation fails.`,
    hints: [
      'kmalloc rounds up to a slab size class, so usable bytes >= requested.',
      'ksize(ptr) returns the actual number of usable bytes.',
    ],
    solution: `#include <linux/slab.h>

size_t actual_size(size_t want)
{
    void *p = kmalloc(want, GFP_KERNEL);
    size_t real;

    if (!p)
        return 0;

    real = ksize(p);
    kfree(p);
    return real;
}`,
    starter: `#include <linux/slab.h>

size_t actual_size(size_t want)
{
    // TODO: kmalloc, read ksize, free, return real size
    return 0;
}`,
    tags: ['ksize', 'slab', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-056',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Grow a Buffer With krealloc',
    prompt: `Write char *grow_buf(char *old, size_t newlen) that resizes a kmalloc'd buffer to newlen bytes using GFP_KERNEL, preserving existing contents. Return the (possibly moved) new pointer, or NULL on failure. On a NULL return the original block must NOT be leaked from the caller's perspective; explain in a comment that the caller keeps 'old' valid on failure.`,
    hints: [
      'krealloc(old, newsize, flags) grows/shrinks and copies the old contents.',
      'If krealloc returns NULL, the original block is still valid and must be freed by the caller.',
    ],
    solution: `#include <linux/slab.h>

char *grow_buf(char *old, size_t newlen)
{
    char *new = krealloc(old, newlen, GFP_KERNEL);

    /*
     * On failure krealloc returns NULL but 'old' is untouched and
     * still valid; the caller must keep and eventually free 'old'.
     */
    if (!new)
        return NULL;

    return new;
}`,
    starter: `#include <linux/slab.h>

char *grow_buf(char *old, size_t newlen)
{
    // TODO: krealloc; remember 'old' survives on failure
    return NULL;
}`,
    tags: ['krealloc', 'resize', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-057',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Tolerate Failure With __GFP_NOWARN',
    prompt: `An allocation is allowed to fail and you have a fallback path, so you do not want the kernel to dump a noisy allocation-failure warning. Write void *try_alloc(size_t bytes) that kmalloc's bytes with GFP_KERNEL plus the flag that suppresses the failure warning. Return NULL on failure (the caller falls back).`,
    hints: [
      '__GFP_NOWARN suppresses the page-allocator failure splat.',
      'OR it into the GFP flags: GFP_KERNEL | __GFP_NOWARN.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/gfp.h>

void *try_alloc(size_t bytes)
{
    return kmalloc(bytes, GFP_KERNEL | __GFP_NOWARN);
}`,
    starter: `#include <linux/slab.h>
#include <linux/gfp.h>

void *try_alloc(size_t bytes)
{
    // TODO: allocate, suppressing the failure warning
    return NULL;
}`,
    tags: ['gfp_nowarn', 'kmalloc', 'fallback'],
  },
  {
    id: 'lx-ch09-c-058',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Page Address From an alloc_page',
    prompt: `Write void *page_buf(void) that allocates one struct page with alloc_page(GFP_KERNEL), maps it to a usable kernel virtual address with page_address, and returns that address (NULL on failure). Write void free_page_buf(void *va) that recovers the struct page from the virtual address with virt_to_page and frees it with __free_page.`,
    hints: [
      'alloc_page returns a struct page *; page_address gives its kernel VA.',
      'virt_to_page(va) maps back to the struct page for __free_page.',
    ],
    solution: `#include <linux/gfp.h>
#include <linux/mm.h>

void *page_buf(void)
{
    struct page *pg = alloc_page(GFP_KERNEL);

    if (!pg)
        return NULL;
    return page_address(pg);
}

void free_page_buf(void *va)
{
    __free_page(virt_to_page(va));
}`,
    starter: `#include <linux/gfp.h>
#include <linux/mm.h>

void *page_buf(void)
{
    // TODO: alloc_page, return its page_address
    return NULL;
}

void free_page_buf(void *va)
{
    // TODO: virt_to_page + __free_page
}`,
    tags: ['alloc_page', 'page_address', 'pages'],
  },
  {
    id: 'lx-ch09-c-059',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Compute Order From a Byte Size',
    prompt: `Write int order_for(size_t bytes) returning the page-allocator order needed to cover at least 'bytes' (order n means 2^n pages). Use get_order(). Then write unsigned long alloc_for(size_t bytes) that allocates that many pages with __get_free_pages(GFP_KERNEL, order) and returns the address (0 on failure).`,
    hints: [
      'get_order(size) returns the order (log2 of pages, rounded up).',
      'Pass that order straight to __get_free_pages.',
    ],
    solution: `#include <linux/gfp.h>
#include <asm/page.h>

int order_for(size_t bytes)
{
    return get_order(bytes);
}

unsigned long alloc_for(size_t bytes)
{
    return __get_free_pages(GFP_KERNEL, get_order(bytes));
}`,
    starter: `#include <linux/gfp.h>
#include <asm/page.h>

int order_for(size_t bytes)
{
    // TODO: get_order
    return 0;
}

unsigned long alloc_for(size_t bytes)
{
    // TODO: allocate enough pages for 'bytes'
    return 0;
}`,
    tags: ['get_order', 'pages', 'sizing'],
  },
  {
    id: 'lx-ch09-c-060',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Size-Threshold Allocator: kmalloc or vmalloc',
    prompt: `Write void *smart_alloc(size_t bytes) that uses kmalloc for small requests (<= 2 pages, i.e. 2 * PAGE_SIZE) and vmalloc for larger ones. Use kvmalloc-style logic but write it by hand with the actual threshold. Return NULL on failure. Then write void smart_free(void *p, size_t bytes) that frees with the matching free function based on the same threshold.`,
    hints: [
      'Small physically-contiguous requests suit kmalloc; large ones suit vmalloc.',
      'smart_free must remember which path was taken; key it off the same size test.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/vmalloc.h>
#include <asm/page.h>

void *smart_alloc(size_t bytes)
{
    if (bytes <= 2 * PAGE_SIZE)
        return kmalloc(bytes, GFP_KERNEL);
    return vmalloc(bytes);
}

void smart_free(void *p, size_t bytes)
{
    if (bytes <= 2 * PAGE_SIZE)
        kfree(p);
    else
        vfree(p);
}`,
    starter: `#include <linux/slab.h>
#include <linux/vmalloc.h>
#include <asm/page.h>

void *smart_alloc(size_t bytes)
{
    // TODO: kmalloc for small, vmalloc for large
    return NULL;
}

void smart_free(void *p, size_t bytes)
{
    // TODO: matching free
}`,
    tags: ['kmalloc', 'vmalloc', 'threshold'],
  },
  {
    id: 'lx-ch09-c-061',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'One-Call Fallback With kvmalloc',
    prompt: `Write void *flex_alloc(size_t bytes) that allocates 'bytes' preferring physically-contiguous memory but transparently falling back to vmalloc for large sizes, using a single kernel helper. Write void flex_free(void *p) that frees it regardless of which path the helper chose.`,
    hints: [
      'kvmalloc(size, flags) tries kmalloc, then falls back to vmalloc automatically.',
      'kvfree(p) frees either kind, so the caller need not know which was used.',
    ],
    solution: `#include <linux/mm.h>
#include <linux/slab.h>

void *flex_alloc(size_t bytes)
{
    return kvmalloc(bytes, GFP_KERNEL);
}

void flex_free(void *p)
{
    kvfree(p);
}`,
    starter: `#include <linux/mm.h>
#include <linux/slab.h>

void *flex_alloc(size_t bytes)
{
    // TODO: kmalloc-with-vmalloc-fallback in one call
    return NULL;
}

void flex_free(void *p)
{
    // TODO: free either kind
}`,
    tags: ['kvmalloc', 'kvfree', 'fallback'],
  },
  {
    id: 'lx-ch09-c-062',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Flexible Array Member Allocation',
    prompt: `Given struct msg { u32 len; u8 data[]; }, write struct msg *make_msg(u32 n) that allocates one struct msg with room for n bytes in the trailing flexible array, using the overflow-safe helper for header+array allocations. Set m->len = n. Return NULL on failure.`,
    hints: [
      'struct_size(ptr, member, count) computes sizeof header + count*elem, overflow-checked.',
      'kmalloc(struct_size(m, data, n), GFP_KERNEL) is the idiom for flexible arrays.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/overflow.h>
#include <linux/types.h>

struct msg {
    u32 len;
    u8 data[];
};

struct msg *make_msg(u32 n)
{
    struct msg *m = kmalloc(struct_size(m, data, n), GFP_KERNEL);

    if (!m)
        return NULL;

    m->len = n;
    return m;
}`,
    starter: `#include <linux/slab.h>
#include <linux/overflow.h>
#include <linux/types.h>

struct msg {
    u32 len;
    u8 data[];
};

struct msg *make_msg(u32 n)
{
    // TODO: allocate header + n bytes safely with struct_size
    return NULL;
}`,
    tags: ['struct_size', 'flexible-array', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-063',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Devm-Managed Allocation',
    prompt: `In a driver probe you want an allocation freed automatically when the device is removed. Write int my_probe(struct device *dev) that allocates struct priv with devm_kzalloc(dev, sizeof(*p), GFP_KERNEL) (zeroed, device-managed), returns -ENOMEM on failure, sets p->ready = 1, and returns 0. Note in a comment that you must NOT kfree it. struct priv has an int ready.`,
    hints: [
      'devm_kzalloc ties the lifetime of the allocation to the device.',
      'The core frees it on driver detach; calling kfree would be a double free.',
    ],
    solution: `#include <linux/device.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct priv {
    int ready;
};

int my_probe(struct device *dev)
{
    struct priv *p = devm_kzalloc(dev, sizeof(*p), GFP_KERNEL);

    if (!p)
        return -ENOMEM;

    p->ready = 1;
    /* device-managed: do NOT kfree(p); core frees on detach */
    return 0;
}`,
    starter: `#include <linux/device.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct priv {
    int ready;
};

int my_probe(struct device *dev)
{
    // TODO: devm_kzalloc, -ENOMEM on failure, do not kfree
    return 0;
}`,
    tags: ['devm', 'devm_kzalloc', 'driver'],
  },
  {
    id: 'lx-ch09-c-064',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Free Cache Objects Before Destroying the Cache',
    prompt: `A list of struct obj objects was allocated from struct kmem_cache *obj_cache and linked through obj->list. Write void teardown(struct list_head *head) that frees every object back to the cache and then destroys the cache. Use list_for_each_entry_safe so you can free while iterating. struct obj has a struct list_head list.`,
    hints: [
      'You cannot dereference an object after freeing it, so use the _safe iterator.',
      'kmem_cache_free each object, then kmem_cache_destroy(obj_cache) once the list is empty.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/list.h>

struct obj {
    struct list_head list;
};

extern struct kmem_cache *obj_cache;

void teardown(struct list_head *head)
{
    struct obj *o, *tmp;

    list_for_each_entry_safe(o, tmp, head, list) {
        list_del(&o->list);
        kmem_cache_free(obj_cache, o);
    }

    kmem_cache_destroy(obj_cache);
}`,
    starter: `#include <linux/slab.h>
#include <linux/list.h>

struct obj {
    struct list_head list;
};

extern struct kmem_cache *obj_cache;

void teardown(struct list_head *head)
{
    // TODO: free each object to the cache, then destroy the cache
}`,
    tags: ['kmem_cache', 'list', 'cleanup'],
  },
  {
    id: 'lx-ch09-c-065',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Slab Constructor Initializing a Lock',
    prompt: `Create a slab cache whose constructor initializes a spinlock in each object exactly once (constructors run when slab pages are populated, not on every alloc). Write the ctor void obj_ctor(void *p) that runs spin_lock_init on the object's lock, and struct kmem_cache *create_obj_cache(void) that registers it. struct obj has a spinlock_t lock and an int val. Explain in a comment why the ctor must not assume val is reset.`,
    hints: [
      'A slab constructor runs once per object slot, possibly reused across alloc/free.',
      'Initialize only invariants (like the lock); never rely on the ctor to reset data fields.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/spinlock.h>

struct obj {
    spinlock_t lock;
    int val;
};

void obj_ctor(void *p)
{
    struct obj *o = p;

    /*
     * Runs once when a slab slot is first created (and can outlive
     * many alloc/free cycles), so initialize only invariants like the
     * lock. 'val' is NOT reset here; callers must set it after alloc.
     */
    spin_lock_init(&o->lock);
}

struct kmem_cache *create_obj_cache(void)
{
    return kmem_cache_create("myobj", sizeof(struct obj),
                             0, 0, obj_ctor);
}`,
    starter: `#include <linux/slab.h>
#include <linux/spinlock.h>

struct obj {
    spinlock_t lock;
    int val;
};

void obj_ctor(void *p)
{
    // TODO: init the lock only (invariant), not val
}

struct kmem_cache *create_obj_cache(void)
{
    // TODO: register cache with obj_ctor
    return NULL;
}`,
    tags: ['kmem_cache', 'constructor', 'spinlock'],
  },
  {
    id: 'lx-ch09-c-066',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'GFP_NOIO Allocation in a Block Writeback Path',
    prompt: `You are deep in a block-device writeback path: a sleeping allocation is allowed, but the allocator must NOT recurse into block I/O (that could deadlock). Write void *wb_alloc(size_t bytes) using kmalloc with the GFP flag that permits sleeping/reclaim but forbids initiating I/O. Add a comment naming the deadlock it prevents. Return NULL on failure.`,
    hints: [
      'GFP_NOIO allows blocking reclaim but disallows starting any I/O.',
      'Reclaiming via I/O while already inside the I/O path can deadlock the device.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/gfp.h>

void *wb_alloc(size_t bytes)
{
    /*
     * In the writeback/block path, letting the allocator reclaim by
     * issuing more I/O can re-enter the same device and deadlock.
     * GFP_NOIO may sleep/reclaim but never starts I/O.
     */
    return kmalloc(bytes, GFP_NOIO);
}`,
    starter: `#include <linux/slab.h>
#include <linux/gfp.h>

void *wb_alloc(size_t bytes)
{
    // TODO: sleeping allocation that must not start I/O
    return NULL;
}`,
    tags: ['gfp_noio', 'reclaim', 'deadlock'],
  },
  {
    id: 'lx-ch09-c-067',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two-Stage Allocation Out of Atomic Context',
    prompt: `A spinlock-protected list needs new nodes, but kmalloc(GFP_ATOMIC) under the lock is fragile. Refactor: write int list_push(int v) that allocates struct node with GFP_KERNEL BEFORE taking spin_lock(&lock), then links it under the lock and unlocks. Return -ENOMEM if allocation fails (before locking). struct node has int v and struct list_head link; assume globals 'lock' and 'head'.`,
    hints: [
      'Do the sleeping GFP_KERNEL allocation outside the spinlock, then lock only to link.',
      'This avoids GFP_ATOMIC and keeps the critical section short and non-sleeping.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/spinlock.h>
#include <linux/list.h>
#include <linux/errno.h>

struct node {
    int v;
    struct list_head link;
};

extern spinlock_t lock;
extern struct list_head head;

int list_push(int v)
{
    struct node *n = kmalloc(sizeof(*n), GFP_KERNEL);

    if (!n)
        return -ENOMEM;

    n->v = v;

    spin_lock(&lock);
    list_add(&n->link, &head);
    spin_unlock(&lock);

    return 0;
}`,
    starter: `#include <linux/slab.h>
#include <linux/spinlock.h>
#include <linux/list.h>
#include <linux/errno.h>

struct node {
    int v;
    struct list_head link;
};

extern spinlock_t lock;
extern struct list_head head;

int list_push(int v)
{
    // TODO: allocate with GFP_KERNEL before locking, then link under lock
    return -ENOMEM;
}`,
    tags: ['gfp_kernel', 'spinlock', 'design'],
  },
  {
    id: 'lx-ch09-c-068',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Probe Cleanup With Reverse-Order Unwinding',
    prompt: `Write int probe(struct dev *d) that allocates two buffers with kmalloc(GFP_KERNEL): d->a (64 bytes) then d->b (128 bytes). If the second allocation fails, free the first and return -ENOMEM (no leak). On full success return 0. Use a single goto-based error path that unwinds in reverse order. struct dev has void *a and void *b.`,
    hints: [
      'Classic kernel pattern: goto labels that free already-acquired resources in reverse.',
      'If b fails, jump to a label that frees a before returning the error.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/errno.h>

struct dev {
    void *a;
    void *b;
};

int probe(struct dev *d)
{
    d->a = kmalloc(64, GFP_KERNEL);
    if (!d->a)
        return -ENOMEM;

    d->b = kmalloc(128, GFP_KERNEL);
    if (!d->b)
        goto err_free_a;

    return 0;

err_free_a:
    kfree(d->a);
    d->a = NULL;
    return -ENOMEM;
}`,
    starter: `#include <linux/slab.h>
#include <linux/errno.h>

struct dev {
    void *a;
    void *b;
};

int probe(struct dev *d)
{
    // TODO: alloc a, then b; goto-based reverse unwind on failure
    return -ENOMEM;
}`,
    tags: ['error-handling', 'goto', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-069',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Page-Aligned Buffer for mmap Backing',
    prompt: `A buffer must be page-aligned and a whole number of pages so it can back an mmap. Write void *alloc_mapped(size_t bytes) that rounds 'bytes' up to a multiple of PAGE_SIZE and allocates that many pages with __get_free_pages(GFP_KERNEL, order) so the returned address is page-aligned; return NULL on failure. Write void free_mapped(void *va, size_t bytes) freeing with the matching order. (Note kmalloc does not guarantee page alignment, but page-allocator returns are page-aligned.)`,
    hints: [
      'PAGE_ALIGN(bytes) rounds up to a page multiple; get_order gives the order.',
      '__get_free_pages returns a page-aligned address; free with the same order.',
    ],
    solution: `#include <linux/gfp.h>
#include <asm/page.h>

void *alloc_mapped(size_t bytes)
{
    size_t total = PAGE_ALIGN(bytes);
    int order = get_order(total);
    unsigned long addr = __get_free_pages(GFP_KERNEL, order);

    if (!addr)
        return NULL;
    return (void *)addr;
}

void free_mapped(void *va, size_t bytes)
{
    int order = get_order(PAGE_ALIGN(bytes));

    free_pages((unsigned long)va, order);
}`,
    starter: `#include <linux/gfp.h>
#include <asm/page.h>

void *alloc_mapped(size_t bytes)
{
    // TODO: round up to pages, allocate page-aligned, return NULL on fail
    return NULL;
}

void free_mapped(void *va, size_t bytes)
{
    // TODO: free with matching order
}`,
    tags: ['page-align', 'get_free_pages', 'mmap'],
  },
  {
    id: 'lx-ch09-c-070',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'vmalloc Buffer Filled From User Space',
    prompt: `Write a write handler ssize_t big_write(struct file *f, const char __user *ubuf, size_t len, loff_t *off) that allocates a len-byte buffer with vmalloc (len may be large, only virtual contiguity needed), copies the user data in, and returns len. On allocation failure return -ENOMEM; on a fault free the buffer and return -EFAULT. Free the buffer before returning in all paths (the data is consumed here). Note in a comment why vmalloc (not kmalloc) suits a large buffer.`,
    hints: [
      'vmalloc handles large buffers that kmalloc cannot reliably get physically contiguous.',
      'copy_from_user returns bytes-not-copied; non-zero means -EFAULT. Always vfree on every exit.',
    ],
    solution: `#include <linux/vmalloc.h>
#include <linux/uaccess.h>
#include <linux/fs.h>
#include <linux/errno.h>

ssize_t big_write(struct file *f, const char __user *ubuf,
                  size_t len, loff_t *off)
{
    /*
     * len can be many pages; kmalloc would need a large physically
     * contiguous block (order-N, may fail). vmalloc only needs virtual
     * contiguity, so it suits large, performance-insensitive buffers.
     */
    void *buf = vmalloc(len);

    if (!buf)
        return -ENOMEM;

    if (copy_from_user(buf, ubuf, len)) {
        vfree(buf);
        return -EFAULT;
    }

    /* ... consume buf ... */
    vfree(buf);
    return len;
}`,
    starter: `#include <linux/vmalloc.h>
#include <linux/uaccess.h>
#include <linux/fs.h>
#include <linux/errno.h>

ssize_t big_write(struct file *f, const char __user *ubuf,
                  size_t len, loff_t *off)
{
    // TODO: vmalloc, copy_from_user, handle -ENOMEM/-EFAULT, vfree all paths
    return 0;
}`,
    tags: ['vmalloc', 'copy_from_user', 'large-buffer'],
  },
]

export default problems
