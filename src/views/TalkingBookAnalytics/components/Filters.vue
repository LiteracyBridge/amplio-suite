<script setup lang="ts">
import { computed, ref } from "vue";
import { groupBy } from "lodash";
import {
  Table,
  Card,
  Row,
  Col,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Select,
  SelectOption,
} from "ant-design-vue";
import { useProgramSpecStore } from "@/store/programspec";
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";

interface FilterForm {
  deployment: number;
  district: string;
  community: string;
  language: string;
  playlist: string;
}

const $emit = defineEmits<{
  (e: "change", form: FilterForm): void;
}>();

const spec = useProgramSpecStore();
const store = useTalkingBookAnalyticStore();

const form = ref<FilterForm>({
  deployment: null,
  district: null,
  community: null,
  language: null,
  playlist: null,
});

async function filterResults() {
  store.getDashboardSummaries(form.value).finally(() => $emit("change", form.value));
}
</script>

<template>
  <Form layout="horizontal" class="filter-form">
    <Row :gutter="[16, 16]">
      <!-- Deployment -->
      <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <FormItem label="Deployment" name="deployment">
          <Select
            v-model:value="form.deployment"
            placeholder="Deployment"
            :allow-clear="true"
            @change="filterResults()"
          >
            <SelectOption :value="null">All</SelectOption>
            <SelectOption v-for="d in spec.deployments" :value="d.deploymentnumber">
              {{ d.deploymentname }}
            </SelectOption>
          </Select>
        </FormItem>
      </Col>

      <!-- District -->
      <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <FormItem label="District" name="district">
          <Select
            v-model:value="form.district"
            placeholder="District"
            :allow-clear="true"
            @change="filterResults()"
          >
            <SelectOption :value="null">All</SelectOption>
            <SelectOption
              v-for="(_r, k) of groupBy(spec.recipients, (r) => r.district)"
              :value="k"
            >
              {{ k }}
            </SelectOption>
          </Select>
        </FormItem>
      </Col>

      <!-- Community -->
      <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <FormItem label="Community" name="community">
          <Select
            v-model:value="form.community"
            placeholder="Community"
            :allow-clear="true"
            @change="filterResults()"
          >
            <SelectOption :value="null">All</SelectOption>
            <SelectOption
              v-for="(_r, k) of groupBy(
                spec.recipients.filter((f) =>
                  form.district ? f.district == form.district : true
                ),
                (r) => r.community_name
              )"
              :value="k"
            >
              {{ k }}
            </SelectOption>
          </Select>
        </FormItem>
      </Col>

      <!-- Language -->
      <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <FormItem label="Language" name="language">
          <Select
            v-model:value="form.language"
            placeholder="Language"
            :allow-clear="true"
            @change="filterResults()"
          >
            <SelectOption :value="null">All</SelectOption>
            <SelectOption v-for="l of spec.languages" :value="l.code">
              {{ l.name }}
            </SelectOption>
          </Select>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<style scoped>
.filter-form {
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 16px;
}

/* Responsive adjustments */
@media (max-width: 575px) {
  .filter-form {
    padding: 8px;
  }

  :deep(.ant-form-item-label) {
    text-align: left !important;
    margin-bottom: 4px;
  }

  :deep(.ant-form-item-label > label) {
    font-size: 13px;
  }
}

/* Tablet styles */
@media (min-width: 576px) and (max-width: 991px) {
  .filter-form {
    padding: 10px;
  }
}

/* Desktop hover effects */
@media (min-width: 992px) {
  :deep(.ant-select-selector) {
    transition: all 0.3s;
  }

  :deep(.ant-select-selector:hover) {
    border-color: #289b6a !important;
  }
}

/* Make selects full width on mobile */
:deep(.ant-select) {
  width: 100%;
}

/* Better spacing for form items */
:deep(.ant-form-item) {
  margin-bottom: 0;
}

/* Compact select dropdowns */
:deep(.ant-select-dropdown) {
  max-height: 300px;
  overflow-y: auto;
}
</style>


