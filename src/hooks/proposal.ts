import { Loader } from "@/loader";
import DaoProposal from "@/models/dao/DaoProposal";
import ServicePool from "@/models/dao/ServicePool";
import { DAO, DAORights } from "@/models/dao/types/dao";
import { MarketTemplate } from "@/models/dao/types/market";
import { ref, Ref} from "vue";
import { useI18n } from "vue-i18n";

export const useList = (dao: Ref<DAO>, templatesMeta: Ref<MarketTemplate[]>, walletId: string, walletRights: DAORights[], loader: Ref<Loader>) => {
    const { t, d, n } = useI18n()

    const servicePool = loader.value.load('dao/ServicePool')
    const daoProposal = new DaoProposal(dao.value, servicePool.value.getContract(dao.value.wallet))

    const list = ref(daoProposal.list(templatesMeta.value, walletId, walletRights, t, d, n))

    return { list }
}

export const useProposal = (dao: Ref<DAO>, loader: Ref<Loader>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const daoProposal = ref(new DaoProposal(dao.value, servicePool.value.getContract(dao.value.wallet)))

    const vote = (proposalId: number, choice: number) => {
        daoProposal.value.vote(proposalId, choice).catch((e) => {
            // TODO: logger, notify
            //this.$logger.error('D', 'app@components/dao/Proposal', 'Vote-blockchain', `User [${this.accountId}] could not vote in the proposal [${this.proposal.id}]`)
            //this.$logger.error('B', 'app@components/dao/Proposal', 'Vote-blockchain', `User [${this.accountId}] could not vote in the proposal [${this.proposal.id}]`)
            //this.$notify.danger(this.t('default.notify_proposal_voting_fail_title'), this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_proposal_voting_fail_message' , {proposal: this.proposal.title}))
            //this.$notify.flush()
            console.log(e);
        });
    }
    
    const finish = (proposalId: number) => {
        daoProposal.value.finish(proposalId).catch((e) => {
            // TODO: logger, notify
            //this.$logger.error('D', 'app@components/dao/Proposal', 'Finalize-blockchain', `User [${this.accountId}] could not finalize proposal [${this.proposal.id}`)
            //this.$logger.error('B', 'app@components/dao/Proposal', 'Finalize-blockchain', `User [${this.accountId}] could not finalize proposal [${this.proposal.id}`)
            //this.$notify.danger(this.t('default.notify_proposal_finalize_fail_title'), this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_proposal_finalize_fail_message', {proposal: this.proposal.title}))
            //this.$notify.flush()
            console.log(e);
        });
    }

    return { daoProposal, vote, finish }
}