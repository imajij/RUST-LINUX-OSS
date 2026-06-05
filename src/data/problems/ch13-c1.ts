import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch13-c-001',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Store a Closure in a Variable',
    prompt: `Define a closure that takes one \`i32\` parameter and returns that value plus 1. Store it in a variable named \`add_one\`.

In \`main\`, call the closure with the value 4 and print the result with \`println!("{}", ...)\`. The output should be \`5\`.`,
    hints: [
      'Closure syntax uses vertical bars for parameters, like \`|x| x + 1\`.',
      'Call a stored closure just like a function: \`add_one(4)\`.',
    ],
    solution: `fn main() {
    let add_one = |x: i32| x + 1;
    println!("{}", add_one(4));
}`,
    starter: `fn main() {
    // TODO: define a closure add_one and call it with 4
}`,
    tags: ['closures', 'basics'],
  },
  {
    id: 'rs-ch13-c-002',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Closure With No Parameters',
    prompt: `Define a closure named \`greet\` that takes no parameters and returns the string slice \`"hello"\`.

Call it in \`main\` and print the returned value. The output should be \`hello\`.`,
    hints: [
      'A closure with no parameters uses empty bars: \`|| "hello"\`.',
      'Call it with empty parentheses: \`greet()\`.',
    ],
    solution: `fn main() {
    let greet = || "hello";
    println!("{}", greet());
}`,
    starter: `fn main() {
    // TODO: define a no-parameter closure greet and call it
}`,
    tags: ['closures', 'basics'],
  },
  {
    id: 'rs-ch13-c-003',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Capture a Variable by Reference',
    prompt: `In \`main\`, create \`let factor = 3;\`. Then define a closure named \`scale\` that takes an \`i32\` parameter \`n\` and returns \`n * factor\`, capturing \`factor\` from the surrounding scope.

Call \`scale(5)\` and print the result. The output should be \`15\`.`,
    hints: [
      'A closure can use variables from the scope where it is defined without listing them as parameters.',
      'Here \`factor\` is captured by immutable reference because it is only read.',
    ],
    solution: `fn main() {
    let factor = 3;
    let scale = |n: i32| n * factor;
    println!("{}", scale(5));
}`,
    starter: `fn main() {
    let factor = 3;
    // TODO: define scale capturing factor, then call scale(5)
}`,
    tags: ['closures', 'capture'],
  },
  {
    id: 'rs-ch13-c-004',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Two-Parameter Closure',
    prompt: `Define a closure named \`add\` that takes two \`i32\` parameters and returns their sum.

In \`main\`, call \`add(7, 8)\` and print the result. The output should be \`15\`.`,
    hints: [
      'List both parameters between the bars, separated by a comma: \`|a, b| ...\`.',
    ],
    solution: `fn main() {
    let add = |a: i32, b: i32| a + b;
    println!("{}", add(7, 8));
}`,
    starter: `fn main() {
    // TODO: define a two-parameter closure add and call it
}`,
    tags: ['closures', 'basics'],
  },
  {
    id: 'rs-ch13-c-005',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Iterate a Vector With a for Loop',
    prompt: `Given \`let v = vec![10, 20, 30];\`, create an iterator over \`v\` with \`.iter()\` and use a \`for\` loop to print each element on its own line.

The output should be three lines: \`10\`, \`20\`, \`30\`.`,
    hints: [
      'Calling \`.iter()\` produces an iterator that yields references to each element.',
      'A \`for x in v.iter()\` loop walks through the iterator for you.',
    ],
    solution: `fn main() {
    let v = vec![10, 20, 30];
    for x in v.iter() {
        println!("{}", x);
    }
}`,
    starter: `fn main() {
    let v = vec![10, 20, 30];
    // TODO: iterate with v.iter() and print each element
}`,
    tags: ['iterators', 'iter'],
  },
  {
    id: 'rs-ch13-c-006',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Call next on an Iterator',
    prompt: `Given \`let v = vec![1, 2, 3];\`, create a mutable iterator with \`let mut it = v.iter();\`. Call \`it.next()\` once and print the result.

The output should be \`Some(1)\`. Use the \`{:?}\` debug formatter to print the \`Option\`.`,
    hints: [
      'The iterator must be \`mut\` because \`next\` changes internal state.',
      '\`next\` returns an \`Option\`; print it with \`{:?}\`.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3];
    let mut it = v.iter();
    println!("{:?}", it.next());
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3];
    let mut it = v.iter();
    // TODO: call it.next() once and print the result with {:?}
}`,
    tags: ['iterators', 'next'],
  },
  {
    id: 'rs-ch13-c-007',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Sum a Vector With sum',
    prompt: `Given \`let v = vec![1, 2, 3, 4, 5];\`, use \`.iter().sum()\` to compute the total of all elements into a variable \`total: i32\`, then print it.

The output should be \`15\`.`,
    hints: [
      '\`sum\` is a consuming adaptor that adds every item the iterator yields.',
      'Annotate the result type so Rust knows what to sum into: \`let total: i32 = ...\`.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3, 4, 5];
    let total: i32 = v.iter().sum();
    println!("{}", total);
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3, 4, 5];
    // TODO: compute total with sum() and print it
}`,
    tags: ['iterators', 'sum', 'consuming'],
  },
  {
    id: 'rs-ch13-c-008',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Count Iterator Elements',
    prompt: `Given \`let words = vec!["a", "bb", "ccc", "dddd"];\`, use \`.iter().count()\` to find how many elements the vector has, store it in \`n\`, and print it.

The output should be \`4\`.`,
    hints: [
      '\`count\` consumes the iterator and returns how many items it produced.',
    ],
    solution: `fn main() {
    let words = vec!["a", "bb", "ccc", "dddd"];
    let n = words.iter().count();
    println!("{}", n);
}`,
    starter: `fn main() {
    let words = vec!["a", "bb", "ccc", "dddd"];
    // TODO: count the elements and print the count
}`,
    tags: ['iterators', 'count', 'consuming'],
  },
  {
    id: 'rs-ch13-c-009',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Double Every Number With map',
    prompt: `Given \`let v = vec![1, 2, 3];\`, use \`.iter().map(...)\` with a closure to double each value, then \`.collect()\` into a new \`Vec<i32>\` named \`doubled\`.

Print it with \`{:?}\`. The output should be \`[2, 4, 6]\`.`,
    hints: [
      '\`map\` applies a closure to each item; the closure receives a reference here, so use \`|x| x * 2\`.',
      '\`collect\` needs to know the target type: \`let doubled: Vec<i32> = ...\`.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3];
    let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();
    println!("{:?}", doubled);
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3];
    // TODO: map each value to its double and collect into doubled
}`,
    tags: ['iterators', 'map', 'collect'],
  },
  {
    id: 'rs-ch13-c-010',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Keep Only Even Numbers With filter',
    prompt: `Given \`let v = vec![1, 2, 3, 4, 5, 6];\`, use \`.into_iter().filter(...)\` with a closure to keep only the even numbers, then \`.collect()\` into a \`Vec<i32>\` named \`evens\`.

Print it with \`{:?}\`. The output should be \`[2, 4, 6]\`.`,
    hints: [
      'The filter closure returns a \`bool\`: keep the item when it is \`true\`.',
      'A number is even when \`n % 2 == 0\`.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    let evens: Vec<i32> = v.into_iter().filter(|n| n % 2 == 0).collect();
    println!("{:?}", evens);
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    // TODO: filter to even numbers and collect into evens
}`,
    tags: ['iterators', 'filter', 'collect'],
  },
  {
    id: 'rs-ch13-c-011',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Enumerate a Vector',
    prompt: `Given \`let items = vec!["red", "green", "blue"];\`, use \`.iter().enumerate()\` in a \`for\` loop to print each element with its index in the form \`index: value\`.

The output should be:
\`0: red\`
\`1: green\`
\`2: blue\``,
    hints: [
      '\`enumerate\` yields tuples of \`(index, item)\`.',
      'Destructure the tuple in the loop: \`for (i, item) in ...\`.',
    ],
    solution: `fn main() {
    let items = vec!["red", "green", "blue"];
    for (i, item) in items.iter().enumerate() {
        println!("{}: {}", i, item);
    }
}`,
    starter: `fn main() {
    let items = vec!["red", "green", "blue"];
    // TODO: enumerate and print "index: value" lines
}`,
    tags: ['iterators', 'enumerate'],
  },
  {
    id: 'rs-ch13-c-012',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Take the First Three Elements',
    prompt: `Given \`let v = vec![1, 2, 3, 4, 5, 6];\`, use \`.into_iter().take(3)\` and \`.collect()\` into a \`Vec<i32>\` named \`first_three\`.

Print it with \`{:?}\`. The output should be \`[1, 2, 3]\`.`,
    hints: [
      '\`take(n)\` yields at most the first \`n\` items, then stops.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    let first_three: Vec<i32> = v.into_iter().take(3).collect();
    println!("{:?}", first_three);
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    // TODO: take the first three and collect into first_three
}`,
    tags: ['iterators', 'take', 'collect'],
  },
  {
    id: 'rs-ch13-c-013',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pass a Closure as a Function Argument',
    prompt: `Write a function \`apply(f: impl Fn(i32) -> i32, value: i32) -> i32\` that calls \`f\` on \`value\` and returns the result.

In \`main\`, call \`apply\` with a closure that squares its input and the value 6. Print the result. The output should be \`36\`.`,
    hints: [
      'The \`impl Fn(i32) -> i32\` parameter accepts any closure with that signature.',
      'Pass a closure inline: \`apply(|x| x * x, 6)\`.',
    ],
    solution: `fn apply(f: impl Fn(i32) -> i32, value: i32) -> i32 {
    f(value)
}

fn main() {
    let result = apply(|x| x * x, 6);
    println!("{}", result);
}`,
    starter: `fn apply(f: impl Fn(i32) -> i32, value: i32) -> i32 {
    // TODO: call f on value
}

fn main() {
    // TODO: call apply with a squaring closure and 6
}`,
    tags: ['closures', 'fn-trait'],
  },
  {
    id: 'rs-ch13-c-014',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Mutable Closure That Counts',
    prompt: `In \`main\`, create \`let mut count = 0;\`. Define a closure named \`increment\` that adds 1 to \`count\` each time it is called (capturing \`count\` by mutable reference).

Call \`increment()\` three times, then print \`count\`. The output should be \`3\`.

Note: because the closure borrows \`count\` mutably, you must not use \`count\` again until after the closure's last call.`,
    hints: [
      'A closure that modifies a captured variable must be stored in a \`mut\` binding.',
      'Inside the closure write \`count += 1;\`.',
    ],
    solution: `fn main() {
    let mut count = 0;
    let mut increment = || count += 1;
    increment();
    increment();
    increment();
    println!("{}", count);
}`,
    starter: `fn main() {
    let mut count = 0;
    // TODO: define a mutable closure increment, call it 3 times, print count
}`,
    tags: ['closures', 'fnmut', 'capture'],
  },
  {
    id: 'rs-ch13-c-015',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Move a String Into a Closure',
    prompt: `In \`main\`, create \`let name = String::from("Rust");\`. Define a closure using the \`move\` keyword that takes ownership of \`name\` and returns its length as a \`usize\`.

Call the closure and print the result. The output should be \`4\`.`,
    hints: [
      'Put \`move\` before the parameter bars to force the closure to take ownership of captured values.',
      'Use \`name.len()\` inside the closure to get the length.',
    ],
    solution: `fn main() {
    let name = String::from("Rust");
    let length = move || name.len();
    println!("{}", length());
}`,
    starter: `fn main() {
    let name = String::from("Rust");
    // TODO: define a move closure that returns name.len(), then call it
}`,
    tags: ['closures', 'move', 'ownership'],
  },
  {
    id: 'rs-ch13-c-016',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sort Strings by Length',
    prompt: `Given \`let mut words = vec![String::from("pear"), String::from("fig"), String::from("apple")];\`, use \`sort_by_key\` with a closure to sort the vector by each string's length (shortest first).

Print the vector with \`{:?}\`. The output should be \`["fig", "pear", "apple"]\`.`,
    hints: [
      '\`sort_by_key\` takes a closure that returns the key to sort by.',
      'The closure receives a reference to each element; return \`s.len()\`.',
    ],
    solution: `fn main() {
    let mut words = vec![
        String::from("pear"),
        String::from("fig"),
        String::from("apple"),
    ];
    words.sort_by_key(|s| s.len());
    println!("{:?}", words);
}`,
    starter: `fn main() {
    let mut words = vec![
        String::from("pear"),
        String::from("fig"),
        String::from("apple"),
    ];
    // TODO: sort by length using sort_by_key, then print
}`,
    tags: ['closures', 'sort_by_key'],
  },
  {
    id: 'rs-ch13-c-017',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Filter Using a Captured Threshold',
    prompt: `Write a function \`above(v: Vec<i32>, threshold: i32) -> Vec<i32>\` that returns a new vector containing only the elements of \`v\` greater than \`threshold\`. Use \`into_iter().filter(...)\` with a closure that captures \`threshold\`.

In \`main\`, call \`above(vec![3, 7, 2, 9, 5], 4)\` and print the result with \`{:?}\`. The output should be \`[7, 9, 5]\`.`,
    hints: [
      'The filter closure can read \`threshold\` from the surrounding function.',
      'Return the collected vector from \`above\`.',
    ],
    solution: `fn above(v: Vec<i32>, threshold: i32) -> Vec<i32> {
    v.into_iter().filter(|n| *n > threshold).collect()
}

fn main() {
    let result = above(vec![3, 7, 2, 9, 5], 4);
    println!("{:?}", result);
}`,
    starter: `fn above(v: Vec<i32>, threshold: i32) -> Vec<i32> {
    // TODO: filter elements greater than threshold and collect
}

fn main() {
    let result = above(vec![3, 7, 2, 9, 5], 4);
    println!("{:?}", result);
}`,
    tags: ['iterators', 'filter', 'closures'],
  },
  {
    id: 'rs-ch13-c-018',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reverse an Iterator',
    prompt: `Given \`let v = vec![1, 2, 3, 4];\`, use \`.into_iter().rev()\` and \`.collect()\` into a \`Vec<i32>\` named \`reversed\`.

Print it with \`{:?}\`. The output should be \`[4, 3, 2, 1]\`.`,
    hints: [
      '\`rev\` reverses the order of a double-ended iterator.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3, 4];
    let reversed: Vec<i32> = v.into_iter().rev().collect();
    println!("{:?}", reversed);
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3, 4];
    // TODO: reverse with rev() and collect into reversed
}`,
    tags: ['iterators', 'rev', 'collect'],
  },
  {
    id: 'rs-ch13-c-019',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Skip the First Two Elements',
    prompt: `Given \`let v = vec![10, 20, 30, 40, 50];\`, use \`.into_iter().skip(2)\` and \`.collect()\` into a \`Vec<i32>\` named \`rest\`.

Print it with \`{:?}\`. The output should be \`[30, 40, 50]\`.`,
    hints: [
      '\`skip(n)\` discards the first \`n\` items and yields the rest.',
    ],
    solution: `fn main() {
    let v = vec![10, 20, 30, 40, 50];
    let rest: Vec<i32> = v.into_iter().skip(2).collect();
    println!("{:?}", rest);
}`,
    starter: `fn main() {
    let v = vec![10, 20, 30, 40, 50];
    // TODO: skip the first two and collect into rest
}`,
    tags: ['iterators', 'skip', 'collect'],
  },
  {
    id: 'rs-ch13-c-020',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Zip Two Vectors Together',
    prompt: `Given \`let names = vec!["Ann", "Bob"];\` and \`let ages = vec![30, 25];\`, use \`.iter().zip(...)\` to pair them, then loop and print each pair as \`name is age\`.

The output should be:
\`Ann is 30\`
\`Bob is 25\``,
    hints: [
      '\`zip\` combines two iterators into one that yields tuples.',
      'Destructure each tuple in the loop: \`for (name, age) in ...\`.',
    ],
    solution: `fn main() {
    let names = vec!["Ann", "Bob"];
    let ages = vec![30, 25];
    for (name, age) in names.iter().zip(ages.iter()) {
        println!("{} is {}", name, age);
    }
}`,
    starter: `fn main() {
    let names = vec!["Ann", "Bob"];
    let ages = vec![30, 25];
    // TODO: zip the two vectors and print "name is age" lines
}`,
    tags: ['iterators', 'zip'],
  },
  {
    id: 'rs-ch13-c-021',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fold to a Product',
    prompt: `Given \`let v = vec![1, 2, 3, 4];\`, use \`.iter().fold(...)\` to compute the product of all elements, starting from an initial accumulator of 1. Store it in \`product\` and print it.

The output should be \`24\`.`,
    hints: [
      '\`fold\` takes an initial value and a closure \`|acc, item| ...\` that combines them.',
      'Multiply the accumulator by each item: \`|acc, x| acc * x\`.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3, 4];
    let product = v.iter().fold(1, |acc, x| acc * x);
    println!("{}", product);
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3, 4];
    // TODO: fold with an accumulator of 1 to compute the product
}`,
    tags: ['iterators', 'fold', 'consuming'],
  },
  {
    id: 'rs-ch13-c-022',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Square Then Sum',
    prompt: `Given \`let v = vec![1, 2, 3, 4];\`, chain \`.iter().map(...)\` to square each value, then \`.sum()\` into a variable \`total: i32\`. Print it.

The output should be \`30\` (1 + 4 + 9 + 16).`,
    hints: [
      'Chain \`map\` to transform, then \`sum\` to consume.',
      'Annotate the type: \`let total: i32 = ...\`.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3, 4];
    let total: i32 = v.iter().map(|x| x * x).sum();
    println!("{}", total);
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3, 4];
    // TODO: square each value with map, then sum into total
}`,
    tags: ['iterators', 'map', 'sum'],
  },
  {
    id: 'rs-ch13-c-023',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Matching Elements',
    prompt: `Write a function \`count_long(words: &[&str]) -> usize\` that returns how many strings in the slice have length greater than 3. Use \`.iter().filter(...).count()\`.

In \`main\`, call it with \`&["hi", "hello", "yo", "world"]\` and print the result. The output should be \`2\`.`,
    hints: [
      'Filter to the elements you want, then \`count\` them.',
      'The filter closure receives a reference to a \`&str\`; use \`w.len() > 3\`.',
    ],
    solution: `fn count_long(words: &[&str]) -> usize {
    words.iter().filter(|w| w.len() > 3).count()
}

fn main() {
    let words = ["hi", "hello", "yo", "world"];
    println!("{}", count_long(&words));
}`,
    starter: `fn count_long(words: &[&str]) -> usize {
    // TODO: count strings longer than 3 characters
}

fn main() {
    let words = ["hi", "hello", "yo", "world"];
    println!("{}", count_long(&words));
}`,
    tags: ['iterators', 'filter', 'count'],
  },
  {
    id: 'rs-ch13-c-024',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Collect Uppercased Strings',
    prompt: `Given \`let words = vec!["cat", "dog", "owl"];\`, use \`.iter().map(...)\` to turn each word into uppercase with \`to_uppercase()\`, then \`.collect()\` into a \`Vec<String>\` named \`shouted\`.

Print it with \`{:?}\`. The output should be \`["CAT", "DOG", "OWL"]\`.`,
    hints: [
      '\`to_uppercase\` returns a new \`String\`.',
      'Collect into \`Vec<String>\` with a type annotation.',
    ],
    solution: `fn main() {
    let words = vec!["cat", "dog", "owl"];
    let shouted: Vec<String> = words.iter().map(|w| w.to_uppercase()).collect();
    println!("{:?}", shouted);
}`,
    starter: `fn main() {
    let words = vec!["cat", "dog", "owl"];
    // TODO: map each word to uppercase and collect into shouted
}`,
    tags: ['iterators', 'map', 'collect'],
  },
  {
    id: 'rs-ch13-c-025',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build a Range of Squares',
    prompt: `Use the range \`1..=5\` as an iterator, map each number to its square, and collect into a \`Vec<i32>\` named \`squares\`.

Print it with \`{:?}\`. The output should be \`[1, 4, 9, 16, 25]\`.`,
    hints: [
      'A range like \`1..=5\` is already an iterator, so you can call adaptors on it directly.',
      'Map with \`|n| n * n\` and collect.',
    ],
    solution: `fn main() {
    let squares: Vec<i32> = (1..=5).map(|n| n * n).collect();
    println!("{:?}", squares);
}`,
    starter: `fn main() {
    // TODO: map 1..=5 to squares and collect into squares
}`,
    tags: ['iterators', 'range', 'map'],
  },
  {
    id: 'rs-ch13-c-026',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum of Even Squares',
    prompt: `Given \`let v = vec![1, 2, 3, 4, 5, 6];\`, chain iterator adaptors to: keep only even numbers, square each, then sum them into \`total: i32\`. Print it.

The even numbers are 2, 4, 6; their squares are 4, 16, 36; the output should be \`56\`.`,
    hints: [
      'Order the chain as \`filter\` then \`map\` then \`sum\`.',
      'The filter closure gets a reference: use \`|n| *n % 2 == 0\` or \`n % 2 == 0\`.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    let total: i32 = v.iter().filter(|n| *n % 2 == 0).map(|n| n * n).sum();
    println!("{}", total);
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    // TODO: filter evens, square them, and sum into total
}`,
    tags: ['iterators', 'filter', 'map', 'sum'],
  },
  {
    id: 'rs-ch13-c-027',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pair Indices With Values',
    prompt: `Given \`let v = vec!["a", "b", "c"];\`, use \`.iter().enumerate().map(...)\` to build a \`Vec<String>\` named \`labeled\` where each entry is the index and value joined as \`index-value\` (for example \`0-a\`). Use \`format!\` inside the map closure.

Print it with \`{:?}\`. The output should be \`["0-a", "1-b", "2-c"]\`.`,
    hints: [
      '\`enumerate\` yields \`(index, item)\`; destructure it in the map closure: \`|(i, x)| ...\`.',
      'Use \`format!("{}-{}", i, x)\` to build each string.',
    ],
    solution: `fn main() {
    let v = vec!["a", "b", "c"];
    let labeled: Vec<String> = v
        .iter()
        .enumerate()
        .map(|(i, x)| format!("{}-{}", i, x))
        .collect();
    println!("{:?}", labeled);
}`,
    starter: `fn main() {
    let v = vec!["a", "b", "c"];
    // TODO: enumerate then map each (i, x) to "i-x" and collect into labeled
}`,
    tags: ['iterators', 'enumerate', 'map'],
  },
  {
    id: 'rs-ch13-c-028',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find the Maximum With max',
    prompt: `Given \`let v = vec![4, 1, 9, 3, 7];\`, use \`.iter().max()\` to get the largest element. It returns an \`Option\`; unwrap it with \`.unwrap()\` and print the value.

The output should be \`9\`.`,
    hints: [
      '\`max\` is a consuming adaptor that returns \`Option<&T>\`.',
      'Use \`.unwrap()\` since the vector is non-empty.',
    ],
    solution: `fn main() {
    let v = vec![4, 1, 9, 3, 7];
    let largest = v.iter().max().unwrap();
    println!("{}", largest);
}`,
    starter: `fn main() {
    let v = vec![4, 1, 9, 3, 7];
    // TODO: find the max with max(), unwrap it, and print
}`,
    tags: ['iterators', 'max', 'consuming'],
  },
  {
    id: 'rs-ch13-c-029',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Return a Closure From a Function',
    prompt: `Write a function \`make_adder(n: i32) -> impl Fn(i32) -> i32\` that returns a closure which adds \`n\` to its argument. Use \`move\` so the closure owns \`n\`.

In \`main\`, create \`let add5 = make_adder(5);\`, call \`add5(10)\`, and print the result. The output should be \`15\`.`,
    hints: [
      'The return type \`impl Fn(i32) -> i32\` describes the closure you return.',
      'Use a \`move\` closure so the returned closure owns the captured \`n\`.',
    ],
    solution: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn main() {
    let add5 = make_adder(5);
    println!("{}", add5(10));
}`,
    starter: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    // TODO: return a move closure that adds n to its argument
}

fn main() {
    let add5 = make_adder(5);
    println!("{}", add5(10));
}`,
    tags: ['closures', 'move', 'fn-trait'],
  },
  {
    id: 'rs-ch13-c-030',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Apply a Closure to Each Item With map',
    prompt: `Write a function \`transform(v: Vec<i32>, f: impl Fn(i32) -> i32) -> Vec<i32>\` that applies \`f\` to every element of \`v\` and collects the results into a new vector.

In \`main\`, call \`transform(vec![1, 2, 3], |x| x + 10)\` and print the result with \`{:?}\`. The output should be \`[11, 12, 13]\`.`,
    hints: [
      'Use \`v.into_iter().map(f).collect()\`.',
      '\`f\` is any closure that matches \`Fn(i32) -> i32\`.',
    ],
    solution: `fn transform(v: Vec<i32>, f: impl Fn(i32) -> i32) -> Vec<i32> {
    v.into_iter().map(f).collect()
}

fn main() {
    let result = transform(vec![1, 2, 3], |x| x + 10);
    println!("{:?}", result);
}`,
    starter: `fn transform(v: Vec<i32>, f: impl Fn(i32) -> i32) -> Vec<i32> {
    // TODO: map f over v and collect
}

fn main() {
    let result = transform(vec![1, 2, 3], |x| x + 10);
    println!("{:?}", result);
}`,
    tags: ['closures', 'map', 'fn-trait'],
  },
  {
    id: 'rs-ch13-c-031',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Collect Into a String',
    prompt: `Given \`let chars = vec!['r', 'u', 's', 't'];\`, use \`.into_iter().collect()\` to gather the characters into a \`String\` named \`word\`.

Print it. The output should be \`rust\`.`,
    hints: [
      '\`collect\` can build a \`String\` from an iterator of \`char\`.',
      'Annotate the target type: \`let word: String = ...\`.',
    ],
    solution: `fn main() {
    let chars = vec!['r', 'u', 's', 't'];
    let word: String = chars.into_iter().collect();
    println!("{}", word);
}`,
    starter: `fn main() {
    let chars = vec!['r', 'u', 's', 't'];
    // TODO: collect the chars into a String named word and print it
}`,
    tags: ['iterators', 'collect', 'string'],
  },
  {
    id: 'rs-ch13-c-032',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Average of Even Numbers',
    prompt: `Given \`let v = vec![2, 3, 6, 7, 8];\`, keep only the even numbers, then compute their average as an \`f64\` and print it.

Hint: collect the evens into a \`Vec<i32>\` first, then use \`.iter().sum::<i32>()\` and \`.len()\` to compute the average. The evens are 2, 6, 8; the average is \`5.333333333333333\`.`,
    hints: [
      'Filter into a \`Vec<i32>\` of evens first so you can use both \`sum\` and \`len\`.',
      'Convert with \`as f64\`: \`sum as f64 / count as f64\`.',
    ],
    solution: `fn main() {
    let v = vec![2, 3, 6, 7, 8];
    let evens: Vec<i32> = v.into_iter().filter(|n| n % 2 == 0).collect();
    let sum: i32 = evens.iter().sum();
    let average = sum as f64 / evens.len() as f64;
    println!("{}", average);
}`,
    starter: `fn main() {
    let v = vec![2, 3, 6, 7, 8];
    // TODO: filter evens, then compute and print their average as f64
}`,
    tags: ['iterators', 'filter', 'sum'],
  },
  {
    id: 'rs-ch13-c-033',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Implement Iterator for a Counter',
    prompt: `Define a struct \`Counter\` with a single \`u32\` field \`count\`, and a \`new()\` associated function that starts \`count\` at 0.

Implement the \`Iterator\` trait for \`Counter\` so that each call to \`next\` increments \`count\` and yields values 1, 2, 3, 4, 5, then returns \`None\`. Set \`type Item = u32;\`.

In \`main\`, collect the counter into a \`Vec<u32>\` and print it with \`{:?}\`. The output should be \`[1, 2, 3, 4, 5]\`.`,
    hints: [
      'Inside \`next\`, increment \`self.count\`; while it is 5 or less, return \`Some(self.count)\`, otherwise \`None\`.',
      'You must declare \`type Item = u32;\` in the impl block.',
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
    let values: Vec<u32> = Counter::new().collect();
    println!("{:?}", values);
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
    let values: Vec<u32> = Counter::new().collect();
    println!("{:?}", values);
}`,
    tags: ['iterators', 'custom-iterator', 'trait'],
  },
  {
    id: 'rs-ch13-c-034',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use a Custom Counter With Adaptors',
    prompt: `Reuse the \`Counter\` struct from before (it yields 1, 2, 3, 4, 5 then \`None\`). In \`main\`, build a new \`Counter\`, map each value to its square with \`map\`, keep only values greater than 5 with \`filter\`, and \`sum\` the survivors into \`total: u32\`. Print it.

The squares are 1, 4, 9, 16, 25; those greater than 5 are 9, 16, 25; the output should be \`50\`.`,
    hints: [
      'Because \`Counter\` implements \`Iterator\`, you can call \`map\`, \`filter\`, and \`sum\` on it directly.',
      'Chain the adaptors: \`Counter::new().map(...).filter(...).sum()\`.',
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
    let total: u32 = Counter::new()
        .map(|n| n * n)
        .filter(|n| *n > 5)
        .sum();
    println!("{}", total);
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
    // TODO: map squares, filter > 5, sum into total, and print
}`,
    tags: ['iterators', 'custom-iterator', 'adaptors'],
  },
  {
    id: 'rs-ch13-c-035',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Dot Product With zip and map',
    prompt: `Write a function \`dot(a: &[i32], b: &[i32]) -> i32\` that computes the dot product of two equal-length slices: multiply each pair of corresponding elements and sum the products. Use \`.iter().zip(...).map(...).sum()\`.

In \`main\`, call \`dot(&[1, 2, 3], &[4, 5, 6])\` and print the result. The dot product is 1*4 + 2*5 + 3*6 = \`32\`.`,
    hints: [
      'Zip the two iterators to get pairs, then map each pair to its product.',
      'In the map closure, destructure the tuple: \`|(x, y)| x * y\`.',
    ],
    solution: `fn dot(a: &[i32], b: &[i32]) -> i32 {
    a.iter().zip(b.iter()).map(|(x, y)| x * y).sum()
}

fn main() {
    let result = dot(&[1, 2, 3], &[4, 5, 6]);
    println!("{}", result);
}`,
    starter: `fn dot(a: &[i32], b: &[i32]) -> i32 {
    // TODO: zip a and b, multiply pairs, and sum
}

fn main() {
    let result = dot(&[1, 2, 3], &[4, 5, 6]);
    println!("{}", result);
}`,
    tags: ['iterators', 'zip', 'map', 'sum'],
  },
]

export default problems
