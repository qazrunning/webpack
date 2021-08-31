//申请变更检测方法
<template>
  <div class="changeMethod">
    <Card>
      <div slot="title" class="card-head">
        <div class="card-head-text">变更检测方法</div>
        <div>
          <Button type="primary" size="small" @click="isShowDetail = true"
            >查看同车型变更详情</Button
          >
        </div>
      </div>
      <Table border :columns="columnsMethod" :data="dataMethod"></Table>
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
    ModifyMethodForm: {
      type: Object,
      required: true
    },
    initform: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columnsMethod: [
        {
          title: "检测方法更改前",
          key: "InspectionMethodBefore",
          render: (h, params) => {
            return h(
              "span", {
              style: {
                color: "#f00"
              }
            },
              params.row.InspectionMethodBefore
            )
          }
        },
        {
          title: "检测方法更改后",
          key: "InspectionMethodAfter",
          render: (h, params) => {
            return h(
              "span", {
              style: {
                color: "#2d8cf0"
              }
            },
              params.row.InspectionMethodAfter
            )
          }
        }
      ],
      dataMethod: [],
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
      pageParam: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    ModifyMethodForm: function (newData, oldData) {
      const self = this;
      this.dataMethod = [];
      if (!newData) return;
      self.dataMethod.push({
        InspectionMethodBefore: this.initform.cd_inspectMethod[newData.InspectionMethodBefore],
        InspectionMethodAfter: this.initform.cd_inspectMethod[newData.InspectionMethodAfter]
      })
      this.getMethodChangeDetail(newData)
    }
  },
  methods: {
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
      if (!ModifyData) return;
      this.dataDetail = [];
      this.pageParam.total = 0;
      this.pageParam.pageNum = 1;
      let param = {
        IUVTYPE: ModifyData.IUVTYPE,
        ID: ModifyData.ID
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
        IUVTYPE: ModifyMethodForm.IUVTYPE,
        ID: ModifyMethodForm.ID
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
}
</script>

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
