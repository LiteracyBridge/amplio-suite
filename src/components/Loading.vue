<template>
  <div class="absolute w-full h-full bg-loading z-10">
    <div class="flex flex-col items-center justify-center h-full text-white">
      <h2
        v-if="text !== ''"
        class="pb-4 text-2xl font-semibold"
      >
        {{ text }}
      </h2>
      <font-awesome-icon
        icon="spinner"
        size="4x"
        pulse
        class="mx-auto w-20 h-20" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Loading'
    }
  }
}
</script>
