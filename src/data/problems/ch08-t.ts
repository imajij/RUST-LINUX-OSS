import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch08-t-001',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Two Ways to Create an Empty Vector',
    prompt: `You want to start with an empty vector that will eventually hold i32 values. Show the two common ways to create it: one using Vec::new with a type annotation, and one using the vec! macro with initial values. Explain why the Vec::new form needs a type annotation while a vec! call with numbers in it usually does not.`,
    hints: [
      'An empty Vec gives the compiler no values to infer the element type from.',
      'The vec! macro can see the literals you put inside the brackets.',
    ],
    solution: `You can write let v: Vec<i32> = Vec::new(); or let v = vec![1, 2, 3];. The Vec::new form creates a completely empty vector, so the compiler has no elements from which to infer the element type and you must annotate it as Vec<i32> (or push a value later that pins the type down). The vec! macro, by contrast, is given concrete values like 1, 2, 3, so the compiler infers the element type from those literals and no annotation is needed. In short, annotations are required only when there is nothing for inference to work with.`,
    tags: ['vec', 'creation'],
  },
  {
    id: 'rs-ch08-t-002',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Strings Cannot Be Indexed by Number',
    prompt: `A teammate coming from Python tries to write let c = s[0] on a Rust String and is surprised it does not compile. Explain in plain words why Rust does not allow indexing a String with an integer position.`,
    hints: [
      'A Rust String is stored as UTF-8 bytes.',
      'One visible character may take more than one byte.',
    ],
    solution: `A Rust String is a sequence of UTF-8 bytes, and in UTF-8 a single character can occupy one, two, three, or four bytes. If s[0] returned a byte it would often be only part of a character, and if it returned a character it could not be a constant-time operation because Rust would have to scan from the start to find character boundaries. To avoid silently returning meaningless or surprising values, Rust simply does not implement integer indexing on String at all. Instead you ask explicitly for bytes, for chars, or for a checked byte-range slice.`,
    tags: ['string', 'utf8', 'indexing'],
  },
  {
    id: 'rs-ch08-t-003',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What a HashMap Stores',
    prompt: `Describe in one or two sentences what a HashMap<K, V> stores and what problem it solves compared to a Vec. Then state how you create a new empty one and how you add the pair "Blue" to 10.`,
    hints: [
      'A Vec is indexed by position; a HashMap is indexed by a key of your choosing.',
      'HashMap lives in the standard library and must be brought into scope.',
    ],
    solution: `A HashMap<K, V> stores key-value pairs and lets you look up a value by an arbitrary key K instead of by a numeric position the way a Vec does, which is ideal when the natural lookup is by something like a name. You create one with use std::collections::HashMap; then let mut scores = HashMap::new();, and you add a pair with scores.insert(String::from("Blue"), 10);. Unlike Vec and String, HashMap is not in the automatic prelude, so it must be imported. The key here is "Blue" and the associated value is 10.`,
    tags: ['hashmap', 'creation'],
  },
  {
    id: 'rs-ch08-t-004',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Three Common Collections at a Glance',
    prompt: `This chapter introduces three collections that store data on the heap: Vec, String, and HashMap. For each one, give a single sentence describing what it holds and a one-word example use case. Then state the one property all three share that arrays and tuples do not.`,
    hints: [
      'Think about whether each collection can grow at runtime.',
      'Arrays and tuples have a size fixed at compile time.',
    ],
    solution: `A Vec<T> holds a growable list of values all of the same type (for example, a list of scores). A String holds growable UTF-8 text (for example, a user's name). A HashMap<K, V> holds key-value pairs looked up by key (for example, a word-count table). The property all three share, which arrays and tuples lack, is that their data lives on the heap and their size can grow or shrink at runtime rather than being fixed when the program is compiled.`,
    tags: ['collections', 'heap'],
  },
  {
    id: 'rs-ch08-t-005',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Index Panic Versus get Returning None',
    prompt: `Given let v = vec![10, 20, 30]; compare what happens at runtime for &v[10] versus v.get(10). Explain the return type difference and when you would deliberately choose each access style.`,
    hints: [
      'One of these accesses crashes the program; the other does not.',
      'get returns an Option you can handle gracefully.',
    ],
    solution: `Writing &v[10] uses the indexing operator, which panics and crashes the program because index 10 is out of bounds for a three-element vector. Writing v.get(10) returns an Option<&i32>, which is None for an out-of-bounds index and Some(&value) for a valid one, so it never panics. You choose indexing when an out-of-range access is a genuine bug that should halt the program, and you choose get when an out-of-range index is expected or comes from user input and you want to handle the missing case gracefully with a match or if let.`,
    tags: ['vec', 'index', 'get'],
  },
  {
    id: 'rs-ch08-t-006',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predict the push-and-Sum Output',
    prompt: `Predict exactly what this prints:

let mut v = Vec::new();
v.push(2);
v.push(4);
v.push(6);
let mut total = 0;
for n in &v {
    total += n;
}
println!("len={} total={}", v.len(), total);

State the printed line and explain why Vec::new needed no type annotation here.`,
    hints: [
      'The first push fixes the element type.',
      'Iterating over &v yields shared references you can read.',
    ],
    solution: `It prints len=3 total=12. The vector ends up holding 2, 4, and 6, so its length is 3 and the running total is 2 + 4 + 6 = 12. No type annotation was needed on Vec::new() because the first v.push(2) supplies an i32 literal, and the compiler uses that to infer the element type as Vec<i32>. Iterating with for n in &v borrows each element as &i32, and total += n adds through that reference, leaving the vector unchanged.`,
    tags: ['vec', 'iteration', 'predict-output'],
  },
  {
    id: 'rs-ch08-t-007',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'push_str Versus push',
    prompt: `You have let mut s = String::from("foo");. Explain the difference between s.push_str("bar") and s.push('!'). What does each method take as its argument, and what is s after running both, in order?`,
    hints: [
      'One appends a whole string slice; the other appends a single character.',
      'Note the quote style of each argument.',
    ],
    solution: `push_str takes a string slice (&str) and appends all of its characters to the String, so s.push_str("bar") makes s equal to "foobar". push takes a single char and appends just that one character, so s.push('!') makes s equal to "foobar!". The double quotes on "bar" mark a string slice while the single quotes on '!' mark a char, which is why the two methods are not interchangeable. After running both in order, s holds "foobar!".`,
    tags: ['string', 'push', 'push_str'],
  },
  {
    id: 'rs-ch08-t-008',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'insert Returns the Old Value',
    prompt: `Consider:

let mut map = HashMap::new();
map.insert("a", 1);
let old = map.insert("a", 5);

What is the value of old, and what does map.get("a") return now? Explain what insert does when the key already exists.`,
    hints: [
      'insert overwrites an existing key.',
      'insert hands back whatever value it replaced, wrapped in an Option.',
    ],
    solution: `When you insert a key that is already present, HashMap overwrites the old value with the new one and returns the previous value wrapped in Some. So the second insert replaces 1 with 5 and old is Some(1), while the first insert (a brand-new key) would have returned None. After both calls, map.get("a") returns Some(&5) because the stored value is now 5. The rule to remember is one key maps to exactly one value, and inserting again simply overwrites.`,
    tags: ['hashmap', 'insert', 'overwrite'],
  },
  {
    id: 'rs-ch08-t-009',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'chars Count Versus len',
    prompt: `For the string let s = String::from("héllo"); where the second character is the accented letter e (a two-byte character in UTF-8), explain what s.len() returns and what s.chars().count() returns. Why are these two numbers different?`,
    hints: [
      'len reports a count of bytes.',
      'chars yields Unicode scalar values, not bytes.',
    ],
    solution: `s.len() returns 6 because len reports the number of bytes in the UTF-8 encoding, and the accented e takes two bytes while the other four ASCII letters take one byte each, giving 2 + 4 = 6. s.chars().count() returns 5 because chars iterates over the Unicode scalar values (the characters a human sees), and there are five of them. The two numbers differ whenever the string contains any non-ASCII character, since those occupy more than one byte. This is exactly why "length" is ambiguous for strings and Rust makes you choose bytes or chars explicitly.`,
    tags: ['string', 'utf8', 'len'],
  },
  {
    id: 'rs-ch08-t-010',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'When to Reach for format!',
    prompt: `You need to combine first, last, and a separator into a full name without consuming any of the inputs. Compare using the plus operator versus the format! macro for this, and explain why format! is usually the cleaner choice when joining several pieces.`,
    hints: [
      'The plus operator takes ownership of its left operand.',
      'format! borrows all its arguments and returns a new String.',
    ],
    solution: `The plus operator (s1 + &s2) takes ownership of its left-hand String and only borrows the right side, so chaining several plus operations gets awkward and moves your first variable away, leaving it unusable. The format! macro instead borrows all of its arguments, leaves every input still usable afterward, and returns a brand-new String, so format!("{} {}", first, last) is far easier to read when joining multiple pieces with separators. Because format! does not consume first or last, you can keep using them later. For anything beyond a single concatenation, format! is the cleaner and more flexible choice.`,
    tags: ['string', 'format', 'concatenation'],
  },
  {
    id: 'rs-ch08-t-011',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Mutating Every Element in Place',
    prompt: `You want to double every number in let mut v = vec![1, 2, 3];. Explain why you must iterate with &mut v rather than &v, and what the dereference operator does in the loop body for n in &mut v { *n *= 2; }.`,
    hints: [
      'A shared reference does not let you modify the value behind it.',
      'The asterisk reaches through the reference to the value.',
    ],
    solution: `Iterating with for n in &v gives shared references &i32, and you cannot assign through a shared reference, so you would not be allowed to change the elements. Iterating with for n in &mut v gives mutable references &mut i32, which do permit modification. Inside the loop, n is a &mut i32, so *n dereferences it to reach the actual i32 value in the vector, and *n *= 2 doubles that value in place. After the loop v holds 2, 4, 6.`,
    tags: ['vec', 'mutation', 'references'],
  },
  {
    id: 'rs-ch08-t-012',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'A Vector of Mixed-Type Cells',
    prompt: `A spreadsheet row needs to hold an integer, a floating-point number, and some text in a single Vec, but Vec requires all elements to be the same type. Explain the standard pattern from this chapter for storing values of different types in one vector, and sketch the enum you would define.`,
    hints: [
      'A Vec can only hold one type, but an enum can have variants holding different data.',
      'Wrap each value in a variant of one enum.',
    ],
    solution: `The standard pattern is to define an enum whose variants each carry a different type, then make a Vec of that single enum type, so every element is technically the same type (the enum) even though the data inside the variants differs. For example: enum Cell { Int(i32), Float(f64), Text(String) }, and then let row = vec![Cell::Int(3), Cell::Float(10.12), Cell::Text(String::from("blue"))];. Because the enum lists all the variants up front, the compiler knows exactly how much memory each element needs and which types are allowed. To read a value back out you match on the variant.`,
    tags: ['vec', 'enum', 'mixed-types'],
  },
  {
    id: 'rs-ch08-t-013',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Iterating a HashMap Has No Fixed Order',
    prompt: `You write a loop for (key, value) in &scores { println!("{key}: {value}"); } over a HashMap and notice the output order changes between runs. Is this a bug? Explain what guarantees a HashMap makes about iteration order, and what you would do if you needed sorted output.`,
    hints: [
      'HashMap stores entries by hash, not by insertion order.',
      'You could collect the pairs and sort them yourself.',
    ],
    solution: `This is not a bug: a HashMap makes no guarantee about iteration order, and the order can differ from run to run and from the order you inserted pairs. Iterating with for (key, value) in &scores borrows each pair, but the sequence you get is whatever the internal hashing produces. If you need a predictable order, you would collect the keys (or pairs) into a Vec and sort that Vec before printing, since sorting is something you control rather than something the map provides. Relying on HashMap iteration order in your logic would be a mistake.`,
    tags: ['hashmap', 'iteration', 'ordering'],
  },
  {
    id: 'rs-ch08-t-014',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why This Borrow After push Fails',
    prompt: `Explain why the following does not compile:

let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4);
println!("first is {first}");

What rule of the borrow checker is being violated, and why does a push on a vector make this dangerous?`,
    hints: [
      'first is an immutable borrow of the vector.',
      'push needs a mutable borrow and may move the buffer.',
    ],
    solution: `The line let first = &v[0] takes an immutable borrow of an element, and that borrow is still alive when println uses first at the end. But v.push(4) needs a mutable borrow of v, and Rust forbids having a mutable borrow at the same time as an outstanding immutable borrow. This rule is not arbitrary here: pushing may exceed the vector's capacity and force it to allocate a new larger buffer, copying the elements and freeing the old buffer, which would leave first pointing at freed memory. The borrow checker rejects the code at compile time precisely to prevent that dangling reference.`,
    tags: ['vec', 'borrowing', 'no-compile'],
  },
  {
    id: 'rs-ch08-t-015',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'or_insert Returns a Mutable Reference',
    prompt: `Word counting is often written as:

let count = map.entry(word).or_insert(0);
*count += 1;

Explain what entry(word).or_insert(0) returns, why the result must be dereferenced with the asterisk, and what or_insert does differently depending on whether the key already exists.`,
    hints: [
      'or_insert gives you access to the value slot itself.',
      'The return type is a mutable reference to the value.',
    ],
    solution: `entry(word).or_insert(0) looks up word in the map: if the key is missing it inserts the value 0 first, and either way it returns a mutable reference (&mut i32) to the value now stored for that key. Because the return is a reference to the value rather than the value itself, you must write *count to dereference it before you can modify the underlying number, so *count += 1 increments the stored count in place. The clever part is that or_insert only inserts when the key is absent; when the key is present it leaves the existing value alone and just hands back a reference to it. This single expression therefore handles both the first occurrence and every later occurrence of a word.`,
    tags: ['hashmap', 'entry', 'word-count'],
  },
  {
    id: 'rs-ch08-t-016',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'HashMap Takes Ownership of Owned Keys',
    prompt: `Explain why this does not compile, and how you would fix it while still being able to read field_name and field_value later:

let field_name = String::from("color");
let field_value = String::from("blue");
let mut map = HashMap::new();
map.insert(field_name, field_value);
println!("{field_name}: {field_value}");`,
    hints: [
      'insert takes the String arguments by value.',
      'A move leaves the original variables invalid.',
    ],
    solution: `Because String is an owned heap type and is not Copy, map.insert(field_name, field_value) moves both Strings into the map, so the map now owns them and the variables field_name and field_value are no longer valid. The println then tries to use the moved-out variables, which the compiler rejects. To fix it while keeping the originals usable, you could insert clones with map.insert(field_name.clone(), field_value.clone());, or restructure so you print before inserting, or store references instead (which then requires the Strings to outlive the map). The underlying rule is that a HashMap owns whatever owned values you put into it.`,
    tags: ['hashmap', 'ownership', 'no-compile'],
  },
  {
    id: 'rs-ch08-t-017',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Predict the Word-Count Totals',
    prompt: `Predict the final value associated with each word after this runs:

let text = "the cat the dog the cat";
let mut map = HashMap::new();
for word in text.split_whitespace() {
    let count = map.entry(word).or_insert(0);
    *count += 1;
}

List each distinct word with its final count, and explain in one sentence why "the" ends up highest.`,
    hints: [
      'split_whitespace yields each space-separated word in order.',
      'Each occurrence increments that word’s slot by one.',
    ],
    solution: `The text splits into the words the, cat, the, dog, the, cat. Counting occurrences gives the = 3, cat = 2, and dog = 1. Each time a word is seen, entry(word).or_insert(0) either creates its counter at 0 or returns the existing one, and *count += 1 bumps it, so the final map holds those three totals. "the" ends up highest simply because it appears three times in the input, more than any other word. The iteration order of the map when printed is unspecified, but the stored counts are these.`,
    tags: ['hashmap', 'word-count', 'predict-output'],
  },
  {
    id: 'rs-ch08-t-018',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Computing the Median Step by Step',
    prompt: `You are asked to return the median of let v = vec![7, 1, 3, 9, 5];. Describe the algorithm using only Vec operations and integer logic available in this chapter: what must you do to the data first, and how do you pick the middle element? Then give the median for this list.`,
    hints: [
      'The median is the middle value of the sorted data.',
      'For an odd-length list the middle index is len / 2.',
    ],
    solution: `The median is defined on sorted data, so first sort the vector in place with v.sort(), turning [7, 1, 3, 9, 5] into [1, 3, 5, 7, 9]. For an odd-length list of length 5 the middle position is index len / 2, which is 5 / 2 = 2 using integer division, and v[2] is 5, so the median is 5. If the list had an even number of elements there would be no single middle element and you would typically average the two central values. For this list the answer is 5.`,
    tags: ['vec', 'sorting', 'median'],
  },
  {
    id: 'rs-ch08-t-019',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Mode With a Frequency HashMap',
    prompt: `The mode is the value that appears most often in a list. Explain how to compute it for a Vec<i32> using a HashMap as a frequency table, and walk through the result for vec![4, 4, 1, 2, 4, 2]. What does the HashMap hold, and which key wins?`,
    hints: [
      'Use the numbers as keys and their counts as values.',
      'After counting, scan for the key with the largest value.',
    ],
    solution: `You build a HashMap whose keys are the numbers from the list and whose values are how many times each number appears, using map.entry(n).or_insert(0) followed by incrementing for every element. For vec![4, 4, 1, 2, 4, 2] the resulting map holds 4 -> 3, 1 -> 1, and 2 -> 2. To find the mode you then iterate over the map and keep track of the key whose count is largest, which here is 4 with a count of 3. So the mode is 4. This is the same counting pattern as word counting, just over integers instead of words.`,
    tags: ['hashmap', 'mode', 'frequency'],
  },
  {
    id: 'rs-ch08-t-020',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Slicing a String Can Panic',
    prompt: `Given let s = String::from("héllo"); where the accented e occupies bytes at index 1 and 2, explain what &s[0..1] yields and why &s[0..2] would panic at runtime. What rule must a string byte-range slice obey?`,
    hints: [
      'String slices are ranges of bytes, not characters.',
      'A slice boundary must land on a character boundary.',
    ],
    solution: `A string slice &s[start..end] is a range of bytes, and &s[0..1] takes just the first byte, which is the complete one-byte character "h", so that is valid. But the accented e spans two bytes (indices 1 and 2), so a slice ending at byte index 2 would cut that character in half. Rust requires every slice boundary to fall on a valid UTF-8 character boundary, and because index 2 is in the middle of the accented e, &s[0..2] would not produce valid UTF-8 and so the program panics at runtime. The rule is that you may only slice on character boundaries, never inside a multibyte character.`,
    tags: ['string', 'slicing', 'utf8'],
  },
  {
    id: 'rs-ch08-t-021',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Reading a HashMap Value Safely',
    prompt: `You call let score = scores.get("Blue"); on a HashMap<String, i32>. What is the exact type of score, and why is it an Option of a reference rather than a plain i32? Sketch how you would print the value or a default of 0 if the key is absent.`,
    hints: [
      'The key might not be present at all.',
      'get borrows the stored value rather than moving it out.',
    ],
    solution: `The type of score is Option<&i32>: it is an Option because the key "Blue" might not be in the map, and it holds a reference because get borrows the value that the map still owns rather than handing you ownership of it. You handle both cases by pattern matching, for example match scores.get("Blue") { Some(v) => println!("{v}"), None => println!("0") }, or more compactly with the copied/unwrap_or style if you have seen it. The Option forces you to acknowledge the missing-key possibility, and the reference keeps the map intact. This is the safe analogue of Vec's get versus indexing.`,
    tags: ['hashmap', 'get', 'option'],
  },
  {
    id: 'rs-ch08-t-022',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Plus Operator Ownership Trace',
    prompt: `Trace the ownership in:

let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2;

After this runs, which of s1, s2, s3 are still usable? Explain the signature reason: why is the right operand written as &s2 rather than s2?`,
    hints: [
      'The plus operator consumes its left operand.',
      'It only needs to borrow the right operand.',
    ],
    solution: `The plus operator on String takes its left operand by value and its right operand by reference, so s1 + &s2 moves s1 into the operation and only borrows s2. After this line s1 has been moved and is no longer usable, s2 is still usable because it was only borrowed, and s3 owns the resulting "Hello, world!". The right side is written &s2 because the underlying add method expects a &str reference, not an owned String; passing s2 by value would not match the signature and would needlessly consume it. So the survivors are s2 and s3, while s1 is gone.`,
    tags: ['string', 'ownership', 'concatenation'],
  },
  {
    id: 'rs-ch08-t-023',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Average of Counts Versus the entry Pattern',
    prompt: `Compare two ways to increment a count in a HashMap<String, i32>: (A) let c = *map.get("k").unwrap_or(&0); map.insert("k".to_string(), c + 1); versus (B) *map.entry("k".to_string()).or_insert(0) += 1. Discuss correctness, how many map lookups each performs, and which you would prefer, all using only chapter 8 features.`,
    hints: [
      'Count how many times each version traverses the map.',
      'Think about the missing-key case in version A.',
    ],
    solution: `Both versions produce the correct count, but they differ in cost and clarity. Version A does two separate map operations: a get to read the current value (defaulting to 0 when absent via unwrap_or(&0)) and then a fresh insert to overwrite, so the key is hashed and located twice and a new key String is allocated even when the key already existed. Version B does the work in a single entry call: or_insert returns a mutable reference to the value slot, inserting 0 only if the key is missing, and += 1 updates it in place, so the map is traversed once. Version B is preferable because it is one combined lookup-and-update, reads more clearly, and avoids the redundant second hash. Version A is mainly useful when you genuinely need the old value as a separate step.`,
    tags: ['hashmap', 'entry', 'compare'],
  },
  {
    id: 'rs-ch08-t-024',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing a Pig Latin Converter',
    prompt: `Describe, without writing full code, an algorithm for the pig latin exercise using only chapter 8 tools: words starting with a consonant move the first consonant to the end and add "ay" (so "first" becomes "irst-fay"), and words starting with a vowel just add "hay" (so "apple" becomes "apple-hay"). Explain how you would inspect the first character safely and what UTF-8 caution applies if you slice the rest of the word.`,
    hints: [
      'Use chars().next() to peek at the first letter.',
      'For ASCII input, slicing on byte index 1 is on a boundary.',
    ],
    solution: `Split the sentence into words with split_whitespace, and for each word peek at the first character using word.chars().next() and check whether it is a vowel. If it is a vowel, build the result with format!("{}-hay", word). If it is a consonant, take the first character and the remaining slice and build format!("{}-{}ay", rest, first_char). To get the rest you can slice &word[1..], which for plain ASCII input is safe because each ASCII letter is one byte so byte index 1 is a valid character boundary; if the word could contain multibyte characters you would instead build the rest from chars to avoid panicking mid-character. Collect or print each converted word, joining with spaces. The key chapter 8 ideas are chars().next(), boundary-aware slicing, and format! for assembling the new String.`,
    tags: ['string', 'pig-latin', 'design'],
  },
  {
    id: 'rs-ch08-t-025',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why Iterate-and-Mutate Needs Two Passes',
    prompt: `You want to remove from a Vec<i32> every element that equals a duplicate seen earlier, but you find you cannot push to or remove from the vector while a for loop is borrowing it. Explain the borrow conflict, and describe a chapter-8-only strategy (using a second collection) that sidesteps it.`,
    hints: [
      'A for loop over &v holds a shared borrow for its whole body.',
      'Build a fresh result instead of editing the original mid-loop.',
    ],
    solution: `A for loop written as for n in &v borrows the vector immutably for the entire duration of the loop, and any attempt to push to or remove from v inside that loop needs a mutable borrow at the same time, which the borrow checker forbids and which could also invalidate the iterator if the buffer reallocated. The chapter-8 way around this is to not mutate the original while iterating: instead create a second empty Vec and a HashMap (or a second Vec) to track which values you have already seen, then iterate over the original once, and for each element check the seen set and push it onto the result only if it is new. After the loop you have a deduplicated result vector and the original was only ever borrowed immutably, so there is no conflict. The general principle is to read from one collection and write into another rather than editing a collection during its own iteration.`,
    tags: ['vec', 'borrowing', 'design'],
  },
  {
    id: 'rs-ch08-t-026',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Predict the Overwrite-and-Reference Outcome',
    prompt: `Reason about whether this compiles and, if so, what it prints:

let mut map = HashMap::new();
map.insert(1, String::from("one"));
let v = map.entry(1).or_insert(String::from("ONE"));
v.push_str("!");
println!("{}", map[&1]);

Explain what or_insert does here given the key already exists, and what the final stored value is.`,
    hints: [
      'The key 1 is already present before the entry call.',
      'or_insert does not overwrite an existing value.',
    ],
    solution: `It compiles and prints one!. The key 1 already maps to "one", so map.entry(1).or_insert(String::from("ONE")) does not insert "ONE"; or_insert only inserts when the key is absent, and here it simply returns a mutable reference to the existing value "one". That reference v lets you mutate the stored String in place, so v.push_str("!") changes the value to "one!". Note that the String::from("ONE") argument is still constructed but then dropped unused because the key existed. The final map[&1] is therefore "one!".`,
    tags: ['hashmap', 'entry', 'predict-output'],
  },
  {
    id: 'rs-ch08-t-027',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing the Department Stats Tool',
    prompt: `Design the data structures for a tool that reads commands like "Add Sally to Engineering" and "Add Amir to Sales", then can list all people in a department alphabetically, or every person across the whole company sorted by name. Using only chapter 8 collections, explain which collection holds what, and how you would produce each sorted listing.`,
    hints: [
      'Map each department name to a list of its people.',
      'Sorting is something you do to a Vec, not something the map provides.',
    ],
    solution: `Use a HashMap<String, Vec<String>> where each key is a department name and each value is a Vec of the employee names in that department. To add a person you use map.entry(department).or_insert_with(Vec::new) (or or_insert(Vec::new())) to get the department's vector, then push the new name onto it. To list one department alphabetically, get its Vec, clone or sort it with sort(), and print the names in order. To list everyone across the company sorted by name, iterate over all the map's values, push every name into one combined Vec, then sort that Vec and print it. The HashMap gives fast lookup by department, the Vec values hold the members, and sorting is applied to the vectors because a HashMap itself keeps no order.`,
    tags: ['hashmap', 'vec', 'design'],
  },
  {
    id: 'rs-ch08-t-028',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'bytes Versus chars for Reversal',
    prompt: `A beginner reverses a String by collecting s.bytes() into a Vec, reversing it, and rebuilding a string. Explain why this is unsafe for non-ASCII text but works for pure ASCII, and what you should iterate over instead to reverse by visible character.`,
    hints: [
      'A multibyte character is several bytes in a specific order.',
      'Reversing bytes scrambles those multibyte sequences.',
    ],
    solution: `Reversing the raw bytes works for pure ASCII because every ASCII character is exactly one byte, so reversing the byte order is the same as reversing the characters. For non-ASCII text it is unsafe: a single character like an accented e is encoded as a specific ordered sequence of two or more bytes, and reversing all the bytes flips the order within that sequence, producing byte patterns that are no longer valid UTF-8 for that character. To reverse by visible character you should iterate over s.chars() instead, since each item there is a whole Unicode scalar value; reversing the sequence of chars keeps each character intact and only changes their order. In short, reverse chars, not bytes, unless you can guarantee ASCII.`,
    tags: ['string', 'bytes', 'utf8'],
  },
  {
    id: 'rs-ch08-t-029',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Tracking Max While Counting',
    prompt: `You are counting occurrences of words in a sentence and also want the single most frequent word in one pass-friendly design. Explain why you cannot reliably hold a reference to the current best value while still mutating the same HashMap, and describe a chapter-8 approach that counts first and finds the max in a separate scan.`,
    hints: [
      'A live reference into the map blocks further mutation of the map.',
      'Separate the counting phase from the max-finding phase.',
    ],
    solution: `You cannot hold a reference into the HashMap that points at the current best entry while continuing to call entry or insert, because those mutating calls need a mutable borrow of the whole map and the borrow checker will not allow that mutable borrow while an immutable reference into the map is still alive. Trying to keep a "best so far" reference during counting therefore fails to compile. The clean chapter-8 approach is two phases: first iterate over the words and build the full HashMap<&str, i32> of counts with entry().or_insert(0), letting each borrow end before the next iteration; then, in a separate scan over the finished map, track the key with the largest count by copying out the winning key and value rather than holding a live reference. Separating mutation (phase one) from inspection (phase two) keeps every borrow short-lived and satisfies the borrow checker.`,
    tags: ['hashmap', 'borrowing', 'design'],
  },
  {
    id: 'rs-ch08-t-030',
    chapter: 8,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Choosing Vec, String, or HashMap',
    prompt: `For each scenario, state which of Vec, String, or HashMap is the best fit and justify it in one sentence: (a) an ordered playlist of track titles; (b) accumulating log text piece by piece into one block; (c) looking up a country code to get its full name; (d) recording how many times each error code occurred. Then state the one factor that most distinguishes a HashMap choice from a Vec choice.`,
    hints: [
      'Vec keeps order and is indexed by position.',
      'HashMap is indexed by an arbitrary key.',
    ],
    solution: `(a) A Vec<String> fits the playlist because order matters and tracks are naturally accessed by position. (b) A String fits the growing log block because you are building up one piece of UTF-8 text with push_str. (c) A HashMap<String, String> fits the country lookup because you index by an arbitrary key (the code) to retrieve a value (the name). (d) A HashMap fits the error counts because each distinct error code keys to its own running count via entry().or_insert(0). The factor that most distinguishes a HashMap from a Vec is how you look data up: a Vec is indexed by a contiguous numeric position and preserves insertion order, whereas a HashMap is indexed by an arbitrary key of your choosing and makes no ordering promise.`,
    tags: ['collections', 'design', 'compare'],
  },
]

export default problems
