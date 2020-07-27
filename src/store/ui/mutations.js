import {
  getModalDefaultState,
  getNotificationDefaultState
} from './index'

const closeModal = (state) => {
  Object.assign(state, { modal: getModalDefaultState() })
}

const openModal = (state) => {
  state.modal.isOpen = true
}

const setModalTitle = (state, text) => {
  state.modal.title = text
}

const closeNotification = (state) => {
  Object.assign(state, { notification:   getNotificationDefaultState() })
}

const openNotification = (state) => {
  state.notification.isOpen = true
}

const setNotificationNotice = (state, payload) => {
  state.notification.text = payload.text
  state.notification.type = 'notice'
}

const setNotificationAlert = (state, payload) => {
  state.notification.text = payload.text
  state.notification.type = 'alert'
}

export default {
  openModal,
  closeModal,
  setModalTitle,

  openNotification,
  closeNotification,
  setNotificationNotice,
  setNotificationAlert,
}
