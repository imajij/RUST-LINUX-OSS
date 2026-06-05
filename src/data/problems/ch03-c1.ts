import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch03-c-001',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Immutable Greeting Binding',
    prompt: `Bind the integer 42 to an immutable variable named answer, then print it with println! so the program outputs exactly:

The answer is 42

Use a normal let binding (no mut).`,
    hints: [
      'Use let to create the binding.',
      'A placeholder {} inside println! is filled by the value you pass.',
    ],
    solution: `fn main() {
    let answer = 42;
    println!("The answer is {}", answer);
}`,
    starter: `fn main() {
    // TODO: bind 42 to an immutable variable named answer and print it
}`,
    tags: ['variables', 'println'],
  },
  {
    id: 'rs-ch03-c-002',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Mutable Score Tracker',
    prompt: `Create a mutable variable score starting at 0. Add 10 to it, then add 5 more, then print the final value. The program must output:

score = 15

A plain let binding cannot be reassigned, so you will need mut.`,
    hints: [
      'Mark the binding with mut so it can change.',
      'Reassign with score = score + 10; or use score += 10;.',
    ],
    solution: `fn main() {
    let mut score = 0;
    score += 10;
    score += 5;
    println!("score = {}", score);
}`,
    starter: `fn main() {
    // TODO: make a mutable score, add 10 then 5, then print it
}`,
    tags: ['mutability', 'variables'],
  },
  {
    id: 'rs-ch03-c-003',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare A Compile-Time Constant',
    prompt: `Declare a constant MAX_PLAYERS with the value 4 using const (not let). Then print:

Max players: 4

Remember that const requires an explicit type annotation.`,
    hints: [
      'The syntax is const NAME: TYPE = value;',
      'A small whole number fits in u32 or i32.',
    ],
    solution: `fn main() {
    const MAX_PLAYERS: u32 = 4;
    println!("Max players: {}", MAX_PLAYERS);
}`,
    starter: `fn main() {
    // TODO: declare const MAX_PLAYERS = 4 and print it
}`,
    tags: ['const', 'variables'],
  },
  {
    id: 'rs-ch03-c-004',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Shadow To Double A Value',
    prompt: `Bind x to 5. Then use shadowing (another let x = ...) to rebind x to twice its value. Print the final x. Expected output:

x = 10

Do not use mut; use shadowing instead.`,
    hints: [
      'A second let with the same name shadows the first.',
      'let x = x * 2; reuses the previous x to compute the new one.',
    ],
    solution: `fn main() {
    let x = 5;
    let x = x * 2;
    println!("x = {}", x);
}`,
    starter: `fn main() {
    let x = 5;
    // TODO: shadow x with double its value, then print it
}`,
    tags: ['shadowing', 'variables'],
  },
  {
    id: 'rs-ch03-c-005',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Shadowing To Switch Types',
    prompt: `Start with a string literal "   42   " bound to spaces. Then shadow spaces with the number of characters in it (use the len method on the string). Print the resulting number. Expected output:

length = 9

This shows shadowing letting one name go from a &str to a usize.`,
    hints: [
      'A string literal has a len() method returning its byte length.',
      'let spaces = spaces.len(); reuses the same name with a new type.',
    ],
    solution: `fn main() {
    let spaces = "   42   ";
    let spaces = spaces.len();
    println!("length = {}", spaces);
}`,
    starter: `fn main() {
    let spaces = "   42   ";
    // TODO: shadow spaces with its length, then print it
}`,
    tags: ['shadowing', 'types'],
  },
  {
    id: 'rs-ch03-c-006',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Boolean Light Switch',
    prompt: `Bind a bool variable is_on to true and another named is_locked to false. Print both, one per line, so the output is:

is_on = true
is_locked = false`,
    hints: [
      'Boolean literals are true and false.',
      'bool values print with the {} placeholder.',
    ],
    solution: `fn main() {
    let is_on: bool = true;
    let is_locked: bool = false;
    println!("is_on = {}", is_on);
    println!("is_locked = {}", is_locked);
}`,
    starter: `fn main() {
    // TODO: bind is_on = true and is_locked = false, then print both
}`,
    tags: ['bool', 'variables'],
  },
  {
    id: 'rs-ch03-c-007',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Printing A Char Literal',
    prompt: `Bind a char variable named grade to the character 'A'. Then print it so the output is exactly:

Your grade is A

A char literal uses single quotes.`,
    hints: [
      "A char uses single quotes, like 'A'.",
      'Annotate the type with : char if you like.',
    ],
    solution: `fn main() {
    let grade: char = 'A';
    println!("Your grade is {}", grade);
}`,
    starter: `fn main() {
    // TODO: bind grade to the char 'A' and print it
}`,
    tags: ['char', 'variables'],
  },
  {
    id: 'rs-ch03-c-008',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Integer Floor Division',
    prompt: `Bind two i32 values: total = 17 and groups = 5. Print the result of integer division total / groups. Because both are integers, the result is truncated. Expected output:

17 / 5 = 3`,
    hints: [
      'Dividing two integers in Rust drops the fractional part.',
      'You can compute total / groups directly inside println!.',
    ],
    solution: `fn main() {
    let total: i32 = 17;
    let groups: i32 = 5;
    println!("{} / {} = {}", total, groups, total / groups);
}`,
    starter: `fn main() {
    let total: i32 = 17;
    let groups: i32 = 5;
    // TODO: print the integer division result
}`,
    tags: ['integers', 'arithmetic'],
  },
  {
    id: 'rs-ch03-c-009',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Floating-Point Quotient',
    prompt: `Bind two f64 values: a = 7.0 and b = 2.0. Print a / b. Because these are floats, the fractional part is kept. Expected output:

7 / 2 = 3.5`,
    hints: [
      'Use f64 literals like 7.0 (with a decimal point).',
      'Floating-point division keeps the fraction.',
    ],
    solution: `fn main() {
    let a: f64 = 7.0;
    let b: f64 = 2.0;
    println!("7 / 2 = {}", a / b);
}`,
    starter: `fn main() {
    let a: f64 = 7.0;
    let b: f64 = 2.0;
    // TODO: print a / b
}`,
    tags: ['floats', 'arithmetic'],
  },
  {
    id: 'rs-ch03-c-010',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'The Remainder Operator',
    prompt: `Bind n = 23 and d = 7 as i32. Print the remainder of n divided by d using the % operator. Expected output:

23 % 7 = 2`,
    hints: [
      'The % operator gives the remainder.',
      'n % d evaluates to 2 here.',
    ],
    solution: `fn main() {
    let n: i32 = 23;
    let d: i32 = 7;
    println!("{} % {} = {}", n, d, n % d);
}`,
    starter: `fn main() {
    let n: i32 = 23;
    let d: i32 = 7;
    // TODO: print n % d
}`,
    tags: ['integers', 'arithmetic'],
  },
  {
    id: 'rs-ch03-c-011',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Tuple Of Mixed Types',
    prompt: `Build a tuple named person holding an i32 age of 30, an f64 height of 1.75, and a char initial of 'J'. Access the elements by index to print:

age=30 height=1.75 initial=J`,
    hints: [
      'A tuple can mix types: (30, 1.75, J).',
      'Access elements with dot-index: person.0, person.1, person.2.',
    ],
    solution: `fn main() {
    let person: (i32, f64, char) = (30, 1.75, 'J');
    println!("age={} height={} initial={}", person.0, person.1, person.2);
}`,
    starter: `fn main() {
    // TODO: make a tuple (30, 1.75, 'J') and print its parts by index
}`,
    tags: ['tuples', 'types'],
  },
  {
    id: 'rs-ch03-c-012',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Unpack A Coordinate Pair',
    prompt: `Given the tuple let pair = (3, 7);, destructure it into two variables x and y in a single let, then print:

x is 3, y is 7

Use pattern destructuring, not index access.`,
    hints: [
      'A let can destructure: let (x, y) = pair;',
      'After destructuring, x and y are ordinary variables.',
    ],
    solution: `fn main() {
    let pair = (3, 7);
    let (x, y) = pair;
    println!("x is {}, y is {}", x, y);
}`,
    starter: `fn main() {
    let pair = (3, 7);
    // TODO: destructure into x and y, then print them
}`,
    tags: ['tuples', 'destructuring'],
  },
  {
    id: 'rs-ch03-c-013',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Index A Fixed-Size Array',
    prompt: `Create an array of five i32 values: [10, 20, 30, 40, 50]. Print the first and last elements using indexing so the output is:

first=10 last=50

Use literal indices.`,
    hints: [
      'Arrays are written with square brackets and a fixed length.',
      'Index the first element with [0] and the last with [4].',
    ],
    solution: `fn main() {
    let nums: [i32; 5] = [10, 20, 30, 40, 50];
    println!("first={} last={}", nums[0], nums[4]);
}`,
    starter: `fn main() {
    let nums = [10, 20, 30, 40, 50];
    // TODO: print the first and last elements
}`,
    tags: ['arrays', 'indexing'],
  },
  {
    id: 'rs-ch03-c-014',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Array Filled By Repeat Syntax',
    prompt: `Use the repeat syntax to create an array of length 8 where every element is the i32 value 7. Print the element at index 3 and the array length. Expected output:

elem=7 len=8`,
    hints: [
      'Repeat syntax is [value; count], for example [7; 8].',
      'An array exposes its length via the .len() method.',
    ],
    solution: `fn main() {
    let buffer = [7; 8];
    println!("elem={} len={}", buffer[3], buffer.len());
}`,
    starter: `fn main() {
    // TODO: build an array of eight 7s with repeat syntax, then print
}`,
    tags: ['arrays', 'repeat'],
  },
  {
    id: 'rs-ch03-c-015',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Function That Squares',
    prompt: `Write a function square(n: i32) -> i32 that returns n times n. In main, call it with 6 and print:

6 squared is 36

Return the value as the last expression (no semicolon, no explicit return needed).`,
    hints: [
      'The final expression of a function body is its return value.',
      'Leave off the semicolon on n * n so it is returned.',
    ],
    solution: `fn square(n: i32) -> i32 {
    n * n
}

fn main() {
    println!("6 squared is {}", square(6));
}`,
    starter: `fn square(n: i32) -> i32 {
    // TODO: return n * n
    todo!()
}

fn main() {
    println!("6 squared is {}", square(6));
}`,
    tags: ['functions', 'return'],
  },
  {
    id: 'rs-ch03-c-016',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Add Two Numbers In A Function',
    prompt: `Write a function add(a: i32, b: i32) -> i32 that returns the sum of its two parameters. Call it from main with 8 and 14 and print:

8 + 14 = 22`,
    hints: [
      'Two parameters are separated by a comma in the signature.',
      'Return a + b as the final expression.',
    ],
    solution: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    println!("8 + 14 = {}", add(8, 14));
}`,
    starter: `fn add(a: i32, b: i32) -> i32 {
    // TODO: return a + b
    todo!()
}

fn main() {
    println!("8 + 14 = {}", add(8, 14));
}`,
    tags: ['functions', 'parameters'],
  },
  {
    id: 'rs-ch03-c-017',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Value From A Block Expression',
    prompt: `In main, bind a variable result to the value of a block that computes 4 + 1 and uses that as its final expression. Print:

result = 5

The block's last line must have no semicolon so the block evaluates to a value.`,
    hints: [
      'A { } block is an expression whose value is its final expression.',
      'Inside the block, write a let then a final expression with no trailing semicolon.',
    ],
    solution: `fn main() {
    let result = {
        let base = 4;
        base + 1
    };
    println!("result = {}", result);
}`,
    starter: `fn main() {
    let result = {
        // TODO: make this block evaluate to 5
    };
    println!("result = {}", result);
}`,
    tags: ['expressions', 'blocks'],
  },
  {
    id: 'rs-ch03-c-018',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Branch With If And Else',
    prompt: `Bind temperature to 18 (i32). Using if/else, print "warm" when temperature is at least 20, otherwise print "cool". With 18 the output should be:

cool`,
    hints: [
      'The if condition must be a bool; no parentheses are required.',
      'Use >= 20 to test the threshold.',
    ],
    solution: `fn main() {
    let temperature = 18;
    if temperature >= 20 {
        println!("warm");
    } else {
        println!("cool");
    }
}`,
    starter: `fn main() {
    let temperature = 18;
    // TODO: print "warm" if >= 20 else "cool"
}`,
    tags: ['control-flow', 'if'],
  },
  {
    id: 'rs-ch03-c-019',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Choose A Value With If In Let',
    prompt: `Bind condition to true. Then bind number using an if expression on the right-hand side of a let: if condition is true, number is 100, otherwise it is 200. Print:

number = 100

Both branches of the if must produce the same type.`,
    hints: [
      'You can write let number = if cond { 100 } else { 200 };',
      'Each branch is a block whose final expression is the value.',
    ],
    solution: `fn main() {
    let condition = true;
    let number = if condition { 100 } else { 200 };
    println!("number = {}", number);
}`,
    starter: `fn main() {
    let condition = true;
    // TODO: set number using an if expression, then print it
}`,
    tags: ['control-flow', 'expressions'],
  },
  {
    id: 'rs-ch03-c-020',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Parity Reporter',
    prompt: `Write a function parity(n: i32) -> char that returns 'E' when n is even and 'O' when n is odd, using the remainder operator. In main, print the parity of 7 and of 10 like this:

7 -> O
10 -> E`,
    hints: [
      'A number is even when n % 2 == 0.',
      'Return a char from each branch of an if expression.',
    ],
    solution: `fn parity(n: i32) -> char {
    if n % 2 == 0 {
        'E'
    } else {
        'O'
    }
}

fn main() {
    println!("7 -> {}", parity(7));
    println!("10 -> {}", parity(10));
}`,
    starter: `fn parity(n: i32) -> char {
    // TODO: return 'E' if even else 'O'
    todo!()
}

fn main() {
    println!("7 -> {}", parity(7));
    println!("10 -> {}", parity(10));
}`,
    tags: ['functions', 'control-flow'],
  },
  {
    id: 'rs-ch03-c-021',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Loop Until A Result',
    prompt: `Use a loop with a mutable counter starting at 1. Each iteration multiply a running product (start at 1) by the counter and increase the counter. Break out of the loop returning the product once the counter passes 4, and bind that returned value. Print:

product = 24

(That is 1*2*3*4.)`,
    hints: [
      'loop can return a value: break value; sets the loop expression value.',
      'Bind it with let result = loop { ... };',
    ],
    solution: `fn main() {
    let mut counter = 1;
    let mut product = 1;
    let result = loop {
        product *= counter;
        counter += 1;
        if counter > 4 {
            break product;
        }
    };
    println!("product = {}", result);
}`,
    starter: `fn main() {
    let mut counter = 1;
    let mut product = 1;
    let result = loop {
        // TODO: multiply, increment, and break with the product
    };
    println!("product = {}", result);
}`,
    tags: ['loops', 'break'],
  },
  {
    id: 'rs-ch03-c-022',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Countdown With A While Loop',
    prompt: `Using a while loop, count down from 5 to 1 inclusive, printing each number on its own line, then print "liftoff" at the end. Output:

5
4
3
2
1
liftoff`,
    hints: [
      'Start a mutable counter at 5 and loop while it is greater than 0.',
      'Decrement the counter inside the loop.',
    ],
    solution: `fn main() {
    let mut n = 5;
    while n > 0 {
        println!("{}", n);
        n -= 1;
    }
    println!("liftoff");
}`,
    starter: `fn main() {
    let mut n = 5;
    // TODO: print n while counting down, then "liftoff"
}`,
    tags: ['loops', 'while'],
  },
  {
    id: 'rs-ch03-c-023',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Iterate Over A Range',
    prompt: `Use a for loop over the range 1..=5 to print each number on its own line:

1
2
3
4
5

Use an inclusive range so 5 is printed.`,
    hints: [
      'An inclusive range is written start..=end.',
      'for i in 1..=5 { ... } iterates over each value.',
    ],
    solution: `fn main() {
    for i in 1..=5 {
        println!("{}", i);
    }
}`,
    starter: `fn main() {
    // TODO: for-loop over 1..=5 printing each number
}`,
    tags: ['loops', 'ranges'],
  },
  {
    id: 'rs-ch03-c-024',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Walk Through An Array',
    prompt: `Given the array let colors = ["red", "green", "blue"];, use a for loop to iterate over its elements and print each one on its own line:

red
green
blue`,
    hints: [
      'You can iterate the elements directly: for c in colors { ... }.',
      'Each c is one element of the array.',
    ],
    solution: `fn main() {
    let colors = ["red", "green", "blue"];
    for c in colors {
        println!("{}", c);
    }
}`,
    starter: `fn main() {
    let colors = ["red", "green", "blue"];
    // TODO: print each element with a for loop
}`,
    tags: ['loops', 'arrays'],
  },
  {
    id: 'rs-ch03-c-025',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Total Of A Number Range',
    prompt: `Use a for loop to add up all integers from 1 to 10 inclusive into a mutable sum, then print:

sum = 55`,
    hints: [
      'Start a mutable sum at 0.',
      'Loop over 1..=10 and add each value with sum += i;.',
    ],
    solution: `fn main() {
    let mut sum = 0;
    for i in 1..=10 {
        sum += i;
    }
    println!("sum = {}", sum);
}`,
    starter: `fn main() {
    let mut sum = 0;
    // TODO: add 1 through 10 into sum, then print it
}`,
    tags: ['loops', 'ranges'],
  },
  {
    id: 'rs-ch03-c-026',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Convert Fahrenheit To Celsius',
    prompt: `Write a function f_to_c(f: f64) -> f64 that converts Fahrenheit to Celsius using the formula (f - 32) * 5 / 9. In main, convert 212.0 and print:

212F = 100C`,
    hints: [
      'Use f64 throughout so the division keeps decimals.',
      'The formula is (f - 32.0) * 5.0 / 9.0.',
    ],
    solution: `fn f_to_c(f: f64) -> f64 {
    (f - 32.0) * 5.0 / 9.0
}

fn main() {
    println!("212F = {}C", f_to_c(212.0));
}`,
    starter: `fn f_to_c(f: f64) -> f64 {
    // TODO: return (f - 32.0) * 5.0 / 9.0
    todo!()
}

fn main() {
    println!("212F = {}C", f_to_c(212.0));
}`,
    tags: ['functions', 'floats'],
  },
  {
    id: 'rs-ch03-c-027',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Convert Celsius To Fahrenheit',
    prompt: `Write a function c_to_f(c: f64) -> f64 that converts Celsius to Fahrenheit using c * 9 / 5 + 32. In main, convert 100.0 and print:

100C = 212F`,
    hints: [
      'Use f64 literals like 9.0, 5.0, 32.0.',
      'Return c * 9.0 / 5.0 + 32.0.',
    ],
    solution: `fn c_to_f(c: f64) -> f64 {
    c * 9.0 / 5.0 + 32.0
}

fn main() {
    println!("100C = {}F", c_to_f(100.0));
}`,
    starter: `fn c_to_f(c: f64) -> f64 {
    // TODO: return c * 9.0 / 5.0 + 32.0
    todo!()
}

fn main() {
    println!("100C = {}F", c_to_f(100.0));
}`,
    tags: ['functions', 'floats'],
  },
  {
    id: 'rs-ch03-c-028',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Factorial Using A For Loop',
    prompt: `Write a function factorial(n: u32) -> u32 that returns n! computed with a for loop over a range. In main, print:

5! = 120

Assume n is small enough not to overflow.`,
    hints: [
      'Start a mutable result at 1.',
      'Loop over 1..=n and multiply result by each value.',
    ],
    solution: `fn factorial(n: u32) -> u32 {
    let mut result = 1;
    for i in 1..=n {
        result *= i;
    }
    result
}

fn main() {
    println!("5! = {}", factorial(5));
}`,
    starter: `fn factorial(n: u32) -> u32 {
    // TODO: multiply 1 through n with a for loop
    todo!()
}

fn main() {
    println!("5! = {}", factorial(5));
}`,
    tags: ['functions', 'loops'],
  },
  {
    id: 'rs-ch03-c-029',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'The Nth Fibonacci Number',
    prompt: `Write a function fib(n: u32) -> u32 that returns the nth Fibonacci number, where fib(0) = 0 and fib(1) = 1. Use a loop with two running variables (no recursion). In main, print:

fib(10) = 55`,
    hints: [
      'Keep two variables a = 0 and b = 1.',
      'Each step, compute the next value and shift: a becomes b, b becomes a + b.',
    ],
    solution: `fn fib(n: u32) -> u32 {
    let mut a = 0;
    let mut b = 1;
    for _ in 0..n {
        let next = a + b;
        a = b;
        b = next;
    }
    a
}

fn main() {
    println!("fib(10) = {}", fib(10));
}`,
    starter: `fn fib(n: u32) -> u32 {
    let mut a = 0;
    let mut b = 1;
    // TODO: iterate n times, shifting a and b
    todo!()
}

fn main() {
    println!("fib(10) = {}", fib(10));
}`,
    tags: ['functions', 'loops'],
  },
  {
    id: 'rs-ch03-c-030',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Largest Element Of An Array',
    prompt: `Given let nums = [3, 9, 1, 7, 4];, find the largest value using a for loop and a mutable best variable, then print:

max = 9

Start best at the first element and compare the rest.`,
    hints: [
      'Initialize best to nums[0].',
      'Loop over the elements and update best when you find a larger one.',
    ],
    solution: `fn main() {
    let nums = [3, 9, 1, 7, 4];
    let mut best = nums[0];
    for n in nums {
        if n > best {
            best = n;
        }
    }
    println!("max = {}", best);
}`,
    starter: `fn main() {
    let nums = [3, 9, 1, 7, 4];
    let mut best = nums[0];
    // TODO: scan for the largest value, then print it
}`,
    tags: ['arrays', 'loops'],
  },
  {
    id: 'rs-ch03-c-031',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Multiples Of Three',
    prompt: `Use a for loop over 1..=30 to count how many numbers are divisible by 3, accumulating into a mutable count. Print:

multiples of 3: 10`,
    hints: [
      'A number is divisible by 3 when n % 3 == 0.',
      'Increment count inside the if.',
    ],
    solution: `fn main() {
    let mut count = 0;
    for n in 1..=30 {
        if n % 3 == 0 {
            count += 1;
        }
    }
    println!("multiples of 3: {}", count);
}`,
    starter: `fn main() {
    let mut count = 0;
    // TODO: count multiples of 3 in 1..=30, then print
}`,
    tags: ['loops', 'ranges'],
  },
  {
    id: 'rs-ch03-c-032',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Classic FizzBuzz Sequence',
    prompt: `For each number from 1 to 15 inclusive, print "Fizz" if it is divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, otherwise the number itself. Each on its own line. The first lines should be:

1
2
Fizz
4
Buzz`,
    hints: [
      'Check the divisible-by-both case (15) first.',
      'Use else if chains for the remaining cases.',
    ],
    solution: `fn main() {
    for n in 1..=15 {
        if n % 15 == 0 {
            println!("FizzBuzz");
        } else if n % 3 == 0 {
            println!("Fizz");
        } else if n % 5 == 0 {
            println!("Buzz");
        } else {
            println!("{}", n);
        }
    }
}`,
    starter: `fn main() {
    for n in 1..=15 {
        // TODO: print Fizz / Buzz / FizzBuzz / the number
    }
}`,
    tags: ['control-flow', 'loops'],
  },
  {
    id: 'rs-ch03-c-033',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Stop Both Loops With A Label',
    prompt: `Use two nested for loops, the outer over 1..=3 and the inner over 1..=3. Print each pair as "i,j" on its own line, but stop ALL looping (break the outer loop) as soon as i times j reaches 4 or more. Use a loop label to break the outer loop from inside the inner one. The output must be:

1,1
1,2
1,3
2,1`,
    hints: [
      "Label the outer loop, for example 'outer: for i in 1..=3 { ... }.",
      "Break the labeled loop with break 'outer; from inside the inner loop.",
    ],
    solution: `fn main() {
    'outer: for i in 1..=3 {
        for j in 1..=3 {
            if i * j >= 4 {
                break 'outer;
            }
            println!("{},{}", i, j);
        }
    }
}`,
    starter: `fn main() {
    'outer: for i in 1..=3 {
        for j in 1..=3 {
            // TODO: break 'outer when i * j >= 4, else print the pair
        }
    }
}`,
    tags: ['loops', 'labels'],
  },
  {
    id: 'rs-ch03-c-034',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mean Of Array Values',
    prompt: `Given let scores = [80, 90, 70, 100];, compute the average as an f64 and print it. Sum the values with a for loop, then divide by the count cast to f64. Expected output:

average = 85`,
    hints: [
      'Sum the integers in a mutable accumulator.',
      'Cast to f64 with the as keyword: sum as f64 / scores.len() as f64.',
    ],
    solution: `fn main() {
    let scores = [80, 90, 70, 100];
    let mut sum = 0;
    for s in scores {
        sum += s;
    }
    let average = sum as f64 / scores.len() as f64;
    println!("average = {}", average);
}`,
    starter: `fn main() {
    let scores = [80, 90, 70, 100];
    let mut sum = 0;
    // TODO: sum the values, then print the f64 average
}`,
    tags: ['arrays', 'floats'],
  },
  {
    id: 'rs-ch03-c-035',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Both Smallest And Largest As A Tuple',
    prompt: `Write a function min_max(a: i32, b: i32, c: i32) -> (i32, i32) that returns a tuple of (smallest, largest) among its three arguments. In main, call it with 4, 9, 2 and destructure the result to print:

min=2 max=9

Use if/else comparisons; return a tuple.`,
    hints: [
      'Compute the smaller and larger with if expressions, then return (lo, hi).',
      'In main, destructure: let (lo, hi) = min_max(4, 9, 2);',
    ],
    solution: `fn min_max(a: i32, b: i32, c: i32) -> (i32, i32) {
    let mut lo = a;
    let mut hi = a;
    if b < lo { lo = b; }
    if c < lo { lo = c; }
    if b > hi { hi = b; }
    if c > hi { hi = c; }
    (lo, hi)
}

fn main() {
    let (lo, hi) = min_max(4, 9, 2);
    println!("min={} max={}", lo, hi);
}`,
    starter: `fn min_max(a: i32, b: i32, c: i32) -> (i32, i32) {
    // TODO: return (smallest, largest)
    todo!()
}

fn main() {
    let (lo, hi) = min_max(4, 9, 2);
    println!("min={} max={}", lo, hi);
}`,
    tags: ['functions', 'tuples'],
  },
]

export default problems
