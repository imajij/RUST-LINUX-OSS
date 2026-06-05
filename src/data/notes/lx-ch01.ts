import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-01',
  track: 'linux',
  chapter: 1,
  title: 'C for the Kernel',
  summary: `The Linux kernel is written in C - a specific, disciplined dialect of C that lives much closer to the hardware than the C taught in most courses. This chapter builds the mental model you need to read and write kernel code: how pointers and memory actually work, how structs and unions lay out bytes, how bit manipulation and fixed-width types let you talk to hardware precisely, and why const, volatile, endianness, and the preprocessor all matter when there is no runtime and no safety net. Mastering this is also the fastest path to understanding Rust-for-Linux, because Rust's ownership and aliasing rules are precisely the rules C never enforced - knowing what can go wrong in C is what makes Rust's guarantees click.`,
  sections: [
    {
      heading: 'Pointers and pointer arithmetic',
      body: `A pointer is just a variable whose value is a memory address. The type of a pointer tells the compiler two things: what kind of object lives at that address, and - crucially - how big that object is. That size is what makes pointer arithmetic work.

When you add 1 to a pointer, you do not add 1 byte. You add one element. If p points to an int and an int is 4 bytes, then p plus 1 is 4 bytes further along in memory. The compiler scales the integer you add by the size of the pointed-to type. This is why the pointed-to type matters even though, at the hardware level, every address is just a number: the type is how the compiler knows the stride.

Dereferencing, written with a leading star, follows the address to read or write the object it points at. The address-of operator, the ampersand, goes the other way - it produces the address of an existing object. These two are inverses.

### Why kernel code lives and dies by pointers

There is no runtime, no garbage collector, and no bounds checking in the kernel. A pointer that points to freed memory (a *use-after-free*), a pointer one element past the end of an array that you then dereference (an out-of-bounds access), or a pointer that was never initialized are not exceptions - they are silent memory corruption, the source of most serious kernel bugs and security holes. The discipline you build here is exactly the discipline Rust's borrow checker automates.

### NULL and the void pointer

The constant NULL is a pointer that points at nothing; dereferencing it is the classic null-pointer crash (in the kernel, an oops). Always check pointers that can fail - kmalloc and friends return NULL on failure. A void pointer is a typed hole: it can hold any object address but you cannot dereference it or do arithmetic on it until you cast it back to a concrete type. The kernel uses void pointers everywhere for generic interfaces, for example the private data field hung off many structures.

> Pitfall: pointer arithmetic on a void pointer is undefined in standard C. GCC permits it as an extension (treating void as size 1), and the kernel relies on this, but do not assume it elsewhere.`,
      code: [
        {
          lang: 'c',
          src: `int a = 42;
int *p = &a;        // p holds the ADDRESS of a
*p = 99;            // write through p: a is now 99

int arr[4] = {10, 20, 30, 40};
int *q = arr;       // q points at arr[0]
q + 1;              // address of arr[1]: +sizeof(int) bytes, NOT +1 byte
*(q + 2);           // == arr[2] == 30   (this is exactly what q[2] means)

// Walk an array with a moving pointer:
for (int *it = arr; it < arr + 4; it++)
    *it += 1;       // bump each element

// void * is generic but must be cast before use:
void *raw = arr;
int *back = (int *)raw;   // now dereferenceable again

// Always guard allocations that can fail:
struct foo *f = kmalloc(sizeof(*f), GFP_KERNEL);
if (!f)
    return -ENOMEM;       // f could be NULL - never blindly deref`
        }
      ]
    },
    {
      heading: 'Memory layout: stack, heap, and the kernel reality',
      body: `Every C program divides memory into regions, and knowing which region an object lives in tells you its lifetime and its dangers.

- The **text** segment holds the compiled machine code; it is read-only and executable.
- The **data** and **BSS** segments hold global and static variables. Initialized globals go in data; zero-initialized ones go in BSS (which costs no space in the binary, just a size). These live for the entire program.
- The **stack** holds local variables and the call chain. It grows and shrinks automatically as functions are called and return. Fast, but tiny and short-lived: a local variable ceases to exist the moment its function returns.
- The **heap** is memory you request explicitly and must release explicitly. It lives until you free it.

### The kernel changes the rules

In userspace you call malloc and free. In the kernel you call kmalloc and kfree (for physically contiguous memory), vmalloc and vfree (virtually contiguous, possibly physically scattered), and a family of others, each taking allocation flags such as GFP_KERNEL (may sleep) or GFP_ATOMIC (must not sleep, used in interrupt context). The kernel stack is famously small - on the order of a couple of pages, often 8 or 16 KB total for an entire call chain. Large local arrays or deep recursion will silently overflow the stack and corrupt memory. So big buffers go on the heap, never on the stack.

### The two classic lifetime bugs

Returning the address of a local variable is a *dangling pointer*: the stack frame is gone, the address now refers to garbage. Freeing memory and then using it is a *use-after-free*. Neither is caught at runtime in C. Both are exactly what Rust lifetimes and ownership prevent at compile time - the same bug, made impossible.

> Pitfall: every kmalloc needs exactly one matching kfree, on every exit path including error paths. Forgetting one on an error branch is a memory leak; doing it twice is a double-free.`,
      code: [
        {
          lang: 'c',
          src: `// WRONG: returns a pointer into a stack frame that is destroyed on return.
int *broken(void)
{
    int local = 5;
    return &local;        // dangling the instant broken() returns
}

// RIGHT: heap memory outlives the function; caller owns it.
int *make_counter(void)
{
    int *c = kmalloc(sizeof(*c), GFP_KERNEL);
    if (!c)
        return NULL;
    *c = 0;
    return c;             // caller must kfree() this later
}

// Stack is tiny in the kernel - do NOT do this:
void bad(void)
{
    char huge[64 * 1024];   // 64 KB local: overflows the kernel stack
    /* ... */
}

// Heap instead, with cleanup on every path:
void good(void)
{
    char *buf = kmalloc(64 * 1024, GFP_KERNEL);
    if (!buf)
        return;
    /* ... use buf ... */
    kfree(buf);             // exactly one free
}`
        }
      ]
    },
    {
      heading: 'Structs, unions, and function pointers',
      body: `A **struct** groups related fields into one object. The fields are laid out in declaration order, but the compiler inserts invisible *padding* bytes so each field lands on its natural alignment boundary (a 4-byte int wants a 4-byte-aligned address). This means the size of a struct is usually larger than the sum of its fields, and reordering fields from largest to smallest can shrink it. Never assume the offset of a field - use the offsetof macro, which the kernel uses constantly.

A **union** overlays all its members in the same storage; its size is that of its largest member, and writing one member clobbers the others. Unions are how you reinterpret the same bytes as different types, or save space when only one of several fields is ever valid at a time.

### Function pointers: how the kernel does polymorphism

C has no objects and no virtual methods, yet the kernel is deeply pluggable: filesystems, drivers, and schedulers all expose the same interface with different implementations. The mechanism is the **function pointer** - a variable holding the address of a function. The kernel packs these into *operations structs* (file_operations, net_device_ops, and many more). A driver fills in a static instance of such a struct, and the core kernel calls through the pointers without knowing or caring which driver it is talking to. This is C's version of an interface or trait, done by hand. Reading the kernel means recognizing this pattern instantly.

> Pitfall: a function pointer's type must match the function's signature exactly (return type and every parameter). A mismatch is undefined behavior, and with modern control-flow-integrity hardening it can fault at call time. Also: an uninitialized or NULL op pointer called by the core is an instant oops, so leave unused slots out (designated initializers zero them) and check before calling optional ones.`,
      code: [
        {
          lang: 'c',
          src: `#include <stddef.h>   // offsetof

struct packet {
    unsigned char  type;   // 1 byte ...
    /* 3 padding bytes inserted here for alignment */
    unsigned int   len;    // ... so this 4-byte field is 4-aligned
    unsigned char *data;
};
// sizeof(struct packet) > 1 + 4 + 8 because of padding.
size_t off = offsetof(struct packet, len);   // exact byte offset, portably

// A union reinterprets the same storage:
union ip_or_raw {
    unsigned int  addr;        // view as one 32-bit number
    unsigned char octet[4];    // or as four bytes (same memory)
};

// Function pointer = a callable interface slot:
struct file_operations {
    ssize_t (*read)(struct file *, char *, size_t);
    ssize_t (*write)(struct file *, const char *, size_t);
    int     (*open)(struct inode *, struct file *);
};

static ssize_t my_read(struct file *f, char *buf, size_t n) { return 0; }

// Designated initializers: name the slots; unnamed ones are zeroed (NULL).
static const struct file_operations my_fops = {
    .read = my_read,
    .open = NULL,           // optional op left unset
};

// The core calls through the pointer - only if present:
if (my_fops.read)
    my_fops.read(file, buffer, count);`
        }
      ]
    },
    {
      heading: 'Bit manipulation',
      body: `Hardware registers, flag fields, and permission masks pack many independent boolean or small-integer values into the bits of a single word. To talk to them you manipulate individual bits with the bitwise operators: AND, OR, XOR, NOT, and the left and right shift operators.

The four idioms you must know cold:

1. **Set a bit:** OR with a mask that has that bit on - value becomes value OR (1 shifted left by n).
2. **Clear a bit:** AND with the inverse mask - value becomes value AND NOT (1 shifted left by n). The NOT flips the mask so every bit except the target is 1.
3. **Toggle a bit:** XOR with the mask - value becomes value XOR (1 shifted left by n).
4. **Test a bit:** AND with the mask and check for non-zero.

### A trap that bites everyone

Do not confuse the bitwise operators (single ampersand, single pipe) with the logical operators (double ampersand, double pipe). The logical ones short-circuit and yield 0 or 1; the bitwise ones operate on every bit. Writing logical-and where you meant bitwise-and is a classic, hard-to-spot bug.

### Two more sharp edges

Shifting a signed negative number, or shifting by an amount greater than or equal to the type's width, is undefined behavior. Right-shifting a signed value is implementation-defined for the sign bit. So in the kernel you do bit work on **unsigned** types. The kernel also provides atomic, race-free bit operations - set_bit, clear_bit, test_and_set_bit - which you must use instead of the raw operators whenever the word can be touched by more than one CPU concurrently, because a plain read-modify-write is not atomic.

> Pitfall: 1 shifted left by 31 overflows a signed 32-bit int (undefined). Use an unsigned literal - written with a U suffix, as in 1U or 1UL - when the high bit is in play. The kernel BIT(n) macro expands to exactly this.`,
      code: [
        {
          lang: 'c',
          src: `#define BIT(n)   (1UL << (n))     // note the U: unsigned, no overflow

unsigned int flags = 0;

flags |=  BIT(2);              // SET bit 2
flags &= ~BIT(2);             // CLEAR bit 2 (~ inverts the mask)
flags ^=  BIT(5);             // TOGGLE bit 5
if (flags & BIT(5))           // TEST bit 5
    /* bit is set */;

// Extract a multi-bit field (bits 4..7) from a register word:
unsigned int reg = 0xAB;
unsigned int nibble = (reg >> 4) & 0xF;   // == 0xA

// Build a value into a field without disturbing other bits:
reg &= ~(0xF << 4);           // clear the field
reg |=  (0x3 << 4);           // write 0x3 into it

// Bitwise vs logical - NOT the same:
//   a & b   operates on every bit
//   a && b  yields 0 or 1 and short-circuits

// Concurrency: use atomic ops when other CPUs may race you:
set_bit(3, &shared_flags);            // race-free SET
if (test_and_set_bit(0, &lock_word))  // atomic test-then-set
    /* someone else already had it */;`
        }
      ]
    },
    {
      heading: 'const, volatile, and the preprocessor',
      body: `**const** is a promise to the compiler: this object will not be modified through this name. It enables optimization and, more importantly in the kernel, documents intent and lets the compiler reject accidental writes. Read const declarations right-to-left: const char star ptr is a mutable pointer to constant chars (you may not change the chars, but you may repoint), while char star const ptr is a constant pointer to mutable chars (you may change the chars, but not where it points). The position of const relative to the star is everything. This mirrors Rust's shared-versus-mutable reference distinction exactly.

**volatile** tells the compiler that an object can change behind its back - by hardware, by another thread, by an interrupt handler - so it must not cache the value in a register or optimize away reads and writes. It is required for memory-mapped I/O registers, where reading the same address twice can legitimately return different values and where every write has a side effect. Note carefully: volatile is *not* a synchronization primitive. It does not provide atomicity or ordering between CPUs - that is what locks, atomics, and memory barriers are for. The kernel deliberately avoids volatile for most shared data and uses READ_ONCE and WRITE_ONCE plus barriers instead.

### The preprocessor: text substitution before compilation

The preprocessor runs first and is pure textual manipulation - it knows nothing about C types. Header inclusion pastes one file into another. Object-like macros define constants; function-like macros expand into code. Conditional compilation includes or excludes whole regions based on whether a symbol is defined, which is how the kernel compiles different code for different architectures and configurations (the CONFIG symbols).

The cardinal rule of function-like macros: **parenthesize everything** - the whole body and every parameter - because the macro is blind text substitution and will otherwise bind to surrounding operators in surprising ways. And never pass an expression with side effects (like an increment) to a macro that uses its argument more than once, because the side effect happens every time the argument appears.

> Pitfall: a macro defined without inner parentheses, such as defining SQR(x) as x times x, computes the wrong thing for SQR(a + b). Always wrap: ((x) times (x)). Prefer static inline functions or enum constants over macros when you can - they are type-checked; macros are not.`,
      code: [
        {
          lang: 'c',
          src: `// const: read right-to-left, watch the star.
const char *a;        // pointer to const char: can repoint, can't write *a
char *const b = x;    // const pointer to char: can write *b, can't repoint
const char *const c = x;  // can do neither

// volatile: forces a real memory access every time (MMIO register).
volatile unsigned int *reg = (volatile unsigned int *)0xFEE00000;
*reg = 1;             // this write is NOT optimized away
unsigned int s = *reg;  // this read actually hits hardware

// Preprocessor constants and conditional compilation:
#define MAX_RETRIES 5

#ifdef CONFIG_SMP
    spin_lock(&lock);     // multiprocessor build only
#endif

// Function-like macro: parenthesize the body AND every parameter.
#define MIN(a, b)  ((a) < (b) ? (a) : (b))
#define SQR(x)     ((x) * (x))     // ((a+b)*(a+b)) - correct because wrapped

// Side-effect trap: MIN(i++, j) evaluates i++ twice. Don't do that.
// Prefer a typed static inline when possible:
static inline int min_int(int a, int b) { return a < b ? a : b; }`
        }
      ]
    },
    {
      heading: 'Fixed-width types, the u8/u32 style, and endianness',
      body: `Plain C types are a portability minefield: the standard only guarantees minimum sizes, so int might be 16 or 32 bits, long is 32 bits on some platforms and 64 on others, and char may be signed or unsigned depending on the compiler. When you are laying out a hardware register or a network packet, an off-by-a-factor-of-two size is a disaster. The fix is **fixed-width integer types**, which name the exact bit width.

Standard C (in the stdint header) gives you int8_t, uint8_t, int32_t, uint32_t, and so on - signed and unsigned, in 8, 16, 32, and 64 bits. The Linux kernel has its own shorter spellings used everywhere in kernel code: u8, u16, u32, u64 for unsigned and s8, s16, s32, s64 for signed. There are also userspace-facing forms with double underscores for types exposed across the kernel-user boundary. When a structure mirrors hardware or a wire format, you use these and only these - never int or long.

### Endianness: the order of bytes within a word

A multi-byte integer can be stored two ways. **Little-endian** puts the least-significant byte at the lowest address (x86, most ARM); **big-endian** puts the most-significant byte first (network byte order, some other architectures). The same four bytes in memory mean different numbers depending on which convention the reader assumes. This matters the instant data crosses a boundary: a network packet, a filesystem on disk, a device that fixes its own byte order. Within one machine talking to itself you rarely notice; across machines or to hardware, getting it wrong silently corrupts every multi-byte value.

The kernel makes byte order explicit with annotated types - __le16, __le32, __be16, __be32 - and conversion helpers. You convert host order to and from a specific order with functions like cpu_to_le32, le32_to_cpu, cpu_to_be32, and be32_to_cpu. These compile to nothing on a machine that already matches and to a byte swap otherwise, so they are free where possible and correct everywhere.

> Pitfall: never read a multi-byte field straight out of a packet or on-disk structure and use it as a number. Run it through the matching conversion helper first, every time, even on a little-endian box - so the code stays correct if it is ever compiled for big-endian hardware.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/types.h>   // u8, u16, u32, u64, s8 ...

// A header that mirrors a wire format: exact widths, exact byte order.
struct on_wire_hdr {
    u8     version;        // exactly 8 bits, unsigned
    u8     flags;
    __be16 length;         // 16-bit field stored big-endian (network order)
    __be32 magic;          // 32-bit big-endian
};

// Reading it correctly: convert from the wire's order to host order.
void parse(const struct on_wire_hdr *h)
{
    u16 len   = be16_to_cpu(h->length);   // big-endian -> CPU order
    u32 magic = be32_to_cpu(h->magic);
    /* use len and magic as ordinary host numbers */
}

// Writing a value out in a fixed order:
struct on_wire_hdr out;
out.length = cpu_to_be16(1500);   // host -> big-endian for the wire

// Why not plain int? Its width is not guaranteed:
//   int   -> at least 16 bits (often 32)
//   long  -> 32 bits on some ABIs, 64 on others
// Hardware and protocols need exact sizes: use u8/u16/u32/u64.`
        }
      ]
    },
    {
      heading: 'Arrays vs pointers: the decay trap',
      body: `Arrays and pointers feel interchangeable in C, and that illusion is the source of a whole category of bugs. They are genuinely different things.

An **array** is a contiguous block of N elements; its name refers to the whole block. The compiler knows its full size, so sizeof on an array gives the total bytes (element size times count), and you can recover the element count by dividing. A **pointer** is a single address-sized variable; sizeof on a pointer is just the size of an address (8 bytes on a 64-bit machine), regardless of how much it points at.

### Array-to-pointer decay

In almost every expression, an array's name *decays* into a pointer to its first element. This is why you can write array indexing on a pointer and pointer arithmetic on an array - underneath, indexing is defined as dereferencing a pointer plus an offset. Decay is convenient but it loses the size: once an array has decayed to a pointer, the length information is gone.

### The function-parameter gotcha

When you pass an array to a function, it decays to a pointer at the call. So a parameter written as taking an array is silently rewritten by the compiler into a pointer parameter. Inside that function, sizeof gives the pointer size, not the array size - the count is unrecoverable. This is the number-one beginner mistake: trying to compute a length with sizeof inside a function that received an array. The fix is the universal C convention of passing the length as a separate explicit argument. Every kernel function that takes a buffer also takes its length, for exactly this reason - and unchecked length handling is where buffer overflows come from. This whole class of problem is precisely what Rust's slices (a pointer plus a length, bundled and bounds-checked) were designed to eliminate.

> Pitfall: sizeof(arr) divided by sizeof(arr[0]) gives the element count only where arr is a real array in scope - never after it has decayed to a pointer, and never on a function parameter. When in doubt, pass and trust an explicit length.`,
      code: [
        {
          lang: 'c',
          src: `int arr[5] = {1, 2, 3, 4, 5};

sizeof(arr);                      // 20 (5 * sizeof(int)) - whole array
sizeof(arr) / sizeof(arr[0]);     // 5  - element count (real array only)

int *p = arr;                     // array name DECAYS to &arr[0]
sizeof(p);                        // 8 on a 64-bit box - just a pointer!

arr[2];                           // identical to *(arr + 2) and *(p + 2)

// The classic trap: length is lost across a call.
void process(int a[])             // <- secretly rewritten to int *a
{
    // sizeof(a) is 8 (a pointer), NOT 20. Count is unrecoverable here.
    size_t wrong = sizeof(a) / sizeof(a[0]);   // == 2, not 5 - BUG
}

// The fix - and the universal kernel convention: pass the length.
void process_ok(const int *a, size_t n)
{
    for (size_t i = 0; i < n; i++)
        /* use a[i] - bounded by the n the caller promised */;
}

process_ok(arr, sizeof(arr) / sizeof(arr[0]));   // count taken where arr is real`
        }
      ]
    }
  ],
  takeaways: [
    'A pointer is an address plus a type; the type sets the stride, so pointer plus 1 advances by one element (sizeof of the pointee), not one byte.',
    'There is no runtime safety net in the kernel: use-after-free, out-of-bounds, and dangling pointers are silent corruption, not exceptions - this is exactly what Rust ownership prevents.',
    'Know your memory regions: stack locals die on return, heap memory needs an explicit kfree on every path, and the kernel stack is tiny so big buffers go on the heap.',
    'Structs have alignment padding (use offsetof, never guess offsets); unions overlay one storage; function pointers in ops structs are how C and the kernel implement interfaces.',
    'Master the four bit idioms - set with OR, clear with AND-NOT, toggle with XOR, test with AND - do bit work on unsigned types, and use atomic bit ops when other CPUs can race.',
    'Read const right-to-left around the star; volatile forces real memory accesses for MMIO but is NOT synchronization; parenthesize every macro parameter and the whole body.',
    'Plain int and long have platform-dependent widths; for hardware and wire formats use the kernel fixed-width types u8/u16/u32/u64 and s8/s16/s32/s64.',
    'Convert byte order explicitly at every boundary with cpu_to_le32, le32_to_cpu, cpu_to_be32, be32_to_cpu and the __le/__be annotated types - even on a little-endian build.',
    'Arrays decay to pointers and lose their length: sizeof on a function parameter measures a pointer, not the array, so always pass an explicit length - the bug Rust slices fix.'
  ],
  cheatsheet: [
    { label: '&x  /  *p', value: 'Address-of x; dereference (follow) pointer p' },
    { label: 'p + 1', value: 'Advance by one element (sizeof pointee), not one byte' },
    { label: 'void *', value: 'Generic address; cast to a real type before use/deref' },
    { label: 'kmalloc / kfree', value: 'Heap alloc/free; check NULL, free once per path' },
    { label: 'offsetof(T, field)', value: 'Exact byte offset of a struct field (portable)' },
    { label: 'BIT(n) = (1UL << n)', value: 'Single-bit mask, unsigned so it never overflows' },
    { label: 'x |= m / x &= ~m', value: 'Set bits in mask m / clear bits in mask m' },
    { label: 'x ^= m / x & m', value: 'Toggle bits in m / test bits in m' },
    { label: 'const char *p', value: 'Pointer to const data: can repoint, cannot write *p' },
    { label: 'volatile T *', value: 'Force real read/write each access (MMIO), not a lock' },
    { label: '#define / #ifdef', value: 'Text-substitution macro / conditional compilation' },
    { label: 'u8 u16 u32 u64', value: 'Kernel exact-width unsigned ints (s8.. for signed)' },
    { label: 'be32_to_cpu / cpu_to_le32', value: 'Convert wire/disk byte order to and from host order' },
    { label: 'sizeof(arr)/sizeof(arr[0])', value: 'Element count - only on a real array, never a parameter' }
  ]
}

export default note
