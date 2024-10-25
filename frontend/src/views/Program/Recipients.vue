<template>
  <section>
    <!-- <header class="w-full inline-flex items-center justify-between">
      <h2 class="visually_hidden">Recipients</h2>

      <VButton tag="span" label="+ Add Recipient" @click="addNewRecipient" />

      <div class="inline-flex">
        <!-- <form v-on:submit.prevent="fetchRecipients(programId)">
          <v-input
            type="text"
            name="filterColumns"
            placeholder="Filter columns"
            iconRight="search"
            mx="mx-2"
            :value="store.filterText"
            @input="setFilterText($event.target.value)"
          />
        </form>
        <VButton
          tag="span"
          label="Reset Filter"
          :disabled="!tableIsFilter"
          @click="store.resetFilters"
        />
        -->
    <!-- </div> -->
    <!-- </header> -->

    <Table
      :columns="columns"
      :data-source="recipients"
      :sticky="true"
      :pagination="false"
      class="ant-table-striped"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    >
      <template #title>
        <div class="flex justify-end">
          <Input
            type="text"
            class="mr-10"
            placeholder="Search recipient"
            @change="filterRecipient($event.target.value)"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </Input>

          <Button @click="addNewRecipient()" type="primary" :ghost="true"
            >+ Add Recipient</Button
          >
        </div>
      </template>

      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>

        <template v-if="column.key === 'region'">
          {{ record.region }}
        </template>

        <template v-if="column.key === 'district'">
          {{ record.district }}
        </template>

        <template v-if="column.key === 'community_name'">
          {{ record.community_name }}
        </template>

        <template v-if="column.key === 'group_name'">
          {{ record.group_name }}
        </template>

        <template v-if="column.key === 'agent'">
          {{ record.agent }}
        </template>

        <template v-if="column.key === 'language'">
          {{ record.language }}
        </template>

        <template v-if="column.key === 'numtbs'">
          {{ record.numtbs }}
        </template>

        <template v-if="column.key === 'variant'">
          {{ record.variant }}
        </template>

        <template v-if="column.key === 'affiliate'">
          <div>
            <Tooltip placement="topLeft">
              <template #title>
                <span>Edit recipient {{ record.id }}</span>
              </template>
              <Button
                class="mr-3"
                :aria-label="`Edit recipient ${record.id}`"
                @click="editRecipient(record as any)"
                size="small"
                type="primary"
                :ghost="true"
                ><EditOutlined
              /></Button>
            </Tooltip>

            <Tooltip placement="topLeft">
              <template #title>
                <span>Duplicate recipient {{ record.id }}</span>
              </template>
              <Button
                class="mr-3"
                :aria-label="`Duplicate recipient ${record.id}`"
                @click="duplicateRecipient(record as any)"
                size="small"
                ><CopyOutlined
              /></Button>
            </Tooltip>

            <!-- <Popconfirm
            title="Are you sure to delete this recipient?"
            ok-text="Yes"
            cancel-text="No"
          >
            <Button
              class="mt-3"
              :aria-label="`Delete message ${message.title}`"
              :danger="true"
              >Delete Message</Button
            >
          </Popconfirm> -->
          </div>
        </template>
      </template>
    </Table>

    <!-- Edit modal -->
    <!-- New language modal -->
    <Modal
      v-model:open="modal.open"
      title="Recipient Details"
      ok-text="Save"
      @ok="onAcceptEdit"
      @cancel="onCloseModal()"
      :width="850"
      :ok-button-props="{ disabled: isDuplicateRecipient || invalidBeneficiaries }"
    >
      <ProgramRecipientsForm
        :recipient="data.recipientInEdit"
        :isDuplicateRecipient="isDuplicateRecipient"
        :invalidBeneficiaries="invalidBeneficiaries"
        @changed="onRecipientEdited"
        :invalid-constraint="true"
      />
    </Modal>
  </section>
</template>

<script lang="ts" setup>
import ProgramRecipientsForm from "@/components/ProgramRecipientsForm.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { computed, ref } from "vue";
import { Recipient } from "@/models/recipient";
import { Input, Modal, notification, Tooltip, Table, Button } from "ant-design-vue";
import { CopyOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons-vue";

const columns = [
  // @ts-ignore
  { title: "#", key: "index", width: '60px' },
  { title: "Region/State", key: "region" },
  { title: "District/County", key: "district" },
  { title: "Community", key: "community_name" },
  { title: "Group", key: "group_name" },
  { title: "Agent", key: "agent" },
  { title: "Language", key: "language" },
  { title: "# TBs", key: "numtbs", width: '70px' },
  { title: "Variant", key: "variant", width: '70px' },
  { title: "", key: "affiliate" }, // action buttons; we can't use 'actions' as the key because it is not in the Recipient model
];

const store = useProgramSpecStore();
const recipients = ref([...store.recipients]);
const data = ref({
  selectedRecipientId: null,
  recipientInEdit: null as Recipient,
  recipientEdited: false,
  description: "Add and edit recipients here.",
  columns,
});
const modal = ref({
  open: false,
  state: undefined as "edit" | "new",
});

const isRecipientInEditValid = computed(() => {
  // nothing selected; can't be valid
  if (!data.value.recipientInEdit) return null;

  const requiredFields = [
    "region",
    "district",
    "community_name",
    "language",
    "language",
    // 'listeningModel', 'numTbs',
    // 'deployments', 'directBeneficiaries'
  ];

  const partial = requiredFields.map((field: keyof Recipient) => {
    const value = data.value.recipientInEdit[field];
    if (typeof value === "string" || value instanceof String) return value !== "";
    if (typeof value === "number") return value >= 0;
    else if (Array.isArray(value)) return value.length > 0;
  });

  return partial.every(Boolean);
});

const isDuplicateRecipient = computed(() => {
  // All the recipients are from the current program, so don't have a "program" property.
  // Construct a concatenation of country-region-district-community_name-group_name-agent-language
  function key(recipient: Recipient) {
    return (
      `${recipient.country}-${recipient.region}-${recipient.district}-` +
      `${recipient.community_name}-${recipient.group_name}-${recipient.agent}-${recipient.language}`
    );
  }

  if (!data.value.recipientInEdit) return null;

  const thisKey = key(data.value.recipientInEdit);
  // If the key matches any recipient with a different recipientid, then it is a duplicate recipient.
  let isDuplicate = false;
  store.recipients.forEach((recip) => {
    if (key(recip) === thisKey && recip.id !== data.value.recipientInEdit.id)
      isDuplicate = true;
  });

  if (isDuplicate) console.log(`Duplicate recipient properties: ${thisKey}`);
  return isDuplicate;
});

const invalidBeneficiaries = computed(() => {
  if (!data.value.recipientInEdit) return false;

  let invalid = false;
  // are any of the "direct beneficiaries additional" greater than "direct beneficiaries"?
  Object.keys(data.value.recipientInEdit.direct_beneficiaries_additional || {}).forEach(
    (key) => {
      const val = data.value.recipientInEdit.direct_beneficiaries_additional[key];
      if (val > data.value.recipientInEdit.direct_beneficiaries) {
        invalid = true;
        // console.log(`direct beneficiaries additional [ ${key} ] (${val}) is greater than direct beneficiaries (${this.recipientInEdit.direct_beneficiaries})`);
      }
    }
  );
  // const values = Object.values(this.recipientInEdit.direct_beneficiaries_additional)
  //   .map(val => val > this.recipientInEdit.direct_beneficiaries)

  // Is either of these properties greater than "direct beneficiaries"?
  const keys = ["numhouseholds", "group_size"];
  keys.forEach((key: keyof Recipient) => {
    const val = data.value.recipientInEdit[key];
    if (val > data.value.recipientInEdit.direct_beneficiaries) {
      invalid = true;
      // console.log(`beneficiaries inferred from [ ${key} ] (${val}) is greater than direct beneficiaries (${this.recipientInEdit.direct_beneficiaries})`);
    }
  });

  return invalid;
});

function filterRecipient(val?: string) {
  if (val == null || val === undefined || val.trim().length === 0) {
    recipients.value = [...store.recipients];
    return;
  }

  const input = val.trim().toLowerCase();
  recipients.value = store.recipients.filter((recipient) => {
    return (
      recipient.region?.toLowerCase().includes(input) ||
      recipient.district?.toLowerCase().includes(input) ||
      recipient.community_name?.toLowerCase().includes(input) ||
      recipient.group_name?.toLowerCase().includes(input) ||
      recipient.agent?.toLowerCase().includes(input) ||
      recipient.language?.toLowerCase().includes(input) ||
      recipient.numtbs?.toString().includes(input)
    );
  });
}

function onAcceptEdit() {
  if (isRecipientInEditValid.value) {
    store.updateRecipient({ recipient: data.value.recipientInEdit });
    filterRecipient(); // trigger table refresh
    onCloseModal();
  } else {
    notification.error({
      message: "Required Fields",
      description: "Please complete all of the mandatory fields.",
    });
  }
}

function onCloseModal() {
  modal.value.open = false;

  data.value.recipientEdited = false;
  data.value.recipientInEdit = new Recipient();
  modal.value.state = "new";
}

// function handleModalEscape() {
//   onCloseModal();
//   data.value.recipientInEdit = null;
// }

// function onCancelEdit() {
//   data.value.recipientInEdit = new Recipient();
//   modal.value.state = "new";
//   modal.value.open = false;
// }

// function onOpenModal(modal: "edit" | "mandatory" | "delete", title: string) {
//   data.value.recipientEdited = false;
//   showModal.value[modal] = true;
// }

function editRecipient(recipient: Recipient, index?: number) {
  console.log(`Edit ${JSON.stringify(recipient)}`);
  data.value.recipientInEdit = JSON.parse(JSON.stringify(recipient));

  modal.value.state = "edit";
  modal.value.open = true;
}

function duplicateRecipient(recipient: Recipient) {
  const item = new Recipient();
  Object.assign(item, recipient);

  data.value.recipientInEdit = item;
  data.value.recipientInEdit.id = null;

  modal.value.state = "new";
  modal.value.open = true;
}

function addNewRecipient() {
  data.value.recipientInEdit = new Recipient();
  data.value.recipientInEdit.country = store.general.country;
  modal.value.state = "new";
  modal.value.open = true;

  console.log(`new recipient: ${JSON.stringify(data.value.recipientInEdit)}`);
}

function onRecipientEdited(value: boolean) {
  data.value.recipientEdited = value;
}
</script>
