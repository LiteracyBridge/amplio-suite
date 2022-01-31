import Vue from 'vue'
import PortalVue from 'portal-vue'

import App from './App.vue'
import cognitoAuth from './cognito'
import router from './router'
import store from './store'

// Polyfill :focus-visible
// Remove this to restore normal focus behaviour.
import 'focus-visible'

// Custom plugins
import './plugins/fontawesome'

// Style
import '@/assets/css/tailwind.scss'
import '@/assets/css/suite.scss'
import 'vue-multiselect/dist/vue-multiselect.min.css'

// Layouts
import Default from '@/layouts/Default'
import Login from '@/layouts/Login'

Vue.use(PortalVue)
Vue.component('default-layout', Default)
Vue.component('login-layout', Login)

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
  const VueAxe = require('vue-axe').default
  Vue.use(VueAxe)
}

new Vue({
  router,
  store,
  cognitoAuth,
  render: h => h(App)
}).$mount('#app')
