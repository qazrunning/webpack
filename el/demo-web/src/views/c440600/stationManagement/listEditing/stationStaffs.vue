<template>
  <div>
    <Card :padding="0" :lg="24" class="card_main">
      <Button v-if="Permission" style="position:absolute;top:5px;right: 90px;" type="primary" @click="CheckStatistics()">检测量查看</Button>
      <Button v-if="Permission" style="position:absolute;top:5px;right: 20px;" type="primary" @click="handleAdd()">新增</Button>
      <div slot="title" style="font-size: 14px; font-weight: 700;">检测人员信息</div>
      <Table :columns="columns_data" :data="resData" height="530" CheckJudge>
        <template slot="action" slot-scope="{ row }">
          <Tooltip placement="left" content="编辑">
            <Button v-if="hasAuthorityEdit" type="text" style="width:46px;" icon="md-open" @click="handleEdit(row)"></Button>
          </Tooltip>
          <Tooltip placement="left" content="删除">
            <Button v-if="hasAuthorityDel" type="text" style="width:46px;" icon="ios-trash" @click="handleDel(row)"></Button>
          </Tooltip>
        </template>
      </Table>
    </Card>
    <!-- 弹窗 -->
    <Modal v-model="JCXmodal" width="1000" :title="selData.Name ? selData.Name + '基本信息' : '基本信息'">
      <div style="text-align:center">
        <Tabs :animated="false" :value="selTabs" v-model="selTabs">
          <TabPane name="0" label="信息管理">
            <edit-staff-info ref="editStaffInfo" :StationCode="StationCode" :ID="selData.ID" @saveState="saveStates" @Data_Process="Data_Process"></edit-staff-info>
          </TabPane>
          <TabPane name="1" v-bind:disabled="!selData.ID" label="证书上传">
            <edit-staff-file :StationCode="StationCode" :StationStaffID="selData.ID"></edit-staff-file>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="JCXmodal = false">取消</Button>
        <Button v-show="selTabs == '0'" type="info" size="large" @click="resetFormData()">重置</Button>
        <Button v-show="selTabs == '0'" type="primary" size="large" @click="handleSave()">保存</Button>
      </div>
    </Modal>
    <!-- 抽屉 -->
    <Drawer title="检测人员工作量统计" :closable="false" v-model="showStatistics" placement="right" width="640">
      <div style="margin-bottom:5px;">
        <DatePicker v-model="checkTime[0]" type="datetime" placeholder="选择时间…" style="margin-left:10px;width:170px;"></DatePicker>----
        <DatePicker v-model="checkTime[1]" type="datetime" placeholder="选择时间…" style="width:170px;"></DatePicker>
        <Input v-model="staff" placeholder="检测员..." style="width:155px;margin-left:5px;" />
        <Button style="margin-left:5px;" type="primary" @click="searchData()">检索</Button>
      </div>
      <Table :columns="staffColum" :data="staffData" :height="staffHeight" style="margin-bottom:5px;" ></Table>
      <!-- 分页器 -->
      <Page :total="staffTotal" :current="pageIndex" :page-size="pageSize" show-total show-sizer @on-change="change" @on-page-size-change="pageChange" />
    </Drawer>
  </div>
</template>
<script>
import editStaffInfo from "../Model/editStaffInfo.vue";
import editStaffFile from "../Model/editStaffFile.vue";
import {
  setRemindAndInsertAudit,
  getStationConfig,
} from "../../../utils/utils";
export default {
  props: {
    //标题名称
    StationCode: {
      type: String,
      default: "0",
    },
    hasAuthorityEdit: {
      type: Boolean,
      default: false,
    },
    hasAuthorityDel: {
      type: Boolean,
      default: false,
    },
    //权限
    Permission: {
      type: Boolean,
      default: false,
    },
    activeStep: {
      type: Number,
      default: 0,
    },
    curIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      staffHeight: 0,
      checkTime: [],
      staff: '',
      staffTotal: 0,
      pageIndex: 1,
      pageSize: 10,
      showStatistics: false,//抽屉
      isOpenAudit: false,
      JCXmodal: false, //弹窗model
      selData: {}, //选中的列
      selTabs: 0, //选中的tabs页
      resData: [], //数据源
      columns_data: [
        {
          title: "姓名",
          key: "Name",
          minWidth: 100,
          align: "center",
        },
        {
          title: "登入名",
          key: "LoginAccount",
          minWidth: 100,
          align: "center",
        },
        {
          title: "性别",
          key: "Sex",
          minWidth: 60,
          align: "center",
        },
        {
          title: "职称",
          key: "Position",
          minWidth: 100,
          align: "center",
        },
        {
          title: "上岗证号",
          key: "InductionCardCode",
          minWidth: 150,
          align: "center",
        },
        {
          title: "身份证",
          key: "IDCard",
          minWidth: 150,
          align: "center",
        },
        {
          title: "状态",
          key: "Status",
          minWidth: 100,
          align: "center",
        },
        {
          title: "操作",
          slot: "action",
          minWidth: 180,
          align: "center",
        },
      ],
      isCur: false,
      staffColum: [
        {
          title: '检测员',
          key: "InspectionOperator",
          align: "center"
        },
        {
          title: "检测量",
          key: "total",
          align: "center"
        }
      ],
      staffData: [],
    };
  },
  components: {
    editStaffInfo, //表单弹框
    editStaffFile, //上传图片
  },
  methods: {
    // 查看检测量
    CheckStatistics() {
      this.showStatistics = true;
      this.searchData();
    },
    // 检索检测量
    searchData() {
      if (this.checkTime[0].length == 0 && this.checkTime[1].length == 0) {
        this.checkTime[0] = require("moment")().format("YYYY-MM-DD 00:00:00");
        this.checkTime[1] = require("moment")().format("YYYY-MM-DD 23:59:59");
      } else if (this.checkTime.indexOf('') > -1) {
        this.$Message.warning('请选择完整时间');
        return;
      }
      const params = {
        StationCode: this.StationCode,
        from: this.checkTime[0],
        to: this.checkTime[1],
        staff: this.staff,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      this.$curl.get('api/hj/getStaffSum', { params }).then(res => {
        if (res.code == 1) {
          this.staffData = res.data.list;
          this.staffTotal = res.data.total;
        }

      });

    },
    // 改变页码
    change(pageIndex) {
      this.pageIndex = pageIndex;
      this.searchData();
    },
    // 每页条数
    pageChange(pageSize) {
      this.pageSize = pageSize;
      this, searchData();
    },
    async getconfig() {
      this.isOpenAudit = await getStationConfig(this)
    },
    saveStates(state) {
      //保存成功后的回调
      if (!state) return;
      this.JCXmodal = false;
      this.selData = this.$refs.editStaffInfo.formItem;
    },
    handleAdd() {
      this.selTabs = 0; //切换到基本信息
      this.selData = { ID: 0 };
      this.JCXmodal = true;
    },
    handleEdit(row) {
      this.selData = row;
      this.JCXmodal = true;
    },
    async handleDel(row, index) {
      const self = this;
      this.$Modal.confirm({
        title: "删除提醒",
        content: "<p>确定要删除该条数据吗？</p>",
        onOk: async () => {
          const params = {
            tablename: "StationStaff",
            IDname: "ID",
            IDvalue: row.ID,
            StationCode: self.StationCode,
            redis_key: "stationstaff",
          };

          if (!this.isOpenAudit) {
            const result = await this.$curl.post(
              "api/hj/delectTableID",
              params
            );
          } else {
            let remindData = {
              msgChannel: "changeStationAudit",
              msgType: "检测人员信息删除",
              msgTypeCode: "04",
              msgInfo: "",
            };
            let parmaData = {
              oldItem: row,
              params: params,
            };
            setRemindAndInsertAudit(this, remindData, parmaData, "03");
          }
          this.JCXmodal = false;
          self.Data_Process();
        },
        onCancel: () => { },
      });
    },
    handleSave() {
      this.$refs.editStaffInfo.HandleSubmit("formCustom");
    },
    // 重置表单数据
    resetFormData() {
      this.$refs.editStaffInfo.resetFormData();
    },
    async Data_Process() {
      const params = { StationCode: this.StationCode };
      let { state, data, imgList } = await this.$curl.get(
        "api/hj/GetStationStaff",
        {
          params: JSON.stringify(params),
        }
      );
      if (state) {
        if (data) this.resData = data;
      } else {
        this.$Notice.warning({
          title: result.msg,
        });
      }
    },
    setHeight(){
      this.staffHeight=window.innerHeight-150;

    }
  },
  watch: {
    StationCode: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
        // if (this.hasAuthorityDel == false && this.hasAuthorityEdit == false) {
        //   this.columns_data.pop();
        // }
        if (this.activeStep != this.curIndex) {
          this.isCur = false;
          return;
        }
        this.isCur = true;
        this.Data_Process();
      },
      immediate: true,
    },
    activeStep: {
      handler(newVal, oldVal) {
        if (newVal == this.curIndex && !this.isCur) {
          this.isCur = true;
          this.Data_Process();
        }
      },
      deep: true
    },
  },
  mounted() {
    this.getconfig();
     window.addEventListener("resize", this.setHeight);
        this.setHeight();
  },
    destroyed() {
        window.removeEventListener("resize", this.setHeight);
    }
  
};
</script>
<style scoped>
.card_main /deep/ .ivu-card-head {
  padding: 12px 16px;
  height: 42px;
}
.card_main /deep/ .ivu-btn-ghost.ivu-btn-dashed,
.ivu-btn-ghost.ivu-btn-default {
  color: #747b8b;
  border-color: #e3e5e8;
}
.ivu-tabs {
  overflow: visible;
}
</style>
