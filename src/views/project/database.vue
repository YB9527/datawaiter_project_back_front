<template>
  <div>
    <!--  <el-button @click="addTestData">添加测试数据</el-button>-->
    <!-- <el-button type="warning" @click="testConn">测试事务</el-button>-->
    <TableCustom
      :datas="tableData"
      :columns="columns"
    ></TableCustom>
    <dialog-custom :modeldialog="modeldialog" v-if="modeldialog.show"></dialog-custom>
    <!-- <el-dialog :title="modeldialog.title" :visible.sync="modeldialog.show" v-if="modeldialog.show" width="500px">
       <formCustom :elform="modeldialog.elform"></formCustom>
       <div slot="footer" class="dialog-footer">
         <el-button @click="modeldialog.show = false">取 消</el-button>
         <el-button type="primary" @click="modeldialogOk(modeldialog)">确 定</el-button>
       </div>
     </el-dialog>-->
  </div>


</template>

<script>
  import TableCustom from "@/components/tableCustom";
  import formCustom from "@/components/formCustom.vue";
  import {systemApi} from '@/api/datarequset.js';
  import DatabaseConnURLManager from '@/api/DatabaseConnURLManager.js';
  import SysURLManager from '@/api/SysURLManager.js';
  import DialogCustom from "@/components/dialogCustom";

  export default {
    components: {DialogCustom, TableCustom, formCustom},
    data() {
      return {
        databaseEnumArray: [],
        tableData: [],
        columns: [
          /*{
            type: "index",
            label: "序列号",
            width: "120",
            prop: "",
            isShow: true,
            align: "center"
          },*/
          {
            label: "名称",
            prop: "label",
            isShow: true,
            align: "center"
          },
          {
            label: "IP地址",
            width: "300",
            prop: "ip",
            isShow: true,
            align: "center"
          },
          {
            label: "数据库类型",
            prop: "databaseEnum",
            width: "150",
            isShow: true,
            align: "center",
          },
          {
            label: "数据库名称",
            prop: "databaseName",
            isShow: true,
            align: "center"
          },
          {
            label: "账号",
            width: "120",
            prop: "username",
            isShow: true,
            align: "center"
          },
         /* {
            label: "密码",
            width: "120",
            prop: "password",
            isShow: true,
            align: "center"
          },*/
          {
            label: "API数量",
            width: "120",
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
            headers: [
              {
                type: 'button',
                label: "添加连接",
                click: () => {
                  this.addConnection();
                },
              },
              {
                type: 'button',
                label: "断开所有连接",
                click: () => {
                  this.breakConnection();
                },
              }],
            list: [
              /*{
                label: "查看",
                type: "info",
                click: (index, row) => {
                  this.lookConnection(index, row);
                },
              },*/
             /* {
                label: "装备Bean",
                type: "info",
                click: (index, row) => {
                  this.$router.push({path: '/project/mapper?databaseId=' + row.id});
                },
              },*/
              {
                label: "编辑",
                type: "warning",
                click: (index, row) => {
                  this.editConnection(index, row);
                },
              },
              {
                label: "删除",
                type: "danger",
                click: (index, row) => {
                  this.deleteConnection(index, row);
                },
              }
            ]
          },
        ],
        modeldialog: {
          show: false,
          width: '500px',
          titlepo: {add: "添加连接池", edit: "编辑连接池", look: "查看连接池"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "modeldialogOk"
        }
      }
    },
    computed: {
      'project'() {
        return this.$store.state.project.project;
      }
    },
    created() {
      //所有数据库类型
      this.databaseEnumArray = this.$store.state.share.databaseEnumArray;
      /* systemApi({url: DatabaseConnURLManager.findDatabaseEnum()})
         .then(datas => {
           this.databaseEnumArray = datas;
         });*/
      //console.log(this.$store.state.project.project.id);
      systemApi({url: DatabaseConnURLManager.findByProjectid(this.project.id)})
        .then(datas => {
          this.tableData = datas;
          //console.log(1,datas);
        });

    },
    methods: {
      breakConnection(){
        let url = "/sys/breakconnect" ;
        systemApi({url});
      },
      modeldialogOk(modeldialog) {

        switch (modeldialog.currenthandle) {
          case this.$strTool.modelhandle[0]:
            systemApi({url: DatabaseConnURLManager.addConnection(), method: "post", data: modeldialog.elform.data})
              .then(data => {
                if(data){
                  this.tableData.push(modeldialog.elform.data);
                  modeldialog.show = false;
                }else{
                  this.$message.error('连接失败');
                }

              });
            break;
          case this.$strTool.modelhandle[1]:
            break;
          case this.$strTool.modelhandle[2]:
            systemApi({url: DatabaseConnURLManager.editConnection(), method: "post", data: modeldialog.elform.data})
              .then(data => {
                if(data){
                  this.$tool.replaceModel(this.tableData, modeldialog.elform.data);
                  modeldialog.show = false;
                }
              });
            break;
          case this.$strTool.modelhandle[3]:
            break;
        }
      },
      newFormRows() {
        return [
          {name: 'label', label: "名称："},
          {name: 'ip', label: "IP地址："},
          {name: 'databaseEnum', label: "数据库类型：", type: "select", options: this.databaseEnumArray},
          {name: 'databaseName', label: "数据库名称："},
          {name: 'username', label: "账号："},
          {name: 'password', label: "密码："},
        ];
      },
      newPool() {
        let id = this.$uuid.v4();
        let data = {
          id: id,
          projectid: this.project.id,
          label: "",
          ip: "127.0.0.1:3306",
          databaseEnum: this.databaseEnumArray[0],
          databaseName: "",
          username: "",
          password: "",
        };
        return data;
      },
      addConnection() {
        let dialog = this.modeldialog;
        dialog.elform.rows = this.newFormRows();
        dialog.title = dialog.titlepo.add;
        dialog.elform.data = this.newPool();
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.show = true;
      },
      editConnection(index, row) {
        let dialog = this.modeldialog;
        dialog.elform.rows = this.newFormRows();
        dialog.title = dialog.titlepo.edit;
        dialog.elform.data = this.$Tool.copy(row);
        dialog.currenthandle = this.$strTool.modelhandle[2];
        dialog.show = true;
      },
      deleteConnection(index, row) {
        this.$uiTool.confirm({
          message: "确定要删除" + row.label + "吗？",
          callback: flag => {
            if (flag) {
              systemApi({url: SysURLManager.deleteByTableNameAndId(this.$strTool.pooltablename, row.id)})
                .then(data => {
                  this.tableData.splice(index, 1);
                });
            }
          }
        });

      },
      lookConnection(index, row) {
        console.log(index, row);
      }
    },
  }
</script>

<style scoped>
  /deep/ .el-select{
    width: 100%;
  }
</style>
