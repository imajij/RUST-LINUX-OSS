import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch03-t-001',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Naming the mut Keyword',
    prompt: `A beginner writes:

    let score = 0;
    score = score + 10;

The compiler rejects the second line. What single keyword do they need to add, where does it go, and why is it required?`,
    hints: [
      'Bindings in Rust start out unchangeable.',
      'The keyword sits between let and the variable name.',
    ],
    solution: `They need the mut keyword, written as let mut score = 0;. By default every let binding is immutable, so reassigning score on the second line triggers "cannot assign twice to immutable variable". Adding mut opts that binding into mutability, after which score = score + 10; compiles. Rust makes immutability the default so that any value that is intended to change is marked explicitly.`,
    tags: ['variables', 'mutability', 'intro'],
  },
  {
    id: 'rs-ch03-t-002',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Does This Sum Print',
    prompt: `Predict the output:

    let a = 4;
    let b = 9;
    let total = a + b;
    println!("total is {total}");

State the printed line exactly.`,
    hints: [
      'Both values are integers, so add them normally.',
      'The {total} placeholder substitutes the variable named total.',
    ],
    solution: `It prints "total is 13". The bindings a and b hold 4 and 9, and total is bound to their sum, 13. The format string uses the inline named-argument form {total}, which captures the local variable total directly. So the single printed line is exactly: total is 13.`,
    tags: ['variables', 'predict-output', 'intro'],
  },
  {
    id: 'rs-ch03-t-003',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Spotting the Boolean Type',
    prompt: `Given:

    let is_ready = true;
    let is_done = false;

What is the type of these two variables, how many distinct values can that type hold, and what keyword would you NOT use to declare them as a global constant?`,
    hints: [
      'There are exactly two possible truth values.',
      'Global compile-time values use a different keyword than let.',
    ],
    solution: `Both variables have the type bool, which Rust infers from the literals true and false. The bool type can hold exactly two distinct values: true and false. If you wanted one as a global compile-time value you would use const, not let, because let cannot be used at module scope for a constant and const requires an explicit type, e.g. const IS_READY: bool = true;.`,
    tags: ['bool', 'types', 'intro'],
  },
  {
    id: 'rs-ch03-t-004',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Counting to Three With for',
    prompt: `What numbers does this loop print, and on how many lines?

    for n in 1..4 {
        println!("{n}");
    }

Explain whether 4 is included.`,
    hints: [
      'The two-dot range is exclusive at the top.',
      'Count each value the loop variable takes.',
    ],
    solution: `It prints 1, 2, and 3, each on its own line, for three lines total. The range 1..4 is a half-open (exclusive) range: it starts at 1 and stops before 4, so 4 itself is never produced. If you wanted 4 to be included you would write the inclusive range 1..=4 instead, which would print 1, 2, 3, 4.`,
    tags: ['for', 'ranges', 'intro'],
  },
  {
    id: 'rs-ch03-t-005',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Const Folding at Compile Time',
    prompt: `Why does this compile,

    const SECONDS_PER_HOUR: u32 = 60 * 60;

but this does NOT,

    const NOW: u32 = some_runtime_call();

even though both assign to a u32 constant?`,
    hints: [
      'A const value must be knowable before the program runs.',
      'Think about when each right-hand side can be evaluated.',
    ],
    solution: `A const must be initialized with a constant expression that the compiler can evaluate at compile time. The expression 60 * 60 is a fixed arithmetic computation the compiler can fold to 3600 immediately, so SECONDS_PER_HOUR is valid. By contrast some_runtime_call() can only be evaluated while the program is running, so it is not a constant expression and the compiler rejects it. Constants are baked into the binary, which is why their initializers cannot depend on runtime work.`,
    tags: ['const', 'compile-time', 'easy'],
  },
  {
    id: 'rs-ch03-t-006',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Shadowing Reuses the Name',
    prompt: `Trace the value of x:

    let x = 5;
    let x = x + 1;
    let x = x * 2;
    println!("{x}");

What prints, and explain why this is legal without mut.`,
    hints: [
      'Each let creates a brand-new binding.',
      'The new binding can use the old one in its expression.',
    ],
    solution: `It prints 12. Each let x = ... line shadows the previous x by creating a completely new binding that happens to reuse the name. So x starts at 5, then becomes 5 + 1 = 6, then becomes 6 * 2 = 12. This is legal without mut because shadowing is not mutation: rather than changing an existing variable, each line introduces a fresh immutable variable that the later code refers to.`,
    tags: ['shadowing', 'variables', 'easy'],
  },
  {
    id: 'rs-ch03-t-007',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why mut Cannot Change the Type',
    prompt: `This compiles:

    let spaces = "   ";
    let spaces = spaces.len();

But replacing it with let mut spaces = "   "; spaces = spaces.len(); fails. Explain the difference in one or two sentences.`,
    hints: [
      'Shadowing introduces a new binding, so it can have a new type.',
      'mut keeps the same binding, so the type must stay the same.',
    ],
    solution: `Shadowing creates a brand-new binding each time, so the second let spaces is free to have a different type (here usize from .len()) than the original &str. With let mut, there is only one binding whose type was fixed when it was first declared as &str, so assigning a usize to it is a type mismatch and the compiler rejects it. In short: shadowing can change the type, mut cannot.`,
    tags: ['shadowing', 'mutability', 'types', 'easy'],
  },
  {
    id: 'rs-ch03-t-008',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Floats Versus Integer Literals',
    prompt: `Compare these two bindings:

    let a = 7 / 2;
    let b = 7.0 / 2.0;

What value and type does each have, and why do they differ?`,
    hints: [
      'Integer division throws away the fractional part.',
      'A decimal point makes a floating-point literal.',
    ],
    solution: `a is 3 with type i32: both operands are integer literals, so this is integer division, which truncates 3.5 down to 3. b is 3.5 with type f64: the decimal points make both operands floating-point literals, so floating-point division keeps the fractional part. The difference is entirely about the operand types, not the operator: the same / symbol behaves differently for integers versus floats.`,
    tags: ['integers', 'floats', 'division', 'easy'],
  },
  {
    id: 'rs-ch03-t-009',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'A char Holds One Scalar',
    prompt: `Decide which of these are valid char literals and explain the rule:

    let a = 'z';
    let b = '5';
    let c = 'cat';
    let d = '😻';`,
    hints: [
      'char uses single quotes and holds exactly one Unicode scalar value.',
      'A multi-letter run of text is a different type.',
    ],
    solution: `a, b, and d are valid: a char is a single Unicode scalar value written in single quotes, so 'z', '5', and even the emoji '😻' each qualify. c is invalid because 'cat' is three characters, and a char must hold exactly one scalar value, not a sequence; that text would instead be a string literal "cat" with double quotes. So the rule is one scalar value per char, single quotes, with strings using double quotes for longer text.`,
    tags: ['char', 'types', 'easy'],
  },
  {
    id: 'rs-ch03-t-010',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Indexing Into a Tuple',
    prompt: `What does this print?

    let info = (200, "OK", 1.5);
    println!("{}", info.0);
    println!("{}", info.2);

Explain the dot-number syntax.`,
    hints: [
      'Tuple elements are reached with a dot and a zero-based index.',
      'Order matters: the first element is index 0.',
    ],
    solution: `It prints 200 on the first line and 1.5 on the second. A tuple element is accessed with a period followed by the element's zero-based position, so info.0 is the first element (200) and info.2 is the third element (1.5). This is distinct from array indexing with square brackets; tuples use the dot-index form because each position may have a different type, and the index must be a literal known at compile time.`,
    tags: ['tuples', 'indexing', 'predict-output', 'easy'],
  },
  {
    id: 'rs-ch03-t-011',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Reading the Array Repeat Form',
    prompt: `Describe exactly what this creates:

    let buffer = [0; 5];

How many elements, what are their values, and what is the type of buffer?`,
    hints: [
      'The form is [value; count].',
      'All elements start equal to the value.',
    ],
    solution: `It creates an array of 5 elements, each initialized to 0, so buffer is [0, 0, 0, 0, 0]. The syntax [value; count] is the repeat form: it produces count copies of value. The type of buffer is [i32; 5], an array of five i32 values, because the literal 0 defaults to i32 and the length 5 is part of the array's type.`,
    tags: ['arrays', 'repeat-syntax', 'easy'],
  },
  {
    id: 'rs-ch03-t-012',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Implicit Return Line',
    prompt: `Why does this function return the right value even though there is no return keyword?

    fn double(n: i32) -> i32 {
        n * 2
    }`,
    hints: [
      'Notice the last line has no semicolon.',
      'A block evaluates to its final expression.',
    ],
    solution: `In Rust the value of a function body is the value of its final expression, and a block returns that expression's value implicitly. The line n * 2 has no trailing semicolon, so it is an expression (not a statement) and becomes the function's return value. If you had written n * 2; with a semicolon, the line would become a statement that evaluates to the unit type (), and the function would fail to compile because () does not match the declared i32 return type.`,
    tags: ['functions', 'expressions', 'return', 'easy'],
  },
  {
    id: 'rs-ch03-t-013',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Both if Arms Need One Type',
    prompt: `Explain why this fails to compile:

    let number = if true { 5 } else { "five" };

What rule about if-as-an-expression is being violated?`,
    hints: [
      'An if expression assigned to a let must have one consistent type.',
      'Compare the type produced by each branch.',
    ],
    solution: `When an if expression is used as the value of a let binding, every branch must evaluate to the same type, because the variable can only have one type known at compile time. Here the if arm produces an integer 5 while the else arm produces a string slice "five", so the branch types conflict and the compiler reports "if and else have incompatible types". To fix it, make both arms return the same type, for example { 5 } and { 6 }.`,
    tags: ['if', 'expressions', 'types', 'easy'],
  },
  {
    id: 'rs-ch03-t-014',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Statement Versus Expression in let',
    prompt: `A teammate writes:

    let x = (let y = 6);

They expect x to become 6. Explain why this does not compile, using the statement-versus-expression distinction.`,
    hints: [
      'What kind of construct is let y = 6?',
      'Can you assign the result of a statement to a variable?',
    ],
    solution: `In Rust, let y = 6 is a statement, not an expression, and statements do not evaluate to a value. Because there is nothing to bind, you cannot put a let inside another let's right-hand side, so let x = (let y = 6); fails to compile. This is a deliberate difference from languages like C where assignment is an expression; in Rust you would instead write let y = 6; on its own line and then let x = y;.`,
    tags: ['statements', 'expressions', 'let', 'medium'],
  },
  {
    id: 'rs-ch03-t-015',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'A Block That Yields a Value',
    prompt: `Predict the value of y and explain the role of the missing semicolon:

    let y = {
        let inner = 3;
        inner + 1
    };`,
    hints: [
      'A curly-brace block is itself an expression.',
      'The last line lacks a semicolon on purpose.',
    ],
    solution: `y is bound to 4. A block enclosed in curly braces is an expression that evaluates to the value of its final expression. Inside the block, inner is set to 3, and the last line inner + 1 has no trailing semicolon, so it is the block's resulting value, 4, which is assigned to y. If inner + 1 had a semicolon, the block would evaluate to the unit value () instead, and y would be ().`,
    tags: ['blocks', 'expressions', 'medium'],
  },
  {
    id: 'rs-ch03-t-016',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Returning a Value From loop',
    prompt: `What value does result hold, and how does break carry it out?

    let mut count = 0;
    let result = loop {
        count += 1;
        if count == 10 {
            break count * 2;
        }
    };`,
    hints: [
      'A loop with no condition repeats forever until break.',
      'break can take an expression as its value.',
    ],
    solution: `result holds 20. A plain loop runs forever until a break is executed, and unlike while or for it can produce a value: the expression after break becomes the value of the whole loop expression. Here count is incremented until it reaches 10, then break count * 2 stops the loop and hands back 10 * 2 = 20, which is assigned to result. This is the idiomatic way to retry an operation and return a result from the loop.`,
    tags: ['loop', 'break', 'expressions', 'medium'],
  },
  {
    id: 'rs-ch03-t-017',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Out-of-Bounds Array Access',
    prompt: `For an array let a = [10, 20, 30]; what happens at compile time and at run time for a[5]? Contrast that with how a wrong tuple index like a_tuple.5 behaves.`,
    hints: [
      'Array indices can be computed at runtime; tuple indices cannot.',
      'Think about panics versus compile errors.',
    ],
    solution: `For an array, a[5] is checked at run time: Rust inserts a bounds check, and because index 5 is past the last valid index 2, the program panics with an "index out of bounds" message instead of reading invalid memory. A tuple index like a_tuple.5 is different: tuple positions are part of the type and must be known at compile time, so an out-of-range tuple index is a compile-time error, not a runtime panic. Arrays defer the check to runtime because the index can be a computed value, while tuple access is always a fixed literal.`,
    tags: ['arrays', 'tuples', 'panics', 'medium'],
  },
  {
    id: 'rs-ch03-t-018',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'for Loop Versus while Index Loop',
    prompt: `Compare iterating an array with

    for element in a {
        // use element
    }

against a while loop using a manual index. Give two reasons the for version is preferred.`,
    hints: [
      'Think about what can go wrong with a manual index.',
      'Think about readability and bounds checks.',
    ],
    solution: `First, the for version is safer: it never runs off the end of the array, whereas a while loop with a hand-written index can use a wrong bound (such as <= length) and trigger an out-of-bounds panic. Second, it is clearer and less error-prone: you do not have to declare, initialize, and increment an index variable or write the condition correctly, so there is simply less code to get wrong. The for form also avoids the per-iteration bounds check that the indexed version may incur, making it both more concise and typically more efficient.`,
    tags: ['for', 'while', 'arrays', 'medium'],
  },
  {
    id: 'rs-ch03-t-019',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Iterating a Countdown With rev',
    prompt: `What does this print, line by line?

    for n in (1..4).rev() {
        println!("{n}!");
    }
    println!("liftoff!");`,
    hints: [
      'The range 1..4 yields 1, 2, 3 in order.',
      'rev reverses the order of the produced values.',
    ],
    solution: `It prints, on separate lines: 3!, then 2!, then 1!, then liftoff!. The range 1..4 produces 1, 2, 3, and calling .rev() reverses that sequence so the loop variable n takes 3, then 2, then 1. After the loop finishes, the final println prints liftoff!. This pattern is the standard countdown idiom because for over a reversed range is clearer than a manual decreasing while loop.`,
    tags: ['for', 'ranges', 'rev', 'predict-output', 'medium'],
  },
  {
    id: 'rs-ch03-t-020',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why if Rejects an Integer Condition',
    prompt: `In some languages if (3) { ... } is fine. In Rust, if 3 { ... } does not compile. Explain the rule and how to express "if 3 is nonzero".`,
    hints: [
      'Rust will not auto-convert numbers to truth values.',
      'The condition must already be a bool.',
    ],
    solution: `Rust's if requires its condition to be of type bool, and it does not implicitly convert other types such as integers into booleans. So if 3 { ... } is an error because 3 is an i32, not a bool; the compiler will say it expected a bool. To express "if 3 is nonzero" you must write an explicit comparison that yields a bool, for example if 3 != 0 { ... }. This avoids the classic bug where a non-zero value is silently treated as truthy.`,
    tags: ['if', 'bool', 'control-flow', 'medium'],
  },
  {
    id: 'rs-ch03-t-021',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Annotating a Parsed Number',
    prompt: `This line will not compile on its own:

    let guess = "42".parse().expect("not a number");

The compiler asks for a type annotation. Why, and write one valid fix.`,
    hints: [
      'parse can produce many different numeric types.',
      'You can annotate the variable or use a turbofish.',
    ],
    solution: `parse is generic over which type to produce, and from the string alone the compiler cannot tell whether you want an i32, u64, f64, or something else, so it requires you to specify the target type. One valid fix is to annotate the binding: let guess: u32 = "42".parse().expect("not a number");. Equivalently you can name the type on parse itself with the turbofish form "42".parse::<u32>(). Either way you give the compiler the information it needs to choose the conversion.`,
    tags: ['parse', 'type-annotation', 'inference', 'medium'],
  },
  {
    id: 'rs-ch03-t-022',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Statement Lines Evaluate to Unit',
    prompt: `Explain why this function does not compile:

    fn three() -> i32 {
        3;
    }

What type does the body actually produce, and what is the fix?`,
    hints: [
      'A trailing semicolon turns an expression into a statement.',
      'Statements evaluate to the unit type ().',
    ],
    solution: `The line 3; ends in a semicolon, which makes it a statement rather than an expression, and statements evaluate to the unit type (). So the body produces () while the signature promises i32, and the compiler reports a mismatched types error. The fix is to remove the semicolon so the final line is the expression 3, which the block returns as the function's i32 value. Alternatively you could write return 3; explicitly.`,
    tags: ['functions', 'statements', 'unit', 'medium'],
  },
  {
    id: 'rs-ch03-t-023',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Overflow in Debug Versus Release',
    prompt: `A u8 holds values 0 through 255. Consider:

    let x: u8 = 250;
    let y = x + 10;

What happens when this runs in a debug build versus an optimized release build, and how could you handle the overflow deliberately?`,
    hints: [
      'Debug builds add extra checks that release builds drop.',
      'There are explicit methods for controlled overflow behavior.',
    ],
    solution: `250 + 10 = 260, which exceeds the u8 maximum of 255, so this overflows. In a debug build, Rust includes overflow checks and the program panics at runtime with an "attempt to add with overflow" message. In an optimized release build those checks are omitted by default, and the value wraps around using two's complement arithmetic, so y would become 4 (260 - 256) silently. To handle it deliberately you use explicit methods such as wrapping_add for guaranteed wraparound, checked_add which returns None on overflow, or saturating_add which clamps to 255.`,
    tags: ['integers', 'overflow', 'u8', 'hard'],
  },
  {
    id: 'rs-ch03-t-024',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Breaking the Outer Loop by Label',
    prompt: `In nested loops, an ordinary break only stops the innermost loop. Show with a labeled loop how you would break all the way out of an outer loop from inside an inner one, and explain the label syntax.`,
    hints: [
      'A loop label starts with a single quote and a colon.',
      'break can name which labeled loop to exit.',
    ],
    solution: `You give the outer loop a label, then have break name that label. For example:

    'outer: loop {
        loop {
            if condition {
                break 'outer;
            }
        }
    }

A loop label is an identifier prefixed with a single quote and followed by a colon, such as 'outer:, placed before the loop keyword. Writing break 'outer; exits the loop carrying that label rather than the nearest enclosing loop, so control jumps out of both loops at once. The same labeling also works with continue 'outer to skip to the next iteration of the labeled loop.`,
    tags: ['loops', 'labeled-loops', 'break', 'hard'],
  },
  {
    id: 'rs-ch03-t-025',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing an Iterative Fibonacci',
    prompt: `Without using recursion, describe how to compute the nth Fibonacci number with a loop. What variables do you need, how do they update each iteration, and what edge cases must you handle for small n?`,
    hints: [
      'Track two running values and slide them forward.',
      'Decide what to return for n = 0 and n = 1.',
    ],
    solution: `You keep two running values, say prev = 0 and curr = 1, representing consecutive Fibonacci numbers. Each iteration you compute next = prev + curr, then shift the window by setting prev = curr and curr = next; doing this n times advances to the desired position. For edge cases, n = 0 should return 0 and n = 1 should return 1 directly, which the initial values already represent, so the loop should run only for n of at least 2 (or you simply start the counter so it produces the right result). Using two variables and a for loop over a range like 2..=n avoids the exponential cost of naive recursion and keeps the computation linear in n.`,
    tags: ['fibonacci', 'loops', 'design', 'hard'],
  },
  {
    id: 'rs-ch03-t-026',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'A Temperature Conversion Pitfall',
    prompt: `A student converts Fahrenheit to Celsius with:

    let c = (f - 32) * 5 / 9;

For f = 100 the true answer is about 37.78, but their result is wrong. Diagnose the bug assuming f and the literals are integers, and describe a correct approach.`,
    hints: [
      'Integer arithmetic truncates intermediate results.',
      'Either reorder to multiply first or switch to floats.',
    ],
    solution: `If f and the literals are integers, the whole expression uses integer arithmetic and truncates. For f = 100, (100 - 32) = 68, times 5 is 340, divided by 9 truncates to 37, dropping the fractional .78. The order also matters: multiplying by 5 before dividing by 9 at least avoids losing precision earlier, but integer division still throws away the remainder. The correct approach is to use floating-point values, for example let c = (f - 32.0) * 5.0 / 9.0; with f as an f64, which preserves the fractional part and yields about 37.78.`,
    tags: ['temperature', 'integers', 'floats', 'hard'],
  },
  {
    id: 'rs-ch03-t-027',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Array Length Is Part of the Type',
    prompt: `Why does a function declared as fn sum(a: [i32; 3]) -> i32 reject a call with a four-element array, and what does this reveal about how Rust treats array length?`,
    hints: [
      'The number in [i32; 3] is part of the type signature.',
      'Two arrays of different lengths are different types.',
    ],
    solution: `In Rust an array's length is baked into its type, so [i32; 3] and [i32; 4] are two entirely different types, not the same type with different sizes. The function sum specifically accepts the type [i32; 3], so passing a [i32; 4] is a type mismatch the compiler rejects. This reveals that array sizes are fixed and known at compile time, which lets the compiler lay them out on the stack and check bounds knowledge statically. To accept varying lengths you would later reach for slices (&[i32]), but that is beyond a fixed-size array.`,
    tags: ['arrays', 'types', 'length', 'hard'],
  },
  {
    id: 'rs-ch03-t-028',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Factorial Loop and Its Overflow Limit',
    prompt: `You compute factorial with a loop accumulating into a u32. Describe the loop's structure, then explain roughly why this overflows for fairly small inputs and what choosing a wider type buys you.`,
    hints: [
      'Multiply a running product by each number in a range.',
      'Factorials grow extremely fast.',
    ],
    solution: `The loop keeps a running product, say result = 1, and multiplies it by each integer in a range such as 2..=n, so for i in 2..=n { result *= i; } leaves result holding n!. Factorials grow faster than exponentially, so even modest n overflows a u32, whose maximum is about 4.29 billion: 12! is 479001600 which still fits, but 13! is 6227020800 which exceeds u32 and overflows. Choosing a wider type like u64 (max about 1.8 x 10^19) lets you reach 20! before overflowing, and u128 extends further still, so a wider type buys headroom but never removes the limit for an unbounded factorial.`,
    tags: ['factorial', 'loops', 'overflow', 'hard'],
  },
  {
    id: 'rs-ch03-t-029',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Choosing continue Over Nested if',
    prompt: `In a for loop over 1..=20 you want to act only on numbers divisible by 3. Compare wrapping the body in if n % 3 == 0 { ... } against using continue to skip the others. When is each clearer?`,
    hints: [
      'continue jumps to the next iteration immediately.',
      'Think about deeply nested bodies versus a flat guard.',
    ],
    solution: `Both work: if n % 3 == 0 { ... } runs the body only for multiples of three, and the continue form writes if n % 3 != 0 { continue; } at the top and then runs the body unguarded. For a short body the if wrapper is perfectly clear and keeps the intent local. But when the body is long or you would otherwise nest several conditions, an early continue acts as a guard clause that flattens the code, reducing indentation and making the "skip these" rule obvious up front. So prefer the if wrapper for simple cases and continue when it avoids deep nesting.`,
    tags: ['continue', 'for', 'control-flow', 'hard'],
  },
  {
    id: 'rs-ch03-t-030',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Returning Two Results in a Tuple',
    prompt: `You want one function to return both the quotient and remainder of dividing a by b. Explain how a tuple lets a single function return two values, give a plausible signature, and describe how the caller would unpack them.`,
    hints: [
      'A function can return only one value, but that value can be compound.',
      'The caller can destructure with a pattern.',
    ],
    solution: `A Rust function returns exactly one value, but that value can be a tuple, which bundles several values of possibly different types into one. So you return a two-element tuple to deliver both results, with a signature like fn div_mod(a: i32, b: i32) -> (i32, i32) whose body ends with (a / b, a % b). The caller then unpacks it by destructuring, for example let (q, r) = div_mod(17, 5);, which binds q to the quotient 3 and r to the remainder 2. The tuple is the lightweight way to return grouped data without defining a named struct.`,
    tags: ['tuples', 'functions', 'return', 'hard'],
  },
]

export default problems
