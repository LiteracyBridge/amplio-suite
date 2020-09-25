<template>
  <div
    class="col-span-2 grid row-gap-2 items-center"
    style="grid-template-columns: 0.5fr 1fr"
  >
    <div>
      <span>{{ label }}</span>
      <v-tooltip
        v-if="showTooltip"
        text="This field cannot be greater than Direct Beneficiaries"
        position="left"
        class="ml-2"
      >
        <font-awesome-icon
          class="text-orange-600"
          icon="exclamation-circle"
        />
      </v-tooltip>
    </div>
    <v-input
      type="number"
      :value="val"
      @input="input($event.target.value)"
      mx="mx-0"
    />
  </div>
</template>

<script>
import VInput from '@/components/VInput'
import VTooltip from '@/components/VTooltip'

export default {
  props: {
    label: {
      type: String,
      required: true
    },
    val: {
      type: Number,
      default: null
    },
    showTooltip: {
      type: Boolean,
      required: true
    },
    input: {
      type: Function,
      required: true
    }
  },
  components: {
    VInput,
    VTooltip,
  },
}
</script>
