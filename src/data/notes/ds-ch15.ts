import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-15',
  track: 'dsa',
  chapter: 15,
  title: 'Math & Number Theory',
  summary: `Almost every algorithm course eventually hits a wall of pure arithmetic: simplify a fraction, test whether a number is prime, list every prime below a million, or compute a giant power without your integers exploding. These are the building blocks of cryptography, hashing, random-number generators, and a huge fraction of competitive-programming problems. This chapter is a guided tour of the number theory a first-year actually needs, taught entirely in Rust, where the language refuses to hide an overflow from you and instead hands you an honest toolkit (wrapping, checked, saturating, overflowing) to choose your behaviour on purpose.

We start with what an integer really is on a machine and what happens when it overflows, because that single fact shapes every formula that follows. Then we climb the classic ladder: the Euclidean algorithm for greatest common divisor and the overflow-safe least common multiple, primality testing and the Sieve of Eratosthenes, prime factorization, modular arithmetic with the famous one-billion-seven modulus, fast binary exponentiation, and a first taste of factorials and combinations. By the end you will read a formula like "answer mod 1_000_000_007" and know exactly why it is there and how to compute it correctly even when negatives and huge powers are involved.`,
  sections: [
    {
      heading: 'Integers on a real machine: overflow and Rust\'s honest toolkit',
      body: `A mathematician\'s integer is infinite. A computer\'s integer is a fixed box of bits. A **u8** holds values 0 through 255, an **i32** holds about plus or minus two billion, an **i64** about plus or minus nine quintillion. When a result does not fit in the box, the high bits fall off the top and you get a *wrong* answer. This is called **integer overflow**, and it is the single most common bug in number-theory code.

Picture an odometer on an old car with three wheels: it shows 000 to 999. Drive one more mile past 999 and it rolls over to 000, not 1000. The hundreds digit it would need does not exist, so it silently vanishes. Fixed-size integers do exactly this in base two: the value *wraps around* modulo two-to-the-bit-width.

Most languages let this happen quietly. Rust is unusually honest about it. In a **debug** build, ordinary plus or times on integers will *panic* (crash with a clear message) the instant a result overflows, so you find the bug immediately. In a **release** build, for speed, it silently wraps. Because relying on either implicit behaviour is dangerous, Rust gives you four explicit families of methods so you say exactly what you mean:

- **wrapping_add / wrapping_mul** — wrap around like the odometer, on purpose. This is what you want for hashing and checksums.
- **checked_add / checked_mul** — return an **Option**: Some(value) if it fit, None if it overflowed. Use this to detect overflow and react.
- **saturating_add / saturating_mul** — clamp to the type\'s maximum or minimum instead of wrapping. Great for counters that should "stick" at the top.
- **overflowing_add / overflowing_mul** — return a tuple (value, did_it_overflow_bool) so you get both at once.

The other half of the fix is **choosing a bigger box**. If intermediate products might exceed two billion, reach for **i64** or **u64**; if even nine quintillion is not enough (it often is not when you multiply two near-billion numbers), reach for **u128**. A number-theory rule of thumb: the moment you multiply two values that could each be around a billion, the product needs more than 60 bits, so cast to i64/u64 *before* the multiply, or use u128.

### Common pitfalls

- Doing the math in i32 "because the inputs are small" and then multiplying two of them. The inputs fit; their product does not. Widen *before* the multiply, not after.
- Assuming a release build will catch overflow the way your debug tests did. It will not; it wraps silently. Use checked_ methods where correctness depends on detecting overflow.
- Subtracting on **usize** (the type of lengths and indices). usize is unsigned and cannot go negative, so 0usize minus 1 panics in debug and wraps to a gigantic number in release. This bites every first-year who writes i - 1 in a loop.`,
      code: [
        {
          lang: 'text',
          src: `A u8 box holds 0..=255. Watch 250 + 10 "wrap" like an odometer:

      250            wrapping_add(10)             4
   +----------+        ---------->         +----------+
   |11111010  |   the top bit falls off    |00000100  |   = 4
   +----------+   (256 does not fit)        +----------+
        ^                                        ^
   250 in binary                           250+10 = 260, 260-256 = 4

The four honest choices for 250u8 "+" 10u8:

   method            result            meaning
   ------            ------            -------
   wrapping_add  ->  4                 roll over (mod 256)
   checked_add   ->  None              "it did not fit"
   saturating_add -> 255               clamp at the max
   overflowing_add-> (4, true)         value + "yes it overflowed"`
        },
        {
          lang: 'rust',
          src: `fn main() {
    let a: u8 = 250;

    // 1) wrapping: deliberate odometer roll-over (mod 256).
    assert_eq!(a.wrapping_add(10), 4);

    // 2) checked: Option tells you whether it fit.
    assert_eq!(a.checked_add(10), None);     // overflow detected
    assert_eq!(a.checked_add(5), Some(255)); // fits exactly

    // 3) saturating: clamp at the boundary instead of wrapping.
    assert_eq!(a.saturating_add(10), 255);

    // 4) overflowing: value AND a "did it overflow?" flag.
    assert_eq!(a.overflowing_add(10), (4, true));

    // Choosing a bigger box: multiply two near-billion numbers.
    let x: u64 = 1_000_000_000;
    let big: u128 = (x as u128) * (x as u128); // widen BEFORE multiply
    println!("{big}"); // 1_000_000_000_000_000_000, never overflows

    // usize cannot go negative — this is the classic trap:
    let len: usize = 0;
    // let bad = len - 1;        // panics in debug, wraps in release
    assert_eq!(len.checked_sub(1), None); // the safe way to ask
}`
        }
      ]
    },
    {
      heading: 'Greatest common divisor: the Euclidean algorithm',
      body: `The **greatest common divisor** (gcd) of two numbers is the largest integer that divides both with no remainder. You met it in grade school for simplifying fractions: to reduce 84 over 60, divide both by gcd(84, 60) = 12 and get 7 over 5. That is the real-world picture to hold: **gcd is the fraction-simplifier**, and it shows up anywhere two periodic things must line up (gears, calendars, audio sample rates).

The slow, obvious way: try every candidate from the smaller number down to 1 and return the first that divides both. That is **O(n)** time where n is the smaller value, because you may test almost every integer below it. Painfully slow for big inputs.

The smart way is over two thousand years old: the **Euclidean algorithm**. Its insight is a single beautiful fact: any common divisor of a and b also divides their remainder a mod b. So gcd(a, b) equals gcd(b, a mod b), and since the remainder shrinks fast, we reach gcd(x, 0) = x in a handful of steps. The running time is **O(log(min(a, b)))** — logarithmic, essentially the number of digits, which is why it is instant even on enormous numbers.

Read the recurrence out loud: "the gcd of a and b is the gcd of b and the leftover when you divide a by b; keep going until the leftover is zero, then the other number is your answer." In Rust this is four lines, iterative (no recursion needed, so no stack-depth worry), using a tuple swap that the language makes elegant.

### Common pitfalls

- Forgetting the base case is "second argument is 0", at which point the answer is the *first* argument. gcd(x, 0) = x, and gcd(0, 0) is conventionally 0.
- Using the slow trial loop on large inputs in a contest and timing out. Always use Euclid.
- Writing it recursively and worrying about deep recursion — the iterative loop sidesteps that entirely and is just as short in Rust.`,
      code: [
        {
          lang: 'text',
          src: `Trace gcd(48, 18) — each step replaces (a, b) with (b, a mod b):

   step    a    b    a mod b      what we do next
   ----   ---  ---   -------      ---------------
    1      48   18      12        (a,b) <- (18, 12)
    2      18   12       6        (a,b) <- (12,  6)
    3      12    6       0        (a,b) <- ( 6,  0)
    4       6    0      ---       b is 0 -> answer is a = 6

So gcd(48, 18) = 6.  Sanity check: 48 = 6*8, 18 = 6*3, and
6 is the biggest number dividing both.  Only 4 steps, not 18!`
        },
        {
          lang: 'rust',
          src: `// Euclidean algorithm: O(log(min(a, b))) time, O(1) space.
fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        // Replace (a, b) with (b, a % b). The tuple swap does both at once.
        let r = a % b;
        a = b;
        b = r;
    }
    a // when b hit 0, a holds the gcd
}

fn main() {
    assert_eq!(gcd(48, 18), 6);
    assert_eq!(gcd(84, 60), 12);
    assert_eq!(gcd(17, 5), 1);   // coprime: only common divisor is 1
    assert_eq!(gcd(9, 0), 9);    // base case

    // Simplify the fraction 84/60 by dividing out the gcd.
    let (num, den) = (84u64, 60u64);
    let g = gcd(num, den);
    println!("{}/{} = {}/{}", num, den, num / g, den / g); // 84/60 = 7/5
}`
        }
      ]
    },
    {
      heading: 'Least common multiple: small formula, big overflow trap',
      body: `The **least common multiple** (lcm) of two numbers is the smallest positive integer that *both* divide. Picture two blinking lights, one every 4 seconds and one every 6 seconds: they blink together every lcm(4, 6) = 12 seconds. Anywhere two cycles must re-sync — gears completing a turn, two cron jobs colliding, the calendar week meeting the month — lcm is the answer.

There is a gorgeous identity linking the two: for positive a and b, **a times b equals gcd(a, b) times lcm(a, b)**. Rearranged, lcm(a, b) = a * b / gcd(a, b). Once you have gcd, lcm is free.

But here is the trap that the chapter on overflow was preparing you for. If you compute a * b *first* and then divide by the gcd, the intermediate product a * b can overflow even when the final lcm fits comfortably. Two numbers near a billion have a product near 10-to-the-18, which overflows a 32-bit type instantly and even flirts with the edge of u64.

The fix is to **divide before you multiply**: write it as a / gcd(a, b) * b. Because gcd(a, b) divides a exactly, a / g is a clean integer, and multiplying *that* smaller number by b keeps the intermediate value as small as possible. The result is identical math, but the danger window for overflow shrinks dramatically. Internalize this ordering — it is a recurring trick: when an expression is (big * big) / something, see if the divisor cancels one factor first.

### Common pitfalls

- Writing a * b / gcd(a, b). Correct in pure math, but the product overflows for large inputs. Always write a / gcd(a, b) * b instead.
- lcm with a zero operand is conventionally 0; guard against dividing by gcd(0, 0) which is 0.
- Even with the safe ordering, the final lcm might not fit in the type — widen to u64 or u128 if the inputs are large.`,
      code: [
        {
          lang: 'text',
          src: `Two lights blink at periods 4 and 6. When do they align?

  light A (period 4):  X---X---X---X---X---X---X---
  light B (period 6):  X-----X-----X-----X-----X---
  both together:       X-----------X-----------X---
                       0           12          24
                                   ^
                       lcm(4,6) = 4*6 / gcd(4,6) = 24 / 2 = 12

Overflow-safe ordering for lcm(a, b):

   UNSAFE:  (a * b) / g     a*b can overflow first  ->  WRONG
   SAFE:    (a / g) * b     a/g is exact & smaller  ->  fits longer`
        },
        {
          lang: 'rust',
          src: `fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 { let r = a % b; a = b; b = r; }
    a
}

// lcm via the identity, but DIVIDE before you MULTIPLY to dodge overflow.
fn lcm(a: u64, b: u64) -> u64 {
    if a == 0 || b == 0 { return 0; }
    a / gcd(a, b) * b   // NOT a * b / gcd(a, b)
}

fn main() {
    assert_eq!(lcm(4, 6), 12);
    assert_eq!(lcm(21, 6), 42);

    // Why the ordering matters: near-billion inputs.
    let a: u64 = 1_000_000_000;
    let b: u64 = 999_999_998;
    // a * b would be ~1e18 (risky); a/gcd*b keeps the product smaller.
    println!("lcm = {}", lcm(a, b)); // computes without overflow
}`
        }
      ]
    },
    {
      heading: 'Primality testing: is this one number prime?',
      body: `A **prime** is an integer greater than 1 whose only divisors are 1 and itself: 2, 3, 5, 7, 11, ... Everything else (above 1) is **composite**. Primes are the atoms of the integers — every number factors uniquely into primes — and they are the bedrock of public-key cryptography, where the security of RSA rests on it being easy to *multiply* two big primes but ruinously hard to *factor* the product back.

The brute-force test: to check if n is prime, try dividing it by every integer from 2 up to n minus 1. If any divides evenly, n is composite. That works but is **O(n)** — way too slow for big n.

The key optimization rests on a simple symmetry. If n = d times e and both d and e were larger than the square root of n, then d times e would exceed n — a contradiction. So at least one factor of any composite n is at most the square root of n. Therefore **we only need to test divisors up to sqrt(n)**: if none divides n, it is prime. That drops the cost to **O(sqrt(n))** — for a number near a billion, about 30000 checks instead of a billion.

Two more refinements halve the work again: handle 2 specially as the only even prime, then test only *odd* candidates 3, 5, 7, ... A subtle Rust detail: compare i * i against n rather than computing a floating-point square root, because floating point can be off by one at the boundary and i * i is exact. Just make sure i * i does not itself overflow — for large n, do the comparison in a wide enough type.

### Common pitfalls

- Forgetting that 0 and 1 are *not* prime, and that 2 *is*. Handle the small cases explicitly.
- Looping the divisor up to n instead of sqrt(n) — correct but quadratically slower; you will time out on big inputs.
- Using (n as f64).sqrt() as the loop bound: floating-point rounding can drop or add a boundary divisor. Prefer the integer test while i * i <= n, watching for overflow of i * i.`,
      code: [
        {
          lang: 'text',
          src: `Why testing up to sqrt(n) is enough — divisors come in PAIRS:

   n = 36, sqrt(36) = 6.  Every divisor d pairs with 36/d:

        d:   1    2    3    [6]    9    12   18   36
      36/d: 36   18   12    [6]    4     3    2    1
             \\----left of 6----/    \\---right of 6---/
              (small factors)        (mirror images)

   Each pair straddles 6. If no divisor exists at or below 6,
   none exists above it either. So checking 2..=6 settles it.

Trace is_prime(29):  sqrt(29) ~ 5.39, test odd d while d*d <= 29
   d=3 -> 29 % 3 = 2  (no)
   d=5 -> 29 % 5 = 4  (no)
   d=7 -> 7*7=49 > 29 -> STOP, no divisor found -> 29 is PRIME`
        },
        {
          lang: 'rust',
          src: `// Trial division up to sqrt(n): O(sqrt(n)) time, O(1) space.
fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }      // 0 and 1 are not prime
    if n < 4 { return true; }       // 2 and 3 are prime
    if n % 2 == 0 { return false; } // even and > 2 -> composite

    let mut i = 3u64;
    // i * i <= n is the integer-exact way to say i <= sqrt(n).
    while i * i <= n {
        if n % i == 0 { return false; }
        i += 2; // only odd candidates
    }
    true
}

fn main() {
    assert!(is_prime(2));
    assert!(is_prime(29));
    assert!(!is_prime(1));
    assert!(!is_prime(91)); // 91 = 7 * 13, not obvious!
    let primes: Vec<u64> = (1..=20).filter(|&n| is_prime(n)).collect();
    assert_eq!(primes, vec![2, 3, 5, 7, 11, 13, 17, 19]);
}`
        }
      ]
    },
    {
      heading: 'The Sieve of Eratosthenes: every prime up to n at once',
      anim: 'sieve',
      body: `Trial division answers "is *this* number prime?" But often you need *all* primes up to some limit n — for example to precompute a table before answering many queries. Calling is_prime on every number costs about n times sqrt(n). There is a far better way, invented by Eratosthenes around 240 BC: the **sieve**.

The idea is to cross out, not to test. Write all numbers from 2 to n. The first uncrossed number, 2, is prime; now cross out every multiple of 2 (they all have 2 as a factor, so none can be prime). The next still-uncrossed number, 3, is prime; cross out every multiple of 3. Continue. Whatever survives uncrossed is prime. It is the opposite philosophy of trial division: instead of interrogating each number, you let the primes *eliminate* their multiples.

Two optimizations make it fast. First, you only need to start crossing from p, the prime, up to sqrt(n); any composite below n already had a factor at most sqrt(n) cross it out. Second, when crossing multiples of p, start at p times p, because every smaller multiple (2p, 3p, ... up to (p-1)p) was already crossed by a *smaller* prime. The total cost is a startling **O(n log log n)** time and **O(n)** space — log-log grows so slowly it is nearly linear in practice. This is the standard tool for "primes up to a million" in a contest.

In Rust we represent the crossed-out marks as a Vec of bool, where index i answers "is i prime?". Watch the usize types: the index into the Vec must be usize, so we work in usize throughout.

### Common pitfalls

- Starting the inner cross-out at 2 times p instead of p times p — correct but slower; the smaller multiples were already handled.
- Looping the outer prime p all the way to n instead of stopping at sqrt(n). The numbers above sqrt(n) have no new multiples to cross within range.
- Allocating an n-sized bool array when n is huge (like 10-to-the-9). The sieve is O(n) *memory*; if n is enormous you may not have the RAM, and trial division per-query is the better trade.`,
      code: [
        {
          lang: 'text',
          src: `Sieve up to 20. Start all "maybe prime", then cross multiples.

  index:  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
  start:  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .

  p=2 (prime): cross 4,6,8,10,12,14,16,18,20
          2  3  X  5  X  7  X  9  X 11  X 13  X 15  X 17  X 19  X

  p=3 (prime): cross 9,12,15,18  (start at 3*3=9)
          2  3  X  5  X  7  X  X  X 11  X 13  X  X  X 17  X 19  X

  p=4 already crossed; p=5: 5*5=25 > 20 -> STOP (5 > sqrt(20)~4.47)

  survivors (prime): 2 3 5 7 11 13 17 19`
        },
        {
          lang: 'rust',
          src: `// Sieve of Eratosthenes: O(n log log n) time, O(n) space.
fn sieve(n: usize) -> Vec<usize> {
    if n < 2 { return Vec::new(); }
    let mut is_prime = vec![true; n + 1]; // index i -> "is i prime?"
    is_prime[0] = false;
    is_prime[1] = false;

    let mut p = 2usize;
    while p * p <= n {              // outer loop only to sqrt(n)
        if is_prime[p] {
            // Cross out multiples starting at p*p, stepping by p.
            let mut multiple = p * p;
            while multiple <= n {
                is_prime[multiple] = false;
                multiple += p;
            }
        }
        p += 1;
    }
    // Collect the survivors.
    (2..=n).filter(|&i| is_prime[i]).collect()
}

fn main() {
    let primes = sieve(20);
    assert_eq!(primes, vec![2, 3, 5, 7, 11, 13, 17, 19]);
    assert_eq!(sieve(1_000).len(), 168); // 168 primes below 1000
}`
        }
      ]
    },
    {
      heading: 'Prime factorization: breaking a number into its atoms',
      body: `The **fundamental theorem of arithmetic** says every integer above 1 factors into primes in exactly one way (ignoring order): 360 = 2 cubed times 3 squared times 5. **Prime factorization** is the act of finding those prime building blocks. It is how you compute gcd and lcm from first principles, how you count divisors, and — at huge sizes — the very problem whose difficulty protects RSA encryption.

The method reuses the sqrt insight from primality testing. Walk a candidate divisor d starting at 2. While d divides n, peel off that factor: record d and divide n by d, repeating so a repeated prime (like the three 2s in 360) is fully extracted. When d no longer divides n, move to the next candidate. As before, you only need d up to sqrt(n), because if n still has a factor larger than its square root after removing all the small ones, that leftover must itself be a single prime — so whatever value of n remains greater than 1 at the end is the last prime factor.

That last point is the elegant finish: the loop strips every prime up to sqrt of the original number, and if anything bigger than 1 is left, it is guaranteed prime and is the final factor. The whole routine is **O(sqrt(n))** time. We can speed the constant factor by testing 2 once and then only odd d, exactly like primality testing.

In Rust we return a Vec of (prime, exponent) pairs, which is the natural shape: 360 becomes [(2,3), (3,2), (5,1)]. This mirrors how you would write the factorization on paper.

### Common pitfalls

- Stopping the divisor loop at sqrt of the *current* n while forgetting the leftover. After the loop, if n is still greater than 1, push it as a final prime factor — otherwise you drop the largest prime.
- Not peeling a repeated factor fully: use a while (not an if) on n % d == 0, so 8 yields 2-cubed, not just one 2.
- Trial-dividing one huge semiprime (a product of two big primes) and expecting it to be fast — that is exactly the hard problem cryptography relies on; sqrt(n) is still enormous when n has 40 digits.`,
      code: [
        {
          lang: 'text',
          src: `Factor 360 by peeling primes smallest-first:

   n=360, d=2:  360/2=180  /2=90  /2=45   -> 2 appears 3 times
   n=45,  d=3:   45/3=15   /3=5           -> 3 appears 2 times
   n=5,   d=5:   5*... but 5*5=25 > 5, loop ends with n=5>1
                                          -> 5 is the last prime

   Result:  360 = 2^3 * 3^2 * 5^1
            +---+   +---+   +---+
            | 8 | * | 9 | * | 5 |  = 360   (check!)
            +---+   +---+   +---+`
        },
        {
          lang: 'rust',
          src: `// Prime factorization: O(sqrt(n)) time. Returns (prime, exponent) pairs.
fn factorize(mut n: u64) -> Vec<(u64, u32)> {
    let mut factors = Vec::new();

    // Peel factors of 2 first so we can then step d by 2 (odds only).
    let mut count = 0;
    while n % 2 == 0 { n /= 2; count += 1; }
    if count > 0 { factors.push((2, count)); }

    let mut d = 3u64;
    while d * d <= n {
        let mut c = 0;
        while n % d == 0 { n /= d; c += 1; } // peel ALL copies of d
        if c > 0 { factors.push((d, c)); }
        d += 2;
    }
    // Anything left above 1 is a single large prime factor.
    if n > 1 { factors.push((n, 1)); }
    factors
}

fn main() {
    assert_eq!(factorize(360), vec![(2, 3), (3, 2), (5, 1)]);
    assert_eq!(factorize(97), vec![(97, 1)]);    // 97 is prime
    assert_eq!(factorize(1), vec![]);            // no prime factors
}`
        }
      ]
    },
    {
      heading: 'Modular arithmetic: clock math and the billion-seven modulus',
      body: `You already do **modular arithmetic** every day. A 12-hour clock: 3 hours after 11 o\'clock is 2, not 14, because the clock counts *modulo 12*. Days of the week run modulo 7. The **modulus** is the number you wrap around at, and **a mod m** is the remainder of a divided by m. Hashing into buckets is mod (key mod table_size picks the bucket); so is a checksum.

Here is the property that makes modular arithmetic a superpower for huge computations: **mod distributes over addition and multiplication**. Formally, (a + b) mod m equals ((a mod m) + (b mod m)) mod m, and the same for multiplication. The practical meaning: you can take the remainder at *every* step instead of only at the end, so your running numbers never grow large. This is why competitive problems say "output the answer modulo 1_000_000_007" — the true answer might have thousands of digits, but if you reduce mod that prime after every operation, every intermediate value stays under a billion and fits in a u64 (after widening for the multiply).

Why exactly **1_000_000_007**? Three reasons a first-year should know: it is **prime** (which makes division-by-modular-inverse well behaved), it is **just over a billion** so two reduced values multiplied stay under 10-to-the-18 and fit in i64/u64, and it is a fixed convention so everyone\'s answers match.

Now the Rust gotcha that trips everyone: the **percent operator can return a negative result** for negative inputs, because Rust\'s % follows the sign of the dividend (so -7 % 3 is -1, not 2). For correct modular math you almost always want the *non-negative* remainder. Rust gives you exactly that with **rem_euclid**: (-7i64).rem_euclid(3) returns 2. Use rem_euclid whenever negatives can appear (subtractions are the usual source).

### Common pitfalls

- Using % on a value that can be negative and expecting a value in 0..m. Rust\'s % keeps the dividend\'s sign; use rem_euclid for the math-class remainder.
- Adding the modulus reduction only at the end. The whole point is to reduce *after every* + and *, or your intermediate values overflow.
- Multiplying two reduced u64 values near a billion: the product nears 10-to-18, fine for u64 but *not* for i32/u32. Widen to u64 or u128 before the multiply, then reduce.`,
      code: [
        {
          lang: 'text',
          src: `A clock is arithmetic mod 12. "3 hours after 11" wraps around:

         11  12
       10      1
      9          2     11 + 3 = 14, and 14 mod 12 = 2
       8        3     so the hand lands on 2, not 14.
        7      4
          6  5

mod distributes — reduce at every step so numbers stay small:

   want (123 * 456 * 789) mod 1000  without a giant product:
     123*456 = 56088,  56088 mod 1000 = 88
     88 *789 = 69432,  69432 mod 1000 = 432       -> answer 432

   Rust's % keeps the dividend's SIGN (trap!):
     (-7) %  3  = -1        <- NOT what number theory wants
     (-7).rem_euclid(3) = 2 <- the non-negative remainder you want`
        },
        {
          lang: 'rust',
          src: `const MOD: u64 = 1_000_000_007;

// Reduce after every operation so values never overflow.
fn add_mod(a: u64, b: u64) -> u64 { (a + b) % MOD }
fn mul_mod(a: u64, b: u64) -> u64 {
    // Widen to u128 so the product cannot overflow before we reduce.
    ((a as u128 * b as u128) % MOD as u128) as u64
}

fn main() {
    // Distributivity in action: same answer, smaller intermediates.
    let direct = (123u64 * 456 * 789) % 1000;
    let stepwise = ((123u64 * 456 % 1000) * 789) % 1000;
    assert_eq!(direct, stepwise);

    // The negative-remainder gotcha:
    assert_eq!(-7i64 % 3, -1);              // sign of the dividend
    assert_eq!((-7i64).rem_euclid(3), 2);   // math-class remainder

    assert_eq!(mul_mod(MOD - 1, MOD - 1), 1); // (m-1)^2 ≡ 1 (mod m)
}`
        }
      ]
    },
    {
      heading: 'Fast (binary) exponentiation, including modular pow',
      body: `Raising a number to a power shows up constantly — most famously in **modular exponentiation**, the operation at the heart of RSA and Diffie-Hellman key exchange, where you compute something like base-to-the-(secret) mod m with numbers hundreds of digits long. The naive way, multiplying base by itself power times, is **O(power)** — utterly hopeless when the exponent itself is a billion or a 600-bit secret.

The trick is to exploit the *binary* expansion of the exponent. Notice that base-to-the-2n is (base-to-the-n) squared, and base-to-the-(2n+1) is base times (base-to-the-n) squared. So you can **square your way up**: repeatedly square the base, and multiply the running answer by the current base only at the bit positions where the exponent has a 1. Because a number with value e has only about log2(e) bits, this is **O(log power)** multiplications — for an exponent near a billion, about 30 multiplications instead of a billion. This is called **binary exponentiation** or fast power.

Mechanically: look at the exponent\'s bits from least significant to most. Keep a running result starting at 1 and a running base starting at the original base. At each step, if the lowest bit of the exponent is 1, multiply result by base; then square base and shift the exponent right by one bit (integer divide by 2). Stop when the exponent reaches 0. To make it *modular*, just reduce with mod after every multiply (widening to u128 so the product does not overflow), reusing the mul_mod idea from the previous section.

### Common pitfalls

- Doing the multiplies in u64 without widening. Two reduced values near a billion multiply to near 10-to-18, which fits u64 but is risky if the modulus is larger; widen to u128 to be safe, then reduce.
- Forgetting the base case: anything to the power 0 is 1 (and by convention 0-to-the-0 is treated as 1 here). Start result at 1 so this falls out naturally.
- Squaring the base even after the last needed bit — harmless for correctness but watch overflow; reducing mod m each step keeps it bounded.`,
      code: [
        {
          lang: 'text',
          src: `Compute 3^13 by squaring. 13 in binary is 1101 = 8+4+1.

   So 3^13 = 3^8 * 3^4 * 3^1  (skip 3^2, its bit is 0).

   exp bits (low->high):  1   0   1   1
   squarings of base:    3^1 3^2 3^4 3^8

   step | exp | low bit | base   | result (times base if bit=1)
   -----+-----+---------+--------+-----------------------------
     1  | 13  |   1     | 3      | 1 * 3      = 3
     2  |  6  |   0     | 9      | 3          (bit 0: skip)
     3  |  3  |   1     | 81     | 3 * 81     = 243
     4  |  1  |   1     | 6561   | 243 * 6561 = 1594323
        |  0  |  stop   |        |
   3^13 = 1594323.  Just 4 rounds, not 13 multiplies.`
        },
        {
          lang: 'rust',
          src: `const MOD: u64 = 1_000_000_007;

// Fast modular exponentiation: O(log exp) multiplies.
fn pow_mod(mut base: u64, mut exp: u64, m: u64) -> u64 {
    let mut result: u64 = 1 % m;        // handles m == 1
    base %= m;
    while exp > 0 {
        if exp & 1 == 1 {               // current low bit is 1
            result = (result as u128 * base as u128 % m as u128) as u64;
        }
        base = (base as u128 * base as u128 % m as u128) as u64; // square
        exp >>= 1;                      // shift to the next bit
    }
    result
}

fn main() {
    // Plain power agrees with the fast one on small inputs.
    assert_eq!(pow_mod(3, 13, 1_000_000_007), 1_594_323);

    // A huge exponent finishes instantly — the RSA-style use case.
    let secret = pow_mod(2, 1_000_000_000, MOD);
    println!("2^(1e9) mod 1e9+7 = {secret}");

    // Fermat's little theorem: a^(p-1) ≡ 1 (mod p) for prime p, a not div by p.
    assert_eq!(pow_mod(7, MOD - 1, MOD), 1);
}`
        }
      ]
    },
    {
      heading: 'A taste of factorials and combinations',
      body: `Counting problems lean on two quantities. The **factorial** n! is n times (n-1) times ... times 1 — the number of ways to arrange n distinct items in a row (5! = 120 orderings of 5 books on a shelf). The **combination** "n choose k", written C(n, k), counts how many ways to *choose* k items from n when order does not matter (how many 2-card hands from a 52-card deck). Its formula is n! divided by (k! times (n-k)!).

Two facts make these practical. First, factorials explode: 21! already overflows u64, so in any problem with sizable n you work **modulo a prime** like 1_000_000_007 and keep every value small. Second, the division in the combination formula is a problem under a modulus, because you cannot just divide remainders. The fix uses **Fermat\'s little theorem**: when the modulus p is prime, dividing by x modulo p is the same as multiplying by x-to-the-(p-2) mod p, the **modular inverse**, which you compute with the fast pow you just built. So C(n, k) mod p = factorial[n] * inverse(factorial[k]) * inverse(factorial[n-k]), all mod p.

The standard contest setup precomputes factorial[0..=N] mod p once in O(N), then answers each C(n, k) query in O(log p) (the cost of one modular inverse via pow_mod). That turns "count subsets" problems that look terrifyingly large into a couple of array lookups and a fast power. For *small* n where nothing overflows, you can instead build Pascal\'s triangle with the simple rule C(n, k) = C(n-1, k-1) + C(n-1, k), which needs only additions and no division at all.

### Common pitfalls

- Computing n! directly in u64 for n past 20 — it overflows. Reduce modulo a prime at every multiply, or use u128 only for genuinely small n.
- Trying to *divide* remainders directly in the combination formula. Under a prime modulus, divide by multiplying with the modular inverse (x-to-the-(p-2) via pow_mod), never with the / operator.
- Off-by-one in the inverse exponent: Fermat gives the inverse as a-to-the-(p-2) mod p, not p-1. Power p-1 gives 1, the identity, not the inverse.`,
      code: [
        {
          lang: 'text',
          src: `Pascal's triangle: C(n,k) = C(n-1,k-1) + C(n-1,k). No division!

   n=0:            1
   n=1:          1   1
   n=2:        1   2   1
   n=3:      1   3   3   1
   n=4:    1   4   6   4   1          C(4,2) = 6
              \\  |  /
        each entry = sum of the two just above it

For BIG n under a prime p, use factorials + Fermat inverse:

   C(n,k) mod p = fact[n] * inv(fact[k]) * inv(fact[n-k])   (mod p)
   where inv(x) = x^(p-2) mod p     (Fermat's little theorem)`
        },
        {
          lang: 'rust',
          src: `const MOD: u64 = 1_000_000_007;

fn pow_mod(mut base: u64, mut exp: u64, m: u64) -> u64 {
    let mut r = 1 % m; base %= m;
    while exp > 0 {
        if exp & 1 == 1 { r = (r as u128 * base as u128 % m as u128) as u64; }
        base = (base as u128 * base as u128 % m as u128) as u64;
        exp >>= 1;
    }
    r
}

// Modular inverse of x mod prime p, via Fermat: x^(p-2) mod p.
fn inv(x: u64) -> u64 { pow_mod(x, MOD - 2, MOD) }

// n choose k, computed modulo the prime MOD.
fn choose(n: u64, k: u64) -> u64 {
    if k > n { return 0; }
    // Precompute factorials 0..=n modulo MOD (no overflow: each step reduced).
    let mut fact = vec![1u64; (n + 1) as usize];
    for i in 1..=n as usize {
        fact[i] = (fact[i - 1] as u128 * i as u128 % MOD as u128) as u64;
    }
    let num = fact[n as usize];
    let den = (fact[k as usize] as u128 * fact[(n - k) as usize] as u128
               % MOD as u128) as u64;
    (num as u128 * inv(den) as u128 % MOD as u128) as u64
}

fn main() {
    assert_eq!(choose(4, 2), 6);
    assert_eq!(choose(52, 5), 2_598_960); // 5-card poker hands
    assert_eq!(choose(5, 0), 1);
}`
        }
      ]
    }
  ],
  takeaways: [
    'Machine integers are fixed-size boxes; when a result does not fit it overflows (wraps), so pick i64/u64/u128 big enough and widen BEFORE multiplying.',
    'Rust is honest about overflow: use wrapping_ (roll over), checked_ (Option), saturating_ (clamp), or overflowing_ (value + flag) to say what you mean.',
    'usize is unsigned and cannot go negative; 0usize - 1 panics or wraps, so reach for checked_sub on lengths and indices.',
    'gcd by the Euclidean algorithm is O(log min(a,b)): repeatedly replace (a, b) with (b, a mod b) until b is 0.',
    'Compute lcm as a / gcd(a,b) * b — divide before multiplying so the intermediate product does not overflow.',
    'Primality by trial division only needs divisors up to sqrt(n), because divisors come in pairs straddling the square root: O(sqrt(n)).',
    'The Sieve of Eratosthenes finds every prime up to n in O(n log log n) by crossing out multiples, starting each prime at p*p.',
    'Modular arithmetic distributes over + and *, so reduce mod m after every operation to keep numbers small; 1_000_000_007 is prime and just over a billion.',
    'Rust % keeps the dividend\'s sign (-7 % 3 = -1); use rem_euclid for the non-negative remainder number theory expects.',
    'Binary exponentiation computes base^exp mod m in O(log exp) by squaring; combinations under a prime use the Fermat inverse x^(p-2).'
  ],
  cheatsheet: [
    { label: 'a.checked_add(b)', value: 'Some(sum) or None on overflow; detect safely' },
    { label: 'a.wrapping_mul(b)', value: 'Deliberate mod-2^bits wrap (hashing, checksums)' },
    { label: 'a.saturating_sub(b)', value: 'Clamp at type min/max instead of wrapping' },
    { label: 'a.overflowing_add(b)', value: '(value, overflowed_bool) in one call' },
    { label: 'gcd(a, b)', value: 'Euclid: while b != 0 { (a,b)=(b, a%b) } — O(log n)' },
    { label: 'lcm(a, b)', value: 'a / gcd(a,b) * b — divide first to dodge overflow' },
    { label: 'is_prime(n)', value: 'Trial-divide odd d while d*d <= n — O(sqrt n)' },
    { label: 'Sieve of Eratosthenes', value: 'Primes up to n in O(n log log n), O(n) space' },
    { label: 'factorize(n)', value: 'Peel primes to sqrt(n); leftover > 1 is prime — O(sqrt n)' },
    { label: 'a.rem_euclid(m)', value: 'Non-negative remainder (handles negatives correctly)' },
    { label: '(a as u128 * b) % m', value: 'Widen before modular multiply to avoid overflow' },
    { label: 'pow_mod(b, e, m)', value: 'Binary exponentiation: O(log e) multiplies' },
    { label: 'inv(x) = pow_mod(x, p-2, p)', value: 'Fermat modular inverse (p prime); division mod p' },
    { label: 'MOD = 1_000_000_007', value: 'Prime, just over 1e9: products fit u64 after reduce' }
  ]
}

export default note
