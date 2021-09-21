#!/bin/bash

near deploy \
  --wasmFile res/dao_factory.wasm \
  --initFunction "migrate" \
  --initArgs "{}" \
  --accountId $CID