<template>
  <main class="container mx-auto text-center">
    <div class="py-6 px-4 flex justify-between">
      <h1 class="text-2xl text-blue">{{ programName }} Program</h1>

      <div>
        <v-button
          class="mx-2"
          :color="settingIsDirty ? 'bg-gray-400' : 'bg-blue'"
          text="Submit"
          @click="onSubmit"
        />
        <v-button
          size="2x"
          class="mx-2"
          :color="settingIsDirty ? 'bg-transparent text-red-500 border border-red-500' : 'bg-gray-400'"
          text="Discard Changes"
          @click="onDiscardChanges"
        />
        <v-button
          size="2x"
          class="mx-2"
          :color="settingIsDirty ? 'bg-green' : 'bg-gray-400'"
          text="Save Change"
          @click="onSaveChanges"
        />
      </div>
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

    <v-snackbars :show.sync="showSnackbar" label="The program was successfully deployed" />

    <!-- For modal components -->
    <portal to="modalBody" v-if="isModalOpen">
      <p>Save or discard the change before continue.</p>
    </portal>

    <portal to="modalFooter" v-if="isModalOpen">
      <footer class="flex flex-row-reverse justify-between">
        <v-button @click="handleCloseModal" text="Ok" />
      </footer>
    </portal>
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'
import VButton from '@/components/Button'
import VSnackbars from '@/components/VSnackbars'

import { fetchData } from '@/utils'

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
    ...mapGetters('ui', [
      'settingIsDirty',
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
      isModalOpen: false,
      showSnackbar: false,
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
    ...mapActions('program', [
      'deployProgram',
    ]),
    async onSubmit () {
      const result = await this.deployProgram()
      if (result === 'success') this.showSnackbar = true
    },
    onSaveChanges () {
      eventBus.$emit('save-crud-data')
    },
    onDiscardChanges () {
      eventBus.$emit('discard-crud-data')
    },
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
