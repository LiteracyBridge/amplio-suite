<template>
  <main class="container mx-auto pt-4 text-center">
    <slot />

    <div class="mx-auto pt-20" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <h1 class="mt-10 text-xl">Reset your password</h1>

      <div class="mt-5 p-6 bg-white rounded-lg shadow-box">
        <form v-on:submit.prevent>
          <v-input
            ref="email"
            type="email"
            name="email"
            label="Email"
            :disabled="resetEmailSent"
            class="my-0"
            :value="user"
            @input="user = $event.target.value"
          />

          <v-input
            v-if="resetEmailSent"
            ref="resetToken"
            type="text"
            placeholder="Enter your reset token"
            aria-label="Enter your reset token"
            class="my-6"
            :value="resetToken"
            @input="resetToken = $event.target.value"
          />

          <v-input
            v-if="resetEmailSent"
            type="password"
            placeholder="Enter your password"
            aria-label="Enter your Password"
            class="mt-6 mb-0"
            :value="password"
            @input="password = $event.target.value"
          />

          <Button
            type="submit"
            :iconLeft="status === 'loading' ? 'spinner' : ''"
            size="2x"
            :pulse="status === 'loading'"
            :color="status === 'loading' ? 'bg-gray-500' : 'bg-green'"
            :text="resetEmailSent ? 'Set new password' : 'Send password reset email'"
            class="mt-4"
            @click="resetEmailSent ? resetPassword() : sendEmail()"
          />

        </form>

        <p class="text-sm mt-4" v-if="resetEmailSent">
          Didn't get your password reset email?
        </p>
        <p class="text-sm mt-4" v-if="resetEmailSent">
          <a class="text-blue underline" @click="resetForm" href="javascript:">
            Click here to try again!
          </a>
        </p>
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
    VInput,
  },
  computed: {
    ...mapState('account', [
      'status'
    ]),
  },
  data () {
    return {
      user: '',
      password: '',
      resetToken: '',
      resetEmailSent: false,
    }
  },
  mounted () {
    this.$refs.email.$el.children[0].focus()
  },
  methods: {
    ...mapActions('account', [
      'forgotPassword',
      'confirmNewPassword'
    ]),
    ...mapMutations('notification', [
      'alert',
      'notice'
    ]),
    async sendEmail () {
      try {
        await this.forgotPassword({ user: this.user })
        this.notice('Password reset email sent')
        this.resetEmailSent = true
      }
      catch {
        this.alert('Too many attempts')
      }
    },
    async resetPassword () {
      try {
        await this.confirmNewPassword({ user: this.user, password: this.password, resetToken: this.resetToken })
        this.notice('Password reset successful')
        this.$router.push('/login')
      }
      catch {
        this.alert('Invalid email')
      }
    },
    resetForm () {
      this.resetEmailSent = false
      this.user = ''
      this.password = ''
      this.resetToken = ''
    }
  }
}
</script>
