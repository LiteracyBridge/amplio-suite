<template>
  <section class="relative p-6 pt-0">
    <header class="w-full inline-flex items-center justify-between">
      <h2 class="visually_hidden">Recipients</h2>

      <VButton
        tag="span"
        label="+ Add Recipient"
        @click="onAddRecipient"
      />

      <div class="inline-flex">
        <form v-on:submit.prevent="fetchRecipients(programCode)">
          <v-input
            type="text"
            name="filterColumns"
            placeholder="Filter columns"
            iconRight="search"
            mx="mx-2"
            :value="filterText"
            @input="setFilterText($event.target.value)"
          />
        </form>
        <VButton
          tag="span"
          label="Reset Filter"
          :disabled="!tableIsFilter"
          @click="resetFilters"
        />
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
            <v-tooltip :width="150" :text="`Sort ${sortTable.descending ? 'Ascending' : 'Descending'}`">
              <button
                @click="setSortByColumn(col.key)"
                @keyup.enter="setSortByColumn(col.key)"
                @keyup.space="setSortByColumn(col.key)"
              >
                {{ col.label }}
                  <font-awesome-icon
                    v-if="sortTable.by === col.key"
                    :icon="sortTable.descending ? 'chevron-down' : 'chevron-up'"
                  />
              </button>
            </v-tooltip>
          </th>
          <th class="px-4 py-2 text-green border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(recipient, index) in filterRecipients"
          :key="recipient.id"
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
            <div class="flex gap-1">
              <VButton
                iconL="edit"
                :ariaLabel="`Edit recipient ${recipient.id}`"
                @click="onClickEdit(recipient.id)"
              />
              <VButton
                iconL="copy"
                :ariaLabel="`Copy recipient ${recipient.id}`"
                @click="onClickDuplicate(recipient.id)"
              />
              <VButton
                variant="warning"
                iconL="trash-alt"
                :ariaLabel="`Delete recipient ${recipient.id}`"
                @click="onClickDelete(recipient.id)"
              />
            </div>
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
        :recipient="recipient"
        :invalidConstraint="invalidConstraint"
        :invalidBeneficiaries="invalidBeneficiaries"
      />
    </portal>

    <portal to="modalFooter" v-if="showModal.edit">
      <footer v-if="recipient" class="flex justify-end gap-4">
        <VButton
          v-if="recipient.id"
          label="Discard"
          variant="warning"
          :disabled="!dirty"
          @click="onClickDiscard"
        />
        <VButton
          v-else
          label="Discard"
          variant="warning"
          :disabled="!dirty"
          @click="onClickDiscardNewRecipient"
        />
        <VButton
          type="success"
          label="Save"
          :disabled="!dirty || invalidConstraint || invalidBeneficiaries"
          @click="onClickSave"
        />
        <VButton
          v-if="recipient.id"
          label="Close"
          variant="success"
          :disabled="dirty"
          @click="onCloseModal"
        />
      </footer>
    </portal>

    <!-- Delete modal -->
    <portal to="modalBody" v-if="showModal.delete">
      <p class="text-xl">This recipient will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal.delete">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton
          label="Confirm"
          variant="warning"
          @click="confirmDeleteRecipient"
        />
        <VButton
          label="Cancel"
          @click="onCloseModal"
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
          @click="onClickEdit(selectedRecipientId)"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Close"
        />
      </footer>
    </portal>
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import VInput from '@/components/VInput'
import VButton from '@/components/VButton'
import VTooltip from '@/components/VTooltip'
import ProgramRecipientsForm from '@/components/ProgramRecipientsForm'
import { EventBus } from '@/event-bus'

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
    key: 'numTbs'
  }
]

export default {
  props: ['programCode'],
  computed: {
    ...mapState('recipients', [
      'status',
      'dirty',
      'sortTable',
      'filterText',
      'recipients',
    ]),
    ...mapGetters('recipients', [
      'filterRecipients',
    ]),
    recipient () {
      return this.recipients.find(reci => reci.id === this.selectedRecipientId)
    },
    tableIsFilter () {
      return this.sortTable.by !== '' || this.filterText !== ''
    },
    isFormFill () {
      if (!this.recipient) return null

      const requiredFields = [
        'region', 'district', 'communityName',
        'language', 'model', 'numTbs',
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

      const keys = ['numHouseholds', 'groupSize']
      keys.forEach(key => {
        const partial = this.recipient[key] > this.recipient.directBeneficiaries
        values.push(partial)
      })

      return values.some(Boolean)
    },
  },
  components: {
    VInput,
    VButton,
    VTooltip,
    ProgramRecipientsForm,
  },
  created () {
    this.fetchProgram(this.programCode)
    this.fetchRecipients(this.programCode)
    this.fetchDeployments(this.programCode)

    this.scroll()
    EventBus.$on('handleEscape', this.handleModalEscape)
  },
  beforeDestroy () {
    EventBus.$off('handleEscape', this.handleModalEscape)
  },
  data: () => ({
    selectedRecipientId: null,
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
    ...mapMutations('recipients', [
      'addRecipientsToShow',
    ]),
    ...mapActions('recipients', [
      'setSortByColumn',
      'setFilterText',
      'resetFilters',
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
        if (bottomOfWindow) this.addRecipientsToShow()
      }
    },
    async onAddRecipient () {
      const id = await this.addRecipient()
      this.onClickEdit(id)
    },
    onClickEdit (recipientId) {
      this.selectedRecipientId = recipientId
      this.onOpenModal('edit', 'Recipient Details')
    },
    async onClickDuplicate (recipientId) {
      this.selectedRecipientId = await this.copyRecipient(recipientId)
      this.onOpenModal('edit', 'Recipient Details')
    },
    onClickDelete (recipientId) {
      this.selectedRecipientId = recipientId
      this.onOpenModal('delete', 'Delete Recipient')
    },
    onClickSave () {
      this.onCloseModal()

      if (this.isFormFill) this.updateRecipient(this.selectedRecipientId)
      else this.onOpenModal('mandatory', 'Required Fields')
    },
    onClickDiscard () {
      this.onCloseModal()
      this.discardRecipient(this.selectedRecipientId)
    },
    onClickDiscardNewRecipient () {
      this.discardRecipient(this.selectedRecipientId)

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
      this.removeRecipient(this.selectedRecipientId)
      this.onCloseModal()
    },
    handleModalEscape () {
      if (this.recipient.id) this.onClickDiscard()
      else this.onClickDiscardNewRecipient()
    }
  }
}
</script>
