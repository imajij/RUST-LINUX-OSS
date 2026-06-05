import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch04-c-036',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Full-Read Loop Handling Short Counts',
    prompt: `read(2) may return fewer bytes than requested even when more remain (a "short read"). Write a function

    ssize_t read_full(int fd, void *buf, size_t count);

that repeatedly calls read() until it has read exactly count bytes, hits EOF, or hits a hard error. It must return the total number of bytes read (which may be less than count if EOF is reached), or -1 on error. Treat a read() that fails with errno == EINTR as "retry", not an error. Demonstrate it from main() by reading the first 100 bytes of "data.txt".`,
    hints: [
      'Keep a running total and advance the buffer pointer by the number of bytes read each pass.',
      'read() returning 0 means EOF: stop and return what you have.',
      'On read() == -1 with errno EINTR, just continue the loop; any other errno is a real error.',
    ],
    solution: `#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>

ssize_t read_full(int fd, void *buf, size_t count) {
    char *p = buf;
    size_t total = 0;
    while (total < count) {
        ssize_t n = read(fd, p + total, count - total);
        if (n == -1) {
            if (errno == EINTR) continue;
            return -1;
        }
        if (n == 0) break;        /* EOF */
        total += (size_t)n;
    }
    return (ssize_t)total;
}

int main(void) {
    int fd = open("data.txt", O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }
    char buf[100];
    ssize_t got = read_full(fd, buf, sizeof buf);
    if (got == -1) { perror("read"); close(fd); return 1; }
    printf("read %zd bytes\\n", got);
    close(fd);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <errno.h>

ssize_t read_full(int fd, void *buf, size_t count) {
    // TODO: loop reading into buf until count bytes, EOF, or error
    // TODO: retry on EINTR; return total bytes read or -1 on error
    return -1;
}`,
    tags: ['read', 'short-count', 'eintr'],
  },
  {
    id: 'lx-ch04-c-037',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Full-Write Loop That Drains the Buffer',
    prompt: `write(2) may also write fewer bytes than requested (a "short write"). Write a function

    ssize_t write_all(int fd, const void *buf, size_t count);

that loops until all count bytes are written, returning count on success or -1 on error. Retry when write() fails with errno == EINTR. Demonstrate it by writing a 5000-byte buffer of 'A' characters to "big.txt".`,
    hints: [
      'Advance a pointer by the number of bytes write() reported each call.',
      'A short write is normal for pipes and sockets; never assume one write() drains the buffer.',
      'EINTR means the call was interrupted before transferring data: just retry.',
    ],
    solution: `#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>

ssize_t write_all(int fd, const void *buf, size_t count) {
    const char *p = buf;
    size_t total = 0;
    while (total < count) {
        ssize_t n = write(fd, p + total, count - total);
        if (n == -1) {
            if (errno == EINTR) continue;
            return -1;
        }
        total += (size_t)n;
    }
    return (ssize_t)total;
}

int main(void) {
    int fd = open("big.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }
    char buf[5000];
    memset(buf, 'A', sizeof buf);
    if (write_all(fd, buf, sizeof buf) == -1) {
        perror("write"); close(fd); return 1;
    }
    close(fd);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <errno.h>

ssize_t write_all(int fd, const void *buf, size_t count) {
    // TODO: loop until all count bytes are written; retry on EINTR
    return -1;
}`,
    tags: ['write', 'short-count', 'eintr'],
  },
  {
    id: 'lx-ch04-c-038',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Copy a File With a read/write Loop',
    prompt: `Implement a tiny cp: write a program that takes argv[1] (source) and argv[2] (dest), opens the source read-only and the dest with O_WRONLY | O_CREAT | O_TRUNC mode 0644, and copies all bytes using a buffer of 4096 bytes. Handle short reads and short writes correctly. Print the total number of bytes copied to stdout. Close both descriptors.`,
    hints: [
      'Each read() returns up to your buffer size; loop until read() returns 0 (EOF).',
      'For each chunk you read, write it out fully (a single write() may be short).',
      'Check argc >= 3 before touching argv.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

static ssize_t write_all(int fd, const char *p, size_t n) {
    size_t total = 0;
    while (total < n) {
        ssize_t w = write(fd, p + total, n - total);
        if (w == -1) { if (errno == EINTR) continue; return -1; }
        total += (size_t)w;
    }
    return (ssize_t)total;
}

int main(int argc, char **argv) {
    if (argc < 3) { fprintf(stderr, "usage: %s src dst\\n", argv[0]); return 1; }
    int in = open(argv[1], O_RDONLY);
    if (in == -1) { perror("open src"); return 1; }
    int out = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out == -1) { perror("open dst"); close(in); return 1; }
    char buf[4096];
    long long copied = 0;
    ssize_t r;
    while ((r = read(in, buf, sizeof buf)) != 0) {
        if (r == -1) { if (errno == EINTR) continue; perror("read"); break; }
        if (write_all(out, buf, (size_t)r) == -1) { perror("write"); break; }
        copied += r;
    }
    printf("%lld\\n", copied);
    close(in); close(out);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: open argv[1] read-only, argv[2] write/create/trunc 0644
    // TODO: copy in 4096-byte chunks, handling short reads/writes
    // TODO: print total bytes copied
    return 0;
}`,
    tags: ['read', 'write', 'copy'],
  },
  {
    id: 'lx-ch04-c-039',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Append Without Clobbering With O_APPEND',
    prompt: `Write a program that opens "log.txt" with O_WRONLY | O_CREAT | O_APPEND (mode 0644) and appends the line "entry\\n" to it. Explain in a comment why O_APPEND is safer than seeking to the end yourself when multiple writers share the file. Run it twice and confirm (conceptually) the file grows by one line each time without overwriting.`,
    hints: [
      'O_APPEND makes every write() atomically seek to end-of-file before writing.',
      'A manual lseek(fd, 0, SEEK_END) then write() has a race window between the two calls.',
      'Do not pass O_TRUNC when appending, or you would erase the file first.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    /* O_APPEND: the kernel repositions the offset to EOF and writes in one
       atomic step, so concurrent writers never overwrite each other.
       A separate lseek(SEEK_END)+write() has a TOCTOU race between the two. */
    int fd = open("log.txt", O_WRONLY | O_CREAT | O_APPEND, 0644);
    if (fd == -1) { perror("open"); return 1; }
    const char *line = "entry\\n";
    if (write(fd, line, strlen(line)) == -1) { perror("write"); close(fd); return 1; }
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    // TODO: open "log.txt" append-only (create if needed, mode 0644)
    // TODO: append "entry\\n"
    return 0;
}`,
    tags: ['open', 'append', 'write'],
  },
  {
    id: 'lx-ch04-c-040',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Refuse to Overwrite With O_EXCL',
    prompt: `Write a program that creates a brand-new file "lock.pid" using open() with O_WRONLY | O_CREAT | O_EXCL (mode 0600). If the file already exists, open() fails with errno == EEXIST; in that case print "already exists\\n" to stderr and exit 2. Otherwise write the current process id (as text) into it. This is the classic atomic "create only if absent" idiom used for lock files.`,
    hints: [
      'O_CREAT | O_EXCL together make creation fail if the path already exists.',
      'getpid() returns the current pid; format it with snprintf.',
      'Compare errno to EEXIST to detect the "already there" case specifically.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    int fd = open("lock.pid", O_WRONLY | O_CREAT | O_EXCL, 0600);
    if (fd == -1) {
        if (errno == EEXIST) { fprintf(stderr, "already exists\\n"); return 2; }
        perror("open");
        return 1;
    }
    char buf[32];
    int len = snprintf(buf, sizeof buf, "%d\\n", (int)getpid());
    write(fd, buf, (size_t)len);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    // TODO: open "lock.pid" with O_CREAT|O_EXCL 0600
    // TODO: if errno==EEXIST report "already exists" and exit 2
    // TODO: otherwise write our pid into the file
    return 0;
}`,
    tags: ['open', 'o_excl', 'errno'],
  },
  {
    id: 'lx-ch04-c-041',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Random Access With lseek',
    prompt: `Write a program that opens "data.txt" read-only, uses lseek() to position the offset at byte 10 from the start (SEEK_SET), reads 5 bytes there, then seeks to 3 bytes before the end (SEEK_END with offset -3), reads 3 bytes, and prints both fragments. Print the byte offset returned by each lseek call too. Handle lseek returning (off_t)-1 as an error.`,
    hints: [
      'lseek(fd, 10, SEEK_SET) sets the absolute offset; it returns the new offset.',
      'A negative offset with SEEK_END moves backward from end-of-file.',
      'read() always starts at the current file offset and advances it.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("data.txt", O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    off_t pos = lseek(fd, 10, SEEK_SET);
    if (pos == (off_t)-1) { perror("lseek"); close(fd); return 1; }
    printf("offset now %lld\\n", (long long)pos);
    char a[6] = {0};
    read(fd, a, 5);
    printf("at 10: '%s'\\n", a);

    pos = lseek(fd, -3, SEEK_END);
    if (pos == (off_t)-1) { perror("lseek"); close(fd); return 1; }
    printf("offset now %lld\\n", (long long)pos);
    char b[4] = {0};
    read(fd, b, 3);
    printf("near end: '%s'\\n", b);

    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("data.txt", O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }
    // TODO: lseek to byte 10 (SEEK_SET), read 5 bytes
    // TODO: lseek to 3 before end (SEEK_END, -3), read 3 bytes
    // TODO: print offsets and fragments
    close(fd);
    return 0;
}`,
    tags: ['lseek', 'offset', 'read'],
  },
  {
    id: 'lx-ch04-c-042',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'File Size Without stat (lseek SEEK_END)',
    prompt: `Write a function

    off_t file_size(const char *path);

that returns the size in bytes of a regular file by opening it read-only and calling lseek(fd, 0, SEEK_END). It closes the fd and returns -1 on any error. Demonstrate it on "data.txt" in main(). Note in a comment one case where this approach is unreliable compared to stat().`,
    hints: [
      'lseek to SEEK_END with offset 0 returns the current size of a regular file.',
      'This does not work meaningfully for pipes, sockets, or many special files.',
      'Always close the fd even on the success path.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

/* Unreliable for non-seekable files (pipes, sockets, char devices):
   lseek returns ESPIPE there. For those, prefer stat(). */
off_t file_size(const char *path) {
    int fd = open(path, O_RDONLY);
    if (fd == -1) return -1;
    off_t sz = lseek(fd, 0, SEEK_END);
    close(fd);
    return sz;   /* -1 if lseek failed */
}

int main(void) {
    off_t sz = file_size("data.txt");
    if (sz == -1) { perror("file_size"); return 1; }
    printf("size = %lld bytes\\n", (long long)sz);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>

off_t file_size(const char *path) {
    // TODO: open read-only, lseek to SEEK_END, close, return the size or -1
    return -1;
}`,
    tags: ['lseek', 'size', 'seek-end'],
  },
  {
    id: 'lx-ch04-c-043',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Inspect Metadata With stat',
    prompt: `Write a program that calls stat() on argv[1] and prints: the file size in bytes (st_size), the inode number (st_ino), the number of hard links (st_nlink), the owner uid (st_uid), and the modification time (st_mtime) as a raw epoch value. Use the correct printf conversions for the field types (cast where needed). Exit 1 with perror("stat") on failure.`,
    hints: [
      'struct stat lives in <sys/stat.h>; pass its address to stat().',
      'st_size is off_t, st_ino and st_nlink are unsigned types: cast when printing to be portable.',
      'st_mtime is a time_t holding seconds since the epoch.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: %s path\\n", argv[0]); return 1; }
    struct stat st;
    if (stat(argv[1], &st) == -1) { perror("stat"); return 1; }
    printf("size  = %lld\\n", (long long)st.st_size);
    printf("inode = %llu\\n", (unsigned long long)st.st_ino);
    printf("links = %llu\\n", (unsigned long long)st.st_nlink);
    printf("uid   = %u\\n", (unsigned)st.st_uid);
    printf("mtime = %lld\\n", (long long)st.st_mtime);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    struct stat st;
    // TODO: stat(argv[1], &st); on error perror("stat") and return 1
    // TODO: print size, inode, link count, uid, mtime
    return 0;
}`,
    tags: ['stat', 'metadata', 'inode'],
  },
  {
    id: 'lx-ch04-c-044',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Classify a File Type From st_mode',
    prompt: `Write a function

    const char *file_type(const char *path);

that stat()s the path and returns a static string describing its type: "regular", "directory", "symlink", "fifo", "socket", "chardev", "blockdev", or "unknown". To detect symlinks correctly you must use lstat() (stat follows symlinks). Use the S_ISREG/S_ISDIR/S_ISLNK/... macros on st_mode. Return NULL on stat error. Demonstrate on a few paths in main().`,
    hints: [
      'lstat() does NOT follow the final symlink, so S_ISLNK can detect link files.',
      'The S_ISxxx() macros each test st_mode for one type and return nonzero on match.',
      'Return a string literal; do not allocate.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>
#include <stddef.h>

const char *file_type(const char *path) {
    struct stat st;
    if (lstat(path, &st) == -1) return NULL;
    if (S_ISREG(st.st_mode))  return "regular";
    if (S_ISDIR(st.st_mode))  return "directory";
    if (S_ISLNK(st.st_mode))  return "symlink";
    if (S_ISFIFO(st.st_mode)) return "fifo";
    if (S_ISSOCK(st.st_mode)) return "socket";
    if (S_ISCHR(st.st_mode))  return "chardev";
    if (S_ISBLK(st.st_mode))  return "blockdev";
    return "unknown";
}

int main(void) {
    const char *paths[] = { "/etc/hostname", "/tmp", "/dev/null" };
    for (int i = 0; i < 3; i++) {
        const char *t = file_type(paths[i]);
        printf("%-16s %s\\n", paths[i], t ? t : "(error)");
    }
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stddef.h>

const char *file_type(const char *path) {
    struct stat st;
    // TODO: use lstat so symlinks are detected, then test S_ISxxx macros
    return NULL;
}`,
    tags: ['lstat', 'st_mode', 'file-type'],
  },
  {
    id: 'lx-ch04-c-045',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Render Permission Bits Like ls -l',
    prompt: `Write a function

    void mode_to_string(mode_t mode, char out[11]);

that fills a 10-character (plus NUL) string like "-rwxr-xr--" for the given st_mode. Position 0 is the type ('-','d','l','c','b','p','s'); the next 9 are the user/group/other rwx triples, with a dash where a bit is clear. Ignore setuid/setgid/sticky for this exercise. Demonstrate by lstat()ing argv[1] and printing the rendered string.`,
    hints: [
      'Mask with S_IRUSR, S_IWUSR, S_IXUSR, then the GRP and OTH variants.',
      'Determine the leading type character from the S_ISxxx macros.',
      'Write the NUL terminator at out[10].',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

void mode_to_string(mode_t mode, char out[11]) {
    char t = '?';
    if (S_ISREG(mode)) t = '-';
    else if (S_ISDIR(mode)) t = 'd';
    else if (S_ISLNK(mode)) t = 'l';
    else if (S_ISCHR(mode)) t = 'c';
    else if (S_ISBLK(mode)) t = 'b';
    else if (S_ISFIFO(mode)) t = 'p';
    else if (S_ISSOCK(mode)) t = 's';
    out[0] = t;
    const int bits[9] = {
        S_IRUSR, S_IWUSR, S_IXUSR,
        S_IRGRP, S_IWGRP, S_IXGRP,
        S_IROTH, S_IWOTH, S_IXOTH
    };
    const char chars[3] = { 'r', 'w', 'x' };
    for (int i = 0; i < 9; i++)
        out[1 + i] = (mode & bits[i]) ? chars[i % 3] : '-';
    out[10] = '\\0';
}

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: %s path\\n", argv[0]); return 1; }
    struct stat st;
    if (lstat(argv[1], &st) == -1) { perror("lstat"); return 1; }
    char s[11];
    mode_to_string(st.st_mode, s);
    printf("%s %s\\n", s, argv[1]);
    return 0;
}`,
    starter: `#include <sys/stat.h>

void mode_to_string(mode_t mode, char out[11]) {
    // TODO: out[0] = type char; out[1..9] = rwxrwxrwx with dashes; out[10] = NUL
}`,
    tags: ['permissions', 'st_mode', 'octal'],
  },
  {
    id: 'lx-ch04-c-046',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Change Permissions With chmod',
    prompt: `Write a program that takes an octal mode in argv[1] (e.g. "0644") and a path in argv[2], parses the mode with strtol(base 8), and applies it with chmod(). Verify by stat()ing the file afterward and printing the resulting permission bits as octal (mask st_mode with 07777). Report errors with perror.`,
    hints: [
      'strtol(argv[1], NULL, 8) parses an octal string into a number.',
      'chmod(path, mode) sets the permission bits; only the owner or root may change them.',
      'Mask st_mode with 07777 to isolate the permission and special bits.',
    ],
    solution: `#include <sys/stat.h>
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 3) { fprintf(stderr, "usage: %s mode path\\n", argv[0]); return 1; }
    mode_t mode = (mode_t)strtol(argv[1], NULL, 8);
    if (chmod(argv[2], mode) == -1) { perror("chmod"); return 1; }
    struct stat st;
    if (stat(argv[2], &st) == -1) { perror("stat"); return 1; }
    printf("mode now %04o\\n", st.st_mode & 07777);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: parse argv[1] as octal, chmod(argv[2], mode)
    // TODO: stat and print resulting bits as %04o (mask 07777)
    return 0;
}`,
    tags: ['chmod', 'permissions', 'octal'],
  },
  {
    id: 'lx-ch04-c-047',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'See the umask Affect Created Mode',
    prompt: `Demonstrate how the process umask masks off permission bits at creation time. Write a program that calls umask(022) to set a known mask, creates "u.txt" with open(..., O_CREAT, 0666), then stat()s it and prints the resulting permission bits (st_mode & 0777) as octal. Explain in a comment why the bits are 0644 and not 0666.`,
    hints: [
      'The effective mode at creation is (requested_mode & ~umask).',
      'With requested 0666 and umask 022, the write bits for group/other are cleared.',
      'umask() returns the previous mask; you can ignore the return value here.',
    ],
    solution: `#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    /* Effective mode = requested & ~umask.
       0666 & ~022 = 0666 & 0755 = 0644: group/other write bits dropped. */
    umask(022);
    int fd = open("u.txt", O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (fd == -1) { perror("open"); return 1; }
    close(fd);
    struct stat st;
    if (stat("u.txt", &st) == -1) { perror("stat"); return 1; }
    printf("created mode = %04o\\n", st.st_mode & 0777);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    // TODO: umask(022), create "u.txt" with mode 0666
    // TODO: stat and print st_mode & 0777 (expect 0644)
    return 0;
}`,
    tags: ['umask', 'permissions', 'open'],
  },
  {
    id: 'lx-ch04-c-048',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test Access Rights With access',
    prompt: `Write a program that, for the path in argv[1], reports whether the calling process can read, write, and execute it, using access() with R_OK, W_OK, and X_OK separately. Also test F_OK to report mere existence. Print one line per check like "read: yes" or "read: no". Remember access() checks the real uid/gid, not the effective ones.`,
    hints: [
      'access(path, R_OK) returns 0 if readable, -1 otherwise (errno EACCES means denied).',
      'You can OR the flags, but checking each separately gives per-permission answers.',
      'F_OK only tests for existence.',
    ],
    solution: `#include <unistd.h>
#include <stdio.h>

static void check(const char *path, int mode, const char *label) {
    printf("%s: %s\\n", label, access(path, mode) == 0 ? "yes" : "no");
}

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: %s path\\n", argv[0]); return 1; }
    check(argv[1], F_OK, "exists");
    check(argv[1], R_OK, "read");
    check(argv[1], W_OK, "write");
    check(argv[1], X_OK, "exec");
    return 0;
}`,
    starter: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: use access() with F_OK, R_OK, W_OK, X_OK on argv[1]
    // TODO: print yes/no for each
    return 0;
}`,
    tags: ['access', 'permissions', 'real-uid'],
  },
  {
    id: 'lx-ch04-c-049',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Create a Hard Link and Watch st_nlink',
    prompt: `Write a program that creates a file "orig.txt" (write "hi\\n"), then makes a hard link "alias.txt" pointing at it with link(). stat() both names and print their inode numbers (they must be equal) and the link count st_nlink (must be 2). Then unlink("orig.txt") and stat "alias.txt" again to show st_nlink dropped to 1 but the data is still reachable. Print whether the inodes matched.`,
    hints: [
      'link(oldpath, newpath) makes a second directory entry for the same inode.',
      'Two hard links to one file share the same st_ino and the same data blocks.',
      'unlink() removes a name; the inode persists until its link count reaches 0.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <stdio.h>

int main(void) {
    int fd = open("orig.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }
    write(fd, "hi\\n", 3);
    close(fd);

    unlink("alias.txt");
    if (link("orig.txt", "alias.txt") == -1) { perror("link"); return 1; }

    struct stat a, b;
    stat("orig.txt", &a);
    stat("alias.txt", &b);
    printf("inodes match: %s\\n", a.st_ino == b.st_ino ? "yes" : "no");
    printf("nlink = %llu\\n", (unsigned long long)a.st_nlink);  /* 2 */

    unlink("orig.txt");
    stat("alias.txt", &b);
    printf("after unlink nlink = %llu\\n", (unsigned long long)b.st_nlink); /* 1 */
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <stdio.h>

int main(void) {
    // TODO: create orig.txt, link it to alias.txt
    // TODO: stat both; print inode equality and st_nlink (expect 2)
    // TODO: unlink orig.txt; stat alias.txt; show nlink dropped to 1
    return 0;
}`,
    tags: ['link', 'hard-link', 'nlink'],
  },
  {
    id: 'lx-ch04-c-050',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Create and Read a Symlink',
    prompt: `Write a program that creates a symbolic link "slink" pointing at the text "target.txt" using symlink(), then reads the link's contents back with readlink() into a buffer and prints it. Note that readlink() does NOT NUL-terminate, so you must terminate the buffer yourself using its return value. Also lstat() the link and confirm S_ISLNK is true.`,
    hints: [
      'symlink(target, linkpath) creates the link; target is stored verbatim as text.',
      'readlink() returns the number of bytes placed in the buffer and never adds a NUL.',
      'Terminate with buf[n] = 0 using the returned length n.',
    ],
    solution: `#include <unistd.h>
#include <sys/stat.h>
#include <stdio.h>

int main(void) {
    unlink("slink");
    if (symlink("target.txt", "slink") == -1) { perror("symlink"); return 1; }

    char buf[256];
    ssize_t n = readlink("slink", buf, sizeof buf - 1);
    if (n == -1) { perror("readlink"); return 1; }
    buf[n] = '\\0';
    printf("slink -> %s\\n", buf);

    struct stat st;
    if (lstat("slink", &st) == -1) { perror("lstat"); return 1; }
    printf("is symlink: %s\\n", S_ISLNK(st.st_mode) ? "yes" : "no");
    return 0;
}`,
    starter: `#include <unistd.h>
#include <sys/stat.h>
#include <stdio.h>

int main(void) {
    // TODO: symlink("target.txt", "slink")
    // TODO: readlink into a buffer; remember it is NOT NUL-terminated
    // TODO: lstat and confirm S_ISLNK
    return 0;
}`,
    tags: ['symlink', 'readlink', 'lstat'],
  },
  {
    id: 'lx-ch04-c-051',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Hard Link vs Symlink: Compare Behavior',
    prompt: `Write a program that creates a file "src.txt", a hard link "hl.txt" (via link), and a symlink "sl.txt" (via symlink to "src.txt"). Then delete "src.txt". Demonstrate that opening "hl.txt" still succeeds (the data survives) but opening "sl.txt" now fails with errno == ENOENT (a dangling symlink). Print "hardlink: ok" / "symlink: dangling" accordingly.`,
    hints: [
      'A hard link references the inode directly, so removing one name keeps the data.',
      'A symlink stores a path; deleting the target leaves the link pointing at nothing.',
      'open() on a dangling symlink fails with ENOENT.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    unlink("hl.txt"); unlink("sl.txt");
    int fd = open("src.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }
    write(fd, "data\\n", 5);
    close(fd);

    if (link("src.txt", "hl.txt") == -1) { perror("link"); return 1; }
    if (symlink("src.txt", "sl.txt") == -1) { perror("symlink"); return 1; }

    unlink("src.txt");   /* remove the original name */

    int h = open("hl.txt", O_RDONLY);
    printf("hardlink: %s\\n", h != -1 ? "ok" : "broken");
    if (h != -1) close(h);

    int s = open("sl.txt", O_RDONLY);
    if (s == -1 && errno == ENOENT) printf("symlink: dangling\\n");
    else { printf("symlink: ok\\n"); if (s != -1) close(s); }
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    // TODO: create src.txt; link -> hl.txt; symlink -> sl.txt
    // TODO: unlink src.txt
    // TODO: show hl.txt still opens, sl.txt open fails with ENOENT
    return 0;
}`,
    tags: ['link', 'symlink', 'inode'],
  },
  {
    id: 'lx-ch04-c-052',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read a /proc Attribute',
    prompt: `Write a program that reads "/proc/self/status" and prints just the line that begins with "VmRSS:" (the resident set size of the process). Open the file, read it into a buffer, then scan for the line. /proc files are generated on read, so a single read() may not return everything; loop until EOF.`,
    hints: [
      '/proc files report size 0 from stat but yield text when read; never trust st_size.',
      'Read repeatedly into a fixed buffer until read() returns 0.',
      'Scan line by line (split on \\n) and match the "VmRSS:" prefix.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fd = open("/proc/self/status", O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }
    char buf[8192];
    size_t total = 0;
    ssize_t n;
    while (total < sizeof buf - 1 &&
           (n = read(fd, buf + total, sizeof buf - 1 - total)) > 0)
        total += (size_t)n;
    buf[total] = '\\0';
    close(fd);

    char *line = strtok(buf, "\\n");
    while (line) {
        if (strncmp(line, "VmRSS:", 6) == 0) {
            printf("%s\\n", line);
            break;
        }
        line = strtok(NULL, "\\n");
    }
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    // TODO: open /proc/self/status, read all of it (loop until EOF)
    // TODO: find and print the line starting with "VmRSS:"
    return 0;
}`,
    tags: ['proc', 'read', 'procfs'],
  },
  {
    id: 'lx-ch04-c-053',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read a /sys Attribute as a Number',
    prompt: `Write a function

    long read_sys_long(const char *path);

that opens a sysfs/procfs attribute file, reads its (usually short, single-value) text contents, and parses the leading integer with strtol. Return the value, or -1 on any error. Demonstrate it by reading "/proc/sys/kernel/pid_max" (a plain integer) and printing it. Each such attribute is typically one small text value terminated by a newline.`,
    hints: [
      'These attribute files are small; one read() into a modest buffer is usually enough, but loop to be safe.',
      'strtol stops at the trailing newline automatically.',
      'NUL-terminate the buffer before parsing.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

long read_sys_long(const char *path) {
    int fd = open(path, O_RDONLY);
    if (fd == -1) return -1;
    char buf[64];
    size_t total = 0;
    ssize_t n = 0;
    while (total < sizeof buf - 1 &&
           (n = read(fd, buf + total, sizeof buf - 1 - total)) > 0)
        total += (size_t)n;
    close(fd);
    if (n == -1) return -1;
    buf[total] = '\\0';
    return strtol(buf, NULL, 10);
}

int main(void) {
    long v = read_sys_long("/proc/sys/kernel/pid_max");
    if (v == -1) { perror("read_sys_long"); return 1; }
    printf("pid_max = %ld\\n", v);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

long read_sys_long(const char *path) {
    // TODO: open path, read its text, NUL-terminate, strtol(buf,NULL,10)
    // TODO: return value or -1 on error
    return -1;
}`,
    tags: ['sysfs', 'proc', 'read'],
  },
  {
    id: 'lx-ch04-c-054',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Redirect stdout to a File With dup2',
    prompt: `Write a program that redirects its own standard output to "redir.txt" using dup2(), then calls printf() so the output lands in the file instead of the terminal. Steps: open "redir.txt" (create/trunc, 0644), fflush(stdout), dup2(fd, STDOUT_FILENO), close the original fd, then printf("hello file\\n") and fflush. Explain in a comment what dup2 does to fd 1.`,
    hints: [
      'dup2(fd, STDOUT_FILENO) closes fd 1 if open and makes it refer to the same file as fd.',
      'After dup2, the original fd is redundant; close it.',
      'stdio buffers: flush before and after so ordering is predictable.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    /* dup2(fd, 1) makes file descriptor 1 (stdout) point at the same open
       file description as fd, after closing whatever fd 1 referred to. */
    int fd = open("redir.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }
    fflush(stdout);
    if (dup2(fd, STDOUT_FILENO) == -1) { perror("dup2"); close(fd); return 1; }
    close(fd);
    printf("hello file\\n");
    fflush(stdout);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    // TODO: open "redir.txt" (create/trunc 0644)
    // TODO: fflush; dup2(fd, STDOUT_FILENO); close fd
    // TODO: printf so it goes to the file
    return 0;
}`,
    tags: ['dup2', 'redirection', 'stdout'],
  },
  {
    id: 'lx-ch04-c-055',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Save and Restore stdout Around a Redirect',
    prompt: `Write a program that (1) saves the current stdout by dup()-ing STDOUT_FILENO into a backup fd, (2) redirects stdout to "tmp.txt" with dup2, (3) printf("captured\\n"), (4) restores the original stdout by dup2(backup, STDOUT_FILENO), and (5) printf("back on terminal\\n"). Close the backup fd at the end. Be careful to fflush(stdout) at each transition because stdio is buffered.`,
    hints: [
      'dup(STDOUT_FILENO) gives a new fd that shares the original terminal/file description.',
      'Flush stdout before each dup2 so buffered text goes to the right destination.',
      'Restore by dup2(backup, STDOUT_FILENO), then close(backup).',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int backup = dup(STDOUT_FILENO);
    if (backup == -1) { perror("dup"); return 1; }

    int fd = open("tmp.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }

    fflush(stdout);
    dup2(fd, STDOUT_FILENO);
    close(fd);
    printf("captured\\n");
    fflush(stdout);

    dup2(backup, STDOUT_FILENO);
    close(backup);
    printf("back on terminal\\n");
    fflush(stdout);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    // TODO: backup = dup(STDOUT_FILENO)
    // TODO: open tmp.txt; fflush; dup2 onto stdout; printf "captured"
    // TODO: fflush; dup2 backup back onto stdout; close backup; printf
    return 0;
}`,
    tags: ['dup', 'dup2', 'redirection'],
  },
  {
    id: 'lx-ch04-c-056',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build an Anonymous Pipe',
    prompt: `Write a program that creates a pipe with pipe(int fds[2]), writes the message "ping\\n" into the write end fds[1], closes the write end, then reads from the read end fds[0] into a buffer and echoes what it got to stdout. Closing the write end is what makes the subsequent read see EOF after the data. (Single-process demo: no fork required.)`,
    hints: [
      'pipe() fills fds[0] (read end) and fds[1] (write end).',
      'Closing the write end signals EOF to readers once buffered data is drained.',
      'read() returns 0 once all data is consumed and all write ends are closed.',
    ],
    solution: `#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fds[2];
    if (pipe(fds) == -1) { perror("pipe"); return 1; }

    const char *msg = "ping\\n";
    write(fds[1], msg, strlen(msg));
    close(fds[1]);   /* reader will now see EOF after the data */

    char buf[64];
    ssize_t n;
    while ((n = read(fds[0], buf, sizeof buf)) > 0)
        write(STDOUT_FILENO, buf, (size_t)n);
    close(fds[0]);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fds[2];
    // TODO: pipe(fds); write "ping\\n" to fds[1]; close fds[1]
    // TODO: read from fds[0] until EOF and echo to stdout
    return 0;
}`,
    tags: ['pipe', 'read', 'write'],
  },
  {
    id: 'lx-ch04-c-057',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Set Non-Blocking Mode With fcntl',
    prompt: `Write a program that creates a pipe, sets the read end to non-blocking by fetching the flags with fcntl(fd, F_GETFL), OR-ing in O_NONBLOCK, and storing them with fcntl(fd, F_SETFL, flags). Then call read() on the empty pipe and show it returns -1 with errno == EAGAIN (or EWOULDBLOCK) instead of blocking forever. Print "would block" in that case.`,
    hints: [
      'Always F_GETFL first, then add O_NONBLOCK, then F_SETFL; do not clobber existing flags.',
      'A non-blocking read on an empty pipe fails immediately with EAGAIN.',
      'EAGAIN and EWOULDBLOCK may be the same value; check for either.',
    ],
    solution: `#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    int fds[2];
    if (pipe(fds) == -1) { perror("pipe"); return 1; }

    int fl = fcntl(fds[0], F_GETFL);
    if (fl == -1) { perror("fcntl getfl"); return 1; }
    if (fcntl(fds[0], F_SETFL, fl | O_NONBLOCK) == -1) {
        perror("fcntl setfl"); return 1;
    }

    char buf[16];
    ssize_t n = read(fds[0], buf, sizeof buf);
    if (n == -1 && (errno == EAGAIN || errno == EWOULDBLOCK))
        printf("would block\\n");
    else
        printf("read returned %zd\\n", n);

    close(fds[0]); close(fds[1]);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    int fds[2];
    if (pipe(fds) == -1) { perror("pipe"); return 1; }
    // TODO: F_GETFL on fds[0], add O_NONBLOCK, F_SETFL
    // TODO: read() the empty pipe; detect EAGAIN/EWOULDBLOCK
    return 0;
}`,
    tags: ['fcntl', 'nonblocking', 'pipe'],
  },
  {
    id: 'lx-ch04-c-058',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Set Close-on-Exec With FD_CLOEXEC',
    prompt: `Write a program that opens a file, then marks its descriptor close-on-exec using fcntl with F_GETFD / F_SETFD and the FD_CLOEXEC flag. Read the flags back with F_GETFD and print whether FD_CLOEXEC is set. Explain in a comment what close-on-exec does when the process calls one of the exec functions. (Note: F_GETFD/F_SETFD operate on the descriptor flags, distinct from F_GETFL/F_SETFL.)`,
    hints: [
      'FD_CLOEXEC is a per-descriptor flag controlled via F_GETFD/F_SETFD.',
      'When set, the descriptor is automatically closed if the process exec()s a new program.',
      'Use F_GETFD to read flags, set FD_CLOEXEC, then F_SETFD to write them back.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    /* FD_CLOEXEC: the kernel closes this fd automatically across an exec(),
       so the newly exec'd program does not inherit it. */
    int fd = open("data.txt", O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    int flags = fcntl(fd, F_GETFD);
    if (flags == -1) { perror("F_GETFD"); close(fd); return 1; }
    if (fcntl(fd, F_SETFD, flags | FD_CLOEXEC) == -1) {
        perror("F_SETFD"); close(fd); return 1;
    }

    flags = fcntl(fd, F_GETFD);
    printf("FD_CLOEXEC set: %s\\n", (flags & FD_CLOEXEC) ? "yes" : "no");
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("data.txt", O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }
    // TODO: F_GETFD, add FD_CLOEXEC, F_SETFD
    // TODO: re-read F_GETFD and report whether FD_CLOEXEC is set
    close(fd);
    return 0;
}`,
    tags: ['fcntl', 'cloexec', 'fd'],
  },
  {
    id: 'lx-ch04-c-059',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Truncate and Grow a File',
    prompt: `Write a program that creates "trunc.txt" with the content "0123456789" (10 bytes), then uses ftruncate(fd, 4) to shrink it to 4 bytes, and finally ftruncate(fd, 8) to grow it to 8 bytes. After each call, fstat the file and print its st_size. Note that growing creates a hole filled with zero bytes. Print the size after each step (expect 10, 4, 8).`,
    hints: [
      'ftruncate(fd, len) sets the file to exactly len bytes; the fd must be writable.',
      'Shrinking discards the tail; growing zero-fills the new region (a sparse hole).',
      'fstat() reads metadata from an open fd without re-opening by path.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <stdio.h>

static off_t size_of(int fd) {
    struct stat st; fstat(fd, &st); return st.st_size;
}

int main(void) {
    int fd = open("trunc.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }
    write(fd, "0123456789", 10);
    printf("after write: %lld\\n", (long long)size_of(fd));

    ftruncate(fd, 4);
    printf("after shrink: %lld\\n", (long long)size_of(fd));

    ftruncate(fd, 8);
    printf("after grow: %lld\\n", (long long)size_of(fd));

    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <stdio.h>

int main(void) {
    // TODO: create trunc.txt, write 10 bytes
    // TODO: ftruncate to 4, then to 8; print st_size after each (10,4,8)
    return 0;
}`,
    tags: ['ftruncate', 'size', 'sparse'],
  },
  {
    id: 'lx-ch04-c-060',
    chapter: 4,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Positioned I/O With pread/pwrite',
    prompt: `Write a program that creates a 16-byte file, then uses pwrite(fd, "XY", 2, 8) to write 2 bytes at offset 8 WITHOUT changing the current file offset, and pread(fd, buf, 2, 8) to read them back from offset 8. Demonstrate that the file offset is unchanged by reading lseek(fd, 0, SEEK_CUR) before and after the pread/pwrite calls. Print both offsets to prove they are equal.`,
    hints: [
      'pread/pwrite take an explicit offset and do not move the file offset.',
      'lseek(fd, 0, SEEK_CUR) returns the current offset without moving it.',
      'This is the building block for thread-safe positional I/O.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("pio.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }
    char zeros[16] = {0};
    write(fd, zeros, sizeof zeros);
    lseek(fd, 5, SEEK_SET);       /* set a known offset */

    off_t before = lseek(fd, 0, SEEK_CUR);
    pwrite(fd, "XY", 2, 8);
    char buf[3] = {0};
    pread(fd, buf, 2, 8);
    off_t after = lseek(fd, 0, SEEK_CUR);

    printf("read back: %s\\n", buf);
    printf("offset before=%lld after=%lld equal=%s\\n",
           (long long)before, (long long)after,
           before == after ? "yes" : "no");
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    // TODO: create a 16-byte file; set offset to a known value
    // TODO: pwrite "XY" at offset 8; pread it back from offset 8
    // TODO: show lseek(SEEK_CUR) is unchanged by pread/pwrite
    return 0;
}`,
    tags: ['pread', 'pwrite', 'offset'],
  },
  {
    id: 'lx-ch04-c-061',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Lines With a Buffered read Loop',
    prompt: `Write a program that counts the number of newline ('\\n') characters in the file named by argv[1], reading with a 65536-byte buffer and the read(2) syscall (no stdio). It must correctly handle short reads, retry on EINTR, and report a hard error via perror. Print the count. This mirrors how 'wc -l' streams a file without loading it all into memory.`,
    hints: [
      'Read into a big buffer in a loop; for each chunk, scan the bytes you actually got.',
      'read() returning 0 is EOF; -1 with EINTR means retry, any other errno is fatal.',
      'Use the returned length, not the buffer size, when scanning.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: %s path\\n", argv[0]); return 1; }
    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    static char buf[65536];
    long long lines = 0;
    ssize_t n;
    for (;;) {
        n = read(fd, buf, sizeof buf);
        if (n == 0) break;
        if (n == -1) {
            if (errno == EINTR) continue;
            perror("read"); close(fd); return 1;
        }
        for (ssize_t i = 0; i < n; i++)
            if (buf[i] == '\\n') lines++;
    }
    close(fd);
    printf("%lld\\n", lines);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: open argv[1]; read in 64KiB chunks; count '\\n' bytes
    // TODO: handle short reads, EINTR retry, and hard errors
    return 0;
}`,
    tags: ['read', 'buffered', 'wc'],
  },
  {
    id: 'lx-ch04-c-062',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Detect Sparse Holes With SEEK_HOLE',
    prompt: `Write a program that opens argv[1] read-only and walks its data/hole map using lseek with SEEK_DATA and SEEK_HOLE. Starting at offset 0, alternately seek to the next data region and the next hole, printing each [start, end) range and whether it is DATA or HOLE, until you reach end of file. A seek with SEEK_DATA that finds only a trailing hole fails with errno == ENXIO; handle that as "hole to EOF". (SEEK_DATA/SEEK_HOLE are extensions exposed via lseek; define _GNU_SOURCE.)`,
    hints: [
      'lseek(fd, off, SEEK_DATA) returns the offset of the next non-hole at or after off.',
      'lseek(fd, off, SEEK_HOLE) returns the next hole, or EOF if the tail is data.',
      'A SEEK_DATA past the last data fails with ENXIO, signalling the trailing hole/EOF.',
    ],
    solution: `#define _GNU_SOURCE
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: %s path\\n", argv[0]); return 1; }
    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    off_t end = lseek(fd, 0, SEEK_END);
    if (end == (off_t)-1) { perror("lseek end"); close(fd); return 1; }

    off_t off = 0;
    while (off < end) {
        off_t data = lseek(fd, off, SEEK_DATA);
        if (data == (off_t)-1) {
            if (errno == ENXIO) {          /* only a hole remains to EOF */
                printf("[%lld,%lld) HOLE\\n", (long long)off, (long long)end);
            } else perror("SEEK_DATA");
            break;
        }
        if (data > off)
            printf("[%lld,%lld) HOLE\\n", (long long)off, (long long)data);

        off_t hole = lseek(fd, data, SEEK_HOLE);
        if (hole == (off_t)-1) { perror("SEEK_HOLE"); break; }
        printf("[%lld,%lld) DATA\\n", (long long)data, (long long)hole);
        off = hole;
    }
    close(fd);
    return 0;
}`,
    starter: `#define _GNU_SOURCE
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: find EOF with SEEK_END
    // TODO: alternate lseek SEEK_DATA / SEEK_HOLE from offset 0
    // TODO: print each [start,end) range as DATA or HOLE; handle ENXIO
    return 0;
}`,
    tags: ['lseek', 'sparse', 'seek-hole'],
  },
  {
    id: 'lx-ch04-c-063',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two FDs Share One Offset After dup',
    prompt: `Demonstrate that dup() (unlike a second open()) makes two descriptors share a single file offset because they point at the SAME open file description. Write a program that opens "shared.txt" (which contains "ABCDEFGH"), dup()s the fd, reads 3 bytes through the first fd, then reads 3 bytes through the duplicate fd. Show that the second read continues from where the first left off (it reads "DEF", not "ABC"). Print both fragments.`,
    hints: [
      'open() twice creates two open file descriptions, each with its own offset.',
      'dup() copies a descriptor that shares the original open file description and its offset.',
      'After reading 3 bytes via fd, the dup sees the offset already at 3.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("shared.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }
    write(fd, "ABCDEFGH", 8);
    close(fd);

    fd = open("shared.txt", O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }
    int fd2 = dup(fd);          /* shares the same offset as fd */
    if (fd2 == -1) { perror("dup"); close(fd); return 1; }

    char a[4] = {0}, b[4] = {0};
    read(fd,  a, 3);            /* "ABC", offset now 3 */
    read(fd2, b, 3);            /* "DEF", continues from shared offset */
    printf("first  = %s\\n", a);
    printf("second = %s\\n", b);

    close(fd); close(fd2);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    // TODO: create shared.txt with "ABCDEFGH"
    // TODO: open it, dup the fd
    // TODO: read 3 via fd, 3 via dup; show the dup continues (DEF)
    return 0;
}`,
    tags: ['dup', 'offset', 'open-file-description'],
  },
  {
    id: 'lx-ch04-c-064',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Wire a Child to a Pipe With fork and dup2',
    prompt: `Write a program that forks a child, connects the child's stdout to the write end of a pipe via dup2, and has the child exec "echo hello". The parent reads from the pipe and prints what it captured, prefixed with "got: ". Close unused pipe ends in BOTH processes (this is essential, or the parent's read never sees EOF). Use execlp in the child; if exec fails, _exit(127).`,
    hints: [
      'After fork, the child dup2(pipe_write, STDOUT_FILENO) then closes both raw pipe fds.',
      'The parent must close the write end so its read() can reach EOF.',
      'execlp("echo", "echo", "hello", NULL) replaces the child image; on failure call _exit.',
    ],
    solution: `#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int p[2];
    if (pipe(p) == -1) { perror("pipe"); return 1; }

    pid_t pid = fork();
    if (pid == -1) { perror("fork"); return 1; }

    if (pid == 0) {                 /* child */
        close(p[0]);                /* not reading */
        dup2(p[1], STDOUT_FILENO);  /* stdout -> pipe write end */
        close(p[1]);
        execlp("echo", "echo", "hello", (char *)NULL);
        _exit(127);                 /* only reached if exec fails */
    }

    close(p[1]);                    /* parent: not writing -> lets read hit EOF */
    char buf[256];
    ssize_t n;
    printf("got: ");
    while ((n = read(p[0], buf, sizeof buf)) > 0)
        fwrite(buf, 1, (size_t)n, stdout);
    close(p[0]);
    wait(NULL);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int p[2];
    if (pipe(p) == -1) { perror("pipe"); return 1; }
    // TODO: fork; in child dup2 p[1] onto stdout, close ends, exec echo
    // TODO: in parent close p[1], read p[0] to EOF, print "got: " + output
    return 0;
}`,
    tags: ['pipe', 'fork', 'dup2'],
  },
  {
    id: 'lx-ch04-c-065',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Atomic Replace With Temp File and rename',
    prompt: `Implement an atomic file update. Write a function

    int atomic_write(const char *path, const char *data, size_t len);

that writes data to a temporary file in the same directory (e.g. path with a ".tmp" suffix), fully flushes it to disk with fsync(), closes it, then rename()s the temp file over path. rename() within one filesystem is atomic, so readers see either the old or the new full file, never a half-written one. Return 0 on success, -1 on error (cleaning up the temp file). Demonstrate from main().`,
    hints: [
      'Write all bytes (handle short writes), then fsync the fd before closing.',
      'rename(tmp, path) atomically replaces path within the same filesystem.',
      'On any error, unlink the temp file so you do not leave junk behind.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <errno.h>

static int write_all(int fd, const char *p, size_t n) {
    size_t t = 0;
    while (t < n) {
        ssize_t w = write(fd, p + t, n - t);
        if (w == -1) { if (errno == EINTR) continue; return -1; }
        t += (size_t)w;
    }
    return 0;
}

int atomic_write(const char *path, const char *data, size_t len) {
    char tmp[4096];
    snprintf(tmp, sizeof tmp, "%s.tmp", path);
    int fd = open(tmp, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) return -1;
    if (write_all(fd, data, len) == -1) { close(fd); unlink(tmp); return -1; }
    if (fsync(fd) == -1)               { close(fd); unlink(tmp); return -1; }
    if (close(fd) == -1)               { unlink(tmp); return -1; }
    if (rename(tmp, path) == -1)       { unlink(tmp); return -1; }
    return 0;
}

int main(void) {
    const char *msg = "fresh contents\\n";
    if (atomic_write("config.txt", msg, strlen(msg)) == -1) {
        perror("atomic_write"); return 1;
    }
    printf("updated atomically\\n");
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int atomic_write(const char *path, const char *data, size_t len) {
    // TODO: write data to "<path>.tmp", fsync, close
    // TODO: rename tmp over path (atomic on same FS); clean up on error
    return -1;
}`,
    tags: ['rename', 'fsync', 'atomic'],
  },
  {
    id: 'lx-ch04-c-066',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'tee: Fan Out stdin to stdout and a File',
    prompt: `Implement a minimal 'tee'. Write a program that reads from standard input (fd 0) in a loop and writes every byte to BOTH standard output (fd 1) and a file named by argv[1] (created/truncated, mode 0644). Use raw read/write with a full-write helper, handle short reads and short writes, retry EINTR, and stop at EOF. Return non-zero on any I/O error.`,
    hints: [
      'Read a chunk from fd 0, then write_all() it to fd 1 and to the output fd.',
      'A single write can be short on either destination; drain both fully.',
      'read() returning 0 is EOF; -1 with EINTR retries.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

static int write_all(int fd, const char *p, size_t n) {
    size_t t = 0;
    while (t < n) {
        ssize_t w = write(fd, p + t, n - t);
        if (w == -1) { if (errno == EINTR) continue; return -1; }
        t += (size_t)w;
    }
    return 0;
}

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: %s file\\n", argv[0]); return 1; }
    int out = open(argv[1], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out == -1) { perror("open"); return 1; }

    char buf[8192];
    ssize_t n;
    for (;;) {
        n = read(STDIN_FILENO, buf, sizeof buf);
        if (n == 0) break;
        if (n == -1) { if (errno == EINTR) continue; perror("read"); return 1; }
        if (write_all(STDOUT_FILENO, buf, (size_t)n) == -1) { perror("write stdout"); return 1; }
        if (write_all(out, buf, (size_t)n) == -1) { perror("write file"); return 1; }
    }
    close(out);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: open argv[1] (create/trunc 0644)
    // TODO: loop reading stdin; write_all to stdout AND to the file
    // TODO: handle short reads/writes, EINTR, EOF
    return 0;
}`,
    tags: ['read', 'write', 'tee'],
  },
  {
    id: 'lx-ch04-c-067',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Recursive Directory Walk With opendir',
    prompt: `Write a function

    void walk(const char *dir);

that recursively lists every regular file under a directory, printing its path. Use opendir/readdir/closedir to iterate entries, skip "." and "..", build child paths, and use lstat() to decide whether each entry is a directory (recurse) or a regular file (print). Do NOT follow symlinks into directories (use lstat, not stat). Demonstrate by walking argv[1] in main().`,
    hints: [
      'readdir returns struct dirent; d_name is the entry name (not a full path).',
      'Skip "." and ".." or you will recurse forever.',
      'lstat each child to classify; recurse on directories, print regular files.',
    ],
    solution: `#include <dirent.h>
#include <sys/stat.h>
#include <string.h>
#include <stdio.h>

void walk(const char *dir) {
    DIR *d = opendir(dir);
    if (!d) { perror(dir); return; }
    struct dirent *e;
    while ((e = readdir(d)) != NULL) {
        if (strcmp(e->d_name, ".") == 0 || strcmp(e->d_name, "..") == 0)
            continue;
        char path[4096];
        snprintf(path, sizeof path, "%s/%s", dir, e->d_name);
        struct stat st;
        if (lstat(path, &st) == -1) { perror(path); continue; }
        if (S_ISDIR(st.st_mode))
            walk(path);                 /* recurse */
        else if (S_ISREG(st.st_mode))
            printf("%s\\n", path);
    }
    closedir(d);
}

int main(int argc, char **argv) {
    walk(argc > 1 ? argv[1] : ".");
    return 0;
}`,
    starter: `#include <dirent.h>
#include <sys/stat.h>
#include <string.h>
#include <stdio.h>

void walk(const char *dir) {
    // TODO: opendir/readdir/closedir; skip "." and ".."
    // TODO: build "dir/name"; lstat; recurse on dirs, print regular files
}`,
    tags: ['opendir', 'readdir', 'lstat'],
  },
  {
    id: 'lx-ch04-c-068',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Wait for Input With poll',
    prompt: `Write a program that waits for standard input to become readable using poll(). Set up a single struct pollfd with fd = STDIN_FILENO and events = POLLIN, call poll() with a 5000 ms timeout, and act on the result: if poll returns 0 print "timeout\\n"; if revents has POLLIN, read available bytes and echo them; if poll returns -1 and errno == EINTR, retry. This is the foundation of multiplexing without busy-waiting.`,
    hints: [
      'poll() returns the number of ready fds, 0 on timeout, -1 on error.',
      'Check the returned revents for POLLIN before reading.',
      'On EINTR, just call poll() again.',
    ],
    solution: `#include <poll.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    struct pollfd pfd = { .fd = STDIN_FILENO, .events = POLLIN };
    for (;;) {
        int r = poll(&pfd, 1, 5000);
        if (r == -1) {
            if (errno == EINTR) continue;
            perror("poll");
            return 1;
        }
        if (r == 0) { printf("timeout\\n"); break; }
        if (pfd.revents & POLLIN) {
            char buf[256];
            ssize_t n = read(STDIN_FILENO, buf, sizeof buf);
            if (n <= 0) break;          /* EOF or error */
            write(STDOUT_FILENO, buf, (size_t)n);
            break;
        }
    }
    return 0;
}`,
    starter: `#include <poll.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    struct pollfd pfd = { .fd = STDIN_FILENO, .events = POLLIN };
    // TODO: poll(&pfd, 1, 5000); handle timeout(0), POLLIN, and EINTR retry
    return 0;
}`,
    tags: ['poll', 'nonblocking', 'multiplexing'],
  },
  {
    id: 'lx-ch04-c-069',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Advisory File Locking With fcntl',
    prompt: `Write a program that takes an advisory write lock on the whole of "shared.dat" using fcntl(fd, F_SETLK, &fl) with a struct flock { l_type = F_WRLCK, l_whence = SEEK_SET, l_start = 0, l_len = 0 } (l_len 0 means "to EOF/whole file"). If the lock is already held by another process, F_SETLK returns -1 with errno EACCES or EAGAIN; report "locked by another process" and exit 1. On success, print a message holding the lock, then release it with l_type = F_UNLCK. Explain in a comment why this is "advisory".`,
    hints: [
      'Fill struct flock then call fcntl(fd, F_SETLK, &fl); F_SETLK does not block.',
      'l_len == 0 with l_start == 0 and SEEK_SET locks the whole file, even as it grows.',
      'Advisory locks are only honored by processes that also call fcntl; they do not block raw read/write.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    int fd = open("shared.dat", O_RDWR | O_CREAT, 0644);
    if (fd == -1) { perror("open"); return 1; }

    /* Advisory: the kernel only enforces this lock against other processes
       that also use fcntl locks; it does not stop plain read()/write(). */
    struct flock fl = {
        .l_type = F_WRLCK, .l_whence = SEEK_SET,
        .l_start = 0, .l_len = 0          /* whole file */
    };

    if (fcntl(fd, F_SETLK, &fl) == -1) {
        if (errno == EACCES || errno == EAGAIN)
            fprintf(stderr, "locked by another process\\n");
        else
            perror("fcntl F_SETLK");
        close(fd);
        return 1;
    }

    printf("lock acquired\\n");
    /* ... critical section ... */

    fl.l_type = F_UNLCK;
    fcntl(fd, F_SETLK, &fl);
    printf("lock released\\n");
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(void) {
    int fd = open("shared.dat", O_RDWR | O_CREAT, 0644);
    if (fd == -1) { perror("open"); return 1; }
    // TODO: fill struct flock (F_WRLCK, SEEK_SET, 0, 0) and F_SETLK
    // TODO: detect EACCES/EAGAIN -> "locked by another process"
    // TODO: on success, then unlock with F_UNLCK
    return 0;
}`,
    tags: ['fcntl', 'flock', 'locking'],
  },
  {
    id: 'lx-ch04-c-070',
    chapter: 4,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Watch a File With inotify',
    prompt: `Write a program that uses inotify to watch the file named by argv[1] for modification. Create an instance with inotify_init1(0), add a watch for IN_MODIFY with inotify_add_watch, then read() events into a buffer in a loop. Each event is a struct inotify_event possibly followed by a variable-length name; advance through the buffer by sizeof(struct inotify_event) + event->len. Print "modified\\n" for each IN_MODIFY and exit after the first one. A single read() can return multiple packed events.`,
    hints: [
      'A single read() on the inotify fd can return several variable-length events packed together.',
      'Advance your cursor by sizeof(struct inotify_event) + event->len each iteration.',
      'inotify_add_watch returns a watch descriptor; check it and the read for -1.',
    ],
    solution: `#include <sys/inotify.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: %s path\\n", argv[0]); return 1; }
    int fd = inotify_init1(0);
    if (fd == -1) { perror("inotify_init1"); return 1; }
    int wd = inotify_add_watch(fd, argv[1], IN_MODIFY);
    if (wd == -1) { perror("inotify_add_watch"); close(fd); return 1; }

    char buf[4096] __attribute__((aligned(__alignof__(struct inotify_event))));
    for (;;) {
        ssize_t len = read(fd, buf, sizeof buf);
        if (len == -1) { perror("read"); close(fd); return 1; }

        for (char *p = buf; p < buf + len; ) {
            struct inotify_event *ev = (struct inotify_event *)p;
            if (ev->mask & IN_MODIFY) {
                printf("modified\\n");
                inotify_rm_watch(fd, wd);
                close(fd);
                return 0;
            }
            p += sizeof(struct inotify_event) + ev->len;
        }
    }
}`,
    starter: `#include <sys/inotify.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: inotify_init1(0); inotify_add_watch(fd, argv[1], IN_MODIFY)
    // TODO: read events; walk packed events by sizeof(event)+ev->len
    // TODO: print "modified" on IN_MODIFY and exit
    return 0;
}`,
    tags: ['inotify', 'events', 'read'],
  },
]

export default problems
