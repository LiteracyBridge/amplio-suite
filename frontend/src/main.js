import { createApp } from "vue";
import PortalVue from "portal-vue";

import App from "./App.vue";
import CognitoAuth from "./cognito/cognito";
import config from "./cognito/config";
import router from "./router";
import { useAccountStore } from "@/store/account";
// import Vuex from "vuex";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";

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

const pinia = createPinia();
const app = createApp(App);
// app.use(Vuex)
app.use(PortalVue)
    .use(fas)
    .use(pinia);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("default-layout", Default);
app.component("login-layout", Login);

app.config.productionTip = false;

if (process.env.NODE_ENV === "development") {
    const VueAxe = import.meta.glob("vue-axe").default;
    app.use(VueAxe);
}

app.use(router);
// .use(store)
// .use(createPinia());
// .use(CognitoAuth, config);

app.mount("#app");
// new Vue({
//     router,
//     store,
//     cognitoAuth,
//     render: h => h(App)
// }).$mount("#app");
