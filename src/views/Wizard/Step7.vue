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
      wizarsIsComplete: 'isComplete'
    }),
    ...mapState('program', [
      'programCode'
    ])
  },
  methods: {
    ...mapActions('programData', [
      'createProgram'
    ]),
    ...mapActions('wizard', [
      'addCompletedStep',
      'setIsCompleted'
    ])
  },
  mounted () {
    if (!this.wizarsIsComplete) {
      this.addCompletedStep(7)
      this.setIsCompleted()
      this.createProgram()
    }
    this.$refs.box.$el.querySelector('button').focus()
  }
}
</script>
