import { DAO, DAORights } from "./types/dao";
import loFind from "lodash/find"
import loGet from "lodash/get"
import { WFActivity, WFMetaForm, WFSettings, WFTemplate } from "./types/workflow";
import { workflowMetadata } from "./data/workflowMetadata";
import { Translate } from "../utils/types/generics";

export default class WorkflowHelper {
  static isWorkflowInstalled(dao: DAO, workflowCode: string): boolean {
    return loFind(dao.templates, {code: workflowCode}) !== undefined
  }

  static workflowSettingsFromDao(dao: DAO, workflowCode: string): WFSettings[]|undefined {
    return loFind(dao.templates, {code: workflowCode})?.settings
  }

  static metaGetActivityForm(templateCode: string, activityCode: string): WFMetaForm | undefined {
    return loGet(loFind(loGet(workflowMetadata, [templateCode])?.activities, {code: activityCode}), ['form'])
  }

  static getActivityById(template: WFTemplate, id: number): WFActivity | undefined {
    return loFind(template.activities, {'id': id});
  }

  static settingsConstantsToTranslate(template: WFTemplate, settingsId: number): Translate {
    // const settings: WFSettings | undefined = getSettings(template, settingsId)
    // const params: Record<string, unknown> = (settings) ? convertArrayOfObjectToObject(settings.constants, 'code', 'value') : {}
    // console.log(settings, params)
    // return {key: 'wf_templ_' + template.code + '_constants', params: params}
    return {key: 'wf_templ_' + template.code + '_description', params: {}}
  }

  static getActivityRights(settings: WFSettings, activity: WFActivity): DAORights[] {
    return settings.activityRights[activity.id]
  }

  static getTemplate(templates: WFTemplate[], id: number): WFTemplate | undefined {
    return loFind(templates, {'id': id});
  }

  static getTemplateByCode(templates: WFTemplate[], code: string): WFTemplate | undefined {
    return loFind(templates, {'code': code});
  }

  static getSettings(template: WFTemplate, settingsId: number): WFSettings | undefined {
    return loFind(template.settings, {'id': settingsId});
  }
}