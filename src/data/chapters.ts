// chapters.ts — metadata for the Learn hub's tracks: the 20 chapters of
// "The Rust Programming Language", a 16-topic Linux kernel curriculum, and a
// 15-topic DSA-in-Rust curriculum. `coding` / `thinking` are the bundled
// problem counts (used for collapsed accordion headers without loading
// content). Rust/Linux topics target 70 / 30; DSA topics are 30 coding
// (10 easy + 10 medium + 10 hard) plus 12 conceptual "thinking"
// problems spanning intro to hard.

import type { LearnTrack } from '../types'

export interface ChapterMeta {
  num: number
  title: string
  blurb: string
  coding: number
  thinking: number
}

export const RUST_CHAPTERS: ChapterMeta[] = [
  { num: 1, title: 'Getting Started', blurb: 'cargo, rustc & hello world', coding: 70, thinking: 30 },
  { num: 2, title: 'Programming a Guessing Game', blurb: 'input, parsing, match & loops', coding: 70, thinking: 30 },
  { num: 3, title: 'Common Programming Concepts', blurb: 'variables, types, functions, control flow', coding: 70, thinking: 30 },
  { num: 4, title: 'Understanding Ownership', blurb: 'move, borrow, references & slices', coding: 70, thinking: 30 },
  { num: 5, title: 'Using Structs', blurb: 'structs, methods & associated functions', coding: 70, thinking: 30 },
  { num: 6, title: 'Enums and Pattern Matching', blurb: 'enums, Option, match & if let', coding: 70, thinking: 30 },
  { num: 7, title: 'Packages, Crates, and Modules', blurb: 'the module tree, paths & visibility', coding: 70, thinking: 30 },
  { num: 8, title: 'Common Collections', blurb: 'Vec, String & HashMap', coding: 70, thinking: 30 },
  { num: 9, title: 'Error Handling', blurb: 'panic!, Result & the ? operator', coding: 70, thinking: 30 },
  { num: 10, title: 'Generics, Traits, and Lifetimes', blurb: 'generic code, traits & lifetimes', coding: 70, thinking: 30 },
  { num: 11, title: 'Writing Automated Tests', blurb: 'assertions, test organization & more', coding: 70, thinking: 30 },
  { num: 12, title: 'An I/O Project: A CLI Program', blurb: 'args, files, stderr & refactoring', coding: 70, thinking: 30 },
  { num: 13, title: 'Iterators and Closures', blurb: 'closures, the Iterator trait & adaptors', coding: 70, thinking: 30 },
  { num: 14, title: 'More about Cargo and Crates.io', blurb: 'profiles, docs, workspaces & publishing', coding: 70, thinking: 30 },
  { num: 15, title: 'Smart Pointers', blurb: 'Box, Rc, RefCell, Deref & Drop', coding: 70, thinking: 30 },
  { num: 16, title: 'Fearless Concurrency', blurb: 'threads, channels, Mutex & Arc', coding: 70, thinking: 30 },
  { num: 17, title: 'Object-Oriented Features', blurb: 'trait objects & the state pattern', coding: 70, thinking: 30 },
  { num: 18, title: 'Patterns and Matching', blurb: 'where patterns live & all the syntax', coding: 70, thinking: 30 },
  { num: 19, title: 'Advanced Features', blurb: 'unsafe, advanced traits/types & macros', coding: 70, thinking: 30 },
  { num: 20, title: 'A Multithreaded Web Server', blurb: 'TCP, threads & a thread pool', coding: 70, thinking: 30 },
]

export const LINUX_CHAPTERS: ChapterMeta[] = [
  { num: 1, title: 'C for the Kernel', blurb: 'pointers, structs, bits — the C kernels use', coding: 70, thinking: 30 },
  { num: 2, title: 'The Linux Programming Environment', blurb: 'compiler, make, gdb & binutils', coding: 70, thinking: 30 },
  { num: 3, title: 'Processes, Threads & System Calls', blurb: 'fork/exec, the syscall boundary', coding: 70, thinking: 30 },
  { num: 4, title: 'Files, I/O & Permissions', blurb: 'fds, the VFS, /proc & /sys', coding: 70, thinking: 30 },
  { num: 5, title: 'Building & Booting the Kernel', blurb: 'Kconfig, Kbuild & QEMU', coding: 70, thinking: 30 },
  { num: 6, title: 'Loadable Kernel Modules', blurb: 'init/exit, printk, params & Kbuild', coding: 70, thinking: 30 },
  { num: 7, title: 'Kernel Data Structures', blurb: 'list_head, container_of & rbtrees', coding: 70, thinking: 30 },
  { num: 8, title: 'Character Device Drivers', blurb: 'file_operations, copy_to/from_user, ioctl', coding: 70, thinking: 30 },
  { num: 9, title: 'Kernel Memory Management', blurb: 'kmalloc, GFP flags, slab & pages', coding: 70, thinking: 30 },
  { num: 10, title: 'Concurrency & Locking', blurb: 'spinlocks, mutexes, atomics & RCU', coding: 70, thinking: 30 },
  { num: 11, title: 'Interrupts & Deferred Work', blurb: 'IRQs, top/bottom halves & workqueues', coding: 70, thinking: 30 },
  { num: 12, title: 'Time, Timers & Delays', blurb: 'jiffies, timers, hrtimers & delays', coding: 70, thinking: 30 },
  { num: 13, title: 'The Device Model & sysfs', blurb: 'kobjects, buses, probe & device tree', coding: 70, thinking: 30 },
  { num: 14, title: 'Debugging & Tracing', blurb: 'printk, oops, ftrace & kprobes', coding: 70, thinking: 30 },
  { num: 15, title: 'Kernel Contribution Workflow', blurb: 'checkpatch, patches & maintainers', coding: 70, thinking: 30 },
  { num: 16, title: 'Rust for Linux', blurb: 'the kernel crate, modules in Rust & contributing', coding: 70, thinking: 30 },
]

// DSA-in-Rust: 15 topics, each with 30 coding problems (10 easy / 10 medium /
// 10 hard). Solutions are complete, runnable Rust programs with assert-based
// tests, so each opens in the Rust Playground.
export const DSA_CHAPTERS: ChapterMeta[] = [
  { num: 1, title: 'Arrays & Hashing', blurb: 'traversal, prefix sums & frequency maps', coding: 30, thinking: 12 },
  { num: 2, title: 'Two Pointers', blurb: 'opposite ends & fast/slow scanning', coding: 30, thinking: 12 },
  { num: 3, title: 'Sliding Window', blurb: 'fixed & dynamic windows over sequences', coding: 30, thinking: 12 },
  { num: 4, title: 'Stack & Queue', blurb: 'LIFO/FIFO, monotonic stacks & deques', coding: 30, thinking: 12 },
  { num: 5, title: 'Binary Search', blurb: 'on sorted arrays & on the answer', coding: 30, thinking: 12 },
  { num: 6, title: 'Linked List', blurb: 'reversal, cycles, merging & dummy nodes', coding: 30, thinking: 12 },
  { num: 7, title: 'Trees & BST', blurb: 'DFS/BFS, traversals & binary search trees', coding: 30, thinking: 12 },
  { num: 8, title: 'Tries', blurb: 'prefix trees for words & autocomplete', coding: 30, thinking: 12 },
  { num: 9, title: 'Heap / Priority Queue', blurb: 'binary heaps, top-k & scheduling', coding: 30, thinking: 12 },
  { num: 10, title: 'Backtracking', blurb: 'subsets, permutations & constraint search', coding: 30, thinking: 12 },
  { num: 11, title: 'Graphs', blurb: 'BFS/DFS, topological sort & union-find', coding: 30, thinking: 12 },
  { num: 12, title: 'Dynamic Programming', blurb: 'memoization, tabulation & 1D/2D DP', coding: 30, thinking: 12 },
  { num: 13, title: 'Greedy & Intervals', blurb: 'exchange arguments & interval scheduling', coding: 30, thinking: 12 },
  { num: 14, title: 'Bit Manipulation', blurb: 'masks, XOR tricks & bit counting', coding: 30, thinking: 12 },
  { num: 15, title: 'Math & Number Theory', blurb: 'gcd, primes & modular arithmetic', coding: 30, thinking: 12 },
]

export const CHAPTERS = RUST_CHAPTERS // back-compat alias

export const chaptersFor = (track: LearnTrack): ChapterMeta[] =>
  track === 'linux' ? LINUX_CHAPTERS : track === 'dsa' ? DSA_CHAPTERS : RUST_CHAPTERS
export const chapterMeta = (track: LearnTrack, n: number): ChapterMeta | undefined => chaptersFor(track).find((c) => c.num === n)
export const chapterTitle = (track: LearnTrack, n: number): string => chapterMeta(track, n)?.title ?? `Chapter ${n}`
