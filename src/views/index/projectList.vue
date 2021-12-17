<template>
  <div>
    <!--项目列表-->
    <div class="tool">
      <el-button  @click="addProject" size="medium ">添加项目</el-button>
      <el-button  @click="openEdit" size="medium " :type="state=='update'?'warning':''">{{state=="update" ?'关闭编辑':'开启编辑'}}</el-button>
      <el-button  @click="saveEdit" size="medium " v-if="state=='update'" type="danger">保存编辑</el-button>
    </div>
    <hr/>
    <div class="projectlist">
        <div v-for="(item,index) in projectArray"
             :key="index"
             @click="itemClick(state,index,item) "
            class="projectlistitem box">
            <div  class="imagediv"   >
              <el-image

                class="img"
                :src="item.imageurl"
                fit="contain"></el-image>
            </div>
          <div class="bottom">
            <div class="direction" v-if="state == 'update'">
              <i class="el-icon-back" @click="$Tool.itemMove(projectArray,item,-1)"  style="margin-right: 30px" v-if="index !== 0"></i>
              <i class="el-icon-right"  @click="$Tool.itemMove(projectArray,item,+1)" v-if="index !== projectArray.length-1"></i>
            </div>
            <div class="name">
              <div class="hovername">{{item.name}}</div>
            </div>
            <!--<div class="hovername">{{item.id}}</div>-->
            <div class="description">{{item.description}}</div>
          </div>
        </div>
    </div>
    <myDialog  v-if="dialogdata.show" :dialogdata="dialogdata"></myDialog>
  </div>
</template>
<script>
  import uploadImage from '@/components/common/uploadImage.vue'
  import myDialog from '@/components/common/myDialog.vue'
  import projectApi from '@/api/projectApi'
    export default {
        name: "projectList",
        components:{uploadImage,myDialog},
        data(){
          return{
            state:"",
            projectArray:[],

            dialogdata:{
                data:"",
                layout:{
                  config:{gutter:20,labelgutter:6,valuegutter:18},
                  rowArray:[
                      [{enum:'label',type:"text",text:"项目名称:"},{enum:'value',type:"input",props:"name",placeholder:"请输入项目名称"}],
                      [{enum:'label',type:"text",text:"项目URL路径:"},{enum:'value',type:"input",props:"url",placeholder:"请输入项目URL路径,如hello"}],
                      [{enum:'label',type:"text",text:"描述:"},{enum:'value',type:"input",props:"description",placeholder:"请输入项目描述"}],
                      [{enum:'label',type:"text",text:"项目封面:"},{enum:'value',type:"uploadimage",props:"elupload"}],
                  ]
                },
                width:"500px",
                state:"",
                show:false,
                titleAMap:{"add":{title:"添加项目"},"update":{title:"编辑项目"}},
                ok:(dialogdata)=>{
                  this.saveOk(dialogdata);


                  // console.log(dialogdata.data);
                },
            },
          }
        },
      created(){
        this.init();
      },
      methods:{
          async init(){
            let projectArray =await  projectApi.findAll();
            //console.log(projectArray);
            this.$Tool.arrayReplace(this.projectArray,projectArray);
          },
        itemClick(state,index,item){
            //debugger
            if(state === 'update'){
              this.editProject(index,item)
            }else{
              this.gotoProject(index,item)
            }

        },
        async saveOk(dialogdata){
          dialogdata.show = false;
          await dialogdata.data.elupload.saveAndDelete();
          let project =  dialogdata.data;
          await projectApi.edit(project);
          let  newproject = await projectApi.findById(project.id);
          if(dialogdata.state === "add"){
            this.projectArray.push(newproject);
          }else{
            for (let i = 0; i < this.projectArray.length; i++) {
              if(this.projectArray[i].id === project.id){
                this.projectArray.splice(i,1,newproject);
              }
            }
          }
        },
        addProject(){
          let dialogdata =  this.dialogdata;
          dialogdata.state = "add";
          let id = this.$Tool.uuid();
          dialogdata.data = {};
          dialogdata.data.id = id;
          dialogdata.data.elupload = this.getUpload();
          dialogdata.data.elupload.objectid = id;
          dialogdata.data.seq = this.projectArray.length+1;
          dialogdata.show = true;

        },
        /**
         * 开启项目编辑
         */
        openEdit(){
          if(this.state === "update"){
            this.state = "add";
          }else{
            this.state = "update";
          }
        },
        /**
         * 编辑项目
         */
        editProject(index,project){

          project = this.$Tool.copy(project);
          let dialogdata =  this.dialogdata;
          dialogdata.state = "update";
          dialogdata.data = project;
          dialogdata.data.elupload = this.getUpload();
          dialogdata.data.elupload.objectid = project.id;
          dialogdata.show = true;

        },
        /**
         * 保存所有项目
         */
        async saveEdit(){
          for (let i = 0; i < this.projectArray.length; i++) {
            this.projectArray[i].seq = i+1;
          }
          await projectApi.updateAll(this.projectArray);
          this.$notify({
            title: '保存成功',
            type: 'success',
            duration:-1
          });
        },
        getUpload(){
          return {
            limit: 1,
              objectid: "",
              customname: "项目图片",
              filelist: [],
              getFJArray: (addimageValue) => {
              let fjArray = [];
              let data = this.dialogdata.data;
              for (let file of  addimageValue) {
                console.log(file);
                fjArray.push({
                  id: this.$Tool.uuid(),
                  objectid: data.elupload.objectid,
                  customname: data.elupload.customname,
                  path: "sys\\" + file.name,
                  projectid: data.id,
                });
              }
              return fjArray;
            }
          }
        },
        gotoProject(index,item){

          this.$router.push({ path: '/project/api', query: { projectid: item.id }});
        },
      }
    }
</script>

<style   lang="scss"  scoped>
  /deep/   .box {
    border-radius: 0px 0 15px 15px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
    background-color: #FFFFFF;
  }
    .tool{

    }
    .imagediv {
      position: relative;
      overflow: hidden;    //图片超出div部分隐藏
      width: 100%;
      height: 220px;

    }
    .imagediv  .img{
      width: 100%;
      height: 100%;
      transition: all 0.6s;    //设置动画执行的时间为0.6s
      cursor: pointer;
    }

    .imagediv  .img:hover{
      transform: scale(1.3);     //设置图片按照比例放大1.3倍
    }

    .projectlist :hover{
        .hovername{
          color: #60b337;
          font-size: 22px;
      }
    }
    .projectlist{
       display: flex;
        flex-wrap: wrap;
        .projectlistitem{
          margin: calc(1.5%);
          width: 22%;
          min-width: 400px;
          height: 300px;
          .img{
            /*border-radius: 10px 10px 0 0;*/
          }
          .bottom{
            position: relative;
            padding: 20px;
            .direction{
              position: absolute;
              top: 20px;
              right: 10px;
              z-index: 999;
              i{
                font-size: 20px;
                color: #f01cff;
                cursor: pointer;
              }
            }
          }
          .name{
            position: absolute;
            top: 10px;
            color: #333;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            width: 90%;

          }
          .description{
            position: absolute;
            top: 40px;
            color: #999;
            font-size: 12px;
          }
        }
    }
</style>
