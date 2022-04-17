<template>
  <main class="container mx-auto text-center">
    <h1 class="py-20 text-4xl text-blue font-semibold">
      Hello, <span class="capitalize">{{ user.name }}</span>, Welcome to the Amplio Suite!
    </h1>

    <font-awesome-icon
      v-if="programStatus === 'loading'"
      icon="spinner"
      size="4x"
      pulse
      class="mx-auto w-20 h-20" />

    <div v-else class="grid grid-cols-3 gap-10">
      <router-link :to="linkTo">
        <home-box img="/img/plan.png" alt="plan and prepare the programs" title="1. Program Specification">
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
      <a class="underline text-blue" href="https://downloads.amplio.org/software/index.html"> Click here </a>
      to download Amplio Software. Go to <router-link to="/download" class="underline text-blue">downloads </router-link> page to view other supporting applications.
    </p>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import HomeBox from '@/components/HomeBox'

export default {
  props: ['programId'],
  computed: {
    ...mapState('account', [
      'user'
    ]),
    ...mapState('program', {
      wizardCompleted: 'wizardCompleted',
      programStatus: state => state.status
    }),
    linkTo () {
      if (this.wizardCompleted || this.programId==='TEST') {
        return `${this.$route.path}/settings`
      } else {
        return `${this.$route.path}/wizard`
      }
    }
  },
  components: {
    HomeBox
  },
  watch: {
    '$route' () {
      this.fetchProgram(this.programId)
    }
  },
  created () {
    this.fetchProgram(this.programId)
  },
  methods: {
    ...mapActions('program', [
      'fetchProgram'
    ]),
  }
}
</script>
