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
    <multiselect
      class="multi"
      tag-placeholder="Add this as new region"
      placeholder="Search or add a region"
      :value="region"
      :options="options"
      :multiple="true"
      :taggable="true"
      @tag="addTag"
      @select="addRegion"
      @remove="removeRegion"
    />
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
    this.$refs.country.$refs.search.focus()
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
