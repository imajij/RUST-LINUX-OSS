import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch08-c-001',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create an Empty Vector',
    prompt: `In \`main\`, create a new empty vector named \`v\` that will hold \`i32\` values. Use \`Vec::new()\` and give it an explicit type annotation so the program compiles.

Then print the vector using \`println!("{:?}", v);\` which should display \`[]\`.`,
    hints: [
      'An empty Vec needs a type annotation, like \`let v: Vec<i32> = Vec::new();\`.',
      'Use the \`{:?}\` debug formatter to print a vector.',
    ],
    solution: `fn main() {
    let v: Vec<i32> = Vec::new();
    println!("{:?}", v);
}`,
    starter: `fn main() {
    // TODO: create an empty Vec<i32> named v and print it
}`,
    tags: ['vec', 'new'],
  },
  {
    id: 'rs-ch08-c-002',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Vector With the vec! Macro',
    prompt: `Use the \`vec!\` macro to create a vector named \`nums\` containing the values 10, 20, and 30.

Print it with \`println!("{:?}", nums);\`. The output should be \`[10, 20, 30]\`.`,
    hints: [
      'The \`vec!\` macro takes comma-separated initial values: \`vec![a, b, c]\`.',
      'Rust infers the element type from the values, so no annotation is needed here.',
    ],
    solution: `fn main() {
    let nums = vec![10, 20, 30];
    println!("{:?}", nums);
}`,
    starter: `fn main() {
    // TODO: build the vector with vec! and print it
}`,
    tags: ['vec', 'macro'],
  },
  {
    id: 'rs-ch08-c-003',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Push Onto a Vector',
    prompt: `Create a mutable empty vector named \`v\` of \`i32\`. Push the numbers 1, 2, and 3 onto it, one at a time, using \`push\`.

Then print the vector with \`println!("{:?}", v);\`. The output should be \`[1, 2, 3]\`.`,
    hints: [
      'The vector must be declared with \`let mut\` to allow pushing.',
      'Call \`v.push(value);\` once per value.',
    ],
    solution: `fn main() {
    let mut v: Vec<i32> = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);
    println!("{:?}", v);
}`,
    starter: `fn main() {
    let mut v: Vec<i32> = Vec::new();
    // TODO: push 1, 2, 3 then print
}`,
    tags: ['vec', 'push', 'mutability'],
  },
  {
    id: 'rs-ch08-c-004',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Index Into a Vector',
    prompt: `Given \`let v = vec![5, 6, 7, 8];\`, use indexing syntax to read the third element (the value 7) into a variable named \`third\`, then print it.

Expected output:
    The third element is 7`,
    hints: [
      'Indexing uses square brackets and starts at 0, so the third element is at index 2.',
      'Borrow with a reference: \`let third = &v[2];\`.',
    ],
    solution: `fn main() {
    let v = vec![5, 6, 7, 8];
    let third = &v[2];
    println!("The third element is {}", third);
}`,
    starter: `fn main() {
    let v = vec![5, 6, 7, 8];
    // TODO: read the third element and print it
}`,
    tags: ['vec', 'indexing'],
  },
  {
    id: 'rs-ch08-c-005',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Safe Access With get',
    prompt: `Given \`let v = vec![1, 2, 3];\`, use the \`get\` method to look up index 1. Match on the returned \`Option\`:
- on \`Some(value)\` print \`Found: <value>\`
- on \`None\` print \`No element\`

Expected output:
    Found: 2`,
    hints: [
      '\`v.get(1)\` returns an \`Option<&i32>\`.',
      'Use a \`match\` with \`Some(x)\` and \`None\` arms.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3];
    match v.get(1) {
        Some(value) => println!("Found: {}", value),
        None => println!("No element"),
    }
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3];
    // TODO: use get(1) and match on the Option
}`,
    tags: ['vec', 'get', 'option'],
  },
  {
    id: 'rs-ch08-c-006',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Out-of-Bounds With get',
    prompt: `Given \`let v = vec![1, 2, 3];\`, call \`v.get(10)\` on an index that does not exist. Match the result and print \`No element at index 10\` when it is \`None\`.

Expected output:
    No element at index 10`,
    hints: [
      'Indexing with \`v[10]\` would panic, but \`get\` returns \`None\` for missing indices.',
      'Handle the \`None\` arm of the match.',
    ],
    solution: `fn main() {
    let v = vec![1, 2, 3];
    match v.get(10) {
        Some(value) => println!("Found: {}", value),
        None => println!("No element at index 10"),
    }
}`,
    starter: `fn main() {
    let v = vec![1, 2, 3];
    // TODO: call get(10) and report when it is None
}`,
    tags: ['vec', 'get', 'bounds'],
  },
  {
    id: 'rs-ch08-c-007',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Iterate Over a Vector',
    prompt: `Given \`let v = vec![100, 32, 57];\`, use a \`for\` loop with an immutable reference to print each element on its own line.

Expected output:
    100
    32
    57`,
    hints: [
      'Loop with \`for i in &v { ... }\` to borrow each element.',
      'Inside the loop, print \`i\`.',
    ],
    solution: `fn main() {
    let v = vec![100, 32, 57];
    for i in &v {
        println!("{}", i);
    }
}`,
    starter: `fn main() {
    let v = vec![100, 32, 57];
    // TODO: iterate with a for loop and print each element
}`,
    tags: ['vec', 'iteration'],
  },
  {
    id: 'rs-ch08-c-008',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create a String With new',
    prompt: `In \`main\`, create a new empty, growable \`String\` named \`s\` using \`String::new()\`. Then push the text "hello" onto it with \`push_str\` and print the result.

Expected output:
    hello`,
    hints: [
      '\`String::new()\` creates an empty string; declare it with \`let mut\` so you can modify it.',
      '\`push_str\` appends a string slice.',
    ],
    solution: `fn main() {
    let mut s = String::new();
    s.push_str("hello");
    println!("{}", s);
}`,
    starter: `fn main() {
    let mut s = String::new();
    // TODO: push_str "hello" and print s
}`,
    tags: ['string', 'new', 'push_str'],
  },
  {
    id: 'rs-ch08-c-009',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'String From a Literal',
    prompt: `Create an owned \`String\` named \`greeting\` from the literal "good morning" two different ways and confirm they are equal.

Make \`greeting\` using \`String::from("good morning")\` and another variable \`also\` using \`"good morning".to_string()\`. Print whether they are equal:
    equal: true`,
    hints: [
      'Both \`String::from(...)\` and \`"...".to_string()\` produce an owned \`String\`.',
      'Compare with \`==\` and print the boolean.',
    ],
    solution: `fn main() {
    let greeting = String::from("good morning");
    let also = "good morning".to_string();
    println!("equal: {}", greeting == also);
}`,
    starter: `fn main() {
    // TODO: build the same String two ways and compare them
}`,
    tags: ['string', 'from', 'to_string'],
  },
  {
    id: 'rs-ch08-c-010',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Append a Character',
    prompt: `Start with \`let mut s = String::from("lo");\`. Use the \`push\` method to append the single character 'l' so the string becomes "lol", then print it.

Expected output:
    lol`,
    hints: [
      'The push method takes a single char, written with single quotes like the letter l in quotes.',
      'Note that push_str takes a string slice while push takes one char.',
    ],
    solution: `fn main() {
    let mut s = String::from("lo");
    s.push('l');
    println!("{}", s);
}`,
    starter: `fn main() {
    let mut s = String::from("lo");
    // TODO: push the char 'l' and print s
}`,
    tags: ['string', 'push', 'char'],
  },
  {
    id: 'rs-ch08-c-011',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create an Empty HashMap',
    prompt: `Bring \`HashMap\` into scope, then create a new empty map named \`scores\` whose keys are \`String\` and whose values are \`i32\`. Print it with the debug formatter.

Expected output:
    {}`,
    hints: [
      'Add \`use std::collections::HashMap;\` at the top.',
      'Annotate the type: \`let scores: HashMap<String, i32> = HashMap::new();\`.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let scores: HashMap<String, i32> = HashMap::new();
    println!("{:?}", scores);
}`,
    starter: `// TODO: bring HashMap into scope

fn main() {
    // TODO: create an empty HashMap<String, i32> named scores and print it
}`,
    tags: ['hashmap', 'new'],
  },
  {
    id: 'rs-ch08-c-012',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Insert and Get a Score',
    prompt: `Create a \`HashMap<String, i32>\` named \`scores\`. Insert the key "Blue" with value 10. Then look up "Blue" with \`get\` and print the value.

Expected output:
    Blue: 10`,
    hints: [
      'Insert with \`scores.insert(String::from("Blue"), 10);\`.',
      '\`scores.get("Blue")\` returns an \`Option<&i32>\`; use a match or check the docs example with \`copied\` and \`unwrap_or\`.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    match scores.get("Blue") {
        Some(v) => println!("Blue: {}", v),
        None => println!("Blue: none"),
    }
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    // TODO: insert "Blue" -> 10, then get and print it
}`,
    tags: ['hashmap', 'insert', 'get'],
  },
  {
    id: 'rs-ch08-c-013',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum of a Vector',
    prompt: `Write a function \`fn sum(v: &[i32]) -> i32\` that returns the sum of all elements in the slice by iterating with a \`for\` loop and accumulating into a variable.

In \`main\`, call it on \`vec![3, 7, 2, 8]\` and print the result.

Expected output:
    20`,
    hints: [
      'Accept \`&[i32]\` so both vectors and arrays work; you can pass \`&v\`.',
      'Start an accumulator at 0 and add each element inside the loop.',
    ],
    solution: `fn sum(v: &[i32]) -> i32 {
    let mut total = 0;
    for n in v {
        total += n;
    }
    total
}

fn main() {
    let v = vec![3, 7, 2, 8];
    println!("{}", sum(&v));
}`,
    starter: `fn sum(v: &[i32]) -> i32 {
    // TODO: accumulate the total
}

fn main() {
    let v = vec![3, 7, 2, 8];
    println!("{}", sum(&v));
}`,
    tags: ['vec', 'iteration', 'functions'],
  },
  {
    id: 'rs-ch08-c-014',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Double Every Element',
    prompt: `Given a mutable vector \`let mut v = vec![1, 2, 3, 4];\`, iterate with a mutable reference and double each element in place. Then print the vector.

Expected output:
    [2, 4, 6, 8]`,
    hints: [
      'Loop with \`for n in &mut v { ... }\` to get mutable references.',
      'Dereference with \`*n\` to change the value: \`*n *= 2;\`.',
    ],
    solution: `fn main() {
    let mut v = vec![1, 2, 3, 4];
    for n in &mut v {
        *n *= 2;
    }
    println!("{:?}", v);
}`,
    starter: `fn main() {
    let mut v = vec![1, 2, 3, 4];
    // TODO: double each element in place, then print
}`,
    tags: ['vec', 'mutation', 'iteration'],
  },
  {
    id: 'rs-ch08-c-015',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find the Largest Element',
    prompt: `Write a function \`fn largest(v: &[i32]) -> i32\` that returns the maximum value in the slice using a \`for\` loop (do not use built-in max helpers).

In \`main\`, call it on \`vec![23, 9, 47, 12, 47, 5]\` and print the result.

Expected output:
    47`,
    hints: [
      'Start by assuming the first element is the largest.',
      'Compare each element and update the largest when you find a bigger one.',
    ],
    solution: `fn largest(v: &[i32]) -> i32 {
    let mut max = v[0];
    for &n in v {
        if n > max {
            max = n;
        }
    }
    max
}

fn main() {
    let v = vec![23, 9, 47, 12, 47, 5];
    println!("{}", largest(&v));
}`,
    starter: `fn largest(v: &[i32]) -> i32 {
    // TODO: find and return the largest value
}

fn main() {
    let v = vec![23, 9, 47, 12, 47, 5];
    println!("{}", largest(&v));
}`,
    tags: ['vec', 'iteration', 'functions'],
  },
  {
    id: 'rs-ch08-c-016',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Elements Above a Threshold',
    prompt: `Write a function \`fn count_above(v: &[i32], threshold: i32) -> usize\` that returns how many elements are strictly greater than \`threshold\`.

In \`main\`, call it on \`vec![5, 12, 8, 20, 3, 15]\` with threshold 10 and print the count.

Expected output:
    3`,
    hints: [
      'Keep a counter of type \`usize\` starting at 0.',
      'Increment when an element is greater than the threshold.',
    ],
    solution: `fn count_above(v: &[i32], threshold: i32) -> usize {
    let mut count = 0;
    for &n in v {
        if n > threshold {
            count += 1;
        }
    }
    count
}

fn main() {
    let v = vec![5, 12, 8, 20, 3, 15];
    println!("{}", count_above(&v, 10));
}`,
    starter: `fn count_above(v: &[i32], threshold: i32) -> usize {
    // TODO: count elements greater than threshold
}

fn main() {
    let v = vec![5, 12, 8, 20, 3, 15];
    println!("{}", count_above(&v, 10));
}`,
    tags: ['vec', 'iteration', 'functions'],
  },
  {
    id: 'rs-ch08-c-017',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reverse a Vector Manually',
    prompt: `Write a function \`fn reversed(v: &[i32]) -> Vec<i32>\` that builds and returns a new vector with the elements of \`v\` in reverse order. Use a loop and \`push\`; do not call the built-in \`reverse\` method.

In \`main\`, call it on \`vec![1, 2, 3, 4, 5]\` and print the result.

Expected output:
    [5, 4, 3, 2, 1]`,
    hints: [
      'Create a new empty \`Vec<i32>\` with \`Vec::new()\`.',
      'Iterate the input from the last index down to 0, pushing each element.',
    ],
    solution: `fn reversed(v: &[i32]) -> Vec<i32> {
    let mut out = Vec::new();
    let mut i = v.len();
    while i > 0 {
        i -= 1;
        out.push(v[i]);
    }
    out
}

fn main() {
    let v = vec![1, 2, 3, 4, 5];
    println!("{:?}", reversed(&v));
}`,
    starter: `fn reversed(v: &[i32]) -> Vec<i32> {
    // TODO: build a new vector in reverse order
}

fn main() {
    let v = vec![1, 2, 3, 4, 5];
    println!("{:?}", reversed(&v));
}`,
    tags: ['vec', 'push', 'functions'],
  },
  {
    id: 'rs-ch08-c-018',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mixed Types in a Vector',
    prompt: `Define an enum \`Cell\` with variants \`Int(i32)\`, \`Float(f64)\`, and \`Text(String)\`. Build a vector \`row\` containing one of each variant: \`Cell::Int(3)\`, \`Cell::Text(String::from("hi"))\`, and \`Cell::Float(2.5)\`.

Iterate the vector and \`match\` each cell to print its contents, one per line:
    int 3
    text hi
    float 2.5`,
    hints: [
      'A vector can hold one enum type whose variants wrap different data types.',
      'Match on \`&cell\` with arms like \`Cell::Int(n) => ...\`.',
    ],
    solution: `enum Cell {
    Int(i32),
    Float(f64),
    Text(String),
}

fn main() {
    let row = vec![
        Cell::Int(3),
        Cell::Text(String::from("hi")),
        Cell::Float(2.5),
    ];
    for cell in &row {
        match cell {
            Cell::Int(n) => println!("int {}", n),
            Cell::Text(s) => println!("text {}", s),
            Cell::Float(f) => println!("float {}", f),
        }
    }
}`,
    starter: `enum Cell {
    Int(i32),
    Float(f64),
    Text(String),
}

fn main() {
    // TODO: build the row vector and match-print each cell
}`,
    tags: ['vec', 'enum', 'match'],
  },
  {
    id: 'rs-ch08-c-019',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Concatenate With push_str',
    prompt: `Write a function \`fn join_words(words: &[String]) -> String\` that builds a single string by appending each word followed by a space, using \`push_str\`.

In \`main\`, call it on a vector containing "Rust", "is", and "fun", then print the result (a trailing space is fine).

Expected output:
    Rust is fun `,
    hints: [
      'Start with \`String::new()\`.',
      'For each word, \`push_str(word)\` then \`push_str(" ")\` (or push a space char).',
    ],
    solution: `fn join_words(words: &[String]) -> String {
    let mut out = String::new();
    for w in words {
        out.push_str(w);
        out.push(' ');
    }
    out
}

fn main() {
    let words = vec![
        String::from("Rust"),
        String::from("is"),
        String::from("fun"),
    ];
    println!("{}", join_words(&words));
}`,
    starter: `fn join_words(words: &[String]) -> String {
    // TODO: append each word and a space
}

fn main() {
    let words = vec![
        String::from("Rust"),
        String::from("is"),
        String::from("fun"),
    ];
    println!("{}", join_words(&words));
}`,
    tags: ['string', 'push_str', 'functions'],
  },
  {
    id: 'rs-ch08-c-020',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Concatenate With the Plus Operator',
    prompt: `Given \`let s1 = String::from("Hello, ");\` and \`let s2 = String::from("world!");\`, combine them into \`s3\` using the \`+\` operator. Print \`s3\`.

Remember that \`+\` takes ownership of the left operand and borrows the right, so the right side must be a reference.

Expected output:
    Hello, world!`,
    hints: [
      'Write \`let s3 = s1 + &s2;\` — note \`s1\` is moved and can no longer be used.',
      'The right operand needs the \`&\` so it is a \`&str\` reference.',
    ],
    solution: `fn main() {
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2;
    println!("{}", s3);
}`,
    starter: `fn main() {
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    // TODO: build s3 with the + operator and print it
}`,
    tags: ['string', 'concatenation', 'ownership'],
  },
  {
    id: 'rs-ch08-c-021',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build a String With format!',
    prompt: `Given three parts \`let a = "2024";\`, \`let b = "11";\`, and \`let c = "05";\`, use the \`format!\` macro to build a date string \`a-b-c\` without taking ownership of any part. Print it.

Expected output:
    2024-11-05`,
    hints: [
      '\`format!\` works like \`println!\` but returns a \`String\` instead of printing.',
      'It does not take ownership of its arguments, unlike \`+\`.',
    ],
    solution: `fn main() {
    let a = "2024";
    let b = "11";
    let c = "05";
    let date = format!("{}-{}-{}", a, b, c);
    println!("{}", date);
}`,
    starter: `fn main() {
    let a = "2024";
    let b = "11";
    let c = "05";
    // TODO: use format! to build "2024-11-05" and print it
}`,
    tags: ['string', 'format', 'macro'],
  },
  {
    id: 'rs-ch08-c-022',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Iterate Characters of a String',
    prompt: `Write a function \`fn count_chars(s: &str) -> usize\` that returns the number of Unicode characters in \`s\` by iterating over \`chars()\` and counting (do not call \`.count()\` or \`.len()\`).

In \`main\`, call it on "नमस्ते" and on "hello", printing each count.

Expected output:
    6
    5`,
    hints: [
      'Use \`for _ in s.chars() { ... }\` and increment a counter.',
      'Note that \`chars()\` counts Unicode scalar values, which can differ from byte length.',
    ],
    solution: `fn count_chars(s: &str) -> usize {
    let mut count = 0;
    for _ in s.chars() {
        count += 1;
    }
    count
}

fn main() {
    println!("{}", count_chars("नमस्ते"));
    println!("{}", count_chars("hello"));
}`,
    starter: `fn count_chars(s: &str) -> usize {
    // TODO: count chars by iterating over s.chars()
}

fn main() {
    println!("{}", count_chars("नमस्ते"));
    println!("{}", count_chars("hello"));
}`,
    tags: ['string', 'chars', 'utf8'],
  },
  {
    id: 'rs-ch08-c-023',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Bytes Versus Chars',
    prompt: `For the string "Здравствуйте", print two numbers: the number of bytes (using \`.len()\` on the string) and the number of characters (by counting \`chars()\`). This shows that UTF-8 bytes and chars can differ.

Expected output:
    bytes: 24
    chars: 12`,
    hints: [
      '\`s.len()\` returns the number of bytes, not characters.',
      'Count characters by iterating over \`s.chars()\`.',
    ],
    solution: `fn main() {
    let s = "Здравствуйте";
    let mut chars = 0;
    for _ in s.chars() {
        chars += 1;
    }
    println!("bytes: {}", s.len());
    println!("chars: {}", chars);
}`,
    starter: `fn main() {
    let s = "Здравствуйте";
    // TODO: print byte length and char count
}`,
    tags: ['string', 'bytes', 'utf8'],
  },
  {
    id: 'rs-ch08-c-024',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Vowels in a String',
    prompt: `Write a function \`fn count_vowels(s: &str) -> usize\` that counts how many characters are vowels (a, e, i, o, u — lowercase only). Iterate the characters and match against the vowels.

In \`main\`, call it on "education" and print the count.

Expected output:
    5`,
    hints: [
      'Iterate with \`for c in s.chars()\`.',
      'Use a match with a pattern that lists the vowel chars separated by the or-pattern bar, or an if with multiple comparisons.',
    ],
    solution: `fn count_vowels(s: &str) -> usize {
    let mut count = 0;
    for c in s.chars() {
        match c {
            'a' | 'e' | 'i' | 'o' | 'u' => count += 1,
            _ => {}
        }
    }
    count
}

fn main() {
    println!("{}", count_vowels("education"));
}`,
    starter: `fn count_vowels(s: &str) -> usize {
    // TODO: count the vowels
}

fn main() {
    println!("{}", count_vowels("education"));
}`,
    tags: ['string', 'chars', 'match'],
  },
  {
    id: 'rs-ch08-c-025',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'First Word With a String Slice',
    prompt: `Write a function \`fn first_word(s: &str) -> &str\` that returns the first word of \`s\` (everything up to the first space). If there is no space, return the whole string. Use byte iteration over \`s.as_bytes()\` and slicing, as shown in the book.

In \`main\`, call it on "hello world" and print the result.

Expected output:
    hello`,
    hints: [
      'Get the bytes with \`let bytes = s.as_bytes();\` and loop with \`for (i, &b) in bytes.iter().enumerate()\`.',
      'When you find a space byte (the byte literal for a space), return the slice up to that index; otherwise return the whole string slice.',
    ],
    solution: `fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

fn main() {
    println!("{}", first_word("hello world"));
}`,
    starter: `fn first_word(s: &str) -> &str {
    // TODO: return everything up to the first space
}

fn main() {
    println!("{}", first_word("hello world"));
}`,
    tags: ['string', 'slice', 'bytes'],
  },
  {
    id: 'rs-ch08-c-026',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Iterate a HashMap',
    prompt: `Build a \`HashMap<String, i32>\` named \`scores\` with "Blue" -> 10 and "Yellow" -> 50. Iterate over it with a \`for\` loop and print each pair as \`key: value\`.

Because HashMap iteration order is arbitrary, the two lines may appear in any order. Example output:
    Blue: 10
    Yellow: 50`,
    hints: [
      'Loop with \`for (key, value) in &scores { ... }\`.',
      'Order is not guaranteed, so do not rely on a specific ordering.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    // TODO: insert two entries, then iterate and print each pair
}`,
    tags: ['hashmap', 'iteration', 'insert'],
  },
  {
    id: 'rs-ch08-c-027',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'HashMap Ownership of a String Key',
    prompt: `Demonstrate that inserting an owned \`String\` into a HashMap moves it. Create \`let key = String::from("color");\` and \`let value = String::from("blue");\`, insert them into a \`HashMap<String, String>\`, then look up "color" with \`get\` and print the value.

Do NOT try to use \`key\` or \`value\` after the insert (they were moved into the map).

Expected output:
    color is blue`,
    hints: [
      'After \`map.insert(key, value);\`, the variables \`key\` and \`value\` are no longer valid.',
      'Look up with \`map.get("color")\` which returns an \`Option<&String>\`.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let key = String::from("color");
    let value = String::from("blue");
    let mut map: HashMap<String, String> = HashMap::new();
    map.insert(key, value);
    match map.get("color") {
        Some(v) => println!("color is {}", v),
        None => println!("not found"),
    }
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let key = String::from("color");
    let value = String::from("blue");
    let mut map: HashMap<String, String> = HashMap::new();
    // TODO: insert key/value (they move in), then look up "color"
}`,
    tags: ['hashmap', 'ownership', 'string'],
  },
  {
    id: 'rs-ch08-c-028',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Overwrite a HashMap Value',
    prompt: `Create a \`HashMap<String, i32>\`. Insert "Blue" -> 10, then insert "Blue" -> 25 again. Because inserting with an existing key replaces the value, print the final value of "Blue".

Expected output:
    Blue: 25`,
    hints: [
      'Calling \`insert\` with a key that already exists overwrites the old value.',
      'Look up the key afterward to confirm the new value.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Blue"), 25);
    println!("Blue: {}", scores.get("Blue").copied().unwrap_or(0));
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    // TODO: insert "Blue" twice, then print the final value
}`,
    tags: ['hashmap', 'insert', 'overwrite'],
  },
  {
    id: 'rs-ch08-c-029',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Insert Only If Absent With entry',
    prompt: `Create a \`HashMap<String, i32>\` and insert "Blue" -> 10. Then use \`entry(...).or_insert(...)\` for both "Blue" -> 50 and "Yellow" -> 50. Because \`or_insert\` only inserts when the key is missing, "Blue" keeps 10 while "Yellow" becomes 50.

Print both values:
    Blue: 10
    Yellow: 50`,
    hints: [
      '\`scores.entry(key).or_insert(value)\` inserts only if the key is absent.',
      'For an existing key, \`or_insert\` leaves the current value unchanged.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.entry(String::from("Blue")).or_insert(50);
    scores.entry(String::from("Yellow")).or_insert(50);
    println!("Blue: {}", scores.get("Blue").copied().unwrap_or(0));
    println!("Yellow: {}", scores.get("Yellow").copied().unwrap_or(0));
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    // TODO: use entry().or_insert() for "Blue" and "Yellow", then print both
}`,
    tags: ['hashmap', 'entry', 'or_insert'],
  },
  {
    id: 'rs-ch08-c-030',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Word Count',
    prompt: `Write a function \`fn word_count(text: &str) -> HashMap<String, i32>\` that counts how many times each whitespace-separated word appears. Use \`split_whitespace\` and \`entry(...).or_insert(0)\`, dereferencing to add 1.

In \`main\`, call it on "the cat the dog the bird" and print the count for "the".

Expected output:
    the: 3`,
    hints: [
      'Iterate with \`for word in text.split_whitespace()\`.',
      '\`let count = map.entry(word.to_string()).or_insert(0); *count += 1;\`',
    ],
    solution: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, i32> {
    let mut map: HashMap<String, i32> = HashMap::new();
    for word in text.split_whitespace() {
        let count = map.entry(word.to_string()).or_insert(0);
        *count += 1;
    }
    map
}

fn main() {
    let counts = word_count("the cat the dog the bird");
    println!("the: {}", counts.get("the").copied().unwrap_or(0));
}`,
    starter: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, i32> {
    // TODO: count each word using entry().or_insert()
}

fn main() {
    let counts = word_count("the cat the dog the bird");
    println!("the: {}", counts.get("the").copied().unwrap_or(0));
}`,
    tags: ['hashmap', 'entry', 'word-count'],
  },
  {
    id: 'rs-ch08-c-031',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Tally Letter Frequencies',
    prompt: `Write a function \`fn letter_freq(s: &str) -> HashMap<char, i32>\` that counts how many times each character appears in \`s\`. Iterate over \`chars()\` and use \`entry(...).or_insert(0)\` to update from the old value.

In \`main\`, call it on "banana" and print the counts for 'a' and 'n':
    a: 3
    n: 2`,
    hints: [
      'The key type is \`char\`, which is \`Copy\`, so you can insert it directly.',
      'Update with \`*map.entry(c).or_insert(0) += 1;\`.',
    ],
    solution: `use std::collections::HashMap;

fn letter_freq(s: &str) -> HashMap<char, i32> {
    let mut map: HashMap<char, i32> = HashMap::new();
    for c in s.chars() {
        *map.entry(c).or_insert(0) += 1;
    }
    map
}

fn main() {
    let freq = letter_freq("banana");
    println!("a: {}", freq.get(&'a').copied().unwrap_or(0));
    println!("n: {}", freq.get(&'n').copied().unwrap_or(0));
}`,
    starter: `use std::collections::HashMap;

fn letter_freq(s: &str) -> HashMap<char, i32> {
    // TODO: tally each character's frequency
}

fn main() {
    let freq = letter_freq("banana");
    println!("a: {}", freq.get(&'a').copied().unwrap_or(0));
    println!("n: {}", freq.get(&'n').copied().unwrap_or(0));
}`,
    tags: ['hashmap', 'entry', 'chars'],
  },
  {
    id: 'rs-ch08-c-032',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Median of a List',
    prompt: `Write a function \`fn median(v: &[i32]) -> i32\` that returns the median of a list of integers. Make a copy of the slice into a new \`Vec\`, sort it with \`.sort()\`, and return the middle element. You may assume the list is non-empty and has an odd length.

In \`main\`, call it on \`vec![3, 1, 4, 1, 5, 9, 2]\` and print the result.

Expected output:
    3`,
    hints: [
      'Copy into a new vector with \`let mut sorted = v.to_vec();\` then \`sorted.sort();\`.',
      'For odd length, the median is at index \`sorted.len() / 2\`.',
    ],
    solution: `fn median(v: &[i32]) -> i32 {
    let mut sorted = v.to_vec();
    sorted.sort();
    sorted[sorted.len() / 2]
}

fn main() {
    let v = vec![3, 1, 4, 1, 5, 9, 2];
    println!("{}", median(&v));
}`,
    starter: `fn median(v: &[i32]) -> i32 {
    // TODO: sort a copy and return the middle element
}

fn main() {
    let v = vec![3, 1, 4, 1, 5, 9, 2];
    println!("{}", median(&v));
}`,
    tags: ['vec', 'sort', 'median'],
  },
  {
    id: 'rs-ch08-c-033',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mode of a List',
    prompt: `Write a function \`fn mode(v: &[i32]) -> i32\` that returns the value that appears most often (the mode). Use a \`HashMap<i32, i32>\` to count occurrences with \`entry(...).or_insert(0)\`, then iterate the map to find the key with the highest count. You may assume there is a single clear winner.

In \`main\`, call it on \`vec![1, 2, 2, 3, 3, 3, 4]\` and print the result.

Expected output:
    3`,
    hints: [
      'First build a frequency map by iterating the slice.',
      'Then iterate the map keeping track of the key with the largest count seen so far.',
    ],
    solution: `use std::collections::HashMap;

fn mode(v: &[i32]) -> i32 {
    let mut counts: HashMap<i32, i32> = HashMap::new();
    for &n in v {
        *counts.entry(n).or_insert(0) += 1;
    }
    let mut best = v[0];
    let mut best_count = 0;
    for (&value, &count) in &counts {
        if count > best_count {
            best_count = count;
            best = value;
        }
    }
    best
}

fn main() {
    let v = vec![1, 2, 2, 3, 3, 3, 4];
    println!("{}", mode(&v));
}`,
    starter: `use std::collections::HashMap;

fn mode(v: &[i32]) -> i32 {
    // TODO: count occurrences, then return the most frequent value
}

fn main() {
    let v = vec![1, 2, 2, 3, 3, 3, 4];
    println!("{}", mode(&v));
}`,
    tags: ['hashmap', 'vec', 'mode'],
  },
  {
    id: 'rs-ch08-c-034',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pig Latin Translator',
    prompt: `Write a function \`fn pig_latin(word: &str) -> String\` that converts a single lowercase word to pig latin:
- If the word starts with a vowel (a, e, i, o, u), append "-hay".
- Otherwise, move the first letter to the end and append "ay", joined with a dash. For example "first" becomes "irst-fay".

In \`main\`, call it on "apple" and on "first", printing each result:
    apple-hay
    irst-fay`,
    hints: [
      'Get the first character with \`word.chars().next()\` (it returns an Option).',
      'Use a slice like \`&word[1..]\` for the rest, and \`format!\` to build the result.',
    ],
    solution: `fn pig_latin(word: &str) -> String {
    let first = word.chars().next().unwrap();
    match first {
        'a' | 'e' | 'i' | 'o' | 'u' => format!("{}-hay", word),
        _ => format!("{}-{}ay", &word[1..], first),
    }
}

fn main() {
    println!("{}", pig_latin("apple"));
    println!("{}", pig_latin("first"));
}`,
    starter: `fn pig_latin(word: &str) -> String {
    // TODO: translate the word to pig latin
}

fn main() {
    println!("{}", pig_latin("apple"));
    println!("{}", pig_latin("first"));
}`,
    tags: ['string', 'format', 'slice'],
  },
  {
    id: 'rs-ch08-c-035',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'List Statistics Tool',
    prompt: `Write a small stats tool over \`let data = vec![4, 8, 15, 16, 23, 42];\`. Compute and print four lines:
- the count of elements
- the sum (loop and accumulate)
- the minimum (loop, do not use built-in min)
- the maximum (loop, do not use built-in max)

Expected output:
    count: 6
    sum: 108
    min: 4
    max: 42`,
    hints: [
      'Get the count with \`data.len()\`.',
      'Use one or more loops, starting min and max at the first element.',
    ],
    solution: `fn main() {
    let data = vec![4, 8, 15, 16, 23, 42];
    let count = data.len();
    let mut sum = 0;
    let mut min = data[0];
    let mut max = data[0];
    for &n in &data {
        sum += n;
        if n < min {
            min = n;
        }
        if n > max {
            max = n;
        }
    }
    println!("count: {}", count);
    println!("sum: {}", sum);
    println!("min: {}", min);
    println!("max: {}", max);
}`,
    starter: `fn main() {
    let data = vec![4, 8, 15, 16, 23, 42];
    // TODO: print count, sum, min, and max
}`,
    tags: ['vec', 'iteration', 'stats'],
  },
]

export default problems
