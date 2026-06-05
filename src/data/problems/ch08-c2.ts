import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch08-c-036',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build a Vec With the vec! Macro',
    prompt: `In main, create a Vec of i32 holding the values 10, 20, and 30 using the vec! macro. Then print the whole vector with the debug formatter so the output is exactly:
[10, 20, 30]`,
    hints: [
      'The vec! macro lets you initialize a vector with values: vec![a, b, c].',
      'Use the debug placeholder to print a whole vector.',
    ],
    solution: `fn main() {
    let v: Vec<i32> = vec![10, 20, 30];
    println!("{:?}", v);
}`,
    starter: `fn main() {
    // TODO: build a Vec<i32> of 10, 20, 30 with vec! and print it with {:?}
}`,
    tags: ['vec', 'macros'],
  },
  {
    id: 'rs-ch08-c-037',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Grow a Vec With push',
    prompt: `Create an empty, mutable Vec<i32>, then push the numbers 1 through 5 onto it (you may use a loop or five push calls). Print the final vector with the debug formatter. Expected output:
[1, 2, 3, 4, 5]`,
    hints: [
      'Vec::new() makes an empty vector; the binding must be mut to push.',
      'A for n in 1..=5 loop can push each value.',
    ],
    solution: `fn main() {
    let mut v: Vec<i32> = Vec::new();
    for n in 1..=5 {
        v.push(n);
    }
    println!("{:?}", v);
}`,
    starter: `fn main() {
    let mut v: Vec<i32> = Vec::new();
    // TODO: push 1..=5 onto v, then print it
}`,
    tags: ['vec', 'push'],
  },
  {
    id: 'rs-ch08-c-038',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Index Into a Vector',
    prompt: `Given the vector vec![5, 15, 25, 35], use indexing syntax (square brackets) to read the third element and bind it to a variable named third. Print it as:
third = 25`,
    hints: [
      'Indexing starts at 0, so the third element is at index 2.',
      'let third = &v[2]; gives you a reference; you can also copy the i32.',
    ],
    solution: `fn main() {
    let v = vec![5, 15, 25, 35];
    let third = v[2];
    println!("third = {}", third);
}`,
    starter: `fn main() {
    let v = vec![5, 15, 25, 35];
    // TODO: read index 2 into a variable named third and print it
}`,
    tags: ['vec', 'indexing'],
  },
  {
    id: 'rs-ch08-c-039',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Safe Access With get',
    prompt: `Write a function nth(v: &Vec<i32>, i: usize) -> i32 that returns the element at index i if it exists, or -1 if the index is out of bounds. Use the get method (which returns an Option) and match on its result. In main, call nth with the vector vec![100, 200, 300] for indices 1 and 9 and print both results, each on its own line.`,
    hints: [
      'v.get(i) returns Option, with Some(value) or None.',
      'match on the Option: Some(x) => *x, None => -1.',
    ],
    solution: `fn nth(v: &Vec<i32>, i: usize) -> i32 {
    match v.get(i) {
        Some(x) => *x,
        None => -1,
    }
}

fn main() {
    let v = vec![100, 200, 300];
    println!("{}", nth(&v, 1));
    println!("{}", nth(&v, 9));
}`,
    starter: `fn nth(v: &Vec<i32>, i: usize) -> i32 {
    // TODO: use v.get(i) and match
    todo!()
}

fn main() {
    let v = vec![100, 200, 300];
    println!("{}", nth(&v, 1));
    println!("{}", nth(&v, 9));
}`,
    tags: ['vec', 'option', 'get'],
  },
  {
    id: 'rs-ch08-c-040',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum a Vector by Iterating',
    prompt: `Write a function sum_all(v: &Vec<i32>) -> i32 that returns the sum of every element by iterating over the vector with a for loop (do not use the built-in sum method). In main, print the result for vec![4, 8, 15, 16, 23, 42], which should be 108.`,
    hints: [
      'Iterate immutably with for n in v to borrow each element.',
      'Accumulate into a mutable total starting at 0.',
    ],
    solution: `fn sum_all(v: &Vec<i32>) -> i32 {
    let mut total = 0;
    for n in v {
        total += n;
    }
    total
}

fn main() {
    let v = vec![4, 8, 15, 16, 23, 42];
    println!("{}", sum_all(&v));
}`,
    starter: `fn sum_all(v: &Vec<i32>) -> i32 {
    // TODO: loop and accumulate
    todo!()
}

fn main() {
    let v = vec![4, 8, 15, 16, 23, 42];
    println!("{}", sum_all(&v));
}`,
    tags: ['vec', 'iteration'],
  },
  {
    id: 'rs-ch08-c-041',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Double Every Element In Place',
    prompt: `Write a function double_all(v: &mut Vec<i32>) that doubles every element of the vector in place by iterating with a mutable reference. In main, start with vec![1, 2, 3, 4], call double_all, and print the result. Expected output:
[2, 4, 6, 8]`,
    hints: [
      'Iterate with for n in v to get a mutable reference to each element.',
      'Use the dereference operator: *n *= 2;',
    ],
    solution: `fn double_all(v: &mut Vec<i32>) {
    for n in v {
        *n *= 2;
    }
}

fn main() {
    let mut v = vec![1, 2, 3, 4];
    double_all(&mut v);
    println!("{:?}", v);
}`,
    starter: `fn double_all(v: &mut Vec<i32>) {
    // TODO: iterate with a mutable reference and double each element
}

fn main() {
    let mut v = vec![1, 2, 3, 4];
    double_all(&mut v);
    println!("{:?}", v);
}`,
    tags: ['vec', 'mutation', 'iteration'],
  },
  {
    id: 'rs-ch08-c-042',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Values Above a Threshold',
    prompt: `Write a function count_above(v: &Vec<i32>, threshold: i32) -> usize that returns how many elements are strictly greater than threshold. In main, call it with vec![3, 9, 1, 12, 7, 20] and a threshold of 8 and print the count, which should be 3.`,
    hints: [
      'Walk the vector with a for loop and keep a usize counter.',
      'Compare each element against threshold with the greater-than operator.',
    ],
    solution: `fn count_above(v: &Vec<i32>, threshold: i32) -> usize {
    let mut count = 0;
    for &n in v {
        if n > threshold {
            count += 1;
        }
    }
    count
}

fn main() {
    let v = vec![3, 9, 1, 12, 7, 20];
    println!("{}", count_above(&v, 8));
}`,
    starter: `fn count_above(v: &Vec<i32>, threshold: i32) -> usize {
    // TODO: count elements greater than threshold
    todo!()
}

fn main() {
    let v = vec![3, 9, 1, 12, 7, 20];
    println!("{}", count_above(&v, 8));
}`,
    tags: ['vec', 'iteration', 'counting'],
  },
  {
    id: 'rs-ch08-c-043',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find the Largest Element',
    prompt: `Write a function largest(v: &Vec<i32>) -> Option<i32> that returns the maximum element wrapped in Some, or None when the vector is empty. Do not use the built-in max method; compare elements yourself. In main, print the result for vec![7, 2, 99, 40] and for an empty Vec<i32>. Expected output:
Some(99)
None`,
    hints: [
      'Handle the empty case first: if the vector is empty, return None.',
      'Track the best value seen so far while iterating, then wrap it in Some.',
    ],
    solution: `fn largest(v: &Vec<i32>) -> Option<i32> {
    let mut best: Option<i32> = None;
    for &n in v {
        match best {
            None => best = Some(n),
            Some(b) => {
                if n > b {
                    best = Some(n);
                }
            }
        }
    }
    best
}

fn main() {
    let v = vec![7, 2, 99, 40];
    println!("{:?}", largest(&v));
    let empty: Vec<i32> = Vec::new();
    println!("{:?}", largest(&empty));
}`,
    starter: `fn largest(v: &Vec<i32>) -> Option<i32> {
    // TODO: return Some(max) or None for empty
    todo!()
}

fn main() {
    let v = vec![7, 2, 99, 40];
    println!("{:?}", largest(&v));
    let empty: Vec<i32> = Vec::new();
    println!("{:?}", largest(&empty));
}`,
    tags: ['vec', 'option', 'iteration'],
  },
  {
    id: 'rs-ch08-c-044',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mixed-Type Spreadsheet Row With an Enum',
    prompt: `A spreadsheet row can hold integers, floats, and text in the same cells. Define an enum Cell with three variants: Int(i32), Float(f64), and Text(String). Build a Vec<Cell> containing Int(7), Text(String::from("blue")), and Float(2.5). Iterate the vector and print each cell with the debug formatter, one per line. Expected output:
Int(7)
Text("blue")
Float(2.5)`,
    hints: [
      'An enum lets a Vec hold one type while storing mixed payloads.',
      'Derive Debug on the enum so you can print variants with the debug placeholder.',
    ],
    solution: `#[derive(Debug)]
enum Cell {
    Int(i32),
    Float(f64),
    Text(String),
}

fn main() {
    let row = vec![
        Cell::Int(7),
        Cell::Text(String::from("blue")),
        Cell::Float(2.5),
    ];
    for cell in &row {
        println!("{:?}", cell);
    }
}`,
    starter: `#[derive(Debug)]
enum Cell {
    // TODO: Int(i32), Float(f64), Text(String)
}

fn main() {
    // TODO: build a Vec<Cell> and print each entry with {:?}
}`,
    tags: ['vec', 'enum', 'mixed-types'],
  },
  {
    id: 'rs-ch08-c-045',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum Only the Int Cells',
    prompt: `Reuse the enum Cell { Int(i32), Float(f64), Text(String) }. Write a function sum_ints(cells: &Vec<Cell>) -> i32 that adds up the payloads of every Int variant and ignores the rest. In main, call it with a vector containing Int(10), Text(String::from("x")), Int(5), and Float(1.0) and print the result, which should be 15.`,
    hints: [
      'Iterate the vector and match each cell.',
      'Only the Cell::Int(n) arm should add to the total; use a catch-all _ for the rest.',
    ],
    solution: `enum Cell {
    Int(i32),
    Float(f64),
    Text(String),
}

fn sum_ints(cells: &Vec<Cell>) -> i32 {
    let mut total = 0;
    for cell in cells {
        match cell {
            Cell::Int(n) => total += n,
            _ => {}
        }
    }
    total
}

fn main() {
    let cells = vec![
        Cell::Int(10),
        Cell::Text(String::from("x")),
        Cell::Int(5),
        Cell::Float(1.0),
    ];
    println!("{}", sum_ints(&cells));
}`,
    starter: `enum Cell {
    Int(i32),
    Float(f64),
    Text(String),
}

fn sum_ints(cells: &Vec<Cell>) -> i32 {
    // TODO: sum only the Int payloads
    todo!()
}

fn main() {
    let cells = vec![
        Cell::Int(10),
        Cell::Text(String::from("x")),
        Cell::Int(5),
        Cell::Float(1.0),
    ];
    println!("{}", sum_ints(&cells));
}`,
    tags: ['vec', 'enum', 'match'],
  },
  {
    id: 'rs-ch08-c-046',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build a Greeting With format!',
    prompt: `Write a function greet(name: &str, age: u32) -> String that returns a new String like "Hi Sam, you are 30!". Use the format! macro so that name and age are not moved or consumed. In main, call greet("Sam", 30) and print the result.`,
    hints: [
      'format! works like println! but returns a String instead of printing.',
      'It borrows its arguments, so the original values remain usable.',
    ],
    solution: `fn greet(name: &str, age: u32) -> String {
    format!("Hi {}, you are {}!", name, age)
}

fn main() {
    println!("{}", greet("Sam", 30));
}`,
    starter: `fn greet(name: &str, age: u32) -> String {
    // TODO: use format! to build the greeting
    todo!()
}

fn main() {
    println!("{}", greet("Sam", 30));
}`,
    tags: ['string', 'format'],
  },
  {
    id: 'rs-ch08-c-047',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Append With push_str and push',
    prompt: `Start with let mut s = String::from("foo"). Use push_str to append "bar", then use push to append a single exclamation point character. Print the final string, which should be:
foobar!`,
    hints: [
      'push_str takes a string slice and appends it.',
      'push takes a single char, written with single quotes.',
    ],
    solution: `fn main() {
    let mut s = String::from("foo");
    s.push_str("bar");
    s.push('!');
    println!("{}", s);
}`,
    starter: `fn main() {
    let mut s = String::from("foo");
    // TODO: push_str "bar", then push '!'
    println!("{}", s);
}`,
    tags: ['string', 'push'],
  },
  {
    id: 'rs-ch08-c-048',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Concatenate Strings With the Plus Operator',
    prompt: `Given let s1 = String::from("Hello, ") and let s2 = String::from("world!"), use the plus operator to build a new String s3 equal to "Hello, world!". Print s3, then print s2 to confirm s2 is still usable (the plus operator only moves the left operand).`,
    hints: [
      'The plus operator moves s1 but only borrows s2, so write s1 + &s2.',
      'After the addition, s1 is no longer valid but s2 still is.',
    ],
    solution: `fn main() {
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2;
    println!("{}", s3);
    println!("{}", s2);
}`,
    starter: `fn main() {
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    // TODO: build s3 with the + operator, then print s3 and s2
}`,
    tags: ['string', 'concatenation', 'ownership'],
  },
  {
    id: 'rs-ch08-c-049',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Characters Versus Bytes',
    prompt: `The string "héllo" contains an accented letter. Write a program that prints the number of chars and the number of bytes in that string, demonstrating that the two can differ for UTF-8. Use the chars iterator counted by hand (or with a counter) and the len method for bytes. Expected output:
chars: 5
bytes: 6`,
    hints: [
      'Iterate the chars and increment a counter, or count them in a loop.',
      'The len method on a string returns the number of bytes, not characters.',
    ],
    solution: `fn main() {
    let s = "héllo";
    let mut char_count = 0;
    for _c in s.chars() {
        char_count += 1;
    }
    println!("chars: {}", char_count);
    println!("bytes: {}", s.len());
}`,
    starter: `fn main() {
    let s = "héllo";
    // TODO: print the char count and the byte count
}`,
    tags: ['string', 'utf8', 'chars'],
  },
  {
    id: 'rs-ch08-c-050',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reverse the Characters of a String',
    prompt: `Write a function reverse(s: &str) -> String that returns a new String with the characters of s in reverse order. Iterate over chars and prepend or collect them appropriately (without using the rev adapter). In main, call reverse("rust") and print it; the output should be tsur.`,
    hints: [
      'Iterate the chars and build the result so each new char goes in front.',
      'You can push each char onto a temporary Vec<char> and then walk it backwards by index.',
    ],
    solution: `fn reverse(s: &str) -> String {
    let mut chars: Vec<char> = Vec::new();
    for c in s.chars() {
        chars.push(c);
    }
    let mut out = String::new();
    let mut i = chars.len();
    while i > 0 {
        i -= 1;
        out.push(chars[i]);
    }
    out
}

fn main() {
    println!("{}", reverse("rust"));
}`,
    starter: `fn reverse(s: &str) -> String {
    // TODO: build a reversed String
    todo!()
}

fn main() {
    println!("{}", reverse("rust"));
}`,
    tags: ['string', 'chars', 'vec'],
  },
  {
    id: 'rs-ch08-c-051',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Slice the First Word',
    prompt: `Write a function first_word(s: &str) -> &str that returns a string slice of everything up to the first space, or the whole string if there is no space. Use byte iteration with the bytes method and slicing. In main, print first_word("hello there friend") which is hello, and first_word("solo") which is solo.`,
    hints: [
      'Iterate over the bytes with enumerate to find the index of the first space byte.',
      'A space character is the byte literal written with b and a space in single quotes.',
    ],
    solution: `fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[..i];
        }
    }
    &s[..]
}

fn main() {
    println!("{}", first_word("hello there friend"));
    println!("{}", first_word("solo"));
}`,
    starter: `fn first_word(s: &str) -> &str {
    // TODO: return the slice up to the first space
    todo!()
}

fn main() {
    println!("{}", first_word("hello there friend"));
    println!("{}", first_word("solo"));
}`,
    tags: ['string', 'slices', 'bytes'],
  },
  {
    id: 'rs-ch08-c-052',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Join Words With a Separator',
    prompt: `Write a function join_words(words: &Vec<String>, sep: &str) -> String that joins the words with sep between them (no leading or trailing separator). Do not use the built-in join method; build the result yourself. In main, call it with vec!["a", "b", "c"] (as Strings) and "-" and print the result, which should be a-b-c.`,
    hints: [
      'Track whether you are on the first word so you only add the separator before later words.',
      'Use push_str to append each word and the separator.',
    ],
    solution: `fn join_words(words: &Vec<String>, sep: &str) -> String {
    let mut out = String::new();
    let mut first = true;
    for w in words {
        if !first {
            out.push_str(sep);
        }
        out.push_str(w);
        first = false;
    }
    out
}

fn main() {
    let words = vec![
        String::from("a"),
        String::from("b"),
        String::from("c"),
    ];
    println!("{}", join_words(&words, "-"));
}`,
    starter: `fn join_words(words: &Vec<String>, sep: &str) -> String {
    // TODO: join words with sep between them
    todo!()
}

fn main() {
    let words = vec![
        String::from("a"),
        String::from("b"),
        String::from("c"),
    ];
    println!("{}", join_words(&words, "-"));
}`,
    tags: ['string', 'vec', 'push_str'],
  },
  {
    id: 'rs-ch08-c-053',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Insert and Look Up in a HashMap',
    prompt: `Create a HashMap<String, i32> that maps team names to scores. Insert "Blue" with 10 and "Yellow" with 50. Then look up "Blue" with the get method and print the score. Remember to bring HashMap into scope. Expected output:
Blue: 10`,
    hints: [
      'Import with use std::collections::HashMap; at the top of the file.',
      'get returns an Option; match or use if let to read the value.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    match scores.get("Blue") {
        Some(s) => println!("Blue: {}", s),
        None => println!("Blue: not found"),
    }
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();
    // TODO: insert two teams, then look up "Blue"
}`,
    tags: ['hashmap', 'insert', 'get'],
  },
  {
    id: 'rs-ch08-c-054',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'HashMap Takes Ownership of String Keys',
    prompt: `Show that a HashMap with String keys takes ownership. Create a String field_name = String::from("color") and a String field_value = String::from("blue"). Insert them into a HashMap<String, String>, then print the map with the debug formatter. (After inserting, the original variables are moved and no longer usable.) The output should contain "color": "blue".`,
    hints: [
      'Insert moves owned values into the map, so the bindings cannot be used afterward.',
      'Print the whole map with the debug placeholder.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let field_name = String::from("color");
    let field_value = String::from("blue");

    let mut map: HashMap<String, String> = HashMap::new();
    map.insert(field_name, field_value);

    println!("{:?}", map);
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let field_name = String::from("color");
    let field_value = String::from("blue");
    // TODO: insert into a HashMap and print it; the originals are now moved
}`,
    tags: ['hashmap', 'ownership'],
  },
  {
    id: 'rs-ch08-c-055',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum All Values in a HashMap',
    prompt: `Write a function total(map: &HashMap<String, i32>) -> i32 that returns the sum of all the values by iterating over the map. In main, build a map with "a" => 3, "b" => 7, "c" => 10 and print the total, which should be 20.`,
    hints: [
      'Iterate with for (key, value) in map to borrow each pair.',
      'You only need the values; accumulate them into a total.',
    ],
    solution: `use std::collections::HashMap;

fn total(map: &HashMap<String, i32>) -> i32 {
    let mut sum = 0;
    for (_key, value) in map {
        sum += value;
    }
    sum
}

fn main() {
    let mut map: HashMap<String, i32> = HashMap::new();
    map.insert(String::from("a"), 3);
    map.insert(String::from("b"), 7);
    map.insert(String::from("c"), 10);
    println!("{}", total(&map));
}`,
    starter: `use std::collections::HashMap;

fn total(map: &HashMap<String, i32>) -> i32 {
    // TODO: sum all values
    todo!()
}

fn main() {
    let mut map: HashMap<String, i32> = HashMap::new();
    map.insert(String::from("a"), 3);
    map.insert(String::from("b"), 7);
    map.insert(String::from("c"), 10);
    println!("{}", total(&map));
}`,
    tags: ['hashmap', 'iteration'],
  },
  {
    id: 'rs-ch08-c-056',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Overwrite Versus Keep With entry',
    prompt: `Demonstrate the difference between insert (which overwrites) and entry/or_insert (which only inserts when absent). Create a HashMap<String, i32>. Insert "Blue" => 10. Then insert "Blue" => 25 with plain insert (overwriting). Then use entry on "Blue" with or_insert(99) and on "Red" with or_insert(50). Print the map's "Blue" and "Red" values. Expected output:
Blue: 25
Red: 50`,
    hints: [
      'A second plain insert with the same key replaces the old value.',
      'entry(key).or_insert(v) only sets v when the key is missing, so Blue stays 25.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let mut map: HashMap<String, i32> = HashMap::new();
    map.insert(String::from("Blue"), 10);
    map.insert(String::from("Blue"), 25);

    map.entry(String::from("Blue")).or_insert(99);
    map.entry(String::from("Red")).or_insert(50);

    println!("Blue: {}", map["Blue"]);
    println!("Red: {}", map["Red"]);
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let mut map: HashMap<String, i32> = HashMap::new();
    // TODO: overwrite Blue with insert, then use entry/or_insert for Blue and Red
}`,
    tags: ['hashmap', 'entry', 'overwrite'],
  },
  {
    id: 'rs-ch08-c-057',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Word Count With entry().or_insert()',
    prompt: `Write a function word_count(text: &str) -> HashMap<String, i32> that counts how many times each whitespace-separated word appears. Use split_whitespace to get words and the entry/or_insert pattern to update counts. In main, call it on "the cat the dog the cat" and print the count for "the" and "cat". Expected output:
the: 3
cat: 2`,
    hints: [
      'split_whitespace yields each word as a string slice.',
      'For each word, do *map.entry(word.to_string()).or_insert(0) += 1;',
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
    let counts = word_count("the cat the dog the cat");
    println!("the: {}", counts["the"]);
    println!("cat: {}", counts["cat"]);
}`,
    starter: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, i32> {
    // TODO: count words using entry().or_insert()
    todo!()
}

fn main() {
    let counts = word_count("the cat the dog the cat");
    println!("the: {}", counts["the"]);
    println!("cat: {}", counts["cat"]);
}`,
    tags: ['hashmap', 'entry', 'word-count'],
  },
  {
    id: 'rs-ch08-c-058',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Tally Letters With a Char-Keyed Map',
    prompt: `Write a function letter_counts(s: &str) -> HashMap<char, i32> that counts how many times each character appears in s. Iterate over chars and update a HashMap<char, i32> with entry/or_insert. In main, call it on "banana" and print the counts for 'a' and 'n'. Expected output:
a: 3
n: 2`,
    hints: [
      'A HashMap key can be a char, not just a String.',
      'Use *map.entry(c).or_insert(0) += 1; inside the chars loop.',
    ],
    solution: `use std::collections::HashMap;

fn letter_counts(s: &str) -> HashMap<char, i32> {
    let mut map: HashMap<char, i32> = HashMap::new();
    for c in s.chars() {
        *map.entry(c).or_insert(0) += 1;
    }
    map
}

fn main() {
    let counts = letter_counts("banana");
    println!("a: {}", counts[&'a']);
    println!("n: {}", counts[&'n']);
}`,
    starter: `use std::collections::HashMap;

fn letter_counts(s: &str) -> HashMap<char, i32> {
    // TODO: tally each char
    todo!()
}

fn main() {
    let counts = letter_counts("banana");
    println!("a: {}", counts[&'a']);
    println!("n: {}", counts[&'n']);
}`,
    tags: ['hashmap', 'chars', 'entry'],
  },
  {
    id: 'rs-ch08-c-059',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Remove Duplicates Preserving Order',
    prompt: `Write a function dedup(v: &Vec<i32>) -> Vec<i32> that returns a new vector with duplicates removed, keeping the first occurrence of each value in its original order. Use a helper Vec or a HashSet-free approach: track seen values yourself. In main, print dedup of vec![3, 1, 3, 2, 1, 4]. Expected output:
[3, 1, 2, 4]`,
    hints: [
      'Build a result Vec and, before pushing, check whether the value is already present.',
      'You can write a small inner loop to test membership in the result vector.',
    ],
    solution: `fn dedup(v: &Vec<i32>) -> Vec<i32> {
    let mut out: Vec<i32> = Vec::new();
    for &n in v {
        let mut seen = false;
        for &m in &out {
            if m == n {
                seen = true;
            }
        }
        if !seen {
            out.push(n);
        }
    }
    out
}

fn main() {
    let v = vec![3, 1, 3, 2, 1, 4];
    println!("{:?}", dedup(&v));
}`,
    starter: `fn dedup(v: &Vec<i32>) -> Vec<i32> {
    // TODO: keep the first occurrence of each value
    todo!()
}

fn main() {
    let v = vec![3, 1, 3, 2, 1, 4];
    println!("{:?}", dedup(&v));
}`,
    tags: ['vec', 'dedup', 'iteration'],
  },
  {
    id: 'rs-ch08-c-060',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Capitalize the First Letter of Each Word',
    prompt: `Write a function title_case(s: &str) -> String that uppercases the first character of each whitespace-separated word and leaves the rest unchanged, rejoining words with single spaces. In main, call it on "hello rust world" and print the result, which should be Hello Rust World.`,
    hints: [
      'split_whitespace gives you each word; process the chars of each one.',
      'For the first char use to_uppercase (it yields chars you can push); append the remaining chars as-is.',
    ],
    solution: `fn title_case(s: &str) -> String {
    let mut out = String::new();
    let mut first_word = true;
    for word in s.split_whitespace() {
        if !first_word {
            out.push(' ');
        }
        first_word = false;
        let mut chars = word.chars();
        if let Some(first) = chars.next() {
            for up in first.to_uppercase() {
                out.push(up);
            }
            for c in chars {
                out.push(c);
            }
        }
    }
    out
}

fn main() {
    println!("{}", title_case("hello rust world"));
}`,
    starter: `fn title_case(s: &str) -> String {
    // TODO: uppercase the first letter of each word
    todo!()
}

fn main() {
    println!("{}", title_case("hello rust world"));
}`,
    tags: ['string', 'chars', 'case'],
  },
  {
    id: 'rs-ch08-c-061',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Group Numbers Into Even and Odd Buckets',
    prompt: `Write a function bucket(v: &Vec<i32>) -> HashMap<String, Vec<i32>> that returns a map with keys "even" and "odd", each mapping to a Vec of the matching numbers (in original order). Use entry/or_insert to create the buckets. In main, call it with vec![1, 2, 3, 4, 5, 6] and print the even bucket and the odd bucket with the debug formatter. Expected output:
even: [2, 4, 6]
odd: [1, 3, 5]`,
    hints: [
      'The value type is Vec<i32>; or_insert(Vec::new()) creates an empty bucket.',
      'entry(key).or_insert(Vec::new()) returns a mutable reference you can push onto.',
    ],
    solution: `use std::collections::HashMap;

fn bucket(v: &Vec<i32>) -> HashMap<String, Vec<i32>> {
    let mut map: HashMap<String, Vec<i32>> = HashMap::new();
    for &n in v {
        let key = if n % 2 == 0 {
            String::from("even")
        } else {
            String::from("odd")
        };
        map.entry(key).or_insert(Vec::new()).push(n);
    }
    map
}

fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    let map = bucket(&v);
    println!("even: {:?}", map["even"]);
    println!("odd: {:?}", map["odd"]);
}`,
    starter: `use std::collections::HashMap;

fn bucket(v: &Vec<i32>) -> HashMap<String, Vec<i32>> {
    // TODO: push each number into the "even" or "odd" Vec
    todo!()
}

fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    let map = bucket(&v);
    println!("even: {:?}", map["even"]);
    println!("odd: {:?}", map["odd"]);
}`,
    tags: ['hashmap', 'vec', 'entry'],
  },
  {
    id: 'rs-ch08-c-062',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Median of a List of Integers',
    prompt: `Write a function median(v: &Vec<i32>) -> Option<f64> that returns the median of the numbers, or None if the vector is empty. Sort a copy of the data; for an odd length return the middle element as f64, and for an even length return the average of the two middle elements as f64. In main, print the median of vec![3, 1, 4, 1, 5] and of vec![10, 20, 30, 40]. Expected output:
Some(3.0)
Some(25.0)`,
    hints: [
      'Clone the vector so you can sort without changing the caller data; the sort method works on Vec<i32>.',
      'For even length n, average elements at indices n/2 - 1 and n/2; cast to f64 before dividing.',
    ],
    solution: `fn median(v: &Vec<i32>) -> Option<f64> {
    if v.is_empty() {
        return None;
    }
    let mut sorted = v.clone();
    sorted.sort();
    let n = sorted.len();
    if n % 2 == 1 {
        Some(sorted[n / 2] as f64)
    } else {
        let a = sorted[n / 2 - 1] as f64;
        let b = sorted[n / 2] as f64;
        Some((a + b) / 2.0)
    }
}

fn main() {
    println!("{:?}", median(&vec![3, 1, 4, 1, 5]));
    println!("{:?}", median(&vec![10, 20, 30, 40]));
}`,
    starter: `fn median(v: &Vec<i32>) -> Option<f64> {
    // TODO: sort a copy, then return the middle (or average of two middles)
    todo!()
}

fn main() {
    println!("{:?}", median(&vec![3, 1, 4, 1, 5]));
    println!("{:?}", median(&vec![10, 20, 30, 40]));
}`,
    tags: ['vec', 'median', 'sorting'],
  },
  {
    id: 'rs-ch08-c-063',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Mode of a List of Integers',
    prompt: `Write a function mode(v: &Vec<i32>) -> Option<i32> that returns the value that appears most often, or None if the vector is empty. Count occurrences with a HashMap<i32, i32>, then scan the map for the key with the highest count. If there is a tie, returning any one of the tied values is acceptable. In main, print the mode of vec![1, 2, 2, 3, 3, 3, 4], which should be Some(3).`,
    hints: [
      'Build counts with entry/or_insert keyed by the number.',
      'Iterate the map tracking the best (value, count) pair seen so far.',
    ],
    solution: `use std::collections::HashMap;

fn mode(v: &Vec<i32>) -> Option<i32> {
    if v.is_empty() {
        return None;
    }
    let mut counts: HashMap<i32, i32> = HashMap::new();
    for &n in v {
        *counts.entry(n).or_insert(0) += 1;
    }
    let mut best_value = 0;
    let mut best_count = -1;
    for (&value, &count) in &counts {
        if count > best_count {
            best_count = count;
            best_value = value;
        }
    }
    Some(best_value)
}

fn main() {
    println!("{:?}", mode(&vec![1, 2, 2, 3, 3, 3, 4]));
}`,
    starter: `use std::collections::HashMap;

fn mode(v: &Vec<i32>) -> Option<i32> {
    // TODO: count with a HashMap, then return the most frequent value
    todo!()
}

fn main() {
    println!("{:?}", mode(&vec![1, 2, 2, 3, 3, 3, 4]));
}`,
    tags: ['hashmap', 'mode', 'counting'],
  },
  {
    id: 'rs-ch08-c-064',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pig Latin Translator',
    prompt: `Write a function pig_latin(word: &str) -> String following these rules: if the word starts with a vowel (a, e, i, o, u), append "-hay"; otherwise move the first consonant to the end and append "ay" with a hyphen, like "first" becomes "irst-fay". Assume ASCII lowercase input. In main, print pig_latin("apple") and pig_latin("first"). Expected output:
apple-hay
irst-fay`,
    hints: [
      'Get the first char with the chars iterator next method and check if it is a vowel.',
      'For a consonant, slice the rest of the word with a byte index and use format! to assemble the result.',
    ],
    solution: `fn pig_latin(word: &str) -> String {
    let mut chars = word.chars();
    let first = match chars.next() {
        Some(c) => c,
        None => return String::new(),
    };
    let is_vowel = first == 'a' || first == 'e' || first == 'i' || first == 'o' || first == 'u';
    if is_vowel {
        format!("{}-hay", word)
    } else {
        let rest = &word[1..];
        format!("{}-{}ay", rest, first)
    }
}

fn main() {
    println!("{}", pig_latin("apple"));
    println!("{}", pig_latin("first"));
}`,
    starter: `fn pig_latin(word: &str) -> String {
    // TODO: vowel words get "-hay"; consonant words move the first letter and add "ay"
    todo!()
}

fn main() {
    println!("{}", pig_latin("apple"));
    println!("{}", pig_latin("first"));
}`,
    tags: ['string', 'pig-latin', 'format'],
  },
  {
    id: 'rs-ch08-c-065',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pig Latin for a Whole Sentence',
    prompt: `Extend pig latin to a sentence. Write a function pig_latin_sentence(s: &str) -> String that applies the pig latin rules (vowel start gets "-hay"; otherwise move the first consonant and add "ay") to each whitespace-separated word and rejoins them with single spaces. Assume ASCII lowercase input. In main, print pig_latin_sentence("the quick fox") which should be:
he-tay uick-qay ox-fay`,
    hints: [
      'Write a helper for a single word, then loop over split_whitespace.',
      'Track whether you are on the first word so you only add a space between words.',
    ],
    solution: `fn pig_latin_word(word: &str) -> String {
    let mut chars = word.chars();
    let first = match chars.next() {
        Some(c) => c,
        None => return String::new(),
    };
    let is_vowel = first == 'a' || first == 'e' || first == 'i' || first == 'o' || first == 'u';
    if is_vowel {
        format!("{}-hay", word)
    } else {
        let rest = &word[1..];
        format!("{}-{}ay", rest, first)
    }
}

fn pig_latin_sentence(s: &str) -> String {
    let mut out = String::new();
    let mut first = true;
    for word in s.split_whitespace() {
        if !first {
            out.push(' ');
        }
        first = false;
        out.push_str(&pig_latin_word(word));
    }
    out
}

fn main() {
    println!("{}", pig_latin_sentence("the quick fox"));
}`,
    starter: `fn pig_latin_word(word: &str) -> String {
    // TODO: translate a single word
    todo!()
}

fn pig_latin_sentence(s: &str) -> String {
    // TODO: translate each word and rejoin with spaces
    todo!()
}

fn main() {
    println!("{}", pig_latin_sentence("the quick fox"));
}`,
    tags: ['string', 'pig-latin', 'iteration'],
  },
  {
    id: 'rs-ch08-c-066',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Stats Tool: Mean, Median, and Mode',
    prompt: `Build a small stats tool. Write three functions over &Vec<i32>: mean returning f64 (the average), median returning f64, and mode returning i32. You may assume the input is non-empty. In main, run them on vec![1, 2, 2, 3, 4] and print:
mean: 2.4
median: 2
mode: 2
The median for an odd-length list is the middle value after sorting; print it as a whole-number f64 here (2 prints as 2 with the default float formatter when it has no fraction, so just cast the middle element to f64).`,
    hints: [
      'mean: sum the values as i32, cast to f64, divide by length cast to f64.',
      'median: sort a clone and take the middle element; mode: count with a HashMap and pick the highest.',
    ],
    solution: `use std::collections::HashMap;

fn mean(v: &Vec<i32>) -> f64 {
    let mut sum = 0;
    for &n in v {
        sum += n;
    }
    sum as f64 / v.len() as f64
}

fn median(v: &Vec<i32>) -> f64 {
    let mut sorted = v.clone();
    sorted.sort();
    let mid = sorted.len() / 2;
    sorted[mid] as f64
}

fn mode(v: &Vec<i32>) -> i32 {
    let mut counts: HashMap<i32, i32> = HashMap::new();
    for &n in v {
        *counts.entry(n).or_insert(0) += 1;
    }
    let mut best_value = 0;
    let mut best_count = -1;
    for (&value, &count) in &counts {
        if count > best_count {
            best_count = count;
            best_value = value;
        }
    }
    best_value
}

fn main() {
    let v = vec![1, 2, 2, 3, 4];
    println!("mean: {}", mean(&v));
    println!("median: {}", median(&v));
    println!("mode: {}", mode(&v));
}`,
    starter: `use std::collections::HashMap;

fn mean(v: &Vec<i32>) -> f64 {
    todo!()
}

fn median(v: &Vec<i32>) -> f64 {
    todo!()
}

fn mode(v: &Vec<i32>) -> i32 {
    todo!()
}

fn main() {
    let v = vec![1, 2, 2, 3, 4];
    println!("mean: {}", mean(&v));
    println!("median: {}", median(&v));
    println!("mode: {}", mode(&v));
}`,
    tags: ['vec', 'hashmap', 'stats'],
  },
  {
    id: 'rs-ch08-c-067',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Most Frequent Word in a Paragraph',
    prompt: `Write a function top_word(text: &str) -> Option<String> that returns the whitespace-separated word that appears most often, wrapped in Some, or None if the text has no words. Count with a HashMap<String, i32>, then scan for the highest count (any winner is fine on a tie). In main, print top_word("a b a c a b"), which should be Some("a").`,
    hints: [
      'Use split_whitespace and entry/or_insert to count words.',
      'After counting, iterate the map to find the key with the largest value; clone that key into the returned String.',
    ],
    solution: `use std::collections::HashMap;

fn top_word(text: &str) -> Option<String> {
    let mut counts: HashMap<String, i32> = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_string()).or_insert(0) += 1;
    }
    let mut best: Option<String> = None;
    let mut best_count = 0;
    for (word, &count) in &counts {
        if count > best_count {
            best_count = count;
            best = Some(word.clone());
        }
    }
    best
}

fn main() {
    println!("{:?}", top_word("a b a c a b"));
}`,
    starter: `use std::collections::HashMap;

fn top_word(text: &str) -> Option<String> {
    // TODO: count words, then return the most frequent one
    todo!()
}

fn main() {
    println!("{:?}", top_word("a b a c a b"));
}`,
    tags: ['hashmap', 'string', 'word-count'],
  },
  {
    id: 'rs-ch08-c-068',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Running Department Roster Commands',
    prompt: `Build a tiny text-interface tool. Given a Vec<&str> of commands like "Add Sally to Engineering" and "Add Amir to Sales", maintain a HashMap<String, Vec<String>> from department to a list of employees. Write a function build_roster(commands: &Vec<&str>) -> HashMap<String, Vec<String>>. Parse each command by splitting on whitespace: word 0 is "Add", word 1 is the name, word 2 is "to", word 3 is the department. In main, process ["Add Sally to Engineering", "Add Amir to Sales", "Add Bob to Engineering"] and print Engineering and Sales rosters with the debug formatter. Expected output:
Engineering: ["Sally", "Bob"]
Sales: ["Amir"]`,
    hints: [
      'Collect the words of each command into a Vec<&str> so you can index them.',
      'Use entry(dept).or_insert(Vec::new()).push(name) to add to the right department.',
    ],
    solution: `use std::collections::HashMap;

fn build_roster(commands: &Vec<&str>) -> HashMap<String, Vec<String>> {
    let mut roster: HashMap<String, Vec<String>> = HashMap::new();
    for command in commands {
        let parts: Vec<&str> = command.split_whitespace().collect();
        if parts.len() == 4 && parts[0] == "Add" && parts[2] == "to" {
            let name = parts[1].to_string();
            let dept = parts[3].to_string();
            roster.entry(dept).or_insert(Vec::new()).push(name);
        }
    }
    roster
}

fn main() {
    let commands = vec![
        "Add Sally to Engineering",
        "Add Amir to Sales",
        "Add Bob to Engineering",
    ];
    let roster = build_roster(&commands);
    println!("Engineering: {:?}", roster["Engineering"]);
    println!("Sales: {:?}", roster["Sales"]);
}`,
    starter: `use std::collections::HashMap;

fn build_roster(commands: &Vec<&str>) -> HashMap<String, Vec<String>> {
    // TODO: parse "Add NAME to DEPT" and group names by department
    todo!()
}

fn main() {
    let commands = vec![
        "Add Sally to Engineering",
        "Add Amir to Sales",
        "Add Bob to Engineering",
    ];
    let roster = build_roster(&commands);
    println!("Engineering: {:?}", roster["Engineering"]);
    println!("Sales: {:?}", roster["Sales"]);
}`,
    tags: ['hashmap', 'vec', 'parsing'],
  },
  {
    id: 'rs-ch08-c-069',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sorted Department Roster Report',
    prompt: `Continuing the roster idea, write a function alphabetical_department(roster: &HashMap<String, Vec<String>>, dept: &str) -> Vec<String> that returns the employees in the given department sorted alphabetically (a new sorted Vec, not modifying the map). If the department is missing, return an empty Vec. In main, build a roster where Engineering has ["Sally", "Bob", "Amir"], call the function for "Engineering", and print the result. Expected output:
["Amir", "Bob", "Sally"]`,
    hints: [
      'Look up the department with get, which returns Option<&Vec<String>>.',
      'Clone the found vector, call sort on the clone, and return it; on None return Vec::new().',
    ],
    solution: `use std::collections::HashMap;

fn alphabetical_department(roster: &HashMap<String, Vec<String>>, dept: &str) -> Vec<String> {
    match roster.get(dept) {
        Some(people) => {
            let mut sorted = people.clone();
            sorted.sort();
            sorted
        }
        None => Vec::new(),
    }
}

fn main() {
    let mut roster: HashMap<String, Vec<String>> = HashMap::new();
    roster.insert(
        String::from("Engineering"),
        vec![
            String::from("Sally"),
            String::from("Bob"),
            String::from("Amir"),
        ],
    );
    println!("{:?}", alphabetical_department(&roster, "Engineering"));
}`,
    starter: `use std::collections::HashMap;

fn alphabetical_department(roster: &HashMap<String, Vec<String>>, dept: &str) -> Vec<String> {
    // TODO: return a sorted clone of the department's people, or an empty Vec
    todo!()
}

fn main() {
    let mut roster: HashMap<String, Vec<String>> = HashMap::new();
    roster.insert(
        String::from("Engineering"),
        vec![
            String::from("Sally"),
            String::from("Bob"),
            String::from("Amir"),
        ],
    );
    println!("{:?}", alphabetical_department(&roster, "Engineering"));
}`,
    tags: ['hashmap', 'vec', 'sorting'],
  },
  {
    id: 'rs-ch08-c-070',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Inventory Ledger With Add and Remove',
    prompt: `Build an inventory ledger that processes a list of transactions. Each transaction is a tuple (String, i32) meaning an item name and a signed quantity (positive adds stock, negative removes it). Write a function apply_ledger(transactions: &Vec<(String, i32)>) -> HashMap<String, i32> that returns final quantities, summing all deltas per item with entry/or_insert, and updating each value from its old value. In main, process [("apple", 5), ("banana", 3), ("apple", -2), ("banana", 4)] and print the final apple and banana counts. Expected output:
apple: 3
banana: 7`,
    hints: [
      'For each transaction, get a mutable reference with entry(name).or_insert(0).',
      'Add the delta to the existing value: *count += delta;',
    ],
    solution: `use std::collections::HashMap;

fn apply_ledger(transactions: &Vec<(String, i32)>) -> HashMap<String, i32> {
    let mut inventory: HashMap<String, i32> = HashMap::new();
    for (name, delta) in transactions {
        let count = inventory.entry(name.clone()).or_insert(0);
        *count += delta;
    }
    inventory
}

fn main() {
    let transactions = vec![
        (String::from("apple"), 5),
        (String::from("banana"), 3),
        (String::from("apple"), -2),
        (String::from("banana"), 4),
    ];
    let inventory = apply_ledger(&transactions);
    println!("apple: {}", inventory["apple"]);
    println!("banana: {}", inventory["banana"]);
}`,
    starter: `use std::collections::HashMap;

fn apply_ledger(transactions: &Vec<(String, i32)>) -> HashMap<String, i32> {
    // TODO: sum signed quantities per item, updating from the old value
    todo!()
}

fn main() {
    let transactions = vec![
        (String::from("apple"), 5),
        (String::from("banana"), 3),
        (String::from("apple"), -2),
        (String::from("banana"), 4),
    ];
    let inventory = apply_ledger(&transactions);
    println!("apple: {}", inventory["apple"]);
    println!("banana: {}", inventory["banana"]);
}`,
    tags: ['hashmap', 'entry', 'update'],
  },
]

export default problems
