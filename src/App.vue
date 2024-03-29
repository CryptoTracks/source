`<template>
  <div id="app">
    <nav class="navbar navbar-dark navbar-expand-md">
      <router-link class="navbar-brand" to="/">CryptoTracks</router-link>
      <span v-if="account" :class="{ 'text-success': network === 1, 'text-warning': network === 3, 'text-secondary': network !== 1 && network !== 3 }">
        <font-awesome-icon :icon="fa.dotCircle()" size="xs" :pulse="true"></font-awesome-icon>
        <small class="ml-1">{{ connectedText }}</small>
      </span>
      <a v-else href="#!" @click.prevent="initAccount()">
        <font-awesome-icon :icon="fa.dotCircle()" size="xs" :pulse="true"></font-awesome-icon>
        <small class="ml-1">{{ connectedText }}</small>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
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
      <!-- <div class="container">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="alert-heading">TESTNET Alert!</h4>
          <p>The CryptoTracks smart contract is deployed to the Ropsten Test Net.  With enough interest, CryptoTracks will go live.  Show your interest by donating Ether to cryptotracks.eth or contributing on GitHub: <a href="https://github.com/CryptoTracks/source" target="_blank"><font-awesome-icon :icon="fa.github()"></font-awesome-icon></a></p>
        </div>
      </div> -->
      <router-view :key="$route.name + ($route.params.address || '')"/>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col col-12">
            <span clas="text-muted mr-1">&copy; 2018, 2021 CryptoTracks</span>
            <a href="https://github.com/CryptoTracks" class="ml-1 mr-1" target="_blank"><font-awesome-icon :icon="fa.github()"></font-awesome-icon></a>
            <a href="https://twitter.com/Crypto__Tracks" target="_blank"><font-awesome-icon :icon="fa.twitter()"></font-awesome-icon></a>
            <a href="https://www.dapp.com/app/cryptotracks" target="_blank" title="Listed on dapp.com"><img src="/dapp.com.logo.png" height="50"></a>
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
      network: null,
      ctContract: null,
      myFavorites: []
    }
  },
  created () {
    this.initContract()
    this.$ethereum.on('accountsChanged', this.handleAccountsChanged)
    this.network = this.$ethereum && this.$ethereum.chainId ? parseInt(this.$ethereum.chainId.replace('0x', '')) : null;
    this.$ethereum.on('networkChanged', (network) => this.network = parseInt(network))

    EventBus.$on('favorite', tuneId => {
      this.myFavorites.push(tuneId)
    })
    EventBus.$on('connect', () => {
      this.initAccount();
    })
    EventBus.$on('account-changed', () => {
      if (this.$ethereum) {
        this.getMyFavorites()
      }
    })
    EventBus.$on('network-changed', () => {
      if (this.$ethereum) {
        this.initContract()
        this.getMyFavorites()
      }
    })
  },
  watch: {
    'account': () => {
      EventBus.$emit('account-changed')
    },
    'network': () => {
      EventBus.$emit('network-changed')
    }
  },
  computed: {
    fa () {
      return FaHelper
    },
    connectedText () {
      if (this.account) {
        if (this.networkName) {
          return `Connected (${this.networkName}@${this.account.substring(0,8)}...)`
        } else {
          return 'Unsupported Network'
        }
      } else {
        return 'Not Connected'
      }
    },
    networkName () {
      switch (this.network) {
        case 1:
          return 'mainnet'
        case 3:
          return 'ropsten'
        default:
          return null
      }
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
