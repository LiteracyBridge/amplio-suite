<template>
  <main class="container mx-auto text-center">
    <h1 class="py-20 text-4xl text-blue font-semibold">
      Welcome to Amplio <span class="capitalize">{{ user.name }}</span>!
    </h1>

    <div class="grid grid-cols-3 gap-10">
      <router-link :to="linkTo">
        <home-box img="/img/plan.png" alt="plan and prepare the programs" title="1. Plan and Prepare">
          Define your requirements and complete/modify the program specification document.
        </home-box>
      </router-link>

      <a href="https://amplio.moodlecloud.com/" target="_blank">
        <home-box img="/img/learning.png" alt="Go to the learning portal" title="2. Learning Portal">
          Access learning portal, job aids and community of practice
        </home-box>
      </a>

      <a href="https://dashboard.amplio.org/" target="_blank">
        <home-box img="/img/analytics.png" alt="Go to the dashboard portal" title="3. Analytics Dashboard">
          Monitor user engagement and feedback through the Amplio Dashboard
        </home-box>
      </a>
    </div>

    <p class="mt-10 text-lg">
      <router-link to="/download" class="underline text-blue">Click here</router-link>
      to download required tools and supporting applications.
    </p>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import HomeBox from '@/components/HomeBox'

export default {
  components: {
    HomeBox
  },
  methods: {
    ...mapActions('program', [
      'fetchProgram'
    ]),
  },
  watch: {
    'codeNameId': {
      handler (newVal) {
        if (newVal) { // check if userid is available
        this.fetchProgram(newVal)
        }
      },
      immediate: true // make this watch function is called when component created
    }
  },
  computed: {
    ...mapState('wizard', {
      wizardActualStep: 'actualStep',
      wizardIsComplete: 'isComplete'
    }),
    ...mapState('account', [
      'user'
    ]),
    ...mapState('program', [
      'codeNameId'
    ]),
    linkTo() {
      if (!this.wizardIsComplete) {
        return `${this.$route.path}/wizard/step-${this.wizardActualStep}`
      } else {
        return `${this.$route.path}/settings`
      }
    }
  }
}
</script>
