<template>
  <el-drawer

    :title="modeldialog.title"
    :visible.sync="modeldialog.show"
    direction="ltr"
    custom-class="demo-drawer"
    :size=modeldialog.width
  >
    <div class="demo-drawer__content" style="padding: 1%">
      <form-custom :elform="modeldialog.elform"></form-custom>
      <div class="demo-drawer__footer" style="float: right">
        <el-button @click="cancel" size="medium">取 消</el-button>
        <el-button type="primary"  @click="ok"  size="medium">确 定</el-button>
      </div>
    </div>
  </el-drawer>

</template>

<script>
    import FormCustom from "./formCustom";
    export default {
        name: "drawerCustom",
      components: {FormCustom},
      props: ['modeldialog'],
      created(){
        if(this.modeldialog.currenthandle === this.$strTool.modelhandle[2]){
          //this.modeldialog.elform.data =  this.$tool.copyPo(this.modeldialog.elform.data);
        }
      },
      methods: {
        cancel() {
          this.modeldialog.show =false;
          if(this.modeldialog.cancelClickName){
            this.$parent[this.modeldialog.cancelClickName](this.modeldialog);
          }
        },
        ok(){

          if(this.modeldialog.okClickName){
            this.$parent[this.modeldialog.okClickName](this.modeldialog);
          }
        },
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
  .el-drawer{

    overflow-x:auto;
    overflow-y:auto;
  }

</style>
