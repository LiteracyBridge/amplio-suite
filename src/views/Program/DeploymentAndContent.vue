<template>
  <section>
    <div id="deployments-container">
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

      /// this is the previous implementation on how deployments are removed
      /// it check the "canRemove" boolean if it is the last index in the list.
      /// if so then it the delete button appears on the last deployment created. 

        <!-- <template #item="{ element: deployment, index: index }">
          <div class="my-3">
            <Content2Deployment
              :deployment="deployment"
              :canRemove="index === store.deployments.length - 1" 
            />
          </div>
        </template> -->

        /// this new implementation check if the the 
        /// created deployment is not been deployed and there are no playlist items in it.
        
        <template #item="{ element: deployment, index: index }">
          <div class="my-3">
            <Content2Deployment
              :deployment="deployment"
             :canRemove="!deployment.deployed && deployment.playlists.length === 0"
            />
          </div>
        </template>
      </draggable>
    </div>

    <Divider></Divider>

    <Button :ghost="true" type="primary" @click="onAddDeployment" class="mt-5 ml-3"
      >+ Add Deployment</Button
    >
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
import { Button, Divider } from "ant-design-vue";

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
