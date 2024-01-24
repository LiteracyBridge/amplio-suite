<template>
  <section class="relative min-h-200-px p-6 pt-0">
    <header class="w-full inline-flex items-center justify-between">
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
      </div>
    </header>

    <!--    <div v-if="status !== 'loading' && filteredRecipients.length === 0">-->
    <!--      <p>Add recipients here.</p>-->
    <!--    </div>-->

    <div v-if="store.filteredRecipients().length > 0" class="block pt-2 overflow-x-auto">
      <table class="w-full table-auto overflow-x-auto">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" class="text-left border-2">
              <v-tooltip
                :width="150"
                :text="`Sort ${store.sortTable.descending ? 'Ascending' : 'Descending'}`"
              >
                <button class="flex gap-2" style="white-space: nowrap">
                  <!-- @click="setSortByColumn(col.key)"
                  @keyup.enter="setSortByColumn(col.key)"
                  @keyup.space="setSortByColumn(col.key)" -->
                  {{ col.label }}
                  <font-awesome-icon
                    v-if="store.sortTable.by === col.key"
                    :icon="store.sortTable.descending ? 'chevron-down' : 'chevron-up'"
                  />
                </button>
              </v-tooltip>
            </th>
            <th class="px-4 py-2 text-amplio-green border-b text-left border-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(recipient, index) in store.filteredRecipients()"
            :key="recipient.recipientid"
            :class="index % 2 === 0 ? '' : 'bg-gray-200'"
            class="hover:bg-gray-400"
            @dblclick="editRecipient(recipient, index)"
          >
            <td
              v-for="col in columns"
              :key="`${index}-${col.key}`"
              class="px-4 py-2 border-b"
            >
              {{ recipient[col.key] }}
            </td>
            <td class="px-4 border-b">
              <div class="flex gap-1">
                <v-tooltip :width="100" :text="`Edit`">
                  <VButton
                    iconL="edit"
                    :ariaLabel="`Edit recipient ${recipient.recipientid}`"
                    @click="editRecipient(recipient)"
                  />
                </v-tooltip>
                <v-tooltip :width="100" :text="`Duplicate`">
                  <VButton
                    iconL="copy"
                    :ariaLabel="`Duplicate recipient ${recipient.recipientid}`"
                    @click="duplicateRecipient(recipient)"
                  />
                </v-tooltip>
                <!-- <VButton
                              variant="warning"
                              iconL="trash-alt"
                              :ariaLabel="`Delete recipient ${recipient.id}`"
                              @click="onClickDelete(recipient.id)"
                            /> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit modal -->
    <!-- New language modal -->
    <Modal
      v-model:open="modal.open"
      title="Add New Language"
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

      <!-- <FormItem id="code" label="Language Code">
          <Input
            name="code"
            type="text"
            placeholder="eg. en"
            v-model:value="newLanguage.form.code"
          />
        </FormItem> -->
    </Modal>

    <!-- Delete modal -->
    <portal to="modalBody" v-if="showModal.delete">
      <p class="text-xl">This recipient will be deleted.</p>
    </portal>

    <!-- <portal to="modalFooter" v-if="showModal.delete">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton label="Confirm" variant="warning" @click="confirmDeleteRecipient" />
        <VButton label="Cancel" @click="onCloseModal" />
      </footer>
    </portal> -->

    <!-- Mandatory fields modal -->
    <portal to="modalBody" v-if="showModal.mandatory">
      <p class="text-xl">Please complete all of the mandatory fields.</p>
    </portal>

    <portal to="modalFooter" v-if="showModal.mandatory">
      <footer class="flex flex-row-reverse justify-between pt-20">
        <VButton label="Close" />
        <!-- <VButton label="Close" @click="onClickEdit(selectedRecipientId)" /> -->
      </footer>
    </portal>
  </section>
</template>

<script lang="ts" setup>
import VButton from "@/components/VButton.vue";
import VTooltip from "@/components/VTooltip.vue";
import ProgramRecipientsForm from "@/components/ProgramRecipientsForm.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { useUIStore } from "@/store/ui";
import { computed, onMounted, ref } from "vue";
import { Recipient } from "@/models/recipient";
import { Form, Modal, notification } from "ant-design-vue";

const columns: Array<{ label: string; key: keyof Recipient }> = [
  { label: "Region/State", key: "region" },
  { label: "District/County", key: "district" },
  { label: "Community", key: "communityname" },
  { label: "Group", key: "groupname" },
  { label: "Agent", key: "agent" },
  { label: "Language", key: "language" },
  { label: "# TBs", key: "numtbs" },
];

const props = defineProps<{
  programId: string;
}>();

const store = useProgramSpecStore(),
  ui = useUIStore();

const data = ref({
  selectedRecipientId: null,
  recipientInEdit: null,
  recipientEdited: false,
  description: "Add and edit recipients here.",
  columns,
});
const modal = ref({
  open: false,
  state: undefined as "edit" | "new",
});

const showModal = ref({
  edit: false,
  delete: false,
  mandatory: false,
});

const selectedRecipient = computed(() => {
  return store.recipients.find(
    (recipient) => recipient.recipientid === data.value.selectedRecipientId
  );
});

const tableIsFilter = computed(() => {
  return store.sortTable.by !== "" || store.filterText !== "";
});

const isRecipientInEditValid = computed(() => {
  // nothing selected; can't be valid
  if (!data.value.recipientInEdit) return null;

  const requiredFields = [
    "region",
    "district",
    "communityname",
    "language",
    // 'listeningModel', 'numTbs',
    // 'deployments', 'directBeneficiaries'
  ];

  const partial = requiredFields.map((field) => {
    const value = data.value.recipientInEdit[field];
    if (typeof value === "string" || value instanceof String) return value !== "";
    else if (typeof value === "number") return value >= 0;
    else if (Array.isArray(value)) return value.length > 0;
  });

  return partial.every(Boolean);
});

const isDuplicateRecipient = computed(() => {
  // All the recipients are from the current program, so don't have a "program" property.
  // Construct a concatenation of country-region-district-communityname-groupname-agent-language
  function key(recipient: {
    country: any;
    region: any;
    district: any;
    communityname: any;
    groupname: any;
    agent: any;
    language: any;
  }) {
    return (
      `${recipient.country}-${recipient.region}-${recipient.district}-` +
      `${recipient.communityname}-${recipient.groupname}-${recipient.agent}-${recipient.language}`
    );
  }

  if (!data.value.recipientInEdit) return null;

  const thisKey = key(data.value.recipientInEdit);
  // If the key matches any recipient with a different recipientid, then it is a duplicate recipient.
  let isDuplicate = false;
  store.recipients.forEach((recip) => {
    if (
      key(recip) === thisKey &&
      recip.recipientid !== data.value.recipientInEdit.recipientid
    )
      isDuplicate = true;
  });

  if (isDuplicate) console.log(`Duplicate recipient properties: ${thisKey}`);
  return isDuplicate;
});

const invalidBeneficiaries = computed(() => {
  if (!data.value.recipientInEdit) return false;

  let invalid = false;
  // are any of the "direct beneficiaries additional" greater than "direct beneficiaries"?
  Object.keys(data.value.recipientInEdit.direct_beneficiaries_additional).forEach(
    (key) => {
      let val = data.value.recipientInEdit.direct_beneficiaries_additional[key];
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
  keys.forEach((key) => {
    let val = data.value.recipientInEdit[key];
    if (val > data.value.recipientInEdit.direct_beneficiaries) {
      invalid = true;
      // console.log(`beneficiaries inferred from [ ${key} ] (${val}) is greater than direct beneficiaries (${this.recipientInEdit.direct_beneficiaries})`);
    }
  });

  return invalid;
});

// function onSaveChanges() {
//   console.log("onSaveChanges");
//   store.updateSpec();
// }

// function onDiscardChanges() {
//   console.log("onDiscardChanges");
//   store.fetchSpec({ programId: props.programId });
// }

function onCloseModal() {
  data.value.recipientEdited = false;
  showModal.value.edit = false;
  showModal.value.delete = false;
  showModal.value.mandatory = false;

  data.value.recipientInEdit = store.newRecipient();
  modal.value.state = "new";
  modal.value.open = false;
}

// function handleModalEscape() {
//   onCloseModal();
//   data.value.recipientInEdit = null;
// }

function onCancelEdit() {
  data.value.recipientInEdit = store.newRecipient();
  modal.value.state = "new";
  modal.value.open = false;
}

function onOpenModal(modal: "edit" | "mandatory" | "delete", title: string) {
  data.value.recipientEdited = false;
  showModal.value[modal] = true;
  ui.setModal(title);
}

function editRecipient(recipient: Recipient, index?: number) {
  console.log(`Edit ${JSON.stringify(recipient)}`);
  data.value.recipientInEdit = JSON.parse(JSON.stringify(recipient));

  modal.value.state = "edit";
  modal.value.open = true;
}

function duplicateRecipient(recipient: { [x: string]: any }) {
  let recip = Object.keys(recipient)
    .map((k) => `${k}:${recipient[k]}`)
    .join(", ");
  console.log(`Duplicate ${JSON.stringify(recip)}`);
  data.value.recipientInEdit = JSON.parse(JSON.stringify(recipient));
  data.value.recipientInEdit.recipientid = null;
  onOpenModal("edit", "Duplicated Recipient Details");
}

function addNewRecipient() {
  data.value.recipientInEdit = store.newRecipient();
  data.value.recipientInEdit.country = store.general.country;
  console.log(`new recipient: ${JSON.stringify(data.value.recipientInEdit)}`);
  onOpenModal("edit", "New Recipient Details");
}

function onRecipientEdited(value: boolean) {
  data.value.recipientEdited = value;
}

function onAcceptEdit() {
  if (isRecipientInEditValid.value) {
    store.updateRecipient({ recipient: data.value.recipientInEdit });
    onCloseModal();
  } else {
    notification.error({
      message: "Required Fields",
      description: "Please complete all of the mandatory fields.",
    });
  }
}

// onMounted(() => {
//   store.ensureSpec({ programId: props.programId });
// });
</script>
