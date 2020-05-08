import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    step: 1
  },
  mutations: {
    setStep (state, payload) {
      state.step = payload
    },
    nextStep (state) {
      state.step++
    },
    prevStep (state) {
      state.step--
    }
  },
  actions: {
    setStep ({ commit }, payload) {
      commit('setStep', payload)
    },
    nextStep ({ commit }) {
      commit('nextStep')
    },
    prevStep ({ commit }) {
      commit('prevStep')
    }
  }
})
