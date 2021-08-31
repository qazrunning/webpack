
<template>
  <div class="content" ref="box">
    <div class="head">
      <div class="head__left" style="display:flex;">
        <!-- <div class="head__title" style="margin-right: 20px;">业务审核</div> -->
      </div>
      <div class="head__right">
        <div class style="display:flex;">
          <Button type="default" class="btn-static-switch" :class="{screen:islayoutscreen}" @click=" swicthdisplay">{{isShowStaticDiv ? '收起': '统计'}}</Button>
          <Dropdown style="margin-left:10px;" @on-click="swicthlayout" class="setting">
            <Button type="default">
              <i class="fa fa-cog icon-setting"></i>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem :selected="!islayoutscreen" name="nofull">左右布局</DropdownItem>
              <DropdownItem :selected="islayoutscreen" name="full">全屏布局</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button icon="ios-search" style="margin-left:4px;" @click="historySearch">历史查询</Button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="left main__left fx__box" :class="{screen:islayoutscreen,ShowStaticDiv:isShowStaticDiv}">
        <div style="display:flex;justify-content: space-between;">
          <fx-filter @on-filter="onFilter" @on-keyword="onSearch" ref="filter1" :style-keyword="{width:'200px'}">
            <template v-slot:right>
              <span style="margin-left:10px;">
                待审核数：
                <span style="color:#f00;">{{myCount}}</span>
              </span>
            </template>
          </fx-filter>
          <div style="flex:1;text-align:end;padding-right:12px;padding-top:3px;">
            <!-- <Button type="primary" size="small" @click="loadData">刷新</Button> -->
            <!-- <i title='刷新' class="fa fa-refresh fa-2x icons" aria-hidden="true" @click="loadData"></i> -->
            <Icon title='刷新' type="md-refresh" class="icons" size="26" @click="loadData"/>
          </div>
          <Dropdown>
            <i class="fa fa-tasks icons" style="font-size:22px;height:32px;line-height:32px;"></i>
            <!--  -->
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in groupOpts.items" :key="index">
                <div @click="onSelect(index)">{{item.text}}</div>
              </DropdownItem>
              <DropdownItem>
                <span @click="switchfoldOnOff()">{{allfoldClose ? '全部关闭':'全部展开'}}</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="line-divide fx__line_divide"></div>

        <fx-grid :Opts="gridOpts" @on-update="onUpdate" ref="grid1" class="gridlayout">
          <template v-slot:groups="{groups}">
            <div v-show="groups.length>0" class="gridlayoutgroup fx__group" v-for="(group,index) in groups" :key="index">
              <div class="collapse__header" :class="{'fx__group_head-open':group.isfold}" style="font-size:1rem;user-select:none;" @click="onclick(group,$event)">
                <span class="arrow" v-bind:class="{rotate90:group.isfold}">
                  <i class="fa fa-angle-right"></i>
                </span>
                <span>{{group.groupText}}</span>
                <Badge class="right_badge" :title="group.children.length" :count="group.children.length" type="warning"></Badge>
              </div>
              <div v-if="group.isfold" commnet="/*折叠*/">
                <div v-for="(item,subindex) in group.children" :key="subindex" class="gridlayoutrow fx__item" :class="{'fx__item-selected':gridSelectRow==item.RowData}" @click="routeToUser(''+item.RowData.CheckId)">
                  <transition>
                    <keep-alive>
                      <component v-bind:is="showCartView(item.CheckType)" :CartForm="item.RowData" :initform="initform" ref="CartDom"></component>
                    </keep-alive>
                  </transition>
                </div>
              </div>
            </div>
            <div v-show="groups.length<=0" style="font-size:20px;text-align:center;line-height:60px;">暂无数据</div>
          </template>

          <!--全屏布局-->
          <!--v-slot:table="{table}  接收table具名插槽-->
          <template v-slot:table="{table}">
            <div class="gridlayouthead fx__thead">
              <Row>
                <i-col span="6" class="gridlayoutname">审核类型</i-col>
                <i-col span="6" class="gridlayoutname">车牌号</i-col>
                <i-col span="4" class="gridlayoutname">申请人</i-col>
                <i-col span="8" class="gridlayoutname">申请时间</i-col>
              </Row>
            </div>
            <div v-show="table.length>0" class="gridlayoutbody">
              <!--键值对形式 别称+索引 :key="唯一标识" 唯一标识可以是item里面id index等，-->
              <div v-for="(item, index) in table" :key="index" class="gridlayoutrow fx__item" :class="{'fx__item-selected':gridSelectRow==item.RowData}" @click="routeToUser(''+item.RowData.CheckId)">
                <Row>
                  <i-col span="6">{{initform.cd_checkType[item.RowData.CheckType] || '' }}</i-col>
                  <i-col span="6">{{item.RowData.VLPN || ""}}</i-col>
                  <i-col span="4">{{item.RowData.ApplyUserName || ""}}</i-col>
                  <i-col span="8">{{item.RowData.ApplyTime | dataFormat("yyyy-MM-dd hh:mm:ss") }}</i-col>
                </Row>
              </div>
            </div>
            <div v-show="table.length<=0" style="font-size:20px;text-align:center;line-height:60px;">暂无数据</div>
          </template>
        </fx-grid>
      </div>
      <!-- 首页右边滚动条 -->
      <div class="right main__right" :class="{screen:islayoutscreen,ShowStaticDiv:isShowStaticDiv}">
        <biz-statics ref="Statics" v-on:auditClick="onAuditClick"></biz-statics>
      </div>
      <!-- 左右布局和全屏布局  如果是PC版  抽屉从右边滑出   手机版就显示下面部分mode-->
      <Drawer v-if="$app.helper.screen.isPC" :title="detailTitle()" :closable="true" v-model="isDetail" :mask="islayoutscreen" :inner="true" :transfer="false" width="67" style>
        <div class="fx__bgcolor-lighten drawer-body-wrapper" :style="{height:height-182+'px'}">
          <transition>
            <keep-alive>
              <component v-bind:is="currentView" :selectData="gridSelectRow" :initform="initform" ref="refDom" @on-edit="onEdit" @handleBackToAudit="handleBackToAudit"></component>
            </keep-alive>
          </transition>
        </div>
        <div class="drawer-footer">
          <Button style="float:right;" type="primary" @click="submitAudit()" v-text="+isStauts ? '保存' :'提交审核'"></Button>
          <Button v-if="+isStauts == 0" style="float:right;margin-right: 8px;" type="warning" @click="backToAudit()">退回</Button>
          <Button style="float:right;margin-right: 8px;" @click="isDetail = false">关闭窗口</Button>
        </div>
      </Drawer>

      <Modal v-else v-model="isDetail" :title="detailTitle()" :footer-hide="true">
        <div class="fx__bgcolor-lighten drawer-body-wrapper" :style="{height:height-182+'px'}">
          <transition>
            <keep-alive>
              <component v-bind:is="currentView" :selectData="gridSelectRow" :initform="initform" ref="refDom" @on-edit="onEdit" @handleBackToAudit="handleBackToAudit"></component>
            </keep-alive>
          </transition>
        </div>
        <div class="drawer-footer">
          <Button style="float:right;" type="primary" @click="submitAudit()" v-text="+isStauts ? '保存' :'提交审核'"></Button>
          <Button v-if="+isStauts == 0" style="float:right;margin-right: 8px;" type="warning" @click="backToAudit()">退回</Button>
          <Button style="float:right;margin-right: 8px;" @click="isDetail = false">关闭窗口</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import BizStatics from "./Statics";
const path = require("path");
const files = require.context("./../businessAudits", false, /\.vue$/);
const modules = {};
files.keys().forEach(key => {
  const name = path.basename(key, ".vue");
  modules[name] = files(key).default || files(key);
});
const CartInfo = () => import("./cartInfo/CartInfo");
export default {
  props: {
    CheckId: String //路由组件参数
  },
  data() {
    const self = this;
    let checkid = this.$route.params.checkid;
    return {
      height: 0,
      InValidCheckTypeArr: [],
      isStauts: 0,
      params_checkid: checkid,
      isDetail: false, //是否显示审核信息细节页面
      islayoutscreen: false, //是否全屏布局
      myCount: 0, //总人数
      gridOpts: {
        groupRule: {}, //默认分组规则,必写
        keyFields: ["VLPN", "ApplyUserName", "VIN"],
        keyword: "", //默认关键字,带监听连动
        dataSoucre: [], //数据源,带监听连动
        orderRule: {}, //默认排序规则
        filterRuleFnArr: [], //过滤规则函数数组,这里面是一个一个函数
        filterFnEx: null //行过滤扩展函数用法是传入一个带参数函数,参数将被传入行数据Object
      },
      groupOpts: {
        items: []
      }, //分组规则
      sortOpts: {}, //排序规则
      spinShow: false, //loading 效果
      gridSelectRow: {}, //选中行对象
      detailmode: "", //细节模式
      isShowStaticDiv: false, //是否在大屏幕下面显示统计
      middleScreen: true,
      initform: {
        //字典表集合
        cd_state: { "1": "已审核", "0": "未审核" },
        cd_auditState: { "1": "通过", "0": "不通过" }
      },
      auditType: {
        "20": { template: modules.AcceptAudit },
        "21": { template: modules.VehicleInto },
        "23": { template: modules.SkillDiscernAudit },
        "24": { template: modules.VehicleInfoUpdateAudit },
        "27": { template: modules.ExemptVehicleAudit },
        "07": { template: modules.SpotCheckAudit },
        "30": { template: modules.ChangeRegistratAudit },
        "01": { template: modules.DateUpdateAudit },
        "08": { template: modules.OutInspectUpdateAudit },
        "31": { template: modules.AcceptAudit },
        "02": { template: modules.ModelReviewAudit },
        "10": { template: modules.CheckDateAudit },
        "22": { template: modules.CrossStationAudit },
        "33": { template: modules.StandardGasAudit },
        "34": { template: modules.vehicleCombine },
        "28": {template: modules.ChangeMethodAudit},
        "42": {template: modules.ApplyFJAudit }
      },
      currentView: "", //侧边栏模板，
      allfoldClose: false,
      id: ''
    };
  },
  computed: {
   
  },
  components: {
    modules,
    BizStatics,
    // AcceptAudit, //受理审核（或复合审核）
    // SkillDiscernAudit, //技术鉴别审核
    // VehicleInfoUpdateAudit, //车辆关键信息修改审核
    // ExemptVehicleAudit, //免检车辆审核
    // SpotCheckAudit, //环检抽查审核
    // ChangeRegistratAudit, //车辆变更登记审核
    // DateUpdateAudit, //车辆数据修改审核
    // OutInspectUpdateAudit, //外检修改审核
    // ModelReviewAudit, //车型审核
    CartInfo //卡片模板
    // CheckDateAudit //检测数据审核
    // CrossStationAudit //跨站检测审核
  },
  //监听
  watch: {
    //是否是全屏布局
    islayoutscreen: {
      handler: function (newval, oldval) {
        const self = this;
        self.isDetail = false;
        if (newval == true) {
          self.gridOpts.groupRule = {};
        } else {
          self.gridOpts.groupRule = {
            field: "CheckType",
            text: "按审核类型分组",
            //扩展分组方式
            groupFn: function (row) {
              return self.initform.cd_checkType[row.CheckType];
            }
          };
        }
      },
      immediate: true
    },
    // isDetail(newval, oldval) {
    //   const self = this;
    //   if (newval === false) {
    //     self.routeToUser(null);
    //   }
    // },
    $route(to, from) {
      //通过let定义块级作用域
      const self = this;
      if (to.name != "hj-business-audits") return;
      if (to.params && to.params.checkid && to.params.checkid != "null") {
        self.showDetailById(to.params.checkid, "edit");
      } else {
        self.isDetail = false; //是否打开细节
        self.gridSelectRow = null; //选择行
      }
    }
  },
  methods: {
    detailTitle() {
      const self = this;
      let titleArr = [];
      if (self.gridSelectRow) {
        if (self.gridSelectRow.CheckType)
          titleArr.push(
            self.initform.cd_checkType[self.gridSelectRow.CheckType]
          );
        if (self.gridSelectRow.VLPN) titleArr.push(self.gridSelectRow.VLPN);
        if (self.gridSelectRow.OwnerName)
          titleArr.push(self.gridSelectRow.OwnerName);
        if (self.gridSelectRow.VIN) titleArr.push(self.gridSelectRow.VIN);
      }
      return titleArr.join("-");
    },
    setHeight() {
      this.height = this.$refs.box.offsetHeight;
    },
    onSelect(index) {
      var value = this.groupOpts.items[index];
      this.onGroup(index, value);
    },
    onGroup(index, { field, orderArr, groupFn, compareFn }) {
      this.gridOpts.groupRule = { field, orderArr, groupFn, compareFn }; //执行分组规则
    },
    onAuditClick(row) {
      this.showDetailByRow(row, "edit");
    },
    historySearch() {
      this.$router.push({ name: "hj-audit-search" });
    },
    showCartView(CheckType) {
      return CartInfo;
    },
    submitAudit() {
      if (!this.$refs.refDom.SubmitAudit) return;
      this.$refs.refDom.SubmitAudit(this.isStauts); //调用子组件的方法
      // this.$refs.Statics.loadData();
    },
    // 退回审核
    backToAudit() {
      if (!this.$refs.refDom.BackToAudit) return;
      this.$refs.refDom.BackToAudit();
    },
    handleBackToAudit(auditInfo, tailCheckInfo) {
      if(auditInfo.Remarks && auditInfo.Remarks.trim()) {
        this.$curl.post('api/hj/saveBackToAudit', {
          auditInfo: {
            CheckId: auditInfo.CheckId,
            Remarks: auditInfo.Remarks,
            CheckType: auditInfo.CheckType
          },
          tailCheckInfo
        }).then(res => {
          if(res.code) {
            let auditParam = JSON.parse(JSON.stringify(auditInfo))
            Object.assign(auditParam, res.auditInfo)
            Object.assign(this.gridSelectRow, auditParam)
            this.onEdit(this.gridSelectRow)
            this.$Message.success(res.msg)
          } else {
            this.$Message.warning("退回操作失败！")
          }
        })
      } else {
        this.$Message.warning("退回审核必须填写备注！")
      }
    },

    //直接从浏览器缓存获取CD表或者从reids
    async getDBinfoByMultipte() {
      const self = this;
      const list = [
        {
          tableName: "CD_CheckType",
          columns: "CodeValue,CodeName,IsAvailable",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_FuelType",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_City",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_VehicleKind",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
          where:''
        },
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_VLPNColor",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_GAVType",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_UseOfAuto",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_EmissionStandard",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_AuditReason",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_CredentialsType",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_FGKReason",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_CredentialsType",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_VehicleType",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_InspectionKind",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_InspectionWay",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_Province",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "Area",
          columns: "AreaCode as CodeValue,AreaName as CodeName",
        },
        {
          tableName: "CD_ApplyReason",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        },
        {
          tableName: "CD_InspectionNature",
          columns: "CodeValue,CodeName",
            where: "where IsAvailable=1",
        }
      ];
      const TableName = list.map(l => l.tableName);
      const CD_Name = [
        "cd_checkType", "cd_fuelType", "cd_city", "cd_vehicleKind", "cd_station", "cd_inspectMethod", "cd_vlpnColor", "cd_gavType", "cd_useOfAuto", "cd_emission",
        "cd_auditReason", "cd_credentials", "cd_fgkReason", "cd_credentialsType", "cd_vehicleType", "cd_inspectionKind", "cd_inspectionWay", "cd_province", "area", "cd_applyreason","cd_inspectionNature"];
      let data = [];
      if (self.$getDBTable) {
        self.$getDBTable(TableName).then(res => {
          res.forEach((items, index) => {
            data = JSON.parse(items);
            if (CD_Name[index] == "cd_checkType") self.InValidCheckTypeArr = data.filter(d => d.IsAvailable == '1').map(c => c.CodeValue);
            self.initform[CD_Name[index]] = {};
            if (data[0].hasOwnProperty('IsAvailable')) data = data.filter(d => d.IsAvailable == 1);
            data.forEach(item => {
              self.initform[CD_Name[index]][item.CodeValue] = item.CodeName;
            });
          });
          this.loadData();
          this.setGroupOpts(); //设置分组规则
        })
      } else {
        self.$curl.get("api/hj/getCDData", { CDDataList: JSON.stringify(list) }).then(res => {
          if (res.state) {
            self.InValidCheckTypeArr = res.data[0].filter(d => d.IsAvailable == '1').map(c => c.CodeValue);
            res.data.map((items, index) => {
              self.initform[CD_Name[index]] = {};
              data = items;
              if (data[0].hasOwnProperty('IsAvailable')) data = data.filter(i => i.IsAvailable == 1);
              data.forEach(item => {
                self.initform[CD_Name[index]][item.CodeValue] = item.CodeName;
              });
            });
            this.loadData();
            this.setGroupOpts(); //设置分组规则
          }
        });
       
      }

    },
    setGroupOpts() {
      const self = this;
      this.groupOpts.selectIndex = 0;
      this.groupOpts.items = [
        //分组配置
        {
          field: "CheckType",
          text: "按审核类型分组",
          //扩展分组方式
          groupFn: function (row) {
            return self.initform.cd_checkType[row.CheckType] || "其他";
          }
        },
        {
          field: "station",
          text: "按站点类型",
          //扩展分组方式
          groupFn: function (row) {
            return self.initform.cd_station[row.OrgCode] || "其他";
          }
        },
        {
          field: "dateTime",
          text: "按时间分组",
          //扩展分组方式
          groupFn: function (row) {
            return (
              self.$options.filters.dataFormat(
                row.ApplyTime,
                "yyyy年MM月dd日"
              ) || "其他时间"
            );
          }
        },
        { field: "", text: "不分组" }
      ];
    },
    //异步加载数据
    async loadData() {
      const self = this;
      let filter1 = this.$refs.filter1;
      // self.groupOpts.selectIndex = 0;
      this.$curl.get("api/hj/getAuditInfo").then(res => {
        if (res.state) {
          let { auditList } = res;
          //过滤掉无效的审核数据
          auditList = auditList.filter(t =>
            self.InValidCheckTypeArr.includes(t.CheckType)
          );
          self.gridOpts.dataSoucre = auditList;
          self.$nextTick(() => {
            self.open();
            if (self.params_checkid == "null") return; //没有审核ID不执行下去
            if (!self.params_checkid) return;
            this.id = self.params_checkid;
            self.showDetailById(self.params_checkid, "edit");
          });
        } else {
          this.$Notice.warning({
            title: "提示",
            desc: "获取审核信息失败!"
          });
        }
      });
    },
    //刚开始展开或关闭
    open() {
      const self = this;
      if (self.myCount < 20) self.allfoldClose = false;
      else self.allfoldClose = true;
      setTimeout(function () {
        self.switchfoldOnOff();
      }, 500);
    },
    onSearch(val) {
      this.gridOpts.keyword = val; //去掉首尾空格
    },
    onUpdate({ filterlist, groups, table }) {
      this.myCount = filterlist.length;
    },
    onFilter(AllConditions) {
      this.gridOpts.filterRuleFnArr = AllConditions;
    },
    //切换分组展开或关闭
    switchfoldOnOff() {
      let grid1 = this.$refs.grid1;
      this.allfoldClose = !this.allfoldClose; //切换展开
      grid1.groups.forEach(element => {
        element.isfold = this.allfoldClose;
      });
    },
    //路由式导航展现用户详细信息
    routeToUser(checkid) {
      if(this.id === checkid) {
        this.isDetail = !this.isDetail;
        return
      }
      this.id = checkid;
      let self = this;
      if (self.gridSelectRow && self.gridSelectRow.CheckId == checkid) {
        checkid = null;
      }
      if (checkid == null) self.gridSelectRow = null;

      // if (checkid) self.isDetail = null; //赋值null,既不会影响监听isDetail中==false的判断，又可以达到短暂的关闭详细页面
      let selectID = checkid == null ? "null" : checkid;
      
      if (checkid == null)
        return
      if (this.$route.name == "hj-business-audits")
      this.$nextTick(() => {
          this.$router.push({
            name: "hj-business-audits",
            params: { checkid: selectID }
          });
        });

    },
    //根据ID行数据显示详细用户信息
    showDetailById(checkid, mode) {
      console.log('showDetailById',checkid)
      const self = this;
      console.log('self.gridOpts.dataSoucre',self.gridOpts.dataSoucre)
      let findobj = self.gridOpts.dataSoucre.find(p => p.CheckId == checkid);
      console.log('findobj',findobj)
      self.showDetailByRow(findobj, mode);
    },
    //根据行数据显示详细用户信息
    async showDetailByRow(rowdata, mode) {
      const self = this;
      self.detailmode = mode;
      self.isStauts = rowdata && rowdata.Status;
      self.gridSelectRow = rowdata;
      if(!self.gridSelectRow) return
      if (self.gridSelectRow && self.auditType[self.gridSelectRow.CheckType]) {
        self.currentView =
          self.auditType[self.gridSelectRow.CheckType].template; //选取侧边栏模板
      } else {
        this.$Notice.warning({
          title: "提醒",
          desc: "暂无审核类型模板,请添加"
        });
        return;
      }
      self.isDetail = true 
    },
    //添加信息完成后回调
    onAddUser: function (entity, title) {
      let self = this;
      const hasData = self.gridOpts.dataSoucre.find(
        t => t.CheckId == entity.CheckId
      );
      if (hasData && entity.Status != "0") {
        self.gridOpts.dataSoucre.RemoveAll(function (item) {
          return item.CheckId == hasData.CheckId;
        });
        const isData = self.$refs.Statics.recentAuditList.find(
          t => t.CheckId == entity.CheckId
        );
        if (isData) return;
        self.$refs.Statics.recentAuditList.unshift(entity);
      }
      if (!hasData && entity.Status != "1") {
        self.gridOpts.dataSoucre.unshift(entity);
      }
      if (typeof title == "number") {
        let nowDateData = [];
        let lastTenData = [];
        Object.assign(nowDateData, self.$refs.Statics.nowDateData);
        Object.assign(lastTenData, self.$refs.Statics.lastTenData);
        nowDateData.forEach((item, id) => {
          if (item.CheckId == entity.CheckId) nowDateData.splice(id, 1);
        });
        lastTenData.forEach((item, id) => {
          if (item.CheckId == entity.CheckId) lastTenData.splice(id, 1);
        });
        nowDateData.unshift(entity);
        lastTenData.unshift(entity);
        self.$refs.Statics.nowDateData = nowDateData;
        self.$refs.Statics.lastTenData = lastTenData;
      }
    },
    // 订阅自动更新页面
    autoSubscribeSocket() {
      const _this = this;
      this.$app.io.on("updatePage/info", obj => {
        console.log('接收到更新通知',obj)
        // _this.showDetailByRow(obj.msgObj, 'edit')
        // _this.submitAudit()
        _this.delUser(obj.msgObj);
        _this.$refs.Statics.recentAuditList.unshift(obj.msgObj);
        _this.$refs.Statics.nowDateData.forEach((item, id) => {
          if (item.CheckId == obj.msgObj.CheckId) _this.$refs.Statics.nowDateData.splice(id, 1);
        });
        _this.$refs.Statics.lastTenData.forEach((item, id) => {
          if (item.CheckId == obj.msgObj.CheckId) _this.$refs.Statics.lastTenData.splice(id, 1);
        });
        _this.$refs.Statics.nowDateData.unshift(obj.msgObj)
        _this.$refs.Statics.lastTenData.unshift(obj.msgObj)
      });
    },
    //编辑信息完成后回调
    onEdit: function (entity) {
      const self = this;
      const keys = "ywxt/jgxt/dshxx";
      const str = JSON.stringify(entity);
      if (self.isStauts != 1) {
        //如未审核提交审核后，则推送给 其他用户
        self.$curl
          .post("api/hj/auditedEmit", { keys, str })
          .then(res => console.log(res))
          .catch(err => console.log(err));
        
        // let option = {
        //   userids: 'others',
        //   data: {
        //     type: "jgxt/shjs",
        //     message: entity
        //   }
        // };
        // this.$app.io.sendMessage(option)
      }

      //移除已处理
      self.delUser(entity);
      //加到右侧最近审核信息中
      if (self.$refs.Statics.recentAuditList) {
        if (!+self.isStauts) {
          self.$refs.Statics.recentAuditList.unshift(entity);
          // self.$refs.Statics.nowDateData.forEach((item,id) => {
          //   if(item.CheckId == entity.CheckId)
          //     self.$refs.Statics.nowDateData.splice(id, 1);
          // })
          // self.$refs.Statics.lastTenData.forEach((item,id) => {
          //   if(item.CheckId == entity.CheckId)
          //     self.$refs.Statics.lastTenData.splice(id, 1);
          // })
          // self.$refs.Statics.nowDateData.unshift(entity);
          // self.$refs.Statics.lastTenData.unshift(entity);
        }
        self.isDetail = false;
        self.isStauts = 1; //修改提交为保存
      }
    },
    //移除已处理信息[参数 rowdata：行数据,rowindex 索引]
    delUser(rowdata, rowindex) {
      const self = this;
      if (rowdata.CheckId) {
        self.gridOpts.dataSoucre.RemoveAll(function (item) {
          return item.CheckId == rowdata.CheckId;
        });
        self.routeToUser(undefined);
      }
    },
    //右边按钮以及选中变色
    swicthdisplay() {
      this.isShowStaticDiv = !this.isShowStaticDiv;
    },
    swicthlayout (name) {
      if((this.islayoutscreen && name=='full') || (!this.islayoutscreen && name=='nofull')) return
      let flag = this.isShowStaticDiv;
      if(flag) this.isShowStaticDiv = false;
      this.islayoutscreen = !this.islayoutscreen;
      if(!flag) this.isShowStaticDiv = true;
    },
    //切换折叠
    onclick(item, e) {
      item.isfold = !item.isfold;
    },
    subscribeSocket() {
      //订阅socket
      const _this = this;
      const fd = this.$app.io.on("ywxt/jgxt/dshxx", obj => {
        console.log('接受到后端推送的业务审核新数据：', obj)

        const msg = obj.msgObj;
        const title = obj.title;
        if (msg) {
          _this.onAddUser(JSON.parse(msg), title);
        }
      });

      // const shjs = this.$app.io.on("jgxt/shjs", obj => {
      //   _this.delUser(obj.message);
      //   if (_this.$refs.Statics.recentAuditList) {
      //     _this.$refs.Statics.recentAuditList.unshift(obj.message);
      //   }
      // })

      this.$once("hook:beforeDestroy", () => {
        fd.dispose();
        // shjs.dispose();
      });
    }
  },
  created() {
    this.getDBinfoByMultipte();
    this.subscribeSocket();
  },
  mounted() {
    this.height = this.$refs.box.offsetHeight;
    window.addEventListener("resize", this.setHeight);
    this.autoSubscribeSocket();
  },
  destroyed() {
    window.removeEventListener("resize", this.setHeight);
  }
};
</script>

<style lang='less' scoped>
.icons {
  cursor:pointer;
  &:hover {
    color: aquamarine;
  }
}
/* 右侧滑块样式 */
.fx-thema.light .fx__item:hover {
  background: none;
  color: #000;
}

.fx-thema.light .fx__group {
  border: none !important;
}

.drawer-footer {
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  width: 100%;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 7px 16px;
  overflow: hidden;
  min-height: 48px;
}
.drawer-body-wrapper {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.drawer-body-wrapper /deep/ .ivu-card {
  margin: 10px;
}
.right_badge /deep/ .ivu-badge-count {
  background: #f90 !important;
}

.content /deep/ .ivu-drawer-body {
  padding: 0 0 !important;
  overflow: hidden !important;
}

.content /deep/ .ivu-drawer-header-inner {
  font-size: 15px;
}
</style>

<style lang="scss" scoped>
$screen-lg-px: 1200px;

.content {
  height: calc(100%);
  display: flex;
  // background-color: $fx-bgcolor;
  flex-direction: column;
  .head {
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
    &__right {
      height: 34px;
      line-height: 29px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      &-group {
        height: 34px;
        line-height: 29px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
    &__title {
      font-size: 18px;
      margin: 0;
      height: 34px;
      line-height: 34px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .line-divide {
    margin: 16px 0;
    height: 1px;
    width: 100%;
  }
  .main {
    height: calc(100% - 73px);
    display: flex;
    padding-bottom: 20px;
    position: relative;
    padding: 0 30px 0px 30px;
    margin-bottom: 10px;
    position: relative;
    // &__left {
    //   width: calc(33.3% - 20px);
    //   min-width: 350px;
    //   margin-right: 20px;
    //   transition: all 0.3s ease;
    //   overflow: auto;
    // }
    // &__right {
    //   flex: 1;
    //   overflow: auto;
    //   transition: all 0.3s ease;
    // }
  }
  .left {
    overflow: auto;
    display: flex;
    flex-direction: column;
    height: calc(100%);
    width: calc(33.3% - 20px);
    min-width: 350px;
    margin-right: 20px;
    transition: all 0.3s ease;
    overflow: auto;
  }
  .right {
    flex: 1;
    overflow: hidden;
    transition: all 0.3s ease;
    //padding-right: 5px;    //是否给滚动条留空
    &:hover {
      overflow-y: overlay;
    }
  }
  //大屏幕
  @media screen and (min-width: $screen-lg-px) {
    .btn-static-switch {
      display: none;
      &.screen {
        display: block;
      }
    }
    .right {
      &.screen {
        display: none;
        flex: 1;
        margin-left: 0 !important; //全屏模式下清除掉左右两边
      }
      &.ShowStaticDiv {
        display: block;
      }
    }
    .left {
      &.screen {
        flex: 1;
        margin-right: 0 !important; //全屏模式下清除掉左右两边
      }
      &.ShowStaticDiv {
        display: none !important;
      }
    }
  }
  //小屏幕,各种样式变化
  @media screen and (max-width: $screen-lg-px) {
    .right {
      margin-left: 0px;
      display: none;
      flex: 1;
      &.ShowStaticDiv {
        display: block;
      }
    }
    .left {
      flex: 1;
      margin-right: 0px;
      &.ShowStaticDiv {
        display: none !important;
      }
    }
  }
}

.gridlayout {
  overflow: hidden;
  padding-right: 5px; //给滚动条留空
  display: flex;
  flex-direction: column;
  flex: 1;
  &:hover {
    overflow-y: overlay;
  }
  .gridlayoutgroup {
    margin: 4px 0;
    .collapse__header {
      // border-top: 1px solid $border-color-base;
      background: transparent;
      height: 40px;
      line-height: 40px;
      padding: 0px;
      position: relative;
      font-size: 16px;
      width: 100%;
      cursor: pointer;
      display: flex;
      &:first-child {
        border-top: none;
      }
      .arrow {
        width: 16px;
        text-align: center;
        margin: 0 10px;
        transition: transform 0.2s;
        &.rotate90 {
          transform: rotate(90deg);
        }
      }
      .right_badge {
        position: absolute;
        top: 50%;
        margin-top: -8px;
        right: 10px;
      }
    }
  }
  .gridlayouthead {
    padding: 10px;
    //flex: 1;
    // background: $bg-active;
    // color: #fff;
    .gridlayoutname {
      font-size: large;
      // font-size: 30px
    }
  }
  .gridlayoutbody {
    flex: 1;
    overflow: auto;
  }
  .gridlayoutrow {
    padding: 10px;
    cursor: pointer;
    position: relative;
    &::after {
      display: block;
      content: "";
      height: 1px;
      // background: #464f5b;
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
    }
    //最后一个item去掉底边
    &:last-of-type {
      &::after {
        display: none;
      }
    }
    //每行得垃圾桶
    .delete {
      position: absolute;
      right: 10px; //修改垃圾桶左右位置
      cursor: pointer;
    }

    .gridlayoutdo {
      float: right;
    }
  }
}
</style>



