import { convertArrayOfObjectToObject } from '@/utils/array'

test('convertArrayOfObjectToObject', () => {
    const test1 = [{code: 'name', value: 'Petr'}, {code: 'amount', value: 20}]

    expect(convertArrayOfObjectToObject(test1, 'code', 'value')).toEqual({ name: 'Petr', amount: 20 });
});