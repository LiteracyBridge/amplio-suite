<template>
  <div class="">
    <Form layout="vertical">
      <p class="col-span-2 md:col-span-4 text-center text-blue">
        All fields with an asterisk are required. The optional fields are recommended for
        reporting.
      </p>

      <p
        v-if="invalidConstraint"
        class="col-span-2 md:col-span-4 text-center text-red-500"
      >
        <font-awesome-icon icon="exclamation-circle" class="w-6 h-6" />
        Region, District, Community, Group, Agent, and Language combination must be
        unique.
      </p>

      <p
        v-if="invalidBeneficiaries"
        class="col-span-2 md:col-span-4 text-center text-red-500"
      >
        <font-awesome-icon icon="exclamation-circle" class="w-6 h-6" />
        Invalid Direct Beneficiaries details
      </p>

      <Row :gutter="8" class="mt-5">
        <Col :span="8">
          <FormItem
            required
            :rules="[{ required: true, message: 'Please enter a region' }]"
            label="Region/State"
          >
            <Select
              :required="true"
              id="region"
              placeholder="Select a region"
              :value="recipient.region"
              :options="regionsOptions"
              @select="onSetRecipientValue({ field: 'region', value: $event })"
              @deselect="onSetRecipientValue({ field: 'region', value: $event })"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem
            label="District/County"
            required
            :rules="[{ required: true, message: 'Please enter a district' }]"
          >
            <Input
              name="district"
              type="text"
              :value="recipient.district"
              @change="
                onSetRecipientValue({ field: 'district', value: $event.target.value })
              "
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem
            label="Community"
            required
            :rules="[{ required: true, message: 'Please enter a community' }]"
          >
            <Input
              name="community"
              type="text"
              mx="mx-0 w-full"
              :value="recipient.communityname"
              @change="
                onSetRecipientValue({
                  field: 'communityname',
                  value: $event.target.value,
                })
              "
            /> </FormItem
        ></Col>
      </Row>

      <Row :gutter="8">
        <Col :span="8">
          <FormItem label="Group Name">
            <Input
              name="group-name"
              type="text"
              :value="recipient.groupname"
              @change="
                onSetRecipientValue({ field: 'groupname', value: $event.target.value })
              "
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="Language" :required="true">
            <languages-selector
              name="language"
              class="w-full"
              :options="state.general.languages"
              :languages="recipient.language"
              @language-selected="
                onSetRecipientValue({ field: 'language', value: $event })
              "
              @language-deleted="
                onSetRecipientValue({ field: 'language', value: $event })
              "
              :multiple="false"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="Variant">
            <Input
              name="variant"
              :value="recipient.variant"
              @change="
                onSetRecipientValue({ field: 'variant', value: $event.target.value })
              "
            >
              <template #suffix>
                <Tooltip
                  title="Please keep variant short and abbreviated. For example, use 'T' instead of Test."
                >
                  <InfoCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
                </Tooltip>
              </template>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="8">
        <Col :span="8">
          <FormItem label="Agent">
            <Input
              name="agent"
              type="text"
              placeholder="Agent, Health Worker, etc."
              :value="recipient.agent"
              @change="
                onSetRecipientValue({ field: 'agent', value: $event.target.value })
              "
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="Agent Gender">
            <Select
              name="agent=gender"
              :options="[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { label: 'Unknown', value: 'Unknown' },
              ]"
              v-model:value="recipient.agent_gender"
              placeholder="Select the agent gender"
              @select="onSetRecipientValue({ field: 'agent_gender', value: $event })"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="Number of Talking Books">
            <Input
              name="numTalkingBooks"
              type="number"
              :value="recipient.numtbs"
              @change="
                onSetRecipientValue({ field: 'numtbs', value: $event.target.value })
              "
            />
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="8">
        <Col :span="8">
          <FormItem label="Listening Model">
            <Select
              id="listeningModel"
              :options="listeningModels"
              :value="props.recipient.listening_model"
              :field-names="{ label: 'label', value: 'label' }"
              @select="onSetRecipientValue({ field: 'listening_model', value: $event })"
              @deselect="onSetRecipientValue({ field: 'listening_model', value: '' })"
              placeholder="Select the listening model"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="Deployments">
            <Select
              id="deployments"
              :options="deployments"
              v-model:value="recipient.deployments"
              mode="multiple"
              placeholder="Select the deployments, leave blank for 'all'"
            >
            </Select>
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="Support Entity">
            <Input
              name="supportEntity"
              type="text"
              :value="recipient.supportentity"
              @change="
                onSetRecipientValue({
                  field: 'support_entity',
                  value: $event.target.value,
                })
              "
            />
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="8">
        <Col :span="12">
          <FormItem label="Indirect beneficiaries">
            <Input
              name="indirectBeneficiaries"
              type="text"
              :value="recipient.indirect_beneficiaries"
              @change="
                onSetRecipientValue({
                  field: 'indirect_beneficiaries',
                  value: $event.target.value,
                })
              "
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="Direct Beneficiaries">
            <Input
              name="directBeneficiaries"
              type="number"
              :value="recipient.direct_beneficiaries"
              @change="
                onSetRecipientValue({
                  field: 'direct_beneficiaries',
                  value: $event.target.value,
                })
              "
            >
              <template #suffix>
                <Tooltip
                  title="You can modify the names for these fields or add additional fields by going to General tab> Direct Beneficiaries> Show Details"
                >
                  <InfoCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
                </Tooltip>
              </template>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="8">
        <Col :span="8"></Col>
        <Col :span="8"></Col>
        <Col :span="8"></Col>
      </Row>
    </Form>

    <!-- <label class="mandatory-field text-right" for="community">Community</label> -->

    <!-- <label class="text-right" for="group-name">Group Name</label> -->

    <!-- <label class="mandatory-field text-right" for="language">Language</label>
    <languages-selector
      name="language"
      class="w-full"
      :options="state.general.languages"
      :languages="recipient.language"
      @language-selected="onSetRecipientValue({ field: 'language', value: $event })"
      @language-deleted="onSetRecipientValue({ field: 'language', value: $event })"
      :multiple="false"
    /> -->

    <!-- <div class="text-right"> -->
    <!--class="flex md:col-span-3"-->
    <!-- <label class="text-right" for="variant">Variant</label>
      <v-tooltip
        v-if="recipient.variant && recipient.variant.length > 2"
        text="Please keep variant short and abbreviated. For example, use 'T' instead of Test."
        class="my-auto ml-2"
      >
        <font-awesome-icon class="text-orange-600" icon="exclamation-circle" />
      </v-tooltip>
    </div> -->
    <!-- <v-input
      class="variant w-12"
      name="variant"
      type="text"
      mx="mx-0"
      :value="recipient.variant"
      @input="onSetRecipientValue({ field: 'variant', value: $event.target.value })"
    /> -->

    <!-- <label class="text-right" for="agent">Agent</label>
    <v-input
      name="agent"
      type="text"
      placeholder="Agent, Health Worker, etc."
      mx="mx-0 w-full"
      :value="recipient.agent"
      @input="onSetRecipientValue({ field: 'agent', value: $event.target.value })"
    /> -->

    <!-- <label class="text-right" for="agent-gender">Agent Gender</label>
    <Select
      name="agent=gender"
      :options="[
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { label: 'Unknown', value: 'Unknown' },
      ]"
      v-model:value="recipient.agent_gender"
      placeholder="Select the agent gender"
      @select="onSetRecipientValue({ field: 'agent_gender', value: $event })"
    /> -->

    <!-- <label class="text-right" for="numTalkingBooks">Number Talking Books</label>
    <v-input
      class="recipient-number-value"
      name="numTalkingBooks"
      type="number"
      mx="mx-0 w-24"
      :value="recipient.numtbs"
      @input="onSetRecipientValue({ field: 'numtbs', value: $event.target.value })"
    /> -->

    <!-- <label class="text-right" for="listeningModel">Listening Model</label>
    <Select
      id="listeningModel"
      :options="listeningModels"
      :value="props.recipient.listening_model"
      :field-names="{ label: 'label', value: 'label' }"
      @select="onSetRecipientValue({ field: 'listening_model', value: $event })"
      @deselect="onSetRecipientValue({ field: 'listening_model', value: '' })"
      placeholder="Select the listening model"
    />

    <label class="text-right" for="deployments">Deployments</label>
    <Select
      id="deployments"
      :options="deployments"
      v-model:value="recipient.deployments"
      mode="multiple"
      placeholder="Select the deployments, leave blank for 'all'"
    >
    </Select> -->
    <!--
    <label class="text-right" for="supportEntity">Support Entity</label>
    <v-input
      name="supportEntity"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.supportentity"
      @input="
        onSetRecipientValue({ field: 'support_entity', value: $event.target.value })
      "
    /> -->

    <!-- <div class="text-right">
      <label class="text-right" for="directBeneficiaries">Direct Beneficiaries</label>
      <v-tooltip
        text="You can modify the names for these fields or add additional fields by going to General tab> Direct Beneficiaries> Show Details"
        class="ml-2"
      >
        <font-awesome-icon class="text-orange-600" icon="question-circle" />
      </v-tooltip>
    </div>
    <v-input
      class="recipient-number-value"
      name="directBeneficiaries"
      type="number"
      mx="mx-0 w-full"
      :value="recipient.direct_beneficiaries"
      @input="
        onSetRecipientValue({ field: 'direct_beneficiaries', value: $event.target.value })
      "
    /> -->

    <div class="col-span-2 ml-4">
      <VButton
        tag="span"
        :label="`${beneficiariesIsOpen ? 'Hide' : 'Show'} Direct beneficiaries details`"
        :iconR="beneficiariesIsOpen ? 'chevron-up' : 'chevron-down'"
        @click="beneficiariesIsOpen = !beneficiariesIsOpen"
      />
    </div>

    <div
      :class="beneficiariesIsOpen ? 'visible' : 'hidden'"
      class="ml-6 grid grid-cols-form-2 md:grid-cols-form-4 col-gap-4 col-span-2 md:col-span-4 items-center"
    >
      <beneficiaries-field
        label="Number of Households"
        :val="recipient.numhouseholds"
        :showTooltip="recipient.numhouseholds > recipient.direct_beneficiaries"
        @input="onSetRecipientValue({ field: 'numhouseholds', value: $event })"
      />

      <beneficiaries-field
        label="Group Size"
        :val="recipient.group_size"
        :showTooltip="recipient.group_size > recipient.direct_beneficiaries"
        @input="onSetRecipientValue({ field: 'group_size', value: $event })"
      />

      <beneficiaries-field
        v-for="opt in beneficiariesAdditionalFields"
        :key="opt.key"
        :label="opt.value"
        :val="recipient.direct_beneficiaries_additional[opt.key]"
        :showTooltip="
          recipient.direct_beneficiaries_additional[opt.key] >
          recipient.direct_beneficiaries
        "
        @input="
          onSetRecipientDirectBeneficiariesAdditional({
            key: opt.key,
            value: $event,
          })
        "
      />
    </div>

    <!-- <label class="text-right" for="indirectBeneficiaries">Indirect beneficiaries</label>
    <v-input
      name="indirectBeneficiaries"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.indirect_beneficiaries"
      @input="
        onSetRecipientValue({
          field: 'indirect_beneficiaries',
          value: $event.target.value,
        })
      "
    /> -->

    <!-- <span class="col-span-2" /> -->
  </div>
</template>

<style>
.multiselect__tags {
  border: 0 !important;
}
.suppress-int-border div {
  border: 0 !important;
}
.variant input {
  width: 7rem;
}
.deployment-number-value input {
  width: 6rem;
}
</style>

<script lang="ts" setup>
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import VTooltip from "@/components/VTooltip.vue";
import LanguagesSelector from "@/components/LanguagesSelector.vue";
import BeneficiariesField from "@/components/ProgramRecipientsFormBeneficiaries.vue";

import listeningModels from "@/data/listeningModels.json";
import { useProgramSpecStore } from "@/store/programspec";
import { computed, onMounted, ref, watch } from "vue";
import { Form, Row, Col, Input, FormItem, Select, Tooltip } from "ant-design-vue";
import { Recipient } from "@/models/recipient";
import { InfoCircleOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  recipient: Recipient;
  invalidConstraint: boolean;
  invalidBeneficiaries: boolean;
}>();

const state = useProgramSpecStore();

const regionsOptions = ref([]),
  beneficiariesIsOpen = ref(false);

const beneficiariesAdditionalFields = computed(() => {
  const part1 = Object.keys(state.general.direct_beneficiaries_additional_map).map(
    (key) => ({
      key,
      value: state.general.direct_beneficiaries_additional_map[key],
    })
  );

  const part2 = Object.keys(state.general.direct_beneficiaries_map).map((key) => ({
    key,
    value: state.general.direct_beneficiaries_map[key],
  }));

  return part2.concat(part1);
});

const deployments = computed(() => {
  return (state.deployments || []).map((item) => ({ value: item.deploymentnumber }));
});

const listeningModelSelected = computed(() => {
  return listeningModels.find((opt) => opt.label === props.recipient.listening_model);
});

const recipientIndex = computed(() => {
  return state.recipients
    .map((recipient) => recipient.id)
    .indexOf(props.recipient.id);
});

function onSetRecipientValue(payload: { field: any; value: any }) {
  let { field, value } = payload;
  // @ts-ignore
  props.recipient[field] = value;
  //   this.$emit("changed", true);
}

function onSetRecipientDirectBeneficiariesAdditional(v: {
  key: string | number;
  value: any;
}) {
  console.log(
    `additional: ${v}, ${props.recipient.direct_beneficiaries_additional[v.key]} -> ${
      v.value
    }`
  );
  props.recipient.direct_beneficiaries_additional[v.key] = v.value;
  //   this.$emit("changed", true);
}

onMounted(() => {
  regionsOptions.value = (state.general.region || []).map((item: string) => {
    return {
      value: item,
      label: item,
    };
  });
  props.recipient.deployments ??= [];
});
</script>
