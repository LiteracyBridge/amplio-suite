<template>
  <div>
    <div v-for="opt in options" :key="opt.title" class="step">
      <img class="my-auto" :src="`/img/goals/${opt.img}`" alt="">
      <h3 class="text-xl font-bold">{{ opt.title }}</h3>
      <div>
        <div v-for="step in opt.steps" :key="step.label" class="flex justify-between my-1">
          <a href="#" target="_blank" class="text-blue text-lg underline">{{ step.label }}</a>
          <div
            class="px-1 border border-black w-6 h-6"
            @click="onClick(step.id)"
          >
            <font-awesome-icon
              v-if="selected.includes(step.id)"
              icon="check"
              class="w-4 h-4 text-green"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      required: true
    },
    onClick: {
      type: Function,
      required: true
    },
  }
}
</script>

<style lang="scss" scoped>
.step {
  @apply max-w-screen-md mx-auto grid col-gap-4 my-4;
}

.step {
  grid-template-areas:
    "img title"
    "img steps";
  grid-template-columns: 125px 1fr;

  img {
    grid-area: img;
  }

  h3 {
    grid-area: title;
  }

  &div {
    grid-area: steps
  }
}
</style>
