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
      <v-button text="Discard Changes" color="bg-gray-400" />
      <v-button
        @click="() => updateProgram({ tab: title.toLowerCase() })"
        :iconLeft="status === 'loading' ? 'spinner' : ''"
        size="2x"
        :pulse="status === 'loading'"
        :color="status === 'loading' ? 'bg-gray-500' : 'bg-green'"
        text="Save Change"
      />
    </footer>
  </section>
</template>

<script>
import { mapState , mapActions} from 'vuex'

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
    ...mapState('program', {
      status: state => state.status
    })
  },
  methods: {
    ...mapActions('program', [
      'updateProgram'
    ])
  }
}
</script>