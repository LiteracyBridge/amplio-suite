<template>
  <box
    title="deployments"
    help="You can modify your deployment details here. Enter component details after filling component tab."
  >
    <div class="grid grid-cols-deployments items-center justify-between">
      <p class="col-start-2 text-sm text-gray-500 text-left">Start Date</p>
      <p class="text-sm text-gray-500 text-left">End Date</p>
      <p class="text-sm text-gray-500 text-left">Component</p>

      <template v-for="item in deployments">
        <p :key="`${item.deploymentname}-a`" class="pr-4 col-start-1">Deployment {{ item.deploymentname }}</p>

        <v-input
          :key="`${item.deploymentname}-b`"
          type="date"
          iconLeft="calendar-alt"
          :aria-label="`Start of deployment ${item.deploymentname}`"
          :value="item.startdate"
          @change="(event) => setDeploymentDate({ id: item.deploymentname, what: 'startdate', date: event.target.value })"
          mx="mx-0"
        />

        <v-input
          :key="`${item.deploymentname}-c`"
          type="date"
          iconLeft="calendar-alt"
          :aria-label="`End of deployment ${item.deploymentname}`"
          :value="item.enddate"
          :min="item.startDate"
          @change="(event) => setDeploymentDate({ id: item.deploymentname, what: 'enddate', date: event.target.value })"
          mx="mx-0"
        />

        <select
          :key="`${item.deploymentname}-d`"
          :aria-label="`Components of the deployment ${item.deploymentname}`"
          class="w-64 my-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
        >
          <option value="">All</option>
        </select>

        <button
          :key="`${item.deploymentname}-e`"
          @click="() => handleOpen(item.deploymentname)"
          :aria-label="`Delete deployment ${item.deploymentname}`"
        >
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
      </template>

      <span
        tabindex="0"
        class="mt-4 p-2u text-green font-bold cursor-pointer"
        @click="addDeployment"
        @keyup.enter="addDeployment"
      >
        + Add deployment
      </span>
    </div>

    <v-modal v-model="isModalOpen" title="Delete Deployment">
      <p>This deployment will be deleted.</p>

      <template v-slot:footer>
        <v-button @click="confirmDelete" text="Confirm" />
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
      deployments: state => state.deployments.items
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
      itemId: 0
    }
  },
  mounted () {
    this.fetchDeployments()
  },
  methods: {
    ...mapActions('program', [
      'addDeployment',
      'removeDeployment',
      'setDeploymentDate',
      'fetchDeployments'
    ]),
    handleOpen(id) {
      this.itemId = id
      this.isModalOpen = true
    },
    confirmDelete() {
      this.removeDeployment({ id: this.itemId })
      this.isModalOpen = false
    }
  }
}
</script>
