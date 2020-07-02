<template>
  <main class="container mx-auto pt-4 text-center">
    <slot />

    <h1 class="visually_hidden">Sign In into Amplio-Suite</h1>

    <div class="mx-auto pt-20" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <div class="mt-5 p-6 bg-white rounded-lg shadow-box">
        <form v-on:submit.prevent>
          <v-input
            ref="user"
            type="text"
            icon-left="user-circle"
            name="emailAddress"
            label="Email address"
            class="my-0"
            :value="email"
            @input="email = $event.target.value"
          />

          <v-input
            type="password"
            name="password"
            label="Password"
            class="mt-6 mb-2"
            :value="password"
            @input="password = $event.target.value"
          />

          <div class="mt-2">
            <router-link to="/password-reset" class="float-right text-sm text-right text-blue underline">
              Forgot your password?
            </router-link>
          </div>

          <Button
            type="submit"
            :iconLeft="status === 'loading' ? 'spinner' : ''"
            size="2x"
            :pulse="status === 'loading'"
            :color="status === 'loading' ? 'bg-gray-500' : 'bg-green'"
            text="Sign In"
            class="w-full mt-8"
            @click="handleLogin"
          />
        </form>
      </div>

      <p class="text-sm mt-4">
        No account? <router-link class="text-green font-bold" to="/register">Sign Up</router-link>
      </p>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import Button from '@/components/Button'
import VInput from '@/components/VInput'

export default {
  components: {
    Button,
    VInput
  },
  computed: {
    ...mapState('account', [
      'status'
    ]),
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  mounted () {
    this.$refs.user.$el.children[1].focus()
  },
  methods: {
    ...mapActions('account', [
      'login'
    ]),
    ...mapMutations('notification', [
      'alert'
    ]),
    async handleLogin () {
      try {
        await this.login({ email: this.email, password: this.password })
        this.$router.push('/programs')
      }
      catch {
        this.email = ''
        this.password = ''
        this.alert('Invalid Login or password')

        this.$refs.user.$el.children[1].focus()
      }
    }
  }
}
</script>
