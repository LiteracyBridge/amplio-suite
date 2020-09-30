<template>
  <section class="relative p-6 pt-0">
    <header>
      <h2 class="visually_hidden">Recipients</h2>

      <div>
        <font-awesome-icon icon="exclamation-circle" class="w-6 h-6 text-gray-500" />
        <span class="mx-4 text-lg text-blue">
          You can modify your recipients details on this page. All fields with an asterisk are required.
          The optional fields are recommended for reporting.
        </span>

        <span
          tabindex="0"
          @click="onAddRecipient"
          class="block pl-4 text-left text-green font-bold cursor-pointer"
        >
          + Add Recipient
        </span>
      </div>
    </header>

    <table class="w-full table-auto">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-2 text-green border-b"
          >
            {{ col.label }}
          </th>
          <th class="px-4 py-2 text-green border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(recipient, index) in recipients"
          :key="index"
          :class="index % 2 === 0 ? '' : 'bg-gray-200'"
          class="hover:bg-gray-400"
        >
          <td
            v-for="col in columns"
            :key="`${index}-${col.key}`"
            class="px-4 py-2 border-b"
          >
            {{ recipient[col.key] }}
          </td>
          <td class="px-4 border-b">
            <button
              class="icon-zoom-xl"
              @click="onClickEdit(index)"
            >
              <font-awesome-icon icon="edit" />
            </button>
            <button
              class="mx-3 icon-zoom-xl"
              @click="onClickDuplicate(index)"
            >
              <font-awesome-icon icon="copy" />
            </button>
            <button
              class="text-red-500 icon-zoom-xl"
              @click="onClickDelete(index)"
            >
              <font-awesome-icon icon="trash-alt" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <font-awesome-icon
      v-if="status === 'loading'"
      icon="spinner"
      size="3x"
      pulse
      class="mx-auto w-20 h-20"
    />

    <!-- Edit modal -->
    <portal to="modalBody" v-if="showModal.edit">
      <program-recipients-form
        :recipientIndex="selectedRecipientIndex"
        :recipient="recipient"
        :invalidConstraint="invalidConstraint"
        :invalidBeneficiaries="invalidBeneficiaries"
      />
    </portal>

    <portal to="modalFooter" v-if="showModal.edit">
      <footer v-if="recipient" class="flex justify-end gap-4">
        <v-button
          v-if="recipient.id"
          @click="onClickDiscard"
          :color="dirty ? 'bg-transparent text-red-500 border border-red-500' : 'bg-gray-400 text-white'"
          textColor="text-black"
          text="Discard"
        />
        <v-button
          v-else
          @click="onClickDiscardNewRecipient"
          :color="dirty ? 'bg-transparent text-red-500 border border-red-500' : 'bg-gray-400 text-white'"
          textColor="text-black"
          text="Discard"
        />
        <v-button
          @click="onClickSave"
          :color="!dirty || invalidConstraint || invalidBeneficiaries ? 'bg-gray-400 text-white' : 'text-white bg-green'"
          textColor="text-black"
          text="Save"
        />
        <v-button
          v-if="recipient.id"
          @click="onCloseModal"
          :color="dirty ? 'bg-gray-400 text-white' : 'bg-transparent border border-black'"
          textColor="text-black"
          text="Close"
        />
      </footer>
    </portal>

    <!-- Delete modal -->
    <portal to="modalBody" v-if="showModal.delete">
      <p class="text-xl">This recipient will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal.delete">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <v-button
          @click="confirmDeleteRecipient"
          color="bg-red-500 border border-red-500"
          textColor="text-white"
          text="Confirm"
        />
        <v-button
          @click="onCloseModal"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Cancel"
        />
      </footer>
    </portal>

    <!-- Mandatory fields modal -->
    <portal to="modalBody" v-if="showModal.mandatory">
      <p class="text-xl">Please complete all of the mandatory fields.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal.mandatory">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <v-button
          @click="onClickEdit(selectedRecipientIndex)"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Close"
        />
      </footer>
    </portal>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/Button'
import ProgramRecipientsForm from '@/components/ProgramRecipientsForm'

const columns = [
  {
    label: 'Region/State',
    key: 'region'
  },
  {
    label: 'District/County',
    key: 'district'
  },
  {
    label: 'Community',
    key: 'communityName'
  },
  {
    label: 'Group',
    key: 'groupName'
  },
  {
    label: 'Agent',
    key: 'agent'
  },
  {
    label: 'Language',
    key: 'language'
  },
  {
    label: '# TBs',
    key: 'numberTalkingBooks'
  }
]

export default {
  props: ['programCode'],
  computed: {
    ...mapState('recipients', [
      'status',
      'dirty',
      'recipients',
    ]),
    recipient () {
      return this.recipients[this.selectedRecipientIndex]
    },
    isFormFill () {
      if (!this.recipient) return null

      const requiredFields = [
        'region', 'district', 'communityName',
        'language', 'listeningModel', 'numberTalkingBooks',
        'deployments', 'directBeneficiaries'
      ]

      const partial = requiredFields.map(key => {
        const value = this.recipient[key]
        if (typeof value === 'string' || value instanceof String) return value !== ''
        else if (typeof value === 'number') return value >= 0
        else if (Array.isArray(value)) return value.length > 0
      })

      return partial.every(Boolean)
    },
    invalidConstraint () {
      if (!this.recipient) return null

      const options = this.recipients
        .map(recipient => `${recipient.communityName}-${recipient.groupName}-${recipient.agent}`)
      const option = `${this.recipient.communityName}-${this.recipient.groupName}-${this.recipient.agent}`

      return options.filter(opt => opt === option).length > 1
    },
    invalidBeneficiaries () {
      if (!this.recipient) return null

      const values = Object.values(this.recipient.directBeneficiariesAdditional)
        .map(val => val > this.recipient.directBeneficiaries)

      const keys = ['households', 'groupSize']
      keys.forEach(key => {
        const partial = this.recipient[key] > this.recipient.directBeneficiaries
        values.push(partial)
      })

      return values.some(Boolean)
    },
  },
  components: {
    VButton,
    ProgramRecipientsForm,
  },
  created () {
    this.fetchProgram(this.programCode)
    this.fetchRecipients(this.programCode)
    this.fetchDeployments(this.programCode)
  },
  data: () => ({
    selectedRecipientIndex: null,
    columns,
    showModal: {
      edit: false,
      delete: false,
      mandatory: false
    },
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
    ]),
    ...mapActions('recipients', [
      'fetchRecipients',
      'updateRecipient',
      'addRecipient',
      'copyRecipient',
      'removeRecipient',
      'discardRecipient',
    ]),
    scroll () {
      window.onscroll = () => {
        const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= ( document.documentElement.offsetHeight - 50)
        if (bottomOfWindow) this.fetchRecipients(this.programCode)
      }
    },
    onAddRecipient () {
      this.addRecipient()

      const index = this.recipients.length - 1
      this.onClickEdit(index)
    },
    onClickEdit (index) {
      this.selectedRecipientIndex = index
      this.onOpenModal('edit', 'Recipient Details')
    },
    onClickDuplicate (index) {
      this.copyRecipient(index)

      index = this.recipients.length - 1
      this.selectedRecipientIndex = index
      this.onOpenModal('edit', 'Recipient Details')
    },
    onClickDelete (index) {
      this.selectedRecipientIndex = index
      this.onOpenModal('delete', 'Delete Recipient')
    },
    onClickSave () {
      this.onCloseModal()

      if (this.isFormFill) this.updateRecipient(this.selectedRecipientIndex)
      else this.onOpenModal('mandatory', 'Required Fields')
    },
    onClickDiscard () {
      this.onCloseModal()
      this.discardRecipient(this.selectedRecipientIndex)
    },
    onClickDiscardNewRecipient () {
      this.discardRecipient(this.selectedRecipientIndex)

      this.showModal.edit = false
      this.showModal.delete = false
      this.showModal.mandatory = false
      this.closeModal()
    },
    onOpenModal (modal, title) {
      this.showModal[modal] = true
      this.setModal(title)
    },
    onCloseModal () {
      if (this.invalidBeneficiaries || this.invalidConstraint) return

      this.showModal.edit = false
      this.showModal.delete = false
      this.showModal.mandatory = false
      this.closeModal()

      if (!this.isFormFill && this.recipient.id) {
        this.onOpenModal('edit', 'Recipient Details')
      }
    },
    confirmDeleteRecipient () {
      this.removeRecipient(this.selectedRecipientIndex)
      this.onCloseModal()
    }
  }
}
</script>
