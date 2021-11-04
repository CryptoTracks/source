<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="preview" aria-hidden="true" id="previewModal">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Tune Preview</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <mini-tune v-if="tracks" :tracksPreview="tracks" ref="previewTune"></mini-tune>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/helpers/EventBus'
import FaHelper from '@/helpers/FaHelper'
import $ from 'jquery'
import MiniTune from './MiniTune.vue'

export default {
  name: 'PreviewModal',
  components: {
    MiniTune
  },
  data () {
    return {
      tracks: null
    }
  },
  mounted () {
    $('#previewModal').on('hidden.bs.modal', () => {
      this.$refs.previewTune.stop();
    })
    EventBus.$on('open-preview', (tracks) => {
      this.tracks = tracks
      $('#previewModal').modal('show')
    })
  },
  computed: {
    account () {
      return this.$parent.account
    },
    fa () {
      return FaHelper
    }
  }
}
</script>
