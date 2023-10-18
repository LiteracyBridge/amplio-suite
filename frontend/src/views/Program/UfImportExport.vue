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
        Upload or Download a User Feedback Questionnaire spreadsheet.
      </h2>
    </header>

    <div class="grid grid-cols-5">
      <div class="flex col-span-5 mx-4 my-2 pl-2 pr-4">
        <div>
          <p><b>Choose</b> the deployment number and language of interest, and:</p>
          <ul>
            <li class="import-export-list">
              <b>Download</b> a User Feedback Questionnaire as a spreadsheet, or
            </li>
            <li class="import-export-list">
              <b>Upload</b> a User Feedback Questionnaire spreadsheet.
            </li>
          </ul>
        </div>
      </div>

      <div class="flex mb-5">
        <div class="mx-5">Deployment:</div>
        <v-input
          class="deployment-number-value"
          name="deploymentNumber"
          type="number"
          min="1"
          :py="py - 0"
          :value="deploymentNumber"
          @input="onSetDeploymentNumber($event.target.value)"
        />
      </div>
      <div class="flex col-span-3">
        <label class="text-right ml-10 mr-5" for="language">Language:</label>
        <languages-selector
          class="suppress-int-border rounded border border-solid border-gray-500"
          name="language"
          :options="languages"
          :languages="language"
          :onLanguageSelected="({ name, code }) => onSetLanguage(code)"
          :onLanguageDeleted="({ name, code }) => onSetLanguage(null)"
          :multiple="false"
          placeholder="Select language"
        />
      </div>

      <!--*********** DOWNLOAD button and messages ***********-->
      <div class="flex flex-col col-start-1 gap-2">
        <VButton
          class="import-button"
          label="Download UF Questionnaire Spreadsheet"
          variant="bg-indigo-200 hover:bg-indigo-400"
          @click="onDownloadClicked"
          :disabled="!selectedQuestionnaireExists"
        />
      </div>

      <div class="flex items-center col-span-4 mr-4 ml-4">
        <p v-if="!selectedQuestionnaireExists && languageName">
          There is no questionnaire for deployment
          <span class="outline-box">{{ deploymentNumber }}</span> in the
          <span class="outline-box">{{ languageName }}</span> language..
        </p>
      </div>

      <!--*******************************************************-->
      <div class="flex col-span-5 mx-4 my-2 pl-2 pr-4"><br /></div>

      <!--*********** UPLOAD button, messages, and confirmation ***********-->
      <div class="flex flex-col col-start-1 gap-2">
        <VButton
          class="import-button"
          label="Upload UF Questionnaire Spreadsheet"
          variant="bg-orange-200 hover:bg-orange-400"
          @click="onUploadClicked"
        />
      </div>

      <div class="flex col-span-5">
        <div
          v-if="needConfirmation"
          class="mx-4 mt-5 pl-2 pr-4 py-2 border-2 border-grey rounded"
        >
          <p class="mb-1">
            There is already a questionnaire for deployment
            <span class="outline-box">{{ deploymentNumber }}</span> in the
            <span class="outline-box">{{ languageName }}</span> language. If you proceed,
            the current questionnaire will be replaced with this new one. If you haven't
            already, please consider downloading a copy as a backup.
          </p>

          <input
            class="mb-5"
            type="checkbox"
            id="replaceCheckbox"
            v-model="replaceConfirmed"
          />
          <label for="replaceCheckbox"> Replace the current questionnaire.</label>

          <div v-if="selectedQuestionnaireHasAnswers" class="mb-3">
            <p class="mb-1" v-if="selectedQuestionnaireHasAnswers">
              There are <span class="outline-box">{{ numberOfAnswers }}</span> existing
              answers for this questionnaire. Please consider carefully whether these
              answers will be invalidated by the new questions, and if so, clear the
              existing answers.
            </p>

            <div v-if="selectedQuestionnaireHasAnswers">
              <div>
                <input type="radio" id="doClear" v-model="clearAnswers" value="true" />
                <label for="doClear">Also clear the existing answers.</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="donotClear"
                  v-model="clearAnswers"
                  value="false"
                />
                <label for="donotClear">Do not clear the existing answers.</label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 float-right">
            <VButton
              class="import-button"
              label="Confirm"
              :disabled="needUploadConfirmation"
              variant="bg-green-300 hover:bg-green-500"
              @click="onConfirmClicked"
            />
            <VButton
              class="ml-5"
              label="Cancel"
              variant="warning"
              @click="resetConfirmations()"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Select file for upload modal -->
    <portal to="modalBody" v-if="showModal.selectFile">
      <div>
        <file-selection-form
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
        <VButton label="Cancel" variant="warning" @click="onCancelUpload()" />
      </footer>
    </portal>

    <!-- Show download wait spinner modal -->
    <portal to="modalBody" v-if="showModal.downloading">
      <div>
        <uf-questionnaire-download
          :programName="programName"
          :programId="programId"
          :deploymentNumber="deploymentNumber"
          :languageName="languageName"
        />
        <font-awesome-icon
          icon="spinner"
          size="2x"
          pulse
          class="block mt-2 upload-spinner"
        />
      </div>
    </portal>

    <portal to="modalFooter" v-if="showModal.downloading">
      <footer class="flex justify-end gap-4 mt-5">
        <p>&nbsp;</p>
      </footer>
    </portal>

    <!-- Show errors in upload candidate or downloaded file -->
    <portal to="modalBody" v-if="showModal.showErrors">
      <div>
        <uf-questionnaire-errors :errors="errors" />
        <font-awesome-icon
          v-if="showModal.showSpinner"
          icon="spinner"
          size="2x"
          pulse
          class="block mt-2 diff-spinner"
        />
      </div>
    </portal>

    <portal to="modalFooter" v-if="showModal.showErrors">
      <footer>
        <p v-html="explanation"></p>
        <div class="flex justify-end gap-4 mt-3">
          <VButton label="Close" type="success" @click="onCloseErrors()" />
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
  /* slide it up a little more */
  top: calc(50% - 3rem);
}

.import-export-list {
  list-style: square inside;
}
</style>

<script>
import { mapActions, mapState } from "pinia";

import FileSelectionForm from "@/components/FileSelectionForm";
import LanguagesSelector from "@/components/LanguagesSelector.vue";
import UfQuestionnaireErrors from "@/components/UfQuestionnaireErrors.vue";
import UfQuestionnaireDownload from "@/components/UfQuestionnaireDownload.vue";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import { getQuestionnaireDownloadLink, questionnaireUpload } from "@/api/uf.api";

export default {
  props: ["programId"],

  components: {
    FileSelectionForm,
    LanguagesSelector,
    UfQuestionnaireDownload,
    UfQuestionnaireErrors,
    VButton,
    VInput,
  },

  computed: {
    ...mapState("programspec", {
      languages: (state) => {
        return state.general.languages;
      },
      programName: (state) => state.general.name,
    }),
    ...mapState("uf", ["counts"]),
    showUnpublishedOption() {
      return this.exportUnpublished || this.altKeyPressed;
    },
    deployments() {
      const deployments = Object.keys(this.counts).sort().join(",");
      return deployments;
    },
    selectedQuestionnaireExists() {
      let exists = false;
      let depl = this.counts[this.deploymentNumber];
      if (depl) {
        let lang = depl[this.language];
        if (lang) {
          exists = lang.questions > 0 || lang.choices > 0;
        }
      }
      console.log(`selectedQuestionnaireExists: ${exists}`);
      return exists;
    },
    selectedQuestionnaireHasAnswers() {
      let hasAnswers = this.numberOfAnswers > 0;
      console.log(`selectedQuestionnaireHasAnswers: ${hasAnswers}`);
      return hasAnswers;
    },
    numberOfAnswers() {
      let numAnswers = 0;
      let depl = this.counts[this.deploymentNumber];
      if (depl) {
        let lang = depl[this.language];
        if (lang) {
          numAnswers = lang.answers;
        }
      }
      console.log(`numberOfAnswers: ${numAnswers}`);
      return numAnswers;
    },

    needUploadConfirmation() {
      let waiting = this.selectedQuestionnaireExists && !this.replaceConfirmed;
      waiting = waiting || (this.selectedQuestionnaireHasAnswers && !this.clearAnswers);
      console.log(
        `needUploadConfirmation: Q exists: ${this.selectedQuestionnaireExists}, ` +
          `Q Conf: ${this.replaceConfirmed}, A exists: ${this.selectedQuestionnaireHasAnswers}, ` +
          `A conf: ${this.clearAnswers}`
      );
      return waiting;
    },
  },

  async created() {
    await this.fetchCounts({ programId: this.programId });
    await this.ensureSpec({ programId: this.programId });
  },

  data: () => ({
    altKeyPressed: false,
    deploymentNumber: 1,
    language: "",
    languageName: null,
    needConfirmation: false,
    replaceConfirmed: false,
    clearAnswers: null,

    downloadLink: null,
    downloadPending: false,

    empty: [],

    selectedFile: null,
    errors: null,
    explanation: "",

    showModal: {
      showSpinner: false,
      selectFile: false,
      showErrors: false,
      downloading: false,
    },
    uploadExplanation:
      "The selected questionnaire spreadsheet cannot be uploaded because it contains one or more errors. Please correct the error(s) and try again.",
    downloadExplanation:
      "The current questionnaire contains one or more errors. You can download the spreadsheet, but the error(s) must be corrected before it can be uploaded again.",
  }),

  methods: {
    ...mapActions("ui", ["setModal", "closeModal", "setNotification"]),
    ...mapActions("uf", ["fetchCounts", "upload"]),
    ...mapActions("programspec", ["ensureSpec"]),

    onSetLanguage(code) {
      this.resetConfirmations();
      this.language = code;
      let info = this.$store.state.languages.languages.find((l) => l.code === code);
      this.languageName = (info && info.name) || code;
      console.log(`Set language to ${this.languageName} (${this.language})`);
    },

    onSetDeploymentNumber(number) {
      this.resetConfirmations();
      this.deploymentNumber = number;
      console.log(`Set deployment to ${this.deploymentNumber}`);
    },

    resetConfirmations(set) {
      this.needConfirmation =
        set && (this.selectedQuestionnaireExists || this.selectedQuestionnaireHasAnswers);
      this.replaceConfirmed = false;
      this.clearAnswers = null;
    },

    /**
     * Download the UF Questionnaire for the selected deployment and language.
     * @returns nothing, really.
     */
    async onDownloadClicked() {
      // Get the link to the downloadable object.
      this.onSetDeploymentNumber(this.deploymentNumber);
      this.errors = null;
      this.resetConfirmations();
      this.doOpenModal({
        modal: "downloading",
        title: "Downloading UF Questionnaire",
        spinner: true,
      });
      const downloadLinkResult = await getQuestionnaireDownloadLink({
        programId: this.programId,
        deploymentNumber: this.deploymentNumber,
        language: this.language,
      });
      if (downloadLinkResult.status === "ok") {
        const downloadUrl = downloadLinkResult.url;
        console.log(
          `Export ${
            this.exportUnpublished ? "unpublished " : ""
          } Program Specification for ${this.programId} from ${downloadLinkResult.url}`
        );
        // Download the object.
        const fetch_response = await fetch(downloadUrl);
        // Get the bits, and add them to an <a> element.
        const data = await fetch_response.arrayBuffer();
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        this.downloadLink = document.createElement("a");

        this.downloadLink.href = window.URL.createObjectURL(blob);
        this.downloadLink.download = downloadLinkResult.object.filename;
        this.doCloseModal();
        if (downloadLinkResult.errors && downloadLinkResult.errors.length > 0) {
          // this.doShowErrors(downloadLinkResult.errors, 'Errors in Downloaded UF Questionnaire');
          this.downloadPending = false;
          this.errors = downloadLinkResult.errors;
          this.explanation = this.downloadExplanation;
          this.doOpenModal({
            modal: "showErrors",
            title: "Errors in Downloaded UF Questionnaire",
            width: 1024,
          });
          this.downloadPending = true;
        } else {
          this.doCloseModal();
          this.doPerformDownload();
        }
      } else {
        this.doCloseModal();
      }
    },

    doPerformDownload() {
      this.downloadLink.click();
    },

    // doShowErrors(errors, title) {
    //     this.downloadPending = false;
    //     this.errors = errors;
    //     this.doOpenModal({modal: 'showErrors', title:title, width: 1024});
    // },

    onCloseErrors() {
      if (this.downloadPending) {
        this.doPerformDownload();
      }
      this.doCloseModal();
    },

    onUploadClicked() {
      // If there is aleady a Questionnaire for the given deployment and language, the user needs to confirm
      // that they wish to replace it.
      if (this.selectedQuestionnaireExists) {
        this.resetConfirmations(true);
      } else {
        // If no existing questionnaire, upload one.
        this.doUpload();
      }
    },

    onConfirmClicked() {
      this.doUpload();
    },

    async doUpload() {
      console.log(
        `Upload UF Questionnaire for ${this.programId}, ${this.deploymentNumber}, ${this.language}`
      );
      // Open the modal to choose the file to upload.
      this.doOpenModal({ modal: "selectFile", title: "Upload UF Questionnaire" });
    },

    onFileSelected(file) {
      // Remember the file so that when the user clicks 'Upload' we'll know which one.
      this.selectedFile = file;
    },

    /**
     * Upload the selected file.
     * @returns Nothing.
     */
    async onUpload() {
      const self = this;
      const clearAnswers = self.clearAnswers === "true";
      self.resetConfirmations();
      if (!self.selectedFile) {
        self.doCloseModal();
        return;
      }
      self.showModal.showSpinner = true;
      // Upload it.
      const data = await self.readFileData(self.selectedFile, true);
      console.log(self.selectedFile);
      let result = await questionnaireUpload({
        programId: self.programId,
        deploymentNumber: self.deploymentNumber,
        language: self.language,
        fileData: data,
        clearAnswers: clearAnswers,
      });
      if (result.status === "ok") {
        self.refreshCounts();
        self.doCloseModal();
      } else {
        //TODO: show errors.
        self.explanation = self.uploadExplanation;
        self.doOpenModal({
          modal: "showErrors",
          title: "Errors in UF Questionnaire Spreadsheet",
          width: 1024,
        });
        self.errors = result.errors;
      }
    },

    async refreshCounts() {
      // If a new questionnaire was just uploaded, we should reflect that in the UI.
      await this.fetchCounts({ programId: this.programId, refresh: true });
    },

    doOpenModal(payload) {
      let { modal, title, spinner, width } = payload;
      this.doCloseModal();
      console.log(`Opening modal with ${modal}, ${title}, ${spinner}`);
      Object.keys(this.showModal).forEach((k) => (this.showModal[k] = false));
      this.showModal[modal] = true;
      this.showModal.showSpinner = !!spinner;
      this.setModal(title, width);
    },

    doCloseModal() {
      Object.keys(this.showModal).forEach((k) => (this.showModal[k] = false));
      this.closeModal();
    },

    onCancelUpload() {
      this.doCloseModal();
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
