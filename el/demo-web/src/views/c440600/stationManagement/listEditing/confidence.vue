<template>
  <div>
    <Card
      :padding="0"
      :lg="24"
      class="card_main"
    >
      <div
        slot="title"
        style="font-size: 14px;font-weight:700;display:flex;justify-content:space-between;"
      >
        <span>数据可疑性分析</span>
        <span @click="toConfidentDetail()" style="font-weight:400;color:rgb(25, 163, 232);cursor:pointer">更多>></span>
      </div>
      <Row>
        <Col
          span="6"
          v-for="(item, index) in curStationConfidence"
          class='item'
          :key="index"
          :ref="`data${index}`
          "
        >
        <!-- 标题 -->
        <div class="header">
          <span class="fx__text_default">— {{item.title}}本站点置信度 —</span>
        </div>
        <!-- 内容 -->
        <div
          class="content"
          v-if="item.statisticData.length"
        >
          <div
            class="card"
            v-for="station in item.statisticData"
            :key="station.StationCode"
          >
            <station-analysis-card
              :StationData="station"
              :isMonth="countBase"
              :CDData="initform"
            ></station-analysis-card>
          </div>
        </div>
        <div
          class="noData"
          v-else
        >暂无数据</div>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import stationAnalysisCard from "../Model/stationAnalysisCard"
export default {
  props: {
    curStationConfidence: {
      type: Array,
      default: [],
    },
    countBase: {
      type: String,
      default: ''
    },
    initform: {
      type: Object,
      default: () => { }
    },
    StationCode: {
      type: String,
      default: ''
    },
    activeStep: {
      type: Number,
      default: 0,
    },
    curIndex: {
      type: Number,
      default: 0,
    },
  },
  components: {
    stationAnalysisCard
  },
  data() {
    return {
      opera: "",
      lineTypes: [], //线类型
      JCXmodal: false, //弹窗model
      selData: {}, //选中的列
      selTabs: 0, //选中的tabs页
      resData: [], //数据源
      cdLineList: [],
      columns_data: [
        {
          title: "序号",
          type: "index",
          minWidth: 50,
          align: "center",
        },
        {
          title: "检测线编号",
          key: "SceneCode",
          align: "center",
          minWidth: 120,
          sortable: true,
        },
        {
          title: "线类型",
          render: (h, params) => {
            let name = "";
            this.cdLineList.forEach((d) => {
              if (d.value == params.row.SceneCode) name = d.LineType;
              if (name) {
                this.lineTypes.forEach((l) => {
                  if (l.CodeValue == name) name = l.CodeName;
                });
              }
            });
            return h("span", {}, name);
          },
          align: "center",
          minWidth: 120,
        },
        {
          title: "设备名称",
          key: "Name",
          ellipsis: true,
          tooltip: true,
          minWidth: 100,
          align: "center",
        },
        {
          title: "状态",
          key: "Status",
          align: "center",
          minWidth: 100,
          sortable: true,
        },
        {
          title: "设备认证编号",
          key: "IEAC",
          minWidth: 200,
          align: "center",
        },
        {
          title: "标定有效期",
          key: "CalValidityPeriod",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            let date = this.$options.filters.dataFormat(
              params.row.CalValidityPeriod,
              "yyyy-MM-dd"
            );
            let nowDate = this.$options.filters.dataFormat(
              new Date(),
              "yyyy-MM-dd"
            );
            let date2 = moment(nowDate); //现在时间
            let date1 = moment(date); //标定有效期
            let dateCount = date1.diff(date2, "days");
            if (dateCount > 30) return h("div", date);
            else if (dateCount >= 0)
              return h("div", { style: { color: "orange" } }, date);
            else return h("div", { style: { color: "red" } }, date);
          },
        },
        {
          title: "操作",
          slot: "action",
          width: 160,
          align: "center",
          minWidth: 100,
        },
      ],
      isOpenAudit: false,
    };
  },
  methods: {
    toConfidentDetail(){
      this.$router.push({ name: "hj-home-dataAnalysis", params: { StationCode: this.StationCode } })
    }
  },

};
</script>

<style lang="scss" scoped>
::v-deep .ivu-card {
  font-size: 12px;
}

.item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 25px;
    line-height: 50px;
    font-weight: 700;
    text-align: center;
    // padding-right: 130px;
    span {
      font-size: 14px;
    }
  }
  .content {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
    .card {
      height: 270px;
      width: 290px;
      margin: 18px;
      overflow: hidden;
    }
  }
}
</style>