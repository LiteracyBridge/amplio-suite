import { getSustainableDevelopments } from '@/api/sustainableDevelopments.api'

export default {
  namespaced: true,

  state: () => ({
    status: '',
    goals: [],
    targets: []
  }),

  mutations: {
    getSustainableDevelopmentsRequest (state) {
      state.status = 'loading'
    },
    getSustainableDevelopmentsSuccess (state, payload) {
      state.status = 'success'
      state.goals = payload.goals
      state.targets = payload.targets
    },
    getSustainableDevelopmentsError (state) {
      state.status = 'error'
    },
  },

  actions: {
    async fetchSustainableDevelopments ({ commit, state }) {
      if (state.status == 'loading' || state.goals.length > 0) return

      commit('getSustainableDevelopmentsRequest')

      try {
        const response = await getSustainableDevelopments()
        await commit('getSustainableDevelopmentsSuccess', response)
      } catch {
        commit('getSustainableDevelopmentsError')
      }
    }
  }
}
