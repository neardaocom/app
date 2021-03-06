import { DateFormated } from "@/models/utils/types/generics";
import { DAODocsFile } from "./docs";
import { WFInstance, WFSettings } from "./workflow";

export type ProposalVoting = {
    id: number;
    code: string;
    title: string;
    description?: DAODocsFile;
    typeCode: string;
    type: string;
    stateCode: string;
    state: string;
    workflowStateCode: string;
    statusCode?: string;
    canVote: boolean;
    isOver: boolean;
    isVoted: boolean;
    args: Record<string, unknown>;
    votingStats: any;
    duration: DateFormated;
    choiceIndex: string;
    choice: string;
    progress: number;
    approveThreshold?: number;
    quorum?: number;
    templateSettings: WFSettings;
    workflow?: WFInstance;
    search: string;
    resource?: DAODocsFile; 
}