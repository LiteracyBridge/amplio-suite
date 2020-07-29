<template>
  <div class="grid grid-cols-content-message items-center p-4 pt-6">
    <div class="flex items-center">
      <span id="title">
        Playlist Title
      </span>

      <v-tooltip
        v-if="selectedPlaylist.title.length > 15"
        text="The name of the playlist is very long"
        class="ml-2"
      >
        <font-awesome-icon
          class="text-orange-600"
          icon="exclamation-circle"
        />
      </v-tooltip>
    </div>

    <v-input
      type="text"
      mx="mx-0 w-full"
      aria-labelledby="title"
      :value="selectedPlaylist.title"
      @input="(event) => setPlaylistTitle({ playlistIndex, title: event.target.value })"
    />

    <span id="audience" class="pl-4">
      Audience
    </span>

    <v-input
      type="text"
      mx="mx-0 w-full"
      aria-labelledby="audience"
      placeholder="audience"
      :value="selectedPlaylist.audience"
      @input="(event) => setPlaylistAudience({ playlistIndex, audience: event.target.value })"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import VInput from '@/components/VInput'
import VTooltip from '@/components/VTooltip'

export default {
  computed: {
    ...mapState('uiSettings', {
      playlistIndex: state => state.content.selectedPlaylistIndex
    }),
    ...mapGetters('uiSettings', [
      'selectedPlaylist'
    ])
  },
  components: {
    VInput,
    VTooltip,
  },
  methods: {
    ...mapActions('content', [
      'setPlaylistTitle',
      'setPlaylistAudience',
    ])
  }
}
</script>
