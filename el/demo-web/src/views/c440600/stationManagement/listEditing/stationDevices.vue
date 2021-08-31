<template>
  <div>
    <Card :padding="0" :lg="24" class="card_main">
      <Button
        v-if="Permission"
        style="position:absolute;top:5px;right: 20px;"
        type="primary"
        @click="handleAdd()"
        >新增</Button
      >
      <!-- ghost -->
      <div slot="title" style="font-size: 14px;font-weight:700;">
        检测设备信息
      </div>
      <Table :columns="columns_data" :data="resData" height="530">
        <template slot="action" slot-scope="{ row, index }">
          <Tooltip placement="left" content="编辑">
            <Button
              v-if="hasAuthorityEdit"
              type="text"
              style="width:46px;"
              icon="md-open"
              @click="handleEdit(row, index)"
              ></Button>
          </Tooltip>
          <Tooltip placement="left" content="删除">
            <Button
              v-if="hasAuthorityDel"
              type="text"
              style="width:46px;"
              icon="ios-trash"
              @click="handleDel(row, index)"
              ></Button>
          </Tooltip>
        </template>
      </Table>
    </Card>
    <!-- 弹窗 -->
    <Modal
      v-model="JCXmodal"
      width="1000"
      :title="selData.Name ? selData.Name + '基本信息' : '基本信息'"
    >
      <div style="text-align:center">
        <Tabs :animated="false" :value="selTabs" v-model="selTabs">
          <TabPane name="0" label="信息管理">
            <edit-device-info
              ref="editDeviceInfo"
              :cdLineList="cdLineList"
              :StationCode="StationCode"
              :opera="opera"
              :ID="selData.StationDeviceID"
              @saveState="saveStates"
              :formItemInfo="selData"
              @fatherMethod="Data_Process"
            ></edit-device-info>
          </TabPane>
          <TabPane
            name="1"
            v-bind:disabled="!selData.StationDeviceID"
            label="证书上传"
          >
            <edit-device-file
              :StationCode="StationCode"
              :StationDeviceID="selData.StationDeviceID"
            ></edit-device-file>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="JCXmodal = false">取消</Button>
        <Button
          v-show="selTabs == '0'"
          type="primary"
          size="large"
          @click="handleSave()"
          >保存</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import editDeviceInfo from "../Model/editDeviceInfo.vue";
import editDeviceFile from "../Model/editDeviceFile.vue";
import {
  getCDData,
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
      opera: "",
      lineTypes: [], //线类型
      JCXmodal: false, //弹窗model
      selData: {}, //选中的列
      selTabs: 0, //选中的tabs页
      resData: [], //数据源
      cdLineList: [],
      columns_data: [
        {
          title: "序号",
          type: "index",
          minWidth: 50,
          align: "center",
        },
        {
          title: "检测线编号",
          key: "SceneCode",
          align: "center",
          minWidth: 120,
          sortable: true,
        },
        {
          title: "线类型",
          render: (h, params) => {
            let name = "";
            this.cdLineList.forEach((d) => {
              if (d.value == params.row.SceneCode) name = d.LineType;
              if (name) {
                this.lineTypes.forEach((l) => {
                  if (l.CodeValue == name) name = l.CodeName;
                });
              }
            });
            return h("span", {}, name);
          },
          align: "center",
          minWidth: 120,
        },
        {
          title: "设备名称",
          key: "Name",
          ellipsis: true,
          tooltip: true,
          minWidth: 100,
          align: "center",
        },
        {
          title: "状态",
          key: "Status",
          align: "center",
          minWidth: 100,
          sortable: true,
        },
        {
          title: "设备认证编号",
          key: "IEAC",
          minWidth: 200,
          align: "center",
        },
        {
          title: "标定有效期",
          key: "CalValidityPeriod",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            let date = this.$options.filters.dataFormat(
              params.row.CalValidityPeriod,
              "yyyy-MM-dd"
            );
            let nowDate = this.$options.filters.dataFormat(
              new Date(),
              "yyyy-MM-dd"
            );
            let date2 = moment(nowDate); //现在时间
            let date1 = moment(date); //标定有效期
            let dateCount = date1.diff(date2, "days");
            if (dateCount > 30) return h("div", date);
            else if (dateCount >= 0)
              return h("div", { style: { color: "orange" } }, date);
            else return h("div", { style: { color: "red" } }, date);
          },
        },
        {
          title: "操作",
          slot: "action",
          width: 160,
          align: "center",
          minWidth: 100,
        },
      ],
      isOpenAudit: false,
      isCur: false,
    };
  },
  components: {
    editDeviceInfo, //表单弹框
    editDeviceFile, //上传图片
  },
  methods: {
    async getconfig (){
      this.isOpenAudit=await getStationConfig(this)
    },
    saveStates(state) {
      //保存成功后的回调
      this.JCXmodal = state;
      this.selData = this.$refs.editDeviceInfo.formItem;
    },
    handleAdd() {
      this.selTabs = 0; //切换到基本信息
      this.selData = { ID: 0 };
      this.JCXmodal = true;
      this.opera = "xz";
    },
    handleEdit(row, index) {
      this.selData = row;
      this.JCXmodal = true;
      this.opera = "bj";
      this.$refs.editDeviceInfo.judgeDataChange(row);
    },
    handleSave() {
      this.$refs.editDeviceInfo.HandleSubmit("formCustom");
      // this.JCXmodal = false;
    },
    async handleDel(row, index) {
      const self = this;
      this.$Modal.confirm({
        title: "删除提醒",
        content: "<p>确定要删除该条数据吗？</p>",
        onOk: async () => {
          const params = {
            tablename: "StationDevice",
            IDname: "StationDeviceID",
            IDvalue: row.StationDeviceID,
            StationCode: self.StationCode,
            redis_key: "stationdevice",
          };
          if (!this.isOpenAudit) {
            const result = await this.$curl.post(
              "api/hj/delectTableID",
              params
            );
          } else {
            let remindData = {
              msgChannel: "changeStationAudit",
              msgType: "检测设备信息删除",
              msgTypeCode: "03",
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
        onCancel: () => {},
      });
    },
    async Data_Process(station) {
      const params = { stationID: this.StationCode };
      //获取设备信息
      const DeviceResult = await this.$curl.get("api/hj/GetStationDevice", {
        stationID: this.StationCode,
      });
      if (DeviceResult.state) this.resData = DeviceResult.data;
      else {
        this.$Notice.warning({
          title: DeviceResult.msg,
        });
      }
      //获取线列表
      const LineResult = await this.$curl.get("api/hj/GetLineByStationCode", {
        stationID: this.StationCode,
      });
      if (LineResult.state) this.cdLineList = LineResult.data;
      else {
        this.$Notice.warning({
          title: LineResult.msg,
        });
      }
    },
    async getCDInfo() {
      const self = this;
      let tables = [
        {
          tableName: "CD_LineType",
          columns: "CodeValue,CodeName",
          where: " where IsAvailable=1 ",
        },
      ];
      if (self.$getDBTable) {
        let cdList = tables.map((item) => {
          return item.tableName;
        });
        await self.$getDBTable(cdList).then((data) => {
          data = data.map((v) => JSON.parse(v));
          data = data.map((d) => {
            if (d[0].hasOwnProperty("IsAvailable"))
              return d.filter((c) => c.IsAvailable == 1);
            else return d;
          });
          self.lineTypes = data[0];
        });
      } else {
        await getCDData(this, tables).then(function(res) {
          if (res.state) {
            self.lineTypes = res.data[0][0].hasOwnProperty("IsAvailable")
              ? res.data[0].filter((i) => i.IsAvailable == 1)
              : res.data[0];
          }
        });
      }
    },
  },
  watch: {
    StationCode: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
        // if (this.hasAuthorityEdit == false && !this.hasAuthorityDel) {
        //   this.columns_data.pop();
        // }
        if(this.activeStep != this.curIndex) {
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
    this.getCDInfo();
    this.getconfig()
  },
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

<style lang="scss" scoped>
.card_main{

}
</style>