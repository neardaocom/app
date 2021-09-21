#!/bin/bash

# WIP: Does not work yet !

near deploy \
  --wasmFile res/dao.wasm \
  --initFunction "migrate" \
  --initArgs "{}" \
  --accountId $DCID