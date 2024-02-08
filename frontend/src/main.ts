import { createApp } from "vue";
import PortalVue from "portal-vue";

import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

// Custom plugins
import "./plugins/fontawesome";
import "vue-multiselect/dist/vue-multiselect.css";

// Style
import "@/assets/css/tailwind.scss";
import "@/assets/css/suite.scss";

// Layouts
import Default from "@/layouts/Default.vue";
import Login from "@/layouts/Login.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUserSecret,
  faTimes,
  faSpinner,
  faExclamationCircle,
  faChevronDown,
  faChevronUp,
  faUserCircle,
  faGripLines,
  faCaretRight,
  faCalendarAlt,
  faSearch,
  faEdit,
  faCopy,
  faTrashAlt,
  faQuestionCircle,
  faCheck,
  faCaretDown
} from "@fortawesome/free-solid-svg-icons";
import { setGlobalOptions } from "vue-request";

library.add(
  //@ts-ignore
  faUserSecret,
  faTimes,
  faSpinner,
  faExclamationCircle,
  faChevronDown,
  faChevronUp,
  faUserCircle,
  faGripLines,
  faCaretRight,
  faCalendarAlt,
  faSearch,
  faEdit,
  faCopy,
  faTrashAlt,
  faQuestionCircle,
  faCheck,
  faCaretDown
);

const pinia = createPinia();
const app = createApp(App);

// Vue Request
setGlobalOptions({
  cacheTime: 10 * 60 * 1000 // 10 minutes
});

// if (process.env.NODE_ENV === "development") {
//     const VueAxe = import("vue-axe/dist/vue-axe.min");
//     app = createApp({
//         render: () => h(Fragment, [h(App), h(VueAxe.VueAxePopup)])
//     });
//     app.use(VueAxe.default);
// } else {
//     app = createApp(App);
// }

app.use(PortalVue).use(pinia);

// app.config.productionTip = false;
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("default-layout", Default);
app.component("login-layout", Login);

app.use(router);

if (import.meta.env.DEV) {
  // Change AWS config to use test pool
  console.log("Using local cognito server");
  Amplify.configure({
    ...awsconfig,
    aws_user_pools_web_client_id: import.meta.env
      .VITE_APP_AWS_USER_POOLS_CLIENT_ID,
    aws_user_pools_id: import.meta.env.VITE_APP_AWS_USER_POOLS_ID
  });
} else {
  Amplify.configure(awsconfig);
}

app.mount("#app");
