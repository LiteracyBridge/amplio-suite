<template>
  <header>
    <h2 class="visually_hidden">{{ title }}</h2>
    <!-- h2>{{ title }}: {{ description }}</h2 -->
    <div class="grid grid-cols-5 items-center">
      <div class="col-span-4 mr-4">
<!--        <font-awesome-icon icon="exclamation-circle" class="w-6 h-6 text-gray-500" />-->
        <span class="mx-4 text-lg text-blue" v-html="description" />
      </div>

    </div>
  </header>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
  },
}
</script>
