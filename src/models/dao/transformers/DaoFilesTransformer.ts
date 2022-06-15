import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { IDValue } from "@/models/utils/types/generics";
import loFind from "lodash/find"
import loGet from "lodash/get"
import loFindKey from "lodash/findKey"
import { DAODocsFile, DAODocsFileType } from "../types/docs";
import VersionHelper from "@/models/utils/VersionHelper";
import DocsHelper from "../DocsHelper";
import GenericsHelper from "@/models/utils/GenericsHelper";
import StringHelper from "@/models/utils/StringHelper";
import { DAOFile } from "../types/docs";

export default class DaoFilesTransformer implements TransformerInterface {
    private categories: IDValue[];
    private tags: IDValue[];

    constructor(categories: IDValue[], tags: IDValue[]) {
        this.categories = categories
        this.tags = tags
    }

    transform(value: any): DAOFile[] {
        const files: DAOFile[] = []

        let key: string
        let file_index: number
        let file_version: number
        let version: number
        let category: string
        // console.log(category)
        //const initCategories = getCategoriesInit(t)
        //const initNames = getNamesInit(t)
        // const categories: object = convertArrayOfObjectToObject(docs.categories, 'id', 'value')

        value.forEach((element: DAODocsFile, index: number) => {
            version = VersionHelper.toCompare(element.version)
            category = GenericsHelper.getValueById(this.categories, element.categoryId) || ''
            key = DocsHelper.getKey(element.name, category)
            // exists
            file_index = DocsHelper.getIndexInFiles(files, element.name, category)
            if (file_index >= 0) {
                file_version = VersionHelper.toCompare(files[file_index].version)
                // new/old version
                if (version > file_version) {
                    files[file_index].versions.push({
                        id: files[file_index].id,
                        version: files[file_index].version,
                        type: files[file_index].type,
                        valid: files[file_index].valid,
                        value: files[file_index].value,
                        tagIds: files[file_index].tagIds,
                    })

                    files[file_index].id = element.id
                    files[file_index].version = element.version
                    files[file_index].source = DocsHelper.getSource(element),
                    files[file_index].type = element.type
                    files[file_index].valid = element.valid
                    files[file_index].value = element.value
                    files[file_index].tagIds = element.tagIds
                    files[file_index].search = [StringHelper.toSearch(element.name), StringHelper.toSearch( GenericsHelper.getValueById(this.categories, element.categoryId) ?? '')].join('-') // TODO: .concat(element.tags.map((tag: any) => StringHelper.toSearch(tag)))
                } else {
                    files[file_index].versions.push({
                        id: element.id,
                        version: element.version,
                        type: element.type,
                        valid: element.valid,
                        value: element.value,
                        tagIds: element.tagIds,
                    })
                }
            } else {
                files.push({
                    id: element.id,
                    key: key,
                    name: element.name,
                    categoryId: element.categoryId,
                    category: category,
                    source: DocsHelper.getSource(element),
                    type: element.type,
                    version: element.version,
                    valid: element.valid,
                    value: element.value,
                    tagIds: element.tagIds,
                    description: undefined, // TODO: Add description
                    versions: [],
                    search: [StringHelper.toSearch(element.name), StringHelper.toSearch(category)].join('-') // TODO: .concat(element.tags.map((tag: any) => StringHelper.toSearch(tag)))
                })
            }
        });
        // console.log(files)
        return files
    }
}