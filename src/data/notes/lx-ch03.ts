import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-03',
  track: 'linux',
  chapter: 3,
  title: 'Processes, Threads & System Calls',
  summary: `A running Linux system is, at bottom, a collection of processes asking the kernel to do privileged work on their behalf through system calls. This chapter builds the mental model that every kernel and systems contributor needs: how processes are created with fork and replaced with exec, how a parent reaps a child with wait, what actually happens at the user-to-kernel boundary, and how errors flow back through errno. We also cover the objects that make this model usable day to day - file descriptors, signals, and the /proc filesystem that exposes the kernel's view of every process. Get this layer precise and the rest of the kernel - scheduling, memory, drivers, and the Rust-for-Linux bindings - stops feeling like magic and starts reading as consequences.`,
  sections: [
    {
      heading: 'The process model and PIDs',
      body: `A **process** is an instance of a running program: a private virtual address space, a set of open file descriptors, the current working directory, credentials (user and group IDs), pending signals, and at least one thread of execution. The program on disk is passive; the process is the live thing the kernel schedules and accounts for. Inside the kernel each process is represented by a *task_struct*, the large structure that holds everything the kernel knows about it.

Every process has a **PID** (process ID), a small positive integer that uniquely identifies it while it is alive. PIDs are handed out roughly sequentially and wrap around after hitting a maximum (configurable via the pid_max sysctl, traditionally 32768 on older systems and often higher now). Crucially, a PID is only unique at a moment in time - once a process exits and is reaped, its number can be reused, so never cache a bare PID and assume it still refers to the same process later. This reuse is a real source of race-condition bugs in tools that act on PIDs; modern code prefers pidfds (file-descriptor handles to a process) precisely to avoid it.

Processes form a **tree**. Every process except the very first has a parent, recorded as its PPID (parent PID). The root of the tree is PID 1, the init process (today usually systemd), started by the kernel at boot. The kernel itself runs special kernel threads, several with low PIDs, that you can see in /proc.

A few related identifiers matter for the kernel and for anyone writing tools:

- A **thread** in Linux is a task that shares its address space (and other resources) with its peers. Each thread has its own kernel task and its own thread ID (TID); the gettid system call returns it. The PID reported to userspace for a multithreaded process is the TID of the *thread group leader*. So a single PID can name a group of threads that share memory.
- **Process groups** and **sessions** layer on top of PIDs to support job control in shells - a Ctrl+C delivers a signal to the foreground process group, not just one process.

The key insight for a kernel contributor: there is no fundamental kernel concept called process versus thread. There are *tasks*, and clone decides how much they share. A classic process is a task that shares almost nothing with its parent; a thread is a task that shares the address space, file descriptor table, and signal handlers. fork and pthread_create are both thin wrappers over the same clone machinery.`,
      code: [
        {
          lang: 'c',
          src: `#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int main(void) {
    pid_t pid  = getpid();    // this process's PID
    pid_t ppid = getppid();   // its parent's PID
    uid_t uid  = getuid();    // real user ID of the owner

    printf("pid=%d ppid=%d uid=%d\\n",
           (int)pid, (int)ppid, (int)uid);
    return 0;
}`
        }
      ]
    },
    {
      heading: 'fork: cloning the current process',
      body: `The **fork** system call creates a new process by duplicating the calling one. The new process (the *child*) is a near-exact copy of the *parent*: same code, same open file descriptors, same memory contents, same instruction pointer. The single most confusing thing about fork - and the thing you must internalize - is that **it returns twice**: once in the parent and once in the child, from the same line of code.

The return value is how each side tells which it is:

1. In the **child**, fork returns 0.
2. In the **parent**, fork returns the PID of the new child (a positive number).
3. On **failure** (for example, the system hit a process limit), fork returns -1 in the parent only, and sets errno; no child is created.

Both processes then continue independently from the point of the fork, each with its own copy of the data. Writes one makes to its variables are invisible to the other, because the address spaces are separate.

Modern kernels do not literally copy all of the parent's memory up front - that would be ruinously expensive. Instead they use **copy-on-write (COW)**: parent and child initially share the same physical pages, marked read-only. The first time either side writes to a page, the kernel faults, makes a private copy, and lets the write proceed. This is why fork is cheap even for large processes, and why fork immediately followed by exec (the common case) wastes almost nothing - the new image discards the inherited pages before they are ever written.

Common pitfalls that bite people in real code:

- **Open file descriptors are shared, including the file offset.** Parent and child point at the same open file description, so if both write to an inherited fd their output interleaves and they share one position. This is the mechanism behind shell pipelines, but it surprises people who expected independent copies.
- **Buffered stdio can double-print.** If you printf without a newline before forking, the data sits in a userspace buffer that gets duplicated into both processes; each later flushes it, so you see the text twice. Flush before forking, or use unbuffered write, or end with a newline on a line-buffered terminal.
- **Forking a multithreaded process is dangerous.** Only the calling thread survives in the child; locks held by other threads stay locked forever. After fork in a threaded program you should do essentially nothing but exec.`,
      code: [
        {
          lang: 'c',
          src: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    fflush(stdout);            // avoid double-printing buffered text
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");        // -1: creation failed, errno set
        exit(EXIT_FAILURE);
    } else if (pid == 0) {
        printf("child:  my pid is %d\\n", (int)getpid());
    } else {
        printf("parent: child pid is %d\\n", (int)pid);
    }
    return 0;
}`
        }
      ]
    },
    {
      heading: 'exec: replacing the program image',
      body: `fork gives you a second copy of the *same* program. To run a *different* program you use one of the **exec** family of calls. exec does not create a new process - it replaces the memory image of the current process with a new executable, loaded fresh from disk. The PID stays the same, most open file descriptors stay open, but the code, data, heap, and stack are thrown away and rebuilt for the new program. On success, exec **never returns**, because the code that called it no longer exists. If exec returns at all, it failed, and you must check errno.

This pairing is the heart of how Unix runs programs: **fork then exec**. The shell forks a copy of itself, and in the child it execs the command you typed; the parent shell waits for that child to finish. Splitting creation (fork) from program-loading (exec) is a deliberate design choice. It gives you a window, in the child after fork but before exec, to set up the environment for the new program: redirect file descriptors, change the working directory, drop privileges, adjust signal dispositions. That window is exactly why pipelines and I/O redirection are possible.

There are several exec variants; the letters in the name tell you the calling convention:

- **l** versions take arguments as a list of separate parameters ending in NULL (execl, execlp, execle).
- **v** versions take an array (vector) of arguments (execv, execvp, execve).
- **p** versions search the PATH environment variable for the program, so you can pass a bare command name like ls instead of an absolute path.
- **e** versions let you pass an explicit environment array.

Underneath them all is **execve**, the actual system call; the others are library wrappers that massage arguments and then invoke it.

Pitfalls to watch for:

- **The first argument is the program name by convention**, conventionally equal to the path you are executing. Programs read argv[0] for their own name and for usage messages; passing a wrong or empty argv[0] confuses them.
- **The argument list must be NULL-terminated.** Forgetting the trailing NULL in an execl call is undefined behavior - the kernel keeps reading garbage as arguments.
- **Close-on-exec.** By default file descriptors survive exec. If you do not want the new program to inherit a descriptor (a database connection, a private pipe), set the FD_CLOEXEC flag, ideally at open time with O_CLOEXEC to avoid a race.`,
      code: [
        {
          lang: 'c',
          src: `#include <stdio.h>
#include <unistd.h>

int main(void) {
    char *argv[] = { "ls", "-l", "/tmp", NULL };  // argv[0] is the name

    // Search PATH for "ls", then replace this image with it.
    execvp("ls", argv);

    // Only reached if exec FAILED.
    perror("execvp");
    return 1;
}`
        }
      ]
    },
    {
      heading: 'wait: reaping children and the zombie problem',
      body: `When a child process exits, it does not vanish completely. The kernel keeps a small amount of bookkeeping around - the exit status and resource usage - so the parent can find out *how* the child finished. A process in this finished-but-not-yet-collected state is called a **zombie** (state Z in tools like ps). The parent collects this information, and lets the kernel free the last traces of the child, by calling **wait** or **waitpid**. This is called *reaping*.

wait blocks until any one child terminates and returns its PID, storing an encoded status. waitpid is the more flexible form: it can wait for a specific child PID, can return immediately without blocking if you pass the WNOHANG flag, and can also report children that were stopped or continued by signals.

The status value is **not** the raw exit code - it is a bitfield you decode with macros:

- **WIFEXITED(status)** is true if the child exited normally (returned from main or called exit). Then WEXITSTATUS(status) gives the low 8 bits of the exit code.
- **WIFSIGNALED(status)** is true if a signal killed the child. Then WTERMSIG(status) gives the signal number.
- **WIFSTOPPED** and **WIFCONTINUED** report job-control stop/continue events.

Two failure modes are worth understanding deeply, because they are real bugs in real daemons:

1. **Zombie leak.** If a parent keeps running but never reaps its children, dead children accumulate as zombies, each consuming a PID-table slot. A long-lived server that forks workers and forgets to wait will eventually exhaust the PID space. Zombies cannot be killed with a signal - they are already dead; you fix the parent.
2. **Orphans and reparenting.** If a parent exits *before* its child, the child is not orphaned into oblivion: the kernel reparents it to a subreaper (PID 1, or a closer ancestor that registered as one). PID 1 reaps it automatically. So orphans are handled; un-reaped children of a *living* parent are the problem.

A common pattern for a server is to reap asynchronously: install a handler for SIGCHLD (sent when a child changes state) and call waitpid with WNOHANG in a loop to drain all finished children without blocking the main flow.`,
      code: [
        {
          lang: 'c',
          src: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        // child: exit with code 42
        _exit(42);
    }

    int status;
    waitpid(pid, &status, 0);          // block until this child finishes

    if (WIFEXITED(status))
        printf("child exited, code=%d\\n", WEXITSTATUS(status));
    else if (WIFSIGNALED(status))
        printf("child killed by signal %d\\n", WTERMSIG(status));
    return 0;
}`
        }
      ]
    },
    {
      heading: 'The system-call interface and user vs kernel mode',
      body: `A **system call** is the controlled doorway through which a user program asks the kernel to do something it is not allowed to do itself - read a file, allocate memory, create a process, send a network packet. Almost everything interesting a program does eventually bottoms out in a syscall. Understanding this boundary is the single most important idea in this chapter for a kernel contributor.

The CPU runs in (at least) two privilege levels. In **user mode** (ring 3 on x86), the processor refuses to execute privileged instructions or touch hardware directly; a misbehaving program can only damage itself. In **kernel mode** (ring 0), code can do anything. Your application code runs in user mode. The kernel runs in kernel mode. The point of the separation is *protection and isolation*: a buggy or malicious program cannot corrupt the kernel or other processes, because the hardware itself blocks the dangerous operations and only the kernel is trusted with them.

Crossing from user to kernel mode is not a normal function call - it is a deliberate, hardware-assisted **trap**. The flow looks like this:

1. The program puts the syscall number in a designated register and arguments in others (on x86-64 Linux: number in rax; arguments in rdi, rsi, rdx, r10, r8, r9).
2. It executes a special instruction (syscall on x86-64; older code used int 0x80). This switches the CPU to kernel mode and jumps to a fixed kernel entry point - the program cannot pick where it lands.
3. The kernel looks up the number in the **syscall table**, validates the arguments (critically, it must never trust a userspace pointer - it copies data in and out with helpers like copy_from_user and copy_to_user), does the work, and places a return value back in rax.
4. The kernel returns to user mode and the program continues right after the syscall instruction.

This is also a **mode switch**, distinct from a context switch: the same process keeps running, it just temporarily gains the kernel's privileges to do one operation, then drops back. (A context switch, by contrast, is the kernel choosing to run a *different* process.)

Most programmers never write the trap by hand. The C library (glibc, musl) provides thin wrapper functions - read, write, open - that load the registers and execute the trap for you, then translate the result. So when you call write in C, you are calling a libc wrapper that performs the actual sys_write syscall. The raw syscall function lets you invoke calls libc has no wrapper for.

For a Rust-for-Linux contributor, the lesson is sharp: code on the kernel side of this boundary must treat every value from userspace as hostile. Pointers may be invalid or point into the kernel; lengths may overflow; the user may have another thread changing memory concurrently. The validation and safe-copy discipline is not boilerplate - it is the security model.`,
      code: [
        {
          lang: 'c',
          src: `#include <unistd.h>
#include <sys/syscall.h>   // SYS_* numbers
#include <string.h>

int main(void) {
    const char *msg = "via raw syscall\\n";

    // The libc wrapper way:
    write(1, msg, strlen(msg));

    // The same thing, invoking the syscall directly by number:
    syscall(SYS_write, 1, msg, strlen(msg));
    return 0;
}`
        }
      ]
    },
    {
      heading: 'errno: how syscalls report failure',
      body: `Linux syscalls do not throw exceptions. They signal failure through return values, and the canonical mechanism in C is **errno**. The convention is almost universal: a syscall wrapper returns -1 (or NULL for pointer-returning calls) on failure, and sets the global errno to a small integer code describing *why*. On success it returns something useful (a count, a file descriptor, 0) and **does not touch errno**.

Two rules follow directly and trip up beginners constantly:

1. **Check the return value first, then read errno.** errno is only meaningful immediately after a call that actually failed. A successful call may leave whatever was there before, so reading errno without first seeing a failure indicator is a bug.
2. **errno is sticky - it is not cleared on success.** If you call several functions and only inspect errno at the end, you may be reading a stale value left by an earlier failure that you already handled. Read it right after the failing call, before any other library call (printf itself can change errno).

Under the hood errno is *thread-local*: each thread has its own copy, so one thread's error does not clobber another's. It is defined in errno.h, and the numeric codes have symbolic names you should use rather than raw numbers - ENOENT (no such file), EACCES (permission denied), EINTR (interrupted by a signal), EAGAIN (try again, common on non-blocking I/O), EBADF (bad file descriptor), ENOMEM (out of memory). To turn a code into a human message use strerror or, more conveniently, perror, which prints your prefix followed by the message for the current errno.

A subtlety vital for robust code: **EINTR**. A slow syscall (read on a terminal, accept on a socket) can be interrupted by a signal before it does anything, returning -1 with errno set to EINTR. Naive code treats that as a real error; correct code generally retries the call. Many programs wrap blocking calls in a loop that retries on EINTR.

On the kernel side the relationship is inverted and worth knowing: kernel functions return *negative* error codes directly (such as -ENOENT, -EINVAL) as their return value. The system-call exit path converts that negative value into the -1-return-plus-errno convention the C library expects. So in kernel and Rust-for-Linux code you will return negative errnos, not set a global; the Rust bindings model this with a dedicated Error type and a Result.`,
      code: [
        {
          lang: 'c',
          src: `#include <stdio.h>
#include <fcntl.h>
#include <errno.h>
#include <string.h>

int main(void) {
    int fd = open("/no/such/file", O_RDONLY);
    if (fd == -1) {                       // check return value FIRST
        // read errno immediately, before any other call
        fprintf(stderr, "open failed: %s (errno=%d)\\n",
                strerror(errno), errno);
        perror("open");                   // shorthand: "open: No such file..."
        return 1;
    }
    close(fd);
    return 0;
}`
        }
      ]
    },
    {
      heading: 'File descriptors: the universal handle',
      body: `A **file descriptor (fd)** is a small non-negative integer that names an open I/O resource inside one process. The defining Unix idea is that *everything is a file*: regular files, directories, pipes, sockets, terminals, and many devices are all read and written through the same fd-based calls - read, write, close, lseek. This uniformity is why a program can be written to consume from a file or a pipe or a socket without caring which.

Every process starts with three fds open by convention:

- **0 = standard input (stdin)** - where the program reads input.
- **1 = standard output (stdout)** - normal output.
- **2 = standard error (stderr)** - diagnostics, kept separate so errors are visible even when output is redirected.

When you open a file, the kernel returns the **lowest-numbered unused fd**. That deterministic rule is the trick behind redirection: close fd 1, then open or dup a target, and the new resource lands on fd 1, so all subsequent writes to stdout go there instead.

There are three layers of kernel data structures here, and conflating them causes bugs:

1. The per-process **fd table** maps your integer to an *open file description*.
2. The system-wide **open file description** holds the current offset and status flags; it is what fork shares and what dup duplicates.
3. The **inode** is the actual file object on disk. Many open file descriptions can point at one inode.

So two fds can refer to the same open file description (sharing an offset, via dup or fork) *or* to two independent open file descriptions of the same file (each with its own offset, via two separate opens). Knowing which you have explains otherwise baffling interleaving.

Key calls and their roles:

- **dup / dup2** duplicate an fd; dup2(old, new) forces the copy onto a specific number, the workhorse of redirection.
- **pipe** returns a pair of connected fds - write to one end, read from the other - the basis of shell pipelines.
- **close** releases the descriptor. Forgetting to close fds is a classic leak; each process has a limit (RLIMIT_NOFILE) and a busy server that leaks them will eventually fail every open with EMFILE.

Pitfalls: fds are per-process integers, not global handles - passing the number 4 to another unrelated process is meaningless. After fork both processes share open file descriptions, so closing in one does not close in the other until both close. And because fds survive exec by default, set O_CLOEXEC on anything the next program should not inherit.`,
      code: [
        {
          lang: 'c',
          src: `#include <fcntl.h>
#include <unistd.h>

// Redirect this process's stdout into a file, then run a command.
int main(void) {
    int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd < 0) return 1;

    dup2(fd, STDOUT_FILENO);   // make fd 1 a copy of fd; stdout now -> file
    close(fd);                 // original no longer needed

    char *argv[] = { "echo", "hello, file", NULL };
    execvp("echo", argv);      // its stdout goes to out.txt
    return 1;
}`
        }
      ]
    },
    {
      heading: 'Signals: asynchronous notifications',
      body: `A **signal** is a software interrupt: a one-bit-of-information notification delivered to a process to tell it that some event happened - the user pressed Ctrl+C, a child died, a timer fired, the program made an illegal memory access. Signals are the kernel's lightweight, asynchronous way to poke a process, and they predate richer IPC mechanisms.

Each signal has a number and a symbolic name, and each has a **default action** the kernel performs if the process does not handle it: terminate, terminate with a core dump, ignore, stop (pause), or continue. Ones you will meet constantly:

- **SIGINT (2)** - interrupt from the keyboard (Ctrl+C); default: terminate.
- **SIGTERM (15)** - polite request to terminate; default: terminate. This is what kill and init send first for a clean shutdown.
- **SIGKILL (9)** - forcible kill; cannot be caught, blocked, or ignored. The escape hatch when a process is stuck.
- **SIGSEGV (11)** - invalid memory access; default: terminate with core dump. The signal behind a segfault.
- **SIGCHLD (17)** - a child changed state; default: ignored, but you handle it to reap children.
- **SIGSTOP / SIGCONT** - stop and resume; SIGSTOP, like SIGKILL, cannot be caught.

A process can install a **handler** with sigaction (the modern, well-defined call) to run its own function when a catchable signal arrives, or set the disposition to ignore. The crucial constraint - and a frequent source of subtle bugs - is what you are allowed to do *inside* a handler. A signal can arrive at any instant, in the middle of any operation, including inside malloc or printf. So a handler may only safely call **async-signal-safe** functions (a specific, short list that includes write but excludes printf, malloc, and most of the standard library). The standard robust pattern is to do almost nothing in the handler: set a volatile sig_atomic_t flag (or write a byte to a self-pipe) and let the main loop notice and react.

More pitfalls a contributor must respect:

- **Signals do not queue (standard signals).** If two SIGCHLDs arrive while one is pending, you may see only one. A SIGCHLD handler must loop with waitpid and WNOHANG to drain *all* finished children, not assume one signal equals one child.
- **Signals interrupt blocking syscalls**, surfacing as EINTR (see the errno section) - handle that.
- **SIGKILL and SIGSTOP are special**: the kernel enforces them; a process gets no say. This is why kill -9 always works and why graceful shutdown should try SIGTERM first.

The older signal function exists but has historically inconsistent semantics across systems; prefer sigaction in new code.`,
      code: [
        {
          lang: 'c',
          src: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

static volatile sig_atomic_t stop = 0;

static void on_sigint(int sig) {
    (void)sig;
    stop = 1;            // only async-signal-safe work: set a flag
}

int main(void) {
    struct sigaction sa = {0};
    sa.sa_handler = on_sigint;
    sigaction(SIGINT, &sa, NULL);   // catch Ctrl+C with sigaction

    while (!stop) {
        write(1, ".", 1);           // write IS async-signal-safe
        sleep(1);
    }
    write(1, "\\nclean exit\\n", 12);
    return 0;
}`
        }
      ]
    },
    {
      heading: '/proc: the kernel as a filesystem',
      body: `**/proc** is a *virtual* filesystem: the files in it do not live on disk. When you read them, the kernel generates their contents on the fly from its live data structures. It is the primary window into what the kernel is doing, and the data source behind almost every monitoring tool - ps, top, free, and friends all just parse files under /proc. Knowing it directly is invaluable for both debugging and kernel development.

Its layout has two parts. There is **one numbered directory per process**, named by PID, plus system-wide files at the top level:

- **/proc/[pid]/status** - human-readable summary: state, memory, UIDs, thread count.
- **/proc/[pid]/cmdline** - the command line that launched it (arguments separated by NUL bytes).
- **/proc/[pid]/fd/** - one symlink per open file descriptor, showing exactly what each fd points at. Indispensable for finding fd leaks and seeing what a process has open.
- **/proc/[pid]/maps** - the memory map: every region of the address space, its permissions, and what is mapped there.
- **/proc/[pid]/environ** - the environment variables, NUL-separated.
- **/proc/[pid]/task/** - one subdirectory per thread, exposing the per-thread view.

System-wide, the most useful entries include /proc/cpuinfo (per-CPU details), /proc/meminfo (memory totals and breakdown), /proc/loadavg (load averages), /proc/uptime, /proc/mounts, and the entire /proc/sys tree, which the sysctl tool reads and writes to tune kernel parameters at runtime.

Why a virtual filesystem at all? Because exposing kernel state as files means *every existing tool already knows how to read it* - cat, grep, and any language's file API work with no special bindings. It is a beautifully Unix solution: a uniform, text-based, permission-checked interface to internal state.

For a kernel contributor a few realities matter. The contents are **snapshots generated at read time**, so two reads can differ and a value can be momentarily inconsistent if it spans multiple internal locks. Some files are restricted: you can only see another process's environ or fd details if you own it or are privileged. And /proc is loosely standardized - exact fields vary across kernel versions, so parse defensively. A related virtual filesystem, **/sys (sysfs)**, exposes the device and driver model in a more structured way and is where most newer kernel-to-userspace interfaces are added; /proc is largely frozen for legacy compatibility, with process information as its enduring core.`,
      code: [
        {
          lang: 'c',
          src: `#include <stdio.h>

// Print this process's state line straight from /proc/self/status.
// /proc/self is a symlink to the caller's own PID directory.
int main(void) {
    FILE *f = fopen("/proc/self/status", "r");
    if (!f) { perror("open /proc/self/status"); return 1; }

    char line[256];
    while (fgets(line, sizeof line, f)) {
        if (line[0] == 'N' || line[0] == 'S' || line[0] == 'P')
            fputs(line, stdout);   // Name:, State:, Pid:, PPid: ...
    }
    fclose(f);
    return 0;
}`
        }
      ]
    }
  ],
  takeaways: [
    'A process is a private address space plus resources; a PID names it only while alive - PIDs are reused, so never trust a stale one.',
    'In Linux there are only tasks and clone: a process shares little with its parent, a thread shares the address space - fork and pthread_create are both clone underneath.',
    'fork returns twice: 0 in the child, the child PID in the parent, -1 on failure; copy-on-write makes it cheap, and fork+exec is the universal way to run a program.',
    'exec replaces the current image and never returns on success - set up redirections and privileges in the child after fork but before exec.',
    'Always reap children with wait/waitpid or you leak zombies; orphans get reparented to PID 1, but un-reaped children of a living parent exhaust the PID table.',
    'A syscall is a hardware trap from user mode into kernel mode; the kernel must validate everything from userspace and copy memory safely - never trust a user pointer.',
    'Check a syscall return value FIRST, then read errno immediately; errno is thread-local and sticky, and EINTR usually means retry.',
    'File descriptors are per-process integers over a shared open-file-description layer; fork and dup share offsets, separate opens do not, and leaked fds eventually fail with EMFILE.',
    'Signal handlers may call only async-signal-safe functions - just set a flag; SIGKILL and SIGSTOP cannot be caught, and standard signals do not queue.'
  ],
  cheatsheet: [
    { label: 'getpid / getppid', value: 'this PID / parent PID' },
    { label: 'fork()', value: '0 in child, child PID in parent, -1 on error (sets errno)' },
    { label: 'execvp(file, argv)', value: 'replace image; searches PATH; only returns on failure' },
    { label: 'execve(path, argv, envp)', value: 'the real exec syscall all wrappers call' },
    { label: 'waitpid(pid, &st, 0)', value: 'reap a child, blocking; WNOHANG to poll' },
    { label: 'WIFEXITED / WEXITSTATUS', value: 'decode normal exit and its code from status' },
    { label: 'WIFSIGNALED / WTERMSIG', value: 'decode death-by-signal and which signal' },
    { label: 'syscall(SYS_write, ...)', value: 'invoke a syscall directly by number' },
    { label: 'errno + perror / strerror', value: 'check return == -1 first, then read errno' },
    { label: 'EINTR / EAGAIN / EBADF', value: 'interrupted-retry / try-again / bad fd' },
    { label: 'fds 0 / 1 / 2', value: 'stdin / stdout / stderr, open at startup' },
    { label: 'dup2(old, new)', value: 'force copy onto a chosen fd - basis of redirection' },
    { label: 'sigaction(sig, &sa, NULL)', value: 'install a signal handler (preferred over signal)' },
    { label: '/proc/self/, /proc/[pid]/', value: 'live per-process kernel state as files' }
  ]
}

export default note
