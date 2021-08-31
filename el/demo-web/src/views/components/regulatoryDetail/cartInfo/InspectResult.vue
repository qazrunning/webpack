<template>
  <Card :bordered="false" class="inspectResult-main" style="height:300px;">
    <div style="position:absolute;right:5px;top:5px;z-index:200">
      <Icon class="icons" title="跳转一车一档" type="md-car" size="22" @click="handleToVehicle" />
      <Icon class="icons" title="打印报告" type="ios-print" size="22" @click="onClickPrint" />
    </div>
    <!-- <Button
      @click="handleToVehicle"
      type="primary"
      size="small"
      v-show="tagsName == 'name1'"
      style="position:absolute;right:100px;top:5px;z-index:200"
    >
      <Icon type="ios-document-outline"></Icon>跳转一车一档
    </Button>
    <Button
      @click="onClickPrint"
      type="primary"
      size="small"
      v-show="tagsName == 'name1'"
      style="position:absolute;right:5px;top:5px;z-index:200"
    >
      <Icon type="ios-document-outline"></Icon>打印报告
    </Button>-->

    <Tabs size="small" :animated="false" :value="tagsName" @on-click="tabsChange">
      <TabPane label="检测结果列表" name="name1">
        <div v-if="JSON.stringify(InspectResultForm) != '{}'" style="height:258px;overflow:auto">
          <div v-show="isShow.showTSI">
            <table border="1" class="table">
              <tr>
                <td colspan="6">双怠速</td>
              </tr>
              <tr>
                <td rowspan="2"></td>
                <td rowspan="2">过量空气系数（λ）</td>
                <td colspan="2">低怠速</td>
                <td colspan="2">高怠速</td>
              </tr>
              <tr>
                <td>CO/%</td>
                <td>HC/10-6</td>
                <td>CO/%</td>
                <td>HC/10-6</td>
              </tr>
              <tr>
                <td>实测值</td>
                <td>{{ dataTSI.EACR | numFilter }}</td>
                <td>{{ dataTSI.LICOR | numFilter }}</td>
                <td>{{ dataTSI.LIHCR | numFilter }}</td>
                <td>{{ dataTSI.HICOR | numFilter }}</td>
                <td>{{ dataTSI.HIHCR | numFilter }}</td>
              </tr>
              <tr>
                <td>限值</td>
                <td>
                  {{
                  ((dataTSI.EACLD && dataTSI.EACLD.toFixed(2)) || "0.95") +
                  " ～ " +
                  ((dataTSI.EACLU && dataTSI.EACLU.toFixed(2)) || "1.05")
                  }}
                </td>
                <td>{{ dataTSI.LICOL | numFilter }}</td>
                <td>{{ dataTSI.LIHCL | numFilter }}</td>
                <td>{{ dataTSI.HICOL | numFilter }}</td>
                <td>{{ dataTSI.HIHCL | numFilter }}</td>
              </tr>
            </table>
          </div>

          <div v-show="isShow.showIM">
            <table border="1" class="table">
              <tr>
                <td colspan="6">简易瞬态工况法</td>
              </tr>
              <tr>
                <td></td>
                <td>HC/(g/km)</td>
                <td>CO/(g/km)</td>
                <td>NOX/(g/km)</td>
              </tr>
              <tr>
                <td>实测值</td>
                <td>{{ dataIM.HCER | numFilter }}</td>
                <td>{{ dataIM.COER | numFilter }}</td>
                <td>{{ dataIM.NOXER | numFilter }}</td>
              </tr>
              <tr>
                <td>限值</td>
                <td>{{ dataIM.HCEL | numFilter }}</td>
                <td>{{ dataIM.COEL | numFilter }}</td>
                <td>{{ dataIM.NOXEL | numFilter }}</td>
              </tr>
            </table>
          </div>

          <div v-show="isShow.showASM">
            <table border="1" class="table">
              <tr>
                <td colspan="7">稳态工况法</td>
              </tr>
              <tr>
                <td></td>
                <td colspan="3">ASM5025</td>
                <td colspan="3">ASM2540</td>
              </tr>
              <tr>
                <td></td>
                <td>HC/10-6</td>
                <td>CO/%</td>
                <td>NO/10-6</td>
                <td>HC/10-6</td>
                <td>CO/%</td>
                <td>NO/10-6</td>
              </tr>
              <tr>
                <td>实测值</td>
                <td>{{ dataASM.HCER5025 | numFilter }}</td>
                <td>{{ dataASM.COER5025 | numFilter }}</td>
                <td>{{ dataASM.NOER5025 | numFilter }}</td>
                <td>{{ dataASM.HCER2540 | numFilter }}</td>
                <td>{{ dataASM.COER2540 | numFilter }}</td>
                <td>{{ dataASM.NOER2540 | numFilter }}</td>
              </tr>
              <tr>
                <td>限值</td>
                <td>{{ dataASM.HCEL5025 | numFilter }}</td>
                <td>{{ dataASM.COEL5025 | numFilter }}</td>
                <td>{{ dataASM.NOEL5025 | numFilter }}</td>
                <td>{{ dataASM.HCEL2540 | numFilter }}</td>
                <td>{{ dataASM.COEL2540 | numFilter }}</td>
                <td>{{ dataASM.NOEL2540 | numFilter }}</td>
              </tr>
            </table>
          </div>

          <div v-show="isShow.showLightProofSmoke">
            <table border="1" class="table">
              <tr>
                <td colspan="5">自由加速法</td>
              </tr>
              <tr>
                <td colspan="3">三次测量烟度值/m-1</td>
                <td rowspan="2">平均值/m-1</td>
                <td rowspan="2">限值/m-1</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
              <tr>
                <td>{{ dataLightProofSmoke.ER1 | numFilter }}</td>
                <td>{{ dataLightProofSmoke.ER2 | numFilter }}</td>
                <td>{{ dataLightProofSmoke.ER3 | numFilter }}</td>
                <td>{{ dataLightProofSmoke.ERA | numFilter }}</td>
                <td>{{ dataLightProofSmoke.EL | numFilter }}</td>
              </tr>
            </table>
          </div>

          <div v-show="isShow.showLD">
            <table border="1" class="table">
              <tr>
                <td colspan="5">加载减速法</td>
              </tr>
              <tr>
                <td colspan="3">转速</td>
                <td colspan="2">最大轮边功率</td>
              </tr>
              <tr>
                <td>额定转速</td>
                <td colspan="2">实测（修正）VelMaxHP</td>
                <td>实测kW</td>
                <td>限值kW</td>
              </tr>
              <tr>
                <td>{{ InspectData.EngineRatedSpeed | numFilter }}</td>
                <td colspan="2">{{ dataLD.VelMaxEnginePower | numFilter }}</td>
                <td>{{ dataLD.MWP | numFilter }}</td>
                <td>{{ dataLD.MWPEL | numFilter }}</td>
              </tr>
              <tr>
                <td colspan="3">烟度</td>
                <td colspan="2">氮氧化物NOx</td>
              </tr>
              <tr>
                <td></td>
                <td>100%点</td>
                <td>80%点</td>
                <td></td>
                <td>80%点</td>
              </tr>
              <tr>
                <td>实测值</td>
                <td>{{ dataLD.ER100 | numFilter }}</td>
                <td>{{ dataLD.ER80 | numFilter }}</td>
                <td>实测值</td>
                <td>{{ dataLD.NOX80 | numFilter }}</td>
              </tr>
              <tr>
                <td>限值</td>
                <td>{{ dataLD.EL | numFilter }}</td>
                <td>{{ dataLD.EL | numFilter }}</td>
                <td>限值</td>
                <td>{{ dataLD.NOXEL | numFilter }}</td>
              </tr>
            </table>
          </div>

          <Form label-position="right" :label-width="100" class="formInfo">
            <Row>
              <i-col span="12">
                <FormItem label="开始时间:">
                  {{
                  InspectData.DetectStartTime
                  | dataFormat("yyyy-MM-dd hh:mm:ss")
                  }}
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="结束时间:">
                  {{
                  InspectData.DetectEndTime | dataFormat("yyyy-MM-dd hh:mm:ss")
                  }}
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="检测结果:" :style="{ color: InspectData.VDCT == 1 ? '#009bff' : '#f00' }">
                  {{
                  InspectData.VDCT == null
                  ? ""
                  : InspectData.VDCT == 1
                  ? "通过"
                  : "不通过"
                  }}
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div v-else style="text-align:center;">暂无数据</div>
      </TabPane>
      <TabPane label="图片信息" name="name2">
        <div v-if="ImgForm.length > 0" style="height:220px;overflow:auto">
          <viewer :images="ImgForm">
            <div v-for="(item, index) in ImgForm" :key="index" class="img_div">
              <!-- <img
                :src="
                  $hjconfig.isImageCenterEnd
                    ? ImageUrl + item.FullFileName
                    : ImageUrl +
                      item.FullFileName.toString().replace(proxyPath, '')
                "
                @error="onError($event)"
              />-->
              <img :src="ImageUrl + item.FullFileName" @error="onError($event)" />
            </div>
          </viewer>
        </div>
        <div v-else style="text-align:center;">暂无图片</div>
      </TabPane>
      <TabPane label="视频信息" name="name3">
        <div v-if="VideoForm.length > 0" style="height:220px;overflow:auto">
          <viewer :images="VideoForm">
            <div v-for="(item, index) in VideoForm" :key="index" style="margin:5px;">
              <video :src="VideoUrl + item.FullFileName" style="display: block;width:100%;height:230px;" controls="controls"></video>
            </div>
          </viewer>
        </div>
        <div v-else style="text-align:center;">暂无视频</div>
      </TabPane>
    </Tabs>

    <!-- 报告内容 -->
    <Modal width="880" v-model="showModel">
      <printContent :giveReport="giveReport" ref="reportCont"></printContent>
      <div slot="footer">
        <Button type="success" size="large" long @click="printStart">打印</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
const printContent = () =>
  import("../../../c440600/vehicle/printContent");
export default {
  props: {
    InspectResultForm: {
      default: () => [],
    },
    IUTYPE: {
      type: String,
    },
    StationCode: {
      type: String,
    },
    InspectionNum: {
      type: String,
    },
    Vecid: {
      type: Number,
    },
  },
  data() {
    return {
      proxyPath: "", //图片视频代理路径
      tagsName: "name1",
      showModel: false, //是否展示打印窗口
      showAsmType: false, //是否显示工况类型
      isShow: {
        showTSI: false,
        showASM: false,
        showIM: false,
        showLD: false,
        showLightProofSmoke: false,
      },
      dataTSI: {},
      dataASM: {},
      dataIM: {},
      dataLD: {},
      dataLightProofSmoke: {},
      ImageUrl: "",
      VideoUrl: "",
      InspectResultData: {},
      InspectData: {},
      ImgForm: [],
      VideoForm: [],
      giveReport: {},
      isLDUseVelMaxHP: false,
    };
  },
  filters: {
    numFilter(value) {
      if (value == null) {
        return "-";
      } else if (value == 0 || !value) {
        return value;
      } else {
        // 截取当前数据到小数点后两位
        let realVal = Number(value).toFixed(2);
        return realVal;
      }
    },
  },
  methods: {
    async getProxyPath() {
      let res = await this.$curl.get("api/hj/getProxyPath");
      this.proxyPath = res.PictureVideoProxyPath;
      this.proxyPath = this.proxyPath.split(",");
    },
    handleToVehicle() {
      this.$router.push({
        name: "hj-home-vehicle",
        params: { VehicleId: this.Vecid },
      });
    },
    tabsChange(value) {
      this.tagsName = value;
      if (value != "name1") {
        this.getImgList();
      }
    },
    //打印
    printStart() {
      this.showModel = false;
      this.$refs.reportCont.print_stat();
    },
    onClickPrint() {
      if (!this.giveReport.InspectionNum) return;
      this.showModel = true;
      this.$nextTick(() => {
        this.$refs.reportCont.printaction();
      });
    },
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    selTemplate() {
      //显示类型
      this.isShow = {
        showTSI: false,
        showASM: false,
        showIM: false,
        showLD: false,
        showLightProofSmoke: false,
      };
      this.dataTSI = {};
      this.dataASM = {};
      this.dataIM = {};
      this.dataLightProofSmoke = {};
      this.dataLD = {};
      if (this.InspectResultForm.length > 1) {

        this.InspectResultForm.forEach((item) => {
          if (item.data==null) return;
          switch (item.IUTYPE) {
            case "A":
              this.isShow.showTSI = true;
              this.dataTSI = item.data;
              break;
            case "B":
              this.showAsmType = true;
              this.isShow.showASM = true;
              this.dataASM = item.data;
              break;
            case "C":
              this.isShow.showIM = true;
              this.dataIM = item.data;
              break;
            case "F":
              this.isShow.showLightProofSmoke = true;
              this.dataLightProofSmoke = item.data;
              break;
            case "G":
              this.isShow.showLD = true;
              this.dataLD = item.data;
              break;
          }
        });
      } else if (this.InspectResultForm[0]&&this.InspectResultForm[0].data!=null) {
        switch (this.IUTYPE) {
          case "A":
            this.isShow.showTSI = true;
            this.dataTSI = this.InspectResultForm[0].data;
            break;
          case "B":
            this.showAsmType = true;
            this.isShow.showASM = true;
            this.dataASM = this.InspectResultForm[0].data;
            break;
          case "C":
            this.isShow.showIM = true;
            this.dataIM = this.InspectResultForm[0].data;
            break;
          case "F":
            this.isShow.showLightProofSmoke = true;
            this.dataLightProofSmoke = this.InspectResultForm[0].data;
            break;
          case "G":
            this.isShow.showLD = true;
            this.dataLD = this.InspectResultForm[0].data;
            break;
        }
      }
    },
     sendInspecdata() {
      const params = {
        isShow: this.isShow,
        dataTSI: this.dataTSI,
        dataASM: this.dataASM,
        dataIM: this.dataIM,
        dataLightProofSmoke: this.dataLightProofSmoke,
        dataLD: this.dataLD,
        InspectData:this.InspectData
      }
      this.$emit('getInsData', params)
    },
    async getDetailData() {
      const self = this;
      let res = await this.$curl.get("api/hj/getSysConfig", {
        params: { FieldKey: ["IsLDUseVelMaxHP"] },
      });
      if (res.state && res.data)
        this.isLDUseVelMaxHP = res.data[0].FieldValue == "true" ? true : false;
      // this.InspectResultData = newData;
      if (self.isLDUseVelMaxHP) {
        self.dataLD.VelMaxEnginePower =
          self.dataLD.VelMaxHP == null
            ? self.dataLD.RotateSpeed == null
              ? "-"
              : Number(self.dataLD.RotateSpeed).toFixed(2)
            : Number(self.dataLD.VelMaxHP).toFixed(2);
      } else {
        self.dataLD.VelMaxEnginePower =
          self.dataLD.VelMaxEnginePower == null
            ? self.dataLD.RotateSpeed == null
              ? "-"
              : Number(self.dataLD.RotateSpeed).toFixed(2)
            : Number(self.dataLD.VelMaxEnginePower).toFixed(2);
      }
    },
    async getImgList() {
      const param = {
        StationCode:
          this.StationCode || this.InspectResultForm[0].data.StationCode,
        InspectionNum:
          this.InspectionNum || this.InspectResultForm[0].InspectionNum,
        isImageCenterEnd: this.$hjconfig.isImageCenterEnd,
        isVideoCenterEnd: this.$hjconfig.isVideoCenterEnd,
      };
      let resData = await this.$curl.get("api/hj/getSelStationInfo", {
        param: JSON.stringify(param),
      });
      if (resData.state) {
        this.ImageUrl = resData.data.ImageUrl;
        this.VideoUrl = resData.data.VideoUrl;
        this.ImgForm = resData.data.Img_Video_List.filter(
          (item) => item.FileExtension == ".jpg"
        );
        this.VideoForm = resData.data.Img_Video_List.filter(
          (item) => item.FileExtension == ".mp4"
        );
        if (!this.$hjconfig.isImageCenterEnd) {
          this.ImgForm.forEach((v) => {
            this.proxyPath.forEach((k) => {
              if (v.FullFileName.toString().indexOf(k) !== -1) {
                v.FullFileName = v.FullFileName.toString().replace(k, "");
              }
            });
          });
        }
        if (!this.$hjconfig.isVideoCenterEnd) {
          this.VideoForm.forEach((v) => {
            this.proxyPath.forEach((k) => {
              if (v.FullFileName.toString().indexOf(k) !== -1) {
                v.FullFileName = v.FullFileName.toString().replace(k, "");
              }
            });
          });
        }
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取图片视频列表失败!",
        });
      }
    },

    async getInspectData() {
      let resData = await this.$curl.get("api/hj/getInspectData", {
        InspectionNum: this.InspectionNum,
      });
      if (resData.state) {
        if (resData.InspectData) {
          this.giveReport = {
            InspectionDataID: resData.InspectData.InspectionDataID,
            VehicleID: resData.InspectData.VehicleID,
            IUTYPE: resData.InspectData.IUTYPE,
            InspectionNum: resData.InspectData.InspectionNum,
            VDCT: resData.InspectData.VDCT,
          };

          // this.Vecid = resData.InspectData.VehicleID;
          this.InspectData = resData.InspectData;

        }
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取检测信息失败!",
        });
      }
this.sendInspecdata();
    },
  },
  components: {
    printContent,
  },
  mounted() {
    this.getProxyPath();
  },
  watch: {
    InspectResultForm: {
      handler(newData) {
        this.InspectResultData = {};
        this.InspectData = {};
        this.ImgForm = [];
        this.VideoForm = [];
        this.giveReport = {};
        if (JSON.stringify(newData) == "[]") return;
        // console.log('>>>>>>>>>>>>>>>>',newData);
        this.selTemplate();
        this.getDetailData();
        this.getInspectData();
        this.tabsChange(this.tagsName);
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.inspectResult-main .ivu-form-item {
  margin-bottom: 0px;
  overflow: hidden;
}

.inspectResult-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}

.formInfo /deep/ .ivu-form-item-content {
  line-height: 3 !important;
}
</style>
<style lang="less" scoped>
table {
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}

table td,
table th {
  border: 1px solid #e8eaec;
  height: 24px;
  font-size: 12px;
}
table td {
  padding: 0px;
}

table thead th {
  background-color: #e8eaec;
  width: 100px;
}

/* table tr:nth-child(odd) {
  background: #fff;
} */

.img_div {
  display: inline-block;
  margin: 5px;
}

.img_div img {
  display: block;
  width: 140px;
  height: 100px;
}
.icons {
  margin-right: 8px;
  margin-top: 2px;
  cursor: pointer;
  &:hover {
    color: aquamarine;
  }
}
</style>
