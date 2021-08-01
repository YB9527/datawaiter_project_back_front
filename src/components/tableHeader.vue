<template>
  <div>
    <div v-if="!item.headers">
      {{item.label}}
    </div>
    <div v-if="item.headers">
      <span v-for="(header,i) in item.headers" style="margin-right: 5px">
         <el-input
           v-if="header.type == 'input'"
           v-model="header.model"
           size="mini"
           :placeholder="header.placeholder">
      </el-input>
      <el-input
        v-if="header.type == 'input'"
        v-model="header.model"
        size="mini"
        :placeholder="header.placeholder">
      </el-input>
      <el-button
        v-if="header.type == 'button'"
        @click="header.click"
        :size="header.size?header.size:'mini'"
        :placeholder="header.placeholder">
        {{header.label}}
      </el-button>
      </span>

    </div>
  </div>

</template>


<script>
  export default {
    name: "tableHeader",
    props: ['item'],
    methods: {

    }
  }
</script>

<style scoped>

</style>
