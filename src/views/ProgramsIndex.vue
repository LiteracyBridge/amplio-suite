<template>
  <main class="container mx-auto text-center">
    <header class="py-20 text-blue font-semibold">
      <h1 class="text-4xl">
        Welcome to Amplio <span class="capitalize">{{ user.name }}</span>!
      </h1>
      <h2 v-if="status === 'success'" class="text-2xl">Select a Program Specification</h2>
      <h2 v-else-if="status === 'error'" class="text-2xl">Error</h2>
      <h2 v-else class="text-2xl">Loading programs...</h2>
    </header>

    <font-awesome-icon
      v-if="!['success', 'error'].includes(status)"
      icon="spinner"
      size="4x"
      pulse
      class="mx-auto w-20 h-20" />

    <div v-else class="grid grid-cols-4 gap-10">
      <div
        v-for="(codeName, index) in programs"
        :key="index"
        tabindex="0"
        class="p-6 h-full bg-white rounded-lg shadow-box cursor-pointer hover:shadow-hover"
        @click="selectProgram(codeName)"
        @keyup.space="selectProgram(codeName)"
      >
        <img class="mx-auto" src="/img/program.png">
        <h3 class="py-4 text-xl font-bold">{{ codeName }}</h3>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('programs', [
      'status',
      'programs'
    ]),
    ...mapState('account', [
      'user'
    ])
  },
  async mounted () {
    await this.getAllPrograms()
    if (this.programs.length === 1) {
      this.selectProgram(this.programs[0])
    }
  },
  methods: {
    ...mapActions('program', [
      'setCodeName'
    ]),
    ...mapActions('programs', [
      'getAllPrograms'
    ]),
    async selectProgram (codeName) {
      const id = await this.setCodeName(codeName)
      this.$router.push(`/programs/${id}`)
    }
  }
}
</script>
