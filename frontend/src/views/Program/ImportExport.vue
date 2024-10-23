<template>
  <!-- Notice watching key 18 (alt key) to enable/disable showing the "export un-published" option. -->
  <section class="relative min-h-200-px p-6 pt-0">
    <header class="w-full inline-flex items-center justify-between">
      <h2 class="visually_hidden">
        Upload or Download a Program Specification spreadsheet.
      </h2>
    </header>

    <div class="grid grid-cols-5">
      <div class="flex col-span-5 mx-4 my-2 pl-2 pr-4">
        <div>
          <p>On this page you can:</p>
          <ul>
            <li class="import-export-list">
              Export the current published program specification as a spreadsheet.
            </li>
            <li class="import-export-list">
              Import a program specification spreadsheet.
            </li>
          </ul>
        </div>
      </div>

      <div class="">
        <Button type="primary" @click="onExportProgramSpec()">Export Spreadsheet </Button>
      </div>

      <!-- <div class="col-span-4 mr-4 ml-4">
        <div v-if="showUnpublishedOption">
          <input type="checkbox" id="checkbox" v-model="exportUnpublished" />
          <label for="checkbox"> Export the un-published program specification.</label>
        </div>
      </div>
      -->
    </div>

    <Alert type="info" message="Remember" class="mt-5">
      <template #description>
        This will export the <em>published</em> program specification. If there are
        changes that are not published, those won't be in the exported spreadsheet.
      </template>
    </Alert>

    <Divider></Divider>

    <Button @click="showModal.visible = true" type="primary" :ghost="true"
      >Upload Spreadsheet</Button
    >

    <Alert type="warning" message="Remember" class="mt-5">
      <template #description>
        Always start from a <em>recently exported spreadsheet!</em> First, please upload
        your program specification spreadsheet. You'll then have an opportunity to review
        the changes. If you approve the changes, they'll be saved in the database.
      </template>
    </Alert>

    <Modal
      v-model:open="showModal.visible"
      title="Upload Program Specification"
      @cancel="onCancel()"
      ok-text="Upload"
      :ok-disabled="selectedFile === null"
      @ok="onUpload()"
    >
      <Spin :spinning="showModal.showSpinner">
        <program-spec-import-form
          :contentHidden="showModal.showSpinner"
          @onFileSelected="onFileSelected($event)"
        />
      </Spin>
    </Modal>

    <!-- Show differences from database modal -->
    <!-- <portal to="modalBody" v-if="showModal.showDiffs">
      <div>
        <program-spec-import-diffs
          :contentHidden="showModal.showSpinner"
          :diffs="diffs"
        />
        <font-awesome-icon
          v-if="showModal.showSpinner"
          icon="spinner"
          size="2x"
          pulse
          class="block mt-2 diff-spinner"
        />
      </div>
    </portal>

    <portal to="modalFooter" v-if="showModal.showDiffs">
      <footer>
        <div class="text-right">
          <input type="checkbox" id="checkbox" v-model="publishImported" />
          <label for="checkbox"> Publish the imported program specification.</label>
        </div>
        <div class="flex justify-end gap-4 mt-3">
          <VButton
            :label="publishImported ? 'Import and Publish' : 'Import'"
            type="success"
            @click="onApprove()"
          />
          <VButton label="Cancel" variant="warning" @click="onCancel()" />
        </div>
      </footer>
    </portal> -->
  </section>
</template>

<style scoped>
/* For some reason these don't seem to work via tailwind. */
.upload-spinner,
.diff-spinner {
  position: absolute;
  top: calc(50% - 2rem);
  height: 4rem;
  left: 45%;
  width: 4rem;
}

.diff-spinner {
  /* slide it up a little more for "Pubish the imported progspec" */
  top: calc(50% - 3rem);
}

.import-export-list {
  list-style: square inside;
}
</style>

<script lang="ts" setup>
import { Alert, Button, Divider, Modal, notification, Spin } from "ant-design-vue";
import VButton from "@/components/VButton.vue";
import ProgramSpecImportForm from "@/components/ProgramSpecImportForm.vue";
import ProgramSpecImportDiffs from "@/components/ProgramSpecImportDiffs.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { computed, ref } from "vue";
import { approveSpec, uploadSpec } from "@/api/programspec.api";
import axios from "axios";
import { ApiRequest } from "@/api";
import { Workbook } from "exceljs";

const specStore = useProgramSpecStore();

const exportUnpublished = ref(false);
const selectedFile = ref(null);
const diffs = ref(null);
const publishImported = ref(true);
const showModal = ref({
  showSpinner: false,
  showDiffs: false,
  visible: false,
});

const showUnpublishedOption = computed(() => {
  return exportUnpublished;
});

/**
 * Export the published program spec for the current program. (The "alt" key can be used to enable an option
 * to export the un-published program spec.)
 * @returns nothing, really.
 */
async function onExportProgramSpec() {
  // Get the link to the downloadable object.
  notification.info({
    message: `Exporting ${
      exportUnpublished.value ? "unpublished " : ""
    } Program Specification for ${specStore.programId}`,
  });

  const buffer = await (await createExcel()).xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `program_spec_${
    exportUnpublished.value ? "unpublished" : "published"
  }.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);

  notification.success({
    description: "Program spec exported successfully.",
    message: "Success",
  });
}

function onFileSelected(file: any) {
  selectedFile.value = file;
}

/**
 * Upload the selected file and retrieve the diffs against the current db.
 * @returns Nothing.
 */
async function onUpload() {
  if (!selectedFile.value) return;

  showModal.value.showSpinner = true;

  // Upload it.
  // const data = await readFileData(selectedFile.value, true);
  const result = await uploadSpec(specStore.programId, selectedFile.value);

  if (result.status === "ok") {
    notification.success({
      message: "Program specification spreadsheet uploaded successfully.",
    });

    specStore.setSpec({
      programId: specStore.programId,
      programspec: result.data,
    });
  }
  // let diffs = result?.diff || [];

  // diffs = diffs.map((line: string) =>
  //   line.replace(/^ */, (match) => "\xa0\xa0".repeat(match.length))
  // );
  // console.log(diffs);

  onCancel();
  // onOpenModal("showDiffs", "Import Program Specification");
}

async function onApprove() {
  if (!selectedFile.value) return;
  showModal.value.showSpinner = true;

  const result = await approveSpec({
    programId: specStore.programId,
    publish: publishImported,
  });

  console.log(result);
  if (result && result.status !== "ok") {
    notification.error({ message: result.errors.join() });
  } else {
    notification.success({
      message: `Program specification spreadsheet imported${
        publishImported.value ? " and published" : ""
      }.`,
    });
  }

  onCancel();
}

function onCancel() {
  showModal.value = {
    visible: false,
    showSpinner: false,
    showDiffs: false,
  };
  selectedFile.value = null;
}

async function createExcel() {
  const workbook = new Workbook();
  // await workbook.xlsx.load(join(__dirname, "template.xlsx"));

  const headers = {
    general: {
      program_id: "Program ID",
      country: "Country",
      region: "Regions",
      languages: "Languages",
      deployments_count: "Deployments Count",
      deployments_length: "Deployments Length",
      deployments_first: "Deployments First",
      listening_models: "Listening Models",
      feedback_frequency: "Feedback Frequency",
      sustainable_development_goals: "Sustainable Development Goals",
      direct_beneficiaries_map: "Direct Beneficiaries Map",
      direct_beneficiaries_additional_map: "Direct Beneficiaries Additional Map",
      affiliate: "Affiliate",
      partner: "Partner",
    },
    deployment: {
      deploymentnumber: "Deployment #",
      startdate: "Start Date", // date
      enddate: "End Date", // date
      //  'deployment': 'Deployment',
      deploymentname: "Deployment Name",
    },
    content: {
      deployment_num: "Deployment #",
      playlist_title: "Playlist Title",
      message_title: "Message Title",
      key_points: "Key Points",
      languagecode: "Language Code",
      variant: "Variant",
      format: "Format",
      audience: "Audience",
      default_category: "Default Category",
      sdg_goals: "SDG Goals",
      sdg_targets: "SDG Targets",
    },
    recipient: {
      country: "Country",
      language: "Language Code",
      region: "Region",
      district: "District",
      communityname: "Community",
      groupname: "Group Name",
      agent: "Agent",
      variant: "Variant",
      listening_model: "Listening Model",
      group_size: "Group Size",
      numhouseholds: "# HH",
      numtbs: "# TBs",
      supportentity: "Support Entity",
      agent_gender: "Agent Gender",
      direct_beneficiaries: "Direct Beneficiaries",
      direct_beneficiaries_additional: "Direct Beneficiaries Additional",
      indirect_beneficiaries: "Indirect Beneficiaries",
      deployments: "Deployments",
      recipientid: "RecipientID",
      affiliate: "Affiliate",
      partner: "Partner",
      component: "Component",
    },
    languages: { name: "name", code: "code" },
  };
  // Create general sheet
  const generalSheet = workbook.addWorksheet("General");
  generalSheet.columns = Object.keys(headers.general).map((k) => ({
    // @ts-ignore

    header: headers.general[k],
    key: k,
  }));
  generalSheet.addRow({
    program_id: specStore.general.program_id,
    country: specStore.general.country,
    region: specStore.general.region,
    languages: specStore.languages.map((l) => l.code),
    deployments_count: specStore.deployments.length,
    deployments_length: specStore.general.deployments_length,
    deployments_first: specStore.general.deployments_first,
    listening_models: specStore.general.listening_models,
    feedback_frequency: specStore.general.feedback_frequency,
    sustainable_development_goals: specStore.general.sustainable_development_goals,
    direct_beneficiaries_map: specStore.general.direct_beneficiaries_map,
    direct_beneficiaries_additional_map:
      specStore.general.direct_beneficiaries_additional_map,
    affiliate: specStore.general.affiliate,
    partner: specStore.general.partner,
  });

  // Create deployments sheet
  const deploymentSheet = workbook.addWorksheet("Deployments");
  deploymentSheet.columns = Object.keys(headers.deployment).map((k) => ({
    // @ts-ignore

    header: headers.deployment[k],
    key: k,
  }));
  for (const d of specStore.deployments) {
    deploymentSheet.addRow({
      deploymentnumber: d.deploymentnumber,
      startdate: d.start_date,
      enddate: d.end_date,
      deploymentname: d.deploymentname,
    });
  }

  // Languages sheet
  const langSheet = workbook.addWorksheet("Languages");
  langSheet.columns = Object.keys(headers.languages).map((k) => ({
    // @ts-ignore

    header: headers.languages[k],
    key: k,
  }));
  for (const l of specStore.languages) {
    langSheet.addRow({ name: l.name, code: l.code });
  }

  // Contents sheet
  const contentSheet = workbook.addWorksheet("Content");
  contentSheet.columns = Object.keys(headers.content).map((k) => ({
    // @ts-ignore
    header: headers.content[k],
    key: k,
  }));
  for (const d of specStore.deployments) {
    for (const p of d.playlists) {
      for (const m of p.messages) {
        contentSheet.addRow({
          deployment_num: d.deploymentnumber,
          playlist_title: p.title,
          message_title: m.title,
          key_points: m.key_points,
          languagecode: m.languages,
          variant: m.variant,
          format: m.format,
          audience: p.audience,
          default_category: m.default_category_code,
          sdg_goals: m.sdg_goal_id, // TODO: read from relation
          sdg_targets: m.sdg_target_id, // TODO: read from relation
        });
      }
    }
  }

  // Recipients sheet
  const recipientSheet = workbook.addWorksheet("Recipients");
  recipientSheet.columns = Object.keys(headers.recipient).map((k) => ({
    // @ts-ignore

    header: headers.recipient[k],
    key: k,
  }));
  for (const r of specStore.recipients) {
    recipientSheet.addRow({
      country: r.country,
      language: r.language,
      region: r.region,
      district: r.district,
      communityname: r.community_name,
      groupname: r.group_name,
      agent: r.agent,
      variant: r.variant,
      listening_model: r.listening_model,
      group_size: r.group_size,
      numhouseholds: r.numhouseholds ?? 0,
      numtbs: r.numtbs,
      supportentity: r.support_entity,
      agent_gender: r.agent_gender,
      direct_beneficiaries: r.direct_beneficiaries,
      direct_beneficiaries_additional: r.direct_beneficiaries_additional,
      indirect_beneficiaries: r.indirect_beneficiaries,
      deployments: r.deployments,
      recipientid: r.id,
      affiliate: r.affiliate,
      partner: r.partner,
      component: r.component,
    });
  }

  return workbook;
}
</script>
