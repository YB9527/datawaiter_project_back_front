<template>
  <div class="matchparent apivue">
    <!--<div class="left">
      <div>
        <el-row style="text-align: center">
          <el-button @click="addRoot" size="mini" type="info" plain>添加根</el-button>
          <el-button @click="addNode" v-show="modeldialog.currentnode" size="mini" type="info" plain>添加</el-button>
          <el-button @click="deleteNode" v-show="modeldialog.currentnode" size="mini" type="info" plain>删除</el-button>
        </el-row>
      </div>
      <div class="eltree">
        <el-tree
          :data="treedata"
          :highlight-current="true"
          node-key="id"
          @node-click="handleNodeClick"
          :default-expanded-keys="expandedkeys"
          :props="defaultProps">
        </el-tree>
      </div>
    </div>-->
    <div class="test2">
      <div>
        <div class="addbtn" @click="addRoot">
          添加根
        </div>
      </div>
      <div class="eltree">
        <el-tree
          :data="treedata"
          :highlight-current="true"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          @node-click="handleNodeClick"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="nodeitem">
                  <span class="simpleName">{{ data.simpleName }}</span>
                  <span class="count">{{ data.apicount }}</span>
              </div>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="right"  v-show="modeldialog.currentnode">
      <div class="row caozhuo">
        <div class="treecuozauo">
          <el-button @click="addNode"  size="mini" type="info" plain>添加子目录</el-button>
          <el-button @click="updateNode( modeldialog.currentnode)"  size="mini" type="info" plain>编辑目录</el-button>
        </div>
        <div class="apicaozuo">
          <el-button   size="mini" type="info" @click="$refs.apiManager.addApi()" plain>添加API</el-button>
        </div>
      </div>

      <api-manager ref="apiManager" :levelId="levelId"  ></api-manager>
    </div>

    <el-dialog  :title="modeldialog.title" :visible.sync="modeldialog.show" width="40%" >
      <formCustom :elform="modeldialog.elform"></formCustom>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modeldialog.show = false">取 消</el-button>
        <el-button type="primary" @click="modeldialogOk(modeldialog)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import ApiManager from "@/components/api/apiManager";
  import  ApiURLManager from  '@/api/ApiURLManager.js'
  import  LevelURLManager from  '@/api/LevelURLManager.js'
  import formCustom from "@/components/formCustom.vue";
  import {systemApi} from '@/api/datarequset.js';

  export default {
    name: "sourceManager",
    components: {ApiManager, formCustom},
    data() {
      return {
        expandedkeys: [1],
        levelId:"",
        apidatas:[],
        modeldialog: {
          currentnode:undefined,
          show: false,
          title: "",
          isadd :true,
          elform: {},
        },
        treedata: [],
        defaultProps: {
          children: 'childs',
          label: 'simpleName'
        }
      };
    },
    computed: {
      'project'() {
        return this.$store.state.project.project;
      }
    },
    watch:{
      'modeldialog.currentnode'(node,oldValue){
        if(node){
          this.levelId = node.id;
          systemApi({url :ApiURLManager.findByLevelId()+this.levelId})
            .then(datas => {
              let roots = this.findRoots(datas);
              let parentidMap = this.$tool.groupByAttribute(datas, "parentid");
              for (let root of roots) {
                this.setChilds(root, parentidMap);
              }
            });
        }else{
          this.levelId = "";
          this.apidatas = [];
        }
      }
    },
    created() {

      /**
       * 找到api层级
       */
      this.init();
    },
    methods: {
      async init(){
        let datas = await this.findApiLevelByParentId(this.project.id);
        //debugger
        let roots = this.findRoots(datas);
        let parentidMap = this.$tool.groupByAttribute(datas, "parentId");
        for (let root of roots) {
          this.setChilds(root, parentidMap);
        }
        this.treedata = datas;
      },
      findApiLevelByParentId(parentId){
        return  systemApi({url:LevelURLManager.findApiLevelByParentId(parentId)})
          .then(datas => {
            //this.$uiTool.loading({});

            return datas;
          });
      },
      modeldialogOk(modeldialog){
        let data = modeldialog.elform.data;
        if(modeldialog.isadd){
          if(modeldialog.currentnode){
            let childs =  modeldialog.currentnode.childs;
            if(!childs){
              childs= [];
              modeldialog.currentnode.childs = childs;
            }
            childs.push(data);
            data.parentId = modeldialog.currentnode.id;
          }else{
            this.treedata.push(data);
          }
          systemApi({
            url:LevelURLManager.addApiLevel(),
            method:"post",
            data:data,
          });
          this.modeldialog.currentnode = undefined;
        }else{
          systemApi({
            url:LevelURLManager.editApiLevel(),
            method:"post",
            data:data,
          });
          this.replaceChild(this.treedata,data);
        }
        modeldialog.show = false;
      },
      //替换节点
      replaceChild(parents,data){
          if(parents){
            for (let i = 0; i < parents.length; i++) {
              let parent = parents[i];
              if(parent && parent.id === data.id){
                parents.splice(i,1,data);
                return true;
              }else{
                let flag = this.replaceChild(parent.childs,data);
                if(flag){
                  return;
                }
              }
            }
          }
      },
      addRoot() {

        let root = this.newLevelData();
        this.modeldialog.currentnode = undefined;
        this.modeldialog.title = "添加根节点";
        this.modeldialog.elform = {
          data:root,
          isadd :true,
          rows: this.newNodeFormRows(),
        };
        this.modeldialog.show = true;
      },
      newNodeFormRows(){
        return [
          {name: 'parentFullSimpleName', label: "父节点名字",disabled:true},
          {name: 'parentFullName', label: "父节点URL地址",disabled:true},

          {name: 'simpleName', label: "显示名称"},
          {name: 'name', label: "URL地址"},
          {name: 'fullName', label: "全名称"},
          {name: 'des', label: "描述"},
        ];
      },
      newLevelData(parents){
        let id = this.$uuid.v4();
        let data = {
          parentId:this.project.id,
          parentFullSimpleName:"",
          parentFullName:"",
          id: id,
          name:"",//url 地址
          simpleName: "",
          fullName: "",
          des: "",
          childs:[],
        };
        if(parents){
          for (let parent of parents){
            data.parentFullSimpleName = data.parentFullSimpleName+"/"+parent.simpleName;
            data.parentFullName = data.parentFullName+"/"+parent.name;
          }
          data.parentFullSimpleName = data.parentFullSimpleName;
          data.parentFullName = data.parentFullName;
        }

        return data;
      },
      addNode() {
        let parents = this.findAllParent(this.treedata, this.modeldialog.currentnode.parentId);
        parents.push(this.modeldialog.currentnode);
        let root = this.newLevelData(parents);
        this.modeldialog.title = "添加子节点";
        this.modeldialog.elform = {
          data:root,
          isadd :true,
          rows: this.newNodeFormRows()
        };
        this.modeldialog.show = true;
      },
      updateNode(data){
        data = this.$Tool.copy(data);
        let parents = this.findAllParent(this.treedata, data.parentId);
        if(parents){
          data.parentFullName = "";
          data.parentFullSimpleName = "";
          for (let parent of parents){
            data.parentFullSimpleName = data.parentFullSimpleName+"/"+parent.simpleName;
            data.parentFullName = data.parentFullName+"/"+parent.name;
          }
          data.parentFullSimpleName = data.parentFullSimpleName;
          data.parentFullName = data.parentFullName;
        }
        this.modeldialog.title = "编辑节点";
        this.modeldialog.isadd = false;
        this.modeldialog.elform = {
          data:data,
          isadd :false,
          rows: this.newNodeFormRows()
        };
        this.modeldialog.show = true;
      },
      findAllParent(datas, parentId){

        let parents = [];
        if(parentId){
          while (parentId){
            let parent = this.findParent(datas,parentId);
            if(parent){
              parents.unshift(parent);
              parentId = parent.parentId;
            }else{
              break;
            }
          }
        }

        return parents;

      },
      deleteNode() {
        let index;
        if(this.modeldialog.currentnode){
          this.$uiTool.confirm({
            message:"确定要删除："+this.modeldialog.currentnode.simpleName+" 吗？",
            callback:flag=>{
              if(flag){
                let currentnode = this.modeldialog.currentnode;
                let parent = this.findParent(this.treedata,currentnode.parentId);
                if(parent){
                  index = parent.childs.findIndex(item=>{
                    return item === currentnode;
                  });
                  parent.childs.splice(index,1);
                }else{
                  //如果没有就是根节点
                  index = this.treedata.findIndex(item=>{
                    return item === currentnode;
                  });
                  if(index !== undefined){
                    this.treedata.splice(index,1);
                  }
                }
                systemApi({url:LevelURLManager.deleteLevelById()+currentnode.id} );
              }
            }
          });
        }
      },
      findParent(treedata,parentId){
        for (let data of treedata){

          if(data.id === parentId){
            return data;
          }else {
            let parent =  this.findParent(data.childs,parentId);
            if(parent != null){
              return parent;
            }
          }
        }
      },
      setChilds(root, parentidMap) {
        if (root) {
          let id = root.id;
          let childs = parentidMap[id];
          if (childs) {
            root.childs = childs;
            for (let child of childs) {
              this.setChilds(child, parentidMap);
            }
          }else{
            root.childs = [];
          }
        }
      },
      /**
       * 查找所有的根节点
       * @param datas
       */
      findRoots(datas) {
        let roots = []
        for (let data of datas) {

          if (data.parentId === this.project.id) {
            roots.push(data);
          }else{

          }
        }
        return roots;
      },

      async handleNodeClick(data) {
        this.modeldialog.currentnode = data;

        if(!data.childsisload ){
          data.childsisload = true;
          let childs = await this.findApiLevelByParentId(data.id);
          if(childs && childs.length > 0){
            let parentidMap = this.$tool.groupByAttribute(childs, "parentId");
            this.setChilds(data, parentidMap);
          }
        }
      },
    }
  }
</script>

<style lang="scss" >
  .project{
    height: 100%;
    .apivue{
      display: flex;
      height: 100%;
      .left,.test2 {
        height: 100%;
        width: 20%;
        background: #f1f1f1;
        .el-tree{
          background: #f1f1f1;
          .is-current{
            .simpleName{
              color: #67c23a !important;
            }
          }
        }
        .el-tree-node__content{
          width: 100%;
          .custom-tree-node{
            width: calc(100% - 50px);
            .nodeitem{
              display: flex;
              justify-content: space-between;
              color: #999;
              width: calc(100% - 20px);
              .count{
                font-size: 4px;
              }
              font-size: 14px;
            }
          }
        }

        .addbtn{
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #f0f9eb;
          color: #67c23a;
          cursor: pointer;
        }
      }
      .right {
        height: 100%;
        width: 80%;
        .caozhuo{
          padding: 10px;
        }
        .treecuozauo{
          margin-right: 40px;
          padding-right: 40px;
          border-right: 2px solid #67c23a;
        }
        .apicaozuo{

        }
      }
    }
  }


</style>
