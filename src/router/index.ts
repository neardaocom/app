import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import store from '@/store/index'

const routes = [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPage
  },
  {
    path: '/daos',
    name: 'dao-list',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/DaoList.vue')
  },
  {
    path: '/dao/:id',
    name: 'dao',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/Dao.vue')
  },
  {
    path: '/create',
    name: 'dao-create',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/DaoCreate.vue'),
    beforeEnter: (to: any, from: any, next: any) => {
      if (store.getters['near/isSignedIn']) {
        next()
      } else {
        store.commit('near/signIn', {successUrl: window.location.origin + to.fullPath, errorUrl: window.location.origin + '/error'})
        next(false)
      }
    }
  },
  {
    path: '/creating',
    name: 'dao-creating',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/DaoCreating.vue'),
    beforeEnter: (to: any, from: any, next: any) => {
      if (store.getters['near/isSignedIn']) {
        next()
      } else {
        store.commit('near/signIn', {successUrl: window.location.origin + to.fullPath, errorUrl: window.location.origin + '/error'})
        next(false)
      }
    }
  },
  {
    path: '/market/:id?',
    name: 'market',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/Market.vue')
  },
  {
    path: '/market/workflow/:id',
    name: 'market-workflow',
    component: () => import(/* webpackChunkName: "dao" */ '@/pages/MarketWorkflow.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router