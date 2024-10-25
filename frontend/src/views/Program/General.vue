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
              :languages="specStore.languageCodes"
              :onLanguageSelected="($event) => specStore.setLanguage({ code: $event })"
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
  notification,
} from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

const specStore = useProgramSpecStore();
const languageStore = useLanguagesStore();

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

// function onLanguageSelected(code: string) {
//   specStore.setLanguage(code);
// }

function onLanguageDeleted(code: string) {
  const language = specStore.languages.find((l) => l.code === code)!;

  // Check if language is used in recipient
  for (const r of specStore.recipients) {
    if (r.language == code) {
      const index = specStore.recipients.findIndex((l) => l.id === r.id);
      notification.error({
        message: "Error",
        description: `${language?.name} is used by recipient #${index + 1}.\nDelete the recipient first!`,
      });
      return;
    }
  }

  // Check if language is used in playlist
  for (const deployment of specStore.deployments) {
    for (const playlist of deployment.playlists) {
      for (const m of playlist.messages) {
        if ((m.languages ?? "").includes(language.code)) {
          notification.error({
            message: "Error",
            description: `${language?.name} is used by '${m.title}' message in '${playlist.title}' playlist.\nDelete the message first!`,
          });
          return; // stop all the loops
        }
      }
    }
  }

  Modal.confirm({
    title: `Are you sure to delete ${language.name}(${code}) language?`,
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
  let form = newLanguage.value.form;
  const code: string = form.code?.toLowerCase() || "";

  // Check if language already exists
  let newLang = languageStore.languages.find(
    (l) => l.code === code || l.name.toLowerCase() === form.name.toLowerCase()
  );

  if (newLang == null) {
    newLang = { name: form.name, code: languageStore.generateNewLanguageCode(form) };
    languageStore.mergeWithSystemLanguages({ newLangs: [newLang] }); // update langs list
  }

  // Update program languages
  specStore.setLanguage(newLang);

  newLanguage.value = {
    modal: false,
    form: {
      name: null,
      code: null,
    },
  };
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
