import VersionHelper from "@/models/utils/VersionHelper";
import StringHelper from "@/models/utils/StringHelper";
import _ from "lodash"
import GenericsHelper from "@/models/utils/GenericsHelper";
import { DAODocs, DAODocsFile } from "@/types/dao";
import loFilter from "lodash/filter"
import loOrderBy from "lodash/orderBy"
// import loGet from "lodash/get"
import loSet from "lodash/set"
import loFirst from "lodash/first"
import loFind from "lodash/find"

const getFile = (docs: DAODocs, name: string, category?: string, type?: string, version?: string): DAODocsFile | undefined | any => { // TODO: Remove any
    const filter: object = {'name': name, 'valid': true}

    if (category !== undefined)
        loSet(filter, ['categoryId'], GenericsHelper.getIdByValue(docs.categories, category))
    if (type !== undefined)
        loSet(filter, ['type'], type)
    if (version !== undefined)
        loSet(filter, ['version'], version)

    return loFirst( loOrderBy(loFilter(docs.files, filter) , ['version'], ['desc']))
}

const initStructure = [
    { category: 'fundamental', items: [
        { name: 'web', type: 'url' },
        { name: 'wiki', type: 'url' },
        { name: 'whitepaper', type: 'url' },
        { name: 'source_code', type: 'url' },
        { name: 'domain', type: 'plain' },
        { name: 'logo', type: 'binaryImage' },
        { name: 'cover', type: 'binaryImage' },
      ],
    },
    { category: 'social', items: [
        { name: 'twitter', type: 'url' },
        { name: 'facebook', type: 'url' },
        { name: 'linkedIn', type: 'url' },
      ]
    },
    { category: 'kyc', items: [
        { name: 'legal_status', type: 'plain' },
        { name: 'legal_document', type: 'url' },
      ]
    },
    { category: 'chat', items: [
        { name: 'discord', type: 'url' },
        { name: 'signal', type: 'url' },
        { name: 'telegram', type: 'url' },
      ]
    },
]

const getCategoriesInit = (t: any): string[] => {
  return initStructure.map(item => t('default.' + item.category))
}

const getNamesInit = (t: any): string[] => {
  return [t('default.founding_document'), t('default.discord'), t('default.web'), t('default.twitter'), t('default.legal_status'), t('default.legal_document')]
}

const getCategories = (docs: any, t: any) => {
  const initCategory = getCategoriesInit(t)
  const others = docs.categories.filter((item: any) => _.indexOf(initCategory.concat(['basic']), item.value) == -1).map((item) => item.value).sort()
  return initCategory.concat(others)
}

const getNamesOptions = (docs: any, t: Function) => {
  const files = docs.files.map(item => { return { title: item.name, category: item.category, version: item.version }})

  initStructure.forEach((initCategory) => {
    initCategory.items.forEach((initFile) => {
      if (loFind(files, {title: t('default.' + initFile.name), category: t('default.' + initCategory.category)}) === undefined) {
        files.push({title: t('default.' + initFile.name), category: t('default.' + initCategory.category), version: '0.0'})
      }
    })
  })

  return files
}

const getNames = (docs: any, category: any, t: any) => {
  console.log(category)
  const initCategories = getCategoriesInit(t)
  const initNames = getNamesInit(t)
  let doc_names = []
  let names: string[] = []
  if (category.length > 0) {
    doc_names = docs.files.filter((item: any) => _.isEqual(category, item.category)).map((item: any) => item.name)
    if (_.indexOf(initCategories, category) >= 0) { // category in init
        names = _.sortedUniq(initNames.concat(doc_names).sort())
    } else {
        names = _.sortedUniq(doc_names.sort())
        console.log('not in init category')
    }
  } else {
    doc_names = docs.files.map((item: any) => item.name)
    names = _.sortedUniq(initNames.concat(doc_names).sort())
  }
  console.log(names)
  return names
}

const getKey = (name: string, category: string): string => {
    return StringHelper.toSearch(name) + '_' + StringHelper.toSearch(category)
}

const getIndexInFiles = (files: any, name: string, category: string) => {
    const file_key = getKey(name, category)
    return _.findIndex(files, {'key': file_key})
}

const transform = (docs: DAODocs) => {
    // console.log(category)
    //const initCategories = getCategoriesInit(t)
    //const initNames = getNamesInit(t)
    
    const files: any[] = []
    let key: string
    let file_index: number
    let file_version: number
    let version: number
    // const categories: object = convertArrayOfObjectToObject(docs.categories, 'id', 'value')
    
    docs.files.forEach((element: any, index: number) => {
        version = VersionHelper.toCompare(element.version)
        key = getKey(element.name, element.categoryId)
        // exists
        file_index = getIndexInFiles(files, element.name, element.categoryId)
        if (file_index >= 0) {
            file_version = VersionHelper.toCompare(files[file_index].version)
            // new/old version
            if (version > file_version) {
                files[file_index].versions.push({
                    index: files[file_index].index,
                    version: files[file_index].version,
                    ext: files[file_index].ext,
                    valid: files[file_index].valid,
                    ipfs_cid: files[file_index].ipfs_cid,
                })
                files[file_index].index = index,
                files[file_index].tags = element.tagIds
                files[file_index].version = element.version
                files[file_index].type = element.type
                files[file_index].valid = element.valid
                files[file_index].ipfs_cid = element.value
                files[file_index].search = [StringHelper.toSearch(element.name), StringHelper.toSearch( GenericsHelper.getValueById(docs.categories, element.categoryId) ?? '')].join('-') // TODO: .concat(element.tags.map((tag: any) => StringHelper.toSearch(tag)))
            } else {
                files[file_index].versions.push({
                    index: index,
                    version: element.version,
                    type: element.ext,
                    valid: element.valid,
                    ipfs_cid: element.ipfs_cid,
                })
            }
        } else {
            files.push({
                index: index,
                key: key,
                name: element.name,
                category: GenericsHelper.getValueById(docs.categories, element.categoryId),
                tags: element.tagIds,
                type: element.type,
                version: element.version,
                valid: element.valid,
                ipfs_cid: element.value,
                description: element.description,
                versions: [],
                search: [StringHelper.toSearch(element.name), StringHelper.toSearch( GenericsHelper.getValueById(docs.categories, element.categoryId) ?? '')].join('-') // TODO: .concat(element.tags.map((tag: any) => StringHelper.toSearch(tag)))
            })
        }
    });
    // console.log(files)
    return files
}

export {getCategories, getNamesOptions, getNames, transform, getIndexInFiles, initStructure, getFile}