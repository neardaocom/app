import { CreateDao, Settings, TagInput, GroupInput, TreasuryPartitionInput, Asset } from "../nearBlockchain/types/dao";
import { MethodName, ObjectMetadata, FnCallId, Template, TemplateSettings } from "../nearBlockchain/types/workflow";
import DateHelper from "../utils/DateHelper";

import loFind from "lodash/find";
import { Media, ResourceType } from "../nearBlockchain/types/resource";

export default class MediaBuilder {
    protected proposal_id?: number | null
    protected name?: string
    protected category?: string
    protected type?: ResourceType
    protected tags?: number[]
    protected version?: string

    constructor() {
    }

    addName(name: string) {
        this.name = name
    }

    addCategory(name: string) {
        this.category = name
    }

    addCid(cid: string, ipfsService: string, mimetype: string) {
        this.type = {cid: {
            cid,
            mimetype,
            ipfs: ipfsService,
        }}
    }

    addText(text: string) {
        this.type = {text}
    }

    addLink(link: string) {
        this.type = {link}
    }

    addVersion(version: string) {
        this.version = version
    }

    create(): Media {
        if (this.name === undefined) {
            throw new Error("Name is not defined");
        }

        if (this.category === undefined) {
            throw new Error("Category is not defined");
        }

        if (this.type === undefined) {
            throw new Error("Type is not defined");
        }

        return {
            proposal_id: this.proposal_id || null,
            name: this.name,
            category: this.category,
            type: this.type,
            tags: this.tags || [],
            version: this.version || '1.0',
            valid: true,
        }
    }

}