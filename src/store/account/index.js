import { makeLogin } from '@/api/account.api'

export default {
  namespaced: true,

  state: () => ({
    status: '',
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || ''
  }),

  getters: {
    isLoggedIn: state => !!state.token
  },

  mutations: {
    authRequest(state){
      state.status = 'loading'
    },
    authSuccess(state, payload){
      state.status = 'success'
      state.token = payload.token
      state.user = payload.user
    },
    authError(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
    }
  },

  actions: {
    async login ({ commit }, payload) {
      commit('authRequest')
      const token = await makeLogin(payload.user, payload.password)

      if (token) {
        commit('authSuccess', { user: payload.user, token })
        localStorage.setItem('token', token)
        localStorage.setItem('user', payload.user)
        return 'success'
      } else {
        commit('authError')
        return 'error'
      }
    }
  }
}