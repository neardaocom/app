import { TreasuryLock } from "@/models/dao/types/treasury";
import moment from "moment";

export const listEmpty = (): TreasuryLock[] => ([])

export const listBasic = (): TreasuryLock[] => ([
    {id: 1, category: 'near', name: 'Council - Salary',  nextUnlock: new Date(), createdBy: null, assets: [
        {
            asset: { type: 'near', accountId: 'near', name: 'NEAR', symbol: 'NEAR', icon: null, priceInUSD: 6.5,},
            totalLocked: 200,
            unlocked: 20,
            locked: 100,
            unlocking: [
                {targetDate: moment().subtract(7, 'days').toDate(), amount: 10},
                {targetDate: moment().toDate(), amount: 50},
                {targetDate: moment().add(7, 'days').toDate(), amount: 100},
                {targetDate: moment().add(14, 'days').toDate(), amount: 150},
                {targetDate: moment().add(21, 'days').toDate(), amount: 200},
            ],
        },
    ]},
    {id: 2, category: 'ft', name: 'Council - Allocation',  nextUnlock: new Date(), createdBy: null, assets: [
        {
            asset: { type: 'ft', accountId: 'tkn.dao.near', name: 'DAO Govern. token', symbol: 'TKN', icon: null,},
            totalLocked: 100_000,
            unlocked: 0,
            locked: 100_000,
            unlocking: [
                {targetDate: moment().toDate(), amount: 0},
                {targetDate: moment().add(1, 'years').toDate(), amount: 33_000},
                {targetDate: moment().add(2, 'years').toDate(), amount: 66_000},
                {targetDate: moment().add(3, 'years').toDate(), amount: 100_000},
            ],
        },
    ]},
    {id: 3, category: 'ft', name: 'Community - Allocation',  nextUnlock: new Date(), createdBy: null, assets: [
        {
            asset: { type: 'ft', accountId: 'tkn.dao.near', name: 'DAO Govern. token', symbol: 'TKN', icon: null,},
            totalLocked: 300_000,
            unlocked: 0,
            locked: 300_000,
            unlocking: [
                {targetDate: moment().toDate(), amount: 0},
                {targetDate: moment().add(1, 'years').toDate(), amount: 100_000},
                {targetDate: moment().add(2, 'years').toDate(), amount: 200_000},
                {targetDate: moment().add(3, 'years').toDate(), amount: 300_000},
            ],
        },
    ]},
])
