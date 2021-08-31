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
          <i-col :sm="8">
            <FormItem label="申请人:">{{AuditForm.ApplyUserName}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="申请站点:">{{initform.cd_station[AuditForm.Applicant]}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="申请时间:">{{AuditForm.ApplyTime | dataFormat("yyyy-MM-dd hh:mm:ss")}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="申请原因:">
              <span style="color:#f00;">{{AuditForm.ApplyReason}}</span>
            </FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="审核结果:">
              {{AuditList[AuditForm.AuditState]}}
            </FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="审核备注:">
              {{AuditForm.Remarks}}
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    AuditForm: {
      type: Object
    },
    initform: {
      type: Object
    }
  },
  data() {
    return {
      AuditList: {
        "3": "自动通过" ,
        "1": "通过" ,
        "0": "不通过" 
      }
    };
  },
  methods: {
      
  }
};
</script>

<style>
</style>