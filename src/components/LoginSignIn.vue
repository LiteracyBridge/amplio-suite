<template>
  <form v-on:submit.prevent>
    <v-input
      ref="user"
      type="text"
      icon-left="user-circle"
      name="emailAddress"
      label="Email address"
      class="my-6"
      :value="email"
      @input="email = $event.target.value"
    />

    <v-input
      type="password"
      name="password"
      label="Password"
      class="my-6"
      :value="password"
      @input="password = $event.target.value"
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
</template>

<script>
import { mapState, mapActions } from 'vuex'

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
    ...mapActions('ui', [
      'setNotification'
    ]),
    ...mapActions('account', [
      'login'
    ]),
    async handleLogin () {
      try {
        await this.login({ email: this.email, password: this.password })
        this.$router.push('/programs')
      }
      catch {
        this.email = ''
        this.password = ''
        this.setNotification({ type: 'alert', 'Invalid Login or password' })

        this.$refs.user.$el.children[1].focus()
      }
    }
  }
}
</script>
