<template>
  <main class="container mx-auto">
    <div class="py-6 px-4 flex justify-start">
      <h1 class="text-2xl text-blue">{{ programName }} Program</h1>
    </div>

    <div class="mb-4 pb-4 rounded-md shadow-box">
      <header class="p-4 text-white text-xl text-center font-bold uppercase bg-green rounded-t-md">
        <h2>Launch checklist</h2>
      </header>

      <div class="p-6 bg-white">
        <steps
          :options="generalOptions"
          :selected="roadmap"
          :on-click="toggleStep"
        />

        <p class="text-green text-xl text-center font-bold">READY TO LAUNCH</p>

        <steps
          :options="launchOptions"
          :selected="roadmap"
          :on-click="toggleStep"
        />
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Steps from '@/components/RoadmapSteps'

const generalOptions = [
  {
    title: 'Plan',
    img: 'plan.png',
    steps: [
      {
        id: 1,
        label: 'Complete introductory questions',
        link: '',
        completed: false
      },
      {
        id: 2,
        label: 'Complete Program Specification',
        link: '',
        completed: false
      }
    ]
  },
  {
    title: 'Prepare',
    img: 'prepare.png',
    steps: [
      {
        id: 3,
        label: 'Procure batteries and supporting hardware',
        link: '',
        completed: false
      },
      {
        id: 4,
        label: 'Set up user IDs',
        link: '',
        completed: false
      },
      {
        id: 5,
        label: 'Download ACM, TB Loader and supporting applications',
        link: '',
        completed: false
      },
      {
        id: 6,
        label: 'Record system language prompts in local languages',
        link: '',
        completed: false
      }
    ]
  },
  {
    title: 'Learn',
    img: 'learn.png',
    steps: [
      {
        id: 7,
        label: 'Complete all courses from the learning portal',
        link: '',
        completed: false
      },
      {
        id: 8,
        label: 'Review the Community of Practice discussion forum',
        link: '',
        completed: false
      }
    ]
  },
  {
    title: 'Create',
    img: 'create.png',
    steps: [
      {
        id: 9,
        label: 'Create audio content outlined in the Program Specification',
        link: '',
        completed: false
      },
      {
        id: 10,
        label: 'Import audio content into ACM',
        link: '',
        completed: false
      }
    ]
  },
  {
    title: 'Deploy',
    img: 'deploy.png',
    steps: [
      {
        id: 11,
        label: 'Load audio content onto Talking Books using TB Loader',
        link: '',
        completed: false
      },
      {
        id: 12,
        label: 'Test audio content on Talking Books',
        link: '',
        completed: false
      },
      {
        id: 13,
        label: 'Deliver Talking Books based on your listening model',
        link: '',
        completed: false
      },
      {
        id: 14,
        label: 'Introduce community members to the program and devices',
        link: '',
        completed: false
      }
    ]
  }
]

const launchOptions = [
  {
    title: 'Collect',
    img: 'collect.png',
    steps: [
      {
        id: 15,
        label: 'Collect Talking Book data using smartphones/laptops',
        link: '',
        completed: false
      },
      {
        id: 16,
        label: 'Update Talking Book with next deployment',
        link: '',
        completed: false
      },
      {
        id: 17,
        label: 'Listen and code user feedback recordings',
        link: '',
        completed: false
      }
    ]
  },
  {
    title: 'Analyze',
    img: 'analyze.png',
    steps: [
      {
        id: 18,
        label: 'Review and analyze data on Amplio Dashboard',
        link: '',
        completed: false
      },
      {
        id: 19,
        label: 'Participate in quarterly conference calls for further review',
        link: '',
        completed: false
      },
      {
        id: 20,
        label: 'Incorporate learnings into future deployments',
        link: '',
        completed: false
      }
    ]
  }
]

export default {
  props: ['programCode'],
  computed: {
    ...mapState('program', [
      'programName',
    ]),
    ...mapState('roadmap', [
      'roadmap'
    ]),
  },
  components: {
    Steps,
  },
  data () {
    return {
      generalOptions,
      launchOptions,
    }
  },
  async mounted () {
    await this.fetchProgram(this.programCode)
    this.fetchRoadmap()
  },
  beforeRouteLeave (to, from, next) {
    this.updateRoadmap()
    next()
  },
  methods: {
    ...mapActions('program', [
      'fetchProgram'
    ]),
    ...mapActions('roadmap', [
      'fetchRoadmap',
      'updateRoadmap',
      'toggleStep'
    ]),
  }
}
</script>
