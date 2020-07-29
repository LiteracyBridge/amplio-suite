import { getPrograms } from '@/api/programs.api'

const getAllPrograms = async ({ commit, state }) => {
  if (state.status == 'loading') return

  commit('requestInit')

  try {
    const allPrograms = await getPrograms()
    await commit('setAllPrograms', allPrograms)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', { type: 'alert', text: error.toString() }, { root: true })
  }
}

export default {
  getAllPrograms
}
