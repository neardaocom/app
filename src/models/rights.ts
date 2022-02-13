import { DAO, DAOGroup, DAOGroupMember, DAORights, DAORightsType, DAOTokenHolder } from "@/types/dao";
import { Translate } from "@/types/generics";
import loIsEqual from "lodash/isEqual";
import loFirst from "lodash/first";
import loFind from "lodash/find";

export const parse = (value: any): DAORights => {
    let right: DAORights = {type: 0}

    if (typeof value === "string") {
        switch (value) {
            case 'Anyone':
                right = {type: DAORightsType.Anyone}
                break;
            case 'Member':
                right = {type: DAORightsType.Member}
                break;
            case 'TokenHolder':
                right = {type: DAORightsType.TokenHolder}
                break;
            default:
                throw new Error("Unexpected value: " + value)
        }
    } else if (typeof value === "object") {
        const objectKeys: string[] = Object.keys(value)
        if (objectKeys.length !== 1) throw new Error("Unexpected value: " + value)

        switch (objectKeys[0]) {
            case 'Account':
                right = {type: DAORightsType.Account, accountId: value.Account}
                break;
            case 'Group':
                right = {type: DAORightsType.Group, groupId: value.Group}
                break;
            case 'GroupMember':
                right = {type: DAORightsType.GroupMember, groupId: value.GroupMember[0], accountId: value.GroupMember[1]}
                break;
            case 'GroupLeader':
                right = {type: DAORightsType.GroupLeader, groupId: value.GroupLeader}
                break;
            case 'GroupRole':
                right = {type: DAORightsType.GroupRole, groupId: value.GroupRole[0], roleId: value.GroupRole[1]}
                break;
            default:
                throw new Error("Unexpected value: " + objectKeys[0])
        }
    } else {
        throw new Error("Unsupported value: " + value);
    }

    return right
}

export const toObject = (right: DAORights): any => {
    let object: any = undefined
    switch (right.type) {
        case DAORightsType.Anyone:
            object = "Anyone"
            break;
        case DAORightsType.Member:
            object = "Member"
            break;
        case DAORightsType.TokenHolder:
            object = "TokenHolder"
            break;
        case DAORightsType.Account:
            object = {Account: right.accountId}
            break;
        case DAORightsType.Group:
            object = {Group: right.groupId}
            break;
        case DAORightsType.GroupMember:
            object = {GroupMember: [right.groupId, right.accountId]}
            break;
        case DAORightsType.GroupLeader:
            object = {GroupLeader: right.groupId}
            break;
        case DAORightsType.GroupRole:
            object = {GroupRole: [right.groupId, right.roleId]}
            break;
        default:
            throw new Error("Unsupported type: " + right);
    }

    return object
}

export const getDAORights = (dao: DAO): DAORights[] => {
    const list: DAORights[] = []
    const accounts: string[] = []

    // basic
    list.push({type: DAORightsType.Anyone})
    list.push({type: DAORightsType.Member})
    list.push({type: DAORightsType.TokenHolder})

    // token holders
    dao.tokenHolders.forEach((holder: any) => {
        accounts.push(holder.accountId)
    })

    // groups
    dao.groups.forEach((group) => {
        list.push({type: DAORightsType.Group, groupId: group.id})
        group.members.forEach((member) => {
            list.push({type: DAORightsType.GroupMember, groupId: group.id, accountId: member.accountId})
            if (accounts.includes(member.accountId) === false) {
                accounts.push(member.accountId)
            }
        })
        list.push({type: DAORightsType.GroupLeader, groupId: group.id})
        list.push({type: DAORightsType.GroupRole, groupId: group.id, roleId: group.id})
    })

    // accounts
    accounts.forEach((accountId) => {
        list.push({type: DAORightsType.Account, accountId: accountId})
    })

    return list
}

export const getWalletRights = (dao: DAO, walletId: string | undefined): DAORights[] => {
    const list: DAORights[] = []

    list.push({type: DAORightsType.Anyone})

    if (walletId !== undefined) {
        // token holders
        const holder: DAOTokenHolder | undefined = loFind(dao.tokenHolders, {accountId: walletId})
        if (holder !== undefined) list.push({type: DAORightsType.TokenHolder})

        // groups
        let member: DAOGroupMember | undefined
        let isMember: boolean = false
        dao.groups.forEach((group) => {
            member = loFind(group.members, {accountId: walletId})
            // membership
            if (member !== undefined) {
                isMember = true
                list.push({type: DAORightsType.Group, groupId: group.id})
                list.push({type: DAORightsType.GroupMember, groupId: group.id, accountId: walletId})
                const roleIterator: IterableIterator<number> = member.roles.keys();
                for (const roleKey of roleIterator) {
                    list.push({type: DAORightsType.GroupRole, groupId: group.id, roleId: (roleKey + 1)})
                }
            }
            // leader
            if (group.leader === walletId) {
                list.push({type: DAORightsType.GroupLeader, groupId: group.id})
            }
        })
        if (isMember) {
            list.push({type: DAORightsType.Member})
        }

        // accounts
        list.push({type: DAORightsType.Account, accountId: walletId})
    }

    return list
}

export const check = (owned: DAORights[], target: DAORights[]): boolean => {
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

export const toTranslate = (rights: DAORights, daoGroups: DAOGroup[]): Translate => {
    const trans: Translate = {key: '', params: {}}

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
            trans.params = {accountId: rights.accountId}
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