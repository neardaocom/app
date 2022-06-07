import { ResourceType } from "../nearBlockchain/types/resource";

export default class ResourceTypeBuilder {
    protected type?: ResourceType

    constructor() {
    }

    addCid(cid: string, ipfsService: string, mimetype: string) {
        this.type = {
            cid: {
                cid,
                mimetype,
                ipfs: ipfsService,
            }
        }
    }

    addText(text: string) {
        this.type = {text}
    }

    addLink(link: string) {
        this.type = {link}
    }

    create(): ResourceType {
        if (this.type === undefined) {
            throw new Error("Type is not defined");
        }

        return this.type
    }

}