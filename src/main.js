import Vue from 'vue'
import App from './App.vue'
import cognitoAuth from './cognito'
import router from './router'
import store from './store'

// Polyfill :focus-visible
import 'focus-visible'

// Custom plugins
import './plugins/fontawesome'

// Style
import '@/assets/css/tailwind.scss'

// Layouts
import Default from '@/layouts/Default'
import Login from '@/layouts/Login'

Vue.component('default-layout', Default)
Vue.component('login-layout', Login)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  cognitoAuth,
  render: h => h(App)
}).$mount('#app')
