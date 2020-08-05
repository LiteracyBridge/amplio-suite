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
       v-if="options.length > 0"
      aria-labelledby="sdg"
      class="grid grid-cols-6 gap-4 max-w-screen-lg mx-auto mt-4">
      <div
        v-for="goal in options"
        :key="goal.id"
        role="checkbox"
        tabindex="0"
        :aria-checked="goals.includes(goal.id) ? 'true': 'false'"
        :aria-describedby="`goal-${goal.id}`"
        class="relative s"
        @click="toggleGoal(goal.id)"
        @keyup.space="toggleGoal(goal.id)"
        @keyup.enter="clickOnButton"
      >
        <img
          :src="`/img/goals/Goal-${goal.id}.png`"
          :alt="goal.label"
          :class="goals.includes(goal.id) ? 'opacity-25' : ''"
          class="block w-full cursor-pointer"
        >
        <p :id="`goal-${goal.id}`" class="visually_hidden">{{ goal.label }}</p>
        <Check
          v-if="goals.includes(goal.id)"
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
