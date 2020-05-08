<template>
  <div id="app">
    <TheNavbar />

    <router-view class="min-h-3/4" />

    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TheFooter from '@/components/TheFooter'

export default {
  components: {
    TheNavbar,
    TheFooter
  }
}
</script>
