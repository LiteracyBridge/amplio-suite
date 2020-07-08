<template>
  <box
    title="content"
    help="You can modify your content details on this page. All fields with an asterisk are required. The optional fields are recommended for reporting."
  >
    <div
      v-for="deplo in deployments"
      :key="deplo.deploymentname"
      class="-mx-6"
    >
      <h3
        @click="toggleOpenDeployment(deplo)"
        :class="deplo.deploymentname === selectedDeployment.deploymentname ? 'bg-gray-400' : 'bg-white'"
        class="px-6 py-4 text-xl text-left cursor-pointer border-2 border-gray-600 hover:bg-gray-400"
      >
        Deployment {{ deplo.deploymentname }}
        <font-awesome-icon :icon="deplo.deploymentname === selectedDeployment.deploymentname ? 'chevron-down' : 'chevron-right'" />
      </h3>
      <div
        :class="deplo.deploymentname === selectedDeployment.deploymentname ? 'h-96' : 'h-0'"
        class="grid transition-all duration-700 overflow-hidden"
        style="grid-template-columns: 1.3fr 5fr;"
      >
        <playlist-menu />

        <div class="text-left overflow-y-auto">
          <playlist-header />

          <div class="p-4 text-xl bg-gray-400">
            <p>Messages</p>
          </div>

          <playlist-messages />
        </div>
      </div>
    </div>
  </box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import PlaylistMenu from '@/components/ContentPlaylistMenu'
import PlaylistHeader from '@/components/ContentPlaylistHeader'
import PlaylistMessages from '@/components/ContentPlaylistMessages'

import Box from '@/components/ProgramBox'

export default {
  computed: {
    ...mapState('programData', {
      deployments: state => state.deployments.items
    }),
    ...mapState('uiContent', [
      'selectedDeployment'
    ])
  },
  components: {
    PlaylistMenu,
    PlaylistHeader,
    PlaylistMessages,

    Box
  },
  mounted () {
    this.fetchContent()
    this.toggleOpenDeployment(this.deployments[0])
  },
  methods: {
    ...mapActions('programData', [
      'fetchContent'
    ]),
    ...mapActions('uiContent', [
      'toggleOpenDeployment'
    ])
  }
}
</script>
