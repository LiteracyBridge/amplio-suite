<template>
  <main class="container mx-auto text-center">
    <div class="my-6 px-4 flex justify-start">
      <h1 class="text-2xl text-blue">{{ programName }} Program</h1>
    </div>

    <nav class="flex">
      <component
        v-for="section in sections"
        :key="section.name"
        :is="section.disabled ? 'span' : 'router-link'"
        :to="section.disabled ? '' : `/program/${section.name}`"
        :class="[
          $route.path.endsWith(section.name) ? 'bg-green text-white' : 'text-black',
          section.disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        class="py-2 px-4 uppercase text-lg">
        {{ section.name }}
      </component>
    </nav>

     <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>

    <footer class="py-6">
      Need help? Contact us on <a class="text-blue" href="mailto:support@amplio.org">support@amplio.org</a>
    </footer>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Program',
  computed: {
    ...mapState([
      'programName'
    ])
  },
  data () {
    return {
      sections: [
        { name: 'general' },
        { name: 'deployments' },
        { name: 'content' },
        { name: 'recipients', disabled: true },
        { name: 'components', disabled: true },
        { name: 'values', disabled: true }
      ],

      transitionName: 'slide-left'
    }
  },
  beforeRouteUpdate (to, from, next) {
    const toName = to.path.split('/')[2]
    const fromName = from.path.split('/')[2]
    const sections = this.sections.map(section => section.name)
    this.transitionName = sections.indexOf(toName) < sections.indexOf(fromName) ? 'slide-right' : 'slide-left'
    next()
  }
}
</script>