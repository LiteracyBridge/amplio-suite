import { getPrograms } from '@/api/programs.api'

const getAllPrograms = async ({ commit, state }) => {
  if (state.status == 'loading') {
    return
  }
  commit('getAllRequest')

  try {
    let allPrograms = await getPrograms()
    await commit('getAllSuccess', allPrograms)
  } catch {
    commit('getAllError')
  }
}

export default {
  getAllPrograms
}
