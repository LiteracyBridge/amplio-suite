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
  Divider,
  Spin,
} from "ant-design-vue";
import { useRequest } from "vue-request";
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

// Create role request
const { loading: isSaving, run } = useRequest(store.create, {
  defaultParams: [formState],
  manual: true,
  onSuccess: (data) => {
    store.roles = data;
  },
});

function createRole() {
  run(formState);
  if (!isSaving.value) {
    store.loading = false;
    notification.open({
      message: "Role Created",
      description: "Role has been created successfully",
    });
    emit("closed", true);
  }
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
    <template #extra>
      <Button @click="createRole()">Save</Button>
    </template>

    <Form :model="formState" layout="vertical">
      <Spin :spinning="store.loading || isSaving">
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
              :name="module as string"
              :options="permissions"
            />
          </div>
        </template>
      </Spin>
    </Form>
  </Drawer>
</template>
