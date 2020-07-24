<template>
  <div class="ml-6 py-2 border-r-2">
    <draggable
      tag="ul"
      v-model="playlists"
      :animation="200"
      ghost-class="moving-item"
      @start="dragging = true"
      @end="onDraggEnd"
    >
      <li
        v-for="(playlist, index) in playlists"
        :key="index"
        class="flex justify-between pl-1 mr-1 cursor-move"
      >
        <span
          :class="playlist.title === selectedPlaylist.title ? 'text-blue underline font-semibold' : 'text-black'"
          class="py-2 text-left cursor-pointer hover:text-blue hover:underline hover:font-semibold"
          @click="setPlaylistIndex(index)"
        >
          {{ playlist.title }}
        </span>
        <button
          :aria-label="`Delete playlist ${playlist.title}`"
          @click="removePlaylist(index)"
        >
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
      </li>
    </draggable>

    <span
      tabindex="0"
      @click="() => addPlaylist(selectedDeployment.deploymentname)"
      class="block mt-4 p-2u text-green font-bold cursor-pointer"
    >
      + Add playlist
    </span>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('uiSettings', {
      selectedPlaylistIndex: state => state.content.selectedPlaylistIndex
    }),
    ...mapGetters('uiSettings', [
      'selectedDeployment',
      'selectedPlaylist'
    ]),
    playlists: {
      get () {
        return this.$store.state.content.playlists
      },
      set (value) {
        this.setPlaylist(value)
      }
    }
  },
  components: {
    Draggable
  },
  methods: {
    ...mapActions('uiSettings', [
      'setPlaylistIndex'
    ]),
    ...mapActions('content', [
      'setPlaylist',
      'addPlaylist',
      'removePlaylist'
    ]),
    onDraggEnd(event) {
      if (event.oldIndex === this.selectedPlaylistIndex){
        this.setPlaylistIndex(event.newIndex)
      }
    }
  }
}
</script>
