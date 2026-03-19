<script setup lang="ts">
import { PageHeader, Tabs, TabPane, Select } from "ant-design-vue";
import { onMounted, ref, watch } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useAppStore } from "@/store/app.store";
import AnalysisReport from "../components/AnalysisReport.vue";
import DeploymentsLanguageDropdown from "../components/DeploymentsLanguageDropdown.vue";
import AnalyseMessage from "./AnalyseMessage.vue";
import MessagesBrowser from "./MessagesBrowser.vue";

const feedbackStore = useFeedbackAnalysis();
const appStore = useAppStore();

const activeTab = ref("analyse");
const deploymentChanged = ref("");
const selectedLocation = ref<string | null>(null);
const locationOptions = ref<{ label: string; value: string }[]>([]);
const loadingLocations = ref(false);

// Fetch available locations (group / community / district / region)
const fetchLocations = async () => {
  if (
    !appStore.programCode ||
    !appStore.userFeedback?.deployment ||
    !appStore.userFeedback?.language
  ) {
    locationOptions.value = [];
    return;
  }

  try {
    loadingLocations.value = true;

    // Use sample messages (with recipient info) to derive unique locations
    const messages = await feedbackStore.fetchSampleMessages();

    const groups = new Set<string>();
    const communities = new Set<string>();
    const districts = new Set<string>();
    const regions = new Set<string>();

    for (const m of messages || []) {
      const r = (m as any).recipient || {};
      if (r.group_name) groups.add(r.group_name);
      if (r.community_name) communities.add(r.community_name);
      if (r.district) districts.add(r.district);
      if (r.region) regions.add(r.region);
    }

    const options: { label: string; value: string }[] = [];

    groups.forEach((value) =>
      options.push({
        label: `Group: ${value}`,
        value: `group::${value}`,
      }),
    );
    communities.forEach((value) =>
      options.push({
        label: `Community: ${value}`,
        value: `community::${value}`,
      }),
    );
    districts.forEach((value) =>
      options.push({
        label: `District: ${value}`,
        value: `district::${value}`,
      }),
    );
    regions.forEach((value) =>
      options.push({
        label: `Region: ${value}`,
        value: `region::${value}`,
      }),
    );

    locationOptions.value = options;
  } catch (error) {
    console.log("Could not derive locations from sample messages", error);
    locationOptions.value = [];
  } finally {
    loadingLocations.value = false;
  }
};

onMounted(() => {
  fetchLocations();
});

watch(
  () => deploymentChanged.value,
  () => {
    selectedLocation.value = null;
    fetchLocations();
  },
);
</script>

<template>
  <PageHeader sub-title="Analyse user feedback messages" @back="() => $router.go(-1)">
    <template #title>
      <span> {{ feedbackStore.survey?.name || "" }} Analysis </span>
    </template>

    <template #extra>
      <AnalysisReport v-if="feedbackStore.survey != null" class="mr-5" />

      <Select
        v-model:value="selectedLocation"
        placeholder="Filter by location"
        style="width: 200px"
        :options="locationOptions"
        :loading="loadingLocations"
        allow-clear
      />

      <DeploymentsLanguageDropdown
        @change="(d, l) => (deploymentChanged = d.toString() + '_' + l.toString())"
      />
    </template>
  </PageHeader>

  <Tabs v-model:activeKey="activeTab" centered size="large">
    <TabPane key="analyse" tab="Analyse Feedback">
      <AnalyseMessage
        :deployment-changed="deploymentChanged"
        :selected-location="selectedLocation"
      />
    </TabPane>

    <TabPane key="browser" tab="Browse Feedback Messages">
      <MessagesBrowser />
    </TabPane>
  </Tabs>
</template>
