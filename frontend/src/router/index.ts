import { createRouter, createWebHistory } from "vue-router";
import multiguard from "vue-router-multiguard";

import { useAccountStore } from "@/store/account";
import { useWizardStore } from "@/store/wizard";
import Home from "@/views/Home.vue";
import SignIn from "@/views/SignIn.vue";
import { Auth } from "aws-amplify";
import { Hub } from "@aws-amplify/core";
import { notification } from "ant-design-vue";

const routes: any = [
  {
    path: "/",
    redirect: { path: "/login" },
  },
  {
    path: "/login",
    component: SignIn,
    beforeEnter: checkAuth,
    meta: {
      layout: "login",
    },
  },
  {
    path: "/dashboard",
    component: () =>
      import(/* webpackChunkName: "sign-up" */ "../views/Dashboard.vue"),
  },
  {
    path: "/password-reset",
    component: () =>
      import(
        /* webpackChunkName: "password-reset" */ "../views/PasswordReset.vue"
      ),
    beforeEnter: checkAuth,
    meta: {
      layout: "login",
    },
  },
  {
    path: "/programs/:programId/roadmap",
    name: "roadmap",
    props: true,
    component: () =>
      import(/* webpackChunkName: "roadmap" */ "../views/Roadmap.vue"),
    beforeEnter: requireAuth,
  },

  {
    path: "/programs/:programId/wizard",
    redirect: { name: "step-program-name" },
    props: true,
    component: () =>
      import(/* webpackChunkName: "wizard" */ "../views/Wizard/Index.vue"),
    beforeEnter: multiguard([requireAuth, stepIsCompleted]),
    children: [
      {
        path: "step-1",
        name: "step-program-name",
        props: { step: 1 },
        component: () =>
          import(
            /* webpackChunkName: "step-program-name" */ "../views/Wizard/ProgramName.vue"
          ),
      },
      {
        path: "step-2",
        name: "step-geo",
        props: { step: 2 },
        component: () =>
          import(/* webpackChunkName: "step-geo" */ "../views/Wizard/Geo.vue"),
      },
      {
        path: "step-3",
        name: "step-sdg",
        props: { step: 3 },
        component: () =>
          import(/* webpackChunkName: "step-sdg" */ "../views/Wizard/SDG.vue"),
      },
      {
        path: "step-4",
        name: "step-listening-model",
        props: { step: 4 },
        component: () =>
          import(
            /* webpackChunkName: "step-listening-model" */ "../views/Wizard/ListeningModel.vue"
          ),
      },
      {
        path: "step-5",
        name: "step-deployments",
        props: { step: 5 },
        component: () =>
          import(
            /* webpackChunkName: "step-deployments" */ "../views/Wizard/Deployments.vue"
          ),
      },
      {
        path: "step-6",
        name: "step-feedback",
        props: { step: 6 },
        component: () =>
          import(
            /* webpackChunkName: "step-feedback" */ "../views/Wizard/Feedback.vue"
          ),
      },
      {
        path: "step-7",
        name: "step-languages",
        props: { step: 7 },
        component: () =>
          import(
            /* webpackChunkName: "step-languages" */ "../views/Wizard/Languages.vue"
          ),
      },
      {
        path: "step-8",
        name: "step-final",
        props: { step: 8 },
        component: () =>
          import(
            /* webpackChunkName: "step-final" */ "../views/Wizard/Final.vue"
          ),
      },
    ],
  },
  {
    path: "/kb",
    component: () => import("../views/kb.vue"),
    beforeEnter: requireAuth,
  },
  {
    path: "/download",
    component: () =>
      import(/* webpackChunkName: "download" */ "../views/Download.vue"),
    beforeEnter: requireAuth,
  },
  // TB Analytics
  {
    path: "/tb-analytics",
    name: "tb_analytics",
    children: [
      {
        path: "installations",
        name: "tb_analytics.installations",
        component: () =>
          import("../views/TalkingBookAnalytics/Installation.vue"),
      },
      // Tableau
      {
        path: "tableau",
        name: "tb_analytics.tableau",
        component: () =>
          import(/* webpackChunkName: "tableau" */ "../views/TalkingBookAnalytics/Tableau.vue"),
      }
    ],
  },
  // User feedback
  {
    path: "/user-feedback",
    name: "user_feedback",
    children: [
      {
        path: "analyze",
        name: "user_feedback.analyze",
        component: () => import("../views/UserFeedback/Analysis/Index.vue"),
      },
      {
        path: "review",
        name: "user_feedback.review",
        component: () => import("../views/UserFeedback/Review.vue"),
      },
      {
        path: "surveys",
        name: "user_feedback.surveys",
        component: () =>
          import("../views/UserFeedback/SurveyBuilder/Index.vue"),
      },
      {
        path: "survey-builder",
        name: "user_feedback.survey-builder",
        component: () =>
          import("../views/UserFeedback/SurveyBuilder/SurveyBuilder.vue"),
      },
    ],
  },
  // Program spec
  {
    path: "/programs/spec",
    component: () => import("../views/Program/Index.vue"),
  },
  // Monitoring Center,
  {
    path: "/programs/monitor",
    name: "monitor",
    component: () => import("../views/Monitor/Index.vue"),
  },
  // Settings
  {
    path: "/admin",
    name: "admin",
    children: [
      {
        path: "users",
        name: "admin.users",
        component: () => import("../views/Admin/Users/Index.vue"),
      },
      {
        path: "roles",
        name: "admin.roles",
        component: () => import("../views/Admin/Users/ManageRoles.vue"),
      },
      {
        path: "programs",
        name: "admin.Programs",
        component: () => import("../views/Admin/Programs/Index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

function stepIsCompleted(to: any, from: any, next: any) {
  // Check if the step is completed
  if (!to.path.includes("wizard")) next();
  else {
    // const s = to.path.split('/')
    // const nextStep = +s[s.length -1].split('-')[1]
    const nextStep = to.matched[1].props.default.step;
    const isComplete = useWizardStore().completedSteps.includes(nextStep - 1);

    if (isComplete) next();
    else next(false);
  }
}

function requireAuth(to: any, from: any, next: any) {
  useAccountStore()
    .requireAuth()
    .then(() => {
      return next();
    })
    .catch(() => {
      return next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    });
}

function checkAuth(to: any, from: any, next: any) {
  return useAccountStore()
    .requireAuth()
    .then(() => {
      return next({ path: "/dashboard" });
    })
    .catch(() => {
      return next();
    });
}


async function getUser() {
  return Auth.currentAuthenticatedUser()
    .then(async (data) => {
      if (data && data.signInUserSession) {
        return await useAccountStore().fetchAccountInfo(
          data.signInUserSession!.idToken.jwtToken,
        ).then((_resp) =>
          router.push({ path: "/dashboard" })
        );
      }

      return useAccountStore().logout();
    })
    .catch((err) => {
      notification.error({ message: "Login failed", description: err.message });
      return useAccountStore().logout();
    });
}

Hub.listen("auth", async (data) => {
  switch (data.payload.event) {
    case "signIn":
    case "signUp":
    case "configured":
      await getUser();
      break;
    case "signOut":
      if (router.currentRoute.value.path === "/login") {
        window.location.reload();
      } else {
        router.push({ path: "/login" });
      }
      break;
    case "signIn_failure":
      console.log("user sign in failed");
      break;
  }
});

export default router;
