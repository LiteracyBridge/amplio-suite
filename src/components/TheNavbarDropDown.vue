<template>
  <div class="relative">
    <button @click="isOpen = !isOpen">
      <slot />
    </button>

    <!-- Overlay the screen -->
    <button
      v-if="isOpen"
      tabindex="-1"
      class="fixed inset-0 h-full w-full z-10 bg-black opacity-50 cursor-default"
      @click="isOpen = false"
    />

    <!-- Options -->
    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 z-20 bg-white rounded-lg shadow-xl">
      <a
        v-for="(opt, index) in options"
        :key="index"
        :href="opt.link"
        :target="opt.target ? opt.target : '_self'"
        class="block px-4 py-2 text-gray-800 hover:bg-blue hover:text-white"
        @click="isOpen = false"
      >
        {{ opt.name }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  created () {
    const handleEscape = (e) => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.isOpen = false
      }
    }
    document.addEventListener('keydown', handleEscape)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('keydown', handleEscape)
    })
  }
}
</script>
