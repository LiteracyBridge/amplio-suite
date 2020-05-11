import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vSelect from 'vue-select'

// Style
import 'vue-select/dist/vue-select.css'
import '@/assets/css/tailwind.scss'

Vue.config.productionTip = false

Vue.component('v-select', vSelect)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
