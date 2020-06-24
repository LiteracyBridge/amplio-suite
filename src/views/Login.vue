<template>
  <main class="container mx-auto text-center pt-24">
    <div class="mx-auto" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <h1 class="mt-10 text-xl">Sign in to Amplio Suite</h1>

      <div class="mt-5 p-6 bg-white rounded-lg shadow-box">
        <form v-on:submit.prevent>
          <v-input
            ref="user"
            icon-left="user-circle"
            type="text"
            placeholder="Email address"
            aria-label="Email address"
            class="my-0"
            :value="email"
            @input="setEmail($event.target.value)"
          />

          <v-input
            type="password"
            placeholder="Password"
            aria-label="Password"
            class="my-0 mt-4"
            :value="password"
            @input="setPassword($event.target.value)"
          />

          <div class="mt-2">
            <router-link to="/password_reset" class="float-right text-sm text-right text-blue underline">
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
    VInput,
  },
  computed: {
    ...mapState('account', [
      'status'
    ]),
  },
  data () {
    return {
      email: '',
      password: '',
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
    setEmail (value) {
      this.email = value
    },
    setPassword (value) {
      this.password = value
    },
    async handleLogin () {
      const status = await this.login({ email: this.email, password: this.password })

      if (status === 'success') {
        this.$router.push('/programs')
      } else {
        this.email = ''
        this.password = ''

        this.alert('Invalid Login or password')

        this.$refs.user.$el.children[1].focus()
      }
    }
  }
}
</script>
