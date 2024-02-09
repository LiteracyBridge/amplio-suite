<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { MenuItem, Image, LayoutSider, Menu, Divider } from "ant-design-vue";
import {
  DatabaseOutlined,
  SettingOutlined,
  UserOutlined,
  InsertRowRightOutlined,
  SoundOutlined,
  DotChartOutlined,
  MonitorOutlined,
  BuildOutlined,
EditOutlined,
} from "@ant-design/icons-vue";
import LogoLarge from "@/assets/images/logo.png";
import { useAppStore } from "@/store/app.store";

const store = useAppStore();
const config = ref({
  activeMenu: null,
});
</script>

<template>
  <LayoutSider
    v-model:collapsed="store.sidebarCollapsed"
    :trigger="null"
    collapsible
    :style="{ minHeight: '100vh', backgroundColor: 'white' }"
    breakpoint="lg"
    width="260px"
  >
    <div class="logo">
      <Image :src="LogoLarge" width="100px" v-if="!store.sidebarCollapsed"> </Image>
    </div>

    <Divider></Divider>

    <Menu v-model:selectedKeys="config.activeMenu" theme="light" mode="inline">
      <!-- FIXME: Add permission check here -->

      <MenuItem key="program-spec">
        <template #icon>
          <InsertRowRightOutlined />
        </template>

        <router-link to="/programs/spec">
          <span role="link"> Program Specification </span>
        </router-link>
      </MenuItem>

      <MenuItem key="monitoring">
        <template #icon>
          <MonitorOutlined />
        </template>

        <router-link to="/programs/monitor">
          <span role="link">TB Monitoring Center </span>
        </router-link>
      </MenuItem>

      <!-- <Menu.SubMenu
        label="Talking Book Analytics"
        title="Talking Book Analytics"
        key="tb-analytics"
      >
        <template #icon>
          <SoundOutlined />
        </template>

        <MenuItem key="installations">
          <template #icon> <DotChartOutlined /> </template>

          <router-link to="/tb-analytics/installations">
            <span role="link"> Installations </span>
          </router-link>
        </MenuItem>
      </Menu.SubMenu> -->

       <Menu.SubMenu label="User Feedback" title="User Feedback" key="user-feedback">
        <template #icon>
          <SoundOutlined />
        </template>

        <MenuItem key="analyze">
          <template #icon> <DotChartOutlined /> </template>

          <router-link to="/user-feedback/analyze">
            <span role="link"> Analyze </span>
          </router-link>
        </MenuItem>

        <MenuItem key="review">
          <template #icon> <EditOutlined /> </template>

          <router-link to="/user-feedback/review">
            <span role="link"> Review </span>
          </router-link>
        </MenuItem>

        <MenuItem key="survey-builder">
          <template #icon> <BuildOutlined /> </template>
          <router-link to="/user-feedback/surveys">
            <span role="link"> Survey Builder </span>
          </router-link>
        </MenuItem>
      </Menu.SubMenu>

      <Menu.SubMenu label="Admin" title="Admin" key="admin">
        <template #icon><SettingOutlined /></template>

        <MenuItem key="manage-users">
          <template #icon><UserOutlined /></template>

          <router-link to="/admin/users">
            <span role="link"> Manage Users </span>
          </router-link>
        </MenuItem>
        <MenuItem key="manage-programs">
          <template #icon> <DatabaseOutlined /> </template>

          <router-link to="/admin/programs">
            <span role="link"> Manage Programs </span>
          </router-link>
        </MenuItem>
      </Menu.SubMenu>

      <Divider></Divider>

      <!-- <MenuItem key="change-programs">
        <router-link to="/admin/change-programs">
          <span role="link"> Programs </span>
        </router-link>
      </MenuItem> -->
    </Menu>
  </LayoutSider>
</template>

<style scoped>
.logo {
  height: 30px;
  display: center;
  /* background: rgba(255, 255, 255, 0.3); */
  margin: 20px 20px 0px 20px;
  /* margin-left: 40px; */
  /* padding-top: 8px; */
  /* color: white; */
  text-align: center;
  /* font-size: 30px; */
}

#logo-image {
  max-width: fit-content;
  max-height: fit-content;
  height: 50px;
  padding-right: 8px;
}
</style>
