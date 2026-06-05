import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch13-c-036',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Store a Closure and Call It Twice',
    prompt: `In \`main\`, create a closure named \`square\` that takes one \`i32\` parameter and returns its square.

Store it in a variable, then call it twice: once with 4 and once with 9. Print each result on its own line, so the output is:
16
81`,
    hints: [
      'A closure is written with pipes: |x| x * x.',
      'Store it in a let binding, then call it like a function: square(4).',
    ],
    solution: `fn main() {
    let square = |x: i32| x * x;
    println!("{}", square(4));
    println!("{}", square(9));
}`,
    starter: `fn main() {
    // TODO: define a closure \`square\` and call it with 4 and 9
}`,
    tags: ['closures', 'functions'],
  },
  {
    id: 'rs-ch13-c-037',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Closure Capturing a Variable by Reference',
    prompt: `In \`main\`, define a \`let factor = 3;\`. Then create a closure \`scale\` that captures \`factor\` and multiplies its single \`i32\` argument by \`factor\`.

Call \`scale(10)\` and print the result (expected: 30). After calling, print \`factor\` again to show it is still usable (expected: 3).`,
    hints: [
      'A closure can use a variable from the surrounding scope without listing it as a parameter.',
      'Because the closure only reads factor, it borrows immutably and factor stays usable afterward.',
    ],
    solution: `fn main() {
    let factor = 3;
    let scale = |x: i32| x * factor;
    println!("{}", scale(10));
    println!("{}", factor);
}`,
    starter: `fn main() {
    let factor = 3;
    // TODO: closure \`scale\` capturing factor
    // TODO: print scale(10) and then factor
}`,
    tags: ['closures', 'capture', 'borrowing'],
  },
  {
    id: 'rs-ch13-c-038',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Mutable Counter Closure',
    prompt: `In \`main\`, create a mutable closure \`tick\` that owns no extra state itself but captures a mutable \`let mut count = 0;\` from the environment. Each call should increment \`count\` by 1 and return the new value.

Call \`tick()\` three times, printing each returned value, so the output is:
1
2
3`,
    hints: [
      'The closure must be stored in a \`let mut\` binding because calling it mutates captured state.',
      'Inside the closure: count += 1; then count as the last expression.',
    ],
    solution: `fn main() {
    let mut count = 0;
    let mut tick = || {
        count += 1;
        count
    };
    println!("{}", tick());
    println!("{}", tick());
    println!("{}", tick());
}`,
    starter: `fn main() {
    let mut count = 0;
    // TODO: mutable closure \`tick\` that increments and returns count
}`,
    tags: ['closures', 'fnmut', 'capture'],
  },
  {
    id: 'rs-ch13-c-039',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'next() on a Vector Iterator',
    prompt: `Write a \`fn main\` that creates \`let v = vec![10, 20, 30];\`, gets a mutable iterator with \`v.iter()\`, and calls \`next()\` on it three times plus once more.

Print each of the four results using the debug formatter so the output is:
Some(10)
Some(20)
Some(30)
None`,
    hints: [
      'Bind the iterator with \`let mut it = v.iter();\` so you can call next() repeatedly.',
      'next() returns an Option; print it with the {:?} debug formatter.',
    ],
    solution: `fn main() {
    let v = vec![10, 20, 30];
    let mut it = v.iter();
    println!("{:?}", it.next());
    println!("{:?}", it.next());
    println!("{:?}", it.next());
    println!("{:?}", it.next());
}`,
    starter: `fn main() {
    let v = vec![10, 20, 30];
    let mut it = v.iter();
    // TODO: call next() four times, printing each with {:?}
}`,
    tags: ['iterator', 'next', 'option'],
  },
  {
    id: 'rs-ch13-c-040',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum a Vector with an Iterator',
    prompt: `Write \`fn total(v: &Vec<i32>) -> i32\` that returns the sum of all elements using an iterator and the consuming adaptor \`sum\`.

In \`main\`, call it on \`vec![4, 8, 15, 16, 23, 42]\` and print the result (expected: 108).`,
    hints: [
      'Call v.iter() to get an iterator over &i32.',
      'sum() needs to know the result type; write \`.sum::<i32>()\` or annotate the return.',
    ],
    solution: `fn total(v: &Vec<i32>) -> i32 {
    v.iter().sum()
}

fn main() {
    let v = vec![4, 8, 15, 16, 23, 42];
    println!("{}", total(&v));
}`,
    starter: `fn total(v: &Vec<i32>) -> i32 {
    // TODO: sum with an iterator
}

fn main() {
    let v = vec![4, 8, 15, 16, 23, 42];
    println!("{}", total(&v));
}`,
    tags: ['iterator', 'sum', 'consuming'],
  },
  {
    id: 'rs-ch13-c-041',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Double Every Element with map and collect',
    prompt: `Write \`fn doubled(v: &Vec<i32>) -> Vec<i32>\` that returns a new vector where every element is twice the original, using \`map\` and \`collect\`.

In \`main\`, call it on \`vec![1, 2, 3, 4]\` and print the result with the debug formatter (expected: [2, 4, 6, 8]).`,
    hints: [
      'map takes a closure: .map(|x| x * 2).',
      'collect builds a Vec; the return type tells Rust what to collect into.',
    ],
    solution: `fn doubled(v: &Vec<i32>) -> Vec<i32> {
    v.iter().map(|x| x * 2).collect()
}

fn main() {
    let v = vec![1, 2, 3, 4];
    println!("{:?}", doubled(&v));
}`,
    starter: `fn doubled(v: &Vec<i32>) -> Vec<i32> {
    // TODO: map each element to its double, then collect
}

fn main() {
    let v = vec![1, 2, 3, 4];
    println!("{:?}", doubled(&v));
}`,
    tags: ['iterator', 'map', 'collect'],
  },
  {
    id: 'rs-ch13-c-042',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Filter Even Numbers',
    prompt: `Write \`fn evens(v: &Vec<i32>) -> Vec<i32>\` that returns a new vector containing only the even numbers from \`v\`, using \`filter\` and \`collect\`. Preserve the original order.

In \`main\`, call it on \`vec![1, 2, 3, 4, 5, 6]\` and print the result (expected: [2, 4, 6]).`,
    hints: [
      'filter keeps elements for which the closure returns true.',
      'Because v.iter() yields &i32, you may need to dereference: |x| **x % 2 == 0 or |&x| x % 2 == 0.',
    ],
    solution: `fn evens(v: &Vec<i32>) -> Vec<i32> {
    v.iter().filter(|&&x| x % 2 == 0).cloned().collect()
}

fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    println!("{:?}", evens(&v));
}`,
    starter: `fn evens(v: &Vec<i32>) -> Vec<i32> {
    // TODO: filter to keep only even numbers, then collect
}

fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    println!("{:?}", evens(&v));
}`,
    tags: ['iterator', 'filter', 'collect'],
  },
  {
    id: 'rs-ch13-c-043',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Filter with a Captured Threshold',
    prompt: `Write \`fn above(v: &Vec<i32>, threshold: i32) -> Vec<i32>\` that returns all elements of \`v\` strictly greater than \`threshold\`. The filter closure must capture the \`threshold\` parameter.

In \`main\`, call \`above(&vec![3, 9, 1, 12, 7], 6)\` and print the result (expected: [9, 12, 7]).`,
    hints: [
      'The closure passed to filter can reference threshold from the enclosing function.',
      'Use cloned() (or copied()) before collect so you get a Vec<i32> rather than a Vec<&i32>.',
    ],
    solution: `fn above(v: &Vec<i32>, threshold: i32) -> Vec<i32> {
    v.iter().filter(|&&x| x > threshold).cloned().collect()
}

fn main() {
    let v = vec![3, 9, 1, 12, 7];
    println!("{:?}", above(&v, 6));
}`,
    starter: `fn above(v: &Vec<i32>, threshold: i32) -> Vec<i32> {
    // TODO: filter elements greater than the captured threshold
}

fn main() {
    let v = vec![3, 9, 1, 12, 7];
    println!("{:?}", above(&v, 6));
}`,
    tags: ['iterator', 'filter', 'capture'],
  },
  {
    id: 'rs-ch13-c-044',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Matching Items',
    prompt: `Write \`fn count_long(words: &Vec<String>, min_len: usize) -> usize\` that returns how many words have a length of at least \`min_len\`. Use \`filter\` and the consuming adaptor \`count\`.

In \`main\`, call it on a vector built from "hi", "hello", "hey", "welcome" with \`min_len = 5\` and print the result (expected: 2).`,
    hints: [
      'A String has a .len() method giving its byte length.',
      'filter then count: .filter(|w| w.len() >= min_len).count().',
    ],
    solution: `fn count_long(words: &Vec<String>, min_len: usize) -> usize {
    words.iter().filter(|w| w.len() >= min_len).count()
}

fn main() {
    let words = vec![
        String::from("hi"),
        String::from("hello"),
        String::from("hey"),
        String::from("welcome"),
    ];
    println!("{}", count_long(&words, 5));
}`,
    starter: `fn count_long(words: &Vec<String>, min_len: usize) -> usize {
    // TODO: filter by length, then count
}

fn main() {
    let words = vec![
        String::from("hi"),
        String::from("hello"),
        String::from("hey"),
        String::from("welcome"),
    ];
    println!("{}", count_long(&words, 5));
}`,
    tags: ['iterator', 'filter', 'count'],
  },
  {
    id: 'rs-ch13-c-045',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sort People by Age with sort_by_key',
    prompt: `Define a struct \`Person { name: String, age: u32 }\`. In \`main\`, build a vector of three people (any names) with ages 40, 25, and 33. Sort the vector in place by age (ascending) using \`sort_by_key\` with a closure, then print each person's name and age on its own line, youngest first.`,
    hints: [
      'sort_by_key takes a closure mapping an element to the key to sort by.',
      'The closure here is |p| p.age.',
    ],
    solution: `struct Person {
    name: String,
    age: u32,
}

fn main() {
    let mut people = vec![
        Person { name: String::from("Ada"), age: 40 },
        Person { name: String::from("Bo"), age: 25 },
        Person { name: String::from("Cy"), age: 33 },
    ];
    people.sort_by_key(|p| p.age);
    for p in &people {
        println!("{} {}", p.name, p.age);
    }
}`,
    starter: `struct Person {
    name: String,
    age: u32,
}

fn main() {
    let mut people = vec![
        Person { name: String::from("Ada"), age: 40 },
        Person { name: String::from("Bo"), age: 25 },
        Person { name: String::from("Cy"), age: 33 },
    ];
    // TODO: sort by age, then print each person
}`,
    tags: ['closures', 'sort_by_key', 'structs'],
  },
  {
    id: 'rs-ch13-c-046',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Enumerate to Number a List',
    prompt: `Write \`fn numbered(items: &Vec<&str>)\` that prints each item prefixed by its 1-based position, one per line, using \`enumerate\`.

For \`vec!["red", "green", "blue"]\` the output should be:
1. red
2. green
3. blue`,
    hints: [
      'enumerate yields (index, value) pairs starting at 0.',
      'Add 1 to the index to make it 1-based.',
    ],
    solution: `fn numbered(items: &Vec<&str>) {
    for (i, item) in items.iter().enumerate() {
        println!("{}. {}", i + 1, item);
    }
}

fn main() {
    let items = vec!["red", "green", "blue"];
    numbered(&items);
}`,
    starter: `fn numbered(items: &Vec<&str>) {
    // TODO: enumerate and print with 1-based numbers
}

fn main() {
    let items = vec!["red", "green", "blue"];
    numbered(&items);
}`,
    tags: ['iterator', 'enumerate', 'for'],
  },
  {
    id: 'rs-ch13-c-047',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Zip Two Vectors into Pairs',
    prompt: `Write \`fn pair_up(names: &Vec<&str>, scores: &Vec<i32>) -> Vec<(String, i32)>\` that combines the two vectors element-by-element using \`zip\`, producing owned \`(String, i32)\` pairs.

In \`main\`, call it on \`vec!["a", "b", "c"]\` and \`vec![1, 2, 3]\` and print the result (expected: [("a", 1), ("b", 2), ("c", 3)]).`,
    hints: [
      'zip stops at the shorter of the two iterators.',
      'Inside map, convert &&str to String with name.to_string() and copy the score.',
    ],
    solution: `fn pair_up(names: &Vec<&str>, scores: &Vec<i32>) -> Vec<(String, i32)> {
    names
        .iter()
        .zip(scores.iter())
        .map(|(name, score)| (name.to_string(), *score))
        .collect()
}

fn main() {
    let names = vec!["a", "b", "c"];
    let scores = vec![1, 2, 3];
    println!("{:?}", pair_up(&names, &scores));
}`,
    starter: `fn pair_up(names: &Vec<&str>, scores: &Vec<i32>) -> Vec<(String, i32)> {
    // TODO: zip names with scores and build owned pairs
}

fn main() {
    let names = vec!["a", "b", "c"];
    let scores = vec![1, 2, 3];
    println!("{:?}", pair_up(&names, &scores));
}`,
    tags: ['iterator', 'zip', 'map'],
  },
  {
    id: 'rs-ch13-c-048',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Take the First N Squares',
    prompt: `Write \`fn first_squares(n: usize) -> Vec<u64>\` that returns the squares of 1, 2, 3, ... up to \`n\` terms. Build it from a range, use \`map\`, then \`take\`-like behavior with the range itself, and \`collect\`.

In \`main\`, call \`first_squares(5)\` and print the result (expected: [1, 4, 9, 16, 25]).`,
    hints: [
      'A range 1..=n is itself an iterator.',
      'Map each i to i * i; remember to cast or use u64 literals so types match.',
    ],
    solution: `fn first_squares(n: usize) -> Vec<u64> {
    (1..=n as u64).map(|i| i * i).collect()
}

fn main() {
    println!("{:?}", first_squares(5));
}`,
    starter: `fn first_squares(n: usize) -> Vec<u64> {
    // TODO: map a range to squares and collect
}

fn main() {
    println!("{:?}", first_squares(5));
}`,
    tags: ['iterator', 'map', 'range'],
  },
  {
    id: 'rs-ch13-c-049',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Skip and Take a Window',
    prompt: `Write \`fn window(v: &Vec<i32>, start: usize, len: usize) -> Vec<i32>\` that returns the slice of \`len\` elements beginning at index \`start\`, using the \`skip\` and \`take\` adaptors (not direct slicing).

In \`main\`, call \`window(&vec![10, 20, 30, 40, 50, 60], 2, 3)\` and print the result (expected: [30, 40, 50]).`,
    hints: [
      'skip(start) discards the first start elements; take(len) keeps the next len.',
      'Use copied() or cloned() before collect to get owned i32 values.',
    ],
    solution: `fn window(v: &Vec<i32>, start: usize, len: usize) -> Vec<i32> {
    v.iter().skip(start).take(len).copied().collect()
}

fn main() {
    let v = vec![10, 20, 30, 40, 50, 60];
    println!("{:?}", window(&v, 2, 3));
}`,
    starter: `fn window(v: &Vec<i32>, start: usize, len: usize) -> Vec<i32> {
    // TODO: skip(start).take(len) then collect
}

fn main() {
    let v = vec![10, 20, 30, 40, 50, 60];
    println!("{:?}", window(&v, 2, 3));
}`,
    tags: ['iterator', 'skip', 'take'],
  },
  {
    id: 'rs-ch13-c-050',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reverse with rev',
    prompt: `Write \`fn reversed(v: &Vec<i32>) -> Vec<i32>\` that returns a new vector with the elements in reverse order, using the \`rev\` adaptor (do not mutate the input or use \`.reverse()\`).

In \`main\`, call it on \`vec![1, 2, 3, 4]\` and print the result (expected: [4, 3, 2, 1]).`,
    hints: [
      'rev reverses a double-ended iterator such as the one from a Vec.',
      'v.iter().rev() then copy and collect.',
    ],
    solution: `fn reversed(v: &Vec<i32>) -> Vec<i32> {
    v.iter().rev().copied().collect()
}

fn main() {
    let v = vec![1, 2, 3, 4];
    println!("{:?}", reversed(&v));
}`,
    starter: `fn reversed(v: &Vec<i32>) -> Vec<i32> {
    // TODO: use rev to reverse, then collect
}

fn main() {
    let v = vec![1, 2, 3, 4];
    println!("{:?}", reversed(&v));
}`,
    tags: ['iterator', 'rev', 'collect'],
  },
  {
    id: 'rs-ch13-c-051',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Product with fold',
    prompt: `Write \`fn product(v: &Vec<i32>) -> i32\` that returns the product of all elements using \`fold\` with an initial accumulator of 1.

In \`main\`, call it on \`vec![2, 3, 4]\` and print the result (expected: 24). For an empty vector the result should be 1.`,
    hints: [
      'fold(init, |acc, x| ...) threads an accumulator through each element.',
      'Start the accumulator at 1 and multiply: |acc, x| acc * x.',
    ],
    solution: `fn product(v: &Vec<i32>) -> i32 {
    v.iter().fold(1, |acc, x| acc * x)
}

fn main() {
    println!("{}", product(&vec![2, 3, 4]));
    println!("{}", product(&vec![]));
}`,
    starter: `fn product(v: &Vec<i32>) -> i32 {
    // TODO: use fold with an initial accumulator of 1
}

fn main() {
    println!("{}", product(&vec![2, 3, 4]));
    println!("{}", product(&vec![]));
}`,
    tags: ['iterator', 'fold', 'consuming'],
  },
  {
    id: 'rs-ch13-c-052',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Uppercase the Long Words',
    prompt: `Write \`fn shout_long(words: &Vec<&str>) -> Vec<String>\` that keeps only words with more than 3 characters and returns each of them uppercased.

Chain \`filter\` and \`map\` then \`collect\`. For \`vec!["go", "rust", "is", "great"]\` the result should be ["RUST", "GREAT"].`,
    hints: [
      'filter by w.len() > 3 first, then map with w.to_uppercase().',
      'to_uppercase already returns a String.',
    ],
    solution: `fn shout_long(words: &Vec<&str>) -> Vec<String> {
    words
        .iter()
        .filter(|w| w.len() > 3)
        .map(|w| w.to_uppercase())
        .collect()
}

fn main() {
    let words = vec!["go", "rust", "is", "great"];
    println!("{:?}", shout_long(&words));
}`,
    starter: `fn shout_long(words: &Vec<&str>) -> Vec<String> {
    // TODO: filter by length then uppercase
}

fn main() {
    let words = vec!["go", "rust", "is", "great"];
    println!("{:?}", shout_long(&words));
}`,
    tags: ['iterator', 'filter', 'map'],
  },
  {
    id: 'rs-ch13-c-053',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum of Squares of Evens',
    prompt: `Write \`fn sum_sq_evens(v: &Vec<i32>) -> i32\` that filters the even numbers, squares each, and sums them. Chain \`filter\`, \`map\`, and \`sum\`.

In \`main\`, call it on \`vec![1, 2, 3, 4, 5]\` and print the result (expected: 20, because 2*2 + 4*4 = 4 + 16).`,
    hints: [
      'Order: filter even, map to square, then sum.',
      'sum needs a type; the i32 return type supplies it.',
    ],
    solution: `fn sum_sq_evens(v: &Vec<i32>) -> i32 {
    v.iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .sum()
}

fn main() {
    let v = vec![1, 2, 3, 4, 5];
    println!("{}", sum_sq_evens(&v));
}`,
    starter: `fn sum_sq_evens(v: &Vec<i32>) -> i32 {
    // TODO: filter even, square, sum
}

fn main() {
    let v = vec![1, 2, 3, 4, 5];
    println!("{}", sum_sq_evens(&v));
}`,
    tags: ['iterator', 'filter', 'sum'],
  },
  {
    id: 'rs-ch13-c-054',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find the First Match',
    prompt: `Write \`fn first_big(v: &Vec<i32>, min: i32) -> Option<i32>\` that returns the first element strictly greater than \`min\`, or \`None\` if there is none. Use the \`find\` consuming adaptor with a closure that captures \`min\`.

In \`main\`, print \`first_big(&vec![1, 5, 8, 2], 4)\` (expected: Some(5)) and \`first_big(&vec![1, 2, 3], 9)\` (expected: None).`,
    hints: [
      'find returns Option and stops at the first element where the closure is true.',
      'find yields a reference; use copied() or dereference the result.',
    ],
    solution: `fn first_big(v: &Vec<i32>, min: i32) -> Option<i32> {
    v.iter().find(|&&x| x > min).copied()
}

fn main() {
    println!("{:?}", first_big(&vec![1, 5, 8, 2], 4));
    println!("{:?}", first_big(&vec![1, 2, 3], 9));
}`,
    starter: `fn first_big(v: &Vec<i32>, min: i32) -> Option<i32> {
    // TODO: use find with a closure capturing min
}

fn main() {
    println!("{:?}", first_big(&vec![1, 5, 8, 2], 4));
    println!("{:?}", first_big(&vec![1, 2, 3], 9));
}`,
    tags: ['iterator', 'find', 'option'],
  },
  {
    id: 'rs-ch13-c-055',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Apply a Function Passed as a Closure',
    prompt: `Write \`fn apply_to_all<F: Fn(i32) -> i32>(v: &Vec<i32>, f: F) -> Vec<i32>\` that returns a new vector where \`f\` has been applied to each element.

In \`main\`, call it twice on \`vec![1, 2, 3]\`: once with a closure that adds 10 (expected: [11, 12, 13]) and once with a closure that triples (expected: [3, 6, 9]). Print both results.`,
    hints: [
      'The generic bound F: Fn(i32) -> i32 lets the function accept any matching closure.',
      'Inside, map each element through f then collect.',
    ],
    solution: `fn apply_to_all<F: Fn(i32) -> i32>(v: &Vec<i32>, f: F) -> Vec<i32> {
    v.iter().map(|&x| f(x)).collect()
}

fn main() {
    let v = vec![1, 2, 3];
    println!("{:?}", apply_to_all(&v, |x| x + 10));
    println!("{:?}", apply_to_all(&v, |x| x * 3));
}`,
    starter: `fn apply_to_all<F: Fn(i32) -> i32>(v: &Vec<i32>, f: F) -> Vec<i32> {
    // TODO: apply f to each element
}

fn main() {
    let v = vec![1, 2, 3];
    println!("{:?}", apply_to_all(&v, |x| x + 10));
    println!("{:?}", apply_to_all(&v, |x| x * 3));
}`,
    tags: ['closures', 'fn-trait', 'generics'],
  },
  {
    id: 'rs-ch13-c-056',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A move Closure for Ownership',
    prompt: `In \`main\`, create \`let data = vec![1, 2, 3];\`. Build a closure with the \`move\` keyword that takes ownership of \`data\` and returns its length when called.

Call the closure once and print the result (expected: 3). Note that after the move closure is created, \`data\` can no longer be used in \`main\`.`,
    hints: [
      'Write move || data.len() to force the closure to own data.',
      'Call the closure to get the length, then print it.',
    ],
    solution: `fn main() {
    let data = vec![1, 2, 3];
    let owns_it = move || data.len();
    println!("{}", owns_it());
}`,
    starter: `fn main() {
    let data = vec![1, 2, 3];
    // TODO: a move closure that returns data.len()
}`,
    tags: ['closures', 'move', 'ownership'],
  },
  {
    id: 'rs-ch13-c-057',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build a HashMap of Word Lengths',
    prompt: `Write \`fn lengths(words: &Vec<&str>) -> std::collections::HashMap<String, usize>\` that maps each word to its length. Build the pairs with \`map\` over an iterator and \`collect\` directly into a \`HashMap\`.

In \`main\`, call it on \`vec!["a", "bb", "ccc"]\`, then print the length stored for "bb" (expected: 2).`,
    hints: [
      'map each word to a (String, usize) tuple, then collect into a HashMap.',
      'collect can build a HashMap when the iterator yields key-value tuples and the target type is annotated.',
    ],
    solution: `use std::collections::HashMap;

fn lengths(words: &Vec<&str>) -> HashMap<String, usize> {
    words.iter().map(|w| (w.to_string(), w.len())).collect()
}

fn main() {
    let words = vec!["a", "bb", "ccc"];
    let map = lengths(&words);
    println!("{}", map["bb"]);
}`,
    starter: `use std::collections::HashMap;

fn lengths(words: &Vec<&str>) -> HashMap<String, usize> {
    // TODO: map words to (word, len) pairs and collect into a HashMap
}

fn main() {
    let words = vec!["a", "bb", "ccc"];
    let map = lengths(&words);
    println!("{}", map["bb"]);
}`,
    tags: ['iterator', 'collect', 'hashmap'],
  },
  {
    id: 'rs-ch13-c-058',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pair Each Index with Its Value',
    prompt: `Write \`fn indexed(v: &Vec<char>) -> Vec<(usize, char)>\` that returns a vector of \`(index, value)\` pairs using \`enumerate\`, \`map\`, and \`collect\`.

In \`main\`, call it on \`vec!['x', 'y', 'z']\` and print the result (expected: [(0, 'x'), (1, 'y'), (2, 'z')]).`,
    hints: [
      'enumerate gives (usize, &char); map it to an owned (usize, char).',
      'Dereference the char inside the map closure: |(i, c)| (i, *c).',
    ],
    solution: `fn indexed(v: &Vec<char>) -> Vec<(usize, char)> {
    v.iter().enumerate().map(|(i, c)| (i, *c)).collect()
}

fn main() {
    let v = vec!['x', 'y', 'z'];
    println!("{:?}", indexed(&v));
}`,
    starter: `fn indexed(v: &Vec<char>) -> Vec<(usize, char)> {
    // TODO: enumerate, map to owned pairs, collect
}

fn main() {
    let v = vec!['x', 'y', 'z'];
    println!("{:?}", indexed(&v));
}`,
    tags: ['iterator', 'enumerate', 'collect'],
  },
  {
    id: 'rs-ch13-c-059',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Check All and Any',
    prompt: `Write two functions: \`fn all_positive(v: &Vec<i32>) -> bool\` using the \`all\` adaptor, and \`fn any_negative(v: &Vec<i32>) -> bool\` using the \`any\` adaptor.

In \`main\`, test both on \`vec![3, -1, 4]\`. Expected: all_positive is false, any_negative is true. Print each result.`,
    hints: [
      'all returns true only if the closure is true for every element.',
      'any returns true if the closure is true for at least one element.',
    ],
    solution: `fn all_positive(v: &Vec<i32>) -> bool {
    v.iter().all(|&x| x > 0)
}

fn any_negative(v: &Vec<i32>) -> bool {
    v.iter().any(|&x| x < 0)
}

fn main() {
    let v = vec![3, -1, 4];
    println!("{}", all_positive(&v));
    println!("{}", any_negative(&v));
}`,
    starter: `fn all_positive(v: &Vec<i32>) -> bool {
    // TODO: use all
}

fn any_negative(v: &Vec<i32>) -> bool {
    // TODO: use any
}

fn main() {
    let v = vec![3, -1, 4];
    println!("{}", all_positive(&v));
    println!("{}", any_negative(&v));
}`,
    tags: ['iterator', 'all', 'any'],
  },
  {
    id: 'rs-ch13-c-060',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Max By a Key',
    prompt: `Define \`struct Item { name: String, weight: u32 }\`. Write \`fn heaviest(items: &Vec<Item>) -> Option<&Item>\` that returns a reference to the item with the largest \`weight\` using \`max_by_key\` with a closure.

In \`main\`, build three items and print the name of the heaviest. With weights 5, 12, 8 the heaviest's name should be printed.`,
    hints: [
      'max_by_key takes a closure returning the comparison key.',
      'It returns Option<&Item>; use it directly since items.iter() yields &Item.',
    ],
    solution: `struct Item {
    name: String,
    weight: u32,
}

fn heaviest(items: &Vec<Item>) -> Option<&Item> {
    items.iter().max_by_key(|item| item.weight)
}

fn main() {
    let items = vec![
        Item { name: String::from("a"), weight: 5 },
        Item { name: String::from("b"), weight: 12 },
        Item { name: String::from("c"), weight: 8 },
    ];
    if let Some(item) = heaviest(&items) {
        println!("{}", item.name);
    }
}`,
    starter: `struct Item {
    name: String,
    weight: u32,
}

fn heaviest(items: &Vec<Item>) -> Option<&Item> {
    // TODO: use max_by_key on weight
}

fn main() {
    let items = vec![
        Item { name: String::from("a"), weight: 5 },
        Item { name: String::from("b"), weight: 12 },
        Item { name: String::from("c"), weight: 8 },
    ];
    if let Some(item) = heaviest(&items) {
        println!("{}", item.name);
    }
}`,
    tags: ['iterator', 'max_by_key', 'closures'],
  },
  {
    id: 'rs-ch13-c-061',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Implement Iterator for a Counter',
    prompt: `Define \`struct Counter { count: u32 }\` with an associated \`fn new() -> Counter\` that starts \`count\` at 0. Implement the \`Iterator\` trait for \`Counter\` so it yields \`u32\` values 1, 2, 3, 4, 5 and then \`None\` forever after.

In \`main\`, create a Counter and collect its output into a \`Vec<u32>\`, then print it (expected: [1, 2, 3, 4, 5]).`,
    hints: [
      'Set type Item = u32; inside next, increment count then return Some(count) while count <= 5.',
      'Once count reaches 5, return None on the next call.',
    ],
    solution: `struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

fn main() {
    let collected: Vec<u32> = Counter::new().collect();
    println!("{:?}", collected);
}`,
    starter: `struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        // TODO: yield 1..=5 then None
    }
}

fn main() {
    let collected: Vec<u32> = Counter::new().collect();
    println!("{:?}", collected);
}`,
    tags: ['iterator', 'trait', 'custom-iterator'],
  },
  {
    id: 'rs-ch13-c-062',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Chain Adaptors on a Custom Counter',
    prompt: `Reuse the \`Counter\` from the previous problem (yields 1..=5). In \`main\`, compute the sum of products of \`Counter::new().zip(Counter::new().skip(1))\` where each pair is multiplied, then keep only products divisible by 3, and \`sum\` them. Print the result.

The pairs are (1,2), (2,3), (3,4), (4,5); products 2, 6, 12, 20; divisible by 3 are 6 and 12; sum is 18.`,
    hints: [
      'Chain: zip the two counters, map the pair to a product, filter divisible by 3, then sum.',
      'skip(1) on the second counter shifts it so it starts at 2.',
    ],
    solution: `struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

fn main() {
    let sum: u32 = Counter::new()
        .zip(Counter::new().skip(1))
        .map(|(a, b)| a * b)
        .filter(|product| product % 3 == 0)
        .sum();
    println!("{}", sum);
}`,
    starter: `struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

fn main() {
    // TODO: zip, multiply, filter by divisible-by-3, sum
}`,
    tags: ['iterator', 'zip', 'custom-iterator'],
  },
  {
    id: 'rs-ch13-c-063',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Fibonacci Iterator',
    prompt: `Define \`struct Fib { a: u64, b: u64 }\` and implement \`Iterator\` so each call to \`next\` yields the current Fibonacci number and advances the state. Start so the sequence produced is 0, 1, 1, 2, 3, 5, 8, ...

In \`main\`, take the first 8 values into a \`Vec<u64>\` and print it (expected: [0, 1, 1, 2, 3, 5, 8, 13]).`,
    hints: [
      'Store the next two numbers in a and b; next returns the old a.',
      'Update: let current = self.a; self.a = self.b; self.b = current + self.b; return Some(current).',
    ],
    solution: `struct Fib {
    a: u64,
    b: u64,
}

impl Iterator for Fib {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let current = self.a;
        self.a = self.b;
        self.b = current + self.b;
        Some(current)
    }
}

fn main() {
    let fib = Fib { a: 0, b: 1 };
    let first_eight: Vec<u64> = fib.take(8).collect();
    println!("{:?}", first_eight);
}`,
    starter: `struct Fib {
    a: u64,
    b: u64,
}

impl Iterator for Fib {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        // TODO: yield current Fibonacci number and advance
    }
}

fn main() {
    let fib = Fib { a: 0, b: 1 };
    let first_eight: Vec<u64> = fib.take(8).collect();
    println!("{:?}", first_eight);
}`,
    tags: ['iterator', 'trait', 'take'],
  },
  {
    id: 'rs-ch13-c-064',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Reasoning About Fn, FnMut, and FnOnce',
    prompt: `Write three functions, each taking a different closure trait bound and calling the closure appropriately:
- \`fn call_fn<F: Fn() -> i32>(f: F) -> i32\` calls \`f\` twice and returns the sum of both calls.
- \`fn call_fn_mut<F: FnMut() -> i32>(mut f: F) -> i32\` calls \`f\` twice and returns the second result.
- \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` calls \`f\` exactly once and returns its result.

In \`main\`, demonstrate each: pass a Fn that returns 7 (print 14), an FnMut counter closure capturing a mutable count (print 2), and an FnOnce that moves and returns an owned String (print it).`,
    hints: [
      'Fn can be called many times and only borrows immutably; FnMut needs the closure bound as mut; FnOnce may consume captured values.',
      'The FnMut example captures a let mut count = 0 and does count += 1; count.',
      'The FnOnce example uses move to take ownership of a String, then returns it.',
    ],
    solution: `fn call_fn<F: Fn() -> i32>(f: F) -> i32 {
    f() + f()
}

fn call_fn_mut<F: FnMut() -> i32>(mut f: F) -> i32 {
    f();
    f()
}

fn call_fn_once<F: FnOnce() -> String>(f: F) -> String {
    f()
}

fn main() {
    println!("{}", call_fn(|| 7));

    let mut count = 0;
    let counter = || {
        count += 1;
        count
    };
    println!("{}", call_fn_mut(counter));

    let owned = String::from("hello");
    let consume = move || owned;
    println!("{}", call_fn_once(consume));
}`,
    starter: `fn call_fn<F: Fn() -> i32>(f: F) -> i32 {
    // TODO: call f twice, return the sum
}

fn call_fn_mut<F: FnMut() -> i32>(mut f: F) -> i32 {
    // TODO: call f twice, return the second result
}

fn call_fn_once<F: FnOnce() -> String>(f: F) -> String {
    // TODO: call f once, return its result
}

fn main() {
    // TODO: demonstrate each of the three
}`,
    tags: ['closures', 'fn-trait', 'fnmut', 'fnonce'],
  },
  {
    id: 'rs-ch13-c-065',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Returned Closure That Counts',
    prompt: `Write \`fn make_adder(base: i32) -> impl Fn(i32) -> i32\` that returns a closure capturing \`base\`; the returned closure adds \`base\` to its argument.

In \`main\`, make an \`add_five\` from \`make_adder(5)\`, call it with 10 (expected: 15) and 100 (expected: 105), printing both. Then make an \`add_neg\` from \`make_adder(-3)\` and print \`add_neg(10)\` (expected: 7).`,
    hints: [
      'The return type impl Fn(i32) -> i32 lets you return a closure.',
      'Because the returned closure must outlive the function, it needs ownership of base via move.',
    ],
    solution: `fn make_adder(base: i32) -> impl Fn(i32) -> i32 {
    move |x| x + base
}

fn main() {
    let add_five = make_adder(5);
    println!("{}", add_five(10));
    println!("{}", add_five(100));

    let add_neg = make_adder(-3);
    println!("{}", add_neg(10));
}`,
    starter: `fn make_adder(base: i32) -> impl Fn(i32) -> i32 {
    // TODO: return a closure that adds base
}

fn main() {
    let add_five = make_adder(5);
    println!("{}", add_five(10));
    println!("{}", add_five(100));

    let add_neg = make_adder(-3);
    println!("{}", add_neg(10));
}`,
    tags: ['closures', 'move', 'impl-trait'],
  },
  {
    id: 'rs-ch13-c-066',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Word Frequency with Iterators',
    prompt: `Write \`fn word_count(text: &str) -> std::collections::HashMap<String, u32>\` that counts how many times each whitespace-separated word appears. Use \`split_whitespace\` to get an iterator over words, and a \`for\` loop with the entry API to tally counts.

In \`main\`, call it on "the cat the dog the cat" and print the count for "the" (expected: 3) and "cat" (expected: 2).`,
    hints: [
      'split_whitespace returns an iterator of &str.',
      'Use map.entry(word.to_string()).or_insert(0), then increment the returned reference.',
    ],
    solution: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, u32> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        let entry = counts.entry(word.to_string()).or_insert(0);
        *entry += 1;
    }
    counts
}

fn main() {
    let counts = word_count("the cat the dog the cat");
    println!("{}", counts["the"]);
    println!("{}", counts["cat"]);
}`,
    starter: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, u32> {
    // TODO: iterate words and tally counts with the entry API
}

fn main() {
    let counts = word_count("the cat the dog the cat");
    println!("{}", counts["the"]);
    println!("{}", counts["cat"]);
}`,
    tags: ['iterator', 'hashmap', 'split_whitespace'],
  },
  {
    id: 'rs-ch13-c-067',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parse and Sum Numbers from a String',
    prompt: `Write \`fn sum_numbers(line: &str) -> i32\` that takes a comma-separated string of integers (possibly with surrounding spaces), parses each into an \`i32\`, and returns their sum. Use an iterator chain with \`split\`, \`map\` to trim and parse, and \`sum\`.

In \`main\`, call it on " 1, 2 ,3, 10 " and print the result (expected: 16).`,
    hints: [
      'split(',') yields each piece as &str; trim() removes surrounding spaces.',
      'piece.trim().parse::<i32>() returns a Result; unwrap it inside the map closure for this exercise.',
    ],
    solution: `fn sum_numbers(line: &str) -> i32 {
    line.split(',')
        .map(|piece| piece.trim().parse::<i32>().unwrap())
        .sum()
}

fn main() {
    println!("{}", sum_numbers(" 1, 2 ,3, 10 "));
}`,
    starter: `fn sum_numbers(line: &str) -> i32 {
    // TODO: split on commas, trim and parse each, then sum
}

fn main() {
    println!("{}", sum_numbers(" 1, 2 ,3, 10 "));
}`,
    tags: ['iterator', 'map', 'parse'],
  },
  {
    id: 'rs-ch13-c-068',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Running Totals with scan',
    prompt: `Write \`fn running_totals(v: &Vec<i32>) -> Vec<i32>\` that returns the running (prefix) sums of \`v\` using the \`scan\` adaptor, which threads a mutable accumulator through the iterator.

For \`vec![1, 2, 3, 4]\` the result should be [1, 3, 6, 10]. Print the result in \`main\`.`,
    hints: [
      'scan(initial, |state, x| { *state += x; Some(*state) }) yields each updated state.',
      'Start the accumulator at 0; the closure returns Some(*state) so values are produced.',
    ],
    solution: `fn running_totals(v: &Vec<i32>) -> Vec<i32> {
    v.iter()
        .scan(0, |state, &x| {
            *state += x;
            Some(*state)
        })
        .collect()
}

fn main() {
    let v = vec![1, 2, 3, 4];
    println!("{:?}", running_totals(&v));
}`,
    starter: `fn running_totals(v: &Vec<i32>) -> Vec<i32> {
    // TODO: use scan to produce running totals
}

fn main() {
    let v = vec![1, 2, 3, 4];
    println!("{:?}", running_totals(&v));
}`,
    tags: ['iterator', 'scan', 'collect'],
  },
  {
    id: 'rs-ch13-c-069',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Flatten Rows with flat_map',
    prompt: `Write \`fn flatten(rows: &Vec<Vec<i32>>) -> Vec<i32>\` that concatenates all inner vectors into a single vector, in order, using the \`flat_map\` adaptor.

In \`main\`, call it on \`vec![vec![1, 2], vec![3], vec![4, 5, 6]]\` and print the result (expected: [1, 2, 3, 4, 5, 6]).`,
    hints: [
      'flat_map maps each element to an iterator and flattens the results.',
      'For each inner Vec, return row.iter().copied() so values are produced.',
    ],
    solution: `fn flatten(rows: &Vec<Vec<i32>>) -> Vec<i32> {
    rows.iter().flat_map(|row| row.iter().copied()).collect()
}

fn main() {
    let rows = vec![vec![1, 2], vec![3], vec![4, 5, 6]];
    println!("{:?}", flatten(&rows));
}`,
    starter: `fn flatten(rows: &Vec<Vec<i32>>) -> Vec<i32> {
    // TODO: use flat_map to concatenate inner vectors
}

fn main() {
    let rows = vec![vec![1, 2], vec![3], vec![4, 5, 6]];
    println!("{:?}", flatten(&rows));
}`,
    tags: ['iterator', 'flat_map', 'collect'],
  },
  {
    id: 'rs-ch13-c-070',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Build a Leaderboard',
    prompt: `Define \`struct Score { player: String, points: u32 }\`. Write \`fn leaderboard(scores: &Vec<Score>, min: u32) -> Vec<String>\` that:
1. keeps only scores with \`points\` of at least \`min\` (filter, capturing \`min\`),
2. sorts the kept scores by points descending,
3. returns formatted strings of the form "player: points".

In \`main\`, build four players with points 50, 90, 30, 70 and call \`leaderboard(&scores, 50)\`. The result must list the players with at least 50 points, highest first, each as "name: points". Print each line.`,
    hints: [
      'Collect references into a Vec first, then sort that vector with sort_by_key.',
      'To sort descending by points, sort by std::cmp::Reverse(s.points) or negate the comparison.',
      'Finish with a map producing format!("{}: {}", s.player, s.points) then collect.',
    ],
    solution: `use std::cmp::Reverse;

struct Score {
    player: String,
    points: u32,
}

fn leaderboard(scores: &Vec<Score>, min: u32) -> Vec<String> {
    let mut kept: Vec<&Score> = scores.iter().filter(|s| s.points >= min).collect();
    kept.sort_by_key(|s| Reverse(s.points));
    kept.iter()
        .map(|s| format!("{}: {}", s.player, s.points))
        .collect()
}

fn main() {
    let scores = vec![
        Score { player: String::from("Ann"), points: 50 },
        Score { player: String::from("Ben"), points: 90 },
        Score { player: String::from("Cara"), points: 30 },
        Score { player: String::from("Dan"), points: 70 },
    ];
    for line in leaderboard(&scores, 50) {
        println!("{}", line);
    }
}`,
    starter: `use std::cmp::Reverse;

struct Score {
    player: String,
    points: u32,
}

fn leaderboard(scores: &Vec<Score>, min: u32) -> Vec<String> {
    // TODO: filter by min, sort descending by points, format strings
}

fn main() {
    let scores = vec![
        Score { player: String::from("Ann"), points: 50 },
        Score { player: String::from("Ben"), points: 90 },
        Score { player: String::from("Cara"), points: 30 },
        Score { player: String::from("Dan"), points: 70 },
    ];
    for line in leaderboard(&scores, 50) {
        println!("{}", line);
    }
}`,
    tags: ['iterator', 'filter', 'sort_by_key'],
  },
]

export default problems
