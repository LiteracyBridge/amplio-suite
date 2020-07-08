import { getPrograms } from '@/api/programs.api'

const getAllPrograms = async ({ commit, state }) => {
  if (state.status == 'loading') {
    return
  }
  commit('getAllRequest')

  try {
    let allPrograms = await getPrograms()
    await commit('getAllSuccess', allPrograms)

    if (allPrograms.length === 1) {
      await commit('programData/setCodeName', allPrograms[0], { root: true })
    }
  } catch {
    commit('getAllError')
  }
}

export default {
  getAllPrograms
}
