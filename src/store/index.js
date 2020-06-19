import Vue from 'vue'
import Vuex from 'vuex'

import program from './program'
import account from './account'
import notification from './notification'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    program,
    account,
    notification
  }
})
