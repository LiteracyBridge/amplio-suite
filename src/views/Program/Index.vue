<template>
  <main class="container mx-auto text-center">
    <div class="py-6 px-4 flex justify-start">
      <h1 class="text-2xl text-blue">{{ programName }} Program</h1>
    </div>

    <nav aria-label="Program sections" class="flex">
      <component
        v-for="section in sections"
        :key="section.name"
        :is="section.disabled ? 'span' : 'router-link'"
        :to="section.disabled ? '' : `/program/${section.name}`"
        :class="[
          $route.path.endsWith(section.name) ? 'bg-green text-white' : 'text-black',
          section.disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        class="py-2 px-4 uppercase text-lg">
        {{ section.name }}
      </component>
    </nav>

     <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>

    <footer class="py-6">
      Need help? Contact us on <a class="text-blue" href="mailto:support@amplio.org">support@amplio.org</a>
    </footer>

    <v-modal v-model="isModalOpen">
      <section>
        <header class="my-4">
          <h2 class="text-2xl text-bold">Save the change</h2>
        </header>

        <div class="pt-6 pb-20 text-xl">
          <p>Save or discard the change before continue.</p>
        </div>

        <footer class="flex justify-end">
          <v-button @click="isModalOpen = false" text="Ok" />
        </footer>
      </section>
    </v-modal>
  </main>
</template>

<script>
import { mapState } from 'vuex'

import VButton from '@/components/Button'
import VModal from '@/components/VModal'

export default {
  name: 'Program',
  components: {
    VButton,
    VModal
  },
  computed: {
    ...mapState('program', {
      programName: state => state.general.programName
    })
  },
  data () {
    return {
      sections: [
        { name: 'general' },
        { name: 'deployments' },
        { name: 'content', disabled: true },
        { name: 'recipients', disabled: true }
      ],

      transitionName: 'slide-left',
      isModalOpen: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    const toName = to.path.split('/')[2]
    const fromName = from.path.split('/')[2]
    const sections = this.sections.map(section => section.name)
    this.transitionName = sections.indexOf(toName) < sections.indexOf(fromName) ? 'slide-right' : 'slide-left'
    const dirty = this.$store.state.program[fromName].dirty

    // Check if the data is save
    if (dirty) {
      this.isModalOpen = true
      next(false)
    } else {
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
    const fromName = from.path.split('/')[2]
    const dirty = this.$store.state.program[fromName].dirty

    // Check if the data is save
    if (dirty) {
      this.isModalOpen = true
      next(false)
    } else {
      next()
    }
  }
}
</script>