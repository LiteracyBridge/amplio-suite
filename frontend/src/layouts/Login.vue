<template>
  <div>
    <router-view class="min-h-banner">
      <TheNotification />
    </router-view>

    <TheFooter />
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter'
import TheNotification from '@/components/TheNotification'

export default {
  components: {
    TheFooter,
    TheNotification
  }
}
</script>
