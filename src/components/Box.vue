<template>
  <div class="p-6 rounded-lg shadow-lg" style="border: 1px solid #e0e0e0;">
    <img :src="img">
    <h2 class="py-4 text-xl font-bold">{{ title }}</h2>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      required: true
    },
    title: {
      type: String
    }
  }
}
</script>
