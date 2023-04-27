import { getRoadmap, putRoadmap } from '@/api/generalQueries.api'

export default {
  namespaced: true,

  state: () => ({
    changed: false,
    status: '',
    programId: '',

    roadmap: []
  }),

  mutations: {
    setChanged (state, changed) {
      state.changed = changed
    },
    getRoadmapRequest (state) {
      state.status = 'loading'
    },
    getRoadmapSuccess (state, payload) {
      state.status = 'success'
      state.changed = false
      state.roadmap = payload.completed
      state.programId = payload.program_code || payload.program_id
    },
    getRoadmapError (state) {
      state.status = 'error'
    },
    addStep (state, payload) {
      state.roadmap.push(payload)
    },
    removeStep (state, index) {
      state.roadmap.splice(index, 1)
    }
  },

  actions: {
    async fetchRoadmap ({ commit, state }, programId) {
      if (state.status == 'loading') return
      if (state.programId === programId && !state.changed) return

      commit('getRoadmapRequest')

      try {
        const response = await getRoadmap(programId)
        await commit('getRoadmapSuccess', response)
      } catch {
        commit('getRoadmapError')
      }
    },
    async updateRoadmap ({ commit, state }) {
      const { programId, roadmap } = state
      if (!state.changed) return;

      try {
        await putRoadmap(programId, roadmap)
        commit('setChanged', false)
      } catch (error) {
        commit('requestError')
        commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
      }
    },
    toggleStep ({ commit, state }, stepId) {
      const index = state.roadmap.indexOf(stepId)

      if (index > -1) commit('removeStep', index)
      else commit('addStep', stepId)

      commit('setChanged', true)
    }
  }
}
