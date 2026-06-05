import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch13-c-036',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Embed A kobject In Your Struct',
    prompt: `Define a driver structure my_obj that embeds a struct kobject named kobj plus an int value field. Then write struct my_obj *to_my_obj(struct kobject *kobj) that recovers the containing my_obj from a pointer to its embedded kobject using container_of. Include the right header.`,
    hints: [
      'kobjects are meant to be embedded, not allocated standalone.',
      'container_of(ptr, type, member) does the pointer arithmetic.',
    ],
    solution: `#include <linux/kobject.h>

struct my_obj {
    struct kobject kobj;
    int value;
};

struct my_obj *to_my_obj(struct kobject *kobj)
{
    return container_of(kobj, struct my_obj, kobj);
}`,
    starter: `#include <linux/kobject.h>

struct my_obj {
    /* TODO: embed a struct kobject and add an int value */
};

struct my_obj *to_my_obj(struct kobject *kobj)
{
    /* TODO: recover the containing struct */
}`,
    tags: ['kernel', 'kobject', 'container_of'],
  },
  {
    id: 'lx-ch13-c-037',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Get And Put A kobject Reference',
    prompt: `Write two helpers. void hold(struct kobject *kobj) takes a reference with kobject_get, and void release(struct kobject *kobj) drops one with kobject_put. Explain in a comment why kobject_put may free the object and run its release callback when the count reaches zero.`,
    hints: [
      'kobject_get increments, kobject_put decrements the refcount.',
      'The last put triggers the ktype release method.',
    ],
    solution: `#include <linux/kobject.h>

void hold(struct kobject *kobj)
{
    kobject_get(kobj);
}

void release(struct kobject *kobj)
{
    /* When the refcount hits 0, the core calls ktype->release,
     * which typically frees the embedding structure. After this
     * call kobj may be a dangling pointer, so never touch it again. */
    kobject_put(kobj);
}`,
    starter: `#include <linux/kobject.h>

void hold(struct kobject *kobj)
{
    /* TODO: take a reference */
}

void release(struct kobject *kobj)
{
    /* TODO: drop a reference */
}`,
    tags: ['kernel', 'kobject', 'refcount'],
  },
  {
    id: 'lx-ch13-c-038',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A ktype Release Callback',
    prompt: `For struct my_obj { struct kobject kobj; }, write the release method void my_release(struct kobject *kobj) that recovers the my_obj with container_of and frees it with kfree. Then define a struct kobj_type my_ktype whose .release points at it. Leave .sysfs_ops and .default_groups unset for now.`,
    hints: [
      'The release callback is where the embedding object is freed.',
      'kfree on the my_obj, not on &kobj directly (same address, but be explicit via container_of).',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/slab.h>

struct my_obj {
    struct kobject kobj;
};

static void my_release(struct kobject *kobj)
{
    struct my_obj *m = container_of(kobj, struct my_obj, kobj);

    kfree(m);
}

static struct kobj_type my_ktype = {
    .release = my_release,
};`,
    starter: `#include <linux/kobject.h>
#include <linux/slab.h>

struct my_obj {
    struct kobject kobj;
};

static void my_release(struct kobject *kobj)
{
    /* TODO: recover my_obj and free it */
}

static struct kobj_type my_ktype = {
    /* TODO: wire up the release callback */
};`,
    tags: ['kernel', 'kobject', 'ktype'],
  },
  {
    id: 'lx-ch13-c-039',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Create A Directory Under /sys/kernel',
    prompt: `Write struct kobject *make_dir(void) that creates a kobject named "myfeature" as a child of kernel_kobj (so it appears at /sys/kernel/myfeature). Use kobject_create_and_add. Return the kobject, or NULL on failure.`,
    hints: [
      'kobject_create_and_add(name, parent) builds a directory-only kobject.',
      'kernel_kobj is the /sys/kernel anchor.',
    ],
    solution: `#include <linux/kobject.h>

struct kobject *make_dir(void)
{
    return kobject_create_and_add("myfeature", kernel_kobj);
}`,
    starter: `#include <linux/kobject.h>

struct kobject *make_dir(void)
{
    /* TODO: create "myfeature" under /sys/kernel */
}`,
    tags: ['kernel', 'kobject', 'sysfs'],
  },
  {
    id: 'lx-ch13-c-040',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A show() For A Plain Attribute',
    prompt: `An int my_value is exposed via a struct kobj_attribute. Write the show method ssize_t value_show(struct kobject *kobj, struct kobj_attribute *attr, char *buf). Format my_value as a decimal line into buf with sysfs_emit and return its result (the byte count).`,
    hints: [
      'sysfs_emit(buf, fmt, ...) is the safe, bounds-checked formatter for show.',
      'Return the number of bytes written; sysfs_emit already returns it.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static int my_value;

static ssize_t value_show(struct kobject *kobj,
                          struct kobj_attribute *attr, char *buf)
{
    return sysfs_emit(buf, "%d\\n", my_value);
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static int my_value;

static ssize_t value_show(struct kobject *kobj,
                          struct kobj_attribute *attr, char *buf)
{
    /* TODO: emit my_value as a decimal line */
}`,
    tags: ['kernel', 'sysfs', 'show'],
  },
  {
    id: 'lx-ch13-c-041',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A store() That Parses An Integer',
    prompt: `Write the matching store method ssize_t value_store(struct kobject *kobj, struct kobj_attribute *attr, const char *buf, size_t count) for the int my_value. Parse buf as a base-10 int with kstrtoint; if parsing fails return the error. On success store the value and return count (so the write is consumed).`,
    hints: [
      'kstrtoint(buf, base, &out) handles the trailing newline and returns a negative errno on bad input.',
      'A store must return count on success or it looks like a short write.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/kernel.h>

static int my_value;

static ssize_t value_store(struct kobject *kobj,
                           struct kobj_attribute *attr,
                           const char *buf, size_t count)
{
    int ret, val;

    ret = kstrtoint(buf, 10, &val);
    if (ret)
        return ret;

    my_value = val;
    return count;
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/kernel.h>

static int my_value;

static ssize_t value_store(struct kobject *kobj,
                           struct kobj_attribute *attr,
                           const char *buf, size_t count)
{
    /* TODO: parse buf into my_value; return count or an errno */
}`,
    tags: ['kernel', 'sysfs', 'store'],
  },
  {
    id: 'lx-ch13-c-042',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Declare A Read/Write kobj_attribute',
    prompt: `Given value_show and value_store from before, declare a read/write attribute named "value" using the __ATTR macro. The variable should be a static struct kobj_attribute value_attr. Use mode 0644. Write the single declaration line.`,
    hints: [
      '__ATTR(name, mode, show, store) builds a kobj_attribute named name##_attr.',
      'For a non-helper name you can spell it __ATTR(value, 0644, value_show, value_store).',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern ssize_t value_show(struct kobject *, struct kobj_attribute *, char *);
extern ssize_t value_store(struct kobject *, struct kobj_attribute *,
                           const char *, size_t);

static struct kobj_attribute value_attr =
    __ATTR(value, 0644, value_show, value_store);`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern ssize_t value_show(struct kobject *, struct kobj_attribute *, char *);
extern ssize_t value_store(struct kobject *, struct kobj_attribute *,
                           const char *, size_t);

/* TODO: declare value_attr with __ATTR */`,
    tags: ['kernel', 'sysfs', 'attribute'],
  },
  {
    id: 'lx-ch13-c-043',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Read-Only Attribute With __ATTR_RO',
    prompt: `Expose a read-only counter. Write ssize_t count_show(struct kobject *kobj, struct kobj_attribute *attr, char *buf) that prints a static unsigned long event_count, then declare the attribute with the __ATTR_RO convenience macro (which assumes a show function named name_show and mode 0444).`,
    hints: [
      '__ATTR_RO(name) expects a function called name_show.',
      'Read-only means no store and mode 0444.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static unsigned long event_count;

static ssize_t count_show(struct kobject *kobj,
                          struct kobj_attribute *attr, char *buf)
{
    return sysfs_emit(buf, "%lu\\n", event_count);
}

static struct kobj_attribute count_attr = __ATTR_RO(count);`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static unsigned long event_count;

static ssize_t count_show(struct kobject *kobj,
                          struct kobj_attribute *attr, char *buf)
{
    /* TODO: print event_count */
}

/* TODO: declare count_attr as read-only */`,
    tags: ['kernel', 'sysfs', 'read-only'],
  },
  {
    id: 'lx-ch13-c-044',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add A Single File To A kobject',
    prompt: `You have a kobject *root (already created) and a struct kobj_attribute value_attr. Write int add_file(struct kobject *root) that creates the sysfs file using sysfs_create_file. Pass &value_attr.attr as the attribute. Return the call's result.`,
    hints: [
      'sysfs_create_file(kobj, &attr->attr) takes a struct attribute *.',
      'kobj_attribute embeds a struct attribute named attr.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern struct kobj_attribute value_attr;

int add_file(struct kobject *root)
{
    return sysfs_create_file(root, &value_attr.attr);
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern struct kobj_attribute value_attr;

int add_file(struct kobject *root)
{
    /* TODO: create the file under root */
}`,
    tags: ['kernel', 'sysfs', 'create-file'],
  },
  {
    id: 'lx-ch13-c-045',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Module Init/Exit For A sysfs Directory',
    prompt: `Write the init and exit functions of a module that exposes one attribute. mod_init creates a kobject "demo" under kernel_kobj, then sysfs_create_file with &value_attr.attr. On failure of the file creation it must kobject_put the kobject and return the error. mod_exit calls kobject_put to tear everything down. Use a static struct kobject *demo_kobj.`,
    hints: [
      'kobject_put on the directory both removes it from sysfs and drops the ref.',
      'Always undo the kobject if a later step fails.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/module.h>

extern struct kobj_attribute value_attr;

static struct kobject *demo_kobj;

static int __init mod_init(void)
{
    int ret;

    demo_kobj = kobject_create_and_add("demo", kernel_kobj);
    if (!demo_kobj)
        return -ENOMEM;

    ret = sysfs_create_file(demo_kobj, &value_attr.attr);
    if (ret) {
        kobject_put(demo_kobj);
        return ret;
    }
    return 0;
}

static void __exit mod_exit(void)
{
    kobject_put(demo_kobj);
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/module.h>

extern struct kobj_attribute value_attr;

static struct kobject *demo_kobj;

static int __init mod_init(void)
{
    /* TODO: create directory, add file, clean up on failure */
}

static void __exit mod_exit(void)
{
    /* TODO: tear down */
}`,
    tags: ['kernel', 'sysfs', 'module'],
  },
  {
    id: 'lx-ch13-c-046',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Group Attributes With ATTRIBUTE_GROUPS',
    prompt: `Bundle two attributes value_attr and count_attr into a group so they can be added at once. Build a NULL-terminated array static struct attribute *demo_attrs[] = { ... }, then use the ATTRIBUTE_GROUPS(demo) macro to produce demo_groups. Reference &value_attr.attr and &count_attr.attr in the array.`,
    hints: [
      'The array must be NULL-terminated.',
      'ATTRIBUTE_GROUPS(name) expects an array called name##_attrs and defines name##_group plus name##_groups.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern struct kobj_attribute value_attr;
extern struct kobj_attribute count_attr;

static struct attribute *demo_attrs[] = {
    &value_attr.attr,
    &count_attr.attr,
    NULL,
};
ATTRIBUTE_GROUPS(demo);`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern struct kobj_attribute value_attr;
extern struct kobj_attribute count_attr;

/* TODO: build a NULL-terminated demo_attrs[] and call ATTRIBUTE_GROUPS(demo) */`,
    tags: ['kernel', 'sysfs', 'attribute-group'],
  },
  {
    id: 'lx-ch13-c-047',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add And Remove A Whole Group',
    prompt: `Given demo_group (a struct attribute_group) and a kobject *kobj, write int add_group(struct kobject *kobj) using sysfs_create_group, and void del_group(struct kobject *kobj) using sysfs_remove_group. add_group returns the create call's result.`,
    hints: [
      'sysfs_create_group(kobj, grp) creates every file in the group at once.',
      'sysfs_remove_group undoes it.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern const struct attribute_group demo_group;

int add_group(struct kobject *kobj)
{
    return sysfs_create_group(kobj, &demo_group);
}

void del_group(struct kobject *kobj)
{
    sysfs_remove_group(kobj, &demo_group);
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern const struct attribute_group demo_group;

int add_group(struct kobject *kobj)
{
    /* TODO */
}

void del_group(struct kobject *kobj)
{
    /* TODO */
}`,
    tags: ['kernel', 'sysfs', 'group'],
  },
  {
    id: 'lx-ch13-c-048',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Recover Per-Instance Data In show()',
    prompt: `A kobject is embedded in struct widget { struct kobject kobj; int gain; }. Write ssize_t gain_show(struct kobject *kobj, struct kobj_attribute *attr, char *buf) that uses container_of to find the widget owning kobj and prints its gain. This is how a custom ktype attribute reaches per-instance state.`,
    hints: [
      'The show callback gets the kobject, not the widget directly.',
      'container_of(kobj, struct widget, kobj) bridges the gap.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

struct widget {
    struct kobject kobj;
    int gain;
};

static ssize_t gain_show(struct kobject *kobj,
                         struct kobj_attribute *attr, char *buf)
{
    struct widget *w = container_of(kobj, struct widget, kobj);

    return sysfs_emit(buf, "%d\\n", w->gain);
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

struct widget {
    struct kobject kobj;
    int gain;
};

static ssize_t gain_show(struct kobject *kobj,
                         struct kobj_attribute *attr, char *buf)
{
    /* TODO: recover the widget and print its gain */
}`,
    tags: ['kernel', 'sysfs', 'container_of'],
  },
  {
    id: 'lx-ch13-c-049',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Custom sysfs_ops Dispatcher',
    prompt: `For a ktype with custom attributes, sysfs read/write go through a struct sysfs_ops. Write the dispatcher ssize_t obj_attr_show(struct kobject *kobj, struct attribute *attr, char *buf). Define struct obj_attribute { struct attribute attr; ssize_t (*show)(struct kobject *, char *); }. Recover the obj_attribute with container_of, return -EIO if its show pointer is NULL, otherwise call show(kobj, buf).`,
    hints: [
      'sysfs_ops->show receives the generic struct attribute *.',
      'container_of(attr, struct obj_attribute, attr) gets your richer type.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

struct obj_attribute {
    struct attribute attr;
    ssize_t (*show)(struct kobject *kobj, char *buf);
};

static ssize_t obj_attr_show(struct kobject *kobj,
                             struct attribute *attr, char *buf)
{
    struct obj_attribute *oa =
        container_of(attr, struct obj_attribute, attr);

    if (!oa->show)
        return -EIO;

    return oa->show(kobj, buf);
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

struct obj_attribute {
    struct attribute attr;
    ssize_t (*show)(struct kobject *kobj, char *buf);
};

static ssize_t obj_attr_show(struct kobject *kobj,
                             struct attribute *attr, char *buf)
{
    /* TODO: recover obj_attribute, guard NULL show, dispatch */
}`,
    tags: ['kernel', 'sysfs', 'sysfs_ops'],
  },
  {
    id: 'lx-ch13-c-050',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Define And Register A Bus Type',
    prompt: `Define a struct bus_type named widget_bus with .name = "widget". Then write int widget_bus_init(void) that registers it with bus_register, and void widget_bus_exit(void) that calls bus_unregister. widget_bus_init returns the registration result.`,
    hints: [
      'bus_register(&bus) creates /sys/bus/<name>.',
      'Pair every bus_register with a bus_unregister.',
    ],
    solution: `#include <linux/device.h>
#include <linux/device/bus.h>

struct bus_type widget_bus = {
    .name = "widget",
};

int widget_bus_init(void)
{
    return bus_register(&widget_bus);
}

void widget_bus_exit(void)
{
    bus_unregister(&widget_bus);
}`,
    starter: `#include <linux/device.h>
#include <linux/device/bus.h>

/* TODO: define widget_bus with name "widget" */

int widget_bus_init(void)
{
    /* TODO: register */
}

void widget_bus_exit(void)
{
    /* TODO: unregister */
}`,
    tags: ['kernel', 'device-model', 'bus'],
  },
  {
    id: 'lx-ch13-c-051',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: "A Bus match() Function",
    prompt: `Write a bus match callback int widget_match(struct device *dev, const struct device_driver *drv). A match succeeds when the device and driver have the same name. Use strcmp on dev_name(dev) and drv->name and return 1 for a match (equal) and 0 otherwise.`,
    hints: [
      'The bus match() decides whether a driver can drive a device.',
      'dev_name(dev) gives the device name; drv->name the driver name.',
    ],
    solution: `#include <linux/device.h>
#include <linux/string.h>

static int widget_match(struct device *dev,
                        const struct device_driver *drv)
{
    return strcmp(dev_name(dev), drv->name) == 0;
}`,
    starter: `#include <linux/device.h>
#include <linux/string.h>

static int widget_match(struct device *dev,
                        const struct device_driver *drv)
{
    /* TODO: return 1 if names are equal, else 0 */
}`,
    tags: ['kernel', 'device-model', 'match'],
  },
  {
    id: 'lx-ch13-c-052',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register A Device On A Custom Bus',
    prompt: `Given the widget_bus from earlier and a struct device *dev, write int add_widget_dev(struct device *dev) that sets dev->bus = &widget_bus, names it with dev_set_name(dev, "widget0"), and registers it with device_register. Return the result of device_register.`,
    hints: [
      'Set dev->bus before registering so the core can match drivers.',
      'dev_set_name supports printf-style names.',
    ],
    solution: `#include <linux/device.h>

extern struct bus_type widget_bus;

int add_widget_dev(struct device *dev)
{
    dev->bus = &widget_bus;
    dev_set_name(dev, "widget0");
    return device_register(dev);
}`,
    starter: `#include <linux/device.h>

extern struct bus_type widget_bus;

int add_widget_dev(struct device *dev)
{
    /* TODO: attach to widget_bus, name it, register it */
}`,
    tags: ['kernel', 'device-model', 'device'],
  },
  {
    id: 'lx-ch13-c-053',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register A Driver On A Custom Bus',
    prompt: `Define a struct device_driver widget_drv with .name = "widget0", .bus = &widget_bus, and a .probe callback widget_probe (assume it exists: int widget_probe(struct device *dev)). Then write int widget_drv_init(void) that calls driver_register and returns its result.`,
    hints: [
      'A driver names its bus so the core knows where to look for devices.',
      'driver_register triggers matching against existing devices.',
    ],
    solution: `#include <linux/device.h>

extern struct bus_type widget_bus;
int widget_probe(struct device *dev);

struct device_driver widget_drv = {
    .name = "widget0",
    .bus = &widget_bus,
    .probe = widget_probe,
};

int widget_drv_init(void)
{
    return driver_register(&widget_drv);
}`,
    starter: `#include <linux/device.h>

extern struct bus_type widget_bus;
int widget_probe(struct device *dev);

/* TODO: define widget_drv (name, bus, probe) */

int widget_drv_init(void)
{
    /* TODO: register the driver */
}`,
    tags: ['kernel', 'device-model', 'driver'],
  },
  {
    id: 'lx-ch13-c-054',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Minimal Platform Driver Skeleton',
    prompt: `Define a struct platform_driver named myplat_driver. Wire .probe to myplat_probe and .remove to myplat_remove (assume both exist with the standard prototypes), and set .driver.name to "myplat". Write only the platform_driver definition.`,
    hints: [
      'The platform_driver wraps a struct device_driver in its .driver member.',
      'platform probe: int probe(struct platform_device *pdev).',
    ],
    solution: `#include <linux/platform_device.h>

int myplat_probe(struct platform_device *pdev);
void myplat_remove(struct platform_device *pdev);

static struct platform_driver myplat_driver = {
    .probe = myplat_probe,
    .remove = myplat_remove,
    .driver = {
        .name = "myplat",
    },
};`,
    starter: `#include <linux/platform_device.h>

int myplat_probe(struct platform_device *pdev);
void myplat_remove(struct platform_device *pdev);

/* TODO: define myplat_driver with probe, remove, and .driver.name */`,
    tags: ['kernel', 'platform', 'driver'],
  },
  {
    id: 'lx-ch13-c-055',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Register A Platform Driver With A Macro',
    prompt: `Given an existing static struct platform_driver myplat_driver, register it for module init/exit using the module_platform_driver convenience macro (which generates both the init and exit functions). Write just that one macro line.`,
    hints: [
      'module_platform_driver(drv) expands to module_init/module_exit calling platform_driver_register/unregister.',
      'No explicit init/exit functions are needed.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/module.h>

extern struct platform_driver myplat_driver;

module_platform_driver(myplat_driver);`,
    starter: `#include <linux/platform_device.h>
#include <linux/module.h>

extern struct platform_driver myplat_driver;

/* TODO: register the platform driver in one line */`,
    tags: ['kernel', 'platform', 'module'],
  },
  {
    id: 'lx-ch13-c-056',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Get An MMIO Resource In probe()',
    prompt: `Write int myplat_probe(struct platform_device *pdev). Fetch the first memory resource with platform_get_resource(pdev, IORESOURCE_MEM, 0). If it is NULL, return -ENODEV. Otherwise print the resource start address with dev_info(&pdev->dev, ...) using %pa on &res->start, and return 0.`,
    hints: [
      'platform_get_resource(pdev, type, index) returns a struct resource *.',
      '%pa prints a phys_addr_t / resource_size_t safely; pass its address.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/ioport.h>

int myplat_probe(struct platform_device *pdev)
{
    struct resource *res;

    res = platform_get_resource(pdev, IORESOURCE_MEM, 0);
    if (!res)
        return -ENODEV;

    dev_info(&pdev->dev, "mmio at %pa\\n", &res->start);
    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/ioport.h>

int myplat_probe(struct platform_device *pdev)
{
    struct resource *res;

    /* TODO: fetch MEM resource 0, guard NULL, print start */
}`,
    tags: ['kernel', 'platform', 'resource'],
  },
  {
    id: 'lx-ch13-c-057',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Allocate Private Data In probe()',
    prompt: `In probe you must allocate per-device state and stash it. Define struct myplat { int id; }. In int myplat_probe(struct platform_device *pdev): allocate a struct myplat with devm_kzalloc tied to &pdev->dev (GFP_KERNEL), return -ENOMEM on failure, set ->id = pdev->id, then save the pointer with platform_set_drvdata(pdev, priv). Return 0.`,
    hints: [
      'devm_kzalloc auto-frees when the device is removed, so no kfree in remove.',
      'platform_set_drvdata stores a pointer you can fetch later with platform_get_drvdata.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/slab.h>

struct myplat {
    int id;
};

int myplat_probe(struct platform_device *pdev)
{
    struct myplat *priv;

    priv = devm_kzalloc(&pdev->dev, sizeof(*priv), GFP_KERNEL);
    if (!priv)
        return -ENOMEM;

    priv->id = pdev->id;
    platform_set_drvdata(pdev, priv);
    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/slab.h>

struct myplat {
    int id;
};

int myplat_probe(struct platform_device *pdev)
{
    /* TODO: devm_kzalloc priv, set id, stash with platform_set_drvdata */
}`,
    tags: ['kernel', 'platform', 'devm'],
  },
  {
    id: 'lx-ch13-c-058',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'The remove() Counterpart',
    prompt: `Write void myplat_remove(struct platform_device *pdev) (the modern void-returning prototype). Fetch the private struct myplat with platform_get_drvdata and print "removing widget %d\\n" with its id via dev_info. Because the data was allocated with devm_kzalloc, you must NOT free it here.`,
    hints: [
      'Modern .remove returns void.',
      'devm-managed memory is released automatically after remove returns.',
    ],
    solution: `#include <linux/platform_device.h>

struct myplat {
    int id;
};

void myplat_remove(struct platform_device *pdev)
{
    struct myplat *priv = platform_get_drvdata(pdev);

    dev_info(&pdev->dev, "removing widget %d\\n", priv->id);
    /* no kfree: devm cleanup runs automatically */
}`,
    starter: `#include <linux/platform_device.h>

struct myplat {
    int id;
};

void myplat_remove(struct platform_device *pdev)
{
    /* TODO: fetch drvdata, log id; do not free devm memory */
}`,
    tags: ['kernel', 'platform', 'remove'],
  },
  {
    id: 'lx-ch13-c-059',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'An OF Match Table',
    prompt: `Build a device-tree match table for two compatible strings, "acme,widget-v1" and "acme,widget-v2". Define a static const struct of_device_id myplat_of_match[] terminated by an empty {} entry, then expose it to userspace tools with MODULE_DEVICE_TABLE(of, myplat_of_match).`,
    hints: [
      'Each entry uses .compatible = "vendor,device".',
      'The table must end with an empty {} sentinel.',
    ],
    solution: `#include <linux/mod_devicetable.h>
#include <linux/module.h>

static const struct of_device_id myplat_of_match[] = {
    { .compatible = "acme,widget-v1" },
    { .compatible = "acme,widget-v2" },
    { }
};
MODULE_DEVICE_TABLE(of, myplat_of_match);`,
    starter: `#include <linux/mod_devicetable.h>
#include <linux/module.h>

/* TODO: define myplat_of_match[] with two compatibles + sentinel,
 * then MODULE_DEVICE_TABLE(of, ...) */`,
    tags: ['kernel', 'device-tree', 'of-match'],
  },
  {
    id: 'lx-ch13-c-060',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Wire The OF Table Into The Driver',
    prompt: `Attach the of_device_id table to your platform driver so DT matching works. Given an existing myplat_of_match[] (and probe/remove functions), define static struct platform_driver myplat_driver and set .driver.name = "myplat" plus .driver.of_match_table = myplat_of_match.`,
    hints: [
      'of_match_table lives inside the embedded struct device_driver.',
      'The matcher walks the table comparing the node compatible strings.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/mod_devicetable.h>

extern const struct of_device_id myplat_of_match[];
int myplat_probe(struct platform_device *pdev);
void myplat_remove(struct platform_device *pdev);

static struct platform_driver myplat_driver = {
    .probe = myplat_probe,
    .remove = myplat_remove,
    .driver = {
        .name = "myplat",
        .of_match_table = myplat_of_match,
    },
};`,
    starter: `#include <linux/platform_device.h>
#include <linux/mod_devicetable.h>

extern const struct of_device_id myplat_of_match[];
int myplat_probe(struct platform_device *pdev);
void myplat_remove(struct platform_device *pdev);

/* TODO: define myplat_driver wiring in of_match_table */`,
    tags: ['kernel', 'device-tree', 'platform'],
  },
  {
    id: 'lx-ch13-c-061',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read A u32 DT Property In probe()',
    prompt: `In int myplat_probe(struct platform_device *pdev), read a 32-bit device-tree property named "clock-frequency" from the node pdev->dev.of_node. Use of_property_read_u32 into a u32 freq. If it fails (nonzero), return the error; otherwise dev_info the value and return 0.`,
    hints: [
      'of_property_read_u32(node, name, &out) returns 0 on success.',
      'pdev->dev.of_node is the DT node backing the device.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/of.h>

int myplat_probe(struct platform_device *pdev)
{
    u32 freq;
    int ret;

    ret = of_property_read_u32(pdev->dev.of_node,
                               "clock-frequency", &freq);
    if (ret)
        return ret;

    dev_info(&pdev->dev, "clock-frequency = %u\\n", freq);
    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/of.h>

int myplat_probe(struct platform_device *pdev)
{
    u32 freq;
    int ret;

    /* TODO: read "clock-frequency" from of_node; handle error */
}`,
    tags: ['kernel', 'device-tree', 'of-property'],
  },
  {
    id: 'lx-ch13-c-062',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Recover Match Data In probe()',
    prompt: `Each OF entry can carry .data. Suppose myplat_of_match[] entries set .data = (void *)1 for v1 and (void *)2 for v2. In int myplat_probe(struct platform_device *pdev), recover the matched entry's data with of_device_get_match_data(&pdev->dev), cast it to a long version, dev_info it, and return 0.`,
    hints: [
      'of_device_get_match_data returns the const void * from the matched entry.',
      'Casting a (void *)N to long is the usual small-tag trick.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/of_device.h>

int myplat_probe(struct platform_device *pdev)
{
    long version = (long)of_device_get_match_data(&pdev->dev);

    dev_info(&pdev->dev, "widget version %ld\\n", version);
    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/of_device.h>

int myplat_probe(struct platform_device *pdev)
{
    /* TODO: get match data, cast to long, log it */
}`,
    tags: ['kernel', 'device-tree', 'match-data'],
  },
  {
    id: 'lx-ch13-c-063',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Emit A udev uevent Manually',
    prompt: `Userspace udev reacts to kobject uevents. Write void notify_change(struct kobject *kobj) that sends a KOBJ_CHANGE event with kobject_uevent. (A KOBJ_CHANGE is the standard way to nudge udev to re-read attributes after a state change.)`,
    hints: [
      'kobject_uevent(kobj, action) generates the netlink message udev listens for.',
      'KOBJ_ADD/KOBJ_REMOVE fire automatically; KOBJ_CHANGE is the manual nudge.',
    ],
    solution: `#include <linux/kobject.h>

void notify_change(struct kobject *kobj)
{
    kobject_uevent(kobj, KOBJ_CHANGE);
}`,
    starter: `#include <linux/kobject.h>

void notify_change(struct kobject *kobj)
{
    /* TODO: send a KOBJ_CHANGE uevent */
}`,
    tags: ['kernel', 'udev', 'uevent'],
  },
  {
    id: 'lx-ch13-c-064',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Add An Environment Variable To A uevent',
    prompt: `Drivers can pass hints to udev rules through uevent env vars. Write int widget_uevent(const struct device *dev, struct kobj_uevent_env *env) (a bus or class .uevent callback). Add the variable "WIDGET_KIND=sensor" with add_uevent_var and return its result.`,
    hints: [
      'add_uevent_var(env, "KEY=value") appends to the event environment.',
      'It returns 0 on success or -ENOMEM if the env buffer is full.',
    ],
    solution: `#include <linux/device.h>
#include <linux/kobject.h>

static int widget_uevent(const struct device *dev,
                         struct kobj_uevent_env *env)
{
    return add_uevent_var(env, "WIDGET_KIND=sensor");
}`,
    starter: `#include <linux/device.h>
#include <linux/kobject.h>

static int widget_uevent(const struct device *dev,
                         struct kobj_uevent_env *env)
{
    /* TODO: add WIDGET_KIND=sensor to env */
}`,
    tags: ['kernel', 'udev', 'uevent-env'],
  },
  {
    id: 'lx-ch13-c-065',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Userspace: Read A sysfs Attribute',
    prompt: `Write a userspace C function int read_value(void) that opens "/sys/kernel/demo/value" for reading, reads up to 63 bytes into a buffer, null-terminates it, closes the file, and returns the integer parsed with atoi. Return -1 if open or read fails.`,
    hints: [
      'sysfs files are plain text; open/read/close like any file.',
      'Always null-terminate before atoi.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

int read_value(void)
{
    char buf[64];
    int fd, n;

    fd = open("/sys/kernel/demo/value", O_RDONLY);
    if (fd < 0)
        return -1;

    n = read(fd, buf, sizeof(buf) - 1);
    close(fd);
    if (n < 0)
        return -1;

    buf[n] = '\\0';
    return atoi(buf);
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

int read_value(void)
{
    /* TODO: open the sysfs file, read, parse, return the int (-1 on error) */
}`,
    tags: ['userspace', 'sysfs', 'read'],
  },
  {
    id: 'lx-ch13-c-066',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Userspace: Write A sysfs Attribute',
    prompt: `Write a userspace C function int write_value(int v) that formats v plus a newline into a string and writes it to "/sys/kernel/demo/value" (opened O_WRONLY). Return 0 on success, -1 if open or write fails. Close the descriptor before returning.`,
    hints: [
      'snprintf the number, then write the resulting bytes.',
      'A trailing newline matches what kstrtoint expects on the kernel side.',
    ],
    solution: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int write_value(int v)
{
    char buf[32];
    int fd, len, n;

    fd = open("/sys/kernel/demo/value", O_WRONLY);
    if (fd < 0)
        return -1;

    len = snprintf(buf, sizeof(buf), "%d\\n", v);
    n = write(fd, buf, len);
    close(fd);

    return (n == len) ? 0 : -1;
}`,
    starter: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int write_value(int v)
{
    /* TODO: open O_WRONLY, snprintf "%d\\n", write, return 0/-1 */
}`,
    tags: ['userspace', 'sysfs', 'write'],
  },
  {
    id: 'lx-ch13-c-067',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Validate And Bound-Check In store()',
    prompt: `Write a robust store. ssize_t level_store(struct kobject *kobj, struct kobj_attribute *attr, const char *buf, size_t count) parses an int with kstrtoint, returns the parse error on failure, returns -EINVAL if the value is outside the inclusive range 0..100, otherwise stores it into a static int level guarded by a spinlock level_lock and returns count. The store runs in process context, so a plain spin_lock is fine.`,
    hints: [
      'Reject bad input with -EINVAL before mutating state.',
      'spin_lock/spin_unlock protect level against concurrent writers.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/kernel.h>
#include <linux/spinlock.h>

static int level;
static DEFINE_SPINLOCK(level_lock);

static ssize_t level_store(struct kobject *kobj,
                           struct kobj_attribute *attr,
                           const char *buf, size_t count)
{
    int ret, val;

    ret = kstrtoint(buf, 10, &val);
    if (ret)
        return ret;
    if (val < 0 || val > 100)
        return -EINVAL;

    spin_lock(&level_lock);
    level = val;
    spin_unlock(&level_lock);
    return count;
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/kernel.h>
#include <linux/spinlock.h>

static int level;
static DEFINE_SPINLOCK(level_lock);

static ssize_t level_store(struct kobject *kobj,
                           struct kobj_attribute *attr,
                           const char *buf, size_t count)
{
    /* TODO: parse, range-check 0..100, store under lock, return count */
}`,
    tags: ['kernel', 'sysfs', 'locking'],
  },
  {
    id: 'lx-ch13-c-068',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Custom ktype With Working Attributes',
    prompt: `Build a complete custom ktype. Define struct counter { struct kobject kobj; atomic_t hits; }. Provide a sysfs_ops dispatcher counter_show(struct kobject *, struct attribute *, char *) that calls into a struct counter_attribute { struct attribute attr; ssize_t (*show)(struct counter *, char *); }. Define struct kobj_type counter_ktype with that .sysfs_ops, a .release that kfrees the counter, and .default_groups left NULL. Also write the per-attribute show hits_show(struct counter *c, char *buf) printing atomic_read(&c->hits).`,
    hints: [
      'sysfs_ops->show gets the generic attribute; container_of twice to reach your richer types.',
      'The release must free the embedding counter, not the kobject.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/slab.h>
#include <linux/atomic.h>

struct counter {
    struct kobject kobj;
    atomic_t hits;
};

struct counter_attribute {
    struct attribute attr;
    ssize_t (*show)(struct counter *c, char *buf);
};

static ssize_t counter_show(struct kobject *kobj,
                            struct attribute *attr, char *buf)
{
    struct counter *c = container_of(kobj, struct counter, kobj);
    struct counter_attribute *ca =
        container_of(attr, struct counter_attribute, attr);

    if (!ca->show)
        return -EIO;
    return ca->show(c, buf);
}

static const struct sysfs_ops counter_sysfs_ops = {
    .show = counter_show,
};

static void counter_release(struct kobject *kobj)
{
    struct counter *c = container_of(kobj, struct counter, kobj);

    kfree(c);
}

static struct kobj_type counter_ktype = {
    .sysfs_ops = &counter_sysfs_ops,
    .release = counter_release,
};

static ssize_t hits_show(struct counter *c, char *buf)
{
    return sysfs_emit(buf, "%d\\n", atomic_read(&c->hits));
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/slab.h>
#include <linux/atomic.h>

struct counter {
    struct kobject kobj;
    atomic_t hits;
};

struct counter_attribute {
    struct attribute attr;
    ssize_t (*show)(struct counter *c, char *buf);
};

/* TODO: counter_show dispatcher, counter_sysfs_ops, counter_release,
 * counter_ktype, and hits_show */`,
    tags: ['kernel', 'kobject', 'ktype'],
  },
  {
    id: 'lx-ch13-c-069',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Initialize And Add A Custom-ktype kobject',
    prompt: `Allocate and publish a counter (the struct counter / counter_ktype from before). Write struct counter *make_counter(struct kobject *parent, const char *name). kzalloc the counter (GFP_KERNEL, return NULL on failure), then call kobject_init_and_add(&c->kobj, &counter_ktype, parent, "%s", name). If that fails you must kobject_put(&c->kobj) (NOT kfree) to release it, and return NULL. On success return c.`,
    hints: [
      'kobject_init_and_add takes the ktype, so the release callback is set before any failure.',
      'After a failed init_and_add the only correct cleanup is kobject_put — it routes through release.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/slab.h>
#include <linux/atomic.h>

struct counter {
    struct kobject kobj;
    atomic_t hits;
};

extern struct kobj_type counter_ktype;

struct counter *make_counter(struct kobject *parent, const char *name)
{
    struct counter *c;
    int ret;

    c = kzalloc(sizeof(*c), GFP_KERNEL);
    if (!c)
        return NULL;

    ret = kobject_init_and_add(&c->kobj, &counter_ktype, parent,
                               "%s", name);
    if (ret) {
        kobject_put(&c->kobj);
        return NULL;
    }
    return c;
}`,
    starter: `#include <linux/kobject.h>
#include <linux/slab.h>
#include <linux/atomic.h>

struct counter {
    struct kobject kobj;
    atomic_t hits;
};

extern struct kobj_type counter_ktype;

struct counter *make_counter(struct kobject *parent, const char *name)
{
    /* TODO: kzalloc, kobject_init_and_add, kobject_put on failure */
}`,
    tags: ['kernel', 'kobject', 'lifecycle'],
  },
  {
    id: 'lx-ch13-c-070',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full Probe With Resource And DT Cleanup Path',
    prompt: `Write a complete int myplat_probe(struct platform_device *pdev) that: (1) devm_kzalloc a struct myplat { void __iomem *base; u32 freq; } tied to &pdev->dev, returning -ENOMEM on failure; (2) maps the first MEM resource with devm_platform_ioremap_resource(pdev, 0), returning PTR_ERR on error via IS_ERR; (3) reads required DT prop "clock-frequency" with of_property_read_u32 into priv->freq, returning the error if missing; (4) stores priv with platform_set_drvdata and returns 0. Because everything is devm-managed, no explicit unwinding is needed.`,
    hints: [
      'devm_platform_ioremap_resource returns an ERR_PTR; check with IS_ERR and return PTR_ERR.',
      'devm_* resources are released automatically in reverse order if probe returns an error.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/io.h>
#include <linux/slab.h>
#include <linux/err.h>

struct myplat {
    void __iomem *base;
    u32 freq;
};

int myplat_probe(struct platform_device *pdev)
{
    struct myplat *priv;
    int ret;

    priv = devm_kzalloc(&pdev->dev, sizeof(*priv), GFP_KERNEL);
    if (!priv)
        return -ENOMEM;

    priv->base = devm_platform_ioremap_resource(pdev, 0);
    if (IS_ERR(priv->base))
        return PTR_ERR(priv->base);

    ret = of_property_read_u32(pdev->dev.of_node,
                               "clock-frequency", &priv->freq);
    if (ret)
        return ret;

    platform_set_drvdata(pdev, priv);
    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/io.h>
#include <linux/slab.h>
#include <linux/err.h>

struct myplat {
    void __iomem *base;
    u32 freq;
};

int myplat_probe(struct platform_device *pdev)
{
    /* TODO: devm_kzalloc priv; ioremap resource 0; read clock-frequency;
     * set drvdata; rely on devm for cleanup */
}`,
    tags: ['kernel', 'platform', 'devm'],
  },
]

export default problems
