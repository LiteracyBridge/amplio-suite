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
        tabindex="0"
        class="mx-1 cursor-move"
        data-name="message"
        :data-index="index"
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
  data () {
    return {
      target: {}
    }
  },
  mounted () {
    window.addEventListener('keydown', this.handleKeyboard)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyboard)
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
    },
    handleKeyboard (event) {
      const { target, code } = event
      const { name } = target.dataset

      if (Object.keys(this.target).length === 0 && name !== 'message') return
      event.stopPropagation()

      if (code === 'Space') {
        this.target = target
      }
      else if (['Enter', 'Escape'].includes(code)) {
        this.target = {}
        document.querySelectorAll(`[data-name="message"][data-index]`)
          .forEach(ele => ele.classList.remove('focus-visible'))
      }
      else if (['ArrowUp', 'ArrowDown'].includes(code)) {
        this.move(code)
      }
    },
    move (direction) {
      const oldIndex = +this.target.dataset.index
      const newIndex = direction === 'ArrowUp' ? oldIndex - 1 : oldIndex + 1
      if (newIndex < 0 || newIndex >= this.messages.length) return

      // Swap elements
      const tmp = [...this.messages]
      const a = tmp[newIndex]
      tmp[newIndex] = tmp[oldIndex]
      tmp[oldIndex] = a

      this.setMessages({ playlistIndex: this.selectedPlaylistIndex, messages: tmp })
      this.setMessageIndex(-1)

      // Update dashed element
      this.target = document.querySelector(`[data-name="message"][data-index="${newIndex}"]`)
      document.querySelectorAll(`[data-name="message"][data-index]`)
        .forEach(ele => ele.classList.remove('focus-visible'))
      this.target.classList.add('focus-visible')
    }
  }
}
</script>
