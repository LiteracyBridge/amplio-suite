<template>
    <!-- Notice watching key 18 (alt key) to enable/disable showing the "export un-published" option. -->
    <section class="relative min-h-200-px p-6 pt-0" v-on:keydown.18.prevent="altKeyPressed=true"
             v-on:keyup.18.prevent="altKeyPressed=false" tabindex="0">

        <header class="w-full inline-flex items-center justify-between">
            <h2 class="visually_hidden">Upload or Download a Program Specification spreadsheet.</h2>
        </header>

        <div class="grid grid-cols-5">
            <div class="flex col-span-5 mx-4 my-2 pl-2 pr-4">
                <div>
                    <p><b>Choose</b> the deployment number and language of interest, and:</p>
                    <ul>
                        <li class="import-export-list"><b>Download</b> a User Feedback Questionnaire as a
                            spreadsheet.
                        </li>
                        <li class="import-export-list"><b>Upload</b> a User Feedback Questionnaire spreadsheet.</li>
                    </ul>
                </div>
            </div>

            <div class="flex  mb-5">
                <div class="mx-5">
                    Deployment:
                </div>
                <v-input class="deployment-number-value" name="deploymentNumber"
                         type="number" min="1" :py="py-0" :value="deploymentNumber"
                         @input="onSetDeploymentNumber($event.target.value)"/>
            </div>
            <div class="flex col-span-3">
                <label class="text-right ml-10 mr-5" for="language">Language:</label>
                <languages-selector class="suppress-int-border rounded border border-solid border-gray-500"
                                    name="language" :options="languages" :languages="language"
                                    :onLanguageSelected="({ name, code }) => onSetLanguage(code)"
                                    :onLanguageDeleted="({ name, code }) => onSetLanguage(null)"
                                    :multiple="false" placeholder="Select language"/>
            </div>

            <!--*********** DOWNLOAD button and messages ***********-->
            <div class="flex flex-col col-start-1 gap-2">
                <VButton class="import-button" label="Download UF Questionnaire Spreadsheet"
                         variant="bg-indigo-200 hover:bg-indigo-400"
                         @click="onDownloadClicked"
                         :disabled="!selectedQuestionnaireExists"/>
            </div>

            <div class="flex items-center col-span-4 mr-4 ml-4">
                <p v-if="!selectedQuestionnaireExists && languageName">
                    There is no questionnaire for deployment <span class="outline-box">{{ deploymentNumber }}</span> in
                    the <span class="outline-box">{{ languageName }} language.</span>.
                </p>
            </div>

            <!--*******************************************************-->
            <div class="flex col-span-5 mx-4 my-2 pl-2 pr-4"><br/></div>

            <!--*********** UPLOAD button, messages, and confirmation ***********-->
            <div class="flex flex-col col-start-1 gap-2">
                <VButton class="import-button" label="Upload UF Questionnaire Spreadsheet"
                         variant="bg-orange-200 hover:bg-orange-400" @click="onUploadClicked"/>
            </div>

            <div class="flex col-span-4 mr-4 ml-4">
                <div v-if="needConfirmation">
                    <p>There is already questionnaire for deployment <span
                        class="outline-box">{{ deploymentNumber }}</span> in the <span
                        class="outline-box">{{ languageName }}</span> language.
                        If you proceed, the current questionnaire will be replaced with this new one. This can not be
                        un-done.</p>
                    <input type="checkbox" id="checkbox" v-model="confirmed">
                    <label for="checkbox"> Replace the current questionnaire.</label>
                    <VButton class="import-button float-right" label="Confirm"
                             variant="bg-green-200 hover:bg-green-400" @click="onConfirmClicked"/>
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
                    class="block mt-2 upload-spinner"/>
            </div>
        </portal>

        <portal to="modalFooter" v-if="showModal.selectFile">
            <footer class="flex justify-end gap-4 mt-5">
                <VButton
                    label="Upload"
                    :disabled="selectedFile===null"
                    type="success"
                    @click="onUpload()"
                />
                <VButton
                    label="Cancel"
                    variant="warning"
                    @click="onCancel()"
                />
            </footer>
        </portal>

        <!-- Show differences from database modal -->
        <portal to="modalBody" v-if="showModal.waiting">
            <div class="py-20">
                <p :contentHidden="showModal.showSpinner">&nbsp;</p>
                <font-awesome-icon
                    v-if="showModal.showSpinner"
                    icon="spinner"
                    size="2x"
                    pulse
                    class="block mt-2 diff-spinner"/>
            </div>
        </portal>

        <portal to="modalFooter" v-if="showModal.waiting">
            <footer>
                <div>
                    <p>&nbsp;</p>
                </div>
            </footer>
        </portal>

    </section>
</template>

<style scoped>
/* For some reason these don't seem to work via tailwind. */
.upload-spinner, .diff-spinner {
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

@layer components {
    .outline-box {
        @apply rounded border border-solid border-gray-500 px-1 font-semibold;
    }
}

</style>

<script>

import {mapActions, mapState} from 'vuex'

import VButton from '@/components/VButton'
// import ProgramSpecImportForm from '@/components/ProgramSpecImportForm'
import FileSelectionForm from '@/components/FileSelectionForm'
import VInput from '@/components/VInput.vue';
import LanguagesSelector from '@/components/LanguagesSelector.vue';
import {getQuestionnaireDownloadLink, questionnaireUpload} from '@/api/uf.api';

export default {
    props: ['programId'],

    components: {
        LanguagesSelector,
        VInput,
        VButton,
        // ProgramSpecImportForm,
        FileSelectionForm,
    },

    computed: {
        ...mapState('programspec', {
            languages: (state) => {
                return state.general.languages;
            },
        }),
        ...mapState('uf', [
            'counts',
        ]),
        showUnpublishedOption() {
            return this.exportUnpublished || this.altKeyPressed;
        },
        deployments() {
            const deployments = Object.keys(this.counts).sort().join(',');
            return deployments;
        },
        selectedQuestionnaireExists() {
            let exists = false;
            let depl = this.counts[this.deploymentNumber]
            if (depl) {
                let lang = depl[this.language];
                if (lang) {
                    exists = lang.questions > 0 || lang.choices > 0;
                }
            }
            console.log(`selectedQuestionnaireExists: ${exists}`);
            return exists;
        },

    },

    async created() {
        await this.fetchCounts({programId: this.programId});
        await this.ensureSpec({programId: this.programId});
    },

    data: () => ({
        altKeyPressed: false,
        deploymentNumber: 1,
        language: '',
        languageName: null,
        needConfirmation: false,

        exportUnpublished: false,
        selectedFile: null,
        diffs: null,
        publishImported: true,
        showModal: {
            showSpinner: false,
            selectFile: false,
            showDiffs: false
        },
    }),

    methods: {
        ...mapActions('ui', [
            'setModal',
            'closeModal',
            'setNotification',
        ]),
        ...mapActions('uf', [
            'fetchCounts',
            'upload',
        ]),
        ...mapActions('programspec', [
            'ensureSpec',
        ]),

        onSetLanguage(code) {
            this.needConfirmation = false;
            this.language = code;
            let info = this.$store.state.languages.languages.find(l => l.code === code);
            this.languageName = info && info.name || code;
            console.log(`Set language to ${this.languageName} (${this.language})`);
        },

        onSetDeploymentNumber(number) {
            this.needConfirmation = false;
            this.deploymentNumber = number;
            console.log(`Set deployment to ${this.deploymentNumber}`);
        },

        /**
         * Download the UF Questionnaire for the selected deployment and language.
         * @returns nothing, really.
         */
        async onDownloadClicked() {
            // Get the link to the downloadable object.
            this.onSetDeploymentNumber(this.deploymentNumber);
            this.needConfirmation = false;
            this.onOpenModal('waiting', 'Downloading UF Questionnaire', true);
            const downloadLink = await getQuestionnaireDownloadLink({
                programId: this.programId,
                deploymentNumber: this.deploymentNumber,
                language: this.language
            });
            if (downloadLink.status === 'ok') {
                const downloadUrl = downloadLink.url;
                console.log(`Export ${this.exportUnpublished ? 'unpublished ' : ''} Program Specification for ${this.programId} from ${downloadLink.url}`);
                // Download the object.
                const fetch_response = await fetch(downloadUrl);
                // Get the bits, and add them to an <a> element.
                const data = await fetch_response.arrayBuffer();
                const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = downloadLink.object.filename;
                this.closeModal();
                // Simulate a click on the <a>
                link.click();
            }
            this.closeModal();
        },

        onUploadClicked() {
            // If there is aleady a Questionnaire for the given deployment and language, the user needs to confirm
            // that they wish to replace it.
            if (this.selectedQuestionnaireExists) {
                this.needConfirmation = true;
            } else {
                // If no existing questionnaire, upload one.
                this.doUpload();
            }
        },

        onConfirmClicked() {
            this.doUpload();
        },

        async doUpload() {
            console.log(`Upload UF Questionnaire for ${this.programId}, ${this.deploymentNumber}, ${this.language}`);
            // Open the modal to choose the file to upload.
            this.onOpenModal('selectFile', 'Upload UF Questionnaire');
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
            this.needConfirmation = false;
            if (!this.selectedFile) {
                this.closeModal();
                return;
            }
            this.showModal.showSpinner = true;
            // Upload it.
            const data = await this.readFileData(this.selectedFile, true);
            console.log(this.selectedFile);
            let result = await questionnaireUpload({
                programId: this.programId,
                deploymentNumber: this.deploymentNumber,
                language: this.language,
                fileData: data
            });
            if (result.status === 'ok') {
                this.refresh()
            } else {
                //TODO: show errors.
                this.refresh();
            }
            this.closeModal();
        },

        async refresh() {
            // If a new questionnaire was just uploaded, we should reflect that in the UI.
            await this.fetchCounts({programId: this.programId, refresh: true});
        },

        onOpenModal(modal, title, spinner) {
            this.closeModal();
            console.log(`Opening modal with ${modal}, ${title}, ${spinner}`);
            Object.keys(this.showModal).forEach(k => this.showModal[k] = false);
            this.showModal[modal] = true
            this.showModal.showSpinner = !!spinner;
            this.setModal(title)
        },

        onCancel() {
            this.onCancelImport();
            Object.keys(this.showModal).forEach(k => this.showModal[k] = false);
        },

        onCancelImport() {
            Object.keys(this.showModal).forEach(k => this.showModal[k] = false);
            this.closeModal()
        },

        async readFileData(file, encode) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (readerEvt) {
                    var binaryString = readerEvt.target.result;
                    resolve(encode ? btoa(binaryString) : binaryString);
                };
                reader.onerror = evt => {
                    reject(evt);
                };
                reader.readAsBinaryString(file);
            });
        },

    },

}
</script>

