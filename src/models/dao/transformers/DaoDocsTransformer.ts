import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { IDValue } from "@/models/utils/types/generics";
import loFind from "lodash/find"
import loGet from "lodash/get"
import loFindKey from "lodash/findKey"
import { DAODocsFile, DAODocsFileType } from "../types/dao";

export default class DaoDocsTransformer implements TransformerInterface {
    private categories: IDValue[];
    private tags: IDValue[];

    constructor(categories: IDValue[], tags: IDValue[]) {
        this.categories = categories
        this.tags = tags
    }

    transform(value: any): DAODocsFile {
        let type: DAODocsFileType

        if (loGet(value[1], ['text'])) {
            type = DAODocsFileType.plain
        } else if (loGet(value[1], ['link'])) {
            type = DAODocsFileType.url
        } else {
            type = DAODocsFileType[loFindKey(DAODocsFileType, (key) => key === value[1].type.cid.mimetype ) || '']
        }

        return {
            id: value[0],
            name: value[1].name,
            type: type,
            categoryId: loFind(this.categories, { value: value[1].category })?.id ?? -1,
            category: value[1].category,
            version: value[1].version,
            valid: value[1].valid,
            value: value[1].type,
            tagIds: value[1].tags,
        };
    }
}