// 业务审核-审核信息
<template>
  <div class="audit-main">
    <Card>
      <p slot="title">审核信息</p>
      <Form label-position="right" :label-width="140">
        <Row :gutter="32">
          <i-col :sm="8">
            <FormItem label="审核类型:">{{initform.cd_checkType[AuditForm.CheckType] || ''}}</FormItem>
          </i-col>
        </Row>
        <Row :gutter="32">
          <i-col :sm="8" v-show="AuditForm.CheckType&&AuditForm.CheckType.indexOf('10')==-1">
            <FormItem label="申请人:">{{AuditForm.ApplyUserName}}</FormItem>
          </i-col>
          <i-col :sm="8" v-show="AuditForm.CheckType&&AuditForm.CheckType.indexOf('10')!=-1">
            <FormItem label="申请站点:">{{initform.cd_station[AuditForm.Applicant]}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="申请时间:">{{AuditForm.ApplyTime | dataFormat("yyyy-MM-dd hh:mm:ss")}}</FormItem>
          </i-col>
          <i-col :sm="8" v-show="ApplyReasonName(AuditForm.CheckType,AuditForm.ApplyReason)">
            <FormItem label="申请原因:">
              <span style="color:#f00;">{{ApplyReasonName(AuditForm.CheckType,AuditForm.ApplyReason)}}</span>
            </FormItem>
          </i-col>
        </Row>
        <Row v-if="isSpecial" :gutter="32">
          <i-col :sm="8">
            <FormItem label="是否上传入值:">{{IsUseIUEMANULambda}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="是否判断HC:">{{IsCheckHC}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="是否判断OBD:">{{IsCheckOBD}}</FormItem>
          </i-col>
        </Row>
        <Row v-if="isSpecial && IsUseIUEMANULambda != '否'" :gutter="32">
          <i-col :sm="8">
            <FormItem label="入下限:">{{LambdaD}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="入上限:">{{LambdaU}}</FormItem>
          </i-col>
        </Row>
        <Row :gutter="32" v-if="fgk">
          <i-col :sm="8">
            <FormItem label="非工况原因:">{{initform.cd_fgkReason[FGKForm.FGKReason]}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="技术负责人意见:">{{FGKForm.JSFZRRemark}}</FormItem>
          </i-col>
          <i-col :sm="8" v-if="FGKForm.FGKReason=='04'">
            <FormItem label="其他原因:">{{FGKForm.OtherReason}}</FormItem>
          </i-col>
        </Row>
        <Row :gutter="32" v-if="isShowInspect(AuditForm.ApplyReason)">
          <i-col :sm="8">
            <FormItem label="上次检测不合格检测站:">{{initform.cd_station[CrossApplyForm.LastInspectionStation] || ''}}</FormItem>
          </i-col>
          <i-col :sm="16">
            <FormItem label="本次申请的检测站:">{{initform.cd_station[CrossApplyForm.InspectionStation] || ''}}</FormItem>
          </i-col>
        </Row>
        <Row :gutter="32" v-show="hasStatus">
          <i-col :sm="8">
            <FormItem label="审核人:">{{AuditForm.Checker}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="审核时间:">{{AuditForm.CheckTime | dataFormat("yyyy-MM-dd hh:mm:ss") }}</FormItem>
          </i-col>
        </Row>
        <Row :gutter="32">
          <i-col :sm="12" v-show="AuditForm.AuditState !=3">
            <fieldset v-bind:disabled="hasStatus" style="border:none;">
              <FormItem label="审核结果:">
                <RadioGroup v-model="AuditForm.AuditState">
                  <Radio :label="item.CodeValue" v-for="(item,index) in AuditList" :key="index">{{item.CodeName}}</Radio>
                </RadioGroup>
              </FormItem>
            </fieldset>

          </i-col>
          <i-col :sm="12" v-show="AuditForm.AuditState ==3">
            <FormItem label="审核结果:">
              自动审核
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="32">
          <i-col :sm="12">
            <FormItem label="审核备注:">
              <Input v-if="AuditForm.CheckType=='24'" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder v-model.trim="AuditForm.ApplyReason" />
              <Input v-else type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder v-model.trim="AuditForm.Remarks" />
            </FormItem>
          </i-col>
          <i-col :sm="12">
            <div class="feedback-box" v-if="AuditFastReply.length > 0">
              <Tag color="green" class="tag" v-for="(item, index) in AuditFastReply" :key="index" closable @on-close="handleTagClose(index)" @click.native="clickTag(item)">{{item}}</Tag>
            </div>
            <Tooltip content="添加快捷回复" theme="light">
              <Button type="primary" icon="md-add" size="small" @click="showFastReplyAdd = true"></Button>
            </Tooltip>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Modal
        v-model="showFastReplyAdd"
        title="添加新快捷回复"
        @on-ok="addFastReply"
        @on-cancel="showFastReplyAdd = false">
        快捷回复：<Input type="text" v-model.trim="newFastReply" />
    </Modal>
  </div>
</template>
<script>
export default {
  name: "auditInfo",
  props: {
    AuditForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    initform: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isFGK: {
      type: Boolean,
      default: false
    },
    FGKForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    CrossApplyForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selectData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    AcceptForm: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      hasAuditState: false, //审核结果是否通过
      hasStatus: false, //是否已审核
      AuditList: [
        { CodeValue: "1", CodeName: "通过" },
        { CodeValue: "0", CodeName: "不通过" }
      ],
      isSpecial: false, // false表示不进入特殊审核
      LambdaU: "", // 上限
      LambdaD: "", // 下限
      IsUseIUEMANULambda: "", // 是否传值
      IsCheckHC: "", // 是否检测HC
      IsCheckOBD: "", // 是否检查obd
      fgk: false, // 是否为非工况
      InspectionNum: "",
      where: "",
      AuditFastReply: [],
      showFastReplyAdd: false,
      newFastReply: ''
    };
  },
  watch: {
    AuditForm: {
      handler(data) {
        if (data.AuditState == "1") this.hasAuditState = true;
        else this.hasAuditState = false;

        if (data.Status == "1") this.hasStatus = true;
        else this.hasStatus = false;

        if(this.AuditForm.AuditState == null && this.AuditForm.CheckType =='07') {
          // this.AuditForm.AuditState = 1;
          this.$set(this.AuditForm, 'AuditState', '1')
        }
      }
    },
    'AuditForm.UniqueString': {
      handler(data) {
        if(this.AuditForm.AuditState == null && this.AuditForm.CheckType =='07') {
          // this.AuditForm.AuditState = 1;
          this.$set(this.AuditForm, 'AuditState', '1')
        }
      }
    },
    AcceptForm: {
      handler(newval, old) {
        if (this.selectData) {
          if (this.selectData.ApplyReason) {
            if (this.selectData.ApplyReason.indexOf("21") == -1) {
              this.fgk = false;
            } else {
              this.fgk = true;
            }
            if (this.selectData.ApplyReason.indexOf("26") == -1)
              this.isSpecial = false;
            else {
              this.isSpecial = true;
            }
          }
        }
        this.where = `where VehicleID=${newval.VehicleID} and InspectionNum='${newval.InspectionNum}'`;
        if (this.isSpecial) this.getUploadLambdaLimit();
      }
    }
    // 是否为特殊车辆
  },

  methods: {
    // 获取特殊车辆的值
    async getUploadLambdaLimit() {
      if (this.AcceptForm.EACLU) {
        this.LambdaU = this.AcceptForm.EACLU;
        this.LambdaD = this.AcceptForm.EACLD;
        this.IsCheckHC = this.AcceptForm.IsCheckHC === 0 ? "否" : "是";
        this.IsUseIUEMANULambda = this.AcceptForm.IsUploadLambdaLimit
          ? "是"
          : "否";
        this.IsCheckOBD = this.AcceptForm.IsCheckOBD === 0 ? "否" : "是";
      } else {
        
        let res = await this.$curl.get("api/hj/getLambdaLimit", {param: JSON.stringify(this.where)});
        if (res.state) {
          if (res.data) {
            this.LambdaU = res.data.LambdaU
              ? res.data.LambdaU.toFixed(2)
              : "";
            this.LambdaD = res.data.LambdaD
              ? res.data.LambdaD.toFixed(2)
              : "";
            this.IsCheckHC = res.data.IsCheckHC ? "是" : "否";
            this.IsUseIUEMANULambda = res.data.IsUseIUEMANULambda
              ? "是"
              : "否";
            this.IsCheckOBD = "否";
          }
        }
      }
    },
    ApplyReasonName(CheckType, ApplyReason) {
      if (!ApplyReason || CheckType == "24") return;
      const _this = this;
      if (CheckType == "20" || CheckType == "31") {
        const arrs = ApplyReason.split(",");
        return arrs
          .map(t => {
            return _this.initform.cd_auditReason[t];
          })
          .join(",");
      } else if (CheckType == "10") {
        const arrs = ApplyReason.split(",");
        return arrs
          .map(t => {
            return _this.initform.cd_applyreason[t];
          })
          .join(",");
      } else {
        return ApplyReason;
      }
    },
    isShowInspect(ApplyReason) {
      if (ApplyReason && ApplyReason.indexOf("18") > -1) return true;
      return false;
    },
    handleTagClose(index) {
      this.AuditFastReply.splice(index,1);
      this.updateUserAuditFastReply();
    },
    clickTag(item) {
      this.AuditForm.Remarks = item;
    },
    getUserAuditFastReply() {
      this.$curl.get('api/hj/getUserAuditFastReply')
      .then(res => {
        if(res.code) {
          if(res.data.AuditFastReply && res.data.AuditFastReply.length > 0) {
            this.AuditFastReply = res.data.AuditFastReply;
          }
        }
      })
    },
    updateUserAuditFastReply() {
      this.$curl.post('api/hj/updateUserAuditFastReply',{
        AuditFastReply: this.AuditFastReply
      })
      .then(res => {
        if(res.code) {
        }
      })
    },
    addFastReply() {
      this.AuditFastReply.push(this.newFastReply)
      this.newFastReply = '';
      this.updateUserAuditFastReply();
    }
  },
  mounted() {
    this.getUserAuditFastReply();
    this.$nextTick(() => {
      if(this.AuditForm.AuditState == null && this.AuditForm.CheckType =='07') {
        this.$set(this.AuditForm, 'AuditState', '1')
      }
    })
  },
};
</script>
<style scoped>
fieldset[disabled] {
  -ms-pointer-events: none;
  pointer-events: none;
  cursor: not-allowed;
}
.audit-main .ivu-form-item {
  margin-bottom: 2px;
}

.audit-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
.feedback-box {
  display: inline-block;
}
.ivu-tag-text {
  cursor: pointer;
}
</style>
