import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'courseTable',
    component: () => import('../views/CourseTable/CourseTable')
  }
]

const router = new VueRouter({
  routes
})

export default router
