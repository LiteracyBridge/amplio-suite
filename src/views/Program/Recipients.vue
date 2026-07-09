<template>
  <section>
    <Table :columns="columns" :data-source="paginatedRecipients" :sticky="true" :pagination="paginationConfig"
      class="ant-table-striped" :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">

      <template #title>
        <div class="flex flex-col gap-2" style="
      background: #289B6A;
      margin: -16px -16px 0;
      padding: 12px 16px;
      border-radius: 8px 8px 0 0;
      border-bottom: 1px solid #f0f0f0;
    ">
          <div class="flex items-center gap-3">
            <!-- Search far left -->
            <Input v-model:value="searchQuery" type="text" placeholder="Search recipients…" allow-clear
              style="width: 280px;" @change="filterRecipient($event.target.value)" @clear="filterRecipient('')">
              <template #prefix>
                <SearchOutlined />
              </template>
            </Input>

            <!-- Filters toggle -->
            <Button class="filter-toggle-btn" :ghost="true" @click="filtersOpen = !filtersOpen">
              <FilterOutlined />
              Filters
              <span v-if="activeFilterCount > 0" class="filter-badge">{{ activeFilterCount }}</span>
              <DownOutlined class="filter-chevron" :class="{ 'filter-chevron-open': filtersOpen }" />
            </Button>

            <!-- Count right beside the search bar -->
            <span style="font-size: 15px; color: #fff; white-space: nowrap;">
              <strong style="color: inherit;">{{ recipients.length }}</strong> of {{ store.recipients.length }} recipients
            </span>

            <!-- Spacer pushes button to the right -->
            <div style="flex: 1;" />

            <Button @click="addNewRecipient()" type="primary" :ghost="true" style="background: white;">
              + Add Recipient
            </Button>
          </div>

          <!-- Collapsible filter panel -->
          <div v-show="filtersOpen" class="filter-panel">
            <Select v-model:value="filters.region" placeholder="Region" allow-clear class="filter-select"
              :options="regionOptions" @change="applyFilters" />
            <Select v-model:value="filters.language" placeholder="Language" allow-clear class="filter-select"
              :options="languageOptions" @change="applyFilters" />
            <Select v-model:value="filters.variant" placeholder="Variant" allow-clear class="filter-select"
              :options="variantOptions" @change="applyFilters" />

            <div v-if="activeFilterCount > 0" class="filter-divider" />

            <span v-if="filters.region" class="filter-chip">
              Region: {{ filters.region }}
              <CloseOutlined class="filter-chip-close" @click="clearFilter('region')" />
            </span>
            <span v-if="filters.language" class="filter-chip">
              Language: {{ filters.language }}
              <CloseOutlined class="filter-chip-close" @click="clearFilter('language')" />
            </span>
            <span v-if="filters.variant" class="filter-chip">
              Variant: {{ filters.variant }}
              <CloseOutlined class="filter-chip-close" @click="clearFilter('variant')" />
            </span>

            <Button v-if="activeFilterCount > 0" type="link" class="clear-all-btn" @click="clearAllFilters">
              Clear all
            </Button>
          </div>
        </div>
      </template>

      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ (currentPage - 1) * pageSize + index + 1 }}
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
              <Button class="mr-3" :aria-label="`Edit recipient ${record.id}`" @click="editRecipient(record as any)"
                size="small" type="primary" :ghost="true">
                <EditOutlined />
              </Button>
            </Tooltip>

            <Tooltip placement="topLeft">
              <template #title>
                <span>Duplicate recipient {{ record.id }}</span>
              </template>
              <Button class="mr-3" :aria-label="`Duplicate recipient ${record.id}`"
                @click="duplicateRecipient(record as any)" size="small">
                <CopyOutlined />
              </Button>
            </Tooltip>
          </div>
        </template>
      </template>
    </Table>

    <!-- Edit modal -->
    <!-- New language modal -->
    <Modal v-model:open="modal.open" title="Recipient Details" ok-text="Save" @ok="onAcceptEdit"
      @cancel="onCloseModal()" :width="850"
      :ok-button-props="{ disabled: isDuplicateRecipient || invalidBeneficiaries }">
      <ProgramRecipientsForm :recipient="data.recipientInEdit" :isDuplicateRecipient="isDuplicateRecipient"
        :invalidBeneficiaries="invalidBeneficiaries" @changed="onRecipientEdited" :invalid-constraint="true" />
    </Modal>
  </section>
</template>

<script lang="ts" setup>
import ProgramRecipientsForm from "@/components/ProgramRecipientsForm.vue";
import { useProgramSpecStore } from "@/store/programspec";
import { computed, ref } from "vue";
import { Recipient } from "@/models/recipient";
import { Input, Modal, notification, Tooltip, Table, Button, Select } from "ant-design-vue";
import {
  CopyOutlined,
  EditOutlined,
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";

const columns = [
  // @ts-ignore
  { title: "#", key: "index", width: "60px" },
  { title: "Region/State", key: "region" },
  { title: "District/County", key: "district" },
  { title: "Community", key: "community_name" },
  { title: "Group", key: "group_name" },
  { title: "Agent", key: "agent" },
  { title: "Language", key: "language" },
  { title: "# TBs", key: "numtbs", width: "70px" },
  { title: "Variant", key: "variant", width: "70px" },
  { title: "", key: "affiliate" }, // action buttons; we can't use 'actions' as the key because it is not in the Recipient model
];

const store = useProgramSpecStore();
const recipients = ref([...store.recipients]);

const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref('');

// --- Filters ---
const filtersOpen = ref(false);
const filters = ref({
  region: undefined as string | undefined,
  language: undefined as string | undefined,
  variant: undefined as string | undefined,
});

function uniqueOptions(field: keyof Recipient) {
  const values = new Set<string>();
  store.recipients.forEach((r) => {
    const v = (r as any)[field];
    if (v) values.add(v);
  });
  return Array.from(values)
    .sort()
    .map((v) => ({ label: v, value: v }));
}

const regionOptions = computed(() => uniqueOptions("region"));
const languageOptions = computed(() => uniqueOptions("language"));
const variantOptions = computed(() => uniqueOptions("variant"));

const activeFilterCount = computed(() => {
  return Object.values(filters.value).filter((v) => !!v).length;
});

function clearFilter(key: "region" | "language" | "variant") {
  filters.value[key] = undefined;
  applyFilters();
}

function clearAllFilters() {
  filters.value.region = undefined;
  filters.value.language = undefined;
  filters.value.variant = undefined;
  applyFilters();
}

function applyFilters() {
  currentPage.value = 1;
  filterRecipient(searchQuery.value);
}
// --- End Filters ---

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

const paginatedRecipients = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return recipients.value.slice(startIndex, endIndex);
});

const paginationConfig = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: recipients.value.length,
  onChange: (page: number) => {
    currentPage.value = page;
  },
}));

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
  currentPage.value = 1; // reset to page 1 on new search
  searchQuery.value = val || '';
  const input = (val || '').trim().toLowerCase();

  recipients.value = store.recipients.filter((recipient) => {
    const matchesSearch =
      input.length === 0 ||
      recipient.region?.toLowerCase().includes(input) ||
      recipient.district?.toLowerCase().includes(input) ||
      recipient.community_name?.toLowerCase().includes(input) ||
      recipient.group_name?.toLowerCase().includes(input) ||
      recipient.agent?.toLowerCase().includes(input) ||
      recipient.language?.toLowerCase().includes(input) ||
      recipient.numtbs?.toString().includes(input);

    const matchesRegion = !filters.value.region || recipient.region === filters.value.region;
    const matchesLanguage = !filters.value.language || recipient.language === filters.value.language;
    const matchesVariant = !filters.value.variant || recipient.variant === filters.value.variant;

    return matchesSearch && matchesRegion && matchesLanguage && matchesVariant;
  });
}

function onAcceptEdit() {
  if (isRecipientInEditValid.value) {
    const recipient = data.value.recipientInEdit;
    if (Recipient.isAccessCodeDuplicate(recipient.access_code)) {
      notification.error({
        message: "Duplicate access code!",
        description: `${recipient.access_code} is assigned to another recipient!`,
      });
      return;
    }

    store.updateRecipient({ recipient: recipient });
    filterRecipient(searchQuery.value); // trigger table refresh
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

<style scoped>
.filter-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
  color: #fff !important;
}

.filter-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

.filter-badge {
  background: #fff;
  color: #085041;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  padding: 0 6px;
  line-height: 16px;
  min-width: 16px;
  text-align: center;
}

.filter-chevron {
  font-size: 11px;
  transition: transform 0.15s ease;
}

.filter-chevron-open {
  transform: rotate(180deg);
}

.filter-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}

.filter-select {
  width: 160px;
}

.filter-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.35);
  margin: 0 4px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #085041;
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  padding: 3px 8px 3px 10px;
}

.filter-chip-close {
  font-size: 11px;
  cursor: pointer;
}

.clear-all-btn {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 12px;
  padding: 0 4px !important;
  text-decoration: underline;
}
</style>