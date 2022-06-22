<template>
  <main class="container mx-auto">
    <div class="py-6 flex justify-between">
      <h1 class="text-2xl text-blue capitalize">{{ programName }} Program</h1>

      <div class="flex">
        <VButton
          label="Publish"
          variant="submit"
          :disabled="!canPublish"
          :iconL="publishStatus === 'loading' ? 'spinner' : ''"
          :iconLPulse="publishStatus === 'loading'"
          @click="onPublish"
        />
        <v-tooltip
          v-if="!canPublish"
          text="There must be at least one deployment with a message and one recipient before this can be published to the ACM"
          position="right"
          class="my-2 ml-2"
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
          :to="`/programs/${programId}/settings/${section}`"
          :class="[$route.path.endsWith(section) ? 'bg-amplio-green text-white' : 'text-black', index === 0 ? 'rounded-tl-lg' : '']"
          class="p-4 text-lg uppercase hover:bg-amplio-green hover:text-white">
          {{ ` ${sectionTitles[section] || section} ` }}
        </router-link>
      </nav>

      <transition :name="transitionName" mode="out-in">
        <router-view />
      </transition>
    </div>

    <footer class="py-6">
      Need help? Contact us on <a class="text-blue" href="mailto:support@amplio.org">support@amplio.org</a>
    </footer>

    <v-snackbars :show.sync="showSnackbar" label="The program specification was successfully published to the ACM." />

    <!-- For modal components -->
    <portal to="modalBody" v-if="isModalOpen">
      <p class="text-xl">Save or discard the change before continue.</p>
    </portal>

    <portal to="modalFooter" v-if="isModalOpen">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton
          label="Ok"
          @click="handleCloseModal"
        />
      </footer>
    </portal>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/VButton'
import VTooltip from '@/components/VTooltip'
import VSnackbars from '@/components/VSnackbars'

export default {
  name: 'Program',
  props: ['programId'],
  components: {
    VButton,
    VTooltip,
    VSnackbars,
  },
  computed: {
    ...mapState('program', [
      'programName',
    ]),
    ...mapState('content2', [
      'deployments',
    ]),
    ...mapState('recipients', [
      'recipients',
    ]),
    anyTabDirty () {
      const partial = [
        this.$store.state.program.dirty,
        this.$store.state.programData.dirty,
        this.$store.state.content2.changed,
        this.$store.state.recipients.dirty
      ]

      return partial.some(Boolean)
    },
    canPublish () {
      if (!this.deployments) return false;
      const hasOneMessage = this.deployments.some(depl=>depl.playlists.some(pl=>pl.messages.length > 0));
      const hasOneRecipient = this.recipients.length > 0
      return hasOneMessage && hasOneRecipient && !this.anyTabDirty
    }
  },
  data () {
    return {
      sections: ['general', 'content2', 'recipients', 'importExport'],
      sectionTitles: {content2: 'Deployments & Content', importExport: 'Import/Export'},
      publishStatus: null,
      transitionName: 'slide-left',
      isModalOpen: false,
      showSnackbar: false,
    }
  },
  created () {
    this.fetchContent2({programId: this.programId});
    this.fetchRecipients(this.programId)
  },
  beforeRouteUpdate (to, from, next) {
    const sTo = to.path.split('/')
    const sFrom = from.path.split('/')
    const toName = sTo[sTo.length - 1]
    const fromName = sFrom[sFrom.length - 1]

    this.transitionName = this.sections.indexOf(toName) < this.sections.indexOf(fromName) ? 'slide-right' : 'slide-left'

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
  // watch: {
  //   deployments () {
  //     if (this.deployments.length > 0) {
  //       this.fetchContent2({programId: this.programId});
  //     }
  //   }
  // },
  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('program', [
      'publishProgram',
    ]),
    ...mapActions('content2', {
      fetchContent2: 'fetchContent'
    }),
    ...mapActions('recipients', [
      'fetchRecipients',
    ]),
    async onPublish () {
      if (!this.canPublish) return

      this.publishStatus = 'loading'
      this.publishStatus = await this.publishProgram()
      if (this.publishStatus === 'success') this.showSnackbar = true
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
