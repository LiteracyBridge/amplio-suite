const requestInit = (state) => {
    state.status = 'loading'
}

const requestError = (state) => {
    state.status = 'error'
}

const setProgramsList = (state, values) => {
    state.status = 'success';
    state.programs = values.programIds;
    state.programNames = values.programNames;
}

export default {
    requestInit,
    requestError,
    setProgramsList,
}
