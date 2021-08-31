<template>
  <div ref="muitAudit" style="height:100%;width:100%">
    <!-- 头部搜索 -->
    <div style="height:52px;padding:10px;width:100%">
      <span>
        车牌/车架号：
        <Input v-model="likeValue" placeholder="车牌号/车架号" @on-change="likeSearch" style="margin-left:10px;width: 250px" />
      </span>
      <Button :type="isShow==true?'primary':'default'" icon="ios-funnel" style="float:right;marginRight:10px" @click.stop="isShow=!isShow">筛选</Button>
      <div class="" v-show="isShow" style="position:absolute;right:20px;top:50px;z-index:100;border-radius: 4px">
        <Card title="条件" icon="ios-options" :padding="15" shadow style="width: 350px;">
          <Form class="" :label-width="100">
            <FormItem class="item" label="检测日期：" style="margin: 5px 0px;width: 100%;">
              <DatePicker class="itemValue" type="daterange" :split-panels="true" placeholder="请选择检测日期" v-model="IUIDATE" style="width: 100%;"></DatePicker>
            </FormItem>
            <FormItem class="item" label="车架号：" style="margin: 5px 0px;width: 100%;">
              <Input class="" v-model.trim="searchInfo.VIN" clearable style="width:100%;;" placeholder="请输入车架号..." />
            </FormItem>
            <FormItem class="item" label="车牌号：" style="margin: 5px 0px;width: 100%;">
              <Input class="" v-model.trim="searchInfo.VLPN" clearable style="width:100%;;" placeholder="请输入车牌号..." />
            </FormItem>
            <div style="width:100%;margin: 10px 0px 0px 0px;display:flex;justify-content:center">
              <Button type="primary" @click="getDate" style="margin:0px 20px">检索</Button>
              <Button type="primary" @click="reset" style="margin:0px 10px">重置</Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
    <!-- 表 -->
    <Table border :columns="columnsList" :data="dataTable" highlight-row :height="height">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="editInfo(row,index)">修改</Button>
      </template>
    </Table>
    <!-- 分页 -->
    <Page :total="dataCount" show-total style="padding:6px" :page-size="pageSize" :current="currentPage" @on-change="changePage" />
    <!-- 弹框 -->
    <Modal v-model="eidtModel" width="360">
      <p slot="header" class="fx__text_default">
        <Icon type="md-color-filter"></Icon>
        <span>修改可以再次检测时间间隔</span>
      </p>
      <div style="text-align:center">
        <span>
          时间间隔（单位：小时）：
          <Input v-model.trim="HowLongTimes" clearable style="width:174px;" />
        </span>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="handleSure">保存</Button>
        <Button type="default" size="large" @click="eidtModel=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formatDates, getCDData } from '../../utils/utils'
export default {
  data() {
    return {
      searchInfo: {},
      likeValue: '',
      StationCodeList: [], //检测站列表
      columnsList: [
        {
          align: 'center',
          type: 'index',
          width: 60
        },
        {
          title: '检测站名称',
          key: 'StationCode',
          render: (h, params) => {
            return h('span', {}, this.initInfo.Station[params.row.StationCode])
          },
          minWidth: 150,
          tooltip: true
        },
        {
          title: '车牌号',
          key: 'VLPN',
          minWidth: 120
        },
        {
          title: '车架号',
          key: 'VIN',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '检测方法',
          key: 'IUTYPE',
          render: (h, params) => {
            return h(
              'span',
              {},
              this.initInfo.InspectionMethod[params.row.IUTYPE]
            )
          },
          minWidth: 130
        },
        {
          title: '检测时间',
          key: 'IUIDATE',
          minWidth: 170
        },
        {
          title: '允许检测时间',
          key: 'IsOkInspectionDate',
          minWidth: 170
        },
        {
          title: '再次检测时间间隔',
          key: 'HowLongTimes',
          minWidth: 170
        },
        {
          title: '同周期已检次数',
          key: 'InspectionTimes',
          minWidth: 150
        },
        {
          title: '修改时间间隔',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 130
        }
      ],
      dataTable: [],
      dataCount: 0,
      pageSize: 20,
      currentPage: 1,
      IUIDATE: [],
      height: 0,
      initInfo: {}, //cd表内容
      eidtModel: false,
      HowLongTimes: 0, //时间间隔
      selectDate: {},
      isShow: false
    }
  },
  methods: {
    editInfo(row, index) {
      this.eidtModel = true
      this.HowLongTimes = row.HowLongTimes
      this.selectDate = row
    },
    //保存修改
    handleSure() {
      const params = {
        HowLongTimes: this.HowLongTimes,
        IUIDATE: this.selectDate.IUIDATE,
        InspectionAuditID: this.selectDate.InspectionAuditID,
        VehicleID:this.selectDate.VehicleID
      }
      this.$curl.post('api/hj/editHowLongTimes', params).then(res => {
        if (res.state) {
          this.$Message.success(res.msg)
          this.eidtModel = false
          this.getDate()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    //获取数据
    getDate() {
      this.searchInfo.IUIDATE1 = formatDates(this.IUIDATE[0], 'yyyy-MM-dd 00:00:00')
      this.searchInfo.IUIDATE2 = formatDates(this.IUIDATE[1], 'yyyy-MM-dd 23:59:59')
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...this.searchInfo
      }
      this.$curl.get('api/hj/getMuitAuditDate', { param: JSON.stringify(params) }).then(res => {
        if (res.state) {
          this.dataTable = res.result
          this.dataCount = res.count
        } else {
          this.$Message.error('查询数据失败！')
        }
      })
    },
    reset() { //重置筛选条件
      // this.searchInfo.StationCode = null
      this.IUIDATE = []
      this.searchInfo.VIN = null
      this.searchInfo.VLPN = null
      this.getDate()
    },
    likeSearch() {
      this.searchInfo.VIN = this.likeValue
      this.searchInfo.VLPN = this.likeValue
      this.getDate()
    },
    setHeight() {
      this.height = this.$refs.muitAudit.offsetHeight - 100
    },
    getOption() {
      const self = this
      self.getStionOption()
      let cdname = [
        {
          tableName: 'CD_InspectionMethod',
          columns: 'CodeValue,CodeName',
          where: 'where IsAvailable=1'
        },
        {
          tableName: 'StationInfo',
          columns: 'StationCode as CodeValue,StationName as CodeName',
          where: ''
        }
      ]
      const CDtable = ['InspectionMethod', 'Station']
      getCDData(self, cdname).then(res => {
        const { state, data, msg } = res
        if (state) {
          data.forEach((d, index) => {
            self.initInfo[CDtable[index]] = {}
            d.forEach(v => {
              self.initInfo[CDtable[index]][v.CodeValue] = v.CodeName
            })
          })
          self.getDate()
        }
      })
    },
    changePage(index) {
      this.currentPage = index
      this.getDate()
    },
    getStionOption() {
      this.$curl.get('api/hj/getStationsZD').then(res => {
        this.StationCodeList = res.result
      })
    }
  },
  mounted() {
    // this.setHeight()
    this.$nextTick(() => {
      this.setHeight();
    })
    this.getOption()
    window.addEventListener('resize', this.setHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.setHeight)
  }
}
</script>

<style lang="scss" scoped>
.itemBox {
  display: flex;
  margin-bottom: 5px;
  .itemTitle {
    width: 70px;
    display: flex;
    align-items: center;
  }
}
</style>