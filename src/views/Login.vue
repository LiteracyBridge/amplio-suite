<template>
  <section class="container mx-auto text-center" :class="showError ? 'pt-20' : 'pt-40'">
    <v-notification v-model="showError" icon="exclamation-circle" type="is-danger">
      Invalid Login or password.
    </v-notification>

    <div class="mx-auto" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <form>
        <div class="inline-flex items-center w-full mt-10 my-2 px-5 text-base bg-white rounded border border-solid border-gray-500">
          <font-awesome-icon icon="user-circle" class="w-6 h-6 text-gray-500" />

          <input
            type="text"
            placeholder="Email address"
            aria-label="Email address"
            class="w-full py-2 pl-2 outline-none"
            v-model="user"
          >
        </div>

        <input
          type="password"
          placeholder="Password"
          aria-label="Password"
          class="block w-full py-2 px-5 text-base bg-white rounded border border-solid border-gray-500"
          v-model="password"
        >

        <p class="pt-2 text-sm text-right text-blue underline">
          Forgot your password?
        </p>

        <Button
          class="mt-8"
          text="Sign In"
          type="submit"
          @click="handleLogin"
        />
      </form>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

import Button from '@/components/Button'
import VNotification from '@/components/VNotification'

export default {
  components: {
    Button,
    VNotification
  },
  data () {
    return {
      user: '',
      password: '',

      showError: false
    }
  },
  methods: {
    ...mapActions('account', [
      'login'
    ]),
    async handleLogin () {
      const status = await this.login({ user: this.user, password: this.password })

      if (status === 'success') {
        this.$router.push('/')
      } else {
        this.showError = true
      }
    }
  }
}
</script>