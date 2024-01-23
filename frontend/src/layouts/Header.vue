<script setup lang="ts">
import { ref } from "vue";
import { Auth } from "aws-amplify";
// import { useUserStore } from "@/stores/user";
// import { useSideNavStore } from "@/stores/side-nav.store";
import { useRouter } from "vue-router";
import {
  AppstoreFilled,
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  AccountBookOutlined,
} from "@ant-design/icons-vue";
import {
  Popconfirm,
  Menu,
  Select,
  DropdownButton,
  LayoutHeader,
  MenuItem,
  Space,
  Dropdown,
  Button,
  message,
  Divider,
  Tooltip,
  SelectOption,
  Modal,
} from "ant-design-vue";
import { useAppStore } from "@/store/app.store";
import { useAccountStore } from "@/store/account";
// import { useProjectStore } from "@/stores/projects";
// import Profile from "@/views/Profile.vue";
// import FeedbackModal from "@/components/FeedbackModal.vue";

const router = useRouter();
const userStore = useAccountStore();
const appStore = useAppStore();
// const projectStore = useProjectStore();

const profileVisible = ref(false),
  feedbackModalVisible = ref(false);

// async function signOut() {
//   try {
//     await Auth.signOut().then((resp) => {
//       userStore.setUser();
//       sideNavStore.hide();

//       router.push("/login");
//       window.location.reload();
//     });
//   } catch (error) {
//     userStore.setUser();
//     router.push("/login");

//     window.location.reload();
//     console.log("error signing out: ", error);
//   }
// }

// function changeProject(prjId: number) {
//   if (prjId == projectStore.prj_id) return;

//   const project = projectStore.user_projects.find((prj) => prj.prj_id == prjId);

//   message.success(`Switching to ${project?.project?.name}`);

//   projectStore.setPrj(prjId, false).then(() => window.location.reload());
//   // router.push('/forms/basic');
// }

function changeProgram(val: number) {
  Modal.confirm({
    title: "Are you sure you want to change program?",
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      appStore.setActiveProgram(val);
      router.push("/");
    },
  });
}
</script>

<template>
  <Profile :visible="profileVisible" @close="profileVisible = false"></Profile>

  <!-- <FeedbackModal :visible="feedbackModalVisible" @close="feedbackModalVisible = false">
  </FeedbackModal> -->

  <LayoutHeader
    :has-sider="true"
    style="background: #289b6a; padding: 0px 16px 0px 0px; color: white"
  >
    <div id="header-items">
      <div>
        <MenuUnfoldOutlined
          v-if="appStore.sidebarVisible"
          class="trigger"
          @click="() => (appStore.sidebarVisible = !appStore.sidebarVisible)"
        />
        <MenuUnfoldOutlined
          v-else
          class="trigger"
          @click="() => (appStore.sidebarVisible = !appStore.sidebarVisible)"
        />

        <Select
          v-model:value="appStore.activeProgram.id"
          :show-search="true"
          :filter-option="true"
          class="w-96"
          placeholder="Select a program"
          @change="changeProgram($event as number)"
        >
          <SelectOption
            v-for="item in userStore.programs"
            :key="item.id"
            :value="item.id"
            :label="item.project?.name"
          >
            {{ item.project.name }} ({{ item.program_id }})
          </SelectOption>
        </Select>
      </div>

      <div>
        <Dropdown trigger="hover" class="mr-5">
          <Button>
            {{ userStore.user?.name }}

            <template #icon>
              <UserOutlined />
            </template>
          </Button>

          <template #overlay>
            <Menu>
              <MenuItem key="projects">
                <RouterLink to="/projects">
                  <AppstoreOutlined />
                  <span> Manage Projects </span>
                </RouterLink>
              </MenuItem>

              <MenuItem key="profile" @click="profileVisible = true">
                <UserOutlined />
                <span> My Profile </span>
              </MenuItem>

              <!-- <MenuItem key="logout" @click="signOut"> -->
              <MenuItem key="logout">
                <LogoutOutlined />
                <span> Logout </span>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </div>
  </LayoutHeader>
</template>

<style scoped>
#header-items {
  width: 100%;
  justify-content: space-between;
  display: inline-flex;
}
</style>
