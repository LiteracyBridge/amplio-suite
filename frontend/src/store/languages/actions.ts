import { getLanguages } from '@/api/generalQueries.api'

// const fetchLanguages = async () => {
//   if (state.status == 'loading' || state.languages && state.languages.length > 0) {
//     return
//   }
//   commit('getLanguagesRequest')

//   try {
//     let languages = await getLanguages()
//     await commit('getLanguagesSuccess', languages)
//   } catch {
//     commit('getLanguagesError')
//   }
// }

// export default {
//   fetchLanguages
// }
