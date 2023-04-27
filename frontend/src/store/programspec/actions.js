// Import the API to load/store content.

import {
    approveSpec as approveSpecFile,
    getProgramSpec,
    putProgramSpec,
    getDownloadLink,
    // putContent,
    uploadSpec as uploadSpecFile, publish
} from '@/api/programspec.api'

// A "temporary" recipientid is created with a "$$TEMP-" prefix. This would violate a constraint on the recipientid
// column, thus preventing its accidental insertion into the database.
const TEMP_RECIPIENT_PREFIX = '$$TEMP-';
const TEMP_RECIPIENT_RE = /^\$\$TEMP-([0-9]+)$/;

//region Server API

// Fetch the content from the server. payload must have a member .programId.
const fetchSpec = async ({state, commit}, payload) => {
    const {programId} = payload;


    if (state.status === 'loading') return;
    // Not loading: '', success, or error
    if (state.programId === programId && !state.changed) return;

    console.log(`Fetching spec for ${programId}`);
    commit('requestInit')

    try {
        const programspec = await getProgramSpec(programId);
        await commit('setSpec', {programId, programspec});
        console.log(`Done fetching spec for ${programId} status is ${state.status}`);
    } catch (error) {
        commit('requestError');
        commit('ui/setNotification', {type: 'alert', text: error.toString()}, {root: true});
    }
}

const ensureSpec = async ({state, commit}, payload) => {
    const {programId} = payload;
    if (state.status === 'loading') return; // may be wrong program?
    if (state.programId === programId) return;

    console.log(`Ensure spec fetching for ${programId}`);
    commit('requestInit')

    try {
        const programspec = await getProgramSpec(programId);
        await commit('setSpec', {programId, programspec});
        console.log(`Done fetching spec for ${programId} status is ${state.status}`);
    } catch (error) {
        commit('requestError');
        commit('ui/setNotification', {type: 'alert', text: error.toString()}, {root: true});
    }
}

// Update the server with any new & updated content.
const updateSpec = async ({state, commit}) => {
    const {programId, general, deployments, recipients} = state
    // Make a copy of recipients, because we may modify some of the recipientids.
    const newSpec = {
        general: general,
        deployments: deployments,
        recipients: recipients.map((recip) => {
                let newRecip = Object.assign({}, recip);
                // If this recipient has a temporary ID, set it to null so the server can supply a proper id.
                if (newRecip.recipientid.match(TEMP_RECIPIENT_RE))
                    newRecip.recipientid = null;
                return newRecip;
            }
        )
    };

    commit('requestInit')

    try {
        console.log(`Updating spec for ${programId}`);
        const updateResult = await putProgramSpec(programId, newSpec);
        const programspec = updateResult && updateResult.updated;
        commit('setSpec', {programId, programspec});
        console.log(`Done updating spec for ${programId} status is ${state.status}`);
        // commit('setChanged', false)
        // commit('requestSuccess')
    } catch (error) {
        commit('requestError')
        commit('ui/setNotification', {type: 'alert', text: error.toString()}, {root: true})
    }
}

const getExportLink = async ({state}, payload) => {
    const {programId, artifact} = payload;
    if (state.status === 'loading') return;
    try {
        return await getDownloadLink(programId, artifact);
    } catch (error) {
        // TODO: return an error message.
        return null;
    }
};

const uploadSpec = async ({state}, payload) => {
    const {programId, fileData} = payload;
    if (state.status === 'loading') return;
    try {
        return await uploadSpecFile(programId, fileData);
    } catch (error) {
        return null;
    }
};

const approveSpec = async ({state, commit}, payload) => {
    const {programId, publish} = payload;
    if (state.status === 'loading') return;
    commit('resetState');
    commit('recipients/resetState', null, {root: true});
    commit('programData/resetState', null, {root: true});
    commit('program/resetState', null, {root: true});
    try {
        return await approveSpecFile(programId, publish);
    } catch (error) {
        return null;
    }
};

const publishSpec = async ({ state }) => {
    try {
        console.log(`Calling publish(${state.programId}).`)
        await publish(state.programId)
        return 'success'
    } catch (error) {
        console.log(error)
    }
}

//endregion

//region "General" (ie, Program) functions
//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
const setProgramName = async ({commit},name) => {
    await commit('setProgramName', name);
    commit('setChanged', true);
}

const setCountry = async ({ commit }, payload) => {
    await commit('setCountry', payload)
    commit('setChanged', true)
}

const addRegion = async ({ commit }, payload) => {
    await commit('addRegion', payload)
    commit('setChanged', true)
}

const removeRegion = async ({ commit }, payload) => {
    await commit('removeRegion', payload)
    commit('setChanged', true)
}

const toggleGoal = ({ commit, state }, goal) => {
    const index = state.general.sustainable_development_goals.indexOf(goal)

    if (index > -1) commit('removeGoal', index)
    else commit('addGoal', goal)

    commit('setChanged', true)
}

const toggleListeningModel = ({ commit, state }, model) => {
    // This is the program's listening models, not the global list of listening models.
    const index = state.general.listening_models.indexOf(model)

    if (index > -1) commit('removeListeningModel', index)
    else commit('addListeningModel', model)

    commit('setChanged', true)
}

const setDeploymentCount = async ({ commit }, payload) => {
    await commit('setDeploymentsCount', payload)
    commit('setChanged', true)
}

const setDeploymentLength = async ({ commit }, payload) => {
    await commit('setDeploymentsLength', payload)
    commit('setChanged', true)
}

const setDeploymentsFirstDate = async ({ commit }, payload) => {
    await commit('setDeploymentsFirst', payload)
    commit('setChanged', true)
}

const setFeedbackFrequency = async ({ commit }, payload) => {
    await commit('setFeedbackFrequently', payload)
    commit('setChanged', true)
}

const setLanguages = async ({ commit }, payload) => {
    await commit('setLanguages', payload)
    commit('setChanged', true)
}

const deleteLanguage = async ({ commit }, language) => {
    await commit('deleteLanguage', language)
    commit('setChanged', true)
}

const setDirectBeneficiariesLabel = ({ commit }, payload) => {
    commit('setDirectBeneficiariesLabel', payload)
    commit('setChanged', true)
}

const setDirectBeneficiariesAdditionalLabel = ({ commit }, payload) => {
    commit('setDirectBeneficiariesAdditionalLabel', payload)
    commit('setChanged', true)
}

const addDirectBeneficiariesAdditionalLabel = ({ commit }) => {
    const value = 'New additional field'
    const key = `field_${Math.random().toString(36).substring(7)}`

    commit('setDirectBeneficiariesAdditionalLabel', { value, key })
    commit('setChanged', true)
}

const deleteDirectBeneficiariesAdditionalLabel = ({ commit }, labelKey) => {
    commit('deleteDirectBeneficiariesAdditionalLabel', labelKey)
    commit('setChanged', true)
}

//endregion

//region Deployment functions
//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
const setDeployments = async ({commit}, payload) => {
    commit('setDeployments', payload);
    commit('setChanged', true);
}

// Adds a deployment to the end of the list
const addDeployment = async ({commit}, payload) => {
    commit('addDeployment', payload);
    commit('setChanged', true);
}

const removeDeployment = async ({commit}, payload) => {
    commit('removeDeployment', payload);
    commit('setChanged', true);
}

const setDeploymentStartdate = async ({commit}, payload) => {
    commit('setDeploymentStartdate', payload);
    commit('setChanged', true);
}

const setDeploymentEnddate = async ({commit}, payload) => {
    commit('setDeploymentEnddate', payload);
    commit('setChanged', true);
}

const setDeploymentName = async ({commit}, payload) => {
    commit('setDeploymentName', payload);
    commit('setChanged', true);
}
//endregion

//region Playlist functions
// Set the playlists for the given deployment.
//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
const setPlaylists = async ({commit}, payload) => {
    commit('setPlaylists', payload)
    commit('setChanged', true)
}

const addPlaylist = async ({commit}, payload) => {
    commit('addPlaylist', payload);
    commit('setChanged', true);
}

const removePlaylist = async ({commit}, payload) => {
    commit('removePlaylist', payload);
    commit('setChanged', true);
}

// Edit playlists.
const setPlaylistTitle = ({commit}, payload) => {
    commit('setPlaylistTitle', payload)
    commit('setChanged', true)
}

const setPlaylistAudience = ({commit}, payload) => {
    commit('setPlaylistAudience', payload)
    commit('setChanged', true)
}
//endregion

//region Message functions
//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
const setMessages = ({commit}, payload) => {
    commit('setMessages', payload)
    commit('setChanged', true)
}

const addMessage = async ({commit}, payload) => {
    commit('addMessage', payload);
    commit('setChanged', true)
}

const removeMessage = async ({commit}, payload) => {
    commit('removeMessage', payload);
    commit('setChanged', true);
}

const setMessageTitle = ({commit}, payload) => {
    commit('setMessageTitle', payload)
    commit('setChanged', true)
    // Interesting bit of code below to find a list of duplicate titles.
    // const titles = state.playlists[playlistIndex].messages.map(message => message.title)
    // const duplicates = titles.filter((theSet => aString => theSet.has(aString) || !theSet.add(aString))(new Set))
    // commit('setDuplicateMessages', duplicates)
}

const addMessageLanguage = ({commit}, payload) => {
    commit('addMessageLanguage', payload)
    commit('setChanged', true)
}

const removeMessageLanguage = ({commit}, payload) => {
    commit('removeMessageLanguage', payload)
    commit('setChanged', true)
}

const setMessageCategory = ({commit}, payload) => {
    commit('setMessageCategory', payload)
    commit('setChanged', true)
}

const setMessageAudience = ({commit}, payload) => {
    commit('setMessageAudience', payload);
    commit('setChanged', true);
};

const setMessageVariant = ({commit}, payload) => {
    commit('setMessageVariant', payload)
    commit('setChanged', true)
}

const setMessageFormat = ({commit}, payload) => {
    commit('setMessageFormat', payload)
    commit('setChanged', true)
}

const setMessageSDGGoal = ({commit}, payload) => {
    commit('setMessageSDGGoal', payload)
    commit('setMessageSDGTarget', {...payload, target: null})
    commit('setChanged', true)
}

const setMessageSDGTarget = ({commit}, payload) => {
    commit('setMessageSDGTarget', payload)
    commit('setChanged', true)
}

const setMessageKeyPoints = ({commit}, payload) => {
    commit('setMessageKeyPoints', payload)
    commit('setChanged', true)
}
//endregion

//region Recipient functions

const updateRecipient = ({commit, state}, payload) => {
    let {recipient} = payload;
    if (!recipient.recipientid) {
        // Create a temporary recipientid for local use prior ot the assignment of a proper recipientid by the server.
        let tempId = 1;
        state.recipients.forEach(recipient => {
            let match = recipient.recipientid.match(TEMP_RECIPIENT_RE);
            if (match) {
                let numericId = Number(match[1]);
                if (numericId >= tempId) {
                    tempId = numericId + 1;
                }
            }
        })
        recipient.recipientid = TEMP_RECIPIENT_PREFIX + tempId;
    }
    commit('setChanged', true);
    commit('updateRecipient', {recipient});
};


//endregion

export default {
    ensureSpec,
    fetchSpec,
    updateSpec,

    getExportLink,
    uploadSpec,
    approveSpec,
    publishSpec,

    ///////////////////////////////////////////////////////////////////
    //region General
    setProgramName,
    setCountry,
    addRegion,
    removeRegion,
    toggleGoal,
    toggleListeningModel,
    setDeploymentCount,
    setDeploymentLength,
    setDeploymentsFirstDate,
    setFeedbackFrequency,
    setLanguages,
    deleteLanguage,

    setDirectBeneficiariesLabel,
    setDirectBeneficiariesAdditionalLabel,
    addDirectBeneficiariesAdditionalLabel,
    deleteDirectBeneficiariesAdditionalLabel,
    //endregion

    ///////////////////////////////////////////////////////////////////
    //region Deployments
    setDeployments,             // used to re-arrange deployments
    addDeployment,
    removeDeployment,           // only non-deployed deployments

    setDeploymentStartdate,
    setDeploymentEnddate,
    setDeploymentName,
    //endregion

    ///////////////////////////////////////////////////////////////////
    //region Playlists
    setPlaylists,
    addPlaylist,
    removePlaylist,

    setPlaylistTitle,
    setPlaylistAudience,
    //endregion

    ///////////////////////////////////////////////////////////////////
    //region Messages
    setMessages,
    addMessage,
    removeMessage,
    setMessageTitle,
    addMessageLanguage,
    removeMessageLanguage,
    setMessageCategory,
    setMessageAudience,
    setMessageVariant,
    setMessageFormat,
    setMessageSDGGoal,
    setMessageSDGTarget,
    setMessageKeyPoints,
    //endregion

    ///////////////////////////////////////////////////////////////////
    //region Recipients
    updateRecipient,
    //endregion
}
