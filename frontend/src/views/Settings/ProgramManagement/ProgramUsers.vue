<script lang="ts" setup>
import {
  Button,
  Modal,
  notification,
  Drawer,
  Table,
  List,
  ListItemMeta,
} from "ant-design-vue";

import { createVNode, reactive, ref, watch } from "vue";
import { ApiRequest } from "@/api";
import { useRequest } from "vue-request";
import { Invitation, ProgramUser } from "@/models/user";

import { ExclamationCircleFilled } from "@ant-design/icons-vue";
import { useProgramsStore } from "@/store/programs";

const props = defineProps<{
  open: boolean;
  programId: number;
  name: string | undefined;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const store = useProgramsStore();

const { data: users, loading, run } = useRequest(store.getProgramUsers, {
  defaultParams: [props.programId],
  manual: true,
});

function handleCancel() {
  emit("closed", true);
}

function removeUser(id: number, userId: number) {
  Modal.confirm({
    title: "Are you sure you want to remove this user?",
    icon: createVNode(ExclamationCircleFilled),
    content: `The user has been removed from the program.`,
    okText: "Remove",
    okType: "danger",
    cancelText: "Cancel",
    onOk: async () => {
      loading.value = true;
      return ApiRequest.delete<ProgramUser>(
        `programs/${props.programId}?id=${id}&user_id=${userId}`
      )
        .then((resp) => {
          users.value = resp;
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

watch(
  props,
  (newProps, _oldProps) => {
    if (newProps.open) {
      run(props.programId);
    }
  },
  { deep: true }
);
</script>

<template>
  <Drawer :open="open" @close="handleCancel" width="800px">
    <template #title> Users of {{ props.name }} </template>

    <List size="small" bordered :data-source="users">
      <template #renderItem="{ item }">
        <List.ListItem>
          <span>
            {{ item.user.first_name }} {{ item.user.last_name }} ({{ item.user.email }})
          </span>

          <ListItemMeta description="Role 1, Role 2, Role 3"> </ListItemMeta>

          <template #actions>
            <Button size="small" :danger="true" @click="removeUser(item.id, item.user_id)"
              >Remove</Button
            >
          </template>
        </List.ListItem>
      </template>

      <!-- <template #footer>
        <Button :block="true">Add User</Button>
      </template> -->
    </List>
  </Drawer>
</template>
