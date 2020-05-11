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
        class="w-64 mt-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500"
        @change="(event) => setFeedbackFrequently(event.target.value)"
      >
        <option value="">Select</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
        <option value="Semi-Annually">Semi-Annually</option>
        <option value="Annually">Annually</option>
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
        class="w-64 mt-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500"
        @change="(event) => setFeedbackFrequentlyOther(event.target.value)"
      >
        <option value="">Select</option>
        <option value="Weekly">Weekly</option>
        <option value="Bi-Weekly">Bi-Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
        <option value="Not Applicable">Not Applicable</option>
      </select>
    </div>
  </Box>
</template>

<script>
import { mapActions } from 'vuex'

import Box from '@/components/SetupBox'

export default {
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
