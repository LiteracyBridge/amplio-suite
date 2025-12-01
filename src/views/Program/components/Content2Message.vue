<template>
  <div class="border rounded my-1">
    <Alert
      v-if="duplicateTitles.includes(message.title)"
      type="warning"
      show-icon
      class="my-2"
      message="Duplicate message title in this playlist"
    />

    <Row :gutter="8">
      <Col :span="2">
        <Button type="text" @click="toggleExpanded" class="mt-1 mr-2" block>
          <!-- <template #icon> -->
          <CaretRightOutlined v-if="!expanded" class="ml-5 mb-2" />
          <CaretDownOutlined v-else class="ml-5 mb-2" />
          <!-- </template> -->
        </Button>
      </Col>

      <Col :span="14">
        <!-- CHANGED: Added validation status and error message -->
        <FormItem
          :validateStatus="titleError ? 'error' : ''"
          :help="
            titleError
              ? 'Invalid characters in Message Title'
              : 'Message title cannot contain these characters: \\/:*?<>|&quot;'
          "
          class="mt-3 w-full"
        >
          <Input
            aria-label="`message ${message.title}`"
            placeholder="Message Title"
            type="text"
            :name="`message-${message.title}`"
            v-model:value="message.title"
            @change="store.setMessageOrPlaylistTitle($event.target.value, message)"
            @input="handleTitleInput"
          /> </FormItem
      ></Col>
      <Col :span="4" align="center">
        <Popconfirm
          title="Are you sure you want to delete this message?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteMessage()"
        >
          <Button
            class="mt-3"
            :aria-label="`Delete message ${message.title}`"
            :danger="true"
            >Delete Message</Button
          >
        </Popconfirm>
      </Col>
    </Row>

    <!--   <div class="flex"> -->
    <!-- <div class="m-2 p-2 cursor-grab msg-handle">
        <font-awesome-icon icon="grip-lines" />
      </div>

      <div class="m-2 py-2 mt-2" style="min-width: 10px" @click="toggleExpanded">
        <font-awesome-icon :icon="icon" size="lg" />
      </div> -->

    <!-- <v-tooltip
      v-if="duplicateTitles.includes(message.title)"
      text="Duplicate message title in this playlist"
      class="my-auto border-none"
    >
      <font-awesome-icon class="text-orange-600 ml-2 my-auto" icon="exclamation-circle" />
    </v-tooltip>

    <VButton
      class="mt-4 ml-2 border-none"
      iconL="trash-alt"
      variant="warning"
      :ariaLabel="`Delete message ${message.title}`"
      @click="queryDeleteMessage()"
    /> -->
    <!-- </div> -->

    <!-- Form for editing the details of a message -->
    <div class="px-10">
      <div
        :class="expanded ? 'min-h-104 md:min-h-96' : 'h-0'"
        class="transition-all duration-300"
      >
        <content2-message-form
          v-if="expanded && message != null"
          :deployment="deployment"
          :playlist="playlist"
          :message="message"
        />
      </div>
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
import { FormItem, Input, Row, Col, Alert, Button, Popconfirm } from "ant-design-vue";
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  deployment: Deployment;
  playlist: Playlist;
  message: Message;
  duplicateTitles: string[];
}>();

const store = useProgramSpecStore();

const expanded = ref(false);
const titleError = ref(false);

//  Added validation function
// const validateTitle = (title: string) => {
//   const invalidChars = /[\\/:*?<>_|"']/;
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

//  Added handler for real-time input validation
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
