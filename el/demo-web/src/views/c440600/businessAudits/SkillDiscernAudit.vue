//业务审核-技术鉴别审核
<template>
  <div>
    <Tabs size="small" :animated=false>
      <TabPane label="技术鉴别申请表">
        <div style="margin-bottom:10px;">
          <Button shape="circle" type="primary" @click.stop="print_stat" v-show="hasStatus=='1'">打印技术鉴别申请表</Button>
        </div>
        <Form ref="formCustom" :label-width="90">
          <!-- fieldset设置表单不可点击 -->
          <fieldset v-bind:disabled="hasStatus" style="border:none;">
            <table border="1" class="table">
              <tr>
                <td rowspan="8">技术鉴别申请信息</td>
                <td>号牌号码</td>
                <td>{{applyInfo.VLPN}}</td>
                <td>车牌颜色</td>
                <td>{{initform.cd_vlpnColor[applyInfo.VLPNColor] || ''}}</td>
                <td>核定载客</td>
                <td>{{applyInfo.RatedSeats}}人</td>
              </tr>
              <tr>
                <td>车辆品牌</td>
                <td>{{applyInfo.FactoryPlateModel}}</td>
                <td>车辆型号</td>
                <td>{{applyInfo.IUVTYPE}}</td>
                <td>发动机型号</td>
                <td>{{applyInfo.IUETYPE}}</td>
              </tr>
              <tr>
                <td>车辆类型</td>
                <td>{{initform.cd_gavType[applyInfo.GAVType] || ''}}</td>
                <td>注册日期</td>
                <td>{{applyInfo.VRDATE | dataFormat("yyyy-MM-dd")}}</td>
                <td>发动机号码</td>
                <td>{{applyInfo.EngineNum}}</td>
              </tr>
              <tr>
                <td>车辆识别代码</td>
                <td>{{applyInfo.VIN}}</td>
                <td>总质量</td>
                <td>{{applyInfo.VML}}千克</td>
                <td>燃油种类</td>
                <td>
                  <fieldset disabled style="border:none">
                    <CheckboxGroup v-model="fuelTypeGroup">
                      <Checkbox label="A">
                        <span>汽油</span>
                      </Checkbox>
                      <Checkbox label="B">
                        <span>柴油</span>
                      </Checkbox>
                    </CheckboxGroup>
                  </fieldset>

                </td>
              </tr>
              <tr>
                <td colspan="2">机动车所有人/身份证明名称/号码</td>
                <td colspan="4">{{returnStr("1")}}</td>
              </tr>
              <tr>
                <td colspan="2">代办人/身份证明名称/号码</td>
                <td colspan="4">{{returnStr( )}}</td>
              </tr>
              <tr>
                <td>联系电话</td>
                <td>{{applyInfo.Tel}}</td>
                <td>申请日期</td>
                <td colspan="3">{{applyInfo.ApplyTime | dataFormat("yyyy年MM月dd日")}}</td>
              </tr>
              <tr>
                <td>联系地址</td>
                <td colspan="5">{{applyInfo.Address}}</td>
              </tr>
              <tr>
                <td colspan="7">以上内容由申请人填写，以下内容由技术鉴别人员填写</td>
              </tr>
              <tr>
                <td>原发黄标信息</td>
                <td colspan="4">
                  <FormItem label="环保标志编号">
                    <Input v-model="auditInfo.OldESignNo" placeholder="环保标志编号" />
                  </FormItem>
                </td>
                <td colspan="2">
                  <FormItem label="签字">
                    <Input v-model="auditInfo.OldESignNoQZ" placeholder="签字" />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>环保目录查询</td>
                <td colspan="4">
                  <FormItem label>
                    <RadioGroup v-model="auditInfo.BHCLXH">
                      <Radio label="1">有</Radio>
                      <Radio label="0">无</Radio>
                    </RadioGroup>
                  </FormItem>
                </td>
                <td colspan="2">
                  <FormItem label="签字">
                    <Input v-model="auditInfo.HBCLXHQZ" placeholder="签字" />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td rowspan="4">装置核查信息</td>
                <td rowspan="3">
                  点燃式发动机
                  <RadioGroup v-model="engineType" @on-change="engineTypeChange(engineType)">
                    <Radio label="1">
                      <span></span>
                    </Radio>
                  </RadioGroup>
                </td>
                <td>电喷发动机</td>
                <td colspan="2">
                  <fieldset style="border:none" :disabled="engineType=='2'">
                    <RadioGroup v-model="auditInfo.DPFDJ">
                      <Radio label="1">有</Radio>
                      <Radio label="0">无</Radio>
                    </RadioGroup>
                  </fieldset>

                </td>
                <td colspan="2" rowspan="3">
                  <FormItem label="签字">
                    <Input v-model="auditInfo.DRSFDJQCQZ" placeholder="签字" :disabled="engineType=='2'" />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>三元催化净化装置</td>
                <td colspan="2">
                  <fieldset style="border:none" :disabled="engineType=='2'">
                    <RadioGroup v-model="auditInfo.HasCCA">
                      <Radio label="1">有</Radio>
                      <Radio label="0">无</Radio>
                    </RadioGroup>
                  </fieldset>
                </td>
              </tr>
              <tr>
                <td>氧传感器</td>
                <td colspan="2">
                  <fieldset style="border:none" :disabled="engineType=='2'">
                    <RadioGroup v-model="auditInfo.HasOxygenSensor">
                      <Radio label="1">有</Radio>
                      <Radio label="0">无</Radio>
                    </RadioGroup>
                  </fieldset>
                </td>
              </tr>
              <tr>
                <td>
                  压缩式发动机
                  <RadioGroup v-model="engineType" @on-change="engineTypeChange(engineType)">
                    <Radio label="2">
                      <span></span>
                    </Radio>
                  </RadioGroup>
                </td>
                <td>电控喷油装置</td>
                <td colspan="2">
                  <fieldset style="border:none" :disabled="engineType=='1'">
                    <RadioGroup v-model="auditInfo.DKPYZZ">
                      <Radio label="1">有</Radio>
                      <Radio label="0">无</Radio>
                    </RadioGroup>
                  </fieldset>
                </td>
                <td colspan="2">
                  <FormItem label="签字">
                    <Input v-model="auditInfo.YRSFDJQCQZ" placeholder="签字" :disabled="engineType=='1'" />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>排放检验结果</td>
                <td colspan="4">
                  <RadioGroup v-model="auditInfo.VDCT">
                    <Radio label="1">合格</Radio>
                    <Radio label="0">不合格</Radio>
                  </RadioGroup>
                </td>
                <td colspan="2">
                  <FormItem label="签字">
                    <Input v-model="auditInfo.VDCTQZ" placeholder="签字" />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>鉴别结论</td>
                <td colspan="6">
                  <FormItem label="经鉴别，该车辆核发标志种类为:" :label-width="200">
                    <RadioGroup v-model="auditInfo.JBJL">
                      <Radio label="0">黄标</Radio>
                      <Radio label="1">绿标</Radio>
                    </RadioGroup>
                  </FormItem>
                  <div style="float:right;width:240px;">
                    <FormItem label="鉴别单位(盖章):" :label-width="100">
                      <Select v-model="auditInfo.StationCode" placeholder="选择单位">
                        <Option value>全部</Option>
                        <Option v-for="item in search_CD.StationList" :value="item.CodeValue" :key="item.CodeValue">{{item.CodeName}}</Option>
                      </Select>
                    </FormItem>
                    <DatePicker type="date" placeholder="选择时间" style="width: 200px" v-model="auditInfo.JBDATE"></DatePicker>
                  </div>
                </td>
              </tr>
              <tr>
                <td>备注</td>
                <td colspan="3">
                  <FormItem label="鉴别后核发绿标编号:" :label-width="140">
                    <Input v-model="auditInfo.NewESignNo" placeholder="填写" />
                  </FormItem>
                </td>
                <td colspan="3">
                  <FormItem label="技术鉴别编号:" :label-width="140">
                    <Input v-model="auditInfo.JSJBNUM" placeholder="填写" />
                  </FormItem>
                </td>
              </tr>
            </table>
          </fieldset>
        </Form>
      </TabPane>
      <TabPane label="证件图片">
        <image-info :ImgForm="imgInfo"></image-info>
      </TabPane>
      <TabPane label="检测报告数据">
        <div v-if="giveReport.VehicleID">
          <Button type="success" @click="printStart" style="margin-left:10px;">打印预览检测报告</Button>
          <p style="text-align:center;font-size:16px;">机动车排气污染物检测报告单</p>
          <div style="overflow: hidden auto; height:100%;">
            <printContent :giveReport="giveReport" ref="reportCont" />
          </div>
        </div>
        <div v-else>
          <p style="text-align:center;font-size:16px;">暂无检测报告</p>
        </div>
      </TabPane>
    </Tabs>

    <!-- 打印功能 -->
    <Form id="printDiv" ref='printDiv' :label-width="90">
      <table border="1" class="table">
        <tr>
          <td rowspan="8">技术鉴别申请信息</td>
          <td>号牌号码</td>
          <td>{{applyInfo.VLPN}}</td>
          <td>车牌颜色</td>
          <td>{{initform.cd_vlpnColor[applyInfo.VLPNColor] || ''}}</td>
          <td>核定载客</td>
          <td>{{applyInfo.RatedSeats}}人</td>
        </tr>
        <tr>
          <td>车辆品牌</td>
          <td>{{applyInfo.FactoryPlateModel}}</td>
          <td>车辆型号</td>
          <td>{{applyInfo.IUVTYPE}}</td>
          <td>发动机型号</td>
          <td>{{applyInfo.IUETYPE}}</td>
        </tr>
        <tr>
          <td>车辆类型</td>
          <td>{{initform.cd_gavType[applyInfo.GAVType] || ''}}</td>
          <td>注册日期</td>
          <td>{{applyInfo.VRDATE | dataFormat("yyyy-MM-dd")}}</td>
          <td>发动机号码</td>
          <td>{{applyInfo.EngineNum}}</td>
        </tr>
        <tr>
          <td>车辆识别代码</td>
          <td>{{applyInfo.VIN}}</td>
          <td>总质量</td>
          <td>{{applyInfo.VML}}千克</td>
          <td>燃油种类</td>
          <td>
            <img :src="applyInfo.FuelType=='A' ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />汽油
            <img :src="applyInfo.FuelType=='B' ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />柴油
          </td>
        </tr>
        <tr>
          <td colspan="2">机动车所有人/身份证明名称/号码</td>
          <td colspan="4">{{returnStr("1")}}</td>
        </tr>
        <tr>
          <td colspan="2">代办人/身份证明名称/号码</td>
          <td colspan="4">{{returnStr( )}}</td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>{{applyInfo.Tel}}</td>
          <td>申请日期</td>
          <td colspan="3">{{applyInfo.ApplyTime | dataFormat("yyyy年MM月dd日")}}</td>
        </tr>
        <tr>
          <td>联系地址</td>
          <td colspan="5">{{applyInfo.Address}}</td>
        </tr>
        <tr>
          <td colspan="7">以上内容由申请人填写，以下内容由技术鉴别人员填写</td>
        </tr>
        <tr>
          <td>原发黄标信息</td>
          <td colspan="4">
            <FormItem label="环保标志编号">
              <span>{{auditInfo.OldESignNo}}</span>
            </FormItem>
          </td>
          <td colspan="2">
            <FormItem label="签字">
              <span>{{auditInfo.OldESignNoQZ}}</span>
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>环保目录查询</td>
          <td colspan="4">
            <FormItem label>
              <img :src="auditInfo.BHCLXH==1 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />有
              <img :src="auditInfo.BHCLXH==0 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />无
            </FormItem>
          </td>
          <td colspan="2">
            <FormItem label="签字">
              <span>{{auditInfo.HBCLXHQZ}}</span>
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowspan="4">装置核查信息</td>
          <td rowspan="3">
            点燃式发动机
            <img :src="engineType==1 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />
          </td>
          <td>电喷发动机</td>
          <td colspan="2">
            <img :src="auditInfo.DPFDJ==1 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />有
            <img :src="auditInfo.DPFDJ==0 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />无
          </td>
          <td colspan="2" rowspan="3">
            <FormItem label="签字">
              <span>{{auditInfo.DRSFDJQCQZ}}</span>
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>三元催化净化装置</td>
          <td colspan="2">
            <img :src="auditInfo.HasCCA==1 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />有
            <img :src="auditInfo.HasCCA==0 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />无
          </td>
        </tr>
        <tr>
          <td>氧传感器</td>
          <td colspan="2">
            <img :src="auditInfo.HasOxygenSensor==1 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />有
            <img :src="auditInfo.HasOxygenSensor==0 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />无
          </td>
        </tr>
        <tr>
          <td>
            压缩式发动机
            <img :src="engineType==2 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />
          </td>
          <td>电控喷油装置</td>
          <td colspan="2">
            <img :src="auditInfo.DKPYZZ==1 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />有
            <img :src="auditInfo.DKPYZZ==0 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />无
          </td>
          <td colspan="2">
            <FormItem label="签字">
              <span>{{auditInfo.YRSFDJQCQZ}}</span>
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>排放检验结果</td>
          <td colspan="4">
            <img :src="auditInfo.VDCT==1 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />合格
            <img :src="auditInfo.VDCT==0 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />不合格
          </td>
          <td colspan="2">
            <FormItem label="签字">
              <span>{{auditInfo.VDCTQZ}}</span>
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>鉴别结论</td>
          <td colspan="6">
            <FormItem label="经鉴别，该车辆核发标志种类为:" :label-width="200">
              <img :src="auditInfo.JBJL==0 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />黄标
              <img :src="auditInfo.JBJL==1 ? '/exhaust/img/ok.png' : '/exhaust/img/nook.png'" style="width:12px;height:12px;" />绿标
            </FormItem>
            <div style="float:right;width:240px;">
              <FormItem label="鉴别单位(盖章):" :label-width="100">
                <Select v-model="auditInfo.StationCode" placeholder="选择单位">
                  <Option value>全部</Option>
                  <Option v-for="item in search_CD.StationList" :value="item.CodeValue" :key="item.CodeValue">{{item.CodeName}}</Option>
                </Select>
              </FormItem>
              <span>{{auditInfo.JBDATE | dataFormat("yyyy-MM-dd hh:mm:ss")}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="3">
            <FormItem label="鉴别后核发绿标编号:" :label-width="140">
              <span>{{auditInfo.NewESignNo}}</span>
            </FormItem>
          </td>
          <td colspan="3">
            <FormItem label="技术鉴别编号:" :label-width="140">
              <span>{{auditInfo.JSJBNUM}}</span>
            </FormItem>
          </td>
        </tr>
      </table>
    </Form>
  </div>
</template>

<script>
import { needCLodop, getLodop } from "./../../utils/utils";
import ImageInfo from "./drawInfo/ImageInfo";
// import printContent from "./../../../views/vehicle/printContent.vue";
import printContent from "./../vehicle/keyInfoChange";
export default {
  name: "skillDiscernAudit",
  props: {
    selectData: {
      type: Object
    },
    initform: {
      type: Object
    }
  },
  data() {
    return {
      giveReport: {
        VehicleID: null
      },
      hasStatus: false, //是否已审核
      search_CD: {},
      applyInfo: {},
      auditInfo: {},
      imgInfo: [],
      engineType: "1", //点燃式是1,压缩式是2
      trBodyStyle: `<style scoped>
        #printDiv{
           display:block;
        }
        
        table {
          border-collapse: collapse;
          margin: 0 auto;
          text-align: center;
          width: 94%;
          display:block;
        }
        td {
          border: 1px solid #000000;
          text-align: left;
          margin: 0px;
          padding: 6px;
          font-family: 宋体;
          font-size: 9pt;
        }
        tr {
            line-height: 3mm;
        }
        .ivu-form-item-label{
          line-height:1;
          display:inline-block;
          margin-left:20px;
        }
        .ivu-form-item-content span {
          border-bottom: 1px solid #000;
          width:100%;
          display: inline-block;
          margin-top:-20px;
        }
        </style>`
    };
  },
  computed: {
    fuelTypeGroup() {
      if (this.applyInfo.FuelType) return this.applyInfo.FuelType.split('')
    }
  },
  components: {
    ImageInfo,
    printContent
  },
  methods: {
    SubmitAudit(isStauts) {
      this.saveApplyData(isStauts);
    },
    BackToAudit() {
      this.$emit('handleBackToAudit', this.auditInfo)
    },
    async saveApplyData(isStauts) {
      //技术鉴别审核
      if (!+this.engineType) {
        this.$Notice.warning({
          title: "装置核查信息不能为空"
        });
        return;
      }
      const auditInfo = this.auditInfo;
      let message = "";
      if (auditInfo.VDCT != 0 && auditInfo.VDCT != 1)
        message += "排放检验结果不能为空!<br/>";
      if (auditInfo.JBJL != 0 && auditInfo.JBJL != 1)
        message += "鉴别结论不能为空!<br/>";
      if (!auditInfo.StationCode) message += "鉴别单位不能为空!<br/>";
      if (!auditInfo.JBDATE) message += "鉴别日期不能为空!";

      if (this.engineType === "1") {
        //点燃式
        if (auditInfo.DPFDJ != 0 && auditInfo.DPFDJ != 1)
          message += "电喷发动机不能为空!<br/>";
        if (auditInfo.HasCCA != 0 && auditInfo.HasCCA != 1)
          message += "三元催化净化装置不能为空!<br/>";
        if (auditInfo.HasOxygenSensor != 0 && auditInfo.HasOxygenSensor != 1)
          message += "氧传感器不能为空!<br/>";
        if (!auditInfo.DRSFDJQCQZ) message += "签字不能为空!<br/>";
      }
      if (this.engineType == "2") {
        //压缩式
        if (auditInfo.DKPYZZ != 0 && auditInfo.DKPYZZ != 1)
          message += "电控喷油装置不能为空!<br/>";
        if (!auditInfo.YRSFDJQCQZ) message += "签字不能为空!<br/>";
      }

      var regType = {
        regexChinese: /^[\u0391-\uFFE5]+$/,
        onlyEnandNum: /^[0-9a-zA-Z]*$/g //数字和英文
      };

      if (
        !regType.regexChinese.test(auditInfo.YRSFDJQCQZ) &&
        !regType.regexChinese.test(auditInfo.DRSFDJQCQZ)
      )
        message += "签字不符合格式!<br/>";
      if (message != "") {
        this.$Notice.warning({
          title: message
        });
        return;
      }

      const param = {
        data: this.auditInfo,
        VehicleID: this.applyInfo.VehicleID,
        CheckId: this.applyInfo.CheckId,
        isStauts: isStauts
      };
      const res = await this.$curl.post("api/hj/SaveJSJBApplyLogic", param);
      if (res.state) {
        if (res.auditInfo) {
          //将后台返回的处理人，处理时间赋值
          this.auditInfo.Checker = res.auditInfo.Checker;
          this.auditInfo.CheckTime = res.auditInfo.CheckTime;

          this.selectData.AuditState = this.auditInfo.JBJL;
          this.selectData.Status = this.auditInfo.Status = "1";
          this.selectData.Checker = this.auditInfo.Checker;
          this.selectData.CheckTime = this.auditInfo.CheckTime;
          this.$emit("on-edit", this.selectData);
        }
        this.$Message.success(res.msg);
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: res.msg
        });
      }
    },
    async getCDData() {
      const list = [
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
          where: ""
        }
      ];
      const res = await this.$curl.get("api/hj/getCDData", { CDDataList: JSON.stringify(list) });
      if (res.state) this.search_CD = { StationList: res.data[0][0].hasOwnProperty('IsAvailable') ? res.data[0].filter(d => d.IsAvailable == 1) : res.data[0], };
    },
    //直接从浏览器缓存获取CD表或者从reids
    getDBinfoByMultipte() {
      const self = this;
      if (self.$getDBTable) {
        self.$getDBTable(['StationInfo']).then(res => {
          self.search_CD = { StationList: JSON.parse(res[0])[0].hasOwnProperty('IsAvailable') ? JSON.parse(res[0]).filter(r => r.IsAvailable == 1) : JSON.parse(res[0]) }
        })
      }
      else {
        self.getCDData();
      }
    },
    async getData() {
      const param = {
        CheckId: this.selectData.CheckId,
        BusinessKey: this.selectData.BusinessKey,
        VehicleID: this.selectData.VehicleID
      };
      const res = await this.$curl.get("api/hj/getSkillDiscernAudit", {
        param: JSON.stringify(param)
      });
      this.auditInfo = {};
      this.applyInfo = {};
      this.giveReport = {
        VehicleID: null
      };
      if (res.state) {
        if (res.auditInfo) this.auditInfo = res.auditInfo;
        if (res.applyInfo) this.applyInfo = res.applyInfo;
        if (res.inspectData) {
          this.giveReport = res.inspectData;
          //触发打印组件的子方法
          this.$nextTick(() => {
            this.$refs.reportCont.printaction();
          });
        }
        this.engineType = this.auditInfo.DKPYZZ ? "2" : "1";
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取技术权限信息失败!"
        });
      }
    },
    async getImgList() {
      const param = {
        ID: this.selectData.CheckId, //审核ID
        TYPE: "23", //业务组
        OP: ""
      };
      const res = await this.$curl.get("api/hj/getBusinessFileInfo", {
        param: JSON.stringify(param)
      });
      this.imgInfo = [];
      if (res.state) {
        if (res.data.imgList.length > 0) this.imgInfo = res.data.imgList;
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取图片列表失败!"
        });
      }
    },
    printStart() {
      this.showModel = false;
      this.$refs.reportCont.print_stat();
    },
    //打印
    print_stat() {
      var LODOP = getLodop();
      if (!LODOP) {
        this.$Modal.warning({
          content: "Web打印服务CLodop未安装启动，点击这里<a href='http://www.lodop.net/download.html' target='_black'>下载执行安装</a>（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）,并<a href='javascript:location.reload();'>刷新当前页</a>",
        });
        return
      }
      if (LODOP.CVERSION < "3.0.9.3") {
        this.$Modal.warning({
          content: "Web打印服务CLodop需升级!点击这里<a href='http://www.lodop.net/download.html' target='_black'>执行升级</a>,升级后请<a href='javascript:location.reload();'>刷新当前页</a>。"
        })
      }
      LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_设置预览窗口界面");
      LODOP.SET_PRINT_PAGESIZE(1, "210mm", "297mm", "");
      LODOP.ADD_PRINT_HTM(
        20,
        -20,
        "210mm",
        "297mm",
        // strStyleCSS +
        this.trBodyStyle +
        "<body>" +
        this.refs.printDiv.innerHTML +
        "</body>"
      );
      LODOP.SET_PRINT_MODE("PRINT_DUPLEX", 1); //设置打印模式
      LODOP.PREVIEW();
      // LODOP.PRINT_DESIGN();
    },
    engineTypeChange(engineType) {
      if (engineType == "1") {
        this.auditInfo.DKPYZZ = "";
      } else if (engineType == "2") {
        this.auditInfo.DPFDJ = "";
        this.auditInfo.HasCCA = "";
        this.auditInfo.HasOxygenSensor = "";
        this.auditInfo.DRSFDJQCQZ = "";
      }
    },
    returnStr(type) {
      var type, num, name;
      if (type == "1") {
        type = this.initform.cd_credentials[this.applyInfo.CredentialsType];
        num = this.applyInfo.CredentialsNum;
        name = this.applyInfo.OwnerName;
      } else {
        type = this.initform.cd_credentials[this.applyInfo.DBCredentialsType];
        num = this.applyInfo.DBCredentialsNum;
        name = this.applyInfo.DBName;
      }

      type = type ? type : "";
      name = name ? name : "";
      num = num ? num : "";
      if (!type && !name && !num) {
        return "";
      }
      return name + "/" + type + "/" + num;
    }
  },
  created() {
    this.getDBinfoByMultipte();
  },
  watch: {
    selectData: {
      handler(newData, oldData) {
        if (!newData) return;
        if (newData.Status == "1") this.hasStatus = true;
        else this.hasStatus = false;

        this.engineType = "1";
        this.getData();
        this.getImgList();
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
fieldset[disabled] {
  -ms-pointer-events: none;
  pointer-events: none;
}

#printDiv {
  display: none;
}

.ivu-form-item {
  margin-bottom: 6px;
}

table {
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}

table td,
table th {
  border: 1px solid #e8eaec;
  /* color: #a2a2a2; */
  height: 30px;
}
table td {
  padding: 6px;
}

table thead th {
  background-color: #e8eaec;
  width: 100px;
}

/* table tr:nth-child(odd) {
  background: #fff;
} */

/* table tr:nth-child(even) {
  background: #f5fafa;
} */
</style>


