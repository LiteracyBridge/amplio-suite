<template>
  <component :is="layout" id="app" class="bg-gray-100 font-sans">
    <router-view />
  </component>
</template>

<script>
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout'
    }
  }
}
</script>
