<template>
  <div
    :class="value ? 'block' : 'hidden'"
    class="w-full h-full top-0 left-0 fixed flex items-center justify-center z-1000"
  >
    <!-- Background -->
    <div
      class="absolute w-full h-full bg-black opacity-75"
      @click="closeModal"
    />

    <div class="z-50 overflow-y-auto">
      <!-- Close modal button -->
      <div
        tabindex="0"
        class="absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
        @click="closeModal"
      >
        <font-awesome-icon icon="times" />
        <span class="text-sm">(Esc)</span>
      </div>

      <div class="p-6 bg-white shadow-modal rounded-md" style="min-width: 50vh;">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  mounted () {
    document.addEventListener('keydown', this.handlerKeyDown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handlerKeyDown)
  },
  methods: {
    closeModal () {
      this.$emit('input', false)
    },
    handlerKeyDown (e) {
      if (e.key === 'Escape' && this.value) {
        this.closeModal()
      }
    }
  }
}
</script>
