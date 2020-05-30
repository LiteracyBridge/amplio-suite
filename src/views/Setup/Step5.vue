<template>
  <Box
    prev="Step-4"
    next="Step-6"
    title="You are doing great!"
  >
    <div>
      <p id="feedbackFrequently" class="text-2xl font-semibold">
        How frequently do you plan to collect user feedback and usage statistics?
      </p>

      <select
        aria-labelledby="feedbackFrequently"
        class="w-64 mt-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
        :value="feedbackFrequently"
        @change="(event) => setFeedbackFrequently(event.target.value)"
      >
        <option value="">Select</option>
        <option value="Monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="semi_annually">Semi-Annually</option>
        <option value="annually">Annually</option>
      </select>
    </div>

    <div class="mt-10">
      <p id="feedbackFrequentlyOther" class="text-2xl font-semibold">
        Do you plan to gather user feedback and usage statistics at times other
        than during content deployments? If yes, how often do you plan to collect
        this information? If not, select “Not applicable”.
      </p>

      <select
        aria-labelledby="feedbackFrequentlyOther"
        class="w-64 mt-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
        :value="feedbackFrequentlyOther"
        @change="(event) => setFeedbackFrequentlyOther(event.target.value)"
      >
        <option value="">Select</option>
        <option value="weekly">Weekly</option>
        <option value="bi_weekly">Bi-Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="not_applicable">Not Applicable</option>
      </select>
    </div>
  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'

export default {
  computed: {
    ...mapState([
      'feedbackFrequently',
      'feedbackFrequentlyOther'
    ])
  },
  components: {
    Box
  },
  methods: {
    ...mapActions([
      'setFeedbackFrequently',
      'setFeedbackFrequentlyOther'
    ])
  }
}
</script>
