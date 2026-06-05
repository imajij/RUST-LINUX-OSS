import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch08-c-036',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Dynamically Allocate A Device Number',
    prompt: `Write a function \`int mychar_alloc(void)\` that dynamically allocates a single character device number into a global \`dev_t my_dev;\`.

Requirements:
- Use \`alloc_chrdev_region()\` to ask the kernel to pick a free major; request a starting minor of 0 and a count of 1.
- Pass the device name \`"mychar"\` (the name shown in /proc/devices).
- Return the value from \`alloc_chrdev_region()\` (0 on success, negative errno on failure).
- On success, print the chosen major and minor with \`MAJOR()\` and \`MINOR()\`.`,
    hints: [
      'alloc_chrdev_region(dev_t *dev, unsigned baseminor, unsigned count, const char *name).',
      'MAJOR(my_dev) and MINOR(my_dev) extract the parts of a dev_t.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/kdev_t.h>
#include <linux/kernel.h>

static dev_t my_dev;

int mychar_alloc(void)
{
    int ret = alloc_chrdev_region(&my_dev, 0, 1, "mychar");
    if (ret < 0) {
        pr_err("mychar: alloc_chrdev_region failed: %d\\n", ret);
        return ret;
    }
    pr_info("mychar: got major=%u minor=%u\\n",
            MAJOR(my_dev), MINOR(my_dev));
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/kdev_t.h>
#include <linux/kernel.h>

static dev_t my_dev;

int mychar_alloc(void)
{
    // TODO: alloc_chrdev_region into my_dev, request 1 number, name "mychar"
    // TODO: on failure return the errno; on success print MAJOR/MINOR
    return 0;
}`,
    tags: ['chardev', 'dev_t', 'alloc_chrdev_region'],
  },
  {
    id: 'lx-ch08-c-037',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register A Static Device Number',
    prompt: `Sometimes you want a fixed major/minor. Write \`int mychar_register_static(void)\` that registers a region of 4 device numbers starting at major 240, minor 0, into \`dev_t my_dev;\`.

Requirements:
- Build the starting \`dev_t\` with the \`MKDEV()\` macro.
- Use \`register_chrdev_region()\` (the static counterpart of \`alloc_chrdev_region()\`) to claim 4 numbers under the name \`"mychar"\`.
- Return its result (0 on success, negative errno on failure).`,
    hints: [
      'MKDEV(major, minor) builds a dev_t.',
      'register_chrdev_region(dev_t first, unsigned count, const char *name).',
    ],
    solution: `#include <linux/fs.h>
#include <linux/kdev_t.h>
#include <linux/kernel.h>

static dev_t my_dev;

int mychar_register_static(void)
{
    int ret;

    my_dev = MKDEV(240, 0);
    ret = register_chrdev_region(my_dev, 4, "mychar");
    if (ret < 0)
        pr_err("mychar: register_chrdev_region failed: %d\\n", ret);
    return ret;
}`,
    starter: `#include <linux/fs.h>
#include <linux/kdev_t.h>
#include <linux/kernel.h>

static dev_t my_dev;

int mychar_register_static(void)
{
    // TODO: my_dev = MKDEV(240, 0)
    // TODO: register_chrdev_region for 4 numbers, name "mychar"
    return 0;
}`,
    tags: ['chardev', 'dev_t', 'mkdev'],
  },
  {
    id: 'lx-ch08-c-038',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Minimal file_operations Table',
    prompt: `Define a \`struct file_operations my_fops\` for a character device that supports open, release, read, and write.

Requirements:
- Set \`.owner = THIS_MODULE\` so the module refcount is held while a file is open.
- Wire \`.open\`, \`.release\`, \`.read\`, and \`.write\` to functions named \`my_open\`, \`my_release\`, \`my_read\`, and \`my_write\` (assume they are declared above).
- Use C99 designated initializers.

You only need to write the struct; the handlers are provided elsewhere.`,
    hints: [
      '.owner = THIS_MODULE prevents unloading the module while the device is open.',
      'Designated initializers leave unset members zeroed, which is correct for fops.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/module.h>

static const struct file_operations my_fops = {
    .owner   = THIS_MODULE,
    .open    = my_open,
    .release = my_release,
    .read    = my_read,
    .write   = my_write,
};`,
    starter: `#include <linux/fs.h>
#include <linux/module.h>

static const struct file_operations my_fops = {
    // TODO: .owner, .open, .release, .read, .write
};`,
    tags: ['chardev', 'file_operations', 'fops'],
  },
  {
    id: 'lx-ch08-c-039',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Initialize And Add A cdev',
    prompt: `Write \`int mychar_cdev_add(struct cdev *cdev, dev_t dev, const struct file_operations *fops)\` that wires up a \`struct cdev\` and makes it live.

Requirements:
- Call \`cdev_init(cdev, fops)\` to associate the fops with the cdev.
- Set \`cdev->owner = THIS_MODULE\`.
- Call \`cdev_add(cdev, dev, 1)\` to add 1 device to the kernel and start serving opens.
- Return the result of \`cdev_add()\` (0 on success, negative errno on failure), logging an error on failure.`,
    hints: [
      'cdev_init() must be called before cdev_add().',
      'cdev_add publishes the device; after it returns 0, opens can arrive immediately.',
    ],
    solution: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/module.h>
#include <linux/kernel.h>

int mychar_cdev_add(struct cdev *cdev, dev_t dev,
                    const struct file_operations *fops)
{
    int ret;

    cdev_init(cdev, fops);
    cdev->owner = THIS_MODULE;

    ret = cdev_add(cdev, dev, 1);
    if (ret < 0)
        pr_err("mychar: cdev_add failed: %d\\n", ret);
    return ret;
}`,
    starter: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/module.h>
#include <linux/kernel.h>

int mychar_cdev_add(struct cdev *cdev, dev_t dev,
                    const struct file_operations *fops)
{
    // TODO: cdev_init, set owner, cdev_add(.. , dev, 1)
    return 0;
}`,
    tags: ['chardev', 'cdev', 'cdev_add'],
  },
  {
    id: 'lx-ch08-c-040',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Open And Release Handlers',
    prompt: `Write \`int my_open(struct inode *inode, struct file *file)\` and \`int my_release(struct inode *inode, struct file *file)\` for a character device.

Requirements:
- \`my_open\` logs \`"mychar: open"\` and returns 0 to allow the open.
- \`my_release\` logs \`"mychar: release"\` and returns 0.
- Mark the unused \`inode\` parameter so you do not trip -Wunused-parameter; do not allocate anything yet.

These are the two lifecycle callbacks every open() / last-close() pair invokes.`,
    hints: [
      'open returns 0 to accept, or a negative errno to reject the open.',
      'release is called once per struct file when the last reference is closed.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/kernel.h>

int my_open(struct inode *inode, struct file *file)
{
    pr_info("mychar: open\\n");
    return 0;
}

int my_release(struct inode *inode, struct file *file)
{
    pr_info("mychar: release\\n");
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/kernel.h>

int my_open(struct inode *inode, struct file *file)
{
    // TODO: log and return 0
    return 0;
}

int my_release(struct inode *inode, struct file *file)
{
    // TODO: log and return 0
    return 0;
}`,
    tags: ['chardev', 'open', 'release'],
  },
  {
    id: 'lx-ch08-c-041',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read Handler With copy_to_user',
    prompt: `A device backs a fixed 4 KiB buffer \`static char kbuf[4096]; static size_t data_len;\`. Write \`ssize_t my_read(struct file *file, char __user *buf, size_t count, loff_t *ppos)\` that copies bytes to user space starting at \`*ppos\`.

Requirements:
- If \`*ppos >= data_len\`, return 0 (EOF).
- Clamp \`count\` so you never read past \`data_len\`.
- Use \`copy_to_user()\` to move data; if it fails to copy everything, return \`-EFAULT\`.
- Advance \`*ppos\` by the number of bytes copied and return that count.`,
    hints: [
      'copy_to_user returns the number of bytes NOT copied; nonzero means a fault.',
      'Clamp: if (count > data_len - *ppos) count = data_len - *ppos.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static char kbuf[4096];
static size_t data_len;

ssize_t my_read(struct file *file, char __user *buf,
                size_t count, loff_t *ppos)
{
    if (*ppos >= data_len)
        return 0;

    if (count > data_len - *ppos)
        count = data_len - *ppos;

    if (copy_to_user(buf, kbuf + *ppos, count))
        return -EFAULT;

    *ppos += count;
    return count;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static char kbuf[4096];
static size_t data_len;

ssize_t my_read(struct file *file, char __user *buf,
                size_t count, loff_t *ppos)
{
    // TODO: EOF check, clamp count, copy_to_user, advance *ppos
    return 0;
}`,
    tags: ['chardev', 'read', 'copy_to_user'],
  },
  {
    id: 'lx-ch08-c-042',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Write Handler With copy_from_user',
    prompt: `Using the same \`static char kbuf[4096]; static size_t data_len;\`, write \`ssize_t my_write(struct file *file, const char __user *buf, size_t count, loff_t *ppos)\` that overwrites the buffer starting at \`*ppos\`.

Requirements:
- If \`*ppos >= sizeof(kbuf)\`, return \`-ENOSPC\` (no room left).
- Clamp \`count\` to the remaining space in \`kbuf\`.
- Use \`copy_from_user()\`; on partial/failed copy return \`-EFAULT\`.
- Advance \`*ppos\`, update \`data_len\` to the new end if it grew, and return the bytes written.`,
    hints: [
      'copy_from_user returns the count NOT copied.',
      'data_len should track the furthest written offset: if (*ppos > data_len) data_len = *ppos.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static char kbuf[4096];
static size_t data_len;

ssize_t my_write(struct file *file, const char __user *buf,
                 size_t count, loff_t *ppos)
{
    if (*ppos >= sizeof(kbuf))
        return -ENOSPC;

    if (count > sizeof(kbuf) - *ppos)
        count = sizeof(kbuf) - *ppos;

    if (copy_from_user(kbuf + *ppos, buf, count))
        return -EFAULT;

    *ppos += count;
    if (*ppos > data_len)
        data_len = *ppos;
    return count;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

static char kbuf[4096];
static size_t data_len;

ssize_t my_write(struct file *file, const char __user *buf,
                 size_t count, loff_t *ppos)
{
    // TODO: space check, clamp, copy_from_user, advance *ppos, update data_len
    return 0;
}`,
    tags: ['chardev', 'write', 'copy_from_user'],
  },
  {
    id: 'lx-ch08-c-043',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Tidy Cleanup On Module Exit',
    prompt: `Write \`void mychar_exit(struct cdev *cdev, dev_t dev)\` that undoes a successful setup in the correct order.

Requirements:
- Call \`cdev_del()\` first to stop new opens reaching your fops.
- Then call \`unregister_chrdev_region(dev, 1)\` to give the device number back.
- Log \`"mychar: unloaded"\`.

Cleanup must be the reverse of init: remove the cdev before releasing its number.`,
    hints: [
      'cdev_del() reverses cdev_add(); unregister_chrdev_region() reverses (alloc|register)_chrdev_region().',
      'Always tear down in reverse order of creation.',
    ],
    solution: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/kernel.h>

void mychar_exit(struct cdev *cdev, dev_t dev)
{
    cdev_del(cdev);
    unregister_chrdev_region(dev, 1);
    pr_info("mychar: unloaded\\n");
}`,
    starter: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/kernel.h>

void mychar_exit(struct cdev *cdev, dev_t dev)
{
    // TODO: cdev_del, then unregister_chrdev_region, then log
}`,
    tags: ['chardev', 'cleanup', 'cdev_del'],
  },
  {
    id: 'lx-ch08-c-044',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Goto-Based Error Unwinding In Init',
    prompt: `Write \`int mychar_init(void)\` that allocates a device number, then initializes and adds a cdev, using \`goto\` for cleanup on failure.

Globals available: \`static dev_t my_dev; static struct cdev my_cdev; static const struct file_operations my_fops;\`.

Requirements:
- \`alloc_chrdev_region(&my_dev, 0, 1, "mychar")\`; on failure return the errno directly.
- \`cdev_init(&my_cdev, &my_fops)\`, set \`my_cdev.owner = THIS_MODULE\`, then \`cdev_add(&my_cdev, my_dev, 1)\`.
- If \`cdev_add\` fails, \`goto err_region\` to unregister the region and return the errno.
- On full success, return 0.`,
    hints: [
      'The goto-cleanup ladder is the standard kernel idiom for multi-step init.',
      'Each label undoes exactly the steps that already succeeded.',
    ],
    solution: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/module.h>
#include <linux/kernel.h>

static dev_t my_dev;
static struct cdev my_cdev;
static const struct file_operations my_fops;

int mychar_init(void)
{
    int ret;

    ret = alloc_chrdev_region(&my_dev, 0, 1, "mychar");
    if (ret < 0)
        return ret;

    cdev_init(&my_cdev, &my_fops);
    my_cdev.owner = THIS_MODULE;

    ret = cdev_add(&my_cdev, my_dev, 1);
    if (ret < 0)
        goto err_region;

    return 0;

err_region:
    unregister_chrdev_region(my_dev, 1);
    return ret;
}`,
    starter: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/module.h>
#include <linux/kernel.h>

static dev_t my_dev;
static struct cdev my_cdev;
static const struct file_operations my_fops;

int mychar_init(void)
{
    int ret;
    // TODO: alloc_chrdev_region; cdev_init/owner/cdev_add; goto err_region on failure
    return 0;
}`,
    tags: ['chardev', 'init', 'error-handling'],
  },
  {
    id: 'lx-ch08-c-045',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Per-Open State In private_data',
    prompt: `Each open should get its own counter. Define \`struct my_ctx { unsigned long reads; };\` and write \`int my_open(struct inode *inode, struct file *file)\` that allocates one and stashes it in \`file->private_data\`.

Requirements:
- Allocate the context with \`kzalloc(sizeof(*ctx), GFP_KERNEL)\` (open runs in process context, so sleeping is fine).
- Return \`-ENOMEM\` if allocation fails.
- Store the pointer in \`file->private_data\` and return 0.`,
    hints: [
      'GFP_KERNEL is allowed here because open() is process context and may sleep.',
      'kzalloc zeroes the struct, so reads starts at 0.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct my_ctx { unsigned long reads; };

int my_open(struct inode *inode, struct file *file)
{
    struct my_ctx *ctx = kzalloc(sizeof(*ctx), GFP_KERNEL);
    if (!ctx)
        return -ENOMEM;

    file->private_data = ctx;
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct my_ctx { unsigned long reads; };

int my_open(struct inode *inode, struct file *file)
{
    // TODO: kzalloc a ctx, handle ENOMEM, store in file->private_data
    return 0;
}`,
    tags: ['chardev', 'private_data', 'kzalloc'],
  },
  {
    id: 'lx-ch08-c-046',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Free private_data In Release',
    prompt: `Write \`int my_release(struct inode *inode, struct file *file)\` that frees the per-open \`struct my_ctx\` allocated in open and logs how many reads happened.

Requirements:
- Fetch \`struct my_ctx *ctx = file->private_data;\`.
- Log \`ctx->reads\` (e.g. \`"mychar: closing after %lu reads"\`).
- Free it with \`kfree(ctx)\` and clear \`file->private_data = NULL\`.
- Return 0.`,
    hints: [
      'kfree(NULL) is safe, but clearing the pointer avoids dangling references.',
      'release is the natural place to free what open allocated.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/kernel.h>

struct my_ctx { unsigned long reads; };

int my_release(struct inode *inode, struct file *file)
{
    struct my_ctx *ctx = file->private_data;

    pr_info("mychar: closing after %lu reads\\n", ctx->reads);
    kfree(ctx);
    file->private_data = NULL;
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/kernel.h>

struct my_ctx { unsigned long reads; };

int my_release(struct inode *inode, struct file *file)
{
    // TODO: get ctx from private_data, log reads, kfree, NULL the pointer
    return 0;
}`,
    tags: ['chardev', 'release', 'private_data'],
  },
  {
    id: 'lx-ch08-c-047',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Map Minor To A Device Slot',
    prompt: `Your driver owns 4 minors that index a global array \`static struct mydev devices[4];\`. Write \`int my_open(struct inode *inode, struct file *file)\` that selects the right per-device struct based on the minor.

Requirements:
- Read the minor from the inode with \`iminor(inode)\`.
- If the minor is >= 4, return \`-ENODEV\`.
- Store \`&devices[minor]\` into \`file->private_data\` so read/write can reach the right device.
- Return 0.`,
    hints: [
      'iminor(inode) returns the minor number of the opened device node.',
      'Using private_data to carry a per-device pointer is the standard multi-minor pattern.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/errno.h>

struct mydev { char buf[256]; size_t len; };
static struct mydev devices[4];

int my_open(struct inode *inode, struct file *file)
{
    unsigned int minor = iminor(inode);

    if (minor >= 4)
        return -ENODEV;

    file->private_data = &devices[minor];
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/errno.h>

struct mydev { char buf[256]; size_t len; };
static struct mydev devices[4];

int my_open(struct inode *inode, struct file *file)
{
    // TODO: iminor(inode), bounds-check, set private_data to &devices[minor]
    return 0;
}`,
    tags: ['chardev', 'minor', 'private_data'],
  },
  {
    id: 'lx-ch08-c-048',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Define ioctl Command Codes',
    prompt: `Define a clean ioctl command interface in a header for a "mychar" device that can reset its buffer and report/set a length.

Requirements:
- Choose a magic byte, e.g. \`#define MYCHAR_MAGIC 'k'\`.
- \`MYCHAR_RESET\` — no argument: use \`_IO(MYCHAR_MAGIC, 0)\`.
- \`MYCHAR_GET_LEN\` — reads a \`size_t\` back to user space: use \`_IOR(MYCHAR_MAGIC, 1, size_t)\`.
- \`MYCHAR_SET_LEN\` — writes a \`size_t\` from user space: use \`_IOW(MYCHAR_MAGIC, 2, size_t)\`.

Encode direction and size in the command number, as the kernel convention requires.`,
    hints: [
      '_IO/_IOR/_IOW/_IOWR encode direction + size + magic + number into the command.',
      'Direction is from the user-space program perspective: _IOR means user reads.',
    ],
    solution: `#ifndef _MYCHAR_IOCTL_H
#define _MYCHAR_IOCTL_H

#include <linux/ioctl.h>

#define MYCHAR_MAGIC   'k'

#define MYCHAR_RESET   _IO(MYCHAR_MAGIC, 0)
#define MYCHAR_GET_LEN _IOR(MYCHAR_MAGIC, 1, size_t)
#define MYCHAR_SET_LEN _IOW(MYCHAR_MAGIC, 2, size_t)

#endif /* _MYCHAR_IOCTL_H */`,
    starter: `#ifndef _MYCHAR_IOCTL_H
#define _MYCHAR_IOCTL_H

#include <linux/ioctl.h>

#define MYCHAR_MAGIC 'k'

// TODO: MYCHAR_RESET, MYCHAR_GET_LEN, MYCHAR_SET_LEN

#endif`,
    tags: ['chardev', 'ioctl', 'macros'],
  },
  {
    id: 'lx-ch08-c-049',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Basic ioctl Handler',
    prompt: `Write \`long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)\` that handles \`MYCHAR_RESET\` and \`MYCHAR_GET_LEN\` for a device whose state is \`static size_t data_len;\`.

Requirements:
- \`MYCHAR_RESET\`: set \`data_len = 0\` and return 0.
- \`MYCHAR_GET_LEN\`: copy \`data_len\` out to the user pointer in \`arg\` using \`copy_to_user((void __user *)arg, &data_len, sizeof(data_len))\`; return \`-EFAULT\` on failure, else 0.
- Any other command: return \`-ENOTTY\` (the conventional "inappropriate ioctl" error).

This is the \`.unlocked_ioctl\` callback signature.`,
    hints: [
      'arg is an unsigned long; cast it to a __user pointer before copying.',
      'Unknown commands must return -ENOTTY, not -EINVAL.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include "mychar_ioctl.h"

static size_t data_len;

long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    switch (cmd) {
    case MYCHAR_RESET:
        data_len = 0;
        return 0;
    case MYCHAR_GET_LEN:
        if (copy_to_user((void __user *)arg, &data_len, sizeof(data_len)))
            return -EFAULT;
        return 0;
    default:
        return -ENOTTY;
    }
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include "mychar_ioctl.h"

static size_t data_len;

long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    switch (cmd) {
    // TODO: MYCHAR_RESET, MYCHAR_GET_LEN, default -ENOTTY
    }
    return -ENOTTY;
}`,
    tags: ['chardev', 'ioctl', 'copy_to_user'],
  },
  {
    id: 'lx-ch08-c-050',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'ioctl That Reads An Int From User',
    prompt: `Extend an ioctl handler to support \`MYCHAR_SET_LEN\` which sets \`data_len\` from a user-supplied \`size_t\`. Write the case body.

Context: \`static char kbuf[4096]; static size_t data_len;\` and \`unsigned long arg\` holds a pointer to a user \`size_t\`.

Requirements:
- Use \`copy_from_user(&newlen, (void __user *)arg, sizeof(newlen))\`; return \`-EFAULT\` on failure.
- Reject values larger than \`sizeof(kbuf)\` with \`-EINVAL\`.
- Otherwise set \`data_len = newlen\` and return 0.`,
    hints: [
      'Validate the value AFTER copying it in — never trust user input.',
      'Range errors use -EINVAL; faults use -EFAULT.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include "mychar_ioctl.h"

static char kbuf[4096];
static size_t data_len;

long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    size_t newlen;

    switch (cmd) {
    case MYCHAR_SET_LEN:
        if (copy_from_user(&newlen, (void __user *)arg, sizeof(newlen)))
            return -EFAULT;
        if (newlen > sizeof(kbuf))
            return -EINVAL;
        data_len = newlen;
        return 0;
    default:
        return -ENOTTY;
    }
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include "mychar_ioctl.h"

static char kbuf[4096];
static size_t data_len;

long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    size_t newlen;

    switch (cmd) {
    case MYCHAR_SET_LEN:
        // TODO: copy_from_user, validate <= sizeof(kbuf), set data_len
        return 0;
    default:
        return -ENOTTY;
    }
}`,
    tags: ['chardev', 'ioctl', 'copy_from_user'],
  },
  {
    id: 'lx-ch08-c-051',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'llseek For A Fixed-Size Device',
    prompt: `Write \`loff_t my_llseek(struct file *file, loff_t off, int whence)\` for a device backed by a fixed-size buffer of \`BUFSZ\` bytes.

Requirements:
- Handle \`SEEK_SET\` (newpos = off), \`SEEK_CUR\` (newpos = file->f_pos + off), and \`SEEK_END\` (newpos = BUFSZ + off).
- Return \`-EINVAL\` for an unknown whence or if \`newpos < 0\`.
- On success, store \`file->f_pos = newpos\` and return \`newpos\`.

Note: do NOT use \`generic_file_llseek\`; implement the arithmetic yourself.`,
    hints: [
      'whence selects the base: start, current position, or end.',
      'Reject negative results; clamping past the end is fine for many devices but a negative pos is always invalid.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/errno.h>

#define BUFSZ 4096

loff_t my_llseek(struct file *file, loff_t off, int whence)
{
    loff_t newpos;

    switch (whence) {
    case SEEK_SET: newpos = off; break;
    case SEEK_CUR: newpos = file->f_pos + off; break;
    case SEEK_END: newpos = BUFSZ + off; break;
    default:       return -EINVAL;
    }

    if (newpos < 0)
        return -EINVAL;

    file->f_pos = newpos;
    return newpos;
}`,
    starter: `#include <linux/fs.h>
#include <linux/errno.h>

#define BUFSZ 4096

loff_t my_llseek(struct file *file, loff_t off, int whence)
{
    loff_t newpos;

    switch (whence) {
    // TODO: SEEK_SET / SEEK_CUR / SEEK_END / default -EINVAL
    }

    // TODO: reject newpos < 0, store f_pos, return newpos
    return 0;
}`,
    tags: ['chardev', 'llseek', 'f_pos'],
  },
  {
    id: 'lx-ch08-c-052',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A read That Counts Per-Open Calls',
    prompt: `Combine private_data with read. A \`struct my_ctx { unsigned long reads; }\` lives in \`file->private_data\`. Write \`ssize_t my_read(...)\` that returns the fixed string \`"hi\\n"\` once, then EOF, and bumps the per-open read counter every call.

Requirements:
- Increment \`ctx->reads\` on every entry.
- The payload is \`static const char msg[] = "hi\\n";\` of length 3.
- If \`*ppos >= 3\`, return 0 (EOF). Otherwise clamp count, \`copy_to_user\`, advance \`*ppos\`, return bytes.
- Return \`-EFAULT\` if the copy faults.`,
    hints: [
      'Pull ctx from file->private_data at the top.',
      'Count reads even on the EOF call, since the program still issued a read().',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct my_ctx { unsigned long reads; };
static const char msg[] = "hi\\n";

ssize_t my_read(struct file *file, char __user *buf,
                size_t count, loff_t *ppos)
{
    struct my_ctx *ctx = file->private_data;

    ctx->reads++;

    if (*ppos >= 3)
        return 0;

    if (count > 3 - *ppos)
        count = 3 - *ppos;

    if (copy_to_user(buf, msg + *ppos, count))
        return -EFAULT;

    *ppos += count;
    return count;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct my_ctx { unsigned long reads; };
static const char msg[] = "hi\\n";

ssize_t my_read(struct file *file, char __user *buf,
                size_t count, loff_t *ppos)
{
    struct my_ctx *ctx = file->private_data;
    // TODO: bump ctx->reads; EOF at *ppos>=3; clamp; copy_to_user; advance
    return 0;
}`,
    tags: ['chardev', 'read', 'private_data'],
  },
  {
    id: 'lx-ch08-c-053',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Append-Only Write Honoring O_APPEND',
    prompt: `Write \`ssize_t my_write(...)\` for a log-style device with \`static char kbuf[4096]; static size_t data_len;\`. If the file was opened with \`O_APPEND\`, ignore \`*ppos\` and always write at the current end.

Requirements:
- If \`file->f_flags & O_APPEND\`, set \`*ppos = data_len\` before writing.
- Then clamp \`count\` to remaining space, return \`-ENOSPC\` if none, \`copy_from_user\`, advance \`*ppos\`, grow \`data_len\`.
- Return bytes written or \`-EFAULT\` on a faulting copy.`,
    hints: [
      'O_APPEND lives in file->f_flags.',
      'For append, force the offset to data_len so concurrent writers extend the log.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include <linux/fcntl.h>

static char kbuf[4096];
static size_t data_len;

ssize_t my_write(struct file *file, const char __user *buf,
                 size_t count, loff_t *ppos)
{
    if (file->f_flags & O_APPEND)
        *ppos = data_len;

    if (*ppos >= sizeof(kbuf))
        return -ENOSPC;

    if (count > sizeof(kbuf) - *ppos)
        count = sizeof(kbuf) - *ppos;

    if (copy_from_user(kbuf + *ppos, buf, count))
        return -EFAULT;

    *ppos += count;
    if (*ppos > data_len)
        data_len = *ppos;
    return count;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include <linux/fcntl.h>

static char kbuf[4096];
static size_t data_len;

ssize_t my_write(struct file *file, const char __user *buf,
                 size_t count, loff_t *ppos)
{
    // TODO: if O_APPEND set *ppos = data_len; then clamp/copy/advance/grow
    return 0;
}`,
    tags: ['chardev', 'write', 'o_append'],
  },
  {
    id: 'lx-ch08-c-054',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Use register_chrdev For A Quick Driver',
    prompt: `For small drivers the legacy \`register_chrdev()\` combines number allocation and cdev setup. Write \`mychar_init\`/\`mychar_exit\` using it.

Requirements:
- In init, call \`register_chrdev(0, "mychar", &my_fops)\` (major 0 means "pick one"); it returns the chosen major or a negative errno.
- Save the major in \`static int my_major;\`. Return the errno on failure, else 0.
- In exit, call \`unregister_chrdev(my_major, "mychar")\`.`,
    hints: [
      'register_chrdev returns the allocated major when you pass 0.',
      'unregister_chrdev needs the same major and name you registered with.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/module.h>
#include <linux/kernel.h>

static int my_major;
static const struct file_operations my_fops;

int mychar_init(void)
{
    int ret = register_chrdev(0, "mychar", &my_fops);
    if (ret < 0)
        return ret;
    my_major = ret;
    pr_info("mychar: major=%d\\n", my_major);
    return 0;
}

void mychar_exit(void)
{
    unregister_chrdev(my_major, "mychar");
}`,
    starter: `#include <linux/fs.h>
#include <linux/module.h>
#include <linux/kernel.h>

static int my_major;
static const struct file_operations my_fops;

int mychar_init(void)
{
    // TODO: register_chrdev(0, "mychar", &my_fops), capture major
    return 0;
}

void mychar_exit(void)
{
    // TODO: unregister_chrdev(my_major, "mychar")
}`,
    tags: ['chardev', 'register_chrdev', 'major'],
  },
  {
    id: 'lx-ch08-c-055',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Auto-Create /dev Node With A Class',
    prompt: `So users do not need \`mknod\`, create a device class and node from the driver. Write the snippet that, given \`dev_t my_dev\`, creates them.

Globals: \`static struct class *my_class;\`.

Requirements:
- Create the class: \`my_class = class_create(THIS_MODULE, "mychar");\` and check with \`IS_ERR()\`.
- Create the node: \`device_create(my_class, NULL, my_dev, NULL, "mychar0");\` which makes \`/dev/mychar0\`.
- Return \`PTR_ERR(my_class)\` if class creation fails (you may assume earlier steps succeeded).`,
    hints: [
      'class_create returns an ERR_PTR on failure — test with IS_ERR, extract with PTR_ERR.',
      'device_create with udev present produces the /dev node automatically.',
    ],
    solution: `#include <linux/device.h>
#include <linux/fs.h>
#include <linux/err.h>
#include <linux/module.h>

static struct class *my_class;

int mychar_make_node(dev_t my_dev)
{
    my_class = class_create(THIS_MODULE, "mychar");
    if (IS_ERR(my_class))
        return PTR_ERR(my_class);

    device_create(my_class, NULL, my_dev, NULL, "mychar0");
    return 0;
}`,
    starter: `#include <linux/device.h>
#include <linux/fs.h>
#include <linux/err.h>
#include <linux/module.h>

static struct class *my_class;

int mychar_make_node(dev_t my_dev)
{
    // TODO: class_create + IS_ERR check, then device_create "mychar0"
    return 0;
}`,
    tags: ['chardev', 'class', 'device_create'],
  },
  {
    id: 'lx-ch08-c-056',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Destroy The /dev Node And Class',
    prompt: `Write \`void mychar_drop_node(dev_t my_dev)\` that tears down the class and node created by \`device_create\`/\`class_create\`, using \`static struct class *my_class;\`.

Requirements:
- Call \`device_destroy(my_class, my_dev)\` first to remove \`/dev/mychar0\`.
- Then \`class_destroy(my_class)\`.
- Order matters: the device must go before its class.`,
    hints: [
      'device_destroy() reverses device_create(); class_destroy() reverses class_create().',
      'Remove the device node before destroying the class it belongs to.',
    ],
    solution: `#include <linux/device.h>
#include <linux/fs.h>

static struct class *my_class;

void mychar_drop_node(dev_t my_dev)
{
    device_destroy(my_class, my_dev);
    class_destroy(my_class);
}`,
    starter: `#include <linux/device.h>
#include <linux/fs.h>

static struct class *my_class;

void mychar_drop_node(dev_t my_dev)
{
    // TODO: device_destroy then class_destroy
}`,
    tags: ['chardev', 'class', 'cleanup'],
  },
  {
    id: 'lx-ch08-c-057',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read From A Kernel String With simple_read_from_buffer',
    prompt: `When you back a device with a fixed in-kernel buffer, \`simple_read_from_buffer()\` handles offset, clamping, and copy_to_user for you. Write \`my_read\` using it.

Context: \`static const char msg[] = "kernel says hi\\n";\` and its length \`sizeof(msg) - 1\`.

Requirements:
- Call \`simple_read_from_buffer(buf, count, ppos, msg, sizeof(msg) - 1)\` and return its result directly.
- It returns the number of bytes copied, 0 at EOF, or a negative errno.`,
    hints: [
      'simple_read_from_buffer(to, count, ppos, from, available).',
      'It already advances *ppos and stops at EOF, so you just forward the return value.',
    ],
    solution: `#include <linux/fs.h>

static const char msg[] = "kernel says hi\\n";

ssize_t my_read(struct file *file, char __user *buf,
                size_t count, loff_t *ppos)
{
    return simple_read_from_buffer(buf, count, ppos,
                                   msg, sizeof(msg) - 1);
}`,
    starter: `#include <linux/fs.h>

static const char msg[] = "kernel says hi\\n";

ssize_t my_read(struct file *file, char __user *buf,
                size_t count, loff_t *ppos)
{
    // TODO: return simple_read_from_buffer(...)
    return 0;
}`,
    tags: ['chardev', 'read', 'simple_read_from_buffer'],
  },
  {
    id: 'lx-ch08-c-058',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Write Into A Buffer With simple_write_to_buffer',
    prompt: `Mirror the previous problem for writes. A device captures up to \`sizeof(kbuf)\` bytes into \`static char kbuf[256]; static size_t data_len;\`. Write \`my_write\` with \`simple_write_to_buffer()\`.

Requirements:
- Call \`ssize_t n = simple_write_to_buffer(kbuf, sizeof(kbuf), ppos, buf, count);\`.
- If \`n > 0\` and \`*ppos > data_len\`, update \`data_len = *ppos\`.
- Return \`n\` (it may be a negative errno).`,
    hints: [
      'simple_write_to_buffer(to, available, ppos, from, count).',
      'It clamps to the buffer size and advances *ppos for you.',
    ],
    solution: `#include <linux/fs.h>

static char kbuf[256];
static size_t data_len;

ssize_t my_write(struct file *file, const char __user *buf,
                 size_t count, loff_t *ppos)
{
    ssize_t n = simple_write_to_buffer(kbuf, sizeof(kbuf),
                                       ppos, buf, count);
    if (n > 0 && (size_t)*ppos > data_len)
        data_len = *ppos;
    return n;
}`,
    starter: `#include <linux/fs.h>

static char kbuf[256];
static size_t data_len;

ssize_t my_write(struct file *file, const char __user *buf,
                 size_t count, loff_t *ppos)
{
    // TODO: simple_write_to_buffer, update data_len, return n
    return 0;
}`,
    tags: ['chardev', 'write', 'simple_write_to_buffer'],
  },
  {
    id: 'lx-ch08-c-059',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reject Write-Only And Read-Only Opens',
    prompt: `A sensor device is read-only. Write \`int my_open(struct inode *inode, struct file *file)\` that refuses any open that requests write access.

Requirements:
- Inspect the access mode with \`(file->f_mode & FMODE_WRITE)\`.
- If write is requested, return \`-EACCES\` (permission denied).
- Otherwise return 0.

Use \`f_mode\` (not \`f_flags\`) to test the resolved read/write capability.`,
    hints: [
      'FMODE_READ / FMODE_WRITE in file->f_mode reflect how the file was opened.',
      'A read-only device returns -EACCES when write access is requested.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/errno.h>

int my_open(struct inode *inode, struct file *file)
{
    if (file->f_mode & FMODE_WRITE)
        return -EACCES;
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/errno.h>

int my_open(struct inode *inode, struct file *file)
{
    // TODO: reject FMODE_WRITE with -EACCES, else 0
    return 0;
}`,
    tags: ['chardev', 'open', 'f_mode'],
  },
  {
    id: 'lx-ch08-c-060',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Truncate Buffer On O_TRUNC Open',
    prompt: `Write \`int my_open(struct inode *inode, struct file *file)\` that resets a device's logical length when opened with \`O_TRUNC\` for writing.

Context: \`static size_t data_len;\`.

Requirements:
- If \`(file->f_flags & O_TRUNC) && (file->f_mode & FMODE_WRITE)\`, set \`data_len = 0\`.
- Always return 0.

This mimics how opening a regular file with O_TRUNC empties it.`,
    hints: [
      'O_TRUNC is in f_flags; whether write was granted is in f_mode.',
      'Only truncate when both write access and O_TRUNC are present.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/fcntl.h>

static size_t data_len;

int my_open(struct inode *inode, struct file *file)
{
    if ((file->f_flags & O_TRUNC) && (file->f_mode & FMODE_WRITE))
        data_len = 0;
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/fcntl.h>

static size_t data_len;

int my_open(struct inode *inode, struct file *file)
{
    // TODO: if O_TRUNC and write access, data_len = 0
    return 0;
}`,
    tags: ['chardev', 'open', 'o_trunc'],
  },
  {
    id: 'lx-ch08-c-061',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Container_of From cdev To Driver Struct',
    prompt: `Your driver embeds the cdev inside its own struct: \`struct mydev { struct cdev cdev; char buf[256]; size_t len; };\`. Write \`int my_open(struct inode *inode, struct file *file)\` that recovers the \`struct mydev\` from the inode and stores it in private_data.

Requirements:
- The inode carries the embedded cdev as \`inode->i_cdev\`.
- Use \`container_of(inode->i_cdev, struct mydev, cdev)\` to get the enclosing struct.
- Save it to \`file->private_data\` and return 0.`,
    hints: [
      'inode->i_cdev points at the cdev that was registered for this device.',
      'container_of(ptr, type, member) walks back from a member to its container.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/kernel.h>

struct mydev { struct cdev cdev; char buf[256]; size_t len; };

int my_open(struct inode *inode, struct file *file)
{
    struct mydev *dev = container_of(inode->i_cdev,
                                     struct mydev, cdev);
    file->private_data = dev;
    return 0;
}`,
    starter: `#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/kernel.h>

struct mydev { struct cdev cdev; char buf[256]; size_t len; };

int my_open(struct inode *inode, struct file *file)
{
    // TODO: container_of(inode->i_cdev, struct mydev, cdev) -> private_data
    return 0;
}`,
    tags: ['chardev', 'container_of', 'cdev'],
  },
  {
    id: 'lx-ch08-c-062',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Read From A Per-Device Embedded Buffer',
    prompt: `Building on the embedded-cdev pattern, write \`ssize_t my_read(...)\` that reads from the \`struct mydev\` stored in \`file->private_data\` (fields: \`char buf[256]; size_t len;\`).

Requirements:
- Recover \`struct mydev *dev = file->private_data;\`.
- EOF when \`*ppos >= dev->len\`.
- Clamp \`count\` to \`dev->len - *ppos\`, \`copy_to_user(buf, dev->buf + *ppos, count)\`, return \`-EFAULT\` on fault.
- Advance \`*ppos\` and return the byte count.`,
    hints: [
      'private_data already points at the per-device struct (set in open).',
      'Treat dev->len as the valid data length, dev->buf as storage.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct mydev { struct cdev cdev; char buf[256]; size_t len; };

ssize_t my_read(struct file *file, char __user *ubuf,
                size_t count, loff_t *ppos)
{
    struct mydev *dev = file->private_data;

    if (*ppos >= dev->len)
        return 0;

    if (count > dev->len - *ppos)
        count = dev->len - *ppos;

    if (copy_to_user(ubuf, dev->buf + *ppos, count))
        return -EFAULT;

    *ppos += count;
    return count;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct mydev { struct cdev cdev; char buf[256]; size_t len; };

ssize_t my_read(struct file *file, char __user *ubuf,
                size_t count, loff_t *ppos)
{
    struct mydev *dev = file->private_data;
    // TODO: EOF vs dev->len, clamp, copy_to_user(dev->buf + *ppos), advance
    return 0;
}`,
    tags: ['chardev', 'read', 'private_data'],
  },
  {
    id: 'lx-ch08-c-063',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Serialize Access With A Mutex',
    prompt: `Two concurrent writers must not corrupt a shared buffer. Add a \`struct mutex lock;\` to \`struct mydev\` and write \`my_write\` that holds it across the copy.

Context fields: \`struct mutex lock; char buf[256]; size_t len;\`. The mutex is already \`mutex_init\`'d at setup.

Requirements:
- Recover \`dev\` from \`file->private_data\`.
- Take \`mutex_lock_interruptible(&dev->lock)\`; if it returns nonzero, return \`-ERESTARTSYS\`.
- Inside the lock: clamp \`count\` to remaining space, \`copy_from_user\`, advance \`*ppos\`/\`len\`.
- Unlock before returning in BOTH the fault and success paths; return \`-EFAULT\` or the byte count.`,
    hints: [
      'mutex_lock_interruptible lets a blocked process be woken by a signal; return -ERESTARTSYS then.',
      'copy_from_user can sleep/fault — that is fine while holding a mutex (a sleeping lock), but you must unlock on every exit path.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/mutex.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct mydev { struct mutex lock; char buf[256]; size_t len; };

ssize_t my_write(struct file *file, const char __user *ubuf,
                 size_t count, loff_t *ppos)
{
    struct mydev *dev = file->private_data;
    ssize_t ret;

    if (mutex_lock_interruptible(&dev->lock))
        return -ERESTARTSYS;

    if (*ppos >= sizeof(dev->buf)) {
        ret = -ENOSPC;
        goto out;
    }
    if (count > sizeof(dev->buf) - *ppos)
        count = sizeof(dev->buf) - *ppos;

    if (copy_from_user(dev->buf + *ppos, ubuf, count)) {
        ret = -EFAULT;
        goto out;
    }

    *ppos += count;
    if (*ppos > dev->len)
        dev->len = *ppos;
    ret = count;
out:
    mutex_unlock(&dev->lock);
    return ret;
}`,
    starter: `#include <linux/fs.h>
#include <linux/mutex.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct mydev { struct mutex lock; char buf[256]; size_t len; };

ssize_t my_write(struct file *file, const char __user *ubuf,
                 size_t count, loff_t *ppos)
{
    struct mydev *dev = file->private_data;
    ssize_t ret;
    // TODO: mutex_lock_interruptible (-ERESTARTSYS), clamp/copy, unlock on all paths
    return 0;
}`,
    tags: ['chardev', 'mutex', 'write'],
  },
  {
    id: 'lx-ch08-c-064',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'ioctl With Bounds-Checked _IOC Decoding',
    prompt: `Write a robust \`my_ioctl\` prologue that validates \`cmd\` before dispatching, then handles \`MYCHAR_RESET\`.

Requirements:
- Reject commands whose magic is wrong: \`if (_IOC_TYPE(cmd) != MYCHAR_MAGIC) return -ENOTTY;\`.
- For directions that touch user memory, verify access: if \`_IOC_DIR(cmd) & _IOC_READ\`, the kernel writes to user, so check the user buffer; in modern kernels \`copy_to_user\` already checks, but validate the magic and number here.
- Reject out-of-range numbers: \`if (_IOC_NR(cmd) > MYCHAR_MAXNR) return -ENOTTY;\` (assume \`#define MYCHAR_MAXNR 2\`).
- Then \`switch (cmd)\` and handle \`MYCHAR_RESET\` (set \`data_len = 0\`, return 0); default \`-ENOTTY\`.`,
    hints: [
      '_IOC_TYPE / _IOC_NR / _IOC_DIR extract the magic, number, and direction from cmd.',
      'Validating the magic and number range up front is the standard defensive ioctl prologue.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/errno.h>
#include "mychar_ioctl.h"

#define MYCHAR_MAXNR 2

static size_t data_len;

long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    if (_IOC_TYPE(cmd) != MYCHAR_MAGIC)
        return -ENOTTY;
    if (_IOC_NR(cmd) > MYCHAR_MAXNR)
        return -ENOTTY;

    switch (cmd) {
    case MYCHAR_RESET:
        data_len = 0;
        return 0;
    default:
        return -ENOTTY;
    }
}`,
    starter: `#include <linux/fs.h>
#include <linux/errno.h>
#include "mychar_ioctl.h"

#define MYCHAR_MAXNR 2

static size_t data_len;

long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    // TODO: check _IOC_TYPE magic and _IOC_NR range, then switch on cmd
    return -ENOTTY;
}`,
    tags: ['chardev', 'ioctl', 'validation'],
  },
  {
    id: 'lx-ch08-c-065',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Ring-Buffer Read With Wraparound',
    prompt: `Implement \`ssize_t my_read(...)\` for a circular buffer device. State in \`file->private_data\`: \`struct fifo { char buf[256]; unsigned head, tail; };\` where \`head\` is the write index and \`tail\` the read index (count = head - tail, modular). Assume single-threaded for this exercise; ignore \`*ppos\` (a FIFO is non-seekable).

Requirements:
- Compute available bytes \`avail = dev->head - dev->tail\`; if 0, return 0.
- Read up to \`min(count, avail)\` bytes, copying one byte at a time through \`(dev->tail) % 256\`, into a small kernel staging array, then \`copy_to_user\` the whole chunk at once.
- Advance \`dev->tail\` by the number copied and return it; \`-EFAULT\` on copy failure.`,
    hints: [
      'Stage bytes into a local array using modular indexing, then a single copy_to_user.',
      'Using unsigned head/tail makes (head - tail) wrap correctly as the count.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include <linux/minmax.h>

struct fifo { char buf[256]; unsigned head, tail; };

ssize_t my_read(struct file *file, char __user *ubuf,
                size_t count, loff_t *ppos)
{
    struct fifo *dev = file->private_data;
    unsigned avail = dev->head - dev->tail;
    char tmp[256];
    size_t n, i;

    if (avail == 0)
        return 0;

    n = min_t(size_t, count, avail);
    for (i = 0; i < n; i++)
        tmp[i] = dev->buf[(dev->tail + i) % 256];

    if (copy_to_user(ubuf, tmp, n))
        return -EFAULT;

    dev->tail += n;
    return n;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include <linux/minmax.h>

struct fifo { char buf[256]; unsigned head, tail; };

ssize_t my_read(struct file *file, char __user *ubuf,
                size_t count, loff_t *ppos)
{
    struct fifo *dev = file->private_data;
    // TODO: avail = head - tail; stage min(count,avail) bytes modulo 256; copy_to_user; advance tail
    return 0;
}`,
    tags: ['chardev', 'read', 'ringbuffer'],
  },
  {
    id: 'lx-ch08-c-066',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Ring-Buffer Write With Overflow Rejection',
    prompt: `Implement \`ssize_t my_write(...)\` for the same FIFO (\`struct fifo { char buf[256]; unsigned head, tail; }\`). Reject writes that would overflow rather than overwriting unread data. Single-threaded; ignore \`*ppos\`.

Requirements:
- Compute free space: \`space = 256 - (dev->head - dev->tail)\`. If \`space == 0\`, return \`-ENOSPC\`.
- Write up to \`min(count, space)\` bytes: \`copy_from_user\` into a local array, then store each byte at \`dev->head % 256\`.
- Advance \`dev->head\` and return the number written; \`-EFAULT\` on copy failure.`,
    hints: [
      'Free space is capacity minus the current fill (head - tail).',
      'copy_from_user the chunk first, then scatter it into the ring with modular indices.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include <linux/minmax.h>

struct fifo { char buf[256]; unsigned head, tail; };

ssize_t my_write(struct file *file, const char __user *ubuf,
                 size_t count, loff_t *ppos)
{
    struct fifo *dev = file->private_data;
    unsigned space = 256 - (dev->head - dev->tail);
    char tmp[256];
    size_t n, i;

    if (space == 0)
        return -ENOSPC;

    n = min_t(size_t, count, space);
    if (copy_from_user(tmp, ubuf, n))
        return -EFAULT;

    for (i = 0; i < n; i++)
        dev->buf[(dev->head + i) % 256] = tmp[i];

    dev->head += n;
    return n;
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include <linux/minmax.h>

struct fifo { char buf[256]; unsigned head, tail; };

ssize_t my_write(struct file *file, const char __user *ubuf,
                 size_t count, loff_t *ppos)
{
    struct fifo *dev = file->private_data;
    // TODO: space = 256-(head-tail); -ENOSPC if full; copy_from_user; scatter; advance head
    return 0;
}`,
    tags: ['chardev', 'write', 'ringbuffer'],
  },
  {
    id: 'lx-ch08-c-067',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Allocate N Minors Backed By Per-Device cdevs',
    prompt: `Write \`int mychar_init(void)\` that registers a contiguous range of \`NDEV (=4)\` minors and adds an embedded cdev for each device in \`static struct mydev devices[NDEV];\` (\`struct mydev { struct cdev cdev; };\`).

Requirements:
- \`alloc_chrdev_region(&dev_base, 0, NDEV, "mychar")\`; on failure return errno.
- Loop \`i\` from 0 to NDEV-1: \`cdev_init(&devices[i].cdev, &my_fops)\`, set owner, \`cdev_add(&devices[i].cdev, MKDEV(MAJOR(dev_base), i), 1)\`.
- If a \`cdev_add\` fails at index \`i\`, \`cdev_del\` all already-added (0..i-1), unregister the region, and return the errno.`,
    hints: [
      'Each device gets dev number MKDEV(major, base_minor + i).',
      'On partial failure, delete only the cdevs you actually added before unregistering the region.',
    ],
    solution: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/module.h>
#include <linux/kernel.h>

#define NDEV 4

struct mydev { struct cdev cdev; };
static struct mydev devices[NDEV];
static dev_t dev_base;
static const struct file_operations my_fops;

int mychar_init(void)
{
    int i, ret;

    ret = alloc_chrdev_region(&dev_base, 0, NDEV, "mychar");
    if (ret < 0)
        return ret;

    for (i = 0; i < NDEV; i++) {
        cdev_init(&devices[i].cdev, &my_fops);
        devices[i].cdev.owner = THIS_MODULE;
        ret = cdev_add(&devices[i].cdev,
                       MKDEV(MAJOR(dev_base), i), 1);
        if (ret < 0)
            goto err;
    }
    return 0;

err:
    while (--i >= 0)
        cdev_del(&devices[i].cdev);
    unregister_chrdev_region(dev_base, NDEV);
    return ret;
}`,
    starter: `#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/module.h>
#include <linux/kernel.h>

#define NDEV 4

struct mydev { struct cdev cdev; };
static struct mydev devices[NDEV];
static dev_t dev_base;
static const struct file_operations my_fops;

int mychar_init(void)
{
    int i, ret;
    // TODO: alloc_chrdev_region(NDEV); per-device cdev_init/owner/cdev_add at MKDEV(major,i)
    // TODO: on failure, cdev_del the added ones, unregister region, return ret
    return 0;
}`,
    tags: ['chardev', 'cdev', 'minors'],
  },
  {
    id: 'lx-ch08-c-068',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Grow A Dynamic Buffer On Write',
    prompt: `A device starts with no buffer and grows on demand. State in \`file->private_data\`: \`struct mydev { char *buf; size_t cap; size_t len; };\`. Write \`my_write\` that ensures capacity with \`krealloc\` (or \`kmalloc\` the first time), then appends.

Requirements:
- Compute needed capacity \`need = *ppos + count\`. If \`need > dev->cap\`, \`krealloc(dev->buf, need, GFP_KERNEL)\`; on NULL return \`-ENOMEM\` (do not lose the old pointer — assign to a temp first).
- On success update \`dev->buf\`/\`dev->cap\`.
- \`copy_from_user(dev->buf + *ppos, buf, count)\`; \`-EFAULT\` on fault; advance \`*ppos\`, update \`dev->len\`; return count.`,
    hints: [
      'GFP_KERNEL is allowed: write runs in process context and may sleep.',
      'krealloc returning NULL leaves the original block intact, so stash the result in a temp before overwriting dev->buf.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct mydev { char *buf; size_t cap; size_t len; };

ssize_t my_write(struct file *file, const char __user *ubuf,
                 size_t count, loff_t *ppos)
{
    struct mydev *dev = file->private_data;
    size_t need = *ppos + count;

    if (need > dev->cap) {
        char *tmp = krealloc(dev->buf, need, GFP_KERNEL);
        if (!tmp)
            return -ENOMEM;
        dev->buf = tmp;
        dev->cap = need;
    }

    if (copy_from_user(dev->buf + *ppos, ubuf, count))
        return -EFAULT;

    *ppos += count;
    if ((size_t)*ppos > dev->len)
        dev->len = *ppos;
    return count;
}`,
    starter: `#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/uaccess.h>
#include <linux/errno.h>

struct mydev { char *buf; size_t cap; size_t len; };

ssize_t my_write(struct file *file, const char __user *ubuf,
                 size_t count, loff_t *ppos)
{
    struct mydev *dev = file->private_data;
    // TODO: krealloc to *ppos+count if needed (temp ptr!), copy_from_user, advance, update len
    return 0;
}`,
    tags: ['chardev', 'write', 'krealloc'],
  },
  {
    id: 'lx-ch08-c-069',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full File-Backed Device Module',
    prompt: `Assemble a complete single-device module skeleton (no class) that ties together everything. Provide \`mychar_init\` and \`mychar_exit\` plus the \`module_init/module_exit\` registration. Assume \`my_fops\` and the handlers exist.

Globals: \`static dev_t my_dev; static struct cdev my_cdev; static const struct file_operations my_fops;\`.

Requirements:
- init: \`alloc_chrdev_region\` (1 number, name "mychar"); on failure return errno. Then \`cdev_init\`, set \`.owner\`, \`cdev_add(.., my_dev, 1)\`; if that fails, unregister the region and return errno. Else return 0.
- exit: \`cdev_del\` then \`unregister_chrdev_region(my_dev, 1)\`.
- Register with \`module_init\`/\`module_exit\`, set \`MODULE_LICENSE("GPL")\`.`,
    hints: [
      'This is the canonical chardev lifecycle: number -> cdev -> (use) -> cdev_del -> unregister.',
      'Reverse every init step in exit, and undo partial init on the error path.',
    ],
    solution: `#include <linux/module.h>
#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/kernel.h>

static dev_t my_dev;
static struct cdev my_cdev;
static const struct file_operations my_fops;

static int __init mychar_init(void)
{
    int ret = alloc_chrdev_region(&my_dev, 0, 1, "mychar");
    if (ret < 0)
        return ret;

    cdev_init(&my_cdev, &my_fops);
    my_cdev.owner = THIS_MODULE;

    ret = cdev_add(&my_cdev, my_dev, 1);
    if (ret < 0) {
        unregister_chrdev_region(my_dev, 1);
        return ret;
    }
    pr_info("mychar: ready major=%u\\n", MAJOR(my_dev));
    return 0;
}

static void __exit mychar_exit(void)
{
    cdev_del(&my_cdev);
    unregister_chrdev_region(my_dev, 1);
}

module_init(mychar_init);
module_exit(mychar_exit);
MODULE_LICENSE("GPL");`,
    starter: `#include <linux/module.h>
#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/kernel.h>

static dev_t my_dev;
static struct cdev my_cdev;
static const struct file_operations my_fops;

static int __init mychar_init(void)
{
    // TODO: alloc_chrdev_region; cdev_init/owner/cdev_add; undo on failure
    return 0;
}

static void __exit mychar_exit(void)
{
    // TODO: cdev_del then unregister_chrdev_region
}

// TODO: module_init / module_exit / MODULE_LICENSE`,
    tags: ['chardev', 'module', 'lifecycle'],
  },
  {
    id: 'lx-ch08-c-070',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'ioctl Returning A Struct To User Space',
    prompt: `Define and handle an ioctl that returns device statistics in one struct. The command transfers a \`struct mychar_stats { __u64 bytes_read; __u64 bytes_written; }\` from kernel to user.

Requirements:
- Define \`#define MYCHAR_STATS _IOR(MYCHAR_MAGIC, 3, struct mychar_stats)\` (magic \`'k'\`).
- In \`my_ioctl\`, on \`MYCHAR_STATS\` build a local \`struct mychar_stats st\` from globals \`static u64 g_read, g_written;\`, then \`copy_to_user((void __user *)arg, &st, sizeof(st))\`; return \`-EFAULT\` on failure, else 0.
- Unknown commands return \`-ENOTTY\`.`,
    hints: [
      '_IOR with a struct type encodes the struct size into the command number.',
      'Fill a kernel-side struct first, then copy the whole thing out in one copy_to_user.',
    ],
    solution: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include <linux/types.h>
#include <linux/ioctl.h>

#define MYCHAR_MAGIC 'k'

struct mychar_stats {
    __u64 bytes_read;
    __u64 bytes_written;
};

#define MYCHAR_STATS _IOR(MYCHAR_MAGIC, 3, struct mychar_stats)

static u64 g_read, g_written;

long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    struct mychar_stats st;

    switch (cmd) {
    case MYCHAR_STATS:
        st.bytes_read = g_read;
        st.bytes_written = g_written;
        if (copy_to_user((void __user *)arg, &st, sizeof(st)))
            return -EFAULT;
        return 0;
    default:
        return -ENOTTY;
    }
}`,
    starter: `#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/errno.h>
#include <linux/types.h>
#include <linux/ioctl.h>

#define MYCHAR_MAGIC 'k'

struct mychar_stats {
    __u64 bytes_read;
    __u64 bytes_written;
};

// TODO: #define MYCHAR_STATS _IOR(...)

static u64 g_read, g_written;

long my_ioctl(struct file *file, unsigned int cmd, unsigned long arg)
{
    struct mychar_stats st;
    // TODO: handle MYCHAR_STATS (fill st, copy_to_user), default -ENOTTY
    return -ENOTTY;
}`,
    tags: ['chardev', 'ioctl', 'copy_to_user'],
  },
]

export default problems
