<template>
  <Box
    prev="Step-6"
    next="Step-8"
    title="You are doing great!"
  >
    <p class="text-2xl font-semibold">
      What languages will you develop your content in?
    </p>

    <v-select
      v-for="index in amountOfInputs"
      :key="index"
      class="w-96 mt-4 mx-auto"
      placeholder="Choose language"
      :options="options"
      @input="(opt) => setLanguages({ opt, index: index - 1 })"
    />

    <p class="mt-4 font-semibold cursor-pointer" @click="addInput">
      + Add language
    </p>
  </Box>
</template>

<script>
import { mapActions } from 'vuex'

import countryCodes from '@/data/countryCodes'
import Box from '@/components/SetupBox'

export default {
  data () {
    return {
      amountOfInputs: 1,
      options: countryCodes
    }
  },
  components: {
    Box
  },
  methods: {
    ...mapActions([
      'setLanguages'
    ]),
    addInput () {
      this.amountOfInputs++
    }
  }
}
</script>
