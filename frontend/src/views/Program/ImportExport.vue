<template>
  <section class="relative min-h-200-px p-6 pt-0" v-on:keydown.18.prevent="altKeyPressed=true" v-on:keyup.18.prevent="altKeyPressed=false" tabindex="0">

    <loading v-if="status !== 'success'" class="-ml-6 rounded-b-lg" />

    <header class="w-full inline-flex items-center justify-between">
      <h2 class="visually_hidden">Upload or Download a Program Specification spreadsheet.</h2>

    </header>


    <div class="grid grid-cols-5">
      <div class="flex col-span-5 mx-4 my-2 pl-2 pr-4">
        <div>
          <p bg-red>On this page you can download the currently published program specification as a spreadsheet.<br/>
          <p v-if="!exportUnpublished" class="p-1 my-2 ml-2 mr-6 max-w-3xl border-2 border-grey rounded"><b>Remember:</b> this will export the <em>published</em> program
            specification. If changes have been made, but not published, those won't be in the exported spreadsheet.</p>
          <p>
            You can upload a new program specification from a spreadsheet. If you do <em>please be sure to start
            with a freshly downloaded spreadsheet! </em>
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <VButton class="export-button"
          label="Export Spreadsheet"
          variant="bg-gray-200"
          @click="onExportProgramSpec"
         />

        <VButton class="import-button"
          label="Import Spreadsheet"
          variant="bg-red-200 hover:bg-red-400"
          @click="onImportProgramSpec"
        />
      </div>

      <div class="col-span-4 mr-4 ml-4">
        <div v-if="showUnpublishedOption">
        <input type="checkbox" id="checkbox" v-model="exportUnpublished">
        <label for="checkbox"> Export the un-published program specification. {{ exportUnpublished ? '*' : '' }}</label>
        </div>
      </div>

    </div>

    <!-- Import modal -->
    <portal to="modalBody" v-if="showModal.selectFile">
      <program-spec-import-form
        @ok="onFileSelected($event)"
        @cancel="onCancel($event)"
      />
    </portal>

    <!-- Show showDiffs modal -->
    <portal to="modalBody" v-if="showModal.showDiffs">
      <p class="text-xl">This recipient will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal.showDiffs">
      <footer class="flex justify-end gap-4 mt-5">
        <VButton
          label="Confirm"
          @click="confirmImport"
        />
        <VButton
          label="Cancel"
          variant="warning"
          class="warning"
          @click="onCloseModal"
        />
      </footer>
    </portal>


    <portal to="modalFooter" v-if="showModal.mandatory">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton
          label="Close"
          @click="onClickEdit(selectedRecipientId)"
        />
      </footer>
    </portal>
  </section>
</template>

<script>

import { /*mapState, mapGetters, mapMutations,*/ mapActions } from 'vuex'

// import VInput from '@/components/VInput'
import VButton from '@/components/VButton'
import Loading from '@/components/Loading'
// import VTooltip from '@/components/VTooltip'
// import { EventBus } from '@/event-bus'
import ProgramSpecImportForm from '@/components/ProgramSpecImportForm'

export default {
  props: ['programId'],

  components: {
    // VInput,
    VButton,
    Loading,
    // VTooltip,
    ProgramSpecImportForm,
  },

  computed: {
    showUnpublishedOption() {
      return this.exportUnpublished || this.altKeyPressed;
    }
  },

  data: () => ({
    exportUnpublished: false,
    status: 'success',
    altKeyPressed: false,
    diffs: null,
    showModal: {
      selectFile: false,
      showDiffs: false
    },
  }),

  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('content2', [
      'getExportLink',
      'uploadSpec',
    ]),

  increment: function() {
      this.altKeyPressed = true;
    },
    decrement: function() {
      this.altKeyPressed = false;
    },

    /**
     * Export the published program spec for the current program. (The "alt" key can be used to enable an option
     * to download the un-published program spec.)
     * @returns nothing, really.
     */
    async onExportProgramSpec () {
      // Get the link to the downloadable object.
      const downloadLink = await this.getExportLink({programId:this.programId, artifact:this.exportUnpublished ? 'unpublished':'published'});
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
        // Simulate a click on the <a>
        link.click();
      }
    },

    async onImportProgramSpec () {
      console.log(`Import Program Specification for ${this.programId}`);
      this.onOpenModal('selectFile', 'Import Program Specification');
    },

    onOpenModal (modal, title) {
      Object.keys(this.showModal).forEach(k=>this.showModal[k] = false);
      this.showModal[modal] = true
      this.setModal(title)
    },

    onCancel() {
      this.onCancelImport();
      Object.keys(this.showModal).forEach(k=>this.showModal[k] = false);
    },

    async onFileSelected(file) {
      // Upload it.
      const data = await this.readFileData(file, true);
      console.log(file);
      this.diffs = await this.uploadSpec({programId:this.programId, fileData:data});
      console.log(this.diffs);
      this.onCancelImport();
      this.onOpenModal('showDiffs', 'Confirm Program Specification Import');
    },

    onCancelImport () {
      Object.keys(this.showModal).forEach(k=>this.showModal[k] = false);
      this.closeModal()
    },
    confirmDeleteRecipient () {
      // this.removeRecipient(this.selectedRecipientId)
      // this.onCloseModal()
    },
    handleModalEscape () {
      // if (this.selectedRecipient.id) this.onClickDiscard()
      // else this.onClickDiscardNewRecipient()
    },

    async readFileData(file, encode) {
      const promise = new Promise( (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (readerEvt) {
          var binaryString = readerEvt.target.result;
          resolve(encode?btoa(binaryString):binaryString);
        };
        reader.onerror = evt => {
          reject(evt);
        };
        reader.readAsBinaryString(file);
      });
      return promise;
    },

  },

}
</script>


<style scoped>
/*
.import-button{
    @apply text-white bg-red-200;
}
.import-button:hover {
    @apply bg-red-400;
}
/*
.export-button{
    text-color: white;
    background: lightblue;
}
.export-button:hover {
    text-color: white;
    background: blue;
}
*/

</style>

