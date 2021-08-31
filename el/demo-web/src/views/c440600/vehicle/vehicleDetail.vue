<template>
  <div style ref="vcif" class="detail_container">
    <!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
    <Tabs style="height:100%;" v-if="CheckedTab.length > 0 && update" @on-click="Tabclick" v-model="selectTab" name='tab1' :animated="false">
      
      <TabPane v-for="(item, index) in CheckedTab" :key="index" :label="item.tabName" :icon="item.icon" :name="item.tabKey" tab="tab1">
        <summary-Info v-if="item.tabKey === 'summanyTab'" :tabkey="selectTab" :Vecid="vehileID" :cddata="cddata" v-bind:style="{ height: VecH - 100 + 'px' }" @selectV="changeTab" :selectVIN="selectVIN" :vehicleData='vehicleData' ref="summaryInfo"></summary-Info>
        <print-Report v-else-if="item.tabKey === 'reportTab'" :vehicleData='vehicleData' :Vecid="Vehicleid" :selectVIN="selectVIN" :cddata="cddata" v-bind:style="{ height: VecH - 100 + 'px' }" ref='reportTab'></print-Report>
        <vehicle-info v-else-if="item.tabKey === 'vehicleTab'" :encrypt_value="encrypt_value" :hasAuthority="hasAuthority" :Vecid="Vehicleid" :vehicleData='vehicleData' @refreshList="seachso" v-bind:style="{ height: VecH - 130 + 'px' }" ref='VehicleInfo'></vehicle-info>
        <keyInfo-Change v-else-if="item.tabKey === 'mainInfoTab'" :Vecid="Vehicleid" v-bind:style="{ height: VecH - 100 + 'px' }" ref='keyInfoChange'></keyInfo-Change>
        <data-View v-else-if="item.tabKey === 'dataView'" :Vecid="Vehicleid" :cddata="cddata" v-bind:style="{ height: VecH - 130 + 'px' }" ref='dataView'></data-View>
        <remote-Inspect v-else-if="item.tabKey === 'remoteInspect'" :Vecid="Vehicleid" :selectVIN="selectVIN" :cddata="cddata" v-bind:style="{ height: VecH - 130 + 'px' }" ref='remoteInspect'></remote-Inspect>
      </TabPane>

      <!-- <TabPane label="摘要信息" icon="logo-buffer" name="summanyTab" tab='tab1'>
        <summary-Info :Vecid="Vehicleid" :cddata="cddata" v-bind:style="{ height: VecH - 100 + 'px' }" @selectV="changeTab" :selectVIN="selectVIN" :vehicleData='vehicleData' ref="summaryInfo"></summary-Info>
      </TabPane>
      <TabPane label="检测报告" icon="md-print" name="reportTab" tab='tab1'>
        <print-Report :Vecid="Vehicleid" :selectVIN="selectVIN" :cddata="cddata" v-bind:style="{ height: VecH - 100 + 'px' }" ref='reportTab'></print-Report>
      </TabPane>
      <TabPane label="车辆信息" icon="ios-document" name="vehicleTab" tab='tab1'>
        <vehicle-info :hasAuthority="hasAuthority" :Vecid="Vehicleid" :vehicleData='vehicleData' @refreshList="seachso" v-bind:style="{ height: VecH - 130 + 'px' }" ref='VehicleInfo'></vehicle-info>
      </TabPane>
      <TabPane label="关键信息更改记录" icon="ios-construct" name="mainInfoTab" tab='tab1'>
        <keyInfo-Change :Vecid="Vehicleid" v-bind:style="{ height: VecH - 100 + 'px' }" ref='keyInfoChange'></keyInfo-Change>
      </TabPane>
      <TabPane label="资料查看" icon="ios-book" name="dataView" tab='tab1'>
        <data-View :Vecid="Vehicleid" :cddata="cddata" v-bind:style="{ height: VecH - 130 + 'px' }" ref='dataView'></data-View>
      </TabPane> -->
      <Button v-show='clbf&&!vehicleData.IsInValid' @click="abandonVehicle" style="margin-top:2px;margin-right:3px;background-color:rgb(100, 115, 131);color:#fff" slot="extra">车辆报废</Button>
      <Button v-show="tjhmd&&Rew.hmd>0" @click="removeList('01')" style="margin-top:2px;margin-right:3px;background-color:rgb(105, 131, 239);color:#fff" slot="extra">移出黑名单</Button>
      <Button v-show="tjhmd&&!Rew.hmd>0" @click="blackModel=true" style="margin-top:2px;margin-right:3px;background-color:rgb(105, 131, 239);color:#fff" slot="extra">添加到黑名单</Button>
      <Button v-show="tjbmd&&Rew.bmd>0" @click="removeList('02')" style="margin-top:2px;margin-right:3px;background-color:#1CBFD4;color:#fff" slot="extra">移出白名单</Button>
      <Button v-show="tjbmd&&!Rew.bmd>0" @click="waithModel=true" style="margin-top:2px;margin-right:3px;background-color:#1CBFD4;color:#fff" slot="extra">添加到白名单</Button>
      <Button v-show="tjzdgz&&Rew.zdgz>0" @click="removeList('03')" style="margin-top:2px;margin-right:3px;background-color:rgb(247, 181, 59);color:#fff" slot="extra">移出重点关注</Button>
      <Button v-show="tjzdgz&&!Rew.zdgz>0" @click="zdModel=true" style="margin-top:2px;margin-right:3px;background-color:rgb(247, 181, 59);color:#fff" slot="extra">添加到重点关注</Button>
      <Modal v-model="blackModel" width="445">
        <p slot="header" class="fx__text_default" style="text-align:center;font-size:16px;padding-bottom:0px;">添加到黑名单</p>
        <black-List :vehicleData='vehicleData' :Vecid="Vehicleid" @refreshData="refresh('1')" :cddata="cddata" ref="black"></black-List>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel('1')">取消</Button>
          <Button type="primary" size="large" @click="saveadd('1')">确定</Button>
        </div>
      </Modal>
      <Modal v-model="waithModel" width="445">
        <p slot="header" class="fx__text_default" style="text-align:center;font-size:16px;padding-bottom:0px;">添加到白名单</p>
        <white-List :Vecid="Vehicleid" @refreshData="refresh('2')" :vehicleData='vehicleData' ref="white" :cddata="cddata"></white-List>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel('2')">取消</Button>
          <Button type="primary" size="large" @click="saveadd('2')">确定</Button>
        </div>
      </Modal>
      <Modal v-model="zdModel" width="445">
        <p slot="header" class="fx__text_default" style="text-align:center;font-size:16px;padding-bottom:0px;">新增重点关注</p>
        <focuson-Vehicles :Vecid="Vehicleid" @refreshData="refresh('3')" ref="focu" :vehicleData='vehicleData'></focuson-Vehicles>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel('3')">取消</Button>
          <Button type="primary" size="large" @click="saveadd('3')">确定</Button>
        </div>
      </Modal>
    </Tabs>
  </div>
</template>
<script>
import { addOperaLog } from '../../../HJ/utils/utils'
const path = require("path");
const files = require.context("../../../HJ/views/vehicle", false, /\.vue$/);
const modules = {};
files.keys().forEach(key => {
  const name = path.basename(key, ".vue");
  modules[name] = files(key).default || files(key);
});
export default {
  name: "vehicleDetail",
  components: {
    ...modules
  },
  props: {
    Vlpn: {
      type: String,
      required: true
    },
    VecH: {
      type: Number
    },
    Vehicleid: {
      type: Number
    },
    Rew: {
      type: Object
    },
    cddata: {
      type: Object
    },
    hasAuthority: {
      type: Boolean
    },
    selectVIN:{
      type:String
    },
    UserTabConfig: {
      type: Array
    },
    encrypt_value:{
      type:Boolean,
      default:"",
    }
  },
  data() {
    return {
      // spinShow:true,
      selectTab: "summanyTab",
      blackModel: false,
      waithModel: false,
      zdModel: false,
      vehicleData: {}, //车辆基本信息
      vehileID:null,
      clbf: false,
      tjhmd: false,
      tjbmd: false,
      tjzdgz: false,
      update: false
    };
  },
  watch: {
    UserTabConfig: function(newval) {
      this.update = false;
      this.$nextTick(() => {
        this.update = true;
      })
    }
  },
  computed: {
    CheckedTab () {     
      // console.log(this.UserTabConfig.filter(item => item.isChecked === true));
      return this.UserTabConfig.filter(item => item.isChecked === true);
    }
  },
  mounted() {
    this.getUserOperateAuth();
  },
  methods: {
    changeTab(value) {
      this.selectTab = value;
    },
    Tabclick(value) {
      this.selectTab = value||this.selectTab;
      if(this.selectTab=="summanyTab"){
        // this.$refs.summaryInfo.loaddata();
        // this.$refs.summaryInfo.getSpeciallInfo();
        this.$refs.summaryInfo[0].loaddata();
        this.$refs.summaryInfo[0].getSpeciallInfo();
      }
      if (this.selectTab == "reportTab") {
        // this.$refs.reportTab.loaddata();
        this.$refs.reportTab[0].loaddata();
      }
      if (this.selectTab == "vehicleTab") {
        // console.log(this.$refs.VehicleInfo);
        // this.$refs.VehicleInfo.getDBinfoByMultipt();
        // this.$refs.VehicleInfo.getImgList();
        this.$refs.VehicleInfo[0].getDBinfoByMultipt();
        this.$refs.VehicleInfo[0].getImgList();
      }
      if (this.selectTab == "mainInfoTab") {
        // this.$refs.keyInfoChange.getInfo();
        this.$refs.keyInfoChange[0].getInfo();
      }
      if (this.selectTab == "dataView") {
        // this.$refs.dataView.getCurrentVehicleImg();
        this.$refs.dataView[0].getCurrentVehicleImg();
      }
      if (this.selectTab == "remoteInspect") {
        // console.log(this.$refs.remoteInspect)
        this.$refs.remoteInspect[0].getTableData();
      }
    },
    seachso() {
      this.$emit("sechdata");
      this.$emit("handleListVehielData");
    },
    refresh(para) {
      if (para == "1") {
        this.seachso();
        this.Rew.hmd = 1;
      } else if (para == "2") {
        this.seachso();
        this.Rew.bmd = 1;
      } else {
        this.seachso();
        this.Rew.zdgz = 1;
      }
    },
    removeList(num) {
      this.$Modal.confirm({
        content: '<p style="font-size:15px;color:red;">确定要移出吗？</p>',
        width: 270,
        onOk: () => {
          const _this = this;
          this.$curl
            .post("api/hj/removeList", { VehicleID: this.Vehicleid, Num: num })
            .then(res => {
              _this.$Message.success(res.msg);
              let params={}
              params.DataSource=[]
              if (num == "01") {
                _this.Rew.hmd = 0;
                params.DataTable='Blacklist'
                params.DataSource.push(`{old:'inBlackList',new:'removeBlackList',filed:VehicleID}`)
                addOperaLog(_this,params)
              } else if (num == "02") {
                _this.Rew.bmd = 0;
                params.DataTable='WhiteList'
                params.DataSource.push(`{old:'inWhiteList',new:'removeWhiteList',filed:VehicleID}`)
                addOperaLog(_this,params)
              } else {
                _this.Rew.zdgz = 0;
                params.DataTable='SpecialAttentionVehicle'
                params.DataSource.push(`{old:'inSpecialAttentionVehicle',new:'removeSpecialAttentionVehicle',filed:VehicleID}`)
                addOperaLog(_this,params)
              }
              _this.seachso();
            })
            .catch(err => {
              _this.$Message.error("操作失败!");
            });

          this.$refs.summaryInfo.getSpeciallInfo();
          this.$emit("handleListVehielData");
        },
        onCancel: () => {}
      });
    },
    abandonVehicle() {
      this.$Modal.confirm({
        content:
          '<p style="font-size:15px;color:red;">确定要报废这辆车吗？</p>',
        width: 270,
        onOk: () => {
          const _this = this;
          _this.vehicleData.IsInValid = 1;
          this.$curl
            .post("api/hj/saveChangeInfoAndLog", { params: _this.vehicleData })
            .then(res => {
              _this.$Message.success(res.msg);
              _this.seachso();
              _this.getVehicleDate();
              // to do vehicle  opera log
              let params={}
              params.DataSource=[]
              params.DataTable='VEHICLE'
              params.DataSource.push(`{old:'',new:'添加报废车辆ID：${_this.Vehicleid}'}`)
              addOperaLog(_this,params)
            })
            .catch(err => {
              _this.$Message.error("操作失败!");
            });
        },
        onCancel: () => {}
      });
    },
    saveadd(dex) {
      if (dex == "1") {
        this.blackModel = this.$refs.black.saveaddBlacklist();
        this.$refs.summaryInfo.getSpeciallInfo();
      } else if (dex == "2") {
        this.waithModel = this.$refs.white.saveaddWhitelist();
        this.$refs.summaryInfo.getSpeciallInfo();
      } else {
        this.zdModel = this.$refs.focu.saveaddFocuson();
        this.$refs.summaryInfo.getSpeciallInfo();
      }
    },
    cancel(dex) {
      if (dex == "1") {
        this.blackModel = false;
      } else if (dex == "2") {
        this.waithModel = false;
      } else {
        this.zdModel = false;
      }
    },
  getVehicleDate() {
      const _this = this;
      _this.vehicleData={};
      // if (_this.hasAuthority) this.spinShow = true;
      _this.$curl
        .get("api/hj/getVehicleInfoByVehicleID", { param: JSON.stringify(_this.Vehicleid) })
        .then(function(res) {
          // _this.spinShow = false;
          if (res.data.length > 0) {
            if (res.data[0].EDSPL > 0)
              res.data[0].EDSPL = res.data[0].EDSPL.toFixed(2);
            _this.vehicleData = res.data[0];
            _this.vehileID=_this.Vehicleid;
          }
        })
        .catch(err => {
          // _this.spinShow = false;
          _this.$Message.error("获取该车辆信息失败！");
        });
    },
    getUserOperateAuth() {
      // 获取用户操作权限：车辆报废、添加黑名单、添加白名单、添加重点关注
      const _this = this;
      this.$curl.get('api/hj/getUserOperateAuth')
      .then(res => {
        if(res.code){
          _this.clbf = res.data.clbf;
          _this.tjbmd = res.data.tjbmd;
          _this.tjhmd = res.data.tjhmd;
          _this.tjzdgz = res.data.tjzdgz;
        }
      })
    },
  }
};
</script>
<style lang="less" scoped>
.ivu-tabs-nav-container {
  // background-color:#fff;
}

.ivu-tabs {
  overflow: hidden hidden;
}
.detail_container {
  position: relative;
  // height:100%;
  // background-color: #fff;
  // padding: 10px;
}
</style>
