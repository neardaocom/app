const data = {
    id: '',
    name: '',
    about: '',
    description: '',
    wallet: '',
    address: '',
    domain: '',
    web: '',
    token: null,
    token_name: '',
    version: 0,
    token_unlocked: {
      council: 0,
      community: 0,
      investor: 0,
      public_sale: 0
    },
    groups: {
      council: {
        amount: 0,
        wallets: []
      },
      community: {
        amount: 0,
        wallets: []
      },
      investor: {
        amount: 0,
        wallets: []
      },
      public_sale: {
        amount: 0,
        wallets: []
      },
    },
    tags: [],
    treasury: {
      near: null,
      w_delta: null,
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
    },
    doc: {
      files: [],
      map: {}
    }
  }
  
  export default {
    data
  }