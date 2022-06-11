import { DAO } from "./types/dao";
import loFind from "lodash/find"
import { WFSettings } from "./types/workflow";

export default class WorkflowHelper {
  static isWorkflowInstalled(dao: DAO, workflowCode: string): boolean {
    return loFind(dao.templates, {code: workflowCode}) !== undefined
  }

  static workflowSettingsFromDao(dao: DAO, workflowCode: string): WFSettings[]|undefined {
    return loFind(dao.templates, {code: workflowCode})?.settings
  }
}