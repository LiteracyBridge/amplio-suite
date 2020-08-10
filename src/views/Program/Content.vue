<template>
  <box
    :httpStatus="status"
    :isDirty="dirty"
    title="content"
    help="You can modify your content details on this page. All fields with an asterisk are required. The optional fields are recommended for reporting."
  >
    <program-select-deploymet :dirty="dirty" :on-change="(deployment) => fetchContent(deployment)" />

    <div class="grid" style="grid-template-columns: 1fr 4fr;">
      <program-side-menu
        name="playlist"
        v-model="playlists"
        :on-select="setPlaylistIndex"
        :on-add="onAddPlaylist"
        :on-remove="removePlaylist"
      />

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
import { mapState, mapGetters, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

import Box from '@/components/ProgramBox'
import ProgramSideMenu from '@/components/ProgramSideMenu'
import ProgramSelectDeploymet from '@/components/ProgramSelectDeploymet'
// import PlaylistMenu from '@/components/ContentPlaylistMenu'
import PlaylistHeader from '@/components/ContentPlaylistHeader'
import PlaylistMessages from '@/components/ContentPlaylistMessages'

export default {
  computed: {
    ...mapState('content', [
      'status',
      'dirty',
    ]),
    ...mapGetters('uiSettings', [
      'selectedDeployment',
      'selectedPlaylist'
    ]),
    playlists: {
      get () {
        return this.$store.state.content.playlists
      },
      set (value) {
        this.setPlaylist(value)
      }
    },
  },
  components: {
    Box,
    ProgramSideMenu,
    ProgramSelectDeploymet,
    // PlaylistMenu,
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
      'setPlaylist',
      'addPlaylist',
      'removePlaylist',
    ]),
    ...mapActions('categories', [
      'fetchCategories'
    ]),
    ...mapActions('uiSettings', [
      'setPlaylistIndex'
    ]),
    async onAddPlaylist () {
      await this.addPlaylist(this.selectedDeployment.deploymentname)
      this.setPlaylistIndex(this.selectedPlaylistIndex + 1)
    },
  }
}
</script>
