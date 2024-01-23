<script lang="ts" setup>
import {
  Button,
  Modal,
  Form,
  FormItem,
  Input,
  notification,
  Spin,
  Select,
} from "ant-design-vue";

import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";
import { ApiRequest } from "@/api";
import { Invitation } from "@/models/user";
import { useAccountStore } from "@/store/account";
import { useRequest } from "vue-request";
import { RequestCacheKeys } from "@/models/constants";

// TODO; add user role to invite form

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "closed"): void;
}>();

const store = useAccountStore();
const formState = reactive({
  first_name: "",
  last_name: "",
  email: "",
  organisation_id: undefined,
});

const { loading } = useRequest(store.fetchOrganisations, {
  cacheKey: RequestCacheKeys.orgs,
  cacheTime: 30 * 60 * 1000, // 30 minutes
  onSuccess: (data) => {
    store.organisations = data;
  },
});

function handleCancel() {
  formState.first_name = "";
  formState.last_name = "";
  formState.email = "";
  formState.organisation_id = undefined;
  emit("closed");
}

async function handleOk() {
  loading.value = true;
  return ApiRequest.post<Invitation>("users/invitations", formState)
    .then((resp) => {
      store.invitations = resp;
      notification.success({
        message: "Invitation Sent!",
        description: `The ${formState.first_name} will receive an email to complete their registration.`,
      });
      handleCancel();
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <Modal
    :open="open"
    title="Invite User"
    @ok="handleOk()"
    @cancel="handleCancel()"
    ok-text="Invite"
    :confirm-loading="loading"
    :mask-closable="false"
  >
    <Form :model="formState" autocomplete="on" layout="vertical">
      <Spin :spinning="loading">
        <FormItem
          label="First Name"
          name="first_name"
          :rules="[{ required: true, message: 'Please input first name!' }]"
        >
          <Input v-model:value="formState.first_name" required="true" />
        </FormItem>

        <FormItem
          label="Last Name"
          name="last_name"
          :rules="[{ required: true, message: 'Please input last name!' }]"
        >
          <Input v-model:value="formState.last_name" required="true" />
        </FormItem>

        <FormItem
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Please input email!' }]"
        >
          <Input v-model:value="formState.email" type="email" />
        </FormItem>

        <FormItem
          label="Organisation"
          name="organisation_id"
          :required="true"
          :rules="[{ required: true, message: 'Please select an organisation!' }]"
        >
          <Select
            v-model:value="formState.organisation_id"
            :default-value="store.user.organisation_id"
            :field-names="{ label: 'name', value: 'id' }"
            :options="store.organisations"
            :allow-clear="true"
            :show-search="true"
            :filter-option="true"
          />
        </FormItem>
      </Spin>
    </Form>
  </Modal>
</template>
