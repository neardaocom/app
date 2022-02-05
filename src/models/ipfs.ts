import { IpfsService } from "@/services/ipfsService/IpfsService";
import { DAODocsFile, DAODocsFileType } from "@/types/dao";
import lodashToString from "lodash/toString";

export const fetch = async (file: DAODocsFile, service?: IpfsService): Promise<string | undefined> => {
    let value: string | undefined = undefined

    // console.log(file.type)
    // console.log(DAODocsFileType[DAODocsFileType.url])
    switch (lodashToString(file.type)) {
        case lodashToString(DAODocsFileType[DAODocsFileType.plain]): {
            if (typeof file.value !== 'string') throw new Error("Unexpected type of attribure");
            value = file.value
            break;
        }
        case lodashToString(DAODocsFileType[DAODocsFileType.url]): // TODO: move to plain after refact smart contract
        case lodashToString(DAODocsFileType[DAODocsFileType.html]): {
            if (service === undefined) throw new Error("service is undefined");
            if (typeof file.value === 'string') throw new Error("Unexpected type of attribure");
            const fetched: any = await service.retrieveFiles(file.value.cid)
            value = await fetched[0].text()
            break;
        }
        case lodashToString(DAODocsFileType[DAODocsFileType.binaryPdf]): {
            if (service === undefined) throw new Error("service is undefined");
            if (typeof file.value === 'string') throw new Error("Unexpected type of attribure");
            const fetchedBinary: any = await service.retrieveFiles(file.value.cid)
            value = URL.createObjectURL(fetchedBinary[0])
            break;
        }
        default:
            throw new Error("Unsupported scenario: " + file.type);
    }
    return value
}