import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    step: 1,
    goals: [],
    listening: '',
    deployments: -1,
    deploymentFrequency: '',
    deploymentInit: '',
    feedbackFrequently: '',
    feedbackFrequentlyOther: '',
    languages: []
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
    },
    selectListening (state, payload) {
      state.listening = payload
    },
    setDeployments (state, payload) {
      state.deployments = payload
    },
    setDeploymentFrequency (state, payload) {
      state.deploymentFrequency = payload
    },
    setDeploymentInit (state, payload) {
      state.deploymentInit = payload
    },
    setFeedbackFrequently (state, payload) {
      state.feedbackFrequently = payload
    },
    setFeedbackFrequentlyOther (state, payload) {
      state.feedbackFrequentlyOther = payload
    },
    setLanguages (state, payload) {
      state.languages[payload.index] = payload.lang
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
    },
    selectListening ({ commit }, payload) {
      commit('selectListening', payload)
    },
    setDeployments ({ commit }, payload) {
      commit('setDeployments', payload)
    },
    setDeploymentFrequency ({ commit }, payload) {
      commit('setDeploymentFrequency', payload)
    },
    setDeploymentInit ({ commit }, payload) {
      commit('setDeploymentInit', payload)
    },
    setFeedbackFrequently ({ commit }, payload) {
      commit('setFeedbackFrequently', payload)
    },
    setFeedbackFrequentlyOther ({ commit }, payload) {
      commit('setFeedbackFrequentlyOther', payload)
    },
    setLanguages ({ commit }, payload) {
      const lang = typeof payload.opt === 'object' && payload.opt !== null ? payload.opt.label : ''
      commit('setLanguages', { lang, index: payload.index })
    }
  }
})
