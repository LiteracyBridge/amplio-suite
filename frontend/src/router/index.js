// import Vue from 'vue'
import { createRouter, createWebHistory } from "vue-router";
import multiguard from "vue-router-multiguard";

import { useAccountStore } from "@/store/account";
import Home from "@/views/Home.vue";
import Login from "@/views/SignIn.vue";

// Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        redirect: { path: "/login" }
    },
    {
        path: "/login",
        component: Login,
        beforeEnter: checkAuth,
        meta: {
            layout: "login"
        }
    },
    {
        path: "/register",
        component: () =>
            import(/* webpackChunkName: "sign-up" */ "../views/SignUp.vue"),
        beforeEnter: checkAuth,
        meta: {
            layout: "login"
        }
    },
    {
        path: "/password-reset",
        component: () =>
            import(
                /* webpackChunkName: "password-reset" */ "../views/PasswordReset.vue"
            ),
        beforeEnter: checkAuth,
        meta: {
            layout: "login"
        }
    },
    {
        path: "/programs",
        component: () =>
            import(
                /* webpackChunkName: "programs-index" */ "../views/ProgramsIndex.vue"
            ),
        beforeEnter: requireAuth
    },
    {
        path: "/programs/:programId",
        props: true,
        component: Home,
        beforeEnter: requireAuth
    },
    {
        path: "/programs/:programId/roadmap",
        name: "roadmap",
        props: true,
        component: () =>
            import(/* webpackChunkName: "roadmap" */ "../views/Roadmap.vue"),
        beforeEnter: requireAuth
    },
    {
        path: "/programs/:programId/tableau",
        name: "tableau",
        props: true,
        component: () =>
            import(/* webpackChunkName: "tableau" */ "../views/Tableau.vue"),
        beforeEnter: requireAuth
    },
    {
        path: "/programs/:programId/wizard",
        redirect: { name: "step-program-name" },
        props: true,
        component: () =>
            import(
                /* webpackChunkName: "wizard" */ "../views/Wizard/Index.vue"
            ),
        beforeEnter: multiguard([requireAuth, stepIsCompleted]),
        children: [
            {
                path: "step-1",
                name: "step-program-name",
                props: { step: 1 },
                component: () =>
                    import(
                        /* webpackChunkName: "step-program-name" */ "../views/Wizard/ProgramName.vue"
                    )
            },
            {
                path: "step-2",
                name: "step-geo",
                props: { step: 2 },
                component: () =>
                    import(
                        /* webpackChunkName: "step-geo" */ "../views/Wizard/Geo.vue"
                    )
            },
            {
                path: "step-3",
                name: "step-sdg",
                props: { step: 3 },
                component: () =>
                    import(
                        /* webpackChunkName: "step-sdg" */ "../views/Wizard/SDG.vue"
                    )
            },
            {
                path: "step-4",
                name: "step-listening-model",
                props: { step: 4 },
                component: () =>
                    import(
                        /* webpackChunkName: "step-listening-model" */ "../views/Wizard/ListeningModel.vue"
                    )
            },
            {
                path: "step-5",
                name: "step-deployments",
                props: { step: 5 },
                component: () =>
                    import(
                        /* webpackChunkName: "step-deployments" */ "../views/Wizard/Deployments.vue"
                    )
            },
            {
                path: "step-6",
                name: "step-feedback",
                props: { step: 6 },
                component: () =>
                    import(
                        /* webpackChunkName: "step-feedback" */ "../views/Wizard/Feedback.vue"
                    )
            },
            {
                path: "step-7",
                name: "step-languages",
                props: { step: 7 },
                component: () =>
                    import(
                        /* webpackChunkName: "step-languages" */ "../views/Wizard/Languages.vue"
                    )
            },
            {
                path: "step-8",
                name: "step-final",
                props: { step: 8 },
                component: () =>
                    import(
                        /* webpackChunkName: "step-final" */ "../views/Wizard/Final.vue"
                    )
            }
        ]
    },
    {
        path: "/programs/:programId/monitor",
        redirect: { path: "/programs/:programId/monitor/StatusByDepl" },
        props: true,
        component: () => import("../views/Monitor/Index.vue"),
        beforeEnter: requireAuth,
        children: [
            {
                path: "StatusByDepl",
                props: true,
                component: () => import("../views/Monitor/StatusByDepl.vue")
            },
            {
                path: "StatusByTb",
                props: true,
                component: () => import("../views/Monitor/StatusByTb.vue")
            }
        ]
    },
    {
        path: "/programs/:programId/settings",
        redirect: { path: "/programs/:programId/settings/general" },
        props: true,
        component: () =>
            import(
                /* webpackChunkName: "program" */ "../views/Program/Index.vue"
            ),
        beforeEnter: requireAuth,
        children: [
            {
                path: "general",
                props: true,
                component: () =>
                    import(
                        /* webpackChunkName: "general" */ "../views/Program/General.vue"
                    )
            },
            {
                path: "content2",
                props: true,
                component: () =>
                    import(
                        /* webpackChunkName: "content2" */ "../views/Program/Content2.vue"
                    )
            },
            {
                path: "recipients",
                props: true,
                component: () =>
                    import(
                        /* webpackChunkName: "recipients" */ "../views/Program/Recipients.vue"
                    )
            },
            {
                path: "importExport",
                props: true,
                component: () =>
                    import(
                        /* webpackChunkName: "recipients" */ "../views/Program/ImportExport.vue"
                    )
            },
            {
                path: "ufImportExport",
                props: true,
                component: () =>
                    import(
                        /* webpackChunkName: "recipients" */ "../views/Program/UfImportExport.vue"
                    )
            }
        ]
    },
    {
        path: "/kb",
        component: () => import("../views/kb.vue"),
        beforeEnter: requireAuth
    },
    {
        path: "/download",
        component: () =>
            import(/* webpackChunkName: "download" */ "../views/Download.vue"),
        beforeEnter: requireAuth
    }
];

const router = new createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

function stepIsCompleted(to, from, next) {
    // Check if the step is completed
    if (!to.path.includes("wizard")) next();
    else {
        // const s = to.path.split('/')
        // const nextStep = +s[s.length -1].split('-')[1]
        const nextStep = to.matched[1].props.default.step;
        const isComplete = store.state.wizard.completedSteps.includes(
            nextStep - 1
        );

        if (isComplete) next();
        else next(false);
    }
}

function requireAuth(to, from, next) {
    store
        .dispatch("account/requireAuth")
        .then(() => next())
        .catch(() => {
            return next({
                path: "/login",
                query: { redirect: to.fullPath }
            });
        });
}

function checkAuth(to, from, next) {
    store
        .dispatch("account/requireAuth")
        .then(() => next({ path: "/programs" }))
        .catch(() => {
            return next();
        });
}

export default router;
