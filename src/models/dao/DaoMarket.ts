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

        const builder = new ProposalBuilder()
        builder.addTemplateId(1)
        builder.addTemplateSettingsId(0)
        builder.addConstantNumber('workflow_id', workflowId)
        builder.addConstantString('provider_id', this.wfProviderAccountId)
        builder.addActivityConstants()
        builder.addTemplateVoteLevel(dao.voteLevels[0])
        builder.addTemplateProposeRights(proposeRights)
        builder.addTemplateVoteRights(voteRight)

        // setup default rights
        console.log(Array(wfTemplate[0].activities.length - 1))
        const activitiesNumber = wfTemplate[0].activities.length
        for (let i = 0; i < activitiesNumber; i++) {
            console.log(i)
            if (activityRights[i + 1] !== undefined) {
                builder.addTemplateActivity(activityRights[i + 1], [{to: i + 1, limit: 10}])
            } else {
                builder.addTemplateActivity(activityDefaultRights, [{to: i + 1, limit: 10}])
            }
        }

        console.log(builder.create())

        return this.servicePool.getContract(dao.wallet).proposalCreate(builder.create(), NearUtils.toTGas(10), NearUtils.nearToYocto(price))
    }


}