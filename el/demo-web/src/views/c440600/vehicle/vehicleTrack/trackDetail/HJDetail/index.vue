<template>
  <div>
    <row  >
      <i-col :lg="16">
        <div class="video-box">
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
        </div>
          
      </i-col>
      <i-col :lg="8" >
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
    <Card :bordered="true">
      <p slot="title">报警信息</p>
      <Table :columns="colList" :data="tableData"></Table>
    </Card>
  </div>
</template>

<script>
// 测试视频
// let src =
//   "http://192.168.0.58:5018/BlackSmokeFiles/YDYdamo/3610020010220190720093148866_1_02_1.mp4";
import { getCDData } from "../../../../../../HJ/utils/utils";
export default {
  name: "HJDetail",
  props: {
    infoObj: {
      type: Object,
    },
  },
  data() {
    return {
      cddata: {},
      dataList: {},
      colList: [
        {
          title: "序号",
          type: "index",
          align: "center",
          minWidth: 50,
        },
        {
          title: "报警类型",
          align: "center",
          minWidth: 100,
          key: "AlarmType",
          render: (h, params) => {
            let result = "";
            if (typeof this.cddata.cd_alarmtype === "undefined") {
              return h("span", {}, result);
            }
            this.cddata.cd_alarmtype.forEach((item) => {
              if (item.CodeValue == params.row.AlarmType)
                result = item.CodeName;
            });
            return h("span", {}, result);
          },
        },
        {
          title: "报警内容",
          align: "left",
          minWidth: 300,
          key: "AlarmRecord",
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
          },
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
                      : " ",
                },
              },
              tmpStr
            );
          },
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
                      : " ",
                },
              },
              tmpStr
            );
          },
        },
        {
          title: "备注",
          align: "center",
          minWidth: 100,
          key: "Remark",
        },
        {
          title: "处理人",
          align: "center",
          minWidth: 100,
          key: "Handler",
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
          },
        },
      ],
      tableData: [],
    };
  },
  methods: {
    async init() {
      this.getCDData();
      this.getDetailData();
      this.getAlarmInfo();
    },
    async getDetailData() {
      const self = this;
      self.dataList = {};
      let params = {
        InspectionNum: this.infoObj.InspectionNum,
      };
      // console.log(this.infoObj.InspectionNum, "this is inspectionNUM");
      let res = await self.$curl.get("api/hj/hjVehicleTrackDetail", {
        params: JSON.stringify(params),
      });

      if (res.state === 1) {
        self.dataList = res.data;
        // 处理代理路径问题
        let PictureVideoProxyPath = null;
        let isVideoCenterEnd = null;
        for (let i = 0; i < res.config.length; i++) {
          let item = res.config[i];
          if (item.FieldKey === "PictureVideoProxyPath") {
            PictureVideoProxyPath = item.FieldValue;
          } else {
            isVideoCenterEnd = item.FieldValue;
          }
        }
        let videoUrl = "";
        if (isVideoCenterEnd === "true") {
          videoUrl = self.dataList.url;
        } else {
          videoUrl =
            self.dataList.ImageMediaUrl +
            self.dataList.url.toString().replace(PictureVideoProxyPath, "");
        }
        self.$set(self.dataList, "url", videoUrl);
      }
    },
    async getAlarmInfo() {
      const self = this;
      // 获取报警信息
      let params = {
        InspectionNum: this.infoObj.InspectionNum,
      };
      let res = await self.$curl.get("api/hj/getHJWarningInfo", {
        params: JSON.stringify(params),
      });
      if (res.state === 1) {
        self.tableData = res.result;
      }
    },
    // 根据cd表返回codename
    returncodename(cdList, code) {
      return this.$options.filters.returnCodeName(cdList, code);
    },

    //获取CD表
    async getCDData() {
      const _this = this;
      this.cddata = {};
      let cdname = [
        {
          tableName: "cd_alarmtype",
          where: "where IsAvailable=1"
        }
      ];
      if(this.$getDBTable){
        let cd_list = cdname.map(e => e.tableName)
        this.$getDBTable(cd_list).then(data =>{
          _this.cddata.cd_alarmtype = JSON.parse(data[0])

        })
      }
      else{
        getCDData(this,cdname).then(res => {
          const { data, state, msg } = res;
          if (state) {
            _this.cddata.cd_alarmtype = data[0]

          }
        });
      }
      console.log(_this.cddata);
    },
  },
  beforeMount() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.accept-main .ivu-form-item {
  margin-bottom: 2px;
 
  overflow: hidden;
}

.accept-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
.video-box{
  border: 2px solid #dcdee2;
  padding: 2px 3px 2px 3px;
  box-shadow: 2px 2px 2px #e8eaec;
}
</style>
