<template>
  <div v-if="isShow">
    <Collapse value="1">
      <Panel name="1">
        车辆追踪
        <div slot="content">
          <div
            class="time-line"
            style="position: inherit;"
            :style="style_div"
          >
            <Row>
              <i-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24"
                :xxl="0"
              >
                <div style="margin-bottom:10px;">
                  <Button
                    style="font-size:14px;margin-right:4px;background-color:rgb(247, 181, 59);color:#fff;"
                    @click="datafilter(alldata)"
                    v-show="alldata.length!=0"
                  >{{alldata.length?alldata.length+' ':''}}全部</Button>
                  <Button
                    style="font-size:14px;margin-right:4px;background-color:rgb(28, 191, 212);color:#fff;"
                    @click="datafilter(hjdata)"
                    v-show="hjdata.length!=0"
                  >{{hjdata.length?hjdata.length+' ':''}}环检信息</Button>
                  <Button
                    style="font-size:14px;margin-right:4px;background-color:rgb(105, 131, 239);color:#fff;"
                    @click="datafilter(shdata)"
                    v-show="shdata.length!=0"
                  >{{shdata.length?shdata.length+' ':''}}业务审核</Button>
                  <Button
                    style="font-size:14px;margin-right:4px;background-color:rgb(135, 206, 89);color:#fff;"
                    @click="datafilter(ljdata)"
                    v-show="ljdata.length!=0"
                  >{{ljdata.length?ljdata.length+' ':''}}路检信息</Button>
                  <Button
                    style="font-size:14px;margin-right:4px;background: rgba(64,142,238,1);;color:#fff;"
                    @click="datafilter(bjdata)"
                    v-show="bjdata.length!=0"
                  >{{bjdata.length?bjdata.length+' ':''}}报警信息</Button>
                  <Button
                    style="font-size:14px;margin-right:4px;background: rgba(190 190 190,1);;color:#fff;"
                    @click="datafilter(hycdata)"
                    v-show="hycdata.length!=0"
                  >{{hycdata.length?hycdata.length+' ':''}}黑烟车检测信息</Button>
                  <Button
                    style="font-size:14px;margin-right:4px;background: rgba(255,155,229,1);;color:#fff;"
                    @click="datafilter(overdata)"
                    v-show="overdata.length!=0"
                  >{{overdata.length?overdata.length+' ':''}}超限车检测信息</Button>
                  <!-- <Button
                    style="background-color:rgba(34,129,188,0.2);color:rgba(34,129,188,1);font-size:14px;margin-right:4px;"
                    @click="datafilter(fintdata)"
                    v-show="fintdata.length!=0"
                  >{{fintdata.length?fintdata.length+' ':''}}遥测抓拍</Button>
                  <Button
                    style="background-color: rgba(34,129,188,0.2);color:rgba(34,129,188,1);font-size:14px;margin-right:4px;"
                    @click="datafilter(lastdata)"
                    v-show="lastdata.length!=0"
                  >{{lastdata.length?lastdata.length+' ':''}}黑烟车抓拍</Button> -->
                </div>
              </i-col>
              <i-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24"
                :xxl="16"
              >
                <div
                  class="event_list"
                  style="margin-left:10px;overflow:hidden auto;max-height:460px;"
                >
                  <div
                    v-show="itemList.length!=0"
                    class="history-arrow"
                  ></div>
                  <ul
                    v-for="(item,index) in itemList"
                    :key="index"
                  >
                    <!-- 时间—年份 -->
                    <h2 @click="item.show=!item.show">
                      {{item.title}}
                      <Icon :type="item.show?'md-arrow-dropdown':'md-arrow-dropup'" />
                    </h2>
                    <li
                      v-show="item.show"
                      v-for="(items) in item.list"
                      :key="items.time"
                      v-bind:style="{height:items.height+'px'}"
                    >
                      <!-- 具体时间 -->
                      <!-- <h3 data-bind="text: showTime">{{items.times | dataFormat("MM-dd hh:mm")}}</h3> -->
                      <!-- 环检信息：大框 -->
                      <dl
                        v-if="items.stype==3"
                        style="background:rgb(28, 191, 212);color: #fff;border-radius:4px;margin-left:163px;cursor: pointer;"
                      >
                        <!-- 小三角形 -->
                        <dt
                          style="color:rgb(28, 191, 212)"
                          class="item-arrow"
                        ></dt>
                        <!-- 环检检测 -->
                        <div
                          style="background: rgb(28, 191, 212);border-radius: 10px;border-radius:4px;"
                          @click="open_gcjg(items,'hj')"
                        >
                          <dt>
                            <Icon
                              style="color:#fff ;padding-right: 6px;"
                              type="md-home"
                            />环检检测
                            <span style="padding-left:20px;">{{items.VDCT==1?'通过':'不通过'}}</span>
                          </dt>
                          <dt>
                            <span style="font-size:13px">检测类型：</span>
                            <span style="font-size:15px">{{returncodename(cddata.CD_InspectionWay,items.InspectionWay) }}</span>&nbsp;&nbsp;
                            <span style="font-size:13px">检测站点：</span>
                            <span style="font-size:15px">{{returncodename(cddata.StationInfo,items.StationCode)}}</span>
                          </dt>
                        </div>
                      </dl>

                      <!-- 报警信息 -->
                      <dl
                        v-else-if="items.stype==5"
                        style="background: rgba(64,142,238,1);color:rgb(17, 76, 165);border-radius:4px;margin-left:163px;cursor: pointer;"
                      >
                        <dt
                          style="color:rgba(64,142,238,1)"
                          class="item-arrow"
                        ></dt>
                        <div
                          style="background: rgba(64,142,238,1);color:rgb(17, 76, 165);border-radius: 10px;border-radius:4px;padding:2px"
                          @click="open_gcjg(items,'bj')"
                        >
                          <dt>
                            <Icon
                              style="color:rgb(17, 76, 165);"
                              type="ios-notifications"
                            />报警信息
                            <span style="font-size:14px;padding-left:20px;">{{items.times | dataFormat("yyyy-MM-dd hh:mm:ss")}}</span>
                          </dt>
                          <dt>
                            <span style="font-size:13px">检测站点：</span>
                            <span style="font-size:15px">{{returncodename(cddata.StationInfo,items.StationCode)}}</span>
                          </dt>
                          <dt>
                            <span style="font-size:13px">报警类型：</span>
                            <span
                              v-if="items.AlarmType!=null&&items.AlarmType"
                              style="font-size:14px;"
                            >
                              <Tooltip placement="right-start">{{returncodename(cddata.CD_AlarmType,items.AlarmType)}}</Tooltip>
                            </span>
                          </dt>
                        </div>
                      </dl>
                      <!-- 业务审核 -->
                      <dl
                        v-else-if="items.stype==4"
                        style="background:rgb(105, 131, 239);color: #fff;border-radius:4px;margin-left:163px;cursor: pointer;"
                        @click="open_gcjg(items,'sh')"
                      >
                        <dt
                          style="color:rgb(105, 131, 239)"
                          class="item-arrow"
                        ></dt>
                        <dt>
                          <Icon
                            style="color:#fff;padding-right: 6px;"
                            type="md-chatboxes"
                          />
                          {{returncodename(cddata.CD_CheckType,items.CheckType)}}
                          <span style="font-size:14px"></span>
                        </dt>
                        <dt>
                          <span style="font-size:13px">监测点位：</span>
                          <span style="font-size:14px">{{returncodename(cddata.StationInfo,items.OrgCode)}}</span>
                        </dt>
                      </dl>
                      <!-- 路检信息 -->
                      <dl
                        v-else-if="items.stype==6"
                        style="background: rgb(135, 206, 89);color: #fff;border-radius:4px;margin-left:163px;cursor: pointer;"
                        @click="open_gcjg(items,'lj')"
                      >
                        <dt
                          style="color: rgb(135, 206, 89)"
                          class="item-arrow"
                        ></dt>
                        <dt>
                          <Icon
                            style="color:#fff;padding-right: 6px;"
                            type="md-chatboxes"
                          />
                          路检信息
                          <span style="font-size:14px"></span>
                        </dt>
                        <dt>
                          <span style="font-size:13px">检测时间：</span>
                          <span style="font-size:14px">{{items.times|dataFormat('yyyy-MM-dd')}}</span>
                        </dt>
                        <dt>
                          <span style="font-size:13px">光吸收系数：</span>
                          <span style="font-size:14px">{{items.KEL}}</span>
                        </dt>
                        <dt>
                          <span style="font-size:13px">检测地段：</span>
                          <span style="font-size:14px">{{items.Address}}</span>
                        </dt>
                      </dl>
                      <!-- 黑烟车检测信息 -->
                      <dl
                        v-else-if="items.stype==7"
                        style="background: rgba(190,190,190,1);color:rgb(17, 76, 165);border-radius:4px;margin-left:163px;cursor: pointer;width:40%"
                      >
                        <dt
                          style="color:rgba(190,190,190,1)"
                          class="item-arrow"
                        ></dt>
                        <div
                          style="background: rgba(190,190,190,1);color:rgb(17, 76, 165);border-radius: 10px;border-radius:4px;padding:2px"
                          @click="open_gcjg(items,'hyc')"
                        >
                          <dt>
                            <Icon
                              style="color:#fff;padding-right: 6px;"
                              type="md-chatboxes"
                            />
                            黑烟车检测信息
                            <span style="font-size:14px"></span>
                          </dt>
                          <dt>
                            <span style="font-size:13px"> 监测点位：</span>
                            <span style="font-size:15px">{{returncodename(cddatas.CD_StationList,items.RSStationCode)}}</span>
                          </dt>
                          <dt>
                            <span style="font-size:13px">抓拍时间：</span>
                            <span style="font-size:15px">{{items.times|dataFormat('yyyy-MM-dd')}}</span>
                          </dt>
                        </div>
                      </dl>
                      <!--超限车检测信息 -->
                      <dl
                        v-else-if="items.stype==8"
                        style="background: rgba(255,155,229,1);color:rgb(17, 76, 165);border-radius:4px;margin-left:163px;cursor: pointer;"
                      >
                        <dt
                          style="color:rgba(255,155,229,1)"
                          class="item-arrow"
                        ></dt>
                        <div
                          style="background: rgba(255,155,229,1);color:rgb(17, 76, 165);border-radius: 10px;border-radius:4px;padding:2px"
                          @click="open_gcjg(items,'over')"
                        >
                          <dt>
                            <Icon
                              style="color:#fff;padding-right: 6px;"
                              type="md-chatboxes"
                            />
                            超限车检测信息
                            <span style="font-size:14px"></span>
                          </dt>
                          <dt>
                            <span style="font-size:13px"> 监测点位：</span>
                            <span style="font-size:15px">{{returncodename(cddatas.CD_StationList,items.RSStationCode) }}</span>
                          </dt>
                          <dt>
                            <span style="font-size:13px">抓拍时间：</span>
                            <span style="font-size:15px">{{items.times|dataFormat('yyyy-MM-dd')}}</span>
                          </dt>
                        </div>
                      </dl>
                      <!-- 遥测抓拍 -->
                      <!-- <dl v-else-if="items.stype==2" style="background: rgba(34,129,188,0.2);color: rgba(34,129,188,1);border-radius:4px;margin-left:163px;cursor: pointer;" >
                        <dt style="color:rgba(34,129,188,0.2)" class="item-arrow"></dt>
                        <dt>
                          <Icon style="color:rgba(34,129,188,1);padding-right: 6px;" type="md-car" />
                          {{items.states}}
                          <span style="font-size:14px"></span>
                        </dt>
                        <dt>
                          <span style="font-size:13px">监测点位：</span>
                          <span style="font-size:14px">{{items.station}}</span>
                        </dt>
                      </dl> -->
                      <!-- 黑烟车抓拍 -->
                      <!-- <div v-if="items.stype==1" style="background:rgba(34,129,188,0.2);color: rgba(34,129,188,1);border-radius:4px;margin-left:163px;cursor: pointer;" @click="open_gcjg(items,'hyc')" >
                        <dt style="color:rgba(34,129,188,0.2)" class="item-arrow"></dt>
                        <dt>
                          <Icon style="color:rgba(34,129,188,1);padding-right: 6px;" type="md-camera" />
                          {{items.states}}
                          <span style="font-size:14px"></span>
                        </dt>
                        <dt>
                          <span style="font-size:13px">抓拍点位：</span>
                          <span style="font-size:14px">{{items.station}}</span>&nbsp;&nbsp;
                          <span style="font-size:13px">
                            林格曼等级：
                            <span style="font-size:15px">{{items.jctype}}</span>级
                          </span>
                        </dt>
                      </dl> -->
                    </li>
                  </ul>
                </div>
              </i-col>
              <i-col
                :xs="0"
                :sm="0"
                :md="0"
                :lg="0"
                :xl="0"
                :xxl="8"
              >
                <div
                  :style="style_title"
                  style="padding:45px 0 45px 25px; right: 10%;top: 9%;z-index: 1;overflow:hidden auto;"
                >
                  <div
                    class="vlpn-bs-type"
                    style="background-color:rgb(247, 181, 59);border-radius:4px"
                    @click="datafilter(alldata)"
                    v-show="alldata.length!=0"
                  >
                    <span
                      class="item-types"
                      data-bind="text: count"
                      style="color:#fff;"
                    >{{alldata.length?alldata.length:''}}</span>
                    <img
                      style="height: 20px; width: 20px; display: none;"
                      src
                    />
                    <span style="font-size: 16px; margin-left: 3px; color: #fff;">全部</span>
                  </div>
                  <div
                    class="vlpn-bs-type"
                    style="background-color: rgb(28, 191, 212);border-radius:4px"
                    @click="datafilter(hjdata)"
                    v-show="hjdata.length!=0"
                  >
                    <span
                      class="item-types"
                      data-bind="text: count"
                      style="color:#fff"
                    >{{hjdata.length?hjdata.length:''}}</span>
                    <Icon
                      style="color:#fff;font-size: 20px;"
                      type="md-home"
                    />
                    <span style="font-size: 16px; margin-left: 3px; color: #fff;">环检信息</span>
                  </div>
                  <div
                    class="vlpn-bs-type"
                    style="background-color: rgb(105, 131, 239);border-radius:4px"
                    @click="datafilter(shdata)"
                    v-show="shdata.length!=0"
                  >
                    <span
                      class="item-types"
                      style="color:#fff"
                      data-bind="text: count"
                    >{{shdata.length?shdata.length:''}}</span>
                    <Icon
                      style="color:#fff;font-size: 20px;"
                      type="md-chatboxes"
                    />
                    <span style="font-size: 16px; margin-left: 3px; color: #fff;">业务审核</span>
                  </div>
                  <div
                    class="vlpn-bs-type"
                    style="background-color: rgb(135, 206, 89);border-radius:4px"
                    @click="datafilter(ljdata)"
                    v-show="ljdata.length!=0"
                  >
                    <span
                      class="item-types"
                      style="color:#fff"
                      data-bind="text: count"
                    >{{ljdata.length?ljdata.length:''}}</span>
                    <Icon
                      style="color:#fff;font-size: 20px;"
                      type="md-chatboxes"
                    />
                    <span style="font-size: 16px; margin-left: 3px; color: #fff;">路检信息</span>
                  </div>
                  <div
                    class="vlpn-bs-type"
                    style="background: rgba(64,142,238,1);;border-radius:4px"
                    @click="datafilter(bjdata)"
                    v-show="bjdata.length!=0"
                  >
                    <span
                      class="item-types"
                      style="color:#fff"
                      data-bind="text: count"
                    >{{bjdata.length?bjdata.length:''}}</span>
                    <Icon
                      style="color:#fff;font-size: 20px;"
                      type="md-chatboxes"
                    />
                    <span style="font-size: 16px; margin-left: 3px; color: #fff;">报警信息</span>
                  </div>
                  <div
                    class="vlpn-bs-type"
                    style="background: rgba(190,190,190,1);border-radius:4px"
                    @click="datafilter(hycdata)"
                    v-show="hycdata.length!=0"
                  >
                    <span
                      class="item-types"
                      style="color:#fff"
                      data-bind="text: count"
                    >{{hycdata.length?hycdata.length:''}}</span>
                    <Icon
                      style="color:#fff;font-size: 20px;"
                      type="md-chatboxes"
                    />
                    <span style="font-size: 16px; margin-left: 3px; color: #fff;">黑烟车检测信息</span>
                  </div>
                  <div
                    class="vlpn-bs-type"
                    style="background: rgba(255,155,229,1);;border-radius:4px"
                    @click="datafilter(overdata)"
                    v-show="overdata.length!=0"
                  >
                    <span
                      class="item-types"
                      style="color:#fff"
                      data-bind="text: count"
                    >{{overdata.length?overdata.length:''}}</span>
                    <Icon
                      style="color:#fff;font-size: 20px;"
                      type="md-chatboxes"
                    />
                    <span style="font-size: 16px; margin-left: 3px; color: #fff;">超限车检测信息</span>
                  </div>
                  <!-- <div
                    class="vlpn-bs-type"
                    style="background-color: rgba(34,129,188,0.2);border-radius:4px"
                    @click="datafilter(fintdata)"
                    v-show="fintdata.length!=0"
                  >
                    <span
                      class="item-types"
                      style="color:rgba(34,129,188,1)"
                      data-bind="text: count"
                    >{{fintdata.length?fintdata.length:''}}</span>
                    <Icon style="color:rgba(34,129,188,1);font-size: 20px;" type="md-car" />
                    <span style="font-size: 16px; margin-left: 3px; color: rgba(34,129,188,1);">遥测抓拍</span>
                  </div>
                  <div
                    class="vlpn-bs-type"
                    style="background-color: rgba(34,129,188,0.2);border-radius:4px"
                    @click="datafilter(lastdata)"
                    v-show="lastdata.length!=0"
                  >
                    <span
                      class="item-types"
                      data-bind="text: count"
                      style="color:rgba(34,129,188,1)"
                    >{{lastdata.length?lastdata.length:''}}</span>
                    <Icon style="color:rgba(34,129,188,1);font-size: 20px;" type="md-camera" />
                    <span style="font-size: 16px; margin-left: 3px; color: rgba(34,129,188,1);">黑烟车抓拍</span>
                  </div> -->
                </div>
              </i-col>
            </Row>
          </div>
          <!-- <Modal v-model="smoke_model" width="1200">
            <p slot="header" style="color:#f60;text-align:center">
              <span>黑烟车详细信息</span>
            </p>
            <smokeModel :vlpn="vlpns" ref="smokeModel"></smokeModel>
            <div slot="footer"></div>
          </Modal> -->
          <Modal
            v-model="exhaust_model"
            width="1200"
          >
            <p
              slot="header"
              style="color:#f60;text-align:center"
            >
              <span>环检详细信息</span>
            </p>
            <exhaustModel :InspectionNum="InspectionNum"></exhaustModel>
            <div slot="footer">
              <Button
                type="success"
                size="large"
                @click="exhaust_model=false"
              >关闭</Button>
              <Button
                type="info"
                size="large"
                @click="openes"
              >更多信息</Button>
            </div>
          </Modal>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>
<script>
import renderMessege from "../../../HJ/components/message";
import smokeModel from "./listInfo/smokeList";
import exhaustModel from "./listInfo/exhaustList";
import { getCDData } from "../../../HJ/utils/utils";
export default {
  name: "vehicleTrack",
  data() {
    return {
      isShow: false,
      height: 112,
      smoke_model: false,
      exhaust_model: false,
      InspectionNum: "",
      vlpns: "",
      spinShow: true,
      itemList: [],
      activeClass: 0,
      alldata: [],
      fastdata: [],
      lastdata: [],
      fintdata: [],
      bjdata: [],
      hycdata: [],
      shdata: [],
      ljdata: [],
      hjdata: [],
      overdata: [],
      cddatas: [],
    };
  },
  props: {
    Vecid: {
      type: Number //测试车辆‘MAG1100’
    },
    vehicleData: {
      type: Object
    },
    cddata: {
      type: Object,
      default: () => { }
    },
    selectVIN: {
      type: String,
    }, style_div: {
      //div层样式
      type: Object
    },
    style_title: {
      type: Object
    },
    tabkey: {
      type: String,
    }
  },
  components: {
    smokeModel,
    exhaustModel
  },
  watch: {
    // Vecid(curVal, oldVal) {
    //   if (curVal && curVal !== oldVal) {
    //     this.handleInspectionData();
    //   }
    // },
    tabkey(newval, oldval) {
      if (newval && newval == 'summanyTab') this.handleInspectionData();
    }
    //     vehicleData(newVal){
    //       if(Object.values(newVal).length){
    // console.log(newVal)
    //       //  this.handleInspectionData();
    //       }
    //     }
  },
  methods: {
    async getCDData() {
      const self = this;
      if (self.$getDBTable) {
        await self.$getDBTable(['CD_StationList']).then((res) => {
          if (res.indexOf(undefined) == -1) {
            let data = [];
            res.forEach((item, index) => {
              data = JSON.parse(item);
              if (data.length > 0 && data[0]) {
                if (data[0].hasOwnProperty("IsAvailable"))
                  data = data.filter((d) => d.IsAvailable == 1);
              }
              self.cddatas.CD_StationList = data;
            });
          } else {
            getCDData(this, [{
              tableName: "CD_StationList",
              columns: "CodeValue,CodeName",
            },
            ]).then((res) => {
              const self = this;
              if (res.state) {
                res.data.forEach((item, index) => {
                  if (item.length > 0 && item[0]) {
                    if (item[0].hasOwnProperty("IsAvailable"))
                      item = item.filter((i) => i.IsAvailable == 1);
                  }
                  self.cddatas.CD_StationList = item;
                });
              }
            });
          }
        });
      }
    },
    selectYear: function (event, index) { },
    getItem: function (index) {
      this.activeClass = index;
    },
    //过滤数据
    returncodename(namelist, codevalue) {
      if (namelist) {
        let CodeName = "";
        namelist.forEach(item => {
          if (item.CodeValue == codevalue) CodeName = item.CodeName;
        });
        return CodeName;
      }
    },
    openes() {
      this.exhaust_model = false;
      this.$router.push({
        name: "hj-home-supervise-search",
        params: { cardata: this.vlpns }
      });
    },
    open_gcjg(e, type) {
      let index = e.vlpn;
      this.vlpns = e.vlpn;
      this.InspectionNum = e.InspectionNum;
      if (type == "sh") {
        this.$router.push({
          name: "hj-audit-search",
          params: { searchValue: index }
        });
      } else if (type == "bj") {
        this.$router.push({
          name: "hj-alarm-search",
          params: { searchValue: index }
        });
      }
      else if (type == "hyc") {
        this.$router.push({
          name: "hj-remoteAndBlackSmokeCar",
          params: { tabName: 'hycTab' }        });
      }
      else if (type == "hj") {
        this.exhaust_model = true;
      }
      else if (type == "lj") {
        this.$router.push({
          name: "hj-remoteAndBlackSmokeCar",
          params: { tabName: 'ljTab' }        });
      } else if (type == "over") {
        this.$router.push({
          name: "hj-remoteAndBlackSmokeCar",
          params: { tabName: 'ycTab' }        });
      }
      else {
        this.$router.push({
          name: "hj-home-upervise",
          params: { searchValue: index }
        });
      }
    },
    handleInspectionData() {
      const _this = this;
      _this.fastdata = [];
      _this.alldata = [];
      _this.isShow = false;
      this.$curl
        .get("api/hj/getVehicleTrack", {          vehicleID: this.Vecid, VIN: this.vehicleData.selectVIN,
          VLPN: this.vehicleData.VLPN, VLPNColor: this.vehicleData.VLPNColor        })
        .then(res => {
          // _this.lastdata = res.hyc;
          // _this.fintdata = res.yg;
          _this.hjdata = res.hj;
          _this.shdata = res.sh;
          _this.ljdata = res.lj;
          _this.bjdata = res.bj;
          _this.hycdata = res.hyc;
          _this.overdata = res.over;
          if (res.hj[0] || res.sh[0] || res.lj[0] || res.bj[0] || res.hyc[0] || res.over[0]) {
            this.isShow = true;
          }
          // res.hj.forEach(h => {
          //   let hjbj = [];
          //   hjbj.push(h);
          //   if (res.bj.length > 0) {
          //     let bj = [];
          //     res.bj.forEach(b => {
          //       if (h.InspectionNum == b.InspectionNum) {
          //         bj.push(b);
          //       }
          //     });
          //     if (bj[0]) _this.$set(bj[0], 'bjle', bj.length)
          //     hjbj = [...hjbj, ...bj];
          //   }
          //   let height = 0;
          //   if (hjbj.length == 1) {
          //     height = 180;
          //   } else {
          //     height = 117 * hjbj.length;
          //   }
          //   _this.fastdata.push({
          //     stype: h.stype,
          //     years: h.years,
          //     times: h.times,
          //     data: hjbj,
          //     height: height
          //   });
          // });
          _this.alldata = _this.fastdata.concat(res.sh, res.lj, res.bj, res.hj, res.hyc, res.over);
          _this.datafilter(_this.alldata);
        })
        .catch(err => {
          console.log(err)
        });
    },
    datafilter(data) {
      this.itemList = [];
      data.sort((a, b) => new Date(b.times) - new Date(a.times));
      let yeardata = data.map(e => {
        return e.years;
      });
      yeardata = Array.from(new Set(yeardata));
      yeardata = yeardata.sort(function (a, b) {
        if (!a) return -1;
        if (a < b) {
          return 1;
        }
        if (a > b) {
          return -1;
        }
        return 0;
      });
      let isFast = true;
      yeardata.forEach((e, index) => {
        if (e) {
          let datas = data.filter(s => {
            return s.years == e;
          });
          datas.forEach(d => {
            if (d.stype != 3) {
              d.height = 148;
            }
          });
          this.itemList.push({ title: e, show: isFast, list: datas });
          isFast = false;
        }
      });
    }
  },
  mounted() {
    this.getCDData();
    // console.log(this.vehicleData)
    // this.handleInspectionData();
  }
};
</script>
<style lang="less" scoped>
//折叠面板
.ivu-collapse {
  /deep/ .ivu-collapse-header {
    text-align: left;
    font-size: 16px;
    font-weight: bold;
  }
}
.time-line {
  ::-webkit-scrollbar {
    width: 6px;
    background-color: #fff;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #fff; //滚动条颜色
  }
  .box ::-webkit-scrollbar {
    width: 0px;
  }
  margin: 18px auto 0 auto;
  top: 9px;
  bottom: 4px;
  position: absolute;
  left: 1%;
  right: 0px;
  overflow: auto;
  display: block;
}
.event_list ul {
  // width: 850px;
  // float: right;
  background: url("/exhaust/img/line04.gif") 139px 0 repeat-y;
  margin: 0px 0 20px 0;
  overflow: hidden auto;
  position: relative;
}
.event_list {
  // display: flex;
  // justify-content:center;

  .noRecord {
    font-size: 14px;
    font-weight: bold;
  }
}
.event_list h2 {
  color: #00bbff;
  font-size: 25px;
  font-family: 微软雅黑;
  text-align: left;
  font-weight: normal;
  padding-left: 0px;
  margin-bottom: 30px;
  margin-top: 0px !important;
}

.event_list ul li h3 {
  margin-top: 40px;
  float: left;
  width: 130px;
  text-align: right;
  padding-right: 19px;
  color: #c3c3c3;
  font: normal 18px/16px Arial;
}
.event_list ul li {
  background: url("/exhaust/img/icon07.gif") no-repeat 132px 41px;
  zoom: 1;
  list-style: none;
}
.event_list ul li dl dt {
  text-align: left;
  font-size: 16px;
  font-weight: normal;
  max-width: 500px;
}
.item-arrow {
  float: left;
  display: inline-block;
  height: 10px;
  width: 25px;
  border: 10px solid transparent;
  border-right: 13px solid;
  margin-left: -35px;
  color: #7ed2fd;
  margin-top: 15px;
}
.event_list ul li dl {
  float: left;
  margin-left: 42px;
  font-family: 微软雅黑;
  font-size: 18px;
  padding: 5px 10px;
}
.history-arrow {
  margin-left: 130px;
  border: 10px solid transparent;
  border-bottom: 15px solid #81cc7d;
  width: 10px;
  margin-top: -11px;
}
dl {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
li {
  display: list-item;
  text-align: -webkit-match-parent;
}
.vlpn-bs-type {
  width: 180px;
  height: 40px;
  display: flex;
  position: relative;
  margin: 5px;
  align-items: center;
  cursor: pointer;
}
.item-types {
  font-size: 22px;
  margin-left: 10px;
  margin-right: 10px;
  color: white;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
  /* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
.stationedit_img_title {
  display: block;
  margin-left: 18px;
  position: absolute;
  text-align: center;
  bottom: 39px;
  left: 0;
  color: #fff;
  width: 93%;
  z-index: 10;
  height: 36px;
  line-height: 36px;
  background: #000;
  filter: alpha(opacity=60);
  -moz-opacity: 0.5;
  opacity: 0.5;
}
</style>


