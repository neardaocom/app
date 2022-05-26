import TreasuryHelper from '@/models/dao/TreasuryHelper'
import { TreasuryLockAsset } from "@/models/dao/types/treasury";

test('getNextUnlock: now', () => {
    const targetDate = new Date()
    const startFrom = new Date()
    const lockTemplate: TreasuryLockAsset = {
        asset: {
            type: 'ft',
            accountId: 'test.near',
            name: 'Test Ft',
            symbol: 'TEST',
            icon: null,
            decimals: 24,
        },
        startFrom: startFrom,
        totalLocked: 100,
        totalUnlocked: 0,
        unlocked: 0,
        unlocking: [
            {
                type: 'linear',
                targetDate: targetDate,
                amount: 100,
            }
        ]
    }
    targetDate.setHours(1) // late
    lockTemplate.unlocking[0].targetDate = targetDate
    expect(TreasuryHelper.getNextUnlock(lockTemplate)?.valueOf()).toBeLessThan(new Date().valueOf());
});