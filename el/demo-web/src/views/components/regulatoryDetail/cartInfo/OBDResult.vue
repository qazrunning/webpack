<template>
  <Card class="ODBResult-main" :bordered="false" style="height:300px;">
    <p slot="title">OBD结果</p>
    <div v-if="JSON.stringify(resData) != '{}'">
      <Form label-position="right" :label-width="100">
        <Row>
          <FormItem label="开始时间:">{{resData.OBDInspectStartTime | dataFormat("yyyy-MM-dd hh:mm:ss")}}</FormItem>
        </Row>
        <Row>
          <FormItem label="结束时间:">{{resData.OBDInspectEndTime | dataFormat("yyyy-MM-dd hh:mm:ss")}}</FormItem>
        </Row>
        <Row>
          <FormItem label="检测结果:" :style="{color:(resData.OBDInspectResult==1 ? '#009bff':'#f00')}">{{resData.OBDInspectResult == null ? '' : (resData.OBDInspectResult==1 ? '合格' : '不合格')}}</FormItem>
        </Row>
      </Form>
    </div>
    <div v-else style="text-align:center;">暂无数据</div>
  </Card>
</template>

<script>
export default {
  props: {
    InspectionNum: {
      type: String
    },
    OBDForm: {
      type: Object
    }
  },
  data() {
    return {
      resData: {}
    };
  },
  methods: {},
  watch: {
    OBDForm: {
      handler(newData) {
        this.resData = {};
        this.resData = newData;
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.ODBResult-main .ivu-form-item {
  margin-bottom: 0px;
  overflow: hidden;
}

.ODBResult-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
</style>
