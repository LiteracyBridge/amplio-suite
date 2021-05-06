<template>
  <section class="relative p-6 pt-0">
    <loading v-if="status === 'loading'" class="-ml-6 rounded-b-lg" />

    <program-header
      title="General"
      :dirty="dirty"
      :canSave="dirty"
      :description="description"
      :onSaveChanges="updateDeployments"
      :onDiscardChanges="() => fetchDeployments(programCode)"
    />

    <div class="block overflow-x-auto">
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th># Deployment</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
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
                :aria-label="`Start of deployment ${deployment.name}`"
                :value="deployment.start_date"
                @change="setDeploymentDate({ id: deployment.id, what: 'start_date', date: $event.target.value })"
                mx="mx-0 w-full"
              />
            </td>
            <td class="px-4 py-2 border-b">
              <v-input
                type="date"
                iconLeft="calendar-alt"
                :aria-label="`End of deployment ${deployment.name}`"
                :value="deployment.end_date"
                :min="deployment.start_date"
                @change="setDeploymentDate({ id: deployment.id, what: 'end_date', date: $event.target.value })"
                mx="mx-0 w-full"
              />
            </td>
            <td class="px-4 py-2 border-b">
              <VButton
                v-if="index === deployments.length - 1"
                variant="warning"
                iconL="trash-alt"
                :ariaLabel="`Delete deployment ${deployment.name}`"
                @click="handleOpenModal"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <VButton
      tag="span"
      label="+ Add Deployment"
      @click="createDeployment"
    />

    <portal to="modalBody" v-if="modal.show">
      <p>This deployment will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="modal.show">
      <footer class="flex flex-row-reverse justify-between">
        <VButton
          label="Confirm"
          variant="warning"
          @click="confirmDeleteDeployment"
        />
        <VButton
          label="Cancel"
          @click="handleCloseModal"
        />
      </footer>
    </portal>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/VButton'
import VInput from '@/components/VInput'
import Loading from '@/components/Loading'
import ProgramHeader from '@/components/ProgramHeader'

export default {
  props: ['programCode'],
  computed: {
    ...mapState('deployments', {
      status: 'status',
      dirty: 'dirty',
      deployments: 'deployments',
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
    description: "You can modify your deployment details here. ",
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
      'updateDeployments',
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
