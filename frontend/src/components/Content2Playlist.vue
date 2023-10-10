<template>
  <div class="flex mb-2">
    <div class="cursor-grab pl-handle ml-10 mr-2">
      <font-awesome-icon icon="grip-lines"/>
    </div>
    <div class="mx-2"
         style="min-width:10px;"
         @click="onToggleExpanded"
    >
      <font-awesome-icon :icon="icon" size="lg"/>
    </div>
    <div class="w-full tag-playlist ">
      <div class="flex font-light text-gray-800">
        <span class="flex-initial text-xl">Playlist {{ playlist.position }}:</span>
        <!-- -mt-1 to push the input up just a bit, to better align with the label -->
        <input
          class="flex-auto mx-2 px-1 -mt-1 border rounded-sm text-xl text-black"
          :class="!title||title.length===0?'invalid border-red-500 border-2 rounded':''"
          v-model="title"
          placeholder="Playlist Title"
        />
        <button v-if="expanded" class="btn text-base" @click="onAddMessage()" :disabled="!canAddMessage">
          Add Message
        </button>

        <VButton
          v-if="canRemovePlaylist"
          class="flex-initial my-auto ml-2 border-none"
          iconL="trash-alt"
          variant="warning"
          :ariaLabel="`Delete playlist ${title}`"
          @click="onRemovePlaylist()"
        />

      </div>

      <div class="tag-message-container"
           v-if="expanded"
      >

        <draggable
          v-model="messages"
          :animation="200"
          handle=".msg-handle"
          group="message"
          ghost-class="moving-item"
          @start="dragging = true"
          @end="dragging = false"
        >

          <div v-for="message in messages"
               :key="message.position"
               class="flex tag-message"
          >
            <content2-message
              class="w-full"
              :deployment="deployment"
              :playlist="playlist"
              :message="message"
              :duplicateTitles="duplicateTitles"
            ></content2-message>

          </div>

        </draggable>

      </div>
    </div>

  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

import Content2Message from '@/components/Content2Message'
import Draggable from 'vuedraggable'
import VButton from '@/components/VButton.vue'

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

  },

  components: {
    Content2Message,
    Draggable,
    VButton,
  },

  computed: {
    ...mapState('programspec', [
      'deployments'
    ]),

    canAddMessage() {
      return this.playlist.title && (this.playlist.messages.length === 0 || this.playlist.messages[this.playlist.messages.length - 1].title);
    },

    canRemovePlaylist() {
      return this.playlist.messages.length===0;
    },

    duplicateTitles() {
      const titles = this.messages.map(message => message.title)
      const duplicates = titles.filter((theSet => aString => theSet.has(aString) || !theSet.add(aString))(new Set))
      return duplicates
    },

    icon() {
      return this.expanded ? 'caret-down' : 'caret-right';
    },

    title: {
      get() {
        return this.playlist.title;
      },
      set(newValue) {
        this.setPlaylistTitle({deployment:this.deployment, playlist:this.playlist, title:newValue});
      }
    },

    audience: {
      get() {
        if (!this.playlist.audience || this.playlist.audience === 'null') return '';
        return this.playlist.audience;
      },
      set(newValue) {
        this.setPlaylistAudience({deployment: this.deployment, playlist: this.playlist, audience: newValue});
      }
    },

    messages: {
      get() {
        return this.playlist.messages;
      },

      set(newValue) {
        this.setMessages({deployment: this.deployment, playlist: this.playlist, messages: newValue});
      }
    }

  },

  data() {
    return {
      expanded: false,
    }
  },

  methods: {
    ...mapActions('programspec', [
      'removePlaylist',
      'setPlaylistTitle',
      'setPlaylistAudience',
      'setMessages',
      'addMessage',
    ]),
    onToggleExpanded() {
      this.expanded = !this.expanded;
    },

    onAddMessage() {
      if (this.canAddMessage) {
        this.addMessage({deployment: this.deployment, playlist: this.playlist});
      }
    },

    onRemovePlaylist() {
      if (this.canRemovePlaylist) {
        this.removePlaylist({deployment: this.deployment, playlist: this.playlist});
      }
    }
  }

}
</script>

<style scoped>

</style>
