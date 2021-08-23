<template>
  <!--职位-->
  <div class="positionvue row"  @click="kongPaiClick">
    <div class="left">

      <div v-for="(item,index) in positionGroupArray"
           :class="{active:groupindex === index}"
           :key="index">
        <div class="sprow item" >
         <!-- <div  style="width: 30px" >
            <i  v-if="isedit && item.childrencount <= 1" class="el-icon-delete"   @click="deleteProjectDic(index,item,groupdicflag)"></i>
          </div>-->
          <div  @click="(isedit && editProjectDic(index,item,groupflag) ) || (groupindex = index)"
                style="width:calc(100% - 30px)" class="sprow" >
            <div class="label">{{item.grouplabel}}</div>
            <div class="name">{{item.groupkey}}</div>
          </div>
        </div>
      </div>
      <div class="sprow  " style="margin-top: 20px" >
        <el-button class="btnwidthall" type="primary" @click="showAddDialog(groupflag)">添加分组</el-button>
      </div>
    </div>
    <div class="right">
      <div id="myChart"  ></div>
      <div id="menuuu"  v-show="show">
        <div class="bottomline" @click="showAddDialog(positionflag)"> 添加职位 </div>
        <div class="bottomline"> 编辑职位 </div>
        <div class="bottomline"> 删除职位 </div>
      </div>
    </div>
    <dialog-custom :modeldialog="modeldialog" v-if="modeldialog.show"></dialog-custom>
  </div>
</template>

<script>
  import  postionApi from '@/api/postionApi'
  export default {
    name: "position",
    data(){
      return{
        show:false,
        isedit:false,
        groupindex:0,
        positionGroupArray:[],
        groupflag:"groupflag",
        positionflag:"positionflag",
        modeldialog: {
          flag:"",
          show: false,
          width: '500px',
          groupflag: {add: "添加分组", edit: "编辑分组"},
          positionflag: {add: "添加职位", edit: "编辑职位"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "modeldialogOk"
        },
      }
    },
    computed: {
      'projectid'() {
        return this.$store.state.project.id;
      }
    },
    mounted() {
      this.init();
    },
    methods: {
     async  init() {
        let dataArray =await postionApi.findGroupByProjectid(this.projectid);
        console.log(dataArray);
        this.$Tool.arrayReplaceAll(this.positionGroupArray,dataArray);
        this.initChart();
      },
      /**
       * 添加分组
       */
      showAddDialog(flag){
        let dialog = this.modeldialog;
        dialog.title = dialog[flag].add;

        dialog.elform.rows = this.newFormRows(flag);
        dialog.elform.data = this.newData(flag);
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.flag = flag;
        dialog.show = true;
      },

      async modeldialogOk(){
        let dialog = this.modeldialog;
        let position = dialog.elform.data;
        await postionApi.edit(position);
        dialog.show = false;
      },
      newFormRows(flag) {
        if(flag === this.groupflag){
          return [
            {name: 'grouplabel', label: "分组标签："},
            {name: 'groupkey', label: "分组关键字："}
          ];
        }else if(flag === this.positionflag){
          return [
            {name: 'name', label: "职位名称："},
            {name: 'key', label: "职位关键值："},
          ];
        }
      },
      newData(flag) {
        let id = this.$Tool.uuid();
        let data;
        if(flag === this.groupflag){
          data = {
            id,
            projectid: this.projectid,
            grouplabel:"",
            groupkey: "",
          };
        }else if(flag === this.positionflag){
          data = {
            id,
            projectid: this.projectid,
            grouplabel:"",
            groupkey: "",
            name:"",
            key:"",
            pid:"",
          }
        }
        return data;
      },
      initChart(){
        let myChart = this.$Echarts.init(document.getElementById('myChart'));
        let option = {
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'tree',
              symbolSize: 75,
              symbol: 'roundRect',
              edgeShape: 'polyline',
              edgeForkPosition: '50%',
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 18,
                  },
                },
              },
              initialTreeDepth: 2,
              orient: 'vertical',

              itemStyle: {
                color: '#FFC125',
                borderColor: '#FFC125',
              },

              expandAndCollapse: false,
              animationDuration: 550,
              animationDurationUpdate: 750,
              //线条的颜色
              lineStyle: {
                normal: {
                  opacity: 0.9,
                  color: '#53B5EA',
                  type: 'dashed',
                  width: 1,
                },
              },

              label: {
                show: true,
                position: 'inside',
                textStyle: {
                  fontSize: 15,
                  color: '#fff',
                },
              },

              leaves: {
                label: {
                  position: 'inside',
                  color: '#fff',
                },
                itemStyle: {
                  color: '#dfdfdf',
                  borderColor: '#dfdfdf',
                },
              },

              data: [
                {
                  name: '根节点',
                  url: 'AAAAAAAAAAAAAAAAAA',
                  // 根节点样式设置
                  itemStyle: {
                    color: '#18a849',
                    borderColor: '#18a849',
                  },
                  children: [
                    {
                      name: '子节点1',
                      children: [
                        {
                          name: '叶子节点1',
                          itemStyle: {
                            color: '#5470C6',
                            borderColor: '#5470C6',
                          },
                        },
                        {
                          name: '叶子节点2',
                          itemStyle: {
                            color: '#5470C6',
                            borderColor: '#5470C6',
                          },
                        },
                        {
                          name: '叶子节点3',
                          itemStyle: {
                            color: '#5470C6',
                            borderColor: '#5470C6',
                          },
                        },
                      ],
                    },
                    {
                      name: '子节点2',
                      children: [
                        {
                          name: '叶子节点4',
                          itemStyle: {
                            color: '#5470C6',
                            borderColor: '#5470C6',
                          },
                        },
                        {
                          name: '叶子节点5',
                          itemStyle: {
                            color: '#5470C6',
                            borderColor: '#5470C6',
                          },
                        },
                        {
                          name: '叶子节点6',
                          itemStyle: {
                            color: '#5470C6',
                            borderColor: '#5470C6',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };
        myChart.setOption(option);
        myChart.on('click',  (params) =>{

          this.$FunctionTool.debounceSeq("postion",this.chartClick,{seq:999,params:params});

        });
      },
      kongPaiClick(){
        this.$FunctionTool.debounceSeq("postion",this.chartClick,{seq:0});
      },
      chartClick(params){
        if(params){
          var menu = document.getElementById("menuuu");
          var event = params.event;
          var pageX = event.offsetX;
          var pageY = event.offsetY;
          menu.style.left = pageX + 'px';
          menu.style.top = pageY + 'px';
          this.show =true;
        }else{
          this.show = false;
        }
      },
    }
  }
</script>

<style lang="scss">

  .positionvue{
    height: 100%;
    width: 100%;
    position: relative;
  }
  .right{
    position: relative;
  }
  #menuuu{
    position: absolute;
    z-index: 999;
    background: var(--white);
    padding: 10px;
    div{
      cursor: pointer;
      border-radius: 4px;

    }
    .bottomline{
      border-bottom: 1px solid #f1f1f1;
      margin-bottom: 10px;
    }
    .bottomline:hover{
        border-bottom: 3px solid var(--primary);
    }
  }
  #myChart{
    height: 100%;
    width: 100%;

  }
</style>
