
import loFind from "lodash/find"
import { DAOGroup, DAOGroupMember, DAOMember } from "./types/dao";
import { Staking } from "./types/staking";

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

    return members;
  }

  static findMember(accountId: string, members: DAOMember[]): DAOMember | undefined {
    return loFind(members, { 'accountId': accountId })
  }

}