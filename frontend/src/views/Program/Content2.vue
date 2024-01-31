<template>
  <section>
    <div
      id="deployments-container"
      style="font-family: system-ui"
    >
      <!-- Separater line between heading and content -->
      <draggable
        id="deployments-draggable"
        v-model="store.deployments"
        :animation="200"
        handle=".handle"
        ghost-class="moving-item"
        @start="dragging = true"
        @end="dragging = false"
        item-key="deploymentnumber"
      >
        <template #item="{ element: deployment, index: index }">
          <div class="">
            <Content2Deployment
              :deployment="deployment"
              :canRemove="index === store.deployments.length - 1"
              :index="index"
            />
          </div>
        </template>
      </draggable>
    </div>

    <VButton tag="span" label="+ Add Deployment" @click="onAddDeployment" />

    <!-- For modal components -->
    <!-- TODO: REWRITE MODAL IN ANT -->
    <!-- <portal to="modalBody" v-if="showModal">
      <p class="text-xl">{{ modalBody }}</p>
    </portal>

    <portal to="modalFooter" v-if="showModal">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton label="Close" @click="onCloseModal" />
      </footer>
    </portal> -->
  </section>
</template>

<script setup lang="ts">
import Content2Deployment from "./components/Content2Deployment.vue";
import draggable from "vuedraggable";
import VButton from "@/components/VButton.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { useCategoriesStore } from "@/store/categories";
import { ref } from "vue";
import { useRequest } from "vue-request";

// FIXME: deployments order is not preserved when dragging -> Related to state management?

const props = defineProps<{
  programId: string;
}>();

const store = useProgramSpecStore();

const description = ref("Edit your deployment playlists & content on this page."),
  showModal = ref(false),
  dragging = ref(false);

// Download categories
useRequest(useCategoriesStore().fetchCategories, {
  // defaultParams: [],
  onSuccess: (data) => {
    useCategoriesStore().categories = data;
  },
});

// export default {
// props: ["programId"],

// computed: {
//   ...mapState(useProgramSpecStore, ["status", "changed", "deployments"]),
//   ...mapState(useLanguagesStore, {
//     supportedLanguages: (state) => state.languages,
//   }),

//   canSave() {
//     return this.changed;
//   },

//   hasChanges() {
//     return this.changed;
//   },
// },

// data() {
//   return {

//   };
// },

/* External components used in this one */
// components: {
//   Content2Deployment,
//   draggable,
//   Loading,
//   ProgramHeader,
//   VButton,
// },
// methods: {
//   ...mapActions(useProgramSpecStore, [
//     "ensureSpec",
//     "fetchSpec",
//     "updateSpec",

//     "setDeployments",
//     "addDeployment",
//   ]),
//   ...mapActions(useLanguagesStore, ["fetchLanguages"]),
//   // ...mapActions('program', [
//   //   'fetchProgram',
//   // ]),
//   ...mapActions(useCategoriesStore, ["fetchCategories"]),

function onAddDeployment() {
  console.log("Add deployment");
  store.addDeployment();
}

function onSaveChanges() {
  console.log("onSaveChanges");
  // store.printData(store.deployments);
  store.updateSpec();
}

// onMounted
// function onDiscardChanges() {
//   console.log("onDiscardChanges");
//   store.fetchSpec({ programId: store.programId });
// }

//  function printData(deployments, title) {
//     if (title) {
//       console.log(title);
//     }
//     deployments.forEach((depl, ix) => {
//       console.log(
//         `Deployment ${depl.deploymentnumber} @ ${ix}, ${depl.playlists.length} playlists`
//       );
//       depl.playlists.forEach((pl, ix) => {
//         console.log(
//           `    Playlist ${pl.title}, #${pl.position} @ ${ix}, ${pl.messages.length} messages`
//         );
//       });
//     });
//   },
// },

// created() {
//   this.ensureSpec({ programId: this.programId });
//   this.fetchCategories();
//   // this.fetchLanguages();
//   // console.log(`Fetched languages, got ${this.supportedLanguages.length} languages.`);
// },
// };
</script>

<style scoped>
.content2 {
}
</style>
