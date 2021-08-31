<!--摄像头信息 -->
<template>
  <div>
    <Card :padding="0" class="card_main">
      <Button
        v-if="Permission"
        style="position:absolute;top:5px;right: 20px;"
        type="primary"
        @click="handleAdd()"
        >新增</Button
      >
      <div slot="title" style="font-size: 14px;font-weight: 700;">
        摄像头信息
      </div>
      <Table :columns="columns_Cameras" :data="resData" height="530">
        <template slot-scope="{ row, index }" slot="action">
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
      width="800"
      :title="formItem.CAMName ? formItem.CAMName + '摄像头' : '新增摄像头'"
    >
      <Form
        ref="formCustom"
        :model="formItem"
        :rules="ruleValidate"
        :label-width="isPc ? 140 : null"
        :label-position="isPc ? 'right' : 'top'"
      >
        <Row :gutter="16">
          <i-col :xs="24" :sm="12">
            <FormItem label="检测线编号：" prop="LineCode">
              <Select v-model="formItem.LineCode" clearable>
                <Option
                  v-for="(item, index) in cdLineList"
                  :value="item.value"
                  :key="index"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12">
            <FormItem label="录像机ID：" prop="DVRID">
              <Select v-model="formItem.DVRID" clearable>
                <Option
                  v-for="(item, index) in DVRInfoList"
                  :value="item.value"
                  :key="index"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12">
            <FormItem label="摄像头名称：" prop="CAMName">
              <i-input
                v-model="formItem.CAMName"
                placeholder="请输入"
                clearable
              ></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12">
            <FormItem label="摄像头IP：" prop="CAMIP">
              <i-input
                v-model="formItem.CAMIP"
                placeholder="请输入"
                clearable
              ></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12">
            <FormItem label="通道：" prop="CAMChannel">
              <i-input
                v-model="formItem.CAMChannel"
                placeholder="请输入"
                clearable
              ></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12">
            <FormItem label="前/后摄像头：" prop="CAMPosition">
              <Select v-model="formItem.CAMPosition" clearable>
                <Option
                  v-for="item in Position"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12">
            <FormItem label="备注：">
              <i-input
                v-model="formItem.Remark"
                placeholder="请输入"
                clearable
              ></i-input>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button size="large" @click="JCXmodal = false">取消</Button>
        <Button type="info" size="large" @click="handleSubmit('formCustom')"
          >保存</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getCDData,
  setRemindAndInsertAudit,
  getStationConfig,
} from "../../../utils/utils";
export default {
  data() {
    const self = this;
    return {
      isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
      formItem: {},
      oldItem: {},
      DVRInfoList: [], //DVR列表
      Position: [], //摄像头列表
      cdLineList: [], //检测线列表
      resData: [], //数据源
      JCXmodal: false,
      columns_Cameras: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center",
        },
        {
          title: "检测线编号",
          key: "LineCode",
          minWidth: 120,
          align: "center",
          sortable: true,
        },
        {
          title: "硬盘录像机",
          key: "DVRID",
          minWidth: 140,
          align: "center",
          render: (h, params) => {
            let name = self.returncodename(self.DVRInfoList, params.row.DVRID);
            return h("div", name);
          },
          sortable: true,
        },
        {
          title: "摄像头名称",
          key: "CAMName",
          ellipsis: true,
          minWidth: 100,
          tooltip: true,
          align: "center",
        },
        {
          title: "通道",
          key: "CAMChannel",
          minWidth: 100,
          align: "center",
        },
        {
          title: "前/后摄像头",
          minWidth: 100,
          key: "CAMPosition",
          render: (h, params) => {
            let name = self.returncodename(
              self.Position,
              params.row.CAMPosition
            );
            return h("div", name);
          },
        },
        {
          title: "操作",
          slot: "action",
          minWidth: 180,
          align: "center",
        },
      ],
      ruleValidate: {
        // LineCode: [
        //   { required: true, message: "检测线不能为空", trigger: "blur" },
        // ],
        DVRID: [
          {
            required: true,
            message: "录像机ID不能为空",
            trigger: "blur",
            type: "number",
          },
        ],
        CAMName: [
          { required: true, message: "摄像头名称不能为空", trigger: "blur" },
        ],
        CAMIP: [
          { required: true, message: "摄像头IP不能为空", trigger: "blur" },
        ],
        CAMChannel: [
          { required: true, message: "通道不能为空", trigger: "blur" },
        ],
        CAMPosition: [
          { required: true, message: "前/后摄像头不能为空", trigger: "blur" },
        ],
      },
      isOpenAudit: false,
      isCur: false,
    };
  },
  props: {
    //标题名称
    StationCode: {
      type: String,
      default: "0",
    },
    Permission: {
      type: Boolean,
      default: false,
    },
    hasAuthorityEdit: {
      type: Boolean,
      default: false,
    },
    hasAuthorityDel: {
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
  methods: {
    async getconfig (){
      this.isOpenAudit=await getStationConfig(this)
    },
    async handleDel(row, index) {
      let self = this;
      this.$Modal.confirm({
        title: "删除提醒",
        content: "<p>确定要删除该条数据吗？</p>",
        onOk: async () => {
          let params = {
            tablename: "Cameras",
            IDname: "CAMID",
            IDvalue: row.CAMID,
            Stationcode: self.StationCode,
            redis_key: "Cameras",
          };
          if (!this.isOpenAudit) {
            await this.$curl.post("api/hj/delectTableID", params);
          } else {
            let remindData = {
              msgChannel: "changeStationAudit",
              msgType: "摄像头信息删除",
              msgTypeCode: "06",
              msgInfo: "",
            };
            let parmaData = {
              oldItem: row,
              params: params,
            };
            setRemindAndInsertAudit(this, remindData, parmaData, "03");
          }
          // this.JCXmodal = !this.JCXmodal;
          await this.Data_Process();
        },
        onCancel: () => {},
      });
    },
    //新增
    handleAdd() {
      this.formItem = {};
      this.JCXmodal = true;
      this.Data_Process();
    },
    //编辑
    handleEdit(row, index) {
      console.log("old", row);
      this.formItem = [];
      this.formItem = row;
      this.oldItem = this.resData[index];
      this.JCXmodal = true;
      this.Data_Process();
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.SaveInfo();
        } else {
          return this.$Notice.warning({
            title: "请完善基本信息！",
          });
        }
      });
    },
    async SaveInfo() {
      this.formItem.StationCode = this.StationCode;

      //编辑保存
      if (this.formItem.CAMID) {
        const params = {
          IDname: "CAMID",
          IDvalue: this.formItem.CAMID,
          tablename: "Cameras",
          datalist: this.formItem,
          StationCode: this.StationCode,
          redis_key: "Cameras",
        };
        if (!this.isOpenAudit) {
          const { state, msg } = await this.$curl.post(
            "api/hj/SetTableRedis",
            params
          );
        } else {
          let remindData = {
            msgChannel: "changeStationAudit",
            msgType: "摄像头信息修改",
            msgTypeCode: "06",
            msgInfo: "",
          };
          let parmaData = {
            oldItem: this.oldItem,
            params: params,
          };
          setRemindAndInsertAudit(this, remindData, parmaData, "02");
        }
      } else {
        //新增保存
        const params = {
          isRedis: true,
          tablename: "Cameras",
          datalist: this.formItem,
          StationCode: this.StationCode,
          redis_key: "Cameras",
        };
        if (!this.isOpenAudit) {
          const { state, msg } = await this.$curl.post(
            "api/hj/AddTableRedis",
            params
          );
        } else {
          let remindData = {
            msgChannel: "changeStationAudit",
            msgType: "摄像头信息新增",
            msgTypeCode: "06",
            msgInfo: "",
          };
          let parmaData = {
            oldItem: null,
            params: params,
          };
          setRemindAndInsertAudit(this, remindData, parmaData, "01");
        }
      }
      this.JCXmodal = !this.JCXmodal;
      await this.Data_Process();
    },
    returncodename(namelist, codevalue) {
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.value == codevalue) CodeName = item.label;
      });
      return CodeName;
    },
    async Data_Process(station) {
      const self = this;
      const tables = [
        {
          tableName: "CD_Position",
          columns: "CodeValue as value,CodeName as label",
          where: "",
        },
      ];
      if (self.$getDBTable) {
        let cdList = tables.map((item) => {
          return item.tableName;
        });
        await self.$getDBTable(cdList).then((data) => {
          let dataList = data.map((v) => JSON.parse(v));
          self.Position = dataList[0];
          self.Position.forEach((item) => {
            item.value = item.CodeValue;
            item.label = item.CodeName;
          });
        });
      } else {
        await getCDData(this, tables).then(function(res) {
          if (res.state) {
            self.Position = res.data[0];
            self.Position.forEach((item) => {
              item.value = item.CodeValue;
              item.label = item.CodeName;
            });
          }
        });
      }

      const params = { stationID: this.StationCode };
      const { state, data, DVRInfo, msg } = await this.$curl.get(
        "api/hj/GetLineByStationCode",
        {
          stationID: this.StationCode,
        }
      );
      if (state) {
        this.DVRInfoList = DVRInfo;
        this.cdLineList = data;
      } else {
        this.$Notice.warning({
          title: msg,
        });
      }
      const Cameras = await this.$curl.get("api/hj/getstationCameras", {
        stationID: this.StationCode,
      });
      if (Cameras.state) {
        this.resData = Cameras.data;
      } else {
        this.$Notice.warning({
          title: Cameras.msg,
        });
      }
    },
  },
  mounted() {
    // this.Data_Process();
    this.getconfig()
  },
  watch: {
    StationCode: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
        // if (this.Permission == false) {
        //   this.columns_Cameras.pop();
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
    }
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
</style>
