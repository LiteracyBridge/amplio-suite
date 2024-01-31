<template>
  <draggable
    v-model="playlists"
    :animation="200"
    handle=".pl-handle"
    group="playlists"
    ghost-class="moving-item"
    @start="dragging = true"
    @end="dragging = false"
    item-key="position"
  >
    <template #item="{ element: playlist, index: index }">
      <div>
        <content2-playlist :deployment="deployment" :playlist="playlist" />
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import content2Playlist from "./Content2Playlist.vue";
import Draggable from "vuedraggable";
import { Deployment } from "@/models/deployment";
import { useProgramSpecStore } from "@/store/programspec";
import { computed, ref } from "vue";

const props = defineProps<{
  deployment: Deployment;
}>();

const store = useProgramSpecStore();

const dragging = ref(false);

const playlists = computed({
  get() {
    return props.deployment.playlists;
  },

  set(newValue) {
    store.setPlaylists({ deployment: props.deployment, playlists: newValue });
  },
});
</script>
