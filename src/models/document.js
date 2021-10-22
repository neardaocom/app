import _ from "lodash";
import { toCompare } from "@/utils/version";
import { toSearch } from "@/utils/string";

const getCategoriesInit = (t) => {
  return [t('default.fundamental')]
}

const getNamesInit = (t) => {
  return [t('default.founding_document'), t('default.discord'), t('default.web'), t('default.twitter')]
}

const getCategories = (docs, t) => {
  const initCategory = getCategoriesInit(t)
  const others = docs.map.categories.filter(item => _.indexOf(initCategory.concat(['basic']), item) == -1).sort()
  return initCategory.concat(others)
}

const getNames = (docs, category, t) => {
  console.log(category)
  const initCategories = getCategoriesInit(t)
  const initNames = getNamesInit(t)
  let doc_names = []
  let names = []
  if (category.length > 0) {
    doc_names = docs.files.filter(item => _.isEqual(category, item.category)).map(item => item.name)
    if (_.indexOf(initCategories, category) >= 0) { // category in init
        names = _.sortedUniq(initNames.concat(doc_names).sort())
    } else {
        names = _.sortedUniq(doc_names.sort())
        console.log('not in init category')
    }
  } else {
    doc_names = docs.files.map(item => item.name)
    names = _.sortedUniq(initNames.concat(doc_names).sort())
  }
  console.log(names)
  return names
}

const getKey = (name, category) => {
    return toSearch(name) + '_' + toSearch(category)
}

const getIndexInFiles = (files, name, category) => {
    const file_key = getKey(name, category)
    return _.findIndex(files, {'key': file_key})
}

const transform = (docs) => {
    // console.log(category)
    //const initCategories = getCategoriesInit(t)
    //const initNames = getNamesInit(t)
    
    let files = []
    let key = null
    let file_index = null
    let file_version = null
    let version = null
    docs.files.forEach((element, index) => {
        version = toCompare(element.version)
        key = getKey(element.name, element.category)
        // exists
        file_index = getIndexInFiles(files, element.name, element.category)
        if (file_index >= 0) {
            file_version = toCompare(files[file_index].version)
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
                files[file_index].tags = element.tags
                files[file_index].version = element.version
                files[file_index].ext = element.ext
                files[file_index].valid = element.valid
                files[file_index].ipfs_cid = element.ipfs_cid
                files[file_index].search = [toSearch(element.name), toSearch(element.category), toSearch(element.description)].concat(element.tags.map(tag => toSearch(tag))).join('-')
            } else {
                files[file_index].versions.push({
                    index: index,
                    version: element.version,
                    ext: element.ext,
                    valid: element.valid,
                    ipfs_cid: element.ipfs_cid,
                })
            }
        } else {
            files.push({
                index: index,
                key: key,
                name: element.name,
                category: element.category,
                tags: element.tags,
                ext: element.ext,
                version: element.version,
                valid: element.valid,
                ipfs_cid: element.ipfs_cid,
                description: element.description,
                versions: [],
                search: [toSearch(element.name), toSearch(element.category), toSearch(element.description)].concat(element.tags.map(tag => toSearch(tag))).join('-')
            })
        }
    });
    // console.log(files)
    return files
}

export {getCategories, getNames, transform, getIndexInFiles}