import { getListeningModels } from '@/api/listeningModels.api'

export default {
  namespaced: true,

  state: () => ({
    status: '',
    listeningModels: []
  }),

  mutations: {
    getListeningModelsRequest (state) {
      state.status = 'loading'
    },
    getListeningModelsSuccess (state, listeningModels) {
      state.status = 'success'
      state.listeningModels = listeningModels
    },
    getListeningModelsError (state) {
      state.status = 'error'
    },
  },

  actions: {
    async fetchListeningModels ({ commit, state }) {
      if (state.status == 'loading' || state.listeningModels.length > 0) return

      commit('getListeningModelsRequest')

      try {
        const response = await getListeningModels()
        await commit('getListeningModelsSuccess', response.data)
      } catch {
        commit('getListeningModelsError')
      }
    }
  }
}
