import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-08',
  track: 'linux',
  chapter: 8,
  title: 'Character Device Drivers',
  summary: `A character device driver is the simplest, most fundamental kind of Linux device driver: it exposes a piece of hardware (or a pure software abstraction) to user space as a file under /dev that you read and write a byte stream at a time. This chapter builds the whole pipeline end to end - how the kernel identifies a device with a major and minor number, how a cdev object binds those numbers to your driver, how the file_operations table routes read, write, and ioctl calls into your code, and how you safely move bytes across the user/kernel boundary with copy_to_user and copy_from_user. Mastering this is the price of admission for kernel contribution: an enormous fraction of real drivers - serial ports, GPIO, sensors, framebuffers, /dev/null itself - are character drivers, and the same patterns reappear in the Rust-for-Linux miscdev and chrdev abstractions you may eventually help build.`,
  sections: [
    {
      heading: 'What a character device is, and why it looks like a file',
      body: `Linux follows the Unix philosophy that *everything is a file*. A user-space program should not need to know the bus protocol of your hardware; it should just open something under /dev, read bytes out of it, and write bytes into it. A **character device** is the abstraction for hardware (or a software service) that is naturally a stream of bytes accessed sequentially - a serial line, a keyboard, a sensor, /dev/random. Contrast this with a **block device** (disks), which is addressed in fixed-size blocks, cached by the kernel page cache, and sits behind a filesystem.

The defining trait of a character device is that I/O is generally unbuffered by the block layer and happens one transfer at a time in the units the driver chooses. When a process calls read() on /dev/yourdev, the kernel's virtual filesystem layer (the VFS) translates that system call into a call to a function *you* supplied. Your driver is the code that runs in kernel context to service that read.

So the entire job of a character driver is to fill in a small set of callback functions and register them under a device number, so that the standard file system calls - open, read, write, close, ioctl - reach your code. Everything else in this chapter is the mechanism that wires those callbacks to a node in /dev.

### Three layers you must keep straight

1. The **device node** in /dev: a special file carrying a type (character or block) and a major/minor number. This is what user space opens.
2. The **device number**: the (major, minor) pair the kernel uses to find which driver owns the node.
3. The **cdev**: the in-kernel object that ties a range of device numbers to your file_operations table.

A read() in user space travels node to number to cdev to your fops.read. Hold that chain in your head and the rest follows.`,
      code: [
        {
          lang: 'c',
          src: `// User space sees only a file. It does not know or care
// that "scull" is a char driver implemented in a kernel module.

int fd = open("/dev/scull0", O_RDWR);   // -> driver's .open
char buf[64];
ssize_t n = read(fd, buf, sizeof buf);  // -> driver's .read
write(fd, "hello", 5);                  // -> driver's .write
ioctl(fd, SCULL_RESET);                 // -> driver's .unlocked_ioctl
close(fd);                              // -> driver's .release

// The kernel's VFS dispatches each of these to the function
// pointers your driver registered. That dispatch is the whole game.`
        }
      ]
    },
    {
      heading: 'Device numbers: major and minor',
      body: `Every device node is identified by a **device number**, which is split into two parts: a **major number** that historically identifies the *driver*, and a **minor number** that the driver uses internally to distinguish *which* of possibly several devices it manages. If you write a driver that controls four identical sensor channels, they typically share one major number and use minors 0 through 3.

In the kernel a device number is a single value of type dev_t. You never assemble or take it apart by hand; you use macros. MKDEV(major, minor) builds a dev_t from its parts, while MAJOR(dev) and MINOR(dev) extract them back. The split is not an even 16/16: on modern kernels dev_t is 32 bits with a 12-bit major and a 20-bit minor, but because the layout has changed historically you must always go through the macros and never assume a bit position.

### Static vs dynamic allocation

There are two ways to obtain a device number, and choosing correctly is a real-world etiquette issue, not just a style choice.

- **Static allocation** with register_chrdev_region() asks for a specific major you pick yourself. This is fragile: the major you hard-code might already be taken on the user's machine, causing your driver to fail to load on some systems and not others. The kernel documentation explicitly discourages this for new drivers.
- **Dynamic allocation** with alloc_chrdev_region() lets the kernel hand you a free major. This is the recommended default. The catch is that you do not know the major until runtime, so you must read it back (with MAJOR on the returned dev_t) and create the /dev node using that value - which is exactly why udev and class-based automatic node creation exist.

Whichever you use, you must release the range with unregister_chrdev_region() in your module's exit path, or you leak the reservation until reboot.

> Pitfall: registering a number range only *reserves* it - it does not yet connect any code. Reservation and the cdev that supplies the file_operations are two separate steps. Forgetting the second step gives you a node that exists but does nothing.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/fs.h>      // alloc_chrdev_region, register_chrdev_region
#include <linux/kdev_t.h>  // MAJOR, MINOR, MKDEV

static dev_t dev_num;          // packed (major, minor)
#define SCULL_NR_DEVS 4        // we manage 4 minors

// RECOMMENDED: let the kernel choose a free major.
//   args: out param, first minor wanted, count, name shown in /proc/devices
int err = alloc_chrdev_region(&dev_num, 0, SCULL_NR_DEVS, "scull");
if (err < 0) {
    pr_err("scull: cannot allocate device numbers: %d\\n", err);
    return err;
}
pr_info("scull: major=%d first_minor=%d\\n",
        MAJOR(dev_num), MINOR(dev_num));

// Build the number for minor index i later:
//   dev_t this_dev = MKDEV(MAJOR(dev_num), MINOR(dev_num) + i);

// In module_exit, ALWAYS give the range back:
//   unregister_chrdev_region(dev_num, SCULL_NR_DEVS);`
        }
      ]
    },
    {
      heading: 'struct file_operations: the dispatch table',
      body: `The heart of a character driver is a single statically allocated structure: **struct file_operations** (usually called the *fops*). It is a table of function pointers, one per operation the VFS might perform on an open file. When user space calls read(), the kernel looks up the open file's fops and calls fops->read. Any pointer you leave NULL means that operation is unsupported, and the kernel returns a sensible default error (often -EINVAL or, for some ops, a benign success).

Three details make this table robust and you should always honor them:

1. **Use designated initializers.** Always write the table as owner = THIS_MODULE, read = my_read, and so on, naming each field. The struct has many members and their order has changed across kernel versions; positional initialization would silently break. Designated initializers also leave every unspecified field zeroed (NULL), which is exactly what you want for unsupported ops.

2. **Set .owner = THIS_MODULE.** This is reference counting for your module. While a process holds your device open, the owner field lets the kernel pin your module in memory so it cannot be unloaded out from under an active file. Omit it and you invite a use-after-free when someone rmmods your module mid-read.

3. **Match the exact prototypes.** Each callback has a precise signature the VFS expects. read returns ssize_t and takes (struct file *, char __user *, size_t, loff_t *). The loff_t * is the file position; you advance it to report progress. The __user annotation marks pointers that point into user space - never dereference them directly.

### The operations you will implement most

- **open** and **release** (release is the close-side callback; it runs when the *last* reference to the file is dropped, not on every close of a dup'd fd).
- **read** and **write**, which move data and update the position.
- **unlocked_ioctl** for out-of-band control commands.
- **llseek** if random access makes sense for your device.

Note the name: the legacy .ioctl was removed years ago because it ran under the Big Kernel Lock. New code implements **.unlocked_ioctl**, which does its own locking.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/fs.h>

static struct file_operations scull_fops = {
    .owner          = THIS_MODULE,        // pin module while open: do NOT omit
    .open           = scull_open,
    .release        = scull_release,
    .read           = scull_read,
    .write          = scull_write,
    .unlocked_ioctl = scull_ioctl,
    .llseek         = scull_llseek,       // or no_llseek for non-seekable devs
};

// Exact prototypes the VFS expects:
static int     scull_open(struct inode *inode, struct file *filp);
static int     scull_release(struct inode *inode, struct file *filp);
static ssize_t scull_read(struct file *filp, char __user *buf,
                          size_t count, loff_t *f_pos);
static ssize_t scull_write(struct file *filp, const char __user *buf,
                           size_t count, loff_t *f_pos);
static long    scull_ioctl(struct file *filp, unsigned int cmd,
                           unsigned long arg);`
        }
      ]
    },
    {
      heading: 'cdev: binding the numbers to your operations',
      body: `Reserving a device number range and defining a file_operations table are two halves that must be joined. The joining object is **struct cdev** - the kernel's representation of a character device. A cdev holds a pointer to your fops and an owner; adding it to the system tells the kernel that opens of these particular device numbers should dispatch through this fops.

There are two ways to set up a cdev, and the difference matters for correctness:

- **Embedded cdev** (recommended): put a struct cdev field inside your own per-device structure, initialize it in place with cdev_init(&mydev->cdev, &fops), set cdev.owner = THIS_MODULE, then call cdev_add(). Embedding means once you recover your device struct in a callback you already have everything together, and the cdev's lifetime is tied to your struct.

- **Dynamically allocated cdev** with cdev_alloc(): the kernel allocates and frees the cdev. Use this only when you genuinely cannot embed it.

cdev_add() is the moment your device goes *live*. The instant it returns successfully, the kernel may already be calling your open and read - possibly before cdev_add() has even returned on another CPU. Therefore everything the callbacks rely on (buffers, locks, the fops itself) must be fully initialized *before* you call cdev_add(), never after. This is the single most common ordering bug in beginner drivers.

On teardown you reverse the order precisely: cdev_del() first to stop new dispatches and wait out in-flight ones, then free your device memory, then unregister_chrdev_region(). Tear down in the exact reverse of setup.

> Pitfall: cdev_init() overwrites the whole cdev including its owner, so set cdev.owner = THIS_MODULE *after* cdev_init(), not before.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/cdev.h>

struct scull_dev {
    char           *data;        // your device's buffer / state
    struct mutex    lock;        // protects this device's data
    struct cdev     cdev;        // EMBEDDED: ties numbers -> fops
};

static struct scull_dev *devices;   // array of SCULL_NR_DEVS

static int scull_setup_cdev(struct scull_dev *dev, int index)
{
    int devno = MKDEV(MAJOR(dev_num), MINOR(dev_num) + index);
    int err;

    cdev_init(&dev->cdev, &scull_fops);
    dev->cdev.owner = THIS_MODULE;     // set AFTER cdev_init, not before

    // Everything the callbacks need must already be ready here:
    // cdev_add makes the device LIVE and racy with open() immediately.
    err = cdev_add(&dev->cdev, devno, 1);
    if (err)
        pr_warn("scull: error %d adding cdev %d\\n", err, index);
    return err;
}

// Teardown (reverse order!):
//   cdev_del(&dev->cdev);
//   kfree(dev->data);
//   unregister_chrdev_region(dev_num, SCULL_NR_DEVS);`
        }
      ]
    },
    {
      heading: 'Crossing the boundary: copy_to_user and copy_from_user',
      body: `Your read and write callbacks run in kernel mode but are handed a pointer into the *calling process's* user-space address space, marked with __user. You must never dereference that pointer directly. Three independent reasons make a raw memcpy a serious bug:

1. **Security.** The pointer comes from untrusted user space. A malicious or buggy program could pass a pointer into kernel memory; a naive copy would read or overwrite kernel data, a classic privilege-escalation hole. copy_to_user and copy_from_user validate that the address truly belongs to user space before touching it.

2. **Page faults.** The target user page may be swapped out or not yet faulted in. The copy helpers are written to handle a fault gracefully - they can sleep to bring the page in, or return a short count - whereas a direct access would oops the kernel.

3. **Address space differences.** On some architectures user and kernel live in separate address spaces and the helpers do the architecture-specific transfer correctly.

### The contract of the helpers

unsigned long copy_to_user(void __user *to, const void *from, unsigned long n) copies n bytes from kernel to user, and copy_from_user the other way. The return value is the number of bytes that could **not** be copied - so zero means full success. You must check it: if it is nonzero, the user supplied a bad buffer and you return -EFAULT.

These helpers may sleep (they can fault in pages), so you may only call them from process context with no spinlock held - which is exactly where read and write run, so that is fine, but it is a hard rule if you start adding locks.

### Position handling

read receives loff_t *f_pos. You copy out at that offset, advance *f_pos by the number of bytes transferred, and return that count. Returning 0 signals end of file. write mirrors this. Getting the position update wrong leads to programs that loop forever or read garbage.

For a single scalar value rather than a buffer, get_user(x, ptr) and put_user(x, ptr) are faster, type-checked one-value variants.`,
      code: [
        {
          lang: 'c',
          src: `static ssize_t scull_read(struct file *filp, char __user *buf,
                          size_t count, loff_t *f_pos)
{
    struct scull_dev *dev = filp->private_data;
    ssize_t retval = 0;

    if (mutex_lock_interruptible(&dev->lock))
        return -ERESTARTSYS;

    if (*f_pos >= dev->size)             // at or past end -> EOF
        goto out;                       // retval stays 0

    if (*f_pos + count > dev->size)      // clamp to available data
        count = dev->size - *f_pos;

    // returns # bytes NOT copied; nonzero => bad user pointer
    if (copy_to_user(buf, dev->data + *f_pos, count)) {
        retval = -EFAULT;
        goto out;
    }

    *f_pos += count;                     // advance position
    retval  = count;                     // report bytes delivered
out:
    mutex_unlock(&dev->lock);
    return retval;
}

// write is the mirror image, using copy_from_user:
//   if (copy_from_user(dev->data + *f_pos, buf, count))
//       return -EFAULT;`
        }
      ]
    },
    {
      heading: 'ioctl: out-of-band control commands',
      body: `read and write move a data stream, but devices also need *control* operations that do not fit a byte stream: set a baud rate, reset hardware, query a status register, change a mode. The classic mechanism for this is **ioctl** (I/O control), implemented today as the .unlocked_ioctl callback with the prototype long fn(struct file *filp, unsigned int cmd, unsigned long arg).

The cmd is a command number you define; arg is an untyped argument that is either a small integer passed by value or, more often, a user-space pointer you must copy through. Because arg is type-erased, ioctl is powerful but easy to misuse, which is why the kernel imposes a disciplined convention for encoding command numbers.

### Encoding command numbers correctly

You do not invent arbitrary integers. The kernel provides macros that pack four fields into each command number so that commands are globally distinguishable and the direction of data flow is self-describing:

- A **type** (magic) byte, unique to your driver, chosen from the registered list in the kernel's ioctl-number documentation to avoid clashing with other subsystems.
- A **number** that is sequential within your driver.
- A **direction** of data transfer and the **size** of the argument type, both filled in by the macro you pick.

Use _IO(type, nr) for a command with no data, _IOR(type, nr, datatype) to read data from kernel to user, _IOW(...) to write data the other way, and _IOWR(...) for both. Encoding the direction and size means the kernel can sanity-check the argument and, importantly, lets compatibility layers translate 32-bit calls on a 64-bit kernel.

### Inside the handler

A robust handler first checks the magic and command range, rejecting unknown commands with -ENOTTY (the historically correct error meaning "inappropriate ioctl for device"). For pointer arguments use copy_to_user / copy_from_user exactly as in read and write; for scalar transfers, get_user and put_user. Keep these definitions in a header shared between your driver and user programs so both agree on the numbers.

> Pitfall: returning -EINVAL for an unknown command is a common mistake; user space and the C library specifically expect -ENOTTY to mean "this fd does not support that ioctl."`,
      code: [
        {
          lang: 'c',
          src: `// scull_ioctl.h  -- shared by the driver AND user programs
#include <linux/ioctl.h>

#define SCULL_IOC_MAGIC  'k'              // pick an unused magic byte

#define SCULL_RESET    _IO(SCULL_IOC_MAGIC,  0)            // no data
#define SCULL_SET_SIZE _IOW(SCULL_IOC_MAGIC, 1, int)       // user -> kernel
#define SCULL_GET_SIZE _IOR(SCULL_IOC_MAGIC, 2, int)       // kernel -> user
#define SCULL_IOC_MAXNR 2

static long scull_ioctl(struct file *filp, unsigned int cmd,
                        unsigned long arg)
{
    struct scull_dev *dev = filp->private_data;
    int newval, err = 0;

    // Reject commands that are not ours, BEFORE touching arg.
    if (_IOC_TYPE(cmd) != SCULL_IOC_MAGIC) return -ENOTTY;
    if (_IOC_NR(cmd)   >  SCULL_IOC_MAXNR) return -ENOTTY;

    switch (cmd) {
    case SCULL_RESET:
        dev->size = 0;
        break;
    case SCULL_SET_SIZE:                         // arg is a user pointer
        if (get_user(newval, (int __user *)arg)) return -EFAULT;
        dev->size = newval;
        break;
    case SCULL_GET_SIZE:
        if (put_user(dev->size, (int __user *)arg)) return -EFAULT;
        break;
    default:
        return -ENOTTY;                          // not -EINVAL
    }
    return err;
}`
        }
      ]
    },
    {
      heading: '/dev nodes, udev, and per-open private_data',
      body: `Two practical pieces complete a usable driver: how the file under /dev comes into existence, and how each open of that file carries its own state.

### Getting a node into /dev

A device node is just a special file created with the mknod system call (or the mknod command), carrying a type and a major/minor. Historically you ran mknod by hand, but that is brittle - the major is dynamic, and hard-coding it breaks. The modern, automatic path is to register a **device class** and call device_create(); the kernel then exports the device through sysfs, and the user-space **udev** daemon notices the event and creates (and later removes) the /dev node with the correct numbers, ownership, and permissions. This is why you should prefer dynamic major allocation: udev does the bookkeeping for you. The pairing is class_create() plus device_create() on load, and device_destroy() plus class_destroy() on unload.

### Per-open state with private_data

struct file has a void *private_data field that is *yours*. The canonical use is to stash a pointer to your per-device structure during open, so that every later callback can recover it in one line - filp->private_data - instead of re-deriving it from the inode each time. In open you find your device from the inode using container_of on the embedded cdev, then save it.

private_data can also hold genuinely *per-open* state. Each call to open() produces a distinct struct file, even for the same node, so private_data is the right place for things like a per-reader cursor, a per-session buffer, or a flag set from open flags. If you allocate something there, free it in release - and remember release runs when the last reference to that struct file is dropped, which because of dup() and fork() is not necessarily the same number of times open ran.

> Pitfall: container_of is how you go from a pointer to an embedded member (the cdev inside your struct) back to the enclosing struct. Getting the member name or type wrong compiles fine but corrupts memory at runtime - double-check those arguments.`,
      code: [
        {
          lang: 'c',
          src: `// --- open: recover the device and cache it in private_data ---
static int scull_open(struct inode *inode, struct file *filp)
{
    struct scull_dev *dev;

    // inode->i_cdev points at the embedded cdev; walk back to the
    // enclosing scull_dev. Args: pointer, container type, member name.
    dev = container_of(inode->i_cdev, struct scull_dev, cdev);
    filp->private_data = dev;        // every later callback gets it free

    if ((filp->f_flags & O_ACCMODE) == O_WRONLY) {
        // e.g. truncate-on-open-for-write semantics, with locking
    }
    return 0;
}

// --- automatic /dev node creation via a class + udev ---
static struct class *scull_class;

// in module_init, after cdev_add:
scull_class = class_create("scull");
device_create(scull_class, NULL,
              MKDEV(MAJOR(dev_num), MINOR(dev_num)),
              NULL, "scull%d", i);     // udev makes /dev/scull0, ...

// in module_exit, BEFORE class_destroy:
//   device_destroy(scull_class, MKDEV(MAJOR(dev_num), MINOR(dev_num)+i));
//   class_destroy(scull_class);`
        }
      ]
    }
  ],
  takeaways: [
    'A character device exposes a byte stream to user space as a /dev file; read/write/ioctl on that file dispatch into the function pointers your driver registers.',
    'A dev_t packs a major (which driver) and a minor (which device within the driver); always use MKDEV, MAJOR, and MINOR rather than touching bits directly.',
    'Prefer alloc_chrdev_region (dynamic major) over register_chrdev_region (static); read the assigned major back at runtime and release the range with unregister_chrdev_region on exit.',
    'struct file_operations is the dispatch table - use designated initializers, set .owner = THIS_MODULE to pin the module while a file is open, and match each callback prototype exactly.',
    'cdev_add makes the device live and immediately racy with open(); fully initialize all state BEFORE calling it, and tear down in exact reverse order (cdev_del, free, unregister).',
    'Never dereference a __user pointer directly: use copy_to_user / copy_from_user (or get_user / put_user); their return value is bytes NOT copied, and nonzero means return -EFAULT.',
    'In read/write you must advance *f_pos by the bytes transferred and return that count; returning 0 from read means end of file.',
    'ioctl carries control commands; encode command numbers with _IO/_IOR/_IOW/_IOWR using a unique magic byte, and reject unknown commands with -ENOTTY (not -EINVAL).',
    'Cache your per-device struct in filp->private_data during open (via container_of from the embedded cdev), and let class_create + device_create drive udev to make /dev nodes automatically.'
  ],
  cheatsheet: [
    { label: 'dev_t', value: 'Opaque packed device number; 12-bit major + 20-bit minor on modern kernels' },
    { label: 'MKDEV / MAJOR / MINOR', value: 'Build a dev_t / extract major / extract minor - never bit-twiddle by hand' },
    { label: 'alloc_chrdev_region', value: 'Dynamically reserve a major+minor range (preferred); reads major back at runtime' },
    { label: 'register_chrdev_region', value: 'Reserve a specific (static) major - fragile, discouraged for new drivers' },
    { label: 'unregister_chrdev_region', value: 'Release a reserved number range in module exit; required or it leaks' },
    { label: 'struct file_operations', value: 'Table of callbacks (open/read/write/ioctl); NULL field = unsupported op' },
    { label: '.owner = THIS_MODULE', value: 'Refcounts the module so it cannot be unloaded while a file is open' },
    { label: 'cdev_init + cdev_add', value: 'Bind a number range to your fops; cdev_add makes the device live (racy)' },
    { label: 'cdev_del', value: 'Detach the cdev and wait out in-flight calls; first step of teardown' },
    { label: 'copy_to_user / copy_from_user', value: 'Safe kernel<->user byte copy; returns bytes NOT copied, 0 = success' },
    { label: 'get_user / put_user', value: 'Type-checked single-scalar transfer across the user boundary' },
    { label: '__user', value: 'Annotation marking a user-space pointer; never dereference it directly' },
    { label: '_IO / _IOR / _IOW / _IOWR', value: 'Encode ioctl command numbers with magic, nr, direction, and arg size' },
    { label: 'filp->private_data', value: 'Driver-owned per-open pointer; cache your device struct here in open()' }
  ]
}

export default note
