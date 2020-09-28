<template>
  <main class="container mx-auto text-center">
    <div class="py-6 flex justify-between">
      <h1 class="text-2xl text-blue capitalize">{{ programName }} Program</h1>

      <v-button
        :color="anyTabDirty ? 'bg-gray-400' : 'bg-blue'"
        text="Submit"
        @click="onSubmit"
      />
    </div>

    <div class="bg-white rounded-lg shadow-box">
      <nav aria-label="Program sections" class="flex border-b">
        <router-link
          v-for="(section, index) in sections"
          :key="section"
          :to="`/programs/${programCode}/settings/${section}`"
          :class="[$route.path.endsWith(section) ? 'bg-green text-white' : 'text-black', index === 0 ? 'rounded-tl-lg' : '']"
          class="p-4 text-lg uppercase hover:bg-green hover:text-white">
          {{ section }}
        </router-link>
      </nav>

      <transition :name="transitionName" mode="out-in">
        <router-view />
      </transition>
    </div>

    <footer class="py-6">
      Need help? Contact us on <a class="text-blue" href="mailto:support@amplio.org">support@amplio.org</a>
    </footer>

    <v-snackbars :show.sync="showSnackbar" label="The program was successfully deployed" />

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
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/Button'
import VSnackbars from '@/components/VSnackbars'

export default {
  name: 'Program',
  props: ['programCode'],
  components: {
    VButton,
    VSnackbars,
  },
  computed: {
    ...mapState('program', [
      'programName',
    ]),
    anyTabDirty () {
      const partial = [
        this.$store.state.program.dirty,
        this.$store.state.programData.dirty,
        this.$store.state.deployments.dirty,
        this.$store.state.content.dirty,
        this.$store.state.recipients.dirty
      ]

      return partial.some(Boolean)
    },
  },
  data () {
    return {
      sections: ['general', 'deployments', 'content', 'recipients'],

      transitionName: 'slide-left',
      isModalOpen: false,
      showSnackbar: false,
    }
  },
  beforeRouteUpdate (to, from, next) {
    const sTo = to.path.split('/')
    const sFrom = from.path.split('/')
    const toName = sTo[sTo.length - 1]
    const fromName = sFrom[sFrom.length - 1]

    const sections = this.sections.map(section => section.name)
    this.transitionName = sections.indexOf(toName) < sections.indexOf(fromName) ? 'slide-right' : 'slide-left'

    // Check if the data is save
    if (this.anyTabDirty) {
      this.handleOpenModal()
      next(false)
    } else {
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
    // Check if the data is save
    if (this.anyTabDirty) {
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
    ...mapActions('program', [
      'deployProgram',
    ]),
    async onSubmit () {
      const result = await this.deployProgram()
      if (result === 'success') this.showSnackbar = true
    },
    handleOpenModal () {
      this.isModalOpen = true
      this.setModal('Save or discard the change')
    },
    handleCloseModal () {
      this.isModalOpen = false
      this.closeModal()
    },
  },
}
</script>
