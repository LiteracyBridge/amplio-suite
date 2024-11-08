<template>
  <AppLoadingIndicator v-if="useAppStore().loading" />

  <Authenticator :hide-sign-up="true" v-else>
    <template v-slot:header>
      <div style="padding: var(--amplify-space-large); text-align: center">
        <h1 class="visually_hidden">Log In into Amplio-Suite</h1>
        <img src="/img/logo.png" alt="Amplio logo" class="mx-auto" />
      </div>
    </template>

    <template v-slot:sign-in-header>
      <h3
        class="font-bold text-2xl"
        style="padding: var(--amplify-space-xl) 0 0 var(--amplify-space-xl)"
      >
        Sign in to your account
      </h3>
    </template>
  </Authenticator>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/app.store";
import { Authenticator } from "@aws-amplify/ui-vue";
import AppLoadingIndicator from "@/components/AppLoadingIndicator.vue";
</script>

<style>
.amplify-button[data-variation="primary"] {
  background: #289b6a;
}
</style>
