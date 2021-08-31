<template>
  <!-- 业务审核-受理审核-基本车辆信息 -->
  <div class="vehicle-main">
    <Card>
      <div slot="title" class="card-head">
        <div class="card-head-text">基本车辆信息</div>
        <div>
          <Button type="primary" size="small" @click="showAuditHistory">查看该车审核历史</Button>
        </div>
      </div>
      <Form label-position="right" :label-width="150">
        <Row>
          <i-col :xxl="8" :xl="12" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="车牌号:">{{ VehicleForm.VLPN || "" }}</FormItem>
            <FormItem label="车架号:">{{ VehicleForm.VIN || "" }}</FormItem>
            <!-- <FormItem label="燃油种类:">{{ initform.cd_fuelType[VehicleForm.FuelType] || '' }}</FormItem> -->
            <FormItem label="燃油种类:">
              {{
              returnMultiple(initform.cd_fuelType, VehicleForm.FuelType) || ""
              }}
            </FormItem>

            <FormItem label="出厂日期:">
              {{
              VehicleForm.ProductDate || ""
              }}
            </FormItem>
            <FormItem label="发动机号码:">
              {{
              VehicleForm.EngineNum || ""
              }}
            </FormItem>
            <FormItem label="公安车辆类型:">
              {{
              initform.cd_gavType[VehicleForm.GAVType] || ""
              }}
            </FormItem>
            <FormItem label="发动机排量(L):">
              {{
              new Number(VehicleForm.EDSPL).toFixed(2) || ""
              }}
            </FormItem>
            <FormItem label="使用性质:">{{ initform.cd_useOfAuto[VehicleForm.UseOfAuto] || "" }}</FormItem>
          </i-col>
          <i-col :xxl="8" :xl="12" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="座位数:">
              {{
              VehicleForm.RatedSeats || ""
              }}
            </FormItem>
            <FormItem label="车型号:">{{ VehicleForm.IUVTYPE || "" }}</FormItem>
            <FormItem label="车牌颜色:">
              {{
              initform.cd_vlpnColor[VehicleForm.VLPNColor] || ""
              }}
            </FormItem>
            <FormItem label="所属城市:">
              {{
              initform.cd_city[VehicleForm.CityCode] || ""
              }}
            </FormItem>

            <FormItem label="车辆性质:">
              {{
              initform.cd_vehicleKind[VehicleForm.VehicleKind] || ""
              }}
            </FormItem>
            <FormItem label="整备质量:">
              {{
              VehicleForm.KerbMass || ""
              }}
            </FormItem>
            <FormItem label="发动机额定功率(kw):">
              {{
              ~~VehicleForm.EnginePower || ""
              }}
            </FormItem>
          </i-col>
          <i-col :xxl="8" :xl="12" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="车主:">{{ VehicleForm.OwnerName || "" }}</FormItem>
            <!-- <FormItem label="所属站点:">{{ initform.cd_station[VehicleForm.OrgCode] || '' }}</FormItem> -->
            <FormItem label="最大总质量(kg):">
              {{
              VehicleForm.VML || ""
              }}
            </FormItem>
            <FormItem label="厂牌型号:">
              {{
              VehicleForm.FactoryPlateModel || ""
              }}
            </FormItem>
            <FormItem label="排放标准:" v-if="selectData && selectData.CheckType === '02'&& selectData.Status === '0'">
              <Select v-model="VehicleEmissionStandard" size="small" style="width:80px" @on-change="changeItem">
                <Option v-for="item in EmissionStandardList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Button v-show="
                  selectData &&
                  (selectData.CheckType === '02' ||
                    selectData.CheckType === '01')
                " @click="handleModel" type="success" shape="circle" style="margin-left: 10px">排放标准</Button>
            </FormItem>
            <FormItem label="排放标准:" v-else>
              {{ initform.cd_emission[VehicleForm.EmissionStandard] || "" }}
              <Button v-show="
                  selectData &&
                  (selectData.CheckType === '02' ||
                    selectData.CheckType === '01')
                " @click="handleModel" type="success" shape="circle" style="margin-left: 10px">排放标准</Button>
            </FormItem>
            <FormItem label="初登日期:">
              {{
              VehicleForm.VRDATE || ""
              }}
            </FormItem>
            <FormItem label="发动机型号:" :class="[
                selectData &&
                selectData.ApplyReason &&
                selectData.ApplyReason.indexOf('26') != -1
                  ? 'focusStyle'
                  : '',
              ]">{{ VehicleForm.IUETYPE || "" }}</FormItem>
            <FormItem label="基准质量(kg):">
              {{
              VehicleForm.BenchmarkMass || ""
              }}
            </FormItem>
            <FormItem>
              <Button size="small" shape="circle" type="primary" @click="handleModel()" v-show="isSecondHandCartAudit(VehicleForm.ApplyReason)">排放标准核对</Button>
            </FormItem>
          </i-col>
        </Row>
        <slot name="footer"></slot>
      </Form>
    </Card>
    <emission-info ref="emiss_div" :hasAuthority="false"></emission-info>
    <Modal v-model="isShowDetail" footer-hide width="60">
      <p slot="header" class="titleColor">{{ VehicleForm.VLPN || "" }}——审核历史记录</p>
      <Table border :columns="columnsDetail" :data="dataDetail" :loading="loadingDetail"></Table>
      <Page style="margin-top:5px;" :current="pageParam.pageNum" :total="pageParam.total" :page-size="pageParam.pageSize" show-total @on-change="changePage" />
    </Modal>
    <!-- 是否修改排放标准模态框 -->
    <!-- <Modal v-model="IfChangeEmissionStandard">
        <p>是否确认修改该车的排放标准</p>
    </Modal>-->
    <Modal v-model="IfChangeEmissionStandard" width="360" class="changemodal">
      <div style="text-align:center">
        <p style="font-weight:bold">是否确定修改该车的排放标准？</p>
      </div>
      <div slot="footer">
        <Button type="text" @click="Iscancel(VehicleForm.EmissionStandard)">取消</Button>
        <Button type="success" @click="IsOKchange(newChangedata)">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import EmissionInfo from "./EmissionInfo";
export default {
  name: "vehicleInfo",
  props: {
    VehicleForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    initform: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selectData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      newChangedata: "",
      IfChangeEmissionStandard: false,
      EmissionStandardList: [
        {
          value: '00',
          label: '国O'
        },
        {
          value: '01',
          label: '国Ⅰ'
        },
        {
          value: '02',
          label: '国Ⅱ'
        },
        {
          value: '03',
          label: '国Ⅲ'
        },
        {
          value: '04',
          label: '国Ⅳ'
        },
        {
          value: '05',
          label: '国Ⅴ'
        },
        {
          value: '06',
          label: '国VI'
        },
      ],
      VehicleEmissionStandard: "",
      isShowDetail: false,
      columnsDetail: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 65
        },
        {
          title: '审核类型',
          key: 'CheckType',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h(
              "span", {},
              this.initform.cd_checkType[params.row.CheckType]
            )
          }
        },
        {
          title: '申请原因',
          key: 'ApplyReason',
          align: 'center',
          minWidth: 170,
          render: (h, params) => {
            let name = this.initform.cd_auditReason[params.row.ApplyReason] || params.row.ApplyReason;
            return h(
              "span", {},
              name
            )
          }
        },
        {
          title: '申请时间',
          key: 'ApplyTime',
          align: 'center',
          minWidth: 150
        },
        {
          title: '审核结果',
          key: 'AuditState',
          align: 'center',
          minWidth: 80,
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
        },
        {
          title: '审核人',
          key: 'Checker',
          align: 'center',
          minWidth: 80
        },
        {
          title: '备注',
          key: 'Remarks',
          align: 'center',
          minWidth: 170
        },
      ],
      dataDetail: [],
      loadingDetail: false,
      pageParam: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  components: {
    EmissionInfo
  },
  methods: {
    // 车型审核排放标准模态框取消按钮
    Iscancel(val) {
      this.VehicleEmissionStandard = val
      this.IfChangeEmissionStandard = false
    },
    // 车型审核排放标准模态框确定按钮
    IsOKchange(val) {
      let param = {
        oldEmissionStandard: this.VehicleForm.EmissionStandard,
        newEmissionStandard: val,
        VehicleID: this.VehicleForm.VehicleID
      }
      this.VehicleForm.EmissionStandard = val
      this.$curl.get('api/hj/changeEmissionStandard', { param }).then(res => {
        if (res && res.code == 1) {
          //  this.$Message.success('修改排放标准成功！');
          this.$Message['success']({
            background: true,
            content: '修改排放标准成功',
            duration: 2
          });
        } else {
          this.$Message['error']({
            background: true,
            content: '修改排放标准失败',
            duration: 2
          });
        }

      })
      this.IfChangeEmissionStandard = false
    },
    changeItem(val) {
      this.IfChangeEmissionStandard = true
      this.newChangedata = val
    },
    //多选过滤
    returnMultiple(cdList, codeValue) {
      const _this = this;
      if (!codeValue) return;
      const arrs = String(codeValue).split("");
      let CodeName = [];
      for (let key in cdList) {
        arrs.forEach(item => {
          if (key == item) CodeName.push(cdList[key]);
        });
      }
      return CodeName.join(",");
    },
    handleModel() {
      if (Object.keys(this.VehicleForm).length <= 0) {
        this.$Notice.warning({
          title: "暂无车辆信息!"
        });
        return;
      }
      this.$refs.emiss_div.openModel();
      this.$refs.emiss_div.childMethods(this.VehicleForm);
    },
    isSecondHandCartAudit(ApplyReason) {
      if (ApplyReason && ApplyReason.indexOf("17") > -1) return true;
      return false;
    },
    showAuditHistory() {
      this.loadingDetail = true;
      this.isShowDetail = true;
      this.dataDetail = [];
      this.pageParam.total = 0;
      this.pageParam.pageNum = 1;
      let param = {
        VehicleID: this.selectData.VehicleID,
        CheckId: this.selectData.CheckId
      };
      this.$curl.get('api/hj/getVehicleAuditHistory', {
        param: JSON.stringify(param),
        pageParam: JSON.stringify(this.pageParam)
      }).then(res => {
        if (res.code) {
          this.dataDetail = res.data.list;
          this.pageParam.total = res.data.total || 0;
        }
        this.loadingDetail = false;
      })
    },
    changePage(page) {
      this.pageParam.pageNum = page;
      let param = {
        VehicleID: this.selectData.VehicleID,
        CheckId: this.selectData.CheckId
      };
      this.$curl.get('api/hj/getVehicleAuditHistory', {
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
  mounted() { },

  watch: {
    VehicleForm(val) {
      this.VehicleEmissionStandard = this.VehicleForm.EmissionStandard
    }
  }
};
</script>
<style scoped>
.vehicle-main .focusStyle.ivu-form-item /deep/ .ivu-form-item-label {
  font-size: 16px;
  color: red;
}
.vehicle-main .focusStyle.ivu-form-item /deep/ .ivu-form-item-content {
  font-size: 16px;
  color: red;
}
.vehicle-main .ivu-form-item {
  margin-bottom: 2px;
}

.vehicle-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
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
<style lang="less" scoped>
.changemodal /deep/ .ivu-modal-body {
  height: 70px;
  overflow: scroll;
  display: flex;
  justify-content:center;
  align-items: center;
}
.changemodal /deep/ .ivu-modal-close {
  display: none;
}
</style>
