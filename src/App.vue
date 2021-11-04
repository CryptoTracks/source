`<template>
  <div id="app">
    <nav class="navbar navbar-dark navbar-expand-md">
      <router-link class="navbar-brand" to="/">CryptoTracks <span class="text-danger">(TESTNET)</span></router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/library">My Library</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tunes">Latest Tunes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/wtf">WTF</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <main role="main">
      <div class="container">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="alert-heading">TESTNET Alert!</h4>
          <p>The CryptoTracks smart contract is deployed to the Ropsten Test Net.  With enough interest, CryptoTracks will go live.  Show your interest by donating Ether to cryptotracks.eth or contributing on GitHub: <a href="https://github.com/CryptoTracks/source" target="_blank"><font-awesome-icon :icon="fa.github()"></font-awesome-icon></a></p>
        </div>
      </div>
      <router-view :key="$route.name + ($route.params.address || '')"/>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col col-12">
            <span clas="text-muted mr-1">&copy; 2018, 2021 CryptoTracks</span>
            <a href="https://github.com/CryptoTracks" class="ml-1 mr-1" target="_blank"><font-awesome-icon :icon="fa.github()"></font-awesome-icon></a>
            <a href="https://twitter.com/Crypto__Tracks" class="mr-1" target="_blank"><font-awesome-icon :icon="fa.twitter()"></font-awesome-icon></a>
          </div>
        </div>
      </div>
    </footer>
    <favorite-modal></favorite-modal>
    <preview-modal></preview-modal>
  </div>
</template>

<script>
import TruffleContract from 'truffle-contract'
import CtJSON from '../build/contracts/CryptoTracks.json'
import FavoriteModal from '@/components/FavoriteModal'
import PreviewModal from '@/components/PreviewModal'
import EventBus from '@/helpers/EventBus'
import FaHelper from '@/helpers/FaHelper'

export default {
  name: 'App',
  components: { FavoriteModal, PreviewModal },
  data () {
    return {
      account: null,
      ctContract: null,
      myFavorites: []
    }
  },
  created () {
    // remove when mainnet deployed...
    this.$ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x3' }],
    });
    this.$ethereum.on('accountsChanged', this.handleAccountsChanged)
    const vm = this
    this.initAccount()
    this.initContract()
    this.getMyFavorites()
    setInterval(() => {
      this.initAccount()
    }, 2000)

    EventBus.$on('favorite', tuneId => {
      this.myFavorites.push(tuneId)
    })
    EventBus.$on('account-changed', () => {
      if (this.$ethereum) {
        vm.getMyFavorites()
      }
    })
  },
  watch: {
    'account': () => {
      EventBus.$emit('account-changed')
    }
  },
  computed: {
    fa () {
      return FaHelper
    }
  },
  methods: {
    handleAccountsChanged (accounts) {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== this.account) {
        this.account = accounts[0];
      }
    },
    initAccount () {
      return this.$ethereum.request({ method: 'eth_requestAccounts' })
        .then(this.handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });
    },
    initContract () {
      // console.info(CtJSON)
      this.ctContract = TruffleContract(CtJSON);
      this.ctContract.setProvider(this.$ethereum);
    },
    getMyFavorites () {
      const vm = this
      if (this.account) {
        this.ctContract.deployed()
          .then(instance => {
            return instance.getMyFavorites({from: vm.account})
          })
          .then(res => {
            vm.myFavorites = res.map(t => t.toString(10))
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }
}
</script>

<style lang="scss">
@import 'assets/scss/custom.scss';

html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 60px;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
}

</style>
