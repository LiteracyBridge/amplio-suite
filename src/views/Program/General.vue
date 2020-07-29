<template>
  <box
    :httpStatus="status"
    :isDirty="programDirty || programDataDirty"
    title="general"
    help="You can modify your program name, total number of deployments and languages here"
  >
    <div class="grid grid-cols-program items-center gap-2 text-left">
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

      <p id="langs" class="h-full px-4 pt-4">Languages</p>
      <LanguagesSelector
        :languages="this.languages"
        :onLanguageSelected="this.onLanguageSelected"
        :onLanguageDeleted="this.onLanguageDeleted"
      />
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
import { mapState, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

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
    ]),
    ...mapState('program', {
      programDirty: state => state.dirty
    }),
    ...mapState('programData', {
      programDataDirty: state => state.dirty
    }),
  },
  components: {
    Box,
    VButton,
    VInput,
    LanguagesSelector,
  },
  data () {
    return {
      languageToDelete: null
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
