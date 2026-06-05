import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch06-t-001',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Is an Enum For',
    prompt: `In one or two sentences, explain what an enum is in Rust and why it is useful to model a value that can be exactly one of a small fixed set of variants, such as the four suits of a deck of cards.`,
    hints: [
      'Think about a value that can take one of several named forms.',
      'Compare it to a struct, which always holds all of its fields at once.',
    ],
    solution: `An enum (enumeration) lets you define a type by listing all the variants it can ever be, and a value of that type is exactly one of those variants at a time. For four suits you would write something like enum Suit { Hearts, Diamonds, Clubs, Spades }, and any Suit value is one and only one of them. This is different from a struct, which always holds all its fields simultaneously; an enum is an either/or choice. The compiler then knows the complete list of possibilities, which lets it check that you handle every case.`,
    tags: ['enum', 'definition'],
  },
  {
    id: 'rs-ch06-t-002',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Reading a Match Expression',
    prompt: `Given enum Light { Red, Yellow, Green }, predict what this function returns for Light::Yellow:

fn seconds(l: Light) -> u32 {
    match l {
        Light::Red => 30,
        Light::Yellow => 5,
        Light::Green => 25,
    }
}

State the returned number and explain how match picked that arm.`,
    hints: [
      'match compares the value against each arm pattern from top to bottom.',
      'The first arm whose pattern matches is the one that runs.',
    ],
    solution: `It returns 5. The match expression takes the value Light::Yellow and tests it against each arm's pattern in order: Light::Red does not match, Light::Yellow does match, so its arm expression 5 is evaluated and becomes the value of the whole match. Because match is an expression, that value is returned from the function. The remaining arm is not checked once a match is found.`,
    tags: ['match', 'enum'],
  },
  {
    id: 'rs-ch06-t-003',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Rust Has Option Instead of Null',
    prompt: `Rust does not have a null value. Instead it provides the Option<T> enum with the variants Some(T) and None. In a few sentences, explain what problem null causes in other languages and how Option helps avoid it.`,
    hints: [
      'Think about what happens when you use a value assuming it is present but it is actually absent.',
      'Option forces you to acknowledge the absent case before using the value.',
    ],
    solution: `In many languages a value can secretly be null, and using it as if it held data causes a runtime null reference error, which is easy to forget about. Rust encodes the possibility of absence in the type itself: a value that might be missing has type Option<T>, which is either Some(value) or None. Because Option<T> and T are different types, you cannot use an Option as if it were a plain value; the compiler forces you to handle the None case first. This turns a whole class of runtime crashes into compile-time errors.`,
    tags: ['option', 'null'],
  },
  {
    id: 'rs-ch06-t-004',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Underscore Wildcard',
    prompt: `In a match arm you sometimes see the pattern _ on the left side, like _ => println!("something else"). In one or two sentences, explain what the underscore matches and why it is commonly placed last.`,
    hints: [
      'The underscore is a placeholder that ignores the value.',
      'Order matters because match checks arms top to bottom.',
    ],
    solution: `The underscore _ is a wildcard pattern that matches any value while ignoring it (it does not bind the value to a name). It is commonly placed last because it acts as a catch-all for every case you did not list explicitly, so any earlier specific arms still get their chance to match first. If you put _ before a specific arm, that specific arm could never be reached. Using _ lets a match stay exhaustive without writing out every remaining possibility.`,
    tags: ['match', 'wildcard'],
  },
  {
    id: 'rs-ch06-t-005',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Variants That Hold Data',
    prompt: `Compare two ways to store an IP address kind together with its address text. Approach A uses a struct with a separate enum field plus a String field. Approach B uses an enum whose variants directly hold data, like enum IpAddr { V4(String), V6(String) }. Explain one advantage Approach B has.`,
    hints: [
      'In approach B the data is attached to the variant itself.',
      'Think about whether an impossible combination can be represented.',
    ],
    solution: `In Approach B each variant carries its own data, so you write IpAddr::V4(String::from("127.0.0.1")) and the kind and the value travel together as one value. This is more concise than a struct holding both a kind field and an address field, and it makes invalid states unrepresentable: you cannot accidentally pair a V4 tag with data meant for V6, because there is only one bundled value. The variants can even hold different types or different numbers of fields if needed. So enums with data give you a tighter, safer model than a separate tag plus payload.`,
    tags: ['enum', 'data'],
  },
  {
    id: 'rs-ch06-t-006',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Binding the Inner Value',
    prompt: `Given enum Coin { Penny, Nickel, Dime, Quarter(String) } where a Quarter holds the name of a US state, predict what this prints when called with Coin::Quarter(String::from("Alaska")):

fn describe(c: Coin) {
    match c {
        Coin::Quarter(state) => println!("Quarter from {state}!"),
        _ => println!("Some other coin"),
    }
}

Explain how the name state got its value.`,
    hints: [
      'The pattern Coin::Quarter(state) destructures the variant.',
      'The name inside the parentheses binds to the data the variant holds.',
    ],
    solution: `It prints "Quarter from Alaska!". The pattern Coin::Quarter(state) matches the Quarter variant and binds its inner String to a new variable named state. Pattern matching can pull data out of a variant: when the value is Coin::Quarter(String::from("Alaska")), the String "Alaska" is moved into state, which the arm's body then uses. This binding-in-the-pattern is one of the main reasons match is so powerful with data-carrying enums.`,
    tags: ['match', 'binding'],
  },
  {
    id: 'rs-ch06-t-007',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Matching on Option',
    prompt: `Predict the output of calling plus_one(Some(5)) and then plus_one(None):

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

State both results and explain why None does not become Some.`,
    hints: [
      'Each arm handles one Option variant.',
      'Adding one only happens when there is a value to add to.',
    ],
    solution: `plus_one(Some(5)) returns Some(6) and plus_one(None) returns None. When the input is Some(5), the Some(i) arm binds i to 5 and produces Some(i + 1) which is Some(6). When the input is None, the None arm matches and simply returns None, because there is no inner number to add one to. This shows the typical pattern for working with Option: you must explicitly say what to do in both the present and the absent case.`,
    tags: ['option', 'match'],
  },
  {
    id: 'rs-ch06-t-008',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Matches Must Be Exhaustive',
    prompt: `This code does not compile. Explain the error and how to fix it:

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        Some(i) => Some(i + 1),
    }
}`,
    hints: [
      'How many variants does Option have?',
      'A match in Rust must cover every possible value.',
    ],
    solution: `Matches in Rust must be exhaustive, meaning every possible value of the matched type must be handled. Option<i32> has two variants, Some and None, but this match only handles Some(i), so the compiler reports that the None case is not covered (pattern None not covered). The fix is to add an arm for None, for example None => None, or a catch-all such as _ => None. Exhaustiveness is what guarantees you never forget to handle the empty case, eliminating a common source of bugs.`,
    tags: ['match', 'exhaustive'],
  },
  {
    id: 'rs-ch06-t-009',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'A Method on an Enum',
    prompt: `Just like structs, enums can have methods defined in an impl block. Sketch how you would give enum Coin { Penny, Nickel, Dime, Quarter } a method value_in_cents(&self) -> u32, and explain what role self and match play inside it.`,
    hints: [
      'Use impl Coin with a method taking &self.',
      'Inside the method, match on self to decide the return value.',
    ],
    solution: `You write impl Coin { fn value_in_cents(&self) -> u32 { match self { Coin::Penny => 1, Coin::Nickel => 5, Coin::Dime => 10, Coin::Quarter => 25 } } }. Here &self is a reference to the particular Coin the method was called on, so c.value_in_cents() passes c in as self. The match inspects which variant self is and returns the matching cent value. Because the method body is just a match expression, its value becomes the method's return value, and calling it looks like any other method call.`,
    tags: ['enum', 'methods'],
  },
  {
    id: 'rs-ch06-t-010',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Rewriting Match as If Let',
    prompt: `Consider this match that only cares about one case:

match config {
    Some(max) => println!("Max is {max}"),
    _ => (),
}

Rewrite it using if let, and explain the trade-off you are making by switching.`,
    hints: [
      'if let handles one pattern and ignores the rest.',
      'You lose the exhaustiveness check that match gives you.',
    ],
    solution: `It becomes if let Some(max) = config { println!("Max is {max}"); }. The if let form is shorter because you no longer write the _ => () arm that does nothing for every other case. The trade-off is that you give up exhaustive checking: match forces you to acknowledge all cases, while if let silently ignores anything that does not match the single pattern. So if let is the right tool when you genuinely care about only one pattern and want to do nothing otherwise.`,
    tags: ['if-let', 'match'],
  },
  {
    id: 'rs-ch06-t-011',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Variants With Different Shapes',
    prompt: `The book's Message enum is defined as enum Message { Quit, Move { x: i32, y: i32 }, Write(String), ChangeColor(i32, i32, i32) }. Describe the shape of the data each of the four variants holds, and explain why putting them in one enum is convenient.`,
    hints: [
      'Each variant can hold a different amount and kind of data.',
      'One can be empty, one struct-like, one a single value, one a tuple.',
    ],
    solution: `Quit holds no data at all. Move holds named fields like a struct, x and y. Write holds a single String. ChangeColor holds three i32 values like a tuple. Grouping them in one enum is convenient because all four are now the same type, Message, so a function can accept any kind of message in one parameter and you can store a mixed list of them. A single match can then handle every variant, with each arm destructuring that variant's particular shape.`,
    tags: ['enum', 'message'],
  },
  {
    id: 'rs-ch06-t-012',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Option Is Not Magic',
    prompt: `Option<T> looks built in, but the book points out it is just an enum defined in the standard library: enum Option<T> { None, Some(T) }. Explain what the T means here and why Some can hold any type.`,
    hints: [
      'T is a generic type parameter (introduced informally here).',
      'The same Option definition works for i32, String, and more.',
    ],
    solution: `The T is a generic type parameter, a placeholder for whatever type the Option wraps. Because the definition uses T, the same Option enum works for any type: Some(5) gives an Option<i32>, Some(String::from("hi")) gives an Option<String>, and so on. None is the variant that means no value, and its type is also Option<T> for the matching T. So Option is not special compiler magic; it is an ordinary enum whose Some variant can carry a value of any type T.`,
    tags: ['option', 'generics'],
  },
  {
    id: 'rs-ch06-t-013',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Order of Arms Matters',
    prompt: `Predict the output of this code and explain why:

let n = 7;
match n {
    _ => println!("anything"),
    7 => println!("lucky seven"),
}`,
    hints: [
      'Arms are tested top to bottom.',
      'A wildcard placed first swallows every value.',
    ],
    solution: `It prints "anything". Match tests patterns from top to bottom and runs the first one that matches; the wildcard _ matches every value, so it is chosen immediately and the 7 arm is never reached. In fact the 7 => ... arm is unreachable, and the compiler will warn about an unreachable pattern. The lesson is that specific patterns must come before broad ones; the catch-all belongs at the end.`,
    tags: ['match', 'wildcard'],
  },
  {
    id: 'rs-ch06-t-014',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Catch-All Binding Versus Underscore',
    prompt: `Compare two catch-all arms in a dice game. Version A ends with other => move_player(other) and Version B ends with _ => reroll(). Explain the difference between binding the value to a name versus using the underscore, and when you would choose each.`,
    hints: [
      'A named catch-all captures the value so the arm can use it.',
      'The underscore catch-all ignores the value entirely.',
    ],
    solution: `In Version A the catch-all pattern other binds the matched value to a variable named other, so the arm can use that value, here passing the rolled number into move_player(other). In Version B the catch-all pattern _ matches everything but discards the value, which is appropriate when you do not need it, as in reroll() which takes no input. You choose a named catch-all when the remaining cases still need the actual value, and the underscore when you only care that none of the earlier patterns matched. Both keep the match exhaustive; they differ only in whether the value is captured.`,
    tags: ['match', 'catch-all'],
  },
  {
    id: 'rs-ch06-t-015',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Cannot Add Option and Integer',
    prompt: `This snippet does not compile:

let x: i8 = 5;
let y: Option<i8> = Some(5);
let sum = x + y;

Explain the compiler's objection and describe the proper way to obtain the sum.`,
    hints: [
      'i8 and Option<i8> are different types.',
      'You must first extract the value from the Option.',
    ],
    solution: `The error is that there is no addition defined between i8 and Option<i8>; they are different types, so x + y is rejected (no implementation for i8 + Option<i8>). This is intentional: an Option<i8> might be None, so Rust will not let you treat it as a guaranteed i8. To get a sum you must first handle the Option, for example with a match that adds when the value is Some(v) and decides what to do for None, such as Some(v) => Some(x + v) and None => None. Converting Option<i8> into i8 forces you to consider the missing case before doing arithmetic.`,
    tags: ['option', 'types'],
  },
  {
    id: 'rs-ch06-t-016',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'If Let With Else',
    prompt: `A counter should increment for every coin that is not a quarter, and announce the state for a quarter (where Quarter holds a State). Compare a match having a Quarter arm plus a _ arm against the equivalent if let / else form, and write out the if let / else version.`,
    hints: [
      'if let runs on a successful match; else runs otherwise.',
      'The else block replaces the wildcard arm.',
    ],
    solution: `The if let / else version is: if let Coin::Quarter(state) = coin { println!("State quarter from {state:?}!"); } else { count += 1; }. Here the if let body runs only when coin matches Coin::Quarter(state), binding state, and the else block runs for every other coin, doing count += 1. This is exactly equivalent to a match whose Quarter arm prints the state and whose _ arm increments count. The if let / else form is more concise when there is one interesting pattern and a single fallback action for everything else.`,
    tags: ['if-let', 'else'],
  },
  {
    id: 'rs-ch06-t-017',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Match Moves the Inner Value',
    prompt: `This code fails to compile:

let opt = Some(String::from("hello"));
match opt {
    Some(s) => println!("{s}"),
    None => {}
}
println!("{opt:?}");

Explain why the last line is the problem and one way to fix it without cloning.`,
    hints: [
      'String is not Copy, so the pattern moves it.',
      'Matching by reference avoids taking ownership.',
    ],
    solution: `The pattern Some(s) binds by moving the inner String out of opt, which moves opt itself, so after the match opt is no longer valid and the final println! that uses opt is a use-after-move error. Because String is not Copy, the value is moved rather than copied during matching. One fix that avoids cloning is to match on a reference: match &opt { Some(s) => ... }, where s becomes a &String and opt is only borrowed, so opt remains usable afterward. Matching by reference is the standard way to inspect an Option or enum without consuming it.`,
    tags: ['match', 'ownership'],
  },
  {
    id: 'rs-ch06-t-018',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Designing With Unrepresentable Invalid States',
    prompt: `You are modeling a network connection that is either disconnected, connecting, or connected with a session id (a u32). A teammate proposes a struct with a bool is_connected and a u32 session_id. Argue why an enum is the better design.`,
    hints: [
      'Some combinations of the struct fields are nonsensical.',
      'An enum ties the data to the exact state that needs it.',
    ],
    solution: `The struct allows invalid combinations: what does is_connected = false but session_id = 42 mean, or is_connected = true with no real session? Those states are representable but meaningless, and every reader of the code must remember to ignore the unused field. An enum like enum Connection { Disconnected, Connecting, Connected(u32) } makes only the valid states expressible: a session id exists exactly when the variant is Connected, and never otherwise. This is the make-invalid-states-unrepresentable principle, and it lets the compiler and a match enforce that you handle each real state correctly.`,
    tags: ['enum', 'design'],
  },
  {
    id: 'rs-ch06-t-019',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Match Guards Are Not Needed Here',
    prompt: `Predict the output, and explain how the arms are chosen:

let pair = Some(0);
match pair {
    Some(0) => println!("zero"),
    Some(n) => println!("nonzero: {n}"),
    None => println!("nothing"),
}`,
    hints: [
      'A literal inside Some is a more specific pattern.',
      'The first matching arm wins.',
    ],
    solution: `It prints "zero". The value is Some(0), and match tries the arms in order: Some(0) is a pattern that matches only when the inner value is exactly 0, which it is, so that arm runs. The later Some(n) arm would have matched any other inner number by binding it to n, and None handles the absent case. This shows you can pattern-match on specific literal values nested inside a variant, and that more specific patterns should come before more general ones.`,
    tags: ['match', 'patterns'],
  },
  {
    id: 'rs-ch06-t-020',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Destructuring a Struct-Like Variant',
    prompt: `Using the Message enum (with Move { x: i32, y: i32 }), write the match arm that handles a Move by printing its x and y, and explain how the field names in the pattern relate to the fields in the variant.`,
    hints: [
      'A struct-like variant is destructured with braces in the pattern.',
      'The pattern can bind each named field to a variable.',
    ],
    solution: `The arm is Message::Move { x, y } => println!("Move to {x}, {y}"). Because Move is a struct-like variant with named fields, the pattern uses braces and lists the field names; writing x and y both names the fields to destructure and creates bindings of those same names holding their values. If you wanted different binding names you could write Message::Move { x: a, y: b }. This lets a single match arm pull the individual fields out of the variant for use in its body.`,
    tags: ['match', 'destructuring'],
  },
  {
    id: 'rs-ch06-t-021',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Returning Option From a Search',
    prompt: `You write a function that finds the first even number in a list and want it to handle the case where there is no even number. Explain why returning Option<i32> is better than returning a sentinel value like -1, and describe what the caller must do.`,
    hints: [
      'A sentinel value can collide with real data.',
      'Option forces the caller to handle absence.',
    ],
    solution: `A sentinel like -1 is dangerous because -1 could be a legitimate result in some contexts, and nothing forces the caller to remember to check for it, so the absent case can silently slip through. Returning Option<i32> makes the absence explicit and impossible to ignore: None means no even number was found, and Some(n) carries the real result. The caller cannot use the inner number directly; they must match on the Option or use if let, handling both Some and None. This pushes the missing-value handling to compile time instead of relying on a fragile magic number.`,
    tags: ['option', 'design'],
  },
  {
    id: 'rs-ch06-t-022',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'If Let Loses Exhaustiveness',
    prompt: `A coworker replaced every match in the codebase with if let to make the code shorter. Describe a concrete situation where this refactor introduces a bug that match would have caught, using an enum with three variants as an example.`,
    hints: [
      'match checks that all cases are handled; if let does not.',
      'Adding a new variant later is where the danger appears.',
    ],
    solution: `Suppose enum Status { Active, Paused, Closed } and you process only Active with if let Status::Active = s { ... }. That silently does nothing for Paused and Closed, and crucially, if someone later adds a fourth variant like Banned, nothing flags that the new case is unhandled. With a match, omitting a variant is a compile error, so adding Banned would force every match to be updated. So replacing match with if let throws away the exhaustiveness guarantee, turning what would have been compile-time errors into silent missed cases.`,
    tags: ['if-let', 'exhaustive'],
  },
  {
    id: 'rs-ch06-t-023',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Recursive Enum Needs Indirection',
    prompt: `Consider modeling a simple cons list as enum List { Cons(i32, List), Nil }. This will not compile because Rust cannot determine the type's size. Explain in your own words why a directly recursive enum has no known size, and name the general kind of fix (without needing later-chapter details).`,
    hints: [
      'Computing the size of List requires already knowing the size of List.',
      'The variant needs to hold something of a fixed, known size that points elsewhere.',
    ],
    solution: `To lay out a value on the stack, the compiler must know its size, and it computes an enum's size from its largest variant. Here Cons contains a List directly, so the size of List depends on the size of List, which depends on the size of List, an infinite regress with no fixed answer. The general fix is to store the nested List behind a pointer of known size rather than inline, so the variant holds a fixed-size handle that refers to the rest of the list living elsewhere. (The standard tool for this, Box, is covered later, but the key insight is replacing the inline recursive value with a fixed-size indirection.)`,
    tags: ['enum', 'recursive'],
  },
  {
    id: 'rs-ch06-t-024',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Nested Option Matching',
    prompt: `Given a value of type Option<Option<i32>>, predict the outputs for Some(Some(3)), Some(None), and None under this match:

match v {
    Some(Some(n)) => println!("got {n}"),
    Some(None) => println!("inner empty"),
    None => println!("outer empty"),
}

Explain why three arms are needed.`,
    hints: [
      'Patterns can nest to match inside the inner Option.',
      'There are three genuinely different shapes the value can take.',
    ],
    solution: `Some(Some(3)) prints "got 3", Some(None) prints "inner empty", and None prints "outer empty". The type Option<Option<i32>> has three meaningfully distinct values: an outer Some wrapping an inner Some with a number, an outer Some wrapping an inner None, and an outer None. The nested pattern Some(Some(n)) reaches two levels deep, binding the innermost number to n, while Some(None) and None handle the two empty shapes. Three arms are required because the nesting creates three cases, and a match must be exhaustive over all of them.`,
    tags: ['option', 'nested'],
  },
  {
    id: 'rs-ch06-t-025',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Reachability of a Specific Arm',
    prompt: `Analyze this match and explain what the compiler reports and why:

fn label(x: Option<i32>) -> &'static str {
    match x {
        Some(n) => "has value",
        None => "empty",
        Some(0) => "zero",
    }
}`,
    hints: [
      'Which arm matches every Some value?',
      'Once an earlier arm covers a value, later overlapping arms cannot run.',
    ],
    solution: `The compiler reports that the Some(0) arm is unreachable. The arm Some(n) matches every Some value by binding the inner number to n, including Some(0), so by the time control would reach Some(0) there are no Some values left to match. Because match tries arms top to bottom and Some(n) already covers all of them, the more specific Some(0) can never be selected. To make Some(0) meaningful you would have to place it before the general Some(n) arm.`,
    tags: ['match', 'unreachable'],
  },
  {
    id: 'rs-ch06-t-026',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Match Arms Must Agree on Type',
    prompt: `Explain why this match fails to compile:

let label = match coin {
    Coin::Penny => 1,
    Coin::Nickel => "five",
    Coin::Dime => 10,
    Coin::Quarter => 25,
};`,
    hints: [
      'The match is used as an expression producing one value.',
      'Look at the types the different arms produce.',
    ],
    solution: `Because match is an expression whose value is assigned to label, every arm must produce a value of the same type. Here three arms produce integers but the Nickel arm produces a string slice "five", so the arms disagree on type and the compiler reports a mismatched types error (it expected an integer but found &str). All arms of a value-producing match must unify to one type. The fix is to make every arm return the same type, for example using the number 5 for the Nickel arm.`,
    tags: ['match', 'types'],
  },
  {
    id: 'rs-ch06-t-027',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Enum Method Returning Option',
    prompt: `Design an enum Operation { Add, Sub, Mul, Div } with a method apply(&self, a: i32, b: i32) -> Option<i32>. Explain why returning Option is appropriate for this method and which variant forces that choice.`,
    hints: [
      'Most operations always produce a number.',
      'One operation can fail for a particular input.',
    ],
    solution: `Most variants always succeed: Add, Sub, and Mul produce a valid i32 for any inputs, so they would return Some(a + b), Some(a - b), and Some(a * b). The Div variant is the one that forces Option, because dividing by zero has no valid result, so it should return None when b is 0 and Some(a / b) otherwise. Returning Option<i32> from the whole method lets a single return type express that one operation may have no answer, and the caller is then required to handle the None case. So Div is what makes Option the right return type even though the other arms never produce None.`,
    tags: ['enum', 'option'],
  },
  {
    id: 'rs-ch06-t-028',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Catch-All Versus Listing Variants',
    prompt: `For an enum with twelve variants where a function genuinely handles three of them specially and treats the other nine identically, weigh using a _ catch-all against listing all nine remaining variants explicitly. Discuss the safety trade-off when a thirteenth variant is added later.`,
    hints: [
      'A catch-all keeps the code short but silent about new variants.',
      'Listing variants makes the compiler flag additions.',
    ],
    solution: `Using a _ catch-all is concise: three specific arms plus one _ for the rest. The cost is that when a thirteenth variant is added later, it silently falls into the catch-all, even if it should have been handled specially, and the compiler never warns you. Listing all nine remaining variants explicitly is more verbose, but then adding a new variant breaks exhaustiveness and the compiler forces you to decide how to handle it. So the trade-off is brevity now versus a compile-time safety net later; for evolving enums where new variants likely need attention, explicit listing is safer, while a catch-all is fine when the grouping is truly stable and intentional.`,
    tags: ['match', 'catch-all'],
  },
  {
    id: 'rs-ch06-t-029',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Chaining If Let For Nested Data',
    prompt: `You have favorite: Option<Color> where enum Color { Rgb(u8, u8, u8), Named(String) }, and you only want to print the red channel when the favorite is an Rgb color. Explain how to combine if let with a nested pattern to do this in one condition, and what happens for None or a Named color.`,
    hints: [
      'A single if let pattern can reach through both layers.',
      'The body runs only if every part of the pattern matches.',
    ],
    solution: `You can write if let Some(Color::Rgb(r, _, _)) = favorite { println!("red is {r}"); }. The single nested pattern requires the value to be Some, and inside it to be a Color::Rgb, binding the first channel to r while ignoring the other two with underscores. The body runs only when both layers match, so it prints the red channel just for an Rgb favorite. If favorite is None, or Some(Color::Named(...)), the pattern does not match and the if let body is simply skipped (you could add an else to handle those cases). This shows if let can destructure deeply nested data in one concise condition.`,
    tags: ['if-let', 'nested'],
  },
  {
    id: 'rs-ch06-t-030',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Enum Versus Trait-Like Polymorphism',
    prompt: `You must represent shapes (circle, rectangle, triangle) and compute each one's area. Using only the tools through chapter 6, argue why an enum with a match-based area method is a reasonable design here, and describe one limitation compared to a more open-ended approach.`,
    hints: [
      'A fixed, known set of shapes fits an enum well.',
      'Think about what happens when an outside crate wants to add a new shape.',
    ],
    solution: `An enum like enum Shape { Circle(f64), Rectangle(f64, f64), Triangle(f64, f64) } with an impl Shape method fn area(&self) -> f64 that matches on self is a clean fit because the set of shapes is small and fixed; the match keeps all the area logic in one place and the compiler guarantees every shape variant is handled. The main limitation is that the enum is closed: anyone wanting a new shape, like a pentagon, must edit the original enum and its match arms, so outside code cannot add shapes without modifying yours. A more open design would let new shape types be added independently, but that relies on traits and trait objects from later chapters; within chapter 6, the enum-plus-match approach is the natural and exhaustive solution.`,
    tags: ['enum', 'design'],
  },
]

export default problems
