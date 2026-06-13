import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch14-t-001',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Reading a Byte as Bits',
    prompt: `An integer is stored as a fixed row of switches (bits), and each position carries a weight that is a power of two: the rightmost bit is worth 1, then 2, 4, 8, and so on, doubling leftward.

Here is the bit pattern of a u8 (8 switches), most significant bit on the left:

    0 0 1 0 1 1 0 1

What decimal value does this byte hold, and how did you compute it?`,
    hints: [
      'Add up the weight of every position that holds a 1.',
      'The weights from right to left are 1, 2, 4, 8, 16, 32, 64, 128.',
    ],
    solution: `Read off the positions that hold a 1 and add their weights. From right to left the set bits are at weight 1, 4, 8, and 32 (the pattern 0010_1101). Adding those, 32 + 8 + 4 + 1 = 45, so the byte holds the decimal value 45. The trick is that binary works exactly like ordinary base ten, except each place is worth a power of two instead of a power of ten, so to read a binary number you just sum the weights of the switches that are on.`,
    tags: ['binary', 'bits', 'width'],
  },
  {
    id: 'ds-ch14-t-002',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'AND Versus OR in One Column',
    prompt: `The bitwise operators work one column at a time. For each pair of input bits, AND (written with a single ampersand) gives 1 only when both inputs are 1, and OR (written with a single vertical bar) gives 1 when either input is 1.

Take a = 0b1100 and b = 0b1010. Predict the value of a AND b and the value of a OR b, written in binary.`,
    hints: [
      'Line the two numbers up and compare them column by column.',
      'AND keeps a bit only where BOTH have a 1; OR keeps a bit where EITHER has a 1.',
    ],
    solution: `Line up the columns: a is 1100 and b is 1010. For AND, a column is 1 only when both are 1, which happens only in the leftmost column, so a AND b is 1000 (decimal 8). For OR, a column is 1 when either is 1, which is true in the three leftmost columns, so a OR b is 1110 (decimal 14). AND is the tool for masking bits off because anything ANDed with 0 becomes 0, and OR is the tool for turning bits on because anything ORed with 1 becomes 1.`,
    tags: ['bits', 'and-or', 'feature-flags'],
  },
  {
    id: 'ds-ch14-t-003',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why -1 Is All Ones',
    prompt: `In an i8 (an 8-bit signed integer), the bit pattern 1111_1111 represents the value -1, not 255. Using the rule that two's complement gives the most significant bit a negative weight, explain why.`,
    hints: [
      'For a signed 8-bit number the top bit is worth minus 128 instead of plus 128.',
      'Add up all the weights of the set bits with that one sign change.',
    ],
    solution: `Two's complement keeps every bit's normal positive weight except the most significant bit, whose weight becomes negative. For an i8 the top bit is worth -128 instead of +128. With all eight bits set you add -128 + 64 + 32 + 16 + 8 + 4 + 2 + 1, and those positive weights sum to 127, so the total is -128 + 127 = -1. The exact same row of bits read as a u8 (where the top bit is +128) sums to 255 instead. So the value is decided entirely by the type: same switches, different interpretation. This is also why the top bit doubles as a sign bit, since it is set exactly when the number is negative.`,
    tags: ['twos-complement', 'signed', 'bits'],
  },
  {
    id: 'ds-ch14-t-004',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Off-by-a-NOT Clear Bug',
    prompt: `A student wants to clear (force to 0) bit k of a u32 named x and writes:

    let result = x & (1 << k);

They report that instead of clearing the bit, this almost always returns 0 or a single bit. What did they actually compute, and what is the correct expression to clear bit k?`,
    hints: [
      'ANDing with a single-bit mask keeps only that one position and zeros everything else.',
      'Clearing needs a mask that is all ones except a single zero at position k.',
    ],
    solution: `Writing x AND (1 << k) does not clear bit k, it isolates it: the mask 1 << k has a single 1 at position k and 0s everywhere else, so ANDing keeps only that one column of x and forces every other bit to 0. The result is therefore either 0 (if bit k was clear) or the lone value of that bit (if it was set). To actually clear bit k you must AND with the inverse mask, all ones except a single 0 at position k, written x & !(1 << k). The bitwise NOT flips the single-bit mask into "everything but bit k", so ANDing leaves every other bit alone and forces the target to 0. Forgetting that NOT is the single most common bit bug.`,
    tags: ['bits', 'clear-bit', 'masks'],
  },
  {
    id: 'ds-ch14-t-005',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Left Shift as Multiplication',
    prompt: `Left shift (written with two less-than signs) slides every bit toward the most significant end, feeding zeros in on the right. The note says shifting left by k multiplies the value by two to the power k.

Without running code, predict the value of 3u32 << 4, and explain in one sentence why a left shift behaves like a multiplication.`,
    hints: [
      'Shifting left by k multiplies by two to the power k.',
      'Two to the power four is sixteen.',
    ],
    solution: `Shifting 3 left by 4 multiplies it by two to the power 4, which is 16, so 3 << 4 is 48. A left shift behaves like multiplication because moving every bit one position to the left doubles each bit's weight, exactly the way appending a zero on the right of a decimal number multiplies it by ten; shifting by k positions therefore multiplies by two k times, that is by two to the power k.`,
    tags: ['bits', 'shift', 'multiply'],
  },
  {
    id: 'ds-ch14-t-006',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Signed Right Shift Surprise',
    prompt: `Right shift (written with two greater-than signs) behaves differently depending on the type. A classmate claims that for any number, x >> 1 just throws away the lowest bit and pads a 0 on the left.

They test 200u8 >> 1 and get 100, which matches. Then they test -8i8 >> 1 and get -4 instead of a large positive number. Explain why the signed case does not pad with zeros.`,
    hints: [
      'On unsigned types right shift fills the top with zeros (a logical shift).',
      'On signed types right shift copies the sign bit (an arithmetic shift) so the number stays negative.',
    ],
    solution: `The classmate's rule is only correct for unsigned types. For an unsigned u8, right shift is a logical shift that feeds 0s in on the left, so 200 >> 1 is 100 (a clean divide by two). For a signed type Rust performs an arithmetic shift that feeds in copies of the sign bit instead of zeros, so a negative number stays negative. The pattern for -8i8 is 1111_1000; shifting right by one and copying the sign bit gives 1111_1100, which is -4, exactly minus eight divided by two. If they had padded zeros instead, the top bit would clear and the value would jump to a large positive number, which would be wrong arithmetic. The single rule to remember: right shift fills with zeros on unsigned, but copies the sign bit on signed.`,
    tags: ['bits', 'shift', 'signed'],
  },
  {
    id: 'ds-ch14-t-007',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Tracing the XOR Single-Number Fold',
    prompt: `Every value in an array appears exactly twice except one. Folding the whole array together with XOR (written with a caret) leaves only the unpaired value, because a number XORed with itself is 0 and a number XORed with 0 is unchanged.

Hand-trace the running accumulator (start it at 0) for the array [4, 1, 2, 1, 2], one element at a time, and state the final result.`,
    hints: [
      'Carry an accumulator and XOR each element into it in turn.',
      'Pairs cancel because anything XORed with itself is 0; order does not matter.',
    ],
    solution: `Start acc at 0 and XOR in each element. After 4: acc is 4. After 1: acc is 4 ^ 1 = 5. After 2: acc is 5 ^ 2 = 7. After the second 1: acc is 7 ^ 1 = 6, which has cancelled the earlier 1. After the second 2: acc is 6 ^ 2 = 4, which has cancelled the earlier 2. The final result is 4, the unpaired number. Because XOR is commutative and associative, the two 1s cancel to 0 and the two 2s cancel to 0 no matter where they sit in the array, leaving only the loner. This runs in one linear pass using a single integer of memory, replacing a whole hash set. It only works when every other value appears an even number of times.`,
    tags: ['xor', 'single-number', 'bits'],
  },
  {
    id: 'ds-ch14-t-008',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'The Zero Corner of trailing_zeros',
    prompt: `The method trailing_zeros returns the index of the lowest set bit, which is handy for iterating over set bits. A student writes a loop that, for a u32 value x, computes the lowest set bit's index with x.trailing_zeros() and then shifts something by that amount.

Their code works for every test value except one, where it panics in a debug build. Which input triggers the panic, and why?`,
    hints: [
      'Think about what trailing_zeros returns when there is no set bit at all.',
      'Recall that shifting a u32 by 32 or more is rejected.',
    ],
    solution: `The failing input is x = 0. When the value has no set bit, trailing_zeros has nothing to stop the count, so it returns the full width of the type, which is 32 for a u32 (leading_zeros does the same on 0). The student then uses that 32 as a shift amount, but shifting a u32 by 32 or more is out of range; in a debug build Rust treats it as a bug and panics rather than producing nonsense. The fix is to handle the zero case explicitly before using the returned count as a shift or index, for example by checking x != 0 first. This zero corner is a recurring trap whenever a bit-position result is fed straight into a shift.`,
    tags: ['bits', 'trailing-zeros', 'shift'],
  },
  {
    id: 'ds-ch14-t-009',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why the Power-of-Two Test Needs a Zero Guard',
    prompt: `A power of two has exactly one bit set, and the one-line test x & (x - 1) == 0 captures this because subtracting one clears the lowest set bit and lights up everything below it. A learner ships this for a u32:

    fn is_pow2(x: u32) -> bool { x & (x - 1) == 0 }

Name the two distinct problems with this function (one is a logic mistake, one is a runtime crash), and give the corrected expression.`,
    hints: [
      'Try the value x = 0 in the formula on paper.',
      'Separately, think about what x - 1 does to an unsigned 0 at runtime.',
    ],
    solution: `There are two problems, both centered on x = 0. The logic mistake: 0 has no bits set, so it is not a power of two, yet 0 & (0 - 1) evaluates to 0 and the test wrongly reports true. The runtime crash: for an unsigned u32, computing 0 - 1 underflows below zero, which panics in a debug build (usize and the other unsigned types can never go negative). Both are fixed by guarding against zero first: x != 0 && x & (x - 1) == 0. The short-circuit && evaluates x != 0 first, so when x is 0 the function returns false immediately and never reaches the underflowing subtraction. Rust's standard library also offers x.is_power_of_two() which handles this for you.`,
    tags: ['bits', 'power-of-two', 'overflow'],
  },
  {
    id: 'ds-ch14-t-010',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Counting Subset Masks',
    prompt: `A set of n items can be enumerated by counting an integer mask from 0 up through (1 << n) minus 1, where bit j of the mask says whether item j is in the current subset.

Two questions: (a) For a set of 4 items, how many subsets does the loop visit, and what is the largest mask value it reaches? (b) Why is this technique only practical for small n, say roughly twenty items or fewer?`,
    hints: [
      'Each item is independently in or out, so the count is a power of two.',
      'The mask runs from 0 to that count minus one; think about how the total grows with n.',
    ],
    solution: `(a) A set of 4 items has two to the power 4 subsets, which is 16, because each item is independently in or out. The loop visits all 16 masks, running from 0 up to 16 minus 1, so the largest mask value is 15 (binary 1111, the full set). (b) The technique is only practical for small n because the number of subsets is two to the power n, which doubles every time you add one item. That exponential growth means around 20 items already gives about a million subsets, and a few more items quickly becomes billions, far too many to enumerate. So bitmask enumeration is unbeatably simple within roughly twenty items but explodes beyond that.`,
    tags: ['bitmask', 'subsets', 'enumeration'],
  },
  {
    id: 'ds-ch14-t-011',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'XOR Missing Number Versus Sum',
    prompt: `Given the numbers 0 through n with exactly one missing, two approaches find the gap. The sum approach adds the expected total 0 + 1 + ... + n and subtracts the actual array sum. The XOR approach XORs all indices 0 through n together with all array elements; matching values cancel and only the missing index survives.

For very large n the sum approach can fail where the XOR approach does not. Explain what goes wrong with the sum approach, and why XOR avoids it.`,
    hints: [
      'Think about how big the expected total gets and what fixed-width integers do when a value gets too big.',
      'Consider whether XOR can ever produce a result outside the type width.',
    ],
    solution: `The sum approach can overflow. The expected total 0 + 1 + ... + n grows roughly like n squared over two, and for a large n that intermediate sum can exceed the maximum value the fixed-width integer can hold. Rust integers are fixed width and overflow is a real event: in a debug build the add panics, and in a release build it silently wraps, either of which corrupts the answer. The XOR approach never overflows because XOR combines bits position by position and can only ever produce a value that already fits within the same width, no value ever grows beyond the type. So XOR finds the missing number in a single linear pass with one integer of state and no overflow risk, which is why the note prefers it over the sum-and-subtract method.`,
    tags: ['xor', 'missing-number', 'overflow'],
  },
  {
    id: 'ds-ch14-t-012',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Isolating Versus Clearing the Lowest Set Bit',
    prompt: `Two famous one-liners both involve the lowest set bit but do opposite things:

    isolate:  x & x.wrapping_neg()
    clear:    x & (x - 1)

Take x = 0b0101_1000 (binary). Predict the result of each expression in binary, and explain in words how each one ends up keeping or removing exactly the lowest set bit.`,
    hints: [
      'For x = 0b0101_1000 the lowest set bit sits at position 3 (value 0b0000_1000).',
      'Work out x - 1 and the two\'s complement negation of x, then AND each with x.',
    ],
    solution: `For x = 0b0101_1000 the lowest set bit is at position 3, the value 0b0000_1000. Isolate: the two's complement negation flips every bit and adds one, which inverts everything above the lowest set bit while leaving that bit and the zeros below it as the carry restores them; ANDing x with its negation therefore keeps only that lowest set bit, giving 0b0000_1000. Clear: subtracting one borrows through the trailing zeros, turning the lowest 1 into 0 and the zeros below it into 1s, so x - 1 is 0b0101_0111; ANDing with x then drops the lowest set bit and leaves the higher bits untouched, giving 0b0101_0000. So the same starting value gives 0b0000_1000 when you isolate the lowest set bit and 0b0101_0000 when you clear it; isolating keeps just that bit, clearing removes just that bit. The clear form is exactly the "pop the lowest bit" move used to iterate over set bits one at a time.`,
    tags: ['bits', 'lowest-set-bit', 'twos-complement'],
  },
]

export default problems
