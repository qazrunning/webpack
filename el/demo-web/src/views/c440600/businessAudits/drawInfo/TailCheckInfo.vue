//环检抽查审核-尾检抽查审核信息
<template>
  <div class="tailCheck-main">
    <Card>
      <p slot="title">尾检抽查审核信息</p>
      <Form ref="VehicleForm" label-position="right" :label-width="160">
        <fieldset v-bind:disabled="Status=='1'  || CheckStep=='2'" style="border:none;">
          <Row :gutter="32">
            <i-col :sm="8">
              <FormItem label="检测报告审核结果:">
                <RadioGroup v-model="TailCheckForm.InsReportAudit" @on-change="selectChange">
                  <Radio :label="item.CodeValue" v-for="(item,index) in AuditList" :key="index">
                    <span>{{item.CodeName}}</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
            <i-col :sm="16">
              <FormItem label="检测报告审核备注:">
                <Input type="text" v-model="TailCheckForm.InsReportAuditReason" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="32">
            <i-col :sm="8">
              <FormItem label="检测过程数据审核结果:">
                <RadioGroup v-model="TailCheckForm.InsProcessAudit" @on-change="selectChange">
                  <Radio :label="item.CodeValue" v-for="(item,index) in AuditList" :key="index">
                    <span>{{item.CodeName}}</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
            <i-col :sm="16">
              <FormItem label="检测过程数据审核备注:">
                <Input type="text" v-model="TailCheckForm.InsProcessAuditReason" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="32">
            <i-col :sm="8">
              <FormItem label="检测图片审核结果:">
                <RadioGroup v-model="TailCheckForm.InsImgAudit" @on-change="selectChange">
                  <Radio :label="item.CodeValue" v-for="(item,index) in AuditList" :key="index">
                    <span>{{item.CodeName}}</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
            <i-col :sm="16">
              <FormItem label="检测图片审核备注:">
                <Input type="text" v-model="TailCheckForm.InsImgAuditReason" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="32">
            <i-col :sm="8">
              <FormItem label="检测视频审核结果:">
                <RadioGroup v-model="TailCheckForm.InsVideoAudit" @on-change="selectChange">
                  <Radio :label="item.CodeValue" v-for="(item,index) in AuditList" :key="index">
                    <span>{{item.CodeName}}</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
            <i-col :sm="16">
              <FormItem label="检测视频审核备注:">
                <Input type="text" v-model="TailCheckForm.InsVideoAuditReason" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="32">
            <i-col :sm="8">
              <FormItem label="冒黑烟图片审核结果:">
                <RadioGroup v-model="TailCheckForm.InsBlackSmokeAudit" @on-change="selectChange">
                  <Radio :label="item.CodeValue" v-for="(item,index) in AuditList" :key="index">
                    <span>{{item.CodeName}}</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
            <i-col :sm="16">
              <FormItem label="冒黑烟图片审核备注:">
                <Input type="text" v-model="TailCheckForm.InsBlackSmokeAuditReason" />
              </FormItem>
            </i-col>
          </Row>
        </fieldset>
      </Form>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    TailCheckForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    CheckStep: {
      type: String,
      default: ""
    },
    Status: {
      type: String
    }
  },
  data() {
    return {
      AuditList: [
        { CodeValue: 1, CodeName: "通过" },
        { CodeValue: 2, CodeName: "不通过" }
      ]
    };
  },
  methods: {
    selectChange() {
      this.$emit("selectChange", "");
    }
  },
  mounted() {
    this.$nextTick(() => {
      if(this.Status == 0) {
        this.TailCheckForm.InsReportAudit = 1;
        this.TailCheckForm.InsProcessAudit = 1;
        this.TailCheckForm.InsImgAudit = 1;
        this.TailCheckForm.InsVideoAudit = 1;
        this.TailCheckForm.InsBlackSmokeAudit = 1;
      }
    })
    
  },
  watch: {
    'TailCheckForm.InspectionNum': function() {
      if(this.Status == 0) {
        this.TailCheckForm.InsReportAudit = 1;
        this.TailCheckForm.InsProcessAudit = 1;
        this.TailCheckForm.InsImgAudit = 1;
        this.TailCheckForm.InsVideoAudit = 1;
        this.TailCheckForm.InsBlackSmokeAudit = 1;
      }
    }
  }
};
</script>
<style scoped>
fieldset[disabled] {
  -ms-pointer-events: none;
  pointer-events: none;
  cursor: not-allowed;
}

.tailCheck-main .ivu-form-item {
  margin-bottom: 2px;
}

.tailCheck-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
</style>
