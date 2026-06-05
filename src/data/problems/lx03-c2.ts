import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch03-c-036',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Own And Parent PID',
    prompt: `Write a complete C program that prints its own process ID and its parent's process ID on two lines, exactly in this form:

pid=<n>
ppid=<m>

Use the raw process-identity system calls (not by parsing /proc). Include the right headers.`,
    hints: [
      'getpid() returns the calling process PID; getppid() returns the parent PID.',
      'Both return pid_t, which prints with %d after a cast or with the right format.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("pid=%d\\n", (int)getpid());
    printf("ppid=%d\\n", (int)getppid());
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    /* TODO: print pid= and ppid= using getpid()/getppid() */
    return 0;
}`,
    tags: ['process', 'pid', 'syscall'],
  },
  {
    id: 'lx-ch03-c-037',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fork And Distinguish Child From Parent',
    prompt: `Write a program that calls fork() once. The child must print:

child: my pid is <n>

and the parent must print:

parent: child pid is <n>

Handle the fork() error case (return value -1) by printing perror("fork") and exiting non-zero. Do not assume any ordering between the two messages.`,
    hints: [
      'fork() returns 0 in the child and the child PID in the parent.',
      'In the child, getpid() gives your own PID; in the parent the return value IS the child PID.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        exit(EXIT_FAILURE);
    }
    if (pid == 0) {
        printf("child: my pid is %d\\n", (int)getpid());
    } else {
        printf("parent: child pid is %d\\n", (int)pid);
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    /* TODO: handle error, then branch on child (0) vs parent (>0) */
    return 0;
}`,
    tags: ['fork', 'process', 'pid'],
  },
  {
    id: 'lx-ch03-c-038',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Wait For A Child And Report Its Exit Code',
    prompt: `Write a program where the child calls exit(7) immediately. The parent must call wait(), then print:

child exited with code 7

Use the WIFEXITED / WEXITSTATUS macros to decode the status. If the child did not exit normally, print "child did not exit normally" instead.`,
    hints: [
      'wait(&status) fills status; check WIFEXITED(status) before WEXITSTATUS(status).',
      'WEXITSTATUS only keeps the low 8 bits of the exit code.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(EXIT_FAILURE); }
    if (pid == 0) {
        exit(7);
    }
    int status;
    wait(&status);
    if (WIFEXITED(status))
        printf("child exited with code %d\\n", WEXITSTATUS(status));
    else
        printf("child did not exit normally\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    /* child: exit(7). parent: wait and decode status with WIFEXITED/WEXITSTATUS */
    return 0;
}`,
    tags: ['fork', 'wait', 'exit-status'],
  },
  {
    id: 'lx-ch03-c-039',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Replace The Process Image With execlp',
    prompt: `Write a program that forks. In the child, replace the process image so it runs "/bin/echo hello world" using execlp (search PATH). If exec returns at all, print perror("execlp") and exit(1). The parent waits for the child and then prints "done". The visible output must include the line:

hello world`,
    hints: [
      'execlp takes the program name, then argv strings, ending with a NULL pointer.',
      'argv[0] is conventionally the program name; the last argument MUST be (char *)NULL.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(EXIT_FAILURE); }
    if (pid == 0) {
        execlp("echo", "echo", "hello", "world", (char *)NULL);
        perror("execlp");
        exit(1);
    }
    wait(NULL);
    printf("done\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    /* child: execlp("echo", ...). parent: wait then print done */
    return 0;
}`,
    tags: ['exec', 'fork', 'process'],
  },
  {
    id: 'lx-ch03-c-040',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Use execvp With An argv Array',
    prompt: `Write a function

  int run_ls_l(void);

that forks, and in the child runs "ls -l" using execvp built from an argv array (a NULL-terminated char* array). The parent waits and returns the child's exit code (or -1 on fork failure). Provide a main that calls it and prints "exit=<n>".`,
    hints: [
      'Build char *argv[] = { "ls", "-l", NULL }; then execvp(argv[0], argv).',
      'The array MUST be NULL-terminated or execvp reads past the end.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int run_ls_l(void) {
    pid_t pid = fork();
    if (pid < 0) return -1;
    if (pid == 0) {
        char *argv[] = { "ls", "-l", NULL };
        execvp(argv[0], argv);
        perror("execvp");
        _exit(127);
    }
    int status;
    if (waitpid(pid, &status, 0) < 0) return -1;
    return WIFEXITED(status) ? WEXITSTATUS(status) : -1;
}

int main(void) {
    printf("exit=%d\\n", run_ls_l());
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int run_ls_l(void) {
    /* TODO: fork, execvp ls -l in child, waitpid in parent, return exit code */
    return -1;
}

int main(void) {
    printf("exit=%d\\n", run_ls_l());
    return 0;
}`,
    tags: ['exec', 'fork', 'waitpid'],
  },
  {
    id: 'lx-ch03-c-041',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Check errno After A Failing Syscall',
    prompt: `Write a program that tries to open a file that does not exist, "/no/such/file", read-only with open(). open() should return -1 and set errno. Print:

errno=<n> (<message>)

where <n> is the numeric errno and <message> is the string from strerror(errno). Remember to capture errno immediately, before any other library call can overwrite it.`,
    hints: [
      'errno is a thread-local int declared in <errno.h>; it is only meaningful right after a failure.',
      'strerror(errno) turns the code into a human-readable string.',
    ],
    solution: `#include <stdio.h>
#include <fcntl.h>
#include <errno.h>
#include <string.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    if (fd == -1) {
        int e = errno;            /* capture immediately */
        printf("errno=%d (%s)\\n", e, strerror(e));
        return 1;
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <fcntl.h>
#include <errno.h>
#include <string.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    /* TODO: if fd == -1, capture errno and print errno=<n> (<message>) */
    return 0;
}`,
    tags: ['errno', 'syscall', 'open'],
  },
  {
    id: 'lx-ch03-c-042',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Open File Descriptors From /proc/self/fd',
    prompt: `Write a function

  int count_open_fds(void);

that returns how many file descriptors the calling process currently has open, by reading the directory /proc/self/fd and counting its entries (excluding "." and ".."). Note: the directory stream itself opens one fd, which will be counted; that is acceptable here. Provide a main that prints the count.`,
    hints: [
      'opendir("/proc/self/fd"), then readdir in a loop until it returns NULL.',
      'Skip entries whose d_name is "." or "..".',
    ],
    solution: `#include <stdio.h>
#include <string.h>
#include <dirent.h>

int count_open_fds(void) {
    DIR *d = opendir("/proc/self/fd");
    if (!d) return -1;
    int n = 0;
    struct dirent *e;
    while ((e = readdir(d)) != NULL) {
        if (strcmp(e->d_name, ".") == 0 || strcmp(e->d_name, "..") == 0)
            continue;
        n++;
    }
    closedir(d);
    return n;
}

int main(void) {
    printf("open fds: %d\\n", count_open_fds());
    return 0;
}`,
    starter: `#include <stdio.h>
#include <string.h>
#include <dirent.h>

int count_open_fds(void) {
    /* TODO: read /proc/self/fd and count entries except . and .. */
    return -1;
}

int main(void) {
    printf("open fds: %d\\n", count_open_fds());
    return 0;
}`,
    tags: ['proc', 'fd', 'process'],
  },
  {
    id: 'lx-ch03-c-043',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Unidirectional Pipe Between Parent And Child',
    prompt: `Write a program that creates a pipe with pipe(), then forks. The child writes the bytes "ping" into the write end and closes it. The parent reads from the read end and prints:

got: ping

Each side must close the pipe end it does not use. The parent should read in a loop until read() returns 0 (EOF), then wait for the child.`,
    hints: [
      'pipe(fds): fds[0] is the read end, fds[1] is the write end.',
      'EOF (read returns 0) only happens once ALL write ends are closed, so close the unused write end in the parent.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    if (pipe(fds) < 0) { perror("pipe"); exit(1); }
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        close(fds[0]);
        const char *msg = "ping";
        write(fds[1], msg, strlen(msg));
        close(fds[1]);
        _exit(0);
    }
    close(fds[1]);
    char buf[64];
    ssize_t n, total = 0;
    while ((n = read(fds[0], buf + total, sizeof buf - 1 - total)) > 0)
        total += n;
    buf[total] = '\\0';
    close(fds[0]);
    wait(NULL);
    printf("got: %s\\n", buf);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    /* TODO: pipe, fork; child writes "ping" and closes; parent reads to EOF */
    return 0;
}`,
    tags: ['pipe', 'fork', 'ipc'],
  },
  {
    id: 'lx-ch03-c-044',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Install A SIGINT Handler That Sets A Flag',
    prompt: `Write a program that installs a handler for SIGINT using sigaction. The handler must do nothing except set a volatile sig_atomic_t flag named got_signal to 1 (this is the only async-signal-safe pattern allowed here). The main loop spins until got_signal becomes 1, then prints:

caught SIGINT, exiting

Do not call printf or any non-async-signal-safe function inside the handler.`,
    hints: [
      'A signal handler may only safely touch a volatile sig_atomic_t and call async-signal-safe functions.',
      'printf, malloc, etc. are NOT async-signal-safe; just set the flag and check it in main.',
    ],
    solution: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

static volatile sig_atomic_t got_signal = 0;

static void handler(int sig) {
    (void)sig;
    got_signal = 1;   /* only async-signal-safe action */
}

int main(void) {
    struct sigaction sa = {0};
    sa.sa_handler = handler;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGINT, &sa, NULL);

    while (!got_signal)
        pause();      /* sleep until a signal arrives */

    printf("caught SIGINT, exiting\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

static volatile sig_atomic_t got_signal = 0;

static void handler(int sig) {
    /* TODO: only set got_signal = 1 */
}

int main(void) {
    /* TODO: install handler with sigaction, loop until got_signal, then print */
    return 0;
}`,
    tags: ['signal', 'sigaction', 'async-safe'],
  },
  {
    id: 'lx-ch03-c-045',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Send A Signal To A Child With kill',
    prompt: `Write a program that forks a child which installs a SIGTERM handler setting a flag, then loops calling pause(). The parent sleeps briefly, sends SIGTERM to the child with kill(child_pid, SIGTERM), then waits. After the handler runs, the child prints "child terminated" and exits 0. The parent then prints "parent done".`,
    hints: [
      'kill(pid, sig) delivers a signal to the process with that PID.',
      'In the child, getpid() is its own PID; the parent already has the child PID from fork().',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

static volatile sig_atomic_t term = 0;
static void on_term(int s) { (void)s; term = 1; }

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        struct sigaction sa = {0};
        sa.sa_handler = on_term;
        sigemptyset(&sa.sa_mask);
        sigaction(SIGTERM, &sa, NULL);
        while (!term) pause();
        printf("child terminated\\n");
        fflush(stdout);
        _exit(0);
    }
    sleep(1);
    kill(pid, SIGTERM);
    waitpid(pid, NULL, 0);
    printf("parent done\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    /* child: handle SIGTERM, pause loop, print and exit.
       parent: sleep, kill(pid, SIGTERM), wait, print */
    return 0;
}`,
    tags: ['signal', 'kill', 'fork'],
  },
  {
    id: 'lx-ch03-c-046',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read The Process Name From /proc/self/comm',
    prompt: `Write a function

  int get_comm(char *buf, size_t len);

that copies the current process's command name (as the kernel stores it) into buf by reading the file /proc/self/comm, stripping the trailing newline. Return 0 on success, -1 on error. Provide a main that prints comm=<name>.`,
    hints: [
      'Open "/proc/self/comm" with fopen or open, read one line.',
      'The kernel appends a newline; replace it with a NUL terminator.',
    ],
    solution: `#include <stdio.h>
#include <string.h>

int get_comm(char *buf, size_t len) {
    FILE *f = fopen("/proc/self/comm", "r");
    if (!f) return -1;
    if (!fgets(buf, (int)len, f)) { fclose(f); return -1; }
    fclose(f);
    size_t n = strlen(buf);
    if (n > 0 && buf[n - 1] == '\\n') buf[n - 1] = '\\0';
    return 0;
}

int main(void) {
    char name[64];
    if (get_comm(name, sizeof name) == 0)
        printf("comm=%s\\n", name);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <string.h>

int get_comm(char *buf, size_t len) {
    /* TODO: read /proc/self/comm, strip newline, return 0/-1 */
    return -1;
}

int main(void) {
    char name[64];
    if (get_comm(name, sizeof name) == 0)
        printf("comm=%s\\n", name);
    return 0;
}`,
    tags: ['proc', 'process', 'io'],
  },
  {
    id: 'lx-ch03-c-047',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Spawn Three Children And Reap Them All',
    prompt: `Write a program that forks 3 children. Each child i (0,1,2) immediately calls exit(i). The parent must reap ALL children in a loop using wait() until it returns -1 with errno == ECHILD, accumulating the sum of their exit codes, then print:

sum of exit codes = 3

(0 + 1 + 2). Use WIFEXITED/WEXITSTATUS to read each code.`,
    hints: [
      'Loop wait(&status) until it returns -1; that means no children remain (errno ECHILD).',
      'Spawn the children in a for loop; in the child branch, exit(i) right away.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <sys/wait.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        pid_t pid = fork();
        if (pid < 0) { perror("fork"); exit(1); }
        if (pid == 0) exit(i);
    }
    int status, sum = 0;
    pid_t r;
    while ((r = wait(&status)) > 0) {
        if (WIFEXITED(status)) sum += WEXITSTATUS(status);
    }
    /* loop ends when wait returns -1 with errno == ECHILD */
    printf("sum of exit codes = %d\\n", sum);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <sys/wait.h>

int main(void) {
    /* fork 3 children, each exit(i); parent reaps all and sums exit codes */
    return 0;
}`,
    tags: ['fork', 'wait', 'exit-status'],
  },
  {
    id: 'lx-ch03-c-048',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Detect A Child Killed By A Signal',
    prompt: `Write a program where the child raises SIGKILL on itself (raise(SIGKILL) or kill(getpid(), SIGKILL)). The parent waits and must distinguish termination-by-signal from normal exit. Print exactly:

killed by signal 9

using WIFSIGNALED(status) and WTERMSIG(status). If the child somehow exited normally, print "exited normally" instead.`,
    hints: [
      'WIFSIGNALED(status) is true when a signal terminated the child; WTERMSIG gives the number.',
      'SIGKILL is signal 9 and cannot be caught, so the child always dies by signal.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        raise(SIGKILL);
        _exit(0);   /* unreachable */
    }
    int status;
    waitpid(pid, &status, 0);
    if (WIFSIGNALED(status))
        printf("killed by signal %d\\n", WTERMSIG(status));
    else if (WIFEXITED(status))
        printf("exited normally\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    /* child raises SIGKILL; parent decodes with WIFSIGNALED/WTERMSIG */
    return 0;
}`,
    tags: ['signal', 'wait', 'fork'],
  },
  {
    id: 'lx-ch03-c-049',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Make A Raw getpid Syscall With syscall()',
    prompt: `Write a program that obtains its PID two different ways and confirms they agree: once via the library wrapper getpid(), and once via the raw interface syscall(SYS_getpid). Print:

wrapper=<a> raw=<b> match=<yes|no>

This shows the syscall() generic entry point that traps into the kernel. Include <sys/syscall.h>.`,
    hints: [
      'syscall(SYS_getpid) issues the system call directly; its return type is long.',
      'Both paths trap from user mode into kernel mode and should return the same PID.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>
#include <sys/syscall.h>

int main(void) {
    pid_t wrapper = getpid();
    long raw = syscall(SYS_getpid);
    int match = ((long)wrapper == raw);
    printf("wrapper=%d raw=%ld match=%s\\n",
           (int)wrapper, raw, match ? "yes" : "no");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>
#include <sys/syscall.h>

int main(void) {
    /* TODO: getpid() vs syscall(SYS_getpid); print both and whether they match */
    return 0;
}`,
    tags: ['syscall', 'pid', 'kernel-mode'],
  },
  {
    id: 'lx-ch03-c-050',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pipe A Parent Message Into A Child Filter',
    prompt: `Write a program that connects parent output to a child's standard input through a pipe so the child runs "/usr/bin/wc -c" (or "wc -c" via PATH) on what the parent sends. The parent writes "hello\\n" and closes its write end; the child must have its stdin replaced by the pipe read end using dup2 before exec. The child's wc prints the byte count (6). Close all unused pipe ends.`,
    hints: [
      'In the child: dup2(fds[0], STDIN_FILENO), then close both original fds, then execlp("wc","wc","-c",NULL).',
      'In the parent: close the read end, write, close the write end, then wait.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    if (pipe(fds) < 0) { perror("pipe"); exit(1); }
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        dup2(fds[0], STDIN_FILENO);
        close(fds[0]);
        close(fds[1]);
        execlp("wc", "wc", "-c", (char *)NULL);
        perror("execlp");
        _exit(127);
    }
    close(fds[0]);
    const char *msg = "hello\\n";
    write(fds[1], msg, strlen(msg));
    close(fds[1]);
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
    /* pipe + fork; child: dup2 read end to stdin, exec wc -c; parent: write, close, wait */
    return 0;
}`,
    tags: ['pipe', 'dup2', 'exec'],
  },
  {
    id: 'lx-ch03-c-051',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Resilient read() Loop Past EINTR',
    prompt: `Write a function

  ssize_t read_full(int fd, void *buf, size_t count);

that reads exactly count bytes into buf, retrying when read() returns -1 with errno == EINTR (interrupted by a signal), and stopping early on EOF. Return the number of bytes actually read, or -1 on a real error. Provide a main that reads up to 16 bytes from standard input and prints how many it got.`,
    hints: [
      'A short read or an EINTR is not a failure; loop and resume from where you left off.',
      'On EOF read() returns 0; on a real error it returns -1 with errno != EINTR.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>
#include <errno.h>

ssize_t read_full(int fd, void *buf, size_t count) {
    char *p = buf;
    size_t got = 0;
    while (got < count) {
        ssize_t n = read(fd, p + got, count - got);
        if (n < 0) {
            if (errno == EINTR) continue;   /* retry */
            return -1;
        }
        if (n == 0) break;                   /* EOF */
        got += (size_t)n;
    }
    return (ssize_t)got;
}

int main(void) {
    char buf[16];
    ssize_t n = read_full(0, buf, sizeof buf);
    printf("read %zd bytes\\n", n);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>
#include <errno.h>

ssize_t read_full(int fd, void *buf, size_t count) {
    /* TODO: loop read(), retry on EINTR, stop on EOF, return total bytes */
    return -1;
}

int main(void) {
    char buf[16];
    printf("read %zd bytes\\n", read_full(0, buf, sizeof buf));
    return 0;
}`,
    tags: ['errno', 'read', 'eintr'],
  },
  {
    id: 'lx-ch03-c-052',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read A Field From /proc/self/status',
    prompt: `Write a function

  long get_status_long(const char *key);

that scans /proc/self/status line by line for a line beginning with "<key>:" and returns the first integer value on that line. For example get_status_long("VmRSS") returns the resident set size in kB. Return -1 if not found. Provide a main printing VmRSS.`,
    hints: [
      '/proc/self/status lines look like "VmRSS:\\t  1234 kB"; match the prefix then parse the number.',
      'fgets a line, compare the key prefix, then sscanf or strtol the numeric part.',
    ],
    solution: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

long get_status_long(const char *key) {
    FILE *f = fopen("/proc/self/status", "r");
    if (!f) return -1;
    char line[256];
    size_t klen = strlen(key);
    long val = -1;
    while (fgets(line, sizeof line, f)) {
        if (strncmp(line, key, klen) == 0 && line[klen] == ':') {
            val = strtol(line + klen + 1, NULL, 10);
            break;
        }
    }
    fclose(f);
    return val;
}

int main(void) {
    printf("VmRSS = %ld kB\\n", get_status_long("VmRSS"));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

long get_status_long(const char *key) {
    /* TODO: scan /proc/self/status for "<key>:" and return its integer value */
    return -1;
}

int main(void) {
    printf("VmRSS = %ld kB\\n", get_status_long("VmRSS"));
    return 0;
}`,
    tags: ['proc', 'process', 'parsing'],
  },
  {
    id: 'lx-ch03-c-053',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Demonstrate Copy-On-Write Of A Forked Variable',
    prompt: `Write a program with a local int counter = 100; before fork(). After fork(), the child sets counter = 200 and prints "child counter=200", and the parent (after wait) prints "parent counter=100". This shows each process has its own copy of memory after fork (copy-on-write semantics): the child's write does not affect the parent.`,
    hints: [
      'After fork the two processes have independent address spaces; a write in one is invisible to the other.',
      'Have the parent wait() before printing so the output is ordered child-then-parent.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int counter = 100;
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        counter = 200;
        printf("child counter=%d\\n", counter);
        fflush(stdout);
        _exit(0);
    }
    wait(NULL);
    printf("parent counter=%d\\n", counter);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int counter = 100;
    pid_t pid = fork();
    /* child: set counter=200 and print; parent: wait then print (still 100) */
    return 0;
}`,
    tags: ['fork', 'memory', 'process'],
  },
  {
    id: 'lx-ch03-c-054',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Block SIGINT During A Critical Section',
    prompt: `Write a program that blocks SIGINT around a "critical section" using sigprocmask. Build a sigset_t containing SIGINT, call sigprocmask(SIG_BLOCK, ...) to save the old mask and block it, print "critical: SIGINT blocked", then restore the previous mask with SIG_SETMASK. While blocked, a Ctrl-C is held pending and delivered only after you unblock. Print "done" at the end.`,
    hints: [
      'sigemptyset then sigaddset(&set, SIGINT) builds the mask of signals to block.',
      'sigprocmask(SIG_BLOCK, &set, &old) blocks; sigprocmask(SIG_SETMASK, &old, NULL) restores.',
    ],
    solution: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

int main(void) {
    sigset_t set, old;
    sigemptyset(&set);
    sigaddset(&set, SIGINT);

    sigprocmask(SIG_BLOCK, &set, &old);
    printf("critical: SIGINT blocked\\n");
    fflush(stdout);
    /* ... critical work here; a SIGINT now stays pending ... */
    sigprocmask(SIG_SETMASK, &old, NULL);  /* restore + deliver pending */

    printf("done\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

int main(void) {
    sigset_t set, old;
    /* TODO: block SIGINT around a critical section, then restore the old mask */
    return 0;
}`,
    tags: ['signal', 'sigprocmask', 'blocking'],
  },
  {
    id: 'lx-ch03-c-055',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reap A Zombie And Observe Its State',
    prompt: `Write a program that forks a child that exits immediately. Before the parent calls wait(), the child is a zombie. The parent should sleep(1) (so the child is surely dead but unreaped), then read /proc/<child>/stat and print the single-letter state code, which should be 'Z'. Then call wait() to reap it and print "reaped". Build the path "/proc/<pid>/stat" with snprintf.`,
    hints: [
      'The state letter in /proc/<pid>/stat is the 3rd field, after "<pid> (comm) ".',
      'A child that has exited but not been waited on is a zombie, state Z.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) _exit(0);

    sleep(1);   /* child is now a zombie (exited, unreaped) */

    char path[64];
    snprintf(path, sizeof path, "/proc/%d/stat", (int)pid);
    FILE *f = fopen(path, "r");
    if (f) {
        int p; char comm[256]; char state;
        if (fscanf(f, "%d %255s %c", &p, comm, &state) == 3)
            printf("state=%c\\n", state);
        fclose(f);
    }
    wait(NULL);
    printf("reaped\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    /* child exits; parent sleeps, reads /proc/<pid>/stat state (Z), then waits */
    return 0;
}`,
    tags: ['proc', 'zombie', 'wait'],
  },
  {
    id: 'lx-ch03-c-056',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Time A getpid Syscall Loop',
    prompt: `Write a program that measures how long it takes to make a getpid() system call by calling it in a loop one million times, timing the loop with clock_gettime(CLOCK_MONOTONIC, ...). Print the average nanoseconds per call:

per-call: <x> ns

This illustrates the cost of the user-to-kernel-mode transition. Use a volatile sink so the compiler does not optimize the call away.`,
    hints: [
      'clock_gettime gives a struct timespec with tv_sec and tv_nsec; combine into total nanoseconds.',
      'Assign the result to a volatile variable inside the loop so it is not eliminated.',
    ],
    solution: `#include <stdio.h>
#include <unistd.h>
#include <time.h>

int main(void) {
    const long N = 1000000;
    struct timespec a, b;
    volatile pid_t sink = 0;
    clock_gettime(CLOCK_MONOTONIC, &a);
    for (long i = 0; i < N; i++)
        sink = getpid();
    clock_gettime(CLOCK_MONOTONIC, &b);
    (void)sink;
    double ns = (b.tv_sec - a.tv_sec) * 1e9 + (b.tv_nsec - a.tv_nsec);
    printf("per-call: %.1f ns\\n", ns / (double)N);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <unistd.h>
#include <time.h>

int main(void) {
    /* TODO: time 1,000,000 getpid() calls with CLOCK_MONOTONIC; print ns/call */
    return 0;
}`,
    tags: ['syscall', 'kernel-mode', 'timing'],
  },
  {
    id: 'lx-ch03-c-057',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Ignore SIGPIPE And Detect EPIPE',
    prompt: `Write a program that creates a pipe, closes the READ end, then tries to write() to the write end. Normally this delivers SIGPIPE and kills the process; instead install SIG_IGN for SIGPIPE first so write() returns -1 with errno == EPIPE. Detect this and print:

write failed: broken pipe

Use signal(SIGPIPE, SIG_IGN) or sigaction with SIG_IGN.`,
    hints: [
      'Writing to a pipe with no readers raises SIGPIPE; ignoring it makes write() fail with EPIPE instead.',
      'Check errno == EPIPE after write() returns -1.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>
#include <string.h>

int main(void) {
    signal(SIGPIPE, SIG_IGN);
    int fds[2];
    if (pipe(fds) < 0) { perror("pipe"); exit(1); }
    close(fds[0]);                 /* no readers remain */
    ssize_t n = write(fds[1], "x", 1);
    if (n < 0 && errno == EPIPE)
        printf("write failed: broken pipe\\n");
    close(fds[1]);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>

int main(void) {
    /* ignore SIGPIPE, make a pipe, close read end, write, detect EPIPE */
    return 0;
}`,
    tags: ['signal', 'pipe', 'errno'],
  },
  {
    id: 'lx-ch03-c-058',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pass Data To exec Via The Environment',
    prompt: `Write a program that sets an environment variable MYMSG to "from-parent" using setenv, then forks and execs "/usr/bin/env" (or "env" via PATH) in the child to dump the environment. The child inherits the variable, so the printed environment must contain the line:

MYMSG=from-parent

The parent waits for the child. This shows that exec preserves the inherited environment.`,
    hints: [
      'setenv("MYMSG", "from-parent", 1) updates the parent environment before fork.',
      'execlp("env", "env", NULL) runs /usr/bin/env, which prints the inherited environ.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    setenv("MYMSG", "from-parent", 1);
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        execlp("env", "env", (char *)NULL);
        perror("execlp");
        _exit(127);
    }
    wait(NULL);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    /* setenv MYMSG, fork, exec env in child (inherits it), parent waits */
    return 0;
}`,
    tags: ['exec', 'environment', 'fork'],
  },
  {
    id: 'lx-ch03-c-059',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Use waitpid With WNOHANG To Poll',
    prompt: `Write a program that forks a child which sleeps 1 second then exits 5. The parent must poll with waitpid(pid, &status, WNOHANG) in a loop: while it returns 0 the child is still running, so the parent prints "still running" and sleeps a moment; once waitpid returns the child PID, it prints "child exited 5". Do not block in a plain wait().`,
    hints: [
      'waitpid with WNOHANG returns 0 immediately if the child has not exited yet.',
      'Sleep a little between polls so you do not busy-spin too hard.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        sleep(1);
        exit(5);
    }
    int status;
    for (;;) {
        pid_t r = waitpid(pid, &status, WNOHANG);
        if (r == 0) {
            printf("still running\\n");
            usleep(200000);
            continue;
        }
        if (r == pid) {
            if (WIFEXITED(status))
                printf("child exited %d\\n", WEXITSTATUS(status));
            break;
        }
        if (r < 0) { perror("waitpid"); break; }
    }
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    /* child: sleep then exit(5). parent: poll with WNOHANG until it exits */
    return 0;
}`,
    tags: ['waitpid', 'wnohang', 'fork'],
  },
  {
    id: 'lx-ch03-c-060',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'List Numeric PIDs In /proc',
    prompt: `Write a function

  int count_processes(void);

that returns the number of currently running processes by opening /proc and counting directory entries whose name is entirely digits (each such entry is a PID). Skip non-numeric entries like "cpuinfo" or "self". Provide a main that prints the count.`,
    hints: [
      'opendir("/proc"); for each entry, check every character of d_name is a digit.',
      'A helper is_all_digits(name) returning 0 for empty or any non-digit char keeps it clean.',
    ],
    solution: `#include <stdio.h>
#include <ctype.h>
#include <dirent.h>

static int is_all_digits(const char *s) {
    if (!*s) return 0;
    for (; *s; s++)
        if (!isdigit((unsigned char)*s)) return 0;
    return 1;
}

int count_processes(void) {
    DIR *d = opendir("/proc");
    if (!d) return -1;
    int n = 0;
    struct dirent *e;
    while ((e = readdir(d)) != NULL)
        if (is_all_digits(e->d_name)) n++;
    closedir(d);
    return n;
}

int main(void) {
    printf("processes: %d\\n", count_processes());
    return 0;
}`,
    starter: `#include <stdio.h>
#include <ctype.h>
#include <dirent.h>

int count_processes(void) {
    /* TODO: open /proc and count entries whose name is all digits (PIDs) */
    return -1;
}

int main(void) {
    printf("processes: %d\\n", count_processes());
    return 0;
}`,
    tags: ['proc', 'process', 'dirent'],
  },
  {
    id: 'lx-ch03-c-061',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Build And Run A Two-Stage Pipeline',
    prompt: `Write a program that builds the shell pipeline equivalent of "ls | sort -r" entirely with syscalls (no system()). Create one pipe, fork twice: child A redirects its stdout to the pipe write end and execs "ls"; child B redirects its stdin to the pipe read end and execs "sort -r". The parent closes both pipe ends and waits for both children. The combined output is a reverse-sorted directory listing.`,
    hints: [
      'The PARENT must close BOTH pipe ends after forking both children, or sort never sees EOF.',
      'In each child: dup2 the right end onto STDOUT or STDIN, close both raw fds, then exec.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    if (pipe(fds) < 0) { perror("pipe"); exit(1); }

    pid_t a = fork();
    if (a == 0) {
        dup2(fds[1], STDOUT_FILENO);
        close(fds[0]); close(fds[1]);
        execlp("ls", "ls", (char *)NULL);
        perror("execlp ls"); _exit(127);
    }

    pid_t b = fork();
    if (b == 0) {
        dup2(fds[0], STDIN_FILENO);
        close(fds[0]); close(fds[1]);
        execlp("sort", "sort", "-r", (char *)NULL);
        perror("execlp sort"); _exit(127);
    }

    close(fds[0]);
    close(fds[1]);
    waitpid(a, NULL, 0);
    waitpid(b, NULL, 0);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    /* pipe; fork ls -> stdout to pipe; fork sort -r -> stdin from pipe;
       parent closes both ends and waits for both */
    return 0;
}`,
    tags: ['pipe', 'dup2', 'exec'],
  },
  {
    id: 'lx-ch03-c-062',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Self-Pipe Trick To Make A Signal Wakeable',
    prompt: `Implement the classic self-pipe trick. Create a pipe; install a SIGINT handler whose ONLY action is to write(1 byte) to the pipe's write end (write is async-signal-safe). The main loop blocks on read() of the pipe's read end; when SIGINT fires, the byte unblocks the read and the program prints "woke up by signal" and exits. This is the safe way to turn an async signal into a wakeable event.`,
    hints: [
      'write() is on the async-signal-safe list; printf is NOT, so only write in the handler.',
      'Store the write fd in a global so the handler can reach it; the main thread reads to block.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>

static int wake_fd = -1;   /* write end, for the handler */

static void handler(int sig) {
    (void)sig;
    char b = 'x';
    write(wake_fd, &b, 1);   /* async-signal-safe */
}

int main(void) {
    int fds[2];
    if (pipe(fds) < 0) { perror("pipe"); exit(1); }
    wake_fd = fds[1];

    struct sigaction sa = {0};
    sa.sa_handler = handler;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGINT, &sa, NULL);

    char b;
    read(fds[0], &b, 1);     /* blocks until the handler writes */
    printf("woke up by signal\\n");
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>

static int wake_fd = -1;

static void handler(int sig) {
    /* TODO: write one byte to wake_fd (only async-signal-safe action) */
}

int main(void) {
    /* TODO: pipe, install SIGINT handler, block in read, then print on wakeup */
    return 0;
}`,
    tags: ['signal', 'pipe', 'async-safe'],
  },
  {
    id: 'lx-ch03-c-063',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Minimal Wait-Reaping SIGCHLD Handler',
    prompt: `Write a program that installs a SIGCHLD handler which reaps ALL terminated children by looping waitpid(-1, &status, WNOHANG) until it returns 0 or -1 (this avoids missing signals that coalesced). The handler must save and restore errno because waitpid can clobber it. The main thread forks 4 short-lived children and then loops until a global volatile counter of reaped children reaches 4, then prints "reaped 4".`,
    hints: [
      'Multiple SIGCHLDs can coalesce into one delivery; loop waitpid(WNOHANG) until it drains.',
      'Save errno at handler entry and restore it at exit so you do not corrupt the interrupted code.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <signal.h>
#include <sys/wait.h>

static volatile sig_atomic_t reaped = 0;

static void on_sigchld(int sig) {
    (void)sig;
    int saved = errno;               /* waitpid may clobber errno */
    pid_t p;
    while ((p = waitpid(-1, NULL, WNOHANG)) > 0)
        reaped++;
    /* p == 0: no more ready; p == -1 (ECHILD): none left */
    errno = saved;
}

int main(void) {
    struct sigaction sa = {0};
    sa.sa_handler = on_sigchld;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = SA_RESTART;
    sigaction(SIGCHLD, &sa, NULL);

    for (int i = 0; i < 4; i++) {
        pid_t pid = fork();
        if (pid == 0) { usleep(50000 * (i + 1)); _exit(0); }
    }
    while (reaped < 4)
        pause();
    printf("reaped %d\\n", (int)reaped);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <signal.h>
#include <sys/wait.h>

static volatile sig_atomic_t reaped = 0;

static void on_sigchld(int sig) {
    /* TODO: save errno, loop waitpid(-1, NULL, WNOHANG) reaping all, restore errno */
}

int main(void) {
    /* install SIGCHLD handler, fork 4 children, wait until reaped == 4 */
    return 0;
}`,
    tags: ['signal', 'sigchld', 'waitpid'],
  },
  {
    id: 'lx-ch03-c-064',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Capture A Child Process Output Into A Buffer',
    prompt: `Implement

  ssize_t capture(char *const argv[], char *out, size_t cap);

that runs the program argv[0] with arguments argv (NULL-terminated), captures its stdout into out (up to cap-1 bytes, NUL-terminated), and returns the byte count, or -1 on error. Use pipe + fork + dup2(write end -> STDOUT) + execvp in the child; the parent closes the write end, reads to EOF, and waits. Provide a main that captures "echo hi" and prints the buffer.`,
    hints: [
      'Parent must close the write end before reading or it will never see EOF.',
      'Loop read() accumulating into out; stop at EOF or when cap-1 bytes are filled, then waitpid.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

ssize_t capture(char *const argv[], char *out, size_t cap) {
    if (cap == 0) return -1;
    int fds[2];
    if (pipe(fds) < 0) return -1;
    pid_t pid = fork();
    if (pid < 0) { close(fds[0]); close(fds[1]); return -1; }
    if (pid == 0) {
        dup2(fds[1], STDOUT_FILENO);
        close(fds[0]); close(fds[1]);
        execvp(argv[0], argv);
        _exit(127);
    }
    close(fds[1]);
    size_t total = 0;
    ssize_t n;
    while (total < cap - 1 &&
           (n = read(fds[0], out + total, cap - 1 - total)) > 0)
        total += (size_t)n;
    out[total] = '\\0';
    close(fds[0]);
    waitpid(pid, NULL, 0);
    return (ssize_t)total;
}

int main(void) {
    char buf[256];
    char *argv[] = { "echo", "hi", NULL };
    ssize_t n = capture(argv, buf, sizeof buf);
    printf("[%zd] %s", n, buf);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

ssize_t capture(char *const argv[], char *out, size_t cap) {
    /* TODO: pipe + fork; child dup2 write end to stdout and execvp;
       parent close write end, read to EOF into out, waitpid */
    return -1;
}

int main(void) {
    char buf[256];
    char *argv[] = { "echo", "hi", NULL };
    ssize_t n = capture(argv, buf, sizeof buf);
    printf("[%zd] %s", n, buf);
    return 0;
}`,
    tags: ['pipe', 'exec', 'fork'],
  },
  {
    id: 'lx-ch03-c-065',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Implement A Tiny system()',
    prompt: `Implement

  int my_system(const char *cmd);

that behaves like the standard system(): fork a child that execs "/bin/sh" with "-c" and cmd, and the parent waitpid()s and returns the same encoded status that wait gives (so the caller can use WIFEXITED/WEXITSTATUS). Handle EINTR by retrying the waitpid. If fork fails return -1. Provide a main that runs "echo done; exit 3" and prints the decoded exit code (3).`,
    hints: [
      'The shell invocation is execl("/bin/sh", "sh", "-c", cmd, (char*)NULL).',
      'Retry waitpid while it returns -1 with errno == EINTR; return the raw status int.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <sys/wait.h>

int my_system(const char *cmd) {
    pid_t pid = fork();
    if (pid < 0) return -1;
    if (pid == 0) {
        execl("/bin/sh", "sh", "-c", cmd, (char *)NULL);
        _exit(127);
    }
    int status;
    while (waitpid(pid, &status, 0) < 0) {
        if (errno != EINTR) return -1;
    }
    return status;
}

int main(void) {
    int s = my_system("echo done; exit 3");
    if (WIFEXITED(s))
        printf("exit code = %d\\n", WEXITSTATUS(s));
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <sys/wait.h>

int my_system(const char *cmd) {
    /* TODO: fork; child exec /bin/sh -c cmd; parent waitpid (retry on EINTR),
       return raw status */
    return -1;
}

int main(void) {
    int s = my_system("echo done; exit 3");
    if (WIFEXITED(s)) printf("exit code = %d\\n", WEXITSTATUS(s));
    return 0;
}`,
    tags: ['fork', 'exec', 'waitpid'],
  },
  {
    id: 'lx-ch03-c-066',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Double-Fork To Orphan A Grandchild',
    prompt: `Write a program that uses the double-fork technique to create a "daemon-like" grandchild that is reparented to init (PID 1). The parent forks a child; the child forks a grandchild and then exits immediately (so the grandchild is orphaned). The grandchild sleeps briefly then prints its own PID and its ppid, which should now be 1 (or the subreaper). The parent reaps the middle child with waitpid so no zombie remains.`,
    hints: [
      'When a parent dies, its children are reparented to PID 1 (init) or a subreaper.',
      'The middle child must exit right after forking the grandchild; the top parent waitpid()s only the middle child.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t child = fork();
    if (child < 0) { perror("fork"); exit(1); }

    if (child == 0) {
        pid_t grand = fork();
        if (grand < 0) _exit(1);
        if (grand > 0)
            _exit(0);          /* middle child exits -> orphan grandchild */
        /* grandchild */
        sleep(1);              /* let the middle child die first */
        printf("grandchild pid=%d ppid=%d\\n",
               (int)getpid(), (int)getppid());
        fflush(stdout);
        _exit(0);
    }

    waitpid(child, NULL, 0);   /* reap the middle child */
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t child = fork();
    /* child forks grandchild then exits; grandchild prints pid/ppid (now 1);
       parent waitpid()s the middle child */
    return 0;
}`,
    tags: ['fork', 'orphan', 'process'],
  },
  {
    id: 'lx-ch03-c-067',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Bidirectional Communication With Two Pipes',
    prompt: `Write a program with TWO pipes giving full-duplex parent<->child communication. The child reads an integer line from pipe1, doubles it, and writes the result back on pipe2, then exits. The parent sends "21\\n" on pipe1, reads the reply on pipe2, and prints:

reply: 42

Carefully close every end you do not use in each process to avoid deadlock and missing EOF.`,
    hints: [
      'Two pipes: p1 parent->child, p2 child->parent. The child closes p1 write and p2 read; the parent closes the opposite.',
      'Leaving an unused write end open prevents the reader from ever seeing EOF.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int p1[2], p2[2];      /* p1: parent->child, p2: child->parent */
    if (pipe(p1) < 0 || pipe(p2) < 0) { perror("pipe"); exit(1); }

    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }

    if (pid == 0) {
        close(p1[1]); close(p2[0]);
        char buf[64];
        ssize_t n = read(p1[0], buf, sizeof buf - 1);
        if (n > 0) {
            buf[n] = '\\0';
            int v = atoi(buf);
            char out[64];
            int len = snprintf(out, sizeof out, "%d\\n", v * 2);
            write(p2[1], out, (size_t)len);
        }
        close(p1[0]); close(p2[1]);
        _exit(0);
    }

    close(p1[0]); close(p2[1]);
    write(p1[1], "21\\n", 3);
    close(p1[1]);
    char buf[64];
    ssize_t n = read(p2[0], buf, sizeof buf - 1);
    if (n > 0) { buf[n] = '\\0'; printf("reply: %s", buf); }
    close(p2[0]);
    wait(NULL);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int p1[2], p2[2];
    /* two pipes for full duplex; child doubles the number and replies;
       close every unused end in each process */
    return 0;
}`,
    tags: ['pipe', 'ipc', 'fork'],
  },
  {
    id: 'lx-ch03-c-068',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Run A Child With A Timeout Via Alarm',
    prompt: `Implement

  int run_with_timeout(char *const argv[], unsigned secs);

that forks/execs argv, and if the child has not finished within secs seconds, kills it with SIGKILL and returns -2 (timeout); otherwise returns the child's exit code. Use alarm(secs) plus a SIGALRM handler that sets a flag, and a waitpid loop that breaks out when interrupted by the alarm (EINTR) so you can kill and reap the child. Provide a main that times out "sleep 5" with a 1-second limit.`,
    hints: [
      'Install a SIGALRM handler that only sets a volatile flag, then alarm(secs) before waiting.',
      'When waitpid returns -1 with errno EINTR and the flag is set, kill(child, SIGKILL) and waitpid again to reap.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <signal.h>
#include <sys/wait.h>

static volatile sig_atomic_t timed_out = 0;
static void on_alarm(int s) { (void)s; timed_out = 1; }

int run_with_timeout(char *const argv[], unsigned secs) {
    struct sigaction sa = {0};
    sa.sa_handler = on_alarm;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;                 /* no SA_RESTART: alarm must interrupt waitpid */
    sigaction(SIGALRM, &sa, NULL);

    pid_t pid = fork();
    if (pid < 0) return -1;
    if (pid == 0) {
        execvp(argv[0], argv);
        _exit(127);
    }

    timed_out = 0;
    alarm(secs);
    int status;
    for (;;) {
        pid_t r = waitpid(pid, &status, 0);
        if (r == pid) { alarm(0); break; }
        if (r < 0 && errno == EINTR && timed_out) {
            kill(pid, SIGKILL);
            waitpid(pid, &status, 0);   /* reap the killed child */
            return -2;
        }
        if (r < 0 && errno != EINTR) return -1;
    }
    return WIFEXITED(status) ? WEXITSTATUS(status) : -1;
}

int main(void) {
    char *argv[] = { "sleep", "5", NULL };
    int rc = run_with_timeout(argv, 1);
    printf(rc == -2 ? "timed out\\n" : "exit=%d\\n", rc);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <signal.h>
#include <sys/wait.h>

static volatile sig_atomic_t timed_out = 0;
static void on_alarm(int s) { (void)s; timed_out = 1; }

int run_with_timeout(char *const argv[], unsigned secs) {
    /* SIGALRM handler sets flag; alarm(secs); waitpid; on EINTR+timeout kill+reap */
    return -1;
}

int main(void) {
    char *argv[] = { "sleep", "5", NULL };
    int rc = run_with_timeout(argv, 1);
    printf(rc == -2 ? "timed out\\n" : "exit=%d\\n", rc);
    return 0;
}`,
    tags: ['signal', 'alarm', 'waitpid'],
  },
  {
    id: 'lx-ch03-c-069',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Synchronize Parent And Child With A Pipe Barrier',
    prompt: `Write a program that uses a pipe as a one-shot synchronization barrier so the child does NOT proceed until the parent says go. Create a pipe; after fork, the child closes the write end and read()s 1 byte (which blocks until data arrives). The parent does some setup, prints "parent ready", then writes 1 byte and closes the write end. Only then does the child unblock and print "child go". The ordering "parent ready" before "child go" must be guaranteed.`,
    hints: [
      'A blocking read() on the pipe is the barrier; it returns only once the parent writes (or closes) the write end.',
      'The child must NOT hold the write end open, or its own read could block forever / never see the signal cleanly.',
    ],
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    if (pipe(fds) < 0) { perror("pipe"); exit(1); }

    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }

    if (pid == 0) {
        close(fds[1]);              /* child won't write */
        char b;
        read(fds[0], &b, 1);        /* blocks until parent signals */
        close(fds[0]);
        printf("child go\\n");
        fflush(stdout);
        _exit(0);
    }

    close(fds[0]);                  /* parent won't read */
    /* ... parent setup ... */
    printf("parent ready\\n");
    fflush(stdout);
    write(fds[1], "g", 1);          /* release the child */
    close(fds[1]);
    wait(NULL);
    return 0;
}`,
    starter: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fds[2];
    /* pipe barrier: child blocks on read until parent prints "parent ready"
       and writes a byte; then child prints "child go" */
    return 0;
}`,
    tags: ['pipe', 'fork', 'sync'],
  },
  {
    id: 'lx-ch03-c-070',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parse A Process Memory Map From /proc/self/maps',
    prompt: `Write a function

  int count_executable_regions(void);

that opens /proc/self/maps and counts how many mapped regions are executable, i.e. the permissions field (the second whitespace-separated token, like "r-xp") has 'x' as its third character. Return the count, or -1 on error. Provide a main that prints "executable regions: <n>". Each line of /proc/self/maps looks like: "<start>-<end> <perms> <offset> ...".`,
    hints: [
      'Each maps line: address range, then a 4-char perms string like rwxp / r-xp / r--p.',
      'sscanf(line, "%*s %4s", perms) grabs the perms token; check perms[2] is the letter x.',
    ],
    solution: `#include <stdio.h>

int count_executable_regions(void) {
    FILE *f = fopen("/proc/self/maps", "r");
    if (!f) return -1;
    char line[512];
    int n = 0;
    while (fgets(line, sizeof line, f)) {
        char perms[8] = {0};
        /* skip the address range, read the 4-char perms field */
        if (sscanf(line, "%*s %7s", perms) == 1) {
            if (perms[2] == 'x') n++;
        }
    }
    fclose(f);
    return n;
}

int main(void) {
    printf("executable regions: %d\\n", count_executable_regions());
    return 0;
}`,
    starter: `#include <stdio.h>

int count_executable_regions(void) {
    /* TODO: read /proc/self/maps, parse the perms token, count 'x' in slot 2 */
    return -1;
}

int main(void) {
    printf("executable regions: %d\\n", count_executable_regions());
    return 0;
}`,
    tags: ['proc', 'memory', 'parsing'],
  },
]

export default problems
