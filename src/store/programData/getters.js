const httpStatus = (state) => {
  return {
    general: state.general.status,
    deployments: state.deployments.status,
    content: state.content.status
  }
}

const tabStatus = (state) => {
  return {
    general: state.general.dirty,
    deployments: state.deployments.dirty,
    content: state.content.dirty
  }
}

export default {
  httpStatus,
  tabStatus
}
