dotfiles
=========

Installation
------------

1. Clone this repo

   ```shell
   git clone \
       --recurse-submodules \
       --jobs=$(( $(sysctl -n hw.ncpu) - 1 )) \
       https://github.com/h35514n/dotfiles \
       ~/.dotfiles
   ```

2. Run the bootstrap script

   ```shell
    ~/.dotfiles/bin/bootstrap
   ```

   Stick around to enter your password as needed.

   See Linux [installation notes](./linux/README.md) if needed.
