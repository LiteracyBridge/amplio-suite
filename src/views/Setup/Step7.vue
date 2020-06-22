<template>
  <Box
    ref="box"
    next="/program"
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
    ...mapState('program', [
      'setupIsComplete'
    ])
  },
  methods: {
    ...mapActions('program', [
      'createProgram'
    ])
  },
  mounted () {
    if (!this.setupIsComplete) {
      this.createProgram()
    }
    this.$refs.box.$el.querySelector('button').focus()
  }
}
</script>
