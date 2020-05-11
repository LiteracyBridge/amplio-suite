<template>
  <Box
    prev="Step-1"
    next="Step-3"
    title="Help us understand more about your program."
  >
    <p class="text-2xl font-semibold">
      Which Sustainable Development Goals (SDGs) does your program
      work towards? Select all that apply.
    </p>

    <div class="grid grid-cols-6 gap-4 max-w-screen-lg mx-auto mt-4">
      <div v-for="(opt, index) in options" :key="index" class="relative">
        <img
          :src="`/img/goals/Goal-${index + 1}.png`"
          :class="goals.includes(opt) ? 'opacity-25' : ''"
          class="block w-full cursor-pointer hover:opacity-25"
          @click="toggleGoal(opt)"
        >
        <Check
          v-if="goals.includes(opt)"
          class="absolute top-41 left-41 w-8 h-8 text-green pointer-events-none"
        />
      </div>
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
      'goals'
    ])
  },
  data () {
    return {
      options: [
        'No Poverty', 'Zero Hunger', 'Good health and well being',
        'Quality education', 'Gender Equality', 'Clean water and sanitation',
        'Affordable and clean energy', 'Decent work and economic growth',
        'Industry, innovation and infrastructure', 'Reduced inequalities',
        'Sustainable cities and communities',
        'Responsible consumption and production',
        'Climate action', 'Life below water', 'Life on land',
        'Peace, justice and strong institutions',
        'Parternship for the goals'
      ]
    }
  },
  components: {
    Box,
    Check
  },
  methods: {
    ...mapActions([
      'toggleGoal'
    ])
  }
}
</script>
