import { getRoadmap, putRoadmap } from '@/api/roadmap.api'

export default {
  namespaced: true,

  state: () => ({
    dirty: false,
    status: '',
    programCode: '',

    roadmap: []
  }),

  mutations: {
    setDirty (state, status) {
      state.dirty = status
    },
    getRoadmapRequest (state) {
      state.status = 'loading'
    },
    getRoadmapSuccess (state, payload) {
      state.status = 'success'
      state.dirty = false
      state.roadmap = payload.roadmap
      state.programCode = payload.program_code
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
    async fetchRoadmap ({ commit, state, rootState }) {
      const { programCode } = rootState.program
      if (state.status == 'loading') return
      if (state.programCode === programCode && !state.dirty) return

      commit('getRoadmapRequest')

      try {
        const response = await getRoadmap(programCode)
        await commit('getRoadmapSuccess', response)
      } catch {
        commit('getRoadmapError')
      }
    },
    async updateRoadmap ({ commit, state }) {
      const { programCode, roadmap } = state
      const data = {
        program_code: programCode,
        completed: roadmap
      }

      try {
        await putRoadmap(data)
        commit('setDirty', false)
      } catch (error) {
        commit('requestError')
        commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
      }
    },
    toggleStep ({ commit, state }, stepId) {
      const index = state.roadmap.indexOf(stepId)

      if (index > -1) commit('removeStep', index)
      else commit('addStep', stepId)

      commit('setDirty', true)
    }
  }
}
