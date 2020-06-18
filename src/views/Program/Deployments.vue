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
        <p :key="`${index}-a`" :id="`dep_${index}`" class="pr-4 col-start-1">Deployment {{ index + 1 }}</p>
        <v-input
          :key="`${index}-b`"
          type="date"
          iconLeft="calendar-alt"
          :aria-labelledby="`dep_${index}`"
          :value="date"
          mx="mx-0"
        />

        <v-input
          :key="`${index}-c`"
          type="date"
          iconLeft="calendar-alt"
          :aria-labelledby="`dep_${index}`"
          :value="endDeployments[index]"
          mx="mx-0"
        />

        <select
          :key="`${index}-d`"
          aria-labelledby="deploymentLength"
          class="w-64 my-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
        >
          <option value="all">All</option>
        </select>

        <button :key="`${index}-e`" @click="isModalOpen = true">
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
      </template>
    </div>

    <v-modal v-model="isModalOpen">
      <section>
        <header class="my-4">
          <h2 class="text-2xl text-bold">Delete Deployment</h2>
        </header>

        <div class="pt-6 pb-20 text-xl">
          <p>This deployment will be deleted.</p>
        </div>

        <footer class="flex justify-between">
          <v-button text="Cancel" color="bg-gray-400" class="text-black" />
          <v-button text="Confirm" />
        </footer>
      </section>
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
    ...mapState([
      'deployments',
      'deploymentFrequency',
      'deploymentInit'
    ])
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
    const increment = this.deploymentFrequency === 'one_month' ? 1 :
      this.deploymentFrequency === '1_quarter' ? 3 :
        this.deploymentFrequency === 'six_months' ? 6 :
          this.deploymentFrequency === 'one_year' ? 12 : 0

    this.startDeployments = [this.deploymentInit]
    for (let i=1; i < this.deployments; i++) {
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