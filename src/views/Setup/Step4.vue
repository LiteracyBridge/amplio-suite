<template>
  <Box
    prev="Step-3"
    next="Step-5"
    title="A deployment is a collection of play lists that will be put
    in the field for a period of time, usually one quarter."
  >
    <div>
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
    </div>

    <div v-if="deployments > 0" class="mt-10">
      <p id="howOften" class="text-2xl font-semibold">
        How often do you plan to deploy new content?
      </p>

      <select
        aria-labelledby="howOften"
        class="w-64 mt-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500"
        :value="deploymentFrequency"
        @change="(event) => setDeploymentFrequency(event.target.value)"
      >
        <option value="">Select</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
        <option value="Semi-Annually">Semi-Annually</option>
        <option value="Annually">Annually</option>
      </select>
    </div>

    <div v-if="deployments > 0" class="mt-10">
      <p id="firstDeployment" class="text-2xl font-semibold">
        Choose your first deployment start date
      </p>

      <div class="inline-flex items-center w-64 mt-2 px-5 text-base bg-white rounded border border-solid border-gray-500">
        <Calendar class="w-4 h-4 text-gray-500" />

        <input
          type="date"
          aria-labelledby="firstDeployment"
          class="w-full py-2 pl-2 outline-none"
          :value="date"
          @change="(event) => setDeploymentInit(event.target.value)"
        >
      </div>
    </div>
  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'
import Calendar from '@/assets/svg/calendar.svg'

export default {
  computed: {
    ...mapState([
      'deployments',
      'deploymentFrequency'
    ])
  },
  data () {
    return {
      date: null
    }
  },
  mounted () {
    const date = new Date()
    this.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  },
  components: {
    Box,
    Calendar
  },
  methods: {
    ...mapActions([
      'setDeployments',
      'setDeploymentFrequency',
      'setDeploymentInit'
    ])
  }
}
</script>
