<template>
  <!--职位-->
  <div class="positionvue row" @click="kongPaiClick">
    <div id="myChart"></div>
    <div id="menuuu" v-show="show">
      <div class="bottomline" @click="showAddDownDialog(positionflag)"> 添加下级职位</div>
      <div class="bottomline" @click="showUpdateDialog(positionflag)"> 编辑职位</div>
      <div class="bottomline"  @click="showDeleteDialog"> 删除职位</div>
    </div>
    <dialog-custom :modeldialog="modeldialog" v-if="modeldialog.show"></dialog-custom>
  </div>
</template>

<script>
  import positionApi from '@/api/positionApi'

  export default {
    name: "position",
    data() {
      return {
        show: false,
        isedit: false,
        positionArray:[],
        groupflag: "groupflag",
        positionflag: "positionflag",
        modeldialog: {
          flag: "",
          show: false,
          width: '500px',
          positionflag: {add: "添加职位", edit: "编辑职位"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "modeldialogOk",
        },
        colorArray: ["#18a849", "#FFC125", "#53B5EA"],
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
      async init() {
        let dataArray = await positionApi.findByProjectid(this.projectid);
        this.$Tool.arrayReplaceAll(this.positionArray,dataArray);
        this.initChart();
      },
      async modeldialogOk() {
        let dialog = this.modeldialog;
        let position = dialog.elform.data;
         await positionApi.edit(position);
        dialog.show = false;
        if(dialog.currenthandle === this.$strTool.modelhandle[0]){
          this.positionArray.push(position);
        }else{
          this.$Tool.replaceModel(this.positionArray,position);
        }
        this.initChart();
      },
       showDeleteDialog(flag) {
        let dialog = this.modeldialog;
        let data = dialog.elform.data;
        this.$confirm(`是否要删除职位 ${data.name} 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await positionApi.deletePosition(data);
          this.$Tool.arrayDeleteModel(this.positionArray,data);
          this.initChart();
        }).catch(() => { });
      },
      /**
       * 添加分组
       */
      showAddDialog(flag) {

      },
      //添加下一级
      showAddDownDialog(flag){
        let dialog = this.modeldialog;
        let leveldata = dialog.elform.data;
        dialog.elform.data  = {
          id:this.$Tool.uuid(),
          projectid: this.projectid,
          name: "",
          key: "",
          pid: leveldata.id,
          level:leveldata.level+1,
        };
        dialog.title = "添加下一级";
        dialog.elform.rows = this.newFormRows(flag);
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.flag = flag;
        dialog.show = true;
      },
      /**
       * 修改分组
       */
      showUpdateDialog(flag) {
        let dialog = this.modeldialog;
        dialog.title = dialog[flag].edit;
        dialog.elform.rows = this.newFormRows(flag);
        //dialog.elform.data = data;
        let data  = dialog.elform.data;
        if(data && data.id){
          dialog.currenthandle = this.$strTool.modelhandle[2];
        }else{
          data.id = this.$Tool.uuid();
          dialog.currenthandle = this.$strTool.modelhandle[0];
        }
        dialog.flag = flag;
        dialog.show = true;
        //console.log(dialog.elform.data)
      },



      newFormRows(flag) {
        if (flag === this.positionflag) {
          return [
            {name: 'name', label: "职位名称："},
            {name: 'key', label: "职位关键值："},
          ];
        }
      },
      newData(flag) {
        let id = this.$Tool.uuid();
        let data;
        if (flag === this.positionflag) {
          data = {
            id,
            projectid: this.projectid,
            grouplabel: "",
            groupkey: "",
            name: "",
            key: "",
            pid: "",
          }
        }
        return data;
      },
      postionToSeriesData(seriesdata, dataArray ) {
        if(!dataArray){
          return;
        }

        for (let data of dataArray) {
          let level = data.level;
          if (level >= this.colorArray.length) {
            level = this.colorArray.length - 1;
          }
          let color = this.colorArray[level];
          let seriesdatachildren = {
            data:data,
            name: data.name,
            itemStyle: {
              color: color,
              borderColor: color,
            }
          };
          seriesdata.push(seriesdatachildren);
          let children = [];
          seriesdatachildren.children = children;
          this.postionToSeriesData(children, data.children);
        }
      },

      initChart() {
        for(let item of this.positionArray){
          item.children = [];
          item.parent = undefined;
        }

        for (let item of this.positionArray) {
          item.children = [];
          item.parent = undefined;
        }
        let data ;
        if(this.positionArray.length === 0){
          data = this.newData(this.positionflag);
          data.id="";
          data.name="更名后有效";
          data.level=0;
        }else{
          data = this.positionArray[0];
        }


        this.$Tool.arrayToDataLevel(data, this.positionArray, "pid");
        let seriesdata = [];
        this.postionToSeriesData(seriesdata, [data], 0);

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
                  name: 'CEO',
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
      //  console.log(1, option.series[0].data)
        option.series[0].data = seriesdata;
       // console.log(2, option.series[0].data)
        let myChart = this.myChart;
        if(!myChart){
          myChart = this.$Echarts.init(document.getElementById('myChart'));
        }else{
          //myChart.clear();
        }
        myChart.setOption(option);
        myChart.on('click', (params) => {
          this.$FunctionTool.debounceSeq("postion", this.chartClick, {seq: 999, params: params});
        });
        this.myChart = myChart;
      },
      kongPaiClick() {
        this.$FunctionTool.debounceSeq("postion", this.chartClick, {seq: 0});
      },
      chartClick(params) {
        if (params) {

          this.modeldialog.elform.data = params.data.data;
          var menu = document.getElementById("menuuu");
          var event = params.event;
          var pageX = event.offsetX;
          var pageY = event.offsetY;
          menu.style.left = pageX + 'px';
          menu.style.top = pageY + 'px';
          this.show = true;
        } else {
          this.show = false;
        }
      },
    }
  }
</script>

<style lang="scss">

  .positionvue {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .right {
    position: relative;
  }

  #menuuu {
    position: absolute;
    z-index: 999;
    background: var(--white);
    padding: 10px;

    div {
      cursor: pointer;
      border-radius: 4px;

    }

    .bottomline {
      border-bottom: 1px solid #f1f1f1;
      margin-bottom: 10px;
    }

    .bottomline:hover {
      border-bottom: 3px solid var(--primary);
    }
  }

  #myChart {
    height: calc(100% - 50px);
    width: 100%;
  }
</style>
