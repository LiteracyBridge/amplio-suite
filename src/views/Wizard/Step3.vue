<template>
  <Box
    :prev="{ name: 'Step-2' }"
    :next="{ name: 'Step-4' }"
    title="Help us understand more about your program."
  >
    <p id="sdg" class="text-2xl font-semibold">
      Which Sustainable Development Goals (SDGs) does your program
      work towards? Select/Deselect all that apply.
    </p>

    <div
       v-if="options.length > 0"
      aria-labelledby="sdg"
      class="grid grid-cols-6 gap-4 max-w-screen-lg mx-auto mt-4">
      <div
        v-for="goal in options"
        :key="goal.section"
        role="checkbox"
        tabindex="0"
        :aria-checked="goals.includes(goal.section) ? 'true': 'false'"
        :aria-describedby="`goal-${goal.section}`"
        class="relative s"
        @click="toggleGoal(goal.section)"
        @keyup.space="toggleGoal(goal.section)"
        @keyup.enter="clickOnButton"
      >
        <img
          :src="goal.imgUrl"
          :alt="goal.label"
          :class="goals.includes(goal.section) ? 'opacity-25' : ''"
          class="block w-full cursor-pointer"
        >
        <p :id="`goal-${goal.section}`" class="visually_hidden">{{ goal.label }}</p>
        <Check
          v-if="goals.includes(goal.section)"
          class="absolute top-41 left-41 w-8 h-8 text-green pointer-events-none"
        />
      </div>
    </div>
    <font-awesome-icon
      v-else
      icon="spinner"
      size="4x"
      pulse
      class="mx-auto w-20 h-20" />
  </Box>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import Box from '@/components/SetupBox'
import Check from '@/assets/svg/check-circle.svg'

export default {
  computed: {
    ...mapState('programData', [
      'goals'
    ]),
    ...mapState('sustainableDevelopments', {
      options: state => state.goals
    }),
  },
  mounted () {
    this.fetchSustainableDevelopments()
  },
  components: {
    Box,
    Check
  },
  methods: {
    ...mapActions('sustainableDevelopments', [
      'fetchSustainableDevelopments'
    ]),
    ...mapActions('wizard', [
      'toggleGoal'
    ]),
    clickOnButton () {
      document.getElementById('nextStep').click()
    }
  }
}
</script>
