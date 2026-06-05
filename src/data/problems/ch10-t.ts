import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch10-t-001',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Reach for Generics',
    prompt: `You have two almost identical functions: one finds the largest i32 in a slice, the other finds the largest char in a slice. The bodies are character-for-character the same except for the type. In one or two sentences, explain what problem generics solve here, and name the technique that removes this kind of duplication.`,
    hints: [
      'Think about what differs between the two functions.',
      'Generics let one definition stand in for many concrete types.',
    ],
    solution: `Generics remove duplication that exists only because of differing types. Instead of writing one function per type, you write a single function with a generic type parameter, for example fn largest<T>(list: &[T]) -> &T, and the compiler reuses that one definition for i32, char, or any other suitable type. This keeps the code DRY: there is one place to read, fix, and reason about the logic. The technique is parameterizing the definition over a type with angle brackets.`,
    tags: ['generics', 'when-to-use', 'duplication'],
  },
  {
    id: 'rs-ch10-t-002',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Is a Trait',
    prompt: `In your own words, what is a trait in Rust, and how is it like (and unlike) an interface in other languages? Mention what the trait itself contains versus what an impl block provides.`,
    hints: [
      'A trait describes shared behavior as a set of method signatures.',
      'Types opt in by implementing the trait.',
    ],
    solution: `A trait defines shared behavior: a named set of method signatures (and optionally default method bodies) that a type can promise to provide. It is similar to an interface in that it describes capabilities without dictating which concrete types have them. The trait declares what methods exist; an impl block for a specific type fills in the actual bodies for that type. A key difference from many languages is that you can implement a trait for a type only if the trait or the type is local to your crate (the orphan rule), which keeps implementations coherent.`,
    tags: ['traits', 'definition', 'interface'],
  },
  {
    id: 'rs-ch10-t-003',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Reading a Generic Struct',
    prompt: `Consider this definition and use:

    struct Point<T> {
        x: T,
        y: T,
    }

    let a = Point { x: 5, y: 10 };
    let b = Point { x: 1.0, y: 4.0 };

What concrete type does T become for a, and for b? Could you instead write Point { x: 5, y: 4.0 } with this exact definition? Explain briefly.`,
    hints: [
      'Both fields share the single parameter T.',
      'Inference picks T from the literals you supply.',
    ],
    solution: `For a, T is inferred as i32, so both x and y are i32; for b, T is f64, so both are f64. With this exact definition you cannot write Point { x: 5, y: 4.0 } because x and y must be the same type T, and 5 (an integer) and 4.0 (a float) are different types. To allow mixed types you would need two parameters, such as struct Point<T, U> { x: T, y: U }. The single T forces both fields to agree.`,
    tags: ['generics', 'structs', 'type-inference'],
  },
  {
    id: 'rs-ch10-t-004',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What a Lifetime Annotation Is Not',
    prompt: `A beginner says: "Adding a lifetime annotation like 'a makes my reference live longer." Is that true? In one or two sentences, explain what a lifetime annotation actually does.`,
    hints: [
      'Annotations describe relationships; they do not change runtime behavior.',
      'They are information for the borrow checker.',
    ],
    solution: `It is not true. A lifetime annotation does not change how long any value or reference actually lives; it does not extend or shorten anything at runtime. It is purely descriptive: it tells the compiler how the lifetimes of several references relate to one another, so the borrow checker can verify that no reference outlives the data it points to. The annotation constrains which programs are accepted, but it never alters their runtime behavior.`,
    tags: ['lifetimes', 'annotations', 'misconception'],
  },
  {
    id: 'rs-ch10-t-005',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why largest Needs a Bound',
    prompt: `This generic function does not compile:

    fn largest<T>(list: &[T]) -> &T {
        let mut largest = &list[0];
        for item in list {
            if item > largest {
                largest = item;
            }
        }
        largest
    }

Explain why, and state the smallest change to the signature that fixes it.`,
    hints: [
      'What operation does item > largest require?',
      'Not every type T supports comparison.',
    ],
    solution: `The body uses item > largest, but the comparison operator is only available for types that implement the PartialOrd trait. Since T is unconstrained, the compiler cannot assume any T supports >, so it rejects the function. The fix is to add a trait bound so T is restricted to comparable types: fn largest<T: PartialOrd>(list: &[T]) -> &T. With that bound, the compiler knows every concrete T used here implements PartialOrd, and the comparison is valid.`,
    tags: ['generics', 'trait-bounds', 'partialord'],
  },
  {
    id: 'rs-ch10-t-006',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Default Method Behavior',
    prompt: `Given:

    trait Summary {
        fn summarize(&self) -> String {
            String::from("(Read more...)")
        }
    }

    struct Tweet;
    impl Summary for Tweet {}

What does tweet.summarize() return for a Tweet, and why is the empty impl block enough? What would change if Tweet provided its own summarize?`,
    hints: [
      'The trait supplies a default body.',
      'An empty impl block opts in without overriding.',
    ],
    solution: `It returns the String "(Read more...)" because the trait defines a default body for summarize, and the empty impl Summary for Tweet {} opts Tweet into the trait without overriding anything, so the default is used. The empty block is enough precisely because every method has a default. If Tweet provided its own fn summarize body inside the impl, that definition would override the default and be called instead. Defaults give baseline behavior that implementors may keep or replace.`,
    tags: ['traits', 'default-methods', 'predict-output'],
  },
  {
    id: 'rs-ch10-t-007',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'impl Trait As a Parameter',
    prompt: `Compare these two signatures and say whether they mean the same thing:

    fn notify(item: &impl Summary) { /* ... */ }

    fn notify<T: Summary>(item: &T) { /* ... */ }

When might you prefer the second (trait bound) form over the first (impl Trait) form?`,
    hints: [
      'impl Trait in argument position is sugar for a bound.',
      'Think about taking two parameters of the same type.',
    ],
    solution: `For a single parameter the two are equivalent: &impl Summary is syntactic sugar for the generic trait-bound form. You would prefer the explicit generic form when you need to refer to the type by name or force several parameters to be the same type. For example fn notify<T: Summary>(a: &T, b: &T) requires a and b to be the same concrete type, whereas fn notify(a: &impl Summary, b: &impl Summary) would allow two different types. So the bound form is more expressive when types must coincide.`,
    tags: ['traits', 'impl-trait', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-t-008',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Orphan Rule',
    prompt: `You want to implement the standard library trait Display for the standard library type Vec<T>, both defined outside your crate. The compiler refuses. Name the rule that blocks this and explain its purpose in one or two sentences. What is one common way developers work around it?`,
    hints: [
      'Either the trait or the type must be local.',
      'This rule keeps implementations unambiguous across crates.',
    ],
    solution: `This is blocked by the orphan rule (coherence): you can implement a trait for a type only if at least one of the trait or the type is local to your crate. Its purpose is to ensure there is never more than one conflicting implementation of a trait for a type across the whole program, which keeps method resolution unambiguous. A common workaround is the newtype pattern: wrap Vec<T> in a local tuple struct like struct Wrapper(Vec<String>) and implement Display for Wrapper, since Wrapper is local.`,
    tags: ['traits', 'orphan-rule', 'newtype'],
  },
  {
    id: 'rs-ch10-t-009',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Generic Method on a Generic Struct',
    prompt: `Given:

    struct Point<T> {
        x: T,
        y: T,
    }

    impl<T> Point<T> {
        fn x(&self) -> &T {
            &self.x
        }
    }

Why must the impl line itself declare <T>? What would impl Point<T> (without the leading <T>) mean instead?`,
    hints: [
      'The <T> after impl introduces the parameter.',
      'Point<T> without declaring T treats T as a concrete type name.',
    ],
    solution: `The <T> right after impl declares T as a generic parameter for the whole impl block, so the methods inside apply to Point of any type. Without it, writing impl Point<T> would make the compiler look for a concrete type named T, which does not exist, and it would be an error. In short, impl<T> Point<T> reads as "for every type T, here are methods on Point<T>." Declaring the parameter after impl is what makes the implementation generic rather than specific.`,
    tags: ['generics', 'methods', 'impl-blocks'],
  },
  {
    id: 'rs-ch10-t-010',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Monomorphization Cost',
    prompt: `Someone worries that using generics will make their program slower at runtime because the compiler must figure out types on the fly. Explain why this concern is unfounded in Rust by describing what monomorphization does at compile time.`,
    hints: [
      'Generics are resolved before the program runs.',
      'The compiler generates a specialized copy per concrete type used.',
    ],
    solution: `Generics in Rust have no runtime cost because of monomorphization: at compile time, the compiler finds every concrete type a generic is used with and generates a separate, specialized non-generic version of the code for each. So a generic largest used with i32 and f64 compiles into two concrete functions, exactly as if you had written them by hand. There is no runtime type dispatch or lookup. The trade-off is purely at compile time and in binary size, not in execution speed.`,
    tags: ['generics', 'monomorphization', 'performance'],
  },
  {
    id: 'rs-ch10-t-011',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Two Type Parameters in a Method',
    prompt: `A Point<X1, Y1> has a method:

    impl<X1, Y1> Point<X1, Y1> {
        fn mixup<X2, Y2>(self, other: Point<X2, Y2>) -> Point<X1, Y2> {
            Point { x: self.x, y: other.y }
        }
    }

Why are X2 and Y2 declared on the method (after mixup) rather than on the impl block (after impl)? What does this tell you about their scope?`,
    hints: [
      'Where a parameter is declared determines where it is in scope.',
      'Some parameters belong to the struct, others only to one method.',
    ],
    solution: `X1 and Y1 belong to the struct and so are declared on the impl block; they are in scope for the whole impl. X2 and Y2 are only relevant to the mixup method and its other parameter, so they are declared on the method, scoping them to that single function. This separation reflects that other can be a Point with completely independent type parameters, unrelated to the receiver's. Declaring them on the method, not the impl, keeps them local to where they matter.`,
    tags: ['generics', 'methods', 'scope'],
  },
  {
    id: 'rs-ch10-t-012',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trait Bound Inside the Trait',
    prompt: `You write a trait with a default method that calls another method:

    trait Summary {
        fn summarize_author(&self) -> String;
        fn summarize(&self) -> String {
            format!("(Read more from {}...)", self.summarize_author())
        }
    }

If a type implements Summary but provides only summarize_author, what does it get for free, and what must it still supply? Explain how the default uses the required method.`,
    hints: [
      'Default methods can call other methods of the same trait.',
      'Required methods have no body.',
    ],
    solution: `The type must supply summarize_author, since that method has no default body and is required. In return it gets summarize for free: the default summarize calls self.summarize_author(), so each implementor's own author logic is woven into the shared default. This is a powerful pattern: a default method depends on a small required method, letting implementors customize one piece while reusing most of the behavior. The implementor provides the minimum, and the trait builds the rest on top.`,
    tags: ['traits', 'default-methods', 'required-methods'],
  },
  {
    id: 'rs-ch10-t-013',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why This Reference Outlives Its Data',
    prompt: `Predict the borrow checker's verdict and explain it:

    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("{}", r);

Name what goes out of scope, and why the compiler rejects this.`,
    hints: [
      'Trace where x lives and where r is used.',
      'A reference must not outlive what it points to.',
    ],
    solution: `The compiler rejects this with a "borrowed value does not live long enough" error. x is declared inside the inner block and is dropped when that block ends, but r holds &x and is then used in the println after the block. So r would be a dangling reference to memory that no longer holds a valid x. The borrow checker enforces that a reference cannot outlive the data it refers to, which is exactly what this code attempts.`,
    tags: ['lifetimes', 'borrow-checker', 'dangling'],
  },
  {
    id: 'rs-ch10-t-014',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why longest Needs a Lifetime',
    prompt: `This does not compile without a lifetime annotation:

    fn longest(x: &str, y: &str) -> &str {
        if x.len() > y.len() { x } else { y }
    }

Explain what the compiler cannot determine about the returned reference, and write the corrected signature using a lifetime parameter.`,
    hints: [
      'The return could come from either input.',
      'Relate the output lifetime to the inputs.',
    ],
    solution: `The function may return either x or y, so the compiler cannot tell, from the signature alone, how long the returned reference is valid relative to the inputs. Without that information it cannot verify callers use the result safely, so it requires you to annotate the relationship. The fix ties the output to both inputs with one lifetime: fn longest<'a>(x: &'a str, y: &'a str) -> &'a str. This says the returned reference lives as long as the shorter of the two inputs' lifetimes, which is exactly the guarantee the body provides.`,
    tags: ['lifetimes', 'functions', 'annotations'],
  },
  {
    id: 'rs-ch10-t-015',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Returning the First Argument Only',
    prompt: `Consider a function that always returns its first argument:

    fn first<'a>(x: &'a str, y: &str) -> &'a str {
        x
    }

Why does y not need a lifetime annotation tied to 'a here, even though longest required both inputs to share 'a? What does this reveal about choosing annotations?`,
    hints: [
      'The return value never comes from y.',
      'Annotate only the relationships that actually exist.',
    ],
    solution: `Because the returned reference always comes from x and never from y, only x's lifetime needs to relate to the output. y can have an independent (elided) lifetime since its validity has no bearing on the result. This shows that lifetime annotations should describe the actual data-flow relationships in the body, not be applied uniformly. longest needed both inputs to share 'a because it could return either one; first does not, so over-constraining y would needlessly reject valid callers.`,
    tags: ['lifetimes', 'functions', 'design'],
  },
  {
    id: 'rs-ch10-t-016',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Struct Holding a Reference',
    prompt: `This struct holds a reference:

    struct Excerpt<'a> {
        part: &'a str,
    }

Why is the lifetime parameter 'a required on the struct? In one sentence, what invariant does it enforce about an Excerpt instance relative to the string it borrows from?`,
    hints: [
      'A struct that stores a reference must declare its lifetime.',
      'The instance cannot outlive the borrowed data.',
    ],
    solution: `Whenever a struct stores a reference in a field, it must declare a generic lifetime parameter so the compiler can track how long that reference is valid. Here 'a annotates part, meaning an Excerpt cannot outlive the &str it holds in part. The invariant is that the instance is valid only as long as the underlying string data it borrows remains valid. Without 'a, the compiler could not guarantee part never dangles.`,
    tags: ['lifetimes', 'structs', 'references'],
  },
  {
    id: 'rs-ch10-t-017',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Applying the Elision Rules',
    prompt: `Apply the lifetime elision rules to this signature and decide whether annotations can be omitted:

    fn first_word(s: &str) -> &str

Walk through the relevant elision rules and state the fully annotated signature the compiler infers.`,
    hints: [
      'Rule 1 gives each input reference its own lifetime.',
      'Rule 2 applies when there is exactly one input lifetime.',
    ],
    solution: `Annotations can be omitted here. By the first elision rule, each input reference parameter gets its own lifetime, so s becomes &'a str. By the second rule, when there is exactly one input lifetime parameter, that lifetime is assigned to all output references, so the return &str becomes &'a str. The compiler therefore infers fn first_word<'a>(s: &'a str) -> &'a str without you writing it. The elision rules cover this common shape completely, so no explicit annotation is needed.`,
    tags: ['lifetimes', 'elision', 'rules'],
  },
  {
    id: 'rs-ch10-t-018',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'When Elision Is Not Enough',
    prompt: `For fn longest(x: &str, y: &str) -> &str the elision rules fail to produce annotations, so you must write them by hand, yet for fn first_word(s: &str) -> &str they succeed. Explain precisely which elision rule applies in one case but not the other.`,
    hints: [
      'Count the input lifetimes in each function.',
      'Rule 2 needs exactly one input lifetime; rule 3 needs &self.',
    ],
    solution: `The difference is the number of input lifetimes. first_word has one reference parameter, so after rule 1 there is exactly one input lifetime, and rule 2 assigns it to the output reference, resolving everything. longest has two reference parameters, so rule 1 gives them two distinct lifetimes; rule 2 does not apply because there is not exactly one input lifetime, and rule 3 does not apply because there is no &self. With no rule to choose the output lifetime, the compiler gives up and requires explicit annotations.`,
    tags: ['lifetimes', 'elision', 'reasoning'],
  },
  {
    id: 'rs-ch10-t-019',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Multiple Bounds vs Where Clause',
    prompt: `These two signatures are equivalent:

    fn show<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 { /* ... */ }

    fn show<T, U>(t: &T, u: &U) -> i32
    where
        T: Display + Clone,
        U: Clone + Debug,
    { /* ... */ }

When is the where-clause form clearly better, and what does the + syntax mean in the bounds?`,
    hints: [
      'The + combines several required traits on one parameter.',
      'where clauses move bounds out of the angle brackets.',
    ],
    solution: `The + syntax means a parameter must implement all the listed traits at once; T: Display + Clone requires T to implement both Display and Clone. The where-clause form is clearly better when there are many parameters or many bounds, because cramming them inside the angle brackets makes the signature hard to read. Moving the bounds into a where clause keeps the function name and parameter list uncluttered while expressing the same constraints. Both forms compile to identical requirements; the choice is about readability.`,
    tags: ['trait-bounds', 'where-clause', 'multiple-bounds'],
  },
  {
    id: 'rs-ch10-t-020',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Returning impl Trait Restriction',
    prompt: `This compiles:

    fn make_summary() -> impl Summary { Tweet { /* ... */ } }

But trying to return either a Tweet or an Article from the same function based on a condition fails when the return type is impl Summary. Explain why returning impl Trait only allows a single concrete type.`,
    hints: [
      'impl Trait names one hidden concrete type, not many.',
      'Different branches would mean different concrete types.',
    ],
    solution: `When you write -> impl Summary, the compiler still resolves the return type to exactly one concrete type behind the scenes; impl Trait is an opaque name for a single type the function actually returns. If one branch returned a Tweet and another an Article, the function would have two different concrete return types, which impl Trait cannot express. The restriction exists because monomorphization needs one definite type per call site. Returning different concrete types from one function requires a different mechanism (trait objects), which is beyond chapter 10's impl Trait return.`,
    tags: ['impl-trait', 'return-types', 'restriction'],
  },
  {
    id: 'rs-ch10-t-021',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Conditional Methods With cmp_display',
    prompt: `Given:

    struct Pair<T> {
        x: T,
        y: T,
    }

    impl<T> Pair<T> {
        fn new(x: T, y: T) -> Self { Pair { x, y } }
    }

    impl<T: Display + PartialOrd> Pair<T> {
        fn cmp_display(&self) { /* prints the larger */ }
    }

If T is a type that is not PartialOrd, can you still call new? Can you call cmp_display? Explain the rule that governs this.`,
    hints: [
      'Each impl block carries its own bounds.',
      'Methods exist only when their block bounds are satisfied.',
    ],
    solution: `You can always call new, because its impl block has no bounds on T, so it applies to Pair of any type. You can call cmp_display only when T implements both Display and PartialOrd, since that method lives in an impl block carrying those bounds. This is conditional method implementation: methods are available only for the concrete types that satisfy the bounds on their impl block. So a Pair of a non-comparable type still gets new but simply does not have cmp_display.`,
    tags: ['generics', 'trait-bounds', 'conditional-methods'],
  },
  {
    id: 'rs-ch10-t-022',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Generic Enum Option Shape',
    prompt: `The standard library defines:

    enum Option<T> {
        Some(T),
        None,
    }

Explain how the single generic parameter T makes one enum definition serve Option<i32>, Option<String>, and Option<&str>. What does None contain, and why does it still need to know T?`,
    hints: [
      'A generic enum parameterizes its variants over T.',
      'Even an empty variant belongs to a specific Option<T>.',
    ],
    solution: `The parameter T lets the Some variant hold a value of whatever type you choose, so the one definition specializes into Option<i32>, Option<String>, Option<&str>, and so on by substituting T. None carries no data, yet it still belongs to a particular Option<T>: a None of type Option<i32> is a different type from a None of type Option<String>. The compiler must know T for the whole enum so the type of an Option value is fully determined, even when the current variant is None. Generics over enums work exactly like generics over structs.`,
    tags: ['generics', 'enums', 'option'],
  },
  {
    id: 'rs-ch10-t-023',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Lifetime in a Method With self',
    prompt: `Given the struct Excerpt<'a> { part: &'a str } and this method:

    impl<'a> Excerpt<'a> {
        fn announce_and_return(&self, announcement: &str) -> &str {
            println!("Attention: {}", announcement);
            self.part
        }
    }

Why does this compile without writing explicit lifetimes on the return, even though there are two input references? Identify which elision rule supplies the output lifetime.`,
    hints: [
      'Methods have an extra elision rule about &self.',
      'The output borrows from self.part.',
    ],
    solution: `It compiles because of the third elision rule: when a method has &self (or &mut self) among its parameters, the lifetime of self is assigned to all elided output lifetimes. So even though there are two input references (&self and announcement), the return &str is given self's lifetime. That is exactly right, because the returned value is self.part, which lives as long as the Excerpt's borrowed data. The &str announcement gets its own independent lifetime and does not affect the output.`,
    tags: ['lifetimes', 'methods', 'elision'],
  },
  {
    id: 'rs-ch10-t-024',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'longest Caller That Fails',
    prompt: `Using fn longest<'a>(x: &'a str, y: &'a str) -> &'a str, predict the borrow checker's verdict:

    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
    }
    println!("{}", result);

Explain why this fails, referencing how 'a is determined.`,
    hints: [
      "'a is the overlap of the two inputs' lifetimes.",
      'Trace where s2 is dropped versus where result is used.',
    ],
    solution: `This fails to compile. The signature ties the returned reference's lifetime 'a to both inputs, so 'a is effectively the shorter of s1's and s2's lifetimes. Here s2 lives only inside the inner block, so the result borrowed from longest is valid only until s2 is dropped at the end of that block. But result is used in the println after the block, when s2 is gone, so the borrow checker rejects it. The error appears because longest's signature says the output might come from s2, even though at runtime it happens to come from s1.`,
    tags: ['lifetimes', 'borrow-checker', 'reasoning'],
  },
  {
    id: 'rs-ch10-t-025',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Blanket Implementations',
    prompt: `The standard library effectively contains:

    impl<T: Display> ToString for T {
        // provides to_string()
    }

Explain what a blanket implementation is, why this one gives to_string() to every Display type automatically, and how it relates to the orphan rule.`,
    hints: [
      'A blanket impl targets all types satisfying a bound.',
      'ToString is a local-enough trait being implemented for many types.',
    ],
    solution: `A blanket implementation is an impl of a trait for every type that satisfies some bound, written as impl<T: Bound> Trait for T. Here, because the standard library implements ToString for any T that implements Display, every Display type automatically gains a to_string() method without writing per-type impls. It is allowed under coherence because the trait being implemented (ToString) is local to the crate providing the impl, satisfying the orphan rule. Blanket impls are a powerful way to give shared behavior to a whole family of types at once.`,
    tags: ['traits', 'blanket-impl', 'orphan-rule'],
  },
  {
    id: 'rs-ch10-t-026',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why a Returned Reference to a Local Fails',
    prompt: `This does not compile even with lifetime annotations:

    fn dangle<'a>() -> &'a str {
        let s = String::from("oops");
        s.as_str()
    }

Explain why no lifetime annotation can save it, and what the right fix is if the function should produce owned data.`,
    hints: [
      'The reference points into a value created inside the function.',
      'Annotations cannot extend a value past its scope.',
    ],
    solution: `No annotation can fix this because the reference points into s, a String created inside dangle that is dropped when the function returns. A lifetime annotation only describes relationships between existing references; it cannot make s live longer than its scope. Claiming the result is valid for some caller-chosen 'a would be a lie the borrow checker refuses to accept. The correct fix is to return owned data: change the signature to fn dangle() -> String and return s itself, transferring ownership to the caller instead of lending a reference to a local.`,
    tags: ['lifetimes', 'ownership', 'dangling'],
  },
  {
    id: 'rs-ch10-t-027',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'The static Lifetime',
    prompt: `A compiler error suggests adding the 'static lifetime to fix your code. Explain what 'static means, why string literals have it, and why blindly adding 'static is usually the wrong fix.`,
    hints: [
      "'static means the reference can live for the whole program.",
      'String literals are baked into the binary.',
    ],
    solution: `The 'static lifetime means a reference can be valid for the entire duration of the program. String literals like "hello" have type &'static str because their text is stored directly in the program's binary and is always available. However, blindly adding 'static to silence an error is usually wrong, because most errors come from a reference that genuinely does not live long enough, such as one pointing into a value that gets dropped. The real fix is to correct the underlying lifetime relationship or ownership, not to falsely claim the reference lives forever.`,
    tags: ['lifetimes', 'static', 'misconception'],
  },
  {
    id: 'rs-ch10-t-028',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Everything Together',
    prompt: `Read this signature and explain each piece:

    use std::fmt::Display;

    fn longest_with_an_announcement<'a, T>(
        x: &'a str,
        y: &'a str,
        ann: T,
    ) -> &'a str
    where
        T: Display,
    {
        println!("Announcement! {}", ann);
        if x.len() > y.len() { x } else { y }
    }

Identify the role of 'a, the role of T and its bound, and why both a lifetime parameter and a generic type parameter coexist in one signature.`,
    hints: [
      'Lifetimes and generic types are both declared in the angle brackets.',
      'They constrain different things: borrows versus capabilities.',
    ],
    solution: `'a is a lifetime parameter: it ties the returned &str to both input strings so the result never outlives them, exactly as in plain longest. T is a generic type parameter constrained by where T: Display, meaning the announcement can be any type that can be formatted with {}. Both coexist because they solve independent problems in one function: 'a governs how long the borrowed return value is valid, while T plus its Display bound governs what kind of value ann may be. Lifetime parameters and type parameters live together in the same angle brackets, each constraining a different aspect of the function.`,
    tags: ['lifetimes', 'generics', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-t-029',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Two Lifetimes or One',
    prompt: `Compare these signatures and decide when each is appropriate:

    fn pick<'a>(x: &'a str, y: &'a str) -> &'a str

    fn pick<'a, 'b>(x: &'a str, y: &'b str) -> &'a str

For a function whose body always returns x, which signature is more flexible for callers, and why might forcing a single shared 'a needlessly reject valid programs?`,
    hints: [
      'A single lifetime forces both inputs to share a region.',
      'Two lifetimes let inputs have independent scopes.',
    ],
    solution: `If the body always returns x, the two-lifetime version fn pick<'a, 'b>(x: &'a str, y: &'b str) -> &'a str is more flexible, because it only ties the output to x and lets y have an entirely independent, possibly shorter lifetime 'b. The single-'a version forces x and y to share one lifetime, which is the intersection of their actual lifetimes; that can reject callers where y is dropped earlier even though y never influences the result. By giving y its own 'b, you describe the true data flow and accept strictly more valid programs. Use a shared 'a only when the output really could come from either input.`,
    tags: ['lifetimes', 'design', 'flexibility'],
  },
  {
    id: 'rs-ch10-t-030',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing a Pluggable Formatter',
    prompt: `You are designing a logging utility. You want one function that accepts any value the caller can print, prepends a timestamp, and works whether they pass an i32, a String, or a custom struct. Sketch (in prose plus a signature) how you would use a trait bound to express "any printable type," and explain why a single generic parameter with a Display bound beats writing one function per type.`,
    hints: [
      'Display is the trait for user-facing {} formatting.',
      'One bounded generic replaces many overloads.',
    ],
    solution: `Use a single generic parameter bounded by Display, the trait that enables {} formatting: fn log<T: Display>(value: T) { println!("[ts] {}", value); }. Any caller passing an i32, String, or custom struct that implements Display can use it, because the bound guarantees the value can be formatted. This beats writing one function per type for the same reasons generics exist generally: there is one definition to maintain, callers extend it simply by implementing Display on their own types, and monomorphization makes each call as fast as a hand-written specialization. The Display bound expresses exactly the capability the body needs and nothing more.`,
    tags: ['traits', 'trait-bounds', 'design'],
  },
]

export default problems
