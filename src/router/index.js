import Vue from 'vue'
import VueRouter from 'vue-router'
import multiguard from 'vue-router-multiguard'

import store from '@/store'
import Home from '@/views/Home.vue'
import Login from '@/views/SignIn.vue'

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
    }
  },
  {
    path: '/register',
    component: () => import(/* webpackChunkName: "sign-up" */ '../views/SignUp.vue'),
    beforeEnter: checkAuth,
    meta: {
      layout: 'login'
    }
  },
  {
    path: '/password-reset',
    component: () => import(/* webpackChunkName: "password-reset" */ '../views/PasswordReset.vue'),
    beforeEnter: checkAuth,
    meta: {
      layout: 'login'
    },
  },
  {
    path: '/programs',
    component: () => import(/* webpackChunkName: "programs-index" */ '../views/ProgramsIndex.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/programs/:programCode',
    props: true,
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/programs/:programCode/roadmap',
    name: 'roadmap',
    props: true,
    component: () => import(/* webpackChunkName: "roadmap" */ '../views/Roadmap.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/programs/:programCode/wizard',
    redirect: { name: 'Step-1' },
    props: true,
    component: () => import(/* webpackChunkName: "wizard" */ '../views/Wizard/Index.vue'),
    beforeEnter: multiguard([requireAuth, stepIsCompleted]),
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
    path: '/programs/:programCode/settings',
    redirect: { path: '/programs/:programCode/settings/general' },
    props: true,
    component: () => import(/* webpackChunkName: "program" */ '../views/Program/Index.vue'),
    beforeEnter: requireAuth,
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
      },
      {
        path: 'recipients',
        component: () => import(/* webpackChunkName: "recipients" */ '../views/Program/Recipients.vue')
      },
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
  store.dispatch('account/requireAuth')
    .then(() => next())
    .catch(() => next({
      path: '/login',
      query: { redirect: to.fullPath }
    }))
}

function checkAuth(to, from, next) {
  store.dispatch('account/requireAuth')
    .then(() => next({ path: '/programs' }))
    .catch(() => next())
}

export default router
