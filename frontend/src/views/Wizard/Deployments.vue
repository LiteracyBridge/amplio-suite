<template>
  <Box
    :step="step"
    :prev="{ name: 'step-listening-model' }"
    :next="{ name: 'step-feedback' }"
    title="A deployment is a collection of play lists that will be put
    in the field for a period of time, usually one quarter."
  >
    <p id="deployments" class="text-2xl font-semibold">
      How many deployments will you conduct for this program?
    </p>
    <v-input
      ref="deployments"
      type="number"
      min="0"
      aria-labelledby="deployments"
      :value="count"
      @change="setDeploymentsCount({ count: $event.target.value, step })"
    />

    <p id="deploymentLength" class="mt-10 text-2xl font-semibold">
      What is the length of each deployment?
    </p>
    <select
      aria-labelledby="deploymentLength"
      class="w-64 mt-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="length"
      @change="setDeploymentsLength({ length: $event.target.value, step })"
    >
      <option value="">Select</option>
      <option value="one_month">1 Month</option>
      <option value="one_quarter">1 Quarter</option>
      <option value="six_months">Six months</option>
      <option value="one_year">One year</option>
    </select>

    <p id="firstDeployment" class="mt-10 text-2xl font-semibold">
      Choose your first deployment start date
    </p>
    <v-input
      type="date"
      iconLeft="calendar-alt"
      aria-labelledby="firstDeployment"
      :min="yesterday"
      :value="date"
      @change="setDeploymentsFirst({ first: $event.target.value, step })"
    />
  </Box>
</template>

<script>
import { mapState, mapActions } from 'pinia'

import Box from '@/components/SetupBox'
import VInput from '@/components/VInput.vue'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  computed: {
      ...mapState('programspec', {
          count: (state)=>state.general.deployments_count,
          first: (state)=>state.general.deployments_first,
          length: (state)=>state.general.deployments_length,
      })
  },
  data () {
    return {
      date: null,
      yesterday: null
    }
  },
  mounted () {
    let today = new Date()
    let date = new Date(today)
    // Tomorrow
    date.setDate(date.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(date.getDate() - 1);
    this.yesterday = yesterday;
    // const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const dateNumber = date.getDate().toString().padStart(2, '0');
    this.date = date; //`${date.getFullYear()}-${month}-${dateNumber}`

    // Auto focus
    this.$refs.deployments.$el.children[0].focus()
  },
  components: {
    Box,
    VInput
  },
  methods: {
    ...mapActions('wizard', [
      'setDeploymentsCount',
      'setDeploymentsLength',
      'setDeploymentsFirst'
    ])
  }
}
</script>
