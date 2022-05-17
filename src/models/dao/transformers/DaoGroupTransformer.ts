import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loToString from "lodash/toString";

export default class DaoGroupTransformer implements TransformerInterface {

    private tags: string[];

    constructor(tags: string[]) {
        this.tags = tags
    }

    transform(value: any, params: any) {
        let token

        const members = value.members.map(member => {
            return{
                accountId: member.account_id, 
                roles: member.tags.map(tag => this.tags.map[tag])
            }
        })

        if (value.release_data && value.release_model){
            const algorithm: string = Object.keys(value.release_model)[0]
            token = {
                algorithm: algorithm,
                locked: value.release_data.total,
                init: value.release_data.init_distribution,
                distributed: value.release_data.init_distribution,
                unlocked: value.release_data.unlocked,
                duration: value.release_model[algorithm].duration,
                releaseEnd: value.release_model[algorithm].release_end,
            }
        }

        return {
            id: value.id,
            name: value.settings.name,
            leader: value.settings.leader || undefined,
            members,
            token: token || undefined
        }
    }
}