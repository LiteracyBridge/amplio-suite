<template>
  <form v-on:submit.prevent>
    <v-input
      ref="user"
      icon-left="user-circle"
      type="text"
      placeholder="Email address"
      aria-label="Email address"
      class="my-0"
      :value="email"
      @input="email = $event.target.value"
    />

    <v-input
      type="password"
      placeholder="Password"
      aria-label="Password"
      class="my-0 mt-4"
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
