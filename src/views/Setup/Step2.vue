<template>
  <Box
    :prev="{ name: 'Step-1' }"
    :next="{ name: 'Step-3' }"
    title="Help us understand more about your program."
  >
    <p id="sdg" class="text-2xl font-semibold">
      Which Sustainable Development Goals (SDGs) does your program
      work towards? Select/Deselect all that apply.
    </p>

    <div
      aria-labelledby="sdg"
      class="grid grid-cols-6 gap-4 max-w-screen-lg mx-auto mt-4">
      <div
        v-for="(opt, index) in options"
        :key="index"
        role="checkbox"
        tabindex="0"
        :aria-checked="goals.includes(opt) ? 'true': 'false'"
        :aria-describedby="`goal-${index + 1}`"
        class="relative s"
        @click="toggleGoal(opt)"
        @keyup.space="toggleGoal(opt)"
        @keyup.enter="clickOnButton"
      >
        <img
          :src="`/img/goals/Goal-${index + 1}.png`"
          :alt="opt.replace(/ /g, ' ')"
          :class="goals.includes(opt) ? 'opacity-25' : ''"
          class="block w-full cursor-pointer"
        >
        <p :id="`goal-${index + 1}`" class="visually_hidden">{{ opt.replace(/ /g, ' ') }}</p>
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
        'no_poverty', 'zero_hunger', 'good_health_and_well _being',
        'quality_education', 'gender_equality', 'clean_water_and_sanitation',
        'affordable_and_clean_energy', 'decent_work_and_economic_growth',
        'industry, innovation_and_infrastructure', 'reduced_inequalities',
        'sustainable_cities_and_communities',
        'responsible_consumption_and_production',
        'climate_action', 'life_below_water', 'life_on_land',
        'peace, justice_and_strong_institutions',
        'parternship_for_the_goals'
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
    ]),
    clickOnButton () {
      document.getElementById('nextStep').click()
    }
  }
}
</script>
