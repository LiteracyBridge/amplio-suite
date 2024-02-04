<template>
  <section>
    <div id="deployments-container" style="font-family: system-ui">
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
            />
          </div>
        </template>
      </draggable>
    </div>

    <VButton tag="span" label="+ Add Deployment" @click="onAddDeployment" />
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

const props = defineProps<{
  programId: string;
}>();

const store = useProgramSpecStore();

const dragging = ref(false);

// Download categories
useRequest(useCategoriesStore().fetchCategories, {
  // defaultParams: [],
  onSuccess: (data) => {
    useCategoriesStore().categories = data;
  },
});

function onAddDeployment() {
  console.log("Add deployment");
  store.addDeployment();
}
</script>
