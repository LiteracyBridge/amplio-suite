<template>
  <div>
    <TheNavbar />

    <router-view class="min-h-banner-header" />

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
