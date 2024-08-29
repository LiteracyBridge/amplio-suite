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
      <Input v-model:value="playlist.title" placeholder="Playlist Title" />
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

  <div class="my-4 ml-20 ">
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
import { Row, Col, Input, Button, Popconfirm } from "ant-design-vue";
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
const expanded = ref(false),
  dragging = ref(false);

const canAddMessage = computed(() => {
  return (
    props.playlist.title &&
    (props.playlist.messages.length === 0 ||
      props.playlist.messages[props.playlist.messages.length - 1].title)
  );
});

const canRemovePlaylist = computed(() => {
  return props.playlist.messages.length > 1;
});

const duplicateTitles = computed(() => {
  const titles = messages.value.map((message) => message.title);
  const duplicates = titles.filter(
    ((theSet) => (aString) => theSet.has(aString) || !theSet.add(aString))(new Set())
  );
  return duplicates;
});

const icon = computed(() => {
  return expanded.value ? "caret-down" : "caret-right";
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
    store.addMessage({ deployment: props.deployment, playlist: props.playlist });
  }
}

function onRemovePlaylist() {
  if (canRemovePlaylist.value) {
    store.removePlaylist({ deployment: props.deployment, playlist: props.playlist });
  }
}
</script>
