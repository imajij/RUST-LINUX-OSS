import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-13',
  track: 'linux',
  chapter: 13,
  title: 'The Device Model & sysfs',
  summary: `The Linux device model is the unified, object-oriented skeleton that lets the kernel answer questions like which devices exist, what driver owns each one, which bus they sit on, who depends on whom for power management, and how all of this is presented to user space. Its atom is the kobject - a reference-counted node that gives every device a name, a parent, and a directory in the sysfs virtual filesystem mounted at /sys. On top of kobjects the model builds buses, devices, and drivers, with a matching-and-probing dance that binds a driver to the hardware it can handle; the platform bus and device tree are how non-discoverable SoC hardware gets enumerated, and udev is the user-space half that reacts to the events the model emits. Understanding this layer is essential for any real driver work and for the Rust-for-Linux abstractions (Device, Driver, platform::Driver, of::IdTable) that wrap exactly these C structures.`,
  sections: [
    {
      heading: 'Why a device model exists at all',
      body: `Before the 2.6 kernel there was no single, coherent picture of the hardware in a running system. Each bus subsystem - PCI, USB, and so on - kept its own private list of devices, in its own format, with its own ad hoc procfs files. That worked until features arrived that needed to reason about *all* hardware at once and about the *relationships* between pieces of hardware.

The driver that forced the issue was power management. To suspend a laptop correctly you must power devices down in an order that respects dependencies: you cannot power off a USB host controller before the USB mouse hanging off it, and you must bring them back in the reverse order on resume. Answering "what is the parent of this device, and what hangs off it" requires a single tree that spans every bus. Hotplug (devices appearing and disappearing at runtime) had the same need: something has to notice the change and tell user space.

The **device model** is that single, unified tree. Its goals are worth stating because they explain every design choice that follows:

- **One representation** of every device, driver, and bus, with explicit parent/child links forming a global tree.
- **Reference counting** so an object stays alive exactly as long as something points at it, and is freed the instant the last reference drops - critical when hardware can vanish mid-operation.
- **A window for user space** so tools can enumerate hardware and react to changes without parsing a dozen bespoke procfs formats. That window is sysfs.

Hold onto this framing: sysfs is not the point, it is a *side effect*. The point is the in-kernel object graph; sysfs is simply that graph projected onto a filesystem so user space can see it.`,
      code: [
        {
          lang: 'c',
          src: `// The device model surfaces as the /sys tree. A few real paths:
//
//   /sys/devices/...     the canonical tree: every device by topology
//   /sys/bus/<bus>/      one dir per registered bus type
//   /sys/bus/<bus>/devices/   devices on that bus (symlinks into /sys/devices)
//   /sys/bus/<bus>/drivers/   drivers registered for that bus
//   /sys/class/<class>/  devices grouped by FUNCTION, not by topology
//   /sys/module/<name>/  one dir per loaded module
//
// Example: a platform UART might appear as
//   /sys/devices/platform/serial8250/...
// and ALSO be reachable as
//   /sys/bus/platform/devices/serial8250 -> ../../../devices/platform/serial8250
//
// The /sys/devices path is the real object; the others are symlinked views.`
        }
      ]
    },
    {
      heading: 'kobject: the atom of the model',
      body: `Everything in the device model is built from one tiny structure: the **kobject**. A kobject is not interesting on its own; it is a building block you *embed* inside a larger, meaningful structure (a device, a bus, a driver). Embedding rather than pointing-to is the central idiom, and the container_of macro is how you walk back from the embedded kobject to the structure that owns it.

A kobject carries four things that matter:

1. A **name**, which becomes the name of its directory in sysfs.
2. A **parent** pointer, which determines where in the sysfs tree the directory is created. The parent links are what build the global device tree.
3. A **reference count** (a kref). kobject_get increments it, kobject_put decrements it, and when it hits zero the object is released. You almost never call the destructor yourself; you balance gets with puts and let the count drive lifetime.
4. A pointer to a **ktype** (the kobj_type), which supplies the object's behavior - crucially the function that frees it.

### Why reference counting is non-negotiable

Hardware can be removed at any instant - unplug a USB stick mid-copy. If user space still holds an open file referring to that device, the in-kernel object must not be freed yet, or every later access is a use-after-free. The kref makes correctness mechanical: anything that takes a lasting pointer to a kobject does a kobject_get, and releases it with kobject_put when done. The object survives precisely as long as some reference exists.

### The release pitfall that trips everyone

When the count reaches zero the kobject's ktype->release is called. That release function is responsible for freeing the *whole containing structure*, typically with a container_of followed by kfree. This leads to the most important rule of the model: **the memory that holds an embedded kobject must be dynamically allocated and freed only by the release callback - never with a plain kfree elsewhere, and never on the stack.** A common bug is to kfree the containing struct directly, bypassing the refcount, while another reference still lives. Another is forgetting to provide a release at all, which the kernel will warn about loudly because it means a guaranteed leak or, worse, freeing-by-other-means.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/kobject.h>
#include <linux/slab.h>

// Embed the kobject inside your own meaningful structure.
struct my_obj {
    int            value;
    struct kobject kobj;     // EMBEDDED, not a pointer
};

// container_of walks from the embedded member back to the owner.
#define to_my_obj(k) container_of(k, struct my_obj, kobj)

// The release MUST free the whole containing object. It is called
// by the refcount machinery when the LAST reference is dropped.
static void my_obj_release(struct kobject *kobj)
{
    struct my_obj *m = to_my_obj(kobj);
    kfree(m);                // free the container, never the kobj alone
}

// Lifetime is driven by the count, not by manual frees:
//   kobject_get(&m->kobj);   // take a reference
//   kobject_put(&m->kobj);   // drop one; release() runs at zero
//
// NEVER do: kfree(m);  while a reference may still exist.
// NEVER embed a kobject in a stack or static object you free directly.`
        }
      ]
    },
    {
      heading: 'ktype and kset: behavior and grouping',
      body: `A bare kobject needs two companions to be useful: a **ktype** that says how it behaves, and usually a **kset** that says where it belongs.

### ktype - the kobject's class of behavior

The **kobj_type** (ktype) is shared by all kobjects of the same kind and supplies their behavior. Its three important members are:

- **release** - the function that frees the containing object when the refcount hits zero. This is mandatory; without it the kernel cannot clean up.
- **sysfs_ops** - the pair of functions (show and store) that are called whenever user space reads or writes any attribute file belonging to this kobject. This is the bridge between a file in /sys and your C code.
- **default_attrs / default_groups** - the set of attribute files that should automatically appear in the kobject's sysfs directory when it is created.

The reason behavior lives in a shared ktype rather than per-kobject is economy: a million identical kobjects can share one ktype, so per-object overhead stays tiny.

### kset - a collection of kobjects

A **kset** is a container of related kobjects, and it is itself a kobject (it has its own directory). Two roles make it valuable:

1. It provides the **default parent** for kobjects added to it, so building a coherent subtree is automatic - add a kobject to a kset and its sysfs directory lands inside the kset's directory.
2. It owns the **uevent machinery**. When a kobject in a kset is added, removed, or changed, the kset's uevent_ops can filter the event and add environment variables before the notification is broadcast to user space. This is the hook udev ultimately listens to.

### How they relate

Do not confuse the three. A *kobject* is a single node. A *ktype* describes a kind of node (behavior, shared). A *kset* is a set of nodes (grouping plus event policy, and itself a node). In day-to-day driver work you rarely touch these directly - struct device wraps them - but every bus, class, and device you register is built from exactly this trio, and the Rust abstractions mirror it.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/kobject.h>

// A ktype: shared behavior for one KIND of kobject.
static const struct sysfs_ops my_sysfs_ops = {
    .show  = my_attr_show,    // called on read of any attr file
    .store = my_attr_store,   // called on write of any attr file
};

static struct attribute *my_default_attrs[] = {
    &value_attribute.attr,
    NULL,                     // NULL-terminated array
};
ATTRIBUTE_GROUPS(my_default);   // builds my_default_groups[]

static const struct kobj_type my_ktype = {
    .release        = my_obj_release,   // MANDATORY: frees the container
    .sysfs_ops      = &my_sysfs_ops,    // routes show/store
    .default_groups = my_default_groups,// auto-created attribute files
};

// A kset gives added kobjects a default parent + uevent filtering.
static struct kset *my_kset;

// Create a kset under /sys/kernel/ ; NULL uevent_ops = default behavior.
my_kset = kset_create_and_add("my_kset", NULL, kernel_kobj);

// Add a kobject into it (kset becomes the parent automatically):
//   m->kobj.kset = my_kset;
//   kobject_init_and_add(&m->kobj, &my_ktype, NULL, "name%d", id);`
        }
      ]
    },
    {
      heading: 'sysfs attributes: show and store',
      body: `sysfs exports kobjects as directories; the *files* inside those directories are **attributes**. An attribute is a single, typically small value - a status string, a number, a flag - exposed as a readable and/or writable file. The guiding rule, written into the sysfs documentation, is **one value per file**: a sysfs file should hold a single, simple piece of information, not a parsed multi-field record. Code that wants to dump complex structured data belongs in debugfs or a chardev, not sysfs.

### show and store

Reading an attribute file calls the kobject's sysfs_ops->show; writing it calls sysfs_ops->store. With the common attribute macros you instead write one show and one store function per attribute:

- **show(dev, attr, buf)** must format the value into buf and return the number of bytes written. The buffer is exactly one page (PAGE_SIZE); you must not overrun it, which is why sysfs_emit exists - it is the bounds-safe formatter you should always prefer over a raw sprintf.
- **store(dev, attr, buf, count)** receives the bytes user space wrote and the count, parses them (typically with kstrtoint, kstrtoul, and friends), validates aggressively, applies the change, and returns count on success or a negative error to reject the write. Returning a count shorter than what was written signals a partial write and usually confuses callers - return the full count or an error.

### Why bounds and validation matter so much

A store handler is a direct, root-writable entry point into your driver from user space. Treat every byte as hostile: range-check numbers, reject malformed input with -EINVAL, and never assume the buffer is NUL-terminated in a way you have not verified (it usually is, but rely on the count). On the show side, a single sprintf that overflows the page buffer is a kernel memory corruption; sysfs_emit closes that hole by construction.

### DEVICE_ATTR and friends

You almost never hand-build a struct attribute. The macros do it: DEVICE_ATTR_RW(name) declares a read-write attribute wired to name_show and name_store; DEVICE_ATTR_RO(name) is read-only and needs only name_show; DEVICE_ATTR_WO(name) is write-only. They also set the file's permission bits - and a frequent review comment is a mismatch between declared mode and the handlers actually provided (an RW macro with no store, say). Group related attributes with ATTRIBUTE_GROUPS and hang them off the driver so they are created and destroyed atomically with the device, avoiding the race where a file exists before its backing state does.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/device.h>
#include <linux/sysfs.h>

// --- a read-write attribute named "threshold" ---
static ssize_t threshold_show(struct device *dev,
                              struct device_attribute *attr, char *buf)
{
    struct my_dev *d = dev_get_drvdata(dev);
    // sysfs_emit is bounds-safe against the one-page buffer. Always prefer it.
    return sysfs_emit(buf, "%d\\n", d->threshold);
}

static ssize_t threshold_store(struct device *dev,
                               struct device_attribute *attr,
                               const char *buf, size_t count)
{
    struct my_dev *d = dev_get_drvdata(dev);
    int val, ret;

    ret = kstrtoint(buf, 0, &val);     // robust parse; handles 0x.., trailing \\n
    if (ret)
        return ret;                    // malformed -> propagate error
    if (val < 0 || val > 1000)
        return -EINVAL;                // VALIDATE: reject out-of-range input

    d->threshold = val;
    return count;                      // success: consume the whole write
}
static DEVICE_ATTR_RW(threshold);      // wires threshold_show + threshold_store

// Group attributes so they are created/removed atomically with the device.
static struct attribute *my_attrs[] = {
    &dev_attr_threshold.attr,
    NULL,
};
ATTRIBUTE_GROUPS(my);                   // -> my_groups[]

// Attach via the driver's .dev_groups, or device_add_groups(dev, my_groups).`
        }
      ]
    },
    {
      heading: 'Buses, devices, and drivers',
      body: `On top of kobjects the model defines three first-class abstractions whose interplay is the heart of the chapter.

### bus_type - the meeting place

A **bus** represents a kind of connection - PCI, USB, I2C, SPI, platform - and acts as a registry plus a matchmaker. Every bus_type owns two lists: the **devices** plugged into it and the **drivers** registered to handle them. Its single most important member is the **match** callback. When a new device appears or a new driver registers, the core walks the other list and calls match(device, driver) for each candidate pair. match returns nonzero when this driver claims it can handle this device. The bus is where binding policy lives.

### struct device - a thing that exists

A **device** is any addressable piece of hardware (or a virtual stand-in). It is the device model's universal node: it embeds a kobject, points at its parent device, names the bus it sits on, and carries a driver_data slot for the driver's private state (accessed through dev_get_drvdata / dev_set_drvdata - use these, do not poke the field directly). Real subsystems wrap struct device in a richer type - pci_dev, usb_device, platform_device - and embed the generic device inside, recovered with to_platform_device and similar.

### struct device_driver - code that handles a kind of device

A **driver** is registered against a particular bus and supplies the lifecycle callbacks: probe (bind to a device), remove (unbind), plus shutdown and the power-management hooks. It carries an id table describing which devices it matches - the data the bus's match function consults.

### The binding dance

Binding is symmetric and event-driven. Register a *device* and the core tries every driver already on the bus. Register a *driver* and the core tries every device already present. For each candidate it calls the bus match; on a match it calls the driver's probe; if probe returns success the device and driver are *bound* and a driver symlink appears in sysfs. This two-way search is why driver load order does not matter: whichever shows up second triggers the binding. A subtle, important behavior is **deferred probe**: if probe returns -EPROBE_DEFER (because a resource like a clock or regulator is not ready yet), the core parks the device and retries later once more drivers have loaded - the mechanism that lets a pile of interdependent SoC drivers converge regardless of order.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/device.h>

// A bus is a registry of devices + drivers, plus a matchmaker.
struct bus_type {
    const char *name;
    // Called for each (dev, drv) pair; nonzero => this driver claims it.
    int (*match)(struct device *dev, struct device_driver *drv);
    int (*probe)(struct device *dev);    // optional bus-level wrapper
    // ... uevent, dev_groups, pm, etc.
};

// struct device: the universal node. Simplified.
struct device {
    struct device         *parent;       // builds the topology tree
    struct kobject         kobj;         // embedded: name + sysfs dir + refcount
    const struct bus_type *bus;          // which bus this sits on
    struct device_driver  *driver;       // set by the core once BOUND
    void                  *driver_data;  // use dev_get/set_drvdata, not directly
};

// struct device_driver: code that handles a kind of device.
struct device_driver {
    const char            *name;
    const struct bus_type *bus;          // registered against this bus
    int  (*probe)(struct device *dev);   // BIND: claim and set up the device
    int  (*remove)(struct device *dev);  // UNBIND: tear down, reverse of probe
    void (*shutdown)(struct device *dev);
    // ... of_match_table / id tables consulted by bus->match
};

// Private state belongs in driver_data via the accessors:
//   dev_set_drvdata(dev, mydev);
//   struct my_dev *d = dev_get_drvdata(dev);`
        }
      ]
    },
    {
      heading: 'The platform bus and probe/remove',
      body: `Discoverable buses (PCI, USB) can enumerate themselves: the hardware answers "who are you" over the wire, so the kernel learns vendor and product IDs automatically. Vast amounts of embedded hardware cannot do this. The UART, I2C controller, GPIO block, and timers welded into a system-on-chip have no enumeration protocol - they simply exist at fixed addresses and interrupt lines. The **platform bus** is the pseudo-bus invented for exactly these *non-discoverable* devices. It does not correspond to any physical wiring; it is the catch-all where memory-mapped SoC peripherals live.

### platform_device and platform_driver

A **platform_device** describes one such peripheral: its name, and its **resources** - the register region (IORESOURCE_MEM) and interrupts (IORESOURCE_IRQ) it occupies. A **platform_driver** supplies probe and remove plus the tables used to match. The platform bus's match function tries several strategies in order: an OF (device tree) compatible match, an ACPI match, then a name-based match against an id_table, and finally a plain driver-name comparison.

### probe: where a driver comes alive

When the bus matches a platform_device to your platform_driver it calls your **probe(pdev)**. Probe is where you actually claim and initialize the hardware, and it has a canonical shape:

1. Fetch resources from the platform_device - platform_get_resource for the register window, platform_get_irq for the interrupt (note platform_get_irq returns a negative errno on failure, which you must check, not a zero sentinel).
2. Map and acquire those resources. Strongly prefer the **devm_** (managed) helpers - devm_ioremap_resource, devm_request_irq, devm_clk_get - because every resource they grab is automatically released when the device unbinds. This turns a long, error-prone manual cleanup path into nothing.
3. Allocate your private struct, store it with platform_set_drvdata so remove and other callbacks can find it.
4. Register with the relevant subsystem (input, net, misc, etc.) only at the very end, once everything is ready - because the instant you register, the device is live and callable.
5. Return 0 for success, a negative errno to fail, or **-EPROBE_DEFER** to ask the core to retry later when a dependency appears.

### remove: exact reverse

**remove(pdev)** undoes probe in reverse order: unregister from the subsystem first (stop new calls), then quiesce the hardware. Anything you acquired with devm_ helpers you do *not* free here - the core does it after remove returns. The most common remove bug is double-freeing a devm-managed resource by hand.`,
      code: [
        {
          lang: 'c',
          src: `#include <linux/platform_device.h>
#include <linux/mod_devicetable.h>

static int my_probe(struct platform_device *pdev)
{
    struct device  *dev = &pdev->dev;
    struct my_dev  *d;
    struct resource *res;
    int irq, ret;

    d = devm_kzalloc(dev, sizeof(*d), GFP_KERNEL);   // freed automatically
    if (!d)
        return -ENOMEM;

    // Register window: map with the managed helper (auto-unmapped).
    res = platform_get_resource(pdev, IORESOURCE_MEM, 0);
    d->base = devm_ioremap_resource(dev, res);
    if (IS_ERR(d->base))
        return PTR_ERR(d->base);

    irq = platform_get_irq(pdev, 0);     // returns -errno on failure, not 0
    if (irq < 0)
        return irq;

    d->clk = devm_clk_get(dev, NULL);
    if (IS_ERR(d->clk))
        return PTR_ERR(d->clk);          // could be -EPROBE_DEFER: just return it

    platform_set_drvdata(pdev, d);       // so remove() can recover d

    // Request IRQ and register with a subsystem LAST, when fully ready.
    ret = devm_request_irq(dev, irq, my_isr, 0, "my_dev", d);
    if (ret)
        return ret;

    return 0;                            // bound!
}

static void my_remove(struct platform_device *pdev)
{
    struct my_dev *d = platform_get_drvdata(pdev);
    // Reverse of probe: stop activity. devm_ resources free themselves.
    my_quiesce(d);
}`
        }
      ]
    },
    {
      heading: 'Device tree, OF matching, and udev',
      body: `Two pieces complete the picture: how a non-discoverable device gets *described* in the first place, and how user space *reacts* to everything the model emits.

### The device tree

Because SoC hardware cannot enumerate itself, someone must hand the kernel a description: this UART is at this address with this interrupt and this clock. Historically that description was hard-coded in C "board files," one giant file per board, which did not scale. The **device tree** replaces them. It is a data structure - written as human-readable .dts source, compiled to a flattened .dtb blob, and handed to the kernel by the bootloader - describing the hardware as a tree of *nodes*, each with *properties*. The kernel parses it at boot and, for each node, creates a platform_device populated with the node's resources. The driver code stops caring which board it is on; the data describes the board.

### OF matching with compatible

The crucial property is **compatible**, a list of strings identifying the hardware most-specific first, like "vendor,soc-uart" then a generic "vendor,uart". A driver advertises the strings it supports in an **of_device_id** table referenced by its driver's of_match_table. The platform bus match compares the device node's compatible strings against that table; the first hit binds. Two rules avoid real bugs: terminate the table with an empty sentinel entry, and pair it with MODULE_DEVICE_TABLE(of, ...) so that user-space module autoloading knows which compatible strings should pull in your module. The of_device_id can also carry a data pointer, retrieved in probe with of_device_get_match_data, to fold per-variant differences (register offsets, quirks) into a single driver.

### udev - the user-space reactor

Every time the model adds, removes, or changes a device it broadcasts a **uevent** - a small set of KEY=VALUE strings (ACTION, DEVPATH, SUBSYSTEM, and so on) over a netlink socket. The **udev** daemon listens on that socket. For each event it consults rules in /etc/udev/rules.d and /lib/udev/rules.d and acts: creating the /dev node with the right name, owner, and permissions; creating stable by-id and by-path symlinks; loading firmware; and, via MODALIAS, triggering modprobe to autoload the matching driver module. This is why a freshly plugged USB device "just works": the kernel emits the event, udev matches MODALIAS to a module's device table, loads it, the driver registers, the bus matches, probe runs. The device model and udev are two halves of one loop - the kernel owns the in-kernel object graph and announces changes; udev owns the user-space policy of what to do about them.`,
      code: [
        {
          lang: 'c',
          src: `// --- device tree source (.dts): DATA describing the hardware ---
//   uart0: serial@10000000 {
//       compatible = "myvendor,soc-uart", "myvendor,uart";
//       reg        = <0x10000000 0x1000>;   // base, size -> IORESOURCE_MEM
//       interrupts = <0 42 4>;              // -> IORESOURCE_IRQ
//       clocks     = <&clk_uart>;
//   };

// --- driver side: the OF match table the platform bus consults ---
#include <linux/of.h>
#include <linux/platform_device.h>

static const struct of_device_id my_of_match[] = {
    { .compatible = "myvendor,soc-uart", .data = &soc_variant },
    { .compatible = "myvendor,uart",     .data = &generic_variant },
    { /* sentinel */ }                   // MUST terminate the table
};
MODULE_DEVICE_TABLE(of, my_of_match);    // enables udev/modprobe autoload

static struct platform_driver my_driver = {
    .probe  = my_probe,
    .remove = my_remove,
    .driver = {
        .name           = "my_uart",
        .of_match_table = my_of_match,   // how the bus matches DT nodes
    },
};
module_platform_driver(my_driver);       // boilerplate init/exit registration

// In probe, pull per-variant data chosen by the matched compatible:
//   const struct variant *v = of_device_get_match_data(&pdev->dev);`
        }
      ]
    }
  ],
  takeaways: [
    'The device model is a single, reference-counted, parent/child tree of every device, driver, and bus; sysfs (/sys) is just that in-kernel object graph projected onto a filesystem for user space.',
    'The kobject is the atom: it gives an object a name, a parent (its sysfs location), a refcount that drives lifetime, and a ktype that supplies its release function - embed it and recover the owner with container_of.',
    'Never kfree a struct that embeds a live kobject directly; let the refcount reach zero and free the whole container in ktype->release. Forgetting release is a guaranteed leak the kernel warns about.',
    'A ktype is shared behavior (release + sysfs_ops + default attrs) for a kind of kobject; a kset groups kobjects, gives them a default parent, and owns the uevent filtering hook.',
    'sysfs attributes follow one-value-per-file; implement show with the bounds-safe sysfs_emit, and make store validate aggressively (kstrtoint + range checks) and return count or a negative errno.',
    'A bus owns lists of devices and drivers plus a match callback; registering either a device or a driver triggers a two-way search, so driver load order does not matter, and probe does the actual binding.',
    'The platform bus enumerates non-discoverable SoC hardware; probe claims resources (prefer devm_ helpers for automatic cleanup), registers with a subsystem last, and may return -EPROBE_DEFER to retry when a dependency is missing.',
    'Device tree describes non-discoverable hardware as data; the compatible property plus an of_device_id table (with a sentinel and MODULE_DEVICE_TABLE) is how OF matching binds a driver to a node.',
    'The kernel emits uevents on every add/remove/change; udev listens on netlink and turns them into /dev nodes, symlinks, firmware loads, and modprobe autoload via MODALIAS - the user-space half of the model.'
  ],
  cheatsheet: [
    { label: 'struct kobject', value: 'Refcounted model atom: name + parent + sysfs dir + ktype; embed and use container_of' },
    { label: 'kobject_get / kobject_put', value: 'Take / drop a reference; ktype->release runs and frees the container at zero' },
    { label: 'kobject_init_and_add', value: 'Initialize a kobject with its ktype and create its sysfs directory' },
    { label: 'struct kobj_type (ktype)', value: 'Shared behavior: release (mandatory), sysfs_ops, default_groups' },
    { label: 'struct kset', value: 'A kobject that groups kobjects; default parent + uevent filtering' },
    { label: 'sysfs_emit(buf, fmt, ...)', value: 'Bounds-safe show() formatter against the one-page buffer; prefer over sprintf' },
    { label: 'DEVICE_ATTR_RW / _RO / _WO', value: 'Declare a sysfs attribute wired to name_show / name_store with right mode' },
    { label: 'kstrtoint / kstrtoul', value: 'Robust string-to-number parse for store() handlers; check the return' },
    { label: 'bus_type.match', value: 'Per (dev, drv) pair test; nonzero claims the device and triggers probe' },
    { label: 'dev_get_drvdata / set', value: 'Accessors for a device driver private pointer; do not touch the field directly' },
    { label: 'platform_get_resource / _irq', value: 'Fetch MEM region / IRQ from a platform_device; _irq returns -errno on fail' },
    { label: 'devm_ioremap_resource', value: 'Map registers with auto-release on unbind; pairs with other devm_ helpers' },
    { label: '-EPROBE_DEFER', value: 'Return from probe to retry later when a clock/regulator/etc is not yet ready' },
    { label: 'MODULE_DEVICE_TABLE(of, ...)', value: 'Export compatible strings so udev/modprobe can autoload the driver' }
  ]
}

export default note
