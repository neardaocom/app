import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loToString from "lodash/toString";

export default class DaoGroupTransformer implements TransformerInterface {

    private tags: string[];

    constructor(tags: string[]) {
        this.tags = tags
    }

    transform(value: any, params: any) {
        let token

        const members = Object.keys(value[1].members).map((accountId) => {
            return{
                accountId, 
                roles: value[1].members[accountId].map(tag => this.tags.map[tag])
            }
        })

        return {
            id: value[0],
            name: value[1].settings.name,
            leader: value[1].settings.leader || undefined,
            members,
            parentId: value[1].settings.parent_group
        }
    }
}