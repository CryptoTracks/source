<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="favorite" aria-hidden="true" id="favoriteModal">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Save Tune #{{ tuneId }} to Favorites</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="favorite()">
            <div class="form-group">
              <label for="artistFee">
                Artist Fee (min 0.001)
              </label>
              <input class="form-control" type="number" name="artistFee" id="artistFee" min="0.001" step="0.001" v-model="favoriteFee">
              <small class="text-primary">Fee will be directly transfered to the artist's address - {{ artist }}</small>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-outline-primary" @click.prevent="favorite()" :disabled="favoriting">Save <font-awesome-icon :icon="fa.spinner()" :spin="true" v-show="favoriting"></font-awesome-icon></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/helpers/EventBus'
import FaHelper from '@/helpers/FaHelper'
import $ from 'jquery'

export default {
  name: 'FavoriteModal',
  data () {
    return {
      favoriteFee: 0.01,
      tuneId: null,
      artist: null,
      favoriting: false
    }
  },
  mounted () {
    EventBus.$on('open-favorite', (tuneId, artist) => {
      this.tuneId = tuneId
      this.artist = artist
      $('#favoriteModal').modal('show')
    })
  },
  computed: {
    account () {
      return this.$parent.account
    },
    fa () {
      return FaHelper
    }
  },
  methods: {
    favorite () {
      const vm = this
      vm.favoriting = true
      this.$parent.ctContract.deployed()
        .then(instance => {
          return instance.favorite(vm.tuneId, {from: vm.account, value: parseInt(vm.favoriteFee * 1000000000000000000)})
        })
        .then(() => {
          vm.favoriting = false
          $('#favoriteModal').modal('hide')
          EventBus.$emit('favorite', vm.tuneId)
        })
        .catch(err => {
          vm.favoriting = false
          console.error(err)
        })
    }
  }
}
</script>
