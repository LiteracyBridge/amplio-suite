<template>
  <Row :gutter="8">
    <Col :sm="6" :lg="5" :xl="4">
      <Button type="text" @click="onToggleExpanded" class="ml-10 mr-2">
        <template #icon>
          <CaretRightOutlined v-if="!expanded" class="ml-5 mb-2" />
          <CaretDownOutlined v-else class="ml-5 mb-2" />
        </template>

        Playlist {{ playlist.position }}
      </Button>
    </Col>

    <Col :span="10">
      <FormItem
       :validateStatus="titleError ? 'error' : ''"
      :help="titleError ? 'Invalid characters in Playlist Title' :
       'Message title cannot contain these characters: \\/:*?<>|&quot;'"
       class="mt-3 w-full"
      :extra="playlist._error_message"
      >
        <Input
          :aria-label="`playlist ${playlist.title}`"
          placeholder="Playlist Title"
          type="text"
          :name="`playlist-${playlist.title}`"
          v-model:value="playlist.title"
          :status="playlist._form_status"
          @change="($event) => validatePlaylistTitle($event.target.value, playlist)"
          @input="handleTitleInput"
        />
      </FormItem>
    </Col>
    <Col :span="8">
      <Button
        v-if="expanded"
        type="primary"
        :ghost="true"
        @click="onAddMessage()"
        :disabled="!canAddMessage"
        class="ml-10"
      >
        Add Message
      </Button>

      <Popconfirm
        title="Are you sure to delete this playlist?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="onRemovePlaylist()"
      >
        <Button
          v-if="canRemovePlaylist"
          :aria-label="`Delete playlist ${playlist.title}`"
          :danger="true"
          class="ml-3"
          >Delete Playlist</Button
        >
      </Popconfirm>
    </Col>
  </Row>

  <div class="my-4 ml-20">
    <div v-if="expanded">
      <draggable
        v-model="messages"
        :animation="200"
        handle=".msg-handle"
        group="message"
        ghost-class="moving-item"
        @start="dragging = true"
        @end="dragging = false"
        item-key="position"
      >
        <template #item="{ element: message, index: index }">
          <div :key="index">
            <content2-message
              :deployment="deployment"
              :playlist="playlist"
              :message="message"
              :duplicateTitles="duplicateTitles"
            ></content2-message>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Content2Message from "./Content2Message.vue";
import Draggable from "vuedraggable";
import { Row, Col, Input, Button, FormItem, Popconfirm } from "ant-design-vue";
import { useProgramSpecStore } from "@/store/programspec";
import type { Deployment } from "@/models/deployment";
import type { Playlist } from "@/models/playlist";
import { ref, computed } from "vue";
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  deployment: Deployment;
  playlist: Playlist;
}>();

const store = useProgramSpecStore();
const expanded = ref(false);
const dragging = ref(false);
const titleError = ref(false)

// CHANGED: Added validation function
const validateTitle = (title: string) => {
  const invalidChars = /[^\d\w\s]/g;
  return !invalidChars.test(title);
};

// CHANGED: Added handler for real-time input validation
const handleTitleInput = (event: Event) => {
  const title = (event.target as HTMLInputElement).value;
  titleError.value = /[^\d\w\s]/g.test(title); // Set error state based on validation
  if (!titleError.value) {
    store.setMessageOrPlaylistTitle(title, props.playlist); // Update title in store if valid
  }
};

const canAddMessage = computed(() => {
  return (
    props.playlist.title &&
    (props.playlist.messages.length === 0 ||
      props.playlist.messages[props.playlist.messages.length - 1].title)
  );
});

const canRemovePlaylist = computed(() => {
  return props.playlist.messages.length === 0;

});

const duplicateTitles = computed(() => {
  const titles = messages.value.map((message) => message.title);
  const duplicates = titles.filter(
    ((theSet) => (aString) => theSet.has(aString) || !theSet.add(aString))(new Set())
  );
  return duplicates;
});

const messages = computed({
  get() {
    return props.playlist.messages;
  },

  set(newValue) {
    store.setMessages({
      playlist: props.playlist,
      messages: newValue,
    });
  },
});

function onToggleExpanded() {
  expanded.value = !expanded.value;
}

function onAddMessage() {
  if (canAddMessage.value) {
    store.addMessage(props.playlist);
  }
}

function onRemovePlaylist() {
  if (canRemovePlaylist.value) {
    store.removePlaylist({ deployment: props.deployment, playlist: props.playlist });
  }
}

function validatePlaylistTitle(title: string, playlist: Playlist) {
  store.setMessageOrPlaylistTitle(title, playlist);
  if (new TextEncoder().encode(title).length > 32) {
    playlist._error_message = "Playlist title is too long!";
    playlist._form_status = "error";
  } else {
    playlist._error_message = "";
    playlist._form_status = undefined;
  }
}
</script>
