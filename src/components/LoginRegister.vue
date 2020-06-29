<template>
  <form v-on:submit.prevent>
    <v-input
      ref="name"
      icon-left="user-circle"
      type="text"
      placeholder="Full Name"
      aria-label="Full Name"
      class="my-4"
      :value="fullName"
      @input="fullName = $event.target.value"
    />

    <v-input
      type="email"
      placeholder="Email"
      aria-label="Email"
      class="my-4"
      :value="email"
      @input="email = $event.target.value"
    />

    <v-input
      type="email"
      placeholder="Email confirmation"
      aria-label="Email confirmation"
      class="my-4"
      :value="emailConfirmation"
      @input="emailConfirmation = $event.target.value"
    />

    <v-input
      type="password"
      placeholder="Password"
      aria-label="Password"
      class="my-4"
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
      }
      catch (error) {
        this.fullName = ''
        this.email = ''
        this.emailConfirmation = ''
        this.password = ''

        if (error.code === 'InvalidPasswordException') {
          this.alert(error.message)
        }

        this.$refs.name.$el.children[1].focus()
      }
    }
  }
}
</script>
