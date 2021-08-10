<template >
    <div>
      <el-tag>标签一</el-tag>
      <child >
          <div v-html="tem">
            {{tem}}
          </div>
      </child>
    </div>
</template>

<script>
  import child from  './child'
  import Vue from 'vue';
    export default {
        name: "test",
      components:{child},
      data(){
          return{
              tem:
               '<div class="t">123456</div><<span class="el-tag el-tag--light">标签一</span>'
              ,
          }
      }
    }
</script>

<style >

</style>
