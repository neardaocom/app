# Developing on testnet.near guide

- version: 0.1.0

## 1. Testing creation with dev account
```
# Create dev account and deploys factory smart contract
near dev-deploy --wasmFile=res/dao_factory.wasm

# Save provided ID into shell env variable
CID="some uuid"

# Init DAO factory
near call $CID new --accountId $CID

# Create DAO
near call $CID create '{"name": "dao_account_name", "public_key":null, "dao_name":"desired dao name", "dao_desc":"description of the dao"}' --accountId $CID --amount 30 --gas 100000000000000

# List all created daos - check dao exits in dao factory
near view $CID get_dao_list --accountId $CID

# Get info about created dao
near view "'dao_account_name.$CID'" get_info

```

## 2. Re-deploy dev account and contract
```
# Delete dev account
near delete $CID <account name you want to transfer tokens to>

# Delete keys
rm "$HOME/.near-credentials/testnet/$CID.json"

# Create new account and contract again (see above)
```