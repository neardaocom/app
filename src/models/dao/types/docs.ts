import { ResourceType } from "@/models/nearBlockchain/types/resource";
import { IDValue } from "@/models/utils/types/generics";

export enum DAODocsFileType {
    url = 'url',
    plain = 'text/plain',
    binaryPdf = 'application/pdf',
    html = 'text/html',
  }
  
  export type DAODocsFile = {
    id: number;
    name: string;
    type: DAODocsFileType;
    categoryId: number;
    category: string,
    version: string;
    valid: boolean;
    value: ResourceType;
    tagIds: number[];
  }
  
  export type DAODocs = {
    files: DAODocsFile[];
    categories: IDValue[];
    tags: IDValue[];
  }

export type DAOFile = {
    id: number;
    key: string;
    name: string;
    categoryId: number;
    category?: string;
    source?: string;
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
    id: number;
    version: string;
    type: DAODocsFileType;
    valid: boolean;
    value: ResourceType;
    tagIds: number[];
}

export type DAODocsStructure = {
    category: string;
    items: DAODocsStructureItem[]
}

export type DAODocsStructureItem = {
    name: string;
    type: DAODocsFileType
}

export type DAODocsFilterTypeItem = {
    name: string;
    type: DAODocsFileType;
    active: boolean;
}