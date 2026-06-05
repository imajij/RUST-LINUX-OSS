// chapters.ts — metadata for the 20 chapters of "The Rust Programming Language".
// `coding` / `thinking` are the bundled problem counts per chapter (used for the
// collapsed accordion headers without loading the content). Targets are 70 / 30;
// the real numbers are baked in after generation.

export interface ChapterMeta {
  num: number
  title: string
  blurb: string
  coding: number
  thinking: number
}

export const CHAPTERS: ChapterMeta[] = [
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

export const chapterMeta = (n: number): ChapterMeta | undefined => CHAPTERS.find((c) => c.num === n)
export const chapterTitle = (n: number): string => chapterMeta(n)?.title ?? `Chapter ${n}`
