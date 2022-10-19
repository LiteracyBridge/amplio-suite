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
      @select="(region) => addRecipientRegion({ recipientIndex, region })"
      @remove="(region) => removeRecipientRegion({ recipientIndex })"
    />

    <label class="mandatory-field text-right" for="district">District/County</label>
    <v-input
      name="district"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.district"
      @input="setRecipientDistrict({ recipientIndex, district: $event.target.value })"
    />

    <label class="mandatory-field text-right" for="community">Community</label>
    <v-input
      name="community"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.communityName"
      @input="setRecipientCommunity({ recipientIndex, community: $event.target.value })"
    />

    <label class="text-right" for="group-name">Group Name</label>
    <v-input
      name="group-name"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.groupName"
      @input="setRecipientGroupName({ recipientIndex, groupName: $event.target.value })"
    />

    <label class="mandatory-field text-right" for="language">Language</label>
    <languages-selector class="suppress-int-border rounded border border-solid border-gray-500"
      name="language"
      :options="languages"
      :languages="recipient.language"
      :onLanguageSelected="({ name, code }) => setRecipientLang({ recipientIndex, lang: code })"
      :onLanguageDeleted="({ name, code }) => setRecipientLang({ recipientIndex, lang: code })"
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
        @input="setRecipientVariant({ recipientIndex, variant: $event.target.value })"
      />

    <label class="text-right" for="agent">Agent</label>
    <v-input
      name="agent"
      type="text"
      placeholder="Agent, Health Worker, etc."
      mx="mx-0 w-full"
      :value="recipient.agent"
      @input="setRecipientAgent({ recipientIndex, agent: $event.target.value })"
    />

    <label class="text-right" for="agent-gender">Agent Gender</label>
    <multiselect class="suppress-int-border rounded border border-solid border-gray-500"
      name="agent=gender"
      :options="['Male', 'Female', 'Unknown']"
      :value="recipient.agentGender"
      placeholder="Select the agent gender"
      @input="(gender) => setRecipientAgentGender({ recipientIndex, gender })"
    />

    <label class="text-right" for="numTalkingBooks">Number Talking Books</label>
    <v-input class="recipient-number-value"
      name="numTalkingBooks"
      type="number"
      mx="mx-0 w-24"
      :value="recipient.numTbs"
      @input="setRecipientNumberTalkingBooks({ recipientIndex, numTbs: $event.target.value })"
    />

    <label class="text-right" for="listeningModel">Listening Model</label>
    <multiselect class="suppress-int-border rounded border border-solid border-gray-500"
      id="listeningModel"
      :options="listeningModels"
      :value="listeningModelSelected"
      label="label"
      trackBy="label"
      @select="(listeningModel) => setRecipientListeningModel({ recipientIndex, listeningModel: listeningModel.label })"
      @remove="(listeningModel) => setRecipientListeningModel({ recipientIndex, listeningModel: listeningModel.label })"
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
      @input="(deployments) => setRecipientDeployments({ recipientIndex, deployments })"
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
      :value="recipient.supportEntity"
      @input="setRecipientSupportEntity({ recipientIndex, supportEntity: $event.target.value })"
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
      :value="recipient.directBeneficiaries"
      @input="setRecipientDirectBeneficiaries({ recipientIndex, directBeneficiaries: $event.target.value })"
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
        :val="recipient.numHouseholds"
        :showTooltip="recipient.numHouseholds > recipient.directBeneficiaries"
        :input="(val) => setRecipientHouseholds({ recipientIndex, numHouseholds: +val })"
      />

      <beneficiaries-field
        label="Group Size"
        :val="recipient.groupSize"
        :showTooltip="recipient.groupSize > recipient.directBeneficiaries"
        :input="(val) => setRecipientGroupSize({ recipientIndex, groupSize: +val })"
      />

      <beneficiaries-field
        v-for="opt in beneficiariesAdditionalFields"
        :key="opt.key"
        :label="opt.value"
        :val="recipient.directBeneficiariesAdditional[opt.key]"
        :showTooltip="recipient.directBeneficiariesAdditional[opt.key] > recipient.directBeneficiaries"
        :input="(val) => setRecipientDirectBeneficiariesAdditional({ recipientIndex, key: opt.key, value: +val })"
      />
    </div>

    <label class="text-right" for="indirectBeneficiaries">Indirect beneficiaries</label>
    <v-input
      name="indirectBeneficiaries"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.indirectBeneficiaries"
      @input="setRecipientsIndirectBeneficiaries({ recipientIndex, indirectBeneficiaries: $event.target.value })"
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
.recipient-number-value input {
  width: 6rem;
}
</style>

<script>
import { mapState, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

import VButton from '@/components/VButton'
import VInput from '@/components/VInput'
import VTooltip from '@/components/VTooltip'
import LanguagesSelector from '@/components/LanguagesSelector'
import BeneficiariesField from '@/components/ProgramRecipientsFormBeneficiaries'

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
    ...mapState('programData', {
      beneficiariesAdditionalFields: state => {
        const part1 = Object.keys(state.directBeneficiariesAdditionalMap)
          .map(key => ({ key, value: state.directBeneficiariesAdditionalMap[key] }))

        const part2 = Object.keys(state.directBeneficiariesMap)
          .map(key => ({ key, value: state.directBeneficiariesMap[key] }))

        return part2.concat(part1)
      },
    }),
    ...mapState('programData', [
      'region',
      'languages',
    ]),
    deployments () {
      const deployments = this.$store.state && this.$store.state.content2 && this.$store.state.content2.deployments || [];
      let deploymentnumbers = deployments.map(item => item.deploymentnumber);
      return deploymentnumbers;
    },
    listeningModelSelected () {
      return this.listeningModels.find(opt => opt.label === this.recipient.listeningModel)
    },
    recipientIndex () {
      return this.$store.state.recipients.recipients
        .map(reci => reci.id)
        .indexOf(this.recipient.id)
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
    ...mapActions('recipients', [
      'setRecipientDeployments',
      'addRecipientRegion',
      'removeRecipientRegion',
      'setRecipientDistrict',
      'setRecipientCommunity',
      'setRecipientGroupName',
      'setRecipientLang',
      'setRecipientListeningModel',
      'setRecipientAgent',
      'setRecipientAgentGender',
      'setRecipientVariant',
      'setRecipientHouseholds',
      'setRecipientGroupSize',
      'setRecipientSupportEntity',
      'setRecipientNumberTalkingBooks',
      'setRecipientDirectBeneficiaries',
      'setRecipientDirectBeneficiariesAdditional',
      'setRecipientsIndirectBeneficiaries',
      'setRecipientVariant',
    ]),
  }
}
</script>
