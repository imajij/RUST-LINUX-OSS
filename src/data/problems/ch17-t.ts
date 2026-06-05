import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch17-t-001',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Counts as an Object',
    prompt: `One common definition of an object-oriented language says objects bundle two things together. Name those two things, and explain in one sentence how a Rust struct (or enum) with an impl block fits that definition.`,
    hints: [
      'Think about what an object holds and what it can do.',
      'A struct holds fields; an impl block holds something else.',
    ],
    solution: `An object bundles data and the behavior that operates on that data. In Rust a struct or enum holds the data in its fields, and an impl block defines the methods (the behavior) that operate on that data. So even though Rust does not call them objects, a struct plus its impl block satisfies the classic "data plus behavior in one unit" definition. The main difference from many OOP languages is that the data declaration and the method definitions live in separate blocks rather than in one class body.`,
    tags: ['oop', 'definition'],
  },
  {
    id: 'rs-ch17-t-002',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Keep Fields Private',
    prompt: `A struct AveragedCollection keeps a list of numbers and a cached average. Its fields are private, and the only way to change the list is through public add and remove methods that also update the average. In one or two sentences, explain what this private-fields-with-a-public-API arrangement is called and why it is useful here.`,
    hints: [
      'The chapter calls this idea by a single OOP word.',
      'Think about who is responsible for keeping the average correct.',
    ],
    solution: `This is encapsulation: the implementation details (the fields) are hidden, and outside code can only interact through the public methods. It is useful because the cached average must stay consistent with the list, and by routing all changes through add and remove, the type can recalculate the average every time the data changes. If callers could touch the fields directly, they could add a number without updating the average and leave the object in an invalid state. Encapsulation lets the type enforce its own invariants.`,
    tags: ['encapsulation', 'privacy'],
  },
  {
    id: 'rs-ch17-t-003',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Rust Has No Inheritance',
    prompt: `A newcomer asks: "How do I make struct Dog inherit fields and methods from struct Animal in Rust, the way a subclass inherits from a superclass?" Give the short, correct answer about what Rust does and does not support here.`,
    hints: [
      'Rust has no struct-to-struct inheritance.',
      'What feature does Rust offer for sharing behavior instead?',
    ],
    solution: `Rust does not have inheritance: you cannot make one struct automatically gain the fields or methods of another struct. There is no superclass/subclass relationship for structs at all. Instead, Rust shares behavior through traits, which can provide default method implementations that many types reuse, and shares code through composition (putting one struct inside another). So the right answer is to define a trait or use composition rather than to look for an inheritance keyword.`,
    tags: ['inheritance', 'traits'],
  },
  {
    id: 'rs-ch17-t-004',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Reading dyn Draw',
    prompt: `In a GUI library you see this field declaration on a Screen struct:

components: Vec<Box<dyn Draw>>,

Read this type aloud in plain English. What kinds of values can the vector hold, and what do they all have in common?`,
    hints: [
      'dyn Draw is a trait object.',
      'Box is a heap pointer.',
    ],
    solution: `It is "a vector of boxed trait objects of type dyn Draw." Each element is a Box that points to some value on the heap, and that value can be any type as long as it implements the Draw trait. The concrete types can all be different (a Button, a SelectBox, a Checkbox), but every element is guaranteed to have a draw method because the trait bound Draw requires it. The vector lets you store a mixed collection of differing types that share one trait.`,
    tags: ['trait-objects', 'box', 'dyn'],
  },
  {
    id: 'rs-ch17-t-005',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trait Object vs Generic Vector',
    prompt: `Compare these two field declarations for a screen that stores drawable components:

A) components: Vec<Box<dyn Draw>>
B) components: Vec<T>   where the struct is generic with T: Draw

State the key practical difference: which one can hold a mix of different concrete types at once, and which one is locked to a single concrete type per Screen?`,
    hints: [
      'A generic type parameter is chosen once when the value is created.',
      'A trait object is resolved per element at runtime.',
    ],
    solution: `Version A with Vec<Box<dyn Draw>> can hold a mix of different concrete types in the same vector, for example a Button and a SelectBox side by side, because each element is a trait object resolved at runtime. Version B with a generic T: Draw locks the whole Screen to a single concrete type: a Screen<Button> can only hold Buttons, never a mix. Generics use monomorphization, so each Vec<T> is homogeneous. You choose the generic form when every element is the same type and you want static dispatch, and the trait-object form when you need heterogeneity.`,
    tags: ['trait-objects', 'generics', 'compare'],
  },
  {
    id: 'rs-ch17-t-006',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Static vs Dynamic Dispatch',
    prompt: `Define static dispatch and dynamic dispatch in one sentence each. Then say which one a call through a Box<dyn Draw> uses, and which one a call through a generic function fn paint<T: Draw>(t: &T) uses.`,
    hints: [
      'Monomorphization happens at compile time.',
      'Trait objects look up the method through a pointer at run time.',
    ],
    solution: `Static dispatch means the compiler knows the concrete type at compile time and generates a direct call to the exact method, often via monomorphization. Dynamic dispatch means the concrete type is not known until run time, so the call looks up the right method through a pointer in the trait object's vtable. A call through Box<dyn Draw> uses dynamic dispatch, while a call through the generic fn paint<T: Draw> uses static dispatch because T is resolved to a concrete type at compile time. Dynamic dispatch trades a small runtime lookup cost for flexibility and smaller code.`,
    tags: ['dispatch', 'trait-objects', 'generics'],
  },
  {
    id: 'rs-ch17-t-007',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trait Object Without a Pointer',
    prompt: `Explain why this does not compile:

let x: dyn Draw = make_button();

What is wrong with using dyn Draw as a bare type for a local variable, and what small change fixes it?`,
    hints: [
      'A trait object does not have a size known at compile time.',
      'Think about Box, a reference, or another pointer.',
    ],
    solution: `A bare dyn Draw is a dynamically sized type: different implementors of Draw have different sizes, so the compiler cannot know how many bytes the local variable x needs on the stack. Rust requires the size of a normal value to be known at compile time, so you cannot store a dyn Trait directly. The fix is to put it behind a pointer, which has a known size, such as let x: Box<dyn Draw> = Box::new(make_button()) or let x: &dyn Draw = &button. The pointer is sized even though the pointed-to value is not.`,
    tags: ['trait-objects', 'sized', 'compile-error'],
  },
  {
    id: 'rs-ch17-t-008',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predicting the GUI Loop Output',
    prompt: `Suppose Button's draw prints "drawing button" and SelectBox's draw prints "drawing select box". A Screen holds:

components: vec![Box::new(SelectBox { ... }), Box::new(Button { ... })]

and Screen::run does: for component in self.components.iter() { component.draw(); }

What is printed, in what order, and which dispatch mechanism chose each draw?`,
    hints: [
      'Iteration goes in vector order.',
      'Each element is a different concrete type behind dyn Draw.',
    ],
    solution: `It prints "drawing select box" then "drawing button", in that order, because the loop walks the vector front to back and the SelectBox was pushed first. Each call component.draw() uses dynamic dispatch: at run time the trait object looks up the correct draw for the actual concrete type behind each Box. The first element resolves to SelectBox's draw and the second to Button's draw, even though the loop code never names those types. This is exactly the flexibility trait objects provide.`,
    tags: ['trait-objects', 'predict-output', 'dispatch'],
  },
  {
    id: 'rs-ch17-t-009',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Default Methods as Shared Behavior',
    prompt: `Rust has no inheritance, yet people say traits give you "something like inherited behavior." Which trait feature are they referring to, and how does a type get that behavior without writing it itself?`,
    hints: [
      'Traits can include a method body, not just a signature.',
      'Implementors can leave that method out.',
    ],
    solution: `They are referring to default method implementations: a trait can provide a complete method body, not just a signature. Any type that implements the trait automatically gets that default behavior without writing the method itself, much like a subclass inheriting a method from a superclass. A type can still override the default by providing its own implementation. This default-method mechanism is how Rust shares behavior across many types, taking the place that method inheritance fills in other languages.`,
    tags: ['traits', 'default-methods', 'inheritance'],
  },
  {
    id: 'rs-ch17-t-010',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Box vs Reference Trait Object',
    prompt: `Both &dyn Draw and Box<dyn Draw> are trait objects. In one or two sentences each, explain when you would store the components in a Vec<Box<dyn Draw>> versus when a single &dyn Draw parameter is enough.`,
    hints: [
      'Box owns its value; a reference borrows.',
      'A collection usually needs to own its elements.',
    ],
    solution: `Use Box<dyn Draw> when the data structure needs to own the value, especially in a collection like Vec<Box<dyn Draw>> where the elements outlive the call that created them and have no other owner. A Box owns heap-allocated data, so the vector keeps the components alive for as long as it lives. Use a &dyn Draw when you only need to borrow a value for the duration of a function call, for example fn paint(item: &dyn Draw), with no ownership transfer or heap allocation. References are lighter but tie the trait object to a borrow with a limited lifetime.`,
    tags: ['trait-objects', 'box', 'references'],
  },
  {
    id: 'rs-ch17-t-011',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Not Just Use an Enum',
    prompt: `Someone says: "Instead of Vec<Box<dyn Draw>>, I can make an enum Component with one variant per widget and match on it in draw." Give one advantage of the trait-object approach over the enum approach when the library is meant to be extended by its users.`,
    hints: [
      'Who can add new variants to an enum?',
      'Who can implement a public trait?',
    ],
    solution: `The trait-object approach lets users of the library add brand-new component types without modifying the library's source. Anyone can define their own struct and implement the Draw trait for it, and the existing Screen will draw it correctly. With an enum, only the crate that defines the enum can add variants, so users cannot extend the set of components, and every new widget forces an edit to the enum and to every match on it. Trait objects therefore support open extension, which is exactly what a GUI library wants.`,
    tags: ['trait-objects', 'enum', 'extensibility'],
  },
  {
    id: 'rs-ch17-t-012',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Calling a Method Not in the Trait',
    prompt: `A Button has an extra method only_buttons_have_this() that is NOT part of the Draw trait. If you hold a value as Box<dyn Draw>, can you call only_buttons_have_this on it? Explain why or why not.`,
    hints: [
      'A trait object only knows the trait, not the concrete type.',
      'What methods are guaranteed to exist on every dyn Draw?',
    ],
    solution: `No, you cannot call only_buttons_have_this through a Box<dyn Draw>. A trait object erases the concrete type and exposes only the methods declared in the Draw trait, because that is all every implementor is guaranteed to have. The compiler has no way to know the value is really a Button, so it rejects any method that is not part of Draw. To use Button-only methods you would need to work with a concrete Button type rather than a dyn Draw trait object.`,
    tags: ['trait-objects', 'methods', 'type-erasure'],
  },
  {
    id: 'rs-ch17-t-013',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'State Pattern in Plain Words',
    prompt: `Describe the state pattern at a high level using the blog Post example: what object does the outside code hold, where does the behavior that changes between Draft, PendingReview, and Published actually live, and what does the outside code NOT have to know?`,
    hints: [
      'The Post delegates work somewhere.',
      'Each state is its own value with its own behavior.',
    ],
    solution: `In the state pattern the outside code holds a single Post object and calls the same methods (add_text, request_review, approve, content) regardless of which state it is in. The behavior that varies between Draft, PendingReview, and Published lives inside separate state objects, each implementing a shared State trait. The Post delegates to whatever state value it currently holds, so the outside code does not have to know which state the post is in or contain any match or if-else over the states. The states themselves decide what each operation does and which state comes next.`,
    tags: ['state-pattern', 'trait-objects', 'design'],
  },
  {
    id: 'rs-ch17-t-014',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why request_review Takes self by Box',
    prompt: `In the state pattern, the State trait method is declared as:

fn request_review(self: Box<Self>) -> Box<dyn State>;

Explain why it takes self: Box<Self> (consuming the boxed state) rather than &self, and what the return value represents.`,
    hints: [
      'A state transition replaces the old state with a new one.',
      'Taking ownership means the old state can be invalidated.',
    ],
    solution: `It takes self: Box<Self> so the method consumes and takes ownership of the old state, which lets the transition invalidate the previous state and produce a brand-new state value. The return value, Box<dyn State>, is the next state the post should be in; for Draft it is a PendingReview, for example. Using self: Box<Self> rather than &self means the old Draft state cannot be accidentally reused after the transition, because it has been moved out. The Post then stores the returned box as its new current state.`,
    tags: ['state-pattern', 'ownership', 'box'],
  },
  {
    id: 'rs-ch17-t-015',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'The take() in the Transition',
    prompt: `Inside Post::request_review the code does roughly:

if let Some(s) = self.state.take() {
    self.state = Some(s.request_review());
}

where state has type Option<Box<dyn State>>. Explain why the field is an Option and why take() is needed here.`,
    hints: [
      'request_review consumes the boxed state by value.',
      'You cannot move a value out of a borrowed struct field directly.',
    ],
    solution: `The state field is an Option<Box<dyn State>> so that the code can temporarily move the boxed state out of the struct, leaving None behind, without violating the borrow rules. You cannot move s.request_review()'s receiver out of self.state directly because self is only borrowed, and moving would leave the field uninitialized. take() swaps the field to None and hands you ownership of the old Box, which you then pass by value into request_review. The new state returned is stored back into the Option, so the field is always valid afterward.`,
    tags: ['state-pattern', 'option', 'take', 'ownership'],
  },
  {
    id: 'rs-ch17-t-016',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Default content Returns Empty',
    prompt: `The State trait gives content a default implementation that returns an empty string slice, and only the Published state overrides it to return the real text. Predict what post.content() returns right after the post is created as a Draft and after add_text but before approval, and explain why.`,
    hints: [
      'Draft and PendingReview do not override content.',
      'The default returns "".',
    ],
    solution: `Right after creation the post is in the Draft state, and Draft does not override content, so it uses the trait default that returns an empty string slice; post.content() returns "". After add_text and request_review the post is in PendingReview, which also does not override content, so post.content() still returns "". Only the Published state overrides content to return the actual text, so the body stays hidden until the post is fully approved. This is how the state pattern enforces that unpublished posts show no content.`,
    tags: ['state-pattern', 'default-methods', 'predict-output'],
  },
  {
    id: 'rs-ch17-t-017',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'No-Op Transitions',
    prompt: `In the state-pattern blog, calling approve while the post is still a Draft has no visible effect: the post stays a Draft. Explain how the design achieves this "ignore invalid transitions" behavior, and where that decision is encoded.`,
    hints: [
      'Every state implements every transition method.',
      'A state can return itself.',
    ],
    solution: `Every state must implement every transition method of the State trait, including the ones that do not make sense for it. Draft's approve simply returns self (itself) as the next state, so approving a draft is a no-op that leaves the post in Draft. The decision about which transitions are valid is encoded inside each state's methods, not in the Post: Draft defines what approve and request_review do for a draft, PendingReview defines them for a pending post, and so on. This keeps the Post free of conditionals and lets each state own its own rules.`,
    tags: ['state-pattern', 'transitions', 'design'],
  },
  {
    id: 'rs-ch17-t-018',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Object Safety Basics',
    prompt: `For a trait to be usable as a trait object (dyn Trait), it must be object safe. State the two main rules a trait's methods must follow to keep the trait object safe.`,
    hints: [
      'One rule is about the return type.',
      'One rule is about generic type parameters on the method.',
    ],
    solution: `A trait is object safe when its methods obey two main rules: first, no method returns Self (the concrete type), and second, no method has generic type parameters of its own. The reason is that a trait object has erased the concrete type, so the compiler no longer knows what Self is and cannot fill in a concrete type for a Self return value or a method-level generic. Methods that take &self and use only types known through the trait are fine. If a trait breaks these rules, you cannot make a Box<dyn Trait> from it.`,
    tags: ['object-safety', 'trait-objects', 'rules'],
  },
  {
    id: 'rs-ch17-t-019',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Clone Is Not Object Safe',
    prompt: `Explain why this does not compile:

let things: Vec<Box<dyn Clone>> = Vec::new();

Why can Clone not be used as a trait object, and which object-safety rule does it violate?`,
    hints: [
      'Look at the signature of Clone::clone.',
      'What type does clone return?',
    ],
    solution: `Clone is not object safe, so dyn Clone is not a valid trait object type. The Clone trait's method has the signature fn clone(&self) -> Self, and returning Self violates the object-safety rule that methods may not return the concrete type. Inside a trait object the concrete type has been erased, so the compiler cannot know what Self is to return it. Because of this, you cannot form a Box<dyn Clone> or a Vec<Box<dyn Clone>>; the error is about object safety, not about Clone being missing.`,
    tags: ['object-safety', 'clone', 'compile-error'],
  },
  {
    id: 'rs-ch17-t-020',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Encapsulation Through the API',
    prompt: `AveragedCollection exposes pub fn add, pub fn remove, and pub fn average, but its list and average fields are private. A teammate wants to swap the internal list from a Vec to some other collection for speed. Explain why this is safe to do, and what would change if the fields were public.`,
    hints: [
      'Outside code never touches the fields directly.',
      'Public fields become part of the contract.',
    ],
    solution: `Because the fields are private, no outside code depends on them; callers only use add, remove, and average. As long as those public methods keep the same signatures and behavior, the teammate can replace the internal Vec with any other collection and nothing outside the type breaks. If the fields were public, they would become part of the type's contract: outside code could read or modify list directly, so changing its type or replacing it would break that code and could leave the cached average inconsistent. Encapsulation is exactly what makes the internal change safe.`,
    tags: ['encapsulation', 'privacy', 'api-design'],
  },
  {
    id: 'rs-ch17-t-021',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Static Dispatch Code Size',
    prompt: `Generics use monomorphization, so calling a generic fn paint<T: Draw>(t: &T) with three different concrete types makes the compiler generate three specialized copies. Trait objects do not duplicate code this way. Describe the trade-off between these two approaches in terms of code size and runtime cost.`,
    hints: [
      'Monomorphization copies the function per type.',
      'Trait objects share one function but do a vtable lookup.',
    ],
    solution: `With generics and monomorphization, the compiler emits a separate specialized copy of the function for each concrete type used, which can increase the binary size but gives fully direct, statically dispatched calls with no runtime lookup and good inlining. With trait objects there is only one copy of the code, so the binary stays smaller, but each method call pays a small runtime cost to look up the right function through the vtable and cannot be inlined as easily. So the trade-off is roughly larger-but-faster static dispatch versus smaller-but-slightly-slower dynamic dispatch. You pick based on whether you need heterogeneity and smaller code or maximum per-call speed.`,
    tags: ['dispatch', 'monomorphization', 'tradeoffs'],
  },
  {
    id: 'rs-ch17-t-022',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Where the Next State Is Decided',
    prompt: `In the state pattern, when you add a brand-new state such as "Scheduled" between PendingReview and Published, which parts of the code do you have to touch, and which parts can stay untouched? Use this to argue whether the state pattern makes adding states easy or hard.`,
    hints: [
      'States know about other states.',
      'The Post and the calling code mostly do not.',
    ],
    solution: `Adding a new state mostly means writing a new struct that implements the State trait and adjusting the transition methods of the neighboring states so they return the new state at the right time. The Post struct and the outside code that calls request_review, approve, and content usually do not need to change, because they delegate to whatever state is current. So adding states is fairly localized, which is a strength. The chapter notes the main downside is the coupling between states: each state must know which state comes next, so the transition logic is spread across the state implementations.`,
    tags: ['state-pattern', 'extensibility', 'design'],
  },
  {
    id: 'rs-ch17-t-023',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Encoding States as Types',
    prompt: `Instead of the trait-object state pattern, you can encode states as distinct types: DraftPost, PendingReviewPost, and Post (published). Each transition method consumes self and returns the next type. Explain how this design moves a whole class of bugs from runtime to compile time.`,
    hints: [
      'A DraftPost has no content method at all.',
      'request_review returns a different type, consuming the old one.',
    ],
    solution: `When each state is its own type, the operations that do not make sense for a state simply do not exist on it: DraftPost has no content method, so trying to read the content of an unpublished post is a compile error rather than something that silently returns "". Each transition, such as DraftPost::request_review(self) -> PendingReviewPost, consumes self and returns the next type, so the old state value is moved away and cannot be used again. This means invalid sequences of calls cannot even be written, turning runtime no-ops and empty strings into compile-time errors. The type system itself enforces the legal state machine.`,
    tags: ['typestate', 'state-pattern', 'compile-time'],
  },
  {
    id: 'rs-ch17-t-024',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Consuming self Prevents Reuse',
    prompt: `In the type-encoded version, request_review is written as:

fn request_review(self) -> PendingReviewPost { ... }

Explain why, after let pending = draft.request_review();, any later use of draft fails to compile, and why that is exactly the property we want.`,
    hints: [
      'The method takes self by value, not by reference.',
      'Moved values cannot be used again.',
    ],
    solution: `Because request_review takes self by value, calling draft.request_review() moves the DraftPost out of draft and into the method, which consumes it and returns a PendingReviewPost. After the move, draft no longer owns a valid value, so any later use of draft is a compile error about using a moved value. This is exactly the property we want: a post that has been sent for review should not still be usable as a draft. The ownership system makes the old state unreachable, so you cannot accidentally operate on a stale state.`,
    tags: ['typestate', 'ownership', 'move', 'compile-error'],
  },
  {
    id: 'rs-ch17-t-025',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Trait Objects vs Typestate Trade-offs',
    prompt: `Compare the trait-object state pattern with the types-as-states (typestate) approach. Give one concrete advantage of each, focusing on (a) keeping a single Post type for the caller versus (b) catching misuse at compile time.`,
    hints: [
      'One keeps the variable type the same across transitions.',
      'One rejects illegal operations before the program runs.',
    ],
    solution: `The trait-object state pattern keeps a single Post type for the caller: the variable stays a Post through every transition, so it is easy to store in a struct or pass around, and the states are hidden behind a uniform interface. The typestate approach instead changes the type at each transition (DraftPost to PendingReviewPost to Post), which catches misuse at compile time because illegal operations simply do not exist on the wrong type. So you trade convenience and a stable type for stronger compile-time guarantees. The chapter's point is that Rust lets you push more state-machine correctness into the type system if you are willing to give up the single-type convenience.`,
    tags: ['state-pattern', 'typestate', 'tradeoffs', 'compare'],
  },
  {
    id: 'rs-ch17-t-026',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Generic Return Cannot Be a Trait Object',
    prompt: `Consider a trait:

trait Factory {
    fn make<T: Default>(&self) -> T;
}

Explain why you cannot create a Box<dyn Factory> from this trait, and which object-safety rule the make method violates.`,
    hints: [
      'The method has its own generic parameter T.',
      'Trait objects pick one set of methods at compile time.',
    ],
    solution: `You cannot make a Box<dyn Factory> because make has its own generic type parameter T, which violates the object-safety rule forbidding generic methods on object-safe traits. Monomorphization would need to generate a separate version of make for every concrete T, but a trait object has a single fixed vtable entry per method, with no room for an unbounded family of specialized versions. Since the concrete type behind the trait object is erased, the compiler cannot pick which monomorphized make to put in the vtable. To use this trait as an object you would have to remove the method-level generic, perhaps by replacing T with a concrete type or another trait object.`,
    tags: ['object-safety', 'generics', 'compile-error'],
  },
  {
    id: 'rs-ch17-t-027',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why content Borrows the Post',
    prompt: `In the trait-object blog, the State trait's content method has a signature like:

fn content<'a>(&self, post: &'a Post) -> &'a str { "" }

Explain why content receives the Post as an extra parameter with a tied lifetime, instead of the state simply owning and returning the text.`,
    hints: [
      'The actual text lives in the Post, not in the state object.',
      'The returned slice must not outlive the Post it points into.',
    ],
    solution: `The post's text is stored in the Post struct itself, not in the small state objects, so the content method needs access to the Post to return the real text. It takes &Post as a parameter and ties the returned &str's lifetime to that borrow with the lifetime 'a, guaranteeing the returned slice cannot outlive the Post it points into. The default implementation ignores the post and returns "", while Published returns &post.content, the actual stored text. The lifetime annotation is what makes the borrow checker accept returning a reference into the Post through the trait method.`,
    tags: ['state-pattern', 'lifetimes', 'borrowing'],
  },
  {
    id: 'rs-ch17-t-028',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Diagnosing a Mixed-Type Vector Error',
    prompt: `A learner writes:

let widgets = vec![Button { .. }, SelectBox { .. }];

and gets a type-mismatch error on the second element. Explain why a plain Vec rejects the mix, and rewrite the element expressions (conceptually) so the vector compiles as a collection of drawable widgets.`,
    hints: [
      'Vec elements must all be one type.',
      'Box<dyn Draw> unifies different concrete types.',
    ],
    solution: `A plain Vec is homogeneous: every element must have the same single type, so once the compiler infers Vec<Button> from the first element, the SelectBox second element is a type mismatch. To hold a mix you must give the elements a common trait-object type by boxing each as a Box<dyn Draw>, for example vec![Box::new(Button { .. }) as Box<dyn Draw>, Box::new(SelectBox { .. })]. Now the vector's type is Vec<Box<dyn Draw>>, every element coerces to the same trait-object type, and you can call draw on each through dynamic dispatch. The boxing and the shared Draw trait are what make the heterogeneous collection legal.`,
    tags: ['trait-objects', 'box', 'compile-error', 'vec'],
  },
  {
    id: 'rs-ch17-t-029',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Inheritance Goals Mapped to Rust',
    prompt: `People reach for inheritance for two distinct reasons: (1) to reuse code and (2) to enable polymorphism (treating different types uniformly). For each reason, name the Rust feature that addresses it, and explain why Rust deliberately separates these into different mechanisms.`,
    hints: [
      'Default methods address one reason.',
      'Trait objects and generics address the other.',
    ],
    solution: `For code reuse, Rust uses trait default methods (and composition), which let many types share one implementation without an inheritance hierarchy. For polymorphism, Rust uses trait objects (dyn Trait) for runtime/dynamic polymorphism and generics with trait bounds for compile-time/static polymorphism, both letting you treat different types uniformly through a shared trait. Rust separates these because traditional inheritance bundles the two concerns and often shares more than intended, such as forcing a subclass to inherit methods it should not have. By keeping reuse and polymorphism as distinct opt-in mechanisms, Rust avoids the fragile, over-coupled hierarchies that inheritance can produce.`,
    tags: ['inheritance', 'traits', 'polymorphism', 'design'],
  },
  {
    id: 'rs-ch17-t-030',
    chapter: 17,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Choosing Among Three Designs',
    prompt: `You are modeling a network connection that is Disconnected, Connecting, or Connected, where reading data is only legal when Connected. Argue which of these you would choose and why: (a) an enum with a match, (b) the trait-object state pattern, or (c) states as distinct types. Mention the key deciding factor.`,
    hints: [
      'Reading is only legal in one state.',
      'Which design makes an illegal read impossible to write?',
    ],
    solution: `Because reading is only legal when Connected, the strongest design is (c) states as distinct types: give only the Connected type a read method, so an illegal read on a Disconnected or Connecting value is a compile error and simply cannot be written. The trait-object state pattern (b) would keep one Connection type and either return an error or a no-op when read in the wrong state, pushing the check to runtime, though it is convenient if you need a single stable type. The enum-with-match approach (a) is simplest and fine for a closed, small state set but also defers the legality check to runtime via the match. The deciding factor is whether you want the "read only when Connected" rule enforced at compile time, which favors the typestate design.`,
    tags: ['typestate', 'state-pattern', 'enum', 'design'],
  },
]

export default problems
