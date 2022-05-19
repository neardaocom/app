import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { IDValue } from "@/models/utils/types/generics";
import loFind from "lodash/find"
import loFindKey from "lodash/findKey"
import { DAODocsFileType } from "../types/dao";

export default class DaoDocsTransformer implements TransformerInterface {
    private categories: IDValue[];
    private tags: IDValue[];

    constructor(categories: IDValue[], tags: IDValue[]) {
        this.categories = categories
        this.tags = tags
    }

    transform(value: any, params: any) {
        const mediaTypeKey = Object.keys(value.media_type)[0]
        const mediaKey = mediaTypeKey === 'Link' || mediaTypeKey === 'Text' ? 
            value.media_type[mediaTypeKey] : 
            { source: value.media_type[mediaTypeKey].ipfs, cid: value.media_type[mediaTypeKey].cid }

        let type = DAODocsFileType.plain
        switch (mediaTypeKey) {
            case 'Link':
                type = DAODocsFileType.url
                break
            case 'Text':
                type = DAODocsFileType.plain
                break
            default:
                type = DAODocsFileType[loFindKey(DAODocsFileType, key => key === value.media_type[mediaTypeKey].mimetype ) || ''];
        }

        return {
            name: value.name,
            type: type,
            categoryId: loFind(this.categories, { value: value.category })?.id ?? -1,
            category: value.category,
            version: value.version,
            valid: value.valid,
            value: mediaKey,
            tagIds: value.tags,
        };
    }
}