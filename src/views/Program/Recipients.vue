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
          :key="recipient.title"
          :class="index % 2 === 0 ? 'hover:bg-gray-200' : 'bg-gray-200 hover:bg-gray-300'"
        >
          <td
            v-for="col in cols"
            :key="`${recipient.title}-${col.key}`"
            class="px-4 py-2 border-b"
          >
            {{ recipient[col.key] }}
          </td>
          <td class="px-4 py-2 border-b">
            <button
              class="mr-3 icon-zoom-xl"
              @click="onClickEdit(index)"
            >
              <font-awesome-icon icon="edit" />
            </button>
            <button
              class="text-red-500 icon-zoom-xl"
            >
              <font-awesome-icon icon="times" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <portal to="modalBody" v-if="showModal.edit">
      <program-recipients-form
        v-if="recipients.length > 0"
        :recipientIndex="selectedRecipientIndex"
        :recipient="recipient"
      />
    </portal>

    <!-- For modal components -->
    <portal to="modalBody" v-if="showModal">
      <p>Please complete all of the mandatory fields.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal.mandatory">
      <footer class="flex flex-row-reverse justify-between">
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
        'country', 'region', 'district', 'community',
        'language', 'listeningModels', 'numberTalkingBooks',
        'deployments', 'directBeneficiaries'
      ]

      const partial = requiredFields.map(key => {
        const value = this.recipient[key]
        if (typeof value === 'string' || value instanceof String) return value !== ''
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
    onClickEdit (index) {
      this.selectedRecipientIndex = index
      this.onOpenModal('edit', 'Recipient Details')
    },
    onOpenModal (modal, title) {
      this.showModal[modal] = true
      this.setModal(title)
    },
    onCloseModal () {
      this.showModal.edit = false
      this.showModal.mandatory = false
      this.closeModal()
    },
  }
}
</script>
