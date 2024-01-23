<template>
  <div>
    <slot />
    <router-view class="min-h-banner">
      <TheNotification />
    </router-view>

    <TheFooter />
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter.vue'
import TheNotification from '@/components/TheNotification.vue'

export default {
  components: {
    TheFooter,
    TheNotification
  }
}
</script>
