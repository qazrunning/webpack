<template>
  <div>
      <div style="overflow: auto; margin-bottom: 10px" v-if="!loading">
      <div v-if="showVehicleInfo != {}">
        <!-- 车辆信息 -->
        <Row type="flex" justify="center" align="top">
          <Col span="24" class="context-title-border">
            <span class="context-title">车辆信息</span>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="top">
          <Col span="24" class="context-inner">
            <span>
              车牌号码：
              <span :style="showVehicleInfo.VLPNColor">{{
                showVehicleInfo.hphm
              }}</span>
            </span>
          </Col>
          <!-- <Col span="12" class="context-inner">
            <span>
              车辆图片：
              <span class="img-warp">
                <viewer :images="handleImageUlr(1)">
                  <img
                    @error="onError($event)"
                    v-for="(src, index) in handleImageUlr(1)"
                    :src="src"
                    :key="index"
                    class="img-style"
                  />
                </viewer>
              </span>
            </span>
          </Col> -->
        </Row>

        <!-- ========检查结果 -->
        <Row type="flex" justify="center" align="top">
          <Col span="24" class="context-title-border">
            <span class="context-title"> 检查概览: </span>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="top">
          <Col span="12" class="context-inner">
            <span> 检查点名称：{{ showVehicleInfo.stationName }} </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              检查结果：{{showVehicleInfo.zjg}}
            </span>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="top">
          <Col span="24" class="context-inner">
            <span> 检查时间： {{ showVehicleInfo.jcjssj }} </span>
          </Col>
          <!-- <Col span="12" class="context-inner">
            <span>
              执法人员：
              <span
                v-for="(item, index) in showVehicleInfo.CheckUserCN"
                :key="index"
                class="checkName"
                >{{ item }}</span
              >
            </span>
          </Col> -->
        </Row>

        <!-- ========检查内容 -->
        <Row type="flex" justify="center" align="top">
          <Col span="24" class="context-title-border">
            <span class="context-title">检查内容</span>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="top">
          <Col span="12" class="context-inner">
            <span>
              排放检查：{{showVehicleInfo.pfjcjg}}
            </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              油品检查：{{showVehicleInfo.ypjcjg}}
            </span>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="top">
          <Col span="12" class="context-inner">
            <span>
              尿素检查：{{showVehicleInfo.nsjcjg}}
            </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              obd检测装置：{{showVehicleInfo.obdjcjg}}
            </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              折光率(20°C)：{{showVehicleInfo.zgl}}nD(20)
            </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              林格曼黑度：{{showVehicleInfo.lgmhd}}
            </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              光吸收系数：{{showVehicleInfo.gxsxs}}
            </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              油品S含量：{{showVehicleInfo.yplhl}}
            </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              尿素含量：{{showVehicleInfo.nshl}}
            </span>
          </Col>
          <Col span="12" class="context-inner">
            <span>
              是否罚款：{{showVehicleInfo.sffk}}
            </span>
          </Col>
        </Row>
      </div>

      <div v-else style="text-align: center; font-size: 16px">暂无数据</div>
    </div>
    <div v-else class="load">
      <Spin></Spin>
    </div>
  </div>
</template>

<script>
export default {
    name:'',
     props: {
      infoObj:{
            type: Object
        }
    },
  data() {
    return {
      loading: false,
      height: 0,
      errorImg: "static/img/imgError.png",
      showVehicleInfo: {}, // 展示信息
      checkerList: [], // 检查员工
      imgCDList: [], // 图片cd表
      vlpncolorCDList: [], // 车牌颜色cd表
      imageUrlList: [], // 图片列表
    };
  },
  computed: {
    seflModelInfo() {
      return this.modelInfo;
    },

    selfVLPN() {
      return this.VLPN;
    },
    selfVLPNColor() {
      return this.VLPNColor;
    },
  },
  methods: {
    // 获得cd表
    async getCDList() {
      let self = this;
      let imgResult = await self.$curl.get("/api/hj/getLJImageCDData");
      let vcolorResult = await self.$curl.get("/api/hj/getLJVLPNColorCDData");
      self.imgCDList = imgResult.data;
      self.vlpncolorCDList = vcolorResult.data;
    },
    async getLjDetailInfo() {
      let self = this;
      let param = {
        zj: this.infoObj.zj,
      };
      
      let res = await this.$curl.get("api/hj/getLJTrackDetail", {
        vehicleID: this.Vecid,
        param: JSON.stringify(param),
      });
      if (res.state == 1) {
        self.showVehicleInfo = res.data;
        // 设置车牌样式
        self.showVehicleInfo.VLPNColor = this.$options.filters.setVLPNColor(
          self.showVehicleInfo.hpys,
          this
        );
      }
    },
    // 处理图片加载失败
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    // 处理图片url
    handleImageUlr(type) {
      let self = this;
      let imagelist = [];
      if (self.showVehicleInfo == {}) return;
      self.imageUrlList.forEach((item) => {
        if (item.Type == type) {
          imagelist.push(item.Url);
        }
      });
      if (imagelist.length === 0) imagelist.push(self.errorImg);
      return imagelist;
    },
    async init() {
      this.loading = true;
      await this.getCDList();
      await this.getLjDetailInfo();
      this.loading = false;
    },
  },
  mounted() {
    this.init();
  },
}
</script>

<style lang="less" scoped>
.load {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.context-title {
  font-size: 18px;
  color: #17233d;
}
.context-title-border {
  border-bottom: 1px solid #e8eaec;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 10%;
  font-weight: bold;
}
.context-inner {
  font-size: 16px;
  color: #515a6e;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 10%;
}
.img-warp {
  display: inline-block;
  vertical-align: text-top;
}
.img-style {
  width: 130px;
  height: 73px;
}
</style>