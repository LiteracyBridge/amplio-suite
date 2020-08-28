<template>
  <Box
    :prev="{ name: 'Step-1' }"
    :next="{ name: 'Step-3' }"
    title="Let's add some geographic details"
  >
    <p class="text-2xl font-semibold">
      Where will you implement this program?
    </p>
    <multiselect
      ref="country"
      class="multi"
      :value="country"
      :options="countries"
      placeholder="Select one country"
      @select="(country) => setCountry(country)"
    />

    <multiselect
      class="mt-10 multi"
      tag-placeholder="Add this as new region"
      placeholder="Search or add a region"
      :value="region"
      :options="options"
      :multiple="true"
      :taggable="true"
      @tag="addTag"
      @select="addRegion"
      @remove="removeRegion"
    >
      <template slot="noOptions">
        Enter the region name
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

    // Populete the options
    this.options = [...this.region]
  },
  methods: {
    ...mapActions('wizard', [
      'setCountry',
      'addRegion',
      'removeRegion',
    ]),
    addTag (newTag) {
      this.options.push(newTag)
      this.addRegion(newTag)
    }
  }
}
</script>

<style scoped>
.multi {
  @apply w-64 mx-auto;
}
</style>
