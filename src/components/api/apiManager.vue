<template>
  <div class="matchparent">

    <table-custom

      :datas="tableData"
      :columns="columns"
    ></table-custom>
    <api-c-r-u-d  :modeldialog="modeldialog" v-if="modeldialog.show" :api="modeldialog.elform.data"></api-c-r-u-d>


    <!--<drawer-custom :modeldialog="modeldialog" v-if="modeldialog.show"></drawer-custom>-->
   <!-- <dialog-custom :modeldialog="paramdialog" v-if="paramdialog.show"></dialog-custom>-->



  </div>
</template>

<script>
  import TableCustom from "../tableCustom";
  import DialogCustom from "../dialogCustom";
  import {systemApi} from '@/api/datarequset.js';
  import SysURLManager from '@/api/SysURLManager.js';
  import ApiURLManager from '@/api/ApiURLManager.js'
  import LevelURLManager from '@/api/LevelURLManager.js'
  import DrawerCustom from "../drawerCustom";
  import ApiCRUD from "./apiCRUD";
  import MapperURLManager from '@/api/MapperURLManager.js'

  export default {
    name: "ApiManager",
    components: {ApiCRUD, DrawerCustom, DialogCustom, TableCustom},
    props: ["levelId"],
    data() {
      return {
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
            label: "数据库名称",
            prop: "databaseConnectId",
            isShow: true,
            align: "center",
            formatter: (value) => {
              let pool = this.poolMap[value];
              return pool ? pool.label : "";
            }
          },
          {
            label: "根URL",
            prop: "rootURL",
            isShow: true,
            align: "center"
          },
          {
            label: "本级URL",
            prop: "selfURL",
            isShow: true,
            align: "center"
          },
          {
            label: "访问控制",
            prop: "accessId",
            isShow: true,
            align: "center",
            formatter: (value) => {
              if (value) {
                let access = this.accessMap[value];
                return access ? access.label : "";
              } else {
                return "";
              }

            }
          },
          {
            label: "请求方式",
            width: "120",
            prop: "questMethod",
            isShow: true,
            align: "center"
          },
          {
            label: "操作类型",
            prop: "crud",
            isShow: true,
            align: "center",
            formatter:value=>{
              let result = this.$store.state.share.crudMap[value];
              if(result){
                return result.label;
              }
              return value;
            }
          },
          {
            type: "button",
            label: "操作",
            width: "300",
            prop: "",
            isShow: true,
            align: "center",
           /* headers: [{
              type: 'button',
              label: "添加API",
              click: () => {
                this.addApi();
              },
            }],*/
            list: [
              {
                label: "网页",
                type: "info",
                show:(index,api) =>{
                  if(api.questMethod === "GET"){
                    return true;
                  }else{
                    return false;
                  }
                },
                click: (index, row) => {
                  this.openURL(index, row);
                },
              },
              {
                label: "编辑",
                type: "warning",
                click: (index, row) => {
                  this.editApi(index, row);
                },
              },
              {
                label: "删除",
                type: "danger",
                click: (index, row) => {
                  this.deleteApi(index, row);
                },
              }
            ]
          },
        ],
        rootURL: "",
        level: {},
        poolArray: [],
        poolMap: {},
        cruddArray: [],
        crudMap: {},
        questMethodArray: [],
        accessArray: [],
        accessMap: {},
        modeldialog: {
          show: false,
          width: '600px',
          titlepo: {add: "添加API", edit: "编辑API"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "modeldialogOk"
        },


      }
    },
    created() {
      this.init();
    },
    watch: {
      levelId(node, oldValue) {
        this.init();
      }
    },
    methods: {

      /**
       * 打开网页
       * @param index
       * @param api
       */
      openURL(index, api) {

        let url = this.$Api.ip + "/datawaiter" + api.rootURL + "/" + api.selfURL;

        systemApi({url: MapperURLManager.findMapperById(api.mapperId)})
          .then(mapper => {
              if(api.crud === 'SELECT'){
                let resultColumns =  mapper.resultColumns;
                if(resultColumns && resultColumns.length > 0){
                  url = url + "?";
                  for (let resultColumn of resultColumns) {
                    //console.log(resultColumn)
                    if(resultColumn.poRelation === "no"){
                      url = url + resultColumn.property.trim() + "=" + resultColumn.testValue+"&";
                    }

                  }
                  //console.log(url);
                  url = url.replace(new RegExp("\\[","gm"), "").replace(new RegExp("]","gm"), "");
                  url = url.substring(0,url.length-1);
                  //console.log(url);
                }
                window.open(url, '_blank')
              }
          });

       /* systemApi({url: Mapp.findParamsByApiId() + row.id})
          .then(datas => {
            console.log()
            row.params = datas;
            if (row.params && row.params.length > 0) {
              url = url + "?";
              for (let param of row.params) {
                url = url + param.paramName + "=" + param.testValue;
              }
              url = url.replace("[", "").replace("]", "");
            }
            window.open(url, '_blank')
          });*/
      },


      modeldialogOk(dialog) {
        console.log(dialog);
        if(dialog.title === dialog.titlepo.add){
          localStorage.setItem('databaseConnectId',dialog.elform.data.databaseConnectId);
        }

        let map = {api: dialog.elform.data, params: dialog.elform.data.params};

        dialog.show = false;
        systemApi({
          url: ApiURLManager.editApi(),
          method: 'post',
          data: dialog.elform.data,
        }).then(data => {
          if (dialog.currenthandle === this.$strTool.modelhandle[0]) {
            this.tableData.push(dialog.elform.data);
          } else if (dialog.currenthandle === this.$strTool.modelhandle[2]) {
            this.$tool.replaceModel(this.tableData, dialog.elform.data);
          }
        });
      },

      addApi() {
        let dialog = this.modeldialog;
        dialog.title = dialog.titlepo.add;
        dialog.elform.data = this.newApi();
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.elform.rows = this.newFormRows();
        dialog.show = true;
      },
      newFormRows() {
        //console.log(4,this.poolArray)
        return [
          {name: 'label', label: "api标签："},
          {name: 'rootURL', label: "根URL：", disabled: true},
          {name: 'selfURL', label: "本级URL："},
          {name: 'databaseId', label: "数据库类型：", type: "select", options: this.poolArray,},
          {name: 'questMethod', label: "请求方式：", type: "select", options: this.questMethodArray},
          {name: 'accessId', label: "访问控制：", type: "select", options: this.accessArray},
          {name: 'crud', label: "数据操作：", type: "select", options: this.crudArray},
          {
            name: 'id',
            label: "",
            type: "table",
            tableData: this.modeldialog.elform.data.params,
            columns: this.paramTableColumns
          },
        ];
      },
      newApi() {


        let data = this.modeldialog.elform.data;
        let id = this.$uuid.v4();
        if (data) {
          data = JSON.parse(JSON.stringify(data));
          data.params = [];
          data.id = id;
          data.rootURL = this.rootURL;
          data.levelId = this.levelId;
        } else {

        }
          data = {
            id: id,
            label: "",
            accessId: this.accessArray[0].id,
            rootURL: this.rootURL,
            levelId: this.levelId,
            databaseConnectId: this.poolArray[0].id,
            questMethod: this.questMethodArray[0],
            crud:this.crudArray[0].id,
          };
        data.databaseConnectId  = localStorage.getItem('databaseConnectId');
        return data;
      },
      findRootURL(url, level) {
        if (level) {
          if (level.name) {
            url = "/" + level.name + url;
          }
          if (level.parent) {
            return this.findRootURL(url, level.parent);
          }
        }
        return url;
      },

      editApi(index, row) {
        let dialog = this.modeldialog;
        new Promise(resolve=>{
          systemApi({url: ApiURLManager.findApiById() + row.id})
            .then(api=>{
              return resolve(api);
            });
        }).then(api=>{
          dialog.elform.data = api;
          systemApi({url: ApiURLManager.findParamsByApiId() + row.id})
            .then(datas => {
              dialog.elform.data.params = datas;
              if (!dialog.elform.data.params) {
                dialog.elform.data.params = [];
              }
              dialog.elform.rows = this.newFormRows();
              dialog.title = dialog.titlepo.edit;
              dialog.currenthandle = this.$strTool.modelhandle[2];
              dialog.show = true;
            });
        });



      },
      deleteApi(index, row) {
        this.$uiTool.confirm({
          message: "确定要删除 '" + row.label + "' 吗？",
          callback: flag => {
            if (flag) {
              systemApi({url: SysURLManager.deleteByTableNameAndId(this.$strTool.apitablename, row.id)})
                .then(data => {
                  this.tableData.splice(index, 1);
                });
            }
          }
        });

      },
      init() {
        systemApi({url: ApiURLManager.findByLevelId() + this.levelId})
          .then(datas => {
            this.tableData = datas;
            //console.log(1,datas);
          });
        systemApi({url: LevelURLManager.findLevelAndParentId() + this.levelId})
          .then(level => {
            this.level = level;
            this.rootURL = this.findRootURL("", level);
          });

        systemApi({url: SysURLManager.findByTableName(this.$strTool.pooltablename)})
          .then(datas => {
            this.poolArray = datas;
            this.poolMap = this.$tool.groupByAttributeSingle(datas);
            //console.log(this.poolMap);
          });

        this.questMethodArray =  this.$store.state.share.questMethodArray;
        this.accessArray =  this.$store.state.share.accessArray;
        this.accessMap =  this.$store.state.share.accessMap;
        this.crudArray =  this.$store.state.share.crudArray;
        this.crudMap =  this.$store.state.share.crudMap;

        /*
        systemApi({url: SysURLManager.findEnums(this.$strTool.questmethodenumname)})
          .then(datas => {
            this.questMethodArray = datas;
          });
        systemApi({url: SysURLManager.findEnums(this.$strTool.accessstate)})
          .then(datas => {
            this.accessArray = datas;
            this.accessMap = this.$tool.groupByAttributeSingle(datas);
          });
        systemApi({url: SysURLManager.findEnums(this.$strTool.curd)})
          .then(datas => {
            this.crudArray = datas;
            this.crudMap = this.$tool.groupByAttributeSingle(datas);

          });*/
      }
    }
  }
</script>

<style scoped>

</style>
