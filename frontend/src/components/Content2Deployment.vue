<template>
  <div class="w-full">
    <div class="flex my-2">
      <div class="cursor-grab handle mx-2 mt-2 text-gray-600">
        <font-awesome-icon icon="grip-lines" />
      </div>
      <div
        class="mx-2 mt-2 text-gray-600"
        style="min-width: 10px"
        @click="onToggleExpanded"
      >
        <font-awesome-icon :icon="icon" size="lg" />
      </div>
      <div>
        <p class="font-light text-2xl text-gray-800">
          Deployment {{ deployment.deploymentnumber }}
        </p>
      </div>
      <v-input
        aria-label="`Deployment ${name}`"
        placeholder="Deployment Name"
        :class="
          !name || name.length === 0 ? 'invalid border-red-500 border-2 rounded' : ''
        "
        type="text"
        :name="`Deployment ${name}`"
        mx="-mt-1 mx-2"
        :value="name"
        @change="
          setDeploymentName({
            deployment: deployment,
            deploymentname: $event.target.value,
          })
        "
      />

      <v-input
        class="-mt-1 mx-2"
        type="date"
        iconLeft="calendar-alt"
        :aria-label="`Start of deployment ${deployment.name}`"
        :value="deployment.startdate"
        @change="
          setDeploymentStartdate({
            deployment: deployment,
            startdate: $event.target.value,
          })
        "
        mx="mx-0"
      />
      <v-input
        class="-mt-1 mx-2"
        type="date"
        iconLeft="calendar-alt"
        :aria-label="`Start of deployment ${deployment.name}`"
        :value="deployment.enddate"
        @change="
          setDeploymentEnddate({ deployment: deployment, enddate: $event.target.value })
        "
        mx="mx-0"
      />

      <button
        v-if="expanded"
        class="btn"
        @click="onAddPlaylist()"
        :disabled="!canAddPlaylist"
      >
        Add Playlist
      </button>

      <VButton
        v-if="canRemoveDeployment"
        class="flex-initial my-auto ml-2 border-none"
        iconL="trash-alt"
        variant="warning"
        :ariaLabel="`Remove deployment ${name}`"
        @click="onRemoveDeployment()"
      />
    </div>

    <!-- If expanded, show the playlists in the deployment -->
    <div class="my-2" v-if="expanded">
      <content2-playlists :deployment="deployment" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";

import Content2Playlists from "@/components/Content2Playlists.vue";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import { useProgramSpecStore } from "@/store/programspec";

export default {
  props: {
    deployment: {
      type: Object,
      required: true,
    },
    canRemove: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: -1,
    },
  },

  computed: {
    icon() {
      return this.expanded ? "caret-down" : "caret-right";
    },

    canAddPlaylist() {
      // No playlists at all, or some playlists and final playlist has a name.
      let canAdd =
        this.deployment.playlists.length === 0 ||
        this.deployment.playlists[this.deployment.playlists.length - 1].title;
      console.log(`Can add playlist for ${this.name}: ${canAdd}`);
      return canAdd;
    },

    canRemoveDeployment: {
      get() {
        // If caller said it is OK, the playlist is empty, and this deployment's never been deployed, add the
        // delete icon.
        return (
          this.canRemove &&
          this.deployment.playlists.length === 0 &&
          !this.deployment.deployed
        );
      },
    },

    name: {
      get() {
        return this.deployment.deploymentname || this.deployment.deployment;
      },
      set(newValue) {
        this.setDeploymentName({ deployment: this.deployment, deploymentname: newValue });
      },
    },
  },

  components: {
    Content2Playlists,
    VButton,
    VInput,
  },

  data() {
    return {
      expanded: false,
    };
  },

  methods: {
    ...mapActions(useProgramSpecStore, [
      "removeDeployment",
      "setDeploymentStartdate",
      "setDeploymentEnddate",
      "setDeploymentName",
      "addPlaylist",
    ]),

    onToggleExpanded() {
      this.expanded = !this.expanded;
    },

    onAddPlaylist() {
      if (this.canAddPlaylist) {
        this.addPlaylist({ deployment: this.deployment });
      }
    },

    onRemoveDeployment() {
      console.log("Delete this deployment");
      this.removeDeployment({ deployment: this.deployment });
    },
  },
};
</script>
