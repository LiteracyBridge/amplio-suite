<template>
  <main class="container mx-auto text-center pt-24">
    <div class="mx-auto" style="max-width:300px;">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto">

      <h1 class="mt-10 text-xl">Reset your password</h1>

      <div class="mt-5 p-6 bg-white rounded-lg shadow-box">
        <form v-on:submit.prevent>
          <v-input
            ref="email"
            type="email"
            placeholder="Enter your email address"
            aria-label="Enter your Email address"
            :disabled="resetEmailSent"
            class="my-0"
            :value="user"
            @input="setUser($event.target.value)"
          />

          <v-input
            v-if="resetEmailSent"
            ref="resetToken"
            type="text"
            placeholder="Enter your reset token"
            aria-label="Enter your reset token"
            class="my-0"
            :value="resetToken"
            @input="setResetToken($event.target.value)"
          />

          <v-input
            v-if="resetEmailSent"
            type="password"
            placeholder="Enter your password"
            aria-label="Enter your Password"
            class="my-0"
            :value="password"
            @input="setPassword($event.target.value)"
          />

          <Button
            type="submit"
            size="2x"
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
        Already have login and password? <router-link class="text-blue underline" to="/login">Sign in</router-link>
      </p>
    </div>
  </main>
</template>

<script>
import { mapMutations } from 'vuex'
import Button from '@/components/Button'
import VInput from '@/components/VInput'
import cognitoAuth from '@/cognito'

export default {
  components: {
    Button,
    VInput,
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
    ...mapMutations('notification', [
      'alert',
      'notice'
    ]),
    setUser (value) {
      this.user = value
    },
    setPassword (value) {
      this.password = value
    },
    setResetToken (value) {
      this.resetToken = value
    },
    sendEmail () {
      cognitoAuth.forgotPassword(this.user, (err) => {
        if (err) {
          this.alert('Too many attempts')
        } else {
          this.notice('Password reset email sent')
          this.resetEmailSent = true
        }
      })
    },
    resetPassword () {
      return cognitoAuth.confirmPassword(this.user, this.resetToken, this.password)
        .then(() => {
          this.notice('Password reset successful')
          this.$router.push('/login')
        })
        .catch(() => {
          this.alert('Invalid email')
        })
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
