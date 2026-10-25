import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import OpsContainer from '../views/OpsContainer.vue'
import FinanceContainer from '../views/FinanceContainer.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/ops/:pathMatch(.*)*',
    name: 'Ops',
    component: OpsContainer,
    alias: '/ops',
  },
  {
    path: '/finance/:pathMatch(.*)*',
    name: 'Finance',
    component: FinanceContainer,
    alias: '/finance',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
