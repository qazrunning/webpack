<template>
  <div class="audit-main">
    <div>
      <Form label-position="right" :label-width="100">
        <Card v-show="Boolean(editDate.InspectData.StationCode||editDate.InspectData.DetectEndTime||editDate.InspectData.VDCT)">
          <p slot="title">主检测信息</p>
          <div>
            <Row :gutter="32">
              <i-col :sm="8">
                <FormItem label="报告编号:">{{editDate.InspectData.InspectionReportNo}}</FormItem>
              </i-col>
              <i-col :sm="6">
                <FormItem label="检测站:">{{initform.cd_station[editDate.InspectData.StationCode]}}</FormItem>
              </i-col>
              <i-col :sm="6">
                <FormItem label="检测时间:">{{editDate.InspectData.DetectEndTime|dataFormat('yyyy-MM-dd hh:mm:ss')}}</FormItem>
              </i-col>
              <i-col :sm="4">
                <FormItem label="检测结果:">{{editDate.InspectData.VDCT==1?'合格':"不合格"}}</FormItem>
              </i-col>
            </Row>
          </div>
        </Card>
        <Card v-show="JSON.stringify(editDate.blackSmokeCar)!='{}'||JSON.stringify(editDate.specialAttentionVehicle)!='{}'||JSON.stringify(editDate.blackList)!='{}'||JSON.stringify(editDate.blackSmokeCarCapture)!='{}'">
          <p slot="title">检测数据审核</p>
          <div v-show="Boolean(editDate.blackSmokeCar.Reason||editDate.blackSmokeCar.InsertDate||editDate.blackSmokeCar.Operator)">
            <p style="font-weight:800">黑烟车检查</p>
            <Row :gutter="32">
              <i-col :sm="8">
                <FormItem label="加入原因:">{{editDate.blackSmokeCar.Reason}}</FormItem>
              </i-col>
              <i-col :sm="8">
                <FormItem label="操作用户:">{{editDate.blackSmokeCar.InsertDate}}</FormItem>
              </i-col>
              <i-col :sm="8">
                <FormItem label="加入时间:">{{editDate.blackSmokeCar.Operator}}</FormItem>
              </i-col>
            </Row>
          </div>
          <div v-show="Boolean(JSON.stringify(editDate.specialAttentionVehicle)!='{}' || editDate.specialAttentionVehicle.Reason||editDate.specialAttentionVehicle.Recorder||editDate.specialAttentionVehicle.RecordTime)">
            <p style="font-weight:800">重点关注车</p>
            <Row :gutter="32">
              <i-col :sm="8">
                <FormItem label="被关注的原因:">{{editDate.specialAttentionVehicle.Reason}}</FormItem>
              </i-col>
              <i-col :sm="8">
                <FormItem label="记录人:">{{editDate.specialAttentionVehicle.Recorder}}</FormItem>
              </i-col>
              <i-col :sm="8">
                <FormItem label="记录时间:">{{editDate.specialAttentionVehicle.RecordTime}}</FormItem>
              </i-col>
            </Row>
          </div>
          <div v-show="Boolean(JSON.stringify(editDate.blackList)!='{}' ||editDate.blackList.Reason||editDate.blackList.InsertDate||editDate.blackList.Operator||editDate.blackList.BLType)">
            <p style="font-weight:800">黑名单</p>
            <Row :gutter="32">
              <i-col :sm="8">
                <FormItem label="加入黑名单原因:">{{editDate.blackList.Reason}}</FormItem>
              </i-col>
              <i-col :sm="8">
                <FormItem label="加入黑名单时间:">{{editDate.blackList.InsertDate}}</FormItem>
              </i-col>
              <i-col :sm="8">
                <FormItem label="操作用户:">{{editDate.blackList.Operator}}</FormItem>
              </i-col>
            </Row>
          </div>
          <div v-show="Boolean(editDate.blackSmokeCarCapture.CheckResult||editDate.blackSmokeCarCapture.CheckDate||editDate.blackSmokeCarCapture.Checker)">
            <p style="font-weight:800">冒黑烟 <span style="cursor: pointer;color:#5cadff;margin-left:8px" @click="showModel">图片视频查看</span></p>
            <Row :gutter="32">
              <i-col :sm="8">
                <FormItem label="审核结果:">{{editDate.blackSmokeCarCapture.CheckResult}}</FormItem>
              </i-col>
              <i-col :sm="8">
                <FormItem label="审核时间:">{{editDate.blackSmokeCarCapture.CheckDate}}</FormItem>
              </i-col>
              <i-col :sm="8">
                <FormItem label="审核人:">{{editDate.blackSmokeCarCapture.Checker}}</FormItem>
              </i-col>
            </Row>
          </div>
           <div v-show="Boolean(JSON.stringify(editDate.blackSmokeCarCapture)!='{}')">
            <p style="font-weight:800">冒黑烟 <span style="cursor: pointer;color:#5cadff;margin-left:8px" @click="showModel">图片视频查看</span></p>
          </div>
        </Card>
      </Form>
    </div>

    <!-- 冒黑烟弹框 -->
    <Modal v-model="isShowBlackSmoke" width="660" draggable :transfer='false'>
      <p slot="header" class="fx__text_default"> 黑烟车视频图片查看</p>
      <blackSmokeCar1 :list="list" :imgList="imgList" :number="number"></blackSmokeCar1>
      <div slot="footer">
        <Button type="primary" @click="isShowBlackSmoke=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import blackSmokeCar1 from "./../../blackSmokeCar/blackSmokeCar1.vue";
export default {
  name: "DateEditCheck",
  props: {
    editDate: {
      type: Object
    },
    initform: {
      type: Object
    }
  },
  components: {
    blackSmokeCar1
  },
  data() {
    return {
      isShowBlackSmoke: false,
      list: [],
      imgList: [],
      number: {
        xxl: 24,
        xl: 24,
        lg: 24
      }
    };
  },
  methods: {
    showModel() {
      this.list = [];
      this.isShowBlackSmoke = true;
      this.list.push(this.editDate.blackSmokeCarCapture);
      this.imgList = this.editDate.imgList;
    }
  }
};
</script>

<style lang="less" scoped>
.audit-main .ivu-form-item {
  margin-bottom: 2px;
}

.audit-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
</style>