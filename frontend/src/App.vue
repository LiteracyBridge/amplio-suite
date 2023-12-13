<template>
  <ConfigProvider
    :theme="{
      token: {
        colorPrimary: '#289b6a',
      },
    }"
  >
    <component :is="layout" id="app" class="bg-gray-100 font-sans">
      <router-view />
    </component>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ConfigProvider } from "ant-design-vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const layout = computed(() => {
  return (route.meta.layout || "default") + "-layout";
});
</script>
