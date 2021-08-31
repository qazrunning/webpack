<template>
  <div class="container">
    <!-- 顶部导航搜索栏 -->
    <div class="topSearch" style="height:52px;line-height:52px;">
      <Select :clearable="true" filterable v-model="stationCode" placeholder="选择站点" style="width:200px;margin:0 20px 0 10px">
        <Option v-for="item in StationInfo" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
      </Select>
      <span>检测时间:</span>
      <DatePicker placeholder="选择时间…" v-model="param.time[0]" type="date" style="margin-left:10px;width:113px;"></DatePicker>----
      <DatePicker placeholder="选择时间…" v-model="param.time[1]" type="date" style="width:113px;"></DatePicker>
      <Button type="primary" @click="selectData" style="margin:0 20px">检索</Button>
      <Button type="primary" @click="exportExcel()" style="float:right;margin:10px 10px 0">导出表格</Button>
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
import { export_json_to_excel } from '../../../../excel/Export2Excel';
import { getCDData } from "../../../utils/utils";
import { formatDates } from '../../../utils/utils'
export default {
  data() {
    return {
      stationCode: '',
      isShow: false,
      pageSize: 20,
      pageNum: 1,
      total: 0,
      tabHeight: 0,
      pageSizeArr: [20, 30, 40, 50],
      param: {
        stationCode: '',
        time: [],
      },
      tableHeader: [
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
          title: "复检数",
          key: "fujian",
          minWidth: 150,
          align: "center",
        },
        {
          title: "复检通过数",
          key: "fujianTG",
          minWidth: 150,
          align: "center",
        },
        {
          title: "复检通过率(%)",
          key: "fujianTGL",
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            let name = "";
            if (params.row.fujianTGL == null) {
              name = "-";
            } else {
              name = params.row.fujianTGL;
            }

            return h("span", name);
          },
        }
      ],
      tableData: [],
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
      const res = await this.$curl.get("api/hj/IM/getIMfujianInfo", { params });
      require.ensure([], () => {
        const tHeader = this.tableHeader.map((c) => c.title);
        const filterVal = this.tableHeader.map((c) => c.key);
        const list = JSON.parse(JSON.stringify(res.allData));
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(
          tHeader,
          data,
          "IM维修复检统计" +
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
        return v[j]
      }))
    },
    // 检索
    selectData() {
      this.param.stationCode = this.stationCode;
      this.getAllData(this.pageNum, this.pageSize, this.param);
    },
    // 获取数据
    async getAllData(pageNum, pageSize, param) {
      let params = { pageNum, pageSize, param };
      const res = await this.$curl.get("api/hj/IM/getIMfujianInfo", { params });
      this.tableData = res.allData;
      this.total = res.total;
      // console.log('________', res.allData);
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
    async getCDData() {
      const _this = this;
      const list = [
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
          where: "",
        },
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
  },
  mounted() {
    this.$nextTick(() => {
      this.getTabHeight();
    })
    // this.getTabHeight();
    window.addEventListener("resize", this.getTabHeight);
    this.getCDData();
  },
  created() {
    this.getAllData(this.pageNum, this.pageSize, this.param);
  },
  destroyed() {
    window.removeEventListener("resize", this.getTabHeight);
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
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