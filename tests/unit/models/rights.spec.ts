import Rights from '@/models/dao/Rights'
import { DAORights, DAORightsType } from "@/models/dao/types/dao";
import { daoTestOne } from "@/data/dao";

test('parse', () => {
    expect(Rights.parse('Anyone')).toEqual({type: DAORightsType.Anyone});

    expect(Rights.parse('Member')).toEqual({type: DAORightsType.Member});

    expect(Rights.parse('TokenHolder')).toEqual({type: DAORightsType.TokenHolder});

    expect(Rights.parse({Account: 'somebody.testnet'})).toEqual({type: DAORightsType.Account, accountId: 'somebody.testnet'});

    expect(Rights.parse({Group: 1})).toEqual({type: DAORightsType.Group, groupId: 1});

    expect(Rights.parse({GroupMember: [1, "somebody.testnet"]})).toEqual({type: DAORightsType.GroupMember, groupId: 1, accountId: 'somebody.testnet'});

    expect(Rights.parse({GroupLeader: 1})).toEqual({type: DAORightsType.GroupLeader, groupId: 1});

    expect(Rights.parse({GroupRole: [1, 1]})).toEqual({type: DAORightsType.GroupRole, groupId: 1, roleId: 1});
});

test('toObject', () => {
    expect(Rights.toObject({type: DAORightsType.Anyone})).toEqual('Anyone');

    expect(Rights.toObject({type: DAORightsType.Member})).toEqual('Member');

    expect(Rights.toObject({type: DAORightsType.TokenHolder})).toEqual('TokenHolder');

    expect(Rights.toObject({type: DAORightsType.Account, accountId: 'somebody.testnet'})).toEqual({Account: 'somebody.testnet'});

    expect(Rights.toObject({type: DAORightsType.Group, groupId: 1})).toEqual({Group: 1});

    expect(Rights.toObject({type: DAORightsType.GroupMember, groupId: 1, accountId: 'somebody.testnet'})).toEqual({GroupMember: [1, "somebody.testnet"]});

    expect(Rights.toObject({type: DAORightsType.GroupLeader, groupId: 1})).toEqual({GroupLeader: 1});

    expect(Rights.toObject({type: DAORightsType.GroupRole, groupId: 1, roleId: 1})).toEqual({GroupRole: [1, 1]});
});

test('check', () => {
    expect(Rights.check([], [])).toBe(false);
    expect(Rights.check([{type: DAORightsType.Anyone}], [])).toBe(false);
    expect(Rights.check([], [{type: DAORightsType.Anyone}])).toBe(false);
    expect(Rights.check([{type: DAORightsType.Group, groupId: 1}], [{type: DAORightsType.Group, groupId: 2}])).toBe(false);

    expect(Rights.check([{type: DAORightsType.Anyone}], [{type: DAORightsType.Anyone}])).toBe(true);
    expect(Rights.check([{type: DAORightsType.Group, groupId: 1}], [{type: DAORightsType.Group, groupId: 1}])).toBe(true);
});

test('getDAORights', () => {
    const daoRights: DAORights[] = Rights.getDAORights(daoTestOne)
    // TRUE
    expect(Rights.check([{type: DAORightsType.Anyone}], daoRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.Member}], daoRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.TokenHolder}], daoRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.Account, accountId: 'token-holder.testnet'}], daoRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.Account, accountId: 'account.testnet'}], daoRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.Group, groupId: 1}], daoRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.GroupMember, groupId: 1, accountId: 'account.testnet'}], daoRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.GroupLeader, groupId: 1}], daoRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.GroupRole, groupId: 1, roleId: 1}], daoRights)).toBe(true);
    // FALSE
    expect(Rights.check([{type: DAORightsType.Account, accountId: 'anybody.testnet'}], daoRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.Group, groupId: 2}], daoRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupMember, groupId: 1, accountId: 'anybody.testnet'}], daoRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupMember, groupId: 2, accountId: 'account.testnet'}], daoRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupLeader, groupId: 2}], daoRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupRole, groupId: 1, roleId: 2}], daoRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupRole, groupId: 2, roleId: 1}], daoRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupRole, groupId: 2, roleId: 2}], daoRights)).toBe(false);
});

test('getWalletRights', () => {
    const walletRights: DAORights[] = Rights.getWalletRights(daoTestOne, 'account.testnet')
    // TRUE
    expect(Rights.check([{type: DAORightsType.Anyone}], walletRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.Member}], walletRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.Account, accountId: 'account.testnet'}], walletRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.Group, groupId: 1}], walletRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.GroupMember, groupId: 1, accountId: 'account.testnet'}], walletRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.GroupLeader, groupId: 1}], walletRights)).toBe(true);
    expect(Rights.check([{type: DAORightsType.GroupRole, groupId: 1, roleId: 1}], walletRights)).toBe(true);
    
    // FALSE
    expect(Rights.check([{type: DAORightsType.TokenHolder}], walletRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.Account, accountId: 'token-holder.testnet'}], walletRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupMember, groupId: 2, accountId: 'account.testnet'}], walletRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupMember, groupId: 1, accountId: 'token-holder.testnet'}], walletRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupLeader, groupId: 2}], walletRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupRole, groupId: 1, roleId: 2}], walletRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupRole, groupId: 2, roleId: 1}], walletRights)).toBe(false);
    expect(Rights.check([{type: DAORightsType.GroupRole, groupId: 2, roleId: 2}], walletRights)).toBe(false);

})

test('toTranslate', () => {
    expect(Rights.toTranslate({type: DAORightsType.Anyone}, daoTestOne.groups)).toEqual({key: 'rights_anyone', params: {}});

    expect(Rights.toTranslate({type: DAORightsType.Member}, daoTestOne.groups)).toEqual({key: 'rights_member', params: {}});

    expect(Rights.toTranslate({type: DAORightsType.TokenHolder}, daoTestOne.groups)).toEqual({key: 'rights_token_holder', params: {}});

    expect(Rights.toTranslate({type: DAORightsType.Account, accountId: 'somebody.testnet'}, daoTestOne.groups)).toEqual({key: 'rights_account', params: {accountId: 'somebody.testnet'}});

    expect(Rights.toTranslate({type: DAORightsType.Group, groupId: 1}, daoTestOne.groups)).toEqual({key: 'rights_group', params: {groupId: 1, group: 'Council'}});

    expect(Rights.toTranslate({type: DAORightsType.GroupMember, groupId: 1, accountId: 'somebody.testnet'}, daoTestOne.groups)).toEqual({key: 'rights_group_member', params: {groupId: 1, group: 'Council', accountId: 'somebody.testnet'}});

    expect(Rights.toTranslate({type: DAORightsType.GroupLeader, groupId: 1}, daoTestOne.groups)).toEqual({key: 'rights_group_leader', params: {groupId: 1, group: 'Council'}});

    expect(Rights.toTranslate({type: DAORightsType.GroupRole, groupId: 1, roleId: 1}, daoTestOne.groups)).toEqual({key: 'rights_group_role', params: {groupId: 1, group: 'Council', roleId: 1, role: ''}});
});