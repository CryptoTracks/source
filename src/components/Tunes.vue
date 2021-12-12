<template>
  <div id="tunes" class="container">
    <meta-mask v-if="!account"></meta-mask>
    <template v-else>
      <h1 v-if="address">Tunes by <small class="text-muted">{{ address }}</small></h1>
      <h1 v-else>Latest Tunes</h1>
      <div class="row mb-3">
        <div class="col col-md-4 col-12" v-for="tuneId in tunes" :key="tuneId">
          <mini-tune :tuneId="tuneId"></mini-tune>
        </div>
        <div class="col col-md-4 col-12">
          <router-link class="btn btn-outline-primary mt-3 mr-3" to="/tunes/new">New</router-link>
          <button class="btn btn-outline-primary mt-3" v-if="anyMore" @click="loadMore()">Load More...</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import * as Tone from 'tone'
import MiniTune from '@/components/MiniTune'
import MetaMask from '@/components/MetaMask'
import EventBus from '@/helpers/EventBus'

export default {
  name: 'Tunes',
  data () {
    return {
      tunes: [],
      maxId: null,
      nextId: 0
    }
  },
  props: {
    address: String
  },
  mounted () {
    if (this.account) {
      this.initTunes()
    }
    Tone.Transport.start('+0.1')
    Tone.Transport.bpm.value = 90
    EventBus.$on('account-changed', () => {
      this.initTunes()
    })
    EventBus.$on('network-changed', () => {
      this.initTunes()
    })
  },
  destroyed () {
    Tone.Transport.stop()
  },
  watch: {
    address: 'initTunes'
  },
  components: { MiniTune, MetaMask },
  computed: {
    anyMore () {
      return !this.address && this.nextId >= 0
    },
    account () {
      return this.$parent.account
    }
  },
  methods: {
    initTunes () {
      if (this.address) {
        this.getArtistTunes()
      } else {
        this.getMax()
      }
    },
    getMax () {
      const vm = this
      this.$parent.ctContract.deployed()
        .then(instance => {
          return instance.getTunesLength()
        })
        .then(res => {
          // console.info('max id => ', res)
          vm.maxId = res
          vm.tunes = []
          vm.getTunes()
        })
        .catch(err => {
          console.error(err)
        })
    },
    getArtistTunes () {
      const vm = this
      this.$parent.ctContract.deployed()
        .then(instance => {
          return instance.getArtistTunes(vm.address)
        })
        .then(res => {
          // console.info('artist tunes => ', res)
          res.reverse()
          vm.tunes = res.map(t => t.toString(10));
        })
        .catch(err => {
          console.error(err)
        })
    },
    getTunes () {
      this.nextId = this.maxId - 1
      let min = this.maxId - 6 < 0 ? 0 : this.maxId - 6
      while (this.nextId >= min) {
        this.tunes.push(this.nextId)
        this.nextId--
      }
    },
    loadMore () {
      this.maxId = this.maxId - 6
      this.getTunes()
    }
  }
}
</script>
