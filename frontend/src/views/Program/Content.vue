<template>
  <section class="relative p-6 pt-0">
    <loading v-if="status !== 'success'" class="-ml-6 rounded-b-lg" />

    <program-header
      class="mb-2"
      title="Content"
      :dirty="dirty"
      :canSave="canSave"
      :description="description"
      :onSaveChanges="onSaveChanges"
      :onDiscardChanges="onDiscardChanges"
    />

    <program-select-deploymet
      :programId="programId"
      :dirty="dirty"
      v-model="deployment"
    />

    <div class="grid grid-cols-10">
      <program-side-menu
        v-if="playlists"
        name="playlist"
        v-model="playlists"
        :on-select="(index) => { this.playlistIndex = index }"
        :on-add="onAddPlaylist"
        :on-remove="onClickRemovePlaylist"
        :selected-index="playlistIndex"
        :titles="duplicatePlaylists"
      />

      <div class="text-left col-span-7 md:col-span-8">
        <content-playlist-header
          v-if="playlist"
          :playlist="playlist"
          :playlistIndex="playlistIndex"
        />

        <p class="p-4 text-xl bg-gray-400">Messages</p>

        <content-playlist-messages
          v-if="playlist"
          :deployment="deployment"
          :playlist="playlist"
          :playlistIndex="playlistIndex"
          :dirty="dirty"
         />

        <div class="mt-4 ml-4">
          <VButton
            tag="span"
            label="+ Add Message"
            @click="addMessage(playlist.id)"
          />
        </div>
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="showModal">
      <p class="text-xl">{{ modalBody }}</p>
    </portal>

    <portal to="modalFooter" v-if="showModal">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton
          label="Close"
          @click="onCloseModal"
        />
      </footer>
    </portal>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/VButton'
import Loading from '@/components/Loading'
import ProgramHeader from '@/components/ProgramHeader'
import ProgramSideMenu from '@/components/ProgramSideMenu'
import ProgramSelectDeploymet from '@/components/ProgramSelectDeploymet'
import ContentPlaylistHeader from '@/components/ContentPlaylistHeader'
import ContentPlaylistMessages from '@/components/ContentPlaylistMessages'

export default {
  props: ['programId'],
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
        this.setPlaylists(value)
      }
    },
    playlist () {
      if (!this.playlists) return null
      else return this.playlists[this.playlistIndex]
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
      if (Object.keys(this.deployment).length > 0) {
        this.fetchContent({
          programId: this.programId,
          deploymentId: this.deployment.id
        })
      }
    }
  },
  created () {
    this.fetchProgram(this.programId)
  },
  components: {
    VButton,
    Loading,
    ProgramHeader,
    ProgramSideMenu,
    ProgramSelectDeploymet,
    ContentPlaylistHeader,
    ContentPlaylistMessages,
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
      'setPlaylists',
      'addPlaylist',
      'removePlaylist',
      'addMessage',
      'removeMessage',
    ]),
    onSaveChanges () {
      if (this.duplicatePlaylists.length !== 0) {
        this.modalBody = 'Please rename the duplicate playlist title for can save.'
        this.onOpenModal('Duplicated Playlist Title')
      } else if (this.duplicateMessage.length !== 0) {
        this.modalBody = 'Please rename the duplicate message title for can save.'
        this.onOpenModal('Duplicated Message Title')
      } else if (this.isFormFill) {
        this.updateContent(this.deployment.id)
      } else {
        this.modalBody = 'Please complete all of the mandatory fields.'
        this.onOpenModal('Required Fields')
      }
    },
    onDiscardChanges () {
      this.fetchContent({ programId: this.programId, deploymentId: this.deployment.id})
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
      await this.addPlaylist(this.deployment.id)
      this.playlistIndex = this.playlists.length - 1
    },
    async onClickRemovePlaylist (index) {
      const playlistId = this.playlists[index].id
      await this.removePlaylist(playlistId)
      this.playlistIndex = 0
    },
  }
}
</script>
