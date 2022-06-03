import MediaBuilder from "./dao/MediaBuilder"
import IpfsService from "./interfaces/IpfsService.interface"
import { Media } from "./nearBlockchain/types/resource"
import IpfsUtils from "./services/ipfs/IpfsUtils"
import StringHelper from "./utils/StringHelper"

export default class Resource {

    protected ipfsService: IpfsService

    constructor(ipfsService: IpfsService) {
        this.ipfsService = ipfsService
    }

    async storeHtml(html: string, name: string, category: string, ipfsName: string): Promise<Media | null> {
        let mediaBuilder: MediaBuilder | null = null

        if (StringHelper.getWords(html).length > 0) {
            const files = IpfsUtils.makeFileFromHtml(html, ipfsName)
            const cid = await this.ipfsService.store(files, ipfsName)
            mediaBuilder = new MediaBuilder()
            mediaBuilder.addCategory(category)
            mediaBuilder.addName(name)
            mediaBuilder.addCid(cid, this.ipfsService.getSourceName(), 'text/html')
        }

        return mediaBuilder?.create() || null
    }
}