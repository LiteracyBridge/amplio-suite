<template>
  <div
    :class="isOpen ? 'block' : 'hidden'"
    class="fixed top-0 left-0 bottom-0 right-0 bg-semi-transparent-darken z-1000"
  >
    <div tabindex="0" />

    <!-- Close modal button -->
    <div
      tabindex="0"
      class="absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
      @click="onClickCloseModal"
    >
      <font-awesome-icon icon="times" />
      <span class="text-sm">(Esc)</span>
    </div>

    <div
      class="absolute p-6 bg-white text-center shadow-modal rounded-md"
      style="top: 50vh; left: 50vw; transform: translateX(-50%) translateY(-50%); min-width: calc(640px - (1.5rem * 2));"
      role="dialog"
      aria-modal="true"
    >
      <section>
        <header v-if="title" class="my-4 pb-2 border-b-2 b-gray-600">
          <h2 class="text-2xl text-bold">{{ title }}</h2>
        </header>

        <div class="pr-6 overflow-y-auto" style="max-height: 60vh;">
          <portal-target name="modalBody" slim />
        </div>

        <portal-target name="modalFooter" slim />
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
      title: state => state.modal.title
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
