<template>
  <div v-if="!hidden" :class="bgColor" class="flex items-center justify-between mb-8 p-4">
    <div>
      <font-awesome-icon v-if="type == 'alert'" class="mr-2" :icon="'exclamation-circle'" />
      {{text}}
    </div>

    <button
      aria-label="Close notification"
      class="px-2 pb-1 bg-semi-transparent cursor-pointer rounded-full hover:bg-semi-transparent-darken"
      @click="close"
    >
      <font-awesome-icon icon="times" class="w-3 h-3 text-white" />
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('notification', [
      'type',
      'text',
      'hidden',
      'icon',
    ]),
    bgColor () {
      return this.type === 'alert' ? 'bg-red-200'
        : 'bg-gray-200'
    }
  },
  methods: {
    ...mapMutations('notification', [
      'close'
    ]),
  }
}
</script>
