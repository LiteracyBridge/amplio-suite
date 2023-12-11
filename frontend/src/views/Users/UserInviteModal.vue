<script lang="ts" setup>
import { Button, Modal, Form, FormItem, Input, notification } from "ant-design-vue";

import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";
import { ApiRequest } from "@/api";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const loading = ref(false);
const formState = reactive({
  first_name: "",
  last_name: "",
  email: "",
  other_names: "",
});

function handleOk() {
  ApiRequest.post("users/invite", formState)
    .then((resp) => {
      notification.success({
        message: "Invitation Sent!",
        description: `The ${formState.first_name} will receive an email to complete their registration.`,
      });
      console.log(resp);
    })
    .finally(() => {
      loading.value = false;
      emit("closed", true);
    });

  // props.open = false;
  console.log("OK");
  emit("closed", true);
}

function handleCancel() {
  console.log("Cancel");
  emit("closed", true);
}
</script>

<template>
  <Modal
    :open="open"
    title="Invite User"
    @ok="handleOk()"
    @cancel="handleCancel"
    ok-text="Invite"
    :confirm-loading="loading"
  >
    <Form :model="formState" autocomplete="on" layout="vertical">
      <FormItem
        label="First Name"
        name="first_name"
        :rules="[{ required: true, message: 'Please input first name!' }]"
      >
        <Input v-model:value="formState.first_name" required="true" />
      </FormItem>

      <FormItem label="Other Names" name="other_names">
        <Input v-model:value="formState.other_names" />
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
    </Form>
  </Modal>
</template>
