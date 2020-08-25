<template>
  <Box
    :prev="{ name: 'Step-1' }"
    :next="{ name: 'Step-3' }"
    title="Where are the programs going to be developed?"
  >
    <p class="text-2xl font-semibold">
      Country
    </p>

    <v-input
      ref="country"
      type="text"
      name="country"
      label="Enter country name"
      :value="country"
      mx="mx-auto my-4"
      @input="setCountry($event.target.value)"
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

import Box from '@/components/SetupBox'
import VInput from '@/components/VInput'

export default {
  computed: {
    ...mapState('programData', [
      'country',
      'region',
    ])
  },
  components: {
    Box,
    VInput
  },
  mounted () {
    this.$refs.country.$el.children[0].focus()
  },
  methods: {
    ...mapActions('wizard', [
      'setCountry',
      'setRegion',
    ])
  }
}
</script>
