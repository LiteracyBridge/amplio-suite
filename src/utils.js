import store from '@/store'

export const fetchData = async (programCode) => {
  await store.dispatch('program/fetchProgram', programCode)
  await store.dispatch('deployments/fetchDeployments')
  await store.dispatch('content/fetchContent')
}
