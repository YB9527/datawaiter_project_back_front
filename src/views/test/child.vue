<template>
    <div class="ch">
        <slot>我是默认信息</slot>
    </div>
</template>

<script>
    export default {
        name: "child"
    }
</script>

<style lang="scss" >
  .ch{
    .t{
      color: #5daf34;
    }
  }

</style>
