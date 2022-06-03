<template>
  <Box
    :step="step"
    :prev="{ name: 'step-geo' }"
    :next="{ name: 'step-listening-model' }"
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
        :key="goal.goalId"
        role="checkbox"
        tabindex="0"
        :aria-checked="goals.includes(goal.goalId) ? 'true': 'false'"
        :aria-describedby="`goal-${goal.goalId}`"
        class="relative s"
        @click="toggleGoal({ goal: goal.goalId, step })"
        @keyup.space="toggleGoal({ goal: goal.goalId, step })"
        @keyup.enter="onEnterPressed"
      >
        <img
          :src="goal.imgUrl"
          :alt="goal.goal"
          :class="goals.includes(goal.goalId) ? 'opacity-25' : ''"
          class="block w-full cursor-pointer"
        >
        <p :id="`goal-${goal.goalId}`" class="visually_hidden">{{ goal.goal }}</p>
        <Check
          v-if="goals.includes(goal.goalId)"
          class="absolute top-41 left-41 w-8 h-8 text-amplio-green pointer-events-none"
        />
      </div>
    </div>
    <font-awesome-icon
      v-else
      icon="spinner"
      size="4x"
      pulse
      class="mx-auto w-20 h-20"/>
  </Box>
</template>

<script>
import {mapActions, mapState} from 'vuex'

import Box from '@/components/SetupBox'
import Check from '@/assets/svg/check-circle.svg'
import sustainableDevelopmentGoals from '@/data/sustainableDevelopmentGoals.json'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      options: sustainableDevelopmentGoals,
    }
  },
  computed: {
    // The selected goals are placed here.
    ...mapState('programData', [
      'goals'
    ]),
  },
  components: {
    Box,
    Check
  },
  methods: {
    ...mapActions('wizard', [
      'toggleGoal'
    ]),
    onEnterPressed() {
      document.getElementById('nextStep').click()
    }
  }
}
</script>
