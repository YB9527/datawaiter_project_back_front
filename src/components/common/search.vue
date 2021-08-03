<template>
  <div >
    <el-input v-model="queryTem.key" :placeholder="queryTem.placeholder">
    </el-input>
    <span ><svg-icon iconClass=""/></span>
    <div class="btn" @click="queryTem.searchClick?queryTem.searchClick(queryTem.key):''">{{queryTem.label?queryTem.label:'搜索' }} </div>
  </div>
</template>

<script>
  export default {
    name: "search",
    props: ['query'],
    data() {
      return {
        queryTem: {
          key: "",
          placeholder: "",
          searchClick: "",
        }
      }
    },
    mounted() {
      if (this.query) {
        this.queryTem = this.query;
      }
    }
  }
</script>

<style scoped>

  div >>> .el-input__inner {
    border-radius: 0;
    padding: 0px 82px 0px 45px;
    color: #4f4b52;
    height: 50px;
    line-height: 20px;
    background:#eeeeee;
    border: 1px solid #aea0b4;
  /*  border: none;*/
  }

  div {
    position: relative;
  }

  span {
    position: absolute;
    top: 11px;
    left: 5px;
    background: url('/static/images/搜索框_搜索.png') no-repeat;
    z-index: 2 ;
  }
  .btn{
    position: absolute;
    top: 0px;
    right: 0px;
    cursor: pointer;
    line-height: 50px;
    text-align: center;
    width: 80px;
    height: 50px;
    background: #EBB741;
    border-radius: 0px 4px 4px 0px;


    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #222222;
  }
  .el-input input::-webkit-input-placeholder {
    color:#AEABAB;
  }
  .svg-icon[data-v-c8a70580] {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  /deep/.el-input__inner:focus{
    border: 1px solid #eeeeee;
  }
</style>
