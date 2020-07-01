<template>
  <main class="container mx-auto pt-4 text-center">
    <slot />

    <h1 class="visually_hidden">
      {{ tabActive === 'Sign In' ? 'Sign In into Amplio-Suite'
        : 'Register into Amplio-Suite' }}
    </h1>

    <div class="mx-auto pt-20" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <ul class="mt-5 flex">
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          class="mr-1"
        >
          <span
            tabindex="0"
            :class="tab === tabActive ? 'bg-white border-l border-t border-r rounded-t text-green shadow-box' : 'text-black'"
            class="inline-block py-2 px-4 font-semibold cursor-pointer hover:text-green af"
            @keyup.space="tabActive = tab"
            @click="tabActive = tab"
          >
            {{ tab }}
          </span>
        </li>
      </ul>

      <div
        class="p-6 bg-white shadow-box"
        :style="{borderRadius: tabActive === 'Sign In' ? '0 0.5rem 0.5rem 0.5rem' : '0.5rem' }"
      >
        <SignIn v-if="tabActive === 'Sign In'" />
        <SignRegister v-if="tabActive === 'Register'" v-on:change-tab="changeTab" />
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex'

import SignIn from '@/components/LoginSignIn'
import SignRegister from '@/components/LoginRegister'

export default {
  components: {
    SignIn,
    SignRegister
  },
  computed: {
    ...mapState('notification', [
      'hidden'
    ])
  },
  data () {
    return {
      tabs: ['Sign In', 'Register'],
      tabActive: 'Sign In'
    }
  },
  methods: {
    changeTab(e) {
      this.tabActive = 'Sign In'
    }
  }
}
</script>

<style scoped>
.af::after {
  content: ' ';
  position: absolute;
  background-color: white;
  width: 190px;
  height: 10px;
  margin-left: -69px;
  margin-top: 32px;
  z-index: 999;
}
</style>
