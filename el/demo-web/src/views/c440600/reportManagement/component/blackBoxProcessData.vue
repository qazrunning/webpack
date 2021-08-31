//过程监管历史查询-检测过程数据
<template>
  <div
    style="overflow-x: hidden; overflow-y: auto; height: 100%; width: 100%"
    ref="innerHeight"
  >
    <div style="float: right; margin-bottom: 5px; margin-right: 8px">
      <RadioGroup v-model="dataShowType" type="button">
        <Radio label="table">表格</Radio>
        <Radio label="chart">分析图</Radio>
        <Radio label="areachart">尾检数据对比图</Radio>
      </RadioGroup>
      <Button type="primary" @click="exportExcel" style="margin-left: 10px"
        >数据导出</Button
      >
    </div>
    <div v-if="dataShowType == 'chart'" v-resize="resize">
      <div
        v-show="resData.length > 0"
        style="margin-top: 50px"
        ref="Process_div"
        :style="{ height: windowHeight - 60 + 'px' }"
      ></div>
      <div
        v-show="resData.length == 0"
        style="height: 100%; text-align: center; margin-top: 50px"
      >
        暂无数据
      </div>
    </div>
    <div v-else-if="dataShowType == 'areachart'" v-resize="resize">
      <div
        v-show="resData.length > 0"
        style="margin-top: 50px"
        ref="Process_div"
        :style="{ height: windowHeight - 60 + 'px' }"
      ></div>
      <div
        v-show="resData.length == 0"
        style="height: 100%; text-align: center; margin-top: 50px"
      >
        暂无数据
      </div>
    </div>
    <div v-else style="width: 100%; overflow: auto">
      <Table
        ref="table"
        size="small"
        :loading="loading"
        :columns="columns"
        :data="resData"
        :height="windowHeight - 40"
      ></Table>
    </div>
  </div>
</template>
<script>
import { isNull } from "util";
import { export_json_to_excel } from "../../../../excel/Export2Excel";
import { formatDates } from "../../../utils/utils";
export default {
  props: {
    InspectionNum: {
      type: String
    },
    IUTYPE: {
      type: String
    },
    wjDBObj: {//尾气数据对比用
      type: Object
    },
    InspectProcessForm: {//黑匣子过程数据
      type: Array
    },
    hxzDBArr:{
      type:Array
    },
    initForm: {
      type: Object
    },
    VLPN: {
      type: String
    }
  },
  data() {
    return {
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      tagsName: "name1",
      windowHeight: 0,
      loading: false,
      thatcolor :["#FFC0CB","#DC143C","#FF1493","#DA70D6","#8A2BE2","#6A5ACD","#0000FF","#00BFFF","#00FFFF","#3CB371","#32CD32","#FFFF00","#FFD700","#FFA500","#FF4500","#A9A9A9"],
      resData: [],
      wjDBObjData: {},
      hxzDBArrData:[],
      columns: [],
      dataShowType: "table", //过程数据显示形式 table 表格，chart 图表
      Process_div: null
    };
  },
  methods: {
    resize() {
      if (this.Process_div) this.Process_div.resize();
    },
    toFlostTwo(value) {
      if (value == null) return "";
      if (value == 0.001) return value;
      value = Number(value).toFixed(2);
      return value;
    },
    exportExcel() {
      require.ensure([], () => {
        const tHeader = this.columns.map(v => v.title); // 上面设置Excel的表格第一行的标题
        const filterVal = this.columns.map(v => v.key); // 上面的index、nickName、name是tableData里对象的属性
        const data = JSON.parse(JSON.stringify(this.resData));
        export_json_to_excel(
          tHeader,
          data,
          this.VLPN + "尾气检测过程数据" + formatDates(new Date(), "yyyyMMdd")
        );
      });
    },
    ASM_column() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 80,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          }
        },
        {
          title: "数据记录时间",
          minWidth: 140,
          key: "time",
          render: (h, params) => {
            const data = this.$options.filters.dataFormat(
              params.row.time,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, data);
          }
        },
        {
          title: "车速(km/h)",
          minWidth: 140,
          key: "speed",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.speed);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 160,
          key: "hc",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.hc);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况O2(%vol)",
          minWidth: 160,
          key: "o2",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.o2);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 160,
          key: "co",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.co);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 160,
          key: "co2",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.co2);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况NO(10-6vol)",
          minWidth: 160,
          key: "no",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.no);
            return h("span", {}, data);
          }
        },
        {
          title: "扭力(N)",
          minWidth: 100,
          key: "force",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.force);
            return h("span", {}, data);
          }
        },
        {
          title: "逐秒λ值",
          minWidth: 130,
          key: "lambda",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.lambda);
            return h("span", {}, data);
          }
        }
      ];
    },
    TSI_column() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 80,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          }
        },
        {
          title: "数据记录时间",
          minWidth: 140,
          key: "time",
          render: (h, params) => {
            const data = this.$options.filters.dataFormat(
              params.row.time,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 160,
          key: "hc",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.hc);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况O2(%vol)",
          minWidth: 140,
          key: "o2",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.o2);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 160,
          key: "co",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.co);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 150,
          key: "co2",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.co2);
            return h("span", {}, data);
          }
        },
        {
          title: "逐秒λ值",
          minWidth: 130,
          key: "lambda",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.lambda);
            return h("span", {}, data);
          }
        }
      ];
    },
    //自由加速
    LightProofSmoke_column() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 80,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          }
        },
        {
          title: "数据记录时间",
          minWidth: 140,
          key: "time",
          render: (h, params) => {
            const data = this.$options.filters.dataFormat(
              params.row.time,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, data);
          }
        },
        {
          title: "不透光度(%)",
          minWidth: 140,
          key: "n",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.n);
            return h("span", {}, data);
          }
        },
        {
          title: "光吸收系数(m-1)",
          minWidth: 130,
          key: "k",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.k);
            return h("span", {}, data);
          }
        }
      ];
    },
    //加载减速
    LD_column() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 80,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          }
        },
        {
          title: "数据记录时间",
          minWidth: 140,
          key: "time",
          render: (h, params) => {
            const data = this.$options.filters.dataFormat(
              params.row.time,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, data);
          }
        },
        {
          title: "车速(km/h)",
          minWidth: 130,
          key: "speed",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.speed);
            return h("span", {}, data);
          }
        },
        {
          title: "不透光度(%)",
          minWidth: 140,
          key: "n",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.n);
            return h("span", {}, data);
          }
        },
        {
          title: "光吸收系数(m-1)",
          minWidth: 130,
          key: "k",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.k);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 160,
          key: "co2",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.co2);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况NOX(10-6vol)",
          minWidth: 160,
          key: "nox",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.nox);
            return h("span", {}, data);
          }
        },
        {
          title: "扭力(N)",
          minWidth: 100,
          key: "force",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.force);
            return h("span", {}, data);
          }
        }
      ];
    },
    //简易瞬态过程数据
    IM_column() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 80,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          }
        },
        {
          title: "数据记录时间",
          minWidth: 140,
          key: "time",
          render: (h, params) => {
            const data = this.$options.filters.dataFormat(
              params.row.time,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, data);
          }
        },
        {
          title: "车速(km/h)",
          minWidth: 140,
          key: "speed",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.speed);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 160,
          key: "hc",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.hc);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况O2(%vol)",
          minWidth: 150,
          key: "o2",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.o2);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 150,
          key: "co",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.co);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 150,
          key: "co2",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.co2);
            return h("span", {}, data);
          }
        },
        {
          title: "测试工况NOX(10-6vol)",
          minWidth: 160,
          key: "nox",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.nox);
            return h("span", {}, data);
          }
        },
        {
          title: "扭力(N)",
          minWidth: 100,
          key: "force",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.force);
            return h("span", {}, data);
          }
        },
        {
          title: "逐秒λ值",
          minWidth: 100,
          key: "lambda",
          render: (h, params) => {
            const data = this.toFlostTwo(params.row.lambda);
            return h("span", {}, data);
          }
        }
      ];
    },
    //稳态过程数据图表
    ASM_chart() {
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = this.resData;
        resData.forEach(item => {
          formatData.xAxisData.push(item.Second_NO || item.Second_No);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: [
              "#00BCD4",
              "#E91E63",
              "#FF9800",
              "#009688",
              "#607D8B",
              "#AB47BC",
              "rgb(4,147,207)",
              "rgb(255,82,8)"
            ],
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              textStyle: {
                color: this.themaColor,
                fontSize: 11 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data: [
                "测试工况[HC]",
                "测试工况[O2]",
                "测试工况[CO]",
                "测试工况[CO2]",
                "测试工况[NO]",
                "扭力",
                "车速",
                "逐秒λ值"
              ]
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                },
                axisLabel: {
                  textStyle: {
                    color: this.themaColor
                  },
                  formatter: function (value) {
                    return value === 0.001 ? 0 : value;
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: this.themaColor
                  }
                }
              }
            },
            series: [
              {
                name: "测试工况[HC]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.hc == 0 ? 0.001 : item.hc))
              },
              {
                name: "测试工况[O2]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.o2 == 0 ? 0.001 : item.o2))
              },
              {
                name: "测试工况[CO]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.co == 0 ? 0.001 : item.co))
              },
              {
                name: "测试工况[CO2]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.co2 == 0 ? 0.001 : item.co2))
              },
              {
                name: "测试工况[NO]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.no == 0 ? 0.001 : item.no))
              },
              {
                name: "扭力",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.force == 0 ? 0.001 : item.force))
              },
              {
                name: "车速",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.speed == 0 ? 0.001 : item.speed))
              },
              {
                name: "逐秒λ值",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.lambda == 0 ? 0.001 : item.lambda))
              }
            ]
          };

          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },
    //简易瞬态过程数据图表
    IM_chart() {
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = this.resData;
        resData.forEach(item => {
          formatData.xAxisData.push(item.Second_NO || item.Second_No);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: [
              "#00BCD4",
              "#E91E63",
              "#FF9800",
              "#009688",
              "#607D8B",
              "#AB47BC",
              "rgb(4,147,207)",
              "rgb(255,82,8)"
            ],
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              textStyle: {
                color: this.themaColor,
                fontSize: 11 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data: [
                "测试工况[HC]",
                "测试工况[O2]",
                "测试工况[CO]",
                "测试工况[CO2]",
                "测试工况[NOX]",
                "扭力",
                "车速",
                "逐秒λ值"
              ]
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                },
                formatter: function (value) {
                  return value === 0.001 ? 0 : value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            series: [
              {
                name: "测试工况[HC]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.hc == 0 ? 0.001 : item.hc))
              },
              {
                name: "测试工况[O2]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.o2 == 0 ? 0.001 : item.o2))
              },
              {
                name: "测试工况[CO]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.co == 0 ? 0.001 : item.co))
              },
              {
                name: "测试工况[CO2]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.co2 == 0 ? 0.001 : item.co2))
              },
              {
                name: "测试工况[NOX]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.nox == 0 ? 0.001 : item.nox))
              },
              {
                name: "扭力",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.force == 0 ? 0.001 : item.force))
              },
              {
                name: "车速",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.speed == 0 ? 0.001 : item.speed))
              },
              {
                name: "逐秒λ值",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.lambda == 0 ? 0.001 : item.lambda))
              }
            ]
          };

          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },
    //双怠速过程数据图表
    TSI_chart() {
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = this.resData;
        resData.forEach(item => {
          formatData.xAxisData.push(item.Second_No || item.Second_NO);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: ["#00BCD4", "#E91E63", "#FF9800", "#009688", "#607D8B"],
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              textStyle: {
                color: this.themaColor,
                fontSize: 11 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data: [
                "测试工况[HC]",
                "测试工况[O2]",
                "测试工况[CO]",
                "测试工况[CO2]",
                "逐秒λ值"
              ]
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                },
                formatter: function (value) {
                  return value === 0.001 ? 0 : value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            series: [
              {
                name: "测试工况[HC]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.hc == 0 ? 0.001 : item.hc))
              },
              {
                name: "测试工况[O2]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.o2 == 0 ? 0.001 : item.o2))
              },
              {
                name: "测试工况[CO]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.co == 0 ? 0.001 : item.co))
              },
              {
                name: "测试工况[CO2]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.co2 == 0 ? 0.001 : item.co2))
              },
              {
                name: "逐秒λ值",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.lambda == 0 ? 0.001 : item.lambda))
              }
            ]
          };
          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },
    //自由加速过程数据图表
    LightProofSmoke_chart() {
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = this.resData;
        resData.forEach(item => {
          formatData.xAxisData.push(item.Second_No || item.Second_NO);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: ["#00BCD4", "#E91E63"],
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              textStyle: {
                color: this.themaColor,
                fontSize: 11 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data: ["不透光度", "光吸收系数"]
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                },
                formatter: function (value) {
                  return value === 0.001 ? 0 : value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            series: [
              {
                name: "不透光度",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.n == 0 ? 0.001 : item.n))
              },
              {
                name: "光吸收系数",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.k == 0 ? 0.001 : item.k))
              }
            ]
          };

          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },
    //加载减速速过程数据图表  
    LD_chart() {
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = this.resData;
        resData.forEach(item => {
          formatData.xAxisData.push(item.Second_NO || item.Second_No);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: [
              "#00BCD4",
              "#E91E63",
              "#FF9800",
              "#009688",
              "#607D8B",
              "#AB47BC"
            ],
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              textStyle: {
                color: this.themaColor,
                fontSize: 11 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data: [
                "不透光度",
                "光吸收系数",
                "测试工况[CO2]",
                "测试工况[NOX]",
                "车速",
                "扭力"
              ]
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                },
                formatter: function (value) {
                  return value === 0.001 ? 0 : value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            series: [
              {
                name: "不透光度",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.n == 0 ? 0.001 : item.n))
              },
              {
                name: "光吸收系数",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.k == 0 ? 0.001 : item.k))
              },
              {
                name: "测试工况[CO2]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.co2 == 0 ? 0.001 : item.co2))
              },
              {
                name: "测试工况[NOX]",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.nox == 0 ? 0.001 : item.nox))
              },
              {
                name: "车速",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.speed == 0 ? 0.001 : item.speed))
              },
              {
                name: "扭力",
                type: "line",
                smooth: true,
                data: resData.map(item => this.toFlostTwo(item.force == 0 ? 0.001 : item.force))
              }
            ]
          };

          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },

    //稳态尾气与黑匣子过程数据图对比表
    ASM_DBchart() {
      let sorthxzData = true  //判断哪个数组更短，短的当父级循环
      if (this.hxzDBArrData.length && this.wjDBObjData.data.length) {
        if (this.hxzDBArrData.length >= this.wjDBObjData.data.length) {
          sorthxzData = false
        }
      }
      console.log(this.hxzDBArrData,this.wjDBObjData.data)

      let hxzarr = []
      let wjarr = []
      try{
        if(sorthxzData){
          this.hxzDBArrData.forEach((e,i)=>{
            this.wjDBObjData.data.forEach((k,ki)=>{
              if(e.ProcessTime == k.ProcessTime){
                hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                throw Error();
              }
            })
          })
        }else{
          this.wjDBObjData.data.forEach((k,ki)=>{
            this.hxzDBArrData.forEach((e,i)=>{
                if(e.ProcessTime == k.ProcessTime){
                  hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                  wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                  throw Error();
                }
            })
          })
        }
      } catch (e) {
      }
      if(hxzarr.length>wjarr.length){
        let arr =hxzarr.slice(0,wjarr.length)
        hxzarr=arr
      }else if(hxzarr.length<wjarr.length){
        let arr =wjarr.slice(0,hxzarr.length)
        wjarr=arr
      }
      let legendname = []
      let seriesobj = {}
      seriesobj.wjdatahc=wjarr.map(e=> {return this.toFlostTwo(e.Flow_HC== 0 ? 0.001 :e.Flow_HC)})
      seriesobj.wjdatao2=wjarr.map(e=> {return this.toFlostTwo(e.Flow_O2== 0 ? 0.001 :e.Flow_O2)})
      seriesobj.wjdataco=wjarr.map(e=> {return this.toFlostTwo(e.Flow_CO== 0 ? 0.001 :e.Flow_CO)})
      seriesobj.wjdataco2=wjarr.map(e=> {return this.toFlostTwo(e.Flow_CO2== 0 ? 0.001 :e.Flow_CO2)})
      seriesobj.wjdatano=wjarr.map(e=> {return this.toFlostTwo(e.Flow_NO== 0 ? 0.001 :e.Flow_NO)})
      seriesobj.wjdatanf=wjarr.map(e=> {return this.toFlostTwo(e.nf== 0 ? 0.001 :e.nf)})
      seriesobj.wjdataspeed=wjarr.map(e=> {return isNull(e.Flow_Speed)?this.toFlostTwo(e.LineSpeed):this.toFlostTwo(e.Flow_Speed)})
      seriesobj.wjdataLambda=wjarr.map(e=> {return this.toFlostTwo(e.Flow_Lambda== 0 ? 0.001 :e.Flow_Lambda)})
      seriesobj.hxzdatahc=hxzarr.map(e=> {return this.toFlostTwo(e.hc== 0 ? 0.001 :e.hc)})
      seriesobj.hxzdatao2=hxzarr.map(e=> {return this.toFlostTwo(e.o2== 0 ? 0.001 :e.o2)})
      seriesobj.hxzdataco=hxzarr.map(e=> {return this.toFlostTwo(e.co== 0 ? 0.001 :e.co)})
      seriesobj.hxzdataco2=hxzarr.map(e=> {return this.toFlostTwo(e.co2== 0 ? 0.001 :e.co2)})
      seriesobj.hxzdatano=hxzarr.map(e=> {return this.toFlostTwo(e.no== 0 ? 0.001 :e.no)})
      seriesobj.hxzdatanf=hxzarr.map(e=> {return this.toFlostTwo(e.force== 0 ? 0.001 :e.force)})
      seriesobj.hxzdataspeed=hxzarr.map(e=> {return this.toFlostTwo(e.speed== 0 ? 0.001 :e.speed)})
      seriesobj.hxzdataLambda=hxzarr.map(e=> {return this.toFlostTwo(e.lambda== 0 ? 0.001 :e.lambda)})
      legendname = ['测试工况HC(尾检)','测试工况O2(尾检)','测试工况CO(尾检)','测试工况CO2(尾检)','测试工况NO(尾检)','扭力(尾检)','车速(尾检)','逐秒λ值(尾检)',
      '测试工况HC(黑匣子)','测试工况O2(黑匣子)','测试工况CO(黑匣子)','测试工况CO2(黑匣子)','测试工况NO(黑匣子)','扭力(黑匣子)','车速(黑匣子)','逐秒λ值(黑匣子)',]
      console.log(seriesobj,hxzarr,wjarr)
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = seriesobj.wjdatahc;
        resData.forEach((item,i) => {
          formatData.xAxisData.push(i+1);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color:this.thatcolor,
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              top:4,
              textStyle: {
                color: this.themaColor,
                fontSize: 12 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data:legendname
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                },
                axisLabel: {
                  textStyle: {
                    color: this.themaColor
                  },
                  formatter: function (value) {
                    return value === 0.001 ? 0 : value;
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: this.themaColor
                  }
                }
              }
            },
            series: [
              {
                name:legendname[0],          
                type: "line",
                smooth: true,
                data:seriesobj.wjdatahc,
              },
              {
                name:legendname[1],          
                type: "line",
                smooth: true,
                data:seriesobj.wjdatao2,
              },
              {
                name:legendname[2],          
                type: "line",
                smooth: true,
                data:seriesobj.wjdataco,
              },
              {
                name:legendname[3],            
                type: "line",
                smooth: true,
                data:seriesobj.wjdataco2,    
              },
              {
                name:legendname[4],          
                type: "line",
                smooth: true,
                data:seriesobj.wjdatano,
              },
              {
                name:legendname[5],  
                type: "line",
                smooth: true,
                data:seriesobj.wjdatanf,            
              },
              {
                name:legendname[6],  
                type: "line",
                smooth: true,
                data:seriesobj.wjdataspeed,            
              },
              {
                name:legendname[7],  
                type: "line",
                smooth: true,
                data:seriesobj.wjdataLambda,                
              },
              {
                name:legendname[8],          
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatahc,
              },
              {
                name:legendname[9],          
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatao2,
              },
              {
                name:legendname[10],          
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataco,
              },
              {
                name:legendname[11],            
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataco2,    
              },
              {
                name:legendname[12],          
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatano,
              },
              {
                name:legendname[13],  
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatanf,            
              },
              {
                name:legendname[14],  
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataspeed,            
              },
              {
                name:legendname[15],  
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataLambda,                
              }
            ]
          };

          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },
    //简易瞬态尾气与黑匣子过程数据图对比表
    IM_DBchart() {
      let sorthxzData = true  //判断哪个数组更短，短的当父级循环
      if (this.hxzDBArrData.length && this.wjDBObjData.data.length) {
        if (this.hxzDBArrData.length >= this.wjDBObjData.data.length) {
          sorthxzData = false
        }
      }
      console.log(this.hxzDBArrData,this.wjDBObjData.data)

      let hxzarr = []
      let wjarr = []
      try{
        if(sorthxzData){
          this.hxzDBArrData.forEach((e,i)=>{
            this.wjDBObjData.data.forEach((k,ki)=>{
              if(e.ProcessTime == k.ProcessTime){
                hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                throw Error();
              }
            })
          })
        }else{
          this.wjDBObjData.data.forEach((k,ki)=>{
            this.hxzDBArrData.forEach((e,i)=>{
                if(e.ProcessTime == k.ProcessTime){
                  hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                  wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                  throw Error();
                }
            })
          })
        }
      } catch (e) {
      }
      if(hxzarr.length>wjarr.length){
        let arr =hxzarr.slice(0,wjarr.length)
        hxzarr=arr
      }else if(hxzarr.length<wjarr.length){
        let arr =wjarr.slice(0,hxzarr.length)
        wjarr=arr
      }
      let legendname = []
      let seriesobj = {}
      seriesobj.wjdatahc=wjarr.map(e=> {return this.toFlostTwo(e.Flow_HC== 0 ? 0.001 :e.Flow_HC)})
      seriesobj.wjdatao2=wjarr.map(e=> {return this.toFlostTwo(e.Flow_O2== 0 ? 0.001 :e.Flow_O2)})
      seriesobj.wjdataco=wjarr.map(e=> {return this.toFlostTwo(e.Flow_CO== 0 ? 0.001 :e.Flow_CO)})
      seriesobj.wjdataco2=wjarr.map(e=> {return this.toFlostTwo(e.Flow_CO2== 0 ? 0.001 :e.Flow_CO2)})
      seriesobj.wjdatanox=wjarr.map(e=> {return this.toFlostTwo(e.Flow_NOX== 0 ? 0.001 :e.Flow_NOX)})
      seriesobj.wjdatanf=wjarr.map(e=> {return this.toFlostTwo(e.nf== 0 ? 0.001 :e.nf)})
      seriesobj.wjdataspeed=wjarr.map(e=> {return isNull(e.Flow_Speed)?this.toFlostTwo(e.LineSpeed):this.toFlostTwo(e.Flow_Speed)})
      seriesobj.wjdataLambda=wjarr.map(e=> {return this.toFlostTwo(e.Flow_Lambda== 0 ? 0.001 :e.Flow_Lambda)})
      seriesobj.hxzdatahc=hxzarr.map(e=> {return this.toFlostTwo(e.hc== 0 ? 0.001 :e.hc)})
      seriesobj.hxzdatao2=hxzarr.map(e=> {return this.toFlostTwo(e.o2== 0 ? 0.001 :e.o2)})
      seriesobj.hxzdataco=hxzarr.map(e=> {return this.toFlostTwo(e.co== 0 ? 0.001 :e.co)})
      seriesobj.hxzdataco2=hxzarr.map(e=> {return this.toFlostTwo(e.co2== 0 ? 0.001 :e.co2)})
      seriesobj.hxzdatanox=hxzarr.map(e=> {return this.toFlostTwo(e.nox== 0 ? 0.001 :e.nox)})
      seriesobj.hxzdatanf=hxzarr.map(e=> {return this.toFlostTwo(e.force== 0 ? 0.001 :e.force)})
      seriesobj.hxzdataspeed=hxzarr.map(e=> {return this.toFlostTwo(e.speed== 0 ? 0.001 :e.speed)})
      seriesobj.hxzdataLambda=hxzarr.map(e=> {return this.toFlostTwo(e.lambda== 0 ? 0.001 :e.lambda)})
      legendname = ['测试工况HC(尾检)','测试工况O2(尾检)',
      '测试工况CO(尾检)','测试工况CO2(尾检)','测试工况NOX(尾检)',
      '扭力(尾检)','车速(尾检)','逐秒λ值(尾检)',
      '测试工况HC(黑匣子)','测试工况O2(黑匣子)',
      '测试工况CO(黑匣子)','测试工况CO2(黑匣子)','测试工况NOX(黑匣子)',
      '扭力(黑匣子)','车速(黑匣子)','逐秒λ值(黑匣子)']
      console.log(seriesobj);
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = seriesobj.wjdatahc;
        resData.forEach((item,i) => {
          formatData.xAxisData.push(i+1);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: this.thatcolor,
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              top:2,
              textStyle: {
                color: this.themaColor,
                fontSize: 12 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data:legendname
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                },
                formatter: function (value) {
                  return value === 0.001 ? 0 : value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            series: [
              {
                name:legendname[0],          
                type: "line",
                smooth: true,
                data:seriesobj.wjdatahc,
              },
              {
                name:legendname[1],          
                type: "line",
                smooth: true,
                data:seriesobj.wjdatao2,
              },
              {
                name:legendname[2],          
                type: "line",
                smooth: true,
                data:seriesobj.wjdataco,
              },
              {
                name:legendname[3],            
                type: "line",
                smooth: true,
                data:seriesobj.wjdataco2,    
              },
              {
                name:legendname[4],          
                type: "line",
                smooth: true,
                data:seriesobj.wjdatanox,
              },
              {
                name:legendname[5],  
                type: "line",
                smooth: true,
                data:seriesobj.wjdatanf,            
              },
              {
                name:legendname[6],  
                type: "line",
                smooth: true,
                data:seriesobj.wjdataspeed,            
              },
              {
                name:legendname[7],  
                type: "line",
                smooth: true,
                data:seriesobj.wjdataLambda,                
              },
              {
                name:legendname[8],          
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatahc,
              },
              {
                name:legendname[9],          
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatao2,
              },
              {
                name:legendname[10],          
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataco,
              },
              {
                name:legendname[11],            
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataco2,    
              },
              {
                name:legendname[12],          
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatanox,
              },
              {
                name:legendname[13],  
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatanf,            
              },
              {
                name:legendname[14],  
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataspeed,            
              },
              {
                name:legendname[15],  
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataLambda,                
              }
            ]
          };

          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },
    //双怠速尾气与黑匣子过程数据图对比表
    TSI_DBchart() {
      let sorthxzData = true  //判断哪个数组更短，短的当父级循环
      if (this.hxzDBArrData.length && this.wjDBObjData.data.length) {
        if (this.hxzDBArrData.length >= this.wjDBObjData.data.length) {
          sorthxzData = false
        }
      }
      console.log(this.hxzDBArrData,this.wjDBObjData.data)

      let hxzarr = []
      let wjarr = []
      try{
        if(sorthxzData){
          this.hxzDBArrData.forEach((e,i)=>{
            this.wjDBObjData.data.forEach((k,ki)=>{
              if(e.ProcessTime == k.ProcessTime){
                hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                throw Error();
              }
            })
          })
        }else{
          this.wjDBObjData.data.forEach((k,ki)=>{
            this.hxzDBArrData.forEach((e,i)=>{
                if(e.ProcessTime == k.ProcessTime){
                  hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                  wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                  throw Error();
                }
            })
          })
        }
      } catch (e) {
      }
      if(hxzarr.length>wjarr.length){
        let arr =hxzarr.slice(0,wjarr.length)
        hxzarr=arr
      }else if(hxzarr.length<wjarr.length){
        let arr =wjarr.slice(0,hxzarr.length)
        wjarr=arr
      }
      let legendname = []
      let seriesobj = {}
      seriesobj.wjdatahc=wjarr.map(e=> {return this.toFlostTwo(e.Flow_HC== 0 ? 0.001 :e.Flow_HC)})
      seriesobj.wjdatao2=wjarr.map(e=> {return this.toFlostTwo(e.Flow_O2== 0 ? 0.001 :e.Flow_O2)})
      seriesobj.wjdataco=wjarr.map(e=> {return this.toFlostTwo(e.Flow_CO== 0 ? 0.001 :e.Flow_CO)})
      seriesobj.wjdataco2=wjarr.map(e=> {return this.toFlostTwo(e.Flow_CO2== 0 ? 0.001 :e.Flow_CO2)})
      seriesobj.wjdatalambda=wjarr.map(e=> {return this.toFlostTwo(e.Flow_Lambda== 0 ? 0.001 :e.Flow_Lambda)})
      seriesobj.hxzdatahc=hxzarr.map(e=> {return this.toFlostTwo(e.hc== 0 ? 0.001 :e.hc)})
      seriesobj.hxzdatao2=hxzarr.map(e=> {return this.toFlostTwo(e.o2== 0 ? 0.001 :e.o2)})
      seriesobj.hxzdataco=hxzarr.map(e=> {return this.toFlostTwo(e.co== 0 ? 0.001 :e.co)})
      seriesobj.hxzdataco2=hxzarr.map(e=> {return this.toFlostTwo(e.co2== 0 ? 0.001 :e.co2)})
      seriesobj.hxzdatalambda=hxzarr.map(e=> {return this.toFlostTwo(e.lambda== 0 ? 0.001 :e.lambda)})
      legendname =[
                "测试工况HC(尾检)",
                "测试工况O2(尾检)",
                "测试工况CO(尾检)",
                "测试工况CO2(尾检)",
                "逐秒λ值(尾检)",
                "测试工况HC(黑匣子)",
                "测试工况O2(黑匣子)",
                "测试工况CO(黑匣子)",
                "测试工况CO2(黑匣子)",
                "逐秒λ值(黑匣子)"]
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = seriesobj.wjdatahc;
        resData.forEach((item,i) => {
          formatData.xAxisData.push(i+1);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: this.thatcolor,
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              top:2,
              textStyle: {
                color: this.themaColor,
                fontSize: 12 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data:legendname
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                },
                formatter: function (value) {
                  return value === 0.001 ? 0 : value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            series: [
              {
                name: legendname[0],
                type: "line",
                smooth: true,
                data: seriesobj.wjdatahc,
              },
              {
                name: legendname[1],
                type: "line",
                smooth: true,
                data:seriesobj.wjdatao2,
              },
              {
                name: legendname[2],
                type: "line",
                smooth: true,
                data: seriesobj.wjdataco,
              },
              {
                name:legendname[3],
                type: "line",
                smooth: true,
                data: seriesobj.wjdataco2,
              },
              {
                name:legendname[4],
                type: "line",
                smooth: true,
                data:seriesobj.wjdatalambda,
              },
              {
                name: legendname[5],
                type: "line",
                smooth: true,
                data: seriesobj.hxzdatahc,
              },
              {
                name: legendname[6],
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatao2,
              },
              {
                name: legendname[7],
                type: "line",
                smooth: true,
                data: seriesobj.hxzdataco,
              },
              {
                name:legendname[8],
                type: "line",
                smooth: true,
                data: seriesobj.hxzdataco2,
              },
              {
                name:legendname[9],
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatalambda,
              }
            ]
          };
          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },
    //自由加速尾气与黑匣子过程数据图对比表
    LightProofSmoke_DBchart() {
      let showwhitch = this.wjDBObjData.dbTableData.LPSItem //自由加速法测试项：1 光吸收系数k，2 不透光度n,实际检测中二者选一(新增字段)
      let sorthxzData = true  //判断哪个数组更短，短的当父级循环
      if (this.hxzDBArrData.length && this.wjDBObjData.data.length) {
        if (this.hxzDBArrData.length >= this.wjDBObjData.data.length) {
          sorthxzData = false
        }
      }
      let hxzarr = []
      let wjarr = []
      let sortarr =[]
      let longarr = []
      try{
        if(sorthxzData){
          this.hxzDBArrData.forEach((e,i)=>{
            this.wjDBObjData.data.forEach((k,ki)=>{
              if(e.ProcessTime == k.ProcessTime){
                hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                throw Error();
              }
            })
          })
        }else{
          this.wjDBObjData.data.forEach((k,ki)=>{
            this.hxzDBArrData.forEach((e,i)=>{
                if(e.ProcessTime == k.ProcessTime){
                  hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                  wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                  throw Error();
                }
            })
          })
        }
      } catch (e) {
      }
      if(hxzarr.length>wjarr.length){
        let arr =hxzarr.slice(0,wjarr.length)
        hxzarr=arr
      }else if(hxzarr.length<wjarr.length){
        let arr =wjarr.slice(0,hxzarr.length)
        wjarr=arr
      }
      let legendname = []
      let seriesobj = {}
      if(showwhitch=='1'){
        seriesobj.wjdata=wjarr.map(e=> {return e.Flow_K?e.Flow_K:0})
        seriesobj.hxzdata=wjarr.map(e=> {return e.k?e.k:0})
        legendname = ['光吸收系数(尾检)','光吸收系数(黑匣子)']
      }else if(showwhitch=='2'){
        seriesobj.wjdata=wjarr.map(e=> {return e.ER?e.ER:0})
        seriesobj.hxzdata=wjarr.map(e=> {return e.n?e.n:0})
        legendname = ['不透光度(尾检)','不透光度(黑匣子)']
      }else{
        seriesobj.wjdata=wjarr.map(e=> {return e.Flow_K===0?0.001:e.Flow_K})
        seriesobj.hxzdata=wjarr.map(e=> {return e.k===0?0.001:e.k})
        legendname = ['光吸收系数(尾检)','光吸收系数(黑匣子)']
      }
      console.log(seriesobj)
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = seriesobj.wjdata;
        resData.forEach((item,i) => {
          formatData.xAxisData.push(i+1);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: this.thatcolor,
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              textStyle: {
                color: this.themaColor,
                fontSize: 11 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data: legendname
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                },
                formatter: function (value) {
                  return value === 0.001 ? 0 : value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            series: [
              {
                name: legendname[0],
                type: "line",
                smooth: true,
                data: seriesobj.wjdata.map(item => this.toFlostTwo(item== 0 ? 0.001 : item))
              },
              {
                name: legendname[1],
                type: "line",
                smooth: true,
                data: seriesobj.hxzdata.map(item => this.toFlostTwo(item == 0 ? 0.001 : item))
              }
            ]
          };

          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },
    //加载减速速尾气与黑匣子过程数据图对比表
    LD_DBchart() {
      let sorthxzData = true  //判断哪个数组更短，短的当父级循环
      if (this.hxzDBArrData.length && this.wjDBObjData.data.length) {
        if (this.hxzDBArrData.length >= this.wjDBObjData.data.length) {
          sorthxzData = false
        }
      }
      console.log(this.hxzDBArrData,this.wjDBObjData.data)

      let hxzarr = []
      let wjarr = []
      try{
        if(sorthxzData){
          this.hxzDBArrData.forEach((e,i)=>{
            this.wjDBObjData.data.forEach((k,ki)=>{
              if(e.ProcessTime == k.ProcessTime){
                hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                throw Error();
              }
            })
          })
        }else{
          this.wjDBObjData.data.forEach((k,ki)=>{
            this.hxzDBArrData.forEach((e,i)=>{
                if(e.ProcessTime == k.ProcessTime){
                  hxzarr = this.hxzDBArrData.slice(i,this.hxzDBArrData.length)
                  wjarr = this.wjDBObjData.data.slice(ki,this.wjDBObjData.data.length)
                  throw Error();
                }
            })
          })
        }
      } catch (e) {
      }
      if(hxzarr.length>wjarr.length){
        let arr =hxzarr.slice(0,wjarr.length)
        hxzarr=arr
      }else if(hxzarr.length<wjarr.length){
        let arr =wjarr.slice(0,hxzarr.length)
        wjarr=arr
      }
      let legendname = []
      let seriesobj = {}
      // seriesobj.wjdatahc=wjarr.map(e=> {return this.toFlostTwo(e.Flow_HC== 0 ? 0.001 :e.Flow_HC)})
      seriesobj.wjdatao2=wjarr.map(e=> {return this.toFlostTwo(e.Flow_K== 0 ? 0.001 :e.Flow_K)})
      seriesobj.wjdataco=wjarr.map(e=> {return this.toFlostTwo(e.Flow_CO== 0 ? 0.001 :e.Flow_CO)})
      seriesobj.wjdataco2=wjarr.map(e=> {return this.toFlostTwo(e.Flow_CO2== 0 ? 0.001 :e.Flow_CO2)})
      seriesobj.wjdataspeed=wjarr.map(item =>
                  isNull(item.Flow_Speed)
                    ? this.toFlostTwo(item.SpeedPerSec == 0 ? 0.001 : item.SpeedPerSec)
                    : this.toFlostTwo(item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed))
      seriesobj.wjdatanf=wjarr.map(e=> {return this.toFlostTwo(e.nf== 0 ? 0.001 :e.nf)})

      // seriesobj.hxzdatan=hxzarr.map(e=> {return this.toFlostTwo(e.n== 0 ? 0.001 :e.n)})
      seriesobj.hxzdatak=hxzarr.map(e=> {return this.toFlostTwo(e.k== 0 ? 0.001 :e.k)})
      seriesobj.hxzdataco=hxzarr.map(e=> {return this.toFlostTwo(e.co2== 0 ? 0.001 :e.co2)})
      seriesobj.hxzdataco2=hxzarr.map(e=> {return this.toFlostTwo(e.nox== 0 ? 0.001 :e.nox)})
      seriesobj.hxzdataspeed=hxzarr.map(e=> {return this.toFlostTwo(e.speed== 0 ? 0.001 :e.speed)})
      seriesobj.hxzdataforce=hxzarr.map(e=> {return this.toFlostTwo(e.force== 0 ? 0.001 :e.force)})
      legendname = ['光吸收系数(尾检)','测试工况CO2(尾检)','测试工况NOX(尾检)','车速(尾检)','扭力(尾检)',
      '光吸收系数(黑匣子)','测试工况CO2(黑匣子)','测试工况NOX(黑匣子)','车速(黑匣子)','扭力(黑匣子)']
      console.log(seriesobj);
      try {
        let formatData = {
          xAxisData: [],
          yAxis: {}
        };
        const resData = seriesobj.wjdatao2;
        resData.forEach((item,i) => {
          formatData.xAxisData.push(i+1);
        });
        if (this.Process_div) {
          this.Process_div.clear();
          this.$echartsc.dispose(this.Process_div);
          this.Process_div = null;
        }
        if (this.$refs.Process_div) {
          this.Process_div = this.$echartsc.init(this.$refs.Process_div);
          // 指定图表的配置项和数据
          var option = {
            color: this.thatcolor,
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                let html = params[0].name
                params.forEach((item, index) => {
                  html += (`<br/>${item.marker + item.seriesName}: ${item.value === 0.001 ? 0 : item.value}`)
                })
                return html;
              }
            },
            legend: {
              itemWidth: 12,
              itemHeight: 8,
              top:2,
              textStyle: {
                color: this.themaColor,
                fontSize: 12 //字体大小
              },
              itemGap: 0,
              x: "right",
              type: "scroll",
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
              data:legendname
            },
            grid: {
              top: "12%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            yAxis: {
              type: 'log',
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor
                },
                formatter: function (value) {
                  return value === 0.001 ? 0 : value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor
                }
              }
            },
            series: [
              {
                name: legendname[0],
                type: "line",
                smooth: true,
                data:seriesobj.wjdatao2,
              },
              {
                name: legendname[1],
                type: "line",
                smooth: true,
                data:seriesobj.wjdataco,
              },
              {
                name: legendname[2],
                type: "line",
                smooth: true,
                data:seriesobj.wjdataco2,
              },
              {
                name: legendname[3],
                type: "line",
                smooth: true,
                data:seriesobj.wjdataspeed,
              },
              {
                name: legendname[4],
                type: "line",
                smooth: true,
                data:seriesobj.wjdatanf,
              },
              {
                name: legendname[5],
                type: "line",
                smooth: true,
                data:seriesobj.hxzdatak,
              },
              {
                name: legendname[6],
                type: "line",
                smooth: true,
                data: seriesobj.hxzdataco,
              },
              {
                name: legendname[7],
                type: "line",
                smooth: true,
                data:seriesobj.hxzdataco2,
              },
              {
                name: legendname[8],
                type: "line",
                smooth: true,
                data: seriesobj.hxzdataspeed,
              },
              {
                name: legendname[9],
                type: "line",
                smooth: true,
                data: seriesobj.hxzdataforce,
              }
            ]
          };

          this.Process_div.setOption(option, true);
        }
      } catch (error) { }
    },



    judgeType() {
      //判断获取检测方法的检测过程表格或图表
      if (this.dataShowType == "table") {
        if (this.IUTYPE.indexOf("B") > -1) this.ASM_column();
        else if (this.IUTYPE.indexOf("A") > -1) this.TSI_column();
        else if (this.IUTYPE.indexOf("F") > -1) this.LightProofSmoke_column();
        else if (this.IUTYPE.indexOf("G") > -1) this.LD_column();
        else if (this.IUTYPE.indexOf("C") > -1) this.IM_column();
      } else if (this.dataShowType == "chart") {
        if (this.IUTYPE.indexOf("B") > -1) this.ASM_chart();
        else if (this.IUTYPE.indexOf("A") > -1) this.TSI_chart();
        else if (this.IUTYPE.indexOf("F") > -1) this.LightProofSmoke_chart();
        else if (this.IUTYPE.indexOf("G") > -1) this.LD_chart();
        else if (this.IUTYPE.indexOf("C") > -1) this.IM_chart();
      } else {
        if (this.IUTYPE.indexOf("B") > -1) this.ASM_DBchart();
        else if (this.IUTYPE.indexOf("A") > -1) this.TSI_DBchart();
        else if (this.IUTYPE.indexOf("F") > -1) this.LightProofSmoke_DBchart();
        else if (this.IUTYPE.indexOf("G") > -1) this.LD_DBchart();
        else if (this.IUTYPE.indexOf("C") > -1) this.IM_DBchart();
      }
    },
    setHeight() {
      this.windowHeight = this.$refs.innerHeight.offsetHeight;
    }
  },
  mounted() {
    
    this.$nextTick(() => {
      this.resData = this.InspectProcessForm;
      this.wjDBObjData = this.wjDBObj
      this.hxzDBArrData = this.hxzDBArr
      this.judgeType();
      this.setHeight();
      window.addEventListener("resize", this.setHeight);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.setHeight);
    if (this.Process_div) {
      this.Process_div.clear();
      this.$echartsc.dispose(this.Process_div);
      this.Process_div = null;
    }
  },
  watch: {
    InspectProcessForm: {
      async handler(data) {
        this.resData = [];
        if (data.length > 0) this.resData = data;
        this.$nextTick(() => {
          this.judgeType();
        });
      },
      immediate: true
    },
    wjDBObj: {
      async handler(data) {
        

        this.wjDBObjData = {};
        if (data.data && data.data.length > 0) this.wjDBObjData = data;
        this.$nextTick(() => {
          this.judgeType();
        });
      },
      immediate: true
    },
    hxzDBArr: {
      async handler(data) {
        

        this.hxzDBArrData = [];
        if (data && data.length > 0) this.hxzDBArrData = data;
        this.$nextTick(() => {
          this.judgeType();
        });
      },
      immediate: true
    },
    dataShowType(val, oldVal) {
      //普通的watch监听
      console.log(val, oldVal)
      this.$nextTick(() => {
        //dom没有加载完的问题，要放在this.$nextTick
        this.judgeType();
      });
    }
  }
};
</script>