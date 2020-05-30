<template>
  <main class="container mx-auto text-center" :class="showError ? 'pt-20' : 'pt-40'">
    <h1 class="visually_hidden">Amplio Suite Login</h1>

    <v-notification v-model="showError" icon="exclamation-circle" type="is-danger">
      Invalid Login or password.
    </v-notification>

    <div class="mx-auto" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <form>
        <v-input
          icon-left="user-circle"
          type="text"
          placeholder="Email address"
          aria-label="Email address"
          class="mt-10"
          v-model="user"  
        />

        <v-input
          type="password"
          placeholder="Password"
          aria-label="Password"
          v-model="password"
        />

        <div class="pt-2">
          <a href="#" class="p-2 text-sm text-right text-blue underline">
            Forgot your password?
          </a>
        </div>

        <Button
          class="mt-8"
          text="Sign In"
          type="submit"
          @click="handleLogin"
        />
      </form>
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex'

import Button from '@/components/Button'
import VInput from '@/components/VInput'
import VNotification from '@/components/VNotification'

export default {
  components: {
    Button,
    VInput,
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