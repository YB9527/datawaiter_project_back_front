// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/element-variables.scss'
Vue.use(ElementUI);

// 引入echarts
import * as echarts from 'echarts';
Vue.prototype.$Echarts = echarts;

import uuid from 'vue-uuid'
Vue.use(uuid);


import * as Tool from '@/common/js/Tool.js'
Vue.prototype.$Tool = Tool;
Vue.prototype.$tool = Tool;

import  functionTool from '@/common/js/FunctionTool.js'
Vue.prototype.$FunctionTool = functionTool;

import   Api from '@/api/api.js'
Vue.prototype.$Api = Api;

import fjApi from '@/api/fjApi.js'
Vue.prototype.$FjApi = fjApi;

import UITool from  '@//common/js/UITool.js';
Vue.prototype.$uiTool = UITool;

import StrTool from  '@/common/js/StrTool.js';
Vue.prototype.$strTool = StrTool;


Vue.component("dialogCustom",()=>import('@/components/dialogCustom'));

Vue.config.productionTip = false;

Vue.filter('sfFilter',value=>{
  if(value !== undefined){
    return value?"是":"否";
  }
  return "";
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
