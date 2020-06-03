import cognitoAuth from '@/cognito'

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
    authSuccess(state){
      state.status = 'success'
    },
    authError(state){
      state.status = 'error'
    },
  },

  actions: {
    async login ({ commit }, payload) {
      commit('authRequest')
      return new Promise((resolve) => {
        // cognitoAuth.signup(payload.user, payload.user, payload.password, (err, result) => {
        cognitoAuth.authenticate(payload.user, payload.password, (err, result) => {
          if (err) {
            commit('authError')
            resolve('error')
          }

          if (result) {
            const token = result.getIdToken()
            commit('authSuccess', { user: payload.user, token })
            resolve('success')
          }
        })
      })
    }
  }
}
