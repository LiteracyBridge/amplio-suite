<template>
  <Box
    :prev="{ name: 'Step-1' }"
    :next="{ name: 'Step-3' }"
    title="Where are the programs going to be developed?"
  >
    <p class="text-2xl font-semibold">
      Country
    </p>
    <multiselect
      ref="country"
      class="multi"
      :value="country"
      :options="countries"
      placeholder="Select one country"
      @select="(country) => setCountry(country)"
    />

    <p class="text-2xl font-semibold">
      Region
    </p>

    <v-input
      type="text"
      name="region"
      label="Enter region name"
      :value="region.join(',')"
      mx="mx-auto my-4"
      @input="setRegion($event.target.value)"
    />
  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Multiselect from 'vue-multiselect'

import Box from '@/components/SetupBox'
import VInput from '@/components/VInput'

import countries from '@/data/countries.json'

export default {
  computed: {
    ...mapState('programData', [
      'country',
      'region',
    ])
  },
  components: {
    Box,
    VInput,
    Multiselect,
  },
  data () {
    return {
      countries
    }
  },
  mounted () {
    this.$refs.country.$refs.search.focus()
  },
  methods: {
    ...mapActions('wizard', [
      'setCountry',
      'setRegion',
    ])
  }
}
</script>

<style scoped>
.multi {
  @apply w-64 mx-auto;
}
</style>
