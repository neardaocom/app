// import logger from "@/logger";
import IpfsService from "@/models/services/ipfs/Web3StorageService";
import IpfsUtils from "@/models/services/ipfs/IpfsUtils"
import { DAODocsFile, DAODocsFileType } from "@/models/dao/types/dao";
import lodashToString from "lodash/toString";
import loGet from "lodash/get"

export const fetch = async (file: DAODocsFile, service?: IpfsService): Promise<string | undefined> => {
    let value: string | undefined = undefined
    
    
    // console.log(DAODocsFileType[DAODocsFileType.url])
    switch (lodashToString(file.type)) {
        case lodashToString(DAODocsFileType.url): // TODO: move to plain after refact smart contract
            value = loGet(file, ['value', 'link'])
            break;
        case lodashToString(DAODocsFileType.plain): {
            // if (typeof file.value !== 'string') throw new Error("Unexpected type of attribure");
            value = loGet(file, ['value', 'text'])
            break;
        }
        case lodashToString(DAODocsFileType.html): {
            if (service === undefined) throw new Error("service is undefined");
            //if (typeof file.value === 'string') throw new Error("Unexpected type of attribure");
            const fetched: any = await service.retrieve(value = loGet(file, ['value', 'cid', 'cid']))
            value = await fetched[0].text()
            break;
        }
        case lodashToString(DAODocsFileType.binaryPdf): {
            if (service === undefined) throw new Error("service is undefined");
            //if (typeof file.value === 'string') throw new Error("Unexpected type of attribure");
            const fetchedBinary: any = await service.retrieve(loGet(file, ['value', 'cid', 'cid']))
            value = URL.createObjectURL(fetchedBinary[0])
            break;
        }
        default:
            throw new Error("Unsupported scenario: " + file.type);
    }
    return value
}

export const storeText = async (text: string, name: string, service: IpfsService): Promise<string | undefined> => {
    try {
        const ipfsCid = await service.store(IpfsUtils.makeFileFromString(text, name), name)
        return ipfsCid
      } catch(e){
        // this.$logger.error('D', 'app@components/dao/ModalAddCouncil', 'StoreFile-ipfs', 'File saving to ipfs failed')
        // this.$logger.error('B', 'app@components/dao/ModalAddCouncil', 'StoreFile-ipfs', 'File saving to ipfs failed')
        // this.$notify.danger(this.t('default.notify_save_file_ipfs_fail_title'), this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_save_file_ipfs_fail_message'))
        // this.$notify.flush()
        console.log(e);
        return 
      }

}