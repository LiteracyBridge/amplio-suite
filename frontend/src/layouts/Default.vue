<template>
  <div>
    <TheNavbar />
    <TheNotification />

    <router-view class="min-h-with-footer-header" />

    <TheFooter />
    <TheModal />
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheNotification from '@/components/TheNotification.vue'
import TheModal from '@/components/TheModal.vue'


export default {
  components: {
    TheNavbar,
    TheFooter,
    TheNotification,
    TheModal,
  }
}
</script>
