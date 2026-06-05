import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-09',
  track: 'linux',
  chapter: 9,
  title: 'Kernel Memory Management',
  summary: `The kernel manages memory under rules that make user-space allocation look easy: there is no demand paging behind kernel allocations, no oversubscription you can lean on, and a failed allocation can mean a deadlock or a dead machine instead of a friendly exception. This chapter explains how physical RAM is carved into pages and zones, how the buddy page allocator and the slab allocator sit on top of it, and how the everyday APIs kmalloc, vmalloc, and kmem_cache map onto that machinery. The thread running through all of it is allocation context: whether you can sleep, whether you can touch high memory, and whether you need physically contiguous memory. Get these choices right and your driver is fast and robust; get them wrong and you corrupt memory or hang the box.`,
  sections: [
    {
      heading: 'Virtual vs physical memory, and the page',
      body: `Everything starts with the page. Physical RAM is divided into fixed-size blocks called pages, almost always 4 KiB on x86 and arm64, and the hardware Memory Management Unit translates virtual addresses to physical addresses one page at a time using page tables. The kernel never manages memory at byte granularity at the lowest level; the page is the atom of physical memory management, and every physical page has exactly one struct page descriptor tracking its state.

A virtual address is just a number that the MMU maps to some physical frame, or to nothing at all. The crucial distinction for kernel work is between *virtually* contiguous memory and *physically* contiguous memory. A range of virtual addresses that looks like one smooth block can be scattered across physical RAM in any order, because the page tables can point each virtual page wherever they like. This matters enormously: hardware that does Direct Memory Access reads physical addresses, not virtual ones, so a buffer handed to a device usually must be physically contiguous, while a large software-only buffer does not care.

The kernel has its own address space, separate from every user process. On 64-bit systems a large part of the kernel virtual address range is a *direct map* (also called the linear map or lowmem map): a region where kernel virtual address equals physical address plus a fixed offset. Memory in the direct map is trivially convertible between virtual and physical with simple arithmetic, which is why the fast allocators hand out direct-mapped memory. A separate region, the vmalloc area, is used to stitch scattered physical pages into a virtually contiguous range via fresh page-table entries.

Two recurring concepts: a *page frame number* is the physical address shifted right by the page-shift, an index into the array of all pages. And memory is *reclaimable* when the kernel can free it under pressure (clean file cache, for example) versus *unreclaimable* when it is pinned (most kernel allocations). Kernel memory is largely unreclaimable, which is the deep reason allocations can fail and must be checked.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/mm.h>
#include <asm/page.h>

/* PAGE_SIZE is the page granularity (e.g. 4096); PAGE_SHIFT is log2 of it. */
unsigned long pages_needed(size_t bytes)
{
    /* Round up to a whole number of pages. */
    return (bytes + PAGE_SIZE - 1) >> PAGE_SHIFT;
}

/* Convert between a struct page, its kernel virtual address, and physical. */
void example(struct page *p)
{
    void *vaddr        = page_address(p);   /* direct-map virtual address */
    unsigned long pfn  = page_to_pfn(p);    /* page frame number          */
    phys_addr_t phys   = page_to_phys(p);   /* physical address           */

    pr_info("page %lu maps to va=%px pa=%pa\\n", pfn, vaddr, &phys);
}`,
        },
      ],
    },
    {
      heading: 'The page allocator (buddy system) and memory zones',
      body: `At the bottom of the allocation stack sits the page allocator, which hands out memory in whole pages. It uses the *buddy* algorithm. Free memory is kept in lists grouped by *order*, where order n means a block of two-to-the-n contiguous pages: order 0 is one page, order 1 is two pages, order 3 is eight pages, and so on. When you ask for an order-3 block and none is free, the allocator splits a larger block in half repeatedly, keeping one half (the *buddy*) on the free list for that smaller order. When a block is freed, the allocator checks whether its buddy is also free and, if so, merges the pair back into the next-larger block. This split-and-coalesce design keeps physically contiguous runs available and fights fragmentation.

You rarely call the page allocator directly, but you should know its API because every higher allocator is built on it. The core call returns a struct page pointer; a convenience wrapper returns a ready-to-use kernel virtual address instead. Allocations are always a power-of-two number of pages, so asking for three pages actually consumes a four-page (order-2) block. This rounding is the price of the buddy scheme and a reason not to route small allocations through it.

The single most important practical limit lives here: large *physically contiguous* allocations are hard. As the system runs, physical memory fragments, and high-order allocations (roughly order 3 and above) can fail even when there is plenty of free RAM, simply because no contiguous run of that size exists. This is why drivers needing big buffers either preallocate at boot, use vmalloc when contiguity is not required, or use scatter-gather DMA. Never assume a multi-page kmalloc will succeed at runtime.

### Memory zones

Physical memory is not uniform: some of it has addressing restrictions that matter to hardware. To express this, the page allocator partitions each memory node into *zones*, and a request is satisfied from a permitted set of zones.

- *ZONE_DMA* and *ZONE_DMA32* cover low physical memory reachable by devices with limited addressing. Old ISA hardware needed the first 16 MiB; many PCI devices can only address the low 4 GiB, which is what ZONE_DMA32 represents on 64-bit systems. Target these zones only when a device has an addressing limitation.
- *ZONE_NORMAL* is the workhorse: ordinary memory that the kernel maps directly and uses for almost everything. On 64-bit systems the bulk of RAM lives here.
- *ZONE_HIGHMEM* exists mainly on 32-bit systems, where physical RAM can exceed the kernel virtual address space, so high memory is not permanently mapped and must be mapped temporarily to be touched. On 64-bit kernels there is effectively no high memory, a major reason 64-bit kernel programming is simpler.

The GFP flags you pass select which zones are eligible: a plain GFP_KERNEL allocation draws from normal memory, while GFP_DMA32 or GFP_DMA restrict it to a low zone. The allocator also has a *fallback* order across zones, and per-zone *watermarks* (min, low, high) decide when allocation triggers reclaim or wakes the kswapd daemon to free pages in the background.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/gfp.h>

/* Allocate 2^order contiguous pages; returns a struct page * or NULL. */
struct page *p = alloc_pages(GFP_KERNEL, 2);   /* 4 contiguous pages */
if (!p)
    return -ENOMEM;
void *buf = page_address(p);
/* ... use buf ... */
__free_pages(p, 2);

/* Convenience: get a directly usable virtual address for 2^order pages. */
unsigned long addr = __get_free_pages(GFP_KERNEL, 0);  /* one page */
if (!addr)
    return -ENOMEM;
free_pages(addr, 0);

/* One zeroed page, the common case. */
unsigned long zpage = get_zeroed_page(GFP_KERNEL);

/* Zone selection via GFP flags: only when a device needs a low address. */
void *dma32 = kmalloc(1024, GFP_KERNEL | GFP_DMA32); /* low 4 GiB     */
void *legacy = kmalloc(512, GFP_KERNEL | GFP_DMA);   /* low 16 MiB    */`,
        },
      ],
    },
    {
      heading: 'GFP flags: the most important argument you pass',
      body: `Almost every kernel allocation takes a *get free pages* flag, the GFP argument, and choosing it correctly is the heart of safe kernel memory management. The flags answer three questions: may the allocator sleep, how hard may it try, and which zones are allowed. Getting the sleeping part wrong is a classic, machine-hanging bug.

The two flags you will use ninety percent of the time:

- *GFP_KERNEL* is the normal choice. It allows the allocator to sleep: it may block to reclaim memory, write dirty pages, or wait for the OOM killer. Because it can sleep, you may use it only in *process context* where sleeping is allowed, never while holding a spinlock and never in interrupt context.
- *GFP_ATOMIC* tells the allocator it must not sleep. Use it in atomic context: interrupt handlers, softirqs, or while holding a spinlock. It cannot reclaim, so it dips into emergency reserves and is far more likely to fail, and you must handle that failure. Never call a sleeping allocation in atomic context, and never paper over a sleeping-allocation warning by switching to GFP_ATOMIC without understanding why.

Other useful flags, usually OR-ed in as modifiers: *GFP_NOWAIT* is like atomic but will not even touch emergency reserves; *__GFP_ZERO* returns zeroed memory (kzalloc bakes this in); *__GFP_NOWARN* suppresses the allocation-failure splat when you have a fallback; *__GFP_NORETRY* and *__GFP_RETRY_MAYFAIL* tune how aggressively a large allocation retries; *GFP_NOIO* and *GFP_NOFS* forbid the allocator from recursing into I/O or filesystem code, which matters when you are *inside* the I/O or filesystem path and reclaim must not call back into you.

The deepest pitfall: the rule is not about performance, it is about correctness. Sleeping while holding a spinlock or in an interrupt can deadlock the whole system. When in doubt about your context, ask whether the current code path can be preempted and can block; if it cannot, you need an atomic allocation.`,
      code: [
        {
          lang: 'c',
          src: `/* Process context, can sleep: the default. */
buf = kmalloc(size, GFP_KERNEL);

/* Inside a spinlock or an IRQ handler: must not sleep. */
spin_lock_irqsave(&lock, flags);
node = kmalloc(sizeof(*node), GFP_ATOMIC);   /* may fail: check it */
spin_unlock_irqrestore(&lock, flags);
if (!node)
    return -ENOMEM;

/* Zeroed memory in one call (preferred over kmalloc + memset). */
ctx = kzalloc(sizeof(*ctx), GFP_KERNEL);

/* We have a fallback path, so silence the failure warning. */
big = kmalloc(huge, GFP_KERNEL | __GFP_NOWARN);
if (!big)
    big = vmalloc(huge);`,
        },
      ],
    },
    {
      heading: 'kmalloc and kfree',
      body: `kmalloc is the kernel analogue of user-space malloc and the allocator you will reach for most. It returns a pointer to a chunk of *physically contiguous* memory of at least the requested size, suitable for DMA and for any small object. The companion kfree releases it, and like free it must be called exactly once on a pointer that came from kmalloc; double-freeing or freeing a stray pointer corrupts the allocator.

Key properties to internalize. First, kmalloc memory is physically contiguous, which is its main advantage over vmalloc and the reason it can back DMA buffers. Second, it is fast, because it is layered on the slab allocator and returns memory from the direct map with no page-table manipulation. Third, it is meant for *small* allocations; the practical ceiling is a couple of megabytes and large requests are likely to fail due to fragmentation, so anything page-sized or larger that does not need contiguity belongs in vmalloc instead. Fourth, the actual allocation is rounded up to the next slab size class, so kmalloc of 100 bytes may hand you a 128-byte object; do not rely on the size you asked for.

Use *kzalloc* whenever you want zeroed memory, which is most of the time for structs, instead of kmalloc followed by memset. For arrays, use *kmalloc_array* and *kcalloc*, which compute the total size with built-in overflow checking, an important safety habit: a multiplication like count times size can overflow and hand an attacker a tiny buffer you think is huge. To resize, use *krealloc*. There are NUMA-aware variants (the node-targeted forms) when you care which memory node backs the allocation.

A subtle correctness rule: the GFP flag you pass to kmalloc applies to the whole call, so the sleeping rules from the previous section apply here directly. kmalloc with GFP_KERNEL can sleep; inside a spinlock you must use GFP_ATOMIC.`,
      code: [
        {
          lang: 'c',
          src: `struct widget {
    int id;
    char name[32];
};

/* Allocate and zero a single struct: idiomatic kernel style. */
struct widget *w = kzalloc(sizeof(*w), GFP_KERNEL);
if (!w)
    return -ENOMEM;

/* Allocate an array with overflow-checked size computation. */
int *table = kmalloc_array(n, sizeof(*table), GFP_KERNEL);
if (!table) {
    kfree(w);
    return -ENOMEM;
}

/* kcalloc = kmalloc_array + zeroing. */
int *zeros = kcalloc(n, sizeof(*zeros), GFP_KERNEL);

kfree(zeros);
kfree(table);
kfree(w);   /* free exactly once; kfree(NULL) is safe and is a no-op */`,
        },
      ],
    },
    {
      heading: 'vmalloc: large, virtually contiguous buffers',
      body: `When you need a large buffer but do not need it to be physically contiguous, vmalloc is the tool. It allocates individual pages from the page allocator, possibly scattered all over physical memory, and then builds fresh page-table entries that map them into a single *virtually* contiguous range in the dedicated vmalloc address space. The caller sees one smooth pointer; the hardware sees a jumble.

The trade-offs are the whole story. The win is that vmalloc can satisfy large allocations that kmalloc cannot, because it never needs a physically contiguous run, so fragmentation does not block it. The costs are real: it must allocate and tear down page tables, which is slower than kmalloc; touching the memory can incur extra TLB pressure; and critically, vmalloc memory is *not* physically contiguous and generally *not* usable for DMA, because a device would see the wrong physical pages. Use vmalloc for big software-only buffers: large hash tables, kernel module images, firmware blobs, big temporary buffers. Do not use it for tiny objects (the overhead dwarfs the data) or for anything a device will DMA into.

The matching free is vfree, and there is a sleeping consideration: vmalloc can sleep and must be called from process context. There is no atomic vmalloc, so you cannot use it inside a spinlock or in interrupt context. A common idiom for buffers whose size is unknown is to try kmalloc first for speed and fall back to vmalloc for large sizes; the kernel even provides kvmalloc and kvfree, which do exactly that automatically and are usually the right choice when you just want a buffer of some runtime-determined size.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/vmalloc.h>
#include <linux/slab.h>

/* A big software-only buffer that need not be physically contiguous. */
void *big = vmalloc(8 * 1024 * 1024);   /* 8 MiB */
if (!big)
    return -ENOMEM;
/* ... use big as one contiguous virtual region (NOT for DMA) ... */
vfree(big);

/* Preferred for runtime-sized buffers: kmalloc if it fits, else vmalloc. */
void *buf = kvmalloc(size, GFP_KERNEL);
if (!buf)
    return -ENOMEM;
/* ... */
kvfree(buf);   /* frees correctly whether kmalloc or vmalloc backed it */`,
        },
      ],
    },
    {
      heading: 'The slab allocator and kmem_cache',
      body: `Calling the page allocator for every small object would be wasteful: pages are 4 KiB, objects are often tens of bytes, and rounding every allocation up to a page would burn most of memory. The *slab allocator* solves this. It sits between the page allocator and kmalloc, grabbing pages from the buddy system and carving them into many same-sized objects. Modern kernels ship the SLUB implementation by default; you will also hear SLAB (older) and SLOB (tiny systems), but all expose the same API.

A *kmem_cache* is a pool dedicated to one specific object type and size. You create a cache once, then allocate and free objects from it repeatedly. The benefits are concrete: minimal fragmentation because every object in a cache is identical in size; speed, because freed objects go onto a per-CPU free list and can be reused without touching the page allocator or even taking a lock; cache-friendliness from packing identical objects together; and *constructor* support, so freshly created objects can be pre-initialized once and reused without redoing that work on every allocation.

You will meet caches in two ways. Implicitly: kmalloc itself is built on a set of general-purpose caches, one per power-of-two size class (kmalloc-8, kmalloc-16, kmalloc-32, and so on), which is exactly why kmalloc rounds your request up to the next size class. Explicitly: when your driver allocates and frees many instances of one struct in a hot path, create a dedicated cache for it. This is a real performance technique used throughout the kernel for objects like inodes, dentries, task structs, and network buffers.

The lifecycle: create the cache with kmem_cache_create, allocate objects with kmem_cache_alloc (or the zeroing kmem_cache_zalloc), free each with kmem_cache_free, and destroy the cache with kmem_cache_destroy when your module unloads. A critical rule: kmem_cache_destroy will warn and refuse if any objects are still outstanding, so you must free every object before tearing the cache down, which is a good forcing function for tracking your allocations.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/slab.h>

struct conn {
    int fd;
    unsigned long flags;
    char buf[64];
};

static struct kmem_cache *conn_cache;

/* Create the cache once, typically at module init. */
int conn_cache_init(void)
{
    conn_cache = kmem_cache_create("conn_cache",
                                   sizeof(struct conn),
                                   0,                 /* alignment: 0 = default */
                                   SLAB_HWCACHE_ALIGN,/* align to cache lines    */
                                   NULL);             /* optional constructor    */
    return conn_cache ? 0 : -ENOMEM;
}

/* Hot path: cheap allocate and free from the per-CPU free list. */
struct conn *conn_alloc(void)
{
    return kmem_cache_zalloc(conn_cache, GFP_KERNEL);
}

void conn_free(struct conn *c)
{
    kmem_cache_free(conn_cache, c);
}

/* Free all objects first, then destroy at module exit. */
void conn_cache_exit(void)
{
    kmem_cache_destroy(conn_cache);
}`,
        },
      ],
    },
    {
      heading: 'Choosing an allocator',
      body: `With the pieces in hand, the decision becomes a short checklist. Work through it in order and the right allocator usually falls out.

1. *Is it a small object, and might a device DMA into it, or do you just want simple speed?* Use kmalloc (or kzalloc for zeroed memory). This is the default for almost all small allocations. The memory is physically contiguous and fast.

2. *Are you allocating and freeing many instances of the same struct in a hot path?* Create a dedicated kmem_cache and use kmem_cache_alloc and kmem_cache_free. You get reuse from per-CPU free lists, tight packing, and optional pre-initialization. For occasional allocations this is overkill; plain kmalloc is fine.

3. *Do you need a large buffer that no device will DMA into, and physical contiguity does not matter?* Use vmalloc, or better kvmalloc for a size-adaptive choice. Reserve this for genuinely large software-only buffers, because the page-table overhead is real.

4. *Do you need whole pages, page-aligned, perhaps to hand a struct page to other subsystems?* Use the page allocator directly: alloc_pages or get_free_pages.

5. *Does a device need to DMA into this buffer?* Do not hand-roll it with kmalloc plus virt_to_phys. Use the DMA API (dma_alloc_coherent, dma_map_single, and friends), which picks the correct zone, handles cache coherency, and gives you a device-usable bus address. This is the correct, portable path for device memory.

Cross-cutting rules that apply to every choice. Always pick the GFP flag for your *context*: GFP_KERNEL in process context that can sleep, GFP_ATOMIC under a spinlock or in an interrupt. Always check the return for NULL and unwind cleanly on failure, because kernel memory is largely unreclaimable and allocations really do fail. Always pair each allocate with exactly one matching free on every path, including error paths, since the kernel has no garbage collector and a leak in a long-running kernel is forever. And never assume large physically contiguous allocations will succeed at runtime; design around fragmentation from the start.`,
      code: [
        {
          lang: 'c',
          src: `/* Decision in code form. */

/* 1. Small object, default choice. */
struct ctx *c = kzalloc(sizeof(*c), GFP_KERNEL);

/* 2. Many same-typed objects in a hot path -> dedicated cache. */
obj = kmem_cache_alloc(my_cache, GFP_KERNEL);

/* 3. Large, software-only, contiguity not needed. */
void *table = kvmalloc(num_entries * sizeof(struct entry), GFP_KERNEL);

/* 4. Need whole, page-aligned pages. */
unsigned long page = __get_free_pages(GFP_KERNEL, order);

/* 5. Device DMA -> use the DMA API, not raw kmalloc + virt_to_phys. */
dma_addr_t dma;
void *dbuf = dma_alloc_coherent(dev, len, &dma, GFP_KERNEL);

/* Always: check, and free on every path. */
if (!c) {
    /* ... unwind whatever already succeeded ... */
    return -ENOMEM;
}`,
        },
      ],
    },
  ],
  takeaways: [
    'Physical RAM is managed in fixed-size pages (usually 4 KiB); virtually contiguous memory is not necessarily physically contiguous, and DMA-capable hardware needs the physical kind.',
    'The buddy page allocator hands out power-of-two page blocks and coalesces freed buddies, but large physically contiguous (high-order) allocations can fail at runtime due to fragmentation.',
    'Zones (DMA, DMA32, NORMAL, HIGHMEM) partition physical memory by addressing constraints; GFP flags pick the eligible zones, and you target a low zone only when hardware requires it.',
    'The GFP flag encodes allocation context: GFP_KERNEL may sleep and needs process context, GFP_ATOMIC must not sleep and is for interrupts and spinlock-held code, and it fails more often.',
    'kmalloc gives small, fast, physically contiguous memory (good for DMA); prefer kzalloc for zeroed memory and kmalloc_array/kcalloc for overflow-checked array sizes.',
    'vmalloc gives large, virtually contiguous buffers from scattered pages; it is slower, can sleep, and is generally unusable for DMA. Use kvmalloc/kvfree for size-adaptive buffers.',
    'The slab allocator (SLUB) carves pages into same-sized objects; kmalloc is built on per-size caches, and a dedicated kmem_cache speeds up hot-path allocation of one struct type.',
    'Always check allocations for NULL, pair every allocation with exactly one free on all paths including errors, and free all cache objects before kmem_cache_destroy.',
    'For device memory use the DMA API (dma_alloc_coherent and friends), not hand-rolled kmalloc plus virt_to_phys, so zones and cache coherency are handled correctly.',
  ],
  cheatsheet: [
    { label: 'PAGE_SIZE / PAGE_SHIFT', value: 'Page granularity (e.g. 4096) and its log2; the atom of physical memory' },
    { label: 'kmalloc(size, gfp)', value: 'Small physically contiguous buffer; fast, DMA-capable, rounds up to size class' },
    { label: 'kzalloc(size, gfp)', value: 'Like kmalloc but zeroed; preferred for structs' },
    { label: 'kmalloc_array / kcalloc', value: 'Allocate arrays with built-in multiply-overflow checking' },
    { label: 'kfree(ptr)', value: 'Free kmalloc memory exactly once; kfree(NULL) is a safe no-op' },
    { label: 'vmalloc(size) / vfree', value: 'Large virtually contiguous buffer; not for DMA; can sleep' },
    { label: 'kvmalloc / kvfree', value: 'kmalloc if it fits, else vmalloc; right default for runtime-sized buffers' },
    { label: 'alloc_pages(gfp, order)', value: 'Buddy allocator: 2^order contiguous pages, returns struct page *' },
    { label: '__get_free_pages(gfp, order)', value: 'Same as alloc_pages but returns a usable virtual address' },
    { label: 'GFP_KERNEL', value: 'Normal allocation; may sleep; process context only' },
    { label: 'GFP_ATOMIC', value: 'Must not sleep; for IRQ/softirq/spinlock-held code; fails more often' },
    { label: '__GFP_ZERO / __GFP_NOWARN', value: 'Zero the memory / suppress the failure warning when you have a fallback' },
    { label: 'kmem_cache_create / _alloc / _free', value: 'Dedicated pool for one struct type; fast hot-path reuse' },
    { label: 'dma_alloc_coherent(dev, ...)', value: 'Correct way to get device-DMA-capable memory; picks zone and handles coherency' },
  ],
}

export default note
