const data = () => ({
  id: 1,
  name: 'Podílník',
  about: 'Tokenizace - nástupce tradičních organizací.',
  description: '',
  wallet: 'podilnik.near',
  address: 'Praha, CZ',
  domain: 'podilnik.cz',
  web: 'http://www.podilnik.cz',
  token: 1_000_000,
  token_unlocked: {
    council: 30,
    community: 10,
    investor: 50,
    public_sale: 0
  },
  groups: {
    council: {
      amount: 40,
      wallets: [
        'petrfilla.near', 'chaplin.near', 'petrstudynka.near', 'jansladky.near'
      ]
    },
    community: {
      amount: 20,
      wallets: []
    },
    investor: {
      amount: 15,
      wallets: []
    },
    public_sale: {
      amount: 25,
      wallets: []
    },
  },
  tags: [
    'DAO', 'Organizace', 'CzechRepublic'
  ],
  treasury: {
    near: 1254.45664,
    w_delta: 12.6,
    currency: 'czk',
    currency_amount: null
  },
  market: {
    near: null,
    w_delta: null,
    eth: null,
    btc: null,
    currency: 'czk',
    currency_amount: null
  }
})

export default {
  data
}