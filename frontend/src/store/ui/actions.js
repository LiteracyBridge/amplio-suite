const closeModal = ({ commit }) => {
  commit('closeModal')
}

const setModal = ({ commit }, text) => {
  commit('openModal')
  commit('setModalTitle', text)
}

const closeNotification = ({ commit }) => {
  commit('closeNotification')
}

const setNotification = ({ commit }, payload) => {
  commit('openNotification')

  if (payload.type === 'notice') commit('setNotificationNotice', payload)
  else if (payload.type === 'alert') commit('setNotificationAlert', payload)
}

export default {
  setModal,
  closeModal,

  setNotification,
  closeNotification,
}
