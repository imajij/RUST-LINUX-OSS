import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-08',
  track: 'rust',
  chapter: 8,
  title: 'Common Collections',
  summary: `Most real programs need to hold many values at once, and Rust's standard library ships a handful of collections built for exactly that. Unlike arrays and tuples, these collections live on the heap, so they can grow and shrink while the program runs. This chapter focuses on the three you will reach for daily: the vector (an ordered, growable list), the String (a growable, UTF-8 text buffer), and the hash map (a key-to-value lookup table). Understanding their ownership, their performance, and their sharp edges is essential groundwork for reading the standard library and contributing to large Rust codebases.`,
  sections: [
    {
      heading: 'What a collection is and why it lives on the heap',
      body: `An *array* like [i32; 5] and a *tuple* are fixed at compile time: their size is baked into the type, and they usually live on the stack. A **collection** is different. The number of elements is not known when you compile, and it can change as the program runs, so the data must live on the **heap** where it can be allocated, grown, and freed at runtime.

The three collections in this chapter are the ones you will use constantly:

- **Vec, the vector** stores a variable number of values of the *same* type, packed next to each other in memory, in order.
- **String** is a collection of bytes that the standard library guarantees is valid UTF-8 text. It is essentially a specialized vector of bytes with text-aware methods.
- **HashMap** stores a mapping from keys to values, letting you look a value up by its key instead of by a numeric index.

The standard library has more collections (VecDeque, BTreeMap, HashSet, and others), but these three cover the vast majority of everyday code. The recurring theme to watch for is *ownership*: because these structures own heap data, moving them, indexing them, and iterating them all interact with the borrow checker in ways that trip up newcomers. The *why* behind each rule is almost always memory safety without a garbage collector.

A second recurring theme is the difference between an **owned** collection and a **slice** into it. A Vec owns its elements; a slice such as the type written ampersand-bracket-T-bracket borrows a contiguous run of them. Functions should usually take slices so they work with both vectors and arrays.`,
    },
    {
      heading: 'Vectors: creating, pushing, and dropping',
      body: `Create an empty vector with Vec::new. Because an empty vector gives the compiler no values to infer from, you must annotate the element type, as in Vec of i32. More often you create a vector with initial values using the vec! macro, and Rust infers the type from those values.

To add elements, the variable must be **mut**, and you call push. Pushing may force the vector to *reallocate*: a vector keeps a length (how many elements it holds) and a capacity (how many it can hold before needing more room). When push exceeds capacity, the vector allocates a larger block, copies the elements over, and frees the old one. This is why repeated pushes are amortized constant time, not always constant time. If you know the final size ahead of time, Vec::with_capacity avoids those intermediate reallocations and is the idiomatic choice in hot paths.

Like any struct, a vector is **dropped** when it goes out of scope, and dropping the vector drops every element it contains and frees its heap buffer. This is deterministic and happens at the closing brace of the owning scope, with no garbage collector involved.

A subtle but important rule: when a reference to an element exists, you cannot also push to the vector. The reason is that push might reallocate, which would leave that reference dangling, pointing at freed memory. The borrow checker forbids it at compile time, turning a classic C bug into a compile error.`,
      code: [
        {
          lang: 'rust',
          src: `// Empty vector needs a type annotation.
let v: Vec<i32> = Vec::new();

// The vec! macro infers the type from the literals.
let mut v = vec![1, 2, 3];

// push requires the vector to be mut; it may reallocate.
v.push(4);
v.push(5);

// Pre-allocate when the size is known: avoids repeated reallocation.
let mut scores = Vec::with_capacity(100);
for i in 0..100 {
    scores.push(i * i);
}

// The vector and all its elements are dropped here, at end of scope.`,
        },
      ],
    },
    {
      heading: 'Reading elements: indexing versus get',
      body: `There are two ways to read an element, and choosing between them is a real design decision about how your program should behave when an index is out of range.

**Indexing** with square brackets returns a *reference* to the element, written with the ampersand and the index. If the index is out of bounds, the program **panics** and the thread unwinds. Use indexing when an out-of-range access is a genuine bug that should crash loudly during development, because that panic is exactly the signal you want.

**The get method** returns an Option: Some with a reference when the index is valid, and None when it is not. Use get when an out-of-range index is an expected, recoverable situation, for example reading an index that came from user input. You then handle the None case explicitly instead of crashing.

Now the borrow-checker subtlety that confuses almost everyone. Holding a reference to an element borrows the *whole vector* immutably for as long as that reference is alive. While that immutable borrow is alive you cannot take a mutable borrow, which includes calling push. Again, the reason is reallocation: if push moved the buffer, your element reference would dangle. The fix is usually to finish using the reference before mutating, or to copy the value out (for Copy types like i32) so no borrow lingers.`,
      code: [
        {
          lang: 'rust',
          src: `let v = vec![10, 20, 30, 40, 50];

// Indexing: returns &i32, panics if out of bounds.
let third: &i32 = &v[2];
println!("third = {third}");

// get: returns Option<&i32>, never panics.
match v.get(2) {
    Some(value) => println!("got {value}"),
    None => println!("no element there"),
}

// This would PANIC, not return None:
// let does_not_exist = &v[100];
// This safely returns None:
let does_not_exist = v.get(100);
assert!(does_not_exist.is_none());

// Borrow-checker pitfall: a live element reference blocks push.
let mut v = vec![1, 2, 3];
let first = &v[0];        // immutable borrow of the whole vector
// v.push(4);             // ERROR: cannot borrow v as mutable
println!("{first}");      // immutable borrow ends after this use
v.push(4);                // now this is fine`,
        },
      ],
    },
    {
      heading: 'Iterating over a vector',
      body: `To read each element in turn, iterate over an immutable reference to the vector. Each item in the loop is an immutable reference to an element, so you read through it without taking ownership.

To change each element in place, iterate over a *mutable* reference. Each item is then a mutable reference, and to read or write the value behind it you use the **dereference operator**, the asterisk. Writing the compound assignment asterisk-i plus-equals fifty adds fifty to the value the reference points at.

Iterating with for over a reference does not consume the vector, so you can keep using it afterward. If you iterate over the vector *by value* instead of by reference, the loop takes ownership and the vector is moved into the loop, so it is no longer usable afterward. Choose deliberately: by-reference to keep the vector, by-value when you intend to consume it.

The same borrow rule from indexing applies here, and it is even more important: you may not push to or otherwise resize the vector while a for loop is iterating it, because the loop holds a borrow of the whole vector for its entire duration. Trying to add elements mid-iteration is a compile error, which again prevents an invalidated-iterator bug familiar from C and C plus plus.`,
      code: [
        {
          lang: 'rust',
          src: `// Read each element through an immutable reference.
let v = vec![100, 32, 57];
for n_ref in &v {
    println!("{n_ref}");
}
// v is still usable here.

// Mutate each element in place: note &mut and the * to deref.
let mut v = vec![100, 32, 57];
for n_ref in &mut v {
    *n_ref += 50;
}
// v is now [150, 82, 107].

// Consuming iteration: takes ownership, v is moved away.
let v = vec![String::from("a"), String::from("b")];
for owned in v {
    println!("{owned}");
}
// v cannot be used after this loop.`,
        },
      ],
    },
    {
      heading: 'Storing multiple types with an enum',
      body: `A vector can only hold one type, which seems limiting until you remember that an *enum* is a single type whose variants can each carry different data. So when you need a row of mixed values, define an enum whose variants wrap each kind, and make a vector of that enum.

This is a genuinely common pattern, for example representing the cells of a spreadsheet row where one cell is an integer, another is text, and another is a floating-point number. Every element of the vector has the same type, the enum, so the compiler knows exactly how much memory each element needs and can lay them out contiguously.

The deeper reason this matters: Rust must know the size and layout of every element at compile time to pack them tightly and to generate correct code for indexing. An enum gives the compiler an exhaustive, fixed list of possibilities, and the match expression forces you to handle each variant, so the mixed-type vector stays fully type-checked. If the set of types is open-ended and not known in advance, you would instead reach for a trait object, a Box of a trait, covered in a later chapter.`,
      code: [
        {
          lang: 'rust',
          src: `enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

let row = vec![
    SpreadsheetCell::Int(3),
    SpreadsheetCell::Text(String::from("blue")),
    SpreadsheetCell::Float(10.12),
];

// match forces you to handle every variant.
for cell in &row {
    match cell {
        SpreadsheetCell::Int(i) => println!("int {i}"),
        SpreadsheetCell::Float(f) => println!("float {f}"),
        SpreadsheetCell::Text(t) => println!("text {t}"),
    }
}`,
        },
      ],
    },
    {
      heading: 'Strings and UTF-8: why text is not just a byte array',
      body: `Rust has two string types people meet first. The **string slice** (the borrowed, fixed view often seen as a string literal) and **String**, the growable, heap-allocated, owned type. Both are guaranteed to be valid **UTF-8**. When people say string in Rust they usually mean either of these, and many methods are shared because String can hand out string slices on demand.

Create owned text with String::new for empty, or with the to_string method available on anything that implements Display, or with String::from from a literal. Grow it with push_str to append a whole string slice, or push to append a single character.

Concatenation has two idioms. The plus operator combines an *owned* String on the left with a string-slice reference on the right; crucially it **takes ownership** of the left-hand String and returns the combined String, so the left operand is moved and no longer usable. For anything beyond a couple of pieces, the format! macro is far clearer: it builds a new String from a template and *borrows* all its arguments, leaving every input still usable afterward. Prefer format! for readability.

Now the headline rule that surprises everyone coming from other languages: **you cannot index a String with an integer**. Writing bracket-zero on a String does not compile. The reason is fundamental to UTF-8. A String is a sequence of bytes, but a single human-visible character may occupy one to four bytes. Many Cyrillic, accented, or non-Latin characters take two or more bytes each. So an integer index is ambiguous, does it mean the first byte, the first Unicode scalar value, or the first visible grapheme, and returning a byte that is only half of a character would be meaningless and a likely bug. Rather than silently do the wrong thing, Rust refuses the operation entirely. Indexing into a String would also break the constant-time guarantee callers expect from indexing, since finding the nth character requires scanning from the start.`,
      code: [
        {
          lang: 'rust',
          src: `// Several ways to build owned strings.
let mut s = String::new();
s.push_str("foo");        // append a string slice
s.push('!');              // append a single char
let s = "literal".to_string();
let s = String::from("from a literal");

// Concatenation with +: s1 is MOVED and gone afterward.
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2;        // s1 moved here; only s2 (a &str slice) is borrowed
// println!("{s1}");      // ERROR: s1 was moved
println!("{s3}");

// format! is clearer for several pieces and borrows everything.
let a = String::from("tic");
let b = String::from("tac");
let c = String::from("toe");
let joined = format!("{a}-{b}-{c}");
// a, b, and c are all still usable here.

// Integer indexing is a COMPILE ERROR, on purpose:
// let s = String::from("hello");
// let h = s[0]; // does not compile`,
        },
      ],
    },
    {
      heading: 'Looking inside a String: bytes, chars, and slices',
      body: `If you cannot index by integer, how do you inspect text? Rust makes you choose *which* unit you mean, because that choice is the whole point.

- **The chars method** yields each Unicode scalar value (roughly, each char). This is what you usually want when reasoning about characters. Iterate it to walk the text one scalar at a time.
- **The bytes method** yields each raw byte, a u8. This is what you want for byte-level work, and its length matches the len method, which returns the number of *bytes*, not characters.

There is a third level, **grapheme clusters**, what a human perceives as one character even when it is built from several scalar values, like an accented letter or an emoji with a skin-tone modifier. The standard library does not provide grapheme iteration; you need an external crate for it. Knowing these three levels exist, bytes, scalar values, and graphemes, is exactly the precision the language is pushing you toward.

You *can* slice a string with a range, as in ampersand-s-bracket-zero-dot-dot-four, which borrows those bytes as a string slice. But this slices by **byte offset**, and it will **panic at runtime** if the range boundary falls in the middle of a multi-byte character. So string slicing is sharp: it is fine for ASCII or when you know the boundaries are valid, and dangerous on arbitrary Unicode. The len method returning bytes is the same trap in disguise, the byte length of a multi-byte string is larger than its character count.`,
      code: [
        {
          lang: 'rust',
          src: `let s = String::from("Здравствуйте"); // Cyrillic: each letter is 2 bytes

// len() counts BYTES, not characters.
println!("{} bytes", s.len()); // 24, not 12

// Iterate Unicode scalar values (what you usually mean by "characters").
for c in s.chars() {
    print!("{c} ");
}
println!();

// Iterate raw bytes (u8 values).
for b in "abc".bytes() {
    println!("{b}"); // 97, 98, 99
}

// Slicing is by BYTE offset and panics on a bad boundary.
let hello = "Здравствуйте";
let first_two_letters = &hello[0..4]; // OK: 4 bytes = first 2 Cyrillic letters
println!("{first_two_letters}");
// let bad = &hello[0..1]; // PANICS: byte 1 is inside a character`,
        },
      ],
    },
    {
      heading: 'Hash maps: insert, get, iterate, and ownership',
      body: `A **HashMap** stores a mapping from keys of type K to values of type V, using a hashing function to decide where each pair lives in memory. Reach for it whenever you want to look data up by an arbitrary key rather than by a sequential index, like counting words or storing settings by name. HashMap is not in the prelude, so you bring it into scope with a use of the collections module path.

Insert pairs with insert. Look a value up with get, which takes a *reference* to the key and returns an Option of a reference to the value, None when the key is absent. A common idiom is to chain copied (or cloned) and unwrap_or to turn that Option-of-reference into an owned value with a default. Iterate with a for loop over a reference to the map, which yields key-value reference pairs in an **arbitrary, unspecified order**, do not rely on iteration order, it can change between runs and is intentionally randomized to resist denial-of-service attacks.

**Ownership** is where hash maps bite. For types that implement Copy, like i32, values are copied into the map. For owned types like String, the value is **moved** into the map and the map becomes its owner, so the original variable is no longer usable. If you want the map to hold references instead, the referenced data must outlive the map, which means lifetimes (a later chapter). The practical rule, inserting an owned String hands it to the map; clone it first if you still need it outside.

One more correctness note relevant to anyone writing key types: a custom key type must implement the Eq and Hash traits, and two keys that compare equal must produce the same hash. Violating that invariant silently breaks lookups, the same contract you must respect when writing hash table keys in the kernel or any systems code.`,
      code: [
        {
          lang: 'rust',
          src: `use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

// get takes &key and returns Option<&V>.
let team = String::from("Blue");
let score = scores.get(&team).copied().unwrap_or(0); // owned i32, default 0
println!("Blue has {score}");

// Iteration order is arbitrary, never rely on it.
for (key, value) in &scores {
    println!("{key}: {value}");
}

// Ownership: String keys/values are MOVED into the map.
let field_name = String::from("color");
let field_value = String::from("blue");
let mut map = HashMap::new();
map.insert(field_name, field_value);
// println!("{field_name}"); // ERROR: field_name was moved into map`,
        },
      ],
    },
    {
      heading: 'Updating a hash map: overwrite, entry, and update-from-old',
      body: `Each key maps to exactly one value, so updating is about deciding what happens when a key already exists. There are three distinct strategies, and picking the right one is a frequent source of clumsy code when people do not know the entry API.

**Overwrite.** Calling insert with a key that is already present simply replaces the old value with the new one. Use this when you genuinely want the latest write to win.

**Insert only if absent: the entry API.** The entry method returns an Entry enum representing a slot that may or may not be occupied. Calling or_insert on it returns a mutable reference to the value, inserting the supplied default first only if the key was vacant. This is the clean, single-lookup way to say insert this default unless something is already there. Doing the same thing with a contains_key check followed by insert is both wordier and does two lookups.

**Update based on the old value.** Because or_insert returns a *mutable reference* to the value, you can read the current value and write a new one through it in a single step. The classic example is counting word frequencies, you call or_insert with zero to ensure an entry exists, then dereference the returned reference with the asterisk and increment it. The mutable borrow it returns lasts only until the end of that statement, so the next loop iteration can borrow the map again safely. This pattern, entry then or_insert then deref-and-modify, is one of the most useful idioms in everyday Rust.`,
      code: [
        {
          lang: 'rust',
          src: `use std::collections::HashMap;

// 1. Overwrite: the second insert replaces the first.
let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Blue"), 25); // Blue is now 25

// 2. Insert only if the key is absent (entry + or_insert).
scores.entry(String::from("Yellow")).or_insert(50); // inserted
scores.entry(String::from("Blue")).or_insert(50);   // already present, unchanged

// 3. Update from the old value: count word frequencies.
let text = "the quick brown the lazy the";
let mut counts: HashMap<&str, i32> = HashMap::new();
for word in text.split_whitespace() {
    let entry = counts.entry(word).or_insert(0); // &mut to the value
    *entry += 1;                                 // read + write through the ref
}
// counts: {"the": 3, "quick": 1, "brown": 1, "lazy": 1}`,
        },
      ],
    },
  ],
  takeaways: [
    'Collections (Vec, String, HashMap) store a variable number of values on the heap, so they can grow and shrink at runtime, unlike fixed arrays and tuples.',
    'A vector owns its elements and drops all of them when it goes out of scope; push may reallocate, which is why a live element reference forbids pushing.',
    'Index with brackets to panic on out-of-range (a bug should crash); use get to receive an Option and handle the missing case gracefully.',
    'Iterate with &v to read, &mut v plus the * dereference to mutate in place; iterating by value consumes the vector.',
    'String is a UTF-8 byte buffer: integer indexing is a compile error, and byte-range slicing panics if it splits a multi-byte character.',
    'Use chars for Unicode scalar values, bytes for raw u8, and remember len counts bytes, not characters; graphemes need an external crate.',
    'Build strings with format! (borrows everything, clearest) rather than chained + (which moves the left-hand String).',
    'HashMap looks values up by key, moves owned values like String into itself, and iterates in an arbitrary, intentionally randomized order.',
    'The entry API with or_insert inserts a default only when absent and returns a mutable reference, enabling the read-and-update-old-value pattern in one lookup.',
  ],
  cheatsheet: [
    { label: 'Vec::new()', value: 'Empty vector; needs a type annotation like Vec<i32>' },
    { label: 'vec![1, 2, 3]', value: 'Create a vector with initial values, type inferred' },
    { label: 'v.push(x)', value: 'Append x; requires mut; may reallocate the buffer' },
    { label: '&v[i]', value: 'Reference to element i; panics if out of bounds' },
    { label: 'v.get(i)', value: 'Returns Option<&T>: Some(&val) or None, never panics' },
    { label: 'for x in &mut v { *x += 1 }', value: 'Mutate each element in place via dereference' },
    { label: 'String::from(s) / s.to_string()', value: 'Make an owned, growable, UTF-8 String' },
    { label: 's1 + &s2', value: 'Concatenate; moves s1, borrows s2, returns String' },
    { label: 'format!("{a}-{b}")', value: 'Build a String from a template; borrows all args' },
    { label: 's.chars() / s.bytes()', value: 'Iterate Unicode scalar values / raw u8 bytes' },
    { label: 's.len()', value: 'Length in BYTES, not characters' },
    { label: 'map.insert(k, v)', value: 'Insert/overwrite; owned values are moved into the map' },
    { label: 'map.get(&k)', value: 'Returns Option<&V> for key k' },
    { label: 'map.entry(k).or_insert(0)', value: 'Insert default if absent; returns &mut V to update' },
  ],
}

export default note
