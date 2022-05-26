import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOVoteType } from "../types/dao";

export default class VoteTypeTransformer implements TransformerInterface {

    constructor() {
    }

    transform(value: any): DAOVoteType {
        return (value === 'democratic') ? DAOVoteType.Democratic : DAOVoteType.TokenWeighted
    }
}