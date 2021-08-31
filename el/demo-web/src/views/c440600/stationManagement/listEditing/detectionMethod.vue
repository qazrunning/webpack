<!--检测线方法设置 -->
<template>
  <div>
    <Card :padding="0" class="card_main">
      <Button v-if="Permission" style="position:absolute;top:5px;right: 20px;" type="primary" @click="handleadd">新增</Button>
      <div slot="title" style="font-size: 14px;font-weight: 700;">检测线方法设置</div>
      <Table :columns="JCScolumns" :data="JCS_data" height="530" style=" width: 100%;padding: 0px;margin:0px">
        <template slot-scope="{ row, index }" slot="SceneCode">
          <Select v-model="JCsdata.SceneCode" size="large" v-if="tableIndex === index" transfer>
            <Option v-for="item in Scenelist" :value="item.value" :key="item.LineInfoID">{{ item.label }}</Option>
          </Select>
          <span v-else>{{ row.SceneCode }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="InspectionMethod">
          <Select v-model="JCsdata.InspectionMethod" size="large" v-if="tableIndex === index" transfer>
            <Option v-for="(item, index1) in InspectionMethods" :value="item.CodeValue" :key="index1 + '1'">{{ item.CodeName }}</Option>
          </Select>
          <span v-else>
            {{
            returncodename(InspectionMethods, row.InspectionMethod)
            }}
          </span>
        </template>
        <template slot-scope="{ row, index }" slot="IsAvailable">
          <Select v-model="JCsdata.IsAvailable" size="large" v-if="tableIndex === index" transfer>
            <Option v-for="item in start" :value="item.key" :key="item.key">
              {{
              item.value
              }}
            </Option>
          </Select>
          <span v-else>{{ row.IsAvailable ? "启动" : (row.IsAvailable==null ? '' : "不启动") }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <div v-if="tableIndex === index">
            <Tooltip placement="left" content="保存">
              <Button type="info" icon="md-checkmark-circle" @click="handleSave(row, index)">保存</Button>
            </Tooltip>
            <Tooltip placement="left" content="取消">
              <Button type="warning" icon="md-close-circle" @click="handleOut(row)">取消</Button>
            </Tooltip>
          </div>
          <div v-else>
            <Tooltip placement="left" content="编辑">
              <Button v-show="hasAuthorityEdit" type="text" style="width:46px;" icon="md-open" @click="handleEdit(row, index)"></Button>
            </Tooltip>
            <Tooltip placement="left" content="删除">
              <Button v-show="hasAuthorityDel" type="text" style="width:46px;" icon="ios-trash" @click="handleDelete(row, index)"></Button>
            </Tooltip>
          </div>
        </template>
      </Table>
    </Card>
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
    AddLineStauts: {
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
      Scenelist: [],
      // hasAuthority: false,
      InspectionMethods: [],
      tableIndex: -1,
      JCsdata: [], //选中数据源
      FormItem: {}, // 单行数据
      JCS_data: [], //总数据源
      JCScolumns: [
        {
          title: "序号",
          type: "index",
          width: 70,
          align: "center",
        },
        {
          title: "检测线编号",
          align: "center",
          key: "SceneCode",
          slot: "SceneCode",
          minWidth: 100,
          sortable: true,
        },
        {
          title: "检测方法",
          align: "center",
          key: "InspectionMethod",
          slot: "InspectionMethod",
          minWidth: 100,
          sortable: true,
        },
        {
          title: "启动",
          align: "center",
          key: "IsAvailable",
          slot: "IsAvailable",
          minWidth: 100,
          sortable: true,
        },
        {
          title: "操作",
          align: "center",
          width: 200,
          slot: "action",
        },
      ],
      table_height: 70,
      result: false,
      start: [
        {
          key: 0,
          value: "不启动",
        },
        {
          key: 1,
          value: "启动",
        },
      ],
      isOpenAudit: false,
      isCur: false,
    };
  },
  methods: {
    async getconfig() {
      this.isOpenAudit = await getStationConfig(this)
    },
    async handleDelete(row, index) {
      let self = this;
      this.$Modal.confirm({
        title: "删除提醒",
        content: "<p>确定要删除该条数据吗？</p>",
        onOk: async () => {
          const params = {
            tablename: "RL_LineInfo_InspectionMethod",
            IDname: "ID",
            IDvalue: row.ID,
            StationCode: self.StationCode,
            redis_key: "rl_lineinfo_inspectionmethod",
          };
          if (!this.isOpenAudit) {
            await this.$curl.post("api/hj/delectTableID", params);
          } else {
            let remindData = {
              msgChannel: "changeStationAudit",
              msgType: "检测线方法设置删除",
              msgTypeCode: "02",
              msgInfo: "",
            };
            let parmaData = {
              oldItem: row,
              params: params,
            };
            setRemindAndInsertAudit(this, remindData, parmaData, "03");
          }
          this.Data_Process();
        },
        onCancel: () => { },
      });
    },
    handleOut(row) {
      this.tableIndex = -1;
      if (row.ID == "") this.JCS_data.shift();
      this.Data_Process();
    },
    handleadd() {
      //判断是否有存在检测线信息,没有则return
      if (this.Scenelist.length == 0) {
        this.$Notice.warning({
          title: "暂无检测线信息,请先添加;",
        });
        return;
      }
      if (this.tableIndex == 0) return;
      this.JCS_data.unshift({
        ID: "",
        CityCode: this.$store.getters.getCityCode,
        StationCode: this.StationCode,
        SceneCode: "",
        IsAvailable: null,
        InspectionMethod: "",
        IUSTA: "",
      });
      this.JCsdata = this.JCS_data[0];
      this.tableIndex = 0;
    },
    handleEdit(row, index) {
      this.JCsdata = row;
      this.FormItem = this.JCS_data[index];
      this.tableIndex = index;
    },
    async handleSave(row, index) {
      //如无选中检测线,则返回
      let message = "";
      this.result = false;
      if (!row.SceneCode) message += "检测线编号不能为空！<br/>";
      if (!row.InspectionMethod) message += "检测方法不能为空！<br/>";

      //保存检测方法设置
      if (this.JCsdata.ID == "") {
        let arr = this.JCS_data.slice(1);
        arr.forEach((v) => {
          if (
            v.SceneCode == row.SceneCode &&
            v.InspectionMethod == row.InspectionMethod &&
            v.IsAvailable == row.IsAvailable
          )
            this.result = !this.result;
        });
        if (this.result) message += "该检测线编号已有相同方法存在<br/>";
        if (message != "") {
          this.$Notice.warning({
            title: message,
          });
          message = "";
          return;
        }
        let params = {
          datalist: this.JCsdata,
          StationCode: this.StationCode,
        };

        if (!this.isOpenAudit) {
          await this.$curl.post("api/hj/ADDInspectionMethod", params);
        } else {
          let remindData = {
            msgChannel: "changeStationAudit",
            msgType: "检测线方法设置新增",
            msgTypeCode: "02",
            msgInfo: "",
          };
          let parmaData = {
            oldItem: null,
            params: params,
          };
          setRemindAndInsertAudit(this, remindData, parmaData, "01");
        }
      } else {
        let data = this.JCS_data || [];
        data.forEach((v) => {
          if (
            v.SceneCode == row.SceneCode &&
            v.InspectionMethod == row.InspectionMethod &&
            v.IsAvailable == row.IsAvailable
          )
            this.result = !this.result;
        });
        if (this.result) message += "该检测线编号已有相同方法存在<br/>";
        if (message != "") {
          this.$Notice.warning({
            title: message,
          });
          message = "";
          return;
        }
        let params = {
          datalist: this.JCsdata,
          StationCode: this.StationCode,
        };
        if (!this.isOpenAudit) {
          const resData = await this.$curl.post(
            "api/hj/SETInspectionMethod",
            params
          );
        } else {
          let remindData = {
            msgChannel: "changeStationAudit",
            msgType: "检测线方法设置编辑",
            msgTypeCode: "02",
            msgInfo: "",
          };
          let parmaData = {
            oldItem: this.FormItem,
            params: params,
          };
          setRemindAndInsertAudit(this, remindData, parmaData, "02");
        }
      }
      this.tableIndex = -1;
      if (row.ID == "") this.JCS_data.shift();
      this.Data_Process();
    },
    returncodename(namelist, codevalue) {
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName;
      });
      return CodeName;
    },
    async Data_Process(station) {
      let list = [
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
      ];
      let result = [];
      if (this.$getDBTable) {
        let cdList = list.map((item) => item.tableName);
        await this.$getDBTable(cdList).then((data) => {
          result = data.map((v, index) => {
            return JSON.parse(v).filter((e) => e.IsAvailable == 1);
          });
          result = result[0];
        });
      } else {
        await getCDData(this, list).then((res) => {
          if (res.state == 1) {
            result = res.data;
            result = res.data.filter((v) => v.IsAvailable == 1);
          }
        });
      }

      let params = { stationID: this.StationCode };
      let datalist = await this.$curl.get("api/hj/GetInspectionMethod", {
        stationID: this.StationCode,
      });
      let { data } = await this.$curl.get("api/hj/GetLineByStationCode", {
        stationID: this.StationCode,
      });

      this.Scenelist = data;
      // this.InspectionMethods = datalist.cddata;
      this.InspectionMethods = result;
      this.JCS_data = datalist.data;
      if (this.JCS_data.length > 0) {
        this.table_height = 50 + this.JCS_data.length * 48;
        if (this.table_height > 330) {
          this.table_height = 330;
        }
      }
    },
    mounted() {
      this.Data_Process();
    },
  },
  watch: {
    StationCode: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
        // if (this.hasAuthorityEdit == false && this.hasAuthorityDel == false) {
        //   this.JCScolumns.pop();
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
    AddLineStauts: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
        this.Data_Process();
        if (this.hasAuthorityEdit == false && this.hasAuthorityDel == false) {
          this.JCScolumns.pop();
        }
      },
      immediate: true,
    },
  },
  mounted() {
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
</style>
