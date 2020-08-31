<template>
  <div
    @mouseover="show = true"
    @mouseleave="show = false"
    class="relative inline-block text-center border-b border-black border-dotted cursor-pointer"
  >
    <slot />

    <span
      :class="[show ? 'opacity-100' : 'opacity-0', position === 'left' ? '-ml-4' : '']"
      class="absolute z-10 p-2 text-sm text-white text-center bg-gray-600 rounded-lg"
      style="width: 200px; bottom: 100%; transition: opacity .6s;"
      :style="`transform: ${translate}`"
    >
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    position: {
      type: String,
      default: 'center',
      validator: (value) => {
        return ['left', 'center', 'right'].indexOf(value) !== -1
      }
    }
  },
  computed: {
    translate () {
      const amount = this.position === 'left' ? '0'
        : this.position === 'center' ? '-50%'
          : '-100%'

      return `translateX(${amount});`
    },
  },
  data: () => ({
    show: false
  })
}
</script>
