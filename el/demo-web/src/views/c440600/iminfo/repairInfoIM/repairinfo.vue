<template>
  <div class="container" @click="sxshow=false">
    <!-- 顶部导航搜索栏 -->
    <div class="chooseNav" style="height:52px;line-height:52px;">
      <Select :clearable="true" filterable v-model="formData.StationCode" placeholder="选择站点" style="width:200px;margin:0 10px 0 10px">
        <Option v-for="item in stationList" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
      </Select>
      <Input v-model="formData.Vehicleplatenumber" placeholder="请输入车牌号码..." clearable style="width:200px; margin: 0 20px" />
      <Button type="primary" style @click="searchData">检索</Button>
      <Button :type="isShow==true?'primary':'default'" icon="ios-funnel" style="margin:0 20px" @click="isShow=!isShow">筛选</Button>
      <Button type="primary" @click="exportExcel()" :loading="loading" style="float:right;margin:10px 10px 0">导出表格</Button>
      <!--   更多搜索条件 -->
      <div class v-show="isShow" style="position:relative;left:317px;top:0px;z-index:100;border-radius: 4px">
        <Card title="条件" icon="ios-options" :padding="0" shadow style="width: 350px;">
          <Form style="display: flex;flex-wrap: wrap;" v-model="formData" :label-width="120">
            <FormItem style="width: 100%;margin: 5px 0px;" label="检测报告编号：">
              <Input v-model="formData.test_no" placeholder="请输入检测报告编号..." clearable style="width:94%" />
            </FormItem>
            <FormItem style="width: 100%;margin: 5px 0px;" label="维修厂：">
              <Input v-model="formData.companyname" placeholder="请输入维修企业名称..." clearable style="width:94%" />
            </FormItem>
            <!-- <FormItem style="width: 100%;margin: 5px 0px;" label="检测站：">
              <Input v-model="formData.StationCode" placeholder="请输入检测站编码..." clearable style="width:94%" />
            </FormItem>-->
            <FormItem style="width: 100%;margin: 5px 0px;" label="送修日期：">
              <div class="itemValue">
                <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm:ss" :split-panels="true" placement="top-start" v-model="formData.repairdate" placeholder="请选择" style="width: 94%;"></DatePicker>
              </div>
            </FormItem>
            <RadioGroup v-model="formData.CheckType" style="margin-left:25%">
              <Radio label="0">全部</Radio>
              <Radio label="1" v-if="fjAuthority">复检</Radio>
              <Radio label="2" v-if="djAuthority">多检</Radio>
            </RadioGroup>
            <FormItem style="width: 100%;margin: 5px 0px;" :label="formData.CheckType=='1'?'复检结果：':'多检结果：'" v-if="formData.CheckType !== '0'">
              <Select v-model="formData.CheckResult" clearable style="width:94%">
                <Option v-for="item in CheckResult" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <div class="button" style="margin:5px 0 15px 0;width:96%">
              <Button type="primary" style="float: right;" @click="searchData">检索</Button>
              <Button type="primary" style="float: right;marginRight:10px" @click="conditionReset">重置</Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
    <!-- 维修信息表格 -->
    <div class="Table">
      <!-- 表格信息详细 -->
      <div class="tableInfo" ref="tableInfo">
        <Table border :loading="loading" :columns="tableHeader" :data="tableData" :height="tabHeight">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="showDetail(row,index)">详情</Button>
            <Button v-if="comparSwitch" type="primary" size="small" @click="showMethodData(row,index)">对比</Button>
          </template>
        </Table>
      </div>
      <!-- 分页器 -->
      <div class="thePager" style>
        <Page :total="total" :page-size="pageSizeArr[0]" show-sizer show-elevator :page-size-opts="pageSizeArr" @on-change="pageNumChange" @on-page-size-change="pageSizeChange" />
        <div class="pageInfo" style="marginRight:10px;textAlign: center">
          <span>
            当前显示
            <span>{{ (this.pageNum - 1) * this.pageSize + 1 }}</span> -
            <span>{{Math.ceil(this.total/this.pageSize)==(this.pageNum) ? (this.total) : (this.pageNum*this.pageSize)}}</span> 条记录 共
            <span>{{ total }}</span> 条记录
          </span>
        </div>
      </div>
    </div>
    <Drawer title="维修信息详情" placement="left" :width="40" v-model="showDrawer">
      <maintain-detail :baseInfo="selectData"></maintain-detail>
    </Drawer>
    <!-- <Drawer title="数据对比" placement="right" :width="40" v-model="showMethodDrawer1111">
      <compare-table :baseInfo="selectData" :stationList="stationList" :InspectionMethodList="InspectionMethodList"></compare-table>
    </Drawer>-->

    <Modal title="数据对比" width="80%" v-model="showMethodDrawer" footer-hide>
      <div style="height:650px">
        <compare-table style="height:100%" ref="comparedata" :baseInfo="selectData" :stationList="stationList" :InspectionMethodList="InspectionMethodList"></compare-table>
      </div>
    </Modal>
  </div>
</template>
<script>
import { export_json_to_excel } from '../../../../excel/Export2Excel'
import { getCDData } from "../../../utils/utils";
import { formatDates } from '../../../utils/utils'
export default {
  components: {
    maintainDetail: () => import('./maintainDetail.vue'),
    compareTable: () => import('./compareTable.vue')
  },
  data() {
    return {
      lastInspectionNum: "",
      comparSwitch: false, //复检对比开关
      showDrawer: false,
      showMethodDrawer: false,
      selectData: {},
      isShow: false,
      Modal: false,
      loading: false,
      delModal: false,
      tabHeight: 0,
      ModalTitle: '',
      tableData: [],
      currentData: {},
      currentID: '',
      CheckResult: [
        { value: '0', label: '通过' },
        { value: '1', label: '不通过' },
      ],
      tableHeader: [{
        title: '检测报告编号',
        key: 'test_no',
        minWidth: 120,
        align: 'center'
      }, {
        title: '车牌号码',
        key: 'Vehicleplatenumber',
        minWidth: 120,
        align: 'center'
      }, {
        title: '车架号',
        key: 'Vin',
        minWidth: 150,
        align: 'center'
      }, {
        title: '故障描述',
        key: 'Faultdescription',
        minWidth: 150,
        align: 'center'
      },
      {
        title: '送修里程',
        key: 'repairmileage',
        minWidth: 100,
        align: 'center'
      }
        , {
        title: '送修日期',
        key: 'repairdate',
        minWidth: 150,
        align: 'center'
      }, {
        title: '结算日期',
        key: 'settledate',
        minWidth: 150,
        align: 'center'
      }, {
        title: '维修企业名称',
        key: 'companyname',
        minWidth: 120,
        align: 'center'
      },
      {
        title: '操作',
        slot: 'action',
        width: 100,
        align: 'center'
      }
      ],
      formData: {
        test_no: '',
        companyname: '',
        StationCode: '',
        repairdate: [],
        Vehicleplatenumber: '',
        CheckType: '0',
        CheckResult: "",
      },
      pageSizeArr: [20, 30, 40, 50],
      total: 0,
      pageSize: 20,
      pageNum: 1,
      fjAuthority: false,
      djAuthority: false,
      stationList: [],
      InspectionMethodList: []
    }
  },

  created() {
    this.getAllData(this.pageNum, this.pageSize, this.formData)
  },
  mounted() {
    this.getCDData();
    this.getAuthority();
    this.$nextTick(() => {
      this.getTabHeight();
    })
    // this.getTabHeight();
    window.addEventListener('resize', this.getTabHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.getTabHeight)
  },
  methods: {
    // 导出表格
    async exportExcel() {
      const _this = this;
      let param = this.formData; let pageNum = this.pageNum; let pageSize = this.pageSize; let IsexportExcel = true;
      let params = { pageNum, pageSize, param, IsexportExcel }
      // const newTable=_this.tableHeader.splice(0,1);
      delete _this.tableHeader[0];
      const newTable = _this.tableHeader;
      const res = await _this.$curl.get("api/hj/IM/getAllRepairInfo", { params });
      require.ensure([], () => {
        const tHeader = [];
        const filterVal = [];
        newTable.forEach((c) => {
          if (c.title != "操作") {
            tHeader.push(c.title);
            filterVal.push(c.key);
          }
        });
        const list = JSON.parse(JSON.stringify(res.repairData));
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(
          tHeader,
          data,
          "维修数据查询" +
          formatDates(new Date(), "yyyyMMdd")
        );
      });
    },
    formatJson(filterVal, jsonData) {
      const self = this;
      return jsonData.map(v => filterVal.map(j => {
        if (j == 'StationCode') {
          v[j] = self.returncodenames(self.stationList, v[j])
        }
        if (j == 'VDCT') {
          if (v[j] == "1") {
            v[j] = "通过"
          } else if (v[j] == "0") {
            v[j] = "不通过"
          }
        }
        return v[j]
      }))
    },
    async getCDData() {
      let cdname = [
        {
          tableName: "stationinfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
          where: "",
        },
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName",
          where: "",
        }
      ];
      let StationRes = await this.$curl.get("api/hj/IM/getStationFilterRole");
      let StationRole = ''
      if (StationRes.state == 1) StationRole = StationRes.data
      if (this.$getDBTable) {
        let data = await this.$getDBTable(cdname.map(e => e.tableName));
        data = data.map((item, index) => {
          item = JSON.parse(item);
          return item;
        });
        // this.stationList = data[0]
        this.stationList = data[0].filter(v => {
          if (StationRole == '2201') {
            if (v.CountyCode) return v.CountyCode.indexOf(StationRole) > -1 && v.CountyCode != '220184'
          } else {
            if (v.CountyCode) return v.CountyCode.indexOf(StationRole) > -1
          }

        })
        this.InspectionMethodList = data[1]
      } else {
        await getCDData(this, cdname).then(res => {
          const { data, state } = res;
          if (state) {
            // this.stationList = data[0]
            this.stationList = data[0].filter(v => {
              if (StationRole == '2201') {
                if (v.CountyCode) return v.CountyCode.indexOf(StationRole) > -1 && v.CountyCode != '220184'
              } else {
                if (v.CountyCode) return v.CountyCode.indexOf(StationRole) > -1
              }

            })
          }
        });
      }
    },
    // 获取注册用户的权限
    async getAuthority() {
      //判断是否已存在值
      let fjres = await this.$curl.post("api/hj/hasAuthority", { type: "IM06" });
      let djres = await this.$curl.post("api/hj/hasAuthority", { type: "IM07" });
      if (fjres.state) { this.fjAuthority = fjres.hasAuthority; }
      if (djres.state) { this.djAuthority = djres.hasAuthority; }
    },
    //置空所有筛选条件
    conditionReset() {
      this.comparSwitch = false
      this.formData.test_no = '';
      this.formData.companyname = '';
      this.formData.StationCode = '';
      this.formData.repairdate = ['', ''];
      this.formData.Vehicleplatenumber = '';
      this.formData.CheckType = '0';
      this.formData.CheckResult = '';
      this.isShow = false;
      this.getAllData(this.pageNum, this.pageSize, this.formData)
    },
    // 筛选搜索
    searchData() {
      this.isShow = false;
      this.comparSwitch = false
      if (this.formData.CheckType !== '0') {
        this.comparSwitch = true
      }
      this.getAllData(this.pageNum, this.pageSize, this.formData)
    },

    // 计算表格高度
    getTabHeight() {
      this.tabHeight = this.$refs.tableInfo.offsetHeight
    },
    pageNumChange(value) {
      this.pageNum = value
      this.getAllData(this.pageNum, this.pageSize, this.formData)
    },
    pageSizeChange(value) {
      this.pageSize = value
      this.getAllData(this.pageNum, this.pageSize, this.formData)
    },

    // 获取所有数据
    async getAllData(pageNum, pageSize, formData) {
      this.tableHeader = [
        {
          type: 'index',
          title: '序号',
          key: 'RowNum',
          width: 70,
          align: 'center'
        }, {
          title: '检测报告编号',
          key: 'test_no',
          minWidth: 120,
          align: 'center'
        }, {
          title: '车牌号码',
          key: 'Vehicleplatenumber',
          minWidth: 120,
          align: 'center',
          render: (h, param) => {
            return h("div", [
              h(
                "span",
                {
                  style: this.setVLPNColor(param.row.VLPNColor)
                },
                param.row.Vehicleplatenumber
              )
            ]);
          }
        }, {
          title: '车架号',
          key: 'Vin',
          minWidth: 150,
          align: 'center'
        }, {
          title: '故障描述',
          key: 'Faultdescription',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '送修里程',
          key: 'repairmileage',
          minWidth: 100,
          align: 'center'
        }
        , {
          title: '送修日期',
          key: 'repairdate',
          minWidth: 150,
          align: 'center'
        }, {
          title: '结算日期',
          key: 'settledate',
          minWidth: 150,
          align: 'center'
        }, {
          title: '维修企业名称',
          key: 'companyname',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '检测站名称',
          key: 'StationCode',
          minWidth: 120,
          align: 'center',
          render: (h, param) => {
            let result = this.returncodenames(
              this.stationList,
              param.row.StationCode
            );
            return h("span", {}, result);
          }
        },
        {
          title: '检测日期',
          key: 'DetectendTime',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 100,
          align: 'center'
        }
      ];
      if (this.formData.CheckType !== '0') {
        this.tableHeader = [
          {
            type: 'index',
            title: '序号',
            key: 'RowNum',
            minWidth: 50,
            align: 'center'
          }, {
            title: '检测报告编号',
            key: 'test_no',
            minWidth: 120,
            align: 'center'
          }, {
            title: '车牌号码',
            key: 'Vehicleplatenumber',
            minWidth: 120,
            align: 'center',
            render: (h, param) => {
              return h("div", [
                h(
                  "span",
                  {
                    style: this.setVLPNColor(param.row.VLPNColor)
                  },
                  param.row.Vehicleplatenumber
                )
              ]);
            }
          }, {
            title: '车架号',
            key: 'Vin',
            minWidth: 150,
            align: 'center'
          }, {
            title: '故障描述',
            key: 'Faultdescription',
            minWidth: 150,
            align: 'center'
          },
          {
            title: '送修里程',
            key: 'repairmileage',
            minWidth: 100,
            align: 'center'
          }
          , {
            title: '送修日期',
            key: 'repairdate',
            minWidth: 150,
            align: 'center'
          }, {
            title: '结算日期',
            key: 'settledate',
            minWidth: 150,
            align: 'center'
          }, {
            title: '维修企业名称',
            key: 'companyname',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '检测站名称',
            key: 'StationCode',
            minWidth: 120,
            align: 'center',
            render: (h, param) => {
              let result = this.returncodenames(
                this.stationList,
                param.row.StationCode
              );
              return h("span", {}, result);
            }
          },
          {
            title: '检测日期',
            key: 'DetectendTime',
            minWidth: 150,
            align: 'center'
          },
          {
            title: this.formData.CheckType == '1' ? '复检结果' : '多检结果',
            key: 'VDCT',
            minWidth: 100,
            align: 'center',
            render: (h, param) => {
              let a = '';
              if (param.row.VDCT == '0') a = '不通过';
              else if (param.row.VDCT == '1') a = '通过';
              return h("span", a);
            }
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ];
      }
      this.loading = true;
      let param = formData;
      let params = { pageNum, pageSize, param }
      this.$curl.get('api/hj/IM/getAllRepairInfo', { params }).then(res => {
        this.loading = false;
        this.tableData = res.repairData
        this.total = res.total
      })
    },
    // 数据详情
    showDetail(row, index) {
      this.selectData = row;
      this.showDrawer = true;
    },
    // 检测数据对比
    showMethodData(row, index) {
      this.selectData = row;
      let VIN = this.selectData.Vin;
      let DetectEndTime = this.selectData.DetectendTime;
      this.getlastInspectionNum(VIN, DetectEndTime)
      this.showMethodDrawer = true;
    },
    async getlastInspectionNum(VIN, DetectEndTime) {
      let res = await this.$curl.get("api/hj/IM/getlastInspectionNum", { params: { VIN, DetectEndTime } })
      this.lastInspectionNum = res.lastInspectionNum
      // console.log('父组件',this.lastInspectionNum);
      this.$nextTick(() => {
        this.$refs.comparedata.getlastInspectionNum(res.lastInspectionNum);
      });

    },
    setVLPNColor(VLPNColor) {
      if (!this.$hjconfig.vlpn_c[VLPNColor]) return {};
      const vlpn_c = this.$hjconfig.vlpn_c[VLPNColor];
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
    //数据过滤
    returncodenames(namelist, codeValue) {
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.CodeValue == codeValue) CodeName = item.CodeName;
      });
      return CodeName;
    },

  }
}
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
  .thePager {
    padding: 5px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
  }
}
</style>
