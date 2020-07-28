<template>
  <section class="p-6 bg-white shadow-box">
    <header class="flex justify-center content-center">
      <h2 class="visually_hidden">{{ title }}</h2>
      <font-awesome-icon icon="exclamation-circle" class="w-6 h-6 text-gray-500" />
      <p class="pl-2 text-lg text-blue">{{ help }}</p>
    </header>

    <div class="relative min-h-200-px my-5 text-center">
      <loading v-if="status !== 'success'" />
      <slot />
    </div>

    <footer class="flex justify-between">
      <v-button
        @click="discardChanges"
        size="2x"
        :color="tabStatus[title] ? 'bg-transparent text-red-500 border border-red-500' : 'bg-gray-400'"
        text="Discard Changes"
      />
      <v-button
        @click="saveChanges"
        size="2x"
        :color="tabStatus[title] ? 'bg-green' : 'bg-gray-400'"
        text="Save Change"
      />
    </footer>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import { eventBus } from '@/eventBus'

import VButton from '@/components/Button'
import Loading from '@/components/Loading'

export default {
  props: {
    status: {
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
    VButton,
    Loading,
  },
  computed: {
    ...mapGetters('uiSettings', [
      'tabStatus'
    ])
  },
  methods: {
    saveChanges () {
      eventBus.$emit('save-crud-data')
    },
    discardChanges () {
      eventBus.$emit('discard-crud-data')
    }
  }
}
</script>
