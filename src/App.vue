<template>
  <div id="app" class="bg-gray-100 font-sans">
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
