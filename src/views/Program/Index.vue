<template>
  <main class="container mx-auto text-center">
    <div class="py-6 px-4 flex justify-start">
      <h1 class="text-2xl text-blue">{{ programName }} Program</h1>
    </div>

    <nav aria-label="Program sections" class="flex">
      <router-link
        v-for="section in sections"
        :key="section"
        :to="`/programs/${programCode}/settings/${section}`"
        :class="$route.path.endsWith(section) ? 'bg-green text-white' : 'text-black'"
        class="py-2 px-4 uppercase text-lg">
        {{ section }}
      </router-link>
    </nav>

     <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>

    <footer class="py-6">
      Need help? Contact us on <a class="text-blue" href="mailto:support@amplio.org">support@amplio.org</a>
    </footer>

    <!-- For modal components -->
    <portal to="modalBody" v-if="isModalOpen">
      <p class="text-xl">Save or discard the change before continue.</p>
    </portal>

    <portal to="modalFooter" v-if="isModalOpen">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <v-button @click="handleCloseModal" text="Ok" />
      </footer>
    </portal>
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import VButton from '@/components/Button'

import { fetchData } from '@/utils'

export default {
  name: 'Program',
  props: ['programCode'],
  components: {
    VButton,
  },
  computed: {
    ...mapState('program', [
      'programName',
    ]),
    ...mapGetters('uiSettings', [
      'tabStatus'
    ])
  },
  watch: {
    '$route': 'fetchAllData'
  },
  data () {
    return {
      sections: ['general', 'deployments', 'content', 'recipients'],

      transitionName: 'slide-left',
      isModalOpen: false
    }
  },
  created () {
    this.fetchAllData()
  },
  beforeRouteUpdate (to, from, next) {
    const sTo = to.path.split('/')
    const sFrom = from.path.split('/')
    const toName = sTo[sTo.length - 1]
    const fromName = sFrom[sFrom.length - 1]

    const sections = this.sections.map(section => section.name)
    this.transitionName = sections.indexOf(toName) < sections.indexOf(fromName) ? 'slide-right' : 'slide-left'

    // Check if the data is save
    if (this.tabStatus[fromName]) {
      this.handleOpenModal()
      next(false)
    } else {
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
    const sFrom = from.path.split('/')
    const fromName = sFrom[sFrom.length - 1]

    // Check if the data is save
    if (this.tabStatus[fromName]) {
      this.handleOpenModal()
      next(false)
    } else {
      next()
    }
  },
  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    handleOpenModal () {
      this.isModalOpen = true
      this.setModal('Save or discard the change')
    },
    handleCloseModal () {
      this.isModalOpen = false
      this.closeModal()
    },
    fetchAllData () {
      fetchData(this.programCode)
    }
  },
}
</script>
