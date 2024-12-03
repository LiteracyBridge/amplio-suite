<script lang="ts" setup>
import {
  Button,
  Modal,
  Drawer,
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
import { useRequest } from "vue-request";
import { ExclamationCircleFilled } from "@ant-design/icons-vue";

import { useProgramsStore } from "@/store/programs";
import { useAccountStore } from "@/store/account";
import { useRolesStore } from "@/store/roles.store";

import { RequestCacheKeys } from "@/models/constants";

const props = defineProps<{
  open: boolean;
  programId: number;
  name: string | undefined;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const programStore = useProgramsStore();

const activeTab = ref("1");
const addUserModal = ref({
  open: false,
  user_id: undefined as number,
});
const orgModal = ref({
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
const {
  loading: isFetchingOrgUsers,
  data: organisationUsers,
  run: fetchOrgUsers,
} = useRequest(programStore.fetchOrgUsers, {
  defaultParams: [props.programId],
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

const program = computed(() => {
  return programStore.organisationPrograms.find((o) => o.id == props.programId);
});

const getProgramOrgs = computed(() => {
  return useAccountStore().organisations.filter(
    (o) => program.value.organisations.find((org) => org.organisation_id == o.id) == null
  );
});

const getUsers = computed(() => {
  return organisationUsers.value
    .filter((u) => program.value.users.find((i) => i.user_id == u.id) == null)
    .map((u) => ({ value: u.id, label: `${u.first_name} ${u.last_name} (${u.email})` }));
});
</script>

<template>
  <Drawer :open="open" @close="handleCancel" width="50vw">
    <template #title> Users of {{ name }} </template>

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
              </template>
            </ListItem>
          </template>

          <template #footer>
            <Button
              :block="true"
              @click="addUserModal.open = true"
              type="primary"
              :ghost="true"
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
                  v-if="useAccountStore().isAmplioStaff"
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
            <Button
              v-if="useAccountStore().isAmplioStaff"
              :block="true"
              @click="orgModal.open = true"
              type="primary"
              :ghost="true"
              >Add Organisation</Button
            >
          </template>
        </List>
      </Tabs.TabPane>
    </Tabs>

    <!-- Add user to program modal -->
    <Modal
      :open="addUserModal.open"
      title="Add User to Program"
      ok-text="Save"
      :confirm-loading="programStore.loading"
      @cancel="addUserModal.open = false"
      @ok="
        useRolesStore()
          .assignRole({
            user_id: addUserModal.user_id,
            program_id: props.programId,
            roles: [],
          })
          .then((_) => {
            addUserModal.open = false;
            addUserModal.user_id = undefined;
          })
      "
      :mask-closable="false"
    >
      <Spin :spinning="useRolesStore().loading">
        <Form layout="vertical" :model="addUserModal">
          <FormItem label="Select user" :required="true">
            <Select
              v-model:value="addUserModal.user_id"
              :show-search="true"
              :filter-option="true"
              option-filter-prop="label"
              name="user_id"
              style="width: 100%"
              placeholder="Please select user"
              :loading="isFetchingOrgUsers"
              :options="getUsers"
            >
            </Select>
          </FormItem>
        </Form>
      </Spin>
    </Modal>

    <!-- Add organisation modal -->
    <Modal
      :open="orgModal.open"
      title="Add Organisation to Program"
      ok-text="Save"
      :confirm-loading="programStore.loading"
      @cancel="orgModal.open = false"
      @ok="
        programStore
          .addOrganisationToProgram({
            organisation_id: orgModal.organisation_id,
            program_id: props.programId,
          })
          .then((_) => {
            orgModal.open = false;
            orgModal.organisation_id = undefined;
            fetchOrgUsers(programId);
          })
      "
      :mask-closable="false"
    >
      <Spin :spinning="programStore.loading">
        <Form layout="vertical" :model="orgModal">
          <FormItem label="Select organisation" :required="true">
            <Select
              v-model:value="orgModal.organisation_id"
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
