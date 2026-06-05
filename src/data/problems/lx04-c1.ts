import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch04-c-001',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Open a File for Reading',
    prompt: `Write a C program that opens the file "data.txt" for reading using the open(2) system call. If open returns -1, call perror("open") and exit with status 1. Otherwise print "opened fd=N\\n" where N is the returned file descriptor, then close it.

Use open(), not fopen(). Remember to include the right headers.`,
    hints: [
      'open() lives in <fcntl.h>; the O_RDONLY flag asks for read-only access.',
      'A successful open returns a small non-negative integer (the file descriptor); failure returns -1.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int fd = open("data.txt", O_RDONLY);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    printf("opened fd=%d\\n", fd);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // TODO: open "data.txt" read-only, check for error, print the fd, close it
    return 0;
}`,
    tags: ['open', 'fd', 'syscall'],
  },
  {
    id: 'lx-ch04-c-002',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Write a String to a New File',
    prompt: `Create (or truncate) a file "out.txt" and write the bytes "hello\\n" into it using the write(2) system call. Open with flags O_WRONLY | O_CREAT | O_TRUNC and mode 0644. Close the file when done. Check open and write for errors with perror.`,
    hints: [
      'O_CREAT requires you to pass a mode argument to open().',
      'write() takes a file descriptor, a pointer to bytes, and a byte count.',
      'Use strlen or a literal length of 6 for "hello\\n".',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    const char *msg = "hello\\n";
    ssize_t n = write(fd, msg, strlen(msg));
    if (n == -1) {
        perror("write");
        close(fd);
        return 1;
    }
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    // TODO: open "out.txt" for writing (create/truncate, mode 0644)
    // TODO: write "hello\\n" and close
    return 0;
}`,
    tags: ['write', 'open', 'fd'],
  },
  {
    id: 'lx-ch04-c-003',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read One Buffer and Print It',
    prompt: `Open "data.txt" read-only, read up to 256 bytes into a buffer with a single read(2) call, and write exactly the number of bytes returned to standard output (fd 1). Do not assume the file is text-terminated; use the count read() returns.`,
    hints: [
      'read() returns the number of bytes actually read, which may be less than the buffer size.',
      'Standard output is file descriptor 1.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("data.txt", O_RDONLY);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    char buf[256];
    ssize_t n = read(fd, buf, sizeof(buf));
    if (n == -1) {
        perror("read");
        close(fd);
        return 1;
    }
    write(1, buf, n);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("data.txt", O_RDONLY);
    char buf[256];
    // TODO: read up to 256 bytes, then write exactly that many to fd 1
    return 0;
}`,
    tags: ['read', 'write', 'fd'],
  },
  {
    id: 'lx-ch04-c-004',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Standard Streams Are Descriptors 0, 1, 2',
    prompt: `Without using printf, write the message "stdout\\n" to file descriptor 1 and "stderr\\n" to file descriptor 2 using write(2). Use the well-known descriptor numbers directly.`,
    hints: [
      'fd 0 is stdin, fd 1 is stdout, fd 2 is stderr.',
      'You can also use the constants STDOUT_FILENO and STDERR_FILENO from <unistd.h>.',
    ],
    solution: `#include <unistd.h>
#include <string.h>

int main(void) {
    const char *a = "stdout\\n";
    const char *b = "stderr\\n";
    write(STDOUT_FILENO, a, strlen(a));
    write(STDERR_FILENO, b, strlen(b));
    return 0;
}`,
    starter: `#include <unistd.h>
#include <string.h>

int main(void) {
    // TODO: write "stdout\\n" to fd 1 and "stderr\\n" to fd 2
    return 0;
}`,
    tags: ['write', 'fd', 'stdio'],
  },
  {
    id: 'lx-ch04-c-005',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Append to a Log File',
    prompt: `Open "log.txt" so that each run appends to the end without erasing existing contents, creating the file if it does not exist (mode 0644). Append the line "entry\\n". Use the O_APPEND flag. Close when done.`,
    hints: [
      'O_APPEND makes every write seek to the end of the file first, atomically.',
      'Combine O_WRONLY | O_CREAT | O_APPEND.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fd = open("log.txt", O_WRONLY | O_CREAT | O_APPEND, 0644);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    const char *line = "entry\\n";
    if (write(fd, line, strlen(line)) == -1)
        perror("write");
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    // TODO: open "log.txt" in append mode (create if missing), write "entry\\n"
    return 0;
}`,
    tags: ['open', 'append', 'write'],
  },
  {
    id: 'lx-ch04-c-006',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'File Size with stat',
    prompt: `Write a program that takes a path as argv[1], calls stat(2) on it, and prints the file size in bytes as "size=N\\n" where N comes from st_size. On error, call perror("stat") and return 1.`,
    hints: [
      'stat() fills a struct stat that you pass by address.',
      'The file size is the st_size field; print it with %lld after casting to long long.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    struct stat st;
    if (stat(argv[1], &st) == -1) {
        perror("stat");
        return 1;
    }
    printf("size=%lld\\n", (long long)st.st_size);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    struct stat st;
    // TODO: stat argv[1], handle error, print st_size as "size=N"
    return 0;
}`,
    tags: ['stat', 'metadata'],
  },
  {
    id: 'lx-ch04-c-007',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Is It a Regular File or a Directory?',
    prompt: `Take a path as argv[1], stat it, and print "regular\\n", "directory\\n", or "other\\n" depending on the file type. Use the S_ISREG and S_ISDIR macros on st_mode.`,
    hints: [
      'S_ISREG(st.st_mode) is true for a regular file; S_ISDIR for a directory.',
      'These macros are in <sys/stat.h>.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    struct stat st;
    if (stat(argv[1], &st) == -1) {
        perror("stat");
        return 1;
    }
    if (S_ISREG(st.st_mode))
        printf("regular\\n");
    else if (S_ISDIR(st.st_mode))
        printf("directory\\n");
    else
        printf("other\\n");
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    struct stat st;
    // TODO: stat argv[1], then classify with S_ISREG / S_ISDIR
    return 0;
}`,
    tags: ['stat', 'metadata', 'filetype'],
  },
  {
    id: 'lx-ch04-c-008',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Permission Bits in Octal',
    prompt: `Take a path as argv[1], stat it, and print only the permission bits (the low 12 bits, including setuid/setgid/sticky) in octal as "perm=0NNNN\\n". Mask st_mode with 07777.`,
    hints: [
      'st_mode includes both the file type and the permission bits.',
      'The permission bits are st_mode & 07777; print with the %o conversion.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    struct stat st;
    if (stat(argv[1], &st) == -1) {
        perror("stat");
        return 1;
    }
    printf("perm=0%04o\\n", st.st_mode & 07777);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    struct stat st;
    // TODO: stat argv[1] and print (st.st_mode & 07777) in octal
    return 0;
}`,
    tags: ['stat', 'permissions', 'octal'],
  },
  {
    id: 'lx-ch04-c-009',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Change a File Mode with chmod',
    prompt: `Take a path as argv[1] and set its permissions to 0600 (read/write for owner only) using chmod(2). Print "ok\\n" on success, or perror("chmod") and return 1 on failure.`,
    hints: [
      'chmod() takes a path and a mode_t mode argument.',
      'Octal literals start with a leading 0, so 0600 means rw-------.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    if (chmod(argv[1], 0600) == -1) {
        perror("chmod");
        return 1;
    }
    printf("ok\\n");
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: chmod argv[1] to 0600, handle error, print "ok"
    return 0;
}`,
    tags: ['chmod', 'permissions'],
  },
  {
    id: 'lx-ch04-c-010',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create a Symbolic Link',
    prompt: `Create a symbolic link named argv[2] that points at the target path argv[1] using symlink(2). For example, running the program with arguments "target.txt link.txt" creates link.txt -> target.txt. Print "ok\\n" on success.`,
    hints: [
      'symlink(target, linkpath) creates linkpath pointing at target.',
      'A symlink can point at a target that does not exist yet; the target is stored as a literal path.',
    ],
    solution: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 3) {
        fprintf(stderr, "usage: %s TARGET LINK\\n", argv[0]);
        return 1;
    }
    if (symlink(argv[1], argv[2]) == -1) {
        perror("symlink");
        return 1;
    }
    printf("ok\\n");
    return 0;
}`,
    starter: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: symlink(argv[1], argv[2]); handle error; print "ok"
    return 0;
}`,
    tags: ['symlink', 'links'],
  },
  {
    id: 'lx-ch04-c-011',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create a Hard Link',
    prompt: `Create a hard link named argv[2] for the existing file argv[1] using link(2). After this, both names refer to the same inode. Print "ok\\n" on success, or perror("link") on failure.`,
    hints: [
      'link(oldpath, newpath) adds a second directory entry for the same inode.',
      'Hard links share the inode, so they have the same link count and metadata.',
    ],
    solution: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 3) {
        fprintf(stderr, "usage: %s OLD NEW\\n", argv[0]);
        return 1;
    }
    if (link(argv[1], argv[2]) == -1) {
        perror("link");
        return 1;
    }
    printf("ok\\n");
    return 0;
}`,
    starter: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: link(argv[1], argv[2]); handle error; print "ok"
    return 0;
}`,
    tags: ['link', 'hardlink', 'inode'],
  },
  {
    id: 'lx-ch04-c-012',
    chapter: 4,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read a /proc Attribute',
    prompt: `Open "/proc/sys/kernel/ostype" read-only and print its contents to standard output. This /proc file behaves like a regular file when read. Read into a buffer and write the bytes you got to fd 1.`,
    hints: [
      'Files under /proc are read just like normal files: open, read, write to fd 1.',
      'Reading /proc/sys/kernel/ostype typically yields "Linux\\n".',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("/proc/sys/kernel/ostype", O_RDONLY);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    char buf[128];
    ssize_t n = read(fd, buf, sizeof(buf));
    if (n > 0)
        write(1, buf, n);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    // TODO: open /proc/sys/kernel/ostype, read it, write the bytes to fd 1
    return 0;
}`,
    tags: ['proc', 'read', 'open'],
  },
  {
    id: 'lx-ch04-c-013',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read the Whole File in a Loop',
    prompt: `Write a function "int cat_fd(int fd)" that reads from fd in a loop into a 4096-byte buffer and writes each chunk to standard output, until read() returns 0 (end of file). Return 0 on success, -1 on a read or write error. In main, open argv[1] and call cat_fd.

A single read() can return fewer bytes than requested, so you must loop until EOF.`,
    hints: [
      'read() returning 0 means end of file; a positive value is the count read.',
      'Write exactly the number of bytes read, not the whole buffer.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int cat_fd(int fd) {
    char buf[4096];
    ssize_t n;
    while ((n = read(fd, buf, sizeof(buf))) > 0) {
        ssize_t off = 0;
        while (off < n) {
            ssize_t w = write(1, buf + off, n - off);
            if (w == -1)
                return -1;
            off += w;
        }
    }
    return (n == -1) ? -1 : 0;
}

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s FILE\\n", argv[0]);
        return 1;
    }
    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    int r = cat_fd(fd);
    close(fd);
    return r == 0 ? 0 : 1;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int cat_fd(int fd) {
    char buf[4096];
    // TODO: loop reading until EOF, writing each chunk to fd 1
    return 0;
}

int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY);
    return cat_fd(fd);
}`,
    tags: ['read', 'loop', 'eof'],
  },
  {
    id: 'lx-ch04-c-014',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Robust write_all Helper',
    prompt: `write(2) may write fewer bytes than requested ("short write"). Implement "ssize_t write_all(int fd, const void *buf, size_t count)" that keeps calling write until all count bytes are written or an error occurs. Return count on success, or -1 on error. Demonstrate it by writing a 5000-byte buffer of 'A' to standard output.`,
    hints: [
      'Track an offset and subtract written bytes from the remaining count each iteration.',
      'Cast the buffer to const char* so you can do pointer arithmetic on bytes.',
    ],
    solution: `#include <unistd.h>
#include <stdio.h>

ssize_t write_all(int fd, const void *buf, size_t count) {
    const char *p = buf;
    size_t left = count;
    while (left > 0) {
        ssize_t w = write(fd, p, left);
        if (w == -1)
            return -1;
        p += w;
        left -= (size_t)w;
    }
    return (ssize_t)count;
}

int main(void) {
    char buf[5000];
    for (int i = 0; i < 5000; i++)
        buf[i] = 'A';
    if (write_all(1, buf, sizeof(buf)) == -1) {
        perror("write_all");
        return 1;
    }
    return 0;
}`,
    starter: `#include <unistd.h>
#include <stdio.h>

ssize_t write_all(int fd, const void *buf, size_t count) {
    // TODO: loop write() until all bytes go out or an error occurs
    return -1;
}

int main(void) {
    char buf[5000];
    // TODO: fill with 'A', then write_all to fd 1
    return 0;
}`,
    tags: ['write', 'short-write', 'loop'],
  },
  {
    id: 'lx-ch04-c-015',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Copy a File with read/write',
    prompt: `Implement a small cp: open argv[1] for reading and argv[2] for writing (create/truncate, mode 0644), then copy all bytes from source to destination using a read/write loop with a 4096-byte buffer. Handle short writes by writing exactly the number of bytes you read. Close both descriptors.`,
    hints: [
      'Open the destination with O_WRONLY | O_CREAT | O_TRUNC and mode 0644.',
      'Write only n bytes where n is what the matching read returned, and loop until that chunk is fully written.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 3) {
        fprintf(stderr, "usage: %s SRC DST\\n", argv[0]);
        return 1;
    }
    int in = open(argv[1], O_RDONLY);
    if (in == -1) { perror("open src"); return 1; }
    int out = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out == -1) { perror("open dst"); close(in); return 1; }

    char buf[4096];
    ssize_t n;
    while ((n = read(in, buf, sizeof(buf))) > 0) {
        ssize_t off = 0;
        while (off < n) {
            ssize_t w = write(out, buf + off, n - off);
            if (w == -1) { perror("write"); close(in); close(out); return 1; }
            off += w;
        }
    }
    if (n == -1) perror("read");
    close(in);
    close(out);
    return n == -1 ? 1 : 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    int in = open(argv[1], O_RDONLY);
    int out = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    char buf[4096];
    // TODO: read/write loop until EOF, handling short writes
    return 0;
}`,
    tags: ['read', 'write', 'copy'],
  },
  {
    id: 'lx-ch04-c-016',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Bytes in a File',
    prompt: `Write a program that opens argv[1] and counts the total number of bytes by reading in a loop and summing the counts each read() returns, until EOF. Print "bytes=N\\n". Do NOT use stat; count via reading.`,
    hints: [
      'Accumulate the return value of each read() that is > 0.',
      'Use an off_t or long long accumulator so large files do not overflow.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s FILE\\n", argv[0]);
        return 1;
    }
    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    char buf[4096];
    long long total = 0;
    ssize_t n;
    while ((n = read(fd, buf, sizeof(buf))) > 0)
        total += n;
    if (n == -1) { perror("read"); close(fd); return 1; }

    printf("bytes=%lld\\n", total);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY);
    long long total = 0;
    // TODO: loop reading, summing counts, until EOF; print "bytes=N"
    return 0;
}`,
    tags: ['read', 'loop', 'count'],
  },
  {
    id: 'lx-ch04-c-017',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Newlines (wc -l)',
    prompt: `Open argv[1] and count how many newline ('\\n') bytes it contains by reading in a loop and scanning each chunk. Print "lines=N\\n". This is the core of "wc -l".`,
    hints: [
      'Scan the first n bytes of each buffer (where n is what read returned).',
      'Increment a counter every time buf[i] == 0x0a.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s FILE\\n", argv[0]);
        return 1;
    }
    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    char buf[4096];
    long long lines = 0;
    ssize_t n;
    while ((n = read(fd, buf, sizeof(buf))) > 0) {
        for (ssize_t i = 0; i < n; i++)
            if (buf[i] == '\\n')
                lines++;
    }
    if (n == -1) { perror("read"); close(fd); return 1; }

    printf("lines=%lld\\n", lines);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY);
    char buf[4096];
    long long lines = 0;
    // TODO: read in a loop, count '\\n' bytes, print "lines=N"
    return 0;
}`,
    tags: ['read', 'loop', 'count'],
  },
  {
    id: 'lx-ch04-c-018',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'lseek to a Specific Offset',
    prompt: `Open argv[1] read-only. Use lseek(2) to move the file offset to byte 10 (SEEK_SET), then read 16 bytes from there into a buffer and write them to standard output. If the file is shorter than 10 bytes, lseek still succeeds but read will return 0; handle that gracefully.`,
    hints: [
      'lseek(fd, 10, SEEK_SET) sets the offset to absolute position 10.',
      'The next read() begins at the offset lseek left you at.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s FILE\\n", argv[0]);
        return 1;
    }
    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    if (lseek(fd, 10, SEEK_SET) == (off_t)-1) {
        perror("lseek");
        close(fd);
        return 1;
    }
    char buf[16];
    ssize_t n = read(fd, buf, sizeof(buf));
    if (n == -1) { perror("read"); close(fd); return 1; }
    write(1, buf, n);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY);
    // TODO: lseek to offset 10 (SEEK_SET), read 16 bytes, write them to fd 1
    return 0;
}`,
    tags: ['lseek', 'offset', 'read'],
  },
  {
    id: 'lx-ch04-c-019',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Get File Size via lseek SEEK_END',
    prompt: `Open argv[1] read-only and determine its size by calling lseek(fd, 0, SEEK_END), which returns the resulting offset (the end position). Print "size=N\\n". This works on regular files without using stat.`,
    hints: [
      'lseek returns the new absolute offset as an off_t.',
      'Seeking 0 bytes from SEEK_END lands you at the file size.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s FILE\\n", argv[0]);
        return 1;
    }
    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    off_t size = lseek(fd, 0, SEEK_END);
    if (size == (off_t)-1) {
        perror("lseek");
        close(fd);
        return 1;
    }
    printf("size=%lld\\n", (long long)size);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY);
    // TODO: off_t size = lseek(fd, 0, SEEK_END); print "size=N"
    return 0;
}`,
    tags: ['lseek', 'offset', 'size'],
  },
  {
    id: 'lx-ch04-c-020',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read the Last N Bytes (tail)',
    prompt: `Write a "tail" that prints the last 20 bytes of argv[1]. Use lseek with SEEK_END and a negative offset to position 20 bytes before the end, then read and write to standard output. If the file is shorter than 20 bytes, seek to the beginning instead and print the whole file.`,
    hints: [
      'First find the size with lseek(fd, 0, SEEK_END); pick the start offset as max(0, size - 20).',
      'Then lseek to that start offset with SEEK_SET before reading.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s FILE\\n", argv[0]);
        return 1;
    }
    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) { perror("open"); return 1; }

    off_t size = lseek(fd, 0, SEEK_END);
    if (size == (off_t)-1) { perror("lseek"); close(fd); return 1; }

    off_t start = size > 20 ? size - 20 : 0;
    if (lseek(fd, start, SEEK_SET) == (off_t)-1) {
        perror("lseek");
        close(fd);
        return 1;
    }
    char buf[64];
    ssize_t n;
    while ((n = read(fd, buf, sizeof(buf))) > 0)
        write(1, buf, n);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY);
    off_t size = lseek(fd, 0, SEEK_END);
    // TODO: compute start = max(0, size-20), seek there, read+write to EOF
    return 0;
}`,
    tags: ['lseek', 'tail', 'offset'],
  },
  {
    id: 'lx-ch04-c-021',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Print Owner UID, GID, and Link Count',
    prompt: `stat argv[1] and print three lines:
uid=U
gid=G
links=L
where U is st_uid, G is st_gid, and L is st_nlink. A regular file usually has links=1; a file with a hard link to it shows 2.`,
    hints: [
      'st_uid and st_gid are unsigned; print them with %u after casting to unsigned.',
      'st_nlink is the hard-link count; print with %lu after casting to unsigned long.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    struct stat st;
    if (stat(argv[1], &st) == -1) {
        perror("stat");
        return 1;
    }
    printf("uid=%u\\n", (unsigned)st.st_uid);
    printf("gid=%u\\n", (unsigned)st.st_gid);
    printf("links=%lu\\n", (unsigned long)st.st_nlink);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    struct stat st;
    // TODO: stat argv[1], print st_uid, st_gid, st_nlink
    return 0;
}`,
    tags: ['stat', 'metadata', 'links'],
  },
  {
    id: 'lx-ch04-c-022',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'lstat vs stat on a Symlink',
    prompt: `Given a path argv[1] that is a symbolic link, call both stat (follows the link) and lstat (does not). Print "stat-isdir=X lstat-islnk=Y\\n" where X is 1 if stat reports a directory else 0, and Y is 1 if lstat reports a symlink else 0. Use S_ISDIR and S_ISLNK.`,
    hints: [
      'stat() follows symlinks and reports the target; lstat() reports the link itself.',
      'S_ISLNK is only ever true for the result of lstat, never stat.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    struct stat s, l;
    if (stat(argv[1], &s) == -1) { perror("stat"); return 1; }
    if (lstat(argv[1], &l) == -1) { perror("lstat"); return 1; }

    int isdir = S_ISDIR(s.st_mode) ? 1 : 0;
    int islnk = S_ISLNK(l.st_mode) ? 1 : 0;
    printf("stat-isdir=%d lstat-islnk=%d\\n", isdir, islnk);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    struct stat s, l;
    // TODO: stat() and lstat() argv[1]; compare S_ISDIR(s) and S_ISLNK(l)
    return 0;
}`,
    tags: ['stat', 'lstat', 'symlink'],
  },
  {
    id: 'lx-ch04-c-023',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read a Symlink Target with readlink',
    prompt: `Use readlink(2) to print where the symbolic link argv[1] points. readlink writes the target into a buffer but does NOT null-terminate it; it returns the number of bytes written. Null-terminate manually before printing, and print "target=...\\n".`,
    hints: [
      'readlink returns the byte count written, or -1 on error; it never adds a terminating null.',
      'Place the null at buf[n] where n is the return value (ensure your buffer has room).',
    ],
    solution: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s LINK\\n", argv[0]);
        return 1;
    }
    char buf[4096];
    ssize_t n = readlink(argv[1], buf, sizeof(buf) - 1);
    if (n == -1) {
        perror("readlink");
        return 1;
    }
    buf[n] = '\\0';
    printf("target=%s\\n", buf);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    char buf[4096];
    // TODO: readlink argv[1] into buf, null-terminate at the returned length, print target
    return 0;
}`,
    tags: ['readlink', 'symlink', 'links'],
  },
  {
    id: 'lx-ch04-c-024',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build a Permission String Like ls -l',
    prompt: `stat argv[1] and print a 9-character permission string like "rwxr-xr--" derived from st_mode. For each of owner/group/other, print 'r','w','x' if the corresponding bit (S_IRUSR, S_IWUSR, ... S_IXOTH) is set, otherwise '-'. End with a newline.`,
    hints: [
      'There are 9 permission bits: S_IRUSR/S_IWUSR/S_IXUSR, then GRP, then OTH.',
      'Test each bit with st.st_mode & S_IRUSR (etc.) and choose the letter or a dash.',
    ],
    solution: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    struct stat st;
    if (stat(argv[1], &st) == -1) {
        perror("stat");
        return 1;
    }
    mode_t m = st.st_mode;
    char s[10];
    s[0] = (m & S_IRUSR) ? 'r' : '-';
    s[1] = (m & S_IWUSR) ? 'w' : '-';
    s[2] = (m & S_IXUSR) ? 'x' : '-';
    s[3] = (m & S_IRGRP) ? 'r' : '-';
    s[4] = (m & S_IWGRP) ? 'w' : '-';
    s[5] = (m & S_IXGRP) ? 'x' : '-';
    s[6] = (m & S_IROTH) ? 'r' : '-';
    s[7] = (m & S_IWOTH) ? 'w' : '-';
    s[8] = (m & S_IXOTH) ? 'x' : '-';
    s[9] = '\\0';
    printf("%s\\n", s);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **argv) {
    struct stat st;
    // TODO: stat argv[1] and build a 9-char "rwxrwxrwx"-style string from st_mode
    return 0;
}`,
    tags: ['stat', 'permissions', 'mode'],
  },
  {
    id: 'lx-ch04-c-025',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Check Access with the access() Call',
    prompt: `Use access(2) to test whether the current process can read and write argv[1]. Print "readable=X writable=Y\\n" where each is 1 or 0. Call access(path, R_OK) and access(path, W_OK); a return of 0 means the access is allowed.`,
    hints: [
      'access() returns 0 if the requested access is permitted, -1 otherwise.',
      'R_OK, W_OK, X_OK, and F_OK are the mode constants; combine or test individually.',
    ],
    solution: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    int readable = (access(argv[1], R_OK) == 0) ? 1 : 0;
    int writable = (access(argv[1], W_OK) == 0) ? 1 : 0;
    printf("readable=%d writable=%d\\n", readable, writable);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: use access() with R_OK and W_OK, print "readable=X writable=Y"
    return 0;
}`,
    tags: ['access', 'permissions'],
  },
  {
    id: 'lx-ch04-c-026',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fail to Create an Existing File with O_EXCL',
    prompt: `Open argv[1] with O_WRONLY | O_CREAT | O_EXCL and mode 0644. O_EXCL combined with O_CREAT makes open fail with errno EEXIST if the file already exists. If open succeeds, print "created\\n" and close it. If it fails because the file exists, print "exists\\n"; for any other error, call perror and return 1.`,
    hints: [
      'O_CREAT | O_EXCL atomically creates the file only if it does not already exist.',
      'Compare errno to EEXIST (include <errno.h>) to distinguish "already exists" from other failures.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    int fd = open(argv[1], O_WRONLY | O_CREAT | O_EXCL, 0644);
    if (fd == -1) {
        if (errno == EEXIST) {
            printf("exists\\n");
            return 0;
        }
        perror("open");
        return 1;
    }
    printf("created\\n");
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    int fd = open(argv[1], O_WRONLY | O_CREAT | O_EXCL, 0644);
    // TODO: print "created" on success; on EEXIST print "exists"; else perror
    return 0;
}`,
    tags: ['open', 'oexcl', 'errno'],
  },
  {
    id: 'lx-ch04-c-027',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Redirect stdout to a File with dup2',
    prompt: `Open "captured.txt" for writing (create/truncate, mode 0644). Use dup2(2) to make file descriptor 1 (stdout) refer to that file, then call printf("redirected\\n") so the output lands in the file instead of the terminal. Close the original descriptor after duplicating it.`,
    hints: [
      'dup2(fd, 1) closes fd 1 if open and makes it a copy of fd, pointing at the same file.',
      'After dup2 succeeds, the original fd is redundant; close it.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("captured.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    if (dup2(fd, 1) == -1) {
        perror("dup2");
        close(fd);
        return 1;
    }
    close(fd);
    printf("redirected\\n");
    fflush(stdout);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("captured.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    // TODO: dup2(fd, 1) so stdout goes to the file; close fd; printf("redirected")
    return 0;
}`,
    tags: ['dup2', 'redirection', 'stdout'],
  },
  {
    id: 'lx-ch04-c-028',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Duplicate a Descriptor with dup',
    prompt: `Open "out.txt" for writing (create/truncate, mode 0644). Call dup(2) to get a second descriptor for the same open file. Write "first " through the original and "second\\n" through the duplicate. Because both share one open file description, the writes append at successive offsets and the file ends up "first second\\n". Close both.`,
    hints: [
      'dup() returns the lowest available descriptor referring to the same open file description.',
      'Both descriptors share the same file offset, so writes through either advance it.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) { perror("open"); return 1; }

    int fd2 = dup(fd);
    if (fd2 == -1) { perror("dup"); close(fd); return 1; }

    write(fd, "first ", 6);
    write(fd2, "second\\n", 7);

    close(fd);
    close(fd2);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    int fd2 = dup(fd);
    // TODO: write "first " through fd and "second\\n" through fd2; close both
    return 0;
}`,
    tags: ['dup', 'fd', 'offset'],
  },
  {
    id: 'lx-ch04-c-029',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Create a Pipe and Send a Message',
    prompt: `Use pipe(2) to create a pipe (an array of two fds: fd[0] read end, fd[1] write end). Write "ping\\n" into the write end, then read it back from the read end into a buffer and print it to standard output. Close both ends when done. (No fork needed; a pipe works within one process too.)`,
    hints: [
      'pipe(fd) fills fd[0] (read) and fd[1] (write) and returns 0 on success.',
      'Write to fd[1], read from fd[0]; bytes flow one direction only.',
    ],
    solution: `#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fd[2];
    if (pipe(fd) == -1) {
        perror("pipe");
        return 1;
    }
    const char *msg = "ping\\n";
    write(fd[1], msg, strlen(msg));

    char buf[16];
    ssize_t n = read(fd[0], buf, sizeof(buf));
    if (n > 0)
        write(1, buf, n);

    close(fd[0]);
    close(fd[1]);
    return 0;
}`,
    starter: `#include <unistd.h>
#include <string.h>
#include <stdio.h>

int main(void) {
    int fd[2];
    // TODO: pipe(fd); write "ping\\n" to fd[1]; read from fd[0]; print; close both
    return 0;
}`,
    tags: ['pipe', 'read', 'write'],
  },
  {
    id: 'lx-ch04-c-030',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read a /sys Attribute',
    prompt: `Open "/sys/devices/system/cpu/present" read-only and print its contents (the range of present CPUs, like "0-3\\n") to standard output. Read in a loop until EOF and write each chunk to fd 1. sysfs attributes are read just like normal files.`,
    hints: [
      'sysfs files behave like normal files for reading: open, read in a loop, write to fd 1.',
      'These attribute files are tiny, but loop on read() anyway to be safe.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("/sys/devices/system/cpu/present", O_RDONLY);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    char buf[256];
    ssize_t n;
    while ((n = read(fd, buf, sizeof(buf))) > 0)
        write(1, buf, n);
    if (n == -1) perror("read");
    close(fd);
    return n == -1 ? 1 : 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("/sys/devices/system/cpu/present", O_RDONLY);
    char buf[256];
    // TODO: read in a loop until EOF, writing each chunk to fd 1
    return 0;
}`,
    tags: ['sysfs', 'read', 'open'],
  },
  {
    id: 'lx-ch04-c-031',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read Your Own Command Line from /proc/self/cmdline',
    prompt: `Open "/proc/self/cmdline" and read it. The arguments are separated by NUL ('\\0') bytes rather than spaces. Read the buffer, then print the bytes to standard output but replace every NUL byte with a space so it is human-readable. Add a trailing newline.`,
    hints: [
      '/proc/self refers to the calling process; cmdline packs argv joined by NUL bytes.',
      'Scan the bytes you read and turn each 0x00 into 0x20 before writing.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("/proc/self/cmdline", O_RDONLY);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    char buf[4096];
    ssize_t n = read(fd, buf, sizeof(buf));
    if (n == -1) { perror("read"); close(fd); return 1; }
    for (ssize_t i = 0; i < n; i++)
        if (buf[i] == '\\0')
            buf[i] = ' ';
    write(1, buf, n);
    write(1, "\\n", 1);
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("/proc/self/cmdline", O_RDONLY);
    char buf[4096];
    // TODO: read, replace each '\\0' with ' ', write out plus a newline
    return 0;
}`,
    tags: ['proc', 'read', 'cmdline'],
  },
  {
    id: 'lx-ch04-c-032',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Truncate a File to a Given Length',
    prompt: `Use truncate(2) to set the size of argv[1] to exactly 100 bytes. If the file was larger it is shortened; if smaller it is extended with zero bytes (a hole). Print "ok\\n" on success or perror("truncate") on failure.`,
    hints: [
      'truncate(path, length) adjusts the file to that exact length.',
      'Extending a file this way creates a sparse region read back as zero bytes.',
    ],
    solution: `#include <unistd.h>
#include <sys/types.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s PATH\\n", argv[0]);
        return 1;
    }
    if (truncate(argv[1], 100) == -1) {
        perror("truncate");
        return 1;
    }
    printf("ok\\n");
    return 0;
}`,
    starter: `#include <unistd.h>
#include <sys/types.h>
#include <stdio.h>

int main(int argc, char **argv) {
    // TODO: truncate(argv[1], 100); handle error; print "ok"
    return 0;
}`,
    tags: ['truncate', 'size', 'file'],
  },
  {
    id: 'lx-ch04-c-033',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Open Non-Blocking and Handle EAGAIN',
    prompt: `Open a FIFO/pipe path argv[1] read-only with O_RDONLY | O_NONBLOCK. Then attempt a read into a 64-byte buffer. On a non-blocking fd with no data ready, read() returns -1 with errno set to EAGAIN (or EWOULDBLOCK) instead of blocking. Print "would block\\n" in that case, "eof\\n" if read returns 0, or "got N\\n" if it returns N>0 bytes.`,
    hints: [
      'O_NONBLOCK makes I/O return immediately rather than waiting.',
      'Check errno == EAGAIN || errno == EWOULDBLOCK to detect "no data right now".',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: %s FIFO\\n", argv[0]);
        return 1;
    }
    int fd = open(argv[1], O_RDONLY | O_NONBLOCK);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    char buf[64];
    ssize_t n = read(fd, buf, sizeof(buf));
    if (n == -1) {
        if (errno == EAGAIN || errno == EWOULDBLOCK)
            printf("would block\\n");
        else
            perror("read");
    } else if (n == 0) {
        printf("eof\\n");
    } else {
        printf("got %zd\\n", n);
    }
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>

int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY | O_NONBLOCK);
    char buf[64];
    // TODO: read; on -1 with EAGAIN/EWOULDBLOCK print "would block"; handle 0 and N>0
    return 0;
}`,
    tags: ['nonblocking', 'read', 'errno'],
  },
  {
    id: 'lx-ch04-c-034',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Add O_NONBLOCK to an Open fd with fcntl',
    prompt: `You already have an open descriptor and want to switch it to non-blocking mode without reopening. Use fcntl(2): first F_GETFL to fetch the current flags, OR in O_NONBLOCK, then F_SETFL to store them back. Demonstrate by opening "/dev/null" read-write, applying the change, and printing "nonblock set\\n" on success.`,
    hints: [
      'Always F_GETFL first, then OR the new flag, then F_SETFL the combined value.',
      'F_SETFL returns -1 on error; check it before reporting success.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("/dev/null", O_RDWR);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    int flags = fcntl(fd, F_GETFL);
    if (flags == -1) {
        perror("fcntl getfl");
        close(fd);
        return 1;
    }
    if (fcntl(fd, F_SETFL, flags | O_NONBLOCK) == -1) {
        perror("fcntl setfl");
        close(fd);
        return 1;
    }
    printf("nonblock set\\n");
    close(fd);
    return 0;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fd = open("/dev/null", O_RDWR);
    // TODO: F_GETFL, OR in O_NONBLOCK, F_SETFL; print "nonblock set"
    return 0;
}`,
    tags: ['fcntl', 'nonblocking', 'flags'],
  },
  {
    id: 'lx-ch04-c-035',
    chapter: 4,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Set the Umask and Observe the Effective Mode',
    prompt: `Call umask(022) to set the process file-creation mask, then create "u.txt" with open() requesting mode 0666. The umask clears the write bits for group and other, so the file lands at 0644. stat the new file and print its permission bits as "perm=0NNN\\n" (mask st_mode with 0777).`,
    hints: [
      'The effective mode of a new file is (requested_mode & ~umask).',
      'With umask 022, requesting 0666 yields 0644.',
    ],
    solution: `#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    umask(022);
    int fd = open("u.txt", O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (fd == -1) {
        perror("open");
        return 1;
    }
    close(fd);

    struct stat st;
    if (stat("u.txt", &st) == -1) {
        perror("stat");
        return 1;
    }
    printf("perm=0%03o\\n", st.st_mode & 0777);
    return 0;
}`,
    starter: `#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    // TODO: umask(022); create "u.txt" with mode 0666; stat it; print (st_mode & 0777)
    return 0;
}`,
    tags: ['umask', 'permissions', 'open'],
  },
]

export default problems
