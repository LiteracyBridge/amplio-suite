<template>
  <section class="relative min-h-200-px p-6 pt-0">
    <!-- <loading v-if="specStore.status !== 'success'" class="-ml-6 rounded-b-lg" /> -->

    <!-- <program-header
      title="General"
      :changed="specStore.changed"
      :canSave="specStore.changed"
      :description="data.description"
      :onDiscardChanges="() => specStore.fetchSpec({ programId: programId })"
      :onSaveChanges="specStore.updateSpec"
    /> -->

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
        <div>
          <LanguagesSelector
            :languages="specStore.general.languages"
            :onLanguageSelected="onLanguageSelected"
            :onLanguageDeleted="onLanguageDeleted"
            :multiple="true"
          />
          <Button type="link" @click.prevent="newLanguage.modal = true"
            >Not in list? Click to create new language</Button
          >
        </div>

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

    <Modal
      v-model:open="newLanguage.modal"
      title="Add New Language"
      ok-text="Save"
      @ok="addNewLanguage()"
      @cancel="newLanguage.form = { code: null, name: null }"
    >
      <Form layout="vertical" :model="newLanguage.form">
        <FormItem id="name" :required="true" label="Language Name">
          <Input
            name="name"
            type="text"
            :required="true"
            placeholder="eg. English"
            v-model:value="newLanguage.form.name"
          />
        </FormItem>

        <FormItem id="code" label="Language Code">
          <Input
            name="code"
            type="text"
            placeholder="eg. en"
            v-model:value="newLanguage.form.code"
          />
        </FormItem>
        <!-- <FormItem id="comments" label="Language comments">
          <Input
            name="comments"
            type="text"
            placeholder="eg. en"
            v-model:value="newLanguage.form.code"
          />
        </FormItem> -->
      </Form>
    </Modal>

    <!-- For modal components -->
    <!-- <portal to="modalBody" v-if="data.languageToDelete">
      <p>This language will be deleted.</p>
    </portal>

    <portal to="modalFooter" v-if="data.languageToDelete">
      <footer class="flex flex-row-reverse justify-between">
        <VButton label="Confirm" variant="warning" @click="confirmLanguageDeletion" />
        <VButton label="Cancel" @click="cancelLanguageDeletion" />
      </footer>
    </portal> -->
  </section>
</template>

<script lang="ts" setup>
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
import { computed, createVNode, onMounted, ref } from "vue";
import {
  Button,
  Modal,
  Select,
  SelectOption,
  Form,
  FormItem,
  Input,
} from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

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
  //   languageToDelete: null,
  beneficiariesIsOpen: false,
  isAddingNewLanguage: false,
});

const newLanguage = ref({
  modal: false,
  form: {
    name: null,
    code: null,
  },
});

function onLanguageSelected(code: string) {
  let index = specStore.general.languages.length;
  specStore.setLanguages({ lang: code, index });
}

function onLanguageDeleted(code: string) {
  const language = languageStore.languages.find((l) => l.code === code);

  Modal.confirm({
    title: `Are you sure to delete '${language?.name || code}' language?`,
    icon: createVNode(ExclamationCircleOutlined),
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      specStore.deleteLanguage(code);
    },
  });
  //   data.value.languageToDelete = language;
  //   uiStore.setModal(`Delete Language ${language?.name}`);
}

function addNewLanguage() {
  let language = newLanguage.value.form;
  let code: string = language.code || "";

  // Check if language already exists
  const exists = languageStore.languages.find(
    (l) =>
      l.code.toLowerCase() == code.toLowerCase() ||
      l.name.toLowerCase() == language.name.toLowerCase()
  );

  if (exists != null) {
    language = exists;
  } else {
    language.code = languageStore.generateNewLanguageCode(language);
  }

  // Update main languages list
  languageStore.languages = [...(languageStore.languages || []), language];

  // Update program languages
  onLanguageSelected(language.code);

  //   newLanguage.value.modal = false;
  newLanguage.value = {
    modal: false,
    form: {
      name: null,
      code: null,
    },
  };

  if (!exists) {
    specStore.general.new_languages = [
      ...(specStore.general.new_languages || []),
      language,
    ];
  }
}

onMounted(() => {
  specStore.general.listening_models ??= ["Other"];
  specStore.general.region = Array.isArray(specStore.general.region)
    ? specStore.general.region || []
    : [specStore.general.region];

  data.value.regionOptions = (specStore.general.region || []).map((i: string) => ({
    value: i,
  }));

  languageStore.fetchLanguages(props.programId);

  //   Watch for state changes
  // this subscription will be kept even after the component is unmounted
  specStore.$subscribe(
    (mutation, state) => {
      if (state.changed == false) {
        specStore.changed = true;
      }
    },
    { detached: true }
  );
});
</script>
