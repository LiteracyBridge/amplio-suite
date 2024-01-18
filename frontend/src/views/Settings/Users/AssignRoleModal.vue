<script lang="ts" setup>
import { FormItem, Form, Modal, SelectOption, Select, Spin } from "ant-design-vue";
import { computed, createVNode, onMounted, reactive, ref, watch } from "vue";
import { useRolesStore } from "@/store/roles.store";
import { useRequest } from "vue-request";
import { RequestCacheKeys } from "@/models/constants";
import { useAccountStore } from "@/store/account";

const props = defineProps<{
  open: boolean;
  programId?: number | undefined;
  userId?: number | undefined;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const store = useRolesStore();
const form = reactive({
  roles: [] as number[],
  program_id: undefined as number,
  user_id: undefined as number,
});

const { loading } = useRequest(store.fetchRoles, {
  cacheKey: RequestCacheKeys.org_roles,
  onSuccess: (data) => {
    store.roles = data;
  },
});

function handleCancel() {
  form.program_id = undefined;
  form.user_id = undefined;
  form.roles = [];
  emit("closed", true);
}

function save() {
  store
    .assignRole({
      roles: form.roles,
      user_id: props.userId || form.user_id,
      program_id: props.programId,
    })
    .then(() => handleCancel());
}

const existingUserRoles = computed(() => {
  if (props.userId != null) {
    const user = useAccountStore().users.find((r) => r.id === props.userId);
    return (user?.roles || []).flatMap((role) => role.role_id);
  }
  return [];
});

onMounted(() => {
  if (props.open) {
    form.roles = existingUserRoles.value;
  }
});
</script>

<template>
  <Modal
    :open="open"
    title="Update Roles"
    ok-text="Save Roles"
    :confirm-loading="store.loading"
    @cancel="handleCancel()"
    @ok="save()"
  >
    <Spin :spinning="store.loading || loading">
      <Form layout="vertical" :model="form">
        <FormItem class="pt-4" label="Select roles" :required="true">
          <Select
            v-model:value="form.roles"
            :show-search="true"
            name="roles"
            mode="multiple"
            style="width: 100%"
            placeholder="Please select roles"
          >
            <SelectOption :value="role.id" :label="role.name" v-for="role in store.roles">
              {{ role.name }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem label="Select user" :required="true" v-if="userId == null">
          <Select
            v-model:value="form.user_id"
            :show-search="true"
            name="users"
            style="width: 100%"
            placeholder="Please select user"
            title="Select user to assign the role to"
          >
            <!-- TODO: Filter out users already assigned to the role -->
            <SelectOption
              :value="user.id"
              :label="user.first_name"
              v-for="user in useAccountStore().users"
              >{{ user.first_name }} {{ user.last_name }} ({{ user.email }})</SelectOption
            >
          </Select>
        </FormItem>
      </Form>
    </Spin>
  </Modal>
</template>
