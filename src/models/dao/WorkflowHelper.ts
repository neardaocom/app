import { DAO } from "./types/dao";
import loFind from "lodash/find"

export default class WorkflowHelper {
  static isWorkflowInstalled(dao: DAO, workflowCode: string): boolean {
    return loFind(dao.templates, {code: workflowCode}) !== undefined
  }
}