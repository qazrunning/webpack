<template>
  <div class="container">
    <!-- 顶部导航搜索栏 -->
    <div class="topSearch" style="height:52px;line-height:52px;">
      <Select :clearable="true" filterable v-model="param.stationCode" placeholder="选择站点" style="width:200px;margin:0 10px 0 10px">
        <Option v-for="item in StationInfo" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
      </Select>
      <Input placeholder="请输入车牌号码..." @keyup.enter.native="selectData" v-model="param.VLPN" style="width:200px; margin: 0 20px" />
      <DatePicker placeholder="选择时间…" type="date" v-model="param.time[0]" style="margin-left:10px;width:113px;"></DatePicker>----
      <DatePicker placeholder="选择时间…" type="date" v-model="param.time[1]" style="width:113px;"></DatePicker>

      <Button type="primary" @click="selectData" style="margin:0 20px">检索</Button>
      <Button :type="isShow==true?'primary':'default'" @click="isShow=!isShow">筛选</Button>
      <Button type="primary" @click="exportExcel()" style="float:right;margin:10px 10px 0">导出表格</Button>
      <!--   更多搜索条件 -->
      <div class v-show="isShow" style="position:relative;left:525px;top:1px;z-index:100;border-radius: 4px">
        <Card title="条件" icon="ios-options" :padding="0" shadow style="width: 350px;">
          <Form style="display: flex;flex-wrap: wrap;" v-model="param" :label-width="120">
            <FormItem style="width: 100%;margin: 5px 0px;" label="受理编码：">
              <Input v-model="param.InspectionNum" placeholder="请输入受理编码..." clearable style="width:94%" />
            </FormItem>
            <FormItem style="width: 100%;margin: 5px 0px;" label="检测报告编号：">
              <Input v-model="param.InspectionReportNo" placeholder="请输入检测报告编号..." clearable style="width:94%" />
            </FormItem>
            <FormItem style="width: 100%;margin: 5px 0px;" label="车架号：">
              <Input v-model="param.VIN" placeholder="请输入车架号..." clearable style="width:94%" />
            </FormItem>

            <div class="button" style="margin:5px 0 15px 0;width:96%">
              <Button type="primary" style="float: right;" @click="selectData">检索</Button>
              <Button type="primary" style="float: right;marginRight:10px" @click="conditionReset">重置</Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>

    <div class="Table">
      <!-- 表格信息详细 -->
      <div class="tableInfo" ref="tableInfo">
        <Table border ref="selection" :columns="tableHeader" :data="tableData" :height="tabHeight"></Table>
      </div>

      <!-- 分页器 -->
      <div class="tablePager">
        <Page :total="total" :page-size="pageSizeArr[0]" show-elevator show-sizer show-total :page-size-opts="pageSizeArr" @on-change="pageNumChange" @on-page-size-change="pageSizeChange" />
      </div>
    </div>
  </div>
</template>     

<script>
import axios from "axios";
import { export_json_to_excel } from '../../../../excel/Export2Excel';
import { getCDData } from "../../../utils/utils";
import { formatDates } from "../../../utils/utils";
export default {
  data() {
    return {
      FuelTypeInfo: [],
      isShow: false,
      pageSize: 20,
      pageNum: 1,
      total: 0,
      tabHeight: 0,
      pageSizeArr: [20, 30, 40, 50],
      param: {
        stationCode: "",
        VLPN: "",
        time: [new Date(), new Date()],
        InspectionNum: "",
        InspectionReportNo: "",
        VIN: ""
      },
      tableHeader: [
        {
          title: "车牌号",
          key: "VLPN",
          minWidth: 150,
          align: "center",
        },
        {
          title: '检测站名称',
          key: 'StationCode',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            const Name = this.returncodenames(
              this.StationInfo,
              params.row.StationCode
            )
            return h('span', {}, Name)
          }
        },
        {
          title: "受理编号",
          key: "InspectionNum",
          minWidth: 150,
          align: "center",
        },
        {
          title: "检测报告编码",
          key: "InspectionReportNo",
          minWidth: 150,
          align: "center",
        },
        {
          title: "检测日期",
          key: "DetectEndTime",
          minWidth: 150,
          align: "center",
        },
        {
          title: "车架号",
          key: "VIN",
          minWidth: 150,
          align: "center",
        },
        {
          title: "燃料类型",
          key: "FuelType",
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            const Name = this.returncodenames(
              this.FuelTypeInfo,
              params.row.FuelType
            )
            return h('span', {}, Name)
          }
        },
      ],
      tableHeader1: [
        {
          title: "车牌号",
          key: "VLPN",
          minWidth: 150,
          align: "center",
        },
        {
          title: '检测站名称',
          key: 'StationCode',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            const Name = this.returncodenames(
              this.StationInfo,
              params.row.StationCode
            )
            return h('span', {}, Name)
          }
        },
        {
          title: "受理编号",
          key: "InspectionNum",
          minWidth: 150,
          align: "center",
        },
        {
          title: "检测报告编码",
          key: "InspectionReportNo",
          minWidth: 150,
          align: "center",
        },
        {
          title: "检测日期",
          key: "DetectEndTime",
          minWidth: 150,
          align: "center",
        },
        {
          title: "车架号",
          key: "VIN",
          minWidth: 150,
          align: "center",
        },
        {
          title: "燃料类型",
          key: "FuelType",
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            let name = "";
            if (params.row.FuelType == "A") {
              name = "汽油";
            } else if (params.row.FuelType == "B") {
              name = "柴油";
            } else if (params.row.FuelType == "E") {
              name = "天然气";
            } else if (params.row.FuelType == "O") {
              name = "混合动力";
            } else {
              name = "其他";
            }

            return h("span", name);
          },
        },
      ],
      tableData: [],
      tableData1: [],
      needSentData: [], //需要发送的数据
      loading: false,
      StationInfo: [],
    };
  },

  methods: {
    // 导出表格
    async exportExcel() {
      let pageNum = this.pageNum;
      let pageSize = this.pageSize;
      let param = this.param;
      let IsexportExcel = true;
      let params = { pageNum, pageSize, param, IsexportExcel };
      const res = await this.$curl.get("api/hj/IM/getSuccessInfoIM", { params });
      require.ensure([], () => {
        const tHeader = this.tableHeader.map((c) => c.title);
        const filterVal = this.tableHeader.map((c) => c.key);
        const list = JSON.parse(JSON.stringify(res.allData));
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(
          tHeader,
          data,
          "IM检测数据统计" +
          formatDates(new Date(), "yyyyMMdd")
        );
      });
    },
    formatJson(filterVal, jsonData) {
      const self = this;
      return jsonData.map(v => filterVal.map(j => {
        if (j == 'StationCode') {
          v[j] = self.returncodenames(self.StationInfo, v[j])
        }
        if (j == 'FuelType') {
          v[j] = self.returncodenames(self.FuelTypeInfo, v[j])
        }
        return v[j]
      }))
    },
    //置空所有筛选条件
    conditionReset() {
      this.param.VLPN = ''
      this.param.InspectionNum = '',
        this.param.time = ['', ''],
        this.param.InspectionReportNo = '',
        this.param.VIN = '',
        this.getAllData(this.pageNum, this.pageSize, this.param);
    },
    async getCDData() {
      const _this = this;
      const list = [
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
          where: "",
        },
        {
          tableName: "CD_FuelType",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        }
      ];
      let StationRes = await this.$curl.get("api/hj/IM/getStationFilterRole");
      let StationRole = ''
      if (StationRes.state == 1) StationRole = StationRes.data
      const res = await this.$curl.get("api/hj/getCDData", {
        CDDataList: JSON.stringify(list),
      });
      // _this.StationInfo = res.data[0];
      _this.StationInfo = res.data[0].filter(v => {
        if (StationRole == '2201') {
          if (v.CountyCode) return v.CountyCode.indexOf(StationRole) > -1 && v.CountyCode != '220184'
        } else {
          if (v.CountyCode) return v.CountyCode.indexOf(StationRole) > -1
        }

      })
      _this.FuelTypeInfo = res.data[1];
    },
    // 过滤数据
    returncodenames(namelist, codevalue) {
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.CodeValue == codevalue) {
          CodeName = item.CodeName;
        }
      });
      return CodeName;
    },
    // 获取成功数据
    async getAllData(pageNum, pageSize, param) {
      let params = { pageNum, pageSize, param };
      const res = await this.$curl.get("api/hj/IM/getSuccessInfoIM", { params });
      this.tableData = res.allData;
      this.total = res.total;
      // console.log('________', res.allData);
    },
    // 检索
    selectData() {
      this.getAllData(this.pageNum, this.pageSize, this.param);
    },
    pageNumChange(value) {
      this.pageNum = value;
      // console.log('页码',this.pageNum);
      this.getAllData(this.pageNum, this.pageSize, this.param);
    },
    pageSizeChange(value) {
      this.pageSize = value;
      // console.log('每页条数',this.pageSize);
      this.getAllData(this.pageNum, this.pageSize, this.param);
    },
    // 计算表格高度
    getTabHeight() {
      this.tabHeight = this.$refs.tableInfo.offsetHeight;
    },
  },
  created() {

    this.getAllData(this.pageNum, this.pageSize, this.param);
  },
  mounted() {
    this.$nextTick(() => {
      this.getTabHeight();
    })
    // this.getTabHeight();
    window.addEventListener("resize", this.getTabHeight);
    this.getCDData();
  },
  destroyed() {
    window.removeEventListener("resize", this.getTabHeight);
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  .tglpx_showes {
    position: absolute;
    top: 38px;
    right: 3px;
    z-index: 9999;
    box-shadow: rgba(0, 0, 0, 0.35) -4px 7px 10px 2px;
    border-radius: 4px;
  }
}
.Table {
  height: calc(100% - 50px);
  .tableInfo {
    height: calc(100% - 50px);
  }
  .tablePager {
    padding: 5px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
  }
}
</style>
