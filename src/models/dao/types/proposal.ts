import { DateFormated } from "@/models/utils/types/generics";
import { WFSettings } from "./workflow";

export type ProposalVoting = {
    id: number;
    code: string;
    title: string;
    description: string;
    typeCode: string;
    type: string;
    stateCode: string;
    state: string;
    status: string;
    canVote: boolean;
    isOver: boolean;
    isVoted: boolean;
    args: Record<string, unknown>;
    votingStats: any;
    duration: DateFormated;
    choiceIndex: string;
    choice: string;
    progress: number;
    quorum?: number;
    templateSettings: WFSettings;
    workflowScenarioId:  number | null;
    search: string;
}