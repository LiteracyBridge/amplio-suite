<template>
  <box
    :httpStatus="status"
    :isDirty="programDirty || programDataDirty"
    title="general"
    :help="help"
  >
    <div class="grid grid-cols-content-message row-gap-2 items-center text-left">
      <p id="programName">Program</p>
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

      <p id="langs">Languages</p>
      <LanguagesSelector
        :languages="this.languages"
        :onLanguageSelected="this.onLanguageSelected"
        :onLanguageDeleted="this.onLanguageDeleted"
      />

      <span class="pl-4">Region/State</span>
      <multiselect
        class="multi"
        tag-placeholder="Add this as new region"
        placeholder="Search or add a region"
        :value="region"
        :options="regionsOptions"
        :multiple="true"
        :taggable="true"
        @tag="addTag"
        @select="addRegion"
        @remove="removeRegion"
      />

      <span>Direct Beneficiaries</span>
      <span
        tabindex="0"
        :class="beneficiariesIsOpen ? 'underline font-semibold' : ''"
        class="w-48 ml-2 p-2 text-blue cursor-pointer hover:underline hover:font-semibold"
        @click="beneficiariesIsOpen = !beneficiariesIsOpen"
      >
        {{ beneficiariesIsOpen ? 'Hide Details' : 'Show Details' }}
        <font-awesome-icon :icon="beneficiariesIsOpen ? 'chevron-up' : 'chevron-down'" />
      </span>
    </div>

    <div
      :class="beneficiariesIsOpen ? 'visible' : 'hidden'"
      class="grid grid-cols-content-message row-gap-2 items-center text-left"
    >
      <p class="px-4 col-span-4 text-sm">
        The direct beneficiaries properties apply to the Recipients tab, and allow to gather custom information regarding the recipients
      </p>
      <template v-for="(opt, index) in directBeneficiariesLabels">
        <span
          :key="`${opt.key}-label`"
          :class="index % 2 === 1 ? 'pl-4' : ''"
        >
          Field {{ index + 1 }}
        </span>
        <v-input
          :key="`${opt.key}-input`"
          type="text"
          :value="opt.value"
          @input="setRecipientsLabelMap({ key: opt.key, value: $event.target.value })"
          mx="mx-0"
        />
      </template>

      <template v-for="(opt, index) in additionalLabels">
        <span
          :key="`${opt.key}-label`"
          :class="index % 2 === 1 ? 'pl-4' : ''"
        >
          Additional Field {{ index + 1 }}
        </span>
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
      'region',
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
  watch: {
    region: {
      immediate: true,
      handler () {
        if (this.regionsOptions.length === 0) {
          this.regionsOptions = [...this.region]
        }
      }
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
      help: "ou can modify your program name and languages here. You can also rename existing fields and add additional fields for  “Recipients> Direct Beneficiaries“",
      regionsOptions: [],
      languageToDelete: null,
      beneficiariesIsOpen: false,
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
      'addRegion',
      'removeRegion',
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
    addTag (newTag) {
      this.regionsOptions.push(newTag)
      this.addRegion(newTag)
    },
  }
}
</script>
