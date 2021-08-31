<!--硬盘录像机信息 -->
<template>
  <div style="height:100%">
    <div
      style="padding: 10px;display:flex;justify-content:space-between;margin-bottom:10px;"
      class="fx__box"
    >
      <span style="font-size: 14px; font-weight: 700;padding-top:3px;">硬盘录像机信息</span>
      <Button
        v-show="Permission"
        type="primary"
        @click="handleAdd()"
      >新增</Button>
    </div>
    <div style="height: calc(100% - 62px);overflow:hidden auto">
      <div
        v-for="(item, index) in formItem"
        :key="index"
        class="fx__box"
        style="margin-bottom:10px;"
      >
        <row style="padding:2px 0 0 0;">
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机登入名：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >{{
            item.LoginName ? item.LoginName : "暂无"
          }}</i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >Ocx插件端口：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >{{
            item.OcxPort ? item.OcxPort : "暂无"
          }}</i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机显示名：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >
            <Tooltip
              :content="item.DVRName"
              theme="light"
            >{{
              item.DVRName
                ? item.DVRName.length > 10
                  ? item.DVRName.substring(0, 10) + ".."
                  : item.DVRName
                : "暂无"
            }}</Tooltip>
          </i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >web插件端口：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >{{
            item.WebPort ? item.WebPort : "暂无"
          }}</i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机IP地址：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >{{
            item.IP ? item.IP : "暂无"
          }}</i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机映射IP地址：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >{{
            item.MapIP ? item.MapIP : "暂无"
          }}</i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机端口：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >{{
            item.Port ? item.Port : "暂无"
          }}</i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机驱动：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >
            <Tooltip
              :content="item.Drive"
              theme="light"
            >{{
              item.Drive
                ? item.Drive.length > 10
                  ? item.Drive.substring(0, 10) + ".."
                  : item.Drive
                : "暂无"
            }}</Tooltip>
          </i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机登入密码：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >{{
            item.LoginPassword ? item.LoginPassword : "暂无"
          }}</i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机品牌：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >{{
            item.Tag | tagFilter
          }}</i-col>
          <i-col
            :lg="7"
            :md="7"
            style="text-align:right;padding-bottom: 8px;"
          >硬盘录像机型号：</i-col>
          <i-col
            :lg="5"
            :md="5"
            style="text-align:left"
          >
            <Tooltip
              :content="item.Model"
              theme="light"
            >{{
              item.Model
                ? item.Model.length > 10
                  ? item.Model.substring(0, 10) + ".."
                  : item.Model
                : "暂无"
            }}</Tooltip>
          </i-col>
        </row>

        <row v-if="hasAuthorityEdit">
          <i-col
            :lg="24"
            :md="24"
            style="text-align:center;margin-bottom:10px;border:1px solid black;padding:10px 0;cursor: pointer;"
            class="fx__border"
            @click.native="handleEdit(item)"
          >
            <a
              style="display:block;"
              @click="handleEdit(item)"
            >编辑</a>
          </i-col>
        </row>
      </div>
    </div>

    <div
      v-if="formItem.length != 0"
      :lg="24"
      v-bind:class="[Permission ? 'station_card1' : 'station_card2']"
    ></div>
    <div
      v-else
      class="station_card_man"
      style="height:230px;text-align:center;line-height:210px;"
    >
      <div
        style="cursor: pointer;"
        @click="handleAdd()"
      >
        <Icon
          type="ios-add"
          size="100"
        />
      </div>
    </div>

    <!-- 弹窗 -->
    <Modal
      v-model="JCXmodal"
      width="800"
      :title="
        obj.DVRName ? '硬盘录像机：' + obj.DVRName + '信息' : '新增摄像头'
      "
    >
      <Form
        ref="formCustom"
        :model="obj"
        :rules="ruleValidate"
        :label-width="isPc ? 110 : null"
        :label-position="isPc ? 'right' : 'top'"
      >
        <Row :gutter="16">
          <Col span="12">
          <FormItem
            label="登入名："
            prop="LoginName"
          >
            <i-input
              v-model="obj.LoginName"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          <FormItem
            label="登入密码："
            prop="LoginPassword"
          >
            <i-input
              v-model="obj.LoginPassword"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          <FormItem
            label="显示名："
            prop="DVRName"
          >
            <i-input
              v-model="obj.DVRName"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          <FormItem
            label="型号："
            prop="Model"
          >
            <i-input
              v-model="obj.Model"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          <FormItem
            label="IP地址："
            prop="IP"
          >
            <i-input
              v-model="obj.IP"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          <FormItem label="web插件端口：">
            <i-input
              v-model="obj.WebPort"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem
            label="映射IP地址："
            prop="MapIP"
          >
            <i-input
              v-model="obj.MapIP"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          <FormItem
            label="端口："
            prop="Port"
          >
            <i-input
              v-model="obj.Port"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          <FormItem
            label="品牌："
          >
            <Select
              style="width:100%"
              v-model="obj.Tag"
              clearable
            >
              <Option
                v-for="item in tagList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="驱动：">
            <i-input
              v-model="obj.Drive"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          <FormItem label="Ocx插件端口：">
            <i-input
              v-model="obj.OcxPort"
              placeholder="请输入"
              clearable
            ></i-input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button
          size="large"
          @click="JCXmodal = false"
        >取消</Button>
        <Button
          type="info"
          size="large"
          @click="handleSubmit('formCustom')"
        >保存</Button>
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
      tagList: [
        { value: '1', label: '海康威视' },
        { value: '2', label: '大华' },
      ],
      isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
      JCXmodal: false,
      formItem: [],
      oldItem: {},
      obj: {},
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      ruleValidate: {
        LoginName: [
          { required: true, message: "登入名不能为空", trigger: "blur" },
        ],
        LoginPassword: [
          { required: true, message: "登入密码不能为空", trigger: "blur" },
        ],
        DVRName: [
          { required: true, message: "显示名不能为空", trigger: "blur" },
        ],
        Model: [{ required: true, message: "型号不能为空", trigger: "blur" }],
        IP: [{ required: true, message: "IP地址不能为空", trigger: "blur" }],
        MapIP: [
          { required: true, message: "映射IP地址不能为空", trigger: "blur" },
        ],
        Port: [{ required: true, message: "端口不能为空", trigger: "blur" }],
      },
      isOpenAudit: false,
      isCur: false,
    };
  },
  filters:{
    tagFilter(value){
      if(value == '1') return '海康威视';
      else if(value == '2') return '大华';
      else return '暂无';
    }
  },
  methods: {
    async getconfig() {
      this.isOpenAudit = await getStationConfig(this)
    },
    async handleDel(row) {
      const self = this;
      this.$Modal.confirm({
        title: "删除提醒",
        content: "<p>确定要删除该条数据吗？</p>",
        onOk: async () => {
          const params = {
            tablename: "DVRInfo",
            IDname: "DVRID",
            IDvalue: row.DVRID,
            StationCode: self.StationCode,
            redis_key: "dvrinfo",
          };
          if (!this.isOpenAudit) {
            await this.$curl.post("api/hj/delectTableID", params);
          } else {
            let remindData = {
              msgChannel: "changeStationAudit",
              msgType: "硬盘录像机信息删除",
              msgTypeCode: "05",
              msgInfo: "",
            };
            let parmaData = {
              oldItem: row,
              params: params,
            };
            setRemindAndInsertAudit(this, remindData, parmaData, "03");
          }
          await this.Data_Process();
        },
        onCancel: () => { },
      });
    },
    handleAdd() {
      if (this.Permission) {
        this.JCXmodal = true;
        this.obj = {};
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "对不起，你没有该权限！",
        });
      }
    },
    handleEdit(obj) {
      this.oldItem = obj;
      this.JCXmodal = true;
      this.obj = Object.assign({}, obj);
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
      //编辑保存
      if (this.obj.DVRID) {
        const params = {
          IDname: "DVRID",
          IDvalue: this.obj.DVRID,
          tablename: "DVRInfo",
          datalist: this.obj,
          StationCode: this.StationCode,
          redis_key: "dvrinfo",
        };
        if (!this.isOpenAudit) {
          const { state, msg } = await this.$curl.post(
            "api/hj/SetTableRedis",
            params
          );
        } else {
          let remindData = {
            msgChannel: "changeStationAudit",
            msgType: "硬盘录像机信息修改",
            msgTypeCode: "05",
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
          tablename: "DVRInfo",
          datalist: this.obj,
          StationCode: this.StationCode,
          redis_key: "dvrinfo",
        };
        if (!this.isOpenAudit) {
          const { state, msg } = await this.$curl.post(
            "api/hj/AddTableRedis",
            params
          );
        } else {
          let remindData = {
            msgChannel: "changeStationAudit",
            msgType: "硬盘录像机信息修改",
            msgTypeCode: "05",
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
    async Data_Process(station) {
      const self = this;
      const params = { stationID: this.StationCode };
      const { state, msg, data } = await this.$curl.get("api/hj/GetDVRInfo", {
        stationID: this.StationCode,
      });
      if (state) {
        this.formItem = [];
        if (data) this.formItem = data;
      } else {
        this.$Notice.warning({
          title: msg,
        });
      }
    },
  },
  watch: {
    StationCode: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
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
    this.getconfig()
  },
};
</script>
<style scoped>
.station_card_man /deep/ .ivu-card-head {
  padding: 2px 16px;
}
.station_card_man /deep/ .ivu-btn-ghost.ivu-btn-dashed,
.ivu-btn-ghost.ivu-btn-default {
  color: #747b8b;
  border-color: #e3e5e8;
}
.station_card1 {
  /* height: 100%; */
}
.station_card2 {
  /* height: 100%; */
  line-height: 28px;
  padding-top: 10px;
}
</style>
