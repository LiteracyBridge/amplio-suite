<template>
  <section class="p-6 bg-white shadow-box">
    <header class="flex justify-center content-center">
      <h2 class="visually_hidden">{{ title }}</h2>
      <font-awesome-icon icon="exclamation-circle" class="w-6 h-6 text-gray-500" />
      <p class="pl-2 text-lg text-blue" v-html="help" />
    </header>

    <div class="relative min-h-200-px my-5 text-center">
      <loading v-if="httpStatus !== 'success'" />
      <slot />
    </div>
  </section>
</template>

<script>
import Loading from '@/components/Loading'

export default {
  props: {
    httpStatus: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    help: {
      type: String,
      default: ''
    }
  },
  components: {
    Loading,
  },
}
</script>
