import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch02-c-001',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Hello From GCC',
    prompt: `Write the simplest complete C program that prints exactly one line:

hello, kernel world

This is the program you will later compile, inspect, and link. Use printf from <stdio.h> and remember the trailing newline.`,
    hints: [
      'Every C program needs an int main function.',
      'printf needs <stdio.h>; end the string with the newline escape.',
    ],
    solution: `#include <stdio.h>

int main(void) {
    printf("hello, kernel world\\n");
    return 0;
}`,
    starter: `#include <stdio.h>

int main(void) {
    /* TODO: print the line */
    return 0;
}`,
    tags: ['gcc', 'basics'],
  },
  {
    id: 'lx-ch02-c-002',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return A Specific Exit Code',
    prompt: `The shell reads the value main returns as the program's exit code. Write a complete program that prints "done" and then makes the process exit with status code 7 (so that "echo $?" in the shell prints 7).

Do not call any special function; just return the right value from main.`,
    hints: [
      'The integer main returns becomes the process exit code.',
      'Exit codes are 0..255; 7 is a normal small code.',
    ],
    solution: `#include <stdio.h>

int main(void) {
    printf("done\\n");
    return 7;
}`,
    starter: `#include <stdio.h>

int main(void) {
    printf("done\\n");
    /* TODO: exit with code 7 */
}`,
    tags: ['shell', 'exit-code'],
  },
  {
    id: 'lx-ch02-c-003',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Success Versus Failure Macros',
    prompt: `Tools and scripts care about success (0) and failure (non-zero). Write a program that includes <stdlib.h> and reads one command-line argument. If exactly one argument is given (argc == 2), print "ok" and return EXIT_SUCCESS; otherwise print "usage error" and return EXIT_FAILURE.

Use the EXIT_SUCCESS and EXIT_FAILURE macros, not bare 0/1.`,
    hints: [
      'argc counts the program name plus the arguments.',
      'EXIT_SUCCESS and EXIT_FAILURE come from <stdlib.h>.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    (void)argv;
    if (argc == 2) {
        printf("ok\\n");
        return EXIT_SUCCESS;
    }
    printf("usage error\\n");
    return EXIT_FAILURE;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    /* TODO: check argc and return EXIT_SUCCESS or EXIT_FAILURE */
}`,
    tags: ['shell', 'exit-code', 'stdlib'],
  },
  {
    id: 'lx-ch02-c-004',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Preprocessor Macro Constant',
    prompt: `The preprocessor runs first, before the compiler proper. Write a program that defines a macro BUF_SIZE as 256 using #define, then declares a char array of that size and prints its length with sizeof using %zu. Output must be:

buffer is 256 bytes`,
    hints: [
      '#define BUF_SIZE 256 with no equals sign and no semicolon.',
      'sizeof on a real array gives the byte count.',
    ],
    solution: `#include <stdio.h>

#define BUF_SIZE 256

int main(void) {
    char buf[BUF_SIZE];
    printf("buffer is %zu bytes\\n", sizeof(buf));
    return 0;
}`,
    starter: `#include <stdio.h>

/* TODO: #define BUF_SIZE 256 */

int main(void) {
    /* TODO: declare a char buf[BUF_SIZE] and print sizeof(buf) */
    return 0;
}`,
    tags: ['preprocessor', 'macro'],
  },
  {
    id: 'lx-ch02-c-005',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Function-Like Macro For MAX',
    prompt: `Write a function-like macro MAX(a, b) that evaluates to the larger of two values, with every argument fully parenthesized so it is safe inside larger expressions. In main, print MAX(3, 9) and MAX(10 - 4, 2), each on its own line.

Expected output:
9
6`,
    hints: [
      'A function-like macro looks like #define MAX(a, b) ...',
      'Parenthesize each argument and the whole expression to avoid precedence bugs.',
    ],
    solution: `#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main(void) {
    printf("%d\\n", MAX(3, 9));
    printf("%d\\n", MAX(10 - 4, 2));
    return 0;
}`,
    starter: `#include <stdio.h>

/* TODO: #define MAX(a, b) with full parenthesization */

int main(void) {
    printf("%d\\n", MAX(3, 9));
    printf("%d\\n", MAX(10 - 4, 2));
    return 0;
}`,
    tags: ['preprocessor', 'macro'],
  },
  {
    id: 'lx-ch02-c-006',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Include Guard For A Header',
    prompt: `Headers must be safe to include more than once. Write the contents of a header file color.h that defines an enum color { RED, GREEN, BLUE } and is protected by a classic include guard using #ifndef / #define / #endif with the macro name COLOR_H.

Write only the header file contents.`,
    hints: [
      'The first line is #ifndef COLOR_H, the second #define COLOR_H.',
      'Close with #endif at the very bottom.',
    ],
    solution: `#ifndef COLOR_H
#define COLOR_H

enum color { RED, GREEN, BLUE };

#endif /* COLOR_H */`,
    starter: `/* color.h */
/* TODO: wrap the enum in an include guard named COLOR_H */

enum color { RED, GREEN, BLUE };`,
    tags: ['header', 'preprocessor', 'include-guard'],
  },
  {
    id: 'lx-ch02-c-007',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declaration In A Header, Definition In A Source',
    prompt: `Practice separating a declaration from its definition. Provide THREE files:

1. add.h  -- declares int add(int a, int b);
2. add.c  -- defines add (returns a + b)
3. main.c -- includes add.h and prints add(2, 3)

The expected output when built and run is:
5

Use an include guard in the header.`,
    hints: [
      'The header has only the prototype ending in a semicolon.',
      'main.c must #include "add.h" with quotes, not angle brackets.',
    ],
    solution: `/* add.h */
#ifndef ADD_H
#define ADD_H
int add(int a, int b);
#endif

/* add.c */
#include "add.h"
int add(int a, int b) {
    return a + b;
}

/* main.c */
#include <stdio.h>
#include "add.h"
int main(void) {
    printf("%d\\n", add(2, 3));
    return 0;
}`,
    starter: `/* add.h */
/* TODO: include guard + prototype for add */

/* add.c */
#include "add.h"
/* TODO: define add */

/* main.c */
#include <stdio.h>
#include "add.h"
int main(void) {
    printf("%d\\n", add(2, 3));
    return 0;
}`,
    tags: ['header', 'translation-unit', 'linking'],
  },
  {
    id: 'lx-ch02-c-008',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Minimal Makefile',
    prompt: `Write a Makefile that builds a program named hello from a single source file hello.c using gcc. It must have:

- a target named hello that depends on hello.c
- a recipe that runs: gcc -Wall -o hello hello.c
- a phony "clean" target that runs: rm -f hello

Remember: Makefile recipe lines must begin with a real TAB, not spaces.`,
    hints: [
      'The first line is "hello: hello.c".',
      'Mark clean with ".PHONY: clean" so it always runs.',
    ],
    solution: `hello: hello.c
\tgcc -Wall -o hello hello.c

.PHONY: clean
clean:
\trm -f hello`,
    starter: `# TODO: target hello depending on hello.c
# TODO: recipe line (starts with a TAB) running gcc -Wall -o hello hello.c
# TODO: a .PHONY clean target that removes hello`,
    tags: ['make', 'build'],
  },
  {
    id: 'lx-ch02-c-009',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Argv Zero',
    prompt: `argv[0] is conventionally the program's own name. Write a program that prints the name it was invoked as, like:

program name: ./a.out

(The text after the colon will match however the shell invoked the program.) Print argv[0] followed by a newline.`,
    hints: [
      'main(int argc, char **argv) gives you argv[0].',
      'Use %s to print a C string.',
    ],
    solution: `#include <stdio.h>

int main(int argc, char **argv) {
    (void)argc;
    printf("program name: %s\\n", argv[0]);
    return 0;
}`,
    starter: `#include <stdio.h>

int main(int argc, char **argv) {
    /* TODO: print argv[0] */
    return 0;
}`,
    tags: ['shell', 'argv'],
  },
  {
    id: 'lx-ch02-c-010',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read A Number From The Environment',
    prompt: `Shell variables reach a program through the environment. Write a program that reads the environment variable COUNT with getenv (from <stdlib.h>). If it is set, print its value; if it is not set (getenv returns NULL), print "unset".

For example, with COUNT=5 set in the shell, the program prints:
5`,
    hints: [
      'getenv returns a char * or NULL.',
      'Always check for NULL before using the returned pointer.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *c = getenv("COUNT");
    if (c == NULL) {
        printf("unset\\n");
    } else {
        printf("%s\\n", c);
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *c = getenv("COUNT");
    /* TODO: print c, or "unset" if it is NULL */
    return 0;
}`,
    tags: ['shell', 'environment', 'stdlib'],
  },
  {
    id: 'lx-ch02-c-011',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Stop After Preprocessing',
    prompt: `gcc -E stops after the preprocessing stage. To see what that stage does, write a program that uses a macro and a comment, then state (as a one-line C comment at the top of your program) the command that prints only the preprocessed output without compiling.

Your program: #define GREETING "hi" then printf("%s\\n", GREETING);. The first line must be the comment naming the command.`,
    hints: [
      'gcc -E hello.c runs only the preprocessor and writes to stdout.',
      'After -E, macros are expanded and comments are stripped.',
    ],
    solution: `/* gcc -E hello.c   prints the preprocessed source */
#include <stdio.h>

#define GREETING "hi"

int main(void) {
    printf("%s\\n", GREETING);
    return 0;
}`,
    starter: `/* TODO: comment naming the command that runs only the preprocessor */
#include <stdio.h>

#define GREETING "hi"

int main(void) {
    printf("%s\\n", GREETING);
    return 0;
}`,
    tags: ['preprocessor', 'gcc', 'pipeline'],
  },
  {
    id: 'lx-ch02-c-012',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Compile To Assembly',
    prompt: `gcc -S stops after the compile stage, producing assembly. Write a tiny function int square(int x) { return x * x; } in a file square.c, and put a one-line C comment at the very top giving the exact command that produces square.s (assembly) WITHOUT assembling or linking.

Include the function and a main that prints square(6).`,
    hints: [
      'gcc -S square.c produces square.s.',
      'The -S stage comes after preprocessing and after the compiler front end.',
    ],
    solution: `/* gcc -S square.c   produces square.s */
#include <stdio.h>

int square(int x) {
    return x * x;
}

int main(void) {
    printf("%d\\n", square(6));
    return 0;
}`,
    starter: `/* TODO: comment with the command that produces assembly only */
#include <stdio.h>

int square(int x) {
    return x * x;
}

int main(void) {
    printf("%d\\n", square(6));
    return 0;
}`,
    tags: ['gcc', 'pipeline', 'assembly'],
  },
  {
    id: 'lx-ch02-c-013',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Compile To An Object File',
    prompt: `gcc -c stops after the assemble stage, producing an object file (.o) that is not yet linked. Write a program in calc.c with a function long cube(long x) and a main that prints cube(4). At the top put a one-line C comment giving the exact command that compiles calc.c into calc.o WITHOUT linking.

Expected runtime output when fully built and run:
64`,
    hints: [
      'gcc -c calc.c produces calc.o.',
      'An object file has machine code but unresolved external references until linking.',
    ],
    solution: `/* gcc -c calc.c   produces calc.o (no linking) */
#include <stdio.h>

long cube(long x) {
    return x * x * x;
}

int main(void) {
    printf("%ld\\n", cube(4));
    return 0;
}`,
    starter: `/* TODO: comment with the command that compiles to an object file only */
#include <stdio.h>

long cube(long x) {
    return x * x * x;
}

int main(void) {
    printf("%ld\\n", cube(4));
    return 0;
}`,
    tags: ['gcc', 'pipeline', 'object-file'],
  },
  {
    id: 'lx-ch02-c-014',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Treat Warnings As Errors',
    prompt: `Kernel builds are strict about warnings. Write a Makefile fragment (a variable plus one target) that builds prog from prog.c with these flags: -Wall -Wextra -Werror -std=c11. Use a CFLAGS variable and reference it in the recipe.

The recipe must run: gcc $(CFLAGS) -o prog prog.c`,
    hints: [
      'Define CFLAGS = -Wall -Wextra -Werror -std=c11 at the top.',
      'Recipe lines start with a TAB and use $(CFLAGS).',
    ],
    solution: `CFLAGS = -Wall -Wextra -Werror -std=c11

prog: prog.c
\tgcc $(CFLAGS) -o prog prog.c`,
    starter: `# TODO: define CFLAGS with -Wall -Wextra -Werror -std=c11
# TODO: target prog from prog.c whose recipe uses $(CFLAGS)`,
    tags: ['make', 'gcc', 'warnings'],
  },
  {
    id: 'lx-ch02-c-015',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Bug For The Debugger',
    prompt: `Write a complete program that contains an off-by-one bug: it sums an int array of 5 elements but its loop runs while i <= 5, reading one element past the end. Add a one-line C comment naming the gdb command you would use to set a breakpoint on main before stepping.

The point is the buggy loop plus the comment; do not fix the bug.`,
    hints: [
      'gdb break command: "break main" (or "b main").',
      'The loop condition i <= 5 reads a[5], one past the last valid index 4.',
    ],
    solution: `/* gdb: break main   then run and step */
#include <stdio.h>

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i <= 5; i++) { /* BUG: <= reads a[5] */
        sum += a[i];
    }
    printf("%d\\n", sum);
    return 0;
}`,
    starter: `/* TODO: comment naming the gdb command to break on main */
#include <stdio.h>

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i <= 5; i++) { /* keep this buggy loop */
        sum += a[i];
    }
    printf("%d\\n", sum);
    return 0;
}`,
    tags: ['gdb', 'debugging'],
  },
  {
    id: 'lx-ch02-c-016',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Compile With Debug Symbols',
    prompt: `To inspect variables by name in gdb you must compile with debug info. Write a Makefile target that builds debugme from debugme.c with debug symbols and no optimization, suitable for gdb. The recipe must run:

gcc -g -O0 -o debugme debugme.c

Name the target debugme and have it depend on debugme.c.`,
    hints: [
      '-g embeds debug symbols; -O0 disables optimization so stepping is clean.',
      'Recipe lines begin with a TAB.',
    ],
    solution: `debugme: debugme.c
\tgcc -g -O0 -o debugme debugme.c`,
    starter: `# TODO: target debugme from debugme.c
# recipe: gcc -g -O0 -o debugme debugme.c  (TAB-indented)`,
    tags: ['make', 'gdb', 'gcc'],
  },
  {
    id: 'lx-ch02-c-017',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Function With A Named Symbol',
    prompt: `nm lists the symbols in an object file. Write a program with a global int counter = 0, a function void bump(void) that increments it, and a main that calls bump twice and prints counter. Add a one-line C comment naming the command that lists the program's symbols.

Expected output:
2`,
    hints: [
      'nm a.out lists symbols; capital T marks a function in text, D an initialized global.',
      'A file-global variable and a function both appear as named symbols.',
    ],
    solution: `/* nm a.out   lists symbols (T=text/function, D=initialized global) */
#include <stdio.h>

int counter = 0;

void bump(void) {
    counter++;
}

int main(void) {
    bump();
    bump();
    printf("%d\\n", counter);
    return 0;
}`,
    starter: `/* TODO: comment naming the command that lists symbols */
#include <stdio.h>

int counter = 0;

void bump(void) {
    /* TODO: increment counter */
}

int main(void) {
    bump();
    bump();
    printf("%d\\n", counter);
    return 0;
}`,
    tags: ['nm', 'symbols'],
  },
  {
    id: 'lx-ch02-c-018',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Hide A Symbol With Static',
    prompt: `The static keyword on a file-scope function gives it internal linkage so it does NOT become a global symbol (nm would show it as lowercase t, not T). Write a program with a static helper function int triple(int x) and a main that prints triple(7). Add a one-line C comment explaining what static does to the symbol's linkage.

Expected output:
21`,
    hints: [
      'static at file scope = internal linkage, not visible to other translation units.',
      'In nm output, lowercase letters mean local (non-global) symbols.',
    ],
    solution: `/* static gives internal linkage: triple is local, nm shows lowercase t */
#include <stdio.h>

static int triple(int x) {
    return x * 3;
}

int main(void) {
    printf("%d\\n", triple(7));
    return 0;
}`,
    starter: `/* TODO: comment about static and linkage */
#include <stdio.h>

/* TODO: make triple a static function */
int triple(int x) {
    return x * 3;
}

int main(void) {
    printf("%d\\n", triple(7));
    return 0;
}`,
    tags: ['nm', 'symbols', 'linkage'],
  },
  {
    id: 'lx-ch02-c-019',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Disassemble One Function',
    prompt: `objdump -d disassembles a binary's machine code. Write a leaf function int add3(int a, int b, int c) that returns a + b + c, plus a main that prints add3(1, 2, 3). At the top put a one-line C comment giving the command that disassembles the compiled binary.

Expected output:
6`,
    hints: [
      'objdump -d a.out shows the disassembly of every section that holds code.',
      'Compiling with -g lets objdump interleave source via objdump -S.',
    ],
    solution: `/* objdump -d a.out   disassembles the machine code */
#include <stdio.h>

int add3(int a, int b, int c) {
    return a + b + c;
}

int main(void) {
    printf("%d\\n", add3(1, 2, 3));
    return 0;
}`,
    starter: `/* TODO: comment naming the disassembly command */
#include <stdio.h>

int add3(int a, int b, int c) {
    return a + b + c;
}

int main(void) {
    printf("%d\\n", add3(1, 2, 3));
    return 0;
}`,
    tags: ['objdump', 'disassembly'],
  },
  {
    id: 'lx-ch02-c-020',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Inspect The ELF Header',
    prompt: `readelf -h prints an executable's ELF header (type, machine, entry point). Write any small complete program (print "elf demo") and put a one-line C comment at the top naming the command that prints the ELF header of the resulting binary.

The program itself just needs to compile and run.`,
    hints: [
      'readelf -h <binary> prints the ELF header.',
      'readelf -S lists sections; -h is just the header.',
    ],
    solution: `/* readelf -h a.out   prints the ELF header */
#include <stdio.h>

int main(void) {
    printf("elf demo\\n");
    return 0;
}`,
    starter: `/* TODO: comment naming the readelf command for the ELF header */
#include <stdio.h>

int main(void) {
    printf("elf demo\\n");
    return 0;
}`,
    tags: ['readelf', 'elf'],
  },
  {
    id: 'lx-ch02-c-021',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Man Section 2 Versus 3',
    prompt: `Man pages are split into sections: section 2 is system calls (kernel entry points) and section 3 is library functions. Write a program that calls write directly (the syscall wrapper) to print "hi\\n" to standard output (file descriptor 1), and put one-line C comments naming the man command for write in section 2 and for printf in section 3.

Use write(1, "hi\\n", 3); from <unistd.h>.`,
    hints: [
      'man 2 write shows the system call; man 3 printf shows the library function.',
      'File descriptor 1 is standard output; write takes (fd, buffer, count).',
    ],
    solution: `/* man 2 write   -- the system call */
/* man 3 printf  -- the C library function */
#include <unistd.h>

int main(void) {
    write(1, "hi\\n", 3);
    return 0;
}`,
    starter: `/* TODO: comments for man 2 write and man 3 printf */
#include <unistd.h>

int main(void) {
    /* TODO: write "hi\\n" (3 bytes) to fd 1 */
    return 0;
}`,
    tags: ['man', 'syscall', 'unistd'],
  },
  {
    id: 'lx-ch02-c-022',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Look Up errno Constants',
    prompt: `When a system call fails it sets errno. Write a program that includes <errno.h> and <string.h>, sets errno = EACCES, and prints the human-readable message for it using strerror(errno). Add a one-line C comment naming the man page that documents errno's symbolic names (man 3 errno).

Example output (text may vary by system):
Permission denied`,
    hints: [
      'strerror(errno) returns the message string for an error number.',
      'man 3 errno lists the standard error codes like EACCES, ENOMEM, EINVAL.',
    ],
    solution: `/* man 3 errno   lists the symbolic error names */
#include <errno.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    errno = EACCES;
    printf("%s\\n", strerror(errno));
    return 0;
}`,
    starter: `/* TODO: comment naming the man page for errno */
#include <errno.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    errno = EACCES;
    /* TODO: print strerror(errno) */
    return 0;
}`,
    tags: ['man', 'errno', 'string'],
  },
  {
    id: 'lx-ch02-c-023',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pipeline-Friendly Filter',
    prompt: `Shell pipelines connect one program's stdout to the next's stdin. Write a filter that reads characters from stdin with getchar and writes each one back out in UPPERCASE (use toupper from <ctype.h>), until end of file. This lets "echo hello | ./prog" print HELLO.

Loop until getchar returns EOF.`,
    hints: [
      'getchar returns an int so it can hold EOF.',
      'toupper leaves non-letters unchanged.',
    ],
    solution: `#include <stdio.h>
#include <ctype.h>

int main(void) {
    int c;
    while ((c = getchar()) != EOF) {
        putchar(toupper(c));
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <ctype.h>

int main(void) {
    int c;
    /* TODO: read each char, write toupper(c), until EOF */
    return 0;
}`,
    tags: ['shell', 'pipeline', 'stdio'],
  },
  {
    id: 'lx-ch02-c-024',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Errors To stderr, Data To stdout',
    prompt: `In a pipeline, normal output goes to stdout and diagnostics go to stderr so they are not piped onward. Write a program that prints "result=42" to stdout and "warning: demo only" to stderr, then exits with code 0. Use printf for stdout and fprintf(stderr, ...) for stderr.`,
    hints: [
      'fprintf(stderr, ...) targets file descriptor 2.',
      'stdout is line/block buffered; stderr is unbuffered by default.',
    ],
    solution: `#include <stdio.h>

int main(void) {
    printf("result=42\\n");
    fprintf(stderr, "warning: demo only\\n");
    return 0;
}`,
    starter: `#include <stdio.h>

int main(void) {
    /* TODO: data line to stdout */
    /* TODO: warning line to stderr */
    return 0;
}`,
    tags: ['shell', 'stderr', 'stdio'],
  },
  {
    id: 'lx-ch02-c-025',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Source Files, One Program',
    prompt: `Show how the linker combines translation units. Provide two source files and one header:

1. math2.h   -- declares int areasq(int side);
2. math2.c   -- defines areasq returning side * side
3. main.c    -- includes math2.h, prints areasq(5)

Then give a one-line shell comment showing the single gcc command that compiles and links both .c files into one program. Expected runtime output: 25`,
    hints: [
      'gcc main.c math2.c -o prog compiles and links both in one step.',
      'The header lets main.c know areasq exists; the linker resolves it from math2.o.',
    ],
    solution: `/* math2.h */
#ifndef MATH2_H
#define MATH2_H
int areasq(int side);
#endif

/* math2.c */
#include "math2.h"
int areasq(int side) {
    return side * side;
}

/* main.c */
#include <stdio.h>
#include "math2.h"
int main(void) {
    printf("%d\\n", areasq(5));
    return 0;
}

/* build: gcc main.c math2.c -o prog */`,
    starter: `/* math2.h */
#ifndef MATH2_H
#define MATH2_H
/* TODO: prototype for areasq */
#endif

/* math2.c */
#include "math2.h"
/* TODO: define areasq */

/* main.c */
#include <stdio.h>
#include "math2.h"
int main(void) {
    printf("%d\\n", areasq(5));
    return 0;
}

/* TODO: one gcc command that compiles and links both files */`,
    tags: ['linking', 'translation-unit', 'gcc'],
  },
  {
    id: 'lx-ch02-c-026',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sharing A Global With extern',
    prompt: `A variable is defined once and DECLARED elsewhere with extern. Provide three files:

1. config.h -- contains: extern int verbose;  (a declaration, no storage)
2. config.c -- contains the single definition: int verbose = 1;
3. main.c   -- includes config.h and prints verbose

Expected output: 1. Use an include guard in the header.`,
    hints: [
      'extern int verbose; declares; int verbose = 1; defines (allocates storage).',
      'Defining the variable in the header would cause a multiple-definition link error.',
    ],
    solution: `/* config.h */
#ifndef CONFIG_H
#define CONFIG_H
extern int verbose;
#endif

/* config.c */
#include "config.h"
int verbose = 1;

/* main.c */
#include <stdio.h>
#include "config.h"
int main(void) {
    printf("%d\\n", verbose);
    return 0;
}`,
    starter: `/* config.h */
#ifndef CONFIG_H
#define CONFIG_H
/* TODO: extern declaration of verbose */
#endif

/* config.c */
#include "config.h"
/* TODO: the single definition of verbose = 1 */

/* main.c */
#include <stdio.h>
#include "config.h"
int main(void) {
    printf("%d\\n", verbose);
    return 0;
}`,
    tags: ['extern', 'linking', 'header'],
  },
  {
    id: 'lx-ch02-c-027',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Link The Math Library',
    prompt: `Functions like sqrt live in libm, which the linker only includes when you pass -lm. Write a program that includes <math.h>, computes sqrt(2.0), and prints it with %f. At the top put a one-line C comment with the build command that links the math library.

Example output:
1.414214`,
    hints: [
      'gcc prog.c -o prog -lm links libm.',
      'The -l flag goes after the source files on the command line.',
    ],
    solution: `/* gcc prog.c -o prog -lm   (links the math library) */
#include <stdio.h>
#include <math.h>

int main(void) {
    printf("%f\\n", sqrt(2.0));
    return 0;
}`,
    starter: `/* TODO: comment with the build command that links libm */
#include <stdio.h>
#include <math.h>

int main(void) {
    /* TODO: print sqrt(2.0) with %f */
    return 0;
}`,
    tags: ['linking', 'library', 'gcc'],
  },
  {
    id: 'lx-ch02-c-028',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Static Versus Dynamic Linking',
    prompt: `A program can link the C library dynamically (default, shared .so loaded at runtime) or statically (libc baked into the binary). Write any small complete program (print "linkdemo") and put TWO one-line C comments at the top: one showing the default dynamic build command, and one showing the fully static build command using -static.`,
    hints: [
      'Default: gcc prog.c -o prog uses dynamic linking.',
      'gcc -static prog.c -o prog produces a larger, self-contained binary.',
    ],
    solution: `/* dynamic (default): gcc prog.c -o prog */
/* static:            gcc -static prog.c -o prog */
#include <stdio.h>

int main(void) {
    printf("linkdemo\\n");
    return 0;
}`,
    starter: `/* TODO: comment for the dynamic (default) build */
/* TODO: comment for the static (-static) build */
#include <stdio.h>

int main(void) {
    printf("linkdemo\\n");
    return 0;
}`,
    tags: ['linking', 'static', 'dynamic'],
  },
  {
    id: 'lx-ch02-c-029',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'List Dynamic Dependencies',
    prompt: `ldd shows which shared libraries a dynamically linked binary needs at load time. Write any small complete program (print "deps") and put a one-line C comment at the top naming the command that lists its shared-library dependencies.

A normal dynamically linked program will show libc and the dynamic loader.`,
    hints: [
      'ldd <binary> prints the shared objects the binary depends on.',
      'A -static binary shows "not a dynamic executable" instead.',
    ],
    solution: `/* ldd a.out   lists the shared libraries needed at runtime */
#include <stdio.h>

int main(void) {
    printf("deps\\n");
    return 0;
}`,
    starter: `/* TODO: comment naming the command that lists shared deps */
#include <stdio.h>

int main(void) {
    printf("deps\\n");
    return 0;
}`,
    tags: ['linking', 'dynamic', 'ldd'],
  },
  {
    id: 'lx-ch02-c-030',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Makefile With Object Rules And Variables',
    prompt: `Write a Makefile that uses CC and CFLAGS variables and builds tool from two object files. It must contain:

- CC = gcc and CFLAGS = -Wall -g
- tool depending on main.o util.o, linked with $(CC) $(CFLAGS) -o tool main.o util.o
- main.o depending on main.c, built with $(CC) $(CFLAGS) -c main.c
- util.o depending on util.c, built with $(CC) $(CFLAGS) -c util.c
- a .PHONY clean removing tool and the .o files

Recipe lines must start with a TAB.`,
    hints: [
      'Use $(CC) and $(CFLAGS) in every recipe instead of hard-coding gcc.',
      '-c produces an object file; the final link step needs no -c.',
    ],
    solution: `CC = gcc
CFLAGS = -Wall -g

tool: main.o util.o
\t$(CC) $(CFLAGS) -o tool main.o util.o

main.o: main.c
\t$(CC) $(CFLAGS) -c main.c

util.o: util.c
\t$(CC) $(CFLAGS) -c util.c

.PHONY: clean
clean:
\trm -f tool main.o util.o`,
    starter: `# TODO: CC = gcc and CFLAGS = -Wall -g
# TODO: tool: main.o util.o  -> link step
# TODO: main.o: main.c -> compile step
# TODO: util.o: util.c -> compile step
# TODO: .PHONY clean removing tool and the .o files`,
    tags: ['make', 'build', 'object-file'],
  },
  {
    id: 'lx-ch02-c-031',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Automatic Variables In A Pattern Rule',
    prompt: `Makefiles avoid repetition with automatic variables and pattern rules. Write a Makefile with a pattern rule that turns any %.c into %.o, using the automatic variables $< (the first prerequisite) and $@ (the target). The recipe must be:

gcc -Wall -c $< -o $@

Recipe lines must begin with a TAB.`,
    hints: [
      '%.o: %.c is a pattern rule matching every object/source pair.',
      '$< expands to the prerequisite source, $@ to the target object.',
    ],
    solution: `%.o: %.c
\tgcc -Wall -c $< -o $@`,
    starter: `# TODO: pattern rule %.o: %.c
# recipe (TAB): gcc -Wall -c $< -o $@`,
    tags: ['make', 'pattern-rule', 'build'],
  },
  {
    id: 'lx-ch02-c-032',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Propagate A Failure Exit Code',
    prompt: `A program should report failure when a step fails. Write a program that takes one integer command-line argument (use atoi from <stdlib.h>). If no argument is given (argc < 2) or the integer is negative, print "bad input" to stderr and return EXIT_FAILURE; otherwise print its square to stdout and return EXIT_SUCCESS.

This makes it usable in shell pipelines and "&&" chains.`,
    hints: [
      'Check argc before touching argv[1].',
      'Return EXIT_FAILURE so the shell sees a non-zero $?.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "bad input\\n");
        return EXIT_FAILURE;
    }
    int n = atoi(argv[1]);
    if (n < 0) {
        fprintf(stderr, "bad input\\n");
        return EXIT_FAILURE;
    }
    printf("%d\\n", n * n);
    return EXIT_SUCCESS;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    /* TODO: fail (EXIT_FAILURE) if argc < 2 or the number is negative */
    /* TODO: otherwise print the square and return EXIT_SUCCESS */
}`,
    tags: ['shell', 'exit-code', 'stdlib'],
  },
  {
    id: 'lx-ch02-c-033',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Conditional Compilation With DEBUG',
    prompt: `Use the preprocessor to add debug logging that only compiles in when requested. Write a program that defines a DBG(msg) macro: if the macro DEBUG is defined it expands to fprintf(stderr, "[dbg] %s\\n", msg), otherwise it expands to nothing. In main call DBG("starting") then print "running". Add a one-line C comment showing the gcc flag that defines DEBUG.

Without DEBUG, only "running" prints.`,
    hints: [
      'gcc -DDEBUG prog.c defines the DEBUG macro on the command line.',
      'Use #ifdef DEBUG / #else / #endif to choose the two expansions.',
    ],
    solution: `/* enable with: gcc -DDEBUG prog.c */
#include <stdio.h>

#ifdef DEBUG
#define DBG(msg) fprintf(stderr, "[dbg] %s\\n", msg)
#else
#define DBG(msg) ((void)0)
#endif

int main(void) {
    DBG("starting");
    printf("running\\n");
    return 0;
}`,
    starter: `/* TODO: comment with the gcc flag that defines DEBUG */
#include <stdio.h>

/* TODO: #ifdef DEBUG define DBG to fprintf, #else define it to nothing */

int main(void) {
    DBG("starting");
    printf("running\\n");
    return 0;
}`,
    tags: ['preprocessor', 'conditional', 'gcc'],
  },
  {
    id: 'lx-ch02-c-034',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Inspect Symbols Of A Multi-Function Program',
    prompt: `Write a program with three functions: a public int api_get(void) returning 100, a static helper int internal_scale(int v) returning v * 2, and main printing api_get(). Add a one-line C comment explaining what you would expect nm to show for api_get versus internal_scale (one global T symbol, one local t symbol).

Expected runtime output:
100`,
    hints: [
      'Non-static functions get external linkage and show as T in nm.',
      'static functions get internal linkage and show as lowercase t.',
    ],
    solution: `/* nm: api_get -> T (global), internal_scale -> t (local, static) */
#include <stdio.h>

int api_get(void) {
    return 100;
}

static int internal_scale(int v) {
    return v * 2;
}

int main(void) {
    (void)internal_scale;
    printf("%d\\n", api_get());
    return 0;
}`,
    starter: `/* TODO: comment about nm output for api_get vs internal_scale */
#include <stdio.h>

int api_get(void) {
    return 100;
}

/* TODO: make internal_scale static */
int internal_scale(int v) {
    return v * 2;
}

int main(void) {
    (void)internal_scale;
    printf("%d\\n", api_get());
    return 0;
}`,
    tags: ['nm', 'symbols', 'linkage'],
  },
  {
    id: 'lx-ch02-c-035',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Small Multi-File Project With A Makefile',
    prompt: `Tie the topic together. Build a project that computes the dot product of two length-3 int arrays. Provide:

1. vec.h   -- include-guarded prototype: int dot(const int *a, const int *b, int n);
2. vec.c   -- defines dot summing a[i] * b[i]
3. main.c  -- includes vec.h, calls dot on {1,2,3} and {4,5,6} with n=3, prints it (expected 32)
4. A Makefile with a %.o: %.c pattern rule, a target prog linking main.o vec.o, and a .PHONY clean.

Recipe lines start with a TAB.`,
    hints: [
      'dot loops i from 0 to n-1 accumulating a[i] * b[i].',
      'The Makefile links the two object files; the pattern rule builds each .o.',
    ],
    solution: `/* vec.h */
#ifndef VEC_H
#define VEC_H
int dot(const int *a, const int *b, int n);
#endif

/* vec.c */
#include "vec.h"
int dot(const int *a, const int *b, int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i] * b[i];
    }
    return s;
}

/* main.c */
#include <stdio.h>
#include "vec.h"
int main(void) {
    int a[3] = {1, 2, 3};
    int b[3] = {4, 5, 6};
    printf("%d\\n", dot(a, b, 3));
    return 0;
}

/* Makefile
prog: main.o vec.o
\tgcc -Wall -o prog main.o vec.o

%.o: %.c
\tgcc -Wall -c $< -o $@

.PHONY: clean
clean:
\trm -f prog main.o vec.o
*/`,
    starter: `/* vec.h */
#ifndef VEC_H
#define VEC_H
/* TODO: prototype for dot */
#endif

/* vec.c */
#include "vec.h"
/* TODO: define dot */

/* main.c */
#include <stdio.h>
#include "vec.h"
int main(void) {
    int a[3] = {1, 2, 3};
    int b[3] = {4, 5, 6};
    /* TODO: print dot(a, b, 3) */
    return 0;
}

/* Makefile: pattern rule + link prog + .PHONY clean -- TODO */`,
    tags: ['make', 'header', 'project'],
  },
]

export default problems
