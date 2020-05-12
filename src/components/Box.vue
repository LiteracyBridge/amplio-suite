<template>
  <div class="p-6 rounded-lg border border-solid border-gray-300 dd shadow-lg hover:shadow-hover">
    <div class="overflow-hidden">
      <img :src="img" class="transform duration-500">
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

<style scoped>
.dd:hover img {
  transform: scale(1.25);
}
</style>
