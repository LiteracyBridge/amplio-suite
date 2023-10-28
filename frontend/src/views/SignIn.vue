<template>
  <Authenticator>
    <template v-slot:header>
      <div style="padding: var(--amplify-space-large); text-align: center">
        <h1 class="visually_hidden">Log In into Amplio-Suite</h1>
        <img src="/img/logo.png" alt="Amplio logo" class="mx-auto" />

        <!-- <img
          class="amplify-image"
          alt="Amplify logo"
          src="https://docs.amplify.aws/assets/logo-dark.svg"
        /> -->
      </div>
    </template>

    <template v-slot="{ user, signOut }">
      <h1>Hello {{ user }}!</h1>
      <button @click="signOut">Sign Out</button>
    </template>
  </Authenticator>

  <main class="container mx-auto pt-4 text-center">
    <slot />

    <h1 class="visually_hidden">Log In into Amplio-Suite</h1>

    <div class="mx-auto pt-20" style="max-width: 300px">
      <img src="/img/logo.png" alt="Amplio logo" class="mx-auto" />

      <div class="mt-5 p-6 bg-white rounded-lg shadow-box">
        <form v-on:submit.prevent>
          <v-input
            ref="user"
            type="text"
            icon-left="user-circle"
            name="emailAddress"
            label="Email address"
            class="my-0"
            :value="email"
            @input="email = $event.target.value"
          />

          <v-input
            type="password"
            name="password"
            label="Password"
            class="mt-6 mb-2"
            :value="password"
            @input="password = $event.target.value"
          />

          <v-input
            v-if="store.signUp.send"
            type="text"
            name="confirmationToken"
            label="Confirmation token"
            class="mt-6 mb-2"
            :value="token"
            @input="token = $event.target.value"
          />

          <div class="mt-2 mb-16">
            <router-link
              to="/password-reset"
              class="float-right text-sm text-right text-blue underline"
            >
              Forgot your password?
            </router-link>
          </div>

          <VButton
            type="submit"
            label="Sign In"
            variant="success full"
            :iconL="store.status === 'loading' ? 'spinner' : ''"
            :iconLPulse="store.status === 'loading'"
            @click="tryLogin"
          />
        </form>
      </div>

      <p class="text-sm mt-4">
        No account?
        <router-link class="text-amplio-green font-bold" to="/register"
          >Sign Up</router-link
        >
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { mapState, mapActions } from "pinia";
import { useAccountStore } from "@/store/account";
import { useUIStore } from "@/store/ui";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

const store = useAccountStore(),
  router = useRouter();
const email = ref(""),
  password = ref(""),
  token = ref(""),
  user = ref();

async function tryLogin() {
  try {
    await store.login({
      email: email.value,
      password: password.value,
      token: token.value,
    });
    router.push("/programs");
  } catch {
    email.value = "";
    password.value = "";
    useUIStore().setNotification({ type: "alert", text: "Incorrect email or password" });

    // this.$refs.user.$el.children[1].focus()
  }
}

onMounted(() => {
  //   user.value?.focus();

  if (store.signUp.send) {
    email.value = store.signUp.email;
  }
});
// export default {
//   components: {
//     VButton,
//     VInput
//   },
//   computed: {
//     ...mapState(useAccountStore, [
//       'status',
//       'signUp'
//     ]),
//   },
//   data () {
//     return {
//       email: '',
//       password: '',
//       token: ''
//     }
//   },
//   mounted () {
//     this.$refs.user.$el.children[1].focus()

//     if (this.signUp.send) this.email = this.signUp.email
//   },
//   methods: {
//     ...mapActions(useUIStore, [
//       'setNotification'
//     ]),
//     ...mapActions(useAccountStore, [
//       'login'
//     ]),
//     async tryLogin () {
//       try {
//         await this.login({ email: this.email, password: this.password, token: this.token })
//         this.$router.push('/programs')
//       }
//       catch {
//         this.email = ''
//         this.password = ''
//         this.setNotification({ type: 'alert', text: 'Incorrect email or password' })

//         this.$refs.user.$el.children[1].focus()
//       }
//     }
//   }
// }
</script>

<style>
.amplify-button[data-variation='primary'] {
  background: #289b6a
}
</style>
