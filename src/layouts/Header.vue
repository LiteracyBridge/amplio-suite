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

const confirmLogout = () => {
  Modal.confirm({
    title: 'Are you sure you want to logout?',
    centered: true,
    width: 300,
    okText: 'Yes',
    cancelText: 'No',
    okType: 'danger',
    async onOk() {
      await userStore.logout();
      router.push('/login');
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
    style="background: #289b6a; color: white"
    class="responsive-header"
  >
    <div id="header-items">
      <div class="header-left">
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
          class="program-select"
          placeholder="Select a program"
          @change="changeProgram($event as number)"
        >
        </Select>
        
      </div> 

      <div class="header-right">
        <Dropdown trigger="hover" class="mr-2 sm:mr-5"
        
        >
          <Button class="user-btn">
            <span class="user-name">{{ userStore.user?.name }}</span>
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
              <MenuItem key="logout" @click="confirmLogout">
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
.responsive-header {
  padding: 12px 8px 8px 0px;
  height: auto;
  min-height: 64px;
}

#header-items {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(8px, 2vw, 16px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 16px);
  flex: 1;
  min-width: 0;
}

.header-right {
  flex-shrink: 0;
}

.trigger {
  font-size: clamp(14px, 4vw, 18px);
  padding: 0 clamp(8px, 2vw, 16px);
  cursor: pointer;
  color: white;
  transition: color 0.3s;
}

.trigger:hover {
  color: #f0f0f0;
}

.program-select {
  flex: 1;
  max-width: min(384px, 60vw);
  min-width: clamp(120px, 25vw, 200px);
}

.user-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  height: auto;
  padding: clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px);
  font-size: clamp(12px, 3vw, 14px);
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.user-name {
  max-width: clamp(60px, 15vw, 150px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .responsive-header {
    padding: 8px 4px 6px 0px;
    min-height: 56px;
  }
}

/* Ant Design overrides */
.program-select :deep(.ant-select-selector) {
  min-height: clamp(28px, 6vw, 36px);
  font-size: clamp(12px, 3vw, 14px);
  padding: clamp(2px, 1vw, 6px) clamp(8px, 2vw, 12px);
}

</style>