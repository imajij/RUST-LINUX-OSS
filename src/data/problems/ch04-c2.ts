import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch04-c-036',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Greet By Borrowing',
    prompt: `Write a function with the signature \`fn greet(name: &String) -> String\` that returns a greeting like \`"Hello, Alice!"\` WITHOUT taking ownership of the input. In \`main\`, create a \`String\` named \`name\`, call \`greet\`, print the greeting, and then print \`name\` again to prove it is still usable.`,
    hints: [
      'Take the parameter by reference so ownership stays with the caller.',
      'Use format! to build the returned String.',
    ],
    solution: `fn greet(name: &String) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    let name = String::from("Alice");
    let message = greet(&name);
    println!("{}", message);
    println!("{} is still usable", name);
}`,
    starter: `fn greet(name: &String) -> String {
    todo!()
}

fn main() {
    let name = String::from("Alice");
    // TODO: call greet, print the greeting, then print name again
}`,
    tags: ['ownership', 'references', 'borrowing'],
  },
  {
    id: 'rs-ch04-c-037',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Length Without Moving',
    prompt: `Write \`fn calculate_length(s: &String) -> usize\` that returns the length of the string without taking ownership. In \`main\`, build a \`String\`, call the function, and print both the original string and its length on one line, e.g. \`The length of 'hello' is 5\`.`,
    hints: ['Borrow with &String.', 'Call .len() on the borrowed value.'],
    solution: `fn calculate_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);
    println!("The length of '{}' is {}", s, len);
}`,
    starter: `fn calculate_length(s: &String) -> usize {
    todo!()
}

fn main() {
    let s = String::from("hello");
    // TODO: get the length without moving s, then print both
}`,
    tags: ['references', 'borrowing', 'ownership'],
  },
  {
    id: 'rs-ch04-c-038',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Clone To Keep Both',
    prompt: `Write \`fn consume(s: String)\` that takes ownership of a \`String\` and prints it. In \`main\`, create a \`String\` called \`original\`. You must call \`consume\` AND still be able to print \`original\` afterward. Use cloning so both the function call and the later print are valid.`,
    hints: [
      'Passing a String by value moves it.',
      'Clone the String before passing it in so the original is untouched.',
    ],
    solution: `fn consume(s: String) {
    println!("consumed: {}", s);
}

fn main() {
    let original = String::from("data");
    consume(original.clone());
    println!("original still here: {}", original);
}`,
    starter: `fn consume(s: String) {
    println!("consumed: {}", s);
}

fn main() {
    let original = String::from("data");
    // TODO: call consume but keep original usable, then print original
}`,
    tags: ['clone', 'move', 'ownership'],
  },
  {
    id: 'rs-ch04-c-039',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Copy Types Do Not Move',
    prompt: `Write \`fn show(n: i32)\` that prints an integer. In \`main\`, create \`let x = 42;\`, call \`show(x)\`, and then print \`x\` again. Explain in a trailing comment in your code why this works even though you "passed x in" — name the trait involved.`,
    hints: [
      'Integers implement the Copy trait.',
      'Copy types are duplicated on assignment or function call, not moved.',
    ],
    solution: `fn show(n: i32) {
    println!("n = {}", n);
}

fn main() {
    let x = 42;
    show(x);
    println!("x is still {}", x); // works because i32 is Copy, so x was copied, not moved
}`,
    starter: `fn show(n: i32) {
    println!("n = {}", n);
}

fn main() {
    let x = 42;
    // TODO: call show(x), then print x again; add a comment naming the trait
}`,
    tags: ['copy', 'ownership', 'move'],
  },
  {
    id: 'rs-ch04-c-040',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Return Ownership Out',
    prompt: `Write \`fn build_message() -> String\` that creates and returns a new \`String\` containing \`"generated"\`. In \`main\`, bind the result to a variable and print it. The point is to move ownership OUT of the function to the caller.`,
    hints: ['Return the String by value to transfer ownership to the caller.'],
    solution: `fn build_message() -> String {
    String::from("generated")
}

fn main() {
    let msg = build_message();
    println!("{}", msg);
}`,
    starter: `fn build_message() -> String {
    todo!()
}

fn main() {
    // TODO: capture the returned String and print it
}`,
    tags: ['ownership', 'return', 'move'],
  },
  {
    id: 'rs-ch04-c-041',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Take And Give Back',
    prompt: `Write \`fn process(s: String) -> String\` that takes ownership of a \`String\`, appends \`"!"\` to it, and returns it back to the caller. In \`main\`, create a \`String\`, pass it into \`process\`, rebind the returned value to a new variable, and print the result \`"loud!"\` given input \`"loud"\`.`,
    hints: [
      'The parameter is taken by value (moved in).',
      'Use push_str to append, then return the String so ownership goes back out.',
    ],
    solution: `fn process(mut s: String) -> String {
    s.push_str("!");
    s
}

fn main() {
    let s = String::from("loud");
    let result = process(s);
    println!("{}", result);
}`,
    starter: `fn process(mut s: String) -> String {
    // TODO: append "!" and return s
    todo!()
}

fn main() {
    let s = String::from("loud");
    // TODO: pass s in, capture the returned String, print it
}`,
    tags: ['ownership', 'move', 'return'],
  },
  {
    id: 'rs-ch04-c-042',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Append Through A Mutable Reference',
    prompt: `Write \`fn add_suffix(s: &mut String)\` that appends \`" - done"\` to the string it borrows mutably. In \`main\`, create a mutable \`String\` set to \`"task"\`, call \`add_suffix\` on a mutable reference to it, then print it to show it now reads \`"task - done"\`.`,
    hints: [
      'The owner must be declared with mut.',
      'Pass &mut to the function and use push_str inside it.',
    ],
    solution: `fn add_suffix(s: &mut String) {
    s.push_str(" - done");
}

fn main() {
    let mut s = String::from("task");
    add_suffix(&mut s);
    println!("{}", s);
}`,
    starter: `fn add_suffix(s: &mut String) {
    // TODO: append " - done"
}

fn main() {
    let mut s = String::from("task");
    // TODO: call add_suffix with a mutable reference, then print s
}`,
    tags: ['mutable-reference', 'borrowing', 'ownership'],
  },
  {
    id: 'rs-ch04-c-043',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Double In Place',
    prompt: `Write \`fn double(n: &mut i32)\` that multiplies the borrowed integer by 2 in place. In \`main\`, create \`let mut value = 21;\`, call \`double\`, and print \`value\` (should be 42). The change must be visible in \`main\` after the call.`,
    hints: [
      'Dereference the mutable reference with * to read and write the underlying value.',
    ],
    solution: `fn double(n: &mut i32) {
    *n *= 2;
}

fn main() {
    let mut value = 21;
    double(&mut value);
    println!("{}", value);
}`,
    starter: `fn double(n: &mut i32) {
    // TODO: double the value in place using *
}

fn main() {
    let mut value = 21;
    // TODO: call double, then print value
}`,
    tags: ['mutable-reference', 'dereference', 'borrowing'],
  },
  {
    id: 'rs-ch04-c-044',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two Immutable Readers',
    prompt: `Demonstrate that multiple immutable references can coexist. In \`main\`, create a \`String\` \`"shared"\`, make two immutable references \`r1\` and \`r2\` to it, and print both. Then write \`fn combine(a: &String, b: &String) -> usize\` that returns the sum of the two strings' lengths, and call it with both references.`,
    hints: [
      'Any number of immutable references are allowed at the same time.',
      'Each parameter is &String; return a.len() + b.len().',
    ],
    solution: `fn combine(a: &String, b: &String) -> usize {
    a.len() + b.len()
}

fn main() {
    let s = String::from("shared");
    let r1 = &s;
    let r2 = &s;
    println!("{} and {}", r1, r2);
    let total = combine(r1, r2);
    println!("total length: {}", total);
}`,
    starter: `fn combine(a: &String, b: &String) -> usize {
    todo!()
}

fn main() {
    let s = String::from("shared");
    // TODO: make two immutable references, print both, then call combine
}`,
    tags: ['references', 'borrowing', 'immutable'],
  },
  {
    id: 'rs-ch04-c-045',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'First Word As A Slice',
    prompt: `Write \`fn first_word(s: &String) -> &str\` that returns a string slice covering the first word (up to the first space, or the whole string if there is no space). In \`main\`, call it on \`"hello world"\` and print the result \`"hello"\`.`,
    hints: [
      'Iterate over s.as_bytes() with enumerate to find a space byte.',
      'Return &s[0..i] at the first space, otherwise &s[..].',
    ],
    solution: `fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

fn main() {
    let s = String::from("hello world");
    let word = first_word(&s);
    println!("{}", word);
}`,
    starter: `fn first_word(s: &String) -> &str {
    // TODO: return a slice covering the first word
    todo!()
}

fn main() {
    let s = String::from("hello world");
    // TODO: call first_word and print the result
}`,
    tags: ['slices', 'string-slice', 'references'],
  },
  {
    id: 'rs-ch04-c-046',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Slice Out The Middle',
    prompt: `In \`main\`, create \`let s = String::from("rustacean");\`. Using a single string-slice range expression, bind \`let part = ...;\` to the slice \`"tac"\` (the substring starting at index 4 with length 3) and print it.`,
    hints: [
      'A slice is written &s[start..end] where end is exclusive.',
      'Index 4 through 7 gives "tac".',
    ],
    solution: `fn main() {
    let s = String::from("rustacean");
    let part = &s[4..7];
    println!("{}", part);
}`,
    starter: `fn main() {
    let s = String::from("rustacean");
    // TODO: bind part to the slice "tac" and print it
}`,
    tags: ['slices', 'string-slice'],
  },
  {
    id: 'rs-ch04-c-047',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Take A String Slice Parameter',
    prompt: `Write \`fn shout(text: &str) -> String\` that returns the uppercase version of the input using \`to_uppercase\`. Because it takes \`&str\`, it must work both for a \`String\` (passed as a slice) and for a string literal. In \`main\`, call it once with \`&owned[..]\` where \`owned\` is a \`String\`, and once directly with the literal \`"hi"\`, printing both results.`,
    hints: [
      'Prefer &str over &String for function parameters: it accepts more callers.',
      'String literals are already &str; a String can be sliced into &str.',
    ],
    solution: `fn shout(text: &str) -> String {
    text.to_uppercase()
}

fn main() {
    let owned = String::from("hello");
    println!("{}", shout(&owned[..]));
    println!("{}", shout("hi"));
}`,
    starter: `fn shout(text: &str) -> String {
    todo!()
}

fn main() {
    let owned = String::from("hello");
    // TODO: call shout with a slice of owned, and again with a literal
}`,
    tags: ['string-slice', 'slices', 'references'],
  },
  {
    id: 'rs-ch04-c-048',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum An Array Slice',
    prompt: `Write \`fn sum_slice(nums: &[i32]) -> i32\` that returns the sum of all elements in an i32 slice. In \`main\`, create an array \`let arr = [10, 20, 30, 40, 50];\`, then call \`sum_slice\` with the slice \`&arr[1..4]\` and print the result (should be 90).`,
    hints: [
      'An array slice has type &[i32].',
      'Loop over the slice and accumulate, or use an index range to build the slice.',
    ],
    solution: `fn sum_slice(nums: &[i32]) -> i32 {
    let mut total = 0;
    for &n in nums {
        total += n;
    }
    total
}

fn main() {
    let arr = [10, 20, 30, 40, 50];
    let result = sum_slice(&arr[1..4]);
    println!("{}", result);
}`,
    starter: `fn sum_slice(nums: &[i32]) -> i32 {
    // TODO: sum all elements of the slice
    todo!()
}

fn main() {
    let arr = [10, 20, 30, 40, 50];
    // TODO: call sum_slice with &arr[1..4] and print the result
}`,
    tags: ['slices', 'array-slice', 'references'],
  },
  {
    id: 'rs-ch04-c-049',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Use After Move Is Rejected',
    prompt: `The following code does NOT compile because of a use-after-move:
\`\`\`
let s1 = String::from("hi");
let s2 = s1;
println!("{}", s1);
\`\`\`
Rewrite it so it compiles and prints \`"hi"\` TWICE (once via the first binding and once via the second), WITHOUT changing \`s2\`'s declaration line to borrow. Use cloning to fix it.`,
    hints: [
      'Moving s1 into s2 invalidates s1.',
      'Clone s1 when assigning to s2 so both own separate data.',
    ],
    solution: `fn main() {
    let s1 = String::from("hi");
    let s2 = s1.clone();
    println!("{}", s1);
    println!("{}", s2);
}`,
    starter: `fn main() {
    let s1 = String::from("hi");
    let s2 = s1; // TODO: fix so both s1 and s2 stay usable
    println!("{}", s1);
    println!("{}", s2);
}`,
    tags: ['move', 'clone', 'ownership'],
  },
  {
    id: 'rs-ch04-c-050',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Move Into A Vec Element Closure-Free',
    prompt: `Write \`fn longest_of(a: &str, b: &str) -> usize\` that returns the byte length of whichever of the two slices is longer (return the larger of the two lengths). In \`main\`, call it with \`"cat"\` and \`"elephant"\` and print the result (should be 8).`,
    hints: [
      'Compare a.len() and b.len().',
      'Return the larger length with an if expression.',
    ],
    solution: `fn longest_of(a: &str, b: &str) -> usize {
    let la = a.len();
    let lb = b.len();
    if la >= lb { la } else { lb }
}

fn main() {
    let result = longest_of("cat", "elephant");
    println!("{}", result);
}`,
    starter: `fn longest_of(a: &str, b: &str) -> usize {
    // TODO: return the larger of the two byte lengths
    todo!()
}

fn main() {
    // TODO: call longest_of("cat", "elephant") and print the result
}`,
    tags: ['string-slice', 'references', 'slices'],
  },
  {
    id: 'rs-ch04-c-051',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Push Then Read Back',
    prompt: `Write \`fn append_and_len(s: &mut String, extra: &str) -> usize\` that appends \`extra\` to \`s\` through the mutable reference and returns the new length. In \`main\`, start with \`"ab"\`, append \`"cd"\`, capture the returned length, and print both the final string and the length (\`"abcd"\` and 4).`,
    hints: [
      'The first parameter is &mut String, the second is &str.',
      'push_str the extra, then return s.len().',
    ],
    solution: `fn append_and_len(s: &mut String, extra: &str) -> usize {
    s.push_str(extra);
    s.len()
}

fn main() {
    let mut s = String::from("ab");
    let len = append_and_len(&mut s, "cd");
    println!("{} {}", s, len);
}`,
    starter: `fn append_and_len(s: &mut String, extra: &str) -> usize {
    // TODO: append extra and return the new length
    todo!()
}

fn main() {
    let mut s = String::from("ab");
    // TODO: call append_and_len, capture length, print string and length
}`,
    tags: ['mutable-reference', 'borrowing', 'string-slice'],
  },
  {
    id: 'rs-ch04-c-052',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reference To A Vector',
    prompt: `Write \`fn count_evens(v: &Vec<i32>) -> usize\` that returns how many elements of the borrowed vector are even, without taking ownership. In \`main\`, build \`let v = vec![1, 2, 3, 4, 6];\`, call the function, then print \`v\` and the count to prove the vector was only borrowed.`,
    hints: [
      'Borrow the vector with &Vec<i32>.',
      'Iterate over the borrowed vector and test n % 2 == 0.',
    ],
    solution: `fn count_evens(v: &Vec<i32>) -> usize {
    let mut count = 0;
    for &n in v {
        if n % 2 == 0 {
            count += 1;
        }
    }
    count
}

fn main() {
    let v = vec![1, 2, 3, 4, 6];
    let evens = count_evens(&v);
    println!("{:?} has {} evens", v, evens);
}`,
    starter: `fn count_evens(v: &Vec<i32>) -> usize {
    // TODO: count even elements without moving v
    todo!()
}

fn main() {
    let v = vec![1, 2, 3, 4, 6];
    // TODO: call count_evens(&v), then print v and the count
}`,
    tags: ['references', 'borrowing', 'ownership'],
  },
  {
    id: 'rs-ch04-c-053',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fix The Dangling Reference',
    prompt: `The function below tries to return a reference to a local String, which would dangle:
\`\`\`
fn dangle() -> &String {
    let s = String::from("oops");
    &s
}
\`\`\`
Rewrite \`dangle\` (rename it \`no_dangle\`) so it returns an owned \`String\` instead of a reference, transferring ownership to the caller. In \`main\`, call it and print the result.`,
    hints: [
      'You cannot return a reference to data owned by the function.',
      'Return the String by value so ownership moves out.',
    ],
    solution: `fn no_dangle() -> String {
    let s = String::from("oops");
    s
}

fn main() {
    let s = no_dangle();
    println!("{}", s);
}`,
    starter: `fn no_dangle() -> String {
    let s = String::from("oops");
    // TODO: return s by value, not a reference
    todo!()
}

fn main() {
    let s = no_dangle();
    println!("{}", s);
}`,
    tags: ['dangling', 'ownership', 'return'],
  },
  {
    id: 'rs-ch04-c-054',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reuse A Mutable Borrow Sequentially',
    prompt: `Rust forbids two mutable references at the SAME time, but allows them in separate scopes. In \`main\`, create a mutable \`String\` \`"x"\`. In an inner block, take a mutable reference \`r1\`, push \`"y"\` through it, and let that scope end. After the block, take a new mutable reference \`r2\`, push \`"z"\` through it. Finally print the string (should be \`"xyz"\`).`,
    hints: [
      'A mutable borrow lasts until its last use; ending a scope releases it.',
      'Wrap the first &mut in { ... } so the second &mut is valid afterward.',
    ],
    solution: `fn main() {
    let mut s = String::from("x");
    {
        let r1 = &mut s;
        r1.push_str("y");
    }
    let r2 = &mut s;
    r2.push_str("z");
    println!("{}", s);
}`,
    starter: `fn main() {
    let mut s = String::from("x");
    // TODO: in an inner block, push "y" via r1
    // TODO: after the block, push "z" via a new r2
    // TODO: print s (should be "xyz")
}`,
    tags: ['mutable-reference', 'borrowing', 'scope'],
  },
  {
    id: 'rs-ch04-c-055',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Last Word Slice',
    prompt: `Write \`fn last_word(s: &str) -> &str\` that returns a slice covering the LAST word of the input (the part after the final space, or the whole string if there is no space). In \`main\`, call it on \`"the quick brown fox"\` and print \`"fox"\`.`,
    hints: [
      'Scan bytes from the front tracking the index just after the last space.',
      'Return &s[start..] where start is one past the last space (or 0).',
    ],
    solution: `fn last_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    let mut start = 0;
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            start = i + 1;
        }
    }
    &s[start..]
}

fn main() {
    let s = String::from("the quick brown fox");
    println!("{}", last_word(&s));
}`,
    starter: `fn last_word(s: &str) -> &str {
    // TODO: return a slice of the last word
    todo!()
}

fn main() {
    let s = String::from("the quick brown fox");
    // TODO: print last_word(&s)
}`,
    tags: ['string-slice', 'slices', 'references'],
  },
  {
    id: 'rs-ch04-c-056',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Whole String As A Slice',
    prompt: `Write \`fn as_slice(s: &String) -> &str\` that returns a string slice referring to the ENTIRE string (equivalent to \`&s[..]\`). In \`main\`, call it on \`"complete"\` and print the returned slice. The function must return a slice, not a new String.`,
    hints: ['The range &s[..] covers the whole string.', 'No allocation is needed; just return the slice.'],
    solution: `fn as_slice(s: &String) -> &str {
    &s[..]
}

fn main() {
    let s = String::from("complete");
    println!("{}", as_slice(&s));
}`,
    starter: `fn as_slice(s: &String) -> &str {
    // TODO: return a slice covering the whole string
    todo!()
}

fn main() {
    let s = String::from("complete");
    // TODO: print as_slice(&s)
}`,
    tags: ['string-slice', 'slices', 'references'],
  },
  {
    id: 'rs-ch04-c-057',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'First Element Of An Array Slice',
    prompt: `Write \`fn first_two(nums: &[i32]) -> &[i32]\` that returns a slice of the first two elements of the input slice. Assume the input always has at least two elements. In \`main\`, build \`let arr = [5, 6, 7, 8];\`, call \`first_two(&arr)\`, and print the resulting slice with \`{:?}\` (should print \`[5, 6]\`).`,
    hints: [
      'A sub-slice is &nums[0..2].',
      'Print slices with the debug formatter {:?}.',
    ],
    solution: `fn first_two(nums: &[i32]) -> &[i32] {
    &nums[0..2]
}

fn main() {
    let arr = [5, 6, 7, 8];
    let slice = first_two(&arr);
    println!("{:?}", slice);
}`,
    starter: `fn first_two(nums: &[i32]) -> &[i32] {
    // TODO: return a slice of the first two elements
    todo!()
}

fn main() {
    let arr = [5, 6, 7, 8];
    // TODO: print first_two(&arr) with {:?}
}`,
    tags: ['array-slice', 'slices', 'references'],
  },
  {
    id: 'rs-ch04-c-058',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Tuple Return Of Length And String',
    prompt: `Mirror the book's early example: write \`fn length_with_value(s: String) -> (String, usize)\` that takes ownership of a \`String\`, computes its length, and returns BOTH the string (so the caller can keep it) and its length in a tuple. In \`main\`, call it, destructure the tuple, and print \`"hello" has length 5\`.`,
    hints: [
      'Return (s, len) so the moved String comes back to the caller.',
      'Destructure with let (s2, len) = ...;',
    ],
    solution: `fn length_with_value(s: String) -> (String, usize) {
    let len = s.len();
    (s, len)
}

fn main() {
    let s = String::from("hello");
    let (s, len) = length_with_value(s);
    println!("{} has length {}", s, len);
}`,
    starter: `fn length_with_value(s: String) -> (String, usize) {
    // TODO: return the String and its length as a tuple
    todo!()
}

fn main() {
    let s = String::from("hello");
    // TODO: call, destructure the tuple, print "hello" has length 5
}`,
    tags: ['ownership', 'return', 'move'],
  },
  {
    id: 'rs-ch04-c-059',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Clone Only When Needed',
    prompt: `Write \`fn describe(label: &str, value: &String) -> String\` that returns \`"label: value"\` (e.g. \`"name: Bob"\`) by borrowing both arguments. In \`main\`, create a \`String\` \`name\`, call \`describe("name", &name)\`, store and print the result, and then print \`name\` again to confirm nothing was cloned or moved.`,
    hints: [
      'Both parameters are borrowed, so no clone is necessary.',
      'Build the result with format!.',
    ],
    solution: `fn describe(label: &str, value: &String) -> String {
    format!("{}: {}", label, value)
}

fn main() {
    let name = String::from("Bob");
    let result = describe("name", &name);
    println!("{}", result);
    println!("still own: {}", name);
}`,
    starter: `fn describe(label: &str, value: &String) -> String {
    // TODO: return "label: value"
    todo!()
}

fn main() {
    let name = String::from("Bob");
    // TODO: call describe, print result, then print name again
}`,
    tags: ['references', 'borrowing', 'string-slice'],
  },
  {
    id: 'rs-ch04-c-060',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Mutate A Slice Element By Index',
    prompt: `Write \`fn zero_first(nums: &mut [i32])\` that sets the first element of a mutable i32 slice to 0. In \`main\`, build \`let mut arr = [9, 8, 7];\`, pass \`&mut arr[..]\` to the function, then print the array with \`{:?}\` (should be \`[0, 8, 7]\`).`,
    hints: [
      'A mutable slice has type &mut [i32].',
      'Index assignment nums[0] = 0 works on a mutable slice.',
    ],
    solution: `fn zero_first(nums: &mut [i32]) {
    nums[0] = 0;
}

fn main() {
    let mut arr = [9, 8, 7];
    zero_first(&mut arr[..]);
    println!("{:?}", arr);
}`,
    starter: `fn zero_first(nums: &mut [i32]) {
    // TODO: set the first element to 0
}

fn main() {
    let mut arr = [9, 8, 7];
    // TODO: pass a mutable slice, then print arr with {:?}
}`,
    tags: ['array-slice', 'mutable-reference', 'slices'],
  },
  {
    id: 'rs-ch04-c-061',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Borrow Checker Blocks Mixed Borrows',
    prompt: `This code is rejected because it uses an immutable borrow AFTER a mutable borrow overlaps with it:
\`\`\`
let mut s = String::from("hi");
let r1 = &s;
let r2 = &mut s;
println!("{} {}", r1, r2);
\`\`\`
Rewrite \`main\` so it compiles, still uses an immutable read of \`s\` and a mutable change to \`s\`, but orders the borrows so they never overlap. End by printing the final string after appending \`"!"\`. Print the immutable read first, then mutate, then print the final value.`,
    hints: [
      'A reference is "in use" until its last use; finish all uses of r1 before creating &mut s.',
      'Print via r1 first, then create &mut s and push, then print s.',
    ],
    solution: `fn main() {
    let mut s = String::from("hi");
    let r1 = &s;
    println!("read: {}", r1);
    let r2 = &mut s;
    r2.push_str("!");
    println!("final: {}", s);
}`,
    starter: `fn main() {
    let mut s = String::from("hi");
    // TODO: use an immutable borrow first (print it),
    // then a non-overlapping mutable borrow that appends "!",
    // then print the final string
}`,
    tags: ['borrowing', 'mutable-reference', 'borrow-checker'],
  },
  {
    id: 'rs-ch04-c-062',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'First Word On An Owned String',
    prompt: `Write \`fn first_word(s: &str) -> &str\` (taking \`&str\`, the more general form). Then in \`main\`, demonstrate WHY the slice ties to the data: create \`let s = String::from("hello world");\`, get \`let word = first_word(&s);\`, print \`word\`, and explain in a comment why you must NOT call \`s.clear()\` while \`word\` is still in use. Your program should compile and print \`"hello"\`; do not actually call clear.`,
    hints: [
      'Accept &str so both String slices and literals work.',
      'The returned slice borrows s, so s cannot be mutated while word is alive.',
    ],
    solution: `fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

fn main() {
    let s = String::from("hello world");
    let word = first_word(&s);
    // s.clear() here would be rejected: word still borrows s immutably,
    // and clear() needs a mutable borrow of s.
    println!("{}", word);
}`,
    starter: `fn first_word(s: &str) -> &str {
    // TODO: return the first word as a slice
    todo!()
}

fn main() {
    let s = String::from("hello world");
    let word = first_word(&s);
    // TODO: print word, add a comment explaining why s.clear() is forbidden here
}`,
    tags: ['string-slice', 'borrowing', 'slices'],
  },
  {
    id: 'rs-ch04-c-063',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Words By Slicing',
    prompt: `Write \`fn count_words(s: &str) -> usize\` that returns the number of whitespace-separated words. Implement it by scanning bytes yourself (do not use split): count a word each time you transition from a space to a non-space, also handling the first character. In \`main\`, test it on \`"  one  two three "\` and print the count (should be 3).`,
    hints: [
      'Track whether the previous byte was a space.',
      'Increment the count when the previous byte was a space (or you are at the start) and the current byte is not a space.',
    ],
    solution: `fn count_words(s: &str) -> usize {
    let bytes = s.as_bytes();
    let mut count = 0;
    let mut prev_space = true;
    for &b in bytes {
        let is_space = b == b' ';
        if prev_space && !is_space {
            count += 1;
        }
        prev_space = is_space;
    }
    count
}

fn main() {
    let s = String::from("  one  two three ");
    println!("{}", count_words(&s));
}`,
    starter: `fn count_words(s: &str) -> usize {
    // TODO: count whitespace-separated words by scanning bytes
    todo!()
}

fn main() {
    let s = String::from("  one  two three ");
    // TODO: print count_words(&s)
}`,
    tags: ['string-slice', 'slices', 'references'],
  },
  {
    id: 'rs-ch04-c-064',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Largest In An Array Slice',
    prompt: `Write \`fn largest(nums: &[i32]) -> i32\` that returns the maximum value in a non-empty i32 slice, using only a loop (no max method). In \`main\`, create \`let arr = [3, 7, 2, 9, 4];\`, then call \`largest\` on the full slice \`&arr\` AND on the sub-slice \`&arr[0..3]\`, printing both results (9 and 7).`,
    hints: [
      'Initialize the max to the first element, then loop over the rest.',
      'You can call largest with &arr and with &arr[0..3] thanks to slices.',
    ],
    solution: `fn largest(nums: &[i32]) -> i32 {
    let mut max = nums[0];
    for &n in nums {
        if n > max {
            max = n;
        }
    }
    max
}

fn main() {
    let arr = [3, 7, 2, 9, 4];
    println!("{}", largest(&arr));
    println!("{}", largest(&arr[0..3]));
}`,
    starter: `fn largest(nums: &[i32]) -> i32 {
    // TODO: return the maximum using a loop
    todo!()
}

fn main() {
    let arr = [3, 7, 2, 9, 4];
    // TODO: call largest on &arr and on &arr[0..3], print both
}`,
    tags: ['array-slice', 'slices', 'references'],
  },
  {
    id: 'rs-ch04-c-065',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Swap Two Strings By Mutable Reference',
    prompt: `Write \`fn swap_strings(a: &mut String, b: &mut String)\` that exchanges the contents of two strings through mutable references (do not use std::mem::swap; do it by hand using clone). In \`main\`, create two mutable strings \`"left"\` and \`"right"\`, call \`swap_strings\`, then print them to show they were swapped.`,
    hints: [
      'You may briefly clone one value into a temporary.',
      'Assign through the dereferenced mutable references: *a = ...;',
    ],
    solution: `fn swap_strings(a: &mut String, b: &mut String) {
    let temp = a.clone();
    *a = b.clone();
    *b = temp;
}

fn main() {
    let mut x = String::from("left");
    let mut y = String::from("right");
    swap_strings(&mut x, &mut y);
    println!("{} {}", x, y);
}`,
    starter: `fn swap_strings(a: &mut String, b: &mut String) {
    // TODO: swap the contents of the two strings by hand
}

fn main() {
    let mut x = String::from("left");
    let mut y = String::from("right");
    // TODO: call swap_strings, then print x and y
}`,
    tags: ['mutable-reference', 'clone', 'borrowing'],
  },
  {
    id: 'rs-ch04-c-066',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Reverse An Array Slice In Place',
    prompt: `Write \`fn reverse_in_place(nums: &mut [i32])\` that reverses the elements of a mutable i32 slice in place using a two-pointer swap loop (do not use the reverse method; use a temporary variable to swap). In \`main\`, build \`let mut arr = [1, 2, 3, 4, 5];\`, reverse it, and print it with \`{:?}\` (should be \`[5, 4, 3, 2, 1]\`).`,
    hints: [
      'Use indices i from the front and j from the back, moving toward the middle.',
      'Swap nums[i] and nums[j] using a temporary i32 (Copy makes this easy).',
    ],
    solution: `fn reverse_in_place(nums: &mut [i32]) {
    let mut i = 0;
    let mut j = nums.len();
    while i + 1 < j {
        j -= 1;
        let temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
        i += 1;
    }
}

fn main() {
    let mut arr = [1, 2, 3, 4, 5];
    reverse_in_place(&mut arr);
    println!("{:?}", arr);
}`,
    starter: `fn reverse_in_place(nums: &mut [i32]) {
    // TODO: reverse the slice in place with a two-pointer swap
}

fn main() {
    let mut arr = [1, 2, 3, 4, 5];
    // TODO: reverse and print with {:?}
}`,
    tags: ['array-slice', 'mutable-reference', 'slices'],
  },
  {
    id: 'rs-ch04-c-067',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Second Word Slice',
    prompt: `Write \`fn second_word(s: &str) -> &str\` that returns the SECOND whitespace-separated word as a slice, or an empty slice \`""\` if there is no second word. Implement it by scanning bytes and tracking word boundaries. In \`main\`, test on \`"alpha beta gamma"\` (prints \`"beta"\`) and on \`"solo"\` (prints an empty line).`,
    hints: [
      'Find the start and end byte indices of the second word as you scan.',
      'Return &s[start..end]; if the second word never starts, return &s[0..0].',
    ],
    solution: `fn second_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    let mut word_index = 0;
    let mut prev_space = true;
    let mut start = 0;
    for (i, &b) in bytes.iter().enumerate() {
        let is_space = b == b' ';
        if prev_space && !is_space {
            word_index += 1;
            if word_index == 2 {
                start = i;
            }
        }
        if !prev_space && is_space && word_index == 2 {
            return &s[start..i];
        }
        prev_space = is_space;
    }
    if word_index >= 2 {
        &s[start..]
    } else {
        &s[0..0]
    }
}

fn main() {
    println!("{}", second_word("alpha beta gamma"));
    println!("{}", second_word("solo"));
}`,
    starter: `fn second_word(s: &str) -> &str {
    // TODO: return the second word as a slice, or "" if absent
    todo!()
}

fn main() {
    // TODO: test on "alpha beta gamma" and "solo"
}`,
    tags: ['string-slice', 'slices', 'references'],
  },
  {
    id: 'rs-ch04-c-068',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Trim Leading Spaces Slice',
    prompt: `Write \`fn trim_start_spaces(s: &str) -> &str\` that returns a slice of the input with leading spaces removed (do not use the trim method). For example \`"   hello"\` becomes \`"hello"\`, and \`"   "\` becomes an empty slice. In \`main\`, test both cases and print each result, surrounding each with brackets like \`[hello]\`.`,
    hints: [
      'Scan from the front to find the index of the first non-space byte.',
      'Return &s[start..]; if everything is spaces, start equals s.len().',
    ],
    solution: `fn trim_start_spaces(s: &str) -> &str {
    let bytes = s.as_bytes();
    let mut start = 0;
    while start < bytes.len() && bytes[start] == b' ' {
        start += 1;
    }
    &s[start..]
}

fn main() {
    println!("[{}]", trim_start_spaces("   hello"));
    println!("[{}]", trim_start_spaces("   "));
}`,
    starter: `fn trim_start_spaces(s: &str) -> &str {
    // TODO: return a slice with leading spaces removed
    todo!()
}

fn main() {
    // TODO: test "   hello" and "   ", printing each in brackets
}`,
    tags: ['string-slice', 'slices', 'references'],
  },
  {
    id: 'rs-ch04-c-069',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Build From A Borrowed Slice',
    prompt: `Write \`fn repeat_first_char(s: &str, times: usize) -> String\` that reads the first character of the borrowed slice and returns a NEW \`String\` containing that character repeated \`times\` times. Assume \`s\` is non-empty ASCII. In \`main\`, create a \`String\` \`"xylophone"\`, call \`repeat_first_char(&word, 4)\`, print the result (\`"xxxx"\`), and then print \`word\` again to show it was only borrowed.`,
    hints: [
      'Get the first byte via s.as_bytes()[0], or build from the first char.',
      'Push the character into a fresh String in a loop, then return it.',
    ],
    solution: `fn repeat_first_char(s: &str, times: usize) -> String {
    let first = s.as_bytes()[0] as char;
    let mut result = String::new();
    for _ in 0..times {
        result.push(first);
    }
    result
}

fn main() {
    let word = String::from("xylophone");
    let out = repeat_first_char(&word, 4);
    println!("{}", out);
    println!("{}", word);
}`,
    starter: `fn repeat_first_char(s: &str, times: usize) -> String {
    // TODO: repeat the first char of s 'times' times into a new String
    todo!()
}

fn main() {
    let word = String::from("xylophone");
    // TODO: call repeat_first_char(&word, 4), print it, then print word
}`,
    tags: ['string-slice', 'ownership', 'references'],
  },
  {
    id: 'rs-ch04-c-070',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sum Of Slice Maxima',
    prompt: `Write two functions. \`fn max_of(nums: &[i32]) -> i32\` returns the largest value in a non-empty slice. \`fn sum_of_block_maxima(nums: &[i32], block: usize) -> i32\` splits the slice into consecutive blocks of length \`block\` (the final block may be shorter), calls \`max_of\` on each block's sub-slice, and returns the sum of those maxima. In \`main\`, run it on \`[1, 9, 3, 8, 2, 7]\` with block 2 and print the result (9 + 8 + 7 = 24).`,
    hints: [
      'Walk an index in steps of block; the block end is the min of index+block and the length.',
      'Slice with &nums[start..end] and pass it to max_of, accumulating the maxima.',
    ],
    solution: `fn max_of(nums: &[i32]) -> i32 {
    let mut max = nums[0];
    for &n in nums {
        if n > max {
            max = n;
        }
    }
    max
}

fn sum_of_block_maxima(nums: &[i32], block: usize) -> i32 {
    let mut total = 0;
    let mut start = 0;
    while start < nums.len() {
        let mut end = start + block;
        if end > nums.len() {
            end = nums.len();
        }
        total += max_of(&nums[start..end]);
        start = end;
    }
    total
}

fn main() {
    let data = [1, 9, 3, 8, 2, 7];
    println!("{}", sum_of_block_maxima(&data, 2));
}`,
    starter: `fn max_of(nums: &[i32]) -> i32 {
    // TODO: return the largest value
    todo!()
}

fn sum_of_block_maxima(nums: &[i32], block: usize) -> i32 {
    // TODO: sum the maxima of each consecutive block
    todo!()
}

fn main() {
    let data = [1, 9, 3, 8, 2, 7];
    // TODO: print sum_of_block_maxima(&data, 2)
}`,
    tags: ['array-slice', 'slices', 'references'],
  },
]

export default problems
