import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Init.vue'),
    children: [
      {
        path: 'step-1',
        name: 'Step-1',
        component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Step1.vue')
      },
      {
        path: 'step-2',
        name: 'Step-2',
        component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Step2.vue')
      },
      {
        path: 'step-3',
        name: 'Step-3',
        component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Step3.vue')
      },
      {
        path: 'step-4',
        name: 'Step-4',
        component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Step4.vue')
      },
      {
        path: 'step-5',
        name: 'Step-5',
        component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Step5.vue')
      },
      {
        path: 'step-6',
        name: 'Step-6',
        component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Step6.vue')
      },
      {
        path: 'step-7',
        name: 'Step-7',
        component: () => import(/* webpackChunkName: "setup" */ '../views/Setup/Step7.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
