<template>
  <section class="mt-6 p-6 bg-white rounded-lg shadow-box">
    <form v-on:submit.prevent>
      <header>
        <h2 v-if="title !== ''" class="py-4 text-3xl text-blue">{{ title }}</h2>
      </header>

      <div class="min-h-200-px py-5 text-center">
        <slot />
      </div>

      <footer class="flex flex-row-reverse justify-between">
        <VButton
          v-if="next !== ''"
          id="nextStep"
          variant="success"
          :label="nextLabel"
          :disabled="isFill && status !== 'loading' ? false : true"
          @click="handleNext"
          />

        <VButton
          v-if="prev !== ''"
          label="PREV"
          variant="success"
          @click="handlePrev"
        />
      </footer>
      </form>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/VButton'

export default {
  computed: {
    ...mapState('programspec', [
      'status',
    ]),
    ...mapState('wizard', [
      'completedSteps'
    ]),
    isFill () {
      return this.completedSteps.includes(this.step)
    }
  },
  components: {
    VButton,
  },
  props: {
    step: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    prev: {
      type: [String, Object],
      default: ''
    },
    next: {
      type: [String, Object],
      default: ''
    },
    nextLabel: {
      type: String,
      default: 'NEXT'
    },
  },
  methods: {
    ...mapActions('wizard', [
      'nextStep',
      'prevStep'
    ]),
    handlePrev () {
      this.prevStep()
      this.$router.push(this.prev)
    },
    handleNext () {
      if(this.isFill && this.status !== 'loading') {
        this.nextStep()
        this.$router.push(this.next)
      }
    }
  }
}
</script>
