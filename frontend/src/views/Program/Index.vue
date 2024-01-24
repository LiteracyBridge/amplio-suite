<template>
  <main class="container mx-auto">
    <Spin :spinning="store.loading">
      <Tabs v-model:activeKey="activeKey" centered>
        <template #rightExtra>
          <div class="flex flex-row gap-2">
            <!-- TODO: implement save & discard buttons -->
            <Button
              :ghost="true"
              :danger="true"
              type="primary"
              @click="store.downloadSpec(appStore.activeProgram?.data.program_id)"
            >
              Discard Changes
            </Button>

            <Button type="primary" @click="store.updateSpec"> Save Changes </Button>
          </div>
        </template>

        <template #leftExtra>
          <div v-if="!store.loading">
            <Button :disabled="!store.canPublish" @click="onPublish" type="primary"
              >Publish</Button
            >
          </div>
        </template>

        <TabPane key="general" tab="General">
          <div v-if="!store.loading && store.general != null">
            <General :program-id="appStore.activeProgram.id?.toString()"></General>
          </div>
        </TabPane>

        <TabPane key="deployment-and-content" tab="Deployments & Content">
          <Content2
            :program-id="appStore.activeProgram.id?.toString()"
            v-if="store.deployments != null"
          ></Content2>
        </TabPane>

        <TabPane key="recipients" tab="Recipients">
          <Recipients
            :program-id="appStore.activeProgram.id?.toString()"
            v-if="store.recipients != null"
          ></Recipients>
        </TabPane>

        <TabPane key="import-export" tab="Import/Export">
          <ImportExport
            :program-id="appStore.activeProgram.id?.toString()"
          ></ImportExport>
        </TabPane>
      </Tabs>
    </Spin>

    <!-- <div class="py-6 flex justify-between">
      <h1 class="text-2xl text-blue capitalize">{{ programName }} Program</h1>

      <div class="flex">
        <VButton
          label="Publish"
          variant="submit"
          :disabled="!canPublish"
          :iconL="data.publishStatus === 'loading' ? 'spinner' : ''"
          :iconLPulse="data.publishStatus === 'loading'"
          @click="onPublish"
        />
        <v-tooltip
          v-if="!canPublish"
          text="There must be at least one deployment with a message and one recipient before this can be published to the ACM"
          position="right"
          class="my-2 ml-2"
        >
          <font-awesome-icon class="text-orange-600" icon="exclamation-circle" />
        </v-tooltip>
      </div>
    </div> -->

    <!-- <div class="bg-white rounded-lg shadow-box"> -->
    <!-- <nav aria-label="Program sections" class="flex border-b">
        <router-link
          v-for="(section, index) in data.sections"
          :key="section"
          :to="`/programs/${programId}/settings/${section}`"
          :class="[
            $route.path.endsWith(section) ? 'bg-amplio-green text-white' : 'text-black',
            index === 0 ? 'rounded-tl-lg' : '',
          ]"
          class="p-4 text-lg uppercase hover:bg-amplio-green hover:text-white"
        >
          {{ ` ${data.sectionTitles[section] || section} ` }}
        </router-link>
      </nav> -->

    <!-- <transition :name="transitionName" mode="out-in">
        <router-view />
      </transition> -->
    <!-- <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view> -->
    <!-- </div> -->

    <v-snackbars
      :show.sync="data.showSnackbar"
      label="The program specification was successfully published to the ACM."
    />

    <!-- For modal components -->
    <portal to="modalBody" v-if="data.isModalOpen">
      <p class="text-xl">Save or discard the change before continue.</p>
    </portal>

    <portal to="modalFooter" v-if="data.isModalOpen">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton label="Ok" @click="handleCloseModal" />
      </footer>
    </portal>
  </main>
</template>

<script lang="ts" setup>
import VButton from "@/components/VButton.vue";
import VSnackbars from "@/components/VSnackbars.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { useUIStore } from "@/store/ui";
import { computed, onMounted, ref } from "vue";
import { useAccountStore } from "@/store/account";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from "vue-router";
import { Button, Spin, TabPane, Tabs } from "ant-design-vue";

import General from "./General.vue";
import Content2 from "./Content2.vue";
import Recipients from "./Recipients.vue";
import ImportExport from "./ImportExport.vue";
import { useAppStore } from "@/store/app.store";
import { useRequest } from "vue-request";

// const props = defineProps<{ programId: string }>();

const store = useProgramSpecStore(),
  appStore = useAppStore(),
  route = useRoute();

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
const {} = useRequest(store.downloadSpec, {
  defaultParams: [appStore.activeProgram.data.program_id],
  onSuccess: (data) => {
    store.setSpec({
      programId: appStore.activeProgram.data.program_id,
      programspec: data[0],
    });
  },
});

const anyTabChanged = computed(() => {
  return useProgramSpecStore().changed;
});

async function onPublish() {
  if (!store.canPublish) return;

  data.value.publishStatus = "loading";
  data.value.publishStatus = await store.publishSpec();
  if (data.value.publishStatus === "success") data.value.showSnackbar = true;
}

function handleOpenModal() {
  data.value.isModalOpen = true;
  useUIStore().setModal("Save or discard the change");
}

function handleCloseModal() {
  data.value.isModalOpen = false;
  useUIStore().closeModal();
}

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
  store.$subscribe(
    (mutation, state) => {
      if (state.changed == false) {
        store.changed = true;
      }
    },
    { detached: true }
  );
});

onBeforeRouteUpdate((to, from, next) => {
  const sTo = to.path.split("/");
  const sFrom = from.path.split("/");
  const toName = sTo[sTo.length - 1];
  const fromName = sFrom[sFrom.length - 1];

  const isInternalNavigation = () =>
    (data.value.internal[fromName] as any) && (data.value.internal[toName] as any);

  data.value.transitionName =
    data.value.sections.indexOf(toName) < data.value.sections.indexOf(fromName)
      ? "slide-right"
      : "slide-left";

  // Check if the data is save
  if (anyTabChanged.value && !isInternalNavigation()) {
    handleOpenModal();
    next(false);
  } else {
    next();
  }
});

onBeforeRouteLeave((to, from, next) => {
  // Check if the data is save
  if (anyTabChanged.value) {
    handleOpenModal();
    next(false);
  } else {
    next();
  }
});
</script>
