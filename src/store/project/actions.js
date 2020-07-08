import { getProgram } from '@/api/programs.api'

const fetchProject = async ({ commit }, programCode) => {
  commit('getProjectRequest', programCode)
  try {
    let project = await getProgram(programCode)
    commit('getProjectSuccess', project)
  } catch (error) {
    commit('getProjectError', error)
  }
}

export default {
  fetchProject
}
