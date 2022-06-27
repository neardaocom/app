import ArrayHelper from '@/models/utils/ArrayHelper'

test('convertArrayOfObjectToObject', () => {
    const test1 = [{code: 'name', value: 'Petr'}, {code: 'amount', value: 20}]

    expect(ArrayHelper.convertArrayOfObjectToObject(test1, 'code', 'value')).toEqual({ name: 'Petr', amount: 20 });
});