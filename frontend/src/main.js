import { createApp, h, Fragment } from "vue";
import PortalVue from "portal-vue";

import App from "./App.vue";
import CognitoAuth from "./cognito";
import config from "./cognito/config";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import { Amplify } from 'aws-amplify';
import awsconfig from "./aws-exports";

// Polyfill :focus-visible
// Remove this to restore normal focus behaviour.
import "focus-visible";

// Custom plugins
import "./plugins/fontawesome";

// Style
import "@/assets/css/tailwind.scss";
import "@/assets/css/suite.scss";
import "vue-multiselect/dist/vue-multiselect.css";

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
    faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

library.add(
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
    faQuestionCircle
);

const pinia = createPinia();
let app = createApp(App);

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

app.config.productionTip = false;
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("default-layout", Default);
app.component("login-layout", Login);

app.use(router)
    // .use(store)
    // .use(createPinia());
    .use(CognitoAuth, config);

Amplify.configure(awsconfig);

app.mount("#app");
// new Vue({
//     router,
//     store,
//     cognitoAuth,
//     render: h => h(App)
// }).$mount("#app");
