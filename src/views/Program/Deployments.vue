<template>
  <section class="relative p-6 pt-0">
    <loading v-if="status === 'loading'" class="-ml-6 rounded-b-lg" />

    <program-header
      title="General"
      :isDirty="isDirty"
      :description="description"
      :onSaveChanges="updateDeployment"
      :onDiscardChanges="fetchDeployments"
    />

    <div class="grid grid-cols-deployments items-center justify-between">
      <p class="col-start-2 text-sm text-gray-500 text-left">Start Date</p>
      <p class="text-sm text-gray-500 text-left">End Date</p>
      <p class="text-sm text-gray-500 text-left">Component</p>

      <template v-for="(item, index) in deployments">
        <p :key="`${item.deploymentname}-a`" class="pr-4 col-start-1">Deployment {{ index + 1 }}</p>

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
          v-if="index === deployments.length - 1"
          :key="`${item.deploymentname}-e`"
          @click="handleOpenModal"
          :aria-label="`Delete deployment ${item.deploymentname}`"
        >
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
      </template>
    </div>

    <span
      tabindex="0"
      class="block p-2 text-left text-green font-bold cursor-pointer"
      @click="createDeployment"
      @keyup.enter="createDeployment"
    >
      + Add deployment
    </span>

    <portal to="modalBody" v-if="modal.show">
      <p>This deployment will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="modal.show">
      <footer class="flex flex-row-reverse justify-between">
        <v-button
          @click="confirmDeleteDeployment"
          color="bg-red-500 border border-red-500"
          textColor="text-white"
          text="Confirm"
        />
        <v-button
          @click="handleCloseModal"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Cancel"
        />
      </footer>
    </portal>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/Button'
import VInput from '@/components/VInput'
import Loading from '@/components/Loading'
import ProgramHeader from '@/components/ProgramHeader'

export default {
  computed: {
    ...mapState('deployments', {
      status: state => state.status,
      isDirty: state => state.dirty,
      deployments: state => state.items
    })
  },
  components: {
    VButton,
    VInput,
    Loading,
    ProgramHeader,
  },
  data: () => ({
    description: "You can modify your deployment details here. Enter component details after filling component tab.",
    modal: {
      show: false
    }
  }),
  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('deployments', [
      'fetchDeployments',
      'updateDeployment',
      'createDeployment',
      'removeDeployment',
      'setDeploymentDate',
    ]),
    handleOpenModal () {
      this.modal.show = true
      this.setModal('Delet Deployment')
    },
    handleCloseModal () {
      this.modal.show = false
      this.closeModal()
    },
    confirmDeleteDeployment() {
      this.removeDeployment()
      this.handleCloseModal()
    },
  }
}
</script>
