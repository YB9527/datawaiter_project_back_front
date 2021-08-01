<template>
  <div class="matchparent">
    <el-button type="info" @click="addRoot">添加根节点</el-button>
    <el-tree
      :data="resultColumnCUDs"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.property +"："+data.tableName }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog :append-to-body="true" :title="dialog.title" :visible.sync="dialog.show" :width="dialog.width">

      <el-form ref="form" :model="dialog.data" label-width="80px">
        <el-form-item label="关联表格">
          <el-radio-group v-model="dialog.data.tableName" >
            <el-radio v-for="(table, i) in tables" :key="i" :label="table.name"> {{table.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="property">
          <el-input v-model="dialog.data.property"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="editdialogOk(dialog)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {systemApi} from '@/api/datarequset.js';
  import ApiURLManager from '@/api/ApiURLManager.js'
  import DatabaseConnURLManager from '@/api/DatabaseConnURLManager.js'
  import MapperURLManager from '@/api/MapperURLManager.js'

  let id = 1000;
  export default {
    name: "cudConfig",
    props: {
      mapper: {id,},
    },
    data() {
      return {
        defaultProps: {
          children: 'resultColumnCUDs',
          label: 'tableName'
        },
        dialog: {
          show: false,
          width: '50%',
          titlepo: {add: "添加字段映射", edit: "编辑字段映射"},
          title: "",
          currenthandle: "",
          data: {},
          parentData: undefined,
        },
        resultColumnCUDs: [],
        tables: [],
      }
    },
    watch:{
      'dialog.data.tableName'(val){
        this.dialog.data.property = val;
      }
    },
    created() {
      //查询所有的 cud 节点
      systemApi({url: MapperURLManager.findResultColumnCUDByMapperId(this.mapper.id)})
        .then(resultColumnCUDs => {
          if (!resultColumnCUDs) {
            resultColumnCUDs = [];
          }
          this.mapper.resultColumnCUDs = resultColumnCUDs;
          this.resultColumnCUDs = resultColumnCUDs;
        });
      //查询 mapper 数据库的所有表格
      systemApi({url: DatabaseConnURLManager.findTableAllByDatabaseId() + this.mapper.databaseId})
        .then(tables => {
          this.tables = tables;
        });
    },
    methods: {
      addRoot() {
        this.dialog.currenthandle = this.$strTool.modelhandle[0];
        this.dialog.data = this.newCUDMapper();
        this.dialog.parentData = undefined;
        this.dialog.show = true;
      },
      editdialogOk(dialog) {
        let data = dialog.data;
        let parentData = dialog.parentData;

            dialog.show = false;
            switch (dialog.currenthandle) {
              case this.$strTool.modelhandle[0]:
                if (parentData) {
                  parentData.resultColumnCUDs.push(dialog.data);
                } else {
                  this.resultColumnCUDs.push(data);
                }
                break;
              case this.$strTool.modelhandle[2]:
                break;
            }

      },
      editResultColumnCUD(data) {
        return new Promise(resolve => {
          systemApi({url: MapperURLManager.editResultColumnCUD(), data: data})
            .then(count => {
              resolve(count);
            });
        });
      },
      newCUDMapper(parentData) {
        let newData = {
          id: this.$uuid.v4(),
          property: "",
          tableName: "",
          mapperId: this.mapper.id,
          parentId: parentData ? parentData.id : undefined,

        };
        if (parentData) {
          if (!parentData.resultColumnCUDs) {
            parentData.resultColumnCUDs = [];
          }
        }
        return newData;
      },
      append(data) {
        this.dialog.data = this.newCUDMapper(data);
        this.dialog.parentData = data;
        this.dialog.currenthandle = this.$strTool.modelhandle[0];
        this.dialog.show = true;
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.resultColumnCUDs || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

    },
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
