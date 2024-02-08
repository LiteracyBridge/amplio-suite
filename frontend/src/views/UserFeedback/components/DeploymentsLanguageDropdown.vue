<script setup lang="ts">

import { Button, Dropdown, MenuItem, SubMenu, Menu } from "ant-design-vue";
import { useAppStore } from "@/store/app.store";
import { DownOutlined } from "@ant-design/icons-vue";

const emit = defineEmits<{
  (e: "change", deployment: number, language: string): void;
}>();

const store = useAppStore();

const onLanguageDeploymentChanged = (deployment: number, language: string) => {
  store.userFeedback ??= { deployment, language, surveyId: null };
  store.userFeedback.deployment = deployment;
  store.userFeedback.language = language;

  emit("change", deployment, language);
};
</script>

<template>
  <Dropdown>
    <template #overlay>
      <Menu>
        <SubMenu :key="d.deploymentnumber" v-for="d in store.deployments">
          <template #title>
            <span>Deployment {{ d.deploymentnumber }}</span>
          </template>
          <MenuItem
            :key="lang"
            v-for="lang in store.languages"
            @click="onLanguageDeploymentChanged(d.deploymentnumber, lang)"
            >{{ lang }}</MenuItem
          >
        </SubMenu>
      </Menu>
    </template>

    <Button>
      Change Deployment
      <DownOutlined />
    </Button>
  </Dropdown>
</template>
