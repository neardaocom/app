import { DAO, DAOGroup } from "./types/dao";
import loFind from "lodash/find"

export default class GroupHelper {
    static getGroupCouncil(dao: DAO, t: Function): DAOGroup | undefined {
        return loFind(dao.groups, {name: t('default.council')}) ?? loFind(dao.groups, {name: 'council'}); // TODO: Move to translate by lang of DAO
    }

    static getMembers(dao: DAO): string[] {
        const list: string[] = []
        return list
    }
}