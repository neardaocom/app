import { ResourceType } from "@/models/nearBlockchain/types/resource";
import { DAODocsFileType } from "./dao";

export type DAOFile = {
    id: number;
    index: number;
    key: string;
    name: string;
    categoryId: number;
    category?: string;
    type: DAODocsFileType;
    version: string;
    valid: boolean;
    value: ResourceType;
    description?: string;
    versions: DAOFileVersion[];
    tagIds: number[];
    search?: string;
}

export type DAOFileVersion = {
    index: number;
    version: string;
    type: DAODocsFileType;
    valid: boolean;
    value: ResourceType;
    tagIds: number[];
}