// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import uuid from 'vue-uuid'
Vue.use(uuid);


import Tool from '@/js/common/Tool.js'
Vue.prototype.$Tool = Tool;

import functionTool from '@/js/common/functionTool.js'
Vue.prototype.$FunctionTool = functionTool;

import   Api from '@/api/api.js'
Vue.prototype.$Api = Api;

import fjApi from '@/api/fjApi.js'
Vue.prototype.$FjApi = fjApi;


Vue.config.productionTip = false;



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
