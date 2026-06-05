import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch08-c-001',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Build a dev_t From Major and Minor',
    prompt: `Write a function int show_devnum(void) that builds a dev_t for major 240, minor 0 using the MKDEV macro, then prints the major and minor extracted back out with MAJOR() and MINOR(). Use pr_info to print "dev: major=%u minor=%u\\n". Return 0.`,
    hints: [
      'MKDEV(major, minor) packs the two numbers into a dev_t.',
      'MAJOR(dev) and MINOR(dev) unpack them again.',
    ],
    solution: `#include <linux/kdev_t.h>
#include <linux/kernel.h>

int show_devnum(void)
{
    dev_t dev = MKDEV(240, 0);

    pr_info("dev: major=%u minor=%u\\n", MAJOR(dev), MINOR(dev));
    return 0;
}`,
    starter: `#include <linux/kdev_t.h>
#include <linux/kernel.h>

int show_devnum(void)
{
    dev_t dev = /* TODO: MKDEV(...) */;
    // TODO: print major and minor
    return 0;
}`,
    tags: ['chardev', 'dev_t', 'basics'],
  },
  {
    id: 'lx-ch08-c-002',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Dynamically Allocate a Device Number',
    prompt: `Write a function that dynamically allocates one device number with alloc_chrdev_region. Use a static dev_t variable named dev_id, a base minor of 0, a count of 1, and the name "mychar". Return the value alloc_chrdev_region returns, and on success print the allocated major with pr_info "mychar: major=%u\\n".`,
    hints: [
      'alloc_chrdev_region(&dev_id, baseminor, count, name).',
      'It returns 0 on success or a negative errno.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/kdev_t.h>
#include <linux/kernel.h>

static dev_t dev_id;

int alloc_my_devnum(void)
{
    int ret = alloc_chrdev_region(&dev_id, 0, 1, "mychar");

    if (ret < 0)
        return ret;

    pr_info("mychar: major=%u\\n", MAJOR(dev_id));
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/kdev_t.h>
#include <linux/kernel.h>

static dev_t dev_id;

int alloc_my_devnum(void)
{
    // TODO: alloc_chrdev_region into dev_id, 1 number, name "mychar"
    // TODO: check error, print major
    return 0;
}`,
    tags: ['chardev', 'dev_t', 'alloc_chrdev_region'],
  },
  {
    id: 'lx-ch08-c-003',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Release a Device Number Region',
    prompt: `Given a static dev_t dev_id holding a region of 1 number that was obtained with alloc_chrdev_region, write a function void free_my_devnum(void) that releases it with unregister_chrdev_region. Pass the same dev_id and count of 1.`,
    hints: [
      'unregister_chrdev_region(dev, count).',
      'The count must match what you allocated.',
    ],
    solution: `#include <linux/fs.h>

extern dev_t dev_id;

void free_my_devnum(void)
{
    unregister_chrdev_region(dev_id, 1);
}`,
    starter: `#include <linux/fs.h>

extern dev_t dev_id;

void free_my_devnum(void)
{
    // TODO: unregister the 1-number region
}`,
    tags: ['chardev', 'dev_t', 'cleanup'],
  },
  {
    id: 'lx-ch08-c-004',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Minimal file_operations Struct',
    prompt: `Define a static struct file_operations named my_fops that sets the .owner field to THIS_MODULE and wires .open to my_open and .release to my_release. Assume int my_open(struct inode *, struct file *) and int my_release(struct inode *, struct file *) are already declared. Use designated initializers.`,
    hints: [
      'Always set .owner = THIS_MODULE so the module refcount is correct.',
      'Use designated initializers like .open = my_open.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/module.h>

int my_open(struct inode *inode, struct file *file);
int my_release(struct inode *inode, struct file *file);

static const struct file_operations my_fops = {
    .owner   = THIS_MODULE,
    .open    = my_open,
    .release = my_release,
};`,
    starter: `#include <linux/fs.h>
#include <linux/module.h>

int my_open(struct inode *inode, struct file *file);
int my_release(struct inode *inode, struct file *file);

static const struct file_operations my_fops = {
    // TODO: owner, open, release
};`,
    tags: ['chardev', 'file_operations', 'struct'],
  },
  {
    id: 'lx-ch08-c-005',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A No-Op Open Handler',
    prompt: `Write an open handler int my_open(struct inode *inode, struct file *file) that simply logs "mychar: open\\n" with pr_info and returns 0 to indicate success.`,
    hints: [
      'An open handler returns 0 on success or a negative errno.',
      'You do not have to use inode or file here.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/kernel.h>

int my_open(struct inode *inode, struct file *file)
{
    pr_info("mychar: open\\n");
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/kernel.h>

int my_open(struct inode *inode, struct file *file)
{
    // TODO: log and return success
}`,
    tags: ['chardev', 'open', 'file_operations'],
  },
  {
    id: 'lx-ch08-c-006',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A No-Op Release Handler',
    prompt: `Write a release handler int my_release(struct inode *inode, struct file *file) that logs "mychar: release\\n" with pr_info and returns 0. The release handler is called when the last reference to an open file is closed.`,
    hints: [
      'release is the counterpart to open, called at close time.',
      'Return 0 on success.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/kernel.h>

int my_release(struct inode *inode, struct file *file)
{
    pr_info("mychar: release\\n");
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/kernel.h>

int my_release(struct inode *inode, struct file *file)
{
    // TODO: log and return success
}`,
    tags: ['chardev', 'release', 'file_operations'],
  },
  {
    id: 'lx-ch08-c-007',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read Handler Signature',
    prompt: `Write the exact prototype declaration of a character device read handler named my_read, matching the .read field of struct file_operations. It takes a struct file *, a __user char buffer, a size_t count, and a loff_t * position, and returns ssize_t. Just write the prototype ending in a semicolon.`,
    hints: [
      'The kernel buffer pointer carries the __user annotation.',
      'read returns ssize_t (number of bytes, or negative errno).',
    ],
    solution: `#include <linux/fs.h>

ssize_t my_read(struct file *file, char __user *buf, size_t count, loff_t *ppos);`,
    starter: `#include <linux/fs.h>

// TODO: write the read handler prototype`,
    tags: ['chardev', 'read', 'file_operations'],
  },
  {
    id: 'lx-ch08-c-008',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Write Handler Signature',
    prompt: `Write the exact prototype of a character device write handler named my_write, matching the .write field of struct file_operations. It takes a struct file *, a const __user char buffer, a size_t count, and a loff_t * position, and returns ssize_t. End it with a semicolon.`,
    hints: [
      'The user buffer is const for write.',
      'Annotate the user pointer with __user.',
    ],
    solution: `#include <linux/fs.h>

ssize_t my_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos);`,
    starter: `#include <linux/fs.h>

// TODO: write the write handler prototype`,
    tags: ['chardev', 'write', 'file_operations'],
  },
  {
    id: 'lx-ch08-c-009',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Initialize a cdev',
    prompt: `Given a static struct cdev my_cdev and a static const struct file_operations my_fops, write a function void init_my_cdev(void) that initializes the cdev with cdev_init and then sets my_cdev.owner to THIS_MODULE.`,
    hints: [
      'cdev_init(&cdev, &fops) wires the cdev to its operations.',
      'Set .owner = THIS_MODULE after cdev_init.',
    ],
    solution: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/module.h>

static struct cdev my_cdev;
extern const struct file_operations my_fops;

void init_my_cdev(void)
{
    cdev_init(&my_cdev, &my_fops);
    my_cdev.owner = THIS_MODULE;
}`,
    starter: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/module.h>

static struct cdev my_cdev;
extern const struct file_operations my_fops;

void init_my_cdev(void)
{
    // TODO: cdev_init then set owner
}`,
    tags: ['chardev', 'cdev', 'cdev_init'],
  },
  {
    id: 'lx-ch08-c-010',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Add a cdev to the System',
    prompt: `Given an already-initialized static struct cdev my_cdev and a static dev_t dev_id, write int add_my_cdev(void) that makes the device live with cdev_add, adding 1 minor starting at dev_id. Return cdev_add's result directly.`,
    hints: [
      'cdev_add(&cdev, dev, count) returns 0 on success.',
      'After cdev_add the device is live, so it must be ready to handle calls.',
    ],
    solution: `#include <linux/cdev.h>
#include <linux/fs.h>

extern struct cdev my_cdev;
extern dev_t dev_id;

int add_my_cdev(void)
{
    return cdev_add(&my_cdev, dev_id, 1);
}`,
    starter: `#include <linux/cdev.h>
#include <linux/fs.h>

extern struct cdev my_cdev;
extern dev_t dev_id;

int add_my_cdev(void)
{
    // TODO: cdev_add for 1 minor at dev_id
}`,
    tags: ['chardev', 'cdev', 'cdev_add'],
  },
  {
    id: 'lx-ch08-c-011',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Remove a cdev',
    prompt: `Write void del_my_cdev(void) that removes a live character device from the system. It is given an extern struct cdev my_cdev that was previously added with cdev_add. Use cdev_del.`,
    hints: [
      'cdev_del is the counterpart of cdev_add.',
      'After cdev_del no new opens of the device will reach your fops.',
    ],
    solution: `#include <linux/cdev.h>

extern struct cdev my_cdev;

void del_my_cdev(void)
{
    cdev_del(&my_cdev);
}`,
    starter: `#include <linux/cdev.h>

extern struct cdev my_cdev;

void del_my_cdev(void)
{
    // TODO: remove the cdev
}`,
    tags: ['chardev', 'cdev', 'cleanup'],
  },
  {
    id: 'lx-ch08-c-012',
    chapter: 8,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read Handler That Returns EOF',
    prompt: `Write a read handler ssize_t empty_read(struct file *file, char __user *buf, size_t count, loff_t *ppos) for a device that always reports end-of-file. A read returning 0 means EOF. Return 0 without touching the user buffer.`,
    hints: [
      'A read return value of 0 signals end-of-file to userspace.',
      'You do not need to copy anything for EOF.',
    ],
    solution: `#include <linux/fs.h>

ssize_t empty_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    return 0;
}`,
    starter: `#include <linux/fs.h>

ssize_t empty_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    // TODO: report EOF
}`,
    tags: ['chardev', 'read', 'eof'],
  },
  {
    id: 'lx-ch08-c-013',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Copy a Fixed String to User on Read',
    prompt: `Write ssize_t hello_read(struct file *file, char __user *buf, size_t count, loff_t *ppos) that returns the bytes of the string "hi\\n" (3 bytes) exactly once. If *ppos is already at or past 3, return 0 (EOF). Otherwise copy min(count, 3 - *ppos) bytes from the string at offset *ppos to the user buffer with copy_to_user, advance *ppos, and return the byte count copied. If copy_to_user fails, return -EFAULT.`,
    hints: [
      'copy_to_user returns the number of bytes NOT copied; nonzero means failure.',
      'Use *ppos to track how far the reader has consumed.',
      'min(count, remaining) caps how much you copy this call.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

ssize_t hello_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    static const char msg[] = "hi\\n";
    size_t len = 3;
    size_t avail, n;

    if (*ppos >= (loff_t)len)
        return 0;

    avail = len - (size_t)*ppos;
    n = min(count, avail);

    if (copy_to_user(buf, msg + *ppos, n))
        return -EFAULT;

    *ppos += n;
    return n;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

ssize_t hello_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    static const char msg[] = "hi\\n";
    // TODO: EOF check, clamp count, copy_to_user, advance *ppos
}`,
    tags: ['chardev', 'read', 'copy_to_user'],
  },
  {
    id: 'lx-ch08-c-014',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Discarding Write Handler',
    prompt: `Write ssize_t null_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos) that behaves like /dev/null: it accepts and discards all data. Do not copy anything from the user buffer; just claim all bytes were written. Return count.`,
    hints: [
      'A write handler returns the number of bytes consumed.',
      'Returning count tells userspace the whole buffer was accepted.',
    ],
    solution: `#include <linux/fs.h>

ssize_t null_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    return count;
}`,
    starter: `#include <linux/fs.h>

ssize_t null_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    // TODO: accept all bytes, discard them
}`,
    tags: ['chardev', 'write', 'null'],
  },
  {
    id: 'lx-ch08-c-015',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Write Into a Fixed Device Buffer',
    prompt: `A device has a global buffer: static char store[256]. Write ssize_t store_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos) that writes starting at offset 0 (ignore *ppos), clamping count to the 256-byte buffer. Use copy_from_user to copy the data in; return -EFAULT on failure. On success return the number of bytes copied.`,
    hints: [
      'copy_from_user returns the count of bytes NOT copied.',
      'Clamp count to sizeof(store) so you never overflow the buffer.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

static char store[256];

ssize_t store_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    size_t n = min(count, sizeof(store));

    if (copy_from_user(store, buf, n))
        return -EFAULT;

    return n;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

static char store[256];

ssize_t store_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    // TODO: clamp count, copy_from_user, return bytes copied or -EFAULT
}`,
    tags: ['chardev', 'write', 'copy_from_user'],
  },
  {
    id: 'lx-ch08-c-016',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate Read Offset Before Copying',
    prompt: `A device exposes a static char data[128] holding a payload of static length 128. Write ssize_t data_read(struct file *file, char __user *buf, size_t count, loff_t *ppos) that supports positional reads. If *ppos is negative or >= 128, return 0. Otherwise copy min(count, 128 - *ppos) bytes from data + *ppos to user, advance *ppos, and return the byte count, or -EFAULT on copy failure.`,
    hints: [
      'Guard against *ppos beyond the data length so you never read out of bounds.',
      'Advance *ppos by exactly the number of bytes copied.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

static char data[128];

ssize_t data_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    size_t len = sizeof(data);
    size_t n;

    if (*ppos < 0 || *ppos >= (loff_t)len)
        return 0;

    n = min(count, (size_t)(len - *ppos));

    if (copy_to_user(buf, data + *ppos, n))
        return -EFAULT;

    *ppos += n;
    return n;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

static char data[128];

ssize_t data_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    // TODO: bounds-check *ppos, clamp count, copy_to_user, advance *ppos
}`,
    tags: ['chardev', 'read', 'offset'],
  },
  {
    id: 'lx-ch08-c-017',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Per-Open Counter in private_data',
    prompt: `Write an open handler int ctr_open(struct inode *inode, struct file *file) that allocates a single int with kzalloc(sizeof(int), GFP_KERNEL) and stores the pointer in file->private_data. Return -ENOMEM if the allocation fails, otherwise 0. This gives each open file its own private counter.`,
    hints: [
      'file->private_data is a void * the kernel keeps per open file.',
      'GFP_KERNEL is fine in open() because it may sleep there.',
      'kzalloc zeroes the memory for you.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/errno.h>

int ctr_open(struct inode *inode, struct file *file)
{
    int *counter = kzalloc(sizeof(int), GFP_KERNEL);

    if (!counter)
        return -ENOMEM;

    file->private_data = counter;
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/errno.h>

int ctr_open(struct inode *inode, struct file *file)
{
    // TODO: kzalloc an int, store in file->private_data, handle ENOMEM
}`,
    tags: ['chardev', 'open', 'private_data'],
  },
  {
    id: 'lx-ch08-c-018',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Free private_data on Release',
    prompt: `Pairing with an open that did kzalloc into file->private_data, write int ctr_release(struct inode *inode, struct file *file) that frees that allocation with kfree and clears the pointer to NULL. Return 0.`,
    hints: [
      'Every allocation in open must be freed in release to avoid a leak.',
      'kfree(NULL) is safe, but set the pointer to NULL after freeing anyway.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/slab.h>

int ctr_release(struct inode *inode, struct file *file)
{
    kfree(file->private_data);
    file->private_data = NULL;
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/slab.h>

int ctr_release(struct inode *inode, struct file *file)
{
    // TODO: kfree private_data and clear it
}`,
    tags: ['chardev', 'release', 'private_data'],
  },
  {
    id: 'lx-ch08-c-019',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read Returns Per-Open Open Count',
    prompt: `A device stores a per-open int *counter in file->private_data. Write ssize_t ctr_read(struct file *file, char __user *buf, size_t count, loff_t *ppos) that increments *counter, formats it into a stack buffer with snprintf as "%d\\n", and returns it to user using simple_read_from_buffer over the formatted string. (simple_read_from_buffer handles the *ppos/clamp/copy_to_user logic and returns bytes copied or a negative errno.)`,
    hints: [
      'snprintf into a small char tmp[16] buffer, capturing its return length.',
      'simple_read_from_buffer(buf, count, ppos, src, srclen) does the heavy lifting.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>

ssize_t ctr_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    int *counter = file->private_data;
    char tmp[16];
    int len;

    (*counter)++;
    len = snprintf(tmp, sizeof(tmp), "%d\\n", *counter);

    return simple_read_from_buffer(buf, count, ppos, tmp, len);
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>

ssize_t ctr_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    int *counter = file->private_data;
    // TODO: increment, snprintf, simple_read_from_buffer
}`,
    tags: ['chardev', 'read', 'private_data'],
  },
  {
    id: 'lx-ch08-c-020',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Handle copy_to_user Partial Failure',
    prompt: `Write ssize_t safe_read(struct file *file, char __user *buf, size_t count, loff_t *ppos) given a static char src[64] of length 64. copy_to_user can fault and copy only part of the data; it returns the number of bytes that were NOT copied. Clamp count, call copy_to_user, and if it returns nonzero, return -EFAULT. On success advance *ppos and return the bytes copied. Treat *ppos >= 64 as EOF.`,
    hints: [
      'Never assume copy_to_user copied everything; check its return value.',
      'A nonzero return means the user pointer faulted partway.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

static char src[64];

ssize_t safe_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    size_t len = sizeof(src);
    size_t n;

    if (*ppos >= (loff_t)len)
        return 0;

    n = min(count, (size_t)(len - *ppos));

    if (copy_to_user(buf, src + *ppos, n))
        return -EFAULT;

    *ppos += n;
    return n;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

static char src[64];

ssize_t safe_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)
{
    // TODO: EOF check, clamp, copy_to_user with -EFAULT on failure, advance *ppos
}`,
    tags: ['chardev', 'read', 'copy_to_user'],
  },
  {
    id: 'lx-ch08-c-021',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reject Oversized Writes With EINVAL',
    prompt: `A device buffer is static char store[32]. Write ssize_t bounded_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos) that refuses any write whose count exceeds sizeof(store): return -EINVAL in that case. Otherwise copy_from_user the data into store and return count (or -EFAULT on copy failure).`,
    hints: [
      'Validate the requested size before touching the buffer.',
      '-EINVAL is the conventional error for an invalid argument like too-large a size.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static char store[32];

ssize_t bounded_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    if (count > sizeof(store))
        return -EINVAL;

    if (copy_from_user(store, buf, count))
        return -EFAULT;

    return count;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static char store[32];

ssize_t bounded_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    // TODO: reject count > sizeof(store) with -EINVAL, else copy_from_user
}`,
    tags: ['chardev', 'write', 'validation'],
  },
  {
    id: 'lx-ch08-c-022',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Define ioctl Command Codes',
    prompt: `Using the kernel ioctl macros, define three command codes for a device with a magic number 'k' (0x6b). MYDEV_RESET takes no argument (_IO). MYDEV_GET_SIZE reads an int back to userspace (_IOR). MYDEV_SET_SIZE writes an int from userspace (_IOW). Use sequence numbers 1, 2, and 3 respectively. Write the three #define lines plus the MYDEV_MAGIC define.`,
    hints: [
      '_IO(magic, nr) for no data, _IOR for read, _IOW for write, _IOWR for both.',
      'The third argument to _IOR/_IOW is the data type carried by the call.',
    ],
    solution: `#include <linux/ioctl.h>

#define MYDEV_MAGIC      'k'
#define MYDEV_RESET      _IO(MYDEV_MAGIC, 1)
#define MYDEV_GET_SIZE   _IOR(MYDEV_MAGIC, 2, int)
#define MYDEV_SET_SIZE   _IOW(MYDEV_MAGIC, 3, int)`,
    starter: `#include <linux/ioctl.h>

#define MYDEV_MAGIC 'k'
// TODO: define MYDEV_RESET, MYDEV_GET_SIZE, MYDEV_SET_SIZE`,
    tags: ['chardev', 'ioctl', 'macros'],
  },
  {
    id: 'lx-ch08-c-023',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Minimal unlocked_ioctl Dispatcher',
    prompt: `Write long mydev_ioctl(struct file *file, unsigned int cmd, unsigned long arg) that handles MYDEV_RESET (already #defined) by setting a global int dev_size to 0 and returning 0. For any other command, return -ENOTTY (the conventional "inappropriate ioctl" error). Use a switch on cmd.`,
    hints: [
      '.unlocked_ioctl has signature long (*)(struct file *, unsigned int, unsigned long).',
      'Unknown commands should return -ENOTTY, not -EINVAL.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/errno.h>

extern int dev_size;
#define MYDEV_RESET _IO('k', 1)

long mydev_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    switch (cmd) {
    case MYDEV_RESET:
        dev_size = 0;
        return 0;
    default:
        return -ENOTTY;
    }
}`,
    starter: `#include <linux/fs.h>
#include <linux/errno.h>

extern int dev_size;
#define MYDEV_RESET _IO('k', 1)

long mydev_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    // TODO: switch on cmd; handle MYDEV_RESET; default -ENOTTY
}`,
    tags: ['chardev', 'ioctl', 'dispatch'],
  },
  {
    id: 'lx-ch08-c-024',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'ioctl Get: Copy an Int to User',
    prompt: `Extend an ioctl to handle MYDEV_GET_SIZE (defined with _IOR(...int)). For that command, copy the global int dev_size out to the userspace pointer in arg with put_user, returning -EFAULT on failure or 0 on success. Write just the case body inside the switch.`,
    hints: [
      'arg is an unsigned long; cast it to the proper __user pointer type.',
      'put_user(value, ptr) copies one scalar to user and returns 0 or -EFAULT.',
    ],
    solution: `#include <linux/uaccess.h>
#include <linux/errno.h>

extern int dev_size;
#define MYDEV_GET_SIZE _IOR('k', 2, int)

/* inside switch (cmd): */
case MYDEV_GET_SIZE:
    if (put_user(dev_size, (int __user *)arg))
        return -EFAULT;
    return 0;`,
    starter: `#include <linux/uaccess.h>
#include <linux/errno.h>

extern int dev_size;
#define MYDEV_GET_SIZE _IOR('k', 2, int)

/* inside switch (cmd): */
case MYDEV_GET_SIZE:
    // TODO: put_user dev_size to (int __user *)arg
`,
    tags: ['chardev', 'ioctl', 'put_user'],
  },
  {
    id: 'lx-ch08-c-025',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'ioctl Set: Copy an Int From User',
    prompt: `Extend an ioctl to handle MYDEV_SET_SIZE (defined with _IOW(...int)). Read an int from the user pointer in arg with get_user into a local variable, reject negative values with -EINVAL, otherwise store it into the global int dev_size and return 0. Return -EFAULT if get_user fails. Write just the case body.`,
    hints: [
      'get_user(local, ptr) copies one scalar in from user.',
      'Validate the value before committing it to your device state.',
    ],
    solution: `#include <linux/uaccess.h>
#include <linux/errno.h>

extern int dev_size;
#define MYDEV_SET_SIZE _IOW('k', 3, int)

/* inside switch (cmd): */
case MYDEV_SET_SIZE: {
    int val;

    if (get_user(val, (int __user *)arg))
        return -EFAULT;
    if (val < 0)
        return -EINVAL;
    dev_size = val;
    return 0;
}`,
    starter: `#include <linux/uaccess.h>
#include <linux/errno.h>

extern int dev_size;
#define MYDEV_SET_SIZE _IOW('k', 3, int)

/* inside switch (cmd): */
case MYDEV_SET_SIZE: {
    // TODO: get_user, validate >= 0, store into dev_size
}`,
    tags: ['chardev', 'ioctl', 'get_user'],
  },
  {
    id: 'lx-ch08-c-026',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate ioctl Magic and Number',
    prompt: `Before dispatching, an ioctl should sanity-check the command. Write the top of long mydev_ioctl(struct file *file, unsigned int cmd, unsigned long arg) that returns -ENOTTY if _IOC_TYPE(cmd) is not MYDEV_MAGIC or if _IOC_NR(cmd) exceeds MYDEV_MAXNR. Assume MYDEV_MAGIC and MYDEV_MAXNR are #defined. Then continue to a switch (you may leave the switch empty/return 0).`,
    hints: [
      '_IOC_TYPE extracts the magic byte; _IOC_NR extracts the sequence number.',
      'Rejecting foreign magic numbers early is a standard ioctl guard.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/ioctl.h>
#include <linux/errno.h>

#define MYDEV_MAGIC 'k'
#define MYDEV_MAXNR 3

long mydev_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    if (_IOC_TYPE(cmd) != MYDEV_MAGIC)
        return -ENOTTY;
    if (_IOC_NR(cmd) > MYDEV_MAXNR)
        return -ENOTTY;

    switch (cmd) {
    default:
        return 0;
    }
}`,
    starter: `#include <linux/fs.h>
#include <linux/ioctl.h>
#include <linux/errno.h>

#define MYDEV_MAGIC 'k'
#define MYDEV_MAXNR 3

long mydev_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    // TODO: reject wrong _IOC_TYPE and out-of-range _IOC_NR with -ENOTTY
    switch (cmd) {
    default:
        return 0;
    }
}`,
    tags: ['chardev', 'ioctl', 'validation'],
  },
  {
    id: 'lx-ch08-c-027',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'llseek With default_llseek',
    prompt: `Wire seeking on a device by writing its file_operations entry. Define static const struct file_operations seek_fops setting .owner = THIS_MODULE, .read = my_read, and .llseek = default_llseek so userspace lseek works against the device. Assume my_read is declared. (default_llseek is a generic helper exported by the kernel.)`,
    hints: [
      'default_llseek is a ready-made .llseek implementation.',
      'Setting .llseek makes lseek on the device update file->f_pos.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/module.h>

ssize_t my_read(struct file *file, char __user *buf, size_t count, loff_t *ppos);

static const struct file_operations seek_fops = {
    .owner  = THIS_MODULE,
    .read   = my_read,
    .llseek = default_llseek,
};`,
    starter: `#include <linux/fs.h>
#include <linux/module.h>

ssize_t my_read(struct file *file, char __user *buf, size_t count, loff_t *ppos);

static const struct file_operations seek_fops = {
    // TODO: owner, read, llseek = default_llseek
};`,
    tags: ['chardev', 'llseek', 'file_operations'],
  },
  {
    id: 'lx-ch08-c-028',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Custom llseek Over a Fixed Buffer',
    prompt: `A device exposes a buffer of constant size BUF_SIZE (256). Write loff_t buf_llseek(struct file *file, loff_t off, int whence) that handles SEEK_SET (newpos = off), SEEK_CUR (newpos = file->f_pos + off), and SEEK_END (newpos = BUF_SIZE + off). Reject any newpos < 0 or > BUF_SIZE with -EINVAL. Otherwise set file->f_pos = newpos and return newpos. Default whence returns -EINVAL.`,
    hints: [
      'whence selects the base: SEEK_SET, SEEK_CUR, SEEK_END.',
      'Update file->f_pos and return the new position on success.',
      'Bounds-check the computed position before committing it.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/errno.h>

#define BUF_SIZE 256

loff_t buf_llseek(struct file *file, loff_t off, int whence)
{
    loff_t newpos;

    switch (whence) {
    case SEEK_SET:
        newpos = off;
        break;
    case SEEK_CUR:
        newpos = file->f_pos + off;
        break;
    case SEEK_END:
        newpos = BUF_SIZE + off;
        break;
    default:
        return -EINVAL;
    }

    if (newpos < 0 || newpos > BUF_SIZE)
        return -EINVAL;

    file->f_pos = newpos;
    return newpos;
}`,
    starter: `#include <linux/fs.h>
#include <linux/errno.h>

#define BUF_SIZE 256

loff_t buf_llseek(struct file *file, loff_t off, int whence)
{
    loff_t newpos;

    switch (whence) {
    // TODO: SEEK_SET / SEEK_CUR / SEEK_END, default -EINVAL
    }

    // TODO: bounds-check, set f_pos, return newpos
}`,
    tags: ['chardev', 'llseek', 'offset'],
  },
  {
    id: 'lx-ch08-c-029',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read-Only Device That Rejects Writes',
    prompt: `Some devices are read-only. Write ssize_t ro_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos) that always rejects writes by returning -EPERM (operation not permitted), regardless of arguments.`,
    hints: [
      '-EPERM signals the operation is not permitted.',
      'You do not need to read the user buffer to reject the write.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/errno.h>

ssize_t ro_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    return -EPERM;
}`,
    starter: `#include <linux/fs.h>
#include <linux/errno.h>

ssize_t ro_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    // TODO: reject all writes
}`,
    tags: ['chardev', 'write', 'permissions'],
  },
  {
    id: 'lx-ch08-c-030',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Full Setup in module_init',
    prompt: `Write static int __init mychar_init(void) that, in order, (1) calls alloc_chrdev_region(&dev_id, 0, 1, "mychar") and returns its error on failure, (2) cdev_init(&my_cdev, &my_fops) and sets my_cdev.owner = THIS_MODULE, (3) cdev_add(&my_cdev, dev_id, 1) and, on failure, unregisters the region before returning the error. Return 0 on full success. dev_id, my_cdev, and my_fops already exist.`,
    hints: [
      'Each step that can fail needs cleanup of the earlier successful steps.',
      'If cdev_add fails, you must still unregister_chrdev_region.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/module.h>
#include <linux/init.h>

extern dev_t dev_id;
extern struct cdev my_cdev;
extern const struct file_operations my_fops;

static int __init mychar_init(void)
{
    int ret;

    ret = alloc_chrdev_region(&dev_id, 0, 1, "mychar");
    if (ret < 0)
        return ret;

    cdev_init(&my_cdev, &my_fops);
    my_cdev.owner = THIS_MODULE;

    ret = cdev_add(&my_cdev, dev_id, 1);
    if (ret < 0) {
        unregister_chrdev_region(dev_id, 1);
        return ret;
    }

    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/module.h>
#include <linux/init.h>

extern dev_t dev_id;
extern struct cdev my_cdev;
extern const struct file_operations my_fops;

static int __init mychar_init(void)
{
    // TODO: alloc_chrdev_region; cdev_init+owner; cdev_add with rollback
}`,
    tags: ['chardev', 'init', 'cdev'],
  },
  {
    id: 'lx-ch08-c-031',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Symmetric Cleanup in module_exit',
    prompt: `Write static void __exit mychar_exit(void) that tears down the device created in init, in the reverse order: first cdev_del(&my_cdev), then unregister_chrdev_region(dev_id, 1). dev_id and my_cdev are already declared.`,
    hints: [
      'Clean up in the opposite order of setup.',
      'cdev_del before releasing the device number region.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/module.h>
#include <linux/init.h>

extern dev_t dev_id;
extern struct cdev my_cdev;

static void __exit mychar_exit(void)
{
    cdev_del(&my_cdev);
    unregister_chrdev_region(dev_id, 1);
}`,
    starter: `#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/module.h>
#include <linux/init.h>

extern dev_t dev_id;
extern struct cdev my_cdev;

static void __exit mychar_exit(void)
{
    // TODO: cdev_del then unregister_chrdev_region (reverse of init)
}`,
    tags: ['chardev', 'exit', 'cleanup'],
  },
  {
    id: 'lx-ch08-c-032',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Auto-Create a /dev Node With a Class',
    prompt: `So that udev makes /dev/mychar automatically, write int make_node(void) that creates a class with class_create(THIS_MODULE, "mychar") stored in static struct class *cls, then device_create(cls, NULL, dev_id, NULL, "mychar"). Return -ENOMEM if class_create returns an error pointer (use IS_ERR). On success return 0. dev_id already exists. (Note: on newer kernels class_create takes one argument; use the two-argument form here.)`,
    hints: [
      'class_create returns an ERR_PTR on failure; check with IS_ERR.',
      'device_create(class, parent, devt, drvdata, name) makes the /dev node via udev.',
    ],
    solution: `#include <linux/device.h>
#include <linux/fs.h>
#include <linux/err.h>
#include <linux/module.h>

extern dev_t dev_id;
static struct class *cls;

int make_node(void)
{
    cls = class_create(THIS_MODULE, "mychar");
    if (IS_ERR(cls))
        return -ENOMEM;

    device_create(cls, NULL, dev_id, NULL, "mychar");
    return 0;
}`,
    starter: `#include <linux/device.h>
#include <linux/fs.h>
#include <linux/err.h>
#include <linux/module.h>

extern dev_t dev_id;
static struct class *cls;

int make_node(void)
{
    // TODO: class_create + IS_ERR check, then device_create for "mychar"
}`,
    tags: ['chardev', 'devnode', 'class'],
  },
  {
    id: 'lx-ch08-c-033',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Destroy the /dev Node and Class',
    prompt: `Write void remove_node(void) that undoes make_node: call device_destroy(cls, dev_id) then class_destroy(cls). The extern struct class *cls and extern dev_t dev_id are provided. Order matters: destroy the device before the class.`,
    hints: [
      'device_destroy needs the class and the dev_t to find the node.',
      'class_destroy comes after all its devices are gone.',
    ],
    solution: `#include <linux/device.h>
#include <linux/fs.h>

extern struct class *cls;
extern dev_t dev_id;

void remove_node(void)
{
    device_destroy(cls, dev_id);
    class_destroy(cls);
}`,
    starter: `#include <linux/device.h>
#include <linux/fs.h>

extern struct class *cls;
extern dev_t dev_id;

void remove_node(void)
{
    // TODO: device_destroy then class_destroy
}`,
    tags: ['chardev', 'devnode', 'cleanup'],
  },
  {
    id: 'lx-ch08-c-034',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Append-Style Write Tracking f_pos',
    prompt: `A device has static char store[256] and static size_t store_len. Write ssize_t append_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos) that appends to the existing contents. If store_len == sizeof(store), return -ENOSPC. Otherwise copy min(count, sizeof(store) - store_len) bytes from user into store + store_len, update store_len and *ppos by the number copied, and return that count (or -EFAULT on failure).`,
    hints: [
      'Available space is sizeof(store) - store_len.',
      '-ENOSPC is the right error when the buffer is full.',
      'Advance both store_len and *ppos by the bytes you copied.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

static char store[256];
static size_t store_len;

ssize_t append_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    size_t space = sizeof(store) - store_len;
    size_t n;

    if (space == 0)
        return -ENOSPC;

    n = min(count, space);

    if (copy_from_user(store + store_len, buf, n))
        return -EFAULT;

    store_len += n;
    *ppos += n;
    return n;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/minmax.h>
#include <linux/errno.h>

static char store[256];
static size_t store_len;

ssize_t append_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)
{
    // TODO: compute space, -ENOSPC if full, copy_from_user, advance store_len/*ppos
}`,
    tags: ['chardev', 'write', 'append'],
  },
  {
    id: 'lx-ch08-c-035',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Open Stores the Device Struct in private_data',
    prompt: `A driver wraps its state in struct mydev { char buf[256]; size_t len; struct cdev cdev; }. In its open handler the cdev is embedded in the inode via inode->i_cdev. Write int mydev_open(struct inode *inode, struct file *file) that recovers the struct mydev pointer from inode->i_cdev using container_of and stashes it in file->private_data so read/write can reach it. Return 0.`,
    hints: [
      'container_of(ptr, type, member) recovers the enclosing struct from a member pointer.',
      'inode->i_cdev points at the embedded struct cdev member.',
      'Stash the struct in file->private_data for later handlers.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/container_of.h>

struct mydev {
    char buf[256];
    size_t len;
    struct cdev cdev;
};

int mydev_open(struct inode *inode, struct file *file)
{
    struct mydev *dev = container_of(inode->i_cdev, struct mydev, cdev);

    file->private_data = dev;
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/container_of.h>

struct mydev {
    char buf[256];
    size_t len;
    struct cdev cdev;
};

int mydev_open(struct inode *inode, struct file *file)
{
    // TODO: container_of from inode->i_cdev, store in file->private_data
}`,
    tags: ['chardev', 'open', 'container_of'],
  },
]

export default problems
