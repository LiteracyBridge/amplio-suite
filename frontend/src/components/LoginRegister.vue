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

    <VButton
      type="submit"
      label="Register"
      variant="success full"
      :iconL="status === 'loading' ? 'spinner' : ''"
      :iconLPulse="status === 'loading'"
      @click="handleRegister"
    />
  </form>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useUIStore } from '@/store/ui'
import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'

export default {
  components: {
    VButton,
    VInput
  },
  computed: {
    ...mapState(useAccountStore, [
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
    ...mapActions(useUIStore, [
      'setNotification'
    ]),
    ...mapActions(useAccountStore, [
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
