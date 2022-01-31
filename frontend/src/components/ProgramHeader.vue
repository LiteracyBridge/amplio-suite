<template>
  <header>
    <h2 class="visually_hidden">{{ title }}</h2>

    <div class="grid grid-cols-5 items-center">
      <div class="col-span-4 mr-4">
        <font-awesome-icon icon="exclamation-circle" class="w-6 h-6 text-gray-500" />
        <span class="mx-4 text-lg text-blue" v-html="description" />
      </div>

      <div class="flex flex-col gap-2">
        <VButton
          label="Discard Changes"
          variant="warning-light"
          :disabled="!dirty"
          @click="onDiscardChanges"
        />
        <VButton
          label="Save Changes"
          variant="success"
          :disabled="!canSave"
          @click="onSaveChanges"
        />
      </div>
    </div>
  </header>
</template>

<script>
import VButton from '@/components/VButton'

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
