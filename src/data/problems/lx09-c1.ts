import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch09-c-001',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Allocate a Buffer With kmalloc',
    prompt: `Write a function void *alloc_buf(void) that allocates 128 bytes with kmalloc using the GFP_KERNEL flag and returns the pointer. Do not zero it and do not free it here; the caller owns the buffer. Return NULL is acceptable on failure (kmalloc already returns NULL).`,
    hints: [
      'kmalloc(size, gfp_flags) returns a pointer or NULL.',
      'GFP_KERNEL is the normal flag for process context that may sleep.',
    ],
    solution: `#include <linux/slab.h>

void *alloc_buf(void)
{
    return kmalloc(128, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

void *alloc_buf(void)
{
    // TODO: kmalloc 128 bytes with GFP_KERNEL and return the pointer
    return NULL;
}`,
    tags: ['kernel', 'kmalloc', 'memory'],
  },
  {
    id: 'lx-ch09-c-002',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Free a kmalloc Buffer',
    prompt: `Write a function void free_buf(void *p) that releases a buffer previously obtained from kmalloc. Use kfree. It is fine to call this on NULL, so you do not need an explicit NULL check.`,
    hints: [
      'kfree(ptr) frees memory from kmalloc/kzalloc/krealloc.',
      'kfree(NULL) is safe and does nothing.',
    ],
    solution: `#include <linux/slab.h>

void free_buf(void *p)
{
    kfree(p);
}`,
    starter: `#include <linux/slab.h>

void free_buf(void *p)
{
    // TODO: free p with kfree
}`,
    tags: ['kernel', 'kfree', 'memory'],
  },
  {
    id: 'lx-ch09-c-003',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Zeroed Allocation With kzalloc',
    prompt: `Write a function void *alloc_zeroed(size_t n) that allocates n bytes of zero-initialized memory using kzalloc with GFP_KERNEL and returns the pointer. Return whatever kzalloc returns (NULL on failure).`,
    hints: [
      'kzalloc(size, gfp) is kmalloc plus a memset to zero.',
      'Use it when you need the buffer cleared to start.',
    ],
    solution: `#include <linux/slab.h>

void *alloc_zeroed(size_t n)
{
    return kzalloc(n, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

void *alloc_zeroed(size_t n)
{
    // TODO: kzalloc n bytes with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'kzalloc', 'memory'],
  },
  {
    id: 'lx-ch09-c-004',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Check kmalloc for Failure',
    prompt: `Write a function int make_buf(void) that allocates 256 bytes with kmalloc(GFP_KERNEL). If the allocation fails return -ENOMEM. On success, free the buffer with kfree and return 0.`,
    hints: [
      'Compare the returned pointer against NULL.',
      'The conventional error code for out-of-memory is -ENOMEM.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/errno.h>

int make_buf(void)
{
    void *p = kmalloc(256, GFP_KERNEL);

    if (!p)
        return -ENOMEM;

    kfree(p);
    return 0;
}`,
    starter: `#include <linux/slab.h>
#include <linux/errno.h>

int make_buf(void)
{
    void *p = kmalloc(256, GFP_KERNEL);

    // TODO: if allocation failed, return -ENOMEM
    // TODO: otherwise free and return 0
    return 0;
}`,
    tags: ['kernel', 'kmalloc', 'enomem'],
  },
  {
    id: 'lx-ch09-c-005',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Allocate an Array With kmalloc_array',
    prompt: `Write a function int *alloc_ints(size_t count) that allocates an array of 'count' int values using kmalloc_array with GFP_KERNEL, and returns the pointer. Using kmalloc_array (rather than kmalloc with a hand-computed size) protects against multiplication overflow.`,
    hints: [
      'kmalloc_array(n, size, gfp) allocates n elements of the given size.',
      'It returns NULL if n * size would overflow.',
    ],
    solution: `#include <linux/slab.h>

int *alloc_ints(size_t count)
{
    return kmalloc_array(count, sizeof(int), GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

int *alloc_ints(size_t count)
{
    // TODO: kmalloc_array of count ints with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'kmalloc_array', 'memory'],
  },
  {
    id: 'lx-ch09-c-006',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Zeroed Array With kcalloc',
    prompt: `Write a function long *alloc_zero_longs(size_t count) that allocates a zero-initialized array of 'count' long values using kcalloc with GFP_KERNEL, and returns the pointer.`,
    hints: [
      'kcalloc(n, size, gfp) is kmalloc_array plus zeroing.',
      'It also guards against n * size overflow.',
    ],
    solution: `#include <linux/slab.h>

long *alloc_zero_longs(size_t count)
{
    return kcalloc(count, sizeof(long), GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

long *alloc_zero_longs(size_t count)
{
    // TODO: kcalloc of count longs with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'kcalloc', 'memory'],
  },
  {
    id: 'lx-ch09-c-007',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Allocate and Initialize a Struct',
    prompt: `Given struct point { int x; int y; }, write a function struct point *new_point(int x, int y) that allocates one struct point with kmalloc(GFP_KERNEL), and on success stores x and y into the fields and returns the pointer. Return NULL on failure. Use sizeof(*p) for the size.`,
    hints: [
      'sizeof(*p) keeps the size in sync with the pointer type.',
      'Always check the pointer before dereferencing it.',
    ],
    solution: `#include <linux/slab.h>

struct point { int x; int y; };

struct point *new_point(int x, int y)
{
    struct point *p = kmalloc(sizeof(*p), GFP_KERNEL);

    if (!p)
        return NULL;

    p->x = x;
    p->y = y;
    return p;
}`,
    starter: `#include <linux/slab.h>

struct point { int x; int y; };

struct point *new_point(int x, int y)
{
    struct point *p = /* TODO: kmalloc one struct point */;
    // TODO: check failure, set fields, return
    return NULL;
}`,
    tags: ['kernel', 'kmalloc', 'struct'],
  },
  {
    id: 'lx-ch09-c-008',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Allocate One Page With __get_free_page',
    prompt: `Write a function unsigned long get_one_page(void) that allocates a single page of memory with __get_free_page using GFP_KERNEL and returns the page's kernel address (an unsigned long). On failure __get_free_page returns 0, which you may simply return.`,
    hints: [
      '__get_free_page(gfp) returns the address of one page or 0.',
      'The returned value is a kernel virtual address as an unsigned long.',
    ],
    solution: `#include <linux/gfp.h>

unsigned long get_one_page(void)
{
    return __get_free_page(GFP_KERNEL);
}`,
    starter: `#include <linux/gfp.h>

unsigned long get_one_page(void)
{
    // TODO: __get_free_page(GFP_KERNEL)
    return 0;
}`,
    tags: ['kernel', 'pages', 'get_free_page'],
  },
  {
    id: 'lx-ch09-c-009',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Free a Single Page',
    prompt: `Write a function void put_one_page(unsigned long addr) that frees a single page previously obtained from __get_free_page. Use free_page. If addr is 0 (allocation had failed) do not free; return without doing anything.`,
    hints: [
      'free_page(addr) frees the single page at addr.',
      'Guard against freeing address 0.',
    ],
    solution: `#include <linux/gfp.h>

void put_one_page(unsigned long addr)
{
    if (addr)
        free_page(addr);
}`,
    starter: `#include <linux/gfp.h>

void put_one_page(unsigned long addr)
{
    // TODO: if addr is non-zero, free_page(addr)
}`,
    tags: ['kernel', 'pages', 'free_page'],
  },
  {
    id: 'lx-ch09-c-010',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Allocate a Large Buffer With vmalloc',
    prompt: `Write a function void *big_buffer(void) that allocates a 2 MiB buffer using vmalloc and returns the pointer. vmalloc returns memory that is virtually contiguous but not necessarily physically contiguous, which is appropriate for large allocations.`,
    hints: [
      'vmalloc(size) takes just a size; it implies a sleeping (GFP_KERNEL-like) allocation.',
      '2 MiB is 2 * 1024 * 1024 bytes.',
    ],
    solution: `#include <linux/vmalloc.h>

void *big_buffer(void)
{
    return vmalloc(2 * 1024 * 1024);
}`,
    starter: `#include <linux/vmalloc.h>

void *big_buffer(void)
{
    // TODO: vmalloc a 2 MiB buffer
    return NULL;
}`,
    tags: ['kernel', 'vmalloc', 'memory'],
  },
  {
    id: 'lx-ch09-c-011',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Free a vmalloc Buffer',
    prompt: `Write a function void free_big(void *p) that frees a buffer obtained from vmalloc. Use vfree (NOT kfree). vfree(NULL) is safe, so no explicit NULL check is required.`,
    hints: [
      'Memory from vmalloc must be released with vfree.',
      'Mixing kfree and vmalloc (or vfree and kmalloc) is a bug.',
    ],
    solution: `#include <linux/vmalloc.h>

void free_big(void *p)
{
    vfree(p);
}`,
    starter: `#include <linux/vmalloc.h>

void free_big(void *p)
{
    // TODO: free p with vfree
}`,
    tags: ['kernel', 'vfree', 'memory'],
  },
  {
    id: 'lx-ch09-c-012',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Atomic Allocation With GFP_ATOMIC',
    prompt: `Write a function void *alloc_atomic(size_t n) that allocates n bytes that may be called from atomic context (for example inside an interrupt handler or while holding a spinlock). Use kmalloc with the GFP_ATOMIC flag, which does not sleep. Return the pointer.`,
    hints: [
      'GFP_ATOMIC never sleeps, so it is safe in atomic context.',
      'It can fail more easily than GFP_KERNEL because it cannot reclaim memory by sleeping.',
    ],
    solution: `#include <linux/slab.h>

void *alloc_atomic(size_t n)
{
    return kmalloc(n, GFP_ATOMIC);
}`,
    starter: `#include <linux/slab.h>

void *alloc_atomic(size_t n)
{
    // TODO: kmalloc n bytes with GFP_ATOMIC
    return NULL;
}`,
    tags: ['kernel', 'gfp_atomic', 'memory'],
  },
  {
    id: 'lx-ch09-c-013',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate Inside a Spinlock-Held Section',
    prompt: `Given a static DEFINE_SPINLOCK(my_lock), write int copy_under_lock(int *out) that takes my_lock, allocates 64 bytes, writes the value 7 into the first int of the buffer and copies it into *out, frees the buffer, then releases the lock. Because the allocation happens while holding a spinlock, it MUST use GFP_ATOMIC. Return -ENOMEM if the allocation fails (release the lock first). Otherwise return 0.`,
    hints: [
      'You cannot sleep while holding a spinlock, so GFP_KERNEL is forbidden here.',
      'On the failure path, unlock before returning.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/spinlock.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(my_lock);

int copy_under_lock(int *out)
{
    int *buf;

    spin_lock(&my_lock);

    buf = kmalloc(64, GFP_ATOMIC);
    if (!buf) {
        spin_unlock(&my_lock);
        return -ENOMEM;
    }

    buf[0] = 7;
    *out = buf[0];
    kfree(buf);

    spin_unlock(&my_lock);
    return 0;
}`,
    starter: `#include <linux/slab.h>
#include <linux/spinlock.h>
#include <linux/errno.h>

static DEFINE_SPINLOCK(my_lock);

int copy_under_lock(int *out)
{
    int *buf;

    spin_lock(&my_lock);

    // TODO: allocate with the correct GFP flag for atomic context
    // TODO: handle failure (unlock first), set *out, free, unlock

    spin_unlock(&my_lock);
    return 0;
}`,
    tags: ['kernel', 'gfp_atomic', 'spinlock'],
  },
  {
    id: 'lx-ch09-c-014',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reallocate a Growing Buffer With krealloc',
    prompt: `Write a function void *grow_buf(void *old, size_t new_size) that resizes the buffer 'old' to new_size bytes using krealloc with GFP_KERNEL, and returns the new pointer. Note: krealloc may return a different pointer; if it returns NULL the original allocation is still valid, so the caller must not overwrite its only copy of 'old' with the result. Just return what krealloc gives back.`,
    hints: [
      'krealloc(p, new_size, gfp) preserves existing data up to min(old, new).',
      'On failure it returns NULL and leaves the old block allocated.',
    ],
    solution: `#include <linux/slab.h>

void *grow_buf(void *old, size_t new_size)
{
    return krealloc(old, new_size, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

void *grow_buf(void *old, size_t new_size)
{
    // TODO: krealloc old to new_size with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'krealloc', 'memory'],
  },
  {
    id: 'lx-ch09-c-015',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Duplicate a Buffer With kmemdup',
    prompt: `Write a function void *dup_buf(const void *src, size_t len) that allocates len bytes and copies the contents of src into the new buffer, returning the pointer. Use kmemdup with GFP_KERNEL, which does the allocate-and-copy in one call and returns NULL on failure.`,
    hints: [
      'kmemdup(src, len, gfp) returns a freshly kmalloced copy.',
      'The caller must later kfree the returned pointer.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/string.h>

void *dup_buf(const void *src, size_t len)
{
    return kmemdup(src, len, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>
#include <linux/string.h>

void *dup_buf(const void *src, size_t len)
{
    // TODO: kmemdup src/len with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'kmemdup', 'memory'],
  },
  {
    id: 'lx-ch09-c-016',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Duplicate a String With kstrdup',
    prompt: `Write a function char *dup_str(const char *s) that returns a kmalloced copy of the NUL-terminated string s using kstrdup with GFP_KERNEL. Return whatever kstrdup returns (NULL on failure). The caller frees it with kfree.`,
    hints: [
      'kstrdup(s, gfp) allocates strlen(s)+1 bytes and copies the string.',
      'Handles the NUL terminator for you.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/string.h>

char *dup_str(const char *s)
{
    return kstrdup(s, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>
#include <linux/string.h>

char *dup_str(const char *s)
{
    // TODO: kstrdup s with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'kstrdup', 'string'],
  },
  {
    id: 'lx-ch09-c-017',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate Multiple Pages With __get_free_pages',
    prompt: `Write a function unsigned long get_four_pages(void) that allocates 4 contiguous pages with __get_free_pages(GFP_KERNEL, order). The 'order' argument is log2 of the page count, so 4 pages is order 2. Return the start address (0 on failure).`,
    hints: [
      '__get_free_pages(gfp, order) returns 2^order contiguous pages.',
      'order 0 = 1 page, order 1 = 2 pages, order 2 = 4 pages.',
    ],
    solution: `#include <linux/gfp.h>

unsigned long get_four_pages(void)
{
    return __get_free_pages(GFP_KERNEL, 2);
}`,
    starter: `#include <linux/gfp.h>

unsigned long get_four_pages(void)
{
    // TODO: __get_free_pages for 4 pages (order 2) with GFP_KERNEL
    return 0;
}`,
    tags: ['kernel', 'pages', 'get_free_pages'],
  },
  {
    id: 'lx-ch09-c-018',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Free Multiple Pages',
    prompt: `Write a function void put_four_pages(unsigned long addr) that frees the 4-page (order 2) block previously returned by __get_free_pages. Use free_pages(addr, order) and pass the SAME order (2) that was used to allocate. Skip the free if addr is 0.`,
    hints: [
      'free_pages(addr, order) must use the same order as the allocation.',
      'Note the plural: free_pages for multi-page, free_page for one.',
    ],
    solution: `#include <linux/gfp.h>

void put_four_pages(unsigned long addr)
{
    if (addr)
        free_pages(addr, 2);
}`,
    starter: `#include <linux/gfp.h>

void put_four_pages(unsigned long addr)
{
    // TODO: free_pages with the matching order (2), guarding against 0
}`,
    tags: ['kernel', 'pages', 'free_pages'],
  },
  {
    id: 'lx-ch09-c-019',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Zeroed Page With get_zeroed_page',
    prompt: `Write a function unsigned long get_clean_page(void) that allocates one page that is pre-zeroed, using get_zeroed_page(GFP_KERNEL), and returns its address (0 on failure). This avoids a separate memset of the page.`,
    hints: [
      'get_zeroed_page(gfp) returns a single page already filled with zeros.',
      'It still returns 0 on failure like __get_free_page.',
    ],
    solution: `#include <linux/gfp.h>

unsigned long get_clean_page(void)
{
    return get_zeroed_page(GFP_KERNEL);
}`,
    starter: `#include <linux/gfp.h>

unsigned long get_clean_page(void)
{
    // TODO: get_zeroed_page(GFP_KERNEL)
    return 0;
}`,
    tags: ['kernel', 'pages', 'zeroed'],
  },
  {
    id: 'lx-ch09-c-020',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Create a kmem_cache',
    prompt: `Given struct widget { int id; char name[16]; }, write a function int widget_cache_create(void) that creates a slab cache for struct widget objects. Store the result in a static struct kmem_cache *widget_cache. Use kmem_cache_create with name "widget", size sizeof(struct widget), alignment 0, flags 0, and NULL constructor. Return -ENOMEM if it fails, else 0.`,
    hints: [
      'kmem_cache_create(name, size, align, flags, ctor).',
      'It returns NULL on failure; check before returning success.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/errno.h>

struct widget { int id; char name[16]; };

static struct kmem_cache *widget_cache;

int widget_cache_create(void)
{
    widget_cache = kmem_cache_create("widget", sizeof(struct widget),
                                     0, 0, NULL);
    if (!widget_cache)
        return -ENOMEM;

    return 0;
}`,
    starter: `#include <linux/slab.h>
#include <linux/errno.h>

struct widget { int id; char name[16]; };

static struct kmem_cache *widget_cache;

int widget_cache_create(void)
{
    // TODO: kmem_cache_create("widget", sizeof(struct widget), 0, 0, NULL)
    // TODO: return -ENOMEM on failure, 0 on success
    return 0;
}`,
    tags: ['kernel', 'kmem_cache', 'slab'],
  },
  {
    id: 'lx-ch09-c-021',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate an Object From a kmem_cache',
    prompt: `Given a valid static struct kmem_cache *widget_cache and struct widget { int id; char name[16]; }, write struct widget *widget_alloc(int id) that allocates one widget from the cache with kmem_cache_alloc(widget_cache, GFP_KERNEL). On success set the id field and return the pointer; return NULL on failure.`,
    hints: [
      'kmem_cache_alloc(cache, gfp) returns one object from the slab.',
      'The object is uninitialized (unless the cache had a constructor).',
    ],
    solution: `#include <linux/slab.h>

struct widget { int id; char name[16]; };
extern struct kmem_cache *widget_cache;

struct widget *widget_alloc(int id)
{
    struct widget *w = kmem_cache_alloc(widget_cache, GFP_KERNEL);

    if (!w)
        return NULL;

    w->id = id;
    return w;
}`,
    starter: `#include <linux/slab.h>

struct widget { int id; char name[16]; };
extern struct kmem_cache *widget_cache;

struct widget *widget_alloc(int id)
{
    // TODO: kmem_cache_alloc from widget_cache with GFP_KERNEL
    // TODO: on success set id and return; else NULL
    return NULL;
}`,
    tags: ['kernel', 'kmem_cache', 'slab'],
  },
  {
    id: 'lx-ch09-c-022',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Free an Object Back to the Cache',
    prompt: `Given a static struct kmem_cache *widget_cache, write void widget_free(struct widget *w) that returns the object w back to its slab cache. Use kmem_cache_free(widget_cache, w). Guard against w being NULL (kmem_cache_free must not be called on NULL).`,
    hints: [
      'kmem_cache_free(cache, obj) returns an object to the same cache it came from.',
      'Unlike kfree, you should not pass NULL to kmem_cache_free.',
    ],
    solution: `#include <linux/slab.h>

struct widget { int id; char name[16]; };
extern struct kmem_cache *widget_cache;

void widget_free(struct widget *w)
{
    if (w)
        kmem_cache_free(widget_cache, w);
}`,
    starter: `#include <linux/slab.h>

struct widget { int id; char name[16]; };
extern struct kmem_cache *widget_cache;

void widget_free(struct widget *w)
{
    // TODO: if w is non-NULL, kmem_cache_free it back to widget_cache
}`,
    tags: ['kernel', 'kmem_cache', 'slab'],
  },
  {
    id: 'lx-ch09-c-023',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Destroy a kmem_cache',
    prompt: `Write a function void widget_cache_destroy(void) that destroys the static struct kmem_cache *widget_cache if it is non-NULL, using kmem_cache_destroy, and then sets the pointer back to NULL. (All objects must already be freed before destroying the cache.)`,
    hints: [
      'kmem_cache_destroy(cache) tears down the slab cache.',
      'Set the pointer to NULL afterward to avoid a stale dangling reference.',
    ],
    solution: `#include <linux/slab.h>

static struct kmem_cache *widget_cache;

void widget_cache_destroy(void)
{
    if (widget_cache) {
        kmem_cache_destroy(widget_cache);
        widget_cache = NULL;
    }
}`,
    starter: `#include <linux/slab.h>

static struct kmem_cache *widget_cache;

void widget_cache_destroy(void)
{
    // TODO: if widget_cache is set, destroy it and NULL the pointer
}`,
    tags: ['kernel', 'kmem_cache', 'cleanup'],
  },
  {
    id: 'lx-ch09-c-024',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Zeroed kmem_cache Object',
    prompt: `Given a valid static struct kmem_cache *obj_cache (objects of unknown layout), write void *obj_alloc_zeroed(void) that allocates one object that is guaranteed to be zero-filled. Use kmem_cache_zalloc(obj_cache, GFP_KERNEL) and return the pointer (NULL on failure).`,
    hints: [
      'kmem_cache_zalloc is kmem_cache_alloc with the object zeroed.',
      'Useful when the cache has no constructor but you still want a clean object.',
    ],
    solution: `#include <linux/slab.h>

extern struct kmem_cache *obj_cache;

void *obj_alloc_zeroed(void)
{
    return kmem_cache_zalloc(obj_cache, GFP_KERNEL);
}`,
    starter: `#include <linux/slab.h>

extern struct kmem_cache *obj_cache;

void *obj_alloc_zeroed(void)
{
    // TODO: kmem_cache_zalloc from obj_cache with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'kmem_cache', 'zeroed'],
  },
  {
    id: 'lx-ch09-c-025',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use ksize to Query Real Allocation Size',
    prompt: `Write a function size_t actual_size(void) that kmallocs 100 bytes with GFP_KERNEL, then uses ksize() to find the actual number of bytes the allocator reserved (slab allocations are rounded up to a fixed bucket, e.g. 128). Free the buffer and return the size ksize reported. Return 0 if the allocation failed.`,
    hints: [
      'ksize(ptr) returns the usable size of a kmalloc allocation.',
      'kmalloc rounds requests up to the next slab cache size.',
    ],
    solution: `#include <linux/slab.h>

size_t actual_size(void)
{
    void *p = kmalloc(100, GFP_KERNEL);
    size_t sz;

    if (!p)
        return 0;

    sz = ksize(p);
    kfree(p);
    return sz;
}`,
    starter: `#include <linux/slab.h>

size_t actual_size(void)
{
    void *p = kmalloc(100, GFP_KERNEL);
    // TODO: handle failure, query ksize, free, return the size
    return 0;
}`,
    tags: ['kernel', 'ksize', 'slab'],
  },
  {
    id: 'lx-ch09-c-026',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pick the Right Allocator for a Big Buffer',
    prompt: `A driver needs a 4 MiB scratch buffer that is only ever accessed by the CPU through a normal pointer (it is NOT used for DMA and need not be physically contiguous). Write void *make_scratch(void) that allocates it with the allocator best suited for a large, virtually-contiguous, non-DMA buffer, and returns the pointer. Choose between kmalloc and vmalloc and use the correct one.`,
    hints: [
      'kmalloc gives physically contiguous memory but struggles with very large sizes.',
      'For large buffers that only need virtual contiguity, vmalloc is the right tool.',
    ],
    solution: `#include <linux/vmalloc.h>

void *make_scratch(void)
{
    /* 4 MiB, CPU-only, no DMA, no need for physical contiguity -> vmalloc */
    return vmalloc(4 * 1024 * 1024);
}`,
    starter: `#include <linux/vmalloc.h>
#include <linux/slab.h>

void *make_scratch(void)
{
    // TODO: choose the right allocator for a large, virtually-contiguous,
    //       non-DMA buffer and allocate 4 MiB
    return NULL;
}`,
    tags: ['kernel', 'vmalloc', 'tradeoffs'],
  },
  {
    id: 'lx-ch09-c-027',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate, Use, and Always Free',
    prompt: `Write a function int sum_first_n(int n, long *out) that kmallocs an array of n ints with GFP_KERNEL, fills element i with i, sums them into *out, then frees the array. Return -ENOMEM on allocation failure; ensure the buffer is freed before returning on the success path. Use kmalloc_array to size the array safely.`,
    hints: [
      'Fill the array in a loop, accumulate the sum, then kfree.',
      'Free exactly once on the success path; do not leak.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/errno.h>

int sum_first_n(int n, long *out)
{
    int *arr;
    long sum = 0;
    int i;

    arr = kmalloc_array(n, sizeof(int), GFP_KERNEL);
    if (!arr)
        return -ENOMEM;

    for (i = 0; i < n; i++)
        arr[i] = i;

    for (i = 0; i < n; i++)
        sum += arr[i];

    *out = sum;
    kfree(arr);
    return 0;
}`,
    starter: `#include <linux/slab.h>
#include <linux/errno.h>

int sum_first_n(int n, long *out)
{
    int *arr;

    // TODO: kmalloc_array n ints, handle -ENOMEM
    // TODO: fill, sum into *out, free, return 0
    return 0;
}`,
    tags: ['kernel', 'kmalloc', 'lifecycle'],
  },
  {
    id: 'lx-ch09-c-028',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Module Init/Exit Owning a Buffer',
    prompt: `Write a tiny module that allocates a 1 KiB buffer at init and frees it at exit. In int my_init(void): kzalloc 1024 bytes with GFP_KERNEL into a static char *buf; return -ENOMEM if it fails, else 0. In void my_exit(void): kfree(buf). Wire them with module_init(my_init) and module_exit(my_exit).`,
    hints: [
      'Store the pointer in a static so exit can see it.',
      'Returning a negative value from init aborts module loading.',
    ],
    solution: `#include <linux/module.h>
#include <linux/slab.h>
#include <linux/errno.h>

static char *buf;

static int my_init(void)
{
    buf = kzalloc(1024, GFP_KERNEL);
    if (!buf)
        return -ENOMEM;
    return 0;
}

static void my_exit(void)
{
    kfree(buf);
}

module_init(my_init);
module_exit(my_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/slab.h>
#include <linux/errno.h>

static char *buf;

static int my_init(void)
{
    // TODO: kzalloc 1024 bytes, return -ENOMEM on failure
    return 0;
}

static void my_exit(void)
{
    // TODO: kfree(buf)
}

module_init(my_init);
module_exit(my_exit);
MODULE_LICENSE("GPL");`,
    tags: ['kernel', 'module', 'lifecycle'],
  },
  {
    id: 'lx-ch09-c-029',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Copy User Data Into a Kernel Buffer',
    prompt: `Write a function int read_from_user(const char __user *ubuf, size_t len, char **out) that kmallocs len bytes (GFP_KERNEL) and copies len bytes from the user pointer ubuf into it with copy_from_user. Return -ENOMEM if the allocation fails. If copy_from_user reports that not all bytes were copied, free the buffer and return -EFAULT. On success store the buffer in *out and return 0.`,
    hints: [
      'copy_from_user returns the number of bytes NOT copied (0 means success).',
      'A user pointer can fault, so you must never just dereference ubuf directly.',
    ],
    solution: `#include <linux/slab.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

int read_from_user(const char __user *ubuf, size_t len, char **out)
{
    char *kbuf = kmalloc(len, GFP_KERNEL);

    if (!kbuf)
        return -ENOMEM;

    if (copy_from_user(kbuf, ubuf, len)) {
        kfree(kbuf);
        return -EFAULT;
    }

    *out = kbuf;
    return 0;
}`,
    starter: `#include <linux/slab.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

int read_from_user(const char __user *ubuf, size_t len, char **out)
{
    char *kbuf;

    // TODO: kmalloc len bytes, handle -ENOMEM
    // TODO: copy_from_user; on partial copy free and return -EFAULT
    // TODO: store in *out, return 0
    return 0;
}`,
    tags: ['kernel', 'copy_from_user', 'kmalloc'],
  },
  {
    id: 'lx-ch09-c-030',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate DMA-Capable Memory With GFP_DMA',
    prompt: `Some old devices can only address memory in the low DMA zone. Write void *alloc_lowmem(size_t n) that allocates n bytes suitable for such a device by OR-ing GFP_DMA into GFP_KERNEL: kmalloc(n, GFP_KERNEL | GFP_DMA). Return the pointer.`,
    hints: [
      'GFP flags are combined with bitwise OR.',
      'GFP_DMA forces the allocation into the low (ZONE_DMA) memory zone.',
    ],
    solution: `#include <linux/slab.h>

void *alloc_lowmem(size_t n)
{
    return kmalloc(n, GFP_KERNEL | GFP_DMA);
}`,
    starter: `#include <linux/slab.h>

void *alloc_lowmem(size_t n)
{
    // TODO: kmalloc n bytes from the DMA zone (GFP_KERNEL | GFP_DMA)
    return NULL;
}`,
    tags: ['kernel', 'gfp_dma', 'zones'],
  },
  {
    id: 'lx-ch09-c-031',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate a struct page With alloc_pages',
    prompt: `Write struct page *grab_pages(void) that allocates 2 contiguous pages (order 1) and returns the struct page pointer using alloc_pages(GFP_KERNEL, 1). Unlike __get_free_pages, alloc_pages returns a struct page * rather than a virtual address. Return NULL on failure (alloc_pages already returns NULL).`,
    hints: [
      'alloc_pages(gfp, order) returns a struct page * for the head page.',
      'Use __free_pages(page, order) to release it later.',
    ],
    solution: `#include <linux/gfp.h>
#include <linux/mm.h>

struct page *grab_pages(void)
{
    return alloc_pages(GFP_KERNEL, 1);
}`,
    starter: `#include <linux/gfp.h>
#include <linux/mm.h>

struct page *grab_pages(void)
{
    // TODO: alloc_pages of order 1 with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'alloc_pages', 'struct_page'],
  },
  {
    id: 'lx-ch09-c-032',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Get a Usable Pointer From a struct page',
    prompt: `Given a struct page *page from alloc_pages, write void *page_to_ptr(struct page *page) that returns a kernel virtual address you can actually read/write through, using page_address(page). For a page from the normal (lowmem) zone this returns a valid pointer; return that.`,
    hints: [
      'page_address(page) maps a struct page back to a kernel virtual address.',
      'For lowmem pages this is a direct, always-valid mapping.',
    ],
    solution: `#include <linux/mm.h>

void *page_to_ptr(struct page *page)
{
    return page_address(page);
}`,
    starter: `#include <linux/mm.h>

void *page_to_ptr(struct page *page)
{
    // TODO: convert the struct page to a usable kernel pointer
    return NULL;
}`,
    tags: ['kernel', 'page_address', 'pages'],
  },
  {
    id: 'lx-ch09-c-033',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Free struct page Memory',
    prompt: `Write void release_pages2(struct page *page) that frees a 2-page (order 1) block obtained from alloc_pages. Use __free_pages(page, 1) and pass the SAME order used to allocate. Skip the free if page is NULL.`,
    hints: [
      '__free_pages(page, order) is the counterpart to alloc_pages.',
      'The order must match the allocation order exactly.',
    ],
    solution: `#include <linux/gfp.h>
#include <linux/mm.h>

void release_pages2(struct page *page)
{
    if (page)
        __free_pages(page, 1);
}`,
    starter: `#include <linux/gfp.h>
#include <linux/mm.h>

void release_pages2(struct page *page)
{
    // TODO: __free_pages with matching order (1), guarding against NULL
}`,
    tags: ['kernel', 'free_pages', 'struct_page'],
  },
  {
    id: 'lx-ch09-c-034',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate With kvmalloc Fallback',
    prompt: `Write void *flexible_alloc(size_t n) that tries to get physically contiguous memory but transparently falls back to a virtually-contiguous allocation if the size is too large. Use kvmalloc(n, GFP_KERNEL), which attempts kmalloc first and uses vmalloc as a fallback. Return the pointer.`,
    hints: [
      'kvmalloc tries kmalloc, then vmalloc if that fails or the size is large.',
      'Memory from kvmalloc must be freed with kvfree (which handles either case).',
    ],
    solution: `#include <linux/mm.h>
#include <linux/slab.h>

void *flexible_alloc(size_t n)
{
    return kvmalloc(n, GFP_KERNEL);
}`,
    starter: `#include <linux/mm.h>
#include <linux/slab.h>

void *flexible_alloc(size_t n)
{
    // TODO: kvmalloc n bytes with GFP_KERNEL
    return NULL;
}`,
    tags: ['kernel', 'kvmalloc', 'memory'],
  },
  {
    id: 'lx-ch09-c-035',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Free a kvmalloc Allocation',
    prompt: `Write void flexible_free(void *p) that releases a buffer obtained from kvmalloc. Use kvfree, which detects whether the memory came from kmalloc or vmalloc and frees it correctly. kvfree(NULL) is safe, so no NULL check is needed.`,
    hints: [
      'kvfree is the matching free for kvmalloc/kvzalloc.',
      'Do not assume it was kmalloc or vmalloc; kvfree figures it out.',
    ],
    solution: `#include <linux/mm.h>

void flexible_free(void *p)
{
    kvfree(p);
}`,
    starter: `#include <linux/mm.h>

void flexible_free(void *p)
{
    // TODO: free p with kvfree
}`,
    tags: ['kernel', 'kvfree', 'memory'],
  },
]

export default problems
