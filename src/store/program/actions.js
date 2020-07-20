import { getProgram } from '@/api/programs.api'

const fetchProgram = async ({ commit }, programCode) => {
  commit('getProgramRequest', programCode)
  try {
    let program = await getProgram(programCode)
    commit('getProgramSuccess', program)
    commit('programData/setProgram', program, { root: true })
  } catch (error) {
    commit('getProgramError', error)
  }
}


export default {
  fetchProgram
}
