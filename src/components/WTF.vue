<template>
  <div id="wtf" class="container">
    <div class="row">
      <div class="col col-12">
        <h1>WTF?</h1>
        <hr class="bg-light">
        <h3>WTF is CryptoTunes?</h3>
        <hr class="bg-light">
        <p>CryptoTunes is a concept inspired by <a href="https://cryptokitties.co" target="_blank">CryptoKitties</a> and applied to
          digital music.  One difference is that tunes are created where artists specify the beats, whereas CryptoKitties are bread and determined
          by a genetic algorithm.  This means that an artist could potentially publish the same tune twice.</p>
        <h3>WTF is a Blockchain?</h3>
        <hr class="bg-light">
        <p>A catchy term that boosts a company's stock when they put it in their name.</p>
        <h3>WTF is Ethereum?</h3>
        <hr class="bg-light">
        <p>Ethereum is a Blockchain platform that allows developers to create applications that run code or "Smart Contracts"
        on the platform - <a href="https://ethereum.org" target="_blank">ethereum.org</a></p>
        <h3>WTF is MetaMask?</h3>
        <hr class="bg-light">
        <p>MetMask is chrome extension required by CryptoTunes in order to interact with the Ethereum Blockchain.  It allows
        artists and music enthusiasts to purchase Ether and use it to perform actions that require Ether - <a href="https://metamask.io" target="_blank">MetaMask</a></p>
        <h3>WTF other tech is behind CryptoTunes?</h3>
        <hr class="bg-light">
        <p><a href="http://truffleframework.com/" target="_blank">Truffle</a> - <a href="https://vuejs.org" target="_blank">Vue.js</a> - <a href="https://tonejs.github.io" target="_blank">Tone.js</a> - <a href="https://getbootstrap" target="_blank">Bootstrap</a></p>
        <h3>WTF, CryptoTunes doesn't work in my browser?</h3>
        <hr class="bg-light">
        <p>Support is limited to Chrome at the moment, Tone.js doesn't seem to support FireFox which is the only other browser supported by MetaMask.</p>
        <h3>WTF, no cookies?</h3>
        <hr class="bg-light">
        <p>That's right, CryptoTunes does not store cookies, collect email addresses or any other personally identifiable
        information.  CryptoTunes uses your Ethereum account provided by MetaMask to act as a "Sign In" so you can interact with
        the Ethereum Blockchain.  However, CryptoTunes has no control over privacy and security of MetaMask.</p>
        <h3>WTF about terms?</h3>
        <hr class="bg-light">
        <p>CryptoTunes is intended to demonstrate possibilities of building applications on the Ethereum Blockchain
        and profit is not its main intention.  Artists are encouraged to donate Ether to the project when publishing a new tune
        but are not mandatory.  A minimum favorite fee is transferred to the owner of a tune when an enthusiast stores a
        tune in their favorites.  CryptoTunes is not affiliated with Ethereum, MetaMask, or any other open source software used.
        Use these tools at your own risk and be sure to manage your Ethereum accounts wisely.
        <br><br>The proof is in the pudding - here is the CryptoTunes smart contract:</p>
        <pre class="text-light"><code>{{ source }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import CTJSON from '../../build/contracts/CryptoTunes.json'
export default {
  name: 'WTF',
  data () {
    return {
      source: CTJSON.source
    }
  }
}
</script>
