import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-14',
  track: 'dsa',
  chapter: 14,
  title: 'Bit Manipulation',
  summary: `Underneath every integer your program touches is a row of switches, each either off (0) or on (1), and bit manipulation is the art of flipping those switches directly instead of going through arithmetic. This sounds low-level and scary, but it is exactly how Unix file permissions (chmod 755), feature flags, RGBA colors, database bitmap indexes, and high-speed compression actually work, and once you can read a number as its bits the tricks become obvious rather than magical.

This chapter starts from the ground: how integers are physically stored in binary, why two's complement makes an i32 negative one appear as all ones, and what each operator (& | ^ ! << >>) really does to those switches. From there we build the everyday toolkit, masks to get, set, clear, and toggle a single bit, then the classic interview superpowers: find the one unpaired number with XOR, swap two variables with no temporary, detect a power of two in a single expression, isolate the lowest set bit, and enumerate every subset of a set with one tiny loop.

Throughout, we lean hard on Rust's honesty about machine integers. Rust has no "just an int"; you pick a fixed width like u32 or i64, a usize can never go negative, and overflow is a real event you handle with wrapping_, checked_, and overflowing_ methods instead of pretending it cannot happen. That precision is exactly what makes Rust a joy for bit work once you respect it.`,
  sections: [
    {
      heading: 'Binary, bits, and how an integer is really stored',
      body: `A computer does not store the number thirteen as the digit "13". It stores a fixed row of **bits**, where a bit is a single switch that is either 0 or 1. The position of each switch carries a weight that is a power of two, exactly the way the position of a digit in ordinary base ten carries a weight that is a power of ten. The rightmost bit is worth 1, the next is worth 2, then 4, 8, 16, and so on, doubling each step to the left. To read a binary number you just add up the weights of the positions that hold a 1.

The number of switches in the row is the **width** of the type, and in Rust you always choose it. A u8 is a row of 8 switches, a u32 is a row of 32, a u64 is 64. The two ends of the row have names worth memorizing: the rightmost bit, worth 1, is the **least significant bit** or LSB because changing it changes the value the least; the leftmost bit is the **most significant bit** or MSB because it carries the biggest weight. When we draw bits we write the MSB on the left and the LSB on the right, the same direction you write ordinary decimal numbers.

A real-world picture: think of Unix file permissions. The command chmod 755 is really setting three bits per user category (read, write, execute), and the digit 7 is just the binary 111, all three switches on, while 5 is 101, read and execute on but write off. The whole permission system is bits in a row, which is why this chapter is not academic trivia, it is how the operating system on your laptop actually represents who can touch a file.

To name a literal in Rust you can write it in binary with the 0b prefix, in hexadecimal (base sixteen, where each digit packs exactly 4 bits) with 0x, and you may sprinkle underscores anywhere as visual separators. Hex is the working programmer's shorthand for bits because one hex digit is exactly one group of four bits, so 0xFF is instantly readable as 1111_1111.

### Common pitfalls

- Forgetting the width. The same bit pattern means different things in a u8 versus a u32; an operation that "fits" in 32 bits can overflow in 8. Always know which type you are in.
- Reading bits left to right as if they were decimal. The leftmost printed bit is the most significant, but it is the *last* one you reach when you shift right one step at a time.`,
      code: [
        {
          lang: 'text',
          src: `Storing 13 in a u8 (8 switches). Weights double leftward:

  bit index:   7    6    5    4    3    2    1    0
  weight:    128   64   32   16    8    4    2    1
  value:       0    0    0    0    1    1    0    1
                                  |    |         |
                                  +----+---------+--> 8 + 4 + 1 = 13
              ^                                  ^
              MSB (most significant)            LSB (least significant)

So 13 decimal  ==  0b0000_1101 binary  ==  0x0D hex`
        },
        {
          lang: 'rust',
          src: `fn main() {
    let a = 13u8;            // decimal literal
    let b = 0b0000_1101u8;   // same value, written in binary
    let c = 0x0Du8;          // same value, written in hex
    assert_eq!(a, b);
    assert_eq!(a, c);

    // {:b} prints binary, {:08b} pads to 8 digits, {:#x} prints hex with 0x.
    println!("{a} = {a:08b} = {a:#x}"); // 13 = 00001101 = 0xd

    // One hex digit packs exactly 4 bits, so 0xFF is all-ones in a u8.
    println!("{:08b}", 0xFFu8);         // 11111111
}`
        }
      ]
    },
    {
      heading: 'Two\'s complement: why -1 is all ones',
      body: `Unsigned types like u32 are the easy case: every bit pattern is just a non-negative number. Signed types like i32 have to represent negatives too, and the scheme nearly every modern computer uses is called **two's complement**. The rule is wonderfully simple to state: the most significant bit keeps a *negative* weight. In an 8-bit signed number the MSB is worth minus 128 instead of plus 128, and all the other bits keep their normal positive weights. You still just add up the weights of the set bits; you only changed the sign of the top one.

That single change explains everything that confuses beginners. The value negative one has every bit set to 1, because minus 128 plus 64 plus 32 plus 16 plus 8 plus 4 plus 2 plus 1 equals exactly minus one. So an i32 holding negative one is a row of thirty-two 1s, which is also the bit pattern of the largest unsigned value. The MSB doubles as a **sign bit**: if it is 1 the number is negative, if it is 0 the number is zero or positive.

Two's complement is not an arbitrary convention; it is chosen because it makes the hardware simple. Addition and subtraction use the exact same circuit for signed and unsigned numbers, and there is only one representation of zero (all bits off), unlike older schemes that had a separate "negative zero". To negate a number by hand you flip every bit and then add one, which is precisely what Rust's unary minus and the wrapping_neg method compute.

The practical Rust lesson: the bitwise NOT operator, written ! , flips every bit, and because of two's complement flipping every bit of x gives you exactly minus x minus one. So !0u8 is 255 (all ones, unsigned) but !0i8 is negative one (all ones, signed). Same bits, different interpretation, decided entirely by the type.

### Common pitfalls

- Assuming a right shift on a signed negative number fills with zeros. It does not; it fills with copies of the sign bit (this is covered in the shift section). On unsigned types it always fills with zeros.
- Confusing logical NOT with bitwise NOT. In Rust both are the single character ! , but on a bool it is logical (true becomes false) and on an integer it is bitwise (every bit flips). The type decides which one you get.`,
      code: [
        {
          lang: 'text',
          src: `Same 8 bits, two readings. Only the top weight's SIGN changes.

  bits:        1   1   1   1   1   1   1   1

  as u8:     128 +64 +32 +16 + 8 + 4 + 2 + 1  = 255
  as i8:    -128 +64 +32 +16 + 8 + 4 + 2 + 1  =  -1
             ^^^^
             MSB weight is NEGATIVE for signed types

  Negating 5 by hand (flip every bit, then add one):
     5  = 0000_0101
   flip  = 1111_1010   (this is !5, the bitwise NOT)
   +1    = 1111_1011   = -5  in two's complement`
        },
        {
          lang: 'rust',
          src: `fn main() {
    // -1 is all ones in two's complement, for any signed width.
    println!("{:032b}", -1i32);     // 32 ones

    // Bitwise NOT flips every bit. Interpretation depends on the type:
    assert_eq!(!0u8, 255);          // all ones read as unsigned
    assert_eq!(!0i8, -1);           // the SAME all-ones read as signed

    // Flip-and-add-one is exactly negation:
    let x: i8 = 5;
    assert_eq!(!x + 1, -x);         // !5 + 1 == -5
    assert_eq!(x.wrapping_neg(), -5); // the std method that does flip+1

    // The MSB is the sign bit: check it to test for negative.
    let n: i32 = -42;
    assert!(n < 0 && (n >> 31) & 1 == 1);
}`
        }
      ]
    },
    {
      heading: 'The bitwise operators: AND, OR, XOR, NOT',
      body: `Four operators work on the bits of two numbers in parallel, position by position. Each produces a new number whose bit at position k depends only on the input bits at position k, so you can reason about them one column at a time using a tiny truth table.

**AND, written & , gives 1 only where both inputs are 1.** Think of it as the strict committee: every member must vote yes. AND is the tool for *masking off* bits, keeping only the positions you care about and forcing the rest to zero, because anything ANDed with 0 becomes 0 and anything ANDed with 1 is left unchanged.

**OR, written | , gives 1 where either input is 1.** Think of it as the easygoing committee: a single yes is enough. OR is the tool for *turning bits on*, merging two sets of flags together, because anything ORed with 1 becomes 1 and anything ORed with 0 is left unchanged.

**XOR, written ^ , gives 1 where the inputs differ.** Exclusive-or means "one or the other but not both". XOR is the tool for *toggling* and for *finding differences*, and it has algebraic superpowers we devote a whole section to, because x ^ x is 0 and x ^ 0 is x.

**NOT, written ! , flips every bit of a single number.** It is the only one of the four that takes one operand instead of two. We met it in the two's complement section; here it joins the family.

The everyday motivation is **feature flags**. Imagine a settings byte where bit 0 means dark mode, bit 1 means notifications, bit 2 means auto-save. You turn auto-save on with OR, you check whether notifications are on with AND, you flip dark mode with XOR, and you can store eight independent on/off settings in a single byte instead of eight separate booleans. This is exactly how option bitsets work in real libraries and operating systems.

### Common pitfalls

- Mixing up & with && and | with || . The single-character versions are bitwise and act on all bits; the doubled versions are logical, short-circuit, and only work on bool. Writing & where you meant && (or vice versa) compiles in some cases and silently does the wrong thing.
- Expecting AND to "add" or OR to "combine numerically". These are per-bit logic operations, not arithmetic; 6 & 3 is 2, which has nothing to do with subtraction.`,
      code: [
        {
          lang: 'text',
          src: `Truth tables (one column at a time), and a worked example a=12,b=10:

   a b | a&b   a b | a|b   a b | a^b      a | !a
   ----+----   ----+----   ----+----     ---+----
   0 0 |  0    0 0 |  0    0 0 |  0        0 |  1
   0 1 |  0    0 1 |  1    0 1 |  1        1 |  0
   1 0 |  0    1 0 |  1    1 0 |  1
   1 1 |  1    1 1 |  1    1 1 |  0

      a = 12 = 1 1 0 0
      b = 10 = 1 0 1 0
            -----------
   a & b =  8 = 1 0 0 0   (1 only where BOTH are 1)
   a | b = 14 = 1 1 1 0   (1 where EITHER is 1)
   a ^ b =  6 = 0 1 1 0   (1 where they DIFFER)`
        },
        {
          lang: 'rust',
          src: `fn main() {
    let (a, b) = (12u8, 10u8); // 1100 and 1010
    assert_eq!(a & b, 8);      // 1000  AND keeps shared bits
    assert_eq!(a | b, 14);     // 1110  OR merges bits
    assert_eq!(a ^ b, 6);      // 0110  XOR marks differences
    assert_eq!(!a, 0b1111_0011); // NOT flips all 8 bits -> 243

    // Feature flags packed into one byte:
    const DARK:    u8 = 1 << 0; // 0001
    const NOTIFY:  u8 = 1 << 1; // 0010
    const AUTOSAVE:u8 = 1 << 2; // 0100

    let mut settings = DARK | NOTIFY;      // turn two flags on at once
    settings |= AUTOSAVE;                  // OR: switch autosave on
    let notify_on = settings & NOTIFY != 0;// AND: test a flag
    settings ^= DARK;                      // XOR: toggle dark mode off
    assert!(notify_on);
    assert_eq!(settings & DARK, 0);        // dark mode is now off
}`
        }
      ]
    },
    {
      heading: 'Shifts: << and >> multiply, divide, and build masks',
      body: `The shift operators slide every bit sideways by a given number of positions. **Left shift, written << , moves bits toward the most significant end**, dropping bits that fall off the left edge and feeding in 0s on the right. Sliding left by k positions multiplies the value by two to the power k, exactly the way appending a zero in decimal multiplies by ten. So 1 << 4 is sixteen, and 3 << 2 is twelve, which is the fastest possible way to multiply by a power of two.

**Right shift, written >> , moves bits toward the least significant end**, and here the type matters. For an unsigned type it feeds in 0s on the left; this is a **logical shift** and it divides by two to the power k, throwing away the remainder. For a *signed* type Rust performs an **arithmetic shift**, feeding in copies of the sign bit so that a negative number stays negative; minus eight shifted right by one is minus four, not some huge positive number. The single fact to remember is: right shift on unsigned fills with zeros, right shift on signed copies the sign bit.

The most important everyday use of left shift is **building a mask for the k-th bit**. The expression 1 followed by a left shift of k produces a number with a single 1 sitting at position k and 0s everywhere else, and that single-bit value is the key that unlocks the next section's get, set, clear, and toggle operations. Memorize the shape 1u32 << k as "the k-th bit, alone".

Rust is strict about shift amounts. Shifting a u32 by 32 or more is undefined nonsense on real hardware, so Rust treats an out-of-range shift as a bug: in debug builds it panics, and in release builds it masks the shift amount, neither of which is what you meant. The safe habit is to keep the shift amount strictly less than the width, and to reach for wrapping_shl or checked_shl when the amount comes from untrusted data.

### Common pitfalls

- Shifting by the full width or more. For a u32, a shift amount must be 0 through 31; 1u32 << 32 panics in debug. If you need "all bits", use a different construction such as u32::MAX.
- Assuming >> on a negative signed value fills with zeros. It copies the sign bit instead. If you truly want zero-fill, cast to the unsigned type of the same width first, shift, then cast back.
- Forgetting that the left operand's type fixes the width. 1 << 40 overflows an i32; write 1u64 << 40 when you need the room.`,
      code: [
        {
          lang: 'text',
          src: `Left shift fills zeros on the right (multiply by 2^k):

   3 << 2 :   0 0 0 0 0 0 1 1   (=3)
              shift left 2
              0 0 0 0 1 1 0 0   (=12 = 3 * 4)   <- two zeros fed in

Right shift differs by signedness (k = 1):

   unsigned  200u8 >> 1 :  1 1 0 0 1 0 0 0  (=200)
   logical                 0 1 1 0 0 1 0 0  (=100)  <- 0 fed in on left

   signed     -8i8 >> 1 :  1 1 1 1 1 0 0 0  (=-8)
   arithmetic              1 1 1 1 1 1 0 0  (=-4)   <- sign copied in

Building "the k-th bit alone":  1u8 << 3
              0 0 0 0 0 0 0 1  ->  0 0 0 0 1 0 0 0  (only bit 3 is set)`
        },
        {
          lang: 'rust',
          src: `fn main() {
    assert_eq!(1u32 << 4, 16);     // shift left = multiply by 2^k
    assert_eq!(3u32 << 2, 12);
    assert_eq!(200u8 >> 1, 100);   // unsigned: logical, fills zeros
    assert_eq!(-8i8 >> 1, -4);     // signed: arithmetic, copies sign bit

    // The single-bit mask, the workhorse of the next section:
    let k = 3;
    assert_eq!(1u32 << k, 0b0000_1000);

    // Safe shifting when the amount might be too large:
    let amt = 40u32;
    assert_eq!(1u32.checked_shl(amt), None); // 40 >= 32 -> rejected
    assert_eq!(1u64 << amt, 1 << 40);        // pick a wide enough type
}`
        }
      ]
    },
    {
      heading: 'Masks: get, set, clear, and toggle the k-th bit',
      body: `Now we combine the single-bit mask 1 << k with the operators to perform the four operations every bit programmer does in their sleep. A **mask** is just a number whose set bits select the positions you want to touch; the single-bit mask selects exactly one position, and these four idioms are the foundation of feature flags, permission bits, and bitset data structures.

**Get the k-th bit** by ANDing with the mask and seeing whether the result is non-zero, or shift the bit down to position 0 and AND with 1 to get a clean 0 or 1. AND with the mask isolates the one column you care about and zeros everything else, so the answer is non-zero exactly when that bit was set.

**Set the k-th bit (force it to 1)** by ORing with the mask. OR leaves every other bit untouched because x | 0 is x, and forces the target bit on because x | 1 is 1. This is how you turn a feature flag on without disturbing the others.

**Clear the k-th bit (force it to 0)** by ANDing with the *inverse* of the mask, written x & !(1 << k). The inverse mask is all 1s except a single 0 at position k, so ANDing leaves every other bit alone and forces the target to 0. This is the trickiest of the four because of the NOT; picture the inverse mask as "everything but the k-th bit".

**Toggle the k-th bit (flip it)** by XORing with the mask. XOR with 1 flips a bit and XOR with 0 leaves it, so XORing with the single-bit mask flips exactly the target. Toggling twice returns to the original, which is the basis of the XOR tricks in the next section.

The connecting picture is Unix permissions again. Granting write permission is *setting* a bit, revoking it is *clearing* a bit, testing whether a file is executable is *getting* a bit, and the whole of chmod is these four idioms applied to a 9-bit permission field.

### Common pitfalls

- Writing 1 << k where k could equal or exceed the type width. Keep k in range, and make sure 1 has the right type (1u64 << k for 64-bit work) so the mask is wide enough.
- Forgetting the NOT when clearing. x & (1 << k) does *not* clear the bit, it isolates it; clearing needs x & !(1 << k). This off-by-a-NOT is the single most common bit bug.
- Comparing a masked value to 1 instead of to non-zero. x & (1 << k) equals 1 << k (not 1) when the bit is set, so test it with != 0, or shift first.`,
      code: [
        {
          lang: 'text',
          src: `Start with x = 0b1010 (bit1 and bit3 set):

   mask = 1 << 2 = 0 1 0 0
   inv  = !(1<<2)= 1 0 1 1

   GET    k=1: x & (1<<1)  = 1 0 1 0 & 0 0 1 0 = 0 0 1 0  -> SET
   GET    k=2: x & (1<<2)  = 1 0 1 0 & 0 1 0 0 = 0 0 0 0  -> clear
   SET    k=2: x | (1<<2)  = 1 0 1 0 | 0 1 0 0 = 1 1 1 0
   CLEAR  k=1: x & !(1<<1) = 1 0 1 0 & 1 1 0 1 = 1 0 0 0
   TOGGLE k=0: x ^ (1<<0)  = 1 0 1 0 ^ 0 0 0 1 = 1 0 1 1`
        },
        {
          lang: 'rust',
          src: `// The four canonical one-bit idioms, as small helpers.
fn get(x: u32, k: u32) -> bool { x & (1 << k) != 0 }
fn set(x: u32, k: u32) -> u32  { x | (1 << k) }
fn clear(x: u32, k: u32) -> u32{ x & !(1 << k) }   // note the !
fn toggle(x: u32, k: u32) -> u32 { x ^ (1 << k) }

fn main() {
    let x = 0b1010u32;          // bits 1 and 3 are set
    assert_eq!(get(x, 1), true);
    assert_eq!(get(x, 2), false);
    assert_eq!(set(x, 2),   0b1110);
    assert_eq!(clear(x, 1), 0b1000);
    assert_eq!(toggle(x, 0),0b1011);

    // Read a clean 0/1 by shifting the target bit down to position 0:
    let bit3 = (x >> 3) & 1;
    assert_eq!(bit3, 1);

    // Toggling twice is a no-op (XOR is its own inverse):
    assert_eq!(toggle(toggle(x, 0), 0), x);
}`
        }
      ]
    },
    {
      heading: 'Counting and locating bits: count_ones, trailing_zeros, leading_zeros',
      body: `Often you do not want to flip a bit, you want to *measure* the bits. Three questions come up constantly: how many bits are set, where is the lowest set bit, and where is the highest? Rust's integer types answer all three with built-in methods that compile down to a single CPU instruction on modern processors, so they are both convenient and blazing fast.

**count_ones** returns how many bits are set to 1, a quantity also called the **population count** or popcount. The obvious brute-force way is to shift the number right one bit at a time, testing the lowest bit and counting, which is order of the width work, thirty-two steps for a u32. The hardware does it in one instruction. A real use is a **bitmap index** in a database: a set of rows is stored as a long row of bits, one per row, and counting matching rows is just popcount over the bitmap, far faster than walking a list.

**trailing_zeros** returns how many 0 bits sit below the lowest 1, which is the same as the *index of the lowest set bit*. If the number is 0b0010_1000, the lowest set bit is at position 3, so there are three trailing zeros. This instantly answers "what is the smallest power of two dividing this number" and is the key to iterating over set bits efficiently.

**leading_zeros** returns how many 0 bits sit above the highest 1, counting from the most significant end. Subtracting it from the width minus one gives the index of the highest set bit, which tells you the floor of the base-two logarithm, in other words how many bits the number needs. This is how you size buffers and round up to powers of two.

A subtle but important corner: for a value of 0, trailing_zeros and leading_zeros both return the full width (32 for a u32), because there is no set bit to stop the count. Always handle the zero case explicitly when the index you compute would be used to shift or index.

### Common pitfalls

- Calling trailing_zeros or leading_zeros on 0 and then using the result as a shift amount. Both return the type width (e.g. 32), and 1u32 << 32 panics. Guard against zero first.
- Hand-rolling a popcount loop in a hot path. count_ones is one instruction; a manual loop is dozens. Reach for the built-in unless you are deliberately teaching the loop.
- Confusing the *count* of zeros with the *index* of a bit on the wrong end. trailing_zeros is the index of the lowest set bit; the highest set bit's index is width minus one minus leading_zeros.`,
      code: [
        {
          lang: 'text',
          src: `x = 0b0010_1000 = 40, width 8:

      bit:  7 6 5 4 3 2 1 0
            0 0 1 0 1 0 0 0
            \\_/       \\___/
   leading zeros = 2     trailing zeros = 3
   (above highest 1)     (below lowest 1)

   count_ones(x)    = 2        (two bits are set)
   trailing_zeros(x)= 3        (lowest set bit is at index 3)
   leading_zeros(x) = 2
   highest set bit  = 8-1 - 2 = index 5

   Special case x = 0:
   count_ones=0, trailing_zeros=8, leading_zeros=8  (full width!)`
        },
        {
          lang: 'rust',
          src: `fn main() {
    let x = 0b0010_1000u8;          // = 40
    assert_eq!(x.count_ones(), 2);   // popcount
    assert_eq!(x.trailing_zeros(), 3); // index of lowest set bit
    assert_eq!(x.leading_zeros(), 2);
    let highest = 8 - 1 - x.leading_zeros(); // index of highest set bit
    assert_eq!(highest, 5);

    // The zero corner case: both return the full width.
    assert_eq!(0u32.trailing_zeros(), 32);
    assert_eq!(0u32.leading_zeros(), 32);

    // Iterate over the set bits cheaply using trailing_zeros + clear-lowest:
    let mut bits = 0b1001_0100u32;
    let mut indices = Vec::new();
    while bits != 0 {
        let i = bits.trailing_zeros();  // lowest set bit's index
        indices.push(i);
        bits &= bits - 1;               // clear that lowest set bit
    }
    assert_eq!(indices, vec![2, 4, 7]);
}`
        }
      ]
    },
    {
      heading: 'XOR superpowers: single number, swap, missing number',
      anim: 'bits-xor',
      body: `XOR has two algebraic properties that turn it into a magic wand. First, **a number XORed with itself is zero** (every bit differs from itself nowhere, so all columns become 0). Second, **a number XORed with zero is unchanged**. Put those together with the facts that XOR is commutative and associative (you can reorder and regroup freely) and you get a tool that makes pairs cancel out while leaving loners behind.

**Find the single non-duplicated number.** Suppose an array holds many numbers where every value appears exactly twice except one, and you must find the lonely one. The brute-force approach sorts or uses a hash set, costing extra time or memory. The XOR approach folds the entire array together with XOR: every duplicated value cancels itself to 0, and the survivor is the unique number. It runs in one linear pass with a single integer of memory, no allocation at all. This is the textbook example of XOR replacing a whole hash set.

**Swap two variables without a temporary.** Three XOR assignments exchange two values using no third variable, because each step cancels and reintroduces information. It is a cute trick, more a demonstration of the algebra than something you should use in real code (Rust's std::mem::swap is clearer and just as fast), but understanding *why* it works cements the cancellation idea.

**Find the missing number.** Given the numbers 0 through n with exactly one missing, XOR together all the array elements and also all the indices 0 through n; the present numbers cancel against their matching indices, and the one index with no partner is the missing value. Again it is a single pass with one integer of state, beating the obvious "sum them and subtract" approach which can overflow for large inputs.

### Common pitfalls

- Reaching for the XOR swap in production code. It is slower to read and gains nothing over std::mem::swap, and it breaks subtly if both names alias the same location. Use it to understand XOR, not to ship.
- Assuming the single-number trick works when values appear three times or an even number of times. XOR cancels pairs; it only isolates a loner when everything else appears an *even* number of times.
- Overflowing the sum-based missing-number method on large n. The XOR method never overflows because XOR stays within the width, which is one reason to prefer it.`,
      code: [
        {
          lang: 'text',
          src: `single number, array = [4, 1, 2, 1, 2], fold with XOR:

   acc = 0
   step value  acc (binary)  note
   ---- -----  ------------  -------------------------
    0     -    000
    1     4    100           acc = 0 ^ 4
    2     1    101           acc = 4 ^ 1
    3     2    111           acc = 5 ^ 2
    4     1    110           the second 1 cancels the first
    5     2    100           the second 2 cancels the first
                ^^^
   result = 100 = 4   <- only the unpaired number survives

   swap a=5,b=9 with three XORs:
     a = a ^ b   -> a holds 5^9
     b = a ^ b   -> b = (5^9)^9 = 5   (the 9s cancel)
     a = a ^ b   -> a = (5^9)^5 = 9   (the 5s cancel)`
        },
        {
          lang: 'rust',
          src: `// Every value appears twice except one; XOR folds away the pairs.
fn single_number(nums: &[u32]) -> u32 {
    nums.iter().fold(0, |acc, &x| acc ^ x) // O(n) time, O(1) space
}

// One missing value in 0..=n: cancel each number against its index.
fn missing_number(nums: &[u32]) -> u32 {
    let n = nums.len() as u32;
    let mut acc = n;                       // start with the top index
    for (i, &x) in nums.iter().enumerate() {
        acc ^= i as u32 ^ x;               // cancel index against value
    }
    acc
}

fn main() {
    assert_eq!(single_number(&[4, 1, 2, 1, 2]), 4);
    assert_eq!(missing_number(&[3, 0, 1]), 2);  // 0..=3 missing 2

    // XOR swap (educational only; prefer std::mem::swap in real code):
    let (mut a, mut b) = (5u32, 9u32);
    a ^= b; b ^= a; a ^= b;
    assert_eq!((a, b), (9, 5));
}`
        }
      ]
    },
    {
      heading: 'Power-of-two checks and isolating the lowest set bit',
      body: `Two one-line tricks come up so often they deserve their own section, and both rely on a beautiful fact about what subtracting one does to a binary number: **subtracting one flips the lowest set bit to 0 and turns every 0 below it into a 1.** Picture a number ending in a single 1 followed by some 0s; subtracting one borrows through the zeros, leaving the lowest 1 cleared and the trailing zeros turned to ones.

**Check for a power of two with x & (x - 1) == 0.** A power of two has exactly one bit set. For such a number, x minus one flips that lone bit off and lights up everything below it, so x and x minus one share no set bit and their AND is zero. For any number with two or more set bits, the higher bits survive the subtraction and the AND is non-zero. You must also exclude zero, since zero passes the AND test but is not a power of two. This single expression replaces a loop that counts bits, and it is exactly how memory allocators and hash tables check that a capacity is a clean power of two.

**Isolate the lowest set bit with x & x.wrapping_neg().** The negation of x in two's complement is the bitwise NOT plus one, which flips everything above the lowest set bit while leaving the lowest set bit and the zeros below it as they were after the flip-and-carry. ANDing x with its negation therefore keeps exactly the lowest set bit and clears all others. The result is the largest power of two that divides x, which is useful for iterating over set bits and for certain tree data structures (Fenwick / binary indexed trees lean on it heavily).

A connecting note on **clearing the lowest set bit**: the related expression x & (x - 1) (without the equality test) removes the lowest set bit, which is why the bit-iteration loop in the counting section used it. Subtracting one then ANDing is the standard "pop the lowest bit" move.

### Common pitfalls

- Forgetting the zero check in the power-of-two test. 0 & (0 - 1) is 0, so a naive test wrongly calls zero a power of two; write x != 0 && x & (x - 1) == 0.
- Writing x & (x - 1) on an unsigned 0 in debug mode. 0u32 - 1 underflows and panics; guard with x != 0 first, or use x & x.wrapping_sub(1).
- Using plain -x to isolate the lowest bit on an unsigned type. Unsigned types have no unary minus; use x.wrapping_neg(), which computes the two's complement negation safely.`,
      code: [
        {
          lang: 'text',
          src: `Why x & (x-1) clears the lowest set bit:

   x     = 0 1 0 1 1 0 0 0   (lowest set bit at index 3)
   x - 1 = 0 1 0 1 0 1 1 1   (bit 3 cleared, lower bits set)
   x&x-1 = 0 1 0 1 0 0 0 0   (lowest set bit gone)

   Power of two? exactly one bit set -> x & (x-1) == 0:
   8  = 1 0 0 0   8-1 = 0 1 1 1   AND = 0 0 0 0  -> YES
   12 = 1 1 0 0  12-1 = 1 0 1 1   AND = 1 0 0 0  -> NO

   Isolate lowest set bit: x & (-x)  [ -x = ~x + 1 ]
   x   = 0 1 0 1 1 0 0 0
   -x  = 1 0 1 0 1 0 0 0
   AND = 0 0 0 0 1 0 0 0   <- only the lowest set bit remains`
        },
        {
          lang: 'rust',
          src: `fn is_power_of_two(x: u32) -> bool {
    x != 0 && x & (x - 1) == 0          // exclude 0, then the one-bit test
}

fn lowest_set_bit(x: u32) -> u32 {
    x & x.wrapping_neg()                 // x & (-x), unsigned-safe
}

fn main() {
    assert!(is_power_of_two(8));
    assert!(!is_power_of_two(12));
    assert!(!is_power_of_two(0));

    // std even has a built-in for the common check:
    assert!(16u32.is_power_of_two());

    assert_eq!(lowest_set_bit(0b0101_1000), 0b0000_1000); // isolate it
    assert_eq!(0b0101_1000u32 & (0b0101_1000 - 1), 0b0101_0000); // pop it
}`
        }
      ]
    },
    {
      heading: 'Enumerating subsets with a bitmask, and Rust integer safety',
      body: `A set of n items has exactly two to the power n subsets, because each item is independently either in or out. That "in or out per item" is a row of n bits, so we can represent every subset as an n-bit number and enumerate *all* subsets by simply counting from 0 up to two-to-the-n minus one. Bit j of the counter says whether item j is in the current subset. This **bitmask enumeration** is the cleanest way to brute-force every combination, and it underlies subset-sum, the traveling salesman dynamic program, and many other problems.

The loop is tiny: run a counter mask from 0 to (1 << n) minus 1, and for each value inspect its bits to decide which items belong to that subset. To list the chosen items you test each bit position with the get idiom from earlier, or you peel off set bits with trailing_zeros. The cost is two-to-the-n subsets times up to n work each, which is exponential, so this technique is only practical for small n (roughly twenty or fewer items), but within that range it is unbeatably simple. The real-world echo is **fast set membership**: representing a small set as a single integer lets union become OR, intersection become AND, and membership become a single AND, all in one machine instruction.

Finally, the Rust-specific discipline that keeps all of this correct. Rust integers are **fixed width** and Rust refuses to silently wrap on overflow: in debug builds an overflowing add or shift *panics* so you catch the bug, and in release builds it wraps (which is its own surprise). When wrapping is genuinely what you want, you ask for it explicitly. The **wrapping_** methods (wrapping_add, wrapping_sub, wrapping_neg, wrapping_shl) wrap around the width on purpose. The **checked_** methods return an Option that is None on overflow so you can handle it. The **overflowing_** methods return the wrapped value plus a bool telling you whether it overflowed. And a crucial Rust gotcha for bit work: **usize cannot go negative**, so subtracting below zero or shifting by too much is a real error, not a quiet negative number the way it might be in C.

### Common pitfalls

- Writing 1 << n for the loop bound when n could be 32 or more for a u32. The bound 1 << n overflows; size the type to the problem (1u64 << n) or assert n is small.
- Subtracting from a usize index without checking it is non-zero. usize is unsigned, so i - 1 when i is 0 underflows and panics in debug; restructure the loop or use checked_sub.
- Relying on release-mode wrapping as if it were defined behavior. It is defined (two's complement wrap), but it is almost never what you meant; use the explicit wrapping_ methods so the intent is visible and debug builds agree with release.`,
      code: [
        {
          lang: 'text',
          src: `All subsets of {a, b, c} as 3-bit masks (bit0=a, bit1=b, bit2=c):

   mask  bits   subset        mask  bits   subset
   ----  ----   --------      ----  ----   --------
    0    0 0 0  { }            4    1 0 0  { c }
    1    0 0 1  { a }          5    1 0 1  { a, c }
    2    0 1 0  { b }          6    1 1 0  { b, c }
    3    0 1 1  { a, b }       7    1 1 1  { a, b, c }

   8 subsets = 2^3.  Counting 0..2^n enumerates EVERY subset once.

   Set algebra in one instruction each:
     A = {a,c} = 101    B = {b,c} = 110
     union     A | B = 111 = {a,b,c}
     intersect A & B = 100 = {c}
     a in A ?  A & (1<<0) = 001 -> non-zero -> yes`
        },
        {
          lang: 'rust',
          src: `fn all_subsets(items: &[char]) -> Vec<Vec<char>> {
    let n = items.len();
    let mut out = Vec::new();
    for mask in 0u32..(1 << n) {          // n small: 0 .. 2^n
        let mut subset = Vec::new();
        for j in 0..n {
            if mask & (1 << j) != 0 {     // is item j in this subset?
                subset.push(items[j]);
            }
        }
        out.push(subset);
    }
    out
}

fn main() {
    let subsets = all_subsets(&['a', 'b', 'c']);
    assert_eq!(subsets.len(), 8);         // 2^3 subsets

    // Rust's explicit overflow handling for bit arithmetic:
    assert_eq!(255u8.wrapping_add(1), 0);     // wraps on purpose
    assert_eq!(255u8.checked_add(1), None);   // signals overflow
    assert_eq!(255u8.overflowing_add(1), (0, true)); // value + did-overflow

    // usize is unsigned: guard subtractions instead of going negative.
    let i: usize = 0;
    assert_eq!(i.checked_sub(1), None);   // no negative usize; returns None
}`
        }
      ]
    }
  ],
  takeaways: [
    'An integer is a fixed-width row of bits; each position has a weight that is a power of two, and you always choose the width in Rust (u8, u32, i64).',
    'Two\'s complement gives the most significant bit a negative weight, which is why -1 is all ones and why bitwise NOT of x equals minus x minus one.',
    'AND masks bits off, OR turns bits on, XOR toggles and finds differences, NOT flips every bit; & | are bitwise while && || are logical on bool.',
    'Left shift multiplies by a power of two and fills zeros; right shift fills zeros on unsigned but copies the sign bit on signed; never shift by the full width.',
    'The four one-bit idioms: get x & (1<<k), set x | (1<<k), clear x & !(1<<k), toggle x ^ (1<<k); forgetting the NOT in clear is the classic bug.',
    'count_ones is popcount, trailing_zeros is the index of the lowest set bit, leading_zeros locates the highest; all return the full width for input 0.',
    'XOR cancels pairs: fold an array to find the unpaired value, cancel indices against values to find a missing number, all in one pass and O(1) space.',
    'x & (x-1) clears the lowest set bit, so x != 0 && x & (x-1) == 0 tests for a power of two; x & x.wrapping_neg() isolates the lowest set bit.',
    'Count 0 to 2^n minus 1 to enumerate every subset; sets as integers make union OR, intersection AND, and membership a single AND.',
    'Rust integers panic on overflow in debug; use wrapping_, checked_, and overflowing_ to be explicit, and remember usize can never go negative.'
  ],
  cheatsheet: [
    { label: 'x & y, x | y, x ^ y, !x', value: 'AND (mask off), OR (turn on), XOR (toggle/diff), NOT (flip all)' },
    { label: 'x << k', value: 'shift left k, fills zeros, multiply by 2^k; O(1)' },
    { label: 'x >> k', value: 'shift right: zero-fill (unsigned), sign-fill (signed); divide by 2^k' },
    { label: '1u32 << k', value: 'the k-th bit alone; the workhorse single-bit mask' },
    { label: 'x & (1 << k) != 0', value: 'GET: is bit k set? O(1)' },
    { label: 'x | (1 << k)', value: 'SET bit k to 1; O(1)' },
    { label: 'x & !(1 << k)', value: 'CLEAR bit k to 0 (note the !); O(1)' },
    { label: 'x ^ (1 << k)', value: 'TOGGLE bit k; XOR is its own inverse' },
    { label: 'x.count_ones()', value: 'population count (number of set bits); 1 CPU instr' },
    { label: 'x.trailing_zeros()', value: 'index of lowest set bit; returns width if x==0' },
    { label: 'x.leading_zeros()', value: 'zeros above highest set bit; returns width if x==0' },
    { label: 'x != 0 && x & (x-1) == 0', value: 'power-of-two test (or x.is_power_of_two())' },
    { label: 'x & x.wrapping_neg()', value: 'isolate lowest set bit = x & (-x)' },
    { label: 'wrapping_/checked_/overflowing_', value: 'explicit overflow: wrap / Option None / (value,bool)' }
  ]
}

export default note
