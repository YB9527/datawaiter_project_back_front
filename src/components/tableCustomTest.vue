<template>
  <div>
    <TableCustom
      :datas="tableData"
      :columns="columns"
    ></TableCustom>

  </div>


</template>

<script>
  import TableCustom from "./tableCustom";


  export default {
    components: { TableCustom},
    data() {
      return {
        tableData: [
          {
            date: "2016-05-03",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "上海市普陀区金沙江路 1518 弄",
            zip: 200333
          },
          {
            date: "2016-05-02",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "上海市普陀区金沙江路 1518 弄",
            zip: 200333
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "上海市普陀区金沙江路 1518 弄",
            zip: 200333
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "上海市普陀区金沙江路 1518 弄",
            zip: 200333
          },
          {
            date: "2016-05-08",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "上海市普陀区金沙江路 1518 弄",
            zip: 200333
          },
          {
            date: "2016-05-06",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "上海市普陀区金沙江路 1518 弄",
            zip: 200333
          },
          {
            date: "2016-05-07",
            name: "王小虎",
            province: "上海",
            city: "普陀区",
            address: "上海市普陀区金沙江路 1518 弄",
            zip: 200333
          }
        ],
        columns: [
          /* {
             id: "selection",
             type: "selection",
             label: "",
             width: "55",
             prop: "",
             isShow: true,
             align: "center"
           },*/

          {

            id: "text",
            type: "text",
            label: "跳转",
            width: "120",
            prop: "",
            isShow: true,
            align: "center",
            list: [{id: "jump", label: "跳转", type: "", handleClick: this.jump}]
          },
          {
            id: "index",
            type: "index",
            label: "序列号",
            width: "120",
            prop: "",
            isShow: true,
            align: "center"
          },
          {
            id: "date",
            type: "",
            label: "日期",
            width: "150",
            prop: "date",
            isShow: true,
            align: "center"
          },
          {
            id: "name",
            type: "",
            label: "姓名",
            width: "120",
            prop: "name",
            isShow: true,
            align: "center"
          },
          {
            id: "province",
            type: "",
            label: "省份",
            width: "120",
            prop: "province",
            isShow: true,
            align: "center"
          },
          {
            id: "city",
            type: "",
            label: "市区",
            width: "120",
            prop: "city",
            isShow: true,
            align: "center"
          },
          {
            id: "address",
            type: "",
            label: "地址",
            width: "300",
            prop: "address",
            isShow: true,
            align: "center"
          },
          {
            id: "zip",
            type: "",
            label: "邮编",
            width: "120",
            prop: "zip",
            isShow: true,
            align: "center"
          },
          {
            id: "button",
            type: "button",
            label: "操作",
            prop: "",
            isShow: true,
            align: "center",
            header:{
              type:'button',
              label:"添加连接",
              click:()=>{
                console.log("点击了");
              }
            },
            list: [
              {
                label: "查看",
                type: "warning",
                click:(row,index)=>{
                  console.log(row,index)
                }
              },
              {
                label: "编辑",
                type: "danger",
                click:(row,index)=>{
                  console.log("编辑")
                }
              }
            ]
          },
        ],

      }
    },
    created() {

    },
    methods: {

    },
  }
</script>

<style scoped>

</style>
