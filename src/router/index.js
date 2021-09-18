import Vue from 'vue'
import Router from 'vue-router'
import projectRouter from './modules/project'
import indexRouter from './modules/index'
import userRouter from './modules/user'
import testRouter from './modules/test'

import  projectlist from '@/views/index/projectList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'projectlist',
      component: projectlist
    },
    projectRouter,
    userRouter,
    indexRouter,
    testRouter
  ]
})
