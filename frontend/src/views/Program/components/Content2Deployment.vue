<template>
  <Row :gutter="8">
    <Col :span="5">
      <div class="flex">
        <div class="cursor-grab handle mx-2 mt-2 text-gray-600">
          <font-awesome-icon icon="grip-lines" />
        </div>
        <div class="mx-2 mt-2 text-gray-600" @click="onToggleExpanded">
          <font-awesome-icon :icon="icon" size="lg" />
        </div>
        <p class="font-light text-2xl text-gray-800 ml-10">
          Deployment {{ deployment.deploymentnumber }}
        </p>
      </div>
    </Col>

    <Col :span="6">
      <Input
        aria-label="`Deployment ${name}`"
        placeholder="Deployment Name"
        type="text"
        v-model:value="deployment.deploymentname"
      />
    </Col>
    <Col :span="3">
      <Input
        type="date"
        :aria-label="`Start of deployment ${deployment.deploymentname}`"
        v-model:value="deployment.startdate"
      />
    </Col>
    <Col :span="3">
      <Input
        type="date"
        :aria-label="`Start of deployment ${deployment.deploymentname}`"
        v-model:value="deployment.enddate"
      />
    </Col>

    <Col :span="6" align="end">
      <Button
        v-if="expanded"
        type="primary"
        :ghost="true"
        @click="onAddPlaylist()"
        :disabled="!canAddPlaylist"
        class="mr-2"
      >
        Add Playlist
      </Button>

      <Popconfirm
        title="Are you sure delete this deployment?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="onRemoveDeployment()"
      >
        <Button v-if="canRemoveDeployment" :danger="true"> Delete Deployment </Button>
      </Popconfirm>

      <!-- <VButton
        v-if="canRemoveDeployment"
        class="flex-initial my-auto ml-2 border-none"
        iconL="trash-alt"
        variant="warning"
        :ariaLabel="`Remove deployment ${name}`"
        @click="onRemoveDeployment()"
      /> -->
    </Col>
  </Row>

  <!-- <div class="w-full">
    <div class="flex my-2"> -->
  <!-- <div class="cursor-grab handle mx-2 mt-2 text-gray-600">
        <font-awesome-icon icon="grip-lines" />
      </div>
      <div
        class="mx-2 mt-2 text-gray-600"
        style="min-width: 10px"
        @click="onToggleExpanded"
      >
        <font-awesome-icon :icon="icon" size="lg" />
      </div> -->
  <!-- <div>
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
          store.setDeploymentName({
            deployment: deployment,
            deploymentname: $event.target.value,
          })
        "
      /> -->

  <!-- <v-input
        class="-mt-1 mx-2"
        type="date"
        iconLeft="calendar-alt"
        :aria-label="`Start of deployment ${deployment.name}`"
        :value="deployment.startdate"
        @change="
          store.setDeploymentStartdate({
            deployment: deployment,
            startdate: $event.target.value,
          })
        "
        mx="mx-0"
      /> -->
  <!-- <v-input
        class="-mt-1 mx-2"
        type="date"
        iconLeft="calendar-alt"
        :aria-label="`Start of deployment ${deployment.name}`"
        :value="deployment.enddate"
        @change="
          store.setDeploymentEnddate({
            deployment: deployment,
            enddate: $event.target.value,
          })
        "
        mx="mx-0"
      /> -->

  <!-- <button
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
    </div> -->

  <!-- If expanded, show the playlists in the deployment -->
  <div class="my-5" v-if="expanded">
    <content2-playlists :deployment="deployment" />
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import Content2Playlists from "./Content2Playlists.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { Row, Col, Input, Button, Popconfirm } from "ant-design-vue";
import { Deployment } from "@/models/deployment";
import { computed, ref } from "vue";

const props = defineProps<{
  deployment: Deployment;
  canRemove: boolean;
  // index: number;
}>();

const store = useProgramSpecStore();
const expanded = ref(false);
// export default {
//   props: {
//     deployment: {
//       type: Object,
//       required: true,
//     },
//     canRemove: {
//       type: Boolean,
//       default: false,
//     },
//     index: {
//       type: Number,
//       default: -1,
//     },
//   },
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
  let canAdd =
    props.deployment.playlists.length === 0 ||
    props.deployment.playlists[props.deployment.playlists.length - 1].title;
  console.log(`Can add playlist for ${name.value}: ${canAdd}`);
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
