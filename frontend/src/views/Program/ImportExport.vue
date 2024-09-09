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

      <div class="col-span-4 mr-4 ml-4">
        <div v-if="showUnpublishedOption">
          <input type="checkbox" id="checkbox" v-model="exportUnpublished" />
          <label for="checkbox"> Export the un-published program specification.</label>
        </div>
      </div>
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
      v-model:visible="showModal.visible"
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

  const downloadLink = await specStore.getExportLink({
    programId: specStore.programId,
    artifact: exportUnpublished ? "unpublished" : "published",
  });
  if (downloadLink.status === "ok") {
    const downloadUrl = downloadLink.url;
    console.log(
      `Export ${
        exportUnpublished.value ? "unpublished " : ""
      } Program Specification for ${specStore.programId} from ${downloadLink.url}`
    );
    // Download the object.
    const fetch_response = await fetch(downloadUrl);
    // Get the bits, and add them to an <a> element.
    const data = await fetch_response.arrayBuffer();
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = downloadLink.object.filename;
    // Simulate a click on the <a>
    link.click();
  }
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

// function onOpenModal(modal, title) {
//   for (const k of Object.keys(showModal.value)) {
//     showModal.value[k] = false;
//   }
//   showModal.value[modal] = true;
//   // this.setModal(title);
// }

function onCancel() {
  showModal.value = {
    visible: false,
    showSpinner: false,
    showDiffs: false,
  };
  selectedFile.value = null;
}
</script>
