<template>
  <el-cascader
    placeholder="选择Mapper"
    v-model="select"
    :options="column_MapperIdOptions"
    :key="keyValue"
  ></el-cascader>
</template>

<script>
  import {systemApi} from '@/api/datarequset.js';
  import DatabaseConnURLManager from '@/api/DatabaseConnURLManager.js'
  import MapperURLManager from '@/api/MapperURLManager.js'

  export default {
    name: "mapperSelect",
    props: {
      dataCustom: {data: {}, key: ''},
      api:"",
      databaseId: '',
      crudEnum: '',
      value:'',
      isReflect:false,
    },
    data() {
      return {
        keyValue:0,
        select:"",
        column_MapperIdOptions: [],
        self_mapperId: "",
        mapper: {},
        mapperIdMap:{},
      }
    },

    watch:{
      select(v){
        //console.log(v);
        if(v && v.length >0){
          let mapperId = v[v.length-1];
          this.dataCustom.data[this.dataCustom.key] =mapperId;
        //console.log(this.mapperIdMap[mapperId].resultColumns[0]);
          //console.log([this.dataCustom.data,this.mapperIdMap[mapperId]])
          let mapper = this.mapperIdMap[mapperId];
          let data = {data:this.dataCustom.data,mapper: mapper};

          //data={aa:'123',bb:'11111'};
          //console.log(1,data)
          //console.log(this.dataCustom);
         // this.dataCustom.ok(this.mapperIdMap[mapperId].label);
          this.$emit('mapperSelectChange',data);
          if(this.api && !this.api.label){

            this.api.label = mapper.label;
          }
        }
      },
      databaseId(){
        this.init();
      },
      crudEnum(){
       this.init();
      },
      column_MapperIdOptions(newVal) {
       // console.log(5,newVal)
        this.keyValue++ //只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
      }
    },
    created() {

      this.init();

    },
    methods: {
      init(){
      /*  setTimeout(()=>{
          console.log(11,this.select);
          console.log(12,this.column_MapperIdOptions);
        },3000)
        console.log(1,this.databaseId);
        //console.log(11111)
        console.log(3,this.dataCustom);*/
        this.self_mapperId = this.mapperId;
        if(!this.databaseId){
          return;
        }
        let yuanlaiCount = this.column_MapperIdOptions;
       /* console.log(this.column_MapperIdOptions)
        if(this.column_MapperIdOptions.length > 0){
          this.column_MapperIdOptions.splice(0,this.column_MapperIdOptions.length);
        }*/

        systemApi({url: DatabaseConnURLManager.findTableAllByDatabaseId() + this.databaseId})
          .then(tables => {
            let options = [];
            for (let table of tables) {
              options.push({value: table.name, label: table.name, children: []});
            }

            //console.log(tables);
            //console.log(options);
            let tableMap = this.$tool.groupByAttributeSingle(options, "value");
            systemApi({url: MapperURLManager.findMappersByDatabaseId(this.databaseId)})
              .then(mappers => {

                this.mapperIdMap = this.$tool.groupByAttributeSingle(mappers,"id");
                //console.log(11, this.mapperIdMap)
                for (let mapper of mappers) {
                  //console.log(mapper.label);
                  if('餐桌订单——根据canzhuoid查找' ==mapper.label){
                   // debugger
                  }
                  let tem = tableMap[mapper.tableName];
                  if(this.isReflect){
                    //如果选择的是映射对象，那么，resultcoumns 个数必须是 1
                    if(!mapper.resultColumns || mapper.resultColumns.length !== 1){
                      //continue;
                    }
                  }

                  if ((this.crudEnum === 'SELECT' && mapper.crud ===  'SELECT') || (this.crudEnum !== 'SELECT' && mapper.crud !==  'SELECT')) {
                    tem.children.push({value: mapper.id, label: mapper.label});
                  }
                }

                this.removeNoChild(options);
                if(yuanlaiCount > 0){
                  this.column_MapperIdOptions.splice(0,yuanlaiCount);
                }
                //console.log(mappers);
                this.column_MapperIdOptions = options;
                let selectValue =  this.dataCustom.data[this.dataCustom.key];
                this.setSelect(selectValue,options);
                //console.log(mappers);
              });
          });
      },
      setSelect(selectValue,options){
        if(selectValue instanceof  Array && selectValue.length > 0){
          selectValue = selectValue[selectValue.length-1];
        }
        //console.log(2,selectValue,options);
       // console.log(options);
        for (let option of options){
          if(option.children){
            for (let child of option.children){
              if(child.value === selectValue){
                this.select = [option.value,child.value];

              }
            }
          }
        }
      },
      removeNoChild(column_MapperIdOptions){
        //console.log(2,column_MapperIdOptions)
        for (let i = 0; i < column_MapperIdOptions.length; i++) {
          let data = column_MapperIdOptions[i];
          if(!data.children || data.children.length === 0){
            column_MapperIdOptions.splice(i,1);
            i--;
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>
