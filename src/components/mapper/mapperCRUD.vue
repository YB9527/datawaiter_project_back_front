<template>

    <el-drawer
      :append-to-body="true"
      :title="mapperdialog.title +' ID:'+ mapper.id+'——表格：'+mapper.tableName"
      :visible.sync="mapperdialog.show"
      direction="ltr"
      custom-class="demo-drawer"
      :size=mapperdialog.width
    >
      <div style="padding: 0 20px;text-align: center">
        <el-row :gutter="20">
          <el-col :span="6" >
            <label class=" col-form-label ">mapper标签：</label>
            <div>
              <el-input type="email" class="form-control" v-model="mapper.label" />
            </div>
          </el-col>
          <el-col :span="4">
            <label class=" col-form-label">操作类型：</label>
            <div >
              <el-select v-model="mapper.crud" @input="onInput()">
                <el-option
                  v-for="(item,i) in $store.state.share.mapperCreateEnumArray"
                  :key="i"
                  :label="item.label"
                  :value="item.id?item.id:item"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="14" >
            <label class="col-form-label" v-show="mapper.crud === 'SELECT'">SQL语句：</label>
              <div v-show="mapper.crud === 'SELECT'">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2}"
                  v-model="mapper.sql_">
                </el-input>
              </div>


          </el-col>
        </el-row>
      </div>

      <div v-show="mapper.crud === 'SELECT'">
        <div class="grid-content bg-purple" style="padding-left: 20px">
          <h5 style="line-height: 40px"> 参数替换 、 字段映射 </h5>
        </div>
        <el-table
          :data="mapper.resultColumns"
          style="width: 100%">
          <el-table-column
            label='property'
          >
            <template slot-scope="scope">
              <el-input class="form-control" v-model="scope.row.property"/>
            </template>
          </el-table-column>

          <el-table-column
            label='对象关系'
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.poRelation">
                <el-option
                  v-for="item in $store.state.share.poRelationArray"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>


          <el-table-column
            prop="mapperId"
            label='映射'
          >
            <template slot-scope="scope">
              <!--  <el-cascader  v-model="scope.row.column_MapperId" :props="props"   :options="tables">
                </el-cascader>-->

              <mapper-select  v-if="scope.row.poRelation !== 'no'"
                              :dataCustom="{data:scope.row,key:'column_MapperId'}"
                              :databaseId="mapper.databaseId"
                              :isReflect="true"
                              @mapperSelectChange="mapperSelectChange"
                              :crudEnum="'SELECT'"></mapper-select>
              <!-- <el-cascader
                 placeholder="选择映射"
                 v-if="scope.row.poRelation !== 'no'"
                 v-model="scope.row.column_MapperId"
                 :options="column_MapperIdOptions"
               ></el-cascader>-->
            </template>
          </el-table-column>

          <el-table-column
            label='映射对象字段'
          >
            <template slot-scope="scope">
              <el-input class="form-control" :disabled="true" v-model="scope.row.column_" v-if="scope.row.poRelation !== 'no'"/>
            </template>
          </el-table-column>

          <el-table-column
            label='测试值'
          >
            <template slot-scope="scope">
              <el-input class="form-control" v-model="scope.row.testValue" v-if="scope.row.poRelation === 'no'"/>
            </template>
          </el-table-column>

          <el-table-column
            align="right"
          >
            <template slot="header" slot-scope="scope">
              <el-button type="info" @click="addResultColumn" size="mini" plain>添加参数</el-button>
              <el-button type="info" @click="previewingData(mapper)" v-if="mapper.crud === 'SELECT'" size="mini"
                         plain>预览
              </el-button>
              <el-button type="info" v-if="mapper.crud !== 'SELECT'" size="mini" plain>测试</el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="removeResultColumn(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <cud-config :mapper="mapper" style="text-align: center;width: 500px" v-show="mapper.crud !== 'SELECT'">
      </cud-config>

      <div class="demo-drawer__footer" style="float: right">
        <el-button @click="cancel" size="medium">取 消</el-button>
        <el-button type="primary" @click="ok" size="medium">确 定</el-button>
      </div>
      <el-dialog
        :append-to-body="true"
        :title="preveiwDialog.title" :visible.sync="preveiwDialog.show" :width="preveiwDialog.width">
        <table-custom :datas="preveiwDialog.datas" :columns="preveiwDialog.columns"></table-custom>
      </el-dialog>
    </el-drawer>
</template>

<script>
  import axios from 'axios'
  import FormCustom from "../formCustom";
  import TableCustom from "../tableCustom";
  import DialogCustom from "../dialogCustom";
  import CudConfig from "./cudConfig";

  import {systemApi} from '@/api/datarequset.js';
  import ApiURLManager from '@/api/ApiURLManager.js'
  import DatabaseConnURLManager from '@/api/DatabaseConnURLManager.js'
  import MapperURLManager from '@/api/MapperURLManager.js'
  import MapperSelect from "./mapperSelect";

  export default {
    name: "mapperCRUD",
    components: {MapperSelect, CudConfig, DialogCustom, TableCustom, FormCustom},
    props: {
      mapper: {},
      mapperdialog: {
        show: false,
        width: '',
        titlepo: {},
        title: "",
        currenthandle: "",
        data: "",
        okClickName: "",
      },
      paramTableShow: true,
    },

    data() {
      return {
        drawer: true,
        innerDrawer: true,
        tables: [],
        id: 1,
        column_MapperIdOptions: [],
        props: {
          lazy: true,
          label: "name",
          value: "id",
          lazyLoad: ((node, resolve) => {
            //console.log(1)
            let tableName = node.label;
            let nodes = [];
            systemApi({url: MapperURLManager.findMappersByDatabaseIdAndTableName(this.mapper.databaseId, tableName)})
              .then(mappers => {
                for (let mapper of mappers) {
                  nodes.push({id: mapper.id, name: mapper.label, leaf: 1});
                }
                resolve(nodes);
              })
          })
        },
        preveiwDialog: {
          show: false,
          width: '80%',
          title: "预览数据",
          datas: [],
          columns: [],
        },


      };
    },
    created() {
     // console.log(1,this.mapperdialog);
      let databaseId = this.mapper.databaseId;
      //console.log(this.mapper);
      systemApi({url: DatabaseConnURLManager.findTableAllByDatabaseId() + databaseId})
        .then(tables => {
          this.tables = [];
          for (let table of tables) {
            this.column_MapperIdOptions.push({value: table.name, label: table.name, children: []});
          }

          let tableMap = this.$tool.groupByAttributeSingle(this.column_MapperIdOptions, "value");
          this.tables = tables;
          systemApi({url: MapperURLManager.findMappersByDatabaseId(databaseId)})
            .then(mappers => {
              for (let mapper of mappers) {
                let tem = tableMap[mapper.tableName];
                tem.children.push({value: mapper.id, label: mapper.label});
              }

              if (this.mapper.resultColumns) {
                for (let resultColumn of  this.mapper.resultColumns) {
                  if (resultColumn.column_MapperId) {
                    for (let mapper of mappers) {

                      if (mapper.id === resultColumn.column_MapperId) {
                        resultColumn.column_MapperId = [mapper.tableName, resultColumn.column_MapperId];
                      }
                    }
                  }
                }
              }
            });
          // console.log(this.tables);
        });
    },


    methods: {
      mapperSelectChange({data,mapper}){
        console.log(mapper);
        if(mapper){
          debugger
        }
        let property =mapper.resultColumns[0].property;
       //console.log(2,data,property);
        if(property){
          data.column_=property;
        }
        //console.log(111,property)
      },


      addResultColumn() {
        this.mapper.resultColumns.push({id: this.$uuid.v4()});
      },
      questMethodChange() {
        switch (this.mapper.questMethod) {
          case "GET":
            this.mapper.crud = "SELECT";
            break;
          case "POST":
            this.mapper.crud = "INSERT";
            break;
        }

      },
      testPostApi(mapper) {

        if (mapper.params && mapper.params.length > 0) {
          systemApi({url: ApiURLManager.testPostApi(), data: mapper})
            .then(count => {
              this.$uiTool.messageBox({message: "执行成功的个数：" + count});
            });
        } else {
          this.$uiTool.notify({message: "没有参数无法测试"})
        }
      },
      previewingData(mapper) {
        mapper = this.$tool.copy(mapper);
      /*  for (let resultColumn of  mapper.resultColumns) {
          if (resultColumn.column_MapperId) {
            resultColumn.column_MapperId = resultColumn.column_MapperId[1];
          }
        }*/

        systemApi({url: MapperURLManager.mapperTest(),method:"post", data: mapper})
          .then(datas => {
            if (!datas || datas.length <= 0) {
              this.$uiTool.notify({message: "无数据", title: "预览数据"});
              return;
            }
            let columns = [{
              type: "index",
              label: "序列号",
              width: "120",
              prop: "",
              isShow: true,
              align: "center"
            },];
            this.preveiwDialog.columns = columns;
            this.preveiwDialog.datas = datas;
            for (let columnname in datas[0]) {
              columns.push({
                label: columnname,
                prop: columnname,
                isShow: true,
                align: "center"
              });
            }
            this.preveiwDialog.show = true;
          });

      },
      removeResultColumn(index, row) {
        this.$uiTool.confirm({
          message: "确定要删除：" + row.property + " 参数吗？",
          callback: flag => {
            if (flag) {
              this.mapper.resultColumns.splice(index, 1);
            }
          }
        });
      },

      onInput() {
        this.$forceUpdate();
      },
      cancel() {
        //console.log(222,this.mapperdialog.data.resultColumns[0].column_MapperId)
        this.mapperdialog.show = false;
        if (this.mapperdialog.cancelClickName) {
          this.$parent[this.mapperdialog.cancelClickName](this.mapperdialog);
        }
      },
      ok() {
        //console.log(333,this.mapperdialog.data.resultColumns[0].column_MapperId)
       /* for (let resultColumn of  this.mapper.resultColumns) {
          if (resultColumn.column_MapperId) {
            resultColumn.column_MapperId = resultColumn.column_MapperId[1];
          }
        }*/

        if (this.mapperdialog.okClickName) {
          this.$parent[this.mapperdialog.okClickName](this.mapperdialog);
        }
      },

    }
  }
</script>

<style scoped>
  /deep/ .el-drawer__header{
    padding: 10px 0 0 0;
  }
  /deep/ .el-drawer__header{
    margin-bottom: 20px;
  }
  .el-col,.col-form-label {
    text-align: left;
    vertical-align: middle;
    font-size: 12px;
    color: #8a8c8f;
  }
  /deep/ .el-select{
    width: 100%;
  }
  \deep\ .el-drawer__header {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #72767b;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 2px;
    padding: 20px 20px 0;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
