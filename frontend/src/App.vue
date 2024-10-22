<template>
  <!-- <AppLoadingIndicator v-if="useAppStore().loading" /> -->

  <ConfigProvider
    :theme="{
      token: {
        colorPrimary: '#289b6a',
      },
      hashed: false,
    }"
  >
    <component :is="layout">
      <router-view />
    </component>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ConfigProvider } from "ant-design-vue";
import { onMounted } from "vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getUser } from "./router";
import AppLoadingIndicator from "./components/AppLoadingIndicator.vue";
import { useAppStore } from "./store/app.store";

const route = useRoute();
const layout = computed(() => {
  return `${route.meta.layout || "default"}-layout`;
});

onMounted(() => {
  try {
    getUser();
  } catch (ignore) {}
});
</script>
