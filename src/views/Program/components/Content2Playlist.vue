<template>
  <div class="bg-gray-50/80 border border-gray-200 rounded-lg p-2.5 my-2 flex items-center justify-between gap-3">
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <Button
        type="text"
        size="middle"
        @click="onToggleExpanded"
        class="flex items-center gap-1.5 font-semibold text-gray-700 !px-2"
      >
        <CaretRightOutlined v-if="!expanded" class="text-xs text-gray-500" />
        <CaretDownOutlined v-else class="text-xs text-gray-500" />
        <span>Playlist {{ playlist.position }}</span>
      </Button>
      <Tag v-if="playlist.is_survey" color="purple" class="m-0">Survey</Tag>

      <!-- Playlist Title -->
      <div class="flex-1 max-w-md min-w-0">
        <Input
          :aria-label="`playlist ${playlist.title}`"
          placeholder="Playlist Title"
          type="text"
          size="middle"
          :name="`playlist-${playlist.title}`"
          v-model:value="playlist.title"
          :status="titleError || playlist._form_status ? 'error' : ''"
          @change="($event) => validatePlaylistTitle($event.target.value, playlist)"
          @input="handleTitleInput"
        />
      </div>

      <span v-if="titleError" class="text-xs text-red-500 whitespace-nowrap">
        Letters, numbers, and spaces only
      </span>
      <span v-else-if="playlist._error_message" class="text-xs text-red-500 whitespace-nowrap">
        {{ playlist._error_message }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <!-- Add Message -->
      <Button
        v-if="expanded && !playlist.is_survey"
        type="primary"
        :ghost="true"
        @click="onAddMessage()"
        :disabled="!canAddMessage"
        class="flex items-center gap-1"
      >
        <template #icon><PlusOutlined /></template>
        Add Message
      </Button>

      <!-- Convert to Survey / Edit Survey -->
      <Button
        v-if="expanded"
        type="primary"
        :class="
          playlist.is_survey
            ? '!bg-purple-600 hover:!bg-purple-700 !border-purple-600 text-white font-medium shadow-sm flex items-center gap-1.5'
            : '!bg-indigo-600 hover:!bg-indigo-700 !border-indigo-600 text-white font-medium shadow-sm flex items-center gap-1.5'
        "
        @click="isSurveyDrawerOpen = true"
      >
        <template #icon>
          <EditOutlined v-if="playlist.is_survey" />
          <NodeIndexOutlined v-else />
        </template>
        {{ playlist.is_survey ? "Edit Survey" : "Convert to Survey" }}
      </Button>

      <!-- Delete Playlist -->
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
          class="flex items-center gap-1"
        >
          Delete Playlist
        </Button>
      </Popconfirm>
    </div>
  </div>

  <!-- Survey Builder Drawer -->
  <TBSurveyBuilderDrawer
    v-if="isSurveyDrawerOpen"
    :open="isSurveyDrawerOpen"
    :playlist="playlist"
    :deployment="deployment"
    @close="isSurveyDrawerOpen = false"
  />

  <!-- Nested Message List -->
  <div class="my-2 ml-6 pl-3 border-l-2 border-indigo-200/70">
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
import { Input, Button, Popconfirm, Tag } from "ant-design-vue";
import { useProgramSpecStore } from "@/store/programspec";
import type { Deployment } from "@/models/deployment";
import type { Playlist } from "@/models/playlist";
import { ref, computed } from "vue";
import {
  CaretRightOutlined,
  CaretDownOutlined,
  PlusOutlined,
  EditOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons-vue";
import TBSurveyBuilderDrawer from "./TBSurveyBuilder/TBSurveyBuilderDrawer.vue";

const props = defineProps<{
  deployment: Deployment;
  playlist: Playlist;
}>();

const store = useProgramSpecStore();
const expanded = ref(false);
const dragging = ref(false);
const titleError = ref(false);
const isSurveyDrawerOpen = ref(false);

// CHANGED: Added validation function
// const validateTitle = (title: string) => {
//   const invalidChars = /[^a-zA-Z0-9\s]/g;
//   return !invalidChars.test(title);
// };

const validateTitle = (title: string) => {
  // Disallow special characters (including underscore)
  const hasInvalidChars = /[^a-zA-Z0-9\s]/g.test(title);

  // Disallow consecutive spaces (2 or more)
  const hasDoubleSpaces = /\s{2,}/g.test(title);

  // Return false if either check fails
  return !hasInvalidChars && !hasDoubleSpaces;
};

// CHANGED: Added handler for real-time input validation
const handleTitleInput = (event: Event) => {
  const title = (event.target as HTMLInputElement).value;
  titleError.value = !validateTitle(title);
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
