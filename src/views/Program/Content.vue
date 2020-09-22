<template>
  <section class="relative p-6 pt-0">
    <loading v-if="status === 'loading'" class="-ml-6 rounded-b-lg" />

    <program-header
      class="mb-2"
      title="Content"
      :isDirty="dirty"
      :description="description"
      :onSaveChanges="onSaveChanges"
      :onDiscardChanges="onDiscardChanges"
    />

    <program-select-deploymet
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
      />

      <div class="text-left">
        <playlist-header
          v-if="playlist"
          :playlist="playlist"
          :playlistIndex="playlistIndex"
        />

        <div class="p-4 text-xl bg-gray-400">
          <p>Messages</p>
        </div>

        <playlist-messages
          v-if="playlist"
          :deployment="deployment"
          :playlist="playlist"
          :playlistIndex="playlistIndex"
         />
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
  computed: {
    ...mapState('content', [
      'status',
      'dirty',
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
      this.fetchContent(this.deployment.deploymentname)
    }
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

      showModal: false
    }
  },
  mounted (){
    this.fetchCategories()
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
    onSaveChanges () {
      if (this.isFormFill) this.updateContent()
      else this.onOpenModal()
    },
    onDiscardChanges () {
      this.fetchContent()
    },
    onOpenModal () {
      this.showModal = true
      this.setModal('Required Fields')
    },
    onCloseModal () {
      this.showModal = false
      this.closeModal()
    },
    async onAddPlaylist () {
      await this.addPlaylist(this.deployment.deploymentname)
      this.playlistIndex ++
    },
  }
}
</script>
