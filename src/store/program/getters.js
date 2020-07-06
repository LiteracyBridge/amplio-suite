const deploymentsDates = (state) => {
  return state.deployments.data.map(deplo => {
    return deplo.date
  })
}

export default {
  deploymentsDates
}
