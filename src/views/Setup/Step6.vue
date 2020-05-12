<template>
  <Box
    prev="Step-5"
    next="Step-7"
    title="You are doing great!"
  >
    <p id="lang" class="text-2xl font-semibold">
      What languages will you develop your content in?
    </p>

    <input
      v-for="index in amountOfInputs"
      :key="index"
      type="text"
      aria-labelledby="lang"
      placeholder="Choose language"
      class="block mx-auto mt-2 px-5 py-1 text-base rounded border border-solid border-gray-500"
      @input="(event) => setLanguages({ lang: event.target.value, index: index - 1 })"
    >

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
