import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch01-c-001',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Sizes of Fixed-Width Types',
    prompt: `Kernel code never assumes the size of int. Write a complete C program that includes <stdint.h> and <stdio.h> and prints the size in bytes of uint8_t, uint16_t, uint32_t, and uint64_t, one per line, like:

uint8_t  = 1
uint16_t = 2
uint32_t = 4
uint64_t = 8

Use sizeof and the %zu format specifier for the size_t result.`,
    hints: [
      'sizeof yields a size_t; print it with %zu.',
      'The fixed-width types live in <stdint.h>.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    printf("uint8_t  = %zu\\n", sizeof(uint8_t));
    printf("uint16_t = %zu\\n", sizeof(uint16_t));
    printf("uint32_t = %zu\\n", sizeof(uint32_t));
    printf("uint64_t = %zu\\n", sizeof(uint64_t));
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    /* TODO: print sizeof each fixed-width type with %zu */
    return 0;
}`,
    tags: ['kernel', 'types', 'sizeof'],
  },
  {
    id: 'lx-ch01-c-002',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Kernel-Style Type Aliases',
    prompt: `The kernel uses short names like u8, u16, u32, u64 instead of the standard uintN_t. Using typedef, define these four aliases on top of the <stdint.h> types, then declare a u32 variable set to 4000000000 and print it with %u.`,
    hints: [
      'typedef uint32_t u32; gives you the kernel-style name.',
      'A value of 4 billion fits in u32 but not in a signed int.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

typedef uint8_t  u8;
typedef uint16_t u16;
typedef uint32_t u32;
typedef uint64_t u64;

int main(void) {
    u32 big = 4000000000U;
    printf("%u\\n", big);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

/* TODO: typedef u8, u16, u32, u64 */

int main(void) {
    /* TODO: declare a u32 and print it */
    return 0;
}`,
    tags: ['kernel', 'types', 'typedef'],
  },
  {
    id: 'lx-ch01-c-003',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Dereference a Pointer',
    prompt: `Write a program that declares an int x = 42, takes its address into a pointer int *p, then prints the value through the pointer (not through x directly). The output must be:

x via pointer = 42`,
    hints: [
      'Use & to take the address and * to read through the pointer.',
      'int *p = &x; then *p reads the value.',
    ],
    solution: `#include <stdio.h>

int main(void) {
    int x = 42;
    int *p = &x;
    printf("x via pointer = %d\\n", *p);
    return 0;
}`,
    starter: `#include <stdio.h>

int main(void) {
    int x = 42;
    /* TODO: make a pointer to x and print *p */
    return 0;
}`,
    tags: ['kernel', 'pointers', 'basics'],
  },
  {
    id: 'lx-ch01-c-004',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Modify a Value Through a Pointer',
    prompt: `Write a function void increment(int *p) that adds 1 to the int that p points to. In main, declare int n = 9, call increment(&n), and print n. The output must be:

10`,
    hints: [
      'Pass the address with &n.',
      'Inside the function, *p += 1 changes the variable in the caller.',
    ],
    solution: `#include <stdio.h>

void increment(int *p) {
    *p += 1;
}

int main(void) {
    int n = 9;
    increment(&n);
    printf("%d\\n", n);
    return 0;
}`,
    starter: `#include <stdio.h>

void increment(int *p) {
    /* TODO: add 1 to the pointed-to int */
}

int main(void) {
    int n = 9;
    increment(&n);
    printf("%d\\n", n);
    return 0;
}`,
    tags: ['kernel', 'pointers', 'functions'],
  },
  {
    id: 'lx-ch01-c-005',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Swap Two Integers',
    prompt: `Write void swap(int *a, int *b) that exchanges the two ints. In main, set x = 1 and y = 2, call swap(&x, &y), then print "x=2 y=1". This is the classic demonstration of why pass-by-pointer is needed in C.`,
    hints: [
      'Use a temporary local to hold one value during the swap.',
      'Dereference both pointers to read and write the values.',
    ],
    solution: `#include <stdio.h>

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void) {
    int x = 1, y = 2;
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
    starter: `#include <stdio.h>

void swap(int *a, int *b) {
    /* TODO: swap the two ints via their pointers */
}

int main(void) {
    int x = 1, y = 2;
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
    tags: ['kernel', 'pointers', 'swap'],
  },
  {
    id: 'lx-ch01-c-006',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Set a Bit With a Mask',
    prompt: `Bit flags are everywhere in the kernel. Start with uint8_t flags = 0. Set bit 3 (value 1 << 3) using the |= operator, then print flags in decimal. The output must be:

8`,
    hints: [
      '1 << 3 is 8 and selects bit 3.',
      'flags |= (1 << 3) turns that bit on without touching others.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint8_t flags = 0;
    flags |= (1 << 3);
    printf("%u\\n", flags);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint8_t flags = 0;
    /* TODO: set bit 3 with |= and print flags */
    return 0;
}`,
    tags: ['kernel', 'bitwise', 'flags'],
  },
  {
    id: 'lx-ch01-c-007',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Clear a Bit With a Mask',
    prompt: `Start with uint8_t flags = 0xFF (all bits set). Clear bit 0 using flags &= ~(1 << 0), then print the result in decimal. The output must be:

254`,
    hints: [
      '~(1 << 0) is a mask with every bit set except bit 0.',
      'AND-ing with that mask clears exactly one bit.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint8_t flags = 0xFF;
    flags &= ~(1 << 0);
    printf("%u\\n", flags);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint8_t flags = 0xFF;
    /* TODO: clear bit 0 and print flags */
    return 0;
}`,
    tags: ['kernel', 'bitwise', 'flags'],
  },
  {
    id: 'lx-ch01-c-008',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Test Whether a Bit Is Set',
    prompt: `Write int bit_is_set(uint32_t value, int bit) that returns 1 if the given bit number is set in value and 0 otherwise. In main, call it on value 0b1010 (decimal 10) for bits 1 and 2 and print both results. Expected output:

bit1=1
bit2=0`,
    hints: [
      'Shift the value right by bit, then mask with & 1.',
      'Alternatively test (value & (1u << bit)) != 0.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int bit_is_set(uint32_t value, int bit) {
    return (value >> bit) & 1u;
}

int main(void) {
    uint32_t v = 10; /* 0b1010 */
    printf("bit1=%d\\n", bit_is_set(v, 1));
    printf("bit2=%d\\n", bit_is_set(v, 2));
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int bit_is_set(uint32_t value, int bit) {
    /* TODO: return 1 if 'bit' is set, else 0 */
    return 0;
}

int main(void) {
    uint32_t v = 10;
    printf("bit1=%d\\n", bit_is_set(v, 1));
    printf("bit2=%d\\n", bit_is_set(v, 2));
    return 0;
}`,
    tags: ['kernel', 'bitwise', 'masks'],
  },
  {
    id: 'lx-ch01-c-009',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define and Use a Struct',
    prompt: `Define a struct point with two int members x and y. In main, create a struct point p with x = 3 and y = 4 using designated initializers, then print "p = (3, 4)" using the dot operator to access members.`,
    hints: [
      'struct point { int x; int y; };',
      'Designated initializer: struct point p = { .x = 3, .y = 4 };',
    ],
    solution: `#include <stdio.h>

struct point {
    int x;
    int y;
};

int main(void) {
    struct point p = { .x = 3, .y = 4 };
    printf("p = (%d, %d)\\n", p.x, p.y);
    return 0;
}`,
    starter: `#include <stdio.h>

struct point {
    /* TODO: int x, y */
};

int main(void) {
    /* TODO: make a point (3,4) and print it */
    return 0;
}`,
    tags: ['kernel', 'structs', 'basics'],
  },
  {
    id: 'lx-ch01-c-010',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Access a Struct Through a Pointer',
    prompt: `Using the same struct point { int x; int y; }, write void move_right(struct point *p, int dx) that adds dx to the x member using the arrow operator. In main, start at (5, 5), call move_right(&p, 10), and print "(15, 5)".`,
    hints: [
      'The arrow operator p->x is shorthand for (*p).x.',
      'Pass the address of the struct with &p.',
    ],
    solution: `#include <stdio.h>

struct point {
    int x;
    int y;
};

void move_right(struct point *p, int dx) {
    p->x += dx;
}

int main(void) {
    struct point p = { .x = 5, .y = 5 };
    move_right(&p, 10);
    printf("(%d, %d)\\n", p.x, p.y);
    return 0;
}`,
    starter: `#include <stdio.h>

struct point {
    int x;
    int y;
};

void move_right(struct point *p, int dx) {
    /* TODO: add dx to p->x */
}

int main(void) {
    struct point p = { .x = 5, .y = 5 };
    move_right(&p, 10);
    printf("(%d, %d)\\n", p.x, p.y);
    return 0;
}`,
    tags: ['kernel', 'structs', 'pointers'],
  },
  {
    id: 'lx-ch01-c-011',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Sum an Array With Indexing',
    prompt: `Declare int a[5] = {1, 2, 3, 4, 5}. Write a loop that sums all elements using array indexing a[i] and prints the total. Expected output:

sum = 15`,
    hints: [
      'A C array does not carry its length; use the known size 5.',
      'Accumulate into a running total inside a for loop.',
    ],
    solution: `#include <stdio.h>

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i < 5; i++)
        sum += a[i];
    printf("sum = %d\\n", sum);
    return 0;
}`,
    starter: `#include <stdio.h>

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    /* TODO: sum the array */
    printf("sum = %d\\n", sum);
    return 0;
}`,
    tags: ['kernel', 'arrays', 'loops'],
  },
  {
    id: 'lx-ch01-c-012',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'String Length by Hand',
    prompt: `A C string is a char array terminated by '\\0'. Without calling strlen, write size_t my_strlen(const char *s) that counts characters up to (not including) the NUL terminator. Test it on "kernel" and print the length. Expected output:

6`,
    hints: [
      'Walk a pointer or index until you reach the \\0 byte.',
      'const char * means the function promises not to modify the string.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

size_t my_strlen(const char *s) {
    size_t n = 0;
    while (s[n] != '\\0')
        n++;
    return n;
}

int main(void) {
    printf("%zu\\n", my_strlen("kernel"));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

size_t my_strlen(const char *s) {
    /* TODO: count chars until the NUL terminator */
    return 0;
}

int main(void) {
    printf("%zu\\n", my_strlen("kernel"));
    return 0;
}`,
    tags: ['kernel', 'strings', 'const'],
  },
  {
    id: 'lx-ch01-c-013',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pointer Arithmetic Walks an Array',
    prompt: `Sum the same int a[5] = {1, 2, 3, 4, 5}, but this time use ONLY a moving pointer (no a[i] indexing). Start a pointer at &a[0], advance it with p++ until it reaches a + 5, and dereference with *p. Print "sum = 15".`,
    hints: [
      'p++ on an int* advances by sizeof(int) bytes, i.e. one element.',
      'The loop condition can compare p against a + 5.',
    ],
    solution: `#include <stdio.h>

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int *p = a; p < a + 5; p++)
        sum += *p;
    printf("sum = %d\\n", sum);
    return 0;
}`,
    starter: `#include <stdio.h>

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    /* TODO: sum using a moving pointer, no indexing */
    printf("sum = %d\\n", sum);
    return 0;
}`,
    tags: ['kernel', 'pointers', 'arrays'],
  },
  {
    id: 'lx-ch01-c-014',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Array Decay in a Function',
    prompt: `Demonstrate the array-to-pointer decay rule. Write int sum_array(const int *arr, size_t n) that sums n elements. In main, declare int data[] = {10, 20, 30, 40}, compute its length with sizeof(data)/sizeof(data[0]), and pass it. Print "sum = 100". Note that inside sum_array, sizeof(arr) would give the pointer size, not the array size — that is why n must be passed explicitly.`,
    hints: [
      'When an array is passed to a function it decays to a pointer to its first element.',
      'sizeof(data)/sizeof(data[0]) works in main where data is still an array type.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

int sum_array(const int *arr, size_t n) {
    int sum = 0;
    for (size_t i = 0; i < n; i++)
        sum += arr[i];
    return sum;
}

int main(void) {
    int data[] = {10, 20, 30, 40};
    size_t n = sizeof(data) / sizeof(data[0]);
    printf("sum = %d\\n", sum_array(data, n));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

int sum_array(const int *arr, size_t n) {
    /* TODO: sum n elements */
    return 0;
}

int main(void) {
    int data[] = {10, 20, 30, 40};
    size_t n = sizeof(data) / sizeof(data[0]);
    printf("sum = %d\\n", sum_array(data, n));
    return 0;
}`,
    tags: ['kernel', 'arrays', 'decay'],
  },
  {
    id: 'lx-ch01-c-015',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Toggle and Mask Multiple Bits',
    prompt: `Define macros for three feature flags using shifts: FEAT_A = (1 << 0), FEAT_B = (1 << 1), FEAT_C = (1 << 2). Start with uint32_t state = FEAT_A | FEAT_C. Use ^= to toggle FEAT_B (turning it on) and FEAT_C (turning it off), then print state in decimal. Expected output:

3`,
    hints: [
      'XOR with a bit flips it: 0 becomes 1 and 1 becomes 0.',
      'You can toggle several bits at once by OR-ing them into one mask.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

#define FEAT_A (1u << 0)
#define FEAT_B (1u << 1)
#define FEAT_C (1u << 2)

int main(void) {
    uint32_t state = FEAT_A | FEAT_C;
    state ^= (FEAT_B | FEAT_C);
    printf("%u\\n", state);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

#define FEAT_A (1u << 0)
#define FEAT_B (1u << 1)
#define FEAT_C (1u << 2)

int main(void) {
    uint32_t state = FEAT_A | FEAT_C;
    /* TODO: toggle FEAT_B and FEAT_C, then print state */
    return 0;
}`,
    tags: ['kernel', 'bitwise', 'macros'],
  },
  {
    id: 'lx-ch01-c-016',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Set Bits (Popcount)',
    prompt: `Write int popcount(uint32_t v) that returns the number of 1 bits in v, using only shifts and masking in a loop (do not use a builtin). Test it on 0xF0F0F0F0 and print the count. Expected output:

16`,
    hints: [
      'Repeatedly add (v & 1) to a counter and shift v right by 1.',
      'Loop until v becomes 0.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int popcount(uint32_t v) {
    int count = 0;
    while (v) {
        count += v & 1u;
        v >>= 1;
    }
    return count;
}

int main(void) {
    printf("%d\\n", popcount(0xF0F0F0F0u));
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int popcount(uint32_t v) {
    /* TODO: count the 1 bits with shifts and masking */
    return 0;
}

int main(void) {
    printf("%d\\n", popcount(0xF0F0F0F0u));
    return 0;
}`,
    tags: ['kernel', 'bitwise', 'popcount'],
  },
  {
    id: 'lx-ch01-c-017',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Extract a Bit Field With Shift and Mask',
    prompt: `A 16-bit register packs a 4-bit field in bits [11:8]. Write uint8_t get_field(uint16_t reg) that shifts reg right by 8 and masks with 0xF to extract that nibble. Test it on reg = 0xAB00 (the nibble is 0xB = 11) and print the value. Expected output:

11`,
    hints: [
      'Shift right by the field offset, then AND with a mask of the field width.',
      'A 4-bit field uses the mask 0xF.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

uint8_t get_field(uint16_t reg) {
    return (reg >> 8) & 0xF;
}

int main(void) {
    printf("%u\\n", get_field(0xAB00));
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

uint8_t get_field(uint16_t reg) {
    /* TODO: extract bits [11:8] */
    return 0;
}

int main(void) {
    printf("%u\\n", get_field(0xAB00));
    return 0;
}`,
    tags: ['kernel', 'bitwise', 'registers'],
  },
  {
    id: 'lx-ch01-c-018',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Insert a Value Into a Bit Field',
    prompt: `Given uint16_t reg starting at 0x00FF, write code that clears bits [11:8] and inserts the 4-bit value 0xA into them, leaving every other bit unchanged. Print the result in hex with %04X. Expected output:

0AFF`,
    hints: [
      'First clear the field: reg &= ~(0xF << 8).',
      'Then OR in the new value: reg |= (val & 0xF) << 8.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint16_t reg = 0x00FF;
    uint16_t val = 0xA;
    reg &= ~(0xF << 8);
    reg |= (val & 0xF) << 8;
    printf("%04X\\n", reg);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint16_t reg = 0x00FF;
    uint16_t val = 0xA;
    /* TODO: clear bits [11:8] then insert val */
    printf("%04X\\n", reg);
    return 0;
}`,
    tags: ['kernel', 'bitwise', 'registers'],
  },
  {
    id: 'lx-ch01-c-019',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Function Pointer Variable',
    prompt: `Function pointers drive kernel callback tables. Write two functions int add(int, int) and int sub(int, int). In main, declare a variable int (*op)(int, int), point it at add and call it on (7, 3), then point it at sub and call it on (7, 3). Print both results, one per line. Expected output:

10
4`,
    hints: [
      'The type of a pointer to int f(int,int) is int (*)(int, int).',
      'You can call through the pointer with op(a, b) directly.',
    ],
    solution: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main(void) {
    int (*op)(int, int);
    op = add;
    printf("%d\\n", op(7, 3));
    op = sub;
    printf("%d\\n", op(7, 3));
    return 0;
}`,
    starter: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main(void) {
    /* TODO: declare op, point it at add then sub, calling each */
    return 0;
}`,
    tags: ['kernel', 'function-pointers', 'callbacks'],
  },
  {
    id: 'lx-ch01-c-020',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Dispatch Table of Operations',
    prompt: `Build a dispatch table like the kernel's file_operations. Define a typedef for int (*op_fn)(int, int) and an array of three of them: { add, sub, mul }. Write functions for each. In main, loop over the table calling each on (6, 2) and print the three results on separate lines. Expected output:

8
4
12`,
    hints: [
      'typedef int (*op_fn)(int, int); makes the array declaration readable.',
      'op_fn table[] = { add, sub, mul };',
    ],
    solution: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

typedef int (*op_fn)(int, int);

int main(void) {
    op_fn table[] = { add, sub, mul };
    size_t n = sizeof(table) / sizeof(table[0]);
    for (size_t i = 0; i < n; i++)
        printf("%d\\n", table[i](6, 2));
    return 0;
}`,
    starter: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

typedef int (*op_fn)(int, int);

int main(void) {
    op_fn table[] = { add, sub, mul };
    /* TODO: loop over the table and call each on (6, 2) */
    return 0;
}`,
    tags: ['kernel', 'function-pointers', 'dispatch'],
  },
  {
    id: 'lx-ch01-c-021',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Callback With a Context Pointer',
    prompt: `Kernel callbacks usually take a void * context. Write void for_each(const int *arr, size_t n, void (*cb)(int, void *), void *ctx) that calls cb(arr[i], ctx) for every element. Use it with a callback that accumulates the sum into an int pointed to by ctx. In main, sum {2, 4, 6, 8} this way and print "total = 20".`,
    hints: [
      'Inside the callback, cast ctx back to int* and add to it.',
      'Pass the address of your accumulator as the ctx argument.',
    ],
    solution: `#include <stdio.h>
#include <stddef.h>

void accumulate(int value, void *ctx) {
    int *total = (int *)ctx;
    *total += value;
}

void for_each(const int *arr, size_t n, void (*cb)(int, void *), void *ctx) {
    for (size_t i = 0; i < n; i++)
        cb(arr[i], ctx);
}

int main(void) {
    int data[] = {2, 4, 6, 8};
    int total = 0;
    for_each(data, 4, accumulate, &total);
    printf("total = %d\\n", total);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stddef.h>

void accumulate(int value, void *ctx) {
    /* TODO: cast ctx to int* and add value */
}

void for_each(const int *arr, size_t n, void (*cb)(int, void *), void *ctx) {
    /* TODO: call cb for each element */
}

int main(void) {
    int data[] = {2, 4, 6, 8};
    int total = 0;
    for_each(data, 4, accumulate, &total);
    printf("total = %d\\n", total);
    return 0;
}`,
    tags: ['kernel', 'function-pointers', 'callbacks'],
  },
  {
    id: 'lx-ch01-c-022',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pointer to a Struct in a Callback Table',
    prompt: `Define struct device { const char *name; int (*probe)(struct device *); }. Write a probe function that prints "probing <name>" and returns 0. In main, create a struct device with name "uart0" and probe set to your function, then invoke dev.probe(&dev). Expected output:

probing uart0`,
    hints: [
      'The struct can hold a function pointer whose parameter is a pointer to the same struct.',
      'Call it with dev.probe(&dev) so the callback can read dev->name.',
    ],
    solution: `#include <stdio.h>

struct device {
    const char *name;
    int (*probe)(struct device *);
};

int uart_probe(struct device *dev) {
    printf("probing %s\\n", dev->name);
    return 0;
}

int main(void) {
    struct device dev = { .name = "uart0", .probe = uart_probe };
    dev.probe(&dev);
    return 0;
}`,
    starter: `#include <stdio.h>

struct device {
    const char *name;
    int (*probe)(struct device *);
};

int uart_probe(struct device *dev) {
    /* TODO: print "probing <name>" and return 0 */
    return 0;
}

int main(void) {
    struct device dev = { .name = "uart0", .probe = uart_probe };
    dev.probe(&dev);
    return 0;
}`,
    tags: ['kernel', 'structs', 'function-pointers'],
  },
  {
    id: 'lx-ch01-c-023',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Union Reinterprets Bytes',
    prompt: `Use a union to view the bytes of a 32-bit value. Define union view { uint32_t u; uint8_t b[4]; }. Set u = 0x11223344 and print the four bytes b[0]..b[3] in hex. The order you see reveals the machine's endianness; on a little-endian machine the output is:

44 33 22 11`,
    hints: [
      'A union overlays all members in the same storage.',
      'b[0] is the lowest-addressed byte of the stored integer.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

union view {
    uint32_t u;
    uint8_t b[4];
};

int main(void) {
    union view v;
    v.u = 0x11223344;
    printf("%02X %02X %02X %02X\\n", v.b[0], v.b[1], v.b[2], v.b[3]);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

union view {
    uint32_t u;
    uint8_t b[4];
};

int main(void) {
    union view v;
    v.u = 0x11223344;
    /* TODO: print b[0]..b[3] in hex */
    return 0;
}`,
    tags: ['kernel', 'unions', 'endianness'],
  },
  {
    id: 'lx-ch01-c-024',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Detect Endianness at Runtime',
    prompt: `Write int is_little_endian(void) that returns 1 on a little-endian machine and 0 otherwise. Store a uint16_t with value 1 and inspect its first byte through a uint8_t pointer: if that byte is 1, the low byte comes first (little-endian). In main, print "little" or "big" accordingly.`,
    hints: [
      'Take a uint8_t* to the address of the uint16_t and read [0].',
      'On little-endian the least significant byte is at the lowest address.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int is_little_endian(void) {
    uint16_t x = 1;
    uint8_t *p = (uint8_t *)&x;
    return p[0] == 1;
}

int main(void) {
    printf("%s\\n", is_little_endian() ? "little" : "big");
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int is_little_endian(void) {
    /* TODO: inspect the first byte of a uint16_t holding 1 */
    return 0;
}

int main(void) {
    printf("%s\\n", is_little_endian() ? "little" : "big");
    return 0;
}`,
    tags: ['kernel', 'endianness', 'pointers'],
  },
  {
    id: 'lx-ch01-c-025',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Byte-Swap a 32-Bit Value',
    prompt: `Network byte order is big-endian, so the kernel swaps bytes with helpers like __swab32. Without any library function, write uint32_t swap32(uint32_t v) that reverses the four bytes using shifts and masks. Test it on 0x12345678 and print the result with %08X. Expected output:

78563412`,
    hints: [
      'Move byte 0 to byte 3 with << 24, byte 1 to byte 2 with << 8, and so on.',
      'Mask each byte with 0xFF before or after shifting to avoid stray bits.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

uint32_t swap32(uint32_t v) {
    return ((v & 0x000000FFu) << 24) |
           ((v & 0x0000FF00u) <<  8) |
           ((v & 0x00FF0000u) >>  8) |
           ((v & 0xFF000000u) >> 24);
}

int main(void) {
    printf("%08X\\n", swap32(0x12345678u));
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

uint32_t swap32(uint32_t v) {
    /* TODO: reverse the four bytes with shifts and masks */
    return 0;
}

int main(void) {
    printf("%08X\\n", swap32(0x12345678u));
    return 0;
}`,
    tags: ['kernel', 'endianness', 'bitwise'],
  },
  {
    id: 'lx-ch01-c-026',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Unsigned Overflow Wraps Around',
    prompt: `Unsigned integer overflow is well-defined in C: it wraps modulo 2^N. Take uint8_t x = 250 and add 10 to it, storing back into a uint8_t. Print the result. Because 260 mod 256 = 4, the output must be:

4`,
    hints: [
      'A uint8_t holds 0..255; adding past 255 wraps to 0.',
      'Assign the sum back into a uint8_t so the truncation happens.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint8_t x = 250;
    x = (uint8_t)(x + 10);
    printf("%u\\n", x);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint8_t x = 250;
    /* TODO: add 10, store back into a uint8_t, and print */
    return 0;
}`,
    tags: ['kernel', 'overflow', 'types'],
  },
  {
    id: 'lx-ch01-c-027',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Safe Addition With Overflow Check',
    prompt: `Validating sizes before allocating is critical in the kernel. Write int safe_add(uint32_t a, uint32_t b, uint32_t *out) that computes a + b, but returns -1 (and leaves *out unchanged) if the sum would overflow a uint32_t; otherwise it stores the sum and returns 0. Detect overflow by checking whether the sum is less than a. In main, test it on (0xFFFFFFFF, 1) — which must report overflow — and on (100, 200).`,
    hints: [
      'For unsigned wrap-around, a + b < a exactly when the addition overflowed.',
      'Only write through out when no overflow occurred.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

int safe_add(uint32_t a, uint32_t b, uint32_t *out) {
    uint32_t sum = a + b;
    if (sum < a)
        return -1;
    *out = sum;
    return 0;
}

int main(void) {
    uint32_t r;
    if (safe_add(0xFFFFFFFFu, 1, &r) < 0)
        printf("overflow\\n");
    if (safe_add(100, 200, &r) == 0)
        printf("sum = %u\\n", r);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

int safe_add(uint32_t a, uint32_t b, uint32_t *out) {
    /* TODO: return -1 on overflow, else store sum and return 0 */
    return 0;
}

int main(void) {
    uint32_t r;
    if (safe_add(0xFFFFFFFFu, 1, &r) < 0)
        printf("overflow\\n");
    if (safe_add(100, 200, &r) == 0)
        printf("sum = %u\\n", r);
    return 0;
}`,
    tags: ['kernel', 'overflow', 'safety'],
  },
  {
    id: 'lx-ch01-c-028',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Function-Like Macro for MIN',
    prompt: `Define a function-like macro MIN(a, b) that evaluates to the smaller of two values. Wrap the whole expression and each argument in parentheses to avoid precedence bugs. Use it in main to print MIN(3 + 4, 5), which must be:

5`,
    hints: [
      '#define MIN(a, b) ((a) < (b) ? (a) : (b))',
      'Parenthesize every argument so MIN(3 + 4, 5) expands correctly.',
    ],
    solution: `#include <stdio.h>

#define MIN(a, b) ((a) < (b) ? (a) : (b))

int main(void) {
    printf("%d\\n", MIN(3 + 4, 5));
    return 0;
}`,
    starter: `#include <stdio.h>

/* TODO: define a safe MIN(a, b) macro */

int main(void) {
    printf("%d\\n", MIN(3 + 4, 5));
    return 0;
}`,
    tags: ['kernel', 'preprocessor', 'macros'],
  },
  {
    id: 'lx-ch01-c-029',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'ARRAY_SIZE Macro',
    prompt: `The kernel's ARRAY_SIZE(arr) macro computes an array's element count at compile time as sizeof(arr) / sizeof((arr)[0]). Define it, then use it in main on int ids[] = {5, 6, 7, 8, 9} to print the count. Expected output:

5

(Remember this only works where arr is a real array type, not a decayed pointer.)`,
    hints: [
      'sizeof of the whole array divided by sizeof of one element gives the count.',
      'Print the size_t result with %zu.',
    ],
    solution: `#include <stdio.h>

#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))

int main(void) {
    int ids[] = {5, 6, 7, 8, 9};
    printf("%zu\\n", ARRAY_SIZE(ids));
    return 0;
}`,
    starter: `#include <stdio.h>

/* TODO: define ARRAY_SIZE(arr) */

int main(void) {
    int ids[] = {5, 6, 7, 8, 9};
    printf("%zu\\n", ARRAY_SIZE(ids));
    return 0;
}`,
    tags: ['kernel', 'preprocessor', 'arrays'],
  },
  {
    id: 'lx-ch01-c-030',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Header Include Guard',
    prompt: `Write the contents of a header file color.h that defines an enum { RED, GREEN, BLUE } and is protected by a classic include guard so including it twice causes no redefinition error. Show the full header text, including the #ifndef / #define / #endif lines. Use the guard name COLOR_H.`,
    hints: [
      'The pattern is #ifndef COLOR_H / #define COLOR_H / ... / #endif.',
      'Everything that could be redefined goes between the #define and the #endif.',
    ],
    solution: `#ifndef COLOR_H
#define COLOR_H

enum color {
    RED,
    GREEN,
    BLUE
};

#endif /* COLOR_H */`,
    starter: `/* color.h */
/* TODO: add an include guard around an enum color { RED, GREEN, BLUE } */`,
    tags: ['kernel', 'preprocessor', 'headers'],
  },
  {
    id: 'lx-ch01-c-031',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'const Pointer vs Pointer to const',
    prompt: `Demonstrate the difference between the two const placements. In main: (1) declare int a = 1, b = 2 and a "pointer to const int" const int *pc = &a, then repoint pc = &b (allowed) and read *pc. (2) declare a "const pointer to int" int * const cp = &a, then write *cp = 99 (allowed) but do NOT try to repoint cp. Print *pc and a, in that order, one per line. Expected output:

2
99`,
    hints: [
      'const int *pc means the pointee is const: you may move pc but not write *pc.',
      'int * const cp means the pointer is const: you may write *cp but not move cp.',
    ],
    solution: `#include <stdio.h>

int main(void) {
    int a = 1, b = 2;

    const int *pc = &a;   /* pointer to const int */
    pc = &b;              /* moving the pointer is fine */
    printf("%d\\n", *pc);  /* prints 2 */

    int * const cp = &a;  /* const pointer to int */
    *cp = 99;             /* writing through it is fine */
    printf("%d\\n", a);    /* prints 99 */

    return 0;
}`,
    starter: `#include <stdio.h>

int main(void) {
    int a = 1, b = 2;
    const int *pc = &a;
    /* TODO: repoint pc to b and print *pc */

    int * const cp = &a;
    /* TODO: write 99 through cp and print a */
    return 0;
}`,
    tags: ['kernel', 'const', 'pointers'],
  },
  {
    id: 'lx-ch01-c-032',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'volatile Hardware Register',
    prompt: `Drivers mark memory-mapped registers volatile so the compiler reloads them on every access. Simulate this: declare volatile uint32_t reg = 0. Write a helper void write_reg(volatile uint32_t *r, uint32_t val) that stores val, and uint32_t read_reg(volatile uint32_t *r) that returns *r. In main, write 0xCAFE then read it back and print with %X. Expected output:

CAFE

In a comment, explain in one line why volatile matters here.`,
    hints: [
      'volatile tells the compiler not to cache the value in a register or optimize the access away.',
      'The pointer parameters must also be volatile-qualified to match.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

void write_reg(volatile uint32_t *r, uint32_t val) {
    *r = val;
}

uint32_t read_reg(volatile uint32_t *r) {
    return *r;
}

int main(void) {
    volatile uint32_t reg = 0;
    /* volatile forces a real load/store each access, as needed for MMIO */
    write_reg(&reg, 0xCAFE);
    printf("%X\\n", read_reg(&reg));
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

void write_reg(volatile uint32_t *r, uint32_t val) {
    /* TODO: store val */
}

uint32_t read_reg(volatile uint32_t *r) {
    /* TODO: return the current value */
    return 0;
}

int main(void) {
    volatile uint32_t reg = 0;
    write_reg(&reg, 0xCAFE);
    printf("%X\\n", read_reg(&reg));
    return 0;
}`,
    tags: ['kernel', 'volatile', 'registers'],
  },
  {
    id: 'lx-ch01-c-033',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'offsetof a Struct Member',
    prompt: `The kernel computes member byte offsets with offsetof. Define struct packet { uint8_t type; uint32_t len; uint8_t flags; } and print the offsets of all three members using offsetof from <stddef.h>, one per line as "name = offset". Note that padding may make len start at offset 4, not 1, because the compiler aligns the uint32_t.`,
    hints: [
      'offsetof(struct packet, member) yields a size_t byte offset.',
      'Print each with %zu and expect alignment padding between members.',
    ],
    solution: `#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

struct packet {
    uint8_t  type;
    uint32_t len;
    uint8_t  flags;
};

int main(void) {
    printf("type  = %zu\\n", offsetof(struct packet, type));
    printf("len   = %zu\\n", offsetof(struct packet, len));
    printf("flags = %zu\\n", offsetof(struct packet, flags));
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

struct packet {
    uint8_t  type;
    uint32_t len;
    uint8_t  flags;
};

int main(void) {
    /* TODO: print offsetof for type, len, flags */
    return 0;
}`,
    tags: ['kernel', 'structs', 'offsetof'],
  },
  {
    id: 'lx-ch01-c-034',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'container_of Macro',
    prompt: `Implement the kernel's container_of(ptr, type, member) macro, which recovers a pointer to the enclosing struct given a pointer to one of its members. It is defined as ((type *)((char *)(ptr) - offsetof(type, member))). Use it: define struct node { int data; struct list { int x; } link; }, take a pointer to the .link member, recover the struct node*, and print its data. Set data = 77 and expect:

77`,
    hints: [
      'Cast ptr to char * so the offset subtraction is in bytes, then cast back to type *.',
      'offsetof gives the byte distance from the struct start to the member.',
    ],
    solution: `#include <stddef.h>
#include <stdio.h>

#define container_of(ptr, type, member) \\
    ((type *)((char *)(ptr) - offsetof(type, member)))

struct list { int x; };

struct node {
    int data;
    struct list link;
};

int main(void) {
    struct node n = { .data = 77, .link = { .x = 0 } };
    struct list *lp = &n.link;
    struct node *recovered = container_of(lp, struct node, link);
    printf("%d\\n", recovered->data);
    return 0;
}`,
    starter: `#include <stddef.h>
#include <stdio.h>

/* TODO: define container_of(ptr, type, member) */

struct list { int x; };

struct node {
    int data;
    struct list link;
};

int main(void) {
    struct node n = { .data = 77, .link = { .x = 0 } };
    struct list *lp = &n.link;
    /* TODO: recover the node from lp and print its data */
    return 0;
}`,
    tags: ['kernel', 'container-of', 'macros'],
  },
  {
    id: 'lx-ch01-c-035',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pack and Unpack a u32 From Bytes',
    prompt: `Parsing on-the-wire data means assembling integers from bytes. Write uint32_t pack_be(const uint8_t b[4]) that builds a big-endian u32 (b[0] is the most significant byte) using shifts, and void unpack_be(uint32_t v, uint8_t out[4]) that does the reverse. In main, pack {0xDE, 0xAD, 0xBE, 0xEF} (printing it with %08X gives DEADBEEF), then unpack it back and print the four bytes. Expected output:

DEADBEEF
DE AD BE EF`,
    hints: [
      'For big-endian, b[0] shifts left by 24, b[1] by 16, b[2] by 8, b[3] by 0.',
      'To unpack, shift right and mask each byte with 0xFF.',
    ],
    solution: `#include <stdint.h>
#include <stdio.h>

uint32_t pack_be(const uint8_t b[4]) {
    return ((uint32_t)b[0] << 24) |
           ((uint32_t)b[1] << 16) |
           ((uint32_t)b[2] <<  8) |
           ((uint32_t)b[3]);
}

void unpack_be(uint32_t v, uint8_t out[4]) {
    out[0] = (uint8_t)(v >> 24);
    out[1] = (uint8_t)(v >> 16);
    out[2] = (uint8_t)(v >>  8);
    out[3] = (uint8_t)(v);
}

int main(void) {
    uint8_t in[4] = {0xDE, 0xAD, 0xBE, 0xEF};
    uint32_t v = pack_be(in);
    printf("%08X\\n", v);

    uint8_t out[4];
    unpack_be(v, out);
    printf("%02X %02X %02X %02X\\n", out[0], out[1], out[2], out[3]);
    return 0;
}`,
    starter: `#include <stdint.h>
#include <stdio.h>

uint32_t pack_be(const uint8_t b[4]) {
    /* TODO: build a big-endian u32 from 4 bytes */
    return 0;
}

void unpack_be(uint32_t v, uint8_t out[4]) {
    /* TODO: split v back into 4 big-endian bytes */
}

int main(void) {
    uint8_t in[4] = {0xDE, 0xAD, 0xBE, 0xEF};
    uint32_t v = pack_be(in);
    printf("%08X\\n", v);

    uint8_t out[4];
    unpack_be(v, out);
    printf("%02X %02X %02X %02X\\n", out[0], out[1], out[2], out[3]);
    return 0;
}`,
    tags: ['kernel', 'endianness', 'bitwise'],
  },
]

export default problems
