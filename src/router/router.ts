import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import dashboard from './dashboard'

const routes: RouteRecordRaw[] = [
  dashboard,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
