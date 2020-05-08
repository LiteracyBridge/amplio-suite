<template>
  <section class="container mx-auto mt-20 text-center">
    <header class="inline-flex">
      <h1 class="text-2xl">Page {{ step }}/7</h1>
      <progress class="ml-5" max="7" :value="step"></progress>
    </header>

    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>

    <p class="pt-6">
      Need help? Contact us on <a class="text-blue" href="help@amplio.org">help@amplio.org</a>
    </p>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: mapState([
    'step'
  ]),
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  mounted () {
    const step = this.$route.name.split('-')[1]
    this.setStep(step)
  },
  beforeRouteUpdate (to, from, next) {
    const toStep = to.path.split('-')[1]
    const fromStep = from.path.split('-')[1]
    this.transitionName = toStep < fromStep ? 'slide-right' : 'slide-left'
    next()
  },
  methods: {
    ...mapActions([
      'setStep'
    ])
  }
}
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.250s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(5em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-5em, 0);
}
</style>
