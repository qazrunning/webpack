<template>
  <div>
    <row>
      <i-col :lg="16">
        <video
          ishivideo="true"
          width="100%"
          height="428"
          autoplay="true"
          controls="true"
          autohide="false"
          loop="loop"
          hivideoid="hivideo"
          :src="dataList.url"
        ></video>
      </i-col>
      <i-col :lg="8">
        <Card class="accept-main" :bordered="true">
          <p slot="title">检测信息</p>
          <div>
            <Form label-position="right" :label-width="100">
              <Row>
                <FormItem label="车牌号:">{{ dataList.VLPN }}</FormItem>
              </Row>
              <Row>
                <FormItem label="受理编码:">{{
                  dataList.InspectionNum
                }}</FormItem>
              </Row>
              <Row>
                <FormItem label="车架号:">{{ dataList.VIN }}</FormItem>
              </Row>
              <Row>
                <FormItem label="检测站名称:">{{
                  dataList.StationShortName
                }}</FormItem>
              </Row>
              <Row>
                <FormItem label="检测时间:">{{
                  dataList.DetectEndTime | dataFormat("yyyy-MM-dd hh:mm:ss")
                }}</FormItem>
              </Row>
              <Row>
                <FormItem label="检测方法:">{{ dataList.IUTYPE }}</FormItem>
              </Row>
              <Row>
                <FormItem label="检测方式:">{{
                  dataList.InspectionNature
                }}</FormItem>
              </Row>
              <Row>
                <FormItem label="OBD检测结果:">{{
                  dataList.obd != null
                    ? dataList.obd == 1
                      ? "合格"
                      : "不合格"
                    : ""
                }}</FormItem>
              </Row>
              <Row>
                <FormItem label="外观检检测结果:">{{
                  dataList.IsExtCheck
                }}</FormItem>
              </Row>
              <Row>
                <FormItem label="检测结果:">{{
                  dataList.NewVDCT == 1 ? "合格" : "不合格"
                }}</FormItem>
              </Row>
            </Form>
          </div>
        </Card>
      </i-col>
    </row>
  </div>
</template>
<script>
import {} from "../../../../HJ/utils/utils";
//测试视频
//src="http://192.168.0.58:5018/BlackSmokeFiles/YDYdamo/3610020010220190720093148866_1_02_1.mp4"
export default {
  data() {
    return {
      dataList: {},
      proxyPath: "", //图片视频代理路径
    };
  },
  props: {
    InspectionNum: { type: String },
  },
  methods: {
    async getProxyPath() {
      let res = await this.$curl.get("api/hj/getProxyPath");
      this.proxyPath = res.PictureVideoProxyPath;
      this.proxyPath = this.proxyPath.split(",");
    },
    returncodename(namelist, codevalue) {
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName;
      });
      return CodeName;
    },
    async getDetailData() {
      const self = this;
      self.dataList = {};
      await self.$curl
        .get("api/hj/exhaustModel", { InspectionNum: self.InspectionNum })
        .then((res) => {
          self.dataList = res.data;
          if (JSON.stringify(self.dataList) != "{}") {
            // let videoUrl = self.$hjconfig.isVideoCenterEnd
            //   ? self.dataList.url
            //   : self.dataList.ImageMediaUrl +
            //   self.dataList.url.toString().replace(proxyPath, "");
            if (!self.$hjconfig.isVideoCenterEnd) {
              this.proxyPath.forEach((k) => {
                if (self.dataList.url.toString().indexOf(k) !== -1) {
                  self.dataList.url = self.dataList.ImageMediaUrl + self.dataList.url.toString().replace(k, "");
                }
              });
            }
            let videoUrl = self.dataList.url;
            self.$set(self.dataList, "url", videoUrl);
          }
        });
    },
  },
  mounted() {
    this.getProxyPath();
  },
  watch: {
    InspectionNum: {
      handler(newData) {
        if (!newData) return;
        this.getDetailData();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.accept-main .ivu-form-item {
  margin-bottom: 2px;
  overflow: hidden;
}

.accept-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
</style>
