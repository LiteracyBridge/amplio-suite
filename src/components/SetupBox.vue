<template>
  <div class="mt-6 p-6 rounded-lg border border-solid border-gray-300 shadow-lg">
    <h2 v-if="title !== ''" class="py-4 text-3xl text-blue">{{ title }}</h2>

    <div class="text-xl text-center">
      <slot />
    </div>

    <footer class="flex" :class="prev !== '' ? 'justify-between' : 'justify-end'">
      <router-link v-if="prev !== ''" :to="{ name: prev }">
        <Button text="PREV" />
      </router-link>

      <router-link v-if="next !== ''" :to="{ name: next }">
        <Button text="NEXT" />
      </router-link>
    </footer>
  </div>
</template>

<script>
import Button from '@/components/Button'

export default {
  components: {
    Button
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    prev: {
      type: String,
      default: ''
    },
    next: {
      type: String,
      default: ''
    }
  }
}
</script>
