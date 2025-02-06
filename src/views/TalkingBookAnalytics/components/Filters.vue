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
  <Form layout="horizontal">
    <Row justify="end">
      <Col :span="4">
        <FormItem label="Deployment #" name="deployment" class="ms-3">
          <Select
            v-model:value="form.deployment"
            class="min-w-10"
            placeholder="Select deployment"
            :default-active-first-option="true"
            :show-arrow="true"
            :filter-option="false"
            :allow-clear="true"
            @change="filterResults()"
          >
            <SelectOption :value="null">All</SelectOption>
            <SelectOption v-for="d in spec.deployments" :value="d.deploymentnumber">{{
              d.deploymentname
            }}</SelectOption>
          </Select>
        </FormItem>
      </Col>
      <Col :span="4">
        <FormItem label="District" name="district" class="ms-3">
          <Select
            v-model:value="form.district"
            class="min-w-4"
            placeholder="Select district"
            :default-active-first-option="true"
            :show-arrow="true"
            :filter-option="false"
            :allow-clear="true"
            @change="filterResults()"
          >
            <SelectOption :value="null">All</SelectOption>
            <SelectOption
              v-for="(_r, k) of groupBy(spec.recipients, (r) => r.district)"
              :value="k"
              >{{ k }}</SelectOption
            >
          </Select>
        </FormItem>
      </Col>

      <Col :span="4">
        <FormItem label="Community" name="community" class="ms-3">
          <Select
            v-model:value="form.community"
            class="min-w-4"
            placeholder="Select Community"
            :default-active-first-option="true"
            :show-arrow="true"
            :filter-option="false"
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
              >{{ k }}</SelectOption
            >
          </Select>
        </FormItem>
      </Col>

      <Col :span="4">
        <FormItem label="Language" name="language" class="ms-3">
          <Select
            v-model:value="form.language"
            class="min-w-4"
            placeholder="Select language"
            :default-active-first-option="true"
            :show-arrow="true"
            :filter-option="false"
            @change="filterResults()"
          >
            <SelectOption :value="null">All</SelectOption>
            <SelectOption v-for="l of spec.languages" :value="l.code">{{
              l.name
            }}</SelectOption>
          </Select>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<style scoped></style>
