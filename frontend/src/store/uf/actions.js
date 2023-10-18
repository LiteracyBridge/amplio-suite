// import {getUfCounts} from '@/api/uf.api';


// const fetchCounts = async ({commit, state}, payload) => {
//     // Get the count of UF questions, choices, answers, and messages, by deployment # and language.
//     const {programId, refresh} = payload;
//     if (state.status === 'loading') return;
//     if (state.programId === programId && !refresh) return;

//     commit('getCountsRequest')

//     try {
//         let counts = await getUfCounts(programId);
//         await commit('getCountsSuccess', counts, programId)
//         console.log(`Got counts for ${programId}: ${counts}`);
//     } catch {
//         commit('getCountsError')
//     }
// };

// const uploadQuestionnaire = async ( payload) => {
//     const {programId, deploymentnumber, language, fileData} = payload;
//     try {
//         return await upload(programId, deploymentnumber, language, fileData);
//     } catch (error) {
//         return null;
//     }
// };

// export default {
//     fetchCounts,
//     uploadQuestionnaire,
// };
