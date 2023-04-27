import { getCategories } from '@/api/generalQueries.api'

export default {
  namespaced: true,

  state: () => ({
    status: '',
    categories: [],
  }),

  mutations: {
    getCategoriesRequest (state) {
      state.status = 'loading'
    },
    getCategoriesSuccess (state, categories) {
      state.status = 'success'
      state.categories = categories
    },
    getCategoriesError (state) {
      state.status = 'error'
    },
  },

  actions: {
    async fetchCategories ({ commit, state }) {
      if (state.status == 'loading' || state.categories.length > 0) return

      commit('getCategoriesRequest')

      try {
        let categories = await getCategories()
        await commit('getCategoriesSuccess', categories)
      } catch {
        commit('getCategoriesError')
      }
    }
  }
}
