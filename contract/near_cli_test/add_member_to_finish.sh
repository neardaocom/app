#!/bin/bash

#source ./near_cli_test/init_factory_and_dao.sh

#near call $DCID storage_deposit --accountId $CID4 --amount 1

PUUID=$(near call $DCID add_proposal '{"proposal_input" : {"description": "I want to contribute to your company.", "tags":["test","first","money"], "transaction": { "AddMember": {"group": "Community", "account_id":"'$CID4'"} }}}' --amount 1 --gas 100000000000000 --accountId $CID4 | tail -n1 | tr -d '[:space:]')
echo "Created proposal UUID: $PUUID"

near call $DCID vote '{"proposal_id":'$PUUID',"vote_kind": 1}' --amount 1 --gas 10000000000000 --accountId $CID1
near call $DCID vote '{"proposal_id":'$PUUID',"vote_kind": 1}'  --amount 1 --gas 10000000000000 --accountId $CID2
near call $DCID vote '{"proposal_id":'$PUUID',"vote_kind": 1}' --amount 1 --gas 10000000000000 --accountId $CID3
near call $DCID vote '{"proposal_id":'$PUUID',"vote_kind": 1}' --amount 1 --gas 10000000000000 --accountId $CID4
near call $DCID finish_proposal '{"proposal_id":'$PUUID'}' --gas 100000000000000 --accountId $CID4

near view $DCID statistics_ft ''
near view $DCID statistics_members ''