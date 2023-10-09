import { createApp, Vue } from "vue";
import PortalVue from "portal-vue";

import App from "./App.vue";
import cognitoAuth from "./cognito";
import router from "./router";
import store from "./store";

// Polyfill :focus-visible
// Remove this to restore normal focus behaviour.
import "focus-visible";

// Custom plugins
import "./plugins/fontawesome";

// Style
import "@/assets/css/tailwind.scss";
import "@/assets/css/suite.scss";
import "vue-multiselect/dist/vue-multiselect.min.css";

// Layouts
import Default from "@/layouts/Default.vue";
import Login from "@/layouts/Login.vue";

const app = createApp(App);
app.use(PortalVue);
Vue.component("default-layout", Default);
app.component("login-layout", Login);

app.config.productionTip = false;

if (process.env.NODE_ENV === "development") {
    const VueAxe = require("vue-axe").default;
    app.use(VueAxe);
}

app.use(router)
    .use(store)
    .use(cognitoAuth);

app.mount("#app");
// new Vue({
//     router,
//     store,
//     cognitoAuth,
//     render: h => h(App)
// }).$mount("#app");
