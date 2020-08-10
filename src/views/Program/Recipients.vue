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
      />

      <div class="text-left">
        <program-recipients-form
          v-if="recipients.length > 0"
          :recipientIndex="selectedRecipientIndex"
          :recipient="recipients[selectedRecipientIndex]"
        />
      </div>
    </div>
  </box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

import Box from '@/components/ProgramBox'
import ProgramSideMenu from '@/components/ProgramSideMenu'
import ProgramRecipientsForm from '@/components/ProgramRecipientsForm'

export default {
  computed: {
    ...mapState('recipients', [
      'status',
      'dirty',
      'recipients',
    ]),
  },
  components: {
    Box,
    ProgramSideMenu,
    ProgramRecipientsForm,
  },
  data: () => ({
    selectedRecipientIndex: 0
  }),
  mounted (){
    eventBus.$on('save-crud-data', () => {
      this.updateRecipients()
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
    ...mapActions('recipients', [
      'updateRecipients',
      'fetchRecipients',
      'addRecipient',
      'removeRecipient',
    ]),
  }
}
</script>
