//变更车辆检测方法申请审核-变更信息
<template>
  <div class="vehicle-main">
    <Card>
      <div slot="title" class="card-head">
        <div class="card-head-text">变更检测方法</div>
        <div>
          <Button type="primary" size="small" @click="isShowDetail = true"
            >查看同车型变更详情</Button
          >
        </div>
      </div>
      <Table border :columns="columns" :data="data"></Table>
      <!-- <p v-show="isShowRemark"><span class="remarksInfo">备注：<span>{{remarkData}}</span></span></p> -->
    </Card>
    <Modal v-model="isShowDetail" footer-hide width="45">
      <p slot="header" class="titleColor">
        同车型提交变更车辆检测方法申请详情
      </p>
      <Table border :columns="columnsDetail" :data="dataDetail"></Table>
      <Page style="margin-top:5px;" :current="pageParam.pageNum" :total="pageParam.total" :page-size="pageParam.pageSize" show-total @on-change="changePage" />
    </Modal>
  </div>
</template>

<script>
import { config } from '../../../../utils/tools'
export default {
  props: {
    selectData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cdList: [],
      remarkData: '',
      isShowRemark: false,
      columns: [
        {
          title: "关键修改信息",
          key: "Iutype"
        },
        {
          title: "修改前",
          key: "inspectionMethodBefore"
        },
        {
          title: "修改后",
          key: "InspectionMethodAfter"
        }
      ],
      data: [],
      isShowDetail: false,
      columnsDetail: [
        {
          title: "车牌号",
          align: "center",
          key: "VLPN",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: this.setVLPNColor(params.row.VLPNColor),
                },
                params.row.VLPN
              )]);
          }
        },
        {
          title: "燃油类型",
          key: "FuelType",
          align: "center",
          render: (h, params) => {
            return h(
              "span", {},
              this.initform.cd_fuelType[params.row.FuelType]
            )
          }
        },
        {
          title: "车型号",
          key: "IUVTYPE",
          align: "center",
        },
        {
          title: "检测方法更改前",
          key: "InspectionMethodBefore",
          align: "center",
          render: (h, params) => {
            return h(
              "span", {
              style: {
                color: "#f00"
              }
            },
              this.initform.cd_inspectMethod[params.row.InspectionMethodBefore]
            )
          }
        },
        {
          title: "检测方法更改后",
          key: "InspectionMethodAfter",
          align: "center",
          render: (h, params) => {
            return h(
              "span", {
              style: {
                color: "#2d8cf0"
              }
            },
              this.initform.cd_inspectMethod[params.row.InspectionMethodAfter]
            )
          }
        },
        {
          title: "审核结果",
          key: "AuditState",
          align: "center",
          render: (h, params) => {
            let tag = '';
            let color = '#5e5e5e';
            if (params.row.AuditState == '1') {
              tag = '通过';
              color = '#4BAA4E';
            } else if (params.row.AuditState == '0') {
              tag = '不通过';
              color = '#ff0000';
            } else if (params.row.AuditState == '3') {
              tag = '自动通过';
              color = '#ff9900';
            }
            return h(
              "span", {
              style: {
                color: color
              }
            },
              tag
            )
          }
        }
      ],
      dataDetail: [],
      initform: {},
      pageParam: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  methods: {
    returnName(cdList, datalist) {
      datalist.forEach(item => {
        let index1 = cdList.findIndex(cditem => item.inspectionMethodBefore == cditem.CodeValue);
        if (index1 != -1) item.inspectionMethodBefore = cdList[index1].CodeName
        let index2 = cdList.findIndex(cditem => item.InspectionMethodAfter == cditem.CodeValue);
        if (index2 != -1) item.InspectionMethodAfter = cdList[index2].CodeName
      });
      return datalist
    },
    //直接从浏览器缓存获取CD表或者从reids
    async getDBinfoByMultipte() {
      const self = this;
      let cdname = [
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName",
          where: "",
        },
        {
          tableName: "CD_FuelType",
          columns: "CodeValue,CodeName",
          where: "",
        }
      ];
      const TableName = cdname.map(l => l.tableName);
      const CD_Name = [
        "cd_inspectMethod", "cd_fuelType"];
      let result = [];
      if (this.$getDBTable) {
        let data = await this.$getDBTable(cdname.map(e => e.tableName));
        data = data.map((item, index) => {
          item = JSON.parse(item);
          return item;
        });
        this.cdList = data[0]
        data.forEach((items, index) => {
          let result1 = items;
          self.initform[CD_Name[index]] = {};
          // if (result[0].hasOwnProperty('IsAvailable')) result = result.filter(d => d.IsAvailable == 1);
          result1.forEach(item => {
            self.initform[CD_Name[index]][item.CodeValue] = item.CodeName;
          });
        });
      } else {
        await getCDData(this, cdname).then(res => {
          const { data, state } = res;
          if (state) {
            this.cdList = data[0]
            data.map((items, index) => {
              self.initform[CD_Name[index]] = {};
              let data1 = items;
              // if (data[0].hasOwnProperty('IsAvailable')) data = data.filter(i => i.IsAvailable == 1);
              data1.forEach(item => {
                self.initform[CD_Name[index]][item.CodeValue] = item.CodeName;
              });
            });
          }
        });

      }
      this.getChangeIutypeData()

    },
    // 获取检测变更后的数据
    getChangeIutypeData() {
      let param = {
        VehicleID: this.selectData.VehicleID,
        BusinessKey: this.selectData.BusinessKey
      }
      this.$curl.get('/api/hj/getChangeIutype', { param }).then(res => {
        if (res.data.length != 0) {
          // await this.getDBinfoByMultipte()
          this.data = this.returnName(this.cdList, res.data)
          this.getMethodChangeDetail()
        }
      })
    },
    // 获取提示信息
    getInspectRatio() {
      let { FactoryPlateModel, InspectionMethod, IUETYPE, VehicleID } = this.AcceptForm
      let params = {
        FactoryPlateModel, InspectionMethod, IUETYPE, VehicleID
      }
      this.$curl.get('/api/hj/getInspectRatio', { params: JSON.stringify(params) }).then(res => {
        if (JSON.stringify(res.data) !== "{}") {
          this.isShowRemark = true
          let inspectMethods = this.initform.cd_inspectMethod
          let inspectMethodInfo = ``
          for (let i in inspectMethods) {
            if (i == res.data.IUTYPE) inspectMethodInfo = inspectMethods[i]
          }
          this.remarkData = `通过大数据分析，当前车型最多使用检测方法为${inspectMethodInfo},使用比率为${res.data.InspectRatio}%`
        }
      })
    },
    setVLPNColor(VLPNColor) {
      if (!config.vlpn_c[VLPNColor]) return {};
      const vlpn_c = config.vlpn_c[VLPNColor];
      return {
        display: "inline-block",
        margin: "-2 auto",
        "border-radius": "6px",
        "border-style": "double",
        "text-align": "center",
        padding: "0px 2px",
        background: `${vlpn_c.Background}`,
        color: `${vlpn_c.TextColor}`,
        "border-color": `${vlpn_c.BorderColor}`,
        "font-weight": "bold",
        "font-size": "10pt"
      };
    },
    getMethodChangeDetail(ModifyData) {
      this.dataDetail = [];
      this.pageParam.total = 0;
      this.pageParam.pageNum = 1;
      let param = {
        IUVTYPE: this.data[0].IUVTYPE,
        ID: this.data[0].ID
      }
      this.$curl.get('api/hj/getModifyMethodDetail', {
        param: JSON.stringify(param),
        pageParam: JSON.stringify(this.pageParam)
      }).then(res => {
        if (res.code) {
          this.dataDetail = res.data.list;
          this.pageParam.total = res.data.total || 0;
        }
      })
    },
    changePage(page){
      this.pageParam.pageNum = page;
      let param = {
        IUVTYPE: this.data[0].IUVTYPE,
        ID: this.data[0].ID
      }
      this.$curl.get('api/hj/getModifyMethodDetail', {
        param: JSON.stringify(param),
        pageParam: JSON.stringify(this.pageParam)
      }).then(res => {
        if (res.code) {
          this.dataDetail = res.data.list;
          this.pageParam.total = res.data.total || 0;
        }
      })
    }
  },
  mounted() {
    this.getDBinfoByMultipte()
    // this.getChangeIutypeData()
  },
  watch: {
    selectData: function(newData, oldData) {
      if(newData) {
        this.getChangeIutypeData()
      }
    }
  }
};
</script>
<style scoped>
.vehicle-main .ivu-form-item {
  margin-bottom: 2px;
}

.vehicle-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}

.remarksInfo {
  margin-top: 10px;
  color: red;
}
</style>
<style lang="scss" scoped>
.card-head {
  display: flex;
  justify-content: space-between;
  &-text {
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style lang="scss">
.fx-thema.dark .titleColor {
  color: #aab8ca !important;
}
</style>


