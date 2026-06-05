import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-05',
  track: 'rust',
  chapter: 5,
  title: 'Using Structs to Structure Related Data',
  summary: `Structs are how you give a name and a shape to a group of related values, turning loose tuples and stray variables into a single meaningful type. This chapter covers defining and instantiating structs, the shorthands that make construction ergonomic, the three flavours of struct (named-field, tuple, and unit-like), and the impl blocks that attach methods and associated functions. Together with enums in the next chapter, structs are the primary tool for modelling a domain in Rust, and they appear everywhere in real systems code including the Linux kernel's Rust abstractions.`,
  sections: [
    {
      heading: 'Why structs: from tuples to named shapes',
      body: `A struct is a custom data type that lets you package together and name several related values that make up a meaningful group. You can think of it as the data-carrying half of object-oriented design: a struct holds the state, and (as you will see) impl blocks attach the behaviour.

Before reaching for a struct, it helps to see what is wrong with the alternatives. Imagine a function that computes the area of a rectangle. A first attempt passes width and height as two separate parameters, but nothing in the type system says those two numbers belong together, and it is easy to swap them at a call site. A second attempt groups them into a tuple, which at least binds them into one value, but a tuple gives the fields no names: you index with .0 and .1, and a reader cannot tell which is width and which is height. A struct fixes both problems at once. It binds the values together AND labels each one, so the meaning lives in the type rather than in a comment or in your memory.

### The mental model

A struct definition is a blueprint, not a value. It says what fields exist and what type each field has, but allocates nothing on its own. You create an actual value, called an *instance*, by filling in every field. The order of fields in the definition does not have to match the order you list them at instantiation, because each value is associated with its field by name.

This naming is the whole point: more relevant to systems work, named fields make data layout self-documenting, which matters when a struct mirrors a hardware register block, a network packet, or a kernel object.`,
      code: [
        {
          lang: 'rust',
          src: `// Two loose parameters: nothing says they belong together.
fn area_v1(width: u32, height: u32) -> u32 {
    width * height
}

// A tuple groups them, but the fields are anonymous (.0 and .1).
fn area_v2(dim: (u32, u32)) -> u32 {
    dim.0 * dim.1
}

// The struct version (defined below) gives both grouping AND names.
struct Rectangle {
    width: u32,
    height: u32,
}

fn area_v3(rect: &Rectangle) -> u32 {
    rect.width * rect.height
}`,
        },
      ],
    },
    {
      heading: 'Defining and instantiating structs',
      body: `You define a struct with the struct keyword, a name in UpperCamelCase, and a brace-delimited list of fields, where each field is written as a name, a colon, and a type. To create an instance you write the struct name followed by braces containing name and value pairs for every field. You do not have to specify the fields in the same order in which you declared them in the struct, because fields are matched by name.

To read a value out of an instance, use dot notation: write the instance, a dot, and the field name. To change a value, the instance must be mutable, and then you assign to the dotted field.

### Mutability is per-instance, not per-field

This is a common surprise: Rust does not let you mark only some fields as mutable. The entire instance is either mutable or it is not. If you want a struct where some data can change and some cannot, that is a design decision you express through the API (methods) rather than a field-level keyword. An instance is mutable only when the binding that owns it is declared with mut.

### Returning a struct from a function

A function whose last expression constructs a struct returns that instance. Because of field init shorthand (next section), builder-style constructor functions read very cleanly. Note the implicit return: no semicolon on the final expression, and no return keyword needed.`,
      code: [
        {
          lang: 'rust',
          src: `struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    // Construct an instance; field order need not match the definition.
    let mut user1 = User {
        active: true,
        username: String::from("ferris"),
        email: String::from("ferris@rust-lang.org"),
        sign_in_count: 1,
    };

    // Read a field with dot notation.
    println!("email: {}", user1.email);

    // Mutate a field: the WHOLE instance must be mut for this to compile.
    user1.email = String::from("ferris@kernel.org");
}

// A constructor function that returns a fully built instance.
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username: username,
        email: email,
        sign_in_count: 1,
    }
}`,
        },
      ],
    },
    {
      heading: 'Field init shorthand and struct update syntax',
      body: `Two pieces of syntactic sugar make building structs far less repetitive.

### Field init shorthand

When a function parameter has the same name as the struct field you are assigning it to, writing the field name twice is noise. The *field init shorthand* lets you write just the name once. Behind the scenes this is identical to the long form; it is purely a convenience that removes the duplication. It is idiomatic to use it whenever the names line up, which is why constructor parameters are usually named after their fields.

### Struct update syntax

It is common to build a new instance that is mostly the same as an existing one, changing only a field or two. The *struct update syntax*, written with two dots followed by another instance, fills in every field you did not explicitly set from the corresponding field of that other instance. The two dots must come last in the braces.

### The ownership pitfall everyone hits

Struct update syntax uses assignment under the hood, so it MOVES data, just like a plain let binding does. If any field it copies over is a type that does not implement Copy, such as a String, that data is moved out of the source instance, and the source can no longer be used as a whole. In the classic example, building a second user from a first with update syntax moves the username String, so the first user is partly invalidated and you cannot use it afterward. Fields whose types are Copy (like bool or u64) are bit-copied, so those alone would not invalidate the source. The fix when you need to keep the original is to construct fresh owned values (for example by cloning) rather than moving them.`,
      code: [
        {
          lang: 'rust',
          src: `struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

// Field init shorthand: email and username match the parameter names,
// so we drop the redundant long form.
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,        // same as username: username
        email,           // same as email: email
        sign_in_count: 1,
    }
}

fn main() {
    let user1 = build_user(
        String::from("a@example.com"),
        String::from("alice"),
    );

    // Struct update syntax: take email from a new value, everything
    // else from user1. The two-dot part must come last.
    let user2 = User {
        email: String::from("b@example.com"),
        ..user1
    };

    // PITFALL: ..user1 MOVED user1.username (a String) into user2,
    // so user1 as a whole can no longer be used here.
    // println!("{}", user1.username); // would NOT compile
    println!("{}", user2.username);
}`,
        },
      ],
    },
    {
      heading: 'Tuple structs and unit-like structs',
      body: `Named-field structs are the common case, but Rust offers two more shapes for situations where field names would be redundant or where there are no fields at all.

### Tuple structs

A *tuple struct* has a name but its fields are unnamed; you give only their types. You define it with the struct keyword, a name, and a parenthesised list of types. Instances are constructed and destructured like tuples, and you access fields by position with .0, .1, and so on.

The value of a tuple struct is the *named type itself*. A Color and a Point might both be three integers, but a tuple struct makes them distinct types, so a function expecting a Color will reject a Point even though their layouts are identical. This is the cheapest way in Rust to get the newtype pattern: wrapping a primitive in a tuple struct with one field gives it a distinct type and lets you attach methods, without any runtime cost. The newtype pattern is heavily used to make APIs hard to misuse, for example wrapping a raw integer in a Meters type so it cannot be confused with Seconds.

### Unit-like structs

A *unit-like struct* has no fields at all; you write its name followed by a semicolon, with no braces or parentheses. It behaves like the unit value. This sounds useless, but it is exactly what you want when you need a type to implement a trait yet have no data to store. A common example is a marker type that carries behaviour through a trait implementation while occupying zero bytes. In kernel and embedded Rust, zero-sized types like these are used as compile-time tokens that prove a capability without any memory footprint.`,
      code: [
        {
          lang: 'rust',
          src: `// Tuple structs: named types whose fields are positional.
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);

    // Access by position.
    println!("red channel: {}", black.0);

    // Destructure like a tuple (note the struct name pattern).
    let Point(x, y, z) = origin;
    println!("{} {} {}", x, y, z);

    // Color and Point are DIFFERENT types despite identical layout:
    // a fn taking a Color will not accept a Point.
}

// Newtype pattern: a distinct type with zero runtime overhead.
struct Meters(f64);

// Unit-like struct: no data, useful only to implement a trait on.
struct AlwaysEqual;

fn main2() {
    let _subject = AlwaysEqual;
}`,
        },
      ],
    },
    {
      heading: 'Methods and the self borrows',
      body: `Methods are functions defined in the context of a struct (or enum, or trait object). You declare them inside an impl block, an implementation block named after the type. Everything inside impl Rectangle is associated with the Rectangle type. The defining feature of a method versus a plain function is that its first parameter is always self, which represents the instance the method is called on.

### The three forms of the receiver

The first parameter spells out how the method borrows the instance, and choosing correctly is the heart of writing good Rust APIs:

- An immutable borrow, written ampersand-self, is shorthand for self of type reference-to-Self. Use this for methods that only read, which is the overwhelming majority. The caller keeps ownership and can keep using the value afterward.
- A mutable borrow, written ampersand-mut-self, borrows the instance mutably. Use this when the method needs to change the instance. The caller must hold the value in a mut binding.
- By value, written just self with no reference, takes ownership of the instance and the caller can no longer use it. This is rare and reserved for methods that transform the value into something else, often consuming it, such as conversions.

Choosing the immutable borrow by default is not just convention: a method that borrows immutably composes freely, can be called many times, and does not force the caller to give up ownership. Reaching for by-value or mutable receivers when an immutable borrow would do is a real API smell.

### Why methods at all, and the automatic referencing

Methods organise behaviour with the data it operates on, and let you write the call as instance-dot-method rather than passing the instance to a free function, which reads better and keeps the namespace tidy. Rust also has *automatic referencing and dereferencing*: when you call a method on an object, the compiler automatically adds a borrow or dereference so the receiver matches the method's self type. This is why you never write the borrow by hand at the call site. Methods may share a name with a field; following a name with parentheses calls the method, while leaving them off reads the field, a pattern often used for getters.`,
      code: [
        {
          lang: 'rust',
          src: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // Immutable borrow of self: read-only. The common case.
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // Immutable borrow again: takes another instance by reference.
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }

    // Mutable borrow of self: mutates the instance in place.
    fn scale(&mut self, factor: u32) {
        self.width *= factor;
        self.height *= factor;
    }

    // By value: consumes the instance, returning something new.
    fn into_square(self) -> Rectangle {
        let side = self.width.max(self.height);
        Rectangle { width: side, height: side }
    }
}

fn main() {
    let mut rect = Rectangle { width: 30, height: 50 };
    // Automatic referencing inserts the borrow for you.
    println!("area: {}", rect.area());
    rect.scale(2);
    println!("scaled: {:?}", rect);
}`,
        },
      ],
    },
    {
      heading: 'Associated functions and multiple impl blocks',
      body: `All functions defined inside an impl block are called *associated functions* because they are associated with the type. Methods are simply the subset of associated functions whose first parameter is self.

### Associated functions that are not methods

An associated function that does not take self is not a method; you cannot call it on an instance with dot syntax. Instead you call it on the type itself using the double-colon path syntax, for example the type name followed by colon-colon and the function name. These functions are the idiomatic way to write constructors. The name new is a strong convention but is not a keyword and carries no special meaning, so a type can have several constructors with different names. A classic example is a square constructor that takes one size and builds a Rectangle with equal sides, returning Self.

The keyword Self inside an impl block is an alias for the type the block is for. Using Self in return types and constructors means the code keeps working if you rename the type, and it reads as an instance of myself. You have already met associated functions: the from function on String is one.

### Multiple impl blocks

A type may have as many separate impl blocks as you like; there is no requirement to put every method in one block. Splitting methods across blocks is valid syntax and is genuinely useful: you can group related methods together, place methods behind different conditional-compilation flags, or, most importantly, write generic and trait implementations in their own blocks. When you reach generics and traits, you will routinely have one impl block for inherent methods and others for each trait the type implements.`,
      code: [
        {
          lang: 'rust',
          src: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

// First impl block: constructors (associated functions, no self).
impl Rectangle {
    // Called as Rectangle::new(...), NOT as an instance method.
    fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }

    // Another constructor; "new" is convention, not a keyword.
    fn square(size: u32) -> Self {
        Self { width: size, height: size }
    }
}

// Second impl block: methods. Splitting like this is perfectly valid.
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let sq = Rectangle::square(10);   // associated fn via :: path
    let r = Rectangle::new(4, 7);
    println!("{} {}", sq.area(), r.area());
}`,
        },
      ],
    },
    {
      heading: 'Debug printing with derive(Debug)',
      body: `If you try to print a struct with the ordinary curly-brace placeholder used by println, the code will not compile. That placeholder uses the Display trait, which is about user-facing output, and Rust deliberately does not implement Display for structs automatically because there is no single obvious way to show an arbitrary struct: should it print fields with commas, with newlines, with or without field names? Rust makes you opt in.

### The Debug trait and the debug placeholder

For programmer-facing output during development and debugging, Rust provides the Debug trait, selected by the placeholder that contains a colon and a question mark. Even Debug is not automatic, but it is trivial to opt into: you add the outer attribute derive(Debug) on the line directly above the struct definition. The derive mechanism generates a reasonable Debug implementation for you, printing the struct name and each field. With the pretty placeholder, which adds a hash mark, the output is spread across multiple lines and indented, which is far easier to read for larger structs.

### The dbg! macro

Rust also ships a dbg! macro that is purpose-built for debugging. It prints the file and line number, then the expression and its value using Debug formatting, to standard error rather than standard out. Crucially, dbg! takes ownership of its argument and returns it, so you can wrap an expression in dbg! in place without restructuring your code. Because it writes to standard error, it does not pollute the normal program output you might be capturing.

### Why this matters beyond convenience

derive is your first taste of a much larger feature. Many traits including Clone, Copy, PartialEq, Eq, Hash, and Default can be derived the same way, generating correct boilerplate implementations from the struct's fields. Knowing what each derive grants, and when the compiler will refuse to derive it because a field does not support it, is essential to reading real Rust code.`,
      code: [
        {
          lang: 'rust',
          src: `// Opt into Debug formatting with the derive attribute.
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };

    // The plain placeholder uses Display and would NOT compile here.
    // The debug placeholder prints: Rectangle { width: 30, height: 50 }
    println!("{:?}", rect);

    // The pretty debug placeholder gives the multi-line form.
    println!("{:#?}", rect);

    // dbg! prints file and line plus the value to stderr and returns
    // the value, so it can wrap an expression without changing meaning.
    let scale = 2;
    let area = dbg!(rect.width * scale) * rect.height;
    println!("area = {}", area);
}`,
        },
      ],
    },
  ],
  takeaways: [
    'A struct names a group of related values; fields are matched by name, so instantiation order is free.',
    'Mutability is per-instance, not per-field: the whole binding must be mut to change any field.',
    'Field init shorthand drops the redundant repeated field name when a variable shares it.',
    'Struct update syntax (..other) fills remaining fields from another instance, but MOVES non-Copy fields, invalidating the source.',
    'Tuple structs give a distinct named type with positional fields; one-field tuple structs are the newtype pattern.',
    'Unit-like structs have no fields and are zero-sized, ideal as trait-carrying marker types.',
    'Methods live in impl blocks and take self; prefer an immutable borrow, use a mutable borrow to change, and by-value only to consume.',
    'Associated functions without self are called with the type-and-double-colon path and are the idiomatic place for constructors; Self aliases the type.',
    'Structs do not get Display or Debug for free: add derive(Debug) and print with the debug placeholders, or use dbg! for quick inspection.',
  ],
  cheatsheet: [
    { label: 'struct Name { f: T }', value: 'Define a named-field struct' },
    { label: 'Name { f: v }', value: 'Instantiate; fields matched by name' },
    { label: 'instance.field', value: 'Read or assign a field (assign needs mut)' },
    { label: 'field init shorthand', value: 'Write the field name once when a var matches it' },
    { label: '..other', value: 'Struct update: fill rest from other (moves non-Copy)' },
    { label: 'struct N(T, T);', value: 'Tuple struct; access with .0, .1' },
    { label: 'struct N;', value: 'Unit-like struct; zero-sized marker type' },
    { label: 'impl Name { ... }', value: 'Attach methods and associated functions' },
    { label: 'fn m(&self)', value: 'Method: immutable borrow of the instance' },
    { label: 'fn m(&mut self)', value: 'Method: mutable borrow; caller needs mut' },
    { label: 'fn m(self)', value: 'Method: takes ownership, consumes the instance' },
    { label: 'fn new(..) -> Self', value: 'Associated fn (no self); call via Name and ::' },
    { label: 'derive(Debug)', value: 'Generate Debug impl for the debug placeholders' },
    { label: 'dbg!(expr)', value: 'Print file and line plus value to stderr, return value' },
  ],
}

export default note
