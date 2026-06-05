import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch02-c-036',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Stop After Preprocessing Only',
    prompt: `The compilation pipeline has four stages: preprocess, compile, assemble, link. You want to stop after ONLY the first stage and inspect the expanded source.

Write a complete C program in a file named greet.c that defines a macro GREETING as the string "hi" and a function main that prints it with puts. Then, in a comment at the top of your solution, give the exact single gcc command that runs ONLY the preprocessor on greet.c and writes the result to greet.i (do NOT compile, assemble, or link).`,
    hints: [
      'The flag that stops gcc after preprocessing is -E.',
      'Use -o to choose the output filename greet.i.',
    ],
    solution: `/* gcc -E greet.c -o greet.i */
#include <stdio.h>

#define GREETING "hi"

int main(void) {
    puts(GREETING);
    return 0;
}`,
    starter: `/* TODO: write the gcc -E command here as a comment */
#include <stdio.h>

#define GREETING "hi"

int main(void) {
    /* TODO: print GREETING with puts */
    return 0;
}`,
    tags: ['gcc', 'preprocessor', 'pipeline'],
  },
  {
    id: 'lx-ch02-c-037',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Compile To Assembly And Find A Mnemonic',
    prompt: `Stopping after the compile stage produces human-readable assembly. Write a complete C program (square.c) with a function int square(int x) that returns x*x, plus a main that prints square(5). In a comment at the top, give the exact gcc command that compiles square.c to assembly only (stops before the assembler) and writes square.s. Then name, in a comment, the gcc flag that performs that stop.`,
    hints: [
      'The flag that stops after compilation is -S.',
      'gcc -S square.c -o square.s leaves a .s text file.',
    ],
    solution: `/* gcc -S square.c -o square.s   (the -S flag stops after compilation) */
#include <stdio.h>

int square(int x) {
    return x * x;
}

int main(void) {
    printf("%d\\n", square(5));
    return 0;
}`,
    starter: `/* TODO: gcc command + name the stop flag */
#include <stdio.h>

int square(int x) {
    /* TODO */
}

int main(void) {
    printf("%d\\n", square(5));
    return 0;
}`,
    tags: ['gcc', 'assembly', 'pipeline'],
  },
  {
    id: 'lx-ch02-c-038',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Produce An Object File Without Linking',
    prompt: `An object (.o) file is the result of assembling but NOT linking. Write a complete C program (add.c) containing only a function int add(int a, int b) that returns a+b (NO main). In a comment, give the exact gcc command that compiles and assembles add.c into add.o without attempting to link. Explain in one comment line why a normal full build of this single file would FAIL but the object-file build SUCCEEDS.`,
    hints: [
      'The flag that compiles and assembles but stops before linking is -c.',
      'Without main, the linker has no entry point, so only -c works.',
    ],
    solution: `/* gcc -c add.c -o add.o
 * A full link fails: there is no main, so the linker cannot resolve the
 * program entry point. -c stops before linking, so add.o builds fine. */
int add(int a, int b) {
    return a + b;
}`,
    starter: `/* TODO: gcc -c command + why a full build fails */
int add(int a, int b) {
    /* TODO */
}`,
    tags: ['gcc', 'object-file', 'linking'],
  },
  {
    id: 'lx-ch02-c-039',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Echo The Process Argument Vector',
    prompt: `The shell hands a program its arguments through argv. Write a complete C program that prints argc, then each argv[i] with its index, one per line, like:

argc=3
argv[0]=./a.out
argv[1]=foo
argv[2]=bar

Use the signature int main(int argc, char **argv). Iterate from 0 up to argc-1.`,
    hints: [
      'argv[0] is the program name as the shell invoked it.',
      'Loop while i < argc; argv[argc] is NULL.',
    ],
    solution: `#include <stdio.h>

int main(int argc, char **argv) {
    printf("argc=%d\\n", argc);
    for (int i = 0; i < argc; i++)
        printf("argv[%d]=%s\\n", i, argv[i]);
    return 0;
}`,
    starter: `#include <stdio.h>

int main(int argc, char **argv) {
    /* TODO: print argc then each argv[i] */
    return 0;
}`,
    tags: ['shell', 'argv', 'process'],
  },
  {
    id: 'lx-ch02-c-040',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Exit Code Reflects A Threshold',
    prompt: `A program's exit status is how the shell knows if it succeeded. Write a complete C program that reads one integer from argv[1] with atoi and returns exit code 0 if the value is >= 100, otherwise returns exit code 1. If argv[1] is missing (argc < 2), return exit code 2. Do not print anything. In a comment, show the shell command that prints the exit code after running it.`,
    hints: [
      'The value returned from main becomes the exit status.',
      'In the shell, echo $? prints the last exit code.',
    ],
    solution: `/* run:  ./a.out 150 ; echo $?    -> prints 0 */
#include <stdlib.h>

int main(int argc, char **argv) {
    if (argc < 2)
        return 2;
    int v = atoi(argv[1]);
    return v >= 100 ? 0 : 1;
}`,
    starter: `#include <stdlib.h>

int main(int argc, char **argv) {
    if (argc < 2)
        return 2;
    /* TODO: return 0 if atoi(argv[1]) >= 100 else 1 */
}`,
    tags: ['shell', 'exit-code', 'argv'],
  },
  {
    id: 'lx-ch02-c-041',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Predefined Compiler Macros',
    prompt: `The preprocessor exposes built-in macros. Write a complete C program that prints the standard predefined macros __FILE__ (a string), __LINE__ (an int), and __STDC_VERSION__ (a long) in this format:

file=prog.c
line=7
stdc=201710

Use the right format specifier for each: %s for __FILE__, %d for __LINE__, %ld for __STDC_VERSION__.`,
    hints: [
      '__FILE__ is a string literal; __LINE__ is an integer.',
      '__STDC_VERSION__ is a long constant like 201710L for C17.',
    ],
    solution: `#include <stdio.h>

int main(void) {
    printf("file=%s\\n", __FILE__);
    printf("line=%d\\n", __LINE__);
    printf("stdc=%ld\\n", __STDC_VERSION__);
    return 0;
}`,
    starter: `#include <stdio.h>

int main(void) {
    /* TODO: print __FILE__, __LINE__, __STDC_VERSION__ */
    return 0;
}`,
    tags: ['preprocessor', 'macros', 'gcc'],
  },
  {
    id: 'lx-ch02-c-042',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Stringize And Token-Paste Macros',
    prompt: `Two preprocessor operators are # (stringize) and ## (token paste). Write a complete C program with:
- a macro STR(x) that turns its argument into a string literal,
- a macro CAT(a,b) that concatenates two tokens into one identifier.
Use them so that this works: declare an int named var12 via int CAT(var, 12) = 5; and print both STR(hello) and that variable:

hello
5`,
    hints: [
      'STR(x) expands to #x; CAT(a,b) expands to a ## b.',
      'CAT(var, 12) becomes the single token var12.',
    ],
    solution: `#include <stdio.h>

#define STR(x) #x
#define CAT(a, b) a ## b

int main(void) {
    int CAT(var, 12) = 5;
    puts(STR(hello));
    printf("%d\\n", var12);
    return 0;
}`,
    starter: `#include <stdio.h>

#define STR(x) /* TODO */
#define CAT(a, b) /* TODO */

int main(void) {
    int CAT(var, 12) = 5;
    puts(STR(hello));
    printf("%d\\n", var12);
    return 0;
}`,
    tags: ['preprocessor', 'macros', 'stringize'],
  },
  {
    id: 'lx-ch02-c-043',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Header Guard Versus pragma once',
    prompt: `A header included twice in one translation unit must not redefine its contents. Create a header file shape.h that declares a struct Shape { int w, h; } and a function int area(const struct Shape *s). Protect it with a classic include guard (#ifndef / #define / #endif). In a comment in the header, give the single-line non-standard alternative that does the same job.`,
    hints: [
      'Pick a unique guard macro like SHAPE_H.',
      'The one-line alternative is #pragma once.',
    ],
    solution: `/* shape.h */
#ifndef SHAPE_H
#define SHAPE_H
/* one-line alternative: #pragma once */

struct Shape { int w, h; };
int area(const struct Shape *s);

#endif /* SHAPE_H */`,
    starter: `/* shape.h */
/* TODO: add an include guard around the declarations below */

struct Shape { int w, h; };
int area(const struct Shape *s);
`,
    tags: ['header', 'include-guard', 'translation-unit'],
  },
  {
    id: 'lx-ch02-c-044',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Implement A Declared Function',
    prompt: `Given the header from a math library, mathx.h, which declares:
  long ipow(long base, unsigned exp);
write the implementation file mathx.c that includes "mathx.h" and defines ipow as integer exponentiation by repeated multiplication (ipow(2,10) == 1024, ipow(5,0) == 1). The implementation MUST include its own header so the compiler checks the prototype against the definition.`,
    hints: [
      'Including the header in the .c lets gcc catch signature mismatches.',
      'Start the result at 1 and multiply base exp times.',
    ],
    solution: `/* mathx.c */
#include "mathx.h"

long ipow(long base, unsigned exp) {
    long result = 1;
    for (unsigned i = 0; i < exp; i++)
        result *= base;
    return result;
}`,
    starter: `/* mathx.c */
#include "mathx.h"

long ipow(long base, unsigned exp) {
    /* TODO: repeated multiplication */
}`,
    tags: ['header', 'translation-unit', 'definition'],
  },
  {
    id: 'lx-ch02-c-045',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Distinguish Declaration From Definition',
    prompt: `In C a global may be DECLARED many times but DEFINED once. Write a single complete C file that demonstrates the difference: at file scope, write a tentative definition int counter; , then a redundant declaration extern int counter; , and in main increment and print counter twice (final value 2). Add a comment above the line that is the actual DEFINITION explaining why only it allocates storage.`,
    hints: [
      'extern int x; is a declaration only — it allocates no storage.',
      'A tentative definition int x; at file scope reserves storage.',
    ],
    solution: `#include <stdio.h>

/* DEFINITION: a file-scope object without extern allocates storage. */
int counter;

extern int counter; /* declaration only — refers to the object above */

int main(void) {
    counter++;
    counter++;
    printf("%d\\n", counter);
    return 0;
}`,
    starter: `#include <stdio.h>

/* TODO: one definition of counter and one extern declaration */

int main(void) {
    counter++;
    counter++;
    printf("%d\\n", counter);
    return 0;
}`,
    tags: ['linkage', 'extern', 'definition'],
  },
  {
    id: 'lx-ch02-c-046',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Makefile That Builds From Two Objects',
    prompt: `Write a GNU Makefile that builds an executable named calc from two C sources, main.c and ops.c, by FIRST compiling each into its own .o file and THEN linking the two objects. Use CC and CFLAGS variables (CFLAGS = -Wall -Wextra). Provide a phony 'clean' target that removes calc and the .o files. Do not use a single all-in-one compile command; the build must go through explicit object files.`,
    hints: [
      'A rule for calc lists main.o and ops.o as prerequisites.',
      'Use $@ for the target and $^ for all prerequisites in the link line.',
    ],
    solution: `CC = gcc
CFLAGS = -Wall -Wextra

calc: main.o ops.o
	$(CC) $(CFLAGS) -o $@ $^

main.o: main.c
	$(CC) $(CFLAGS) -c main.c

ops.o: ops.c
	$(CC) $(CFLAGS) -c ops.c

.PHONY: clean
clean:
	rm -f calc main.o ops.o`,
    starter: `CC = gcc
CFLAGS = -Wall -Wextra

# TODO: rule for calc linking main.o and ops.o
# TODO: rules to build each .o
# TODO: .PHONY clean target
`,
    tags: ['makefile', 'build', 'linking'],
  },
  {
    id: 'lx-ch02-c-047',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Walk Pointers To Argv With gdb',
    prompt: `You will debug a small program in gdb. Write a complete C program that stores argv[1] in a local char *name (default "world" when argc < 2) and prints "hi <name>". Then, in a top-of-file comment block, give the exact gdb commands to: (1) break at main, (2) run with the single argument Alice, (3) step past the assignment and print name, and (4) continue to completion.`,
    hints: [
      'Pass program arguments to gdb with: run Alice (or set args).',
      'break main, run Alice, next a few times, print name, continue.',
    ],
    solution: `/*
 * gdb session:
 *   break main
 *   run Alice
 *   next            # step past the assignment to name
 *   print name      # => $1 = "Alice"
 *   continue
 */
#include <stdio.h>

int main(int argc, char **argv) {
    char *name = (argc < 2) ? "world" : argv[1];
    printf("hi %s\\n", name);
    return 0;
}`,
    starter: `/* TODO: gdb commands in a comment block */
#include <stdio.h>

int main(int argc, char **argv) {
    char *name = (argc < 2) ? "world" : argv[1];
    printf("hi %s\\n", name);
    return 0;
}`,
    tags: ['gdb', 'debugging', 'argv'],
  },
  {
    id: 'lx-ch02-c-048',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Conditional Breakpoint In gdb',
    prompt: `Write a complete C program with a loop for (int i = 0; i < 1000; i++) that calls a helper void work(int i) printing i. You want to stop ONLY when i equals 742. In a top-of-file comment, give the exact command sequence: compile with debug info (name the gcc flag), set a breakpoint inside work with a CONDITION on i, run, and print i to confirm.`,
    hints: [
      'Compile with -g so gdb has source line and variable info.',
      'A conditional breakpoint: break work if i == 742.',
    ],
    solution: `/*
 *   gcc -g loop.c -o loop
 *   gdb ./loop
 *     break work if i == 742
 *     run
 *     print i      # => $1 = 742
 *     continue
 */
#include <stdio.h>

void work(int i) {
    printf("%d\\n", i);
}

int main(void) {
    for (int i = 0; i < 1000; i++)
        work(i);
    return 0;
}`,
    starter: `/* TODO: gcc -g + gdb conditional breakpoint commands */
#include <stdio.h>

void work(int i) {
    printf("%d\\n", i);
}

int main(void) {
    for (int i = 0; i < 1000; i++)
        work(i);
    return 0;
}`,
    tags: ['gdb', 'breakpoint', 'debugging'],
  },
  {
    id: 'lx-ch02-c-049',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Man Section 2 Versus Section 3',
    prompt: `The man pages are split into numbered sections: section 2 documents system calls (kernel entry points) and section 3 documents library functions. Write a complete C program that emits the text "ok\\n" twice — once via write() (a section-2 syscall wrapper) and once via printf() (a section-3 library function). In a top-of-file comment, give the two man commands that open the section-2 page for write and the section-3 page for printf explicitly.`,
    hints: [
      'man 2 write opens the syscall page; man 3 printf the library page.',
      'write needs a file descriptor; use STDOUT_FILENO from <unistd.h>.',
    ],
    solution: `/*
 *   man 2 write     # the write() system call
 *   man 3 printf    # the printf() C library function
 */
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    const char *msg = "ok\\n";
    write(STDOUT_FILENO, msg, strlen(msg)); /* section 2 */
    printf("%s", msg);                      /* section 3 */
    return 0;
}`,
    starter: `/* TODO: man commands for sections 2 and 3 */
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    const char *msg = "ok\\n";
    /* TODO: emit msg with write() then with printf() */
    return 0;
}`,
    tags: ['man-pages', 'syscall', 'libc'],
  },
  {
    id: 'lx-ch02-c-050',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'List Defined Symbols With nm',
    prompt: `nm lists the symbols in an object file with a type code per symbol: 'T' for a function in the text section, 'D' for an initialized global in data, 'B' for a zero-initialized global in BSS. Write a complete C file (syms.c) that has: a function int total(void) returning 0, a global int g_init = 7, and a global int g_zero; . In a top-of-file comment, give the gcc command to make syms.o and the nm command to view its symbols, and state which letter you expect beside each of the three names.`,
    hints: [
      'Build with gcc -c syms.c, then run nm syms.o.',
      'Functions show T, initialized data D, uninitialized BSS B.',
    ],
    solution: `/*
 *   gcc -c syms.c -o syms.o
 *   nm syms.o
 *     total   -> T  (text/function)
 *     g_init  -> D  (initialized data)
 *     g_zero  -> B  (BSS, zero-initialized)
 */
int g_init = 7;
int g_zero;

int total(void) {
    return 0;
}`,
    starter: `/*
 * TODO: nm command + expected letter for total, g_init, g_zero
 */
int g_init = 7;
int g_zero;

int total(void) {
    return 0;
}`,
    tags: ['nm', 'symbols', 'object-file'],
  },
  {
    id: 'lx-ch02-c-051',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Hide A Symbol With static',
    prompt: `The static keyword at file scope gives a symbol internal linkage so it does NOT appear as a global symbol for the linker. Write a complete C file with a static helper static int secret(void) { return 42; } and a public int reveal(void) { return secret(); }. In a top-of-file comment, name the nm symbol-type LETTER you expect for secret (lowercase 't' for a local text symbol) versus reveal (uppercase 'T'), and explain in one line why static prevents name collisions across files.`,
    hints: [
      'nm uses lowercase letters for local (static) symbols.',
      'Two files can each define a static secret() without clashing.',
    ],
    solution: `/*
 *   nm: secret -> t  (local text, internal linkage)
 *       reveal -> T  (global text, external linkage)
 *   static gives internal linkage, so each file's secret() is private
 *   and cannot collide with another file's secret() at link time.
 */
static int secret(void) {
    return 42;
}

int reveal(void) {
    return secret();
}`,
    starter: `/* TODO: explain nm letters t vs T for the two functions */
static int secret(void) {
    return 42;
}

int reveal(void) {
    return secret();
}`,
    tags: ['static', 'linkage', 'nm'],
  },
  {
    id: 'lx-ch02-c-052',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Shell And/Or Chaining By Exit Code',
    prompt: `The shell operators && and || branch on a command's exit code (0 = success). Write a complete C program that takes one argument; it returns 0 ("success") if the argument equals "go", otherwise returns 1. In a top-of-file comment, write a single shell line that runs the program with "go" and, ONLY if it succeeds, echoes "running", and otherwise (||) echoes "halted". Then write a second shell line that demonstrates the "halted" branch.`,
    hints: [
      'A && B runs B only when A exits 0; A || B runs B when A exits non-zero.',
      'strcmp returns 0 when the strings are equal.',
    ],
    solution: `/*
 *   ./gate go   && echo running || echo halted    # prints: running
 *   ./gate stop && echo running || echo halted    # prints: halted
 */
#include <string.h>

int main(int argc, char **argv) {
    if (argc >= 2 && strcmp(argv[1], "go") == 0)
        return 0;
    return 1;
}`,
    starter: `/* TODO: two shell lines showing && and || branches */
#include <string.h>

int main(int argc, char **argv) {
    /* TODO: return 0 only when argv[1] == "go" */
}`,
    tags: ['shell', 'exit-code', 'pipeline'],
  },
  {
    id: 'lx-ch02-c-053',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'PIPESTATUS And A Failing Pipeline',
    prompt: `In a pipeline a | b, the shell's $? reflects only the LAST command b; bash records every stage in the array PIPESTATUS. Write a complete C program that prints "data" to stdout and then exits with code 3. In a top-of-file comment, show a bash pipeline that runs this program piped into cat, then prints the PIPESTATUS array so the learner sees that the first stage exited 3 while cat exited 0.`,
    hints: [
      'Exit status of a pipeline is the last command unless pipefail is set.',
      'Print each stage status with echo of the PIPESTATUS array, e.g. "3 0".',
    ],
    solution: `/*
 *   ./emit | cat
 *   echo "PIPESTATUS array"     # prints: 3 0   (emit=3, cat=0)
 *   # $? alone would show 0 (cat's status), hiding emit's failure.
 *   # In bash, after the pipeline:  echo "the PIPESTATUS array" -> 3 0
 */
#include <stdio.h>

int main(void) {
    printf("data\\n");
    return 3;
}`,
    starter: `/* TODO: bash pipeline + PIPESTATUS comment */
#include <stdio.h>

int main(void) {
    printf("data\\n");
    return 3;
}`,
    tags: ['shell', 'pipeline', 'exit-code'],
  },
  {
    id: 'lx-ch02-c-054',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Static Library With ar',
    prompt: `A static library (.a) is an archive of .o files copied into the final executable at link time. Write the shell command sequence (as a top-of-file comment in the driver) to: compile strutil.c and numutil.c to objects, bundle them into libutil.a with ar, then link main.c against it using -L. and -lutil. Then write the driver main.c that calls one function from each (assume prototypes int slen(const char*) and int dbl(int) are declared in util.h).`,
    hints: [
      'ar rcs libutil.a strutil.o numutil.o creates the archive.',
      'Link with: gcc main.c -L. -lutil -o app (lib + util -> -lutil).',
    ],
    solution: `/*
 *   gcc -c strutil.c -o strutil.o
 *   gcc -c numutil.c -o numutil.o
 *   ar rcs libutil.a strutil.o numutil.o
 *   gcc main.c -L. -lutil -o app
 */
#include <stdio.h>
#include "util.h"

int main(void) {
    printf("%d %d\\n", slen("hello"), dbl(21));
    return 0;
}`,
    starter: `/* TODO: ar + link command sequence in a comment */
#include <stdio.h>
#include "util.h"

int main(void) {
    printf("%d %d\\n", slen("hello"), dbl(21));
    return 0;
}`,
    tags: ['static-linking', 'ar', 'library'],
  },
  {
    id: 'lx-ch02-c-055',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Build A Shared Library',
    prompt: `A shared library (.so) is loaded at run time, not copied into the binary. Given greet.c with a function void hello(const char *name) declared in greet.h, write (as a top-of-file comment in the driver) the commands to: compile greet.c as position-independent code, link it into libgreet.so, then build an app linking against it. Note the run-time detail: the loader must find libgreet.so. Then write the driver main.c that calls hello("world").`,
    hints: [
      'Compile PIC with -fPIC; make the .so with gcc -shared.',
      'At run time set LD_LIBRARY_PATH=. so the loader finds libgreet.so.',
    ],
    solution: `/*
 *   gcc -fPIC -c greet.c -o greet.o
 *   gcc -shared -o libgreet.so greet.o
 *   gcc main.c -L. -lgreet -o app
 *   LD_LIBRARY_PATH=. ./app        # loader resolves libgreet.so at run time
 */
#include "greet.h"

int main(void) {
    hello("world");
    return 0;
}`,
    starter: `/* TODO: -fPIC, -shared, link, and run commands in a comment */
#include "greet.h"

int main(void) {
    hello("world");
    return 0;
}`,
    tags: ['dynamic-linking', 'shared-library', 'pic'],
  },
  {
    id: 'lx-ch02-c-056',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Read ELF Section Headers With readelf',
    prompt: `An ELF object has named sections: .text (code), .data (initialized globals), .rodata (read-only constants), .bss (zeroed globals). Write a complete C file that places one value into each section: a function (text), int gi = 9 (data), a string literal "abc" (rodata), and int gz; (bss). In a top-of-file comment, give the gcc command to build the object and the readelf command (with the flag that lists section headers) to confirm those sections exist.`,
    hints: [
      'readelf -S object.o lists the section headers.',
      'String literals land in .rodata; uninitialized globals in .bss.',
    ],
    solution: `/*
 *   gcc -c elfdemo.c -o elfdemo.o
 *   readelf -S elfdemo.o        # -S lists section headers (.text/.data/.rodata/.bss)
 */
int gi = 9;              /* .data */
int gz;                  /* .bss  */
const char *msg = "abc"; /* literal -> .rodata */

int f(void) {            /* .text */
    return gi;
}`,
    starter: `/* TODO: gcc + readelf -S commands in a comment */
int gi = 9;
int gz;
const char *msg = "abc";

int f(void) {
    return gi;
}`,
    tags: ['readelf', 'elf', 'sections'],
  },
  {
    id: 'lx-ch02-c-057',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Disassemble With Intel Syntax',
    prompt: `objdump -d disassembles the machine code back into assembly. Write a complete C program with int triple(int x) { return x + x + x; } and a main calling it. In a top-of-file comment, give: (1) the gcc command (build the executable normally), and (2) the objdump command that disassembles it using INTEL syntax (name the exact flag) rather than the default AT&T syntax.`,
    hints: [
      'objdump -d disassembles; -M intel selects Intel syntax.',
      'Combine as objdump -d -M intel ./prog.',
    ],
    solution: `/*
 *   gcc triple.c -o triple
 *   objdump -d -M intel ./triple    # -M intel picks Intel over AT&T syntax
 */
#include <stdio.h>

int triple(int x) {
    return x + x + x;
}

int main(void) {
    printf("%d\\n", triple(7));
    return 0;
}`,
    starter: `/* TODO: gcc + objdump -d -M intel commands in a comment */
#include <stdio.h>

int triple(int x) {
    return x + x + x;
}

int main(void) {
    printf("%d\\n", triple(7));
    return 0;
}`,
    tags: ['objdump', 'disassembly', 'elf'],
  },
  {
    id: 'lx-ch02-c-058',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Check errno After A Failing Syscall',
    prompt: `Most syscalls report failure by returning -1 and setting the global errno. Write a complete C program that tries to open a file that does not exist using open("/no/such/file", O_RDONLY), checks for the -1 return, and prints a human-readable message with perror("open"). Then print the numeric errno value too. In a comment, name the man section where you would look up open() (section 2) and perror()/errno (section 3).`,
    hints: [
      'open lives in <fcntl.h>; errno in <errno.h>.',
      'perror prepends your prefix and appends the strerror text.',
    ],
    solution: `/* man 2 open ; man 3 perror ; man 3 errno */
#include <stdio.h>
#include <fcntl.h>
#include <errno.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    if (fd == -1) {
        perror("open");
        printf("errno=%d\\n", errno);
        return 1;
    }
    return 0;
}`,
    starter: `/* TODO: man sections in a comment */
#include <stdio.h>
#include <fcntl.h>
#include <errno.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    /* TODO: on -1, perror and print errno */
    return 0;
}`,
    tags: ['errno', 'syscall', 'man-pages'],
  },
  {
    id: 'lx-ch02-c-059',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pattern Rule For Many Objects',
    prompt: `A Makefile pattern rule compiles any .c into its .o without repeating yourself. Write a GNU Makefile that builds an executable 'app' from object files listed in a variable OBJS = a.o b.o c.o. Provide a single pattern rule '%.o: %.c' that compiles using the automatic variables $< (the prerequisite) and $@ (the target), and a link rule for app using $^. Include a phony clean.`,
    hints: [
      '%.o: %.c with recipe $(CC) -c $< -o $@ handles every source.',
      '$< is the first prerequisite, $@ the target, $^ all prerequisites.',
    ],
    solution: `CC = gcc
CFLAGS = -Wall
OBJS = a.o b.o c.o

app: $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

.PHONY: clean
clean:
	rm -f app $(OBJS)`,
    starter: `CC = gcc
CFLAGS = -Wall
OBJS = a.o b.o c.o

# TODO: app rule using $^
# TODO: pattern rule %.o: %.c using $< and $@
# TODO: clean
`,
    tags: ['makefile', 'pattern-rule', 'automatic-variables'],
  },
  {
    id: 'lx-ch02-c-060',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Inspect A Struct In gdb',
    prompt: `gdb can print whole aggregates. Write a complete C program with a struct Point { int x, y; } and, inside main, a Point p = {3, 4}, then print p.x + p.y. In a top-of-file comment, give the gdb commands to compile with debug info, break right before the print, then print the entire struct (one command that shows {x = 3, y = 4}) and also print just p.y.`,
    hints: [
      'gcc -g enables symbol info; break at a line number with break file.c:NN.',
      'print p shows the whole struct; print p.y shows one field.',
    ],
    solution: `/*
 *   gcc -g point.c -o point
 *   gdb ./point
 *     break point.c:11      # the printf line
 *     run
 *     print p               # => {x = 3, y = 4}
 *     print p.y             # => 4
 */
#include <stdio.h>

struct Point { int x, y; };

int main(void) {
    struct Point p = {3, 4};
    printf("%d\\n", p.x + p.y);
    return 0;
}`,
    starter: `/* TODO: gdb commands to print the struct and one field */
#include <stdio.h>

struct Point { int x, y; };

int main(void) {
    struct Point p = {3, 4};
    printf("%d\\n", p.x + p.y);
    return 0;
}`,
    tags: ['gdb', 'struct', 'debugging'],
  },
  {
    id: 'lx-ch02-c-061',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'C Symbols Are Not Mangled',
    prompt: `Unlike C++, C does NOT mangle symbol names: a function foo stays foo in the object file. Write a complete C file with int compute(int a, int b) returning a*b - 1. In a top-of-file comment, give the nm command for its object and state the EXACT symbol name you expect to see (no mangling, no parameter encoding). Then explain in one comment line why nm output for C is directly grep-able by the source function name.`,
    hints: [
      'C symbol names equal the source identifier (no type encoding).',
      'nm compute.o | grep compute finds the symbol verbatim.',
    ],
    solution: `/*
 *   gcc -c compute.c -o compute.o
 *   nm compute.o | grep compute   # symbol is exactly: compute  (type T)
 *   C has no name mangling, so the object symbol equals the source name and
 *   can be grepped directly -- unlike C++ which encodes parameter types.
 */
int compute(int a, int b) {
    return a * b - 1;
}`,
    starter: `/* TODO: nm command + expected exact symbol name */
int compute(int a, int b) {
    return a * b - 1;
}`,
    tags: ['nm', 'symbols', 'linkage'],
  },
  {
    id: 'lx-ch02-c-062',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Function Prototype Mismatch Bug',
    prompt: `A header and its implementation must agree. You are given a header prototype:
  int scale(int value, int factor);
but the implementation file below defines scale with a SWAPPED signature that returns a long and takes the factor first. This compiles per file but is a latent bug. Fix scale.c so its definition exactly matches the prototype (returns int, parameters value then factor) and computes value*factor. Include the header so the compiler enforces the match.`,
    hints: [
      'Including the header makes gcc reject a signature mismatch.',
      'The fixed definition is int scale(int value, int factor).',
    ],
    solution: `/* scale.c -- fixed to match scale.h */
#include "scale.h"

int scale(int value, int factor) {
    return value * factor;
}`,
    starter: `/* scale.c -- BUG: signature does not match the header */
#include "scale.h"

long scale(int factor, int value) {   /* TODO: fix to int scale(int value, int factor) */
    return value * factor;
}`,
    tags: ['header', 'prototype', 'translation-unit'],
  },
  {
    id: 'lx-ch02-c-063',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Preprocessed Lines',
    prompt: `Including a big header pulls in many lines via the preprocessor. Write a complete C program that includes <stdio.h> and just calls puts("x"). In a top-of-file comment, give the gcc command that emits the preprocessed translation unit to stdout, piped into wc -l to count how many lines the single #include expanded to. Explain in one line why the .i output is far longer than the source.`,
    hints: [
      'gcc -E prog.c | wc -l counts the preprocessed lines.',
      '#include literally pastes the entire header (and its includes) in.',
    ],
    solution: `/*
 *   gcc -E prog.c | wc -l
 *   The preprocessor pastes all of <stdio.h> (and everything it includes)
 *   into the translation unit, so the .i is hundreds of lines, not three.
 */
#include <stdio.h>

int main(void) {
    puts("x");
    return 0;
}`,
    starter: `/* TODO: gcc -E | wc -l command + one-line explanation */
#include <stdio.h>

int main(void) {
    puts("x");
    return 0;
}`,
    tags: ['preprocessor', 'pipeline', 'translation-unit'],
  },
  {
    id: 'lx-ch02-c-064',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Treat Warnings As Errors And Fix',
    prompt: `Kernel builds are strict. The program below triggers warnings because main forgets to return a value and declares an unused variable. Rewrite it so it compiles cleanly under gcc -Wall -Wextra -Werror (which turns every warning into a hard error). Keep the behavior: print the sum 1+2+3 and return 0. In a top-of-file comment, give the exact gcc command you used.`,
    hints: [
      '-Werror makes any warning fail the build.',
      'Remove the unused variable and add an explicit return 0.',
    ],
    solution: `/* gcc -Wall -Wextra -Werror clean.c -o clean */
#include <stdio.h>

int main(void) {
    int sum = 1 + 2 + 3;
    printf("%d\\n", sum);
    return 0;
}`,
    starter: `/* TODO: clean this up for -Wall -Wextra -Werror */
#include <stdio.h>

int main(void) {
    int unused;          /* warning: unused variable */
    printf("%d\\n", 1 + 2 + 3);
    /* warning: missing return */
}`,
    tags: ['gcc', 'warnings', 'werror'],
  },
  {
    id: 'lx-ch02-c-065',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Multiple Definition Link Error',
    prompt: `Putting a non-static DEFINITION of a global directly in a header causes "multiple definition" at link time when two .c files include it. You are given a header config.h that wrongly contains: int g_limit = 100; . Fix the design WITHOUT changing program behavior: rewrite config.h to only DECLARE the global (extern), and write the single config.c that provides the ONE definition. In a comment in config.c, explain in one line why the original broke the One Definition Rule across translation units.`,
    hints: [
      'A header is textually pasted into every includer; a definition there is duplicated.',
      'Declare with extern in the header; define once in exactly one .c file.',
    ],
    solution: `/* config.h
 * #ifndef CONFIG_H
 * #define CONFIG_H
 * extern int g_limit;   // declaration only
 * #endif
 */

/* config.c
 * Each .c that included the old header got its own definition of g_limit,
 * so the linker saw multiple definitions. One extern decl + one definition fixes it.
 */
#include "config.h"

int g_limit = 100;   /* the single definition lives here */`,
    starter: `/* config.h  (BUG: defines a global in a header)
 * int g_limit = 100;
 *
 * TODO: change the header to: extern int g_limit;
 */

/* config.c */
#include "config.h"

/* TODO: provide the single definition of g_limit here */`,
    tags: ['linking', 'extern', 'odr'],
  },
  {
    id: 'lx-ch02-c-066',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Undefined Reference From Missing Object',
    prompt: `You build with: gcc main.c -o app and get "undefined reference to helper". The function helper is defined in helper.c, which you forgot to compile and link. Without changing any source, give (in a top-of-file comment in main.c) the corrected single gcc command that compiles BOTH translation units into one executable. Then show the nm command you would run on app afterward to confirm helper is now a defined 'T' symbol rather than an undefined 'U'. Write the matching main.c that declares and calls int helper(void).`,
    hints: [
      'undefined reference is a LINKER error: a symbol was used but never defined.',
      'gcc main.c helper.c -o app links both; nm app shows U vs T.',
    ],
    solution: `/*
 *   gcc main.c helper.c -o app        # link BOTH translation units
 *   nm app | grep helper              # now shows: T helper  (was U helper)
 */
#include <stdio.h>

int helper(void);   /* declaration; definition is in helper.c */

int main(void) {
    printf("%d\\n", helper());
    return 0;
}`,
    starter: `/* TODO: corrected gcc command + nm verification in a comment */
#include <stdio.h>

int helper(void);

int main(void) {
    printf("%d\\n", helper());
    return 0;
}`,
    tags: ['linking', 'nm', 'undefined-reference'],
  },
  {
    id: 'lx-ch02-c-067',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Library Order Matters On The Link Line',
    prompt: `The static linker resolves symbols left to right, so a library must come AFTER the object that uses it. You have main.o that calls a function from libfoo.a. The command gcc -L. -lfoo main.o -o app FAILS with "undefined reference" even though libfoo.a contains the symbol. In a top-of-file comment in main.c, explain in one line WHY the order fails, then give the corrected link command. Write main.c that calls int foo(void) (declared in foo.h).`,
    hints: [
      'When -lfoo appears first, no pending symbols exist yet, so the archive is skipped.',
      'Put objects before libraries: gcc main.o -L. -lfoo -o app.',
    ],
    solution: `/*
 *   Wrong: gcc -L. -lfoo main.o -o app
 *   When the linker reads -lfoo it has no unresolved symbols yet, so it pulls
 *   nothing from the archive; main.o (read later) then has an undefined foo.
 *   Fix: list the object first, the library last:
 *   gcc main.o -L. -lfoo -o app
 */
#include <stdio.h>
#include "foo.h"

int main(void) {
    printf("%d\\n", foo());
    return 0;
}`,
    starter: `/* TODO: explain the ordering rule + corrected command */
#include <stdio.h>
#include "foo.h"

int main(void) {
    printf("%d\\n", foo());
    return 0;
}`,
    tags: ['static-linking', 'library', 'linker-order'],
  },
  {
    id: 'lx-ch02-c-068',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Confirm Static Versus Dynamic With ldd And readelf',
    prompt: `Prove whether a binary is statically or dynamically linked using the tools, not guesswork. Write a complete trivial C program (just prints "hi"). In a top-of-file comment, give: (1) the gcc command for a DYNAMIC build and the gcc flag for a fully STATIC build; (2) the ldd command and what it prints for each (a list of .so for dynamic vs "not a dynamic executable" for static); (3) the readelf flag that shows the program headers, and which segment (INTERP, the dynamic loader path) is PRESENT for the dynamic build but ABSENT for the static one.`,
    hints: [
      'gcc prog.c -o dyn  vs  gcc -static prog.c -o stat.',
      'ldd lists shared deps; readelf -l shows the INTERP program header.',
    ],
    solution: `/*
 *   gcc prog.c -o dyn            # dynamic (default)
 *   gcc -static prog.c -o stat   # fully static
 *
 *   ldd ./dyn    -> lists libc.so.6 and ld-linux...
 *   ldd ./stat   -> "not a dynamic executable"
 *
 *   readelf -l ./dyn    -> has an INTERP program header (the dynamic loader)
 *   readelf -l ./stat   -> NO INTERP segment; nothing to load at run time
 */
#include <stdio.h>

int main(void) {
    puts("hi");
    return 0;
}`,
    starter: `/* TODO: dynamic vs -static builds, ldd output, readelf -l INTERP note */
#include <stdio.h>

int main(void) {
    puts("hi");
    return 0;
}`,
    tags: ['static-linking', 'dynamic-linking', 'readelf'],
  },
  {
    id: 'lx-ch02-c-069',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Debug A Segfault Backtrace In gdb',
    prompt: `The program below dereferences a NULL pointer and crashes. Do NOT delete the bug from the diagnosis part — instead, in a top-of-file comment, give the full gdb workflow to diagnose it from a fresh run: compile with debug info, run under gdb until it faults, print the backtrace, select the crashing frame, and print the offending pointer to show it is 0x0. Then write the corrected program that guards against the NULL before dereferencing (printing "n/a" instead of crashing).`,
    hints: [
      'gcc -g; in gdb, run until SIGSEGV, then bt, frame, print p.',
      'The fix is to test if (p) before *p and handle the NULL case.',
    ],
    solution: `/*
 *   gcc -g crash.c -o crash
 *   gdb ./crash
 *     run
 *     # program receives SIGSEGV
 *     bt                 # backtrace shows the faulting line in main
 *     frame 0            # select the crashing frame
 *     print p            # => $1 = (int *) 0x0   (NULL deref confirmed)
 */
#include <stdio.h>

int main(void) {
    int *p = NULL;
    if (p)
        printf("%d\\n", *p);   /* guarded: no longer dereferences NULL */
    else
        puts("n/a");
    return 0;
}`,
    starter: `/* TODO: gdb diagnosis workflow in a comment, then guard the NULL */
#include <stdio.h>

int main(void) {
    int *p = NULL;
    printf("%d\\n", *p);   /* crashes: dereferences NULL */
    return 0;
}`,
    tags: ['gdb', 'segfault', 'backtrace'],
  },
  {
    id: 'lx-ch02-c-070',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Four-File Project With A Makefile',
    prompt: `Assemble a complete small project that exercises declaration/definition separation and the build. Provide ALL of:
- util.h: include-guarded header declaring int clampi(int v, int lo, int hi);
- util.c: includes util.h and defines clampi (returns lo if v<lo, hi if v>hi, else v);
- main.c: includes util.h and prints clampi(150, 0, 100) and clampi(-3, 0, 100), expecting 100 and 0;
- Makefile: builds 'demo' from main.o and util.o through explicit object files using CC/CFLAGS (-Wall -Wextra), a pattern rule for %.o, and a phony clean.
Each piece must be self-consistent (main.c never sees util.c's body — only the header).`,
    hints: [
      'main.c depends only on the prototype in util.h, not on util.c.',
      'The Makefile links main.o + util.o; a %.o: %.c rule compiles each source.',
    ],
    solution: `/* ===== util.h ===== */
#ifndef UTIL_H
#define UTIL_H
int clampi(int v, int lo, int hi);
#endif /* UTIL_H */

/* ===== util.c ===== */
#include "util.h"

int clampi(int v, int lo, int hi) {
    if (v < lo) return lo;
    if (v > hi) return hi;
    return v;
}

/* ===== main.c ===== */
#include <stdio.h>
#include "util.h"

int main(void) {
    printf("%d\\n", clampi(150, 0, 100));  /* 100 */
    printf("%d\\n", clampi(-3, 0, 100));   /* 0   */
    return 0;
}

/* ===== Makefile =====
CC = gcc
CFLAGS = -Wall -Wextra
OBJS = main.o util.o

demo: $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

.PHONY: clean
clean:
	rm -f demo $(OBJS)
*/`,
    starter: `/* ===== util.h ===== */
/* TODO: include guard + prototype for clampi */

/* ===== util.c ===== */
#include "util.h"
/* TODO: define clampi */

/* ===== main.c ===== */
#include <stdio.h>
#include "util.h"

int main(void) {
    /* TODO: print clampi(150,0,100) and clampi(-3,0,100) */
    return 0;
}

/* ===== Makefile =====
TODO: CC/CFLAGS, demo from main.o util.o, %.o pattern rule, clean
*/`,
    tags: ['makefile', 'header', 'project'],
  },
]

export default problems
