<!-- 检测线信息 -->
<template>
  <div>
    <Card :padding="0" :lg="24" class="card_main">
      <Button v-if="Permission" style="position:absolute;top:5px;right: 20px;" type="primary" @click="handleAdd()">新增</Button>
      <div slot="title" style="padding:3px 5px;font-size: 14px;font-weight: 700;">检测线信息</div>
      <Table :columns="columns_line" :data="StationLine" :highlight-row="true" height="530" class="station_tables">
        <template v-if="hasAuthorityEdit" slot="action" slot-scope="{ row, index }">
          <Tooltip placement="bottom" content="编辑">
            <Button type="text" style="" icon="md-open" @click="handleEdit(row, index)"></Button>
          </Tooltip>
          <Tooltip placement="bottom" content="详情" style="">
            <Button type="text" style="" icon="md-more" @click="seeMoreInfo(row, index)"></Button>
          </Tooltip>
          <!-- <Button type="dashed" ghost @click="handleDel(row,index)">删除</Button> -->
        </template>
      </Table>
    </Card>
    <!-- 新增编辑弹窗 -->
    <Modal v-model="FormModel" width="800" :title="FormItem.SceneCode ? FormItem.SceneCode + '号检测线' : '新增检测线'">
      <edit-line-info ref="editLine" @validStatus="funStatus" :LineTypes="lineTypes" :LineStatus="lineStatus" :formItem="FormItem"></edit-line-info>
      <div slot="footer">
        <Button size="large" @click="FormModel = false">取消</Button>
        <Button type="info" size="large" @click="handleSave()">保存</Button>
      </div>
    </Modal>
    <!-- 检测线详细弹窗 -->
    <Modal v-model="SceneInfoModel" footer-hide :title="SceneInfoTitle" fullscreen @on-cancel="closeModal">
      <component v-if="SceneInfoModel" :is="currentComponent" :stationList="stationList" :SceneInfo="SceneInfo" :methodList="methodList" style="width:100%"></component>
    </Modal>
  </div>
</template>
<script>
import {
  getCDData,
  setRemindAndInsertAudit,
  getStationConfig,
} from "../../../utils/utils";
import editLineInfo from "../Model/editLineInfo";
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
      FormModel: false,
      SceneInfoModel:false,
      SceneInfoTitle:'',
      FormItem: {}, //更改后的数据
      oldItem: {}, //更改前选中的数据
      StationLine: [], //检测线列表
      lineTypes: [], //检测线类型
      lineStatus: [], //检测线状态
      stationList:[],
      methodList:[],
      currentComponent:{}, //动态加入的组件
      SceneInfo:{},
      columns_line: [
        {
          title: "序号",
          type: "index",
          width: 70,
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
          title: "检测线类型",
          key: "LineType",
          align: "center",
          render: (h, params) => {
            let date = this.returncodename(this.lineTypes, params.row.LineType);
            return h("div", date);
          },
          minWidth: 120,
          sortable: true,
        },
        {
          title: "状态",
          key: "LineStatus",
          align: "center",
          render: (h, params) => {
            let date = this.returncodename(
              this.lineStatus,
              params.row.LineStatus
            );
            return h("div", date);
          },
          minWidth: 90,
          sortable: true,
        },
        {
          title: "创建日期",
          key: "DateCreated",
          align: "center",
          render: (h, params) => {
            let date = this.$options.filters.dataFormat(
              params.row.DateCreated,
              "yyyy-MM-dd"
            );
            return h("div", date);
          },
          minWidth: 100,
        },
        {
          title: "设备标定有效期",
          key: "ValidPeriod",
          align: "center",
          render: (h, params) => {
            let date = this.$options.filters.dataFormat(
              params.row.ValidPeriod,
              "yyyy-MM-dd"
            );
            return h("div", date);
          },
          minWidth: 120,
        },
        {
          title: "设备厂商",
          key: "LineMANU",
          align: "center",
          ellipsis: true,
          tooltip: true,
          minWidth: 120,
        },
        {
          title: "负责人",
          key: "PersonInCharge",
          align: "center",
          minWidth: 120,
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center",
          fixed: "right",
        },
      ],
      isOpenAudit: false,
      modalWidth:1200,
      isCur: false,
    };
  },
  components: {
    editLineInfo,
  },
  methods: {
    // 关闭模态框
    closeModal(){
      this.currentComponent=null
      this.SceneInfoModel=false
    },
    // 检测线信息查看更多
    seeMoreInfo(row, index){
      this.SceneInfoModel=true
      this.modalWidth=document.body.clientWidth
      let {SceneCode,StationCode} =row
      this.SceneInfo={SceneCode,StationCode}
      this.SceneInfoTitle='详细信息'
      this.SceneInfoTitle=this.returncodename(this.stationList,this.StationCode)+'--'+SceneCode+'--'+this.SceneInfoTitle
      this.currentComponent=async ()=> await import("../lineInfo/lineInfo") 
    },
    async getconfig() {
      this.isOpenAudit = await getStationConfig(this)
    },
    returncodename(namelist, codevalue) {
      //返回字典名称
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName;
      });
      return CodeName;
    },
    handleDel(row, index) {
      let self = this;
      this.$Modal.confirm({
        title: "删除提醒",
        content: "<p>确定要删除该条数据吗？</p>",
        onOk: () => {
          let params = {
            tablename: "LineInfo",
            IDname: "LineInfoID",
            IDvalue: row.LineInfoID,
            stationcode: self.StationCode,
            redis_key: "lineinfo",
          };
          this.$curl
            .post("api/hj/delectTableID", params)
            .then((json) => {
              if (json.state) {
                this.$Notice.success({
                  title: json.msg,
                });
                this.Data_Process();
              }
            })
            .catch((err) => {
              this.$Message.error("删除失败!");
            });
        },
        onCancel: () => { },
      });
    },
    handleAdd() {
      this.FormItem = {};
      this.FormItem.StationCode = this.StationCode;
      this.FormModel = true;
      this.$refs.editLine.judgeDataChange(this.FormItem);
    },
    handleEdit(row, index) {
      this.FormItem = [];
      this.FormItem = Object.assign({}, row);

      this.oldItem = [];
      this.oldItem = Object.assign({}, row);
      this.FormModel = true;
      this.$refs.editLine.judgeDataChange(row);
    },
    async funStatus(status) {
      const self = this;
      //判断是否验证通过
      if (!status) return;

      //判断该检测列表中是否已存在该检测线编号
      if (
        !this.FormItem.LineInfoID ||
        this.oldItem.SceneCode != this.FormItem.SceneCode
      ) {
        const hasData = this.StationLine.find(
          (t) => t.SceneCode == self.FormItem.SceneCode
        );
        if (hasData) {
          this.$Notice.warning({
            title: "提示",
            desc: "检测线编号" + this.FormItem.SceneCode + "已存在",
          });
          return;
        }
      }
      //编辑保存
      if (this.FormItem.DateCreated)
        this.FormItem.DateCreated = this.$options.filters.dataFormat(
          this.FormItem.DateCreated,
          "yyyy-MM-dd"
        );
      if (this.FormItem.ValidPeriod)
        this.FormItem.ValidPeriod = this.$options.filters.dataFormat(
          this.FormItem.ValidPeriod,
          "yyyy-MM-dd"
        );

      let params = {};
      // let resData = {};
      if (this.FormItem.LineInfoID) {
        //编辑
        params = {
          IDname: "LineInfoID",
          IDvalue: this.FormItem.LineInfoID,
          tablename: "LineInfo",
          datalist: this.FormItem,
          StationCode: this.StationCode,
          redis_key: "lineinfo",
        };
        if (!this.isOpenAudit) {
          await this.$curl.post("api/hj/SetTableRedis", params);
        } else {
          let remindData = {
            msgChannel: "changeStationAudit",
            msgType: "检测线信息修改",
            msgTypeCode: "01",
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
        params = {
          isRedis: true,
          tablename: "LineInfo",
          datalist: this.FormItem,
          StationCode: this.StationCode,
          redis_key: "lineinfo",
        };
        if (!this.isOpenAudit) {
          await this.$curl.post("api/hj/AddTableRedis", params);
        } else {
          let remindData = {
            msgChannel: "changeStationAudit",
            msgType: "检测线信息新增",
            msgTypeCode: "01",
            msgInfo: "",
          };
          let parmaData = {
            oldItem: null,
            params: params,
          };
          setRemindAndInsertAudit(this, remindData, parmaData, "01");
        }
      }
      this.FormModel = false; //关闭弹窗
      this.Data_Process();
    },
    handleSave(name) {
      this.$refs.editLine.HandleSubmit("formCustom");
    },
    async Data_Process() {
      let self = this;
      let params = { StationCode: this.StationCode };
      let tables = [
        {
          tableName: "CD_LineStatus",
          columns: "CodeValue,CodeName",
          where: "",
        },
        {
          tableName: "CD_LineType",
          columns: "CodeValue,CodeName",
          where: "",
        },
        {
          tableName: "stationinfo",
          columns: "CodeValue,CodeName",
          where: "",
        },
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName",
          where: "where 1=1 and isAvailable=1",
        },
      ];
      if (self.$getDBTable) {
        let cdList = tables.map((item) => {
          return item.tableName;
        });
        await self.$getDBTable(cdList).then((data) => {
          if(!data&&!data.length){
            this.getCDDatas(this,tables)
          }else{
            data = data.map((v) => JSON.parse(v));
            self.lineStatus = data[0];
            self.lineTypes = data[1];
            self.stationList=data[2]
            self.methodList=data[3]
          }
        });
      } else {
        this.getCDDatas(this,tables)
      }
      const resData = await this.$curl.get("api/hj/getstationLine", {
        StationCode: JSON.stringify([this.StationCode]),
      });
      if (resData.state) {
        this.StationLine = resData.data;
      } else {
        this.$Notice.warning({
          title: "查询失败!",
        });
      }
    },
    async getCDDatas(self,tables){
      await getCDData(self,tables).then(function (res){
        if(res.state) {
          self.lineStatus=res.data[0]
          self.lineTypes=res.data[1]
          self.stationList=res.data[2]
          self.methodList=res.data[3]
        }
      })
    }
  },
  watch: {
    StationCode: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
        // if (newval) {
        //   if (newval !== oldval) {
        //     console.log("lf", this.hasAuthorityEdit);
        //   }
        // }
        if(this.activeStep != this.curIndex) {
          this.isCur = false;
          return;
        } 
        this.isCur = true;
        this.Data_Process();
        // if (this.hasAuthorityEdit == false) {
        //   this.columns_line.pop();
        // }
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
.ivu-tooltip{
  margin-left: 5px
}
</style>
