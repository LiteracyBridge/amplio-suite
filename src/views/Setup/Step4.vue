<template>
  <Box
    prev="Step-3"
    next="Step-5"
    title="A deployment is a collection of play lists that will be put
    in the field for a period of time, usually one quarter."
  >
    <p id="deployments" class="text-2xl font-semibold">
      How many deployments will you conduct for this program?
    </p>

    <select
      aria-labelledby="deployments"
      class="w-64 mt-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500"
      :value="deployments"
      @change="(event) => setDeployments(event.target.value)"
    >
      <option value="-1">Select</option>
      <option v-for="index in 10" :key="index" :value="index">{{ index }}</option>
    </select>
  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'

export default {
  computed: {
    ...mapState([
      'deployments'
    ])
  },
  components: {
    Box
  },
  methods: {
    ...mapActions([
      'setDeployments'
    ])
  }
}
</script>
