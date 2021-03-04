<template>
  <draggable
    v-model="messages"
    :animation="200"
    handle=".handle"
    ghost-class="moving-item"
    @start="dragging = true"
    @end="dragging = false"
  >
    <div
      v-for="(message, index) in messages"
      :key="index"
      tabindex="0"
      class="mx-1"
      data-name="message"
      :data-index="index"
    >
      <div class="flex items-center mt-4">
        <div class="m-2 p-2 cursor-grab handle">
          <font-awesome-icon icon="grip-lines" />
        </div>
        <v-input
          type="text"
          :name="`message ${message.title}`"
          label="*Message title"
          mx="w-full mx-0"
          :value="message.title"
          @input="setMessageTitle({ playlistIndex, messageIndex: index, title: $event.target.value })"
        />

        <v-tooltip
          v-if="duplicateMessage.includes(message.title)"
          text="Duplicate message title in this playlist"
          class="my-auto"
        >
          <font-awesome-icon
            class="text-orange-600"
            icon="exclamation-circle"
          />
        </v-tooltip>

        <VButton
          tag="span"
          :active="index === messageIndex"
          :label="index === messageIndex ? 'Hide Details' : 'Show Details'"
          :iconR="index === messageIndex ? 'chevron-up' : 'chevron-down'"
          @click="setMessageIndex(index)"
        />
        <div class="ml-2">
          <VButton
            iconL="trash-alt"
            variant="warning"
            :ariaLabel="`Delete message ${message.title}`"
            @click="handleOpenModal(index)"
          />
        </div>
      </div>

      <div
        :class="index === messageIndex ? 'h-104 md:h-96' : 'h-0'"
        class="overflow-hidden transition-all duration-700"
      >
        <playlist-messages-form
          v-if="index === messageIndex"
          :message="message"
          :playlistIndex="playlistIndex"
          :messageIndex="messageIndex"
        />
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="modal.show">
      <p>This message will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="modal.show">
      <footer class="flex flex-row-reverse justify-between">
        <VButton
          label="Confirm"
          variant="warning"
          @click="confirmDeleteMessage"
        />
        <VButton
          label="Cancel"
          @click="handleCloseModal"
        />
      </footer>
    </portal>
  </draggable>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapState, mapActions } from 'vuex'

import PlaylistMessagesForm from '@/components/ContentPlaylistMessagesForm'
import VInput from '@/components/VInput'
import VButton from '@/components/VButton'
import VTooltip from '@/components/VTooltip'

export default {
  props: {
    deployment: {
      type: Object,
      required: true
    },
    playlist: {
      type: Object,
      required: true
    },
    playlistIndex: {
      type: Number,
      required: true
    },
  },
  computed: {
    ...mapState('content', [
      'duplicateMessage',
    ]),
    messages: {
      get () {
        return this.playlist.messages
      },
      set (value) {
        this.setMessageIndex(-1)
        this.setMessages({ playlistId: this.playlist.id, messages: value })
      }
    },
    message () {
      return this.playlist.messages[this.messageIndex]
    }
  },
  components: {
    Draggable,
    PlaylistMessagesForm,
    VInput,
    VButton,
    VTooltip,
  },
  data: () => ({
    messageIndex: -1,

    target: {},

    modal: {
      show: false,
      eleIndex: -1
    }
  }),
  mounted () {
    window.addEventListener('keydown', this.handleKeyboard)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyboard)
  },
  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('content', [
      'setMessages',
      'setMessageTitle',
      'removeMessage'
    ]),
    handleOpenModal (index) {
      this.modal.show = true
      this.modal.eleIndex = index
      this.setModal('Delet Message')
    },
    handleCloseModal () {
      this.modal.show = false
      this.modal.eleIndex = -1
      this.closeModal()
    },
    confirmDeleteMessage() {
      const message = this.messages[this.modal.eleIndex]
      this.removeMessage(message.id)
      this.handleCloseModal()
    },
    setMessageIndex (index) {
      if (this.messageIndex === index) this.messageIndex = -1
      else this.messageIndex = index
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

      this.setMessages({ playlistId: this.playlist.id, messages: tmp })
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
