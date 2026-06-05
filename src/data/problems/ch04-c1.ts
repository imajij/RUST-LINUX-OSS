import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch04-c-001',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create and Print an Owned String',
    prompt: `Create a mutable String using String::from with the value "hello", push the string " world" onto it with push_str, and print the result.

Expected output:
hello world`,
    hints: [
      'String::from creates an owned, growable String.',
      'Use push_str to append a string slice.',
    ],
    solution: `fn main() {
    let mut s = String::from("hello");
    s.push_str(" world");
    println!("{}", s);
}`,
    starter: `fn main() {
    // TODO: build the String and print "hello world"
}`,
    tags: ['ownership', 'string'],
  },
  {
    id: 'rs-ch04-c-002',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Copy Types: Integers Stay Valid',
    prompt: `Bind an integer x to 5, then bind y to x. Print both x and y on separate lines. Integers are Copy, so x is still valid after the assignment.

Expected output:
x = 5
y = 5`,
    hints: [
      'Integers implement the Copy trait.',
      'Both variables remain usable after the copy.',
    ],
    solution: `fn main() {
    let x = 5;
    let y = x;
    println!("x = {}", x);
    println!("y = {}", y);
}`,
    starter: `fn main() {
    let x = 5;
    // TODO: bind y to x, then print both
}`,
    tags: ['copy', 'ownership'],
  },
  {
    id: 'rs-ch04-c-003',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Clone a String',
    prompt: `Create a String s1 with the value "data". Make a deep copy named s2 by calling clone on s1. Print both strings, each on its own line. Both must remain valid.

Expected output:
data
data`,
    hints: [
      'clone makes a full copy of the heap data.',
      'After cloning, both s1 and s2 own separate data.',
    ],
    solution: `fn main() {
    let s1 = String::from("data");
    let s2 = s1.clone();
    println!("{}", s1);
    println!("{}", s2);
}`,
    starter: `fn main() {
    let s1 = String::from("data");
    // TODO: clone s1 into s2, then print both
}`,
    tags: ['clone', 'string'],
  },
  {
    id: 'rs-ch04-c-004',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'String Length Without Taking Ownership',
    prompt: `Write a function calculate_length that takes an immutable reference to a String (a &String) and returns its length as usize using the len method. In main, create a String "hello", call the function, and print the length. The String must still be usable after the call.

Expected output:
The length of 'hello' is 5.`,
    hints: [
      'A reference parameter uses the & symbol: fn f(s: &String).',
      'Calling len on a reference works directly: s.len().',
    ],
    solution: `fn calculate_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);
    println!("The length of '{}' is {}.", s, len);
}`,
    starter: `fn calculate_length(s: &String) -> usize {
    // TODO: return the length
}

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);
    println!("The length of '{}' is {}.", s, len);
}`,
    tags: ['references', 'borrowing'],
  },
  {
    id: 'rs-ch04-c-005',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A String Literal Is a Slice',
    prompt: `A string literal has the type &str. Declare a variable greeting with an explicit type annotation of &str and the value "Hi there", then print it.

Expected output:
Hi there`,
    hints: [
      'String literals are slices stored in the binary.',
      'The type annotation looks like: let x: &str = "...";',
    ],
    solution: `fn main() {
    let greeting: &str = "Hi there";
    println!("{}", greeting);
}`,
    starter: `fn main() {
    // TODO: declare greeting as &str and print it
}`,
    tags: ['slice', 'str'],
  },
  {
    id: 'rs-ch04-c-006',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Modify Through a Mutable Reference',
    prompt: `Write a function append_world that takes a mutable reference to a String and pushes " world" onto it using push_str. In main, create a mutable String "hello", pass a mutable reference to the function, then print the modified String.

Expected output:
hello world`,
    hints: [
      'A mutable reference parameter is written &mut String.',
      'The variable must be declared mut and passed with &mut.',
    ],
    solution: `fn append_world(s: &mut String) {
    s.push_str(" world");
}

fn main() {
    let mut s = String::from("hello");
    append_world(&mut s);
    println!("{}", s);
}`,
    starter: `fn append_world(s: &mut String) {
    // TODO: append " world"
}

fn main() {
    let mut s = String::from("hello");
    append_world(&mut s);
    println!("{}", s);
}`,
    tags: ['mutable-reference', 'borrowing'],
  },
  {
    id: 'rs-ch04-c-007',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return Ownership From a Function',
    prompt: `Write a function give_string that takes no parameters and returns an owned String with the value "owned". In main, bind the returned String to a variable and print it.

Expected output:
owned`,
    hints: [
      'The return type is String (owned, not a reference).',
      'Returning a value moves ownership to the caller.',
    ],
    solution: `fn give_string() -> String {
    String::from("owned")
}

fn main() {
    let s = give_string();
    println!("{}", s);
}`,
    starter: `fn give_string() -> String {
    // TODO: build and return a String
}

fn main() {
    let s = give_string();
    println!("{}", s);
}`,
    tags: ['ownership', 'return'],
  },
  {
    id: 'rs-ch04-c-008',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'First Three Bytes Slice',
    prompt: `Create a String "hello" and make a string slice that holds the first three characters using the range syntax. Print the slice.

Expected output:
hel`,
    hints: [
      'A slice uses square brackets with a range: &s[0..3].',
      'The starting 0 may be omitted: &s[..3].',
    ],
    solution: `fn main() {
    let s = String::from("hello");
    let part = &s[0..3];
    println!("{}", part);
}`,
    starter: `fn main() {
    let s = String::from("hello");
    // TODO: slice the first three characters and print
}`,
    tags: ['slice', 'string'],
  },
  {
    id: 'rs-ch04-c-009',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Whole-String Slice',
    prompt: `Create a String "rustacean". Make a slice covering the entire string using the range syntax with both ends omitted, then print it.

Expected output:
rustacean`,
    hints: [
      'Omitting both ends of the range gives the whole string: &s[..].',
    ],
    solution: `fn main() {
    let s = String::from("rustacean");
    let whole = &s[..];
    println!("{}", whole);
}`,
    starter: `fn main() {
    let s = String::from("rustacean");
    // TODO: slice the whole string and print
}`,
    tags: ['slice', 'string'],
  },
  {
    id: 'rs-ch04-c-010',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Slice the First Two Array Elements',
    prompt: `Create an array a with the values [10, 20, 30, 40, 50]. Make a slice of type &[i32] holding the first two elements, then print the slice with the debug formatter.

Expected output:
[10, 20]`,
    hints: [
      'Array slices use the same range syntax: &a[0..2].',
      'Print a slice with {:?} (debug formatting).',
    ],
    solution: `fn main() {
    let a = [10, 20, 30, 40, 50];
    let slice = &a[0..2];
    println!("{:?}", slice);
}`,
    starter: `fn main() {
    let a = [10, 20, 30, 40, 50];
    // TODO: slice the first two elements and print with {:?}
}`,
    tags: ['slice', 'array'],
  },
  {
    id: 'rs-ch04-c-011',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Pass an Owned String Into a Function',
    prompt: `Write a function takes_ownership that accepts an owned String parameter and prints it. In main, create a String "consumed" and call the function, moving the String into it.

Expected output:
consumed`,
    hints: [
      'The parameter type is String (by value), which moves it in.',
      'After the call the original variable is no longer valid.',
    ],
    solution: `fn takes_ownership(s: String) {
    println!("{}", s);
}

fn main() {
    let s = String::from("consumed");
    takes_ownership(s);
}`,
    starter: `fn takes_ownership(s: String) {
    // TODO: print the String
}

fn main() {
    let s = String::from("consumed");
    takes_ownership(s);
}`,
    tags: ['ownership', 'move'],
  },
  {
    id: 'rs-ch04-c-012',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Count Characters Through a Reference',
    prompt: `Write a function count_chars that takes a &str and returns the number of characters as usize using the len method. In main, call it with the literal "playground" and print the result.

Expected output:
10`,
    hints: [
      'A &str parameter accepts string literals directly.',
      'len returns the number of bytes, which equals chars for ASCII.',
    ],
    solution: `fn count_chars(s: &str) -> usize {
    s.len()
}

fn main() {
    let n = count_chars("playground");
    println!("{}", n);
}`,
    starter: `fn count_chars(s: &str) -> usize {
    // TODO: return the length
}

fn main() {
    let n = count_chars("playground");
    println!("{}", n);
}`,
    tags: ['references', 'str'],
  },
  {
    id: 'rs-ch04-c-013',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Clone Then Mutate Independently',
    prompt: `Create a mutable String s1 with "base". Clone it into a mutable String s2. Push "-A" onto s1 and "-B" onto s2. Print both, each on its own line, to show the clones are independent.

Expected output:
base-A
base-B`,
    hints: [
      'Use clone so the two Strings own separate heap data.',
      'Both must be declared mut to push onto them.',
    ],
    solution: `fn main() {
    let mut s1 = String::from("base");
    let mut s2 = s1.clone();
    s1.push_str("-A");
    s2.push_str("-B");
    println!("{}", s1);
    println!("{}", s2);
}`,
    starter: `fn main() {
    let mut s1 = String::from("base");
    // TODO: clone, mutate each independently, print both
}`,
    tags: ['clone', 'string'],
  },
  {
    id: 'rs-ch04-c-014',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Take Ownership and Return It',
    prompt: `Write a function take_and_give_back that takes an owned String, and returns the same String unchanged. In main, create a String "round-trip", pass it into the function, bind the returned value to a new variable, and print it.

Expected output:
round-trip`,
    hints: [
      'Move the value in via the parameter, then return it to move it back out.',
      'The last expression of a function (without a semicolon) is its return value.',
    ],
    solution: `fn take_and_give_back(s: String) -> String {
    s
}

fn main() {
    let s = String::from("round-trip");
    let s = take_and_give_back(s);
    println!("{}", s);
}`,
    starter: `fn take_and_give_back(s: String) -> String {
    // TODO: return the String unchanged
}

fn main() {
    let s = String::from("round-trip");
    let s = take_and_give_back(s);
    println!("{}", s);
}`,
    tags: ['ownership', 'move', 'return'],
  },
  {
    id: 'rs-ch04-c-015',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Return Length and Keep the String',
    prompt: `Write a function calculate_length that takes an owned String and returns a tuple of (String, usize): the String that was passed in and its length. In main, create a String "hello", call the function, destructure the result, and print "The length of 'hello' is 5." using the returned String and length.

Expected output:
The length of 'hello' is 5.`,
    hints: [
      'Compute the length before returning, since you also return the String.',
      'Return a tuple: (s, length). Destructure with let (s, len) = ...;',
    ],
    solution: `fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)
}

fn main() {
    let s = String::from("hello");
    let (s, len) = calculate_length(s);
    println!("The length of '{}' is {}.", s, len);
}`,
    starter: `fn calculate_length(s: String) -> (String, usize) {
    // TODO: return (s, its length)
}

fn main() {
    let s = String::from("hello");
    let (s, len) = calculate_length(s);
    println!("The length of '{}' is {}.", s, len);
}`,
    tags: ['ownership', 'tuple', 'return'],
  },
  {
    id: 'rs-ch04-c-016',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Immutable References at Once',
    prompt: `Create a String "shared". Bind two immutable references r1 and r2 to it. Print both references on the same line, separated by a space. Multiple immutable references at the same time are allowed.

Expected output:
shared shared`,
    hints: [
      'Any number of immutable references can coexist.',
      'Take a reference with &s.',
    ],
    solution: `fn main() {
    let s = String::from("shared");
    let r1 = &s;
    let r2 = &s;
    println!("{} {}", r1, r2);
}`,
    starter: `fn main() {
    let s = String::from("shared");
    // TODO: take two immutable references and print both
}`,
    tags: ['references', 'borrowing'],
  },
  {
    id: 'rs-ch04-c-017',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Capitalize Front Through a Mutable Reference',
    prompt: `Write a function prefix_with that takes a &mut String and a &str, and inserts the &str at the front using the insert_str method (insert_str takes an index and a slice). In main, create a mutable String "world", call prefix_with to put "hello " in front, and print the result.

Expected output:
hello world`,
    hints: [
      'insert_str(0, prefix) inserts at the beginning.',
      'The String parameter must be &mut String and the source &str.',
    ],
    solution: `fn prefix_with(s: &mut String, prefix: &str) {
    s.insert_str(0, prefix);
}

fn main() {
    let mut s = String::from("world");
    prefix_with(&mut s, "hello ");
    println!("{}", s);
}`,
    starter: `fn prefix_with(s: &mut String, prefix: &str) {
    // TODO: insert prefix at the front
}

fn main() {
    let mut s = String::from("world");
    prefix_with(&mut s, "hello ");
    println!("{}", s);
}`,
    tags: ['mutable-reference', 'string'],
  },
  {
    id: 'rs-ch04-c-018',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mutable Reference in a New Scope',
    prompt: `Create a mutable String "x". In an inner block, take a mutable reference and push "y" onto it. After the block ends, take another mutable reference and push "z". Print the final String. Because the first mutable borrow ends with the block, the second is allowed.

Expected output:
xyz`,
    hints: [
      'A mutable borrow ends when its reference goes out of scope.',
      'Use a { ... } block to scope the first mutable reference.',
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
    // TODO: use a scoped mutable borrow, then another, to build "xyz"
}`,
    tags: ['mutable-reference', 'scope', 'borrowing'],
  },
  {
    id: 'rs-ch04-c-019',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Implement first_word',
    prompt: `Write the function first_word that takes a &str and returns the first word as a string slice (&str). A word ends at the first space; if there is no space, the whole string is the word. Use as_bytes and iterate to find the first space byte (b' '). In main, call it with "hello world" and print the result.

Expected output:
hello`,
    hints: [
      'Convert to bytes with as_bytes, then iterate with enumerate.',
      'When the byte equals a space (the b-space literal), return &s[0..i]. Otherwise return &s[..].',
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
    println!("{}", first_word(&s));
}`,
    starter: `fn first_word(s: &str) -> &str {
    // TODO: return the first word as a slice
}

fn main() {
    let s = String::from("hello world");
    println!("{}", first_word(&s));
}`,
    tags: ['slice', 'string', 'first-word'],
  },
  {
    id: 'rs-ch04-c-020',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print a Slice Without Consuming the String',
    prompt: `Write a function print_slice that takes a &str and prints it. In main, create a String "borrowed value", pass a slice of the first six characters to print_slice, and then print the whole String afterward to prove it is still owned and valid.

Expected output:
borrow
borrowed value`,
    hints: [
      'A &str parameter can receive a slice like &s[0..6].',
      'Passing a slice borrows; ownership stays with the String.',
    ],
    solution: `fn print_slice(s: &str) {
    println!("{}", s);
}

fn main() {
    let s = String::from("borrowed value");
    print_slice(&s[0..6]);
    println!("{}", s);
}`,
    starter: `fn print_slice(s: &str) {
    // TODO: print the slice
}

fn main() {
    let s = String::from("borrowed value");
    // TODO: pass the first six characters, then print the whole String
}`,
    tags: ['slice', 'references', 'str'],
  },
  {
    id: 'rs-ch04-c-021',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum an Array Slice',
    prompt: `Write a function sum_slice that takes a &[i32] and returns the sum of its elements as i32 by iterating with a for loop. In main, create an array [1, 2, 3, 4, 5], pass a slice of the middle three elements (indices 1 through 3), and print the sum.

Expected output:
9`,
    hints: [
      'Iterate with for &n in slice { ... } to get values.',
      'A slice of indices 1..4 covers elements 2, 3, 4.',
    ],
    solution: `fn sum_slice(slice: &[i32]) -> i32 {
    let mut total = 0;
    for &n in slice {
        total += n;
    }
    total
}

fn main() {
    let a = [1, 2, 3, 4, 5];
    let mid = &a[1..4];
    println!("{}", sum_slice(mid));
}`,
    starter: `fn sum_slice(slice: &[i32]) -> i32 {
    // TODO: sum the elements
}

fn main() {
    let a = [1, 2, 3, 4, 5];
    // TODO: pass a slice of the middle three elements and print the sum
}`,
    tags: ['slice', 'array'],
  },
  {
    id: 'rs-ch04-c-022',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Append With and Without Ownership',
    prompt: `Write a function add_suffix that takes a &mut String and appends "!" using push (push takes a single char). In main, create a mutable String "wow", call add_suffix three times, then print the result. The String keeps its ownership across all calls.

Expected output:
wow!!!`,
    hints: [
      'push appends a single char such as the exclamation mark.',
      'Pass &mut s on each call; the borrow ends after each returns.',
    ],
    solution: `fn add_suffix(s: &mut String) {
    s.push('!');
}

fn main() {
    let mut s = String::from("wow");
    add_suffix(&mut s);
    add_suffix(&mut s);
    add_suffix(&mut s);
    println!("{}", s);
}`,
    starter: `fn add_suffix(s: &mut String) {
    // TODO: push a single '!'
}

fn main() {
    let mut s = String::from("wow");
    // TODO: call add_suffix three times, then print
}`,
    tags: ['mutable-reference', 'string'],
  },
  {
    id: 'rs-ch04-c-023',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read After a Mutable Borrow Ends',
    prompt: `Create a mutable String "log". First, take a mutable reference and push ": start" onto it, finishing the mutable borrow. Then take two immutable references, and print them on separate lines. This is allowed because the mutable borrow is no longer in use when the immutable ones begin.

Expected output:
log: start
log: start`,
    hints: [
      'Finish using the mutable reference before creating immutable ones.',
      'Non-lexical lifetimes let a borrow end at its last use.',
    ],
    solution: `fn main() {
    let mut s = String::from("log");
    let r = &mut s;
    r.push_str(": start");
    let a = &s;
    let b = &s;
    println!("{}", a);
    println!("{}", b);
}`,
    starter: `fn main() {
    let mut s = String::from("log");
    // TODO: mutate via a mutable reference, then read via two immutable ones
}`,
    tags: ['borrowing', 'mutable-reference', 'references'],
  },
  {
    id: 'rs-ch04-c-024',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'first_word on a Single Word',
    prompt: `Reuse the first_word function (takes &str, returns &str, returns the whole string if there is no space). In main, call it with "rust" (which has no spaces) and print the result, confirming it returns the entire string.

Expected output:
rust`,
    hints: [
      'When no space is found, the loop ends and you return &s[..].',
      'Pass a &str directly; a literal works.',
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
    println!("{}", first_word("rust"));
}`,
    starter: `fn first_word(s: &str) -> &str {
    // TODO: return first word, or whole string if no space
}

fn main() {
    println!("{}", first_word("rust"));
}`,
    tags: ['slice', 'first-word', 'str'],
  },
  {
    id: 'rs-ch04-c-025',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Last Three Characters Slice',
    prompt: `Create a String "playground" (10 characters). Using the len method and a range, make a slice of the last three characters and print it. Compute the start index from the length so it works for that string.

Expected output:
und`,
    hints: [
      'Get the length with s.len(), then slice &s[len-3..len].',
      'You can also write &s[len-3..] to go to the end.',
    ],
    solution: `fn main() {
    let s = String::from("playground");
    let len = s.len();
    let last = &s[len - 3..len];
    println!("{}", last);
}`,
    starter: `fn main() {
    let s = String::from("playground");
    // TODO: slice the last three characters using len()
}`,
    tags: ['slice', 'string'],
  },
  {
    id: 'rs-ch04-c-026',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Return a Slice From a Function',
    prompt: `Write a function head that takes a &str and returns a slice of its first character (&str). In main, call head with "abc" and print the returned slice.

Expected output:
a`,
    hints: [
      'Return &s[0..1] to get the first character as a slice.',
      'The return type is &str.',
    ],
    solution: `fn head(s: &str) -> &str {
    &s[0..1]
}

fn main() {
    println!("{}", head("abc"));
}`,
    starter: `fn head(s: &str) -> &str {
    // TODO: return the first character as a slice
}

fn main() {
    println!("{}", head("abc"));
}`,
    tags: ['slice', 'str', 'return'],
  },
  {
    id: 'rs-ch04-c-027',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Move Into a Vec, Use the Vec After',
    prompt: `Create a String "item". Create a mutable Vec<String> and push the String into it with push (this moves the String into the vector). After the move, print the first element of the vector using indexing (v[0]) to show the value now lives in the vector.

Expected output:
item`,
    hints: [
      'Vec::new() creates an empty vector; declare it mut to push.',
      'push moves the String in; access it again via v[0].',
    ],
    solution: `fn main() {
    let s = String::from("item");
    let mut v: Vec<String> = Vec::new();
    v.push(s);
    println!("{}", v[0]);
}`,
    starter: `fn main() {
    let s = String::from("item");
    // TODO: push s into a Vec<String>, then print v[0]
}`,
    tags: ['ownership', 'move', 'vec'],
  },
  {
    id: 'rs-ch04-c-028',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Swap Two Strings With References',
    prompt: `Write a function swap_strings that takes two &mut String references and swaps their contents using std::mem::swap. In main, create mutable Strings a = "first" and b = "second", call swap_strings, then print a and b on separate lines.

Expected output:
second
first`,
    hints: [
      'std::mem::swap(x, y) exchanges the values behind two mutable references.',
      'Pass &mut a and &mut b. The two references point to different variables.',
    ],
    solution: `fn swap_strings(x: &mut String, y: &mut String) {
    std::mem::swap(x, y);
}

fn main() {
    let mut a = String::from("first");
    let mut b = String::from("second");
    swap_strings(&mut a, &mut b);
    println!("{}", a);
    println!("{}", b);
}`,
    starter: `fn swap_strings(x: &mut String, y: &mut String) {
    // TODO: swap the two Strings
}

fn main() {
    let mut a = String::from("first");
    let mut b = String::from("second");
    swap_strings(&mut a, &mut b);
    println!("{}", a);
    println!("{}", b);
}`,
    tags: ['mutable-reference', 'borrowing'],
  },
  {
    id: 'rs-ch04-c-029',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fix the Dangling Reference',
    prompt: `The function below tries to return a reference to a String created inside it, which would dangle. Rewrite no_dangle so it returns an owned String instead of a reference, fixing the problem. In main, call it and print the result.

Broken version:
fn dangle() -> &String {
    let s = String::from("hello");
    &s
}

Write no_dangle() -> String that returns the owned value.

Expected output:
hello`,
    hints: [
      'The fix is to return the String by value, moving ownership out.',
      'Change the return type to String and return s (no &).',
    ],
    solution: `fn no_dangle() -> String {
    let s = String::from("hello");
    s
}

fn main() {
    let s = no_dangle();
    println!("{}", s);
}`,
    starter: `fn no_dangle() -> String {
    // TODO: return an owned String instead of a reference
}

fn main() {
    let s = no_dangle();
    println!("{}", s);
}`,
    tags: ['dangling', 'ownership', 'return'],
  },
  {
    id: 'rs-ch04-c-030',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Largest Element Through an Array Slice',
    prompt: `Write a function largest that takes a &[i32] and returns the largest element as i32 by iterating. In main, create an array [3, 7, 2, 9, 4], pass the whole array as a slice (&a[..]), and print the largest value.

Expected output:
9`,
    hints: [
      'Start with the first element, then compare each value in the slice.',
      'Iterate with for &n in slice and update when n is larger.',
    ],
    solution: `fn largest(slice: &[i32]) -> i32 {
    let mut max = slice[0];
    for &n in slice {
        if n > max {
            max = n;
        }
    }
    max
}

fn main() {
    let a = [3, 7, 2, 9, 4];
    println!("{}", largest(&a[..]));
}`,
    starter: `fn largest(slice: &[i32]) -> i32 {
    // TODO: return the largest element
}

fn main() {
    let a = [3, 7, 2, 9, 4];
    println!("{}", largest(&a[..]));
}`,
    tags: ['slice', 'array'],
  },
  {
    id: 'rs-ch04-c-031',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'second_word Slice',
    prompt: `Write a function second_word that takes a &str containing exactly two space-separated words and returns the second word as a string slice (&str). Find the space, then return everything after it. In main, call it with "hello world" and print the result.

Expected output:
world`,
    hints: [
      'Find the index of the space byte (the b-space literal) using as_bytes and enumerate.',
      'Return &s[i+1..] for everything after the space.',
    ],
    solution: `fn second_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[i + 1..];
        }
    }
    &s[..]
}

fn main() {
    let s = String::from("hello world");
    println!("{}", second_word(&s));
}`,
    starter: `fn second_word(s: &str) -> &str {
    // TODO: return the second word as a slice
}

fn main() {
    let s = String::from("hello world");
    println!("{}", second_word(&s));
}`,
    tags: ['slice', 'string', 'str'],
  },
  {
    id: 'rs-ch04-c-032',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Words Using first_word Twice',
    prompt: `Write a function first_word(&str) -> &str that returns the first word (whole string if no space). In main, take the String "one two three", print the first word, then make a slice of everything after the first space (&s[len_of_first_word+1..]) and print the first word of that remainder. Use first_word on both.

Expected output:
one
two`,
    hints: [
      'After printing the first word, compute where it ends from its length.',
      'Slice the remainder with &s[first.len()+1..], then call first_word again.',
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
    let s = String::from("one two three");
    let first = first_word(&s);
    println!("{}", first);
    let rest = &s[first.len() + 1..];
    println!("{}", first_word(rest));
}`,
    starter: `fn first_word(s: &str) -> &str {
    // TODO: return the first word as a slice
}

fn main() {
    let s = String::from("one two three");
    // TODO: print the first word, then the first word of the remainder
}`,
    tags: ['slice', 'first-word', 'str'],
  },
  {
    id: 'rs-ch04-c-033',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Double Each Element Through a Mutable Slice',
    prompt: `Write a function double_all that takes a &mut [i32] and doubles every element in place by iterating with for n in slice.iter_mut(). In main, create a mutable array [1, 2, 3], pass a mutable slice of the whole array (&mut a[..]), then print the array with the debug formatter.

Expected output:
[2, 4, 6]`,
    hints: [
      'iter_mut yields mutable references; write *n *= 2 to modify in place.',
      'The array must be declared mut, and pass &mut a[..].',
    ],
    solution: `fn double_all(slice: &mut [i32]) {
    for n in slice.iter_mut() {
        *n *= 2;
    }
}

fn main() {
    let mut a = [1, 2, 3];
    double_all(&mut a[..]);
    println!("{:?}", a);
}`,
    starter: `fn double_all(slice: &mut [i32]) {
    // TODO: double each element in place
}

fn main() {
    let mut a = [1, 2, 3];
    double_all(&mut a[..]);
    println!("{:?}", a);
}`,
    tags: ['slice', 'mutable-reference', 'array'],
  },
  {
    id: 'rs-ch04-c-034',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'first_word Works on String and Literal',
    prompt: `Write first_word with the signature fn first_word(s: &str) -> &str (returns the whole string if there is no space). In main, demonstrate it works for both a String and a string literal: call it with a slice of the String "spring time" and with the literal "summer heat", printing each result on its own line.

Expected output:
spring
summer`,
    hints: [
      'Because the parameter is &str, you can pass &my_string[..] or a literal.',
      'The same function body handles both cases.',
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
    let my_string = String::from("spring time");
    println!("{}", first_word(&my_string[..]));
    println!("{}", first_word("summer heat"));
}`,
    starter: `fn first_word(s: &str) -> &str {
    // TODO: return the first word as a slice
}

fn main() {
    let my_string = String::from("spring time");
    // TODO: call first_word on a String slice and on a literal
}`,
    tags: ['slice', 'first-word', 'str'],
  },
  {
    id: 'rs-ch04-c-035',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build, Borrow, Mutate, and Read in Order',
    prompt: `Write a small program that exercises ownership rules in sequence. Create a mutable String starting as "a". Write a function grow(s: &mut String, part: &str) that appends part. Call grow to append "b" and then "c". Then write a function describe(s: &str) -> usize that returns the length, call it, and print the final String and its length on one line in the form "abc has length 3".

Expected output:
abc has length 3`,
    hints: [
      'grow uses &mut String and push_str; describe uses &str and len.',
      'Each mutable borrow in grow ends when the call returns, so reading afterward is fine.',
    ],
    solution: `fn grow(s: &mut String, part: &str) {
    s.push_str(part);
}

fn describe(s: &str) -> usize {
    s.len()
}

fn main() {
    let mut s = String::from("a");
    grow(&mut s, "b");
    grow(&mut s, "c");
    let len = describe(&s);
    println!("{} has length {}", s, len);
}`,
    starter: `fn grow(s: &mut String, part: &str) {
    // TODO: append part
}

fn describe(s: &str) -> usize {
    // TODO: return the length
}

fn main() {
    let mut s = String::from("a");
    // TODO: grow with "b" and "c", describe, then print
}`,
    tags: ['ownership', 'borrowing', 'mutable-reference'],
  },
]

export default problems
