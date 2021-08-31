<template>
  <div style="height: 100%" ref="rightBlock">
    <i-Col span="24" style="height: 100%" id="report">
      <Tabs style="height: 100%" @on-click="changeTabs">
        <TabPane
          label="检测报告"
          icon="ios-chatboxes-outline"
          name="InspectionReport"
          v-if="checkSelTab.indexOf('InspectionReport') != '-1'"
          :index="1"
        >
          <div
            :style="{ height: rightBlockHeight - 101 + 'px' }"
            style="overflow: auto; padding-bottom: 3px"
          >
            <div ref="printing" class="fx__bgcolor" style="height: 100%; overflow: auto">
              <printContent :giveReport="giveReport" ref="reportCont" />
            </div>
          </div>
          <!-- 预览打印报告模块 -->
          <div
            v-if="showPrintBtn"
            style=" width: 100%;padding-right: 20px;background-color: rgba(81, 90, 110, 0.3);height: 50px;"
          >
            <Divider style="margin: 0px 0 7px 0" />
            <Button @click="printStart" style="margin: 0 0 0 10px">打印预览检测报告</Button>
            <Button
              v-if="isShowFuelEvaporationInfo"
              @click="ShowFuelEvaporation"
              style="margin: 0 0 0 10px"
            >燃油蒸发检测</Button>
          </div>
          <div v-else style="padding: 16px 0 0 11px;font-size:15px;"><span>{{judgePrintStr}}</span></div>
        </TabPane>
        <TabPane
          label="尾气检测过程数据"
          icon="ios-stats"
          name="InspectionProcess"
          v-if="checkSelTab.indexOf('InspectionProcess') != '-1'"
          style="padding-top: 7px;position:relative"
          :index="2"
        >
          <processInfo
            ref="processInfoNode"
            :InspectionInfo="inspectionInfo"
            :IUTYPE="currenDate.IUTYPE"
          ></processInfo>
          <div v-if="processArr.length > 0">
            <processData
              :rightBlockHeight="rightBlockHeight"
              :VLPN="currenDate.VLPN"
              :InspectionNum="currenDate.InspectionNum"
              :IUTYPE="currenDate.IUTYPE"
              :InspectProcessForm="processArr"
              :initForm="initForm"
              :processResultHeight="processResultHeight"
            ></processData>
          </div>
          <div v-else-if="processArr.length == 0 && processInfoLoading">
            <Spin v-show="processInfoLoading" fix>
              <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
          <div v-else style="text-align:center">暂无相关检测过程数据</div>
        </TabPane>
        <TabPane
          label="OBD过程数据"
          icon="ios-stats"
          name="obdInspectionProcess"
          v-if="checkSelTab.indexOf('obdInspectionProcess') != '-1'"
          style="padding-top: 7px;position:relative"
          :index="3"
        >
          <div v-if="processArr.length > 0">
            <obdProcessData
              :rightBlockHeight="rightBlockHeight"
              :VLPN="currenDate.VLPN"
              :InspectionNum="currenDate.InspectionNum"
              :IUTYPE="currenDate.IUTYPE"
              :InspectProcessForm="processArr"
            ></obdProcessData>
          </div>
          <div v-else-if="processArr.length == 0 && obdProcessInfoLoading">
            <Spin v-show="obdProcessInfoLoading" fix>
              <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
          <div v-else style="text-align:center">暂无相关检测过程数据</div>
        </TabPane>
        <TabPane
          label="检测照片"
          icon="ios-images"
          name="InspectionImage"
          v-if="checkSelTab.indexOf('InspectionImage') != '-1'"
          style="padding-top: 7px"
          :index="4"
        >
          <div style="margin: 20px 0 0 0; overflow: auto" :style="{ height: height - 18 + 'px' }">
            <div v-if="ImgArr.length > 0">
              <viewer :images="ImgArr" style="display: flex; flex-wrap: wrap">
                <div v-for="(item, index) in ImgArr" :key="index" class="img_div">
                  <img :src="ImageUrl + item.FullFileName" @error="onError($event)" />
                  <p
                    style="
                                            text-align: center;
                                            margin-top: 5px;
                                        "
                  >{{ item.DisplayName }}</p>
                </div>
              </viewer>
            </div>
            <div v-else style="text-align: center">暂无检测照片</div>
          </div>
        </TabPane>
        <TabPane
          label="检测录像"
          icon="ios-videocam"
          name="InspectionVideo"
          v-if="checkSelTab.indexOf('InspectionVideo') != '-1'"
          style="padding-top: 7px"
          :index="5"
        >
          <div :style="{ height: height + 'px' }" style="text-align: center">
            <p style="margin-bottom: 4px">
              <span style="font-size: 14px">是否调取硬盘录像机：</span>
              <i-switch v-model="videoFormDigital">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </p>
            <Row v-show="videoArr.length != 0 && !videoFormDigital" style="height: 92%">
              <div v-show="!videoFormDigital" style="height: 100%">
                <i-col :xxl="20" :xl="20" :lg="24" :md="24" :sm="24">
                  <div style="margin-left: 10px">
                    <video
                      ishivideo="true"
                      width="100%"
                      height="428"
                      autoplay="true"
                      controls="true"
                      autohide="false"
                      loop="loop"
                      hivideoid="hivideo"
                      :src="VideoUrl + vUrl"
                    ></video>
                    <!-- <video
                                            ishivideo="true"
                                            width="100%"
                                            height="428"
                                            autoplay="true"
                                            controls="true"
                                            autohide="false"
                                            loop="loop"
                                            hivideoid="hivideo"
                                            :src="
                                                $hjconfig.isVideoCenterEnd
                                                    ? VideoUrl + vUrl
                                                    : VideoUrl +
                                                      vUrl
                                                          .toString()
                                                          .replace(
                                                              proxyPath,
                                                              ''
                                                          )
                                            "
                    ></video>-->
                  </div>
                </i-col>
                <i-col :xxl="3" :xl="3" :lg="24" :md="24" :sm="24">
                  <div class="videoInfo">
                    <Button
                      :type="currentNum == index ? 'primary' : 'default'"
                      v-for="(item, index) in videoArr"
                      :key="index"
                      @click="changeVideoPlay(item.FullFileName, index)"
                    >{{ item.DisplayName }}</Button>
                  </div>
                </i-col>
              </div>
            </Row>
            <Row v-show="videoFormDigital" style="height: 92%">
              <!-- 读取硬盘录像机 1海康威视 2大华 -->
              <div style="height: 100%;width:100%;" v-if="videoType == 2">
                <DHVideoMonitor
                  ref="videoBox"
                  class="videoBox"
                  :InspectionNum="currenDate.InspectionNum"
                  :SceneCode="currenDate.SceneCode"
                  :StationCode="currenDate.StationCode"
                  :InspectTimes="inspectTimes"
                  :IsFinishCheck="1"
                ></DHVideoMonitor>
              </div>
              <div style="height: 100%;width:100%" v-else>
                <video-monitor
                  ref="videoBox"
                  class="videoBox"
                  :InspectionNum="currenDate.InspectionNum"
                  :SceneCode="currenDate.SceneCode"
                  :StationCode="currenDate.StationCode"
                  :InspectTimes="inspectTimes"
                  :IsFinishCheck="1"
                ></video-monitor>
              </div>
            </Row>
            <p v-if="videoArr.length == 0" style="text-align: center">暂无相关视频</p>
          </div>
        </TabPane>
        <TabPane
          label="外观检测信息"
          icon="ios-at"
          name="AppearanceInfo"
          v-if="checkSelTab.indexOf('AppearanceInfo') != '-1'"
          style="padding-top: 7px"
          :index="6"
        >
          <div :style="{ height: height + 'px' }" style="overflow: auto">
            <div v-if="JSON.stringify(resData) != '{}'" style="padding-top: 10px">
              <Divider orientation="left">外观基本检测信息</Divider>
              <Form label-position="right" :label-width="300">
                <Row>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="车辆机械状况是否良好" label="车辆机械状况是否良好:">
                      <p>{{ resData.VehicleMechanicalCondition }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="曲轴箱通风系统是否正常" label="曲轴箱通风系统是否正常:">
                      <p>{{ resData.CrankcaseVentSystem }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="有无可能影响安全或引起测试偏差的机械故障" label="有无可能影响安全或引起测试偏差的机械故障:">
                      <p>{{ resData.MechanicalFault }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="是否带OBD系统" label="是否带OBD系统:">
                      <p>{{ resData.IsHaveOBD }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="是否关闭车上空调、暖风等附属设备" label="是否关闭车上空调、暖风等附属设备:">
                      <p>{{ resData.CloseAirAirHeater }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem label="是否适合工况法检测:" style>
                      <p>{{ resData.IsSuitGKInspect }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="车辆是否存在烧机油或者严重冒黑烟现象" label="车辆是否存在烧机油或者严重冒黑烟现象:">
                      <p>{{ resData.BurningOilAndSmoke }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="车上仪表工作是否正常" label="车上仪表工作是否正常:">
                      <p>{{ resData.VehicleMeter }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
                    <FormItem title="车辆的发动机、变速箱和冷却系统等有无明显的液体渗漏" label="车辆的发动机、变速箱和冷却系统等有无明显的液体渗漏:">
                      <p>{{ resData.LiquidLeakage }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="轮胎是否干燥、清洁" label="轮胎是否干燥、清洁:">
                      <p>{{ resData.IsTireClear }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="车辆油箱和油品是否异常" label="车辆油箱和油品是否异常:">
                      <p>{{ resData.VehicleFuelTank }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="排气污染控制装置是否齐全，正常" label="排气污染控制装置是否齐全，正常:">
                      <p>{{ resData.ExhaustPollutionDevice }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="燃油蒸发控制系统是否正常" label="燃油蒸发控制系统是否正常:">
                      <p>{{ resData.EVAP }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="车辆进、排气系统是否有任何泄露" label="车辆进、排气系统是否有任何泄露:">
                      <p>{{ resData.InOrOutputSystemLeaking }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="轮胎气压是否正常" label="轮胎气压是否正常:">
                      <p>{{ resData.TirePressure }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem title="是否已经中断车辆上可能影响测试正常进行的功能" label="是否已经中断车辆上可能影响测试正常进行的功能:">
                      <p>{{ resData.InterruptInfluenceFunction }}</p>
                    </FormItem>
                  </i-col>
                  <i-col
                    v-show="resData.ExhaustEmissionDevice"
                    :xxl="8"
                    :xl="12"
                    :lg="12"
                    :md="12"
                    :sm="24"
                    :xs="24"
                  >
                    <FormItem title="排气管" label="排气管：">
                      <p>{{ resData.ExhaustEmissionDevice }}</p>
                    </FormItem>
                  </i-col>
                  <i-col
                    v-show="resData.ExhaustEmissionDevice === '异常'"
                    :xxl="8"
                    :xl="12"
                    :lg="12"
                    :md="12"
                    :sm="24"
                    :xs="24"
                  >
                    <FormItem title="排气管异常" label="排气管异常：">
                      <p>{{ resData.ExhaustEmissionDevicePL }}</p>
                    </FormItem>
                  </i-col>
                  <i-col
                    v-show="resData.DualExhaustSystemAndLeaking"
                    :xxl="8"
                    :xl="12"
                    :lg="12"
                    :md="12"
                    :sm="24"
                    :xs="24"
                  >
                    <FormItem title="多排气系统/装饰管" label="多排气系统/装饰管：">
                      <p>{{ resData.DualExhaustSystemAndLeaking }}</p>
                    </FormItem>
                  </i-col>
                  <i-col
                    v-show="resData.DualExhaustSystemAndLeaking === '是'"
                    :xxl="8"
                    :xl="12"
                    :lg="12"
                    :md="12"
                    :sm="24"
                    :xs="24"
                  >
                    <FormItem title="拥有多排气系统/装饰管类型" label="拥有多排气系统/装饰管类型：">
                      <p>{{ resData.VentPipe }}</p>
                    </FormItem>
                  </i-col>
                  <i-col
                    v-show="resData.IsFourWheeler"
                    :xxl="8"
                    :xl="12"
                    :lg="12"
                    :md="12"
                    :sm="24"
                    :xs="24"
                  >
                    <FormItem title="是否为四驱车" label="是否为四驱车：">
                      <p>{{ resData.IsFourWheeler }}</p>
                    </FormItem>
                  </i-col>
                  <i-col
                    v-show="resData.IsHaveExtensionPipe"
                    :xxl="8"
                    :xl="12"
                    :lg="12"
                    :md="12"
                    :sm="24"
                    :xs="24"
                  >
                    <FormItem title="是否有延长管" label="是否有延长管：">
                      <p>{{ resData.IsHaveExtensionPipe }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                    <FormItem label="备注:">{{ resData.Remarks }}</FormItem>
                  </i-col>
                </Row>
                <Divider dashed style="margin: 10px 0" />
                <Row>
                  <i-col :xxl="8" :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
                    <FormItem
                      label="外检结果:"
                      :label-width="300"
                      :style="{
                        color:
                          resData.AppearanceResult == 1 ? '#009bff' : '#f00',
                      }"
                    >
                      <p>
                        {{
                        resData.AppearanceResult == 0 ||
                        resData.AppearanceResult == 1
                        ? resData.AppearanceResult == 0
                        ? "不通过"
                        : "通过"
                        : ""
                        }}
                      </p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
                    <FormItem label="检验员:" :label-width="300">
                      <p>{{ resData.CheckPerson }}</p>
                    </FormItem>
                  </i-col>
                  <i-col :xxl="8" :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
                    <FormItem label="外检时间:" :label-width="200">
                      <p>
                        {{
                        resData.AppearanceDate
                        | dataFormat("yyyy-MM-dd hh:mm:ss")
                        }}
                      </p>
                    </FormItem>
                  </i-col>
                </Row>
              </Form>
            </div>
            <div v-else style="text-align: center">暂无外观基本检测数据</div>
            <!-- 图片信息 -->
            <div style="margin: 20px 0 0 0">
              <div v-if="ImgData.length > 0" style="padding-top: 1px" class="fx__bgcolor">
                <Divider orientation="left">外观图片</Divider>
                <viewer :images="ImgData" style="display: flex; flex-wrap: wrap">
                  <div v-for="(item, index) in ImgData" :key="index" class="img_div">
                    <img
                      :src="$hjconfig.externalImgIP.LLAN + item.FullFileName"
                      @error="onError($event)"
                    />
                    <p
                      style="
                                                text-align: center;
                                                margin-top: 5px;
                                            "
                    >{{ item.DisplayName }}</p>
                  </div>
                </viewer>
              </div>
              <div v-else style="text-align: center">暂无外观检测图片</div>
            </div>
          </div>
        </TabPane>
        <TabPane
          label="黑烟车抓拍"
          icon="ios-at"
          name="BlackSmokeCarVideo"
          v-if="checkSelTab.indexOf('BlackSmokeCarVideo') != '-1'"
          style="padding-top: 7px"
          :index="7"
        >
          <div>
            <blackSmokeCar1
              v-if="list.length != 0"
              :list="list"
              :imgList="imgList"
              :number="number"
            />
            <div v-else style="text-align: center">暂无黑烟车抓拍</div>
          </div>
        </TabPane>
        <TabPane
          label="黑匣子过程数据"
          icon="ios-barcode"
          name="blackBoxProcessTab"
          v-if="checkSelTab.indexOf('blackBoxProcessTab') != '-1'"
          style="padding-top: 7px"
          :index="8"
        >
          <div v-if="processArr.length > 0" :style="{ height: height + 10 + 'px' }">
            <blackBoxProcessData
              :VLPN="currenDate.VLPN"
              :InspectionNum="currenDate.InspectionNum"
              :IUTYPE="currenDate.IUTYPE"
              :InspectProcessForm="processArr"
              :wjDBObj="bbpArr"
              :hxzDBArr="hxzDBArr"
            />
          </div>
          <div v-else style="text-align: center">暂无黑匣子过程数据</div>
        </TabPane>
        <TabPane
          label="预警信息"
          icon="ios-notifications"
          name="warningInfo"
          v-if="checkSelTab.indexOf('warningInfo') != '-1'"
          style="padding-top: 7px"
          :index="9"
        >
          <div v-if="dataTable.length" :style="{ height: height + 10 + 'px', padding: '10px' }">
            <Table
              border
              :loading="loading"
              :columns="colList"
              :data="dataTable"
              :height="height - 30"
              highlight-row
            ></Table>
            <Page
              style="padding: 10px"
              :total="total"
              :current="pageIndex"
              show-sizer
              :page-size="pageSize"
              show-total
              @on-change="changePage"
              @on-page-size-change="getPageSize"
            />
          </div>
          <div v-else style="text-align: center">暂无预警数据</div>
        </TabPane>
        <TabPane
          label="资料查看"
          icon="ios-notifications"
          name="lookInfo"
          v-if="checkSelTab.indexOf('lookInfo') != '-1'"
          style="padding-top: 7px"
          :index="10"
        >
          <dataView
            :Vecid="currenDate.VehicleID"
            :cddata="cddata"
            v-bind:style="{ height: height + 'px' }"
            ref="dataView"
          ></dataView>
        </TabPane>
        <TabPane
          label="结果对比"
          icon="ios-notifications"
          name="resultInfo"
          v-if="checkSelTab.indexOf('resultInfo') != '-1'"
          style="padding-top: 7px"
          :index="11"
        >
          <resultDB :InspectionNum="currenDate.InspectionNum" :IUTYPE="currenDate.IUTYPE"></resultDB>
        </TabPane>
      </Tabs>
    </i-Col>
    <!-- 燃油蒸发报告模块 -->
    <div>
      <Modal v-model="modal2" width="990">
        <div style="text-align:center">
          <fuelEvaporationData
            :VehicleInfo="VehicleInfo"
            :FuelEvaporationData="FuelEvaporationInfo"
            :cddata="cddata"
          ></fuelEvaporationData>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { getCDData } from "./../../../utils/utils";
export default {
  props: {
    currenDate: { type: Object }, // 当前选中行的数据
    initForm: { type: Object },
    number: { type: Object },
    height: { type: Number },
    checkSelTab: { type: Array, default: () => [] }
  },
  components: {
    fuelEvaporationData: () => import("./fuelEvaporationData"),
    printContent: () => import("./printContent"),
    processInfo: () => import("./processInfo.vue"),
    processData: () => import("./processData.vue"),
    obdProcessData: () => import("./obdProcessData.vue"),
    blackSmokeCar1: () => import("./blackSmokeCar1"),
    blackBoxProcessData: () => import("./blackBoxProcessData.vue"),
    dataView: () => import("./dataView"),
    resultDB: () => import("./resultInfo.vue"),
    videoMonitor: () => import("./VideoMonitor.vue"),
    DHVideoMonitor: () => import("./DHVideoMonitor.vue")
  },
  data() {
    return {
      judgePrintStr: "", //影响打印原因
      showPrintBtn: true,
      modal2: false,
      isShowFuelEvaporationInfo: false,
      processInfoLoading: false,
      obdProcessInfoLoading: false,
      VehicleInfo: {},
      FuelEvaporationInfo: {},
      tabsName: "",
      bbpArr: {},
      hxzDBArr: [],
      proxyPath: "",
      ImageUrl: "", //前缀用‘/’或者配置
      VideoUrl: "", //前缀用‘/’或者配置
      videoFormDigital: false, //是否播放硬盘录像机视频
      inspectTimes: {
        startTime: "",
        endTime: ""
      }, //检测时间
      IsFinishCheck: 1, //是否检测结束
      vUrl: "", //正在播放视频的URL
      videoArr: [],
      ImgArr: [],
      processArr: [],
      resData: {},
      ImgData: [],
      currentNum: null,
      giveReport: {},
      list: [],
      imgList: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      loading: false,
      dataTable: [],
      colList: [
        {
          title: "受理编号",
          align: "center",
          minWidth: 120,
          key: "InspectionNum"
        },
        {
          title: "报警类型",
          align: "center",
          minWidth: 100,
          key: "AlarmType",
          render: (h, params) => {
            let result = "";
            this.alarmType.forEach(item => {
              if (item.CodeValue == params.row.AlarmType)
                result = item.CodeName;
            });
            return h("span", {}, result);
          }
        },
        {
          title: "报警内容",
          align: "left",
          minWidth: 300,
          key: "AlarmRecord"
        },
        {
          title: "报警时间",
          align: "center",
          minWidth: 120,
          key: "AlarmTime",
          render: (h, params) => {
            const Name = this.$options.filters.dataFormat(
              params.row.AlarmTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, Name);
          }
        },
        {
          title: "处理状态",
          align: "center",
          minWidth: 90,
          key: "AlarmDeal",
          render: (h, params) => {
            let tmpStr = "";
            if (params.row.AlarmDeal == "02") {
              tmpStr = "已处理";
            } else if (params.row.AlarmDeal == "01") {
              tmpStr = "未处理";
            } else {
              tmpStr = " ";
            }
            return h(
              "span",
              {
                style: {
                  color:
                    params.row.AlarmDeal == "01"
                      ? "#d32f2f"
                      : params.row.AlarmDeal == "02"
                      ? "#19be6b"
                      : " "
                }
              },
              tmpStr
            );
          }
        },
        {
          title: "是否报警",
          align: "center",
          minWidth: 90,
          key: "IsAlarm",
          render: (h, params) => {
            let tmpStr = "";
            if (params.row.IsAlarm == "0") {
              tmpStr = "报警";
            } else if (params.row.IsAlarm == "1") {
              tmpStr = "不报警";
            } else {
              tmpStr = " ";
            }
            return h(
              "span",
              {
                style: {
                  color:
                    params.row.IsAlarm == "0"
                      ? "#d32f2f"
                      : params.row.IsAlarm == "1"
                      ? "#2d8cf0"
                      : " "
                }
              },
              tmpStr
            );
          }
        },
        {
          title: "备注",
          align: "center",
          minWidth: 100,
          key: "Remark"
        },
        {
          title: "处理人",
          align: "center",
          minWidth: 100,
          key: "Handler"
        },
        {
          title: "报警处理时间",
          align: "center",
          minWidth: 120,
          key: "HandleTime",
          render: (h, params) => {
            const Name = this.$options.filters.dataFormat(
              params.row.HandleTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, Name);
          }
        }
      ],
      alarmType: [],
      cddata: {},
      inspectionInfo: {}, // 检测过程数据
      rightBlockHeight: 0,
      videoType: null,
      processResultHeight: 0
    };
  },
  mounted() {
    this.getProxyPath();
    this.$nextTick(() => {
      this.getheight();
      window.addEventListener("resize", this.getheight);
    });
    this.getFuelSysConfig();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getheight);
  },
  methods: {
    // 显示燃油蒸发检测报告和过程数据
    ShowFuelEvaporation() {
      if (this.$refs.reportCont.FuelEvaporationInfo.length > 0) {
        this.VehicleInfo = this.$refs.reportCont.newprints.VehicleInfo;
        this.FuelEvaporationInfo = this.$refs.reportCont.FuelEvaporationInfo[0];
        this.modal2 = true;
      } else {
        this.$Message.warning("暂无燃油蒸发检测数据！");
      }
    },
    // 获取尾气检测过程数据检测结果数据高度
    getInspResHeight() {
      // console.log('模块',this.$refs.processInfoNode)
      if (this.$refs.processInfoNode) {
        // console.log('高度：',this.$refs.processInfoNode.$el.offsetHeight);
        this.processResultHeight = this.$refs.processInfoNode.$el.offsetHeight;
      }
    },
    async getProxyPath() {
      let res = await this.$curl.get("api/hj/getProxyPath");
      this.proxyPath = res.PictureVideoProxyPath;
      this.proxyPath = this.proxyPath.split(",");
    },
    getheight() {
      this.rightBlockHeight = this.$refs.rightBlock.offsetHeight;
    },
    //切换tabs栏
    changeTabs(value) {
      this.tabsName = value;
      if (value == "InspectionReport") {this.getInspectionReport()}
      else if (value == "InspectionImage" || value == "InspectionVideo")
        this.getInspectionImage();
      else if (value == "InspectionProcess") this.getProcessData();
      else if (value == "obdInspectionProcess") this.getObdProcessData();
      else if (value == "BlackSmokeCarVideo") this.getBlackSmokeCar();
      else if (value == "blackBoxProcessTab") {
        this.getProcessData("DB");
        this.getBlackBoxProcessData();
      } else if (value == "AppearanceInfo") this.getAppearanceInfo();

      this.$emit("getTabName", value);
    },
    getBlackSmokeCar() {
      const parmas = {
        VLPN: this.currenDate.VLPN,
        InspectionNum: this.currenDate.InspectionNum
      };
      this.$curl
        .get("api/hj/getBlackSmokeCheck", {
          param: JSON.stringify(parmas)
        })
        .then(res => {
          const { data, code, list, imgList, Count } = res;
          if (code == 200) {
            data.forEach(v => {
              v.imgSrc = `${imgList[0].FieldValue}/${(v.CaptureTime + "")
                .replace("-", "")
                .replace("-", "")
                .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.ImgFile1}`;
              v.hycVideoSrc = `${imgList[0].FieldValue}/${(v.CaptureTime + "")
                .replace("-", "")
                .replace("-", "")
                .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.VideoFile}`;
              v.ysVideoSrc = `${imgList[0].FieldValue}/OriginalVideo/${(
                v.CaptureTime + ""
              )
                .replace("-", "")
                .replace("-", "")
                .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.VideoFile}`;
            });
            this.list = data;
            this.imgList = imgList;
          }
        })
        .catch(err => {});
    },
    //获取报告信息
    getInspectionReport() {
      this.$nextTick(() => {
        if (!(this.currenDate && this.currenDate.InspectionNum)) return;
        this.giveReport = {
          InspectionDataID: this.currenDate.InspectionDataID,
          VehicleID: this.currenDate.VehicleID,
          IUTYPE: this.currenDate.IUTYPE,
          InspectionNum: this.currenDate.InspectionNum,
          VDCT: this.currenDate.VDCT
        };
        // this.$refs.reportCont&&this.$refs.reportCont.printaction();

        this.$nextTick(() => {
          let timer = setTimeout(() => {
            this.$refs.reportCont && this.$refs.reportCont.printaction();
            clearTimeout(timer);
          }, 0);
        });
      });
    },
    //获取图片录像信息
    getInspectionImage() {
      this.$nextTick(() => {
        this.ImageUrl = "";
        this.VideoUrl = "";
        this.ImgArr = [];
        this.videoArr = [];
        if (!this.currenDate.StationCode || !this.currenDate.InspectionNum)
          return;
        let param = {
          StationCode: this.currenDate.StationCode,
          InspectionNum: this.currenDate.InspectionNum,
          isImageCenterEnd: this.$hjconfig.isImageCenterEnd,
          isVideoCenterEnd: this.$hjconfig.isVideoCenterEnd
        };
        this.$curl
          .get("api/hj/getSelStationInfo", {
            param: JSON.stringify(param)
          })
          .then(res => {
            if (res.state) {
              this.ImageUrl = res.data.ImageUrl;
              this.VideoUrl = res.data.VideoUrl;
              this.ImgArr = res.data.Img_Video_List.filter(v => {
                return (
                  v.FileExtension == ".jpg" ||
                  v.FileExtension == ".png" ||
                  v.FileExtension == ".gif" ||
                  v.FileExtension == "svg"
                );
              });
              // 如果图片不是读取中心端，则把代理前缀替换掉
              if (!this.$hjconfig.isImageCenterEnd) {
                this.ImgArr.forEach(v => {
                  this.proxyPath.forEach(k => {
                    if (v.FullFileName.toString().indexOf(k) !== -1) {
                      v.FullFileName = v.FullFileName.toString().replace(k, "");
                    }
                  });
                });
              }
              this.videoArr = res.data.Img_Video_List.filter(v => {
                return (
                  v.FileExtension == ".mp4" ||
                  v.FileExtension == ".avi" ||
                  v.FileExtension == "wmv" ||
                  v.FileExtension == ".ogg"
                );
              });
              // 如果视频不是读取中心端，则把代理前缀替换掉
              if (!this.$hjconfig.isVideoCenterEnd) {
                this.videoArr.forEach(v => {
                  this.proxyPath.forEach(k => {
                    if (v.FullFileName.toString().indexOf(k) !== -1) {
                      v.FullFileName = v.FullFileName.toString().replace(k, "");
                    }
                  });
                });
              }
            } else {
              this.$Message.error("获取图片视频列表失败！");
            }
          });
        this.$curl
          .get("api/hj/getStationVideoType", {
            param: JSON.stringify(param)
          })
          .then(res => {
            if (res.result) this.videoType = res.result.Tag;
          });
      });
    },
    //获取过程数据
    async getProcessData(value) {
      this.$nextTick(() => {
        if (!this.currenDate.InspectionNum || this.currenDate.IUTYPE == "J")
          return;
        const param = {
          InspectionNum: this.currenDate.InspectionNum,
          InspectionMethod: this.currenDate.IUTYPE
        };
        this.processArr = [];
        this.processInfoLoading = true;
        this.$curl
          .get("api/hj/getInspectProcessFromDB", {
            param: JSON.stringify(param)
          })
          .then(res => {
            if (res.data.length) {
              if (value && value == "DB") {
                this.bbpArr = res;
              } else {
                this.processArr = res.data;
              }
            } else {
              this.processArr = [];
              this.bbpArr = {};
            }
            if (JSON.stringify(res.dbTableData) !== "{}") {
              this.inspectionInfo = res.dbTableData;
              this.inspectionInfo.forEach(item => {
                for (let key in item) {
                  if (typeof item[key] === "number") {
                    item[key] = Math.round(item[key] * 100) / 100;
                  }
                }
              });
            }
            this.processInfoLoading = false;
            this.$nextTick(() => {
              this.getInspResHeight();
            });
          });
      });
    },
    //获取obd过程数据
    async getObdProcessData() {
      this.obdProcessInfoLoading = true;
      this.$nextTick(() => {
        if (!this.currenDate.InspectionNum || this.currenDate.IUTYPE == "J")
          return;
        const param = { InspectionNum: this.currenDate.InspectionNum };
        this.processArr = [];
        this.$curl
          .get("api/hj/getObdInspectProcess", {
            InspectionNum: this.currenDate.InspectionNum
          })
          .then(res => {
            if (res.data.length) {
              this.processArr = res.data;
            } else {
              this.processArr = [];
            }
            this.obdProcessInfoLoading = false;
          });
      });
    },
    //获取黑匣子过程数据
    async getBlackBoxProcessData() {
      this.$nextTick(() => {
        if (!this.currenDate.InspectionNum || this.currenDate.IUTYPE == "J")
          return;
        const param = { InspectionNum: this.currenDate.InspectionNum };
        this.processArr = [];
        this.$curl
          .get("api/hj/getBlackBoxProcess", {
            InspectionNum: this.currenDate.InspectionNum
          })
          .then(res => {
            if (res.data.length) {
              this.processArr = res.data;
              this.hxzDBArr = res.DBdata;
            } else {
              this.processArr = [];
            }
          });
      });
    },
    //获取外观检信息
    getAppearanceInfo() {
      this.$nextTick(() => {
        if (!this.currenDate.InspectionNum) return;
        this.$curl
          .get("api/hj/getAppearanceInfoData", {
            InspectionNum: this.currenDate.InspectionNum
          })
          .then(res => {
            !res.InfoData ? (this.resData = {}) : (this.resData = res.InfoData);
            !res.ImgData ? (this.ImgData = []) : (this.ImgData = res.ImgData);
          });
      });
    },
    // 判断是否允许打印报告
    judgePrint() {
  
      
      if (this.currenDate && this.currenDate.IsCanPrint != null) {
            console.log(1);
        if (this.currenDate.IsCanPrint == 1) {
          this.showPrintBtn = true;
        } else {
          this.showPrintBtn = false;
          if (this.currenDate.IsCanPrint == 0)
            this.judgePrintStr = `不允许打印，请联系管理员！`;
          if (this.currenDate.IsCanPrint == 2)
            this.judgePrintStr = `检测数据审核，不允许打印！`;
          if (this.currenDate.IsCanPrint == 3)
            this.judgePrintStr = `环检抽查等待审核，不能打印！`;
        }
      } else {
        // 查询是否有报警信息
        if(!this.currenDate) return;
        const param={
          InspectionNum:this.currenDate.InspectionNum
        }
        this.$curl.get('api/hj/getAlarmHistory',param).then(res=>{
          if(res.code==1){
            this.showPrintBtn = false;
            this.judgePrintStr=res.str;
          }else{
             this.showPrintBtn = true;
          }
        })
      }
    },
    printStart() {
      this.showModel = false;
      if (!this.giveReport.InspectionNum) {
        this.$Message.error("请先选择一条要打印的数据！");
        return;
      }
      this.$refs.reportCont.print_stat();
    },
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    //切换播放视频
    changeVideoPlay(url, index) {
      this.vUrl = url;
      this.currentNum = index;
    },
    // 页号修改触发
    changePage(pageIndex) {
      this.pageIndex = pageIndex;
    },
    // 页数修改触发
    getPageSize(pageSize) {
      this.pageSize = pageSize;
    },
    //过滤数据
    returncodename(namelist, codevalue) {
      if (namelist.length == 0) return codevalue;
      let CodeName = "";
      namelist.forEach(item => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName;
      });
      return CodeName;
    },
    getFuelSysConfig() {
      this.$curl
        .get("api/hj/getSysConfig", {
          params: {
            FieldKey: ["isShowFuelEvaporationBtn"]
          }
        })
        .then(res => {
          if (res.state && res.data)
            if (res.data[0].FieldValue == "false")
              this.isShowFuelEvaporationInfo = false;
          if (res.data[0].FieldValue == "true")
            this.isShowFuelEvaporationInfo = true;
        });
    }
  },
  watch: {
    currenDate(newVal, oldVal) {
      if (this.tabsName == "" || this.tabsName == "InspectionProcess") {
        this.getProcessData();
      }
      this.inspectTimes = {
        startTime: this.$options.filters.dataFormat(
          newVal.DetectStartTime,
          "yyyy-MM-dd hh:mm:ss"
        ),
        endTime: this.$options.filters.dataFormat(
          newVal.DetectEndTime,
          "yyyy-MM-dd hh:mm:ss"
        )
      };
      this.judgePrint();
    },
    videoFormDigital(newVal, oldVal) {
      if (newVal == true) {
        // console.log('data',this.$refs.videoBox)
        this.$refs.videoBox.initPlay();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.img_div {
  display: inline-block;
}

.img_div img {
  margin: 5px;
  display: inline-block;
  width: 140px;
  height: 100px;
}
.ivu-form-item {
  margin: 10px;
}
.videoInfo /deep/ .ivu-btn {
  margin: 0 0 10px 10px;
}
</style>
