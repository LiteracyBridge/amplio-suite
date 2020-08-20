<template>
  <box
    :httpStatus="status"
    :isDirty="dirty"
    title="recipients"
    help="You can modify your recipients details on this page. All fields with an asterisk are required. The optional fields are recommended for reporting."
  >
    <div class="grid" style="grid-template-columns: 1fr 4fr;">
      <program-side-menu
        name="recipient"
        v-model="recipients"
        :on-select="(index) => { this.selectedRecipientIndex = index }"
        :on-add="addRecipient"
        :on-remove="removeRecipient"
        :selected-index="selectedRecipientIndex"
      />

      <div class="text-left">
        <program-recipients-form
          v-if="recipients.length > 0"
          :recipientIndex="selectedRecipientIndex"
          :recipient="recipient"
        />
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="showModal">
      <p>Please complete all of the mandatory fields.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal">
      <footer class="flex flex-row-reverse justify-between">
        <v-button
          @click="onCloseModal"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Close"
        />
      </footer>
    </portal>
  </box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

import VButton from '@/components/Button'
import Box from '@/components/ProgramBox'
import ProgramSideMenu from '@/components/ProgramSideMenu'
import ProgramRecipientsForm from '@/components/ProgramRecipientsForm'

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
    Box,
    ProgramSideMenu,
    ProgramRecipientsForm,
  },
  data: () => ({
    selectedRecipientIndex: 0,

    showModal: false
  }),
  mounted (){
    eventBus.$on('save-crud-data', () => {
      if (this.isFormFill) this.updateRecipients()
      else this.onOpenModal()
    }),
    eventBus.$on('discard-crud-data', () => {
      this.fetchRecipients()
    })
  },
  beforeDestroy () {
    eventBus.$off('save-crud-data')
    eventBus.$off('discard-crud-data')
  },
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
    onOpenModal () {
      this.showModal = true
      this.setModal('Required Fields')
    },
    onCloseModal () {
      this.showModal = false
      this.closeModal()
    },
  }
}
</script>
