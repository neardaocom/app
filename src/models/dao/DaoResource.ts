import IpfsService from "../interfaces/IpfsService.interface";
import { Media } from "../nearBlockchain/types/resource";
import Resource from "../Resource";
import { DAO } from "./types/dao";
import loMax from 'lodash/max'


export default class DaoResource {

    protected resource: Resource
    private t: Function;

    constructor(ipfsService: IpfsService, t: Function) {
        this.resource = new Resource(ipfsService)
        this.t = t
    }

    async storeDescription(dao: DAO, description: string): Promise<Media|null> {
        const maxProposalId = loMax(dao.proposals.map((proposal) => proposal.id))
        return this.resource.storeHtml(
            description,
            this.t('default.proposal_description'),
            this.t('default.proposal_category'),
            '[' + dao.wallet + '][' + ((maxProposalId) ? maxProposalId + 1 : '-') + '] Proposal desc.'
        )
    }
}