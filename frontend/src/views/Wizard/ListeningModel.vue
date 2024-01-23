<template>
  <Box
    :step="step"
    :prev="{ name: 'step-sdg' }"
    :next="{ name: 'step-deployments' }"
    title="Excellent! How will participants listen to TalkingBooks?"
  >
    <p class="text-2xl font-semibold">
      Choose your listening model. More information about types of listening models is provided below.
    </p>

    <div v-if="options.length > 0" class="grid grid-cols-5 gap-4 max-w-screen-lg mx-auto mt-4">
      <div
        v-for="opt in options"
        :key="opt.label"
        role="checkbox"
        tabindex="0"
        :aria-checked="listeningModels.includes(opt.label) ? 'true': 'false'"
        :aria-describedby="`listeningModels-${opt.label}`"
        class="relative cursor-pointer rounded border border-gray-500 s"
        @click="toggleListening({ listeningMode: opt.label, step })"
        @keyup.space="toggleListening({ listeningMode: opt.label, step })"
        @keyup.enter="clickOnButton"
      >
        <img
          :src="opt.imgUrl"
          :alt="opt.label"
          :class="listeningModels.includes(opt.label) ? 'opacity-25' : ''"
          class="block w-full"
        >
        <p :id="`listeningModels-${opt.label}`" class="text-blue">
          {{ opt.label }}
        </p>
        <Check
          v-if="listeningModels.includes(opt.label)"
          class="absolute top-41 left-41 w-8 h-8 text-amplio-green pointer-events-none"
        />
      </div>
    </div>
    <font-awesome-icon
      v-else
      icon="spinner"
      size="4x"
      pulse
      class="mx-auto w-20 h-20" />

    <div class="mt-4 p-6 text-left rounded border border-gray-500">
      <p>
        <strong>Households:</strong> Talking Books are rotated between
        families/households within a community.
      </p>

      <p class="pt-4">
        <strong>Groups:</strong> Talking Books are played at meetings of
        community groups such as Village Savings and Loan Associations (VSLAs),
        mothers groups, youth groups etc.
      </p>

      <p class="pt-4">
        <strong>Community workers:</strong> Talking Books are distributed
        to nurses/health volunteers and other community workers to
        support their work.
      </p>

      <p class="pt-4">
        <strong>Place-based:</strong> Talking Books remain in a location
        accessible to the community such as a classroom or a health
        center waiting room.
      </p>
    </div>
  </Box>
</template>

<script>
import { mapActions, mapState } from 'pinia'

import Box from '@/components/SetupBox.vue'
import Check from '@/assets/svg/check-circle.svg'
import listeningModels from '@/data/listeningModels.json'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  computed: {
      // The program's listening models
      ...mapState('programspec', {
          listeningModels: (state) => state.general.listening_models,
      }),
  },
  data: function() {
    return {
      options: listeningModels
    }
  },
  components: {
    Box,
    Check
  },
  methods: {
    ...mapActions('wizard', [
      'toggleListening'
    ]),
    clickOnButton () {
      document.getElementById('nextStep').click()
    }
  }
}
</script>
