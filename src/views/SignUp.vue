<template>
  <main class="container mx-auto pt-4 text-center">
    <slot />

    <h1 class="visually_hidden">Register into Amplio-Suite</h1>

    <div class="mx-auto pt-20" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <div class="mt-5 p-6 bg-white rounded-lg shadow-box">
        <form v-on:submit.prevent>
          <v-input
            ref="name"
            type="text"
            icon-left="user-circle"
            name="fullName"
            label="Full Name"
            class="my-0"
            :value="fullName"
            @input="fullName = $event.target.value"
          />

          <v-input
            type="email"
            name="email"
            label="Email"
            class="my-6"
            :value="email"
            @input="email = $event.target.value"
          />

          <v-input
            type="email"
            name="emailCorfimation"
            label="Email confirmation"
            class="my-6"
            :value="emailConfirmation"
            @input="emailConfirmation = $event.target.value"
          />

          <v-input
            type="password"
            name="password"
            label="Password"
            class="my-6"
            :value="password"
            @input="password = $event.target.value"
          />

          <Button
            type="submit"
            :iconLeft="status === 'loading' ? 'spinner' : ''"
            size="2x"
            :pulse="status === 'loading'"
            :color="status === 'loading' ? 'bg-gray-500' : 'bg-green'"
            text="Register"
            class="w-full"
            @click="handleRegister"
          />
        </form>
      </div>

      <p class="text-sm mt-4">
        Already have login and password? <router-link class="text-green font-bold" to="/login">Sign in</router-link>
      </p>
    </div>
  </main>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

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
      fullName: '',
      email: '',
      emailConfirmation: '',
      password: ''
    }
  },
  methods: {
    ...mapActions('account', [
      'register'
    ]),
    ...mapMutations('notification', [
      'alert',
      'notice'
    ]),
    async handleRegister () {
      try {
        await this.register({ email: this.email, password: this.password })
        this.notice('Check your email to validate the registration')
        this.$emit('change-tab')
      }
      catch (error) {
        this.fullName = ''
        this.email = ''
        this.emailConfirmation = ''
        this.password = ''

        if (error === 'Not fill') {
          this.alert('All fields are required')
        } else if (error.code === 'InvalidPasswordException') {
          this.alert(error.message)
        } else if (error.code === 'UserLambdaValidationException') {
          this.alert('The email address provided does not match our records in the system. Please contact support@amplio.org')
        } else {
          this.alert(error.message)
        }

        this.$refs.name.$el.children[1].focus()
      }
    }
  }
}
</script>
