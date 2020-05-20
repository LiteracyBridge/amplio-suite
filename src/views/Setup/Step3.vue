<template>
  <Box
    prev="Step-2"
    next="Step-4"
    title="Excellent! How will participants listen to TalkingBooks?"
  >
    <p class="text-2xl font-semibold">
      Choose your listening model. More information about types of listening models is provided below.
    </p>

    <div class="grid grid-cols-4 gap-4 max-w-screen-md mx-auto mt-4">
      <div
        v-for="(opt, index) in options"
        :key="index"
        class="relative cursor-pointer rounded border border-gray-500"
        @click="toggleListening(opt.value)"
      >
        <img
          :src="`/img/listening/${opt.label}.png`"
          :class="listeningModels.includes(opt) ? 'opacity-25' : ''"
          class="block w-full hover:opacity-25"
        >
        <p :class="listeningModels.includes(opt) ? 'opacity-25' : ''" class="text-blue">
          {{ opt.label }}
        </p>
        <Check
          v-if="listeningModels.includes(opt)"
          class="absolute top-41 left-41 w-8 h-8 text-green pointer-events-none"
        />
      </div>
    </div>

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
import { mapActions, mapState } from 'vuex'

import Box from '@/components/SetupBox'
import Check from '@/assets/svg/check-circle.svg'

export default {
  computed: {
    ...mapState([
      'listeningModels'
    ])
  },
  data () {
    return {
      options: [
        { label: 'Households', value: 'households' },
        { label: 'Groups', value: 'groups' },
        { label: 'Community Workers', value: 'community_workers' },
        { label: 'Place-based', value: 'place_based' }
      ]
    }
  },
  components: {
    Box,
    Check
  },
  methods: {
    ...mapActions([
      'toggleListening'
    ])
  }
}
</script>
