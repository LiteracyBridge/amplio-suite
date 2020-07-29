<template>
  <box
    title="content"
    help="You can modify your content details on this page. All fields with an asterisk are required. The optional fields are recommended for reporting."
  >
    <div class="-mx-6">
      <h3 class="px-6 py-4 bg-gray-400 text-xl text-left border-2 border-gray-600">
        <select
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
        class="h-96 grid transition-all duration-700 overflow-hidden"
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
    ...mapState('deployments', {
      deployments: state => state.items
    })
  },
  components: {
    PlaylistMenu,
    PlaylistHeader,
    PlaylistMessages,

    Box
  },
  methods: {
    ...mapActions('content', [
      'fetchContent'
    ]),
    ...mapActions('uiSettings', [
      'setDeploymentIndex'
    ]),
    changeDeployment(deploymentName) {
      const index = this.deployments
        .map(item => item.deploymentname)
        .indexOf(deploymentName)

      this.fetchContent(deploymentName)
      this.setDeploymentIndex(index)
    }
  }
}
</script>
