import { getTest } from './../../../src/models/analytics'

test('adds 1 + 2 to equal 3', () => {
    expect(getTest('test')).toBe('silent');
});