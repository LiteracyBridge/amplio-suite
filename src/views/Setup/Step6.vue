<template>
  <Box
    :prev="{ name: 'Step-5' }"
    :next="{ name: 'Step-7' }"
    title="You are doing great!"
  >
    <p id="lang" class="text-2xl font-semibold">
      What languages will you develop your content in?
    </p>

    <v-input
      v-for="index in amountOfLang"
      :key="index"
      :ref="`lang_${index}`"
      :value="languages[index]"
      type="text"
      aria-labelledby="lang"
      placeholder="Choose language"
      @input="(event) => setLanguages({ lang: event.target.value, index })"
    />

    <span
      tabindex="0"
      class="mt-4 p-2u font-semibold cursor-pointer"
      @click="addLangInput"
      @keyup.enter="addLangInput"
    >
      + Add language
    </span>
  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'
import VInput from '@/components/VInput'

export default {
  components: {
    Box,
    VInput
  },
  computed: {
    ...mapState([
      'languages',
      'amountOfLang'
    ])
  },
  mounted () {
    this.$refs['lang_1'][0].$el.children[0].focus()
  },
  methods: {
    ...mapActions([
      'setLanguages',
      'addLangInput'
    ]),
    addInput () {
      this.amountOfInputs++
    }
  }
}
</script>
