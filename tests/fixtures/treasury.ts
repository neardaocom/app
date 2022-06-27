import { DaoAssetType } from "@/models/dao/types/asset";
import { TreasuryLock } from "@/models/dao/types/treasury";
import moment from "moment";

/*
export const listEmpty = (): TreasuryLock[] => ([])

export const listBasic = (): TreasuryLock[] => ([
    {id: 1, category: 'salary', name: 'Council - Salary',  nextUnlock: moment().add(7, 'days').toDate(), createdBy: null, assets: [
        {
            asset: { type: DaoAssetType.Near, accountId: 'near', name: 'NEAR', symbol: 'NEAR', icon: null, priceInUSD: 6.5, decimals: 24 },
            totalLocked: 200,
            unlocked: 20,
            //locked: 100,
            //unlocking: [
            //    {targetDate: moment().subtract(7, 'days').toDate(), amount: 10},
            //    {targetDate: moment().toDate(), amount: 50},
            //    {targetDate: moment().add(7, 'days').toDate(), amount: 100},
            //    {targetDate: moment().add(14, 'days').toDate(), amount: 150},
            //    {targetDate: moment().add(21, 'days').toDate(), amount: 200},
            //],
        },
        {
            asset: { type: 'ft', accountId: 'tkn.dao.near', name: 'DAO Govern. token', symbol: 'TKN', icon: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHdpZHRoPSIxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTEwMCA1MGMwLTI3LjYxNDItMjIuMzg1OC01MC01MC01MHMtNTAgMjIuMzg1OC01MCA1MCAyMi4zODU4IDUwIDUwIDUwIDUwLTIyLjM4NTggNTAtNTB6IiBmaWxsPSIjNDVjZDg1Ii8+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0ibTY5Ljg4MDUgNjIuNjQzOGMtMS41NjcxIDMuMzkzMS0zLjkzNzUgNi4zNTMyLTYuOTA2MSA4LjYyNDEtMi45Njg1IDIuMjcwOC02LjQ0NTggMy43ODQxLTEwLjEzMDcgNC40MDg3LTMuNjg1LjYyNDYtNy40NjY3LjM0MTctMTEuMDE3Ny0uODI0MS0zLjU1MTEtMS4xNjU4LTYuNzY0Ni0zLjE3OTQtOS4zNjIzLTUuODY2Ni0yLjU5NzgtMi42ODcxLTQuNTAxNS01Ljk2NjktNS41NDY1LTkuNTU1NC0xLjA0NDktMy41ODg1LTEuMTk5Ni03LjM3NzUtLjQ1MDctMTEuMDM5My43NDg5LTMuNjYxNyAyLjM3ODktNy4wODU3IDQuNzQ4OS05Ljk3NTggMi4zNzAxLTIuODkgNS40MDg3LTUuMTU4OSA4Ljg1MjktNi42MTAzbDIuMjY2OCA1LjM3OTJjLTIuNTcgMS4wODMxLTQuODM3NSAyLjc3NjEtNi42MDYgNC45MzI3LTEuNzY4NSAyLjE1NjUtMi45ODQ4IDQuNzExNS0zLjU0MzYgNy40NDM5LS41NTg5IDIuNzMyNC0uNDQzNSA1LjU1OTguMzM2MyA4LjIzNzYuNzc5OCAyLjY3NzcgMi4yMDAzIDUuMTI1MSA0LjEzODggNy4xMzAyIDEuOTM4NCAyLjAwNTIgNC4zMzYzIDMuNTA3OCA2Ljk4NjEgNC4zNzc3czUuNDcxNyAxLjA4MSA4LjIyMTUuNjE0OWMyLjc0OTctLjQ2NjEgNS4zNDQ0LTEuNTk1MyA3LjU1OTUtMy4yODk4IDIuMjE1Mi0xLjY5NDUgMy45ODQtMy45MDMzIDUuMTUzNC02LjQzNTNsNS45MTg5LjMwNDJ6Ii8+PHBhdGggZD0ibTU2LjEwNjEgMjQuNXYtNGg0LjUwMDV2NGMyIDAgNS4xNjY3LjY2NjcgNi41IDF2NC41Yy0xOS0zLTE1LjUwMTEgMy44NDYyLTggNSA2LjcyMTcgMS4wMzM5IDExIDIgMTEuNSA5IC40IDUuNi01LjgzMzMgNy42NjY3LTkgOHYzLjVoLTV2LTMuNWMtMi40IDAtNi42NjY3LTEuNjY2Ny04LjUtMi41di01LjVjNC41IDIuNSAxNyA0LjUgMTcgMHMtMTYuNTAxMS0zLTE4LjAwMDUtMTFjLTEuMDAyMy01LjM0NzUgNS4zMzMzLTcuODMzMyA5LTguNXoiLz48L2c+PC9zdmc+'},
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
    {id: 2, category: 'salary', name: 'Council - Allocation',  nextUnlock: new Date(), createdBy: null, assets: [
        {
            asset: { type: 'ft', accountId: 'tkn.dao.near', name: 'DAO Govern. token', symbol: 'TKN', icon: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHdpZHRoPSIxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTEwMCA1MGMwLTI3LjYxNDItMjIuMzg1OC01MC01MC01MHMtNTAgMjIuMzg1OC01MCA1MCAyMi4zODU4IDUwIDUwIDUwIDUwLTIyLjM4NTggNTAtNTB6IiBmaWxsPSIjNDVjZDg1Ii8+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0ibTY5Ljg4MDUgNjIuNjQzOGMtMS41NjcxIDMuMzkzMS0zLjkzNzUgNi4zNTMyLTYuOTA2MSA4LjYyNDEtMi45Njg1IDIuMjcwOC02LjQ0NTggMy43ODQxLTEwLjEzMDcgNC40MDg3LTMuNjg1LjYyNDYtNy40NjY3LjM0MTctMTEuMDE3Ny0uODI0MS0zLjU1MTEtMS4xNjU4LTYuNzY0Ni0zLjE3OTQtOS4zNjIzLTUuODY2Ni0yLjU5NzgtMi42ODcxLTQuNTAxNS01Ljk2NjktNS41NDY1LTkuNTU1NC0xLjA0NDktMy41ODg1LTEuMTk5Ni03LjM3NzUtLjQ1MDctMTEuMDM5My43NDg5LTMuNjYxNyAyLjM3ODktNy4wODU3IDQuNzQ4OS05Ljk3NTggMi4zNzAxLTIuODkgNS40MDg3LTUuMTU4OSA4Ljg1MjktNi42MTAzbDIuMjY2OCA1LjM3OTJjLTIuNTcgMS4wODMxLTQuODM3NSAyLjc3NjEtNi42MDYgNC45MzI3LTEuNzY4NSAyLjE1NjUtMi45ODQ4IDQuNzExNS0zLjU0MzYgNy40NDM5LS41NTg5IDIuNzMyNC0uNDQzNSA1LjU1OTguMzM2MyA4LjIzNzYuNzc5OCAyLjY3NzcgMi4yMDAzIDUuMTI1MSA0LjEzODggNy4xMzAyIDEuOTM4NCAyLjAwNTIgNC4zMzYzIDMuNTA3OCA2Ljk4NjEgNC4zNzc3czUuNDcxNyAxLjA4MSA4LjIyMTUuNjE0OWMyLjc0OTctLjQ2NjEgNS4zNDQ0LTEuNTk1MyA3LjU1OTUtMy4yODk4IDIuMjE1Mi0xLjY5NDUgMy45ODQtMy45MDMzIDUuMTUzNC02LjQzNTNsNS45MTg5LjMwNDJ6Ii8+PHBhdGggZD0ibTU2LjEwNjEgMjQuNXYtNGg0LjUwMDV2NGMyIDAgNS4xNjY3LjY2NjcgNi41IDF2NC41Yy0xOS0zLTE1LjUwMTEgMy44NDYyLTggNSA2LjcyMTcgMS4wMzM5IDExIDIgMTEuNSA5IC40IDUuNi01LjgzMzMgNy42NjY3LTkgOHYzLjVoLTV2LTMuNWMtMi40IDAtNi42NjY3LTEuNjY2Ny04LjUtMi41di01LjVjNC41IDIuNSAxNyA0LjUgMTcgMHMtMTYuNTAxMS0zLTE4LjAwMDUtMTFjLTEuMDAyMy01LjM0NzUgNS4zMzMzLTcuODMzMyA5LTguNXoiLz48L2c+PC9zdmc+'},
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
    {id: 3, category: 'event', name: 'Community - Allocation',  nextUnlock: new Date(), createdBy: null, assets: [
        {
            asset: { type: 'ft', accountId: 'tkn.dao.near', name: 'DAO Govern. token', symbol: 'TKN', icon: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHdpZHRoPSIxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTEwMCA1MGMwLTI3LjYxNDItMjIuMzg1OC01MC01MC01MHMtNTAgMjIuMzg1OC01MCA1MCAyMi4zODU4IDUwIDUwIDUwIDUwLTIyLjM4NTggNTAtNTB6IiBmaWxsPSIjNDVjZDg1Ii8+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0ibTY5Ljg4MDUgNjIuNjQzOGMtMS41NjcxIDMuMzkzMS0zLjkzNzUgNi4zNTMyLTYuOTA2MSA4LjYyNDEtMi45Njg1IDIuMjcwOC02LjQ0NTggMy43ODQxLTEwLjEzMDcgNC40MDg3LTMuNjg1LjYyNDYtNy40NjY3LjM0MTctMTEuMDE3Ny0uODI0MS0zLjU1MTEtMS4xNjU4LTYuNzY0Ni0zLjE3OTQtOS4zNjIzLTUuODY2Ni0yLjU5NzgtMi42ODcxLTQuNTAxNS01Ljk2NjktNS41NDY1LTkuNTU1NC0xLjA0NDktMy41ODg1LTEuMTk5Ni03LjM3NzUtLjQ1MDctMTEuMDM5My43NDg5LTMuNjYxNyAyLjM3ODktNy4wODU3IDQuNzQ4OS05Ljk3NTggMi4zNzAxLTIuODkgNS40MDg3LTUuMTU4OSA4Ljg1MjktNi42MTAzbDIuMjY2OCA1LjM3OTJjLTIuNTcgMS4wODMxLTQuODM3NSAyLjc3NjEtNi42MDYgNC45MzI3LTEuNzY4NSAyLjE1NjUtMi45ODQ4IDQuNzExNS0zLjU0MzYgNy40NDM5LS41NTg5IDIuNzMyNC0uNDQzNSA1LjU1OTguMzM2MyA4LjIzNzYuNzc5OCAyLjY3NzcgMi4yMDAzIDUuMTI1MSA0LjEzODggNy4xMzAyIDEuOTM4NCAyLjAwNTIgNC4zMzYzIDMuNTA3OCA2Ljk4NjEgNC4zNzc3czUuNDcxNyAxLjA4MSA4LjIyMTUuNjE0OWMyLjc0OTctLjQ2NjEgNS4zNDQ0LTEuNTk1MyA3LjU1OTUtMy4yODk4IDIuMjE1Mi0xLjY5NDUgMy45ODQtMy45MDMzIDUuMTUzNC02LjQzNTNsNS45MTg5LjMwNDJ6Ii8+PHBhdGggZD0ibTU2LjEwNjEgMjQuNXYtNGg0LjUwMDV2NGMyIDAgNS4xNjY3LjY2NjcgNi41IDF2NC41Yy0xOS0zLTE1LjUwMTEgMy44NDYyLTggNSA2LjcyMTcgMS4wMzM5IDExIDIgMTEuNSA5IC40IDUuNi01LjgzMzMgNy42NjY3LTkgOHYzLjVoLTV2LTMuNWMtMi40IDAtNi42NjY3LTEuNjY2Ny04LjUtMi41di01LjVjNC41IDIuNSAxNyA0LjUgMTcgMHMtMTYuNTAxMS0zLTE4LjAwMDUtMTFjLTEuMDAyMy01LjM0NzUgNS4zMzMzLTcuODMzMyA5LTguNXoiLz48L2c+PC9zdmc+'},
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
    {id: 4, category: 'salary', name: 'Community - Allocation',  nextUnlock: new Date(), createdBy: null, assets: [
        {
            asset: { type: 'ft', accountId: 'bkvm.dao.near', name: 'DAO Govern. token', symbol: 'BKVM', icon: null},
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
*/