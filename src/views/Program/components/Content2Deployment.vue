<template>
  <div class="bg-slate-100/80 border border-slate-200 rounded-lg p-2.5 my-2.5">
    <div class="flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
      <div class="flex items-center gap-2 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
        <Button
          type="text"
          size="middle"
          @click="onToggleExpanded"
          class="flex items-center gap-1.5 font-bold text-gray-800 !px-2 flex-shrink-0"
        >
          <CaretRightOutlined v-if="!expanded" class="text-xs text-gray-600" />
          <CaretDownOutlined v-else class="text-xs text-gray-600" />
          <span>Deployment {{ deployment.deploymentnumber }}</span>
        </Button>

        <div class="w-48 min-w-[140px] flex-shrink-0">
          <Input
            aria-label="`Deployment ${name}`"
            placeholder="Deployment Name"
            type="text"
            size="middle"
            v-model:value="deployment.deploymentname"
          />
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0">
          <span class="text-xs text-gray-500 font-medium">From:</span>
          <Input
            type="date"
            size="middle"
            :aria-label="`Start of deployment ${deployment.deploymentname}`"
            v-model:value="deployment.start_date"
            class="w-36"
          />
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0">
          <span class="text-xs text-gray-500 font-medium">To:</span>
          <Input
            type="date"
            size="middle"
            :aria-label="`End of deployment ${deployment.deploymentname}`"
            v-model:value="deployment.end_date"
            class="w-36"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <Button
          v-if="expanded"
          type="primary"
          :ghost="true"
          @click="onAddPlaylist()"
          :disabled="!canAddPlaylist"
          class="flex items-center gap-1"
        >
          <template #icon><PlusOutlined /></template>
          Add Playlist
        </Button>

        <Popconfirm
          v-if="canRemoveDeployment"
          title="Are you sure delete this deployment?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="onRemoveDeployment()"
        >
          <Button :danger="true">Delete</Button>
        </Popconfirm>
      </div>
    </div>

    <!-- If expanded, show the playlists in the deployment -->
    <div class="mt-2.5" v-if="expanded">
      <content2-playlists :deployment="deployment" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Content2Playlists from "./Content2Playlists.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { Input, Button, Popconfirm } from "ant-design-vue";
import type { Deployment } from "@/models/deployment";
import { computed, ref } from "vue";
import {
  CaretDownOutlined,
  CaretRightOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";

const props = defineProps<{
  deployment: Deployment;
  canRemove: boolean;
  // index: number;
}>();

const store = useProgramSpecStore();
const expanded = ref(false);
const name = computed(() => {
  // get() {
  return props.deployment.deploymentname || props.deployment.deployment;
  // },
  // set(newValue) {
  //   store.setDeploymentName({ deployment: props.deployment, deploymentname: newValue });
  // },
});

// const canRemove = computed(() => {
//   return (props.deployment.playlists || []).length > 1;
// });

const canAddPlaylist = computed(() => {
  // No playlists at all, or some playlists and final playlist has a name.
  const canAdd =
    props.deployment.playlists.length === 0 ||
    props.deployment.playlists[props.deployment.playlists.length - 1].title;
  return canAdd;
});

const canRemoveDeployment = computed(() => {
  // get() {
  // If caller said it is OK, the playlist is empty, and this deployment's never been deployed, add the
  // delete icon.
  return (
    props.canRemove &&
    props.deployment.playlists.length === 0 &&
    !props.deployment.deployed
  );
  // },
});

const icon = computed(() => {
  return expanded.value ? "caret-down" : "caret-right";
});

// computed: {
// icon() {
//   return this.expanded ? "caret-down" : "caret-right";
// },

// canAddPlaylist() {
//   // No playlists at all, or some playlists and final playlist has a name.
//   let canAdd =
//     this.deployment.playlists.length === 0 ||
//     this.deployment.playlists[this.deployment.playlists.length - 1].title;
//   console.log(`Can add playlist for ${this.name}: ${canAdd}`);
//   return canAdd;
// },

// canRemoveDeployment: {
//   get() {
//     // If caller said it is OK, the playlist is empty, and this deployment's never been deployed, add the
//     // delete icon.
//     return (
//       this.canRemove &&
//       this.deployment.playlists.length === 0 &&
//       !this.deployment.deployed
//     );
//   },
// },

//   name: {
//     get() {
//       return this.deployment.deploymentname || this.deployment.deployment;
//     },
//     set(newValue) {
//       this.setDeploymentName({ deployment: this.deployment, deploymentname: newValue });
//     },
//   },
// },

// components: {
//   Content2Playlists,
//   VButton,
//   VInput,
// },

// data() {
//   return {
//     expanded: false,
//   };
// },

// methods: {
//   ...mapActions(useProgramSpecStore, [
//     "removeDeployment",
//     "setDeploymentStartdate",
//     "setDeploymentEnddate",
//     "setDeploymentName",
//     "addPlaylist",
//   ]),

function onToggleExpanded() {
  expanded.value = !expanded.value;
}

function onAddPlaylist() {
  if (canAddPlaylist.value) {
    store.addPlaylist({ deployment: props.deployment });
  }
}

function onRemoveDeployment() {
  console.log("Delete this deployment");
  store.removeDeployment(props.deployment);
}
//   },
// };
</script>
