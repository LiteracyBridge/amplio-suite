import Vue from 'vue'
import VueRouter from 'vue-router'
import multiguard from 'vue-router-multiguard'

import store from '@/store'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import cognitoAuth from '@/cognito'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { path: '/login' }
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: checkAuth,
    meta: {
      layout: 'login'
    },
    props: (route) => ({ notify: route.query.notify })
  },
  {
    path: '/password_reset',
    component: () => import(/* webpackChunkName: "password_reset" */ '../views/PasswordReset.vue'),
    beforeEnter: checkAuth,
    meta: {
      layout: 'login'
    },
  },
  {
    path: '/programs',
    component: () => import(/* webpackChunkName: "programs" */ '../views/Programs.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/programs/:id',
    component: Home,
    beforeEnter: multiguard([requireAuth, fetchAllPrograms])
  },
  {
    path: '/programs/:id/wizard',
    redirect: { name: 'Step-1' },
    component: () => import(/* webpackChunkName: "wizard" */ '../views/Wizard/Index.vue'),
    beforeEnter: multiguard([requireAuth, fetchAllPrograms, stepIsCompleted]),
    children: [
      {
        path: 'step-1',
        name: 'Step-1',
        component: () => import(/* webpackChunkName: "setup-1" */ '../views/Wizard/Step1.vue')
      },
      {
        path: 'step-2',
        name: 'Step-2',
        component: () => import(/* webpackChunkName: "setup-2" */ '../views/Wizard/Step2.vue')
      },
      {
        path: 'step-3',
        name: 'Step-3',
        component: () => import(/* webpackChunkName: "setup-3" */ '../views/Wizard/Step3.vue')
      },
      {
        path: 'step-4',
        name: 'Step-4',
        component: () => import(/* webpackChunkName: "setup-4" */ '../views/Wizard/Step4.vue')
      },
      {
        path: 'step-5',
        name: 'Step-5',
        component: () => import(/* webpackChunkName: "setup-5" */ '../views/Wizard/Step5.vue')
      },
      {
        path: 'step-6',
        name: 'Step-6',
        component: () => import(/* webpackChunkName: "setup-6" */ '../views/Wizard/Step6.vue')
      },
      {
        path: 'step-7',
        name: 'Step-7',
        component: () => import(/* webpackChunkName: "setup-7" */ '../views/Wizard/Step7.vue')
      }
    ]
  },
  {
    path: '/programs/:id/settings',
    redirect: { path: '/programs/:id/settings/general' },
    component: () => import(/* webpackChunkName: "program" */ '../views/Program/Index.vue'),
    beforeEnter: multiguard([requireAuth, fetchAllPrograms]),
    children: [
      {
        path: 'general',
        component: () => import(/* webpackChunkName: "general" */ '../views/Program/General.vue')
      },
      {
        path: 'deployments',
        component: () => import(/* webpackChunkName: "deployments" */ '../views/Program/Deployments.vue')
      },
      {
        path: 'content',
        component: () => import(/* webpackChunkName: "content" */ '../views/Program/Content.vue')
      }
    ]
  },
  {
    path: '/download',
    component: () => import(/* webpackChunkName: "download" */ '../views/Download.vue'),
    beforeEnter: requireAuth
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function fetchAllPrograms (to, from, next) {
  const { allPrograms } = store.state.programIndex

  if (allPrograms.length === 0) next('/programs')
  else next()
}

function stepIsCompleted (to, from, next) {
  // Check if the step is completed

  if (!to.path.includes('wizard')) next()
  else {
    const s = to.path.split('/')
    const nextStep = +s[s.length -1].split('-')[1]
    const isComplete = store.state.wizard.completedSteps.includes(nextStep - 1)

    if (isComplete) next()
    else next(false)
  }
}

function requireAuth (to, from, next) {
  cognitoAuth.isAuthenticated((tokenOrError, loggedIn) => {
    if (!loggedIn) {
      if (tokenOrError) return next()
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  })
}

function checkAuth(to, from, next) {
  cognitoAuth.isAuthenticated((tokenOrError, loggedIn) => {
    if (loggedIn) {
      next({path: '/'})
    } else {
      next()
    }
  })
}

export default router
