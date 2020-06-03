<template>
  <component
    :is="tag"
    :class="color"
    class="inline-flex items-center px-5 py-2 text-white rounded"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <font-awesome-icon
      v-if="iconLeft"
      :icon="iconLeft"
      :size="size"
      :pulse="pulse"
      class="w-6 h-6" />
    <span class="ml-2">{{ text }}</span>
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
    iconLeft: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'lg'
    },
    pulse: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'bg-green'
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>
