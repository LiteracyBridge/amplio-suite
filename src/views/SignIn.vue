<template>
  <AppLoadingIndicator v-if="useAppStore().loading" />

  <div v-else class="login-wrapper">
    <div class="login-card">
      <div class="login-image">
        <img src="/img/sign-in-image.png" alt="Welcome" />
      </div>
      
      <div class="login-form">
        <Authenticator :hide-sign-up="true">
          <template v-slot:header>
            <div class="logo-section">
              <h1 class="visually_hidden">Log In into Amplio-Suite</h1>
              <img class="image-wrapper" src="/img/logo.png" alt="Amplio logo" />
            </div>
          </template>

          <template v-slot:sign-in-header>
            <h3 class="sign-in-title">WELCOME TO THE AMPLIO SUITE</h3>
          </template>
        </Authenticator>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/app.store";
import { Authenticator } from "@aws-amplify/ui-vue";
import AppLoadingIndicator from "@/components/AppLoadingIndicator.vue";
</script>

<style>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #f5f5f5;
}

.login-card {
  display: flex;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-image, .login-form {
  flex: 1;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 10%;
  justify-content: center;

}

.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.image-wrapper {
  max-width: 200px;
}

.logo-section {
  text-align: center;
  padding: 2rem 2rem 2rem 2rem;
  
}

.logo-section img {
  display: block;
  margin: 0 auto;
}

.sign-in-title {
  font-weight: bold;
  font-size: 1.5rem;
  padding: 1.5rem 0 0 1.5rem;
  justify-content: center;
  text-align: center;
}

.amplify-button[data-variation="primary"] {
  background: #289b6a;
}

/* Mobile & Tablet */
@media (max-width: 1024px) {
  .login-wrapper { padding: 0.5rem; }
  .login-card { 
    flex-direction: column; 
    max-height: none;
  }
  .login-image { 
    height: 200px; 
    order: -1;
    obitect-fit: cover;
  }
  .login-form { padding: 1rem; }
  .logo-section { padding: 1rem 0; }
}
</style>