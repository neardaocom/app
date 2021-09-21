#!/bin/sh

##### USAGE #####
# A) Run without any args to run simulation tests
# B) Run with first arg "all" to run all tests
# C) Run with first or second arg "1" to show backtrace
#################

VAL=0
TEST=""

if [ "${1}" == "all" ]; then
    TEST="--all"
fi


if [ "${1}" == "1" -o "${2}" == "1" ]; then
    VAL=1
fi

RUST_BACKTRACE=$VAL cargo test $TEST --no-fail-fast -- --nocapture #nocapture outputs even panics in tests that should panic