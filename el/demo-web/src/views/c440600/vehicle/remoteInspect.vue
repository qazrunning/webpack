<template>
  <!-- 异地检测结果查询 -->
  <div class="remote-inspect">
    <div v-if="tableData.length > 0" class="remote-inspect-table">
      <Table :columns="tableColumn" :data="tableData"></Table>
    </div>
    <div v-else>暂无相关数据</div>
  </div>
</template>

<script>
export default {
  props: {
    Vecid: { type: Number },
    selectVIN: { type: String },
    cddata: { type: Object }
  },
  data() {
    return {
      tableData: [],
      tableColumn: [
        {
          title: "城市",
          key: "CityCode",
          align: "center",
          minWidth: 100,
          render: (h, param) => {
            let codeName = this.area[param.row.CityCode];
            return h('span', {}, codeName)
          },
        },
        {
          title: "区域",
          key: "CountyCode",
          align: "center",
          minWidth: 100,
          render: (h, param) => {
            let codeName = this.area[param.row.CountyCode];
            return h('span', {}, codeName)
          },
        },
        {
          title: "站点名称",
          key: "StationName",
          align: "center",
          minWidth: 200
        },
        {
          title: "检测结果",
          key: "VDCT",
          align: "center",
          minWidth: 150,
          render: (h, param) => {
            let name = param.row.VDCT == "1" ? "通过" : "不通过";
            return h('span', {}, name)
          },
        },
        {
          title: "检测方法",
          key: "IUTYPE",
          align: "center",
          minWidth: 180,
          render: (h, param) => {
            let name = this.getCodeName(param.row.IUTYPE, "CD_InspectionMethod");
            return h('span', {}, name)
          },
        },
        {
          title: "检测日期",
          key: "DetectEndTime",
          align: "center",
          minWidth: 200,
        }
      ],
      area: {}
    }
  },
  mounted() {
    this.loadCDData();
  },
  methods: {
    getCodeName(CodeValue, tableName) {
      if (this.cddata[tableName]) {
        let target = this.cddata[tableName].findIndex(item => item.CodeValue == CodeValue);
        return (target !== -1) && this.cddata[tableName][target].CodeName || '';
      }
    },
    async loadCDData() {
      const _this = this;
      const list = [
        {
          tableName: "Area",
          columns: "AreaCode,AreaName",
          where: "",
        }
      ];
      const res = await this.$curl.get("api/hj/getCDData", {
        CDDataList: JSON.stringify(list),
      });
      if (res.state) {
        // this.area = res.data[0];
        res.data[0].forEach(item => {
          _this.area[item.AreaCode] = item.AreaName;
        })
      }
    },
    getTableData() {
      this.$curl.get('api/hj/getRemoteInspect', {
        param: JSON.stringify({ VIN: this.selectVIN })
      }).then(res => {
        if(res.code) {
          this.tableData = res.list;
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.remote-inspect {
  width: 100%;
  height: 100%;
  overflow: auto;
  &-table {
    height: 100%;
  }
}
</style>