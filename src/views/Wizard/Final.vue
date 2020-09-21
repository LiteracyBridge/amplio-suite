<template>
  <Box
    ref="box"
    :step="step"
    :next="`/programs/${programCode}/settings`"
    nextLabel="Go to program specification"
    title="Thank you! We automatically updated the Program Specification based
    on your responses. Please complete the remaining details."
  />
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
  },
  async mounted () {
    this.addCompletedStep(this.step)
    await this.fetchRoadmap()

    if (!this.wizarsIsComplete) {
      this.setWizardIsCompleted()
      this.createProgram()

      this.toggleStep(1)
      this.updateRoadmap()
    }
    this.$refs.box.$el.querySelector('button').focus()
  }
}
</script>
