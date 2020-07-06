<template>
  <box
    title="Content"
    help="You can modify your content details on this page. All fields with an asterisk are required. The optional fields are recommended for reporting."
  >
    <div
      v-for="(deplo, index) in deployments"
      :key="index"
      @click="toggleOpen(index)"
    >
      <h3
        :class="index === deploOpen ? 'bg-gray-400' : 'bg-white'"
        class="-mx-6 px-6 py-4 text-xl text-left cursor-pointer border-2 border-gray-600"
      >
        Deployment {{ index + 1 }}
        <font-awesome-icon :icon="index === deploOpen ? 'chevron-down' : 'chevron-right'" />
      </h3>
      <div
        :class="index === deploOpen ? 'min-h-200-px': ''"
        class="min-h-0 transition-all duration-1000"
        style="grid-template-columns: 1fr 5fr;"
      >

      </div>
    </div>
  </box>
</template>

<script>
import { mapState } from 'vuex'

import Box from '@/components/ProgramBox'

export default {
  computed: {
    ...mapState('program', {
      deployments: state => state.deployments.data
    })
  },
  data () {
    return {
      deploOpen: -1
    }
  },
  components: {
    Box
  },
  methods: {
    toggleOpen (index) {
      if (this.deploOpen === index) this.deploOpen = -1
      else this.deploOpen = index
    }
  }
}
</script>
