<template>
  <div class="p-6 h-full bg-white rounded-lg dd shadow-box hover:shadow-hover">
    <div class="overflow-hidden">
      <img class="transform duration-500" :src="img" :alt="alt">
    </div>
    <h2 class="py-4 text-xl font-bold">{{ title }}</h2>
    <p class="text-lg text-center">
      <slot />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.dd:hover img {
  transform: scale(1.25);
}
</style>
