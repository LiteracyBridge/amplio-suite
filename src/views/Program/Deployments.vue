<template>
  <box
    title="Deployments"
    help="You can modify your deployment details here. Enter component details after filling component tab."
  >
    <div class="grid grid-cols-deployments items-center justify-between">
      <p class="col-start-2 text-sm text-gray-500 text-left">Start Date</p>
      <p class="text-sm text-gray-500 text-left">End Date</p>
      <p class="text-sm text-gray-500 text-left">Component</p>

      <template v-for="(date, index) in dates">
        <p :key="`${index}-a`" class="pr-4 col-start-1">Deployment {{ index + 1 }}</p>
        <v-input
          :key="`${index}-b`"
          type="date"
          iconLeft="calendar-alt"
          :aria-label="`Start of deployment ${index}`"
          :value="date.start"
          mx="mx-0"
        />

        <v-input
          :key="`${index}-c`"
          type="date"
          iconLeft="calendar-alt"
          :aria-label="`End of deployment ${index}`"
          :value="date.end"
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

      <span
          tabindex="0"
          class="mt-4 p-2u text-green font-bold cursor-pointer"
          @click="addDeploymentsDate"
          @keyup.enter="addDeploymentsDate"
        >
          + Add deployment
        </span>
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
import { mapState, mapActions } from 'vuex'

import Box from '@/components/ProgramBox'
import VButton from '@/components/Button'
import VInput from '@/components/VInput'
import VModal from '@/components/VModal'

export default {
  computed: {
    ...mapState('program', {
      dates: state => state.deployments.dates
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
      isModalOpen: false
    }
  },
  methods: {
    ...mapActions('program', [
      'addDeploymentsDate'
    ])
  }
}
</script>