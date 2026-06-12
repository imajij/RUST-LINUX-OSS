import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch15-c-001',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Greatest Common Divisor',
    prompt: `Implement:

    fn gcd(a: u64, b: u64) -> u64

Return the greatest common divisor of a and b using the Euclidean algorithm.
Define gcd(x, 0) = x.
Example: gcd(12, 18) -> 6`,
    hints: ['gcd(a, b) = gcd(b, a mod b).', 'Stop recursing when the second argument reaches 0.'],
    solution: `fn gcd(a: u64, b: u64) -> u64 {
    if b == 0 { a } else { gcd(b, a % b) }
}

fn main() {
    assert_eq!(gcd(12, 18), 6);
    assert_eq!(gcd(7, 0), 7);
    assert_eq!(gcd(0, 5), 5);
    assert_eq!(gcd(100, 75), 25);
    println!("ok");
}`,
    starter: `fn gcd(a: u64, b: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(gcd(12, 18), 6);
    println!("ok");
}`,
    tags: ['math', 'gcd', 'recursion'],
  },
  {
    id: 'ds-ch15-c-002',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Least Common Multiple',
    prompt: `Implement:

    fn lcm(a: u64, b: u64) -> u64

Return the least common multiple of a and b.
If either input is 0, return 0.
Use the relationship lcm(a, b) = a / gcd(a, b) * b to avoid overflow.
Example: lcm(4, 6) -> 12`,
    hints: ['Compute gcd first, then divide before multiplying.', 'lcm(0, x) = 0 by convention.'],
    solution: `fn gcd(a: u64, b: u64) -> u64 {
    if b == 0 { a } else { gcd(b, a % b) }
}

fn lcm(a: u64, b: u64) -> u64 {
    if a == 0 || b == 0 { 0 } else { a / gcd(a, b) * b }
}

fn main() {
    assert_eq!(lcm(4, 6), 12);
    assert_eq!(lcm(3, 7), 21);
    assert_eq!(lcm(0, 5), 0);
    assert_eq!(lcm(12, 18), 36);
    println!("ok");
}`,
    starter: `fn gcd(a: u64, b: u64) -> u64 {
    if b == 0 { a } else { gcd(b, a % b) }
}

fn lcm(a: u64, b: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(lcm(4, 6), 12);
    println!("ok");
}`,
    tags: ['math', 'lcm', 'gcd'],
  },
  {
    id: 'ds-ch15-c-003',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Is Prime by Trial Division',
    prompt: `Implement:

    fn is_prime(n: u64) -> bool

Return true if n is a prime number, false otherwise.
Numbers less than 2 are not prime.
Use trial division up to the square root of n.
Example: is_prime(17) -> true, is_prime(18) -> false`,
    hints: ['Only check divisors up to sqrt(n).', 'Handle 0 and 1 as special cases returning false.', 'Skip even divisors after checking 2.'],
    solution: `fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    if n == 2 { return true; }
    if n % 2 == 0 { return false; }
    let mut i = 3u64;
    while i * i <= n {
        if n % i == 0 { return false; }
        i += 2;
    }
    true
}

fn main() {
    assert_eq!(is_prime(0), false);
    assert_eq!(is_prime(1), false);
    assert_eq!(is_prime(2), true);
    assert_eq!(is_prime(17), true);
    assert_eq!(is_prime(18), false);
    assert_eq!(is_prime(97), true);
    println!("ok");
}`,
    starter: `fn is_prime(n: u64) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_prime(17), true);
    println!("ok");
}`,
    tags: ['math', 'prime', 'trial-division'],
  },
  {
    id: 'ds-ch15-c-004',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Primes via Sieve of Eratosthenes',
    prompt: `Implement:

    fn count_primes(n: usize) -> usize

Return the number of prime numbers strictly less than n.
Use the Sieve of Eratosthenes for an efficient solution.
Example: count_primes(10) -> 4  (primes 2, 3, 5, 7)`,
    hints: ['Allocate a boolean array of size n initialized to true.', 'Mark 0 and 1 as not prime.', 'For each prime p, mark multiples starting at p*p.'],
    solution: `fn count_primes(n: usize) -> usize {
    if n < 2 { return 0; }
    let mut sieve = vec![true; n];
    sieve[0] = false;
    sieve[1] = false;
    let mut i = 2;
    while i * i < n {
        if sieve[i] {
            let mut j = i * i;
            while j < n {
                sieve[j] = false;
                j += i;
            }
        }
        i += 1;
    }
    sieve.iter().filter(|&&v| v).count()
}

fn main() {
    assert_eq!(count_primes(10), 4);
    assert_eq!(count_primes(0), 0);
    assert_eq!(count_primes(2), 0);
    assert_eq!(count_primes(3), 1);
    assert_eq!(count_primes(20), 8);
    println!("ok");
}`,
    starter: `fn count_primes(n: usize) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_primes(10), 4);
    println!("ok");
}`,
    tags: ['math', 'sieve', 'prime'],
  },
  {
    id: 'ds-ch15-c-005',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum of Divisors',
    prompt: `Implement:

    fn sum_of_divisors(n: u64) -> u64

Return the sum of all positive divisors of n (including 1 and n itself).
For n == 0 return 0.
Example: sum_of_divisors(6) -> 12  (1+2+3+6)`,
    hints: ['Iterate i from 1 to sqrt(n); if i divides n add both i and n/i.', 'When i == n/i (perfect square root), add it only once.'],
    solution: `fn sum_of_divisors(n: u64) -> u64 {
    if n == 0 { return 0; }
    let mut sum = 0u64;
    let mut i = 1u64;
    while i * i <= n {
        if n % i == 0 {
            sum += i;
            if i != n / i {
                sum += n / i;
            }
        }
        i += 1;
    }
    sum
}

fn main() {
    assert_eq!(sum_of_divisors(6), 12);
    assert_eq!(sum_of_divisors(1), 1);
    assert_eq!(sum_of_divisors(12), 28);
    assert_eq!(sum_of_divisors(28), 56);
    println!("ok");
}`,
    starter: `fn sum_of_divisors(n: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(sum_of_divisors(6), 12);
    println!("ok");
}`,
    tags: ['math', 'divisors'],
  },
  {
    id: 'ds-ch15-c-006',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Factorial Trailing Zeroes',
    prompt: `Implement:

    fn trailing_zeroes(n: u64) -> u64

Return the number of trailing zeroes in n! (n factorial).
A trailing zero is produced by each factor of 10, which requires both a factor of 2 and 5.
Since factors of 2 are plentiful, count factors of 5.
Example: trailing_zeroes(25) -> 6`,
    hints: ['Count how many multiples of 5 are <= n, then multiples of 25, 125, etc.', 'Repeatedly divide n by 5 and accumulate the quotient.'],
    solution: `fn trailing_zeroes(n: u64) -> u64 {
    let mut count = 0u64;
    let mut x = n;
    while x >= 5 {
        x /= 5;
        count += x;
    }
    count
}

fn main() {
    assert_eq!(trailing_zeroes(5), 1);
    assert_eq!(trailing_zeroes(10), 2);
    assert_eq!(trailing_zeroes(25), 6);
    assert_eq!(trailing_zeroes(0), 0);
    assert_eq!(trailing_zeroes(100), 24);
    println!("ok");
}`,
    starter: `fn trailing_zeroes(n: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(trailing_zeroes(25), 6);
    println!("ok");
}`,
    tags: ['math', 'factorial', 'number-theory'],
  },
  {
    id: 'ds-ch15-c-007',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Digit Sum and Number of Digits',
    prompt: `Implement two functions:

    fn digit_sum(n: u64) -> u64
    fn num_digits(n: u64) -> u32

digit_sum returns the sum of all decimal digits of n.
num_digits returns the count of decimal digits in n; for n==0 return 1.
Examples: digit_sum(123) -> 6, num_digits(100) -> 3`,
    hints: ['Extract digits by repeatedly taking n%10 and dividing by 10.', 'For num_digits, treat 0 as having exactly one digit.'],
    solution: `fn digit_sum(mut n: u64) -> u64 {
    let mut s = 0u64;
    while n > 0 {
        s += n % 10;
        n /= 10;
    }
    s
}

fn num_digits(mut n: u64) -> u32 {
    if n == 0 { return 1; }
    let mut count = 0u32;
    while n > 0 {
        count += 1;
        n /= 10;
    }
    count
}

fn main() {
    assert_eq!(digit_sum(0), 0);
    assert_eq!(digit_sum(123), 6);
    assert_eq!(digit_sum(9999), 36);
    assert_eq!(num_digits(0), 1);
    assert_eq!(num_digits(100), 3);
    assert_eq!(num_digits(9999), 4);
    println!("ok");
}`,
    starter: `fn digit_sum(mut n: u64) -> u64 {
    // TODO
    todo!()
}

fn num_digits(n: u64) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(digit_sum(123), 6);
    println!("ok");
}`,
    tags: ['math', 'digits'],
  },
  {
    id: 'ds-ch15-c-008',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Digital Root',
    prompt: `Implement:

    fn digital_root(n: u64) -> u64

The digital root is obtained by repeatedly summing the digits of n until a single digit remains.
For n == 0 return 0.
There is a direct formula using modulo 9.
Example: digital_root(493) -> 7  (4+9+3=16, 1+6=7)`,
    hints: ['The digital root equals n mod 9, with special handling for multiples of 9 (return 9) and 0 (return 0).', 'Avoid the loop: use the closed-form formula.'],
    solution: `fn digital_root(n: u64) -> u64 {
    if n == 0 { return 0; }
    let r = n % 9;
    if r == 0 { 9 } else { r }
}

fn main() {
    assert_eq!(digital_root(0), 0);
    assert_eq!(digital_root(9), 9);
    assert_eq!(digital_root(18), 9);
    assert_eq!(digital_root(493), 7);
    assert_eq!(digital_root(942), 6);
    println!("ok");
}`,
    starter: `fn digital_root(n: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(digital_root(493), 7);
    println!("ok");
}`,
    tags: ['math', 'digits', 'digital-root'],
  },
  {
    id: 'ds-ch15-c-009',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reverse Integer with Overflow Guard',
    prompt: `Implement:

    fn reverse_integer(x: i32) -> i32

Reverse the decimal digits of x.
If the reversed value overflows a 32-bit signed integer, return 0.
Negative numbers should reverse their digits while keeping the minus sign.
Example: reverse_integer(123) -> 321, reverse_integer(-456) -> -654`,
    hints: ['Accumulate the reversed value in an i64 to detect overflow.', 'Check if the result fits in i32 range before casting.'],
    solution: `fn reverse_integer(x: i32) -> i32 {
    let mut n = x;
    let mut rev: i64 = 0;
    while n != 0 {
        rev = rev * 10 + (n % 10) as i64;
        n /= 10;
    }
    if rev > i32::MAX as i64 || rev < i32::MIN as i64 {
        0
    } else {
        rev as i32
    }
}

fn main() {
    assert_eq!(reverse_integer(123), 321);
    assert_eq!(reverse_integer(-456), -654);
    assert_eq!(reverse_integer(1534236469), 0);
    assert_eq!(reverse_integer(0), 0);
    assert_eq!(reverse_integer(100), 1);
    println!("ok");
}`,
    starter: `fn reverse_integer(x: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(reverse_integer(123), 321);
    println!("ok");
}`,
    tags: ['math', 'integer', 'overflow'],
  },
  {
    id: 'ds-ch15-c-010',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Palindrome Number',
    prompt: `Implement:

    fn is_palindrome(x: i32) -> bool

Return true if x reads the same forward and backward in decimal.
Negative numbers are never palindromes.
Example: is_palindrome(121) -> true, is_palindrome(-121) -> false, is_palindrome(10) -> false`,
    hints: ['Convert to a string and compare the character sequence with its reverse.', 'Alternatively, reverse only the second half of the digits without converting to string.'],
    solution: `fn is_palindrome(x: i32) -> bool {
    if x < 0 { return false; }
    let s = x.to_string();
    let b = s.as_bytes();
    let n = b.len();
    for i in 0..n/2 {
        if b[i] != b[n-1-i] { return false; }
    }
    true
}

fn main() {
    assert_eq!(is_palindrome(121), true);
    assert_eq!(is_palindrome(-121), false);
    assert_eq!(is_palindrome(10), false);
    assert_eq!(is_palindrome(0), true);
    assert_eq!(is_palindrome(12321), true);
    println!("ok");
}`,
    starter: `fn is_palindrome(x: i32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_palindrome(121), true);
    println!("ok");
}`,
    tags: ['math', 'palindrome'],
  },
  {
    id: 'ds-ch15-c-011',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Roman Numeral to Integer',
    prompt: `Implement:

    fn roman_to_int(s: &str) -> i32

Convert a Roman numeral string to its integer value.
Symbols: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.
When a smaller value appears before a larger one (e.g. IV=4, IX=9), subtract it.
Input is a valid Roman numeral in range 1 to 3999.
Example: roman_to_int("MCMXCIV") -> 1994`,
    hints: ['Walk left to right; if the current value is less than the next, subtract it, otherwise add it.', 'Map each character to its value with a match or lookup.'],
    solution: `fn roman_to_int(s: &str) -> i32 {
    let val = |c: char| -> i32 {
        match c {
            'I' => 1, 'V' => 5, 'X' => 10, 'L' => 50,
            'C' => 100, 'D' => 500, 'M' => 1000, _ => 0
        }
    };
    let chars: Vec<char> = s.chars().collect();
    let n = chars.len();
    let mut result = 0i32;
    for i in 0..n {
        let cur = val(chars[i]);
        let nxt = if i + 1 < n { val(chars[i+1]) } else { 0 };
        if cur < nxt { result -= cur; } else { result += cur; }
    }
    result
}

fn main() {
    assert_eq!(roman_to_int("III"), 3);
    assert_eq!(roman_to_int("IV"), 4);
    assert_eq!(roman_to_int("IX"), 9);
    assert_eq!(roman_to_int("LVIII"), 58);
    assert_eq!(roman_to_int("MCMXCIV"), 1994);
    println!("ok");
}`,
    starter: `fn roman_to_int(s: &str) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(roman_to_int("IV"), 4);
    println!("ok");
}`,
    tags: ['math', 'roman-numerals', 'string'],
  },
  {
    id: 'ds-ch15-c-012',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Integer to Roman Numeral',
    prompt: `Implement:

    fn int_to_roman(num: i32) -> String

Convert an integer in the range 1 to 3999 to a Roman numeral string.
Use the standard subtractive notation: IV for 4, IX for 9, XL for 40, etc.
Example: int_to_roman(1994) -> "MCMXCIV"`,
    hints: ['Use a lookup table of (value, symbol) pairs in descending order.', 'Greedily subtract the largest value that fits and append its symbol.'],
    solution: `fn int_to_roman(mut num: i32) -> String {
    let vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
    let syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
    let mut result = String::new();
    for (i, &v) in vals.iter().enumerate() {
        while num >= v {
            result.push_str(syms[i]);
            num -= v;
        }
    }
    result
}

fn main() {
    assert_eq!(int_to_roman(3), "III");
    assert_eq!(int_to_roman(4), "IV");
    assert_eq!(int_to_roman(9), "IX");
    assert_eq!(int_to_roman(58), "LVIII");
    assert_eq!(int_to_roman(1994), "MCMXCIV");
    println!("ok");
}`,
    starter: `fn int_to_roman(num: i32) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(int_to_roman(4), "IV");
    println!("ok");
}`,
    tags: ['math', 'roman-numerals', 'string'],
  },
  {
    id: 'ds-ch15-c-013',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Excel Column Title to Number',
    prompt: `Implement:

    fn excel_title_to_number(s: &str) -> i32

Convert an Excel column title string like "A", "Z", "AA", "AB", "ZY" to its column number.
"A" -> 1, "Z" -> 26, "AA" -> 27, "AB" -> 28.
The encoding is similar to base-26 but with no zero digit.
Example: excel_title_to_number("ZY") -> 701`,
    hints: ['Process characters left to right; multiply the running total by 26 and add the value of the current letter (A=1 .. Z=26).', 'This is essentially treating the string as a base-26 number.'],
    solution: `fn excel_title_to_number(s: &str) -> i32 {
    let mut result = 0i32;
    for c in s.chars() {
        result = result * 26 + (c as i32 - 'A' as i32 + 1);
    }
    result
}

fn main() {
    assert_eq!(excel_title_to_number("A"), 1);
    assert_eq!(excel_title_to_number("Z"), 26);
    assert_eq!(excel_title_to_number("AA"), 27);
    assert_eq!(excel_title_to_number("AB"), 28);
    assert_eq!(excel_title_to_number("ZY"), 701);
    println!("ok");
}`,
    starter: `fn excel_title_to_number(s: &str) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(excel_title_to_number("AA"), 27);
    println!("ok");
}`,
    tags: ['math', 'excel', 'base-conversion'],
  },
  {
    id: 'ds-ch15-c-014',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Number to Excel Column Title',
    prompt: `Implement:

    fn convert_to_title(n: i32) -> String

Convert a positive column number to its Excel column title.
1 -> "A", 26 -> "Z", 27 -> "AA", 28 -> "AB", 701 -> "ZY".
Note there is no zero in this encoding, so adjust before taking the remainder.
Example: convert_to_title(701) -> "ZY"`,
    hints: ['Subtract 1 before taking modulo 26 to handle the absence of a zero character.', 'Build the string from least significant character and reverse, or prepend.'],
    solution: `fn convert_to_title(mut n: i32) -> String {
    let mut result = String::new();
    while n > 0 {
        n -= 1;
        let c = (b'A' + (n % 26) as u8) as char;
        result.insert(0, c);
        n /= 26;
    }
    result
}

fn main() {
    assert_eq!(convert_to_title(1), "A");
    assert_eq!(convert_to_title(26), "Z");
    assert_eq!(convert_to_title(27), "AA");
    assert_eq!(convert_to_title(28), "AB");
    assert_eq!(convert_to_title(701), "ZY");
    println!("ok");
}`,
    starter: `fn convert_to_title(n: i32) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(convert_to_title(27), "AA");
    println!("ok");
}`,
    tags: ['math', 'excel', 'base-conversion'],
  },
  {
    id: 'ds-ch15-c-015',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Happy Number',
    prompt: `Implement:

    fn is_happy(n: u32) -> bool

A happy number is defined by the following process: starting with any positive integer,
replace the number by the sum of squares of its digits, and repeat until the number
either equals 1 (happy) or loops endlessly (not happy).
Return true if n is a happy number.
Example: is_happy(19) -> true  (1^2+9^2=82, 8^2+2^2=68, ..., 1)`,
    hints: ['Use Floyds cycle detection (fast/slow pointers) to detect if the sequence cycles without reaching 1.', 'If the value reaches 1 the number is happy; if fast and slow meet at a non-1 value it is not.'],
    solution: `fn is_happy(n: u32) -> bool {
    let mut x = n;
    let mut slow = x;
    let digit_sq_sum = |mut v: u32| -> u32 {
        let mut s = 0u32;
        while v > 0 { let d = v % 10; s += d * d; v /= 10; }
        s
    };
    loop {
        x = digit_sq_sum(x);
        slow = digit_sq_sum(digit_sq_sum(slow));
        if x == 1 { return true; }
        if x == slow { return false; }
    }
}

fn main() {
    assert_eq!(is_happy(1), true);
    assert_eq!(is_happy(7), true);
    assert_eq!(is_happy(2), false);
    assert_eq!(is_happy(19), true);
    assert_eq!(is_happy(4), false);
    println!("ok");
}`,
    starter: `fn is_happy(n: u32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_happy(19), true);
    println!("ok");
}`,
    tags: ['math', 'happy-number', 'cycle-detection'],
  },
  {
    id: 'ds-ch15-c-016',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Ugly Number Check',
    prompt: `Implement:

    fn is_ugly(n: i32) -> bool

An ugly number is a positive integer whose only prime factors are 2, 3, and 5.
1 is considered ugly. Numbers <= 0 are not ugly.
Divide out all factors of 2, 3, and 5; if the result is 1 the number is ugly.
Example: is_ugly(6) -> true, is_ugly(14) -> false`,
    hints: ['Repeatedly divide n by 2, then by 3, then by 5 as long as each divides evenly.', 'After all divisions, check if n equals 1.'],
    solution: `fn is_ugly(n: i32) -> bool {
    if n <= 0 { return false; }
    let mut x = n;
    for &p in &[2, 3, 5] {
        while x % p == 0 { x /= p; }
    }
    x == 1
}

fn main() {
    assert_eq!(is_ugly(1), true);
    assert_eq!(is_ugly(6), true);
    assert_eq!(is_ugly(14), false);
    assert_eq!(is_ugly(0), false);
    assert_eq!(is_ugly(8), true);
    println!("ok");
}`,
    starter: `fn is_ugly(n: i32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_ugly(6), true);
    println!("ok");
}`,
    tags: ['math', 'ugly-number', 'prime'],
  },
  {
    id: 'ds-ch15-c-017',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Nth Ugly Number',
    prompt: `Implement:

    fn nth_ugly(n: usize) -> u64

Return the nth ugly number (positive integers whose only prime factors are 2, 3, and 5).
The sequence starts: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, ...
Use a three-pointer dynamic programming approach.
Example: nth_ugly(10) -> 12`,
    hints: ['Maintain three pointers i2, i3, i5 into the result array, each tracking the next ugly number to multiply by 2, 3, and 5 respectively.', 'At each step take the minimum of ugly[i2]*2, ugly[i3]*3, ugly[i5]*5 and advance the corresponding pointer(s).'],
    solution: `fn nth_ugly(n: usize) -> u64 {
    let mut ugly = vec![1u64; n];
    let (mut i2, mut i3, mut i5) = (0, 0, 0);
    for i in 1..n {
        let next2 = ugly[i2] * 2;
        let next3 = ugly[i3] * 3;
        let next5 = ugly[i5] * 5;
        let next = next2.min(next3).min(next5);
        ugly[i] = next;
        if next == next2 { i2 += 1; }
        if next == next3 { i3 += 1; }
        if next == next5 { i5 += 1; }
    }
    ugly[n - 1]
}

fn main() {
    assert_eq!(nth_ugly(1), 1);
    assert_eq!(nth_ugly(10), 12);
    assert_eq!(nth_ugly(11), 15);
    assert_eq!(nth_ugly(15), 24);
    println!("ok");
}`,
    starter: `fn nth_ugly(n: usize) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(nth_ugly(10), 12);
    println!("ok");
}`,
    tags: ['math', 'ugly-number', 'dynamic-programming'],
  },
  {
    id: 'ds-ch15-c-018',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Perfect Number Check',
    prompt: `Implement:

    fn is_perfect(n: u64) -> bool

A perfect number equals the sum of its proper divisors (all divisors except itself).
For example 6 = 1+2+3, and 28 = 1+2+4+7+14.
Return false for n < 2.
Example: is_perfect(496) -> true`,
    hints: ['Sum all divisors from 1 to sqrt(n) including the complement, but exclude n itself.', 'Start the divisor sum at 1 and iterate from 2.'],
    solution: `fn is_perfect(n: u64) -> bool {
    if n < 2 { return false; }
    let mut sum = 1u64;
    let mut i = 2u64;
    while i * i <= n {
        if n % i == 0 {
            sum += i;
            if i != n / i { sum += n / i; }
        }
        i += 1;
    }
    sum == n
}

fn main() {
    assert_eq!(is_perfect(6), true);
    assert_eq!(is_perfect(28), true);
    assert_eq!(is_perfect(496), true);
    assert_eq!(is_perfect(1), false);
    assert_eq!(is_perfect(12), false);
    println!("ok");
}`,
    starter: `fn is_perfect(n: u64) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_perfect(6), true);
    println!("ok");
}`,
    tags: ['math', 'perfect-number', 'divisors'],
  },
  {
    id: 'ds-ch15-c-019',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Integer Square Root via Newton',
    prompt: `Implement:

    fn isqrt(n: u64) -> u64

Return the integer square root of n, i.e. the largest integer k such that k*k <= n.
Use Newtons method (Babylonian method) for convergence.
Example: isqrt(10) -> 3, isqrt(100) -> 10`,
    hints: ['Start with an initial guess of n, then iterate x = (x + n/x) / 2.', 'Stop when the new estimate is no smaller than the current one.'],
    solution: `fn isqrt(n: u64) -> u64 {
    if n == 0 { return 0; }
    let mut x = n;
    loop {
        let y = (x + n / x) / 2;
        if y >= x { return x; }
        x = y;
    }
}

fn main() {
    assert_eq!(isqrt(0), 0);
    assert_eq!(isqrt(1), 1);
    assert_eq!(isqrt(4), 2);
    assert_eq!(isqrt(9), 3);
    assert_eq!(isqrt(10), 3);
    assert_eq!(isqrt(100), 10);
    assert_eq!(isqrt(99), 9);
    println!("ok");
}`,
    starter: `fn isqrt(n: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(isqrt(10), 3);
    println!("ok");
}`,
    tags: ['math', 'sqrt', 'newton'],
  },
  {
    id: 'ds-ch15-c-020',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Nth Prime Number',
    prompt: `Implement:

    fn nth_prime(n: usize) -> u64

Return the nth prime number (1-indexed).
nth_prime(1) -> 2, nth_prime(5) -> 11, nth_prime(10) -> 29.
Use trial division to test each candidate.
Panic if n == 0.
Example: nth_prime(25) -> 97`,
    hints: ['Iterate candidates starting at 2 and count primes found.', 'Use a helper is_prime that checks divisors up to the square root.'],
    solution: `fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    if n == 2 { return true; }
    if n % 2 == 0 { return false; }
    let mut i = 3u64;
    while i * i <= n {
        if n % i == 0 { return false; }
        i += 2;
    }
    true
}

fn nth_prime(n: usize) -> u64 {
    if n == 0 { panic!("n must be >= 1"); }
    let mut count = 0usize;
    let mut candidate = 1u64;
    loop {
        candidate += 1;
        if is_prime(candidate) {
            count += 1;
            if count == n { return candidate; }
        }
    }
}

fn main() {
    assert_eq!(nth_prime(1), 2);
    assert_eq!(nth_prime(2), 3);
    assert_eq!(nth_prime(5), 11);
    assert_eq!(nth_prime(10), 29);
    assert_eq!(nth_prime(25), 97);
    println!("ok");
}`,
    starter: `fn nth_prime(n: usize) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(nth_prime(5), 11);
    println!("ok");
}`,
    tags: ['math', 'prime', 'trial-division'],
  },
  {
    id: 'ds-ch15-c-021',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Prime Factorization',
    prompt: `Implement:

    fn prime_factors(n: u64) -> Vec<u64>

Return the prime factorization of n as a sorted vector of prime factors (with repetition).
For n == 1 return an empty vector.
Example: prime_factors(360) -> [2, 2, 2, 3, 3, 5]`,
    hints: ['Divide out small primes starting from 2 and incrementing by 1.', 'After the loop, if n > 1 then n itself is a prime factor.', 'Only trial divide up to sqrt(n) to stay efficient.'],
    solution: `fn prime_factors(mut n: u64) -> Vec<u64> {
    let mut factors = Vec::new();
    let mut d = 2u64;
    while d * d <= n {
        while n % d == 0 {
            factors.push(d);
            n /= d;
        }
        d += 1;
    }
    if n > 1 { factors.push(n); }
    factors
}

fn main() {
    assert_eq!(prime_factors(12), vec![2, 2, 3]);
    assert_eq!(prime_factors(28), vec![2, 2, 7]);
    assert_eq!(prime_factors(1), vec![]);
    assert_eq!(prime_factors(17), vec![17]);
    assert_eq!(prime_factors(360), vec![2,2,2,3,3,5]);
    println!("ok");
}`,
    starter: `fn prime_factors(n: u64) -> Vec<u64> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(prime_factors(12), vec![2, 2, 3]);
    println!("ok");
}`,
    tags: ['math', 'prime', 'factorization'],
  },
  {
    id: 'ds-ch15-c-022',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Fast Integer Power (Exponentiation by Squaring)',
    prompt: `Implement:

    fn fast_pow(base: i64, exp: u32) -> i64

Compute base raised to the power exp using exponentiation by squaring in O(log exp) time.
Assume the result fits in i64.
Cross-verify against naive multiplication for correctness.
Example: fast_pow(2, 10) -> 1024`,
    hints: ['If the lowest bit of exp is set, multiply result by base.', 'Square base and shift exp right by 1 each iteration.', 'Stop when exp reaches 0.'],
    solution: `fn fast_pow(base: i64, mut exp: u32) -> i64 {
    let mut result = 1i64;
    let mut b = base;
    while exp > 0 {
        if exp & 1 == 1 { result *= b; }
        b *= b;
        exp >>= 1;
    }
    result
}

fn naive_pow(base: i64, exp: u32) -> i64 {
    let mut r = 1i64;
    for _ in 0..exp { r *= base; }
    r
}

fn main() {
    for base in [2i64, 3, 5, -2] {
        for exp in [0u32, 1, 5, 10] {
            assert_eq!(fast_pow(base, exp), naive_pow(base, exp),
                "base={base} exp={exp}");
        }
    }
    assert_eq!(fast_pow(2, 10), 1024);
    println!("ok");
}`,
    starter: `fn fast_pow(base: i64, exp: u32) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(fast_pow(2, 10), 1024);
    println!("ok");
}`,
    tags: ['math', 'power', 'exponentiation-by-squaring'],
  },
  {
    id: 'ds-ch15-c-023',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Modular Exponentiation',
    prompt: `Implement:

    fn mod_pow(base: u64, exp: u64, modulus: u64) -> u64

Compute (base ^ exp) mod modulus efficiently using exponentiation by squaring.
Handle the edge case where modulus == 1 (always return 0).
Cross-verify against a naive loop for small inputs.
Example: mod_pow(2, 10, 1000) -> 24`,
    hints: ['Take base mod modulus at the start.', 'At each bit of exp, square base mod modulus; if the bit is set, multiply result by base mod modulus.', 'Use u64 arithmetic; intermediate products are at most (modulus-1)^2.'],
    solution: `fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    if modulus == 1 { return 0; }
    let mut result = 1u64;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 {
            result = result * base % modulus;
        }
        base = base * base % modulus;
        exp >>= 1;
    }
    result
}

fn naive_mod_pow(base: u64, exp: u64, modulus: u64) -> u64 {
    let mut r = 1u64;
    for _ in 0..exp {
        r = r * (base % modulus) % modulus;
    }
    r
}

fn main() {
    for b in [2u64, 3, 5, 7] {
        for e in [0u64, 1, 4, 10, 20] {
            for m in [7u64, 13, 1000000007] {
                assert_eq!(mod_pow(b, e, m), naive_mod_pow(b, e, m),
                    "b={b} e={e} m={m}");
            }
        }
    }
    assert_eq!(mod_pow(2, 10, 1000), 24);
    println!("ok");
}`,
    starter: `fn mod_pow(base: u64, exp: u64, modulus: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(mod_pow(2, 10, 1000), 24);
    println!("ok");
}`,
    tags: ['math', 'modular-arithmetic', 'exponentiation-by-squaring'],
  },
  {
    id: 'ds-ch15-c-024',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'List All Divisors',
    prompt: `Implement:

    fn list_divisors(n: u64) -> Vec<u64>

Return all positive divisors of n in sorted ascending order.
For n == 1 return [1].
Example: list_divisors(28) -> [1, 2, 4, 7, 14, 28]`,
    hints: ['Iterate i from 1 to sqrt(n); collect both i and n/i when i divides n.', 'Sort the result before returning.', 'Avoid duplicates when i == n/i (perfect square root).'],
    solution: `fn list_divisors(n: u64) -> Vec<u64> {
    let mut divs = Vec::new();
    let mut i = 1u64;
    while i * i <= n {
        if n % i == 0 {
            divs.push(i);
            if i != n / i { divs.push(n / i); }
        }
        i += 1;
    }
    divs.sort();
    divs
}

fn main() {
    assert_eq!(list_divisors(1), vec![1]);
    assert_eq!(list_divisors(6), vec![1,2,3,6]);
    assert_eq!(list_divisors(12), vec![1,2,3,4,6,12]);
    assert_eq!(list_divisors(28), vec![1,2,4,7,14,28]);
    println!("ok");
}`,
    starter: `fn list_divisors(n: u64) -> Vec<u64> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(list_divisors(6), vec![1,2,3,6]);
    println!("ok");
}`,
    tags: ['math', 'divisors'],
  },
  {
    id: 'ds-ch15-c-025',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Real Base Power with Integer Exponent',
    prompt: `Implement:

    fn my_pow(x: f64, n: i32) -> f64

Compute x raised to the integer power n.
Handle negative exponents by computing 1 / x^|n|.
Use exponentiation by squaring for O(log |n|) time.
Example: my_pow(2.0, -2) -> 0.25, my_pow(2.1, 3) -> 9.261 (approximately)`,
    hints: ['For negative n, set base to 1.0/x and use |n| as the exponent.', 'Be careful converting n to u32 when n == i32::MIN; cast through i64 first.', 'Use floating-point squaring the same way as integer exponentiation.'],
    solution: `fn my_pow(x: f64, n: i32) -> f64 {
    if n == 0 { return 1.0; }
    let (mut base, _negative) = if n < 0 { (1.0 / x, true) } else { (x, false) };
    let mut exp: u32 = if n < 0 { (-(n as i64)) as u32 } else { n as u32 };
    let mut result = 1.0f64;
    while exp > 0 {
        if exp & 1 == 1 { result *= base; }
        base *= base;
        exp >>= 1;
    }
    result
}

fn main() {
    let eps = 1e-9;
    assert!((my_pow(2.0, 10) - 1024.0).abs() < eps);
    assert!((my_pow(2.0, -2) - 0.25).abs() < eps);
    assert!((my_pow(3.0, 0) - 1.0).abs() < eps);
    assert!((my_pow(2.1, 3) - 9.261).abs() < 1e-6);
    println!("ok");
}`,
    starter: `fn my_pow(x: f64, n: i32) -> f64 {
    // TODO
    todo!()
}

fn main() {
    assert!((my_pow(2.0, 10) - 1024.0).abs() < 1e-9);
    println!("ok");
}`,
    tags: ['math', 'power', 'floating-point'],
  },
  {
    id: 'ds-ch15-c-026',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Nth Catalan Number',
    prompt: `Implement:

    fn catalan(n: u64) -> u64

Return the nth Catalan number (0-indexed).
C(0)=1, C(1)=1, C(2)=2, C(3)=5, C(4)=14, C(5)=42 ...
Use the recurrence C(n) = C(n-1) * 2*(2n-1) / (n+1) for an iterative approach.
Example: catalan(9) -> 4862`,
    hints: ['Start from C(0)=1 and apply the recurrence step by step.', 'The division is always exact, so integer arithmetic works.', 'C(n) = C(2n, n) / (n+1) is the closed form.'],
    solution: `fn catalan(n: u64) -> u64 {
    if n == 0 { return 1; }
    let mut c = 1u64;
    for k in 1..=n {
        c = c * 2 * (2 * k - 1) / (k + 1);
    }
    c
}

fn main() {
    let expected = [1u64,1,2,5,14,42,132,429,1430,4862];
    for (i, &e) in expected.iter().enumerate() {
        assert_eq!(catalan(i as u64), e, "catalan({i})");
    }
    println!("ok");
}`,
    starter: `fn catalan(n: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(catalan(5), 42);
    println!("ok");
}`,
    tags: ['math', 'catalan', 'combinatorics'],
  },
  {
    id: 'ds-ch15-c-027',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Modular Multiplicative Inverse via Fermat',
    prompt: `Implement:

    fn mod_inverse(a: u64, p: u64) -> u64

Return the modular multiplicative inverse of a modulo a prime p.
That is, find x such that (a * x) mod p == 1.
Use Fermats little theorem: the inverse equals a^(p-2) mod p.
Assume p is prime and a is not divisible by p.
Example: mod_inverse(3, 7) -> 5  (3*5=15, 15 mod 7 = 1)`,
    hints: ['Call your mod_pow helper with exponent p-2.', 'Verify by checking (a * inverse) % p == 1.', 'Works only when p is prime (Fermats little theorem requires this).'],
    solution: `fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    if modulus == 1 { return 0; }
    let mut result = 1u64;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 { result = result * base % modulus; }
        base = base * base % modulus;
        exp >>= 1;
    }
    result
}

fn mod_inverse(a: u64, p: u64) -> u64 {
    mod_pow(a, p - 2, p)
}

fn main() {
    let p = 1_000_000_007u64;
    for a in [2u64, 3, 5, 7, 11, 13] {
        let inv = mod_inverse(a, p);
        assert_eq!((a * inv) % p, 1, "a={a}");
    }
    let p2 = 17u64;
    let brute = |a: u64, m: u64| -> u64 {
        for x in 1..m { if (a * x) % m == 1 { return x; } }
        0
    };
    for a in [2u64,3,5,7,11,13,16] {
        assert_eq!(mod_inverse(a, p2), brute(a, p2), "a={a} p={p2}");
    }
    println!("ok");
}`,
    starter: `fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    if modulus == 1 { return 0; }
    let mut result = 1u64;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 { result = result * base % modulus; }
        base = base * base % modulus;
        exp >>= 1;
    }
    result
}

fn mod_inverse(a: u64, p: u64) -> u64 {
    // TODO: use Fermat little theorem
    todo!()
}

fn main() {
    assert_eq!((3 * mod_inverse(3, 7)) % 7, 1);
    println!("ok");
}`,
    tags: ['math', 'modular-arithmetic', 'fermat', 'inverse'],
  },
  {
    id: 'ds-ch15-c-028',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Primes with Linear Sieve',
    prompt: `Implement:

    fn count_primes_linear(n: usize) -> usize

Count the number of primes strictly less than n using the linear sieve (time complexity O(n)).
The linear sieve marks each composite number exactly once by its smallest prime factor.
Verify your answer against a standard Eratosthenes sieve.
Example: count_primes_linear(1_000_000) -> 78498`,
    hints: ['Maintain a list of discovered primes; for each i, mark i*p as composite for each prime p <= spf[i].', 'Break the inner loop as soon as p divides i to ensure each composite is marked once.', 'Cross-check with a classic sieve for correctness on small n.'],
    solution: `fn count_primes_linear(n: usize) -> usize {
    if n < 2 { return 0; }
    let mut is_prime = vec![true; n];
    is_prime[0] = false;
    is_prime[1] = false;
    let mut primes: Vec<usize> = Vec::new();
    for i in 2..n {
        if is_prime[i] { primes.push(i); }
        for &p in &primes {
            if i * p >= n { break; }
            is_prime[i * p] = false;
            if i % p == 0 { break; }
        }
    }
    primes.len()
}

fn count_primes_basic(n: usize) -> usize {
    if n < 2 { return 0; }
    let mut sieve = vec![true; n];
    sieve[0] = false; sieve[1] = false;
    let mut i = 2;
    while i * i < n {
        if sieve[i] {
            let mut j = i * i;
            while j < n { sieve[j] = false; j += i; }
        }
        i += 1;
    }
    sieve.iter().filter(|&&v| v).count()
}

fn main() {
    for n in [0,1,2,3,10,20,100,1000,10000] {
        assert_eq!(count_primes_linear(n), count_primes_basic(n), "n={n}");
    }
    assert_eq!(count_primes_linear(1_000_000), 78498);
    println!("ok");
}`,
    starter: `fn count_primes_linear(n: usize) -> usize {
    // TODO: implement linear sieve
    todo!()
}

fn main() {
    assert_eq!(count_primes_linear(10), 4);
    println!("ok");
}`,
    tags: ['math', 'sieve', 'prime', 'linear-sieve'],
  },
  {
    id: 'ds-ch15-c-029',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Smallest Prime Factor Sieve for Fast Queries',
    prompt: `Implement:

    fn build_spf(limit: usize) -> Vec<usize>
    fn factorize_with_spf(n: usize, spf: &[usize]) -> Vec<usize>

build_spf returns a vector where spf[i] is the smallest prime factor of i (for i >= 2).
factorize_with_spf uses the spf array to factorize n in O(log n) time.
The factorization is returned as a sorted vector with repetition.
Example: build_spf and factorize_with_spf(12, ...) -> [2, 2, 3]`,
    hints: ['Initialize spf[i] = i, then sieve: for each prime p, update spf[j] = p for multiples j of p where spf[j] was not already set.', 'To factorize n: repeatedly divide by spf[n] and record the factor.', 'spf[p] == p for prime p.'],
    solution: `fn build_spf(limit: usize) -> Vec<usize> {
    let mut spf: Vec<usize> = (0..limit).collect();
    let mut i = 2;
    while i * i < limit {
        if spf[i] == i {
            let mut j = i * i;
            while j < limit {
                if spf[j] == j { spf[j] = i; }
                j += i;
            }
        }
        i += 1;
    }
    spf
}

fn factorize_with_spf(mut n: usize, spf: &[usize]) -> Vec<usize> {
    let mut factors = Vec::new();
    while n > 1 {
        factors.push(spf[n]);
        n /= spf[n];
    }
    factors
}

fn main() {
    let spf = build_spf(100);
    assert_eq!(factorize_with_spf(1, &spf), vec![]);
    assert_eq!(factorize_with_spf(12, &spf), vec![2,2,3]);
    assert_eq!(factorize_with_spf(30, &spf), vec![2,3,5]);
    assert_eq!(factorize_with_spf(97, &spf), vec![97]);
    for p in [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47] {
        assert_eq!(spf[p], p, "prime {p}");
    }
    println!("ok");
}`,
    starter: `fn build_spf(limit: usize) -> Vec<usize> {
    // TODO
    todo!()
}

fn factorize_with_spf(n: usize, spf: &[usize]) -> Vec<usize> {
    // TODO
    todo!()
}

fn main() {
    let spf = build_spf(100);
    assert_eq!(factorize_with_spf(12, &spf), vec![2,2,3]);
    println!("ok");
}`,
    tags: ['math', 'sieve', 'smallest-prime-factor', 'factorization'],
  },
  {
    id: 'ds-ch15-c-030',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Modular Binomial Coefficient',
    prompt: `Implement:

    fn mod_comb(n: u64, k: u64, p: u64) -> u64

Return C(n, k) mod p where p is a prime.
Use modular factorial and Fermats little theorem to compute the modular inverse of the denominator.
Return 0 when k > n.
Example: mod_comb(20, 10, 1_000_000_007) -> 184756`,
    hints: ['Compute n! mod p, k! mod p, and (n-k)! mod p separately.', 'Multiply n! by the modular inverse of (k! * (n-k)! mod p).', 'The inverse of x mod p is x^(p-2) mod p by Fermats little theorem.'],
    solution: `fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    if modulus == 1 { return 0; }
    let mut result = 1u64;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 { result = result * base % modulus; }
        base = base * base % modulus;
        exp >>= 1;
    }
    result
}

fn mod_factorial(n: u64, p: u64) -> u64 {
    let mut result = 1u64;
    for i in 2..=n {
        result = result * (i % p) % p;
    }
    result
}

fn mod_comb(n: u64, k: u64, p: u64) -> u64 {
    if k > n { return 0; }
    let num = mod_factorial(n, p);
    let den = mod_factorial(k, p) * mod_factorial(n - k, p) % p;
    num * mod_pow(den, p - 2, p) % p
}

fn main() {
    let p = 1_000_000_007u64;
    assert_eq!(mod_comb(5, 2, p), 10);
    assert_eq!(mod_comb(10, 3, p), 120);
    assert_eq!(mod_comb(0, 0, p), 1);
    assert_eq!(mod_comb(5, 0, p), 1);
    assert_eq!(mod_comb(5, 5, p), 1);
    assert_eq!(mod_comb(3, 5, p), 0);
    assert_eq!(mod_comb(20, 10, p), 184756);
    println!("ok");
}`,
    starter: `fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    if modulus == 1 { return 0; }
    let mut result = 1u64;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 { result = result * base % modulus; }
        base = base * base % modulus;
        exp >>= 1;
    }
    result
}

fn mod_comb(n: u64, k: u64, p: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    let p = 1_000_000_007u64;
    assert_eq!(mod_comb(5, 2, p), 10);
    println!("ok");
}`,
    tags: ['math', 'combinatorics', 'modular-arithmetic', 'fermat'],
  },
]

export default problems
