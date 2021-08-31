//过程监管-检测过程数据
<template>
  <div>
    <Card v-resize="resize" :bordered="false" style="position:relative;">
    <div style="position:absolute;right:5px;top:5px;z-index:200">
      <!-- <Button type="primary" size="small" v-show="showDetailChart">
        <Icon type="ios-trending-up" /> 单因素分析图
      </Button> -->
      <!-- <Button
        @click="handleDetail"
        type="primary"
        size="small"
        style="margin-right:5px"
      >
        <Icon type="ios-document-outline"></Icon>查看详情
      </Button>     
      <Button
        @click="exportExcel"
        type="primary"
        size="small"
        v-show="tagsName == 'name2' && resData.length > 0"
      >
        <Icon type="ios-download-outline"></Icon>导出
      </Button> -->
      <Icon
        class="icons"
        @click="handleDetail"
        title="查看详情"
        type="md-search"
        size="22"
      />
      <Icon
        class="icons"
        @click="exportExcel"
        title="导出"
        v-show="tagsName == 'name1' && resData.length > 0"
        type="ios-cloud-download"
        size="22"
      />
    </div>
    <Tabs
      size="small"
      :animated="false"
      v-model="tagsName"
      style="overflow:visible"
      @on-click='loadComponments(tagsName)'
    >
      <TabPane label="检测过程数据列表" name="name1">
        <Table
          ref="table"
          :loading="loading"
          :columns="columns"
          :data="resData"
          :height="height"
        ></Table>
      </TabPane>
      <TabPane label="检测过程数据图表" name="name2">
        <div
          v-show="resData.length > 0"
          style="height:245px"
          ref="Inspect_div"
          v-resize="resize"
        ></div>
        <div
          v-show="resData.length == 0"
          style="height:245px;text-align:center;"
        >
          暂无数据
        </div>
      </TabPane>
      <TabPane label="单因素分析图" name="name3" >
        <div
          v-show="resData.length > 0"
          style="height:245px;overflow:auto"
          v-resize="resize"
        >
        <component
          :is="currentChartComp"
          :IUTYPE="IUTYPE"
          :ProcessData="InspectProcessForm"
          :processResultHeight="0"
          :isInspectProcessInfo='1'
        ></component>
        </div>
        <div
          v-show="resData.length == 0"
          style="height:245px;text-align:center;"
        >
          暂无数据
        </div>
      </TabPane>
      
    </Tabs>
    
  </Card>
  <Modal
      v-model="showModal"
      :title="VLPN + '-' + curMethods"
      :footer-hide='true'
      :fullscreen ='true'
      :transfer='true'
      class='modalclass'
    >
      <div style="height:100%" ref="modal">
        <Button type="success" style="position:absolute;top:8px;right:30px;z-index:200" @click="exportExcel">导出</Button>
        <Tabs
          size="small"
          :animated="false"
          v-model="tagsName"
          style="height:100%;overflow:visible"
          @on-click='loadComponments(tagsName)'
        >

          <TabPane label="检测过程数据列表" name="name1">
            <Table
              ref="table"
              :loading="loading"
              :columns="columns"
              :data="resData"
              :height="allHeight"
            ></Table>
          </TabPane>
          <TabPane label="检测过程数据图表" name="name2" style="height:100%">
            <div
              v-show="resData.length > 0"
              :style="{ height: allHeight + 'px' }"
              ref="Inspect_div1"
              v-resize="resize"
            >
            </div>
            <!-- :style="{ height: scrollerHeight }" -->
            <div
              v-show="resData.length == 0"
              style="height:500px;text-align:center"
            >
              暂无数据
            </div>
          </TabPane>
          <TabPane label="单因素分析图" name="name3" >
            <div
              v-show="resData.length > 0"
              :style="{ height: allHeight + 'px' }"
              style="overflow:auto"
              v-resize="resize"
            >
            <component
              :is="currentChartComp"
              :IUTYPE="IUTYPE"
              :ProcessData="InspectProcessForm"
              :processResultHeight="0"
              :isInspectProcessInfo='1'
            ></component>
            </div>
            <div
              v-show="resData.length == 0"
              style="height:245px;text-align:center;"
            >
              暂无数据
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  </div>
  
</template>

<script>
import { isNull } from "util";
import { export_json_to_excel } from "../../../../excel/Export2Excel";
import { formatDates } from "../../../utils/utils";
export default {
  props: {
    InspectionNum: {
      type: String,
    },
    IUTYPE: {
      type: String,
      default: "",
    },
    InspectProcessForm: {
      type: Array,
    },
    initForm: {
      type: Object,
    },
    VLPN: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentChartComp: "",
      allHeight: 0,
      curMethods: "",
      showModal: false,
      Inspect_div: null,
      Inspect_div1: null,
      tagsName: "name1",
      height: 250,
      loading: false,
      resData: [],
      columns: [],
      initFormNew: {
        cd_asm_gklx_new: {
          "0": "检验准备",
          "1": "5025加速过程",
          "2": "5025快速工况过程",
          "3": "5025工况过程",
          "4": "2540加速过程",
          "5": "2540快速工况过程",
          "6": "2540工况过程",
          "7": "减速过程",
        },
        cd_ld_gklx_new: {
          "0": "功率扫描中",
          "1": "恢复到100%VelMaxHP过程",
          "2": "100%VelMaxHP点检验过程",
          "3": "恢复到80%VelMaxHP过",
          "4": "80%VelMaxHP点检验过程",
          "5": "减载停车",
        },
        cd_im_gklx_new: {
          "0": "检验准备",
          "1": "怠速过程",
          "2": "加速过程",
          "3": "等速过程",
          "4": "减速过程",
        },
      },
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      // showDetailChart: true,
    };
  },
  methods: {
    getheight() {
      this.allHeight = document.body.clientHeight - 120;
    },
    handleDetail() {
      this.showModal = true;
    },
    getTwoTimeList(beginTime, endTime) {
      let intervaltime =
        (new Date(endTime).getTime() - new Date(beginTime).getTime()) / 1000;
      let timeList = [];
      for (let i = 0; i < intervaltime + 1; i++) {
        let time = new Date(beginTime).getTime() + i * 1000;
        timeList.push(time);
      }
      return timeList.map(function(item, index, input) {
        let date = new Date(item);
        // 这里的 - 可以按照需要改为 /. 等等其他符号
        return date
          .toJSON()
          .substr(11, 19)
          .replace("T", " ")
          .replace(/-/g, "-");
      });
    },
    resize() {
      if (this.Inspect_div) this.Inspect_div.resize();
      if (this.Inspect_div1) this.Inspect_div1.resize();
    },
    //小数点后两位
    toFlostTwo(value) {
      if (value == null) return "";
      if (value == 0.001) return value;
      value = Number(value).toFixed(2);
      return value;
    },
    exportExcel() {
      require.ensure([], () => {
        const tHeader = this.columns.map((v) => v.title); // 上面设置Excel的表格第一行的标题
        const filterVal = this.columns.map((v) => v.key); // 上面的index、nickName、name是tableData里对象的属
        const list = JSON.parse(JSON.stringify(this.resData)); //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(
          tHeader,
          data,
          this.VLPN + "尾气检测过程数据" + formatDates(new Date(), "yyyyMMdd")
        );
      });
    },
    formatJson(filterVal, jsonData) {
      const self = this;
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if ((j == "gklx" || j == "GKLX") && self.IUTYPE == "A") {
            v[j] = self.initForm.cd_tsi_gklx[v[j]];
          } else if ((j == "gklx" || j == "GKLX") && self.IUTYPE == "G") {
            v[j] = self.initFormNew.cd_ld_gklx_new[v[j]];
          } else if ((j == "gklx" || j == "GKLX") && self.IUTYPE == "B") {
            v[j] = self.initFormNew.cd_asm_gklx_new[v[j]];
          } else if ((j == "gklx" || j == "GKLX") && self.IUTYPE == "F") {
            v[j] = "第" + v[j] + "次";
          } else if ((j == "gklx" || j == "GKLX") && self.IUTYPE == "C") {
            v[j] = self.initFormNew.cd_im_gklx_new[v[j]];
          }
          return v[j];
        })
      );
    },
    loadComponments(e) {
      if(e!='name3'){
        return
      }
      console.log("加载组件", this.IUTYPE);
      
      switch (this.IUTYPE) {
        case "B":
          this.currentChartComp = () =>
            import("../../../c440600/processSupervise/processDataChart/chart_b.vue");
          break;
        case "G":
          this.currentChartComp = () =>
            import("../../../c440600/processSupervise/processDataChart/chart_g.vue");
          break;
        case "A":
          this.currentChartComp = () =>
            import("../../../c440600/processSupervise/processDataChart/chart_a.vue");
          break;
        case "F":
          this.currentChartComp = () =>
            import("../../../c440600/processSupervise/processDataChart/chart_f.vue");
          break;
        case "C":
          this.currentChartComp = () =>
            import("../../../c440600/processSupervise/processDataChart/chart_c.vue");
          break;
      }
    },
    //过滤数据
    returncodename(namelist, codevalue) {
      if (namelist.length == 0) return codevalue;
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName;
      });
      return CodeName;
    },
    // async getDetailData() {
    //   this.resData = [];
    //   const param = {
    //     InspectionNum: this.InspectionNum,
    //     InspectionMethod: this.IUTYPE
    //   };

    //   let InspectProcess = await this.$curl.get("api/hj/getInspectProcess", {
    //     param: JSON.stringify(param)
    //   });
    //   if (!InspectProcess.data) return;
    //   this.resData = InspectProcess.data;

    //   this.judgeType();
    // },
    ASM_column() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 60,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 155,
          key: "ProcessTime",
          render: (h, params) => {
            return h(
              "span",
              formatDates(params.row.ProcessTime, "yyyy-MM-dd hh:mm:ss")
            );
          },
        },
        {
          title: "工况类型",
          minWidth: 130,
          key: "gklx",
          render: (h, params) => {
            const Name =
              _this.initFormNew.cd_asm_gklx_new[
                params.row.gklx || params.row.GKLX
              ];
            return h("span", {}, Name);
          },
        },
        {
          title: "车速(km/h)",
          minWidth: 100,
          key: "Flow_Speed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_Speed)
              ? _this.toFlostTwo(params.row.LineSpeed)
              : _this.toFlostTwo(params.row.Flow_Speed);
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 130,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_RotateSpeed)
              ? _this.toFlostTwo(params.row.RotateSpeed)
              : _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "逐秒HC浓度值(修正后)(10-6vol)",
          minWidth: 140,
          key: "Flow_HCCorrect",
          render: (h, params) => {
            const Flow_HCCorrect = _this.toFlostTwo(params.row.Flow_HCCorrect);
            return h("span", {}, Flow_HCCorrect);
          },
        },
        {
          title: "逐秒CO浓度值(修正后)(%vol)",
          minWidth: 140,
          key: "Flow_COCorrect",
          render: (h, params) => {
            const Flow_COCorrect = _this.toFlostTwo(params.row.Flow_COCorrect);
            return h("span", {}, Flow_COCorrect);
          },
        },
        {
          title: "逐秒NO浓度值(修正后)(10-6vol)",
          minWidth: 140,
          key: "Flow_NOCorrect",
          render: (h, params) => {
            const Flow_NOCorrect = _this.toFlostTwo(params.row.Flow_NOCorrect);
            return h("span", {}, Flow_NOCorrect);
          },
        },
        {
          title: "逐秒底盘测功机负载（kg）",
          minWidth: 115,
          key: "Flow_Freeweight",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_Freeweight);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 90,
          key: "Flow_HC",
          render: (h, params) => {
            const Flow_HC = _this.toFlostTwo(params.row.Flow_HC);
            return h("span", {}, Flow_HC);
          },
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 90,
          key: "Flow_CO",
          render: (h, params) => {
            const Flow_CO = _this.toFlostTwo(params.row.Flow_CO);
            return h("span", {}, Flow_CO);
          },
        },
        {
          title: "测试工况NO(10-6vol)",
          minWidth: 90,
          key: "Flow_NO",
          render: (h, params) => {
            const Flow_NO = _this.toFlostTwo(params.row.Flow_NO);
            return h("span", {}, Flow_NO);
          },
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 95,
          key: "Flow_CO2",
          render: (h, params) => {
            const Flow_CO2 = _this.toFlostTwo(params.row.Flow_CO2);
            return h("span", {}, Flow_CO2);
          },
        },
        {
          title: "测试工况O2(%vol)",
          minWidth: 90,
          key: "Flow_O2",
          render: (h, params) => {
            const Flow_O2 = _this.toFlostTwo(params.row.Flow_O2);
            return h("span", {}, Flow_O2);
          },
        },
        {
          title: "逐秒计算的λ值",
          minWidth: 110,
          key: "Flow_Lambda",
          render: (h, params) => {
            const Flow_Lambda = _this.toFlostTwo(params.row.Flow_Lambda);
            return h("span", {}, Flow_Lambda);
          },
        },
        {
          title: "NO湿度修正系数",
          minWidth: 115,
          key: "NOHumidityCorrect",
          render: (h, params) => {
            const NOHumidityCorrect = _this.toFlostTwo(
              params.row.NOHumidityCorrect
            );
            return h("span", {}, NOHumidityCorrect);
          },
        },
        {
          title: "逐秒稀释修正系数DF",
          minWidth: 110,
          key: "DiluteCorrect",
          render: (h, params) => {
            const DiluteCorrect = _this.toFlostTwo(params.row.DiluteCorrect);
            return h("span", {}, DiluteCorrect);
          },
        },
        {
          title: "扭力",
          minWidth: 70,
          key: "nf",
          render: (h, params) => {
            return h(
              "span",
              {},
              _this.toFlostTwo(params.row.nf || params.row.NF)
            );
          },
        },
      ];
    },
    TSI_column() {
      const _this = this;
      this.columns = [
        {
          title: "采样时序",
          minWidth: 80,
          key: "Second_No",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 160,
          key: "ProcessTime",
          render: (h, params) => {
            const Name = _this.$options.filters.dataFormat(
              params.row.ProcessTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, Name);
          },
        },
        {
          title: "工况类型",
          minWidth: 130,
          key: "gklx",
          render: (h, params) => {
            const Name =
              _this.initForm.cd_tsi_gklx[params.row.gklx || params.row.GKLX];
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机机油温度(℃)",
          minWidth: 130,
          key: "EngineOilTemperature",
          render: (h, params) => {
            const EngineOilTemperature = _this.toFlostTwo(
              params.row.EngineOilTemperature
            );
            return h("span", {}, EngineOilTemperature);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 130,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_RotateSpeed)
              ? _this.toFlostTwo(params.row.RotateSpeed)
              : _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 130,
          key: "Flow_HC",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_HC);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 130,
          key: "Flow_CO",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_CO);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况O2(%vol)",
          minWidth: 130,
          key: "Flow_O2",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_O2);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 130,
          key: "Flow_CO2",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_CO2);
            return h("span", {}, Name);
          },
        },
        {
          title: "λ值",
          minWidth: 70,
          key: "Flow_Lambda",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_Lambda);
            return h("span", {}, Name);
          },
        },
      ];
    },
    LightProofSmoke_column() {
      this.columns = [
        {
          title: "采样时序",
          minWidth: 80,
          key: "Second_No",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 170,
          key: "ProcessTime",
          render: (h, params) => {
            const Name = this.$options.filters.dataFormat(
              params.row.ProcessTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, Name);
          },
        },
        {
          title: "工况类型",
          minWidth: 120,
          key: "gklx",
          render: (h, params) => {
            const Name = "第" + (params.row.gklx || params.row.GKLX) + "次";
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 130,
          key: "Flow_K",
          render: (h, params) => {
            const Name = this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "光吸收系数k(m-1)",
          minWidth: 130,
          key: "Flow_K",
          render: (h, params) => {
            return h("span", {}, this.toFlostTwo(params.row.Flow_K));
          },
        },
      ];
    },
    LD_column() {
      const _this = this;
      this.columns = [
        {
          title: "采样时序",
          minWidth: 80,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 160,
          key: "ProcessTime",
          render: (h, params) => {
            const Name = _this.$options.filters.dataFormat(
              params.row.ProcessTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, Name);
          },
        },
        {
          title: "工况类型",
          minWidth: 160,
          key: "gklx",
          render: (h, params) => {
            const Name =
              _this.initFormNew.cd_ld_gklx_new[
                params.row.gklx || params.row.GKLX
              ];
            return h("span", {}, Name);
          },
        },
        {
          title: "车速(km/h)",
          minWidth: 90,
          key: "Flow_Speed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_Speed)
              ? _this.toFlostTwo(params.row.SpeedPerSec)
              : _this.toFlostTwo(params.row.Flow_Speed);
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 125,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_RotateSpeed)
              ? _this.toFlostTwo(params.row.RotateSpeed)
              : _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "光吸收系数k(m-1)",
          minWidth: 125,
          key: "Flow_K",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_K));
          },
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 130,
          key: "Flow_CO2",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_CO2);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况NOX(10-6vol)",
          minWidth: 140,
          key: "Flow_NOX",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_NOX);
            return h("span", {}, Name);
          },
        },
        {
          title: "油温",
          minWidth: 80,
          key: "OilTemperature",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.OilTemperature);
            return h("span", {}, Name);
          },
        },
        {
          title: "测功机载荷(KW)",
          minWidth: 120,
          key: "Flow_LoadPower",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_LoadPower));
          },
        },
        {
          title: "测功机扭矩(Nm)",
          minWidth: 120,
          key: "Flow_Torque",
          render: (h, params) => {
            let Flow_Torque = _this.toFlostTwo(params.row.Flow_Torque);
            return h("span", {}, Flow_Torque);
          },
        },
        {
          title: "扭力(N)",
          minWidth: 80,
          key: "NF",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.nf || params.row.NF);
            return h("span", {}, Name);
          },
        },
      ];
    },
    IM_column() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 60,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 155,
          key: "ProcessTime",
          render: (h, params) => {
            return h(
              "span",
              {},
              formatDates(params.row.ProcessTime, "yyyy-MM-dd hh:mm:ss")
            );
          },
        },
        {
          title: "工况类型",
          minWidth: 130,
          key: "gklx",
          render: (h, params) => {
            const Name =
              _this.initFormNew.cd_im_gklx_new[
                params.row.gklx || params.row.GKLX
              ];
            return h("span", {}, Name);
          },
        },
        {
          title: "车速(km/h)",
          minWidth: 100,
          key: "Flow_Speed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_Speed)
              ? _this.toFlostTwo(params.row.LineSpeed)
              : _this.toFlostTwo(params.row.Flow_Speed);
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 130,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_RotateSpeed)
              ? _this.toFlostTwo(params.row.RotateSpeed)
              : _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 90,
          key: "Flow_HC",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_HC));
          },
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 90,
          key: "Flow_CO",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_CO));
          },
        },
        {
          title: "测试工况NOX(10-6vol)",
          minWidth: 130,
          key: "Flow_NOX",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_NOX));
          },
        },
        {
          title: "HC(修正后)(10-6vol)",
          minWidth: 130,
          key: "Flow_HCCorrect",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_HCCorrect));
          },
        },
        {
          title: "CO(修正后)(%vol)",
          minWidth: 130,
          key: "Flow_COCorrect",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_COCorrect));
          },
        },
        {
          title: "NOX(修正后)(10-6vol)",
          minWidth: 130,
          key: "Flow_NOXCorrect",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_NOXCorrect));
          },
        },
        {
          title: "O2(修正后)(%vol)",
          minWidth: 130,
          key: "Flow_O2Correct",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_O2Correct));
          },
        },
        {
          title: "测试工况分析仪CO2(%vol)",
          minWidth: 130,
          key: "Flow_CO2",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_CO2));
          },
        },
        {
          title: "测试工况流量计O2(%vol)",
          minWidth: 130,
          key: "Flow_O2",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_O2));
          },
        },
        {
          title: "底盘测功机加载载荷(KW)",
          minWidth: 130,
          key: "Flow_LoadPower",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_LoadPower));
          },
        },
        {
          title: "稀释排气流量(m3/min)",
          minWidth: 130,
          key: "FlowDiluteExhaust",
          render: (h, params) => {
            return h(
              "span",
              {},
              _this.toFlostTwo(params.row.FlowDiluteExhaust)
            );
          },
        },
        {
          title: "稀释系数",
          minWidth: 110,
          key: "Flow_Dilute",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_Dilute));
          },
        },
        {
          title: "NO湿度修正系数",
          minWidth: 130,
          key: "NOHumidityCorrect",
          render: (h, params) => {
            return h(
              "span",
              {},
              _this.toFlostTwo(params.row.NOHumidityCorrect)
            );
          },
        },
        {
          title: "λ值",
          minWidth: 90,
          key: "Flow_Lambda",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_Lambda));
          },
        },
        {
          title: "扭力(N)",
          minWidth: 90,
          key: "NF",
          render: (h, params) => {
            return h(
              "span",
              {},
              _this.toFlostTwo(params.row.nf || params.row.NF)
            );
          },
        },
      ];
    },
    ASM_chart() {
      try {
        if (this.resData.length == 0) return;
        let formatData = {
          xAxisData: [],
          yAxis: {},
        };
        const resData = this.resData;
        let startTime = resData[0].ProcessTime;
        let endTime = resData.slice(-1)[0].ProcessTime;
        let timeArr = this.getTwoTimeList(startTime, endTime);
        formatData.xAxisData = timeArr;
        // resData.forEach(item => {
        //   formatData.xAxisData.push(item.Second_NO || Second_No);
        // });
        let dataArr = [];
        formatData.xAxisData.forEach((v) => {
          let data = {
            Flow_Speed: "",
            LineSpeed: "",
            Flow_RotateSpeed: "",
            RotateSpeed: "",
            Flow_Freeweight: "",
            Flow_HC: "",
            HCR: "",
            Flow_NO: "",
            NOR: "",
            Flow_CO: "",
            COR: "",
            Flow_CO2: "",
            CO2R: "",
            Flow_O2: "",
            O2R: "",
            Flow_Lambda: "",
            NOHumidityCorrect: "",
            DiluteCorrect: "",
            Flow_HCCorrect: "",
            Flow_COCorrect: "",
            Flow_NOCorrect: "",
            NF: "",
            nf: "",
          };
          resData.forEach((k) => {
            if (v == k.ProcessTime.substring(11)) {
              data = k;
            }
          });
          dataArr.push(data);
        });
        let markArr = [];
        let lostArr = [];
        let sData = JSON.parse(JSON.stringify(dataArr));
        sData.forEach((v, index) => {
          if (lostArr.indexOf(formatData.xAxisData[index]) !== -1) return;
          let s = 1;
          let a = [{ name: "", xAxis: "" }, { xAxis: "" }];
          if (v.Flow_Speed === "") {
            lostArr.push(formatData.xAxisData[index]);
            arr(sData, index);
            a[0].xAxis = formatData.xAxisData[index - 1];
            a[1].xAxis = formatData.xAxisData[index + s];
            markArr.push(a);
          }
          // 如果连续的逐秒数据为空，将它们合并到一个markArea数组里面
          function arr(data, i) {
            if (data[i + s].Flow_Speed === "") {
              lostArr.push(formatData.xAxisData[i + s]);
              s++;
              arr(sData, index);
            }
          }
        });
        this.Inspect_div = this.$echartsc.init(this.$refs.Inspect_div);
        this.Inspect_div1 = this.$echartsc.init(this.$refs.Inspect_div1);
        // 指定图表的配置项和数据
        var option = {
          color: [
            "#ff7f50",
            "#87cefa",
            "#7b68ee",
            "#32cd32",
            "#6495ed",
            "#6b8e23",
            "#ba55d3",
            "#cd5c5c",
            "#ffa500",
            "#40e0d0",
            "#1e90ff",
            "#4ea397",
            "#7bd9a5",
            "#d0648a",
            "#ffd700",
          ],
          title: {
            text: "",
          },
          tooltip: {
            trigger: "axis",
            confine: true,
            formatter: function(params) {
              let html = params[0].name;
              if (params[0].data === "") {
                return `${params[0].marker + params[0].name}: 过程数据缺失`;
              } else {
                params.forEach((item, index) => {
                  html += `<br/>${item.marker + item.seriesName}: ${
                    item.value === 0.001 ? 0 : item.value
                  }`;
                });
                return html;
              }
            },
          },
          legend: {
            top: 1,
            itemWidth: 12,
            itemHeight: 8,
            height: 20,
            textStyle: {
              color: this.themaColor,
              fontSize: 12, //字体大小
            },
            itemGap: 0,
            x: "right",
            selected: {
              // 设置默认不显示
              发动机转速: false,
              "HC(修正后)": false,
              "CO(修正后)": false,
              "NO(修正后)": false,
              "HC(未修正)": false,
              "CO(未修正)": false,
              "NO(未修正)": false,
              "CO2(未修正)": false,
              "O2(未修正)": false,
              λ值: false,
              底盘测功机负载: false,
              NO湿度修正系数: false,
              稀释修正系数DF: false,
              扭力: false,
            },
            data: [
              "车速",
              "发动机转速",
              "HC(修正后)",
              "CO(修正后)",
              "NO(修正后)",
              "HC(未修正)",
              "CO(未修正)",
              "NO(未修正)",
              "CO2(未修正)",
              "O2(未修正)",
              "λ值",
              "底盘测功机负载",
              "NO湿度修正系数",
              "稀释修正系数DF",
              "扭力",
            ],
            type: "scroll",
            pageIconColor: "blue",
            pageIconInactiveColor: "#888",
            pageFormatter: "",
            pageButtonItemGap: -6,
          },
          grid: {
            top: "12%",
            left: "1%",
            right: "2%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: formatData.xAxisData,
            axisLabel: {
              textStyle: {
                color: this.themaColor,
              },
            },
            axisLine: {
              lineStyle: {
                color: this.themaColor,
              },
            },
          },
          yAxis: [
            {
              type: "log",
              min: 0.001,
              position: "right",
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
                formatter: function(value) {
                  return value === 0.001 ? 0 : value;
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            {
              position: "right",
              type: "value",
              min: 0,
              max: 5,
              show: false,
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            {
              position: "left",
              type: "value",
              min: 0,
              max: 50,
              // show: false,
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
          ],
          series: [
            {
              name: "车速",
              type: "line",
              smooth: true,
              yAxisIndex: "2",
              data: dataArr.map((item) => {
                if (item.Flow_Speed === "") return "";
                else {
                  return isNull(item.Flow_Speed)
                    ? this.toFlostTwo(
                        item.LineSpeed == 0 ? 0.001 : item.LineSpeed
                      )
                    : this.toFlostTwo(
                        item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed
                      );
                }
              }),
              markArea: {
                data: markArr,
              },
            },
            {
              name: "发动机转速",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_RotateSpeed === "") return "";
                else {
                  return isNull(item.Flow_RotateSpeed)
                    ? item.RotateSpeed == 0
                      ? 0.001
                      : item.RotateSpeed
                    : item.Flow_RotateSpeed == 0
                    ? 0.001
                    : item.Flow_RotateSpeed;
                }
              }),
            },
            {
              name: "底盘测功机负载",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_Freeweight === "") return "";
                else
                  return this.toFlostTwo(
                    item.Flow_Freeweight == 0 ? 0.001 : item.Flow_Freeweight
                  );
              }),
            },
            {
              name: "HC(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_HC === "") return "";
                else
                  return isNull(item.Flow_HC)
                    ? item.HCR == 0
                      ? 0.001
                      : item.HCR
                    : item.Flow_HC == 0
                    ? 0.001
                    : item.Flow_HC;
              }),
            },
            {
              name: "NO(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_NO === "") return "";
                else
                  return isNull(item.Flow_NO)
                    ? item.NOR == 0
                      ? 0.001
                      : item.NOR
                    : item.Flow_NO == 0
                    ? 0.001
                    : item.Flow_NO;
              }),
            },
            {
              name: "CO(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_CO === "") return "";
                else
                  return isNull(item.Flow_CO)
                    ? item.COR == 0
                      ? 0.001
                      : item.COR
                    : item.Flow_CO == 0
                    ? 0.001
                    : item.Flow_CO;
              }),
            },
            {
              name: "CO2(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_CO2 === "") return "";
                else
                  return isNull(item.Flow_CO2)
                    ? item.CO2R == 0
                      ? 0.001
                      : item.CO2R
                    : item.Flow_CO2 == 0
                    ? 0.001
                    : item.Flow_CO2;
              }),
            },
            {
              name: "O2(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_O2 === "") return "";
                else
                  return isNull(item.Flow_O2)
                    ? item.O2R == 0
                      ? 0.001
                      : item.O2R
                    : item.Flow_O2 == 0
                    ? 0.001
                    : item.Flow_O2;
              }),
            },
            {
              name: "λ值",
              type: "line",
              smooth: true,
              yAxisIndex: "1",
              data: dataArr.map((item) => {
                if (item.Flow_Lambda === "") return "";
                else return item.Flow_Lambda == 0 ? 0.001 : item.Flow_Lambda;
              }),
            },
            {
              name: "NO湿度修正系数",
              type: "line",
              smooth: true,
              yAxisIndex: "1",
              data: dataArr.map((item) => {
                if (item.NOHumidityCorrect === "") return "";
                else
                  return this.toFlostTwo(
                    item.NOHumidityCorrect == 0 ? 0.001 : item.NOHumidityCorrect
                  );
              }),
            },
            {
              name: "稀释修正系数DF",
              type: "line",
              smooth: true,
              yAxisIndex: "1",
              data: dataArr.map((item) => {
                if (item.DiluteCorrect === "") return "";
                else
                  return this.toFlostTwo(
                    item.DiluteCorrect == 0 ? 0.001 : item.DiluteCorrect
                  );
              }),
            },
            {
              name: "HC(修正后)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_HCCorrect === "") return "";
                else
                  return item.Flow_HCCorrect == 0 ? 0.001 : item.Flow_HCCorrect;
              }),
            },
            {
              name: "CO(修正后)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_COCorrect === "") return "";
                else
                  return item.Flow_COCorrect == 0 ? 0.001 : item.Flow_COCorrect;
              }),
            },
            {
              name: "NO(修正后)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_NOCorrect === "") return "";
                else
                  return item.Flow_NOCorrect == 0 ? 0.001 : item.Flow_NOCorrect;
              }),
            },
            {
              name: "扭力",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.NF === "") return "";
                else
                  return (
                    (item.NF == 0 ? 0.001 : item.NF) ||
                    (item.nf == 0 ? 0.001 : item.nf)
                  );
              }),
            },
          ],
        };

        this.Inspect_div.setOption(option, true);
        this.Inspect_div1.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    IM_chart() {
      try {
        if (this.resData.length == 0) return;
        let formatData = {
          xAxisData: [],
          yAxis: {},
        };
        const resData = this.resData;
        let startTime = resData[0].ProcessTime;
        let endTime = resData.slice(-1)[0].ProcessTime;
        let timeArr = this.getTwoTimeList(startTime, endTime);
        formatData.xAxisData = timeArr;
        // resData.forEach((item) => {
        //   formatData.xAxisData.push(item.Second_NO || Second_No);
        // });
        let dataArr = [];
        formatData.xAxisData.forEach((v) => {
          let data = {
            Flow_Speed: "",
            LineSpeed: "",
            Flow_RotateSpeed: "",
            RotateSpeed: "",
            Flow_LoadPower: "",
            Flow_HC: "",
            Flow_HCCorrect: "",
            Flow_CO: "",
            Flow_COCorrect: "",
            Flow_NOX: "",
            Flow_NOXCorrect: "",
            Flow_CO2: "",
            Flow_O2: "",
            Flow_O2Correct: "",
            FlowDiluteExhaust: "",
            Flow_Dilute: "",
            NOHumidityCorrect: "",
            Flow_Lambda: "",
            nf: "",
          };
          resData.forEach((k) => {
            if (v == k.ProcessTime.substring(11)) {
              data = k;
            }
          });
          dataArr.push(data);
        });
        let markArr = [];
        let lostArr = [];
        let sData = JSON.parse(JSON.stringify(dataArr));
        sData.forEach((v, index) => {
          if (lostArr.indexOf(formatData.xAxisData[index]) !== -1) return;
          let s = 1;
          let a = [{ name: "", xAxis: "" }, { xAxis: "" }];
          if (v.Flow_Speed === "") {
            lostArr.push(formatData.xAxisData[index]);
            arr(sData, index);
            a[0].xAxis = formatData.xAxisData[index - 1];
            a[1].xAxis = formatData.xAxisData[index + s];
            markArr.push(a);
          }
          // 如果连续的逐秒数据为空，将它们合并到一个markArea数组里面
          function arr(data, i) {
            if (data[i + s].Flow_Speed === "") {
              lostArr.push(formatData.xAxisData[i + s]);
              s++;
              arr(sData, index);
            }
          }
        });
        this.Inspect_div = this.$echartsc.init(this.$refs.Inspect_div);
        this.Inspect_div1 = this.$echartsc.init(this.$refs.Inspect_div1);
        // 指定图表的配置项和数据
        var option = {
          color: [
            "#00BCD4",
            "#E91E63",
            "#FF9800",
            "#009688",
            "#607D8B",
            "#AB47BC",
            "rgb(4,147,207)",
            "rgb(255,82,8)",
            "rgb(244,114,152)",
            "rgb(105,171,60)",
            "rgb(103,224,233)",
            "rgb(198,0,255)",
            "#00BCD4",
            "#E91E63",
            "#FF9800",
            "#009688",
            "#607D8B",
          ],
          title: {
            text: "",
          },
          tooltip: {
            trigger: "axis",
            confine: true,
            formatter: function(params) {
              let html = params[0].name;
              if (params[0].data === "") {
                return `${params[0].marker + params[0].name}: 过程数据缺失`;
              } else {
                params.forEach((item, index) => {
                  html += `<br/>${item.marker + item.seriesName}: ${
                    item.value === 0.001 ? 0 : item.value
                  }`;
                });
                return html;
              }
            },
          },
          legend: {
            top: 1,
            itemWidth: 12,
            itemHeight: 8,
            height: 20,
            textStyle: {
              color: this.themaColor,
              fontSize: 12, //字体大小
            },
            itemGap: 0,
            x: "right",
            selected: {
              "HC(未修正)": false,
              "CO(未修正)": false,
              "NOX(未修正)": false,
              "CO2(未修正)": false,
              "O2(未修正)": false,
              "O2(修正后)": false,
              底盘测功机加载载荷: false,
              稀释排气流量: false,
              稀释系数: false,
              NO湿度修正系数: false,
              λ值: false,
              扭力: false,
            },
            data: [
              "车速",
              "发动机转速",
              "HC(修正后)",
              "CO(修正后)",
              "NOX(修正后)",
              "HC(未修正)",
              "CO(未修正)",
              "NOX(未修正)",
              "CO2(未修正)",
              "O2(未修正)",
              "O2(修正后)",
              "底盘测功机加载载荷",
              "稀释排气流量",
              "稀释系数",
              "NO湿度修正系数",
              "λ值",
              "扭力",
            ],
            type: "scroll",
            pageIconColor: "blue",
            pageIconInactiveColor: "#888",
            pageFormatter: "",
            pageButtonItemGap: -6,
          },
          grid: {
            top: "12%",
            left: "1%",
            right: "2%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: formatData.xAxisData,
            axisLabel: {
              textStyle: {
                color: this.themaColor,
              },
            },
            axisLine: {
              lineStyle: {
                color: this.themaColor,
              },
            },
          },
          yAxis: {
            type: "log",
            min: 0.001,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            axisLabel: {
              textStyle: {
                color: this.themaColor,
              },
              formatter: function(value) {
                return value === 0.001 ? 0 : value;
              },
            },
            axisLine: {
              lineStyle: {
                color: this.themaColor,
              },
            },
          },
          series: [
            {
              name: "车速",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_Speed === "") return "";
                else {
                  return isNull(item.Flow_Speed)
                    ? this.toFlostTwo(
                        item.LineSpeed == 0 ? 0.001 : item.LineSpeed
                      )
                    : this.toFlostTwo(
                        item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed
                      );
                }
              }),
              markArea: {
                data: markArr,
              },
            },
            {
              name: "发动机转速",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_RotateSpeed === "") return "";
                else {
                  return isNull(item.Flow_RotateSpeed)
                    ? this.toFlostTwo(
                        item.RotateSpeed == 0 ? 0.001 : item.RotateSpeed
                      )
                    : this.toFlostTwo(
                        item.Flow_RotateSpeed == 0
                          ? 0.001
                          : item.Flow_RotateSpeed
                      );
                }
              }),
            },
            {
              name: "底盘测功机加载载荷",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_LoadPower === "") return "";
                else {
                  return item.Flow_LoadPower == 0 ? 0.001 : item.Flow_LoadPower;
                }
              }),
            },
            {
              name: "HC(未修正)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_HC === "") return "";
                else {
                  return item.Flow_HC == 0 ? 0.001 : item.Flow_HC;
                }
              }),
            },
            {
              name: "HC(修正后)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_HCCorrect === "") return "";
                else {
                  return item.Flow_HCCorrect == 0 ? 0.001 : item.Flow_HCCorrect;
                }
              }),
            },
            {
              name: "CO(未修正)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_CO === "") return "";
                else {
                  return item.Flow_CO == 0 ? 0.001 : item.Flow_CO;
                }
              }),
            },
            {
              name: "CO(修正后)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_COCorrect === "") return "";
                else {
                  return item.Flow_COCorrect == 0 ? 0.001 : item.Flow_COCorrect;
                }
              }),
            },
            {
              name: "NOX(未修正)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_NOX === "") return "";
                else {
                  return item.Flow_NOX == 0 ? 0.001 : item.Flow_NOX;
                }
              }),
            },
            {
              name: "NOX(修正后)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_NOXCorrect === "") return "";
                else {
                  return item.Flow_NOXCorrect == 0
                    ? 0.001
                    : item.Flow_NOXCorrect;
                }
              }),
            },
            {
              name: "CO2(未修正)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_CO2 === "") return "";
                else {
                  return item.Flow_CO2 == 0 ? 0.001 : item.Flow_CO2;
                }
              }),
            },
            {
              name: "O2(未修正)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_O2 === "") return "";
                else {
                  return item.Flow_O2 == 0 ? 0.001 : item.Flow_O2;
                }
              }),
            },
            {
              name: "O2(修正后)",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_O2Correct === "") return "";
                else {
                  return item.Flow_O2Correct == 0 ? 0.001 : item.Flow_O2Correct;
                }
              }),
            },
            {
              name: "稀释排气流量",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.FlowDiluteExhaust === "") return "";
                else {
                  return item.FlowDiluteExhaust == 0
                    ? 0.001
                    : item.FlowDiluteExhaust;
                }
              }),
            },
            {
              name: "稀释系数",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_Dilute === "") return "";
                else {
                  return item.Flow_Dilute == 0 ? 0.001 : item.Flow_Dilute;
                }
              }),
            },
            {
              name: "NO湿度修正系数",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.NOHumidityCorrect === "") return "";
                else {
                  return this.toFlostTwo(
                    item.NOHumidityCorrect == 0 ? 0.001 : item.NOHumidityCorrect
                  );
                }
              }),
            },
            {
              name: "λ值",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_Lambda === "") return "";
                else {
                  return item.Flow_Lambda == 0 ? 0.001 : item.Flow_Lambda;
                }
              }),
            },
            {
              name: "扭力",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.nf === "") return "";
                else {
                  return (
                    (item.nf == 0 ? 0.001 : item.nf) ||
                    (item.NF == 0 ? 0.001 : item.NF)
                  );
                }
              }),
            },
          ],
        };

        this.Inspect_div.setOption(option, true);
        this.Inspect_div1.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    TSI_chart() {
      try {
        if (this.resData.length == 0) return;

        let formatData = {
          xAxisData: [],
          yAxis: {},
        };
        const resData = this.resData;
        let startTime = resData[0].ProcessTime;
        let endTime = resData.slice(-1)[0].ProcessTime;
        let timeArr = this.getTwoTimeList(startTime, endTime);
        formatData.xAxisData = timeArr;
        // resData.forEach((item) => {
        //   formatData.xAxisData.push(item.Second_NO || Second_No);
        // });
        let dataArr = [];
        formatData.xAxisData.forEach((v) => {
          let data = {
            EngineOilTemperature: "",
            Flow_RotateSpeed: "",
            Flow_O2: "",
            Flow_CO: "",
            Flow_HC: "",
            Flow_CO2: "",
            Flow_Lambda: "",
          };
          resData.forEach((k) => {
            if (v == k.ProcessTime.substring(11)) {
              data = k;
            }
          });
          dataArr.push(data);
        });
        let markArr = [];
        let lostArr = [];
        let sData = JSON.parse(JSON.stringify(dataArr));
        sData.forEach((v, index) => {
          if (lostArr.indexOf(formatData.xAxisData[index]) !== -1) return;
          let s = 1;
          let a = [{ name: "", xAxis: "" }, { xAxis: "" }];
          if (v.Flow_RotateSpeed === "") {
            lostArr.push(formatData.xAxisData[index]);
            arr(sData, index);
            a[0].xAxis = formatData.xAxisData[index - 1];
            a[1].xAxis = formatData.xAxisData[index + s];
            markArr.push(a);
          }
          // 如果连续的逐秒数据为空，将它们合并到一个markArea数组里面
          function arr(data, i) {
            if (data[i + s].Flow_RotateSpeed === "") {
              lostArr.push(formatData.xAxisData[i + s]);
              s++;
              arr(sData, index);
            }
          }
        });

        this.Inspect_div = this.$echartsc.init(this.$refs.Inspect_div);
        this.Inspect_div1 = this.$echartsc.init(this.$refs.Inspect_div1);
        // 指定图表的配置项和数据
        var option = {
          color: [
            "#ff7f50",
            "#87cefa",
            "#7b68ee",
            "#32cd32",
            "#6495ed",
            "#6b8e23",
            "#ba55d3",
          ],
          title: {
            text: "",
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              let html = params[0].name;
              if (params[0].data === "") {
                return `${params[0].marker + params[0].name}: 过程数据缺失`;
              } else {
                params.forEach((item, index) => {
                  html += `<br/>${item.marker + item.seriesName}: ${
                    item.value === 0.001 ? 0 : item.value
                  }`;
                });
                return html;
              }
            },
          },
          legend: {
            itemWidth: 12,
            itemHeight: 8,
            textStyle: {
              color: this.themaColor,
              fontSize: 11, //字体大小
            },
            itemGap: 0,
            x: "right",
            type: "scroll",
            pageIconColor: "blue",
            pageIconInactiveColor: "#888",
            pageFormatter: "",
            pageButtonItemGap: -6,
            selected: {
              "HC(未修正)": false,
              "CO(未修正)": false,
              λ值: false,
              "O2(未修正)": false,
              "CO2(未修正)": false,
              发动机机油温度: false,
            },
            data: [
              "发动机转速",
              "HC(未修正)",
              "CO(未修正)",
              "λ值",
              "O2(未修正)",
              "CO2(未修正)",
              "发动机机油温度",
            ],
          },
          grid: {
            top: "12%",
            left: "1%",
            right: "2%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: formatData.xAxisData,
            axisLabel: {
              textStyle: {
                color: this.themaColor,
              },
            },
            axisLine: {
              lineStyle: {
                color: this.themaColor,
              },
            },
          },
          yAxis: [
            {
              type: "log",
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
                formatter: function(value) {
                  return value === 0.001 ? 0 : value;
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
          ],
          series: [
            {
              name: "发动机机油温度",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.EngineOilTemperature === "") return "";
                else {
                  return this.toFlostTwo(
                    item.EngineOilTemperature == 0
                      ? 0.001
                      : item.EngineOilTemperature
                  );
                }
              }),
            },
            {
              name: "发动机转速",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_RotateSpeed === "") return "";
                else {
                  return this.toFlostTwo(
                    (item.Flow_RotateSpeed == 0
                      ? 0.001
                      : item.Flow_RotateSpeed) ||
                      (item.RotateSpeed == 0 ? 0.001 : item.RotateSpeed)
                  );
                }
              }),
              markArea: {
                data: markArr,
              },
            },
            {
              name: "HC(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_HC === "") return "";
                else {
                  return isNull(item.Flow_HC)
                    ? item.HCR == 0
                      ? 0.001
                      : item.HCR
                    : item.Flow_HC == 0
                    ? 0.001
                    : item.Flow_HC;
                }
              }),
            },
            {
              name: "CO(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_CO === "") return "";
                else {
                  return isNull(item.Flow_CO)
                    ? item.COR == 0
                      ? 0.001
                      : item.COR
                    : item.Flow_CO == 0
                    ? 0.001
                    : item.Flow_CO;
                }
              }),
            },
            {
              name: "O2(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_O2 === "") return "";
                else {
                  return isNull(item.Flow_O2)
                    ? item.O2R == 0
                      ? 0.001
                      : item.O2R
                    : item.Flow_O2 == 0
                    ? 0.001
                    : item.Flow_O2;
                }
              }),
            },
            {
              name: "CO2(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_CO2 === "") return "";
                else {
                  return isNull(item.Flow_CO2)
                    ? item.CO2R == 0
                      ? 0.001
                      : item.CO2R
                    : item.Flow_CO2 == 0
                    ? 0.001
                    : item.Flow_CO2;
                }
              }),
            },

            {
              name: "λ值",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_Lambda === "") return "";
                else {
                  return item.Flow_Lambda == 0 ? 0.001 : item.Flow_Lambda;
                }
              }),
            },
          ],
        };

        this.Inspect_div.setOption(option, true);
        this.Inspect_div1.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    LightProofSmoke_chart() {
      try {
        if (this.resData.length == 0) return;
        let formatData = {
          xAxisData: [],
          yAxis: {},
        };
        const resData = this.resData;
        let startTime = resData[0].ProcessTime;
        let endTime = resData.slice(-1)[0].ProcessTime;
        let timeArr = this.getTwoTimeList(startTime, endTime);
        formatData.xAxisData = timeArr;
        // resData.forEach((item) => {
        //   formatData.xAxisData.push(item.Second_NO || Second_No);
        // });
        let dataArr = [];
        formatData.xAxisData.forEach((v) => {
          let data = {
            Flow_RotateSpeed: "",
            Flow_K: "",
          };
          resData.forEach((k) => {
            if (v == k.ProcessTime.substring(11)) {
              data = k;
            }
          });
          dataArr.push(data);
        });
        let markArr = [];
        let lostArr = [];
        let sData = JSON.parse(JSON.stringify(dataArr));
        sData.forEach((v, index) => {
          if (lostArr.indexOf(formatData.xAxisData[index]) !== -1) return;
          let s = 1;
          let a = [{ name: "", xAxis: "" }, { xAxis: "" }];
          if (v.Flow_RotateSpeed === "") {
            lostArr.push(formatData.xAxisData[index]);
            arr(sData, index);
            a[0].xAxis = formatData.xAxisData[index - 1];
            a[1].xAxis = formatData.xAxisData[index + s];
            markArr.push(a);
          }
          // 如果连续的逐秒数据为空，将它们合并到一个markArea数组里面
          function arr(data, i) {
            if (data[i + s].Flow_RotateSpeed === "") {
              lostArr.push(formatData.xAxisData[i + s]);
              s++;
              arr(sData, index);
            }
          }
        });

        this.Inspect_div = this.$echartsc.init(this.$refs.Inspect_div);
        this.Inspect_div1 = this.$echartsc.init(this.$refs.Inspect_div1);
        // 指定图表的配置项和数据
        var option = {
          color: ["#00BCD4", "#E91E63"],
          title: {
            text: "",
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              let html = params[0].name;
              if (params[0].data === "") {
                return `${params[0].marker + params[0].name}: 过程数据缺失`;
              } else {
                params.forEach((item, index) => {
                  html += `<br/>${item.marker + item.seriesName}: ${
                    item.value === 0.001 ? 0 : item.value
                  }`;
                });
                return html;
              }
            },
          },
          legend: {
            itemWidth: 12,
            itemHeight: 8,
            textStyle: {
              color: this.themaColor,
              fontSize: 11, //字体大小
            },
            itemGap: 0,
            x: "right",
            type: "scroll",
            pageIconColor: "blue",
            pageIconInactiveColor: "#888",
            pageFormatter: "",
            pageButtonItemGap: -6,
            data: ["发动机转速", "光吸收系数k"],
          },
          grid: {
            top: "12%",
            left: "1%",
            right: "2%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: formatData.xAxisData,
            axisLabel: {
              textStyle: {
                color: this.themaColor,
              },
            },
            axisLine: {
              lineStyle: {
                color: this.themaColor,
              },
            },
          },
          yAxis: [
            {
              type: "log",
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
                formatter: function(value) {
                  return value === 0.001 ? 0 : value;
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
          ],
          series: [
            {
              name: "发动机转速",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_RotateSpeed === "") return "";
                else {
                  return item.Flow_RotateSpeed == 0
                    ? 0.001
                    : item.Flow_RotateSpeed;
                }
              }),
              markArea: {
                data: markArr,
              },
            },
            {
              name: "光吸收系数k",
              type: "line",
              smooth: true,
              data: dataArr.map((item) => {
                if (item.Flow_K === "") return "";
                else {
                  return item.Flow_K == 0 ? 0.001 : item.Flow_K;
                }
              }),
            },
          ],
        };

        this.Inspect_div.setOption(option, true);
        this.Inspect_div1.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    LD_chart() {
      try {
        if (this.resData.length == 0) return;
        let formatData = {
          xAxisData: [],
          yAxis: {},
        };
        const resData = this.resData;
        let startTime = resData[0].ProcessTime;
        let endTime = resData.slice(-1)[0].ProcessTime;
        let timeArr = this.getTwoTimeList(startTime, endTime);
        formatData.xAxisData = timeArr;
        // resData.forEach((item) => {
        //   formatData.xAxisData.push(item.Second_NO || Second_No);
        // });
        let dataArr = [];
        formatData.xAxisData.forEach((v) => {
          let data = {
            Flow_Speed: "",
            Flow_RotateSpeed: "",
            Flow_LoadPower: "",
            Flow_Torque: "",
            Flow_K: "",
            Flow_CO2: "",
            Flow_NOX: "",
            OilTemperature: "",
            nf: "",
          };
          resData.forEach((k) => {
            if (v == k.ProcessTime.substring(11)) {
              data = k;
            }
          });
          dataArr.push(data);
        });
        let markArr = [];
        let lostArr = [];
        let sData = JSON.parse(JSON.stringify(dataArr));
        sData.forEach((v, index) => {
          if (lostArr.indexOf(formatData.xAxisData[index]) !== -1) return;
          let s = 1;
          let a = [{ name: "", xAxis: "" }, { xAxis: "" }];
          if (v.Flow_Speed === "") {
            lostArr.push(formatData.xAxisData[index]);
            arr(sData, index);
            a[0].xAxis = formatData.xAxisData[index - 1];
            a[1].xAxis = formatData.xAxisData[index + s];
            markArr.push(a);
          }
          // 如果连续的逐秒数据为空，将它们合并到一个markArea数组里面
          function arr(data, i) {
            if (data[i + s].Flow_Speed === "") {
              lostArr.push(formatData.xAxisData[i + s]);
              s++;
              arr(sData, index);
            }
          }
        });

        this.Inspect_div = this.$echartsc.init(this.$refs.Inspect_div);
        this.Inspect_div1 = this.$echartsc.init(this.$refs.Inspect_div1);
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: "",
          },
          color: [
            "#ff7f50",
            "#87cefa",
            "#7b68ee",
            "#32cd32",
            "#6495ed",
            "#6b8e23",
            "#ba55d3",
            "#cd5c5c",
            "#ffa500",
          ],
          tooltip: {
            trigger: "axis",
            confine: true,
            formatter: function(params) {
              let html = params[0].name;
              if (params[0].data === "") {
                return `${params[0].marker + params[0].name}: 过程数据缺失`;
              } else {
                params.forEach((item, index) => {
                  html += `<br/>${item.marker + item.seriesName}: ${
                    item.value === 0.001 ? 0 : item.value
                  }`;
                });
                return html;
              }
            },
          },
          legend: {
            itemWidth: 12,
            itemHeight: 8,
            textStyle: {
              color: this.themaColor,
              fontSize: 11, //字体大小
            },
            itemGap: 0,
            x: "right",
            type: "scroll",
            pageIconColor: "blue",
            pageIconInactiveColor: "#888",
            pageFormatter: "",
            pageButtonItemGap: -6,
            selected: {
              发动机转速: false,
              光吸收系数k: false,
              "CO2(未修正)": false,
              "NOX(未修正)": false,
              测功机载荷: false,
              测功机扭矩: false,
              油温: false,
              扭力: false,
            },
            data: [
              "车速",
              "发动机转速",
              "光吸收系数k",
              "CO2(未修正)",
              "NOX(未修正)",
              "测功机载荷",
              "测功机扭矩",
              "油温",
              "扭力",
            ],
          },
          grid: {
            top: "12%",
            left: "1%",
            right: "2%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: formatData.xAxisData,
            axisLabel: {
              textStyle: {
                color: this.themaColor,
              },
            },
            axisLine: {
              lineStyle: {
                color: this.themaColor,
              },
            },
          },
          yAxis: [
            {
              type: "log",
              min: 0.001,
              position: "right",
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
                formatter: function(value) {
                  return value === 0.001 ? 0 : value;
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            {
              position: "left",
              type: "value",
              min: 0,
              max: 100,
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
          ],
          series: [
            {
              name: "车速",
              type: "line",
              smooth: true,
              yAxisIndex: "1",
              data: dataArr.map((item) => {
                if (item.Flow_Speed === "") return "";
                else {
                  return isNull(item.Flow_Speed)
                    ? this.toFlostTwo(
                        item.SpeedPerSec == 0 ? 0.001 : item.SpeedPerSec
                      )
                    : this.toFlostTwo(
                        item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed
                      );
                }
              }),
              markArea: {
                data: markArr,
              },
            },
            {
              name: "发动机转速",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_RotateSpeed === "") return "";
                else {
                  return isNull(item.Flow_RotateSpeed)
                    ? item.RotateSpeed == 0
                      ? 0.001
                      : item.RotateSpeed
                    : item.Flow_RotateSpeed == 0
                    ? 0.001
                    : item.Flow_RotateSpeed;
                }
              }),
            },
            {
              name: "测功机载荷",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_LoadPower === "") return "";
                else {
                  return item.Flow_LoadPower == 0 ? 0.001 : item.Flow_LoadPower;
                }
              }),
            },
            {
              name: "测功机扭矩",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_Torque === "") return "";
                else {
                  return item.Flow_Torque == 0 ? 0.001 : item.Flow_Torque;
                }
              }),
            },
            {
              name: "光吸收系数k",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_K === "") return "";
                else {
                  return isNull(item.Flow_K)
                    ? item.Smoke_K == 0
                      ? 0.001
                      : item.Smoke_K
                    : item.Flow_K == 0
                    ? 0.001
                    : item.Flow_K;
                }
              }),
            },
            {
              name: "CO2(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_CO2 === "") return "";
                else {
                  return item.Flow_CO2 == 0 ? 0.001 : item.Flow_CO2;
                }
              }),
            },
            {
              name: "NOX(未修正)",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.Flow_NOX === "") return "";
                else {
                  return item.Flow_NOX == 0 ? 0.001 : item.Flow_NOX;
                }
              }),
            },
            {
              name: "油温",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.OilTemperature === "") return "";
                else {
                  return this.toFlostTwo(
                    item.OilTemperature == 0 ? 0.001 : item.OilTemperature
                  );
                }
              }),
            },
            {
              name: "扭力",
              type: "line",
              smooth: true,
              yAxisIndex: "0",
              data: dataArr.map((item) => {
                if (item.nf === "") return "";
                else {
                  return this.toFlostTwo(
                    (item.nf == 0 ? 0.001 : item.nf) ||
                      (item.NF == 0 ? 0.001 : item.NF)
                  );
                }
              }),
            },
          ],
        };

        this.Inspect_div.setOption(option, true);
        this.Inspect_div1.setOption(option, true);
      } catch (error) {
        console.log(error);
      }
    },
    judgeType() {
      if (this.IUTYPE.indexOf("B")>-1) {
        this.curMethods = "稳态工况法";
        this.ASM_chart();
        this.ASM_column();
      } else if (this.IUTYPE.indexOf("A")>-1) {
        this.curMethods = "双怠速法";
        this.TSI_chart();
        this.TSI_column();
      } else if (this.IUTYPE.indexOf("F")>-1) {
        this.curMethods = "自由加速法";
        this.LightProofSmoke_chart();
        this.LightProofSmoke_column();
      } else if (this.IUTYPE.indexOf("G")>-1) {
        this.curMethods = "加载减速法";
        this.LD_chart();
        this.LD_column();
      } else if (this.IUTYPE.indexOf("C")>-1) {
        this.curMethods = "简易瞬态工况法";
        this.IM_chart();
        this.IM_column();
      }
    },
  },
  watch: {
    // InspectionNum: {
    //   handler(newData, oldData) {
    //     this.columns = [];
    //     this.resData = [];
    //     if (!newData) return;
    //     this.$nextTick(() => {
    //       this.getDetailData();
    //     });
    //   },
    //   immediate: true
    // },
    InspectProcessForm: {
      async handler(data) {
        this.columns = [];
        this.resData = [];
        this.tagsName = "name1";
        this.resData = data;
        this.$nextTick(() => {
          this.judgeType();
        });
      },
      immediate: true,
    },
  },
  mounted() {
    this.getheight();
    window.addEventListener("resize", this.getheight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getheight);
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-table-cell {
  padding: 0 3px;
}
.icons {
  margin-right: 8px;
  margin-top: 2px;
  cursor:pointer;
  &:hover {
    color: aquamarine;
  }
}
.modalclass{
  width: 100%!important;
  height: 100%!important;

}
</style>
