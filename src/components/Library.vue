<template>
  <div id="library" class="container">
    <meta-mask v-if="!account"></meta-mask>
    <template v-else>
      <div class="row">
        <div class="col col-12">
          <h1>Library</h1>
          <hr>
          <p class="text-muted">My Address: {{ account }}</p>
        </div>
      </div>
      <div class="row">
        <div class="col col-12 col-md-6">
          <div class="card mt-3 mb-3">
            <div class="card-header text-light">
              <h3 class="float-left">My Tunes</h3>
              <router-link :to="'/tunes?address=' + account" title="Public Link" class="float-right">
                <font-awesome-icon :icon="fa.link()"></font-awesome-icon>
              </router-link>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush" v-if="account">
                <template v-for="tune in myTunes">
                  <li class="list-group-item d-flex justify-content-between align-items-center" :key="tune + 'a'">
                    Tune #{{ tune }}
                    <a href="!#" @click.prevent="play(tune)" v-if="playingTune != tune">
                      <font-awesome-icon :icon="fa.play()" class="text-primary"></font-awesome-icon>
                    </a>
                    <a href="!#" @click.prevent="stop(tune)" v-if="playingTune == tune">
                      <font-awesome-icon :icon="fa.stop()" class="text-danger"></font-awesome-icon>
                    </a>
                  </li>
                  <li class="list-group-item" :key="tune + 'b'" v-if="playingTune == tune"><mini-tune :tuneId="tune" :onlyGrid="true" :start="true"></mini-tune></li>
                </template>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <router-link to="/tunes/new" class="btn btn-outline-primary">New</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col col-12 col-md-6">
          <div class="card mt-3 mb-3">
            <div class="card-header text-light">
              <h3 class="float-left">My Favorites</h3>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush" v-if="account">
                <template v-for="tune in myFavorites">
                  <li class="list-group-item d-flex justify-content-between align-items-center" :key="tune + 'c'">
                    Tune #{{ tune }}
                    <a href="!#" @click.prevent="play(tune)" v-if="playingTune != tune">
                      <font-awesome-icon :icon="fa.play()" class="text-primary"></font-awesome-icon>
                    </a>
                    <a href="!#" @click.prevent="stop(tune)" v-if="playingTune == tune">
                      <font-awesome-icon :icon="fa.stop()" class="text-danger"></font-awesome-icon>
                    </a>
                  </li>
                  <li class="list-group-item" :key="tune + 'd'" v-if="playingTune == tune"><mini-tune :tuneId="tune" :onlyGrid="true" :start="true"></mini-tune></li>
                </template>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <router-link to="/tunes" class="btn btn-outline-primary">Browse</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import FaHelper from '@/helpers/FaHelper'
import MiniTune from '@/components/MiniTune'
import * as Tone from 'tone'
import MetaMask from '@/components/MetaMask'

export default {
  components: {
    MetaMask,
    MiniTune
  },
  name: 'Library',
  data () {
    return {
      playingTune: null,
      myTunes: [],
      tuneOwners: {}
    }
  },
  computed: {
    fa () {
      return FaHelper
    },
    account () {
      return this.$parent.account
    },
    myFavorites () {
      return this.$parent.myFavorites
    }
  },
  watch: {
    account: 'getArtistTunes'
  },
  mounted () {
    this.getArtistTunes()
    setInterval(() => {
      this.getArtistTunes()
    }, 5000)
    Tone.Transport.start('+0.1')
    Tone.Transport.bpm.value = 90
  },
  methods: {
    getArtistTunes () {
      const vm = this
      this.$parent.ctContract.deployed()
        .then(instance => {
          return instance.getArtistTunes(vm.account)
        })
        .then(res => {
          // console.info('artist tunes => ', res)
          res.reverse()
          vm.myTunes = res.map(t => t.toString(10));
        })
        .catch(err => {
          console.error(err)
        })
    },
    play (tune) {
      this.playingTune = tune
    },
    stop () {
      this.playingTune = null
    }
  },
  destroyed () {
    Tone.Transport.stop()
  }
}
</script>
