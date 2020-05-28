<template>
  <div>
    <router-view class="min-h-banner" />

    <TheFooter />
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter'

export default {
  components: {
    TheFooter
  }
}
</script>
