<template>
  <section class="p-6 bg-white shadow-box">
    <header class="flex justify-center content-center">
      <h2 class="visually_hidden">{{ title }}</h2>
      <font-awesome-icon icon="exclamation-circle" class="w-6 h-6 text-gray-500" />
      <p class="pl-2 text-lg text-blue">{{ help }}</p>
    </header>

    <div class="min-h-200-px py-5 text-center">
      <slot />
    </div>

    <footer class="flex justify-between">
      <v-button
        @click="() => discardChanges(title)"
        :iconLeft="httpStatus[title] === 'loading' ? 'spinner' : ''"
        size="2x"
        :pulse="httpStatus[title] === 'loading'"
        :color="tabStatus[title] ? 'bg-transparent text-red-500 border border-red-500' : 'bg-gray-400'"
        text="Discard Changes"
      />
      <v-button
        @click="() => saveChanges(title)"
        :iconLeft="httpStatus[title] === 'updating' ? 'spinner' : ''"
        size="2x"
        :pulse="httpStatus[title] === 'updating'"
        :color="tabStatus[title] ? 'bg-green' : 'bg-gray-400'"
        text="Save Change"
      />
    </footer>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import VButton from '@/components/Button'

export default {
  props: {
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
    VButton
  },
  computed: {
    ...mapGetters('program', [
      'httpStatus',
      'tabStatus'
    ])
  },
  methods: {
    ...mapActions('program', [
      'saveChanges',
      'discardChanges'
    ])
  }
}
</script>
