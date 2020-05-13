<template>
  <div class="mt-6 p-6 bg-white rounded-lg shadow-box">
    <h2 v-if="title !== ''" class="py-4 text-3xl text-blue">{{ title }}</h2>

    <div class="min-h-200-px py-5 text-center">
      <slot />
    </div>

    <footer class="flex" :class="prev !== '' ? 'justify-between' : 'justify-end'">
      <router-link v-if="prev !== ''" :to="{ name: prev }" @click.native="prevStep">
        <Button text="PREV" />
      </router-link>

      <router-link
        v-if="next !== ''"
        :to="{ name: next }"
        @click.native="() => { if(isFill) nextStep() }"
        :class="isFill ? '' : 'cursor-not-allowed opacity-25'"
      >
        <Button class="pointer-events-none" text="NEXT" />
      </router-link>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Button from '@/components/Button'

export default {
  computed: {
    ...mapState([
      'actualStep',
      'completedSteps'
    ]),
    isFill () {
      return this.completedSteps.includes(this.actualStep)
    }
  },
  components: {
    Button
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    prev: {
      type: String,
      default: ''
    },
    next: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'nextStep',
      'prevStep'
    ])
  }
}
</script>
