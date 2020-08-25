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
        @select="(model) => toggleListening(model.id)"
        @remove="(model) => toggleListening(model.id)"
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
      <template v-for="(opt, index) in directBeneficiariesLabels">
        <span :key="`${opt.key}-label`">Field {{ index + 1 }}</span>
        <v-input
          :key="`${opt.key}-input`"
          type="text"
          :value="opt.value"
          @input="setRecipientsLabelMap({ key: opt.key, value: $event.target.value })"
          mx="mx-0"
        />
      </template>

      <template v-for="(opt, index) in additionalLabels">
        <span :key="`${opt.key}-label`">Additional Field {{ index + 1 }}</span>
        <div :key="`${opt.key}-input`" class="flex items-center">
          <v-input
            type="text"
            :value="opt.value"
            @input="setAdditionalLabel({ key: opt.key, value: $event.target.value })"
            mx="mx-0"
          />

          <button
            :aria-label="`Delete option field ${opt.value}`"
            :class="labelUsed[opt.key].used ? 'text-grey-500' : 'text-red-500'"
            class="w-6 h-6 ml-2 icon-zoom"
            @click="deleteAdditionalLabel(opt.key)"
          >
            <font-awesome-icon icon="trash-alt" />
          </button>

          <v-tooltip
            v-if="labelUsed[opt.key].used"
            :text="`Field used in ${labelUsed[opt.key].recipients.join(' - ')}`"
            class="my-auto"
          >
            <font-awesome-icon
              class="text-orange-600"
              icon="exclamation-circle"
            />
          </v-tooltip>
        </div>
      </template>

      <span
        tabindex="0"
        class="block mt-4 pr-4 text-green cursor-pointer hover:underline hover:font-semibold"
        @click="addAdditionalLabel"
      >
        + Add Optional Field
      </span>
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
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

import Multiselect from 'vue-multiselect'
import Box from '@/components/ProgramBox'
import VButton from '@/components/Button'
import VInput from '@/components/VInput'
import VTooltip from '@/components/VTooltip'
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
    ...mapGetters('recipients', [
      'labelUsed'
    ]),
    ...mapState('recipients', {
      additionalLabels: state => Object.keys(state.additionalLabelsMap)
        .map(key => ({ key, value: state.additionalLabelsMap[key] })),
      directBeneficiariesLabels: state => Object.keys(state.labelMap)
        .map(key => ({ key, value: state.labelMap[key] }))
    }),
    ...mapState('listeningModels', {
      listeningModelsOptions: state => state.listeningModels
    }),
    ...mapState('program', {
      programDirty: state => state.dirty
    }),
    ...mapState('programData', {
      programDataDirty: state => state.dirty
    }),
    listeningModelsSelected () {
      return this.listeningModels
        .map(id => this.listeningModelsOptions.find(opt => opt.id === id))
    }
  },
  components: {
    Box,
    VButton,
    VInput,
    VTooltip,
    Multiselect,
    LanguagesSelector,
  },
  data () {
    return {
      languageToDelete: null,
    }
  },
  mounted (){
    this.fetchListeningModels()

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
    ...mapActions('listeningModels', [
      'fetchListeningModels'
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
    ...mapActions('recipients', [
      'addAdditionalLabel',
      'setAdditionalLabel',
      'deleteAdditionalLabel'
    ]),
    onLanguageSelected(language) {
      let index = this.languages.length
      this.setLanguages({ lang: language.code, index })
    },
    onLanguageDeleted(language) {
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
