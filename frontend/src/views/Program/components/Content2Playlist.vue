<template>
  <Row :gutter="8">
    <Col :span="3">
      <div class="flex">
        <div class="cursor-grab pl-handle ml-10 mr-2">
          <font-awesome-icon icon="grip-lines" />
        </div>
        <div class="mx-2" style="min-width: 10px" @click="onToggleExpanded">
          <font-awesome-icon :icon="icon" size="lg" />
        </div>

        <span class="flex-initial text-xl ml-3">Playlist {{ playlist.position }}:</span>
      </div>
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
        >Delete Playlist</Button>
      </Popconfirm>
    </Col>
  </Row>

  <div class="flex mb-2">
    <div class="cursor-grab pl-handle ml-10 mr-2">
      <font-awesome-icon icon="grip-lines" />
    </div>
    <div class="mx-2" style="min-width: 10px" @click="onToggleExpanded">
      <font-awesome-icon :icon="icon" size="lg" />
    </div>
    <div class="w-full tag-playlist">
      <div class="flex font-light text-gray-800">
        <span class="flex-initial text-xl">Playlist {{ playlist.position }}:</span>
        <!-- -mt-1 to push the input up just a bit, to better align with the label -->
        <!-- <input
          class="flex-auto mx-2 px-1 -mt-1 border rounded-sm text-xl text-black"
          :class="
            !title || title.length === 0 ? 'invalid border-red-500 border-2 rounded' : ''
          "
          v-model="title"
          placeholder="Playlist Title"
        /> -->
        <!-- <button
          v-if="expanded"
          class="btn text-base"
          @click="onAddMessage()"
          :disabled="!canAddMessage"
        >
          Add Message
        </button> -->

        <!-- <VButton
          v-if="canRemovePlaylist"
          class="flex-initial my-auto ml-2 border-none"
          iconL="trash-alt"
          variant="warning"
          :ariaLabel="`Delete playlist ${title}`"
          @click="onRemovePlaylist()"
        /> -->
      </div>

      <div class="tag-message-container" v-if="expanded">
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
            <div :key="index" class="flex tag-message">
              <content2-message
                class="w-full"
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
  </div>
</template>

<script lang="ts" setup>
import Content2Message from "@/components/Content2Message.vue";
import Draggable from "vuedraggable";
import { Row, Col, Input, Button, Popconfirm } from "ant-design-vue";
import { useProgramSpecStore } from "@/store/programspec";
import { Deployment } from "@/models/deployment";
import { Playlist } from "@/models/playlist";
import { ref, computed } from "vue";

const props = defineProps<{
  deployment: Deployment;
  playlist: Playlist;
}>();

const store = useProgramSpecStore();
const expanded = ref(false),
  dragging = ref(false);
// export default {
//   props: {
//     deployment: {
//       type: Object,
//       required: true,
//     },

//     playlist: {
//       type: Object,
//       required: true,
//     },
//   },

//   components: {
//     Content2Message,
//     Draggable,
//     VButton,
//   },

// computed: {
//   ...mapState(useProgramSpecStore, ["deployments"]),

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

// const title = computed({
//   get() {
//     return props.playlist.title;
//   },
//   set(newValue) {
//     store.setPlaylistTitle({
//       deployment: this.deployment,
//       playlist: this.playlist,
//       title: newValue,
//     });
//   },
// });

// const audience = computed({
//   get() {
//     if (!props.playlist.audience || props.playlist.audience === "null") return "";
//     return props.playlist.audience;
//   },
//   set(newValue) {
//     store.setPlaylistAudience({
//       deployment: this.deployment,
//       playlist: this.playlist,
//       audience: newValue,
//     });
//   },
// });

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

// data() {
//   return {
//     expanded: false,
//   };
// },

// methods: {
//   ...mapActions(useProgramSpecStore, [
//     "removePlaylist",
//     "setPlaylistTitle",
//     "setPlaylistAudience",
//     "setMessages",
//     "addMessage",
//   ]),
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

<style scoped></style>
