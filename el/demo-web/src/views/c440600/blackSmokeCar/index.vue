<template>
  <div style="height:100%;" ref="blackCar" @click="sxshow=false">
    <div style="padding:10px 20px;">
      <Row type="flex" style>
        <Col span="20">
          <div style="display: inline-block">
            <span>检测站:</span>
            <span>
              <Select v-model="serachInfo.StationCode" style="width:200px;margin:0 10px" clearable @on-change="changesearch">
                <Option value="all">全部</Option>
                <Option v-for="item in staionList" :value="item.StationCode" :key="item.StationCode">{{ item.StationName }}</Option>
              </Select>
            </span>
          </div>
          <div style="display: inline-block">
            <span>车牌号：</span>
            <Input v-model="likeValue" placeholder="车牌号" @on-change="likeSearch" style="margin-left:10px;width: 250px" />
          </div>
          <div style="display: inline-block;margin-left:10px">
            <span>受理编号：</span>
            <Input v-model="serachInfo.InspectionNum" placeholder="受理编号" @on-change="changeInspectionNum" style="margin-left:10px;width: 250px" />
          </div>
          <div style="display: inline-block;margin-left:10px">
            <Select v-model="serachInfo.LingmanRank" style="width:100px;margin:0 10px" @on-change="changeLingmanRank" placeholder="选择等级" clearable>
              <Option v-for="item in LingmanRankList" :value="item.LingmanRankCode" :key="item.LingmanRankCode">{{ item.LingmanRank }}</Option>
            </Select>
          </div>
        </Col>
        <Col span="4">
          <span style="cursor:pointer;float: right;">
            <Button :type="tglpx_show?'primary':'default'" icon="ios-funnel" style="float:right;marginLeft:10px" @click="tglpx_show = !tglpx_show">筛选</Button>
            <div v-show="tglpx_show" class="tglpx_showes fx__bgcolor">
              <Card title="黑烟车抓拍查询筛选" icon="ios-options" :padding="15" shadow>
                <Row :gutter="5">
                  <Col span="6" style="text-align: right;padding-top: 2%;">车牌号码：</Col>
                  <Col span="18">
                    <Input style="width: 100%;" placeholder="请输入车牌号码..." v-model="serachInfo.VLPN" clearable />
                  </Col>
                  <Col span="6" style="text-align: right;padding-top: 2%;">受理编号：</Col>
                  <Col span="18">
                    <Input style="width: 100%;" placeholder="请输入受理编号..." v-model="serachInfo.InspectionNum" clearable />
                  </Col>
                  <Col span="6" style="text-align: right;padding-top: 2%;margin-top: 5px">抓拍时间：</Col>
                  <Col span="18" style="margin-top: 5px;">
                    <DatePicker type="daterange" placement="bottom-end" :split-panels="true" placeholder="请输入日期..." style="width: 100%;" v-model="ZPRQ" clearable></DatePicker>
                  </Col>
                </Row>

                <div style="display: flex;justify-content:flex-end;margin-top:10px;">
                  <Button type="primary" style="float: right;marginRight:10px" @click="handleSeachCar">检索</Button>
                  <Button type="primary" style="float: right;" @click="reset">重置</Button>
                </div>
              </Card>
            </div>
          </span>
        </Col>
      </Row>
    </div>
    <div :style="{ height: height - 80 + 'px' }" style="overflow:auto;">
      <blackSmokeCar1 :list="list" :imgList="imgList" :number="number" />
    </div>
    <Page style="position:fixed;bottom: 0px; width: 100%; padding: 8px 20px; background-color: rgba(81, 90, 110, 0.3);" :total="dataCount" show-elevator :current="pageIndex" :page-size="pageSize" @on-change="handleChangeIndex" show-total />
  </div>
</template>
<script>
import blackSmokeCar1 from './blackSmokeCar1.vue'
import { formatDates } from './../../utils/utils'
export default {
  data() {
    return {
      isShow: false,
      tglpx_show: false,
      IsTransfer: false,
      serachInfo: {},
      likeValue: '',
      staionList: [],
      model1: '',
      list: [],
      ZPRQ: [],
      pageIndex: 1,
      pageSize: 8,
      dataCount: 0,
      imgList: [],
      height: 0,
      number: {
        xxl: 6,
        xl: 8,
        lg: 12
      },
      LingmanRankList: [
        { LingmanRankCode: 0, LingmanRank: "0" },
        { LingmanRankCode: 1, LingmanRank: "1" },
        { LingmanRankCode: 2, LingmanRank: "2" },
        { LingmanRankCode: 3, LingmanRank: "3" },
        { LingmanRankCode: 4, LingmanRank: "4" },
        { LingmanRankCode: 5, LingmanRank: "5" },
      ]
    }
  },
  components: {
    blackSmokeCar1
  },
  watch: {
    '$route': {
      immediate: true,
      handler: function (newRouter) {
        if (newRouter.name != 'hj-blackSmokeCar') return;
        if (newRouter.query.BusinessKey) {
          this.serachInfo.InspectionNum = newRouter.query.BusinessKey;
          this.Data_Processing()
        }

      }

      // console.log(newRouter)
    }
  },
  methods: {
    handleChangeIndex(index) {
      this.pageIndex = index
      this.Data_Processing()
    },
    setHeight() {
      this.height = this.$refs.blackCar.offsetHeight - 30
    },
    handleSeachCar() {
      this.sxshow = false
      this.Data_Processing()
    },
    changesearch() {
      this.Data_Processing()
    },
    changeLingmanRank() {
      this.pageIndex = 1;
      this.Data_Processing()
    },
    changeInspectionNum() {
      this.pageIndex = 1;
      this.Data_Processing()
    },
    reset() {
      this.serachInfo.StationCode = ''
      this.ZPRQ = ''
      this.serachInfo.VLPN = ''
      this.serachInfo.LingmanRank = ''
      this.Data_Processing()
    },
    likeSearch() {
      this.serachInfo.VLPN = this.likeValue;
      this.pageIndex = 1
      this.Data_Processing()
    },
    async Data_Processing() {
      let _this = this
      if (
        _this.serachInfo.StationCode == 'all' ||
        _this.serachInfo.StationCode == 'hj-config'
      )
        delete _this.serachInfo.StationCode
      let parmas = {
        StationCode: _this.serachInfo.StationCode,
        VLPN: _this.serachInfo.VLPN,
        LingmanRank: _this.serachInfo.LingmanRank,
        InspectionNum: _this.serachInfo.InspectionNum,
        ZPRQ1: formatDates(_this.ZPRQ[0], 'yyyy-MM-dd 00:00:00'),
        ZPRQ2: formatDates(_this.ZPRQ[1], 'yyyy-MM-dd 23:59:59'),
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      _this.$curl
        .get('api/hj/getBlackSmokeCheck', { param: JSON.stringify(parmas) })
        .then(res => {
          const { data, code, imgList, Count } = res
          if (code == 200) {
            data.forEach(v => {
              v.imgSrc = `${imgList[0].FieldValue}/${(v.CaptureTime + '')
                .replace('-', '')
                .replace('-', '')
                .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.ImgFile1}`
              v.hycVideoSrc = `${imgList[0].FieldValue}/${(v.CaptureTime + '')
                .replace('-', '')
                .replace('-', '')
                .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.VideoFile}`
              v.ysVideoSrc = `${imgList[0].FieldValue}/OriginalVideo/${(
                v.CaptureTime + ''
              )
                .replace('-', '')
                .replace('-', '')
                .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.VideoFile}`
            })
            this.list = data
            //console.log('this.list', this.list);
            this.imgList = imgList
            this.dataCount = Count.total
          }
        })
    },
    getStaionList() {
      this.$curl.get('api/hj/getStationsZD').then(res => {
        this.staionList = res.result;
        //console.log('this.staionList', this.staionList);
      })
    }
  },
  mounted() {
    this.getStaionList();
    this.Data_Processing()
    this.setHeight()
    window.addEventListener('resize', this.setHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.setHeight)
  }
}
</script>
<style scoped lang="less">
.pdr10px {
  padding-right: 0px;
}
.tglpx_showes {
  position: absolute;
  width: 340px;
  top: 38px;
  right: 3px;
  z-index: 9999;
  box-shadow: rgba(0, 0, 0, 0.35) -4px 7px 10px 2px;
  border-radius: 4px;
}
#card div:nth-child(4n) {
  padding-right: 0px;
}
#card div:last-child {
  margin-bottom: 0px;
}
#card /deep/ .ivu-modal-body {
  padding: 0px;
}
</style>