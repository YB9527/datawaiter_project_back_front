<template>
    <!--组织架构-->
    <div class="positionvue row" @click="kongPaiClick">
      <div id="myChart"></div>
      <div id="menuuu" v-show="show">
        <div class="bottomline" @click="showAddDownDialog(organizationflag)"> 添加下级组织部门</div>
        <div class="bottomline" @click="showUpdateDialog(organizationflag)"> 编辑组织部门</div>
        <div class="bottomline" @click="showAddPosionDialog()"> 编辑职位</div>
        <div class="bottomline" @click="showDeleteDialog(organizationflag)"> 删除组织部门</div>
      </div>
      <dialog-custom :modeldialog="modeldialog" v-if="modeldialog.show"></dialog-custom>
    </div>
</template>

<script>
  import organizationApi from '@/api/organizationApi'

  export default {
    name: "position",
    data() {
      return {
        show: false,
        isedit: false,
        organizationArray: [],
        organizationflag: "organizationflag",
        modeldialog: {
          flag: "",
          show: false,
          width: '500px',
          organizationflag: {add: "添加组织", edit: "编辑组织"},
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
        let dataArray = await organizationApi.findByProjectid(this.projectid);
        console.log(1,dataArray);
        this.$Tool.arrayReplaceAll(this.organizationArray, dataArray);
        this.initChart();
      },
      async modeldialogOk() {
        let dialog = this.modeldialog;
        let organization = dialog.elform.data;
        await organizationApi.edit(organization);
        dialog.show = false;
        if (dialog.currenthandle === this.$strTool.modelhandle[0]) {
          this.organizationArray.push(organization);
        } else {
          this.$Tool.replaceModel(this.organizationArray, organization);
        }
        this.initChart();
      },
      showDeleteDialog() {
        let dialog = this.modeldialog;
        let data = dialog.elform.data;
        this.$confirm(`是否要删除职位 ${data.name} 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await organizationApi.deleteOrganization(data);
          this.$Tool.arrayDeleteModel(this.organizationArray, data);
          this.initChart();
        }).catch(() => {
        });
      },
      showAddPosionDialog(){

      },
      /**
       * 添加分组
       */
      showAddDialog(flag) {

      },
      //添加下一级
      showAddDownDialog(flag) {
        let dialog = this.modeldialog;
        let leveldata = dialog.elform.data;
        dialog.elform.data = {
          id: this.$Tool.uuid(),
          projectid: this.projectid,
          name: "",
          key: "",
          pid: leveldata.id,
          level: leveldata.level + 1,
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
        let data = dialog.elform.data;
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


      newFormRows() {
          return [
            {name: 'name', label: "组织部门名称："},
            {name: 'key', label: "部门关键值："},
          ];

      },
      newData() {
        let id = this.$Tool.uuid();
         return {
            id,
            projectid: this.projectid,
            name: "",
            key: "",
            pid: "",
            level:"",
          };
      },
      organizationToSeriesData(seriesdata, dataArray) {

        if (!dataArray) {
          return;
        }

        for (let data of dataArray) {
          if(!data){
            continue;
          }
          let level = data.level;
          if (level >= this.colorArray.length) {
            level = this.colorArray.length - 1;
          }
          let color = this.colorArray[level];
          let seriesdatachildren = {
            data: data,
            name: data.name,
            itemStyle: {
              color: color,
              borderColor: color,
            }
          };
          seriesdata.push(seriesdatachildren);
          let children = [];
          seriesdatachildren.children = children;
          this.organizationToSeriesData(children, data.children);
        }
      },

      initChart() {
        for (let item of this.organizationArray) {
          item.children = [];
          item.parent = undefined;
        }
        let data ;
        if(this.organizationArray.length === 0){
          data = this.newData();
          data.id="";
          data.name="更名后有效";
          data.level=0;
        }else{
          data = this.organizationArray[0];
        }


        this.$Tool.arrayToDataLevel(data, this.organizationArray, "pid");
        let seriesdata = [];
        this.organizationToSeriesData(seriesdata, [data], 0);

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
        if (!myChart) {
          myChart = this.$Echarts.init(document.getElementById('myChart'));
        } else {
          //myChart.clear();
        }
        myChart.setOption(option);
        myChart.on('click', (params) => {
          this.$FunctionTool.debounceSeq("organization", this.chartClick, {seq: 999, params: params});
        });
        this.myChart = myChart;
      },
      kongPaiClick() {
        this.$FunctionTool.debounceSeq("organization", this.chartClick, {seq: 0});
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
