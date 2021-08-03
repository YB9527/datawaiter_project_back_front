

const getDefaultState = () => {
  return {
    id:"",
    url:"",
    project: "",
  }
};

const state = getDefaultState()

const mutations = {
    setProject(state,project){
      state.project = project;
      if(project){
        state.id = project.id;
        state.url = project.url;
      }else{
        state.id = "";
        state.url ="";
      }
    }
};

const actions = {


};

export default {
  state,
  mutations,
  actions
}

