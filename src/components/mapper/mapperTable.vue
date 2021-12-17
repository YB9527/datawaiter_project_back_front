<template>
  <div class="matchparent">


    <table-custom

      :datas="tableData"
      :columns="columns"
    ></table-custom>
    <mapper-c-r-u-d :mapperdialog="mapperdialog" v-if="mapperdialog.show" :databaseId="databaseId"
                    :mapper="mapperdialog.data"></mapper-c-r-u-d>

    <el-dialog

      :title="autoAddBeanDialog.title"
      :visible.sync="autoAddBeanDialog.show"
      :width="autoAddBeanDialog.width">
      <!--<table-custom :datas="autoAddBeanDialog.datas" :columns="autoAddBeanDialog.columns"></table-custom>-->

      <el-row :gutter="24">
        <el-col :span="6" v-for="(autoCreateMapper,i) in autoCreateMapperArray"   :key="i" style="text-align: center">
          <el-checkbox v-model="autoCreateMapper.checked">{{autoCreateMapper.label}}</el-checkbox>
        </el-col>

      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="autoAddBeanDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="click_AutoAddBeanDialogOk(autoCreateMapperArray)">确 定</el-button>
      </div>

    </el-dialog>

    <!--<drawer-custom :mapperdialog="mapperdialog" v-if="mapperdialog.show"></drawer-custom>-->
    <!-- <dialog-custom :mapperdialog="paramdialog" v-if="paramdialog.show"></dialog-custom>-->


  </div>
</template>

<script>
  import TableCustom from "../tableCustom";
  import DialogCustom from "../dialogCustom";
  import {systemApi} from '@/api/datarequset.js';
  import MapperURLManager from '@/api/MapperURLManager.js'
  import DrawerCustom from "../drawerCustom";
  import mapperCRUD from "./mapperCRUD";

  export default {
    name: "ApiManager",
    components: {mapperCRUD, DrawerCustom, DialogCustom, TableCustom},
    props: ["databaseId", "tableName"],
    data() {
      return {
        autoAddBeanDialog: {
          show: false,
          width: '50%',
          title: "添加基础Bean",
          autoCreateMapperArray: [],
          tablenArray: [],
        },
        autoCreateMapperArray: [],
        crudArray: [],
        crudMap: {},

        tableData: [],
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
            label: "标签",
            prop: "label",
            isShow: true,
            align: "center"
          },
          {
            label: "操作类型",
            prop: "crud",
            isShow: true,
            align: "center",
            formatter: value => {
              let result = this.$store.state.share.crudMap[value];
              if (result) {
                return result.label;
              }
              return value;
            }
          },
          {
            label: "sql语句",
            prop: "sql_",
            isShow: true,
            align: "center",
            formatter:val=>{
              if(val && val.length > 100){
                return val.substring(0,100)+"...";
              }
              return val;
            }
          },
          {
            label: "API数量",
            width: "60",
            prop: "apiCount",
            isShow: true,
            align: "center"
          },
          {
            type: "button",
            label: "操作",
            width: "300",
            prop: "",
            isShow: true,
            align: "center",
            headers: [{
              type: 'button',
              label: "自动添加Bean",
              click: () => {
                this.addAutoCreateMapper();
              },
            }, {
              type: 'button',
              label: "添加Bean",
              click: () => {
                this.addMapper();
              },
            }],
            list: [
              {
                label: "编辑",
                type: "warning",
                click: (index, row) => {
                  //console.log(3,row);
                  this.editMapper(index, row);
                },
              },
              {
                label: "删除",
                type: "danger",
                click: (index, row) => {
                  this.deleteMapper(index, row);
                },
              }
            ]
          },
        ],
        rootURL: "",
        level: {},
        poolArray: [],
        poolMap: {},
        questMethodArray: [],
        accessArray: [],
        accessMap: {},
        mapperdialog: {
          show: false,
          width: '100%',
          titlepo: {add: "添加Mapper", edit: "编辑Mapper"},
          title: "",
          currenthandle: "",
          data: {},
          okClickName: "mapperdialogOk"
        },
      }
    },
    watch:{
      tableName(){
        //console.log(11);
        this.init();
      },
      databaseId(){
        //console.log(11);
        this.init();
      },

    },
    created() {
      this.init();
    },
    methods: {
      //添加 基础 的bean
      click_AutoAddBeanDialogOk(autoCreateMapperArray) {
        let formdata = new FormData();
        formdata.append("databaseId", this.databaseId);
        formdata.append("tableName", this.tableName);
        let array = [];
        for (let autoCreateMapper of autoCreateMapperArray) {
          if (autoCreateMapper.checked) {
            array.push(autoCreateMapper.id);
          }
        }
        formdata.append("autoCreateMapperArray", JSON.stringify(array));
        systemApi({url: MapperURLManager.autoCreateMapper(),method:"post", data: formdata})
          .then(mappers => {
            let saveMappers = [];
            for (let mapper of mappers) {
              let hase = this.haseMapper(this.tableData, mapper);
              if (!hase) {
                saveMappers.push(mapper)
              }
            }
            return new Promise(resolve => {
              resolve(saveMappers);
            });
          }).then(savemappers => {
          if (savemappers.length === 0) {
            return;
          }
          systemApi({url: MapperURLManager.saveMappers(),method:"post", data: savemappers})
            .then(count => {
              for (let mapper of savemappers) {
                this.tableData.push(mapper);
              }
            });
        });

        this.autoAddBeanDialog.show = false;
      },
      //检查是否是mapper
      haseMapper(mappers, checkapper) {
        for (let mapper of mappers) {
          if (mapper.label === checkapper.label) {
            return true;
          }
        }
        return false;
      },
      addAutoCreateMapper() {
        this.autoAddBeanDialog.show = true;
      },
      init() {

        Promise.all([this.findCurrentMappers()])
          .then(results => {
           //console.log(results[0]);
            this.autoCreateMapperArray = this.$store.state.share.autoCreateMapperArray;
            this.crudArray = this.$store.state.share.crudArray;
            this.crudMap = this.$store.state.share.crudMap;
            this.accessArray = this.$store.state.share.accessArray;
            this.questMethodArray = this.$store.state.share.questMethodArray;
            this.tableData = [];
            this.$Tool.arrayReplace( this.tableData , results[0]);
          });
      },
      findCurrentMappers() {
        return new Promise(resolve => {
          systemApi({url: MapperURLManager.findMappersByDatabaseIdAndTableName(this.databaseId, this.tableName)})
            .then(mappers => {
              resolve(mappers);
            })
        });
      },

      mapperdialogOk(dialog) {
        let mapper = dialog.data;
        //console.log(3,mapper)
        dialog.show = false;
        systemApi({
          url: MapperURLManager.editMapper(),
          method:"post",
          data: mapper,
        }).then(count => {
          if (dialog.currenthandle === this.$strTool.modelhandle[0]) {
            this.tableData.push(mapper);
          } else if (dialog.currenthandle === this.$strTool.modelhandle[2]) {
            this.$tool.replaceModel(this.tableData, mapper);
          }
        });
      },

      addMapper() {
        let dialog = this.mapperdialog;
       // console.log(1,dialog)
        dialog.title = dialog.titlepo.add;
        dialog.data = this.newMapper();
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.show = true;
      },
      newMapper() {
        //let data = this.mapperdialog.elform.data;
        // let id = this.$uuid.v4();
        //console.log(this.accessArray);
        let data = {
          id: this.$uuid.v4(),
          label: "",
          accessId: this.accessArray[0].id,
          levelId: this.levelId,
          databaseId: this.databaseId,
          questMethod: this.questMethodArray[0],
          crud: this.crudArray[0].id,
          sql_: "",
          tableName:this.tableName,
          resultColumns:[],
          resultColumnCUDs:[],
          apiId:"",
          mapperId:"",
        };
        //console.log(11,data)
        return data;
      },

      editMapper(index, mapper) {

        let dialog = this.mapperdialog;
        systemApi({url: MapperURLManager.findMapperById(mapper.id)})
          .then(mapper => {

            dialog.data = mapper;
            dialog.title = dialog.titlepo.edit;
            dialog.currenthandle = this.$strTool.modelhandle[2];

            dialog.show = true;

            /* systemApi({url: ApiURLManager.findParamsByApiId() + row.id})
               .then(datas => {
                 dialog.elform.data.params = datas;
                 if (!dialog.elform.data.params) {
                   dialog.elform.data.params = [];
                 }
                 dialog.elform.rows = this.newFormRows();
                 dialog.title = dialog.titlepo.edit;
                 dialog.currenthandle = this.$strTool.modelhandle[2];
                 dialog.show = true;
               });*/
          });

      },
      deleteMapper(index, row) {
        this.$uiTool.confirm({
          message: "确定要删除 '" + row.label + "' 吗？",
          callback: flag => {
            if (flag) {
              systemApi({url: MapperURLManager.deleteMapper(), data: row})
                .then(data => {
                  this.tableData.splice(index, 1);
                });
            }
          }
        });

      },

    }
  }
</script>

<style>
  .el-tabs--left .el-tabs__header.is-left {
    float: left;
    margin-bottom: 0;
    margin-right: 0px;
  }


</style>
