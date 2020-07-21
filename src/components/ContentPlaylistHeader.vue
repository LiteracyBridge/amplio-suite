<template>
  <div class="grid grid-cols-content-message items-center p-4">
    <span id="title">
      Playlist Title
    </span>

    <v-input
      type="text"
      mx="mx-0 w-full"
      aria-labelledby="title"
      :value="selectedPlaylist.title"
      @input="(event) => setPlaylistName({ index: selectedPlaylistIndex, title: event.target.value })"
    />

    <span id="audience" class="pl-4">
      Audience
    </span>

    <v-input
      type="text"
      mx="mx-0 w-full"
      aria-labelledby="audience"
      placeholder="audience"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import VInput from '@/components/VInput'

export default {
  computed: {
    ...mapState('uiContent', [
      'selectedPlaylistIndex'
    ]),
    ...mapGetters('programData', [
      'selectedPlaylist'
    ])
  },
  components: {
    VInput
  },
  methods: {
    ...mapActions('programData', [
      'setPlaylistName'
    ])
  }
}
</script>
