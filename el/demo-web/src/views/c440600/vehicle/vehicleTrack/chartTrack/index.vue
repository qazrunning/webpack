<template>
  <div style="min-height:100%;position:relative;">
    <!-- 筛选按钮 -->
    <Row :gutter="5">
      <i-col span="24">
        <Tag
          type="dot"
          @click.native="changeShowList('all')"
          :color="selectTagColor == 'all' ? 'success' : 'default'"
          style="cursor: pointer"
        >
          全部 ({{ allTrackData.length }})
        </Tag>
        <Tag
          v-for="item in cddata.cd_sourcetype"
          :key="item.CodeValue"
          type="dot"
          @click.native="changeShowList(item.CodeValue)"
          :color="selectTagColor == item.CodeValue ? 'success' : 'default'"
          style="cursor: pointer"
        >
          <svg
            class="icon"
            aria-hidden="true"
            v-html="retrunIconName(item.CodeValue)"
          ></svg>
          {{ item.CodeName }} ({{ returnListLength(item.CodeValue) }})</Tag
        >
      </i-col>
    </Row>
    <Row v-if="showTotalList.length > 0" class="demo-spin-article">
      <i-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
        <Row style="height: 300px; position: relative">
          <i-col span="2" style="height: 100%; position: absolute; left: 0">
            <span
              class="left-right-arrow"
              @click="handleToChangeList('before')"
            >
              <Icon type="ios-arrow-back" size="30" />
            </span>
          </i-col>
          <!-- 布局空盒子 -->
          <i-col span="2">
            <div style="height: 10px; width: 10px"></div>
          </i-col>
          <i-col
            span="4"
            v-for="(items, index) in nowShowList"
            :key="index"
            class="time-line-bc"
            
          >
            <span class="time-line-spot">
              <Icon type="md-information-circle" size="30" color="#5ECB4C" />
            </span>
            <div  :style="returnItemStyle(index)" class="fx__hover">
              <span :style="returnItemIcon(index, items.stype).style" class="fx__bgcolor icon-position ">
                <svg
                  class="icon-item"
                  aria-hidden="true"
                  v-html="returnItemIcon(index, items.stype).svg"
                ></svg>
              </span>
              <!-- 环检 -->
              <dl
                v-if="items.stype == 'HJ'"
                class="fx__box "
                @click="openTrackDetail(items, 'hj')"
              >
                <dt>
                  <!-- <span class="iconfont icon-camera"></span> -->
                  <span style="font-size: 12px">
                    环检检测：<span
                      :class="returnResultClass(items)"
                      class="result-item"
                    >
                      {{ items.VDCT == 1 ? "通过" : "不通过" }}
                    </span>
                  </span>
                </dt>

                <dt>
                  <span>检测站点：</span>
                  <span class="bold-text" >{{
                    returncodename(cddata.stationinfo, items.StationCode)
                  }}</span>
                </dt>
                <dt>
                  <span>检测时间：</span>
                  <span class="bold-text" >{{ items.times | dataFormat("yyyy-MM-dd") }}</span>
                </dt>
              </dl>

              <!-- 业务审核 -->
              <dl
                v-if="items.stype == 'YWSH'"
                class="fx__box "
                @click="openTrackDetail(items, 'ywsh')"
              >
                
                <dt>
                  <span
                    v-if="
                      handStrToShort(
                        returncodename(cddata.cd_checktype, items.CheckType)
                      ).notTooltip
                    "
                  >
                    审核类型：{{
                      handStrToShort(
                        returncodename(cddata.cd_checktype, items.CheckType)
                      ).str
                    }}
                  </span>
                  <Tooltip
                    max-width="200"
                    v-else
                    :content="
                      returncodename(cddata.cd_checktype, items.CheckType)
                    "
                  >
                    审核类型：{{
                      handStrToShort(
                        returncodename(cddata.cd_checktype, items.CheckType)
                      ).str
                    }}
                  </Tooltip>
                </dt>
                <dt>
                  <span>
                    审核结果：{{ handlerAuditState(items.AuditState) }}
                  </span>
                </dt>
                <dt>
                  <span>审核时间：</span>
                  <span>{{ items.times | dataFormat("yyyy-MM-dd") }}</span>
                </dt>
              </dl>

              <!-- 路检 -->
              <dl
                v-else-if="items.stype == 'LJ'"
                class="fx__box "
                @click="openTrackDetail(items, 'lj')"
              >
                
                <dt>
                  <span style="font-size: 12px">
                    路检信息：<span
                      :class="returnResultClass(items)"
                      class="result-item"
                    >
                      {{ items.Result }}
                    </span>
                  </span>
                </dt>

                <dt>
                  <span v-if="handStrToShort(items.Address).notTooltip">
                    检测地段：{{ handStrToShort(items.Address).str }}
                  </span>
                  <Tooltip max-width="200" v-else :content="items.Address">
                    检测地段：<span class="bold-text" > {{ handStrToShort(items.Address).str }}</span>
                  </Tooltip>
                </dt>
                <dt>
                  <span>检测时间：</span>
                  <span class="bold-text" >{{ items.CheckDate | dataFormat("yyyy-MM-dd") }}</span>
                </dt>
              </dl>
              <!-- 黑烟车 -->
              <dl
                v-else-if="items.stype == 'HYC'"
                class="fx__box "
                @click="openTrackDetail(items, 'hyc')"
              >
                

                <dt>
                  <span style="font-size:14px">
                    黑烟车：
                    <span :class="returnResultClass(items)" class="result-item">
                      {{ HYCResult(items.AuditResult) }}
                    </span>
                  </span>
                </dt>
                <dt>
                  <span v-if="handStrToShort(items.RSStationName).notTooltip">
                    监测点位： <span  class="bold-text" >{{ handStrToShort(items.RSStationName).str }}</span>
                  </span>
                  <Tooltip
                    max-width="200"
                    v-else
                    :content="items.RSStationName"
                  >
                    监测点位：{{ handStrToShort(items.RSStationName).str }}
                  </Tooltip>
                </dt>
                <dt>
                  <span>抓拍时间：</span>
                  <span  class="bold-text">{{ items.times | dataFormat("yyyy-MM-dd") }}</span>
                </dt>
              </dl>
              <!-- 遥测 -->
              <dl
                v-else-if="items.stype == 'YC'"
                class="fx__box "
                @click="openTrackDetail(items, 'yc')"
              >
                

                <dt>
                  <span style="font-size: 12px">
                    遥测结果：<span
                      :class="returnResultClass(items)"
                      class="result-item"
                    >
                      {{ YCResult(items.MonitorResult) }}
                    </span>
                  </span>
                </dt>
                <dt>
                  <span v-if="handStrToShort(items.RSStationName).notTooltip">
                    遥测站点： <span class="bold-text"> {{ handStrToShort(items.RSStationName).str }}</span>
                  </span>
                  <Tooltip
                    max-width="200"
                    v-else
                    :content="items.RSStationName"
                  >
                    遥测站点：{{ handStrToShort(items.RSStationName).str }}
                  </Tooltip>
                  <!-- <span>遥测站点：</span>
                  <span>{{ items.RSStationName }}</span> -->
                </dt>
                <dt>
                  <span>检测时间：</span>
                  <span  class="bold-text" >{{ items.times | dataFormat("yyyy-MM-dd") }}</span>
                </dt>
              </dl>
              <!-- obd -->
              <dl
                v-if="items.stype == 'obd'"
                class="fx__box "
                @click="openTrackDetail(items, 'OBD')"
              >
                

                <dt>
                  <span style="font-size: 12px"
                    >OBD装置：<span
                      :class="returnResultClass(items)"
                      class="result-item"
                    >
                      已安装
                    </span>
                  </span>
                </dt>
                <dt>
                  <span>OBD总时长：<span class="bold-text">{{ items.Total }}小时</span></span>
                </dt>
                <dt>
                  <span>OBD超标时长：<span class="bold-text">{{ items.NOxTotal }}小时</span></span>
                </dt>
              </dl>
            </div>
          </i-col>
          <i-col span="2" style="height: 100%; position: absolute; right: 0">
            <span class="left-right-arrow" @click="handleToChangeList('next')">
              <Icon type="ios-arrow-forward" size="30" />
            </span>
          </i-col>
        </Row>
      </i-col>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Row>
    <div v-else class="demo-spin-article">
      <p class="fx__text_default" style="text-align:center">暂无数据</p>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
    <div
      class="fx__text_assist fx__text_assist__position"
      v-if="showTotalList.length > 0"
    >
      注：此数据计算于{{ refreshTimeStr | dataFormat("yyyy-MM-dd hh:mm:ss") }}.
      如需强制刷新请点击
      <Button
        size="small"
        icon="md-refresh"
        type="primary"
        shape="circle"
        @click="refreshData"
      ></Button>
    </div>
    <Modal v-model="vehicle_model" width="60" :closable="false">
      <h2 slot="header" style=" text-align: center">
        {{ trackTitle }}
      </h2>
      <div>
        <trackDetail v-if="vehicle_model" :infoObj="infoObj" />
      </div>

      <div slot="footer">
        <Button type="warning" v-if="isHjInfo" @click="jumphistory" >查看详情</Button>
        <Button type="info" @click="vehicle_model = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import trackDetail from "../trackDetail/index"; // 车辆追踪详情组件
import { getCDData } from "../../../../../HJ/utils/utils";
import "./ycydIcon/iconfont.js";
export default {
  name: "chartTrack",
  components: {
    trackDetail,
  },
  data() {
    return {
      nowShowList: [], // 目前正在展示的项
      showTotalList: [], // 要展示的数据列表
      horzCount: 0, // 默认展示项下标
      trackData: {}, // 各个类型的数据
      allTrackData: [], // 总的数据列表
      // cd表
      cddata: {},
      // 表格
      vehicleBarInfo: {},
      vehicle_model: false, // 控制模态框显示
      infoObj: {}, // 传递给详情组件的信息
      refresh: false, // 是否强制刷新  默认否
      refreshTimeStr: new Date(), // 上次数据更新时间
      selectTagColor: "all", // 选中的tag
      trackTitle: "", // 打开模态框的标题
      spinShow: false,
      isHjInfo:false,
      hjInfo:null,
    };
  },
  props: {
    VLPN: {
      type: String,
      required: true,
      default: "",
    },
    VLPNColor: {
      type: String,
      required: true,
      default: "",
    },
    Vehicleid: {
      type: Number,
    },
  },
  watch: {
    VLPN(val,oldval){
      // this.$nextTick(() => {
        this.getVehicleTrackInfo();
      // });
    },
    horzCount() {
      this.showList();
    },
    
  },
  methods: {
    async init() {
      await this.getCD();
      await this.getVehicleTrackInfo();
    },
    jumphistory(){
      let InspectionNum = this.hjInfo.InspectionNum
      let VLPN = this.VLPN
      this.vehicle_model = false
      this.$router.push({
         name: "hj-home-supervise-search-jump",
         params: {
             searchValue: InspectionNum,
             VLPN: VLPN,
         },
      });
    },
    // 获取车辆车辆追踪
    async getVehicleTrackInfo() {
      this.spinShow = true;
      let param = {
        VLPN: this.VLPN,
        VLPNColor: this.VLPNColor,
        Vehicleid: this.Vehicleid,
        refresh: this.refresh, // 是否强制刷新
      };
      let res = await this.$curl.get("api/hj/getTotalVehicleTrackList", {
        param: JSON.stringify(param),
      });
      if (res.state === 1) {
        this.allTrackData = [];
        this.trackData = res.data.trackData;
        this.vehicleBarInfo = res.data.tableData;
        this.refreshTimeStr = res.data.timeStr;
        for (let key in this.trackData) {
          this.trackData[key] = this.sortByTime(this.trackData[key]);
          this.allTrackData = this.allTrackData.concat(this.trackData[key]);
        }
        this.showTotalList = this.allTrackData = this.sortByTime(
          this.allTrackData
        );
        this.handlerHozList(this.showTotalList);
        this.selectTagColor = "all";
        this.spinShow = false;
      }
    },
    async getCD() {
      const _this = this;
      this.cddata = {};
      let cdname = [
        {
          tableName: "cd_checktype",
          where: "where IsAvailable=1"
        },
        {
          tableName: "stationinfo",
          where: "where IsAvailable=1"
        }
      ];
      if(this.$getDBTable){
        let cd_list = cdname.map(e => e.tableName)
        this.$getDBTable(cd_list).then(data =>{
          _this.cddata.cd_checktype = JSON.parse(data[0])
          _this.cddata.stationinfo = JSON.parse(data[1])
            // console.log(this.data);

        })
      }
      else{
        getCDData(this,cdname).then(res => {
          const { data, state, msg } = res;
          if (state) {
            _this.cddata.cd_checktype = data[0]
            _this.cddata.stationinfo = data[1]

          }
        });
      }
      await this.$curl.get('api/hj/getSourceType').then(res=>{
       if(res.state){
         _this.cddata.cd_sourcetype = res.data
       }else{
        _this.cddata.cd_sourcetype = [{CodeValue: "3", CodeName: "环检", IsAvailable: 1}]
       }
      })
    },
    //获取CD表
    // async getCDData() {
    //   this.cddata = {};
    //   let CDDataList = [
    //     {
    //       tableName: "cd_checktype",
    //     },
    //     {
    //       tableName: "stationinfo",
    //     }
    //   ];
    //   let res = await this.$curl.get("api/car/getCDDataByList", {
    //     CDDataList: JSON.stringify(CDDataList),
    //   });
    //   if (res.state === 1) {
    //     this.cddata = res.data;
    //   }
    // },

    // 处理业务审核结果
    handlerAuditState(key) {
      let result = "- -";
      switch (key) {
        case "1":
          result = "通过";
          break;

        case "0":
          result = "不通过";

          break;
        case "3":
          result = "自动通过";

          break;

        default:
          break;
      }
      return result;
    },
    // 按时间排序方法
    sortByTime(arr) {
      let result = arr.sort(function(a, b) {
        return a.times < b.times ? 1 : -1;
      });
      return result;
    },
    // 截取短字符串方法
    handStrToShort(source) {
      let result = {
        notTooltip: true,
        str: "",
      };
      if (typeof source !== "string") {
        return result;
      }
      if (source.length > 5) {
        result.str = source.substr(0, 5) + "...";
        result.notTooltip = false;
      } else {
        result.str = source;
        result.useTooltip = false;
      }
      return result;
    },
    // 过滤显示内容的方法
    changeShowList(type) {
      this.selectTagColor = type;
      switch (type) {
        case "all":
          this.handlerHozList(this.allTrackData);
          break;
        default:
          this.handlerHozList(this.trackData[type]);
          break;
      }
    },
    handleToChangeList(key) {
      switch (key) {
        case "before":
          this.horzCount > 0 ? this.horzCount-- : (this.horzCount = 0);
          break;
        case "next":
          this.horzCount++;
          break;
        default:
          break;
      }
    },
    openTrackDetail(item, type) {
      this.infoObj.VLPN = this.VLPN;
      this.infoObj.VLPNColor = this.VLPNColor;
      this.infoObj.Vehicleid = this.Vehicleid;
      this.infoObj = Object.assign(this.infoObj, item);
      if(type=='hj'){
        this.hjInfo = item
        this.isHjInfo =true
        
      }else{
        this.hjInfo =null
        this.isHjInfo =false
      }
      
      switch (type) {
        case "hj":
          this.trackTitle = "环检";
          break;
        case "lj":
          this.trackTitle = "路检";
          break;
        case "hyc":
          this.trackTitle = "黑烟车";
          break;
        case "yc":
          this.trackTitle = "遥测";
          break;
        case "OBD":
          this.trackTitle = "OBD";
          break;
        case "ywsh":
          this.$router.push({
            name: "hj-audit-search",
            query: {
              CheckId: item.CheckId
            }
          })
        default:
          break;
      }
      if(type!='ywsh'){

        this.vehicle_model = true;
      }
    },
    // 处理水平渲染的数组
    handlerHozList(source) {
      this.showTotalList = source;
      if (source.length < 5) {
        this.nowShowList = source;
        return;
      }
      this.nowShowList = [];
      for (let i = 0; i < 5; i++) {
        this.nowShowList.push(source[i]);
      }
      return;
    },
    showList() {
      let source = this.showTotalList;
      let countNumberStart = 0 + this.horzCount * 5;
      if (countNumberStart > source.length - 1) {
        this.horzCount--;
        return;
      }
      let countNumberEnd =
        source.length > countNumberStart + 5
          ? countNumberStart + 5
          : source.length;
      this.nowShowList = [];
      for (let i = countNumberStart; i < countNumberEnd; i++) {
        this.nowShowList.push(source[i]);
      }
      return;
    },
    // 计算遥测结果
    YCResult(value) {
      let result = "";
      switch (value) {
        case 0:
          result = "超限";
          break;
        case 1:
          result = "合格";
          break;
      }
      return result;
    },
    // 计算黑烟车结果
    HYCResult(value) {
      let result = "";
      if (value == "13" || value == "25" || value == "37") {
        result = "非黑烟车";
      } else {
        result = "黑烟车";
      }
      return result;
    },
    // 根据cd表返回codename
    returncodename(cdList, code) {
      return this.$options.filters.returnCodeName(cdList, code);
    },
    // 根据类型返回btn的样式
    returnButtonType(key) {
      let result = "default";
      switch (key) {
        case "1":
          result = "dashed";
          break;
        case "2":
          result = "warning";
          break;
        case "3":
          result = "primary";
          break;
        case "4":
          result = "error";
          break;
        case "5":
          result = "info";
          break;
        case "6":
          result = "success";
          break;
        default:
          break;
      }
      return result;
    },
    // 返回btn是否显示
    returnButtonShow(key) {
      let result = false;
      if (this.trackData[key] && this.trackData[key].length > 0) {
        result = true;
      }
      return result;
    },
    // 返回对应类型的数据条数
    returnListLength(key) {
      let result = 0;
      if (this.trackData[key]) {
        result = this.trackData[key].length;
      }
      return result;
    },
    // 强制刷新数据
    async refreshData() {
      this.refresh = true;
      await this.getVehicleTrackInfo();
      this.refresh = false;
    },
    // 返回tag的icon
    retrunIconName(value) {
      let result = "";
      switch (value) {
        case "1":
          result = "<use xlink:href='#icon-obd'></use>";
          break;
        case "2":
          result = "<use xlink:href='#icon-camera'></use>";
          break;
        case "3":
          result = "<use xlink:href='#icon-chelianghuanjian'></use>";
          break;
        case "4":
          result = "<use xlink:href='#icon-heiyanche'></use>";
          break;
        case "5":
          result = "<use xlink:href='#icon-cheliangjiancha'></use>";
          break;
        case "6":
          result = "<use xlink:href='#icon-chelianghuanjian'></use>";
          break;
        default:
          result = "<use xlink:href='#icon-chelianghuanjian'></use>";
          break;
      }
      return result;
    },
    // 返回渲染的item样式
    returnItemStyle(index) {
      let basicStyle = {
        // borderRadius: "4px",
        cursor: "pointer",
        width: "100%",
        position: "absolute",
      };
      if (this.themaColor == "dark") {
        basicStyle.border = "1px solid #AAB8C5 ";
      } else {
        basicStyle.border = "1px solid #DBDBDB ";
      }
      if (index % 2 == 1) {
        basicStyle.bottom = "2em";
      } else {
        basicStyle.top = "2em";
      }
      return basicStyle;
    },
    // 返回检查结果的样式
    returnResultClass(item) {
      let isPass = false;
      switch (item.stype) {
        case "HJ":
          if (item.VDCT == 1) {
            isPass = true;
          }
          break;
        case "YC":
          if (item.MonitorResult == 1) {
            isPass = true;
          }
          break;
        case "HYC":
          if (
            item.AuditResult == "13" ||
            item.AuditResult == "25" ||
            item.AuditResult == "37"
          ) {
            isPass = true;
          }
          break;
        case "LJ":
          if (item.Result == "合格") {
            isPass = true;
          }
          break;
        case "obd":
          isPass = true;
          break;
        case "YWSH":
          if (item.AuditState == 1) {
            isPass = true;
          }
          break;
        default:
          break;
      }
      if (isPass) {
        return "fx__bgcolor-green";
      }
      return "fx__bgcolor-red";
    },
    // 返回每个item 的图标
    returnItemIcon(index, stype) {
      let result = {
        style: {
          // left: "38%",
          position: "absolute",
          width:'40px',
          height:'20px',
          paddingLeft:'13px'  
        },
        svg: "<use xlink:href='#icon-obd'></use>",
      };
      if (this.themaColor == "dark") {
        result.style.border = "1px solid #AAB8C5 ";
      } else {
        result.style.border = "1px solid #DBDBDB ";
      }
      if (index % 2 == 1) {
        result.style.bottom = "-10px";
      } else {
        result.style.top = "-10px";
      }
      switch (stype) {
        case "obd":
          result.svg = "<use xlink:href='#icon-obd'></use>";
          break;
        case "YC":
          result.svg = "<use xlink:href='#icon-camera'></use>";
          break;
        case "HJ":
          result.svg = "<use xlink:href='#icon-chelianghuanjian'></use>";
          break;
        case "HYC":
          result.svg = "<use xlink:href='#icon-heiyanche'></use>";
          break;
        case "LJ":
          result.svg = "<use xlink:href='#icon-cheliangjiancha'></use>";
          break;
        case "YWSH":
          result.svg = "<use xlink:href='#icon-chelianghuanjian'></use>";
          break;
        default:
          result.svg = "<use xlink:href='#icon-chelianghuanjian'></use>";
          break;
      }
      return result;
    },
  },

  created() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
// 时间周背景
.time-line-bc {
  background: url("../../../../../../public/exhaust/img/line04.gif") 0 50% repeat-x;
  height: 100%;
  position: relative;
}
.time-line-bc dl dt {
  text-align: left;
  padding-left: 5px;
  font-size: 12px;
  padding-top: 2px;
  padding-bottom: 2px;
}
.time-line-spot {
  display: inline-block;
  position: absolute;
  margin-left: -15px;
  margin-top: -15px;
  left: 50%;
  top: 50%;
  z-index: 2;
}
.left-right-arrow {
  display: inline-block;
  position: absolute;
  margin-left: -15px;
  margin-top: -15px;
  left: 50%;
  top: 50%;
  cursor: pointer;
}
.fx__text_assist__position {
  // position: absolute;
  margin-top: 30px;
  // bottom: 0px;
}
.result-item {
  display: inline-block;
  padding: 0px 5px;
}

.icon {
  width: 13px;
  height: 12px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.icon-item {
  width: 13px;
  height: 12px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.icon-position{
  left: calc(~"50% - 20px" );
}
.bold-text{
  font-weight: bold;
}
</style>
