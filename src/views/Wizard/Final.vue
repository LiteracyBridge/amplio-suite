<template>
  <box
    ref="box"
    :step="step"
    :next="next"
    nextLabel="Go to program specification"
    title="Thank you! We automatically updated the Program Specification based
    on your responses. Please complete the remaining details."
  >
    <router-link
      v-if="status === 'success'"
      :to="{ name: 'roadmap', params: { programCode }}"
      class="pt-5 text-blue text-2xl font-semibold underline"
    >
      View launch check list or go to program specification.
    </router-link>

    <p
      v-if="status === 'error'"
      class="pt-5 text-2xl font-semibold"
    >
      This Wizard can't be stored because there's no related project. Please contact Amplio's staff.
    </p>
  </box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  components: {
    Box
  },
  computed: {
    ...mapState('wizard', {
      wizarsIsComplete: 'isComplete'
    }),
    ...mapState('program', [
      'status'
    ]),
    ...mapState('programData', [
      'programCode'
    ]),
    next () {
      if (['loading', 'error'].includes(this.status)) return ''
      else  return`/programs/${this.programCode}/settings`
    }
  },
  async created () {
    if (!this.wizarsIsComplete) {
    this.addCompletedStep(this.step)
      this.setWizardIsCompleted()
      this.createProgram()

      await this.fetchRoadmap()
      await this.toggleStep(1)
      await this.updateRoadmap()
    }
  },
  methods: {
    ...mapActions('program', [
      'createProgram'
    ]),
    ...mapActions('wizard', {
      setWizardIsCompleted: 'setIsCompleted',
      addCompletedStep: 'addCompletedStep'
    }),
    ...mapActions('roadmap', [
      'fetchRoadmap',
      'updateRoadmap',
      'toggleStep'
    ]),
  }
}
</script>
