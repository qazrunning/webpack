<template>
  <div>
    <div>
      <Row :gutter="18">
        <Col :md="24" :lg="24" :xl="24" :xxl="12">
        <div class="car-div fx__box demo-box">
          <kind-bar @changeTime="handleVehicleStat" style="width:100%;height:235px;padding:0 4px;" :value="vehicletypeStat" :selectState="selectState" :text="vehicletypeTitle"></kind-bar>
        </div>
        </Col>
        <Col :md="24" :lg="24" :xl='24' :xxl='12'>
        <div class="car-div fx__box demo-box marginTop" :bordered="false">
          <tips-pie v-if="selectState=='zxcyc'" style="width:100%;height:235px;padding:0 4px;" :text="stionTitle" :value="zxcyDateByStaion"></tips-pie>
          <kind-pie v-else style="width:100%;height:235px;padding:0 4px;" :value="fueltypeStat" :text="fuelTypeTitle"></kind-pie>
        </div>
        </Col>
      </Row>
      <Row :gutter="18" style="margin-top:18px;">
        <Col :md="24" :lg="24" :xl="24" :xxl="12">
        <!-- <Col :md="24" :lg="24">
          <div class="car-div fx__box demo-box" :bordered="false">
            <type-bar
              style="width:100%;height:150px;padding:0 4px;"
              :value="bztypeStat"
              :text="bztypeTitle.toString()"
            ></type-bar>
          </div>
          </Col>-->
        <Col :md="24" :lg="24" :xl="24" :xxl="24">
        <div class="car-div fx__box demo-box">
          <type-pie style="width:100%;height:486px;padding:0 4px;" :value="emissionstandardStat" :text="emissionstandardTitle"></type-pie>
        </div>
        </Col>
        </Col>
        <div v-if="selectState == 'bmd'">
          <Col :md="24" :lg="24" :xl="24" :xxl="12" class="marginTop">
          <div class="car-div fx__box demo-box" style="height:500px;">
            <cross-bar style="width:100%;height:100%" :value="bmdValue" :text="bmdTypeTitle"></cross-bar>
          </div>
          </Col>
        </div>
        <div v-else-if="selectState == 'hmd'">
          <Col :md="24" :lg="24" :xl="24" :xxl="12" class="marginTop">
          <div class="car-div fx__box demo-box" style="height:500px;">
            <cross-bar style="width:100%;height:100%" :value="hmdValue" :waterColor="statColor" :borderColor="statBorderColor" :text="hmdTypeTitle"></cross-bar>
          </div>
          </Col>
        </div>
        <div v-else>
          <Col :md="24" :lg="24" :xl="24" :xxl="12">
          <Col :md="24" :lg="24" :xl="24" :xxl="24" class="marginTop">
          <div class="car-div fx__box demo-box">
            <water-polo style="width:100%;height:220px;padding:0 4px;" :value="vectypeStat[1]" :sum="vectypeStat[2]" :waterColor="statColorOther" :borderColor="statBorderColorOther" :text="vectypeTitle"></water-polo>
          </div>
          </Col>
          <Col :md="24" :lg="24" :xl="24" :xxl="24" style="margin-top:18px;">
          <div class="car-div fx__box demo-box" style="height:250px;">
            <water-polo style="width:100%;height:100%" :value="vectypeStat[0]" :sum="vectypeStat[2]" :waterColor="statColor" :borderColor="statBorderColor" :text="vectypeTitle"></water-polo>
          </div>
          </Col>
          </Col>
        </div>
      </Row>
    </div>

    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import renderMessege from "../../../HJ/components/message";
import { formatDates } from "../../../HJ/utils/utils";
import {
  ChartPie,
  ChartBar,
  TypePie,
  // TypeBar,
  KindPie,
  KindBar,
  WaterPolo,
  TipsPie,
  // TipsBar,
  CrossBar
} from "../../components/charts";
import { pieCustomized, echartsPie } from "../../../HJ/components/echartsPie";
export default {
  components: {
    ChartPie,
    ChartBar,
    pieCustomized,
    echartsPie,
    TypePie,
    // TypeBar,
    KindPie,
    KindBar,
    WaterPolo,
    TipsPie,
    // TipsBar,
    CrossBar
  },
  data() {
    return {
      hmdTitle: [],
      isShowType: true,
      height: 0,
      isShowTitle: true,
      spinShow: true,
      fuelTypeTitle: "燃料种类统计",
      hmdTypeTitle: "黑名单种类车辆数（辆）统计",
      bmdTypeTitle: "白名单种类车辆数（辆）统计",
      emissionstandardTitle: "排放标准统计",
      vehicletypeTitle: "车型（大类）统计",
      bztypeTitle: "黄绿标统计",
      vectypeTitle: "车辆归类统计",
      stionTitle: "TOP5检测站重型柴油通过率",
      fueltypeStat: [],
      emissionstandardStat: [],
      vehicletypeStat: [],
      bztypeStat: [],
      vectypeStat: [],
      hmdValue: [],
      bmdValue: [],
      statColor: ["#FFBF11", "#F4B30E", "#EACE36"],
      statColorOther: ["#FE5555", "#F07581", "#FB5E61"],
      statBorderColor: "#FFBF11",
      statBorderColorOther: "#FE5555",
      statHeight: this.statH,
      zxcyDateByStaion: [] //按站点的重型柴油车
    };
  },
  props: {
    statH: {
      type: Number
    },
    selectState: {
      type: String
    }
  },
  methods: {
    handleVehicleStat(time) {
      this.vectypeStat = [];
      const _this = this;
      let year = "";
      if(time){
        year = formatDates(time, "yyyy")
      }else{
        year = formatDates(new Date(), "yyyy")
      }
      this.$curl
        .get("api/hj/getVehicleStat", { selectState: this.selectState, year })
        .then(res => {
          this.spinShow = false;
          if (res.data0.length == 0) {
            return;
          } else {
            this.fueltypeStat = this.filterData(res.data0);
            this.emissionstandardStat = this.filterData(res.data1);
            this.vehicletypeStat = this.filterData(res.data2);
            if (this.selectState == "zdgz") {
              this.vehicletypeTitle =
                year + "重点关注异地重柴统计";
                this.vehicletypeStat.forEach(a => {
                  a.name=a.name+'月';
                });
            } else {
              this.vehicletypeTitle = "车型（大类）统计";
            }
            // this.bztypeStat = this.filterData(res.data3);
            if (this.selectState == "hmd") {
              this.hmdValue = this.filterData(res.data13);
            } else if (this.selectState == "bmd") {
              this.bmdValue = this.filterData(res.data14);
            }
            this.vectypeStat.push(res.data4[0]);
            //this.vectypeStat.push(res.data5[0]);
            this.vectypeStat.push(res.data6[0]);
            //this.vectypeStat.push(res.data7[0]);
            //this.vectypeStat.push(res.data8[0]);
            this.vectypeStat.push(res.data9[0]);
            this.zxcyDateByStaion = res.data10.filter(v => {
              return v.name != null && v.zxcy > 0;
            });
          }
        })
        .catch(err => {
          this.spinShow = false;
          _this.$Message.error({
            render: h => {
              return h("span", [
                h(renderMessege, {
                  props: { message: "获取统计信息失败！", error: err }
                })
              ]);
            },
            duration: 3,
            closable: true
          });
        });
    },
    filterData(value) {
      return value.filter(function(v) {
        return v.name != null;
      });
    }
  },
  created() {},
  mounted() {
    this.handleVehicleStat();
  },
  watch: {
    selectState(newval) {
      this.handleVehicleStat();
    }
  }
};
</script>
<style scoped>
.car-div {
  padding: 16px;
  /* background: #fff; */
  border: none;
  border-radius: 4px;
  /* -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2); */
  /* box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2); */
}
.ivu-card-body {
  /* padding: 8px 8px; */
}
.flip-container {
  -webkit-perspective: 500;
  -moz-perspective: 500;
  -ms-perspective: 500;
  perspective: 500;
  -ms-transform: perspective(500px);
  -moz-transform: perspective(500px);
  -moz-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  display: inline-block;
  position: relative;
}
/*由于内层绝对定位导致高度缺少，这里显式设置了宽高*/
.flip-container,
.front,
.back {
}

.flip-container:hover .front {
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  -ms-transform: rotateY(180deg);
  transform: rotateY(180deg);
}
.flip-container:hover .back {
  -webkit-transform: rotateY(0deg);
  -moz-transform: rotateY(0deg);
  -o-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  transform: rotateY(0deg);
  z-index: 3; /* 降级处理不支持CSS3的浏览器，只是简单的将back上升盖住front */
}

.front,
.back {
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.6s;
  -moz-transition: 0.6s;
  -o-transition: 0.6s;
  -ms-transition: 0.6s;
  transition: 0.6s;
  position: absolute;
  top: 0px;
  left: 0px;
}
.front {
  background: #fff;
  z-index: 2;
}
.back {
  background: #2c343c;
  -webkit-transform: rotateY(-180deg);
  -moz-transform: rotateY(-180deg);
  -o-transform: rotateY(-180deg);
  -ms-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
}
.marginTop {
  margin-top: 0;
}
/* 屏幕宽度小于1600怎加样式 */
@media screen and (max-width: 1600px) {
  .marginTop {
    margin-top: 18px;
  }
}
</style>

