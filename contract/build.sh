#!/bin/bash

##### USAGE #####
# A) Run without any args for building all libs
# B) Or with lib name you want to build
#################

set -e 

declare -a libs=(dao dao_factory)
ABS_BASEDIR=$(dirname $(readlink -f "$0"))

if [ ! -z "$1" -a -d "${ABS_BASEDIR}/${1}" ]; then      # Build required lib

    LIB_DIR="${ABS_BASEDIR}/${1}"
    cd $LIB_DIR
    RUSTFLAGS='-C link-arg=-s' cargo +stable build --target wasm32-unknown-unknown --release

    if [ ! -e "${ABS_BASEDIR}/res" ]; then
        mkdir "${ABS_BASEDIR}/res"
    fi
    cp "${LIB_DIR}/../target/wasm32-unknown-unknown/release/${1}.wasm" "${ABS_BASEDIR}/res/"
else
    echo "BUILD SCRIPT: Building all libs into res dir"

    RUSTFLAGS='-C link-arg=-s' cargo +stable build --all --target wasm32-unknown-unknown --release

    for lib in "${libs[@]}"
    do
    :         
        cp "${ABS_BASEDIR}/target/wasm32-unknown-unknown/release/${lib}.wasm" "${ABS_BASEDIR}/res/"
    done
fi

