import { Auction } from "@/models/auction/types";
import moment from "moment";

export const testDataset: Auction[] = [
    {
        id: 0,
        source: 'skyward.finance',
        title: 'NearDAO: First token sale of 1%',
        url: null,
        owner_id: 'neardao.testnet',
        out_tokens: [
          {
              account_id: 'genesis.dev5.neardao.testnet',
              remaining: 156_486,
              distributed: 1_000_000,
              treasury_unclaimed: 0,
              referral_bpt: 500,
            },
        ],
        in_token: {
            account_id: 'wrap.testnet',
            remaining: 300_000,
            paid_unclaimed: 195_548,
            paid: 200_000,
        },
        total_shares: 60_161_928_595_668_652_013_949_611,
        start_time: moment().subtract(1, 'hours').toDate(),
        end_time: moment().add(1, 'hours').toDate(),
        duration: 14_400_000_000_000,
        remaining_duration: 1_000_000,
        current_time: moment().toDate(),
    },
]