// import {
//     getModalDefaultState,
//     getNotificationDefaultState
// } from './index'

// const closeModal = (state) => {
//     Object.assign(state, {modal: getModalDefaultState()})
// }

// const openModal = (state) => {
//     state.modal.isOpen = true
// }

// const setModalTitle = (state, text) => {
//     state.modal.title = text
// }

// const setModalWidth = (state, width) => {
//     state.modal.width = width;
// };

// const closeNotification = (state) => {
//     Object.assign(state, {notification: getNotificationDefaultState()})
// }

// const openNotification = (state) => {
//     state.notification.isOpen = true
// }

// const setNotificationNotice = (state, payload) => {
//     state.notification.text = payload.text
//     state.notification.type = 'notice'
// }

// const setNotificationAlert = (state, payload) => {
//     state.notification.text = payload.text
//     state.notification.type = 'alert'
// }

// const setNotification = (state, payload) => {
//     state.notification.text = payload.text
//     state.notification.type = payload.type
// }

// export default {
//     openModal,
//     closeModal,
//     setModalTitle,
//     setModalWidth,

//     openNotification,
//     closeNotification,
//     setNotificationNotice,
//     setNotificationAlert,
//     setNotification
// }
