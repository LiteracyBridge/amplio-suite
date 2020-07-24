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
          @click="removePlaylist(index)"
        >
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
      </li>
    </draggable>

    <span
      tabindex="0"
      @click="() => addPlaylist(selectedDeployment.deploymentname)"
      class="block mt-4 p-2u text-green font-bold cursor-pointer"
    >
      + Add playlist
    </span>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapState, mapGetters, mapActions } from 'vuex'

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
    Draggable
  },
  data () {
    return {
      target: {}
    }
  },
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
    ...mapActions('content', [
      'setPlaylist',
      'addPlaylist',
      'removePlaylist'
    ]),
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
