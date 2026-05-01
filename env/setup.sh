#!/usr/bin/env bash

# Homebrew setup
# -----------------------------
case "$(uname -ps)" in
  Linux*)
    MACHINE="linux"
    HOMEBREW_PREFIX="/home/linuxbrew/.linuxbrew"
  ;;
  Darwin\ arm*)
    MACHINE="apple"
    HOMEBREW_PREFIX="/opt/homebrew"
  ;;
  Darwin*)
    MACHINE="intel-mac"
    HOMEBREW_PREFIX="/usr/local"
  ;;
esac

num_cores() {
  local cores=""

  if [[ "${MACHINE}" == "linux" ]]; then
    cores="$(nproc 2>/dev/null)"
  elif command -v /usr/sbin/sysctl >/dev/null; then
    cores="$(/usr/sbin/sysctl -n hw.ncpu 2>/dev/null)"
  fi

  if [[ ! "${cores}" =~ ^[0-9]+$ ]] || [[ "${cores}" -lt 1 ]]; then
    cores=2
  fi

  echo "${cores}"
}

MACHINE_CORES="$(($(num_cores) - 1))"

if [[ "${MACHINE_CORES}" -lt 1 ]]; then
  MACHINE_CORES=1
fi

export MACHINE
export MACHINE_CORES
export HOMEBREW_PREFIX

if [ -z "${DOTFILES_DIR}" ]; then
  echo "ERROR: DOTFILES_DIR not set in $0"
  exit 1
fi

# XDG setup
# -----------------------------
source "${DOTFILES_DIR}/env/xdg.core.sh"
source "${DOTFILES_DIR}/env/xdg.apps.sh"

# Environment setup
# -----------------------------

if [[ "${MACHINE}" == "apple" ]] || [[ "${MACHINE}" == "intel-mac" ]]; then
  source "${DOTFILES_DIR}/env/build.sh"
elif [[ "${MACHINE}" == "linux" ]]; then
  export LDFLAGS="-L/home/linuxbrew/.linuxbrew/lib"
  export CPPFLAGS="-I/home/linuxbrew/.linuxbrew/include"
  export LD_LIBRARY_PATH="/home/linuxbrew/.linuxbrew/lib"
  export PKG_CONFIG_PATH="/home/linuxbrew/.linuxbrew/lib/pkgconfig"
fi

source "${DOTFILES_DIR}/env/bundler.sh"
source "${DOTFILES_DIR}/env/cellar.sh"
source "${DOTFILES_DIR}/env/emacs.sh"
source "${DOTFILES_DIR}/env/erlang.sh"
source "${DOTFILES_DIR}/env/fzf.sh"
source "${DOTFILES_DIR}/env/gpg.sh"
source "${DOTFILES_DIR}/env/gtags.sh"
source "${DOTFILES_DIR}/env/homebrew.sh"
source "${DOTFILES_DIR}/env/kubernetes.sh"
source "${DOTFILES_DIR}/env/lmstudio.sh"
source "${DOTFILES_DIR}/env/mac.sh"
source "${DOTFILES_DIR}/env/python.sh"
source "${DOTFILES_DIR}/env/rails.sh"
source "${DOTFILES_DIR}/env/versions.sh"

# PATH setup
# -----------------------------
source "${DOTFILES_DIR}/env/path.sh"
