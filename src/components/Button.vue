<template>
  <component
    :is="tag"
    class="px-5 py-2 text-white bg-green rounded"
    v-bind="$attrs"
    v-on="$listeners"
  >
    {{ text }}
  </component>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      default: 'button'
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>
