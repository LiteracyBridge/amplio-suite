<template>
  <section class="relative p-6 pt-0">
    <loading v-if="isRequestLoading" class="-ml-6 rounded-b-lg" />

    <program-header
      title="General"
      :isDirty="isDirty"
      :description="description"
      :onSaveChanges="updateProgram"
      :onDiscardChanges="() => fetchProgram(this.programCode)"
    />

    <div class="min-h-200-px my-5 text-center">
      <div class="grid grid-cols-content-message row-gap-2 items-center text-left">
        <span id="programName">Program</span>
        <v-input
          type="text"
          ref="programName"
          aria-labelledby="programName"
          placeholder="Enter Program Name"
          :value="programName"
          @input="(event) => setProgramName(event.target.value)"
          mx="mx-0"
          class="w-full"
        />

        <span class="col-span-2" />

        <span>Country</span>
        <multiselect
          :value="country"
          :options="countries"
          placeholder="Select one country"
          @select="setCountry"
        />

        <span class="pl-4">Region</span>
        <multiselect
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
      </div>

      <div class="w-full inline-flex items-center mt-10 text-left">
        <span class="font-bold">Direct Beneficiaries</span>
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
            @input="setRecipientsLabelMap({ key: opt.key, value: $event.target.value })"
            mx="mx-0"
            class="w-full"
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
              class="w-full"
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

        <div class="col-span-4">
          <span
            tabindex="0"
            class="block mt-4 pr-4 text-green cursor-pointer hover:underline hover:font-semibold"
            @click="addAdditionalLabel"
          >
            + Add Optional Field
          </span>
        </div>
      </div>
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
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Multiselect from 'vue-multiselect'
import VButton from '@/components/Button'
import VInput from '@/components/VInput'
import VTooltip from '@/components/VTooltip'
import LanguagesSelector from '@/components/LanguagesSelector'
import Loading from '@/components/Loading'
import ProgramHeader from '@/components/ProgramHeader'

import countries from '@/data/countries.json'

export default {
  computed: {
    ...mapState('program', [
      'programCode',
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
    ...mapState('listeningModels', {
      listeningModelsOptions: state => state.listeningModels
    }),
    listeningModelsSelected () {
      return this.listeningModels
        .map(id => this.listeningModelsOptions.find(opt => opt.id === id))
    },
    isDirty () {
      return this.$store.state.program.dirty || this.$store.state.programData.dirty
    },
    isRequestLoading () {
      return [
        this.$store.state.program.status,
        this.$store.state.programData.status,
        this.$store.state.recipients.status,
        this.$store.state.languages.status,
        this.$store.state.listeningModels.status,
      ].every(status => status === 'loading')
    }
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
  data () {
    return {
      description: "You can modify your program name and languages here.<br>You can also rename existing fields and add additional fields for  “Recipients> Direct Beneficiaries“",

      countries,
      regionOptions: [],
      languageToDelete: null,
      beneficiariesIsOpen: false
    }
  },
  mounted () {
    this.regionOptions = [...this.region] // Populete the options
    this.fetchListeningModels()
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
    addTag (region) {
      this.regionOptions.push(region)
      this.addRegion({ region, step: this.step })
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
  }
}
</script>
