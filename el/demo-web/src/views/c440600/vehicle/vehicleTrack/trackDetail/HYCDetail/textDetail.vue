<template>
  <div>
    <Collapse v-model="showValue" simple style="min-height:100%;">
      <Panel name="1">
        <span style="font-size:14px;font-weight: 800;">车辆基本信息</span>
        <div slot="content">
          <!-- :label-width="100" -->
          <Form :model="vehicleBaseData" label-position="left">
            <FormItem label="车牌号：">
              <span class="bold">{{
                vehicleBaseData.VLPN || auditData.VLPN || "无车牌"
              }}</span>
            </FormItem>
            <FormItem label="车牌颜色：">
              <span class="bold">{{
                returncodename(
                  cdDate["cd_vlpncolor"],
                  vehicleBaseData.VLPNColor
                ) || "- -"
              }}</span>
            </FormItem>
            <FormItem label="车主：">
              <span class="bold">{{ vehicleBaseData.OwnerName || "- -" }}</span>
            </FormItem>
            <FormItem label="车架号：">
              <span class="bold">{{ vehicleBaseData.VIN || "- -" }}</span>
            </FormItem>
            <FormItem label="初登日期：">
              <span class="bold">{{ vehicleBaseData.VRDATE || "- -" }}</span>
            </FormItem>
            <FormItem label="车型号：">
              <span class="bold">{{ vehicleBaseData.IUVTYPE || "- -" }}</span>
            </FormItem>
            <FormItem label="燃油类型：">
              <span>
                <span class="bold">{{
                  returncodename(
                    cdDate["cd_fuelType"],
                    vehicleBaseData.FuelType
                  ) || "- -"
                }}</span>
              </span>
            </FormItem>
            <FormItem label="排放标准：">
              <span class="bold">{{
                vehicleBaseData.EmissionStandard || "- -"
              }}</span>
            </FormItem>
            <FormItem label="公安车辆类型：">
              <span class="bold">{{ vehicleBaseData.GAVType || "- -" }}</span>
            </FormItem>
            <FormItem label="出厂日期：">
              <span class="bold">{{
                vehicleBaseData.ProductDate || "- -"
              }}</span>
            </FormItem>
          </Form>
        </div>
      </Panel>
      <Panel name="2">
        <span style="font-size:14px;font-weight: 800;">审核记录</span>
        <div slot="content">
          <!--  :label-width="100" -->
          <Form :model="auditData" label-position="left">
            <FormItem label="车牌号：">
              <span class="bold">{{ auditData.VLPN || "无车牌" }}</span>
            </FormItem>
            <FormItem label="车牌颜色：">
              <span class="bold">{{
                returncodename(cdDate["cd_vlpncolor"], auditData.VLPNColor) ||
                  "- -"
              }}</span>
            </FormItem>
            <FormItem label="林格曼等级：">
              <span class="bold">{{
                returncodename(cdDate["cd_smokerank"], auditData.RgB) || "- -"
              }}</span>
            </FormItem>
            <FormItem label="抓拍时间：">
              <span class="bold">{{ auditData.CaptureDateTime || "- -" }}</span>
            </FormItem>
            <FormItem label="抓拍点位：">
              <span class="bold">{{ auditData.RSStationName || "- -" }}</span>
            </FormItem>
            <FormItem label="审核结果：">
              <Tag
                class="bold"
                :color="returnResult(auditData.AuditResult)[1]"
                >{{ HYCAuditResult(auditData.AuditResult) }}</Tag
              >
            </FormItem>
            <FormItem
              v-show="auditData.Auditor"
              :label="getHYCHisDSStatus(auditData.AuditResult) + '人：'"
            >
              <span class="bold">{{ auditData.Auditor || "- -" }}</span>
            </FormItem>
            <FormItem
              v-show="auditData.AuditTime"
              :label="getHYCHisDSStatus(auditData.AuditResult) + '时间：'"
            >
              <span class="bold">{{ auditData.AuditTime || "- -" }}</span>
            </FormItem>
            <div v-if="auditHistory.length > 0">
              <FormItem
                v-for="(item, index) in auditHistory"
                :key="index"
                :label="getHYCHisDSStatus(item.AuditResult) + '意见：'"
              >
                <span class="bold">{{ item.AuditOpinion || "无" }}</span>
              </FormItem>
            </div>
            <FormItem v-show="auditData.reAuditor" label="退回人：">
              <span>
                <span class="bold">{{ auditData.reAuditor || "- -" }}</span>
              </span>
            </FormItem>
            <FormItem v-show="auditData.reAuditTime" label="退回时间：">
              <span class="bold">{{ auditData.reAuditTime || "- -" }}</span>
            </FormItem>
            <FormItem v-show="auditData.reAuditOpinion" label="退回意见：">
              <span class="bold">{{ auditData.reAuditOpinion || "- -" }}</span>
            </FormItem>
          </Form>
        </div>
      </Panel>
      <Panel name="3" v-show="returIsEviden(auditData.AuditResult)">
        <span style="font-size:14px;font-weight: 800;">证据链信息</span>
        <div slot="content">
          <Form label-position="left">
            <FormItem label="抓拍编号:">
              <i-col span="24" style="word-wrap:break-word">{{
                evidenceInfo.SmokeNo || "- -"
              }}</i-col>
            </FormItem>
            <FormItem label="抓拍点位:">
              <span class="bold">{{
                returnName(
                  cdDate["rsstationinfo"],
                  evidenceInfo.RSStationCode
                ) || "- -"
              }}</span>
            </FormItem>
            <FormItem label="抓拍时间:">
              <span class="bold">{{
                evidenceInfo.CaptureDateTime || "- -"
              }}</span>
            </FormItem>
            <FormItem label="证据类型:">
              <span class="bold">{{
                (evidenceInfo.VerifyType ? "" : "") || "- -"
              }}</span>
            </FormItem>
            <FormItem label="是否生成证据链:">
              <span class="bold">{{
                (evidenceInfo.EvidencePath ? "是" : "否") || "- -"
              }}</span>
            </FormItem>
            <FormItem label="生成证据链时间:">
              <span class="bold">{{
                evidenceInfo.CreateDateTime || "- -"
              }}</span>
            </FormItem>
            <FormItem label="证据链下载次数:">
              <span class="bold">{{ evidenceInfo.DownloadTimes || "0" }}</span>
            </FormItem>
            <FormItem label="是否已推送:">
              <span class="bold">{{
                (evidenceInfo.PushState ? "是" : "否") || "- -"
              }}</span>
            </FormItem>
            <FormItem label="推送时间:">
              <span class="bold">{{
                (evidenceInfo.PushDateTime &&
                  evidenceInfo.PushDateTime != "Invalid date" &&
                  evidenceInfo.PushDateTime) ||
                  "- -"
              }}</span>
            </FormItem>
            <FormItem label="是否已取证:">
              <span class="bold">{{
                evidenceInfo.GetEvidenceTime &&
                evidenceInfo.GetEvidenceTime != "Invalid date" &&
                evidenceInfo.GetEvidenceTime
                  ? "是"
                  : "否" || "- -"
              }}</span>
            </FormItem>
            <FormItem label="取证时间:">
              <span class="bold">{{
                (evidenceInfo.GetEvidenceTime &&
                  evidenceInfo.GetEvidenceTime != "Invalid date" &&
                  evidenceInfo.GetEvidenceTime) ||
                  "- -"
              }}</span>
            </FormItem>
            <FormItem label="是否已处罚:">
              <span class="bold">{{
                (evidenceInfo.PunishState ? "是" : "否") || "- -"
              }}</span>
            </FormItem>
            <FormItem label="处罚时间:">
              <span class="bold">{{
                (evidenceInfo.PunishTime &&
                  evidenceInfo.PunishTime != "Invalid date" &&
                  evidenceInfo.PunishTime
                    | dataFormat("yyyy-MM-DD hh:mm:ss")) ||
                  "- -"
              }}</span>
            </FormItem>
            <FormItem label="处罚内容:">
              <span class="bold">{{
                evidenceInfo.PenaltyContent || "无"
              }}</span>
            </FormItem>
            <FormItem label="证据链阶段:">
              <span class="bold">{{
                PushStageList[evidenceInfo.PushStage] || ""
              }}</span>
            </FormItem>
          </Form>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
import { HYCAuditResult, getHYCHisDSStatus } from "../../../../../utils/utils"; // 引入返回黑烟车审核结果和返回审核前缀函数
export default {
  name: "textDetail",
  props: {
    infoObj: {
      type: Object,
    },
  },
  data() {
    return {
      getHYCHisDSStatus,
      HYCAuditResult,
      cdDate: {}, //cd表数据
      vehicleBaseData: {}, //车辆基本信息
      auditData: {}, //审核记录数据
      auditHistory: [], //审核历史
      evidenceInfo: {}, // 证据信息
      PushStageList: {
        "1": "环保审核",
        "2": "环保提交",
        "3": "公安提取",
        "4": "公安审核",
        "5": "公安处罚",
      },
      showValue: ["1", "2", "3"], // 默认打开的折叠面板的序号
    };
  },

  methods: {
    async init() {
      this.getCDData();
      this.getVehicleBaseData();
      this.getAuditInfo();
      this.getEvidenceInfo();
    },

    // 获取车辆基本信息
    async getVehicleBaseData() {
      this.vehicleBaseData = {};
      let params = {
        VLPN: this.infoObj.VLPN,
        VLPNColor: this.infoObj.VLPNColor,
      };
      let res = await this.$curl.get("api/hj/getHYCVehicleBaseData", {
        params: JSON.stringify(params),
      });
      if (res.state === 1) {
        this.vehicleBaseData = res.data;
      }
    },
    // 审核信息
    async getAuditInfo() {
      let params = {
        SmokeVehicleID: this.infoObj.SmokeVehicleID,
      };
      let res = await this.$curl.get("api/hj/getHYCValidAuditData", {
        params: JSON.stringify(params),
      });
      if (res.state === 1) {
        this.auditData = res.data || {};
        this.auditHistory = res.history || [];
      }
    },
    // 获取右侧证据链信息
    async getEvidenceInfo() {
      let params = {
        SmokeVehicleID: this.infoObj.SmokeVehicleID,
      };
      let res = await this.$curl.get("api/hj/getHYCEvidenceInfo", {
        params: JSON.stringify(params),
      });
      if (res.state === 1) {
        this.evidenceInfo = res.data || {};
      }
    },
    // 获取cd列表
    async getCDData() {
      let params = [
        "cd_vlpncolor",
        "rsstationinfo",
        "cd_islocal",
        "cd_smokerank",
        "cd_fueltype",
      ];
      let res = await this.$curl.get("api/hj/getHYCCDList", {params: JSON.stringify(params)});
      if (res.state === 1) {
        this.cdDate = res.data;
      }
    },
        // 根据cd表返回codename
    returncodename(cdList, code) {
      return this.$options.filters.returnCodeName(cdList, code);
    },
    // 返回站点名字
    returnName(list, value) {
        if (!list || list.length <= 0) return "";
        let stationData = list.find((item) => {
          return item.RSStationCode == value;
        });
        if (!stationData || stationData == {}) return "";
        return stationData.RSStationName;
      
    },
    // 根据审核结果返回样式列表
    returnResult(res) {
        if (["11", "21", "23", "31", "33", "35"].indexOf(res) > -1)
          return ["黑烟车", "red"];
        else if (["12", "22", "24", "32", "34", "36"].indexOf(res) > -1)
          return ["非黑烟车", "cyan"];
        else if (["13", "25", "37"].indexOf(res) > -1) return ["存档", "green"];
        else return ["未审核", "orange"];
    },
    // 是否已生成证据链
    returIsEviden(res) {
        if (!res || ["11", "23", "35"].indexOf(res) > -1) {
          return true;
        } else if (["12", "24", "36"].indexOf(res) > -1) {
          return false;
        } else if (["13", "25", "37"].indexOf(res) > -1) return true;
        else return false;
      
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.ivu-form /deep/ .ivu-form-item {
  margin-bottom: 3px;
}
/deep/.ivu-collapse-content {
  padding-right: 0;
}
/deep/ .ivu-collapse-content > .ivu-collapse-content-box {
  padding-bottom: 5px;
}
.bold {
  font-weight: bold;
}
</style>
