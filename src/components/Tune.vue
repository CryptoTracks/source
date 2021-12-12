<template>
  <div id="tune" class="container">
    <meta-mask v-if="!account"></meta-mask>
    <template v-if="account">
      <div class="card mt-3 mb-3">
        <div class="card-header">
          <h1 class="float-left">New Tune</h1>
          <button class="btn btn-outline-danger float-right ml-2" @click="reset()">Reset</button>
          <button class="btn btn-outline-warning float-right ml-2" @click="rando()">Chaos</button>
          <button class="btn btn-outline-danger float-right" v-if="playing" @click="stop()"><font-awesome-icon :icon="faHelper.stop()"></font-awesome-icon></button>
          <button class="btn btn-outline-primary float-right" v-else @click="play()"><font-awesome-icon :icon="faHelper.play()"></font-awesome-icon></button>
        </div>
        <div class="card-body">
          <div class="row mb-2" v-for="(track, index) in tracks" v-bind:key="index">
            <div class="col col-12 mb-2">
              <div class="tune-row">
                <div class="tune-col h-100 mb-2" v-for="(bar, barIndex) in track.bars" v-bind:key="(index + 1) * barIndex" @click="toggleBar(index, barIndex)">
                  <div class="h-100" :class="noteClass(bar, barIndex, index)" v-if="bar.play"></div>
                  <div class="bg-secondary h-100" v-else></div>
                  <form class="dropdown-menu p-4 border-primary" :class="{ 'show': isSelected(index, barIndex) }" @click.stop @submit.prevent>
                    <div class="form-group">
                      <span class="close" @click="selectedBar = null">&times;</span>
                    </div>
                    <div class="form-group">
                      <label>Note</label>
                      <select class="form-control" v-model="bar.note">
                        <option v-for="(note, noteIndex) in notes" v-bind:key="'note' + index + barIndex + noteIndex">{{ note }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Octave</label>
                      <select class="form-control" v-model="bar.octave">
                        <option v-for="octave in 8" v-bind:key="'note' + index + barIndex + octave">{{ octave }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Duration</label>
                      <select class="form-control" v-model="bar.duration">
                        <option v-for="duration in durations" v-bind:key="'dur' + index + barIndex + duration">{{ duration }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <button @click.prevent="test(index, barIndex)" class="btn btn-sm btn-outline-primary">Test</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col col-12">
              <div class="row">
                <div class="col col-sm-4 col-12">
                  <h3>Track #{{ index + 1 }}: {{ track.synth }}</h3>
                </div>
                <div class="col col-sm-8 col-12 mt-2">
                  <div class="row" v-if="index === 4 || index === 5">
                    <div class="col col-lg-3 col-md-4 col-6 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="48%"
                        data-height="50%"
                        data-fgColor="#17a2b8"
                        data-min="-15"
                        data-max="15"
                        value="0"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="volume">
                      <!--<font-awesome-layers class="fa-5x text-primary text-center">-->
                      <!--<font-awesome-icon :icon="faHelper.lifeRing()"></font-awesome-icon>-->
                      <!--<span class="fa-layers-text fa-inverse" data-fa-transform="shrink-11">{{ track.volume}}</span>-->
                      <!--</font-awesome-layers>-->
                      <br>
                      <span class="knob-label">Volume</span>
                    </div>
                    <div class="col col-lg-3 col-md-4 col-6 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="48%"
                        data-height="50%"
                        data-fgColor="#17a2b8"
                        data-min="0"
                        data-max="10"
                        value="0"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="attackNoise">
                      <br>
                      <span class="knob-label">Noise</span>
                    </div>
                    <div class="col col-lg-3 col-md-4 col-6 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="58%"
                        data-height="60%"
                        data-fgColor="#17a2b8"
                        data-min="0"
                        data-max="10000"
                        data-step="100"
                        value="0"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="dampening">
                      <br>
                      <span class="knob-label">Dampening</span>
                    </div>
                    <div class="col col-lg-3 col-md-4 col-6 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="48%"
                        data-height="50%"
                        data-fgColor="#17a2b8"
                        data-min="0"
                        data-max="0.99"
                        data-step="0.01"
                        value="0"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="resonance">
                      <br>
                      <span class="knob-label">Resonance</span>
                    </div>
                  </div>
                  <div class="row" v-if="index !== 4 && index !== 5">
                    <div class="col col-lg-2 col-md-3 col-4 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="80%"
                        data-height="82%"
                        data-fgColor="#17a2b8"
                        data-min="-15"
                        data-max="15"
                        value="0"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="volume">
                      <br>
                      <span class="knob-label">Volume</span>
                    </div>
                    <div class="col col-lg-2 col-md-3 col-4 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="82%"
                        data-height="82%"
                        data-fgColor="#17a2b8"
                        data-min="0.01"
                        data-max="0.99"
                        data-step="0.01"
                        value="0.1"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="attack">
                      <br>
                      <span class="knob-label">Attack</span>
                    </div>
                    <div class="col col-lg-2 col-md-3 col-4 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="82%"
                        data-height="82%"
                        data-fgColor="#17a2b8"
                        data-min="0.01"
                        data-max="0.99"
                        data-step="0.01"
                        value="0.1"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="decay">
                      <br>
                      <span class="knob-label">Decay</span>
                    </div>
                    <div class="col col-lg-2 col-md-3 col-4 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="82%"
                        data-height="82%"
                        data-fgColor="#17a2b8"
                        data-min="0.01"
                        data-max="0.99"
                        data-step="0.01"
                        value="0.1"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="sustain">
                      <br>
                      <span class="knob-label">Sustain</span>
                    </div>
                    <div class="col col-lg-2 col-md-3 col-4 text-center">
                      <input
                        type="text"
                        class="dial"
                        data-width="82%"
                        data-height="82%"
                        data-fgColor="#17a2b8"
                        data-min="0.01"
                        data-max="0.99"
                        data-step="0.01"
                        value="0.1"
                        data-angleOffset="-125"
                        data-angleArc="250"
                        :data-track="index"
                        data-thickness=".2"
                        data-attr="release">
                      <br>
                      <span class="knob-label">Release</span>
                    </div>
                  </div>
                </div>
                <div class="col col-12">
                  <hr>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <form class="form-inline" @submit.prevent>
            <div class="form-group">
              <label for="donation">CryptoTracks Donation</label>
              <input class ="form-control ml-2" type="number" name="donation" id="donation" v-model="donation" min="0" step="0.001"/>
            </div>
            <button class="btn btn-outline-primary ml-2" @click="publish()" :disabled="publishing">Publish <font-awesome-icon :icon="faHelper.spinner()" v-if="publishing" :spin="true"></font-awesome-icon></button>
            <button class="btn btn-outline-warning ml-2" @click="preview()">Preview</button>
            <span class="text-danger" v-if="error">{{ error }}</span>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import * as Tone from 'tone'
import TuneHelpers from '@/helpers/TuneHelpers'
import $ from 'jquery'
import FaHelper from '@/helpers/FaHelper'
import MetaMask from '@/components/MetaMask'
import EventBus from '@/helpers/EventBus'

export default {
  components: { MetaMask },
  name: 'Tune',
  data () {
    return {
      tracks: TuneHelpers.blankTune(),
      currentBar: null,
      selectedBar: null,
      notes: TuneHelpers.notes,
      durations: TuneHelpers.durations,
      loop: null,
      playing: false,
      synths: [],
      error: null,
      donation: 0.01,
      publishing: false
    }
  },
  computed: {
    faHelper () {
      return FaHelper
    },
    encoder () {
      return TuneHelpers.encoder(this.tracks)
    },
    account () {
      return this.$parent.account
    }
  },
  watch: {
    account: () => {
      EventBus.$emit('account-changed')
    }
  },
  mounted () {
    EventBus.$on('account-changed', () => {
      this.$nextTick(() => {
        this.startTone()
      })
    })
    this.startTone()
  },
  methods: {
    initSynths () {
      const vm = this
      for (let i = 0; i < 8; i++) {
        this.synths.push(TuneHelpers.initSynth(this.tracks[i].synth))
        this.setKnobs(this.tracks[i], i)
      }
      $('.dial').knob({
        release (v) {
          const trackIndex = parseInt(this.$.attr('data-track'))
          const attr = this.$.attr('data-attr')
          const track = vm.tracks[trackIndex]
          vm.$nextTick(() => {
            track[attr] = v
            vm.setSynth(trackIndex)
          })
        }
      })
    },
    toggleBar (trackIndex, barIndex) {
      if (this.isSelected(trackIndex, barIndex)) {
        this.selectedBar = null
      } else {
        let toPlay = this.tracks[trackIndex].bars[barIndex].play
        this.tracks[trackIndex].bars[barIndex].play = !toPlay
        if (!toPlay) {
          this.selectedBar = [trackIndex, barIndex]
        } else {
          this.selectedBar = null
        }
      }
    },
    isSelected (trackIndex, barIndex) {
      return this.selectedBar && this.selectedBar[0] === trackIndex && this.selectedBar[1] === barIndex
    },
    getSynth (name) {
      return TuneHelpers.synths[name]
    },
    play () {
      if (!this.playing) {
        this.loop.start()
        this.playing = true
      }
    },
    stop () {
      if (this.playing) {
        this.loop.stop()
        this.playing = false
      }
    },
    noteClass (bar, barIndex) {
      if (!this.playing || (this.playing && this.currentBar === barIndex)) {
        return `bg-${bar.note.replace('#', 'S')}-${bar.octave} duration-${bar.duration}`
      } else {
        return 'bg-dark'
      }
    },
    rando () {
      this.tracks = TuneHelpers.randomTune()
      for (let track of this.tracks) {
        let i = this.tracks.indexOf(track)
        track.volume = parseInt((Math.random() * 30) - 15)
        if (i === 4 || i === 5) {
          track.attackNoise = parseInt(Math.random() * 10)
          track.dampening = parseInt(Math.random() * 10) * 1000
          track.resonance = Math.random().toFixed(2)
        } else {
          track.attack = Math.random().toFixed(2)
          track.decay = Math.random().toFixed(2)
          track.sustain = Math.random().toFixed(2)
          track.release = Math.random().toFixed(2)
        }
        this.setKnobs(track, i)
        this.setSynth(i)
      }
    },
    test (trackIndex, barIndex) {
      this.setSynth(trackIndex)
      let bar = this.tracks[trackIndex].bars[barIndex]
      this.synths[trackIndex].triggerAttackRelease(`${bar.note}${bar.octave}`, bar.duration)
    },
    reset () {
      this.tracks = TuneHelpers.blankTune()
      for (let i = 0; i < 8; i++) {
        this.setKnobs(this.tracks[i], i)
      }
    },
    setSynth (trackIndex) {
      let options = {
        volume: this.tracks[trackIndex].volume
      }
      if (trackIndex === 4 || trackIndex === 5) {
        options.attackNoise = this.tracks[trackIndex].attackNoise
        options.resonance = this.tracks[trackIndex].resonance
        options.dampening = this.tracks[trackIndex].dampening
      } else {
        options.envelope = {
          attack: this.tracks[trackIndex].attack,
          decay: this.tracks[trackIndex].decay,
          sustain: this.tracks[trackIndex].sustain,
          release: this.tracks[trackIndex].release
        }
      }
      this.synths.splice(trackIndex, 1, TuneHelpers.initSynth(this.tracks[trackIndex].synth, options))
    },
    setKnobs (track, trackIndex) {
      let attrs
      if (trackIndex === 4 || trackIndex === 5) {
        attrs = ['volume', 'attackNoise', 'dampening', 'resonance']
      } else {
        attrs = ['volume', 'attack', 'decay', 'release', 'sustain']
      }
      for (let attr of attrs) {
        let $knob = $(`input[data-attr="${attr}"][data-track="${trackIndex}"]`)
        $knob.val(track[attr])
        $knob.trigger('change')
      }
    },
    publish () {
      const vm = this
      vm.publishing = true;
      let tlInst
      this.$parent.ctContract.deployed()
        .then((instance) => {
          tlInst = instance
          return tlInst.publishTune(vm.encoder[0], vm.encoder[1], vm.encoder[2], vm.encoder[3],
            vm.encoder[4], vm.encoder[5], vm.encoder[6], vm.encoder[7], { from: vm.$parent.account, value: parseInt(vm.donation * 1000000000000000000) })
        })
        .then(() => {
          // console.info(res)
          vm.publishing = false;
          vm.error = null
          vm.$router.push('/library')
        })
        .catch((err) => {
          vm.publishing = false;
          console.error(err)
          // vm.error = err.toString().split('. at')[0].replace('Error: Error: ', '')
        })
    },
    preview () {
      this.stop();
      EventBus.$emit('open-preview', this.tracks);
    },
    startTone () {
      this.initSynths()
      this.loop = TuneHelpers.sequence(this)
      Tone.Transport.start('+0.5')
      Tone.Transport.bpm.value = 90
    }
  },
  destroyed () {
    Tone.Transport.stop()
  }
}
</script>
