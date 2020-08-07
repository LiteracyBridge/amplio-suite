<template>
  <box
    :httpStatus="status"
    :isDirty="dirty"
    title="content"
    help="You can modify your content details on this page. All fields with an asterisk are required. The optional fields are recommended for reporting."
  >
    <select-deploymet :dirty="dirty" :on-change="(deployment) => fetchContent(deployment)" />

    <div class="grid" style="grid-template-columns: 1.3fr 5fr;">
      <playlist-menu />

      <div class="text-left">
        <playlist-header />

        <div class="p-4 text-xl bg-gray-400">
          <p>Messages</p>
        </div>

        <playlist-messages />
      </div>
    </div>
  </box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

import Box from '@/components/ProgramBox'
import SelectDeploymet from '@/components/ProgramSelectDeploymet'
import PlaylistMenu from '@/components/ContentPlaylistMenu'
import PlaylistHeader from '@/components/ContentPlaylistHeader'
import PlaylistMessages from '@/components/ContentPlaylistMessages'

export default {
  computed: {
    ...mapState('content', [
      'status',
      'dirty',
    ]),
  },
  components: {
    Box,
    SelectDeploymet,
    PlaylistMenu,
    PlaylistHeader,
    PlaylistMessages,
  },
  mounted (){
    this.fetchCategories()

    eventBus.$on('save-crud-data', () => {
      this.updateContent()
    }),
    eventBus.$on('discard-crud-data', () => {
      this.fetchContent()
    })
  },
  beforeDestroy () {
    eventBus.$off('save-crud-data')
    eventBus.$off('discard-crud-data')
  },
  methods: {
    ...mapActions('content', [
      'fetchContent',
      'updateContent',
    ]),
    ...mapActions('categories', [
      'fetchCategories'
    ]),
  }
}
</script>
