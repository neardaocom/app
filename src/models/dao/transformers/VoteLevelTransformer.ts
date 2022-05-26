import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOVoteType } from "../types/dao";
import moment from 'moment';
import loIsBoolean from "lodash/isBoolean"
import VoteTypeTransformer from "./VoteTypeTransformer";

export default class VoteLevelTransformer implements TransformerInterface {

    protected voteTypeTransformer: VoteTypeTransformer;

    constructor() {
        this.voteTypeTransformer = new VoteTypeTransformer()
    }

    transform(value: any) {
        return {
            type: this.voteTypeTransformer.transform(value.scenario),
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