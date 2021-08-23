<template>
  <div class="userindexvue matchparent  bg">
    <div class="topnav">
      <navlist @click="navClick" :nav="nav"></navlist>
    </div>
    <div class="line"></div>
    <div class="content">
      <employee v-if="'ry' === nav.id"></employee>
      <organization v-if="'zzjg' === nav.id"></organization>
      <role v-if="'role' === nav.id"></role>
      <position v-if="'zhiwei' === nav.id"></position>
    </div>
  </div>
</template>

<script>
  import navlist from '@/components/common/navlist.vue'
  import employee from '@/components/user/employee.vue'
  import organization from '@/components/user/organization.vue'
  import position from '@/components/user/position.vue'
  import role from '@/components/user/role.vue'

  export default {
    name: "user",
    components:{navlist,employee,organization,position,role},
    data() {
      return {
        nav: {
          index: 0,
          id: "zhiwei",
          navArray: [
            {id: "zzjg", label: "部门"},
            {id: "zhiwei", label: "岗位"},
            {id: "role", label: "角色"},
            {id: "ry", label: "人员"},
          ]
        },
      }
    },
    methods:{
      navClick(index,item){

      },
    }
  }
</script>

<style lang="scss">
  .userindexvue{
    .content {
      height: calc(100% - 100px);
    }
  }
</style>
