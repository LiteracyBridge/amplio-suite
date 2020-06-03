<template>
  <main class="container mx-auto text-center" :class="showError ? 'pt-4' : 'pt-24'">
    <v-notification v-model="showError" icon="exclamation-circle" type="is-danger">
      Invalid email.
    </v-notification>

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
            class="my-0"
            :value="user"
            @input="setUser($event.target.value)"
          />

          <Button
            type="submit"
            size="2x"
            text="Send password reset email"
            class="mt-4"
          />
        </form>
      </div>

      <p class="text-sm mt-4">
        Already have login and password? <router-link class="text-blue underline" to="/login">Sign in</router-link>
      </p>
    </div>
  </main>
</template>

<script>
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

      showError: false
    }
  },
  mounted () {
    this.$refs.email.$el.children[0].focus()
  },
  methods: {
    setUser (value) {
      this.user = value
    }
  }
}
</script>