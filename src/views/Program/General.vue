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
      <div>
        <div
          v-for="index in amountOfLang"
          :key="index"
          class="flex"
        >
          <v-input
            :ref="`lang_${index}`"
            :value="languages[index]"
            type="text"
            aria-labelledby="langs"
            placeholder="Choose language"
            @input="(event) => setLanguages({ lang: event.target.value, index })"
            mx="mx-0"
          />
          <button @click="handleOpenModal" aria-label="Delete language">
            <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
          </button>
        </div>

        <span
          tabindex="0"
          class="mt-4 p-2u text-green font-bold cursor-pointer"
          @click="addInput"
          @keyup.enter="addInput"
        >
          + Add language
        </span>
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="showModal">
      <p>This language will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal">
      <footer class="flex flex-row-reverse justify-between">
        <v-button
          @click="handleCloseModal"
          color="bg-red-500 border border-red-500"
          textColor="text-white"
          text="Confirm"
        />
        <v-button
          @click="handleCloseModal"
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

export default {
  computed: {
    ...mapState('program', [
      'status',
      'programCode',
      'programName'
    ]),
    ...mapState('programData', [
      'languages',
      'amountOfLang'
    ]),
    ...mapState('program', {
      programDirty: state => state.dirty
    }),
    ...mapState('programData', {
      programDataDirty: state => state.dirty
    })
  },
  components: {
    Box,
    VButton,
    VInput,
  },
  data () {
    return {
      showModal: false
    }
  },
  mounted (){
    eventBus.$on('save-crud-data', () => {
      this.updateProgram()
    }),
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
      'addLangInput',
    ]),
    handleOpenModal () {
      this.showModal = true
      this.setModal('Delet Language')
    },
    handleCloseModal () {
      this.showModal = false
      this.closeModal()
    },
    async addInput () {
      await this.addLangInput()
      const key = `lang_${this.amountOfLang}`
      this.$refs[key][0].$el.children[0].focus()
    }
  }
}
</script>
