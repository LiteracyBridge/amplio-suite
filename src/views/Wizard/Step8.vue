<template>
  <Box
    ref="box"
    :next="`/programs/${programCode}/settings`"
    title="Thank you! We automatically updated the Program Specification based
    on your responses. Please complete the remaining details."
  />
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'

export default {
  components: {
    Box
  },
  computed: {
    ...mapState('wizard', {
      wizardIsComplete: 'isComplete'
    }),
    ...mapState('programData', [
      'programCode'
    ])
  },
  methods: {
    ...mapActions('program', [
      'createProgram'
    ]),
    ...mapActions('wizard', [
      'addCompletedStep',
      'setIsCompleted'
    ]),
    ...mapActions('roadmap', [
      'fetchRoadmap',
      'updateRoadmap',
      'toggleStep'
    ]),
  },
  async mounted () {
    await this.fetchRoadmap()

    if (!this.wizardIsComplete) {
      this.addCompletedStep(8)
      this.setIsCompleted()
      this.createProgram()

      // Autocomplete the first step of the roadmap
      this.toggleStep(1)
      this.updateRoadmap()
    }
    this.$refs.box.$el.querySelector('button').focus()
  }
}
</script>
