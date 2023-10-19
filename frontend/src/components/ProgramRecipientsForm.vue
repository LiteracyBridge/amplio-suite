<template>
  <div class="grid grid-cols-form-2 md:grid-cols-form-4 row-gap-2 col-gap-4 items-center text-left" style="width:80vw;">
    <p class="col-span-2 md:col-span-4 text-center text-blue">
      All fields with an asterisk are required.The optional fields are recommended for reporting.
    </p>

    <p
      v-if="invalidConstraint"
      class="col-span-2 md:col-span-4 text-center text-red-500"
    >
      <font-awesome-icon icon="exclamation-circle" class="w-6 h-6" />
      Region, District, Community, Group, Agent, and Language combination must be unique.
    </p>

    <p
      v-if="invalidBeneficiaries"
      class="col-span-2 md:col-span-4 text-center text-red-500"
    >
      <font-awesome-icon icon="exclamation-circle" class="w-6 h-6" />
      Invalid Direct Beneficiaries details
    </p>

    <label class="mandatory-field text-right" for="region" >Region/State</label>
    <multiselect class="suppress-int-border rounded border border-solid border-gray-500"
      id="region"
      placeholder="Select a region"
      :value="recipient.region"
      :options="regionsOptions"
      @select="(region) => onSetRecipientValue({field:'region', value:region})"
      @remove="(region) => onSetRecipientValue({field:'region', value:''})"
    />

    <label class="mandatory-field text-right" for="district">District/County</label>
    <v-input
      name="district"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.district"
      @input="onSetRecipientValue({field:'district', value:$event.target.value})"
    />

    <label class="mandatory-field text-right" for="community">Community</label>
    <v-input
      name="community"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.communityname"
      @input="onSetRecipientValue({field:'communityname', value:$event.target.value})"
    />

    <label class="text-right" for="group-name">Group Name</label>
    <v-input
      name="group-name"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.groupname"
      @input="onSetRecipientValue({field:'groupname', value:$event.target.value})"
    />

    <label class="mandatory-field text-right" for="language">Language</label>
    <languages-selector class="suppress-int-border rounded border border-solid border-gray-500"
      name="language"
      :options="languages"
      :languages="recipient.language"
      :onLanguageSelected="({ name, code }) => onSetRecipientValue({field:'language', value:code})"
      :onLanguageDeleted="({ name, code }) => onSetRecipientValue({field:'language', value:''})"
      :multiple="false"
    />

    <div class="text-right"><!--class="flex md:col-span-3"-->
      <label class="text-right" for="variant">Variant</label>
      <v-tooltip
        v-if="recipient.variant && recipient.variant.length > 2"
        text="Please keep variant short and abbreviated. For example, use 'T' instead of Test."
        class="my-auto ml-2"
      >
        <font-awesome-icon
          class="text-orange-600"
          icon="exclamation-circle"
        />
      </v-tooltip>
    </div>
    <v-input class="variant w-12"
        name="variant"
        type="text"
        mx="mx-0"
        :value="recipient.variant"
        @input="onSetRecipientValue({field:'variant', value:$event.target.value})"
      />

    <label class="text-right" for="agent">Agent</label>
    <v-input
      name="agent"
      type="text"
      placeholder="Agent, Health Worker, etc."
      mx="mx-0 w-full"
      :value="recipient.agent"
      @input="onSetRecipientValue({field:'agent', value:$event.target.value})"
    />

    <label class="text-right" for="agent-gender">Agent Gender</label>
    <multiselect class="suppress-int-border rounded border border-solid border-gray-500"
      name="agent=gender"
      :options="['Male', 'Female', 'Unknown']"
      :value="recipient.agent_gender"
      placeholder="Select the agent gender"
      @input="(gender) => onSetRecipientValue({field:'agent_gender', value:gender})"
    />

    <label class="text-right" for="numTalkingBooks">Number Talking Books</label>
    <v-input class="recipient-number-value"
      name="numTalkingBooks"
      type="number"
      mx="mx-0 w-24"
      :value="recipient.numtbs"
      @input="onSetRecipientValue({field:'numtbs', value:$event.target.value})"
    />

    <label class="text-right" for="listeningModel">Listening Model</label>
    <multiselect class="suppress-int-border rounded border border-solid border-gray-500"
      id="listeningModel"
      :options="listeningModels"
      :value="listeningModelSelected"
      label="label"
      trackBy="label"
      @select="(listeningModel) => onSetRecipientValue({field:'listening_model', value:listeningModel.label})"
      @remove="(listeningModel) => onSetRecipientValue({field:'listening_model', value:''})"
      placeholder="Select the listening model"
    />

    <label class="text-right" for="deployments">Deployments</label>
    <multiselect class="suppress-int-border rounded border border-solid border-gray-500"
      id="deployments"
      :options="deployments"
      :value="recipient.deployments"
      :multiple="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      @input="(deployments) => onSetRecipientValue({field:'deployments', value:deployments})"
      placeholder="Select the deployments, leave blank for 'all'"
    >
      <template slot="option" slot-scope="props">
        <div class="option__desc">
          <span class="option__title">Deployment {{ props.option }}</span>
        </div>
      </template>
    </multiselect>

    <label class="text-right" for="supportEntity">Support Entity</label>
    <v-input
      name="supportEntity"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.supportentity"
      @input="onSetRecipientValue({field:'support_entity', value:$event.target.value})"
    />

    <div class="text-right">
      <label class="text-right" for="directBeneficiaries">Direct Beneficiaries</label>
      <v-tooltip
        text="You can modify the names for these fields or add additional fields by going to General tab> Direct Beneficiaries> Show Details"
        class="ml-2"
      >
        <font-awesome-icon
          class="text-orange-600"
          icon="question-circle"
        />
      </v-tooltip>
    </div>
    <v-input class="recipient-number-value"
      name="directBeneficiaries"
      type="number"
      mx="mx-0 w-full"
      :value="recipient.direct_beneficiaries"
      @input="onSetRecipientValue({field:'direct_beneficiaries', value:$event.target.value})"
    />

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
        :input="(val) => onSetRecipientValue({field:'numhouseholds', value:+val})"
      />

      <beneficiaries-field
        label="Group Size"
        :val="recipient.group_size"
        :showTooltip="recipient.group_size > recipient.direct_beneficiaries"
        :input="(val) => onSetRecipientValue({field:'group_size', value:+val})"
      />

      <beneficiaries-field
        v-for="opt in beneficiariesAdditionalFields"
        :key="opt.key"
        :label="opt.value"
        :val="recipient.direct_beneficiaries_additional[opt.key]"
        :showTooltip="recipient.direct_beneficiaries_additional[opt.key] > recipient.direct_beneficiaries"
        :input="(val) => onSetRecipientDirectBeneficiariesAdditional({ recipientIndex, key: opt.key, value: +val })"
      />
    </div>

    <label class="text-right" for="indirectBeneficiaries">Indirect beneficiaries</label>
    <v-input
      name="indirectBeneficiaries"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.indirect_beneficiaries"
      @input="onSetRecipientValue({field:'indirect_beneficiaries', value:$event.target.value})"
    />

    <span class="col-span-2" />

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

<script>
import { mapState } from 'pinia'
import Multiselect from 'vue-multiselect'

import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'
import VTooltip from '@/components/VTooltip.vue'
import LanguagesSelector from '@/components/LanguagesSelector.vue'
import BeneficiariesField from '@/components/ProgramRecipientsFormBeneficiaries.vue'

import listeningModels from '@/data/listeningModels.json'

export default {
  props: {
    recipient: {
      type: Object,
      required: true
    },
    invalidConstraint: {
      type: Boolean,
      required: true
    },
    invalidBeneficiaries: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState('programspec', {
      beneficiariesAdditionalFields: state => {
        const part1 = Object.keys(state.general.direct_beneficiaries_additional_map)
          .map(key => ({ key, value: state.general.direct_beneficiaries_additional_map[key] }))

        const part2 = Object.keys(state.general.direct_beneficiaries_map)
          .map(key => ({ key, value: state.general.direct_beneficiaries_map[key] }))

        return part2.concat(part1)
      },
    }),
    ...mapState('programspec', {
        region: (state)=>state.general.region,
        languages: (state)=>state.general.languages,
    }),
    deployments () {
      const deployments = this.$store.state && this.$store.state.programspec && this.$store.state.programspec.deployments || [];
      let deploymentnumbers = deployments.map(item => item.deploymentnumber);
      return deploymentnumbers;
    },
    listeningModelSelected () {
      return this.listeningModels.find(opt => opt.label === this.recipient.listening_model)
    },
    recipientIndex () {
      return this.$store.state.programspec.recipients
        .map(recipient => recipient.recipientid)
        .indexOf(this.recipient.recipientid)
    }
  },
  components: {
    VButton,
    VInput,
    VTooltip,
    Multiselect,
    LanguagesSelector,
    BeneficiariesField,
  },
  watch: {
    region: {
      immediate: true,
      handler () {
        if (this.regionsOptions.length === 0) {
          this.regionsOptions = [...this.region]
        }
      }
    },
  },
  data: () => ({
    regionsOptions: [],
    beneficiariesIsOpen: false,
    listeningModels: listeningModels,
  }),
    methods: {
        onSetRecipientValue(payload) {
            let {field, value} = payload;
            this.recipient[field] = value;
            this.$emit('changed', true);
        },
        onSetRecipientDirectBeneficiariesAdditional(v) {
            console.log(`additional: ${v}, ${this.recipient.direct_beneficiaries_additional[v.key]} -> ${v.value}`);
            this.recipient.direct_beneficiaries_additional[v.key] = v.value
            this.$emit('changed', true);
        },
    }
}
</script>
