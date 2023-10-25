<template>
  <section class="relative min-h-200-px p-6 pt-0">
    <loading v-if="specStore.status !== 'success'" class="-ml-6 rounded-b-lg" />

    <program-header
      title="General"
      :changed="specStore.changed"
      :canSave="specStore.changed"
      :description="data.description"
      :onDiscardChanges="() => specStore.fetchSpec({ programId: programId })"
      :onSaveChanges="specStore.updateSpec"
    />

    <div class="min-h-200-px my-5 text-center">
      <!-- Separater line between heading and content -->
      <p class="-mx-6 mb-2 px-6 bg-gray-400 text-xl text-left border-2 border-gray-600" />
      <div
        class="grid grid-cols-form-2 md:grid-cols-form-4 row-gap-2 items-center text-left"
      >
        <label for="programName">Program Name</label>
        <v-input
          id="programName"
          ref="programName"
          name="programName"
          type="text"
          placeholder="Enter Program Name"
          :value="specStore.general.name"
          @input="(event) => specStore.setProgramName(event.target.value)"
          mx="mx-0"
          class="w-full"
        />

        <span class="col-span-2" />

        <label for="country">Country</label>
        <Select
          id="country"
          v-model:value="specStore.general.country"
          placeholder="Select one country"
          aria-label="Select one country"
          :show-search="true"
        >
          <SelectOption v-for="name in countries" :value="name">{{
            name
          }}</SelectOption></Select
        >

        <label class="md:pl-4" for="region">Region/State</label>
        <Select
          mode="tags"
          id="region"
          tag-placeholder="Add this as new region"
          placeholder="Search or add a region"
          v-model:value="specStore.general.region"
          :options="data.regionOptions"
        >
        </Select>

        <span id="langs">Languages</span>
        <LanguagesSelector
          :languages="specStore.general.languages"
          :onLanguageSelected="onLanguageSelected"
          :onLanguageDeleted="onLanguageDeleted"
          :multiple="true"
        />

        <label class="md:pl-4" for="listeningModel">Listening Model</label>
        <Select
          v-if="listeningModels.length > 0"
          id="listeningModel"
          :options="listeningModels"
          v-model:value="specStore.general.listening_models"
          mode="multiple"
          :field-names="{ label: 'label', value: 'label' }"
          :preserve-search="true"
          placeholder="Select the listening model"
        ></Select>
        <font-awesome-icon
          v-else
          icon="spinner"
          size="2x"
          pulse
          class="block w-10 h-10 mt-2 text-left"
        />
      </div>

      <div class="w-full inline-flex items-center mt-10 text-left">
        <span class="font-bold mr-4">Direct Beneficiaries</span>
        <Button type="text" @click="data.beneficiariesIsOpen = !data.beneficiariesIsOpen">
          {{ data.beneficiariesIsOpen ? "Hide Details" : "Show Details" }}

          <font-awesome-icon
            :icon="data.beneficiariesIsOpen ? 'chevron-up' : 'chevron-down'"
            class="w-6 h-6"
          />
        </Button>
      </div>

      <div
        :class="data.beneficiariesIsOpen ? 'visible' : 'hidden'"
        class="grid grid-cols-form-2 md:grid-cols-form-4 row-gap-2 items-center text-left pl-10"
      >
        <p class="col-span-2 md:col-span-4 text-sm text-blue">
          The direct beneficiaries properties apply to the Recipients tab, and allow to
          gather custom information regarding the recipients
        </p>
        <div
          v-for="(opt, index) in specStore.directBeneficiariesLabels"
          :key="`${opt.key}-label`"
        >
          <span :class="index % 2 === 1 ? 'md:pl-4' : ''"> Field {{ index + 1 }} </span>
          <v-input
            type="text"
            :value="opt.value"
            @input="
              specStore.setDirectBeneficiariesLabel({
                key: opt.key,
                value: $event.target.value,
              })
            "
            mx="mx-0"
            class="w-full"
          />
        </div>

        <span class="col-span-2" />

        <div
          v-for="(opt, index) in specStore.directBeneficiariesAdditionalLabels"
          :key="`${opt.key}-label`"
        >
          <span :class="index % 2 === 1 ? 'md:pl-4' : ''">
            Additional Field {{ index + 1 }}
          </span>
          <div class="flex items-center">
            <v-input
              type="text"
              :value="opt.value"
              @input="
                specStore.setDirectBeneficiariesAdditionalLabel({
                  key: opt.key,
                  value: $event.target.value,
                })
              "
              mx="mx-0 mr-2"
              class="w-full"
            />

            <VButton
              variant="warning"
              iconL="trash-alt"
              :disabled="specStore.labelUsed.includes(opt.key)"
              :ariaLabel="`Delete option field ${opt.value}`"
              @click="specStore.deleteDirectBeneficiariesAdditionalLabel(opt.key)"
            />

            <v-tooltip
              v-if="specStore.labelUsed.includes(opt.key)"
              text="Field used in multiple recipients"
              class="my-auto"
            >
              <font-awesome-icon class="text-orange-600" icon="exclamation-circle" />
            </v-tooltip>
          </div>
        </div>

        <div class="col-span-4">
          <VButton
            tag="span"
            label="+ Add Optional Field"
            @click="specStore.addDirectBeneficiariesAdditionalLabel"
          />
        </div>
      </div>
    </div>

    <!-- For modal components -->
    <portal to="modalBody" v-if="data.languageToDelete">
      <p>This language will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="data.languageToDelete">
      <footer class="flex flex-row-reverse justify-between">
        <VButton label="Confirm" variant="warning" @click="confirmLanguageDeletion" />
        <VButton label="Cancel" @click="cancelLanguageDeletion" />
      </footer>
    </portal>
  </section>
</template>

<script lang="ts" setup>
import Multiselect from "vue-multiselect";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import VTooltip from "@/components/VTooltip.vue";
import LanguagesSelector from "@/components/LanguagesSelector.vue";
import Loading from "@/components/Loading.vue";
import ProgramHeader from "@/components/ProgramHeader.vue";
import { useProgramSpecStore } from "@/store/programspec";
import countries from "@/data/countries.json";
import listeningModels from "@/data/listeningModels.json";
import { useUIStore } from "@/store/ui";
import { useLanguagesStore } from "@/store/languages";
import { computed, onMounted, ref } from "vue";
import { Button, Select, SelectOption } from "ant-design-vue";

const props = defineProps<{
  programId: string;
}>();
const specStore = useProgramSpecStore(),
  uiStore = useUIStore(),
  languageStore = useLanguagesStore();

const data = ref({
  description:
    "You can modify your program name and languages here.<br>You can also rename existing fields and add additional fields for  “Recipients> Direct Beneficiaries“",

  countries,
  regionOptions: [],
  languageToDelete: null,
  beneficiariesIsOpen: false,
});

// const specListeningModels = computed(() => {
//   return specStore.general.listening_models || [];
// });

// const listeningModelsSelected = computed(() => {
//   /**
//    * Given a listening model label from the program, find the corresponding global listening model object.
//    * @param programListeningModel label to be found.
//    * @returns the global object, or a local object with the image from "Other" if not found.
//    */
//   function lmo(programListeningModel: string) {
//     let found = listeningModels.find((lm) => lm.label === programListeningModel);
//     if (!found)
//       found = {
//         id: null,
//         label: programListeningModel,
//         imgUrl: "https://amplio-suite.s3-us-west-2.amazonaws.com/img/listening/Other.png",
//       };
//     return found;
//   }

//   let result: any[] = [];
//   if (this) {
//     // return a list of this program's listening models, mapped to the global listening model descriptions.
//     specListeningModels.value.forEach((programListeningModel: string) => {
//       let found = lmo(programListeningModel);
//       if (result.indexOf(found) < 0) result.push(found);
//     });
//   }
//   return result;
// });

// function addTag(region: any) {
// //   data.value.regionOptions = Array.from(
// //     new Set([...data.value.regionOptions.flatMap((i) => i.value), { value: region }])
// //   ).map((i) => ({ value: i }));
//   //   specStore.addRegion(region);
// }

function onLanguageSelected(code: string) {
  //   console.warn(language);
  let index = specStore.general.languages.length;
  specStore.setLanguages({ lang: code, index });
}

function onLanguageDeleted(code: string) {
  const language = languageStore.languages.find((l) => l.code === code);
  data.value.languageToDelete = language;
  uiStore.setModal(`Delete Language ${language?.name}`);
}

function confirmLanguageDeletion() {
  specStore.deleteLanguage(data.value.languageToDelete.code);
  data.value.languageToDelete = null;
  uiStore.closeModal();
}
function cancelLanguageDeletion() {
  data.value.languageToDelete = null;
  uiStore.closeModal();
}

onMounted(() => {
  specStore.general.listening_models ??= ["Other"];
  specStore.general.region = Array.isArray(specStore.general.region)
    ? specStore.general.region || []
    : [specStore.general.region];

  data.value.regionOptions = (specStore.general.region || []).map((i) => ({ value: i }));

  languageStore.fetchLanguages(props.programId);
});

// const
// export default {
//   //   props: ["programId"],
//   computed: {
//     ...mapState(useProgramSpecStore, {
//       status: (state) => state.status,

//       programName: (state) => state.general.name,
//       country: (state) => state.general.country,
//       region: (state) => state.general.region,
//       languages: (state) => state.general.languages,
//       //   listeningModels: (state) => state.general.listening_models || [],
//     }),
//     ...mapState(useProgramSpecStore, [
//       "labelUsed",
//       "directBeneficiariesLabels",
//       "directBeneficiariesAdditionalLabels",
//       "changed",
//     ]),
//     // listeningModelsOptions() {
//     //   return listeningModels;
//     // },

//     // changed() {
//     //   return useProgramSpecStore().changed;
//     // },
//   },
//   components: {
//     VButton,
//     VInput,
//     VTooltip,
//     Multiselect,
//     LanguagesSelector,
//     Loading,
//     ProgramHeader,
//   },
//   created() {
//     this.fetchLanguages(this.programId);
//   },
//   FIXME: add watch
//   watch: {
//     region: {
//       immediate: true,
//       handler() {
//         this.regionOptions = [...(this.region || [])]; // Populete the options
//       },
//     },
//   },
//   data() {
//     // return {
//     //   description:
//     //     "You can modify your program name and languages here.<br>You can also rename existing fields and add additional fields for  “Recipients> Direct Beneficiaries“",

//     //   countries,
//     //   regionOptions: [],
//     //   languageToDelete: null,
//     //   beneficiariesIsOpen: false,
//     // };
//   },
//   methods: {
// ...mapActions(useUIStore, ["setModal", "closeModal"]),
// ...mapActions(useProgramSpecStore, [
//   "ensureSpec",
//   "fetchSpec",
//   "updateSpec",

//   "setProgramName",

//   "setCountry",
//   "addRegion",
//   "removeRegion",
//   "setLanguages",
//   "deleteLanguage",
//   "toggleListeningModel",
//   "setDirectBeneficiariesLabel",
//   "setDirectBeneficiariesAdditionalLabel",
//   "addDirectBeneficiariesAdditionalLabel",
//   "deleteDirectBeneficiariesAdditionalLabel",
// ]),
// ...mapActions(useLanguagesStore, ["fetchLanguages"]),
// addTag(region) {
//   this.addRegion(region);
// },
// onLanguageSelected(language) {
//   console.warn(language);
//   let index = this.languages.length;
//   this.setLanguages({ lang: language.code, index });
// },
// onLanguageDeleted(language) {
//   this.languageToDelete = language;
//   this.setModal(`Delete Language ${language?.name}`);
// },
// confirmLanguageDeletion() {
//   this.deleteLanguage(this.languageToDelete.code);
//   this.languageToDelete = null;
//   this.closeModal();
// },
// cancelLanguageDeletion() {
//   this.languageToDelete = null;
//   this.closeModal();
// },
//     spam() {
//       console.log("nuevo click");
//     },
//   },
// };
</script>
