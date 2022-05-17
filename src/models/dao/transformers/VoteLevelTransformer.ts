import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOVoteType } from "../types/dao";
import moment from 'moment';
import loIsBoolean from "lodash/isBoolean"

export default class VoteLevelTransformer implements TransformerInterface {

    constructor() {
    }

    transform(value: any, params: any) {
        return {
            type: (value.scenario === 'TokenWeighted') ? DAOVoteType.TokenWeighted : DAOVoteType.Democratic,
            quorum: value.quorum,
            approveThreshold: value.approve_threshold,
            spamThreshold: value.spam_threshold,
            duration: {
                days: moment.duration(value.duration * 1000).days(),
                hours: moment.duration(value.duration * 1000).hours(),
                minutes: moment.duration(value.duration * 1000).minutes()
            },
            voteOnlyOnce: loIsBoolean(value.vote_only_once) ? value.vote_only_once : true,
        }
    }
}