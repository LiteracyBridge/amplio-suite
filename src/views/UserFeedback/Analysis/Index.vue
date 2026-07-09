<script setup lang="ts">
import { PageHeader, Tabs, TabPane } from "ant-design-vue";
import { onMounted, ref, watch } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useAppStore } from "@/store/app.store";
import AnalysisReport from "../components/AnalysisReport.vue";
import DeploymentsLanguageDropdown from "../components/DeploymentsLanguageDropdown.vue";
import AnalyseMessage from "./AnalyseMessage.vue";
import LocationDropdownFilter from "../components/LocationDropdownFilter.vue";
import type { UserFeedbackMessage } from "@/models/uf_message";
import MessagesBrowser from "./MessagesBrowser.vue";

const feedbackStore = useFeedbackAnalysis();
const appStore = useAppStore();

const activeTab = ref("analyse");
const deploymentChanged = ref("");
const selectedLocation = ref<string | null>(null);

// Messages used to derive the location hierarchy
const locationMessages = ref<UserFeedbackMessage[]>([]);
const loadingLocations = ref(false);

const fetchLocations = async () => {
  if (
    !appStore.programCode ||
    !appStore.userFeedback?.deployment ||
    !appStore.userFeedback?.language
  ) {
    locationMessages.value = [];
    return;
  }

  try {
    loadingLocations.value = true;
    const messages = await feedbackStore.fetchSampleMessages();
    locationMessages.value = (messages as UserFeedbackMessage[]) || [];
  } catch (error) {
    console.error("Could not fetch location messages", error);
    locationMessages.value = [];
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
  }
);
</script>

<template>
  <PageHeader sub-title="Analyse user feedback messages" @back="() => $router.go(-1)">
    <template #title>
      <span>{{ feedbackStore.survey?.name || "" }} Analysis</span>
    </template>

    <template #extra>
      <AnalysisReport v-if="feedbackStore.survey != null" class="mr-5" />

      <!-- Cascading location filter (Region → District → Community → Group) -->
      <LocationDropdownFilter
        :messages="locationMessages"
        :loading="loadingLocations"
        :selected-location="selectedLocation"
        @change="(val: string | null) => (selectedLocation = val)"
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
