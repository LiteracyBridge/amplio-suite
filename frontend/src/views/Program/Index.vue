<template>
  <PageHeader
    title="Program Specification"
    sub-title="Define your requirements and complete/modify the program specification document."
  >
    <template #extra>
      <Button
        key="1"
        :ghost="true"
        :danger="true"
        type="primary"
        @click="store.downloadSpec(appStore.activeProgram?.data.program_id)"
      >
        Discard Changes
      </Button>

      <Button key="2" type="primary" @click="store.updateSpec" :disabled="!store.changed">
        Save Changes
      </Button>

      <Popconfirm
        title="Are you sure you want to publish this program specification to the ACM?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="onPublish"
      >
        <Button key="3" :disabled="!store.canPublish" :ghost="true" type="primary"
          >Publish</Button
        >
      </Popconfirm>
    </template>

    <Alert
      v-if="!store.canPublish"
      message="There must be at least one deployment with a message and one recipient before this can be published to the ACM"
      type="warning"
    />
  </PageHeader>

  <main class="container mx-auto">
    <Spin :spinning="store.loading">
      <Tabs v-model:activeKey="activeKey" centered size="large">
        <TabPane key="general" tab="General">
          <div v-if="!store.loading && store.general != null">
            <General :program-id="appStore.activeProgram.id?.toString()"></General>
          </div>
        </TabPane>

        <TabPane key="deployment-and-content" tab="Deployments & Content">
          <DeploymentAndContent
            :program-id="appStore.activeProgram.id?.toString()"
            v-if="store.deployments != null"
          ></DeploymentAndContent>
        </TabPane>

        <TabPane key="recipients" tab="Recipients">
          <Recipients
            :program-id="appStore.activeProgram.id?.toString()"
            v-if="store.recipients != null"
          ></Recipients>
        </TabPane>

        <TabPane key="import-export" tab="Import/Export">
          <ImportExport
            :program-id="appStore.activeProgram.data.program_id"
          ></ImportExport>
        </TabPane>
      </Tabs>
    </Spin>
  </main>
</template>

<script lang="ts" setup>
import { useProgramSpecStore } from "@/store/programspec";
import { onMounted, ref } from "vue";
import { useAccountStore } from "@/store/account";
import { onBeforeRouteLeave } from "vue-router";
import {
  Alert,
  Button,
  Modal,
  PageHeader,
  Popconfirm,
  Spin,
  TabPane,
  Tabs,
} from "ant-design-vue";

import General from "./General.vue";
import DeploymentAndContent from "./DeploymentAndContent.vue";
import Recipients from "./Recipients.vue";
import ImportExport from "./ImportExport.vue";
import { useAppStore } from "@/store/app.store";
import { useRequest } from "vue-request";
import { LocalStorageKeys } from "@/models/constants";

const store = useProgramSpecStore();
const appStore = useAppStore();

const activeKey = ref("general");

const data = ref({
  sections: ["general", "content2", "recipients", "importExport"],
  internal: { general: true, content2: true, recipients: true } as Record<
    string,
    boolean
  >,
  sectionTitles: {
    content2: "Deployments & Content",
    importExport: "Import/Export",
  } as Record<string, string>,
  publishStatus: null,
  transitionName: "slide-left",
  isModalOpen: false,
  showSnackbar: false,
});

// Download spec
useRequest(store.downloadSpec, {
  defaultParams: [
    appStore.activeProgram.data?.program_id ??
      JSON.parse(localStorage.getItem(LocalStorageKeys.active_program) ?? "{}").id,
  ],
  onSuccess: (data) => {
    store.setSpec({
      programId: appStore.activeProgram.data.program_id,
      programspec: data[0],
    });
  },
});

// const anyTabChanged = computed(() => {
//   return useProgramSpecStore().changed;
// });

async function onPublish() {
  if (!store.canPublish) return;

  data.value.publishStatus = "loading";
  data.value.publishStatus = await store.publishSpec();
  if (data.value.publishStatus === "success") data.value.showSnackbar = true;
}

// function handleOpenModal() {
//   data.value.isModalOpen = true;
//   useUIStore().setModal("Save or discard the change");
// }

// function handleCloseModal() {
//   data.value.isModalOpen = false;
//   useUIStore().closeModal();
// }

onMounted(async () => {
  try {
    // Add program spec pages that should only be shown to @amplio.org users.
    const email = useAccountStore().user.email;
    if (email) {
      if (email.endsWith("@amplio.org")) {
        data.value.sections.push("ufImportExport");
        // @ts-ignore
        data.value.sectionTitles["ufImportExport"] = "UF Questionnaire";
      }
    }
  } catch (ignored) {
    console.log("no user");
  }

  //   Watch for state changes
  // this subscription will be kept even after the component is unmounted
  store.$subscribe((mutation, state) => {
    if (state.changed == false) {
      store.changed = true;
    }
  });
});

// onBeforeRouteUpdate((to, from, next) => {
//   const sTo = to.path.split("/");
//   const sFrom = from.path.split("/");
//   const toName = sTo[sTo.length - 1];
//   const fromName = sFrom[sFrom.length - 1];

//   const isInternalNavigation = () =>
//     (data.value.internal[fromName] as any) && (data.value.internal[toName] as any);

//   data.value.transitionName =
//     data.value.sections.indexOf(toName) < data.value.sections.indexOf(fromName)
//       ? "slide-right"
//       : "slide-left";

//   // Check if the data is save
//   if (anyTabChanged.value && !isInternalNavigation()) {
//     handleOpenModal();
//     next(false);
//   } else {
//     next();
//   }
// });

onBeforeRouteLeave((to, from, next) => {
  // Check if the data is saved
  if (store.changed) {
    Modal.confirm({
      title: "Save or discard the change before continue.",
      okText: "Save",
      cancelText: "Discard Changes",
      onOk: () => {
        return store.updateSpec().then(() => {
          next();
        });
      },
      onCancel: () => {
        next();
      },
    });
  } else {
    next();
  }
});
</script>
