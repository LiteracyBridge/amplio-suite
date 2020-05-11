<template>
  <div class="p-6 rounded-lg shadow-lg hover:shadow-hover" style="border: 1px solid #e0e0e0;">
    <div class="overflow-hidden">
      <img :src="img" class="transform duration-500 hover:scale-125">
    </div>
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
