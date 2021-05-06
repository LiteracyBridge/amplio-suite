const settingIsDirty = (state, getters, rootState) => {
  return [
    rootState.program.dirty,
    rootState.programData.dirty,
    rootState.deployments.dirty,
    rootState.content.dirty,
  ].some(Boolean)
}

export default {
  settingIsDirty,
}
