import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import project from './modules/project'
import share from './modules/share'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    project,
    share,
  },
  getters
});

export default store
