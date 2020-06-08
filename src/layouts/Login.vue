<template>
  <div>
    <main class="container mx-auto text-center pt-4">
      <TheNotification />
    </main>
    <router-view class="min-h-banner" />

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
