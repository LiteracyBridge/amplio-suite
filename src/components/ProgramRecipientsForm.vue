<template>
  <div class="grid grid-cols-content-message row-gap-2 items-center text-left" style="width:80vw;">
    <p class="col-span-4 text-center text-blue">
      All fields with an asterisk are required.The optional fields are recommended for reporting.
    </p>

    <p
      v-if="invalidConstraint"
      class="col-span-4 text-center text-red-500"
    >
      <font-awesome-icon icon="exclamation-circle" class="w-6 h-6" />
      Community, Group Name and Agent combination must be unique.
    </p>

    <p
      v-if="invalidBeneficiaries"
      class="col-span-4 text-center text-red-500"
    >
      <font-awesome-icon icon="exclamation-circle" class="w-6 h-6" />
      Invalid Direct Beneficiaries details
    </p>

    <label class="mandatory-field" for="region">Region/State</label>
    <multiselect
      id="region"
      placeholder="Select a region"
      :value="recipient.region"
      :options="regionsOptions"
      @select="(region) => addRecipientRegion({ recipientIndex, region })"
      @remove="(region) => removeRecipientRegion({ recipientIndex })"
    />

    <label class="pl-4 mandatory-field" for="district">District/County</label>
    <v-input
      name="district"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.district"
      @input="setRecipientDistrict({ recipientIndex, district: $event.target.value })"
    />

    <p class="mandatory-field">Community</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.communityName"
      @input="setRecipientCommunity({ recipientIndex, community: $event.target.value })"
    />

    <p class="pl-4">Group Name</p>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="recipient.groupName"
      @input="setRecipientGroupName({ recipientIndex, groupName: $event.target.value })"
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

    <p class="mandatory-field">Language</p>
    <languages-selector
      :options="languages"
      :languages="recipient.language"
      :onLanguageSelected="({ name, code }) => setRecipientLang({ recipientIndex, lang: code })"
      :onLanguageDeleted="({ name, code }) => setRecipientLang({ recipientIndex, lang: code })"
      :multiple="false"
    />

    <span class="col-span-2" />

    <label class="pl-4 mandatory-field" for="numTalkingBooks">Number of Talking Books</label>
    <v-input
      name="numTalkingBooks"
      type="number"
      mx="mx-0 w-full"
      :value="recipient.numberTalkingBooks"
      @input="setRecipientNumberTalkingBooks({ recipientIndex, numberTalkingBooks: $event.target.value })"
    />

    <span class="col-span-2" />

    <label class="mandatory-field" for="listeningModel">Listening Model</label>
    <multiselect
      id="listeningModel"
      :options="listeningModelsOptions"
      :value="listeningModelSelected"
      label="label"
      trackBy="label"
      @select="(listeningModel) => setRecipientListeningModel({ recipientIndex, listeningModel: listeningModel.id })"
      @remove="(listeningModel) => setRecipientListeningModel({ recipientIndex, listeningModel: listeningModel.id })"
      placeholder="Select the listening model"
    />

    <span class="col-span-2" />

    <label class="pl-4 mandatory-field" for="deployments">Deployments</label>
    <multiselect
      id="deployments"
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

    <span class="col-span-2" />

    <label for="supportEntity">Support Entity</label>
    <v-input
      name="supportEntity"
      type="text"
      mx="mx-0 w-full"
      :value="recipient.supportEntity"
      @input="setRecipientSupportEntity({ recipientIndex, supportEntity: $event.target.value })"
    />

    <span class="col-span-2" />

    <div>
      <label class="mandatory-field" for="directBeneficiaries">Direct Beneficiaries</label>
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
      name="directBeneficiaries"
      type="number"
      mx="mx-0 w-full"
      :value="recipient.directBeneficiaries"
      @input="setRecipientDirectBeneficiaries({ recipientIndex, directBeneficiaries: $event.target.value })"
    />

    <p
      tabindex="0"
      :class="beneficiariesIsOpen ? 'underline font-semibold' : ''"
      class="w-48 ml-2 p-2 text-blue cursor-pointer hover:underline hover:font-semibold"
      @click="beneficiariesIsOpen = !beneficiariesIsOpen"
      @keyup.enter="beneficiariesIsOpen = !beneficiariesIsOpen"
    >
      {{ beneficiariesIsOpen ? 'Hide' : 'Show' }} Direct beneficiaries details
      <font-awesome-icon :icon="beneficiariesIsOpen ? 'chevron-up' : 'chevron-down'" />
    </p>
    <span></span>

    <div
      :class="beneficiariesIsOpen ? 'visible' : 'hidden'"
      class="col-span-4 grid grid-cols-content-message row-gap-2 items-center"
    >
      <beneficiaries-field
        label="Number of Households"
        :val="recipient.households"
        :showTooltip="recipient.households > recipient.directBeneficiaries"
        :input="(val) => setRecipientHouseholds({ recipientIndex, households: +val })"
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

    <label for="indirectBeneficiaries">Indirect beneficiaries</label>
    <v-input
      name="indirectBeneficiaries"
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
import BeneficiariesField from '@/components/ProgramRecipientsFormBeneficiaries'

export default {
  props: {
    recipientIndex: {
      type: Number,
      required: true
    },
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
      'listeningModels'
    ]),
    ...mapState('listeningModels', {
      allListeningModels: state => state.listeningModels
    }),
    deployments () {
      return this.$store.state.deployments.items
        .map(item => item.deploymentnumber)
    },
    listeningModelSelected () {
      return this.listeningModelsOptions.find(opt => opt.id === this.recipient.listeningModel)
    }
  },
  components: {
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
    allListeningModels: {
      immediate: true,
      handler () {
        this.listeningModelsOptions = this.allListeningModels
          .filter(model => this.listeningModels.includes(model.id))
      }
    }
  },
  data: () => ({
    regionsOptions: [],
    beneficiariesIsOpen: false,
    listeningModelsOptions: [],
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
    ]),
  }
}
</script>
