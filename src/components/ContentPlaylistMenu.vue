<template>
  <div class="ml-6 py-2 border-r-2">
    <draggable
      tag="ul"
      v-model="playlists"
      :animation="200"
      ghost-class="moving-item"
      @start="dragging = true"
      @end="onDraggEnd"
    >
      <li
        v-for="(playlist, index) in playlists"
        :key="index"
        tabindex="0"
        class="flex justify-between pl-1 mr-1 cursor-move"
        data-name="playlist"
        :data-index="index"
      >
        <span
          :class="playlist.title === selectedPlaylist.title ? 'text-blue underline font-semibold' : 'text-black'"
          class="py-2 text-left cursor-pointer hover:text-blue hover:underline hover:font-semibold"
          @click="setPlaylistIndex(index)"
        >
          {{ playlist.title }}
        </span>
        <button
          :aria-label="`Delete playlist ${playlist.title}`"
          @click="handleOpenModal(index)"
        >
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
      </li>
    </draggable>

    <span
      tabindex="0"
      @click="handleAddPlaylist"
      class="block mt-4 p-2u text-green font-bold cursor-pointer"
    >
      + Add playlist
    </span>

    <!-- For modal components -->
    <portal to="modalBody" v-if="modal.show">
      <p>This playlist will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="modal.show">
      <footer class="flex flex-row-reverse justify-between">
        <v-button
          @click="confirmDeletePlaylist"
          color="bg-red-500 border border-red-500"
          textColor="text-white"
          text="Confirm"
        />
        <v-button
          @click="handleCloseModal"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Cancel"
        />
      </footer>
    </portal>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapState, mapGetters, mapActions } from 'vuex'

import VButton from '@/components/Button'

export default {
  computed: {
    ...mapState('uiSettings', {
      selectedPlaylistIndex: state => state.content.selectedPlaylistIndex
    }),
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
    }
  },
  components: {
    Draggable,
    VButton,
  },
  data: () => ({
    target: {},

    modal: {
      show: false,
      eleIndex: -1
    }
  }),
  mounted () {
    window.addEventListener('keydown', this.handleKeyboard)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyboard)
  },
  methods: {
    ...mapActions('uiSettings', [
      'setPlaylistIndex'
    ]),
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('content', [
      'setPlaylist',
      'addPlaylist',
      'removePlaylist'
    ]),
    handleOpenModal (index) {
      this.modal.show = true
      this.modal.eleIndex = index
      this.setModal('Delet Playlist')
    },
    handleCloseModal () {
      this.modal.show = false
      this.modal.eleIndex = -1
      this.closeModal()
    },
    confirmDeletePlaylist() {
      this.removePlaylist(this.modal.eleIndex)
      this.handleCloseModal()
    },
    async handleAddPlaylist () {
      await this.addPlaylist(this.selectedDeployment.deploymentname)
      this.setPlaylistIndex(this.selectedPlaylistIndex + 1)
    },
    onDraggEnd(event) {
      const { newIndex, oldIndex } = event

      if (newIndex === this.selectedPlaylistIndex) {
        this.setPlaylistIndex(oldIndex)
      } else if (oldIndex === this.selectedPlaylistIndex) {
        this.setPlaylistIndex(newIndex)
      }
    },
    handleKeyboard (event) {
      const { target, code } = event
      const { name } = target.dataset

      if (Object.keys(this.target).length === 0 && name !== 'playlist') return
      event.stopPropagation()

      if (code === 'Space') {
        this.target = target
      }
      else if (['Enter', 'Escape'].includes(code)) {
        this.target = {}
        document.querySelectorAll(`[data-name="playlist"][data-index]`)
          .forEach(ele => ele.classList.remove('focus-visible'))
      }
      else if (['ArrowUp', 'ArrowDown'].includes(code)) {
        this.move(code)
      }
    },
    move (direction) {
      const oldIndex = +this.target.dataset.index
      const newIndex = direction === 'ArrowUp' ? oldIndex - 1 : oldIndex + 1
      if (newIndex < 0 || newIndex >= this.playlists.length) return

      // Swap elements
      const tmp = [...this.playlists]
      const a = tmp[newIndex]
      tmp[newIndex] = tmp[oldIndex]
      tmp[oldIndex] = a

      this.setPlaylist(tmp)

      if (newIndex === this.selectedPlaylistIndex) {
        this.setPlaylistIndex(oldIndex)
      } else if (oldIndex === this.selectedPlaylistIndex) {
        this.setPlaylistIndex(newIndex)
      }

      // Update dashed element
      this.target = document.querySelector(`[data-name="playlist"][data-index="${newIndex}"]`)
      document.querySelectorAll(`[data-name="playlist"][data-index]`)
        .forEach(ele => ele.classList.remove('focus-visible'))
      this.target.classList.add('focus-visible')
    }
  }
}
</script>
