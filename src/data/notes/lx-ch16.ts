import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-16',
  track: 'linux',
  chapter: 16,
  title: 'Rust for Linux',
  summary: `Rust for Linux brings a memory-safe, modern systems language into the most safety-critical C codebase on the planet. This chapter explains why the kernel community accepted a second language after decades of C-only orthodoxy, how the kernel crate and its safe abstractions wrap the raw C interfaces, and how you actually write, build, and reason about a Rust kernel module. The throughline is the safety model: Rust does not make the kernel automatically safe, but it draws a precise, auditable line between code the compiler proves correct and the small islands of unsafe glue that humans must justify. By the end you will know enough to read the in-tree Rust drivers, build a CONFIG_RUST kernel, and find your way to a first contribution.`,
  sections: [
    {
      heading: 'Why Rust in the kernel at all',
      body: `For most of its history Linux was C and assembly, by design and by conviction. So the first question a contributor must answer is not how Rust works in the kernel but why the maintainers, including Linus Torvalds, agreed to merge it at all in version 6.1 in late 2022. The answer is a class of bugs that C has never been able to eliminate and that dominate real-world kernel security advisories: memory-safety defects. Use-after-free, double-free, buffer overflows, uninitialized reads, data races, and integer-overflow-driven corruption are not exotic. Studies of the kernel CVE history, echoing similar studies at Microsoft and Google, consistently attribute roughly two thirds of serious vulnerabilities to memory unsafety. These are not bad-programmer bugs; they are bugs that the C language and its weak type system simply cannot catch at compile time.

Rust attacks exactly this class. Its *ownership* model gives every value a single owner and a well-defined lifetime, so the compiler knows when memory is freed and forbids any later use. Its *borrow checker* enforces that you may have either many shared, read-only references or exactly one mutable reference at a time, which eliminates data races and aliasing bugs structurally rather than by convention. Its strong, expressive type system lets an API encode invariants (a locked-only-accessible field, a reference-counted handle, a buffer with a known length) so that misuse is a compile error, not a runtime crash. Crucially, Rust delivers this with *zero-cost abstractions*: the safety checks run at compile time, so the generated machine code is competitive with hand-written C and there is no garbage collector and no mandatory runtime.

The point is not to rewrite Linux. The point is that *new* code, especially drivers from less experienced contributors and security-sensitive subsystems, can be written in a language where whole bug categories are unrepresentable. The why also includes ergonomics: a real package and build story, sum types and pattern matching, Result-based error handling, and modern tooling all reduce the friction that makes kernel C intimidating. The trade-off the community accepted is real: a second language to learn, a heavier toolchain, and a long incremental road. The bet is that fewer security holes and more maintainable drivers are worth it.`,
      code: [
        {
          lang: 'rust',
          src: `// The borrow checker rejects a use-after-free at COMPILE time.
// In C this would compile, run, and corrupt memory.
fn broken() {
    let handle;
    {
        let buffer = vec![1, 2, 3];
        handle = &buffer;     // borrow of a local
    }                         // buffer dropped here
    // let _ = handle[0];     // ERROR: borrowed value does not live long enough
    let _ = handle;
}

// Aliasing rules forbid a mutable + shared borrow at the same time,
// which is how data races become unrepresentable.
fn aliasing(v: &mut Vec<i32>) {
    let first = &v[0];        // shared borrow
    // v.push(4);             // ERROR: cannot borrow as mutable while borrowed
    let _ = first;
}`,
        },
      ],
    },
    {
      heading: 'The kernel crate and the prelude',
      body: `Rust in the kernel is not the ordinary Rust you write on a laptop. There is no operating system underneath, no standard library that talks to a libc, and no heap allocator handed to you for free. Kernel Rust is *no_std*: the giant std crate, which assumes a hosted environment with files, threads, and a global allocator, is unavailable. What you get instead is core (the language-intrinsic parts: Option, Result, iterators, slices, basic traits) and alloc (heap collections like Box, Vec, and Arc, once the kernel wires up an allocator), plus one special crate that is the heart of the whole project: the *kernel crate*.

The kernel crate is the single Rust library that every in-tree Rust module depends on. It lives in the kernel source tree under rust/kernel and it is where all the safe abstractions over kernel C live: synchronization primitives, the module machinery, error types, string and printing helpers, device and driver scaffolding, and much more. You do not add it to a Cargo.toml in the usual way; the kernel build system makes it available to your module automatically. Think of the kernel crate as kernel Rust's standard library, hand-built to be sound on top of the C kernel.

Because typing kernel::error::Result and kernel::prelude::Module everywhere would be miserable, the kernel crate exposes a *prelude*, exactly mirroring the idea of the std prelude in normal Rust. A single glob import pulls in the names you reach for constantly: the Result and Error types, the pr_info and related printing macros, the module! macro, common traits, and frequently used wrappers. A well-formed kernel module almost always starts with that one use line. The prelude is curated, not exhaustive; anything outside it you import explicitly from its submodule, which keeps the common case terse without hiding where less common items come from.`,
      code: [
        {
          lang: 'rust',
          src: `// Kernel Rust crates: no std. The top of nearly every module.
#![no_std]

// One glob brings in Result, Error, pr_info!, module!, common traits, etc.
use kernel::prelude::*;

// Less common items come from their submodules explicitly:
use kernel::sync::{Arc, Mutex};
use kernel::str::CString;

fn show_prelude_in_use() -> Result {
    // pr_info! comes from the prelude; Result is kernel::error::Result.
    pr_info!("hello from the kernel crate\\n");
    Ok(())
}`,
        },
      ],
    },
    {
      heading: 'Abstractions versus bindings',
      body: `The most important mental model in Rust for Linux is the two-layer split between *bindings* and *abstractions*. The kernel is millions of lines of C with thousands of functions and structs. Rust cannot call them directly; it needs declarations. So the build uses bindgen, an automated tool, to read selected C headers and emit raw Rust declarations for those functions and types. These live in a generated crate conventionally called bindings (you will see kernel::bindings). They are a mechanical, one-to-one translation: every function is declared extern "C" and is marked *unsafe*, every pointer stays a raw pointer, and none of Rust's safety guarantees apply. Calling a binding directly is exactly as dangerous as calling the C function, with none of the type-level help. Bindings are plumbing, not the API you are meant to use.

On top of the raw bindings sit the *abstractions*: hand-written, carefully reviewed safe Rust wrappers that expose the underlying C functionality through a sound interface. An abstraction takes a pile of unsafe binding calls and wraps them so that, if you obey Rust's ordinary type and borrow rules, you cannot misuse the C API. A reference-counted kernel object becomes an Arc-like type whose Drop implementation calls the C put function exactly once. A C spinlock becomes a Mutex-like guard type where the data is only reachable while the lock is held. A C linked list becomes an iterator. The unsafe code is concentrated inside the abstraction, written once by people who understand the C invariants, audited, and then reused safely by everyone else.

This division is the whole strategy. Bindings give reach; abstractions give safety. The promise of Rust for Linux is not that you avoid unsafe entirely, but that unsafe is pushed down into a thin, reviewed layer so that driver authors above it write ordinary safe Rust. The pitfall to avoid as a newcomer is reaching past the abstractions into kernel::bindings just to get something working. That is sometimes necessary when an abstraction does not yet exist, but it is a signal: either an abstraction is missing (an opportunity to contribute one) or you are about to write unsafe code that needs the same scrutiny as the abstractions themselves.`,
      code: [
        {
          lang: 'rust',
          src: `// LAYER 1: bindings (generated). Raw, unsafe, no guarantees.
// Conceptually bindgen emits something like this from the C headers:
mod bindings {
    extern "C" {
        // Every C function becomes an unsafe extern declaration.
        pub fn kmalloc(size: usize, flags: u32) -> *mut core::ffi::c_void;
        pub fn kfree(ptr: *mut core::ffi::c_void);
    }
}

// Calling a binding is as dangerous as the C call: must be in unsafe {}.
fn raw_use() {
    unsafe {
        let p = bindings::kmalloc(64, 0);
        // ... no length checking, no ownership, easy to leak or double-free ...
        bindings::kfree(p);
    }
}

// LAYER 2: an abstraction wraps the unsafe plumbing in a safe API.
// Users get RAII: allocation is checked, freeing happens in Drop, once.
struct SafeBuf(*mut core::ffi::c_void);
impl SafeBuf {
    fn new() -> Option<Self> {
        // SAFETY: kmalloc with these args returns NULL or a valid block.
        let p = unsafe { bindings::kmalloc(64, 0) };
        if p.is_null() { None } else { Some(SafeBuf(p)) }
    }
}
impl Drop for SafeBuf {
    fn drop(&mut self) {
        // SAFETY: self.0 came from kmalloc and is freed exactly once.
        unsafe { bindings::kfree(self.0) }
    }
}`,
        },
      ],
    },
    {
      heading: 'Writing a module: the Module trait and module! macro',
      body: `A loadable kernel module in C is glued to the kernel by a few magic symbols: an init function, an exit function, and a block of metadata (license, author, description) emitted by macros like MODULE_LICENSE. Rust mirrors this with two pieces working together: the *Module trait* and the *module! macro*.

The Module trait defines what it means to be a module. Its central method is an init function, named init by convention, that the kernel calls when your module loads. It receives a handle to the module itself and returns a Result of Self: on success you return your module's state object, and on failure you return an Error and the load is aborted cleanly. This is a beautiful fit for Rust. The value you return is stored by the runtime and kept alive for the lifetime of the module, and when the module is unloaded that value is *dropped*. Because Drop runs your destructors, cleanup is automatic and ordered: there is no separate, hand-written exit function listing every teardown step in reverse, which in C is a classic source of leaks and bugs. Whatever you acquired in init and stored in Self is released by Drop in the correct order for free.

The module! macro is the declarative glue. You give it the type that implements Module, the human metadata (name, author, description, license), and optionally module parameters, and it generates all the C-visible symbols and the registration boilerplate the kernel loader expects. The license string is not decoration: it must be a GPL-compatible identifier or the module is treated as tainting the kernel and is denied access to many GPL-only symbols, so getting it right matters. The macro is what lets the rest of your code be ordinary, idiomatic Rust while still producing a real .ko that insmod can load.

A subtle but important point: returning your state from init and relying on Drop means you should hold resources (registrations, allocations, registered devices) inside the Self value, not in global mutable statics. That keeps lifetimes tied to the module and makes cleanup automatic and panic-safe.`,
      code: [
        {
          lang: 'rust',
          src: `// SPDX-License-Identifier: GPL-2.0
//! A minimal Rust kernel module.
use kernel::prelude::*;

module! {
    type: RustMinimal,                 // the type that implements Module
    name: "rust_minimal",              // becomes the module name
    author: "Your Name",
    description: "A minimal Rust kernel module",
    license: "GPL",                    // must be GPL-compatible
}

struct RustMinimal {
    message: &'static str,
}

impl kernel::Module for RustMinimal {
    fn init(_module: &'static ThisModule) -> Result<Self> {
        pr_info!("rust_minimal: loaded\\n");
        // Acquire and store state; whatever lives in Self is owned here.
        Ok(RustMinimal { message: "on the heap of the kernel" })
    }
}

// No exit function needed: Drop runs automatically on rmmod.
impl Drop for RustMinimal {
    fn drop(&mut self) {
        pr_info!("rust_minimal: goodbye ({})\\n", self.message);
    }
}`,
        },
      ],
    },
    {
      heading: 'The safety model and unsafe boundaries',
      body: `Rust splits the world into *safe* and *unsafe* code, and understanding that split precisely is the single most valuable skill for kernel work. In safe Rust, the compiler guarantees there are no data races, no use-after-free, no out-of-bounds access, and no invalid values; if it compiles, those properties hold. But the kernel is full of operations the compiler cannot possibly verify: dereferencing a raw pointer the hardware handed you, calling a C function whose contract lives only in documentation, accessing a memory-mapped register. For these you write the unsafe keyword, which does not turn off the borrow checker but unlocks five extra superpowers (chiefly dereferencing raw pointers and calling unsafe functions) and shifts responsibility for correctness from the compiler to you.

The key idea is the *unsafe boundary*. Unsafe code is not forbidden; it is *quarantined*. The discipline the kernel enforces is that every unsafe block and every unsafe function comes with a written justification. The convention is a SAFETY comment directly above an unsafe block, explaining why the operation is actually sound: which invariants hold, why the pointer is valid, why no aliasing occurs. For an unsafe function (one whose callers must uphold a precondition), you instead write a Safety section in the doc comment stating exactly what the caller must guarantee. This turns the otherwise invisible obligations of C into explicit, reviewable, greppable text. A reviewer can audit every unsafe block in a change by reading its SAFETY comment, which is how the project keeps the trusted computing base small and inspectable.

The deeper principle is *soundness*: an abstraction is sound if no safe code using it can ever trigger undefined behavior, no matter how it is used. The author of an abstraction must guarantee soundness by construction, absorbing all the C-level invariants inside, so that the unsafe burden does not leak out to users. A common and serious pitfall is the unsound abstraction: a wrapper that looks safe (its public API has no unsafe) but can be driven into undefined behavior by ordinary safe calls, for example by handing out a reference that outlives the object or by not accounting for an interrupt that can run concurrently. Writing unsafe is easy; writing *sound* unsafe is the actual craft, and it is why abstractions get heavy review.`,
      code: [
        {
          lang: 'rust',
          src: `// An UNSAFE function: callers must uphold a documented precondition.
/// Reads a 32-bit value from a device register.
///
/// # Safety
///
/// \`addr\` must be a valid, mapped MMIO address that is 4-byte aligned
/// and safe to read with no side effects required by the caller.
unsafe fn read_reg(addr: *const u32) -> u32 {
    // SAFETY: the caller guarantees addr is valid and aligned (see above).
    unsafe { core::ptr::read_volatile(addr) }
}

// A safe wrapper that establishes the invariant, so its callers need no unsafe.
struct Register {
    addr: *const u32, // invariant: always a valid, aligned, mapped MMIO address
}

impl Register {
    fn get(&self) -> u32 {
        // SAFETY: self.addr upholds read_reg's precondition by the type's
        // invariant, which was established when the Register was created.
        unsafe { read_reg(self.addr) }
    }
}`,
        },
      ],
    },
    {
      heading: 'Error handling the Rust way',
      body: `Kernel C reports failure by returning negative errno integers (or NULL pointers, or, awkwardly, pointers encoded with ERR_PTR). The discipline is entirely manual: you must remember to check every return, and the dreaded goto-based cleanup ladder unwinds partial work by hand. Rust replaces this with its native error machinery, adapted to the kernel.

The foundation is the Error type and the kernel's Result alias. The kernel crate defines an Error that wraps a kernel errno and exposes named constants like ENOMEM, EINVAL, and EAGAIN. Functions that can fail return a Result, which is either Ok with a value or Err with an Error. You cannot accidentally ignore it: the type forces you to handle both arms. The kernel even defines Result with a default Ok type of the unit, so a function that returns nothing on success but can fail is written simply as returning Result, paralleling how an init returns Result of Self.

The ergonomic heart is the question-mark operator. Writing an expression followed by a question mark means: if it is Ok, unwrap the value and continue; if it is Err, return that error from the current function immediately. This collapses the entire C pattern of check-the-return-then-goto-cleanup into a single character, and because every value you hold has a Drop, the unwinding of already-acquired resources is automatic. There is no manual cleanup ladder. Allocation is a first-class example: fallible allocators return a Result or Option rather than aborting, so out-of-memory is a value you propagate with a question mark, never a silent crash. Note that kernel Rust generally forbids panicking and unwinding as an error strategy; panicking in the kernel is effectively a kernel oops, so you propagate errors as Result values rather than calling unwrap or expect on fallible operations in production paths. Converting a C return into a Rust Result is itself an abstraction: helpers translate a negative errno or an ERR_PTR into an Err, so that above the binding layer you work purely with Result.`,
      code: [
        {
          lang: 'rust',
          src: `use kernel::prelude::*;
use kernel::sync::Arc;

// Returns Result (default Ok = ()), so it can fail with a kernel errno.
fn configure(value: u32) -> Result {
    if value == 0 {
        return Err(EINVAL);     // named errno constant from the prelude
    }
    Ok(())
}

// The ? operator: propagate errors with one character, no goto ladder.
fn setup() -> Result {
    configure(42)?;             // on Err, returns it immediately

    // Fallible allocation returns a Result; OOM is a value, not a crash.
    let shared: Arc<u32> = Arc::try_new(7)?;
    pr_info!("configured, shared value = {}\\n", *shared);

    // Any resources acquired above are released by Drop if a later ? fails.
    Ok(())
}`,
        },
      ],
    },
    {
      heading: 'Current subsystems, building, and how to contribute',
      body: `Rust for Linux is deliberately incremental, so it helps to know where it actually stands. The core infrastructure (the kernel crate, the build integration, panic and allocation handling, synchronization, the module machinery) has been in mainline since 6.1. On top of that, real in-tree users have landed and keep growing: notable examples include the Asahi Linux Apple GPU driver work, the Nova driver effort for NVIDIA GPUs, a PHY/network driver, Android Binder, null block and PuzzleFS prototypes, and a steady stream of subsystem abstractions for things like platform and misc devices, DMA, registers, and time. The picture changes release to release; the authoritative source is the documentation in Documentation/rust within the kernel tree and the rust-for-linux project pages, which you should consult rather than relying on any fixed list, because abstractions that did not exist last cycle often exist now.

Building Rust requires turning on CONFIG_RUST in the kernel configuration, which only becomes selectable once the toolchain prerequisites are met. Those prerequisites are strict: a specific supported rustc version (the kernel pins a narrow range, since it relies on language and unstable features that move), the rust-src component, bindgen for the binding generation, and libclang for bindgen to parse the C headers. The kernel ships a helper, rustavailable, that checks all of this and tells you precisely what is missing; running it is the first step. Once CONFIG_RUST is set you can also enable specific Rust sample modules and drivers, and the ordinary make build produces .ko files just as for C modules. A useful habit is to generate the rust-project.json with the provided make target so that rust-analyzer gives you real IDE support against the kernel crate.

Contributing follows kernel norms with a Rust flavor. Read Documentation/rust first; it is short and current. Start by building a CONFIG_RUST kernel and loading the sample modules, then reading the source of an existing abstraction to absorb the SAFETY-comment and soundness style. Good entry points are documentation fixes, filling gaps in abstractions, or adding a missing safe wrapper that you needed and had to reach into bindings for. Development happens on mailing lists with patches sent via git send-email, every patch ends with a Signed-off-by line per the Developer Certificate of Origin, and Rust patches additionally get scrutinized for soundness, so expect review to focus hard on whether your unsafe is justified. The community is welcoming to newcomers but uncompromising on soundness, which is exactly the standard that makes the whole effort worthwhile.`,
      code: [
        {
          lang: 'rust',
          src: `// --- Shell steps to build a Rust-enabled kernel (shown as comments) ---
//
// 1. Check the toolchain is satisfied; it names anything missing:
//      make LLVM=1 rustavailable
//
// 2. Configure: enable Rust and the samples (or use menuconfig):
//      make LLVM=1 menuconfig    # set CONFIG_RUST=y, pick sample modules
//
// 3. Build the kernel and modules as usual; .ko files are produced:
//      make LLVM=1 -j$(nproc)
//
// 4. (Optional) IDE support via rust-analyzer:
//      make LLVM=1 rust-analyzer   # generates rust-project.json
//
// 5. Load a built sample module and watch the log:
//      sudo insmod samples/rust/rust_minimal.ko
//      sudo dmesg | tail
//      sudo rmmod rust_minimal     # Drop runs the cleanup

// Every patch you send must carry a sign-off line, e.g.:
//   Signed-off-by: Your Name <you@example.com>
// Send with: git send-email --to=rust-for-linux@vger.kernel.org *.patch
fn _doc_only() {}`,
        },
      ],
    },
  ],
  takeaways: [
    'Rust was merged into mainline (6.1, late 2022) to attack memory-safety bugs, which account for roughly two thirds of serious kernel vulnerabilities; ownership, borrow checking, and a strong type system make whole bug classes unrepresentable at zero runtime cost.',
    'Kernel Rust is no_std: you get core and alloc plus the kernel crate, which is the project-built standard library holding all the safe abstractions; the prelude glob import gives you Result, Error, pr_info!, module!, and common traits.',
    'Bindings are bindgen-generated, raw, unsafe one-to-one C declarations (kernel::bindings); abstractions are hand-written, reviewed safe wrappers built on top of them. Reach for abstractions, not bindings; a missing abstraction is a contribution opportunity.',
    'A module implements the Module trait (an init returning Result of Self) and is declared with the module! macro; state lives in the returned Self value and is released automatically by Drop on rmmod, so there is no manual exit/cleanup function.',
    'unsafe does not disable the borrow checker; it unlocks raw-pointer and unsafe-call powers and shifts correctness to you. Every unsafe block needs a SAFETY comment, and every unsafe function needs a documented Safety precondition.',
    'Soundness is the real goal: an abstraction is sound only if no safe code can ever trigger undefined behavior through it; the craft is writing sound unsafe, which is why abstractions get heavy review.',
    'Error handling uses Result and a kernel Error wrapping an errno (ENOMEM, EINVAL, ...); the ? operator replaces the C check-then-goto ladder, Drop handles unwinding, and allocation is fallible (try_new) rather than panicking.',
    'Building needs CONFIG_RUST plus a pinned rustc, rust-src, bindgen, and libclang; run make rustavailable first, and use make rust-analyzer for IDE support against the kernel crate.',
    'Real in-tree users exist and keep growing (Apple GPU/Asahi, Nova for NVIDIA, Binder, PHY/network, null block); read Documentation/rust for the current state, follow kernel patch/sign-off norms, and expect review to focus on soundness.',
  ],
  cheatsheet: [
    { label: '#![no_std]', value: 'Kernel Rust has no std; only core, alloc, and the kernel crate are available' },
    { label: 'use kernel::prelude::*', value: 'Brings in Result, Error, pr_info!, module!, and common traits at once' },
    { label: 'kernel crate (rust/kernel)', value: 'Project-built standard library holding all safe abstractions' },
    { label: 'kernel::bindings', value: 'bindgen-generated raw, unsafe C declarations; plumbing, not the public API' },
    { label: 'module! { type, name, license, ... }', value: 'Macro emitting the C-visible glue and module metadata' },
    { label: 'impl kernel::Module', value: 'Implement init(&ThisModule) -> Result<Self>; state lives in Self' },
    { label: 'license: "GPL"', value: 'Must be GPL-compatible or the module taints and loses GPL-only symbols' },
    { label: 'impl Drop', value: 'Automatic teardown on rmmod; replaces a manual C exit function' },
    { label: 'unsafe { ... } + // SAFETY:', value: 'Quarantined operation with a written justification of why it is sound' },
    { label: '# Safety doc section', value: 'Precondition an unsafe fn requires its caller to uphold' },
    { label: 'Result / Err(EINVAL)', value: 'Native error handling over kernel errnos; default Ok type is ()' },
    { label: '? operator', value: 'Propagate Err immediately; Drop unwinds acquired resources, no goto ladder' },
    { label: 'Arc::try_new / fallible alloc', value: 'Allocation returns Result/Option; OOM is a value, never a panic' },
    { label: 'make rustavailable / CONFIG_RUST', value: 'Verify the pinned toolchain, then enable Rust in the kernel config' },
  ],
}

export default note
