import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import projectRouter from './modules/project'
import indexRouter from './modules/index'
import userRouter from './modules/user'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    projectRouter,
    userRouter,
    indexRouter
  ]
})
