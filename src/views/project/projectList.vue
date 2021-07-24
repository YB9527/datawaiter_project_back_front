<template>
  <div>
    <!--项目列表-->
    <div class="tool">
      <el-button type="warning" @click="addProject" size="medium ">添加项目</el-button>
    </div>
    <hr/>
    <div class="projectlist">
        <div v-for="(item,index) in projectArray"
             :key="index"
            class="projectlistitem box">
            <div>
              <el-image
                style="width: 100%; height: 220px"
                :src="item.baseurl"
                fit="contain"></el-image>
            </div>
          <div class="bottom">
            <div class="name">
              <div class="hovername">{{item.name}}</div>
            </div>

            <div class="description">{{item.description}}</div>
          </div>
        </div>
    </div>
    <myDialog :dialogdata="dialogdata"></myDialog>
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
            projectArray:[],
            dialogdata:{
                data:{
                  elupload:{
                    limit:2,
                    objectid:"",
                    customname:"项目图片",
                    filelist:[],
                  },
                },
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
                title:"",
                titleAMap:{"add":{title:"添加项目"},"update":{title:"编辑项目"}},
                cancel:"",
                ok:(dialogdata)=>{
                  dialogdata.show = false;
                  dialogdata.data.elupload.saveAndDelete();
                  let project =  dialogdata.data;
                  projectApi.edit(project).then(res=>{
                    console.log(res);
                  });
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
            console.log(projectArray);
            this.$Tool.arrayReplaceAll(this.projectArray,projectArray);
          },
        addProject(){
          let dialogdata =  this.dialogdata;
          dialogdata.state = "add";
          let id = this.$Tool.uuid();
          dialogdata.data.id = id;
          dialogdata.data.elupload.objectid = id;
          dialogdata.data.seq = this.projectArray.length+1;
          dialogdata.show = true;
        },
      }
    }
</script>

<style   lang="scss"  scoped>
    .tool{

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
          .bottom{
            padding: 10px;
          }
          .name{
            color: #333;
            font-size: 16px;
          }
          .description{
            margin-top: 10px;
            color: #999;
            font-size: 12px;
          }
        }
    }
</style>
