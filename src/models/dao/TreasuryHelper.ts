
import Decimal from "decimal.js";
import moment from "moment";
import { TreasuryLockAsset, TreasuryAssetUnlocking, TreasuryLock } from "./types/treasury";

export default class TreasuryHelper {

  static getNextUnlock(lock: TreasuryLockAsset): Date | null {
    let nextUnlock: Date | null = null

    const nowValueOf = new Date().valueOf();

    let nextUnlockingActual: TreasuryAssetUnlocking | null = null;
    let nextUnlockingPrevious: TreasuryAssetUnlocking | null = null;

    // find lock
    for (let i = 0; i < lock.unlocking.length; i++) {
      if (lock.unlocking[i].targetDate.valueOf() >= nowValueOf && nextUnlockingActual == null) {
        nextUnlockingActual = lock.unlocking[i]
      }
      if (lock.unlocking[i].targetDate.valueOf() < nowValueOf) {
        nextUnlockingPrevious = lock.unlocking[i]
      }
    }

    if (nextUnlockingActual) {
      switch (nextUnlockingActual.type) {
        case 'linear': {
            // TODO: Check computing
            const startAt: Date = nextUnlockingPrevious?.targetDate || lock.startFrom
            const startValue: number = nextUnlockingPrevious?.amount || 0
            const endTo: Date = nextUnlockingActual.targetDate
            const endValue: number = nextUnlockingActual.amount
            const delta: Decimal = new Decimal(endValue - startValue).div(endTo.valueOf() - startAt.valueOf())
            const targetValue: Decimal = new Decimal(lock.totalUnlocked).plus(new Decimal(lock.totalLocked).div(100)) // plus 1 percent
            const targetAt: Decimal = new Decimal(targetValue).div(delta)

            nextUnlock = moment(startAt).add(targetAt.toNumber(), 'milliseconds').toDate() // nextUnlockingActual.targetDate
          }
          break;
        case 'none': {
            if (lock.totalUnlocked < (nextUnlockingPrevious?.amount || 0)) {
              nextUnlock = nextUnlockingPrevious?.targetDate || null
            } else {
              nextUnlock = nextUnlockingActual.targetDate
            }
          }
          break;
        default:
          break;
      }
    } else if (nextUnlockingPrevious) {
      if (lock.totalUnlocked < nextUnlockingPrevious.amount) {
         nextUnlock = nextUnlockingPrevious.targetDate
      }
    }

    return nextUnlock
  }

  static canUnlock(lock: TreasuryLock): boolean {
    return lock.nextUnlock !== null && Date.now().valueOf() > lock.nextUnlock?.valueOf()
  }

  static isUnlocked(lock: TreasuryLock): boolean {
    return lock.nextUnlock === null || Date.now().valueOf() > lock.nextUnlock?.valueOf()
  }

  static getLocked(lockAsset: TreasuryLockAsset): number {
    return lockAsset.totalLocked - lockAsset.totalUnlocked
  }
}