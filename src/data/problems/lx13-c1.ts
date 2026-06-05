import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'lx-ch13-c-001',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Initialize a kobject With a Name',
    prompt: `Write a function int make_kobj(struct kobject *kobj, struct kset *parent_set) that initializes an embedded kobject and adds it to sysfs under the name "demo". Use kobject_init_and_add with a ktype you assume is named demo_ktype (declared elsewhere as extern). Set kobj->kset = parent_set before adding. Return whatever kobject_init_and_add returns.`,
    hints: [
      'kobject_init_and_add takes the kobject, a ktype, a parent kobject (may be NULL), then a printf-style name.',
      'Assigning kobj->kset gives the kobject a containing kset and a default parent.',
    ],
    solution: `#include <linux/kobject.h>

extern struct kobj_type demo_ktype;

int make_kobj(struct kobject *kobj, struct kset *parent_set)
{
    kobj->kset = parent_set;
    return kobject_init_and_add(kobj, &demo_ktype, NULL, "%s", "demo");
}`,
    starter: `#include <linux/kobject.h>

extern struct kobj_type demo_ktype;

int make_kobj(struct kobject *kobj, struct kset *parent_set)
{
    // TODO: set kobj->kset, then init and add the kobject as "demo"
    return 0;
}`,
    tags: ['kernel', 'kobject', 'sysfs'],
  },
  {
    id: 'lx-ch13-c-002',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Take a kobject Reference',
    prompt: `Write a function struct kobject *grab(struct kobject *kobj) that increments the reference count of kobj and returns it. Use the proper kobject reference-counting API, not a raw refcount field.`,
    hints: [
      'kobject_get(kobj) bumps the refcount and returns the same pointer.',
      'Never touch kobj->kref directly from driver code.',
    ],
    solution: `#include <linux/kobject.h>

struct kobject *grab(struct kobject *kobj)
{
    return kobject_get(kobj);
}`,
    starter: `#include <linux/kobject.h>

struct kobject *grab(struct kobject *kobj)
{
    // TODO: take a reference and return the kobject
    return kobj;
}`,
    tags: ['kernel', 'kobject', 'refcount'],
  },
  {
    id: 'lx-ch13-c-003',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Drop a kobject Reference',
    prompt: `Write a function void release(struct kobject *kobj) that drops one reference to kobj. When the last reference goes away the kobject's ktype release method runs automatically. Call the correct API.`,
    hints: [
      'kobject_put(kobj) decrements the refcount.',
      'When the count reaches zero the kobj_type release() callback is invoked.',
    ],
    solution: `#include <linux/kobject.h>

void release(struct kobject *kobj)
{
    kobject_put(kobj);
}`,
    starter: `#include <linux/kobject.h>

void release(struct kobject *kobj)
{
    // TODO: drop a reference
}`,
    tags: ['kernel', 'kobject', 'refcount'],
  },
  {
    id: 'lx-ch13-c-004',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Minimal kobject Release Callback',
    prompt: `A ktype needs a release function that frees the structure embedding the kobject. Given struct demo { struct kobject kobj; int val; }, write void demo_release(struct kobject *kobj) that recovers the containing struct demo with container_of and frees it with kfree.`,
    hints: [
      'container_of(ptr, type, member) maps an embedded member back to its container.',
      'The kobject release callback is the right place to free the object.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/slab.h>

struct demo { struct kobject kobj; int val; };

void demo_release(struct kobject *kobj)
{
    struct demo *d = container_of(kobj, struct demo, kobj);

    kfree(d);
}`,
    starter: `#include <linux/kobject.h>
#include <linux/slab.h>

struct demo { struct kobject kobj; int val; };

void demo_release(struct kobject *kobj)
{
    // TODO: container_of back to struct demo, then kfree it
}`,
    tags: ['kernel', 'kobject', 'ktype'],
  },
  {
    id: 'lx-ch13-c-005',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define a Read-Only sysfs Attribute',
    prompt: `Declare a read-only sysfs attribute named "version" using the __ATTR convenience macro. The show function is named version_show and the store side is not needed. Define the struct kobj_attribute variable as version_attribute with mode 0444.`,
    hints: [
      '__ATTR(name, mode, show, store) builds a struct kobj_attribute (or attribute).',
      'For read-only use mode 0444 and pass NULL for the store callback.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static ssize_t version_show(struct kobject *kobj,
                            struct kobj_attribute *attr, char *buf);

static struct kobj_attribute version_attribute =
    __ATTR(version, 0444, version_show, NULL);`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static ssize_t version_show(struct kobject *kobj,
                            struct kobj_attribute *attr, char *buf);

// TODO: define version_attribute as a read-only (0444) attribute
`,
    tags: ['kernel', 'sysfs', 'attribute'],
  },
  {
    id: 'lx-ch13-c-006',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Simple sysfs show() Method',
    prompt: `Write the show callback ssize_t version_show(struct kobject *kobj, struct kobj_attribute *attr, char *buf) that writes the string "1.0\\n" into buf and returns the number of bytes produced. Use sysfs_emit, which is the safe, page-size-aware helper.`,
    hints: [
      'sysfs_emit(buf, fmt, ...) formats into the page buffer and returns the length.',
      'A show method returns the number of bytes written (or a negative errno).',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

ssize_t version_show(struct kobject *kobj, struct kobj_attribute *attr,
                     char *buf)
{
    return sysfs_emit(buf, "1.0\\n");
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

ssize_t version_show(struct kobject *kobj, struct kobj_attribute *attr,
                     char *buf)
{
    // TODO: emit "1.0\\n" into buf and return the length
    return 0;
}`,
    tags: ['kernel', 'sysfs', 'show'],
  },
  {
    id: 'lx-ch13-c-007',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Show an Integer Through sysfs',
    prompt: `Given a module-global int g_count, write ssize_t count_show(struct kobject *kobj, struct kobj_attribute *attr, char *buf) that prints g_count as a decimal followed by a newline, using sysfs_emit, and returns the byte count.`,
    hints: [
      'sysfs_emit(buf, "%d\\n", value) is the idiomatic one-line form.',
      'Always end sysfs scalar output with a newline.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static int g_count;

ssize_t count_show(struct kobject *kobj, struct kobj_attribute *attr,
                   char *buf)
{
    return sysfs_emit(buf, "%d\\n", g_count);
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static int g_count;

ssize_t count_show(struct kobject *kobj, struct kobj_attribute *attr,
                   char *buf)
{
    // TODO: print g_count as "%d\\n"
    return 0;
}`,
    tags: ['kernel', 'sysfs', 'show'],
  },
  {
    id: 'lx-ch13-c-008',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Register a Platform Driver in module_init',
    prompt: `You have a defined struct platform_driver my_driver. Write the module init function static int __init my_init(void) that registers it with platform_driver_register and returns its result, and the exit function static void __exit my_exit(void) that unregisters it with platform_driver_unregister. Do not add module_init/module_exit macros.`,
    hints: [
      'platform_driver_register returns 0 on success or a negative errno.',
      'Mirror register/unregister exactly between init and exit.',
    ],
    solution: `#include <linux/platform_device.h>

extern struct platform_driver my_driver;

static int __init my_init(void)
{
    return platform_driver_register(&my_driver);
}

static void __exit my_exit(void)
{
    platform_driver_unregister(&my_driver);
}`,
    starter: `#include <linux/platform_device.h>

extern struct platform_driver my_driver;

static int __init my_init(void)
{
    // TODO: register my_driver
    return 0;
}

static void __exit my_exit(void)
{
    // TODO: unregister my_driver
}`,
    tags: ['kernel', 'platform', 'driver'],
  },
  {
    id: 'lx-ch13-c-009',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Skeleton platform probe()',
    prompt: `Write a probe function int my_probe(struct platform_device *pdev) that logs "probed\\n" with dev_info using &pdev->dev as the device, and returns 0 to claim the device. Use the device-aware logging helper, not plain printk.`,
    hints: [
      'dev_info(dev, fmt, ...) prefixes the message with the device name.',
      'Returning 0 from probe binds the driver to the device.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/device.h>

int my_probe(struct platform_device *pdev)
{
    dev_info(&pdev->dev, "probed\\n");
    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/device.h>

int my_probe(struct platform_device *pdev)
{
    // TODO: dev_info "probed" and return 0
    return 0;
}`,
    tags: ['kernel', 'platform', 'probe'],
  },
  {
    id: 'lx-ch13-c-010',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A platform remove() Callback',
    prompt: `Write void my_remove(struct platform_device *pdev) that logs "removed\\n" with dev_info on &pdev->dev. Assume the modern remove signature that returns void.`,
    hints: [
      'The remove callback undoes what probe set up.',
      'Newer kernels use a void-returning remove (remove_new style).',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/device.h>

void my_remove(struct platform_device *pdev)
{
    dev_info(&pdev->dev, "removed\\n");
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/device.h>

void my_remove(struct platform_device *pdev)
{
    // TODO: dev_info "removed"
}`,
    tags: ['kernel', 'platform', 'remove'],
  },
  {
    id: 'lx-ch13-c-011',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create a Single sysfs File',
    prompt: `Write int add_file(struct kobject *kobj, const struct attribute *attr) that creates one sysfs file under kobj from a single attribute. Return the result of the create call. Use the function meant for adding one attribute (not a whole group).`,
    hints: [
      'sysfs_create_file(kobj, attr) adds exactly one attribute.',
      'It returns 0 on success or a negative errno.',
    ],
    solution: `#include <linux/sysfs.h>
#include <linux/kobject.h>

int add_file(struct kobject *kobj, const struct attribute *attr)
{
    return sysfs_create_file(kobj, attr);
}`,
    starter: `#include <linux/sysfs.h>
#include <linux/kobject.h>

int add_file(struct kobject *kobj, const struct attribute *attr)
{
    // TODO: create one sysfs file from attr under kobj
    return 0;
}`,
    tags: ['kernel', 'sysfs', 'attribute'],
  },
  {
    id: 'lx-ch13-c-012',
    chapter: 13,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Remove a sysfs File',
    prompt: `Write void del_file(struct kobject *kobj, const struct attribute *attr) that removes a single sysfs file previously created under kobj. Use the matching teardown call to sysfs_create_file.`,
    hints: [
      'sysfs_remove_file(kobj, attr) is the inverse of sysfs_create_file.',
      'Remove attributes before the kobject itself is destroyed.',
    ],
    solution: `#include <linux/sysfs.h>
#include <linux/kobject.h>

void del_file(struct kobject *kobj, const struct attribute *attr)
{
    sysfs_remove_file(kobj, attr);
}`,
    starter: `#include <linux/sysfs.h>
#include <linux/kobject.h>

void del_file(struct kobject *kobj, const struct attribute *attr)
{
    // TODO: remove the single sysfs file
}`,
    tags: ['kernel', 'sysfs', 'attribute'],
  },
  {
    id: 'lx-ch13-c-013',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Writable Attribute With store()',
    prompt: `Implement a store callback ssize_t count_store(struct kobject *kobj, struct kobj_attribute *attr, const char *buf, size_t count) backing a module-global int g_count. Parse the incoming text as a decimal integer with kstrtoint. On parse error return that error; on success set g_count and return count to consume all input.`,
    hints: [
      'kstrtoint(buf, base, &out) returns 0 or a negative errno; base 10 (or 0) is typical.',
      'A store method returns count on success so the write is fully consumed.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/kernel.h>

static int g_count;

ssize_t count_store(struct kobject *kobj, struct kobj_attribute *attr,
                    const char *buf, size_t count)
{
    int val, ret;

    ret = kstrtoint(buf, 10, &val);
    if (ret)
        return ret;

    g_count = val;
    return count;
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/kernel.h>

static int g_count;

ssize_t count_store(struct kobject *kobj, struct kobj_attribute *attr,
                    const char *buf, size_t count)
{
    // TODO: parse with kstrtoint, store into g_count, return count
    return count;
}`,
    tags: ['kernel', 'sysfs', 'store'],
  },
  {
    id: 'lx-ch13-c-014',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Read-Write Attribute Macro',
    prompt: `Define a read-write sysfs attribute named "count" backed by count_show and count_store. Use the __ATTR_RW shorthand, which assumes the callbacks are named name_show and name_store and uses mode 0644. Name the variable count_attribute.`,
    hints: [
      '__ATTR_RW(name) expands to __ATTR(name, 0644, name_show, name_store).',
      'The callback names must follow the name_show / name_store convention.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static ssize_t count_show(struct kobject *kobj,
                          struct kobj_attribute *attr, char *buf);
static ssize_t count_store(struct kobject *kobj, struct kobj_attribute *attr,
                           const char *buf, size_t count);

static struct kobj_attribute count_attribute = __ATTR_RW(count);`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

static ssize_t count_show(struct kobject *kobj,
                          struct kobj_attribute *attr, char *buf);
static ssize_t count_store(struct kobject *kobj, struct kobj_attribute *attr,
                           const char *buf, size_t count);

// TODO: define count_attribute as a read-write attribute via __ATTR_RW
`,
    tags: ['kernel', 'sysfs', 'attribute'],
  },
  {
    id: 'lx-ch13-c-015',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Define a kobj_type With Sysfs Ops',
    prompt: `Define a struct kobj_type named demo_ktype whose .release is demo_release (assume declared) and whose .sysfs_ops is the standard kobj_sysfs_ops provided by the kernel for kobj_attribute-based attributes. Leave default_groups out for now.`,
    hints: [
      'kobj_sysfs_ops dispatches show/store for struct kobj_attribute.',
      'Every ktype that frees memory needs a release callback.',
    ],
    solution: `#include <linux/kobject.h>

extern void demo_release(struct kobject *kobj);

static struct kobj_type demo_ktype = {
    .release = demo_release,
    .sysfs_ops = &kobj_sysfs_ops,
};`,
    starter: `#include <linux/kobject.h>

extern void demo_release(struct kobject *kobj);

// TODO: define demo_ktype with .release and .sysfs_ops
`,
    tags: ['kernel', 'kobject', 'ktype'],
  },
  {
    id: 'lx-ch13-c-016',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Group Attributes Into a sysfs Group',
    prompt: `Given two existing struct kobj_attribute variables count_attribute and version_attribute, build a struct attribute_group named demo_group whose .attrs is a NULL-terminated array of pointers to the two attributes' .attr members. Declare the array as static.`,
    hints: [
      'attribute_group.attrs is an array of struct attribute * ending in NULL.',
      'For kobj_attribute, take the address of its embedded .attr field.',
    ],
    solution: `#include <linux/sysfs.h>
#include <linux/kobject.h>

extern struct kobj_attribute count_attribute;
extern struct kobj_attribute version_attribute;

static struct attribute *demo_attrs[] = {
    &count_attribute.attr,
    &version_attribute.attr,
    NULL,
};

static struct attribute_group demo_group = {
    .attrs = demo_attrs,
};`,
    starter: `#include <linux/sysfs.h>
#include <linux/kobject.h>

extern struct kobj_attribute count_attribute;
extern struct kobj_attribute version_attribute;

// TODO: build a NULL-terminated attrs array and a demo_group referencing it
`,
    tags: ['kernel', 'sysfs', 'group'],
  },
  {
    id: 'lx-ch13-c-017',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Create and Tear Down a sysfs Group',
    prompt: `Write int add_group(struct kobject *kobj, const struct attribute_group *grp) that installs an attribute group under kobj and returns the result, and void del_group(struct kobject *kobj, const struct attribute_group *grp) that removes it. Use the group create/remove APIs.`,
    hints: [
      'sysfs_create_group / sysfs_remove_group operate on a whole group at once.',
      'Always pair a create with the matching remove on teardown.',
    ],
    solution: `#include <linux/sysfs.h>
#include <linux/kobject.h>

int add_group(struct kobject *kobj, const struct attribute_group *grp)
{
    return sysfs_create_group(kobj, grp);
}

void del_group(struct kobject *kobj, const struct attribute_group *grp)
{
    sysfs_remove_group(kobj, grp);
}`,
    starter: `#include <linux/sysfs.h>
#include <linux/kobject.h>

int add_group(struct kobject *kobj, const struct attribute_group *grp)
{
    // TODO: create the group under kobj
    return 0;
}

void del_group(struct kobject *kobj, const struct attribute_group *grp)
{
    // TODO: remove the group
}`,
    tags: ['kernel', 'sysfs', 'group'],
  },
  {
    id: 'lx-ch13-c-018',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Define a Device Attribute With DEVICE_ATTR',
    prompt: `Define a read-write device attribute named "speed" using the DEVICE_ATTR_RW macro, which expects callbacks speed_show and speed_store with the struct device * signature. Declare those callbacks (prototypes) then the attribute. The macro creates a variable named dev_attr_speed.`,
    hints: [
      'DEVICE_ATTR_RW(name) needs name_show(struct device *, struct device_attribute *, char *) and name_store(...).',
      'It defines a struct device_attribute called dev_attr_<name>.',
    ],
    solution: `#include <linux/device.h>

static ssize_t speed_show(struct device *dev,
                          struct device_attribute *attr, char *buf);
static ssize_t speed_store(struct device *dev, struct device_attribute *attr,
                           const char *buf, size_t count);

static DEVICE_ATTR_RW(speed);`,
    starter: `#include <linux/device.h>

static ssize_t speed_show(struct device *dev,
                          struct device_attribute *attr, char *buf);
static ssize_t speed_store(struct device *dev, struct device_attribute *attr,
                           const char *buf, size_t count);

// TODO: define dev_attr_speed with DEVICE_ATTR_RW
`,
    tags: ['kernel', 'sysfs', 'device'],
  },
  {
    id: 'lx-ch13-c-019',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Add a Device Attribute in probe()',
    prompt: `In a probe function you have struct device *dev = &pdev->dev and a defined DEVICE_ATTR_RW(speed) giving dev_attr_speed. Write int my_probe(struct platform_device *pdev) that creates the speed file with device_create_file and returns its result (0 or the error).`,
    hints: [
      'device_create_file(dev, &dev_attr_speed) adds one device attribute file.',
      'Return the function result directly so probe fails if creation fails.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/device.h>

extern struct device_attribute dev_attr_speed;

int my_probe(struct platform_device *pdev)
{
    return device_create_file(&pdev->dev, &dev_attr_speed);
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/device.h>

extern struct device_attribute dev_attr_speed;

int my_probe(struct platform_device *pdev)
{
    // TODO: create the speed device file and return the result
    return 0;
}`,
    tags: ['kernel', 'sysfs', 'device'],
  },
  {
    id: 'lx-ch13-c-020',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match Platform Devices by Name',
    prompt: `Assemble a struct platform_driver named my_driver whose .probe is my_probe, .remove is my_remove (assume declared), and whose .driver has .name set to "my-widget" and .owner set to THIS_MODULE. This name is used to match against legacy platform-device names.`,
    hints: [
      'The embedded struct device_driver holds .name and .owner.',
      'For non-DT matching, the device name and driver .name must be equal.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/module.h>

extern int my_probe(struct platform_device *pdev);
extern void my_remove(struct platform_device *pdev);

static struct platform_driver my_driver = {
    .probe = my_probe,
    .remove = my_remove,
    .driver = {
        .name = "my-widget",
        .owner = THIS_MODULE,
    },
};`,
    starter: `#include <linux/platform_device.h>
#include <linux/module.h>

extern int my_probe(struct platform_device *pdev);
extern void my_remove(struct platform_device *pdev);

// TODO: define my_driver with probe, remove, and driver.name = "my-widget"
`,
    tags: ['kernel', 'platform', 'driver'],
  },
  {
    id: 'lx-ch13-c-021',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build an OF Match Table',
    prompt: `Define a device-tree match table struct of_device_id my_of_match[] with one entry whose .compatible is "acme,widget" and a final all-zero terminator entry. Mark it with MODULE_DEVICE_TABLE(of, my_of_match) so userspace tooling can autoload the module.`,
    hints: [
      'An of_device_id table must end with an empty { } entry.',
      'MODULE_DEVICE_TABLE(of, table) exposes the compatibles to modpost/udev.',
    ],
    solution: `#include <linux/of.h>
#include <linux/mod_devicetable.h>
#include <linux/module.h>

static const struct of_device_id my_of_match[] = {
    { .compatible = "acme,widget" },
    { }
};
MODULE_DEVICE_TABLE(of, my_of_match);`,
    starter: `#include <linux/of.h>
#include <linux/mod_devicetable.h>
#include <linux/module.h>

// TODO: define my_of_match with "acme,widget" and a terminator, then export it
`,
    tags: ['kernel', 'devicetree', 'of'],
  },
  {
    id: 'lx-ch13-c-022',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Wire the OF Table Into the Driver',
    prompt: `Given a defined match table my_of_match, define struct platform_driver my_driver whose .probe is my_probe, .remove is my_remove, and whose .driver sets .name to "widget" and .of_match_table to my_of_match so device-tree matching works.`,
    hints: [
      'driver.of_match_table points the platform core at your of_device_id array.',
      'A driver can still keep a .name even when it also matches via OF.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/of.h>

extern int my_probe(struct platform_device *pdev);
extern void my_remove(struct platform_device *pdev);
extern const struct of_device_id my_of_match[];

static struct platform_driver my_driver = {
    .probe = my_probe,
    .remove = my_remove,
    .driver = {
        .name = "widget",
        .of_match_table = my_of_match,
    },
};`,
    starter: `#include <linux/platform_device.h>
#include <linux/of.h>

extern int my_probe(struct platform_device *pdev);
extern void my_remove(struct platform_device *pdev);
extern const struct of_device_id my_of_match[];

// TODO: define my_driver and set driver.of_match_table = my_of_match
`,
    tags: ['kernel', 'platform', 'of'],
  },
  {
    id: 'lx-ch13-c-023',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use the module_platform_driver Macro',
    prompt: `You have a fully defined struct platform_driver my_driver. Replace the boilerplate init/exit by emitting the single helper macro that registers and unregisters a platform driver. Write that one line.`,
    hints: [
      'module_platform_driver(driver) generates module_init/module_exit for you.',
      'It calls platform_driver_register on load and unregister on unload.',
    ],
    solution: `#include <linux/platform_device.h>

extern struct platform_driver my_driver;

module_platform_driver(my_driver);`,
    starter: `#include <linux/platform_device.h>

extern struct platform_driver my_driver;

// TODO: register/unregister my_driver with one helper macro
`,
    tags: ['kernel', 'platform', 'module'],
  },
  {
    id: 'lx-ch13-c-024',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read the Matched of_device_id in probe()',
    prompt: `Write int my_probe(struct platform_device *pdev) that looks up which OF entry matched using of_match_device(my_of_match, &pdev->dev). If no match is found return -ENODEV; otherwise return 0. Assume my_of_match is declared.`,
    hints: [
      'of_match_device returns the matching of_device_id or NULL.',
      'Returning -ENODEV signals the device is not actually for this driver.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/of_device.h>
#include <linux/errno.h>

extern const struct of_device_id my_of_match[];

int my_probe(struct platform_device *pdev)
{
    const struct of_device_id *match;

    match = of_match_device(my_of_match, &pdev->dev);
    if (!match)
        return -ENODEV;

    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/of_device.h>
#include <linux/errno.h>

extern const struct of_device_id my_of_match[];

int my_probe(struct platform_device *pdev)
{
    // TODO: of_match_device; return -ENODEV if no match, else 0
    return 0;
}`,
    tags: ['kernel', 'devicetree', 'probe'],
  },
  {
    id: 'lx-ch13-c-025',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read a u32 Property From the Device Tree',
    prompt: `In probe, read a 32-bit DT property named "clock-frequency" from the device's node. Write int my_probe(struct platform_device *pdev) that uses of_property_read_u32(pdev->dev.of_node, "clock-frequency", &freq). If it fails return the error; otherwise log freq with dev_info and return 0.`,
    hints: [
      'of_property_read_u32(node, name, &out) returns 0 or a negative errno.',
      'pdev->dev.of_node is the device tree node bound to this device.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/device.h>

int my_probe(struct platform_device *pdev)
{
    u32 freq;
    int ret;

    ret = of_property_read_u32(pdev->dev.of_node, "clock-frequency", &freq);
    if (ret)
        return ret;

    dev_info(&pdev->dev, "freq=%u\\n", freq);
    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/device.h>

int my_probe(struct platform_device *pdev)
{
    u32 freq;
    // TODO: read "clock-frequency"; on error return it, else log and return 0
    return 0;
}`,
    tags: ['kernel', 'devicetree', 'property'],
  },
  {
    id: 'lx-ch13-c-026',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Stash Driver Data With platform_set_drvdata',
    prompt: `In probe you allocate a struct widget *w with devm_kzalloc(&pdev->dev, sizeof(*w), GFP_KERNEL). Write int my_probe(struct platform_device *pdev) that allocates it, returns -ENOMEM on failure, attaches it to the device with platform_set_drvdata, and returns 0.`,
    hints: [
      'devm_kzalloc ties the allocation lifetime to the device; no manual free needed.',
      'platform_set_drvdata(pdev, ptr) lets remove() retrieve the data later.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct widget { int dummy; };

int my_probe(struct platform_device *pdev)
{
    struct widget *w;

    w = devm_kzalloc(&pdev->dev, sizeof(*w), GFP_KERNEL);
    if (!w)
        return -ENOMEM;

    platform_set_drvdata(pdev, w);
    return 0;
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/slab.h>
#include <linux/errno.h>

struct widget { int dummy; };

int my_probe(struct platform_device *pdev)
{
    struct widget *w;

    // TODO: devm_kzalloc, check NULL -> -ENOMEM, set drvdata, return 0
    return 0;
}`,
    tags: ['kernel', 'platform', 'drvdata'],
  },
  {
    id: 'lx-ch13-c-027',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Retrieve Driver Data in remove()',
    prompt: `Write void my_remove(struct platform_device *pdev) that fetches the previously stored struct widget * with platform_get_drvdata and logs its address with dev_info on &pdev->dev. The widget was allocated with devm_kzalloc, so do not free it here.`,
    hints: [
      'platform_get_drvdata(pdev) returns whatever platform_set_drvdata stored.',
      'devm-managed memory is freed automatically after remove returns.',
    ],
    solution: `#include <linux/platform_device.h>
#include <linux/device.h>

struct widget { int dummy; };

void my_remove(struct platform_device *pdev)
{
    struct widget *w = platform_get_drvdata(pdev);

    dev_info(&pdev->dev, "widget=%px\\n", w);
}`,
    starter: `#include <linux/platform_device.h>
#include <linux/device.h>

struct widget { int dummy; };

void my_remove(struct platform_device *pdev)
{
    // TODO: get drvdata and log it; do not free (devm-managed)
}`,
    tags: ['kernel', 'platform', 'drvdata'],
  },
  {
    id: 'lx-ch13-c-028',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Create a Standalone kset',
    prompt: `Write a function struct kset *make_kset(void) that creates a kset named "demoset" placed under /sys/kernel using kset_create_and_add. Pass NULL for the uevent_ops and use kernel_kobj as the parent kobject. Return the kset pointer (NULL on failure).`,
    hints: [
      'kset_create_and_add(name, uevent_ops, parent_kobj) creates and registers a kset.',
      'kernel_kobj corresponds to /sys/kernel.',
    ],
    solution: `#include <linux/kobject.h>

struct kset *make_kset(void)
{
    return kset_create_and_add("demoset", NULL, kernel_kobj);
}`,
    starter: `#include <linux/kobject.h>

struct kset *make_kset(void)
{
    // TODO: create and add the "demoset" kset under kernel_kobj
    return NULL;
}`,
    tags: ['kernel', 'kset', 'sysfs'],
  },
  {
    id: 'lx-ch13-c-029',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Create a Directory kobject Under /sys/kernel',
    prompt: `Write struct kobject *make_dir(void) that creates a plain sysfs directory named "demo" directly under /sys/kernel using kobject_create_and_add with kernel_kobj as parent. Return the kobject (NULL on failure).`,
    hints: [
      'kobject_create_and_add(name, parent) makes a simple directory kobject.',
      'It is the easy path when you do not need a custom ktype.',
    ],
    solution: `#include <linux/kobject.h>

struct kobject *make_dir(void)
{
    return kobject_create_and_add("demo", kernel_kobj);
}`,
    starter: `#include <linux/kobject.h>

struct kobject *make_dir(void)
{
    // TODO: create the "demo" directory kobject under kernel_kobj
    return NULL;
}`,
    tags: ['kernel', 'kobject', 'sysfs'],
  },
  {
    id: 'lx-ch13-c-030',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Emit a Custom uevent From a kobject',
    prompt: `Write int notify_change(struct kobject *kobj) that sends a KOBJ_CHANGE uevent for kobj so udev sees the event. Use kobject_uevent and return its result.`,
    hints: [
      'kobject_uevent(kobj, action) posts a netlink event consumed by udev.',
      'KOBJ_ADD, KOBJ_REMOVE, and KOBJ_CHANGE are common actions.',
    ],
    solution: `#include <linux/kobject.h>

int notify_change(struct kobject *kobj)
{
    return kobject_uevent(kobj, KOBJ_CHANGE);
}`,
    starter: `#include <linux/kobject.h>

int notify_change(struct kobject *kobj)
{
    // TODO: send a KOBJ_CHANGE uevent for kobj
    return 0;
}`,
    tags: ['kernel', 'uevent', 'udev'],
  },
  {
    id: 'lx-ch13-c-031',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Add a Variable to a uevent Environment',
    prompt: `Implement a bus/device uevent callback int my_uevent(const struct device *dev, struct kobj_uevent_env *env) that adds the environment variable MODE=fast to the event with add_uevent_var, then returns 0. Propagate any error from add_uevent_var.`,
    hints: [
      'add_uevent_var(env, "KEY=VALUE") appends a variable to the uevent.',
      'Returning the helper error lets the core abort if the env buffer is full.',
    ],
    solution: `#include <linux/device.h>
#include <linux/kobject.h>

int my_uevent(const struct device *dev, struct kobj_uevent_env *env)
{
    int ret;

    ret = add_uevent_var(env, "MODE=fast");
    if (ret)
        return ret;

    return 0;
}`,
    starter: `#include <linux/device.h>
#include <linux/kobject.h>

int my_uevent(const struct device *dev, struct kobj_uevent_env *env)
{
    // TODO: add_uevent_var "MODE=fast"; propagate error; return 0
    return 0;
}`,
    tags: ['kernel', 'uevent', 'udev'],
  },
  {
    id: 'lx-ch13-c-032',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate a store() With a Range Check',
    prompt: `Write a store callback ssize_t level_store(struct kobject *kobj, struct kobj_attribute *attr, const char *buf, size_t count) for a module int g_level. Parse with kstrtoint, return the parse error on failure, and return -EINVAL if the value is outside 0..10 inclusive. On success store it and return count.`,
    hints: [
      'Reject bad input by returning -EINVAL so the userspace write fails.',
      'Parse first, then validate the range before committing the value.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/kernel.h>
#include <linux/errno.h>

static int g_level;

ssize_t level_store(struct kobject *kobj, struct kobj_attribute *attr,
                    const char *buf, size_t count)
{
    int val, ret;

    ret = kstrtoint(buf, 10, &val);
    if (ret)
        return ret;

    if (val < 0 || val > 10)
        return -EINVAL;

    g_level = val;
    return count;
}`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>
#include <linux/kernel.h>
#include <linux/errno.h>

static int g_level;

ssize_t level_store(struct kobject *kobj, struct kobj_attribute *attr,
                    const char *buf, size_t count)
{
    // TODO: kstrtoint; reject out-of-range 0..10 with -EINVAL; store; return count
    return count;
}`,
    tags: ['kernel', 'sysfs', 'store'],
  },
  {
    id: 'lx-ch13-c-033',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use default_groups in a ktype',
    prompt: `Given a NULL-terminated array static const struct attribute_group *demo_groups[] holding one group, define struct kobj_type demo_ktype with .release = demo_release, .sysfs_ops = &kobj_sysfs_ops, and .default_groups = demo_groups so the attributes appear automatically when the kobject is added. Assume demo_group and demo_release are declared.`,
    hints: [
      '.default_groups lets the core create the attribute files at kobject_add time.',
      'The groups array, like attrs, is NULL-terminated.',
    ],
    solution: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern void demo_release(struct kobject *kobj);
extern const struct attribute_group demo_group;

static const struct attribute_group *demo_groups[] = {
    &demo_group,
    NULL,
};

static struct kobj_type demo_ktype = {
    .release = demo_release,
    .sysfs_ops = &kobj_sysfs_ops,
    .default_groups = demo_groups,
};`,
    starter: `#include <linux/kobject.h>
#include <linux/sysfs.h>

extern void demo_release(struct kobject *kobj);
extern const struct attribute_group demo_group;

// TODO: build demo_groups and a ktype using .default_groups
`,
    tags: ['kernel', 'kobject', 'ktype'],
  },
  {
    id: 'lx-ch13-c-034',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Register a Custom Bus Type',
    prompt: `Define a struct bus_type named demo_bus with .name set to "demo" and a .match callback named demo_match (assume declared with signature int demo_match(struct device *dev, struct device_driver *drv)). Then write int demo_bus_init(void) that registers the bus with bus_register and returns its result.`,
    hints: [
      'bus_register(&bus) makes the bus visible under /sys/bus.',
      'The .match callback decides whether a driver can bind to a device on this bus.',
    ],
    solution: `#include <linux/device.h>
#include <linux/device/bus.h>

extern int demo_match(struct device *dev, struct device_driver *drv);

static struct bus_type demo_bus = {
    .name = "demo",
    .match = demo_match,
};

int demo_bus_init(void)
{
    return bus_register(&demo_bus);
}`,
    starter: `#include <linux/device.h>
#include <linux/device/bus.h>

extern int demo_match(struct device *dev, struct device_driver *drv);

// TODO: define demo_bus (name "demo", match demo_match) and a bus_register wrapper
`,
    tags: ['kernel', 'bus', 'driver-model'],
  },
  {
    id: 'lx-ch13-c-035',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match a Device by compatible String',
    prompt: `Write a bus match callback int demo_match(struct device *dev, struct device_driver *drv) that returns 1 (match) when dev's device-tree node is compatible with the string "acme,widget", else 0. Use of_device_is_compatible(dev->of_node, ...), which returns nonzero on a match. Normalize to 1 or 0.`,
    hints: [
      'of_device_is_compatible(node, str) checks the node compatible list.',
      'A match function returns nonzero to allow binding; normalize with !!.',
    ],
    solution: `#include <linux/device.h>
#include <linux/of.h>

int demo_match(struct device *dev, struct device_driver *drv)
{
    return !!of_device_is_compatible(dev->of_node, "acme,widget");
}`,
    starter: `#include <linux/device.h>
#include <linux/of.h>

int demo_match(struct device *dev, struct device_driver *drv)
{
    // TODO: return 1 if dev->of_node is compatible with "acme,widget", else 0
    return 0;
}`,
    tags: ['kernel', 'bus', 'devicetree'],
  },
]

export default problems
