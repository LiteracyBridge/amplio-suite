<template>
  <div class="border border-gray-200 rounded-md my-1.5 bg-white shadow-xs hover:border-gray-300 transition-colors">
    <Alert
      v-if="duplicateTitles.includes(message.title)"
      type="warning"
      show-icon
      class="m-2 py-1"
      message="Duplicate message title in this playlist"
    />

    <!-- Message Header Row -->
    <div class="flex items-center justify-between px-3 py-1.5 gap-2">
      <div class="flex items-center flex-1 min-w-0 gap-1.5">
        <!-- Drag Handle -->
        <HolderOutlined class="text-gray-400 hover:text-gray-600 cursor-grab msg-handle text-sm flex-shrink-0" />

        <!-- Caret Expand / Collapse -->
        <Button
          type="text"
          size="small"
          class="!px-1.5 flex items-center justify-center flex-shrink-0"
          @click="toggleExpanded"
        >
          <CaretRightOutlined v-if="!expanded" class="text-xs text-gray-500" />
          <CaretDownOutlined v-else class="text-xs text-gray-500" />
        </Button>

        <!-- Message Title Input -->
        <div class="flex-1 max-w-lg min-w-0">
          <Input
            size="small"
            aria-label="`message ${message.title}`"
            placeholder="Message Title"
            type="text"
            :name="`message-${message.title}`"
            v-model:value="message.title"
            :status="!playlist.is_survey && titleError ? 'error' : ''"
            :readonly="playlist.is_survey"
            :disabled="playlist.is_survey"
            @change="store.setMessageOrPlaylistTitle($event.target.value, message)"
            @input="handleTitleInput"
          />
        </div>

        <!-- Conditional Error or Survey Tag -->
        <span
          v-if="!playlist.is_survey && titleError"
          class="text-xs text-red-500 font-medium whitespace-nowrap ml-1"
        >
          Invalid characters in Title (\/:*?&lt;&gt;|")
        </span>
      </div>

      <!-- Delete Message Button -->
      <Popconfirm
        title="Are you sure you want to delete this message?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="deleteMessage()"
      >
        <Button
          size="small"
          :danger="true"
          :aria-label="`Delete message ${message.title}`"
          class="flex items-center gap-1 flex-shrink-0"
        >
          <template #icon><DeleteOutlined /></template>
          Delete Message
        </Button>
      </Popconfirm>
    </div>

    <!-- Form for editing the details of a message -->
    <div v-if="expanded && message != null" class="p-3 bg-slate-50/70 border-t border-gray-100 rounded-b-md">
      <content2-message-form
        :deployment="deployment"
        :playlist="playlist"
        :message="message"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Content2MessageForm from "./Content2MessageForm.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { computed, onMounted, ref } from "vue";
import type { Playlist } from "@/models/playlist";
import type { Message } from "@/models/message";
import type { Deployment } from "@/models/deployment";
import { Input, Alert, Button, Popconfirm, Tag } from "ant-design-vue";
import {
  CaretRightOutlined,
  CaretDownOutlined,
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";

const props = defineProps<{
  deployment: Deployment;
  playlist: Playlist;
  message: Message;
  duplicateTitles: string[];
}>();

const store = useProgramSpecStore();

const expanded = ref(false);
const titleError = ref(false);

const validateTitle = (title: string) => {
  // Disallow special characters (including underscore)
  const hasInvalidChars = /[^a-zA-Z0-9\s]/g.test(title);

  // Disallow consecutive spaces (2 or more)
  const hasDoubleSpaces = /\s{2,}/g.test(title);

  // Return false if either check fails
  return !hasInvalidChars && !hasDoubleSpaces;
};

const handleTitleInput = (event: Event) => {
  const title = (event.target as HTMLInputElement).value;
  titleError.value = !validateTitle(title);
  if (!titleError.value) {
    store.setMessageOrPlaylistTitle(title, props.message);
  }
};

onMounted(() => {
  if (props.message.title.length === 0) {
    expanded.value = true;
  }
});

function toggleExpanded() {
  expanded.value = !expanded.value;
}

function deleteMessage() {
  store.removeMessage(props.message, props.playlist);
}
</script>
