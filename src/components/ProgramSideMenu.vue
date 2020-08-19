<template>
  <div class="pt-2 border-r-2">
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
        class="flex justify-between items-center mx-1 px-1 cursor-move"
        :data-name="name"
        :data-index="index"
      >
        <font-awesome-icon icon="sort" class="text-black" />
        <span
          :class="selectedIndex === index ? 'font-semibold text-blue underline' : ''"
          class="py-2 cursor-pointer hover:text-blue hover:font-semibold hover:underline"
          @click="onSelect(index)"
        >
          {{ item.title }}
        </span>

        <button
          :aria-label="`Delete ${name} ${item.title}`"
          class="w-6 h-6 mx-4 text-red-500 icon-zoom-xl"
          @click="handleOpenModal(index)"
        >
          <font-awesome-icon icon="trash-alt" />
        </button>
      </li>
    </draggable>

    <span
      tabindex="0"
      class="block mt-4 pr-4 font-semibold text-green cursor-pointer hover:underline"
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
import { mapActions } from 'vuex'

import VButton from '@/components/Button'

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
