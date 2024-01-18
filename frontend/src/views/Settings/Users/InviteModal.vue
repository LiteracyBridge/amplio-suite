<script lang="ts" setup>
import { Button, Modal, Form, FormItem, Input, notification, Spin } from "ant-design-vue";

import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";
import { ApiRequest } from "@/api";
import { Invitation } from "@/models/user";

// TODO; add user role to invite form

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "closed", data: Invitation[]): void;
}>();

const loading = ref(false);
const formState = reactive({
  first_name: "",
  last_name: "",
  email: "",
});

function handleCancel(data?: Invitation[]) {
  formState.first_name = "";
  formState.last_name = "";
  formState.email = "";
  emit("closed", data || []);
}

function handleOk() {
  loading.value = true;
  return ApiRequest.post<Invitation>("users/invitations", formState)
    .then((resp) => {
      notification.success({
        message: "Invitation Sent!",
        description: `The ${formState.first_name} will receive an email to complete their registration.`,
      });
      handleCancel(resp);
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
      </Spin>
    </Form>
  </Modal>
</template>
