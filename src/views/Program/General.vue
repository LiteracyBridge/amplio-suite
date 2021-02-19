<template>
  <section class="relative p-6 pt-0">
    <loading v-if="status === 'loading'" class="-ml-6 rounded-b-lg" />

    <program-header
      title="General"
      :dirty="dirty"
      :canSave="dirty"
      :description="description"
      :onSaveChanges="updateProgram"
      :onDiscardChanges="() => fetchProgram(this.programCode)"
    />

    <div class="min-h-200-px my-5 text-center">
      <div class="grid grid-cols-content-message row-gap-2 items-center text-left">
        <label for="programName">Program Name</label>
        <v-input
          ref="programName"
          name="programName"
          type="text"
          placeholder="Enter Program Name"
          :value="programName"
          @input="(event) => setProgramName(event.target.value)"
          mx="mx-0"
          class="w-full"
        />

        <span class="col-span-2" />

        <label for="country">Country</label>
        <multiselect
          id="country"
          :value="country"
          :options="countries"
          placeholder="Select one country"
          aria-label="Select one country"
          @select="setCountry"
        />

        <label class="pl-4" for="region">Region/State</label>
        <multiselect
          id="region"
          tag-placeholder="Add this as new region"
          placeholder="Search or add a region"
          :value="region"
          :options="regionOptions"
          :multiple="true"
          :taggable="true"
          @tag="addTag"
          @select="addRegion"
          @remove="removeRegion"
        >
          <template slot="noOptions">
            Region/State
          </template>
        </multiselect>

        <span id="langs">Languages</span>
        <LanguagesSelector
          :languages="this.languages"
          :onLanguageSelected="this.onLanguageSelected"
          :onLanguageDeleted="this.onLanguageDeleted"
        />

        <label class="pl-4" for="listeningModel">Listening Model</label>
        <multiselect
          id="listeningModel"
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

        <label for="partner">Partner</label>
        <v-input
          name="partner"
          type="text"
          :value="partner"
          mx="mx-0"
          class="w-full"
          @input="setPartner($event.target.value)"
        />

        <label class="pl-4" for="affiliate">Affiliate</label>
        <v-input
          name="affiliate"
          type="text"
          :value="affiliate"
          mx="mx-0"
          class="w-full"
          @input="setAffiliate($event.target.value)"
        />
      </div>

      <div class="w-full inline-flex items-center mt-10 text-left">
        <span class="font-bold mr-4">Direct Beneficiaries</span>
        <VButton
          tag="span"
          :label="beneficiariesIsOpen ? 'Hide Details' : 'Show Details'"
          :iconR="beneficiariesIsOpen ? 'chevron-up' : 'chevron-down'"
          @click="beneficiariesIsOpen = !beneficiariesIsOpen"
        />
      </div>

      <div
        :class="beneficiariesIsOpen ? 'visible' : 'hidden'"
        class="grid grid-cols-content-message row-gap-2 items-center text-left px-6"
      >
        <p class="col-span-4 text-sm text-blue">
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
            @input="setDirectBeneficiariesLabel({ key: opt.key, value: $event.target.value })"
            mx="mx-0"
            class="w-full"
          />
        </template>

        <span class="col-span-2" />

        <template v-for="(opt, index) in directBeneficiariesAdditionalLabels">
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
              @input="setDirectBeneficiariesAdditionalLabel({ key: opt.key, value: $event.target.value })"
              mx="mx-0 mr-2"
              class="w-full"
            />

            <VButton
              variant="warning"
              iconL="trash-alt"
              :disabled="labelUsed.includes(opt.key)"
              :ariaLabel="`Delete option field ${opt.value}`"
              @click="deleteDirectBeneficiariesAdditionalLabel(opt.key)"
            />

            <v-tooltip
              v-if="labelUsed.includes(opt.key)"
              text="Field used in multiple recipients"
              class="my-auto"
            >
              <font-awesome-icon
                class="text-orange-600"
                icon="exclamation-circle"
              />
            </v-tooltip>
          </div>
        </template>

        <div class="col-span-4">
          <VButton
            tag="span"
            label="+ Add Optional Field"
            @click="addDirectBeneficiariesAdditionalLabel"
          />
        </div>
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="languageToDelete">
      <p>This language will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="languageToDelete">
      <footer class="flex flex-row-reverse justify-between">
        <VButton
          label="Confirm"
          variant="warning"
          @click="confirmLanguageDeletion"
        />
        <VButton
          label="Cancel"
          @click="cancelLanguageDeletion"
        />
      </footer>
    </portal>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Multiselect from 'vue-multiselect'
import VButton from '@/components/VButton'
import VInput from '@/components/VInput'
import VTooltip from '@/components/VTooltip'
import LanguagesSelector from '@/components/LanguagesSelector'
import Loading from '@/components/Loading'
import ProgramHeader from '@/components/ProgramHeader'

import countries from '@/data/countries.json'

export default {
  props: ['programCode'],
  computed: {
    ...mapState('program', [
      'status',
      'programName'
    ]),
    ...mapState('programData', [
      'country',
      'region',
      'partner',
      'affiliate',
      'languages',
      'listeningModels',
    ]),
    ...mapGetters('recipients', [
      'labelUsed'
    ]),
    ...mapState('programData', {
      directBeneficiariesLabels: state => Object.keys(state.directBeneficiariesMap)
        .map(key => ({ key, value: state.directBeneficiariesMap[key] })),
      directBeneficiariesAdditionalLabels: state => Object.keys(state.directBeneficiariesAdditionalMap)
        .map(key => ({ key, value: state.directBeneficiariesAdditionalMap[key] })),
    }),
    ...mapState('listeningModels', {
      listeningModelsOptions: state => state.listeningModels
    }),
    listeningModelsSelected () {
      return this.listeningModels
        .map(id => this.listeningModelsOptions.find(opt => opt.id === id))
    },
    dirty () {
      return this.$store.state.program.dirty || this.$store.state.programData.dirty
    },
  },
  components: {
    VButton,
    VInput,
    VTooltip,
    Multiselect,
    LanguagesSelector,
    Loading,
    ProgramHeader,
  },
  created () {
    this.fetchProgram(this.programCode)
    this.fetchRecipients(this.programCode)
    this.fetchListeningModels()
  },
  watch: {
    region: {
      immediate: true,
      handler () {
        this.regionOptions = [...this.region] // Populete the options
      }
    },
  },
  data () {
    return {
      description: "You can modify your program name and languages here.<br>You can also rename existing fields and add additional fields for  “Recipients> Direct Beneficiaries“",

      countries,
      regionOptions: [],
      languageToDelete: null,
      beneficiariesIsOpen: false
    }
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
      'setCountry',
      'addRegion',
      'removeRegion',
      'setPartner',
      'setAffiliate',
      'setLanguages',
      'deleteLanguage',
      'toggleListening',
      'setDirectBeneficiariesLabel',
      'setDirectBeneficiariesAdditionalLabel',
      'addDirectBeneficiariesAdditionalLabel',
      'deleteDirectBeneficiariesAdditionalLabel',
    ]),
    ...mapActions('recipients', [
      'fetchRecipients',
    ]),
    ...mapActions('listeningModels', [
      'fetchListeningModels',
    ]),
    addTag (region) {
      this.addRegion(region)
    },
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
    spam () {
      console.log('nuevo click')
    }
  }
}
</script>
