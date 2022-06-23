<template>
  <div class="relative text-white">
    <button
      @mouseover="isOpen = !isOpen"
      @keyup.enter="isOpen = !isOpen"
    >
      <slot />
    </button>

    <!-- Overlay the screen -->
    <button
      v-if="isOpen"
      tabindex="-1"
      class="fixed inset-0 h-full w-full z-10 cursor-default"
      @click="isOpen = false"
    />

    <!-- Options -->
    <div v-if="isOpen" class="absolute left-0 ml-2 mt-1 w-64 z-20 bg-white rounded-lg shadow-xl">
      <component
        v-for="(opt, index) in options"
        :key="index"
        :is="opt.tag === 'router-link' ? 'router-link' : 'a'"
        :to="opt.tag === 'router-link' ? opt.link : false"
        :href="opt.tag === 'router-link' ? false : opt.link"
        :target="opt.target ? opt.target : false"
        class="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-blue hover:text-white"
        @click.native="isOpen = false"
        @keyup.enter="isOpen = false"
      >
        {{ opt.name }}
      </component>
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
