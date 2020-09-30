<template>
  <section class="relative p-6 pt-0">
    <loading v-if="status === 'loading'" class="-ml-6 rounded-b-lg" />

    <program-header
      title="General"
      :isDirty="isDirty"
      :description="description"
      :onSaveChanges="updateDeployment"
      :onDiscardChanges="() => fetchDeployments(programCode)"
    />

    <table class="w-full table-auto">
      <thead>
        <tr>
          <th class="px-4 py-2 text-green border-b"># Deployment</th>
          <th class="px-4 py-2 text-green border-b">Start Date</th>
          <th class="px-4 py-2 text-green border-b">End Date</th>
          <th class="px-4 py-2 text-green border-b">Components</th>
          <th class="px-4 py-2 text-green border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(deployment, index) in deployments"
          :key="index"
          :class="index % 2 === 0 ? '' : 'bg-gray-200'"
          class="hover:bg-gray-400"
        >
          <td class="px-4 py-2 border-b">
            Deployment {{ index + 1 }}
          </td>
          <td class="px-4 py-2 border-b">
            <v-input
              type="date"
              iconLeft="calendar-alt"
              :aria-label="`Start of deployment ${deployment.deploymentname}`"
              :value="deployment.startdate"
              @change="setDeploymentDate({ id: deployment.deploymentname, what: 'startdate', date: $event.target.value })"
              mx="mx-0 w-full"
            />
          </td>
          <td class="px-4 py-2 border-b">
            <v-input
              type="date"
              iconLeft="calendar-alt"
              :aria-label="`End of deployment ${deployment.deploymentname}`"
              :value="deployment.enddate"
              :min="deployment.startDate"
              @change="setDeploymentDate({ id: deployment.deploymentname, what: 'enddate', date: $event.target.value })"
              mx="mx-0 w-full"
            />
          </td>
          <td class="px-4 py-2 border-b">
            <select
              :aria-label="`Components of the deployment ${deployment.deploymentname}`"
              class="w-full my-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
            >
              <option value="">All</option>
            </select>
          </td>
          <td class="px-4 py-2 border-b">
            <button
              v-if="index === deployments.length - 1"
              @click="handleOpenModal"
              :aria-label="`Delete deployment ${deployment.deploymentname}`"
            >
              <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <span
      tabindex="0"
      class="block p-2 text-left text-blue-hover-hunder"
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
  props: ['programCode'],
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
  created () {
    this.fetchProgram(this.programCode)
    this.fetchDeployments(this.programCode)
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
    ...mapActions('program', [
      'fetchProgram',
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
