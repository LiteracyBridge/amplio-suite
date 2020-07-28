<template>
  <div
    @mouseover="show = true"
    @mouseleave="show = false"
    class="relative inline-block text-center border-b border-black border-dotted cursor-pointer"
  >
    <slot />

    <span
      :class="show ? 'opacity-100' : 'opacity-0'"
      class="absolute z-10 p-2 text-sm text-white text-center bg-gray-600 rounded-lg"
      style="width: 200px; bottom: 100%; transition: opacity .6s; transform: translateX(-50%);"
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
    }
  },
  data: () => ({
    show: false
  })
}
</script>
