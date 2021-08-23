<template>
  <div class="nvlist">
    <div class="nvitem box"
         v-for="(item,index ) in nav.navArray"
         :key="index"
         :class="nav.index === index&&'active'"
         @click="  (nav.index = index) | (nav.id = item.id) | navClick(index,item)"
    >
      <div class="item">
          <div class="label" v-if="item.label">{{item.label}}</div>
          <div class="value" v-if="item.value">{{item.value}}</div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "navlist",
        props:{
          nav:{
            type: Object,
            default: {
              navArray: {
                type: Array,
              },
              index:{
                type:Number,
                default: 0
              },
            }
          }
        },
      methods:{
        navClick(index,item){
          //this.$emit("navClick",index,item);
        }
      }
    }
</script>

<style scoped>

</style>
