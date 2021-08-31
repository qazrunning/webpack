<template>
  <div class="right-container  fx__box" style="height:100%;" v-resize="resize">
    <div style="overflow: hidden auto;" v-if="hasAuthority">
      <Row :gutter="16">
        <i-col span="12" :sm="24" :md="12" :lg="12">
          <div class="demo-box">
            <div class="fx__box-top  fx__text_headline">
              最近已审核信息
            </div>
            <div class="fx__box-center" v-show="recentAuditList.length>0" style="height:300px;overflow:hidden;">
              <div style="height:100%;overflow:auto">
                <div class="rank__body">
                  <transition-group name="list" tag="p">
                    <div class="fx__item rank__item" v-for="item in recentAuditList" :key="item.CheckId" @click.stop="onAuditClick(item)">
                      <Row class-name="checked_list">
                        <i-col :xs="12" :sm="4" :md="4" class-name="text-single fx__text_default" style="text-align:center;">{{item.VLPN || '-'}} </i-col>
                        <i-col :xs="12" :sm="4" :md="4" class-name="text-single fx__text_default" style="text-align:center;">{{item.ApplyUserName || '-'}}</i-col>
                        <i-col :xs="12" :sm="4" :md="4" class-name="text-single fx__text_default" style="text-align:center;">{{initform.cd_station[item.OrgCode] || '-'}}</i-col>

                        <!-- <i-col :xs="12" :sm="4" :md="4" class-name="text-single fx__text_default" style="text-align:center;">{{item.StationName || ''}}</i-col> -->
                        <i-col style="margin-left:20px;" span="4" :class-name="(item.AuditState == '1' || item.AuditState == '3')? 'pass no_wrap  fx__text_default ' : item.AuditState == '0'?'no_pass no_wrap  fx__text_default ' : 'back no_wrap  fx__text_default '">{{auditPass(item.AuditState)}}</i-col>
                        <!-- <i-col span="4" class-name=" fx__text_default">{{item.Checker}}</i-col> -->
                        <i-col span="6" class-name=" fx__text_default no_wrap" style="text-align:center;"><i class="fa fa-clock-o" style="margin-right:4px;font-size:16px;"></i>{{item.CheckTime | dataFormat("yyyy-MM-dd hh:mm",1)}}</i-col>
                      </Row>
                      <div class="fx__line_divide" style="height:1px;"></div>
                    </div>

                  </transition-group>
                </div>
              </div>
            </div>
            <div class="fx__box-center fx__text_default" v-show="recentAuditList.length==0" style="height:300px;text-align:center;">暂无数据</div>
          </div>
        </i-col>
        <i-col span="12" :sm="24" :md="12" :lg="12">
          <div class="demo-box fx__box">
            <div class="fx__box-top  fx__text_headline">
              当天分类统计
            </div>
            <div class="fx__box-center" ref="nowDayAudit_div" style="height:300px;"></div>
            <!-- <div class="fx__box-center" v-show="nowDateData.length==0" style="height:300px;text-align:center;">
                 暂无数据
            </div>-->
          </div>
        </i-col>
      </Row>
      <!-- <Row :gutter="16" style="margin-top:20px;">
        <i-col span="6" :lg="6" :md="12">
          <div class="fx__box demo-box" @click.stop="onDetectClick(0)">
            <div class="fx__box-top demo-box-top">
              <div class="green demo-box-top-left">
                <i class="fa fa-bandcamp"></i>
              </div>
              <div class="demo-box-top-right">
                <div>总数</div>
                <countTo class="num" :end="detectArr.toDayNum" :useGroup="true" separator=","></countTo>
              </div>
            </div>
            <div class="fx__box-center vs-line-divide"></div>
            <div class="fx__box-bottom">当日</div>
          </div>
        </i-col>
        <i-col span="6" :lg="6" :md="12">
          <div class="fx__box demo-box" @click.stop="onDetectClick(1)">
            <div class="fx__box-top demo-box-top">
              <div class="red demo-box-top-left">
                <i class="fa fa-bandcamp"></i>
              </div>
              <div class="demo-box-top-right">
                <div>总数</div>
                <countTo class="num" :end="detectArr.yestDayNum" :useGroup="true" separator=","></countTo>
              </div>
            </div>
            <div class="fx__box-center vs-line-divide"></div>
            <div class="fx__box-bottom">昨日</div>
          </div>
        </i-col>
        <i-col span="6" :lg="6" :md="12">
          <div class="fx__box demo-box" @click.stop="onDetectClick(2)">
            <div class="fx__box-top demo-box-top">
              <div class="orange demo-box-top-left">
                <i class="fa fa-bandcamp"></i>
              </div>
              <div class="demo-box-top-right">
                <div>总数</div>
                <countTo class="num" :end="detectArr.lastWeekNum" :useGroup="true" separator=","></countTo>
              </div>
            </div>
            <div class="fx__box-center vs-line-divide"></div>
            <div class="fx__box-bottom">上周</div>
          </div>
        </i-col>
        <i-col span="6" :lg="6" :md="12">
          <div class="fx__box demo-box" @click.stop="onDetectClick(3)">
            <div class="fx__box-top demo-box-top">
              <div class="blue demo-box-top-left">
                <i class="fa fa-bandcamp"></i>
              </div>
              <div class="demo-box-top-right">
                <div>总数</div>
                <countTo class="num" :end="detectArr.lastMonthNum" :useGroup="true" separator=","></countTo>
              </div>
            </div>
            <div class="fx__box-center vs-line-divide"></div>
            <div class="fx__box-bottom">上月</div>
          </div>
        </i-col>
      </Row>-->

      <Row style="margin-top:20px;">
        <i-col span="24">
          <div class="fx__box demo-box">
            <div class="fx__box-top vs-offset fx__text_headline">
              过去十天的审核量
            </div>
            <div class="fx__box-center" ref="lastTen_div" style="height:304px;"></div>
            <!-- <div class="fx__box-center" v-show="lastTenData.length==0" style="height:320px;text-align:center;">
                 暂无数据
            </div>-->
          </div>
        </i-col>
      </Row>
    </div>

    <!-- 普通用户 -->
    <div style="overflow: hidden auto;" v-else>
      <div class="demo-box fx__box">
        <div class="fx__box-top vs-offset fx__text_headline">
          <span>最近已审核信息</span>
        </div>
        <div class="fx__box-center" v-show="recentAuditList.length>0" style="height:100%;overflow:hidden;">
          <div style="height:100%;overflow:auto">
            <div class="rank__body">
              <transition-group name="list" tag="p">
                <div class="fx__item rank__item" style="" v-for="item in recentAuditList" :key="item.CheckTime" @click.stop="onAuditClick(item)">
                  <Row>
                    <i-col span="3" class-name="text-single">{{item.VLPN || ''}}</i-col>
                    <i-col span="3" class-name="text-single">{{item.ApplyUserName || ''}}</i-col>
                    <!-- <i-col span="3" class-name="text-single">{{item.StationName || ''}}</i-col> -->
                    <i-col span="7" class-name="text-single">&nbsp;{{initform.cd_station[item.OrgCode] || ''}}</i-col>
                    <i-col span="4" class-name="text-single">{{initform.cd_checkType[item.CheckType] || ''}}</i-col>
                    <i-col span="2" :class-name="(item.AuditState == '1' || item.AuditState == '3')? 'pass no_wrap  fx__text_default ' : item.AuditState == '0'?'no_pass no_wrap  fx__text_default ' : 'back no_wrap  fx__text_default '">{{auditPass(item.AuditState)}}</i-col>
                    <!-- <i-col span="2" class-name="rank_rate fx__text_num">{{item.Checker}}</i-col> -->
                    <i-col span="6" class-name="rank_rate fx__text_num"><i class="fa fa-clock-o" style="margin-right:4px;font-size:16px;"></i>{{item.CheckTime | dataFormat("yyyy-MM-dd hh:mm:ss",1)}}</i-col>
                  </Row>
                  <div class="fx__line_divide" style="height:1px;"></div>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
        <div class="fx__box-center" v-show="recentAuditList.length==0" style="height:300px;text-align:center;">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import CountTo from "../../components/countTo";
import { config } from '../../../utils/tools'
export default {
  data() {
    return {
      themaColor: this.$store.state.core.themaColor
        ? this.$store.state.core.themaColor.basetextcolor
        : "#fff",
      initform: {},
      nowDateData: [],
      lastTenData: [],
      startTime: new Date(), //开始时间
      endTime: new Date(), //结束时间
      detectArr: {
        toDayNum: 0,
        yestDayNum: 0,
        lastWeekNum: 0,
        lastMonthNum: 0
      },
      recentAuditList: [], //最近已审核信息
      hasAuthority: false, //是否拥有该操作权限
      lastTen_div: null,
      nowDayAudit_div: null
    };
  },
  components: {
    CountTo
  },
  methods: {
    auditPass(value) {
      if (value == 1 || value == 3) { 
        return '通过'
      } else if (value == 0) {
        return '不通过'
      } else if (value == 4) { 
        return '退回'
      }
    },
    resize() {
      if (this.lastTen_div) {
        this.lastTen_div.resize();
      }
      if (this.nowDayAudit_div) {
        this.nowDayAudit_div.resize();
      }
    },
    setVLPNColor(VLPNColor) {
      if (!config.vlpn_c[VLPNColor]) return `padding:2px 4px;`;
      const vlpn_c = config.vlpn_c[VLPNColor];
      return `
              margin: 0 auto;
              border-radius: 6px;
              border-style: double;
              text-align: center;
              padding:2px 2px;
              background: ${vlpn_c.Background};
              color:${vlpn_c.TextColor};
              border-color:${vlpn_c.BorderColor};
              font-weight: bold;
              font-size: 14px;`;
    },
    onAuditClick(row) {
      this.$emit("auditClick", row);
    },
    //0当天,1昨天,2上周,3上月
    onDetectClick(type) {
      let startTime = new Date();
      let endTime = new Date();
      if (type == 0) {
        startTime = new Date();
        endTime = new Date();
      } else if (type == 1) {
        startTime = new Date().setDate(new Date().getDate() - 1);
        endTime = new Date().setDate(new Date().getDate() - 1);
      } else if (type == 2) {
        var nowTime = new Date().setDate(new Date().getDate() - 7);
        var day = new Date(nowTime).getDay();
        var oneDayTime = 24 * 60 * 60 * 1000;
        startTime = new Date(nowTime - (day - 1) * oneDayTime);
        endTime = new Date(nowTime + (7 - day) * oneDayTime);
      } else if (type == 3) {
        let lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth());
        var Year = lastMonthDate.getFullYear();
        var Month = lastMonthDate.getMonth();
        startTime = new Date(Year, Month - 1, 1);
        endTime = new Date(Year, Month - 1, this.getMonthDays(Year, Month));
      }
      this.$router.push({
        name: "hj-audit-search",
        params: { startTime, endTime }
      });
    },
    //获得某月的天数
    getMonthDays(Year, Month) {
      var monthStartDate = new Date(Year, Month, 1);
      var monthEndDate = new Date(Year, Month + 1, 1);
      var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      return days;
    },
    async getAuthority() {
      let res = await this.$curl.post("api/hj/hasAuthority", { type: "cz02" });
      if (res.state) {
        this.hasAuthority = res.hasAuthority;
        this.loadData();
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取权限信息失败!"
        });
      }
    },
    //异步获取字典表数据
    async loadCDData() {
      const self = this;
      const list = [
        {
          tableName: "CD_CheckType",
          columns: "CodeValue,CodeName,IsAvailable",
          where: "where IsAvailable=1",
        },
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
          where: ''
        }
      ];
      let res = await this.$curl.get("api/hj/getCDData", { CDDataList: JSON.stringify(list) });
      if (res.state) {
        const CD_Name = ["cd_checkType", "cd_station"];
        let data = [];
        res.data.map((items, index) => {
          self.initform[CD_Name[index]] = {};
          data = items[0].hasOwnProperty('IsAvailable') ? items.filter(i => i.IsAvailable == 1) : items;
          data.forEach(item => {
            self.initform[CD_Name[index]][item.CodeValue] = item.CodeName;
          });
        });
      }
    },
    //直接从浏览器缓存获取CD表或者从reids
    getDBinfoByMultipte() {
      const self = this;
      if (self.$getDBTable) {
        self.$getDBTable(['CD_CheckType', 'StationInfo']).then(res => {
          const CD_Name = ["cd_checkType", "cd_station"];
          let data = [];
          res.forEach((items, index) => {
            data = JSON.parse(items);
            self.initform[CD_Name[index]] = {};
            if (data[0].hasOwnProperty('IsAvailable')) data = data.filter(d => d.IsAvailable == '1');
            data.forEach(item => {
              self.initform[CD_Name[index]][item.CodeValue] = item.CodeName;
            });
          });
        })
      }
      else {
        self.loadCDData();
      }
      self.$nextTick(() => {
        self.getAuthority();
      });
    },
    async loadData() {
      const self = this;
      this.recentAuditList = [];
      //最近N条审核信息,默认前10条
      resData = await this.$curl.get("api/hj/getRecentAudit");
      if (resData.data && resData.data.length > 0)
        this.recentAuditList = resData.data;

      //如果没有改操作权限,则不显示图表
      if (!this.hasAuthority) return false;

      //统计数目
      let resData = await this.$curl.get("api/hj/getCountData");
      if (resData.state) {
        this.detectArr = {
          toDayNum: resData.toDay ? resData.toDay.Num : 0,
          yestDayNum: resData.yestDay ? resData.yestDay.Num : 0,
          lastWeekNum: resData.lastWeek ? resData.lastWeek.Num : 0,
          lastMonthNum: resData.lastMonth ? resData.lastMonth.Num : 0
        };
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取统计数目失败!"
        });
      }
      //过去十天的审核量
      resData = await this.$curl.get("api/hj/getlastTenData");
      if (resData.state) {
        this.startTime = resData.startTime;
        this.endTime = resData.endTime;
        this.lastTenData = resData.data;
        this.nowDateData = resData.data.filter(item => {
          return (
            new Date(
              self.$options.filters.dataFormat(
                item.ApplyTime,
                "yyyy-MM-dd hh:mm:ss"
              )
            ).getTime() >=
            new Date(
              self.$options.filters.dataFormat(
                resData.endTime,
                "yyyy-MM-dd 00:00:00"
              )
            ).getTime() ||
            new Date(
              self.$options.filters.dataFormat(
                item.CheckTime,
                "yyyy-MM-dd hh:mm:ss"
              )
            ).getTime() >=
            new Date(
              self.$options.filters.dataFormat(
                resData.endTime,
                "yyyy-MM-dd 00:00:00"
              )
            ).getTime()
          );
        });
        this.lastTenChart(); //获取过去十天
        this.nowDayAuditChart(); //当日每种类型的审核情况
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取过去十天的审核量失败!"
        });
      }
    },
    lastTenChart() {
      if (this.lastTenData.length <= 0) return;
      const self = this;
      let legend_data = [];
      let xAxis_data = [];
      let series_data = [];
      const checkType_arr = [
        ...new Set(self.lastTenData.map(item => item.CheckType))
      ];

      const color = ["#1699c2", "#ecab3e", "#f00", "0f0"];
      checkType_arr.forEach(function (Type, index) {
        legend_data.push(self.initform.cd_checkType[Type]);
        var objs = {
          name: self.initform.cd_checkType[Type],
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            normal: { color: color[index] }
          },
          data: []
        };

        for (var i = 10; i--;) {
          const dateTime = self.$options.filters.dataFormat(
            new Date(self.endTime).setDate(
              new Date(self.endTime).getDate() - i
            ),
            "yyyy-MM-dd"
          );
          if (!xAxis_data.includes(dateTime)) xAxis_data.push(dateTime);

          let hasData = self.lastTenData.filter(item => {
            return (
              new Date(
                self.$options.filters.dataFormat(item.ApplyTime, "yyyy-MM-dd")
              ).getTime() == new Date(dateTime).getTime() &&
              Type == item.CheckType
            );
          }).length;
          objs.data.push(hasData);
        }
        series_data.push(objs);
      });

      let option = {
        legend: {
          data: legend_data,
          textStyle: {
            fontFamily: "Open Sans",
            color: self.themaColor,
            fontSize: 13
          },
          orient: "horizontal",
          x: "center",
          y: "bottom",
          bottom: "1%",
          icon: "rect",
          itemWidth: 8,
          itemHeight: 8,
          type: "scroll",
          pageIconColor: "blue",
          pageIconInactiveColor: "#888",
          pageFormatter: "",
          pageButtonItemGap: -6
        },
        grid: {
          top: 10,
          left: "5%",
          right: "3%",
          bottom: 60
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: xAxis_data,
          axisLine: {
            show: true,
            lineStyle: {
              color: self.themaColor,
              width: 1,
              type: "dashed"
            }
          },
          axisLabel: {
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: self.themaColor, //X轴标注文字的颜色,
              fontSize: 13 //X轴标注文字的大小
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontFamily: "Open Sans",
              color: self.themaColor, //X轴标注文字的颜色,
              fontSize: 14 //X轴标注文字的大小
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: self.themaColor,
              width: 1,
              type: "dashed"
            }
          }
        },
        series: series_data
      };
      if (this.lastTen_div) {
        this.lastTen_div.clear();
        this.$echartsc.dispose(this.lastTen_div);
        this.lastTen_div = null;
      }
      if (this.$refs.lastTen_div) {
        this.lastTen_div = this.$echartsc.init(this.$refs.lastTen_div);
        this.lastTen_div.setOption(option, true);
      }
    },
    nowDayAuditChart() {
      let yAxis_data = [];
      let series_data = {
        noAudit: [],
        Pass: [],
        noPass: [],
        autoPass: [],
        back: []
      };
      const checkType_arr = [
        ...new Set(this.nowDateData.map(item => item.CheckType))
      ];
      checkType_arr.forEach(type => {
        yAxis_data.push(this.initform.cd_checkType[type]);
        series_data.noAudit.push(
          this.nowDateData.filter(item => {
            return item.CheckType == type && item.Status == 0;
          }).length
        );
        series_data.Pass.push(
          this.nowDateData.filter(item => {
            return (
              item.CheckType == type && item.Status == 1 && item.AuditState == 1
            );
          }).length
        );
        series_data.noPass.push(
          this.nowDateData.filter(item => {
            return (
              item.CheckType == type && item.Status == 1 && item.AuditState == 0
            );
          }).length
        );
        series_data.autoPass.push(
          this.nowDateData.filter(item => {
            return (
              item.CheckType == type && item.Status == 1 && item.AuditState == 3
            );
          }).length
        );
        series_data.back.push(
          this.nowDateData.filter(item => {
            return (
              item.CheckType == type && item.Status == 1 && item.AuditState == 4
            );
          }).length
        );
      });

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["待审核", "通过", "不通过", "自动审核","退回"],
          textStyle: {
            fontFamily: "Open Sans",
            color: this.themaColor,
            fontSize: 13
          },
          orient: "horizontal",
          x: "center",
          y: "bottom",
          icon: "rect",
          itemWidth: 8,
          itemHeight: 8,
          type: "scroll"
        },
        grid: {
          top: 10,
          left: "5%",
          right: "3%",
          bottom: 60
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: this.themaColor // 颜色
            }
          }
        },
        xAxis: {
          type: "category",
          data: yAxis_data,
          axisLine: {
            lineStyle: {
              color: this.themaColor // 颜色
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: function (value) {
              let valueTxt = "";
              if (value.length > 5 && yAxis_data.length > 3) {
                valueTxt = value.substring(0, 5) + "...";
              } else {
                valueTxt = value;
              }
              return valueTxt;
            }
          }
        },
        color: ["#fac858", "#91cc75", "#ee6666", "#fc8452","#73c0de"],
        series: [
          {
            name: "待审核",
            type: "bar",
            stack: "总量",
            barMaxWidth: 70,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if (params.value > 0) return params.value;
                  else return "";
                }
              }
            },
            data: series_data.noAudit
          },
          {
            name: "通过",
            type: "bar",
            stack: "总量",
            barMaxWidth: "70",
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if (params.value > 0) return params.value;
                  else return "";
                }
              }
            },
            data: series_data.Pass
          },
          {
            name: "不通过",
            type: "bar",
            stack: "总量",
            barMaxWidth: "70",
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if (params.value > 0) return params.value;
                  else return "";
                }
              }
            },
            data: series_data.noPass
          },
          {
            name: "自动审核",
            type: "bar",
            stack: "总量",
            barMaxWidth: "70",
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if (params.value > 0) return params.value;
                  else return "";
                }
              }
            },
            data: series_data.autoPass
          },
          {
            name: "退回",
            type: "bar",
            stack: "总量",
            barMaxWidth: "70",
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if (params.value > 0) return params.value;
                  else return "";
                }
              }
            },
            data: series_data.back
          }
        ]
      };
      if (this.nowDayAudit_div) {
        this.nowDayAudit_div.clear();
        this.$echartsc.dispose(this.nowDayAudit_div);
        this.nowDayAudit_div = null;
      }
      this.nowDayAudit_div = this.$echartsc.init(this.$refs.nowDayAudit_div);
      this.nowDayAudit_div.setOption(option, true);

      if (this.nowDayAudit_div.getOption().xAxis["0"].data.length > 3) {
        //x轴标签过多就倾斜
        this.nowDayAudit_div.setOption({
          xAxis: {
            axisLabel: {
              interval: 0,
              rotate: 10
            }
          }
        });
      }

      // console.log(yAxis_data,series_data,checkType_arr,this.nowDateData,this.initform)
    },
    //订阅socket
    subscribeSocket() {
      const _this = this;
      const fd = this.$app.io.on("ywxt/jgxt/dshxx", obj => {

        // console.log(obj,222);

        const msg = JSON.parse(obj.msgObj);
        if (msg && msg.Status == "0") {
          _this.lastTenData.push(msg);
          _this.nowDateData.push(msg);
        }
      });
      this.$once("hook:beforeDestroy", () => {
        fd.dispose();
      });
    }
  },
  mounted() {
    this.getDBinfoByMultipte();
    this.subscribeSocket();
  },
  created() { },
  beforeDestroy() {
    if (this.nowDayAudit_div) {
      this.nowDayAudit_div.clear();
      this.$echartsc.dispose(this.nowDayAudit_div);
      this.nowDayAudit_div = null;
    }
    if (this.lastTen_div) {
      this.lastTen_div.clear();
      this.$echartsc.dispose(this.lastTen_div);
      this.lastTen_div = null;
    }
  },
  watch: {
    nowDateData: {
      handler(newval, oldval) {
        if (this.nowDayAudit_div) this.nowDayAuditChart();
      },
      deep: true
    },
    lastTenData: {
      handler(newval, oldval) {
        if (this.lastTen_div) this.lastTenChart();
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.list-item {
  display: inline-block;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

.right-container {
  display: flex;
  flex-direction: column;
}
.fx__box-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}

//单行溢出显示省略号
.text-single {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.demo-box {
  cursor: pointer;
}

.demo-box-top {
  position: relative;
  display: flex;
  justify-content: flex-end;
  .demo-box-top-left {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #ffffff;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .demo-box-top-right {
    text-align: right;
    padding-left: 60px;
    .num {
      font-size: 26px;
    }
  }
}

.rank__body {
  overflow: auto;
  .rank__item {
    // padding: 10px;
    line-height: 60px;
    // border: 1px solid #ccc;
    // margin: 4px 0;
  }
}

.checked_list {
  padding: 0 10px;
}
.pass {
  position: relative;
  padding-left: 14px;
  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    background: #4caf50;
  }
}
.no_pass {
  position: relative;
  padding-left: 14px;
  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    background: #fb6340;
  }
}
.back {
  position: relative;
  padding-left: 14px;
  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    background: #73c0de;
  }
}
.no_wrap {
  white-space: nowrap;
}
</style>


