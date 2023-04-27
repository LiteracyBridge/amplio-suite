import actions from './actions'
import mutations from './mutations'
// import getters from './getters'

export const getModalDefaultState = () => ({
  isOpen: false,
  title: '',
})

export const getNotificationDefaultState = () => ({
  isOpen: false,
  type: '',
  text: '',
})

export default {
  namespaced: true,

  state: {
    modal: getModalDefaultState(),
    notification: getNotificationDefaultState()
  },

  mutations,
  actions,
  // getters
}
