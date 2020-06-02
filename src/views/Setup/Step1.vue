<template>
  <Box
    next="Step-2"
    title="Let’s start by getting your program details. If your
    program details change later, you can always update the program
    specification to match your requirements."
  >
    <p id="programName" class="text-2xl font-semibold">
      What is your program name?
    </p>

    <v-input
      type="text"
      ref="programName"
      aria-labelledby="programName"
      placeholder="Enter Program Name"
      :value="programName"
      @input="(event) => setProgramName(event.target.value)"
    />
  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'
import VInput from '@/components/VInput'

export default {
  computed: {
    ...mapState([
      'programName'
    ])
  },
  components: {
    Box,
    VInput
  },
  mounted () {
    this.$refs.programName.$el.children[0].focus()
  },
  methods: {
    ...mapActions([
      'setProgramName'
    ])
  }
}
</script>
