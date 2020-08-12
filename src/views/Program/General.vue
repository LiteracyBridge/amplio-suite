<template>
  <box
    :httpStatus="status"
    :isDirty="programDirty || programDataDirty"
    title="general"
    help="You can modify your program name, total number of deployments and languages here"
  >
    <div class="grid grid-cols-content-message row-gap-2 items-center">
      <p id="programName" class="px-4">Program</p>
      <v-input
        type="text"
        ref="programName"
        aria-labelledby="programName"
        placeholder="Enter Program Name"
        :value="programName"
        @input="(event) => setProgramName(event.target.value)"
        mx="mx-0"
      />

      <span class="pl-4">Listening Model</span>
      <multiselect
        :options="listeningModelsOptions"
        :value="listeningModelsSelected"
        :multiple="true"
        label="label"
        trackBy="label"
        :close-on-select="false"
        :clear-on-select="false"
        :preserve-search="true"
        @select="(model) => toggleListening(model.value)"
        @remove="(model) => toggleListening(model.value)"
        placeholder="Select the listening model"
      />

      <p id="langs" class="h-full px-4 pt-4">Languages</p>
      <LanguagesSelector
        :languages="this.languages"
        :onLanguageSelected="this.onLanguageSelected"
        :onLanguageDeleted="this.onLanguageDeleted"
      />
    </div>

    <div class="my-2 p-4 text-left text-xl bg-gray-400">
      <p>Direct Beneficiaries Fields</p>
    </div>

    <div class="grid grid-cols-content-message row-gap-2 items-center">
      <template v-for="(opt, index) in recipientsLabels">
        <span :key="`${opt.key}-label`">Field {{ index + 1 }}</span>
        <v-input
          :key="`${opt.key}-input`"
          type="text"
          :value="opt.value"
          @input="setRecipientsLabelMap({ key: opt.key, value: $event.target.value })"
          mx="mx-0"
        />
      </template>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="languageToDelete">
      <p>This language will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="languageToDelete">
      <footer class="flex flex-row-reverse justify-between">
        <v-button
          @click="confirmLanguageDeletion"
          color="bg-red-500 border border-red-500"
          textColor="text-white"
          text="Confirm"
        />
        <v-button
          @click="cancelLanguageDeletion"
          color="bg-transparent border border-black"
          textColor="text-black"
          text="Cancel"
        />
      </footer>
    </portal>
  </box>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

import Multiselect from 'vue-multiselect'
import Box from '@/components/ProgramBox'
import VButton from '@/components/Button'
import VInput from '@/components/VInput'
import LanguagesSelector from '@/components/LanguagesSelector'

export default {
  computed: {
    ...mapState('program', [
      'status',
      'programCode',
      'programName'
    ]),
    ...mapState('programData', [
      'languages',
      'listeningModels',
    ]),
    ...mapState('recipients', {
      recipientsLabels: state => Object.keys(state.labelMap)
        .map(key => ({ key, value: state.labelMap[key] }))
    }),
    ...mapState('program', {
      programDirty: state => state.dirty
    }),
    ...mapState('programData', {
      programDataDirty: state => state.dirty
    }),
    listeningModelsSelected () {
      return this.listeningModels
        .map(key => this.listeningModelsOptions.find(opt => opt.value === key))
    }
  },
  components: {
    Box,
    VButton,
    VInput,
    Multiselect,
    LanguagesSelector,
  },
  data () {
    return {
      languageToDelete: null,

      // FIXME The listening models options is use here and in the wizard
      // Move the options to a lambda function
      listeningModelsOptions: [
        { label: 'Households', value: 'households' },
        { label: 'Groups', value: 'groups' },
        { label: 'Community Workers', value: 'community_workers' },
        { label: 'Place-based', value: 'place_based' }
      ]
    }
  },
  mounted (){
    eventBus.$on('save-crud-data', () => {
      this.updateProgram()
    })
    eventBus.$on('discard-crud-data', () => {
      this.fetchProgram(this.programCode)
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
    ...mapActions('program', [
      'fetchProgram',
      'updateProgram',
      'setProgramName',
    ]),
    ...mapActions('programData', [
      'setLanguages',
      'deleteLanguage',
      'toggleListening',
    ]),
    ...mapMutations('recipients', [
      'setRecipientsLabelMap'
    ]),
    onLanguageSelected(language) {
      let index = this.languages.length
      this.setLanguages({ lang: language, index })
    },
    onLanguageDeleted(_languageCode, language) {
      this.languageToDelete = language
      this.setModal(`Delete Language ${language.name}`)
    },
    confirmLanguageDeletion() {
      this.deleteLanguage(this.languageToDelete.code)
      this.languageToDelete = null
      this.closeModal()
    },
    cancelLanguageDeletion () {
      this.languageToDelete = null
      this.closeModal()
    },
  }
}
</script>
