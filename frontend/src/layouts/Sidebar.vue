<script setup lang="ts">
import { ref } from "vue";
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
  BarChartOutlined,
  EditOutlined,
  DownloadOutlined,
  AreaChartOutlined
} from "@ant-design/icons-vue";
import LogoLarge from "@/assets/images/logo.png";
import { useAppStore } from "@/store/app.store";
import { useAccountStore } from "@/store/account";
import { Permission } from "@/models/role";

const store = useAppStore();
const account = useAccountStore();

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

    <hr class="mt-7 mb-1" />
    <Menu v-model:selectedKeys="config.activeMenu" theme="light" mode="inline">
      <!-- FIXME: Add permission check here -->

      <MenuItem key="program-spec" v-if="account.can(Permission.manage_specification)">
        <template #icon>
          <InsertRowRightOutlined />
        </template>

        <router-link to="/programs/spec">
          <span role="link"> Program Specification </span>
        </router-link>
      </MenuItem>

      <MenuItem key="monitoring" v-if="account.can(Permission.view_deployment_status)">
        <template #icon>
          <MonitorOutlined />
        </template>

        <router-link to="/programs/monitor">
          <span role="link">Monitoring Center </span>
        </router-link>
      </MenuItem>

      <Menu.SubMenu
        label="Talking Book Analytics"
        title="Talking Book Analytics"
        key="tb-analytics"
        v-if="account.can([Permission.view_tb_analytics])"
      >
        <template #icon>
          <AreaChartOutlined />
        </template>

        <MenuItem key="tableau">
          <template #icon> <BarChartOutlined /> </template>

          <router-link to="/tb-analytics/tableau">
            <span role="link"> Tableau Analytics </span>
          </router-link>
        </MenuItem>
        <!-- <MenuItem key="installations">
          <template #icon> <DotChartOutlined /> </template>

          <router-link to="/tb-analytics/installations">
            <span role="link"> Installations </span>
          </router-link>
        </MenuItem> -->
      </Menu.SubMenu>

      <Menu.SubMenu
        label="User Feedback"
        title="User Feedback"
        key="user-feedback"
        v-if="
          account.can([
            Permission.manage_survey,
            Permission.analyse_survey,
            Permission.review_analysis,
          ])
        "
      >
        <template #icon>
          <SoundOutlined />
        </template>

        <MenuItem key="analyze" v-if="account.can(Permission.analyse_survey)">
          <template #icon> <DotChartOutlined /> </template>

          <router-link to="/user-feedback/analyze">
            <span role="link"> Analyze </span>
          </router-link>
        </MenuItem>

        <MenuItem key="review" v-if="account.can(Permission.review_analysis)">
          <template #icon> <EditOutlined /> </template>

          <router-link to="/user-feedback/review">
            <span role="link"> Review </span>
          </router-link>
        </MenuItem>

        <MenuItem key="survey-builder" v-if="account.can(Permission.manage_survey)">
          <template #icon> <BuildOutlined /> </template>
          <router-link to="/user-feedback/surveys">
            <span role="link"> Survey Builder </span>
          </router-link>
        </MenuItem>
      </Menu.SubMenu>

      <Menu.SubMenu
        label="Admin"
        title="Admin"
        key="admin"
        v-if="account.can([Permission.manage_staff, Permission.manage_program])"
      >
        <template #icon><SettingOutlined /></template>

        <MenuItem key="manage-users">
          <template #icon><UserOutlined /></template>

          <router-link to="/admin/users" v-if="account.can(Permission.manage_staff)">
            <span role="link"> Manage Users </span>
          </router-link>
        </MenuItem>
        <MenuItem key="manage-programs" v-if="account.can(Permission.manage_program)">
          <template #icon> <DatabaseOutlined /> </template>

          <router-link to="/admin/programs">
            <span role="link"> Manage Programs </span>
          </router-link>
        </MenuItem>
      </Menu.SubMenu>

      <MenuItem key="softwares">
        <template #icon> <DownloadOutlined /> </template>
        <router-link to="/download">
          <span role="link">Software Download</span>
        </router-link>
      </MenuItem>

      <Divider></Divider>
    </Menu>
  </LayoutSider>
</template>

<style scoped>
.logo {
  height: 65px;
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
