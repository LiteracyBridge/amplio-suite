import Vue from 'vue'
import App from './App.vue'
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
  render: h => h(App)
}).$mount('#app')
