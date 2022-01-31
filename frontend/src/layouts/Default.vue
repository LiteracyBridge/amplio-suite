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
import TheNavbar from '@/components/TheNavbar'
import TheFooter from '@/components/TheFooter'
import TheNotification from '@/components/TheNotification'
import TheModal from '@/components/TheModal'


export default {
  components: {
    TheNavbar,
    TheFooter,
    TheNotification,
    TheModal,
  }
}
</script>
