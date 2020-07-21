<template>
  <Box
    :next="{ name: 'Step-2' }"
    title="Let’s start by getting your program details. If your
    program details change later, you can always update the program
    specification to match your requirements."
  >
    <p class="text-2xl font-semibold">
      What is your program name?
    </p>

    <v-input
      ref="programName"
      type="text"
      name="programName"
      label="Enter Program Name"
      :value="programName"
      mx="mx-auto my-4"
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
    ...mapState('programData', {
      programName: state => state.general.programName
    })
  },
  components: {
    Box,
    VInput
  },
  mounted () {
    this.$refs.programName.$el.children[0].focus()
  },
  methods: {
    ...mapActions('wizard', [
      'setProgramName'
    ])
  }
}
</script>
