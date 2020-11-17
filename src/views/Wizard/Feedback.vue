<template>
  <Box
    :step="step"
    :prev="{ name: 'step-deployments' }"
    :next="{ name: 'step-languages' }"
    title="You are doing great!"
  >
    <div>
      <p id="feedbackFrequently" class="text-2xl font-semibold">
        How frequently do you plan to collect user feedback and usage statistics?
      </p>

      <select
        ref="freq"
        aria-labelledby="feedbackFrequently"
        class="w-64 mt-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
        :value="feedbackFrequently"
        @change="setFeedbackFrequently({ frequently: $event.target.value, step })"
      >
        <option value="">Select</option>
        <option value="weekly">Weekly</option>
        <option value="bi-weekly">Bi-Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="semi_annually">Semi-Annually</option>
        <option value="annually">Annually</option>
      </select>
    </div>
  </Box>
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
  computed: {
    ...mapState('programData', [
      'feedbackFrequently'
    ])
  },
  components: {
    Box
  },
  mounted () {
    this.$refs.freq.focus()
  },
  methods: {
    ...mapActions('wizard', [
      'setFeedbackFrequently'
    ])
  }
}
</script>
