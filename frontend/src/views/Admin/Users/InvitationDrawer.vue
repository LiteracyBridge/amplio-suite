<script lang="ts" setup>
import {
  Button,
  Modal,
  notification,
  Drawer,
  ListItem,
  ListItemMeta,
  List,
  Typography,
} from "ant-design-vue";

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

const { loading } = useRequest(store.fetchInvitations, {
  onSuccess: (data) => {
    store.invitations = data;
  },
});

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
          store.invitations = resp;
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

    <List bordered :data-source="store.invitations" :loading="loading">
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta :description="item.organisation?.name">
            <template #title>
              <span> {{ item.first_name }} {{ item.last_name }}</span>
              <Typography.Paragraph copyable> {{ item.email }}</Typography.Paragraph>
            </template>
          </ListItemMeta>

          <template #actions>
            <Button
              type="link"
              title="Revoke role from user"
              size="small"
              :danger="true"
              @click="deleteInvitation(item.email)"
              >Delete
            </Button>
          </template>
        </ListItem>
      </template>
    </List>

    <InviteModal :open="isOpen" @closed="isOpen = false" />
  </Drawer>
</template>
