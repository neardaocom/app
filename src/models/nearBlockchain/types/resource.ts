export type Media = {
    proposal_id: number|null;
    name: string;
    category: string;
    type: ResourceType; 
    tags: number[];
    version: string;
    valid: boolean;
}

export type ResourceType = ResourceTypeText | ResourceTypeLink | ResourceTypeCid

export type ResourceTypeText = {
    text: string;
}
export type ResourceTypeLink = {
    link: string;
}
export type ResourceTypeCid = {
    cid: {
        cid: string;
        ipfs: string;
        mimetype: string;
    }
}
