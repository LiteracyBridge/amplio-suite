import { getSustainableDevelopments } from '@/api/sustainableDevelopments.api'

export default {
  namespaced: true,

  state: () => ({
    status: '',
    goals: []
  }),

  mutations: {
    getSustainableDevelopmentsRequest (state) {
      state.status = 'loading'
    },
    getSustainableDevelopmentsSuccess (state, goals) {
      state.status = 'success'
      state.goals = goals
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
        const goals = await getSustainableDevelopments()
        await commit('getSustainableDevelopmentsSuccess', goals)
      } catch {
        commit('getSustainableDevelopmentsError')
      }
    }
  }
}
