<template>
  <button
    class="px-5 py-2 text-white bg-green rounded"
    v-on="$listeners"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>
