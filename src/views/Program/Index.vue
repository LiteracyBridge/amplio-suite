<template>
  <main class="container mx-auto text-center">
    <div class="py-6 flex justify-between">
      <h1 class="text-2xl text-blue capitalize">{{ programName }} Program</h1>

      <div>
        <v-button
          text="Submit"
          :color="canDeploy ? 'bg-blue' : 'bg-gray-400'"
          :aria-disabled="canDeploy ? 'false' : 'true'"
          @click="onSubmit"
        />
        <v-tooltip
          v-if="!canDeploy"
          text="You need to add at least one deployment, one message, and one recipient before you can submit this information to the ACM"
          position="right"
          class="ml-2"
        >
          <font-awesome-icon
            class="text-orange-600"
            icon="exclamation-circle"
          />
        </v-tooltip>
      </div>
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
import VTooltip from '@/components/VTooltip'
import VSnackbars from '@/components/VSnackbars'

export default {
  name: 'Program',
  props: ['programCode'],
  components: {
    VButton,
    VTooltip,
    VSnackbars,
  },
  computed: {
    ...mapState('program', [
      'programName',
    ]),
    ...mapState('content', [
      'playlists',
    ]),
    ...mapState('recipients', [
      'recipients',
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
    canDeploy () {
      if (!this.playlists) return false

      const hasOneMessage = (this.playlists
        .map(playlist => playlist.messages.map(message => message.title))
        .flat()
        .filter(title => !title.startsWith('Message Title'))
      ).length > 0

      const hasOneRecipient = this.recipients.length > 0

      return hasOneMessage && hasOneRecipient && !this.anyTabDirty
    }
  },
  data () {
    return {
      sections: ['general', 'deployments', 'content', 'recipients'],

      transitionName: 'slide-left',
      isModalOpen: false,
      showSnackbar: false,
    }
  },
  created () {
    // this.fetchContent({ programCode: this.programCode })
    this.fetchRecipients(this.programCode)
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
    ...mapActions('content', [
      'fetchContent',
    ]),
    ...mapActions('recipients', [
      'fetchRecipients',
    ]),
    async onSubmit () {
      if (!this.canDeploy) return

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
