<template>
  <Box
    next="/program"
    title="Thank you! We automatically updated the Program Specification based
    on your responses. Please complete the remaining details."
  />
</template>

<script>
import { mapActions } from 'vuex'

import Box from '@/components/SetupBox'

export default {
  components: {
    Box
  },
  methods: {
    ...mapActions('program', [
      'createProgram'
    ])
  },
  mounted () {
    this.createProgram()
  }
}
</script>
