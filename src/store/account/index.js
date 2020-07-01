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
      return new Promise((resolve, reject) => {
        cognitoAuth.authenticate(payload.email, payload.password, (err, result) => {
          if (err) {
            commit('authError')
            reject(err)
          }

          if (result) {
            const token = result.getIdToken()
            const user = {
              email: payload.email,
              name: payload.email.split('@')[0],
              token
            }

            localStorage.setItem('user', JSON.stringify(user))

            commit('setUser', user)
            commit('authSuccess')
            resolve('success')
          }
        })
      })
    },
    async register ({ commit }, payload) {
      commit('authRequest')
      return new Promise((resolve, reject) => {
        cognitoAuth.signup(payload.email, payload.email, payload.password, (err, result) => {
          if (err) {
            commit('authError')
            reject(err)
          }

          if (result) {
            commit('authSuccess')
            resolve('success')
          }
        })
      })
    },
    async forgotPassword ({ commit }, payload) {
      commit('authRequest')
      return new Promise((resolve, reject) => {
        cognitoAuth.forgotPassword(payload.user, (err) => {
          if (err) {
            commit('authError')
            reject(err)
          } else {
            commit('authSuccess')
            resolve('success')
          }
        })
      })
    },
    async confirmNewPassword ({ commit }, payload) {
      commit('authRequest')

      try {
        await cognitoAuth.confirmPassword(payload.user, payload.resetToken, payload.password)
        commit('authSuccess')
      }
      catch {
        commit('authSuccess')
      }
    },
    async logout ({ commit }) {
      commit('setUser', { email: '', name: '', img: '' })
      cognitoAuth.logout()
    },
    async requireAuth ({ commit }) {
      // Resolve if the user is authenticated
      // Else reject
      const loadUser = () => {
        // Retrieve the object from storage
        const user = localStorage.getItem('user')
        commit('setUser', JSON.parse(user))
      }

      return new Promise((resolve, reject) => {
        cognitoAuth.isAuthenticated((tokenOrError, loggedIn) => {
          if (!loggedIn) {
            if (tokenOrError) {
              loadUser()
              resolve()
            }
            else reject()
          } else {
            loadUser()
            resolve()
          }
        })
      })
    }
  }
}
