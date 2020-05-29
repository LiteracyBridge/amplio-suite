<template>
  <div class="w-full my-2 text-base bg-white rounded border border-solid border-gray-500">
    <div v-if="iconLeft" class="absolute pin-l pin-t my-3 pl-5 pointer-events-none">
      <font-awesome-icon :icon="iconLeft" class="w-6 h-6 text-gray-500" />
    </div>

    <input
      :class="iconLeft ? 'pl-12' : 'pl-5'"
      class="form-input block w-full py-3 pr-5 focus:outline-none focus:shadow-outline"
      v-bind="$attrs"
      @input="handleInput"
    >
  </div>
</template>

<script>
export default {
  props: {
    iconLeft: {
      type: String,
      default: ''
    },
    value: String
  },
  methods: {
    handleInput (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>