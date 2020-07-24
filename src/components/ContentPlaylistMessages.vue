<template>
  <div>
    <draggable
      v-model="messages"
      :animation="200"
      ghost-class="moving-item"
      @start="dragging = true"
      @end="dragging = false"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="mx-1 cursor-move"
      >
        <div class="flex items-center mt-4">
          <v-input
            type="text"
            name="messageTitle"
            label="Message title"
            mx="w-full px-4 mx-0"
            :value="message.title"
            @input="(event) => setMessageTitle({ playlistIndex: selectedPlaylistIndex, messageIndex: index, title: event.target.value })"
          />

          <span
            @click="setMessageIndex(index)"
            :class="index === selectedMessageIndex ? 'text-blue underline font-semibold' : 'text-black'"
            class="w-48 py-2 px-4 cursor-pointer hover:text-blue hover:underline hover:font-semibold"
          >
            {{ index === selectedMessageIndex ? 'Hide Details' : 'Show Details' }}
            <font-awesome-icon :icon="index === selectedMessageIndex ? 'chevron-up' : 'chevron-down'" />
          </span>

          <button
            :aria-label="`Delete message ${message.title}`"
            @click="removeMessage({ playlistIndex: selectedPlaylistIndex, index })"
          >
            <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
          </button>
        </div>

        <div
          :class="index === selectedMessageIndex ? 'h-82' : 'h-0'"
          class="overflow-hidden transition-all duration-700"
        >
          <playlist-messages-form />
        </div>
      </div>
    </draggable>

    <span
      tabindex="0"
      @click="addNewMessage"
      class="block mt-4 p-2 text-green font-bold cursor-pointer"
    >
      + Add Message
    </span>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapState, mapGetters, mapActions } from 'vuex'

import PlaylistMessagesForm from '@/components/ContentPlaylistMessagesForm'
import VInput from '@/components/VInput'

export default {
  computed: {
    ...mapState('uiSettings', {
      selectedPlaylistIndex: state => state.content.selectedPlaylistIndex,
      selectedMessageIndex: state => state.content.selectedMessageIndex
    }),
    ...mapGetters('uiSettings', [
      'selectedDeployment',
      'selectedPlaylist',
      'selectedMessage'
    ]),
    messages: {
      get () {
        return this.selectedPlaylist.messages
      },
      set (value) {
        this.setMessageIndex(-1)
        this.setMessages({ playlistIndex: this.selectedPlaylistIndex, messages: value })
      }
    }
  },
  components: {
    Draggable,
    PlaylistMessagesForm,
    VInput
  },
  methods: {
    ...mapActions('uiSettings', [
      'setMessageIndex'
    ]),
    ...mapActions('content', [
      'setMessages',
      'addMessage',
      'setMessageTitle',
      'removeMessage'
    ]),
    addNewMessage() {
      const payload = {
        deployment_id: this.selectedDeployment.deployment,
        playlist_index: this.selectedPlaylistIndex
      }
      this.addMessage(payload)
    }
  }
}
</script>
