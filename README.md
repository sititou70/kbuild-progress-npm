# kbuild-progress

[![npm version](https://badge.fury.io/js/kbuild-progress.svg)](https://badge.fury.io/js/kbuild-progress)

The progress bar for Linux kernel building.

## install

`npm install -g kbuild-progress`

## usage

`kbuild-progress [kernel make arguments...]`

1. Move to your Linux kernel source tree.
1. Setup .config file and make kernel.
1. Run kbuild-progress, then this tool will begin to monitor kernel building progress. I recommend doing this step in another terminal session(eg. another terminal tab, tmux window or pane).

### example

```
[tab1]
$ cd linux-5.6.7
$ make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- defconfig
$ make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- -j4 vmlinux
```

```
[tab2]
$ cd linux-5.6.7
$ kbuild-progress ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- -j4 vmlinux
```

## Licence

MIT
