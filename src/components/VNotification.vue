<template>
  <div v-if="value" :class="bgColor" class="flex items-center justify-between mb-8 p-4">
    <div>
      <font-awesome-icon v-if="icon !== ''" class="mr-2" :icon="icon" />
      <slot/>
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
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgColor () {
      return this.type === 'is-danger' ? 'bg-red-200'
        : 'bg-gray-200'
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    }
  }
}
</script>