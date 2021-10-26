<template>
  <div class="container">
    <h1 class="display-2">Music on the Blockchain</h1>
    <p class="lead">CryptoTunes allows artists and music enthusiasts to unleash and discover creativity on the Ethereum Blockchain.</p>
    <hr>
    <div class="row">
      <div class="col col-md-6 col-12">
        <router-link class="btn btn-outline-primary mt-3 float-right" to="/tunes/new">Start Creating</router-link>
        <router-link class="btn btn-outline-primary mt-3 mr-3 float-right" to="tunes">Latest Tunes</router-link>
      </div>
      <div class="col col-md-6 col-12">
        <mini-tune :tuneId="0"></mini-tune>
      </div>
    </div>
  </div>
</template>

<script>
import * as Tone from 'tone'
import MiniTune from '@/components/MiniTune'

export default {
  name: 'Tunes',
  mounted () {
    Tone.Transport.start('+0.1')
    Tone.Transport.bpm.value = 90
  },
  destroyed () {
    Tone.Transport.stop()
  },
  components: { MiniTune }
}
</script>
