import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch18-t-001',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Where Patterns Show Up',
    prompt: `Chapter 18 says patterns are used in far more places than just match arms. In one or two sentences, list several of the places a pattern can appear in Rust code, such as in a let statement.`,
    hints: [
      'Think about every construct where you write something on the left side that gets a value.',
      'match arms, if let, while let, for loops, let, and function parameters all use patterns.',
    ],
    solution: `Patterns appear in match arms, in if let and while let conditions, in the loop variable of a for loop, in plain let statements, and in function and closure parameters. Even the simplest binding, let x = 5, uses a pattern: x is a pattern that matches anything and binds it. So patterns are a pervasive feature rather than something special to match. Recognizing all these spots helps you see that destructuring and binding work consistently across the language.`,
    tags: ['patterns', 'places'],
  },
  {
    id: 'rs-ch18-t-002',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Destructuring a Tuple With Let',
    prompt: `Predict what x, y, and z hold after this line, and explain how the binding works:

let (x, y, z) = (1, 2, 3);`,
    hints: [
      'The pattern on the left mirrors the shape of the value on the right.',
      'Each name in the tuple pattern binds to the matching element.',
    ],
    solution: `After the line, x is 1, y is 2, and z is 3. The left side (x, y, z) is a tuple pattern that Rust matches against the tuple value (1, 2, 3), binding each name to the element in the same position. This is destructuring: instead of one binding, the let statement pulls the tuple apart into three separate variables at once. The number of names in the pattern must match the number of elements, or the code will not compile.`,
    tags: ['let', 'destructuring', 'tuple'],
  },
  {
    id: 'rs-ch18-t-003',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Matching a Literal',
    prompt: `Predict the output and explain how the arm is chosen:

let n = 1;
match n {
    1 => println!("one"),
    2 => println!("two"),
    _ => println!("something else"),
}`,
    hints: [
      'You can match directly against literal values.',
      'The first matching arm runs.',
    ],
    solution: `It prints "one". Patterns can be literals, so the arm 1 matches the value 1 directly. Match tests arms from top to bottom and runs the first whose pattern matches, so the 1 arm fires and the rest are skipped. Matching against literals is handy when you want to act on specific known values, with the wildcard catching everything else.`,
    tags: ['match', 'literals'],
  },
  {
    id: 'rs-ch18-t-004',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Wildcard Ignores a Value',
    prompt: `In a function parameter you sometimes see an underscore, like fn first(_: i32, y: i32) -> i32 { y }. In one or two sentences, explain what the underscore does here and why you might want it.`,
    hints: [
      'The underscore is a pattern that matches anything without binding.',
      'It is useful when the signature must take a value you do not use.',
    ],
    solution: `The underscore is a pattern that matches any value but binds nothing, so the first argument is accepted and then ignored. You might want this when a function signature is fixed (for example to match an expected shape) but you genuinely do not need that parameter. Using _ instead of a real name also avoids an unused-variable warning. The function above simply returns its second argument, discarding the first.`,
    tags: ['wildcard', 'parameters'],
  },
  {
    id: 'rs-ch18-t-005',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Popping a Stack With While Let',
    prompt: `Predict the output of this loop and explain when it stops:

let mut stack = vec![1, 2, 3];
while let Some(top) = stack.pop() {
    println!("{top}");
}`,
    hints: [
      'pop returns Some while there are elements and None when empty.',
      'while let keeps running as long as the pattern matches.',
    ],
    solution: `It prints 3, then 2, then 1, each on its own line. A while let loop keeps running its body as long as the value matches the pattern; here stack.pop() returns Some(top) while the vector has elements, binding top to the last element each time. Because pop removes from the end, the elements come out in reverse order. When the stack is empty, pop returns None, the pattern Some(top) no longer matches, and the loop ends.`,
    tags: ['while-let', 'stack'],
  },
  {
    id: 'rs-ch18-t-006',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Destructuring in a For Loop',
    prompt: `Predict the output and explain how the pattern in the for loop works:

let v = vec!['a', 'b', 'c'];
for (index, value) in v.iter().enumerate() {
    println!("{value} is at index {index}");
}`,
    hints: [
      'enumerate yields tuples of (index, item).',
      'The for loop variable is itself a pattern.',
    ],
    solution: `It prints "a is at index 0", "b is at index 1", and "c is at index 2". The enumerate adapter produces a sequence of (index, value) tuples, and the for loop's variable (index, value) is a tuple pattern that destructures each one into two bindings. So on every iteration index gets the position and value gets the element. This is the same destructuring used in a let, just applied to each item the loop produces.`,
    tags: ['for', 'enumerate', 'destructuring'],
  },
  {
    id: 'rs-ch18-t-007',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'A Function Parameter Is a Pattern',
    prompt: `The signature fn print_coordinates(&(x, y): &(i32, i32)) destructures its argument in the parameter list. Explain what x and y are bound to when you call it with the value &(3, 5).`,
    hints: [
      'The parameter pattern can take a value apart just like a let.',
      'The & in the pattern matches the reference.',
    ],
    solution: `When called with &(3, 5), the parameter pattern &(x, y) matches that reference to a tuple, binding x to 3 and y to 5. Function parameters are patterns, so you can destructure directly in the signature instead of taking one tuple and pulling it apart inside the body. The & in the pattern lines up with the reference type, letting x and y be the i32 values rather than references. Inside the function you can then use x and y as ordinary integers.`,
    tags: ['parameters', 'destructuring', 'tuple'],
  },
  {
    id: 'rs-ch18-t-008',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Or Patterns',
    prompt: `Predict the output and explain the | symbol:

let n = 5;
match n {
    1 | 3 | 5 | 7 | 9 => println!("odd single digit"),
    _ => println!("other"),
}`,
    hints: [
      'The | operator means or in a pattern.',
      'A single arm can match several values.',
    ],
    solution: `It prints "odd single digit". The | (pipe) is the or operator in a pattern, so 1 | 3 | 5 | 7 | 9 matches if the value equals any one of those literals. Since n is 5, it matches and that arm runs. Or patterns let one arm handle several alternatives without repeating the body, keeping the match compact.`,
    tags: ['match', 'or-pattern'],
  },
  {
    id: 'rs-ch18-t-009',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Inclusive Ranges in Patterns',
    prompt: `Predict the output and explain the ..= syntax:

let c = 'k';
match c {
    'a'..='j' => println!("early"),
    'k'..='t' => println!("middle"),
    _ => println!("late"),
}`,
    hints: [
      'The ..= operator matches an inclusive range.',
      'Both endpoints are included.',
    ],
    solution: `It prints "middle". The pattern 'a'..='j' matches any character from 'a' through 'j' inclusive, and 'k'..='t' matches 'k' through 't' inclusive; since c is 'k', it falls in the second range. Range patterns with ..= are allowed for numeric and char values and are more concise than listing each value with the or operator. Both the lower and upper bounds are part of the range, which is why 'k' matches even though it is the boundary.`,
    tags: ['match', 'ranges'],
  },
  {
    id: 'rs-ch18-t-010',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Destructuring a Struct',
    prompt: `Given struct Point { x: i32, y: i32 } and let p = Point { x: 0, y: 7 }, predict what a and b are after:

let Point { x: a, y: b } = p;

Explain the x: a part of the pattern.`,
    hints: [
      'The pattern names the field and the variable to bind it to.',
      'field: variable means take that field and call it variable.',
    ],
    solution: `After the line, a is 0 and b is 7. The pattern Point { x: a, y: b } destructures the struct: x: a means take the x field and bind it to a new variable a, and y: b binds the y field to b. The field name on the left of the colon selects which struct field, and the name on the right is the local variable created. This separates the destructuring (which field) from the binding (what to call it).`,
    tags: ['struct', 'destructuring'],
  },
  {
    id: 'rs-ch18-t-011',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Struct Field Shorthand',
    prompt: `The pattern Point { x, y } is a shorthand. Explain what it is shorthand for and what variables it creates when matched against a Point.`,
    hints: [
      'When the binding name matches the field name you can omit the colon.',
      'Compare it to Point { x: x, y: y }.',
    ],
    solution: `Point { x, y } is shorthand for Point { x: x, y: y }: when you want the binding variables to have the same names as the struct fields, you can list just the field names. Matching it against a Point creates two variables, x and y, holding the values of the corresponding fields. This shorthand is common because reusing the field name as the variable name is the usual case, and it keeps struct destructuring short and readable.`,
    tags: ['struct', 'shorthand'],
  },
  {
    id: 'rs-ch18-t-012',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Ignoring a Function Parameter',
    prompt: `Compare naming an unused parameter x versus naming it _x versus naming it _. Explain how each affects compiler warnings and whether a value is bound.`,
    hints: [
      'An unused plain name triggers a warning.',
      'A leading underscore suppresses the warning; a bare underscore binds nothing.',
    ],
    solution: `Naming a parameter x but never using it produces an unused-variable warning. Naming it _x still binds the value to a variable (named _x) but suppresses the warning, which is useful when you want to keep the value available or document intent without using it yet. Naming it just _ matches the value and binds nothing at all, so there is no variable and no warning. The key difference is that _name still takes ownership of the value, while _ does not bind it.`,
    tags: ['ignoring', 'underscore'],
  },
  {
    id: 'rs-ch18-t-013',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Reading a Match Guard',
    prompt: `Predict the output and explain the if part of the first arm:

let num = Some(4);
match num {
    Some(x) if x % 2 == 0 => println!("even: {x}"),
    Some(x) => println!("odd: {x}"),
    None => println!("none"),
}`,
    hints: [
      'A match guard is an extra if condition after the pattern.',
      'The arm only matches when both the pattern and the condition hold.',
    ],
    solution: `It prints "even: 4". The first arm has a match guard, the if x % 2 == 0 written after the pattern Some(x). The arm is chosen only when the pattern matches and the guard condition is also true; here Some(4) binds x to 4, and 4 % 2 == 0 is true, so that arm runs. Match guards let you add a runtime condition that plain patterns cannot express.`,
    tags: ['match', 'guard'],
  },
  {
    id: 'rs-ch18-t-014',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Refutable Versus Irrefutable',
    prompt: `Explain the difference between a refutable and an irrefutable pattern, and state which kind let requires and which kind if let is meant for. Give an example of each.`,
    hints: [
      'Irrefutable patterns match every possible value.',
      'Refutable patterns can fail to match for some values.',
    ],
    solution: `An irrefutable pattern matches every possible value of its type, like x in let x = 5, which can never fail. A refutable pattern can fail to match some values, like Some(x), which does not match None. A plain let requires an irrefutable pattern because there is no path to take if it fails, while if let and while let are built for refutable patterns precisely so they can handle the no-match case. So let x = 5 is irrefutable, and if let Some(x) = opt uses a refutable pattern.`,
    tags: ['refutable', 'irrefutable'],
  },
  {
    id: 'rs-ch18-t-015',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why This Let Does Not Compile',
    prompt: `Explain the compiler error and how to fix it:

let Some(x) = some_option_value;`,
    hints: [
      'let needs a pattern that always matches.',
      'Some(x) cannot match None.',
    ],
    solution: `A let statement requires an irrefutable pattern, but Some(x) is refutable because it fails to match when the value is None, so the compiler rejects it with a message about a refutable pattern in a local binding. There is no place for the program to go if the match fails in a plain let. The fix is to use a construct that can handle the failing case, such as if let Some(x) = some_option_value { ... }, which only runs the body when the pattern matches. Alternatively, in newer editions, a let ... else can bind irrefutably while diverging otherwise.`,
    tags: ['refutable', 'let', 'error'],
  },
  {
    id: 'rs-ch18-t-016',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Irrefutable Pattern in If Let',
    prompt: `The compiler warns about this line. Explain why an irrefutable pattern in if let is suspicious:

if let x = 5 {
    println!("{x}");
}`,
    hints: [
      'x always matches, so the condition never fails.',
      'if let is meant to handle a pattern that might not match.',
    ],
    solution: `The pattern x is irrefutable, so it always matches, which means the if let condition can never be false and the else branch (if any) is unreachable. Using if let only makes sense with a refutable pattern that can sometimes fail; with an always-matching pattern the if let adds nothing over a plain let. The compiler warns that this is probably a mistake. The correct form would just be let x = 5; followed by the println.`,
    tags: ['irrefutable', 'if-let', 'warning'],
  },
  {
    id: 'rs-ch18-t-017',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Shadowing Inside a Match Arm',
    prompt: `Predict what this prints and explain the surprise with y:

let x = Some(5);
let y = 10;
match x {
    Some(50) => println!("got 50"),
    Some(y) => println!("matched, y = {y}"),
    _ => println!("default"),
}
println!("at end: x = {x:?}, y = {y}");`,
    hints: [
      'The y inside the pattern is a new variable, not the outer y.',
      'Pattern variables shadow only within the arm.',
    ],
    solution: `It prints "matched, y = 5" and then "at end: x = Some(5), y = 10". The Some(y) in the arm introduces a brand new variable y that binds to the inner value 5; it does not compare against or use the outer y. This new y shadows the outer one only inside that arm, so the body sees 5. Once the match ends, the outer y (still 10) is back in scope, which is why the final line prints 10. This shadowing is a classic source of confusion.`,
    tags: ['match', 'shadowing', 'binding'],
  },
  {
    id: 'rs-ch18-t-018',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Matching With the Outer Variable',
    prompt: `The previous shadowing problem showed that a named pattern creates a new variable. If you instead wanted the arm to fire only when x's inner value equals the existing outer y, how would you write that arm, and why does a plain Some(y) not do it?`,
    hints: [
      'A plain name in a pattern always binds, never compares.',
      'Use a match guard to compare against an existing variable.',
    ],
    solution: `A plain Some(y) cannot compare against the outer y because a bare name in a pattern always creates a new binding rather than testing equality with something already in scope. To test against the existing variable you use a match guard: Some(n) if n == y => ..., where n binds the inner value and the guard n == y compares it to the outer y. The guard runs after the pattern matches and can reference variables from the surrounding scope. This is the standard way to match against a value held in another variable.`,
    tags: ['match', 'guard', 'shadowing'],
  },
  {
    id: 'rs-ch18-t-019',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Combining Struct Destructure With Literals',
    prompt: `Given struct Point { x: i32, y: i32 } and p = Point { x: 0, y: 7 }, predict which message this prints and explain how a pattern can mix literals and bindings:

match p {
    Point { x, y: 0 } => println!("on the x axis at {x}"),
    Point { x: 0, y } => println!("on the y axis at {y}"),
    Point { x, y } => println!("elsewhere at ({x}, {y})"),
}`,
    hints: [
      'Each field in the pattern can be a literal or a binding.',
      'A literal field requires the value to equal it.',
    ],
    solution: `It prints "on the y axis at 7". The first arm Point { x, y: 0 } requires y to be exactly 0, but p has y = 7, so it does not match. The second arm Point { x: 0, y } requires x to be exactly 0 (which it is) and binds y to 7, so it matches and runs. A struct pattern can mix literal field values, which act as conditions, with binding names, which capture the field, giving you precise control over which structs match.`,
    tags: ['struct', 'destructuring', 'literals'],
  },
  {
    id: 'rs-ch18-t-020',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Ignoring Remaining Tuple Elements',
    prompt: `Predict the output and explain the .. in the pattern:

let numbers = (2, 4, 8, 16, 32);
match numbers {
    (first, .., last) => println!("first {first}, last {last}"),
}`,
    hints: [
      'The .. rest pattern stands in for any number of elements.',
      'Here it covers the middle of the tuple.',
    ],
    solution: `It prints "first 2, last 32". The .. is the rest pattern, which matches any number of elements without binding them, so (first, .., last) binds first to the first element and last to the last element while ignoring everything in between. This is more convenient and less error-prone than writing an underscore for each middle element. The rest pattern must be unambiguous, so you can use it at most once in a given tuple or slice pattern.`,
    tags: ['ignoring', 'rest', 'tuple'],
  },
  {
    id: 'rs-ch18-t-021',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'When the Rest Pattern Is Ambiguous',
    prompt: `Explain why this match arm does not compile:

match numbers {
    (.., second, ..) => println!("{second}"),
}`,
    hints: [
      'There are two rest patterns in one tuple pattern.',
      'The compiler cannot tell which element second refers to.',
    ],
    solution: `Using .. twice in the same tuple pattern is ambiguous: with a rest pattern on both sides of second, Rust cannot determine which element second is supposed to bind, since each .. could absorb a different number of elements. The compiler rejects this because the rest pattern must match unambiguously. You may use .. at most once per tuple or slice pattern. To capture a specific element you must anchor it with a known position, such as (first, ..) or (.., last).`,
    tags: ['rest', 'ambiguous', 'error'],
  },
  {
    id: 'rs-ch18-t-022',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Nested Underscore to Ignore One Part',
    prompt: `In a settings function, you want to keep an existing Some value rather than overwrite it, but still confirm both old and new are Some. Predict and explain the output:

let setting = Some(5);
let new = Some(10);
match (setting, new) {
    (Some(_), Some(_)) => println!("keeping existing"),
    _ => println!("updating"),
}`,
    hints: [
      'An underscore can sit inside a larger pattern.',
      'It checks the variant without binding the inner value.',
    ],
    solution: `It prints "keeping existing". The pattern (Some(_), Some(_)) checks that both elements of the tuple are the Some variant while ignoring the actual numbers inside, since the nested underscore matches any inner value without binding it. Because both setting and new are Some, this arm matches. The nested _ lets you assert the shape (both present) without needing the values, which is exactly what you want when the decision depends only on whether values exist, not on what they are.`,
    tags: ['ignoring', 'nested', 'tuple'],
  },
  {
    id: 'rs-ch18-t-023',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Destructuring Nested Enums and Structs',
    prompt: `Given enum Color { Rgb(i32, i32, i32), Hsv(i32, i32, i32) } and enum Message { ChangeColor(Color), Quit }, write the match arm that handles a ChangeColor holding an Hsv and prints all three components, and explain how the nesting in the pattern lines up with the nesting in the data.`,
    hints: [
      'The pattern mirrors the structure: a variant holding a variant holding values.',
      'You can bind the innermost values directly.',
    ],
    solution: `The arm is Message::ChangeColor(Color::Hsv(h, s, v)) => println!("hsv {h}, {s}, {v}"). The pattern nests just like the value: the outer Message::ChangeColor wraps an inner Color::Hsv, which wraps three integers, and the names h, s, and v bind those innermost values. Rust matches each layer in turn, so this arm fires only for a ChangeColor whose payload is specifically an Hsv (a ChangeColor with an Rgb would need a separate arm). Nested patterns let one arm reach several levels deep and pull out exactly the data you need.`,
    tags: ['enum', 'nested', 'destructuring'],
  },
  {
    id: 'rs-ch18-t-024',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'At-Bindings to Capture While Testing',
    prompt: `Predict the output and explain the @ symbol:

enum Msg { Hello { id: i32 } }
let msg = Msg::Hello { id: 5 };
match msg {
    Msg::Hello { id: id_var @ 3..=7 } => println!("in range: {id_var}"),
    Msg::Hello { id: 8..=10 } => println!("in other range"),
    Msg::Hello { id } => println!("some other id: {id}"),
}`,
    hints: [
      'The @ operator binds a value and tests it against a pattern at the same time.',
      'Without @ you cannot use the value when the test is a range.',
    ],
    solution: `It prints "in range: 5". The @ operator (an at-binding) lets you both test a value against a pattern and bind it to a name: id_var @ 3..=7 matches when id is in the inclusive range 3 to 7 and simultaneously binds that value to id_var. Since id is 5, the first arm matches and the body can use id_var. Compare the second arm, 8..=10, which tests the range but provides no name, so its body could not refer to the matched value. The at-binding solves the problem of needing both the range test and the captured value at once.`,
    tags: ['at-binding', 'ranges', 'match'],
  },
  {
    id: 'rs-ch18-t-025',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Match Guard Over an Or Pattern',
    prompt: `Predict the output and explain how the guard interacts with the or pattern:

let x = 4;
let y = false;
match x {
    4 | 5 | 6 if y => println!("yes"),
    _ => println!("no"),
}`,
    hints: [
      'The guard applies to the whole or pattern, not just the last alternative.',
      'Both the pattern and the guard must hold.',
    ],
    solution: `It prints "no". The match guard if y applies to the entire or pattern 4 | 5 | 6, not only to the 6. So that first arm requires x to be 4, 5, or 6 AND y to be true. Here x is 4 (the pattern part succeeds), but y is false, so the guard fails and the whole arm is rejected, falling through to the wildcard. This precedence (the guard covering all the or alternatives) is important: it reads as (4 | 5 | 6) if y, not 4 | 5 | (6 if y).`,
    tags: ['match', 'guard', 'or-pattern'],
  },
  {
    id: 'rs-ch18-t-026',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Guards Bypass Exhaustiveness Checking',
    prompt: `Explain why a match whose only arms have guards, like Some(x) if x > 0 and None, may fail to compile even though it appears to cover Some and None, and what that tells you about how the compiler treats guards.`,
    hints: [
      'The compiler cannot evaluate a guard condition at compile time.',
      'A guarded arm is not counted as covering its pattern for exhaustiveness.',
    ],
    solution: `The exhaustiveness checker cannot reason about the runtime guard condition, so it treats a guarded arm as not guaranteed to cover its pattern. With only Some(x) if x > 0 and None, the case Some(x) where x is zero or negative is unhandled, and the compiler reports a non-exhaustive match because nothing covers those Some values. This tells you that guards are invisible to exhaustiveness analysis: the pattern still must be fully covered by arms whose coverage does not depend on a guard. The fix is to add an unguarded arm, such as a plain Some(x) catch-all after the guarded one.`,
    tags: ['match', 'guard', 'exhaustive'],
  },
  {
    id: 'rs-ch18-t-027',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Destructuring a Reference in a For Loop',
    prompt: `Given let points = vec![Point { x: 0, y: 0 }, Point { x: 1, y: 5 }] with struct Point { x: i32, y: i32 }, the loop for &Point { x, y } in points.iter() lets you use x and y as i32 values. Explain why the & in the pattern is needed and what x and y are without it.`,
    hints: [
      'points.iter() yields references, so each item is a &Point.',
      'A pattern with & dereferences during matching.',
    ],
    solution: `points.iter() produces &Point items, so each value the loop receives is a reference. Writing the pattern as &Point { x, y } matches that reference and destructures through it, binding x and y to the i32 fields by copy (since i32 is Copy). Without the &, you would instead write Point { x, y }, and the bindings would not line up with the &Point being yielded, or x and y would end up as references rather than plain integers. The & in the pattern removes one layer of reference so you work with the underlying values directly.`,
    tags: ['for', 'reference', 'destructuring'],
  },
  {
    id: 'rs-ch18-t-028',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Compare Or Pattern Versus Inclusive Range',
    prompt: `You want a match arm to fire for any digit from 0 through 9. Compare writing it as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 versus 0..=9. Discuss readability, what types each works on, and when the or form is unavoidable.`,
    hints: [
      'Ranges are concise but only work for ordered, contiguous values.',
      'Or patterns handle scattered or non-contiguous values.',
    ],
    solution: `For a contiguous span like 0 through 9, the inclusive range 0..=9 is far more readable and less error-prone than spelling out every value with the or operator. Range patterns are limited to types where a contiguous order makes sense, namely numeric values and char. The or form, with |, is unavoidable when the values are not contiguous (for example 1 | 4 | 9) or when you need alternatives that a single range cannot express, including combining ranges with individual values. So prefer ..= for solid runs, and use | for scattered sets or to join several patterns.`,
    tags: ['ranges', 'or-pattern', 'comparison'],
  },
  {
    id: 'rs-ch18-t-029',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'At-Binding Combined With Struct Rest',
    prompt: `Design a single match arm that matches a struct Config { level: i32, name: String, verbose: bool }, captures the whole level value while also requiring it to be in 1..=3, and ignores name and verbose. Write the pattern and explain each piece.`,
    hints: [
      'Use @ to bind level while testing its range.',
      'Use .. to ignore the remaining fields.',
    ],
    solution: `The pattern is Config { level: lvl @ 1..=3, .. }. The part level: lvl @ 1..=3 selects the level field, tests that its value is in the inclusive range 1 to 3, and uses the at-binding to capture that value in a new variable lvl for use in the arm's body. The trailing .. is the struct rest pattern, which ignores all remaining fields (name and verbose) so you do not have to mention them. Together this matches only configs whose level is 1, 2, or 3, gives you the level value, and cleanly skips the other fields.`,
    tags: ['at-binding', 'struct', 'rest'],
  },
  {
    id: 'rs-ch18-t-030',
    chapter: 18,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Choosing the Right Pattern Construct',
    prompt: `For each scenario, name the most appropriate pattern-using construct (let, if let, while let, for, match, or function parameter) and briefly justify it: (a) draining a queue until it is empty; (b) splitting a returned tuple into two named values; (c) handling all variants of an enum exhaustively; (d) running code only when an Option is Some.`,
    hints: [
      'Match each task to the construct designed for that shape of work.',
      'Think about repetition, exhaustiveness, and single-case handling.',
    ],
    solution: `(a) while let, because you want to keep pulling and processing values as long as the pop/dequeue keeps matching Some, stopping when it returns None. (b) let with a tuple pattern, since the value always has that shape, so an irrefutable let cleanly binds both names at once. (c) match, because it forces you to cover every variant and the compiler checks exhaustiveness. (d) if let, which runs its body only when the refutable Some pattern matches and otherwise does nothing. Choosing the construct that fits the shape of the work makes the code clearer and lets the compiler help you the most.`,
    tags: ['patterns', 'design', 'comparison'],
  },
]

export default problems
