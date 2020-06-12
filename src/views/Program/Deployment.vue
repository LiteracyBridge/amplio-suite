<template>
  <box
    title="Deployment"
    help="You can modify your deployment details here. Enter component details after filling component tab."
  >
    <div
      v-for="(date, index) in startDeployments"
      :key="index"
      class="flex items-center justify-between"
    >
      <p :id="`dep_${index}`">Deployment {{ index }}</p>
      <v-input
        type="date"
        iconLeft="calendar-alt"
        :aria-labelledby="`dep_${index}`"
        :value="date"
        mx="mx-0"
      />

      <v-input
        type="date"
        iconLeft="calendar-alt"
        :aria-labelledby="`dep_${index}`"
        :value="date"
        mx="mx-0"
      />

      <select
        aria-labelledby="deploymentLength"
        class="w-64 my-2 px-5 py-2 text-base bg-white rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      >
        <option value="all">All</option>
      </select>

      <button @click="isModalOpen = true">
        <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
      </button>
    </div>

    <v-modal v-model="isModalOpen">
      <section>
        <header class="my-4">
          <h2 class="text-2xl text-bold">Delete Deployment</h2>
        </header>

        <div class="pt-6 pb-20 text-xl">
          <p>This deployment will be deleted.</p>
        </div>

        <footer class="flex justify-between">
          <v-button text="Cancel" color="bg-gray-400" class="text-black" />
          <v-button text="Confirm" />
        </footer>
      </section>
    </v-modal>
  </box>
</template>

<script>
import Box from '@/components/ProgramBox'
import VButton from '@/components/Button'
import VInput from '@/components/VInput'
import VModal from '@/components/VModal'

export default {
  components: {
    Box,
    VButton,
    VInput,
    VModal
  },
  data () {
    return {
      isModalOpen: false,

      // This data must by come from vuex
      startDeployments: [
        '2019-05-01',
        '2019-07-01',
        '2019-09-01'
      ],
      endDeployments: [
        '2019-07-01',
        '2019-09-01',
        '2019-11-01'
      ]
    }
  }
}
</script>