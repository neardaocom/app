import ProposalHelper from "@/models/dao/ProposalHelper";
import { DAO, DAOProposal } from "@/models/dao/types/dao";
import WorkflowHelper from "@/models/dao/WorkflowHelper";
import loFilter from "lodash/filter";
import loFind from "lodash/find";
import { ref } from "vue";

export const useBounties = (dao: DAO, t: Function, d: Function, n: Function) => {
    const template = WorkflowHelper.getTemplateByCode([], 'wf_bounty')

    const bounties = ref(loFilter(ProposalHelper.getWorkflows(dao.proposals), {'state': 'running', templateId: template?.id, activityLastId: 0}))

    const proposals = ref(bounties.value.map((bounty) => {
        return loFind(dao.proposals, {id: bounty.id})
    }))

    const titles = ref(bounties.value.map((bounty, index) => {
        const proposal: DAOProposal = proposals.value[index]! as DAOProposal
        return '' // t('default.wf_templ_wf_bounty_title', getArgs(proposal, 'wf_bounty', t, d, n)) // TODO: Rewrite
    }))

    return {
        bounties, proposals, titles,
    }
}