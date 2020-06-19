<template>
  <box
    title="General"
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

      <p id="deployments" class="px-4">Number of Deployments</p>
      <v-input
        type="number"
        ref="deployments"
        aria-labelledby="deployments"
        placeholder="Number of Deployments"
        :value="amountDeployments"
        mx="mx-0"
      />

      <p id="langs" class="px-4">Languages</p>
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
            aria-labelledby="lang"
            placeholder="Choose language"
            mx="mx-0"
          />
          <button @click="isModalOpen = true">
            <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
          </button>
        </div>

        <span
          tabindex="0"
          class="mt-4 p-2u font-semibold cursor-pointer"
        >
          + Add language
        </span>
      </div>
    </div>

    <v-modal v-model="isModalOpen">
      <section>
        <header class="my-4">
          <h2 class="text-2xl text-bold">Delete Deployment</h2>
        </header>

        <div class="pt-6 pb-20 text-xl">
          <p>This deployment will be deleted.</p>
        </div>

        <footer class="flex justify-between">
          <v-button @click="isModalOpen = false" text="Ok" />
        </footer>
      </section>
    </v-modal>
  </box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/ProgramBox'
import VButton from '@/components/Button'
import VInput from '@/components/VInput'
import VModal from '@/components/VModal'

export default {
  computed: {
    ...mapState('program', {
      programName: state => state.general.programName,
      amountDeployments: state => state.deployments.amount,
      languages: state => state.general.languages,
      amountOfLang: state => state.general.amountOfLang
    })
  },
  components: {
    Box,
    VButton,
    VInput,
    VModal
  },
  data () {
    return {
      isModalOpen: false
    }
  },
  methods: {
    ...mapActions('program', [
      'setProgramName'
    ])
  }
}
</script>