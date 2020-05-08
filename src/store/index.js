import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    step: 1,
    goals: []
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
    },
    addGoal (state, payload) {
      state.goals.push(payload)
    },
    removeGoal (state, index) {
      state.goals.splice(index, 1)
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
    },
    toggleGoal ({ commit, state }, goal) {
      const index = state.goals.indexOf(goal)

      if (index > -1) {
        commit('removeGoal', index)
      } else {
        commit('addGoal', goal)
      }
    }
  }
})
