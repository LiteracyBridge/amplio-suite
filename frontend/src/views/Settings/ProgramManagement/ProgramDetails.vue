<script lang="ts" setup>
import {
  Button,
  Modal,
  notification,
  Drawer,
  Table,
  List,
  ListItem,
  ListItemMeta,
  Tabs,
} from "ant-design-vue";

import { computed, createVNode, ref, watch } from "vue";
import { ApiRequest } from "@/api";
import { useRequest } from "vue-request";
import { ProgramUser, User } from "@/models/user";

import { ExclamationCircleFilled } from "@ant-design/icons-vue";
import { useProgramsStore } from "@/store/programs";
import { useAccountStore } from "@/store/account";

import AssignRoleModal from "../Users/AssignRoleModal.vue";
import { RequestCacheKeys } from "@/models/constants";
import type { Program } from "@/models/program";

const props = defineProps<{
  open: boolean;
  programId: number;
  name: string | undefined;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const store = useAccountStore();
const activeTab = ref("1");
const assignRoleModal = ref({
  open: false,
  user_id: undefined as number,
});

const { loading } = useRequest(store.fetchUsers, {
  cacheKey: RequestCacheKeys.org_users,
  onSuccess: (data) => {
    store.users = data;
  },
});

function handleCancel() {
  emit("closed", true);
}

function removeUser(userId: number) {
  Modal.confirm({
    title: "Are you sure you want to remove this user?",
    icon: createVNode(ExclamationCircleFilled),
    content: `The user has been removed from the program.`,
    okText: "Remove",
    okType: "danger",
    cancelText: "Cancel",
    onOk: async () => {
      loading.value = true;
      return ApiRequest.delete<Program>(
        `programs/${props.programId}/users?user_id=${userId}`
      )
        .then(async (resp) => {
          useProgramsStore().organisationPrograms = resp;
          notification.success({
            message: "User Remove!",
            description: `The user has been removed from the program.`,
          });
        })
        .finally(() => {
          loading.value = false;
        });
    },
  });
}

function showOrHideRoleModal(user_id: number | undefined, state: "show" | "hide") {
  if (state === "show") {
    assignRoleModal.value.user_id = user_id;
    assignRoleModal.value.open = true;
  } else {
    assignRoleModal.value.open = false;
    assignRoleModal.value.user_id = undefined;
  }
}

const program = computed(() => {
  return useProgramsStore().organisationPrograms.find((o) => o.id == props.programId);
});
</script>

<template>
  <Drawer :open="open" @close="handleCancel" width="50vw">
    <template #title> Users of {{ program.name }} </template>

    <template #extra>
      <Button type="primary" @click="showOrHideRoleModal(undefined, 'show')"
        >Add User</Button
      >
    </template>

    <Tabs v-model:active-key="activeTab" centered>
      <Tabs.TabPane key="1" tab="Program Users">
        <List size="small" bordered :data-source="program.users" :loading="loading">
          <template #renderItem="{ item }">
            <ListItem>
              <ListItemMeta>
                <template #title>
                  <span>
                    {{ item.user.first_name }} {{ item.user.last_name }} ({{
                      item.user.email
                    }})
                  </span>
                </template>
              </ListItemMeta>

              <template #actions>
                <Button
                  type="link"
                  size="small"
                  :danger="true"
                  @click="removeUser(item.user.id)"
                  >Remove</Button
                >

                <Button
                  size="small"
                  type="link"
                  @click="showOrHideRoleModal(item.user.id, 'show')"
                  >Edit Roles</Button
                >
              </template>
            </ListItem>
          </template>

          <template #footer>
            <Button :block="true" @click="showOrHideRoleModal(undefined, 'show')"
              >Add User</Button
            >
          </template>
        </List>
      </Tabs.TabPane>

      <Tabs.TabPane key="2" tab="Program Organisations">
        <!-- TODO: implement this -->
        <List
          size="small"
          bordered
          :data-source="program.organisations"
          :loading="loading"
        >
          <template #renderItem="{ item }">
            <ListItem>
              <ListItemMeta>
                <template #title>
                  <span>
                    {{ item.organisation.name }}
                  </span>
                </template>
              </ListItemMeta>

              <template #actions>
                <!-- TODO: implement removin org -->
                <!-- <Button
                  type="link"
                  size="small"
                  :danger="true"
                  @click="removeUser(item.id)"
                  >Remove</Button
                > -->
              </template>
            </ListItem>
          </template>

          <template #footer>
            <!-- TODO: implement adding org -->
            <Button :block="true" @click="showOrHideRoleModal(undefined, 'show')"
              >Add Organisation</Button
            >
          </template>
        </List>
      </Tabs.TabPane>
    </Tabs>

    <template v-if="assignRoleModal.open">
      <AssignRoleModal
        :open="assignRoleModal.open"
        :user-id="assignRoleModal.user_id"
        :program-id="props.programId"
        @closed="showOrHideRoleModal(undefined, 'hide')"
      ></AssignRoleModal>
    </template>
  </Drawer>
</template>
