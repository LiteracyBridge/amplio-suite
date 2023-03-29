import {getPrograms2} from '@/api/programs.api'

const getProgramsList = async ({commit, state}) => {
    if (state.status === 'loading') return

    commit('requestInit')

    try {
        const getProgramsResult = await getPrograms2();
        const programsList = getProgramsResult['result']['programs'];
        const programIdsList = Object.keys(programsList).sort();
        let programNamesMap = {};
        programIdsList.forEach(id=> {programNamesMap[id] = programsList[id].name;});
        await commit('setProgramsList', {programIds:programIdsList, programNames:programNamesMap});
    } catch (error) {
        commit('requestError');
        commit('ui/setNotification', {type: 'alert', text: error.toString()}, {root: true});
    }
}

export default {
    getProgramsList
}
