<template>
  <component
    :is="tag"
    :class="[color, textColor]"
    class="inline-flex items-center justify-center px-5 py-2 rounded"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <font-awesome-icon
      v-if="iconLeft"
      :icon="iconLeft"
      :size="size"
      :pulse="pulse"
      class="w-6 h-6" />
    <span :class="iconLeft !== '' ? 'ml-2' : ''">{{ text }}</span>
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
    textColor: {
      type: String,
      default: 'text-white'
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>
