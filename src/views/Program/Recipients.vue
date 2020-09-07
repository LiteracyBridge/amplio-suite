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
      </div>
    </header>

    <table class="w-full table-auto">
      <thead>
        <tr>
          <th
            v-for="col in cols"
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
            v-for="col in cols"
            :key="`${index}-${col.key}`"
            class="px-4 py-2 border-b"
          >
            {{ recipient[col.key] }}
          </td>
          <td class="px-4 border-b">
            <button
              class="mr-3 icon-zoom-xl"
              @click="onClickEdit(index)"
            >
              <font-awesome-icon icon="edit" />
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
        v-if="recipients.length > 0"
        :recipientIndex="selectedRecipientIndex"
        :recipient="recipient"
      />
    </portal>

    <portal to="modalFooter" v-if="showModal.edit">
      <footer class="flex flex-row-reverse justify-between">
        <v-button
          @click="onCloseModal"
          color="bg-transparent border border-black"
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
    <portal to="modalBody" v-if="showModal">
      <p class="text-xl">Please complete all of the mandatory fields.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal.mandatory">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <v-button
          @click="onCloseModal"
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

const cols = [
  {
    label: 'Region',
    key: 'region'
  },
  {
    label: 'District',
    key: 'district'
  },
  {
    label: 'Community',
    key: 'community'
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
    ]),
    recipients: {
      get () {
        return this.$store.state.recipients.recipients
      },
      set (value) {
        this.setRecipients(value)
      }
    },
    recipient () {
      return this.recipients[this.selectedRecipientIndex]
    },
    isFormFill () {
      const requiredFields = [
        'country', 'region', 'district', 'communityName',
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
  },
  components: {
    VButton,
    ProgramRecipientsForm,
  },
  data: () => ({
    selectedRecipientIndex: 0,
    cols,
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
    ...mapActions('recipients', [
      'updateRecipients',
      'fetchRecipients',
      'setRecipients',
      'addRecipient',
      'removeRecipient',
    ]),
    scroll () {
      window.onscroll = () => {
        const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= ( document.documentElement.offsetHeight - 50)
        if (bottomOfWindow) this.fetchRecipients(this.programCode)
      }
    },
    onClickEdit (index) {
      this.selectedRecipientIndex = index
      this.onOpenModal('edit', 'Recipient Details')
    },
    onClickDelete (index) {
      this.selectedRecipientIndex = index
      this.onOpenModal('delete', 'Delete Recipient')
    },
    onOpenModal (modal, title) {
      this.showModal[modal] = true
      this.setModal(title)
    },
    onCloseModal () {
      this.showModal.edit = false
      this.showModal.delete = false
      this.showModal.mandatory = false
      this.closeModal()
    },
    confirmDeleteRecipient () {
      this.removeRecipient(this.selectedRecipientIndex)
      this.onCloseModal()
    }
  }
}
</script>
