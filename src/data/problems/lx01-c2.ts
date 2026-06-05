import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch01-c-036',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Swap Two Ints Through Pointers',
    prompt: `Write a function with signature

    void swap(int *a, int *b);

that swaps the values pointed to by a and b. In main, declare x = 7 and y = 13, call swap(&x, &y), then print them as "x=13 y=7". This is the classic by-reference pattern the kernel uses everywhere instead of returning values.`,
    hints: [
      'Pass addresses with &, dereference with * inside the function.',
      'You need a temporary local variable to hold one value during the swap.',
    ],
    solution: `#include <stdio.h>

void swap(int *a, int *b)
{
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void)
{
    int x = 7, y = 13;
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
    starter: `#include <stdio.h>

void swap(int *a, int *b)
{
    /* TODO: swap *a and *b using a temporary */
}

int main(void)
{
    int x = 7, y = 13;
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
    tags: ['pointers', 'c', 'kernel'],
  },
  {
    id: 'lx-ch01-c-037',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum An Array With A Walking Pointer',
    prompt: `Write a function

    long sum_array(const int *arr, size_t n);

that returns the sum of the n ints starting at arr, but you must NOT use any index operator [] inside the function. Walk a pointer p from arr to arr + n instead. In main, sum {2,4,6,8,10} and print the result (30).`,
    hints: [
      'A pointer can be incremented: p++ moves it one int forward.',
      'Loop while p < arr + n and add *p each iteration.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

long sum_array(const int *arr, size_t n)
{
    long total = 0;
    const int *p;
    for (p = arr; p < arr + n; p++)
        total += *p;
    return total;
}

int main(void)
{
    int a[] = { 2, 4, 6, 8, 10 };
    printf("%ld\\n", sum_array(a, 5));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

long sum_array(const int *arr, size_t n)
{
    long total = 0;
    /* TODO: walk a pointer p from arr to arr + n, no [] allowed */
    return total;
}

int main(void)
{
    int a[] = { 2, 4, 6, 8, 10 };
    printf("%ld\\n", sum_array(a, 5));
    return 0;
}`,
    tags: ['pointers', 'arrays', 'c'],
  },
  {
    id: 'lx-ch01-c-038',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pointer Arithmetic Scaling',
    prompt: `Demonstrate that pointer arithmetic scales by element size. Given

    int a[8];

print three numbers on one line separated by spaces:
1) (&a[3]) - (&a[0])  as a ptrdiff_t (should be 3),
2) ((char *)&a[3]) - ((char *)&a[0])  as a long (should be 12 on a typical build where int is 4 bytes),
3) sizeof(int) as a size_t.

This shows that subtracting int* pointers gives element count, while byte distance is element count times sizeof.`,
    hints: [
      'Subtracting two pointers of the same type yields a ptrdiff_t element count.',
      'Cast to (char *) before subtracting to get a raw byte distance.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

int main(void)
{
    int a[8];
    ptrdiff_t elems = &a[3] - &a[0];
    long bytes = (char *)&a[3] - (char *)&a[0];
    printf("%td %ld %zu\\n", elems, bytes, sizeof(int));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

int main(void)
{
    int a[8];
    /* TODO: compute the element distance, the byte distance, and sizeof(int) */
    return 0;
}`,
    tags: ['pointers', 'arithmetic', 'c'],
  },
  {
    id: 'lx-ch01-c-039',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reverse An Array In Place',
    prompt: `Write a function

    void reverse(int *arr, size_t n);

that reverses the array in place using two pointers (one at the front, one at the back) that move toward each other. Do not allocate a second array. In main, reverse {1,2,3,4,5} and print "5 4 3 2 1".`,
    hints: [
      'Set int *lo = arr; int *hi = arr + n - 1; then loop while lo < hi.',
      'Swap *lo and *hi, then lo++ and hi--.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

void reverse(int *arr, size_t n)
{
    int *lo = arr;
    int *hi = arr + n - 1;
    while (lo < hi) {
        int tmp = *lo;
        *lo = *hi;
        *hi = tmp;
        lo++;
        hi--;
    }
}

int main(void)
{
    int a[] = { 1, 2, 3, 4, 5 };
    size_t n = 5;
    reverse(a, n);
    for (size_t i = 0; i < n; i++)
        printf("%d%s", a[i], i + 1 < n ? " " : "\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

void reverse(int *arr, size_t n)
{
    /* TODO: two pointers lo and hi moving toward each other */
}

int main(void)
{
    int a[] = { 1, 2, 3, 4, 5 };
    size_t n = 5;
    reverse(a, n);
    for (size_t i = 0; i < n; i++)
        printf("%d%s", a[i], i + 1 < n ? " " : "\\n");
    return 0;
}`,
    tags: ['pointers', 'arrays', 'c'],
  },
  {
    id: 'lx-ch01-c-040',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Struct And A Pointer To It',
    prompt: `Define a struct point with int fields x and y. Write a function

    void move_by(struct point *p, int dx, int dy);

that adds dx to p->x and dy to p->y using the arrow operator. In main, create a point {3, 4}, call move_by(&pt, 10, -2), and print "pt=(13,2)".`,
    hints: [
      'p->x is shorthand for (*p).x.',
      'Pass the address of the struct so the function mutates the caller-owned object.',
    ],
    solution: `#include <stdio.h>

struct point {
    int x;
    int y;
};

void move_by(struct point *p, int dx, int dy)
{
    p->x += dx;
    p->y += dy;
}

int main(void)
{
    struct point pt = { 3, 4 };
    move_by(&pt, 10, -2);
    printf("pt=(%d,%d)\\n", pt.x, pt.y);
    return 0;
}`,
    starter: `#include <stdio.h>

struct point {
    int x;
    int y;
};

void move_by(struct point *p, int dx, int dy)
{
    /* TODO: update p->x and p->y */
}

int main(void)
{
    struct point pt = { 3, 4 };
    move_by(&pt, 10, -2);
    printf("pt=(%d,%d)\\n", pt.x, pt.y);
    return 0;
}`,
    tags: ['structs', 'pointers', 'c'],
  },
  {
    id: 'lx-ch01-c-041',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Set, Clear, And Toggle A Bit',
    prompt: `Implement three functions operating on a uint32_t flags word and a bit position 0..31:

    uint32_t set_bit(uint32_t v, unsigned n);     // turn bit n on
    uint32_t clear_bit(uint32_t v, unsigned n);   // turn bit n off
    uint32_t toggle_bit(uint32_t v, unsigned n);  // flip bit n

Use only shifts and bitwise AND/OR/XOR/NOT. In main, start from 0, set bit 0 and bit 4, clear bit 0, toggle bit 4, and print the final value in hex (0x0).`,
    hints: [
      'The mask for bit n is (1u << n).',
      'Set with | mask, clear with & ~mask, toggle with ^ mask.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

uint32_t set_bit(uint32_t v, unsigned n)    { return v | (1u << n); }
uint32_t clear_bit(uint32_t v, unsigned n)  { return v & ~(1u << n); }
uint32_t toggle_bit(uint32_t v, unsigned n) { return v ^ (1u << n); }

int main(void)
{
    uint32_t v = 0;
    v = set_bit(v, 0);
    v = set_bit(v, 4);
    v = clear_bit(v, 0);
    v = toggle_bit(v, 4);
    printf("0x%x\\n", v);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

uint32_t set_bit(uint32_t v, unsigned n)    { /* TODO */ return v; }
uint32_t clear_bit(uint32_t v, unsigned n)  { /* TODO */ return v; }
uint32_t toggle_bit(uint32_t v, unsigned n) { /* TODO */ return v; }

int main(void)
{
    uint32_t v = 0;
    v = set_bit(v, 0);
    v = set_bit(v, 4);
    v = clear_bit(v, 0);
    v = toggle_bit(v, 4);
    printf("0x%x\\n", v);
    return 0;
}`,
    tags: ['bitwise', 'masks', 'c'],
  },
  {
    id: 'lx-ch01-c-042',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test A Bit',
    prompt: `Write

    int test_bit(uint32_t v, unsigned n);

that returns 1 if bit n of v is set and 0 otherwise (always 0 or 1, never any other nonzero value). In main, take v = 0xA (binary 1010) and print test_bit for bits 0,1,2,3 on one line as "0 1 0 1".`,
    hints: [
      'Mask with (v >> n) & 1u, or check ((v & (1u << n)) != 0).',
      'Use !! to force any nonzero result down to exactly 1.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

int test_bit(uint32_t v, unsigned n)
{
    return (v >> n) & 1u;
}

int main(void)
{
    uint32_t v = 0xA;
    for (unsigned n = 0; n < 4; n++)
        printf("%d%s", test_bit(v, n), n < 3 ? " " : "\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

int test_bit(uint32_t v, unsigned n)
{
    /* TODO: return 1 if bit n is set, else 0 */
    return 0;
}

int main(void)
{
    uint32_t v = 0xA;
    for (unsigned n = 0; n < 4; n++)
        printf("%d%s", test_bit(v, n), n < 3 ? " " : "\\n");
    return 0;
}`,
    tags: ['bitwise', 'masks', 'c'],
  },
  {
    id: 'lx-ch01-c-043',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Set Bits (Popcount)',
    prompt: `Write

    unsigned popcount(uint32_t v);

that returns the number of 1 bits in v, using a loop and bitwise operations (do not use the gcc builtin). In main, print popcount for 0, 0xFF, and 0xFFFFFFFF on one line as "0 8 32".`,
    hints: [
      'A simple version: while v is nonzero, add (v & 1) and shift v right.',
      'A faster trick: v &= (v - 1) clears the lowest set bit each iteration.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

unsigned popcount(uint32_t v)
{
    unsigned count = 0;
    while (v) {
        v &= v - 1;   /* clear lowest set bit */
        count++;
    }
    return count;
}

int main(void)
{
    printf("%u %u %u\\n", popcount(0), popcount(0xFF), popcount(0xFFFFFFFFu));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

unsigned popcount(uint32_t v)
{
    unsigned count = 0;
    /* TODO: count the 1 bits with a loop */
    return count;
}

int main(void)
{
    printf("%u %u %u\\n", popcount(0), popcount(0xFF), popcount(0xFFFFFFFFu));
    return 0;
}`,
    tags: ['bitwise', 'popcount', 'c'],
  },
  {
    id: 'lx-ch01-c-044',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Extract A Bitfield',
    prompt: `Many hardware registers pack several values into one word. Write

    uint32_t extract_field(uint32_t reg, unsigned shift, unsigned width);

that returns the width-bit value located at bit offset shift inside reg. For example, with reg = 0x00AB0000, shift = 16, width = 8, the result is 0xAB. In main, print that example in hex.`,
    hints: [
      'Build a width-bit mask: (1u << width) - 1.',
      'Shift reg right by shift first, then AND with the mask.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

uint32_t extract_field(uint32_t reg, unsigned shift, unsigned width)
{
    uint32_t mask = (1u << width) - 1;
    return (reg >> shift) & mask;
}

int main(void)
{
    printf("0x%X\\n", extract_field(0x00AB0000u, 16, 8));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

uint32_t extract_field(uint32_t reg, unsigned shift, unsigned width)
{
    /* TODO: mask = (1u << width) - 1; return (reg >> shift) & mask; */
    return 0;
}

int main(void)
{
    printf("0x%X\\n", extract_field(0x00AB0000u, 16, 8));
    return 0;
}`,
    tags: ['bitwise', 'masks', 'registers'],
  },
  {
    id: 'lx-ch01-c-045',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Insert A Value Into A Bitfield',
    prompt: `Write

    uint32_t insert_field(uint32_t reg, unsigned shift, unsigned width, uint32_t val);

that returns reg with the width-bit window at offset shift replaced by val (val's low width bits). You must first CLEAR the old bits in that window, then OR in the new ones, so neighbouring fields are preserved. Example: insert_field(0xFF00FFFF, 16, 8, 0xAB) -> 0xFFABFFFF. Print that in hex.`,
    hints: [
      'mask = (1u << width) - 1; clear with reg & ~(mask << shift).',
      'OR in (val & mask) << shift so an oversized val cannot spill into other fields.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

uint32_t insert_field(uint32_t reg, unsigned shift, unsigned width, uint32_t val)
{
    uint32_t mask = (1u << width) - 1;
    reg &= ~(mask << shift);
    reg |= (val & mask) << shift;
    return reg;
}

int main(void)
{
    printf("0x%X\\n", insert_field(0xFF00FFFFu, 16, 8, 0xAB));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

uint32_t insert_field(uint32_t reg, unsigned shift, unsigned width, uint32_t val)
{
    /* TODO: clear the window, then OR in the masked, shifted value */
    return reg;
}

int main(void)
{
    printf("0x%X\\n", insert_field(0xFF00FFFFu, 16, 8, 0xAB));
    return 0;
}`,
    tags: ['bitwise', 'masks', 'registers'],
  },
  {
    id: 'lx-ch01-c-046',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Named Flag Bits With An Enum',
    prompt: `Define flag constants as powers of two using an enum (the kernel style for permission/feature flags):

    enum { F_READ = 1 << 0, F_WRITE = 1 << 1, F_EXEC = 1 << 2 };

Write helpers: combine F_READ | F_WRITE into one variable, then write a function

    int has_flag(unsigned flags, unsigned bit);

returning nonzero if bit is present. In main, build flags = F_READ | F_WRITE and print "R=1 W=1 X=0".`,
    hints: [
      'Each flag is a distinct single bit so they can be OR-combined.',
      'has_flag is just (flags & bit) != 0.',
    ],
    solution: `#include <stdio.h>

enum {
    F_READ  = 1 << 0,
    F_WRITE = 1 << 1,
    F_EXEC  = 1 << 2,
};

int has_flag(unsigned flags, unsigned bit)
{
    return (flags & bit) != 0;
}

int main(void)
{
    unsigned flags = F_READ | F_WRITE;
    printf("R=%d W=%d X=%d\\n",
           has_flag(flags, F_READ),
           has_flag(flags, F_WRITE),
           has_flag(flags, F_EXEC));
    return 0;
}`,
    starter: `#include <stdio.h>

enum {
    F_READ  = 1 << 0,
    F_WRITE = 1 << 1,
    F_EXEC  = 1 << 2,
};

int has_flag(unsigned flags, unsigned bit)
{
    /* TODO */
    return 0;
}

int main(void)
{
    unsigned flags = F_READ | F_WRITE;
    printf("R=%d W=%d X=%d\\n",
           has_flag(flags, F_READ),
           has_flag(flags, F_WRITE),
           has_flag(flags, F_EXEC));
    return 0;
}`,
    tags: ['bitwise', 'flags', 'enum'],
  },
  {
    id: 'lx-ch01-c-047',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'String Length Without strlen',
    prompt: `Reimplement strlen. Write

    size_t my_strlen(const char *s);

that returns the number of characters before the terminating '\\0', without calling any library string function. In main, print the length of "kernel" (6) and of "" (0) on one line as "6 0".`,
    hints: [
      'C strings are char arrays ended by a NUL byte 0.',
      'Walk a pointer until *p == 0 and count the steps.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

size_t my_strlen(const char *s)
{
    const char *p = s;
    while (*p)
        p++;
    return (size_t)(p - s);
}

int main(void)
{
    printf("%zu %zu\\n", my_strlen("kernel"), my_strlen(""));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

size_t my_strlen(const char *s)
{
    /* TODO: walk until the NUL terminator */
    return 0;
}

int main(void)
{
    printf("%zu %zu\\n", my_strlen("kernel"), my_strlen(""));
    return 0;
}`,
    tags: ['strings', 'pointers', 'c'],
  },
  {
    id: 'lx-ch01-c-048',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Safe Bounded Copy Like strscpy',
    prompt: `The kernel prefers strscpy over strcpy because it never overflows and always NUL-terminates. Write

    size_t safe_copy(char *dst, const char *src, size_t size);

that copies up to size-1 bytes from src into dst, always writes a terminating '\\0' (when size > 0), and returns the length of the string actually stored in dst. In main, copy "hello world" into a 6-byte buffer and print the buffer plus the return value as "hello 5".`,
    hints: [
      'Reserve one byte for the terminator: copy while index < size - 1 and src is not NUL.',
      'Guard against size == 0 so you never write to dst at all in that case.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

size_t safe_copy(char *dst, const char *src, size_t size)
{
    size_t i = 0;
    if (size == 0)
        return 0;
    while (i < size - 1 && src[i] != '\\0') {
        dst[i] = src[i];
        i++;
    }
    dst[i] = '\\0';
    return i;
}

int main(void)
{
    char buf[6];
    size_t n = safe_copy(buf, "hello world", sizeof(buf));
    printf("%s %zu\\n", buf, n);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

size_t safe_copy(char *dst, const char *src, size_t size)
{
    /* TODO: copy at most size-1 bytes, always NUL-terminate, return length stored */
    return 0;
}

int main(void)
{
    char buf[6];
    size_t n = safe_copy(buf, "hello world", sizeof(buf));
    printf("%s %zu\\n", buf, n);
    return 0;
}`,
    tags: ['strings', 'bounds', 'kernel'],
  },
  {
    id: 'lx-ch01-c-049',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Function Pointer Basics',
    prompt: `Declare two functions int add(int,int) and int mul(int,int). In main, declare a function pointer

    int (*op)(int, int);

point it at add, call it on (6, 7) and print the result, then repoint it at mul and call it again on (6, 7). Output two lines: "13" then "42".`,
    hints: [
      'The variable name in a function-pointer declaration sits between the * and the parameter list.',
      'You can call through the pointer with op(6, 7) directly.',
    ],
    solution: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main(void)
{
    int (*op)(int, int);
    op = add;
    printf("%d\\n", op(6, 7));
    op = mul;
    printf("%d\\n", op(6, 7));
    return 0;
}`,
    starter: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main(void)
{
    int (*op)(int, int);
    /* TODO: point op at add, call it; then point at mul, call it */
    return 0;
}`,
    tags: ['function-pointers', 'c', 'kernel'],
  },
  {
    id: 'lx-ch01-c-050',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Apply A Callback Over An Array',
    prompt: `Write a higher-order function

    void apply(int *arr, size_t n, int (*fn)(int));

that replaces each element with fn(element). Provide a callback int square(int x). In main, apply square over {1,2,3,4} and print "1 4 9 16". This is the map pattern; the kernel uses callbacks like this in iterators and ops tables.`,
    hints: [
      'Inside apply, loop and do arr[i] = fn(arr[i]).',
      'Pass the function name (no parentheses) to use it as a pointer.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

void apply(int *arr, size_t n, int (*fn)(int))
{
    for (size_t i = 0; i < n; i++)
        arr[i] = fn(arr[i]);
}

int square(int x) { return x * x; }

int main(void)
{
    int a[] = { 1, 2, 3, 4 };
    size_t n = 4;
    apply(a, n, square);
    for (size_t i = 0; i < n; i++)
        printf("%d%s", a[i], i + 1 < n ? " " : "\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

void apply(int *arr, size_t n, int (*fn)(int))
{
    /* TODO: arr[i] = fn(arr[i]) for each element */
}

int square(int x) { return x * x; }

int main(void)
{
    int a[] = { 1, 2, 3, 4 };
    size_t n = 4;
    apply(a, n, square);
    for (size_t i = 0; i < n; i++)
        printf("%d%s", a[i], i + 1 < n ? " " : "\\n");
    return 0;
}`,
    tags: ['function-pointers', 'callbacks', 'arrays'],
  },
  {
    id: 'lx-ch01-c-051',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Struct With An Ops Table',
    prompt: `Mimic the kernel's file_operations pattern. Define

    struct device_ops {
        int (*open)(void);
        int (*read)(int n);
    };

Provide concrete functions and a static instance whose members point at them. In main, call ops.open() and ops.read(4) and print their return values on one line as "0 8" (open returns 0, read returns n*2).`,
    hints: [
      'You can initialize the struct with designated initializers like .open = my_open.',
      'Call through a member with ops.read(4).',
    ],
    solution: `#include <stdio.h>

struct device_ops {
    int (*open)(void);
    int (*read)(int n);
};

static int my_open(void)    { return 0; }
static int my_read(int n)   { return n * 2; }

static struct device_ops ops = {
    .open = my_open,
    .read = my_read,
};

int main(void)
{
    printf("%d %d\\n", ops.open(), ops.read(4));
    return 0;
}`,
    starter: `#include <stdio.h>

struct device_ops {
    int (*open)(void);
    int (*read)(int n);
};

static int my_open(void)    { return 0; }
static int my_read(int n)   { return n * 2; }

static struct device_ops ops = {
    /* TODO: wire .open and .read to the functions above */
};

int main(void)
{
    printf("%d %d\\n", ops.open(), ops.read(4));
    return 0;
}`,
    tags: ['function-pointers', 'structs', 'kernel'],
  },
  {
    id: 'lx-ch01-c-052',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Dispatch Table Indexed By Opcode',
    prompt: `Build an array of function pointers (a jump table). Define handlers for opcodes 0..3 that each take and return an int, then an array

    int (*table[4])(int);

In main, run table[op](10) for op = 0,1,2,3 where the handlers respectively add 1, double, negate, and square, printing "11 20 -10 100".`,
    hints: [
      'An array of function pointers: int (*table[4])(int) = { f0, f1, f2, f3 };',
      'Call the chosen handler with table[op](10).',
    ],
    solution: `#include <stdio.h>

static int h_inc(int x)  { return x + 1; }
static int h_dbl(int x)  { return x * 2; }
static int h_neg(int x)  { return -x; }
static int h_sqr(int x)  { return x * x; }

int main(void)
{
    int (*table[4])(int) = { h_inc, h_dbl, h_neg, h_sqr };
    for (int op = 0; op < 4; op++)
        printf("%d%s", table[op](10), op < 3 ? " " : "\\n");
    return 0;
}`,
    starter: `#include <stdio.h>

static int h_inc(int x)  { return x + 1; }
static int h_dbl(int x)  { return x * 2; }
static int h_neg(int x)  { return -x; }
static int h_sqr(int x)  { return x * x; }

int main(void)
{
    int (*table[4])(int) = { /* TODO: fill in the four handlers */ };
    for (int op = 0; op < 4; op++)
        printf("%d%s", table[op](10), op < 3 ? " " : "\\n");
    return 0;
}`,
    tags: ['function-pointers', 'dispatch', 'arrays'],
  },
  {
    id: 'lx-ch01-c-053',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Tagged Union',
    prompt: `Define a tagged union (a kind tag plus a union of payloads), the safe way to use unions in C:

    struct value {
        int kind;            /* 0 = int payload, 1 = double payload */
        union { int i; double d; } u;
    };

Write void print_value(const struct value *v) that prints "int: N" or "dbl: X.X" based on kind. In main, build one of each and print them.`,
    hints: [
      'Only the member matching the active tag is valid to read.',
      'Switch on v->kind to decide which union member to access.',
    ],
    solution: `#include <stdio.h>

struct value {
    int kind;
    union { int i; double d; } u;
};

void print_value(const struct value *v)
{
    if (v->kind == 0)
        printf("int: %d\\n", v->u.i);
    else
        printf("dbl: %.1f\\n", v->u.d);
}

int main(void)
{
    struct value a = { 0, { .i = 42 } };
    struct value b = { 1, { .d = 3.5 } };
    print_value(&a);
    print_value(&b);
    return 0;
}`,
    starter: `#include <stdio.h>

struct value {
    int kind;
    union { int i; double d; } u;
};

void print_value(const struct value *v)
{
    /* TODO: switch on v->kind and read the matching union member */
}

int main(void)
{
    struct value a = { 0, { .i = 42 } };
    struct value b = { 1, { .d = 3.5 } };
    print_value(&a);
    print_value(&b);
    return 0;
}`,
    tags: ['unions', 'structs', 'c'],
  },
  {
    id: 'lx-ch01-c-054',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Detect Host Endianness',
    prompt: `Determine at runtime whether the machine is little-endian or big-endian. Store uint32_t v = 0x01020304, then inspect its first byte through a (unsigned char *) view. Print "little" if the first byte is 0x04, "big" if it is 0x01. Explain in a one-line comment why reading bytes through a char pointer is the standard way to do this.`,
    hints: [
      'Take the address of the int and cast it to (unsigned char *).',
      'The byte at the lowest address is the least significant byte on a little-endian host.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint32_t v = 0x01020304;
    /* char* aliasing is allowed, so we can inspect individual bytes safely */
    unsigned char *p = (unsigned char *)&v;
    if (p[0] == 0x04)
        printf("little\\n");
    else
        printf("big\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint32_t v = 0x01020304;
    /* TODO: view v as bytes via an unsigned char * and check the first byte */
    return 0;
}`,
    tags: ['endianness', 'pointers', 'c'],
  },
  {
    id: 'lx-ch01-c-055',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Byte-Swap A 32-bit Value',
    prompt: `Write

    uint32_t bswap32(uint32_t v);

that reverses the four bytes of v (the operation behind the kernel's __swab32 / be32_to_cpu on a little-endian host). For example bswap32(0x11223344) == 0x44332211. Use only shifts and masks. Print that example in hex (uppercase, 8 digits).`,
    hints: [
      'Isolate each byte with a mask, then shift it to its mirrored position.',
      'Result = (b0 << 24) | (b1 << 16) | (b2 << 8) | b3.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

uint32_t bswap32(uint32_t v)
{
    return ((v & 0x000000FFu) << 24) |
           ((v & 0x0000FF00u) << 8)  |
           ((v & 0x00FF0000u) >> 8)  |
           ((v & 0xFF000000u) >> 24);
}

int main(void)
{
    printf("0x%08X\\n", bswap32(0x11223344u));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

uint32_t bswap32(uint32_t v)
{
    /* TODO: reverse the four bytes using shifts and masks */
    return 0;
}

int main(void)
{
    printf("0x%08X\\n", bswap32(0x11223344u));
    return 0;
}`,
    tags: ['endianness', 'bitwise', 'c'],
  },
  {
    id: 'lx-ch01-c-056',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fixed-Width Types And Wraparound',
    prompt: `Show that fixed-width unsigned types wrap around modulo 2^N (well-defined in C). Print:
1) a uint8_t holding 255, then incremented once (wraps to 0),
2) a uint8_t holding 200 + 100 computed in uint8_t (wraps to 44),
3) sizeof for uint8_t, uint16_t, uint32_t.
Output four lines: "0", "44", and then "1 2 4". Use %u-style formatting with proper casts.`,
    hints: [
      'Unsigned overflow is defined: it wraps modulo 2^width.',
      'Force the arithmetic into uint8_t by assigning the result back to a uint8_t variable.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t a = 255;
    a = (uint8_t)(a + 1);
    printf("%u\\n", a);

    uint8_t b = (uint8_t)(200 + 100);
    printf("%u\\n", b);

    printf("%zu %zu %zu\\n", sizeof(uint8_t), sizeof(uint16_t), sizeof(uint32_t));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

int main(void)
{
    /* TODO: demonstrate uint8_t wraparound at 255->0 and 200+100->44, plus sizeofs */
    return 0;
}`,
    tags: ['fixed-width', 'overflow', 'c'],
  },
  {
    id: 'lx-ch01-c-057',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pack And Unpack Two u16 Into A u32',
    prompt: `Write two functions:

    uint32_t pack(uint16_t hi, uint16_t lo);
    void unpack(uint32_t v, uint16_t *hi, uint16_t *lo);

pack puts hi in the upper 16 bits and lo in the lower 16. unpack recovers both through out-pointers. In main, pack(0xABCD, 0x1234), print the packed value in hex, then unpack it and print "ABCD 1234".`,
    hints: [
      'pack: ((uint32_t)hi << 16) | lo.',
      'unpack: *hi = v >> 16; *lo = v & 0xFFFF; (cast to uint16_t).',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

uint32_t pack(uint16_t hi, uint16_t lo)
{
    return ((uint32_t)hi << 16) | lo;
}

void unpack(uint32_t v, uint16_t *hi, uint16_t *lo)
{
    *hi = (uint16_t)(v >> 16);
    *lo = (uint16_t)(v & 0xFFFF);
}

int main(void)
{
    uint32_t v = pack(0xABCD, 0x1234);
    printf("0x%08X\\n", v);
    uint16_t hi, lo;
    unpack(v, &hi, &lo);
    printf("%04X %04X\\n", hi, lo);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

uint32_t pack(uint16_t hi, uint16_t lo)
{
    /* TODO */
    return 0;
}

void unpack(uint32_t v, uint16_t *hi, uint16_t *lo)
{
    /* TODO: write the two halves through the out-pointers */
}

int main(void)
{
    uint32_t v = pack(0xABCD, 0x1234);
    printf("0x%08X\\n", v);
    uint16_t hi, lo;
    unpack(v, &hi, &lo);
    printf("%04X %04X\\n", hi, lo);
    return 0;
}`,
    tags: ['bitwise', 'fixed-width', 'pointers'],
  },
  {
    id: 'lx-ch01-c-058',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Const-Correct Lookup Function',
    prompt: `Write a const-correct search:

    const char *find_name(const char *const *names, size_t n, size_t idx);

names is an array of n string pointers; return names[idx] if idx < n, otherwise return NULL. Both the strings and the pointer array must be treated as read-only (note the two const qualifiers). In main, with {"alpha","beta","gamma"}, print find_name for idx 1 and idx 5 as "beta (null)".`,
    hints: [
      'const char *const * means: read-only pointers to read-only chars.',
      'Return NULL for out-of-range idx; %s prints "(null)" for NULL on glibc.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

const char *find_name(const char *const *names, size_t n, size_t idx)
{
    if (idx >= n)
        return NULL;
    return names[idx];
}

int main(void)
{
    const char *const names[] = { "alpha", "beta", "gamma" };
    printf("%s %s\\n", find_name(names, 3, 1), find_name(names, 3, 5));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

const char *find_name(const char *const *names, size_t n, size_t idx)
{
    /* TODO: bounds-check idx and return the matching pointer or NULL */
    return NULL;
}

int main(void)
{
    const char *const names[] = { "alpha", "beta", "gamma" };
    printf("%s %s\\n", find_name(names, 3, 1), find_name(names, 3, 5));
    return 0;
}`,
    tags: ['const', 'pointers', 'strings'],
  },
  {
    id: 'lx-ch01-c-059',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A 2D Grid In A Flat Array',
    prompt: `The kernel often stores 2D data in a single flat buffer with manual index math. Given an int buffer representing ROWS x COLS in row-major order, write

    int *cell(int *buf, size_t cols, size_t r, size_t c);

that returns the address of element (r, c) using the formula r*cols + c. In main, make a 3x4 grid, set cell (2,3) to 99 via the returned pointer, and print buf[2*4 + 3] to confirm it reads 99.`,
    hints: [
      'Row-major flat index is r * cols + c.',
      'Return &buf[r * cols + c] so the caller can read or write that cell.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

int *cell(int *buf, size_t cols, size_t r, size_t c)
{
    return &buf[r * cols + c];
}

int main(void)
{
    int buf[3 * 4] = { 0 };
    *cell(buf, 4, 2, 3) = 99;
    printf("%d\\n", buf[2 * 4 + 3]);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

int *cell(int *buf, size_t cols, size_t r, size_t c)
{
    /* TODO: return the address of element (r, c) in row-major order */
    return buf;
}

int main(void)
{
    int buf[3 * 4] = { 0 };
    *cell(buf, 4, 2, 3) = 99;
    printf("%d\\n", buf[2 * 4 + 3]);
    return 0;
}`,
    tags: ['arrays', 'pointers', 'indexing'],
  },
  {
    id: 'lx-ch01-c-060',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'MIN/MAX Macros And A Pitfall',
    prompt: `Define preprocessor macros

    #define MIN(a, b) ((a) < (b) ? (a) : (b))
    #define MAX(a, b) ((a) > (b) ? (a) : (b))

Note that every argument is fully parenthesised, which is essential for macro hygiene. In main, print MIN(3, 9), MAX(3, 9), and MAX(2 + 1, 4) (showing that the inner parentheses make the arithmetic safe) on one line as "3 9 4".`,
    hints: [
      'Wrap each parameter AND the whole expression in parentheses.',
      'Without parentheses, MAX(2 + 1, 4) would expand incorrectly due to precedence.',
    ],
    solution: `#include <stdio.h>

#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main(void)
{
    printf("%d %d %d\\n", MIN(3, 9), MAX(3, 9), MAX(2 + 1, 4));
    return 0;
}`,
    starter: `#include <stdio.h>

#define MIN(a, b) /* TODO */
#define MAX(a, b) /* TODO */

int main(void)
{
    printf("%d %d %d\\n", MIN(3, 9), MAX(3, 9), MAX(2 + 1, 4));
    return 0;
}`,
    tags: ['preprocessor', 'macros', 'c'],
  },
  {
    id: 'lx-ch01-c-061',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'An ARRAY_SIZE Macro',
    prompt: `Reimplement the kernel's ARRAY_SIZE macro:

    #define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))

This only works on a real array, not a decayed pointer, because sizeof an array is the whole buffer. In main, define int a[] = {10,20,30,40,50}; and print ARRAY_SIZE(a) (5). Add a one-line comment noting it would be WRONG to use this on a pointer parameter.`,
    hints: [
      'sizeof(array) is the total byte size; dividing by element size gives the count.',
      'An array decays to a pointer when passed to a function, so ARRAY_SIZE must be used where the true array type is visible.',
    ],
    solution: `#include <stdio.h>

#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))

int main(void)
{
    int a[] = { 10, 20, 30, 40, 50 };
    /* WRONG if 'a' were a pointer parameter: sizeof would be the pointer size */
    printf("%zu\\n", ARRAY_SIZE(a));
    return 0;
}`,
    starter: `#include <stdio.h>

#define ARRAY_SIZE(arr) /* TODO: sizeof(arr) / sizeof one element */

int main(void)
{
    int a[] = { 10, 20, 30, 40, 50 };
    printf("%zu\\n", ARRAY_SIZE(a));
    return 0;
}`,
    tags: ['preprocessor', 'arrays', 'kernel'],
  },
  {
    id: 'lx-ch01-c-062',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Prove Array-To-Pointer Decay',
    prompt: `Demonstrate the array/pointer decay rule. Given int a[10]; in main, print sizeof(a) (whole array, 40 on a 4-byte-int build). Then write a function

    size_t sizeof_param(int a[10]);

that returns sizeof(a) computed INSIDE it; show it returns the pointer size (8 on a 64-bit build), because the parameter decayed to int *. Print both numbers as "40 8" (values may differ by platform).`,
    hints: [
      'In a function parameter, int a[10] is exactly int *a; the size is gone.',
      'sizeof on the real array in main still gives the full buffer size.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

size_t sizeof_param(int a[10])
{
    /* a decayed to int *, so sizeof(a) == sizeof(int *) */
    return sizeof(a);
}

int main(void)
{
    int a[10];
    printf("%zu %zu\\n", sizeof(a), sizeof_param(a));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

size_t sizeof_param(int a[10])
{
    /* TODO: return sizeof(a) as seen inside this function */
    return 0;
}

int main(void)
{
    int a[10];
    printf("%zu %zu\\n", sizeof(a), sizeof_param(a));
    return 0;
}`,
    tags: ['arrays', 'pointers', 'decay'],
  },
  {
    id: 'lx-ch01-c-063',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find Max And Min Through Out-Pointers',
    prompt: `Write

    void minmax(const int *arr, size_t n, int *out_min, int *out_max);

that scans arr once and writes the minimum and maximum through the out-pointers (assume n >= 1). Returning two values via pointers is idiomatic kernel C. In main, run it on {5, -3, 9, 0, 7} and print "min=-3 max=9".`,
    hints: [
      'Initialize both *out_min and *out_max to arr[0], then update across the rest.',
      'Use a single loop from index 1 to n-1.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

void minmax(const int *arr, size_t n, int *out_min, int *out_max)
{
    int lo = arr[0], hi = arr[0];
    for (size_t i = 1; i < n; i++) {
        if (arr[i] < lo) lo = arr[i];
        if (arr[i] > hi) hi = arr[i];
    }
    *out_min = lo;
    *out_max = hi;
}

int main(void)
{
    int a[] = { 5, -3, 9, 0, 7 };
    int lo, hi;
    minmax(a, 5, &lo, &hi);
    printf("min=%d max=%d\\n", lo, hi);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

void minmax(const int *arr, size_t n, int *out_min, int *out_max)
{
    /* TODO: single pass; write results through out_min and out_max */
}

int main(void)
{
    int a[] = { 5, -3, 9, 0, 7 };
    int lo, hi;
    minmax(a, 5, &lo, &hi);
    printf("min=%d max=%d\\n", lo, hi);
    return 0;
}`,
    tags: ['pointers', 'arrays', 'c'],
  },
  {
    id: 'lx-ch01-c-064',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Implement container_of',
    prompt: `Implement the kernel's container_of trick. Given a struct that embeds a member, recover the address of the enclosing struct from a pointer to that member:

    #define container_of(ptr, type, member) \\
        ((type *)((char *)(ptr) - offsetof(type, member)))

Define struct packet { int id; struct { int len; } hdr; char tag; }; take a pointer to the hdr member of a real packet, and use container_of to recover the struct packet *. Print the recovered packet's id to prove it worked.`,
    hints: [
      'offsetof(type, member) from <stddef.h> gives the byte offset of the member.',
      'Subtract that offset from the member pointer (as a char *) to reach the struct start.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

#define container_of(ptr, type, member) \\
    ((type *)((char *)(ptr) - offsetof(type, member)))

struct packet {
    int id;
    struct { int len; } hdr;
    char tag;
};

int main(void)
{
    struct packet p = { .id = 1234 };
    /* suppose we only hold a pointer to the embedded hdr member */
    void *hdr_ptr = &p.hdr;
    struct packet *recovered = container_of(hdr_ptr, struct packet, hdr);
    printf("%d\\n", recovered->id);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

#define container_of(ptr, type, member) /* TODO */

struct packet {
    int id;
    struct { int len; } hdr;
    char tag;
};

int main(void)
{
    struct packet p = { .id = 1234 };
    void *hdr_ptr = &p.hdr;
    struct packet *recovered = container_of(hdr_ptr, struct packet, hdr);
    printf("%d\\n", recovered->id);
    return 0;
}`,
    tags: ['container_of', 'offsetof', 'kernel'],
  },
  {
    id: 'lx-ch01-c-065',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Read A Big-Endian Header Field',
    prompt: `Network and on-disk formats are usually big-endian. You receive a 4-byte header in a buffer

    unsigned char buf[4] = { 0x00, 0x00, 0x01, 0x00 };

stored most-significant-byte first. Write

    uint32_t read_be32(const unsigned char *p);

that reconstructs the 32-bit value regardless of host endianness, by shifting each byte into place. The example must print 256. Explain in a comment why reading byte-by-byte avoids any host-endianness assumption.`,
    hints: [
      'Big-endian: p[0] is the most significant byte.',
      'Build it as (p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3]; cast bytes to uint32_t before shifting.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

/* byte-by-byte assembly is portable: it never reinterprets host memory layout */
uint32_t read_be32(const unsigned char *p)
{
    return ((uint32_t)p[0] << 24) |
           ((uint32_t)p[1] << 16) |
           ((uint32_t)p[2] << 8)  |
           ((uint32_t)p[3]);
}

int main(void)
{
    unsigned char buf[4] = { 0x00, 0x00, 0x01, 0x00 };
    printf("%u\\n", read_be32(buf));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

uint32_t read_be32(const unsigned char *p)
{
    /* TODO: combine the four big-endian bytes into a uint32_t */
    return 0;
}

int main(void)
{
    unsigned char buf[4] = { 0x00, 0x00, 0x01, 0x00 };
    printf("%u\\n", read_be32(buf));
    return 0;
}`,
    tags: ['endianness', 'bitwise', 'kernel'],
  },
  {
    id: 'lx-ch01-c-066',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Write A Big-Endian Field Into A Buffer',
    prompt: `The inverse of the previous problem. Write

    void write_be32(unsigned char *p, uint32_t v);

that serializes v into 4 bytes at p in big-endian order (p[0] = most significant byte). In main, write 0x0A0B0C0D into a buffer and print the four bytes in order as "0A 0B 0C 0D" (uppercase, two hex digits each).`,
    hints: [
      'p[0] = (v >> 24) & 0xFF, down to p[3] = v & 0xFF.',
      'Mask with 0xFF after each shift and cast to unsigned char.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

void write_be32(unsigned char *p, uint32_t v)
{
    p[0] = (unsigned char)((v >> 24) & 0xFF);
    p[1] = (unsigned char)((v >> 16) & 0xFF);
    p[2] = (unsigned char)((v >> 8)  & 0xFF);
    p[3] = (unsigned char)(v & 0xFF);
}

int main(void)
{
    unsigned char buf[4];
    write_be32(buf, 0x0A0B0C0Du);
    printf("%02X %02X %02X %02X\\n", buf[0], buf[1], buf[2], buf[3]);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

void write_be32(unsigned char *p, uint32_t v)
{
    /* TODO: store v most-significant-byte first into p[0..3] */
}

int main(void)
{
    unsigned char buf[4];
    write_be32(buf, 0x0A0B0C0Du);
    printf("%02X %02X %02X %02X\\n", buf[0], buf[1], buf[2], buf[3]);
    return 0;
}`,
    tags: ['endianness', 'bitwise', 'kernel'],
  },
  {
    id: 'lx-ch01-c-067',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Round Up To A Power-Of-Two Alignment',
    prompt: `The kernel's ALIGN macro rounds a value up to the next multiple of a power-of-two alignment without using division:

    #define ALIGN_UP(x, a)  (((x) + (a) - 1) & ~((a) - 1))

Implement it and a uintptr_t-based helper

    int is_aligned(uintptr_t x, uintptr_t a);   // nonzero if x is a multiple of a

In main print ALIGN_UP(13, 8) (16), ALIGN_UP(16, 8) (16), and is_aligned(16, 8) plus is_aligned(13, 8) as "16 16 1 0". Assume a is a power of two.`,
    hints: [
      'For power-of-two a, the low-bit mask is (a - 1); aligned means (x & (a - 1)) == 0.',
      'Rounding up adds (a - 1) first, then masks off the low bits with & ~(a - 1).',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

#define ALIGN_UP(x, a)  (((x) + (a) - 1) & ~((a) - 1))

int is_aligned(uintptr_t x, uintptr_t a)
{
    return (x & (a - 1)) == 0;
}

int main(void)
{
    printf("%d %d %d %d\\n",
           (int)ALIGN_UP(13u, 8u),
           (int)ALIGN_UP(16u, 8u),
           is_aligned(16, 8),
           is_aligned(13, 8));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

#define ALIGN_UP(x, a)  /* TODO */

int is_aligned(uintptr_t x, uintptr_t a)
{
    /* TODO: nonzero if x is a multiple of power-of-two a */
    return 0;
}

int main(void)
{
    printf("%d %d %d %d\\n",
           (int)ALIGN_UP(13u, 8u),
           (int)ALIGN_UP(16u, 8u),
           is_aligned(16, 8),
           is_aligned(13, 8));
    return 0;
}`,
    tags: ['bitwise', 'alignment', 'kernel'],
  },
  {
    id: 'lx-ch01-c-068',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Generic memcpy Over void Pointers',
    prompt: `Reimplement memcpy. Write

    void *my_memcpy(void *dst, const void *src, size_t n);

that copies n bytes from src to dst (assume no overlap) and returns dst. Since you can't dereference a void *, cast to unsigned char * and copy byte by byte. In main, copy a struct { int a; char b; } to another instance and print both fields to confirm the copy.`,
    hints: [
      'void * has no element size, so you cannot do pointer arithmetic on it directly.',
      'Cast both pointers to unsigned char * and loop n times.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

void *my_memcpy(void *dst, const void *src, size_t n)
{
    unsigned char *d = dst;
    const unsigned char *s = src;
    for (size_t i = 0; i < n; i++)
        d[i] = s[i];
    return dst;
}

struct rec { int a; char b; };

int main(void)
{
    struct rec x = { 42, 'Z' };
    struct rec y;
    my_memcpy(&y, &x, sizeof(x));
    printf("%d %c\\n", y.a, y.b);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

void *my_memcpy(void *dst, const void *src, size_t n)
{
    /* TODO: cast to unsigned char * and copy n bytes */
    return dst;
}

struct rec { int a; char b; };

int main(void)
{
    struct rec x = { 42, 'Z' };
    struct rec y;
    my_memcpy(&y, &x, sizeof(x));
    printf("%d %c\\n", y.a, y.b);
    return 0;
}`,
    tags: ['void-pointers', 'memory', 'c'],
  },
  {
    id: 'lx-ch01-c-069',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Function-Pointer Comparator For Sorting',
    prompt: `qsort takes a comparator function pointer of type int (*)(const void *, const void *). Write a comparator

    int cmp_int_desc(const void *a, const void *b);

that sorts ints in DESCENDING order (cast the void pointers to const int *, dereference, and return a negative/zero/positive result accordingly, avoiding subtraction overflow). In main, qsort {3,1,4,1,5,9,2,6} and print them descending as "9 6 5 4 3 2 1 1".`,
    hints: [
      'Cast each const void * to const int * and dereference to get the ints.',
      'For descending, return (y > x) - (y < x) using x = *pa, y = *pb; this avoids overflow.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>

int cmp_int_desc(const void *a, const void *b)
{
    int x = *(const int *)a;
    int y = *(const int *)b;
    /* descending: larger values first; (y>x)-(y<x) avoids subtraction overflow */
    return (y > x) - (y < x);
}

int main(void)
{
    int a[] = { 3, 1, 4, 1, 5, 9, 2, 6 };
    size_t n = sizeof(a) / sizeof(a[0]);
    qsort(a, n, sizeof(a[0]), cmp_int_desc);
    for (size_t i = 0; i < n; i++)
        printf("%d%s", a[i], i + 1 < n ? " " : "\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>

int cmp_int_desc(const void *a, const void *b)
{
    /* TODO: cast, dereference, return descending order without overflow */
    return 0;
}

int main(void)
{
    int a[] = { 3, 1, 4, 1, 5, 9, 2, 6 };
    size_t n = sizeof(a) / sizeof(a[0]);
    qsort(a, n, sizeof(a[0]), cmp_int_desc);
    for (size_t i = 0; i < n; i++)
        printf("%d%s", a[i], i + 1 < n ? " " : "\\n");
    return 0;
}`,
    tags: ['function-pointers', 'qsort', 'void-pointers'],
  },
  {
    id: 'lx-ch01-c-070',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Header With Include Guards And A Packed-Style Struct',
    prompt: `Write a single self-contained .c program that simulates a header by using an include-guard pattern, and parses a fixed binary record. Define a struct

    struct record { uint8_t type; uint8_t flags; uint16_t length; uint32_t crc; };

and a function

    void describe(const struct record *r);

that prints "type=T flags=0xFF len=L crc=0xXXXXXXXX". In main, build a record { 7, 0x03, 512, 0xDEADBEEF } and describe it. Include a comment showing the #ifndef / #define / #endif include-guard idiom you would use if this were a real header.`,
    hints: [
      'Include guards: #ifndef NAME_H then #define NAME_H, with #endif at the end, prevent double inclusion.',
      'Use uint8_t/uint16_t/uint32_t from <stdint.h> and the matching PRIx format macros or plain %x with casts.',
    ],
    solution: `#include <stdio.h>
#include <stdint.h>

/* If this lived in record.h, it would be wrapped like:
 *   #ifndef RECORD_H
 *   #define RECORD_H
 *   ... declarations ...
 *   #endif
 * so it can be #included many times without redefinition errors.
 */

struct record {
    uint8_t  type;
    uint8_t  flags;
    uint16_t length;
    uint32_t crc;
};

void describe(const struct record *r)
{
    printf("type=%u flags=0x%02X len=%u crc=0x%08X\\n",
           r->type, r->flags, r->length, r->crc);
}

int main(void)
{
    struct record r = { 7, 0x03, 512, 0xDEADBEEFu };
    describe(&r);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdint.h>

/* TODO: note the #ifndef / #define / #endif include-guard idiom in a comment */

struct record {
    uint8_t  type;
    uint8_t  flags;
    uint16_t length;
    uint32_t crc;
};

void describe(const struct record *r)
{
    /* TODO: print type, flags (hex), length, crc (hex) */
}

int main(void)
{
    struct record r = { 7, 0x03, 512, 0xDEADBEEFu };
    describe(&r);
    return 0;
}`,
    tags: ['preprocessor', 'structs', 'fixed-width'],
  },
]

export default problems
