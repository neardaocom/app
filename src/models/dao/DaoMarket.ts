import ServicePool from "./ServicePool";
import { MarketTemplate } from "./types/market";
import MarketTemplateFromProviderTransformer from "./transformers/MarketTemplateFromProviderTransformer";
import { DAO, DAORights } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";

export default class DaoMarket {
    private wfProviderAccountId: string;
    private servicePool: ServicePool;

    constructor(wfProviderAccountId: string, servicePool: ServicePool) {
        this.wfProviderAccountId = wfProviderAccountId
        this.servicePool = servicePool
    }

    async list(installedTemplateCodes: string[], t: Function): Promise<MarketTemplate[]> {
        const list: MarketTemplate[] = []
        const ftTemplates = await this.servicePool.getWfProvider(this.wfProviderAccountId).wfTemplates() || []
        const transformer = new MarketTemplateFromProviderTransformer(t);

        ftTemplates.forEach((wfTemplate) => {
            list.push(transformer.transform(wfTemplate, {installedCodes: installedTemplateCodes}))
        })

        return list
    }

    async install(dao: DAO, workflowId: number, proposeRights: DAORights[], voteRight: DAORights , activityRights: Record<number, DAORights[]>, activityDefaultRights: DAORights[], price: number) {
        const wfTemplate = await this.servicePool.getWfProvider(this.wfProviderAccountId).wfTemplate(workflowId)
        // console.log(workflowId, proposeRights, voteRight , activityDefaultRights)

        const builder = new ProposalBuilder(this.servicePool.getWfProvider(this.wfProviderAccountId), dao.templates)
        builder.addTemplateByCode('basic_pkg1')
        builder.addTemplateSettingsId(0)
        builder.addProposeSettingsScenario(1)
        builder.addActivity(1)
        builder.addActivityActionConstantNumber(0, 'id', workflowId)
        builder.addActivityActionConstantString(0, 'provider_id', this.wfProviderAccountId)
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addTemplateSettingsWorflowId(workflowId)
        builder.addTemplateSettingsVoteLevel(dao.voteLevels[0])
        builder.addTemplateSettingsProposeRights(proposeRights)
        builder.addTemplateSettingsVoteRights(voteRight)

        // setup default rights
        console.log(Array(wfTemplate[0].activities.length - 1))
        const activitiesNumber = wfTemplate[0].activities.length
        for (let i = 0; i < activitiesNumber; i++) {
            console.log(i)
            if (activityRights[i + 1] !== undefined) {
                builder.addTemplateSettingsActivity(activityRights[i + 1])
            } else {
                builder.addTemplateSettingsActivity(activityDefaultRights)
            }
        }

        const createArgs = await builder.create()

        console.log(createArgs)

        return this.servicePool.getContract(dao.wallet).proposalCreate(createArgs, 10, price).actionsRun()
    }


}