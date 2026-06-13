import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch15-t-001',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Odometer Rolls Over',
    prompt: `A u8 (unsigned 8-bit integer) can only hold the values 0 through 255, like a tiny odometer that resets after 255. You write this in a release build:

let a: u8 = 250;
let b = a.wrapping_add(10);

What value does b hold, and explain in words why the answer is not 260?`,
    hints: [
      'A u8 cannot store 260; the value that does not fit "wraps around".',
      'Wrapping is arithmetic modulo 256 (the number of distinct u8 values).',
    ],
    solution: `b holds 4. A u8 is a fixed box of 8 bits, so it can only represent 256 distinct values, 0 through 255. The true sum 250 + 10 = 260 does not fit, and wrapping_add deliberately lets it roll over like an odometer that resets after 999. Concretely the value wraps around modulo 256: 260 - 256 = 4. This is the same thing that happens silently on plain "+" in a release build, which is exactly why Rust gives you wrapping_add to say "I want the roll-over on purpose."`,
    tags: ['overflow', 'wrapping'],
  },
  {
    id: 'ds-ch15-t-002',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why 0usize Minus 1 Is a Trap',
    prompt: `A first-year writes a loop and computes the length of an empty list as a usize, then subtracts one:

let len: usize = 0;
let last = len - 1;

In a debug build this line crashes. Why? And what is the safe way to ask "len minus one" that tells you when it would go below zero?`,
    hints: [
      'usize is an unsigned type, used for lengths and indices.',
      'An unsigned integer cannot represent a negative number; there is a checked method that returns an Option.',
    ],
    solution: `usize is unsigned, meaning it can only hold values from 0 upward and can never go negative. Computing 0 - 1 would need the value -1, which a usize cannot represent, so in a debug build Rust panics (crashes with a clear message) instead of producing a wrong answer; in a release build it would silently wrap to a gigantic number near the type's maximum, which is even more dangerous. The safe way is len.checked_sub(1), which returns None when the subtraction would go below zero and Some(value) otherwise. This is why subtracting one from a length or index inside a loop bites so many beginners.`,
    tags: ['usize', 'overflow', 'checked'],
  },
  {
    id: 'ds-ch15-t-003',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Hand-Trace the Euclidean Algorithm',
    prompt: `The Euclidean algorithm repeatedly replaces the pair (a, b) with (b, a mod b) until b reaches 0, at which point a is the answer. Trace it by hand for gcd(54, 24): write each (a, b) pair and the remainder at every step, and give the final gcd.`,
    hints: [
      'At each step compute a mod b (the remainder), then the new pair is (b, that remainder).',
      'Stop when the second number becomes 0; the first number is your answer.',
    ],
    solution: `Step 1: (a, b) = (54, 24), and 54 mod 24 = 6, so the next pair is (24, 6). Step 2: (a, b) = (24, 6), and 24 mod 6 = 0, so the next pair is (6, 0). Now b is 0, so the loop stops and the answer is a = 6. So gcd(54, 24) = 6. Sanity check: 54 = 6 times 9 and 24 = 6 times 4, and 6 is the largest number dividing both. Notice it took only a couple of steps; that is the O(log(min(a, b))) speed of Euclid, far better than testing every candidate down from 24.`,
    tags: ['gcd', 'euclidean', 'trace'],
  },
  {
    id: 'ds-ch15-t-004',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Divide Before You Multiply for LCM',
    prompt: `Both of these are correct pure-math formulas for the least common multiple:

    A:  a * b / gcd(a, b)
    B:  a / gcd(a, b) * b

For very large a and b, one of them can give a wrong answer in Rust while the other stays correct. Which one is dangerous, and what exactly goes wrong?`,
    hints: [
      'Think about the size of the intermediate value each version computes first.',
      'One version forms the full product a * b before dividing.',
    ],
    solution: `Version A is dangerous. It computes the full product a * b first, and for inputs near a billion that product is near 10-to-the-18, which can overflow the integer type before the division ever shrinks it back down. Once an intermediate value overflows, the final result is wrong even though the true lcm would have fit comfortably. Version B avoids this by dividing first: because gcd(a, b) divides a exactly, a / gcd(a, b) is a clean smaller integer, and multiplying that by b keeps the largest intermediate value as small as possible. Same math, much smaller danger window, so always write lcm as a / gcd(a, b) * b.`,
    tags: ['lcm', 'overflow', 'gcd'],
  },
  {
    id: 'ds-ch15-t-005',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why sqrt(n) Divisors Are Enough',
    prompt: `To test whether n is prime, the note checks divisors only up to the square root of n instead of all the way up to n. For n = 36 (square root 6), the divisors pair up as 1 with 36, 2 with 18, 3 with 12, and 6 with 6. Using this pairing idea, explain why finding no divisor at or below the square root proves n is prime.`,
    hints: [
      'Every divisor d of n comes with a partner n / d.',
      'If both partners were larger than the square root, their product would exceed n.',
    ],
    solution: `Divisors come in pairs: if d divides n, then so does n / d, and the two multiply back to n. In any such pair, the two partners straddle the square root of n. They cannot both be larger than the square root, because then their product would be larger than n, a contradiction. So if n has any divisor at all (other than 1 and itself), at least one member of that pair is at or below the square root. Therefore, if you scan every candidate from 2 up to the square root and none divides n, no divisor exists anywhere, and n must be prime. This is why trial division costs only O(sqrt(n)) instead of O(n).`,
    tags: ['prime', 'trial-division', 'complexity'],
  },
  {
    id: 'ds-ch15-t-006',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why the Sieve Starts Crossing at p Times p',
    prompt: `In the Sieve of Eratosthenes, when we reach a prime p we start crossing out its multiples at p times p rather than at 2 times p. For example, when p = 5 we begin at 25, skipping 10, 15, and 20. Why is it safe to skip those smaller multiples, and what does this skipping save?`,
    hints: [
      'Think about which earlier prime already crossed out 10, 15, and 20.',
      'Every multiple of p below p times p has a smaller prime factor.',
    ],
    solution: `Every multiple of p that is smaller than p times p, such as 2p, 3p, up to (p-1)p, also has a factor smaller than p, so it was already crossed out when we processed that smaller prime. For p = 5: 10 was crossed by 2, 15 by 3, and 20 by 2. Crossing them again would be redundant work, so we jump straight to p times p, the first multiple of p whose other factor is not smaller than p. Skipping the earlier multiples does not change correctness; it just avoids repeated work and is part of why the sieve runs in O(n log log n), nearly linear.`,
    tags: ['sieve', 'prime', 'optimization'],
  },
  {
    id: 'ds-ch15-t-007',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Remainder With a Minus Sign',
    prompt: `A student expects a "number-theory" remainder that is always between 0 and 2, but Rust surprises them:

let r = -5i64 % 3;

What value does r hold, and which method would give the non-negative remainder a number theorist expects instead?`,
    hints: [
      "Rust's % keeps the sign of the dividend (the left operand).",
      'There is a method named after Euclid that always returns a non-negative remainder.',
    ],
    solution: `r holds -2, not 1. In Rust the % operator follows the sign of the dividend (the left-hand value), so since -5 is negative the remainder comes out negative: -5 = 3 times (-1) + (-2). For modular arithmetic you almost always want the non-negative remainder in the range 0 to m-1, and Rust gives you exactly that with rem_euclid: (-5i64).rem_euclid(3) returns 1. The rule of thumb from the note: whenever a value being reduced might be negative (subtractions are the usual cause), reach for rem_euclid instead of %.`,
    tags: ['modular-arithmetic', 'rem-euclid'],
  },
  {
    id: 'ds-ch15-t-008',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Choose the Right Overflow Method',
    prompt: `Rust gives four honest ways to handle a possible overflow: wrapping_add (roll over), checked_add (returns an Option), saturating_add (clamp at the max or min), and overflowing_add (returns the value plus a did-it-overflow flag). For each scenario below, name the single best method:

  1. A hash function where rolling over modulo the bit-width is exactly what you want.
  2. Adding two amounts where you must reliably detect and react when the total does not fit.
  3. A "downloads remaining" counter that should stick at its maximum instead of wrapping to 0.`,
    hints: [
      'Match each scenario to the behavior described in its parentheses.',
      'One returns an Option you can match on; one clamps; one rolls over.',
    ],
    solution: `1. wrapping_add. Hashing and checksums actually want the deliberate odometer roll-over modulo the bit-width, so wrapping is the right tool. 2. checked_add. It returns Some(value) when the sum fits and None when it overflows, so you can match on the Option and react when correctness depends on detecting overflow. 3. saturating_add. It clamps to the type's maximum instead of wrapping, so the counter "sticks" at the top rather than silently rolling back to 0. (overflowing_add would also work for case 2 if you want both the wrapped value and the flag in one call, but checked_add is the cleanest when you only need the success-or-failure answer.)`,
    tags: ['overflow', 'checked', 'wrapping'],
  },
  {
    id: 'ds-ch15-t-009',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Do Not Forget the Leftover Prime',
    prompt: `Here is a sketch of prime factorization that trial-divides candidates only up to the square root of n:

let mut d = 2;
while d * d <= n {
    while n % d == 0 { factors.push(d); n /= d; }
    d += 1;
}
// (loop ends here)

Run this in your head on n = 14. What does the code collect, what factor does it miss, and what one line fixes it?`,
    hints: [
      'After the loop, what value is left in n?',
      '14 = 2 times 7, and 7 is larger than the square root of 14.',
    ],
    solution: `For n = 14 the loop divides out the 2 (collecting one 2 and leaving n = 7), then increments d. Once d reaches 3, d times d = 9 is already greater than the current n = 7, so the loop stops with n still equal to 7. The code has collected only [2] and dropped the 7 entirely. The fix is to add, after the loop, the single line "if n > 1 { factors.push(n); }". This works because the loop strips every prime up to the square root of the original number, so whatever is left above 1 must itself be a single large prime, the final factor. The correct factorization of 14 is then [2, 7].`,
    tags: ['factorization', 'prime', 'pitfall'],
  },
  {
    id: 'ds-ch15-t-010',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Square Your Way Up: Trace Fast Power',
    prompt: `Binary exponentiation computes base to the power exp by looking at the exponent's bits from lowest to highest: keep a result starting at 1 and a base starting at the original value; at each step, if the current low bit is 1 multiply result by base, then square base and shift the exponent right by one. Trace this for 5 to the power 10 (10 in binary is 1010). Show, at each step, the low bit, whether you multiply, and the running result, then give the final answer and say how many multiply-or-square operations it used.`,
    hints: [
      '10 in binary is 1010, so reading low to high the bits are 0, 1, 0, 1.',
      'Only the steps where the low bit is 1 multiply the result in; the others just square the base.',
    ],
    solution: `Start result = 1, base = 5, exp = 10 (bits low-to-high: 0, 1, 0, 1).
Step 1: low bit 0, do not multiply; square base to 25; exp becomes 5. result = 1.
Step 2: low bit 1, multiply result by base 25, so result = 25; square base to 625; exp becomes 2.
Step 3: low bit 0, do not multiply; square base to 390625; exp becomes 1. result = 25.
Step 4: low bit 1, multiply result by base 390625, so result = 25 times 390625 = 9765625; exp becomes 0, stop.
Final answer: 5 to the power 10 = 9765625. It used only about 4 rounds (a handful of squarings and two multiplies) instead of 10 separate multiplications, which is the O(log exp) win of binary exponentiation.`,
    tags: ['exponentiation', 'binary-exponentiation', 'trace'],
  },
  {
    id: 'ds-ch15-t-011',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Reduce Early, Stay Small',
    prompt: `You must compute (123 times 456 times 789) mod 1000 but you are told the running value must never exceed a few thousand. The note says "mod distributes over multiplication," meaning you can take the remainder after every multiply. Use that to compute the answer step by step, keeping each intermediate value reduced, and state the final result.`,
    hints: [
      'After each multiplication, immediately take the value mod 1000 before multiplying again.',
      '(a times b) mod m equals ((a mod m) times (b mod m)) mod m.',
    ],
    solution: `Because mod distributes over multiplication, you may reduce after every step instead of forming the whole giant product. Step 1: 123 times 456 = 56088, and 56088 mod 1000 = 88. Step 2: take that 88 and multiply by 789 to get 69432, then 69432 mod 1000 = 432. So the answer is 432, and no intermediate value ever exceeded about seventy thousand, let alone the full product 44253432. This is exactly the trick behind "answer mod 1_000_000_007": reduce after every operation so the running numbers stay small and never overflow.`,
    tags: ['modular-arithmetic', 'distributivity'],
  },
  {
    id: 'ds-ch15-t-012',
    chapter: 15,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Dividing Under a Prime Modulus',
    prompt: `To compute "n choose k" modulo a prime p, you have the numerator n! and the denominator (k! times (n-k)!), both reduced mod p. A student writes the final step as a plain division:

answer = numerator / denominator % p

Explain why you cannot just divide two remainders like this, and describe the correct way to "divide" under a prime modulus, including the exact exponent you raise the denominator to.`,
    hints: [
      'Ordinary integer division of two remainders does not respect the modulus.',
      'Fermat\'s little theorem turns division into multiplication by a modular inverse.',
    ],
    solution: `You cannot divide remainders directly: the / operator on two reduced values does not give the value that, when multiplied by the denominator, returns the numerator modulo p, so the result is simply wrong. Under a prime modulus, dividing by x means multiplying by its modular inverse, the value inv(x) with x times inv(x) congruent to 1 mod p. Fermat's little theorem says that for a prime p and an x not divisible by p, x to the power (p - 1) is congruent to 1, so x to the power (p - 2) is the inverse. The correct step is therefore answer = numerator times pow_mod(denominator, p - 2, p) mod p. A common bug is using the exponent p - 1 instead of p - 2: p - 1 gives 1 (the identity), not the inverse you need.`,
    tags: ['modular-arithmetic', 'fermat', 'combinatorics'],
  },
]

export default problems
