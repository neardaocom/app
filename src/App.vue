<template>
  <router-view/>
</template>

<script>
  export default {
    components: {
    },
    created() {
      this.$store.dispatch('near/init')
      //this.nearConfig = getConfig(process.env.NODE_ENV || "development");
      //this.near = nearAPI.connect(Object.assign({ deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }, this.nearConfig));
      //this.nearWallet = new nearAPI.WalletAccount(this.near);
      
      //if (this.nearWallet.getAccountId() !== undefined) {
      //  this.$store.commit('accountLogin', 'petrfilla.near')
      //}

      // Getting the Account ID. If unauthorized yet, it's just empty string.
      //window.accountId = window.walletAccount.getAccountId();
      //console.log('count is: ' + this.$store.state.accountId) // => "count is: 1"
    }
  };
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

</style>