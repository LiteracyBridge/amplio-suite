<template>
  <div v-if="selectedMessage" class="grid grid-cols-content-message row-gap-2 items-center px-8">
    <span>Language</span>
    <select
      class="py-2"
      :value="selectedMessage.language"
      @change="(event) => setMessageLang({ playlistIndex, messageIndex, lang: event.target.value })"
    >
      <option value="">All</option>
      <option
        v-for="lang in languages"
        :key="lang"
        :value="lang"
      >
        {{ lang }}
      </option>
    </select>

    <span class="pl-4">Variant</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="selectedMessage.variant"
      @input="(event) => setMessageVariant({ playlistIndex, messageIndex, variant: event.target.value })"
    />

    <span>Format</span>
    <select
      class="py-2"
      :value="selectedMessage.format"
      @change="(event) => setMessageFormat({ playlistIndex, messageIndex, format: event.target.value })"
    >
      <option
        v-for="opt in formatOptions"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.text }}
      </option>
    </select>

    <span class="pl-4">Default Category</span>
    <select class="py-2">
      <option value="">Select</option>
    </select>

    <span>SDG Goals</span>
    <select
      class="py-2 col-start-2 col-end-5"
      :value="selectedMessage.sdg_goal"
      @change="selectGoal"
    >
      <option value="">Select</option>
      <option
        v-for="goal in sdgGoals"
        :key="goal.text"
        :value="goal.text"
      >
        {{ `${goal.section}. ${goal.text}` }}
      </option>
    </select>

    <span>SDG Target</span>
    <select
      class="py-2 col-start-2 col-end-5"
      :value="selectedMessage.sdg_target"
      @change="(event) => setMessageSDGTarget({ playlistIndex, messageIndex, target: event.target.value })"
    >
      <option value="">Select</option>
      <option
        v-for="target in filterTargets"
        :key="target.text"
        :value="target.text"
      >
        {{ `${target.section}.${target.subsection} ${target.text}` }}
      </option>
    </select>

    <span>Key Points</span>
    <textarea
      cols="30"
      rows="3"
      class="col-start-2 col-end-5 p-2 rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="selectedMessage.key_point"
      @input="(event) => setMessageKeyPoints({ playlistIndex, messageIndex, text: event.target.value })"
    >
    </textarea>
  </div>
</template>

<script>
const sdgGoals = [
  { section: 1, text: 'No Poverty' },
  { section: 2, text: 'Zero Hunger' },
  { section: 3, text: 'Good Health and Well-being' },
  { section: 4, text: 'Quality Education' },
  { section: 5, text: 'Gender Equality' },
  { section: 6, text: 'Clean Water and Sanitation' },
  { section: 7, text: 'Affordable and Clean Energy' },
  { section: 8, text: 'Decent Work and Economic Growth' },
  { section: 9, text: 'Industry, Innovation and Infrastructure' },
  { section: 10, text: 'Reduced Inequality' },
  { section: 11, text: 'Sustainable Cities and Communities' },
  { section: 12, text: 'Responsible Consumption and Production' },
  { section: 13, text: 'Climate Action' },
  { section: 14, text: 'Life Below Water' },
  { section: 15, text: 'Life on Land' },
  { section: 16, text: 'Peace and Justice Strong Institutions' },
  { section: 17, text: 'Partnerships to achieve the Goal' }
]

const sdgTarget = [
  { section: 1, subsection: 1, text: "Eradicate extreme poverty"},
  { section: 1, subsection: 2, text: "Reduce poverty by at least 50%"},
  { section: 1, subsection: 3, text: "Implement social protection systems"},
  { section: 1, subsection: 4, text: "Equal rights to ownership, basic services, technology and economic resources"},
  { section: 1, subsection: 5, text: "Build resilience to environmental, economic and social disasters"},
  { section: 2, subsection: 1, text: "Universal access to safe and nutritious food"},
  { section: 2, subsection: 2, text: "End all forms of malnutrition"},
  { section: 2, subsection: 3, text: "Double the productivity and incomes of small-scale food producers"},
  { section: 2, subsection: 4, text: "Sustainable food production and resilient agricultural practices"},
  { section: 2, subsection: 5, text: "Maintain the genetic diversity in food production"},
  { section: 3, subsection: 1, text: "Reduce maternal mortality"},
  { section: 3, subsection: 2, text: "End all preventable deaths under 5 years of age"},
  { section: 3, subsection: 3, text: "Fight communicable diseases"},
  { section: 3, subsection: 4, text: "Reduce mortality from non-communicable diseases and promote mental health"},
  { section: 3, subsection: 5, text: "Prevent and treat substance abuse"},
  { section: 3, subsection: 6, text: "Reduce road injuries and deaths"},
  { section: 3, subsection: 7, text: "Universal access to sexual and reproductive care, family planning and education"},
  { section: 3, subsection: 8, text: "Achieve universal health coverage"},
  { section: 3, subsection: 9, text: "Reduce illnesses and deaths from hazardous chemicals and pollution"},
  { section: 4, subsection: 1, text: "Free primary and secondary education"},
  { section: 4, subsection: 2, text: "Equal access to quality pre-primary education"},
  { section: 4, subsection: 3, text: "Equal access to affordable technical, vocational and higher education"},
  { section: 4, subsection: 4, text: "Increase the number of people with relevant skills for financial success"},
  { section: 4, subsection: 5, text: "Eliminate all discrimination in education"},
  { section: 4, subsection: 6, text: "Universal literacy and numeracy"},
  { section: 4, subsection: 7, text: "Education for sustainable development and global citizenship"},
  { section: 5, subsection: 1, text: "End discrimination against women and girls"},
  { section: 5, subsection: 2, text: "End all violence against and exploitation of women and girls"},
  { section: 5, subsection: 3, text: "Eliminate forced marriages and genital mutilation"},
  { section: 5, subsection: 4, text: "Value unpaid care and promote shared domestic responsibilities"},
  { section: 5, subsection: 5, text: "Ensure full participation in leadership and decision-making"},
  { section: 5, subsection: 6, text: "Universal access to reproductive rights and health"},
  { section: 6, subsection: 1, text: "Safe and affordable drinking water"},
  { section: 6, subsection: 2, text: "End open defecation and provide access to sanitation and hygiene"},
  { section: 6, subsection: 3, text: "Improve water quality, wastewater treatment and safe reuse"},
  { section: 6, subsection: 4, text: "Increase water use efficiency and ensure freshwater supplies"},
  { section: 6, subsection: 5, text: "Implement integrated water resources management"},
  { section: 6, subsection: 6, text: "Protect and restore water-related ecosystems"},
  { section: 7, subsection: 1, text: "Universal access to modern energy"},
  { section: 7, subsection: 2, text: "Increase global percentage of renewable energy"},
  { section: 7, subsection: 3, text: "Double the improvement in energy efficiency"},
  { section: 8, subsection: 1, text: "Sustainable Economic Growth"},
  { section: 8, subsection: 2, text: "Diversify, innovate and upgrade for economic productivity"},
  { section: 8, subsection: 3, text: "Promote policies to support job creation and growing enterprises"},
  { section: 8, subsection: 4, text: "Improve resource efficiency in consumption and production"},
  { section: 8, subsection: 5, text: "Full employment and decent work with equal pay"},
  { section: 8, subsection: 6, text: "Promote youth employment, education and training"},
  { section: 8, subsection: 7, text: "End modern slavery, trafficking, and child labour"},
  { section: 8, subsection: 8, text: "Protect labour rights and promote safe working environments"},
  { section: 8, subsection: 9, text: "Promote beneficial and sustainable tourism"},
  { section: 8, subsection: 10, text: "Universal access to banking, insurance and financial services"},
  { section: 9, subsection: 1, text: "Develop sustainable, resilient and inclusive infrastructures"},
  { section: 9, subsection: 2, text: "Promote inclusive and sustainable industrialization"},
  { section: 9, subsection: 3, text: "Increase access to financial services and markets"},
  { section: 9, subsection: 4, text: "Upgrade all industries and infrastructures for sustainability"},
  { section: 9, subsection: 5, text: "Enhance research and upgrade industrial technologies"},
  { section: 10, subsection: 1, text: "Reduce income inequalities"},
  { section: 10, subsection: 2, text: "Promote universal social, economic and political inclusion"},
  { section: 10, subsection: 3, text: "Ensure equal opportunities and end discrimination"},
  { section: 10, subsection: 4, text: "Adopt fiscal and social policies that promotes equality"},
  { section: 10, subsection: 5, text: "Improved regulation of global financial markets and institutions"},
  { section: 10, subsection: 6, text: "Enhanced representation for developing countries in financial institutions"},
  { section: 10, subsection: 7, text: "Responsible and well-managed migration policies"},
  { section: 11, subsection: 1, text: "Safe and affordable housing"},
  { section: 11, subsection: 2, text: "Affordable and sustainable transport systems"},
  { section: 11, subsection: 3, text: "Inclusive and sustainable urbanization"},
  { section: 11, subsection: 4, text: "Protect the world's cultural and natural heritage"},
  { section: 11, subsection: 5, text: "Reduce the adverse effects of natural disasters"},
  { section: 11, subsection: 6, text: "Reduce the environmental impacts of cities"},
  { section: 11, subsection: 7, text: "Provide access to safe and inclusive green and public spaces"},
  { section: 12, subsection: 1, text: "Implement the 10-year sustainable consumption and production framework"},
  { section: 12, subsection: 2, text: "Sustainable management and use of natural resources"},
  { section: 12, subsection: 3, text: "Halve global per capita food waste"},
  { section: 12, subsection: 4, text: "Responsible management of chemicals and waste"},
  { section: 12, subsection: 5, text: "Substantially reduce waste generation"},
  { section: 12, subsection: 6, text: "Encourage companies to adopt sustainable practices and sustainability reporting"},
  { section: 12, subsection: 7, text: "Promote sustainable public procurement practices"},
  { section: 12, subsection: 8, text: "Promote universal understanding of sustainable lifestyles"},
  { section: 13, subsection: 1, text: "Strengthen resilience and adaptive capacity to climate-related disasters"},
  { section: 13, subsection: 2, text: "Integrate climate change measures into policy and planning"},
  { section: 13, subsection: 3, text: "Build knowledge and capacity to meet climate change"},
  { section: 14, subsection: 1, text: "Reduce marine pollution"},
  { section: 14, subsection: 2, text: "Protect and restore ecosystems"},
  { section: 14, subsection: 3, text: "Reduce ocean acidification"},
  { section: 14, subsection: 4, text: "Sustainable fishing"},
  { section: 14, subsection: 5, text: "Conserve coastal and marine areas"},
  { section: 14, subsection: 6, text: "End subsidies contributing to overfishing"},
  { section: 14, subsection: 7, text: "Increase the economic benefits from sustainable use of marine resources"},
  { section: 15, subsection: 1, text: "Conserve and restore terrestrial and freshwater ecosystems"},
  { section: 15, subsection: 2, text: "End deforestation and restore degraded forests"},
  { section: 15, subsection: 3, text: "End desertification and restore degraded land"},
  { section: 15, subsection: 4, text: "Ensure conservation of mountain ecosystems"},
  { section: 15, subsection: 5, text: "Protect biodiversity and natural habitats"},
  { section: 15, subsection: 6, text: "Protect access to genetic resources and fair sharing of the benefits"},
  { section: 15, subsection: 7, text: "Eliminate poaching and trafficking of protected species"},
  { section: 15, subsection: 8, text: "Prevent invasive alien species on land and in water ecosystems"},
  { section: 15, subsection: 9, text: "Integrate ecosystem and biodiversity in governmental planning"},
  { section: 16, subsection: 1, text: "Reduce violence everywhere"},
  { section: 16, subsection: 2, text: "Protect children from abuse, exploitation, trafficking and violence"},
  { section: 16, subsection: 3, text: "Promote the rule of law and ensure equal access to justice"},
  { section: 16, subsection: 4, text: "Combat organized crime and illicit financial and arms flows"},
  { section: 16, subsection: 5, text: "Substantially reduce corruption and bribery"},
  { section: 16, subsection: 6, text: "Develop effective, accountable and transparent institutions"},
  { section: 16, subsection: 7, text: "Ensure responsive, inclusive and representative decision-making"},
  { section: 16, subsection: 8, text: "Strengthen the participation in global governance"},
  { section: 16, subsection: 9, text: "Provide universal legal identity"},
  { section: 16, subsection: 10, text: "Ensure public access to information and protect fundamental freedoms"},
  { section: 17, subsection: 1, text: "Mobilize resources to improve domestic revenue collection"},
  { section: 17, subsection: 2, text: "Implement all development assistance commitments"},
  { section: 17, subsection: 3, text: "Mobilize financial resources for developing countries"},
  { section: 17, subsection: 4, text: "Assist developing countries in attaining debt sustainability"},
  { section: 17, subsection: 5, text: "Invest in least-developed countries"},
  { section: 17, subsection: 6, text: "Knowledge sharing and cooperation for access to science, technology and innovation"},
  { section: 17, subsection: 7, text: "Promote sustainable technologies to developing countries"},
  { section: 17, subsection: 8, text: "Strengthen the science, technology and innovation capacity for least-developed countries"},
  { section: 17, subsection: 9, text: "Enhanced SDG capacity in developing countries"},
  { section: 17, subsection: 10, text: "Promote a universal trading system under the WTO"},
  { section: 17, subsection: 11, text: "Increase the exports of developing countries"},
  { section: 17, subsection: 12, text: "Remove trade barriers for least-developed countries"},
  { section: 17, subsection: 13, text: "Enhance global macroeconomic stability"},
  { section: 17, subsection: 14, text: "Enhance policy coherence for sustainable development"},
  { section: 17, subsection: 15, text: "Respect national leadership to implement policies for the sustainable development goals"},
  { section: 17, subsection: 16, text: "Enhance the global partnership for sustainable development"},
  { section: 17, subsection: 17, text: "Encourage effective partnerships"},
  { section: 17, subsection: 18, text: "Enhance availability of reliable data"},
  { section: 17, subsection: 19, text: "Further develop measurements of progress"},
]

import { mapState, mapGetters, mapActions } from 'vuex'

import VInput from '@/components/VInput'

export default {
  computed: {
    ...mapState('programData', [
      'languages'
    ]),
    ...mapGetters('uiSettings', [
      'selectedMessage'
    ]),
    ...mapState('uiSettings', {
      playlistIndex: state => state.content.selectedPlaylistIndex,
      messageIndex: state => state.content.selectedMessageIndex
    }),
    filterTargets () {
      return this.sdgTarget
        .filter(target => target.section === this.selectedGoalSection)
    }
  },
  components: {
    VInput
  },
  data () {
    return {
      formatOptions: [
        { value: '', text: 'Select One' },
        { value: 'drama', text: 'Drama' },
        { value: 'endorsement', text: 'Endorsement' },
        { value: 'interview', text: 'Interview' },
        { value: 'message', text: 'Message' },
        { value: 'song', text: 'Song' },
        { value: 'other', text: 'Other' },
      ],
      sdgGoals,
      sdgTarget,

      selectedGoalSection: -1
    }
  },
  watch: {
    selectedMessage () {
      const filter = this.sdgGoals
      .filter(ele => ele.text === this.selectedMessage.sdg_goal)

      if (filter.length > 0) this.selectedGoalSection = filter[0].section
    }
  },
  methods: {
    ...mapActions('content', [
      'setMessageVariant',
      'setMessageFormat',
      'setMessageLang',
      'setMessageSDGGoal',
      'setMessageSDGTarget',
      'setMessageKeyPoints'
    ]),
    selectGoal (event) {
      const goal = event.target.value

      this.selectedGoalSection = this.sdgGoals
        .filter(ele => ele.text === goal)[0]
        .section

      this.setMessageSDGGoal({ playlistIndex: this.playlistIndex, messageIndex: this.messageIndex, goal })
    }
  }
}
</script>
