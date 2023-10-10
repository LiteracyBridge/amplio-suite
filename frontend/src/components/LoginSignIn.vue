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

    <VButton
      type="submit"
      label="Sign In"
      variant="success full"
      :iconL="status === 'loading' ? 'spinner' : ''"
      :iconLPulse="status === 'loading'"
      @click="doLogin"
    />
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/VButton.vue'
import VInput from '@/components/VInput.vue'

export default {
  components: {
    VButton,
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
    async doLogin () {
      try {
        await this.login({ email: this.email, password: this.password })
        this.$router.push('/programs')
      }
      catch {
        this.email = ''
        this.password = ''
        this.setNotification({ type: 'alert', text: 'Incorrect email or password' })

        this.$refs.user.$el.children[1].focus()
      }
    }
  }
}
</script>
