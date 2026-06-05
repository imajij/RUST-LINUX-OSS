import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-04',
  track: 'linux',
  chapter: 4,
  title: 'Files, I/O & Permissions',
  summary: `On Unix, almost everything is a file, regular files, directories, devices, pipes, sockets, and kernel state, all reachable through the same small set of system calls. This chapter takes you from the userspace API (open, read, write, close, lseek, stat) down through the file descriptor table and the kernel's Virtual File System layer, and into the on-disk concepts that back it all: inodes, links, and permission bits. Understanding this stack is foundational for kernel contribution, because the VFS is one of the largest and most actively developed subsystems, and because every higher-level abstraction, from /proc to network sockets, is built on the file model you learn here. We finish with pipes and the synthetic filesystems /proc and /sys, which let you read and configure the running kernel as if it were a tree of ordinary files.`,
  sections: [
    {
      heading: 'Everything is a file, and the file descriptor is the handle',
      body: `The defining idea of Unix I/O is that a single, uniform interface, the **file descriptor**, mediates access to wildly different kinds of objects. A regular file on disk, a terminal, a pipe between two processes, a network socket, a block device, and a tunable kernel parameter under /proc are all manipulated through the same read and write calls operating on a small non-negative integer. This uniformity is the *why* behind much of Unix's composability: tools that read and write file descriptors do not care what is on the other end, which is exactly what makes shell pipelines and redirection work.

A file descriptor (often abbreviated fd) is just an index into a **per-process table** that the kernel maintains. When you call open, the kernel allocates the lowest-numbered unused slot in that table, points it at the underlying kernel object, and returns that index to you. Three descriptors are conventionally open already when a process starts: 0 is standard input, 1 is standard output, and 2 is standard error. By convention these are inherited from the parent, which is how a shell wires a program's output into a pipe or a file.

It is important to be precise about the layers, because they explain behavior that otherwise looks mysterious:

- The **file descriptor table** is per process. Each entry holds flags (currently just the close-on-exec flag) and a pointer into the next layer.
- The **open file description** (also called the open file table entry) is a kernel-wide object created by each successful open. It holds the current file offset, the access mode and status flags (O_APPEND, O_NONBLOCK, and so on), and a pointer to the inode. Crucially, several descriptors can point at one open file description, in which case they *share* the offset.
- The **inode** is the in-kernel representation of the file itself, one per file regardless of how many times it is open.

This three-layer design is exactly why dup and fork behave the way they do: dup and fork copy a descriptor so the new descriptor shares the same open file description (and therefore the same offset), whereas opening the same path twice creates two independent open file descriptions with independent offsets.

### Common pitfalls

- Confusing a file descriptor with a FILE star from C stdio. A FILE is a userspace buffering wrapper that *contains* a descriptor (retrievable with fileno). Mixing buffered stdio writes with raw write on the same descriptor produces interleaved, out-of-order output.
- Assuming fd numbers are stable identifiers. They are reused immediately after close, so a stale fd can silently refer to a completely different file.`,
      code: [
        {
          lang: 'c',
          src: `#include <fcntl.h>
#include <unistd.h>

int main(void) {
    // open returns the lowest free descriptor number.
    int fd = open("notes.txt", O_RDONLY);   // e.g. returns 3
    if (fd < 0) return 1;                    // -1 on error, errno set

    // fd 0, 1, 2 are stdin, stdout, stderr by convention.
    write(1, "hello\\n", 6);                  // write to stdout directly

    close(fd);                               // slot 3 is now free for reuse
    return 0;
}`
        }
      ]
    },
    {
      heading: 'open, read, write, close: the core system calls',
      body: `These four calls are the bedrock of Unix I/O. Each is a thin entry into the kernel; understanding their exact contracts, especially their error and short-count behavior, separates code that works on your laptop from code that survives in production and in the kernel tree.

**open** takes a path, a flags integer, and (when creating) a mode. The flags split into one access mode, O_RDONLY, O_WRONLY, or O_RDWR, ORed with optional behavior flags: O_CREAT to create the file if absent, O_EXCL (with O_CREAT) to fail if it already exists, O_TRUNC to truncate to zero length, O_APPEND for atomic append, O_NONBLOCK for non-blocking I/O, O_CLOEXEC to close the descriptor automatically across an exec. The third argument, mode, supplies the permission bits for a newly created file and is otherwise ignored; the final on-disk permissions are mode masked by the process umask.

**read** asks the kernel to copy up to count bytes into your buffer and returns the number actually read. The single most common bug in I/O code is forgetting that this can be a **short read**: read may legitimately return fewer bytes than requested, even from a regular file, and you must loop. A return of 0 means end of file; -1 means error, with errno distinguishing the cause. EINTR (interrupted by a signal) and EAGAIN (would block, on a non-blocking descriptor) are recoverable and must be handled, not treated as fatal.

**write** symmetrically returns the number of bytes written, which can also be short, so robust code wraps it in a loop until the whole buffer is flushed. A successful write does not mean the data is on disk; it means the data is in the kernel's page cache. To force it to stable storage you must call fsync (or open with O_SYNC).

**close** releases the descriptor. Always check its return value when you have written data: a deferred write error (for example, on a network filesystem) can surface only at close, and ignoring it can mean silent data loss.

### Common pitfalls

- Treating a short read or short write as an error. It is normal. Always loop.
- Ignoring EINTR. A signal can interrupt a blocking call; the correct response is usually to retry.
- Assuming write durably persists data. It does not until fsync succeeds and, for newly created files, the containing directory is also fsynced.`,
      code: [
        {
          lang: 'c',
          src: `#include <unistd.h>
#include <errno.h>
#include <string.h>

// Robust full write: loops over short writes, retries on EINTR.
ssize_t write_all(int fd, const void *buf, size_t len) {
    const char *p = buf;
    size_t left = len;
    while (left > 0) {
        ssize_t n = write(fd, p, left);
        if (n < 0) {
            if (errno == EINTR) continue;    // interrupted, retry
            return -1;                       // real error
        }
        p += n;
        left -= (size_t)n;                   // n may be < left: short write
    }
    return (ssize_t)len;
}

// Robust read of an entire stream until EOF.
ssize_t read_all(int fd, char *buf, size_t cap) {
    size_t got = 0;
    while (got < cap) {
        ssize_t n = read(fd, buf + got, cap - got);
        if (n < 0) { if (errno == EINTR) continue; return -1; }
        if (n == 0) break;                   // EOF
        got += (size_t)n;
    }
    return (ssize_t)got;
}`
        }
      ]
    },
    {
      heading: 'lseek and the file offset',
      body: `Every open file description carries a single **file offset**: the byte position at which the next read or write will occur. read and write advance it implicitly by the number of bytes transferred. **lseek** lets you move it explicitly, which is what makes random access possible.

lseek takes a descriptor, an offset, and a whence argument that selects the reference point: SEEK_SET means absolute from the start, SEEK_CUR means relative to the current position, and SEEK_END means relative to end of file. It returns the resulting absolute offset, so the idiom lseek(fd, 0, SEEK_CUR) reads the current position without moving it, and lseek(fd, 0, SEEK_END) returns the file size while positioning at the end.

A subtle and genuinely useful behavior is the **sparse file**. You may seek *past* the end of a file and then write; the gap becomes a hole that reads back as zero bytes but consumes no disk blocks until written. This is how disk-image and database files can report a huge logical size while occupying little actual space.

Offsets are a property of the open file description, not the descriptor, so two descriptors created by dup or fork share one offset, while two independent opens of the same path each have their own. This sharing is why, in a shell pipeline, appending from two redirections behaves differently from two separate opens.

Not every descriptor is seekable. Pipes, sockets, and terminals are sequential streams; lseek on them fails with ESPIPE. Code that may run against a pipe must not assume it can rewind.

To avoid the race between seeking and then reading or writing (two separate calls another thread can interleave), Linux offers **pread** and **pwrite**, which take an explicit offset and do not disturb the shared file offset at all. These are the right tool for multithreaded access to one descriptor.`,
      code: [
        {
          lang: 'c',
          src: `#include <unistd.h>
#include <fcntl.h>

// Get the size of an already-open file without stat.
off_t file_size(int fd) {
    return lseek(fd, 0, SEEK_END);   // returns new offset == size
}

// Create a sparse file: seek past the end, then write one byte.
void make_sparse(int fd) {
    lseek(fd, 1024 * 1024, SEEK_SET); // jump 1 MiB ahead
    write(fd, "x", 1);                // file is now 1 MiB + 1, mostly a hole
}

// Thread-safe positioned read: does NOT touch the shared offset.
ssize_t read_at(int fd, void *buf, size_t n, off_t pos) {
    return pread(fd, buf, n, pos);
}`
        }
      ]
    },
    {
      heading: 'stat and file metadata',
      body: `Beyond the bytes of a file, the kernel stores **metadata**, attributes describing the file. The **stat** family of calls retrieves it into a struct stat. There are three variants you should distinguish carefully: stat follows symbolic links to report on the target, **lstat** reports on the link itself (so you can tell that a path is a symlink), and **fstat** operates on an already-open descriptor, which avoids a time-of-check-to-time-of-use race because the descriptor pins exactly the file you opened.

The fields you will use most often are:

- **st_mode**: a packed integer combining the file *type* and the permission bits. Use the macros S_ISREG, S_ISDIR, S_ISLNK, S_ISCHR, S_ISBLK, S_ISFIFO, S_ISSOCK to classify it, and mask with 07777 to extract the permission and special bits.
- **st_size**: logical size in bytes (for a regular file).
- **st_ino** and **st_dev**: the inode number and the device id. The pair (st_dev, st_ino) uniquely identifies a file on the system; comparing it is how you detect that two paths are actually the same file (hard links).
- **st_nlink**: the number of hard links pointing at this inode.
- **st_uid** and **st_gid**: owning user and group.
- **st_blocks**: the number of 512-byte blocks actually allocated, which can be far less than st_size for a sparse file. Comparing st_blocks against st_size is how you detect holes.
- The three timestamps: **st_atime** (last access), **st_mtime** (last content modification), **st_ctime** (last inode change, that is, metadata change, not creation).

A frequent misconception is that st_ctime is a creation time. It is not; it is the inode change time, updated whenever metadata such as permissions or link count changes. Linux did not expose a true birth time through classic stat at all; the modern **statx** call adds it (stx_btime) along with a flexible field mask and is the call kernel and library code increasingly prefers.

### Common pitfalls

- Using stat where lstat is meant, and silently following a symlink you intended to inspect. Security-sensitive code almost always wants lstat or fstat.
- Computing disk usage from st_size. Use st_blocks; otherwise sparse files report wildly wrong figures.`,
      code: [
        {
          lang: 'c',
          src: `#include <sys/stat.h>
#include <stdio.h>

void describe(const char *path) {
    struct stat st;
    if (lstat(path, &st) < 0) { perror("lstat"); return; }

    const char *type = "other";
    if (S_ISREG(st.st_mode))  type = "regular file";
    else if (S_ISDIR(st.st_mode))  type = "directory";
    else if (S_ISLNK(st.st_mode))  type = "symlink";
    else if (S_ISFIFO(st.st_mode)) type = "fifo (named pipe)";

    printf("%s: %s\\n", path, type);
    printf("  inode=%lu dev=%lu links=%lu\\n",
           (unsigned long)st.st_ino, (unsigned long)st.st_dev,
           (unsigned long)st.st_nlink);
    printf("  size=%lld bytes, allocated=%lld blocks of 512B\\n",
           (long long)st.st_size, (long long)st.st_blocks);
    printf("  perms=%o\\n", st.st_mode & 07777);
}`
        }
      ]
    },
    {
      heading: 'The VFS from userspace: one interface, many filesystems',
      body: `When you call open or read, you do not talk to ext4 or Btrfs directly. You talk to the **Virtual File System** (VFS), a kernel abstraction layer that presents one uniform interface to userspace and dispatches each operation to whichever concrete filesystem backs the file. This indirection is *why* the same cp command copies between an ext4 disk, an NFS mount, a FAT USB stick, and a tmpfs in RAM without knowing anything about them.

The VFS is built on a handful of core object types, and recognizing them is the first step to reading filesystem code in the kernel:

- **superblock**: represents a mounted filesystem instance, its block size, root, and the operations table for managing inodes.
- **inode**: the in-memory representation of a file's metadata and, critically, a table of function pointers (inode_operations) for operations like create, lookup, link, and unlink.
- **dentry** (directory entry): caches the association between a name and an inode. The **dentry cache** (dcache) is what makes repeated path lookups fast; without it, every open would re-walk the directory tree from disk.
- **file**: represents an open file description and holds file_operations, the function pointers for read, write, llseek, mmap, and the rest.

The mechanism that ties this together is the **operations tables** of function pointers. Each filesystem fills in a file_operations and inode_operations structure with its own implementations; the VFS calls through these pointers. This is plain C polymorphism, and it is exactly the pattern you implement when you write a device driver or a synthetic filesystem: you provide a file_operations table, and the VFS routes userspace calls to your functions.

Path resolution (name lookup) walks the path component by component, consulting the dcache and, on a miss, the filesystem's lookup operation, crossing mount points where one filesystem is grafted onto a directory of another. Understanding that a path is resolved step by step, and that each step can cross a filesystem boundary or hit a symlink, demystifies a great deal of permission and mount behavior.

The practical upshot for a contributor: most of what looks like file I/O in the kernel is the VFS calling into a per-filesystem ops table. When you read fs/ in the kernel source, fs/ holds the VFS core (namei.c, open.c, read_write.c) and one subdirectory per filesystem; the contract between them is those ops structs.`,
      code: [
        {
          lang: 'c',
          src: `// A filesystem or driver registers its behavior by filling an ops table.
// The VFS calls through these pointers; this is how one interface
// dispatches to many implementations. (Simplified kernel-style sketch.)

static ssize_t my_read(struct file *f, char __user *buf,
                       size_t len, loff_t *ppos);
static ssize_t my_write(struct file *f, const char __user *buf,
                        size_t len, loff_t *ppos);

static const struct file_operations my_fops = {
    .owner   = THIS_MODULE,
    .read    = my_read,    // VFS read()  on our file lands here
    .write   = my_write,   // VFS write() lands here
    .llseek  = default_llseek,
};
// When userspace calls read(fd, ...), the VFS looks up file->f_op->read
// and calls my_read. The application never knows which fs answered.`
        }
      ]
    },
    {
      heading: 'Inodes, hard links, and symbolic links',
      body: `The on-disk concept beneath every file is the **inode**: a fixed-size record holding all of a file's metadata (type, permissions, owner, timestamps, size, link count) and pointers to the data blocks. The one thing an inode does *not* contain is the file's name. This single fact explains the entire link system.

A **directory** is itself a special file whose contents are a list of (name, inode number) pairs. A name in a directory that points at an inode is a **hard link**. Because the name lives in the directory and the inode lives elsewhere, a file can have many names: each is an equal, first-class reference to the same inode. The inode's st_nlink counts them. This is why deleting a file is performed by the **unlink** system call, not a delete call: unlink removes one name and decrements the link count, and the kernel reclaims the inode and its data blocks only when the count reaches zero *and* no process still holds it open. That last clause is the basis of a classic trick: a program can open a file, unlink it immediately, and keep using it; the data persists until the descriptor is closed, then vanishes with no name and no leak. It is also why you cannot, in general, recover a file's contents by inode number once unlinked.

Two properties follow directly from inodes living below names:

- Hard links cannot cross filesystems, because an inode number is only meaningful within one filesystem (one st_dev). You cannot hard-link from an ext4 disk to a separate mount.
- Hard links to directories are forbidden (except the . and .. entries the filesystem manages), because arbitrary directory hard links would create cycles that break tree-walking tools and reference counting.

A **symbolic link** (symlink, soft link) is a different beast: it is a tiny file whose *contents* are a path string. Resolving it means substituting that path and continuing the walk. Symlinks can cross filesystems and point at directories, but they can dangle (point at something that no longer exists), and they are followed by stat but not by lstat. Most of the security relevance of the stat versus lstat distinction comes down to whether you want to follow a symlink an attacker may have planted.`,
      code: [
        {
          lang: 'c',
          src: `#include <unistd.h>
#include <stdio.h>

int main(void) {
    // Create two names for the SAME inode (hard link).
    link("data.bin", "data_backup.bin"); // st_nlink is now 2

    // The "open then unlink" idiom: an anonymous temp file.
    int fd = open("scratch.tmp", O_RDWR | O_CREAT | O_EXCL, 0600);
    unlink("scratch.tmp");   // name gone NOW, but...
    // ...fd still works. Data lives until close(fd), then is reclaimed.
    write(fd, "secret", 6);
    close(fd);               // only now are the blocks freed

    // A symlink stores a PATH, not an inode reference.
    symlink("/etc/hosts", "hosts_link"); // contents = "/etc/hosts"
    return 0;
}`
        }
      ]
    },
    {
      heading: 'Permission bits: rwx, special bits, and umask',
      body: `Unix permissions are a compact, classic model encoded in the low bits of st_mode. There are three permission classes, **owner** (user), **group**, and **other** (everyone else), and three permission bits per class: **read (r, 4), write (w, 2), execute (x, 1)**. That is the origin of the familiar octal notation: 0644 means owner read+write (6), group read (4), other read (4); 0755 adds execute for everyone, the typical mode for a program or a directory.

What the bits mean depends on the object:

- On a **regular file**: r lets you read contents, w lets you modify contents, x lets you execute it as a program.
- On a **directory**: r lets you *list* the names in it, w lets you *create, rename, or delete* entries in it, and x (the search bit) lets you *traverse* it to reach things inside. The non-obvious consequence: you need x on every directory along a path to reach a file, and w on a directory, not on the file, is what actually permits deleting a file. Removing a file you cannot write is allowed if you can write its directory, which surprises many people.

Above the nine basic bits sit three **special bits** (the high octal digit):

- **setuid (4000)** on an executable makes it run with the file owner's identity, not the caller's, the mechanism behind passwd changing /etc/shadow. It is powerful and dangerous and is ignored on scripts on Linux.
- **setgid (2000)** does the same for the group on an executable; on a directory it makes new files inherit the directory's group, which is how shared project directories work.
- **sticky bit (1000)** on a directory restricts deletion so that only a file's owner (or the directory owner) can remove it. This is why /tmp, world-writable by design, is not a free-for-all: its sticky bit stops one user deleting another's files.

Finally, the **umask** is a per-process mask of bits to *clear* from the mode requested at creation. A typical umask of 022 turns a requested 0666 into 0644 and a requested 0777 into 0755, which is why new files are not group- and world-writable by default. The rule is: final mode equals requested mode AND NOT umask. Permission changes are made with **chmod** (mode) and ownership with **chown** (uid/gid); note that changing ownership generally requires privilege, while changing mode requires being the owner.

### Common pitfalls

- Expecting to delete a file by having write permission on the file. Deletion needs write+execute on the containing directory.
- Forgetting umask when a freshly created file has narrower permissions than the mode you passed to open. The mode is a request, not a guarantee.`,
      code: [
        {
          lang: 'c',
          src: `#include <sys/stat.h>
#include <fcntl.h>

int main(void) {
    // The mode argument is masked by the process umask.
    // With umask 022, this 0666 request yields 0644 on disk.
    int fd = open("out.txt", O_WRONLY | O_CREAT, 0666);
    close(fd);

    // Make a file owner-read/write, group-read, no other access: 0640.
    chmod("out.txt", S_IRUSR | S_IWUSR | S_IRGRP);

    // A shared dir: group-inherit (setgid) + sticky, rwx for owner/group.
    mkdir("shared", 0770);
    chmod("shared", 0770 | S_ISGID | S_ISVTX); // -> drwxrws--T
    return 0;
}`
        }
      ]
    },
    {
      heading: 'Pipes: file descriptors for inter-process communication',
      body: `A **pipe** is a unidirectional, in-kernel byte stream with two ends, both exposed as file descriptors. The **pipe** system call hands back an array of two descriptors: index 0 is the read end, index 1 is the write end. Data written to the write end is buffered in a fixed-size kernel ring (64 KiB by default on Linux) and read out in order from the read end. There is no name on disk, no inode you can stat by path; the pipe exists only as long as a descriptor to it does.

Pipes shine because of how they combine with **fork**. A child inherits the parent's descriptors, so the standard pattern is: create a pipe, fork, then each side closes the end it does not use, and the two processes have a private channel. This is precisely how a shell implements the bar operator: it pipes one command's standard output to the next command's standard input by duplicating the pipe ends onto descriptors 1 and 0 with **dup2** before exec.

Two behaviors define pipe semantics and are the source of most pipe bugs:

- Reading from a pipe whose **write ends are all closed** returns 0 (end of file). If any write end is still open, read blocks waiting for more data. This is why you must close the write end you are not using: leaving an extra copy open means the reader never sees EOF and hangs forever.
- Writing to a pipe whose **read ends are all closed** delivers a SIGPIPE signal (which by default kills the process) and, if you ignore the signal, fails with EPIPE. This is the kernel telling a producer there is no longer any consumer, exactly what happens when you pipe into head and head exits early.

A **named pipe** or FIFO is the same mechanism given a persistent name in the filesystem via mkfifo, so unrelated processes can rendezvous by opening a known path. Writes up to PIPE_BUF bytes (at least 512, 4096 on Linux) are guaranteed atomic, meaning interleaved writers will not have their messages shredded together, an important property when several processes log to one pipe.

### Common pitfalls

- Forgetting to close unused pipe ends. The reader will never get EOF, or the writer will never get SIGPIPE, producing deadlocks.
- Ignoring SIGPIPE in a server. A client disconnecting mid-write will otherwise silently kill your process.`,
      code: [
        {
          lang: 'c',
          src: `#include <unistd.h>
#include <stdio.h>

int main(void) {
    int fds[2];
    pipe(fds);                       // fds[0] = read end, fds[1] = write end

    if (fork() == 0) {
        // Child: writer. Close the read end we will not use.
        close(fds[0]);
        write(fds[1], "ping", 4);
        close(fds[1]);               // closing write end lets parent see EOF
        _exit(0);
    }

    // Parent: reader. Close the write end so EOF is reachable.
    close(fds[1]);
    char buf[16];
    ssize_t n;
    while ((n = read(fds[0], buf, sizeof buf)) > 0)
        fwrite(buf, 1, (size_t)n, stdout);  // prints "ping", then read()==0
    close(fds[0]);
    return 0;
}`
        }
      ]
    },
    {
      heading: '/proc and /sys: the kernel exposed as files',
      body: `Two synthetic filesystems turn the file model into a control panel for the kernel itself. They have no backing disk; their contents are generated on the fly by kernel code when you read them, which is exactly the VFS ops-table mechanism from earlier put to work.

**procfs**, mounted at /proc, originated as a window into processes and the kernel. Under /proc/[pid] you find a directory per running process: /proc/[pid]/status and stat for state, /proc/[pid]/fd a directory of symlinks to that process's open files (a superb debugging tool, ls -l it to see exactly what a process has open), /proc/[pid]/maps for its memory layout, /proc/[pid]/cmdline for its arguments. System-wide files include /proc/cpuinfo, /proc/meminfo, /proc/mounts, and the tunables under /proc/sys, which you can both read and, with privilege, write to change kernel behavior at runtime (the sysctl interface).

**sysfs**, mounted at /sys, is the newer and more structured sibling. It exposes the kernel's device model, the tree of devices, drivers, and buses, as a directory hierarchy. The guiding design rule is **one value per file**: a sysfs attribute file holds a single small value you can cat to read or echo to set, rather than procfs's sometimes free-form text blobs. This is where you adjust a CPU governor, read a battery's charge, or toggle a driver parameter.

The deep reason these work, and the reason they matter to a kernel contributor, is that reading a file like /proc/meminfo does not read bytes off a disk; it calls a kernel function that *formats the answer on demand*. When you write a kernel module, exposing state through procfs or, preferably, sysfs is how you give userspace a debugging and control surface using nothing but the familiar open/read/write interface. The same uniform file API that began this chapter is, at the end of it, how you talk to the kernel.

### Common pitfalls

- Treating /proc files as ordinary files to be slurped efficiently. They are generated per read and are often not seekable in the usual way; read them whole, simply, and do not assume the size from stat (many report size 0).
- Parsing /proc text formats as a stable ABI. Some fields shift between kernel versions; prefer sysfs's one-value-per-file attributes when a stable interface exists.`,
      code: [
        {
          lang: 'c',
          src: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    // /proc files are generated on read; just read and print.
    int fd = open("/proc/self/status", O_RDONLY);
    char buf[256];
    ssize_t n;
    while ((n = read(fd, buf, sizeof buf)) > 0)
        write(1, buf, (size_t)n);
    close(fd);

    // sysfs: one value per file. Read a single attribute.
    fd = open("/sys/class/net/lo/mtu", O_RDONLY);
    n = read(fd, buf, sizeof buf - 1);
    if (n > 0) { buf[n] = 0; printf("loopback MTU = %s", buf); }
    close(fd);
    return 0;
}`
        }
      ]
    }
  ],
  takeaways: [
    'A file descriptor is a per-process index into a table; it points at a kernel-wide open file description (which owns the offset and flags), which points at one inode.',
    'read and write can transfer fewer bytes than requested. Always loop, and handle EINTR and EAGAIN rather than treating them as fatal.',
    'A successful write only reaches the page cache; data is durable only after fsync (and an fsync of the parent directory for newly created files).',
    'lseek moves the shared file offset and can create sparse files; use pread/pwrite for thread-safe positioned I/O that does not touch the offset.',
    'Use fstat or lstat (not stat) when you must not follow a symlink; st_ctime is the inode-change time, not creation time. Use st_blocks, not st_size, for disk usage.',
    'The VFS dispatches uniform open/read/write calls to per-filesystem operations tables (file_operations, inode_operations) of function pointers, the same pattern you fill in to write a driver or synthetic fs.',
    'An inode holds metadata, not the name. Hard links are extra names for one inode; unlink removes a name and frees the inode only when link count and open count both hit zero.',
    'Directory permissions govern more than they appear: w on the directory (not the file) permits deletion, and x on every directory in a path is required to traverse it. umask masks the requested creation mode.',
    'Close unused pipe ends or the reader never sees EOF and the writer never sees SIGPIPE; /proc and /sys generate their contents on read, exposing kernel state through the ordinary file API.'
  ],
  cheatsheet: [
    { label: 'open(path, flags, mode)', value: 'Open/create a file; returns lowest free fd or -1' },
    { label: 'read(fd, buf, n) / write(fd, buf, n)', value: 'Transfer up to n bytes; return count (may be short), 0=EOF, -1=err' },
    { label: 'close(fd)', value: 'Release fd; check return when data was written' },
    { label: 'lseek(fd, off, whence)', value: 'Move offset; SEEK_SET/CUR/END; ESPIPE on pipes/sockets' },
    { label: 'pread / pwrite(fd, buf, n, pos)', value: 'Positioned I/O; ignores and preserves the shared offset' },
    { label: 'fstat / stat / lstat', value: 'Metadata of fd / path-followed / link-itself into struct stat' },
    { label: 'st_ino + st_dev', value: 'Pair uniquely identifies a file; equal pair means same inode' },
    { label: 'st_ctime vs statx btime', value: 'ctime = inode change time; statx stx_btime = true birth time' },
    { label: 'link / symlink / unlink', value: 'Add hard name / make path-storing soft link / remove a name' },
    { label: 'Mode 0644 / 0755', value: 'rw-r--r-- file / rwxr-xr-x program or directory' },
    { label: 'setuid 4000 / setgid 2000 / sticky 1000', value: 'Run-as-owner / group-inherit / owner-only delete (/tmp)' },
    { label: 'umask 022', value: 'Clears these bits: 0666 to 0644, 0777 to 0755 at creation' },
    { label: 'pipe(fds) + dup2 + fork', value: 'fds[0] read, fds[1] write; how shells wire command pipelines' },
    { label: '/proc/[pid]/fd, /proc/meminfo, /sys', value: 'Per-process open files, kernel stats, one-value-per-file device model' }
  ]
}

export default note
