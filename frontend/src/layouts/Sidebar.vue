<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  MenuItem,
  Image,
  LayoutSider,
  Menu,
  Divider,
} from "ant-design-vue";
import {
  DatabaseOutlined,
  SettingOutlined,
  UserOutlined,
  InsertRowRightOutlined,
} from "@ant-design/icons-vue";
import LogoLarge from "@/assets/images/logo.png";

const collapsed = ref(false);

const config = ref({
  activeMenu: null,
});
</script>

<template>
  <LayoutSider
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    :style="{ minHeight: '100vh', backgroundColor: 'white' }"
    breakpoint="lg"
    :collapsed-width="0"
    width="260px"
  >
    <div class="logo">
      <Image :src="LogoLarge" width="100px"> </Image>
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

      <Menu.SubMenu label="Settings" title="Settings" key="settings">
        <template #icon><SettingOutlined /></template>

        <MenuItem key="manage-users">
          <template #icon><UserOutlined /></template>

          <router-link to="/settings/users">
            <span role="link"> User Management </span>
          </router-link>
        </MenuItem>
        <MenuItem key="manage-programs">
          <template #icon> <DatabaseOutlined /> </template>

          <router-link to="/settings/programs">
            <span role="link"> Programs Management </span>
          </router-link>
        </MenuItem>
      </Menu.SubMenu>

      <Divider></Divider>

      <!-- <MenuItem key="change-programs">
        <router-link to="/settings/change-programs">
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
