import { Loader } from "@/loader";
import DaoStaking from "@/models/dao/DaoStaking";
import Staking from "@/models/nearBlockchain/Staking";
import StakingTransformer from "@/models/dao/transformers/StakingTransformer";
import { UserInfoStaking } from "@/models/nearBlockchain/types/staking";
import { StorageBalance, StorageBalanceBounds } from "@/models/nearBlockchain/types/storageManagement";
import { computed, inject, onMounted, Ref, ref, toRaw } from "vue";
import { useI18n } from "vue-i18n";
import loGet from "lodash/get";
import { DAO } from "@/models/dao/types/dao";

export const useStaking = (daoId: string, accountId: string, staking: Staking) => {
   const logger: any = inject("logger");
   const notify: any = inject("notify");
   const { t, n } = useI18n();
   const userInfo = ref<UserInfoStaking | undefined>()
   const daoStakedTokensAmount = ref<string | undefined>()
   const userStakedTokensAmount = ref<string | undefined>()
   const storageBalanceBounds = ref<StorageBalanceBounds | undefined>()
   const daoStorageBalance = ref<StorageBalance | undefined | null>()

   onMounted(async () => {
      await fetch()
   });

   const fetch = async () => {
      try {
         const stakingTransformer = new StakingTransformer();
         const data = await Promise.all([
            staking.daoGetUser(daoId, accountId, stakingTransformer),
            staking.daoFtTotalSupply(daoId),
            staking.daoFtBalanceOf(daoId, accountId),
            staking.storageBalanceBounds(),
            staking.storageBalanceOf(daoId)
         ])
         userInfo.value = data[0]
         daoStakedTokensAmount.value = data[1]
         userStakedTokensAmount.value = data[2]
         storageBalanceBounds.value = data[3]
         daoStorageBalance.value = data[4]
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   }

   const storageDeposite = async (accountId: string | null, registrationOnly: boolean | null, gas: string, deposit: string) => {
      try {
         await staking.storageDeposit(accountId, registrationOnly, gas, deposit);
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const registerNewDao = async (daoId: string, voteTokenId: string, gas: string) => {
      try {
         await staking.registerNewDao(daoId, voteTokenId, gas);
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const registerInDao = async (daoId: string, gas: string, deposit: string) => {
      try {
         await staking.registerInDao(daoId, gas, deposit)
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const delegateOwned = async (daoId: string, delegateId: string, amount: string, gas: string) => {
      try {
         await staking.delegateOwned(daoId, delegateId, amount, gas)
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const delegate = async (daoId: string, delegateId: string, amount: string, gas: string) => {
      try {
         await staking.delegate(daoId, delegateId, amount, gas)
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const undelegate = async (daoId: string, delegateId: string, amount: string, gas: string) => {
      try {
         await staking.undelegate(daoId, delegateId, amount, gas)
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const withdraw = async (daoId: string, amount: string, gas: string) => {
      try {
         await staking.withdraw(daoId, amount, gas)
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const unregisterInDao = async (daoId: string, gas: string) => {
      try {
         await staking.unregisterInDao(daoId, gas)
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const storageWithdraw = async (amount: string | null, gas: string) => {
      try {
         await staking.storageWithdraw(amount, gas)
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   const useStorageUnregister = async (force: boolean | null, gas: string) => {
      try {
         await staking.storageUnregister(force, gas)
      } catch (e) {
         //TODO:  logget and warning translations
         logger.error("D", "", "LoadStakingUserInfo", "Loading staking user info");
         logger.error("B", "", "LoadStakingUserInfo", "Loading staking user info");

         notify.warning("Loading staking user info faild");
         notify.flush();
         console.log(e);
      }
   };

   return {
      userInfo, daoStakedTokensAmount, userStakedTokensAmount, storageBalanceBounds, daoStorageBalance,
      fetch, storageDeposite, registerNewDao, registerInDao, delegateOwned, delegate, undelegate, withdraw, unregisterInDao, storageWithdraw, useStorageUnregister
   };
};

export const useStake = (dao: Ref<DAO>, loader: Ref<Loader>) => {
   const canStake = computed(() => dao.value.staking.userInfo !== null)

   // init
   const runAction = async (action: string, args: object) => {
      const nearFactory = await loader.value.get('nearBlockchain/Factory')
      const account = await loader.value.get('near/WalletAccount')
      const walletConnection = await loader.value.get('near/WalletConnection')
      const service = nearFactory.value.createStakingContractService(account.value)
      const ftService = nearFactory.value.createFtContractService(account.value, dao.value.statistics.token_id)
      // console.log(account, config.value.near.ftFactoryAccountId)
      const daoStaking = new DaoStaking(dao.value.wallet, service, ftService, walletConnection.value)

      switch (action) {
         case 'register': {
               await daoStaking.stakeRegister()
            }
            break;
         case 'stake': {
               await daoStaking.stake(loGet(args, ['amount']) || 0)
            }
            break;
         case 'delegate': {
               await daoStaking.delegate(loGet(args, ['delegateId']) || '', loGet(args, ['amount']) || 0)
            }
            break;
         case 'undelegate': {
               await daoStaking.undelegate(loGet(args, ['delegateId']) || '', loGet(args, ['amount']) || 0)
            }
            break;
         case 'forward': {
               await daoStaking.forward(loGet(args, ['delegateId']) || '')
            }
            break;
         case 'withdraw': {
               await daoStaking.withdraw(loGet(args, ['amount']) || 0)
            }
            break;
         default:
            break;
      }
   }

   return {
      canStake, runAction
   }
}

export const useRegisterToken = (loader: Ref<Loader>) => {
   const registerToken = async (daoAccountId: string, tokenAccountId: string) => {
      const nearFactory = await loader.value.get('nearBlockchain/Factory')
      const account = await loader.value.get('near/WalletAccount')
      const walletConnection = await loader.value.get('near/WalletConnection')
      const service = nearFactory.value.createStakingContractService(account.value)
      const ftService = nearFactory.value.createFtContractService(account.value, null)
      // console.log(account, config.value.near.ftFactoryAccountId)
      const daoStaking = new DaoStaking(daoAccountId, service, ftService, walletConnection.value)

      daoStaking.registerToken(tokenAccountId, 1)
   }

   return {
      registerToken
   }
}
