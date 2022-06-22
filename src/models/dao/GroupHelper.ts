import { DAO, DAOGroup, DAOGroupMember } from "./types/dao";
import loFind from "lodash/find"

export default class GroupHelper {
    static getGroupCouncil(dao: DAO, t: Function): DAOGroup | undefined {
        return loFind(dao.groups, {name: t('default.council')}) ?? loFind(dao.groups, {name: 'council'}); // TODO: Move to translate by lang of DAO
    }

    static getMemberFromGroup(group: DAOGroup, walletId: string): DAOGroupMember | undefined {
        return loFind(group.members, {accountId: walletId});
    }
}