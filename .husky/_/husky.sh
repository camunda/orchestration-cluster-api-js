#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ ! -f package.json ]; then
    debug "can't find package.json, skipping hook"
    exit 0
  fi

  export readonly husky_skip_init=1
  sh -e "$(dirname -- "$0")/../$hook_name" "$@"
  exitCode="$?"
  debug "exit code $exitCode"
  exit "$exitCode"
fi
