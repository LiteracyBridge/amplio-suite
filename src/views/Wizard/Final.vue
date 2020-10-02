<template>
  <box
    ref="box"
    :step="step"
    :next="`/programs/${programCode}/settings`"
    nextLabel="Go to program specification"
    title="Thank you! We automatically updated the Program Specification based
    on your responses. Please complete the remaining details."
  >
    <router-link
      :to="{ name: 'roadmap', params: { programCode }}"
      class="pt-5 text-blue text-2xl font-semibold underline"
    >
      View launch check list or go to program specification.
    </router-link>
  </box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  components: {
    Box
  },
  computed: {
    ...mapState('wizard', {
      wizarsIsComplete: 'isComplete'
    }),
    ...mapState('programData', [
      'programCode'
    ])
  },
  async created () {
    if (!this.wizarsIsComplete) {
    this.addCompletedStep(this.step)
      this.setWizardIsCompleted()
      this.createProgram()

      await this.fetchRoadmap()
      await this.toggleStep(1)
      await this.updateRoadmap()
    }
    this.$refs.box.$el.querySelector('button').focus()
  },
  methods: {
    ...mapActions('program', [
      'createProgram'
    ]),
    ...mapActions('wizard', {
      setWizardIsCompleted: 'setIsCompleted',
      addCompletedStep: 'addCompletedStep'
    }),
    ...mapActions('roadmap', [
      'fetchRoadmap',
      'updateRoadmap',
      'toggleStep'
    ]),
  }
}
</script>
