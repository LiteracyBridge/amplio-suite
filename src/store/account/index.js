import cognitoAuth from '@/cognito'

export default {
  namespaced: true,

  state: () => ({
    status: '',
    user: {
      email: '',
      name: '',
      img: ''
    }
  }),

  getters: {
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
    setUser(state, payload) {
      state.user = payload
    }
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
            commit('setUser', { email: payload.user, token })
            commit('authSuccess')
            resolve('success')
          }
        })
      })
    }
  }
}
