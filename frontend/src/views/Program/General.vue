<template>
    <section class="relative min-h-200-px p-6 pt-0">
        <loading v-if="status !== 'success'" class="-ml-6 rounded-b-lg"/>

    <program-header
      title="General"
      :changed="changed"
      :canSave="changed"
      :description="description"
      :onSaveChanges="updateSpec"
      :onDiscardChanges="() => fetchSpec({programId:this.programId})"
    />

    <div class="min-h-200-px my-5 text-center">
        <!-- Separater line between heading and content -->
        <p class="-mx-6 mb-2 px-6 bg-gray-400 text-xl text-left border-2 border-gray-600"/>
        <div class="grid grid-cols-form-2 md:grid-cols-form-4 row-gap-2 items-center text-left">
        <label for="programName">Program Name</label>
        <v-input
          id="programName"
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

        <label class="md:pl-4" for="region">Region/State</label>
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

        <label class="md:pl-4" for="listeningModel">Listening Model</label>
        <multiselect
          v-if="listeningModelsOptions.length > 0"
          id="listeningModel"
          :options="listeningModelsOptions"
          :value="listeningModelsSelected"
          :multiple="true"
          label="label"
          trackBy="label"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          @select="(model) => toggleListeningModel(model.label)"
          @remove="(model) => toggleListeningModel(model.label)"
          placeholder="Select the listening model"
        />
        <font-awesome-icon
          v-else
          icon="spinner"
          size="2x"
          pulse
          class="block w-10 h-10 mt-2 text-left" />

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
        class="grid grid-cols-form-2 md:grid-cols-form-4 row-gap-2 items-center text-left pl-10"
      >
        <p class="col-span-2 md:col-span-4 text-sm text-blue">
          The direct beneficiaries properties apply to the Recipients tab, and allow to gather custom information regarding the recipients
        </p>
        <template v-for="(opt, index) in directBeneficiariesLabels">
          <span
            :key="`${opt.key}-label`"
            :class="index % 2 === 1 ? 'md:pl-4' : ''"
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
            :class="index % 2 === 1 ? 'md:pl-4' : ''"
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
import listeningModels from '@/data/listeningModels.json'

export default {
  props: ['programId'],
  computed: {
      ...mapState('programspec', {
          'status': (state)=>state.status,

          'programName': (state)=>state.general.name,
          'country': (state)=>state.general.country,
          'region': (state)=>state.general.region,
          'languages': (state)=>state.general.languages,
          'listeningModels': (state)=>state.general.listening_models,
      }),
    ...mapGetters('programspec', [
      'labelUsed',
        'directBeneficiariesLabels',
        'directBeneficiariesAdditionalLabels',
    ]),
    listeningModelsOptions() {
      return listeningModels;
    },
    listeningModelsSelected () {
      /**
       * Given a listening model label from the program, find the corresponding global listening model object.
       * @param programListeningModel label to be found.
       * @returns the global object, or a local object with the image from "Other" if not found.
       */
      function lmo(programListeningModel) {
        let found = listeningModels.find(lm => lm.label === programListeningModel);
        if (!found) found = {
          label: programListeningModel,
          imgUrl: "https://amplio-suite.s3-us-west-2.amazonaws.com/img/listening/Other.png"
        };
        return found;
      }
      let result = [];
      if (this) {
        // return a list of this program's listening models, mapped to the global listening model descriptions.
        this.listeningModels.forEach((programListeningModel) => {
          let found = lmo(programListeningModel);
          if (result.indexOf(found) < 0) result.push(found);
        });
      }
      return result;
    },
    changed () {
      return this.$store.state.programspec.changed;
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
      this.fetchLanguages();
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
    ...mapActions('programspec', [
        'ensureSpec',
        'fetchSpec',
        'updateSpec',

        'setProgramName',

        'setCountry',
        'addRegion',
        'removeRegion',
        'setLanguages',
        'deleteLanguage',
        'toggleListeningModel',
        'setDirectBeneficiariesLabel',
        'setDirectBeneficiariesAdditionalLabel',
        'addDirectBeneficiariesAdditionalLabel',
        'deleteDirectBeneficiariesAdditionalLabel',
    ]),
    ...mapActions('languages', [
      'fetchLanguages',
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
  },

}
</script>
