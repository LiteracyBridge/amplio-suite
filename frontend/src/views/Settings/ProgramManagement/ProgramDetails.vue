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
  Select,
  Form,
  FormItem,
  Spin,
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
import { Program } from "@/models/program";

const props = defineProps<{
  open: boolean;
  programId: number;
  name: string | undefined;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const store = useAccountStore(),
  programStore = useProgramsStore();

const activeTab = ref("1");
const assignRoleModal = ref({
  open: false,
  user_id: undefined as number,
});
const org_modal = ref({
  open: false,
  organisation_id: undefined as number,
});

const { loading: isFetchingOrgs } = useRequest(useAccountStore().fetchOrganisations, {
  cacheKey: RequestCacheKeys.orgs,
  cacheTime: 50 * 60 * 1000, // 50 minutes
  onSuccess: (data) => {
    useAccountStore().organisations = data;
  },
});

function handleCancel() {
  emit("closed", true);
}

function removeUser(userId: number) {
  Modal.confirm({
    title: "Are you sure you want to remove this user?",
    icon: createVNode(ExclamationCircleFilled),
    content: `The user  will be removed from the program.`,
    okText: "Remove",
    okType: "danger",
    cancelText: "Cancel",
    onOk: async () => {
      return programStore.removeUserFromProgram({
        userId,
        programId: props.programId,
      });
    },
  });
}

function removeOrg(orgId: number) {
  Modal.confirm({
    title: "Are you sure you want to remove this organisation?",
    icon: createVNode(ExclamationCircleFilled),
    content: `The organisation will be removed from the program.`,
    okText: "Remove",
    okType: "danger",
    cancelText: "Cancel",
    onOk: async () => {
      return programStore.removeOrganisationFromProgram({
        organisationId: orgId,
        programId: props.programId,
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
  return programStore.organisationPrograms.find((o) => o.id == props.programId);
});

const getProgramOrgs = computed(() => {
  return useAccountStore().organisations.filter(
    (o) => program.value.organisations.find((org) => org.organisation_id == o.id) == null
  );
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
        <List
          size="small"
          bordered
          :data-source="program.users"
          :loading="programStore.loading || isFetchingOrgs"
        >
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
        <List
          size="small"
          bordered
          :data-source="program.organisations"
          :loading="programStore.loading"
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
                <Button
                  type="link"
                  size="small"
                  :danger="true"
                  @click="removeOrg(item.organisation_id)"
                  >Remove</Button
                >
              </template>
            </ListItem>
          </template>

          <template #footer>
            <Button :block="true" @click="org_modal.open = true">Add Organisation</Button>
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

    <Modal
      :open="org_modal.open"
      title="Add Organisation to Program"
      ok-text="Save"
      :confirm-loading="programStore.loading"
      @cancel="handleCancel()"
      @ok="
        programStore
          .addOrganisationToProgram({
            organisation_id: org_modal.organisation_id,
            program_id: props.programId,
          })
          .then((_) => {
            org_modal.open = false;
            org_modal.organisation_id = undefined;
          })
      "
      :mask-closable="false"
    >
      <Spin :spinning="programStore.loading">
        <Form layout="vertical" :model="org_modal">
          <FormItem label="Select organisation" :required="true">
            <Select
              v-model:value="org_modal.organisation_id"
              :show-search="true"
              :filter-option="true"
              :field-names="{ label: 'name', value: 'id' }"
              name="organisation_id"
              style="width: 100%"
              placeholder="Please select organisation"
              :options="getProgramOrgs"
            >
            </Select>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  </Drawer>
</template>
