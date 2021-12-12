<template>
  <div class="mt-3 mb-3" :class="{card: !onlyGrid}">
    <div class="card-header text-light" v-if="!onlyGrid">
      <h5 class="float-left" v-if="tuneId">Tune #{{ tuneId.toString(10) }}</h5>
      <template v-if="!$parent.address">
        <span class="float-right text-muted" v-if="isNotMe">by
          <router-link :to="'/tunes?address=' + artist">{{ artist.toString().substring(0,8) }}...</router-link>
        </span>
          <span class="float-right text-muted" v-else>by
          <router-link :to="'/tunes?address=' + artist">Me...</router-link>
        </span>
      </template>
    </div>
    <div class="card-body">
      <span class="text-muted" v-if="onlyGrid && isNotMe">by <router-link :to="'/tunes?address=' + artist">{{ artist.toString().substring(0,8) }}...</router-link></span>
      <div class="tune-row pb-1" v-for="(track, index) in tracks" v-bind:key="index">
        <div class="tune-col h-100" v-for="(bar, barIndex) in track.bars" v-bind:key="(index + 1) * barIndex">
          <div class="h-100" :class="noteClass(bar, barIndex, index)" v-if="bar.play"></div>
          <div class="bg-secondary h-100" v-else></div>
        </div>
      </div>
    </div>
    <div class="card-footer" v-if="!onlyGrid">
      <button class="btn btn-sm float-right" :class="favoriteCSS" :title="isNotMe ? 'Save to Favorites' : 'Favorites'" @click="favorite()" :disabled="!isNotMe || myFavorites.indexOf(tuneId.toString()) > -1" v-if="account && !tracksPreview"><font-awesome-icon :icon="fa.star()"></font-awesome-icon> {{ favCount > 0 ? favCount.toString() : '' }}</button>
      <button class="btn btn-sm btn-outline-danger float-left" v-if="playing" @click="stop()"><font-awesome-icon :icon="fa.stop()"></font-awesome-icon></button>
      <button class="btn btn-sm btn-outline-primary float-left" v-else @click="play()"><font-awesome-icon :icon="fa.play()"></font-awesome-icon></button>
    </div>
  </div>
</template>

<script>
import TuneHelpers from '@/helpers/TuneHelpers'
import EventBus from '@/helpers/EventBus'
import FaHelper from '@/helpers/FaHelper'
import Genesis from '@/helpers/genesis.json'

export default {
  data () {
    return {
      currentBar: null,
      loop: null,
      playing: false,
      synths: null,
      tracks: [],
      artist: '',
      favCount: 0,
      favFee: 0.1
    }
  },
  props: {
    tuneId: [Object, Number, String],
    onlyGrid: Boolean,
    start: Boolean,
    tracksPreview: Array
  },
  computed: {
    fa () {
      return FaHelper
    },
    account () {
      return this.$parent.$parent.account
    },
    isNotMe () {
      if (!this.account) {
        return true
      }
      return this.account.toLowerCase() !== this.artist.toLowerCase()
    },
    myFavorites () {
      return this.$parent.$parent.myFavorites
    },
    favoriteCSS () {
      if (this.isNotMe && this.myFavorites) {
        if (this.myFavorites.indexOf(this.tuneId.toString()) > -1) {
          return 'btn-primary'
        } else {
          return 'btn-outline-primary'
        }
      } else {
        return 'btn-outline-secondary'
      }
    }
  },
  mounted () {
    this.getTune()
    this.loop = TuneHelpers.sequence(this)
    const vm = this
    EventBus.$on('played', tuneId => {
      if (tuneId !== vm.tuneId) {
        vm.stop()
      }
    })
    EventBus.$on('favorite', tuneId => {
      if (tuneId === vm.tuneId) {
        vm.favCount++
      }
    })
  },
  methods: {
    play () {
      this.synths = []
      for (let i = 0; i < 8; i++) {
        this.synths.push(TuneHelpers.initSynth(this.tracks[i].synth))
      }
      this.loop.start()
      this.playing = true
      EventBus.$emit('played', this.tuneId)
    },
    stop () {
      this.loop.stop()
      this.synths = null
      this.playing = false
    },
    noteClass (bar, barIndex) {
      if (!this.playing || (this.playing && this.currentBar === barIndex)) {
        return `bg-${bar.note.replace('#', 'S')}-${bar.octave} duration-${bar.duration}`
      } else {
        return 'bg-dark'
      }
    },
    getTune () {
      const vm = this
      if (this.tracksPreview) {
        this.tracks = this.tracksPreview
        this.artist = this.account
      } else if (this.$ethereum && this.account) {
        this.$parent.$parent.ctContract.deployed()
          .then(instance => {
            return instance.getTune(vm.tuneId)
          })
          .then(res => {
            vm.tracks = TuneHelpers.decoder(res)
            vm.artist = res[8]
            vm.favCount = res[9]
            if (vm.start) {
              this.play()
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else if (this.tuneId.toString() === '0') {
        vm.tracks = Genesis
        vm.artist = '0x39AEd335D6Bb9c16f3138eF25DEE95a9deF231b3'
      }
    },
    favorite () {
      const vm = this
      EventBus.$emit('open-favorite', vm.tuneId, vm.artist)
    }
  },
  destroyed () {
    this.stop()
  }
}
</script>

<style>
svg {
  fill: currentColor;
}
</style>
