import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-lx-05',
  track: 'linux',
  chapter: 5,
  title: 'Building & Booting the Kernel',
  summary: `This chapter turns you from someone who reads kernel source into someone who can build it, boot it, and watch it run. You will learn how the source tree is laid out, how Kconfig and menuconfig turn thousands of options into a .config, how make and Kbuild compile that into vmlinux and bzImage, and how to boot the result safely inside QEMU instead of on real hardware. By the end you can change a line of kernel code, rebuild only what changed, boot it in seconds, pass it a kernel command line, give it an initramfs to reach a shell, and read its boot log with dmesg. This is the core feedback loop every kernel contributor lives in.`,
  sections: [
    {
      heading: 'The kernel source tree',
      body: `The Linux kernel is one enormous Git repository - tens of millions of lines across tens of thousands of files - but it is organized so consistently that you can navigate it by intuition once you know the top-level directories. Cloning Linus Torvalds' tree gives you the *mainline*; most contributors instead work from a *subsystem maintainer's* tree or from *linux-next*, the integration tree where everything destined for the next release is staged.

The top-level layout is worth memorizing because almost every patch you read or write touches one of these:

- **arch/** - architecture-specific code, one subdirectory per CPU family (x86, arm64, riscv, powerpc). The early boot assembly, page-table layout, and per-arch syscall entry live here. When you build, you pick an architecture and only its subtree is compiled.
- **kernel/** - the architecture-independent core: the scheduler, timers, the syscall dispatch layer, locking, tracing, and the module loader.
- **mm/** - memory management: the page allocator, slab allocators, virtual memory, and page-fault handling.
- **fs/** - the virtual filesystem layer plus every concrete filesystem (ext4, btrfs, xfs, the proc and sysfs pseudo-filesystems).
- **drivers/** - by far the largest directory; the vast majority of kernel code is device drivers. Most first contributions land here.
- **net/** - the networking stack, from sockets down to individual protocols.
- **include/** - shared headers. include/linux holds internal kernel headers; include/uapi holds the *user-space ABI* - structures and constants that user programs depend on and that therefore can never break.
- **Documentation/** - in-tree docs, increasingly in reStructuredText and buildable with make htmldocs. Read this before asking; maintainers expect it.
- **scripts/** - build and maintenance tooling, including the Kconfig parsers, the checkpatch.pl style checker, and get_maintainer.pl.
- **tools/** - user-space programs that ship with the kernel (perf, some selftests, and the rust bindgen helpers).
- **rust/** - the Rust support layer: the kernel crate, generated bindings, and the abstractions that let drivers be written in Rust. This is where Rust-for-Linux work concentrates.

The single most useful habit is to run get_maintainer.pl on any file you change: it tells you which humans and which mailing lists must receive your patch. Sending a patch to the wrong list is the most common reason a first contribution is silently ignored.

> Pitfall: never edit files under include/uapi casually. That directory is the contract with every program ever compiled against Linux. Breaking it breaks user space, and Linus's first rule is that you do not break user space.`,
      code: [
        {
          lang: 'c',
          src: `// Getting and exploring the source (shell commands):
//
//   # Mainline (Linus's tree) - big, ~ a few GB with history:
//   git clone https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
//
//   # A shallow clone if you only need a quick build (no history):
//   git clone --depth=1 https://git.kernel.org/.../torvalds/linux.git
//
//   cd linux
//   git log --oneline -5            # recent commits
//   make kernelversion             # prints e.g. 6.9.0
//
//   # Who must review a change to a given file?
//   ./scripts/get_maintainer.pl drivers/char/random.c
//
//   # Style-check a patch before you ever send it:
//   ./scripts/checkpatch.pl --strict 0001-my-change.patch`
        }
      ]
    },
    {
      heading: 'Kconfig and menuconfig: choosing what to build',
      body: `A kernel is not one program; it is a menu of thousands of optional features that you select before compiling. Each option is declared in a **Kconfig** file - there is roughly one Kconfig per directory, and they include one another to form a single giant tree of choices. The Kconfig language describes each option's type, its human-readable prompt, its help text, and crucially its *dependencies* on other options.

An option can be one of three kinds, and understanding the third is what separates beginners from people who actually know the build:

- **bool** - the feature is either compiled in (y) or left out (n).
- **tristate** - the feature can be built in (y), built as a loadable *module* (m), or left out (n). Modules are .ko files loaded at runtime, which keeps the core kernel small and lets distributions ship one kernel that supports thousands of devices without loading drivers for hardware you do not have.
- **string / int / hex** - a value rather than a switch, such as a default hostname or a buffer size.

Dependencies matter because options are not independent. The keyword depends on hides an option until its prerequisite is enabled; select force-enables another option; and reverse dependencies can pull in code you did not consciously choose. This is why you cannot simply turn on a driver - if its bus or framework is disabled, the option will not even appear.

You rarely edit the resulting .config by hand. Instead you run a configurator that reads the Kconfig tree, presents the choices, enforces the dependencies, and writes a valid .config:

- **make menuconfig** - the classic text-based menu (needs the ncurses development library). This is what most people use over SSH.
- **make nconfig** - a newer ncurses interface with inline search.
- **make xconfig** - a Qt graphical version.
- **make oldconfig** - takes an existing .config and asks you only about options that are new since it was written; indispensable when you move to a newer kernel.
- **make olddefconfig** - the non-interactive cousin: accepts the default for every new option silently. This is what scripts and CI use.

A few generated *defconfig* targets give you a sane starting point so you do not answer thousands of questions. make defconfig produces the maintainer's recommended config for your architecture; make x86_64_defconfig is the explicit x86-64 one; make allmodconfig builds everything possible as a module (great for catching compile errors across the tree).

When you are debugging a build, the search feature inside menuconfig (press the slash key) is your best friend: type a symbol name like RANDOM and it shows the option, its current state, its dependencies, and exactly which other options you must enable to make it selectable.

> Pitfall: editing .config by hand and then building can silently drop your change, because the build re-runs oldconfig and may revert options whose dependencies are not met. Use the menus, or use the scripts/config helper, so dependencies stay consistent.`,
      code: [
        {
          lang: 'c',
          src: `// Typical Kconfig entry (in some drivers/.../Kconfig file):
//
// config MY_SENSOR
//        tristate "Acme temperature sensor support"
//        depends on I2C            // only offered if I2C bus is enabled
//        select REGMAP_I2C         // force-enables the regmap helper
//        default n
//        help
//          Driver for the Acme I2C temperature sensor.
//          To compile as a module choose M; the module is my_sensor.ko.
//
// Configuring the build (shell):
//
//   make x86_64_defconfig     # sane baseline config for x86-64
//   make menuconfig           # interactive menu; '/' to search a symbol
//   make olddefconfig         # accept defaults for any new options (CI-safe)
//
// Non-interactively flipping one option with the helper script:
//
//   ./scripts/config --enable  CONFIG_DEBUG_INFO
//   ./scripts/config --module  CONFIG_MY_SENSOR     # build as a module (=m)
//   ./scripts/config --disable CONFIG_DRM           // turn a feature off
//   make olddefconfig                               // re-resolve dependencies`
        }
      ]
    },
    {
      heading: 'make and Kbuild: how the tree compiles',
      body: `The kernel does not use plain Makefiles you would recognize from a small C project. It uses **Kbuild**, a layer built on top of GNU make that turns the simple lists in each directory's Makefile into a correct, parallel, incremental build of the whole tree. As a contributor you mostly write one or two lines in a Makefile, but knowing what Kbuild does with them prevents a lot of confusion.

The central idea is the **obj-** lists. In a directory's Makefile you append object files to a variable whose suffix is itself a config symbol:

- obj-y += foo.o means foo.o is built into the kernel image.
- obj-m += bar.o means bar.o is built as a loadable module (bar.ko).
- obj-(CONFIG_BAZ) += baz.o means baz.o is built as y, m, or not at all, exactly mirroring how the user set CONFIG_BAZ in menuconfig. This single trick is how a Kconfig choice automatically controls compilation - the same symbol name drives both the menu and the Makefile.

Some make targets and variables you will use every day:

- make -j$(nproc) builds with one job per CPU. The kernel build is embarrassingly parallel; forgetting -j makes a build take ten times longer than it should.
- make modules and make modules_install build and install the .ko files (into /lib/modules/VERSION by default).
- make clean removes build artifacts but keeps your .config; make mrproper removes nearly everything including .config (use it when a build is mysteriously broken); make distclean is the most aggressive.
- O=builddir puts all output in a separate directory, keeping your source tree pristine and letting you keep several configs side by side.
- ARCH= and CROSS_COMPILE= select the target architecture and toolchain prefix for cross-compiling - for example building an arm64 kernel on an x86-64 laptop.
- V=1 makes the build verbose so you can see the exact compiler command lines, which is essential when you are debugging flags.

Kbuild is *incremental*: it tracks dependencies (including which .config options each file depends on) and recompiles only what actually changed. Change one .c file and the rebuild is seconds, not the twenty-plus minutes of a full build. This is what makes the edit-build-boot loop fast enough to be pleasant.

For Rust in the kernel, Kbuild gained rules that invoke rustc and bindgen. You enable CONFIG_RUST (which requires a matching rustc version, the rust-src component, and bindgen), and then Rust source files participate in the same obj- lists as C. Run make rustavailable to have the build tell you exactly which prerequisite is missing if Rust support refuses to turn on.

> Pitfall: a stale build is the classic time-sink. If you see linker errors or symbols that should exist but do not, especially after changing .config or switching branches, run make clean (or make mrproper and reconfigure) before assuming the bug is real.`,
      code: [
        {
          lang: 'c',
          src: `// A real directory Makefile is mostly these obj- lines:
//
//   obj-y                    += core.o helpers.o
//   obj-$(CONFIG_MY_SENSOR)  += my_sensor.o      # y, m, or nothing
//   obj-$(CONFIG_FEATURE_X)  += featx/           # descend into a subdir
//
// Building (shell):
//
//   make -j$(nproc)                 # parallel build of vmlinux + image
//   make -j$(nproc) modules         # build the =m modules (.ko files)
//
// Out-of-tree build dir + cross compile (arm64 from an x86-64 host):
//
//   make O=../build-arm64 ARCH=arm64 \\
//        CROSS_COMPILE=aarch64-linux-gnu- defconfig
//   make O=../build-arm64 ARCH=arm64 \\
//        CROSS_COMPILE=aarch64-linux-gnu- -j$(nproc)
//
//   make V=1 ...                    # show full compiler command lines
//   make rustavailable             # diagnose Rust toolchain prerequisites`
        }
      ]
    },
    {
      heading: 'vmlinux vs bzImage: the build products',
      body: `A successful build produces several files, and people constantly confuse two of them. Knowing the difference tells you which file to boot, which to debug with, and why the kernel decompresses itself at startup.

**vmlinux** is the raw, fully linked kernel as a standard ELF executable. It contains every symbol, and if you built with CONFIG_DEBUG_INFO it also contains DWARF debug information. It is *not* directly bootable on a normal PC and it is *not* compressed. Its real value is as the artifact you point your tools at: gdb uses vmlinux to map addresses in a crash back to function names and source lines, and tools like objdump and the kernel's own scripts read it. Think of vmlinux as the source of truth and the debugging reference.

**bzImage** ("big zImage") is the bootable image for x86. It is vmlinux stripped of debug info, *compressed*, and wrapped together with a small *real-mode setup* stub and a *self-decompressor*. When the firmware or bootloader hands control to a bzImage, that stub runs first, sets up the CPU, decompresses the real kernel into memory, and jumps into it. The "bz" does not mean bzip2 - it means "big zImage", a format that lifted the 512 KB size limit of the old zImage. The actual compression can be gzip, xz, lz4, zstd, and others, chosen in Kconfig; faster decompression versus smaller size is the trade-off.

Where these land depends on architecture. On x86 the bootable image is arch/x86/boot/bzImage. On arm64 the equivalent is arch/arm64/boot/Image (uncompressed) or Image.gz. The vmlinux file always sits at the top of the build directory. The build also emits System.map (a text table of symbol addresses, used by tools and for decoding oops messages) and, when configured, separate .ko module files.

The practical takeaway: you boot the bzImage (or Image), but you keep the matching vmlinux around so that when something crashes you can translate the hexadecimal addresses in the log back into the exact line of code. The two files must come from the same build - a vmlinux from a different build will give you misleading symbol names.

> Pitfall: do not try to boot vmlinux directly on QEMU's default x86 path and expect it to work like bzImage. Also, never mix a vmlinux and bzImage from different builds when debugging; the addresses will not line up and you will chase ghosts.`,
      code: [
        {
          lang: 'c',
          src: `// After a successful x86-64 build, the key outputs:
//
//   vmlinux                       // ELF, uncompressed, has symbols+DWARF
//   arch/x86/boot/bzImage         // compressed, bootable image
//   System.map                    // symbol -> address text table
//   .config                       // the configuration that produced this
//   drivers/foo/foo.ko            // any modules built as =m
//
// Inspecting them (shell):
//
//   file vmlinux                  // -> ELF 64-bit ... not stripped
//   file arch/x86/boot/bzImage    // -> Linux kernel x86 boot executable bzImage
//
//   # Symbolize a crash address against the matching vmlinux:
//   gdb vmlinux
//   (gdb) list *(some_function+0x4a)
//
//   # Confirm the compression chosen for the image:
//   grep CONFIG_KERNEL_ /.config   // e.g. CONFIG_KERNEL_ZSTD=y`
        }
      ]
    },
    {
      heading: 'Booting in QEMU',
      body: `You almost never test a freshly built kernel on your real machine first. A kernel bug can wedge or corrupt the host; iterating on hardware means a reboot every cycle. Instead you boot inside **QEMU**, a CPU emulator and virtual machine, which gives you a clean disposable computer that starts in seconds and that you can kill instantly if the kernel panics. This is the single most important productivity tool in kernel development.

QEMU can boot a kernel image *directly* with the -kernel flag, skipping the bootloader entirely. You hand it your bzImage (or arm64 Image), optionally an initramfs with -initrd, and the kernel command line with -append. QEMU loads the kernel, jumps into it, and you watch the boot.

The flags you will use constantly:

- -kernel path/to/bzImage - the image to boot.
- -append "..." - the kernel command line (covered next section); typically you put console=ttyS0 here so output goes to the serial port.
- -nographic - drop the emulated graphics window and wire the guest's serial console straight to your terminal. Combined with console=ttyS0 you see the entire boot log inline and can interact with the guest shell in the same window. To exit, the escape is Ctrl-a then x.
- -m 512M - guest RAM.
- -smp 4 - number of virtual CPUs; useful for shaking out SMP and locking bugs.
- -initrd path - supply an initramfs/initrd image.
- -enable-kvm - use hardware virtualization on a matching host architecture for near-native speed. Drop it when emulating a *different* architecture (for example running an arm64 guest on an x86 host), where QEMU must interpret instructions.
- -s -S - shorthand for "open a gdb stub on port 1234" and "freeze the CPU at start". You then attach gdb to vmlinux and set breakpoints before the kernel has executed a single instruction - this is how you single-step early boot.

A minimal but genuinely useful invocation directs the console to serial and runs headless, so the kernel's own messages stream into your terminal. If the kernel boots but cannot find a root filesystem it will *panic* - that is expected until you give it an initramfs (next sections). The serial console is also why console=ttyS0 belongs on the command line: without it the kernel prints to the virtual VGA screen, which -nographic is not showing you, and your terminal stays blank even though the kernel is running fine.

For repeatable work, virtme-ng (a wrapper around QEMU widely used by kernel developers) can boot the kernel you just built using your host's own filesystem, with one short command and no image-building. It is worth adopting once you understand the raw QEMU flags underneath it.

> Pitfall: a blank terminal under -nographic almost always means you forgot console=ttyS0 in -append, not that the kernel hung. And remember the exit sequence is Ctrl-a then x - new users often cannot figure out how to quit QEMU.`,
      code: [
        {
          lang: 'c',
          src: `// Boot a freshly built x86-64 kernel headless, console on serial:
//
//   qemu-system-x86_64 \\
//     -kernel arch/x86/boot/bzImage \\
//     -append "console=ttyS0" \\
//     -nographic \\
//     -m 512M -smp 2
//   // (with no rootfs it will panic - that is expected for now)
//   // exit QEMU with: Ctrl-a, then x
//
// Same, but with an initramfs so we reach a shell (see later sections):
//
//   qemu-system-x86_64 \\
//     -kernel arch/x86/boot/bzImage \\
//     -initrd initramfs.cpio.gz \\
//     -append "console=ttyS0 rdinit=/init" \\
//     -nographic -m 512M
//
// Attach gdb to early boot (two terminals):
//
//   qemu-system-x86_64 -kernel arch/x86/boot/bzImage -append "console=ttyS0" \\
//                      -nographic -s -S
//   # other terminal:
//   gdb vmlinux -ex 'target remote :1234' -ex 'break start_kernel' -ex 'continue'`
        }
      ]
    },
    {
      heading: 'The kernel command line and initramfs',
      body: `### The kernel command line

When the kernel starts it reads a single string of space-separated parameters: the **kernel command line**. On real systems the bootloader (GRUB, systemd-boot) supplies it; under QEMU you pass it with -append. These parameters configure the kernel before any user-space process exists, and they are the fastest way to change behavior without recompiling.

The handful you will use most:

- console=ttyS0 - send kernel messages to the first serial port (what -nographic shows). You can list several consoles; the last one becomes the controlling terminal for init.
- root=/dev/sda1 (or root=PARTUUID=... or root=/dev/vda) - which block device holds the real root filesystem to mount after early boot.
- ro / rw - mount that root read-only (the normal choice, so fsck can run) or read-write.
- init=/bin/sh - override the first user-space program the kernel executes. Normally it is /sbin/init (systemd or similar); pointing it at a shell is a classic recovery and debugging trick.
- rdinit=/init - the equivalent override for the program inside an *initramfs*.
- quiet - lower the console log level so only important messages show; loglevel=7 (or higher) does the opposite and is what you want while debugging.
- nokaslr - disable kernel address-space layout randomization, which you do when debugging with gdb so that symbol addresses are stable across boots.
- panic=10 - reboot ten seconds after a panic instead of hanging forever; handy in automated test loops.

Every parameter the kernel itself understands is documented in Documentation/admin-guide/kernel-parameters.txt - read it rather than guessing. Parameters the kernel does not recognize are not errors; they are passed through to the init process as arguments or environment, which is how user space picks up its own options.

### initramfs

Here is the chicken-and-egg problem the **initramfs** solves. To mount your real root filesystem, the kernel may need a driver (for your disk controller, your RAID, your encryption) - but that driver might live as a module *on the very filesystem you cannot mount yet*. The initramfs breaks the cycle: it is a small, self-contained root filesystem that the bootloader loads into RAM alongside the kernel, before any disk is touched.

Technically an initramfs is a **cpio archive** (often gzip-compressed) that the kernel unpacks into a RAM-based tmpfs and uses as the initial root (/). The kernel then runs the program /init inside it. That /init script loads whatever modules are needed, finds and mounts the real root, and finally hands off (via switch_root or pivot_root) to the real system. The older mechanism was an "initrd" - a whole disk *image* the kernel mounted as a block device; initramfs (a plain archive unpacked into tmpfs) replaced it and is simpler and more flexible, though the -initrd QEMU flag and the kernel option keep the old name.

For learning and for QEMU testing you do not need a distribution's elaborate initramfs. You can build a tiny one by hand: take a single statically linked shell (busybox is the standard choice because one binary provides sh, ls, mount, and dozens of other tools), make it the file /init, pack the directory into a cpio archive, and pass it with -initrd. The kernel unpacks it, runs /init, and you get an interactive shell inside your own freshly built kernel - no disk, no distribution, just the kernel and a shell. That is the smallest possible complete boot, and it is the perfect playground for kernel work.

> Pitfall: the cpio archive must use the *newc* format and the program at /init must be present and executable; a statically linked busybox avoids the trap of missing shared libraries (a dynamically linked /init that cannot find its libc will fail with a confusing panic). And if you supply an initramfs you generally want rdinit=/init (or rely on the default /init), not init=, since the latter refers to the program on the real root.`,
      code: [
        {
          lang: 'c',
          src: `// Building a minimal busybox initramfs by hand (shell):
//
//   mkdir -p initramfs/{bin,sbin,proc,sys,dev}
//   cp /path/to/busybox initramfs/bin/          // statically linked!
//   ( cd initramfs/bin && for c in sh ls mount cat dmesg; do ln -s busybox $c; done )
//
//   cat > initramfs/init <<'EOF'
//   #!/bin/sh
//   mount -t proc  none /proc
//   mount -t sysfs none /sys
//   echo "Hello from inside my own kernel!"
//   exec /bin/sh
//   EOF
//   chmod +x initramfs/init
//
//   # Pack as a newc-format cpio archive, then gzip it:
//   ( cd initramfs && find . | cpio -o -H newc | gzip ) > initramfs.cpio.gz
//
// Boot it under QEMU with a useful command line:
//
//   qemu-system-x86_64 -kernel arch/x86/boot/bzImage \\
//     -initrd initramfs.cpio.gz \\
//     -append "console=ttyS0 rdinit=/init nokaslr loglevel=7" \\
//     -nographic -m 512M`
        }
      ]
    },
    {
      heading: 'dmesg: reading the kernel log',
      body: `Everything the kernel wants to tell you - boot progress, driver probes, warnings, oopses, and your own debug prints - goes into the **kernel ring buffer**, a fixed-size in-memory log. The **dmesg** command reads and formats that buffer. It is the first place you look when anything kernel-related misbehaves, and as a contributor you will read it dozens of times an hour.

The buffer is a *ring*: it has a fixed size (set by CONFIG_LOG_BUF_SHIFT) and once full, new messages overwrite the oldest. So on a long-running system early boot messages may already be gone - which is exactly why testing in QEMU, where you see the whole log from the first line, is so convenient.

Inside the kernel, code does not call printf; it calls **printk** (and the modern wrapper macros pr_info, pr_warn, pr_err, pr_debug, and dev_info / dev_err for driver code that has a device pointer). Each message carries a *log level* from 0 (KERN_EMERG, the system is unusable) to 7 (KERN_DEBUG). The console_loglevel controls which levels actually print to the console; messages below the threshold still go into the buffer and are visible with dmesg even when they are too quiet for the live console. This is why a driver can be chatty in dmesg without spamming the boot screen.

Reading the log effectively:

- dmesg with no arguments dumps the whole buffer.
- dmesg -w (wait) follows the log live, like tail -f, so you watch messages appear as you plug in a device or load a module.
- dmesg -H gives human-friendly relative timestamps and pager-style colored output; dmesg -T converts the kernel's seconds-since-boot timestamps into wall-clock time.
- dmesg --level=err,warn filters to just errors and warnings - the fastest way to spot a problem in a noisy log.
- dmesg -l and dmesg -f filter by level and by *facility* (which subsystem emitted the message).
- dmesg -c prints then clears the buffer (needs privilege); useful to get a clean slate before reproducing a bug.

When the kernel hits a serious bug it prints an **oops** or a **panic** - a multi-line dump with a call stack, register contents, and the faulting instruction pointer. That dump lands in dmesg (and on the serial console under QEMU). The addresses and symbol+offset notation in it are what you feed back to vmlinux and gdb to find the exact failing line, closing the loop back to the build products from earlier in this chapter. Adding your own pr_info lines and watching them appear in dmesg is the simplest, most reliable kernel debugging technique there is, and it is where most contributors start.

> Pitfall: on a real distro, reading dmesg may require root because of the kernel.dmesg_restrict sysctl; under your QEMU console you are typically root already. And remember the ring buffer wraps - if early messages seem missing on a long-lived host, increase CONFIG_LOG_BUF_SHIFT or grab the log earlier; in QEMU you simply scroll back through the serial output.`,
      code: [
        {
          lang: 'c',
          src: `// Inside the kernel, you log with printk wrappers, not printf:
//
//   #include <linux/printk.h>
//
//   pr_info("mydrv: probe ok, irq=%d\\n", irq);     // KERN_INFO level
//   pr_warn("mydrv: falling back to PIO mode\\n");   // KERN_WARNING
//   pr_err("mydrv: register failed: %d\\n", ret);    // KERN_ERR
//   dev_info(&pdev->dev, "version %u\\n", ver);      // device-aware variant
//
// Reading the log from user space (shell):
//
//   dmesg                       // dump the whole ring buffer
//   dmesg -w                    // follow new messages live (tail -f style)
//   dmesg -H                    // human timestamps + paged, colored
//   dmesg --level=err,warn      // only errors and warnings
//   dmesg -T                    // wall-clock timestamps instead of uptime
//   dmesg -c                    // print then clear the buffer (needs root)
//
//   # Spot a crash and symbolize it against the matching vmlinux:
//   dmesg | grep -A30 -i 'BUG\\|oops\\|panic\\|call trace'`
        }
      ]
    }
  ],
  takeaways: [
    'The source tree is laid out by subsystem (arch, kernel, mm, fs, drivers, net, include/uapi, rust); run scripts/get_maintainer.pl before sending any patch.',
    'Kconfig declares options as bool, tristate (y/m/n), or value; menuconfig (or olddefconfig for CI) writes a dependency-consistent .config - edit configs through the tools, not by hand.',
    'Kbuild drives the build through obj-$(CONFIG_X) lists, so one config symbol controls both the menu and what gets compiled; always build with -j$(nproc), and it rebuilds only what changed.',
    'vmlinux is the uncompressed ELF with symbols for debugging; bzImage (x86) / Image (arm64) is the compressed, bootable, self-decompressing image - keep the matching pair.',
    'QEMU with -kernel, -nographic, and console=ttyS0 boots your image headless in seconds; -s -S opens a gdb stub for stepping early boot. Exit with Ctrl-a then x.',
    'The kernel command line (console=, root=, init=/rdinit=, quiet, nokaslr, panic=) configures the kernel before user space; parameters it does not know are passed on to init.',
    'An initramfs is a newc cpio archive unpacked into tmpfs as the initial root; the kernel runs /init from it, which loads drivers and mounts the real root - a statically linked busybox makes a tiny one for testing.',
    'dmesg reads the kernel ring buffer; kernel code logs with printk / pr_info / pr_err at log levels 0-7, and oops/panic dumps are symbolized back to source via vmlinux and gdb.',
    'The whole edit-build-boot-read loop (change code, make -j, qemu, dmesg) is the daily heartbeat of kernel development - make it fast and you will iterate fearlessly.'
  ],
  cheatsheet: [
    { label: 'git clone torvalds/linux', value: 'Get the mainline source tree' },
    { label: 'scripts/get_maintainer.pl FILE', value: 'Who/what list to send a patch to' },
    { label: 'make x86_64_defconfig', value: 'Sane baseline .config for x86-64' },
    { label: 'make menuconfig', value: 'Interactive config menu; / to search a symbol' },
    { label: 'make olddefconfig', value: 'Accept defaults for new options (CI-safe)' },
    { label: 'make -j$(nproc)', value: 'Parallel build of vmlinux and boot image' },
    { label: 'make clean / mrproper', value: 'Drop artifacts / also drop .config' },
    { label: 'obj-$(CONFIG_X) += f.o', value: 'Kbuild: build f.o as y, m, or not at all' },
    { label: 'vmlinux', value: 'Uncompressed ELF with symbols, for gdb/debugging' },
    { label: 'arch/x86/boot/bzImage', value: 'Compressed bootable x86 image' },
    { label: 'qemu -kernel IMG -nographic', value: 'Boot headless; needs console=ttyS0' },
    { label: 'console=ttyS0', value: 'Kernel command line: log to serial console' },
    { label: 'rdinit=/init', value: 'First program to run inside an initramfs' },
    { label: 'find . | cpio -o -H newc | gzip', value: 'Pack an initramfs archive' },
    { label: 'dmesg -w / --level=err,warn', value: 'Follow log live / filter to problems' }
  ]
}

export default note
