
import loFind from "lodash/find"
import loGet from "lodash/get"
import loToPairs from "lodash/toPairs"
import loStartsWith from "lodash/startsWith"
import loIsArray from "lodash/isArray"
import loToString from "lodash/toString"

import GroupHelper from "./GroupHelper";
import { DAO, DAOGroup, DAOGroupMember, DAOMember } from "./types/dao";
import { Staking } from "./types/staking";
import NearUtils from '../nearBlockchain/Utils'

export default class DaoHelper {

  static getMembers(groups: DAOGroup[], staking: Staking): DAOMember[] {
    const members: DAOMember[] = []

    // from staking
    staking.usersToDelegate.forEach((user) => { // get list of voting token holders
      if (this.findMember(user.accountId, members) == undefined) {
        members.push({ accountId: user.accountId, voteAmount: user.voteAmount })
      }
    })

    // from groups
    groups.forEach((group: DAOGroup) => {
      group.members.forEach((member: DAOGroupMember) => {
        if (this.findMember(member.accountId, members) == undefined) {
          members.push({ accountId: member.accountId, voteAmount: 0.0 })
        }
      })
    })

    return members
  }

  static findMember(accountId: string, members: DAOMember[]): DAOMember | undefined {
    return loFind(members, { 'accountId': accountId })
  }

  static isWalletInCouncil(dao: DAO, walletId: string, t: any): boolean {
    const group: DAOGroup | undefined = GroupHelper.getGroupCouncil(dao, t)
    return group ? GroupHelper.getMemberFromGroup(group, walletId) !== undefined : false
  }

  static storageGetValues = (storage: Record<string, unknown>, path: string, key: string): string[] => {
    const values: string[] = []

    let item: Record<string, unknown>
    loToPairs(storage).forEach((storageItem) => {
        // find path
        if (loStartsWith(storageItem[0], path) && loIsArray(storageItem[1])) {
            item = NearUtils.parseObjectFromArray(storageItem[1])
            // find value
            if (loGet(item, [key]) !== undefined) {
              values.push(loToString(loGet(item, [key])))
            }
        }
    })
    return values
}
}