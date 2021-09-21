#!/bin/bash


# hack for deleting dao
cp ~/.near-credentials/testnet/$CID.json ~/.near-credentials/testnet/$DCID.json
sed -i 's/dev-/dao.dev-/g' ~/.near-credentials/testnet/$DCID.json

# delete accounts
near delete $DCID pstu.testnet; near delete $CID1 pstu.testnet; near delete $CID2 pstu.testnet; near delete $CID3 pstu.testnet; near delete $CID4 pstu.testnet; near delete $CID pstu.testnet; 

# delete dev acc credentials so we can generate a new one
if [ -d ./neardev ]; then
    rm -rf ./neardev
fi