export type NearConfig = {
  networkId: string;
  nodeUrl: string;
  name: string;
  contractName: string;
  walletUrl: string;
  helperUrl: string;
  masterAccount?: string;
}

export type NearConfigLocal = {
  networkId: string;
  nodeUrl: string;
  name: string;
  contractName: string;
  walletUrl: string;
  keyPath: string;
}

export type NearConfigCI = {
  networkId: string;
  nodeUrl: string;
  name: string;
  contractName: string;
  masterAccount: string;
}

export const getConfig = (env: string): NearConfig | NearConfigLocal | NearConfigCI => {
  if (
    process.env.VUE_APP_NEAR_CONTRACT_NAME === undefined
    || process.env.VUE_APP_NEAR_NAME === undefined
  ) {
    throw new Error("NEAR config undefined");
  }

  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        name: process.env.VUE_APP_NEAR_NAME,
        contractName: process.env.VUE_APP_NEAR_CONTRACT_NAME + '.near',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      }
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        name: process.env.VUE_APP_NEAR_NAME,
        contractName: process.env.VUE_APP_NEAR_CONTRACT_NAME, // + '.testnet',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      }
    case 'betanet':
      return {
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        name: process.env.VUE_APP_NEAR_NAME,
        contractName: process.env.VUE_APP_NEAR_CONTRACT_NAME + '.betanet',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org'
      }
    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        name: process.env.VUE_APP_NEAR_NAME,
        contractName: process.env.VUE_APP_NEAR_CONTRACT_NAME + '.local',
        walletUrl: 'http://localhost:4000/wallet',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
      }
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        name: process.env.VUE_APP_NEAR_NAME,
        contractName: process.env.VUE_APP_NEAR_CONTRACT_NAME + '.ci-testnet',
        masterAccount: 'test.near',
      }
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        name: process.env.VUE_APP_NEAR_NAME,
        contractName: process.env.VUE_APP_NEAR_CONTRACT_NAME + '.ci-betanet',
        masterAccount: 'test.near',
      }
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
  }
}