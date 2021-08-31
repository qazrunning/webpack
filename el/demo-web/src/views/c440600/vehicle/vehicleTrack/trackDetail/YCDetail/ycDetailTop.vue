<template>
  <div class="detail_top fx__bgcolor" ref="detailTop">
    <Spin fix v-if="loading"></Spin>
    <div v-else class="content">
      <div v-if="tableData.GJXXBH" class="cont_left">
        <div class="header">
          <div
            class="stationName temacol fx__simpleline"
            :title="tableData.RSStationName"
          >
            {{ tableData.RSStationName || "- -" }}
          </div>
          <div class="weather">
            <div class="weath_item" title="坡度">
              <i
                class="iconfont icon-podupoxiangfenxi font_blue"
                style="font-size:16px"
              ></i>
              <span class="asscol">{{ tableData.Slope || "- -" }}°</span>
            </div>
            <div
              class="weath_item"
              :title="'温度' + getYcMonitorTipXZ(tableData.TemperatureFJ, 2)"
            >
              <i
                class="iconfont icon-app_icons--8 font_blue"
                style="font-size:15px"
              ></i>
              <span
                :class="
                  islightHightColor(tableData.TemperatureFJ, 2)
                    ? 'lightHig'
                    : 'asscol'
                "
                >{{ tableData.Temperature || "- -" }}°C</span
              >
            </div>
            <div
              class="weath_item"
              :title="'湿度' + getYcMonitorTipXZ(tableData.HumidityFJ, 2)"
            >
              <i
                class="iconfont icon-shidu font_blue"
                style="font-size:15px"
              ></i>
              <span
                :class="
                  islightHightColor(tableData.HumidityFJ, 2)
                    ? 'lightHig'
                    : 'asscol'
                "
                >{{ tableData.Humidity || "- -" }}%</span
              >
            </div>
            <div
              class="weath_item"
              :title="'风速' + getYcMonitorTipXZ(tableData.WindSpeedFJ, 2)"
            >
              <i
                class="iconfont icon-ziyuan font_blue"
                style="font-size:15px"
              ></i>
              <span
                :class="
                  islightHightColor(tableData.WindSpeedFJ, 2)
                    ? 'lightHig'
                    : 'asscol'
                "
                >{{ tableData.WindSpeed || "- -" }}m/s</span
              >
            </div>
            <div
              class="weath_item"
              :title="'大气压' + getYcMonitorTipXZ(tableData.AtmosphereFJ, 2)"
            >
              <i
                class="iconfont icon-speed font_blue"
                style="font-size:13px"
              ></i>
              <span
                :class="
                  islightHightColor(tableData.AtmosphereFJ, 2)
                    ? 'lightHig'
                    : 'asscol'
                "
                >{{ tableData.Atmosphere || "- -" }}kPa</span
              >
            </div>
          </div>
        </div>
        <div class="main">
          <div class="main_item res_val">
            <div
              v-if="tableData.Highemissions == 1"
              :style="
                `background:${returnResColor(tableData.MonitorResult)[0]}`
              "
              class="testResult"
            >
              {{
                returnMonitorResult(tableData.MonitorResult) +
                  "、" +
                  returnHighemissions(tableData.Highemissions)
              }}
            </div>
            <div
              v-else
              :style="
                `background:${returnResColor(tableData.MonitorResult)[0]}`
              "
              class="testResult"
            >
              {{ returnMonitorResult(tableData.MonitorResult) }}
            </div>
            <span
              class="asscol"
              :style="
                `background:${returnResColor(tableData.MonitorResult)[1]}`
              "
              >{{
                tableData.resReason ||
                  returnMonitorResult(tableData.MonitorResult)
              }}</span
            >
          </div>
          <div class="main_item vlpn_box">
            <div class="card_tit_left fx__simpleline">
              <span
                title="车牌号"
                class="vlpn"
                :style="setVLPNColor(tableData.VLPNColor)"
                >{{ tableData.VLPN || "无车牌" }}</span
              >
              <div class="car_tit_info">
                <div v-if="tableData.CarType" class="info_item temacol">
                  {{ tableData.CarType }}
                </div>
                <div v-if="tableData.FuelType" class="info_item temacol">
                  {{ tableData.FuelTypeName }}
                </div>
                <div
                  v-if="tableData.Highemissions == 1"
                  style="border:1px solid #EEC900;font-size:12px;border-radius:10px;height:20px;line-height:18px;margin-left:10%;padding:0 6px;color:#EEC900;"
                  class="red"
                >
                  高排
                </div>
              </div>
            </div>
            <div class="card_tit_right fx__simpleline">
              <span title="检测时间" class="test_timer temacol">{{
                tableData.PassdateTime | dataFormat("yyyy年MM月dd日 hh:mm:ss")
              }}</span>
            </div>
          </div>
          <Row class="main_item wrw_box">
            <i-col class="wrw_item">
              <span class="wrw_val asscol">CO(%)</span>
              <span
                class="wrw_num"
                :class="{
                  cxColor: tableData.COJG == 0 && tableData.MonitorResult == 0,
                }"
                >{{ tableData.CO }}</span
              >
              <label class="asscol" :style="'opacity:0'"
                >限值:{{ tableData.COXZ }}</label
              >
            </i-col>
            <i-col class="wrw_item">
              <span class="wrw_val asscol">CO2(%)</span>
              <span
                class="wrw_num"
                :class="{
                  cxColor: tableData.CO2JG == 0 && tableData.MonitorResult == 0,
                }"
                >{{ tableData.CO2 }}</span
              >
              <label class="asscol" :style="'opacity:0'"
                >限值:{{ tableData.CO2XZ }}</label
              >
            </i-col>
            <i-col class="wrw_item">
              <span class="wrw_val asscol">NO(10⁻⁶)</span>
              <span
                class="wrw_num"
                :class="{
                  cxColor: tableData.NOJG == 0 && tableData.MonitorResult == 0,
                }"
                >{{ returNum(tableData.NO) }}</span
              >
              <label class="asscol" :style="tableData.NOXZ ? '' : 'opacity:0'"
                >限值:{{ returNum(tableData.NOXZ) }}</label
              >
            </i-col>
            <i-col class="wrw_item">
              <span class="wrw_val asscol">HC(10⁻⁶)</span>
              <span
                class="wrw_num"
                :class="{
                  cxColor: tableData.HCJG == 0 && tableData.MonitorResult == 0,
                }"
                >{{ returNum(tableData.HC) }}</span
              >
              <label class="asscol" :style="'opacity:0'"
                >限值:{{ returNum(tableData.HCXZ) }}</label
              >
            </i-col>
            <i-col class="wrw_item">
              <span class="wrw_val asscol">不透光度(%)</span>
              <span
                class="wrw_num"
                :class="{
                  cxColor:
                    tableData.OpacityJG == 0 && tableData.MonitorResult == 0,
                }"
                >{{ returNum(tableData.Opacity) }}</span
              >
              <label
                class="asscol"
                :style="tableData.OpacityXZ ? '' : 'opacity:0'"
                >限值:{{ returNum(tableData.OpacityXZ) }}</label
              >
            </i-col>
          </Row>
        </div>
        <Row class="other_info">
          <i-col span="20">
            <div class="car_state asscol">
              <div class="state_item">
                车辆速度：
                <span>{{
                  tableData.SPEED ? returNum(tableData.SPEED) : "- -"
                }}</span
                >km/h
              </div>
              <div class="state_item">
                加速度：
                <span>{{ tableData.Acceleration || "- -" }}</span>
                m/s
                <sup>2</sup>
              </div>
              <div class="state_item">
                比功率：
                <span>{{ tableData.VSP || "- -" }}</span
                >kW/t
              </div>
            </div>
          </i-col>
          <i-col span="4" style="text-align:right;">
            <Icon
              v-if="tableData.FuelType === 'B' && isprint"
              title="打印报告"
              class="print animated fadeIn"
              type="md-print"
              @click.prevent.stop="print(tableData)"
            />
          </i-col>
        </Row>
      </div>
      <div v-else class="nodata">暂无数据</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ycDetailTop",
  props: {
    infoObj: {
      type: Object,
    },
  },
  data() {
    return {
      tableData: {}, // 显示的数据
      loading: false,
      cddata: {},
    };
  },

  methods: {
    async init() {
      await this.getCDData();
      await this.getTelemetryDetail();
    },
    // 获得要显示的数据
    async getTelemetryDetail() {
      let params = {
        GJXXBH: this.infoObj.GJXXBH,
        RSStationCode: this.infoObj.RSStationCode,
      };
      
      this.loading = true;
      this.tableData = {};
      let res = await this.$curl.get("api/hj/getYCDetailInfo", {
        params: JSON.stringify(params),
      });
      if (res.state == 1) {
        this.tableData = res.result || {};
        this.changeData(this.tableData);
      }
      this.loading = false;
    },
    // 处理要显示的数据
    changeData(tableData) {
      tableData.FuelTypeName = this.returncodename(
        this.cddata.cd_fueltype,
        tableData.FuelType
      );
      tableData.RSStationName = this.returncodename(
        this.cddata.rsstationinfo,
        tableData.RSStationCode
      );
      let data = tableData;
      tableData.resReason = this.getYcMonitorReason(data);
      this.tableData = tableData;
    },

    async getCDData() {
      let cdList = ["rslimit", "rsstandard", "rsstationinfo", "cd_fueltype"];
      let res = await this.$curl.get("api/hj/getHYCCDList", {
        params: JSON.stringify(cdList),
      });
      if (res.state === 1) {
        this.cddata = res.data;
      }
    },

    setVLPNColor(VLPNColor) {
      if (!this.$hjconfig.vlpn_c[VLPNColor]) return {};
      const vlpn_c = this.$hjconfig.vlpn_c[VLPNColor];
      return {
        display: "inline-block",
        margin: "-2 auto",
        "text-align": "center",
        padding: "3px 5px",
        background: `${vlpn_c.Background}`,
        color: `${vlpn_c.TextColor}`,
      };
    },
    //  * 超限，合格，不判定，无效 得判定
    returnMonitorResult(type) {
      const MonitorResultList = {
        0: "超限",
        1: "合格",
        2: "不判定",
        3: "无效",
      };
      return MonitorResultList[type] ? MonitorResultList[type] : "";
    },
    // 高排判定
    returnHighemissions(type) {
      const HighemissionsList = {
        0: "非高排",
        1: "高排",
      };
      return HighemissionsList[type] ? HighemissionsList[type] : "";
    },
    // 处理数字
    returNum(type, toNum) {
      if (type != 0 && !type) return "- -";
      type = Number(type);
      let num;
      if (!toNum) num = type.toFixed();
      else num = type.toFixed(toNum);
      // num = Number(num);
      return num ? num : "- -";
    },

    // 获取遥测检测结果原因
    getYcMonitorReason(res) {
      const stationlist = this.cddata.rsstationinfo;
      const rslimitlist = this.cddata.rslimit;
      const rsstandardlist = this.cddata.rsstandard;
      let reason = "";
      let standardID = "";
      let rslimit = [];
      let standardname = "";
      let findResult = stationlist.find((s) => {
        return s.RSStationCode == res.RSStationCode;
      });
      standardID = findResult === undefined ? "" : findResult.TelemetryStandardID;
      if (res.MonitorResult == 1) {
        //合格
        const resdata = rsstandardlist.find((s) => {
          return s.TelemetryStandardID == standardID;
        });
        if (resdata) {
          standardname = resdata.Name;
          return "依 " + standardname + " 标准判定";
        } else return "";
      } else if (res.MonitorResult == 0) {
        // 超限
        let arr = [];
        rslimit = rslimitlist.filter((r) => {
          let limit =
            r.TelemetryStandardID == standardID &&
            r.StandardType == 0 &&
            (r.FuelType == res.FuelType || !r.FuelType);
          return limit;
        });

        rslimit.forEach((v) => {
          if (res[v.YinZiValue + "JG"] == "0") {
            arr.push(v.YinZi);
          }
        });

        reason = arr.join("、") + "超出限值";
        return reason;
      } else if (res.MonitorResult == 2) {
        // 不判定
        let arr = [];
        let haslimit = rslimitlist.filter(
          (r) => r.FuelType == res.FuelType && r.StandardType == 0
        );

        if (res.VLPNColor == "05") arr.push("绿牌车");
        if ((!res.FuelType || res.FuelType == "Y") && res.Opacity <= 30)
          arr.push("无燃油类型且不透光度≤30%");
        else if (!haslimit || (!haslimit.length && res.FuelType == "A"))
          arr.push("无汽油判定执行标准");
        else if (!haslimit || (!haslimit.length && res.FuelType == "B"))
          arr.push("无柴油判定执行标准");
        else if (
          !haslimit ||
          (!haslimit.length && res.FuelType != "B" && res.FuelType != "A")
        )
          arr.push("无此燃油类型判定执行标准");
        reason = arr.join(",");
        return reason || "不判定";
      } else if (res.MonitorResult == 3) {
        // 无效
        let arr = [];
        rslimit = rslimitlist.filter((r) => {
          let limit =
            r.TelemetryStandardID == standardID &&
            r.StandardType == 2 &&
            (r.FuelType == res.FuelType || !r.FuelType);
          return limit;
        });
        rslimit.forEach((v) => {
          if (
            res[v.YinZiValue + "FJ"] &&
            JSON.parse(res[v.YinZiValue + "FJ"]).JG == 0
          ) {
            arr.push(v.YinZi);
          }
          // 风速
          if (v.YinZiValue == "Wspeed") {
            if (res.WindSpeedFJ && JSON.parse(res.WindSpeedFJ).JG == 0) {
              arr.push(v.YinZi);
            }
          }
        });
        reason = arr.join("、") + "不在有效范围内";
        return arr.length ? reason : "检测值不在有效范围内";
      } else return "";
    },
    // 获取提示限值
    getYcMonitorTipXZ(data, type) {
      if (data && type == 2) {
        data = JSON.parse(data);
        let title = "";
        if (data.LowLimit && data.UpperLimit)
          title = `限值:${data.LowLimit}~${data.UpperLimit}`;
        else if (data.LowLimit && !data.UpperLimit)
          title = `限值:${data.LowLimit}`;
        else if (!data.LowLimit && data.UpperLimit)
          title = `限值:${data.UpperLimit}`;
        return title || "";
      } else return "";
    },
    // 判断是否超限或无效控制高亮
    islightHightColor(data, type) {
      if (data && type == 2) {
        data = JSON.parse(data);
        // 0:无效，1有效
        let state = false;
        state = data.JG == 0 ? true : false;
        return state || false;
      } else return false;
    },
    // 根据cd表返回codename
    returncodename(cdList, code) {
      return this.$options.filters.returnCodeName(cdList, code);
    },
  },

  computed: {
    returnResColor(res) {
      return function(res) {
        if (res == "0") return ["rgba(255,152,0,1)", "rgba(255,152,0,0.4)"];
        else if (res == "1")
          return ["rgba(56,142,60,1)", "rgba(56,142,60,0.4)"];
        else if (res == "2")
          return ["rgba(96,125,139,1)", "rgba(96,125,139,0.4)"];
        else if (res == "3")
          return ["rgba(158,158,158,1)", "rgba(158,158,158,0.4)"];
      };
    },
  },
  created() {
    this.init();
  },
};
</script>

<style scoped lang="less">
.detail_top {
  width: 100%;
  height: 50%;
  position: relative;
  overflow: hidden auto;
  border-radius: 6px;

  .content {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
    padding: 2.1% 1.7% 1.1% 1.7%;
    .cont_left {
      flex: 5;
      min-width: 485px;
      margin-right: 30px;
      position: relative;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 2.3%;
        .stationName {
          font-size: 18px;
          text-align: left;
          max-width: 15em;
        }
        .weather {
          flex: 1;
          display: flex;
          margin-left: 3px;
          align-items: center;
          justify-content: flex-end;
          .weath_item {
            display: flex;
            align-items: center;
            margin-right: 1%;
            &:last-child {
              margin-right: 0;
            }
            span {
              display: inline-block;
              margin-left: 3px;
              font-size: 12px;
            }
          }
        }
      }
      .main {
        .main_item {
          margin-bottom: 2.3%;
        }
        .res_val {
          display: flex;
          align-items: center;
          // font-size: 14px;
          font-size: 0.5rem;
          height: 35px;
          .testResult {
            display: flex;
            align-items: center;
            justify-content: center;
            // color: #fff;
            height: 100%;
            // width: 110px;
            width: 15%;
            // font-size: 17px;
            font-size: 1rem;
          }
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            height: 100%;
            width: 85%;
            // padding-right: 75px;
            // font-size: 14px;
            font-size: 0.5rem;
          }
        }
        .vlpn_box {
          display: flex;
          align-items: center;
          .card_tit_left {
            display: flex;
            flex: 1;
            align-items: center;
            .vlpn {
              font-size: 17px;
            }
            .car_tit_info {
              display: flex;
              .info_item {
                font-size: 12px;
                // border: 1px solid #fff;
                border-radius: 10px;
                height: 20px;
                line-height: 18px;
                margin-left: 10%;
                padding: 0 6px;
              }
            }
          }
          .card_tit_right {
            .test_timer {
              font-size: 13px;
              display: block;
              text-align: right;
            }
          }
        }
        .wrw_box {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          width: 100%;
          padding: 2% 0;
          .wrw_item {
            flex: 1;
            display: flex;
            flex-direction: column;
            .wrw_val {
              font-size: 16px;
            }
            .wrw_num {
              margin-top: 2px;
              // color: #fff;
              font-size: 20px;
              font-weight: bold;
            }
            label {
              // font-size: 14px;
              font-size: 0.6rem;
            }
          }
        }
      }
      .other_info {
        position: absolute;
        bottom: 1%;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        .car_state {
          display: flex;
          font-size: 14px;
          justify-content: space-between;
          span {
            display: inline-block;
            // color: #fff;
            font-size: 15px;
            margin-right: 4px;
          }
        }
        .print {
          font-size: 30px;
          // color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          &:hover {
            color: rgba(141, 190, 254, 1);
          }
        }
      }
    }
    .cont_right {
      flex: 4;
      position: relative;
      display: flex;
      align-items: center;
      .img_box {
        width: 100%;
        padding-bottom: 56%;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 5px;
        }
      }
      .btn_group {
        background-color: #fff;
        border-radius: 3px;
        padding: 0 3px;
        display: flex;
        align-items: center;
        position: absolute;
        top: 5%;
        right: 3%;
        .change {
          font-size: 15px;
          font-weight: bold;
        }
        i {
          cursor: pointer;
          // padding: 2px;
        }
      }

      .carlane {
        display: inline-block;
        height: 35px;
        width: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 50%;
        // background: url("../../../../../public/static/img/laneBGimg.png")
        // no-repeat rgba(0, 0, 0, 0.5);
        background-size: 35px 35px;
        position: absolute;
        right: 1em;
        bottom: 1em;
        font-weight: 500;
        font-size: 18px;
        color: #fff;
      }
    }
  }
}
.font_blue {
  color: #63cdda;
}
.nodata {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
}

.cxColor {
  color: #ff9800 !important;
}

.lightHig {
  color: #ed4014;
}
.res_val {
  .testResult {
    color: #fff;
  }
}

::-webkit-scrollbar {
  width: 1px;
  background-color: rgba(255, 255, 255, 0);
}
::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0);
}

@media screen and (max-width: 1700px) {
  .detail_top .content .cont_left {
    .header .stationName {
      font-size: 18px;
    }
    .main {
      .vlpn_box .card_tit_left .vlpn {
        font-size: 16px;
      }
      .res_val {
        height: 30px;
        .testResult {
          font-size: 16px;
        }
      }
    }
    .other_info {
      bottom: 1%;
      .print {
        font-size: 28px;
      }
    }
  }
}
@media screen and (max-width: 1600px) {
  .detail_top .content .cont_left {
    .other_info {
      .car_state {
        font-size: 13px;
        span {
          font-size: 14px;
        }
      }
      .print {
        font-size: 27px;
      }
    }
    .main {
      .main_item {
        margin-bottom: 2%;
      }
      .res_val {
        height: 28px;
        .testResult {
          font-size: 15px;
        }
        span {
          font-size: 13px;
        }
      }
      .wrw_box .wrw_item {
        .wrw_val {
          font-size: 14px;
        }
        .wrw_num {
          font-size: 18px;
        }
      }
    }
  }
}
@media screen and (max-width: 1500px) {
  .detail_top .content .cont_left {
    flex: 4;
    margin-right: 16px;
    .header .stationName {
      font-size: 18px;
    }
    .main {
      .main_item {
        margin-bottom: 1.8%;
      }
      .vlpn_box .card_tit_left .vlpn {
        font-size: 14px;
      }
      .res_val {
        height: 26px;
        .testResult {
          font-size: 14px;
        }
        span {
          font-size: 12px;
        }
      }
    }
    .other_info {
      bottom: 0;
      .car_state {
        font-size: 12px;
        span {
          font-size: 13px;
        }
      }
      .print {
        font-size: 25px;
      }
    }
  }
}
@media screen and (max-width: 1300px) {
  .detail_top {
    height: auto;
  }
  .detail_top .content {
    display: block;
    .cont_left {
      width: 100%;
      flex: 1;
    }
    .detail_top .content .cont_right {
      width: 100%;
      flex: 1;
    }
  }
}
/* 屏幕宽度小于1200px时的样式 */
@media screen and (max-width: 1199px) {
  .detail_top .content .cont_left .main {
    .vlpn_box .card_tit_left .vlpn {
      font-size: 16px;
    }
    .res_val {
      height: 24px;
    }
  }
}
</style>
