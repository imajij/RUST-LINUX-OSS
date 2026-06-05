import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch16-c-036',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimal Module With The module! Macro',
    prompt: `Write a minimal Rust kernel module. Pull in the prelude, define a unit struct RustMinimal that implements the Module trait, and register it with the module! macro. The module! invocation must set type, name, author, description, and license (use "GPL"). In init, print "rust_minimal loaded" with pr_info! and return Ok of your struct.`,
    hints: [
      'use kernel::prelude::*; brings Module, ThisModule, Result, pr_info! and the macro into scope.',
      'Module::init takes a &ThisModule and returns Result<Self>.',
    ],
    solution: `use kernel::prelude::*;

module! {
    type: RustMinimal,
    name: "rust_minimal",
    author: "Rust for Linux",
    description: "A minimal Rust kernel module",
    license: "GPL",
}

struct RustMinimal;

impl kernel::Module for RustMinimal {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("rust_minimal loaded\\n");
        Ok(RustMinimal)
    }
}`,
    starter: `use kernel::prelude::*;

module! {
    // TODO: type, name, author, description, license
}

struct RustMinimal;

impl kernel::Module for RustMinimal {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        // TODO: log and return Ok(Self)
    }
}`,
    tags: ['kernel', 'module', 'prelude'],
  },
  {
    id: 'lx-ch16-c-037',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Cleanup In Drop',
    prompt: `Kernel modules clean up by implementing Drop, not by an explicit exit function. Take a struct RustHello that owns nothing special and make it print "loaded" from Module::init and "unloaded" from its Drop impl. Show only the struct, its Module impl, and its Drop impl (assume the module! macro is elsewhere).`,
    hints: [
      'The module framework drops your Module value when the module is removed.',
      'Implement Drop for the struct to run teardown code.',
    ],
    solution: `use kernel::prelude::*;

struct RustHello;

impl kernel::Module for RustHello {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("loaded\\n");
        Ok(RustHello)
    }
}

impl Drop for RustHello {
    fn drop(&mut self) {
        pr_info!("unloaded\\n");
    }
}`,
    starter: `use kernel::prelude::*;

struct RustHello;

impl kernel::Module for RustHello {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        // TODO
    }
}

// TODO: impl Drop to log "unloaded"`,
    tags: ['kernel', 'module', 'drop'],
  },
  {
    id: 'lx-ch16-c-038',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Propagate A Fallible Allocation',
    prompt: `Write a function build() that allocates a KBox holding the u32 value 42 and returns it as Result<KBox<u32>>. Use the fallible constructor and GFP_KERNEL, and propagate any allocation failure with the question-mark operator. Do not unwrap or panic.`,
    hints: [
      'KBox::new(value, GFP_KERNEL) returns a Result.',
      'The ? operator converts the allocation error into the function Result.',
    ],
    solution: `use kernel::prelude::*;

fn build() -> Result<KBox<u32>> {
    let b = KBox::new(42u32, GFP_KERNEL)?;
    Ok(b)
}`,
    starter: `use kernel::prelude::*;

fn build() -> Result<KBox<u32>> {
    // TODO: fallibly allocate a KBox<u32> = 42 and return it
}`,
    tags: ['kernel', 'alloc', 'result'],
  },
  {
    id: 'lx-ch16-c-039',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Return A Specific Errno',
    prompt: `Write a function check(n: i32) -> Result that returns Ok(()) when n is non-negative and returns the kernel error EINVAL otherwise. Use the kernel error constants, not raw integers.`,
    hints: [
      'kernel::error::code::EINVAL is an Error value you can return in Err(...).',
      'Result with no type parameter defaults to Result<()>.',
    ],
    solution: `use kernel::prelude::*;
use kernel::error::code::EINVAL;

fn check(n: i32) -> Result {
    if n < 0 {
        return Err(EINVAL);
    }
    Ok(())
}`,
    starter: `use kernel::prelude::*;
use kernel::error::code::EINVAL;

fn check(n: i32) -> Result {
    // TODO: Err(EINVAL) when n < 0, else Ok(())
}`,
    tags: ['kernel', 'error', 'result'],
  },
  {
    id: 'lx-ch16-c-040',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Convert An errno Into Error',
    prompt: `A C abstraction hands you a raw negative errno value (for example -22) as an i32 named ret. Write a function from_c(ret: i32) -> Result that returns Ok(()) when ret is zero or positive, and otherwise turns the negative errno into a kernel Error and returns it. Use Error::from_errno.`,
    hints: [
      'C kernel functions signal failure with a negative errno return.',
      'Error::from_errno(ret) builds an Error from a negative value.',
    ],
    solution: `use kernel::prelude::*;
use kernel::error::Error;

fn from_c(ret: i32) -> Result {
    if ret < 0 {
        return Err(Error::from_errno(ret));
    }
    Ok(())
}`,
    starter: `use kernel::prelude::*;
use kernel::error::Error;

fn from_c(ret: i32) -> Result {
    // TODO: negative ret -> Err(Error::from_errno(ret)), else Ok
}`,
    tags: ['kernel', 'error', 'ffi'],
  },
  {
    id: 'lx-ch16-c-041',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Wrap A C Call With to_result',
    prompt: `You are given an extern C function declared as fn c_setup() -> i32 that returns 0 on success or a negative errno. Write a safe Rust wrapper setup() -> Result that calls it and turns the integer return into a Result using the to_result helper. Mark the FFI call unsafe and justify it is sound because c_setup takes no arguments and has no preconditions.`,
    hints: [
      'kernel::error::to_result(ret) maps 0 to Ok(()) and negatives to Err.',
      'The FFI call itself must sit inside an unsafe block.',
    ],
    solution: `use kernel::prelude::*;
use kernel::error::to_result;

extern "C" {
    fn c_setup() -> i32;
}

fn setup() -> Result {
    // SAFETY: c_setup takes no arguments and has no preconditions.
    let ret = unsafe { c_setup() };
    to_result(ret)
}`,
    starter: `use kernel::prelude::*;
use kernel::error::to_result;

extern "C" {
    fn c_setup() -> i32;
}

fn setup() -> Result {
    // TODO: call c_setup in unsafe, map the i32 with to_result
}`,
    tags: ['kernel', 'ffi', 'error'],
  },
  {
    id: 'lx-ch16-c-042',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Share State With Arc',
    prompt: `Build a reference-counted shared u32 in the kernel. Write a function share() -> Result<Arc<u32>> that fallibly allocates an Arc holding the value 7 using GFP_KERNEL, then clones the Arc and drops the clone, and returns the original. Use the kernel Arc, not the std one.`,
    hints: [
      'kernel::sync::Arc is the kernel reference-counted pointer.',
      'Arc::new(value, GFP_KERNEL) is fallible and returns a Result.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::Arc;

fn share() -> Result<Arc<u32>> {
    let a = Arc::new(7u32, GFP_KERNEL)?;
    let b = a.clone();
    drop(b);
    Ok(a)
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::Arc;

fn share() -> Result<Arc<u32>> {
    // TODO: allocate Arc<u32> = 7, clone, drop the clone, return original
}`,
    tags: ['kernel', 'arc', 'refcount'],
  },
  {
    id: 'lx-ch16-c-043',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Protect Data With A Mutex',
    prompt: `Define a struct Shared holding a Mutex<u32>. Write a constructor new(v: u32) -> Result<Arc<Shared>> that initializes the mutex via the new_mutex! macro and wraps the whole thing in an Arc. Then write add(s: &Shared, n: u32) that locks the mutex and adds n to the contained value.`,
    hints: [
      'new_mutex! returns a pin-initializer; pair it with Arc::pin_init.',
      'Locking returns a guard you can dereference mutably.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Shared {
    #[pin]
    value: Mutex<u32>,
}

fn new(v: u32) -> Result<Arc<Shared>> {
    Arc::pin_init(
        pin_init!(Shared {
            value <- new_mutex!(v),
        }),
        GFP_KERNEL,
    )
}

fn add(s: &Shared, n: u32) {
    let mut guard = s.value.lock();
    *guard += n;
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Shared {
    #[pin]
    value: Mutex<u32>,
}

fn new(v: u32) -> Result<Arc<Shared>> {
    // TODO: pin_init Shared with new_mutex!(v), wrap in Arc
}

fn add(s: &Shared, n: u32) {
    // TODO: lock and add n
}`,
    tags: ['kernel', 'mutex', 'sync'],
  },
  {
    id: 'lx-ch16-c-044',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read Through A SpinLock',
    prompt: `Define a struct Counter that holds a SpinLock<u64> initialized with new_spinlock!. Write read(c: &Counter) -> u64 that locks the spinlock and returns a copy of the value. Use #[pin_data] and #[pin] so the lock can be initialized in place.`,
    hints: [
      'SpinLock is in kernel::sync; initialize it with new_spinlock!.',
      'Dereference the guard to read the protected value, then copy it out.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{SpinLock, new_spinlock};

#[pin_data]
struct Counter {
    #[pin]
    count: SpinLock<u64>,
}

fn read(c: &Counter) -> u64 {
    let guard = c.count.lock();
    *guard
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{SpinLock, new_spinlock};

#[pin_data]
struct Counter {
    #[pin]
    count: SpinLock<u64>,
}

fn read(c: &Counter) -> u64 {
    // TODO: lock and copy out the value
}`,
    tags: ['kernel', 'spinlock', 'sync'],
  },
  {
    id: 'lx-ch16-c-045',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build A CString From Format',
    prompt: `Write a function label(id: u32) -> Result<CString> that builds a kernel CString equal to "dev-<id>" (for example "dev-5"). Use the fmt! helper with CString::try_from_fmt so allocation failure is propagated as an error.`,
    hints: [
      'CString::try_from_fmt(fmt!(...)) builds an allocated NUL-terminated string fallibly.',
      'fmt! is the kernel formatting macro re-exported from the prelude.',
    ],
    solution: `use kernel::prelude::*;
use kernel::str::CString;

fn label(id: u32) -> Result<CString> {
    CString::try_from_fmt(fmt!("dev-{}", id))
}`,
    starter: `use kernel::prelude::*;
use kernel::str::CString;

fn label(id: u32) -> Result<CString> {
    // TODO: build "dev-<id>" as a CString, fallibly
}`,
    tags: ['kernel', 'cstring', 'alloc'],
  },
  {
    id: 'lx-ch16-c-046',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Collect Into A Kernel Vec',
    prompt: `Write a function squares(n: usize) -> Result<KVec<u32>> that returns a KVec containing the squares 0,1,4,9,... for indices 0..n. Allocate with KVec::new, reserve no preallocation, and push each element fallibly with GFP_KERNEL using push, propagating errors.`,
    hints: [
      'KVec::new() makes an empty vector; push(value, GFP_KERNEL) is fallible.',
      'Cast indices to u32 before squaring to keep the element type.',
    ],
    solution: `use kernel::prelude::*;

fn squares(n: usize) -> Result<KVec<u32>> {
    let mut v = KVec::new();
    for i in 0..n {
        let x = i as u32;
        v.push(x * x, GFP_KERNEL)?;
    }
    Ok(v)
}`,
    starter: `use kernel::prelude::*;

fn squares(n: usize) -> Result<KVec<u32>> {
    // TODO: push i*i for i in 0..n, fallibly
}`,
    tags: ['kernel', 'kvec', 'alloc'],
  },
  {
    id: 'lx-ch16-c-047',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Module Parameters',
    prompt: `Extend a module! invocation to declare a single read-only module parameter named count of type u32 with a default of 1 and a short description. Show the full module! block for a Module type named ParamMod, plus the field selection inside params. You may stub the Module impl.`,
    hints: [
      'params: { name: { type: u32, default: ..., description: ... } } goes inside module!.',
      'Read a parameter with .read() against the module context where available.',
    ],
    solution: `use kernel::prelude::*;

module! {
    type: ParamMod,
    name: "param_mod",
    author: "Rust for Linux",
    description: "Module with a parameter",
    license: "GPL",
    params: {
        count: u32 {
            default: 1,
            description: "How many times to greet",
        },
    },
}

struct ParamMod;

impl kernel::Module for ParamMod {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        Ok(ParamMod)
    }
}`,
    starter: `use kernel::prelude::*;

module! {
    type: ParamMod,
    name: "param_mod",
    author: "Rust for Linux",
    description: "Module with a parameter",
    license: "GPL",
    params: {
        // TODO: declare count: u32 with default 1 and a description
    },
}

struct ParamMod;

impl kernel::Module for ParamMod {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        Ok(ParamMod)
    }
}`,
    tags: ['kernel', 'module', 'params'],
  },
  {
    id: 'lx-ch16-c-048',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Define A Static CStr',
    prompt: `Create a function name() -> &'static CStr that returns a static kernel C string literal equal to "rust-driver". Use the c_str! macro so the value is a compile-time NUL-terminated &CStr with no allocation.`,
    hints: [
      'c_str!("...") yields a static CStr known at compile time.',
      'CStr lives in kernel::str and is re-exported via the prelude.',
    ],
    solution: `use kernel::prelude::*;
use kernel::str::CStr;

fn name() -> &'static CStr {
    c_str!("rust-driver")
}`,
    starter: `use kernel::prelude::*;
use kernel::str::CStr;

fn name() -> &'static CStr {
    // TODO: return a compile-time CStr "rust-driver"
}`,
    tags: ['kernel', 'cstr', 'str'],
  },
  {
    id: 'lx-ch16-c-049',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Safe Wrapper Holding A Raw Pointer',
    prompt: `An abstraction owns a foreign object as a raw pointer struct foo *. Define a struct Foo { ptr: *mut bindings::foo } and write a method as_raw(&self) -> *mut bindings::foo returning the stored pointer. Do not dereference it; just expose the accessor. Use the bindings crate path for the C type.`,
    hints: [
      'bindings::foo is the auto-generated C type; *mut bindings::foo is its raw pointer.',
      'Returning the raw pointer is safe; only dereferencing would be unsafe.',
    ],
    solution: `use kernel::bindings;

struct Foo {
    ptr: *mut bindings::foo,
}

impl Foo {
    fn as_raw(&self) -> *mut bindings::foo {
        self.ptr
    }
}`,
    starter: `use kernel::bindings;

struct Foo {
    ptr: *mut bindings::foo,
}

impl Foo {
    fn as_raw(&self) -> *mut bindings::foo {
        // TODO: return the stored raw pointer
    }
}`,
    tags: ['kernel', 'bindings', 'ffi'],
  },
  {
    id: 'lx-ch16-c-050',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Document A SAFETY Comment',
    prompt: `You must call an extern C function fn c_write(buf: *const u8, len: usize) -> i32 with the bytes of a Rust slice. Write a function write_all(data: &[u8]) -> Result that passes the slice pointer and length to c_write inside an unsafe block, includes a correct SAFETY comment justifying the pointer/length pair, and converts the return with to_result.`,
    hints: [
      'A &[u8] gives a valid pointer and length via as_ptr() and len().',
      'The SAFETY comment must state the pointer is valid for len bytes for the call.',
    ],
    solution: `use kernel::prelude::*;
use kernel::error::to_result;

extern "C" {
    fn c_write(buf: *const u8, len: usize) -> i32;
}

fn write_all(data: &[u8]) -> Result {
    // SAFETY: data.as_ptr() is valid for data.len() bytes and stays alive
    // for the duration of the call; c_write only reads from it.
    let ret = unsafe { c_write(data.as_ptr(), data.len()) };
    to_result(ret)
}`,
    starter: `use kernel::prelude::*;
use kernel::error::to_result;

extern "C" {
    fn c_write(buf: *const u8, len: usize) -> i32;
}

fn write_all(data: &[u8]) -> Result {
    // TODO: call c_write with the slice pointer/len, SAFETY comment, to_result
}`,
    tags: ['kernel', 'ffi', 'safety'],
  },
  {
    id: 'lx-ch16-c-051',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pin-Initialize An Embedded Struct',
    prompt: `Define a struct Device that contains a Mutex<KVec<u32>> named queue. Write new() -> Result<Arc<Device>> that pin-initializes the device, starting the queue as an empty KVec wrapped in a mutex via new_mutex!. Use #[pin_data], #[pin], pin_init!, and Arc::pin_init.`,
    hints: [
      'KVec::new() makes the empty inner vector for the mutex.',
      'pin_init! with field <- new_mutex!(...) builds the in-place initializer.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Device {
    #[pin]
    queue: Mutex<KVec<u32>>,
}

fn new() -> Result<Arc<Device>> {
    Arc::pin_init(
        pin_init!(Device {
            queue <- new_mutex!(KVec::new()),
        }),
        GFP_KERNEL,
    )
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Device {
    #[pin]
    queue: Mutex<KVec<u32>>,
}

fn new() -> Result<Arc<Device>> {
    // TODO: pin_init with an empty KVec inside new_mutex!
}`,
    tags: ['kernel', 'pin-init', 'mutex'],
  },
  {
    id: 'lx-ch16-c-052',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Map And Propagate With ok_or',
    prompt: `Write a function nth(v: &KVec<u32>, i: usize) -> Result<u32> that returns the i-th element by value, or the error ENOENT when the index is out of range. Use the slice get method together with ok_or and the question mark or a direct return.`,
    hints: [
      'KVec derefs to a slice, so v.get(i) returns Option<&u32>.',
      'Option::ok_or(ENOENT) turns None into Err(ENOENT).',
    ],
    solution: `use kernel::prelude::*;
use kernel::error::code::ENOENT;

fn nth(v: &KVec<u32>, i: usize) -> Result<u32> {
    let r = v.get(i).ok_or(ENOENT)?;
    Ok(*r)
}`,
    starter: `use kernel::prelude::*;
use kernel::error::code::ENOENT;

fn nth(v: &KVec<u32>, i: usize) -> Result<u32> {
    // TODO: return element i or Err(ENOENT)
}`,
    tags: ['kernel', 'kvec', 'error'],
  },
  {
    id: 'lx-ch16-c-053',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Implement A Trait Across The Abstraction',
    prompt: `Driver code plugs into a subsystem by implementing a trait. Define a trait Operation { fn run(&self) -> Result; } and a struct Echo { times: u32 } that implements it by printing "echo" the given number of times with pr_info!. The run method returns Ok at the end.`,
    hints: [
      'A simple for-loop over 0..self.times drives the repetition.',
      'Return Ok(()) (written Ok(())) at the end of run.',
    ],
    solution: `use kernel::prelude::*;

trait Operation {
    fn run(&self) -> Result;
}

struct Echo {
    times: u32,
}

impl Operation for Echo {
    fn run(&self) -> Result {
        for _ in 0..self.times {
            pr_info!("echo\\n");
        }
        Ok(())
    }
}`,
    starter: `use kernel::prelude::*;

trait Operation {
    fn run(&self) -> Result;
}

struct Echo {
    times: u32,
}

impl Operation for Echo {
    fn run(&self) -> Result {
        // TODO: print "echo" self.times times, return Ok
    }
}`,
    tags: ['kernel', 'trait', 'abstraction'],
  },
  {
    id: 'lx-ch16-c-054',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Use try_pin_init For A Fallible Field',
    prompt: `Define a struct Buf with a Mutex<KVec<u8>> named data, where the vector must be preallocated to capacity 64. Write new() -> Result<Arc<Buf>> using KVec::with_capacity(64, GFP_KERNEL) (which is fallible) inside the pin-initializer. Use pin_init! with the <- and ? semantics so allocation failure aborts initialization cleanly.`,
    hints: [
      'KVec::with_capacity(cap, GFP_KERNEL) returns Result and can be tried inside pin_init!.',
      'Use try_pin_init! when a field initializer itself is fallible, or ? the capacity allocation before building.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Buf {
    #[pin]
    data: Mutex<KVec<u8>>,
}

fn new() -> Result<Arc<Buf>> {
    let v = KVec::with_capacity(64, GFP_KERNEL)?;
    Arc::pin_init(
        pin_init!(Buf {
            data <- new_mutex!(v),
        }),
        GFP_KERNEL,
    )
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Buf {
    #[pin]
    data: Mutex<KVec<u8>>,
}

fn new() -> Result<Arc<Buf>> {
    // TODO: preallocate KVec capacity 64 fallibly, wrap in mutex, pin_init
}`,
    tags: ['kernel', 'pin-init', 'alloc'],
  },
  {
    id: 'lx-ch16-c-055',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Match On A Kernel Error',
    prompt: `Write a function classify(r: Result<u32>) -> &'static str that returns "ok" for Ok, "missing" when the error equals ENOENT, and "other" for any other error. Compare the contained Error to the ENOENT constant.`,
    hints: [
      'Match Ok(_) and Err(e) separately.',
      'Inside Err, compare e == ENOENT using the error code constant.',
    ],
    solution: `use kernel::prelude::*;
use kernel::error::code::ENOENT;

fn classify(r: Result<u32>) -> &'static str {
    match r {
        Ok(_) => "ok",
        Err(e) if e == ENOENT => "missing",
        Err(_) => "other",
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::error::code::ENOENT;

fn classify(r: Result<u32>) -> &'static str {
    // TODO: "ok" / "missing" (ENOENT) / "other"
}`,
    tags: ['kernel', 'error', 'match'],
  },
  {
    id: 'lx-ch16-c-056',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Expose An ARef Accessor',
    prompt: `A reference-counted subsystem type Device uses ARef<Device> for owned references. Write a function dup(dev: &Device) -> ARef<Device> that creates a new owned reference from a borrow. Assume Device implements AlwaysRefCounted, so ARef::from(dev) is the idiomatic way to bump the count.`,
    hints: [
      'ARef is kernel::types::ARef, the owned smart pointer for AlwaysRefCounted types.',
      'ARef::from(&dev) increments the refcount and returns an owned ARef.',
    ],
    solution: `use kernel::prelude::*;
use kernel::types::ARef;

fn dup(dev: &Device) -> ARef<Device> {
    ARef::from(dev)
}`,
    starter: `use kernel::prelude::*;
use kernel::types::ARef;

fn dup(dev: &Device) -> ARef<Device> {
    // TODO: create an owned reference from the borrow
}`,
    tags: ['kernel', 'aref', 'refcount'],
  },
  {
    id: 'lx-ch16-c-057',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Guard A Lock In init',
    prompt: `Inside Module::init you receive a freshly built Arc<Shared> where Shared holds a Mutex<u32> named value. Write the body of init that locks the mutex, sets value to 100, drops the guard, then logs "ready" and returns Ok of a unit struct Ready. Assume Shared and a helper new() -> Result<Arc<Shared>> exist.`,
    hints: [
      'Hold the guard in a let, mutate through it, then let it drop before logging.',
      'Module::init returns Result<Self>, so return Ok(Ready) at the end.',
    ],
    solution: `use kernel::prelude::*;

struct Ready;

impl kernel::Module for Ready {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        let shared = new()?;
        {
            let mut guard = shared.value.lock();
            *guard = 100;
        }
        pr_info!("ready\\n");
        Ok(Ready)
    }
}`,
    starter: `use kernel::prelude::*;

struct Ready;

impl kernel::Module for Ready {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        // TODO: build Arc, lock and set value to 100, log "ready", Ok(Ready)
    }
}`,
    tags: ['kernel', 'module', 'mutex'],
  },
  {
    id: 'lx-ch16-c-058',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Convert A C String To A Rust str',
    prompt: `An FFI boundary gives you a &CStr from the kernel string module. Write a function as_str(c: &CStr) -> Result<&str> that returns the contents as a UTF-8 &str, converting a non-UTF-8 failure into the EINVAL error. Use CStr::to_str.`,
    hints: [
      'CStr::to_str returns Result<&str, Utf8Error>.',
      'Use map_err to turn the Utf8Error into EINVAL.',
    ],
    solution: `use kernel::prelude::*;
use kernel::str::CStr;
use kernel::error::code::EINVAL;

fn as_str(c: &CStr) -> Result<&str> {
    c.to_str().map_err(|_| EINVAL)
}`,
    starter: `use kernel::prelude::*;
use kernel::str::CStr;
use kernel::error::code::EINVAL;

fn as_str(c: &CStr) -> Result<&str> {
    // TODO: to_str, mapping the error to EINVAL
}`,
    tags: ['kernel', 'cstr', 'error'],
  },
  {
    id: 'lx-ch16-c-059',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Implement Deref For A Newtype Wrapper',
    prompt: `Define a newtype Registration that owns an Arc<Device> and implement Deref so it transparently exposes the inner Device. Write the struct and the Deref impl with Target = Device. Assume Device is some existing type.`,
    hints: [
      'Deref::Target names the type &Registration derefs to.',
      'deref returns a &Device borrowed from the inner Arc.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::Arc;
use core::ops::Deref;

struct Registration {
    dev: Arc<Device>,
}

impl Deref for Registration {
    type Target = Device;

    fn deref(&self) -> &Device {
        &self.dev
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::Arc;
use core::ops::Deref;

struct Registration {
    dev: Arc<Device>,
}

impl Deref for Registration {
    type Target = Device;

    fn deref(&self) -> &Device {
        // TODO: expose the inner Device
    }
}`,
    tags: ['kernel', 'deref', 'abstraction'],
  },
  {
    id: 'lx-ch16-c-060',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Implement AlwaysRefCounted Over A C refcount',
    prompt: `You are wrapping a C type bindings::widget that contains an embedded refcount_t the kernel manipulates via bindings::widget_get and bindings::widget_put (each taking *mut bindings::widget). Define a transparent Rust struct Widget(Opaque<bindings::widget>) and implement AlwaysRefCounted for it, providing inc_ref and dec_ref by calling the C helpers on self.0.get(). Include SAFETY comments and an unsafe impl Send/Sync only if asked — here just inc_ref and dec_ref.`,
    hints: [
      'AlwaysRefCounted requires inc_ref(&self) and unsafe fn dec_ref(obj: NonNull<Self>).',
      'Opaque<T>::get() returns *mut T pointing at the wrapped C object.',
    ],
    solution: `use kernel::prelude::*;
use kernel::bindings;
use kernel::types::{AlwaysRefCounted, Opaque};
use core::ptr::NonNull;

#[repr(transparent)]
struct Widget(Opaque<bindings::widget>);

unsafe impl AlwaysRefCounted for Widget {
    fn inc_ref(&self) {
        // SAFETY: self.0.get() points at a valid, live widget because
        // self is a valid reference to a Widget.
        unsafe { bindings::widget_get(self.0.get()) };
    }

    unsafe fn dec_ref(obj: NonNull<Self>) {
        // SAFETY: the caller guarantees obj holds a count we own; the
        // pointer is valid for the put call.
        unsafe { bindings::widget_put(obj.cast::<bindings::widget>().as_ptr()) };
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::bindings;
use kernel::types::{AlwaysRefCounted, Opaque};
use core::ptr::NonNull;

#[repr(transparent)]
struct Widget(Opaque<bindings::widget>);

unsafe impl AlwaysRefCounted for Widget {
    fn inc_ref(&self) {
        // TODO: call widget_get with a SAFETY comment
    }

    unsafe fn dec_ref(obj: NonNull<Self>) {
        // TODO: call widget_put with a SAFETY comment
    }
}`,
    tags: ['kernel', 'refcount', 'bindings'],
  },
  {
    id: 'lx-ch16-c-061',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Misc Device Registration Abstraction',
    prompt: `Sketch a small abstraction over a C registration that needs an unregister on drop. Define struct Reg { ptr: *mut bindings::thing } where register() calls bindings::thing_register() -> *mut bindings::thing (NULL on failure) and Drop calls bindings::thing_unregister(ptr). Write register() -> Result<Reg> turning NULL into ENOMEM, and the Drop impl. Include SAFETY comments.`,
    hints: [
      'A NULL return from the C constructor should map to Err(ENOMEM).',
      'Drop must call the C destructor exactly once on the stored pointer.',
    ],
    solution: `use kernel::prelude::*;
use kernel::bindings;
use kernel::error::code::ENOMEM;

struct Reg {
    ptr: *mut bindings::thing,
}

fn register() -> Result<Reg> {
    // SAFETY: thing_register takes no arguments and is always safe to call.
    let ptr = unsafe { bindings::thing_register() };
    if ptr.is_null() {
        return Err(ENOMEM);
    }
    Ok(Reg { ptr })
}

impl Drop for Reg {
    fn drop(&mut self) {
        // SAFETY: self.ptr came from a successful thing_register and has not
        // been unregistered yet; we own it and unregister exactly once.
        unsafe { bindings::thing_unregister(self.ptr) };
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::bindings;
use kernel::error::code::ENOMEM;

struct Reg {
    ptr: *mut bindings::thing,
}

fn register() -> Result<Reg> {
    // TODO: call thing_register, NULL -> ENOMEM, else wrap pointer
}

impl Drop for Reg {
    fn drop(&mut self) {
        // TODO: call thing_unregister on the stored pointer
    }
}`,
    tags: ['kernel', 'abstraction', 'drop'],
  },
  {
    id: 'lx-ch16-c-062',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Drive A C Callback From Rust',
    prompt: `A C subsystem stores a void *data and calls back into Rust via an extern "C" fn(data: *mut c_void) -> i32. Write a callback trampoline rust_cb(data: *mut core::ffi::c_void) -> i32 that recovers an &Handler from data (where Handler implements fn handle(&self) -> Result), runs it, and returns 0 on success or the errno via Error::to_errno. Assume the C side guarantees data points to a live Handler for the call.`,
    hints: [
      'Cast data to *const Handler and form a shared reference inside unsafe.',
      'Map the Result to an i32: Ok -> 0, Err(e) -> e.to_errno().',
    ],
    solution: `use kernel::prelude::*;
use core::ffi::c_void;

trait Handler {
    fn handle(&self) -> Result;
}

extern "C" fn rust_cb(data: *mut c_void) -> i32 {
    // SAFETY: the C subsystem guarantees data points to a live Handler
    // (a HandlerImpl) for the duration of this call.
    let handler = unsafe { &*(data as *const HandlerImpl) };
    match handler.handle() {
        Ok(()) => 0,
        Err(e) => e.to_errno(),
    }
}`,
    starter: `use kernel::prelude::*;
use core::ffi::c_void;

trait Handler {
    fn handle(&self) -> Result;
}

extern "C" fn rust_cb(data: *mut c_void) -> i32 {
    // TODO: recover &HandlerImpl from data, call handle, map Result to i32
}`,
    tags: ['kernel', 'ffi', 'callback'],
  },
  {
    id: 'lx-ch16-c-063',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Implement Index For A Locked Table',
    prompt: `Define a struct Table holding a SpinLock<KVec<u32>> named rows. Write a method sum(&self) -> u64 that locks, iterates over every row casting to u64, and returns the total. Then write set(&self, i: usize, v: u32) -> Result that locks, replaces the i-th element (out of range -> EINVAL), and returns Ok. Use new_spinlock! in a constructor new() -> Result<Arc<Table>> too.`,
    hints: [
      'Iterate the guard with .iter() to sum; cast each element to u64.',
      'For set, use get_mut(i) which returns Option<&mut u32>.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{Arc, SpinLock, new_spinlock};
use kernel::error::code::EINVAL;

#[pin_data]
struct Table {
    #[pin]
    rows: SpinLock<KVec<u32>>,
}

fn new() -> Result<Arc<Table>> {
    Arc::pin_init(
        pin_init!(Table {
            rows <- new_spinlock!(KVec::new()),
        }),
        GFP_KERNEL,
    )
}

impl Table {
    fn sum(&self) -> u64 {
        let guard = self.rows.lock();
        let mut total = 0u64;
        for r in guard.iter() {
            total += *r as u64;
        }
        total
    }

    fn set(&self, i: usize, v: u32) -> Result {
        let mut guard = self.rows.lock();
        let slot = guard.get_mut(i).ok_or(EINVAL)?;
        *slot = v;
        Ok(())
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{Arc, SpinLock, new_spinlock};
use kernel::error::code::EINVAL;

#[pin_data]
struct Table {
    #[pin]
    rows: SpinLock<KVec<u32>>,
}

fn new() -> Result<Arc<Table>> {
    // TODO: pin_init with empty KVec in a spinlock
}

impl Table {
    fn sum(&self) -> u64 {
        // TODO: lock, sum as u64
    }

    fn set(&self, i: usize, v: u32) -> Result {
        // TODO: lock, get_mut(i) or EINVAL, write v
    }
}`,
    tags: ['kernel', 'spinlock', 'kvec'],
  },
  {
    id: 'lx-ch16-c-064',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Self-Referential Work Item With pin_data',
    prompt: `Some kernel objects must not move once initialized. Define a struct Job that holds a Mutex<u32> named state and a usize id, and is meant to be heap-allocated and pinned. Write new(id: usize) -> Result<Arc<Job>> using #[pin_data], #[pin] on the mutex, and Arc::pin_init. Then write bump(self: &Arc<Job>) that locks state and increments it, demonstrating you operate through the pinned Arc without moving the Job.`,
    hints: [
      'Only the Mutex field needs #[pin]; the plain id is initialized by value.',
      'pin_init! mixes value fields (id) and in-place fields (state <- new_mutex!).',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Job {
    #[pin]
    state: Mutex<u32>,
    id: usize,
}

fn new(id: usize) -> Result<Arc<Job>> {
    Arc::pin_init(
        pin_init!(Job {
            state <- new_mutex!(0),
            id,
        }),
        GFP_KERNEL,
    )
}

impl Job {
    fn bump(self: &Arc<Job>) {
        let mut s = self.state.lock();
        *s += 1;
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Job {
    #[pin]
    state: Mutex<u32>,
    id: usize,
}

fn new(id: usize) -> Result<Arc<Job>> {
    // TODO: pin_init with state mutex 0 and id
}

impl Job {
    fn bump(self: &Arc<Job>) {
        // TODO: lock state and increment
    }
}`,
    tags: ['kernel', 'pin-init', 'arc'],
  },
  {
    id: 'lx-ch16-c-065',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Build A UserSlice Copy Helper',
    prompt: `Write a safe wrapper that copies from a user pointer. You are given extern "C" fn raw_copy_from_user(to: *mut u8, from: *const c_void, n: usize) -> usize returning the number of bytes NOT copied. Write copy_in(dst: &mut [u8], user: *const core::ffi::c_void) -> Result that copies dst.len() bytes from user into dst, returning EFAULT if any bytes were not copied. Include a SAFETY comment about the user pointer being validated by the C helper.`,
    hints: [
      'raw_copy_from_user returns 0 on full success; nonzero means a fault.',
      'Pass dst.as_mut_ptr() and dst.len(); compare the return to 0.',
    ],
    solution: `use kernel::prelude::*;
use kernel::error::code::EFAULT;
use core::ffi::c_void;

extern "C" {
    fn raw_copy_from_user(to: *mut u8, from: *const c_void, n: usize) -> usize;
}

fn copy_in(dst: &mut [u8], user: *const c_void) -> Result {
    let len = dst.len();
    // SAFETY: dst is valid for len writable bytes; raw_copy_from_user
    // validates the user pointer and copies at most len bytes.
    let not_copied = unsafe { raw_copy_from_user(dst.as_mut_ptr(), user, len) };
    if not_copied != 0 {
        return Err(EFAULT);
    }
    Ok(())
}`,
    starter: `use kernel::prelude::*;
use kernel::error::code::EFAULT;
use core::ffi::c_void;

extern "C" {
    fn raw_copy_from_user(to: *mut u8, from: *const c_void, n: usize) -> usize;
}

fn copy_in(dst: &mut [u8], user: *const c_void) -> Result {
    // TODO: copy dst.len() bytes, EFAULT if any remain uncopied
}`,
    tags: ['kernel', 'ffi', 'userspace'],
  },
  {
    id: 'lx-ch16-c-066',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Module Holding A Pinned Registration',
    prompt: `Combine the pieces: a module RegMod whose Module value owns an Arc<Driver>, where Driver holds a Mutex<u32> count initialized to 0. In init, build the Arc, lock and set count to 1, log "registered", and store the Arc in the returned RegMod. Define RegMod { _driver: Arc<Driver> }, Driver with #[pin_data], a new() constructor, and the full Module impl.`,
    hints: [
      'Storing the Arc in the Module value keeps the Driver alive for the module lifetime.',
      'Drop of the Module value (and thus the Arc) at unload tears everything down.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Driver {
    #[pin]
    count: Mutex<u32>,
}

impl Driver {
    fn new() -> Result<Arc<Driver>> {
        Arc::pin_init(
            pin_init!(Driver {
                count <- new_mutex!(0),
            }),
            GFP_KERNEL,
        )
    }
}

struct RegMod {
    _driver: Arc<Driver>,
}

impl kernel::Module for RegMod {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        let driver = Driver::new()?;
        {
            let mut c = driver.count.lock();
            *c = 1;
        }
        pr_info!("registered\\n");
        Ok(RegMod { _driver: driver })
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Driver {
    #[pin]
    count: Mutex<u32>,
}

impl Driver {
    fn new() -> Result<Arc<Driver>> {
        // TODO: pin_init count mutex at 0
    }
}

struct RegMod {
    _driver: Arc<Driver>,
}

impl kernel::Module for RegMod {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        // TODO: build driver, set count to 1, log, store Arc
    }
}`,
    tags: ['kernel', 'module', 'arc'],
  },
  {
    id: 'lx-ch16-c-067',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Implement TryFrom For A C Enum',
    prompt: `A C header exposes constants bindings::MODE_READ and bindings::MODE_WRITE as u32. Define a Rust enum Mode { Read, Write } and implement TryFrom<u32> for Mode, mapping the two constants and returning EINVAL for anything else. The error type is the kernel Error.`,
    hints: [
      'TryFrom<u32>::Error must be kernel::error::Error.',
      'Match the input against bindings::MODE_READ and bindings::MODE_WRITE.',
    ],
    solution: `use kernel::prelude::*;
use kernel::bindings;
use kernel::error::Error;
use kernel::error::code::EINVAL;
use core::convert::TryFrom;

enum Mode {
    Read,
    Write,
}

impl TryFrom<u32> for Mode {
    type Error = Error;

    fn try_from(v: u32) -> Result<Mode> {
        match v {
            bindings::MODE_READ => Ok(Mode::Read),
            bindings::MODE_WRITE => Ok(Mode::Write),
            _ => Err(EINVAL),
        }
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::bindings;
use kernel::error::Error;
use kernel::error::code::EINVAL;
use core::convert::TryFrom;

enum Mode {
    Read,
    Write,
}

impl TryFrom<u32> for Mode {
    type Error = Error;

    fn try_from(v: u32) -> Result<Mode> {
        // TODO: map MODE_READ/MODE_WRITE, else EINVAL
    }
}`,
    tags: ['kernel', 'bindings', 'tryfrom'],
  },
  {
    id: 'lx-ch16-c-068',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Safe Slice From A Raw C Buffer',
    prompt: `A C function gives you a buffer as a pair (ptr: *const u8, len: usize) that is valid and immutable for the duration of your function. Write read_sum(ptr: *const u8, len: usize) -> u64 that forms a &[u8] with core::slice::from_raw_parts and returns the sum of all bytes as u64. Include a SAFETY comment stating the exact invariants you rely on, and handle len == 0 / null safely by treating it as an empty slice.`,
    hints: [
      'from_raw_parts requires a non-null, aligned pointer valid for len reads, or len == 0 with a dangling-but-valid pointer.',
      'For len == 0 you may short-circuit and avoid forming a slice from a possibly-null pointer.',
    ],
    solution: `fn read_sum(ptr: *const u8, len: usize) -> u64 {
    if len == 0 {
        return 0;
    }
    // SAFETY: the caller guarantees ptr is non-null, properly aligned, and
    // points to len initialized bytes that stay valid and immutable for the
    // duration of this call.
    let slice = unsafe { core::slice::from_raw_parts(ptr, len) };
    let mut total = 0u64;
    for b in slice {
        total += *b as u64;
    }
    total
}`,
    starter: `fn read_sum(ptr: *const u8, len: usize) -> u64 {
    // TODO: handle len == 0, otherwise form a slice (with SAFETY) and sum
}`,
    tags: ['kernel', 'ffi', 'safety'],
  },
  {
    id: 'lx-ch16-c-069',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Generic Container Abstraction',
    prompt: `Write a reusable abstraction Slot<T> that holds an Arc<Mutex<Option<T>>>. Provide new() -> Result<Slot<T>> (empty), put(&self, value: T) which locks and stores Some(value), and take(&self) -> Option<T> which locks and removes the value with Option::take. T has no bounds beyond what Mutex requires. Use new_mutex! and Arc::pin_init.`,
    hints: [
      'The mutex protects an Option<T>; start it as None.',
      'take replaces the inner Option with None and returns the old value.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Inner<T> {
    #[pin]
    cell: Mutex<Option<T>>,
}

struct Slot<T> {
    inner: Arc<Inner<T>>,
}

impl<T> Slot<T> {
    fn new() -> Result<Slot<T>> {
        let inner = Arc::pin_init(
            pin_init!(Inner {
                cell <- new_mutex!(None),
            }),
            GFP_KERNEL,
        )?;
        Ok(Slot { inner })
    }

    fn put(&self, value: T) {
        let mut guard = self.inner.cell.lock();
        *guard = Some(value);
    }

    fn take(&self) -> Option<T> {
        let mut guard = self.inner.cell.lock();
        guard.take()
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};

#[pin_data]
struct Inner<T> {
    #[pin]
    cell: Mutex<Option<T>>,
}

struct Slot<T> {
    inner: Arc<Inner<T>>,
}

impl<T> Slot<T> {
    fn new() -> Result<Slot<T>> {
        // TODO: pin_init an Inner with cell = None, wrap in Slot
    }

    fn put(&self, value: T) {
        // TODO: lock and store Some(value)
    }

    fn take(&self) -> Option<T> {
        // TODO: lock and take the inner value
    }
}`,
    tags: ['kernel', 'generic', 'mutex'],
  },
  {
    id: 'lx-ch16-c-070',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full Driver: Init, Lock, FFI, Cleanup',
    prompt: `Assemble a complete small driver module. Module CharDrv owns an Arc<State> where State has a Mutex<u32> opens. In init: build the Arc, call extern "C" fn dev_register() -> i32 (negative errno on failure) wrapped with to_result and ?, log "char driver up", and store the Arc. On Drop of CharDrv, call extern "C" fn dev_unregister() and log "char driver down". Provide the module! macro, State with a new() constructor, the Module impl, and the Drop impl. Add SAFETY comments on both FFI calls.`,
    hints: [
      'init must propagate registration failure with ? before storing the Arc.',
      'Drop runs dev_unregister exactly once at module removal.',
    ],
    solution: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};
use kernel::error::to_result;

extern "C" {
    fn dev_register() -> i32;
    fn dev_unregister();
}

module! {
    type: CharDrv,
    name: "char_drv",
    author: "Rust for Linux",
    description: "A tiny Rust character driver",
    license: "GPL",
}

#[pin_data]
struct State {
    #[pin]
    opens: Mutex<u32>,
}

impl State {
    fn new() -> Result<Arc<State>> {
        Arc::pin_init(
            pin_init!(State {
                opens <- new_mutex!(0),
            }),
            GFP_KERNEL,
        )
    }
}

struct CharDrv {
    _state: Arc<State>,
}

impl kernel::Module for CharDrv {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        let state = State::new()?;
        // SAFETY: dev_register takes no arguments and is safe to call once
        // during module init.
        let ret = unsafe { dev_register() };
        to_result(ret)?;
        pr_info!("char driver up\\n");
        Ok(CharDrv { _state: state })
    }
}

impl Drop for CharDrv {
    fn drop(&mut self) {
        // SAFETY: a successful dev_register ran in init; we unregister once.
        unsafe { dev_unregister() };
        pr_info!("char driver down\\n");
    }
}`,
    starter: `use kernel::prelude::*;
use kernel::sync::{Arc, Mutex, new_mutex};
use kernel::error::to_result;

extern "C" {
    fn dev_register() -> i32;
    fn dev_unregister();
}

module! {
    type: CharDrv,
    name: "char_drv",
    author: "Rust for Linux",
    description: "A tiny Rust character driver",
    license: "GPL",
}

#[pin_data]
struct State {
    #[pin]
    opens: Mutex<u32>,
}

impl State {
    fn new() -> Result<Arc<State>> {
        // TODO: pin_init opens mutex at 0
    }
}

struct CharDrv {
    _state: Arc<State>,
}

impl kernel::Module for CharDrv {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        // TODO: build state, register via FFI + to_result + ?, log, store
    }
}

impl Drop for CharDrv {
    fn drop(&mut self) {
        // TODO: dev_unregister (unsafe + SAFETY), log "char driver down"
    }
}`,
    tags: ['kernel', 'driver', 'ffi'],
  },
]

export default problems
