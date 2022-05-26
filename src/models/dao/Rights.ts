import { DAO, DAOGroup, DAOGroupMember, DAORights, DAORightsType, DAOTokenHolder } from "@/models/dao/types/dao";
import { Translate } from "@/models/utils/types/generics";
import loIsEqual from "lodash/isEqual";
import loFirst from "lodash/first";
import loFind from "lodash/find";
import { ActivityRight } from "../nearBlockchain/types/workflow";

export default class Rights {

    static parse(value: any): DAORights {
        let right: DAORights = { type: 0 }

        if (typeof value === "string") {
            switch (value) {
                case 'anyone':
                    right = { type: DAORightsType.Anyone }
                    break;
                case 'member':
                    right = { type: DAORightsType.Member }
                    break;
                case 'token_holder':
                    right = { type: DAORightsType.TokenHolder }
                    break;
                default:
                    throw new Error("Unexpected value: " + value)
            }
        } else if (typeof value === "object") {
            const objectKeys: string[] = Object.keys(value)
            if (objectKeys.length !== 1) throw new Error("Unexpected value: " + value)

            switch (objectKeys[0]) {
                case 'account':
                    right = { type: DAORightsType.Account, accountId: value.account }
                    break;
                case 'group':
                    right = { type: DAORightsType.Group, groupId: value.group }
                    break;
                case 'group_member':
                    right = { type: DAORightsType.GroupMember, groupId: value.group_member[0], accountId: value.group_member[1] }
                    break;
                case 'group_leader':
                    right = { type: DAORightsType.GroupLeader, groupId: value.group_leader }
                    break;
                case 'group_role':
                    right = { type: DAORightsType.GroupRole, groupId: value.group_role[0], roleId: value.group_role[1] }
                    break;
                default:
                    throw new Error("Unexpected value: " + objectKeys[0])
            }
        } else {
            throw new Error("Unsupported value: " + value);
        }

        return right
    }

    static toObject(right: DAORights): ActivityRight {
        let object: any = undefined
        switch (right.type) {
            case DAORightsType.Anyone:
                object = "anyone"
                break;
            case DAORightsType.Member:
                object = "member"
                break;
            case DAORightsType.TokenHolder:
                object = "token_holder"
                break;
            case DAORightsType.Account:
                object = { account: right.accountId }
                break;
            case DAORightsType.Group:
                object = { group: right.groupId }
                break;
            case DAORightsType.GroupMember:
                object = { group_member: [right.groupId, right.accountId] }
                break;
            case DAORightsType.GroupLeader:
                object = { group_leader: right.groupId }
                break;
            case DAORightsType.GroupRole:
                object = { group_role: [right.groupId, right.roleId] }
                break;
            default:
                throw new Error("Unsupported type: " + right);
        }

        return object
    }

    static getDAORights(dao: DAO): DAORights[] {
        const list: DAORights[] = []
        const accounts: string[] = []

        // basic
        list.push({ type: DAORightsType.Anyone })
        list.push({ type: DAORightsType.Member })
        list.push({ type: DAORightsType.TokenHolder })

        // token holders
        dao.tokenHolders.forEach((holder: any) => {
            accounts.push(holder.accountId)
        })

        // groups
        dao.groups.forEach((group) => {
            list.push({ type: DAORightsType.Group, groupId: group.id })
            group.members.forEach((member) => {
                list.push({ type: DAORightsType.GroupMember, groupId: group.id, accountId: member.accountId })
                if (accounts.includes(member.accountId) === false) {
                    accounts.push(member.accountId)
                }
            })
            list.push({ type: DAORightsType.GroupLeader, groupId: group.id })
            list.push({ type: DAORightsType.GroupRole, groupId: group.id, roleId: group.id })
        })

        // accounts
        accounts.forEach((accountId) => {
            list.push({ type: DAORightsType.Account, accountId: accountId })
        })

        return list
    }

    static getWalletRights(dao: DAO, walletId: string | undefined): DAORights[] {
        const list: DAORights[] = []

        list.push({ type: DAORightsType.Anyone })

        if (walletId !== undefined && walletId !== '') {
            // token holders
            const holder: DAOTokenHolder | undefined = loFind(dao.tokenHolders, { accountId: walletId })
            if (holder !== undefined) list.push({ type: DAORightsType.TokenHolder })

            // groups
            let member: DAOGroupMember | undefined
            let isMember: boolean = false
            dao.groups.forEach((group) => {
                member = loFind(group.members, { accountId: walletId })
                // membership
                if (member !== undefined) {
                    isMember = true
                    list.push({ type: DAORightsType.Group, groupId: group.id })
                    list.push({ type: DAORightsType.GroupMember, groupId: group.id, accountId: walletId })
                    const roleIterator: IterableIterator<number> = member.roles.keys();
                    for (const roleKey of roleIterator) {
                        list.push({ type: DAORightsType.GroupRole, groupId: group.id, roleId: (roleKey + 1) })
                    }
                }
                // leader
                if (group.leader === walletId) {
                    list.push({ type: DAORightsType.GroupLeader, groupId: group.id })
                }
            })
            if (isMember) {
                list.push({ type: DAORightsType.Member })
            }

            // accounts
            list.push({ type: DAORightsType.Account, accountId: walletId })
        }

        return list
    }

    static check(owned: DAORights[], target: DAORights[]): boolean {
        // console.log(owned, target)
        let checked: boolean = false

        for (const targetRight of target) {
            for (const ownedRight of owned) {
                if (loIsEqual(targetRight, ownedRight) === true) {
                    checked = true
                    break
                }
            }
            if (checked === true) break
        }

        return checked
    }

    static toTranslate(rights: DAORights, daoGroups: DAOGroup[]): Translate {
        const trans: Translate = { key: '', params: {} }

        switch (rights.type) {
            case DAORightsType.Anyone:
                trans.key = 'rights_anyone'
                break;
            case DAORightsType.Member:
                trans.key = 'rights_member'
                break;
            case DAORightsType.TokenHolder:
                trans.key = 'rights_token_holder'
                break;
            case DAORightsType.Account:
                trans.key = 'rights_account'
                trans.params = { accountId: rights.accountId }
                break;
            case DAORightsType.Group:
                trans.key = 'rights_group'
                trans.params = {
                    groupId: rights.groupId,
                    group: loFirst(daoGroups.filter(group => group.id === rights.groupId))?.name,
                }
                break;
            case DAORightsType.GroupMember:
                trans.key = 'rights_group_member'
                trans.params = {
                    groupId: rights.groupId,
                    group: loFirst(daoGroups.filter(group => group.id === rights.groupId))?.name,
                    accountId: rights.accountId,
                }
                break;
            case DAORightsType.GroupLeader:
                trans.key = 'rights_group_leader'
                trans.params = {
                    groupId: rights.groupId,
                    group: loFirst(daoGroups.filter(group => group.id === rights.groupId))?.name,
                }
                break;
            case DAORightsType.GroupRole:
                trans.key = 'rights_group_role'
                trans.params = {
                    groupId: rights.groupId,
                    group: loFirst(daoGroups.filter(group => group.id === rights.groupId))?.name,
                    roleId: rights.groupId,
                    role: '',
                }
                break;
            default:
                throw new Error("Unsupported type: " + rights);
        }
        return trans
    }
}