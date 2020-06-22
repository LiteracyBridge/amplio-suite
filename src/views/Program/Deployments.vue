<template>
  <box
    title="Deployment"
    help="You can modify your deployment details here. Enter component details after filling component tab."
  >
    <div class="grid grid-cols-deployments items-center justify-between">
      <p class="col-start-2 text-sm text-gray-500 text-left">Start Date</p>
      <p class="text-sm text-gray-500 text-left">End Date</p>
      <p class="text-sm text-gray-500 text-left">Component</p>

      <template v-for="(date, index) in startDeployments">
        <p :key="`${index}-a`" class="pr-4 col-start-1">Deployment {{ index + 1 }}</p>
        <v-input
          :key="`${index}-b`"
          type="date"
          iconLeft="calendar-alt"
          :aria-label="`Start of deployment ${index}`"
          :value="date"
          mx="mx-0"
        />

        <v-input
          :key="`${index}-c`"
          type="date"
          iconLeft="calendar-alt"
          :aria-label="`End of deployment ${index}`"
          :value="endDeployments[index]"
          mx="mx-0"
        />

        <select
          :key="`${index}-d`"
          :aria-label="`Components of the deployment ${index}`"
          class="w-64 my-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
        >
          <option value="all">All</option>
        </select>

        <button
          :key="`${index}-e`"
          @click="isModalOpen = true"
          :aria-label="`Delete deployment ${index}`"
        >
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
      </template>
    </div>

    <v-modal v-model="isModalOpen" title="Delete Deployment">
      <p>This deployment will be deleted.</p>

      <template v-slot:footer>
        <v-button @click="isModalOpen = false" text="Confirm" />
        <v-button @click="isModalOpen = false" text="Cancel" color="bg-gray-400" class="text-black" />
      </template>
    </v-modal>
  </box>
</template>

<script>
import { mapState } from 'vuex'

import Box from '@/components/ProgramBox'
import VButton from '@/components/Button'
import VInput from '@/components/VInput'
import VModal from '@/components/VModal'

export default {
  computed: {
    ...mapState('program', {
      deploymentsAmount: state => state.deployments.amount,
      deploymentsFirst: state => state.deployments.first,
      deploymentsFrequency: state => state.deployments.frequency
    })
  },
  components: {
    Box,
    VButton,
    VInput,
    VModal
  },
  data () {
    return {
      isModalOpen: false,

      startDeployments: [],
      endDeployments: []
    }
  },
  mounted () {
    const increment = this.deploymentsFrequency === 'one_month' ? 1 :
      this.deploymentsFrequency === '1_quarter' ? 3 :
        this.deploymentsFrequency === 'six_months' ? 6 :
          this.deploymentsFrequency === 'one_year' ? 12 : 0

    this.startDeployments = [this.deploymentsFirst]
    for (let i=1; i < this.deploymentsAmount; i++) {
      const prev = new Date(this.startDeployments[i - 1])
      const next = new Date(prev.setMonth(prev.getMonth() + increment))
      this.startDeployments.push(next.toISOString().split('T')[0])
    }

    this.endDeployments = this.startDeployments.map(date => {
      const start = new Date(date)
      const end = new Date(start.setMonth(start.getMonth() + increment))
      return end.toISOString().split('T')[0]
    })
  }
}
</script>