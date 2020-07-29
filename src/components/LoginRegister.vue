<template>
  <form v-on:submit.prevent>
    <v-input
      ref="name"
      type="text"
      icon-left="user-circle"
      name="fullName"
      label="Full Name"
      mx="my-4"
      :value="fullName"
      @input="fullName = $event.target.value"
    />

    <v-input
      type="email"
      name="email"
      label="Email"
      mx="my-4"
      :value="email"
      @input="email = $event.target.value"
    />

    <v-input
      type="email"
      name="emailCorfimation"
      label="Email confirmation"
      mx="my-4"
      :value="emailConfirmation"
      @input="emailConfirmation = $event.target.value"
    />

    <v-input
      type="password"
      name="password"
      label="Password"
      mx="my-4"
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
      class="w-full mt-8"
      @click="handleRegister"
    />
  </form>
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
    ...mapActions('ui', [
      'setNotification'
    ]),
    ...mapActions('account', [
      'register'
    ]),
    async handleRegister () {
      const isFill = [
        this.fullName !== '', this.email !== '',
        this.emailConfirmation !== '', this.password !== ''
      ].every(Boolean)

      if (!isFill) {
        this.setNotification({ type: 'alert', text: 'All the field are required' })
        return
      }

      try {
        await this.register({ email: this.email, password: this.password })
        this.setNotification({ type: 'notice', text: 'Check your email to validate the registration' })
        this.$emit('change-tab')
      }
      catch (error) {
        this.fullName = ''
        this.email = ''
        this.emailConfirmation = ''
        this.password = ''

        if (error.code === 'InvalidPasswordException') {
          this.setNotification({ type: 'alert', text: error.message })
        } else if (error.code === 'UserLambdaValidationException') {
          this.setNotification({ type: 'alert', text: 'The email address provided does not match our records in the system. Please contact support@amplio.org' })
        } else {
          this.setNotification({ type: 'alert', text: error.message })
        }

        this.$refs.name.$el.children[1].focus()
      }
    }
  }
}
</script>
