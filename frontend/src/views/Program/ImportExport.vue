<template>
  <!-- Notice watching key 18 (alt key) to enable/disable showing the "export un-published" option. -->
  <section
    class="relative min-h-200-px p-6 pt-0"
    v-on:keydown.18.prevent="altKeyPressed = true"
    v-on:keyup.18.prevent="altKeyPressed = false"
    tabindex="0"
  >
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
      <div class="flex flex-col gap-2">
        <VButton
          class="export-button"
          label="Export Spreadsheet"
          variant="bg-indigo-200 hover:bg-indigo-400"
          @click="onExportProgramSpec"
        />
      </div>

      <div class="col-span-4 mr-4 ml-4">
        <div v-if="showUnpublishedOption">
          <input type="checkbox" id="checkbox" v-model="exportUnpublished" />
          <label for="checkbox"> Export the un-published program specification.</label>
        </div>
      </div>

      <div class="flex col-span-5 mx-4 my-2 pl-2 pr-4">
        <div>
          <p
            v-if="!exportUnpublished"
            class="p-1 my-2 ml-2 mr-6 max-w-3xl border-2 border-grey rounded"
          >
            <b>Remember:</b> this will export the <em>published</em> program
            specification. If there are changes that are not published, those won't be in
            the exported spreadsheet.
          </p>
          <p v-else class="p-1 my-2 ml-2 mr-6 max-w-3xl border-2 border-grey rounded">
            <b>Remember:</b> this will export the <em>un-published</em> program
            specification. This is not what will be used by the ACM; it uses the
            <em>published</em> program specification only.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <VButton
          class="import-button"
          label="Upload Spreadsheet"
          variant="bg-orange-200 hover:bg-orange-400"
          @click="onUploadProgramSpec"
        />
      </div>

      <div class="flex col-span-5 mx-4 my-2 pl-2 pr-4">
        <div>
          <p class="p-1 my-2 ml-2 mr-6 max-w-3xl border-2 border-grey rounded">
            <b>Remember:</b> Always start from a
            <em>recently exported spreadsheet!</em> First, please upload your program
            specification spreadsheet. You'll then have an opportunity to review the
            changes. If you approve the changes, they'll be saved in the database.
          </p>
        </div>
      </div>
    </div>

    <!-- Select file for upload modal -->
    <portal to="modalBody" v-if="showModal.selectFile">
      <div>
        <program-spec-import-form
          :contentHidden="showModal.showSpinner"
          @onFileSelected="onFileSelected($event)"
        />
        <font-awesome-icon
          v-if="showModal.showSpinner"
          icon="spinner"
          size="2x"
          pulse
          class="block mt-2 upload-spinner"
        />
      </div>
    </portal>

    <portal to="modalFooter" v-if="showModal.selectFile">
      <footer class="flex justify-end gap-4 mt-5">
        <VButton
          label="Upload"
          :disabled="selectedFile === null"
          type="success"
          @click="onUpload()"
        />
        <VButton label="Cancel" variant="warning" @click="onCancel()" />
      </footer>
    </portal>

    <!-- Show differences from database modal -->
    <portal to="modalBody" v-if="showModal.showDiffs">
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
    </portal>
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

<script>
import { mapActions } from "pinia";
import { useUIStore } from "@/store/ui";
import { useAccountStore } from "@/store/account";

import VButton from "@/components/VButton.vue";
import ProgramSpecImportForm from "@/components/ProgramSpecImportForm.vue";
import ProgramSpecImportDiffs from "@/components/ProgramSpecImportDiffs.vue";
import { useProgramSpecStore } from "@/store/programspec";

export default {
  props: ["programId"],

  components: {
    VButton,
    ProgramSpecImportDiffs,
    ProgramSpecImportForm,
  },

  computed: {
    showUnpublishedOption() {
      return this.exportUnpublished || this.altKeyPressed;
    },
  },

  data: () => ({
    altKeyPressed: false,
    exportUnpublished: false,
    selectedFile: null,
    diffs: null,
    publishImported: true,
    showModal: {
      showSpinner: false,
      selectFile: false,
      showDiffs: false,
    },
  }),

  methods: {
    ...mapActions(useUIStore, ["setModal", "closeModal", "setNotification"]),
    ...mapActions(useProgramSpecStore, ["getExportLink", "uploadSpec", "approveSpec"]),

    /**
     * Export the published program spec for the current program. (The "alt" key can be used to enable an option
     * to export the un-published program spec.)
     * @returns nothing, really.
     */
    async onExportProgramSpec() {
      // Get the link to the downloadable object.
      notification.info({
        message: `Exporting ${
          this.exportUnpublished ? "unpublished " : ""
        } Program Specification for ${this.programId}`,
      })
      const downloadLink = await this.getExportLink({
        programId: this.programId,
        artifact: this.exportUnpublished ? "unpublished" : "published",
      });
      if (downloadLink.status === "ok") {
        const downloadUrl = downloadLink.url;
        console.log(
          `Export ${
            this.exportUnpublished ? "unpublished " : ""
          } Program Specification for ${this.programId} from ${downloadLink.url}`
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
    },

    async onUploadProgramSpec() {
      console.log(`Upload Program Specification for ${this.programId}`);
      // Open the modal to choose the file to upload.
      this.onOpenModal("selectFile", "Upload Program Specification");
    },

    onFileSelected(file) {
      this.selectedFile = file;
    },

    /**
     * Upload the selected file and retrieve the diffs against the current db.
     * @returns Nothing.
     */
    async onUpload() {
      if (!this.selectedFile) return;
      this.showModal.showSpinner = true;
      // Upload it.
      const data = await this.readFileData(this.selectedFile, true);
      console.log(this.selectedFile);
      let result = await this.uploadSpec({ programId: this.programId, fileData: data });
      let diffs = (result && result.diff) || [];
      this.diffs = diffs.map((line) =>
        line.replace(/^ */, (match) => "\xa0\xa0".repeat(match.length))
      );
      console.log(this.diffs);
      this.onOpenModal("showDiffs", "Import Program Specification");
    },

    async onApprove() {
      if (!this.selectedFile) return;
      this.showModal.showSpinner = true;
      let result = await this.approveSpec({
        programId: this.programId,
        publish: this.publishImported,
      });
      if (result && result.status !== "ok") {
        this.setNotification({ type: "notice", text: result.errors.join() });
      } else {
        this.setNotification({
          type: "notice",
          text: `Program specification spreadsheet imported${
            this.publishImported ? " and published" : ""
          }.`,
        });
      }
      this.onCancel();
    },

    onOpenModal(modal, title) {
      Object.keys(this.showModal).forEach((k) => (this.showModal[k] = false));
      this.showModal[modal] = true;
      this.setModal(title);
    },

    onCancel() {
      this.onCancelImport();
      Object.keys(this.showModal).forEach((k) => (this.showModal[k] = false));
    },

    onCancelImport() {
      Object.keys(this.showModal).forEach((k) => (this.showModal[k] = false));
      this.closeModal();
    },

    async readFileData(file, encode) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (readerEvt) {
          var binaryString = readerEvt.target.result;
          resolve(encode ? btoa(binaryString) : binaryString);
        };
        reader.onerror = (evt) => {
          reject(evt);
        };
        reader.readAsBinaryString(file);
      });
    },
  },
};
</script>
