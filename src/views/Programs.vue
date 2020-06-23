<template>
  <main class="container mx-auto text-center">
    <header class="py-20 text-blue font-semibold">
      <h1 class="text-4xl">
        Welcome to Amplio Jenny!
      </h1>
      <h2 class="text-2xl">Select a Program Specification</h2>
    </header>

    <div class="grid grid-cols-4 gap-10">
      <div
        v-for="(program, index) in allPrograms"
        :key="index"
        tabindex="0"
        class="p-6 h-full bg-white rounded-lg shadow-box cursor-pointer hover:shadow-hover"
        @click="selectProgram(program)"
        @keyup.space="selectProgram(program)"
      >
        <div class="overflow-hidden">
          <img class="transform duration-500" src="/img/program.png">
        </div>
        <h3 class="py-4 text-xl font-bold">{{ program.name }}</h3>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('program', [
      'allPrograms'
    ])
  },
  methods: {
    ...mapMutations('program', [
      'setSelectedProgram'
    ]),
    selectProgram (programName) {
      this.setSelectedProgram(programName)
      this.$router.push('/')
    }
  }
}
</script>