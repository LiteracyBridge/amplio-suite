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
    component: Home,
    beforeEnter: multiguard([requireAuth, selectOneProgram])
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
    path: '/setup',
    redirect: { name: 'Step-1' },
    component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Index.vue'),
    beforeEnter: multiguard([requireAuth, stepIsCompleted]),
    children: [
      {
        path: 'step-1',
        name: 'Step-1',
        component: () => import(/* webpackChunkName: "setup-1" */ '../views/Setup/Step1.vue')
      },
      {
        path: 'step-2',
        name: 'Step-2',
        component: () => import(/* webpackChunkName: "setup-2" */ '../views/Setup/Step2.vue')
      },
      {
        path: 'step-3',
        name: 'Step-3',
        component: () => import(/* webpackChunkName: "setup-3" */ '../views/Setup/Step3.vue')
      },
      {
        path: 'step-4',
        name: 'Step-4',
        component: () => import(/* webpackChunkName: "setup-4" */ '../views/Setup/Step4.vue')
      },
      {
        path: 'step-5',
        name: 'Step-5',
        component: () => import(/* webpackChunkName: "setup-5" */ '../views/Setup/Step5.vue')
      },
      {
        path: 'step-6',
        name: 'Step-6',
        component: () => import(/* webpackChunkName: "setup-6" */ '../views/Setup/Step6.vue')
      },
      {
        path: 'step-7',
        name: 'Step-7',
        component: () => import(/* webpackChunkName: "setup-7" */ '../views/Setup/Step7.vue')
      }
    ]
  },
  {
    path: '/programs',
    component: () => import(/* webpackChunkName: "programs" */ '../views/Programs.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/program',
    redirect: { path: '/program/general' },
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

function selectOneProgram (to, from, next) {
  const { selectedProgram, allPrograms } = store.state.program

  if (selectedProgram) next()
  else if (allPrograms.length > 1) next('/programs')
  // else next('/error') // The user dont have programs
}

function stepIsCompleted (to, from, next) {
  // Check if the step is completed
  const nextStep = +to.path.split('-')[1]
  const isComplete = store.state.wizard.completedSteps.includes(nextStep - 1)

  if (isComplete) next()
  else if (from.path === '/') next('/')
  else next(false)
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
