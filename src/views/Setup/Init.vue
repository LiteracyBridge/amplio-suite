<template>
  <section class="container mx-auto mt-20 text-center">
    <header class="inline-flex">
      <h1 class="text-2xl">Page {{ step }}/7</h1>
      <progress class="ml-5" max="7" :value="step"></progress>
    </header>

    <router-view />

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
  methods: {
    ...mapActions([
      'setStep'
    ])
  },
  mounted () {
    const step = this.$route.name.split('-')[1]
    this.setStep(step)
  }
}
</script>
