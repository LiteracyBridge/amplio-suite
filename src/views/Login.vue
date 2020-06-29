<template>
  <main :class="hidden ? 'pt-24' : 'pt-10'" class="container mx-auto text-center">
    <slot />

    <div class="mx-auto" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <ul class="mt-5 flex">
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          class="mr-1"
        >
          <span
            tabindex="0"
            :class="tab === tabActive ? 'bg-white border-l border-t border-r rounded-t text-green' : 'text-black'"
            class="inline-block py-2 px-4 font-semibold cursor-pointer hover:text-green"
            @keyup.space="tabActive = tab"
            @click="tabActive = tab"
          >
            {{ tab }}
          </span>
        </li>
      </ul>

      <div class="p-6 bg-white rounded-lg shadow-box">
        <SignIn v-if="tabActive === 'Sign In'" />
        <SignRegister v-if="tabActive === 'Register'" />
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
  }
}
</script>
