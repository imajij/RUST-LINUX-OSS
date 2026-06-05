import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch03-c-036',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Swap Two Values Without A Temp',
    prompt: `Write a function fn swap(a: i32, b: i32) -> (i32, i32) that returns its two parameters with their order reversed, as a tuple. In main, call swap(3, 8), destructure the result into x and y, and print:

x = 8, y = 3

Do not use any helper from the standard library; just build and return the tuple.`,
    hints: [
      'A function may return a tuple by writing (value1, value2) as its final expression.',
      'Reversing the order is just returning (b, a).',
    ],
    solution: `fn swap(a: i32, b: i32) -> (i32, i32) {
    (b, a)
}

fn main() {
    let (x, y) = swap(3, 8);
    println!("x = {}, y = {}", x, y);
}`,
    starter: `fn swap(a: i32, b: i32) -> (i32, i32) {
    // TODO: return the two values in reversed order
}

fn main() {
    let (x, y) = swap(3, 8);
    println!("x = {}, y = {}", x, y);
}`,
    tags: ['tuples', 'functions', 'destructuring'],
  },
  {
    id: 'rs-ch03-c-037',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Clamp A Value Into A Range',
    prompt: `Write a function fn clamp(value: i32, low: i32, high: i32) -> i32 that returns low if value is below low, high if value is above high, and value otherwise. Use if/else expressions (no standard-library clamp). In main, print one result per line for the calls clamp(5, 0, 10), clamp(-3, 0, 10), and clamp(99, 0, 10):

5
0
10`,
    hints: [
      'Compare value against low and high with an if / else if / else chain.',
      'You can return directly from each branch, or use an if expression as the final value.',
    ],
    solution: `fn clamp(value: i32, low: i32, high: i32) -> i32 {
    if value < low {
        low
    } else if value > high {
        high
    } else {
        value
    }
}

fn main() {
    println!("{}", clamp(5, 0, 10));
    println!("{}", clamp(-3, 0, 10));
    println!("{}", clamp(99, 0, 10));
}`,
    starter: `fn clamp(value: i32, low: i32, high: i32) -> i32 {
    // TODO: return low, high, or value depending on the range
}

fn main() {
    println!("{}", clamp(5, 0, 10));
    println!("{}", clamp(-3, 0, 10));
    println!("{}", clamp(99, 0, 10));
}`,
    tags: ['functions', 'if-else', 'control-flow'],
  },
  {
    id: 'rs-ch03-c-038',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Greatest Common Divisor',
    prompt: `Write a function fn gcd(a: u32, b: u32) -> u32 that returns the greatest common divisor of a and b using the Euclidean algorithm with a while loop (repeatedly replace the pair, putting the remainder of the old pair into the second slot). In main, print:

gcd(48, 36) = 12`,
    hints: [
      'Keep two mut variables and loop while the second is not 0.',
      'Each step: the new pair is (old_b, old_a % old_b); use a temporary to hold the remainder.',
    ],
    solution: `fn gcd(a: u32, b: u32) -> u32 {
    let mut x = a;
    let mut y = b;
    while y != 0 {
        let remainder = x % y;
        x = y;
        y = remainder;
    }
    x
}

fn main() {
    println!("gcd(48, 36) = {}", gcd(48, 36));
}`,
    starter: `fn gcd(a: u32, b: u32) -> u32 {
    let mut x = a;
    let mut y = b;
    // TODO: Euclidean algorithm with a while loop, then return x
}

fn main() {
    println!("gcd(48, 36) = {}", gcd(48, 36));
}`,
    tags: ['loops', 'while', 'functions'],
  },
  {
    id: 'rs-ch03-c-039',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Power By Repeated Multiplication',
    prompt: `Write a function fn power(base: i64, exp: u32) -> i64 that computes base raised to exp by multiplying in a loop (define anything to the 0 as 1). Do not use the built-in pow method. In main, print:

power(2, 10) = 1024`,
    hints: [
      'Start a mut result at 1 and multiply it by base exp times.',
      'A for loop over 0..exp runs exactly exp iterations.',
    ],
    solution: `fn power(base: i64, exp: u32) -> i64 {
    let mut result = 1;
    for _ in 0..exp {
        result *= base;
    }
    result
}

fn main() {
    println!("power(2, 10) = {}", power(2, 10));
}`,
    starter: `fn power(base: i64, exp: u32) -> i64 {
    let mut result = 1;
    // TODO: multiply result by base exp times
}

fn main() {
    println!("power(2, 10) = {}", power(2, 10));
}`,
    tags: ['loops', 'functions', 'for'],
  },
  {
    id: 'rs-ch03-c-040',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Is This Number Prime',
    prompt: `Write a function fn is_prime(n: u32) -> bool that returns true if n is a prime number and false otherwise. Numbers less than 2 are not prime. Use a loop to test possible divisors from 2 up to n - 1. In main, print one line per call for is_prime(1), is_prime(2), is_prime(9), and is_prime(13):

false
true
false
true`,
    hints: [
      'Handle n < 2 up front by returning false.',
      'Loop a divisor d over 2..n; if n % d == 0 then n is not prime.',
    ],
    solution: `fn is_prime(n: u32) -> bool {
    if n < 2 {
        return false;
    }
    let mut d = 2;
    while d < n {
        if n % d == 0 {
            return false;
        }
        d += 1;
    }
    true
}

fn main() {
    println!("{}", is_prime(1));
    println!("{}", is_prime(2));
    println!("{}", is_prime(9));
    println!("{}", is_prime(13));
}`,
    starter: `fn is_prime(n: u32) -> bool {
    // TODO: return whether n is prime
}

fn main() {
    println!("{}", is_prime(1));
    println!("{}", is_prime(2));
    println!("{}", is_prime(9));
    println!("{}", is_prime(13));
}`,
    tags: ['loops', 'functions', 'bool'],
  },
  {
    id: 'rs-ch03-c-041',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum Of Digits',
    prompt: `Write a function fn digit_sum(mut n: u32) -> u32 that returns the sum of the decimal digits of n using a while loop: repeatedly add n % 10 to a total and divide n by 10 until n is 0. In main, print:

digit_sum(8675309) = 38`,
    hints: [
      'n % 10 gives the last digit; n / 10 removes it (integer division).',
      'Marking the parameter mut lets you modify n inside the function.',
    ],
    solution: `fn digit_sum(mut n: u32) -> u32 {
    let mut total = 0;
    while n > 0 {
        total += n % 10;
        n /= 10;
    }
    total
}

fn main() {
    println!("digit_sum(8675309) = {}", digit_sum(8675309));
}`,
    starter: `fn digit_sum(mut n: u32) -> u32 {
    let mut total = 0;
    // TODO: peel off digits with % 10 and / 10
}

fn main() {
    println!("digit_sum(8675309) = {}", digit_sum(8675309));
}`,
    tags: ['loops', 'while', 'functions'],
  },
  {
    id: 'rs-ch03-c-042',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Digits In A Number',
    prompt: `Write a function fn count_digits(n: u32) -> u32 that returns how many decimal digits n has. The number 0 has 1 digit. Use a loop that repeatedly divides a working copy by 10. In main, print one line per call for count_digits(0), count_digits(7), and count_digits(12345):

1
1
5`,
    hints: [
      'Start the count at 1 and divide a working copy of n by 10 until it is below 10.',
      'Shadow or use a mut copy of n inside the loop so you do not modify the parameter directly.',
    ],
    solution: `fn count_digits(n: u32) -> u32 {
    let mut value = n;
    let mut count = 1;
    while value >= 10 {
        value /= 10;
        count += 1;
    }
    count
}

fn main() {
    println!("{}", count_digits(0));
    println!("{}", count_digits(7));
    println!("{}", count_digits(12345));
}`,
    starter: `fn count_digits(n: u32) -> u32 {
    let mut value = n;
    let mut count = 1;
    // TODO: divide value by 10 until it is below 10, counting steps
}

fn main() {
    println!("{}", count_digits(0));
    println!("{}", count_digits(7));
    println!("{}", count_digits(12345));
}`,
    tags: ['loops', 'while', 'functions'],
  },
  {
    id: 'rs-ch03-c-043',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reverse The Digits Of An Integer',
    prompt: `Write a function fn reverse_number(n: u32) -> u32 that returns the integer formed by reversing the decimal digits of n (for example 1230 becomes 0321 which is just 321). Build the result in a loop by multiplying an accumulator by 10 and adding the next digit. In main, print:

reverse_number(1234) = 4321`,
    hints: [
      'Each step: result = result * 10 + (n % 10), then n /= 10.',
      'Use a mut copy of n and a mut result starting at 0; loop while the copy is greater than 0.',
    ],
    solution: `fn reverse_number(n: u32) -> u32 {
    let mut value = n;
    let mut result = 0;
    while value > 0 {
        result = result * 10 + value % 10;
        value /= 10;
    }
    result
}

fn main() {
    println!("reverse_number(1234) = {}", reverse_number(1234));
}`,
    starter: `fn reverse_number(n: u32) -> u32 {
    let mut value = n;
    let mut result = 0;
    // TODO: pull digits off value and push them onto result
}

fn main() {
    println!("reverse_number(1234) = {}", reverse_number(1234));
}`,
    tags: ['loops', 'while', 'functions'],
  },
  {
    id: 'rs-ch03-c-044',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Palindromic Number Check',
    prompt: `Write a function fn is_palindrome(n: u32) -> bool that returns true when the decimal digits of n read the same forwards and backwards. Compute the reverse of n with a loop and compare it to the original. In main, print one line per call for is_palindrome(1221), is_palindrome(123), and is_palindrome(7):

true
false
true`,
    hints: [
      'Reverse n into a new integer using the multiply-by-10-and-add-remainder technique.',
      'Compare the reversed value to the original n; return the comparison as a bool.',
    ],
    solution: `fn is_palindrome(n: u32) -> bool {
    let mut value = n;
    let mut reversed = 0;
    while value > 0 {
        reversed = reversed * 10 + value % 10;
        value /= 10;
    }
    reversed == n
}

fn main() {
    println!("{}", is_palindrome(1221));
    println!("{}", is_palindrome(123));
    println!("{}", is_palindrome(7));
}`,
    starter: `fn is_palindrome(n: u32) -> bool {
    // TODO: reverse n with a loop, then compare to the original
}

fn main() {
    println!("{}", is_palindrome(1221));
    println!("{}", is_palindrome(123));
    println!("{}", is_palindrome(7));
}`,
    tags: ['loops', 'functions', 'bool'],
  },
  {
    id: 'rs-ch03-c-045',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Collatz Step Counter',
    prompt: `Write a function fn collatz_steps(n: u32) -> u32 that returns how many steps it takes to reach 1 under the Collatz rule: if the current value is even, halve it; if odd, multiply by 3 and add 1. Count each step with a while loop. In main, print:

collatz_steps(6) = 8`,
    hints: [
      'Use a mut working value initialized to n and a mut counter starting at 0.',
      'Loop while the value is not 1; choose the even or odd branch with an if/else.',
    ],
    solution: `fn collatz_steps(n: u32) -> u32 {
    let mut value = n;
    let mut steps = 0;
    while value != 1 {
        if value % 2 == 0 {
            value /= 2;
        } else {
            value = 3 * value + 1;
        }
        steps += 1;
    }
    steps
}

fn main() {
    println!("collatz_steps(6) = {}", collatz_steps(6));
}`,
    starter: `fn collatz_steps(n: u32) -> u32 {
    let mut value = n;
    let mut steps = 0;
    // TODO: apply the Collatz rule until value is 1, counting steps
}

fn main() {
    println!("collatz_steps(6) = {}", collatz_steps(6));
}`,
    tags: ['loops', 'while', 'control-flow'],
  },
  {
    id: 'rs-ch03-c-046',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Celsius To Kelvin And Back',
    prompt: `Write a function fn round_trip(c: f64) -> f64 that converts a Celsius temperature to Kelvin (add 273.15) and then back to Celsius (subtract 273.15), returning the final Celsius value. This checks that your float arithmetic round-trips. In main, print:

round_trip(25) = 25`,
    hints: [
      'Use shadowing or new bindings: let kelvin = c + 273.15; then subtract it back.',
      'Keep all literals as floats so the type stays f64.',
    ],
    solution: `fn round_trip(c: f64) -> f64 {
    let kelvin = c + 273.15;
    let back = kelvin - 273.15;
    back
}

fn main() {
    println!("round_trip(25) = {}", round_trip(25.0));
}`,
    starter: `fn round_trip(c: f64) -> f64 {
    // TODO: convert to Kelvin and back, returning the Celsius value
}

fn main() {
    println!("round_trip(25) = {}", round_trip(25.0));
}`,
    tags: ['f64', 'functions', 'shadowing'],
  },
  {
    id: 'rs-ch03-c-047',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Dot Product Of Two Vectors',
    prompt: `Write a function fn dot(a: [i32; 3], b: [i32; 3]) -> i32 that returns the dot product of two length-3 arrays: the sum of a[i] * b[i] for each index i. Use a for loop over a range of indices. In main, call it on [1, 2, 3] and [4, 5, 6] and print:

dot = 32`,
    hints: [
      'Iterate the index with for i in 0..3 so you can read both arrays at the same position.',
      'Accumulate a[i] * b[i] into a mut total.',
    ],
    solution: `fn dot(a: [i32; 3], b: [i32; 3]) -> i32 {
    let mut total = 0;
    for i in 0..3 {
        total += a[i] * b[i];
    }
    total
}

fn main() {
    println!("dot = {}", dot([1, 2, 3], [4, 5, 6]));
}`,
    starter: `fn dot(a: [i32; 3], b: [i32; 3]) -> i32 {
    let mut total = 0;
    // TODO: loop over indices 0..3 and sum a[i] * b[i]
}

fn main() {
    println!("dot = {}", dot([1, 2, 3], [4, 5, 6]));
}`,
    tags: ['arrays', 'loops', 'indexing'],
  },
  {
    id: 'rs-ch03-c-048',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Grade From A Numeric Score',
    prompt: `Write a function fn grade(score: u32) -> char that returns a letter grade as a char: 'A' for 90 and above, 'B' for 80 to 89, 'C' for 70 to 79, 'D' for 60 to 69, and 'F' below 60. Use an if/else if chain whose result is the function's return value. In main, print one line per call for grade(95), grade(72), and grade(40):

A
C
F`,
    hints: [
      'A char is returned with single-quote literals, like the letter A.',
      'Let the whole if/else chain be the final expression of the function.',
    ],
    solution: `fn grade(score: u32) -> char {
    if score >= 90 {
        'A'
    } else if score >= 80 {
        'B'
    } else if score >= 70 {
        'C'
    } else if score >= 60 {
        'D'
    } else {
        'F'
    }
}

fn main() {
    println!("{}", grade(95));
    println!("{}", grade(72));
    println!("{}", grade(40));
}`,
    starter: `fn grade(score: u32) -> char {
    // TODO: return a letter grade char based on the score
}

fn main() {
    println!("{}", grade(95));
    println!("{}", grade(72));
    println!("{}", grade(40));
}`,
    tags: ['char', 'if-else', 'functions'],
  },
  {
    id: 'rs-ch03-c-049',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Leap Year Decision Expression',
    prompt: `Write a function fn is_leap_year(year: u32) -> bool that returns true for leap years: a year divisible by 4 is a leap year, except years divisible by 100 are not, unless they are also divisible by 400. Express the rule as a single boolean expression (no if needed). In main, print one line per call for is_leap_year(2000), is_leap_year(1900), and is_leap_year(2024):

true
false
true`,
    hints: [
      'Combine conditions with && (and) and || (or).',
      'The rule is: divisible by 4 AND (not divisible by 100 OR divisible by 400).',
    ],
    solution: `fn is_leap_year(year: u32) -> bool {
    year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
}

fn main() {
    println!("{}", is_leap_year(2000));
    println!("{}", is_leap_year(1900));
    println!("{}", is_leap_year(2024));
}`,
    starter: `fn is_leap_year(year: u32) -> bool {
    // TODO: return the leap-year rule as one boolean expression
}

fn main() {
    println!("{}", is_leap_year(2000));
    println!("{}", is_leap_year(1900));
    println!("{}", is_leap_year(2024));
}`,
    tags: ['bool', 'functions', 'control-flow'],
  },
  {
    id: 'rs-ch03-c-050',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Elements Above A Threshold',
    prompt: `Write a function fn count_above(arr: [i32; 6], threshold: i32) -> u32 that returns how many elements of the array are strictly greater than threshold, using a for loop. In main, call it on [10, 4, 22, 7, 18, 3] with threshold 9 and print:

above = 3`,
    hints: [
      'Iterate the array with for value in arr.',
      'Increment a mut counter whenever value > threshold.',
    ],
    solution: `fn count_above(arr: [i32; 6], threshold: i32) -> u32 {
    let mut count = 0;
    for value in arr {
        if value > threshold {
            count += 1;
        }
    }
    count
}

fn main() {
    println!("above = {}", count_above([10, 4, 22, 7, 18, 3], 9));
}`,
    starter: `fn count_above(arr: [i32; 6], threshold: i32) -> u32 {
    let mut count = 0;
    // TODO: count elements strictly greater than threshold
}

fn main() {
    println!("above = {}", count_above([10, 4, 22, 7, 18, 3], 9));
}`,
    tags: ['arrays', 'loops', 'functions'],
  },
  {
    id: 'rs-ch03-c-051',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Linear Search Returning An Index',
    prompt: `Write a function fn find(arr: [i32; 5], target: i32) -> i32 that returns the index of the first element equal to target, or -1 if it is not present. Use a for loop over indices and return as soon as you find a match. In main, print one line per call for find([5, 8, 2, 9, 4], 9) and find([5, 8, 2, 9, 4], 7):

3
-1`,
    hints: [
      'Loop the index with for i in 0..5 and compare arr[i] to target.',
      'Use return i as i32; on a match; fall through to return -1; after the loop.',
    ],
    solution: `fn find(arr: [i32; 5], target: i32) -> i32 {
    for i in 0..5 {
        if arr[i] == target {
            return i as i32;
        }
    }
    -1
}

fn main() {
    println!("{}", find([5, 8, 2, 9, 4], 9));
    println!("{}", find([5, 8, 2, 9, 4], 7));
}`,
    starter: `fn find(arr: [i32; 5], target: i32) -> i32 {
    // TODO: return the index of target, or -1 if absent
}

fn main() {
    println!("{}", find([5, 8, 2, 9, 4], 9));
    println!("{}", find([5, 8, 2, 9, 4], 7));
}`,
    tags: ['arrays', 'loops', 'indexing'],
  },
  {
    id: 'rs-ch03-c-052',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Wrapping Add To Avoid Overflow',
    prompt: `The value 255u8 is the largest a u8 can hold, so adding 1 normally would overflow. Using the wrapping_add method on a u8, compute 255u8 wrapping-added to 1 and also 250u8 wrapping-added to 10, then print:

wrap1 = 0
wrap2 = 4

This shows how u8 arithmetic wraps around its range of 0 to 255.`,
    hints: [
      'A u8 holds values 0 through 255; going past 255 wraps back to 0.',
      'Use the method form value.wrapping_add(other) to get defined wrapping behavior.',
    ],
    solution: `fn main() {
    let a: u8 = 255;
    let b: u8 = 250;
    let wrap1 = a.wrapping_add(1);
    let wrap2 = b.wrapping_add(10);
    println!("wrap1 = {}", wrap1);
    println!("wrap2 = {}", wrap2);
}`,
    starter: `fn main() {
    let a: u8 = 255;
    let b: u8 = 250;
    // TODO: use wrapping_add and print wrap1 and wrap2
}`,
    tags: ['u8', 'overflow', 'types'],
  },
  {
    id: 'rs-ch03-c-053',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Triangle Of Stars',
    prompt: `Using nested for loops, print a right triangle of asterisks with 5 rows, where row k contains k stars (no spaces). The output must be exactly:

*
**
***
****
*****

Hint: the outer loop chooses the row, the inner loop prints the stars, and you print a newline after each row.`,
    hints: [
      'Outer loop: for row in 1..=5. Inner loop: print one star row times.',
      'Use print! (no newline) for each star, then a println!() to end the row.',
    ],
    solution: `fn main() {
    for row in 1..=5 {
        for _ in 0..row {
            print!("*");
        }
        println!();
    }
}`,
    starter: `fn main() {
    for row in 1..=5 {
        // TODO: print row stars with no newline, then end the line
    }
}`,
    tags: ['loops', 'for', 'nested-loops'],
  },
  {
    id: 'rs-ch03-c-054',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum Of Squares In A Range',
    prompt: `Write a function fn sum_of_squares(n: u32) -> u32 that returns the sum of the squares of every integer from 1 through n inclusive, using a for loop over a range. In main, print:

sum_of_squares(4) = 30

(because 1 + 4 + 9 + 16 = 30).`,
    hints: [
      'Square each value with i * i before adding it to the total.',
      'Iterate with for i in 1..=n and accumulate into a mut total.',
    ],
    solution: `fn sum_of_squares(n: u32) -> u32 {
    let mut total = 0;
    for i in 1..=n {
        total += i * i;
    }
    total
}

fn main() {
    println!("sum_of_squares(4) = {}", sum_of_squares(4));
}`,
    starter: `fn sum_of_squares(n: u32) -> u32 {
    let mut total = 0;
    // TODO: add i * i for each i in 1..=n
}

fn main() {
    println!("sum_of_squares(4) = {}", sum_of_squares(4));
}`,
    tags: ['loops', 'functions', 'for'],
  },
  {
    id: 'rs-ch03-c-055',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Multiples In A Range',
    prompt: `Write a function fn count_multiples(limit: u32, divisor: u32) -> u32 that returns how many integers from 1 through limit inclusive are evenly divisible by divisor. Use a for loop and the remainder operator. In main, print one line per call for count_multiples(20, 3) and count_multiples(100, 7):

6
14`,
    hints: [
      'A number i is a multiple of divisor when i % divisor == 0.',
      'Loop i over 1..=limit and count the matches.',
    ],
    solution: `fn count_multiples(limit: u32, divisor: u32) -> u32 {
    let mut count = 0;
    for i in 1..=limit {
        if i % divisor == 0 {
            count += 1;
        }
    }
    count
}

fn main() {
    println!("{}", count_multiples(20, 3));
    println!("{}", count_multiples(100, 7));
}`,
    starter: `fn count_multiples(limit: u32, divisor: u32) -> u32 {
    let mut count = 0;
    // TODO: count values in 1..=limit divisible by divisor
}

fn main() {
    println!("{}", count_multiples(20, 3));
    println!("{}", count_multiples(100, 7));
}`,
    tags: ['loops', 'functions', 'for'],
  },
  {
    id: 'rs-ch03-c-056',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Distance Between Two Points',
    prompt: `Write a function fn distance(p: (f64, f64), q: (f64, f64)) -> f64 that returns the Euclidean distance between two points given as tuples. Destructure each tuple, compute the differences, and use the sqrt method on an f64. In main, print:

distance = 5

for the points (0.0, 0.0) and (3.0, 4.0).`,
    hints: [
      'Destructure with let (x1, y1) = p; and let (x2, y2) = q;',
      'The distance is (dx * dx + dy * dy).sqrt(); sqrt is a method on f64.',
    ],
    solution: `fn distance(p: (f64, f64), q: (f64, f64)) -> f64 {
    let (x1, y1) = p;
    let (x2, y2) = q;
    let dx = x2 - x1;
    let dy = y2 - y1;
    (dx * dx + dy * dy).sqrt()
}

fn main() {
    println!("distance = {}", distance((0.0, 0.0), (3.0, 4.0)));
}`,
    starter: `fn distance(p: (f64, f64), q: (f64, f64)) -> f64 {
    // TODO: destructure both points and return the Euclidean distance
}

fn main() {
    println!("distance = {}", distance((0.0, 0.0), (3.0, 4.0)));
}`,
    tags: ['tuples', 'f64', 'destructuring'],
  },
  {
    id: 'rs-ch03-c-057',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Running Total Printed Each Step',
    prompt: `Given the array prices = [3, 5, 2, 8], iterate over its elements with a for loop and print the running total after adding each element, one per line. The output must be exactly:

3
8
10
18`,
    hints: [
      'Keep a mut total starting at 0 before the loop.',
      'Add the current element to total, then print total inside the loop body.',
    ],
    solution: `fn main() {
    let prices = [3, 5, 2, 8];
    let mut total = 0;
    for price in prices {
        total += price;
        println!("{}", total);
    }
}`,
    starter: `fn main() {
    let prices = [3, 5, 2, 8];
    let mut total = 0;
    // TODO: print the running total after each element
}`,
    tags: ['arrays', 'loops', 'for'],
  },
  {
    id: 'rs-ch03-c-058',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sign Of A Number As A Char',
    prompt: `Write a function fn sign(n: i32) -> char that returns the char '+' when n is positive, '-' when n is negative, and '0' when n is zero. Use an if as an expression. In main, print one line per call for sign(7), sign(-2), and sign(0):

+
-
0`,
    hints: [
      'Return char literals like the plus sign in single quotes.',
      'The if/else if/else chain can be the function body with no semicolon on the final expression.',
    ],
    solution: `fn sign(n: i32) -> char {
    if n > 0 {
        '+'
    } else if n < 0 {
        '-'
    } else {
        '0'
    }
}

fn main() {
    println!("{}", sign(7));
    println!("{}", sign(-2));
    println!("{}", sign(0));
}`,
    starter: `fn sign(n: i32) -> char {
    // TODO: return '+', '-', or '0' based on the sign of n
}

fn main() {
    println!("{}", sign(7));
    println!("{}", sign(-2));
    println!("{}", sign(0));
}`,
    tags: ['char', 'if-else', 'functions'],
  },
  {
    id: 'rs-ch03-c-059',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Skip A Value With Continue',
    prompt: `Using a for loop over the range 1 through 10 inclusive, print every number except 5, which you must skip using the continue keyword. The output (one per line) starts at 1 and omits 5:

1
2
3
4
6
7
8
9
10`,
    hints: [
      'continue jumps to the next iteration of the loop, skipping the rest of the body.',
      'Test if i == 5 and continue before the println!.',
    ],
    solution: `fn main() {
    for i in 1..=10 {
        if i == 5 {
            continue;
        }
        println!("{}", i);
    }
}`,
    starter: `fn main() {
    for i in 1..=10 {
        // TODO: skip 5 with continue, otherwise print i
    }
}`,
    tags: ['loops', 'for', 'control-flow'],
  },
  {
    id: 'rs-ch03-c-060',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bank Balance Over Months',
    prompt: `Write a function fn balance_after(start: f64, rate: f64, months: u32) -> f64 that returns a balance after applying monthly growth: each month the balance is multiplied by (1.0 + rate). Use a for loop over the number of months. In main, with start 100.0, rate 0.1, and 2 months, print:

balance = 121.00000000000001

(Floating point is not exact; print whatever value the computation yields.)`,
    hints: [
      'Start a mut balance at the initial value, then update it each month.',
      'balance *= 1.0 + rate; inside a for loop that runs months times.',
    ],
    solution: `fn balance_after(start: f64, rate: f64, months: u32) -> f64 {
    let mut balance = start;
    for _ in 0..months {
        balance *= 1.0 + rate;
    }
    balance
}

fn main() {
    println!("balance = {}", balance_after(100.0, 0.1, 2));
}`,
    starter: `fn balance_after(start: f64, rate: f64, months: u32) -> f64 {
    let mut balance = start;
    // TODO: grow the balance by rate each month
}

fn main() {
    println!("balance = {}", balance_after(100.0, 0.1, 2));
}`,
    tags: ['loops', 'f64', 'functions'],
  },
  {
    id: 'rs-ch03-c-061',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Binary Digits Of A Number',
    prompt: `Write a function fn to_binary(n: u32) -> u32 that returns a u32 whose decimal digits are the binary representation of n (for example 5 becomes 101, and 13 becomes 1101). Treat 0 as 0. Build the result place-by-place using powers of ten so the binary digits line up. In main, print one line per call for to_binary(0), to_binary(5), and to_binary(13):

0
101
1101`,
    hints: [
      'Repeatedly take value % 2 to get the next binary digit and value / 2 to shift right.',
      'Place each binary digit at the next power of ten: result += (value % 2) * place; then place *= 10.',
    ],
    solution: `fn to_binary(n: u32) -> u32 {
    let mut value = n;
    let mut result = 0;
    let mut place = 1;
    while value > 0 {
        result += (value % 2) * place;
        place *= 10;
        value /= 2;
    }
    result
}

fn main() {
    println!("{}", to_binary(0));
    println!("{}", to_binary(5));
    println!("{}", to_binary(13));
}`,
    starter: `fn to_binary(n: u32) -> u32 {
    let mut value = n;
    let mut result = 0;
    let mut place = 1;
    // TODO: build the binary-as-decimal number with place values
}

fn main() {
    println!("{}", to_binary(0));
    println!("{}", to_binary(5));
    println!("{}", to_binary(13));
}`,
    tags: ['loops', 'while', 'functions'],
  },
  {
    id: 'rs-ch03-c-062',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Integer Square Root',
    prompt: `Write a function fn isqrt(n: u32) -> u32 that returns the largest integer r such that r * r is less than or equal to n, using only a loop (no sqrt method). In main, print one line per call for isqrt(0), isqrt(15), and isqrt(16):

0
3
4`,
    hints: [
      'Start a candidate at 0 and increase it while (candidate + 1) squared stays within n.',
      'A while loop with the condition (r + 1) * (r + 1) <= n keeps growing r safely.',
    ],
    solution: `fn isqrt(n: u32) -> u32 {
    let mut r = 0;
    while (r + 1) * (r + 1) <= n {
        r += 1;
    }
    r
}

fn main() {
    println!("{}", isqrt(0));
    println!("{}", isqrt(15));
    println!("{}", isqrt(16));
}`,
    starter: `fn isqrt(n: u32) -> u32 {
    let mut r = 0;
    // TODO: grow r while (r + 1) squared is still within n
}

fn main() {
    println!("{}", isqrt(0));
    println!("{}", isqrt(15));
    println!("{}", isqrt(16));
}`,
    tags: ['loops', 'while', 'functions'],
  },
  {
    id: 'rs-ch03-c-063',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Primes Below A Limit',
    prompt: `Write a function fn is_prime(n: u32) -> bool and a function fn count_primes(limit: u32) -> u32 that returns how many primes are strictly less than limit, by calling is_prime in a for loop. In main, print:

count_primes(20) = 8

(the primes below 20 are 2, 3, 5, 7, 11, 13, 17, 19).`,
    hints: [
      'Write is_prime first: numbers below 2 are not prime; test divisors up to n - 1.',
      'In count_primes, loop i over 2..limit and add 1 to a counter when is_prime(i) is true.',
    ],
    solution: `fn is_prime(n: u32) -> bool {
    if n < 2 {
        return false;
    }
    let mut d = 2;
    while d < n {
        if n % d == 0 {
            return false;
        }
        d += 1;
    }
    true
}

fn count_primes(limit: u32) -> u32 {
    let mut count = 0;
    for i in 2..limit {
        if is_prime(i) {
            count += 1;
        }
    }
    count
}

fn main() {
    println!("count_primes(20) = {}", count_primes(20));
}`,
    starter: `fn is_prime(n: u32) -> bool {
    // TODO: return whether n is prime
}

fn count_primes(limit: u32) -> u32 {
    // TODO: count primes strictly below limit using is_prime
}

fn main() {
    println!("count_primes(20) = {}", count_primes(20));
}`,
    tags: ['loops', 'functions', 'bool'],
  },
  {
    id: 'rs-ch03-c-064',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Find First Pair Summing To Target',
    prompt: `Given the array nums = [2, 7, 4, 5, 11] and a target of 9, use two nested loops with a label on the outer loop to find the first pair of distinct indices i < j whose elements sum to the target. Break out of both loops with the label and print the pair of indices:

i = 0, j = 1

(because nums[0] + nums[1] = 2 + 7 = 9).`,
    hints: [
      "Label the outer loop, for example with a name then a colon before for i in 0..nums.len().",
      "When nums[i] + nums[j] == target, record i and j, then break the labeled loop.",
    ],
    solution: `fn main() {
    let nums = [2, 7, 4, 5, 11];
    let target = 9;
    let mut found_i = 0;
    let mut found_j = 0;
    'search: for i in 0..nums.len() {
        for j in (i + 1)..nums.len() {
            if nums[i] + nums[j] == target {
                found_i = i;
                found_j = j;
                break 'search;
            }
        }
    }
    println!("i = {}, j = {}", found_i, found_j);
}`,
    starter: `fn main() {
    let nums = [2, 7, 4, 5, 11];
    let target = 9;
    let mut found_i = 0;
    let mut found_j = 0;
    // TODO: nested labeled loops to find the first pair summing to target
    println!("i = {}, j = {}", found_i, found_j);
}`,
    tags: ['arrays', 'labeled-loops', 'nested-loops'],
  },
  {
    id: 'rs-ch03-c-065',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Bubble Sort A Fixed Array',
    prompt: `Sort the array data = [5, 2, 9, 1, 7] into ascending order using bubble sort with nested loops, then print the smallest and largest values from the sorted array. Because the array must be mutated, declare it with mut and swap neighbors using a temporary variable. The output must be:

min = 1
max = 9`,
    hints: [
      'Bubble sort: repeatedly pass over the array, swapping data[k] and data[k+1] when out of order.',
      'After sorting, the smallest is at index 0 and the largest is at the last index.',
    ],
    solution: `fn main() {
    let mut data = [5, 2, 9, 1, 7];
    let n = data.len();
    for i in 0..n {
        for j in 0..(n - 1 - i) {
            if data[j] > data[j + 1] {
                let temp = data[j];
                data[j] = data[j + 1];
                data[j + 1] = temp;
            }
        }
    }
    println!("min = {}", data[0]);
    println!("max = {}", data[n - 1]);
}`,
    starter: `fn main() {
    let mut data = [5, 2, 9, 1, 7];
    let n = data.len();
    // TODO: bubble sort data, then print data[0] and data[n - 1]
}`,
    tags: ['arrays', 'nested-loops', 'mutability'],
  },
  {
    id: 'rs-ch03-c-066',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Fibonacci Below A Ceiling',
    prompt: `Write a function fn fib_below(ceiling: u64) -> u64 that returns the largest Fibonacci number strictly less than ceiling, where the sequence starts 0, 1, 1, 2, 3, 5, .... Use a loop that advances the pair until the next value would reach or exceed the ceiling, and break returning the value. In main, print:

fib_below(100) = 89`,
    hints: [
      'Track two mut variables for consecutive Fibonacci numbers.',
      'Use loop { ... } and break with the current value once the next one would be at least the ceiling.',
    ],
    solution: `fn fib_below(ceiling: u64) -> u64 {
    let mut a: u64 = 0;
    let mut b: u64 = 1;
    loop {
        let next = a + b;
        if next >= ceiling {
            break b;
        }
        a = b;
        b = next;
    }
}

fn main() {
    println!("fib_below(100) = {}", fib_below(100));
}`,
    starter: `fn fib_below(ceiling: u64) -> u64 {
    let mut a: u64 = 0;
    let mut b: u64 = 1;
    // TODO: advance the pair and break with the largest value below ceiling
}

fn main() {
    println!("fib_below(100) = {}", fib_below(100));
}`,
    tags: ['loops', 'break', 'fibonacci'],
  },
  {
    id: 'rs-ch03-c-067',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Second Largest In An Array',
    prompt: `Write a function fn second_largest(arr: [i32; 6]) -> i32 that returns the second largest value in the array using a single for loop, tracking both the largest and second largest seen so far. Assume the six values are distinct. In main, call it on [4, 19, 7, 25, 11, 2] and print:

second = 19`,
    hints: [
      'Keep two mut variables: largest and second. i32::MIN is a safe starting value for both.',
      'When a value beats largest, the old largest becomes the new second; otherwise it might still beat second.',
    ],
    solution: `fn second_largest(arr: [i32; 6]) -> i32 {
    let mut largest = i32::MIN;
    let mut second = i32::MIN;
    for v in arr {
        if v > largest {
            second = largest;
            largest = v;
        } else if v > second {
            second = v;
        }
    }
    second
}

fn main() {
    println!("second = {}", second_largest([4, 19, 7, 25, 11, 2]));
}`,
    starter: `fn second_largest(arr: [i32; 6]) -> i32 {
    let mut largest = i32::MIN;
    let mut second = i32::MIN;
    // TODO: track the top two values in one pass
}

fn main() {
    println!("second = {}", second_largest([4, 19, 7, 25, 11, 2]));
}`,
    tags: ['arrays', 'loops', 'functions'],
  },
  {
    id: 'rs-ch03-c-068',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pascal Triangle Row Sum',
    prompt: `Write a function fn row_sum(row: u32) -> u64 that returns the sum of the entries in the given row of Pascal's triangle, where row 0 is the single entry 1. The sum of row k equals 2 raised to the power k, but you must compute it with a loop by doubling, not with the pow method. In main, print one line per call for row_sum(0), row_sum(1), and row_sum(5):

1
2
32`,
    hints: [
      'The sum of Pascal row k is 2 to the power k.',
      'Start a mut result at 1 and double it row times in a for loop.',
    ],
    solution: `fn row_sum(row: u32) -> u64 {
    let mut result: u64 = 1;
    for _ in 0..row {
        result *= 2;
    }
    result
}

fn main() {
    println!("{}", row_sum(0));
    println!("{}", row_sum(1));
    println!("{}", row_sum(5));
}`,
    starter: `fn row_sum(row: u32) -> u64 {
    let mut result: u64 = 1;
    // TODO: double result row times
}

fn main() {
    println!("{}", row_sum(0));
    println!("{}", row_sum(1));
    println!("{}", row_sum(5));
}`,
    tags: ['loops', 'functions', 'for'],
  },
  {
    id: 'rs-ch03-c-069',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Print A Times Table Block',
    prompt: `Using nested for loops, print a 3-by-3 multiplication block where the entry in row i and column j (both running 1 through 3) is i * j. Print each row as three numbers separated by single spaces, with no trailing space, using print! for the numbers and a println! to end each row. The output must be exactly:

1 2 3
2 4 6
3 6 9`,
    hints: [
      'Outer loop over rows 1..=3, inner loop over columns 1..=3.',
      'Print a leading space before every column except the first (test if the column is greater than 1).',
    ],
    solution: `fn main() {
    for i in 1..=3 {
        for j in 1..=3 {
            if j > 1 {
                print!(" ");
            }
            print!("{}", i * j);
        }
        println!();
    }
}`,
    starter: `fn main() {
    for i in 1..=3 {
        for j in 1..=3 {
            // TODO: print i * j, separating columns with single spaces
        }
        println!();
    }
}`,
    tags: ['loops', 'nested-loops', 'for'],
  },
  {
    id: 'rs-ch03-c-070',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Histogram From Counts Array',
    prompt: `Given the array counts = [3, 0, 5, 2] representing how many hash characters to draw on each of four rows, use nested loops to print a histogram. Row k prints counts[k] hash characters; an empty row prints nothing but still ends with a newline. The output must be exactly (the second line is blank):

###

#####
##`,
    hints: [
      'Outer loop over the indices 0..counts.len(); inner loop prints counts[k] hashes.',
      'Use print! for each hash with no newline, then a println!() to finish each row even when it is empty.',
    ],
    solution: `fn main() {
    let counts = [3, 0, 5, 2];
    for k in 0..counts.len() {
        for _ in 0..counts[k] {
            print!("#");
        }
        println!();
    }
}`,
    starter: `fn main() {
    let counts = [3, 0, 5, 2];
    // TODO: print counts[k] hashes on each row, then end the line
}`,
    tags: ['arrays', 'nested-loops', 'loops'],
  },
]

export default problems
