// import Vue from 'vue'
import { createRouter, createWebHistory } from "vue-router";
// import { type RouteRecordRaw } from "vue-router";
import multiguard from "vue-router-multiguard";

import { useAccountStore } from "@/store/account";
import { useWizardStore } from "@/store/wizard";
import Home from "@/views/Home.vue";
import SignIn from "@/views/SignIn.vue";
import { Auth } from "aws-amplify";
import { Hub } from "@aws-amplify/core";

const routes: any = [
  {
    path: "/",
    redirect: { path: "/login" }
  },
  {
    path: "/login",
    component: SignIn,
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
    meta: {
      layout: "default"
    },
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
    name: "home",
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
          )
      },
      {
        path: "step-2",
        name: "step-geo",
        props: { step: 2 },
        component: () =>
          import(/* webpackChunkName: "step-geo" */ "../views/Wizard/Geo.vue")
      },
      {
        path: "step-3",
        name: "step-sdg",
        props: { step: 3 },
        component: () =>
          import(/* webpackChunkName: "step-sdg" */ "../views/Wizard/SDG.vue")
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
    redirect: (to: any) => {
      return {
        name: "monitor:status-by-deployment",
        params: to.params
      };
    },
    props: true,
    name: "monitor",
    component: () => import("../views/Monitor/Index.vue"),
    beforeEnter: requireAuth,
    meta: {
      layout: "default"
    },
    children: [
      {
        name: "monitor:status-by-deployment",
        path: "StatusByDepl",
        props: true,
        component: () => import("../views/Monitor/StatusByDepl.vue")
      },
      {
        path: "StatusByTb",
        name: "monitor:status-by-tb",
        props: true,
        component: () => import("../views/Monitor/StatusByTb.vue")
      }
    ]
  },
  {
    path: "/programs/:programId/settings",
    name: "programspec.settings",
    redirect: (to: any) => {
      // the function receives the target route as the argument
      // we return a redirect path/location here.
      return {
        name: "programspec.index",
        params: to.params
      };
    }
  },
  {
    path: "/programs/:programId/settings",
    name: "programspec.index",
    // redirect: { path: "/programs/:programId/settings/general" },
    props: true,
    component: () =>
      import(/* webpackChunkName: "program" */ "../views/Program/Index.vue"),
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
  },
  {
    path: "/users",
    name: "users",
    component: () =>
      import(/* webpackChunkName: "download" */ "../views/Users/Index.vue"),
    beforeEnter: requireAuth
  },
  {
    path: "/users/manage-roles",
    name: "users.manage_roles",
    component: () =>
      import(
        /* webpackChunkName: "download" */ "../views/Users/ManageRoles.vue"
      )
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
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
        query: { redirect: to.fullPath }
      });
    });
}

function checkAuth(to: any, from: any, next: any) {
  return useAccountStore()
    .requireAuth()
    .then(() => {
      return next({ path: "/programs" });
    })
    .catch(() => {
      return next();
    });
}

async function getUser() {
  return Auth.currentAuthenticatedUser()
    .then(async data => {
      console.log(data);
      if (data && data.signInUserSession) {
        useAccountStore().user = {
          email: data.attributes.email,
          name: data.attributes.email.split("@")[0],
          token: data.signInUserSession.idToken.jwtToken,
          img: "",
          organisation_id: undefined
        };

        // TODO: Verify user from server
        return { authorized: true };
      }

      // AppStore().is_loading = false;
      return { authorized: false };
    })
    .catch(err => {
      console.error(err);
      // AppStore().is_loading = false;
      // useUserStore().setUser();
      return { authorized: false };
    });
}

Hub.listen("auth", async data => {
  let user = null;
  // disabledConsole();

  console.log(data.payload.event);
  switch (data.payload.event) {
    case "signIn":
      user = await getUser();
      if (user?.authorized == true) {
        router.push({ path: "/programs" });
      } else {
        router.push({ path: "/login" });
      }
      // router.push({ path: "/" });
      break;
    case "signUp":
      console.log(data);
      // TODO: add a/c to sbc
      user = await getUser();
      console.log(user);
      if (user?.authorized == true) {
        router.push({ path: "/programs" });
      } else {
        router.push({ path: "/login" });
      }
      // ApiRequest.post("users/", {
      //   email: _user.username,
      //   name: _user.name,
      // }).then((resp) => {
      //   // useUserStore().email = resp[0].email;
      //   // useUserStore().name = resp[0].name;
      //   // Auth.currentAuthenticatedUser().then((_data) => {
      //   //   useUserStore().token = _data.signInUserSession.accessToken.jwtToken;
      //   // });

      //   // useUserStore().setUser(resp[0]);
      //   console.log("account created");
      //   console.warn(resp);
      // });
      // console.log("user signed up");
      break;
    case "signOut":
      // user = null;
      // useUserStore().setUser();
      router.push({ path: "/login" });
      window.location.reload();
      break;
    case "signIn_failure":
      console.log("user sign in failed");
      break;
    case "configured":
      user = await getUser();
      console.log(user);
      if (user?.authorized == true) {
        router.push({ path: "/programs" });
      } else {
        router.push({ path: "/login" });
      }
      break;
    //   case "confirmSignUp":
    //     console.log(data.payload);
    //     getUser().then(async (user) => {
    //       console.log("Existing user: ", user);
    //       console.log(user);
    //       if (user?.authorized == true) {
    //         await AppStore().downloadObjects();

    //         router.push({ path: "/" });
    //       } else {
    //         router.push({ path: "/login" });
    //       }
    //     });
    //     console.log("the Auth module is configured");
  }
});

export default router;
