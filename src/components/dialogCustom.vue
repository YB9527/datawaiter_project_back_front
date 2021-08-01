<template>
  <el-dialog :title="modeldialog.title" :visible.sync="modeldialog.show" :width="modeldialog.width" >
    <form-custom :elform="modeldialog.elform"></form-custom>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import FormCustom from "./formCustom";
  export default {
    name: "dialogCustom",
    components: {FormCustom},
    props: ['modeldialog'],
    data(){
      return{

      }
    },
    created() {
      if(this.modeldialog.currenthandle === this.$strTool.modelhandle[2]){
        this.modeldialog.elform.data =  this.$tool.copy(this.modeldialog.elform.data);
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

<style scoped>

</style>
