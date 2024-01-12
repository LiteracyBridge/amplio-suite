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
import { useRequest } from "vue-request";
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { ApiRequest } from "@/api";
import { watch } from "vue";
import { toSentenceCase, toTitleCase } from "@/utils";
import { Role } from "@/models/role";
import { useRolesStore } from "@/store/roles.store";

const RolesTemplate = ref<{ [module: string]: { value: string; label: string }[] }>({});

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "closed", value: boolean): void;
}>();

const store = useRolesStore();
// const isLoading = ref(false);
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
const { data, run, loading: isSaving } = useRequest(store.create, {
    defaultParams: [formState],
    manual: true,
  });

function createRole() {

  // store.loading = loading.value;
  console.log(formState);

  // run(formState as Role);

  if (!isSaving.value) {
    store.loading = false;
    emit("closed", true);
  }
}

onMounted(async () => {
  await store.fetchTemplates();
  //   // isLoading.value = true;

  //   // const { data, loading } = useRequest(store.fetchTemplates, {});
  //   // isLoading.value = loading.value;

  //   // if (data.value != null) {
  //   //   store.template = Object.keys(data.value[0]).map((i: string) => {
  //   //     return data.value[0][i].map((val: string) => {
  //   //       return {
  //   //         label: toTitleCase(toSentenceCase(val, true)),
  //   //         value: val,
  //   //       };
  //   //     });
  //   //   });
  //   // }

  //   // ApiRequest.get<Role>("users/roles/template")
  //   //   .then(([resp]) => {
  //   //     const data = resp as any;

  //   //     Object.keys(data).forEach((i: string) => {
  //   //       data[i] = data[i].map((val: string) => {
  //   //         return {
  //   //           label: toTitleCase(toSentenceCase(val, true)),
  //   //           value: val,
  //   //         };
  //   //       });
  //   //     });
  //   //     RolesTemplate.value = data;
  //   //   })
  //   //   .finally(() => {
  //   //     isLoading.value = false;
  //   //     emit("closed", true);
  //   //   });

  //   // props.open = false;
  //   // console.log("OK");
  //   // emit("closed", true);
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
