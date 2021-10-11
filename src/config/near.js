const CONTRACT_NAME = process.env.VUE_APP_NEAR_CONTRACT_NAME
const NAME = process.env.VUE_APP_NEAR_NAME

function getConfig(env) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        name: NAME,
        contractName: CONTRACT_NAME + '.near',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      }
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        name: NAME,
        contractName: CONTRACT_NAME /* + '.testnet'*/,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      }
    case 'betanet':
      return {
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        name: NAME,
        contractName: CONTRACT_NAME + '.betanet',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org'
      }
    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
        name: NAME,
        contractName: CONTRACT_NAME + '.local'
      }
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        name: NAME,
        contractName: CONTRACT_NAME + '.ci-testnet',
        masterAccount: 'test.near'
      }
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        name: NAME,
        contractName: CONTRACT_NAME + '.ci-betanet',
        masterAccount: 'test.near'
      }
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
  }
}

module.exports = getConfig