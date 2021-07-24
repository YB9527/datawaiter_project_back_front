<template>
  <div v-if="dialogdata.show">
    <el-dialog
      class="dialog"
      :title="dialogdata.titleAMap[dialogdata.state].title"
      :visible.sync="dialogdata.show"
      :width="dialogdata.width"
      append-to-body
    >
      <div class="form">

        <el-row :gutter="layout.gutter" class="formitem" v-for="(row,index) in rowArray" :key="index">
          <el-col :span="config[column.enum+'gutter']" v-for="(column,j) in row" :key="index*100+j">
            <div :class="column.type">
                <div v-if="!column.type || column.type === 'text'">{{column.text}}</div><!--文字-->
                <el-input  v-if="column.type === 'input'" v-model="data[column.props]" :placeholder="column.placeholder"></el-input>
                <uploadImage  v-if="column.type === 'uploadimage'" :elupload="data[column.props]" ></uploadImage>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogdata.show = false">取 消</el-button>
        <el-button type="primary" @click="dialogdata.ok(dialogdata)">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import uploadImage from '@/components/common/uploadImage.vue'
    export default {
        name: "myDialog",
        props:{
          dialogdata:{}
        },
      components:{uploadImage,},
        data(){
          let data =  this.dialogdata.data;
          let layout = this.dialogdata.layout;
          let config = layout.config;
          let rowArray = layout.rowArray;
          return{
            data,
            config,
            layout,
            rowArray,
          }
        }
    }
</script>

<style lang="scss" scoped>
  .dialog {
    .form {
      .label {
        text-align: right;
      }

      .formitem {
        margin-bottom: 10px;
        width: 100%;
      }

      .el-row {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
