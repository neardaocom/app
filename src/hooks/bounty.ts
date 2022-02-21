import { DAO, DAOProposal } from "@/types/dao";
import { getTemplateByCode } from "@/models/workflow";
import loFilter from "lodash/filter";
import loFind from "lodash/find";
import { ref } from "vue";
import { getArgs } from "@/models/proposal";

export const useBounties = (dao: DAO, t: Function, d: Function, n: Function) => {
    const template = getTemplateByCode(dao.templates, 'wf_bounty')

    const bounties = ref(loFilter(dao.workflows, {'state': 'Running', templateId: template?.id, actionLastId: undefined}))

    const proposals = ref(bounties.value.map((bounty) => {
        return loFind(dao.proposals, {id: bounty.id})
    }))

    const titles = ref(bounties.value.map((bounty, index) => {
        const proposal: DAOProposal = proposals.value[index]! as DAOProposal
        return t('default.wf_templ_wf_bounty_title', getArgs(proposal, 'wf_bounty', t, d, n))
    }))

    return {
        bounties, proposals, titles,
    }
}