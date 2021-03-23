<template>
  <box
    ref="box"
    :step="step"
    :next="next"
    nextLabel="Go to program specification"
    :title="title"
  >
    <div v-if="status !== 'loading'">
      <router-link
        v-if="status === 'success'"
        :to="{ name: 'roadmap', params: { programCode }}"
        class="pt-5 text-blue text-2xl font-semibold underline"
      >
        View launch check list.
      </router-link>

      <p
        v-if="status === 'error'"
        class="pt-5 text-2xl font-semibold"
      >
        Your changes cannot be saved to this project. Please contact Amplio's staff at support@amplio.org.
      </p>
    </div>
    <font-awesome-icon
      v-else
      icon="spinner"
      size="4x"
      pulse
      class="mx-auto w-20 h-20"
    />
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
    title () {
      if (['loading', 'error'].includes(this.status)) return ''
      else return 'Thank you! We automatically updated the Program Specification based on your responses. Please complete the remaining details.'
    },
    next () {
      if (['loading', 'error'].includes(this.status)) return ''
      else  return`/programs/${this.programCode}/settings`
    }
  },
  async created () {
    if (!this.wizarsIsComplete) {
    this.addCompletedStep(this.step)
      this.setWizardIsCompleted()
      await this.createProgram()
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
  }
}
</script>
