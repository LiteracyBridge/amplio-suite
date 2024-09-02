<template>
  <div>
    <Form
      layout="vertical"
      :model="specStore.general"
      @values-change="specStore.changed = true"
    >
      <Row :gutter="8">
        <Col :span="8">
          <FormItem label="Program Name">
            <Input
              name="programName"
              type="text"
              placeholder="Enter Program Name"
              v-model:value="specStore.general.name"
            /> </FormItem
        ></Col>
        <Col :span="8">
          <FormItem label="Country">
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
          </FormItem>
        </Col>

        <Col :span="8">
          <FormItem label="Region/State">
            <Select
              mode="tags"
              id="region"
              tag-placeholder="Add this as new region"
              placeholder="Search or add a region"
              v-model:value="specStore.general.region"
              :options="data.regionOptions"
            >
            </Select
          ></FormItem>
        </Col>
      </Row>

      <Row :gutter="8">
        <Col :span="8">
          <FormItem label="Languages">
            <LanguagesSelector
              :languages="specStore.general.languages"
              :onLanguageSelected="onLanguageSelected"
              :onLanguageDeleted="onLanguageDeleted"
              :multiple="true"
            />
            <Button type="link" @click.prevent="newLanguage.modal = true"
              >Not in list? Click to create new language</Button
            >
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="Listening Models">
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
          </FormItem>
        </Col>
      </Row>
    </Form>

    <!-- Direct beneficiaries -->
    <Row>
      <Col :span="12">
        <List bordered>
          <template #header>
            <span class="font-bold">Direct Beneficiaries</span>
            <p class="col-span-2 md:col-span-4 text-sm text-blue">
              The direct beneficiaries properties apply to the Recipients tab, and allow
              to gather custom information regarding the recipients
            </p>
          </template>

          <template v-for="item in specStore.directBeneficiariesLabels">
            <ListItem>
              <Input
                v-model:value="item.value"
                @change="
                  specStore.setDirectBeneficiariesLabel({
                    key: item.key,
                    value: $event.target.value,
                  })
                "
              ></Input>
            </ListItem>
          </template>

          <template v-for="item in specStore.directBeneficiariesAdditionalLabels">
            <ListItem>
              <template #actions>
                <Popconfirm
                  title="Are you sure to delete this field?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="specStore.deleteDirectBeneficiariesAdditionalLabel(item.key)"
                >
                  <Button type="link" :danger="true">Delete</Button>
                </Popconfirm>
              </template>

              <Input
                v-model:value="item.value"
                @change="
                  specStore.setDirectBeneficiariesAdditionalLabel({
                    key: item.key,
                    value: $event.target.value,
                  })
                "
              ></Input>
            </ListItem>
          </template>

          <template #footer>
            <Button block type="primary" :ghost="true" @click="addField()"
              >+ Add Optional Field</Button
            >
          </template>
        </List>
      </Col>
    </Row>

    <!-- New language modal -->
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
      </Form>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import LanguagesSelector from "@/components/LanguagesSelector.vue";
import { useProgramSpecStore } from "@/store/programspec";
import countries from "@/data/countries.json";
import listeningModels from "@/data/listeningModels.json";
import { useLanguagesStore } from "@/store/languages";
import { computed, createVNode, onMounted, ref } from "vue";
import {
  Row,
  ListItemMeta,
  Col,
  Button,
  Modal,
  Select,
  SelectOption,
  Form,
  FormItem,
  Input,
  List,
  ListItem,
  Popconfirm,
} from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  programId: string;
}>();

const specStore = useProgramSpecStore(),
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

  // -----------------------
  console.log("[*] lang code added : ", code)
}

function onLanguageDeleted(code: string) {
  const language = languageStore.languages.find((l) => l.code === code);
  // --------------------------------
  // Get list of languages in recipient
  console.log("[*] lang deleted : ", language.name, language.code);
  
  var languageExistsInRecipients = false;
  var languageExistsInContents = false;
  specStore.recipients.forEach((recp) => {
    if (recp.language == language.code) {
      console.log("[*] ", language.code, " exists in recipients");
      languageExistsInRecipients = true;
    } else {
      console.log("[*] ", language.code, " does not exists in recipients");
      //return false;
    }
  });

  specStore.deployments.forEach((depl) => {
    console.log("[*] depl : ", depl);
    depl.playlists.forEach((playlist) => {
      console.log("\t[*] playlist messages : ", playlist.messages)
      playlist.messages.forEach((content) => {
        console.log("\t\t[*] content languages : ", content.languages)
        if (content.languages !== undefined) {
          if (content.languages.includes(language.code)) {
            languageExistsInContents = true;
            console.log("<===> [*][*][*] ", language.code, " exists in content")
          }
        }
      })
    });
  });

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

function addField() {
  const key = `field_${Math.random().toString(36).substring(7)}`;

  specStore.setDirectBeneficiariesAdditionalLabel({
    key: key,
    value: "New Optional Field",
  });
}

onMounted(() => {
  specStore.general.listening_models ??= ["Other"];
  specStore.general.region = Array.isArray(specStore.general.region)
    ? specStore.general.region || []
    : [specStore.general.region];

  data.value.regionOptions = (specStore.general.region || []).map((i: string) => ({
    value: i,
  }));
});
</script>
