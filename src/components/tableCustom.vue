<template>
  <div class="matchparent">
    <el-table
      :data="datas"
      style="width: 100%"
      border
      :header-row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      @row-click="clickTable"
    >
      <template v-for="(item, index) of columns">
        <el-table-column
          v-if="item.type === 'text'"
          :key="index"
          :fixed="item.fixed"
          :prop="item.prop"

          :label="item.label"
          :align="item.align ? item.align : 'center'"
          :width="item.width"
        >
          <template slot="header"  slot-scope="scope">
            <table-header :item="item"></table-header>
          </template>
          <!--if判断的是父组件传的表头是操作的id名   @click="item1.click(scope.row, i)"-->
          <template slot-scope="scope">
            <el-button
              v-for="(item1,i) in item.list"
              :key="i"
                @click="item1.click"
              type="text"
              size="small"
            >{{ item1.label }}</el-button
            >
            <!--可以自行增加按钮，请改变点击事件的第二个参数，父组件会根据第二个参数判断当前点击的是什么按钮-->
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.type === 'button'"
          :key="index"
          :fixed="item.fixed"
          :prop="item.prop"
          :label="item.label"
          :align="item.align ? item.align : 'center'"
          :width="item.width"
        >
          <template slot="header"  slot-scope="scope">
            <table-header :item="item"></table-header>
          </template>
          <!--if判断的是父组件传的表头是操作的id名-->
          <template slot-scope="scope" style="text-align: right">
            <el-button-group>
            <el-button
              v-for="(item2,i) in item.list"
              :key="i"
              @click="item2.click(scope.$index,scope.row)"
              size="mini"
              :type="item2.type"
              v-show="item2.show ?(item2.show( scope.$index,scope.row)):true"
            >{{ item2.label }}</el-button>
              </el-button-group>


            <!--可以自行增加按钮，请改变点击事件的第二个参数，父组件会根据第二个参数判断当前点击的是什么按钮-->
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.type === 'index'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column
          v-else
          :label="item.label"
          :key="index"
          :fixed="item.fixed"
          :prop="item.prop"
          :align="item.align ? item.align : 'center'"
          :width="item.width"
          :type="item.type"

        >
          <template slot="header"  slot-scope="scope">
            <table-header :item="item"></table-header>
          </template>
          <template slot-scope="scope">
           {{ item.formatter? item.formatter(scope.row[item.prop]) : scope.row[item.prop]}}
            <!--可以自行增加按钮，请改变点击事件的第二个参数，父组件会根据第二个参数判断当前点击的是什么按钮-->
          </template>
        </el-table-column>
        <!--可以传align,width和type来控制表格的居中，宽度和类型（比如需要序号，type传index）-->
      </template>
    </el-table>
    <el-pagination
      v-show="false"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pagesizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
  import TableHeader from "./tableHeader";
  export default {
    components: {TableHeader},
    props: {
      datas: {
        // 表格数据源 默认为空数组
        type: Array,
        default: () => []
      },
      columns: {
        // 表格的字段展示 默认为空数组
        type: Array,
        default: () => []
      },
      pagesizes: {
        type: Array,
        default: () => []
      },
      total: { type: Number, default: 0 },
      pageSize: { type: Number, default: 0 }
    },
    data() {
      return {
        currentPage: 1
      };
    },
    filters:{
      formatter(){
        console.log(11)
      },
    },
    methods: {
      formatter(){
        console.log(11)
      },
      test(obj) {
        console.log(obj);
      },
      // 正常
      handleSelectionChange(val) {
        this.$emit("handleSelectionChange", { val: val });
      },
      // 正常
      clickTable(row, column, event) {
        this.$emit("clickTable", { row: row, column: column, event: event });
      },
      // 正常
      handleEdit(index, row) {
        this.$emit("handleEdit", { index: index, row: row });
      },
      // 正常
      handleDelete(index, row) {
        this.$emit("handleDelete", { index: index, row: row });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.$emit("handleSizeChange", val);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.$emit("handleCurrentChange", val);
      },
      tableRowClassName({ row, rowIndex }) {
       /* console.log(row, rowIndex);
        if (rowIndex === 0) {
          return "warning-row";
        } else if (rowIndex === 1) {
          return "warning-row";
        }
        return "";*/
      }
    }
  };
</script>
<style >

</style>
