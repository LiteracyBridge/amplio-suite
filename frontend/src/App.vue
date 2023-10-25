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

<script>
import { ConfigProvider } from "ant-design-vue";

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || "default") + "-layout";
    },
  },
  components: {
    ConfigProvider,
  },
};
</script>
