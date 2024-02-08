import { notification } from "ant-design-vue";
import { defineStore } from "pinia";
// import actions from "./actions";
// import mutations from "./mutations";
// import getters from './getters'

export const getModalDefaultState = () => ({
  isOpen: false,
  title: "",
  width: 0
});

export const getNotificationDefaultState = () => ({
  isOpen: false,
  type: "",
  text: ""
});

export const useUIStore = defineStore("ui", {
  state: () => ({
    modal: getModalDefaultState(),
    notification: getNotificationDefaultState()
  }),
  actions: {
    closeModal() {
      Object.assign(this.$state, { modal: getModalDefaultState() });
    },

    openModal() {
      this.modal.isOpen = true;
    },

    setModalTitle(text: string) {
      this.modal.title = text;
    },

    setModalWidth(width: number) {
      this.modal.width = width;
    },

    closeNotification() {
      Object.assign(this.$state, {
        notification: getNotificationDefaultState()
      });
    },

    openNotification() {
      if (this.notification.type == "notice") {
        notification.info({
          message: this.notification.text
        });
      } else {
        notification.warning({
          message: this.notification.text
        });
      }
      // this.notification.isOpen = true;
    },

    setNotificationNotice(payload: string) {
      this.notification.text = payload;
      this.notification.type = "notice";
    },

    setNotificationAlert(text: string) {
      this.notification.text = text;
      this.notification.type = "alert";
    },

    // setNotification(payload: { text: any; type: any }) {
    //     this.notification.text = payload.text;
    //     this.notification.type = payload.type;
    // },
    setModal(text: string, width?: any) {
      this.openModal();
      this.setModalTitle(text);

      if (width !== undefined) {
        this.setModalWidth(width);
      }
    },

    setNotification(payload: { type?: any; text?: string }) {
      this.openNotification();
      // commit('openNotification')

      if (payload.type === "notice") {
        this.setNotificationNotice(payload.text);
      } else if (payload.type === "alert") {
        this.setNotificationAlert(payload.text);
      }
    }
  }
});
