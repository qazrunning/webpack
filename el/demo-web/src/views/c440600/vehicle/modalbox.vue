<template>
  <div class="body fx__border fx__text_default" v-resize="resize">
    <!-- 左侧部分 -->
    <div class="leftcontent">
      <div class="leftTop fx__border fx__group" ref="echart_top">
        <!-- 按钮部分 -->
        <Row type="flex" align="middle" style="height: 25%;">
          <Col span="4" style="text-align: center;">
            <div class="vlpn" :style="setVLPNColor(VLPNColor)">{{VLPN}}</div>
          </Col>
          <Col span="2"  offset="8" style="text-align: right;font-weight: bolder;">播放 ：</col>
          <Col span="2">
            <Button type="primary" size="small" @click="begin()" class="button" :disabled="canotUse">
              <Icon type="ios-play" />
            </Button>
          </Col>
             <Col span="2" style="text-align: right;font-weight: bolder;">暂停 ：</Col>
             <Col span="2">
            <Button type="primary" size="small" @click="stop()" class="button" :disabled="!canotUse">
              <Icon type="ios-pause" />
            </Button>
              </Col>
             <Col span="2" style="text-align: right;font-weight: bolder;">重播 ：</Col>
             <Col span="2">
            <Button type="warning" size="small" @click="again()" class="button" :disabled="clickAgain">
              <Icon type="md-refresh" />
            </Button>
              </Col>
          
        </Row>
        <!-- 环境信息部分 -->
        <Row type="flex" align="middle" style="height: 33%;">
          <Col span="4" style="text-align: center;font-size: 20px;font-weight: bolder;">环境信息</Col>
          <Col span="3" style="text-align:center">温度(℃)</span></Col>
          <Col span="3"><Input v-model="wendu" :disabled="true" style="width:80%;" /></Col>
          <Col span="3" style="text-align:center">湿度(%)</Col>
          <Col span="3"><Input v-model="shidu" :disabled="true" style="width:80%;"/></Col>
          <Col span="4" style="text-align:center">大气压(kPa)</Col>
          <Col span="3"><Input v-model="daqiya" :disabled="true" style="width:80%;"/></Col>
        </Row>
        <!-- 实时数据部分 -->
         <Row type="flex" align="middle" style="height: 42%;">
           <Col span="4" style="text-align: center;font-size: 20px;font-weight: bolder;">实时数据</Col>
           <Col span="20" style="text-align: center;" v-if="IUTYPE=='G'">
             <Row>
               <Col span="4" style="text-align: center;">CO2(%)</Col>
               <Col span="4" style="text-align: center;">NOX(10<sup>-6</sup>)</Col>
               <Col span="4" style="text-align: center;">K(m<sup>-1</sup>)</Col>
               <Col span="4" style="text-align: center;">车速(km/h)</Col>
               <Col span="4" style="text-align: center;">转速(rpm)</Col>
             </Row>
              <Row>
               <Col span="4"><Input v-model="CO2" :disabled="true" style="width:60%;"/></Col>
               <Col span="4"><Input v-model="NOX" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="K" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="speed" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="zhuansu" :disabled="true" style="width:60%;" /></Col>
             </Row>
           </Col>
            <Col span="20" style="text-align: center;" v-if="IUTYPE=='F'">
             <Row>
               <Col span="5" style="text-align: center;">K(m<sup>-1</sup>)</Col>
               <Col span="5" style="text-align: center;">转速(rpm)</Col>
             </Row>
              <Row>
               <Col span="5"><Input v-model="K" :disabled="true" style="width:60%;" /></Col>
               <Col span="5"><Input v-model="zhuansu" :disabled="true" style="width:60%;" /></Col>
             </Row>
           </Col>
            <Col span="20" style="text-align: center;" v-if="IUTYPE=='A'">
             <Row>
               <Col span="4" style="text-align: center;">CO(%)</Col>
               <Col span="4" style="text-align: center;">HC(10<sup>-6</sup>)</Col>
               <Col span="4" style="text-align: center;">O2(%)</Col>
               <Col span="4" style="text-align: center;">CO2(%)</Col>
               <Col span="4" style="text-align: center;">转速(rpm)</Col>
             </Row>
              <Row>
               <Col span="4"><Input v-model="CO" :disabled="true" style="width:60%;"/></Col>
               <Col span="4"><Input v-model="HC" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="O2" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="CO2" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="zhuansu" :disabled="true" style="width:60%;" /></Col>
             </Row>
           </Col>
           <Col span="20" style="text-align: center;" v-if="IUTYPE=='B'">
             <Row>
               <Col span="4" style="text-align: center;">HC(%)</Col>
               <Col span="4" style="text-align: center;">CO(%)</Col>
               <Col span="4" style="text-align: center;">CO2(%)</Col>
               <Col span="4" style="text-align: center;">NO(%vol)</Col>
               <Col span="4" style="text-align: center;">车速(km/h)</Col>
               <Col span="4" style="text-align: center;">转速(rpm)</Col>
             </Row>
              <Row>
               <Col span="4"><Input v-model="HC" :disabled="true" style="width:60%;"/></Col>
               <Col span="4"><Input v-model="CO" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="CO2" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="NO" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="speed" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="zhuansu" :disabled="true" style="width:60%;" /></Col>
             </Row>
           </Col>
             <Col span="20" style="text-align: center;" v-if="IUTYPE=='C'">
             <Row>
               <Col span="4" style="text-align: center;">HC(%)</Col>
               <Col span="4" style="text-align: center;">CO2(%)</Col>
               <Col span="4" style="text-align: center;">NOX(10<sup>-6</sup>)</Col>
               <Col span="4" style="text-align: center;">O2(%)</Col>
               <Col span="4" style="text-align: center;">车速(km/h)</Col>
               <Col span="4" style="text-align: center;">转速(rpm)</Col>
             </Row>
              <Row>
               <Col span="4"><Input v-model="HC" :disabled="true" style="width:60%;"/></Col>
               <Col span="4"><Input v-model="CO2" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="NOX" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="O2" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="speed" :disabled="true" style="width:60%;" /></Col>
               <Col span="4"><Input v-model="zhuansu" :disabled="true" style="width:60%;" /></Col>
             </Row>
           </Col>
        </Row>
      </div>

      <div class="leftDown">
        <p class="fx__text_headline" :zhuansu="zhuansu">转速</p>
        <!-- 转速仪表盘部分 -->
        
        <div class="echart1 fx__bgcolor-lighten" ref="echart_width">
          <speed-echarts :zhuansu="zhuansu" :Width="Width"></speed-echarts>
        </div>
      </div>
    </div>
    <!-- 右侧统计图部分 -->
    <div class="rightcontent fx__bgcolor-lighten">
      <p class="fx__text_headline">车辆检测过程曲线图</p>
      <div class="echart2">
        <div :style="{width: '100%', height: '100%'}" ref="myChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { config } from '../../../utils/tools'
import speedEcharts from "./speedEcharts"; //仪表盘组件
export default {
  components: {
    speedEcharts
  },
  props: {
    modalData: {
      type: Array,
      default: () => []
    },
    VLPN: {
      type: String,
      default: ""
    },
    VLPNColor:{
      type: String,
      default: ""
    }
  },
  data() {
    return {
      IUTYPE:"",
      Width: "", 
      myChart: null,
      canotUse: false, //按钮禁用
      clickAgain:false, 
      wendu: 0,
      shidu: 0,
      daqiya: 0,
      CO2: 0,
      NOX: 0,
      K: 0,
      CO: 0,
      HC: 0,
      O2: 0,
      NO: 0,
      speed:0,
      CO2Arr: [],
      NOXArr: [],
      KArr: [],
      COArr: [],
      HCArr: [],
      O2Arr: [],
      NOArr: [],
      speedArr:[],
      zhuansu: 0,
      interval: null, //定时器
      i_num: 0,
      j_num: 0
    }
  },
  methods: {
    begin() {
      this.canotUse = !this.canotUse
      let i = 0;
      let j = 0;
      // if(this.modalData&&this.modalData.length != 0){
      //   let len = this.modalData[this.modalData.length - 1].Second_NO 
      // }
      //判断是否是重播
      if (this.i_num !== 0) {
        i = this.i_num
        j = this.j_num 
      }
       this.$Message.info({
          content: '播放开始',
          duration: 2,
          background: true
        });
      //定时器 每秒一条数据
      this.interval = setInterval(() => {
        if (this.modalData[i]) {
          // console.log(this.modalData[i]);
          if(j + 1 == this.modalData[i].Second_NO){
            this.wendu = this.modalData[i].EnvirTemperature.toFixed(2)
            this.shidu = this.modalData[i].EnvirHumidity.toFixed(2)
            this.daqiya = this.modalData[i].EnvirAirPressure.toFixed(2)
            this.zhuansu = 0
            this.zhuansu = this.modalData[i].Flow_RotateSpeed
            if (this.IUTYPE == "G") {
            this.CO2 = this.modalData[i].Flow_CO2
            this.NOX = this.modalData[i].Flow_NOX
            this.K = this.modalData[i].Flow_K
            this.speed = this.modalData[i].Flow_Speed
            this.CO2Arr.push(this.CO2)
            this.NOXArr.push(this.NOX)
            this.KArr.push(this.K)
            this.speedArr.push(this.speed)
           }else if (this.IUTYPE == "F") {
            this.K = this.modalData[i].Flow_K
            this.KArr.push(this.K)
          } else if (this.IUTYPE == "A") {
            this.CO = this.modalData[i].Flow_CO
            this.HC = this.modalData[i].Flow_HC
            this.O2 = this.modalData[i].Flow_O2
            this.CO2 = this.modalData[i].Flow_CO2
            this.COArr.push(this.CO)
            this.HCArr.push(this.HC)
            this.O2Arr.push(this.O2)
            this.CO2Arr.push(this.CO2)
          } else if (this.IUTYPE == "B") {
            this.HC = this.modalData[i].Flow_HC
            this.CO = this.modalData[i].Flow_CO
            this.CO2 = this.modalData[i].Flow_CO2
            this.NO = this.modalData[i].Flow_NO
            this.speed = this.modalData[i].Flow_Speed
            this.HCArr.push(this.HC)
            this.COArr.push(this.CO)
            this.CO2Arr.push(this.CO2)
            this.NOArr.push(this.NO)
            this.speedArr.push(this.speed)
          } else if (this.IUTYPE == "C") {
            this.HC = this.modalData[i].Flow_HC
            this.CO2 = this.modalData[i].Flow_CO2
            this.NOX = this.modalData[i].Flow_NOX
            this.O2 = this.modalData[i].Flow_O2
            this.speed = this.modalData[i].Flow_Speed
            this.HCArr.push(this.HC)
            this.CO2Arr.push(this.CO2)
            this.NOXArr.push(this.NOX)
            this.O2Arr.push(this.O2)
            this.speedArr.push(this.speed)
          }
           i++;
           this.i_num = i
           j++
           this.j_num = j
          }else{
            this.wendu = ""
            this.shidu = ""
            this.daqiya = ""
            this.zhuansu = 0
          if (this.IUTYPE == "G") {
            this.CO2 = ""
            this.NOX = ""
            this.K = ""
            this.speed = ""
            this.CO2Arr.push("")
            this.NOXArr.push("")
            this.KArr.push("")
            this.speedArr.push("")
          }else if (this.IUTYPE == "F") {
            this.K = ""
            this.KArr.push("")
          } else if (this.IUTYPE == "A") {
            this.CO = ""
            this.HC = ""
            this.O2 = ""
            this.CO2 = ""
            this.COArr.push("")
            this.HCArr.push("")
            this.O2Arr.push("")
            this.CO2Arr.push("")
          } else if (this.IUTYPE == "B") {
            this.HC = ""
            this.CO = ""
            this.CO2 = ""
            this.NO = ""
            this.speed = ""
            this.HCArr.push("")
            this.COArr.push("")
            this.CO2Arr.push("")
            this.NOArr.push("")
            this.speedArr.push("")
          } else if (this.IUTYPE == "C") {
            this.HC = ""
            this.CO2 = ""
            this.NOX = ""
            this.O2 = ""
            this.speed = ""
            this.HCArr.push("")
            this.CO2Arr.push("")
            this.NOXArr.push("")
            this.O2Arr.push("")
            this.speedArr.push("")
          }
          j++
          this.j_num = j
          }
          this.changeType(this.IUTYPE)
        } else {
          clearInterval(this.interval)
          this.$Message.info({
          content: '播放结束',
          duration: 3,
          background: true
        });
        }
      }, 1000)
    },
    //停止按钮
    stop() {
       this.$Message.info({
          content: '暂停播放',
          duration: 2,
          background: true
        });
      this.canotUse = !this.canotUse
      clearInterval(this.interval)
      this.interval = null
    },
    //重播
    again() {
      this.clickAgain = true
      setTimeout(()=>{
        this.clickAgain = false
      },2000)
      this.chongzhi()
        this.begin()
    },
    //将echarts数据中的0转为0.001
    mateoption(arr){
      let newechartsArr = []
      arr.forEach(e=>{
        if(e===0){
          e = 0.001
        }
        newechartsArr.push(e)
      })
      return newechartsArr
    },
    //车牌颜色
    setVLPNColor(VLPNColor) {
      if (!config.vlpn_c[VLPNColor]) return {};
      const vlpn_c = config.vlpn_c[VLPNColor];
      return {
        background: `${vlpn_c.Background} !important`,
        color: `${vlpn_c.TextColor} !important`,
        "border-color": `${vlpn_c.BorderColor} !important`,
      };
    },
    // 加载减速法echarts图配置
    LD_chart() {
      try {
        let xAxisData = []
        if (this.modalData.length == 0) return;
        let maxNum = this.modalData[this.modalData.length - 1].Second_NO
        xAxisData=[...Array(maxNum)].map((k,i)=>i+1);
        this.myChart = this.$echartsc.init(this.$refs.myChart);
        // 指定图表的配置项和数据
        var option = {
          backgroundColor: '#3f474e',
          color: ['#00FFFF', '#349e85', '#FF6A6A',"#BF3EFF"],
          legend: {
            data: ["CO2", "NOX", "K","车速"],
            textStyle: {
              color: 'rgb(204, 204, 204)'
            },
            icon: "roundRect"

          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis' 
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            name:"(s)",
            nameTextStyle :{
					    fontSize: 15
			    	},
            splitLine: {
              show: false
            },
            axisLabel: { color: 'rgb(204, 204, 204)', interval: 5 },   // x轴字体颜色
            axisLine: {
              lineStyle: { color: 'rgb(204, 204, 204)'}    // x轴坐标轴颜色
            },
            data: xAxisData
          },
          yAxis: {
            // type: 'value',
            type: 'log',
            min: 0.001,
            splitLine: {
              show: false
            },
            axisLabel: {
                  formatter: function (value) {
                    return value === 0.001 ? 0 : value;
                  },
                  textStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                }
          },
          series: [
            {
              name: 'CO2',
              type: 'line',
              data: this.mateoption(this.CO2Arr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#00FFFF' //折线颜色
                  }
                }
              }
            },
            {
              name: 'NOX',
              type: 'line',
              data: this.mateoption(this.NOXArr),
              symbol: 'circle', //去掉折线图中的节点
              smooth: true, //true 为平滑曲线，false为直线
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#349e85' //折线颜色
                  }
                }
              }
            },
            {
              name: 'K',
              type: 'line',
              data: this.mateoption(this.KArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#FF6A6A' //折线颜色
                  }
                }
              }
            },
           {
              name: '车速',
              type: 'line',
              data: this.mateoption(this.speedArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#BF3EFF' //折线颜色
                  }
                }
              }
            }
          ]
        };

        this.myChart.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    // 自由加速法echarts图配置
    LightProofSmoke_chart() {
      try {
        let xAxisData = []
        if (this.modalData.length == 0) return;
        let maxNum = this.modalData[this.modalData.length - 1].Second_NO
        xAxisData=[...Array(maxNum)].map((k,i)=>i+1);
        this.myChart = this.$echartsc.init(this.$refs.myChart);
        // 指定图表的配置项和数据
        var option = {
          backgroundColor: '#3f474e',
          color: ['#FF6A6A'],
          legend: {
            data: ["K"],
            textStyle: {
              color:'rgb(204, 204, 204)'
            },
            icon: "roundRect"

          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis' 
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            name:"(s)",
            nameTextStyle :{
					    fontSize: 15
			    	},
            splitLine: {
              show: false
            },
            axisLabel: { color: 'rgb(204, 204, 204)', interval: 5 },   // x轴字体颜色
            axisLine: {
              lineStyle: { color: 'rgb(204, 204, 204)' }    // x轴坐标轴颜色
            },
            data: xAxisData
          },
          yAxis: {
            // type: 'value',
            type: 'log',
            min: 0.001,
            splitLine: {
              show: false
            },
            axisLabel: {
                  formatter: function (value) {
                    return value === 0.001 ? 0 : value;
                  },
                  textStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                }
          },
          series: [
            {
              name: 'K',
              type: 'line',
              data: this.mateoption(this.KArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#FF6A6A' //折线颜色
                  }
                }
              }
            }
          ]
        };

        this.myChart.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    //双怠速法echarts图配置
    TSI_chart() {
      try {
        let xAxisData = []
        if (this.modalData.length == 0) return;
        let maxNum = this.modalData[this.modalData.length - 1].Second_NO
        xAxisData=[...Array(maxNum)].map((k,i)=>i+1);
        this.myChart = this.$echartsc.init(this.$refs.myChart);
        // 指定图表的配置项和数据
        var option = {
          backgroundColor: '#3f474e',
          color: ['#00FFFF', '#349e85', '#FF6A6A', '#C71585'],
          legend: {
            data: ["CO", "HC", "O2", "CO2","车速"],
            textStyle: {
              color: 'rgb(204, 204, 204)'
            },
            icon: "roundRect"

          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis' 
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            name:"(s)",
            nameTextStyle :{
					    fontSize: 15
			    	},
            splitLine: {
              show: false
            },
            axisLabel: { color: 'rgb(204, 204, 204)', interval: 5 },   // x轴字体颜色
            axisLine: {
              lineStyle: { color: 'rgb(204, 204, 204)' }    // x轴坐标轴颜色
            },
            data: xAxisData
          },
          yAxis: {
            // type: 'value',
            type: 'log',
            min: 0.001,
            splitLine: {
              show: false
            },
            axisLabel: {
                  formatter: function (value) {
                    return value === 0.001 ? 0 : value;
                  },
                  textStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                }
          },
          series: [
            {
              name: 'CO',
              type: 'line',
              data: this.mateoption(this.COArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#00FFFF' //折线颜色
                  }
                }
              }
            },
            {
              name: 'HC',
              type: 'line',
              data: this.mateoption(this.HCArr),
              symbol: 'circle', //去掉折线图中的节点
              smooth: true, //true 为平滑曲线，false为直线
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#349e85' //折线颜色
                  }
                }
              }
            },
            {
              name: 'O2',
              type: 'line',
              data: this.mateoption(this.O2Arr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#FF6A6A' //折线颜色
                  }
                }
              }
            },
            {
              name: 'CO2',
              type: 'line',
              data: this.mateoption(this.CO2Arr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#FF6A6A' //折线颜色
                  }
                }
              }
            }
          ]
        };

        this.myChart.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    //稳态工况法echarts图配置
    ASM_chart() {
      try {
        let xAxisData = []
        if (this.modalData.length == 0) return;
        let maxNum = this.modalData[this.modalData.length - 1].Second_NO
        xAxisData=[...Array(maxNum)].map((k,i)=>i+1);
        this.myChart = this.$echartsc.init(this.$refs.myChart);
        // 指定图表的配置项和数据
        var option = {
          backgroundColor: '#3f474e',
          color: ['#00FFFF', '#349e85', '#FF6A6A', '#C71585',"#BF3EFF"],
          legend: {
            data: ["HC", "CO", "CO2", "NO","车速"],
            textStyle: {
              color: 'rgb(204, 204, 204)'
            },
            icon: "roundRect"

          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis' 
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            name:"(s)",
            nameTextStyle :{
					    fontSize: 15
			    	},
            splitLine: {
              show: false
            },
            axisLabel: { color: 'rgb(204, 204, 204)', interval: 7 },   // x轴字体颜色
            axisLine: {
              lineStyle: { color: 'rgb(204, 204, 204)' }    // x轴坐标轴颜色
            },
            data: xAxisData
          },
          yAxis: {
            // type: 'value',
            type: 'log',
            min: 0.001,
            splitLine: {
              show: false
            },
            axisLabel: {
                  formatter: function (value) {
                    return value === 0.001 ? 0 : value;
                  },
                  textStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                }
          },
          series: [
            {
              name: 'HC',
              type: 'line',
              data: this.mateoption(this.HCArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#00FFFF' //折线颜色
                  }
                }
              }
            },
            {
              name: 'CO',
              type: 'line',
              data: this.mateoption(this.COArr),
              symbol: 'circle', //去掉折线图中的节点
              smooth: true, //true 为平滑曲线，false为直线
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#349e85' //折线颜色
                  }
                }
              }
            },
            {
              name: 'CO2',
              type: 'line',
              data: this.mateoption(this.CO2Arr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#FF6A6A' //折线颜色
                  }
                }
              }
            },
            {
              name: 'NO',
              type: 'line',
              data: this.mateoption(this.NOArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#FF6A6A' //折线颜色
                  }
                }
              }
            },
             {
              name: '车速',
              type: 'line',
              data: this.mateoption(this.speedArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#BF3EFF' //折线颜色
                  }
                }
              }
            }
          ]
        };

        this.myChart.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    //简易瞬态工况法echarts图配置
    IM_chart() {
      try {
        let xAxisData = []
        if (this.modalData.length == 0) return;
        let maxNum = this.modalData[this.modalData.length - 1].Second_NO
        xAxisData=[...Array(maxNum)].map((k,i)=>i+1);
        this.myChart = this.$echartsc.init(this.$refs.myChart);
        // 指定图表的配置项和数据
        var option = {
          backgroundColor: '#3f474e',
          color: ['#00FFFF', '#349e85', '#FF6A6A', '#C71585',"#BF3EFF"],
          legend: {
            data: ["HC", "CO2", "NOX", "O2","车速"],
            textStyle: {
              color: 'rgb(204, 204, 204)'
            },
            icon: "roundRect"

          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis' 
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            name:"(s)",
            nameTextStyle :{
					    fontSize: 15
			    	},
            splitLine: {
              show: false
            },
            axisLabel: { color: 'rgb(204, 204, 204)', interval: 7 },   // x轴字体颜色
            axisLine: {
              lineStyle: { color: 'rgb(204, 204, 204)'}    // x轴坐标轴颜色
            },
            data: xAxisData
          },
          yAxis: {
            // type: 'value',
            type: 'log',
            min: 0.001,
            splitLine: {
              show: false
            },
            axisLabel: {
                  textStyle: {
                    color: 'rgb(204, 204, 204)'
                  },
                  formatter: function (value) {
                    return value === 0.001 ? 0 : value;
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'rgb(204, 204, 204)'
                  }
                }
          },
          series: [
            {
              name: 'HC',
              type: 'line',
              data: this.mateoption(this.HCArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#00FFFF' //折线颜色
                  }
                }
              }
            },
            {
              name: 'CO2',
              type: 'line',
              data: this.mateoption(this.CO2Arr),
              symbol: 'circle', //去掉折线图中的节点
              smooth: true, //true 为平滑曲线，false为直线
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#349e85' //折线颜色
                  }
                }
              }
            },
            {
              name: 'NOX',
              type: 'line',
              data: this.mateoption(this.NOXArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#FF6A6A' //折线颜色
                  }
                }
              }
            },
            {
              name: 'O2',
              type: 'line',
              data: this.mateoption(this.O2Arr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#FF6A6A' //折线颜色
                  }
                }
              }
            },
            {
              name: '车速',
              type: 'line',
              data: this.mateoption(this.speedArr),
              symbol: 'circle',//拐点样式
              itemStyle: {
                normal: {
                  lineStyle: {
                    width:2,
                    color: '#BF3EFF' //折线颜色
                  }
                }
              }
            }
          ]
        };

        this.myChart.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
   changeType(Iutype) {
      if (Iutype == "G") {
        this.IUTYPE = "G"
        this.LD_chart();
      } else if (Iutype == "F") {
        this.IUTYPE = "F"
        this.LightProofSmoke_chart()
      } else if (Iutype == "A") {
        this.IUTYPE = "A"
        this.TSI_chart()
      } else if (Iutype == "B") {
        this.IUTYPE = "B"
        this.ASM_chart()
      } else if (Iutype == "C") {
        this.IUTYPE = "C"
        this.IM_chart()
      }

    },
    resize() {
      if (this.myChart) this.myChart.resize();
    },

    //重置
    chongzhi() {
      if(this.modalData&&this.modalData.length != 0){
        this.myChart.clear()
        this.myChart.dispose()
        this.myChart = null
      }
      this.canotUse = false
      clearInterval(this.interval)
      // this.IUTYPE = "",
      this.interval = null
      this.i_num = 0
      this.j_num = 0
      this.wendu = 0
      this.shidu = 0
      this.daqiya = 0
      this.zhuansu = 0
      this.CO2 = 0
      this.NOX = 0
      this.K = 0
      this.CO = 0
      this.HC = 0
      this.O2 = 0
      this.NO = 0
      this.speed = 0
      this.CO2Arr = []
      this.NOXArr = []
      this.KArr = []
      this.COArr = []
      this.HCArr = []
      this.O2Arr = []
      this.NOArr = []
      this.speedArr = []
    },
    setHeight() {
      // console.log(this.$refs.echart_width.offsetWidth);
      this.Width = this.$refs.echart_width.offsetWidth + "px";
   },

  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.setHeight);
  }

}
</script>

<style scoped lang="less">
.body {
  height: 600px;
  margin: 20px;
  border-radius: 5px;
  display: flex;
  .leftcontent {
    width: 55%;
    margin-right: 10px;
    .leftTop {
     width: 100%;
     height: 200px;
     .vlpn {
    display: flex;
    border-radius: 6px;
    border-style: double;
    text-align: center;
    padding: 0px 2px;
    font-weight: bold; margin-left: 22px;
    height: 30px;
    width:85px;
    font-size: 13px;
    align-items: center;
    justify-content: center;
   }  
    }
    .leftDown {
      width: 100%;
      height: 400px;
      min-width: 400px;
      //   background-color: green;
      display: flex;
      flex-direction: column;
      p {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-weight: bolder;
        font-size: 20px;
        margin-left: 20px;
      }
      .echart1 {
        height: 350px;
        width: 100% !important;
      }
    }
  }
  .rightcontent {
    width: 45%;
    // background-color: yellow;
    display: flex;
    flex-direction: column;
    p {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-weight: bolder;
      font-size: 20px;
      margin-left: 20px;
    }
    .echart2 {
      height: 100%;
      background-color: #3f474e
    }
  }
}
</style>