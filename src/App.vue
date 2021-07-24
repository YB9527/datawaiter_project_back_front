<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    height: 100%;
  }

  .box {
    border-radius: 15px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
    background-color: #FFFFFF;
  }
  .row{
    display: flex;
  }
  .sprow{
    display: flex;
    justify-content: space-between;
  }
  .itemmargin{
    margin-top: 20rpx;
  }
</style>
