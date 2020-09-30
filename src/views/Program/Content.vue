<template>
  <section class="relative p-6 pt-0">
    <loading v-if="status === 'loading'" class="-ml-6 rounded-b-lg" />

    <program-header
      class="mb-2"
      title="Content"
      :canSave="canSave"
      :description="description"
      :onSaveChanges="onSaveChanges"
      :onDiscardChanges="onDiscardChanges"
    />

    <program-select-deploymet
      :programCode="programCode"
      :dirty="dirty"
      v-model="deployment"
    />

    <div class="grid" style="grid-template-columns: 1fr 4fr;">
      <program-side-menu
        name="playlist"
        v-model="playlists"
        :on-select="(index) => { this.playlistIndex = index }"
        :on-add="onAddPlaylist"
        :on-remove="removePlaylist"
        :selected-index="playlistIndex"
        :titles="duplicatePlaylists"
      />

      <div class="text-left">
        <playlist-header
          v-if="playlist"
          :playlist="playlist"
          :playlistIndex="playlistIndex"
        />

        <p class="p-4 text-xl bg-gray-400">Messages</p>

        <playlist-messages
          v-if="playlist"
          :deployment="deployment"
          :playlist="playlist"
          :playlistIndex="playlistIndex"
         />

         <span
          tabindex="0"
          @click="() => addNewMessage(playlistIndex)"
          class="block mt-4 p-2 text-blue-hover-hunder"
        >
          + Add Message
        </span>
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="showModal">
      <p class="text-xl">{{ modalBody }}</p>
    </portal>

    <portal to="modalFooter" v-if="showModal">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <v-button
          @click="onCloseModal"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Close"
        />
      </footer>
    </portal>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/Button'
import Loading from '@/components/Loading'
import ProgramHeader from '@/components/ProgramHeader'
import ProgramSideMenu from '@/components/ProgramSideMenu'
import ProgramSelectDeploymet from '@/components/ProgramSelectDeploymet'
import PlaylistHeader from '@/components/ContentPlaylistHeader'
import PlaylistMessages from '@/components/ContentPlaylistMessages'

export default {
  props: ['programCode'],
  computed: {
    ...mapState('content', [
      'status',
      'dirty',
      'duplicatePlaylists',
      'duplicateMessage'
    ]),
    playlists: {
      get () {
        return this.$store.state.content.playlists
      },
      set (value) {
        this.setPlaylist(value)
      }
    },
    playlist () {
      return this.playlists[this.playlistIndex]
    },
    canSave () {
      return this.dirty && this.duplicatePlaylists.length === 0 && this.duplicateMessage.length === 0
    },
    isFormFill () {
      const requiredFields = [
        'title'
      ]

      const partial = this.playlist.messages.map(message => {
        return requiredFields.map(key => {
          const value = message[key]
          if (typeof value === 'string' || value instanceof String) return value !== ''
          else if (Array.isArray(value)) return value.length > 0
        })
      })

      partial.push(this.playlist.title !== '')

      return partial.flat().every(Boolean)
    },
  },
  watch: {
    deployment () {
      this.fetchContent({
        programCode: this.programCode,
        deployment: this.deployment.deploymentname
      })
    }
  },
  created () {
    this.fetchProgram(this.programCode)
    this.fetchContent({ programCode: this.programCode })
  },
  components: {
    VButton,
    Loading,
    ProgramHeader,
    ProgramSideMenu,
    ProgramSelectDeploymet,
    PlaylistHeader,
    PlaylistMessages,
  },
  data () {
    return {
      description: "You can modify your content details on this page. All fields with an asterisk are required. The optional fields are recommended for reporting.",
      deployment: {},
      playlistIndex: 0,

      showModal: false,
      modalBody: '',
    }
  },
  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('program', [
      'fetchProgram',
    ]),
    ...mapActions('content', [
      'fetchContent',
      'updateContent',
      'setPlaylist',
      'addPlaylist',
      'removePlaylist',
      'addNewMessage',
    ]),
    onSaveChanges () {
      if (this.duplicatePlaylists.length !== 0) {
        this.modalBody = 'Please rename the duplicate playlist title for can save.'
        this.onOpenModal('Duplicated Playlist Title')
      } else if (this.duplicateMessage.length !== 0) {
        this.modalBody = 'Please rename the duplicate message title for can save.'
        this.onOpenModal('Duplicated Message Title')
      } else if (this.isFormFill) {
        this.updateContent(this.deployment.deployment)
      } else {
        this.modalBody = 'Please complete all of the mandatory fields.'
        this.onOpenModal('Required Fields')
      }
    },
    onDiscardChanges () {
      this.fetchContent({ programCode: this.programCode, deployment: this.deployment.deployment})
    },
    onOpenModal (title) {
      this.showModal = true
      this.setModal(title)
    },
    onCloseModal () {
      this.showModal = false
      this.closeModal()
    },
    async onAddPlaylist () {
      await this.addPlaylist(this.deployment.deploymentname)
      this.playlistIndex = this.playlists.length - 1
    },
  }
}
</script>
