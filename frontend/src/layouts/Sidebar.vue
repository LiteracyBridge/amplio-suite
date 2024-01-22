<script setup lang="ts">
import { computed, ref, watch } from "vue";
// import { useProjectStore } from "@/stores/projects";
// import { useSideNavStore } from "@/stores/side-nav.store";
import { useRouter } from "vue-router";
import {
  MenuItem,
  Image,
  LayoutSider,
  Menu,
  Divider,
  Typography,
  Avatar,
} from "ant-design-vue";
import { UserOutlined } from "@ant-design/icons-vue";
import LogoLarge from "@/assets/images/logo.png";

const collapsed = ref(false);

const config = ref({
  activeMenu: null,
});

const menuItems: Array<{
  label: string;
  path?: string;
  name?: string;
  params?: Record<string, string>;
}> = [
  { label: "Dashboard", path: "/" },
  { label: "Users", path: "/users" },
  // { label: "Background and context", path: "/background-and-context" },
  // {
  //   label: "Project Objectives",
  //   path: "/project-objectives",
  // },
  // { label: "Audiences", path: "/audiences" },
  // { label: "Behavioral Drivers", path: "/drivers" },
  // { label: "SBC Approaches", path: "/interventions" },
  // { label: "Theory of Change", path: "/toc" },
  // { label: "Communications and Messaging", path: "/communications-and-messaging" },
  // { label: "Monitoring and Evaluation", path: "/monitoring-and-evaluation" },
  // {
  //   label: "Project Management",
  //   path: "/project-management",
  // },
  // { label: "Project Documents", path: "/project-documents" },
];

// const projectSelected = computed(
//   () => projectStore.prj_id !== null && projectStore.prj_id !== undefined
// );
// const showSideNav = ref(projectSelected.value);
// const store = useSideNavStore();
// const toggleSideNav = () => {
//   if (showSideNav.value) {
//     store.hide();
//   } else {
//     store.show();
//   }
//   showSideNav.value = !showSideNav.value;
// };

// watch(projectSelected, (newVal) => {
//   if (newVal) {
//     showSideNav.value = true;
//   } else {
//     showSideNav.value = false;
//   }
// });
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
      <Menu.SubMenu label="Settings" title="Settings" key="settings">
        <MenuItem key="manage-users">
          <router-link to="/settings/users">
            <span role="link"> User Management </span>
          </router-link>
        </MenuItem>
        <MenuItem key="manage-programs">
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
