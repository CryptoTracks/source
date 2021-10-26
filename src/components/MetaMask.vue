<template>
  <div class="row">
    <div class="col col-12 text-center">
      <h1>Install MetaMask</h1>
      <div class="row">
        <div class="col col-12" id="viewer"></div>
      </div>
      <p>MetaMask may be locked, unsupported, or not installed - <a href="https://metamask.io" target="_blank">MetaMask</a></p>
    </div>
  </div>
</template>

<script>
import ModelViewer from 'metamask-logo'
export default {
  name: 'MetaMask',
  data () {
    return {
      viewer: null
    }
  },
  mounted () {
    this.viewer = ModelViewer({
      pxNotRatio: true,
      width: 300,
      height: 250,
      followMouse: true,
      slowDrift: false
    })
    const container = document.getElementById('viewer')
    container.appendChild(this.viewer.container)
  },
  destroyed () {
    this.viewer.stopAnimation()
  }
}
</script>
