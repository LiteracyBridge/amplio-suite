<template>
  <box
    :httpStatus="status"
    :isDirty="dirty"
    title="content"
    help="You can modify your content details on this page. All fields with an asterisk are required. The optional fields are recommended for reporting."
  >
    <div class="-mx-6">
      <h3 class="px-6 py-4 bg-gray-400 text-xl text-left border-2 border-gray-600">
        <select
          ref="selectDeplo"
          @change="(event) => changeDeployment(event.target.value)"
        >
          <option
            v-for="item in deployments"
            :key="item.deployment"
            :value="item.deploymentname"
          >
            Deployment {{ item.deployment }}
          </option>
        </select>
      </h3>
      <div
        class="grid transition-all duration-700"
        style="grid-template-columns: 1.3fr 5fr;"
      >
        <playlist-menu />

        <div class="text-left">
          <playlist-header />

          <div class="p-4 text-xl bg-gray-400">
            <p>Messages</p>
          </div>

          <playlist-messages />
        </div>
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="isModalOpen">
      <p>Save or discard the change before continue.</p>
    </portal>

    <portal to="modalFooter" v-if="isModalOpen">
      <footer class="flex flex-row-reverse justify-between">
        <v-button @click="handleCloseModal" text="Ok" />
      </footer>
    </portal>
  </box>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { eventBus } from '@/eventBus'

import Box from '@/components/ProgramBox'
import VButton from '@/components/Button'
import PlaylistMenu from '@/components/ContentPlaylistMenu'
import PlaylistHeader from '@/components/ContentPlaylistHeader'
import PlaylistMessages from '@/components/ContentPlaylistMessages'

export default {
  computed: {
    ...mapState('deployments', {
      deployments: state => state.items
    }),
    ...mapState('content', [
      'status',
      'dirty',
    ]),
    ...mapGetters('uiSettings', [
      'selectedDeployment'
    ])
  },
  components: {
    Box,
    VButton,
    PlaylistMenu,
    PlaylistHeader,
    PlaylistMessages,
  },
  data: () => ({
    isModalOpen: false
  }),
  mounted (){
    eventBus.$on('save-crud-data', () => {
      this.updateContent()
    }),
    eventBus.$on('discard-crud-data', () => {
      this.fetchContent()
    })
  },
  beforeDestroy () {
    eventBus.$off('save-crud-data')
    eventBus.$off('discard-crud-data')
  },
  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('uiSettings', [
      'setDeploymentIndex'
    ]),
    ...mapActions('content', [
      'fetchContent',
      'updateContent',
    ]),
    handleOpenModal () {
      this.isModalOpen = true
      this.setModal('Save or discard the change')
    },
    handleCloseModal () {
      this.isModalOpen = false
      this.closeModal()
    },
    changeDeployment(deploymentName) {
      if (this.dirty) {
        this.handleOpenModal()
        this.$refs.selectDeplo.value = this.selectedDeployment.deploymentname
        return
      }

      const index = this.deployments
        .map(item => item.deploymentname)
        .indexOf(deploymentName)

      this.fetchContent(deploymentName)
      this.setDeploymentIndex(index)
    }
  }
}
</script>
