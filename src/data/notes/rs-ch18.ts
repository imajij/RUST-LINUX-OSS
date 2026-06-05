import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-18',
  track: 'rust',
  chapter: 18,
  title: 'Patterns and Matching',
  summary: `Patterns are a small language inside Rust for matching against the shape of a value and, in the same step, binding parts of it to names. You have already met patterns informally in match and let, but this chapter pins down the full grammar and every place patterns are allowed: match arms, if let, while let, for loops, let statements, and function parameters. The central distinction is between irrefutable patterns, which always match, and refutable patterns, which can fail; getting that distinction right is what makes destructuring, guards, ranges, and at-bindings click. Mastering patterns is essential for reading idiomatic Rust, because the language leans on them everywhere control flow meets data, including the standard library and the Rust-for-Linux codebase.`,
  sections: [
    {
      heading: 'What a pattern is, and everywhere it can appear',
      body: `A **pattern** is a description of the shape a value can take. When Rust matches a value against a pattern, two things can happen at once: the engine checks whether the value has that shape, and it **binds** the interesting pieces of the value to names you choose. Patterns are made of literals, destructured arrays/structs/enums/tuples, variables, wildcards, and placeholders, combined in nested ways. The power comes from doing the structural check and the extraction in a single expressive step.

You have already been using patterns without naming them: every let binding, every function parameter, and every match arm contains a pattern on the left. This chapter collects all six places patterns appear so you can recognize them as the same mechanism.

### The six places patterns appear
1. **match arms.** The most visible use. A match takes a value and a series of arms, each an arm-pattern plus code. match is **exhaustive**: the arms must cover every possible value, which is what makes match a powerful safety tool. The catch-all underscore pattern handles the remaining cases.
2. **if let expressions.** Shorthand for a match that cares about only one pattern and ignores the rest. if let can be paired with else, and with else if and else if let, giving you flexible, non-exhaustive conditionals that the compiler does not force to be complete.
3. **while let loops.** Runs the loop body as long as a pattern keeps matching, which is perfect for draining a queue, stack, or channel until it yields None.
4. **for loops.** The variable right after for is a pattern. for (index, value) in collection.iter().enumerate() destructures each item of the iterator into two bound names.
5. **let statements.** Every let is let PATTERN = EXPRESSION. let x = 5 is the trivial case where the pattern is just the name x, but you can destructure a tuple or struct directly in a let.
6. **function parameters.** Each parameter is a pattern, so a function can destructure its argument in the signature, for example fn print_point((x, y): (i32, i32)). Closure parameters work the same way.

The unifying idea: anywhere Rust accepts a binding, it actually accepts a pattern. Recognizing this turns a dozen special cases into one consistent rule.`,
      code: [
        {
          lang: 'rust',
          src: `fn print_coordinates(&(x, y): &(i32, i32)) {
    // A function parameter is a pattern; we destructure the tuple here.
    println!("at ({}, {})", x, y);
}

fn main() {
    // let is let PATTERN = EXPRESSION; destructure a tuple directly.
    let (a, b, c) = (1, 2, 3);
    println!("{a} {b} {c}");

    // for binds a pattern to each item of the iterator.
    let v = vec!['x', 'y', 'z'];
    for (index, value) in v.iter().enumerate() {
        println!("{value} is at index {index}");
    }

    // function parameter pattern.
    print_coordinates(&(3, 5));
}`
        }
      ]
    },
    {
      heading: 'Refutable vs irrefutable patterns',
      body: `Every pattern is one of two kinds, and this single distinction explains which patterns are allowed in which place.

- An **irrefutable** pattern matches **any** possible value of the type. It can never fail. The name x in let x = 5 is irrefutable: whatever the value is, it binds. A tuple pattern like (a, b) for a value of type (i32, i32) is also irrefutable, because every value of that type has exactly two fields.
- A **refutable** pattern can **fail** to match for some values. Some(x) is refutable because the value might be None instead. A literal like 3 is refutable because the value might be 4.

### Which places require which kind
The places that must always bind something accept **only irrefutable** patterns, because there is no sensible behavior if the match fails. These are: let statements, function parameters, and for loops. If the pattern could fail, what would the program do with a value that does not match? There is no else branch to fall into, so the compiler rejects refutable patterns there.

The places that are designed to handle a failed match accept **refutable** patterns: the arms of a match (other than a final catch-all), if let, and while let. These constructs have a built-in path for "did not match," so a pattern that can fail is exactly what they want.

### The compiler errors you will hit, and how to read them
- Putting a refutable pattern where an irrefutable one is required, such as let Some(x) = some_option, is an error: the compiler says refutable patterns are not allowed and suggests using let-else or if let. The fix is to use if let Some(x) = ... and handle the None case, or use let-else to bind or diverge.
- Putting an irrefutable pattern in if let, such as if let x = 5, triggers a warning that the if let is **irrefutable**, meaning the condition can never be false, so the if let is pointless. Use a plain let instead.

Internalizing refutability removes most confusion about why a pattern is accepted in one spot but rejected in another. The rule is mechanical: can this pattern fail, and does this position tolerate failure?`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let some_value: Option<i32> = Some(7);

    // ERROR if uncommented: Some(x) is refutable, let needs irrefutable.
    // let Some(x) = some_value;

    // Fix 1: if let tolerates failure (refutable position).
    if let Some(x) = some_value {
        println!("got {x}");
    }

    // Fix 2: let-else binds on success, diverges on failure.
    let Some(y) = some_value else {
        println!("was None, returning");
        return;
    };
    println!("y = {y}");

    // Irrefutable pattern in if let would warn (condition is always true):
    // if let z = 5 { println!("{z}"); }  // use plain let z = 5; instead.
}`
        }
      ]
    },
    {
      heading: 'Matching literals, named variables, multiple patterns, and ranges',
      body: `The simplest patterns match against fixed or named pieces of data, and they have a few sharp edges worth memorizing.

### Matching literals
You can match a value directly against a literal: numbers, characters, booleans, and string-slice literals. This is handy for branching on specific constants, and it reads like a switch statement, except match is exhaustive so you must cover the rest with a catch-all.

### Named variables, and the shadowing trap
A bare name in a pattern is a **new binding** that captures whatever it matches. Inside a match, this is one of the most common beginner pitfalls: a name in an arm pattern does **not** compare against an outer variable of the same name; it **shadows** it and binds the matched value. So matching Some(y) when an outer y already exists creates a fresh y scoped to that arm, capturing the inner value, not testing equality with the outer y. To compare against an existing value, you need a **match guard** (covered later) or a literal, not a bare name. This shadowing is scoped to the arm and ends when the arm does, which can be surprising the first time it bites you.

### Multiple patterns with the or operator
In a match arm you can match several patterns with the pipe, which reads as "or." An arm written 1 | 2 matches either 1 or 2. This keeps arms compact when different inputs share the same handling.

### Ranges with the inclusive range pattern
The pattern a..=b matches any value in the **inclusive** range from a to b. Ranges are only allowed for types the compiler can determine are non-empty and orderable in this context, namely numeric types (such as integers) and char. A char range like 'a'..='j' matches lowercase letters in that span. Ranges are more concise than spelling out a long pipe chain. Note that pattern ranges use the inclusive ..= form; the exclusive .. range is not a pattern here.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let x = 5;

    // Literals, multiple patterns (or), and a catch-all.
    match x {
        1 => println!("one"),
        2 | 3 => println!("two or three"),
        4..=6 => println!("four through six"),       // inclusive numeric range
        _ => println!("something else"),
    }

    // Shadowing trap: the y in Some(y) is a NEW binding, not the outer y.
    let outer = Some(10);
    let y = 99;
    match outer {
        Some(y) => println!("inner y = {y}"),         // prints 10, not 99
        None => println!("none"),
    }
    println!("outer y is still {y}");                  // 99, unchanged

    // char ranges work too.
    let c = 'g';
    match c {
        'a'..='j' => println!("early letter"),
        'k'..='z' => println!("late letter"),
        _ => println!("not lowercase ascii"),
    }
}`
        }
      ]
    },
    {
      heading: 'Destructuring structs, enums, tuples, and nested shapes',
      body: `Patterns shine when you take a compound value apart. Destructuring lets you reach into structs, enums, tuples, and arbitrarily nested combinations, binding exactly the fields you care about in one expression.

### Destructuring structs
A struct pattern lists the field names in braces and binds each to a variable. The shorthand reuses the field name as the binding name, so Point { x, y } binds x and y. You can also rename, as in Point { x: a, y: b }, which binds the x field to a and the y field to b. A powerful variant matches some fields against literals while binding others: Point { x, y: 0 } matches only points on the x axis and binds x.

### Destructuring enums
Each enum variant has its own internal shape, and the pattern for a variant mirrors how the variant was defined. A unit variant like Message::Quit matches with no inner pattern. A struct-like variant matches with braces and field names. A tuple-like variant matches with parentheses and positional bindings. This is why match over an enum reads so naturally: each arm describes one variant and pulls out its payload.

### Destructuring tuples and references
Tuple patterns use parentheses and bind by position. When you match a reference to a value, the destructured fields are themselves references unless you arrange otherwise; matching &(x, y) destructures through the reference so x and y are values.

### Nested and mixed destructuring
You can nest these freely: a struct containing an enum containing a tuple is matched with one nested pattern. This combination is the everyday workhorse of Rust code, letting one match arm describe a deep shape and extract precisely the leaves you need. The compiler still checks exhaustiveness across all the nesting, so you cannot forget a case.`,
      code: [
        {
          lang: 'rust',
          src: `struct Point { x: i32, y: i32 }

enum Message {
    Quit,
    Move { x: i32, y: i32 },          // struct-like variant
    Write(String),                    // tuple-like variant
    ChangeColor(i32, i32, i32),
}

fn main() {
    // Struct destructuring with shorthand and with a literal match.
    let p = Point { x: 0, y: 7 };
    let Point { x, y } = p;           // irrefutable: binds x = 0, y = 7
    println!("{x}, {y}");

    match (Point { x: 4, y: 0 }) {
        Point { x, y: 0 } => println!("on the x axis at {x}"),
        Point { x: 0, y } => println!("on the y axis at {y}"),
        Point { x, y } => println!("elsewhere at ({x}, {y})"),
    }

    // Enum destructuring: each arm mirrors the variant's definition.
    let msg = Message::ChangeColor(0, 160, 255);
    match msg {
        Message::Quit => println!("quit"),
        Message::Move { x, y } => println!("move to ({x}, {y})"),
        Message::Write(text) => println!("write: {text}"),
        Message::ChangeColor(r, g, b) => println!("color {r},{g},{b}"),
    }
}`
        }
      ]
    },
    {
      heading: 'Ignoring values: underscore, prefixed names, and the rest pattern',
      body: `Often you only want some of a value. Rust gives you several precise ways to ignore the parts you do not need, and the differences between them matter for ownership and warnings.

### A whole value with underscore
A bare underscore matches anything and **binds nothing**. As a match arm it is the catch-all that makes a match exhaustive without naming the value. As a function parameter it documents that an argument is intentionally unused, which is common when implementing a trait whose signature requires a parameter you do not need. Because underscore binds nothing, it also never moves the value, which is sometimes the whole point.

### Parts of a value with nested underscore
You can place underscore inside a larger pattern to ignore just one position: Some(_) checks that you have a Some without caring about the inner value, and a tuple pattern (first, _, third) skips the middle element. This lets you assert structure while discarding the noise.

### An unused name with a leading underscore
Naming a binding _name still **binds** the value but suppresses the unused-variable warning. This is different from a bare underscore in a crucial way: _name takes ownership of the value (it is a real binding), whereas _ does not bind at all. So if you write let _s = some_string, _s owns the String and the original is moved; but let _ = some_string does not move it. Reach for a leading-underscore name when you want the binding to exist (perhaps for a Drop side effect or future use) but do not want the warning; reach for bare underscore when you truly do not want a binding.

### Many values with the rest pattern
Two dots, the **rest** pattern, ignores the remaining parts of a value you have not explicitly matched. In a tuple you can write (first, .., last) to bind the ends and skip everything between, or Struct { important, .. } to grab one field and ignore all the rest of a large struct. The rest pattern must be **unambiguous**: you cannot write (.., middle, ..) because the compiler cannot tell which elements the middle refers to. Used carefully, it keeps patterns focused on the fields that matter.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // Bare underscore in a nested position: care that it is Some, ignore inner.
    let setting: Option<i32> = Some(5);
    let new_value: Option<i32> = None;
    match (setting, new_value) {
        (Some(_), Some(_)) => println!("can't overwrite an existing value"),
        _ => println!("setting is being changed"),
    }

    // Ignore the middle of a tuple.
    let numbers = (2, 4, 8, 16, 32);
    match numbers {
        (first, _, third, _, fifth) => println!("{first} {third} {fifth}"),
    }

    // The rest pattern: bind ends, ignore the middle.
    match numbers {
        (first, .., last) => println!("first {first}, last {last}"),
    }

    // Leading-underscore name BINDS (and moves); bare underscore does not.
    let s = Some(String::from("hi"));
    if let Some(_) = s {
        // s was not moved here because _ binds nothing.
        println!("still have s: {s:?}");
    }
}`
        }
      ]
    },
    {
      heading: 'Match guards: extra conditions on an arm',
      body: `A **match guard** is an additional if condition placed after a pattern in a match arm. The arm is chosen only if the pattern matches **and** the guard expression is true. Guards let you express conditions that a pattern alone cannot, because patterns can only test structure and literals, not arbitrary runtime comparisons.

### Why guards exist: the shadowing problem they solve
Recall that a bare name in a pattern shadows rather than compares. So you cannot test "does this Some hold the same value as an outer variable" with a pattern alone, because the binding would just capture the inner value. A guard fixes this: match against Some(n) to bind the inner value, then add a guard if n == outer to compare it with the outer variable that is still in scope. The guard runs ordinary code, so the outer variable is visible and the comparison works as you intend. This is the canonical reason guards are needed.

### Guards interact with the or operator across the whole arm
When a guard is attached to an arm that uses the pipe (or) operator, the guard applies to the **entire** combined pattern, not just the last alternative. So an arm written 4 | 5 | 6 if cond is read as "(4 or 5 or 6) and cond," meaning the guard must hold for any of the three to be selected. Misreading this as binding the guard only to the final 6 is a common and costly mistake; the precedence groups the whole or-list together with the guard.

### The cost of guards
A downside of guards is that the compiler cannot use them when checking **exhaustiveness**. The exhaustiveness analysis only sees the patterns, not the guard conditions, so it cannot prove that a set of guarded arms covers every case. You may therefore still need a catch-all arm even when, logically, your guards already cover everything. This is a deliberate, conservative choice that keeps the checker sound.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let num = Some(4);

    // Guard adds a runtime test the pattern alone cannot express.
    match num {
        Some(x) if x % 2 == 0 => println!("{x} is even"),
        Some(x) => println!("{x} is odd"),
        None => println!("nothing"),
    }

    // Using a guard to compare against an OUTER variable (avoids shadowing).
    let outer = 5;
    let value = Some(5);
    match value {
        Some(n) if n == outer => println!("matched the outer value {n}"),
        Some(n) => println!("got {n}, not {outer}"),
        None => println!("none"),
    }

    // A guard with the or operator applies to the WHOLE pattern: (4|5|6) && yes.
    let x = 4;
    let yes = false;
    match x {
        4 | 5 | 6 if yes => println!("a number and yes"),
        _ => println!("guard was false, so this arm wins"),
    }
}`
        }
      ]
    },
    {
      heading: 'At-bindings: testing and capturing at once',
      body: `The **at operator**, written with the @ symbol, lets you create a binding for a value **at the same time** that you test it against a pattern. Normally you face a choice: a pattern like a range tests the value but does not give you a name for it, while a bare name binds the value but does not test it. The at-binding gives you both: name @ subpattern binds the matched value to name and also requires it to match subpattern.

### Why you need it
Suppose you want an arm that fires only when an id is in a certain range, and inside that arm you also want to use the exact id value. The range pattern 3..=7 tests the range but provides no binding, so you cannot reference the value. Writing the bare name id would bind the value but lose the range test. The expression id @ 3..=7 does both: it checks that the value is in 3 through 7 and binds it to id so the arm body can use the concrete number. Without @ you would have to either give up the binding or give up the structural test.

### How it reads
Read name @ pattern as "bind this value to name, provided it also matches pattern." The subpattern after @ can be a range, a literal, or another structural pattern. This composes with everything else, so you can nest an at-binding deep inside a struct or enum pattern to capture one field while constraining its shape.

### When to reach for it
Use an at-binding whenever an arm needs **both** a structural or range test **and** the concrete value. It is especially common with numeric ranges and with capturing an entire sub-value while still pattern-matching its parts. Recognizing @ in real code (the standard library and kernel-adjacent Rust use it) tells you the author wanted the value and the guarantee that it has a certain shape, simultaneously.`,
      code: [
        {
          lang: 'rust',
          src: `enum Message {
    Hello { id: i32 },
}

fn main() {
    let msg = Message::Hello { id: 5 };

    match msg {
        // @ tests the range AND binds the value so we can use it.
        Message::Hello { id: id_var @ 3..=7 } => {
            println!("id in range: {id_var}");
        }
        // Range tested but value NOT bound: cannot name it in the body.
        Message::Hello { id: 8..=10 } => {
            println!("id in a different range");
        }
        // Value bound but no range test.
        Message::Hello { id } => {
            println!("some other id: {id}");
        }
    }
}`
        }
      ]
    }
  ],
  takeaways: [
    'A pattern checks the shape of a value and binds its parts to names in one step; this is the same mechanism behind let, function params, for, match, if let, and while let.',
    'Irrefutable patterns always match (let, function parameters, for); refutable patterns can fail (match arms, if let, while let). Using the wrong kind in a position is a compile error or a warning.',
    'A bare name in a pattern is a NEW binding that shadows any outer variable of the same name; it does not compare against it.',
    'Use the pipe operator for multiple patterns (or) and the inclusive ..= form for range patterns; ranges work for numeric types and char.',
    'Destructuring takes structs, enums, tuples, and nested shapes apart in one pattern; you can match some fields against literals while binding others.',
    'Bare underscore binds nothing and never moves the value; a leading-underscore name still binds and moves but suppresses the unused warning; the rest pattern (..) ignores the remaining parts.',
    'A match guard adds an if condition after a pattern, enabling tests patterns cannot express (like comparing to an outer variable); with the or operator the guard applies to the whole arm.',
    'Match guards are invisible to the exhaustiveness checker, so guarded arms may still require a catch-all even when they logically cover every case.',
    'The at operator (@) binds a value to a name while also testing it against a subpattern, giving you the value and the structural guarantee at once.'
  ],
  cheatsheet: [
    { label: 'match', value: 'Exhaustive pattern dispatch; arms take refutable patterns' },
    { label: 'if let / else', value: 'One-pattern conditional; refutable, not checked for exhaustiveness' },
    { label: 'while let', value: 'Loop while a refutable pattern keeps matching' },
    { label: 'let-else', value: 'Bind on match, diverge (return/break/panic) on failure' },
    { label: 'irrefutable', value: 'Always matches; required by let, fn params, for' },
    { label: 'refutable', value: 'Can fail; allowed in match arms, if let, while let' },
    { label: '_', value: 'Wildcard: matches anything, binds nothing, never moves' },
    { label: '_name', value: 'Binds (and moves) but silences unused-variable warning' },
    { label: '..', value: 'Rest pattern: ignore the remaining fields/elements' },
    { label: 'a | b', value: 'Multiple patterns: match a or b in one arm' },
    { label: 'a..=b', value: 'Inclusive range pattern (numeric or char only)' },
    { label: 'Struct { x, y: 0 }', value: 'Destructure: bind x, require field y equals 0' },
    { label: 'pat if cond', value: 'Match guard: extra runtime test; applies to whole arm' },
    { label: 'name @ pat', value: 'At-binding: bind to name and test against pat together' }
  ]
}

export default note
