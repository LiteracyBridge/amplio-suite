<template>
  <div class="tag-deployment">
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
        <content2-playlist :deployment="deployment" :playlist="playlist" />
      </template>
    </draggable>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";

import content2Playlist from "@/components/Content2Playlist.vue";
import Draggable from "vuedraggable";

export default {
  props: {
    deployment: {
      type: Object,
      required: true,
    },
  },

  components: {
    content2Playlist,
    Draggable,
  },

  computed: {
    ...mapState("programspec", ["deployments"]),

    playlists: {
      get() {
        return this.deployment.playlists;
      },

      set(newValue) {
        this.setPlaylists({ deployment: this.deployment, playlists: newValue });
      },
    },
  },

  methods: {
    ...mapActions("programspec", ["setPlaylists"]),
  },
};
</script>
