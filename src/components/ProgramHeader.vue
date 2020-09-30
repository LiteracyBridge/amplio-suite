<template>
  <header>
    <h2 class="visually_hidden">{{ title }}</h2>

    <div class="grid grid-cols-5 items-center">
      <div class="col-span-4 mr-4">
        <font-awesome-icon icon="exclamation-circle" class="w-6 h-6 text-gray-500" />
        <span class="mx-4 text-lg text-blue" v-html="description" />
      </div>

      <div>
        <v-button
          text="Discard Changes"
          :color="dirty ? 'bg-transparent text-red-500 border border-red-500' : 'bg-gray-400 cursor-not-allowed'"
          class="w-full mt-2"
          @click="onDiscardChanges"
          :aria-disabled="dirty ? 'false' : 'true'"
        />

        <v-button
          text="Save Change"
          :color="canSave ? 'bg-green' : 'bg-gray-400 cursor-not-allowed'"
          class="w-full mt-2"
          @click="onSaveChanges"
          :aria-disabled="canSave ? 'false' : 'true'"
        />
      </div>
    </div>
  </header>
</template>

<script>
import VButton from '@/components/Button'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    dirty: {
      type: Boolean,
      required: true
    },
    canSave: {
      type: Boolean,
      required: true
    },
    onDiscardChanges: {
      type: Function,
      required: true
    },
    onSaveChanges: {
      type: Function,
      required: true
    }
  },
  components: {
    VButton,
  }
}
</script>
