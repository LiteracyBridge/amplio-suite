<template>
  <main class="container mx-auto pt-20 text-center">
    <header class="inline-flex">
      <h1 class="text-2xl">Page {{ actualStep }}/{{ total }}</h1>
      <progress class="ml-5 self-center" :max="total" :value="actualStep"></progress>
    </header>

    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>

    <footer class="py-6">
      Need help? Contact us on <a class="text-blue" href="mailto:support@amplio.org">support@amplio.org</a>
    </footer>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Setup',
  props: ['programId'],
  computed: mapState('wizard', [
    'actualStep'
  ]),
  data () {
    return {
      total: 8,
      transitionName: 'slide-left'
    }
  },
  beforeRouteUpdate (to, from, next) {
    const toStep = to.matched[1].props.default.step
    const fromStep = from.matched[1].props.default.step
    this.transitionName = toStep < fromStep ? 'slide-right' : 'slide-left'
    next()
  },
  methods: {
    ...mapActions('wizard', [
      'setStep'
    ]),
  }
}
</script>
