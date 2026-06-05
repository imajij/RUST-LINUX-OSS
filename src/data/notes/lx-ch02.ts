import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-02',
  track: 'linux',
  chapter: 2,
  title: 'The Linux Programming Environment',
  summary: `This chapter is the toolbox you carry into every C and kernel project: the compiler and the four stages it runs, the build systems (make and the kernel's Kbuild) that orchestrate it, and the inspection tools (gdb, objdump, nm, readelf) that let you see what the compiler actually produced. It also covers the conventions that glue Unix together - man page sections, shell exit codes, the difference between static and dynamic linking, and how translation units and headers really work. Mastering this layer is what separates someone who can edit code from someone who can debug, build, and reason about a real system, which is exactly what open-source review demands.`,
  sections: [
    {
      heading: 'The compiler and its four stages',
      body: `When you run a single command like cc on a source file, the compiler driver (gcc or clang) silently runs a pipeline of four distinct stages. Understanding them matters because every confusing build error lives in exactly one stage, and naming the stage tells you which tool to reach for.

### 1. Preprocessing
The C preprocessor (cpp) is a text-substitution engine that runs before any C is understood. It expands #include by literally pasting the named header's text in place, substitutes #define macros, and resolves conditional compilation such as #ifdef. Its output is still C source - just bigger and self-contained, with no directives left. You can stop here with the -E flag, and you should the moment you suspect a macro is misbehaving: the expanded text never lies.

### 2. Compilation to assembly
The compiler proper turns preprocessed C into assembly for your target CPU. This is where type checking, optimization, and code generation happen, so almost all warnings and "real" compiler errors come from this stage. Stopping here with -S gives you a .s file of human-readable assembly, which is the honest answer to "what did the optimizer do to my loop".

### 3. Assembly to object code
The assembler (as) translates the .s assembly into a relocatable object file, a .o containing machine code plus a symbol table and relocation entries. It is not yet runnable: addresses of functions defined elsewhere are left as unresolved placeholders. The -c flag stops here, producing one .o per source file - the unit that make caches and that the linker later stitches together.

### 4. Linking
The linker (ld, invoked through the compiler driver) combines all the .o files plus libraries into a single executable or shared library. It resolves every cross-file symbol reference, lays out the final memory image, and fills in the relocations the assembler left blank. Two classic errors are born here, not earlier: "undefined reference" means a symbol was declared but never defined or its object/library was omitted, and "multiple definition" means a symbol was defined in more than one translation unit.

> Pitfall: a missing function prototype is a compile-stage warning, but a missing definition is a link-stage error. They feel similar but live in different stages and need different fixes - one needs the right header, the other needs the right .o or -l flag. Always pass -Wall -Wextra so the compiler stage surfaces problems before they mutate into cryptic linker noise.`,
      code: [
        {
          lang: 'c',
          src: `// hello.c
#include <stdio.h>

#define GREETING "Hello, kernel hacker"

int main(void)
{
        puts(GREETING);
        return 0;
}

// Drive each stage explicitly (commands you type in the shell):
//   gcc -E hello.c -o hello.i     # 1. preprocess only  -> expanded C
//   gcc -S hello.c -o hello.s     # 2. compile to assembly
//   gcc -c hello.c -o hello.o     # 3. assemble to object file
//   gcc hello.o   -o hello        # 4. link into an executable
//
// Or do all four at once, with warnings on:
//   gcc -Wall -Wextra -O2 hello.c -o hello`
        }
      ]
    },
    {
      heading: 'Make, Makefiles, and the kernel Kbuild system',
      body: `make exists to answer one question efficiently: given a graph of files, which ones must be rebuilt and in what order. It does this with *rules*. A rule names a **target** (the file to produce), its **prerequisites** (the files it depends on), and a **recipe** (the shell commands to build it). make rebuilds a target only when a prerequisite is newer than the target, judged by modification timestamps. This timestamp model is the source of both its speed and its most infamous bug.

A few mechanics you must know to read real Makefiles:

- Recipe lines must be indented with a literal **TAB**, never spaces. A space-indented recipe gives the maddening "missing separator" error. This is the single most common Makefile mistake.
- **Variables** are assigned with name = value and expanded with parentheses around the name. CC, CFLAGS, and LDFLAGS are conventional and respected by built-in rules.
- **Automatic variables** stand in for parts of the current rule: the target name, the first prerequisite, and the full prerequisite list each have a one-character spelling. They let one pattern rule build many files.
- **Pattern rules** with a percent sign teach make to turn any .c into the matching .o, so you do not write a rule per file.
- **Phony targets** like clean and all name actions, not files. Declare them with the special .PHONY target so make never confuses them with a real file of the same name.

### Kbuild: the kernel's make layer
The Linux kernel does not use ordinary Makefiles directly; it uses **Kbuild**, a framework built on top of make. As a contributor you rarely write recipes. Instead you append your object to a goal list in the directory's Makefile. The line obj-y plus equals my_driver.o means "always build my_driver.o into the kernel", while obj-m means "build it as a loadable module", and obj plus the name of a config symbol lets the build be controlled by kernel configuration. Kbuild then discovers everything, handles dependencies, and applies the kernel's own flags for you.

This indirection is deliberate: a single declarative line per file keeps thousands of Makefiles consistent and lets a config option flip a feature between built-in, module, and absent with no recipe changes. When you read a kernel Makefile and see only obj-* assignments, that is the system working as intended.

> Pitfall: make's timestamp model does not understand that editing a header should rebuild every .c that includes it. Real build systems (and Kbuild) solve this with auto-generated dependency files that list each object's headers as prerequisites. A hand-written Makefile that omits header dependencies will happily skip rebuilds and leave you debugging a binary that no longer matches your source - the classic "it works after make clean" symptom.`,
      code: [
        {
          lang: 'c',
          src: `# Makefile -- recipe lines below MUST start with a real TAB
CC      = gcc
CFLAGS  = -Wall -Wextra -O2 -g
OBJS    = main.o parse.o util.o

# Default target (first rule): link the program.
app: $(OBJS)
	$(CC) $(CFLAGS) -o $@ $(OBJS)

# Pattern rule: build any .o from its .c.
#   $@ = target, $< = first prerequisite, $^ = all prerequisites
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

.PHONY: clean
clean:
	rm -f app $(OBJS)

# --- A kernel Kbuild Makefile is far shorter ---
# obj-m            += my_driver.o        # build as a loadable module
# obj-y            += core.o             # always built into the kernel
# obj-$(CONFIG_FOO) += foo.o             # built iff CONFIG_FOO is set
# my_driver-objs   := probe.o irq.o      # combine several .o into one module`
        }
      ]
    },
    {
      heading: 'Debugging with gdb',
      body: `gdb is the GNU debugger: it runs your program under its control so you can stop execution, inspect state, and step through code line by line. To get anything useful, you must compile with debug information by passing -g, which embeds the mapping from machine instructions back to source lines and variable names. Without -g, gdb still works but shows you raw addresses instead of names - technically usable, practically miserable.

The core workflow is a small vocabulary you will use forever:

- **break** sets a breakpoint at a function or file-and-line, pausing execution when reached. Conditional breakpoints (break if some condition) are invaluable for catching the one iteration that misbehaves.
- **run** starts the program; pass arguments after it just as on the command line.
- **next** executes the current line and stops on the next one, stepping *over* function calls. **step** is the same but steps *into* calls. Confusing the two wastes time, so internalize: next stays at this level, step descends.
- **continue** resumes until the next breakpoint.
- **print** evaluates a C expression in the current context and shows the result; **backtrace** shows the full call stack, which is the first thing you look at when a program crashes.
- **frame** moves up or down the call stack so print resolves variables in a caller's scope.

### Post-mortem and attaching
gdb does more than run programs forward. When a process crashes, the kernel can write a **core dump** - a snapshot of its memory at the moment of death. Loading the executable together with that core file lets you open backtrace on the corpse and see exactly where and why it died, without reproducing the crash live. You can also attach to an already-running process by PID, which is how you debug a hung daemon. For the kernel itself there is no userspace gdb session; kernel debugging uses crash dumps, the kgdb stub over a serial or network link, or printk tracing.

> Pitfall: optimization (-O2 and above) reorders and inlines code, so stepping can jump around unexpectedly and some variables read as "optimized out". When you need to single-step cleanly, build that translation unit with -O0 -g. Conversely, debugging the exact optimized build a user hit sometimes requires accepting the jumpiness - know which situation you are in.`,
      code: [
        {
          lang: 'c',
          src: `// buggy.c -- compile with debug info, no optimization:
//   gcc -O0 -g buggy.c -o buggy
//   gdb ./buggy
#include <stdio.h>

static long sum_to(int n)
{
        long acc = 0;
        for (int i = 1; i <= n; i++)
                acc += i;       /* break here to watch acc grow */
        return acc;
}

int main(void)
{
        printf("%ld\\n", sum_to(100));
        return 0;
}

// Inside gdb (the commands you type at the (gdb) prompt):
//   break sum_to            set a breakpoint on the function
//   break buggy.c:9         break on a specific source line
//   run                     start the program
//   next                    step over the current line
//   step                    step into a called function
//   print acc               evaluate a C expression now
//   backtrace               show the call stack
//   continue                resume until the next breakpoint
//
// Post-mortem on a crash that left core.1234:
//   gdb ./buggy core.1234   then: backtrace
// Attach to a running process:
//   gdb -p 1234`
        }
      ]
    },
    {
      heading: 'Inspecting binaries: objdump, nm, and readelf',
      body: `Compiled output is not opaque. Three tools let you read object files, libraries, and executables directly - an essential skill when a binary behaves differently from what the source seems to say, or when you are reverse-engineering an ABI for a contribution.

### nm: list symbols
nm prints the **symbol table**: every name a file defines or references, each tagged with a single-letter type. Uppercase letters mean global (externally visible) symbols, lowercase mean local. The letter T marks a symbol in the text (code) section, D marks initialized data, B marks zero-initialized data in BSS, and the crucial one, **U**, marks an *undefined* symbol the file needs from somewhere else. When you hit an "undefined reference" link error, nm on each object tells you who provides the symbol and who only consumes it.

### objdump: disassemble and dump sections
objdump shows the contents of object files. Its headline use is disassembly: turning machine code back into assembly annotated with the original source when debug info is present. This is how you confirm what the optimizer truly emitted, study a calling convention, or understand a crash address. objdump also lists section headers and relocations, bridging the gap between "my C" and "the bytes the CPU runs".

### readelf: the ELF structure itself
Linux executables, objects, and shared libraries use the **ELF** format (Executable and Linkable Format). readelf is the authoritative tool for ELF metadata: the header, the section table, the program headers the loader uses, the dynamic linking table, and the symbol tables. When you need to know which shared libraries a binary asks for, what its entry point is, or whether it is position-independent, readelf is precise where other tools approximate.

The natural division of labor: reach for nm to answer "is this symbol defined here", objdump to answer "what instructions did the compiler generate", and readelf to answer "how is this ELF file structured and what does the loader see".

> Pitfall: symbol names in C++ and some other contexts are **mangled** - encoded with type information into unreadable strings. Pass the demangle flag to nm and objdump (or pipe through c++filt) to get human-readable names. For C this rarely bites, but kernel and mixed codebases will surprise you.`,
      code: [
        {
          lang: 'c',
          src: `// lib.c
int counter;                 /* global, uninitialized -> BSS */
int answer = 42;             /* global, initialized   -> data */
static int hidden = 7;       /* local  (lowercase in nm)     */

int next_id(void)            /* global function -> text       */
{
        extern int external_seed(void);   /* defined elsewhere */
        return external_seed() + counter++;
}

// Build the object, then inspect it (shell commands):
//   gcc -c lib.c -o lib.o
//
//   nm lib.o
//     T next_id        <- global text symbol defined here
//     B counter        <- global BSS
//     D answer         <- global data
//     U external_seed  <- UNDEFINED: needed from another file
//
//   objdump -d lib.o          # disassemble the code
//   objdump -S lib.o          # interleave source (needs -g)
//   readelf -h lib.o          # ELF header
//   readelf -S lib.o          # section headers
//   readelf -d ./app          # dynamic section: needed libraries`
        }
      ]
    },
    {
      heading: 'Man pages, the shell, and exit codes',
      body: `### Man page sections
The manual is divided into numbered **sections**, and the number disambiguates names that collide. Section 1 is user commands, section 2 is system calls (the kernel interface), section 3 is library functions, section 5 is file formats and configuration, section 7 is overviews and conventions, and section 8 is administration commands. This matters constantly: a request for printf without a section may show the shell command, but the C library function lives in section 3, and the open system call in section 2 is documented separately from any program named open. Always specify the section when a name is ambiguous, and use apropos to search summaries when you do not know the exact page name.

### The shell and exit codes
Every process returns a small integer to its parent when it terminates: the **exit status**. By universal Unix convention **0 means success** and any non-zero value means failure, with specific non-zero codes carrying program-specific meaning. This convention is not cosmetic - it is the load-bearing contract that lets programs be composed.

The shell exposes the most recent exit status in a special parameter (question-mark), and builds its control flow on it. The logical-and operator runs the next command only if the previous one succeeded (returned 0); the logical-or operator runs the next only if the previous failed. An if statement in the shell tests an exit status, not a boolean value. This is why a script must propagate failures faithfully: a function that returns 0 on error silently breaks every caller's error handling.

Some codes are conventional enough to rely on: a program killed by a signal reports 128 plus the signal number (so an interrupt from Control-C shows up as 130), and the shell uses 127 for "command not found" and 126 for "found but not executable". In a C program, the value you give to return from main or pass to the exit function becomes this status, and the standard provides named constants for the success and failure cases so you never hardcode the numbers.

> Pitfall: in a pipeline, the shell normally reports only the *last* command's exit status, so a failure in the middle of a pipe is invisible by default. Production scripts enable strict modes (errexit, nounset, and pipefail) precisely so that a hidden mid-pipe failure aborts the script instead of corrupting later steps.`,
      code: [
        {
          lang: 'c',
          src: `// status.c -- main's return value becomes the process exit status.
#include <stdlib.h>     /* EXIT_SUCCESS (0) and EXIT_FAILURE (nonzero) */
#include <stdio.h>

int main(int argc, char **argv)
{
        if (argc < 2) {
                fprintf(stderr, "usage: %s FILE\\n", argv[0]);
                return EXIT_FAILURE;     /* nonzero -> shell sees failure */
        }
        return EXIT_SUCCESS;             /* 0 -> shell sees success */
}

// How the shell reads that status (commands you type):
//   ./status            ; echo $?     -> prints 1 (failure)
//   ./status file.txt   ; echo $?     -> prints 0 (success)
//
//   make && ./status f  # run ./status ONLY if make succeeded
//   grep foo log || echo "not found"  # run echo ONLY if grep failed
//
//   man 2 open          # the open() SYSTEM CALL
//   man 3 printf        # the printf() LIBRARY function
//   man 5 passwd        # the /etc/passwd FILE FORMAT
//   apropos socket      # search summaries for 'socket'`
        }
      ]
    },
    {
      heading: 'Static vs dynamic linking',
      body: `Once compilation produces object files, the linker can fold library code into your program in two fundamentally different ways, and the choice has real consequences for size, startup, updates, and deployment.

### Static linking
With static linking, the linker copies the machine code of every library function you use directly into your executable, pulled from a static library archive (a .a file, essentially a bundle of .o files). The result is **self-contained**: it carries everything it needs and runs on a machine that has none of those libraries installed. The costs are size (every program duplicates the library code on disk and in memory) and updates - if a security bug is fixed in the library, every statically linked program must be *rebuilt and redistributed* to get the fix, because the old code is baked in.

### Dynamic linking
With dynamic linking, the executable instead records only the *names* of the shared libraries it needs (.so files on Linux) plus an unresolved reference for each symbol. At program startup the **dynamic linker/loader** maps those shared libraries into memory and resolves the references - this is the runtime continuation of the linking you began at build time. Multiple running programs share a single in-memory copy of each library, executables stay small, and a library security fix benefits every program the instant the shared object is updated, with no recompilation. The price is a dependency at runtime: the program fails to start if a needed .so is missing or incompatible, the classic "error while loading shared libraries" message, and there is a small startup cost to do the resolution.

Dynamic linking is the Linux default for good reason, and it is why a tool like the dependency lister exists to show which shared objects a binary will demand at load time. Static linking earns its place for self-contained tools, tightly controlled deployments, containers aiming for a minimal image, and early-boot or rescue binaries that must run before the normal library set is available.

> Pitfall: a binary that links fine on your machine can die at startup on another with a missing-library error - because dynamic linking deferred the dependency to runtime. And mixing incompatible library versions (the so-called dependency hell) is exactly the failure mode static linking trades size to avoid. Knowing which model a binary uses tells you which class of bug you are looking at.`,
      code: [
        {
          lang: 'c',
          src: `// link_demo.c
#include <math.h>
#include <stdio.h>

int main(void)
{
        printf("%f\\n", sqrt(2.0));   /* sqrt lives in the math library */
        return 0;
}

// Dynamic link against the shared math library (default model):
//   gcc link_demo.c -lm -o dyn
//   readelf -d ./dyn | grep NEEDED   # lists the .so files required
//   ldd ./dyn                        # shows resolved shared libraries
//
// Static link: copy the library code straight into the binary:
//   gcc -static link_demo.c -lm -o stat
//   ldd ./stat                       # prints 'not a dynamic executable'
//
// Result: ./stat is larger but self-contained and needs no libm at runtime;
// ./dyn is small but fails to start if a NEEDED .so is missing.`
        }
      ]
    },
    {
      heading: 'Translation units and headers',
      body: `The unit the C compiler actually compiles is not a .c file as you wrote it - it is a **translation unit**: one source file *after* the preprocessor has expanded every #include and every macro. Each translation unit is compiled independently into one object file, with no knowledge of any other unit. This independence is the deep reason headers exist, and grasping it dissolves a whole category of confusing errors.

### Declaration versus definition
A **declaration** announces that a name exists and states its type - the function's signature, or that a variable lives elsewhere - without allocating it. A **definition** actually creates the thing: the function body, or the storage for the variable. Because each translation unit is compiled in isolation, when unit A calls a function defined in unit B, unit A needs B's *declaration* at compile time so the compiler knows the types, and then the *linker* later connects the call to B's definition. Headers are the standard mechanism for sharing declarations: you put declarations in a .h, every .c that needs them includes it, and the single matching definition lives in exactly one .c.

This split explains the two error stages from the first section. A wrong or missing declaration is caught at compile time (the unit cannot type-check the call). A missing definition is caught at link time (no unit provided the body). Same function, two completely different errors depending on what you forgot.

### The one-definition discipline and include guards
The rule that keeps this sane: declare freely in headers, but **define each thing exactly once** across all translation units. Put function bodies and global-variable storage in .c files; put prototypes, type definitions, and macros in .h files. To share a global variable, define it once in a .c and declare it with the extern keyword in the header so every including unit sees the same single object rather than minting its own.

Because the preprocessor pastes header text verbatim, a header included twice (directly and transitively) would have its contents duplicated, causing redefinition errors. **Include guards** prevent this: a preprocessor conditional and a unique macro at the top of each header ensure its body is expanded only the first time it is seen in a translation unit. Every serious header has one; forgetting it is a rite-of-passage bug.

> Pitfall: put a variable *definition* (not just a declaration) in a header and include that header from two .c files, and you get a "multiple definition" link error - because each translation unit now defines its own copy and the linker sees a collision. The fix is the discipline above: extern declaration in the header, single definition in one .c. This is one of the most common mistakes a newcomer makes when "just adding a global".`,
      code: [
        {
          lang: 'c',
          src: `// counter.h -- DECLARATIONS only, protected by an include guard.
#ifndef COUNTER_H
#define COUNTER_H

extern int g_count;          /* declaration: storage lives in counter.c */
int next_count(void);        /* function prototype (declaration)        */

#endif /* COUNTER_H */

// counter.c -- the single DEFINITIONS for the whole program.
#include "counter.h"

int g_count = 0;             /* the one and only definition of g_count   */

int next_count(void)         /* the one and only definition of the func  */
{
        return ++g_count;
}

// main.c -- a separate translation unit that only needs the declarations.
#include <stdio.h>
#include "counter.h"         /* gets the prototype + extern declaration  */

int main(void)
{
        printf("%d %d\\n", next_count(), next_count());
        return 0;
}

// Build: each .c becomes one translation unit -> one .o, then link:
//   gcc -Wall -Wextra -c counter.c -o counter.o
//   gcc -Wall -Wextra -c main.c    -o main.o
//   gcc counter.o main.o -o prog`
        }
      ]
    }
  ],
  takeaways: [
    'The compiler driver runs four stages - preprocess (-E), compile to assembly (-S), assemble (-c), link - and every build error lives in exactly one of them; naming the stage names the fix.',
    'Undefined reference and multiple definition are LINK-stage errors about missing or duplicated definitions; a bad prototype is a COMPILE-stage warning - different stages, different remedies.',
    'make rebuilds by comparing timestamps; recipe lines need a real TAB, and you must declare header dependencies or make will skip rebuilds and serve a stale binary.',
    'Kbuild sits on make: contributors usually just add obj-y, obj-m, or obj-$(CONFIG_X) lines and let the framework supply flags and dependencies.',
    'Compile with -g for usable gdb; break/run/next/step/continue/print/backtrace are the core loop, and gdb also reads core dumps and attaches to live PIDs.',
    'nm lists symbols (U marks undefined), objdump disassembles and dumps sections, readelf reveals ELF structure and which shared libraries a binary needs.',
    'Man pages are sectioned: 1 commands, 2 system calls, 3 library functions, 5 file formats, 7 conventions, 8 admin - specify the section when names collide.',
    'Exit status 0 means success and non-zero means failure; the shell builds && and || and if on it, so propagate failures faithfully and use pipefail to catch mid-pipe errors.',
    'A translation unit is a .c after preprocessing; share declarations through guarded headers and define each function and global exactly once - static linking is self-contained, dynamic linking is small and shared but needs its .so files at runtime.'
  ],
  cheatsheet: [
    { label: 'gcc -E / -S / -c', value: 'Stop after preprocess / assembly / object stage' },
    { label: 'gcc -Wall -Wextra -g', value: 'All warnings on, debug info embedded' },
    { label: 'gcc -O0 vs -O2', value: 'No optimization (clean stepping) vs optimized build' },
    { label: 'make / .PHONY', value: 'Build by timestamp graph; mark non-file targets' },
    { label: '$@ $< $^', value: 'make automatic vars: target, first prereq, all prereqs' },
    { label: 'obj-m += drv.o', value: 'Kbuild: build drv.o as a loadable module' },
    { label: 'obj-$(CONFIG_X) += f.o', value: 'Kbuild: build f.o only when CONFIG_X is set' },
    { label: 'gdb break / run / bt', value: 'Set breakpoint, start program, show call stack' },
    { label: 'gdb next vs step', value: 'Step over a call vs step into it' },
    { label: 'nm -- U symbol', value: 'List symbols; U means undefined (needed elsewhere)' },
    { label: 'objdump -d / -S', value: 'Disassemble; interleave source (needs -g)' },
    { label: 'readelf -d / ldd', value: 'Show NEEDED shared libraries a binary loads' },
    { label: 'man 2 vs man 3', value: 'System call vs C library function of same name' },
    { label: 'cmd ; echo $?', value: '0 = success, non-zero = failure exit status' }
  ]
}

export default note
