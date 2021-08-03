<template>
  <div class="project " >
    <div class="nav">
      <div class="projectname el-link el-link--primary" @click="$router.push({path:'/projectlist'})">{{project&&project.name}}</div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        background-color='#545c64'
        mode="horizontal"
        @select="handleSelect"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="/project/api">API</el-menu-item>
        <el-menu-item index="/project/database">数据库</el-menu-item>
        <el-menu-item index="/project/resources">资源管理</el-menu-item>
        <el-menu-item index="/project/projectdic">字典表</el-menu-item>
        <el-menu-item index="/project/projectlog">访问日志</el-menu-item>
        <el-menu-item index="/project/flow">流程</el-menu-item>
        <el-menu-item index="/project/user">用户管理</el-menu-item>
      </el-menu>
    </div>

    <div v-if="$store.state.project.project" class="projectrouter">
      <router-view/>
    </div>

  </div>
</template>



<script>
  import projectApi from '@/api/projectApi'
  export default {
    data() {

      return {
        projectid:"",
        project:"",
        activeIndex: '',
      };
    },
    watch:{
      "$route.query.projectid"(porojectid){

        if(porojectid){
          this.projectid = porojectid;
          this.init();
        }
      }
    },
    created(){
        let projectid = this.$route.query.projectid;
        if(!projectid){
          projectid = localStorage.getItem("projectid");
        }
      this.projectid = projectid;
       this.activeIndex = this.$route.path;
       this.init();
    },
    methods: {
      async init(){
        this.$store.commit("setProject","");
        let projectid  = this.projectid;
        localStorage.setItem('projectid',projectid);

        let project = await projectApi.findById(this.projectid);
        this.project =project;
        this.$store.commit("setProject",project);
      },
      handleSelect(key, keyPath) {
        this.$router.push({ path: key, query: {projectid:this.projectid}});
      }
    }
  }
</script>

<style lang="scss" >
  .project{
    height: 100%;
  }
  .nav{
    display: flex;
    align-items: center;
    background-color:#545c64;
    padding: 0 20px;
    .el-menu.el-menu--horizontal {
      border-bottom: solid 0px #e6e6e6;
    }
    .projectname{

      font-size: 18px;
      padding-right: 100px;
      margin-right: 20px;
      border-right: 3px solid #fff;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      letter-spacing: 5px;
    }
  }
  .projectrouter{
    height: calc(100% - 60px);
  }
</style>
