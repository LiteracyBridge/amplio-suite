<template>
  <div
    :class="show ? 'block' : 'hidden'"
    class="fixed bottom-0 inset-x-0 pb-5 z-100"
  >
    <div class="container mx-auto p-4 bg-gray-900 rounded-lg shadow-lg">
      <div class="flex items-center justify-between flex-wrap text-white">
        <span>{{ label }}</span>

        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    },
    label: {
      required: true,
      type: String
    },
    timeout: {
      default: 8000,
      type: Number
    }
  },
  watch: {
    show () {
      if (this.show) setTimeout(() => {
        this.$emit('update:show', false)
      }, this.timeout)
    }
  }
}
</script>
