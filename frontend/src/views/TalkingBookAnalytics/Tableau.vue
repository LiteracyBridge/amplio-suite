<template>
  <PageHeader
    :title="store.programName + ' Analytics'"
    sub-title="Visualize program statistics"
  >
  </PageHeader>

  <div id="tableauHolder" :class="tableauVisibility">
    <tableau-viz id="tableauViz" toolbar="hidden"> </tableau-viz>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAppStore } from "@/store/app.store";
import { ApiRequest } from "@/api";
import { useRequest } from "vue-request";
import { RequestCacheKeys } from "@/models/constants";
import { PageHeader } from "ant-design-vue";

//
// Setup Tableau
//
const tableauScript = document.createElement("script");
tableauScript.setAttribute("type", "module");
tableauScript.setAttribute(
  "src",
  "https://online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"
);
document.head.appendChild(tableauScript);
//
// End: Setup Tableau
//

const store = useAppStore();

const jwt = ref(null);

// Fetch jwt key
const workbook = computed(() => {
  return `https://10ay.online.tableau.com/t/amplio/views/${store.programCode}/Dashboard1?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link`;
});

const tableauVisibility = computed(() => {
  const gotJwt = !(!jwt || jwt["error"] === "Not found");
  // 'visually_hidden' leaves the TableauWiz in a state from which it never recovers, so it never appears.
  // Instead, use the traditional "display: none;" style.
  return gotJwt ? "" : "noTableau";
});

onMounted(async () => {
  useRequest(
    () => {
      return ApiRequest.get<string>("tableau/jwt");
    },
    {
      cacheTime: 24 * 60 * 60 * 1000, // 24 hours
      cacheKey: RequestCacheKeys.tableau_jwt,
      onSuccess: ([token]) => {
        jwt.value = token;
        const viz: any = document.getElementById("tableauViz");
        viz.token = jwt.value;
        viz.src = workbook.value;
      },
    }
  );
});
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
/* Used to show/hide the TableauViz component. */
.noTableau {
  display: none;
}
</style>
