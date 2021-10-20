import _ from "lodash";
// import { toCompare } from "@/utils/version";
// import { toSearch } from "@/utils/string";

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

/*
const getFiles = (docs, t) => {
    console.log(category)
    const initCategories = getCategoriesInit(t)
    const initNames = getNamesInit(t)
    
    let files = []
    let version_last = null
    let key = null
    let version_step = null
    docs.files.forEach(element => {

        // exists
        files.filter(item => _.isEqual(element.category, item.category)).length
        if ( > 0) {
            version_step = toCompare(element.version)
            
        } else {
            files.push({
                name: element.name,
                category: element.category,
                ext: element.ext,
                version: element.version,
                valid: element.valid,
                ipfs_hash: element.ipfs_hash,
                description: element.description,
                versions: [],
            })
        }
    });
    console.log(files)
    return names
  }
*/

export {getCategories, getNames}