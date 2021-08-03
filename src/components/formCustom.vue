<template>
  <div class="matchparent">
    <el-form label-position="right" v-model="elform.data" label-width="120px">
      <el-form-item v-for="(row,i) in elform.rows" :key="i" :label="row.label"
                    :label-width="row.type === 'table'?'0px':''">
        <el-select v-model="elform.data[row.name]" v-if="row.type === 'select'" @change="optionChange($event,row)"
                   @input="onInput()">
          <el-option
            v-for="(item,j) in row.options"
            :key="j"
            :label="item.label"
            :value="item.id?item.id:item"
          >
          </el-option>
        </el-select>
        <el-cascader
          v-model="elform.data[row.name]" v-if="row.type === 'cascader'"
          :options="row.options"
        ></el-cascader>

        <el-input v-model="elform.data[row.name]" :disabled="row.disabled" v-if="!row.type"
                  @input="onInput()"></el-input>
        <table-custom
          v-if="row.type === 'table'"
          :datas="row.tableData"
          :columns="row.columns">
        </table-custom>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import TableCustom from "./tableCustom";

  export default {
    name: "formCustom",
    components: {TableCustom},
    props: ['elform'],
    data() {
      return {
        data: {},
      }
    },
    created() {

    },
    filters: {
      test(va) {
        console.log("filter", va);
        return va;
      }
    }, methods: {
      onInput() {
        this.$forceUpdate();
      },
      optionChange(key, row) {
        if (row.change) {
          row.change(key);
        }
      }
    }

  }
</script>

<style scoped>

</style>
