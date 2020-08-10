<template>
  <div class="pt-2 border-r-2">
    <draggable
      tag="ul"
      v-model="value"
      :animation="200"
      ghost-class="moving-item"
      @start="dragging = true"
      @end="onDraggEnd"
    >
      <li
        v-for="(item, index) in value"
        :key="index"
        tabindex="0"
        class="flex justify-between items-center mx-1 px-1 cursor-move"
        :data-name="name"
        :data-index="index"
      >
        <font-awesome-icon icon="sort" class="text-black" />
        <span
          class="py-2 cursor-pointer hover:text-blue hover:underline hover:font-semibold"
          @click="onSelect(index)"
        >
          {{ item.title }}
        </span>

        <button
          :aria-label="`Delete ${name} ${item.title}`"
          class="w-6 h-6 mx-4 text-red-500 icon-zoom"
          @click="handleOpenModal(index)"
        >
          <font-awesome-icon icon="trash-alt" />
        </button>
      </li>
    </draggable>

    <span
      tabindex="0"
      class="block mt-4 pr-4 text-green font-bold cursor-pointer hover:underline hover:text-lg"
      @click="onAdd"
    >
      + Add {{ name }}
    </span>

    <!-- For modal components -->
    <portal to="modalBody" v-if="modal.show">
      <p>This {{ name }} will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="modal.show">
      <footer class="flex flex-row-reverse justify-between">
        <v-button
          @click="confirmDelete"
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
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/Button'
// import VTooltip from '@/components/VTooltip'

export default {
  props: {
    value: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    onSelect: {
      type: Function,
      required: true
    },
    onRemove: {
      type: Function,
      required: true
    },
    onAdd: {
      type: Function,
      required: true
    },
  },
  computed: {
    ...mapState('uiSettings', {
      selectedPlaylistIndex: state => state.content.selectedPlaylistIndex
    }),
  },
  components: {
    Draggable,
    VButton,
    // VTooltip,
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
    ...mapActions('ui', [
      'setModal',
      'closeModal'
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
    confirmDelete() {
      this.onRemove(this.modal.eleIndex)
      this.handleCloseModal()
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

<style scoped>
.icon-zoom:hover svg {
  @apply text-xl;
}
</style>
