<template>
  <Box
    :step="step"
    :prev="{ name: 'step-program-name' }"
    :next="{ name: 'step-sdg' }"
    title="Let's add some geographic details"
  >
    <p class="text-2xl font-semibold mb-5">
      Where will you implement this program?
    </p>

    <label class="visually_hidden" for="country_input">Select one country</label>
    <multiselect
      id="country_input"
      ref="country"
      class="multi"
      :value="country"
      :options="countries"
      placeholder="Select one country"
      @select="(country) => setCountry({ country, step })"
    />

    <label class="visually_hidden" for="region_input">Select one country</label>
    <multiselect
      id="region_input"
      class="mt-5 multi"
      tag-placeholder="Add this as new region"
      placeholder="Search or add a region"
      :value="region"
      :options="options"
      :multiple="true"
      :taggable="true"
      @tag="addTag"
      @select="addRegion"
      @remove="(region) => removeRegion({ region, step })"
    >
      <template slot="noOptions">
        Region/State
      </template>
    </multiselect>
  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

import Box from '@/components/SetupBox'
import countries from '@/data/countries.json'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('programData', [
      'country',
      'region',
    ])
  },
  components: {
    Box,
    Multiselect,
  },
  data () {
    return {
      countries,
      options: [],
    }
  },
  mounted () {
    if (!this.country) this.$refs.country.$refs.search.focus()
    this.options = [...this.region] // Populete the options
  },
  methods: {
    ...mapActions('wizard', [
      'setCountry',
      'addRegion',
      'removeRegion',
    ]),
    addTag (region) {
      this.options.push(region)
      this.addRegion({ region, step: this.step })
    }
  }
}
</script>

<style scoped>
.multi {
  @apply w-96;
  @apply mx-auto;
}
</style>
