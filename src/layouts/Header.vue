<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  AppstoreFilled,
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons-vue";
import {
  Popconfirm,
  Menu,
  Select,
  LayoutHeader,
  MenuItem,
  Dropdown,
  Button,
  SelectOption,
  Modal,
} from "ant-design-vue";
import { useAppStore } from "@/store/app.store";
import { useAccountStore } from "@/store/account";

const router = useRouter();
const userStore = useAccountStore();
const appStore = useAppStore();

const profileVisible = ref(false);
const feedbackModalVisible = ref(false);

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

const userPrograms = computed(() =>
  userStore.programs.map((item) => ({
    value: item.id,
    label: `${item.project.name} (${item.program_id})`,
  }))
);
</script>

<template>
  <!-- <Profile :visible="profileVisible" @close="profileVisible = false"></Profile> -->

  <!-- <FeedbackModal :visible="feedbackModalVisible" @close="feedbackModalVisible = false">
  </FeedbackModal> -->

  <LayoutHeader
    :has-sider="true"
    style="background: #289b6a; padding: 0px 16px 0px 0px; color: white"
  >
    <div id="header-items">
      <div>
        <MenuUnfoldOutlined
          v-if="appStore.sidebarCollapsed"
          class="trigger"
          @click="() => (appStore.sidebarCollapsed = !appStore.sidebarCollapsed)"
        />
        <MenuUnfoldOutlined
          v-else
          class="trigger"
          @click="() => (appStore.sidebarCollapsed = !appStore.sidebarCollapsed)"
        />

        <Select
          v-model:value="appStore.activeProgram.id"
          :show-search="true"
          :filter-option="true"
          :options="userPrograms"
          :option-filter-prop="'label'"
          class="w-96"
          placeholder="Select a program"
          @change="changeProgram($event as number)"
        >
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
              <!-- <MenuItem key="profile" @click="profileVisible = true">
                <UserOutlined />
                <span> My Profile </span>
              </MenuItem> -->

              <!-- <MenuItem key="logout" @click="signOut"> -->
              <MenuItem key="logout" @click="userStore.logout()">
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
