<template>
  <div class="ml-6 py-2 border-r-2">
    <div
      v-for="(playlist, index) in playlists"
      :key="playlist.title"
      class="flex justify-between"
    >
      <span
        @click="toggleOpenPlaylist({ ... playlist, index })"
        :class="playlist.title === selectedPlaylist.title ? 'text-blue underline font-semibold' : 'text-black'"
        class="py-2 text-left cursor-pointer hover:text-blue hover:underline hover:font-semibold"
      >
        {{ playlist.title }}
      </span>
      <button
        :aria-label="`Delete playlist ${playlist.title}`"
      >
        <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
      </button>
    </div>

    <span
      tabindex="0"
      @click="() => addPlaylist(selectedDeployment.deployment)"
      class="block mt-4 p-2u text-green font-bold cursor-pointer"
    >
      + Add playlist
    </span>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('program', {
      playlists: state => state.content.playlists
    }),
    ...mapState('uiContent', [
      'selectedPlaylist',
      'selectedDeployment'
    ])
  },
  methods: {
    ...mapActions('uiContent', [
      'toggleOpenPlaylist'
    ]),
    ...mapActions('program', [
      'addPlaylist'
    ])
  }
}
</script>
