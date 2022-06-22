import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAODocsFile, DAODocsFileType } from "../types/docs";
import loFind from "lodash/find"
import loHas from "lodash/has"
import loGet from "lodash/get"
import loFindKey from "lodash/findKey"
import { ResourceType } from "@/models/nearBlockchain/types/resource";
import DocsHelper from "../DocsHelper";

export default class ProposalResourceTransformer implements TransformerInterface{

   constructor(){
   }

   transform(value: any): DAODocsFile {
     
      let type: DAODocsFileType
      let docValue: ResourceType

      if (loGet(value, ['type.text'])) {
         type = DAODocsFileType.plain
         docValue = {text: value['type.text']}
      } else if (loGet(value, ['type.link'])) {
          type = DAODocsFileType.url
          docValue = {link: value['type.link']}
      } else {
          type = DAODocsFileType[loFindKey(DAODocsFileType, (key) => key === value['type.cid.mimetype'] ) || '']
          docValue = {
            cid: {
               cid: value['type.cid.cid'],
               ipfs: value['type.cid.ipfs'],
               mimetype: value['type.cid.mimetype']
           }
          }
      }

      const docFile: DAODocsFile =  {
         id: -1,
         name: value.name,
         type: type,
         categoryId: -1,
         category: value.category,
         version: value.version,
         valid: value.valid,
         value: docValue,
         tagIds: value.tags
      }

      docFile.source = DocsHelper.getSource(docFile)

      
      return docFile
   }
   
} 