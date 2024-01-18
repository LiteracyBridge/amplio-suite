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

const props = defineProps<{
  open: boolean;
  programId: number;
  name: string | undefined;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const store = useAccountStore();
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
      return ApiRequest.delete<User>(
        `programs/${props.programId}/users?user_id=${userId}`
      )
        .then(async (resp) => {
          store.users = resp;
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

const programUsers = computed(() => {
  return (
    store.users.filter(
      (u) => u.roles.find((r) => r.program_id == props.programId) != null
    ) || []
  );
});
</script>

<template>
  <Drawer :open="open" @close="handleCancel" width="800px">
    <template #title> Users of {{ props.name }} </template>

    <template #extra>
      <Button type="primary" @click="showOrHideRoleModal(undefined, 'show')"
        >Add User</Button
      >
    </template>

    <List size="small" bordered :data-source="programUsers" :loading="loading">
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta :description="store.rolesToString(item.roles)">
            <template #title>
              <span> {{ item.first_name }} {{ item.last_name }} ({{ item.email }}) </span>
            </template>
          </ListItemMeta>

          <template #actions>
            <Button type="link" size="small" :danger="true" @click="removeUser(item.id)"
              >Remove</Button
            >

            <Button size="small" type="link" @click="showOrHideRoleModal(item.id, 'show')"
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
