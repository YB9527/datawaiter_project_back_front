<template>
  <div class="fieldtablevue" v-if="show">

    <el-table
      :data="fieldArray"
      border
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        prop="columnName"
        label="name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="key"
        label="主键"
        width="100">
      </el-table-column>
      <el-table-column
        prop="filedEnum"
        label="类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="isNull"
        label="isNull"
        width="100">
        <template slot-scope="scope">
          <el-tag class="isnull" type="danger" v-if="scope.row.isNull">必填</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        label="注释">
      </el-table-column>
      <el-table-column
        prop="isNull"
        label="配备字典">
        <template slot-scope="scope" >
          <el-cascader
            v-model="scope.row.projectdicidanddicgroup"
            :options="dicoptions"
            :props="{ expandTrigger: 'hover' }"
            clearable></el-cascader>
        </template>
      </el-table-column>
      <el-table-column
        prop="isNull"
        label="字段校检">
        <template slot-scope="scope" >
          <el-cascader
            v-model="scope.row.checkid"
            :options="dicoptions"
            :props="{ expandTrigger: 'hover' }"
            clearable></el-cascader>
        </template>
      </el-table-column>
    </el-table>
 <!--   <table-custom
      :datas="fieldArray"
      :columns="columns"
    ></table-custom>-->
    <div class="buttongroup">
      <el-button class="submitbutton" @click="init">刷新</el-button>
      <el-button type="primary" class="submitbutton" @click="saveOrUpdate">保存</el-button>
    </div>
  </div>
</template>

<script>
  import TableCustom from "../tableCustom";
  import tableApi from  '@/api/tableApi';
  import projectDicApi from  '@/api/projectDicApi';

  export default {
    name: "fieldTable",
    components: {TableCustom},
    props:{
      tableName:"",
      databaseId:"",
    },
    data() {
      return {
        show:false,
        dicoptions: [],
        fieldArray:[],
        columns: [
          {
            type: "index",
            label: "序列号",
            width: "120",
            prop: "",
            isShow: true,
            align: "center"
          },
          {
            label: "name",
            width: "120",
            prop: "columnName",
          },
          {
            label: "主键",
            width: "120",
            prop: "key",
          },
          {
            label: "类型",
            width: "120",
            prop: "filedEnum",
          },
          {
            label: "isNull",
            width: "120",
            prop: "isNull",
          },
          {
            label: "注释",
            prop: "comment",
          },
          {
            width: "300",
            prop: "dicgrouplabel",
            isShow: true,
            align: "center",
            headers: [{
              type: 'button',
              label: "配备字典",
              click: () => {
                this.showDialogSetFieldDic();
              },
            }],
            template:{

            }
          },
          {
            width: "300",
            prop: "dicgrouplabel",
            isShow: true,
            align: "center",
            headers: [{
              type: 'button',
              label: "字段校检",
              click: () => {
                this.addAutoCreateMapper();
              },
            }]
          },
        ],
      }
    },
    computed: {
      'projectid'() {
        return this.$store.state.project.id;
      },
    },
    watch:{
      tableName(){
        this.init();
      },
      databaseId(){
        this.init();
      },
    },
    created() {
      this.init();
    },
    methods:{
      async init(){
        this.show = false;
        //查找表格所有的字段
        let fieldArray = await tableApi.findFiledAllByDatabaseidAndTableName(this.databaseId,this.tableName);
        this.fieldArray =fieldArray;
        //查询出项目字典
        let dicArray =await projectDicApi.findAllByProjectid(this.projectid);
        let dicoptions = [];
        for(let projectdic of dicArray){
          let parent = {value:projectdic.id,label:projectdic.label};
          dicoptions.push(parent);
          parent.children = [];
          for(let dicgroup of projectdic.dicArray){
            parent.children.push({value:dicgroup.dicgroup,label:dicgroup.dicgrouplabel})
          }
        }
        this.dicoptions = dicoptions;
        console.log(dicoptions);
        let fielddicArray = await tableApi.findTableField(this.projectid,this.databaseId,this.tableName);
        for(let fielddic of fielddicArray){
          for(let field of fieldArray){
            if(fielddic.fieldname === field.columnName){
              field.projectdicidanddicgroup = [fielddic.projectdicid,fielddic.dicgroup];
              field.id = fielddic.id;
            }
          }
        }
        this.show = true;
        //console.log("fielddicArray",fielddicArray);
       // console.log("fieldArray",fieldArray);
      },
      showDialogSetFieldDic(){

      },
     async saveOrUpdate(){
         // console.log(this.fieldArray);
          let savedata = [];
          for(let field of this.fieldArray){
            let data ={
              id:field.id,
              projectid:this.projectid,
              databaseid:this.databaseId,
              tablename:this.tableName,
              fieldname:field.columnName,
            };
            if(field.projectdicidanddicgroup && field.projectdicidanddicgroup.length === 2){
              data.fielddic = {
                projectdicid:field.projectdicidanddicgroup[0],
                  dicgroup:field.projectdicidanddicgroup[1],
              };
            }
            savedata.push(data);
          }
         await tableApi.saveOrUpdateField(savedata);
          this.$message.success("保存成功");
         // console.log(savedata);

      }
    }
  }
</script>

<style lang="scss">
  .fieldtablevue{

    .buttongroup{
      margin-top: 10px;
      margin-right: 10px;
      display: flex;
      justify-content: flex-end;

    }
    .isnull{
      width: 100%;
      text-align: center;
    }
  }

</style>
