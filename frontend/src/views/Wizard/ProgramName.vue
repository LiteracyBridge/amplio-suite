<template>
  <Box
    :step="step"
    :next="{ name: 'step-geo' }"
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
      @input="setProgramName({ name: $event.target.value, step })"
    />

  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'
import VInput from '@/components/VInput'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('program', [
      'programName'
    ]),
    ...mapState('programData', [
      'partner',
      'affiliate',
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
    ...mapActions('wizard', [
      'setProgramName',
      // 'setPartner',
      // 'setAffiliate',
    ])
  }
}
</script>
