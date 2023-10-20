<template>
  <section class="relative content2 p-6 pt-0">
    <loading v-if="status !== 'success'" class="-ml-6 rounded-b-lg" />

    <!-- This is the common header, with program name, this panel's title, and save & discard buttons -->
    <program-header
      class="mb-2"
      title="Deployments & Content"
      :changed="hasChanges"
      :canSave="canSave"
      :description="description"
      :onSaveChanges="onSaveChanges"
      :onDiscardChanges="onDiscardChanges"
    />

    <div
      id="deployments-container"
      class="line col-span-9"
      style="font-family: system-ui"
    >
      <!-- Separater line between heading and content -->
      <p class="-mx-6 mb-2 px-6 bg-gray-400 text-xl text-left border-2 border-gray-600" />
      <draggable
        id="deployments-draggable"
        v-model="deployments"
        :animation="200"
        handle=".handle"
        ghost-class="moving-item"
        @start="dragging = true"
        @end="dragging = false"
      >
        <div
          v-for="(deployment, index) in deployments"
          :key="deployment.deploymentnumber"
          class="flex mb-1"
        >
          <content2-deployment
            :deployment="deployment"
            :canRemove="index === deployments.length - 1"
            :index="index"
          />
        </div>
      </draggable>
    </div>

    <VButton tag="span" label="+ Add Deployment" @click="onAddDeployment" />

    <!-- For modal components -->
    <portal to="modalBody" v-if="showModal">
      <p class="text-xl">{{ modalBody }}</p>
    </portal>

    <portal to="modalFooter" v-if="showModal">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton label="Close" @click="onCloseModal" />
      </footer>
    </portal>
  </section>
</template>

<script>
import { mapState, mapActions } from "pinia";

import Content2Deployment from "@/components/Content2Deployment.vue";
import Draggable from "vuedraggable";
import Loading from "@/components/Loading.vue";
import ProgramHeader from "@/components/ProgramHeader.vue";
import VButton from "@/components/VButton.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { useLanguagesStore } from "@/store/languages";
import { useCategoriesStore } from "@/store/categories";

export default {
  props: ["programId"],

  computed: {
    ...mapState(useProgramSpecStore, ["status", "changed", "deployments"]),
    ...mapState(useLanguagesStore, {
      supportedLanguages: (state) => state.languages,
    }),

    canSave() {
      return this.changed;
    },

    hasChanges() {
      return this.changed;
    },

    deployments: {
      get() {
        return this.deployments;
      },
      set(newValue) {
        this.printData(this.deployments, "From");
        this.setDeployments({ deployments: newValue });
        this.printData(this.deployments, "To");
      },
    },
  },

  data() {
    return {
      description: "Edit your deployment playlists & content on this page.",
      showModal: false,
    };
  },

  /* External components used in this one */
  components: {
    Content2Deployment,
    Draggable,
    Loading,
    ProgramHeader,
    VButton,
  },
  methods: {
    ...mapActions(useProgramSpecStore, [
      "ensureSpec",
      "fetchSpec",
      "updateSpec",

      "setDeployments",
      "addDeployment",
    ]),
    ...mapActions(useLanguagesStore, ["fetchLanguages"]),
    // ...mapActions('program', [
    //   'fetchProgram',
    // ]),
    ...mapActions(useCategoriesStore, ["fetchCategories"]),

    onAddDeployment() {
      console.log("Add deployment");
      this.addDeployment();
    },

    onSaveChanges() {
      console.log("onSaveChanges");
      this.printData(this.deployments);
      this.updateSpec();
    },

    onDiscardChanges() {
      console.log("onDiscardChanges");
      this.fetchSpec({ programId: this.programId });
    },

    printData(deployments, title) {
      if (title) {
        console.log(title);
      }
      deployments.forEach((depl, ix) => {
        console.log(
          `Deployment ${depl.deploymentnumber} @ ${ix}, ${depl.playlists.length} playlists`
        );
        depl.playlists.forEach((pl, ix) => {
          console.log(
            `    Playlist ${pl.title}, #${pl.position} @ ${ix}, ${pl.messages.length} messages`
          );
        });
      });
    },
  },

  created() {
    this.ensureSpec({ programId: this.programId });
    this.fetchCategories();
    this.fetchLanguages();
    console.log(`Fetched languages, got ${this.supportedLanguages.length} languages.`);
  },
};
</script>

<style scoped>
.content2 {
}
</style>
