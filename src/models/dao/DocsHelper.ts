
import StringHelper from "@/models/utils/StringHelper";
import GenericsHelper from "@/models/utils/GenericsHelper";
import { DAODocs, DAODocsFile, DAODocsFileType, DAODocsFilterTypeItem, DAOFile } from "@/models/dao/types/docs"
import loFilter from "lodash/filter"
import loOrderBy from "lodash/orderBy"
import loGet from "lodash/get"
import loSet from "lodash/set"
import loFirst from "lodash/first"
import loFind from "lodash/find"
import loIndexOf from "lodash/indexOf"
import loSortedUniq from "lodash/sortedUniq"
import loIsEqual from "lodash/isEqual"
import loFindIndex from "lodash/findIndex"
import { UnsupportedError } from "../utils/errors";

export default class DocsHelper {
  static initStructure: any[] = [
    { category: 'fundamental', items: [
        { name: 'web', type: 'url' },
        { name: 'wiki', type: 'url' },
        { name: 'whitepaper', type: 'url' },
        { name: 'source_code', type: 'url' },
        { name: 'domain', type: 'plain/text' },
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
        { name: 'legal_status', type: 'plain/text' },
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

  static getIcon(type: string): string {
    let icon = ''
    switch (type as DAODocsFileType) {
    case DAODocsFileType.binaryPdf:
       icon = 'file-pdf'
       break;
    case DAODocsFileType.plain:
    case DAODocsFileType.html:
       icon = 'file-alt'
       break;
    case DAODocsFileType.url:
       icon = 'link'
       break;
    default:
       throw new UnsupportedError('File type: ' + type)
    }
    return icon
 }

  static getFile(docs: DAODocs, name: string, category?: string, type?: string, version?: string): DAODocsFile | undefined | any { // TODO: Remove any
      const filter: object = {'name': name, 'valid': true}

      if (category !== undefined)
          loSet(filter, ['categoryId'], GenericsHelper.getIdByValue(docs.categories, category))
      if (type !== undefined)
          loSet(filter, ['type'], type)
      if (version !== undefined)
          loSet(filter, ['version'], version)

      return loFirst( loOrderBy(loFilter(docs.files, filter) , ['version'], ['desc']))
  }

  static getProposalDescription(docs: DAODocs, proposalId: number): DAODocsFile | undefined { // TODO: Remove any
    return loFind(docs.files, { proposalId })
  }

  static getCategoriesInit(t: Function): string[] {
    return this.initStructure.map(item => t('default.' + item.category))
  }

  static getNamesInit(t: Function): string[] {
    return [t('default.founding_document'), t('default.discord'), t('default.web'), t('default.twitter'), t('default.legal_status'), t('default.legal_document')]
  }

  static getCategories(docs: DAODocs, t: Function): string[] {
    const initCategory = this.getCategoriesInit(t)
    const others: string[] = docs.categories
      .filter((item: any) => loIndexOf(initCategory.concat(['basic']), item.value) == -1)
      .map((item) => item.value!)
      .sort()
    return initCategory.concat(others)
  }

  static getNamesOptions(docs: DAODocs, t: Function) {
    const files = docs.files.map(item => { return { title: item.name, category: item.category, version: item.version }})

    this.initStructure.forEach((initCategory) => {
      initCategory.items.forEach((initFile) => {
        if (loFind(files, {title: t('default.' + initFile.name), category: t('default.' + initCategory.category)}) === undefined) {
          files.push({title: t('default.' + initFile.name), category: t('default.' + initCategory.category), version: '0.0'})
        }
      })
    })

    return files
  }

  static getNames(docs: DAODocs, category: string, t: Function): string[] {
    const initCategories = this.getCategoriesInit(t)
    const initNames = this.getNamesInit(t)
    let doc_names: string[] = []
    let names: string[] = []
    if (category.length > 0) {
      doc_names = docs.files.filter((item: any) => loIsEqual(category, item.category)).map((item: any) => item.name)
      if (loIndexOf(initCategories, category) >= 0) { // category in init
          names = loSortedUniq(initNames.concat(doc_names).sort())
      } else {
          names = loSortedUniq(doc_names.sort())
          console.log('not in init category')
      }
    } else {
      doc_names = docs.files.map((item: any) => item.name)
      names = loSortedUniq(initNames.concat(doc_names).sort())
    }
    // console.log(names)
    return names
  }

  static getKey(name: string, category: string): string {
      return StringHelper.toSearch(name) + '_' + StringHelper.toSearch(category)
  }

  static getIndexInFiles(files: DAOFile[], name: string, category: string): number {
      const file_key = this.getKey(name, category)
      return loFindIndex(files, {'key': file_key})
  }

  static getFilterTypes(t: Function): Record<string, DAODocsFilterTypeItem> {
    return {
      link: {
        name: t('default.link'),
        type: DAODocsFileType.url,
        active: false,
      },
      pdf: {
        name: t('default.pdf'),
        type: DAODocsFileType.binaryPdf,
        active: false,
      },
      html: {
        name: t('default.document'),
        type: DAODocsFileType.html,
        active: false,
      },
    }
  }

  static getSource(file: DAODocsFile): string | undefined {
    let source: string | undefined = undefined

    switch (file.type) {
      case DAODocsFileType.url:
          source = loGet(file, ['value', 'link'])
        break;
      case DAODocsFileType.plain:
          source = loGet(file, ['value', 'text'])
        break;
      case DAODocsFileType.html:
      case DAODocsFileType.binaryPdf:
          source = loGet(file, ['value', 'cid', 'ipfs']) + ': ' + loGet(file, ['value', 'cid', 'cid'])
        break;
      default:
        break;
    }

    return source
  }
}