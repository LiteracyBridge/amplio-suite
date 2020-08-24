<template>
  <div class="grid grid-cols-content-message items-center p-4 pt-6">
    <div class="flex items-center">
      <span class="mandatory-field" id="title">
        Playlist Title
      </span>

      <v-tooltip
        v-if="playlist.title.length > 15"
        text="We recommend to keep titles short"
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
      :value="playlist.title"
      @input="setPlaylistTitle({ playlistIndex, title: $event.target.value })"
    />

    <span id="audience" class="pl-4">
      Audience
    </span>

    <v-input
      type="text"
      mx="mx-0 w-full"
      aria-labelledby="audience"
      placeholder="audience"
      :value="playlist.audience"
      @input="setPlaylistAudience({ playlistIndex, audience: $event.target.value })"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import VInput from '@/components/VInput'
import VTooltip from '@/components/VTooltip'

export default {
  props: {
    playlist: {
      type: Object,
      required: true
    },
    playlistIndex: {
      type: Number,
      required: true
    },
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
