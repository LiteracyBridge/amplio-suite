import { getPrograms } from '@/api/programs.api'

const getAllPrograms = async ({ commit }) => {
  commit('getAllRequest')

  let allPrograms
  try {
    allPrograms = await getPrograms()
  } catch {
    commit('getAllError')
    return 1
  }

  commit('getAllSuccess')
  await commit('setAllPrograms', allPrograms)

  if (allPrograms.length === 1) {
    await commit('program/setCodeName', allPrograms[0], { root: true })
  }
}

export default {
  getAllPrograms
}
