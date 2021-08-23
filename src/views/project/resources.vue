<template>
  <div class="matchparent resoucesvue bg">
    <div class="topnav">
      <navlist @click="navClick" :nav="nav"></navlist>
    </div>
    <div class="line"></div>
    <div class="content">
      <div class="sprow" v-if="nav.id === 'table'"  style="width: 100%">
        <div class="left">

          <el-collapse v-model="tablecustom.databaseidArray" accordion>
            <el-collapse-item  v-for="(database) in tablecustom.databaseArray" :name="database.id" :key=database.id>
              <template slot="title">
                {{database.label}}
              </template>

              <div v-for="(item,index) in database.tableArray"
                   :class="tablecustom.tableindex === index&&'active'"
                   @click="(tablecustom.tableindex = index) | (tablecustom.table = item)"
                   class="listitem"
                   :key="index">
                <div>
                  <div class="item sprow">
                    <div class="name">{{item.name}}</div>
                    <div class="title"> {{item.content}}</div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="right" v-if="tablecustom.databaseidArray.length > 0 && tablecustom.table">
          <div class="selfright">
            <div class="row divradio">
              <div v-for="item  in divradiocustom.dataArray"
                   :key="item.id"
                   @click="(divradiocustom.id=item.id) & (item.click)"
                   :class="divradiocustom.id === item.id&&'itemactive'"
                   class="itemhover">
                {{item.label}}
              </div>
            </div>
            <mapperTable v-if="divradiocustom.id === 'bean'" :databaseId="tablecustom.databaseidArray[0]" :tableName="tablecustom.table.name"  ></mapperTable>
            <fieldTable  v-else-if="divradiocustom.id === 'field'" :databaseId="tablecustom.databaseidArray[0]" :tableName="tablecustom.table.name" ></fieldTable>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navlist from '@/components/common/navlist.vue'
  import mapperTable from "@/components/mapper/mapperTable";
  import fieldTable from "@/components/mapper/fieldTable";

  import  projectApi from '@/api/projectApi.js';
  export default {
    name: "resources",
    components: {navlist,mapperTable,fieldTable},
    data() {
      return {
        nav: {
          index: 0,
          id: "table",
          navArray: [
            {id: "table", label: "表格"},
            {id: "nav", label: "导航栏"},
            {id: "xiaojian", label: "校检"},
          ]
        },
        tablecustom: {
          databaseidArray: [],
          tableindex: -1,
          table: "",
          databaseArray: [],
        },
        divradiocustom: {
          id: "field",
          dataArray: [
            {id: 'bean', label: "Bean配置"},
            {id: 'field', label: "字段"},

          ]
        },
      }
    },
    computed: {
      'projectid'() {
        return this.$store.state.project.id;
      }
    },
    created(){
      this.init();
    },
    methods:{
      async init(){
        let databaseArray =await projectApi.findalltablebyprojectid(this.projectid);
        if(databaseArray.length > 0){
          this.tablecustom.tableindex = 0;
          this.tablecustom.databaseArray.push(...databaseArray);
          this.tablecustom.databaseidArray.push(databaseArray[0].id);
          if(databaseArray[0].tableArray && databaseArray[0].tableArray.length > 0){
            this.tablecustom.table = databaseArray[0].tableArray[0];
          }

        }
       // console.log(this.tablecustom);
      },
      //查询所有的表格
      findAllTasble(){

      },
      navClick(index,item){

      },
    }
  }
</script>

<style lang="scss">
  .resoucesvue {

    .el-collapse-item__content{
      background: #f1f1f1;
    }
    .el-collapse-item__wrap{
      background: #f1f1f1;
      padding-left: 10px;
    }
    .content{
      display: flex;
      height: calc(100% - 100px);
      .selfright{
        padding-left: 5px;
        .divradio{
          div{
            width: 150px;
            height: 50px;
            line-height: 50px;
            background: #ffffff;
            margin-right: 10px;
            text-align: center;
            cursor: pointer;
          }

        }
      }
      .database{
        font-size: 18px;
        margin-bottom: 10px;
      }
      .listitem{
        height: 60px;
        margin-top: 10px;
        background: #ffffff;

        .item{
          padding: 5px 20px;
          font-size: 14px;
          color: #666666;
          .title{
            font-size: 18px;
            color: #333333;
          }
        }


      }

    }
  }
</style>
