import { getLanguages } from '@/api/languages.api'

const fetchLanguages = async ({ commit, state }) => {
  if (state.status == 'loading' || state.languages.length > 0) {
    return
  }
  commit('getLanguagesRequest')

  try {
    let languages = await getLanguages()
    await commit('getLanguagesSuccess', languages)
  } catch {
    commit('getLanguagesError')
  }
}

export default {
  fetchLanguages
}
