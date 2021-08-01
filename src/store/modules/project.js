

const getDefaultState = () => {
  return {
    project: "",
  }
};

const state = getDefaultState()

const mutations = {
    setProject(state,project){

      state.project = project;
    }
};

const actions = {


};

export default {
  state,
  mutations,
  actions
}

