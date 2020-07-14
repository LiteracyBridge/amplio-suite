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
        :to="section.disabled ? '' : `/programs/${programCode}/settings/${section.name}`"
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

    <v-modal v-model="isModalOpen" title="Save the change">
      <p>Save or discard the change before continue.</p>

      <template v-slot:footer>
        <v-button @click="isModalOpen = false" text="Ok" />
      </template>
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
      programName: state => state.general.programName,
      programCode: 'programCode'
    })
  },
  data () {
    return {
      sections: [
        { name: 'general' },
        { name: 'deployments' },
        { name: 'content' },
        { name: 'recipients', disabled: true }
      ],

      transitionName: 'slide-left',
      isModalOpen: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    const sTo = to.path.split('/')
    const sFrom = from.path.split('/')
    const toName = sTo[sTo.length - 1]
    const fromName = sFrom[sFrom.length - 1]

    const sections = this.sections.map(section => section.name)
    this.transitionName = sections.indexOf(toName) < sections.indexOf(fromName) ? 'slide-right' : 'slide-left'
    const dirty = this.$store.state.programData[fromName].dirty

    // Check if the data is save
    if (dirty) {
      this.isModalOpen = true
      next(false)
    } else {
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
    const sFrom = from.path.split('/')
    const fromName = sFrom[sFrom.length - 1]
    const dirty = this.$store.state.programData[fromName].dirty

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
