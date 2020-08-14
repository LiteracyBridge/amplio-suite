<template>
  <div class="grid grid-cols-content-message row-gap-2 items-center pl-8">
    <p class="pl-4"><span class="text-2xl font-bold text-red-500">*</span>Deployments</p>
    <multiselect
      :options="deployments"
      :value="recipient.deployments"
      :multiple="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      @input="(deployments) => setRecipientDeployments({ recipientIndex, deployments })"
      placeholder="Select the deployments"
    >
      <template slot="option" slot-scope="props">
        <div class="option__desc">
          <span class="option__title">Deployment {{ props.option }}</span>
        </div>
      </template>
    </multiselect>

    <span>Country</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.country"
      @input="setRecipientCountry({ recipientIndex, country: $event.target.value })"
    />

    <span class="pl-4">Group Name</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.groupName"
      @input="setRecipientGroupName({ recipientIndex, groupName: $event.target.value })"
    />

    <span>Region</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.region"
      @input="setRecipientRegion({ recipientIndex, region: $event.target.value })"
    />

    <span class="pl-4">Language</span>
    <language-multi-selector
      :values="recipient.language"
      v-on:on-select="(langs) => setRecipientLang({ recipientIndex, langs })"
    />

    <span>District</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.district"
      @input="setRecipientDistrict({ recipientIndex, district: $event.target.value })"
    />

    <span class="pl-4">Listening Model</span>
    <multiselect
      :options="listeningModelsOptions"
      :value="listeningModelsSelected"
      :multiple="true"
      label="label"
      trackBy="label"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      @select="(listeningModel) => toggleRecipientListeningModel({ recipientIndex, listeningModel: listeningModel.value })"
      @remove="(listeningModel) => toggleRecipientListeningModel({ recipientIndex, listeningModel: listeningModel.value })"
      placeholder="Select the listening model"
    />

    <span>Community</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.community"
      @input="setRecipientCommunity({ recipientIndex, community: $event.target.value })"
    />

    <span class="pl-4">Number of Talking Books</span>
    <v-input
      type="number"
      mx="mx-0 w-full"
      :value="recipient.numberTalkingBooks"
      @input="setRecipientNumberTalkingBooks({ recipientIndex, numberTalkingBooks: $event.target.value })"
    />

    <span>Agent</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.agent"
      @input="setRecipientAgent({ recipientIndex, agent: $event.target.value })"
    />

    <span
      tabindex="0"
      :class="agentIsOpen ? 'underline font-semibold' : ''"
      class="w-48 ml-2 p-2 text-blue cursor-pointer hover:underline hover:font-semibold"
      @click="agentIsOpen = !agentIsOpen"
    >
      {{ agentIsOpen ? 'Hide Details' : 'Show Details' }}
      <font-awesome-icon :icon="agentIsOpen ? 'chevron-up' : 'chevron-down'" />
    </span>
    <span></span>

    <div
      :class="agentIsOpen ? 'visible' : 'hidden'"
      class="col-span-4 grid grid-cols-content-message row-gap-2 items-center"
    >
      <span>Agent Gender</span>
      <multiselect
        :options="['Male', 'Female', 'Other']"
        :value="recipient.agentGender"
        placeholder="Select the agent gender"
        @input="(gender) => setRecipientAgentGender({ recipientIndex, gender })"
      />

      <span class="pl-4">Suport Entity</span>
      <v-input
        type="text"
        mx="mx-0 w-full"
        :value="recipient.suportEntity"
        @input="setRecipientSuportEntity({ recipientIndex, suportEntity: $event.target.value })"
      />
    </div>

    <span>Direct Beneficiaries</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.directBeneficiaries"
      @input="setRecipientDirectBeneficiaries({ recipientIndex, directBeneficiaries: $event.target.value })"
    />

    <span
      tabindex="0"
      :class="beneficiariesIsOpen ? 'underline font-semibold' : ''"
      class="w-48 ml-2 p-2 text-blue cursor-pointer hover:underline hover:font-semibold"
      @click="beneficiariesIsOpen = !beneficiariesIsOpen"
    >
      {{ beneficiariesIsOpen ? 'Hide Details' : 'Show Details' }}
      <font-awesome-icon :icon="beneficiariesIsOpen ? 'chevron-up' : 'chevron-down'" />
    </span>
    <span></span>

    <div
      :class="beneficiariesIsOpen ? 'visible' : 'hidden'"
      class="col-span-4 grid grid-cols-content-message row-gap-2 items-center"
    >
      <template v-for="opt in directBeneficiariesLabels">
        <span :key="`${opt.key}-label`">{{ opt.value }}</span>
        <v-input
          :key="`${opt.key}-input`"
          type="number"
          :value="recipient.directBeneficiariesAdditionalFields[opt.key]"
          @input="setRecipientsAdditionalFields({ recipientIndex, key: opt.key, value: $event.target.value })"
          mx="mx-0"
        />
      </template>

      <template v-for="opt in additionalLabels">
        <span :key="`${opt.key}-label`">{{ opt.value }}</span>
        <v-input
          :key="`${opt.key}-input`"
          type="number"
          :value="recipient.directBeneficiariesAdditionalFields[opt.key]"
          @input="setRecipientsAdditionalFields({ recipientIndex, key: opt.key, value: $event.target.value })"
          mx="mx-0"
        />
      </template>
    </div>

    <span>Indirect beneficiaries</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.indirectBeneficiaries"
      @input="setRecipientsIndirectBeneficiaries({ recipientIndex, indirectBeneficiaries: $event.target.value })"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VInput from '@/components/VInput'
import Multiselect from 'vue-multiselect'
import LanguageMultiSelector from '@/components/LanguageMultiSelector'

export default {
  props: {
    recipientIndex: {
      type: Number,
      required: true
    },
    recipient: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('recipients', {
      additionalLabels: state => Object.keys(state.additionalLabelsMap)
        .map(key => ({ key, value: state.additionalLabelsMap[key] })),
      directBeneficiariesLabels: state => Object.keys(state.labelMap)
        .map(key => ({ key, value: state.labelMap[key] }))
    }),
    ...mapState('programData', [
      'listeningModels'
    ]),
    deployments () {
      return this.$store.state.deployments.items
        .map(item => item.deploymentnumber)
    },
    listeningModelsSelected () {
      return this.recipient.listeningModels
        .map(key => this.listeningModelsOptions.find(opt => opt.value === key))
    }
  },
  components: {
    VInput,
    Multiselect,
    LanguageMultiSelector,
  },
  data: () => ({
    agentIsOpen: false,
    beneficiariesIsOpen: false,

    // FIXME The listening models options is use here and in the wizard
    // Move the options to a lambda function
    listeningModelsOptions: [
      { label: 'Households', value: 'households' },
      { label: 'Groups', value: 'groups' },
      { label: 'Community Workers', value: 'community_workers' },
      { label: 'Place-based', value: 'place_based' }
    ]
  }),
  methods: {
    ...mapActions('recipients', [
      'setRecipientDeployments',
      'setRecipientCountry',
      'setRecipientRegion',
      'setRecipientDistrict',
      'setRecipientCommunity',
      'setRecipientGroupName',
      'setRecipientLang',
      'toggleRecipientListeningModel',
      'setRecipientAgent',
      'setRecipientAgentGender',
      'setRecipientSuportEntity',
      'setRecipientDirectBeneficiaries',
      'setRecipientNumberTalkingBooks',
      'setRecipientsAdditionalFields',
      'setRecipientsIndirectBeneficiaries',
    ]),
  }
}
</script>
