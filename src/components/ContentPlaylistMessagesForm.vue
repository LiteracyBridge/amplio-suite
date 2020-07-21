<template>
  <div class="grid grid-cols-content-message row-gap-2 items-center px-8">
    <span>Language</span>
    <select class="py-2">
      <option value="">All</option>
    </select>

    <span class="pl-4">Variant</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      value="Text input"
    />

    <span>Format</span>
    <select class="py-2">
      <option value="">Drama</option>
    </select>

    <span class="pl-4">SDG Goals</span>
    <select class="py-2">
      <option value="">Select</option>
    </select>

    <span>Default Category</span>
    <select class="py-2">
      <option value="">Select</option>
    </select>

    <span class="pl-4">SDG Target</span>
    <select class="py-2">
      <option value="">Select</option>
    </select>

    <span>Key Points</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      value="Text input"
    />

  </div>
</template>

<script>
import { mapState } from 'vuex'

import VInput from '@/components/VInput'

export default {
  computed: {
    ...mapState('programData', [
      'selectedMessage'
    ])
  },
  components: {
    VInput
  }
}
</script>
