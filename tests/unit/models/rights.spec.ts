import { parse, toObject, check, getDAORights, toTranslate } from '@/models/rights'
import { DAORights, DAORightsType } from "@/types/dao";
import { daoTestOne } from "@/data/dao";

test('parse', () => {
    expect(parse('Anyone')).toEqual({type: DAORightsType.Anyone});

    expect(parse('Member')).toEqual({type: DAORightsType.Member});

    expect(parse('TokenHolder')).toEqual({type: DAORightsType.TokenHolder});

    expect(parse({Account: 'somebody.testnet'})).toEqual({type: DAORightsType.Account, accountId: 'somebody.testnet'});

    expect(parse({Group: 1})).toEqual({type: DAORightsType.Group, groupId: 1});

    expect(parse({GroupMember: [1, "somebody.testnet"]})).toEqual({type: DAORightsType.GroupMember, groupId: 1, accountId: 'somebody.testnet'});

    expect(parse({GroupLeader: 1})).toEqual({type: DAORightsType.GroupLeader, groupId: 1});

    expect(parse({GroupRole: [1, 1]})).toEqual({type: DAORightsType.GroupRole, groupId: 1, roleId: 1});
});

test('toObject', () => {
    expect(toObject({type: DAORightsType.Anyone})).toEqual('Anyone');

    expect(toObject({type: DAORightsType.Member})).toEqual('Member');

    expect(toObject({type: DAORightsType.TokenHolder})).toEqual('TokenHolder');

    expect(toObject({type: DAORightsType.Account, accountId: 'somebody.testnet'})).toEqual({Account: 'somebody.testnet'});

    expect(toObject({type: DAORightsType.Group, groupId: 1})).toEqual({Group: 1});

    expect(toObject({type: DAORightsType.GroupMember, groupId: 1, accountId: 'somebody.testnet'})).toEqual({GroupMember: [1, "somebody.testnet"]});

    expect(toObject({type: DAORightsType.GroupLeader, groupId: 1})).toEqual({GroupLeader: 1});

    expect(toObject({type: DAORightsType.GroupRole, groupId: 1, roleId: 1})).toEqual({GroupRole: [1, 1]});
});

test('check', () => {
    expect(check([], [])).toBe(false);
    expect(check([{type: DAORightsType.Anyone}], [])).toBe(false);
    expect(check([], [{type: DAORightsType.Anyone}])).toBe(false);
    expect(check([{type: DAORightsType.Group, groupId: 1}], [{type: DAORightsType.Group, groupId: 2}])).toBe(false);

    expect(check([{type: DAORightsType.Anyone}], [{type: DAORightsType.Anyone}])).toBe(true);
    expect(check([{type: DAORightsType.Group, groupId: 1}], [{type: DAORightsType.Group, groupId: 1}])).toBe(true);
});

test('getDAORights', () => {
    const daoRights: DAORights[] = getDAORights(daoTestOne)
    // TRUE
    expect(check([{type: DAORightsType.Anyone}], daoRights)).toBe(true);
    expect(check([{type: DAORightsType.Member}], daoRights)).toBe(true);
    expect(check([{type: DAORightsType.TokenHolder}], daoRights)).toBe(true);
    expect(check([{type: DAORightsType.Account, accountId: 'token-holder.testnet'}], daoRights)).toBe(true);
    expect(check([{type: DAORightsType.Account, accountId: 'account.testnet'}], daoRights)).toBe(true);
    expect(check([{type: DAORightsType.Group, groupId: 1}], daoRights)).toBe(true);
    expect(check([{type: DAORightsType.GroupMember, groupId: 1, accountId: 'account.testnet'}], daoRights)).toBe(true);
    expect(check([{type: DAORightsType.GroupLeader, groupId: 1}], daoRights)).toBe(true);
    expect(check([{type: DAORightsType.GroupRole, groupId: 1, roleId: 1}], daoRights)).toBe(true);
    // FALSE
    expect(check([{type: DAORightsType.Account, accountId: 'anybody.testnet'}], daoRights)).toBe(false);
    expect(check([{type: DAORightsType.Group, groupId: 2}], daoRights)).toBe(false);
    expect(check([{type: DAORightsType.GroupMember, groupId: 1, accountId: 'anybody.testnet'}], daoRights)).toBe(false);
    expect(check([{type: DAORightsType.GroupMember, groupId: 2, accountId: 'account.testnet'}], daoRights)).toBe(false);
    expect(check([{type: DAORightsType.GroupLeader, groupId: 2}], daoRights)).toBe(false);
    expect(check([{type: DAORightsType.GroupRole, groupId: 1, roleId: 2}], daoRights)).toBe(false);
    expect(check([{type: DAORightsType.GroupRole, groupId: 2, roleId: 1}], daoRights)).toBe(false);
});

test('toTranslate', () => {
    expect(toTranslate({type: DAORightsType.Anyone}, daoTestOne.groups)).toEqual({key: 'rights_anyone', params: {}});

    expect(toTranslate({type: DAORightsType.Member}, daoTestOne.groups)).toEqual({key: 'rights_member', params: {}});

    expect(toTranslate({type: DAORightsType.TokenHolder}, daoTestOne.groups)).toEqual({key: 'rights_token_holder', params: {}});

    expect(toTranslate({type: DAORightsType.Account, accountId: 'somebody.testnet'}, daoTestOne.groups)).toEqual({key: 'rights_account', params: {accountId: 'somebody.testnet'}});

    expect(toTranslate({type: DAORightsType.Group, groupId: 1}, daoTestOne.groups)).toEqual({key: 'rights_group', params: {groupId: 1, group: 'Council'}});

    expect(toTranslate({type: DAORightsType.GroupMember, groupId: 1, accountId: 'somebody.testnet'}, daoTestOne.groups)).toEqual({key: 'rights_group_member', params: {groupId: 1, group: 'Council', accountId: 'somebody.testnet'}});

    expect(toTranslate({type: DAORightsType.GroupLeader, groupId: 1}, daoTestOne.groups)).toEqual({key: 'rights_group_leader', params: {groupId: 1, group: 'Council'}});

    expect(toTranslate({type: DAORightsType.GroupRole, groupId: 1, roleId: 1}, daoTestOne.groups)).toEqual({key: 'rights_group_role', params: {groupId: 1, group: 'Council', roleId: 1, role: ''}});
});