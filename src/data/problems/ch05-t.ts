import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch05-t-001',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Is a Struct For',
    prompt: `A teammate keeps passing four loose variables around together: a width, a height, a label, and an "is_active" flag. Explain in your own words what a struct gives you here, and write the struct definition that would group these four values.`,
    hints: [
      'A struct names a custom type and names each piece of data inside it.',
      'Each field has a name and a type.',
    ],
    solution: `A struct lets you bundle related values into one named custom type, where each piece of data has its own named field. Instead of remembering the meaning and order of four separate variables, you carry one value whose fields document their purpose. A fitting definition is:

    struct Widget {
        width: u32,
        height: u32,
        label: String,
        is_active: bool,
    }

Now you can pass a single Widget around, and access parts with dot notation like w.width. The names make the code self-describing and prevent mixing up arguments of the same type.`,
    tags: ['structs', 'definition', 'when-to-use'],
  },
  {
    id: 'rs-ch05-t-002',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Reading a Field With Dot Notation',
    prompt: `Given this code, what does it print?

    struct User {
        username: String,
        active: bool,
    }

    let u = User {
        username: String::from("ada"),
        active: true,
    };
    println!("{} / {}", u.username, u.active);

Name the syntax used to read each field.`,
    hints: [
      'You build an instance by listing field: value pairs.',
      'You read a field by writing instance.field.',
    ],
    solution: `It prints "ada / true". You create an instance by giving a value for every field inside the curly braces, and you read a field with dot notation: u.username gives the String and u.active gives the bool. Dot notation is how you access the individual pieces of data stored in a struct instance. The fields can be listed in any order when constructing, as long as every field is provided.`,
    tags: ['structs', 'field-access', 'predict-output'],
  },
  {
    id: 'rs-ch05-t-003',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why This Field Assignment Fails',
    prompt: `This snippet does not compile:

    struct Point {
        x: i32,
        y: i32,
    }

    let p = Point { x: 1, y: 2 };
    p.x = 10;

Explain why, and state the one-word change that fixes it.`,
    hints: [
      'Look at how p is bound.',
      'Rust mutability applies to the whole instance.',
    ],
    solution: `It fails because p is an immutable binding, so you cannot assign a new value to p.x. In Rust the entire instance must be mutable to change any of its fields; you cannot mark just one field mutable. The fix is to bind it with mut: let mut p = Point { x: 1, y: 2 }; then p.x = 10; is allowed. Mutability is a property of the binding, not of individual fields.`,
    tags: ['structs', 'mutability', 'compile-error'],
  },
  {
    id: 'rs-ch05-t-004',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What derive(Debug) Buys You',
    prompt: `A struct has no special attributes on it. When you try println!("{:?}", instance) the compiler refuses. What single line do you add, and where, to make debug printing work? Briefly say why it is needed.`,
    hints: [
      'The {:?} format calls a trait the type must implement.',
      'There is an attribute that generates that implementation for you.',
    ],
    solution: `You add the attribute #[derive(Debug)] on the line directly above the struct definition. The {:?} formatter requires the type to implement the Debug trait, and structs do not get it automatically because Rust will not guess how you want your type displayed. Deriving Debug auto-generates a reasonable implementation so {:?} (and {:#?} for pretty printing) work. Without it the compiler errors that the type "doesn't implement Debug".`,
    tags: ['structs', 'debug', 'derive'],
  },
  {
    id: 'rs-ch05-t-005',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Field Init Shorthand',
    prompt: `Consider this constructor body:

    fn build_user(username: String, active: bool) -> User {
        User {
            username: username,
            active: active,
        }
    }

How can field init shorthand simplify the returned struct literal, and what exact condition makes the shorthand usable?`,
    hints: [
      'Notice the field names equal the parameter names.',
      'Shorthand drops the redundant "name: name".',
    ],
    solution: `When a function parameter has the same name as the struct field it initializes, you can write just the name once instead of "field: variable". The body becomes:

    User { username, active }

The condition is exactly that the in-scope variable's name matches the field name. This field init shorthand removes the repetition of writing username: username and active: active, which is both shorter and less error-prone.`,
    tags: ['structs', 'shorthand', 'construction'],
  },
  {
    id: 'rs-ch05-t-006',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Struct Update Syntax Basics',
    prompt: `You have an existing user1 of type User (fields: username, email, active, sign_in_count). You want user2 to be identical except for a different email. Show how struct update syntax expresses this, and explain what ..user1 means in that literal.`,
    hints: [
      'Specify the fields you change explicitly first.',
      'The .. spread fills in the rest from another instance.',
    ],
    solution: `You write:

    let user2 = User {
        email: String::from("new@x.com"),
        ..user1
    };

The ..user1 at the end means "take the remaining fields (username, active, sign_in_count) from user1". Struct update syntax lets you build a new instance by listing only the fields that differ and copying everything else from an existing instance. The spread must come last, and it only fills fields you did not already specify.`,
    tags: ['structs', 'update-syntax', 'construction'],
  },
  {
    id: 'rs-ch05-t-007',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Tuple Struct vs Plain Tuple',
    prompt: `Compare these two definitions:

    struct Color(i32, i32, i32);
    let plain: (i32, i32, i32) = (0, 0, 0);

When is a tuple struct like Color worth using instead of a plain tuple, and how do you read the first component of a Color value named c?`,
    hints: [
      'A tuple struct has a name, a plain tuple does not.',
      'Access components with index syntax c.0, c.1, ...',
    ],
    solution: `A tuple struct gives the whole tuple a meaningful type name without naming each field, so Color(0, 0, 0) is a distinct type from, say, Point(0, 0, 0) even though both hold three i32 values. This is worth it when you want the type system to keep two same-shaped tuples from being mixed up, and when names per field would be unnecessary noise. You read its components by index: c.0 is the first, c.1 the second, c.2 the third. A plain tuple has no name and is interchangeable with any other tuple of the same shape.`,
    tags: ['tuple-structs', 'tuples', 'when-to-use'],
  },
  {
    id: 'rs-ch05-t-008',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Methods vs Plain Functions',
    prompt: `The Rectangle example can compute area either as a free function area(rect: &Rectangle) -> u32 or as a method rect.area(). List two advantages of using a method instead of a free function here.`,
    hints: [
      'Where does the function live, and how is it called?',
      'Think about organization and the self parameter.',
    ],
    solution: `First, a method is defined inside an impl block, so it is namespaced to the type: anyone reading Rectangle sees area as part of its capabilities, which keeps related behavior organized with the data. Second, the method takes self (here &self) automatically, so you call it as rect.area() with cleaner syntax and Rust knows the receiver type, enabling method chaining and not requiring you to repeat the type in every signature. Methods make code more discoverable and read more naturally than passing the value as a regular argument.`,
    tags: ['methods', 'impl', 'compare'],
  },
  {
    id: 'rs-ch05-t-009',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why area Takes &self',
    prompt: `In the book's Rectangle area method, the signature is fn area(&self) -> u32. Why is &self the right choice here rather than self or &mut self?`,
    hints: [
      'Does area change the rectangle?',
      'Does it need to consume the rectangle?',
    ],
    solution: `area only reads the width and height to compute a value; it does not modify the rectangle and it does not need to take ownership of it. &self borrows the instance immutably, which is the least-privilege choice that still lets the method read the fields. Using self would move (consume) the rectangle so the caller could no longer use it afterward, and &mut self would needlessly demand a mutable borrow. So &self correctly signals "I just look at this value".`,
    tags: ['methods', 'self', 'borrowing'],
  },
  {
    id: 'rs-ch05-t-010',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predict the can_hold Output',
    prompt: `Given Rectangle with width and height and a method can_hold(&self, other: &Rectangle) -> bool that returns true when self is strictly larger in both dimensions, what does this print?

    let a = Rectangle { width: 30, height: 50 };
    let b = Rectangle { width: 10, height: 40 };
    let c = Rectangle { width: 60, height: 45 };
    println!("{} {}", a.can_hold(&b), a.can_hold(&c));

Explain the second result.`,
    hints: [
      'Both width AND height of self must exceed the other.',
      'Compare a against c dimension by dimension.',
    ],
    solution: `It prints "true false". For a.can_hold(&b): 30 > 10 and 50 > 40, both true, so the result is true. For a.can_hold(&c): a's width 30 is not greater than c's width 60, so even though 50 > 45, the AND of both comparisons is false. can_hold requires self to be larger in both dimensions, and failing either one makes the whole result false.`,
    tags: ['methods', 'rectangle', 'predict-output'],
  },
  {
    id: 'rs-ch05-t-011',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Associated Function as Constructor',
    prompt: `Rectangle has an associated function fn square(size: u32) -> Self that builds a square. Why does calling it use Rectangle::square(3) rather than some_instance.square(3), and what does Self mean in the return type?`,
    hints: [
      'Look at whether square takes self.',
      'Self refers to the impl block type.',
    ],
    solution: `square does not take self as a parameter, so it is an associated function rather than a method; it is not called on an existing instance. You call associated functions with the type and the :: syntax, here Rectangle::square(3). Self in the return type is an alias for the type the impl block is for, so it means Rectangle. Such functions are commonly used as constructors that build and return a new instance of the type.`,
    tags: ['associated-functions', 'constructor', 'self-type'],
  },
  {
    id: 'rs-ch05-t-012',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Unit-Like Struct',
    prompt: `What is a unit-like struct, how do you define and instantiate one, and give one reason you might want a type that holds no data at all.`,
    hints: [
      'It has no fields, like the unit value ().',
      'Such types are useful when you implement behavior on them.',
    ],
    solution: `A unit-like struct is a struct with no fields, defined as struct AlwaysEqual; and instantiated simply by writing let subject = AlwaysEqual;. Because it stores no data, every instance is the same. You might want one when you need a named type to attach behavior or a trait implementation to, but there is no per-instance state to store. It acts as a marker type whose value is its identity rather than any contained data.`,
    tags: ['unit-struct', 'definition', 'when-to-use'],
  },
  {
    id: 'rs-ch05-t-013',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Pretty Debug Printing',
    prompt: `For a derived-Debug struct r, contrast the output style of println!("{:?}", r) with println!("{:#?}", r). When would you reach for the second form?`,
    hints: [
      'One prints on a single line, the other expands.',
      'Think about readability for large or nested structs.',
    ],
    solution: `{:?} prints the struct compactly on one line, like Rectangle { width: 30, height: 50 }. {:#?} is the pretty-printing variant: it expands each field onto its own indented line, which is much easier to scan for large structs or nested data. You reach for {:#?} when the value is big or deeply nested and you want a readable, vertically laid-out dump while debugging. Both require the type to implement Debug, typically via #[derive(Debug)].`,
    tags: ['debug', 'formatting', 'compare'],
  },
  {
    id: 'rs-ch05-t-014',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Move on Struct Update',
    prompt: `After this code, can you still use user1.username?

    let user2 = User {
        email: String::from("z@x.com"),
        ..user1
    };

Assume User has fields username: String, email: String, active: bool, sign_in_count: u64. Explain what moved and what (if anything) is still usable.`,
    hints: [
      'Struct update can move owned fields out of user1.',
      'Which fields are Copy and which are not?',
    ],
    solution: `No, user1.username is no longer usable. Struct update syntax with ..user1 moves the fields it pulls from user1 into user2. Since username is a String (not Copy), it is moved out of user1, which invalidates user1 as a whole for field access of moved data. The active (bool) and sign_in_count (u64) fields are Copy, so those values were copied rather than moved, but because the non-Copy String was moved, you cannot use user1 to access username anymore. If you had supplied a new String for username explicitly, user1 would remain fully usable.`,
    tags: ['update-syntax', 'ownership', 'move'],
  },
  {
    id: 'rs-ch05-t-015',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Mutating Method Needs &mut self',
    prompt: `You write a method that doubles a rectangle's width in place:

    fn double_width(&self) {
        self.width = self.width * 2;
    }

It will not compile. Explain the error and the fix, including any requirement that change places on the caller.`,
    hints: [
      'The method changes a field through self.',
      'An immutable borrow cannot assign to fields.',
    ],
    solution: `It fails because &self is an immutable borrow, and you cannot assign to self.width through it; the compiler reports that self is not a mutable reference. The fix is to take &mut self: fn double_width(&mut self) { self.width = self.width * 2; }. That also requires the caller to hold the instance in a mutable binding, e.g. let mut r = ...; r.double_width();. A method that changes the instance must borrow it mutably, and that mutability requirement propagates to how the caller stores the value.`,
    tags: ['methods', 'mutability', 'compile-error'],
  },
  {
    id: 'rs-ch05-t-016',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Methods With Extra Parameters',
    prompt: `Design (in words and a signature) a method on Rectangle named scale that multiplies both dimensions by a given factor and returns a brand-new Rectangle, leaving the original unchanged. Decide which form of self it should take and justify it.`,
    hints: [
      'It reads the original but must not modify it.',
      'It produces a new value rather than editing in place.',
    ],
    solution: `Because scale reads the original's fields but must not change them, and it returns a new instance, it should borrow with &self and take the factor as an extra parameter:

    fn scale(&self, factor: u32) -> Rectangle {
        Rectangle { width: self.width * factor, height: self.height * factor }
    }

&self is right since we only read self to compute the new values; we do not need ownership or mutation. The extra parameter factor comes after self in the parameter list, and the method constructs and returns a fresh Rectangle, so the caller's original is left intact.`,
    tags: ['methods', 'parameters', 'design'],
  },
  {
    id: 'rs-ch05-t-017',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Multiple impl Blocks',
    prompt: `Is it legal to split a type's methods across two separate impl Rectangle { ... } blocks? Explain whether this changes behavior, and give a realistic reason you might choose to do so.`,
    hints: [
      'Each impl block adds methods to the same type.',
      'Think about organization and later chapters with generics/traits.',
    ],
    solution: `Yes, it is perfectly legal to have multiple impl blocks for the same type, and it does not change behavior: the methods defined across all blocks are simply all available on the type. A realistic reason is organization, for example grouping related methods together, or separating methods that depend on different conditions. The book notes there is no need to do this for a simple type, but the syntax is valid and becomes genuinely useful later with generic types and trait implementations, where separate blocks naturally arise.`,
    tags: ['impl', 'organization', 'fill-in-the-rule'],
  },
  {
    id: 'rs-ch05-t-018',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'dbg! vs println! for Debugging',
    prompt: `Contrast the dbg! macro with println!("{:?}", value) for inspecting a value mid-expression. Mention where each writes its output and what dbg! returns.`,
    hints: [
      'One returns ownership of its argument; one borrows for formatting.',
      'Think about stdout vs stderr and printed file/line info.',
    ],
    solution: `dbg! takes ownership of its argument, prints the file and line number plus the expression and its value (using Debug formatting), and then returns ownership of that value, so you can wrap it around a sub-expression like width: dbg!(30 * scale) and keep using the result. println! with {:?} only borrows the value to format it and returns nothing useful, just printing the text you specify. Importantly, dbg! writes to the standard error stream (stderr), whereas println! writes to standard output (stdout); this lets you keep debug noise out of a program's real output. dbg! is handy precisely because it can be inserted inline without breaking the surrounding expression.`,
    tags: ['debug', 'dbg', 'compare'],
  },
  {
    id: 'rs-ch05-t-019',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Constructor Plus Field Init Shorthand',
    prompt: `Explain how field init shorthand and an associated-function constructor combine. Write a new(width, height) associated function for Rectangle that uses the shorthand, and say why the parameter names matter.`,
    hints: [
      'No self parameter means it is an associated function.',
      'Match parameter names to field names to enable shorthand.',
    ],
    solution: `An associated-function constructor has no self and returns Self, and inside it you can use field init shorthand when the parameter names match the field names. For example:

    impl Rectangle {
        fn new(width: u32, height: u32) -> Self {
            Self { width, height }
        }
    }

The parameter names width and height matter because the shorthand only applies when the in-scope variable name equals the field name; if you named them w and h you would have to write Self { width: w, height: h }. Combining the two keeps constructors concise and readable.`,
    tags: ['associated-functions', 'shorthand', 'construction'],
  },
  {
    id: 'rs-ch05-t-020',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'References in a Struct Field',
    prompt: `A learner tries:

    struct Holder {
        name: &str,
    }

The compiler complains about a missing lifetime specifier. Using only what chapter 5 teaches, what is the simplest practical choice for the field type so the struct owns its data, and why is owning preferred here?`,
    hints: [
      'Storing a reference would require lifetime annotations (a later topic).',
      'Owned String avoids that for now.',
    ],
    solution: `The error appears because storing a reference (&str) in a struct requires a lifetime annotation so the compiler can ensure the referenced data outlives the struct, which is a later-chapter topic. For now the simplest practical choice is to make the field own its data by using String instead of &str: struct Holder { name: String }. An owning struct is valid for as long as the whole struct is, with no borrowed data to track. The book deliberately uses owned types like String in chapter 5 to sidestep lifetimes until they are introduced.`,
    tags: ['structs', 'ownership', 'fill-in-the-rule'],
  },
  {
    id: 'rs-ch05-t-021',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Borrow Checker on Method Return',
    prompt: `A method fn width(&self) -> &u32 returns a reference to a field. Sketch what the borrow checker guarantees about the returned reference relative to the instance it came from, and why you typically cannot mutate the rectangle while that reference is alive.`,
    hints: [
      'The returned reference borrows from self.',
      'A shared borrow and a mutation cannot overlap.',
    ],
    solution: `The returned &u32 borrows from self, so the borrow checker ties its validity to the borrow of the instance: the reference cannot outlive the rectangle, and while it is in use the rectangle is considered immutably borrowed. That means you cannot take a mutable borrow of the rectangle (for example to change its width) at the same time, because Rust forbids a mutable borrow overlapping with any shared borrow. Once the returned reference is no longer used, the shared borrow ends and you are free to mutate again. This is the same aliasing rule from chapter 4 applied to data borrowed out of a struct via a method.`,
    tags: ['methods', 'borrowing', 'borrow-checker'],
  },
  {
    id: 'rs-ch05-t-022',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Missing Field at Construction',
    prompt: `This does not compile:

    struct Config {
        retries: u32,
        verbose: bool,
        name: String,
    }

    let c = Config {
        retries: 3,
        verbose: true,
    };

What is the error, and what are the two valid ways to satisfy the compiler here?`,
    hints: [
      'Every field must get a value at construction.',
      'You can supply it directly or copy it from another instance.',
    ],
    solution: `The error is that the field name is missing: when you construct a struct directly you must provide a value for every field. The first fix is to supply it explicitly, e.g. add name: String::from("default"),. The second valid way is to fill the rest from an existing instance with struct update syntax, e.g. ..other_config, which would copy name (and any other unspecified fields) from that instance. Rust does not allow partially-initialized structs, so one of these must cover the missing field.`,
    tags: ['structs', 'construction', 'compile-error'],
  },
  {
    id: 'rs-ch05-t-023',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Self-Consuming Builder Method',
    prompt: `Compare two designs for a method that "finalizes" a Rectangle by returning a tweaked version: one takes self by value (fn finalize(self) -> Rectangle), the other takes &self (fn finalize(&self) -> Rectangle). Discuss the ownership consequences for the caller of each, and when the by-value form is the better choice.`,
    hints: [
      'By value moves the original into the method.',
      'By reference leaves the caller still owning the original.',
    ],
    solution: `With fn finalize(self), calling r.finalize() moves r into the method, so the caller can no longer use r afterward; the method fully owns the instance and can reuse its fields (including moving out a String) without cloning. With fn finalize(&self), the caller still owns r after the call, and the method may only read fields, so producing a new Rectangle from non-Copy fields would require cloning them. The by-value form is better when the original should be consumed/transformed and you want to avoid clones, which is the typical pattern for builder-style transformations that yield the next stage. The by-reference form is better when the caller must keep using the original.`,
    tags: ['methods', 'ownership', 'design'],
  },
  {
    id: 'rs-ch05-t-024',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why Copy Is Not Derived Here',
    prompt: `A struct deriving only Debug holds a String field. A teammate adds #[derive(Copy, Clone)] and it fails to compile. Explain why a struct containing a String cannot be Copy, and what the implication is for passing such a struct by value into a function.`,
    hints: [
      'Copy requires every field to be Copy.',
      'String owns a heap allocation, so it is not Copy.',
    ],
    solution: `Copy can only be derived when every field is itself Copy, and String is not Copy because it owns a heap allocation that must not be duplicated by a simple bitwise copy. So a struct containing a String cannot be Copy. The implication is that passing such a struct by value moves it (rather than copying), transferring ownership: after the call the original binding is no longer usable unless the function returns the value back or you Clone it beforehand. This is the same move-vs-copy distinction from chapter 4, now applied at the level of a whole struct.`,
    tags: ['structs', 'ownership', 'copy'],
  },
  {
    id: 'rs-ch05-t-025',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Method vs Field Name Collision',
    prompt: `Rectangle has a field width: u32 and also a method fn width(&self) -> bool that returns whether the width is greater than zero. How does Rust tell the two apart when you write rect.width versus rect.width(), and why is this pattern (a getter with the same name as a field) sometimes useful?`,
    hints: [
      'Parentheses signal a method call.',
      'Fields can be private; getters control access.',
    ],
    solution: `Rust distinguishes them by syntax: rect.width with no parentheses accesses the field and yields the u32, while rect.width() with parentheses calls the method and yields the bool. Because they are disambiguated this way, a field and a method may share a name without conflict. This same-name getter pattern is useful when you want to make a field private (covered with modules later) but still expose read access through a method, letting callers use rect.width() while the field itself stays controlled; it gives you a stable public interface even if the internal field changes.`,
    tags: ['methods', 'fields', 'design'],
  },
  {
    id: 'rs-ch05-t-026',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Automatic Referencing in Method Calls',
    prompt: `Rust has no -> operator like C; instead method calls use automatic referencing. Given a method fn area(&self) -> u32 and a value r: Rectangle, explain what the compiler inserts when you write r.area(), and what it would insert if you instead had a reference and called it.`,
    hints: [
      'The method wants &self, so the receiver must become a reference.',
      'Rust adds &, &mut, or * to match the method signature.',
    ],
    solution: `When you write r.area() and area takes &self, the compiler automatically inserts the reference: it treats the call as (&r).area(), adding the & needed to match the &self receiver. This automatic referencing (and dereferencing) means Rust adds &, &mut, or * as required so the receiver matches the method's self type. If you already had a reference rref: &Rectangle and called rref.area(), no extra borrow is needed because rref is already a &Rectangle matching &self. This is why Rust does not need a separate arrow operator: the receiver is adjusted automatically based on the method signature.`,
    tags: ['methods', 'auto-ref', 'self'],
  },
  {
    id: 'rs-ch05-t-027',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Predict dbg! Output and Value',
    prompt: `Consider:

    #[derive(Debug)]
    struct Rectangle { width: u32, height: u32 }

    let scale = 2;
    let rect = Rectangle {
        width: dbg!(30 * scale),
        height: 50,
    };
    dbg!(&rect);

Describe (a) what value ends up in rect.width, and (b) why the second dbg! takes &rect rather than rect.`,
    hints: [
      'dbg! returns the value of the expression it wraps.',
      'Taking ownership of rect would move it out.',
    ],
    solution: `(a) dbg!(30 * scale) evaluates 30 * 2 = 60, prints that value with its file/line to stderr, and then returns 60, so rect.width is 60. (b) dbg! takes ownership of its argument and returns it; if you wrote dbg!(rect) it would move rect into the macro. By passing &rect you let dbg! borrow the rectangle to print it (Debug works fine through a reference) and return that reference, so rect remains owned and usable afterward. The output shows the expression text and the Debug-formatted value for each dbg! call.`,
    tags: ['debug', 'dbg', 'predict-output'],
  },
  {
    id: 'rs-ch05-t-028',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Choosing self, &self, or &mut self',
    prompt: `State the rule of thumb for picking among self, &self, and &mut self for a method. Then classify each: (1) a method that reports area, (2) a method that resets all fields to zero, (3) a method that converts the value into a different owned type and should consume the original.`,
    hints: [
      'Read-only -> shared borrow; modify -> mutable borrow; consume -> by value.',
      'Match the privilege to what the method actually does.',
    ],
    solution: `The rule of thumb: take &self when the method only reads the instance, &mut self when it needs to modify the instance in place, and self (by value) when it needs to consume or transform the instance, typically returning something new from its parts. Applying it: (1) reporting area only reads, so &self; (2) resetting all fields modifies in place, so &mut self; (3) converting into a different owned type while consuming the original takes self by value, since after conversion the original should no longer exist. Choosing the least privilege that still does the job keeps the API flexible for callers.`,
    tags: ['methods', 'self', 'fill-in-the-rule'],
  },
  {
    id: 'rs-ch05-t-029',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Struct vs Tuple Struct vs Tuple Design',
    prompt: `You are modeling a 2D coordinate used throughout a geometry library. Argue for one of three representations: a named-field struct Point { x: f64, y: f64 }, a tuple struct Point(f64, f64), or a plain tuple (f64, f64). Give the main trade-off that decides it.`,
    hints: [
      'Named fields document meaning; tuple structs give a type but index access.',
      'Plain tuples have no distinct type and no field names.',
    ],
    solution: `For a coordinate used pervasively, the named-field struct Point { x: f64, y: f64 } is usually best: the field names x and y document meaning, prevent accidentally swapping the two values, and read clearly as p.x and p.y. A tuple struct Point(f64, f64) still gives you a distinct, type-checked Point (so it cannot be confused with other f64 pairs) but forces index access p.0/p.1, which is less self-documenting; it is a fine choice when names would be noise. A plain (f64, f64) is the weakest: it has no name, so it is interchangeable with any other f64 pair and offers no domain meaning. The deciding trade-off is clarity and type safety (favoring the named struct) versus brevity, and for a widely-used domain concept clarity wins.`,
    tags: ['structs', 'tuple-structs', 'design'],
  },
  {
    id: 'rs-ch05-t-030',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Refactoring Loose Args Into Methods',
    prompt: `An area-calculation program starts with separate width and height variables, then groups them into a tuple, then into a struct, and finally adds an area method. Summarize what each refactoring step improves, and why the final method-on-struct form is the most maintainable.`,
    hints: [
      'Separate variables lose the relationship; a tuple groups but loses names.',
      'A struct names fields; a method ties behavior to the data.',
    ],
    solution: `Separate width and height variables work but do not express that the two belong together, so a reader cannot tell they form a rectangle and the area function's parameters could be swapped. Grouping them into a tuple ties them into one value, but the elements are only indexed (.0, .1), so the meaning of each is unclear. Wrapping them in a struct adds names (width, height), making the code self-documenting and the type meaningful. Finally, defining area as a method on that struct keeps the behavior together with the data, namespaces it to Rectangle, and lets callers write rect.area(); this is the most maintainable form because the data, its meaning, and its operations all live in one cohesive type.`,
    tags: ['structs', 'methods', 'design'],
  },
]

export default problems
