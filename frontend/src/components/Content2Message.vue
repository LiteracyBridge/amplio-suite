<template>
  <div class="border rounded my-1">
    <div class="flex">
      <div class="m-2 p-2 cursor-grab msg-handle">
        <font-awesome-icon icon="grip-lines"/>
      </div>

      <div class="m-2 py-2"
           style="min-width:10px;"
           @click="toggleExpanded"
      >
        <font-awesome-icon :icon="icon" size="lg"/>
      </div>

      <v-input
        aria-label="`message ${message.title}`"
        placeholder="Message Title"
        :class="!message.title||message.title.length===0?'invalid border-red-500 border-2 rounded':''"
        type="text"
        :name="`message ${message.title}`"
        mx="w-full mx-0"
        :value="message.title"
        @input="setMessageTitle({ deployment, playlist, message, title: $event.target.value })"
      />

      <v-tooltip
        v-if="duplicateTitles.includes(message.title)"
        text="Duplicate message title in this playlist"
        class="my-auto border-none"
      >
        <font-awesome-icon
          class="text-orange-600 ml-2 my-auto"
          icon="exclamation-circle"
        />
      </v-tooltip>

      <VButton
        class="my-auto ml-2 border-none"
        iconL="trash-alt"
        variant="warning"
        :ariaLabel="`Delete message ${message.title}`"
        @click="queryDeleteMessage()"
      />

    </div>

    <!-- Form for editing the details of a message -->
    <div
      :class="expanded ? 'h-104 md:h-96' : 'h-0'"
      class="transition-all duration-300"
    >
      <content2-message-form
        v-if="expanded"
        :deployment="deployment"
        :playlist="playlist"
        :message="message"
      />
    </div>

    <!-- For delete confirmation modal components -->
    <portal to="modalBody" v-if="modal.show">
      <p class="my-5">Are you sure you want to delete the message?</p>
    </portal>

    <portal to="modalFooter" v-if="modal.show">
      <footer class="flex flex-row-reverse justify-between">
        <VButton
          label="Delete Message"
          variant="warning"
          @click="confirmDeleteMessage"
        />
        <VButton
          label="Do Not Delete"
          @click="cancelDeleteMessage"
        />
      </footer>
    </portal>

  </div>
</template>

<script>
import {mapState, mapActions} from 'pinia'

import Content2MessageForm from '@/components/Content2MessageForm.vue'
import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'
import VTooltip from '@/components/VTooltip.vue'

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
    message: {
      type: Object,
      required: true
    },

    duplicateTitles: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState('programspec', [
      'deployments',
    ]),

    icon() {
      return this.expanded ? 'caret-down' : 'caret-right';
    },

    index() {
      return this.message.position;
    }
  },
  components: {
    Content2MessageForm,
    VButton,
    VInput,
    VTooltip,
  },

  data: () => ({
    expanded: false,

    target: {},

    modal: {
      show: false,
      eleIndex: -1
    }
  }),

  mounted() {
    if (this.message.title.length === 0) this.expanded=true;
    // window.addEventListener('keydown', this.handleKeyboard)
  },
  // beforeDestroy() {
  //   window.removeEventListener('keydown', this.handleKeyboard)
  // },

  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('programspec', [
      'setMessages',
      'setMessageTitle',
      'removeMessage'
    ]),

    toggleExpanded() {
      this.expanded = !this.expanded;
    },

    queryDeleteMessage() {
      this.modal.show = true
      this.setModal('Delete Message')
    },

    cancelDeleteMessage() {
      this.modal.show = false
      this.closeModal()
    },

    confirmDeleteMessage() {
      this.removeMessage(this.getMessagePath())
      this.cancelDeleteMessage()
    },

    getMessagePath() {
      return {
        deployment: this.deployment,
        playlist: this.playlist,
        message: this.message
      }
    },

    setMessageIndex() {
      // if (this.messageIndex === index) this.messageIndex = -1
      // else this.messageIndex = index
    },

    // handleKeyboard(event) {
    // const {target, code} = event
    // const {name} = target.dataset
    //
    // if (Object.keys(this.target).length === 0 && name !== 'message') return
    // event.stopPropagation()
    //
    // if (code === 'Space') {
    //   this.target = target
    // } else if (['Enter', 'Escape'].includes(code)) {
    //   this.target = {}
    //   document.querySelectorAll(`[data-name="message"][data-index]`)
    //     .forEach(ele => ele.classList.remove('focus-visible'))
    // } else if (['ArrowUp', 'ArrowDown'].includes(code)) {
    //   this.move(code)
    // }
    // },

    // move(direction) {
    // const oldIndex = +this.target.dataset.index
    // const newIndex = direction === 'ArrowUp' ? oldIndex - 1 : oldIndex + 1
    // if (newIndex < 0 || newIndex >= this.messages.length) return
    //
    // // Swap elements
    // const tmp = [...this.messages]
    // const a = tmp[newIndex]
    // tmp[newIndex] = tmp[oldIndex]
    // tmp[oldIndex] = a
    //
    // this.setMessages({playlistId: this.playlist.id, messages: tmp})
    // this.setMessageIndex(-1)
    //
    // // Update dashed element
    // this.target = document.querySelector(`[data-name="message"][data-index="${newIndex}"]`)
    // document.querySelectorAll(`[data-name="message"][data-index]`)
    //   .forEach(ele => ele.classList.remove('focus-visible'))
    // this.target.classList.add('focus-visible')
    // }
  }
}
</script>
