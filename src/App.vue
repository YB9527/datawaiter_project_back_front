<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {systemApi} from '@/api/datarequset.js';
  import SysURLManager from '@/api/SysURLManager.js';
  import DatabaseConnURLManager from '@/api/DatabaseConnURLManager.js';

export default {
  name: 'App',
  created(){
    this.$uiTool.setSelf(this);
    //设置共享数据
    this.setShareData();
  },
  methods:{
    setShareData(){;
      systemApi({url: DatabaseConnURLManager.findDatabaseEnum()})
        .then(datas => {
          this.$store.state.share.databaseEnumArray = datas;
        });
      systemApi({url: SysURLManager.findEnums(this.$strTool.questmethodenumname)})
        .then(datas => {
          this.$store.state.share.questMethodArray = datas;
        });

      systemApi({url: SysURLManager.findEnums(this.$strTool.accessstate)})
        .then(datas => {
          this.$store.state.share.accessArray = datas;
          this.$store.state.share.accessMap = this.$tool.groupByAttributeSingle(datas);
        });

      systemApi({url: SysURLManager.findEnums(this.$strTool.crud)})
        .then(datas => {
          this.$store.state.share.crudArray = datas;
          this.$store.state.share.crudMap = this.$tool.groupByAttributeSingle(datas);
        });
      systemApi({url: SysURLManager.findEnums(this.$strTool.AutoCreateMapper)})
        .then(autoCreateMapperArray => {
          for (let autoCreateMapper of autoCreateMapperArray) {
            autoCreateMapper.checked = true;
            break;
          }
          this.$store.state.share.autoCreateMapperArray = autoCreateMapperArray;
          this.$store.state.share.autoCreateMapperMap = this.$tool.groupByAttributeSingle(autoCreateMapperArray);
        });
      systemApi({url: SysURLManager.findEnums(this.$strTool.PoRelation)})
        .then(datas => {

          this.$store.state.share.poRelationArray = datas;
          this.$store.state.share.poRelationMap = this.$tool.groupByAttributeSingle(datas);
        });
      systemApi({url: SysURLManager.findEnums(this.$strTool.MapperCreateEnum)})
        .then(datas => {
          this.$store.state.share.mapperCreateEnumArray = datas;

          this.$store.state.share.mapperCreateEnumMap = this.$tool.groupByAttributeSingle(datas);
        });
    },
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
    .right{
      width: calc(100% - 250px);
      height: 100%;
    }
  }
  body{
    margin: 0;
  }
  .matchparent{
    height: 100%;
    width: 100%;
  }
  .bg{
    background-color: #f1f1f1;
  }
  .box {
    border-radius: 8px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
    background-color: #FFFFFF;
  }
  .top{
    height: 60px;
  }
  .left{
    width: 250px;
    height: 100%;
    border-right: 1px solid #fff;
    .listitem:hover{
      background: #f0f9eb !important;
    }
    .active{
      background: #b3e19d !important;
    }
  }
  .itemhover:hover{
    background: #f0f9eb !important;
  }
  .itemactive{
    background: #b3e19d !important;
  }


  .row{
    display: flex;
  }
  .sprow{
    display: flex;
    justify-content: space-between;
  }
  .itemmargin{
    margin-top: 10px;
  }
  .line{
    margin: 5px 0 ;
    border: 1px solid #fff;
  }
  .el-select,.el-cascader{
    width: 100%;
  }
  .submitbutton{
    width: 150px;
  }
  .btnwidthall{
    width: 100%;
  }
  .nvlist{
    display: flex;
    .active{
      border-top: 3px solid  #67c23a;
    }
    .nvitem{
      width: 150px;
      height: 60px;
      flex-direction: column;
      display: flex;
      justify-content: space-around;
      margin: 0 20px 0px 0;
      cursor: pointer;
      .label{
        font-size: 14px;
        color: #999;
        text-align: center;
      }
      .value{
        color: #333;
        letter-spacing: 2px;
      }
    }
  }


</style>
