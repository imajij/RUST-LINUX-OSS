import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch16-c-001',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Import the Kernel Prelude',
    prompt: `Every Rust-for-Linux module starts by pulling in the kernel crate's prelude, which re-exports the common types and macros (such as Module, Result, and pr_info!).

Write the single use statement that brings the kernel prelude into scope. Use a glob import so all prelude items are available.`,
    hints: [
      'The kernel crate is named kernel.',
      'A glob import ends with ::*.',
    ],
    solution: `use kernel::prelude::*;`,
    starter: `// TODO: bring the kernel prelude into scope
`,
    tags: ['rust-for-linux', 'prelude'],
  },
  {
    id: 'lx-ch16-c-002',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print an Info Message',
    prompt: `The kernel crate provides pr_info! for printing at the KERN_INFO log level, mirroring the C pr_info() helper.

Inside the body below, write one statement that prints the message: Hello from Rust. The macro works like println! but its output goes to the kernel log.`,
    hints: [
      'pr_info! takes a format string just like println!.',
      'A plain literal string needs no format arguments.',
    ],
    solution: `use kernel::prelude::*;

fn say_hello() {
    pr_info!("Hello from Rust\\n");
}`,
    starter: `use kernel::prelude::*;

fn say_hello() {
    // TODO: print "Hello from Rust" at the info level
}`,
    tags: ['rust-for-linux', 'pr_info', 'logging'],
  },
  {
    id: 'lx-ch16-c-003',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print a Formatted Value',
    prompt: `pr_info! supports the same format syntax as Rust's standard formatting macros.

Write a function log_count(n: i32) that prints a line of the form: count = N, where N is the value of the parameter n. Remember the kernel log line should end with a newline.`,
    hints: [
      'Use a brace pair as the placeholder and pass n as the argument.',
      'End the format string with a newline escape.',
    ],
    solution: `use kernel::prelude::*;

fn log_count(n: i32) {
    pr_info!("count = {}\\n", n);
}`,
    starter: `use kernel::prelude::*;

fn log_count(n: i32) {
    // TODO: print "count = N" using the parameter
}`,
    tags: ['rust-for-linux', 'pr_info', 'formatting'],
  },
  {
    id: 'lx-ch16-c-004',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return EINVAL',
    prompt: `Kernel error codes are exposed in the kernel crate's code module (for example code::EINVAL). In Rust for Linux a fallible function returns Result, where the error variant carries a kernel Error.

Write a function reject() -> Result that always fails with the invalid-argument error EINVAL. Return it with Err.`,
    hints: [
      'The prelude makes Result available; its error type is the kernel Error.',
      'EINVAL lives in the code module: code::EINVAL.',
    ],
    solution: `use kernel::prelude::*;

fn reject() -> Result {
    Err(code::EINVAL)
}`,
    starter: `use kernel::prelude::*;

fn reject() -> Result {
    // TODO: fail with EINVAL
}`,
    tags: ['rust-for-linux', 'result', 'error'],
  },
  {
    id: 'lx-ch16-c-005',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return Success',
    prompt: `A Result with no payload uses the unit type for its success value, so the successful return is Ok with a unit value.

Write a function always_ok() -> Result that succeeds, returning the unit success value.`,
    hints: [
      'Result here is shorthand for Result<()>.',
      'The unit value is written as a pair of empty parentheses.',
    ],
    solution: `use kernel::prelude::*;

fn always_ok() -> Result {
    Ok(())
}`,
    starter: `use kernel::prelude::*;

fn always_ok() -> Result {
    // TODO: return the successful unit value
}`,
    tags: ['rust-for-linux', 'result'],
  },
  {
    id: 'lx-ch16-c-006',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return ENOMEM',
    prompt: `Out-of-memory conditions in the kernel are reported with ENOMEM. In Rust for Linux it is available as code::ENOMEM.

Write a function out_of_memory() -> Result that always fails with the out-of-memory error.`,
    hints: [
      'Use code::ENOMEM as the error value.',
      'Wrap the error in Err.',
    ],
    solution: `use kernel::prelude::*;

fn out_of_memory() -> Result {
    Err(code::ENOMEM)
}`,
    starter: `use kernel::prelude::*;

fn out_of_memory() -> Result {
    // TODO: fail with ENOMEM
}`,
    tags: ['rust-for-linux', 'result', 'error'],
  },
  {
    id: 'lx-ch16-c-007',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Minimal Module Struct',
    prompt: `A Rust kernel module is represented by a type that implements the Module trait. The type itself can be an empty struct that holds the module's state; for a do-nothing module it has no fields.

Declare an empty unit-like struct named RustMinimal that will serve as the module type.`,
    hints: [
      'A unit struct has no fields and ends with a semicolon.',
      'The name is RustMinimal.',
    ],
    solution: `use kernel::prelude::*;

struct RustMinimal;`,
    starter: `use kernel::prelude::*;

// TODO: declare the module struct RustMinimal
`,
    tags: ['rust-for-linux', 'module'],
  },
  {
    id: 'lx-ch16-c-008',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Inside Init',
    prompt: `When a module loads, the kernel calls its init function. A typical init logs that the module has started.

Write a function init_body() that prints the line: rust_minimal: loaded. This is the kind of statement you would place inside a module's init.`,
    hints: [
      'Use pr_info! with a literal string.',
      'Finish the line with a newline escape.',
    ],
    solution: `use kernel::prelude::*;

fn init_body() {
    pr_info!("rust_minimal: loaded\\n");
}`,
    starter: `use kernel::prelude::*;

fn init_body() {
    // TODO: print "rust_minimal: loaded"
}`,
    tags: ['rust-for-linux', 'pr_info', 'module'],
  },
  {
    id: 'lx-ch16-c-009',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Propagate an Error With the Question Mark',
    prompt: `The ? operator works on kernel Result values: on Ok it unwraps the inner value, and on Err it returns early with that error.

Write a function chain() -> Result that calls a helper try_step() (assume it is declared as fn try_step() -> Result), propagating any error with ?, and then returns success.`,
    hints: [
      'Apply ? to the call to try_step().',
      'After a successful step, return Ok with the unit value.',
    ],
    solution: `use kernel::prelude::*;

fn chain() -> Result {
    try_step()?;
    Ok(())
}`,
    starter: `use kernel::prelude::*;

fn chain() -> Result {
    // TODO: call try_step(), propagating errors, then succeed
}`,
    tags: ['rust-for-linux', 'result', 'error'],
  },
  {
    id: 'lx-ch16-c-010',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print an Error Message',
    prompt: `pr_err! prints at the KERN_ERR log level and is the counterpart to C's pr_err().

Write a function report_failure() that prints the error line: rust_demo: init failed.`,
    hints: [
      'pr_err! has the same signature shape as pr_info!.',
      'End the line with a newline escape.',
    ],
    solution: `use kernel::prelude::*;

fn report_failure() {
    pr_err!("rust_demo: init failed\\n");
}`,
    starter: `use kernel::prelude::*;

fn report_failure() {
    // TODO: print an error-level message
}`,
    tags: ['rust-for-linux', 'pr_err', 'logging'],
  },
  {
    id: 'lx-ch16-c-011',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Validate an Argument',
    prompt: `A common pattern is to reject bad input by returning EINVAL.

Write a function check_positive(n: i32) -> Result that returns Ok with the unit value when n is greater than zero, and otherwise fails with EINVAL.`,
    hints: [
      'Use an if to test n.',
      'Return Err(code::EINVAL) when the test fails.',
    ],
    solution: `use kernel::prelude::*;

fn check_positive(n: i32) -> Result {
    if n > 0 {
        Ok(())
    } else {
        Err(code::EINVAL)
    }
}`,
    starter: `use kernel::prelude::*;

fn check_positive(n: i32) -> Result {
    // TODO: succeed for n > 0, else return EINVAL
}`,
    tags: ['rust-for-linux', 'result', 'error'],
  },
  {
    id: 'lx-ch16-c-012',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print at the Debug Level',
    prompt: `pr_debug! emits a message at the KERN_DEBUG level, used for verbose diagnostics.

Write a function trace_entry() that prints: entering critical section, at the debug level.`,
    hints: [
      'Use pr_debug! exactly like pr_info!.',
      'Include a trailing newline.',
    ],
    solution: `use kernel::prelude::*;

fn trace_entry() {
    pr_debug!("entering critical section\\n");
}`,
    starter: `use kernel::prelude::*;

fn trace_entry() {
    // TODO: print a debug-level message
}`,
    tags: ['rust-for-linux', 'pr_debug', 'logging'],
  },
  {
    id: 'lx-ch16-c-013',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Implement the Module Trait',
    prompt: `The Module trait requires an init associated function with the signature fn init(module: &'static ThisModule) -> Result<Self>. It runs when the module is loaded and returns the module's state instance.

Given the struct RustMinimal, implement Module for it. In init, print rust_minimal: init, then return Ok with a RustMinimal value.`,
    hints: [
      'Write impl kernel::Module for RustMinimal with the init function.',
      'init returns Result<Self>, so wrap RustMinimal in Ok.',
      'Name the parameter _module since it is unused.',
    ],
    solution: `use kernel::prelude::*;

struct RustMinimal;

impl kernel::Module for RustMinimal {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("rust_minimal: init\\n");
        Ok(RustMinimal)
    }
}`,
    starter: `use kernel::prelude::*;

struct RustMinimal;

impl kernel::Module for RustMinimal {
    // TODO: implement init: print, then return Ok(RustMinimal)
}`,
    tags: ['rust-for-linux', 'module', 'init'],
  },
  {
    id: 'lx-ch16-c-014',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Register the Module With the Macro',
    prompt: `The module! macro generates the registration glue (module metadata and the loader entry points) for a type that implements Module.

Given the type RustMinimal, write a module! invocation that sets type to RustMinimal, name to "rust_minimal", author to "Rust for Linux", description to "A minimal Rust module", and license to "GPL".`,
    hints: [
      'module! takes a comma-separated list of key: value pairs.',
      'The type field names the Module-implementing struct; the rest are string literals.',
    ],
    solution: `use kernel::prelude::*;

struct RustMinimal;

module! {
    type: RustMinimal,
    name: "rust_minimal",
    author: "Rust for Linux",
    description: "A minimal Rust module",
    license: "GPL",
}`,
    starter: `use kernel::prelude::*;

struct RustMinimal;

// TODO: register RustMinimal with the module! macro
`,
    tags: ['rust-for-linux', 'module', 'macro'],
  },
  {
    id: 'lx-ch16-c-015',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Complete Minimal Module',
    prompt: `Put the pieces together into one self-contained Rust kernel module.

Declare the struct RustHello, implement Module for it so init prints hello world and returns Ok(RustHello), and register it with module! using name "rust_hello", author "RFL", description "Hello world module", and license "GPL".`,
    hints: [
      'You need three parts: the struct, the impl, and the module! invocation.',
      'init returns Result<Self>.',
      'License "GPL" is required for the module to load cleanly.',
    ],
    solution: `use kernel::prelude::*;

struct RustHello;

impl kernel::Module for RustHello {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("hello world\\n");
        Ok(RustHello)
    }
}

module! {
    type: RustHello,
    name: "rust_hello",
    author: "RFL",
    description: "Hello world module",
    license: "GPL",
}`,
    starter: `use kernel::prelude::*;

struct RustHello;

// TODO: impl Module for RustHello, then register with module!
`,
    tags: ['rust-for-linux', 'module', 'macro'],
  },
  {
    id: 'lx-ch16-c-016',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Store State in the Module Struct',
    prompt: `The value returned from init is kept alive for the module's lifetime, so the module struct can hold state.

Declare a struct Counter with one field count of type u32. Implement Module so init prints starting counter and returns a Counter whose count is 0.`,
    hints: [
      'Give Counter a named field count: u32.',
      'Construct it with Counter { count: 0 } inside Ok.',
    ],
    solution: `use kernel::prelude::*;

struct Counter {
    count: u32,
}

impl kernel::Module for Counter {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("starting counter\\n");
        Ok(Counter { count: 0 })
    }
}`,
    starter: `use kernel::prelude::*;

struct Counter {
    count: u32,
}

impl kernel::Module for Counter {
    // TODO: print, then return a Counter with count 0
}`,
    tags: ['rust-for-linux', 'module', 'state'],
  },
  {
    id: 'lx-ch16-c-017',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fail Init With an Error',
    prompt: `If a module's init returns Err, the module fails to load and the error propagates to user space.

Implement Module for a struct BrokenModule whose init prints cannot initialize at the error level and then returns the ENOMEM error.`,
    hints: [
      'Use pr_err! for the message.',
      'Return Err(code::ENOMEM); the function returns Result<Self>.',
    ],
    solution: `use kernel::prelude::*;

struct BrokenModule;

impl kernel::Module for BrokenModule {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_err!("cannot initialize\\n");
        Err(code::ENOMEM)
    }
}`,
    starter: `use kernel::prelude::*;

struct BrokenModule;

impl kernel::Module for BrokenModule {
    // TODO: print an error and return ENOMEM
}`,
    tags: ['rust-for-linux', 'module', 'error'],
  },
  {
    id: 'lx-ch16-c-018',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate Then Build State',
    prompt: `Combine argument validation with state construction in init.

Implement Module for a struct Limiter holding a field max of type u32. In init, call a helper read_max() (assume fn read_max() -> Result<u32>) using ? to get the value, print the chosen limit, and return a Limiter with that max.`,
    hints: [
      'Bind the result of read_max()? to a local variable.',
      'Use the placeholder form of pr_info! to log the value.',
      'Build the struct from the local and wrap it in Ok.',
    ],
    solution: `use kernel::prelude::*;

struct Limiter {
    max: u32,
}

impl kernel::Module for Limiter {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        let max = read_max()?;
        pr_info!("limit set to {}\\n", max);
        Ok(Limiter { max })
    }
}`,
    starter: `use kernel::prelude::*;

struct Limiter {
    max: u32,
}

impl kernel::Module for Limiter {
    // TODO: read_max() with ?, log it, return Limiter { max }
}`,
    tags: ['rust-for-linux', 'module', 'result'],
  },
  {
    id: 'lx-ch16-c-019',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Map an Option to a Kernel Error',
    prompt: `Kernel APIs often return Option, and you turn None into an error code. The ok_or method converts Option<T> into Result<T, E>.

Write a function first_or_einval(slice: &[u32]) -> Result<u32> that returns the first element of slice, or fails with EINVAL when the slice is empty. Use ok_or together with the ? operator (or copy the value out).`,
    hints: [
      'slice.first() yields Option<&u32>.',
      'ok_or(code::EINVAL)? converts and unwraps the Option.',
      'Dereference or copy to return a u32 value.',
    ],
    solution: `use kernel::prelude::*;

fn first_or_einval(slice: &[u32]) -> Result<u32> {
    let value = *slice.first().ok_or(code::EINVAL)?;
    Ok(value)
}`,
    starter: `use kernel::prelude::*;

fn first_or_einval(slice: &[u32]) -> Result<u32> {
    // TODO: return the first element or EINVAL
}`,
    tags: ['rust-for-linux', 'result', 'option'],
  },
  {
    id: 'lx-ch16-c-020',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Wrap an Unsafe Call',
    prompt: `Abstractions in Rust for Linux present a safe API on top of unsafe C calls. The unsafe block marks where you uphold the C function's contract.

Assume an extern function declared as unsafe fn raw_enable() exists and is always safe to call from this context. Write a safe function enable() that calls raw_enable() inside an unsafe block, with a SAFETY comment explaining why the call is sound.`,
    hints: [
      'Calling an unsafe fn requires an unsafe block.',
      'Precede the unsafe block with a // SAFETY: comment.',
    ],
    solution: `use kernel::prelude::*;

extern "C" {
    fn raw_enable();
}

fn enable() {
    // SAFETY: raw_enable() has no preconditions and is always
    // safe to call from this context.
    unsafe { raw_enable() };
}`,
    starter: `use kernel::prelude::*;

extern "C" {
    fn raw_enable();
}

fn enable() {
    // TODO: call raw_enable() inside an unsafe block with a SAFETY note
}`,
    tags: ['rust-for-linux', 'unsafe', 'abstraction'],
  },
  {
    id: 'lx-ch16-c-021',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Convert a C Return Code',
    prompt: `Many C calls return 0 on success and a negative errno on failure. The kernel crate provides to_result, which turns such an i32 into a Result.

Write a function check(ret: i32) -> Result that converts a C-style return code in ret into a kernel Result using to_result, propagating the error and yielding Ok(()) on success.`,
    hints: [
      'to_result is available from the kernel error module.',
      'to_result(ret) returns Result; apply ? then return Ok(()), or simply return to_result(ret).',
    ],
    solution: `use kernel::error::to_result;
use kernel::prelude::*;

fn check(ret: i32) -> Result {
    to_result(ret)
}`,
    starter: `use kernel::error::to_result;
use kernel::prelude::*;

fn check(ret: i32) -> Result {
    // TODO: convert the C return code into a Result
}`,
    tags: ['rust-for-linux', 'result', 'error'],
  },
  {
    id: 'lx-ch16-c-022',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Allocate a Boxed Value',
    prompt: `Kernel heap allocation is fallible, so KBox::new takes a GFP allocation flag and returns a Result rather than panicking.

Write a function make_boxed(value: u32) -> Result<KBox<u32>> that allocates value on the kernel heap with the GFP_KERNEL flag, propagating any allocation failure with ?, and returns the box.`,
    hints: [
      'KBox::new takes the value and a flag such as GFP_KERNEL.',
      'The call returns Result<KBox<u32>>, so use ? and then wrap in Ok.',
    ],
    solution: `use kernel::prelude::*;

fn make_boxed(value: u32) -> Result<KBox<u32>> {
    let boxed = KBox::new(value, GFP_KERNEL)?;
    Ok(boxed)
}`,
    starter: `use kernel::prelude::*;

fn make_boxed(value: u32) -> Result<KBox<u32>> {
    // TODO: allocate value with GFP_KERNEL and return the box
}`,
    tags: ['rust-for-linux', 'alloc', 'result'],
  },
  {
    id: 'lx-ch16-c-023',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build a Growable Vector',
    prompt: `KVec is the kernel's fallible growable vector. Both creation helpers and push return Result because they may fail to allocate.

Write a function two_items() -> Result<KVec<u32>> that creates a new empty KVec, pushes 10 then 20 with the GFP_KERNEL flag (propagating errors with ?), and returns the vector.`,
    hints: [
      'KVec::new() makes an empty vector with no allocation.',
      'v.push(value, GFP_KERNEL)? appends and may fail.',
      'Make the vector binding mutable.',
    ],
    solution: `use kernel::prelude::*;

fn two_items() -> Result<KVec<u32>> {
    let mut v = KVec::new();
    v.push(10, GFP_KERNEL)?;
    v.push(20, GFP_KERNEL)?;
    Ok(v)
}`,
    starter: `use kernel::prelude::*;

fn two_items() -> Result<KVec<u32>> {
    // TODO: build a KVec containing 10 and 20
}`,
    tags: ['rust-for-linux', 'alloc', 'kvec'],
  },
  {
    id: 'lx-ch16-c-024',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print the Module Name',
    prompt: `pr_info! can interpolate runtime values. Suppose a function receives the module name as a string slice and should log it.

Write a function announce(name: &str) that prints a line of the form: module NAME ready, substituting the name argument.`,
    hints: [
      'Use a brace placeholder for the name.',
      'Pass name as the format argument.',
    ],
    solution: `use kernel::prelude::*;

fn announce(name: &str) {
    pr_info!("module {} ready\\n", name);
}`,
    starter: `use kernel::prelude::*;

fn announce(name: &str) {
    // TODO: print "module NAME ready"
}`,
    tags: ['rust-for-linux', 'pr_info', 'formatting'],
  },
  {
    id: 'lx-ch16-c-025',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match on a Result',
    prompt: `Sometimes you handle a Result by hand instead of using ?. A match lets you log differently on success and failure.

Write a function run_step() that calls a helper do_work() (assume fn do_work() -> Result) and matches on it: on Ok(()) print step ok, and on Err(e) print step failed: e using the value e as a format argument.`,
    hints: [
      'match on the call to do_work().',
      'The Err arm binds the error with Err(e).',
      'Use a placeholder to print e.',
    ],
    solution: `use kernel::prelude::*;

fn run_step() {
    match do_work() {
        Ok(()) => pr_info!("step ok\\n"),
        Err(e) => pr_err!("step failed: {:?}\\n", e),
    }
}`,
    starter: `use kernel::prelude::*;

fn run_step() {
    // TODO: match on do_work() and log each outcome
}`,
    tags: ['rust-for-linux', 'result', 'error'],
  },
  {
    id: 'lx-ch16-c-026',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Return a Computed Value or Error',
    prompt: `A fallible computation returns Result<T>. Division by zero is undefined, so guard against it.

Write a function safe_div(a: u32, b: u32) -> Result<u32> that returns Ok with a divided by b, but fails with EINVAL when b is zero.`,
    hints: [
      'Check b == 0 first and return Err(code::EINVAL).',
      'Otherwise return Ok(a / b).',
    ],
    solution: `use kernel::prelude::*;

fn safe_div(a: u32, b: u32) -> Result<u32> {
    if b == 0 {
        return Err(code::EINVAL);
    }
    Ok(a / b)
}`,
    starter: `use kernel::prelude::*;

fn safe_div(a: u32, b: u32) -> Result<u32> {
    // TODO: divide a by b, or return EINVAL when b is zero
}`,
    tags: ['rust-for-linux', 'result', 'error'],
  },
  {
    id: 'lx-ch16-c-027',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A SAFETY-Documented Pointer Read',
    prompt: `Dereferencing a raw pointer is unsafe; the abstraction author must document why it is sound.

Write a function read_at(ptr: *const u32) -> u32 that reads the u32 the pointer points to. Use an unsafe block with a SAFETY comment stating the caller guarantees ptr is valid and aligned. Use the ptr.read() method or a dereference.`,
    hints: [
      'Reading through a raw pointer requires unsafe.',
      'Document the caller-upheld invariant in a // SAFETY: comment.',
    ],
    solution: `use kernel::prelude::*;

fn read_at(ptr: *const u32) -> u32 {
    // SAFETY: the caller guarantees that ptr is valid for reads
    // and properly aligned for a u32.
    unsafe { ptr.read() }
}`,
    starter: `use kernel::prelude::*;

fn read_at(ptr: *const u32) -> u32 {
    // TODO: read through ptr inside an unsafe block with a SAFETY note
}`,
    tags: ['rust-for-linux', 'unsafe', 'pointer'],
  },
  {
    id: 'lx-ch16-c-028',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Conditionally Compile With CONFIG_RUST',
    prompt: `Rust kernel code is only built when CONFIG_RUST is enabled, exposed to Rust as the cfg flag CONFIG_RUST.

Write a function that is only compiled when CONFIG_RUST is set: annotate a function rust_only() with the appropriate cfg attribute so it is gated on CONFIG_RUST. Its body should print rust enabled.`,
    hints: [
      'Use the attribute form cfg(CONFIG_RUST) above the function.',
      'The body uses pr_info!.',
    ],
    solution: `use kernel::prelude::*;

#[cfg(CONFIG_RUST)]
fn rust_only() {
    pr_info!("rust enabled\\n");
}`,
    starter: `use kernel::prelude::*;

// TODO: gate rust_only() on CONFIG_RUST
fn rust_only() {
    pr_info!("rust enabled\\n");
}`,
    tags: ['rust-for-linux', 'config', 'cfg'],
  },
  {
    id: 'lx-ch16-c-029',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Module That Allocates State',
    prompt: `A module's init can perform fallible allocation and store the result as state.

Implement Module for a struct Stateful that holds a field data of type KBox<u32>. In init, allocate the value 42 with KBox::new and GFP_KERNEL (propagating failure with ?), print allocated state, and return the Stateful holding that box.`,
    hints: [
      'KBox::new(42, GFP_KERNEL)? gives a KBox<u32> or returns early on failure.',
      'Build Stateful { data } and wrap it in Ok.',
    ],
    solution: `use kernel::prelude::*;

struct Stateful {
    data: KBox<u32>,
}

impl kernel::Module for Stateful {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        let data = KBox::new(42, GFP_KERNEL)?;
        pr_info!("allocated state\\n");
        Ok(Stateful { data })
    }
}`,
    starter: `use kernel::prelude::*;

struct Stateful {
    data: KBox<u32>,
}

impl kernel::Module for Stateful {
    // TODO: allocate 42 into a KBox, log it, return Stateful { data }
}`,
    tags: ['rust-for-linux', 'module', 'alloc'],
  },
  {
    id: 'lx-ch16-c-030',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print a Loop of Values',
    prompt: `Logging inside a loop is common when reporting progress.

Write a function log_range() that iterates over the inclusive range 1 to 3 and, for each i, prints a line of the form: iteration I.`,
    hints: [
      'An inclusive range is written low..=high.',
      'Use a placeholder for i in the format string.',
    ],
    solution: `use kernel::prelude::*;

fn log_range() {
    for i in 1..=3 {
        pr_info!("iteration {}\\n", i);
    }
}`,
    starter: `use kernel::prelude::*;

fn log_range() {
    // TODO: print "iteration I" for I from 1 to 3
}`,
    tags: ['rust-for-linux', 'pr_info', 'control-flow'],
  },
  {
    id: 'lx-ch16-c-031',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Choose an Error Code by Condition',
    prompt: `Different failure modes map to different errno values. Pick EINVAL for bad input and ENOMEM for a capacity overflow.

Write a function reserve(count: u32, capacity: u32) -> Result that fails with EINVAL when count is zero, fails with ENOMEM when count is greater than capacity, and otherwise succeeds with the unit value.`,
    hints: [
      'Test count == 0 first, then count > capacity.',
      'Each branch returns a different Err; the final case is Ok(()).',
    ],
    solution: `use kernel::prelude::*;

fn reserve(count: u32, capacity: u32) -> Result {
    if count == 0 {
        return Err(code::EINVAL);
    }
    if count > capacity {
        return Err(code::ENOMEM);
    }
    Ok(())
}`,
    starter: `use kernel::prelude::*;

fn reserve(count: u32, capacity: u32) -> Result {
    // TODO: EINVAL when count is 0, ENOMEM when over capacity, else Ok
}`,
    tags: ['rust-for-linux', 'result', 'error'],
  },
  {
    id: 'lx-ch16-c-032',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use the Module Parameter',
    prompt: `The init function receives a &'static ThisModule reference that identifies the loading module. A common use is logging the module's name via its name() method, which returns a kernel string.

Write the init body for a struct NamedModule: bind the parameter as module, print module loaded using module.name() as the format argument, and return Ok(NamedModule).`,
    hints: [
      'Name the parameter module rather than _module since you use it.',
      'module.name() yields the module name to interpolate.',
      'Return Ok(NamedModule) at the end.',
    ],
    solution: `use kernel::prelude::*;

struct NamedModule;

impl kernel::Module for NamedModule {
    fn init(module: &'static ThisModule) -> Result<Self> {
        pr_info!("{} loaded\\n", module.name());
        Ok(NamedModule)
    }
}`,
    starter: `use kernel::prelude::*;

struct NamedModule;

impl kernel::Module for NamedModule {
    fn init(module: &'static ThisModule) -> Result<Self> {
        // TODO: log the module name, then return Ok(NamedModule)
    }
}`,
    tags: ['rust-for-linux', 'module', 'thismodule'],
  },
  {
    id: 'lx-ch16-c-033',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Implement Drop for Cleanup',
    prompt: `In Rust for Linux there is no separate exit function: cleanup happens in the module type's Drop implementation, which runs automatically when the module unloads.

Implement Drop for a struct RustCleanup so that dropping it prints rust_cleanup: unloaded. (Assume the struct and its Module impl exist elsewhere.)`,
    hints: [
      'impl Drop for RustCleanup defines a drop(&mut self) method.',
      'Put the pr_info! call inside drop.',
    ],
    solution: `use kernel::prelude::*;

struct RustCleanup;

impl Drop for RustCleanup {
    fn drop(&mut self) {
        pr_info!("rust_cleanup: unloaded\\n");
    }
}`,
    starter: `use kernel::prelude::*;

struct RustCleanup;

// TODO: implement Drop so unloading prints "rust_cleanup: unloaded"
`,
    tags: ['rust-for-linux', 'module', 'drop'],
  },
  {
    id: 'lx-ch16-c-034',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Module With Init and Drop',
    prompt: `Combine an init that logs startup with a Drop that logs shutdown.

For a struct LifeCycle: implement Module so init prints lifecycle: start and returns Ok(LifeCycle), and implement Drop so dropping prints lifecycle: stop.`,
    hints: [
      'You need two impl blocks: one for kernel::Module, one for Drop.',
      'init returns Result<Self>; drop takes &mut self.',
    ],
    solution: `use kernel::prelude::*;

struct LifeCycle;

impl kernel::Module for LifeCycle {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("lifecycle: start\\n");
        Ok(LifeCycle)
    }
}

impl Drop for LifeCycle {
    fn drop(&mut self) {
        pr_info!("lifecycle: stop\\n");
    }
}`,
    starter: `use kernel::prelude::*;

struct LifeCycle;

// TODO: impl Module (init logs start) and Drop (logs stop)
`,
    tags: ['rust-for-linux', 'module', 'drop'],
  },
  {
    id: 'lx-ch16-c-035',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Full Module With Validation and Cleanup',
    prompt: `Bring everything together into one module file.

Declare a struct Driver with a field max of type u32. Implement Module so init reads a value with read_max() (assume fn read_max() -> Result<u32>) using ?, fails with EINVAL when that value is zero, otherwise prints driver up and returns a Driver with that max. Implement Drop so unloading prints driver down. Register the type with module! using name "driver", author "RFL", description "Validated driver", and license "GPL".`,
    hints: [
      'In init, bind read_max()? then guard against zero before building the struct.',
      'Return Err(code::EINVAL) on the zero case; otherwise Ok(Driver { max }).',
      'The module! invocation needs type, name, author, description, and license.',
    ],
    solution: `use kernel::prelude::*;

struct Driver {
    max: u32,
}

impl kernel::Module for Driver {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        let max = read_max()?;
        if max == 0 {
            return Err(code::EINVAL);
        }
        pr_info!("driver up\\n");
        Ok(Driver { max })
    }
}

impl Drop for Driver {
    fn drop(&mut self) {
        pr_info!("driver down\\n");
    }
}

module! {
    type: Driver,
    name: "driver",
    author: "RFL",
    description: "Validated driver",
    license: "GPL",
}`,
    starter: `use kernel::prelude::*;

struct Driver {
    max: u32,
}

// TODO: impl Module (validate read_max, log "driver up"),
// impl Drop (log "driver down"), and register with module!
`,
    tags: ['rust-for-linux', 'module', 'result'],
  },
]

export default problems
