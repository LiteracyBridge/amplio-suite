<script lang="ts" setup>
import {
  Button,
  Modal,
  Drawer,
  Form,
  FormItem,
  CheckboxGroup,
  Input,
  notification,
  Tree,
  Divider,
  Spin,
} from "ant-design-vue";

import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { ApiRequest } from "@/api";
import { watch } from "vue";
import type { TreeProps } from "ant-design-vue";
import { toSentenceCase, toTitleCase } from "@/utils";
import { Role } from "@/types/role.model";

const RolesTemplate = ref<{ [module: string]: { value: string; label: string }[] }>({});

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const loading = ref(false);
const formState = reactive<{
  name: string;
  description: string;
  permissions: { [module: string]: string[] };
}>({
  name: "",
  description: "",
  permissions: {},
});

function createRole() {
  console.log(formState);

  loading.value = true;

  ApiRequest.post<Role>("users/roles", formState)
    .then(([resp]) => {
      const data = resp as any;

      console.warn(data);
      emit("closed", true);
    })
    .finally(() => {
      loading.value = false;
    });

  // ApiRequest.post("users/invitations", formState)
  //   .then((resp) => {
  //     notification.success({
  //       message: "Invitation Sent!",
  //       description: `The ${formState.name} will receive an email to complete their registration.`,
  //     });
  //     formState.name = "";
  //     formState.description = "";
  //     formState.permissions = {};
  //     // formState.other_names = "";
  //     console.log(resp);
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //     emit("closed", true);
  //   });
  // // props.open = false;
  // console.log("OK");
  // emit("closed", true);
}

onMounted(() => {
  loading.value = true;

  ApiRequest.get<Role>("users/roles/template")
    .then(([resp]) => {
      const data = resp as any;

      Object.keys(data).forEach((i: string) => {
        data[i] = data[i].map((val: string) => {
          return {
            label: toTitleCase(toSentenceCase(val, true)),
            value: val,
          };
        });
      });
      RolesTemplate.value = data;
    })
    .finally(() => {
      loading.value = false;
      emit("closed", true);
    });

  // props.open = false;
  console.log("OK");
  emit("closed", true);
});

function handleCancel() {
  console.log("Cancel");
  emit("closed", true);
}

function getModuleName(module: string) {
  if (module == "acm/tb_loader") {
    return "ACM/TB Loader";
  }

  return toTitleCase(module);
}
</script>

<template>
  <Drawer
    :open="open"
    title="Create Custom Role"
    @ok="createRole()"
    @close="handleCancel"
    ok-text="Create Role"
    :width="600"
    :mask-closable="false"
    :confirm-loading="loading"
  >
    <template #extra>
      <Button @click="createRole()">Save</Button>
    </template>

    <Form :model="formState" layout="vertical">
      <Spin :spinning="loading">
        <FormItem label="Role Name" required>
          <Input v-model:value="formState.name" />
        </FormItem>

        <FormItem label="Role Description">
          <Input v-model:value="formState.description" />
        </FormItem>

        <Divider></Divider>

        <template v-for="(permissions, module) in RolesTemplate">
          <div class="mt-3">
            <span>{{ getModuleName(module as string) }}</span>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <CheckboxGroup
              class="ml-5"
              v-model:value="formState.permissions[module.toString().replace('/', '_')]"
              :name="module as string"
              :options="permissions"
            />
          </div>
        </template>
      </Spin>
    </Form>
  </Drawer>
</template>
