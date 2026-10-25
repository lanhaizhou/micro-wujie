import { createRouter, createWebHashHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import Campaigns from '../views/Campaigns.vue'
import WujieDemo from '../views/WujieDemo.vue'

const routes = [
  {
    path: '/',
    redirect: '/overview',
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview,
  },
  {
    path: '/campaigns',
    name: 'Campaigns',
    component: Campaigns,
  },
  {
    path: '/wujie-demo',
    name: 'WujieDemo',
    component: WujieDemo,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
