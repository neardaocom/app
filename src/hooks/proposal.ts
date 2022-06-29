import { Loader } from "@/loader";
import loOrderBy from "lodash/orderBy"
import DaoProposal from "@/models/dao/DaoProposal";
import { DAO, DAORights } from "@/models/dao/types/dao";
import { MarketTemplate } from "@/models/dao/types/market";
import { ref, Ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import ProposalHelper from "@/models/dao/ProposalHelper";
import { Account } from "near-api-js";
import { ProposalVoting } from "@/models/dao/types/proposal";
import DateHelper from "@/models/utils/DateHelper";
import Decimal from "decimal.js";
import { Config } from "@/config";
import DaoProposalBasic from "@/models/dao/DaoProposalBasic";
import loFind from "lodash/find";
import { useResource } from "./docs";
import { DAODocsFile } from "@/models/dao/types/docs";
import DaoSkyward from "@/models/dao/DaoSkyward";

export const useList = (dao: Ref<DAO>, templatesMeta: Ref<MarketTemplate[]>, wallet: Ref<Account>, walletRights: Ref<DAORights[]>, loader: Ref<Loader>) => {
    const { t, d, n } = useI18n()

    const servicePool = loader.value.load('dao/ServicePool')
    const daoProposal = new DaoProposal(dao.value, servicePool.value.getContract(dao.value.wallet))

    const list = ref<ProposalVoting[]>(daoProposal.list(templatesMeta.value, wallet.value.accountId, walletRights.value, t, d, n))

    const activeProposals = () => loOrderBy(list.value.filter((item) => ProposalHelper.isInVoting(item as ProposalVoting)), ['id'], ['desc'])

    return { list, activeProposals }
}

export const useProposal = (dao: Ref<DAO>, loader: Ref<Loader>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const daoProposal = ref(new DaoProposal(dao.value, servicePool.value.getContract(dao.value.wallet)))
    const ipfsService = loader.value.load('services/ipfs')
    const { daoResource } = useResource(ipfsService, dao)

    const vote = (proposalId: number, choice: number) => {
        daoProposal.value.vote(proposalId, choice).catch((e) => {
            // TODO: logger, notify
            //this.$logger.error('D', 'app@components/dao/Proposal', 'Vote-blockchain', `User [${this.accountId}] could not vote in the proposal [${this.proposal.id}]`)
            //this.$logger.error('B', 'app@components/dao/Proposal', 'Vote-blockchain', `User [${this.accountId}] could not vote in the proposal [${this.proposal.id}]`)
            //this.$notify.danger(this.t('notify_proposal_voting_fail_title'), this.t('notify_blockchain_fail') + " " +  this.t('notify_proposal_voting_fail_message' , {proposal: this.proposal.title}))
            //this.$notify.flush()
            console.log(e);
        });
    }
    
    const finish = (proposalId: number) => {
        daoProposal.value.finish(proposalId).catch((e) => {
            // TODO: logger, notify
            //this.$logger.error('D', 'app@components/dao/Proposal', 'Finalize-blockchain', `User [${this.accountId}] could not finalize proposal [${this.proposal.id}`)
            //this.$logger.error('B', 'app@components/dao/Proposal', 'Finalize-blockchain', `User [${this.accountId}] could not finalize proposal [${this.proposal.id}`)
            //this.$notify.danger(this.t('notify_proposal_finalize_fail_title'), this.t('notify_blockchain_fail') + " " +  this.t('notify_proposal_finalize_fail_message', {proposal: this.proposal.title}))
            //this.$notify.flush()
            console.log(e);
        });
    }

    const fetchDescription = async (file: DAODocsFile) => daoResource.value.fetch(file)

    return { daoProposal, vote, finish, fetchDescription }
}

export const useProposalComputed = (proposal: Ref<ProposalVoting>) => {
    const proposalDate = computed(() => DateHelper.format(proposal.value.duration.value, DateHelper.formatDateLong))
    const proposalTime = computed(() => DateHelper.format(proposal.value.duration.value, DateHelper.formatTime))

    return {
        proposalDate, proposalTime
    }
}

export const useProposalCounter = (proposal: Ref<ProposalVoting>) => {
    const proposalProgress = ref(proposal.value.progress)
    const statusCode = computed(() => ProposalHelper.getStatusCode(proposal.value.stateCode, proposal.value.workflowStateCode, proposalProgress.value))

    const progressCounter = () => {
        proposalProgress.value = new Decimal(ProposalHelper.getProgress(proposal.value.stateCode, proposal.value.templateSettings, proposal.value.duration?.value)).round().toNumber()
    }
    const proposalProgressIntervalId = ref<number|undefined>();

    onMounted(() => {
        proposalProgressIntervalId.value = window.setInterval(progressCounter, 2_000)
    })

    onUnmounted(() => {
      window.clearInterval(proposalProgressIntervalId.value)
    })

    return {
        proposalProgress, statusCode, progressCounter, proposalProgressIntervalId
    }
}

export const useProposalBasic = (loader: Ref<Loader>, config: Ref<Config>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const ipfsService = loader.value.load('services/ipfs')
    const proposalBasic = ref(new DaoProposalBasic(config.value.near.wfProviderAccountId, servicePool.value, ipfsService.value))
    return { proposalBasic }
}

