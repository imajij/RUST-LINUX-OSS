import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch04-c-001',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Valid Parentheses',
    prompt: `Implement:

    fn is_valid(s: &str) -> bool

s contains only the characters ()[]{}. Return true if every bracket is closed by the matching type in the correct order.
Example: "([])" -> true, "([)]" -> false`,
    hints: [
      'Push opening brackets onto a stack, storing the expected closing bracket.',
      'On a closing bracket, pop and check that the top matches.',
      'At the end the stack must be empty.',
    ],
    solution: `fn is_valid(s: &str) -> bool {
    let mut stack: Vec<char> = Vec::new();
    for c in s.chars() {
        match c {
            '(' => stack.push(')'),
            '[' => stack.push(']'),
            '{' => stack.push('}'),
            _ => {
                if stack.pop() != Some(c) {
                    return false;
                }
            }
        }
    }
    stack.is_empty()
}

fn main() {
    assert!(is_valid("([])"));
    assert!(!is_valid("([)]"));
    assert!(is_valid(""));
    assert!(is_valid("{}[]()"));
    assert!(!is_valid("{"));
    println!("ok");
}`,
    starter: `fn is_valid(s: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(is_valid("([])"));
    assert!(!is_valid("([)]"));
    println!("ok");
}`,
    tags: ['stack', 'string'],
  },
  {
    id: 'ds-ch04-c-002',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Min Stack',
    prompt: `Design a stack that supports push, pop, top, and get_min in O(1) time.

Implement a struct MinStack with:
  fn new() -> Self
  fn push(&mut self, val: i32)
  fn pop(&mut self) -> i32
  fn top(&self) -> i32
  fn get_min(&self) -> i32

Example: push 5, push 3, push 7 -> get_min() == 3, pop() == 7, get_min() == 3`,
    hints: [
      'Maintain a parallel "mins" stack that tracks the running minimum.',
      'When you push, also push the new minimum onto the mins stack.',
      'When you pop, also pop from the mins stack.',
    ],
    solution: `struct MinStack {
    data: Vec<i32>,
    mins: Vec<i32>,
}

impl MinStack {
    fn new() -> Self {
        MinStack { data: Vec::new(), mins: Vec::new() }
    }

    fn push(&mut self, val: i32) {
        self.data.push(val);
        let m = if self.mins.is_empty() {
            val
        } else {
            let last = *self.mins.last().unwrap();
            if val < last { val } else { last }
        };
        self.mins.push(m);
    }

    fn pop(&mut self) -> i32 {
        self.mins.pop();
        self.data.pop().unwrap()
    }

    fn top(&self) -> i32 {
        *self.data.last().unwrap()
    }

    fn get_min(&self) -> i32 {
        *self.mins.last().unwrap()
    }
}

fn main() {
    let mut ms = MinStack::new();
    ms.push(5);
    ms.push(3);
    ms.push(7);
    assert_eq!(ms.get_min(), 3);
    assert_eq!(ms.top(), 7);
    ms.pop();
    assert_eq!(ms.get_min(), 3);
    ms.pop();
    assert_eq!(ms.get_min(), 5);
    ms.push(1);
    assert_eq!(ms.get_min(), 1);
    println!("ok");
}`,
    starter: `struct MinStack {
    // TODO: add fields
}

impl MinStack {
    fn new() -> Self {
        todo!()
    }
    fn push(&mut self, val: i32) {
        todo!()
    }
    fn pop(&mut self) -> i32 {
        todo!()
    }
    fn top(&self) -> i32 {
        todo!()
    }
    fn get_min(&self) -> i32 {
        todo!()
    }
}

fn main() {
    let mut ms = MinStack::new();
    ms.push(5);
    ms.push(3);
    assert_eq!(ms.get_min(), 3);
    println!("ok");
}`,
    tags: ['stack', 'design'],
  },
  {
    id: 'ds-ch04-c-003',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Evaluate Reverse Polish Notation',
    prompt: `Implement:

    fn eval_rpn(tokens: &[&str]) -> i32

tokens is a sequence of integer literals and the operators +, -, *, /. Evaluate the expression in postfix order using a stack. Division truncates toward zero.
Example: ["2","1","+","3","*"] -> 9  (because (2+1)*3)`,
    hints: [
      'Push integers onto a stack.',
      'When you see an operator, pop two operands, apply it, and push the result.',
      'Use t.parse::<i32>().unwrap() to convert a token to an integer.',
    ],
    solution: `fn eval_rpn(tokens: &[&str]) -> i32 {
    let mut stack: Vec<i32> = Vec::new();
    for &t in tokens {
        match t {
            "+" | "-" | "*" | "/" => {
                let b = stack.pop().unwrap();
                let a = stack.pop().unwrap();
                let result = match t {
                    "+" => a + b,
                    "-" => a - b,
                    "*" => a * b,
                    "/" => a / b,
                    _ => unreachable!(),
                };
                stack.push(result);
            }
            _ => {
                stack.push(t.parse::<i32>().unwrap());
            }
        }
    }
    stack.pop().unwrap()
}

fn main() {
    assert_eq!(eval_rpn(&["2", "1", "+", "3", "*"]), 9);
    assert_eq!(eval_rpn(&["4", "13", "5", "/", "+"]), 6);
    assert_eq!(eval_rpn(&["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]), 22);
    assert_eq!(eval_rpn(&["3"]), 3);
    println!("ok");
}`,
    starter: `fn eval_rpn(tokens: &[&str]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(eval_rpn(&["2", "1", "+", "3", "*"]), 9);
    assert_eq!(eval_rpn(&["4", "13", "5", "/", "+"]), 6);
    println!("ok");
}`,
    tags: ['stack', 'math'],
  },
  {
    id: 'ds-ch04-c-004',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Queue Using Two Stacks',
    prompt: `Implement a FIFO queue using only two Vec stacks.

Define struct QueueViaStacks with:
  fn new() -> Self
  fn push(&mut self, val: i32)
  fn pop(&mut self) -> i32      (remove and return front)
  fn peek(&mut self) -> i32     (return front without removing)
  fn is_empty(&self) -> bool

Example: push 1, push 2, push 3 -> peek() == 1, pop() == 1, pop() == 2`,
    hints: [
      'Use an inbox stack for push and an outbox stack for pop/peek.',
      'When outbox is empty, transfer all elements from inbox to outbox.',
      'Elements reverse order on transfer, making the oldest element the new top.',
    ],
    solution: `use std::collections::VecDeque;

struct QueueViaStacks {
    inbox: Vec<i32>,
    outbox: Vec<i32>,
}

impl QueueViaStacks {
    fn new() -> Self {
        QueueViaStacks { inbox: Vec::new(), outbox: Vec::new() }
    }

    fn push(&mut self, val: i32) {
        self.inbox.push(val);
    }

    fn pop(&mut self) -> i32 {
        self.transfer();
        self.outbox.pop().unwrap()
    }

    fn peek(&mut self) -> i32 {
        self.transfer();
        *self.outbox.last().unwrap()
    }

    fn is_empty(&self) -> bool {
        self.inbox.is_empty() && self.outbox.is_empty()
    }

    fn transfer(&mut self) {
        if self.outbox.is_empty() {
            while let Some(v) = self.inbox.pop() {
                self.outbox.push(v);
            }
        }
    }
}

fn brute_force(ops: &[(bool, i32)]) -> Vec<i32> {
    let mut q: VecDeque<i32> = VecDeque::new();
    let mut out = Vec::new();
    for &(is_push, v) in ops {
        if is_push {
            q.push_back(v);
        } else {
            out.push(q.pop_front().unwrap());
        }
    }
    out
}

fn main() {
    let mut q = QueueViaStacks::new();
    assert!(q.is_empty());
    q.push(1);
    q.push(2);
    q.push(3);
    assert_eq!(q.peek(), 1);
    assert_eq!(q.pop(), 1);
    assert_eq!(q.pop(), 2);
    q.push(4);
    assert_eq!(q.pop(), 3);
    assert_eq!(q.pop(), 4);
    assert!(q.is_empty());

    let ops = [(true, 10), (true, 20), (false, 0), (true, 30), (false, 0), (false, 0)];
    let mut q2 = QueueViaStacks::new();
    let mut my_out = Vec::new();
    for &(is_push, v) in &ops {
        if is_push {
            q2.push(v);
        } else {
            my_out.push(q2.pop());
        }
    }
    assert_eq!(my_out, brute_force(&ops));
    println!("ok");
}`,
    starter: `struct QueueViaStacks {
    // TODO: add fields
}

impl QueueViaStacks {
    fn new() -> Self { todo!() }
    fn push(&mut self, val: i32) { todo!() }
    fn pop(&mut self) -> i32 { todo!() }
    fn peek(&mut self) -> i32 { todo!() }
    fn is_empty(&self) -> bool { todo!() }
}

fn main() {
    let mut q = QueueViaStacks::new();
    q.push(1);
    q.push(2);
    assert_eq!(q.pop(), 1);
    println!("ok");
}`,
    tags: ['stack', 'queue', 'design'],
  },
  {
    id: 'ds-ch04-c-005',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Stack Using Queues',
    prompt: `Implement a LIFO stack using only a VecDeque queue.

Define struct StackViaQueues with:
  fn new() -> Self
  fn push(&mut self, val: i32)
  fn pop(&mut self) -> i32
  fn top(&self) -> i32
  fn is_empty(&self) -> bool

Example: push 1, push 2, push 3 -> top() == 3, pop() == 3, pop() == 2`,
    hints: [
      'After pushing a new element to the back, rotate all previously queued elements to the back.',
      'The newly pushed element ends up at the front, giving LIFO order.',
    ],
    solution: `use std::collections::VecDeque;

struct StackViaQueues {
    q: VecDeque<i32>,
}

impl StackViaQueues {
    fn new() -> Self {
        StackViaQueues { q: VecDeque::new() }
    }

    fn push(&mut self, val: i32) {
        self.q.push_back(val);
        let len = self.q.len();
        for _ in 0..len - 1 {
            let front = self.q.pop_front().unwrap();
            self.q.push_back(front);
        }
    }

    fn pop(&mut self) -> i32 {
        self.q.pop_front().unwrap()
    }

    fn top(&self) -> i32 {
        *self.q.front().unwrap()
    }

    fn is_empty(&self) -> bool {
        self.q.is_empty()
    }
}

fn main() {
    let mut s = StackViaQueues::new();
    assert!(s.is_empty());
    s.push(1);
    s.push(2);
    s.push(3);
    assert_eq!(s.top(), 3);
    assert_eq!(s.pop(), 3);
    assert_eq!(s.pop(), 2);
    s.push(5);
    assert_eq!(s.pop(), 5);
    assert_eq!(s.pop(), 1);
    assert!(s.is_empty());
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

struct StackViaQueues {
    // TODO: add fields
}

impl StackViaQueues {
    fn new() -> Self { todo!() }
    fn push(&mut self, val: i32) { todo!() }
    fn pop(&mut self) -> i32 { todo!() }
    fn top(&self) -> i32 { todo!() }
    fn is_empty(&self) -> bool { todo!() }
}

fn main() {
    let mut s = StackViaQueues::new();
    s.push(1);
    s.push(2);
    assert_eq!(s.pop(), 2);
    println!("ok");
}`,
    tags: ['stack', 'queue', 'design'],
  },
  {
    id: 'ds-ch04-c-006',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Next Greater Element',
    prompt: `Implement:

    fn next_greater(nums: &[i32]) -> Vec<i32>

For each position i, return the first element to the right that is strictly larger than nums[i]. If none exists, use -1.
Example: [2,1,2,4,3] -> [4,2,4,-1,-1]`,
    hints: [
      'Use a monotonic stack of indices.',
      'Iterate left to right; while the stack top is smaller than the current element, pop and record the answer.',
    ],
    solution: `fn next_greater(nums: &[i32]) -> Vec<i32> {
    let n = nums.len();
    let mut result = vec![-1; n];
    let mut stack: Vec<usize> = Vec::new();
    for i in 0..n {
        while let Some(&top) = stack.last() {
            if nums[i] > nums[top] {
                result[top] = nums[i];
                stack.pop();
            } else {
                break;
            }
        }
        stack.push(i);
    }
    result
}

fn brute_next_greater(nums: &[i32]) -> Vec<i32> {
    let n = nums.len();
    let mut result = vec![-1; n];
    for i in 0..n {
        for j in i + 1..n {
            if nums[j] > nums[i] {
                result[i] = nums[j];
                break;
            }
        }
    }
    result
}

fn main() {
    let a = vec![2, 1, 2, 4, 3];
    assert_eq!(next_greater(&a), vec![4, 2, 4, -1, -1]);
    let b = vec![1, 3, 2, 4];
    assert_eq!(next_greater(&b), brute_next_greater(&b));
    let c = vec![5, 4, 3, 2, 1];
    assert_eq!(next_greater(&c), brute_next_greater(&c));
    let d = vec![1, 2, 3, 4, 5];
    assert_eq!(next_greater(&d), brute_next_greater(&d));
    println!("ok");
}`,
    starter: `fn next_greater(nums: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let a = vec![2, 1, 2, 4, 3];
    assert_eq!(next_greater(&a), vec![4, 2, 4, -1, -1]);
    println!("ok");
}`,
    tags: ['stack', 'monotonic-stack'],
  },
  {
    id: 'ds-ch04-c-007',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Daily Temperatures',
    prompt: `Implement:

    fn daily_temperatures(temps: &[i32]) -> Vec<i32>

For each day i, return how many days you must wait until a warmer temperature. If there is no future warmer day, return 0 for that position.
Example: [73,74,75,71,69,72,76,73] -> [1,1,4,2,1,1,0,0]`,
    hints: [
      'Use a monotonic decreasing stack of indices.',
      'When the current temperature exceeds the temperature at the stack top, pop and compute the gap.',
    ],
    solution: `fn daily_temperatures(temps: &[i32]) -> Vec<i32> {
    let n = temps.len();
    let mut result = vec![0i32; n];
    let mut stack: Vec<usize> = Vec::new();
    for i in 0..n {
        while let Some(&top) = stack.last() {
            if temps[i] > temps[top] {
                result[top] = (i - top) as i32;
                stack.pop();
            } else {
                break;
            }
        }
        stack.push(i);
    }
    result
}

fn brute_daily(temps: &[i32]) -> Vec<i32> {
    let n = temps.len();
    let mut result = vec![0i32; n];
    for i in 0..n {
        for j in i + 1..n {
            if temps[j] > temps[i] {
                result[i] = (j - i) as i32;
                break;
            }
        }
    }
    result
}

fn main() {
    let t1 = vec![73, 74, 75, 71, 69, 72, 76, 73];
    assert_eq!(daily_temperatures(&t1), vec![1, 1, 4, 2, 1, 1, 0, 0]);
    let t2 = vec![30, 40, 50, 60];
    assert_eq!(daily_temperatures(&t2), brute_daily(&t2));
    let t3 = vec![30, 60, 90];
    assert_eq!(daily_temperatures(&t3), brute_daily(&t3));
    let t4 = vec![90, 80, 70, 60];
    assert_eq!(daily_temperatures(&t4), brute_daily(&t4));
    println!("ok");
}`,
    starter: `fn daily_temperatures(temps: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let t1 = vec![73, 74, 75, 71, 69, 72, 76, 73];
    assert_eq!(daily_temperatures(&t1), vec![1, 1, 4, 2, 1, 1, 0, 0]);
    println!("ok");
}`,
    tags: ['stack', 'monotonic-stack'],
  },
  {
    id: 'ds-ch04-c-008',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Decode Run-Length Nested String',
    prompt: `Implement:

    fn decode_string(s: &str) -> String

s is encoded as k[inner] meaning inner repeated k times; brackets can nest.
Example: "3[a]2[bc]" -> "aaabcbc", "3[a2[c]]" -> "accaccacc"`,
    hints: [
      'Use a count stack and a string stack.',
      'On [ push the current string and count onto their stacks, reset both.',
      'On ] pop the count and previous string, repeat current and append.',
    ],
    solution: `fn decode_string(s: &str) -> String {
    let mut count_stack: Vec<usize> = Vec::new();
    let mut string_stack: Vec<String> = Vec::new();
    let mut current = String::new();
    let mut k: usize = 0;
    for c in s.chars() {
        if c.is_ascii_digit() {
            k = k * 10 + (c as usize - '0' as usize);
        } else if c == '[' {
            count_stack.push(k);
            string_stack.push(current.clone());
            current = String::new();
            k = 0;
        } else if c == ']' {
            let repeat = count_stack.pop().unwrap();
            let prev = string_stack.pop().unwrap();
            let repeated = current.repeat(repeat);
            current = prev + &repeated;
        } else {
            current.push(c);
        }
    }
    current
}

fn main() {
    assert_eq!(decode_string("3[a]2[bc]"), "aaabcbc");
    assert_eq!(decode_string("3[a2[c]]"), "accaccacc");
    assert_eq!(decode_string("2[abc]3[cd]ef"), "abcabccdcdcdef");
    assert_eq!(decode_string("abc"), "abc");
    println!("ok");
}`,
    starter: `fn decode_string(s: &str) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(decode_string("3[a]2[bc]"), "aaabcbc");
    assert_eq!(decode_string("3[a2[c]]"), "accaccacc");
    println!("ok");
}`,
    tags: ['stack', 'string'],
  },
  {
    id: 'ds-ch04-c-009',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Asteroid Collision',
    prompt: `Implement:

    fn asteroid_collision(asteroids: &[i32]) -> Vec<i32>

Each integer represents an asteroid: positive moves right, negative moves left. When a right-moving and left-moving asteroid meet, the smaller one explodes; equal ones both explode. Return the surviving asteroids.
Example: [5,10,-5] -> [5,10], [8,-8] -> []`,
    hints: [
      'Use a stack; push each asteroid unless it collides with the stack top.',
      'A collision only happens when the new asteroid is negative and the top is positive.',
      'Handle equal magnitudes (both explode) and larger magnitudes separately.',
    ],
    solution: `fn asteroid_collision(asteroids: &[i32]) -> Vec<i32> {
    let mut stack: Vec<i32> = Vec::new();
    for &a in asteroids {
        let mut alive = true;
        while alive && a < 0 {
            match stack.last() {
                Some(&top) if top > 0 => {
                    if top < -a {
                        stack.pop();
                    } else if top == -a {
                        stack.pop();
                        alive = false;
                    } else {
                        alive = false;
                    }
                }
                _ => break,
            }
        }
        if alive {
            stack.push(a);
        }
    }
    stack
}

fn main() {
    assert_eq!(asteroid_collision(&[5, 10, -5]), vec![5, 10]);
    assert_eq!(asteroid_collision(&[8, -8]), vec![]);
    assert_eq!(asteroid_collision(&[10, 2, -5]), vec![10]);
    assert_eq!(asteroid_collision(&[-2, -1, 1, 2]), vec![-2, -1, 1, 2]);
    assert_eq!(asteroid_collision(&[1, -2, 3, -4]), vec![-2, -4]);
    println!("ok");
}`,
    starter: `fn asteroid_collision(asteroids: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(asteroid_collision(&[5, 10, -5]), vec![5, 10]);
    assert_eq!(asteroid_collision(&[8, -8]), vec![]);
    println!("ok");
}`,
    tags: ['stack', 'simulation'],
  },
  {
    id: 'ds-ch04-c-010',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Remove Adjacent Duplicates',
    prompt: `Implement:

    fn remove_adjacent_duplicates(s: &str) -> String

Repeatedly remove adjacent identical characters until no adjacent duplicates remain. Return the result.
Example: "abbaca" -> "ca" (remove "bb" -> "aaca", remove "aa" -> "ca")`,
    hints: [
      'Use a stack of characters.',
      'If the top of the stack equals the current character, pop instead of pushing.',
      'Collect the remaining stack into a String.',
    ],
    solution: `fn remove_adjacent_duplicates(s: &str) -> String {
    let mut stack: Vec<char> = Vec::new();
    for c in s.chars() {
        if stack.last() == Some(&c) {
            stack.pop();
        } else {
            stack.push(c);
        }
    }
    stack.into_iter().collect()
}

fn main() {
    assert_eq!(remove_adjacent_duplicates("abbaca"), "ca");
    assert_eq!(remove_adjacent_duplicates("azxxzy"), "ay");
    assert_eq!(remove_adjacent_duplicates("aabbcc"), "");
    assert_eq!(remove_adjacent_duplicates("abc"), "abc");
    assert_eq!(remove_adjacent_duplicates("aabb"), "");
    println!("ok");
}`,
    starter: `fn remove_adjacent_duplicates(s: &str) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(remove_adjacent_duplicates("abbaca"), "ca");
    assert_eq!(remove_adjacent_duplicates("azxxzy"), "ay");
    println!("ok");
}`,
    tags: ['stack', 'string'],
  },
  {
    id: 'ds-ch04-c-011',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest Valid Parentheses',
    prompt: `Implement:

    fn longest_valid_parens(s: &str) -> usize

Given a string of ( and ), return the length of the longest contiguous valid parentheses substring.
Example: "((" -> 0, ")()())" -> 4, "(()(" -> 2`,
    hints: [
      'Use a stack initialized with -1 as a base index sentinel.',
      'Push indices of ( onto the stack; on ) pop and check the length from the new top.',
      'If the stack becomes empty after popping, push the current index as the new base.',
    ],
    solution: `fn longest_valid_parens(s: &str) -> usize {
    let mut stack: Vec<i32> = vec![-1];
    let mut max_len = 0usize;
    for (i, c) in s.chars().enumerate() {
        if c == '(' {
            stack.push(i as i32);
        } else {
            stack.pop();
            if stack.is_empty() {
                stack.push(i as i32);
            } else {
                let len = i as i32 - stack.last().unwrap();
                if len as usize > max_len {
                    max_len = len as usize;
                }
            }
        }
    }
    max_len
}

fn brute_longest(s: &str) -> usize {
    let chars: Vec<char> = s.chars().collect();
    let n = chars.len();
    let mut best = 0;
    for i in 0..n {
        let mut open = 0i32;
        let mut close = 0i32;
        for j in i..n {
            if chars[j] == '(' { open += 1; } else { close += 1; }
            if open == close && (open * 2) as usize > best {
                best = (open * 2) as usize;
            }
            if close > open { break; }
        }
    }
    best
}

fn main() {
    assert_eq!(longest_valid_parens("(()"), 2);
    assert_eq!(longest_valid_parens(")()())"), 4);
    assert_eq!(longest_valid_parens(""), 0);
    let cases = ["(())(", "((()))", ")(", "()()"];
    for c in &cases {
        assert_eq!(longest_valid_parens(c), brute_longest(c), "failed on {}", c);
    }
    println!("ok");
}`,
    starter: `fn longest_valid_parens(s: &str) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_valid_parens("(()"), 2);
    assert_eq!(longest_valid_parens(")()())"), 4);
    println!("ok");
}`,
    tags: ['stack', 'string', 'dynamic-programming'],
  },
  {
    id: 'ds-ch04-c-012',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Simplify Unix Path',
    prompt: `Implement:

    fn simplify_path(path: &str) -> String

Given a Unix absolute path string, simplify it. "." means current directory, ".." means go up one level, and multiple slashes are one slash.
Example: "/home/" -> "/home", "/../" -> "/", "/a/./b/../../c/" -> "/c"`,
    hints: [
      'Split on "/" and process each component.',
      'Skip empty parts and ".", pop for "..", push everything else.',
      'Join with "/" and prepend "/".',
    ],
    solution: `fn simplify_path(path: &str) -> String {
    let mut stack: Vec<&str> = Vec::new();
    for part in path.split('/') {
        match part {
            "" | "." => {}
            ".." => { stack.pop(); }
            name => { stack.push(name); }
        }
    }
    if stack.is_empty() {
        "/".to_string()
    } else {
        "/".to_string() + &stack.join("/")
    }
}

fn main() {
    assert_eq!(simplify_path("/home/"), "/home");
    assert_eq!(simplify_path("/../"), "/");
    assert_eq!(simplify_path("/home//foo/"), "/home/foo");
    assert_eq!(simplify_path("/a/./b/../../c/"), "/c");
    assert_eq!(simplify_path("/"), "/");
    println!("ok");
}`,
    starter: `fn simplify_path(path: &str) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(simplify_path("/home/"), "/home");
    assert_eq!(simplify_path("/../"), "/");
    println!("ok");
}`,
    tags: ['stack', 'string'],
  },
  {
    id: 'ds-ch04-c-013',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Score of Parentheses',
    prompt: `Implement:

    fn score_of_parens(s: &str) -> i32

A balanced string earns a score: "()" scores 1, and concatenation scores A+B, while nesting "(A)" scores 2*A.
Example: "()" -> 1, "(())" -> 2, "()()" -> 2, "(()(()))" -> 6`,
    hints: [
      'Use a stack initialized with 0 to accumulate the running score.',
      'On ( push 0; on ) pop the top, if it is 0 add 1 to the new top, else add 2*top.',
    ],
    solution: `fn score_of_parens(s: &str) -> i32 {
    let mut stack: Vec<i32> = vec![0];
    for c in s.chars() {
        if c == '(' {
            stack.push(0);
        } else {
            let top = stack.pop().unwrap();
            let parent = stack.last_mut().unwrap();
            *parent += if top == 0 { 1 } else { 2 * top };
        }
    }
    stack.pop().unwrap()
}

fn main() {
    assert_eq!(score_of_parens("()"), 1);
    assert_eq!(score_of_parens("(())"), 2);
    assert_eq!(score_of_parens("()()"), 2);
    assert_eq!(score_of_parens("(()(()))"), 6);
    println!("ok");
}`,
    starter: `fn score_of_parens(s: &str) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(score_of_parens("()"), 1);
    assert_eq!(score_of_parens("(())"), 2);
    assert_eq!(score_of_parens("()()"), 2);
    println!("ok");
}`,
    tags: ['stack', 'string'],
  },
  {
    id: 'ds-ch04-c-014',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Remove K Adjacent Duplicates',
    prompt: `Implement:

    fn remove_k_duplicates(s: &str, k: usize) -> String

Repeatedly remove groups of exactly k adjacent identical characters until no such group remains.
Example: k=3, "deeedbbcccbdaa" -> "aa", k=2, "pbbcggttciiippooaais" -> "ps"`,
    hints: [
      'Use a stack of (char, count) tuples.',
      'Increment count when the top char matches; when it reaches k, pop the entry.',
      'Collect remaining entries back to a String.',
    ],
    solution: `fn remove_k_duplicates(s: &str, k: usize) -> String {
    let mut stack: Vec<(char, usize)> = Vec::new();
    for c in s.chars() {
        if let Some(last) = stack.last_mut() {
            if last.0 == c {
                last.1 += 1;
                if last.1 == k {
                    stack.pop();
                }
                continue;
            }
        }
        stack.push((c, 1));
    }
    stack.iter().flat_map(|(ch, cnt)| std::iter::repeat(*ch).take(*cnt)).collect()
}

fn main() {
    assert_eq!(remove_k_duplicates("abcd", 2), "abcd");
    assert_eq!(remove_k_duplicates("deeedbbcccbdaa", 3), "aa");
    assert_eq!(remove_k_duplicates("pbbcggttciiippooaais", 2), "ps");
    assert_eq!(remove_k_duplicates("aabbcc", 2), "");
    println!("ok");
}`,
    starter: `fn remove_k_duplicates(s: &str, k: usize) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(remove_k_duplicates("deeedbbcccbdaa", 3), "aa");
    assert_eq!(remove_k_duplicates("pbbcggttciiippooaais", 2), "ps");
    println!("ok");
}`,
    tags: ['stack', 'string'],
  },
  {
    id: 'ds-ch04-c-015',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Course Schedule via Queue (Topological Sort)',
    prompt: `Implement:

    fn can_finish(num_courses: usize, prereqs: &[(usize, usize)]) -> bool

Each pair (a, b) means course a requires course b first. Return true if all courses can be finished (i.e., no cycle), using a BFS/queue-based topological sort.
Example: num_courses=2, [(1,0)] -> true; [(1,0),(0,1)] -> false`,
    hints: [
      'Build an adjacency list and track in-degrees.',
      'Seed the queue with all nodes of in-degree 0.',
      'After processing, if the count equals num_courses there is no cycle.',
    ],
    solution: `fn can_finish(num_courses: usize, prereqs: &[(usize, usize)]) -> bool {
    let mut graph: Vec<Vec<usize>> = vec![Vec::new(); num_courses];
    let mut in_degree: Vec<usize> = vec![0; num_courses];
    for &(a, b) in prereqs {
        graph[b].push(a);
        in_degree[a] += 1;
    }
    let mut queue: std::collections::VecDeque<usize> = std::collections::VecDeque::new();
    for i in 0..num_courses {
        if in_degree[i] == 0 {
            queue.push_back(i);
        }
    }
    let mut count = 0;
    while let Some(node) = queue.pop_front() {
        count += 1;
        for &next in &graph[node] {
            in_degree[next] -= 1;
            if in_degree[next] == 0 {
                queue.push_back(next);
            }
        }
    }
    count == num_courses
}

fn main() {
    assert!(can_finish(2, &[(1, 0)]));
    assert!(!can_finish(2, &[(1, 0), (0, 1)]));
    assert!(can_finish(4, &[(1, 0), (2, 1), (3, 2)]));
    assert!(!can_finish(3, &[(0, 1), (1, 2), (2, 0)]));
    println!("ok");
}`,
    starter: `fn can_finish(num_courses: usize, prereqs: &[(usize, usize)]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(can_finish(2, &[(1, 0)]));
    assert!(!can_finish(2, &[(1, 0), (0, 1)]));
    println!("ok");
}`,
    tags: ['queue', 'graph', 'topological-sort'],
  },
  {
    id: 'ds-ch04-c-016',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Next Greater Element in Circular Array',
    prompt: `Implement:

    fn next_greater_circular(nums: &[i32]) -> Vec<i32>

For each position find the next greater element, wrapping around the end of the array. If none, use -1.
Example: [1,2,1] -> [2,-1,2], [1,2,3,4,3] -> [2,3,4,-1,4]`,
    hints: [
      'Iterate through the array twice (0..2*n) using index % n.',
      'Use a monotonic stack but only push indices during the first pass.',
    ],
    solution: `fn next_greater_circular(nums: &[i32]) -> Vec<i32> {
    let n = nums.len();
    let mut result = vec![-1i32; n];
    let mut stack: Vec<usize> = Vec::new();
    for i in 0..2 * n {
        let idx = i % n;
        while let Some(&top) = stack.last() {
            if nums[idx] > nums[top] {
                result[top] = nums[idx];
                stack.pop();
            } else {
                break;
            }
        }
        if i < n {
            stack.push(idx);
        }
    }
    result
}

fn brute_circular(nums: &[i32]) -> Vec<i32> {
    let n = nums.len();
    let mut result = vec![-1i32; n];
    for i in 0..n {
        for j in 1..n {
            let idx = (i + j) % n;
            if nums[idx] > nums[i] {
                result[i] = nums[idx];
                break;
            }
        }
    }
    result
}

fn main() {
    let a = vec![1, 2, 1];
    assert_eq!(next_greater_circular(&a), vec![2, -1, 2]);
    let b = vec![1, 2, 3, 4, 3];
    assert_eq!(next_greater_circular(&b), brute_circular(&b));
    let c = vec![5, 4, 3, 2, 1];
    assert_eq!(next_greater_circular(&c), brute_circular(&c));
    println!("ok");
}`,
    starter: `fn next_greater_circular(nums: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let a = vec![1, 2, 1];
    assert_eq!(next_greater_circular(&a), vec![2, -1, 2]);
    println!("ok");
}`,
    tags: ['stack', 'monotonic-stack', 'circular'],
  },
  {
    id: 'ds-ch04-c-017',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Trapping Rain Water via Stack',
    prompt: `Implement:

    fn trap_rain_water(heights: &[i32]) -> i32

Given an elevation map represented by heights, compute how much rain water can be trapped after it rains. Use a stack-based approach.
Example: [0,1,0,2,1,0,1,3,2,1,2,1] -> 6`,
    hints: [
      'Use a stack of indices; maintain a monotonically decreasing sequence.',
      'When a taller bar is found, pop the stack and compute the trapped water in the horizontal slot between the new bar and the new top.',
    ],
    solution: `fn trap_rain_water(heights: &[i32]) -> i32 {
    let mut stack: Vec<usize> = Vec::new();
    let mut water = 0i32;
    for i in 0..heights.len() {
        while let Some(&top) = stack.last() {
            if heights[i] <= heights[top] {
                break;
            }
            stack.pop();
            if let Some(&left) = stack.last() {
                let width = (i - left - 1) as i32;
                let bounded = heights[i].min(heights[left]) - heights[top];
                water += width * bounded;
            }
        }
        stack.push(i);
    }
    water
}

fn brute_trap(heights: &[i32]) -> i32 {
    let n = heights.len();
    let mut water = 0i32;
    for i in 1..n - 1 {
        let left_max = heights[..i].iter().copied().max().unwrap_or(0);
        let right_max = heights[i + 1..].iter().copied().max().unwrap_or(0);
        let level = left_max.min(right_max);
        if level > heights[i] {
            water += level - heights[i];
        }
    }
    water
}

fn main() {
    let h1 = vec![0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    assert_eq!(trap_rain_water(&h1), 6);
    let h2 = vec![4, 2, 0, 3, 2, 5];
    assert_eq!(trap_rain_water(&h2), 9);
    let h3 = vec![3, 0, 2, 0, 4];
    assert_eq!(trap_rain_water(&h3), brute_trap(&h3));
    let h4 = vec![1, 2, 3, 4];
    assert_eq!(trap_rain_water(&h4), brute_trap(&h4));
    println!("ok");
}`,
    starter: `fn trap_rain_water(heights: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let h1 = vec![0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    assert_eq!(trap_rain_water(&h1), 6);
    let h2 = vec![4, 2, 0, 3, 2, 5];
    assert_eq!(trap_rain_water(&h2), 9);
    println!("ok");
}`,
    tags: ['stack', 'array'],
  },
  {
    id: 'ds-ch04-c-018',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Backspace String Compare',
    prompt: `Implement:

    fn backspace_compare(s: &str, t: &str) -> bool

Process both strings where # means a backspace (delete the previous character, if any). Return true if the resulting strings are equal.
Example: "ab#c" and "ad#c" -> true (both become "ac")`,
    hints: [
      'Build the final string for each input by iterating through characters.',
      'Push regular characters onto a stack; on # pop if non-empty.',
    ],
    solution: `fn backspace_compare(s: &str, t: &str) -> bool {
    fn apply(input: &str) -> String {
        let mut stack: Vec<char> = Vec::new();
        for c in input.chars() {
            if c == '#' {
                stack.pop();
            } else {
                stack.push(c);
            }
        }
        stack.into_iter().collect()
    }
    apply(s) == apply(t)
}

fn main() {
    assert!(backspace_compare("ab#c", "ad#c"));
    assert!(backspace_compare("ab##", "c#d#"));
    assert!(!backspace_compare("a#c", "b"));
    assert!(backspace_compare("y#fo##f", "y#f#o##f"));
    println!("ok");
}`,
    starter: `fn backspace_compare(s: &str, t: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(backspace_compare("ab#c", "ad#c"));
    assert!(backspace_compare("ab##", "c#d#"));
    println!("ok");
}`,
    tags: ['stack', 'string', 'simulation'],
  },
  {
    id: 'ds-ch04-c-019',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Exclusive Time of Functions',
    prompt: `Implement:

    fn exclusive_time(n: usize, logs: &[&str]) -> Vec<i32>

n functions are called in a single-threaded CPU. Each log has the form "id:start|end:timestamp". Compute exclusive execution time for each function (nested calls do not count toward the caller).
Example: n=2, ["0:start:0","1:start:2","1:end:5","0:end:6"] -> [3,4]`,
    hints: [
      'Use a stack of (function_id, start_time).',
      'On "start", add elapsed time to the previous function, then push the new one.',
      'On "end", pop the stack, record duration, and update the new top start.',
    ],
    solution: `fn exclusive_time(n: usize, logs: &[&str]) -> Vec<i32> {
    let mut result = vec![0i32; n];
    let mut stack: Vec<(usize, i32)> = Vec::new();
    for &log in logs {
        let parts: Vec<&str> = log.split(':').collect();
        let id: usize = parts[0].parse().unwrap();
        let kind = parts[1];
        let time: i32 = parts[2].parse().unwrap();
        if kind == "start" {
            if let Some(last) = stack.last_mut() {
                result[last.0] += time - last.1;
                last.1 = time;
            }
            stack.push((id, time));
        } else {
            let (fid, start) = stack.pop().unwrap();
            result[fid] += time - start + 1;
            if let Some(last) = stack.last_mut() {
                last.1 = time + 1;
            }
        }
    }
    result
}

fn main() {
    let logs1 = ["0:start:0", "1:start:2", "1:end:5", "0:end:6"];
    assert_eq!(exclusive_time(2, &logs1), vec![3, 4]);
    let logs2 = ["0:start:0", "0:start:2", "0:end:5", "0:start:6", "0:end:6", "0:end:7"];
    assert_eq!(exclusive_time(1, &logs2), vec![8]);
    println!("ok");
}`,
    starter: `fn exclusive_time(n: usize, logs: &[&str]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let logs1 = ["0:start:0", "1:start:2", "1:end:5", "0:end:6"];
    assert_eq!(exclusive_time(2, &logs1), vec![3, 4]);
    println!("ok");
}`,
    tags: ['stack', 'simulation'],
  },
  {
    id: 'ds-ch04-c-020',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Validate Stack Sequences',
    prompt: `Implement:

    fn validate_stack_sequences(pushed: &[i32], popped: &[i32]) -> bool

pushed and popped are permutations of the same values. Return true if the popped sequence could be produced by pushing all of pushed in order and popping at any point.
Example: pushed=[1,2,3,4,5], popped=[4,5,3,2,1] -> true; popped=[4,3,5,1,2] -> false`,
    hints: [
      'Simulate using a stack; push each element and then pop while the top matches the next expected pop.',
      'After all pushes, the stack should be empty for a valid sequence.',
    ],
    solution: `fn validate_stack_sequences(pushed: &[i32], popped: &[i32]) -> bool {
    let mut stack: Vec<i32> = Vec::new();
    let mut pop_idx = 0;
    for &val in pushed {
        stack.push(val);
        while !stack.is_empty() && pop_idx < popped.len() && *stack.last().unwrap() == popped[pop_idx] {
            stack.pop();
            pop_idx += 1;
        }
    }
    stack.is_empty()
}

fn main() {
    assert!(validate_stack_sequences(&[1, 2, 3, 4, 5], &[4, 5, 3, 2, 1]));
    assert!(!validate_stack_sequences(&[1, 2, 3, 4, 5], &[4, 3, 5, 1, 2]));
    assert!(validate_stack_sequences(&[1, 2, 3], &[3, 2, 1]));
    assert!(!validate_stack_sequences(&[1, 2], &[2, 3]));
    println!("ok");
}`,
    starter: `fn validate_stack_sequences(pushed: &[i32], popped: &[i32]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(validate_stack_sequences(&[1, 2, 3, 4, 5], &[4, 5, 3, 2, 1]));
    assert!(!validate_stack_sequences(&[1, 2, 3, 4, 5], &[4, 3, 5, 1, 2]));
    println!("ok");
}`,
    tags: ['stack', 'simulation'],
  },
  {
    id: 'ds-ch04-c-021',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Largest Rectangle in Histogram',
    prompt: `Implement:

    fn largest_rectangle(heights: &[i32]) -> i32

Given bar heights, find the largest rectangle that can be formed using contiguous bars. The width of each bar is 1.
Example: [2,1,5,6,2,3] -> 10 (bars at indices 2 and 3 with height 5 give 2*5=10)`,
    hints: [
      'Use a monotonic increasing stack of indices.',
      'When a shorter bar is encountered, pop and compute the rectangle using the popped bar as the limiting height.',
      'Append a sentinel 0 height at the end to flush remaining bars.',
    ],
    solution: `fn largest_rectangle(heights: &[i32]) -> i32 {
    let mut stack: Vec<usize> = Vec::new();
    let mut max_area = 0i32;
    let n = heights.len();
    let mut i = 0;
    while i <= n {
        let h = if i == n { 0 } else { heights[i] };
        while let Some(&top) = stack.last() {
            if h < heights[top] {
                stack.pop();
                let width = if stack.is_empty() {
                    i as i32
                } else {
                    (i - stack.last().unwrap() - 1) as i32
                };
                let area = heights[top] * width;
                if area > max_area {
                    max_area = area;
                }
            } else {
                break;
            }
        }
        stack.push(i);
        i += 1;
    }
    max_area
}

fn brute_rect(heights: &[i32]) -> i32 {
    let n = heights.len();
    let mut best = 0i32;
    for i in 0..n {
        let mut min_h = heights[i];
        for j in i..n {
            if heights[j] < min_h { min_h = heights[j]; }
            let area = min_h * (j - i + 1) as i32;
            if area > best { best = area; }
        }
    }
    best
}

fn main() {
    let h1 = vec![2, 1, 5, 6, 2, 3];
    assert_eq!(largest_rectangle(&h1), 10);
    let h2 = vec![2, 4];
    assert_eq!(largest_rectangle(&h2), 4);
    let cases: Vec<Vec<i32>> = vec![
        vec![1, 2, 3, 4, 5],
        vec![5, 4, 3, 2, 1],
        vec![2, 2, 2, 2],
        vec![1],
    ];
    for c in &cases {
        assert_eq!(largest_rectangle(c), brute_rect(c));
    }
    println!("ok");
}`,
    starter: `fn largest_rectangle(heights: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let h1 = vec![2, 1, 5, 6, 2, 3];
    assert_eq!(largest_rectangle(&h1), 10);
    let h2 = vec![2, 4];
    assert_eq!(largest_rectangle(&h2), 4);
    println!("ok");
}`,
    tags: ['stack', 'monotonic-stack', 'array'],
  },
  {
    id: 'ds-ch04-c-022',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sliding Window Maximum via Deque',
    prompt: `Implement:

    fn sliding_window_max(nums: &[i32], k: usize) -> Vec<i32>

Return the maximum value in each window of size k as it slides over nums.
Example: nums=[1,3,-1,-3,5,3,6,7], k=3 -> [3,3,5,5,6,7]`,
    hints: [
      'Use a VecDeque as a monotonic decreasing deque of indices.',
      'Remove indices from the front that are out of the window.',
      'Remove indices from the back whose values are less than or equal to the current value.',
    ],
    solution: `use std::collections::VecDeque;

fn sliding_window_max(nums: &[i32], k: usize) -> Vec<i32> {
    let mut deque: VecDeque<usize> = VecDeque::new();
    let mut result: Vec<i32> = Vec::new();
    for i in 0..nums.len() {
        while deque.front().map_or(false, |&f| f + k <= i) {
            deque.pop_front();
        }
        while deque.back().map_or(false, |&b| nums[b] <= nums[i]) {
            deque.pop_back();
        }
        deque.push_back(i);
        if i + 1 >= k {
            result.push(nums[*deque.front().unwrap()]);
        }
    }
    result
}

fn brute_window(nums: &[i32], k: usize) -> Vec<i32> {
    nums.windows(k).map(|w| *w.iter().max().unwrap()).collect()
}

fn main() {
    let n1 = vec![1, 3, -1, -3, 5, 3, 6, 7];
    assert_eq!(sliding_window_max(&n1, 3), vec![3, 3, 5, 5, 6, 7]);
    let n2 = vec![1];
    assert_eq!(sliding_window_max(&n2, 1), vec![1]);
    let cases = vec![
        (vec![2, 1, 5, 3, 4], 2usize),
        (vec![4, 3, 2, 1], 2),
        (vec![1, 2, 3, 4, 5], 3),
    ];
    for (nums, k) in &cases {
        assert_eq!(sliding_window_max(nums, *k), brute_window(nums, *k));
    }
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn sliding_window_max(nums: &[i32], k: usize) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let n1 = vec![1, 3, -1, -3, 5, 3, 6, 7];
    assert_eq!(sliding_window_max(&n1, 3), vec![3, 3, 5, 5, 6, 7]);
    println!("ok");
}`,
    tags: ['deque', 'sliding-window', 'monotonic-deque'],
  },
  {
    id: 'ds-ch04-c-023',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Basic Calculator with Parentheses',
    prompt: `Implement:

    fn calculate(s: &str) -> i32

Evaluate a string expression containing non-negative integers, +, -, and parentheses. Spaces may appear anywhere.
Example: "1 + 1" -> 2, " 2-1 + 2 " -> 3, "(1+(4+5+2)-3)+(6+8)" -> 23`,
    hints: [
      'Track a running result, current number, and a sign multiplier.',
      'On ( push the current result and sign onto the stack, reset both.',
      'On ) pop sign and result, combine with the inner result.',
    ],
    solution: `fn calculate(s: &str) -> i32 {
    let mut stack: Vec<i32> = Vec::new();
    let mut result = 0i32;
    let mut sign = 1i32;
    let mut num = 0i32;
    for c in s.chars() {
        if c.is_ascii_digit() {
            num = num * 10 + (c as i32 - '0' as i32);
        } else if c == '+' {
            result += sign * num;
            num = 0;
            sign = 1;
        } else if c == '-' {
            result += sign * num;
            num = 0;
            sign = -1;
        } else if c == '(' {
            stack.push(result);
            stack.push(sign);
            result = 0;
            sign = 1;
        } else if c == ')' {
            result += sign * num;
            num = 0;
            let outer_sign = stack.pop().unwrap();
            let outer_result = stack.pop().unwrap();
            result = outer_result + outer_sign * result;
        }
    }
    result += sign * num;
    result
}

fn main() {
    assert_eq!(calculate("1 + 1"), 2);
    assert_eq!(calculate(" 2-1 + 2 "), 3);
    assert_eq!(calculate("(1+(4+5+2)-3)+(6+8)"), 23);
    assert_eq!(calculate("-(3+(4-2))"), -5);
    println!("ok");
}`,
    starter: `fn calculate(s: &str) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(calculate("1 + 1"), 2);
    assert_eq!(calculate(" 2-1 + 2 "), 3);
    println!("ok");
}`,
    tags: ['stack', 'math', 'string'],
  },
  {
    id: 'ds-ch04-c-024',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Insertions to Make Parentheses Valid',
    prompt: `Implement:

    fn min_add_to_make_valid(s: &str) -> i32

Given a string of ( and ), return the minimum number of characters to insert to make it valid.
Example: "())" -> 1 (add one opening), "(((" -> 3 (add three closings)`,
    hints: [
      'Track unmatched open count and unmatched close count.',
      'On ( increment open; on ) decrement open if positive, else increment close.',
      'Return open + close.',
    ],
    solution: `fn min_add_to_make_valid(s: &str) -> i32 {
    let mut open = 0i32;
    let mut close = 0i32;
    for c in s.chars() {
        if c == '(' {
            open += 1;
        } else if open > 0 {
            open -= 1;
        } else {
            close += 1;
        }
    }
    open + close
}

fn main() {
    assert_eq!(min_add_to_make_valid("())"), 1);
    assert_eq!(min_add_to_make_valid("((("), 3);
    assert_eq!(min_add_to_make_valid(""), 0);
    assert_eq!(min_add_to_make_valid("()"), 0);
    assert_eq!(min_add_to_make_valid("))(("), 4);
    println!("ok");
}`,
    starter: `fn min_add_to_make_valid(s: &str) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_add_to_make_valid("())"), 1);
    assert_eq!(min_add_to_make_valid("((("), 3);
    println!("ok");
}`,
    tags: ['stack', 'greedy', 'string'],
  },
  {
    id: 'ds-ch04-c-025',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum Chunks to Sort Array',
    prompt: `Implement:

    fn max_chunks_to_sorted(arr: &[i32]) -> usize

Split arr into the maximum number of non-empty chunks so that sorting each chunk individually and concatenating results in the fully sorted array.
Example: [4,3,2,1,0] -> 1, [1,0,2,3,4] -> 4`,
    hints: [
      'Use a monotonic stack of chunk maximums.',
      'When the current value is smaller than the stack top, merge chunks by popping until the top is less than or equal to the current value.',
      'Push the running maximum of the merged chunk.',
    ],
    solution: `fn max_chunks_to_sorted(arr: &[i32]) -> usize {
    let mut stack: Vec<i32> = Vec::new();
    for &val in arr {
        let cur_max = if stack.is_empty() { val } else { *stack.last().unwrap().max(&val) };
        while stack.last().map_or(false, |&top| top > val) {
            stack.pop();
        }
        stack.push(cur_max);
    }
    stack.len()
}

fn brute_chunks(arr: &[i32]) -> usize {
    let n = arr.len();
    let mut count = 0;
    let mut max_so_far = i32::MIN;
    let mut sorted = arr.to_vec();
    sorted.sort();
    for i in 0..n {
        if arr[i] > max_so_far { max_so_far = arr[i]; }
        if max_so_far == sorted[i] {
            count += 1;
        }
    }
    count
}

fn main() {
    assert_eq!(max_chunks_to_sorted(&[4, 3, 2, 1, 0]), 1);
    assert_eq!(max_chunks_to_sorted(&[1, 0, 2, 3, 4]), 4);
    let cases: Vec<Vec<i32>> = vec![
        vec![0, 1, 2, 3, 4],
        vec![2, 0, 1, 3],
        vec![1, 2, 0, 3],
    ];
    for c in &cases {
        assert_eq!(max_chunks_to_sorted(c), brute_chunks(c));
    }
    println!("ok");
}`,
    starter: `fn max_chunks_to_sorted(arr: &[i32]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_chunks_to_sorted(&[4, 3, 2, 1, 0]), 1);
    assert_eq!(max_chunks_to_sorted(&[1, 0, 2, 3, 4]), 4);
    println!("ok");
}`,
    tags: ['stack', 'monotonic-stack', 'array'],
  },
  {
    id: 'ds-ch04-c-026',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Monotonic Deque Operations',
    prompt: `Implement a struct MonoDeque that maintains a monotonically decreasing deque for maximum queries:
  fn new() -> Self
  fn push_back_max(&mut self, val: i32)   (insert while removing smaller back elements)
  fn pop_front_if(&mut self, val: i32)    (remove front only if it equals val)
  fn max(&self) -> i32                    (return current maximum)

Also implement fn max_in_deque_of_k(nums: &[i32], k: usize) -> i32 that returns the maximum of the first k elements using MonoDeque.
Example: max_in_deque_of_k([1,3,-1,-3,5,3,6,7], 3) -> 3`,
    hints: [
      'Store values (not indices) in the deque; remove from the back any value strictly less than the incoming.',
      'The front always holds the running maximum.',
      'pop_front_if removes only when the front matches, guarding against double-removes.',
    ],
    solution: `use std::collections::VecDeque;

fn max_in_deque_of_k(nums: &[i32], k: usize) -> i32 {
    let mut deque: VecDeque<i32> = VecDeque::new();
    for &val in &nums[..k] {
        while deque.back().map_or(false, |&b| b < val) {
            deque.pop_back();
        }
        deque.push_back(val);
    }
    *deque.front().unwrap()
}

struct MonoDeque {
    dq: VecDeque<i32>,
}

impl MonoDeque {
    fn new() -> Self {
        MonoDeque { dq: VecDeque::new() }
    }

    fn push_back_max(&mut self, val: i32) {
        while self.dq.back().map_or(false, |&b| b < val) {
            self.dq.pop_back();
        }
        self.dq.push_back(val);
    }

    fn pop_front_if(&mut self, val: i32) {
        if self.dq.front() == Some(&val) {
            self.dq.pop_front();
        }
    }

    fn max(&self) -> i32 {
        *self.dq.front().unwrap()
    }
}

fn main() {
    assert_eq!(max_in_deque_of_k(&[1, 3, -1, -3, 5, 3, 6, 7], 3), 3);
    let mut md = MonoDeque::new();
    let data = vec![5, 3, 1, 4, 2];
    for &v in &data {
        md.push_back_max(v);
    }
    assert_eq!(md.max(), 5);
    md.pop_front_if(5);
    assert_eq!(md.max(), 4);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn max_in_deque_of_k(nums: &[i32], k: usize) -> i32 {
    // TODO
    todo!()
}

struct MonoDeque {
    // TODO: add fields
}

impl MonoDeque {
    fn new() -> Self { todo!() }
    fn push_back_max(&mut self, val: i32) { todo!() }
    fn pop_front_if(&mut self, val: i32) { todo!() }
    fn max(&self) -> i32 { todo!() }
}

fn main() {
    assert_eq!(max_in_deque_of_k(&[1, 3, -1, -3, 5, 3, 6, 7], 3), 3);
    println!("ok");
}`,
    tags: ['deque', 'monotonic-deque', 'design'],
  },
  {
    id: 'ds-ch04-c-027',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximal Rectangle in Binary Matrix',
    prompt: `Implement:

    fn largest_rect_in_grid(matrix: &[Vec<i32>]) -> i32

Given a binary matrix (values 0 or 1), find the largest rectangle containing only 1s and return its area.
Example: a 4x5 matrix -> 6`,
    hints: [
      'Build a running histogram of consecutive 1s column by column for each row.',
      'Apply the largest rectangle in histogram algorithm on each row histogram.',
      'Reset column height to 0 when a 0 is encountered.',
    ],
    solution: `fn largest_rect_in_grid(matrix: &[Vec<i32>]) -> i32 {
    if matrix.is_empty() { return 0; }
    let cols = matrix[0].len();
    let mut heights = vec![0i32; cols];
    let mut best = 0i32;

    fn hist_max(heights: &[i32]) -> i32 {
        let mut stack: Vec<usize> = Vec::new();
        let mut max_a = 0i32;
        let n = heights.len();
        let mut i = 0;
        while i <= n {
            let h = if i == n { 0 } else { heights[i] };
            while let Some(&top) = stack.last() {
                if h < heights[top] {
                    stack.pop();
                    let w = if stack.is_empty() { i as i32 } else { (i - stack.last().unwrap() - 1) as i32 };
                    let a = heights[top] * w;
                    if a > max_a { max_a = a; }
                } else { break; }
            }
            stack.push(i);
            i += 1;
        }
        max_a
    }

    for row in matrix {
        for j in 0..cols {
            if row[j] == 0 {
                heights[j] = 0;
            } else {
                heights[j] += row[j];
            }
        }
        let area = hist_max(&heights);
        if area > best { best = area; }
    }
    best
}

fn main() {
    let m1 = vec![
        vec![1, 0, 1, 0, 0],
        vec![1, 0, 1, 1, 1],
        vec![1, 1, 1, 1, 1],
        vec![1, 0, 0, 1, 0],
    ];
    assert_eq!(largest_rect_in_grid(&m1), 6);
    let m2 = vec![vec![0]];
    assert_eq!(largest_rect_in_grid(&m2), 0);
    let m3 = vec![vec![1]];
    assert_eq!(largest_rect_in_grid(&m3), 1);
    println!("ok");
}`,
    starter: `fn largest_rect_in_grid(matrix: &[Vec<i32>]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let m1 = vec![
        vec![1, 0, 1, 0, 0],
        vec![1, 0, 1, 1, 1],
        vec![1, 1, 1, 1, 1],
        vec![1, 0, 0, 1, 0],
    ];
    assert_eq!(largest_rect_in_grid(&m1), 6);
    println!("ok");
}`,
    tags: ['stack', 'monotonic-stack', 'matrix'],
  },
  {
    id: 'ds-ch04-c-028',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Number of Visible People in a Row',
    prompt: `Implement:

    fn num_visible_people_in_row(heights: &[i32]) -> Vec<i32>

People stand in a line. Person i can see person j (j > i) if all people between them are shorter than both. Return, for each person, how many others they can see to their right.
Example: [10,6,8,5,11,9] -> [3,1,2,1,1,0]`,
    hints: [
      'Iterate from right to left with a monotonic decreasing stack.',
      'For each person, count how many shorter people are popped before hitting a taller one.',
      'If there is still someone left on the stack after popping, they are also visible (but block further view).',
    ],
    solution: `fn num_visible_people_in_row(heights: &[i32]) -> Vec<i32> {
    let n = heights.len();
    let mut result = vec![0i32; n];
    let mut stack: Vec<i32> = Vec::new();
    for i in (0..n).rev() {
        let mut count = 0;
        while stack.last().map_or(false, |&top| top < heights[i]) {
            stack.pop();
            count += 1;
        }
        if !stack.is_empty() { count += 1; }
        result[i] = count;
        stack.push(heights[i]);
    }
    result
}

fn main() {
    assert_eq!(num_visible_people_in_row(&[10, 6, 8, 5, 11, 9]), vec![3, 1, 2, 1, 1, 0]);
    assert_eq!(num_visible_people_in_row(&[5, 1, 2, 3, 10]), vec![4, 1, 1, 1, 0]);
    println!("ok");
}`,
    starter: `fn num_visible_people_in_row(heights: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(num_visible_people_in_row(&[10, 6, 8, 5, 11, 9]), vec![3, 1, 2, 1, 1, 0]);
    println!("ok");
}`,
    tags: ['stack', 'monotonic-stack'],
  },
  {
    id: 'ds-ch04-c-029',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Task Scheduler Minimum Intervals',
    prompt: `Implement:

    fn task_scheduler(tasks: &[char], n: usize) -> usize

CPU must execute all tasks. Same tasks must be separated by at least n intervals (idle slots count). Return minimum total intervals.
Example: tasks=[A,A,A,B,B,B], n=2 -> 8`,
    hints: [
      'Count task frequencies; find the maximum frequency max_freq.',
      'Count how many tasks share that maximum frequency (max_count).',
      'Result is max((max_freq-1)*(n+1)+max_count, tasks.len()).',
    ],
    solution: `fn task_scheduler(tasks: &[char], n: usize) -> usize {
    let mut freq = [0usize; 26];
    for &t in tasks {
        freq[(t as u8 - b'A') as usize] += 1;
    }
    let max_freq = *freq.iter().max().unwrap();
    let max_count = freq.iter().filter(|&&f| f == max_freq).count();
    let result = (max_freq - 1) * (n + 1) + max_count;
    result.max(tasks.len())
}

fn main() {
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
    assert_eq!(task_scheduler(&['A', 'C', 'A', 'B', 'D', 'B'], 1), 6);
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'B', 'B', 'B'], 0), 6);
    assert_eq!(task_scheduler(&['A'], 10), 1);
    println!("ok");
}`,
    starter: `fn task_scheduler(tasks: &[char], n: usize) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
    assert_eq!(task_scheduler(&['A', 'C', 'A', 'B', 'D', 'B'], 1), 6);
    println!("ok");
}`,
    tags: ['queue', 'greedy', 'hash-map'],
  },
  {
    id: 'ds-ch04-c-030',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Shortest Subarray with Sum at Least K',
    prompt: `Implement:

    fn shortest_subarray_with_sum_at_least_k(nums: &[i32], k: i32) -> i32

Find the length of the shortest contiguous subarray whose sum is at least k. Values may be negative. Return -1 if no such subarray exists.
Example: [2,-1,2], k=3 -> 3`,
    hints: [
      'Build a prefix sum array; then find i < j such that prefix[j]-prefix[i] >= k and j-i is minimized.',
      'Use a monotonic increasing deque of prefix-sum indices.',
      'Advance from the front while the condition holds; maintain the deque from the back.',
    ],
    solution: `use std::collections::VecDeque;

fn shortest_subarray_with_sum_at_least_k(nums: &[i32], k: i32) -> i32 {
    let n = nums.len();
    let mut prefix = vec![0i64; n + 1];
    for i in 0..n {
        prefix[i + 1] = prefix[i] + nums[i] as i64;
    }
    let mut deque: VecDeque<usize> = VecDeque::new();
    let mut best = i32::MAX;
    for i in 0..=n {
        while deque.front().map_or(false, |&f| prefix[i] - prefix[f] >= k as i64) {
            let len = (i - deque.pop_front().unwrap()) as i32;
            if len < best { best = len; }
        }
        while deque.back().map_or(false, |&b| prefix[b] >= prefix[i]) {
            deque.pop_back();
        }
        deque.push_back(i);
    }
    if best == i32::MAX { -1 } else { best }
}

fn brute_shortest(nums: &[i32], k: i32) -> i32 {
    let n = nums.len();
    let mut best = i32::MAX;
    for i in 0..n {
        let mut sum = 0i64;
        for j in i..n {
            sum += nums[j] as i64;
            if sum >= k as i64 {
                let len = (j - i + 1) as i32;
                if len < best { best = len; }
                break;
            }
        }
    }
    if best == i32::MAX { -1 } else { best }
}

fn main() {
    assert_eq!(shortest_subarray_with_sum_at_least_k(&[1], 1), 1);
    assert_eq!(shortest_subarray_with_sum_at_least_k(&[1, 2], 4), -1);
    assert_eq!(shortest_subarray_with_sum_at_least_k(&[2, -1, 2], 3), 3);
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![1, 2, 3, 4, 5], 11),
        (vec![3, -2, 5], 4),
        (vec![1, 1, 1, 1, 1], 3),
    ];
    for (nums, k) in &cases {
        assert_eq!(shortest_subarray_with_sum_at_least_k(nums, *k), brute_shortest(nums, *k));
    }
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn shortest_subarray_with_sum_at_least_k(nums: &[i32], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(shortest_subarray_with_sum_at_least_k(&[1], 1), 1);
    assert_eq!(shortest_subarray_with_sum_at_least_k(&[2, -1, 2], 3), 3);
    println!("ok");
}`,
    tags: ['deque', 'prefix-sum', 'sliding-window'],
  },
]

export default problems
