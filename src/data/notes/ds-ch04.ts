import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-04',
  track: 'dsa',
  chapter: 4,
  title: 'Stack & Queue',
  summary: `A stack and a queue are the two simplest "linear" containers in all of computer science, and almost every harder data structure or algorithm is built on top of one of them. The only thing they decide is the order in which things come back out: a stack hands you the most recent item first (think a pile of plates), a queue hands you the oldest item first (think a line at a counter). That one decision is enough to power the browser's back button, a text editor's undo history, the function call stack your own program runs on, a printer's job list, and the breadth-first exploration that solves mazes and shortest-path problems.

In this chapter you will use Rust's real standard-library types for both: a plain Vec<T> is already a perfect stack, and a VecDeque<T> (a "double-ended queue") is the right tool for a queue or a deque. You will see exactly why popping from the front of a Vec is slow (O(n)) while a VecDeque does it in O(1), so you stop reaching for the wrong tool. Then you will meet the algorithms that make stacks famous: matching parentheses, the monotonic-stack pattern (next-greater-element, daily-temperatures, largest-rectangle-in-histogram), and evaluating Reverse-Polish-Notation. We close with a preview of why breadth-first search needs a queue, which sets up the graph chapters to come. Every operation's time and space cost is stated as we go, and we call out the Rust-specific gotchas (like usize never going negative) that trip up first-years.`,
  sections: [
    {
      heading: 'LIFO vs FIFO: two ways to take things back out',
      body: `A **stack** and a **queue** both hold a sequence of items and let you add items and remove items. The *only* difference is which item you are allowed to remove next, and that single rule changes everything you can do with them.

A stack is **LIFO**: *last in, first out*. The picture to keep in your head is a stack of plates in a cafeteria. You add a clean plate on top, and the next person takes the top plate, the one most recently added. You can only ever touch the top. Adding to the top is called **push**; removing the top is called **pop**; peeking at the top without removing it is **peek** (or in Rust, *last*). Real examples: the browser **back button** (the page you just left is the first one you go back to), a text editor's **undo** (the last edit is undone first), and the **call stack** your own program runs on (the most recently called function returns first).

A queue is **FIFO**: *first in, first out*. The picture is a line at a checkout counter or a coffee shop. People join at the **back** and are served from the **front**, in arrival order; no cutting. Adding at the back is **enqueue**; removing from the front is **dequeue**. Real examples: a **printer job queue** (documents print in the order they were submitted), tasks waiting for a CPU, and the frontier of a **breadth-first** maze search, which we build at the end of the chapter.

The word **invariant** will come up a lot: an invariant is a property that stays true no matter what operations you perform. The stack's invariant is "the item I pop is always the most recently pushed one still present." The queue's invariant is "the item I dequeue is always the one that has waited longest." Keep those two sentences and you can re-derive every operation.

### Common pitfalls

- Confusing the *ends*. A stack only ever touches one end (the top). A queue touches *both* ends but in fixed roles (add at back, remove at front). Mixing them up is the number-one beginner bug.
- Assuming "stack" means the machine call stack. It is the same idea, but in this chapter "stack" is a data structure you build, not the CPU's frame stack, though they share the LIFO rule for exactly the same reason.`,
      code: [
        {
          lang: 'text',
          src: `STACK (LIFO: last in, first out)
push and pop touch the SAME end (the top).

      push  ^   pop          push("A"), push("B"), push("C")
            |   |             then pop() -> "C" (newest out first)
            v   |
          +-----+  <- top (most recent)
          |  C  |
          +-----+
          |  B  |
          +-----+
          |  A  |  <- bottom (oldest)
          +-----+


QUEUE (FIFO: first in, first out)
add at the BACK, remove from the FRONT.

   enqueue ->  +---+---+---+---+  -> dequeue
   (push_back) | A | B | C | D |  (pop_front)
               +---+---+---+---+
                 ^           ^
              front        back
            (oldest,     (newest,
             served)     waits)

   enqueue A,B,C,D then dequeue() -> "A" (oldest out first)`,
        },
        {
          lang: 'rust',
          src: `fn main() {
    // A stack with a Vec: push on, pop off the SAME end (the top).
    let mut stack = Vec::new();
    stack.push("A");
    stack.push("B");
    stack.push("C");
    assert_eq!(stack.pop(), Some("C")); // newest out first -> LIFO

    // A queue with a VecDeque: add at the back, take from the front.
    use std::collections::VecDeque;
    let mut queue = VecDeque::new();
    queue.push_back("A");
    queue.push_back("B");
    queue.push_back("C");
    assert_eq!(queue.pop_front(), Some("A")); // oldest out first -> FIFO
}`,
        },
      ],
    },
    {
      heading: 'Vec<T> is already a stack: push, pop, last',
      anim: 'stack-pushpop',
      body: `In many languages you reach for a dedicated Stack class. In Rust you do not: a **Vec<T>** is a growable array that pushes and pops at its *end* in **O(1)** amortized time, which is exactly the LIFO contract. So the idiomatic Rust stack is just a Vec, and you should not write your own.

Three methods are all you need. **push(x)** appends x to the end (the top of the stack). **pop()** removes and returns the last element as an **Option<T>**: it gives back Some(value) if the stack had something, or None if it was empty. Returning an Option is Rust being honest: popping an empty stack is not a crash and not a special "−1" sentinel, it is simply None, and the type system forces you to handle that case. **last()** returns an Option<&T>, a *reference* to the top element without removing it, which is the "peek" operation.

What does **amortized O(1)** mean? "Amortized" means *averaged over many operations*. Most pushes just write one slot and bump a length counter, which is constant time. Occasionally the Vec runs out of room and has to allocate a bigger buffer and copy everything over, which is O(n) for that one push. But Rust grows the buffer by *doubling* its capacity, so those expensive copies happen rarely enough that, spread across all the pushes, the average cost per push is still constant. You almost never have to think about it; just know that "amortized O(1)" is not a lie even though one rare push is slow.

A concrete use you can picture: **undo/redo**. Every edit you make is pushed onto an *undo* stack. Pressing undo pops the last edit and pushes it onto a *redo* stack. Pressing redo pops from redo and pushes back onto undo. Two stacks, and the whole feature falls out.

### Common pitfalls

- Forgetting that pop() returns an **Option**, not the value directly. You must match on it, use if let, or call .unwrap() (which panics on None). Reaching for .unwrap() in real code on a possibly-empty stack is how you get a crash.
- Trying to index the top with stack[stack.len() - 1] when the stack might be empty: stack.len() is a **usize**, and 0usize - 1 does not give -1, it **panics** (or wraps to a giant number in release). Use .last() instead, which safely returns None.
- Calling pop() expecting FIFO. Vec pops from the *end*, so it is a stack, not a queue. For a queue use VecDeque (next sections).`,
      code: [
        {
          lang: 'text',
          src: `Vec<T> used as a stack. push/pop act on the right end ("top").
The "top" of the stack is the LAST element of the Vec.

 push(10)   push(20)   push(30)   pop()->30  pop()->20
                       +----+ top
                       | 30 |
            +----+ top +----+      +----+ top
            | 20 |     | 20 |      | 20 | top
 +----+ top +----+     +----+      +----+     +----+ top
 | 10 |     | 10 |     | 10 |      | 10 |     | 10 |
 +----+     +----+     +----+      +----+     +----+
 len=1      len=2      len=3       len=2      len=1

last() peeks at the top; pop() removes it; both return Option.`,
        },
        {
          lang: 'rust',
          src: `fn main() {
    let mut stack: Vec<i32> = Vec::new();
    stack.push(10);
    stack.push(20);
    stack.push(30);

    // Peek without removing: last() gives an Option<&i32>.
    if let Some(top) = stack.last() {
        println!("top is {top}"); // top is 30
    }

    // Pop returns Option<i32>; handle the empty case honestly.
    while let Some(x) = stack.pop() {
        println!("popped {x}");   // 30, then 20, then 10
    }
    assert_eq!(stack.pop(), None); // empty stack -> None, never a crash
}

// Undo/redo built from two stacks. Each edit is one character typed.
struct Editor { typed: Vec<char>, undone: Vec<char> }

impl Editor {
    fn type_char(&mut self, c: char) {
        self.typed.push(c);
        self.undone.clear(); // a fresh edit invalidates the redo history
    }
    fn undo(&mut self) {
        if let Some(c) = self.typed.pop() { self.undone.push(c); }
    }
    fn redo(&mut self) {
        if let Some(c) = self.undone.pop() { self.typed.push(c); }
    }
}`,
        },
      ],
    },
    {
      heading: 'VecDeque<T>: a queue, and why a Vec is the wrong queue',
      body: `A queue needs to add at one end and remove from the *other* end. You *could* try to fake it with a Vec: push_back is fine, but to dequeue you would call remove(0), which takes the front element. The problem is that a Vec stores its elements packed contiguously starting at index 0, so removing index 0 forces every other element to **shift left by one** to fill the hole. That shift touches all n remaining elements, so front removal on a Vec is **O(n)**. Do it in a loop and your "simple" queue is secretly O(n squared).

The fix is **VecDeque<T>**, the standard library's *double-ended queue* (say "deck"). It is implemented as a **ring buffer**: a fixed-size array plus two indices, a *head* and a *tail*, that wrap around the ends of the array like a clock face. To dequeue, it just advances the head index; nothing shifts. To enqueue, it advances the tail. Both ends support add and remove in **O(1)** amortized time. That is why a VecDeque is the correct queue *and* the correct stack-from-either-end, all in one type.

The four methods name their end explicitly: **push_back** / **pop_front** give you a FIFO queue; **push_front** / **pop_back** let you also work the other direction, which is what makes it a *deque* (double-ended queue), useful for sliding-window algorithms and undo-with-a-cap. Like Vec, the pop methods return **Option<T>** and front()/back() return Option<&T> for peeking.

A real picture: a **printer job queue**. Jobs are submitted (push_back) and printed in submission order (pop_front). A normal printer never needs to print the newest job first, so a plain FIFO queue models it exactly. If you wanted a "print this rush job next" feature, you would push_front it, and now you see why a *deque* is handy.

### Common pitfalls

- Using Vec::remove(0) or Vec::insert(0, x) in a loop as a queue. Each call is O(n); the loop becomes O(n squared). Reach for VecDeque the moment you need the front.
- Forgetting to import it: VecDeque lives in std::collections, so you need use std::collections::VecDeque;.
- Indexing a VecDeque like an array and assuming it maps to physical memory order. Logically deque[0] is the front, but physically the ring buffer may wrap, so do not rely on contiguous slices unless you call make_contiguous() first.`,
      code: [
        {
          lang: 'text',
          src: `Why Vec::remove(0) is O(n): the hole at index 0 must be filled
by shifting EVERY later element one slot to the left.

  before remove(0):  [ A | B | C | D | E ]
                       ^remove this
  after  remove(0):  [ B | C | D | E |   ]   <- B..E each moved left
                       \\___ n-1 elements shifted ___/   = O(n)

VecDeque ring buffer: just move the head index. Nothing shifts.
head = front (next to remove); tail = next free slot to fill.

   head                tail
    v                   v
  [ A | B | C | D | E | _ | _ | _ ]    pop_front():
  idx:0   1   2   3   4   5   6   7
       head            tail
        v               v
  [ _ | B | C | D | E | _ | _ | _ ]    A removed, head++ -> O(1)`,
        },
        {
          lang: 'rust',
          src: `use std::collections::VecDeque;

fn main() {
    // FIFO queue: add at the back, serve from the front.
    let mut jobs: VecDeque<&str> = VecDeque::new();
    jobs.push_back("resume.pdf");
    jobs.push_back("invoice.pdf");
    jobs.push_back("photo.png");

    // A rush job jumps to the front (this is the "deque" power):
    jobs.push_front("URGENT.pdf");

    while let Some(job) = jobs.pop_front() {
        println!("printing {job}"); // URGENT, resume, invoice, photo
    }
    assert!(jobs.is_empty());

    // peek without removing (no mut needed: front/back only read):
    let q = VecDeque::from([1, 2, 3]);
    assert_eq!(q.front(), Some(&1)); // oldest
    assert_eq!(q.back(),  Some(&3)); // newest
}`,
        },
      ],
    },
    {
      heading: 'Valid parentheses: the first real stack algorithm',
      body: `Here is a problem you cannot solve cleanly without a stack, and it shows *why* the LIFO rule is the natural fit. Given a string of brackets like "([]{})", decide whether every opening bracket is closed by a matching closing bracket *in the correct order*. So "()[]" is valid, "([)]" is **not** (the brackets cross), and "(((" is not (something is left open).

Why a stack? Brackets nest, and nesting is inherently last-in-first-out: the bracket you opened *most recently* is the one that must be closed *first*. That is the stack invariant word for word. So the algorithm is: scan the string left to right. When you see an **opening** bracket, push it. When you see a **closing** bracket, the top of the stack must be its matching opener; if the stack is empty or the top does not match, the string is invalid. At the very end the stack must be empty, otherwise some opener was never closed.

Let us be honest about the alternative. A brute-force approach might repeatedly scan the string looking for an innermost "()" pair, delete it, and repeat until nothing changes. That works but each scan is O(n) and you might do O(n) scans, giving **O(n squared)**. The stack solution touches each character exactly once with O(1) work per character, so it is **O(n) time** and **O(n) space** (the stack can hold up to n openers). Faster *and* simpler.

This same shape, "the most recent unmatched thing must be resolved first," is how compilers check that your code's braces balance, how XML/HTML validators match tags, and how the call stack itself works: the most recently entered function must return before the one that called it.

### Common pitfalls

- Forgetting the final emptiness check. "(((" never triggers a mismatch during the scan, so if you only check during the loop you will wrongly accept it. The stack must be empty at the end.
- Forgetting the *empty stack* case on a closing bracket. ")" with nothing pushed is invalid; pop() returns None and you must treat that as failure, not unwrap-and-panic.
- Comparing the wrong direction: when you see ')', the top should be '(' (its opener), not the other way around.`,
      code: [
        {
          lang: 'text',
          src: `Trace of is_valid("([]{})")  — stack grows to the right.

  char   action                 stack (top at right)
  ----   --------------------   --------------------
   (     push (                  [ (
   [     push [                  [ ( , [
   ]     top is [ -> match,pop   [ (
   {     push {                  [ ( , {
   }     top is { -> match,pop   [ (
   )     top is ( -> match,pop   [ ]   (empty)
  end    stack empty? YES        -> VALID

Counter-example  "([)]"  crosses:

   (  push       [ (
   [  push       [ ( , [
   )  top is [ , but ) needs (   -> MISMATCH -> INVALID`,
        },
        {
          lang: 'rust',
          src: `fn is_valid(s: &str) -> bool {
    let mut stack: Vec<char> = Vec::new();
    for c in s.chars() {
        match c {
            // openers: push and remember them
            '(' | '[' | '{' => stack.push(c),
            // closers: the top must be the matching opener
            ')' => if stack.pop() != Some('(') { return false; },
            ']' => if stack.pop() != Some('[') { return false; },
            '}' => if stack.pop() != Some('{') { return false; },
            _ => {} // ignore anything that is not a bracket
        }
    }
    // every opener must have been closed -> stack empty at the end
    stack.is_empty()
}

fn main() {
    assert!(is_valid("([]{})"));
    assert!(!is_valid("([)]")); // crossed brackets
    assert!(!is_valid("(((")); // left open -> stack not empty
    assert!(!is_valid("]"));    // closer with empty stack -> pop() is None
}
// Time: O(n), one pass. Space: O(n) for the stack in the worst case.`,
        },
      ],
    },
    {
      heading: 'The monotonic stack, part 1: next greater element',
      body: `Now the most powerful stack trick of all, and the one that shows up constantly in interviews and real systems: the **monotonic stack**. "Monotonic" just means "always sorted in one direction." A monotonic stack is a stack we deliberately keep in increasing (or decreasing) order by popping anything that would violate that order *before* we push.

The motivating problem is **next greater element**: for each number in an array, find the first number to its *right* that is strictly larger. For [2, 1, 2, 4, 3] the answers are [4, 2, 4, -1, -1] (use −1 when nothing larger exists to the right). The obvious brute force: for each element, walk rightward until you find a bigger one. In the worst case (a decreasing array) every element scans the whole tail, giving **O(n squared)** time, "for every item we re-scan all the others."

The monotonic-stack insight: instead of looking *forward* from each element, we let each element *resolve* the elements waiting behind it. We keep a stack of **indices** whose values are still waiting for their next-greater. We scan left to right. When the current value is bigger than the value at the top-of-stack index, the current value *is* that waiting element's answer, so we pop it and record it. We keep popping while the current value beats the top. Then we push the current index, still waiting for *its* answer. Anything left on the stack at the end has no greater element, so it gets −1.

Why is this fast? Each index is **pushed once and popped at most once**, so the total work across the whole scan is O(n), even though any single step might pop several items. This "each element enters and leaves the stack once" argument is the heart of every monotonic-stack proof. So we go from **O(n squared)** down to **O(n) time, O(n) space**.

### Common pitfalls

- Storing values when you need *positions*. Store **indices** on the stack; you can always look up the value with arr[i], and you usually need the index to write into the answer array.
- Getting the comparison backward. For *next greater*, you pop while the current value is **greater than** the stacked value (a *decreasing* stack of values). Flip the comparison for *next smaller*.
- Using a signed loop counter and decrementing below zero. Indices are **usize**; never compute i − 1 when i might be 0. Iterate forward and let the stack hold the waiting indices instead.`,
      code: [
        {
          lang: 'text',
          src: `next_greater([2, 1, 2, 4, 3]) frame by frame.
The stack holds INDICES whose answer is still unknown.

 i val  pops (while val > stack-top value)   stk(idx)  ans
 - ---  ------------------------------------  --------  ----------------
 0  2   (nothing on stack)                    [0]       [-1,-1,-1,-1,-1]
 1  1   1 > 2? no                             [0,1]     [-1,-1,-1,-1,-1]
 2  2   2 > 1(idx1)? yes -> ans[1]=2, pop     [0]       [-1, 2,-1,-1,-1]
        2 > 2(idx0)? no (strict)              [0,2]     [-1, 2,-1,-1,-1]
 3  4   4 > 2(idx2)? yes -> ans[2]=4, pop     [0]       [-1, 2, 4,-1,-1]
        4 > 2(idx0)? yes -> ans[0]=4, pop     []        [ 4, 2, 4,-1,-1]
        push 3                                [3]       [ 4, 2, 4,-1,-1]
 4  3   3 > 4(idx3)? no                       [3,4]     [ 4, 2, 4,-1,-1]
 end leftover idx 3,4 keep -1     final ans:  [4,2,4,-1,-1]`,
        },
        {
          lang: 'rust',
          src: `// For each element, the first strictly-greater element to its right (-1 if none).
fn next_greater(arr: &[i32]) -> Vec<i32> {
    let mut ans = vec![-1; arr.len()];
    let mut stack: Vec<usize> = Vec::new(); // indices still waiting

    for i in 0..arr.len() {
        // current value resolves everyone smaller waiting on the stack
        while let Some(&top) = stack.last() {
            if arr[i] > arr[top] {
                ans[top] = arr[i]; // i is top's next-greater
                stack.pop();
            } else {
                break;
            }
        }
        stack.push(i); // i now waits for ITS next-greater
    }
    ans // indices left on the stack already hold -1
}

fn main() {
    assert_eq!(next_greater(&[2, 1, 2, 4, 3]), vec![4, 2, 4, -1, -1]);
}
// Time: O(n) — each index is pushed once and popped at most once.
// Space: O(n) for the stack.`,
        },
      ],
    },
    {
      heading: 'The monotonic stack, part 2: daily temperatures & histograms',
      body: `The same engine answers "how *far* away" instead of "what value." **Daily temperatures**: given a list of daily temperatures, for each day output how many days you must wait for a warmer day, or 0 if none ever comes. For [73, 74, 75, 71, 69, 72, 76, 73] the answer is [1, 1, 4, 2, 1, 1, 0, 0]. It is the next-greater pattern again, but we store the *distance* between indices (i − top) rather than the future value. Still **O(n) time** by the same push-once/pop-once argument.

A subtler relative is **largest rectangle in a histogram**: given bar heights like [2, 1, 5, 6, 2, 3], find the area of the biggest axis-aligned rectangle that fits under the bars. A rectangle is limited by the *shortest* bar it spans, so for each bar we want to know how far left and how far right we can extend while staying at least that tall. The brute force tries every pair of left/right boundaries, **O(n squared)**. A monotonic *increasing* stack of indices solves it in **O(n)**: we push bars while heights increase, and when a shorter bar arrives we pop taller bars and finalize each popped bar as the *height* of a rectangle whose width reaches from just after the new top, back to the current position. I will sketch the idea in the trace and give working code; trace it once by hand and the pattern clicks.

The lesson across all three problems (next-greater, daily-temperatures, histogram) is that a monotonic stack turns a "look around me" question into a single left-to-right sweep where each element is handled in amortized O(1). Whenever you catch yourself writing a nested loop that, for each element, scans neighbors looking for the next bigger/smaller one, stop and ask whether a monotonic stack collapses it to one pass.

### Common pitfalls

- For daily temperatures, push **indices** and record i − top as the distance. Pushing the temperature value loses the position you need.
- For the histogram, the classic trick is to append a **sentinel** bar of height 0 at the end so the final loop flushes everything left on the stack. Forgetting it leaves the tallest trailing bars unprocessed.
- Width math in the histogram is the easy place to be off by one: after popping height h at index top, the width is i − (new stack top) − 1, or i if the stack became empty. Derive it from the picture, do not memorize it.`,
      code: [
        {
          lang: 'text',
          src: `daily_temperatures([73,74,75,71,69,72,76,73])
stack holds indices of days still waiting for a warmer day.

 i  t   pops (while t[i] > t[top]) -> ans[top] = i - top   stack
 -  --  ---------------------------------------------      ---------
 0  73                                                     [0]
 1  74  74>73 -> ans[0]=1-0=1, pop                         [1]
 2  75  75>74 -> ans[1]=2-1=1, pop                         [2]
 3  71  71>75? no                                          [2,3]
 4  69  69>71? no                                          [2,3,4]
 5  72  72>69 -> ans[4]=1, pop; 72>71 -> ans[3]=2, pop;    [2,5]
        72>75? no
 6  76  76>72 -> ans[5]=1; 76>75 -> ans[2]=4; pop both     [6]
 7  73  73>76? no                                          [6,7]
 end leftovers 6,7 keep 0   -> [1,1,4,2,1,1,0,0]`,
        },
        {
          lang: 'rust',
          src: `// Days to wait for a warmer day (0 if none). Distance version of next-greater.
fn daily_temperatures(t: &[i32]) -> Vec<i32> {
    let mut ans = vec![0; t.len()];
    let mut stack: Vec<usize> = Vec::new(); // indices waiting for warmth
    for i in 0..t.len() {
        while let Some(&top) = stack.last() {
            if t[i] > t[top] {
                ans[top] = (i - top) as i32; // how many days top waited
                stack.pop();
            } else { break; }
        }
        stack.push(i);
    }
    ans
}

// Largest rectangle under a histogram, O(n) with a monotonic-increasing stack.
fn largest_rectangle(heights: &[i32]) -> i32 {
    let mut stack: Vec<usize> = Vec::new();
    let mut best = 0;
    // iterate one PAST the end; the extra height 0 flushes the stack
    for i in 0..=heights.len() {
        let cur = if i == heights.len() { 0 } else { heights[i] };
        while let Some(&top) = stack.last() {
            if cur < heights[top] {
                let h = heights[stack.pop().unwrap()];
                // width reaches back to the new top (exclusive), else 0..i
                let width = match stack.last() {
                    Some(&left) => (i - left - 1) as i32,
                    None => i as i32,
                };
                best = best.max(h * width);
            } else { break; }
        }
        stack.push(i);
    }
    best
}

fn main() {
    assert_eq!(daily_temperatures(&[73,74,75,71,69,72,76,73]),
               vec![1,1,4,2,1,1,0,0]);
    assert_eq!(largest_rectangle(&[2,1,5,6,2,3]), 10); // bars 5 and 6: 2*5
}
// Both run in O(n) time and O(n) space.`,
        },
      ],
    },
    {
      heading: 'Reverse Polish Notation: a stack as a calculator',
      body: `**Reverse Polish Notation** (RPN), also called *postfix*, writes the operator *after* its two operands. So "3 + 4" becomes "3 4 +", and "(3 + 4) * 5" becomes "3 4 + 5 *". The big win is that postfix needs **no parentheses and no precedence rules**: the order of tokens already encodes exactly what to do. This is not academic, it is how stack-based virtual machines and old HP calculators actually evaluate expressions, and it is why postfix is the target form compilers convert infix expressions into.

A stack evaluates RPN in one pass with a beautifully simple rule. Scan the tokens left to right. If the token is a **number**, push it. If it is an **operator**, pop the **two** most recent numbers, apply the operator, and push the result back. The order matters for subtraction and division: the value popped *second* is the left operand. When the tokens run out, the single value left on the stack is the answer.

Why does the stack get the grouping right for free? Because every operator consumes the two results sitting closest to the top, which are exactly the most-recently-computed sub-expressions, the same nesting a stack naturally tracks. There is no brute-force-versus-clever story here: RPN evaluation is **O(n) time** in the number of tokens, with **O(n) space** for the stack (really O(depth), the maximum nesting), and there is simply no need to do anything smarter.

This connects back to the very first idea of the chapter: the **call stack**. When your program computes f(g(x), h(y)), it evaluates the inner calls first and stacks up their results before the outer call consumes them, exactly like an operator popping its two operands.

### Common pitfalls

- Reversing the operands for non-commutative operators. For "a b -", you pop b first, then a, and compute **a − b**, not b − a. The same care applies to division.
- Forgetting to push the result back. After computing, the result becomes an operand for later operators, so it must go back on the stack.
- Popping from an empty stack on malformed input. A well-formed RPN expression always has enough operands; if you support untrusted input, treat a missing operand (pop returning None) as an error rather than unwrapping.`,
      code: [
        {
          lang: 'text',
          src: `Evaluate RPN  ["3","4","+","5","*"]  meaning (3+4)*5.

  token  action                          stack (top at right)
  -----  -----------------------------   --------------------
   "3"   push 3                           [ 3
   "4"   push 4                           [ 3 , 4
   "+"   pop 4, pop 3 -> 3+4=7, push 7    [ 7
   "5"   push 5                           [ 7 , 5
   "*"   pop 5, pop 7 -> 7*5=35, push 35  [ 35
   end   one value left                   -> 35

Note for "-" and "/": the FIRST value popped is the RIGHT operand.
   ["8","2","-"]  ->  pop 2 (right), pop 8 (left), 8-2 = 6`,
        },
        {
          lang: 'rust',
          src: `fn eval_rpn(tokens: &[&str]) -> i64 {
    let mut stack: Vec<i64> = Vec::new();
    for &tok in tokens {
        match tok {
            "+" | "-" | "*" | "/" => {
                // pop order matters: b is the RIGHT operand, a the LEFT
                let b = stack.pop().expect("missing right operand");
                let a = stack.pop().expect("missing left operand");
                let r = match tok {
                    "+" => a + b,
                    "-" => a - b,
                    "*" => a * b,
                    _   => a / b, // integer division
                };
                stack.push(r);
            }
            // a number: parse and push it
            n => stack.push(n.parse().expect("not a number")),
        }
    }
    stack.pop().expect("empty expression") // the lone survivor is the answer
}

fn main() {
    assert_eq!(eval_rpn(&["3", "4", "+", "5", "*"]), 35); // (3+4)*5
    assert_eq!(eval_rpn(&["8", "2", "-"]), 6);            // 8 - 2, order!
}
// Time: O(n) in tokens. Space: O(depth) for the stack.`,
        },
      ],
    },
    {
      heading: 'Why BFS needs a queue: a maze preview of graphs',
      body: `We end with the queue's headline use, which previews the graph chapters: **breadth-first search** (BFS). Imagine exploring a maze from a start cell, looking for the exit. BFS explores in *rings*: first all cells one step away, then all cells two steps away, then three, and so on. Because it always finishes a closer ring before touching a farther one, the **first time** it reaches the exit is guaranteed to be by a **shortest** path. That guarantee is why BFS is the standard way to find shortest paths in an unweighted grid or graph.

The queue is what enforces "closer rings first." We **enqueue** the start, then loop: **dequeue** a cell, and **enqueue** all its unvisited neighbors. Because the queue is FIFO, neighbors discovered earlier (which are closer to the start) come back out before neighbors discovered later. A *visited* set (often a HashSet, or a boolean grid) stops us from enqueueing the same cell twice, which would otherwise loop forever. Swap the queue for a *stack* and you get depth-first search instead, which dives down one path before backtracking and does **not** give shortest paths, the single data-structure choice changes the whole behavior.

Each cell is enqueued and dequeued at most once, and we look at each edge (neighbor link) a constant number of times, so BFS runs in **O(V + E)** time, where V is the number of cells and E the number of connections, with **O(V)** space for the queue and visited set. Keep this in your pocket: the moment a problem says "fewest steps," "shortest path in an unweighted graph," or "explore level by level," the answer almost always starts with a queue.

### Common pitfalls

- Marking a cell visited when you **dequeue** it instead of when you **enqueue** it. The dequeue-time version lets the same cell get enqueued multiple times before it is processed, wasting work and sometimes inflating distances. Mark visited at enqueue time.
- Using a Vec with remove(0) as the BFS frontier. That is O(n) per dequeue and turns BFS into O(n squared); use VecDeque::pop_front.
- Confusing BFS (queue, shortest paths) with DFS (stack/recursion, not shortest). The data structure *is* the difference.`,
      code: [
        {
          lang: 'text',
          src: `BFS rings out from S. The queue holds the current frontier;
each number is the step (distance) at which that cell is reached.
This is the SAME grid the code below uses: ["S....",".###.","....E"]

      grid           distances found by BFS
   S . . . .         0 1 2 3 4    S = start (distance 0)
   . # # # .         1 # # # 5    # = wall (cannot enter)
   . . . . E         2 3 4 5 6    E reached at distance 6 = shortest

The walls block the middle, so the only route is down the left
column, across the bottom, and up to E: 6 steps, and BFS finds it.

Queue over time (each cell is enqueued exactly once):
   [S]        dequeue S, enqueue its open neighbors (dist 1)
   [a, b]     dequeue a, enqueue ITS new neighbors (dist 2) ...
   FIFO order guarantees every dist-1 cell leaves the queue
   before any dist-2 cell, so distances only ever grow.`,
        },
        {
          lang: 'rust',
          src: `use std::collections::{VecDeque, HashSet};

// Shortest number of steps from start to goal on a grid.
// '#' is a wall; we may step up/down/left/right.
fn bfs_shortest(grid: &[&str], start: (i32, i32), goal: (i32, i32)) -> Option<u32> {
    let rows = grid.len() as i32;
    let cols = grid[0].len() as i32;
    let cell = |r: i32, c: i32| grid[r as usize].as_bytes()[c as usize];

    let mut queue: VecDeque<(i32, i32, u32)> = VecDeque::new();
    let mut visited: HashSet<(i32, i32)> = HashSet::new();

    queue.push_back((start.0, start.1, 0));
    visited.insert(start); // mark visited at ENQUEUE time

    while let Some((r, c, dist)) = queue.pop_front() {
        if (r, c) == goal {
            return Some(dist); // first arrival = shortest, thanks to FIFO
        }
        // four neighbors: up, down, left, right
        for (dr, dc) in [(-1, 0), (1, 0), (0, -1), (0, 1)] {
            let (nr, nc) = (r + dr, c + dc);
            let inside = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
            if inside && cell(nr, nc) != b'#' && visited.insert((nr, nc)) {
                // visited.insert returns true only if (nr,nc) was NEW
                queue.push_back((nr, nc, dist + 1));
            }
        }
    }
    None // goal unreachable
}

fn main() {
    let grid = ["S....", ".###.", "....E"];
    assert_eq!(bfs_shortest(&grid, (0, 0), (2, 4)), Some(6));
}
// Time: O(V + E) over cells and connections. Space: O(V) for queue + visited.`,
        },
      ],
    },
  ],
  takeaways: [
    'A stack is LIFO (last in, first out, like plates); a queue is FIFO (first in, first out, like a checkout line). That one rule defines everything else.',
    'In Rust a Vec<T> IS a stack: push, pop, and last all act on the end in amortized O(1); do not write your own stack type.',
    'pop() and last() return Option, forcing you to handle the empty case; never index the top of a possibly-empty stack because usize cannot go negative.',
    'A VecDeque<T> is the right queue and deque: push_back/pop_front (FIFO) and push_front/pop_back are all O(1) via a ring buffer.',
    'Vec front removal (remove(0)) is O(n) because every later element shifts; a loop of those is O(n squared), so reach for VecDeque instead.',
    'Valid-parentheses matching is the canonical stack problem: push openers, match closers against the top, and require an empty stack at the end; O(n).',
    'The monotonic stack turns "find the next greater/smaller neighbor" from O(n squared) into O(n) because each index is pushed once and popped once.',
    'Next-greater-element, daily-temperatures, and largest-rectangle-in-histogram are all the same monotonic-stack engine, storing values, distances, or widths.',
    'Reverse Polish Notation evaluates in one stack pass with no parentheses or precedence: push numbers, and on an operator pop two and push the result; O(n).',
    'BFS needs a FIFO queue to explore level by level, which makes the first arrival a shortest path; swap the queue for a stack and you get DFS instead.',
  ],
  cheatsheet: [
    { label: 'Vec::push(x)', value: 'append to the top of the stack; amortized O(1)' },
    { label: 'Vec::pop()', value: 'remove + return top as Option<T>; O(1)' },
    { label: 'Vec::last()', value: 'peek top as Option<&T> without removing; O(1)' },
    { label: 'Vec::remove(0)', value: 'front removal shifts all elements; O(n) — avoid as a queue' },
    { label: 'VecDeque::push_back / pop_front', value: 'FIFO queue ends; O(1) each' },
    { label: 'VecDeque::push_front / pop_back', value: 'deque (double-ended) ends; O(1) each' },
    { label: 'VecDeque::front / back', value: 'peek either end as Option<&T>; O(1)' },
    { label: 'use std::collections::VecDeque', value: 'required import for the queue/deque type' },
    { label: 'Valid parentheses', value: 'stack of openers; O(n) time, O(n) space' },
    { label: 'Monotonic stack', value: 'next greater/smaller in O(n); push once, pop once' },
    { label: 'Largest rectangle (histogram)', value: 'increasing index stack + height-0 sentinel; O(n)' },
    { label: 'Reverse Polish Notation', value: 'push numbers, op pops 2 and pushes result; O(n)' },
    { label: 'BFS frontier', value: 'VecDeque + visited set; shortest path; O(V + E)' },
    { label: 'usize gotcha', value: 'indices are usize; i - 1 panics/wraps at 0 — iterate forward' },
  ],
}

export default note
