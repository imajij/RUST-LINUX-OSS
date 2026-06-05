import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch03-c-001',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Your Own PID',
    prompt: `Write a complete C program that prints its own process ID using getpid(), in exactly this form (the number will vary):

My PID is 1234

Include the right header so getpid() is declared.`,
    hints: [
      'getpid() is declared in <unistd.h> and returns a pid_t.',
      'pid_t is an integer type; print it with %d after a cast to int.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = getpid();
    printf("My PID is %d\\n", (int)pid);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    // TODO: get this process's PID and print it
    return 0;
}`,
    tags: ['process', 'pid', 'getpid'],
  },
  {
    id: 'lx-ch03-c-002',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print PID And Parent PID',
    prompt: `Write a C program that prints both its own PID and its parent's PID, one per line:

PID: 1234
PPID: 1000

Use getpid() and getppid().`,
    hints: [
      'getppid() returns the parent process ID.',
      'Both functions live in <unistd.h>.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("PID: %d\\n", (int)getpid());
    printf("PPID: %d\\n", (int)getppid());
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    // TODO: print PID then PPID
    return 0;
}`,
    tags: ['process', 'pid', 'getppid'],
  },
  {
    id: 'lx-ch03-c-003',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'First fork',
    prompt: `Write a C program that calls fork() once. The child must print exactly:

I am the child

and the parent must print exactly:

I am the parent

Use the return value of fork() to tell which process you are. (Order of the two lines does not matter.)`,
    hints: [
      'fork() returns 0 in the child and the child PID (a positive number) in the parent.',
      'A simple if/else on the return value separates the two paths.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        printf("I am the child\\n");
    } else {
        printf("I am the parent\\n");
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    // TODO: branch on pid to print the right message
    return 0;
}`,
    tags: ['process', 'fork', 'parent-child'],
  },
  {
    id: 'lx-ch03-c-004',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Check fork For Failure',
    prompt: `fork() returns -1 on failure. Write a C program that calls fork(), and if it returns -1, prints "fork failed" to stderr and exits with status 1. Otherwise the child prints "child" and the parent prints "parent".`,
    hints: [
      'Compare the return value to -1 before assuming success.',
      'Use fprintf(stderr, ...) for the error message.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    if (pid == -1) {
        fprintf(stderr, "fork failed\\n");
        return 1;
    }
    if (pid == 0) {
        printf("child\\n");
    } else {
        printf("parent\\n");
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    // TODO: handle pid == -1, then split child/parent
    return 0;
}`,
    tags: ['process', 'fork', 'error-handling'],
  },
  {
    id: 'lx-ch03-c-005',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Child Prints Its Own PID',
    prompt: `Write a C program where, after fork(), the child prints its own PID and the parent prints the child's PID. Expected lines (numbers vary):

parent: child pid is 1235
child: my pid is 1235

The parent learns the child PID from fork()'s return value; the child uses getpid().`,
    hints: [
      "fork() returns the child's PID to the parent.",
      'In the child, call getpid() to get the same number.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        printf("child: my pid is %d\\n", (int)getpid());
    } else if (pid > 0) {
        printf("parent: child pid is %d\\n", (int)pid);
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    // TODO: parent prints pid, child prints getpid()
    return 0;
}`,
    tags: ['process', 'fork', 'pid'],
  },
  {
    id: 'lx-ch03-c-006',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Exit With A Status Code',
    prompt: `Write a C program that exits with status code 7. Do not print anything. After running, "echo $?" in the shell should show 7.`,
    hints: [
      'main returning an int sets the exit status.',
      'You can also call exit(7) from <stdlib.h>.',
    ],
    solution: `#include <stdlib.h>

int main(void) {
    exit(7);
}`,
    starter: `#include <stdlib.h>

int main(void) {
    // TODO: exit with status 7
    return 0;
}`,
    tags: ['process', 'exit', 'status'],
  },
  {
    id: 'lx-ch03-c-007',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Parent Waits For Child',
    prompt: `Write a C program that forks. The child prints "child done" and exits. The parent calls wait() so it does not finish until the child has terminated, then prints "parent done". The two lines must appear in this order:

child done
parent done`,
    hints: [
      'wait(NULL) blocks until any child terminates.',
      'wait() is declared in <sys/wait.h>.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        printf("child done\\n");
    } else if (pid > 0) {
        wait(NULL);
        printf("parent done\\n");
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    // TODO: child prints, parent waits then prints
    return 0;
}`,
    tags: ['process', 'wait', 'fork'],
  },
  {
    id: 'lx-ch03-c-008',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read The Child Exit Status',
    prompt: `Write a C program where the child exits with status 42. The parent waits for it and prints the exit status it observed:

child exited with 42

Use waitpid() (or wait()) with an int status variable and the WIFEXITED / WEXITSTATUS macros.`,
    hints: [
      'Pass &status to wait/waitpid to capture the encoded status.',
      'If WIFEXITED(status) is true, WEXITSTATUS(status) gives the code passed to exit().',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        exit(42);
    }
    int status;
    waitpid(pid, &status, 0);
    if (WIFEXITED(status)) {
        printf("child exited with %d\\n", WEXITSTATUS(status));
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        // TODO: exit with 42
    }
    int status;
    // TODO: wait and decode the status
    return 0;
}`,
    tags: ['process', 'waitpid', 'exit-status'],
  },
  {
    id: 'lx-ch03-c-009',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Replace The Image With exec',
    prompt: `Write a C program that immediately replaces itself with /bin/echo printing the word "hi". Use execl(). If execl returns, print "exec failed" to stderr. (A successful exec never returns.)`,
    hints: [
      'execl(path, arg0, arg1, ..., (char*)NULL) — the argument list must end with a NULL pointer.',
      'arg0 is conventionally the program name; the rest are the program arguments.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    execl("/bin/echo", "echo", "hi", (char *)NULL);
    fprintf(stderr, "exec failed\\n");
    return 1;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    // TODO: execl /bin/echo to print "hi"
    fprintf(stderr, "exec failed\\n");
    return 1;
}`,
    tags: ['process', 'exec', 'execl'],
  },
  {
    id: 'lx-ch03-c-010',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Open, Print FD, Close',
    prompt: `Write a C program that opens the file "/etc/hostname" for reading with open(), prints the returned file descriptor number (an integer), then closes it. Expected output (the number varies but is usually 3):

fd = 3`,
    hints: [
      'open() returns a small non-negative integer file descriptor.',
      'open() is declared in <fcntl.h>; use the O_RDONLY flag.',
    ],
    solution: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/etc/hostname", O_RDONLY);
    printf("fd = %d\\n", fd);
    close(fd);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    // TODO: open /etc/hostname, print the fd, close it
    return 0;
}`,
    tags: ['fd', 'open', 'close'],
  },
  {
    id: 'lx-ch03-c-011',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Write To stdout By Descriptor',
    prompt: `Write a C program that uses the raw write() system call (not printf) to write the bytes "hello\\n" directly to file descriptor 1 (standard output).`,
    hints: [
      'Standard output is always file descriptor 1 (STDOUT_FILENO).',
      "write(fd, buf, count) — count is the number of bytes to write.",
    ],
    solution: `#include <unistd.h>
#include <string.h>

int main(void) {
    const char *msg = "hello\\n";
    write(STDOUT_FILENO, msg, strlen(msg));
    return 0;
}`,
    starter: `#include <unistd.h>
#include <string.h>

int main(void) {
    const char *msg = "hello\\n";
    // TODO: write msg to fd 1 with write()
    return 0;
}`,
    tags: ['syscall', 'write', 'fd'],
  },
  {
    id: 'lx-ch03-c-012',
    chapter: 3,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print errno After A Failed open',
    prompt: `Write a C program that tries to open() a file that does not exist ("/no/such/file") for reading. When open() returns -1, print the numeric errno value:

errno = 2

(errno 2 is ENOENT.) Include <errno.h>.`,
    hints: [
      'On failure, system calls return -1 and set the global errno.',
      'errno is an int declared in <errno.h>; do not read it unless the call actually failed.',
    ],
    solution: `#include <stdio.h>
#include <fcntl.h>
#include <errno.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    if (fd == -1) {
        printf("errno = %d\\n", errno);
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <fcntl.h>
#include <errno.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    // TODO: if fd == -1, print errno
    return 0;
}`,
    tags: ['errno', 'open', 'error-handling'],
  },
  {
    id: 'lx-ch03-c-013',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Report Errors With perror',
    prompt: `Write a C program that calls open("/no/such/file", O_RDONLY). If it fails, use perror("open") to print a human-readable message (it prints "open: " followed by the strerror text for errno) and exit with status 1. On success, close the fd and exit 0.`,
    hints: [
      'perror prints your prefix, a colon, a space, and the message for the current errno.',
      'Call perror immediately after the failing call so errno is still meaningful.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    close(fd);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    // TODO: on failure, perror("open") and return 1
    return 0;
}`,
    tags: ['errno', 'perror', 'error-handling'],
  },
  {
    id: 'lx-ch03-c-014',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Translate errno With strerror',
    prompt: `Write a C program that opens a missing file ("/no/such/file"). On failure, save errno into a local int first, then print:

open failed: No such file or directory

using strerror() from <string.h> to convert the errno you saved into text.`,
    hints: [
      'strerror(int errnum) returns a pointer to the message for that error number.',
      'Copy errno into a local variable right after the failing call; later calls can overwrite errno.',
    ],
    solution: `#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    if (fd == -1) {
        int e = errno;
        printf("open failed: %s\\n", strerror(e));
        return 1;
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    if (fd == -1) {
        // TODO: save errno, print with strerror
    }
    return 0;
}`,
    tags: ['errno', 'strerror', 'error-handling'],
  },
  {
    id: 'lx-ch03-c-015',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'fork Twice, Wait For Both',
    prompt: `Write a C program where the parent forks two children. Each child prints "child N done" (N is 1 or 2) and exits. The parent waits for both children (call wait() until it returns -1 / no more children) and then prints "all children done". The final line must appear after both child lines.`,
    hints: [
      'Loop wait(NULL) until it returns -1 to reap every child.',
      'Make sure each child exits inside its own branch so it does not fork again.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    for (int i = 1; i <= 2; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            printf("child %d done\\n", i);
            exit(0);
        }
    }
    while (wait(NULL) > 0) {
        /* reap each child */
    }
    printf("all children done\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    for (int i = 1; i <= 2; i++) {
        pid_t pid = fork();
        // TODO: child prints and exits
    }
    // TODO: wait for all children, then print "all children done"
    return 0;
}`,
    tags: ['process', 'fork', 'wait'],
  },
  {
    id: 'lx-ch03-c-016',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'fork Then exec A Command',
    prompt: `Write a C program that forks a child. The child runs "/bin/ls -l" via execlp(). The parent waits for the child and then prints "ls finished". If exec fails in the child, the child must print an error and exit non-zero (do NOT let the child fall through and also run the parent code).`,
    hints: [
      'execlp searches PATH and replaces the child image; it returns only on failure.',
      'After exec in the child, call perror and exit() so the child never continues.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == -1) {
        perror("fork");
        return 1;
    }
    if (pid == 0) {
        execlp("ls", "ls", "-l", (char *)NULL);
        perror("execlp");
        exit(127);
    }
    wait(NULL);
    printf("ls finished\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        // TODO: exec ls -l, then handle exec failure
    }
    // TODO: parent waits, then prints "ls finished"
    return 0;
}`,
    tags: ['process', 'fork', 'exec'],
  },
  {
    id: 'lx-ch03-c-017',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'exec With An argv Array',
    prompt: `Write a C program that uses execvp() (the vector form) to run "/bin/echo one two three". Build a char *argv[] array ending in NULL: {"echo", "one", "two", "three", NULL}. Print "exec failed" to stderr if execvp returns.`,
    hints: [
      'execvp(file, argv) takes a NULL-terminated array of strings.',
      'argv[0] is the program name shown to the new program; the array must end with NULL.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    char *argv[] = {"echo", "one", "two", "three", NULL};
    execvp("echo", argv);
    fprintf(stderr, "exec failed\\n");
    return 1;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    char *argv[] = { /* TODO: echo one two three, NULL-terminated */ };
    // TODO: execvp("echo", argv)
    fprintf(stderr, "exec failed\\n");
    return 1;
}`,
    tags: ['process', 'exec', 'execvp'],
  },
  {
    id: 'lx-ch03-c-018',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Detect A Child Killed By A Signal',
    prompt: `Write a C program that forks a child which kills itself with raise(SIGKILL). The parent waits and reports whether the child exited normally or was killed:

child killed by signal 9

Use WIFSIGNALED(status) and WTERMSIG(status).`,
    hints: [
      'A child terminated by a signal makes WIFSIGNALED(status) true.',
      'WTERMSIG(status) gives the signal number; SIGKILL is 9.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        raise(SIGKILL);
        exit(0); /* not reached */
    }
    int status;
    waitpid(pid, &status, 0);
    if (WIFSIGNALED(status)) {
        printf("child killed by signal %d\\n", WTERMSIG(status));
    } else if (WIFEXITED(status)) {
        printf("child exited with %d\\n", WEXITSTATUS(status));
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        // TODO: raise SIGKILL
    }
    int status;
    waitpid(pid, &status, 0);
    // TODO: report killed-by-signal vs exited
    return 0;
}`,
    tags: ['process', 'signal', 'wait-status'],
  },
  {
    id: 'lx-ch03-c-019',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Install A SIGINT Handler',
    prompt: `Write a C program that installs a handler for SIGINT using signal(). The handler should set a volatile sig_atomic_t flag to 1. main() loops with pause() (or a sleep loop) until the flag is set, then prints "caught SIGINT" and exits. (Inside the handler, only touch the flag — printf is not async-signal-safe.)`,
    hints: [
      'Use "volatile sig_atomic_t" for a flag shared with a handler.',
      'Do NOT call printf inside the handler; do the printing back in main after the loop ends.',
      'pause() returns when a signal handler runs.',
    ],
    solution: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

static volatile sig_atomic_t got_sigint = 0;

static void handler(int sig) {
    (void)sig;
    got_sigint = 1;
}

int main(void) {
    signal(SIGINT, handler);
    while (!got_sigint) {
        pause();
    }
    printf("caught SIGINT\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

static volatile sig_atomic_t got_sigint = 0;

static void handler(int sig) {
    // TODO: set the flag (and nothing unsafe)
}

int main(void) {
    // TODO: install handler, loop until flag, then print
    return 0;
}`,
    tags: ['signal', 'handler', 'async-safe'],
  },
  {
    id: 'lx-ch03-c-020',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Send A Signal With kill',
    prompt: `Write a C program that forks a child. The child installs a SIGUSR1 handler that sets a flag, then loops on pause() until the flag is set and prints "child got SIGUSR1". The parent sleeps briefly, sends SIGUSR1 to the child with kill(childpid, SIGUSR1), then waits for the child.`,
    hints: [
      'kill(pid, sig) sends a signal to the process with that PID.',
      "The parent knows the child's PID from fork()'s return value.",
      'Keep the handler tiny: just set a volatile sig_atomic_t flag.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

static volatile sig_atomic_t got = 0;
static void handler(int sig) { (void)sig; got = 1; }

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        signal(SIGUSR1, handler);
        while (!got) pause();
        printf("child got SIGUSR1\\n");
        _exit(0);
    }
    sleep(1);
    kill(pid, SIGUSR1);
    wait(NULL);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

static volatile sig_atomic_t got = 0;
static void handler(int sig) { (void)sig; got = 1; }

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        // TODO: install handler, wait for flag, print
    }
    // TODO: parent sleeps, kill(pid, SIGUSR1), wait
    return 0;
}`,
    tags: ['signal', 'kill', 'fork'],
  },
  {
    id: 'lx-ch03-c-021',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Ignore SIGINT',
    prompt: `Write a C program that ignores SIGINT by calling signal(SIGINT, SIG_IGN), prints "ignoring SIGINT for 3 seconds", sleeps for 3 seconds (Ctrl-C should NOT terminate it during that time), then prints "done".`,
    hints: [
      'SIG_IGN is a special handler value meaning "ignore this signal".',
      'While SIGINT is ignored, pressing Ctrl-C has no effect on the process.',
    ],
    solution: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

int main(void) {
    signal(SIGINT, SIG_IGN);
    printf("ignoring SIGINT for 3 seconds\\n");
    fflush(stdout);
    sleep(3);
    printf("done\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

int main(void) {
    // TODO: ignore SIGINT, print, sleep 3, print done
    return 0;
}`,
    tags: ['signal', 'sig-ign', 'sigint'],
  },
  {
    id: 'lx-ch03-c-022',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read A File With read()',
    prompt: `Write a C program that opens "/etc/hostname" with open(), reads up to 256 bytes into a buffer with read(), and writes exactly the bytes that were read to standard output using write(STDOUT_FILENO, buf, n). Use the return value of read() as the byte count. Close the fd at the end.`,
    hints: [
      'read() returns the number of bytes actually read (may be fewer than requested), or -1 on error.',
      'Write only n bytes, where n is read()\'s return value — not the whole buffer.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/etc/hostname", O_RDONLY);
    if (fd == -1) return 1;
    char buf[256];
    ssize_t n = read(fd, buf, sizeof(buf));
    if (n > 0) {
        write(STDOUT_FILENO, buf, (size_t)n);
    }
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/etc/hostname", O_RDONLY);
    char buf[256];
    // TODO: read up to 256 bytes, write the bytes that were read
    close(fd);
    return 0;
}`,
    tags: ['syscall', 'read', 'fd'],
  },
  {
    id: 'lx-ch03-c-023',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Copy A File Descriptor With dup2',
    prompt: `Write a C program that opens "out.txt" for writing (O_WRONLY|O_CREAT|O_TRUNC, mode 0644), redirects standard output to it with dup2(fd, STDOUT_FILENO), then uses printf to write "redirected\\n". After dup2, close the original fd. (When run, "redirected" should land in out.txt, not the terminal.)`,
    hints: [
      'dup2(oldfd, newfd) makes newfd refer to the same open file as oldfd.',
      'After dup2, fd 1 points at the file, so printf goes there; the original fd can be closed.',
      'fflush(stdout) before exit to make sure buffered output is written.',
    ],
    solution: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) return 1;
    dup2(fd, STDOUT_FILENO);
    close(fd);
    printf("redirected\\n");
    fflush(stdout);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    // TODO: dup2 fd onto STDOUT_FILENO, close fd, printf
    return 0;
}`,
    tags: ['fd', 'dup2', 'redirect'],
  },
  {
    id: 'lx-ch03-c-024',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Pipe Within One Process',
    prompt: `Write a C program that creates a pipe with pipe(int fds[2]), writes the string "ping" into the write end fds[1], reads it back from the read end fds[0] into a buffer, and prints what it read:

got: ping

Close both ends when done.`,
    hints: [
      'pipe() fills fds[0] (read end) and fds[1] (write end).',
      "Read returns the byte count; null-terminate the buffer before printing as a string.",
    ],
    solution: `#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    int fds[2];
    if (pipe(fds) == -1) return 1;
    write(fds[1], "ping", 4);
    char buf[16];
    ssize_t n = read(fds[0], buf, sizeof(buf) - 1);
    if (n > 0) {
        buf[n] = '\\0';
        printf("got: %s\\n", buf);
    }
    close(fds[0]);
    close(fds[1]);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    int fds[2];
    // TODO: pipe(), write "ping", read back, print "got: ..."
    return 0;
}`,
    tags: ['pipe', 'ipc', 'fd'],
  },
  {
    id: 'lx-ch03-c-025',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pipe Between Parent And Child',
    prompt: `Write a C program that creates a pipe, then forks. The child closes the read end, writes "hello from child" to the write end, and exits. The parent closes the write end, reads from the read end, prints what it received, and waits for the child. Each process must close the pipe end it does not use.`,
    hints: [
      'Create the pipe BEFORE fork() so both processes inherit the fds.',
      'Each side closes the end it will not use, so the reader sees EOF when the writer is done.',
      'Read returns 0 at EOF once the write end is closed everywhere.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    if (pipe(fds) == -1) return 1;
    pid_t pid = fork();
    if (pid == 0) {
        close(fds[0]);
        const char *msg = "hello from child";
        write(fds[1], msg, strlen(msg));
        close(fds[1]);
        _exit(0);
    }
    close(fds[1]);
    char buf[64];
    ssize_t n = read(fds[0], buf, sizeof(buf) - 1);
    if (n > 0) {
        buf[n] = '\\0';
        printf("parent received: %s\\n", buf);
    }
    close(fds[0]);
    wait(NULL);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    if (pipe(fds) == -1) return 1;
    pid_t pid = fork();
    if (pid == 0) {
        // TODO: child closes read end, writes, exits
    }
    // TODO: parent closes write end, reads, prints, waits
    return 0;
}`,
    tags: ['pipe', 'fork', 'ipc'],
  },
  {
    id: 'lx-ch03-c-026',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read Your PID From /proc/self/stat',
    prompt: `Write a C program that opens "/proc/self/status" for reading and prints just the first line, which looks like:

Name:\tprogname

Read a chunk, then print only the bytes up to and including the first newline. (/proc is the kernel's process-view filesystem.)`,
    hints: [
      '/proc/self refers to the calling process itself.',
      'You can read a buffer and scan for the first \\n to bound the first line.',
    ],
    solution: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/proc/self/status", O_RDONLY);
    if (fd == -1) return 1;
    char buf[256];
    ssize_t n = read(fd, buf, sizeof(buf));
    close(fd);
    for (ssize_t i = 0; i < n; i++) {
        putchar(buf[i]);
        if (buf[i] == '\\n') break;
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/proc/self/status", O_RDONLY);
    char buf[256];
    ssize_t n = read(fd, buf, sizeof(buf));
    close(fd);
    // TODO: print bytes up to and including the first newline
    return 0;
}`,
    tags: ['proc', 'process', 'read'],
  },
  {
    id: 'lx-ch03-c-027',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build A /proc Path For A PID',
    prompt: `Write a C program with the signature:

int proc_comm_path(char *out, size_t outsz, pid_t pid);

It should write the path "/proc/<pid>/comm" into out (a buffer of size outsz) using snprintf, and return the number of characters that would have been written (snprintf's return value). In main(), call it with getpid() and print the resulting path.`,
    hints: [
      'snprintf(out, outsz, "/proc/%d/comm", (int)pid) never overflows the buffer.',
      "snprintf returns how many characters the full string needs, excluding the terminating NUL.",
    ],
    solution: `#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int proc_comm_path(char *out, size_t outsz, pid_t pid) {
    return snprintf(out, outsz, "/proc/%d/comm", (int)pid);
}

int main(void) {
    char path[64];
    proc_comm_path(path, sizeof(path), getpid());
    printf("%s\\n", path);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int proc_comm_path(char *out, size_t outsz, pid_t pid) {
    // TODO: format "/proc/<pid>/comm" with snprintf and return its result
    return 0;
}

int main(void) {
    char path[64];
    proc_comm_path(path, sizeof(path), getpid());
    printf("%s\\n", path);
    return 0;
}`,
    tags: ['proc', 'snprintf', 'process'],
  },
  {
    id: 'lx-ch03-c-028',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read /proc/<pid>/comm',
    prompt: `Write a C program that builds the path "/proc/self/comm", opens it, reads the process command name into a buffer, and prints:

comm: <name>

The file's contents end with a newline; strip that trailing newline before printing.`,
    hints: [
      '/proc/self/comm holds the short command name followed by a newline.',
      'After reading n bytes, if the last byte is \\n, replace it with \\0.',
    ],
    solution: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/proc/self/comm", O_RDONLY);
    if (fd == -1) return 1;
    char buf[64];
    ssize_t n = read(fd, buf, sizeof(buf) - 1);
    close(fd);
    if (n <= 0) return 1;
    if (buf[n - 1] == '\\n') n--;
    buf[n] = '\\0';
    printf("comm: %s\\n", buf);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("/proc/self/comm", O_RDONLY);
    char buf[64];
    ssize_t n = read(fd, buf, sizeof(buf) - 1);
    close(fd);
    // TODO: strip trailing newline, print "comm: <name>"
    return 0;
}`,
    tags: ['proc', 'process', 'read'],
  },
  {
    id: 'lx-ch03-c-029',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Make A Raw Syscall With syscall()',
    prompt: `Write a C program that invokes getpid via the generic syscall() interface instead of the libc wrapper: call syscall(SYS_getpid) and print the result:

raw getpid = 1234

Include <sys/syscall.h> and <unistd.h>. This shows how user mode traps into the kernel by syscall number.`,
    hints: [
      'syscall(number, args...) issues the raw system call identified by that number.',
      'SYS_getpid is the syscall number macro from <sys/syscall.h>.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>
#include <sys/syscall.h>

int main(void) {
    long pid = syscall(SYS_getpid);
    printf("raw getpid = %ld\\n", pid);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>
#include <sys/syscall.h>

int main(void) {
    // TODO: call syscall(SYS_getpid) and print the result
    return 0;
}`,
    tags: ['syscall', 'kernel-mode', 'getpid'],
  },
  {
    id: 'lx-ch03-c-030',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Check errno After A Raw syscall',
    prompt: `Write a C program that makes a deliberately bad raw write via syscall: syscall(SYS_write, -1, "x", 1) (fd -1 is invalid). The raw call returns -1 and sets errno. Print:

raw write failed, errno = 9

(errno 9 is EBADF, bad file descriptor.) Use the syscall() wrapper, which sets errno on failure just like a normal call.`,
    hints: [
      'The glibc syscall() wrapper returns -1 and sets errno on error, like libc wrappers do.',
      'EBADF (9) means the file descriptor is not valid.',
    ],
    solution: `#include <stdio.h>
#include <errno.h>
#include <unistd.h>
#include <sys/syscall.h>

int main(void) {
    long r = syscall(SYS_write, -1, "x", (size_t)1);
    if (r == -1) {
        printf("raw write failed, errno = %d\\n", errno);
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <errno.h>
#include <unistd.h>
#include <sys/syscall.h>

int main(void) {
    long r = syscall(SYS_write, -1, "x", (size_t)1);
    // TODO: if r == -1, print the errno value
    return 0;
}`,
    tags: ['syscall', 'errno', 'kernel-mode'],
  },
  {
    id: 'lx-ch03-c-031',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Retry read On EINTR',
    prompt: `A signal can interrupt a blocking read(), making it return -1 with errno == EINTR. Write a C function:

ssize_t read_retry(int fd, void *buf, size_t count);

that calls read() in a loop, retrying whenever it fails with errno == EINTR, and returns the first non-EINTR result (whether success, EOF 0, or a real error). Demonstrate it in main reading from fd 0 or from a file.`,
    hints: [
      'EINTR means "interrupted by a signal handler before any data was transferred" — just call read() again.',
      'Only retry on EINTR; return immediately for any other error or for a normal/EOF result.',
    ],
    solution: `#include <unistd.h>
#include <errno.h>
#include <fcntl.h>

ssize_t read_retry(int fd, void *buf, size_t count) {
    ssize_t n;
    do {
        n = read(fd, buf, count);
    } while (n == -1 && errno == EINTR);
    return n;
}

int main(void) {
    int fd = open("/etc/hostname", O_RDONLY);
    if (fd == -1) return 1;
    char buf[128];
    ssize_t n = read_retry(fd, buf, sizeof(buf));
    if (n > 0) write(STDOUT_FILENO, buf, (size_t)n);
    close(fd);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <errno.h>
#include <fcntl.h>

ssize_t read_retry(int fd, void *buf, size_t count) {
    // TODO: loop read(), retry only while errno == EINTR
    return -1;
}

int main(void) {
    // TODO: open a file and call read_retry
    return 0;
}`,
    tags: ['syscall', 'errno', 'eintr'],
  },
  {
    id: 'lx-ch03-c-032',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Write All Bytes With A write Loop',
    prompt: `write() may transfer fewer bytes than requested (a short write). Write a C function:

int write_all(int fd, const char *buf, size_t count);

that loops calling write() until all "count" bytes are written, advancing the buffer pointer and decrementing the remaining count each time. Return 0 on success, -1 if any write() returns -1. Demonstrate it writing a message to fd 1.`,
    hints: [
      'Track how many bytes remain and where the next chunk starts.',
      "Add write()'s return value to the offset and subtract it from the remaining count each iteration.",
    ],
    solution: `#include <unistd.h>
#include <string.h>

int write_all(int fd, const char *buf, size_t count) {
    size_t off = 0;
    while (off < count) {
        ssize_t n = write(fd, buf + off, count - off);
        if (n == -1) return -1;
        off += (size_t)n;
    }
    return 0;
}

int main(void) {
    const char *msg = "all bytes written\\n";
    write_all(STDOUT_FILENO, msg, strlen(msg));
    return 0;
}`,
    starter: `#include <unistd.h>
#include <string.h>

int write_all(int fd, const char *buf, size_t count) {
    // TODO: loop until all bytes are written; return 0 or -1
    return 0;
}

int main(void) {
    const char *msg = "all bytes written\\n";
    write_all(STDOUT_FILENO, msg, strlen(msg));
    return 0;
}`,
    tags: ['syscall', 'write', 'short-write'],
  },
  {
    id: 'lx-ch03-c-033',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pipe A Child Command Into The Parent',
    prompt: `Write a C program that creates a pipe and forks. The child redirects its stdout to the pipe's write end with dup2(), then execs "/bin/echo hello-from-exec". The parent reads everything from the pipe and prints what the exec'd command produced, prefixed with "captured: ". Remember to close unused pipe ends in each process and wait for the child.`,
    hints: [
      "dup2(fds[1], STDOUT_FILENO) makes the child's stdout go into the pipe, so exec'd output is captured.",
      'Close the pipe write end in the parent so read sees EOF when the child finishes.',
      'exec replaces the image but inherited file descriptors (including the dup2-ed stdout) survive.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    if (pipe(fds) == -1) return 1;
    pid_t pid = fork();
    if (pid == 0) {
        close(fds[0]);
        dup2(fds[1], STDOUT_FILENO);
        close(fds[1]);
        execlp("echo", "echo", "hello-from-exec", (char *)NULL);
        _exit(127);
    }
    close(fds[1]);
    char buf[128];
    ssize_t n;
    printf("captured: ");
    while ((n = read(fds[0], buf, sizeof(buf))) > 0) {
        write(STDOUT_FILENO, buf, (size_t)n);
    }
    close(fds[0]);
    wait(NULL);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    if (pipe(fds) == -1) return 1;
    pid_t pid = fork();
    if (pid == 0) {
        // TODO: redirect stdout to pipe write end, exec echo
    }
    // TODO: read pipe, print "captured: ...", wait
    return 0;
}`,
    tags: ['pipe', 'exec', 'dup2'],
  },
  {
    id: 'lx-ch03-c-034',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Run A Command And Report Its Exit Status',
    prompt: `Write a C function:

int run(const char *path, char *const argv[]);

that forks, execs the program at path with argv in the child, and in the parent waits for it. If the child exited normally, return its exit status (WEXITSTATUS); if it was killed by a signal, return 128 + signal number; if fork or exec fails, return -1. Demonstrate it by running "/bin/true" and printing the returned status.`,
    hints: [
      'In the child, if execv() returns, the exec failed — _exit with a sentinel like 127.',
      'In the parent, decode wait status: WIFEXITED -> WEXITSTATUS; WIFSIGNALED -> 128 + WTERMSIG.',
      'Shells use the 128+signal convention to report signal-terminated commands.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int run(const char *path, char *const argv[]) {
    pid_t pid = fork();
    if (pid == -1) return -1;
    if (pid == 0) {
        execv(path, argv);
        _exit(127); /* exec failed */
    }
    int status;
    if (waitpid(pid, &status, 0) == -1) return -1;
    if (WIFEXITED(status)) return WEXITSTATUS(status);
    if (WIFSIGNALED(status)) return 128 + WTERMSIG(status);
    return -1;
}

int main(void) {
    char *argv[] = {"true", NULL};
    int rc = run("/bin/true", argv);
    printf("status = %d\\n", rc);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int run(const char *path, char *const argv[]) {
    // TODO: fork, exec in child, wait in parent, decode status
    return -1;
}

int main(void) {
    char *argv[] = {"true", NULL};
    int rc = run("/bin/true", argv);
    printf("status = %d\\n", rc);
    return 0;
}`,
    tags: ['process', 'exec', 'exit-status'],
  },
  {
    id: 'lx-ch03-c-035',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Install A Reliable Handler With sigaction',
    prompt: `signal() has portability quirks; sigaction() is the robust way to install handlers. Write a C program that installs a SIGTERM handler using struct sigaction (set sa_handler, zero sa_mask with sigemptyset, sa_flags = 0). The handler sets a volatile sig_atomic_t flag. main() raises SIGTERM to itself, then checks the flag and prints "handled SIGTERM".`,
    hints: [
      'Fill a struct sigaction: sa_handler = your function, sigemptyset(&sa.sa_mask), sa_flags = 0.',
      'Call sigaction(SIGTERM, &sa, NULL) to install it.',
      'Keep the handler minimal: only set the flag; do the printing in main.',
    ],
    solution: `#include <stdio.h>
#include <signal.h>

static volatile sig_atomic_t flag = 0;
static void handler(int sig) { (void)sig; flag = 1; }

int main(void) {
    struct sigaction sa;
    sa.sa_handler = handler;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    if (sigaction(SIGTERM, &sa, NULL) == -1) {
        perror("sigaction");
        return 1;
    }
    raise(SIGTERM);
    if (flag) {
        printf("handled SIGTERM\\n");
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <signal.h>

static volatile sig_atomic_t flag = 0;
static void handler(int sig) { (void)sig; flag = 1; }

int main(void) {
    struct sigaction sa;
    // TODO: fill sa, install with sigaction, raise SIGTERM, check flag
    return 0;
}`,
    tags: ['signal', 'sigaction', 'handler'],
  },
]

export default problems
