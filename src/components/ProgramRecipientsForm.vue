<template>
  <div class="grid grid-cols-content-message row-gap-2 items-center pl-8">
    <p mandatory-field>Country</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.country"
      @input="setRecipientCountry({ recipientIndex, country: $event.target.value })"
    />

    <p class="pl-4 mandatory-field">Number of Talking Books</p>
    <v-input
      type="number"
      mx="mx-0 w-full"
      :value="recipient.numberTalkingBooks"
      @input="setRecipientNumberTalkingBooks({ recipientIndex, numberTalkingBooks: $event.target.value })"
    />

    <p class="mandatory-field">Region</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.region"
      @input="setRecipientRegion({ recipientIndex, region: $event.target.value })"
    />

    <p class="pl-4 mandatory-field">Language</p>
    <languages-selector
      :languages="recipient.language"
      :onLanguageSelected="({ name, code }) => setRecipientLang({ recipientIndex, lang: code })"
      :onLanguageDeleted="({ name, code }) => setRecipientLang({ recipientIndex, lang: code })"
      :multiple="false"
    />

    <p class="mandatory-field">District</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.district"
      @input="setRecipientDistrict({ recipientIndex, district: $event.target.value })"
    />

    <p class="pl-4 mandatory-field">Listening Model</p>
    <multiselect
      :options="listeningModelsOptions"
      :value="listeningModelsSelected"
      :multiple="true"
      label="label"
      trackBy="label"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      @select="(listeningModel) => toggleRecipientListeningModel({ recipientIndex, listeningModel: listeningModel.id })"
      @remove="(listeningModel) => toggleRecipientListeningModel({ recipientIndex, listeningModel: listeningModel.id })"
      placeholder="Select the listening model"
    />

    <p class="mandatory-field">Community</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.community"
      @input="setRecipientCommunity({ recipientIndex, community: $event.target.value })"
    />

    <p class="pl-4">Group Name</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.groupName"
      @input="setRecipientGroupName({ recipientIndex, groupName: $event.target.value })"
    />

    <p class="mandatory-field">Deployments</p>
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

    <p class="pl-4">Support Entity</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.supportEntity"
      @input="setRecipientSupportEntity({ recipientIndex, supportEntity: $event.target.value })"
    />

    <p>Agent</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.agent"
      @input="setRecipientAgent({ recipientIndex, agent: $event.target.value })"
    />

    <p class="pl-4">Agent Gender</p>
    <multiselect
      :options="['Male', 'Female', 'Other']"
      :value="recipient.agentGender"
      placeholder="Select the agent gender"
      @input="(gender) => setRecipientAgentGender({ recipientIndex, gender })"
    />

    <div>
      <span class="mandatory-field">Direct Beneficiaries</span>
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
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.directBeneficiaries"
      @input="setRecipientDirectBeneficiaries({ recipientIndex, directBeneficiaries: $event.target.value })"
    />

    <p
      tabindex="0"
      :class="beneficiariesIsOpen ? 'underline font-semibold' : ''"
      class="w-48 ml-2 p-2 text-blue cursor-pointer hover:underline hover:font-semibold"
      @click="beneficiariesIsOpen = !beneficiariesIsOpen"
    >
      {{ beneficiariesIsOpen ? 'Hide Details' : 'Show Details' }}
      <font-awesome-icon :icon="beneficiariesIsOpen ? 'chevron-up' : 'chevron-down'" />
    </p>
    <span></span>

    <div
      :class="beneficiariesIsOpen ? 'visible' : 'hidden'"
      class="col-span-4 grid grid-cols-content-message row-gap-2 items-center"
    >
      <template v-for="opt in directBeneficiariesLabels">
        <p :key="`${opt.key}-label`">{{ opt.value }}</p>
        <v-input
          :key="`${opt.key}-input`"
          type="number"
          :value="recipient.directBeneficiariesAdditionalFields[opt.key]"
          @input="setRecipientsAdditionalFields({ recipientIndex, key: opt.key, value: $event.target.value })"
          mx="mx-0"
        />
      </template>

      <template v-for="opt in additionalLabels">
        <p :key="`${opt.key}-label`">{{ opt.value }}</p>
        <v-input
          :key="`${opt.key}-input`"
          type="number"
          :value="recipient.directBeneficiariesAdditionalFields[opt.key]"
          @input="setRecipientsAdditionalFields({ recipientIndex, key: opt.key, value: $event.target.value })"
          mx="mx-0"
        />
      </template>
    </div>

    <p>Indirect beneficiaries</p>
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

import Multiselect from 'vue-multiselect'

import VInput from '@/components/VInput'
import VTooltip from '@/components/VTooltip'
import LanguagesSelector from '@/components/LanguagesSelector'

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
    ...mapState('listeningModels', {
      listeningModelsOptions: state => state.listeningModels
    }),
    deployments () {
      return this.$store.state.deployments.items
        .map(item => item.deploymentnumber)
    },
    listeningModelsSelected () {
      return this.recipient.listeningModels
        .map(id => this.listeningModelsOptions.find(opt => opt.id === id))
    }
  },
  components: {
    VInput,
    VTooltip,
    Multiselect,
    LanguagesSelector,
  },
  data: () => ({
    beneficiariesIsOpen: false,
  }),
  mounted () {
    this.fetchListeningModels()
  },
  methods: {
    ...mapActions('listeningModels', [
      'fetchListeningModels'
    ]),
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
      'setRecipientSupportEntity',
      'setRecipientDirectBeneficiaries',
      'setRecipientNumberTalkingBooks',
      'setRecipientsAdditionalFields',
      'setRecipientsIndirectBeneficiaries',
    ]),
  }
}
</script>
