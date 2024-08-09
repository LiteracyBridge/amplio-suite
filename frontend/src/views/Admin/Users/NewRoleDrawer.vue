<script lang="ts" setup>
import {
  Button,
  Drawer,
  Form,
  FormItem,
  CheckboxGroup,
  Input,
  notification,
  Divider,
  Spin,
  message,
} from "ant-design-vue";
import { onMounted, reactive, ref } from "vue";
import { toSentenceCase, toTitleCase } from "@/utils";
import { useRolesStore } from "@/store/roles.store";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const store = useRolesStore();
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
  if (formState.name.trim() == "") {
    message.error({
      content: "Role name is required to create a new role",
    });
    return;
  }

  if (Object.keys(formState.permissions).length == 0) {
    message.error({
      content: "Please select at least one permission to create a new role",
    });
    return;
  }

  store.create(formState).then(() => {
    emit("closed", true);
  });
}

onMounted(async () => {
  await store.fetchTemplates();
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
    :confirm-loading="store.loading"
  >
    <template #footer>
      <Button block type="primary" @click="createRole()">Create Role</Button>
    </template>

    <Spin :spinning="store.loading">
      <Form :model="formState" layout="vertical">
        <FormItem label="Role Name" required>
          <Input v-model:value="formState.name" />
        </FormItem>

        <FormItem label="Role Description">
          <Input v-model:value="formState.description" />
        </FormItem>

        <Divider></Divider>

        <template v-for="(permissions, module) in store.template">
          <div class="mt-3">
            <span>{{ getModuleName(module as string) }}</span>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <CheckboxGroup
              class="ml-5"
              v-model:value="formState.permissions[module.toString().replace('/', '_')]"
              :name="module.toString()"
              :options="permissions"
            />
          </div>
        </template>
      </Form>
    </Spin>
  </Drawer>
</template>
