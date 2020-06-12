<template>
  <div :class="mx" class="w-64 my-2 text-base bg-white">
    <div v-if="iconLeft" class="absolute pin-l pin-t pl-5 pt-2 pointer-events-none">
      <font-awesome-icon :icon="iconLeft" class="w-6 h-6 text-gray-500" />
    </div>

    <input
      :class="iconLeft ? 'pl-12' : 'pl-5'"
      class="w-full block py-2 pr-5 rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="value"
      v-bind="$attrs"
      v-on="$listeners"
    >
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: [String, Number],
    iconLeft: {
      type: String,
      default: ''
    },
    mx: {
      type: String,
      default: 'mx-auto'
    }
  }
}
</script>