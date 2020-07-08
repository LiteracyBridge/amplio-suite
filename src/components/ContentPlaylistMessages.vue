<template>
  <div>
    <template v-for="message in selectedPlaylist.messages">
      <div :key="`${message.title}-a`" class="flex items-center mt-4">
        <v-input
          type="text"
          name="messageTitle"
          label="Message title"
          mx="w-full px-4 mx-0"
          :value="message.title"
        />

        <span
          @click="toggleOpenMessage(message)"
          :class="message.title === selectedMessage.title ? 'text-blue underline font-semibold' : 'text-black'"
          class="w-48 py-2 px-4 cursor-pointer hover:text-blue hover:underline hover:font-semibold"
        >
          {{ message.title === selectedMessage.title ? 'Hide Details' : 'Show Details' }}
          <font-awesome-icon :icon="message.title === selectedMessage.title ? 'chevron-up' : 'chevron-down'" />
        </span>

        <button
          :aria-label="`Delete message ${message.title}`"
        >
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
      </div>

      <div
        :key="`${message.title}-a`"
        :class="message.title === selectedMessage.title ? 'h-56' : 'h-0'"
        class="overflow-hidden transition-all duration-700"
      >
        <playlist-messages-form />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import PlaylistMessagesForm from '@/components/ContentPlaylistMessagesForm'

import VInput from '@/components/VInput'

export default {
  computed: {
    ...mapState('uiContent', [
      'selectedPlaylist',
      'selectedMessage'
    ])
  },
  components: {
    PlaylistMessagesForm,
    VInput
  },
  methods: {
    ...mapActions('uiContent', [
      'toggleOpenMessage'
    ])
  }
}
</script>
