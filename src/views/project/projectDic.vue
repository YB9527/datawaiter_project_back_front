<template>
  <div class="projectdicvue" v-if="show">
    <div class="nv">
      <div class="nvlist">
        <div class="nvitem box"
             v-for="(item,index ) in projectdicArray"
             :key="index"

             :class="projectdiccurrentindex === index&&'active'"
        >
          <div class="delete" v-if="isedit">
            <i class="el-icon-delete"   @click="deleteProjectDic(index,item,projectdicflag)"></i>
          </div>
          <div class="item row"
               @click="(isedit && editProjectDic(index,item,projectdicflag) ) || (projectdiccurrentindex = index)"
            >
            <div class="row" >
              <div class="label">字典表：</div>
              <div class="value">{{item.label}}</div>
            </div>
          </div>
          <!--  <div class="item row">
              <div class="label">数量：</div>
              <div class="value">50组</div>
            </div>-->
        </div>
        <div class="nvitem " v-if="isedit">
          <el-button type="primary" @click="addProjectDic(projectdicflag)">添加映射字典表</el-button>
        </div>
      </div>
      <div style="float: right">
        <el-button type="primary" v-if="!isedit"  icon="el-icon-edit" @click="isedit = !isedit">开启编辑</el-button>
        <el-button type="warning"  v-else icon="el-icon-edit" @click="isedit = !isedit">关闭编辑</el-button>
       <div>
           <!-- <search query="query"></search>-->
       </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="content">
        <div class="left" :class="isedit&&'editleft'">
          <div v-for="(item,index) in dicgroupArray"
               :class="dicgroupcurrentindex === index&&'active'"

               :key="index">
            <div class="sprow item" >
              <div  style="width: 30px" >
                <i  v-if="isedit && item.childrencount <= 1" class="el-icon-delete"   @click="deleteProjectDic(index,item,groupdicflag)"></i>
              </div>
              <div  @click="(isedit && editProjectDic(index,item,groupdicflag) ) || (dicgroupcurrentindex = index)"
                style="width:calc(100% - 30px)" class="sprow" >
                <div class="label">{{item.dicgrouplabel}}</div>
                <div class="name">{{item.dicgroup}}</div>
                <div class="name">{{item.childrencount  && item.childrencount-1}}</div>
              </div>
            </div>
          </div>
          <div class="sprow  " style="margin-top: 20px" v-if="isedit">
            <el-button class="btnwidthall" type="primary" @click="addProjectDic(groupdicflag)">添加分组</el-button>
          </div>
      </div>
      <div class="right" :class="isedit&&'editright'">
        <div class="diclist">
          <div class="listitem box"
               v-for="(item,index) in dicArray"
               v-if="item.key"
               :key="index"
               :class="index === diccurrentindex &&'active'"
               @click="(isedit && editProjectDic(index,item,dicflag) ) || (diccurrentindex = index)"
              >
            <div class="label">
              {{item.value}}
            </div>
            <div class="value">
              {{item.key}}
            </div>
          </div>
          <div class="listitem  " style="margin-top: 20px" v-if="isedit">
            <el-button  type="primary" @click="addProjectDic(dicflag)">添加字典</el-button>
          </div>
        </div>
      </div>
    </div>
    <dialog-custom :modeldialog="modeldialog" v-if="modeldialog.show"></dialog-custom>
    <!--项目字典
    字典表可以绑定到多个数据库中，但是字段是固定的-->
  </div>
</template>

<script>
  import DialogCustom from "@/components/dialogCustom";
  import {systemApi} from '@/api/datarequset.js';
  import DatabaseConnURLManager from '@/api/DatabaseConnURLManager.js';
  import projectDicApi from '@/api/projectDicApi.js';
  import search from '@/components/common/search.vue'
  export default {
    name: "projectDic",
    components:{DialogCustom,search},
    data() {
      return{
        query:{
          key: "",
          placeholder: "输入字典值 或者 键",
          searchClick: (key)=>{

          },
        },
        projectdicflag:"projectdicflag",
        groupdicflag:"groupdicflag",
        dicflag:"dicflag",
        show:false,
        isedit:false,
        projectdicArray:[],
        dicgroupArray:[],
        dicArray:[],
        projectdiccurrentindex:-1,
        dicgroupcurrentindex:-1,
        diccurrentindex:-1,
        modeldialog: {
          flag:"",
          databaseOptionArray:"",
          databaseIdTableArrayMap:{},
          tableOptionArray:[],
          show: false,
          width: '500px',
          projectdicflag: {add: "添加映射字典表", edit: "编辑映射字典表"},
          groupdicflag: {add: "添加分组", edit: "编辑分组"},
          dicflag: {add: "添加字典", edit: "编辑字典"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "modeldialogOk"
        }
      }
    },
    computed: {
      'projectid'() {
        return this.$store.state.project.id;
      }
    },
    watch:{
      projectdiccurrentindex(index){
        let {databaseconnectid,dictablename} = this.projectdicArray[index];
        projectDicApi.findDicGroup(databaseconnectid,dictablename).then(dicgroupArray=>{
          this.$Tool.arrayReplaceAll(this.dicgroupArray,dicgroupArray);
          this.dicgroupcurrentindex = 0;
        });
      },
      dicgroupcurrentindex(index){
        let {dicgroup} = this.dicgroupArray[index];
        let {databaseconnectid,dictablename} = this.projectdicArray[this.projectdiccurrentindex];
        projectDicApi.findDicGroupInAll(databaseconnectid,dictablename,dicgroup).then(dicArray=>{
          //console.log(dicArray);
          this.$Tool.arrayReplaceAll(this.dicArray,dicArray);
        });
      },
    },
    created(){
      this.init();
    },
    methods: {
     async  init(){
          //查询关联数据库
       this.show =false;
       let projectdicArray = await projectDicApi.findByProjectid(this.projectid);
       this.projectdicArray = projectdicArray;

       let databaseArray = await systemApi({url: DatabaseConnURLManager.findByProjectid(this.projectid)});
       let databaseOptionArray = [];
       //databaseOptionArray.push({value:'aa',label:'nn'});
       for(let item of databaseArray){
         databaseOptionArray.push({value:item.id,label:item.label,children:[]});
         let children = databaseOptionArray[databaseOptionArray.length-1].children;
         let tableArray = await  systemApi({url: DatabaseConnURLManager.findTableAllByDatabaseId()+item.id});
         tableArray.forEach(table=>{
           let label = table.name;
           if (table.label){
             label = table.label +"_"+ label;
           }
           children.push({value:table.name,label:label});
         });
       }
       this.modeldialog.databaseOptionArray = databaseOptionArray;
       this.projectdiccurrentindex = 0;
       this.show =true;
      },


     async  modeldialogOk(modeldialog) {
       let projectdicid;
       if(this.projectdicArray.length > this.projectdiccurrentindex){
         projectdicid = this.projectdicArray[this.projectdiccurrentindex].id;
       }
       let flag = modeldialog.flag;
       let data =  modeldialog.elform.data;
       let currenthandle = modeldialog.currenthandle;
       let addhandle = this.$strTool.modelhandle[0];
       let edithandle = this.$strTool.modelhandle[2];
       if(flag === this.projectdicflag){
         data.databaseconnectid = data.databaseconnectAndTableid[0];
         data.dictablename =  data.databaseconnectAndTableid[1];
         switch (currenthandle) {
           case addhandle:
             await projectDicApi.saveProjectDic(data);
             this.projectdicArray.push(data);
             break;
           case edithandle:
             await projectDicApi.updateProjectDic(data);
             this.$Tool.replaceModel(this.projectdicArray,data);
             break;
         }
       }else if(flag === this.groupdicflag){
         switch (currenthandle) {
           case addhandle:
             await projectDicApi.saveDic(projectdicid,data);
             this.dicgroupArray.push(data);
             break;
           case edithandle:
             await projectDicApi.updateDic(projectdicid,data);
             this.$Tool.replaceModel(this.dicgroupArray,data);
             break;
         }
       }else if(flag === this.dicflag){
         switch (currenthandle) {
           case addhandle:
             await projectDicApi.saveDic(projectdicid,data);
             this.dicArray.push(data);
             break;
           case edithandle:
             await projectDicApi.updateDic(projectdicid,data);
             this.$Tool.replaceModel(this.dicArray,data);
             this.dicgroupArray[this.dicgroupcurrentindex].childrencount = this.dicArray.length;
             break;
         }
       }

       modeldialog.show = false;

      },
      newProjectDicFormRows(flag) {
       let dialog = this.modeldialog;
       if(flag === this.projectdicflag){
         return [
           {name: 'label', label: "标签："},
           {name: 'databaseconnectAndTableid', label: "绑定表格：", type: "cascader", options: dialog.databaseOptionArray}
         ];
       }else if(flag === this.groupdicflag){
         return [
           {name: 'dicgrouplabel', label: "分组名称："},
           {name: 'dicgroup', label: "关键字："},
         ];
       }else if(flag === this.dicflag){
         return [
           {name: 'value', label: "标签："},
           {name: 'key', label: "键："},
         ];
       }
      },
      //项目与字典关联
      newProjectDic(flag) {
        let id = this.$Tool.uuid();
        let data;
        if(flag === this.projectdicflag){
          data = {
            id,
            projectid: this.projectid,
            databaseconnectAndTableid:[],
            databaseconnectid: "",
            dictablename: "",
            label: "",
          };
        }else if(flag === this.groupdicflag){
          data = {
            id,
            dicgrouplabel: "",
            dicgroup: "",
            seq:this.dicgroupArray.length,
          }
        }else if(flag === this.dicflag) {
          let dicgroup = this.dicgroupArray[this.dicgroupcurrentindex];
          data = {
            id,
            dicgroup: dicgroup.dicgroup,
            dicgrouplabel: dicgroup.dicgrouplabel,
            dicKey: "",
            dicValue: "",
            seq: this.dicArray.length,
          }
        }
        return data;
      },
      addProjectDic(flag) {
        let dialog = this.modeldialog;
        dialog.elform.rows = this.newProjectDicFormRows(flag);
        dialog.title = dialog[flag].add;
        dialog.elform.data = this.newProjectDic(flag);
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.flag = flag;
        dialog.show = true;
      },
      editProjectDic(index, row,flag) {
        let dialog = this.modeldialog;
        dialog.elform.rows = this.newProjectDicFormRows(flag);
        dialog.title =  dialog[flag].edit;
        dialog.elform.data = this.$Tool.copy(row);
        dialog.elform.data.databaseconnectAndTableid = [row.databaseconnectid,row.dictablename];
        dialog.currenthandle = this.$strTool.modelhandle[2];
        dialog.flag = flag;
        dialog.show = true;
      },
      async deleteProjectDic(index,item,flag){
       let str ;
       if(flag === this.projectdicflag){
         str = item.label;
       }else if(flag === this.groupdicflag  ){
         str = item.dicgrouplabel;
       }else if(flag === this.dicflag  ){
         str = item.value;
       }
       let projectdicid = this.projectdicArray[this.projectdiccurrentindex].id;
        await this.$confirm('确定要删除'+str+' 吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          if(flag === this.projectdicflag){
            await projectDicApi.deleteProjectDic(item);
            this.projectdicArray.splice(index,1);
          }else if(flag === this.groupdicflag){
            await projectDicApi.deleteDic(projectdicid,item);
            this.dicgroupArray.splice(index,1);
          }else if(flag === this.dicflag){
            await projectDicApi.deleteDic(projectdicid,item);
            this.dicgroupArray.splice(index,1);
          }
        })
      },


      addDicGroup(projectdic){

      },
      editGroupDic(index,item){

      },
    }
  }
</script>

<style lang="scss">
  .projectdicvue{
    background: #f1f1f1;
    min-height: 100%;
    padding: 20px;
    .delete{
      position: absolute;
      top: 5px;
      right: 5px;
    }
    .content{
      display: flex;
    }

    .left{
      width: 250px;
      height: 100%;
      border-right: 1px solid #fff;
      .active{
        background: #f0f9eb;
        border-right: 3px solid  #67c23a;
        .label{
          color: #67c23a !important;
          font-size: 18px;
        }

      }
      .item {
        cursor: pointer;
        padding: 10px;
        border-bottom: 1px solid #fff;
        .name {
          font-size: 10px;
        }
        .label {
          font-size: 14px;
        }

      }
    }

    .right{
      width: calc(100% - 250px);
      .diclist{
        display: flex;
        margin-left: 30px;
        .listitem{
          width: 200px;
          height: 60px;
          margin-bottom: 20px;
          cursor: pointer;
          text-align: center;
          line-height: 30px;
          margin-right: 30px;
          .value{
            font-size: 10px;
            color: #999;
          }
        }
        .active{
          border-bottom: 3px solid  #67c23a;
        }
      }
    }
    .nv{
      display: flex;
      .nvlist{
        display: flex;
        width: calc(100% - 100px);
      }

      .active{
        border-bottom: 3px solid  #67c23a;
      }
      .nvitem{
        padding: 20px;
        width: 150px;
        height: 60px;
        flex-direction: column;
        display: flex;
        justify-content: space-around;
        margin: 0 20px 0px 0;
        cursor: pointer;
        position: relative;
        .label{
          font-size: 14px;
          color: #999;
          width: 70px;
          text-align: right;
        }
        .value{
          color: #333;
          letter-spacing: 2px;
        }
      }
    }
  }

</style>
