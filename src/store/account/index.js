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
        cognitoAuth.authenticate(payload.email, payload.password, (err, result) => {
          if (err) {
            commit('authError')
            resolve('error')
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
