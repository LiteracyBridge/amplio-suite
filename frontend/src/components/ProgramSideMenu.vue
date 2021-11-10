<template>
  <div class="pt-2 col-span-3 md:col-span-2 border-r-2">
    <draggable
      tag="ul"
      ghost-class="moving-item"
      :animation="200"
      :value="value"
      @input="emitter"
      @start="dragging = true"
      @end="onDraggEnd"
    >
      <li
        v-for="(item, index) in value"
        :key="index"
        tabindex="0"
        class="flex justify-between mx-1 my-2 cursor-grab"
        :data-name="name"
        :data-index="index"
      >
        <font-awesome-icon icon="grip-lines" />
        <v-tooltip :text="`${item.title}`">
        <VButton class="sidebar-playlist-title"
          tag="span"
          :label="item.title"
          :active="selectedIndex === index"
          :disabled="value.length === 0"
          @click="onSelect(index)"
        />
        </v-tooltip>
        <v-tooltip
          v-if="value.length === 0"
          text="You must have at least one playlist"
          position="center"
          class="ml-2"
        >
          <font-awesome-icon
            class="text-orange-600"
            icon="exclamation-circle"
          />
        </v-tooltip>
        <v-tooltip
          v-if="titles.includes(item.title)"
          text="Duplicate playlist title"
          position="center"
          class="ml-2"
        >
          <font-awesome-icon
            class="text-orange-600"
            icon="exclamation-circle"
          />
        </v-tooltip>

        <div class="ml-2 delete-button-wrapper">
        <v-tooltip :width="125" :text="`${value.length <= 1 ? 'Can not delete the only playlist.' : 'Delete playlist.'}`">
        <VButton
          variant="warning"
          :color="`${value.length <= 1 ? 'gray':''}`"
          iconL="trash-alt"
          :disabled="value.length <= 1"
          :ariaLabel="`Delete ${name} ${item.title}`"
          @click="handleOpenModal(index)"
        />
        </v-tooltip>
        </div>
      </li>
    </draggable>

    <div class="flex justify-center mt-4 mr-4">
      <VButton
        tag="span"
        :label="`+ Add ${name}`"
        @click="onAdd"
      />
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="modal.show">
      <p>This {{ name }} will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="modal.show">
      <footer class="flex flex-row-reverse justify-between">
        <VButton
          label="Confirm"
          variant="warning"
          @click="confirmDelete"
        />
        <VButton
          label="Cancel"
          @click="handleCloseModal"
        />
      </footer>
    </portal>
  </div>
</template>

<style scoped>
/* Remove the underline from the "delete' icon */
.delete-button-wrapper div {
  border: none;
}
.sidebar-playlist-title {
  overflow: hidden;
  max-width:10em;
}
</style>

<script>
import Draggable from 'vuedraggable'
import { mapActions } from 'vuex'

import VButton from '@/components/VButton'
import VTooltip from '@/components/VTooltip'

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
    selectedIndex: {
      type: Number,
      required: true
    },
    titles: {
      type: Array,
      required: true
    }
  },
  components: {
    Draggable,
    VButton,
    VTooltip,
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
    emitter (value) {
      // Update the menu list
      this.$emit('input', value)
    },
    handleOpenModal (index) {
      this.modal.show = true
      this.modal.eleIndex = index
      this.setModal(`Delet ${name}`)
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
    onDraggEnd (event) {
      const { newIndex, oldIndex } = event

      if (newIndex === this.selectedIndex) {
        this.onSelect(oldIndex)
      } else if (oldIndex === this.selectedIndex) {
        this.onSelect(newIndex)
      }
    },
    handleKeyboard (event) {
      const { target, code } = event
      const { name } = target.dataset

      if (Object.keys(this.target).length === 0 && name !== this.name) return
      event.stopPropagation()

      if (code === 'Space') {
        this.target = target
      }
      else if (['Enter', 'Escape'].includes(code)) {
        this.target = {}
        document.querySelectorAll(`[data-name="${name}"][data-index]`)
          .forEach(ele => ele.classList.remove('focus-visible'))
      }
      else if (['ArrowUp', 'ArrowDown'].includes(code)) {
        this.move(code)
      }
    },
    move (direction) {
      const oldIndex = +this.target.dataset.index
      const newIndex = direction === 'ArrowUp' ? oldIndex - 1 : oldIndex + 1
      if (newIndex < 0 || newIndex >= this.value.length) return

      // Swap elements
      const tmp = [...this.value]
      const a = tmp[newIndex]
      tmp[newIndex] = tmp[oldIndex]
      tmp[oldIndex] = a

      this.emitter(tmp)
      this.onDraggEnd({ newIndex, oldIndex })

      // Update dashed element
      this.target = document.querySelector(`[data-name="${this.name}"][data-index="${newIndex}"]`)
      document.querySelectorAll(`[data-name="${this.name}"][data-index]`)
        .forEach(ele => ele.classList.remove('focus-visible'))
      this.target.classList.add('focus-visible')
    }
  }
}
</script>
