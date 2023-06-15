<template>
  <div
    :class="isOpen ? 'block' : 'hidden'"
    class="fixed top-0 left-0 bottom-0 right-0 bg-semi-transparent-darken z-1000"
  >
    <div tabindex="0" />


    <div
      class="absolute p-6 bg-white shadow-modal rounded-md"
      :style="style"
      role="dialog"
      aria-modal="true"
    >

      <!-- Close modal button -->
      <div
          v-if="closeButton" tabindex="0"
        class="absolute bg-red top-0 right-0 cursor-pointer flex flex-col items-center text-black text-sm z-50" @click="onClickCloseModal">
        <font-awesome-icon icon="times" />
        <span class="text-sm">(Esc)</span>
      </div>

      <section>
        <header v-if="title" class="text-center mb-4 pb-2 border-b-2 b-gray-600">
          <h2 class="text-2xl text-bold">{{ title }}</h2>
        </header>

        <div class="overflow-y-auto" style="max-height: 70vh;">
          <portal-target name="modalBody" slim />
        </div>

        <portal-target class="border-t-2 b-gray-600 pt-4" name="modalFooter" slim />
      </section>
    </div>
    <div tabindex="0" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { EventBus } from '@/event-bus'

export default {
  computed: {
    ...mapState('ui', {
      isOpen: state => state.modal.isOpen,
      title: state => state.modal.title || 'closed',
        style: state => {
          let width = state.modal.width || 640
          return `top: 50vh; left: 50vw; transform: translateX(-50%) translateY(-50%); min-width: calc(${width}px - (1.5rem * 2));`;
      },
        closeButton: state => state.modal.closeButton===undefined ? true : state.modal.closeButton
    })
  },
  mounted () {
    document.addEventListener('keydown', this.handlerKeyDown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handlerKeyDown)
  },
  watch: {
    isOpen() {
      if (this.isOpen) document.body.classList.add('has-dialog')
      else document.body.classList.remove('has-dialog')
    }
  },
  methods: {
    ...mapActions('ui', [
      'closeModal'
    ]),
    handlerKeyDown (e) {
      if (e.key === 'Escape' && this.isOpen) {
        EventBus.$emit('handleEscape')
        this.closeModal()
      }
    },
    onClickCloseModal () {
      EventBus.$emit('handleEscape')
      this.closeModal()
    }
  }
}
</script>
