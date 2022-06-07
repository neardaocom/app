import { CreateDao, Settings, TagInput, GroupInput, TreasuryPartitionInput, Asset } from "../nearBlockchain/types/dao";
import { MethodName, ObjectMetadata, FnCallId, Template, TemplateSettings } from "../nearBlockchain/types/workflow";
import DateHelper from "../utils/DateHelper";

import loFind from "lodash/find";
import { Media } from "../nearBlockchain/types/resource";

export default class DaoBuilder {
    private tokenId?: string;
    private stakingId?: string;
    private totalSupply?: number;
    private decimals: number = 24;
    private settings?: Settings;
    private groups: GroupInput[] = [];
    private tags: TagInput[] = [];
    private treasuryPartitions: TreasuryPartitionInput[] = [];
    private media: Media[] = []

    private standardFunctionCalls?: MethodName[];
    private standardFunctionCallMetadata?: ObjectMetadata[][];
    private functionCalls?: FnCallId[];
    private functionCallMetadata?: ObjectMetadata[];
    private workflowTemplates?: Template[];
    private workflowTemplateSettings?: TemplateSettings[][];

    constructor() {
    }

    // deprecated
    addTokenId(tokenId: string) {
        this.tokenId = tokenId
    }

    // deprecated
    addStakingId(stakingId: string) {
        this.stakingId = stakingId
    }

    addTotalSupply(amount: number) {
        this.totalSupply = amount
    }

    addDecimals(decimals: number) {
        this.decimals = decimals
    }

    addSettings(name: string, purpose: string, tags: number[], daoAdminAccountId: string, workflowProvider: string, resourceProvider: string, scheduler: string, stakingAccountId: string, tokenAccountId: string) {
        this.settings = {
            name,
            purpose,
            tags,
            dao_admin_account_id: daoAdminAccountId,
            dao_admin_rights:  ["upgrade"],
            workflow_provider: workflowProvider,
            resource_provider: resourceProvider,
            scheduler,
            token_id: tokenAccountId,
            staking_id: stakingAccountId,
        }
    }

    addGroup(name: string, accountIds: string[], leader: string|null, parentGroup: number) {
        this.groups.push({
            settings: {name, leader, parent_group: parentGroup},
            members: accountIds.map((accountId) => ({account_id: accountId, tags: []})),
            member_roles: [{
                name,
                members: accountIds
            }]
        })
    }

    addTag(name: string, category: string) {
        const item = loFind(this.tags, {category: category})
        if (item !== undefined) {
            item.values.push(name)
        } else {
            this.tags.push({category: category, values: [name]})
        }
    }


    addWorkflow(standardFunctionCalls: MethodName[], standardFunctionCallMetadata: ObjectMetadata[][], functionCalls: FnCallId[], functionCallMetadata: ObjectMetadata[], workflowTemplates: Template[], workflowTemplateSettings: TemplateSettings[][]) {
        this.standardFunctionCalls = standardFunctionCalls
        this.standardFunctionCallMetadata = standardFunctionCallMetadata
        this.functionCalls = functionCalls
        this.functionCallMetadata = functionCallMetadata
        this.workflowTemplates = workflowTemplates
        this.workflowTemplateSettings = workflowTemplateSettings
    }

    addTreasuryPartitionFt(name: string, assetId: string, assetDecimals: number, assetAmount: number, lockDuration: number) {
        this.treasuryPartitions.push({name, assets: [{
            asset_id: { ft: {account_id: assetId, decimals: assetDecimals} },
            unlocking: {
                amount_init_unlock: 0,
                lock: {
                    amount_total_lock: assetAmount,
                    start_from: DateHelper.nowToSeconds(),
                    duration: lockDuration,
                    periods: [{
                        type: "linear",
                        duration: lockDuration,
                        amount: assetAmount,
                    }],
                }
            }
        }]})
    }

    create(): CreateDao {
        if (this.tokenId === undefined) {
            throw new Error("TokenId is not defined");
        }

        if (this.stakingId === undefined) {
            throw new Error("StakingId is not defined");
        }

        if (this.totalSupply === undefined) {
            throw new Error("Total supply is not defined");
        }

        if (this.settings === undefined) {
            throw new Error("Settings is not defined");
        }

        if (this.standardFunctionCalls === undefined
            || this.standardFunctionCallMetadata === undefined
            || this.functionCalls === undefined
            || this.functionCallMetadata === undefined
            || this.workflowTemplates === undefined
            || this.workflowTemplateSettings === undefined
        ) {
            throw new Error("Symbol is not defined");
        }

        return {
            total_supply: this.totalSupply,
            decimals: this.decimals,
            settings: this.settings,
            groups: this.groups,
            tags: this.tags,
            standard_function_calls: this.standardFunctionCalls,
            standard_function_call_metadata: this.standardFunctionCallMetadata,
            function_calls: [this.functionCalls],
            function_call_metadata: [this.functionCallMetadata],
            workflow_templates: this.workflowTemplates,
            workflow_template_settings: this.workflowTemplateSettings,
            treasury_partitions: this.treasuryPartitions,
            media: this.media,
        };
    }

}