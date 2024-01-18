<script lang="ts" setup>
import { Button, Modal, notification, Drawer, Table } from "ant-design-vue";

import { createVNode, reactive, ref } from "vue";
import { ApiRequest } from "@/api";
import { useAccountStore } from "@/store/account";
import { useRequest } from "vue-request";
import { Invitation } from "@/models/user";

import InviteModal from "./InviteModal.vue";
import { ExclamationCircleFilled } from "@ant-design/icons-vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const store = useAccountStore();
const isOpen = ref(false);
const formState = reactive({
  first_name: "",
  last_name: "",
  email: "",
});

const { data: invitations, loading } = useRequest(store.fetchInvitations, {});

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email Address",
    key: "email",
  },
  {
    title: "",
    key: "action",
  },
];

function handleCancel() {
  formState.first_name = "";
  formState.last_name = "";
  formState.email = "";
  emit("closed", true);
}

function deleteInvitation(email: string) {
  Modal.confirm({
    title: "Are you sure you want to delete this invitation?",
    icon: createVNode(ExclamationCircleFilled),
    content: `The invitation for ${email} will be deleted.`,
    okText: "Delete",
    okType: "danger",
    cancelText: "Cancel",
    onOk: async () => {
      loading.value = true;
      return ApiRequest.delete<Invitation>(`users/invitations/${email}`)
        .then((resp) => {
          invitations.value = resp;
          notification.success({
            message: "Invitation Deleted!",
            description: `The invitation for ${email} has been deleted.`,
          });
        })
        .finally(() => {
          loading.value = false;
        });
    },
  });
}
</script>

<template>
  <Drawer :open="open" title="User Invitations" @close="handleCancel" width="800px">
    <template #extra>
      <Button type="primary" @click="isOpen = true">Invite someone</Button>
    </template>

    <Table :columns="columns" :data-source="invitations" size="small" :loading="loading">
      <template #bodyCell="{ column, record: user }">
        <template v-if="column.key === 'name'">
          {{ user.first_name }} {{ user.last_name }}
        </template>

        <template v-if="column.key === 'email'">
          <a mailto="{{ record.email }}"> {{ user.email }}</a>
        </template>

        <template v-else-if="column.key === 'action'">
          <Button
            type="primary"
            title="Revoke role from user"
            :ghost="true"
            size="small"
            :danger="true"
            @click="deleteInvitation(user.email)"
            >Delete
          </Button>
        </template>
      </template>
    </Table>

    <InviteModal
      :open="isOpen"
      @closed="
        isOpen = false;
        invitations = $event;
      "
    />
  </Drawer>
</template>
