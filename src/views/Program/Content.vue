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
        :selected-index="selectedPlaylistIndex"
      />

      <div class="text-left">
        <playlist-header />

        <div class="p-4 text-xl bg-gray-400">
          <p>Messages</p>
        </div>

        <playlist-messages />
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="showModal">
      <p>Please complete all of the mandatory fields.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal">
      <footer class="flex flex-row-reverse justify-between">
        <v-button
          @click="onCloseModal"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Close"
        />
      </footer>
    </portal>
  </box>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

import VButton from '@/components/Button'
import Box from '@/components/ProgramBox'
import ProgramSideMenu from '@/components/ProgramSideMenu'
import ProgramSelectDeploymet from '@/components/ProgramSelectDeploymet'
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
    ...mapState('uiSettings', {
      selectedPlaylistIndex: state => state.content.selectedPlaylistIndex
    }),
    playlists: {
      get () {
        return this.$store.state.content.playlists
      },
      set (value) {
        this.setPlaylist(value)
      }
    },
    isFormFill () {
      const requiredFields = [
        'title'
      ]

      const partial = this.selectedPlaylist.messages.map(message => {
        return requiredFields.map(key => {
          const value = message[key]
          if (typeof value === 'string' || value instanceof String) return value !== ''
          else if (Array.isArray(value)) return value.length > 0
        })
      })

      partial.push(this.selectedPlaylist.title !== '')

      return partial.flat().every(Boolean)
    },
  },
  components: {
    VButton,
    Box,
    ProgramSideMenu,
    ProgramSelectDeploymet,
    PlaylistHeader,
    PlaylistMessages,
  },
  data () {
    return {
      showModal: false
    }
  },
  mounted (){
    this.fetchCategories()

    eventBus.$on('save-crud-data', () => {
      if (this.isFormFill) this.updateContent()
      else this.onOpenModal()
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
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
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
    onOpenModal () {
      this.showModal = true
      this.setModal('Required Fields')
    },
    onCloseModal () {
      this.showModal = false
      this.closeModal()
    },
    async onAddPlaylist () {
      await this.addPlaylist(this.selectedDeployment.deploymentname)
      this.setPlaylistIndex(this.selectedPlaylistIndex + 1)
    },
  }
}
</script>
